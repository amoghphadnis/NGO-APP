import { ActivityIndicator, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export default function Button({ title, onPress, disabled, loading, style }: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[styles.button, style, isDisabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: typography.body,
  },
});
