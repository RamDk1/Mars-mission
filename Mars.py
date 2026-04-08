import random
import time
import math
import sys

EARTH_MARS_MIN_KM     = 54_600_000    # closest approach
EARTH_MARS_AVG_KM     = 225_000_000   # average distance
EARTH_MARS_MAX_KM     = 401_300_000   # farthest apart
MISSION_DURATION_DAYS = 253           # one-way Hohmann transfer
CREW_SIZE             = 6
ROCKET_DRY_MASS_KG    = 120_000       # spacecraft without fuel
PAYLOAD_KG            = 30_000        # crew + supplies
SPECIFIC_IMPULSE       = 380          # seconds (LOX/LH2 engine)
G0                    = 9.80665       # m/s²
DELTA_V_NEEDED        = 5_600         # m/s total Δv budget
FOOD_KG_PER_DAY       = 1.8          # per crew member
WATER_KG_PER_DAY      = 3.0          # per crew member (recycled ~90%)
O2_KG_PER_DAY         = 0.84         # per crew member
POWER_KW              = 40           # continuous solar/nuclear power


class C:
    RED    = "\033[91m"
    GREEN  = "\033[92m"
    YELLOW = "\033[93m"
    CYAN   = "\033[96m"
    BLUE   = "\033[94m"
    MAGENTA= "\033[95m"
    BOLD   = "\033[1m"
    DIM    = "\033[2m"
    RESET  = "\033[0m"
    WHITE  = "\033[97m"


def clr(text, *colours):
    return "".join(colours) + str(text) + C.RESET


def slow_print(text, delay=0.03):
    for ch in text:
        sys.stdout.write(ch)
        sys.stdout.flush()
        time.sleep(delay)
    print()


def banner(text, colour=C.CYAN):
    width = 62
    bar = "═" * width
    print(clr(f"╔{bar}╗", colour))
    print(clr(f"║  {text:<{width-2}}║", colour))
    print(clr(f"╚{bar}╝", colour))


def section(title):
    print()
    print(clr(f"  ── {title} {'─'*(54-len(title))}", C.YELLOW + C.BOLD))


def progress_bar(label, value, total, width=30, colour=C.GREEN):
    filled = int(width * value / total)
    bar = "█" * filled + "░" * (width - filled)
    pct = value / total * 100
    print(f"  {label:<28} {clr(bar, colour)}  {pct:5.1f}%")



def tsiolkovsky(delta_v, isp, m_final):
    """Rocket equation → propellant mass required (kg)."""
    exhaust_velocity = isp * G0
    mass_ratio = math.exp(delta_v / exhaust_velocity)
    m_initial = m_final * mass_ratio
    propellant = m_initial - m_final
    return propellant, m_initial, mass_ratio


def fuel_analysis(crew_size, payload_kg):
    """Calculate fuel requirements for the mission."""
    m_final = ROCKET_DRY_MASS_KG + payload_kg
    propellant, m_initial, ratio = tsiolkovsky(
        DELTA_V_NEEDED, SPECIFIC_IMPULSE, m_final
    )
    return {
        "dry_mass":     m_final,
        "propellant":   propellant,
        "gross_mass":   m_initial,
        "mass_ratio":   ratio,
        "delta_v":      DELTA_V_NEEDED,
        "isp":          SPECIFIC_IMPULSE,
    }


# ─────────────────────────────────────────────
#  MISSION PROFILE
# ─────────────────────────────────────────────
MISSION_PHASES = [
    ("Earth Departure Burn",    4,   "Trans-Mars Injection (TMI) manoeuvre"),
    ("Inner Solar System",      90,  "Cruising through the asteroid-free inner system"),
    ("Mid-Course Correction",   2,   "Fine-tuning trajectory with small thruster burns"),
    ("Deep Space Transit",      140, "Main Hohmann transfer arc"),
    ("Mars Approach",           10,  "Decelerating into Mars capture orbit"),
    ("Aerocapture & EDL",       3,   "Entry, Descent & Landing through Martian atmosphere"),
    ("Surface Arrival",         4,   "Final descent and touchdown on Mars"),
]

