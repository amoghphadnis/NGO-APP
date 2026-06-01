import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

export default function FormSelectionScreen() {
  const router = useRouter();

  const handleFormSelect = (formType: 'professional' | 'puc') => {
    // Navigate to form-engine route with form type parameter
    (router.push as any)(`/form-engine?formType=${formType}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Scholarship Type</Text>
          <Text style={styles.subtitle}>
            Choose the scholarship application you want to apply for
          </Text>
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
        </View>

        {/* Volunteer Login */}
        <TouchableOpacity
          style={styles.volunteerLoginButton}
          onPress={() => (router.push as any)('/login')}
          activeOpacity={0.8}
        >
          <Ionicons name="log-in-outline" size={20} color={colors.card} />
          <Text style={styles.volunteerLoginText}>Volunteer Login</Text>
        </TouchableOpacity>

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
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: platform.normalize.fontSize.h1,
    lineHeight: platform.normalize.lineHeight.h1,
    color: colors.textTitle,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSubtitle,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
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
});
