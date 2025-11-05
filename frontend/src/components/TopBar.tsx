import React from 'react';
import { MagnifyingGlassIcon, BellIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

type Props = {
  onToggleSidebar?: () => void;
};

export default function TopBar({ onToggleSidebar }: Props) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 border-b border-white/5 bg-slate-950/40 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-2xl bg-white/5 text-white"
          onClick={onToggleSidebar}
        >
          <span className="sr-only">Toggle navigation</span>
          ☰
        </button>
        <div>
          <div className="text-sm uppercase tracking-[0.35em] text-slate-400">Palm Oil Ops</div>
          <div className="text-xl md:text-2xl font-semibold text-white">Budidaya Kelapa Sawit</div>
        </div>
      </div>
      <div className="flex-1 hidden md:flex items-center max-w-xl">
        <div className="relative w-full">
          <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            placeholder="Cari modul panduan, KPI, atau data lapangan"
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 text-slate-200">
        <button className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10" type="button">
          <QuestionMarkCircleIcon className="h-5 w-5" />
        </button>
        <button className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10" type="button">
          <BellIcon className="h-5 w-5" />
        </button>
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-sm font-semibold">
          RA
        </div>
      </div>
    </header>
  );
}