RISKS = [
    ("Solar Particle Event (SPE)",     0.30, "HIGH",   "Radiation shielding, storm shelter protocol"),
    ("Galactic Cosmic Ray exposure",   0.95, "MEDIUM", "Ongoing — increases cancer risk ~3 %"),
    ("Micrometeorite impact",          0.08, "HIGH",   "Whipple shield, hull integrity monitoring"),
    ("Life-support failure",           0.05, "CRIT",   "Redundant ECLSS systems, emergency O₂"),
    ("Navigation error",               0.04, "HIGH",   "Deep Space Network tracking + IMU"),
    ("Mental health / crew conflict",  0.70, "MEDIUM", "Psych training, private quarters, comms"),
    ("Equipment malfunction",          0.40, "MEDIUM", "Spare parts, 3-D printer on board"),
    ("Communication blackout",         0.20, "LOW",    "Up to 24-min delay; pre-planned autonomy"),
    ("Entry trajectory error (EDL)",   0.06, "CRIT",   "Redundant parachutes, retro-rockets"),
    ("Dust storm on Mars surface",     0.50, "MEDIUM", "Weather satellite, reinforced habitat"),
]


# ─────────────────────────────────────────────
#  CONSUMABLES
# ─────────────────────────────────────────────
def consumables(crew_size, days):
    food   = crew_size * days * FOOD_KG_PER_DAY
    water  = crew_size * days * WATER_KG_PER_DAY * 0.10   # 90 % recycled
    o2     = crew_size * days * O2_KG_PER_DAY
    total  = food + water + o2
    return {"food_kg": food, "water_kg": water, "o2_kg": o2, "total_kg": total}


# ─────────────────────────────────────────────
#  LIVE SIMULATION
# ─────────────────────────────────────────────
EVENTS = [
    (10,  "INFO",  "Systems nominal. Earth receding in rear camera."),
    (25,  "INFO",  "Crew complete first sleep cycle in microgravity."),
    (40,  "WARN",  "Minor thruster anomaly detected — resolved by auto-repair."),
    (60,  "ALERT", "Solar particle event! Crew move to storm shelter for 18 h."),
    (85,  "INFO",  "Halfway point reached. Speed: 30 km/s relative to Sun."),
    (110, "INFO",  "Asteroid belt boundary crossed — radar clear."),
    (130, "WARN",  "CO₂ scrubber filter replacement ahead of schedule."),
    (160, "INFO",  "First glimpse of Mars disc in telescope — crew morale high."),
    (190, "ALERT", "Micrometeorite strike on outer shield — Whipple buffer absorbed impact."),
    (220, "INFO",  "Mars now dominant object ahead. Braking burn commencing."),
    (245, "INFO",  "Aerobraking through upper Martian atmosphere — G-forces nominal."),
    (251, "ALERT", "Dust storm detected in landing zone — alternate site selected."),
    (253, "INFO",  "Touchdown! Mission Control confirms safe landing on Mars."),
]


def simulate_flight(days_total=MISSION_DURATION_DAYS, speed=0.02):
    """Animate day-by-day flight with random minor events."""
    print()
    banner("▶  LIVE FLIGHT SIMULATION", C.MAGENTA)
    print(clr(f"  Total mission duration: {days_total} days  |  1 bar = 10 days\n", C.DIM))

    event_map = {e[0]: e for e in EVENTS}
    day = 0
    dist_total = EARTH_MARS_AVG_KM

    for day in range(1, days_total + 1):
        dist_covered = dist_total * (day / days_total)
        remaining    = dist_total - dist_covered
        speed_kmh    = (dist_covered / day) / 24   # avg km/h that day

        # Print event if one exists for this day
        if day in event_map:
            _, level, msg = event_map[day]
            col = {
                "INFO":  C.GREEN,
                "WARN":  C.YELLOW,
                "ALERT": C.RED,
            }.get(level, C.WHITE)
            tag = clr(f" [{level}] ", col + C.BOLD)
            print(f"\n  Day {day:>3}{tag}{msg}")
            time.sleep(speed * 5)

        # Progress every 10 days
        if day % 10 == 0 or day == days_total:
            pct = day / days_total
            filled = int(50 * pct)
            bar = clr("█" * filled, C.CYAN) + clr("░" * (50 - filled), C.DIM)
            print(f"\r  Day {day:>3}/{days_total}  [{bar}]  "
                  f"{dist_covered/1e6:6.1f}M km  "
                  f"{remaining/1e6:6.1f}M km left", end="", flush=True)
            time.sleep(speed)

    print(f"\n\n  {clr('🛬  LANDED ON MARS', C.GREEN + C.BOLD)}\n")


