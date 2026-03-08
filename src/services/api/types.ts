// ── Shared wrapper ──────────────────────────────────────────────────
export interface ApiResponse<T> {
  status: string
  data: {
    status: number
    segments: T[]
  }
}

// ── /v2/stats ───────────────────────────────────────────────────────
export type StatsRegion = 'na' | 'eu' | 'ap' | 'kr' | 'jp' | 'br' | 'latam' | 'oce' | 'mn' | 'gc' | 'cn'
export type StatsTimespan = '30' | '60' | '90' | 'all'

export interface PlayerStatsSegment {
  player: string
  org: string
  agents: string[]
  rounds_played: string
  rating: string
  average_combat_score: string
  kill_deaths: string
  kill_assists_survived_traded: string
  average_damage_per_round: string
  kills_per_round: string
  assists_per_round: string
  first_kills_per_round: string
  first_deaths_per_round: string
  headshot_percentage: string
  clutch_success_percentage: string
}

// ── /v2/match (list) ────────────────────────────────────────────────
export type MatchListQuery = 'upcoming' | 'upcoming_extended' | 'live_score' | 'results'

export interface MatchListSegment {
  team1: string
  team2: string
  score1: string
  score2: string
  flag1: string
  flag2: string
  time_until_match?: string
  time_completed?: string
  round_info: string
  tournament_name: string
  match_page: string
  tournament_icon: string
  page_number: number
}

// ── /v2/match/details ───────────────────────────────────────────────
export interface MatchDetailTeam {
  name: string
  tag: string
  logo: string
  score: string
  is_winner: boolean
}

export interface MatchDetailPlayer {
  name: string
  agent: string
  rating: string
  acs: string
  kills: string
  deaths: string
  assists: string
  kd_diff: string
  kast: string
  adr: string
  hs_pct: string
  fk: string
  fd: string
  fk_diff: string
}

export interface MatchDetailMap {
  map_name: string
  picked_by: string
  duration: string
  score: { team1: number; team2: number }
  score_ct: { team1: string; team2: string }
  score_t: { team1: string; team2: string }
  score_ot: { team1: string; team2: string }
  players: {
    team1: MatchDetailPlayer[]
    team2: MatchDetailPlayer[]
  }
}

export interface MatchDetailStream {
  name: string
  url: string
}

export interface MatchDetailVod {
  name: string
  url: string
}

export interface MatchDetailSegment {
  match_id: string
  event: {
    name: string
    series: string
    logo: string
  }
  date: string
  patch: string
  status: string
  teams: MatchDetailTeam[]
  streams: MatchDetailStream[]
  vods: MatchDetailVod[]
  maps: MatchDetailMap[]
}

// ── /v2/rankings ────────────────────────────────────────────────────
export interface RankingSegment {
  rank: string
  team: string
  country: string
  last_played: string
  last_played_team: string
  last_played_team_logo: string
  record: string
  earnings: string
  logo: string
}

// ── /v2/events ──────────────────────────────────────────────────────
export type EventsQuery = 'upcoming' | 'completed'

export interface EventSegment {
  title: string
  status: string
  prize: string
  dates: string
  region: string
  thumb: string
  url_path: string
}

// ── /v2/player ──────────────────────────────────────────────────────
export type PlayerTimespan = '30d' | '60d' | '90d' | 'all'

export interface PlayerSocialLink {
  platform: string
  url: string
}

export interface PlayerTeamInfo {
  name: string
  tag: string
  logo: string
  joined?: string
  dates?: string
}

export interface PlayerAgentStat {
  agent: string
  usage: string
  rounds: string
  rating: string
  acs: string
  kd: string
  adr: string
  kast: string
  kpr: string
  apr: string
  fkpr: string
  fdpr: string
  kills: string
  deaths: string
  assists: string
  first_kills: string
  first_deaths: string
}

export interface PlayerEventPlacement {
  event: string
  series: string
  placement: string
  prize: string
  team?: string
  date: string
  url: string
}

export interface PlayerProfileSegment {
  id: string
  name: string
  real_name: string
  avatar: string
  country: string
  social_links: PlayerSocialLink[]
  current_team: PlayerTeamInfo
  past_teams: PlayerTeamInfo[]
  agent_stats: PlayerAgentStat[]
  event_placements: PlayerEventPlacement[]
}

// ── /v2/player/matches ──────────────────────────────────────────────
export interface PlayerMatchTeam {
  name: string
  tag: string
  logo: string
}

export interface PlayerMatchSegment {
  match_id: string
  url: string
  event: string
  date: string
  team1: PlayerMatchTeam
  team2: PlayerMatchTeam
  score: string
  result: string
}

// ── /v2/team ────────────────────────────────────────────────────────
export interface TeamRosterMember {
  id: string
  url: string
  alias: string
  real_name: string
  avatar: string
  country: string
  is_captain: boolean
  role: string
  is_staff: boolean
}

export interface TeamRating {
  rank: string
  rating: string
  peak_rating: string
  streak: string
}

export interface TeamProfileSegment {
  id: string
  name: string
  tag: string
  successor: string
  logo: string
  country: string
  country_name: string
  description: string
  social_links: PlayerSocialLink[]
  rating: TeamRating
  roster: TeamRosterMember[]
  event_placements: PlayerEventPlacement[]
}

// ── /v2/events/matches ──────────────────────────────────────────────
export interface EventMatchTeam {
  name: string
  score: string
  is_winner: boolean
}

export interface EventMatchVod {
  label: string
  url: string
}

export interface EventMatchSegment {
  match_id: string
  url: string
  date: string
  status: string
  note: string
  event_series: string
  team1: EventMatchTeam
  team2: EventMatchTeam
  vods: EventMatchVod[]
}

// ── /v2/news ────────────────────────────────────────────────────────
export interface NewsSegment {
  title: string
  description: string
  date: string
  author: string
  url_path: string
}
