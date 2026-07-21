import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Get base URL from environment variables, fallback to relative path for dev proxy
let BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1/admin';

// Fix Mixed Content error when accessing localhost from HTTPS preview
if (BASE_URL.startsWith('http://localhost:5045') && window.location.protocol === 'https:') {
  BASE_URL = BASE_URL.replace('http://localhost:5045', 'https://localhost:7020');
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to dynamically inject the JWT token (synced from AuthProvider / localStorage)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('waslship_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handling multiple concurrent 401 requests while a token refresh is in progress
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor to intercept 401 errors and handle the token refresh flow
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Check if error is 401 Unauthorized and we haven't already retried this request
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // If we are already refreshing, queue this request until the refresh is done
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('waslship_refresh_token');

      if (refreshToken) {
        try {
          // Perform refresh-token call using direct axios to prevent interceptor loop recursion
          const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refreshToken
          });

          const newAccessToken = response.data?.accessToken || response.data?.token;
          const newRefreshToken = response.data?.refreshToken;

          if (newAccessToken) {
            localStorage.setItem('waslship_auth_token', newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem('waslship_refresh_token', newRefreshToken);
            }
            
            // Apply new token to all future requests and current retried request
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            
            processQueue(null, newAccessToken);
            isRefreshing = false;
            
            return apiClient(originalRequest);
          }
        } catch (refreshError: any) {
          processQueue(refreshError, null);
          isRefreshing = false;
          
          // Token expired or invalid: clear credentials and redirect to login page
          localStorage.removeItem('waslship_auth_token');
          localStorage.removeItem('waslship_refresh_token');
          localStorage.removeItem('waslship_user');
          
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, force logout and redirect
        localStorage.removeItem('waslship_auth_token');
        localStorage.removeItem('waslship_refresh_token');
        localStorage.removeItem('waslship_user');
        window.location.href = '/login';
      }
    }

    // Standardize error messages from server responses
    const responseData = error.response?.data as any;
    const message = responseData?.message || 
                    responseData?.title || 
                    error.message || 
                    'An unexpected error occurred';
    
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
