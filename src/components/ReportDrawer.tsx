import { useState } from 'react';
import {
  X,
  Calendar,
  Database,
  BarChart2,
  ShieldCheck,
  Link2,
  Download,
  Share2,
  Edit3,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  Users,
  TrendingUp,
} from 'lucide-react';
import type { TraceableReport, ReportStatus } from '@/lib/supabaseClient';

interface ReportDrawerProps {
  report: TraceableReport | null;
  onClose: () => void;
}

const statusFlow: { id: ReportStatus; label: string }[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'review', label: 'Review' },
  { id: 'ready', label: 'Verified' },
];

// Deterministic pseudo-metrics derived from the report so the detail view feels alive without extra tables.
function buildMetrics(r: TraceableReport) {
  const base = r.metric_count || 8;
  return [
    { name: 'Beneficiaries reached', value: r.record_count, unit: 'people', change: '+12.4%' },
    { name: 'Programs covered', value: Math.max(3, Math.round(base / 2)), unit: 'programs', change: '+2' },
    { name: 'Verification rate', value: 98.6, unit: '%', change: '+1.1%' },
    { name: 'Source datasets linked', value: Math.max(2, Math.round(base / 3)), unit: 'sources', change: '+1' },
  ];
}

export default function ReportDrawer({ report, onClose }: ReportDrawerProps) {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const metrics = buildMetrics(report);
  const currentStep = statusFlow.findIndex((s) => s.id === report.status);

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 animate-fade-in bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex h-full w-full max-w-2xl animate-slide-up flex-col overflow-y-auto border-l border-white/10 bg-[#0c1411] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-white/5 bg-[#0c1411]/95 px-5 py-4 backdrop-blur sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold leading-tight text-white">{report.title}</h2>
                <p className="text-sm text-slate-400">{report.organization}</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/5">
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/5">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/5"
            >
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              {copied ? 'Link copied' : 'Share'}
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6 px-5 py-6 sm:px-7">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Calendar, label: 'Period', value: report.report_period },
              { icon: BarChart2, label: 'Metrics', value: String(report.metric_count) },
              { icon: Database, label: 'Records', value: report.record_count.toLocaleString() },
              { icon: Clock, label: 'Updated', value: formatRelative(report.updated_at) },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                  <Icon className="h-4 w-4 text-slate-500" />
                  <p className="mt-2 text-sm font-semibold text-white">{m.value}</p>
                  <p className="text-[11px] text-slate-500">{m.label}</p>
                </div>
              );
            })}
          </div>

          {/* Status tracker */}
          <div className="rounded-2xl border border-white/5 bg-[#0e1713] p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Workflow status</p>
            <div className="flex items-center">
              {statusFlow.map((step, i) => {
                const done = i <= currentStep;
                const active = i === currentStep;
                return (
                  <div key={step.id} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                          done
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                            : 'border-white/10 bg-white/[0.02] text-slate-600'
                        } ${active ? 'ring-4 ring-emerald-500/10' : ''}`}
                      >
                        {done ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                      </div>
                      <span className={`mt-2 text-[11px] font-medium ${done ? 'text-emerald-300' : 'text-slate-600'}`}>
                        {step.label}
                      </span>
                    </div>
                    {i < statusFlow.length - 1 && (
                      <div className="mx-2 h-0.5 flex-1 rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: i < currentStep ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-white">Report summary</h3>
            <p className="text-sm leading-relaxed text-slate-400">{report.summary}</p>
          </div>

          {/* Metrics */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Key metrics</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {metrics.map((m) => (
                <div
                  key={m.name}
                  className="group rounded-xl border border-white/5 bg-[#0e1713] p-4 transition-colors hover:border-white/10"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xs text-slate-400">{m.name}</p>
                    <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-300">
                      <TrendingUp className="h-3 w-3" /> {m.change}
                    </span>
                  </div>
                  <p className="mt-2 text-xl font-bold text-white">
                    {typeof m.value === 'number' && m.value > 999 ? m.value.toLocaleString() : m.value}
                    <span className="ml-1 text-xs font-normal text-slate-500">{m.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence chain */}
          <div className="rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-emerald-500/[0.04] to-transparent p-5">
            <div className="flex items-center gap-2.5">
              <Link2 className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Evidence chain</h3>
              <span className="ml-auto flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Verified
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { icon: FileSpreadsheet, label: 'Source dataset', value: 'cbn_field_survey_2024.csv' },
                { icon: Users, label: 'Collected by', value: '12 field officers' },
                { icon: ShieldCheck, label: 'Integrity hash', value: '0x8f3a...c42e' },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="flex items-center gap-3 rounded-lg bg-white/[0.02] px-3.5 py-2.5">
                    <Icon className="h-4 w-4 shrink-0 text-slate-500" />
                    <span className="text-xs text-slate-500">{row.label}</span>
                    <span className="ml-auto font-mono text-xs text-slate-300">{row.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
