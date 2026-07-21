import React from 'react';
import WebhooksTab from '../components/WebhooksTab';
import MerchantBankAccountsTab from '../components/MerchantBankAccountsTab';
import { useLanguage } from '../../../providers/LanguageProvider';
import AppTabs, { AppTabItem } from '../../../components/common/AppTabs';
import { Globe, CheckCircle, CreditCard, MapPin, Webhook } from 'lucide-react';

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();

  const subTabs: AppTabItem[] = [
    { 
      id: 'general', 
      label: t('subTabGeneral'), 
      icon: Globe,
      content: () => (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              {t('languagePreference')}
            </h2>
            <p className="text-sm text-slate-500 mt-1">{t('selectLanguage')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setLanguage('en')}
              className={`flex items-center justify-between p-4 rounded-xl border text-start transition-all cursor-pointer ${
                language === 'en'
                  ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <p className="font-semibold text-slate-900">{t('english')}</p>
                <p className="text-xs text-slate-500 mt-0.5">LTR Layout</p>
              </div>
              {language === 'en' && <CheckCircle className="w-5 h-5 text-indigo-600" />}
            </button>

            <button
              onClick={() => setLanguage('ar')}
              className={`flex items-center justify-between p-4 rounded-xl border text-start transition-all cursor-pointer ${
                language === 'ar'
                  ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <p className="font-semibold text-slate-900">{t('arabic')}</p>
                <p className="text-xs text-slate-500 mt-0.5">تنسيق اليمين إلى اليسار RTL</p>
              </div>
              {language === 'ar' && <CheckCircle className="w-5 h-5 text-indigo-600" />}
            </button>
          </div>
        </div>
      )
    },
    { 
      id: 'bank_accounts', 
      label: t('subTabBankAccounts'), 
      icon: CreditCard,
      content: () => <MerchantBankAccountsTab />
    },
    { 
      id: 'locations', 
      label: t('subTabLocations'), 
      icon: MapPin,
      content: () => (
        <div className="text-center py-20 text-slate-400 bg-white border border-dashed border-slate-300 rounded-lg">
          <p className="text-lg font-medium capitalize">Locations Settings</p>
          <p className="text-sm mt-1">{t('underDevelopment')}</p>
        </div>
      )
    },
    { 
      id: 'webhooks', 
      label: t('subTabWebhooks'), 
      icon: Webhook,
      content: () => <WebhooksTab />
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('settings')}</h1>
        <p className="text-sm text-slate-500 mt-1 mb-6">{t('settingsDesc')}</p>
        
        <div id="settings-tabs-wrapper">
          <AppTabs 
            tabs={subTabs}
            variant="underline"
            size="md"
            persistenceKey="merchant_settings_tabs"
            persistenceMode="local"
            lazy={true}
          />
        </div>
      </div>
    </div>
  );
}
