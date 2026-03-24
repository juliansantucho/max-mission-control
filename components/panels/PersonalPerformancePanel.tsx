'use client'
import PanelWrapper from '@/components/PanelWrapper'

const MOCK = {
  sleep: { hours: 7.5, quality: 82, label: 'Buena' },
  recovery: 78,
  hrv: 44,
  workouts: { done: 3, goal: 5, this_week: ['Lun', 'Mié', 'Vie'] },
  readiness: 81,
}

function Ring({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
  const r = size / 2 - 6
  const c = 2 * Math.PI * r
  const dash = (pct / 100) * c
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e1e2e" strokeWidth={5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round" />
    </svg>
  )
}

function Metric({ label, value, unit, pct, color, desc }: { label: string; value: string | number; unit?: string; pct: number; color: string; desc?: string }) {
  return (
    <div className="bg-surface-2 rounded-lg p-4 flex items-center gap-4">
      <div className="relative flex-shrink-0">
        <Ring pct={pct} color={color} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-slate-300">{pct}%</span>
        </div>
      </div>
      <div>
        <div className="text-lg font-bold text-slate-200">
          {value}{unit && <span className="text-sm text-slate-500 ml-0.5">{unit}</span>}
        </div>
        <div className="text-xs text-slate-500 mt-0.5">{label}</div>
        {desc && <div className="text-[10px] text-slate-700 mt-0.5">{desc}</div>}
      </div>
    </div>
  )
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function PersonalPerformancePanel() {
  return (
    <PanelWrapper
      title="Personal Performance"
      subtitle="Mock data — connect Whoop/Garmin to go live"
      badge={
        <span className="text-xs px-2 py-0.5 rounded-full bg-surface-3 text-slate-500 border border-surface-4">mock</span>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Metrics grid — 2 cols on mobile, 4 on wide */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <Metric label="Sleep" value={MOCK.sleep.hours} unit="h" pct={MOCK.sleep.quality} color="#818cf8" desc={MOCK.sleep.label} />
          <Metric label="Recovery" value={MOCK.recovery} unit="%" pct={MOCK.recovery} color="#34d399" />
          <Metric label="HRV" value={MOCK.hrv} unit="ms" pct={Math.min(100, Math.round(MOCK.hrv * 1.6))} color="#f59e0b" />
          <Metric label="Readiness" value={MOCK.readiness} unit="%" pct={MOCK.readiness} color="#60a5fa" />
        </div>

        {/* Workout tracker */}
        <div className="bg-surface-2 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-300">Workouts esta semana</span>
            <span className="text-sm font-bold text-slate-200">{MOCK.workouts.done}/{MOCK.workouts.goal}</span>
          </div>
          <div className="flex gap-2">
            {DAYS.map(d => (
              <div key={d} className="flex-1 flex flex-col items-center gap-1.5">
                <div className={`w-full h-2 rounded-full ${MOCK.workouts.this_week.includes(d) ? 'bg-indigo-500' : 'bg-surface-3'}`} />
                <span className="text-[10px] text-slate-600">{d[0]}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-slate-600">
            {MOCK.workouts.goal - MOCK.workouts.done} workouts remaining this week
          </div>
        </div>
      </div>
    </PanelWrapper>
  )
}
