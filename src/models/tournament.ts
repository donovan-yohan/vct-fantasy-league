export interface Tournament {
  vlrId: string
  title: string
  status: 'upcoming' | 'ongoing' | 'completed'
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
