import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '◧' },
  { to: '/assets', label: 'Asset Register', icon: '▤' },
  { to: '/risks', label: 'Risk Register', icon: '⚠' },
  { to: '/risk-matrix', label: 'Risk Matrix', icon: '▦' },
  { to: '/controls', label: 'Control Library', icon: '◉' },
  { to: '/mapping', label: 'Risk-Control Mapping', icon: '⇄' },
  { to: '/gaps', label: 'Compliance Gaps', icon: '⚑' },
  { to: '/remediation', label: 'Remediation Tracker', icon: '✓' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-navy-950 text-slate-200 min-h-screen flex flex-col">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-accent flex items-center justify-center text-navy-950 font-bold text-sm">NT</div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">NovaTech Solutions</p>
            <p className="text-[11px] text-slate-400 leading-tight">GRC Assessment Tool</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="w-4 text-center text-accent">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-white/10 text-[11px] text-slate-500 leading-relaxed">
        Educational portfolio project. All data is fictional demo data.
      </div>
    </aside>
  );
}
