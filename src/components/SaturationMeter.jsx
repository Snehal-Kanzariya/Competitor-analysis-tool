// SVG semicircle gauge, 0–100, no chart library

const MATURITY_LABELS = {
  greenfield: 'Greenfield',
  emerging: 'Emerging',
  competitive: 'Competitive',
  saturated: 'Saturated',
  winner_take_all: 'Winner-Take-All',
};

function scoreToColor(score) {
  if (score <= 30) return '#10B981'; // green
  if (score <= 60) return '#F59E0B'; // yellow
  if (score <= 85) return '#F97316'; // orange
  return '#EF4444'; // red
}

export default function SaturationMeter({ score = 0, maturity }) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const color = scoreToColor(clampedScore);

  // Semicircle arc math
  const cx = 80, cy = 80, r = 60;
  const startAngle = Math.PI;
  const endAngle = 0;
  const sweepAngle = endAngle - startAngle; // -π (goes left to right)

  // Background arc: full semicircle
  const bgStart = polarToXY(cx, cy, r, Math.PI);
  const bgEnd = polarToXY(cx, cy, r, 0);

  // Filled arc: from left to score position
  const scoreAngle = Math.PI - (clampedScore / 100) * Math.PI;
  const fillEnd = polarToXY(cx, cy, r, scoreAngle);

  const bgArc = describeArc(cx, cy, r, Math.PI, 0);
  const fillArc = describeArc(cx, cy, r, Math.PI, scoreAngle);

  // Needle
  const needleAngle = Math.PI - (clampedScore / 100) * Math.PI;
  const needleTip = polarToXY(cx, cy, r - 8, needleAngle);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 160 95" className="w-full max-w-[200px]">
        {/* Background track */}
        <path d={bgArc} fill="none" stroke="#E2E8F0" strokeWidth="14" strokeLinecap="round" />
        {/* Colored fill */}
        {clampedScore > 0 && (
          <path d={fillArc} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" />
        )}
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="4" fill={color} />
        {/* Score label */}
        <text x={cx} y={cy + 20} textAnchor="middle" fontSize="22" fontWeight="700" fill="#0F172A">
          {clampedScore}
        </text>
        <text x={cx} y={cy + 33} textAnchor="middle" fontSize="9" fill="#94A3B8">
          / 100
        </text>
        {/* Scale labels */}
        <text x="14" y="88" fontSize="8" fill="#94A3B8">0</text>
        <text x="140" y="88" fontSize="8" fill="#94A3B8">100</text>
      </svg>
      {maturity && (
        <div className="mt-1 text-xs font-semibold" style={{ color }}>
          {MATURITY_LABELS[maturity] ?? maturity}
        </div>
      )}
    </div>
  );
}

function polarToXY(cx, cy, r, angle) {
  return { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToXY(cx, cy, r, startAngle);
  const end = polarToXY(cx, cy, r, endAngle);
  const largeArc = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}
