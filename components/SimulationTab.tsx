'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  DURATION_DAYS, AVG_DIST_KM, EVENT_MAP, RISKS,
  CREW_STATUSES, STATUS_COLORS, LogLevel
} from '@/lib/mission-data'

interface LogEntry {
  day: number
  level: LogLevel
  message: string
}

interface CrewMember {
  id: number
  status: string
}

interface Props {
  crewSize: number
  simSpeed: number
}

const LEVEL_COLORS: Record<LogLevel, string> = {
  info:  'text-blue-400',
  warn:  'text-yellow-400',
  alert: 'text-red-400',
}
const LEVEL_LABEL: Record<LogLevel, string> = {
  info:  'INFO ',
  warn:  'WARN ',
  alert: 'ALERT',
}

export default function SimulationTab({ crewSize, simSpeed }: Props) {
  const [day, setDay] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [log, setLog] = useState<LogEntry[]>([])
  const [crew, setCrew] = useState<CrewMember[]>([])
  const [outcome, setOutcome] = useState<'success' | 'partial' | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logRef   = useRef<HTMLDivElement>(null)
  const dayRef   = useRef(0)

  const distCovered = (AVG_DIST_KM * day / DURATION_DAYS / 1e6).toFixed(1)
  const pct = (day / DURATION_DAYS * 100).toFixed(2)

  const endMission = useCallback((finalDay: number) => {
    setRunning(false)
    setDone(true)

    const crewArr = Array.from({ length: crewSize }, (_, i) => ({
      id: i + 1,
      status: CREW_STATUSES[Math.floor(Math.random() * CREW_STATUSES.length)],
    }))
    setCrew(crewArr)

    const fail = RISKS.filter(r => r.severity === 'CRIT')
      .some(r => Math.random() < r.prob * 0.15)
    setOutcome(fail ? 'partial' : 'success')
  }, [crewSize])

  const tick = useCallback(() => {
    dayRef.current += 1
    const d = dayRef.current
    setDay(d)

    if (EVENT_MAP[d]) {
      setLog(prev => [...prev, { day: d, ...EVENT_MAP[d] }])
    }

    if (d >= DURATION_DAYS) {
      endMission(d)
      return
    }

    timerRef.current = setTimeout(tick, simSpeed)
  }, [simSpeed, endMission])

  const start = useCallback(() => {
    if (running) return
    setRunning(true)
    timerRef.current = setTimeout(tick, simSpeed)
  }, [running, tick, simSpeed])

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setRunning(false)
    setDone(false)
    setDay(0)
    dayRef.current = 0
    setLog([])
    setCrew([])
    setOutcome(null)
  }, [])

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [log])

  // Cleanup on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={start}
          disabled={running || done}
          className={`px-6 py-2 font-mono text-sm tracking-widest uppercase border rounded-sm transition-all duration-200
            ${running || done
              ? 'border-blue-400/10 text-slate-600 cursor-not-allowed'
              : 'border-blue-400/50 text-blue-300 hover:bg-blue-400/10 shadow-[0_0_12px_rgba(74,144,226,0.2)]'
            }`}
        >
          {running ? '● Transmitting' : done ? '✓ Landed' : '▶ Launch Mission'}
        </button>
        <button
          onClick={reset}
          className="px-5 py-2 font-mono text-sm tracking-widest uppercase border border-blue-400/15 text-slate-500
            hover:border-blue-400/30 hover:text-slate-400 rounded-sm transition-all duration-200"
        >
          ↺ Reset
        </button>
        {running && (
          <span className="font-mono text-xs text-blue-400/60 animate-pulse-slow">
            Day {day} / {DURATION_DAYS} — {distCovered}M km
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="hud-panel corner-tl corner-br p-5 mb-4">
        <div className="section-label">Flight Progress</div>
        <div className="flex justify-between font-mono text-xs text-slate-500 mb-2">
          <span>Earth</span>
          <span className="text-blue-400">{distCovered}M km · Day {day} of {DURATION_DAYS}</span>
          <span className="text-mars-orange">Mars</span>
        </div>
        <div className="progress-track h-4 relative">
          <div
            className="progress-fill h-full"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #4A90E2, #C1440E)' }}
          />
          {/* Rocket icon */}
          <div
            className="absolute top-1/2 -translate-y-1/2 font-mono text-xs transition-all duration-300"
            style={{ left: `calc(${pct}% - 8px)` }}
          >
            🚀
          </div>
        </div>
        <div className="flex justify-between font-mono text-xs text-slate-600 mt-1">
          <span>0M km</span>
          <span>{pct}% complete</span>
          <span>225M km</span>
        </div>
      </div>

      {/* Mission log */}
      <div className="hud-panel corner-tl corner-br p-5 mb-4">
        <div className="section-label">Mission Log</div>
        <div
          ref={logRef}
          className="h-56 overflow-y-auto space-y-1 font-mono text-sm"
        >
          {log.length === 0 ? (
            <div className="text-slate-600 text-xs pt-2">
              Awaiting launch<span className="blink">_</span>
            </div>
          ) : (
            log.map((entry, i) => (
              <div key={i} className="flex gap-3 py-1 border-b border-blue-400/5">
                <span className="text-slate-600 min-w-[60px]">Day {entry.day}</span>
                <span className={`min-w-[44px] ${LEVEL_COLORS[entry.level]}`}>
                  [{LEVEL_LABEL[entry.level]}]
                </span>
                <span className="text-slate-300">{entry.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Crew status (post-flight) */}
      {done && crew.length > 0 && (
        <div className="hud-panel corner-tl corner-br p-5 mb-4">
          <div className="section-label">Crew Status on Arrival</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {crew.map(member => (
              <div key={member.id} className="bg-space-700/50 border border-blue-400/10 rounded-sm p-3">
                <div className="font-mono text-xs text-slate-600 mb-1">Astronaut #{member.id}</div>
                <div className="font-display text-sm font-semibold" style={{ color: STATUS_COLORS[member.status] }}>
                  {member.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mission outcome */}
      {outcome && (
        <div className={`hud-panel p-5 border-l-2 ${
          outcome === 'success'
            ? 'border-l-green-400'
            : 'border-l-orange-400'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`font-mono text-2xl ${outcome === 'success' ? 'text-green-400' : 'text-orange-400'}`}>
              {outcome === 'success' ? '✓' : '⚠'}
            </span>
            <div>
              <div className={`font-display text-lg font-bold ${outcome === 'success' ? 'text-green-300' : 'text-orange-300'}`}>
                {outcome === 'success' ? 'Mission Success' : 'Partial Success'}
              </div>
              <div className="font-mono text-xs text-slate-400 mt-1">
                {outcome === 'success'
                  ? `All ${crewSize} crew members safely arrived on Mars. Systems nominal.`
                  : 'A critical system failure occurred en route. Mission objectives partially completed.'
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
