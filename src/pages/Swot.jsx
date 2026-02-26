import { useState, useMemo } from 'react';
import { Plus, X, Trash2, ChevronDown, BarChart3, ArrowRightLeft, Pencil, Check, AlertTriangle, Lightbulb, Shield, Zap } from 'lucide-react';
import useStore from '../store/useStore';

const quadrants = [
  {
    key: 'strengths',
    title: 'Strengths',
    subtitle: 'Internal advantages',
    icon: Shield,
    color: '#10B981',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    text: 'text-emerald-600',
    hoverBg: 'hover:bg-emerald-100',
    inputBorder: 'focus:border-emerald-400 focus:ring-emerald-500/20',
    badgeBg: 'bg-emerald-100',
  },
  {
    key: 'weaknesses',
    title: 'Weaknesses',
    subtitle: 'Internal limitations',
    icon: AlertTriangle,
    color: '#EF4444',
    bg: 'bg-red-50',
    border: 'border-red-100',
    text: 'text-red-500',
    hoverBg: 'hover:bg-red-100',
    inputBorder: 'focus:border-red-400 focus:ring-red-500/20',
    badgeBg: 'bg-red-100',
  },
  {
    key: 'opportunities',
    title: 'Opportunities',
    subtitle: 'External potential',
    icon: Lightbulb,
    color: '#3B82F6',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    text: 'text-blue-600',
    hoverBg: 'hover:bg-blue-100',
    inputBorder: 'focus:border-blue-400 focus:ring-blue-500/20',
    badgeBg: 'bg-blue-100',
  },
  {
    key: 'threats',
    title: 'Threats',
    subtitle: 'External risks',
    icon: Zap,
    color: '#F59E0B',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    text: 'text-amber-600',
    hoverBg: 'hover:bg-amber-100',
    inputBorder: 'focus:border-amber-400 focus:ring-amber-500/20',
    badgeBg: 'bg-amber-100',
  },
];

