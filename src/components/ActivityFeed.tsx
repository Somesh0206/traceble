import { CheckCircle2, FileEdit, Upload, UserPlus, AlertTriangle } from 'lucide-react';

interface Activity {
  id: string;
  icon: typeof CheckCircle2;
  label: string;
  detail: string;
  time: string;
  tone: 'success' | 'info' | 'warning';
}

const activities: Activity[] = [
  {
    id: '1',
    icon: CheckCircle2,
    label: 'Report verified',
    detail: 'Youth Skills Cohort 4 passed integrity check',
    time: '2m ago',
    tone: 'success',
  },
  {
    id: '2',
    icon: FileEdit,
    label: 'Report updated',
    detail: 'Clean Water Access summary edited by Admin',
    time: '1h ago',
    tone: 'info',
  },
  {
    id: '3',
    icon: Upload,
    label: 'Dataset linked',
    detail: 'cbn_field_survey_2024.csv attached to Clean Water',
    time: '3h ago',
    tone: 'info',
  },
  {
    id: '4',
    icon: UserPlus,
    label: 'Team member added',
    detail: 'Dr. Amara Okafor joined as validator',
    time: '1d ago',
    tone: 'info',
  },
  {
    id: '5',
    icon: AlertTriangle,
    label: 'Validation needed',
    detail: 'Maternal Health Outreach has 2 unresolved flags',
    time: '2d ago',
    tone: 'warning',
  },
];

const toneConfig = {
  success: 'bg-emerald-500/10 text-emerald-300',
  info: 'bg-sky-500/10 text-sky-300',
  warning: 'bg-amber-500/10 text-amber-300',
};

export default function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0e1713] p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Recent activity</h3>
        <button className="text-xs font-medium text-emerald-300 hover:text-emerald-200">View all</button>
      </div>
      <div className="mt-4 space-y-1">
        {activities.map((a, i) => {
          const Icon = a.icon;
          return (
            <div
              key={a.id}
              className="group flex gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/[0.02]"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneConfig[a.tone]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-slate-200">{a.label}</p>
                  <span className="shrink-0 text-[11px] text-slate-500">{a.time}</span>
                </div>
                <p className="truncate text-xs text-slate-500">{a.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
