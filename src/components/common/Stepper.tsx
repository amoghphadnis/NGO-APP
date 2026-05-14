import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';

interface StepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  icon?: keyof typeof Ionicons.glyphMap;
  label?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  onIncrement,
  onDecrement,
  min = 1,
  max = 15,
  icon = 'people',
  label,
}) => {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      
      <View style={styles.stepperContainer}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={24} 
            color={colors.textSecondary} 
            style={styles.icon}
          />
        )}
        
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.decrementButton,
              !canDecrement && styles.buttonDisabled,
            ]}
            onPress={canDecrement ? onDecrement : undefined}
            disabled={!canDecrement}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel="Decrease value"
            accessibilityRole="button"
          >
            <Text style={[
              styles.buttonText,
              !canDecrement && styles.buttonTextDisabled
            ]}>
              −
            </Text>
          </TouchableOpacity>
          
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{value}</Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.button,
              styles.incrementButton,
              !canIncrement && styles.buttonDisabled,
            ]}
            onPress={canIncrement ? onIncrement : undefined}
            disabled={!canIncrement}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel="Increase value"
            accessibilityRole="button"
          >
            <Text style={[
              styles.buttonText,
              !canIncrement && styles.buttonTextDisabled
            ]}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: platform.spacing.fieldSpacing,
  },
  label: {
    marginBottom: platform.spacing.labelSpacing,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: platform.spacing.fieldSpacing,
  },
  segmentedControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: platform.touchTarget.buttonHeight,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  button: {
    minHeight: platform.touchTarget.buttonHeight,
    minWidth: platform.touchTarget.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  decrementButton: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  incrementButton: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: platform.normalize.fontSize.h2,
    lineHeight: platform.normalize.lineHeight.h2,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  buttonTextDisabled: {
    color: colors.disabled,
  },
  valueContainer: {
    minWidth: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: platform.spacing.fieldSpacing,
  },
  value: {
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});