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
import { SEMI_PROFESSIONAL_UPLOAD_RULES, validateSemiProfUpload } from '@/forms/semiProfessional/uploads';
import { SEMI_PROFESSIONAL_FILE_KEYS } from '@/forms/semiProfessional/fileKeys';
import { UploadedDocument } from '@/types/documents';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

interface DocumentFormData {
  pucMarksCard?: UploadedDocument;
  incomeCertificate?: UploadedDocument;
  aadharCard?: UploadedDocument;
  houseVisitLink: string;
}

export default function DocumentSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData, uploadState, updateUploadState } = useFormEngineStore();

  const documentData = (formData as any).documents ?? {
    pucMarksCard: undefined,
    incomeCertificate: undefined,
    aadharCard: undefined,
    houseVisitLink: '',
  };

  const { control, handleSubmit, formState, watch } = useForm<DocumentFormData>({
    defaultValues: {
      pucMarksCard: documentData.pucMarksCard ?? undefined,
      incomeCertificate: documentData.incomeCertificate ?? undefined,
      aadharCard: documentData.aadharCard ?? undefined,
      houseVisitLink: documentData.houseVisitLink ?? '',
    },
    mode: 'onChange',
  });

  const houseVisitLinkValue = watch('houseVisitLink');

  const handleFileUpload = async (documentKey: string) => {
    console.log('[SemiProf DocumentSection] Handling file upload for:', documentKey);

    updateUploadState(documentKey, { isUploading: true, error: undefined, progress: 0 });

    const file = await pickDocument();

    if (!file) {
      console.log('[SemiProf DocumentSection] No file selected or picker canceled');
      updateUploadState(documentKey, { isUploading: false });
      return;
    }

    console.log('[SemiProf DocumentSection] File picked:', file);

    const validation = validateSemiProfUpload(file, documentKey);
    if (!validation.valid) {
      console.error('[SemiProf DocumentSection] File validation failed:', validation.error);
      updateUploadState(documentKey, { isUploading: false, error: validation.error });
      return;
    }

    console.log('[SemiProf DocumentSection] File validation passed');

    const updatedDocuments = {
      ...documentData,
      [documentKey]: {
        file: file,
        uploadedAt: new Date().toISOString(),
      },
    };
    updateSectionData('documents', updatedDocuments);

    updateUploadState(documentKey, { isUploading: false, uploaded: true, progress: 100 });
    console.log('[SemiProf DocumentSection] File upload complete for:', documentKey);
  };

  const handleDeleteFile = (documentKey: string) => {
    console.log('[SemiProf DocumentSection] Deleting file for:', documentKey);

    const updatedDocuments = {
      ...documentData,
      [documentKey]: null,
    };
    updateSectionData('documents', updatedDocuments);
    updateUploadState(documentKey, { isUploading: false, uploaded: false, error: undefined, progress: 0 });
  };

  const onSubmit = (data: DocumentFormData) => {
    const updatedDocuments = {
      pucMarksCard: documentData.pucMarksCard ?? undefined,
      incomeCertificate: documentData.incomeCertificate ?? undefined,
      aadharCard: documentData.aadharCard ?? undefined,
      houseVisitLink: data.houseVisitLink,
    };

    updateSectionData('documents', updatedDocuments);
    updateValidationState('documents', { isValid: true, data: updatedDocuments });
    markStepComplete(5);
    navigation.navigate('review');
  };

  return (
    <FormScreenLayout
      title="Document Upload"
      step={6}
      totalSteps={8}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Required Documents */}
        <FormSectionHeader
          icon="attach"
          title="Upload Documents"
          subtitle="Upload PU Marks Card, Income Certificate and Aadhaar Card"
        />

        <FormCard>
          <FileUploadField
            title="PU Marks Card"
            subtitle="Upload your PU marks card (PDF/JPG, max 2MB)"
            file={documentData.pucMarksCard?.file}
            meta={uploadState[SEMI_PROFESSIONAL_FILE_KEYS.PUC_MARKS_CARD]}
            onUpload={() => handleFileUpload(SEMI_PROFESSIONAL_FILE_KEYS.PUC_MARKS_CARD)}
            onDelete={() => handleDeleteFile(SEMI_PROFESSIONAL_FILE_KEYS.PUC_MARKS_CARD)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <FileUploadField
            title="Income Certificate"
            subtitle="Upload family income certificate (PDF/JPG, max 2MB)"
            file={documentData.incomeCertificate?.file}
            meta={uploadState[SEMI_PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE]}
            onUpload={() => handleFileUpload(SEMI_PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE)}
            onDelete={() => handleDeleteFile(SEMI_PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <FileUploadField
            title="Aadhaar Card"
            subtitle="Upload your Aadhaar card (PDF/JPG, max 2MB)"
            file={documentData.aadharCard?.file}
            meta={uploadState[SEMI_PROFESSIONAL_FILE_KEYS.AADHAR_CARD]}
            onUpload={() => handleFileUpload(SEMI_PROFESSIONAL_FILE_KEYS.AADHAR_CARD)}
            onDelete={() => handleDeleteFile(SEMI_PROFESSIONAL_FILE_KEYS.AADHAR_CARD)}
            maxSize={2 * 1024 * 1024}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        {/* House Visit Link */}
        <FormSectionHeader
          icon="link"
          title="House Visit Google Link"
          subtitle="Paste the Google link for house visit verification"
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
                placeholder="Paste Google link here"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                multiline
                numberOfLines={3}
                error={formState.errors.houseVisitLink?.message}
                helperText="Optional: Link for house visit verification"
              />
            )}
          />
        </FormCard>

        {/* Upload Guidelines */}
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
              <Text style={styles.statusLabel}>PU Marks Card:</Text>
              <Text style={[
                styles.statusText,
                uploadState[SEMI_PROFESSIONAL_FILE_KEYS.PUC_MARKS_CARD]?.uploaded ? styles.successText : styles.pendingText
              ]}>
                {uploadState[SEMI_PROFESSIONAL_FILE_KEYS.PUC_MARKS_CARD]?.uploaded ? '✓ Uploaded' : 'Pending'}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Income Certificate:</Text>
              <Text style={[
                styles.statusText,
                uploadState[SEMI_PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE]?.uploaded ? styles.successText : styles.pendingText
              ]}>
                {uploadState[SEMI_PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE]?.uploaded ? '✓ Uploaded' : 'Pending'}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Aadhaar Card:</Text>
              <Text style={[
                styles.statusText,
                uploadState[SEMI_PROFESSIONAL_FILE_KEYS.AADHAR_CARD]?.uploaded ? styles.successText : styles.pendingText
              ]}>
                {uploadState[SEMI_PROFESSIONAL_FILE_KEYS.AADHAR_CARD]?.uploaded ? '✓ Uploaded' : 'Pending'}
              </Text>
            </View>
          </View>
        </FormCard>
      </ScrollView>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
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
