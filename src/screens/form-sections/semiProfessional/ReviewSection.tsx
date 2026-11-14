import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getSemiProfessionalDropdowns } from '@/api/semiProfessionalApi';
import { NormalizedDropdownOption } from '@/api/transformers/normalizeDropdowns';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import UploadSizeNotice from '@/components/form/UploadSizeNotice';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { getFormConfig } from '@/forms/shared/registry';
import { preparePayload, submitApplication } from '@/submission';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { confirmNoDuplicate, getContactNumber } from '@/utils/duplicateCheck';
import { getTotalUploadSizeBytes, isTotalUploadSizeExceeded } from '@/utils/uploadSize';
import { SemiProfessionalFormValues } from '@/validation/semiProfessionalSchemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

const labelFor = (options: NormalizedDropdownOption[], value: number | undefined | null): string => {
  if (value === undefined || value === null || value === 0) return 'N/A';
  const found = options.find((o) => Number(o.value) === Number(value));
  return found ? found.label : `ID ${value}`;
};

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

  const [dropdowns, setDropdowns] = useState<{
    genders: NormalizedDropdownOption[];
    casteCategories: NormalizedDropdownOption[];
    areaTypes: NormalizedDropdownOption[];
    districts: NormalizedDropdownOption[];
    fatherOccupations: NormalizedDropdownOption[];
    motherOccupations: NormalizedDropdownOption[];
    houseTypes: NormalizedDropdownOption[];
  }>({
    genders: [],
    casteCategories: [],
    areaTypes: [],
    districts: [],
    fatherOccupations: [],
    motherOccupations: [],
    houseTypes: [],
  });

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getSemiProfessionalDropdowns();
      if (response.success && response.data) {
        setDropdowns({
          genders: response.data.genders ?? [],
          casteCategories: response.data.casteCategories ?? [],
          areaTypes: response.data.areaTypes ?? [],
          districts: response.data.districts ?? [],
          fatherOccupations: response.data.fatherOccupations ?? [],
          motherOccupations: response.data.motherOccupations ?? [],
          houseTypes: response.data.houseTypes ?? [],
        });
      }
    }
    loadDropdowns();
  }, []);

  const spFormData = formData as unknown as SemiProfessionalFormValues;

  const isFormComplete = () => {
    const p = spFormData.personal;
    const hasPersonal = p?.studentName && p?.email && p?.dateOfBirth && p?.contactNumber && p?.genderID && p?.casteCategoryID && p?.areaTypeID && p?.districtID && p?.residentialAddress;
    const f = spFormData.family;
    const hasFamily = f?.fatherName && f?.motherName && f?.fatherOccupationID && f?.motherOccupationID && f?.familyMembers > 0 && f?.houseTypeID && f?.familyIncome > 0;
    const a = spFormData.academic;
    const hasAcademic = a?.puPercentage !== undefined && a?.cetRank && a?.ptRank && a?.courseApplying && a?.courseStream;
    const d = spFormData.documents;
    const hasAllDocuments =
      d?.studentSelfie &&
      d?.cetRankSheet &&
      d?.ptRankSheet &&
      d?.dwellingUnitPhoto &&
      d?.marksSheet12 &&
      d?.houseVideo &&
      d?.electricityBill &&
      d?.incomeCertificate &&
      d?.rationCard;
    return hasPersonal && hasFamily && hasAcademic && hasAllDocuments;
  };

  const totalUploadBytes = getTotalUploadSizeBytes(spFormData.documents);
  const uploadSizeExceeded = isTotalUploadSizeExceeded(spFormData.documents);
  const canSubmit = isFormComplete() && declarationAccepted && !uploadSizeExceeded;

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
      const proceed = await confirmNoDuplicate(
        currentFormType,
        getContactNumber(currentFormType, formData),
      );
      if (!proceed) {
        setSubmissionLoading(false);
        submitLock.current = false;
        return;
      }

      const payload = preparePayload(currentFormType, formData);
      const response = await submitApplication(currentFormType, payload);

      if (!response.success) {
        throw new Error(response.error || response.message);
      }

      setSubmissionSuccess(true, response.data?.applicationId || undefined);
      const reviewIndex = getFormConfig(currentFormType).steps.indexOf('review');
      if (reviewIndex >= 0) markStepComplete(reviewIndex);
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
          return (
            <View key={key} style={styles.dataRow}>
              <Text style={styles.dataLabel}>{key}:</Text>
              <Text style={styles.dataValue}>{String(value)}</Text>
            </View>
          );
        })}
      </View>
    </FormCard>
  );

  const renderDocumentStatus = (label: string, uploaded: boolean) => (
    <View style={styles.documentRow}>
      <Text style={styles.documentLabel}>{label}</Text>
      <Text style={uploaded ? styles.documentUploaded : styles.documentPending}>
        {uploaded ? '✓' : '○'}
      </Text>
    </View>
  );

  const p = spFormData.personal;
  const f = spFormData.family;
  const a = spFormData.academic;
  const d = spFormData.documents;

  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A';
    const [y, m, day] = date.split('-');
    if (y && m && day) return `${day}/${m}/${y}`;
    return date;
  };

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
      <FormSectionHeader
          icon="checkmark-circle"
          title="Application Summary"
          subtitle="Review all information before submitting"
        />

        {renderSection(
          "Applicant's Information",
          {
            "Email": p?.email,
            "Student Name": p?.studentName,
            "Date of Birth": formatDate(p?.dateOfBirth),
            "Contact Number": p?.contactNumber,
            "Alternate Number": p?.alternateNumber || 'N/A',
            "Gender": labelFor(dropdowns.genders, p?.genderID),
            "Caste Category": labelFor(dropdowns.casteCategories, p?.casteCategoryID),
            "Area Type": labelFor(dropdowns.areaTypes, p?.areaTypeID),
            "District": labelFor(dropdowns.districts, p?.districtID),
            "Other District": p?.otherDistrict || 'N/A',
            "Residential Address": p?.residentialAddress,
            "Google Map Link": p?.googleMapLink || 'N/A',
          },
          "person",
          () => navigation.navigate('personal')
        )}

        {renderSection(
          "Family Details",
          {
            "Father's Name": f?.fatherName,
            "Mother's Name": f?.motherName,
            "Father's Occupation": labelFor(dropdowns.fatherOccupations, f?.fatherOccupationID),
            "Mother's Occupation": labelFor(dropdowns.motherOccupations, f?.motherOccupationID),
            "Family Members": f?.familyMembers,
            "House Type": labelFor(dropdowns.houseTypes, f?.houseTypeID),
            "Monthly Rent": f?.monthlyRent ? `₹${f.monthlyRent}` : 'N/A',
            "Family Income": f?.familyIncome ? `₹${f.familyIncome}` : 'N/A',
          },
          "people",
          () => navigation.navigate('family')
        )}

        {renderSection(
          "Academic Details",
          {
            "PUC II / 12th Percentage": a?.puPercentage !== undefined ? `${a.puPercentage}%` : 'N/A',
            "CET Rank": a?.cetRank || 'N/A',
            "Agriculture/Veterinary/Horticulture (PT Rank)": a?.ptRank || 'N/A',
            "Course Applying For": a?.courseApplying,
            "Course Stream": a?.courseStream,
          },
          "school",
          () => navigation.navigate('academic')
        )}

        <FormCard>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="attach" size={20} color={colors.primary} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Documents (9 Required)</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('documents')} style={styles.editButton}>
              <Ionicons name="create" size={16} color={colors.primary} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContent}>
            {renderDocumentStatus("1. Student's Selfie", !!d?.studentSelfie)}
            {renderDocumentStatus('2. CET Rank Sheet', !!d?.cetRankSheet)}
            {renderDocumentStatus('3. Agriculture/Veterinary/Horticulture (PT Rank)', !!d?.ptRankSheet)}
            {renderDocumentStatus('4. Dwelling Unit Photograph', !!d?.dwellingUnitPhoto)}
            {renderDocumentStatus('5. PUC II / 12th Marks Sheet', !!d?.marksSheet12)}
            {renderDocumentStatus('6. Short Video of the House', !!d?.houseVideo)}
            {renderDocumentStatus('7. Electricity Bill / Bhagyajyothi Document', !!d?.electricityBill)}
            {renderDocumentStatus('8. Income Certificate', !!d?.incomeCertificate)}
            {renderDocumentStatus('9. Ration Card Copy (Both Sides)', !!d?.rationCard)}
          </View>
        </FormCard>

        <FormSectionHeader
          icon="shield-checkmark"
          title="Declaration"
          subtitle="Please read and accept the declaration"
        />

        <FormCard>
          <View style={styles.declarationContainer}>
            <Text style={styles.declarationText}>
              I hereby declare that all the information provided by me in this scholarship application is true, correct, and complete to the best of my knowledge and belief. I understand that any false or misleading information may result in the rejection of my application and disqualification from future scholarship opportunities.
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
                I have read and agree to the Terms & Conditions
              </Text>
            </TouchableOpacity>
          </View>
        </FormCard>

        <UploadSizeNotice totalBytes={totalUploadBytes} />

        {submissionState.error ? (
          <FormCard>
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={24} color={colors.error} style={styles.noticeIcon} />
              <Text style={styles.errorText}>{submissionState.error}</Text>
            </View>
          </FormCard>
        ) : null}

        <FormCard>
          <View style={styles.noticeContainer}>
            <Ionicons name="information-circle" size={24} color={colors.primary} style={styles.noticeIcon} />
            <Text style={styles.noticeText}>
              Once submitted, you will not be able to modify your application. Please review all information carefully before proceeding.
            </Text>
          </View>
        </FormCard>
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
