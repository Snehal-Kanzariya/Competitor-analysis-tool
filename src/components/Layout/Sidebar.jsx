import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GitCompareArrows,
  Target,
  Map,
  Star,
  Settings,
  Sparkles,
  Crown,
  FileDown,
} from 'lucide-react';

const navItems = [
  { to: '/research', icon: Sparkles, label: 'AI Research', highlight: true },
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/compare', icon: GitCompareArrows, label: 'Comparison' },
  { to: '/swot', icon: Target, label: 'SWOT Analysis' },
  { to: '/monopoly', icon: Crown, label: 'Monopoly' },
  { to: '/positioning', icon: Map, label: 'Positioning' },
  { to: '/scoring', icon: Star, label: 'Scoring' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-slate-900 text-white flex flex-col border-r border-slate-800 shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-sm font-extrabold">
            C
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight">CompetitorIQ</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Analysis Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Research
        </div>

        {/* AI Research button — special styling */}
        <NavLink
          to="/research"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] mb-3 transition-all ${
              isActive
                ? 'bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-blue-300 font-semibold border border-blue-500/20'
                : 'bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-blue-400 hover:from-blue-500/20 hover:to-violet-500/20 border border-transparent'
            }`
          }
        >
          <Sparkles size={16} />
          AI Research
        </NavLink>

        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2 mt-2">
          Analysis
        </div>

        {navItems.filter(item => item.to !== '/research').map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] mb-0.5 transition-all ${
                isActive
                  ? 'bg-blue-500/15 text-blue-300 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'
              }`
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}

        {/* Reports Section */}
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2 mt-4">
          Reports
        </div>

        <NavLink
          to="/export"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] mb-0.5 transition-all ${
              isActive
                ? 'bg-blue-500/15 text-blue-300 font-semibold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`
          }
        >
          <FileDown size={16} />
          Export & Reports
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-800">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-2 transition-colors ${
              isActive ? 'text-blue-300' : 'text-slate-500 hover:text-slate-300'
            }`
          }
        >
          <Settings size={14} />
          <span className="text-xs">Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}
