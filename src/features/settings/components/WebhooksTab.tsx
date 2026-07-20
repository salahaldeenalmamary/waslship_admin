import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Webhook as WebhookIcon,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useWebhooks, useCreateWebhook, useDeleteWebhook } from '../../../hooks/useWebhooks';
import { NewWebhook } from '../../../types';

const WebhookSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
      <div className="h-3 bg-slate-100 rounded w-12"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-slate-100 rounded w-3/4"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex space-x-2">
        <div className="h-5 bg-slate-100 rounded w-12"></div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <div className="h-8 bg-slate-100 rounded w-8 ml-auto"></div>
    </td>
  </tr>
);

export default function WebhooksTab() {
  const { 
    data: webhooks = [], 
    isLoading, 
    isFetching,
    error, 
    refetch 
  } = useWebhooks();
  
  const createWebhook = useCreateWebhook();
  const deleteWebhook = useDeleteWebhook();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWebhook, setNewWebhook] = useState<NewWebhook>({
    method: 'POST',
    url: '',
    webhookType: 'orderStatus',
    orderPrefix: '',
    secretKey: '',
    authorizationKey: ''
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWebhook.mutateAsync(newWebhook);
      setShowAddForm(false);
      setNewWebhook({
        method: 'POST',
        url: '',
        webhookType: 'orderStatus',
        orderPrefix: '',
        secretKey: '',
        authorizationKey: ''
      });
    } catch (err) {
      // Error is handled by mutation state
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this webhook?')) return;
    try {
      await deleteWebhook.mutateAsync(id);
    } catch (err) {
      // Error handled by mutation state
    }
  };

  const errorMessage = (error as Error)?.message || 
                       (createWebhook.error as Error)?.message || 
                       (deleteWebhook.error as Error)?.message;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">OTO Webhooks</h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure external endpoints to receive real-time updates from OTO Logistics.
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none flex items-center shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Webhook
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-md flex items-start justify-between">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{errorMessage}</p>
          </div>
          {error && (
            <button 
              onClick={() => refetch()}
              className="text-xs font-semibold underline hover:text-rose-800 ml-4"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {showAddForm && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Register New Webhook</h3>
          </div>
          <form onSubmit={handleCreate} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Webhook Type</label>
                <select 
                  className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 border px-3 py-2"
                  value={newWebhook.webhookType}
                  onChange={e => setNewWebhook({...newWebhook, webhookType: e.target.value})}
                >
                  <option value="orderStatus">Order Status Updates</option>
                  <option value="shipmentError">Shipment Error Events</option>
                  <option value="newOrders">New Orders (WMS)</option>
                  <option value="walletTransaction">Wallet & Billing Transactions</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">HTTP Method</label>
                <select 
                  className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 border px-3 py-2"
                  value={newWebhook.method}
                  onChange={e => setNewWebhook({...newWebhook, method: e.target.value})}
                >
                  <option value="POST">POST (Recommended)</option>
                  <option value="PUT">PUT</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium text-slate-700">Target URL</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://your-api.com/webhooks/oto"
                  className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 border px-3 py-2"
                  value={newWebhook.url}
                  onChange={e => setNewWebhook({...newWebhook, url: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Secret Key (HMAC)</label>
                <input 
                  type="text" 
                  placeholder="Shared secret for signature verification"
                  className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 border px-3 py-2"
                  value={newWebhook.secretKey}
                  onChange={e => setNewWebhook({...newWebhook, secretKey: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Auth Key (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Authorization header token"
                  className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 border px-3 py-2"
                  value={newWebhook.authorizationKey}
                  onChange={e => setNewWebhook({...newWebhook, authorizationKey: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Order Prefix (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Filter by order prefix"
                  className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 border px-3 py-2"
                  value={newWebhook.orderPrefix}
                  onChange={e => setNewWebhook({...newWebhook, orderPrefix: e.target.value})}
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end space-x-3">
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={createWebhook.isPending}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none flex items-center shadow-sm disabled:opacity-50"
              >
                {createWebhook.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Register Webhook
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type / Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Target URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Security</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {isLoading ? (
                <>
                  <WebhookSkeleton />
                  <WebhookSkeleton />
                  <WebhookSkeleton />
                </>
              ) : webhooks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <WebhookIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-lg font-medium text-slate-600">No webhooks configured</p>
                    <p className="text-sm mt-1">Register a webhook to start receiving OTO updates.</p>
                  </td>
                </tr>
              ) : (
                webhooks.map((webhook) => (
                  <tr key={webhook.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{webhook.webhookType}</span>
                        <span className="text-xs text-indigo-600 font-mono mt-1">{webhook.method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-600 truncate max-w-xs md:max-w-md">
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-slate-400" />
                        <span className="truncate" title={webhook.url}>{webhook.url}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {webhook.secretKey && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800" title="HMAC Signature Enabled">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            HMAC
                          </span>
                        )}
                        {webhook.authorizationKey && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800" title="Authorization Key Set">
                            Auth
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDelete(webhook.id)}
                        disabled={deleteWebhook.isPending}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 transition-colors disabled:opacity-50"
                        title="Delete Webhook"
                      >
                        {deleteWebhook.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 flex items-start">
        <AlertCircle className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-indigo-700">
          <p className="font-semibold mb-1">Important Integration Note:</p>
          <p>
            OTO will send POST requests to your target URL whenever the selected event type occurs. 
            Ensure your server is configured to handle these requests and verify the <code>signature</code> 
            header using your <strong>Secret Key</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
