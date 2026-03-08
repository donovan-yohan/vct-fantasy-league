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

export interface MatchDetail {
  matchId: string
  eventName: string
  eventSeries: string
  eventLogo: string
  date: string
  status: string
  teams: MatchTeam[]
  maps: MatchMap[]
}

export interface MatchTeam {
  name: string
  tag: string
  logo: string
  score: number
  isWinner: boolean
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
