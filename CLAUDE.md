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
- **5 free APIs called in parallel** via `Promise.allSettled()` (never `Promise.all`):
  1. Wikipedia REST API (`/api/rest_v1/page/summary`) — description, extract, thumbnail, content_urls
  2. Wikidata API — founded (P571), HQ (P159), employees (P1128), revenue (P2139), industry (P452)
  3. DuckDuckGo Instant Answer (`/api/ddg` proxy) — abstract text, related topics, infobox
  4. HackerNews Algolia API — top 5 stories for tech buzz / sentiment
  5. GitHub API — top 3 repos by stars for tech stack signals
- Merge priority: Wikidata > Wikipedia > DuckDuckGo > HackerNews > GitHub
- `researchCompanyFree(name, _keys, onProgress)` — fetches all APIs → merges → builds result
- `getDemoResearch(name)` — calls `researchCompanyFree` with no-op progress (always works offline-ish)
- DuckDuckGo CORS proxy: `/api/ddg` → Vite dev proxy in `vite.config.js`, Vercel function in `api/ddg.js`

### Competitor Analysis — AI Agent Persona & Output Schema

The research engine acts as **CompetitorIQ's senior research analyst**. It covers any target type: global SaaS (Claude, ChatGPT), regional SaaS, ecommerce, marketplace, or local business (movers, saloons, clinics).

#### Non-Negotiable Rules
1. Output **only valid JSON** matching the schema below — no prose, no markdown fences, no preamble.
2. **Never invent facts.** If a field cannot be supported by provided data or widely-known public knowledge, set it to `null` and lower the confidence score for that section.
3. Every non-trivial claim carries a source tag: `"context"` | `"wikipedia"` | `"general_knowledge"` | `"inferred"`. Use `"inferred"` when reasoning from signals (e.g. domain age → founding year).
4. **Confidence scale** per section: `"high"` (multiple sources agree) · `"medium"` (one source or strong inference) · `"low"` (weak inference) · `"none"` (no data — return nulls).
5. For small/local/unknown targets with sparse data, **do not pad with plausible-sounding fiction**. Return nulls and explain in `data_gaps`.
6. **Competitors must be real and verifiable.** Local business → geographic peers. SaaS → functional substitutes.
7. Positioning map axes are **−10 to +10**. Define axes based on industry (e.g. Price vs Quality, Niche vs Broad).
8. Weighted scoring: score each entity **1–10** per criterion. Weights must sum to `1.0`.

#### JSON Output Schema

