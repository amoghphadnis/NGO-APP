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
import { UploadedDocument } from '@/types/documents';
import { isProfessionalForm } from '@/types/forms';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

interface DocumentFormData {
  marksCard?: UploadedDocument;
  aadhaar?: UploadedDocument;
  incomeCert?: UploadedDocument;
  houseVisitLink: string;
}

export default function DocumentSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData, uploadState, updateUploadState } = useFormEngineStore();

  const documentData = (isProfessionalForm(formData) ? formData.documents : null) ?? {
    marksCard: undefined,
    aadhaar: undefined,
    incomeCert: undefined,
    houseVisitLink: '',
  };

  const { control, handleSubmit, formState, watch } = useForm<DocumentFormData>({
    defaultValues: {
      marksCard: 'marksCard' in documentData ? documentData.marksCard : undefined,
      aadhaar: 'aadhaar' in documentData ? documentData.aadhaar : undefined,
      incomeCert: 'incomeCert' in documentData ? documentData.incomeCert : undefined,
      houseVisitLink: documentData.houseVisitLink ?? '',
    },
    mode: 'onChange',
  });

  // Watch the houseVisitLink value for live validation
  const houseVisitLinkValue = watch('houseVisitLink');

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

  const allDocumentsUploaded = 
    uploadState[PROFESSIONAL_FILE_KEYS.MARKS_CARD]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.AADHAR_CARD]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE]?.uploaded;

  const isHouseVisitLinkValid = (link: string): boolean => {
    return link.trim().startsWith('https://');
  };

  const onSubmit = (data: DocumentFormData) => {
    const updatedDocuments = {
      marksCard: 'marksCard' in documentData ? documentData.marksCard : undefined,
      aadhaar: 'aadhaar' in documentData ? documentData.aadhaar : undefined,
      incomeCert: 'incomeCert' in documentData ? documentData.incomeCert : undefined,
      houseVisitLink: data.houseVisitLink,
    };
    
    updateSectionData('documents', updatedDocuments);
    updateValidationState('documents', { isValid: allDocumentsUploaded && isHouseVisitLinkValid(data.houseVisitLink), data: updatedDocuments });
    markStepComplete(6);
    navigation.navigate('review');
  };

  const isNextDisabled = !allDocumentsUploaded || !isHouseVisitLinkValid(houseVisitLinkValue || '');

  // Debug logging
  console.log('[DocumentSection] Debug:', {
    allDocumentsUploaded,
    marksCardUploaded: uploadState[PROFESSIONAL_FILE_KEYS.MARKS_CARD]?.uploaded,
    aadhaarUploaded: uploadState[PROFESSIONAL_FILE_KEYS.AADHAR_CARD]?.uploaded,
    incomeCertUploaded: uploadState[PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE]?.uploaded,
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
        {/* Required Documents */}
        <FormSectionHeader
          icon="attach"
          title="Required Documents"
          subtitle="Upload all mandatory documents"
          showRequired
        />
        
        <FormCard>
          <FileUploadField
            title="PU Marks Card"
            subtitle="Upload your PU marks card"
            file={documentData.marksCard?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.MARKS_CARD]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.MARKS_CARD)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.MARKS_CARD)}
            maxSize={2 * 1024 * 1024} // 2MB
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <FileUploadField
            title="Aadhaar Card"
            subtitle="Upload your Aadhaar card (PDF/JPG, max 2MB)"
            file={documentData.aadhaar?.file}
            meta={uploadState[PROFESSIONAL_FILE_KEYS.AADHAR_CARD]}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.AADHAR_CARD)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.AADHAR_CARD)}
            maxSize={2 * 1024 * 1024} // 2MB
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <FileUploadField
            title="Income Certificate"
            subtitle="Upload family income certificate (PDF/JPG, max 2MB)"
            file={documentData.incomeCert?.file}
            meta={uploadState.incomeCert}
            onUpload={() => handleFileUpload(PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE)}
            onDelete={() => handleDeleteFile(PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE)}
            maxSize={2 * 1024 * 1024} // 2MB
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        {/* House Visit Link */}
        <FormSectionHeader
          icon="link"
          title="House Visit Google Link"
          subtitle="Paste the Google link for house visit verification"
          showRequired
        />
        
        <FormCard>
          <Controller
            control={control}
            name="houseVisitLink"
            render={({ field: { onChange, value } }) => (
              <VPInputField
                label="House Visit Google Link"
                value={value}
                onChangeText={onChange}
                placeholder="https://..."
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                multiline
                numberOfLines={3}
                error={formState.errors.houseVisitLink?.message}
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
                Documents must be clear and readable
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
                Supported formats: PDF, JPG, PNG
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineBullet}>•</Text>
              <Text style={styles.guidelineText}>
                Original documents will be verified during the process
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineBullet}>•</Text>
              <Text style={styles.guidelineText}>
                Ensure all information is visible and not blurred
              </Text>
            </View>
          </View>
        </FormCard>

        {/* Upload Status */}
        <FormSectionHeader
          icon="checkmark-circle"
          title="Upload Status"
          subtitle="Current upload progress"
        />
        
        <FormCard>
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Marks Card:</Text>
              <Text style={[
                styles.statusText,
                uploadState.marksCard?.uploaded ? styles.successText : styles.pendingText
              ]}>
                {uploadState.marksCard?.uploaded ? '✓ Uploaded' : 'Pending'}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Aadhaar Card:</Text>
              <Text style={[
                styles.statusText,
                uploadState.aadhaar?.uploaded ? styles.successText : styles.pendingText
              ]}>
                {uploadState.aadhaar?.uploaded ? '✓ Uploaded' : 'Pending'}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Income Certificate:</Text>
              <Text style={[
                styles.statusText,
                uploadState.incomeCert?.uploaded ? styles.successText : styles.pendingText
              ]}>
                {uploadState.incomeCert?.uploaded ? '✓ Uploaded' : 'Pending'}
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
