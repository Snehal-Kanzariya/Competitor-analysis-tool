import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertTriangle, Filter, Download, ChevronDown, ChevronRight } from 'lucide-react';
import useStore from '../store/useStore';
import AddFeatureModal from '../components/Comparison/AddFeatureModal';

const scoreIcons = {
  yes: { label: '✓', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', tooltip: 'Has feature' },
  partial: { label: '◐', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', tooltip: 'Partial' },
  no: { label: '✕', bg: 'bg-red-50', text: 'text-red-400', border: 'border-red-100', tooltip: 'Missing' },
};

const cycleOrder = ['no', 'yes', 'partial'];

export default function Comparison() {
  const competitors = useStore((s) => s.competitors);
  const features = useStore((s) => s.features);
  const featureScores = useStore((s) => s.featureScores);
  const setFeatureScore = useStore((s) => s.setFeatureScore);
  const deleteFeature = useStore((s) => s.deleteFeature);

  const [showModal, setShowModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [collapsedCats, setCollapsedCats] = useState({});
  const [hoveredCell, setHoveredCell] = useState(null);

  // Get unique categories
  const categories = useMemo(() => {
    return ['all', ...new Set(features.map((f) => f.category))];
  }, [features]);

  // Group features by category
  const grouped = useMemo(() => {
    const filtered = filterCategory === 'all'
      ? features
      : features.filter((f) => f.category === filterCategory);

    const groups = {};
    filtered.forEach((f) => {
      if (!groups[f.category]) groups[f.category] = [];
      groups[f.category].push(f);
    });
    return groups;
  }, [features, filterCategory]);

  // Calculate gap analysis
  const gaps = useMemo(() => {
    const yourProduct = competitors.find((c) => c.status === 'You');
    if (!yourProduct) return [];

    return features.filter((f) => {
      const yourScore = featureScores[yourProduct.id]?.[f.id] || 'no';
      if (yourScore === 'yes') return false;

      // Count how many competitors have this feature
      const competitorsWithFeature = competitors.filter(
        (c) => c.id !== yourProduct.id && featureScores[c.id]?.[f.id] === 'yes'
      ).length;

      return competitorsWithFeature >= 2;
    });
  }, [competitors, features, featureScores]);

  // Calculate competitor coverage percentages
  const coverage = useMemo(() => {
    const result = {};
    competitors.forEach((c) => {
      const total = features.length;
      const has = features.filter((f) => featureScores[c.id]?.[f.id] === 'yes').length;
      const partial = features.filter((f) => featureScores[c.id]?.[f.id] === 'partial').length;
      result[c.id] = {
        percent: total > 0 ? Math.round(((has + partial * 0.5) / total) * 100) : 0,
        has,
        partial,
        missing: total - has - partial,
      };
    });
    return result;
  }, [competitors, features, featureScores]);

  const handleCycleScore = (competitorId, featureId) => {
    const current = featureScores[competitorId]?.[featureId] || 'no';
    const currentIndex = cycleOrder.indexOf(current);
    const next = cycleOrder[(currentIndex + 1) % cycleOrder.length];
    setFeatureScore(competitorId, featureId, next);
  };

  const toggleCategory = (cat) => {
    setCollapsedCats((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Export as CSV
  const exportCSV = () => {
    const header = ['Feature', 'Category', ...competitors.map((c) => c.name)].join(',');
    const rows = features.map((f) => {
      const scores = competitors.map((c) => featureScores[c.id]?.[f.id] || 'no');
      return [f.name, f.category, ...scores].join(',');
    });
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'competitor-feature-comparison.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Feature Comparison</h1>
          <p className="text-sm text-slate-400 mt-1">
            Side-by-side feature analysis · Click cells to toggle — {features.length} features across {competitors.length} competitors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <Download size={14} />
            Export CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/20"
          >
            <Plus size={16} />
            Add Feature
          </button>
        </div>
      </div>

      {/* Coverage Summary */}
      <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: `repeat(${competitors.length}, 1fr)` }}>
        {competitors.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                style={{ backgroundColor: c.color }}
              >
                {c.name.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-slate-700 truncate">{c.name}</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1.5">
              <span className="text-lg font-bold text-slate-900">{coverage[c.id]?.percent || 0}%</span>
              <span className="text-[10px] text-slate-400">coverage</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${coverage[c.id]?.percent || 0}%`,
                  background: `linear-gradient(90deg, ${c.color}, ${c.color}cc)`,
                }}
              />
            </div>
            <div className="flex gap-3 mt-2 text-[10px] text-slate-400">
              <span className="text-emerald-500 font-medium">{coverage[c.id]?.has} has</span>
              <span className="text-amber-500 font-medium">{coverage[c.id]?.partial} partial</span>
              <span className="text-red-400 font-medium">{coverage[c.id]?.missing} missing</span>
            </div>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-4">
        <Filter size={14} className="text-slate-400" />
        <div className="flex gap-1 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterCategory === cat
                  ? 'bg-blue-50 text-blue-600 border border-blue-100'
                  : 'text-slate-400 hover:bg-slate-100 border border-transparent'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900">
                <th className="sticky left-0 z-10 bg-slate-900 px-4 py-3 text-left text-xs font-semibold text-white w-56 min-w-56">
                  Feature
                </th>
                {competitors.map((c) => (
                  <th key={c.id} className="px-3 py-3 text-center min-w-28">
                    <div className="flex items-center justify-center gap-1.5">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-bold"
                        style={{ backgroundColor: c.color }}
                      >
                        {c.name.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-white truncate max-w-20">{c.name}</span>
                    </div>
                  </th>
                ))}
                <th className="px-3 py-3 text-center text-xs font-semibold text-slate-400 w-12">
                  
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(grouped).map(([category, catFeatures]) => (
                <CategoryGroup
                  key={category}
                  category={category}
                  features={catFeatures}
                  competitors={competitors}
                  featureScores={featureScores}
                  collapsed={collapsedCats[category]}
                  onToggle={() => toggleCategory(category)}
                  onCycleScore={handleCycleScore}
                  onDeleteFeature={deleteFeature}
                  hoveredCell={hoveredCell}
                  setHoveredCell={setHoveredCell}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gap Alert */}
      {gaps.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-amber-100 shrink-0 mt-0.5">
              <AlertTriangle size={14} className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-800 mb-1">Gap Analysis Alert</h3>
              <p className="text-xs text-amber-700 mb-2">
                Your product is missing {gaps.length} feature{gaps.length > 1 ? 's' : ''} that 2+ competitors offer:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {gaps.map((f) => (
                  <span
                    key={f.id}
                    className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium"
                  >
                    {f.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-slate-400">
        <span className="font-medium text-slate-500">Legend:</span>
        {Object.entries(scoreIcons).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-6 h-6 rounded-md ${val.bg} ${val.text} ${val.border} border flex items-center justify-center text-xs font-bold`}>
              {val.label}
            </span>
            <span>{val.tooltip}</span>
          </div>
        ))}
        <span className="ml-2 text-slate-300">· Click any cell to cycle through values</span>
      </div>

      <AddFeatureModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

function CategoryGroup({
  category,
  features,
  competitors,
  featureScores,
  collapsed,
  onToggle,
  onCycleScore,
  onDeleteFeature,
  hoveredCell,
  setHoveredCell,
}) {
  return (
    <>
      {/* Category Header Row */}
      <tr
        className="bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={onToggle}
      >
        <td
          colSpan={competitors.length + 2}
          className="sticky left-0 z-10 bg-slate-50 hover:bg-slate-100 px-4 py-2.5 transition-colors"
        >
          <div className="flex items-center gap-2">
            {collapsed ? (
              <ChevronRight size={14} className="text-slate-400" />
            ) : (
              <ChevronDown size={14} className="text-slate-400" />
            )}
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {category}
            </span>
            <span className="text-[10px] text-slate-300 font-medium">
              {features.length} feature{features.length > 1 ? 's' : ''}
            </span>
          </div>
        </td>
      </tr>

      {/* Feature Rows */}
      {!collapsed &&
        features.map((feature, fi) => (
          <tr
            key={feature.id}
            className={`group border-b border-slate-50 transition-colors ${
              fi % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
            } hover:bg-blue-50/30`}
          >
            <td className="sticky left-0 z-10 bg-inherit px-4 py-2.5">
              <span className="text-sm text-slate-700 font-medium">{feature.name}</span>
            </td>
            {competitors.map((comp) => {
              const value = featureScores[comp.id]?.[feature.id] || 'no';
              const icon = scoreIcons[value];
              const isHovered =
                hoveredCell?.compId === comp.id && hoveredCell?.featureId === feature.id;

              return (
                <td key={comp.id} className="px-3 py-2.5 text-center">
                  <button
                    onClick={() => onCycleScore(comp.id, feature.id)}
                    onMouseEnter={() => setHoveredCell({ compId: comp.id, featureId: feature.id })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`w-8 h-8 rounded-lg ${icon.bg} ${icon.text} ${icon.border} border flex items-center justify-center text-sm font-bold mx-auto transition-all ${
                      isHovered ? 'scale-110 shadow-md' : ''
                    }`}
                    title={`${icon.tooltip} — Click to change`}
                  >
                    {icon.label}
                  </button>
                </td>
              );
            })}
            <td className="px-2 py-2.5 text-center">
              <button
                onClick={() => onDeleteFeature(feature.id)}
                className="p-1 rounded-md hover:bg-red-50 text-slate-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete feature"
              >
                <Trash2 size={13} />
              </button>
            </td>
          </tr>
        ))}
    </>
  );
}
