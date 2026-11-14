/**
 * Mounts once in the root layout and shows the update dialog when the
 * installed version is older than the version published on the Play Store.
 * Renders nothing otherwise. "Later" dismisses until the next cold start.
 */

import Constants from 'expo-constants';
import { useEffect, useState } from 'react';

import AppUpdateDialog from '@/components/common/AppUpdateDialog';
import { AppUpdateInfo, checkForAppUpdate } from '@/services/appUpdate';

// Give the animated splash (~2-4s) time to finish before a modal can cover it.
const PROMPT_DELAY_MS = 4000;

// Once-per-cold-start guard, survives remounts of the gate itself.
let hasCheckedThisSession = false;

export default function AppUpdateGate() {
  const [update, setUpdate] = useState<AppUpdateInfo | null>(null);

  useEffect(() => {
    if (hasCheckedThisSession) return;
    hasCheckedThisSession = true;

    let cancelled = false;
    const mountedAt = Date.now();

    checkForAppUpdate().then((info) => {
      if (cancelled || !info) return;
      const remainingDelay = Math.max(0, PROMPT_DELAY_MS - (Date.now() - mountedAt));
      setTimeout(() => {
        if (!cancelled) setUpdate(info);
      }, remainingDelay);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!update) return null;

  return (
    <AppUpdateDialog
      visible={true}
      currentVersion={Constants.expoConfig?.version ?? ''}
      latestVersion={update.latestVersion}
      onLater={() => setUpdate(null)}
    />
  );
}
