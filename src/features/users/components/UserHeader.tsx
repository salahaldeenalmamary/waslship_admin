import React from 'react';
import { RefreshCw, UserPlus } from 'lucide-react';

interface UserHeaderProps {
  onAddClick: () => void;
  onRefreshClick: () => void;
  isFetching: boolean;
}

export function UserHeader({ onAddClick, onRefreshClick, isFetching }: UserHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-sm text-slate-500 mt-1">Manage admin access and operator permissions.</p>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onRefreshClick}
          disabled={isFetching}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
          title="Refresh List"
        >
          <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
        </button>
        <button 
          onClick={onAddClick}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center transition-all active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add New User
        </button>
      </div>
    </div>
  );
}
