/**
 * App update check — compares the installed versionName against the version
 * published on the Play Store listing page.
 *
 * Fails closed: any network/parse problem resolves to null (no popup).
 * Android only — the store URL is Android-specific.
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { warn as logWarn, info as logInfo } from '@/diagnostics';
import { isNewerVersion } from '@/utils/appVersion';

const PACKAGE_NAME = 'com.vidyaposhak.app';
export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`;
export const MARKET_URL = `market://details?id=${PACKAGE_NAME}`;

const FETCH_TIMEOUT_MS = 10000;

// Play Store markup uses AF_initDataCallback with embedded version tuples.
// Try known patterns in priority order.
const VERSION_PATTERNS: RegExp[] = [
  /"141":\s*\[\[\["([\d.]+)"\]\]/,
  /\[\[\["(\d+(?:\.\d+)+)"\]\]/,
  /\["(\d+\.\d+\.\d+)"\]/,
  /"softwareVersion"\s*,\s*"([\d.]+)"/,
  /Current Version[\s\S]{0,200}?>([\d.]+)\s*</,
];

export interface AppUpdateInfo {
  latestVersion: string;
  storeUrl: string;
}

export async function checkForAppUpdate(): Promise<AppUpdateInfo | null> {
  if (Platform.OS !== 'android') return null;

  const installed =
    Constants.expoConfig?.version ??
    (Constants as any).manifest2?.extra?.expoClient?.version ??
    (Constants as any).manifest?.version ??
    '0.0.0';

  // Dev/testing override — set EXPO_PUBLIC_MOCK_LATEST_VERSION=9.9.9 to force the popup.
  const mock = process.env.EXPO_PUBLIC_MOCK_LATEST_VERSION;

  try {
    const latest = mock ?? (await fetchStoreVersion());
    if (!latest) return null;

    if (isNewerVersion(latest, installed)) {
      logInfo('app', 'update_available', { message: `latest=${latest} installed=${installed}` });
      return { latestVersion: latest, storeUrl: PLAY_STORE_URL };
    }
    return null;
  } catch {
    logWarn('app', 'update_check_failed', { errorCode: 'UNKNOWN_ERROR' });
    return null;
  }
}

async function fetchStoreVersion(): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  // Cache-busting parameter prevents Google Play CDN from serving stale HTML
  const storeUrl = `${PLAY_STORE_URL}&hl=en&gl=US&_ts=${Date.now()}`;

  try {
    const response = await fetch(storeUrl, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en-US',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      },
    });
    if (!response.ok) return null;

    const html = await response.text();
    for (const pattern of VERSION_PATTERNS) {
      const match = html.match(pattern);
      if (match?.[1]) return match[1];
    }
    logWarn('app', 'update_check_failed', { errorCode: 'VERSION_PARSE_FAILED' });
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
