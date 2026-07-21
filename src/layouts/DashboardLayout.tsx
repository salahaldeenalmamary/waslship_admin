import React, { ReactNode, useState } from 'react';
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
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SidebarItem } from '../components/ui/SidebarItem';
import { useAuth } from '../providers/AuthProvider';
import { useLanguage } from '../providers/LanguageProvider';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { t, isRTL } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 flex" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-e border-slate-150 flex flex-col hidden lg:flex flex-shrink-0">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight block leading-none">WaslShip</span>
              <span className="text-[9px] text-slate-500 font-bold block mt-0.5">{t('merchantPortal') || 'Merchant Portal'}</span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <SidebarItem icon={<BarChart3 />} label={t('dashboard')} to="/dashboard" />
          <SidebarItem icon={<Package />} label={t('shipments')} to="/shipments" />
          <SidebarItem icon={<MapPin />} label={t('courierRates')} to="/rates" />
          <SidebarItem icon={<Wallet />} label={t('walletBilling')} to="/wallet" />
          <SidebarItem icon={<UsersIcon />} label={t('users')} to="/users" />
          <SidebarItem icon={<SettingsIcon />} label={t('settings')} to="/settings" />
        </nav>

        {/* Sidebar Profile */}
        <div className="p-4 border-t border-slate-150 bg-slate-50/20">
          <div className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center min-w-0">
              <div className="w-8.5 h-8.5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold flex-shrink-0 text-sm">
                {user?.fullName.charAt(0) || 'A'}
              </div>
              <div className="ms-2.5 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate w-24 leading-tight">{user?.fullName || t('admin')}</p>
                <p className="text-[10px] text-slate-500 truncate w-24 mt-0.5">{user?.email || 'admin@waslship.com'}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100/50 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
              title={t('logout')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-in Menu Container */}
            <motion.aside
              initial={isRTL ? { x: '100%' } : { x: '-100%' }}
              animate={{ x: 0 }}
              exit={isRTL ? { x: '100%' } : { x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 start-0 w-72 bg-white shadow-2xl flex flex-col z-10 border-e border-slate-200"
            >
              {/* Header with Close Button */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-150">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-base font-extrabold text-slate-900 tracking-tight block leading-none">WaslShip</span>
                    <span className="text-[9px] text-slate-500 font-bold block mt-0.5">{t('merchantPortal') || 'Merchant Portal'}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="flex-1 px-4.5 py-6 space-y-1.5 overflow-y-auto">
                <SidebarItem icon={<BarChart3 />} label={t('dashboard')} to="/dashboard" />
                <SidebarItem icon={<Package />} label={t('shipments')} to="/shipments" />
                <SidebarItem icon={<MapPin />} label={t('courierRates')} to="/rates" />
                <SidebarItem icon={<Wallet />} label={t('walletBilling')} to="/wallet" />
                <SidebarItem icon={<UsersIcon />} label={t('users')} to="/users" />
                <SidebarItem icon={<SettingsIcon />} label={t('settings')} to="/settings" />
              </nav>

              {/* Profile card and logout at the bottom */}
              <div className="p-4 border-t border-slate-150">
                <div className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center min-w-0">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold flex-shrink-0 text-sm">
                      {user?.fullName.charAt(0) || 'A'}
                    </div>
                    <div className="ms-3 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate w-32 leading-tight">{user?.fullName || t('admin')}</p>
                      <p className="text-[10px] text-slate-500 truncate w-32 mt-1">{user?.email || 'admin@waslship.com'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-100/50 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                    title={t('logout')}
                  >
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-150 flex items-center justify-between px-4 md:px-6 lg:px-8 shadow-sm">
          <div className="flex-1 flex items-center gap-3">
            {/* Hamburger mobile menu trigger button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ms-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg lg:hidden cursor-pointer transition-all"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Real Search Box */}
            <div className="max-w-md w-full relative hidden sm:block">
              <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                <Search className="h-4.5 w-4.5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full ps-9.5 pe-4 py-1.5 border border-slate-200 focus:border-indigo-500 rounded-xl leading-5 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 text-xs md:text-sm transition-all shadow-inner-sm"
                placeholder={t('searchPlaceholder')}
              />
            </div>
          </div>

          {/* Action and controls on right */}
          <div className="ms-4 flex items-center gap-3 md:gap-4 flex-shrink-0">
            <LanguageSwitcher />
            
            {/* Notification bell with simple status dot */}
            <button className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-50 focus:outline-none transition-all relative cursor-pointer">
              <Bell className="h-5.5 w-5.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />
            </button>

            {/* Primary Action Button */}
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs md:text-sm font-bold shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/15 focus:outline-none flex items-center transition-all active:scale-95 cursor-pointer">
              <Plus className="w-4 h-4 me-1.5" />
              <span className="hidden sm:inline">{t('newShipment')}</span>
            </button>
          </div>
        </header>

        {/* Main scrollable body area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
