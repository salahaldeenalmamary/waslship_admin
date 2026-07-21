import React, { useState } from 'react';
import { useBankAccounts, useCreateBankTransfer } from '../../../hooks/useWallet';
import { useLanguage } from '../../../providers/LanguageProvider';
import { 
  Building2, 
  Upload, 
  Check, 
  X, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  CreditCard,
  CheckCircle2,
  FileImage,
  RefreshCw
} from 'lucide-react';

export default function DepositFundsTab() {
  const { t, isRTL } = useLanguage();
  
  // States
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [payerName, setPayerName] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Fetch only active bank accounts
  const { data: accountsData, isLoading: accountsLoading, error: accountsError } = useBankAccounts(1, 50, false);
  const activeAccounts = accountsData?.items || [];

  const createMutation = useCreateBankTransfer();

  // Selected bank account details
  const selectedAccount = activeAccounts.find(acc => acc.id === selectedAccountId);

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setReceiptFile(file);
        setErrorMsg('');
      } else {
        setErrorMsg(isRTL ? 'الرجاء اختيار صورة صالحة فقط (JPEG/PNG).' : 'Please select a valid image file only (JPEG/PNG).');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setReceiptFile(file);
        setErrorMsg('');
      } else {
        setErrorMsg(isRTL ? 'الرجاء اختيار صورة صالحة فقط (JPEG/PNG).' : 'Please select a valid image file only (JPEG/PNG).');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedAccountId) {
      setErrorMsg(isRTL ? 'الرجاء اختيار الحساب البنكي الذي قمت بالتحويل إليه.' : 'Please select the bank account you transferred to.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg(isRTL ? 'الرجاء إدخال مبلغ صحيح أكبر من الصفر.' : 'Please enter a valid amount greater than zero.');
      return;
    }

    if (!receiptFile) {
      setErrorMsg(isRTL ? 'يرجى تحميل صورة من إيصال التحويل البنكي لتأكيد العملية.' : 'Please upload a bank transfer receipt image to verify.');
      return;
    }

    const formData = new FormData();
    formData.append('Amount', numericAmount.toString());
    formData.append('BankAccountId', selectedAccountId);
    if (payerName) formData.append('PayerName', payerName);
    if (reference) formData.append('TransferReference', reference);
    formData.append('ReceiptImage', receiptFile);

    try {
      const result = await createMutation.mutateAsync(formData);
      setSuccessData(result);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.message || (isRTL ? 'فشل إرسال طلب شحن المحفظة.' : 'Failed to submit bank transfer request.'));
    }
  };

  const handleReset = () => {
    setAmount('');
    setPayerName('');
    setReference('');
    setReceiptFile(null);
    setSelectedAccountId('');
    setSuccessData(null);
    setErrorMsg('');
  };

  if (successData) {
    return (
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          {t('depositRequestSubmitted')}
        </h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
          {t('depositRequestDesc')}
        </p>

        <div className="mt-8 border-t border-b border-slate-100 py-5 space-y-3.5 text-sm text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-400">{t('transactionNumber')}</span>
            <span className="font-mono font-semibold text-slate-800">{successData.transactionNumber || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('amountRequested')}</span>
            <span className="font-bold text-slate-900">{successData.amount} SAR</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('payerName')}</span>
            <span className="font-medium text-slate-800">{successData.payerName || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('transferReference')}</span>
            <span className="text-slate-800 font-medium">{successData.transferReference || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('statusLabel')}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
              {successData.status}
            </span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="mt-8 w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
          id="btn-deposit-done"
        >
          {t('submitAnotherRequest')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{t('topUpViaBank')}</h2>
        <p className="text-sm text-slate-500 mt-0.5">{t('topUpViaBankDesc')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Accounts List Instructions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200/50 pb-2.5">
              <Building2 className="w-4 h-4 text-indigo-500" />
              {t('ourOfficialBankAccounts')}
            </h3>

            {accountsLoading ? (
              <div className="text-center py-6 text-slate-400">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-indigo-500" />
                <p className="text-xs mt-2">{t('loading')}</p>
              </div>
            ) : accountsError ? (
              <p className="text-xs text-rose-500">{isRTL ? 'فشل تحميل الحسابات البنكية.' : 'Failed to load bank accounts.'}</p>
            ) : activeAccounts.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4">{isRTL ? 'لا توجد حسابات بنكية معرفة حالياً.' : 'No active bank accounts found. Contact support.'}</p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {activeAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setSelectedAccountId(acc.id)}
                    className={`w-full text-left rtl:text-right p-3.5 rounded-lg border text-xs transition-all cursor-pointer ${
                      selectedAccountId === acc.id 
                        ? 'bg-indigo-50/50 border-indigo-500 shadow-sm ring-1 ring-indigo-500/10' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-slate-800">{acc.bankName}</span>
                      {acc.isDefault && (
                        <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[9px] font-bold">
                          {t('default')}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-slate-500">
                      <div><strong className="text-slate-600">{t('accountNameLabel')}:</strong> {acc.accountName}</div>
                      <div className="font-mono"><strong className="text-slate-600">{t('accountNumberLabel')}:</strong> {acc.accountNumber}</div>
                      <div className="font-mono text-[10px] break-all"><strong className="text-slate-600">{t('ibanLabel')}:</strong> {acc.iban}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Deposit Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5" id="form-deposit">
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-100 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Select Bank Account */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('targetBankAccountRequired')}
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                required
                className="block w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                id="select-target-account"
              >
                <option value="">{t('targetBankAccountSelectPlaceholder')}</option>
                {activeAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.bankName} - {acc.accountName}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('transferredAmountSAR')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="block w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  id="input-deposit-amount"
                />
              </div>

              {/* Payer Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('payerNameOwner')}
                </label>
                <input
                  type="text"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder={isRTL ? 'مثال: محمد علي' : 'e.g. John Doe'}
                  className="block w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  id="input-deposit-payer"
                />
              </div>
            </div>

            {/* Transfer Reference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('bankTransferRefCode')}
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder={t('bankTransferRefCodePlaceholder')}
                className="block w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                id="input-deposit-ref"
              />
            </div>

            {/* Receipt Image Upload (Drag-and-Drop) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('bankTransferReceipt')}
              </label>
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  dragActive ? 'border-indigo-500 bg-indigo-50/20' : 'border-slate-300 hover:border-slate-400 bg-slate-50/30'
                }`}
                onClick={() => document.getElementById('receipt-image-input')?.click()}
              >
                <input
                  id="receipt-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {receiptFile ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <FileImage className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800">{receiptFile.name}</p>
                    <p className="text-[10px] text-slate-400">{(receiptFile.size / 1024).toFixed(1)} KB</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReceiptFile(null);
                      }}
                      className="text-[10px] font-bold text-rose-600 hover:underline flex items-center justify-center gap-1 mx-auto mt-1"
                    >
                      <X className="w-3 h-3" />
                      {t('removeFile')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-1">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      {t('dragAndDropReceipt')}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {t('onlyImageFilesAccepted')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-sm"
              id="btn-deposit-submit"
            >
              {createMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {t('submittingRequest')}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {t('submitBankReceipt')}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
