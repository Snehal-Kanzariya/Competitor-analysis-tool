const VERDICT_CONFIG = {
  pursue: {
    icon: '✅',
    accent: 'border-emerald-300 bg-emerald-50',
    titleColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-100 text-emerald-700',
    checkColor: 'text-emerald-500',
  },
  pursue_with_pivot: {
    icon: '⚠️',
    accent: 'border-amber-300 bg-amber-50',
    titleColor: 'text-amber-700',
    badgeBg: 'bg-amber-100 text-amber-700',
    checkColor: 'text-amber-500',
  },
  dont_pursue: {
    icon: '🛑',
    accent: 'border-red-300 bg-red-50',
    titleColor: 'text-red-700',
    badgeBg: 'bg-red-100 text-red-700',
    checkColor: 'text-red-400',
  },
};

export default function VerdictCard({ recommendations }) {
  if (!recommendations) return null;

  const { verdict, one_line_verdict, suggested_wedge, first_90_days = [], kill_criteria = [] } =
    recommendations;

  const config = VERDICT_CONFIG[verdict] ?? VERDICT_CONFIG.pursue_with_pivot;

  return (
    <div className={`rounded-xl border-2 p-5 md:p-6 mb-6 ${config.accent}`}>
      {/* Verdict badge */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{config.icon}</span>
        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${config.badgeBg}`}>
          {(verdict ?? '').replace(/_/g, ' ')}
        </span>
      </div>

      {/* One-line verdict */}
      {one_line_verdict && (
        <h2 className={`text-lg md:text-xl font-bold leading-snug mb-2 ${config.titleColor}`}>
          {one_line_verdict}
        </h2>
      )}

      {/* Suggested wedge */}
      {suggested_wedge && (
        <p className="text-sm text-slate-600 mb-5 leading-relaxed">{suggested_wedge}</p>
      )}

      {/* Two columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First 90 days */}
        {first_90_days.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              First 90 Days
            </div>
            <ul className="space-y-1.5">
              {first_90_days.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className={`mt-0.5 shrink-0 ${config.checkColor}`}>✓</span>
                  <span className="text-sm text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Kill criteria */}
        {kill_criteria.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Kill Criteria
            </div>
            <ul className="space-y-1.5">
              {kill_criteria.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-slate-400">✗</span>
                  <span className="text-sm text-slate-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
