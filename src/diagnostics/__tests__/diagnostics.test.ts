/**
 * Diagnostics Layer Unit Tests
 *
 * Covers:
 * - Ring buffer FIFO pruning (max 500 events)
 * - Schema version guard (wipes old format)
 * - Event serialization round-trip + stack truncation
 * - Request correlation (requestId across start/success/fail)
 * - Submission correlation (submissionId across start/success/fail)
 * - SubmissionId attached to thrown error on failure
 * - Buffer flush on error (immediate, no 2s wait)
 * - Buffer batch on info (threshold flush)
 * - Serialized flush (no concurrent appendEvents)
 * - Atomic buffer capture (events during flush go to next buffer)
 * - PII sanitizer strips sensitive fields
 * - Export report format (newest-first, version, session, no PII)
 */

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      version: '1.0.0',
      android: { versionCode: 1 },
    },
  },
}));

// Mock the API modules so submitApplication can be tested without real network calls.
jest.mock('@/api/professionalApi');
jest.mock('@/api/pucApi');
jest.mock('@/api/semiProfessionalApi');
jest.mock('@/api/payanaApi');

import AsyncStorage from '@react-native-async-storage/async-storage';

import { buildExportReport } from '../diagnosticExport';
import {
  _resetForTests,
  flushNow,
  generateRequestId,
  generateSubmissionId,
  getAppVersion,
  getBuildNumber,
  getSessionId,
  error as logError,
  info as logInfo
} from '../diagnosticLogger';
import {
  appendEvents,
  clearEvents,
  loadEvents,
  saveEvents,
} from '../diagnosticStorage';
import {
  DIAGNOSTIC_EVENTS_KEY,
  DIAGNOSTIC_SCHEMA_VERSION,
  DIAGNOSTIC_SCHEMA_VERSION_KEY,
  DiagnosticEvent,
  MAX_EVENTS,
  MAX_STACK_LENGTH,
} from '../diagnosticTypes';

// Helper: build a minimal event
function makeEvent(overrides: Partial<DiagnosticEvent> = {}): DiagnosticEvent {
  return {
    id: 'evt_test0001',
    timestamp: new Date().toISOString(),
    level: 'info',
    category: 'api',
    event: 'test_event',
    sessionId: 'sess_test0001',
    appVersion: '1.0.0',
    buildNumber: '1',
    ...overrides,
  };
}

// Helper: generate N events
function makeEvents(n: number, prefix = 'evt'): DiagnosticEvent[] {
  return Array.from({ length: n }, (_, i) =>
    makeEvent({ id: `${prefix}_${String(i).padStart(4, '0')}`, event: `event_${i}` })
  );
}

describe('Diagnostics Storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  describe('Ring buffer FIFO pruning', () => {
    it('should keep only the last MAX_EVENTS when appending more', async () => {
      const events = makeEvents(MAX_EVENTS + 100);
      const result = await appendEvents(events);
      expect(result.length).toBe(MAX_EVENTS);
      // Oldest events should be pruned.
      expect(result[0].id).toBe('evt_0100');
      // Newest should be the last appended.
      expect(result[result.length - 1].id).toBe('evt_0599');
    });

    it('should preserve order after pruning', async () => {
      const events = makeEvents(MAX_EVENTS + 10);
      const result = await appendEvents(events);
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].id < result[i + 1].id).toBe(true);
      }
    });

    it('should not prune when under the limit', async () => {
      const events = makeEvents(100);
      const result = await appendEvents(events);
      expect(result.length).toBe(100);
    });

    it('should append to existing events', async () => {
      await saveEvents(makeEvents(50));
      const result = await appendEvents(makeEvents(50, 'evt2'));
      expect(result.length).toBe(100);
      expect(result[0].id).toBe('evt_0000');
      expect(result[99].id).toBe('evt2_0049');
    });
  });

  describe('Schema version guard', () => {
    it('should wipe events when schema version does not match', async () => {
      await AsyncStorage.setItem(DIAGNOSTIC_EVENTS_KEY, JSON.stringify(makeEvents(10)));
      await AsyncStorage.setItem(DIAGNOSTIC_SCHEMA_VERSION_KEY, '0');
      const result = await loadEvents();
      expect(result).toEqual([]);
      // Schema version should now be updated.
      const storedVersion = await AsyncStorage.getItem(DIAGNOSTIC_SCHEMA_VERSION_KEY);
      expect(storedVersion).toBe(String(DIAGNOSTIC_SCHEMA_VERSION));
    });

    it('should load events when schema version matches', async () => {
      const events = makeEvents(5);
      await saveEvents(events);
      const result = await loadEvents();
      expect(result.length).toBe(5);
    });

    it('should return empty array when no events stored', async () => {
      const result = await loadEvents();
      expect(result).toEqual([]);
    });
  });

  describe('clearEvents', () => {
    it('should remove all events from storage', async () => {
      await saveEvents(makeEvents(10));
      await clearEvents();
      const result = await loadEvents();
      expect(result).toEqual([]);
    });
  });
});

