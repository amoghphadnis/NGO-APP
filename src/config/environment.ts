export const environment = {
  API_BASE_URL: 'https://vpwebservices.testserver.envisage-workflow.in/api',
  API_TIMEOUT: 30000,
  API_RETRY_ATTEMPTS: 3,
  LOG_LEVEL: 'INFO',
  ENABLE_DEBUG_LOGGING: true,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB for documents
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB for images
} as const;
