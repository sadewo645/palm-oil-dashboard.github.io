import React, { useEffect, useState } from 'react';
import KPICard from '../components/KPICard';
import BarChartCard from '../components/BarChartCard';
import DataTable from '../components/DataTable';
import { api } from '../services/api';

export default function Factory() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    api.factory().then(setRows).catch(console.error);
  }, []);

  const avgYield = rows.length ? rows.reduce((sum, row) => sum + (Number(row.cpo_yield_pct) || 0), 0) / rows.length : 0;
  const totalIntake = rows.reduce((sum, row) => sum + (Number(row.ffb_intake_ton) || 0), 0);
  const avgOee = rows.length ? rows.reduce((sum, row) => sum + (Number(row.oee_pct) || 0), 0) / rows.length : 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Kinerja Pabrik CPO</h3>
        <p className="text-sm text-slate-400">Analisis throughput, utilisasi, dan konsumsi energi dari pabrik-pabrik CPO.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Rata-rata CPO Yield" value={Number(avgYield.toFixed(2))} unit="%" trend={avgYield - 23} />
        <KPICard title="Total TBS Masuk" value={Number(totalIntake.toFixed(2)).toLocaleString()} unit="ton" hint="akumulasi harian" />
        <KPICard title="Rata-rata OEE" value={Number(avgOee.toFixed(2))} unit="%" trend={avgOee - 75} />
      </div>
      <BarChartCard title="Throughput (ton/jam)" data={rows} xKey="date" yKey="throughput_tph" />
      <DataTable columns={["date","mill","ffb_intake_ton","oee_pct","throughput_tph","downtime_hours","steam_pressure_bar","kernel_recovery_pct","cpo_yield_pct","fuel_consumption_litre"]} rows={rows} />
    </div>
  );
}
