import { Users, Trophy, TrendingUp, Layers } from 'lucide-react';
import useStore from '../../store/useStore';

export default function StatsBar() {
  const competitors = useStore((s) => s.competitors);

  const totalCompetitors = competitors.length;
  const avgScore = (competitors.reduce((sum, c) => sum + c.score, 0) / totalCompetitors).toFixed(1);
  const yourProduct = competitors.find((c) => c.status === 'You');
  const sorted = [...competitors].sort((a, b) => b.score - a.score);
  const yourRank = yourProduct ? sorted.findIndex((c) => c.id === yourProduct.id) + 1 : '-';

  const stats = [
    {
      label: 'Total Competitors',
      value: totalCompetitors,
      subtext: 'Being tracked',
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      label: 'Your Ranking',
      value: `#${yourRank}`,
      subtext: `of ${totalCompetitors} competitors`,
      icon: Trophy,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Average Score',
      value: avgScore,
      subtext: 'Across all competitors',
      icon: TrendingUp,
      color: 'text-violet-500',
      bg: 'bg-violet-50',
    },
    {
      label: 'Top Score',
      value: sorted[0]?.score || 0,
      subtext: sorted[0]?.name || 'N/A',
      icon: Layers,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">{s.label}</span>
            <div className={`${s.bg} ${s.color} p-1.5 rounded-lg`}>
              <s.icon size={15} />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900">{s.value}</div>
          <div className="text-xs text-slate-400 mt-1">{s.subtext}</div>
        </div>
      ))}
    </div>
  );
}
