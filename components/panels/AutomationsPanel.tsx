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

  return (
    <PanelWrapper
      title="Automations"
      subtitle="Make.com + OpenClaw crons"
      badge={
        failedMake + failedSupabase > 0 ? (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            {failedMake + failedSupabase} issues
          </span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">all ok</span>
        )
      }
    >
      <div className="flex flex-col gap-3">
        {/* Make.com scenarios */}
        {makeScenarios.length > 0 && (
          <div>
            <div className="text-xs text-slate-600 uppercase tracking-wider mb-1.5">Make.com</div>
            <div className="flex flex-col gap-1">
              {makeScenarios.slice(0, 6).map(s => (
                <div key={s.id} className="flex items-center justify-between text-xs bg-surface-2 rounded px-2 py-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${s.isActive ? 'bg-emerald-400' : s.isPaused ? 'bg-yellow-400' : 'bg-red-500'}`} />
                    <span className="text-slate-300 truncate">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-slate-600">{ago(s.lastRun)}</span>
                    <span className={`px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400`}>make</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OpenClaw crons */}
        {statuses.length > 0 && (
          <div>
            <div className="text-xs text-slate-600 uppercase tracking-wider mb-1.5">OpenClaw Crons</div>
            <div className="flex flex-col gap-1">
              {statuses.map(s => (
                <div key={s.id} className={`flex items-center justify-between text-xs rounded px-2 py-1.5 bg-surface-2 ${s.last_status === 'failed' ? 'border border-red-500/20' : ''}`}>
                  <span className="text-slate-300 truncate flex-1 mr-2">{s.automation_name}</span>
                  <div className="flex items-center gap-2">
                    <span className={ST_COLOR[s.last_status]}>{s.last_status}</span>
                    <span className="text-slate-600">{ago(s.updated_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {makeScenarios.length === 0 && statuses.length === 0 && (
          <p className="text-xs text-slate-600">
            No data — check Make.com API key · {hasSupabase ? 'POST /api/automations/status to push cron results' : 'add Supabase env vars'}
          </p>
        )}
      </div>
    </PanelWrapper>
  )
}
