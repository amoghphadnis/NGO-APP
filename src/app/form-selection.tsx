import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

export default function FormSelectionScreen() {
  const router = useRouter();

  const handleFormSelect = (formType: 'professional' | 'puc' | 'payana' | 'semiProfessional') => {
    // Navigate to form-engine route with form type parameter
    (router.push as any)(`/form-engine?formType=${formType}`);
  };

  const handleRenewalPUC = () => {
    (router.push as any)('/renewal-puc');
  };

  const handleRenewalProfessional = () => {
    (router.push as any)('/renewal-professional');
  };

  const handleRenewalPayana = () => {
    (router.push as any)('/renewal-payana');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Select Scholarship Type</Text>
            <Text style={styles.subtitle}>
              Choose the scholarship application you want to apply for
            </Text>
          </View>
          <TouchableOpacity
            style={styles.volunteerLoginButton}
            onPress={() => (router.push as any)('/login')}
            activeOpacity={0.8}
          >
            <Ionicons name="log-in-outline" size={20} color={colors.card} />
            <Text style={styles.volunteerLoginText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Form Options */}
        <View style={styles.optionsContainer}>
          {/* Professional Scholarship */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleFormSelect('professional')}
            activeOpacity={0.8}
          >
            <View style={styles.optionHeader}>
              <Ionicons name="briefcase" size={32} color={colors.primary} />
              <Text style={styles.optionTitle}>Professional Student</Text>
            </View>
            <Text style={styles.optionDescription}>
              For students pursuing professional courses like Engineering, Medicine, Architecture, etc.
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• Higher scholarship amounts</Text>
              <Text style={styles.featureItem}>• Merit-based selection</Text>
              <Text style={styles.featureItem}>• Professional course verification</Text>
            </View>
          </TouchableOpacity>

          {/* PUC Scholarship */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleFormSelect('puc')}
            activeOpacity={0.8}
          >
            <View style={styles.optionHeader}>
              <Ionicons name="school" size={32} color={colors.primary} />
              <Text style={styles.optionTitle}>PUC-I Students 2025-26</Text>
            </View>
            <Text style={styles.optionDescription}>
              For students in Pre-University College (11th & 12th grade)
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• Foundation scholarship</Text>
              <Text style={styles.featureItem}>• Academic performance based</Text>
              <Text style={styles.featureItem}>• Stream-specific benefits</Text>
            </View>
          </TouchableOpacity>

          {/* Semi Professional Scholarship */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleFormSelect('semiProfessional')}
            activeOpacity={0.8}
          >
            <View style={styles.optionHeader}>
              <Ionicons name="construct" size={32} color={colors.primary} />
              <Text style={styles.optionTitle}>Semi Professional Student 2025-26</Text>
            </View>
            <Text style={styles.optionDescription}>
              For students pursuing semi-professional courses like Diploma, ITI, Nursing, Pharmacy, etc.
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• Diploma & ITI courses</Text>
              <Text style={styles.featureItem}>• Need-based scholarship</Text>
              <Text style={styles.featureItem}>• Document verification required</Text>
            </View>
          </TouchableOpacity>

          {/* Payana Scholarship */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleFormSelect('payana')}
            activeOpacity={0.8}
          >
            <View style={styles.optionHeader}>
              <Ionicons name="star" size={32} color={colors.primary} />
              <Text style={styles.optionTitle}>Payana New Student 2025-26</Text>
            </View>
            <Text style={styles.optionDescription}>
              For new students applying for Payana financial assistance program
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• Financial assistance program</Text>
              <Text style={styles.featureItem}>• Need-based selection</Text>
              <Text style={styles.featureItem}>• Complete documentation required</Text>
            </View>
          </TouchableOpacity>

          {/* Renewal PUC */}
          <TouchableOpacity
            style={[styles.optionCard, styles.renewalCard]}
            onPress={handleRenewalPUC}
            activeOpacity={0.8}
          >
            <View style={styles.optionHeader}>
              <Ionicons name="refresh-circle" size={32} color={colors.success} />
              <Text style={[styles.optionTitle, styles.renewalTitle]}>Renewal PUC 2025-26</Text>
            </View>
            <Text style={styles.optionDescription}>
              For existing Vidya Poshak scholars renewing their PUC scholarship for 2025-26
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• Existing VP scholars only</Text>
              <Text style={styles.featureItem}>• Use your VP ID to renew</Text>
              <Text style={styles.featureItem}>• Updated academic results required</Text>
            </View>
          </TouchableOpacity>

          {/* Renewal Professional */}
          <TouchableOpacity
            style={[styles.optionCard, styles.renewalCard]}
            onPress={handleRenewalProfessional}
            activeOpacity={0.8}
          >
            <View style={styles.optionHeader}>
              <Ionicons name="refresh-circle" size={32} color={colors.success} />
              <Text style={[styles.optionTitle, styles.renewalTitle]}>
                Renewal Professional 2025-26
              </Text>
            </View>
            <Text style={styles.optionDescription}>
              For existing VP scholars in professional courses renewing for 2025-26
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• Engineering, Medicine, Architecture etc.</Text>
              <Text style={styles.featureItem}>• Document uploads required</Text>
              <Text style={styles.featureItem}>• Use your VP ID to renew</Text>
            </View>
          </TouchableOpacity>

          {/* Renewal Payana */}
          <TouchableOpacity
            style={[styles.optionCard, styles.renewalCard]}
            onPress={handleRenewalPayana}
            activeOpacity={0.8}
          >
            <View style={styles.optionHeader}>
              <Ionicons name="refresh-circle" size={32} color={colors.success} />
              <Text style={[styles.optionTitle, styles.renewalTitle]}>
                Renewal Payana 2025-26
              </Text>
            </View>
            <Text style={styles.optionDescription}>
              For existing Payana scholars renewing their financial assistance for 2025-26
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• Payana scholars only</Text>
              <Text style={styles.featureItem}>• Use your Payana ID to renew</Text>
              <Text style={styles.featureItem}>• Document uploads required</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            Not sure which scholarship to apply for? Contact our support team for guidance.
          </Text>
          <TouchableOpacity style={styles.helpButton} activeOpacity={0.8}>
            <Ionicons name="help-circle" size={20} color={colors.primary} />
            <Text style={styles.helpButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkMode,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: platform.normalize.fontSize.h1,
    lineHeight: platform.normalize.lineHeight.h1,
    color: colors.textTitle,
    fontWeight: '700',
    textAlign: 'left',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSubtitle,
    textAlign: 'left',
  },
  optionsContainer: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  optionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  optionTitle: {
    fontSize: platform.normalize.fontSize.h2,
    lineHeight: platform.normalize.lineHeight.h2,
    color: colors.textPrimary,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  optionDescription: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textAlign: 'justify',
  },
  featuresList: {
    gap: spacing.xs,
  },
  featureItem: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
  },
  volunteerLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  volunteerLoginText: {
    color: colors.card,
    fontWeight: '600',
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
  },
  helpSection: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  helpTitle: {
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  helpText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  helpButtonText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
  renewalCard: {
    borderColor: colors.success,
    borderWidth: 1.5,
  },
  renewalTitle: {
    color: colors.success,
  },
});
