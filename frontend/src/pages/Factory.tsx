import React, { useEffect, useState } from 'react';
import KPICard from '../components/KPICard';
import BarChartCard from '../components/BarChartCard';
import DataTable from '../components/DataTable';
import { api } from '../services/api';

export default function Factory() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { api.factory().then(setRows).catch(console.error) }, []);

  const avgYield = rows.length? rows.reduce((s,r)=> s + (Number(r.cpo_yield_pct)||0),0)/rows.length : 0;
  const totalIntake = rows.reduce((s,r)=> s + (Number(r.ffb_intake_ton)||0), 0);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Rata2 CPO Yield" value={Number(avgYield.toFixed(2))} unit="%" />
        <KPICard title="Total TBS Masuk" value={Number(totalIntake.toFixed(2))} />
        <KPICard title="Rata2 OEE" value={Number((rows.reduce((s,r)=> s + (Number(r.oee_pct)||0),0)/Math.max(rows.length,1)).toFixed(2))} unit="%" />
      </div>
      <BarChartCard title="Throughput (ton/jam)" data={rows} xKey="date" yKey="throughput_tph" />
      <DataTable columns={["date","mill","ffb_intake_ton","oee_pct","throughput_tph","downtime_hours","steam_pressure_bar","kernel_recovery_pct","cpo_yield_pct","fuel_consumption_litre"]} rows={rows} />
    </div>
  );
}
