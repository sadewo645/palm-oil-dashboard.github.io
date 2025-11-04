import React from 'react';

export default function SectionNav({ section, setSection }: { section: string; setSection: (s: string) => void; }) {
  const tabs = [
    { id: 'plantation', label: 'Perkebunan' },
    { id: 'factory', label: 'Pabrik CPO' },
    { id: 'company', label: 'Perusahaan' }
  ];
  return (
    <div className="flex gap-2">
      {tabs.map(t => (
        <button key={t.id} onClick={() => setSection(t.id)} className={`px-4 py-2 rounded-xl border ${section===t.id? 'bg-brand text-white border-brand' : 'bg-white dark:bg-slate-800 border-slate-300'}`}>{t.label}</button>
      ))}
    </div>
  );
}
