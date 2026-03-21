'use client'
import AgentStatusPanel from './panels/AgentStatusPanel'
import BusinessMetricsPanel from './panels/BusinessMetricsPanel'
import FinancialPanel from './panels/FinancialPanel'
import CalendarPipelinePanel from './panels/CalendarPipelinePanel'
import CommunicationsPanel from './panels/CommunicationsPanel'
import AutomationsPanel from './panels/AutomationsPanel'
import AlertsPanel from './panels/AlertsPanel'
import PlaceholderPanel from './panels/PlaceholderPanel'
import type { DashboardData } from '@/types'

export default function DashboardClient({ data }: { data: DashboardData }) {
  return (
    <div className="p-3 flex flex-col gap-3">
      {/* Panel 1 — Agent Status — full width */}
      <AgentStatusPanel initial={data.agents} hasSupabase={data.hasSupabase} />

      {/* Grid 2-3 cols */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {/* Panel 2 — Business Metrics */}
        <BusinessMetricsPanel metrics={data.businessMetrics} />

        {/* Panel 3 — Financial */}
        <FinancialPanel financials={data.financials} hasSupabase={data.hasSupabase} />

        {/* Panel 4 — Calendar & Pipeline */}
        <CalendarPipelinePanel events={data.calendarEvents} />

        {/* Panel 5 — Communications */}
        <CommunicationsPanel initial={data.telegramMessages} hasSupabase={data.hasSupabase} />

        {/* Panel 6 — Performance (placeholder) */}
        <PlaceholderPanel
          title="Personal Performance"
          comingSoon="Coming soon — connect wearable (Whoop/Garmin) or health API"
        />

        {/* Panel 7 — Daily Habits (placeholder) */}
        <PlaceholderPanel
          title="Daily Habits"
          comingSoon="Coming soon — connect tracking DB or habit app"
        />

        {/* Panel 8 — Automations — spans 2 cols */}
        <div className="md:col-span-2 xl:col-span-2">
          <AutomationsPanel
            makeScenarios={data.makeScenarios}
            automationStatuses={data.automationStatuses}
            hasSupabase={data.hasSupabase}
          />
        </div>

        {/* Panel 9 — Alerts */}
        <AlertsPanel initial={data.alerts} hasSupabase={data.hasSupabase} />
      </div>
    </div>
  )
}
