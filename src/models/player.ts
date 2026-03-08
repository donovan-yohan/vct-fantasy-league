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
