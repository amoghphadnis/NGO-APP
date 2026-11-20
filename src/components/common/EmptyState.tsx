import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import BrandLogo from '@/components/common/BrandLogo';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';

interface EmptyStateProps {
  /** Ionicons glyph name for the icon well. Ignored when showLogo is set. */
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  /** Render the Vidya Poshak logo instead of an icon. */
  showLogo?: boolean;
  title: string;
  subtitle?: string;
  /** Optional action area — e.g. a retry button. */
  children?: React.ReactNode;
}

export default function EmptyState({
  icon,
  showLogo = false,
  title,
  subtitle,
  children,
}: EmptyStateProps) {
  const iconName = icon ?? 'document-outline';

  return (
    <View style={styles.container}>
      {showLogo ? (
        <BrandLogo size={48} />
      ) : (
        <View style={styles.iconWell}>
          <Ionicons name={iconName} size={28} color={colors.primary} />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  iconWell: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.brandTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    color: colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },
});
