import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getProfessionalDropdowns } from '@/api/professionalApi';
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
import { isNewStudentForm, isPayanaForm, isProfessionalForm, isPUCForm } from '@/types/forms';
import { confirmNoDuplicate, getContactNumber } from '@/utils/duplicateCheck';
import { getTotalUploadSizeBytes, isTotalUploadSizeExceeded } from '@/utils/uploadSize';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

const labelFor = (options: NormalizedDropdownOption[] | undefined, value: number | undefined | null): string => {
  if (value === undefined || value === null || value === 0) return 'N/A';
  const found = options?.find((o) => Number(o.value) === Number(value));
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
    castes: NormalizedDropdownOption[];
    areaTypes?: NormalizedDropdownOption[];
    districts: NormalizedDropdownOption[];
    fatherOccupations?: NormalizedDropdownOption[];
    motherOccupations?: NormalizedDropdownOption[];
    houseTypes?: NormalizedDropdownOption[];
  }>({
    genders: [],
    castes: [],
    districts: [],
  });

  useEffect(() => {
    let mounted = true;
    async function loadDropdowns() {
      const response = await getProfessionalDropdowns();
      if (mounted && response.success && response.data) {
        setDropdowns({
          genders: response.data.genders ?? [],
          castes: response.data.castes ?? [],
          areaTypes: response.data.areaTypes ?? [],
          districts: response.data.districts ?? [],
          fatherOccupations: response.data.fatherOcc ?? [],
          motherOccupations: response.data.motherOcc ?? [],
          houseTypes: response.data.houseTypes ?? [],
        });
      }
    }
    loadDropdowns();
    return () => {
      mounted = false;
    };
  }, []);

  const isFormComplete = () => {
    if (isProfessionalForm(formData)) {
      const p = formData.personal;
      const hasPersonal = p.StudentName && p.DateOfBirth && p.Email && p.ContactNumber && p.AlternateNumber && p.GenderID && p.DistrictID && p.AreaTypeID && p.ResidentialAddress && p.GoogleMapLink;
      const hasFamily = formData.family.FatherName && formData.family.MotherName && formData.family.FatherOccupationID && formData.family.MotherOccupationID && formData.family.FamilyMembers > 0 && formData.family.HouseTypeID && formData.family.FamilyIncome > 0;
      const hasAcademic = formData.academic.PUPercentage !== undefined && formData.academic.CourseApplying && formData.academic.CourseStream;

      const docs = formData.documents;
      const hasAllDocuments =
        docs.StudentSelfie &&
        docs.CETNEETRankSheet &&
        docs.DwellingUnitPhoto &&
        docs.MarksSheet12 &&
        docs.RequestLetter &&
        docs.HouseVideo &&
        docs.ElectricityBill &&
        docs.IncomeCertificate &&
        docs.RationCard;

      return hasPersonal && hasFamily && hasAcademic && hasAllDocuments;
    }

    if (isPUCForm(formData)) {
      const p = formData.personal;
      const c = formData.contact;
      const a = formData.address;
      const f = formData.family;
      const ac = formData.academic;
      const docs = (formData.documents as any) ?? {};

      const hasPersonal = !!(p?.StudentName && p?.DateOfBirth && p?.Gender && p?.Caste);
      const hasContact = !!(c?.ContactNumber);
      const hasAddress = !!(a?.District && a?.Taluk && a?.ResidentialAddress);
      const hasFamily = !!(f?.FatherOccupation && f?.MotherOccupation && (f?.TotalFamilyMembers ?? 0) > 0 && (f?.FamilyAnnualIncome ?? 0) > 0);
      const hasAcademic = !!(ac?.SSLCPercentage !== undefined && ac?.CourseJoined && ac?.CollegeName && ac?.CollegeType);
      const hasDocs = !!(
        docs?.StudentSelfie?.file && docs?.SSLCMarksCard?.file && docs?.ElectricityBill?.file &&
        docs?.RationCard?.file && docs?.DwellingUnitPhoto?.file && docs?.HouseVideo?.file &&
        docs?.IncomeCertificate?.file
      );

      return hasPersonal && hasContact && hasAddress && hasFamily && hasAcademic && hasDocs;
    }

    if (isPayanaForm(formData)) {
      const hasPersonal = formData.personal.studentName && formData.personal.dateOfBirth;
      const hasContact = formData.contact.email && formData.contact.contactNumber && formData.contact.alternateNumber;
      const hasAddress = formData.address.districtID && formData.address.taluka;
      const hasFamily = formData.family.fatherName && formData.family.motherName;
      const hasAcademic = formData.academic.courseSA && formData.academic.annualFees;
      const hasBank = formData.bank.accountHolderName && formData.bank.bankAccountNo && formData.bank.ifscCode;
      const hasAgreement = formData.agreement.isAgreed;

      return hasPersonal && hasContact && hasAddress && hasFamily && hasAcademic && hasBank && hasAgreement;
    }

    if (isNewStudentForm(formData)) {
      const d = formData.documents;
      const hasPersonal = formData.personal.studentName && formData.personal.dateOfBirth && formData.personal.genderID;
      const hasContact = formData.contact.contactNumber && formData.contact.alternateNumber;
      const hasAddress = formData.address.address && formData.address.taluka && formData.address.districtID;
      const hasFamily = formData.family.fatherName && formData.family.motherName;
      const hasCategory = formData.category.casteCategoryID && formData.category.areaTypeID && formData.category.houseTypeID && formData.category.referenceSourceID;
      const hasAcademic = formData.academic.courseID && formData.academic.collegeName && formData.academic.collegeTypeID;
      const hasDocs = d?.sslcMarksCard?.file && d?.studentPhoto?.file && d?.electricityBill?.file && d?.rationCards?.file && d?.incomeCertificate?.file && d?.familyPhoto?.file && d?.houseVideo?.file && d?.houseVisitLink;

      return hasPersonal && hasContact && hasAddress && hasFamily && hasCategory && hasAcademic && hasDocs;
    }

    return true;
  };

  const totalUploadBytes = getTotalUploadSizeBytes((formData as any).documents);
  const uploadSizeExceeded = isTotalUploadSizeExceeded((formData as any).documents);
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
      // Mark the review step's own config index complete (varies by form type).
      try {
        const reviewIndex = getFormConfig(currentFormType).steps.indexOf('review');
        if (reviewIndex >= 0) markStepComplete(reviewIndex);
      } catch { /* non-fatal */ }
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

  const renderDocumentStatus = (label: string, uploaded: boolean) => (
    <View style={styles.documentRow}>
      <Text style={styles.documentLabel}>{label}</Text>
      <Text style={uploaded ? styles.documentUploaded : styles.documentPending}>
        {uploaded ? '✓' : '○'}
      </Text>
    </View>
  );

  return (
    <FormScreenLayout
      title="Review Application"
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

        {isProfessionalForm(formData) && renderSection(
          "Applicant's Information",
          {
            "Email": formData.personal.Email,
            "Student Name": formData.personal.StudentName,
            "Date of Birth": formData.personal.DateOfBirth,
            "Contact Number": formData.personal.ContactNumber,
            "Alternate Number": formData.personal.AlternateNumber || 'N/A',
            "Gender": labelFor(dropdowns.genders, formData.personal.GenderID),
            "Caste Category": labelFor(dropdowns.castes, formData.personal.CasteCategoryID),
            "Area Type": labelFor(dropdowns.areaTypes, formData.personal.AreaTypeID),
            "District": labelFor(dropdowns.districts, formData.personal.DistrictID),
            "Other District": formData.personal.OtherDistrict || 'N/A',
            "Residential Address": formData.personal.ResidentialAddress,
            "Google Map Link": formData.personal.GoogleMapLink || 'N/A',
          },
          "person",
          () => navigation.navigate('personal')
        )}

        {isProfessionalForm(formData) && renderSection(
          "Family Details",
          {
            "Father's Name": formData.family.FatherName,
            "Mother's Name": formData.family.MotherName,
            "Father's Occupation": labelFor(dropdowns.fatherOccupations, formData.family.FatherOccupationID),
            "Mother's Occupation": labelFor(dropdowns.motherOccupations, formData.family.MotherOccupationID),
            "Family Members": formData.family.FamilyMembers,
            "House Type": labelFor(dropdowns.houseTypes, formData.family.HouseTypeID),
            "Monthly Rent": formData.family.MonthlyRent ? `₹${formData.family.MonthlyRent}` : 'N/A',
            "Family Income": `₹${formData.family.FamilyIncome}`,
          },
          "people",
          () => navigation.navigate('family')
        )}

        {isProfessionalForm(formData) && renderSection(
          "Academic Details",
          {
            "PU Percentage": `${formData.academic.PUPercentage}%`,
            "CET Rank": formData.academic.CETRank || 'N/A',
            "NEET Rank": formData.academic.NEETRank || 'N/A',
            "Course Applying": formData.academic.CourseApplying,
            "Course Stream": formData.academic.CourseStream,
          },
          "school",
          () => navigation.navigate('academic')
        )}

        {isProfessionalForm(formData) && (
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
              {renderDocumentStatus('1. Student Selfie', !!formData.documents.StudentSelfie)}
              {renderDocumentStatus('2. CET/NEET Rank Sheet', !!formData.documents.CETNEETRankSheet)}
              {renderDocumentStatus('3. Dwelling Unit Photo', !!formData.documents.DwellingUnitPhoto)}
              {renderDocumentStatus('4. 12th Marks Sheet', !!formData.documents.MarksSheet12)}
              {renderDocumentStatus('5. Request Letter', !!formData.documents.RequestLetter)}
              {renderDocumentStatus('6. House Video', !!formData.documents.HouseVideo)}
              {renderDocumentStatus('7. Electricity Bill', !!formData.documents.ElectricityBill)}
              {renderDocumentStatus('8. Income Certificate', !!formData.documents.IncomeCertificate)}
              {renderDocumentStatus('9. Ration Card', !!formData.documents.RationCard)}
            </View>
          </FormCard>
        )}

        {isPayanaForm(formData) && (
          <FormCard>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="attach" size={20} color={colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Documents (Optional)</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('documents')} style={styles.editButton}>
                <Ionicons name="create" size={16} color={colors.primary} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionContent}>
              <View style={styles.documentRow}>
                <Text style={styles.documentLabel}>1. Latest Marks Card:</Text>
                <Text style={formData.documents?.latestMarksCard?.file ? styles.documentUploaded : styles.documentPending}>
                  {formData.documents?.latestMarksCard?.file ? '✓' : '○'}
                </Text>
              </View>
              <View style={styles.documentRow}>
                <Text style={styles.documentLabel}>2. Bank Passbook:</Text>
                <Text style={formData.documents?.studentPassbookFP?.file ? styles.documentUploaded : styles.documentPending}>
                  {formData.documents?.studentPassbookFP?.file ? '✓' : '○'}
                </Text>
              </View>
              <View style={styles.documentRow}>
                <Text style={styles.documentLabel}>3. Student Photo:</Text>
                <Text style={formData.documents?.studentPhoto?.file ? styles.documentUploaded : styles.documentPending}>
                  {formData.documents?.studentPhoto?.file ? '✓' : '○'}
                </Text>
              </View>
              <View style={styles.documentRow}>
                <Text style={styles.documentLabel}>4. Dwelling Unit Photo:</Text>
                <Text style={formData.documents?.dwellingUnit?.file ? styles.documentUploaded : styles.documentPending}>
                  {formData.documents?.dwellingUnit?.file ? '✓' : '○'}
                </Text>
              </View>
              <View style={styles.documentRow}>
                <Text style={styles.documentLabel}>5. Aadhaar Card:</Text>
                <Text style={formData.documents?.aadhaarCard?.file ? styles.documentUploaded : styles.documentPending}>
                  {formData.documents?.aadhaarCard?.file ? '✓' : '○'}
                </Text>
              </View>
              <View style={styles.documentRow}>
                <Text style={styles.documentLabel}>House Visit Link:</Text>
                <Text style={formData.documents?.houseVisitLink ? styles.documentUploaded : styles.documentPending}>
                  {formData.documents?.houseVisitLink ? '✓ Provided' : 'Not provided'}
                </Text>
              </View>
            </View>
          </FormCard>
        )}

        {isPUCForm(formData) && renderSection(
          "Applicant's Information",
          {
            "Student Name": formData.personal.StudentName,
            "Date of Birth": formData.personal.DateOfBirth,
            "Gender": labelFor(dropdowns.genders, formData.personal.Gender),
            "Caste Category": labelFor(dropdowns.castes, formData.personal.Caste),
          },
          "person",
          () => navigation.navigate('personal')
        )}

        {isPUCForm(formData) && renderSection(
          "Contact Details",
          {
            "Email": formData.contact.Email,
            "Contact Number": formData.contact.ContactNumber,
            "Alternate Number": formData.contact.AlternateNumber || 'N/A',
          },
          "call",
          () => navigation.navigate('contact')
        )}

        {isPUCForm(formData) && renderSection(
          "Address Details",
          {
            "District": labelFor(dropdowns.districts, formData.address.District),
            "Other District": formData.address.OtherDistrict || 'N/A',
            "Taluk": formData.address.Taluk,
            "Residential Address": formData.address.ResidentialAddress,
          },
          "home",
          () => navigation.navigate('address')
        )}

        {isPUCForm(formData) && renderSection(
          "Family Details",
          {
            "Father's Occupation": labelFor(dropdowns.fatherOccupations, formData.family.FatherOccupation),
            "Mother's Occupation": labelFor(dropdowns.motherOccupations, formData.family.MotherOccupation),
            "Family Members": formData.family.TotalFamilyMembers,
            "Family Annual Income": `₹${formData.family.FamilyAnnualIncome}`,
          },
          "people",
          () => navigation.navigate('family')
        )}

        {isPUCForm(formData) && renderSection(
          "Academic Details",
          {
            "SSLC Percentage": `${formData.academic.SSLCPercentage}%`,
            "College Name": formData.academic.CollegeName,
            "College Fees": `₹${formData.academic.CollegeFees}`,
          },
          "school",
          () => navigation.navigate('academic')
        )}

        {isPUCForm(formData) && (
          <FormCard>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="attach" size={20} color={colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Documents (7 Mandatory)</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('documents')} style={styles.editButton}>
                <Ionicons name="create" size={16} color={colors.primary} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionContent}>
              {renderDocumentStatus('1. Student Selfie', !!(formData.documents as any)?.StudentSelfie?.file)}
              {renderDocumentStatus('2. SSLC Marks Card', !!(formData.documents as any)?.SSLCMarksCard?.file)}
              {renderDocumentStatus('3. Electricity Bill', !!(formData.documents as any)?.ElectricityBill?.file)}
              {renderDocumentStatus('4. Ration Card', !!(formData.documents as any)?.RationCard?.file)}
              {renderDocumentStatus('5. Dwelling Unit Photo', !!(formData.documents as any)?.DwellingUnitPhoto?.file)}
              {renderDocumentStatus('6. House Video', !!(formData.documents as any)?.HouseVideo?.file)}
              {renderDocumentStatus('7. Income Certificate', !!(formData.documents as any)?.IncomeCertificate?.file)}
            </View>
          </FormCard>
        )}

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
                I have read and agree to the terms & Conditions.
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
