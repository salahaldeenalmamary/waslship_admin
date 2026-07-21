import React, { useState } from 'react';
import { 
  useBankAccounts, 
  useCreateBankAccount, 
  useUpdateBankAccount, 
  useSetDefaultBankAccount, 
  useToggleBankAccountStatus, 
  useDeleteBankAccount 
} from '../../../hooks/useWallet';
import { useLanguage } from '../../../providers/LanguageProvider';
import { AppDialog } from '../../../components/common/AppOverlay';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Building2, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle, 
  ToggleLeft, 
  ToggleRight,
  Globe
} from 'lucide-react';
import { BankAccount } from '../../../services/walletService';

export default function AdminAccountsTab() {
  const { isRTL, t } = useLanguage();
  
  // States
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Form Fields
  const [bankName, setBankName] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [iban, setIban] = useState<string>('');
  const [swiftCode, setSwiftCode] = useState<string>('');
  const [currency, setCurrency] = useState<string>('SAR');
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');

  // Fetch accounts (include inactive ones too for admin)
  const { data, isLoading, error, refetch } = useBankAccounts(page, 20, true, search);
  const accounts = data?.items || [];

  const createMutation = useCreateBankAccount();
  const updateMutation = useUpdateBankAccount();
  const deleteMutation = useDeleteBankAccount();
  const setDefaultMutation = useSetDefaultBankAccount();
  const toggleStatusMutation = useToggleBankAccountStatus();

  const handleOpenAdd = () => {
    setSelectedAccount(null);
    setBankName('');
    setAccountName('');
    setAccountNumber('');
    setIban('');
    setSwiftCode('');
    setCurrency('SAR');
    setIsDefault(false);
    setDescription('');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc: BankAccount) => {
    setSelectedAccount(acc);
    setBankName(acc.bankName);
    setAccountName(acc.accountName);
    setAccountNumber(acc.accountNumber);
    setIban(acc.iban);
    setSwiftCode(acc.swiftCode || '');
    setCurrency(acc.currency);
    setIsDefault(acc.isDefault);
    setDescription(acc.description || '');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!bankName || !accountName || !accountNumber || !iban) {
      setErrorMessage(t('pleaseFillRequiredFields'));
      return;
    }

    const payload = {
      bankName,
      accountName,
      accountNumber,
      iban,
      swiftCode: swiftCode || undefined,
      currency,
      isDefault,
      description: description || undefined
    };

    try {
      if (selectedAccount) {
        await updateMutation.mutateAsync({ id: selectedAccount.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || t('failedToSaveBankAccount'));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirmDeleteBankAccount'))) {
      try {
        await deleteMutation.mutateAsync(id);
        refetch();
      } catch (err: any) {
        alert(err?.response?.data?.message || err?.message || t('failedToDeleteBankAccount'));
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultMutation.mutateAsync(id);
      refetch();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || t('failedToSetDefault'));
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleStatusMutation.mutateAsync({ id, isActive: !currentStatus });
      refetch();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || t('failedToToggleStatus'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">{t('listCorporateAccounts')}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{t('configureOfficialAccounts')}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95"
            id="btn-add-bank-account"
          >
            <Plus className="w-4 h-4" />
            {t('addBankAccount')}
          </button>
        </div>
      </div>

      {/* Accounts List */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
          <p className="text-sm mt-3">{t('loading')}</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-100 rounded-lg p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-rose-800">{t('failedToLoadBankAccounts')}</h3>
            <p className="text-xs text-rose-700 mt-1">Check database connection or migrations.</p>
          </div>
        </div>
      ) : accounts.length === 0 ? (
        <div className="p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-lg font-medium text-slate-700">{t('noCorporateAccounts')}</p>
          <button 
            onClick={handleOpenAdd}
            className="mt-4 text-xs font-semibold text-indigo-600 hover:underline"
          >
            {t('createFirstAccountNow')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((acc) => (
            <div 
              key={acc.id} 
              className={`bg-white border rounded-xl p-5 shadow-sm transition-all flex flex-col justify-between ${
                acc.isDefault ? 'border-indigo-500 ring-1 ring-indigo-500/15' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${acc.isDefault ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500'}`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{acc.bankName}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{acc.currency}</p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {acc.isDefault && (
                      <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[9px] font-bold">
                        {t('default')}
                      </span>
                    )}
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      acc.isActive 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {acc.isActive ? t('active') : t('inactive')}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 border-t border-b border-slate-50 py-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('accountNameLabel')}:</span>
                    <span className="font-medium text-slate-800 text-right">{acc.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('accountNumberLabel')}:</span>
                    <span className="font-mono text-slate-800 font-semibold">{acc.accountNumber}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">{t('ibanLabel')}:</span>
                    <span className="font-mono text-slate-800 font-semibold break-all text-right max-w-[180px]">{acc.iban}</span>
                  </div>
                  {acc.swiftCode && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Swift:</span>
                      <span className="font-mono text-slate-800 font-semibold">{acc.swiftCode}</span>
                    </div>
                  )}
                  {acc.description && (
                    <div className="text-[10px] text-slate-400 italic pt-1 border-t border-dashed border-slate-100 mt-1">
                      {acc.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3.5 mt-auto">
                {/* Toggle states */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(acc.id, acc.isActive)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    title={acc.isActive ? t('deactivate') : t('activate')}
                    id={`btn-toggle-acc-${acc.id}`}
                  >
                    {acc.isActive ? (
                      <ToggleRight className="w-6 h-6 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-400" />
                    )}
                  </button>

                  {!acc.isDefault && acc.isActive && (
                    <button
                      onClick={() => handleSetDefault(acc.id)}
                      className="px-2 py-0.5 border border-slate-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                      id={`btn-set-default-${acc.id}`}
                    >
                      {t('setDefault')}
                    </button>
                  )}
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEdit(acc)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                    id={`btn-edit-acc-${acc.id}`}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(acc.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                    id={`btn-delete-acc-${acc.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Dialog Modal */}
      <AppDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAccount ? t('editCorporateAccount') : t('addCorporateAccount')}
        size="md"
      >
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="form-bank-account">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-100 text-xs text-rose-700 p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Grid 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('bankNameLabel')}
              </label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. Al Rajhi Bank"
                className="block w-full px-3.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                id="input-acc-bank"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('accountOwnerNameLabel')}
              </label>
              <input
                type="text"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="e.g. WaslShip Company"
                className="block w-full px-3.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                id="input-acc-name"
              />
            </div>
          </div>

          {/* Grid 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('accountNumberLabelRequired')}
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. 1234567890123"
                className="block w-full px-3.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                id="input-acc-num"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('ibanLabelRequired')}
              </label>
              <input
                type="text"
                required
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="e.g. SA038000000..."
                className="block w-full px-3.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                id="input-acc-iban"
              />
            </div>
          </div>

          {/* Grid 3 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('swiftCodeLabel')}</label>
              <input
                type="text"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
                placeholder="Optional"
                className="block w-full px-3.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                id="input-acc-swift"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('currencyLabel')}
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="block w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                id="select-acc-curr"
              >
                <option value="SAR">SAR (Saudi Riyal)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="AED">AED (UAE Dirham)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('descriptionLabel')}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              className="block w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              id="input-acc-desc"
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isDefault" className="text-xs text-slate-600 font-semibold cursor-pointer">
              {t('setDefaultReceivingAccount')}
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-1/2 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-500 transition-colors cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-1/2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
              id="btn-acc-save"
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              {t('saveAccount')}
            </button>
          </div>
        </form>
      </AppDialog>
    </div>
  );
}
