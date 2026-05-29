/**
 * API Client using native fetch
 * Drop-in replacement for axios — exposes api.get() and api.post()
 * so consumer files (pucApi, professionalApi, etc.) need no changes.
 */

import { environment } from '@/config/environment';

interface ApiResponse {
  data: any;
  status: number;
  ok: boolean;
}

/**
 * Custom error class that mirrors the shape consumers expect
 * (response?.status, response?.data, message, code)
 */
export class ApiError extends Error {
  response?: { status: number; data: any };
  code?: string;

  constructor(message: string, status?: number, data?: any, code?: string) {
    super(message);
    this.name = 'ApiError';
    if (status !== undefined) {
      this.response = { status, data };
    }
    this.code = code;
  }
}

/**
 * Wraps fetch with timeout via AbortController
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout. Please try again.', undefined, undefined, 'ECONNABORTED');
    }
    throw new ApiError(
      error.message || 'Network error. Please check your internet connection.'
    );
  } finally {
    clearTimeout(id);
  }
}

/**
 * Core request function
 */
async function request(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  path: string,
  body?: any,
  customHeaders?: Record<string, string>
): Promise<ApiResponse> {
  const url = `${environment.API_BASE_URL}${path}`;

  const headers: Record<string, string> = { ...customHeaders };

  // Only set Content-Type for non-FormData bodies
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body !== undefined) {
    options.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  const response = await fetchWithTimeout(url, options, environment.API_TIMEOUT);

  let data: any;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message =
      (typeof data === 'object' && data?.Message) ||
      getStatusMessage(response.status) ||
      'Request failed';
    throw new ApiError(message, response.status, data);
  }

  return { data, status: response.status, ok: response.ok };
}

function getStatusMessage(status: number): string {
  switch (status) {
    case 400: return 'Invalid request data.';
    case 401: return 'Authentication failed. Please login again.';
    case 404: return 'Resource not found.';
    case 409: return 'Data already exists.';
    case 417: return 'Request failed. Please try again.';
    default:  return `Request failed with status ${status}.`;
  }
}

/**
 * Exposed API matching the previous axios-style interface:
 *   api.get(path)
 *   api.post(path, body, config?)
 *   api.put(path, body, config?)
 *   api.delete(path, config?)
 *   api.patch(path, body, config?)
 */
const api = {
  get: (path: string, config?: { headers?: Record<string, string> }) =>
    request('GET', path, undefined, config?.headers),

  post: (path: string, body?: any, config?: { headers?: Record<string, string> }) =>
    request('POST', path, body, config?.headers),

  put: (path: string, body?: any, config?: { headers?: Record<string, string> }) =>
    request('PUT', path, body, config?.headers),

  delete: (path: string, config?: { headers?: Record<string, string> }) =>
    request('DELETE', path, undefined, config?.headers),

  patch: (path: string, body?: any, config?: { headers?: Record<string, string> }) =>
    request('PATCH', path, body, config?.headers),
};

export default api;
