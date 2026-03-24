'use client'
import PanelWrapper from '@/components/PanelWrapper'
import type { CalendarEvent } from '@/types'

const TYPE_ICON: Record<string, string> = {
  call: '📞', meeting: '🤝', deadline: '⚠️', other: '📌',
}
const TYPE_COLOR: Record<string, string> = {
  call: 'text-sky-400', meeting: 'text-violet-400', deadline: 'text-orange-400', other: 'text-slate-400',
}

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
  const today = events.filter(ev => {
    const diff = new Date(ev.start_time).getDate() - new Date().getDate()
    return diff === 0
  })
  const upcoming = events.filter(ev => {
    const diff = new Date(ev.start_time).getDate() - new Date().getDate()
    return diff !== 0
  })

  return (
    <PanelWrapper
      title="Calendar & Pipeline"
      subtitle="Calendly · next 48h"
      badge={
        events.length > 0 ? (
          <span className="text-xs px-2 py-0.5 rounded-full bg-sky-400/10 text-sky-400 border border-sky-400/20">
            {events.length} events
          </span>
        ) : null
      }
    >
      {events.length === 0 ? (
        <p className="text-xs text-slate-600">No upcoming events · check Calendly token</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today */}
          <div>
            <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">Hoy · {today.length} events</div>
            {today.length === 0 ? (
              <p className="text-xs text-slate-700 italic">No hay eventos hoy</p>
            ) : (
              <div className="flex flex-col gap-2">
                {today.map((ev, i) => (
                  <div key={i} className="flex gap-3 bg-surface-2 rounded-lg px-4 py-3 text-xs">
                    <span className={`text-base flex-shrink-0 ${TYPE_COLOR[ev.event_type]}`}>{TYPE_ICON[ev.event_type]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-200 font-medium truncate">{ev.title}</div>
                      <div className="text-slate-600 mt-0.5 flex gap-2">
                        <span>{fmtTime(ev.start_time)}</span>
                        {ev.invitees && ev.invitees > 1 && <span>· {ev.invitees} invitees</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming */}
          <div>
            <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">Próximos · {upcoming.length} events</div>
            {upcoming.length === 0 ? (
              <p className="text-xs text-slate-700 italic">No hay eventos próximos</p>
            ) : (
              <div className="flex flex-col gap-2">
                {upcoming.map((ev, i) => (
                  <div key={i} className="flex gap-3 bg-surface-2 rounded-lg px-4 py-3 text-xs">
                    <span className={`text-base flex-shrink-0 ${TYPE_COLOR[ev.event_type]}`}>{TYPE_ICON[ev.event_type]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-200 font-medium truncate">{ev.title}</div>
                      <div className="text-slate-600 mt-0.5">{fmtTime(ev.start_time)}</div>
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
