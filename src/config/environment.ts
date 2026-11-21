/**
 * API base URL resolution order:
 *   1. EXPO_PUBLIC_API_URL env var (set via `eas build --env` / .env) — use this to point
 *      production builds at the production server.
 *   2. Test server (current known backend) for local/dev builds.
 *
 * NOTE for release: production builds MUST set EXPO_PUBLIC_API_URL, otherwise they would
 * fall back to the test server below. The fallback keeps local `expo start` working.
 */
import { Platform } from 'react-native';

const REMOTE_API_BASE_URL = 'https://vpwebservices.testserver.envisage-workflow.in/api';
const TEST_API_BASE_URL =
  Platform.OS === 'web' && typeof window !== 'undefined'
    ? '/api'
    : REMOTE_API_BASE_URL;
const ENV_API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const environment = {
  API_BASE_URL: (ENV_API_BASE_URL && ENV_API_BASE_URL.trim()) || TEST_API_BASE_URL,
  API_TIMEOUT: 30000,
  // Multipart submissions can carry ~60MB of files — needs far more than API_TIMEOUT on mobile uplinks
  UPLOAD_TIMEOUT: 300000,
  API_RETRY_ATTEMPTS: 3,
  LOG_LEVEL: 'INFO',
  ENABLE_DEBUG_LOGGING: __DEV__,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB for documents
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB for images
} as const;
