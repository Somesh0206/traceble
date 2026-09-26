import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  ShieldCheck,
  FolderKanban,
  FlaskConical,
  X,
} from 'lucide-react';

interface SidebarProps {
  active: string;
  onNavigate: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navGroups = [
  {
    label: 'Workspace',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'reports', label: 'Reports', icon: FileText, badge: '12' },
      { id: 'projects', label: 'Projects', icon: FolderKanban },
      { id: 'datasets', label: 'Datasets', icon: BarChart3 },
    ],
  },
  {
    label: 'Organization',
    items: [
      { id: 'team', label: 'Team', icon: Users },
      { id: 'validation', label: 'Data Validation', icon: FlaskConical },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function Sidebar({ active, onNavigate, isOpen, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/5 bg-[#0b1310] transition-all duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <p className="text-sm font-semibold leading-tight text-white">Traceable</p>
                <p className="text-[11px] leading-tight text-slate-400">Impact Reports</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white lg:block"
            aria-label="Toggle sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L2 8L6 12M10 4L14 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        onClose();
                      }}
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      } ${collapsed ? 'justify-center' : ''}`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-emerald-400' : ''}`} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left font-medium">{item.label}</span>
                          {item.badge && (
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className={`border-t border-white/5 p-3 ${collapsed ? 'px-2' : ''}`}>
          <button
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Help & Support' : undefined}
          >
            <HelpCircle className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span className="font-medium">Help & Support</span>}
          </button>
          {!collapsed && (
            <div className="mt-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-3.5">
              <p className="text-xs font-semibold text-white">Verification active</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                Source data is linked and tamper-evident across all reports.
              </p>
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-[10px] font-medium text-emerald-300">Last sync 2m ago</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
