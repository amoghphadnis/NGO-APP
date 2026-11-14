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
import { isVideoFile } from '@/utils/fileValidation';
import { getTotalUploadSizeBytes } from '@/utils/uploadSize';
import { z } from 'zod';

interface DocumentSectionProps {
  navigation: any;
}

// Schema for house visit link validation
const houseVisitSchema = z.object({
  houseVisitLink: z.string().min(1, { message: 'House visit link is required' })
    .refine((val) => val.startsWith('http'), {
      message: 'Please enter a valid URL starting with http:// or https://',
    }),
});

// Matches the on-screen "File size should not exceed 5MB" guideline.
const PAYANA_MAX_FILE_BYTES = 5 * 1024 * 1024;

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

    // Reject oversized or video files immediately so the user can pick again.
    if (isVideoFile(file)) {
      updateUploadState(documentKey, {
        isUploading: false,
        error: 'Videos are not allowed. Please upload an image (JPG, PNG) or PDF up to 5MB.',
      });
      return;
    }
    if ((file.size ?? 0) > PAYANA_MAX_FILE_BYTES) {
      updateUploadState(documentKey, {
        isUploading: false,
        error: `File is ${((file.size ?? 0) / (1024 * 1024)).toFixed(1)}MB — exceeds the 5MB limit. Please choose a smaller file.`,
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
    const updatedDocuments = {
      ...documentData,
      houseVisitLink: value,
    };
    updateSectionData('documents', updatedDocuments);
  };

  const onSubmit = () => {
    // Validate house visit link
    if (!documentData.houseVisitLink || !documentData.houseVisitLink.startsWith('http')) {
      updateValidationState('documents', { 
        isValid: false, 
        data: documentData,
        errors: { houseVisitLink: 'Please enter a valid Google Maps link' }
      });
      return;
    }
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

        {/* House Visit Link */}
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
