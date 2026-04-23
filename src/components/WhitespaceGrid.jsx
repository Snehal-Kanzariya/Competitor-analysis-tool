const TYPE_COLORS = {
  geographic: 'bg-blue-50 text-blue-600 border-blue-100',
  segment: 'bg-violet-50 text-violet-600 border-violet-100',
  price_point: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  feature: 'bg-amber-50 text-amber-600 border-amber-100',
  use_case: 'bg-pink-50 text-pink-600 border-pink-100',
  channel: 'bg-slate-100 text-slate-600 border-slate-200',
};

function LevelDot({ level, label }) {
  const colors = { low: 'bg-emerald-400', medium: 'bg-amber-400', high: 'bg-red-400' };
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full shrink-0 ${colors[level] ?? 'bg-slate-300'}`} />
      <span className="text-[11px] text-slate-500">{label}</span>
    </div>
  );
}

export default function WhitespaceGrid({ opportunities = [] }) {
  if (!opportunities.length) {
    return (
      <div className="text-center py-8 text-sm text-slate-400">
        No whitespace opportunities identified.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {opportunities.map((opp, i) => {
        const typeStyle = TYPE_COLORS[opp.type] ?? TYPE_COLORS.channel;
        return (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col hover:shadow-sm transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start gap-2 mb-3">
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0 capitalize ${typeStyle}`}
              >
                {(opp.type ?? 'unknown').replace(/_/g, ' ')}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 mb-2 leading-snug">
              {opp.title}
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-3">
              {opp.description}
            </p>

            {/* Difficulty / Upside badges */}
            <div className="flex gap-3 mb-3">
              <LevelDot level={opp.estimated_difficulty} label={`Difficulty: ${opp.estimated_difficulty ?? '?'}`} />
              <LevelDot level={opp.estimated_upside === 'high' ? 'low' : opp.estimated_upside === 'low' ? 'high' : 'medium'} label={`Upside: ${opp.estimated_upside ?? '?'}`} />
            </div>

            {/* Why incumbents ignore */}
            {opp.why_incumbents_ignore_it && (
              <p className="text-[11px] italic text-slate-400 border-t border-slate-100 pt-2 mt-auto">
                {opp.why_incumbents_ignore_it}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
