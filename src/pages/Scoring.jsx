import { useState, useMemo } from 'react';
import { Plus, Trash2, Trophy, BarChart3, SlidersHorizontal, X, AlertCircle } from 'lucide-react';
import useStore from '../store/useStore';

const defaultCriteria = [
  { name: 'Product Quality', weight: 25 },
  { name: 'Pricing', weight: 20 },
  { name: 'Brand Strength', weight: 15 },
  { name: 'Innovation', weight: 15 },
  { name: 'Customer Support', weight: 15 },
  { name: 'Market Reach', weight: 10 },
];

const barColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'];

export default function Scoring() {
  const competitors = useStore((s) => s.competitors);

  const [criteria, setCriteria] = useState(() => {
    try {
      const saved = localStorage.getItem('ciq-scoring-criteria');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultCriteria;
  });

  const [scores, setScores] = useState(() => {
    try {
      const saved = localStorage.getItem('ciq-scoring-scores');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const initial = {};
    competitors.forEach((c, ci) => {
      initial[c.id] = defaultCriteria.map((_, i) => Math.max(3, Math.min(10, 8 - ci + (i % 3))));
    });
    return initial;
  });

  const [showAddCriteria, setShowAddCriteria] = useState(false);
  const [newCritName, setNewCritName] = useState('');
  const [newCritWeight, setNewCritWeight] = useState(10);

  // Save whenever criteria or scores change
  const save = (newCriteria, newScores) => {
    localStorage.setItem('ciq-scoring-criteria', JSON.stringify(newCriteria));
    localStorage.setItem('ciq-scoring-scores', JSON.stringify(newScores));
  };

  const totalWeight = criteria.reduce((s, c) => s + c.weight, 0);

  // Calculate weighted totals
  const rankings = useMemo(() => {
    return competitors.map((comp) => {
      const compScores = scores[comp.id] || criteria.map(() => 5);
      const total = criteria.reduce((sum, crit, i) => {
        return sum + (compScores[i] || 5) * (crit.weight / 100);
      }, 0);
      return { ...comp, total: parseFloat(total.toFixed(2)), scores: compScores };
    }).sort((a, b) => b.total - a.total);
  }, [competitors, criteria, scores]);

  const handleScoreChange = (compId, critIndex, value) => {
    const val = Math.max(1, Math.min(10, parseInt(value) || 1));
    setScores((prev) => {
      const updated = { ...prev };
      if (!updated[compId]) updated[compId] = criteria.map(() => 5);
      updated[compId] = [...updated[compId]];
      updated[compId][critIndex] = val;
      save(criteria, updated);
      return updated;
    });
  };

  const handleWeightChange = (index, value) => {
    const val = Math.max(1, Math.min(100, parseInt(value) || 1));
    setCriteria((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], weight: val };
      save(updated, scores);
      return updated;
    });
  };

  const addCriteria = () => {
    if (!newCritName.trim()) return;
    const updated = [...criteria, { name: newCritName.trim(), weight: newCritWeight }];
    setCriteria(updated);
    // Add default score for all competitors
    const updatedScores = { ...scores };
    competitors.forEach((c) => {
      if (!updatedScores[c.id]) updatedScores[c.id] = criteria.map(() => 5);
      updatedScores[c.id] = [...updatedScores[c.id], 5];
    });
    setScores(updatedScores);
    save(updated, updatedScores);
    setNewCritName('');
    setNewCritWeight(10);
    setShowAddCriteria(false);
  };

  const deleteCriteria = (index) => {
    const updated = criteria.filter((_, i) => i !== index);
    setCriteria(updated);
    const updatedScores = { ...scores };
    Object.keys(updatedScores).forEach((compId) => {
      updatedScores[compId] = updatedScores[compId].filter((_, i) => i !== index);
    });
    setScores(updatedScores);
    save(updated, updatedScores);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Weighted Scoring</h1>
          <p className="text-sm text-slate-400 mt-1">Score competitors 1-10 per criterion · Click cells to edit</p>
        </div>
        <button
          onClick={() => setShowAddCriteria(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/20 self-start sm:self-auto shrink-0"
        >
          <Plus size={16} /> Add Criterion
        </button>
      </div>

      {/* Weight Warning */}
      {totalWeight !== 100 && (
        <div className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-xl">
          <AlertCircle size={15} className="text-amber-500 shrink-0" />
          <span className="text-xs text-amber-700 font-medium">
            Weights total {totalWeight}% — should be 100% for accurate scoring
          </span>
        </div>
      )}

      {/* Weight Distribution Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal size={14} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Weight Distribution</span>
          <span className="text-[10px] text-slate-400 ml-auto">Total: {totalWeight}%</span>
        </div>
        <div className="flex h-7 rounded-lg overflow-hidden gap-0.5">
          {criteria.map((c, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-[10px] font-bold text-white transition-all"
              style={{ width: `${c.weight}%`, backgroundColor: barColors[i % barColors.length], minWidth: c.weight > 5 ? 'auto' : 0 }}
            >
              {c.weight >= 10 ? `${c.weight}%` : ''}
            </div>
          ))}
        </div>
        <div className="flex gap-0.5 mt-1.5">
          {criteria.map((c, i) => (
            <div key={i} className="text-[9px] text-slate-400 text-center truncate" style={{ width: `${c.weight}%` }}>
              {c.weight >= 8 ? c.name : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Scoring Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-5">
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900">
                <th className="sticky left-0 z-10 bg-slate-900 px-4 py-3 text-left text-xs font-semibold text-white w-36 min-w-36">
                  Competitor
                </th>
                {criteria.map((c, i) => (
                  <th key={i} className="px-2 py-3 text-center min-w-24 group">
                    <div className="text-[11px] font-medium text-white mb-1">{c.name}</div>
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="number"
                        value={c.weight}
                        onChange={(e) => handleWeightChange(i, e.target.value)}
                        className="w-10 px-1 py-0.5 rounded text-center text-[10px] bg-slate-800 text-slate-300 border border-slate-700 focus:outline-none focus:border-blue-400"
                        min="1" max="100"
                      />
                      <span className="text-[10px] text-slate-500">%</span>
                      <button
                        onClick={() => deleteCriteria(i)}
                        className="p-0.5 rounded hover:bg-slate-700 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-1"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </th>
                ))}
                <th className="px-3 py-3 text-center text-xs font-semibold text-blue-300 min-w-20 bg-blue-900/30">
                  Total
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-amber-300 min-w-16">
                  Rank
                </th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((comp, ri) => (
                <tr key={comp.id} className={`${ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'} hover:bg-blue-50/30 transition-colors`}>
                  <td className="sticky left-0 z-10 bg-inherit px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0" style={{ backgroundColor: comp.color }}>
                        {comp.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-700 truncate">{comp.name}</span>
                    </div>
                  </td>
                  {criteria.map((_, ci) => {
                    const val = comp.scores[ci] || 5;
                    return (
                      <td key={ci} className="px-2 py-3 text-center">
                        <input
                          type="number"
                          value={val}
                          onChange={(e) => handleScoreChange(comp.id, ci, e.target.value)}
                          className={`w-12 px-1.5 py-1 rounded-lg text-center text-sm font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 ${
                            val >= 8 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            val >= 6 ? 'bg-white text-slate-700 border-slate-200' :
                            val >= 4 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-red-50 text-red-600 border-red-200'
                          }`}
                          min="1" max="10"
                        />
                      </td>
                    );
                  })}
                  <td className="px-3 py-3 text-center bg-blue-50/50">
                    <span className="text-lg font-bold text-blue-600">{comp.total}</span>
                    <span className="text-[10px] text-slate-400">/10</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                      ri === 0 ? 'bg-amber-100 text-amber-700' :
                      ri === 1 ? 'bg-slate-200 text-slate-600' :
                      ri === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-50 text-slate-400'
                    }`}>
                      {ri + 1}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ranking Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {rankings.map((comp, i) => (
          <div key={comp.id} className={`rounded-xl p-4 text-center transition-all ${
            i === 0 ? 'bg-gradient-to-b from-amber-50 to-white border-2 border-amber-200 shadow-sm' :
            'bg-white border border-slate-200'
          }`}>
            {i === 0 && <Trophy size={20} className="text-amber-500 mx-auto mb-2" />}
            <div className={`text-xl md:text-2xl font-bold mb-1 ${i === 0 ? 'text-amber-600' : 'text-slate-400'}`}>#{i + 1}</div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: comp.color }}>
                {comp.name.charAt(0)}
              </div>
              <span className="text-sm font-semibold text-slate-700 truncate">{comp.name}</span>
            </div>
            <div className="text-lg font-bold text-blue-600">{comp.total}</div>
            <div className="text-[10px] text-slate-400">weighted score</div>

            {/* Mini score bar */}
            <div className="mt-3 h-1.5 rounded-full bg-slate-100">
              <div className="h-full rounded-full transition-all" style={{
                width: `${(comp.total / 10) * 100}%`,
                background: `linear-gradient(90deg, ${comp.color}, ${comp.color}aa)`,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Score Color Legend */}
      <div className="mt-5 flex flex-wrap items-center gap-3 md:gap-5 text-xs text-slate-400">
        <span className="font-medium text-slate-500">Score colors:</span>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200" /><span>8-10 Strong</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-white border border-slate-200" /><span>6-7 Average</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-50 border border-amber-200" /><span>4-5 Weak</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-50 border border-red-200" /><span>1-3 Critical</span></div>
      </div>

      {/* Add Criteria Modal */}
      {showAddCriteria && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setShowAddCriteria(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Add Criterion</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Add a new scoring criterion</p>
                </div>
                <button onClick={() => setShowAddCriteria(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Criterion Name *</label>
                  <input type="text" value={newCritName} onChange={(e) => setNewCritName(e.target.value)} placeholder="e.g. User Experience" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder:text-slate-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Weight: {newCritWeight}%</label>
                  <input type="range" min="1" max="50" value={newCritWeight} onChange={(e) => setNewCritWeight(parseInt(e.target.value))} className="w-full accent-blue-500" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowAddCriteria(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                  <button onClick={addCriteria} disabled={!newCritName.trim()} className="flex-1 px-4 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-40">Add</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
