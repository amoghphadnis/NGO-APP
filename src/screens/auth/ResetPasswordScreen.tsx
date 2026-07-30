import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { registrationApi } from '@/api/registrationApi';
import AppFooter from '@/components/common/AppFooter';
import VPInputField from '@/components/common/VPInputField';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validate = (): boolean => {
    let valid = true;
    if (!newPassword.trim()) {
      setPasswordError('New password is required');
      valid = false;
    } else if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }
    if (!confirmPassword.trim()) {
      setConfirmError('Please confirm your password');
      valid = false;
    } else if (newPassword !== confirmPassword) {
      setConfirmError('Passwords do not match');
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async () => {
    setPasswordError('');
    setConfirmError('');
    setErrorMessage('');
    setSuccessMessage('');

    if (!validate()) return;
    if (!email) {
      setErrorMessage('Email not found. Please go back to Forgot Password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await registrationApi.resetPassword({
        Email: email,
        NewPassword: newPassword,
      });
      if (response.Success) {
        setSuccessMessage(response.Message || 'Password updated successfully! You can now login.');
        setTimeout(() => {
          router.replace('/login');
        }, 1500);
      } else {
        setErrorMessage(response.Message || 'Failed to update password. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <Ionicons name="key-outline" size={24} color="#FFFFFF" style={styles.headerIcon} />
            <Text style={styles.headerTitle}>Reset Password</Text>
          </View>

          {/* Card Body */}
          <View style={styles.cardBody}>
            {email ? (
              <View style={styles.emailBadge}>
                <Ionicons name="mail-outline" size={16} color={colors.primary} />
                <Text style={styles.emailBadgeText}>{email}</Text>
              </View>
            ) : null}

            <Text style={styles.instructionText}>
              Enter your new password below.
            </Text>

            {/* Success Banner */}
            {successMessage ? (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            {/* Error Banner */}
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={20} color={colors.error} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* New Password */}
            <VPInputField
              label="New Password"
              value={newPassword}
              onChangeText={(t) => {
                setNewPassword(t);
                setPasswordError('');
              }}
              placeholder="Enter new password"
              secureTextEntry={!showPassword}
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              }
              error={passwordError}
              required
            />

            {/* Confirm Password */}
            <VPInputField
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(t) => {
                setConfirmPassword(t);
                setConfirmError('');
              }}
              placeholder="Re-enter new password"
              secureTextEntry={!showConfirm}
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Ionicons
                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              }
              error={confirmError}
              required
            />

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Update Password</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backLinkContainer}
              onPress={() => router.replace('/login')}
            >
              <Ionicons name="arrow-back" size={16} color={colors.primary} />
              <Text style={styles.backLink}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
        <AppFooter />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    backgroundColor: '#16A34A',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardBody: {
    padding: spacing.lg,
  },
  emailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
    gap: spacing.xs,
    alignSelf: 'center',
  },
  emailBadgeText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  instructionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
    textAlign: 'center',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    padding: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  successText: {
    flex: 1,
    fontSize: 13,
    color: colors.success,
    fontWeight: '500',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: colors.error,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#16A34A',
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  backLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
