import { apiGet } from './client'
import type {
  ApiResponse,
  EventMatchSegment,
  EventSegment,
  EventsQuery,
  MatchDetailSegment,
  MatchListQuery,
  MatchListSegment,
  NewsSegment,
  PlayerMatchSegment,
  PlayerProfileSegment,
  PlayerStatsSegment,
  PlayerTimespan,
  RankingSegment,
  StatsRegion,
  StatsTimespan,
  TeamProfileSegment,
} from './types'

// Cache TTLs (milliseconds) — aligned with upstream API caching
const TTL = {
  LIVE: 30_000,         // 30 seconds for live data
  SHORT: 5 * 60_000,    // 5 minutes
  MEDIUM: 10 * 60_000,  // 10 minutes
  STATS: 30 * 60_000,   // 30 minutes
  LONG: 60 * 60_000,    // 1 hour
} as const

// ── Player stats ────────────────────────────────────────────────────
export async function getPlayerStats(
  region: StatsRegion,
  timespan: StatsTimespan = '30',
): Promise<PlayerStatsSegment[]> {
  const res = await apiGet<ApiResponse<PlayerStatsSegment>>(
    `/v2/stats?region=${region}&timespan=${timespan}`,
    TTL.STATS,
  )
  return res.data.segments
}

// ── Matches list ────────────────────────────────────────────────────
export interface MatchListParams {
  q: MatchListQuery
  numPages?: number
  fromPage?: number
  toPage?: number
}

export async function getMatches(params: MatchListParams): Promise<MatchListSegment[]> {
  const qs = new URLSearchParams({ q: params.q })
  if (params.numPages) qs.set('num_pages', String(params.numPages))
  if (params.fromPage) qs.set('from_page', String(params.fromPage))
  if (params.toPage) qs.set('to_page', String(params.toPage))

  const ttl = params.q === 'live_score' ? TTL.LIVE : TTL.SHORT
  const res = await apiGet<ApiResponse<MatchListSegment>>(`/v2/match?${qs}`, ttl)
  return res.data.segments
}

// ── Match details ───────────────────────────────────────────────────
export async function getMatchDetails(matchId: string): Promise<MatchDetailSegment> {
  const res = await apiGet<ApiResponse<MatchDetailSegment>>(
    `/v2/match/details?match_id=${matchId}`,
    TTL.SHORT,
  )
  return res.data.segments[0]
}

// ── Rankings ────────────────────────────────────────────────────────
export async function getRankings(region: StatsRegion): Promise<RankingSegment[]> {
  const res = await apiGet<ApiResponse<RankingSegment>>(
    `/v2/rankings?region=${region}`,
    TTL.LONG,
  )
  return res.data.segments
}

// ── Events ──────────────────────────────────────────────────────────
export interface EventsParams {
  q?: EventsQuery
  page?: number
}

export async function getEvents(params?: EventsParams): Promise<EventSegment[]> {
  const qs = new URLSearchParams()
  if (params?.q) qs.set('q', params.q)
  if (params?.page) qs.set('page', String(params.page))
  const query = qs.toString()

  const res = await apiGet<ApiResponse<EventSegment>>(
    `/v2/events${query ? `?${query}` : ''}`,
    TTL.STATS,
  )
  return res.data.segments
}

// ── Player profile ──────────────────────────────────────────────────
export async function getPlayerProfile(
  id: string,
  timespan?: PlayerTimespan,
): Promise<PlayerProfileSegment> {
  const qs = new URLSearchParams({ id })
  if (timespan) qs.set('timespan', timespan)

  const res = await apiGet<ApiResponse<PlayerProfileSegment>>(
    `/v2/player?${qs}`,
    TTL.STATS,
  )
  return res.data.segments[0]
}

// ── Player match history ────────────────────────────────────────────
export async function getPlayerMatches(
  id: string,
  page?: number,
): Promise<PlayerMatchSegment[]> {
  const qs = new URLSearchParams({ id })
  if (page) qs.set('page', String(page))

  const res = await apiGet<ApiResponse<PlayerMatchSegment>>(
    `/v2/player/matches?${qs}`,
    TTL.MEDIUM,
  )
  return res.data.segments
}

// ── Team profile ────────────────────────────────────────────────────
export async function getTeamProfile(id: string): Promise<TeamProfileSegment> {
  const res = await apiGet<ApiResponse<TeamProfileSegment>>(
    `/v2/team?id=${encodeURIComponent(id)}`,
    TTL.STATS,
  )
  return res.data.segments[0]
}

// ── Event matches ───────────────────────────────────────────────────
export async function getEventMatches(eventId: string): Promise<EventMatchSegment[]> {
  const res = await apiGet<ApiResponse<EventMatchSegment>>(
    `/v2/events/matches?event_id=${encodeURIComponent(eventId)}`,
    TTL.SHORT,
  )
  return res.data.segments
}

// ── News ────────────────────────────────────────────────────────────
export async function getNews(): Promise<NewsSegment[]> {
  const res = await apiGet<ApiResponse<NewsSegment>>('/v2/news', TTL.MEDIUM)
  return res.data.segments
}
