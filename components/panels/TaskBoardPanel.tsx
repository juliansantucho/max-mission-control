'use client'
import { useState } from 'react'
import PanelWrapper from '@/components/PanelWrapper'
import tasksData from '@/tasks.json'

type Tag = 'all' | 'ads' | 'crm' | 'ops' | 'research'

const TAG_COLORS: Record<string, string> = {
  ads: 'bg-indigo-900/40 text-indigo-400',
  crm: 'bg-emerald-900/40 text-emerald-400',
  ops: 'bg-purple-900/40 text-purple-400',
  research: 'bg-orange-900/40 text-orange-400',
}

const COLUMNS = [
  { id: 'recurring', label: 'Recurring', dot: 'bg-violet-400' },
  { id: 'backlog',   label: 'Backlog',   dot: 'bg-slate-500' },
  { id: 'in-progress', label: 'In Progress', dot: 'bg-blue-400' },
  { id: 'waiting',   label: 'Waiting',   dot: 'bg-orange-400' },
  { id: 'review',    label: 'Review',    dot: 'bg-yellow-400' },
  { id: 'done',      label: 'Done',      dot: 'bg-emerald-400' },
]

export default function TaskBoardPanel() {
  const [tag, setTag] = useState<Tag>('all')
  const tasks = tasksData.tasks
  const filtered = tag === 'all' ? tasks : tasks.filter(t => t.tag === tag)
  const inProg = filtered.filter(t => t.status === 'in-progress').length
  const done = filtered.filter(t => t.status === 'done').length

  return (
    <PanelWrapper
      title="Task Board"
      subtitle="Tareas de Max — actualizadas en tiempo real"
      badge={
        <div className="flex gap-2 text-xs">
          <span className="text-indigo-400 font-semibold">{inProg} in progress</span>
          <span className="text-slate-600">·</span>
          <span className="text-emerald-400 font-semibold">{done} done</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500">{filtered.length} total</span>
        </div>
      }
    >
      {/* Tag filters */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {(['all','ads','crm','ops','research'] as Tag[]).map(t => (
          <button
            key={t}
            onClick={() => setTag(t)}
            className={`px-2.5 py-0.5 rounded-full text-xs border transition-colors ${
              tag === t
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-surface-3 text-slate-500 hover:text-slate-300 hover:border-surface-4'
            }`}
          >
            {t === 'all' ? 'All' : t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Kanban columns */}
      <div className="flex gap-2.5 overflow-x-auto pb-2">
        {COLUMNS.map(col => {
          const colTasks = filtered.filter(t => t.status === col.id)
          return (
            <div key={col.id} className="min-w-[180px] max-w-[180px] flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="text-xs font-semibold text-slate-400">{col.label}</span>
                </div>
                <span className="text-xs bg-surface-3 text-slate-600 px-1.5 py-0.5 rounded">{colTasks.length}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {colTasks.map(task => (
                  <div key={task.id} className="bg-surface-2 border border-surface-3 rounded-lg p-2.5 hover:border-surface-4 transition-colors">
                    <p className="text-xs text-slate-300 leading-relaxed mb-1.5">{task.title}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${TAG_COLORS[task.tag] ?? 'bg-slate-800 text-slate-500'}`}>
                        {task.tag}
                      </span>
                      <span className="text-[10px] text-slate-600">{task.created.slice(5)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </PanelWrapper>
  )
}
