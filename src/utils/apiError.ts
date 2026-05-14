import { ApiError } from '@/types/api';

export const parseApiError = (error: any): ApiError => {
  // Network errors
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return {
        title: 'Request Timeout',
        message: 'Request timeout. Please try again.',
        code: 408,
      };
    }
    
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      return {
        title: 'Network Error',
        message: 'Network error. Please check your internet connection.',
        code: 0,
      };
    }
  }
  
  // HTTP Status Errors
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        return {
          title: 'Validation Error',
          message: data?.Message || 'Invalid data provided',
          code: 400,
        };
        
      case 401:
        return {
          title: 'Authentication Error',
          message: 'Authentication failed. Please login again.',
          code: 401,
        };
        
      case 404:
        return {
          title: 'Not Found',
          message: 'Resource not found.',
          code: 404,
        };
        
      case 409:
        return {
          title: 'Conflict',
          message: 'Data already exists.',
          code: 409,
        };
        
      case 417:
        return {
          title: 'Request Failed',
          message: 'Request failed. Please try again.',
          code: 417,
        };
        
      case 500:
        return {
          title: 'Server Error',
          message: 'Server error. Please try again later.',
          code: 500,
        };
        
      default:
        return {
          title: 'Error',
          message: data?.Message || error.message || 'An error occurred',
          code: status || 500,
        };
    }
  }
  
  // Fallback for unknown errors
  return {
    title: 'Unknown Error',
    message: 'An unexpected error occurred. Please try again.',
    code: 500,
  };
};