import type { Tournament, TournamentMatch } from '~/models'
import { getEvents, getEventMatches } from '~/services/api'
import { mapEvent, mapEventMatch } from '~/services/api'
import type {
  VCTSeason,
  VCTSeasonEvent,
  EliminatedTeam,
  TournamentTrackingState,
} from './types'
import { buildSeasonEvent, buildSeason, isVCTEvent } from './season'
import { createRosterLockState, checkMatchDayLock } from './roster-lock'

// In-memory state — will be replaced with persistent storage when backend is added
let trackingState: TournamentTrackingState | null = null

export async function initTournamentTracker(): Promise<TournamentTrackingState> {
  const currentYear = new Date().getFullYear()
  const season = await fetchCurrentSeason(currentYear)
  const activeEvents = season.events.filter((e) => e.status === 'ongoing')
  const eliminatedTeams = await detectEliminatedTeams(activeEvents)

  // Check if any active event has matches today
  const rosterLock = activeEvents.length > 0
    ? await checkMatchDayLock(activeEvents)
    : createRosterLockState()

  trackingState = {
    currentSeason: season,
    activeEvents,
    eliminatedTeams,
    rosterLock,
    leaderboardSnapshots: [],
  }
  return trackingState
}

export function getTrackingState(): TournamentTrackingState | null {
  return trackingState
}

export async function refreshTrackingState(): Promise<TournamentTrackingState> {
  return initTournamentTracker()
}

async function fetchCurrentSeason(year: number): Promise<VCTSeason> {
  // Fetch both ongoing and upcoming events
  const [ongoingRaw, upcomingRaw, completedRaw] = await Promise.all([
    getEvents({ q: undefined }).catch(() => []),
    getEvents({ q: 'upcoming' }).catch(() => []),
    getEvents({ q: 'completed' }).catch(() => []),
  ])

  const allRaw = [...ongoingRaw, ...upcomingRaw, ...completedRaw]
  const mapped = allRaw.map(mapEvent)

  // Filter for VCT events in current year and deduplicate
  const seen = new Set<string>()
  const seasonEvents: VCTSeasonEvent[] = []

  for (const tournament of mapped) {
    if (seen.has(tournament.vlrId)) continue
    seen.add(tournament.vlrId)

    const event = buildSeasonEvent({
      vlrId: tournament.vlrId,
      title: tournament.title,
      status: tournament.status,
      dates: tournament.dates,
      region: tournament.region,
    })
    if (event) {
      seasonEvents.push(event)
    }
  }

  return buildSeason(year, seasonEvents)
}

async function detectEliminatedTeams(
  activeEvents: VCTSeasonEvent[],
): Promise<EliminatedTeam[]> {
  const eliminated: EliminatedTeam[] = []

  for (const event of activeEvents) {
    for (const vlrEventId of event.vlrEventIds) {
      const matches = await getEventMatchesSafe(vlrEventId)
      const completedMatches = matches.filter((m) => m.status === 'completed' || m.team1Won || m.team2Won)

      // Track teams that have lost in elimination rounds
      const eliminationKeywords = ['elimination', 'decider', 'lower final', 'grand final', 'semifinal', 'quarterfinal']
      for (const match of completedMatches) {
        const isEliminationMatch = eliminationKeywords.some((kw) =>
          match.eventSeries.toLowerCase().includes(kw),
        )
        if (!isEliminationMatch) continue

        const loserName = match.team1Won ? match.team2Name : match.team1Name
        const loserTag = loserName // Tag not always available from event matches

        // Don't duplicate entries
        if (eliminated.some((e) => e.teamName === loserName && e.eventId === event.id)) continue

        eliminated.push({
          teamName: loserName,
          teamTag: loserTag,
          eventId: event.id,
          eliminatedAt: match.date,
          eliminationRound: match.eventSeries,
        })
      }
    }
  }

  return eliminated
}

async function getEventMatchesSafe(eventId: string): Promise<TournamentMatch[]> {
  try {
    const raw = await getEventMatches(eventId)
    return raw.map(mapEventMatch)
  } catch {
    return []
  }
}

export function isTeamEliminated(teamName: string, eventId?: string): boolean {
  if (!trackingState) return false
  return trackingState.eliminatedTeams.some(
    (e) => e.teamName.toLowerCase() === teamName.toLowerCase() &&
      (eventId ? e.eventId === eventId : true),
  )
}

export function getEliminatedTeamsForEvent(eventId: string): EliminatedTeam[] {
  if (!trackingState) return []
  return trackingState.eliminatedTeams.filter((e) => e.eventId === eventId)
}

export function getActiveEvents(): VCTSeasonEvent[] {
  return trackingState?.activeEvents ?? []
}

export function getActiveEventsByRegion(region: string): VCTSeasonEvent[] {
  if (!trackingState) return []
  const regionLower = region.toLowerCase()
  return trackingState.activeEvents.filter((e) =>
    e.regions.some((r) => r === regionLower),
  )
}
