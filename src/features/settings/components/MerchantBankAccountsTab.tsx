import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../providers/AuthProvider';
import { useLanguage } from '../../../providers/LanguageProvider';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  PlusCircle, 
  CreditCard,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface MerchantBankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  swiftCode?: string;
  currency: string;
  isDefault: boolean;
  createdAt: string;
}

export default function MerchantBankAccountsTab() {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const userId = user?.id || user?.email || 'guest';

  // State
  const [bankAccounts, setBankAccounts] = useState<MerchantBankAccount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<MerchantBankAccount | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [iban, setIban] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [currency, setCurrency] = useState('SAR');
  const [isDefault, setIsDefault] = useState(false);

  // Load Bank Accounts from LocalStorage
  useEffect(() => {
    const storageKey = `waslship_merchant_bank_accounts_${userId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setBankAccounts(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing stored bank accounts', e);
      }
    } else {
      // Seed some elegant default data if empty
      const seedData: MerchantBankAccount[] = [
        {
          id: 'seed-1',
          bankName: isRTL ? 'مصرف الراجحي' : 'Al Rajhi Bank',
          accountName: user?.fullName || 'WaslShip Merchant',
          accountNumber: '204608110000234',
          iban: 'SA8280000000204608110000234',
          swiftCode: 'RAJHSARIXXX',
          currency: 'SAR',
          isDefault: true,
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(storageKey, JSON.stringify(seedData));
      setBankAccounts(seedData);
    }
  }, [userId, isRTL]);

  // Save to LocalStorage helper
  const saveToStorage = (updatedList: MerchantBankAccount[]) => {
    const storageKey = `waslship_merchant_bank_accounts_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedList));
    setBankAccounts(updatedList);
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleOpenAdd = () => {
    setSelectedAccount(null);
    setBankName('');
    setAccountName(user?.fullName || '');
    setAccountNumber('');
    setIban('');
    setSwiftCode('');
    setCurrency('SAR');
    setIsDefault(bankAccounts.length === 0);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc: MerchantBankAccount) => {
    setSelectedAccount(acc);
    setBankName(acc.bankName);
    setAccountName(acc.accountName);
    setAccountNumber(acc.accountNumber);
    setIban(acc.iban);
    setSwiftCode(acc.swiftCode || '');
    setCurrency(acc.currency);
    setIsDefault(acc.isDefault);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const confirmMsg = isRTL 
      ? 'هل أنت متأكد من رغبتك في حذف هذا الحساب البنكي؟' 
      : 'Are you sure you want to delete this bank account?';
    
    if (window.confirm(confirmMsg)) {
      const target = bankAccounts.find(a => a.id === id);
      const filtered = bankAccounts.filter(a => a.id !== id);
      
      // If we deleted the default account, make another one default
      if (target?.isDefault && filtered.length > 0) {
        filtered[0].isDefault = true;
      }
      
      saveToStorage(filtered);
      showSuccess(isRTL ? 'تم حذف الحساب البنكي بنجاح.' : 'Bank account deleted successfully.');
    }
  };

  const handleSetDefault = (id: string) => {
    const updated = bankAccounts.map(acc => ({
      ...acc,
      isDefault: acc.id === id
    }));
    saveToStorage(updated);
    showSuccess(isRTL ? 'تم تعيين الحساب كافتراضي لاستقبال المستحقات.' : 'Set as default receiving account successfully.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!bankName.trim() || !accountName.trim() || !accountNumber.trim() || !iban.trim()) {
      setErrorMessage(isRTL ? 'الرجاء ملء جميع الحقول الإلزامية (*)' : 'Please fill all required fields (*)');
      return;
    }

    const cleanedIban = iban.trim().replace(/\s+/g, '').toUpperCase();
    if (!cleanedIban.startsWith('SA') || cleanedIban.length < 15) {
      setErrorMessage(isRTL ? 'صيغة الآيبان غير صحيحة. يجب أن يبدأ بـ SA' : 'Invalid IBAN format. Must start with SA');
      return;
    }

    let updatedList: MerchantBankAccount[] = [];

    if (selectedAccount) {
      // Edit mode
      updatedList = bankAccounts.map(acc => {
        if (acc.id === selectedAccount.id) {
          return {
            ...acc,
            bankName: bankName.trim(),
            accountName: accountName.trim(),
            accountNumber: accountNumber.trim(),
            iban: cleanedIban,
            swiftCode: swiftCode.trim() || undefined,
            currency,
            isDefault: isDefault || acc.isDefault // If it was default, keep it default
          };
        }
        // If this one is set as default, unset others
        return isDefault ? { ...acc, isDefault: false } : acc;
      });

      // If we turned off default but it was the only one, keep it default
      const hasDefault = updatedList.some(a => a.isDefault);
      if (!hasDefault && updatedList.length > 0) {
        updatedList[0].isDefault = true;
      }

      saveToStorage(updatedList);
      showSuccess(isRTL ? 'تم تحديث الحساب البنكي بنجاح.' : 'Bank account details updated successfully.');
    } else {
      // Add mode
      const newAcc: MerchantBankAccount = {
        id: `acc-${Date.now()}`,
        bankName: bankName.trim(),
        accountName: accountName.trim(),
        accountNumber: accountNumber.trim(),
        iban: cleanedIban,
        swiftCode: swiftCode.trim() || undefined,
        currency,
        isDefault: isDefault || bankAccounts.length === 0,
        createdAt: new Date().toISOString()
      };

      if (newAcc.isDefault) {
        updatedList = bankAccounts.map(acc => ({ ...acc, isDefault: false }));
        updatedList.push(newAcc);
      } else {
        updatedList = [...bankAccounts, newAcc];
      }

      saveToStorage(updatedList);
      showSuccess(isRTL ? 'تم إضافة الحساب البنكي بنجاح.' : 'Bank account added successfully.');
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Overview Block */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-2xl">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            {isRTL ? 'حساباتك البنكية لتسوية المستحقات' : 'Your Bank Accounts for Settlements'}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {isRTL 
              ? 'أضف وحافظ على حساباتك البنكية الشخصية أو التجارية لاستقبال مبالغ الدفع عند الاستلام (COD) والتحويلات المالية المستردة من WaslShip تلقائياً.' 
              : 'Configure your active bank accounts to receive automated Cash-on-Delivery (COD) payouts, refunds, and general wallet settlement transfers.'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95 flex-shrink-0 self-start md:self-center"
          id="btn-add-merchant-account"
        >
          <Plus className="w-4 h-4" />
          {isRTL ? 'إضافة حساب بنكي جديد' : 'Add New Bank Account'}
        </button>
      </div>

      {/* Success/Error Alerts */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Accounts List Grid */}
      {bankAccounts.length === 0 ? (
        <div className="p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-lg font-medium text-slate-700">
            {isRTL ? 'لم تقم بإضافة أي حساب بنكي بعد' : 'No bank accounts saved yet'}
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {isRTL 
              ? 'يجب عليك إضافة حساب بنكي نشط حتى نتمكن من تحويل أرباح ومستحقات الشحن الخاصة بمتجرك.' 
              : 'Please add an active bank account so we can automatically route your Cash on Delivery (COD) settlements.'}
          </p>
          <button 
            onClick={handleOpenAdd}
            className="mt-5 inline-flex items-center gap-1 px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            {isRTL ? 'أضف أول حساب بنكي الآن' : 'Create First Account Now'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bankAccounts.map((acc) => (
            <div 
              key={acc.id} 
              className={`bg-white border rounded-xl p-5 shadow-sm transition-all flex flex-col justify-between ${
                acc.isDefault ? 'border-indigo-500 ring-1 ring-indigo-500/15' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${acc.isDefault ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500'}`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{acc.bankName}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{acc.currency}</p>
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    {acc.isDefault ? (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[9px] font-bold">
                        {isRTL ? 'افتراضي للصرف' : 'Default Settlement'}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(acc.id)}
                        className="px-2 py-0.5 rounded-full border border-slate-200 text-slate-500 text-[9px] font-bold hover:bg-slate-50 cursor-pointer"
                      >
                        {isRTL ? 'تعيين كافتراضي' : 'Set Default'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 border-t border-b border-slate-50 py-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isRTL ? 'اسم صاحب الحساب' : 'Account Name'}:</span>
                    <span className="font-semibold text-slate-800 text-right">{acc.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isRTL ? 'رقم الحساب' : 'Account Number'}:</span>
                    <span className="font-mono text-slate-800 font-semibold">{acc.accountNumber}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">{isRTL ? 'الآيبان (IBAN)' : 'IBAN'}:</span>
                    <span className="font-mono text-slate-800 font-semibold break-all text-right max-w-[180px]">{acc.iban}</span>
                  </div>
                  {acc.swiftCode && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isRTL ? 'رمز السويفت' : 'Swift Code'}:</span>
                      <span className="font-mono text-slate-800 font-semibold">{acc.swiftCode}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 mt-auto">
                <span className="text-[10px] text-slate-400">
                  {isRTL ? 'نشط للتسويات' : 'Active for payouts'}
                </span>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEdit(acc)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                    title={isRTL ? 'تعديل' : 'Edit'}
                    id={`btn-edit-merchant-acc-${acc.id}`}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(acc.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                    title={isRTL ? 'حذف' : 'Delete'}
                    id={`btn-delete-merchant-acc-${acc.id}`}
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-white border border-slate-100 shadow-xl rounded-2xl max-w-lg w-full overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">
                {selectedAccount 
                  ? (isRTL ? 'تعديل بيانات الحساب البنكي' : 'Edit Bank Account') 
                  : (isRTL ? 'إضافة حساب بنكي جديد' : 'Add New Bank Account')}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4" id="form-merchant-bank-account">
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
                    {isRTL ? 'اسم البنك *' : 'Bank Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder={isRTL ? 'مثال: مصرف الراجحي' : 'e.g. Al Rajhi Bank'}
                    className="block w-full px-3.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    id="input-merch-bank"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRTL ? 'اسم صاحب الحساب بالكامل *' : 'Account Owner Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder={isRTL ? 'مثال: مؤسسة شحن وسائط' : 'e.g. WaslShip Company'}
                    className="block w-full px-3.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    id="input-merch-name"
                  />
                </div>
              </div>

              {/* Grid 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRTL ? 'رقم الحساب البنكي *' : 'Account Number *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. 1234567890123"
                    className="block w-full px-3.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    id="input-merch-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRTL ? 'رقم الآيبان (IBAN) *' : 'IBAN (Required) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    placeholder="SA038000000..."
                    className="block w-full px-3.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    id="input-merch-iban"
                  />
                </div>
              </div>

              {/* Grid 3 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRTL ? 'رمز السويفت كود (اختياري)' : 'Swift Code (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={swiftCode}
                    onChange={(e) => setSwiftCode(e.target.value)}
                    placeholder="e.g. RAJHSARIXXX"
                    className="block w-full px-3.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    id="input-merch-swift"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRTL ? 'العملة' : 'Currency'}
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="block w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    id="select-merch-curr"
                  >
                    <option value="SAR">SAR (Saudi Riyal)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="AED">AED (UAE Dirham)</option>
                  </select>
                </div>
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefaultMerchant"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  disabled={selectedAccount?.isDefault} // Cannot uncheck if it's currently the default one
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                />
                <label 
                  htmlFor="isDefaultMerchant" 
                  className={`text-xs text-slate-600 font-semibold cursor-pointer ${
                    selectedAccount?.isDefault ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isRTL ? 'تعيين كحساب رئيسي مفضل لاستلام التسويات ومبالغ الدفع عند الاستلام' : 'Set as default receiving account for COD payouts'}
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-500 transition-colors cursor-pointer"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                  id="btn-merch-acc-save"
                >
                  <Check className="w-3.5 h-3.5" />
                  {isRTL ? 'حفظ الحساب البنكي' : 'Save Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
