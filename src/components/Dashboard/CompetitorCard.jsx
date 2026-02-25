import { MoreHorizontal, ExternalLink, Trash2, Edit3 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';

export default function CompetitorCard({ competitor }) {
  const [showMenu, setShowMenu] = useState(false);
  const deleteCompetitor = useStore((s) => s.deleteCompetitor);

  const c = competitor;

  const statusStyles = {
    Leader: 'bg-blue-50 text-blue-600 border-blue-100',
    Contender: 'bg-violet-50 text-violet-600 border-violet-100',
    Follower: 'bg-amber-50 text-amber-600 border-amber-100',
    Rising: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    You: 'bg-pink-50 text-pink-600 border-pink-100',
    New: 'bg-slate-50 text-slate-600 border-slate-100',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all group relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
            style={{ backgroundColor: c.color }}
          >
            {c.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-900">{c.name}</div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              {c.website}
              <ExternalLink size={10} />
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal size={16} className="text-slate-400" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 w-36">
                <Link
                  to={`/competitor/${c.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 w-full"
                >
                  <Edit3 size={12} /> Edit Profile
                </Link>
                <button
                  onClick={() => {
                    deleteCompetitor(c.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 w-full text-left"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
            statusStyles[c.status] || statusStyles.New
          }`}
        >
          {c.status}
        </span>
        <span className="text-xs text-slate-400">·</span>
        <span className="text-xs text-slate-400">{c.industry}</span>
      </div>

      {/* Score Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-xs text-slate-400">Overall Score</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-900">{c.score}</span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${c.score}%`,
              background: `linear-gradient(90deg, ${c.color}, ${c.color}cc)`,
            }}
          />
        </div>
      </div>

      {/* Trend */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-semibold ${
            c.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'
          }`}
        >
          {c.trend.startsWith('+') ? '↑' : '↓'} {c.trend} this week
        </span>
        <Link
          to={`/competitor/${c.id}`}
          className="text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
