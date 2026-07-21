import React, { useState } from 'react';
import WebhooksTab from '../components/WebhooksTab';
import { useLanguage } from '../../../providers/LanguageProvider';
import { Globe, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const [activeSettingsSubTab, setActiveSettingsSubTab] = useState('general');
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">{t('settings')}</h1>
        <p className="text-sm text-slate-500 mt-1 mb-6">{t('settingsDesc')}</p>
        
        <div className="flex space-x-8 rtl:space-x-reverse">
          {[
            { id: 'general', label: t('subTabGeneral') },
            { id: 'locations', label: t('subTabLocations') },
            { id: 'webhooks', label: t('subTabWebhooks') }
          ].map((subTab) => (
            <button 
              key={subTab.id}
              onClick={() => setActiveSettingsSubTab(subTab.id)}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                activeSettingsSubTab === subTab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {subTab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="py-6">
        {activeSettingsSubTab === 'webhooks' ? (
          <WebhooksTab />
        ) : activeSettingsSubTab === 'general' ? (
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
        ) : (
          <div className="text-center py-20 text-slate-400 bg-white border border-dashed border-slate-300 rounded-lg">
            <p className="text-lg font-medium capitalize">{activeSettingsSubTab} Settings</p>
            <p className="text-sm mt-1">{t('underDevelopment')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
