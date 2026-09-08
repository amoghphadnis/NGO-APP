import { Platform, Share, Alert } from 'react-native';

import { DiagnosticEvent } from './diagnosticTypes';
import { loadEvents } from './diagnosticStorage';
import { getAppVersion, getBuildNumber, getSessionId } from './diagnosticLogger';

export interface ExportMeta {
  appVersion: string;
  buildNumber: string;
  sessionId: string;
  platform: string;
  generatedAt: string;
}

const MAX_REPORT_BYTES = 512 * 1024; // 512 KB

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  } catch {
    return iso;
  }
}

function formatEventLine(evt: DiagnosticEvent): string {
  const ts = formatTimestamp(evt.timestamp);
  const level = evt.level.toUpperCase().padEnd(5);
  const cat = evt.category.padEnd(11);
  let line = `${ts}  ${level} ${cat} ${evt.event}`;

  if (evt.method || evt.endpoint) {
    line += `  ${evt.method || ''} ${evt.endpoint || ''}`;
  }
  if (evt.statusCode !== undefined) {
    line += `  ${evt.statusCode}`;
  }
  if (evt.durationMs !== undefined) {
    line += `  ${evt.durationMs}ms`;
  }
  if (evt.requestId) {
    line += `  ${evt.requestId}`;
  }
  if (evt.submissionId) {
    line += `  ${evt.submissionId}`;
  }
  if (evt.errorCode) {
    line += `  [${evt.errorCode}]`;
  }
  if (evt.message) {
    line += `  ${evt.message}`;
  }
  return line;
}

/**
 * Build a plain-text, human-readable diagnostic report.
 *
 * Events are rendered newest-first so the most recent activity is at the top.
 * If the report would exceed 512 KB, only the last 200 events are included
 * and a truncation notice is added to the header.
 */
export function buildExportReport(
  events: DiagnosticEvent[],
  meta: ExportMeta
): string {
  const header =
    `VPApp Diagnostics\n` +
    `================\n\n` +
    `App Version: ${meta.appVersion} (${meta.buildNumber})\n` +
    `Session: ${meta.sessionId}\n` +
    `Platform: ${meta.platform}\n` +
    `Generated: ${meta.generatedAt}\n` +
    `Events: ${events.length}\n\n`;

  // Render newest-first.
  const reversed = [...events].reverse();

  let truncated = false;
  let bodyEvents = reversed;
  // Estimate size: header + lines.
  let estimatedSize = header.length;
  const lines: string[] = [];
  for (const evt of bodyEvents) {
    const line = formatEventLine(evt);
    estimatedSize += line.length + 1;
    lines.push(line);
    if (estimatedSize > MAX_REPORT_BYTES) {
      truncated = true;
      break;
    }
  }

  if (truncated) {
    // Keep only the last 200 events (most recent).
    bodyEvents = reversed.slice(0, 200);
    lines.length = 0;
    for (const evt of bodyEvents) {
      lines.push(formatEventLine(evt));
    }
  }

  const truncationNotice = truncated
    ? `\n[Report truncated to last 200 events due to size limit]\n`
    : '';

  const body = lines.length > 0
    ? `\nRecent Activity (newest first)\n${'─'.repeat(40)}\n${lines.join('\n')}\n`
    : '\nNo events recorded.\n';

  return header + truncationNotice + body;
}

/**
 * Load events from storage, build a report, and share it via the native
 * share sheet. No file I/O. No PII (events never contain PII).
 *
 * On Share.share failure, falls back to console.log + Alert.
 */
export async function exportDiagnostics(): Promise<void> {
  const events = await loadEvents();
  const meta: ExportMeta = {
    appVersion: getAppVersion(),
    buildNumber: getBuildNumber(),
    sessionId: getSessionId(),
    platform: Platform.OS,
    generatedAt: new Date().toISOString(),
  };

  const report = buildExportReport(events, meta);

  try {
    await Share.share({
      title: 'VPApp Diagnostics',
      message: report,
    });
  } catch {
    // Fallback: log to console and alert the user.
    // eslint-disable-next-line no-console
    console.log(report);
    Alert.alert(
      'Export Failed',
      'Could not open the share sheet. The diagnostic report has been logged to the console.'
    );
  }
}
