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

export enum UserRole {
  ADMIN = 'Admin',
  OPERATOR = 'Operator',
  VIEWER = 'Viewer'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status?: UserStatus;
  isActive?: boolean;
  phoneNumber?: string;
  lastLogin?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token?: string; // fallback
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  requiresOtp?: boolean;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface CreateUserPayload {
  email: string;
  fullName: string;
  role?: string;
  password?: string;
  phoneNumber?: string;
}

export interface PaginatedAdmins {
  items: User[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
