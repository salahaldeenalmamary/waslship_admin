import React, { ReactNode } from 'react';
import { 
  Package, 
  Truck, 
  BarChart3, 
  Wallet, 
  Settings as SettingsIcon, 
  Plus, 
  Search, 
  Bell, 
  MapPin,
  Users as UsersIcon,
  LogOut
} from 'lucide-react';
import { SidebarItem } from '../components/ui/SidebarItem';
import { useAuth } from '../providers/AuthProvider';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Truck className="w-6 h-6 text-indigo-600 mr-2" />
          <span className="text-xl font-bold text-slate-900">WaslShip</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <SidebarItem icon={<BarChart3 />} label="Dashboard" to="/dashboard" />
          <SidebarItem icon={<Package />} label="Shipments" to="/shipments" />
          <SidebarItem icon={<MapPin />} label="Courier Rates" to="/rates" />
          <SidebarItem icon={<Wallet />} label="Wallet & Billing" to="/wallet" />
          <SidebarItem icon={<UsersIcon />} label="Users" to="/users" />
          <SidebarItem icon={<SettingsIcon />} label="Settings" to="/settings" />
        </nav>
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                {user?.fullName.charAt(0) || 'A'}
              </div>
              <div className="ml-3">
                <p className="text-xs font-semibold text-slate-900 truncate w-24">{user?.fullName || 'Admin'}</p>
                <p className="text-[10px] text-slate-500 truncate w-24">{user?.email || 'admin@waslship.com'}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8">
          <div className="flex-1 flex">
            <div className="max-w-md w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                placeholder="Track shipment (AWB) or search orders..."
              />
            </div>
          </div>
          <div className="ml-4 flex items-center md:ml-6 space-x-4">
            <button className="p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none transition-colors">
              <Bell className="h-6 w-6" />
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none flex items-center shadow-sm transition-all active:scale-95">
              <Plus className="w-4 h-4 mr-1.5" />
              New Shipment
            </button>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
