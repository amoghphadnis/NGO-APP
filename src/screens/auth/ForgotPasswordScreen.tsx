import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import VPInputField from '@/components/common/VPInputField';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { registrationApi } from '@/api/registrationApi';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validate = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setEmailError('');
    setErrorMessage('');
    setSuccessMessage('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await registrationApi.forgotPassword({ Email: email.trim() });
      if (response.Success) {
        setSuccessMessage(response.Message || 'Email verified successfully. You can now reset your password.');
        setTimeout(() => {
          (router.push as any)({ pathname: '/reset-password', params: { email: email.trim() } });
        }, 1200);
      } else {
        setErrorMessage(response.Message || 'Email verification failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to verify email. Please try again.');
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
            <Ionicons name="lock-open-outline" size={24} color="#FFFFFF" style={styles.headerIcon} />
            <Text style={styles.headerTitle}>Forgot Password</Text>
          </View>

          {/* Card Body */}
          <View style={styles.cardBody}>
            <Text style={styles.instructionText}>
              Enter your registered email address and we'll verify your account.
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

            <VPInputField
              label="Enter Registered Email"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setEmailError('');
              }}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textSecondary} />}
              error={emailError}
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
                <Text style={styles.submitButtonText}>Verify Email</Text>
              )}
            </TouchableOpacity>

            {/* Links */}
            <View style={styles.linksContainer}>
              <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text style={styles.backToLoginLink}>Back to Login</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/register' as any)}>
                <Text style={styles.registerLink}>New user? Register here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    backgroundColor: colors.primary,
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
    backgroundColor: colors.primary,
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
  linksContainer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  backToLoginLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  registerLink: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
