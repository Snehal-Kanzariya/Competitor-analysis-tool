# CompetitorIQ — Claude Code Instructions

## Project Overview
A React SaaS dashboard for AI-powered competitive intelligence. No backend — all data in localStorage, AI calls go directly to Anthropic API from the browser.

## Stack
- **React 19** + **Vite 7** + **Tailwind CSS 4**
- **React Router DOM 7** for routing
- **Zustand 5** for state management (no persist middleware — manual localStorage)
- **Lucide React** for icons
- **No testing framework** currently set up

## Dev Commands
```bash
npm run dev      # start dev server
npm run build    # production build
npm run lint     # ESLint
npm run preview  # preview production build
```

## Architecture

### State (`src/store/useStore.js`)
Single Zustand store with manual localStorage persistence (key: `competitoriq-data`). Every mutating action calls `saveData(getState(updated))` before returning.

State shape:
- `competitors` — array of competitor objects (id, name, website, industry, founded, hq, employees, description, estimatedRevenue, marketShare, score, trend, status, color, strengths[], weaknesses[], opportunities[], threats[])
- `features` — array of `{ id, name, category }`
- `featureScores` — `{ [competitorId]: { [featureId]: "yes"|"no"|"partial" } }`
- `monopoly` — HHI + barriers + disruption data
- `marketOverview` — totalMarketSize, growthRate, marketType, keyTrend
- `apiKey` — Anthropic API key (stored in localStorage, sent directly to API)
- `pastResearches` — last 20 research queries
- `currentResearchQuery` — current research subject

### Routing (`src/App.jsx`)
All routes share `<Layout>` (sidebar + `<Outlet>`):
- `/` → Dashboard
- `/research` → AI Research
- `/competitor/:id` → CompetitorProfile
- `/compare` → Comparison Matrix
- `/monopoly` → Monopoly Analysis
- `/settings` → Settings
- `/swot`, `/positioning`, `/scoring` → ComingSoon placeholders

### AI Research (`src/services/researchEngine.js`)
- Model: `claude-sonnet-4-20250514` with `web_search_20250305` tool
- `researchCompany(name, apiKey, onProgress)` — two Claude API calls → parsed result → `loadResearch()` → redirect to dashboard
- `getDemoResearch(name)` — sample data fallback when no API key
- API called directly from browser with `x-api-key` header (no proxy/backend)

## Key Conventions

### Component Structure
- Pages live in `src/pages/`
- Reusable components in `src/components/<FeatureName>/`
- Layout components in `src/components/Layout/`

### Styling
- Tailwind CSS 4 utility classes only — no CSS modules, no styled-components
- Dark theme: use `bg-gray-900`, `bg-gray-800`, `bg-gray-700` for backgrounds
- Borders: `border-gray-700` or `border-gray-600`
- Text: `text-white`, `text-gray-300`, `text-gray-400`
- Accent: blue (`blue-500`/`blue-600`), purple (`purple-500`), green (`green-500`), yellow (`yellow-500`), pink (`pink-500`)

### Icons
Use Lucide React. Import individually: `import { IconName } from 'lucide-react'`

### State Access
Always use the Zustand hook: `const { competitors, addCompetitor } = useStore()`

### IDs
- Competitors: `Date.now().toString()` for manual adds, `"main"` / `"comp-0"` etc. for research results
- Features: `"f" + Date.now()` for manual adds, `"f-0"`, `"f-1"` etc. for research results

## Pages Not Yet Implemented
These routes render `<ComingSoon>` — build them when asked:
- `/swot` — SWOT Analysis (per-competitor matrix)
- `/positioning` — 2x2 quadrant market positioning chart
- `/scoring` — Weighted scoring table with customizable criteria weights

## Important Notes
- **No CORS proxy** — Anthropic API is called directly from the browser. This works in dev; deployment may need `anthropic-dangerous-direct-browser-access: true` header or a proxy.
- **No authentication** — API key is stored in plain localStorage. Don't add auth unless asked.
- **No tests** — don't add test files unless explicitly asked.
- **Sample data** is always the fallback when localStorage is empty (`resetToSample` restores it).