# ─────────────────────────────────────────────
#  DISPLAY FUNCTIONS
# ─────────────────────────────────────────────
def show_fuel(crew_size, extra_payload=0):
    section("FUEL & PROPULSION ANALYSIS  (Tsiolkovsky Rocket Equation)")
    payload = PAYLOAD_KG + extra_payload
    f = fuel_analysis(crew_size, payload)

    print(f"  {'Engine type':<32} LOX / LH₂ chemical rocket")
    print(f"  {'Specific Impulse (Isp)':<32} {f['isp']} s")
    print(f"  {'Δv budget':<32} {f['delta_v']:,} m/s")
    print(f"  {'Dry mass (ship + payload)':<32} {f['dry_mass']:>10,.0f} kg")
    print(f"  {'Propellant required':<32} {f['propellant']:>10,.0f} kg")
    print(f"  {'Gross (wet) mass at launch':<32} {f['gross_mass']:>10,.0f} kg")
    print(f"  {'Mass ratio':<32} {f['mass_ratio']:>10.2f}×")
    print()
    progress_bar("Propellant fraction",
                 f["propellant"], f["gross_mass"], colour=C.YELLOW)
    progress_bar("Payload / dry structure",
                 f["dry_mass"], f["gross_mass"], colour=C.CYAN)


def show_consumables(crew_size):
    section("CONSUMABLES  (one-way trip, 90 % water recycling)")
    c = consumables(crew_size, MISSION_DURATION_DAYS)
    print(f"  {'Crew size':<28} {crew_size} astronauts")
    print(f"  {'Mission duration':<28} {MISSION_DURATION_DAYS} days")
    print(f"  {'Food':<28} {c['food_kg']:>8,.1f} kg")
    print(f"  {'Water (net make-up)':<28} {c['water_kg']:>8,.1f} kg")
    print(f"  {'Oxygen':<28} {c['o2_kg']:>8,.1f} kg")
    print(f"  {'Total consumables':<28} {c['total_kg']:>8,.1f} kg")
    print()
    progress_bar("Food",   c["food_kg"],  c["total_kg"], colour=C.GREEN)
    progress_bar("Water",  c["water_kg"], c["total_kg"], colour=C.BLUE)
    progress_bar("Oxygen", c["o2_kg"],    c["total_kg"], colour=C.CYAN)


def show_risks():
    section("RISK REGISTER")
    hdr = f"  {'Risk Event':<38} {'Prob':>5}  {'Sev':<6}  Mitigation"
    print(clr(hdr, C.DIM))
    print(clr("  " + "─" * 90, C.DIM))
    for name, prob, severity, mitigation in RISKS:
        col = {
            "CRIT":   C.RED + C.BOLD,
            "HIGH":   C.RED,
            "MEDIUM": C.YELLOW,
            "LOW":    C.GREEN,
        }.get(severity, C.WHITE)
        sev_tag = clr(f"{severity:<6}", col)
        print(f"  {name:<38} {prob*100:>4.0f}%  {sev_tag}  {mitigation}")


def show_phases():
    section("MISSION PHASES")
    day = 0
    for name, dur, desc in MISSION_PHASES:
        day_range = f"Day {day+1}–{day+dur}"
        print(f"  {clr(day_range, C.CYAN):>20}  {clr(name, C.BOLD):<30}  {clr(desc, C.DIM)}")
        day += dur


def show_distances():
    section("EARTH–MARS DISTANCES")
    for label, km in [
        ("Closest approach (perihelion)", EARTH_MARS_MIN_KM),
        ("Average (used in simulation)",  EARTH_MARS_AVG_KM),
        ("Farthest (aphelion)",           EARTH_MARS_MAX_KM),
    ]:
        light_min = km / (299_792 * 60)
        print(f"  {label:<38} {km/1e6:6.1f}M km  "
              f"({light_min:.1f} light-minutes)")


