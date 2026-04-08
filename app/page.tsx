'use client'

import { useState } from 'react'
import MissionConfig from '@/components/MissionConfig'
import OverviewTab   from '@/components/OverviewTab'
import FuelTab       from '@/components/FuelTab'
import RiskTab       from '@/components/RiskTab'
import PhasesTab     from '@/components/PhasesTab'
import SimulationTab from '@/components/SimulationTab'

type Tab = 'overview' | 'fuel' | 'risks' | 'phases' | 'sim'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview'    },
  { id: 'fuel',     label: 'Fuel'        },
  { id: 'risks',    label: 'Risk Register' },
  { id: 'phases',   label: 'Phases'      },
  { id: 'sim',      label: 'Simulation'  },
]

export default function Home() {
  const [tab, setTab]         = useState<Tab>('overview')
  const [crew, setCrew]       = useState(6)
  const [payload, setPayload] = useState(0)
  const [speed, setSpeed]     = useState(80)

  return (
    <main className="relative min-h-screen">
      <div className="stars-bg" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="font-mono text-xs tracking-widest text-blue-400/40 uppercase mb-2">
            ── Mission Control v1.0 ──
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight mars-glow">
            Mars Mission Simulator
          </h1>
          <p className="font-mono text-sm text-slate-500 mt-2">
            Realistic physics · Risk modelling · Live flight animation
          </p>
        </header>

        {/* Config */}
        <MissionConfig
          crewSize={crew}
          extraPayload={payload}
          simSpeed={speed}
          onCrewChange={setCrew}
          onPayloadChange={setPayload}
          onSpeedChange={setSpeed}
        />

        {/* Tabs */}
        <div className="flex gap-1 mb-6 flex-wrap border-b border-blue-400/10 pb-0">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`mission-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && <OverviewTab crewSize={crew} extraPayload={payload} />}
        {tab === 'fuel'     && <FuelTab     crewSize={crew} extraPayload={payload} />}
        {tab === 'risks'    && <RiskTab />}
        {tab === 'phases'   && <PhasesTab />}
        {tab === 'sim'      && <SimulationTab crewSize={crew} simSpeed={speed} />}

        {/* Footer */}
        <footer className="mt-12 font-mono text-xs text-slate-700 text-center">
          Mars Mission Simulator — built with Next.js · Physics: Tsiolkovsky Rocket Equation
        </footer>
      </div>
    </main>
  )
}
