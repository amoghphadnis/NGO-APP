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
      <ApplicationTitleBanner />

      {/* Website Top Notice */}
      <View style={styles.topNoticeBanner}>
        <Ionicons name="information-circle-outline" size={18} color="#0284c7" style={{ marginRight: 6 }} />
        <Text style={styles.topNoticeText}>
          Note: Please read instructions carefully & eligibility criteria before filling out the form.
        </Text>
      </View>

      {/* Instructions / Document Checklist */}
      <FormSectionHeader
        icon="document-text"
        title="Instructions"
        subtitle="Please keep the following documents and information ready before filling out the application form:"
      />

      <FormCard>
        <View style={styles.documentItem}>
          <Text style={styles.bulletNumber}>1.</Text>
          <Text style={styles.documentTitle}>PUC/12th Marks Card</Text>
        </View>
        <View style={styles.documentItem}>
          <Text style={styles.bulletNumber}>2.</Text>
          <Text style={styles.documentTitle}>Student's Selfie/Photograph</Text>
        </View>
        <View style={styles.documentItem}>
          <Text style={styles.bulletNumber}>3.</Text>
          <Text style={styles.documentTitle}>CET/NEET Rank Card</Text>
        </View>
        <View style={styles.documentItem}>
          <Text style={styles.bulletNumber}>4.</Text>
          <Text style={styles.documentTitle}>Latest Electricity bill</Text>
        </View>
        <View style={styles.documentItem}>
          <Text style={styles.bulletNumber}>5.</Text>
          <Text style={styles.documentTitle}>
            Dwelling Unit Photo (Photo of the student with family members in front of the house)
          </Text>
        </View>
        <View style={styles.documentItem}>
          <Text style={styles.bulletNumber}>6.</Text>
          <Text style={styles.documentTitle}>Ration Card (both sides)</Text>
        </View>
        <View style={styles.documentItem}>
          <Text style={styles.bulletNumber}>7.</Text>
          <Text style={styles.documentTitle}>Income Certificate</Text>
        </View>
        <View style={styles.documentItem}>
          <Text style={styles.bulletNumber}>8.</Text>
          <Text style={styles.documentTitle}>
            Short Video of the House (Please record a short video of your house starting from the outside and moving inside. The video should cover all rooms, including the kitchen, and must be recorded in landscape mode)
          </Text>
        </View>
        <View style={styles.documentItem}>
          <Text style={styles.bulletNumber}>9.</Text>
          <Text style={styles.documentTitle}>
            Request Letter for financial assistance addressed to Vidya Poshak (Handwritten)
          </Text>
        </View>
      </FormCard>

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
              The student should have appeared for the <Text style={styles.bold}>PUC II examination for the first time in 2026</Text>
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Must be aspiring to join a <Text style={styles.bold}>Medical or Engineering course</Text>
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
              For Engineering aspirants: Should have secured <Text style={styles.bold}>a CET rank below 25,000</Text>
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              For Medical aspirants: Should have secured a <Text style={styles.bold}>NEET Karnataka rank below 3,000 and All India rank below 60,000</Text>
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

        {/* Deadline & Contact */}
        <FormCard>
          <View style={styles.guidelineItem}>
            <Ionicons name="calendar" size={20} color={colors.warning} style={styles.icon} />
            <Text style={styles.guidelineText}>
              <Text style={styles.bold}>Last date to apply: 30 Jul 2026</Text>
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="call" size={20} color={colors.primary} style={styles.icon} />
            <Text style={styles.guidelineText}>
              If any queries, contact: <Text style={styles.bold}>0836-2747357</Text>
            </Text>
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
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  topNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderColor: '#7dd3fc',
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  topNoticeText: {
    flex: 1,
    fontSize: 14,
    color: '#0369a1',
    fontWeight: '500',
    lineHeight: 20,
  },
  bulletNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    width: 22,
    marginRight: 6,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  bold: {
    fontWeight: '700',
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
