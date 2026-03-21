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
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-2 rounded p-2">
              <div className="text-xs text-slate-500">Total Contacts</div>
              <div className="text-xl font-bold text-slate-200">{fmt(metrics.totalClients)}</div>
              <div className="text-xs text-slate-600">GHL location</div>
            </div>
            <div className="bg-surface-2 rounded p-2">
              <div className="text-xs text-slate-500">Pipeline Value</div>
              <div className="text-xl font-bold text-emerald-400">{fmt(metrics.pipelineValue, true)}</div>
              <div className="text-xs text-slate-600">{metrics.pipelineOpportunities} opportunities</div>
            </div>
          </div>

          {stages.length > 0 && (
            <div>
              <div className="text-xs text-slate-600 uppercase tracking-wider mb-1.5">By Stage</div>
              <div className="flex flex-col gap-1">
                {stages.slice(0, 5).map(([stage, info]) => (
                  <div key={stage} className="flex items-center justify-between text-xs">
                    <span className={`px-1.5 py-0.5 rounded ${STAGE_COLOR[stage] ?? 'bg-slate-500/20 text-slate-400'}`}>
                      {stage}
                    </span>
                    <span className="text-slate-400">{info.count} deals · {fmt(info.value, true)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {metrics.topOpportunities.length > 0 && (
            <div>
              <div className="text-xs text-slate-600 uppercase tracking-wider mb-1.5">Top Opportunities</div>
              <div className="flex flex-col gap-1">
                {metrics.topOpportunities.slice(0, 4).map(opp => (
                  <div key={opp.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 truncate flex-1 mr-2">{opp.name}</span>
                    <span className="text-emerald-400 font-mono flex-shrink-0">{fmt(opp.monetaryValue ?? 0, true)}</span>
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
