import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { preparePayload, submitApplication } from '@/submission';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { SemiProfessionalFormValues } from '@/validation/semiProfessionalSchemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function ReviewSection({ navigation }: any) {
  const {
    formData,
    markStepComplete,
    updateValidationState,
    currentFormType,
    submissionState,
    setSubmissionLoading,
    setSubmissionSuccess,
    setSubmissionError,
  } = useFormEngineStore();
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const submitLock = useRef(false);

  const spFormData = formData as unknown as SemiProfessionalFormValues;

  const isFormComplete = () => {
    const hasPersonal = spFormData.personal?.studentName && spFormData.personal?.email;
    const hasFamily = spFormData.family?.familyMembers > 0 && spFormData.family?.fatherOccupationID > 0;
    const hasAcademic = spFormData.academic?.semiProfessionalCourseID > 0 && spFormData.academic?.collegeName;
    return hasPersonal && hasFamily && hasAcademic;
  };

  const canSubmit = isFormComplete() && declarationAccepted;

  const onSubmit = async () => {
    // Synchronous re-entry guard — prevents double-tap before React re-renders.
    if (submitLock.current) return;
    submitLock.current = true;

    updateValidationState('review', { isValid: true, data: { declarationAccepted } });
    setSubmissionLoading(true);

    if (!currentFormType) {
      setSubmissionLoading(false);
      setSubmissionError('Form type is not selected.');
      submitLock.current = false;
      return;
    }

    try {
      const payload = preparePayload(currentFormType, formData);
      const response = await submitApplication(currentFormType, payload);

      if (!response.success) {
        throw new Error(response.error || response.message);
      }

      setSubmissionSuccess(true, response.data?.studentId?.toString() || response.data?.applicationId || undefined);
      markStepComplete(5);
      navigation.navigate('success');
    } catch (error: any) {
      const submissionId = error?.submissionId;
      const isNetworkError =
        !error?.response?.status &&
        (error?.code === 'ECONNABORTED' ||
          error?.code === 'NETWORK_ERROR' ||
          error?.code === 'UNKNOWN_ERROR' ||
          error?.code === 'SESSION_EXPIRED' ||
          !error?.code);

      if (isNetworkError && submissionId) {
        setSubmissionError(
          `Submission status unknown. We could not confirm whether your application was submitted.\n\nReference: ${submissionId}\n\nPlease check your application list before submitting again.`
        );
      } else {
        const baseMsg = error?.message || 'Failed to submit application. Please try again.';
        setSubmissionError(
          submissionId ? `${baseMsg}\n\nReference: ${submissionId}` : baseMsg
        );
      }
    } finally {
      setSubmissionLoading(false);
      submitLock.current = false;
    }
  };

  const renderSection = (title: string, data: any, icon: any, onEdit: () => void) => (
    <FormCard>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Ionicons name={icon} size={20} color={colors.primary} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Ionicons name="create" size={16} color={colors.primary} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContent}>
        {Object.entries(data).map(([key, value]) => {
          if (!value) return null;
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          return (
            <View key={key} style={styles.dataRow}>
              <Text style={styles.dataLabel}>{label}:</Text>
              <Text style={styles.dataValue}>{String(value)}</Text>
            </View>
          );
        })}
      </View>
    </FormCard>
  );

  return (
    <FormScreenLayout
      title="Review Application"
      step={6}
      totalSteps={7}
      onBack={navigation.goBack}
      onNext={onSubmit}
      nextDisabled={!canSubmit || submissionState.isSubmitting}
      nextLabel="Submit Application"
      loading={submissionState.isSubmitting}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Application Summary */}
        <FormSectionHeader
          icon="checkmark-circle"
          title="Application Summary"
          subtitle="Review all information before submitting"
        />

        {/* Applicant's Information */}
        {renderSection(
          "Applicant's Information",
          {
            "Name": spFormData.personal?.studentName,
            "Email": spFormData.personal?.email,
            "Date of Birth": spFormData.personal?.dateOfBirth,
            "Contact": spFormData.personal?.contactNumber,
            "Gender ID": spFormData.personal?.genderID,
            "Caste Category ID": spFormData.personal?.casteCategoryID,
            "Place ID": spFormData.personal?.placeID,
            "District ID": spFormData.personal?.districtID,
            "Other District": spFormData.personal?.otherDistrict || undefined,
            "Taluk": spFormData.personal?.taluk,
            "Address": spFormData.personal?.address,
          },
          "person",
          () => navigation.navigate('personal')
        )}

        {/* Family Details */}
        {renderSection(
          "Family Details",
          {
            "Father Occupation ID": spFormData.family?.fatherOccupationID,
            "Mother Occupation ID": spFormData.family?.motherOccupationID,
            "Family Members": spFormData.family?.familyMembers,
            "Annual Income": spFormData.family?.annualIncome ? `₹${spFormData.family.annualIncome}` : undefined,
          },
          "people",
          () => navigation.navigate('family')
        )}

        {/* Academic Details */}
        {renderSection(
          "Academic Details",
          {
            "PU Percentage": spFormData.academic?.puPercentage ? `${spFormData.academic.puPercentage}%` : undefined,
            "Course ID": spFormData.academic?.semiProfessionalCourseID,
            "College Name": spFormData.academic?.collegeName,
            "College Type ID": spFormData.academic?.collegeTypeID,
            "College Fees": spFormData.academic?.collegeFees ? `₹${spFormData.academic.collegeFees}` : undefined,
          },
          "school",
          () => navigation.navigate('academic')
        )}

        {/* Documents */}
        <FormCard>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="attach" size={20} color={colors.primary} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Documents</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('documents')} style={styles.editButton}>
              <Ionicons name="create" size={16} color={colors.primary} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContent}>
            {[
              { label: 'PUC Marks Card', key: 'pucMarksCard' },
              { label: 'Income Certificate', key: 'incomeCertificate' },
              { label: 'Aadhar Card', key: 'aadharCard' },
            ].map((doc) => (
              <View key={doc.key} style={styles.documentRow}>
                <Text style={styles.documentLabel}>{doc.label}:</Text>
                <Text style={(spFormData.documents as any)?.[doc.key] ? styles.documentUploaded : styles.documentPending}>
                  {(spFormData.documents as any)?.[doc.key] ? '✓ Uploaded' : 'Not uploaded'}
                </Text>
              </View>
            ))}
          </View>
        </FormCard>

        {/* Declaration */}
        <FormSectionHeader
          icon="shield-checkmark"
          title="Declaration"
          subtitle="Please read and accept the declaration"
        />

        <FormCard>
          <View style={styles.declarationContainer}>
            <Text style={styles.declarationText}>
              I hereby declare that all the information provided by me in this application is true, correct, and complete to the best of my knowledge and belief. I understand that any false or misleading information may result in the rejection of my application.
            </Text>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setDeclarationAccepted(!declarationAccepted)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, declarationAccepted && styles.checkboxChecked]}>
                {declarationAccepted && (
                  <Ionicons name="checkmark" size={16} color={colors.card} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                I accept the declaration and confirm that all information is accurate
              </Text>
            </TouchableOpacity>
          </View>
        </FormCard>

        {submissionState.error ? (
          <FormCard>
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={24} color={colors.error} style={styles.noticeIcon} />
              <Text style={styles.errorText}>{submissionState.error}</Text>
            </View>
          </FormCard>
        ) : null}

        {/* Submission Notice */}
        <FormCard>
          <View style={styles.noticeContainer}>
            <Ionicons name="information-circle" size={24} color={colors.primary} style={styles.noticeIcon} />
            <Text style={styles.noticeText}>
              Once submitted, you will not be able to modify your application. Please review all information carefully before proceeding.
            </Text>
          </View>
        </FormCard>
      </ScrollView>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  editButtonText: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  sectionContent: {
    paddingLeft: spacing.lg,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dataLabel: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    flex: 1,
  },
  dataValue: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  documentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  documentLabel: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    flex: 1,
  },
  documentUploaded: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.success,
    fontWeight: '500',
  },
  documentPending: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.warning,
    fontWeight: '500',
  },
  declarationContainer: {
    padding: spacing.sm,
  },
  declarationText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'justify',
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
  noticeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.sm,
  },
  noticeIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  noticeText: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.sm,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
  },
  errorText: {
    flex: 1,
    color: colors.error,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
  },
});
