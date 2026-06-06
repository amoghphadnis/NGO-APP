import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import { useFormEngineStore } from '../../../store/useFormEngineStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

const guidelinesSchema = z.object({
  guidelinesAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the guidelines to proceed'
  })
});

interface GuidelinesFormData {
  guidelinesAccepted: boolean;
}

export default function GuidelinesSection({ navigation }: any) {
  const { markStepComplete, updateValidationState } = useFormEngineStore();
  
  const { control, handleSubmit, formState } = useForm<GuidelinesFormData>({
    defaultValues: {
      guidelinesAccepted: false,
    },
    resolver: zodResolver(guidelinesSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: GuidelinesFormData) => {
    updateValidationState('guidelines', { isValid: true, data });
    markStepComplete(0);
    navigation.navigate('personal');
  };

  const isNextDisabled = !formState.isValid;

  return (
    <FormScreenLayout
      title="Application Guidelines"
      step={0}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
      nextLabel="Accept & Continue"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Eligibility Section */}
        <FormSectionHeader
          icon="checkmark-circle"
          title="Eligibility Criteria"
          subtitle="Please ensure you meet these requirements"
        />
        
        <FormCard>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Student must be a resident of Karnataka
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Annual family income should not exceed ₹2,00,000
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Student must have secured minimum 60% in previous examination
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Must be studying in a recognized institution
            </Text>
          </View>
        </FormCard>

        {/* Required Documents */}
        <FormSectionHeader
          icon="attach"
          title="Required Documents (16 Total)"
          subtitle="Keep these documents ready for upload (PDF/JPG/PNG, max 2MB each)"
        />

        <FormCard>
          {/* Documents 1-4 */}
          <View style={styles.documentItem}>
            <Ionicons name="document" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>1. PUC Marks Card</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="receipt" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>2. Income Certificate</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="card" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>3. Ration Card (Both Sides)</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="flash" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>4. Electricity Bill</Text>
            </View>
          </View>

          {/* Documents 5-8 */}
          <View style={styles.documentItem}>
            <Ionicons name="id-card" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>5. College ID</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="school" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>6. Admission Proof/Form</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="cash" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>7. Fees Receipts</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="document-text" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>8. Expenditure Certificate from College</Text>
            </View>
          </View>

          {/* Documents 9-12 */}
          <View style={styles.documentItem}>
            <Ionicons name="camera" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>9. Student Photo</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="business" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>10. Photo in Front of College</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="home" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>11. Dwelling Unit Photo / Family Photo in Front of House</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="trophy" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>12. CET Rank/NEET Rank Sheet</Text>
            </View>
          </View>

          {/* Documents 13-16 */}
          <View style={styles.documentItem}>
            <Ionicons name="book" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>13. Student Passbook First Page Photo</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="stats-chart" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>14. 6 Months Bank Statement of Earning Member</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="card-outline" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>15. Aadhar Card (Both Sides)</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="pencil" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>16. Handwritten Self Declaration Letter</Text>
            </View>
          </View>

          {/* Google Location Link */}
          <View style={styles.documentItem}>
            <Ionicons name="location" size={20} color={colors.warning} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={[styles.documentTitle, { color: colors.warning }]}>Google Location Map Link (Required)</Text>
              <Text style={styles.documentSubtitle}>Must start with https://</Text>
            </View>
          </View>
        </FormCard>

        {/* Important Instructions */}
        <FormSectionHeader
          icon="information-circle"
          title="Important Instructions"
          subtitle="Please read carefully"
        />
        
        <FormCard>
          <View style={styles.instructionItem}>
            <Ionicons name="alert" size={20} color={colors.warning} style={styles.icon} />
            <Text style={styles.instructionText}>
              All information provided must be true and accurate
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="alert" size={20} color={colors.warning} style={styles.icon} />
            <Text style={styles.instructionText}>
              False information may lead to rejection of scholarship
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="alert" size={20} color={colors.warning} style={styles.icon} />
            <Text style={styles.instructionText}>
              Documents will be verified by the scholarship committee
            </Text>
          </View>
        </FormCard>

        {/* Terms Acceptance */}
        <FormSectionHeader
          icon="shield-checkmark"
          title="Terms & Conditions"
          subtitle="Accept the terms to proceed"
        />
        
        <FormCard>
          <Controller
            control={control}
            name="guidelinesAccepted"
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => onChange(!value)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                  {value && (
                    <Ionicons name="checkmark" size={16} color={colors.card} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>
                  I have read and understood all the guidelines, eligibility criteria, and instructions. I confirm that all information I provide will be true and accurate.
                </Text>
              </TouchableOpacity>
            )}
          />
        </FormCard>
      </ScrollView>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  documentContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  icon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  guidelineText: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
  },
  documentTitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  documentSubtitle: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  instructionText: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
  },
});
