import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ShipmentRowProps {
  id: string;
  awb: string;
  courier: string;
  status: string;
  destination: string;
  date: string;
}

export function ShipmentRow({ id, awb, courier, status, destination, date }: ShipmentRowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Pending Pickup': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
      <div className="flex items-center min-w-0 flex-1">
        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-4 md:gap-4 flex items-center">
          <div className="col-span-1">
            <p className="text-sm font-medium text-indigo-600 truncate group-hover:text-indigo-700">{id}</p>
            <p className="text-xs text-slate-500 flex items-center mt-0.5">
              <span className="font-medium mr-1 text-slate-700">{courier}</span> • {awb}
            </p>
          </div>
          <div className="hidden md:block col-span-1">
            <p className="text-sm text-slate-900">{destination}</p>
            <p className="text-xs text-slate-500 mt-0.5">{date}</p>
          </div>
          <div className="hidden md:block col-span-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
        </div>
      </div>
      <div>
        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
      </div>
    </div>
  );
}
