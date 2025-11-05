import React from 'react';

type Props = { columns: string[]; rows: Record<string, any>[] };

export default function DataTable({ columns, rows }: Props) {
  return (
    <div className="card card-pad overflow-auto">
      <table className="min-w-full text-sm text-slate-200">
        <thead className="text-xs uppercase tracking-wide text-slate-400">
          <tr>
            {columns.map((c) => (
              <th key={c} className="text-left font-medium pb-3 pr-6">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className="border-t border-white/5 hover:bg-white/5 transition"
            >
              {columns.map((c) => (
                <td key={c} className="py-2.5 pr-6 text-slate-200/90">
                  {String(row[c] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {!rows.length && (
        <div className="py-6 text-center text-sm text-slate-400">
          Belum ada data tersedia untuk tabel ini.
        </div>
      )}
    </div>
  );
}
