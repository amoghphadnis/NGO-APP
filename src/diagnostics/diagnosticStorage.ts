import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DIAGNOSTIC_EVENTS_KEY,
  DIAGNOSTIC_SCHEMA_VERSION_KEY,
  DIAGNOSTIC_SCHEMA_VERSION,
  DiagnosticEvent,
  MAX_EVENTS,
} from './diagnosticTypes';

/**
 * Read the stored schema version. Returns 0 if absent or unreadable.
 */
async function readSchemaVersion(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(DIAGNOSTIC_SCHEMA_VERSION_KEY);
    if (raw === null || raw === undefined) return 0;
    const parsed = parseInt(raw, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  } catch {
    return 0;
  }
}

/**
 * Write the current schema version.
 */
async function writeSchemaVersion(): Promise<void> {
  try {
    await AsyncStorage.setItem(
      DIAGNOSTIC_SCHEMA_VERSION_KEY,
      String(DIAGNOSTIC_SCHEMA_VERSION)
    );
  } catch {
    // Best-effort — do not crash.
  }
}

/**
 * Load all persisted diagnostic events.
 *
 * If the stored schema version does not match the current one, the store is
 * wiped and an empty array is returned. This prevents an updated app from
 * choking on an old event structure.
 */
export async function loadEvents(): Promise<DiagnosticEvent[]> {
  try {
    const storedVersion = await readSchemaVersion();
    if (storedVersion !== DIAGNOSTIC_SCHEMA_VERSION) {
      await AsyncStorage.removeItem(DIAGNOSTIC_EVENTS_KEY);
      await writeSchemaVersion();
      return [];
    }

    const raw = await AsyncStorage.getItem(DIAGNOSTIC_EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as DiagnosticEvent[];
  } catch {
    return [];
  }
}

/**
 * Persist the full event list (overwrites).
 */
export async function saveEvents(events: DiagnosticEvent[]): Promise<void> {
  try {
    await AsyncStorage.setItem(DIAGNOSTIC_EVENTS_KEY, JSON.stringify(events));
    await writeSchemaVersion();
  } catch {
    // Best-effort — do not crash the app.
  }
}

/**
 * Append new events to the persisted store, applying FIFO pruning so the
 * total never exceeds MAX_EVENTS. Returns the pruned list.
 */
export async function appendEvents(
  newEvents: DiagnosticEvent[]
): Promise<DiagnosticEvent[]> {
  if (newEvents.length === 0) return loadEvents();
  try {
    const existing = await loadEvents();
    const combined = existing.concat(newEvents);
    const pruned =
      combined.length > MAX_EVENTS
        ? combined.slice(combined.length - MAX_EVENTS)
        : combined;
    await saveEvents(pruned);
    return pruned;
  } catch {
    return [];
  }
}

/**
 * Remove all persisted diagnostic events.
 */
export async function clearEvents(): Promise<void> {
  try {
    await AsyncStorage.removeItem(DIAGNOSTIC_EVENTS_KEY);
  } catch {
    // Best-effort.
  }
}
