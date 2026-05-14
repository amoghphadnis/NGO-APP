import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';

interface VPDatePickerFieldProps {
  label?: string;
  value?: Date | string;
  onChange: (date: Date) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
}

export default function VPDatePickerField({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  error,
  helperText,
  required,
  disabled,
  maximumDate = new Date(), // Prevent future dates by default
  minimumDate,
}: VPDatePickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false);
  
  // Convert string to Date if needed
  const dateValue = typeof value === 'string' ? new Date(value) : value;
  
  // Format date as DD/MM/YYYY
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }
  };

  const showDatePicker = () => {
    if (!disabled) {
      setShowPicker(true);
    }
  };

  const displayValue = dateValue ? formatDate(dateValue) : placeholder;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.dateInput,
          error && styles.dateInputError,
          disabled && styles.dateInputDisabled,
        ]}
        onPress={showDatePicker}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dateText,
            !dateValue && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
        >
          {displayValue}
        </Text>
        
        <Ionicons
          name="calendar-outline"
          size={24}
          color={disabled ? colors.disabled : colors.textSecondary}
          style={styles.calendarIcon}
        />
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}
      {!error && helperText && <Text style={styles.helper}>{helperText}</Text>}

      {showPicker && (
        <DateTimePicker
          value={dateValue || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          themeVariant="light"
          textColor={colors.textPrimary}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: platform.spacing.fieldSpacing,
  },
  label: {
    marginBottom: platform.spacing.labelSpacing,
    color: colors.textPrimary,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    fontWeight: '600',
  },
  required: {
    color: colors.error,
    fontWeight: '700',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.card,
    minHeight: platform.input.minHeight,
    paddingHorizontal: platform.input.paddingHorizontal,
    paddingVertical: platform.input.paddingVertical,
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
  dateInputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  dateInputDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },
  dateText: {
    flex: 1,
    fontSize: platform.input.fontSize,
    lineHeight: platform.input.lineHeight,
    color: colors.textPrimary,
    ...Platform.select({
      android: {
        textAlignVertical: 'center',
        includeFontPadding: false,
      },
    }),
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  disabledText: {
    color: colors.textSecondary,
  },
  calendarIcon: {
    marginLeft: platform.spacing.labelSpacing,
  },
  error: {
    marginTop: platform.spacing.labelSpacing,
    color: colors.error,
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
  },
  helper: {
    marginTop: platform.spacing.labelSpacing,
    color: colors.textSecondary,
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
  },
});
