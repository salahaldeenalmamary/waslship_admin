import axios from 'axios';

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

// Request Interceptor to add Bearer Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('waslship_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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
