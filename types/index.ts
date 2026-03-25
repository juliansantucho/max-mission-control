export interface AgentStatus {
  id: string
  agent_name: string
  status: 'online' | 'offline' | 'error' | 'idle' | 'active' | 'paused' | 'onboarding'
  current_task: string | null
  tasks_in_queue: number
  metadata: { uptime_minutes?: number; model?: string; gateway_port?: number; [k: string]: unknown }
  updated_at: string
}

export interface BusinessMetrics {
  totalClients: number
  pipelineValue: number
  pipelineOpportunities: number
  pipelineStages: Record<string, { count: number; value: number }>
  topOpportunities: GHLOpportunity[]
}

export interface GHLOpportunity {
  id: string
  name: string
  status: string
  monetaryValue?: number
  contact?: { name?: string }
  pipelineStageId?: string
}

export interface CalendarEvent {
  title: string
  start_time: string
  end_time: string
  source: string
  event_type: 'call' | 'meeting' | 'deadline' | 'other'
  invitees?: number
}

export interface TelegramMessage {
  id: string
  message_text: string
  from_user: string
  urgency: 'low' | 'normal' | 'high'
  read: boolean
  created_at: string
}

export interface AutomationStatus {
  id: string
  automation_name: string
  platform: string
  last_status: 'success' | 'failed' | 'running' | 'unknown'
  next_run: string | null
  error_message: string | null
  updated_at: string
}

export interface MakeScenario {
  id: number
  name: string
  isActive: boolean
  isPaused: boolean
  lastRun?: string
}

export interface Financial {
  id: string
  account_name: string
  balance: number
  currency: string
  updated_at: string
}

export interface Alert {
  id: string
  type: 'system' | 'business' | 'task' | 'health' | 'communication'
  severity: 'info' | 'warning' | 'critical'
  title: string
  message: string
  source_panel: string | null
  created_at: string
  acknowledged: boolean
}

export interface DashboardData {
  // Phase 1 — real data
  businessMetrics: BusinessMetrics
  calendarEvents: CalendarEvent[]
  makeScenarios: MakeScenario[]
  // Phase 2 — supabase
  agents: AgentStatus[]
  financials: Financial[]
  alerts: Alert[]
  telegramMessages: TelegramMessage[]
  automationStatuses: AutomationStatus[]
  // Supabase available
  hasSupabase: boolean
}
