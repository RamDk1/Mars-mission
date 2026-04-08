// ─── Physics constants ────────────────────────────────────────
export const G0 = 9.80665
export const ISP = 380          // specific impulse (s) — LOX/LH₂
export const DELTA_V = 5600     // m/s total Δv budget
export const DRY_MASS = 120_000 // kg spacecraft dry mass
export const BASE_PAYLOAD = 30_000 // kg crew + base supplies
export const DURATION_DAYS = 253
export const AVG_DIST_KM = 225_000_000

// ─── Tsiolkovsky rocket equation ─────────────────────────────
export function calcFuel(crewSize: number, extraPayload: number) {
  const mFinal = DRY_MASS + BASE_PAYLOAD + extraPayload
  const ve = ISP * G0
  const ratio = Math.exp(DELTA_V / ve)
  const mInitial = mFinal * ratio
  const propellant = mInitial - mFinal
  return { mFinal, propellant, mInitial, ratio }
}

// ─── Consumables ──────────────────────────────────────────────
export function calcConsumables(crewSize: number) {
  const food  = crewSize * DURATION_DAYS * 1.8
  const water = crewSize * DURATION_DAYS * 3.0 * 0.10  // 90% recycled
  const o2    = crewSize * DURATION_DAYS * 0.84
  return { food, water, o2, total: food + water + o2 }
}

// ─── Mission phases ───────────────────────────────────────────
export const MISSION_PHASES = [
  { start: 1,   end: 4,   name: 'Earth Departure Burn',  desc: 'Trans-Mars Injection (TMI) manoeuvre' },
  { start: 5,   end: 94,  name: 'Inner Solar System',    desc: 'Cruising through the asteroid-free inner system' },
  { start: 95,  end: 96,  name: 'Mid-Course Correction', desc: 'Fine-tuning trajectory with small thruster burns' },
  { start: 97,  end: 236, name: 'Deep Space Transit',    desc: 'Main Hohmann transfer arc' },
  { start: 237, end: 246, name: 'Mars Approach',         desc: 'Decelerating into Mars capture orbit' },
  { start: 247, end: 249, name: 'Aerocapture & EDL',     desc: 'Entry, Descent & Landing through Martian atmosphere' },
  { start: 250, end: 253, name: 'Surface Arrival',       desc: 'Final descent and touchdown on Mars' },
]

// ─── Risk register ────────────────────────────────────────────
export type Severity = 'CRIT' | 'HIGH' | 'MED' | 'LOW'
export interface Risk {
  name: string
  prob: number
  severity: Severity
  mitigation: string
}

export const RISKS: Risk[] = [
  { name: 'Solar particle event',      prob: 0.30, severity: 'HIGH', mitigation: 'Radiation shielding, storm shelter protocol' },
  { name: 'Galactic cosmic rays',      prob: 0.95, severity: 'MED',  mitigation: 'Ongoing — increases cancer risk ~3%' },
  { name: 'Micrometeorite impact',     prob: 0.08, severity: 'HIGH', mitigation: 'Whipple shield, hull integrity monitoring' },
  { name: 'Life-support failure',      prob: 0.05, severity: 'CRIT', mitigation: 'Redundant ECLSS systems, emergency O₂' },
  { name: 'Navigation error',          prob: 0.04, severity: 'HIGH', mitigation: 'Deep Space Network tracking + IMU' },
  { name: 'Mental health / conflict',  prob: 0.70, severity: 'MED',  mitigation: 'Psych training, private quarters, comms' },
  { name: 'Equipment malfunction',     prob: 0.40, severity: 'MED',  mitigation: 'Spare parts, 3-D printer on board' },
  { name: 'Communication blackout',    prob: 0.20, severity: 'LOW',  mitigation: 'Up to 24-min delay; pre-planned autonomy' },
  { name: 'EDL trajectory error',      prob: 0.06, severity: 'CRIT', mitigation: 'Redundant parachutes, retro-rockets' },
  { name: 'Dust storm on surface',     prob: 0.50, severity: 'MED',  mitigation: 'Weather satellite, reinforced habitat' },
]

// ─── Flight events ────────────────────────────────────────────
export type LogLevel = 'info' | 'warn' | 'alert'
export interface FlightEvent {
  day: number
  level: LogLevel
  message: string
}

export const FLIGHT_EVENTS: FlightEvent[] = [
  { day: 10,  level: 'info',  message: 'Systems nominal. Earth receding in rear camera.' },
  { day: 25,  level: 'info',  message: 'Crew complete first sleep cycle in microgravity.' },
  { day: 40,  level: 'warn',  message: 'Minor thruster anomaly detected — resolved by auto-repair.' },
  { day: 60,  level: 'alert', message: 'Solar particle event! Crew move to storm shelter for 18 h.' },
  { day: 85,  level: 'info',  message: 'Halfway point reached. Speed: 30 km/s relative to Sun.' },
  { day: 110, level: 'info',  message: 'Asteroid belt boundary crossed — radar clear.' },
  { day: 130, level: 'warn',  message: 'CO₂ scrubber filter replacement ahead of schedule.' },
  { day: 160, level: 'info',  message: 'First glimpse of Mars disc in telescope — crew morale high.' },
  { day: 190, level: 'alert', message: 'Micrometeorite strike on outer shield — Whipple buffer absorbed impact.' },
  { day: 220, level: 'info',  message: 'Mars now dominant object ahead. Braking burn commencing.' },
  { day: 245, level: 'info',  message: 'Aerobraking through upper Martian atmosphere — G-forces nominal.' },
  { day: 251, level: 'alert', message: 'Dust storm detected in landing zone — alternate site selected.' },
  { day: 253, level: 'info',  message: 'Touchdown! Mission Control confirms safe landing on Mars.' },
]

export const EVENT_MAP: Record<number, FlightEvent> = Object.fromEntries(
  FLIGHT_EVENTS.map(e => [e.day, e])
)

// ─── Distances ────────────────────────────────────────────────
export const DISTANCES = [
  { label: 'Closest approach', km: 54_600_000,  lightMin: 3.0  },
  { label: 'Average (used)',   km: 225_000_000, lightMin: 12.5 },
  { label: 'Farthest apart',   km: 401_300_000, lightMin: 22.3 },
]

// ─── Crew statuses ────────────────────────────────────────────
export const CREW_STATUSES = ['Excellent', 'Good', 'Nominal', 'Space-adapted', 'Mild fatigue']
export const STATUS_COLORS: Record<string, string> = {
  'Excellent':     '#4ade80',
  'Good':          '#4ade80',
  'Nominal':       '#60a5fa',
  'Space-adapted': '#60a5fa',
  'Mild fatigue':  '#fbbf24',
}
