'use client'
import { useEffect, useState } from 'react'
import type { AgentStatus } from '@/types'

const STATUS_DOT: Record<string, string> = {
  online:     'bg-emerald-400 shadow-[0_0_6px_#34d399]',
  active:     'bg-emerald-400 shadow-[0_0_6px_#34d399]',
  idle:       'bg-yellow-400',
  paused:     'bg-yellow-400',
  onboarding: 'bg-blue-400',
  error:      'bg-red-500',
  offline:    'bg-slate-600',
}
const STATUS_TEXT: Record<string, string> = {
  online:     'text-emerald-400',
  active:     'text-emerald-400',
  idle:       'text-yellow-400',
  paused:     'text-yellow-400',
  onboarding: 'text-blue-400',
  error:      'text-red-400',
  offline:    'text-slate-500',
}
const STATUS_LABEL: Record<string, string> = {
  online:     'Active',
  active:     'Active',
  idle:       'Idle',
  paused:     'Paused',
  onboarding: 'Onboarding',
  error:      'Error',
  offline:    'Offline',
}
const CARD_BORDER: Record<string, string> = {
  online:     'border-t-emerald-500',
  active:     'border-t-emerald-500',
  idle:       'border-t-yellow-500',
  paused:     'border-t-yellow-500',
  onboarding: 'border-t-blue-500',
  error:      'border-t-red-500',
  offline:    'border-t-slate-700',
}

function ago(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

function getEmoji(metadata: Record<string, unknown> | null | undefined, name: string): string {
  if (metadata?.emoji) return String(metadata.emoji)
  const n = name.toLowerCase()
  if (n.includes('max'))    return '⚡'
  if (n.includes('meli') || n.includes('ea')) return '📋'
  if (n.includes('nick') || n.includes('media') || n.includes('buyer')) return '📈'
  if (n.includes('laura') || n.includes('csm')) return '🤝'
  if (n.includes('sam') || n.includes('setter')) return '📞'
  if (n.includes('call') || n.includes('center')) return '☎️'
  if (n.includes('closer') || n.includes('sales')) return '💰'
  if (n.includes('confirm')) return '✅'
  return '🤖'
}

export default function AgentStatusPanel({ initial, hasSupabase }: { initial: AgentStatus[]; hasSupabase: boolean }) {
  const [agents, setAgents] = useState<AgentStatus[]>(initial)

  useEffect(() => {
    if (!hasSupabase || !process.env.NEXT_PUBLIC_SUPABASE_URL) return
    const { createClient } = require('@/lib/supabase/client')
    const sb = createClient()
    const ch = sb.channel('agent_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_status' }, (p: { eventType: string; new: AgentStatus }) => {
        if (p.eventType === 'UPDATE' || p.eventType === 'INSERT') {
          const u = p.new as AgentStatus
          setAgents(prev => prev.some(a => a.id === u.id) ? prev.map(a => a.id === u.id ? u : a) : [...prev, u])
        }
      })
      .subscribe()
    return () => sb.removeChannel(ch)
  }, [hasSupabase])

  const active  = agents.filter(a => ['online','active'].includes(a.status)).length
  const idle    = agents.filter(a => ['idle','paused'].includes(a.status)).length
  const boarding = agents.filter(a => a.status === 'onboarding').length

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-widest uppercase text-slate-100">AI Team</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {agents.length} deployed · {active} active · {idle} idle{boarding > 0 ? ` · ${boarding} onboarding` : ''}
          </p>
        </div>
      </div>

      {agents.length === 0 ? (
        <div className="bg-surface-1 border border-surface-3 rounded-lg p-6 text-center">
          <p className="text-xs text-slate-600">
            {hasSupabase ? 'No agents yet — POST /api/agent/heartbeat' : '⚠ Add Supabase env vars to activate'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map(a => {
            const st = a.status || 'offline'
            const meta = a.metadata as Record<string, unknown> | null | undefined
            const model   = meta?.model   ? String(meta.model).replace('anthropic/','').replace('claude-','Claude ') : null
            const role    = meta?.role    ? String(meta.role) : null
            const desc    = meta?.desc    ? String(meta.desc) : null
            const schedule = meta?.schedule ? String(meta.schedule) : null
            const emoji   = getEmoji(meta, a.agent_name)

            return (
              <div
                key={a.id}
                className={`bg-[#111116] border border-surface-3 border-t-2 ${CARD_BORDER[st] || 'border-t-slate-700'} rounded-xl p-4 flex flex-col gap-3`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl leading-none">{emoji}</span>
                    <div>
                      <div className="font-bold text-slate-100 text-[15px] leading-tight">{a.agent_name}</div>
                      {role && <div className="text-xs text-slate-500 mt-0.5">{role}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[st] || 'bg-slate-600'} ${['online','active'].includes(st) ? 'status-pulse' : ''}`} />
                    <span className={`text-xs font-semibold ${STATUS_TEXT[st] || 'text-slate-500'}`}>
                      {STATUS_LABEL[st] || st}
                    </span>
                  </div>
                </div>

                {/* Model */}
                {model && (
                  <div className="text-[11px] text-slate-600 font-mono">{model}</div>
                )}

                {/* Current task */}
                <div className="bg-surface-2 rounded-lg px-3 py-2 text-sm text-slate-300 font-medium min-h-[36px] flex items-center">
                  {a.current_task || 'Standing by'}
                </div>

                {/* Desc */}
                {desc && (
                  <p className="text-[11px] text-slate-600 leading-relaxed">{desc}</p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-[11px] text-slate-600 mt-auto pt-1">
                  <span>Last active {ago(a.updated_at)}</span>
                  {schedule && <span className="text-slate-700">Schedule: {schedule}</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
