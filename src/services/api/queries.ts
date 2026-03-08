import { queryOptions } from '@tanstack/react-query'
import type { StatsRegion, StatsTimespan, PlayerTimespan, MatchListQuery, EventsQuery } from './types'
import {
  getPlayerStats,
  getMatches,
  getMatchDetails,
  getRankings,
  getEvents,
  getEventMatches,
  getPlayerProfile,
  getPlayerMatches,
  getTeamProfile,
  getNews,
} from './endpoints'
import {
  mapPlayerStats,
  mapMatchOverview,
  mapMatchDetail,
  mapRanking,
  mapEvent,
  mapEventMatch,
  mapPlayerProfile,
  mapPlayerMatch,
  mapTeamProfile,
} from './mappers'

// TanStack Query staleTime values — client-side cache layer on top of
// the server-side in-memory cache in client.ts. Keeps the UI fresh
// without refetching on every component mount.
const STALE = {
  LIVE: 15_000,         // 15s — live scores
  SHORT: 2 * 60_000,    // 2 min
  MEDIUM: 5 * 60_000,   // 5 min
  STATS: 15 * 60_000,   // 15 min
  LONG: 30 * 60_000,    // 30 min
  DIRECTORY: 60 * 60_000, // 1 hr — pre-fetched directories
} as const

// ── Player stats ────────────────────────────────────────────────────
export function playerStatsQuery(region: StatsRegion, timespan: StatsTimespan = '30') {
  return queryOptions({
    queryKey: ['stats', region, timespan],
    queryFn: async () => {
      const raw = await getPlayerStats(region, timespan)
      return raw.map(mapPlayerStats)
    },
    staleTime: STALE.STATS,
  })
}

// ── Matches list ────────────────────────────────────────────────────
export function matchListQuery(q: MatchListQuery) {
  return queryOptions({
    queryKey: ['matches', q],
    queryFn: async () => {
      const raw = await getMatches({ q })
      return raw.map(mapMatchOverview)
    },
    staleTime: q === 'live_score' ? STALE.LIVE : STALE.SHORT,
    refetchInterval: q === 'live_score' ? STALE.LIVE : false,
  })
}

// ── Match details ───────────────────────────────────────────────────
export function matchDetailQuery(matchId: string) {
  return queryOptions({
    queryKey: ['match', matchId],
    queryFn: async () => {
      const raw = await getMatchDetails(matchId)
      return mapMatchDetail(raw)
    },
    staleTime: STALE.SHORT,
    enabled: !!matchId,
  })
}

// ── Rankings ────────────────────────────────────────────────────────
export function rankingsQuery(region: StatsRegion) {
  return queryOptions({
    queryKey: ['rankings', region],
    queryFn: async () => {
      const raw = await getRankings(region)
      return raw.map(mapRanking)
    },
    staleTime: STALE.LONG,
  })
}

// ── Events ──────────────────────────────────────────────────────────
export function eventsQuery(q?: EventsQuery) {
  return queryOptions({
    queryKey: ['events', q ?? 'all'],
    queryFn: async () => {
      const raw = await getEvents(q ? { q } : undefined)
      return raw.map(mapEvent)
    },
    staleTime: STALE.STATS,
  })
}

// ── Event matches ───────────────────────────────────────────────────
export function eventMatchesQuery(eventId: string) {
  return queryOptions({
    queryKey: ['eventMatches', eventId],
    queryFn: async () => {
      const raw = await getEventMatches(eventId)
      return raw.map(mapEventMatch)
    },
    staleTime: STALE.SHORT,
    enabled: !!eventId,
  })
}

// ── Player profile ──────────────────────────────────────────────────
export function playerProfileQuery(id: string, timespan?: PlayerTimespan) {
  return queryOptions({
    queryKey: ['player', id, timespan ?? 'default'],
    queryFn: async () => {
      const raw = await getPlayerProfile(id, timespan)
      return mapPlayerProfile(raw)
    },
    staleTime: STALE.STATS,
    enabled: !!id,
  })
}

// ── Player match history ────────────────────────────────────────────
export function playerMatchesQuery(id: string, page?: number) {
  return queryOptions({
    queryKey: ['playerMatches', id, page ?? 1],
    queryFn: async () => {
      const raw = await getPlayerMatches(id, page)
      return raw.map(mapPlayerMatch)
    },
    staleTime: STALE.MEDIUM,
    enabled: !!id,
  })
}

// ── Team profile ────────────────────────────────────────────────────
export function teamProfileQuery(id: string) {
  return queryOptions({
    queryKey: ['team', id],
    queryFn: async () => {
      const raw = await getTeamProfile(id)
      return mapTeamProfile(raw)
    },
    staleTime: STALE.STATS,
    enabled: !!id,
  })
}

// ── News ────────────────────────────────────────────────────────────
export function newsQuery() {
  return queryOptions({
    queryKey: ['news'],
    queryFn: getNews,
    staleTime: STALE.MEDIUM,
  })
}

// ── Pre-fetch helpers ───────────────────────────────────────────────
// Call these from route loaders or app initialization to warm the cache.
import type { QueryClient } from '@tanstack/react-query'

const ALL_STATS_REGIONS: StatsRegion[] = ['na', 'eu', 'ap', 'kr', 'jp', 'br', 'latam']

export async function prefetchPlayerDirectory(qc: QueryClient) {
  await Promise.all(
    ALL_STATS_REGIONS.map((region) =>
      qc.prefetchQuery(playerStatsQuery(region, '30')),
    ),
  )
}

export async function prefetchTeamDirectory(qc: QueryClient) {
  await Promise.all(
    ALL_STATS_REGIONS.map((region) =>
      qc.prefetchQuery(rankingsQuery(region)),
    ),
  )
}

export async function prefetchDirectories(qc: QueryClient) {
  await Promise.all([
    prefetchPlayerDirectory(qc),
    prefetchTeamDirectory(qc),
  ])
}
