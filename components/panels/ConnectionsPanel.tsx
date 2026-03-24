'use client'
import PanelWrapper from '@/components/PanelWrapper'

const CONNECTIONS = [
  { name: 'Windsor.ai',         status: 'ok',      detail: 'API key activa' },
  { name: 'CRM Google Sheets',  status: 'ok',      detail: 'Lead Data conectado' },
  { name: 'GitHub (juliansantucho)', status: 'ok', detail: 'Dashboard repo' },
  { name: 'Vercel',             status: 'ok',      detail: 'Auto-deploy activo' },
  { name: 'GHL',                status: 'ok',      detail: 'API v2 conectada' },
  { name: 'Supabase',           status: 'ok',      detail: 'Realtime habilitado' },
  { name: 'Make.com',           status: 'ok',      detail: 'Escenarios activos' },
  { name: 'Calendly',           status: 'ok',      detail: 'PAT configurado' },
  { name: 'Meta Ads API',       status: 'warn',    detail: 'Pendiente — token directo' },
  { name: 'GHL API v2',         status: 'warn',    detail: 'Pendiente — acceso ampliado' },
  { name: 'Namecheap',          status: 'warn',    detail: 'API no habilitada' },
]

export default function ConnectionsPanel() {
  const ok = CONNECTIONS.filter(c => c.status === 'ok').length
  const warn = CONNECTIONS.filter(c => c.status === 'warn').length

  return (
    <PanelWrapper
      title="Connections"
      subtitle="Integraciones activas y pendientes"
      badge={
        <div className="flex gap-2 text-xs">
          <span className="text-emerald-400 font-semibold">{ok} ok</span>
          <span className="text-slate-600">·</span>
          <span className="text-yellow-400 font-semibold">{warn} pendientes</span>
        </div>
      }
    >
      <div className="flex flex-col divide-y divide-surface-3">
        {CONNECTIONS.map(conn => (
          <div key={conn.name} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${conn.status === 'ok' ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
              <span className="text-xs text-slate-300">{conn.name}</span>
            </div>
            <span className={`text-xs ${conn.status === 'ok' ? 'text-slate-600' : 'text-yellow-500/70'}`}>
              {conn.detail}
            </span>
          </div>
        ))}
      </div>
    </PanelWrapper>
  )
}
