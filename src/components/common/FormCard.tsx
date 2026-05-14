import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface FormCardProps {
  children: React.ReactNode;
  style?: any;
}

export default function FormCard({ children, style }: FormCardProps) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: spacing.form.borderRadius,
    padding: spacing.form.cardPadding,
    marginBottom: spacing.form.sectionSpacing,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
