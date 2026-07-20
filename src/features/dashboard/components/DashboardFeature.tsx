import React from 'react';
import { Truck, CheckCircle2, Wallet } from 'lucide-react';
import { MetricCard } from '../../../components/ui/MetricCard';
import { ShipmentRow } from '../../../components/ui/ShipmentRow';

export default function DashboardFeature() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of your logistics and wallet balance.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Shipments" value="1,248" trend="+12%" trendUp={true} />
        <MetricCard title="In Transit" value="42" icon={<Truck className="w-5 h-5 text-blue-500" />} />
        <MetricCard title="Delivered" value="1,180" icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} />
        <MetricCard title="Wallet Balance" value="SAR 4,500.00" icon={<Wallet className="w-5 h-5 text-indigo-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Shipments */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Recent Shipments</h2>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
          </div>
          <div className="divide-y divide-slate-100">
            <ShipmentRow id="SHP-10294" awb="ARX-98231234" courier="Aramex" status="In Transit" destination="Riyadh" date="Today, 10:42 AM" />
            <ShipmentRow id="SHP-10293" awb="SMS-55612399" courier="SMSA" status="Delivered" destination="Jeddah" date="Yesterday, 4:15 PM" />
            <ShipmentRow id="SHP-10292" awb="SPL-77182311" courier="SPL" status="Pending Pickup" destination="Dammam" date="Yesterday, 1:30 PM" />
            <ShipmentRow id="SHP-10291" awb="ARX-98231001" courier="Aramex" status="Delivered" destination="Mecca" date="Oct 12, 9:00 AM" />
          </div>
        </div>

        {/* Courier Rates Widget */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Quick Rate Calc</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Origin City</label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-slate-50 border">
                <option>Riyadh</option>
                <option>Jeddah</option>
                <option>Dammam</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Destination City</label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-slate-50 border">
                <option>Jeddah</option>
                <option>Riyadh</option>
                <option>Dammam</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Weight (kg)</label>
              <input type="number" defaultValue={1} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 border px-3 py-2" />
            </div>
            <button className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors">
              Compare Rates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
