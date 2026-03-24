'use client'
import PanelWrapper from '@/components/PanelWrapper'
import type { BusinessMetrics } from '@/types'

const STAGE_COLOR: Record<string, string> = {
  open: 'bg-blue-500/20 text-blue-300',
  won: 'bg-emerald-500/20 text-emerald-300',
  lost: 'bg-red-500/20 text-red-300',
  abandoned: 'bg-slate-500/20 text-slate-400',
}

function fmt(n: number, currency = false) {
  if (currency) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  return n.toLocaleString('en-US')
}

export default function BusinessMetricsPanel({ metrics }: { metrics: BusinessMetrics }) {
  const hasData = metrics.totalClients > 0 || metrics.pipelineOpportunities > 0
  const stages = Object.entries(metrics.pipelineStages)

  return (
    <PanelWrapper title="Business Metrics" subtitle="GHL live data · SA Horizon">
      {!hasData ? (
        <p className="text-xs text-slate-600">Connecting to GHL... check API key in env vars.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — summary stats + stages */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-2 rounded-lg p-4">
                <div className="text-xs text-slate-500 mb-1">Total Contacts</div>
                <div className="text-2xl font-bold text-slate-200">{fmt(metrics.totalClients)}</div>
                <div className="text-xs text-slate-600 mt-0.5">GHL location</div>
              </div>
              <div className="bg-surface-2 rounded-lg p-4">
                <div className="text-xs text-slate-500 mb-1">Pipeline Value</div>
                <div className="text-2xl font-bold text-emerald-400">{fmt(metrics.pipelineValue, true)}</div>
                <div className="text-xs text-slate-600 mt-0.5">{metrics.pipelineOpportunities} opportunities</div>
              </div>
            </div>

            {stages.length > 0 && (
              <div>
                <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">By Stage</div>
                <div className="flex flex-col gap-1.5">
                  {stages.map(([stage, info]) => (
                    <div key={stage} className="flex items-center justify-between text-xs bg-surface-2 rounded px-3 py-2">
                      <span className={`px-2 py-0.5 rounded ${STAGE_COLOR[stage] ?? 'bg-slate-500/20 text-slate-400'}`}>
                        {stage}
                      </span>
                      <span className="text-slate-400">{info.count} deals · {fmt(info.value, true)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — top opportunities */}
          {metrics.topOpportunities.length > 0 && (
            <div>
              <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">Top Opportunities</div>
              <div className="flex flex-col gap-1.5">
                {metrics.topOpportunities.map(opp => (
                  <div key={opp.id} className="flex items-center justify-between bg-surface-2 rounded px-3 py-2.5 text-xs">
                    <div className="min-w-0 flex-1 mr-3">
                      <div className="text-slate-200 truncate font-medium">{opp.name}</div>
                      {opp.contact?.name && (
                        <div className="text-slate-600 mt-0.5 truncate">{opp.contact.name}</div>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-emerald-400 font-mono font-semibold">{fmt(opp.monetaryValue ?? 0, true)}</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">{opp.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PanelWrapper>
  )
}
