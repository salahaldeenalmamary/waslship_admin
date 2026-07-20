export interface Webhook {
  id: number;
  method: string;
  url: string;
  webhookType: string;
  orderPrefix?: string;
  secretKey?: string;
  authorizationKey?: string;
}

export interface NewWebhook {
  method: string;
  url: string;
  webhookType: string;
  orderPrefix: string;
  secretKey: string;
  authorizationKey: string;
}

export type WebhookType = 'orderStatus' | 'shipmentError' | 'newOrders' | 'walletTransaction';
