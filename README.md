# CompetitorIQ

AI-powered competitive intelligence dashboard. Research any company and get a structured 9-section competitor analysis — company overview, SWOT, pricing, tech stack, customer sentiment, positioning, and actionable recommendations.

**Live demo:** https://competitor-analysis-tool-roan.vercel.app

---

## Features

- **AI Research Engine** — enter a company name and get a full competitor profile pulled from Wikipedia, Wikidata, DuckDuckGo, HackerNews, and GitHub in parallel
- **Comparison Matrix** — side-by-side feature scoring (yes / partial / no) across all tracked competitors, with CSV export
- **Monopoly Analysis** — HHI concentration meter, market share chart, barriers to entry, disruption signals
- **Dashboard** — competitor cards with score, trend, and status badges; search, filter, sort
- **Competitor Profiles** — per-company detail view with SWOT, strengths/weaknesses, company info
- **Dark theme** throughout; fully responsive (mobile, tablet, desktop)
- **No backend** — all data in `localStorage`; Anthropic API called directly from the browser

---

## Stack

| Layer | Choice |
|---|---|
| UI | React 19 + Vite 7 |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| State | Zustand 5 (manual localStorage persistence) |
| Icons | Lucide React |
| Deployment | Vercel (with serverless DuckDuckGo proxy) |

---

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
```

### Optional: Anthropic API key

Add your key in **Settings** (gear icon) to enable full AI-powered research. Without it the app falls back to free public APIs only.

If you also use Google Custom Search, set these in `.env.local`:

```
VITE_GOOGLE_API_KEY=your_key_here
VITE_GOOGLE_SEARCH_ENGINE_ID=your_engine_id_here
```

---

## Dev Commands

```bash
npm run dev      # start dev server with HMR
npm run build    # production build
npm run lint     # ESLint
npm run preview  # preview production build locally
```

---

## Analysis Output Format

The AI research engine returns **structured JSON** — not prose — so every field can be wired directly into dashboard components. The schema covers:

| Section | What it contains |
|---|---|
| `meta` | Target, domain, analysis type, overall confidence, data gaps |
| `company` | Name, tagline, description, industry, founded, HQ, size estimate, business model, target audience |
| `competitors` | 5 ranked competitors with threat level, why they compete, and source tags |
| `feature_matrix` | Feature × competitor grid (true / false / "partial") |
| `pricing` | Pricing model + tiers for target and each competitor |
| `swot` | 3–5 bullets per quadrant, with per-section confidence |
| `monopoly_analysis` | Market concentration, moats, barriers to entry, switching cost, network effects |
| `positioning_map` | Industry-appropriate x/y axes, coordinates for every player on −10 to +10 scale |
| `scoring` | Weighted 1–10 scores across 7 criteria; weighted total per company |
| `market_context` | Market size, growth rate, key trends |
| `recommendations` | 3 quick wins (<30 days), 2 medium plays (1–3 months), 1 long-term strategic bet |

**Source tagging** — every claim is tagged `"context"`, `"wikipedia"`, `"general_knowledge"`, or `"inferred"`. Fields with no supporting data are `null`, never fabricated.

**Works for any target type:** global SaaS platforms (ChatGPT, Claude, Notion), regional SaaS, ecommerce, marketplace, or local businesses (moving companies, restaurants, clinics) — axes and competitor selection adapt per `analysis_type`.

Data sources: Wikipedia, Wikidata, DuckDuckGo Instant Answer, HackerNews, GitHub, WHOIS, Google Places, Wayback Machine, Trustpilot/G2 reviews, scraped homepage/pricing pages.

---

## Project Structure

```
src/
  pages/          # Route-level page components
  components/     # Reusable UI components (by feature)
    Layout/       # Sidebar + Layout shell
  services/
    researchEngine.js   # AI + free API research logic
  store/
    useStore.js   # Zustand store + localStorage persistence
api/
  ddg.js          # Vercel serverless CORS proxy for DuckDuckGo
```

---

## Design Reference

Wireframes & design system: https://claude.ai/public/artifacts/36e7a1d2-e321-4d62-86a2-ba9babacde20
