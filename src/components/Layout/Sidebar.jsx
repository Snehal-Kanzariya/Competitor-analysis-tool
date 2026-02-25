import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GitCompareArrows,
  Target,
  Map,
  Star,
  Settings,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/compare', icon: GitCompareArrows, label: 'Comparison' },
  { to: '/swot', icon: Target, label: 'SWOT Analysis' },
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
      <nav className="flex-1 px-3 py-4">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Modules
        </div>
        {navItems.map((item) => (
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
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-800">
        <div className="flex items-center gap-2 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
          <Settings size={14} />
          <span className="text-xs">Settings</span>
        </div>
      </div>
    </aside>
  );
}
