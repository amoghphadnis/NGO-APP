import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Linking,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { registrationApi } from '@/api/registrationApi';
import ModalSelectField from '@/components/common/ModalSelectField';
import VPInputField from '@/components/common/VPInputField';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const PRIVACY_TERMS_PDF_URL = 'https://vpwebservices.testserver.envisage-workflow.in/PrivacyAndTerms.pdf';

const ROLES = [
  'Admin',
  'Employee',
  'Branch Executives',
  'Program Manager',
  'Account Manager',
  'Admin(CEO)',
  'Resource Modulization',
  'Volunteer',
];

const ROLE_OPTIONS = ROLES.map((r) => ({ label: r, value: r }));

const DISTRICTS = [
  { label: 'Dharwad', value: 1 },
  { label: 'Gadag', value: 2 },
  { label: 'Belagavi', value: 3 },
  { label: 'Koppal', value: 4 },
  { label: 'Bagalkot', value: 5 },
  { label: 'Vijaypura', value: 6 },
  { label: 'Uttarakannada', value: 7 },
  { label: 'Shimogga', value: 8 },
  { label: 'Davangere', value: 9 },
  { label: 'Haveri', value: 10 },
];

const DISTRICT_SCOPED_ROLES = ['Volunteer', 'Branch Executives', 'Employee'];

function isDistrictScoped(role: string): boolean {
  return DISTRICT_SCOPED_ROLES.includes(role);
}

