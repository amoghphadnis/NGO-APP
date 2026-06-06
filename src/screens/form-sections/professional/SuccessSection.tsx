import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import { useFormEngineStore } from '../../../store/useFormEngineStore';
import { isProfessionalForm } from '@/types/forms';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

export default function SuccessSection({ navigation }: any) {
  const { formData, resetForm, submissionState } = useFormEngineStore();
  
  // Defensive rendering for nested state
  const personalData = isProfessionalForm(formData)
    ? formData.personal
    : { StudentName: '' };
  const applicationId = submissionState?.applicationId || `VP${new Date().getFullYear()}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  const submissionDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleHome = () => {
    resetForm();
    navigation.navigate('guidelines');
  };

  const handleExit = () => {
    resetForm();
    // In a real app, this might navigate to login screen or close the app
    navigation.navigate('guidelines');
  };

  return (
    <FormScreenLayout
      title="Application Submitted"
      step={8}
      showBack={false}
      showNext={false}
    >
      {/* Success Animation/Illustration */}
      <View style={styles.successContainer}>
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark-circle" size={80} color={colors.success} />
        </View>
        <Text style={styles.successTitle}>Application Submitted Successfully!</Text>
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
          <Text style={styles.detailValue}>{applicationId}</Text>
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
            {useFormEngineStore.getState().currentFormType === 'professional' ? 'Professional Scholarship' : 'PUC Scholarship'}
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
              Contact support if you don't receive updates within 15 days
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
  },
  successIconContainer: {
    marginBottom: spacing.lg,
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
