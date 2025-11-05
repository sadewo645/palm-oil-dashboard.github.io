import React, { useEffect, useState } from 'react';
import KPICard from '../components/KPICard';
import LineChartCard from '../components/LineChartCard';
import DataTable from '../components/DataTable';
import { api } from '../services/api';

export default function Plantation() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    api.plantation().then(setRows).catch(console.error);
  }, []);

  const totalFFB = rows.reduce((sum, row) => sum + (Number(row.ffb_harvest_ton) || 0), 0);
  const avgEff = rows.length ? rows.reduce((sum, row) => sum + (Number(row.harvest_efficiency_pct) || 0), 0) / rows.length : 0;
  const uniqueEstates = new Set(rows.map((row) => row.estate).filter(Boolean)).size;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Performa Perkebunan</h3>
        <p className="text-sm text-slate-400">Ringkasan produksi TBS dan indikator agronomi utama dari seluruh blok kebun.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total TBS" value={Number(totalFFB.toFixed(2)).toLocaleString()} unit="ton" hint="akumulasi bulan berjalan" />
        <KPICard title="Rata-rata Efisiensi Panen" value={Number(avgEff.toFixed(2))} unit="%" trend={avgEff - 80} />
        <KPICard title="Blok Terpantau" value={uniqueEstates} hint="blok dengan data aktif" />
      </div>
      <LineChartCard title="Panen TBS per Tanggal" data={rows} xKey="date" yKey="ffb_harvest_ton" />
      <DataTable columns={["date","estate","area_ha","palm_age_year","ffb_harvest_ton","harvest_efficiency_pct","avg_bunch_weight_kg","rainfall_mm","fertilizer_index","pest_incidence_pct"]} rows={rows} />
    </div>
  );
}
