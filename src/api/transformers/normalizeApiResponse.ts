/**
 * Normalizes backend API responses to consistent UI format
 * UI components should never depend on raw backend response shape
 */

export interface StandardApiResponse<T> {
  Status: boolean;
  Message: string;
  Data: T;
}

export interface NormalizedApiSuccess<T> {
  success: true;
  data: T;
  message: string;
}

export interface NormalizedApiError {
  success: false;
  error: string;
  message: string;
}

export type NormalizedApiResponse<T> = NormalizedApiSuccess<T> | NormalizedApiError;

/**
 * Normalizes standard API response to consistent format
 */
export function normalizeApiResponse<T>(
  response: StandardApiResponse<T>
): NormalizedApiResponse<T> {
  if (response.Status) {
    return {
      success: true,
      data: response.Data,
      message: response.Message || 'Success',
    };
  }

  return {
    success: false,
    error: response.Message || 'Request failed',
    message: response.Message || 'Request failed',
  };
}

/**
 * Normalizes error responses
 */
export function normalizeApiError(error: any): NormalizedApiError {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.Message || error.message || 'Request failed';

    let errorMessage = message;
    if (status === 400) errorMessage = 'Invalid request data';
    if (status === 401) errorMessage = 'Authentication failed';
    if (status === 404) errorMessage = 'Resource not found';
    if (status === 409) errorMessage = 'Data already exists';
    if (status === 417) errorMessage = 'Request failed';

    return {
      success: false,
      error: errorMessage,
      message: errorMessage,
    };
  }

  if (error.code === 'ECONNABORTED') {
    return {
      success: false,
      error: 'Request timeout. Please try again.',
      message: 'Request timeout. Please try again.',
    };
  }

  return {
    success: false,
    error: error.message || 'Network error',
    message: error.message || 'Network error',
  };
}
