import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRightIcon, SparklesIcon, DevicePhoneMobileIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { api } from '../services/api';

interface PlantationRow {
  date: string;
  estate: string;
  area_ha: number;
  palm_age_year: number;
  ffb_harvest_ton: number;
  harvest_efficiency_pct: number;
  avg_bunch_weight_kg: number;
  rainfall_mm: number;
  fertilizer_index: number;
  pest_incidence_pct: number;
}

type ModuleCard = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
};

const guideTabs = [
  'Faktor Penentu Produktivitas',
  'Pembibitan',
  'Land Preparation',
  'Tanam & Perawatan Kelapa Sawit',
  'Pengendalian Hama',
  'Logistik TBS',
  'Panen & Angkut'
];

export default function Guides() {
  const [selectedTab, setSelectedTab] = useState(guideTabs[0]);
  const [rows, setRows] = useState<PlantationRow[]>([]);

  useEffect(() => {
    api.plantation().then((data) => setRows(data as PlantationRow[])).catch(console.error);
  }, []);

  const metrics = useMemo(() => {
    if (!rows.length) {
      return {
        avgEfficiency: 0,
        avgRainfall: 0,
        avgFertilizer: 0,
        avgPest: 0,
        introHighlight: 'Perkuat pondasi produktivitas dengan memahami faktor dasar budidaya.'
      };
    }
    const avgEfficiency = rows.reduce((acc, cur) => acc + (Number(cur.harvest_efficiency_pct) || 0), 0) / rows.length;
    const avgRainfall = rows.reduce((acc, cur) => acc + (Number(cur.rainfall_mm) || 0), 0) / rows.length;
    const avgFertilizer = rows.reduce((acc, cur) => acc + (Number(cur.fertilizer_index) || 0), 0) / rows.length;
    const avgPest = rows.reduce((acc, cur) => acc + (Number(cur.pest_incidence_pct) || 0), 0) / rows.length;
    const introHighlight = avgEfficiency > 80
      ? 'Tim panen menunjukkan performa konsisten di atas 80%.'
      : 'Masih ada ruang untuk meningkatkan efisiensi panen lapangan.';
    return { avgEfficiency, avgRainfall, avgFertilizer, avgPest, introHighlight };
  }, [rows]);

  const moduleCards: ModuleCard[] = [
    {
      id: 'connect',
      title: 'Connect device',
      description: 'Integrasikan sensor kebun & met station untuk insight real-time.',
      icon: <DevicePhoneMobileIcon className="h-8 w-8" />,
      gradient: 'from-sky-500 via-blue-500 to-indigo-500'
    },
    {
      id: 'automation',
      title: 'Proses otomatis',
      description: 'Bangun alur approval pemupukan & inspeksi panen otomatis.',
      icon: <Cog6ToothIcon className="h-8 w-8" />,
      gradient: 'from-emerald-500 via-teal-500 to-sky-500'
    },
    {
      id: 'insight',
      title: 'Insight lapangan',
      description: 'Lacak KPI penting per blok dan rekomendasi tindakan harian.',
      icon: <SparklesIcon className="h-8 w-8" />,
      gradient: 'from-fuchsia-500 via-purple-500 to-sky-500'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3 text-sm">
        {guideTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-2xl border transition ${selectedTab === tab ? 'bg-white text-slate-900 border-white shadow-lg' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card card-pad space-y-4">
          <span className="pill bg-emerald-500/20 text-emerald-200">Panduan Budidaya</span>
          <h2 className="text-3xl font-semibold text-white">Introduction</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Kelapa sawit (<em>Elaeis guineensis</em>) adalah tanaman perkebunan tropis penghasil minyak nabati utama.
            Panduan ini menyajikan praktik terbaik pengelolaan kebun mulai dari persiapan lahan, pemeliharaan, hingga panen.
          </p>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-200">
            {metrics.introHighlight}
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sky-300 text-sm hover:text-sky-200 transition"
          >
            Lihat kurikulum lengkap
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="gradient-card p-6 md:p-8 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500">
            <div className="pill bg-white/30 text-white/90">welcome to webagriculture</div>
            <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-white">Come on, learn all of the palm cultivation modules.</h3>
                <p className="mt-3 text-sm text-white/85 max-w-xl">
                  Modul onboarding membantu tim kebun memahami langkah-langkah kunci untuk meningkatkan produktivitas dan menjaga kualitas TBS.
                </p>
              </div>
              <div className="w-full md:w-56">
                <div className="text-xs uppercase tracking-wide text-white/70">Onboarding</div>
                <div className="mt-2 h-2 rounded-full bg-white/30">
                  <div className="h-full rounded-full bg-white/80" style={{ width: '32%' }} />
                </div>
                <div className="mt-2 text-sm text-white/80">Progress 32%</div>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {moduleCards.map((card) => (
              <div key={card.id} className={`gradient-card relative overflow-hidden bg-gradient-to-br ${card.gradient} p-6`}> 
                <div className="relative z-10 space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{card.title}</h4>
                    <p className="text-sm text-white/85 leading-relaxed">{card.description}</p>
                  </div>
                  <button className="inline-flex items-center gap-1 text-sm text-white/90 hover:text-white" type="button">
                    Buka modul
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card card-pad">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="section-title">Faktor Penentu Produktivitas</h3>
            <p className="section-subtitle">
              Pantau indikator agronomi utama untuk memastikan potensi hasil TBS terpenuhi.
            </p>
          </div>
          <div className="text-xs text-slate-400">Tab aktif: {selectedTab}</div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Efisiensi Panen" value={metrics.avgEfficiency} unit="%" trend="target ≥ 85%" />
          <StatCard label="Curah Hujan" value={metrics.avgRainfall} unit="mm" trend="optimalkan drainase" />
          <StatCard label="Indeks Pemupukan" value={metrics.avgFertilizer} trend="0-1" />
          <StatCard label="Insiden Hama" value={metrics.avgPest} unit="%" trend="monitor mingguan" />
        </div>
      </section>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: number;
  unit?: string;
  trend?: string;
};

function StatCard({ label, value, unit, trend }: StatCardProps) {
  const formatted = Number.isFinite(value) ? value.toFixed(unit === '%' ? 1 : 2) : '0.0';
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-3 flex items-baseline gap-1 text-2xl font-semibold text-white">
        {formatted}
        {unit && <span className="text-sm text-slate-400">{unit}</span>}
      </div>
      {trend && <div className="mt-3 text-xs text-slate-400">{trend}</div>}
    </div>
  );
}
