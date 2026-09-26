import { useState } from 'react';
import { Menu, Search, Bell, Plus, ChevronDown, Check } from 'lucide-react';

interface TopBarProps {
  onMenuClick: () => void;
  onNewReport: () => void;
  query: string;
  onQueryChange: (q: string) => void;
}

export default function TopBar({ onMenuClick, onNewReport, query, onQueryChange }: TopBarProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 glass">
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search reports, metrics, datasets..."
            className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 transition-all focus:border-emerald-500/30 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onNewReport}
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 hover:brightness-110 active:scale-95"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            <span className="hidden sm:inline">New Report</span>
          </button>

          <button className="relative rounded-xl border border-white/5 bg-white/[0.03] p-2.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#0a0f0d]" />
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-white/5"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 text-xs font-bold text-white">
                CB
              </div>
              <span className="hidden text-sm font-medium text-slate-200 sm:inline">Community Bridge</span>
              <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full z-40 mt-2 w-56 animate-scale-in origin-top-right rounded-2xl border border-white/10 bg-[#121b17] p-2 shadow-2xl">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-white">Community Bridge Network</p>
                    <p className="text-xs text-slate-400">admin@cbn.org</p>
                  </div>
                  <div className="my-1 h-px bg-white/5" />
                  {['Account Settings', 'Billing & Plan', 'API Access', 'Export Data'].map((label) => (
                    <button
                      key={label}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
                    >
                      {label}
                    </button>
                  ))}
                  <div className="my-1 h-px bg-white/5" />
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10">
                    <Check className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
