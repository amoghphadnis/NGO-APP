import Constants from 'expo-constants';


import { appendEvents } from './diagnosticStorage';
import {
    DiagnosticCategory,
    DiagnosticEvent,
    DiagnosticLevel,
    FLUSH_INTERVAL_MS,
    MAX_BUFFER_SIZE,
    MAX_EVENT_SIZE_BYTES,
    MAX_MESSAGE_LENGTH,
    MAX_STACK_LENGTH,
    SENSITIVE_FIELD_NAMES,
} from './diagnosticTypes';

// ---------------------------------------------------------------------------
// ID generation (no crypto import — avoids RN edge cases)
// ---------------------------------------------------------------------------

function randomHex(len: number): string {
  let s = '';
  while (s.length < len) {
    s += Math.random().toString(16).slice(2);
  }
  return s.slice(0, len);
}

export function generateId(prefix: string): string {
  return `${prefix}_${randomHex(8)}`;
}

export function generateRequestId(): string {
  return generateId('req');
}

export function generateSubmissionId(): string {
  return generateId('sub');
}

// ---------------------------------------------------------------------------
// Session ID — in-memory only, one per app launch (NOT persisted)
// ---------------------------------------------------------------------------

let sessionId: string | null = null;

export function getSessionId(): string {
  if (!sessionId) {
    sessionId = generateId('sess');
  }
  return sessionId;
}

// ---------------------------------------------------------------------------
// App version / build number via expo-constants (modern expoConfig API)
// ---------------------------------------------------------------------------

export function getAppVersion(): string {
  try {
    const cfg = (Constants as any)?.expoConfig;
    return cfg?.version ?? '1.0.0';
  } catch {
    return '1.0.0';
  }
}

export function getBuildNumber(): string {
  try {
    const cfg = (Constants as any)?.expoConfig;
    const vc = cfg?.android?.versionCode ?? cfg?.ios?.buildNumber;
    return String(vc ?? 1);
  } catch {
    return '1';
  }
}

// ---------------------------------------------------------------------------
// Stack / message truncation
// ---------------------------------------------------------------------------

export function truncateStack(stack?: string): string | undefined {
  if (!stack) return undefined;
  return stack.length > MAX_STACK_LENGTH ? stack.slice(0, MAX_STACK_LENGTH) : stack;
}

function truncateMessage(msg?: string): string | undefined {
  if (!msg) return undefined;
  return msg.length > MAX_MESSAGE_LENGTH ? msg.slice(0, MAX_MESSAGE_LENGTH) : msg;
}

// ---------------------------------------------------------------------------
// Sanitizer — defense-in-depth (strips known-sensitive field names)
// ---------------------------------------------------------------------------

function sanitizeEvent(event: DiagnosticEvent): DiagnosticEvent {
  const cleaned: any = {};
  for (const [key, value] of Object.entries(event)) {
    if ((SENSITIVE_FIELD_NAMES as readonly string[]).includes(key)) {
      continue;
    }
    cleaned[key] = value;
  }
  // Enforce size limits on free-text fields.
  if (cleaned.message) cleaned.message = truncateMessage(cleaned.message);
  if (cleaned.stack) cleaned.stack = truncateStack(cleaned.stack);
  return cleaned as DiagnosticEvent;
}

// ---------------------------------------------------------------------------
// Logger singleton — buffered + serialized flush with atomic buffer capture
// ---------------------------------------------------------------------------

type EventFields = Partial<Omit<DiagnosticEvent, 'id' | 'timestamp' | 'level' | 'category' | 'event' | 'sessionId' | 'appVersion' | 'buildNumber'>>;

let buffer: DiagnosticEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushPromise: Promise<void> | null = null;

function buildEvent(
  level: DiagnosticLevel,
  category: DiagnosticCategory,
  event: string,
  fields?: EventFields
): DiagnosticEvent {
  return sanitizeEvent({
    id: generateId('evt'),
    timestamp: new Date().toISOString(),
    level,
    category,
    event,
    sessionId: getSessionId(),
    appVersion: getAppVersion(),
    buildNumber: getBuildNumber(),
    ...fields,
  } as DiagnosticEvent);
}

/**
 * Internal flush implementation.
 *
 * Atomically captures + clears the buffer BEFORE awaiting storage so that
 * events arriving during the write go into the next buffer, not the
 * in-flight one.
 */
async function doFlush(): Promise<void> {
  // splice(0) removes all elements and returns them — atomic capture.
  const captured = buffer.splice(0);
  if (captured.length === 0) return;
  try {
    await appendEvents(captured);
  } catch {
    // Best-effort. Do NOT re-buffer (could cause unbounded growth).
    // Console as last resort.
    // eslint-disable-next-line no-console
    console.warn('[diagnostics] flush failed — events lost', captured.length);
  }
}

/**
 * Serialized flush. Concurrent calls share the same in-flight promise.
 */
function flush(): Promise<void> {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (flushPromise) {
    return flushPromise;
  }
  flushPromise = doFlush().finally(() => {
    flushPromise = null;
  });
  return flushPromise;
}

function scheduleFlush(): void {
  if (flushTimer) return; // already scheduled
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flush();
  }, FLUSH_INTERVAL_MS);
}

/**
 * Core log function.
 */
export function log(
  level: DiagnosticLevel,
  category: DiagnosticCategory,
  event: string,
  fields?: EventFields
): void {
  const evt = buildEvent(level, category, event, fields);
  buffer.push(evt);

  // Enforce max event size defensively — if the serialized event exceeds the
  // limit, truncate the message (not the stack, which is already capped).
  try {
    const serialized = JSON.stringify(evt);
    if (serialized.length > MAX_EVENT_SIZE_BYTES) {
      evt.message = truncateMessage(evt.message?.slice(0, 100));
    }
  } catch {
    // non-serializable event — ignore
  }

  if (level === 'error') {
    // Immediate flush for errors.
    flush();
  } else if (buffer.length >= MAX_BUFFER_SIZE) {
    // Threshold reached — flush now.
    flush();
  } else {
    scheduleFlush();
  }
}

export function info(category: DiagnosticCategory, event: string, fields?: EventFields): void {
  log('info', category, event, fields);
}

export function warn(category: DiagnosticCategory, event: string, fields?: EventFields): void {
  log('warn', category, event, fields);
}

export function error(category: DiagnosticCategory, event: string, fields?: EventFields): void {
  log('error', category, event, fields);
}

/**
 * Flush any pending buffered events immediately.
 */
export function flushNow(): Promise<void> {
  return flush();
}

/**
 * Test-only: reset the logger state (clears buffer + cancels timer).
 * Exposed for unit tests; not intended for production use.
 */
export function _resetForTests(): void {
  buffer = [];
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  flushPromise = null;
  sessionId = null;
}

/**
 * Test-only: peek at the current in-memory buffer length.
 */
export function _bufferLengthForTests(): number {
  return buffer.length;
}
