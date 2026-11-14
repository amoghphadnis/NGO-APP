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
 * Contract-style response shape: { success, message, data? }
 */
export interface ContractApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

type RawApiResponse<T> = Partial<StandardApiResponse<T>> & Partial<ContractApiResponse<T>>;

/**
 * Normalizes standard API response to consistent format
 * Handles both legacy { Status, Message, Data } and contract { success, message, data } shapes,
 * and cases where the flag is false but the message indicates success.
 */
export function normalizeApiResponse<T>(
  response: StandardApiResponse<T> | ContractApiResponse<T> | RawApiResponse<T> | null | undefined
): NormalizedApiResponse<T> {
  const raw: RawApiResponse<T> = (response ?? {}) as RawApiResponse<T>;
  const flag = raw.success ?? raw.Status ?? false;
  const message = raw.message ?? raw.Message ?? '';
  const data = (raw.data ?? raw.Data) as T;

  const lowered = message.toLowerCase();
  const isSuccessMessage = lowered.includes('success') || lowered.includes('saved');
  // An explicit success:false from the server is authoritative — only fall back
  // to the message heuristic when the flag itself is missing.
  const hasExplicitFlag = raw.success !== undefined || raw.Status !== undefined;

  if (flag || (!hasExplicitFlag && isSuccessMessage)) {
    return {
      success: true,
      data,
      message: message || 'Success',
    };
  }

  return {
    success: false,
    error: message || 'Request failed',
    message: message || 'Request failed',
  };
}

/**
 * Normalizes error responses
 * Works with ApiError from the native fetch client and generic errors
 */
export function normalizeApiError(error: any): NormalizedApiError {
  // Handle ApiError with response (HTTP error status)
  if (error.response) {
    const status = error.response.status;
    const message =
      error.response.data?.ExceptionMessage ||
      error.response.data?.exceptionMessage ||
      error.response.data?.Message ||
      error.response.data?.message ||
      error.message ||
      'Request failed';

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

  // Handle timeout (AbortError / ECONNABORTED)
  if (error.code === 'ECONNABORTED' || error.name === 'AbortError') {
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
