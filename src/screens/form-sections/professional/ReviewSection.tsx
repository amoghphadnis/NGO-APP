import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import { useFormEngineStore } from '../../../store/useFormEngineStore';
import { preparePayload, submitApplication } from '@/submission';
import { isProfessionalForm } from '@/types/forms';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

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
    // Check if all required sections are filled
    const hasPersonal = formData.personal.name && formData.personal.dateOfBirth;
    const hasContact = formData.contact.email && formData.contact.phone;
    const hasAddress = formData.address.pincode && formData.address.district;
    const hasFamily = formData.family.familyMembers > 0;
    const hasDocuments = isProfessionalForm(formData) && 
      'marksCard' in formData.documents && 
      'aadhaar' in formData.documents && 
      'incomeCert' in formData.documents &&
      formData.documents.marksCard && 
      formData.documents.aadhaar && 
      formData.documents.incomeCert;
    
    if (isProfessionalForm(formData)) {
      const hasAcademic = formData.academic.courseTypeID && formData.academic.collegeName && formData.academic.collegeFees > 0;
      const hasBank = formData.bank.accountNumber && formData.bank.ifscCode;
      return hasPersonal && hasContact && hasAddress && hasFamily && hasDocuments && hasAcademic && hasBank;
    }
    
    return hasPersonal && hasContact && hasAddress && hasFamily && hasDocuments;
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
      markStepComplete(6);
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
        
        {/* Personal Details */}
        {renderSection(
          "Personal Details",
          {
            "Name": formData.personal.name,
            "Date of Birth": formData.personal.dateOfBirth,
            "Gender": formData.personal.gender,
            "Caste": formData.personal.caste,
          },
          "person",
          () => navigation.navigate('personal')
        )}

        {/* Academic Details (Professional only) */}
        {isProfessionalForm(formData) && renderSection(
          "Academic Details",
          {
            "PU Percentage": `${formData.academic.puPercentage}%`,
            "CET/NEET Rank": formData.academic.cetNeetRank || 'N/A',
            "Course Type": formData.academic.courseTypeID,
            "College Name": formData.academic.collegeName,
            "College Type": formData.academic.collegeTypeID === '1' ? 'Government' : formData.academic.collegeTypeID === '2' ? 'Aided' : 'Private',
            "Annual Fees": `₹${formData.academic.collegeFees}`,
          },
          "school",
          () => navigation.navigate('academic')
        )}

        {/* Bank Details (Professional only) */}
        {isProfessionalForm(formData) && renderSection(
          "Bank Details",
          {
            "Account Holder": formData.bank.accountHolderName,
            "Bank Name": formData.bank.bankName,
            "Account Number": formData.bank.accountNumber,
            "IFSC Code": formData.bank.ifscCode,
            "Branch": formData.bank.branchName || 'N/A',
          },
          "card",
          () => navigation.navigate('bank')
        )}

        {/* Contact Information */}
        {renderSection(
          "Contact Information",
          {
            "Email": formData.contact.email,
            "Phone": formData.contact.phone,
          },
          "mail",
          () => navigation.navigate('contact')
        )}

        {/* Address Details */}
        {renderSection(
          "Address Details",
          {
            "Pincode": formData.address.pincode,
            "District": formData.address.district,
            "Taluk": formData.address.taluk,
            "Place": formData.address.place,
            "Address": formData.address.address,
          },
          "location",
          () => navigation.navigate('address')
        )}

        {/* Family Information */}
        {renderSection(
          "Family Information",
          {
            "Father's Occupation ID": formData.family.fatherOccupationID || 'N/A',
            "Mother's Occupation ID": formData.family.motherOccupationID || 'N/A',
            "Family Members": formData.family.familyMembers,
            "Annual Income": formData.family.annualIncome || 'N/A',
          },
          "people",
          () => navigation.navigate('family')
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
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>Marks Card:</Text>
              <Text style={isProfessionalForm(formData) && 'marksCard' in formData.documents && formData.documents.marksCard ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && 'marksCard' in formData.documents && formData.documents.marksCard ? '✓ Uploaded' : 'Not uploaded'}
              </Text>
            </View>
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>Aadhaar Card:</Text>
              <Text style={isProfessionalForm(formData) && 'aadhaar' in formData.documents && formData.documents.aadhaar ? styles.documentUploaded : styles.documentPending}>
                {isProfessionalForm(formData) && 'aadhaar' in formData.documents && formData.documents.aadhaar ? '✓ Uploaded' : 'Not uploaded'}
              </Text>
            </View>
            <View style={styles.documentRow}>
              <Text style={styles.documentLabel}>Income Certificate:</Text>
              <Text style={formData.documents.incomeCert ? styles.documentUploaded : styles.documentPending}>
                {formData.documents.incomeCert ? '✓ Uploaded' : 'Not uploaded'}
              </Text>
            </View>
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
