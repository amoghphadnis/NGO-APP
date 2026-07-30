import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { preparePayload, submitApplication } from '@/submission';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { isPayanaForm, isProfessionalForm } from '@/types/forms';
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

  const isFormComplete = () => {
    if (isProfessionalForm(formData)) {
      const p = formData.personal;
      const hasPersonal = p.StudentName && p.DateOfBirth && p.Email && p.ContactNumber && p.GenderID && p.CasteCategoryID && p.DistrictID && p.AreaTypeID && p.ResidentialAddress;
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

    if (isPayanaForm(formData)) {
      const hasPersonal = formData.personal.studentName && formData.personal.dateOfBirth;
      const hasContact = formData.contact.email && formData.contact.contactNumber;
      const hasAddress = formData.address.districtID && formData.address.taluka;
      const hasFamily = formData.family.fatherName && formData.family.motherName;
      const hasAcademic = formData.academic.courseID && formData.academic.collegeName;
      const hasBank = formData.bank.accountHolderName && formData.bank.bankAccountNo && formData.bank.ifscCode;
      const hasAgreement = formData.agreement.isAgreed;

      return hasPersonal && hasContact && hasAddress && hasFamily && hasAcademic && hasBank && hasAgreement;
    }

    return true;
  };

  const canSubmit = isFormComplete() && declarationAccepted;

  const onSubmit = async () => {
    updateValidationState('review', { isValid: true, data: { declarationAccepted } });
    setSubmissionLoading(true);

    if (!currentFormType) {
      setSubmissionLoading(false);
      setSubmissionError('Form type is not selected.');
      return;
    }

    try {
      const payload = preparePayload(currentFormType, formData);
      const response = await submitApplication(currentFormType, payload);

      if (!response.success) {
        throw new Error(response.error || response.message);
      }

      setSubmissionSuccess(true, response.data?.applicationId || undefined);
      markStepComplete(5);
      navigation.navigate('success');
    } catch (error: any) {
      const message = error?.message || 'Failed to submit application. Please try again.';
      setSubmissionError(message);
    } finally {
      setSubmissionLoading(false);
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
      step={6}
      totalSteps={7}
      onBack={navigation.goBack}
      onNext={onSubmit}
      nextDisabled={!canSubmit || submissionState.isSubmitting}
      nextLabel="Submit Application"
      loading={submissionState.isSubmitting}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
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
            "Gender ID": formData.personal.GenderID,
            "Caste Category ID": formData.personal.CasteCategoryID,
            "Area Type ID": formData.personal.AreaTypeID,
            "District ID": formData.personal.DistrictID,
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
            "Father's Occupation ID": formData.family.FatherOccupationID || 'N/A',
            "Mother's Occupation ID": formData.family.MotherOccupationID || 'N/A',
            "Family Members": formData.family.FamilyMembers,
            "House Type ID": formData.family.HouseTypeID,
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
