// VCT regions that participate in tournaments
export type VCTRegion = 'americas' | 'emea' | 'pacific' | 'china'

// VCT season event types in chronological order
export type VCTEventType = 'kickoff' | 'masters' | 'league_stage' | 'champions'

// Whether an event is regional (league-specific) or international
export type VCTEventScope = 'regional' | 'international'

export interface VCTSeason {
  year: number
  events: VCTSeasonEvent[]
}

export interface VCTSeasonEvent {
  id: string
  name: string
  type: VCTEventType
  scope: VCTEventScope
  regions: VCTRegion[]
  status: 'upcoming' | 'ongoing' | 'completed'
  startDate: string | null
  endDate: string | null
  vlrEventIds: string[] // mapped vlr.gg event IDs (one per region for regional events)
}

// Tracks which real teams have been eliminated from a tournament
export interface EliminatedTeam {
  teamName: string
  teamTag: string
  eventId: string
  eliminatedAt: string // ISO date
  eliminationRound: string
}

// Roster lock state for fantasy leagues around match days
export type RosterLockReason = 'match_day' | 'tournament_active' | 'manual'

export interface RosterLockState {
  locked: boolean
  reason: RosterLockReason | null
  lockedAt: string | null
  unlocksAt: string | null
  activeEventId: string | null
}

// Leaderboard snapshot before a reset
export interface LeaderboardSnapshot {
  id: string
  eventId: string
  eventName: string
  eventType: VCTEventType
  snapshotDate: string
  standings: LeaderboardEntry[]
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  totalPoints: number
}

// Tournament tracking state for a fantasy league
export interface TournamentTrackingState {
  currentSeason: VCTSeason
  activeEvents: VCTSeasonEvent[]
  eliminatedTeams: EliminatedTeam[]
  rosterLock: RosterLockState
  leaderboardSnapshots: LeaderboardSnapshot[]
}
