import { useState } from 'react';
import { Search, Sparkles, ArrowRight, Building2, TrendingUp, Loader2, History, Zap, Database, Globe, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { researchCompanyFree } from '../services/researchEngine';
import useStore from '../store/useStore';

const exampleCompanies = [
  { name: "McDonald's", industry: 'Fast Food' },
  { name: 'Slack', industry: 'SaaS' },
  { name: 'Nike', industry: 'Sportswear' },
  { name: 'Shopify', industry: 'E-commerce' },
  { name: 'Netflix', industry: 'Streaming' },
  { name: 'Tesla', industry: 'Automotive' },
  { name: 'Uber', industry: 'Ride-Hailing' },
  { name: 'Zomato', industry: 'Food Delivery' },
  { name: 'OpenAI', industry: 'AI' },
];

export default function Research() {
  const navigate = useNavigate();
  const loadResearch = useStore((s) => s.loadResearch);
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
    setProgress({ step: 0, total: 4, message: 'Starting research...' });

    try {
      const result = await researchCompanyFree(name, null, setProgress);
      loadResearch(result);
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
      <div className="text-center mb-8 md:mb-10">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mx-auto mb-4 md:mb-5 shadow-lg shadow-blue-500/20">
          <Sparkles size={24} className="text-white md:hidden" />
          <Sparkles size={28} className="text-white hidden md:block" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-3">
          AI Competitor Research
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-md mx-auto">
          Enter any company name and get a complete competitive analysis — powered by Wikipedia + curated database. 100% free.
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter company name..."
            disabled={loading}
            className="w-full pl-11 pr-28 md:pr-36 py-3.5 md:py-4 rounded-2xl border-2 border-slate-200 text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all placeholder:text-slate-300 bg-white shadow-sm disabled:opacity-60"
          />
          <button
            onClick={() => handleResearch()}
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-blue-500 text-white rounded-xl text-xs md:text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-blue-500/20"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
            {loading ? 'Researching' : 'Analyze'}
          </button>
        </div>

        {/* Status Bar */}
        <div className="mt-3 flex items-center gap-2 text-xs px-4 py-2 rounded-lg border text-emerald-600 bg-emerald-50 border-emerald-100">
          <CheckCircle size={14} className="shrink-0" />
          <span><strong>No API key needed!</strong> Uses Wikipedia + curated database. Unlimited & free.</span>
        </div>
      </div>

      {/* Progress Bar */}
      {loading && progress && (
        <div className="w-full mb-8 bg-white rounded-xl border border-slate-200 p-4 md:p-5">
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
          <span className="text-sm font-medium text-red-700">{error}</span>
          <button onClick={() => setError('')} className="text-xs text-red-500 underline ml-auto shrink-0">Dismiss</button>
        </div>
      )}

      {/* Quick Examples */}
      {!loading && (
        <div className="w-full">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Try an example</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {exampleCompanies.map((company) => (
              <button
                key={company.name}
                onClick={() => { setQuery(company.name); handleResearch(company.name); }}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors shrink-0">
                  <Building2 size={16} className="text-slate-400 group-hover:text-blue-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-700">{company.name}</div>
                  <div className="text-[11px] text-slate-400">{company.industry}</div>
                </div>
                <ArrowRight size={14} className="text-slate-200 group-hover:text-blue-400 ml-auto shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Past Researches */}
      {!loading && pastResearches?.length > 0 && (
        <div className="w-full mt-8">
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
                <span className="text-[10px] text-slate-300 ml-auto shrink-0">{new Date(r.timestamp).toLocaleDateString()}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* How it works */}
      {!loading && (
        <div className="w-full mt-8 md:mt-10 pt-6 md:pt-8 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">How it works</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Search, title: '1. Search', desc: 'Enter company name' },
              { icon: Database, title: '2. Database', desc: 'Check 50+ industries' },
              { icon: Globe, title: '3. Wikipedia', desc: 'Fetch real company data' },
              { icon: TrendingUp, title: '4. Analyze', desc: 'Fill all 7 modules' },
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

          <div className="mt-6 p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
            <p className="text-xs text-blue-700 font-medium">
              💡 Best results for companies in our database (fast food, tech, streaming, automotive, and more). Any company gets Wikipedia data — no API key needed!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
