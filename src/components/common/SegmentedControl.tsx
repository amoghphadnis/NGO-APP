import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface SegmentedControlProps {
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export function SegmentedControl({ options, selectedValue, onValueChange }: SegmentedControlProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isActive = selectedValue === option;
        return (
          <TouchableOpacity
            key={option}
            style={[styles.segment, isActive ? styles.segmentActive : styles.segmentInactive]}
            onPress={() => onValueChange(option)}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, isActive ? styles.segmentTextActive : styles.segmentTextInactive]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: colors.border,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentInactive: {
    backgroundColor: colors.card,
  },
  segmentText: {
    fontSize: typography.caption,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: colors.card,
  },
  segmentTextInactive: {
    color: colors.textPrimary,
  },
});
