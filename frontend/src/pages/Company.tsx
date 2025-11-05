import React, { useEffect, useMemo, useState } from 'react';
import KPICard from '../components/KPICard';
import LineChartCard from '../components/LineChartCard';
import DataTable from '../components/DataTable';
import { api } from '../services/api';

export default function Company() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    api.company().then(setRows).catch(console.error);
  }, []);

  const totals = useMemo(() => {
    const revenue = rows.reduce((s, r) => s + (Number(r.revenue_idr) || 0), 0);
    const cogm = rows.reduce((s, r) => s + (Number(r.cogm_idr) || 0), 0);
    const opex = rows.reduce((s, r) => s + (Number(r.opex_idr) || 0), 0);
    const gp = rows.reduce(
      (s, r) =>
        s +
        (Number(r.gross_profit_idr) ||
          (Number(r.revenue_idr) || 0) -
            (Number(r.cogm_idr) || 0) -
            (Number(r.opex_idr) || 0)),
      0
    );
    return { revenue, cogm, opex, gp };
  }, [rows]);

  const qualityAlert = rows.find(
    (r) =>
      (Number(r.cpo_ffa_pct) || 0) > 5 ||
      (Number(r.cpo_moisture_pct) || 0) > 0.5
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">
          Kualitas Produk & Finansial
        </h3>
        <p className="text-sm text-slate-400">
          Pantau mutu CPO dan performa finansial perusahaan secara terpadu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="Pendapatan"
          value={`Rp ${totals.revenue.toLocaleString()}`}
          hint="akumulasi YTD"
        />
        <KPICard
          title="COGM"
          value={`Rp ${totals.cogm.toLocaleString()}`}
          hint="biaya produksi"
        />
        <KPICard
          title="OPEX"
          value={`Rp ${totals.opex.toLocaleString()}`}
          hint="operasional"
        />
        <KPICard
          title="Laba Kotor"
          value={`Rp ${totals.gp.toLocaleString()}`}
          hint="setelah biaya"
        />
      </div>

      {qualityAlert && (
        <div className="rounded-2xl border border-amber-400/50 bg-amber-500/15 px-6 py-4 text-amber-100">
          <div className="text-sm font-semibold">⚠️ Quality Alert</div>
          <div className="text-sm text-amber-100/80">
            Cek FFA/Moisture di tanggal {qualityAlert.date} (Site:{' '}
            {qualityAlert.site})
          </div>
        </div>
      )}

      <LineChartCard
        title="FFA (%) dari waktu ke waktu"
        data={rows}
        xKey="date"
        yKey="cpo_ffa_pct"
      />
      <DataTable
        columns={[
          'date',
          'site',
          'cpo_ffa_pct',
          'cpo_moisture_pct',
          'cpo_dirt_pct',
          'cpo_quality_grade',
          'revenue_idr',
          'cogm_idr',
          'opex_idr',
          'gross_profit_idr',
        ]}
        rows={rows}
      />
    </div>
  );
}
