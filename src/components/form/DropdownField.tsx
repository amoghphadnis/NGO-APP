import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Ionicons } from '@expo/vector-icons';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownFieldProps {
  label?: string;
  value?: string;
  placeholder?: string;
  options: DropdownOption[];
  onValueChange: (value: string) => void;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  success?: boolean;
  successText?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
}

export const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  value,
  placeholder,
  options,
  onValueChange,
  leftIcon,
  helperText,
  success,
  successText,
  error,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (option: DropdownOption) => {
    onValueChange(option.value);
    setModalVisible(false);
  };

  const borderColor = error
    ? colors.error
    : successText
    ? colors.success
    : colors.border;

  return (
    <View style={[styles.container, { marginBottom: spacing.md }]}>
      {label && (
        <Text style={[styles.label]}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        style={[
          styles.inputContainer,
          {
            borderColor,
            borderWidth: 1,
            borderRadius: 8,
            padding: spacing.md,
            backgroundColor: disabled ? colors.disabled : colors.card,
          },
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <View style={styles.inputContent}>
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={20}
              color={colors.textSecondary}
              style={{ marginRight: spacing.sm }}
            />
          )}
          <Text
            style={[
              styles.inputText,
            ]}
          >
            {selectedOption ? selectedOption.label : placeholder || 'Select...'}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={colors.textSecondary}
          />
        </View>
      </TouchableOpacity>
      {successText && (
        <View style={styles.helperContainer}>
          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          <Text
            style={[
              styles.successText,
            ]}
          >
            {successText}
          </Text>
        </View>
      )}
      {helperText && !successText && (
        <Text
          style={[
            styles.helper,
          ]}
        >
          {helperText}
        </Text>
      )}
      {error && (
        <Text
          style={[
            styles.error,
          ]}
        >
          {error}
        </Text>
      )}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: spacing.lg,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    {
                      padding: spacing.md,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    },
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  inputContainer: {
    minHeight: 48,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '60%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  label: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  helper: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: typography.caption,
  },
  error: {
    marginTop: spacing.xs,
    color: colors.error,
    fontSize: typography.caption,
  },
  inputText: {
    flex: 1,
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  successText: {
    fontSize: typography.caption,
    color: colors.success,
    marginLeft: spacing.xs,
  },
  optionText: {
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  option: {},
});