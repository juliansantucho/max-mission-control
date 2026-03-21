'use client'
import { useEffect, useState } from 'react'

export default function Header() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }))
      setDate(now.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short' }))
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [])
  return (
    <header className="flex items-center justify-between px-5 py-2.5 border-b border-surface-3 bg-surface-1 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-400 status-pulse" />
        <span className="text-sm font-bold tracking-wider text-slate-200">MISSION CONTROL</span>
        <span className="text-xs text-slate-500">SA Horizon · dental + chiro + medspas</span>
      </div>
      <div className="flex items-center gap-4">
        <a href="/legacy.html" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
          Legacy →
        </a>
        <div className="text-right">
          <div className="text-sm font-mono text-slate-300 tabular-nums">{time}</div>
          <div className="text-xs text-slate-600 capitalize">{date}</div>
        </div>
      </div>
    </header>
  )
}
