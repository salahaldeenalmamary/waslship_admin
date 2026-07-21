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
        `w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
          isActive 
            ? 'bg-indigo-50 text-indigo-700' 
            : 'text-slate-700 hover:bg-slate-100'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`me-3 h-5 w-5 ${isActive ? 'text-indigo-700' : 'text-slate-400'}`}>
            {icon}
          </span>
          {label}
        </>
      )}
    </NavLink>
  );
}
