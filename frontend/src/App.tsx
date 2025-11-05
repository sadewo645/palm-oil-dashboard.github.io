import React, { useMemo, useState } from 'react';
import { BookOpenIcon, ChartBarSquareIcon, ShieldCheckIcon, TableCellsIcon, PresentationChartBarIcon, Cog6ToothIcon, TruckIcon } from '@heroicons/react/24/outline';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Guides from './pages/Guides';
import Monitoring from './pages/Monitoring';

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  disabled?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Panduan',
    items: [
      { id: 'guides', label: 'Panduan Budidaya', icon: <BookOpenIcon className="h-5 w-5" /> },
      { id: 'compliance', label: 'SOP & Compliance', icon: <ShieldCheckIcon className="h-5 w-5" />, disabled: true }
    ]
  },
  {
    label: 'Operasional',
    items: [
      { id: 'monitoring', label: 'Monitoring Hasil', icon: <ChartBarSquareIcon className="h-5 w-5" /> },
      { id: 'logistics', label: 'Logistik TBS', icon: <TruckIcon className="h-5 w-5" />, disabled: true }
    ]
  },
  {
    label: 'Admin',
    items: [
      { id: 'data', label: 'Data Master', icon: <TableCellsIcon className="h-5 w-5" />, disabled: true },
      { id: 'analytics', label: 'Advanced Analytics', icon: <PresentationChartBarIcon className="h-5 w-5" />, disabled: true },
      { id: 'settings', label: 'Pengaturan', icon: <Cog6ToothIcon className="h-5 w-5" />, disabled: true }
    ]
  }
];

export default function App() {
  const [activeId, setActiveId] = useState('guides');
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = useMemo(() => {
    switch (activeId) {
      case 'guides':
        return <Guides />;
      case 'monitoring':
        return <Monitoring />;
      case 'logistics':
      case 'compliance':
      case 'data':
      case 'analytics':
      case 'settings':
        return <ComingSoon title={NAV_GROUPS.flatMap((group) => group.items).find((item) => item.id === activeId)?.label ?? 'Segera Hadir'} />;
      default:
        return <ComingSoon title="Segera Hadir" />;
    }
  }, [activeId]);

  const handleSelect = (id: string) => {
    setActiveId(id);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-transparent flex">
      <Sidebar groups={NAV_GROUPS} activeId={activeId} onSelect={handleSelect} className="hidden lg:flex" />
      {mobileOpen && (
        <div className="fixed inset-0 z-30 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <Sidebar groups={NAV_GROUPS} activeId={activeId} onSelect={handleSelect} className="relative z-10 h-full" />
        </div>
      )}
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar onToggleSidebar={() => setMobileOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {content}
          </div>
        </main>
      </div>
    </div>
  );
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="card card-pad text-center text-slate-300">
      <div className="text-sm uppercase tracking-wide text-slate-500">{title}</div>
      <div className="mt-4 text-2xl font-semibold text-white">Segera hadir</div>
      <p className="mt-3 text-sm text-slate-400">
        Modul ini sedang dikembangkan untuk mendukung operasional Anda. Hubungi tim kami untuk prioritas implementasi.
      </p>
    </div>
  );
}
