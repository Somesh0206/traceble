import { FileText, Calendar, Database, BarChart2, ArrowRight, Clock } from 'lucide-react';
import type { TraceableReport, ReportStatus } from '@/lib/supabaseClient';

interface ReportCardProps {
  report: TraceableReport;
  onOpen: (r: TraceableReport) => void;
  index: number;
}

const statusConfig: Record<ReportStatus, { label: string; dot: string; chip: string }> = {
  draft: {
    label: 'Draft',
    dot: 'bg-amber-400',
    chip: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  },
  review: {
    label: 'In Review',
    dot: 'bg-sky-400',
    chip: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
  },
  ready: {
    label: 'Verified',
    dot: 'bg-emerald-400',
    chip: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  },
};

export default function ReportCard({ report, onOpen, index }: ReportCardProps) {
  const status = statusConfig[report.status];

  return (
    <button
      onClick={() => onOpen(report)}
      className="group relative w-full animate-slide-up overflow-hidden rounded-2xl border border-white/5 bg-[#0e1713] p-5 text-left transition-all duration-300 hover:border-emerald-500/20 hover:bg-[#101b16]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold leading-tight text-white">{report.title}</h3>
            <p className="text-xs text-slate-500">{report.organization}</p>
          </div>
        </div>
        <span className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.chip}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-400">{report.summary}</p>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {report.report_period}
        </span>
        <span className="flex items-center gap-1.5">
          <BarChart2 className="h-3.5 w-3.5" />
          {report.metric_count} metrics
        </span>
        <span className="flex items-center gap-1.5">
          <Database className="h-3.5 w-3.5" />
          {report.record_count.toLocaleString()} records
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
        <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Clock className="h-3 w-3" />
          Updated {formatRelative(report.updated_at)}
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-300 transition-all group-hover:gap-2">
          Open report <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
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