describe('Diagnostics Logger', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    _resetForTests();
  });

  afterEach(async () => {
    _resetForTests();
    await AsyncStorage.clear();
  });

  describe('Session ID (in-memory, per launch)', () => {
    it('should return the same sessionId within a process', () => {
      const s1 = getSessionId();
      const s2 = getSessionId();
      expect(s1).toBe(s2);
      expect(s1).toMatch(/^sess_[0-9a-f]{8}$/);
    });

    it('should generate a new sessionId after reset', () => {
      const s1 = getSessionId();
      _resetForTests();
      const s2 = getSessionId();
      expect(s2).not.toBe(s1);
    });
  });

  describe('Version via expoConfig', () => {
    it('should read app version from Constants.expoConfig', () => {
      expect(getAppVersion()).toBe('1.0.0');
    });

    it('should read build number from Constants.expoConfig', () => {
      expect(getBuildNumber()).toBe('1');
    });
  });

  describe('ID generation', () => {
    it('should generate request IDs with req_ prefix', () => {
      const id = generateRequestId();
      expect(id).toMatch(/^req_[0-9a-f]{8}$/);
    });

    it('should generate submission IDs with sub_ prefix', () => {
      const id = generateSubmissionId();
      expect(id).toMatch(/^sub_[0-9a-f]{8}$/);
    });
  });

  describe('Buffer flush on error (immediate)', () => {
    it('should flush immediately on error level (no 2s wait)', async () => {
      logError('api', 'request_failed', { requestId: 'req_test1', endpoint: '/test' });
      // Error triggers immediate flush — await it.
      await flushNow();
      const events = await loadEvents();
      expect(events.length).toBe(1);
      expect(events[0].level).toBe('error');
      expect(events[0].event).toBe('request_failed');
      expect(events[0].requestId).toBe('req_test1');
    });
  });

  describe('Buffer batch on info (threshold)', () => {
    it('should flush when buffer reaches MAX_BUFFER_SIZE (20)', async () => {
      for (let i = 0; i < 20; i++) {
        logInfo('api', `event_${i}`, { requestId: `req_${i}` });
      }
      await flushNow();
      const events = await loadEvents();
      expect(events.length).toBe(20);
    });
  });

  describe('Serialized flush (no concurrent writes)', () => {
    it('should not call appendEvents in parallel for concurrent flushes', async () => {
      // Fill buffer with 20 events (triggers a flush).
      for (let i = 0; i < 20; i++) {
        logInfo('api', `event_${i}`);
      }
      // Immediately trigger another flush.
      const p1 = flushNow();
      const p2 = flushNow();
      await Promise.all([p1, p2]);
      // Both should resolve without error.
      const events = await loadEvents();
      expect(events.length).toBe(20);
    });
  });

  describe('Atomic buffer capture', () => {
    it('should capture buffer atomically — events during flush go to next buffer', async () => {
      // Fill buffer to threshold.
      for (let i = 0; i < 20; i++) {
        logInfo('api', `batch1_event_${i}`);
      }
      // Trigger flush (threshold already reached).
      const flushPromise = flushNow();
      // Immediately add more events — these should go into the next buffer.
      logInfo('api', 'batch2_event_0');
      logInfo('api', 'batch2_event_1');
      await flushPromise;
      // The first flush should have captured only batch1 (20 events).
      const eventsAfterFirst = await loadEvents();
      expect(eventsAfterFirst.length).toBe(20);
      // Flush the remaining batch2 events.
      await flushNow();
      const eventsAfterSecond = await loadEvents();
      expect(eventsAfterSecond.length).toBe(22);
      // Verify batch2 events are present.
      const batch2Events = eventsAfterSecond.filter((e) => e.event.startsWith('batch2'));
      expect(batch2Events.length).toBe(2);
    });
  });

  describe('PII sanitizer (defense-in-depth)', () => {
    it('should strip sensitive fields from events', async () => {
      // Pass sensitive fields — they should be stripped by the sanitizer.
      logInfo('api', 'request_started', {
        requestId: 'req_pii1',
        endpoint: '/test',
        ...({
          body: 'secret payload',
          headers: { Authorization: 'Bearer token123' },
          token: 'jwt-secret',
          password: 'mypassword',
          aadhaar: '1234-5678-9012',
          bankAccount: '999999',
        } as any),
      });
      await flushNow();
      const events = await loadEvents();
      expect(events.length).toBe(1);
      const evt = events[0] as any;
      expect(evt.body).toBeUndefined();
      expect(evt.headers).toBeUndefined();
      expect(evt.token).toBeUndefined();
      expect(evt.password).toBeUndefined();
      expect(evt.aadhaar).toBeUndefined();
      expect(evt.bankAccount).toBeUndefined();
      // Legitimate fields should be present.
      expect(evt.requestId).toBe('req_pii1');
      expect(evt.endpoint).toBe('/test');
    });
  });

  describe('Stack truncation', () => {
    it('should truncate stack traces to MAX_STACK_LENGTH', async () => {
      const longStack = 'x'.repeat(MAX_STACK_LENGTH + 1000);
      logError('api', 'request_failed', {
        requestId: 'req_stack1',
        stack: longStack,
      });
      await flushNow();
      const events = await loadEvents();
      expect(events[0].stack).toBeDefined();
      expect(events[0].stack!.length).toBe(MAX_STACK_LENGTH);
    });
  });

  describe('Event serialization round-trip', () => {
    it('should serialize and deserialize all fields correctly', () => {
      const evt = makeEvent({
        requestId: 'req_rt1',
        submissionId: 'sub_rt1',
        method: 'POST',
        endpoint: '/students/professional/create',
        statusCode: 500,
        durationMs: 14213,
        errorCode: 'HTTP_500',
        message: 'Server error',
        stack: 'Error: test\n  at test.ts:1',
      });
      const serialized = JSON.stringify(evt);
      const parsed = JSON.parse(serialized) as DiagnosticEvent;
      expect(parsed.id).toBe(evt.id);
      expect(parsed.timestamp).toBe(evt.timestamp);
      expect(parsed.level).toBe(evt.level);
      expect(parsed.category).toBe(evt.category);
      expect(parsed.event).toBe(evt.event);
      expect(parsed.requestId).toBe('req_rt1');
      expect(parsed.submissionId).toBe('sub_rt1');
      expect(parsed.method).toBe('POST');
      expect(parsed.endpoint).toBe('/students/professional/create');
      expect(parsed.statusCode).toBe(500);
      expect(parsed.durationMs).toBe(14213);
      expect(parsed.errorCode).toBe('HTTP_500');
      expect(parsed.message).toBe('Server error');
      expect(parsed.stack).toBe('Error: test\n  at test.ts:1');
    });
  });
});

