import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { APP_TITLES } from '@/config/appContent';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';

interface AppFooterProps {
  compact?: boolean;
}

export default function AppFooter({ compact = false }: AppFooterProps) {
  const router = useRouter();

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      <View style={styles.divider} />
      <View style={styles.links}>
        <TouchableOpacity
          accessibilityRole="link"
          accessibilityLabel={APP_TITLES.privacyPolicy}
          onPress={() => router.push('/legal/privacy' as any)}
          hitSlop={8}
        >
          <Text style={styles.link}>{APP_TITLES.privacyPolicy}</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>•</Text>
        <TouchableOpacity
          accessibilityRole="link"
          accessibilityLabel={APP_TITLES.termsAndConditions}
          onPress={() => router.push('/legal/terms' as any)}
          hitSlop={8}
        >
          <Text style={styles.link}>{APP_TITLES.termsAndConditions}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  compactContainer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  links: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  link: {
    color: colors.primary,
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    fontWeight: '600',
  },
  separator: {
    color: colors.textSecondary,
  },
});
