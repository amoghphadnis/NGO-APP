import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import FileUploadField from '@/components/form/FileUploadField';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { pickDocument } from '@/utils/filePicker';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface DocumentSectionProps {
  navigation: any;
}

const PAYANA_FILE_KEYS = [
  'latestMarksCard',
  'studentPassbookFP',
  'studentPhoto',
  'dwellingUnit',
  'aadhaarCard',
] as const;

const FILE_LABELS: Record<string, { title: string; subtitle: string; acceptedTypes?: string[] }> = {
  latestMarksCard: {
    title: 'Latest Marks Card',
    subtitle: 'Upload latest marks sheet (if available)',
  },
  studentPassbookFP: {
    title: 'Bank Passbook',
    subtitle: 'Upload bank passbook first page',
  },
  studentPhoto: {
    title: 'Student Photo',
    subtitle: 'Upload recent photo/selfie',
    acceptedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  },
  dwellingUnit: {
    title: 'Dwelling Unit Photo',
    subtitle: 'Upload photo of your house',
    acceptedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  },
  aadhaarCard: {
    title: 'Aadhaar Card',
    subtitle: 'Upload Aadhaar card photo',
  },
};

export default function DocumentSection({ navigation }: DocumentSectionProps) {
  const { updateSectionData, markStepComplete, updateValidationState, formData, uploadState, updateUploadState } = useFormEngineStore();

  const documentData = (formData as any).documents ?? {
    latestMarksCard: undefined,
    studentPassbookFP: undefined,
    studentPhoto: undefined,
    dwellingUnit: undefined,
    aadhaarCard: undefined,
    houseVisitLink: '',
  };

  const handleFileUpload = async (documentKey: string) => {
    updateUploadState(documentKey, { isUploading: true, error: undefined, progress: 0 });

    const file = await pickDocument();
    
    if (!file) {
      updateUploadState(documentKey, { isUploading: false });
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
    updateUploadState(documentKey, { isUploading: false, uploaded: true, progress: 100 });
  };

  const handleDeleteFile = (documentKey: string) => {
    const updatedDocuments = {
      ...documentData,
      [documentKey]: undefined,
    };
    updateSectionData('documents', updatedDocuments);
    updateUploadState(documentKey, { isUploading: false, uploaded: false, error: undefined, progress: 0 });
  };

  const onSubmit = () => {
    updateValidationState('documents', { isValid: true, data: documentData });
    markStepComplete(8);
    navigation.navigate('review');
  };

  return (
    <FormScreenLayout
      title="Document Upload"
      step={9}
      onBack={navigation.goBack}
      onNext={onSubmit}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <FormSectionHeader
          icon="document-text"
          title="Required Documents"
          subtitle="Upload all required documents"
          showRequired
        />
        
        <FormCard>
          <View style={styles.guidelineContainer}>
            <Text style={styles.guidelineTitle}>Document Requirements:</Text>
            <Text style={styles.guidelineText}>• All documents must be clear and readable</Text>
            <Text style={styles.guidelineText}>• File size should not exceed 5MB</Text>
            <Text style={styles.guidelineText}>• Accepted formats: PDF, JPG, PNG</Text>
            <Text style={styles.guidelineText}>• Ensure documents are valid and not expired</Text>
          </View>
        </FormCard>

        {PAYANA_FILE_KEYS.map((key) => (
          <React.Fragment key={key}>
            <FormSectionHeader
              icon="document-attach"
              title={FILE_LABELS[key].title}
              subtitle={FILE_LABELS[key].subtitle}
            />
            <FormCard>
              <FileUploadField
                title={FILE_LABELS[key].title}
                subtitle={FILE_LABELS[key].subtitle}
                file={documentData[key]?.file}
                meta={uploadState[key]}
                onUpload={() => handleFileUpload(key)}
                onDelete={() => handleDeleteFile(key)}
                acceptedTypes={FILE_LABELS[key].acceptedTypes}
              />
            </FormCard>
          </React.Fragment>
        ))}
      </ScrollView>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  guidelineContainer: {
    paddingVertical: spacing.sm,
  },
  guidelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  guidelineText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
});
