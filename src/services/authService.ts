import { apiClient } from './api';
import { AuthResponse, LoginPayload } from '../types';

const TOKEN_KEY = 'waslship_auth_token';
const REFRESH_TOKEN_KEY = 'waslship_refresh_token';
const USER_KEY = 'waslship_user';

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    // Admin login integration
    const { data } = await apiClient.post<AuthResponse>('/auth/admin-login', {
      emailOrPhone: payload.email,
      password: payload.password
    });
    
    const token = data.accessToken || data.token;
    const refreshToken = data.refreshToken;
    
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    return data;
  },
  
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
};
