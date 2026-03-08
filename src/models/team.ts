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
