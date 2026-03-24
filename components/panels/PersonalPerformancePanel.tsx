'use client'
import PanelWrapper from '@/components/PanelWrapper'

const MOCK = {
  sleep: { hours: 7.5, quality: 82, label: 'Buena' },
  recovery: 78,
  hrv: 44,
  workouts: { done: 3, goal: 5, this_week: ['Lun','Mié','Vie'] },
  readiness: 81,
}

function Ring({ pct, color, size = 48 }: { pct: number; color: string; size?: number }) {
  const r = size / 2 - 5
  const c = 2 * Math.PI * r
  const dash = (pct / 100) * c
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e1e2e" strokeWidth={4} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round" />
    </svg>
  )
}

function Metric({ label, value, unit, pct, color }: { label: string; value: string | number; unit?: string; pct: number; color: string }) {
  return (
    <div className="bg-surface-2 rounded-lg p-3 flex items-center gap-3">
      <div className="relative flex-shrink-0">
        <Ring pct={pct} color={color} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-slate-300">{pct}%</span>
        </div>
      </div>
      <div>
        <div className="text-sm font-bold text-slate-200">{value}{unit && <span className="text-xs text-slate-500 ml-0.5">{unit}</span>}</div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
    </div>
  )
}

export default function PersonalPerformancePanel() {
  return (
    <PanelWrapper
      title="Personal Performance"
      subtitle="Mock data — connect Whoop/Garmin to go live"
      badge={
        <span className="text-xs px-2 py-0.5 rounded-full bg-surface-3 text-slate-500 border border-surface-4">
          mock
        </span>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <Metric label="Sleep" value={MOCK.sleep.hours} unit="h" pct={MOCK.sleep.quality} color="#818cf8" />
          <Metric label="Recovery" value={MOCK.recovery} unit="%" pct={MOCK.recovery} color="#34d399" />
          <Metric label="HRV" value={MOCK.hrv} unit="ms" pct={Math.min(100, Math.round(MOCK.hrv * 1.6))} color="#f59e0b" />
          <Metric label="Readiness" value={MOCK.readiness} unit="%" pct={MOCK.readiness} color="#60a5fa" />
        </div>
        <div className="bg-surface-2 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Workouts esta semana</span>
            <span className="text-xs font-semibold text-slate-300">{MOCK.workouts.done}/{MOCK.workouts.goal}</span>
          </div>
          <div className="flex gap-1.5">
            {['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map(d => (
              <div
                key={d}
                className={`flex-1 h-1.5 rounded-full ${MOCK.workouts.this_week.includes(d) ? 'bg-indigo-500' : 'bg-surface-3'}`}
              />
            ))}
          </div>
          <div className="flex gap-1.5 mt-1">
            {['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map(d => (
              <div key={d} className="flex-1 text-center text-[9px] text-slate-600">{d[0]}</div>
            ))}
          </div>
        </div>
      </div>
    </PanelWrapper>
  )
}
