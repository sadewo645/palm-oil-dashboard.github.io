import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Props = {
  title: string;
  data: any[];
  xKey: string;
  yKey: string;
};

export default function BarChartCard({ title, data, xKey, yKey }: Props) {
  const gradientId = `${yKey}-gradient`;
  return (
    <div className="card card-pad">
      <div className="text-sm uppercase tracking-wide text-slate-400">{title}</div>
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis dataKey={xKey} stroke="rgba(148, 163, 184, 0.4)" tick={{ fill: 'rgba(226, 232, 240, 0.7)', fontSize: 12 }} />
            <YAxis stroke="rgba(148, 163, 184, 0.4)" tick={{ fill: 'rgba(226, 232, 240, 0.7)', fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              contentStyle={{ background: '#0f172a', borderRadius: '0.75rem', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#e2e8f0' }}
            />
            <Bar dataKey={yKey} radius={[12, 12, 0, 0]} fill={`url(#${gradientId})`} />
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
