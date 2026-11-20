import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import VPInputField from '@/components/common/VPInputField';
import FileUploadField from '@/components/form/FileUploadField';
import UploadSizeNotice from '@/components/form/UploadSizeNotice';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { pickDocument } from '@/utils/filePicker';
import { isVideoFile, MAX_VIDEO_SIZE_BYTES } from '@/utils/fileValidation';
import { getTotalUploadSizeBytes } from '@/utils/uploadSize';

interface DocumentSectionProps {
  navigation: any;
}

// Matches the on-screen "File size should not exceed 5MB" guideline.
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const FILE_KEYS = [
  'sslcMarksCard',
  'studentPhoto',
  'electricityBill',
  'rationCards',
  'incomeCertificate',
  'familyPhoto',
  'houseVideo',
] as const;

const FILE_LABELS: Record<string, { title: string; subtitle: string; acceptedTypes?: string[] }> = {
  sslcMarksCard: {
    title: 'SSLC Marks Card',
    subtitle: 'Upload SSLC marks card',
  },
  studentPhoto: {
    title: 'Student Photo',
    subtitle: 'Upload recent photo/selfie',
    acceptedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  },
  electricityBill: {
    title: 'Latest Electricity Bill',
    subtitle: 'Upload latest electricity bill',
  },
  rationCards: {
    title: 'Ration Card',
    subtitle: 'Upload ration card (both sides)',
  },
  incomeCertificate: {
    title: 'Income Certificate',
    subtitle: 'Upload income certificate',
  },
  familyPhoto: {
    title: 'Family Photo',
    subtitle: 'Photo of family in front of dwelling unit',
    acceptedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  },
  houseVideo: {
    title: 'House Video',
    subtitle: 'Upload video of your house (MP4, MOV, max 50MB)',
    acceptedTypes: ['video/*'],
  },
};

export default function DocumentSection({ navigation }: DocumentSectionProps) {
  const { updateSectionData, markStepComplete, updateValidationState, formData, uploadState, updateUploadState } = useFormEngineStore();

  const documentData = (formData as any).documents ?? {};

  const handleFileUpload = async (documentKey: string) => {
    updateUploadState(documentKey, { isUploading: true, error: undefined, progress: 0 });

    const isVideo = documentKey === 'houseVideo';
    const file = await pickDocument(FILE_LABELS[documentKey].acceptedTypes);

    if (!file) {
      updateUploadState(documentKey, { isUploading: false });
      return;
    }

    const maxBytes = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_FILE_BYTES;
    if (!isVideo && isVideoFile(file)) {
      updateUploadState(documentKey, {
        isUploading: false,
        error: 'Videos are not allowed here. Please upload an image (JPG, PNG) or PDF up to 5MB.',
      });
      return;
    }
    if ((file.size ?? 0) > maxBytes) {
      updateUploadState(documentKey, {
        isUploading: false,
        error: `File is ${((file.size ?? 0) / (1024 * 1024)).toFixed(1)}MB — exceeds the ${isVideo ? '50' : '5'}MB limit. Please choose a smaller file.`,
      });
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

  const handleHouseVisitLinkChange = (value: string) => {
    updateSectionData('documents', { ...documentData, houseVisitLink: value });
  };

  const onSubmit = () => {
    const missing = FILE_KEYS.filter((key) => !documentData[key]?.file);
    if (missing.length > 0 || !documentData.houseVisitLink || !documentData.houseVisitLink.startsWith('http')) {
      const errors: Record<string, string> = {};
      missing.forEach((key) => {
        errors[key] = `${FILE_LABELS[key].title} is required`;
      });
      if (!documentData.houseVisitLink || !documentData.houseVisitLink.startsWith('http')) {
        errors.houseVisitLink = 'Please enter a valid Google Maps link';
      }
      updateValidationState('documents', { isValid: false, data: documentData, errors });
      return;
    }
    updateValidationState('documents', { isValid: true, data: documentData });
    markStepComplete(7);
    navigation.navigate('review');
  };

  return (
    <FormScreenLayout
      title="Document Upload"
      step={8}
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
            <Text style={styles.guidelineText}>• File size should not exceed 5MB (50MB for house video)</Text>
            <Text style={styles.guidelineText}>• Accepted formats: PDF, JPG, PNG (video for house video)</Text>
            <Text style={styles.guidelineText}>• Ensure documents are valid and not expired</Text>
          </View>
        </FormCard>

        {FILE_KEYS.map((key) => (
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

        <FormSectionHeader
          icon="location"
          title="House Location"
          subtitle="Google Maps link for house visit"
          showRequired
        />
        <FormCard>
          <VPInputField
            label="House Visit Link (Google Maps)"
            value={documentData.houseVisitLink || ''}
            onChangeText={handleHouseVisitLinkChange}
            placeholder="https://maps.google.com/..."
            multiline
            numberOfLines={3}
            required
          />
          <Text style={styles.helperText}>
            Paste the Google Maps link to your house location
          </Text>
        </FormCard>

        <UploadSizeNotice totalBytes={getTotalUploadSizeBytes(documentData)} />
      </ScrollView>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  helperText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
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