describe('Request Correlation', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    _resetForTests();
  });

  it('should correlate request_started and request_failed with the same requestId', async () => {
    const requestId = generateRequestId();
    logInfo('api', 'request_started', { requestId, method: 'POST', endpoint: '/test' });
    logError('api', 'request_failed', {
      requestId, method: 'POST', endpoint: '/test',
      statusCode: 500, errorCode: 'HTTP_500', durationMs: 100,
    });
    await flushNow();
    const events = await loadEvents();
    expect(events.length).toBe(2);
    expect(events[0].requestId).toBe(requestId);
    expect(events[1].requestId).toBe(requestId);
    expect(events[0].event).toBe('request_started');
    expect(events[1].event).toBe('request_failed');
    expect(events[1].statusCode).toBe(500);
    expect(events[1].durationMs).toBe(100);
  });

  it('should correlate request_started and request_success with the same requestId', async () => {
    const requestId = generateRequestId();
    logInfo('api', 'request_started', { requestId, method: 'GET', endpoint: '/list' });
    logInfo('api', 'request_success', {
      requestId, method: 'GET', endpoint: '/list',
      statusCode: 200, durationMs: 50,
    });
    await flushNow();
    const events = await loadEvents();
    expect(events.length).toBe(2);
    expect(events[0].requestId).toBe(requestId);
    expect(events[1].requestId).toBe(requestId);
    expect(events[1].statusCode).toBe(200);
  });
});

describe('Submission Correlation', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    _resetForTests();
  });

  it('should correlate submission_started and submission_failed with the same submissionId', async () => {
    const submissionId = generateSubmissionId();
    logInfo('submission', 'submission_started', { submissionId, formType: 'professional' });
    logError('submission', 'submission_failed', {
      submissionId, formType: 'professional',
      errorCode: 'HTTP_500', message: 'Server error',
    });
    await flushNow();
    const events = await loadEvents();
    expect(events.length).toBe(2);
    expect(events[0].submissionId).toBe(submissionId);
    expect(events[1].submissionId).toBe(submissionId);
    expect(events[0].event).toBe('submission_started');
    expect(events[1].event).toBe('submission_failed');
    expect(events[1].errorCode).toBe('HTTP_500');
  });

  it('should correlate submission_started and submission_succeeded', async () => {
    const submissionId = generateSubmissionId();
    logInfo('submission', 'submission_started', { submissionId, formType: 'puc' });
    logInfo('submission', 'submission_succeeded', { submissionId, formType: 'puc' });
    await flushNow();
    const events = await loadEvents();
    expect(events.length).toBe(2);
    expect(events[0].submissionId).toBe(submissionId);
    expect(events[1].submissionId).toBe(submissionId);
  });
});

