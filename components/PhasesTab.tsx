'use client'

import { MISSION_PHASES, DURATION_DAYS } from '@/lib/mission-data'

export default function PhasesTab() {
  return (
    <div className="hud-panel corner-tl corner-br p-5">
      <div className="section-label">Mission Timeline — {DURATION_DAYS} days</div>

      {/* Timeline bar */}
      <div className="flex w-full h-4 rounded-sm overflow-hidden mb-6 gap-px">
        {MISSION_PHASES.map((phase, i) => {
          const pct = ((phase.end - phase.start + 1) / DURATION_DAYS * 100).toFixed(2)
          const colors = ['#C1440E','#E8651A','#D4956A','#4A90E2','#4ade80','#fbbf24','#a78bfa']
          return (
            <div
              key={phase.name}
              title={phase.name}
              style={{ width: `${pct}%`, background: colors[i], opacity: 0.8 }}
            />
          )
        })}
      </div>

      {/* Phase list */}
      <div className="space-y-0">
        {MISSION_PHASES.map((phase, i) => {
          const days = phase.end - phase.start + 1
          const colors = ['#C1440E','#E8651A','#D4956A','#4A90E2','#4ade80','#fbbf24','#a78bfa']
          const pct = (days / DURATION_DAYS * 100).toFixed(1)
          return (
            <div key={phase.name}
              className="grid grid-cols-12 gap-3 items-start py-4 border-b border-blue-400/8 last:border-0"
            >
              {/* Day range */}
              <div className="col-span-3 font-mono text-xs text-slate-500">
                <div>Day {phase.start}–{phase.end}</div>
                <div className="text-slate-600">{days} days</div>
              </div>

              {/* Name + desc */}
              <div className="col-span-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors[i] }} />
                  <span className="font-display font-semibold text-slate-200">{phase.name}</span>
                </div>
                <div className="font-mono text-xs text-slate-500 pl-4">{phase.desc}</div>
              </div>

              {/* Progress bar */}
              <div className="col-span-3 flex flex-col justify-center">
                <div className="progress-track h-1.5">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: colors[i] }} />
                </div>
                <div className="font-mono text-xs text-slate-600 mt-1 text-right">{pct}% of trip</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
