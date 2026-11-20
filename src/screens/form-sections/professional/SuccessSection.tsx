import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BrandLogo from '@/components/common/BrandLogo';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { isProfessionalForm } from '@/types/forms';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

const FORM_TYPE_LABELS: Record<string, string> = {
  professional: 'Professional Scholarship',
  puc: 'PUC Scholarship',
  payana: 'Payana Scholarship',
  semiProfessional: 'Semi Professional Scholarship',
  newStudent: 'Student Registration',
};

export default function SuccessSection({ navigation }: any) {
  const router = useRouter();
  const { formData, resetForm, submissionState, currentFormType } = useFormEngineStore();

  // Defensive rendering for nested state
  const personalData = isProfessionalForm(formData)
    ? formData.personal
    : { StudentName: '' };
  // Never fabricate an ID the NGO has no record of — the real reference is
  // communicated by the office after verification.
  const applicationId = submissionState?.applicationId;
  const submissionDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleHome = () => {
    resetForm();
    router.replace('/');
  };

  const handleExit = () => {
    resetForm();
    router.replace('/form-selection');
  };

  return (
    <FormScreenLayout
      title="Application Submitted"
      step={7}
      totalSteps={7}
      showBack={false}
      showNext={false}
    >
      {/* Success Animation/Illustration */}
      <View style={styles.successContainer}>
        <View style={styles.watermark} pointerEvents="none">
          <BrandLogo variant="watermark" size={180} />
        </View>
        <BrandLogo size={44} />
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark-circle" size={80} color={colors.success} />
        </View>
        <Text style={styles.successTitle}>Application Submitted Successfully!</Text>
        <View style={styles.goldDivider} />
        <Text style={styles.successSubtitle}>
          Your scholarship application has been received and is being processed.
        </Text>
      </View>

      {/* Application Details */}
      <FormSectionHeader
        icon="document-text"
        title="Application Details"
        subtitle="Keep this information for your records"
      />
      
      <FormCard>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Application ID:</Text>
          <Text style={styles.detailValue}>{applicationId || 'Will be shared after verification'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Student Name:</Text>
          <Text style={styles.detailValue}>{personalData.StudentName || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Submission Date:</Text>
          <Text style={styles.detailValue}>{submissionDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Form Type:</Text>
          <Text style={styles.detailValue}>
            {FORM_TYPE_LABELS[currentFormType || ''] || 'Scholarship Application'}
          </Text>
        </View>
      </FormCard>

      {/* Process Timeline */}
      <FormSectionHeader
        icon="time"
        title="Process Timeline"
        subtitle="What happens next?"
      />
      
      <FormCard>
        <View style={styles.timelineContainer}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineIconContainer}>
              <Ionicons name="checkmark" size={16} color={colors.success} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Application Received</Text>
              <Text style={styles.timelineSubtitle}>Your application has been successfully submitted</Text>
            </View>
          </View>
          
          <View style={styles.timelineItem}>
            <View style={[styles.timelineIconContainer, styles.timelinePending]}>
              <Ionicons name="time" size={16} color={colors.textSecondary} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Document Verification</Text>
              <Text style={styles.timelineSubtitle}>Documents will be verified within 7-10 working days</Text>
            </View>
          </View>
          
          <View style={styles.timelineItem}>
            <View style={[styles.timelineIconContainer, styles.timelinePending]}>
              <Ionicons name="time" size={16} color={colors.textSecondary} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Eligibility Check</Text>
              <Text style={styles.timelineSubtitle}>Eligibility will be assessed by the scholarship committee</Text>
            </View>
          </View>
          
          <View style={styles.timelineItem}>
            <View style={[styles.timelineIconContainer, styles.timelinePending]}>
              <Ionicons name="time" size={16} color={colors.textSecondary} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Final Decision</Text>
              <Text style={styles.timelineSubtitle}>You will be notified of the final decision</Text>
            </View>
          </View>
        </View>
      </FormCard>

      {/* Next Steps */}
      <FormSectionHeader
        icon="information-circle"
        title="Next Steps"
        subtitle="Important instructions"
      />
      
      <FormCard>
        <View style={styles.nextStepsContainer}>
          <View style={styles.stepItem}>
            <Ionicons name="mail" size={20} color={colors.primary} style={styles.stepIcon} />
            <Text style={styles.stepText}>
              Check your email regularly for updates
            </Text>
          </View>
          <View style={styles.stepItem}>
            <Ionicons name="call" size={20} color={colors.primary} style={styles.stepIcon} />
            <Text style={styles.stepText}>
              Keep your phone number active for important notifications
            </Text>
          </View>
          <View style={styles.stepItem}>
            <Ionicons name="document" size={20} color={colors.primary} style={styles.stepIcon} />
            <Text style={styles.stepText}>
              Keep original documents ready for verification
            </Text>
          </View>
          <View style={styles.stepItem}>
            <Ionicons name="help-circle" size={20} color={colors.primary} style={styles.stepIcon} />
            <Text style={styles.stepText}>
              Contact support if you don&apos;t receive updates within 15 days
            </Text>
          </View>
        </View>
      </FormCard>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleHome}
          activeOpacity={0.8}
        >
          <Ionicons name="home" size={20} color={colors.card} style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Go to Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={handleExit}
          activeOpacity={0.8}
        >
          <Ionicons name="exit" size={20} color={colors.primary} style={styles.buttonIcon} />
          <Text style={styles.secondaryButtonText}>Exit Application</Text>
        </TouchableOpacity>
      </View>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  successContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconContainer: {
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  goldDivider: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.gold,
    marginTop: spacing.sm,
  },
  successTitle: {
    fontSize: platform.normalize.fontSize.h1,
    lineHeight: platform.normalize.lineHeight.h1,
    color: colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  timelineContainer: {
    paddingVertical: spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  timelineIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timelinePending: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timelineContent: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  timelineTitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  timelineSubtitle: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
  },
  nextStepsContainer: {
    padding: spacing.sm,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  stepIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  stepText: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
  },
  actionContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 16,
    minHeight: 56,
  },
  primaryButtonText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.card,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 16,
    minHeight: 56,
  },
  secondaryButtonText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  buttonIcon: {
    marginRight: spacing.xs,
  },
});
