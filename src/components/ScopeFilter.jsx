import useStore from '../store/useStore';

const SCOPES = ['all', 'local', 'regional', 'national', 'multinational', 'global'];

export default function ScopeFilter() {
  const scope = useStore((s) => s.scope);
  const setScope = useStore((s) => s.setScope);
  const competitors = useStore((s) => s.competitors);

  const countByScope = (s) => {
    if (s === 'all') return competitors.length;
    return competitors.filter(
      (c) => (c.geographic_scope || 'national').toLowerCase() === s
    ).length;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0">
        Scope
      </span>
      {SCOPES.map((s) => {
        const count = countByScope(s);
        return (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              scope === s
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="capitalize">{s}</span>
            {count > 0 && (
              <span
                className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${
                  scope === s ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
