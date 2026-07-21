import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

export function SidebarItem({ icon, label, to }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative w-full flex items-center px-4.5 py-3 text-xs font-semibold rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'bg-indigo-50/80 text-indigo-600 shadow-sm' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Subtle RTL-friendly vertical indicator bar */}
          {isActive && (
            <span className="absolute start-0 top-3 bottom-3 w-1 bg-indigo-600 rounded-full" />
          )}
          <span className={`me-3 h-4.5 w-4.5 transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}`}>
            {React.cloneElement(icon as React.ReactElement, { className: 'w-4.5 h-4.5' })}
          </span>
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}
