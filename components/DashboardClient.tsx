'use client'
import AgentStatusPanel from './panels/AgentStatusPanel'
import BusinessMetricsPanel from './panels/BusinessMetricsPanel'
import FinancialPanel from './panels/FinancialPanel'
import CalendarPipelinePanel from './panels/CalendarPipelinePanel'
import CommunicationsPanel from './panels/CommunicationsPanel'
import AutomationsPanel from './panels/AutomationsPanel'
import AlertsPanel from './panels/AlertsPanel'
import PersonalPerformancePanel from './panels/PersonalPerformancePanel'
import DailyHabitsPanel from './panels/DailyHabitsPanel'
import TaskBoardPanel from './panels/TaskBoardPanel'
import AdsIdeasPanel from './panels/AdsIdeasPanel'
import ConnectionsPanel from './panels/ConnectionsPanel'
import UsagePanel from './panels/UsagePanel'
import SchedulePanel from './panels/SchedulePanel'
import type { DashboardData } from '@/types'

export default function DashboardClient({ data }: { data: DashboardData }) {
  return (
    <div className="p-3 flex flex-col gap-3">
      {/* Panel 1 — Agent Status — full width */}
      <AgentStatusPanel initial={data.agents} hasSupabase={data.hasSupabase} />

      {/* Main grid — 2-3 cols */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">

        {/* Panel 2 — Business Metrics */}
        <BusinessMetricsPanel metrics={data.businessMetrics} />

        {/* Panel 3 — Financial */}
        <FinancialPanel financials={data.financials} hasSupabase={data.hasSupabase} />

        {/* Panel 4 — Calendar & Pipeline */}
        <CalendarPipelinePanel events={data.calendarEvents} />

        {/* Panel 5 — Communications */}
        <CommunicationsPanel initial={data.telegramMessages} hasSupabase={data.hasSupabase} />

        {/* Panel 6 — Personal Performance */}
        <PersonalPerformancePanel />

        {/* Panel 7 — Daily Habits */}
        <DailyHabitsPanel />

        {/* Panel 8 — Automations — spans 2 cols */}
        <div className="md:col-span-2">
          <AutomationsPanel
            makeScenarios={data.makeScenarios}
            automationStatuses={data.automationStatuses}
            hasSupabase={data.hasSupabase}
          />
        </div>

        {/* Panel 9 — Alerts */}
        <AlertsPanel initial={data.alerts} hasSupabase={data.hasSupabase} />

        {/* Legacy panels — Task Board spans full width */}
        <div className="md:col-span-2 xl:col-span-3">
          <TaskBoardPanel />
        </div>

        {/* Schedule */}
        <SchedulePanel />

        {/* Ads Ideas — spans 2 cols */}
        <div className="md:col-span-2">
          <AdsIdeasPanel />
        </div>

        {/* Connections */}
        <ConnectionsPanel />

        {/* Usage */}
        <UsagePanel />

      </div>
    </div>
  )
}
