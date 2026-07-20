import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, trend, trendUp, icon }: MetricCardProps) {
  return (
    <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-slate-200 px-4 py-5 sm:p-6 transition-all hover:shadow-md">
      <dt className="truncate text-sm font-medium text-slate-500 flex items-center justify-between">
        {title}
        {icon && icon}
      </dt>
      <dd className="mt-2 flex items-baseline justify-between">
        <div className="text-2xl font-semibold text-slate-900">{value}</div>
        {trend && (
          <div className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0 ${trendUp ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            {trend}
          </div>
        )}
      </dd>
    </div>
  );
}
