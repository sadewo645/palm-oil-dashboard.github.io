import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Props = {
  title: string;
  data: any[];
  xKey: string;
  yKey: string;
};

export default function LineChartCard({ title, data, xKey, yKey }: Props) {
  return (
    <div className="card card-pad">
      <div className="text-sm uppercase tracking-wide text-slate-400">{title}</div>
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis dataKey={xKey} stroke="rgba(148, 163, 184, 0.4)" tick={{ fill: 'rgba(226, 232, 240, 0.7)', fontSize: 12 }} />
            <YAxis stroke="rgba(148, 163, 184, 0.4)" tick={{ fill: 'rgba(226, 232, 240, 0.7)', fontSize: 12 }} />
            <Tooltip
              cursor={{ stroke: 'rgba(56, 189, 248, 0.5)' }}
              contentStyle={{ background: '#0f172a', borderRadius: '0.75rem', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#e2e8f0' }}
            />
            <Line type="monotone" dataKey={yKey} stroke="#38bdf8" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
