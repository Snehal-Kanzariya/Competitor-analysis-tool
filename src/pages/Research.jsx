import { useState } from 'react';
import { Search, Sparkles, ArrowRight, Building2, Globe, TrendingUp, AlertCircle, Loader2, History, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { researchCompany, getDemoResearch } from '../services/researchEngine';
import useStore from '../store/useStore';

const exampleCompanies = [
  { name: "McDonald's", industry: 'Fast Food' },
  { name: 'Slack', industry: 'SaaS' },
  { name: 'Nike', industry: 'Sportswear' },
  { name: 'Shopify', industry: 'E-commerce' },
  { name: 'Netflix', industry: 'Streaming' },
  { name: 'Tesla', industry: 'Automotive' },
];

export default function Research() {
  const navigate = useNavigate();
  const loadResearch = useStore((s) => s.loadResearch);
  const apiKey = useStore((s) => s.apiKey);
  const pastResearches = useStore((s) => s.pastResearches);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');

  const handleResearch = async (companyName) => {
    const name = companyName || query.trim();
    if (!name) return;

    setLoading(true);
    setError('');
    setProgress({ step: 0, total: 3, message: 'Starting research...' });

    try {
      let result;

      if (apiKey) {
        // Use real AI research
        result = await researchCompany(name, apiKey, setProgress);
      } else {
        // Use demo data with simulated delay
        setProgress({ step: 1, total: 3, message: `Researching ${name}...` });
        await new Promise((r) => setTimeout(r, 800));
        setProgress({ step: 2, total: 3, message: 'Analyzing market & features...' });
        await new Promise((r) => setTimeout(r, 600));
        setProgress({ step: 3, total: 3, message: 'Generating report...' });
        await new Promise((r) => setTimeout(r, 400));
        result = getDemoResearch(name);
      }

      // Load into store
      loadResearch(result);

      // Navigate to dashboard
      navigate('/');
    } catch (err) {
      console.error('Research failed:', err);
      setError(err.message || 'Research failed. Please try again.');
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleResearch();
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center max-w-2xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/20">
          <Sparkles size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">
          AI Competitor Research
        </h1>
        <p className="text-base text-slate-400 max-w-md mx-auto">
          Enter any company name and get a complete competitive analysis with market positioning, SWOT, and monopoly insights.
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter company name... (e.g. McDonald's, Slack, Nike)"
            disabled={loading}
            className="w-full pl-12 pr-36 py-4 rounded-2xl border-2 border-slate-200 text-base focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all placeholder:text-slate-300 bg-white shadow-sm disabled:opacity-60"
          />
          <button
            onClick={() => handleResearch()}
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-blue-500/20"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Zap size={16} />
            )}
            {loading ? 'Researching' : 'Analyze'}
          </button>
        </div>

        {/* API Key Status */}
        {!apiKey && (
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-500 bg-amber-50 px-4 py-2 rounded-lg border border-amber-100">
            <AlertCircle size={14} />
            <span>
              Running in demo mode. <button onClick={() => navigate('/settings')} className="underline font-medium">Add API key</button> for real AI-powered research with live web data.
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {loading && progress && (
        <div className="w-full mb-8 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 size={18} className="text-blue-500 animate-spin" />
            <span className="text-sm font-medium text-slate-700">{progress.message}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
              style={{ width: `${(progress.step / progress.total) * 100}%` }}
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
        <div className="w-full mb-6 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-red-700">{error}</div>
            <button onClick={() => setError('')} className="text-xs text-red-500 underline mt-1">Dismiss</button>
          </div>
        </div>
      )}

      {/* Quick Examples */}
      {!loading && (
        <div className="w-full">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Try an example
          </div>
          <div className="grid grid-cols-3 gap-2">
            {exampleCompanies.map((company) => (
              <button
                key={company.name}
                onClick={() => {
                  setQuery(company.name);
                  handleResearch(company.name);
                }}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <Building2 size={16} className="text-slate-400 group-hover:text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-700">{company.name}</div>
                  <div className="text-[11px] text-slate-400">{company.industry}</div>
                </div>
                <ArrowRight size={14} className="text-slate-200 group-hover:text-blue-400 ml-auto transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Past Researches */}
      {!loading && pastResearches?.length > 0 && (
        <div className="w-full mt-8">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <History size={12} />
            Recent Researches
          </div>
          <div className="space-y-2">
            {pastResearches.slice(0, 5).map((r, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(r.query);
                  handleResearch(r.query);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-blue-200 transition-all text-left"
              >
                <Globe size={14} className="text-slate-300" />
                <span className="text-sm text-slate-600">{r.query}</span>
                <span className="text-[10px] text-slate-300 ml-auto">
                  {new Date(r.timestamp).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* How it works */}
      {!loading && (
        <div className="w-full mt-10 pt-8 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            How it works
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Search, title: 'Search', desc: 'Enter any company name' },
              { icon: Sparkles, title: 'AI Analyzes', desc: 'Finds competitors & market data' },
              { icon: TrendingUp, title: 'Get Insights', desc: 'Full analysis with monopoly view' },
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
  );
}
