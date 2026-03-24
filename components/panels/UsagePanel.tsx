'use client'
import PanelWrapper from '@/components/PanelWrapper'

const METRICS = [
  { label: 'Mensajes este mes', value: '~180', sub: 'conversaciones con Juli', pct: 36, color: '#818cf8' },
  { label: 'Tareas completadas', value: '14', sub: 'desde el 1 Mar 2026', pct: 56, color: '#34d399' },
  { label: 'Crons activos', value: '4', sub: 'reporte diario + 3 más', pct: 80, color: '#f59e0b' },
]

const ACTIVITY = [
  { date: '21 Mar', action: 'Setup Next.js 14 dashboard', result: 'done' },
  { date: '21 Mar', action: '9-panel Mission Control', result: 'done' },
  { date: '02 Mar', action: 'Setup Windsor.ai API', result: 'done' },
  { date: '02 Mar', action: 'Análisis campañas 30d', result: 'done' },
  { date: '02 Mar', action: 'Research Spanish Smile', result: 'done' },
  { date: '02 Mar', action: 'Cron reporte diario 6AM', result: 'active' },
]

export default function UsagePanel() {
  return (
    <PanelWrapper
      title="Usage"
      subtitle="Uso del agente Max — Marzo 2026"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          {METRICS.map(m => (
            <div key={m.label} className="bg-surface-2 rounded-lg p-3">
              <div className="flex items-end justify-between mb-1">
                <span className="text-xs text-slate-500">{m.label}</span>
                <span className="text-lg font-bold text-slate-200 leading-none">{m.value}</span>
              </div>
              <p className="text-xs text-slate-600 mb-1.5">{m.sub}</p>
              <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${m.pct}%`, backgroundColor: m.color }} />
              </div>
            </div>
          ))}
        </div>

        <div>
          <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Actividad reciente</p>
          <div className="flex flex-col divide-y divide-surface-3">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-xs text-slate-400">{a.action}</p>
                  <p className="text-[10px] text-slate-600">{a.date}</p>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                  a.result === 'done' ? 'bg-emerald-900/40 text-emerald-400' :
                  a.result === 'active' ? 'bg-blue-900/40 text-blue-400' :
                  'bg-surface-3 text-slate-500'
                }`}>
                  {a.result === 'done' ? '✓ Done' : a.result === 'active' ? '⚡ Active' : a.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelWrapper>
  )
}
