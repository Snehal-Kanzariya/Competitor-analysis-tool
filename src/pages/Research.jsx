import { useState } from 'react';
import {
  Search, Sparkles, ArrowRight, Building2, Loader2, History, Zap,
  Database, Globe, CheckCircle, AlertCircle, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { researchCompanyFree } from '../services/researchEngine';
import useStore from '../store/useStore';
import ModeToggle from '../components/ModeToggle';
import ScopeFilter from '../components/ScopeFilter';
import SaturationMeter from '../components/SaturationMeter';
import WhitespaceGrid from '../components/WhitespaceGrid';
import VerdictCard from '../components/VerdictCard';

const exampleCompanies = [
  { name: "McDonald's", industry: 'Fast Food' },
  { name: 'Slack', industry: 'SaaS' },
  { name: 'Nike', industry: 'Sportswear' },
  { name: 'Shopify', industry: 'E-commerce' },
  { name: 'Netflix', industry: 'Streaming' },
  { name: 'Tesla', industry: 'Automotive' },
];

const ideaExamples = [
  'A tool to help freelancers in India file GST returns from WhatsApp invoices',
  'A subscription box for hobbyist 3D printing enthusiasts',
  'An AI-powered meal planning app for families with dietary restrictions',
];

function transformClaudeToStore(claudeData, query) {
  const { company, competitors: comps = [], swot, feature_matrix, monopoly_analysis, market_context, scoring } =
    claudeData;

  const colors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'];
  const allCompetitors = [];

  const mainEntry = scoring?.entries?.find((e) => e.is_target);
  allCompetitors.push({
    id: 'main',
    name: company?.name ?? query,
    website: claudeData.meta?.domain ?? '',
    industry: company?.industry ?? '',
    founded: company?.founded?.toString() ?? '',
    hq: company?.hq ?? '',
    employees: '',
    description: company?.description ?? '',
    estimatedRevenue: '',
    marketShare: '',
    score: Math.min(100, Math.round((mainEntry?.weighted_total ?? 7) * 10)),
    trend: '+5',
    status: 'Target',
    color: colors[0],
    geographic_scope: 'global',
    strengths: swot?.strengths ?? [],
    weaknesses: swot?.weaknesses ?? [],
    opportunities: swot?.opportunities ?? [],
    threats: swot?.threats ?? [],
    createdAt: new Date().toISOString(),
  });

  comps.forEach((comp, i) => {
    const entry = scoring?.entries?.find((e) => e.name === comp.name);
    allCompetitors.push({
      id: `comp-${i}`,
      name: comp.name,
      website: comp.domain ?? '',
      industry: company?.industry ?? '',
      founded: comp.founded?.toString() ?? '',
      hq: comp.hq ?? '',
      employees: '',
      description: comp.description ?? '',
      estimatedRevenue: '',
      marketShare: '',
      score: Math.min(100, Math.round((entry?.weighted_total ?? Math.max(5, 7 - i * 0.5)) * 10)),
      trend: ['+5', '+2', '-1', '+8', '+3'][i % 5],
      status: ['Leader', 'Contender', 'Follower', 'Rising', 'Contender'][i % 5],
      color: colors[(i + 1) % colors.length],
      geographic_scope: comp.geographic_scope ?? 'national',
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
      createdAt: new Date().toISOString(),
    });
  });

  const features = (feature_matrix?.features ?? []).map((name, i) => ({ id: `f-${i}`, name, category: 'Core' }));
  const featureScores = {};
  allCompetitors.forEach((comp) => {
    const row = feature_matrix?.rows?.find((r) => r.name === comp.name);
    featureScores[comp.id] = {};
    features.forEach((f, fi) => {
      const val = row?.values?.[fi];
      featureScores[comp.id][f.id] = val === true ? 'yes' : val === false ? 'no' : 'partial';
    });
  });

  const m = monopoly_analysis ?? {};
  return {
    query,
    timestamp: new Date().toISOString(),
    competitors: allCompetitors,
    features,
    featureScores,
    marketOverview: {
      totalMarketSize: market_context?.market_size ?? 'N/A',
      growthRate: market_context?.growth_rate ?? 'N/A',
      marketType: 'Competitive',
      keyTrend: market_context?.key_trends?.[0] ?? 'AI and digital transformation',
    },
    monopoly: {
      hhi: 1500,
      concentrationLevel: m.market_concentration ?? 'Moderate',
      dominantPlayer: allCompetitors[0]?.name ?? '',
      dominantPlayerShare: m.top_3_share_estimate ?? 'N/A',
      barriers: m.barriers_to_entry ?? [],
      disruptionOpportunities: [],
      marketTrend: 'Stable',
      nichesAvailable: [],
    },
  };
}

// Free idea competitive scan — no API key required
async function analyzeIdeaFree(ideaText) {
  const q = `${ideaText.slice(0, 80)} alternatives competitors`;
  const [ddgRes, hnRes] = await Promise.allSettled([
    fetch(`/api/ddg?q=${encodeURIComponent(q)}`).then((r) => r.json()),
    fetch(
      `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(ideaText.slice(0, 80))}&tags=story&hitsPerPage=5`
    ).then((r) => r.json()),
  ]);
  const ddg = ddgRes.status === 'fulfilled' ? ddgRes.value : null;
  const hn = hnRes.status === 'fulfilled' ? hnRes.value : null;
  return {
    _freeMode: true,
    abstract: ddg?.Abstract || '',
    relatedTopics: (ddg?.RelatedTopics || []).filter((t) => t.Text && !t.Topics).slice(0, 8),
    hnStories: (hn?.hits || []).slice(0, 5),
  };
}

export default function Research() {
  const navigate = useNavigate();
  const loadResearch = useStore((s) => s.loadResearch);
  const pastResearches = useStore((s) => s.pastResearches);
  const runIdeaAnalysis = useStore((s) => s.runIdeaAnalysis);
  const apiKey = useStore((s) => s.apiKey);

  const [mode, setMode] = useState('company');

  // Company mode state
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');

  // Idea mode state
  const [ideaText, setIdeaText] = useState('');
  const [targetGeo, setTargetGeo] = useState('');
  const [targetCustomer, setTargetCustomer] = useState('');
  const [stage, setStage] = useState('');
  const [ideaLoading, setIdeaLoading] = useState(false);
  const [ideaError, setIdeaError] = useState('');
  const [ideaResult, setIdeaResult] = useState(null);
  const [showIdeaDetails, setShowIdeaDetails] = useState(false);

  // ─── Company Mode — always free ───────────────────────────────────────────

  const handleResearch = async (companyName) => {
    const name = companyName || query.trim();
    if (!name) return;
    setLoading(true);
    setError('');
    setProgress({ step: 0, total: 4, message: 'Starting research...' });
    try {
      const result = await researchCompanyFree(name, null, setProgress);
      loadResearch(result);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Research failed. Please try again.');
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  // ─── Idea Mode — Claude if key+credits, free scan otherwise ──────────────

  const handleIdeaAnalysis = async () => {
    if (!ideaText.trim()) return;
    setIdeaLoading(true);
    setIdeaError('');
    setIdeaResult(null);

    try {
      // Try Claude AI if API key is configured
      if (apiKey) {
        const result = await runIdeaAnalysis({
          ideaText,
          targetGeo: targetGeo || undefined,
          targetCustomer: targetCustomer || undefined,
          stage: stage || undefined,
        });
        if (result.ok) {
          setIdeaResult(result.data);
          setShowIdeaDetails(false);
          return;
        }
        // Claude failed (e.g. no credits) — fall through to free scan
      }
      // Free competitive scan — DuckDuckGo + HackerNews, no API key needed
      const freeResult = await analyzeIdeaFree(ideaText);
      setIdeaResult(freeResult);
    } catch (err) {
      setIdeaError(err.message || 'Analysis failed');
    } finally {
      setIdeaLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center max-w-2xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-7 md:mb-8 w-full pt-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
          <Sparkles size={26} className="text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          AI Competitive Intelligence
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Analyze any company or validate a startup idea with AI-powered research.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="w-full">
        <ModeToggle mode={mode} onChange={(m) => { setMode(m); setError(''); setIdeaError(''); setIdeaResult(null); }} />
      </div>

      {/* ── COMPANY MODE ── */}
      {mode === 'company' && (
        <div className="w-full">
          {/* Scope Filter */}
          <div className="mb-4">
            <ScopeFilter />
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
              placeholder="Enter company name (e.g. Shopify, bronte-movers.com)..."
              disabled={loading}
              className="w-full pl-11 pr-28 md:pr-36 py-3.5 rounded-2xl border-2 border-slate-200 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all placeholder:text-slate-300 bg-white shadow-sm disabled:opacity-60"
            />
            <button
              onClick={() => handleResearch()}
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-2.5 bg-blue-500 text-white rounded-xl text-xs md:text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-blue-500/20"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
              {loading ? 'Analyzing' : 'Analyze'}
            </button>
          </div>

          {/* Free mode badge */}
          <div className="mb-5 flex items-center gap-2 text-xs px-4 py-2 rounded-lg border text-emerald-600 bg-emerald-50 border-emerald-100">
            <CheckCircle size={14} className="shrink-0" />
            <span><strong>Free mode</strong> — Wikipedia + Wikidata + DuckDuckGo + HackerNews + GitHub. No API key needed.</span>
          </div>

          {/* Progress Bar */}
          {loading && progress && (
            <div className="w-full mb-6 bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 size={18} className="text-blue-500 animate-spin" />
                <span className="text-sm font-medium text-slate-700">{progress.message}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
                  style={{ width: `${Math.round((progress.step / progress.total) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-slate-400">
                <span>Step {progress.step} of {progress.total}</span>
                <span>{Math.round((progress.step / progress.total) * 100)}%</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="w-full mb-5 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <span className="text-sm text-red-700 flex-1">{error}</span>
              <button onClick={() => setError('')} className="text-xs text-red-400 underline shrink-0">Dismiss</button>
            </div>
          )}

          {/* Examples */}
          {!loading && (
            <>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Try an example
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
                {exampleCompanies.map((company) => (
                  <button
                    key={company.name}
                    onClick={() => { setQuery(company.name); handleResearch(company.name); }}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition-all text-left group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors shrink-0">
                      <Building2 size={16} className="text-slate-400 group-hover:text-blue-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-700">{company.name}</div>
                      <div className="text-[11px] text-slate-400">{company.industry}</div>
                    </div>
                    <ArrowRight size={14} className="text-slate-200 group-hover:text-blue-400 shrink-0 transition-colors" />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Past Researches */}
          {!loading && pastResearches?.length > 0 && (
            <div className="w-full mt-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <History size={12} /> Recent Researches
              </div>
              <div className="space-y-2">
                {pastResearches.slice(0, 5).map((r, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuery(r.query); handleResearch(r.query); }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-blue-200 transition-all text-left"
                  >
                    <Globe size={14} className="text-slate-300 shrink-0" />
                    <span className="text-sm text-slate-600 truncate">{r.query}</span>
                    <span className="text-[10px] text-slate-300 ml-auto shrink-0">
                      {new Date(r.timestamp).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* How it works */}
          {!loading && (
            <div className="w-full mt-8 pt-6 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">How it works</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Search, title: '1. Search', desc: 'Enter company name' },
                  { icon: Database, title: '2. Collect', desc: '5 free data sources' },
                  { icon: Globe, title: '3. Merge', desc: 'Best data wins' },
                  { icon: Sparkles, title: '4. Insights', desc: 'Dashboard ready' },
                ].map((step, i) => (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-2">
                      <step.icon size={18} className="text-slate-400" />
                    </div>
                    <div className="text-sm font-semibold text-slate-700">{step.title}</div>
                    <div className="text-xs text-slate-400 mt-1">{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── IDEA MODE ── */}
      {mode === 'idea' && (
        <div className="w-full">
          {/* Mode info banner */}
          <div className={`mb-4 flex items-start gap-3 p-4 rounded-xl border ${
            apiKey
              ? 'bg-blue-50 border-blue-100'
              : 'bg-emerald-50 border-emerald-100'
          }`}>
            <CheckCircle size={16} className={`shrink-0 mt-0.5 ${apiKey ? 'text-blue-500' : 'text-emerald-500'}`} />
            <div className={`text-sm ${apiKey ? 'text-blue-700' : 'text-emerald-700'}`}>
              {apiKey ? (
                <><strong>AI-powered analysis</strong> — Claude will analyze saturation, whitespace, and give a go/no-go verdict.</>
              ) : (
                <><strong>Free competitive scan</strong> — Finds related players via DuckDuckGo + HackerNews.{' '}
                <a href="/settings" className="underline">Add API key</a> for AI saturation scoring, whitespace map, and verdict.</>
              )}
            </div>
          </div>

          {/* Main textarea */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Describe your startup idea
            </label>
            <textarea
              rows={5}
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="e.g. A tool to help freelancers in India file GST returns from WhatsApp invoices — uploads photos, auto-fills forms, and submits to GSTN portal."
              disabled={ideaLoading}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all placeholder:text-slate-300 bg-white shadow-sm disabled:opacity-60 resize-none"
            />
          </div>

          {/* Example ideas */}
          <div className="mb-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Try an example
            </div>
            <div className="space-y-2">
              {ideaExamples.map((idea, i) => (
                <button
                  key={i}
                  onClick={() => setIdeaText(idea)}
                  className="w-full text-left text-xs text-slate-500 px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  &ldquo;{idea}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Optional context fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Target Geography
              </label>
              <input
                type="text"
                value={targetGeo}
                onChange={(e) => setTargetGeo(e.target.value)}
                placeholder="e.g. India, Southeast Asia"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Target Customer
              </label>
              <input
                type="text"
                value={targetCustomer}
                onChange={(e) => setTargetCustomer(e.target.value)}
                placeholder="e.g. freelancers, SMBs"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Stage / Budget
              </label>
              <input
                type="text"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                placeholder="e.g. pre-seed, $10k"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300 bg-white"
              />
            </div>
          </div>

          {/* Analyze button */}
          <button
            onClick={handleIdeaAnalysis}
            disabled={ideaLoading || !ideaText.trim()}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mb-5"
          >
            {ideaLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Analyzing landscape...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Analyze Idea
              </>
            )}
          </button>

          {/* Idea error */}
          {ideaError && (
            <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <span className="text-sm text-red-700 flex-1">{ideaError}</span>
              <button onClick={() => setIdeaError('')} className="text-xs text-red-400 underline shrink-0">Dismiss</button>
            </div>
          )}

          {/* ─── IDEA RESULTS ─── */}
          {ideaResult && (
            <div className="w-full">
              {ideaResult._freeMode ? (
                /* ── Free scan results ── */
                <div>
                  <div className="mb-5 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-emerald-800 mb-0.5">Free Competitive Scan</div>
                      <p className="text-xs text-emerald-700">
                        Showing publicly available data.{' '}
                        <a href="/settings" className="underline">Add Anthropic API credits</a> for AI-powered
                        saturation scoring, whitespace opportunities, and go/no-go verdict.
                      </p>
                    </div>
                  </div>

                  {ideaResult.abstract && (
                    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Space Overview
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{ideaResult.abstract}</p>
                    </div>
                  )}

                  {ideaResult.relatedTopics.length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Players in this Space
                      </div>
                      <div className="space-y-2">
                        {ideaResult.relatedTopics.map((topic, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                              {i + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-slate-700">{topic.Text}</p>
                              {topic.FirstURL && (
                                <a
                                  href={topic.FirstURL}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-blue-500 hover:underline truncate block mt-0.5"
                                >
                                  {topic.FirstURL}
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {ideaResult.hnStories.length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        HackerNews Discussions
                      </div>
                      <div className="space-y-2">
                        {ideaResult.hnStories.map((story, i) => (
                          <a
                            key={i}
                            href={`https://news.ycombinator.com/item?id=${story.objectID}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
                                {story.title}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                <span>{story.points || 0} pts</span>
                                <span>{story.num_comments || 0} comments</span>
                                <span>{story.author}</span>
                              </div>
                            </div>
                            <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-400 shrink-0 mt-1 transition-colors" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {!ideaResult.abstract && ideaResult.relatedTopics.length === 0 && ideaResult.hnStories.length === 0 && (
                    <div className="text-center py-8 text-sm text-slate-400 bg-white rounded-xl border border-slate-200">
                      No public data found for this idea. Try a more specific description, or{' '}
                      <a href="/settings" className="text-blue-500 underline">add an API key</a> for AI analysis.
                    </div>
                  )}
                </div>
              ) : (
                /* ── Full Claude AI results ── */
                <>
                  <VerdictCard recommendations={ideaResult.recommendations} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                        Market Saturation
                      </div>
                      <SaturationMeter
                        score={ideaResult.market_assessment?.saturation_score ?? 0}
                        maturity={ideaResult.market_assessment?.maturity}
                      />
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Market Signals
                      </div>
                      {[
                        { label: 'TAM Estimate', val: ideaResult.market_assessment?.global_tam_estimate },
                        { label: 'Growth Trend', val: ideaResult.market_assessment?.growth_trend },
                        { label: 'Timing', val: ideaResult.market_assessment?.timing_verdict?.replace(/_/g, ' ') },
                        { label: 'Category', val: ideaResult.meta?.category },
                      ].map(({ label, val }) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">{label}</span>
                          <span className="text-xs font-semibold text-slate-700 capitalize">{val ?? '—'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                      Whitespace Opportunities ({(ideaResult.whitespace_opportunities ?? []).length})
                    </h3>
                    <WhitespaceGrid opportunities={ideaResult.whitespace_opportunities ?? []} />
                  </div>

                  {(ideaResult.competitors?.direct?.length ?? 0) > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-slate-900">
                          Competitive Landscape ({ideaResult.competitors.direct.length} direct)
                        </h3>
                        <button
                          onClick={() => setShowIdeaDetails(!showIdeaDetails)}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showIdeaDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          {showIdeaDetails ? 'Hide' : 'Show all'}
                        </button>
                      </div>

                      <div className="space-y-3">
                        {(showIdeaDetails
                          ? ideaResult.competitors.direct
                          : ideaResult.competitors.direct.slice(0, 3)
                        ).map((comp, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                              {comp.name?.[0] ?? '?'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-slate-800">{comp.name}</span>
                                {comp.geographic_scope && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 capitalize">
                                    {comp.geographic_scope}
                                  </span>
                                )}
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border capitalize ${
                                  comp.threat_level === 'high'
                                    ? 'bg-red-50 text-red-500 border-red-100'
                                    : comp.threat_level === 'medium'
                                    ? 'bg-amber-50 text-amber-600 border-amber-100'
                                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                }`}>
                                  {comp.threat_level} threat
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{comp.what_they_do}</p>
                              {comp.their_weakness && (
                                <p className="text-xs text-slate-400 mt-0.5 italic">Weakness: {comp.their_weakness}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {ideaResult.geographic_analysis && (
                    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
                      <h3 className="text-sm font-semibold text-slate-900 mb-4">Geographic Opportunity</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { label: 'Saturated Markets', items: ideaResult.geographic_analysis.saturated_markets, color: 'text-red-500 bg-red-50' },
                          { label: 'Competitive Markets', items: ideaResult.geographic_analysis.competitive_markets, color: 'text-amber-600 bg-amber-50' },
                          { label: 'Underserved Markets', items: ideaResult.geographic_analysis.underserved_markets, color: 'text-emerald-600 bg-emerald-50' },
                        ].map(({ label, items = [], color }) => (
                          <div key={label}>
                            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</div>
                            {items.length === 0 ? (
                              <p className="text-xs text-slate-300">None identified</p>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {items.map((m, i) => (
                                  <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{m}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {ideaResult.geographic_analysis.reasoning && (
                        <p className="text-xs text-slate-500 mt-4 leading-relaxed border-t border-slate-100 pt-3">
                          {ideaResult.geographic_analysis.reasoning}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
