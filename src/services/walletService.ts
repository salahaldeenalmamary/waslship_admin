import { apiClient } from './api';

// ============================================================================
// TypeScript Types & Interfaces for Wallet, Transactions, and Bank Transfers
// ============================================================================

export interface WalletBalance {
  userId: string;
  balance: number;
  reservedAmount: number;
  availableBalance: number;
  currency: string;
}

export interface TransactionSummary {
  id: string;
  transactionNumber: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  createdAt: string;
  isCredit: boolean;
}

export interface WalletDashboard {
  balance: WalletBalance;
  codPending: number;
  activeTransactions: number;
  totalIncome: number;
  recentTransactions: TransactionSummary[];
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  swiftCode?: string;
  currency: string;
  isActive: boolean;
  isDefault: boolean;
  branchName?: string;
  branchCode?: string;
  country?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BankTransfer {
  id: string;
  userId: string;
  amount: number;
  payerName?: string;
  transferDate?: string;
  transferReference?: string;
  receiptImageUrl?: string;
  adminNotes?: string;
  reviewedBy?: string;
  status: string;
  transactionNumber?: string;
  createdAt: string;
  completedAt?: string;
  bankAccount?: BankAccount;
}

export interface PagedBankTransferResponse {
  items: BankTransfer[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface PagedBankAccountResponse {
  items: BankAccount[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateBankAccountPayload {
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  swiftCode?: string;
  currency?: string;
  isDefault?: boolean;
  branchName?: string;
  branchCode?: string;
  country?: string;
  description?: string;
}

export interface UpdateBankAccountPayload {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  iban?: string;
  swiftCode?: string;
  currency?: string;
  isDefault?: boolean;
  branchName?: string;
  branchCode?: string;
  country?: string;
  description?: string;
}

export interface ConfirmBankTransferPayload {
  notes?: string;
}

export interface RejectBankTransferPayload {
  reason?: string;
  notes?: string;
}

// Helper to unwrap standard backend ApiResponse envelope
function unwrap<T>(responseBody: any): T {
  if (responseBody && typeof responseBody === 'object' && 'success' in responseBody && 'data' in responseBody) {
    return responseBody.data as T;
  }
  return responseBody as T;
}

// ============================================================================
// Wallet & Admin Wallet API Service Implementation
// ============================================================================

export const walletService = {
  // ─── Merchant/User Endpoints ──────────────────────────────────────────────

  /**
   * Retrieves the current logged-in user's wallet balance
   */
  getBalance: async (): Promise<WalletBalance> => {
    const { data } = await apiClient.get('/wallet/balance');
    return unwrap<WalletBalance>(data);
  },

  /**
   * Retrieves the current logged-in user's wallet dashboard metrics
   */
  getDashboard: async (): Promise<WalletDashboard> => {
    const { data } = await apiClient.get('/wallet/dashboard');
    return unwrap<WalletDashboard>(data);
  },

  /**
   * Retrieves a paginated list of the current logged-in user's transactions
   */
  getTransactions: async (
    page = 1,
    perPage = 20,
    type?: string,
    status?: string
  ): Promise<{ items: TransactionSummary[]; totalCount: number; pageNumber: number; pageSize: number; totalPages: number }> => {
    const params: any = { page, perPage };
    if (type) params.type = type;
    if (status) params.status = status;

    const { data } = await apiClient.get('/wallet/transactions', { params });
    return unwrap<{ items: TransactionSummary[]; totalCount: number; pageNumber: number; pageSize: number; totalPages: number }>(data);
  },

  /**
   * Initiates a bank transfer request by submitting a deposit receipt (Merchant/User)
   */
  createBankTransfer: async (formData: FormData): Promise<BankTransfer> => {
    const { data } = await apiClient.post('/bank-transfers/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return unwrap<BankTransfer>(data);
  },

  // ─── Admin Bank Transfer Endpoints ────────────────────────────────────────

  /**
   * Get all pending bank transfers (Admin only)
   */
  getPendingTransfers: async (page = 1, perPage = 20, search?: string): Promise<PagedBankTransferResponse> => {
    const params: any = { page, perPage };
    if (search) params.search = search;

    const { data } = await apiClient.get('/admin/bank-transfers/pending', { params });
    return unwrap<PagedBankTransferResponse>(data);
  },

  /**
   * Get all processing bank transfers (Admin only)
   */
  getProcessingTransfers: async (page = 1, perPage = 20, search?: string): Promise<PagedBankTransferResponse> => {
    const params: any = { page, perPage };
    if (search) params.search = search;

    const { data } = await apiClient.get('/admin/bank-transfers/processing', { params });
    return unwrap<PagedBankTransferResponse>(data);
  },

  /**
   * Get specific bank transfer by ID (Admin only)
   */
  getTransferById: async (id: string): Promise<BankTransfer> => {
    const { data } = await apiClient.get(`/admin/bank-transfers/${id}`);
    return unwrap<BankTransfer>(data);
  },

  /**
   * Mark a pending bank transfer as 'Processing' after initial review (Admin only)
   */
  processTransfer: async (id: string, notes?: string): Promise<BankTransfer> => {
    const { data } = await apiClient.post(`/admin/bank-transfers/${id}/process`, null, {
      params: notes ? { notes } : undefined,
    });
    return unwrap<BankTransfer>(data);
  },

  /**
   * Confirm and approve a bank transfer, crediting the merchant's wallet (Admin only)
   */
  confirmTransfer: async (id: string, payload: ConfirmBankTransferPayload): Promise<BankTransfer> => {
    const { data } = await apiClient.post(`/admin/bank-transfers/${id}/confirm`, payload);
    return unwrap<BankTransfer>(data);
  },

  /**
   * Reject a bank transfer and mark as failed (Admin only)
   */
  rejectTransfer: async (id: string, payload: RejectBankTransferPayload): Promise<BankTransfer> => {
    const { data } = await apiClient.post(`/admin/bank-transfers/${id}/reject`, payload);
    return unwrap<BankTransfer>(data);
  },

  // ─── Admin Bank Account Endpoints ─────────────────────────────────────────

  /**
   * Get all bank accounts (Admin only)
   */
  getBankAccounts: async (
    page = 1,
    perPage = 20,
    includeInactive = false,
    search?: string
  ): Promise<PagedBankAccountResponse> => {
    const params: any = { page, perPage, includeInactive };
    if (search) params.search = search;

    const { data } = await apiClient.get('/admin/bank-accounts', { params });
    return unwrap<PagedBankAccountResponse>(data);
  },

  /**
   * Get specific bank account by ID (Admin only)
   */
  getBankAccountById: async (id: string): Promise<BankAccount> => {
    const { data } = await apiClient.get(`/admin/bank-accounts/${id}`);
    return unwrap<BankAccount>(data);
  },

  /**
   * Get bank account by IBAN (Admin only)
   */
  getBankAccountByIban: async (iban: string): Promise<BankAccount> => {
    const { data } = await apiClient.get(`/admin/bank-accounts/iban/${iban}`);
    return unwrap<BankAccount>(data);
  },

  /**
   * Create a new bank account (Admin only)
   */
  createBankAccount: async (payload: CreateBankAccountPayload): Promise<BankAccount> => {
    const { data } = await apiClient.post('/admin/bank-accounts', payload);
    return unwrap<BankAccount>(data);
  },

  /**
   * Update an existing bank account (Admin only)
   */
  updateBankAccount: async (id: string, payload: UpdateBankAccountPayload): Promise<BankAccount> => {
    const { data } = await apiClient.put(`/admin/bank-accounts/${id}`, payload);
    return unwrap<BankAccount>(data);
  },

  /**
   * Set specific bank account as default (Admin only)
   */
  setDefaultBankAccount: async (id: string): Promise<void> => {
    await apiClient.patch(`/admin/bank-accounts/${id}/default`);
  },

  /**
   * Toggle bank account active status (Admin only)
   */
  toggleBankAccountStatus: async (id: string, isActive: boolean): Promise<BankAccount> => {
    const { data } = await apiClient.patch(`/admin/bank-accounts/${id}/status`, null, {
      params: { isActive },
    });
    return unwrap<BankAccount>(data);
  },

  /**
   * Delete a bank account (Admin only)
   */
  deleteBankAccount: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/bank-accounts/${id}`);
  },
};
