const BASE = process.env.GHL_BASE_URL || 'https://services.leadconnectorhq.com'
const KEY = process.env.GHL_API_KEY || ''
const LOCATION = process.env.GHL_LOCATION_ID || ''

const headers = {
  'Authorization': `Bearer ${KEY}`,
  'Version': '2021-07-28',
  'Content-Type': 'application/json',
}

async function ghlFetch(path: string) {
  const res = await fetch(`${BASE}${path}`, { headers, next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`GHL ${path}: ${res.status}`)
  return res.json()
}

export async function getGHLContacts(): Promise<{ total: number; contacts: unknown[] }> {
  try {
    const data = await ghlFetch(`/contacts/?locationId=${LOCATION}&limit=100`)
    return { total: data.meta?.total ?? data.contacts?.length ?? 0, contacts: data.contacts ?? [] }
  } catch {
    return { total: 0, contacts: [] }
  }
}

export async function getGHLPipelineOpportunities(pipelineId: string) {
  try {
    const data = await ghlFetch(
      `/opportunities/search?location_id=${LOCATION}&pipeline_id=${pipelineId}&limit=100`
    )
    return data.opportunities ?? []
  } catch {
    return []
  }
}

export async function getGHLPipelineSummary() {
  const [crm, sales] = await Promise.all([
    getGHLPipelineOpportunities(process.env.GHL_PIPELINE_CRM || ''),
    getGHLPipelineOpportunities(process.env.GHL_PIPELINE_SALES || ''),
  ])

  const allOpps = [...crm, ...sales]
  const stageMap: Record<string, { count: number; value: number }> = {}
  for (const opp of allOpps) {
    const stage = opp.status || opp.pipelineStageId || 'unknown'
    if (!stageMap[stage]) stageMap[stage] = { count: 0, value: 0 }
    stageMap[stage].count++
    stageMap[stage].value += opp.monetaryValue ?? 0
  }

  return {
    totalOpportunities: allOpps.length,
    totalValue: allOpps.reduce((s: number, o: { monetaryValue?: number }) => s + (o.monetaryValue ?? 0), 0),
    stages: stageMap,
    opportunities: allOpps.slice(0, 15),
  }
}
