import axios, { AxiosResponse, AxiosError } from 'axios';
import { StandardApiResponse } from '@/types/api';
import { environment } from '@/config/environment';

const api = axios.create({
  baseURL: environment.API_BASE_URL,
  timeout: environment.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common error scenarios
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your internet connection.';
    } else if (error.response?.status === 401) {
      error.message = 'Authentication failed. Please login again.';
    } else if (error.response?.status === 404) {
      error.message = 'Resource not found.';
    } else if (error.response?.status === 409) {
      error.message = 'Data already exists.';
    } else if (error.response?.status === 417) {
      error.message = 'Request failed. Please try again.';
    }
    
    return Promise.reject(error);
  }
);

export default api;
