import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, Platform } from 'react-native';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { a11yPatterns } from '@/utils/accessibility';

interface VPInputFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  successText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  maxLength?: number;
  multiline?: boolean;
  editable?: boolean;
  prefix?: string;
  suffix?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function VPInputField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  successText,
  leftIcon,
  rightIcon,
  secureTextEntry,
  keyboardType,
  maxLength,
  multiline,
  editable,
  prefix,
  suffix,
  required,
  disabled,
  ...textInputProps
}: VPInputFieldProps) {
  const hasError = !!error;
  const hasSuccess = !!successText && !hasError;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View style={[
        styles.inputContainer,
        hasError && styles.inputContainerError,
        hasSuccess && styles.inputContainerSuccess,
        disabled && styles.inputContainerDisabled,
      ]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}

        <TextInput
          value={value ?? ''}
          onChangeText={onChangeText ?? (() => {})}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          editable={!disabled && editable !== false}
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            disabled && styles.inputDisabled,
          ]}
          placeholderTextColor={colors.textSecondary}
          accessible={true}
          accessibilityLabel={label ? `${label}${required ? ', required field' : ''}${error ? `, error: ${error}` : ''}` : ''}
          accessibilityHint={`Enter ${label?.toLowerCase() || 'value'}`}
          {...Platform.select({
            android: {
              textAlignVertical: 'center' as const,
              includeFontPadding: false,
            },
          })}
          {...textInputProps}
        />

        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
        
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      {!error && helperText && <Text style={styles.helper}>{helperText}</Text>}
      {!error && successText && <Text style={styles.success}>{successText}</Text>}
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.card,
    minHeight: platform.input.minHeight,
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
  inputContainerError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  inputContainerSuccess: {
    borderColor: colors.success,
  },
  inputContainerDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },
  iconContainer: {
    paddingHorizontal: platform.input.paddingHorizontal,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: platform.touchTarget.minSize,
  },
  prefix: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    paddingHorizontal: platform.input.paddingHorizontal,
  },
  suffix: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    paddingHorizontal: platform.input.paddingHorizontal,
  },
  input: {
    flex: 1,
    paddingVertical: platform.input.paddingVertical,
    paddingHorizontal: platform.input.paddingHorizontal,
    color: colors.textPrimary,
    fontSize: platform.input.fontSize,
    lineHeight: platform.input.lineHeight,
    minHeight: platform.input.minHeight,
    ...Platform.select({
      android: {
        textAlignVertical: 'center',
        includeFontPadding: false,
      },
    }),
  },
  inputMultiline: {
    minHeight: platform.input.minHeight * 2,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    color: colors.textSecondary,
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
  success: {
    marginTop: platform.spacing.labelSpacing,
    color: colors.success,
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
  },
});
