const KEY = process.env.MAKE_API_KEY || ''
const BASE = process.env.MAKE_BASE_URL || 'https://us1.make.com/api/v2'

async function makeFetch(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Token ${KEY}`, 'Content-Type': 'application/json' },
    next: { revalidate: 120 },
  })
  if (!res.ok) throw new Error(`Make.com ${path}: ${res.status}`)
  return res.json()
}

export interface MakeScenario {
  id: number
  name: string
  isActive: boolean
  isPaused: boolean
  lastRun?: string
  nextRun?: string
  scheduling?: { type: string; interval?: number }
}

export async function getMakeScenarios(): Promise<MakeScenario[]> {
  try {
    const data = await makeFetch('/scenarios?pg[limit]=50')
    return (data.scenarios ?? []).map((s: {
      id: number
      name: string
      isActive: boolean
      isPaused: boolean
      lastSuccessRun?: string
      scheduling?: unknown
    }) => ({
      id: s.id,
      name: s.name,
      isActive: s.isActive,
      isPaused: s.isPaused,
      lastRun: s.lastSuccessRun,
      scheduling: s.scheduling,
    }))
  } catch {
    return []
  }
}
