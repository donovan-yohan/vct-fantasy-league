// Low-level client
export { apiGet } from './client'

// Cache management
export { invalidateCache, cacheSize } from './cache'

// Typed endpoint functions
export {
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

// TanStack Query options factories
export {
  playerStatsQuery,
  matchListQuery,
  matchDetailQuery,
  rankingsQuery,
  eventsQuery,
  eventMatchesQuery,
  playerProfileQuery,
  playerMatchesQuery,
  teamProfileQuery,
  newsQuery,
  prefetchPlayerDirectory,
  prefetchTeamDirectory,
  prefetchDirectories,
} from './queries'

// Mappers (for use outside query hooks)
export {
  mapPlayerStats,
  mapPlayerProfile,
  mapPlayerMatch,
  mapTeamProfile,
  mapRanking,
  mapEvent,
  mapEventMatch,
  mapMatchOverview,
  mapMatchDetail,
} from './mappers'

// API response types
export type {
  ApiResponse,
  StatsRegion,
  StatsTimespan,
  PlayerTimespan,
  MatchListQuery,
  EventsQuery,
  PlayerStatsSegment,
  MatchListSegment,
  MatchDetailSegment,
  RankingSegment,
  EventSegment,
  EventMatchSegment,
  PlayerProfileSegment,
  PlayerMatchSegment,
  TeamProfileSegment,
  NewsSegment,
} from './types'
