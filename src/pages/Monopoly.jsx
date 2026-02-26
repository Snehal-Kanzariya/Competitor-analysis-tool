import { useMemo } from 'react';
import { AlertTriangle, TrendingUp, Shield, Lightbulb, Target, BarChart3, Lock, Unlock } from 'lucide-react';
import useStore from '../store/useStore';

const concentrationColors = {
  Low: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', bar: '#10B981' },
  Moderate: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', bar: '#F59E0B' },
  High: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', bar: '#F97316' },
  'Very High': { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', bar: '#EF4444' },
};

export default function Monopoly() {
  const competitors = useStore((s) => s.competitors);
  const monopoly = useStore((s) => s.monopoly);
  const marketOverview = useStore((s) => s.marketOverview);
  const currentQuery = useStore((s) => s.currentResearchQuery);

  const style = concentrationColors[monopoly.concentrationLevel] || concentrationColors.Moderate;

  // Calculate HHI meter position (0-10000 scale)
  const hhiPercent = Math.min(100, (monopoly.hhi / 10000) * 100);

  // Sort competitors by market share for the bar chart
  const sortedByShare = useMemo(() => {
    return [...competitors]
      .map((c) => ({
        ...c,
        shareNum: parseFloat(c.marketShare) || 0,
      }))
      .sort((a, b) => b.shareNum - a.shareNum);
  }, [competitors]);

  const totalShare = sortedByShare.reduce((sum, c) => sum + c.shareNum, 0);
  const maxShare = sortedByShare[0]?.shareNum || 1;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Monopoly Analysis</h1>
        <p className="text-sm text-slate-400 mt-1">
          Market concentration & competitive dynamics
          {currentQuery && <span> · Analyzing: <strong className="text-slate-600">{currentQuery}</strong></span>}
        </p>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Market Size', value: marketOverview.totalMarketSize || 'N/A', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Growth Rate', value: marketOverview.growthRate || 'N/A', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Market Type', value: marketOverview.marketType || 'N/A', icon: Target, color: 'text-violet-500', bg: 'bg-violet-50' },
          { label: 'Competitors', value: competitors.length, icon: Shield, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">{stat.label}</span>
              <div className={`${stat.bg} ${stat.color} p-1.5 rounded-lg`}>
                <stat.icon size={15} />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* HHI Meter */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">HHI Score</h3>
          <p className="text-[11px] text-slate-400 mb-4">Herfindahl-Hirschman Index (0-10,000)</p>

          <div className="text-center mb-4">
            <span className="text-4xl font-bold text-slate-900">{monopoly.hhi?.toLocaleString() || 'N/A'}</span>
            <span className="text-sm text-slate-400 ml-1">/ 10,000</span>
          </div>

          {/* Meter */}
          <div className="relative h-4 rounded-full bg-gradient-to-r from-emerald-200 via-amber-200 via-orange-200 to-red-300 mb-2">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-900 shadow-md transition-all duration-500"
              style={{ left: `calc(${hhiPercent}% - 8px)` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
            <span>Monopoly</span>
          </div>

          {/* Concentration Badge */}
          <div className={`mt-4 text-center py-2 rounded-lg ${style.bg} border ${style.border}`}>
            <span className={`text-sm font-bold ${style.text}`}>
              {monopoly.concentrationLevel || 'N/A'} Concentration
            </span>
          </div>
        </div>

        {/* Market Share Chart */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Market Share Distribution</h3>
          <p className="text-[11px] text-slate-400 mb-4">Estimated market share by competitor</p>

          <div className="space-y-3">
            {sortedByShare.map((comp) => (
              <div key={comp.id} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                  style={{ backgroundColor: comp.color }}
                >
                  {comp.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700 truncate">{comp.name}</span>
                    <span className="text-xs font-bold text-slate-900 ml-2">{comp.marketShare || '0%'}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${maxShare > 0 ? (comp.shareNum / maxShare) * 100 : 0}%`,
                        background: `linear-gradient(90deg, ${comp.color}, ${comp.color}aa)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Unaccounted share */}
            {totalShare < 100 && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-200 text-slate-500 text-[10px] font-bold shrink-0">
                  ?
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-400">Others / Fragmented</span>
                    <span className="text-xs font-bold text-slate-500">{(100 - totalShare).toFixed(0)}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-300 transition-all duration-500"
                      style={{ width: `${maxShare > 0 ? ((100 - totalShare) / maxShare) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Barriers to Entry */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-red-50">
              <Lock size={15} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Barriers to Entry</h3>
              <p className="text-[11px] text-slate-400">What makes this market hard to enter</p>
            </div>
          </div>
          <div className="space-y-2">
            {(monopoly.barriers || []).map((barrier, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 bg-red-50 rounded-lg border border-red-100">
                <Shield size={14} className="text-red-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">{barrier}</span>
              </div>
            ))}
            {(!monopoly.barriers || monopoly.barriers.length === 0) && (
              <p className="text-sm text-slate-300 text-center py-4">No barrier data available</p>
            )}
          </div>
        </div>

        {/* Disruption Opportunities */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-emerald-50">
              <Unlock size={15} className="text-emerald-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Disruption Opportunities</h3>
              <p className="text-[11px] text-slate-400">Where a new entrant can compete</p>
            </div>
          </div>
          <div className="space-y-2">
            {(monopoly.disruptionOpportunities || []).map((opp, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <Lightbulb size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">{opp}</span>
              </div>
            ))}
            {(!monopoly.disruptionOpportunities || monopoly.disruptionOpportunities.length === 0) && (
              <p className="text-sm text-slate-300 text-center py-4">No opportunity data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Market Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={15} className="text-blue-500" />
            <h3 className="text-sm font-semibold text-slate-900">Market Trend</h3>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
              monopoly.marketTrend === 'Consolidating'
                ? 'bg-orange-50 text-orange-600 border border-orange-100'
                : monopoly.marketTrend === 'Fragmenting'
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-slate-50 text-slate-600 border border-slate-100'
            }`}>
              {monopoly.marketTrend || 'Unknown'}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {monopoly.marketTrend === 'Consolidating'
              ? 'The market is consolidating — larger players are acquiring smaller ones, making it harder for new entrants. Focus on differentiation.'
              : monopoly.marketTrend === 'Fragmenting'
              ? 'The market is fragmenting — new players are emerging, creating opportunities for specialized solutions.'
              : 'The market is relatively stable with established players maintaining their positions.'}
          </p>
          {marketOverview.keyTrend && (
            <p className="text-xs text-blue-500 mt-3 font-medium">
              Key trend: {marketOverview.keyTrend}
            </p>
          )}
        </div>

        {/* Available Niches */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target size={15} className="text-violet-500" />
            <h3 className="text-sm font-semibold text-slate-900">Available Niches</h3>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">Underserved segments where new players can win</p>
          <div className="space-y-2">
            {(monopoly.nichesAvailable || []).map((niche, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2.5 bg-violet-50 rounded-lg border border-violet-100">
                <div className="w-6 h-6 rounded-md bg-violet-100 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-violet-600">{i + 1}</span>
                </div>
                <span className="text-sm text-slate-700">{niche}</span>
              </div>
            ))}
            {(!monopoly.nichesAvailable || monopoly.nichesAvailable.length === 0) && (
              <p className="text-sm text-slate-300 text-center py-4">No niche data available</p>
            )}
          </div>
        </div>
      </div>

      {/* HHI Explanation */}
      <div className="mt-6 bg-slate-50 rounded-xl border border-slate-100 p-4">
        <h4 className="text-xs font-semibold text-slate-500 mb-2">Understanding HHI (Herfindahl-Hirschman Index)</h4>
        <div className="grid grid-cols-4 gap-3">
          {[
            { range: '0 — 1,500', level: 'Low', desc: 'Competitive market', color: 'text-emerald-500' },
            { range: '1,500 — 2,500', level: 'Moderate', desc: 'Moderately concentrated', color: 'text-amber-500' },
            { range: '2,500 — 5,000', level: 'High', desc: 'Highly concentrated', color: 'text-orange-500' },
            { range: '5,000 — 10,000', level: 'Very High', desc: 'Near monopoly', color: 'text-red-500' },
          ].map((item) => (
            <div key={item.level} className="text-center">
              <div className={`text-xs font-bold ${item.color} mb-0.5`}>{item.level}</div>
              <div className="text-[10px] text-slate-500">{item.range}</div>
              <div className="text-[10px] text-slate-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
