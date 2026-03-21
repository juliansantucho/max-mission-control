'use client'
import { useEffect, useState } from 'react'
import PanelWrapper from '@/components/PanelWrapper'
import type { AgentStatus } from '@/types'

const S_COLOR: Record<string, string> = { online: 'bg-emerald-400', idle: 'bg-yellow-400', error: 'bg-red-500', offline: 'bg-slate-600' }
const S_TEXT: Record<string, string> = { online: 'text-emerald-400', idle: 'text-yellow-400', error: 'text-red-400', offline: 'text-slate-500' }

function ago(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return `${s}s`; if (s < 3600) return `${Math.floor(s / 60)}m`; return `${Math.floor(s / 3600)}h`
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

  const online = agents.filter(a => a.status === 'online').length

  return (
    <PanelWrapper
      title="Agent Status"
      subtitle="Realtime — heartbeat via /api/agent/heartbeat"
      fullWidth
      badge={
        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
          {online}/{agents.length} online
        </span>
      }
    >
      {agents.length === 0 ? (
        <p className="text-xs text-slate-600">
          {hasSupabase ? 'No agents yet — send a POST /api/agent/heartbeat' : '⚠ Supabase not configured — add env vars to see live agent status'}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {agents.map(a => (
            <div key={a.id} className="bg-surface-2 rounded-lg p-3 flex gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${S_COLOR[a.status]} ${a.status === 'online' ? 'status-pulse' : ''}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-200">{a.agent_name}</span>
                  <span className={`text-xs font-mono ${S_TEXT[a.status]}`}>{a.status}</span>
                </div>
                {a.current_task && <p className="text-xs text-slate-500 mt-0.5 truncate">{a.current_task}</p>}
                <div className="flex gap-3 mt-1 text-xs text-slate-600">
                  {a.tasks_in_queue > 0 && <span>{a.tasks_in_queue} queued</span>}
                  {a.metadata?.model && <span>{String(a.metadata.model).replace('anthropic/', '')}</span>}
                  <span>{ago(a.updated_at)} ago</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PanelWrapper>
  )
}
