import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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
    // Check Professional form completeness
    if (isProfessionalForm(formData)) {
      const hasPersonal = formData.personal.StudentName && formData.personal.DateOfBirth;
      const hasContact = formData.contact.Email && formData.contact.ContactNumber;
      const hasAddress = formData.address.DistrictID && formData.address.Taluk;
      const hasFamily = formData.family.FamilyMembers > 0;
      const hasAcademic = formData.academic.CourseTypeID && formData.academic.CollegeName && formData.academic.CollegeFees > 0;
      const hasHouseVisitLink = formData.documents.HouseVisitLink && formData.documents.HouseVisitLink.startsWith('https://');

      // Check all 16 required documents
      const docs = formData.documents;
      const hasAllDocuments =
        docs.PUCMarksCard &&
        docs.IncomeCertificate &&
        docs.Rationcard &&
        docs.Electricitybill &&
        docs.CollegeID &&
        docs.Admissionproof &&
        docs.FeesReceipts &&
        docs.Expenditure &&
        docs.Studentphoto &&
        docs.Photoinfrontofcollege &&
        docs.Dwellingunit &&
        docs.CET &&
        docs.Studentpass &&
        docs.Monthsbank &&
        docs.AadharCard &&
        docs.Handwritten;

      return hasPersonal && hasContact && hasAddress && hasFamily && hasAllDocuments && hasAcademic && hasHouseVisitLink;
    }
    
    // Check Payana form completeness
    if (isPayanaForm(formData)) {
      const hasPersonal = formData.personal.studentName && formData.personal.dateOfBirth;
      const hasContact = formData.contact.email && formData.contact.contactNumber;
      const hasAddress = formData.address.districtID && formData.address.taluka;
      const hasFamily = formData.family.fatherName && formData.family.motherName;
      const hasAcademic = formData.academic.courseID && formData.academic.collegeName;
      const hasBank = formData.bank.accountHolderName && formData.bank.bankAccountNo && formData.bank.ifscCode;
      const hasAgreement = formData.agreement.isAgreed;
      
      // Payana has optional document uploads (not required for form completion)
      return hasPersonal && hasContact && hasAddress && hasFamily && hasAcademic && hasBank && hasAgreement;
    }

    // For other form types, assume complete (they have their own validation)
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
      // Pass formData directly to preparePayload which uses the correct mappers
      const payload = preparePayload(currentFormType, formData);
      const response = await submitApplication(currentFormType, payload);

      if (!response.success) {
        throw new Error(response.error || response.message);
      }

      setSubmissionSuccess(true, response.data?.applicationId || undefined);
      markStepComplete(8);
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

  return (
    <FormScreenLayout
      title="Review Application"
      step={7}
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
        
        {/* Personal Details (Professional only) */}
        {isProfessionalForm(formData) && renderSection(
          "Personal Details",
          {
            "Student Name": formData.personal.StudentName,
            "Date of Birth": formData.personal.DateOfBirth,
            "Gender ID": formData.personal.GenderID,
            "Caste Category ID": formData.personal.CasteCategoryID,
          },
          "person",
          () => navigation.navigate('personal')
        )}

        {/* Academic Details (Professional only) */}
        {isProfessionalForm(formData) && renderSection(
          "Academic Details",
          {
            "PU Percentage": `${formData.academic.PUPercentage}%`,
            "CET/NEET Rank": formData.academic.CET_NEET_Rank || 'N/A',
            "Course Type ID": formData.academic.CourseTypeID,
            "College Name": formData.academic.CollegeName,
            "College Type ID": formData.academic.CollegeTypeID,
            "Annual Fees": `₹${formData.academic.CollegeFees}`,
          },
          "school",
          () => navigation.navigate('academic')
        )}

        {/* Contact Information (Professional only) */}
        {isProfessionalForm(formData) && renderSection(
          "Contact Information",
          {
            "Email": formData.contact.Email,
            "WhatsApp Number": formData.contact.ContactNumber,
          },
          "mail",
          () => navigation.navigate('contact')
        )}

        {/* Address Details (Professional only) */}
        {isProfessionalForm(formData) && renderSection(
          "Address Details",
          {
            "District ID": formData.address.DistrictID,
            "Taluk": formData.address.Taluk,
            "Place ID": formData.address.PlaceID,
            "Address": formData.address.Address,
          },
          "location",
          () => navigation.navigate('address')
        )}

        {/* Family Information (Professional only) */}
        {isProfessionalForm(formData) && renderSection(
          "Family Information",
          {
            "Father's Occupation ID": formData.family.FatherOccupationID || 'N/A',
            "Mother's Occupation ID": formData.family.MotherOccupationID || 'N/A',
            "Family Members": formData.family.FamilyMembers,
            "Annual Income": formData.family.AnnualIncome || 'N/A',
          },
          "people",
          () => navigation.navigate('family')
        )}

        {/* Documents */}
        <FormCard>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="attach" size={20} color={colors.primary} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Documents (16 Required)</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('documents')} style={styles.editButton}>
              <Ionicons name="create" size={16} color={colors.primary} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContent}>
            {/* Documents 1-4 */}
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>1. PUC Marks Card:</Text>
              <Text style={isProfessionalForm(formData) && formData.documents.PUCMarksCard ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && formData.documents.PUCMarksCard ? '✓' : '○'}
              </Text>
            </View>
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>2. Income Certificate:</Text>
              <Text style={isProfessionalForm(formData) && formData.documents.IncomeCertificate ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && formData.documents.IncomeCertificate ? '✓' : '○'}
              </Text>
            </View>
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>3. Ration Card:</Text>
              <Text style={isProfessionalForm(formData) && formData.documents.Rationcard ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && formData.documents.Rationcard ? '✓' : '○'}
              </Text>
            </View>
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>4. Electricity Bill:</Text>
              <Text style={isProfessionalForm(formData) && formData.documents.Electricitybill ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && formData.documents.Electricitybill ? '✓' : '○'}
              </Text>
            </View>

            {/* Documents 5-8 */}
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>5. College ID:</Text>
              <Text style={isProfessionalForm(formData) && formData.documents.CollegeID ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && formData.documents.CollegeID ? '✓' : '○'}
              </Text>
            </View>
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>6. Admission Proof:</Text>
              <Text style={isProfessionalForm(formData) && formData.documents.Admissionproof ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && formData.documents.Admissionproof ? '✓' : '○'}
              </Text>
            </View>
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>7. Fees Receipts:</Text>
              <Text style={isProfessionalForm(formData) && formData.documents.FeesReceipts ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && formData.documents.FeesReceipts ? '✓' : '○'}
              </Text>
            </View>
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>8. Expenditure Cert:</Text>
              <Text style={isProfessionalForm(formData) && formData.documents.Expenditure ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && formData.documents.Expenditure ? '✓' : '○'}
              </Text>
            </View>

            {/* Documents 9-12 */}
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>9. Student Photo:</Text>
              <Text style={isProfessionalForm(formData) && formData.documents.Studentphoto ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && formData.documents.Studentphoto ? '✓' : '○'}
              </Text>
            </View>
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>10. Photo at College:</Text>
              <Text style={isProfessionalForm(formData) && formData.documents.Photoinfrontofcollege ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && formData.documents.Photoinfrontofcollege ? '✓' : '○'}
              </Text>
            </View>
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>11. Dwelling Unit:</Text>
              <Text style={isProfessionalForm(formData) && formData.documents.Dwellingunit ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && formData.documents.Dwellingunit ? '✓' : '○'}
              </Text>
            </View>
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>12. CET/NEET Rank:</Text>
              <Text style={isProfessionalForm(formData) && formData.documents.CET ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && formData.documents.CET ? '✓' : '○'}
              </Text>
            </View>

            {/* Documents 13-16 */}
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>13. Student Passbook:</Text>
              <Text style={isProfessionalForm(formData) && formData.documents.Studentpass ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && formData.documents.Studentpass ? '✓' : '○'}
              </Text>
            </View>
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>14. 6 Months Bank Stmt:</Text>
              <Text style={isProfessionalForm(formData) && formData.documents.Monthsbank ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && formData.documents.Monthsbank ? '✓' : '○'}
              </Text>
            </View>
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>15. Aadhar Card:</Text>
              <Text style={isProfessionalForm(formData) && formData.documents.AadharCard ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && formData.documents.AadharCard ? '✓' : '○'}
              </Text>
            </View>
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>16. Handwritten Letter:</Text>
              <Text style={isProfessionalForm(formData) && formData.documents.Handwritten ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && formData.documents.Handwritten ? '✓' : '○'}
              </Text>
            </View>

            {isProfessionalForm(formData) && (
              <View style={styles.documentRow}>
                <Text style={styles.documentLabel}>Google Location Link:</Text>
                <Text style={formData.documents.HouseVisitLink ? styles.documentUploaded : styles.documentPending}>
                  {formData.documents.HouseVisitLink ? '✓ Provided' : 'Not provided'}
                </Text>
              </View>
            )}
          </View>
        </FormCard>

        {/* Payana Documents Section */}
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

        {/* Declaration */}
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