export default function Swot() {
  const competitors = useStore((s) => s.competitors);
  const updateCompetitor = useStore((s) => s.updateCompetitor);

  const [selectedId, setSelectedId] = useState(competitors[0]?.id || '');
  const [view, setView] = useState('single'); // 'single' or 'compare'
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selected = competitors.find((c) => c.id === selectedId);

  // Summary stats across all competitors
  const summary = useMemo(() => {
    const totals = { strengths: 0, weaknesses: 0, opportunities: 0, threats: 0 };
    competitors.forEach((c) => {
      totals.strengths += (c.strengths || []).length;
      totals.weaknesses += (c.weaknesses || []).length;
      totals.opportunities += (c.opportunities || []).length;
      totals.threats += (c.threats || []).length;
    });
    return totals;
  }, [competitors]);

  const handleAddItem = (quadrantKey, text) => {
    if (!selected || !text.trim()) return;
    const current = selected[quadrantKey] || [];
    updateCompetitor(selected.id, { [quadrantKey]: [...current, text.trim()] });
  };

  const handleDeleteItem = (quadrantKey, index) => {
    if (!selected) return;
    const current = [...(selected[quadrantKey] || [])];
    current.splice(index, 1);
    updateCompetitor(selected.id, { [quadrantKey]: current });
  };

  const handleEditItem = (quadrantKey, index, newText) => {
    if (!selected || !newText.trim()) return;
    const current = [...(selected[quadrantKey] || [])];
    current[index] = newText.trim();
    updateCompetitor(selected.id, { [quadrantKey]: current });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">SWOT Analysis</h1>
          <p className="text-sm text-slate-400 mt-1">
            Strengths, Weaknesses, Opportunities & Threats
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('single')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              view === 'single'
                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                : 'text-slate-400 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <BarChart3 size={13} />
            Single View
          </button>
          <button
            onClick={() => setView('compare')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              view === 'compare'
                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                : 'text-slate-400 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <ArrowRightLeft size={13} />
            Compare All
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {quadrants.map((q) => (
          <div key={q.key} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">{q.title}</span>
              <div className={`${q.bg} p-1.5 rounded-lg`}>
                <q.icon size={13} className={q.text} />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900">{summary[q.key]}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">across {competitors.length} competitors</div>
          </div>
        ))}
      </div>

      {view === 'single' ? (
        <>
          {/* Competitor Selector */}
          <div className="relative mb-5">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 w-full max-w-sm bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-slate-300 transition-colors"
            >
              {selected && (
                <>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: selected.color }}
                  >
                    {selected.name.charAt(0)}
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-semibold text-slate-900">{selected.name}</div>
                    <div className="text-[11px] text-slate-400">{selected.industry} · {selected.status}</div>
                  </div>
                </>
              )}
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute top-full left-0 mt-1 w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 max-h-64 overflow-y-auto">
                  {competitors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedId(c.id); setDropdownOpen(false); }}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 hover:bg-slate-50 transition-colors ${
                        c.id === selectedId ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: c.color }}
                      >
                        {c.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-slate-700">{c.name}</div>
                        <div className="text-[10px] text-slate-400">
                          S:{(c.strengths||[]).length} · W:{(c.weaknesses||[]).length} · O:{(c.opportunities||[]).length} · T:{(c.threats||[]).length}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* SWOT Grid - Single Competitor */}
          {selected && (
            <div className="grid grid-cols-2 gap-4">
              {quadrants.map((q) => (
                <SwotQuadrant
                  key={q.key}
                  quadrant={q}
                  items={selected[q.key] || []}
                  onAdd={(text) => handleAddItem(q.key, text)}
                  onDelete={(idx) => handleDeleteItem(q.key, idx)}
                  onEdit={(idx, text) => handleEditItem(q.key, idx, text)}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        /* Compare All View */
        <CompareView competitors={competitors} />
      )}
    </div>
  );
}

// ============================
// SWOT QUADRANT COMPONENT
// ============================
function SwotQuadrant({ quadrant, items, onAdd, onDelete, onEdit }) {
  const [newItem, setNewItem] = useState('');
  const [editingIdx, setEditingIdx] = useState(-1);
  const [editText, setEditText] = useState('');

  const q = quadrant;

  const handleSubmit = () => {
    if (newItem.trim()) {
      onAdd(newItem);
      setNewItem('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const startEdit = (idx, text) => {
    setEditingIdx(idx);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      onEdit(editingIdx, editText);
    }
    setEditingIdx(-1);
    setEditText('');
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') { setEditingIdx(-1); setEditText(''); }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`p-1.5 rounded-lg ${q.bg}`}>
          <q.icon size={15} className={q.text} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900">{q.title}</h3>
          <p className="text-[11px] text-slate-400">{q.subtitle}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${q.badgeBg} ${q.text}`}>
          {items.length}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-2 mb-3 min-h-[60px]">
        {items.length === 0 && (
          <div className="text-center py-4">
            <p className="text-xs text-slate-300">No items yet. Add one below.</p>
          </div>
        )}
        {items.map((item, i) => (
          <div
            key={i}
            className={`group flex items-start gap-2 p-2.5 rounded-lg ${q.bg} border ${q.border} transition-all`}
          >
            {editingIdx === i ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  autoFocus
                  className={`flex-1 px-2 py-1 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 ${q.inputBorder} bg-white`}
                />
                <button
                  onClick={saveEdit}
                  className="p-1 rounded-md bg-white hover:bg-slate-100 transition-colors"
                >
                  <Check size={13} className="text-emerald-500" />
                </button>
                <button
                  onClick={() => { setEditingIdx(-1); setEditText(''); }}
                  className="p-1 rounded-md bg-white hover:bg-slate-100 transition-colors"
                >
                  <X size={13} className="text-slate-400" />
                </button>
              </div>
            ) : (
              <>
                <span className="text-sm text-slate-700 flex-1 leading-relaxed">{item}</span>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => startEdit(i, item)}
                    className="p-1 rounded-md hover:bg-white/70 transition-colors"
                  >
                    <Pencil size={12} className="text-slate-400" />
                  </button>
                  <button
                    onClick={() => onDelete(i)}
                    className="p-1 rounded-md hover:bg-white/70 transition-colors"
                  >
                    <Trash2 size={12} className="text-red-400" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add New Item */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Add ${q.title.toLowerCase().slice(0, -1)}...`}
          className={`flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 ${q.inputBorder} transition-all placeholder:text-slate-300`}
        />
        <button
          onClick={handleSubmit}
          disabled={!newItem.trim()}
          className={`px-3 py-2 rounded-lg ${q.bg} ${q.text} border ${q.border} text-sm font-medium ${q.hoverBg} transition-colors disabled:opacity-30`}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

// ============================
// COMPARE ALL VIEW
// ============================
function CompareView({ competitors }) {
  return (
    <div className="space-y-6">
      {quadrants.map((q) => (
        <div key={q.key} className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className={`p-1.5 rounded-lg ${q.bg}`}>
              <q.icon size={15} className={q.text} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">{q.title}</h3>
            <span className="text-[11px] text-slate-400">— {q.subtitle}</span>
          </div>

          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(competitors.length, 4)}, 1fr)` }}>
            {competitors.map((comp) => {
              const items = comp[q.key] || [];
              return (
                <div key={comp.id} className={`rounded-lg border ${q.border} ${q.bg} p-3`}>
                  <div className="flex items-center gap-2 mb-2.5 pb-2 border-b" style={{ borderColor: `${q.color}22` }}>
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-bold"
                      style={{ backgroundColor: comp.color }}
                    >
                      {comp.name.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 truncate">{comp.name}</span>
                    <span className={`text-[10px] font-bold ml-auto ${q.text}`}>{items.length}</span>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-[11px] text-slate-300 text-center py-2">No items</p>
                  ) : (
                    <div className="space-y-1.5">
                      {items.map((item, i) => (
                        <div key={i} className="text-xs text-slate-600 leading-relaxed flex gap-1.5">
                          <span className={`${q.text} shrink-0 mt-0.5`}>•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Insight */}
          {competitors.length > 1 && (
            <SwotInsight quadrant={q} competitors={competitors} />
          )}
        </div>
      ))}
    </div>
  );
}

// ============================
// AUTO-GENERATED INSIGHTS
// ============================
function SwotInsight({ quadrant, competitors }) {
  const q = quadrant;
  const counts = competitors.map((c) => ({
    name: c.name,
    count: (c[q.key] || []).length,
  }));

  const max = counts.reduce((a, b) => (a.count > b.count ? a : b), counts[0]);
  const min = counts.reduce((a, b) => (a.count < b.count ? a : b), counts[0]);
  const total = counts.reduce((sum, c) => sum + c.count, 0);

  if (total === 0) return null;

  const messages = {
    strengths: `${max.name} leads with ${max.count} strengths. ${min.name} has the fewest (${min.count}). Consider analyzing what makes ${max.name}'s strengths unique.`,
    weaknesses: `${max.name} has the most identified weaknesses (${max.count}). This could indicate either thorough analysis or significant vulnerabilities to exploit.`,
    opportunities: `${total} opportunities identified across all competitors. ${max.name} has the most (${max.count}) — these may also apply to your strategy.`,
    threats: `${total} threats identified across the market. ${max.name} faces the most (${max.count}). Monitor these threats as they may affect the entire industry.`,
  };

  return (
    <div className={`mt-4 px-4 py-3 rounded-lg ${q.bg} border ${q.border}`}>
      <div className="flex items-center gap-2 mb-1">
        <Lightbulb size={12} className={q.text} />
        <span className={`text-[11px] font-bold ${q.text} uppercase tracking-wider`}>Insight</span>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed">{messages[q.key]}</p>
    </div>
  );
}
