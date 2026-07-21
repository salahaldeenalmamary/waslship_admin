import React, { useState } from 'react';
import { useWalletBalance, useWalletTransactions } from '../../../hooks/useWallet';
import { useLanguage } from '../../../providers/LanguageProvider';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  RefreshCw, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function MerchantWalletTab() {
  const { t, isRTL } = useLanguage();
  const [page, setPage] = useState(1);
  const [type, setType] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const { data: balance, isLoading: balanceLoading, error: balanceError, refetch: refetchBalance } = useWalletBalance();
  const { data: transactionsData, isLoading: txLoading, error: txError, refetch: refetchTx } = useWalletTransactions(page, 10, type, status);

  const handleRefresh = () => {
    refetchBalance();
    refetchTx();
  };

  const getStatusBadge = (statusStr: string) => {
    switch (statusStr?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('completed')}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            <Clock className="w-3.5 h-3.5" />
            {t('pending')}
          </span>
        );
      case 'failed':
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
            <XCircle className="w-3.5 h-3.5" />
            {t('failed')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {statusStr}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{t('walletDetailsAndBalances')}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{t('walletTrackDesc')}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-md transition-all cursor-pointer active:scale-95"
          id="btn-wallet-refresh"
        >
          <RefreshCw className="w-4 h-4" />
          {t('refreshList')}
        </button>
      </div>

      {/* Balance Cards */}
      {balanceLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-xl p-6 animate-pulse">
              <div className="h-4 w-24 bg-slate-100 rounded"></div>
              <div className="h-8 w-36 bg-slate-100 rounded mt-4"></div>
              <div className="h-3 w-48 bg-slate-100 rounded mt-2"></div>
            </div>
          ))}
        </div>
      ) : balanceError ? (
        <div className="bg-rose-50 border border-rose-100 rounded-lg p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-rose-800">{t('failedToLoadWallet')}</h3>
            <p className="text-xs text-rose-700 mt-1">{t('failedToLoadWalletDesc')}</p>
            <button 
              onClick={() => refetchBalance()}
              className="mt-3 text-xs font-semibold text-rose-800 hover:underline flex items-center gap-1"
            >
              {t('retry')}
            </button>
          </div>
        </div>
      ) : balance ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Available Balance */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 bg-indigo-50/40 rounded-full"></div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">{t('availableBalance')}</span>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-slate-900">
                {balance.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-sm font-semibold text-slate-500">{balance.currency}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">{t('availableBalanceDesc')}</p>
          </div>

          {/* Card 2: Current Total Balance */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 bg-emerald-50/40 rounded-full"></div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">{t('currentBalance')}</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-slate-900">
                {balance.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-sm font-semibold text-slate-500">{balance.currency}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">{t('totalActualFunds')}</p>
          </div>

          {/* Card 3: Reserved Balance */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 bg-slate-50/80 rounded-full"></div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">{t('reservedAmount')}</span>
              <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-slate-900">
                {balance.reservedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-sm font-semibold text-slate-500">{balance.currency}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">{t('reservedAmountDesc')}</p>
          </div>
        </div>
      ) : null}

      {/* Transaction Filter and Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-semibold text-slate-900">{t('transactionHistory')}</h3>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by Type */}
            <select
              value={type}
              onChange={(e) => { setType(e.target.value); setPage(1); }}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              id="select-tx-type"
            >
              <option value="">{t('allTypes')}</option>
              <option value="Deposit">{t('deposit')}</option>
              <option value="Withdrawal">{t('withdrawal')}</option>
              <option value="Deduction">{t('deduction')}</option>
              <option value="Refund">{t('refund')}</option>
              <option value="CODSettlement">{t('codSettlement')}</option>
            </select>

            {/* Filter by Status */}
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              id="select-tx-status"
            >
              <option value="">{t('allStatuses')}</option>
              <option value="Completed">{t('completed')}</option>
              <option value="Pending">{t('pending')}</option>
              <option value="Failed">{t('failed')}</option>
            </select>
          </div>
        </div>

        {txLoading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
            <p className="text-sm mt-3">{t('loading')}</p>
          </div>
        ) : txError ? (
          <div className="p-12 text-center text-rose-500">
            <AlertCircle className="w-8 h-8 mx-auto text-rose-400 mb-2" />
            <p className="text-sm font-semibold">{t('failedToLoadTransactions')}</p>
            <p className="text-xs text-slate-400 mt-1">{t('failedToLoadWalletDesc')}</p>
          </div>
        ) : !transactionsData || transactionsData.items.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-lg font-medium text-slate-700">{t('noTransactions')}</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {t('noTransactionsDesc')}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-slate-500" id="table-transactions">
              <thead className="text-xs uppercase bg-slate-50/50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">{t('reference')}</th>
                  <th className="px-6 py-4 font-semibold">{t('type')}</th>
                  <th className="px-6 py-4 font-semibold">{t('amount')}</th>
                  <th className="px-6 py-4 font-semibold">{t('description')}</th>
                  <th className="px-6 py-4 font-semibold">{t('date')}</th>
                  <th className="px-6 py-4 font-semibold">{t('statusLabel')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactionsData.items.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-900 text-xs">
                      {tx.transactionNumber}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        tx.isCredit ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded' : 'text-slate-700 bg-slate-100 px-2 py-0.5 rounded'
                      }`}>
                        {tx.isCredit ? (
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <ArrowDownLeft className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        {tx.type === 'Deposit' ? t('deposit') : tx.type === 'Withdrawal' ? t('withdrawal') : tx.type === 'Deduction' ? t('deduction') : tx.type === 'Refund' ? t('refund') : tx.type === 'CODSettlement' ? t('codSettlement') : tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <span className={tx.isCredit ? 'text-emerald-600' : 'text-slate-900'}>
                        {tx.isCredit ? '+' : '-'} {Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium ms-1">SAR</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(tx.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {transactionsData.totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {t('showingPageOf', { page: transactionsData.pageNumber, totalPages: transactionsData.totalPages })}
                </span>
                <div className="inline-flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                    id="btn-tx-prev"
                  >
                    {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(transactionsData.totalPages, p + 1))}
                    disabled={page === transactionsData.totalPages}
                    className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                    id="btn-tx-next"
                  >
                    {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
