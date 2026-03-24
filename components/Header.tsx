'use client'

import { useEffect, useState } from 'react'

export default function Header({ activeTab }: { activeTab?: string }) {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }))
      setDate(now.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-surface-3 bg-surface-0 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-400 status-pulse" />
        <span className="text-sm font-semibold tracking-wider text-slate-200">
          MISSION CONTROL
        </span>
        <span className="text-xs text-slate-500">SA Horizon Group</span>
      </div>

      {activeTab && (
        <div className="text-xs font-medium text-[#818cf8] bg-[#17173a] border border-[#818cf8]/20 px-3 py-1.5 rounded-lg tracking-wide">
          {activeTab}
        </div>
      )}

      <div className="text-right">
        <div className="text-sm font-mono text-slate-200 tabular-nums">{time}</div>
        <div className="text-xs text-slate-500 capitalize">{date}</div>
      </div>
    </header>
  )
}
