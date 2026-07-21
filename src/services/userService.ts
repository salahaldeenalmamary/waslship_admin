import { apiClient } from './api';
import { User, CreateUserPayload, PaginatedAdmins, UserStatus } from '../types';

export const userService = {
  /**
   * List all admins
   */
  list: async (page = 1, pageSize = 20): Promise<PaginatedAdmins> => {
    const { data } = await apiClient.get<PaginatedAdmins>(`/users/admins?page=${page}&pageSize=${pageSize}`);
    return {
      ...data,
      items: (data.items || []).map(admin => ({
        ...admin,
        status: admin.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE
      }))
    };
  },

  /**
   * Get a single user by ID
   */
  getById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return {
      ...data,
      status: data.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE
    };
  },

  /**
   * Create a new admin
   */
  create: async (payload: CreateUserPayload): Promise<User> => {
    const { data } = await apiClient.post<User>('/users/admins', payload);
    return data;
  },

  /**
   * Update admin details
   */
  update: async (id: string, payload: Partial<User>): Promise<User> => {
    // Backend API update payload mapping
    const updatePayload: any = {
      adminId: id,
      fullName: payload.fullName,
      phoneNumber: payload.phoneNumber
    };

    if (payload.status !== undefined) {
      updatePayload.isActive = payload.status === UserStatus.ACTIVE;
    }

    const { data } = await apiClient.put<User>(`/users/admins/${id}`, updatePayload);
    return data;
  },

  /**
   * Delete an admin
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/admins/${id}`);
  }
};
