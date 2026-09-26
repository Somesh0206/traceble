import { useState } from 'react';
import { X, FileText, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import type { TraceableReport, ReportStatus } from '@/lib/supabaseClient';

interface NewReportModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (r: TraceableReport) => void;
}

export default function NewReportModal({ open, onClose, onCreated }: NewReportModalProps) {
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('Community Bridge Network');
  const [period, setPeriod] = useState('Jan 2025 — Jun 2025');
  const [status, setStatus] = useState<ReportStatus>('draft');
  const [summary, setSummary] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError(null);
    const { data, error } = await supabase
      .from('traceable_reports')
      .insert({
        title: title.trim(),
        organization: organization.trim(),
        report_period: period.trim(),
        status,
        summary: summary.trim(),
        metric_count: 0,
        record_count: 0,
      })
      .select()
      .single();
    setSaving(false);
    if (error || !data) {
      setError(error?.message ?? 'Could not create report. Please try again.');
      return;
    }
    onCreated(data as TraceableReport);
    setTitle('');
    setSummary('');
    setStatus('draft');
    onClose();
  };

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 transition-all focus:border-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/10';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-fade-in bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg animate-scale-in overflow-hidden rounded-2xl border border-white/10 bg-[#101b16] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Create impact report</h2>
              <p className="text-xs text-slate-400">Start a new traceable report workspace</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Report title</label>
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Food Security Q1 Outcomes"
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Organization</label>
              <input
                className={inputClass}
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Reporting period</label>
              <input className={inputClass} value={period} onChange={(e) => setPeriod(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Initial status</label>
            <div className="grid grid-cols-3 gap-2">
              {(['draft', 'review', 'ready'] as ReportStatus[]).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition-all ${
                    status === s
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'
                  }`}
                >
                  {s === 'review' ? 'In Review' : s === 'ready' ? 'Verified' : 'Draft'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Summary</label>
            <textarea
              className={`${inputClass} min-h-[80px] resize-y`}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief description of the report scope and goals..."
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-300">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300"
            >
              <Sparkles className="h-3.5 w-3.5" /> AI assist available after creation
            </button>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !title.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                {saving ? 'Creating...' : 'Create report'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
