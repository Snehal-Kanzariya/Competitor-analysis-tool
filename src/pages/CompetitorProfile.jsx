import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Edit3 } from 'lucide-react';
import useStore from '../store/useStore';

export default function CompetitorProfile() {
  const { id } = useParams();
  const competitor = useStore((s) => s.getCompetitor(id));

  if (!competitor) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Competitor not found</h2>
        <Link to="/" className="text-sm text-blue-500 hover:underline">← Back to Dashboard</Link>
      </div>
    );
  }

  const c = competitor;

  return (
    <div>
      {/* Back Link */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-6 transition-colors">
        <ArrowLeft size={14} />
        Back to Dashboard
      </Link>

      {/* Profile Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
            style={{ backgroundColor: c.color }}
          >
            {c.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{c.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-slate-400 flex items-center gap-1">
                {c.website} <ExternalLink size={11} />
              </span>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-sm text-slate-400">{c.industry}</span>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-sm text-slate-400">Founded {c.founded}</span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <Edit3 size={14} />
          Edit Profile
        </button>
      </div>

      {/* Score Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-8">
          <div>
            <div className="text-xs font-medium text-slate-400 mb-1">Overall Score</div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-900">{c.score}</span>
              <span className="text-lg text-slate-300">/100</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="h-3 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${c.score}%`, background: `linear-gradient(90deg, ${c.color}, ${c.color}cc)` }}
              />
            </div>
          </div>
          <div className={`text-lg font-bold ${c.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
            {c.trend.startsWith('+') ? '↑' : '↓'} {c.trend}
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <InfoSection title="Company Overview" items={[
          { label: 'Headquarters', value: c.hq || 'Not set' },
          { label: 'Employees', value: c.employees || 'Not set' },
          { label: 'Funding', value: c.funding || 'Not set' },
          { label: 'Industry', value: c.industry || 'Not set' },
        ]} />
        <InfoSection title="Description" text={c.description || 'No description added yet.'} />
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-emerald-600 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Strengths
          </h3>
          {c.strengths?.length > 0 ? (
            <div className="space-y-2">
              {c.strengths.map((s, i) => (
                <div key={i} className="text-sm text-slate-600 bg-emerald-50 px-3 py-2 rounded-lg">
                  {s}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-300">No strengths added yet</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-red-500 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            Weaknesses
          </h3>
          {c.weaknesses?.length > 0 ? (
            <div className="space-y-2">
              {c.weaknesses.map((w, i) => (
                <div key={i} className="text-sm text-slate-600 bg-red-50 px-3 py-2 rounded-lg">
                  {w}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-300">No weaknesses added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoSection({ title, items, text }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">{title}</h3>
      {text ? (
        <p className="text-sm text-slate-500 leading-relaxed">{text}</p>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <span className="text-xs text-slate-400">{item.label}</span>
              <span className="text-sm font-medium text-slate-700">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
