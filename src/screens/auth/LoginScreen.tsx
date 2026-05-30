import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import VPInputField from '@/components/common/VPInputField';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const authError = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);
  const clearError = useAuthStore((state) => state.clearError);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');
    clearError();

    // Basic validation
    let hasError = false;
    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Call login API
    const success = await login({ Email: email, Password: password });
    
    if (success) {
      // Navigate to form selection screen after successful login
      router.push('/form-selection');
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
      >
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.orgName}>VIDYA POSHAK</Text>
        </View>

        {/* Title Section */}
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>
          Sign in to continue your scholarship application
        </Text>

        {/* Error Banner */}
        {authError && (
          <View style={styles.errorBanner}>
            <View style={styles.errorIconContainer}>
              <Ionicons name="alert-circle" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.errorTextContainer}>
              <Text style={styles.errorTitle}>Login Failed</Text>
              <Text style={styles.errorMessage}>{authError}</Text>
            </View>
          </View>
        )}

        {/* Credentials Card */}
        <View style={styles.card}>
          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <View style={styles.lockIconContainer}>
              <Ionicons name="lock-closed" size={16} color={colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Account Credentials</Text>
            <Text style={styles.requiredText}>* Required</Text>
          </View>

          {/* Email Field */}
          <VPInputField
            label="Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Ionicons name="mail-outline" size={20} color={colors.textSecondary} />}
            error={emailError}
            required
          />

          {/* Password Field */}
          <VPInputField
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError('');
            }}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            leftIcon={<Ionicons name="lock-closed" size={20} color={colors.textSecondary} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={passwordError ? colors.error : colors.textSecondary}
                />
              </TouchableOpacity>
            }
            error={passwordError}
            required
          />

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.loginIcon} />
                <Text style={styles.loginButtonText}>Login</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Security Note */}
        <View style={styles.securityContainer}>
          <Ionicons name="shield-checkmark" size={16} color={colors.textSecondary} />
          <Text style={styles.securityText}>
            Your data is secured with 256-bit encryption
          </Text>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Privacy */}
        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <TouchableOpacity>
            <Text style={styles.termsLink}>Terms of Service</Text>
          </TouchableOpacity>
          {' '}and{' '}
          <TouchableOpacity>
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </TouchableOpacity>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.md,
  },
  orgName: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 1,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    width: '100%',
  },
  errorIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  errorTextContainer: {
    flex: 1,
  },
  errorTitle: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.error,
    marginBottom: 2,
  },
  errorMessage: {
    fontSize: typography.caption || 12,
    color: colors.error,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lockIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  requiredText: {
    fontSize: typography.caption || 12,
    color: colors.textSecondary,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    minHeight: 48,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginIcon: {
    marginRight: spacing.sm,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '600',
  },
  securityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  securityText: {
    fontSize: typography.caption || 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  signUpText: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  signUpLink: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  termsText: {
    fontSize: typography.caption || 12,
    color: colors.textSecondary,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '500',
  },
});