def show_summary(crew_size, extra_payload=0):
    payload = PAYLOAD_KG + extra_payload
    f = fuel_analysis(crew_size, payload)
    c = consumables(crew_size, MISSION_DURATION_DAYS)
    total_launch_mass = f["gross_mass"] + c["total_kg"]

    section("MISSION SUMMARY")
    print(f"  {'Crew':<35} {crew_size} astronauts")
    print(f"  {'Transit time (one way)':<35} {MISSION_DURATION_DAYS} days (~8.4 months)")
    print(f"  {'Launch mass (fuel+ship+crew)':<35} {total_launch_mass:>10,.0f} kg")
    print(f"  {'Comm delay at avg distance':<35} ~12.5 minutes one-way")
    print(f"  {'Radiation dose (est.)':<35} ~300 mSv (≈ 15× chest CT)")
    print(f"  {'Surface gravity':<35} 0.38 g")
    print(f"  {'Atmospheric pressure on Mars':<35} ~0.6 kPa (< 1 % of Earth)")
    print()
    high_risk = [(r[0], r[2]) for r in RISKS if r[2] in ("CRIT", "HIGH")]
    print(clr("  ⚠  Critical / High risks to monitor:", C.RED + C.BOLD))
    for name, sev in high_risk:
        print(f"     • {name}  [{sev}]")


# ─────────────────────────────────────────────
#  RANDOM EVENTS DURING SIM
# ─────────────────────────────────────────────
def crew_status_check(crew_size):
    section("CREW STATUS CHECK")
    conditions = ["Excellent", "Good", "Nominal", "Mild fatigue", "Space-adapted"]
    for i in range(1, crew_size + 1):
        status = random.choice(conditions)
        col = C.GREEN if status in ("Excellent", "Good", "Nominal", "Space-adapted") else C.YELLOW
        print(f"  Astronaut #{i}   {clr(status, col)}")


# ─────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────
def get_int(prompt, default, min_val, max_val):
    while True:
        try:
            raw = input(prompt).strip()
            val = int(raw) if raw else default
            if min_val <= val <= max_val:
                return val
            print(f"  Please enter a value between {min_val} and {max_val}.")
        except ValueError:
            print("  Please enter a valid integer.")


def main():
    print("\033[2J\033[H", end="")   # clear screen
    banner("  🚀  MARS MISSION SIMULATOR  —  Python Edition", C.CYAN + C.BOLD)
    print(clr("  Realistic physics · Risk modelling · Live flight animation\n", C.DIM))

    # ── User config ──────────────────────────────────────────
    print(clr("  ── MISSION CONFIGURATION ─────────────────────────────", C.YELLOW))
    crew_size     = get_int("  Crew size [2–12, default 6]: ", 6, 2, 12)
    extra_payload = get_int("  Extra payload kg [0–50000, default 0]: ", 0, 0, 50_000)

    print()
    print(clr("  Simulation speed:", C.DIM))
    print("    1 = Fast   2 = Normal   3 = Slow")
    speed_choice = get_int("  Choose [default 2]: ", 2, 1, 3)
    sim_speed    = {1: 0.005, 2: 0.02, 3: 0.08}[speed_choice]

    # ── Static analyses ───────────────────────────────────────
    show_distances()
    show_phases()
    show_fuel(crew_size, extra_payload)
    show_consumables(crew_size)
    show_risks()
    show_summary(crew_size, extra_payload)

    # ── Flight sim ────────────────────────────────────────────
    print()
    input(clr("  ► Press ENTER to begin flight simulation …", C.MAGENTA + C.BOLD))
    simulate_flight(MISSION_DURATION_DAYS, speed=sim_speed)

    # ── Post-flight ───────────────────────────────────────────
    crew_status_check(crew_size)

    section("MISSION OUTCOME")
    critical_risk = any(r[2] == "CRIT" and random.random() < r[1] * 0.15 for r in RISKS)
    if critical_risk:
        slow_print(clr("  ⚠  A critical system failure occurred. Mission status: PARTIAL SUCCESS.", C.RED))
    else:
        slow_print(clr("  ✓  All crew safely arrived. Mission status: SUCCESS! 🎉", C.GREEN + C.BOLD))

    print(clr("\n  Thank you for flying with Mars Mission Simulator.\n", C.DIM))


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(clr("\n\n  Mission aborted by operator.\n", C.RED))