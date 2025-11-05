import React, { useState } from 'react';
import Plantation from './Plantation';
import Factory from './Factory';
import Company from './Company';
import SectionNav from '../components/SectionNav';

const tabs = [
  { id: 'plantation', label: 'Perkebunan' },
  { id: 'factory', label: 'Pabrik CPO' },
  { id: 'company', label: 'Perusahaan' }
];

export default function Monitoring() {
  const [tab, setTab] = useState('plantation');
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="pill bg-sky-500/20 text-sky-200">Monitoring Hasil</div>
          <h2 className="mt-2 text-3xl font-semibold text-white">Monitoring Operasional</h2>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Pantau kinerja kebun, pabrik, dan perusahaan secara real-time. Gunakan tab di bawah ini untuk menggali metrik spesifik setiap lini bisnis.
          </p>
        </div>
      </div>
      <SectionNav section={tab} setSection={setTab} tabs={tabs} />
      <div className="space-y-6">
        {tab === 'plantation' && <Plantation />}
        {tab === 'factory' && <Factory />}
        {tab === 'company' && <Company />}
      </div>
    </div>
  );
}
