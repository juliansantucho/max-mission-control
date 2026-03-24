'use client'
import PanelWrapper from '@/components/PanelWrapper'
import type { Financial } from '@/types'

export default function FinancialPanel({ financials, hasSupabase }: { financials: Financial[]; hasSupabase: boolean }) {
  const totalUSD = financials.filter(f => f.currency === 'USD').reduce((s, f) => s + f.balance, 0)
  const totalARS = financials.filter(f => f.currency === 'ARS').reduce((s, f) => s + f.balance, 0)

  return (
    <PanelWrapper title="Financial Overview" subtitle="Mock data · bank API ready">
      {!hasSupabase ? (
        <p className="text-xs text-slate-600">⚠ Add Supabase env vars to activate</p>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Summary row */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="bg-surface-2 rounded-lg p-4 lg:col-span-2">
              <div className="text-xs text-slate-500 mb-1">Total USD</div>
              <div className="text-3xl font-bold text-slate-200">${totalUSD.toLocaleString()}</div>
              <div className="text-xs text-slate-600 mt-1">
                across {financials.filter(f => f.currency === 'USD').length} accounts
              </div>
            </div>
            {totalARS > 0 && (
              <div className="bg-surface-2 rounded-lg p-4">
                <div className="text-xs text-slate-500 mb-1">Total ARS</div>
                <div className="text-2xl font-bold text-slate-300">${(totalARS / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-slate-600 mt-1">pesos</div>
              </div>
            )}
          </div>

          {/* Account cards */}
          <div>
            <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">Accounts</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {financials.map(f => (
                <div key={f.id} className="bg-surface-2 rounded-lg px-4 py-3 flex items-center justify-between">
                  <div className="min-w-0 flex-1 mr-3">
                    <div className="text-xs text-slate-300 truncate font-medium">{f.account_name}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">{f.currency}</div>
                  </div>
                  <div className="font-semibold text-slate-200 font-mono text-sm flex-shrink-0">
                    {f.currency === 'ARS' ? `$${(f.balance / 1000).toFixed(0)}K` : `$${f.balance.toLocaleString()}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-700">Connect Wise/Mercury API for live balances</p>
        </div>
      )}
    </PanelWrapper>
  )
}
