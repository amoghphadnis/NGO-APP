import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

export default function NotificationsScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Notifications</Text>
      </View>
      <View style={styles.body}>
        <Ionicons name="notifications-off-outline" size={56} color={colors.primary} />
        <Text style={styles.heading}>No Notifications</Text>
        <Text style={styles.sub}>You're all caught up! New notifications will appear here.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 52,
    gap: spacing.sm,
  },
  backButton: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: {
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  heading: {
    fontSize: platform.normalize.fontSize.h2,
    lineHeight: platform.normalize.lineHeight.h2,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  sub: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
