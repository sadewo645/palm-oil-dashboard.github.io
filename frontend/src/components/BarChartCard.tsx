import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BarChartCard({ title, data, xKey, yKey }: { title: string; data: any[]; xKey: string; yKey: string; }) {
  return (
    <div className="card card-pad">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={yKey} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