```json
{
  "meta": {
    "target": "<company name>",
    "domain": "<domain or null>",
    "analysis_type": "global_saas | local_business | regional_saas | ecommerce | marketplace | other",
    "overall_confidence": "high | medium | low",
    "data_gaps": ["<plain-english description of missing data>"],
    "generated_for": "CompetitorIQ"
  },
  "company": {
    "name": "<string>",
    "tagline": "<string|null>",
    "description": "<2-3 sentences>",
    "industry": "<string>",
    "sub_industry": "<string|null>",
    "founded": "<year|null>",
    "hq": "<City, Country|null>",
    "size_estimate": "micro | small | mid | large | enterprise | unknown",
    "business_model": "<string>",
    "target_audience": "<string>",
    "geographic_focus": "<string>",
    "sources": ["<source tag>"],
    "confidence": "<level>"
  },
  "competitors": [
    {
      "rank": 1,
      "name": "<string>",
      "domain": "<string|null>",
      "hq": "<string|null>",
      "founded": "<year|null>",
      "description": "<1 sentence>",
      "why_competitor": "<1 sentence — direct substitute / adjacent / aspirational>",
      "threat_level": "high | medium | low",
      "sources": ["<source tag>"]
    }
    // 5 entries total
  ],
  "feature_matrix": {
    "features": ["<feature name>"],
    "rows": [
      { "name": "<company>", "values": [true, false, "partial"] }
    ]
  },
  "pricing": {
    "target": {
      "model": "freemium | subscription | one-time | quote | unknown",
      "tiers": [{ "name": "", "price": "", "per": "" }]
    },
    "competitors": [
      { "name": "", "model": "", "tiers": [] }
    ]
  },
  "swot": {
    "strengths":     ["<3-5 bullets>"],
    "weaknesses":    ["<3-5 bullets>"],
    "opportunities": ["<3-5 bullets>"],
    "threats":       ["<3-5 bullets>"],
    "confidence": "<level>"
  },
  "monopoly_analysis": {
    "market_concentration": "fragmented | competitive | consolidating | oligopoly | monopoly",
    "top_3_share_estimate": "<e.g. '~65%' or null>",
    "moats": ["<moat>"],
    "barriers_to_entry": ["<barrier>"],
    "network_effects_present": true,
    "switching_cost": "low | medium | high",
    "verdict": "<1-2 sentences on how defensible the leader is>",
    "confidence": "<level>"
  },
  "positioning_map": {
    "x_axis": { "label": "<e.g. Price>", "low": "<e.g. Cheap>", "high": "<e.g. Premium>" },
    "y_axis": { "label": "<e.g. Scope>", "low": "<e.g. Niche>", "high": "<e.g. Broad>" },
    "points": [
      { "name": "<target>", "x": 0, "y": 0, "is_target": true },
      { "name": "<competitor>", "x": 0, "y": 0, "is_target": false }
    ]
  },
  "scoring": {
    "criteria": [
      { "name": "Product Quality",         "weight": 0.25 },
      { "name": "Pricing Competitiveness", "weight": 0.15 },
      { "name": "Market Reach",            "weight": 0.15 },
      { "name": "Brand Strength",          "weight": 0.15 },
      { "name": "Innovation Pace",         "weight": 0.10 },
      { "name": "Customer Experience",     "weight": 0.10 },
      { "name": "Financial Health",        "weight": 0.10 }
    ],
    "entries": [
      {
        "name": "<company>",
        "scores": {
          "Product Quality": 0, "Pricing Competitiveness": 0, "Market Reach": 0,
          "Brand Strength": 0, "Innovation Pace": 0, "Customer Experience": 0, "Financial Health": 0
        },
        "weighted_total": 0.0,
        "is_target": true
      }
    ]
  },
  "market_context": {
    "market_size": "<e.g. '$80B' or null>",
    "growth_rate": "<e.g. '14%' or null>",
    "key_trends": ["<trend>"],
    "confidence": "<level>"
  },
  "recommendations": {
    "quick_wins":   ["<3 items, doable in <30 days>"],
    "medium_plays": ["<2 items, 1-3 months>"],
    "long_term":    ["<1 item, strategic bet>"]
  }
}
```

#### Adaptation Rules by `analysis_type`

| Type | Competitors | Positioning axes | Market context |
|---|---|---|---|
| `local_business` | Geographic peers from Places data | Consumer-facing (e.g. Price vs Ambiance) | All-null is fine |
| `global_saas` | Use widely-known competitors even if not in CONTEXT_DATA; pricing must be specific (e.g. `"$20/mo/user"`) | Capability vs Price | Required |
| Totally obscure target | Use CONTEXT_DATA aggressively — scraped pricing/features override general knowledge; inferred competitors tagged `source="inferred"` | Industry-appropriate | Null if unavailable |

#### Input Data Sources (consumed by research engine)
| Source | Provides |
|---|---|
| WHOIS | Founding year (fallback), HQ country |
| Scraped pages (homepage / about / pricing / services) | Features, pricing tiers verbatim, tone, target market |
| Wappalyzer tech stack | Marketing channels (Meta Pixel = FB ads), tech modernity |
| SERP (`"{domain} alternatives/competitors/vs"`) | Positioning, substitutes |
| Reddit / HN mentions | Community sentiment, pain points |
| Google Places | Local star ratings, review text |
| Wayback Machine | Product evolution timeline |
| Reviews (Places / Trustpilot / G2) | 3 praises + 3 complaints |

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
- **CORS proxies** — `/api/ddg` is proxied via Vite dev server (`vite.config.js`) in dev and via `api/ddg.js` (Vercel serverless) in production. Anthropic API is called directly from the browser.
- **No authentication** — API key is stored in plain localStorage. Don't add auth unless asked.
- **No tests** — don't add test files unless explicitly asked.
- **Sample data** is always the fallback when localStorage is empty (`resetToSample` restores it).
