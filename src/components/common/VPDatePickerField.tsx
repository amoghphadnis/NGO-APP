import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';

interface VPDatePickerFieldProps {
  label?: string;
  value?: Date | string;
  onChange: (date: Date | string) => void;
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
  placeholder = 'dd/mm/yyyy',
  error,
  helperText,
  required,
  disabled,
  maximumDate = new Date(), // Prevent future dates by default
  minimumDate = new Date(new Date().getFullYear() - 80, 0, 1), // Start from 80 years ago (reasonable birth year range)
}: VPDatePickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false);
  // Convert string to Date if needed
  const dateValue = typeof value === 'string' ? new Date(value) : value;

  // Check if date is valid
  const isValidDate = (date: Date | null | undefined): date is Date => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  // Temporary date state for picker
  const [tempDate, setTempDate] = useState<Date>(
    isValidDate(dateValue) ? dateValue : new Date()
  )


  // Format date as DD/MM/YYYY
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (
    event: any,
    selectedDate?: Date
  ) => {
    if (!selectedDate) return;

    // iOS only — Android uses the imperative DateTimePickerAndroid API.
    setTempDate(selectedDate);
  };

  const commitDate = (selected: Date) => {
    // Convert Date to YYYY-MM-DD string for schema compatibility
    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const day = String(selected.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${day}`);
  };

  const showDatePicker = () => {
    if (disabled) return;

    const initial = isValidDate(dateValue) ? dateValue : new Date();
    setTempDate(initial);

    if (Platform.OS === 'android') {
      // Imperative API (v9): avoids the deprecated `onChange` prop and uses the
      // spinner display, whose year wheel is fully touch-scrollable.
      DateTimePickerAndroid.open({
        value: initial,
        mode: 'date',
        display: 'spinner',
        minimumDate,
        maximumDate,
        onValueChange: (_event, date) => {
          if (date) {
            commitDate(date);
          }
        },
        onDismiss: () => {},
      });
    } else {
      setShowPicker(true);
    }
  };

  const displayValue = isValidDate(dateValue) ? formatDate(dateValue) : placeholder;

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
            !isValidDate(dateValue) && styles.placeholderText,
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

      {Platform.OS === 'ios' && (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={styles.actionText}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    // Convert Date to YYYY-MM-DD string for schema compatibility
                    const year = tempDate.getFullYear();
                    const month = String(tempDate.getMonth() + 1).padStart(2, '0');
                    const day = String(tempDate.getDate()).padStart(2, '0');
                    onChange(`${year}-${month}-${day}`);
                    setShowPicker(false);
                  }}
                >
                  <Text style={styles.actionText}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                themeVariant="light"
              />
            </View>
          </View>
        </Modal>
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
  modalOverlay: {
  flex: 1,
  justifyContent: 'flex-end',
  backgroundColor: 'rgba(0,0,0,0.3)',
},

modalContent: {
  backgroundColor: 'white',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingBottom: 30,
},

modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},

actionText: {
  fontSize: 16,
  fontWeight: '600',
},
});
