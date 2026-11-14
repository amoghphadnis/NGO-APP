import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import ApplicationTitleBanner from '@/components/common/ApplicationTitleBanner';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function GuidelinesSection({ navigation }: any) {
  const { updateValidationState, markStepComplete } = useFormEngineStore();
  const [accepted, setAccepted] = React.useState(false);

  const onSubmit = () => {
    updateValidationState('guidelines', { isValid: accepted, data: { accepted } });

    if (accepted) {
      markStepComplete(0);
      navigation.navigate('personal');
    }
  };

  return (
    <FormScreenLayout
      title="Application Guidelines"
      step={1}
      onBack={navigation.goBack}
      onNext={onSubmit}
      nextDisabled={!accepted}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ApplicationTitleBanner />
        <FormSectionHeader
          icon="document-text"
          title="Student Registration Form - 2026-2027"
          subtitle="Please read all instructions carefully"
          showRequired
        />

        <FormCard>
          <View style={styles.guidelineContainer}>
            <Text style={styles.guidelineTitle}>Instructions:</Text>
            <Text style={styles.guidelineText}>• Read all instructions carefully before filling the application</Text>
            <Text style={styles.guidelineText}>• Fill the online application with all relevant information</Text>
            <Text style={styles.guidelineText}>• Take clear photo of all the documents before filling the application</Text>
            <Text style={styles.guidelineText}>• Keep the following documents & information ready before filling the form:</Text>

            <View style={styles.documentList}>
              <Text style={styles.documentItem}>• SSLC Marks Card</Text>
              <Text style={styles.documentItem}>• Applicant&apos;s recent Selfie/photo</Text>
              <Text style={styles.documentItem}>• Latest Electricity Bill</Text>
              <Text style={styles.documentItem}>• Ration Card</Text>
              <Text style={styles.documentItem}>• Income Certificate</Text>
              <Text style={styles.documentItem}>• Family Photo (in front of dwelling unit)</Text>
              <Text style={styles.documentItem}>• House Video (MP4, MOV, max 50MB)</Text>
              <Text style={styles.documentItem}>• Google Maps link of your house location</Text>
            </View>
          </View>
        </FormCard>

        <FormCard>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAccepted(!accepted)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
              {accepted && <Ionicons name="checkmark" size={16} color={colors.card} />}
            </View>
            <Text style={styles.checkboxLabel}>
              I have read and agree to the Terms & Conditions
              <Text style={styles.required}> *</Text>
            </Text>
          </TouchableOpacity>
        </FormCard>
      </ScrollView>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  guidelineContainer: {
    paddingVertical: spacing.sm,
  },
  guidelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  guidelineText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  documentList: {
    marginLeft: spacing.md,
    marginTop: spacing.xs,
  },
  documentItem: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  required: {
    color: colors.error,
    fontWeight: '700',
  },
});
