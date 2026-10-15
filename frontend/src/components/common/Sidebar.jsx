import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ScanText,
  Target,
  GitCompare,
  Compass,
  CheckCircle2,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload Resume', path: '/resume/upload', icon: FileText },
  { name: 'Resume Analysis', path: '/resume/analysis', icon: ScanText },
  { name: 'Target Career', path: '/career/target', icon: Target },
  { name: 'Skill Gap Analysis', path: '/skills/gaps', icon: GitCompare },
  { name: 'Career Readiness', path: '/career-readiness', icon: CheckCircle2 },
  { name: 'Career Options', path: '/career/options', icon: Compass },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Career Portal
        </div>
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#A5B392] text-[#40594C] font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-[#A5B392]/20 rounded-xl border border-[#C8C8BA] text-xs text-slate-800">
        <p className="font-semibold text-slate-900 mb-1">CareerBridge AI v1.0</p>
        <p className="text-slate-600 leading-relaxed">
          Intelligent career readiness and personalized job preparation engine.
        </p>
      </div>
    </aside>
  );
};
