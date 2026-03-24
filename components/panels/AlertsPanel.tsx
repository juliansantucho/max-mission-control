'use client'
import { useEffect, useState } from 'react'
import PanelWrapper from '@/components/PanelWrapper'
import type { Alert } from '@/types'

const SEV_STYLE: Record<string, string> = {
  critical: 'border border-red-500/30 bg-red-500/5',
  warning: 'border border-yellow-500/20 bg-yellow-500/5',
  info: 'bg-surface-2',
}
const SEV_TEXT: Record<string, string> = { critical: 'text-red-400', warning: 'text-yellow-300', info: 'text-slate-400' }
const SEV_DOT: Record<string, string> = { critical: 'bg-red-500', warning: 'bg-yellow-400', info: 'bg-slate-500' }

function ago(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return `${s}s ago`; if (s < 3600) return `${Math.floor(s / 60)}m ago`; return `${Math.floor(s / 3600)}h ago`
}

export default function AlertsPanel({ initial, hasSupabase }: { initial: Alert[]; hasSupabase: boolean }) {
  const [alerts, setAlerts] = useState<Alert[]>(initial)

  useEffect(() => {
    if (!hasSupabase || !process.env.NEXT_PUBLIC_SUPABASE_URL) return
    const { createClient } = require('@/lib/supabase/client')
    const sb = createClient()
    const ch = sb.channel('alerts_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, (p: { eventType: string; new: Alert }) => {
        if (p.eventType === 'INSERT') setAlerts(prev => [p.new, ...prev])
        if (p.eventType === 'UPDATE') setAlerts(prev => prev.map(a => a.id === p.new.id ? p.new : a))
      })
      .subscribe()
    return () => sb.removeChannel(ch)
  }, [hasSupabase])

  const active = alerts.filter(a => !a.acknowledged)
  const critical = active.filter(a => a.severity === 'critical').length
  const warnings = active.filter(a => a.severity === 'warning').length

  async function ack(id: string) {
    const key = process.env.NEXT_PUBLIC_DASHBOARD_API_KEY
    if (!key) return
    await fetch(`/api/alerts/${id}/acknowledge`, { method: 'POST', headers: { 'x-api-key': key } })
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a))
  }

  return (
    <PanelWrapper
      title="Alerts & Anomalies"
      subtitle="Realtime · POST /api/alerts"
      badge={
        critical > 0
          ? <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 animate-blink">{critical} critical</span>
          : active.length > 0
            ? <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">{active.length} active</span>
            : <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">clear</span>
      }
    >
      {!hasSupabase ? (
        <p className="text-xs text-slate-600">⚠ Add Supabase env vars to activate alerts</p>
      ) : active.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="text-4xl">✅</div>
          <p className="text-sm text-slate-500">No active alerts</p>
          <p className="text-xs text-slate-700">Sistema operando normalmente</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Summary row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-2 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-red-400">{critical}</div>
              <div className="text-xs text-slate-600">Critical</div>
            </div>
            <div className="bg-surface-2 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-yellow-400">{warnings}</div>
              <div className="text-xs text-slate-600">Warning</div>
            </div>
            <div className="bg-surface-2 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-slate-400">{active.length - critical - warnings}</div>
              <div className="text-xs text-slate-600">Info</div>
            </div>
          </div>

          {/* Alert list — 2 columns on wide */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {active.map(a => (
              <div key={a.id} className={`p-3 rounded-lg text-xs ${SEV_STYLE[a.severity]}`}>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 ${SEV_DOT[a.severity]}`} />
                    <span className="font-semibold text-slate-200 truncate">{a.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`text-[10px] ${SEV_TEXT[a.severity]}`}>{a.severity}</span>
                    <button onClick={() => ack(a.id)} className="text-slate-600 hover:text-slate-300 px-1 leading-none">✕</button>
                  </div>
                </div>
                <p className="text-slate-400 leading-relaxed pl-3.5">{a.message}</p>
                <div className="text-slate-600 mt-1 pl-3.5">{ago(a.created_at)}{a.source_panel ? ` · ${a.source_panel}` : ''}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PanelWrapper>
  )
}
