import React, { useEffect, useState } from 'react';
import KPICard from '../components/KPICard';
import LineChartCard from '../components/LineChartCard';
import DataTable from '../components/DataTable';
import { api } from '../services/api';

export default function Plantation() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { api.plantation().then(setRows).catch(console.error) }, []);

  const totalFFB = rows.reduce((s,r)=> s + (Number(r.ffb_harvest_ton)||0), 0);
  const avgEff = rows.length? rows.reduce((s,r)=> s + (Number(r.harvest_efficiency_pct)||0),0)/rows.length : 0;

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total TBS (ton)" value={Number(totalFFB.toFixed(2))} />
        <KPICard title="Rata2 Efisiensi Panen" value={Number(avgEff.toFixed(2))} unit="%" />
        <KPICard title="Blok Terpantau" value={rows.map(r=>r.estate).filter(Boolean).length} />
      </div>
      <LineChartCard title="Panen TBS per Tanggal" data={rows} xKey="date" yKey="ffb_harvest_ton" />
      <DataTable columns={["date","estate","area_ha","palm_age_year","ffb_harvest_ton","harvest_efficiency_pct","avg_bunch_weight_kg","rainfall_mm","fertilizer_index","pest_incidence_pct"]} rows={rows} />
    </div>
  );
}
