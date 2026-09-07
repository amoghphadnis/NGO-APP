import { ScrollView, StyleSheet, Text, View } from 'react-native';

import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FileUploadField from '@/components/form/FileUploadField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { SEMI_PROFESSIONAL_FILE_KEYS } from '@/forms/semiProfessional/fileKeys';
import { validateSemiProfUpload } from '@/forms/semiProfessional/uploads';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { UploadedDocument } from '@/types/documents';
import { pickDocument } from '@/utils/filePicker';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

interface DocumentFormData {
  pucMarksCard?: UploadedDocument;
  incomeCertificate?: UploadedDocument;
  aadharCard?: UploadedDocument;
}

const DOC_KEYS = [
  { key: SEMI_PROFESSIONAL_FILE_KEYS.PUC_MARKS_CARD, label: 'PUC Marks Card', subtitle: 'Upload PUC marks card (PDF/JPG, max 2MB)' },
  { key: SEMI_PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE, label: 'Income Certificate', subtitle: 'Upload family income certificate (PDF/JPG, max 2MB)' },
  { key: SEMI_PROFESSIONAL_FILE_KEYS.AADHAR_CARD, label: 'Aadhar Card', subtitle: 'Upload Aadhar card (PDF/JPG, max 2MB)' },
];

export default function DocumentSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData, uploadState, updateUploadState } = useFormEngineStore();

  const documentData = (formData as any).documents ?? {};

  const handleFileUpload = async (documentKey: string) => {
    updateUploadState(documentKey, { isUploading: true, error: undefined, progress: 0 });

    const file = await pickDocument();
    if (!file) {
      updateUploadState(documentKey, { isUploading: false });
      return;
    }

    const validation = validateSemiProfUpload(file, documentKey);
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
    updateUploadState(documentKey, { isUploading: false, uploaded: true, progress: 100 });
  };

  const handleDeleteFile = (documentKey: string) => {
    const updatedDocuments = {
      ...documentData,
      [documentKey]: null,
    };
    updateSectionData('documents', updatedDocuments);
    updateUploadState(documentKey, { isUploading: false, uploaded: false, error: undefined, progress: 0 });
  };

  const onSubmit = () => {
    updateValidationState('documents', { isValid: true, data: documentData });
    markStepComplete(4);
    navigation.navigate('review');
  };

  return (
    <FormScreenLayout
      title="Document Upload"
      step={5}
      totalSteps={7}
      onBack={navigation.goBack}
      onNext={onSubmit}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <FormSectionHeader
          icon="attach"
          title="Upload Documents"
          subtitle="Upload all applicable documents (PDF/JPG/PNG, max 2MB each)"
        />

        {DOC_KEYS.map((doc) => (
          <FormCard key={doc.key}>
            <FileUploadField
              title={doc.label}
              subtitle={doc.subtitle}
              file={documentData[doc.key]?.file}
              meta={uploadState[doc.key]}
              onUpload={() => handleFileUpload(doc.key)}
              onDelete={() => handleDeleteFile(doc.key)}
              maxSize={2 * 1024 * 1024}
              acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
            />
          </FormCard>
        ))}

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

        <FormSectionHeader
          icon="checkmark-circle"
          title="Upload Status"
          subtitle="Current upload progress"
        />

        <FormCard>
          <View style={styles.statusContainer}>
            {DOC_KEYS.map((doc) => (
              <View key={doc.key} style={styles.statusItem}>
                <Text style={styles.statusLabel}>{doc.label}:</Text>
                <Text style={[
                  styles.statusText,
                  uploadState[doc.key]?.uploaded ? styles.successText : styles.pendingText
                ]}>
                  {uploadState[doc.key]?.uploaded ? '✓ Uploaded' : 'Pending'}
                </Text>
              </View>
            ))}
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
