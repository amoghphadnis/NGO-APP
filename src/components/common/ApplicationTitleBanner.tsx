import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getFormConfig } from '@/forms/shared/registry';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';

/**
 * Displays the full application title (e.g. "Vidya Poshak Financial
 * Assistance Application form for ...") at the top of a form screen,
 * matching the page heading shown on the web application forms.
 */
export default function ApplicationTitleBanner() {
  const currentFormType = useFormEngineStore((s) => s.currentFormType);
  if (!currentFormType) return null;

  let title: string;
  try {
    title = getFormConfig(currentFormType).title;
  } catch {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  title: {
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    color: colors.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
});
