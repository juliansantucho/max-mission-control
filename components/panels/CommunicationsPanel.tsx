'use client'
import { useEffect, useState } from 'react'
import PanelWrapper from '@/components/PanelWrapper'
import type { TelegramMessage } from '@/types'

const URGENCY_COLOR: Record<string, string> = {
  high: 'border border-red-500/30 bg-red-500/5',
  normal: 'bg-surface-2',
  low: 'bg-surface-2 opacity-70',
}
const URGENCY_BADGE: Record<string, string> = {
  high: 'text-red-400 bg-red-500/10 border-red-500/20',
  normal: 'text-slate-500 bg-surface-3 border-surface-4',
  low: 'text-slate-600 bg-surface-3 border-surface-4',
}

function ago(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return `${s}s`; if (s < 3600) return `${Math.floor(s / 60)}m`; return `${Math.floor(s / 3600)}h`
}

export default function CommunicationsPanel({ initial, hasSupabase }: { initial: TelegramMessage[]; hasSupabase: boolean }) {
  const [msgs, setMsgs] = useState<TelegramMessage[]>(initial)

  useEffect(() => {
    if (!hasSupabase || !process.env.NEXT_PUBLIC_SUPABASE_URL) return
    const { createClient } = require('@/lib/supabase/client')
    const sb = createClient()
    const ch = sb.channel('telegram_rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'telegram_messages' }, (p: { new: TelegramMessage }) => {
        setMsgs(prev => [p.new, ...prev].slice(0, 15))
      })
      .subscribe()
    return () => sb.removeChannel(ch)
  }, [hasSupabase])

  const unread = msgs.filter(m => !m.read).length
  const high = msgs.filter(m => m.urgency === 'high')
  const rest = msgs.filter(m => m.urgency !== 'high')

  return (
    <PanelWrapper
      title="Communications"
      subtitle="Telegram → Supabase realtime"
      badge={unread > 0 ? (
        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
          {unread} unread
        </span>
      ) : null}
    >
      {!hasSupabase ? (
        <p className="text-xs text-slate-600">⚠ Add Supabase env vars. Max will push messages to telegram_messages table.</p>
      ) : msgs.length === 0 ? (
        <p className="text-xs text-slate-600">No messages yet — Max will push here when he receives Telegram messages</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* High urgency */}
          <div>
            <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">High Priority · {high.length}</div>
            {high.length === 0 ? (
              <p className="text-xs text-slate-700 italic">No high-priority messages</p>
            ) : (
              <div className="flex flex-col gap-2">
                {high.map(m => (
                  <div key={m.id} className={`p-3 rounded-lg border text-xs ${URGENCY_COLOR[m.urgency]}`}>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-slate-300">{m.from_user}</span>
                      <span className="text-slate-600">{ago(m.created_at)}</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">{m.message_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All other messages */}
          <div>
            <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">All Messages · {rest.length}</div>
            <div className="flex flex-col gap-2">
              {rest.map(m => (
                <div key={m.id} className={`p-3 rounded-lg text-xs ${URGENCY_COLOR[m.urgency]}`}>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-300">{m.from_user}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${URGENCY_BADGE[m.urgency]}`}>{m.urgency}</span>
                      <span className="text-slate-600">{ago(m.created_at)}</span>
                    </div>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{m.message_text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PanelWrapper>
  )
}
