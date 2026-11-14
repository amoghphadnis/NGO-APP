import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import api from '@/api/client';

const PUSH_TOKEN_SENT_KEY = '@vp_push_token_sent';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function getExpoToken(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  const tokenData = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined,
  );
  return tokenData.data || null;
}

/**
 * Register the device token with the backend, skipping the network call when
 * this device has already sent its current token for this user. Best-effort —
 * never blocks login or app start.
 */
export async function syncPushToken(userId: number): Promise<void> {
  try {
    const token = await getExpoToken();
    if (!token) {
      return;
    }
    const sentKey = `${PUSH_TOKEN_SENT_KEY}:${userId}`;
    if ((await AsyncStorage.getItem(sentKey)) === token) {
      return;
    }
    await api.post('/device-tokens/register', {
      token,
      platform: Platform.OS,
    });
    await AsyncStorage.setItem(sentKey, token);
  } catch {
    // Push registration is best-effort.
  }
}

export async function unregisterPushToken(userId: number): Promise<void> {
  try {
    const sentKey = `${PUSH_TOKEN_SENT_KEY}:${userId}`;
    const token = await AsyncStorage.getItem(sentKey);
    if (token) {
      await api.post('/device-tokens/remove', { token });
    }
    await AsyncStorage.removeItem(sentKey);
  } catch {
    // Best effort — the token may no longer be valid anyway.
  }
}
