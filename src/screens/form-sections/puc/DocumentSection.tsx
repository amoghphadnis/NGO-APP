import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FileUploadField from '@/components/form/FileUploadField';
import UploadSizeNotice from '@/components/form/UploadSizeNotice';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { validateUpload } from '@/forms/puc/uploads';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { isPUCForm } from '@/types/forms';
import { pickDocument } from '@/utils/filePicker';
import { getTotalUploadSizeBytes } from '@/utils/uploadSize';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

const PUC_FORMAT11_DOC_KEYS = [
  'StudentSelfie',
  'SSLCMarksCard',
  'FeeReceipts',
  'BankPassbook',
  'AadhaarCard',
  'ElectricityBill',
  'RationCard',
  'DwellingUnitPhoto',
  'HouseVideo',
  'IncomeCertificate',
] as const;

const DOC_LABELS: Record<string, { title: string; subtitle: string; icon: string }> = {
  StudentSelfie: { title: 'Student Selfie', subtitle: 'Upload your recent selfie photo', icon: 'person' },
  SSLCMarksCard: { title: 'SSLC Marks Card', subtitle: 'Upload your SSLC marks card', icon: 'school' },
  FeeReceipts: { title: 'Fee Receipts', subtitle: 'Upload college fee receipts', icon: 'receipt' },
  BankPassbook: { title: 'Bank Passbook', subtitle: 'Upload bank passbook copy', icon: 'card' },
  AadhaarCard: { title: 'Aadhaar Card', subtitle: 'Upload Aadhaar card copy', icon: 'finger-print' },
  ElectricityBill: { title: 'Electricity Bill', subtitle: 'Upload latest electricity bill', icon: 'flash' },
  RationCard: { title: 'Ration Card', subtitle: 'Upload ration card (both sides)', icon: 'card' },
  DwellingUnitPhoto: { title: 'Dwelling Unit Photo', subtitle: 'Photo of the student with family in front of the house', icon: 'home' },
  HouseVideo: { title: 'House Video', subtitle: 'Upload video of your house (MP4, MOV, max 50MB)', icon: 'videocam' },
  IncomeCertificate: { title: 'Income Certificate', subtitle: 'Upload income certificate', icon: 'receipt' },
};

const IMAGE_DOC_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const VIDEO_DOC_TYPES = ['video/*'];
const HOUSE_VIDEO_KEY = 'HouseVideo';

export default function DocumentSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData, uploadState, updateUploadState } = useFormEngineStore();

  const documentData = isPUCForm(formData) ? formData.documents ?? {
    StudentSelfie: undefined,
    SSLCMarksCard: undefined,
    FeeReceipts: undefined,
    BankPassbook: undefined,
    AadhaarCard: undefined,
  } : {
    StudentSelfie: undefined,
    SSLCMarksCard: undefined,
    FeeReceipts: undefined,
    BankPassbook: undefined,
    AadhaarCard: undefined,
  };

  const handleFileUpload = async (documentKey: string) => {
    updateUploadState(documentKey, { isUploading: true, error: undefined, progress: 0 });

    const file = await pickDocument(
      documentKey === HOUSE_VIDEO_KEY ? VIDEO_DOC_TYPES : IMAGE_DOC_TYPES
    );

    if (!file) {
      updateUploadState(documentKey, { isUploading: false });
      return;
    }

    const validation = validateUpload(file, documentKey);
    if (!validation.valid) {
      updateUploadState(documentKey, { isUploading: false, error: validation.error });
      return;
    }

    const updatedDocuments = {
      ...documentData,
      [documentKey]: {
        file: file,
        uploadedAt: new Date().toISOString(),
      },
    };
    updateSectionData('documents', updatedDocuments);
    updateUploadState(documentKey, { isUploading: false, uploaded: true, error: undefined, progress: 100 });
  };

  const handleDeleteFile = (documentKey: string) => {
    const updatedDocuments = {
      ...documentData,
      [documentKey]: undefined,
    };
    updateSectionData('documents', updatedDocuments);
    updateUploadState(documentKey, { isUploading: false, uploaded: false, error: undefined, progress: 0 });
  };

  const allDocumentsUploaded = PUC_FORMAT11_DOC_KEYS.every(key => uploadState[key]?.uploaded);

  const onSubmit = () => {
    if (!allDocumentsUploaded) {
      Alert.alert('Required Documents', 'Please upload all 10 required documents before proceeding.');
      return;
    }
    updateValidationState('documents', { isValid: allDocumentsUploaded, data: documentData });
    markStepComplete(7);
    navigation.navigate('review');
  };

  const isNextDisabled = false;

  return (
    <FormScreenLayout
      title="Document Upload"
      step={8}
      onBack={navigation.goBack}
      onNext={onSubmit}
      nextDisabled={isNextDisabled}
    >
      <FormSectionHeader
        icon="document-text"
        title="Required Documents"
        subtitle="Upload all 10 required documents"
        showRequired
      />

        <FormCard>
          <View style={styles.guidelineContainer}>
            <Text style={styles.guidelineTitle}>Document Requirements:</Text>
            <Text style={styles.guidelineText}>• All documents must be clear and readable</Text>
            <Text style={styles.guidelineText}>• File size should not exceed 2MB (50MB for house video)</Text>
            <Text style={styles.guidelineText}>• Accepted formats: PDF, JPG, JPEG, PNG (video for house video)</Text>
            <Text style={styles.guidelineText}>• All 10 documents are mandatory</Text>
          </View>
        </FormCard>

        {PUC_FORMAT11_DOC_KEYS.map((docKey) => {
          const label = DOC_LABELS[docKey];
          return (
            <React.Fragment key={docKey}>
              <FormSectionHeader
                icon={label.icon as any}
                title={label.title}
                subtitle={label.subtitle}
                showRequired
              />
              <FormCard>
                <FileUploadField
                  title={label.title}
                  subtitle={label.subtitle}
                  file={documentData[docKey]?.file}
                  meta={uploadState[docKey]}
                  onUpload={() => handleFileUpload(docKey)}
                  onDelete={() => handleDeleteFile(docKey)}
                  acceptedTypes={docKey === HOUSE_VIDEO_KEY ? VIDEO_DOC_TYPES : IMAGE_DOC_TYPES}
                  maxSize={docKey === HOUSE_VIDEO_KEY ? 50 * 1024 * 1024 : 2 * 1024 * 1024}
                />
              </FormCard>
            </React.Fragment>
          );
        })}

        <UploadSizeNotice totalBytes={getTotalUploadSizeBytes(documentData)} />
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  guidelineContainer: {
    padding: spacing.sm,
  },
  guidelineTitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  guidelineText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
});
