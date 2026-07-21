import React, { useState } from 'react';
import { useAuth } from '../../../providers/AuthProvider';
import { useLanguage } from '../../../providers/LanguageProvider';
import MerchantWalletTab from '../components/MerchantWalletTab';
import DepositFundsTab from '../components/DepositFundsTab';
import AdminTransfersTab from '../components/AdminTransfersTab';
import AdminAccountsTab from '../components/AdminAccountsTab';
import { 
  Wallet, 
  ArrowDownToLine, 
  ShieldCheck, 
  Building2, 
  History, 
  Coins 
} from 'lucide-react';

export default function WalletPage() {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  
  // Primary Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'admin_transfers' | 'admin_accounts'>('overview');

  // Verify if current user is an Admin
  const isAdmin = user?.role === 'Admin' || user?.role?.toLowerCase() === 'admin';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Coins className="w-7 h-7 text-indigo-600" />
            {t('walletBilling')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('walletBillingDesc')}
          </p>
        </div>
      </div>

      {/* Main Tab Bar */}
      <div className="border-b border-slate-200">
        <nav className="flex flex-wrap -mb-px gap-6" aria-label="Tabs" id="wallet-main-tabs">
          {/* Overview Tab */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <History className="w-4 h-4" />
            {t('overviewAndLogs')}
          </button>

          {/* Deposit Funds Tab */}
          <button
            onClick={() => setActiveTab('deposit')}
            className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'deposit'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <ArrowDownToLine className="w-4 h-4" />
            {t('depositFunds')}
          </button>

          {/* Admin Tabs (Only visible if Admin) */}
          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab('admin_transfers')}
                className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'admin_transfers'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-indigo-700 hover:border-slate-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                {t('reviewTransfersAdmin')}
              </button>

              <button
                onClick={() => setActiveTab('admin_accounts')}
                className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'admin_accounts'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-indigo-700 hover:border-slate-300'
                }`}
              >
                <Building2 className="w-4 h-4" />
                {t('officialAccountsAdmin')}
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Tab Contents */}
      <div className="py-2" id="wallet-tab-content">
        {activeTab === 'overview' && <MerchantWalletTab />}
        {activeTab === 'deposit' && <DepositFundsTab />}
        {activeTab === 'admin_transfers' && isAdmin && <AdminTransfersTab />}
        {activeTab === 'admin_accounts' && isAdmin && <AdminAccountsTab />}
      </div>
    </div>
  );
}
