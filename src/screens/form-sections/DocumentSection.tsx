import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import FileUploadField from '@/components/form/FileUploadField';
import { useFormEngineStore } from '../../store/useFormEngineStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

interface DocumentFormData {
  marksCard?: any;
  aadhaar?: any;
  incomeCert?: any;
}

export default function DocumentSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData, uploadState } = useFormEngineStore();

  const documentData = formData?.documents ?? {
    marksCard: null,
    aadhaar: null,
    incomeCert: null,
  };

  const { control, handleSubmit, formState } = useForm<DocumentFormData>({
    defaultValues: {
      marksCard: documentData.marksCard ?? null,
      aadhaar: documentData.aadhaar ?? null,
      incomeCert: documentData.incomeCert ?? null,
    },
    mode: 'onChange',
  });

  const allDocumentsUploaded = 
    uploadState.marksCard?.uploaded &&
    uploadState.aadhaar?.uploaded &&
    uploadState.incomeCert?.uploaded;

  const onSubmit = () => {
    const updatedDocuments = {
      marksCard: documentData.marksCard,
      aadhaar: documentData.aadhaar,
      incomeCert: documentData.incomeCert,
    };
    
    updateSectionData('documents', updatedDocuments);
    updateValidationState('documents', { isValid: allDocumentsUploaded, data: updatedDocuments });
    markStepComplete(5);
    navigation.navigate('review');
  };

  const isNextDisabled = !allDocumentsUploaded;

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
          <Text style={styles.documentTitle}>Previous Year Marks Card</Text>
          <Text style={styles.documentSubtitle}>
            Upload your previous year marks card (PDF/JPG, max 2MB)
          </Text>
          <FileUploadField
            title="Previous Year Marks Card"
            subtitle="Upload your marks card (PDF/JPG, max 2MB)"
            file={documentData.marksCard}
            meta={uploadState.marksCard}
            onUpload={() => {
              // File upload logic will be handled by the component
            }}
            maxSize={2 * 1024 * 1024} // 2MB
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <Text style={styles.documentTitle}>Aadhaar Card</Text>
          <Text style={styles.documentSubtitle}>
            Upload your Aadhaar card (PDF/JPG, max 2MB)
          </Text>
          <FileUploadField
            title="Aadhaar Card"
            subtitle="Upload your Aadhaar card (PDF/JPG, max 2MB)"
            file={documentData.aadhaar}
            meta={uploadState.aadhaar}
            onUpload={() => {
              // File upload logic will be handled by component
            }}
            maxSize={2 * 1024 * 1024} // 2MB
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
          />
        </FormCard>

        <FormCard>
          <Text style={styles.documentTitle}>Income Certificate</Text>
          <Text style={styles.documentSubtitle}>
            Upload family income certificate (PDF/JPG, max 2MB)
          </Text>
          <FileUploadField
            title="Income Certificate"
            subtitle="Upload family income certificate (PDF/JPG, max 2MB)"
            file={documentData.incomeCert}
            meta={uploadState.incomeCert}
            onUpload={() => {
              // File upload logic will be handled by component
            }}
            maxSize={2 * 1024 * 1024} // 2MB
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
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
