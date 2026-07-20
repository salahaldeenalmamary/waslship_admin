import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { webhookService } from '../services/webhookService';
import { NewWebhook } from '../types';

export const useWebhooks = () => {
  return useQuery({
    queryKey: ['webhooks'],
    queryFn: webhookService.list
  });
};

export const useCreateWebhook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newWebhook: NewWebhook) => webhookService.create(newWebhook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    }
  });
};

export const useUpdateWebhook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<NewWebhook> }) => 
      webhookService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    }
  });
};

export const useDeleteWebhook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => webhookService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    }
  });
};