export default function RegisterScreen() {
  const router = useRouter();

  const [role, setRole] = useState('');
  const [districtID, setDistrictID] = useState<number | undefined>(undefined);
  const [taluk, setTaluk] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!registered) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    const redirect = setTimeout(() => {
      router.replace('/login');
    }, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(redirect);
    };
  }, [registered]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const showDistrict = isDistrictScoped(role);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!role) newErrors.role = 'Role is required';
    if (showDistrict && !districtID) newErrors.districtID = 'District is required';
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    setErrorMessage('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload: any = {
        Role: role,
        Name: name,
        Email: email,
        Password: password,
        Mobile: mobile,
        Address: address,
      };
      if (showDistrict && districtID) {
        payload.DistrictID = districtID;
        payload.Taluk = taluk;
      }

      const response = await registrationApi.register(payload);
      if (response.Success) {
        setRegistered(true);
      } else {
        setErrorMessage(response.Message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    registrationApi.openGoogleLogin();
  };

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Full-screen success page
  if (registered) {
    return (
      <View style={styles.successScreen}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={styles.successIconWrap}>
          <Ionicons name="checkmark-circle" size={88} color="#FFFFFF" />
        </View>
        <Text style={styles.successTitle}>Registration Successful!</Text>
        <Text style={styles.successBody}>
          Your account has been created.{'\n'}Welcome to Vidya Poshak.
        </Text>
        <View style={styles.countdownBadge}>
          <Text style={styles.countdownText}>
            Redirecting to Login in{' '}
            <Text style={styles.countdownNumber}>{countdown}s</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={styles.goLoginButton}
          onPress={() => router.replace('/login')}
          activeOpacity={0.8}
        >
          <Text style={styles.goLoginText}>Go to Login now</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Image
              source={require('@/assets/Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          {/* <Text style={styles.orgName}>VIDYA POSHAK</Text>
          <Text style={styles.heroSubtitle}>Create your account</Text> */}
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Register</Text>
          <Text style={styles.formSubtitle}>Fill in your details to get started</Text>

          {/* Error Banner */}
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color={colors.error} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Role */}
          <ModalSelectField
            label="Role"
            placeholder="Select your role"
            value={role}
            options={ROLE_OPTIONS}
            onChange={(val) => {
              setRole(val);
              setDistrictID(undefined);
              setTaluk('');
              clearFieldError('role');
            }}
            error={errors.role}
            required
            modalTitle="Select Role"
          />

          {/* District (conditional) */}
          {showDistrict && (
            <ModalSelectField
              label="District"
              placeholder="Select your district"
              value={districtID}
              options={DISTRICTS}
              onChange={(val) => {
                setDistrictID(val);
                clearFieldError('districtID');
              }}
              error={errors.districtID}
              required
              modalTitle="Select District"
            />
          )}

          {/* Taluk (conditional) */}
          {showDistrict && (
            <VPInputField
              label="Taluk"
              value={taluk}
              onChangeText={(t) => { setTaluk(t); clearFieldError('taluk'); }}
              placeholder="Enter taluk"
              leftIcon={<Ionicons name="location-outline" size={18} color={colors.textSecondary} />}
              error={errors.taluk}
            />
          )}

          {/* Name */}
          <VPInputField
            label="Full Name"
            value={name}
            onChangeText={(t) => { setName(t); clearFieldError('name'); }}
            placeholder="Enter your full name"
            leftIcon={<Ionicons name="person-outline" size={18} color={colors.textSecondary} />}
            error={errors.name}
            required
          />

          {/* Email */}
          <VPInputField
            label="Email Address"
            value={email}
            onChangeText={(t) => { setEmail(t); clearFieldError('email'); }}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textSecondary} />}
            error={errors.email}
            required
          />

          {/* Password */}
          <VPInputField
            label="Password"
            value={password}
            onChangeText={(t) => { setPassword(t); clearFieldError('password'); }}
            placeholder="Create a password (min 6 chars)"
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
            error={errors.password}
            required
          />

          {/* Mobile */}
          <VPInputField
            label="Mobile Number"
            value={mobile}
            onChangeText={(t) => { setMobile(t); clearFieldError('mobile'); }}
            placeholder="10-digit mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            leftIcon={<Ionicons name="call-outline" size={18} color={colors.textSecondary} />}
            error={errors.mobile}
            required
          />

          {/* Address */}
          <VPInputField
            label="Address"
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address (optional)"
            leftIcon={<Ionicons name="home-outline" size={18} color={colors.textSecondary} />}
          />

          {/* Terms & Conditions Checkbox */}
          <TouchableOpacity
            style={styles.termsCheckboxRow}
            onPress={() => setTermsAccepted(!termsAccepted)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
              {termsAccepted && (
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.termsCheckboxText}>
              I accept the{' '}
              <Text
                style={styles.termsLink}
                onPress={() => Linking.openURL(PRIVACY_TERMS_PDF_URL).catch(() => {})}
              >
                Privacy and Terms & Conditions
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, (isLoading || !termsAccepted) && styles.buttonDisabled]}
            onPress={handleRegister}
            activeOpacity={0.8}
            disabled={isLoading || !termsAccepted}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="person-add-outline" size={18} color="#FFFFFF" style={styles.btnIcon} />
                <Text style={styles.registerButtonText}>Create Account</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Login link */}
          <View style={styles.loginLinkRow}>
            <Text style={styles.loginLinkText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          {/* <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View> */}

          {/* Google Button */}
          {/* <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin} activeOpacity={0.8}>
            <Image
              source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
              style={styles.googleLogo}
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity> */}

          {/* Terms and Privacy */}
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text
              style={styles.termsLink}
              onPress={() => Linking.openURL(PRIVACY_TERMS_PDF_URL).catch(() => {})}
            >
              Privacy and Terms & Conditions
            </Text>
          </Text>

          {/* Footer */}
          <Text style={styles.footer}>© Vidya Poshak 2026</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Hero header
  hero: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 40,
    paddingHorizontal: spacing.lg,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  logo: {
    width: 150,
    height: 150,
  },
  orgName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '400',
  },

  // Form card that covers hero with rounded top
  formCard: {
    backgroundColor: '#F5F6FA',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    minHeight: 200,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  // Banners
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: spacing.md,
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
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: colors.error,
    fontWeight: '500',
  },

  // CTA button
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 14,
    minHeight: 52,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnIcon: {
    marginRight: spacing.sm,
  },

  // Terms checkbox
  termsCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  termsCheckboxText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    flexWrap: 'wrap',
    lineHeight: 20,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Links
  loginLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  loginLinkText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.sm,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Google
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#FFFFFF',
    minHeight: 52,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  googleLogo: {
    width: 20,
    height: 20,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  footer: {
    marginTop: spacing.xl,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  termsText: {
    marginTop: spacing.lg,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '500',
  },

  // Success screen
  successScreen: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  successIconWrap: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  successBody: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  countdownBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 50,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  countdownText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  countdownNumber: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  goLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 14,
    gap: spacing.sm,
  },
  goLoginText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
});
