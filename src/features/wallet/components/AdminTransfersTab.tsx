import React, { useState } from 'react';
import { 
  usePendingTransfers, 
  useProcessingTransfers, 
  useProcessTransfer, 
  useConfirmTransfer, 
  useRejectTransfer 
} from '../../../hooks/useWallet';
import { useLanguage } from '../../../providers/LanguageProvider';
import Tabs, { TabItem } from '../../../components/ui/Tabs';
import { 
  Check, 
  X, 
  Clock, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Ban
} from 'lucide-react';
import { BankTransfer } from '../../../services/walletService';

export default function AdminTransfersTab() {
  const { t, isRTL } = useLanguage();
  
  // Status tab filter: 'pending' or 'processing'
  const [subTab, setSubTab] = useState<'pending' | 'processing'>('pending');
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  
  // Selected Transfer for detail view/action modal
  const [selectedTransfer, setSelectedTransfer] = useState<BankTransfer | null>(null);
  const [actionNotes, setActionNotes] = useState<string>('');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Fetch transfers with page, search
  const { data: pendingData, isLoading: pendingLoading, error: pendingError, refetch: refetchPending } = 
    usePendingTransfers(page, 10, search);

  const { data: processingData, isLoading: processingLoading, error: processingError, refetch: refetchProcessing } = 
    useProcessingTransfers(page, 10, search);

  const processMutation = useProcessTransfer();
  const confirmMutation = useConfirmTransfer();
  const rejectMutation = useRejectTransfer();

  const handleRefresh = () => {
    refetchPending();
    refetchProcessing();
    setSelectedTransfer(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleMarkProcessing = async (transferId: string) => {
    setErrorMessage('');
    try {
      const updated = await processMutation.mutateAsync({ id: transferId, notes: 'Reviewed and processing' });
      setSelectedTransfer(null);
      handleRefresh();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to update transfer status.');
    }
  };

  const handleConfirmApprove = async () => {
    if (!selectedTransfer) return;
    setErrorMessage('');
    setIsConfirming(true);
    try {
      await confirmMutation.mutateAsync({
        id: selectedTransfer.id,
        payload: { notes: actionNotes }
      });
      setSelectedTransfer(null);
      setActionNotes('');
      handleRefresh();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to approve bank transfer.');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleRejectDecline = async () => {
    if (!selectedTransfer) return;
    if (!rejectReason) {
      setErrorMessage(isRTL ? 'الرجاء كتابة سبب الرفض لتوضيح الأمر للتاجر.' : 'Please enter a rejection reason.');
      return;
    }
    setErrorMessage('');
    setIsRejecting(true);
    try {
      await rejectMutation.mutateAsync({
        id: selectedTransfer.id,
        payload: { reason: rejectReason, notes: actionNotes }
      });
      setSelectedTransfer(null);
      setRejectReason('');
      setActionNotes('');
      handleRefresh();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to reject bank transfer.');
    } finally {
      setIsRejecting(false);
    }
  };

  // Select active data set
  const currentLoading = subTab === 'pending' ? pendingLoading : processingLoading;
  const currentError = subTab === 'pending' ? pendingError : processingError;
  const currentTransfers = subTab === 'pending' ? pendingData?.items || [] : processingData?.items || [];
  const currentPaged = subTab === 'pending' ? pendingData : processingData;

  const subTabs: TabItem[] = [
    { 
      id: 'pending', 
      label: t('pendingVerification'), 
      badge: pendingData && pendingData.totalCount > 0 ? pendingData.totalCount : undefined 
    },
    { 
      id: 'processing', 
      label: t('underReview'), 
      badge: processingData && processingData.totalCount > 0 ? processingData.totalCount : undefined 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Toggle subtab */}
        <div id="admin-transfer-tabs" className="w-full sm:w-auto">
          <Tabs
            tabs={subTabs}
            activeTab={subTab}
            onChange={(id) => { setSubTab(id as any); setPage(1); }}
            variant="pills"
            size="sm"
          />
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder={t('searchByNameOrRef')}
              className="block w-full max-w-xs ps-9 pe-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              id="admin-search-transfers"
            />
          </div>
          <button
            onClick={handleRefresh}
            className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-500 transition-all cursor-pointer"
            id="btn-admin-refresh-transfers"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main List */}
      {currentLoading ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
          <p className="text-sm mt-3">{t('loading')}</p>
        </div>
      ) : currentError ? (
        <div className="bg-rose-50 border border-rose-100 rounded-lg p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-rose-800">{t('failedToLoadTransfers')}</h3>
            <p className="text-xs text-rose-700 mt-1">{isRTL ? 'الرجاء التحقق من الاتصال بالخادم والمحاولة مرة أخرى.' : 'Failed to connect to the Wallet microservice endpoints.'}</p>
            <button onClick={handleRefresh} className="mt-3 text-xs font-semibold text-rose-800 hover:underline">
              {t('retry')}
            </button>
          </div>
        </div>
      ) : currentTransfers.length === 0 ? (
        <div className="p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-lg font-medium text-slate-700">
            {t('noTransferRequestsFound')}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {t('allMerchantDepositsProcessed')}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-slate-500" id="table-admin-transfers">
              <thead className="text-xs uppercase bg-slate-50/50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">{t('refNumber')}</th>
                  <th className="px-6 py-4 font-semibold">{t('payer')}</th>
                  <th className="px-6 py-4 font-semibold">{t('amount')}</th>
                  <th className="px-6 py-4 font-semibold">{t('bankRef')}</th>
                  <th className="px-6 py-4 font-semibold">{t('targetAccount')}</th>
                  <th className="px-6 py-4 font-semibold">{t('date')}</th>
                  <th className="px-6 py-4 font-semibold text-center">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentTransfers.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 text-xs">
                      {tx.transactionNumber}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-800">
                      {tx.payerName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-[10px] font-medium text-slate-500">SAR</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">
                      {tx.transferReference || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {tx.bankAccount ? (
                        <div>
                          <div className="font-semibold text-slate-800">{tx.bankAccount.bankName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{tx.bankAccount.accountNumber}</div>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => { setSelectedTransfer(tx); setErrorMessage(''); }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded hover:bg-indigo-100 transition-colors cursor-pointer"
                          title={isRTL ? 'معاينة وإجراء الموافقة' : 'Preview and action'}
                          id={`btn-view-tx-${tx.id}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {t('lockOrAudit')}
                        </button>

                        {subTab === 'pending' && (
                          <button
                            onClick={() => handleMarkProcessing(tx.id)}
                            disabled={processMutation.isPending}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                            id={`btn-proc-tx-${tx.id}`}
                          >
                            {processMutation.isPending ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                            {t('lockOrAudit')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {currentPaged && currentPaged.totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {t('showingPageOf', { page: currentPaged.pageNumber, totalPages: currentPaged.totalPages })}
                </span>
                <div className="inline-flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-500 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(currentPaged.totalPages, p + 1))}
                    disabled={page === currentPaged.totalPages}
                    className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-500 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedTransfer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-3xl w-full overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-5 h-5 text-indigo-600" />
                {t('auditAndVerifySlip')}
              </h3>
              <button 
                onClick={() => setSelectedTransfer(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
              {/* Left Side: Receipt Image Preview */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('uploadedReceiptImage')}</h4>
                {selectedTransfer.receiptImageUrl ? (
                  <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center h-72">
                    <img 
                      src={selectedTransfer.receiptImageUrl} 
                      alt="Transfer Receipt"
                      className="max-h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <a
                      href={selectedTransfer.receiptImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-800 text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {t('viewFullImage')}
                    </a>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 bg-slate-50">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold">{t('noReceiptImageUploaded')}</p>
                  </div>
                )}
              </div>

              {/* Right Side: Form Details and action */}
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">{isRTL ? 'بيانات الحركة والتحويل' : 'Deposit request details'}</h4>
                  
                  {errorMessage && (
                    <div className="mb-4 bg-rose-50 border border-rose-100 rounded-lg p-3 text-xs text-rose-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 space-y-2.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isRTL ? 'المبلغ المطلوب' : 'Amount Requested'}</span>
                      <strong className="text-slate-900 text-sm font-bold">{selectedTransfer.amount.toLocaleString()} SAR</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t('payerName')}</span>
                      <span className="font-semibold text-slate-800">{selectedTransfer.payerName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isRTL ? 'الرقم المرجعي للبنك' : 'Bank Reference'}</span>
                      <span className="font-mono text-slate-800 font-semibold">{selectedTransfer.transferReference || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isRTL ? 'الحساب المستقبل' : 'Target Account'}</span>
                      <span className="text-slate-800 font-medium">
                        {selectedTransfer.bankAccount?.bankName} ({selectedTransfer.bankAccount?.accountNumber})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isRTL ? 'الحالة الحالية' : 'Current Status'}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        {selectedTransfer.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form fields for confirming / rejecting */}
                <div className="space-y-3.5 border-t border-slate-100 pt-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {t('adminInternalNotes')}
                    </label>
                    <textarea
                      rows={2}
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      placeholder={t('adminInternalNotesPlaceholder')}
                      className="block w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {t('rejectionReasonLabel')}
                    </label>
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder={t('rejectionReasonPlaceholder')}
                      className="block w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Actions buttons inside modal */}
                  <div className="grid grid-cols-2 gap-3.5 pt-2">
                    <button
                      type="button"
                      onClick={handleRejectDecline}
                      disabled={isRejecting || isConfirming}
                      className="w-full bg-rose-50 text-rose-700 border border-rose-200 py-2 rounded-lg text-xs font-bold hover:bg-rose-100 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      id="btn-admin-reject"
                    >
                      {isRejecting ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Ban className="w-3.5 h-3.5" />
                      )}
                      {t('rejectAndDecline')}
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmApprove}
                      disabled={isConfirming || isRejecting}
                      className="w-full bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      id="btn-admin-approve"
                    >
                      {isConfirming ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      {t('confirmAndCreditWallet')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
