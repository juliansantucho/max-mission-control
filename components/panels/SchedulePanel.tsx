'use client'
import PanelWrapper from '@/components/PanelWrapper'
import scheduleData from '@/schedule.json'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const SHOW_HOURS = [6, 8, 10, 12, 14, 16, 18, 20, 22]

export default function SchedulePanel() {
  const today = new Date().getDay()

  return (
    <PanelWrapper
      title="Schedule"
      subtitle="Horario semanal — Max AI Agent"
    >
      {/* Always Running */}
      <div className="mb-3">
        <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">⚡ Siempre activo</p>
        <div className="flex flex-wrap gap-1.5">
          {scheduleData.always_running.map(item => (
            <div key={item.name} className="flex items-center gap-1.5 bg-emerald-900/20 border border-emerald-900/40 text-emerald-400 text-[11px] px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-pulse flex-shrink-0" />
              {item.name}
              <span className="text-emerald-700">({item.freq})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="w-10 text-slate-600 font-normal text-right pr-2 pb-1" />
              {DAYS.map((d, i) => (
                <th key={d} className={`pb-1 font-semibold text-center text-[11px] ${i === today ? 'text-indigo-400' : 'text-slate-500'}`}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SHOW_HOURS.map(h => (
              <tr key={h} className="hover:bg-surface-2 transition-colors">
                <td className="text-slate-600 text-right pr-2 py-0.5 text-[10px] font-mono align-top">{h.toString().padStart(2,'0')}h</td>
                {DAYS.map((_, i) => {
                  const events = scheduleData.schedule.filter(s => s.hour === h && s.days.includes(i))
                  return (
                    <td key={i} className={`py-0.5 px-0.5 ${i === today ? 'bg-indigo-900/10' : ''}`}>
                      {events.map((ev, ei) => (
                        <div
                          key={ei}
                          className="rounded px-1 py-0.5 text-[10px] text-white truncate mb-0.5"
                          style={{ backgroundColor: ev.color, borderLeft: `2px solid ${ev.color}cc` }}
                          title={ev.task}
                        >
                          {ev.task.split(' ').slice(0, 2).join(' ')}
                        </div>
                      ))}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelWrapper>
  )
}
