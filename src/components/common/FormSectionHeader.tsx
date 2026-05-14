import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';

interface FormSectionHeaderProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  showRequired?: boolean;
}

export default function FormSectionHeader({
  icon,
  title,
  subtitle,
  showRequired = false,
}: FormSectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={24} 
            color={colors.primary} 
            style={styles.icon}
          />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      
      {(subtitle || showRequired) && (
        <Text style={styles.subtitle}>
          {subtitle}
          {subtitle && showRequired && ' · '}
          {showRequired && 'Fields marked with * are required'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: platform.spacing.fieldSpacing,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: platform.spacing.labelSpacing,
  },
  icon: {
    marginRight: platform.spacing.labelSpacing,
  },
  title: {
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  subtitle: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
  },
});
