import type { VCTSeason, VCTSeasonEvent, VCTEventType, VCTEventScope, VCTRegion } from './types'

// VCT event type metadata
const EVENT_TYPE_INFO: Record<VCTEventType, { scope: VCTEventScope; order: number }> = {
  kickoff: { scope: 'international', order: 1 },
  masters: { scope: 'international', order: 2 },
  league_stage: { scope: 'regional', order: 3 },
  champions: { scope: 'international', order: 4 },
}

// Keywords used to classify vlr.gg events into VCT event types
const EVENT_TYPE_KEYWORDS: Record<VCTEventType, string[]> = {
  kickoff: ['kickoff', 'kick-off', 'kick off'],
  masters: ['masters'],
  league_stage: ['league', 'stage', 'split', 'regular season'],
  champions: ['champions', 'champs'],
}

// Region keywords to map vlr.gg region strings to VCT regions
const REGION_KEYWORDS: Record<VCTRegion, string[]> = {
  americas: ['na', 'americas', 'north america', 'brazil', 'latam', 'latin america'],
  emea: ['eu', 'emea', 'europe'],
  pacific: ['ap', 'pacific', 'apac', 'asia', 'korea', 'japan', 'oceania', 'sea'],
  china: ['cn', 'china'],
}

const ALL_REGIONS: VCTRegion[] = ['americas', 'emea', 'pacific', 'china']

export function classifyEventType(eventTitle: string): VCTEventType | null {
  const lower = eventTitle.toLowerCase()
  for (const [type, keywords] of Object.entries(EVENT_TYPE_KEYWORDS) as [VCTEventType, string[]][]) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return type
    }
  }
  return null
}

export function classifyRegion(regionStr: string): VCTRegion | null {
  const lower = regionStr.toLowerCase()
  for (const [region, keywords] of Object.entries(REGION_KEYWORDS) as [VCTRegion, string[]][]) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return region
    }
  }
  return null
}

export function isVCTEvent(eventTitle: string): boolean {
  const lower = eventTitle.toLowerCase()
  return lower.includes('vct') || lower.includes('valorant champions tour') || lower.includes('champions tour')
}

export function getEventScope(type: VCTEventType): VCTEventScope {
  return EVENT_TYPE_INFO[type].scope
}

export function getEventOrder(type: VCTEventType): number {
  return EVENT_TYPE_INFO[type].order
}

export function isInternationalEvent(type: VCTEventType): boolean {
  return EVENT_TYPE_INFO[type].scope === 'international'
}

export interface RawEventData {
  vlrId: string
  title: string
  status: 'upcoming' | 'ongoing' | 'completed'
  dates: string
  region: string
}

export function buildSeasonEvent(raw: RawEventData): VCTSeasonEvent | null {
  if (!isVCTEvent(raw.title)) return null

  const eventType = classifyEventType(raw.title)
  if (!eventType) return null

  const scope = getEventScope(eventType)
  const region = classifyRegion(raw.region)
  const regions: VCTRegion[] = scope === 'international' ? ALL_REGIONS : region ? [region] : ALL_REGIONS

  const { startDate, endDate } = parseDateRange(raw.dates)

  return {
    id: `vct-${eventType}-${raw.vlrId}`,
    name: raw.title,
    type: eventType,
    scope,
    regions,
    status: raw.status,
    startDate,
    endDate,
    vlrEventIds: [raw.vlrId],
  }
}

export function buildSeason(year: number, events: VCTSeasonEvent[]): VCTSeason {
  const sorted = [...events].sort(
    (a, b) => getEventOrder(a.type) - getEventOrder(b.type),
  )
  return { year, events: sorted }
}

function parseDateRange(dates: string): { startDate: string | null; endDate: string | null } {
  if (!dates) return { startDate: null, endDate: null }

  // vlr.gg dates come in various formats like "Jan 15 - Feb 2, 2025"
  // or "Mar 5, 2025" for single-day events
  const parts = dates.split(/\s*[-–]\s*/)
  const startDate = parseVlrDate(parts[0]?.trim() ?? '')
  const endDate = parts.length > 1 ? parseVlrDate(parts[1]?.trim() ?? '') : startDate
  return { startDate, endDate }
}

function parseVlrDate(dateStr: string): string | null {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}
