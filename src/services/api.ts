import axios from 'axios';

// Get base URL from environment variables, fallback to relative path for dev proxy
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1/admin';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global Response Interceptor for Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error messages from ASP.NET Core or Network errors
    const message = error.response?.data?.message || 
                   error.response?.data?.title || 
                   error.message || 
                   'An unexpected error occurred';
    
    return Promise.reject(new Error(message));
  }
);
