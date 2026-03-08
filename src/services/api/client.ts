import { getCached, setCached } from './cache'

const API_BASE_URL = 'https://vlrggapi.vercel.app'
const RATE_LIMIT_PER_MIN = 600

let requestCount = 0
let windowStart = Date.now()

function checkRateLimit() {
  const now = Date.now()
  if (now - windowStart > 60_000) {
    requestCount = 0
    windowStart = now
  }
  if (requestCount >= RATE_LIMIT_PER_MIN) {
    throw new Error('Rate limit exceeded. Please wait before making more requests.')
  }
  requestCount++
}

export async function apiGet<T>(endpoint: string, cacheTtlMs?: number): Promise<T> {
  const cacheKey = `api:${endpoint}`

  if (cacheTtlMs) {
    const cached = getCached<T>(cacheKey)
    if (cached !== undefined) return cached
  }

  checkRateLimit()
  const response = await fetch(`${API_BASE_URL}${endpoint}`)
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }
  const data = (await response.json()) as T

  if (cacheTtlMs) {
    setCached(cacheKey, data, cacheTtlMs)
  }

  return data
}
