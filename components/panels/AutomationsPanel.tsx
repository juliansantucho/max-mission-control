'use client'
import { useEffect, useState } from 'react'
import PanelWrapper from '@/components/PanelWrapper'
import type { MakeScenario, AutomationStatus } from '@/types'

function ago(iso: string | undefined | null) {
  if (!iso) return '—'
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return `${s}s ago`; if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`; return `${Math.floor(s / 86400)}d ago`
}

const ST_COLOR: Record<string, string> = {
  success: 'text-emerald-400', failed: 'text-red-400', running: 'text-sky-400', unknown: 'text-slate-500',
}
const ST_DOT: Record<string, string> = {
  success: 'bg-emerald-400', failed: 'bg-red-500', running: 'bg-sky-400', unknown: 'bg-slate-500',
}

export default function AutomationsPanel({
  makeScenarios, automationStatuses, hasSupabase,
}: { makeScenarios: MakeScenario[]; automationStatuses: AutomationStatus[]; hasSupabase: boolean }) {
  const [statuses, setStatuses] = useState<AutomationStatus[]>(automationStatuses)

  useEffect(() => {
    if (!hasSupabase || !process.env.NEXT_PUBLIC_SUPABASE_URL) return
    const { createClient } = require('@/lib/supabase/client')
    const sb = createClient()
    const ch = sb.channel('automation_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'automation_status' }, (p: { eventType: string; new: AutomationStatus }) => {
        if (p.eventType === 'INSERT' || p.eventType === 'UPDATE') {
          const u = p.new as AutomationStatus
          setStatuses(prev => prev.some(s => s.id === u.id) ? prev.map(s => s.id === u.id ? u : s) : [...prev, u])
        }
      })
      .subscribe()
    return () => sb.removeChannel(ch)
  }, [hasSupabase])

  const failedMake = makeScenarios.filter(s => !s.isActive && !s.isPaused).length
  const failedSupabase = statuses.filter(s => s.last_status === 'failed').length
  const totalIssues = failedMake + failedSupabase

  return (
    <PanelWrapper
      title="Automations"
      subtitle="Make.com + OpenClaw crons"
      badge={
        totalIssues > 0 ? (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            {totalIssues} issues
          </span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">all ok</span>
        )
      }
    >
      {makeScenarios.length === 0 && statuses.length === 0 ? (
        <p className="text-xs text-slate-600">
          No data — check Make.com API key · {hasSupabase ? 'POST /api/automations/status to push cron results' : 'add Supabase env vars'}
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Make.com */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-slate-600 uppercase tracking-wider">Make.com</div>
              <span className="text-xs text-slate-600">{makeScenarios.length} scenarios</span>
            </div>
            {makeScenarios.length === 0 ? (
              <p className="text-xs text-slate-700">No scenarios · check API key</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {makeScenarios.map(s => (
                  <div key={s.id} className="flex items-center justify-between bg-surface-2 rounded-lg px-3 py-2.5 text-xs">
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.isActive ? 'bg-emerald-400' : s.isPaused ? 'bg-yellow-400' : 'bg-red-500'}`} />
                      <span className="text-slate-300 truncate">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-slate-600">{ago(s.lastRun)}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${s.isActive ? 'bg-emerald-500/20 text-emerald-400' : s.isPaused ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {s.isActive ? 'active' : s.isPaused ? 'paused' : 'off'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* OpenClaw crons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-slate-600 uppercase tracking-wider">OpenClaw Crons</div>
              <span className="text-xs text-slate-600">{statuses.length} jobs</span>
            </div>
            {statuses.length === 0 ? (
              <p className="text-xs text-slate-700">{hasSupabase ? 'POST /api/automations/status to push cron results' : 'Add Supabase env vars'}</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {statuses.map(s => (
                  <div key={s.id} className={`flex items-center justify-between bg-surface-2 rounded-lg px-3 py-2.5 text-xs ${s.last_status === 'failed' ? 'border border-red-500/20' : ''}`}>
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ST_DOT[s.last_status]}`} />
                      <span className="text-slate-300 truncate">{s.automation_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={ST_COLOR[s.last_status]}>{s.last_status}</span>
                      <span className="text-slate-600">{ago(s.updated_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </PanelWrapper>
  )
}
