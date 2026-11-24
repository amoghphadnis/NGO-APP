import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';

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

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function parseLocalDate(val: string | Date | undefined | null): Date | null {
  if (!val) return null;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return null;

    // YYYY-MM-DD
    const isoMatch = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed);
    if (isoMatch) {
      const year = parseInt(isoMatch[1], 10);
      const month = parseInt(isoMatch[2], 10) - 1;
      const day = parseInt(isoMatch[3], 10);
      return new Date(year, month, day);
    }

    // DD/MM/YYYY
    const dmyMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
    if (dmyMatch) {
      const day = parseInt(dmyMatch[1], 10);
      const month = parseInt(dmyMatch[2], 10) - 1;
      const year = parseInt(dmyMatch[3], 10);
      return new Date(year, month, day);
    }

    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
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
  minimumDate = new Date(new Date().getFullYear() - 80, 0, 1),
}: VPDatePickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');

  const parsedDate = parseLocalDate(value);
  const isValid = parsedDate instanceof Date && !isNaN(parsedDate.getTime());

  // Default year for student birth dates if none is selected
  const defaultYear = new Date().getFullYear() - 16;
  const initialDate = isValid ? parsedDate : new Date(defaultYear, 0, 1);

  const [tempDate, setTempDate] = useState<Date>(initialDate);
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());
  const [manualText, setManualText] = useState<string>('');

  useEffect(() => {
    if (isValid && parsedDate) {
      setTempDate(parsedDate);
      setViewYear(parsedDate.getFullYear());
      setViewMonth(parsedDate.getMonth());
      setManualText(formatDate(parsedDate));
    }
  }, [value]);

  const commitDate = (selected: Date) => {
    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const day = String(selected.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${day}`);
  };

  const showDatePicker = () => {
    if (disabled) return;

    const base = isValid && parsedDate ? parsedDate : new Date(defaultYear, 0, 1);
    setTempDate(base);
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setManualText(isValid && parsedDate ? formatDate(parsedDate) : '');
    setViewMode('days');

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: base,
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

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    if (newDate > maximumDate || newDate < minimumDate) return;
    setTempDate(newDate);
    setManualText(formatDate(newDate));
  };

  const handleManualTextChange = (text: string) => {
    setManualText(text);
    const parsed = parseLocalDate(text);
    if (parsed && parsed >= minimumDate && parsed <= maximumDate) {
      setTempDate(parsed);
      setViewYear(parsed.getFullYear());
      setViewMonth(parsed.getMonth());
    }
  };

  const handleDone = () => {
    commitDate(tempDate);
    setShowPicker(false);
  };

  // Generate days in view month
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  // Generate years list
  const maxYear = maximumDate.getFullYear();
  const minYear = minimumDate.getFullYear();
  const yearsList: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    yearsList.push(y);
  }

  const displayValue = isValid && parsedDate ? formatDate(parsedDate) : placeholder;

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
          Boolean(error) && styles.dateInputError,
          disabled && styles.dateInputDisabled,
        ]}
        onPress={showDatePicker}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dateText,
            !isValid && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
        >
          {displayValue}
        </Text>

        <Ionicons
          name="calendar-outline"
          size={22}
          color={disabled ? colors.disabled : colors.primary}
          style={styles.calendarIcon}
        />
      </TouchableOpacity>

      {Boolean(error) ? <Text style={styles.error}>{error}</Text> : null}
      {!error && helperText ? <Text style={styles.helper}>{helperText}</Text> : null}

      {/* iOS Native Picker Modal */}
      {Platform.OS === 'ios' && (
        <Modal visible={showPicker} transparent animationType="slide">
          <View style={styles.iosModalOverlay}>
            <View style={styles.iosModalContent}>
              <View style={styles.iosModalHeader}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.actionText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    commitDate(tempDate);
                    setShowPicker(false);
                  }}
                >
                  <Text style={[styles.actionText, { color: colors.primary }]}>Done</Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(_event, date) => {
                  if (date) setTempDate(date);
                }}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                themeVariant="light"
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Web & Cross-platform Calendar Popup Window */}
      {Platform.OS !== 'android' && Platform.OS !== 'ios' && (
        <Modal
          visible={showPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPicker(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowPicker(false)}
          >
            <TouchableOpacity
              style={styles.calendarCard}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <View style={styles.calendarHeader}>
                <View>
                  <Text style={styles.calendarTitle}>{label || 'Select Date'}</Text>
                  <Text style={styles.calendarSubtitle}>
                    {tempDate ? formatDate(tempDate) : 'Choose date'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowPicker(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* View Switcher Controls */}
              <View style={styles.navRow}>
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={handlePrevMonth}
                  accessibilityLabel="Previous month"
                >
                  <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
                </TouchableOpacity>

                <View style={styles.switchersContainer}>
                  <TouchableOpacity
                    style={[
                      styles.switcherButton,
                      viewMode === 'months' && styles.switcherActive,
                    ]}
                    onPress={() => setViewMode(viewMode === 'months' ? 'days' : 'months')}
                  >
                    <Text style={styles.switcherText}>{MONTH_NAMES[viewMonth]}</Text>
                    <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.switcherButton,
                      viewMode === 'years' && styles.switcherActive,
                    ]}
                    onPress={() => setViewMode(viewMode === 'years' ? 'days' : 'years')}
                  >
                    <Text style={styles.switcherText}>{viewYear}</Text>
                    <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.navButton}
                  onPress={handleNextMonth}
                  accessibilityLabel="Next month"
                >
                  <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Month Picker View */}
              {viewMode === 'months' && (
                <View style={styles.gridContainer}>
                  {SHORT_MONTH_NAMES.map((name, index) => {
                    const isSelected = viewMonth === index;
                    return (
                      <TouchableOpacity
                        key={name}
                        style={[styles.monthCell, isSelected && styles.monthCellActive]}
                        onPress={() => {
                          setViewMonth(index);
                          setViewMode('days');
                        }}
                      >
                        <Text
                          style={[
                            styles.monthCellText,
                            isSelected && styles.monthCellTextActive,
                          ]}
                        >
                          {name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* Year Picker View */}
              {viewMode === 'years' && (
                <ScrollView style={styles.yearsScrollView} nestedScrollEnabled>
                  <View style={styles.yearsGrid}>
                    {yearsList.map((year) => {
                      const isSelected = viewYear === year;
                      return (
                        <TouchableOpacity
                          key={year}
                          style={[styles.yearCell, isSelected && styles.yearCellActive]}
                          onPress={() => {
                            setViewYear(year);
                            setViewMode('days');
                          }}
                        >
                          <Text
                            style={[
                              styles.yearCellText,
                              isSelected && styles.yearCellTextActive,
                            ]}
                          >
                            {year}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              )}

              {/* Day Calendar Grid View */}
              {viewMode === 'days' && (
                <View>
                  {/* Day Names Header */}
                  <View style={styles.dayNamesRow}>
                    {DAY_NAMES.map((day) => (
                      <Text key={day} style={styles.dayNameText}>
                        {day}
                      </Text>
                    ))}
                  </View>

                  {/* Days Matrix */}
                  <View style={styles.daysGrid}>
                    {/* Empty padding cells for start of month */}
                    {Array.from({ length: startDayOfWeek }).map((_, i) => (
                      <View key={`empty-${i}`} style={styles.dayCellEmpty} />
                    ))}

                    {/* Day numbers */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNumber = i + 1;
                      const cellDate = new Date(viewYear, viewMonth, dayNumber);
                      const isSelected =
                        tempDate.getFullYear() === viewYear &&
                        tempDate.getMonth() === viewMonth &&
                        tempDate.getDate() === dayNumber;
                      const isDisabled = cellDate > maximumDate || cellDate < minimumDate;

                      return (
                        <TouchableOpacity
                          key={`day-${dayNumber}`}
                          style={[
                            styles.dayCell,
                            isSelected && styles.dayCellActive,
                            isDisabled && styles.dayCellDisabled,
                          ]}
                          disabled={isDisabled}
                          onPress={() => handleSelectDay(dayNumber)}
                        >
                          <Text
                            style={[
                              styles.dayCellText,
                              isSelected && styles.dayCellTextActive,
                              isDisabled && styles.dayCellTextDisabled,
                            ]}
                          >
                            {dayNumber}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Manual Direct Input Row */}
              <View style={styles.manualInputContainer}>
                <Text style={styles.manualInputLabel}>Type Date (DD/MM/YYYY):</Text>
                <TextInput
                  style={styles.manualInput}
                  value={manualText}
                  onChangeText={handleManualTextChange}
                  placeholder="e.g. 15/06/2008"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numbers-and-punctuation"
                  maxLength={10}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.btn, styles.cancelBtn]}
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, styles.applyBtn]}
                  onPress={handleDone}
                >
                  <Text style={styles.applyBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
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

  // iOS Picker Styles
  iosModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  iosModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  iosModalHeader: {
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

  // Web & Cross-platform Calendar Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  calendarCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    width: '100%',
    maxWidth: 380,
    padding: spacing.lg,
    ...Platform.select({
      web: {
        boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
      },
      default: {
        elevation: 8,
      },
    }),
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  calendarTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  calendarSubtitle: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  navButton: {
    padding: spacing.xs,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  switchersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  switcherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
    gap: 4,
  },
  switcherActive: {
    backgroundColor: colors.brandTint,
  },
  switcherText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  dayNameText: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCellEmpty: {
    width: 36,
    height: 36,
    marginVertical: 2,
  },
  dayCell: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginVertical: 2,
  },
  dayCellActive: {
    backgroundColor: colors.primary,
  },
  dayCellDisabled: {
    opacity: 0.3,
  },
  dayCellText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  dayCellTextActive: {
    color: colors.card,
    fontWeight: '700',
  },
  dayCellTextDisabled: {
    color: colors.disabled,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    gap: 8,
  },
  monthCell: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  monthCellActive: {
    backgroundColor: colors.primary,
  },
  monthCellText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  monthCellTextActive: {
    color: colors.card,
  },
  yearsScrollView: {
    maxHeight: 220,
    marginVertical: spacing.xs,
  },
  yearsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  yearCell: {
    width: '30%',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  yearCellActive: {
    backgroundColor: colors.primary,
  },
  yearCellText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  yearCellTextActive: {
    color: colors.card,
  },
  manualInputContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  manualInputLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  manualInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: spacing.md,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: colors.background,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  applyBtn: {
    backgroundColor: colors.primary,
  },
  applyBtnText: {
    color: colors.card,
    fontWeight: '600',
    fontSize: 14,
  },
});
