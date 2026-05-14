import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface ProgressHeaderProps {
  step: number;
  total: number;
}

export default function ProgressHeader({ step, total }: ProgressHeaderProps) {
  const percentage = (step / total) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Step {step} of {total}</Text>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    marginBottom: spacing.sm,
    color: colors.textSecondary,
    fontSize: typography.caption,
  },
  bar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});