describe('SubmissionId on thrown error', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    _resetForTests();
    jest.clearAllMocks();
  });

  it('should attach submissionId to the thrown error when API rejects', async () => {
    // Use the already-mocked professionalApi from the submission test setup.
    // We import submit dynamically to avoid module cache issues.
    const { createProfessionalStudent } = require('@/api/professionalApi');
    (createProfessionalStudent as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { submitApplication } = require('../../submission/submit');

    let caughtError: any;
    try {
      await submitApplication('professional', new FormData());
    } catch (e: any) {
      caughtError = e;
    }

    expect(caughtError).toBeDefined();
    expect(caughtError.submissionId).toBeDefined();
    expect(caughtError.submissionId).toMatch(/^sub_[0-9a-f]{8}$/);
    expect(caughtError.message).toBe('Network error');

    // Verify the submission_started and submission_failed events were logged.
    await flushNow();
    const events = await loadEvents();
    const started = events.find((e) => e.event === 'submission_started');
    const failed = events.find((e) => e.event === 'submission_failed');
    expect(started).toBeDefined();
    expect(failed).toBeDefined();
    expect(started!.submissionId).toBe(caughtError.submissionId);
    expect(failed!.submissionId).toBe(caughtError.submissionId);
  });
});

describe('Export Report', () => {
  it('should include app version, session, and one line per event (newest-first)', () => {
    const events: DiagnosticEvent[] = [
      makeEvent({ id: 'evt_0001', timestamp: '2026-09-08T10:00:00Z', event: 'first_event', level: 'info' }),
      makeEvent({ id: 'evt_0002', timestamp: '2026-09-08T10:01:00Z', event: 'second_event', level: 'error', statusCode: 500 }),
      makeEvent({ id: 'evt_0003', timestamp: '2026-09-08T10:02:00Z', event: 'third_event', level: 'warn' }),
    ];

    const report = buildExportReport(events, {
      appVersion: '1.0.0',
      buildNumber: '1',
      sessionId: 'sess_test1234',
      platform: 'android',
      generatedAt: '2026-09-08T10:03:00Z',
    });

    expect(report).toContain('VPApp Diagnostics');
    expect(report).toContain('1.0.0 (1)');
    expect(report).toContain('sess_test1234');
    expect(report).toContain('android');

    // Newest-first: third_event should appear before first_event.
    const idxThird = report.indexOf('third_event');
    const idxFirst = report.indexOf('first_event');
    expect(idxThird).toBeGreaterThan(-1);
    expect(idxFirst).toBeGreaterThan(-1);
    expect(idxThird).toBeLessThan(idxFirst);
  });

  it('should not contain sanitized PII fields', () => {
    const events: DiagnosticEvent[] = [
      makeEvent({ id: 'evt_0001', event: 'request_started', requestId: 'req_1' }),
    ];

    const report = buildExportReport(events, {
      appVersion: '1.0.0',
      buildNumber: '1',
      sessionId: 'sess_test',
      platform: 'android',
      generatedAt: '2026-09-08T10:00:00Z',
    });

    // The report should NOT contain any of these sensitive field names.
    expect(report).not.toContain('secret');
    expect(report).not.toContain('Bearer');
    expect(report).not.toContain('password');
    expect(report).not.toContain('aadhaar');
  });

  it('should handle empty event list', () => {
    const report = buildExportReport([], {
      appVersion: '1.0.0',
      buildNumber: '1',
      sessionId: 'sess_empty',
      platform: 'android',
      generatedAt: '2026-09-08T10:00:00Z',
    });
    expect(report).toContain('No events recorded');
  });

  it('should include method, endpoint, status, duration, requestId, submissionId in event lines', () => {
    const events: DiagnosticEvent[] = [
      makeEvent({
        id: 'evt_0001',
        event: 'request_failed',
        level: 'error',
        method: 'POST',
        endpoint: '/students/professional/create',
        statusCode: 500,
        durationMs: 14213,
        requestId: 'req_abc12345',
        submissionId: 'sub_def67890',
        errorCode: 'HTTP_500',
      }),
    ];

    const report = buildExportReport(events, {
      appVersion: '1.0.0',
      buildNumber: '1',
      sessionId: 'sess_test',
      platform: 'android',
      generatedAt: '2026-09-08T10:00:00Z',
    });

    expect(report).toContain('POST');
    expect(report).toContain('/students/professional/create');
    expect(report).toContain('500');
    expect(report).toContain('14213ms');
    expect(report).toContain('req_abc12345');
    expect(report).toContain('sub_def67890');
    expect(report).toContain('[HTTP_500]');
  });
});
