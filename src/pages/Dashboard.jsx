import { useState } from 'react';
import { Plus, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import useStore from '../store/useStore';
import StatsBar from '../components/Dashboard/StatsBar';
import CompetitorCard from '../components/Dashboard/CompetitorCard';
import AddCompetitorModal from '../components/Dashboard/AddCompetitorModal';

export default function Dashboard() {
  const competitors = useStore((s) => s.competitors);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('score'); // score, name, trend
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter
  let filtered = competitors.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (filterStatus !== 'all') {
    filtered = filtered.filter((c) => c.status === filterStatus);
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'trend') return parseInt(b.trend) - parseInt(a.trend);
    return 0;
  });

  const statuses = ['all', ...new Set(competitors.map((c) => c.status))];

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Your competitive landscape at a glance
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/20"
        >
          <Plus size={16} />
          Add Competitor
        </button>
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search competitors..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300 bg-white"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={14} className="text-slate-400" />
          <div className="flex gap-1">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === s
                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                    : 'text-slate-400 hover:bg-slate-100 border border-transparent'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5 ml-auto">
          <ArrowUpDown size={14} className="text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs text-slate-500 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none bg-white"
          >
            <option value="score">Sort by Score</option>
            <option value="name">Sort by Name</option>
            <option value="trend">Sort by Trend</option>
          </select>
        </div>
      </div>

      {/* Competitor Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <CompetitorCard key={c.id} competitor={c} />
          ))}

          {/* Add Card */}
          <button
            onClick={() => setShowModal(true)}
            className="rounded-xl border-2 border-dashed border-slate-200 p-5 flex flex-col items-center justify-center gap-2 text-slate-300 hover:border-blue-300 hover:text-blue-400 transition-colors min-h-[200px] group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
              <Plus size={20} />
            </div>
            <span className="text-sm font-medium">Add Competitor</span>
          </button>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-slate-300" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">No competitors found</h3>
          <p className="text-sm text-slate-400 mb-4">
            {search
              ? `No results for "${search}". Try a different search.`
              : 'Start tracking your competitors by adding one.'}
          </p>
          {!search && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
            >
              Add Your First Competitor
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <AddCompetitorModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
