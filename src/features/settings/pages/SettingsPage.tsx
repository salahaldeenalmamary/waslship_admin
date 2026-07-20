import React, { useState } from 'react';
import WebhooksTab from '../components/WebhooksTab';

export default function SettingsPage() {
  const [activeSettingsSubTab, setActiveSettingsSubTab] = useState('general');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1 mb-6">Manage your account preferences and integrations.</p>
        
        <div className="flex space-x-8">
          {['general', 'locations', 'webhooks'].map((subTab) => (
            <button 
              key={subTab}
              onClick={() => setActiveSettingsSubTab(subTab)}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeSettingsSubTab === subTab 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {subTab}
            </button>
          ))}
        </div>
      </div>

      <div className="py-6">
        {activeSettingsSubTab === 'webhooks' ? (
          <WebhooksTab />
        ) : (
          <div className="text-center py-20 text-slate-400 bg-white border border-dashed border-slate-300 rounded-lg">
            <p className="text-lg font-medium capitalize">{activeSettingsSubTab} Settings</p>
            <p className="text-sm mt-1">This module is under development.</p>
          </div>
        )}
      </div>
    </div>
  );
}
