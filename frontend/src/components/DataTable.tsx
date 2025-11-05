import React from 'react';

type Props = { columns: string[]; rows: Record<string, any>[] };
export default function DataTable({ columns, rows }: Props) {
  return (
    <div className="card card-pad overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c} className="text-left font-medium text-slate-500 pb-2 pr-6">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-200">
              {columns.map(c => (
                <td key={c} className="py-2 pr-6">{String(r[c] ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );}
