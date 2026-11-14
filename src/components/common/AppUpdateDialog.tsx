import React from 'react';
import {
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { MARKET_URL, PLAY_STORE_URL } from '@/services/appUpdate';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface AppUpdateDialogProps {
  visible: boolean;
  currentVersion: string;
  latestVersion: string;
  onLater: () => void;
}

export default function AppUpdateDialog({
  visible,
  currentVersion,
  latestVersion,
  onLater,
}: AppUpdateDialogProps) {
  const openStore = async () => {
    try {
      await Linking.openURL(MARKET_URL);
    } catch {
      try {
        await Linking.openURL(PLAY_STORE_URL);
      } catch {
        // Nowhere to send the user — just dismiss.
      }
    }
    onLater();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onLater}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconWell}>
            <Ionicons name="cloud-download-outline" size={32} color={colors.primary} />
          </View>

          <Text style={styles.title}>Update Available</Text>
          <Text style={styles.message}>
            A new version of Vidya Poshak ({latestVersion}) is available. You are
            using {currentVersion}. Update for the latest features and fixes.
          </Text>

          <TouchableOpacity
            style={styles.updateButton}
            onPress={openStore}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Update app on Play Store"
          >
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.laterButton}
            onPress={onLater}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Remind me later"
          >
            <Text style={styles.laterButtonText}>Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconWell: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.brandTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.h2,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  updateButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md - 2,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: spacing.sm,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '700',
  },
  laterButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  laterButtonText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    fontWeight: '600',
  },
});
