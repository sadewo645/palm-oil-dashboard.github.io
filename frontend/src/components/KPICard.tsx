import React from 'react';

export default function KPICard({ title, value, unit, trend }: { title: string; value: number | string; unit?: string; trend?: number; }) {
  const trendColor = trend && trend >= 0 ? 'text-green-600' : 'text-red-600';
  const trendSign = trend && trend >= 0 ? '+' : '';
  return (
    <div className="card card-pad">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-3xl font-semibold">{value}{unit ? <span className="text-base font-normal ml-1">{unit}</span> : null}</div>
      {typeof trend === 'number' && (
        <div className={`mt-1 text-sm ${trendColor}`}>{trendSign}{trend.toFixed(2)}%</div>
      )}
    </div>
  );
}
