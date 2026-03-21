'use client'
import PanelWrapper from '@/components/PanelWrapper'
import type { Financial } from '@/types'

export default function FinancialPanel({ financials, hasSupabase }: { financials: Financial[]; hasSupabase: boolean }) {
  const totalUSD = financials.filter(f => f.currency === 'USD').reduce((s, f) => s + f.balance, 0)

  return (
    <PanelWrapper title="Financial Overview" subtitle="Mock data · bank API ready">
      {!hasSupabase ? (
        <p className="text-xs text-slate-600">⚠ Add Supabase env vars to activate</p>
      ) : (
        <div className="flex flex-col gap-3">
          <div>
            <div className="text-xl font-bold text-slate-200">${totalUSD.toLocaleString()} USD</div>
            <div className="text-xs text-slate-600">across {financials.filter(f => f.currency === 'USD').length} accounts</div>
          </div>
          <div className="flex flex-col gap-1.5">
            {financials.map(f => (
              <div key={f.id} className="flex items-center justify-between bg-surface-2 rounded px-3 py-2 text-xs">
                <span className="text-slate-300">{f.account_name}</span>
                <span className="font-semibold text-slate-200 font-mono">
                  {f.currency === 'ARS' ? `$${(f.balance / 1000).toFixed(0)}K ARS` : `$${f.balance.toLocaleString()}`}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-700">Connect Wise/Mercury API for live balances</p>
        </div>
      )}
    </PanelWrapper>
  )
}
