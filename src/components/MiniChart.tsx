interface MiniChartProps {
  data: number[];
  labels: string[];
  color?: string;
}

export default function MiniChart({ data, labels, color = '#34d399' }: MiniChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 40;
  const step = width / (data.length - 1);

  const points = data.map((d, i) => {
    const x = i * step;
    const y = height - ((d - min) / range) * height;
    return [x, y];
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="rounded-2xl border border-white/5 bg-[#0e1713] p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Verification trend</h3>
          <p className="text-xs text-slate-500">Last 7 reporting periods</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-white">98.6%</p>
          <p className="text-[11px] font-medium text-emerald-300">+1.1% vs last</p>
        </div>
      </div>

      <div className="mt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height: '120px' }}>
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#chartFill)" />
          <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {points.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r="1.5" fill={color} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      </div>

      <div className="mt-3 flex justify-between">
        {labels.map((l) => (
          <span key={l} className="text-[10px] text-slate-600">{l}</span>
        ))}
      </div>
    </div>
  );
}
