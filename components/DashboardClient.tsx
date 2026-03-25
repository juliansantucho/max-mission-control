'use client'

import { useState } from 'react'
import Header from './Header'
import AgentStatusPanel from './panels/AgentStatusPanel'
import BusinessMetricsPanel from './panels/BusinessMetricsPanel'
import FinancialPanel from './panels/FinancialPanel'
import CalendarPipelinePanel from './panels/CalendarPipelinePanel'
import CommunicationsPanel from './panels/CommunicationsPanel'
import AutomationsPanel from './panels/AutomationsPanel'
import AlertsPanel from './panels/AlertsPanel'
import PersonalPerformancePanel from './panels/PersonalPerformancePanel'
import DailyHabitsPanel from './panels/DailyHabitsPanel'
import type { DashboardData } from '@/types'

const TABS = [
  { id: 'agent',       icon: '🤖', label: 'AI Team' },
  { id: 'business',    icon: '📊', label: 'Business Metrics' },
  { id: 'financial',   icon: '💰', label: 'Financial Overview' },
  { id: 'calendar',    icon: '📅', label: 'Calendar & Pipeline' },
  { id: 'comms',       icon: '📧', label: 'Communications' },
  { id: 'performance', icon: '💪', label: 'Personal Performance' },
  { id: 'habits',      icon: '🍽️', label: 'Daily Habits' },
  { id: 'automations', icon: '⏰', label: 'Automation Status' },
  { id: 'alerts',      icon: '🔔', label: 'Alerts & Anomalies' },
]

export default function DashboardClient({ data }: { data: DashboardData }) {
  const [activeTab, setActiveTab] = useState('agent')
  const activeLabel = TABS.find(t => t.id === activeTab)?.label ?? ''

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface-0">
      <Header activeTab={activeLabel} />

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-[220px] flex-shrink-0 bg-surface-0 border-r border-surface-3 flex flex-col py-5 px-3 overflow-y-auto">
          <div className="flex items-center gap-2 px-2 mb-6">
            <span className="text-[#6366f1] text-lg">⚡</span>
            <span className="font-bold text-sm tracking-widest text-slate-200 uppercase">Mission Control</span>
          </div>

          <nav className="flex flex-col gap-1 flex-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left transition-all duration-150 ${
                  activeTab === tab.id
                    ? 'bg-[#17173a] text-[#818cf8] font-medium'
                    : 'text-slate-500 hover:bg-surface-2 hover:text-slate-300'
                }`}
              >
                <span className="text-base w-5 text-center">{tab.icon}</span>
                <span className="truncate">{tab.label}</span>
                {tab.id === 'alerts' && (
                  <span className="ml-auto text-[10px] bg-red-900/50 text-red-400 px-1.5 py-0.5 rounded-full font-mono flex-shrink-0">!</span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-4 px-2 pt-4 border-t border-surface-3">
            <div className="flex items-center gap-2 text-[11px] text-emerald-500 bg-emerald-950/40 border border-emerald-900/50 rounded-lg px-3 py-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span>Max · Online</span>
            </div>
            <div className="mt-2 text-[10px] text-slate-700 px-1">claude-sonnet-4-6</div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 min-w-0">
          {activeTab === 'agent' && (
            <AgentStatusPanel initial={data.agents} hasSupabase={data.hasSupabase} />
          )}
          {activeTab === 'business' && (
            <BusinessMetricsPanel metrics={data.businessMetrics} />
          )}
          {activeTab === 'financial' && (
            <FinancialPanel financials={data.financials} hasSupabase={data.hasSupabase} />
          )}
          {activeTab === 'calendar' && (
            <CalendarPipelinePanel events={data.calendarEvents} />
          )}
          {activeTab === 'comms' && (
            <CommunicationsPanel initial={data.telegramMessages} hasSupabase={data.hasSupabase} />
          )}
          {activeTab === 'performance' && (
            <PersonalPerformancePanel />
          )}
          {activeTab === 'habits' && (
            <DailyHabitsPanel />
          )}
          {activeTab === 'automations' && (
            <AutomationsPanel
              makeScenarios={data.makeScenarios}
              automationStatuses={data.automationStatuses}
              hasSupabase={data.hasSupabase}
            />
          )}
          {activeTab === 'alerts' && (
            <AlertsPanel initial={data.alerts} hasSupabase={data.hasSupabase} />
          )}
        </main>
      </div>
    </div>
  )
}
