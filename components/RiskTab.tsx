'use client'

import { RISKS, Severity } from '@/lib/mission-data'

const SEV_STYLES: Record<Severity, { bg: string; text: string; bar: string }> = {
  CRIT: { bg: 'bg-red-900/30',    text: 'text-red-400',    bar: '#f87171' },
  HIGH: { bg: 'bg-orange-900/20', text: 'text-orange-400', bar: '#fb923c' },
  MED:  { bg: 'bg-blue-900/20',   text: 'text-blue-400',   bar: '#60a5fa' },
  LOW:  { bg: 'bg-green-900/20',  text: 'text-green-400',  bar: '#4ade80' },
}

export default function RiskTab() {
  const sorted = [...RISKS].sort((a, b) => {
    const order = { CRIT: 0, HIGH: 1, MED: 2, LOW: 3 }
    return order[a.severity] - order[b.severity]
  })

  return (
    <div className="hud-panel corner-tl corner-br p-5">
      <div className="section-label">Risk Register — {RISKS.length} identified hazards</div>

      {/* Header */}
      <div className="grid grid-cols-12 gap-2 font-mono text-xs text-slate-600 uppercase tracking-widest pb-2 border-b border-blue-400/10 mb-1">
        <div className="col-span-4">Hazard</div>
        <div className="col-span-3">Probability</div>
        <div className="col-span-2">Severity</div>
        <div className="col-span-3">Mitigation</div>
      </div>

      <div className="space-y-1">
        {sorted.map(risk => {
          const style = SEV_STYLES[risk.severity]
          return (
            <div key={risk.name}
              className={`grid grid-cols-12 gap-2 items-center py-2.5 px-2 rounded-sm border border-transparent
                hover:border-blue-400/10 hover:bg-blue-400/3 transition-all duration-150`}
            >
              <div className="col-span-4 font-mono text-sm text-slate-300">{risk.name}</div>

              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <div className="progress-track h-1.5 flex-1">
                    <div
                      className="progress-fill"
                      style={{ width: `${risk.prob * 100}%`, background: style.bar }}
                    />
                  </div>
                  <span className="font-mono text-xs text-slate-500 min-w-[32px] text-right">
                    {Math.round(risk.prob * 100)}%
                  </span>
                </div>
              </div>

              <div className="col-span-2">
                <span className={`font-mono text-xs px-2 py-0.5 rounded-sm ${style.bg} ${style.text}`}>
                  {risk.severity}
                </span>
              </div>

              <div className="col-span-3 font-mono text-xs text-slate-500 leading-tight">
                {risk.mitigation}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mt-5 pt-4 border-t border-blue-400/10">
        {(['CRIT', 'HIGH', 'MED', 'LOW'] as Severity[]).map(sev => {
          const count = RISKS.filter(r => r.severity === sev).length
          const s = SEV_STYLES[sev]
          return (
            <div key={sev} className={`text-center py-2 rounded-sm ${s.bg}`}>
              <div className={`font-mono text-lg font-bold ${s.text}`}>{count}</div>
              <div className="font-mono text-xs text-slate-600">{sev}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
