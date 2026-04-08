'use client'

import { calcFuel, ISP, DELTA_V } from '@/lib/mission-data'

interface Props { crewSize: number; extraPayload: number }

export default function FuelTab({ crewSize, extraPayload }: Props) {
  const f = calcFuel(crewSize, extraPayload)
  const propPct = (f.propellant / f.mInitial * 100).toFixed(1)
  const dryPct  = (f.mFinal    / f.mInitial * 100).toFixed(1)

  const rows = [
    { key: 'Engine type',          val: 'LOX / LH₂ chemical rocket' },
    { key: 'Specific impulse (Isp)', val: `${ISP} s` },
    { key: 'Δv budget',            val: `${DELTA_V.toLocaleString()} m/s` },
    { key: 'Exhaust velocity',     val: `${(ISP * 9.80665).toFixed(0)} m/s` },
    { key: 'Dry mass (ship + payload)', val: `${Math.round(f.mFinal).toLocaleString()} kg` },
    { key: 'Propellant required',  val: `${Math.round(f.propellant).toLocaleString()} kg` },
    { key: 'Gross (wet) mass',     val: `${Math.round(f.mInitial).toLocaleString()} kg` },
    { key: 'Mass ratio',           val: `${f.ratio.toFixed(3)}×` },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Equation + table */}
      <div className="hud-panel corner-tl corner-br p-5">
        <div className="section-label">Tsiolkovsky Rocket Equation</div>

        {/* Formula display */}
        <div className="bg-space-800/50 border border-blue-400/10 rounded-sm p-4 mb-5 text-center">
          <div className="font-mono text-sm text-blue-300/80">
            Δv = I<sub>sp</sub> · g₀ · ln(m₀ / m<sub>f</sub>)
          </div>
          <div className="font-mono text-xs text-slate-600 mt-2">
            {DELTA_V} = {ISP} × 9.807 × ln({f.ratio.toFixed(3)})
          </div>
        </div>

        <div className="space-y-0">
          {rows.map(({ key, val }, i) => (
            <div key={key} className={`flex justify-between py-2.5 font-mono text-sm
              ${i < rows.length - 1 ? 'border-b border-blue-400/8' : ''}
            `}>
              <span className="text-slate-500">{key}</span>
              <span className="text-slate-200">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visual breakdown */}
      <div className="hud-panel corner-tl corner-br p-5">
        <div className="section-label">Launch Mass Composition</div>

        <div className="space-y-5 mb-8">
          {[
            { label: 'Propellant', pct: propPct, color: '#C1440E', kg: f.propellant },
            { label: 'Dry structure + payload', pct: dryPct, color: '#4A90E2', kg: f.mFinal },
          ].map(({ label, pct, color, kg }) => (
            <div key={label}>
              <div className="flex justify-between font-mono text-xs text-slate-400 mb-2">
                <span style={{ color }}>{label}</span>
                <span>{Math.round(kg).toLocaleString()} kg · {pct}%</span>
              </div>
              <div className="progress-track h-3">
                <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Stacked visual */}
        <div className="section-label mt-6">Rocket Stack</div>
        <div className="relative w-full h-48 flex items-end gap-1 justify-center">
          {[
            { label: 'Propellant', h: +propPct, color: 'rgba(193,68,14,0.7)', border: '#C1440E' },
            { label: 'Ship',       h: +dryPct,  color: 'rgba(74,144,226,0.4)', border: '#4A90E2' },
          ].map(({ label, h, color, border }) => (
            <div key={label} className="flex flex-col items-center gap-1" style={{ width: 80 }}>
              <span className="font-mono text-xs text-slate-500">{label}</span>
              <div
                style={{
                  height: `${(h / 100) * 160}px`,
                  width: '100%',
                  background: color,
                  border: `1px solid ${border}`,
                  borderRadius: '2px 2px 0 0',
                  transition: 'height 0.5s ease',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
