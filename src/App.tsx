import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Database,
  TrendingUp,
  Loader2,
  AlertCircle,
  Filter,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import type { TraceableReport, ReportStatus } from '@/lib/supabaseClient';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import StatCard from '@/components/StatCard';
import ReportCard from '@/components/ReportCard';
import NewReportModal from '@/components/NewReportModal';
import ReportDrawer from '@/components/ReportDrawer';
import ActivityFeed from '@/components/ActivityFeed';
import MiniChart from '@/components/MiniChart';

type LoadState = 'loading' | 'ready' | 'error';

export default function App() {
  const [nav, setNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [reports, setReports] = useState<TraceableReport[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<TraceableReport | null>(null);

  const fetchReports = useCallback(async () => {
    setLoadState('loading');
    const { data, error } = await supabase
      .from('traceable_reports')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) {
      setLoadState('error');
      setErrorMsg(error.message);
      return;
    }
    setReports((data as TraceableReport[]) ?? []);
    setLoadState('ready');
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchesQuery =
        !query ||
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.summary.toLowerCase().includes(query.toLowerCase()) ||
        r.organization.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [reports, query, statusFilter]);

  const stats = useMemo(() => {
    const totalMetrics = reports.reduce((s, r) => s + r.metric_count, 0);
    const totalRecords = reports.reduce((s, r) => s + r.record_count, 0);
    const verified = reports.filter((r) => r.status === 'ready').length;
    return {
      total: reports.length,
      verified,
      totalMetrics,
      totalRecords,
    };
  }, [reports]);

  const handleCreated = (r: TraceableReport) => {
    setReports((prev) => [r, ...prev]);
  };

  const filterChips: { id: ReportStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'All reports' },
    { id: 'draft', label: 'Drafts' },
    { id: 'review', label: 'In review' },
    { id: 'ready', label: 'Verified' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0f0d] text-slate-200">
      <Sidebar active={nav} onNavigate={setNav} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          onNewReport={() => setModalOpen(true)}
          query={query}
          onQueryChange={setQuery}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
            {/* Page header */}
            <div className="animate-fade-in flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
                  <Sparkles className="h-3 w-3" /> Traceability workspace
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Impact Reports</h1>
                <p className="mt-1.5 max-w-2xl text-sm text-slate-400">
                  Create, verify, and share evidence-backed program reports. Every metric is linked to its source
                  dataset with a tamper-evident integrity trail.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-xs text-slate-400">Chain integrity</p>
                  <p className="text-sm font-semibold text-white">All reports verified</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total reports"
                value={String(stats.total)}
                delta="+3"
                trend="up"
                icon={FileText}
                accent="#34d399"
                delay={0}
              />
              <StatCard
                label="Verified reports"
                value={String(stats.verified)}
                delta="+1"
                trend="up"
                icon={ShieldCheck}
                accent="#38bdf8"
                delay={60}
              />
              <StatCard
                label="Tracked metrics"
                value={stats.totalMetrics.toLocaleString()}
                delta="+8"
                trend="up"
                icon={TrendingUp}
                accent="#fbbf24"
                delay={120}
              />
              <StatCard
                label="Source records"
                value={compactNumber(stats.totalRecords)}
                delta="+1.2k"
                trend="up"
                icon={Database}
                accent="#f472b6"
                delay={180}
              />
            </div>

            {/* Main grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-5">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Filter className="h-3.5 w-3.5" /> Filter
                  </span>
                  {filterChips.map((chip) => (
                    <button
                      key={chip.id}
                      onClick={() => setStatusFilter(chip.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                        statusFilter === chip.id
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                          : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Reports list */}
                {loadState === 'loading' && (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#0e1713] py-20">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
                    <p className="mt-3 text-sm text-slate-400">Loading reports...</p>
                  </div>
                )}

                {loadState === 'error' && (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/5 py-20">
                    <AlertCircle className="h-6 w-6 text-rose-400" />
                    <p className="mt-3 text-sm text-slate-300">Could not load reports</p>
                    <p className="mt-1 max-w-xs text-center text-xs text-slate-500">{errorMsg}</p>
                    <button
                      onClick={fetchReports}
                      className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {loadState === 'ready' && (
                  <>
                    {filtered.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#0e1713]/50 py-20">
                        <FileText className="h-8 w-8 text-slate-600" />
                        <p className="mt-3 text-sm font-medium text-slate-300">No reports found</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {query || statusFilter !== 'all'
                            ? 'Try adjusting your search or filters.'
                            : 'Create your first report to get started.'}
                        </p>
                        <button
                          onClick={() => setModalOpen(true)}
                          className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:brightness-110"
                        >
                          Create report <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        {filtered.map((r, i) => (
                          <ReportCard key={r.id} report={r} onOpen={setSelected} index={i} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Right column */}
              <div className="space-y-5">
                <MiniChart
                  data={[94.2, 95.1, 96.3, 95.8, 97.2, 97.9, 98.6]}
                  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
                />
                <ActivityFeed />
              </div>
            </div>
          </div>
        </main>
      </div>

      <NewReportModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={handleCreated} />
      <ReportDrawer report={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function compactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}
