import React from 'react';

type Tab = { id: string; label: string };

type Props = {
  section: string;
  setSection: (section: string) => void;
  tabs?: Tab[];
};

export default function SectionNav({ section, setSection, tabs }: Props) {
  const tabItems = tabs ?? [
    { id: 'plantation', label: 'Perkebunan' },
    { id: 'factory', label: 'Pabrik CPO' },
    { id: 'company', label: 'Perusahaan' },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {tabItems.map((tab) => {
        const isActive = section === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setSection(tab.id)}
            className={`px-4 py-2.5 rounded-2xl border text-sm font-medium transition ${
              isActive
                ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg border-transparent'
                : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
            type="button"
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
