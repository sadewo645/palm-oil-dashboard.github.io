import React from 'react';
import { clsx } from 'clsx';

type SidebarItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  disabled?: boolean;
};

type SidebarGroup = {
  label: string;
  items: SidebarItem[];
};

type Props = {
  groups: SidebarGroup[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
};

export default function Sidebar({ groups, activeId, onSelect, className }: Props) {
  const baseClass = 'flex flex-col w-72 bg-slate-950/40 border-r border-white/5 backdrop-blur-xl px-6 py-8 text-slate-300';
  return (
    <aside className={clsx(baseClass, className)}>
      <div className="text-xs uppercase tracking-widest text-slate-500 mb-6">Menu</div>
      <div className="space-y-8 overflow-y-auto">
        {groups.map(group => (
          <div key={group.label}>
            <div className="text-[0.65rem] uppercase tracking-widest text-slate-500 mb-3">{group.label}</div>
            <nav className="space-y-1">
              {group.items.map(item => {
                const isActive = item.id === activeId;
                const className = clsx(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all border',
                  item.disabled && 'cursor-not-allowed opacity-40 border-transparent',
                  !item.disabled && !isActive && 'hover:bg-white/5 border-transparent',
                  !item.disabled && !isActive && 'text-slate-300',
                  isActive && 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-xl border-transparent'
                );
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={className}
                    onClick={() => !item.disabled && onSelect(item.id)}
                    disabled={item.disabled}
                  >
                    <span className="text-lg text-white/80">
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="text-[0.6rem] uppercase tracking-wide bg-white/10 text-white/80 px-2 py-1 rounded-full">{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
