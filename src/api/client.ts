/**
 * API Client using native fetch
 * Drop-in replacement for axios — exposes api.get() and api.post()
 * so consumer files (pucApi, professionalApi, etc.) need no changes.
 */

import { environment } from '@/config/environment';
import { generateRequestId, error as logError, info as logInfo, warn as logWarn, truncateStack } from '@/diagnostics';
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
  // Legacy paths
  '/welcome-dashboard',
  '/pucstudents',
  '/professionalstudents',
  // Payana students - specific JWT-required paths (create/dropdowns are public)
  '/payanastudents',
  '/semiprofessionalstudent',
  '/semiprofessional',
  // Contract paths (API_BASE_URL already ends with /api)
  '/payana-students/list',
  '/payana-students/districts',
  '/assign-volunteer-house-visit',
  '/payana-volunteer-assignment',
  '/professional-volunteer-assignment',
  '/semi-professional-volunteer-assignment',
  '/semi-professional-courses',
  '/edit-format1-1-puc-student',
  '/edit-new-professional-student',
  '/edit-payana-students',
  '/editpuc-house-visits',
  '/edit-professional-house-visits',
  '/edit-payana-house-visits',
  '/edit-semi-professional-house-visits',
  '/student-approval-grid',
  '/professional-student-approval',
  '/semi-professional-student-approval',
  '/new-professional-approval',
  '/payana-student-grid',
  '/format1-1-puc',
  '/students/getall',
  '/students/get/',
  '/students/approve',
  '/students/reject',
  '/students/genders',
  '/students/districts',
  '/students/areas',
  '/branch-executive-district-mapping',
  '/renewalpuc/list',
  '/renewalpuc/approve/',
  '/renewalpuc/reject/',
  '/payana-renewal/list',
  '/payana-renewal/approve/',
  '/payana-renewal/reject/',
  '/payana-renewal/delete/',
  '/payana-renewal/import',
  '/edit-professional-renewal',
  // House Visit Grid (manager approval) — 3D-G
  '/puc-housevisits-grid',
  '/professional-house-visits',
  '/payana-house-visit-grid',
  '/semi-professional-house-visits',
  // Legacy callers that still prefix /api explicitly
  '/api/assign-volunteer-house-visit',
  '/api/edit-',
  '/api/semi-professional-courses',
  '/api/student-approval-grid',
];

/**
 * Contract endpoints under a JWT-required prefix that are explicitly public.
 */
const PUBLIC_PATH_OVERRIDES = [
  '/edit-format1-1-puc-student/dropdowns',
];

/**
 * Check if a path requires Bearer token
 */
function requiresBearerToken(path: string): boolean {
  if (PUBLIC_PATH_OVERRIDES.some(prefix => path.startsWith(prefix))) {
    return false;
  }
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

  // Diagnostic instrumentation: every API call gets a requestId.
  const requestId = generateRequestId();
  const start = Date.now();
  logInfo('api', 'request_started', { requestId, method, endpoint: path });

  try {
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
      logWarn('auth', 'session_expired', { requestId, endpoint: path });
      await logout();
      const durationMs = Date.now() - start;
      logError('api', 'request_failed', {
        requestId, method, endpoint: path,
        statusCode: 401, errorCode: 'SESSION_EXPIRED', durationMs,
      });
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
        (typeof data === 'object' && (data?.Message || data?.message)) ||
        getStatusMessage(response.status) ||
        'Request failed';
      const durationMs = Date.now() - start;
      logError('api', 'request_failed', {
        requestId, method, endpoint: path,
        statusCode: response.status,
        errorCode: `HTTP_${response.status}`,
        durationMs,
      });
      throw new ApiError(message, response.status, data);
    }

    const durationMs = Date.now() - start;
    logInfo('api', 'request_success', {
      requestId, method, endpoint: path,
      statusCode: response.status, durationMs,
    });

    return { data, status: response.status, ok: response.ok };
  } catch (error: any) {
    // If this is an ApiError we already logged above (for 401 / !ok cases).
    // Only log here if it's a network/timeout/unexpected error that wasn't caught above.
    if (error instanceof ApiError && error.response?.status !== undefined) {
      // Already logged as request_failed above for HTTP errors with a status.
      throw error;
    }

    // Network error, timeout, or unexpected runtime error.
    const durationMs = Date.now() - start;
    const errorCode = (error instanceof ApiError && error.code)
      ? error.code
      : 'UNKNOWN_ERROR';
    logError('api', 'request_failed', {
      requestId, method, endpoint: path,
      errorCode,
      durationMs,
      stack: truncateStack(error?.stack),
    });
    throw error;
  }
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
