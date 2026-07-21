import React from 'react';
import { useAuth } from '../../../providers/AuthProvider';
import { useLanguage } from '../../../providers/LanguageProvider';
import MerchantWalletTab from '../components/MerchantWalletTab';
import DepositFundsTab from '../components/DepositFundsTab';
import AdminTransfersTab from '../components/AdminTransfersTab';
import AdminAccountsTab from '../components/AdminAccountsTab';
import AppTabs, { AppTabItem } from '../../../components/common/AppTabs';
import { 
  ArrowDownToLine, 
  ShieldCheck, 
  Building2, 
  History, 
  Coins 
} from 'lucide-react';

export default function WalletPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Verify if current user is an Admin
  const isAdmin = user?.role === 'Admin' || user?.role?.toLowerCase() === 'admin';

  const tabItems: AppTabItem[] = [
    { 
      id: 'overview', 
      label: t('overviewAndLogs'), 
      icon: History,
      content: () => <MerchantWalletTab />
    },
    { 
      id: 'deposit', 
      label: t('depositFunds'), 
      icon: ArrowDownToLine,
      content: () => <DepositFundsTab />
    },
    ...(isAdmin ? [
      { 
        id: 'admin_transfers', 
        label: t('reviewTransfersAdmin'), 
        icon: ShieldCheck,
        content: () => <AdminTransfersTab />
      },
      { 
        id: 'admin_accounts', 
        label: t('officialAccountsAdmin'), 
        icon: Building2,
        content: () => <AdminAccountsTab />
      }
    ] : [])
  ];

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

      {/* Main Tab Bar with Dynamic rendering and persistence */}
      <AppTabs 
        tabs={tabItems}
        variant="underline"
        size="md"
        persistenceKey="merchant_wallet_tabs"
        persistenceMode="local"
        lazy={true}
      />
    </div>
  );
}
