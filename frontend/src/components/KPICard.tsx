import React from 'react';

type Props = {
  title: string;
  value: number | string;
  unit?: string;
  trend?: number;
  hint?: string;
};

export default function KPICard({ title, value, unit, trend, hint }: Props) {
  const isPositive = typeof trend === 'number' ? trend >= 0 : undefined;
  const trendColor = isPositive === undefined ? 'text-slate-400' : isPositive ? 'text-emerald-400' : 'text-rose-400';
  const formattedTrend = typeof trend === 'number' ? `${isPositive ? '+' : ''}${trend.toFixed(2)}%` : hint;

  return (
    <div className="card card-pad border-white/10 bg-white/5">
      <div className="text-xs uppercase tracking-wide text-slate-400">{title}</div>
      <div className="mt-3 flex items-baseline gap-2 text-3xl font-semibold text-white">
        {value}
        {unit ? <span className="text-base font-normal text-slate-400">{unit}</span> : null}
      </div>
      {formattedTrend && (
        <div className={`mt-3 text-xs font-medium ${trendColor}`}>{formattedTrend}</div>
      )}
    </div>
  );
}
