import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

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
      totalSteps={7}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
      nextLabel="Accept & Continue"
    >
      {/* Eligibility Criteria */}
      <FormSectionHeader
          icon="checkmark-circle"
          title="Eligibility Criteria"
          subtitle="Please ensure you meet these requirements"
        />

        <FormCard>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              The student should have appeared for the <Text style={styles.bold}>PUC II / 12 Grade examination for the first time in 2026</Text>
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Applicants must be aspiring to enroll in a Semi-Professional course such as <Text style={styles.bold}>B.Sc-Nursing, GNM- Nursing, Physiotherapy, B.Sc- Agriculture, Veterinary Science &amp; Horticulture</Text>
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              This application is <Text style={styles.bold}>only for students from Karnataka</Text>
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Should have scored <Text style={styles.bold}>80%</Text> and above in the PUC II examination
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              The <Text style={styles.bold}>total family income</Text> should be <Text style={styles.bold}>less than ₹15,000/- per month</Text>
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              <Text style={styles.bold}>Parents must be residents of Karnataka</Text>
            </Text>
          </View>
        </FormCard>

        {/* Deadline */}
        <FormCard>
          <View style={styles.guidelineItem}>
            <Ionicons name="calendar" size={20} color={colors.warning} style={styles.icon} />
            <Text style={styles.guidelineText}>
              <Text style={styles.bold}>Last date to apply: 30 Jun 2026</Text>
            </Text>
          </View>
        </FormCard>

        {/* Required Documents */}
        <FormSectionHeader
          icon="attach"
          title="Required Documents (9 Total)"
          subtitle="Keep these documents ready for upload (PDF/JPG/PNG, max 2MB each)"
        />

        <FormCard>
          <View style={styles.documentItem}>
            <Ionicons name="document" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>1. PUC II Year Marks Card</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="camera" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>2. Student's Selfie/Photograph</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="trophy" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>3. CET Rank Sheet</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="trophy" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>4. Agriculture/Veterinary/Horticulture (PT Rank) Sheet</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="home" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>5. Dwelling Unit Photo</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="videocam" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>6. House Video</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="flash" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>7. Latest Electricity Bill</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="receipt" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>8. Income Certificate</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="card" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>9. Ration Card (Both Sides)</Text>
            </View>
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
                  I have read and understood all the guidelines and instructions. I confirm that all information I provide will be true and accurate.
                </Text>
              </TouchableOpacity>
            )}
          />
        </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  guidelineItem: {
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
  bold: {
    fontWeight: '700',
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
  documentTitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '600',
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
