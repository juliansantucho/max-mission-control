'use client'
import PanelWrapper from '@/components/PanelWrapper'
import type { CalendarEvent } from '@/types'

function fmtTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = d.getDate() - now.getDate()
  const t = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
  if (diff === 0) return `Hoy ${t}`
  if (diff === 1) return `Mañana ${t}`
  return d.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit' }) + ` ${t}`
}

export default function CalendarPipelinePanel({ events }: { events: CalendarEvent[] }) {
  return (
    <PanelWrapper title="Calendar & Pipeline" subtitle="Calendly · next 48h">
      {events.length === 0 ? (
        <p className="text-xs text-slate-600">No upcoming events · check Calendly token</p>
      ) : (
        <div className="flex flex-col gap-2">
          {events.map((ev, i) => (
            <div key={i} className="flex gap-3 text-xs bg-surface-2 rounded px-3 py-2">
              <span className="text-slate-600 flex-shrink-0 w-20">{fmtTime(ev.start_time)}</span>
              <div className="flex-1 min-w-0">
                <div className="text-slate-200 truncate">{ev.title}</div>
                <div className="text-slate-600 mt-0.5">
                  {ev.source}
                  {ev.invitees && ev.invitees > 1 ? ` · ${ev.invitees} invitees` : ''}
                </div>
              </div>
              <span className="text-sky-400 flex-shrink-0">📞</span>
            </div>
          ))}
        </div>
      )}
    </PanelWrapper>
  )
}
