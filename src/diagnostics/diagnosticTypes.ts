import { FormType } from '@/forms/shared/types';

export type DiagnosticLevel = 'debug' | 'info' | 'warn' | 'error';

export type DiagnosticCategory =
  | 'app'
  | 'navigation'
  | 'auth'
  | 'api'
  | 'form'
  | 'upload'
  | 'submission';

export interface DiagnosticEvent {
  id: string;
  timestamp: string;
  level: DiagnosticLevel;
  category: DiagnosticCategory;
  event: string;
  message?: string;
  sessionId: string;
  appVersion: string;
  buildNumber: string;
  screen?: string;
  formType?: FormType;
  requestId?: string;
  submissionId?: string;
  method?: string;
  endpoint?: string;
  statusCode?: number;
  durationMs?: number;
  errorCode?: string;
  stack?: string;
}

export interface SubmissionError extends Error {
  submissionId: string;
  cause?: unknown;
}

export const MAX_EVENTS = 500;
export const MAX_BUFFER_SIZE = 20;
export const FLUSH_INTERVAL_MS = 2000;
export const MAX_EVENT_SIZE_BYTES = 2048;
export const MAX_STACK_LENGTH = 4000;
export const MAX_MESSAGE_LENGTH = 200;
export const DIAGNOSTIC_SCHEMA_VERSION = 1;

export const DIAGNOSTIC_EVENTS_KEY = '@vp/diagnostics/events';
export const DIAGNOSTIC_SCHEMA_VERSION_KEY = '@vp/diagnostics/schema_version';

export const SENSITIVE_FIELD_NAMES = [
  'body',
  'headers',
  'authorization',
  'token',
  'accessToken',
  'refreshToken',
  'password',
  'aadhaar',
  'bankAccount',
  'income',
  'address',
  'name',
  'document',
  'file',
  'uri',
  'base64',
] as const;
