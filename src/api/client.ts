/**
 * API Client using native fetch
 * Drop-in replacement for axios — exposes api.get() and api.post()
 * so consumer files (pucApi, professionalApi, etc.) need no changes.
 */

import { environment } from '@/config/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    // For development: if SSL fails, try with a different approach
    // In production, this should be removed and proper SSL should be used
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout. Please try again.', undefined, undefined, 'ECONNABORTED');
    }
    // Check if it's an SSL certificate error
    if (error.message && (
      error.message.includes('certificate') ||
      error.message.includes('SSL') ||
      error.message.includes('TLS') ||
      error.message.includes('Network request failed')
    )) {
      console.warn('SSL/Certificate error detected. Server certificate may be expired or invalid.');
    }
    throw new ApiError(
      error.message || 'Network error. Please check your internet connection.'
    );
  } finally {
    clearTimeout(id);
  }
}

/**
 * Paths that require Bearer token authentication
 */
const BEARER_REQUIRED_PATHS = [
  '/welcomedashboard',
  '/pucstudents',
  '/professionalstudents',
  '/payanastudents',
  '/semiprofessionalstudent',
];

/**
 * Check if a path requires Bearer token
 */
function requiresBearerToken(path: string): boolean {
  return BEARER_REQUIRED_PATHS.some(prefix => path.startsWith(prefix));
}

/**
 * Get auth token from AsyncStorage
 */
async function getAuthToken(): Promise<string | null> {
  try {
    const AUTH_STORAGE_KEY = '@vp_auth_user';
    const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const user = JSON.parse(raw);
      return user.Token || null;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Logout function - clears auth storage
 */
async function logout(): Promise<void> {
  const AUTH_STORAGE_KEY = '@vp_auth_user';
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
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
  console.log(`API ${method} ${url}`);

  const headers: Record<string, string> = { ...customHeaders };

  // Add Bearer token for protected paths
  if (requiresBearerToken(path)) {
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Only set Content-Type for non-FormData bodies
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const options: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (body !== undefined) {
    options.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  const response = await fetchWithTimeout(url, options, environment.API_TIMEOUT);

  // Handle 401 - clear auth and throw error
  if (response.status === 401) {
    await logout();
    throw new ApiError('Session expired. Please login again.', 401, null, 'SESSION_EXPIRED');
  }

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
    case 403: return 'You do not have permission to access this resource.';
    case 404: return 'Resource not found.';
    case 409: return 'Data already exists.';
    case 417: return 'Request failed. Please try again.';
    case 500: return 'Server error. Please try again later.';
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
