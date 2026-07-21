import React from 'react';
import { useLanguage } from '../../providers/LanguageProvider';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage, isRTL } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100/80 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg transition-all active:scale-95 shadow-sm cursor-pointer"
      title={language === 'en' ? 'تغيير اللغة إلى العربية' : 'Change language to English'}
    >
      <Globe className="w-3.5 h-3.5 text-slate-500 hover:text-indigo-500" />
      <span>{language === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}
