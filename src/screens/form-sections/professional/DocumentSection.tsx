import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import FileUploadField from '@/components/form/FileUploadField';
import VPInputField from '@/components/common/VPInputField';
import { useFormEngineStore } from '../../../store/useFormEngineStore';
import { pickDocument } from '@/utils/filePicker';
import { PROFESSIONAL_UPLOAD_RULES, validateUpload } from '@/forms/professional/uploads';
import { PROFESSIONAL_FILE_KEYS } from '@/forms/professional/fileKeys';
import { isProfessionalForm } from '@/types/forms';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

interface DocumentFormData {
  HouseVisitLink: string;
}

export default function DocumentSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData, uploadState, updateUploadState } = useFormEngineStore();

  const documentData = (isProfessionalForm(formData) ? formData.documents : null) ?? {
    PUCMarksCard: undefined,
    IncomeCertificate: undefined,
    Rationcard: undefined,
    Electricitybill: undefined,
    CollegeID: undefined,
    Admissionproof: undefined,
    FeesReceipts: undefined,
    Expenditure: undefined,
    Studentphoto: undefined,
    Photoinfrontofcollege: undefined,
    Dwellingunit: undefined,
    CET: undefined,
    Studentpass: undefined,
    Monthsbank: undefined,
    AadharCard: undefined,
    Handwritten: undefined,
    HouseVisitLink: '',
  };

  const { control, handleSubmit, formState, watch } = useForm<DocumentFormData>({
    defaultValues: {
      HouseVisitLink: documentData.HouseVisitLink ?? '',
    },
    mode: 'onChange',
  });

  // Watch the HouseVisitLink value for live validation
  const houseVisitLinkValue = watch('HouseVisitLink');

  const handleFileUpload = async (documentKey: string) => {
    console.log('[DocumentSection] Handling file upload for:', documentKey);
    
    updateUploadState(documentKey, { isUploading: true, error: undefined, progress: 0 });

    const file = await pickDocument();
    
    if (!file) {
      console.log('[DocumentSection] No file selected or picker canceled');
      updateUploadState(documentKey, { isUploading: false });
      return;
    }

    console.log('[DocumentSection] File picked:', file);

    // Validate the file
    const validation = validateUpload(file, documentKey);
    if (!validation.valid) {
      console.error('[DocumentSection] File validation failed:', validation.error);
      updateUploadState(documentKey, { isUploading: false, error: validation.error });
      return;
    }

    console.log('[DocumentSection] File validation passed');

    // Update the documents in the store with UploadedDocument structure
    const updatedDocuments = {
      ...documentData,
      [documentKey]: {
        file: file,
        uploadedAt: new Date().toISOString(),
      },
    };
    updateSectionData('documents', updatedDocuments);

    // Mark as uploaded (simulated - in real app, this would be after server upload)
    updateUploadState(documentKey, { isUploading: false, uploaded: true, progress: 100 });

    console.log('[DocumentSection] File upload complete for:', documentKey);
  };

  const handleDeleteFile = (documentKey: string) => {
    console.log('[DocumentSection] Deleting file for:', documentKey);
    
    const updatedDocuments = {
      ...documentData,
      [documentKey]: null,
    };
    updateSectionData('documents', updatedDocuments);
    updateUploadState(documentKey, { isUploading: false, uploaded: false, error: undefined, progress: 0 });
  };

  // Check if all 16 documents are uploaded
  const allDocumentsUploaded = 
    uploadState[PROFESSIONAL_FILE_KEYS.PUC_MARKS_CARD]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.RATION_CARD]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.ELECTRICITY_BILL]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.COLLEGE_ID]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.ADMISSION_PROOF]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.FEES_RECEIPTS]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.EXPENDITURE]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.STUDENT_PHOTO]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.PHOTO_IN_FRONT_OF_COLLEGE]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.DWELLING_UNIT]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.CET_RANK_SHEET]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.STUDENT_PASSBOOK]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.MONTHS_BANK_STATEMENT]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.AADHAR_CARD]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.HANDWRITTEN_DECLARATION]?.uploaded;

  const isHouseVisitLinkValid = (link: string): boolean => {
    return link.trim().startsWith('https://');
  };

  const onSubmit = (data: DocumentFormData) => {
    updateSectionData('documents', { ...documentData, HouseVisitLink: data.HouseVisitLink });
    updateValidationState('documents', { isValid: allDocumentsUploaded && isHouseVisitLinkValid(data.HouseVisitLink), data: { ...documentData, HouseVisitLink: data.HouseVisitLink } });
    markStepComplete(6);
    navigation.navigate('review');
  };

  const isNextDisabled = !allDocumentsUploaded || !isHouseVisitLinkValid(houseVisitLinkValue || '');

  // Debug logging
  console.log('[DocumentSection] Debug:', {
    allDocumentsUploaded,
    houseVisitLink: houseVisitLinkValue,
    houseVisitLinkValid: isHouseVisitLinkValid(houseVisitLinkValue || ''),
    isNextDisabled,
  });

  return (
    <FormScreenLayout
      title="Document Upload"
      step={6}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
      nextLabel="Submit Application"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Required Documents - Row 1 */}
        <FormSectionHeader
          icon="attach"
          title="Required Documents (1-4)"
          subtitle="Upload all mandatory documents (PDF/JPG/PNG, max 2MB each)"
          showRequired
        />
        
        <FormCard>
          <FileUploadField
            title="PUC Marks Card"
            subtitle="Upload your PUC marks card"
            file={documentData.PUCMarksCard?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.PUC_MARKS_CARD]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.PUC_MARKS_CARD)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.PUC_MARKS_CARD)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <FileUploadField
            title="Income Certificate"
            subtitle="Upload family income certificate"
            file={documentData.IncomeCertificate?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <FileUploadField
            title="Ration Card (Both Sides)"
            subtitle="Upload front and back of ration card"
            file={documentData.Rationcard?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.RATION_CARD]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.RATION_CARD)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.RATION_CARD)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <FileUploadField
            title="Electricity Bill"
            subtitle="Upload recent electricity bill"
            file={documentData.Electricitybill?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.ELECTRICITY_BILL]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.ELECTRICITY_BILL)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.ELECTRICITY_BILL)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        {/* Documents Row 2 */}
        <FormSectionHeader
          icon="school"
          title="College Documents (5-8)"
          subtitle="Upload college-related documents"
          showRequired
        />

        <FormCard>
          <FileUploadField
            title="College ID"
            subtitle="Upload your college ID card"
            file={documentData.CollegeID?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.COLLEGE_ID]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.COLLEGE_ID)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.COLLEGE_ID)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <FileUploadField
            title="Admission Proof/Form"
            subtitle="Upload admission proof or form"
            file={documentData.Admissionproof?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.ADMISSION_PROOF]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.ADMISSION_PROOF)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.ADMISSION_PROOF)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <FileUploadField
            title="Fees Receipts"
            subtitle="Upload fee payment receipts"
            file={documentData.FeesReceipts?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.FEES_RECEIPTS]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.FEES_RECEIPTS)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.FEES_RECEIPTS)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <FileUploadField
            title="Expenditure Certificate from College"
            subtitle="Upload expenditure certificate"
            file={documentData.Expenditure?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.EXPENDITURE]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.EXPENDITURE)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.EXPENDITURE)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        {/* Documents Row 3 */}
        <FormSectionHeader
          icon="camera"
          title="Photo Documents (9-12)"
          subtitle="Upload required photos"
          showRequired
        />

        <FormCard>
          <FileUploadField
            title="Student Photo"
            subtitle="Upload your passport size photo"
            file={documentData.Studentphoto?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.STUDENT_PHOTO]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.STUDENT_PHOTO)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.STUDENT_PHOTO)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <FileUploadField
            title="Photo in Front of College"
            subtitle="Upload photo standing in front of college"
            file={documentData.Photoinfrontofcollege?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.PHOTO_IN_FRONT_OF_COLLEGE]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.PHOTO_IN_FRONT_OF_COLLEGE)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.PHOTO_IN_FRONT_OF_COLLEGE)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <FileUploadField
            title="Dwelling Unit Photo / Family Photo in Front of House"
            subtitle="Upload family photo in front of your house"
            file={documentData.Dwellingunit?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.DWELLING_UNIT]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.DWELLING_UNIT)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.DWELLING_UNIT)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <FileUploadField
            title="CET Rank/NEET Rank Sheet"
            subtitle="Upload entrance exam rank sheet"
            file={documentData.CET?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.CET_RANK_SHEET]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.CET_RANK_SHEET)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.CET_RANK_SHEET)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        {/* Documents Row 4 */}
        <FormSectionHeader
          icon="document"
          title="Bank & ID Documents (13-16)"
          subtitle="Upload bank and identification documents"
          showRequired
        />

        <FormCard>
          <FileUploadField
            title="Student Passbook First Page Photo"
            subtitle="Upload first page of bank passbook"
            file={documentData.Studentpass?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.STUDENT_PASSBOOK]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.STUDENT_PASSBOOK)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.STUDENT_PASSBOOK)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <FileUploadField
            title="6 Months Bank Statement of Earning Member"
            subtitle="Upload bank statement of earning family member"
            file={documentData.Monthsbank?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.MONTHS_BANK_STATEMENT]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.MONTHS_BANK_STATEMENT)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.MONTHS_BANK_STATEMENT)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <FileUploadField
            title="Aadhar Card (Both Sides)"
            subtitle="Upload front and back of Aadhar card"
            file={documentData.AadharCard?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.AADHAR_CARD]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.AADHAR_CARD)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.AADHAR_CARD)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <FileUploadField
            title="Handwritten Self Declaration Letter"
            subtitle="Upload handwritten declaration letter"
            file={documentData.Handwritten?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.HANDWRITTEN_DECLARATION]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.HANDWRITTEN_DECLARATION)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.HANDWRITTEN_DECLARATION)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        {/* House Visit Link */}
        <FormSectionHeader
          icon="link"
          title="Google Location Map Link"
          subtitle="Paste the Google Maps link for house location verification"
          showRequired
        />
        
        <FormCard>
          <Controller
            control={control}
            name="HouseVisitLink"
            render={({ field: { onChange, value } }) => (
              <VPInputField
                label="Google Location Map Link"
                value={value}
                onChangeText={onChange}
                placeholder="https://..."
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                multiline
                numberOfLines={3}
                error={formState.errors.HouseVisitLink?.message}
                helperText="Link must start with https://"
                required
              />
            )}
          />
        </FormCard>

        {/* Upload Guidelines */}
        <FormSectionHeader
          icon="information-circle"
          title="Upload Guidelines"
          subtitle="Important instructions for document upload"
        />
        
        <FormCard>
          <View style={styles.guidelineContainer}>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineBullet}>•</Text>
              <Text style={styles.guidelineText}>
                All 16 documents are mandatory and must be uploaded
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineBullet}>•</Text>
              <Text style={styles.guidelineText}>
                Documents must be clear, readable, and not blurred
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineBullet}>•</Text>
              <Text style={styles.guidelineText}>
                File size should not exceed 2MB per document
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineBullet}>•</Text>
              <Text style={styles.guidelineText}>
                Supported formats: PDF, JPG, PNG only
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineBullet}>•</Text>
              <Text style={styles.guidelineText}>
                Google Location Map Link is required for verification
              </Text>
            </View>
          </View>
        </FormCard>
      </ScrollView>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  documentTitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  documentSubtitle: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  guidelineContainer: {
    padding: spacing.sm,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  guidelineBullet: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.primary,
    marginRight: spacing.sm,
    fontWeight: '600',
  },
  guidelineText: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
  },
  statusContainer: {
    padding: spacing.sm,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  statusLabel: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  statusText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    fontWeight: '600',
  },
  successText: {
    color: colors.success,
  },
  pendingText: {
    color: colors.warning,
  },
});
