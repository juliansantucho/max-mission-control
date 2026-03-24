'use client'
import PanelWrapper from '@/components/PanelWrapper'

const HABITS = [
  { label: 'Agua', current: 6, goal: 8, unit: 'vasos', color: '#60a5fa', icon: '💧' },
  { label: 'Suplementos', current: 3, goal: 3, unit: 'tomados', color: '#34d399', icon: '💊' },
  { label: 'Comidas', current: 3, goal: 3, unit: 'planificadas', color: '#f59e0b', icon: '🍽' },
  { label: 'Lectura', current: 20, goal: 30, unit: 'min', color: '#a78bfa', icon: '📚' },
]

const STREAKS = [
  { label: 'Workout', days: 12, icon: '🏋️' },
  { label: 'Sin alcohol', days: 7, icon: '🚫' },
  { label: 'Meditación', days: 4, icon: '🧘' },
]

export default function DailyHabitsPanel() {
  const allDone = HABITS.filter(h => h.current >= h.goal).length

  return (
    <PanelWrapper
      title="Daily Habits"
      subtitle="Mock data — conectar app de hábitos"
      badge={
        <span className="text-xs px-2 py-0.5 rounded-full bg-surface-3 text-slate-500 border border-surface-4">
          mock
        </span>
      }
    >
      <div className="flex flex-col gap-3">
        {/* Progress bars */}
        <div className="flex flex-col gap-2.5">
          {HABITS.map(h => {
            const pct = Math.min(100, Math.round((h.current / h.goal) * 100))
            const done = h.current >= h.goal
            return (
              <div key={h.label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{h.icon}</span>
                    <span className="text-xs text-slate-400">{h.label}</span>
                  </div>
                  <span className={`text-xs font-semibold ${done ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {h.current}/{h.goal} {h.unit}
                  </span>
                </div>
                <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: done ? '#34d399' : h.color }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Streaks */}
        <div className="border-t border-surface-3 pt-3">
          <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Streaks</p>
          <div className="flex gap-2">
            {STREAKS.map(s => (
              <div key={s.label} className="flex-1 bg-surface-2 rounded-lg p-2 text-center">
                <div className="text-lg">{s.icon}</div>
                <div className="text-sm font-bold text-slate-200 mt-0.5">{s.days}</div>
                <div className="text-[10px] text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="text-center">
          <span className={`text-xs font-semibold ${allDone === HABITS.length ? 'text-emerald-400' : 'text-slate-500'}`}>
            {allDone}/{HABITS.length} hábitos completados hoy
          </span>
        </div>
      </div>
    </PanelWrapper>
  )
}
