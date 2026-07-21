import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletService } from '../services/walletService';
import { 
  CreateBankAccountPayload, 
  UpdateBankAccountPayload, 
  ConfirmBankTransferPayload, 
  RejectBankTransferPayload 
} from '../services/walletService';

// ─── Merchant/User Hooks ────────────────────────────────────────────────────

export const useWalletBalance = () => {
  return useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: () => walletService.getBalance(),
  });
};

export const useWalletDashboard = () => {
  return useQuery({
    queryKey: ['wallet', 'dashboard'],
    queryFn: () => walletService.getDashboard(),
  });
};

export const useWalletTransactions = (page = 1, perPage = 20, type?: string, status?: string) => {
  return useQuery({
    queryKey: ['wallet', 'transactions', page, perPage, type, status],
    queryFn: () => walletService.getTransactions(page, perPage, type, status),
  });
};

export const useCreateBankTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => walletService.createBankTransfer(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'transfers'] });
    }
  });
};

// ─── Admin Bank Transfer Hooks ──────────────────────────────────────────────

export const usePendingTransfers = (page = 1, perPage = 20, search?: string) => {
  return useQuery({
    queryKey: ['admin', 'transfers', 'pending', page, perPage, search],
    queryFn: () => walletService.getPendingTransfers(page, perPage, search),
  });
};

export const useProcessingTransfers = (page = 1, perPage = 20, search?: string) => {
  return useQuery({
    queryKey: ['admin', 'transfers', 'processing', page, perPage, search],
    queryFn: () => walletService.getProcessingTransfers(page, perPage, search),
  });
};

export const useBankTransferDetails = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'transfers', id],
    queryFn: () => walletService.getTransferById(id),
    enabled: !!id,
  });
};

export const useProcessTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => 
      walletService.processTransfer(id, notes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'transfers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'transfers', id] });
    }
  });
};

export const useConfirmTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ConfirmBankTransferPayload }) => 
      walletService.confirmTransfer(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'transfers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'transfers', id] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'dashboard'] });
    }
  });
};

export const useRejectTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RejectBankTransferPayload }) => 
      walletService.rejectTransfer(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'transfers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'transfers', id] });
    }
  });
};

// ─── Admin Bank Account Hooks ───────────────────────────────────────────────

export const useBankAccounts = (page = 1, perPage = 20, includeInactive = false, search?: string) => {
  return useQuery({
    queryKey: ['admin', 'bank-accounts', page, perPage, includeInactive, search],
    queryFn: () => walletService.getBankAccounts(page, perPage, includeInactive, search),
  });
};

export const useBankAccountDetails = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'bank-accounts', id],
    queryFn: () => walletService.getBankAccountById(id),
    enabled: !!id,
  });
};

export const useCreateBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBankAccountPayload) => walletService.createBankAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bank-accounts'] });
    }
  });
};

export const useUpdateBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBankAccountPayload }) => 
      walletService.updateBankAccount(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bank-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'bank-accounts', id] });
    }
  });
};

export const useSetDefaultBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => walletService.setDefaultBankAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bank-accounts'] });
    }
  });
};

export const useToggleBankAccountStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      walletService.toggleBankAccountStatus(id, isActive),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bank-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'bank-accounts', id] });
    }
  });
};

export const useDeleteBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => walletService.deleteBankAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bank-accounts'] });
    }
  });
};
