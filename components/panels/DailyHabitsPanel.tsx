'use client'
import PanelWrapper from '@/components/PanelWrapper'

const HABITS = [
  { label: 'Agua',        current: 6,  goal: 8,  unit: 'vasos',       color: '#60a5fa', icon: '💧' },
  { label: 'Suplementos', current: 3,  goal: 3,  unit: 'tomados',     color: '#34d399', icon: '💊' },
  { label: 'Comidas',     current: 3,  goal: 3,  unit: 'planificadas', color: '#f59e0b', icon: '🍽' },
  { label: 'Lectura',     current: 20, goal: 30, unit: 'min',         color: '#a78bfa', icon: '📚' },
]

const STREAKS = [
  { label: 'Workout',     days: 12, icon: '🏋️' },
  { label: 'Sin alcohol', days: 7,  icon: '🚫' },
  { label: 'Meditación',  days: 4,  icon: '🧘' },
]

export default function DailyHabitsPanel() {
  const allDone = HABITS.filter(h => h.current >= h.goal).length

  return (
    <PanelWrapper
      title="Daily Habits"
      subtitle="Mock data — conectar app de hábitos"
      badge={
        <span className={`text-xs px-2 py-0.5 rounded-full border ${
          allDone === HABITS.length
            ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
            : 'bg-surface-3 text-slate-500 border-surface-4'
        }`}>
          {allDone}/{HABITS.length} done
        </span>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress bars */}
        <div>
          <div className="text-xs text-slate-600 uppercase tracking-wider mb-3">Hábitos de hoy</div>
          <div className="flex flex-col gap-4">
            {HABITS.map(h => {
              const pct = Math.min(100, Math.round((h.current / h.goal) * 100))
              const done = h.current >= h.goal
              return (
                <div key={h.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{h.icon}</span>
                      <span className="text-sm text-slate-300">{h.label}</span>
                    </div>
                    <span className={`text-xs font-semibold ${done ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {h.current}/{h.goal} {h.unit}
                    </span>
                  </div>
                  <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: done ? '#34d399' : h.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Streaks + summary */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-xs text-slate-600 uppercase tracking-wider mb-3">Streaks</div>
            <div className="grid grid-cols-3 gap-3">
              {STREAKS.map(s => (
                <div key={s.label} className="bg-surface-2 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-bold text-slate-200">{s.days}</div>
                  <div className="text-xs text-slate-500 mt-0.5">days</div>
                  <div className="text-[11px] text-slate-600 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-lg p-4 text-center ${
            allDone === HABITS.length
              ? 'bg-emerald-950/40 border border-emerald-900/50'
              : 'bg-surface-2'
          }`}>
            <div className={`text-2xl font-bold mb-1 ${allDone === HABITS.length ? 'text-emerald-400' : 'text-slate-300'}`}>
              {allDone}/{HABITS.length}
            </div>
            <div className="text-xs text-slate-500">hábitos completados hoy</div>
            {allDone === HABITS.length && (
              <div className="text-xs text-emerald-500 mt-1">¡Todo completado! 🎉</div>
            )}
          </div>
        </div>
      </div>
    </PanelWrapper>
  )
}
