# 🚀 Mars Mission Simulator

A full-stack Next.js app simulating a crewed mission to Mars — fuel physics, risk modelling, and a live animated flight simulation.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React 18**

## Getting Started

### 1. Install dependencies

```bash
cd mars-mission
npm install
```

### 2. Run in development mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production

```bash
npm run build
npm start
```

## Deploy to Vercel (free)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Vercel auto-detects Next.js — click **Deploy**
4. Live URL in ~60 seconds ✓

## Deploy to Netlify (free)

1. Run `npm run build` locally
2. Drag the `.next` folder to [app.netlify.com/drop](https://app.netlify.com/drop)

## Project Structure

```
mars-mission/
├── app/
│   ├── layout.tsx        # Root layout + metadata
│   ├── page.tsx          # Main page (tab controller)
│   └── globals.css       # Space theme styles
├── components/
│   ├── MissionConfig.tsx # Crew/payload/speed controls
│   ├── OverviewTab.tsx   # Mission metrics + consumables
│   ├── FuelTab.tsx       # Rocket equation + mass breakdown
│   ├── RiskTab.tsx       # Risk register table
│   ├── PhasesTab.tsx     # Mission timeline
│   └── SimulationTab.tsx # Live animated flight
└── lib/
    └── mission-data.ts   # All physics + data constants
```

## Features

- **Tsiolkovsky Rocket Equation** — real propellant math, recalculates live as you change crew/payload
- **Consumables calculator** — food, water (90% recycling), O₂ for the full crew
- **Risk Register** — 10 hazards with probability bars, severity badges, mitigations
- **Mission Phases** — 7 phases with timeline visualization
- **Live Simulation** — animated day-by-day flight with 13 story events, crew status on landing, and a randomized outcome
