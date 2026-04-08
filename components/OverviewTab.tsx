'use client'

import { calcFuel, calcConsumables, DISTANCES, DURATION_DAYS } from '@/lib/mission-data'

interface Props {
  crewSize: number
  extraPayload: number
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="hud-panel corner-tl p-4">
      <div className="font-mono text-xs tracking-widest text-blue-400/50 uppercase mb-2">{label}</div>
      <div className="font-display text-2xl font-bold text-slate-100">{value}</div>
      {sub && <div className="font-mono text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  )
}

function BarRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = (value / total * 100).toFixed(1)
  return (
    <div className="mb-4">
      <div className="flex justify-between font-mono text-xs text-slate-400 mb-2">
        <span>{label}</span>
        <span>{Math.round(value).toLocaleString()} kg <span className="text-slate-600">({pct}%)</span></span>
      </div>
      <div className="progress-track h-2">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function OverviewTab({ crewSize, extraPayload }: Props) {
  const fuel = calcFuel(crewSize, extraPayload)
  const cons = calcConsumables(crewSize)
  const totalMass = fuel.mInitial + cons.total

  const metrics = [
    { label: 'Transit Time',     value: `${DURATION_DAYS} days`,                   sub: '~8.4 months one-way' },
    { label: 'Launch Mass',      value: `${(totalMass / 1000).toFixed(0)}t`,        sub: `${Math.round(totalMass).toLocaleString()} kg` },
    { label: 'Crew',             value: `${crewSize}`,                              sub: 'astronauts' },
    { label: 'Propellant',       value: `${(fuel.propellant / 1000).toFixed(0)}t`,  sub: `mass ratio ${fuel.ratio.toFixed(2)}×` },
    { label: 'Radiation Dose',   value: '~300 mSv',                                 sub: '≈ 15× chest CT' },
    { label: 'Surface Gravity',  value: '0.38 g',                                   sub: 'Mars vs Earth' },
    { label: 'Comm Delay',       value: '~12.5 min',                                sub: 'one-way at avg distance' },
    { label: 'Atmo Pressure',    value: '0.6 kPa',                                  sub: '< 1% of Earth' },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {metrics.map(m => <MetricCard key={m.label} {...m} />)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Consumables */}
        <div className="hud-panel corner-tl corner-br p-5">
          <div className="section-label">Consumables (one-way)</div>
          <BarRow label="Food"          value={cons.food}  total={cons.total} color="#E8651A" />
          <BarRow label="Water (net)"   value={cons.water} total={cons.total} color="#4A90E2" />
          <BarRow label="Oxygen"        value={cons.o2}    total={cons.total} color="#4ade80" />
          <div className="flex justify-between font-mono text-xs text-slate-500 pt-3 border-t border-blue-400/10 mt-2">
            <span>Total consumables</span>
            <span>{Math.round(cons.total).toLocaleString()} kg</span>
          </div>
        </div>

        {/* Distances */}
        <div className="hud-panel corner-tl corner-br p-5">
          <div className="section-label">Earth–Mars Distances</div>
          <div className="space-y-4">
            {DISTANCES.map(d => (
              <div key={d.label}>
                <div className="flex justify-between font-mono text-xs text-slate-400 mb-2">
                  <span className="text-slate-500">{d.label}</span>
                  <span>{(d.km / 1e6).toFixed(1)}M km <span className="text-slate-600">· {d.lightMin} light-min</span></span>
                </div>
                <div className="progress-track h-1.5">
                  <div
                    className="progress-fill"
                    style={{ width: `${(d.km / 401_300_000 * 100).toFixed(1)}%`, background: '#4A90E2' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
