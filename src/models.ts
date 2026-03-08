// ============================================================
// Internal Domain Models
// Clean, typed domain objects mapped from vlrggapi responses
// ============================================================

// --- Fantasy-relevant role ---
export type FantasyRole = 'duelist' | 'initiator' | 'controller' | 'sentinel' | 'igl' | 'flex'

// --- Player ---

export interface Player {
  vlrId: string
  name: string
  realName: string
  avatar: string
  country: string
  currentTeamName: string
  currentTeamTag: string
  currentTeamLogo: string
}

export interface PlayerWithStats extends Player {
  agents: string[]
  roundsPlayed: number
  rating: number
  acs: number
  kd: number
  kast: number
  adr: number
  kpr: number
  apr: number
  fkpr: number
  fdpr: number
  hsPercent: number
  clutchPercent: number
}

export interface PlayerMatchHistory {
  matchId: string
  event: string
  date: string
  team1Name: string
  team1Tag: string
  team2Name: string
  team2Tag: string
  score: string
  result: 'win' | 'loss' | 'draw'
}

// --- Team ---

export interface TeamMember {
  vlrId: string
  alias: string
  realName: string
  avatar: string
  country: string
  isCaptain: boolean
  role: string
  isStaff: boolean
}

export interface Team {
  vlrId: string
  name: string
  tag: string
  logo: string
  country: string
  rank: number | null
  rating: number | null
  record: string
  earnings: string
  roster: TeamMember[]
}

// --- Tournament / Event ---

export interface Tournament {
  vlrId: string
  title: string
  status: 'ongoing' | 'upcoming' | 'completed'
  prize: string
  dates: string
  region: string
  thumb: string
  urlPath: string
}

export interface TournamentMatch {
  matchId: string
  date: string
  status: string
  eventSeries: string
  team1Name: string
  team1Score: string
  team1Won: boolean
  team2Name: string
  team2Score: string
  team2Won: boolean
}

// --- Match ---

export interface MatchOverview {
  matchPage: string
  team1: string
  team2: string
  score1: number
  score2: number
  tournamentName: string
  tournamentIcon: string
  roundInfo: string
  timeInfo: string
}

export interface MatchPlayerStat {
  name: string
  agent: string
  rating: number
  acs: number
  kills: number
  deaths: number
  assists: number
  kdDiff: number
  kast: number
  adr: number
  hsPercent: number
  firstKills: number
  firstDeaths: number
}

export interface MatchMap {
  mapName: string
  pickedBy: string
  duration: string
  score: { team1: number; team2: number }
  players: {
    team1: MatchPlayerStat[]
    team2: MatchPlayerStat[]
  }
}

export interface MatchDetail {
  matchId: string
  eventName: string
  eventSeries: string
  eventLogo: string
  date: string
  status: string
  teams: Array<{
    name: string
    tag: string
    logo: string
    score: number
    isWinner: boolean
  }>
  maps: MatchMap[]
}

// --- ID Directories ---

export interface PlayerDirectoryEntry {
  vlrId: string
  name: string
  org: string
}

export interface TeamDirectoryEntry {
  vlrId: string
  name: string
  tag: string
  logo: string
}
