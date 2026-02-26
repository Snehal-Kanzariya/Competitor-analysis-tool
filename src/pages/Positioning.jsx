import { useState, useRef, useMemo, useCallback } from 'react';
import { Settings2, Download, Info } from 'lucide-react';
import useStore from '../store/useStore';

const axisPresets = [
  { label: 'Price vs Quality', x: 'Price Level', y: 'Product Quality' },
  { label: 'Features vs Ease of Use', x: 'Feature Richness', y: 'Ease of Use' },
  { label: 'Innovation vs Market Share', x: 'Innovation', y: 'Market Share' },
  { label: 'Brand vs Value', x: 'Brand Strength', y: 'Value for Money' },
];

const quadrantLabelsMap = {
  'Price Level|Product Quality': ['Budget Pick', 'Premium Leader', 'Underperformer', 'Overpriced'],
  'Feature Richness|Ease of Use': ['Simple & Light', 'Best in Class', 'Bare Bones', 'Feature Bloat'],
  'Innovation|Market Share': ['Niche Innovator', 'Market Leader', 'Laggard', 'Legacy Player'],
  'Brand Strength|Value for Money': ['Hidden Gem', 'Top Choice', 'Unknown & Pricey', 'Brand Tax'],
};

export default function Positioning() {
  const competitors = useStore((s) => s.competitors);
  const positioning = useStore((s) => s.positioning);

  const [xAxis, setXAxis] = useState(positioning?.xAxis || 'Price Level');
  const [yAxis, setYAxis] = useState(positioning?.yAxis || 'Product Quality');
  const [showSettings, setShowSettings] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [localPositions, setLocalPositions] = useState(() => {
    const pos = {};
    competitors.forEach((c, i) => {
      if (positioning?.positions?.[c.id]) {
        pos[c.id] = positioning.positions[c.id];
      } else {
        pos[c.id] = {
          x: 20 + (c.score / 100) * 55 + ((i * 13) % 25),
          y: 15 + (c.score / 100) * 55 + ((i * 17) % 20),
        };
      }
    });
    return pos;
  });

  const mapRef = useRef(null);
  const labels = quadrantLabelsMap[`${xAxis}|${yAxis}`] || ['Niche', 'Leaders', 'Laggards', 'Overpriced'];

  const handleMouseDown = useCallback((compId, e) => {
    e.preventDefault();
    setDragging(compId);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!dragging || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    const y = Math.max(5, Math.min(95, 100 - rawY));
    setLocalPositions((prev) => ({ ...prev, [dragging]: { x, y } }));
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handlePreset = (preset) => {
    setXAxis(preset.x);
    setYAxis(preset.y);
    setShowSettings(false);
  };

  const exportMap = () => {
    const lines = competitors.map((c) => {
      const pos = localPositions[c.id] || { x: 50, y: 50 };
      return `${c.name}: ${xAxis}=${pos.x.toFixed(0)}%, ${yAxis}=${pos.y.toFixed(0)}%`;
    });
    const csv = `Market Positioning Map\n${xAxis} vs ${yAxis}\n\n${lines.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'positioning-map.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Market Positioning</h1>
          <p className="text-sm text-slate-400 mt-1">Drag competitors to position them · {xAxis} vs {yAxis}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportMap} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors">
            <Download size={13} /> Export
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${showSettings ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
            <Settings2 size={13} /> Axes
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Axis Presets</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {axisPresets.map((p) => (
              <button key={p.label} onClick={() => handlePreset(p)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${xAxis === p.x && yAxis === p.y ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent'}`}>
                {p.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">X-Axis (Horizontal)</label>
              <input type="text" value={xAxis} onChange={(e) => setXAxis(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Y-Axis (Vertical)</label>
              <input type="text" value={yAxis} onChange={(e) => setYAxis(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-300">Low {xAxis}</span>
          <span className="text-xs font-bold text-slate-500">{xAxis} → {yAxis}</span>
          <span className="text-[11px] font-semibold text-slate-300">High {xAxis}</span>
        </div>

        <div ref={mapRef} className="relative bg-slate-50 rounded-xl border border-slate-200 select-none" style={{ paddingBottom: '65%', cursor: dragging ? 'grabbing' : 'default' }}>
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200" />
          <div className="absolute left-1/4 top-0 bottom-0 w-px bg-slate-100" />
          <div className="absolute left-3/4 top-0 bottom-0 w-px bg-slate-100" />
          <div className="absolute top-1/4 left-0 right-0 h-px bg-slate-100" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-slate-100" />

          {[
            { label: labels[0], x: '25%', y: '25%' },
            { label: labels[1], x: '75%', y: '25%' },
            { label: labels[2], x: '25%', y: '75%' },
            { label: labels[3], x: '75%', y: '75%' },
          ].map((q) => (
            <div key={q.label} className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: q.x, top: q.y }}>
              <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">{q.label}</span>
            </div>
          ))}

          {competitors.map((c) => {
            const pos = localPositions[c.id] || { x: 50, y: 50 };
            const isHovered = hoveredId === c.id;
            const isDragging = dragging === c.id;
            const size = isDragging ? 48 : isHovered ? 44 : 38;

            return (
              <div key={c.id} className="absolute" style={{ left: `${pos.x}%`, top: `${100 - pos.y}%`, transform: 'translate(-50%, -50%)', zIndex: isDragging ? 20 : isHovered ? 15 : 10 }}>
                <div
                  onMouseDown={(e) => handleMouseDown(c.id, e)}
                  onMouseEnter={() => setHoveredId(c.id)}
                  onMouseLeave={() => !dragging && setHoveredId(null)}
                  className="flex items-center justify-center rounded-full text-white font-bold transition-all"
                  style={{
                    width: size, height: size, backgroundColor: c.color, fontSize: size > 40 ? 18 : 15,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    boxShadow: isDragging ? `0 0 0 4px ${c.color}33, 0 8px 24px rgba(0,0,0,0.2)` : isHovered ? `0 0 0 4px ${c.color}33, 0 4px 12px rgba(0,0,0,0.15)` : `0 2px 6px rgba(0,0,0,0.1)`,
                  }}
                >
                  {c.name.charAt(0)}
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap" style={{ top: '100%', marginTop: 6 }}>
                  <div className="bg-white rounded-md shadow-sm border border-slate-200 px-2 py-1">
                    <div className="text-[11px] font-semibold text-slate-700">{c.name}</div>
                    {isHovered && <div className="text-[10px] text-slate-400">{xAxis}: {pos.x.toFixed(0)}% · {yAxis}: {pos.y.toFixed(0)}%</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between mt-2">
          <span className="text-[11px] font-semibold text-slate-300">Low {yAxis}</span>
          <span className="text-[11px] font-semibold text-slate-300">High {yAxis}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 flex-wrap">
        {competitors.map((c) => (
          <div key={c.id} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color }} />
            <span className="text-xs text-slate-500 font-medium">{c.name}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-auto text-[11px] text-slate-300">
          <Info size={12} /> Drag dots to reposition
        </div>
      </div>
    </div>
  );
}
