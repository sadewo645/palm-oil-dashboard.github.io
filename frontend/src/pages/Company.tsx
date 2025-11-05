import React, { useEffect, useMemo, useState } from 'react';
import KPICard from '../components/KPICard';
import LineChartCard from '../components/LineChartCard';
import DataTable from '../components/DataTable';
import { api } from '../services/api';

export default function Company() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { api.company().then(setRows).catch(console.error) }, []);

  const totals = useMemo(()=>{
    const revenue = rows.reduce((s,r)=> s + (Number(r.revenue_idr)||0), 0);
    const cogm = rows.reduce((s,r)=> s + (Number(r.cogm_idr)||0), 0);
    const opex = rows.reduce((s,r)=> s + (Number(r.opex_idr)||0), 0);
    const gp = rows.reduce((s,r)=> s + (Number(r.gross_profit_idr)|| (Number(r.revenue_idr)||0) - (Number(r.cogm_idr)||0) - (Number(r.opex_idr)||0), 0);
    return { revenue, cogm, opex, gp };
  }, [rows]);

  const qualityAlert = rows.find(r => (Number(r.cpo_ffa_pct)||0) > 5 || (Number(r.cpo_moisture_pct)||0) > 0.5);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Pendapatan (IDR)" value={totals.revenue.toLocaleString()} />
        <KPICard title="COGM (IDR)" value={totals.cogm.toLocaleString()} />
        <KPICard title="OPEX (IDR)" value={totals.opex.toLocaleString()} />
        <KPICard title="Laba Kotor (IDR)" value={totals.gp.toLocaleString()} />
      </div>
      {qualityAlert && (
        <div className="card card-pad border-amber-400 bg-amber-50 text-amber-900">
          ⚠️ <strong>Quality Alert:</strong> Cek FFA/Moisture di tanggal {qualityAlert.date} (Site: {qualityAlert.site})
        </div>
      )}
      <LineChartCard title="FFA (%) dari waktu ke waktu" data={rows} xKey="date" yKey="cpo_ffa_pct" />
      <DataTable columns={["date","site","cpo_ffa_pct","cpo_moisture_pct","cpo_dirt_pct","cpo_quality_grade","revenue_idr","cogm_idr","opex_idr","gross_profit_idr"]} rows={rows} />
    </div>
  );
}
