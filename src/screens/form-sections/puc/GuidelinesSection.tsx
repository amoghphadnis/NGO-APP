import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

import ApplicationTitleBanner from '@/components/common/ApplicationTitleBanner';
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

export default function PucGuidelinesSection({ navigation }: any) {
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
      totalSteps={10}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
      nextLabel="Accept & Continue"
    >
      <ApplicationTitleBanner />

      {/* Guidelines */}
      <FormSectionHeader
          icon="information-circle"
          title="Guidelines"
          subtitle="Please read carefully before filling the form"
        />

        <FormCard>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              This application form is only for students seeking admission to <Text style={styles.bold}>PUC I Year Commerce and Diploma courses</Text>.
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              The student must have passed the <Text style={styles.bold}>SSLC examination</Text> in the <Text style={styles.bold}>2025-26 academic year</Text> in their first attempt.
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Only students who have secured <Text style={styles.bold}>more than 80%</Text> in their SSLC examination are eligible to apply.
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Read all instructions carefully before filling out the application form.
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Fill in the application with accurate and relevant information.
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Please retain the contact number provided in the application form, as it will be used for communication regarding Vidya Poshak financial assistance.
            </Text>
          </View>
        </FormCard>

        {/* Deadline & Contact */}
        <FormCard>
          <View style={styles.guidelineItem}>
            <Ionicons name="calendar" size={20} color={colors.warning} style={styles.icon} />
            <Text style={styles.guidelineText}>
              <Text style={styles.bold}>Last date to apply: 30 Sep 2026</Text>
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="call" size={20} color={colors.primary} style={styles.icon} />
            <Text style={styles.guidelineText}>
              If any queries, contact: <Text style={styles.bold}>0836-2747357</Text>
            </Text>
          </View>
        </FormCard>

        {/* Required Documents */}
        <FormSectionHeader
          icon="attach"
          title="Instructions"
          subtitle="Keep these documents ready for upload (PDF/JPG/PNG, max 2MB each; house video max 50MB)"
        />

        <FormCard>
          <View style={styles.documentItem}>
            <Ionicons name="camera" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>1. Student Selfie/Photo</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="school" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>2. SSLC Marks Card</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="flash" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>3. Recent Electricity Bill</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="card" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>4. Ration Card (Both Sides)</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="home" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>5. Dwelling Unit Photo (student with family in front of the house)</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="videocam" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>6. House Video (Exterior + Interior clearly visible)</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <Ionicons name="receipt" size={20} color={colors.primary} style={styles.icon} />
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>7. Income Certificate</Text>
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
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  documentContent: {
    flex: 1,
    marginLeft: spacing.sm,
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
