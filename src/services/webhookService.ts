import { apiClient } from './api';
import { Webhook, NewWebhook } from '../types';

export const webhookService = {
  /**
   * List all registered webhooks
   */
  list: async (): Promise<Webhook[]> => {
    const { data } = await apiClient.get<Webhook[] | { data: Webhook[] }>('/webhooks');
    return Array.isArray(data) ? data : (data as any).data || [];
  },

  /**
   * Create a new webhook
   */
  create: async (payload: NewWebhook): Promise<Webhook> => {
    const { data } = await apiClient.post<Webhook>('/webhooks', payload);
    return data;
  },

  /**
   * Update an existing webhook (PUT as per OTO API)
   */
  update: async (id: number, payload: Partial<NewWebhook>): Promise<Webhook> => {
    const { data } = await apiClient.put<Webhook>(`/webhooks/${id}`, payload);
    return data;
  },

  /**
   * Delete a webhook by ID
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/webhooks/${id}`);
  },
};
