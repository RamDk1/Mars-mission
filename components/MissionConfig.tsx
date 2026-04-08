'use client'

interface Props {
  crewSize: number
  extraPayload: number
  simSpeed: number
  onCrewChange: (v: number) => void
  onPayloadChange: (v: number) => void
  onSpeedChange: (v: number) => void
}

export default function MissionConfig({ crewSize, extraPayload, simSpeed, onCrewChange, onPayloadChange, onSpeedChange }: Props) {
  return (
    <div className="hud-panel corner-tl corner-br p-5 mb-6">
      <div className="scan-line" />
      <div className="section-label">Mission Parameters</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Crew size */}
        <div>
          <label className="block font-mono text-xs tracking-widest text-blue-400/60 uppercase mb-3">
            Crew Size
          </label>
          <div className="flex gap-2 flex-wrap">
            {[2, 4, 6, 8, 12].map(n => (
              <button
                key={n}
                onClick={() => onCrewChange(n)}
                className={`w-10 h-10 font-mono text-sm border transition-all duration-200 rounded-sm
                  ${crewSize === n
                    ? 'border-blue-400/70 bg-blue-400/15 text-blue-300 shadow-[0_0_8px_rgba(74,144,226,0.3)]'
                    : 'border-blue-400/15 text-slate-400 hover:border-blue-400/30 hover:text-slate-300'
                  }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Extra payload */}
        <div>
          <label className="block font-mono text-xs tracking-widest text-blue-400/60 uppercase mb-3">
            Extra Payload — {(extraPayload / 1000).toFixed(0)}t
          </label>
          <input
            type="range"
            min={0} max={50000} step={5000}
            value={extraPayload}
            onChange={e => onPayloadChange(+e.target.value)}
            className="w-full accent-blue-400 cursor-pointer"
          />
          <div className="flex justify-between font-mono text-xs text-slate-600 mt-1">
            <span>0t</span><span>25t</span><span>50t</span>
          </div>
        </div>

        {/* Sim speed */}
        <div>
          <label className="block font-mono text-xs tracking-widest text-blue-400/60 uppercase mb-3">
            Simulation Speed
          </label>
          <div className="flex gap-2">
            {[{ label: 'FAST', ms: 25 }, { label: 'NORM', ms: 80 }, { label: 'SLOW', ms: 200 }].map(s => (
              <button
                key={s.ms}
                onClick={() => onSpeedChange(s.ms)}
                className={`flex-1 py-2 font-mono text-xs tracking-widest border transition-all duration-200 rounded-sm
                  ${simSpeed === s.ms
                    ? 'border-blue-400/70 bg-blue-400/15 text-blue-300'
                    : 'border-blue-400/15 text-slate-400 hover:border-blue-400/30'
                  }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
