import { getGHLContacts, getGHLPipelineSummary } from '@/lib/ghl'
import { getCalendlyEvents } from '@/lib/calendly'
import { getMakeScenarios } from '@/lib/make'
import { createServiceClient, hasSupabase } from '@/lib/supabase/service'
import DashboardClient from '@/components/DashboardClient'
import type { DashboardData, AgentStatus, Financial, Alert, TelegramMessage, AutomationStatus } from '@/types'

export const revalidate = 120 // refresh every 2 min

export default async function Page() {
  // ── Phase 1: real API calls (fail gracefully) ──
  const [contacts, pipeline, calendarEvents, makeScenarios] = await Promise.allSettled([
    getGHLContacts(),
    getGHLPipelineSummary(),
    getCalendlyEvents(48),
    getMakeScenarios(),
  ])

  const contactsData = contacts.status === 'fulfilled' ? contacts.value : { total: 0, contacts: [] }
  const pipelineData = pipeline.status === 'fulfilled' ? pipeline.value : {
    totalOpportunities: 0, totalValue: 0, stages: {}, opportunities: [],
  }
  const events = calendarEvents.status === 'fulfilled' ? calendarEvents.value : []
  const scenarios = makeScenarios.status === 'fulfilled' ? makeScenarios.value : []

  // ── Phase 2: Supabase tables (optional — works without credentials) ──
  const supabaseAvailable = hasSupabase()
  let agents: AgentStatus[] = []
  let financials: Financial[] = []
  let alerts: Alert[] = []
  let telegramMessages: TelegramMessage[] = []
  let automationStatuses: AutomationStatus[] = []

  if (supabaseAvailable) {
    const db = createServiceClient()
    const today = new Date().toISOString().split('T')[0]

    const [agentsRes, financialsRes, alertsRes, telegramRes, automationsRes] = await Promise.allSettled([
      db.from('agent_status').select('*').order('updated_at', { ascending: false }),
      db.from('financials').select('*'),
      db.from('alerts').select('*').eq('acknowledged', false).order('created_at', { ascending: false }).limit(20),
      db.from('telegram_messages').select('*').order('created_at', { ascending: false }).limit(15),
      db.from('automation_status').select('*').order('updated_at', { ascending: false }),
    ])

    if (agentsRes.status === 'fulfilled') agents = agentsRes.value.data ?? []
    if (financialsRes.status === 'fulfilled') financials = financialsRes.value.data ?? []
    if (alertsRes.status === 'fulfilled') alerts = alertsRes.value.data ?? []
    if (telegramRes.status === 'fulfilled') telegramMessages = telegramRes.value.data ?? []
    if (automationsRes.status === 'fulfilled') automationStatuses = automationsRes.value.data ?? []

    // Seed mock agents if empty
    if (agents.length === 0) {
      await db.from('agent_status').upsert([
        {
          agent_name: 'Max',
          status: 'online',
          current_task: 'Monitoring dashboard & pipelines',
          tasks_in_queue: 2,
          metadata: { model: 'claude-opus-4-6', gateway_port: 18789, uptime_minutes: 0 },
          updated_at: new Date().toISOString(),
        },
        {
          agent_name: 'SAM',
          status: 'online',
          current_task: 'Analyzing Meta Ads performance',
          tasks_in_queue: 5,
          metadata: { model: 'claude-opus-4-6', gateway_port: 18790, uptime_minutes: 0 },
          updated_at: new Date().toISOString(),
        },
      ], { onConflict: 'agent_name' })
      const { data } = await db.from('agent_status').select('*')
      agents = data ?? []
    }

    // Seed mock financials if empty
    if (financials.length === 0) {
      await db.from('financials').insert([
        { account_name: 'SA Horizon — Wise', balance: 28450, currency: 'USD' },
        { account_name: 'SA Horizon — Mercury OpEx', balance: 12300, currency: 'USD' },
        { account_name: 'Ad Spend Reserve', balance: 8750, currency: 'USD' },
      ])
      const { data } = await db.from('financials').select('*')
      financials = data ?? []
    }
  }

  const data: DashboardData = {
    businessMetrics: {
      totalClients: contactsData.total,
      pipelineValue: pipelineData.totalValue,
      pipelineOpportunities: pipelineData.totalOpportunities,
      pipelineStages: pipelineData.stages,
      topOpportunities: pipelineData.opportunities.slice(0, 8),
    },
    calendarEvents: events,
    makeScenarios: scenarios,
    agents,
    financials,
    alerts,
    telegramMessages,
    automationStatuses,
    hasSupabase: supabaseAvailable,
  }

  return <DashboardClient data={data} />
}
