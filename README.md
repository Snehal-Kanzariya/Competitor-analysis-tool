# CompetitorIQ 🔍

AI-powered competitor analysis platform that lets you research any company and get a complete competitive landscape — for free.

**🌐 Live Demo:** https://competitor-analysis-tool-roan.vercel.app

## Features

- **AI Research Engine** — Enter any company name, get instant competitor data using Wikipedia API + curated industry database (50+ industries)
- **Dashboard** — Overview of all competitors with scores, trends, and market stats
- **Feature Comparison Matrix** — Side-by-side feature comparison with Yes/Partial/No scoring
- **SWOT Analysis** — Auto-generated strengths, weaknesses, opportunities & threats for each competitor
- **Monopoly Analysis** — HHI index, market concentration, barriers to entry, disruption opportunities
- **Market Positioning Map** — Interactive scatter plot showing competitors by price vs quality
- **Weighted Scoring Engine** — Customizable criteria with drag-to-reorder and weighted rankings
- **Export & Reports** — Download analysis as PDF, HTML, CSV, or JSON

## Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **State:** Zustand with localStorage persistence
- **Icons:** Lucide React
- **Routing:** React Router v6
- **Data:** Wikipedia API + Built-in industry database
- **Deploy:** Vercel

## Getting Started
```bash
git clone https://github.com/Snehal-Kanzariya/Competitor-analysis-tool.git
cd Competitor-analysis-tool
npm install
npm run dev
```

Open http://localhost:5173

## How It Works

1. Enter a company name in AI Research
2. System checks the built-in database (50+ industries) and fetches Wikipedia data
3. Automatically generates competitor profiles, SWOT, features, market data
4. All 7 analysis modules populate instantly
5. Export your analysis in PDF, HTML, CSV, or JSON

## Supported Industries

Fast Food, SaaS, E-commerce, Streaming, Automotive, Sportswear, Social Media, AI/ML, Cloud Computing, Fintech, Food Delivery, Ride-Hailing, Design Tools, Airlines, Gaming, Pharma, IT Services, Consulting, Retail, and more.

## License

MIT

Then commit and push: git add -A && git commit -m "Update README with full project documentation" && git push origin main
