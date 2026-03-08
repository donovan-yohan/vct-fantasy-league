import type {
  MatchDetail,
  MatchMap,
  MatchOverview,
  MatchPlayerStat,
  Player,
  PlayerMatchHistory,
  PlayerWithStats,
  Team,
  TeamMember,
  Tournament,
  TournamentMatch,
} from '~/models'
import type {
  EventMatchSegment,
  EventSegment,
  MatchDetailMap,
  MatchDetailPlayer,
  MatchDetailSegment,
  MatchListSegment,
  PlayerMatchSegment,
  PlayerProfileSegment,
  PlayerStatsSegment,
  RankingSegment,
  TeamProfileSegment,
  TeamRosterMember,
} from './types'

// ── Helpers ─────────────────────────────────────────────────────────

function parseFloat0(v: string): number {
  const n = parseFloat(v)
  return Number.isNaN(n) ? 0 : n
}

function parseInt0(v: string): number {
  const n = parseInt(v, 10)
  return Number.isNaN(n) ? 0 : n
}

function parsePercent(v: string): number {
  return parseFloat0(v.replace('%', ''))
}

function extractIdFromUrl(url: string): string {
  const match = url.match(/\/(\d+)\//)
  return match?.[1] ?? ''
}

function extractEventId(urlPath: string): string {
  const match = urlPath.match(/\/event\/(\d+)\//)
  return match?.[1] ?? ''
}

// ── Player mappers ──────────────────────────────────────────────────

export function mapPlayerProfile(seg: PlayerProfileSegment): Player {
  return {
    vlrId: seg.id,
    name: seg.name,
    realName: seg.real_name,
    avatar: seg.avatar,
    country: seg.country,
    currentTeamName: seg.current_team?.name ?? '',
    currentTeamTag: seg.current_team?.tag ?? '',
    currentTeamLogo: seg.current_team?.logo ?? '',
  }
}

export function mapPlayerStats(seg: PlayerStatsSegment): PlayerWithStats {
  return {
    vlrId: '',
    name: seg.player,
    realName: '',
    avatar: '',
    country: '',
    currentTeamName: seg.org,
    currentTeamTag: seg.org,
    currentTeamLogo: '',
    agents: seg.agents,
    roundsPlayed: parseInt0(seg.rounds_played),
    rating: parseFloat0(seg.rating),
    acs: parseFloat0(seg.average_combat_score),
    kd: parseFloat0(seg.kill_deaths),
    kast: parsePercent(seg.kill_assists_survived_traded),
    adr: parseFloat0(seg.average_damage_per_round),
    kpr: parseFloat0(seg.kills_per_round),
    apr: parseFloat0(seg.assists_per_round),
    fkpr: parseFloat0(seg.first_kills_per_round),
    fdpr: parseFloat0(seg.first_deaths_per_round),
    hsPercent: parsePercent(seg.headshot_percentage),
    clutchPercent: parsePercent(seg.clutch_success_percentage),
  }
}

export function mapPlayerMatch(seg: PlayerMatchSegment): PlayerMatchHistory {
  return {
    matchId: seg.match_id,
    event: seg.event,
    date: seg.date,
    team1Name: seg.team1.name,
    team1Tag: seg.team1.tag,
    team2Name: seg.team2.name,
    team2Tag: seg.team2.tag,
    score: seg.score,
    result: seg.result as 'win' | 'loss' | 'draw',
  }
}

// ── Team mappers ────────────────────────────────────────────────────

function mapRosterMember(m: TeamRosterMember): TeamMember {
  return {
    vlrId: m.id,
    alias: m.alias,
    realName: m.real_name,
    avatar: m.avatar,
    country: m.country,
    isCaptain: m.is_captain,
    role: m.role,
    isStaff: m.is_staff,
  }
}

export function mapTeamProfile(seg: TeamProfileSegment): Team {
  return {
    vlrId: seg.id,
    name: seg.name,
    tag: seg.tag,
    logo: seg.logo,
    country: seg.country,
    rank: seg.rating?.rank ? parseInt0(seg.rating.rank) : null,
    rating: seg.rating?.rating ? parseFloat0(seg.rating.rating) : null,
    record: seg.rating?.streak ?? '',
    earnings: '',
    roster: seg.roster.map(mapRosterMember),
  }
}

export function mapRanking(seg: RankingSegment): Team {
  return {
    vlrId: '',
    name: seg.team,
    tag: seg.team,
    logo: seg.logo,
    country: seg.country,
    rank: parseInt0(seg.rank),
    rating: null,
    record: seg.record,
    earnings: seg.earnings,
    roster: [],
  }
}

// ── Tournament mappers ──────────────────────────────────────────────

export function mapEvent(seg: EventSegment): Tournament {
  return {
    vlrId: extractEventId(seg.url_path),
    title: seg.title,
    status: seg.status as Tournament['status'],
    prize: seg.prize,
    dates: seg.dates,
    region: seg.region,
    thumb: seg.thumb,
    urlPath: seg.url_path,
  }
}

export function mapEventMatch(seg: EventMatchSegment): TournamentMatch {
  return {
    matchId: seg.match_id,
    date: seg.date,
    status: seg.status,
    eventSeries: seg.event_series,
    team1Name: seg.team1.name,
    team1Score: seg.team1.score,
    team1Won: seg.team1.is_winner,
    team2Name: seg.team2.name,
    team2Score: seg.team2.score,
    team2Won: seg.team2.is_winner,
  }
}

// ── Match mappers ───────────────────────────────────────────────────

export function mapMatchOverview(seg: MatchListSegment): MatchOverview {
  return {
    matchPage: seg.match_page,
    team1: seg.team1,
    team2: seg.team2,
    score1: parseInt0(seg.score1),
    score2: parseInt0(seg.score2),
    tournamentName: seg.tournament_name,
    tournamentIcon: seg.tournament_icon,
    roundInfo: seg.round_info,
    timeInfo: seg.time_completed ?? seg.time_until_match ?? '',
  }
}

function mapMatchPlayer(p: MatchDetailPlayer): MatchPlayerStat {
  return {
    name: p.name,
    agent: p.agent,
    rating: parseFloat0(p.rating),
    acs: parseInt0(p.acs),
    kills: parseInt0(p.kills),
    deaths: parseInt0(p.deaths),
    assists: parseInt0(p.assists),
    kdDiff: parseInt0(p.kd_diff),
    kast: parsePercent(p.kast),
    adr: parseFloat0(p.adr),
    hsPercent: parsePercent(p.hs_pct),
    firstKills: parseInt0(p.fk),
    firstDeaths: parseInt0(p.fd),
  }
}

function mapMap(m: MatchDetailMap): MatchMap {
  return {
    mapName: m.map_name,
    pickedBy: m.picked_by,
    duration: m.duration,
    score: m.score,
    players: {
      team1: m.players.team1.map(mapMatchPlayer),
      team2: m.players.team2.map(mapMatchPlayer),
    },
  }
}

export function mapMatchDetail(seg: MatchDetailSegment): MatchDetail {
  return {
    matchId: seg.match_id,
    eventName: seg.event.name,
    eventSeries: seg.event.series,
    eventLogo: seg.event.logo,
    date: seg.date,
    status: seg.status,
    teams: seg.teams.map((t) => ({
      name: t.name,
      tag: t.tag,
      logo: t.logo,
      score: parseInt0(t.score),
      isWinner: t.is_winner,
    })),
    maps: seg.maps.map(mapMap),
  }
}
