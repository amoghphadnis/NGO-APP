import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FileUploadField from '@/components/form/FileUploadField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { SEMI_PROFESSIONAL_FILE_KEYS } from '@/forms/semiProfessional/fileKeys';
import { getSemiProfUploadRule, validateSemiProfUpload } from '@/forms/semiProfessional/uploads';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { UploadedDocument } from '@/types/documents';
import { pickDocument } from '@/utils/filePicker';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

const VIDEO_TYPES = ['video/mp4', 'video/avi', 'video/x-msvideo', 'video/mov', 'video/quicktime', 'video/x-m4v', 'video/3gpp', 'video/webm'];

const DOC_KEYS = [
  { key: SEMI_PROFESSIONAL_FILE_KEYS.STUDENT_SELFIE, label: "Student's Selfie *", subtitle: 'Upload a recent selfie/photo (JPG/PNG, max 2MB)' },
  { key: SEMI_PROFESSIONAL_FILE_KEYS.CET_RANK_SHEET, label: 'CET Rank Sheet *', subtitle: 'Upload CET rank sheet (PDF/JPG/PNG, max 2MB)' },
  { key: SEMI_PROFESSIONAL_FILE_KEYS.PT_RANK_SHEET, label: 'Agriculture/Veterinary/Horticulture (PT Rank) *', subtitle: 'Upload PT rank sheet (PDF/JPG/PNG, max 2MB)' },
  { key: SEMI_PROFESSIONAL_FILE_KEYS.DWELLING_UNIT_PHOTO, label: 'Dwelling Unit Photograph *', subtitle: 'Upload a photo of your house (JPG/PNG, max 2MB)' },
  { key: SEMI_PROFESSIONAL_FILE_KEYS.MARKS_SHEET_12, label: 'PUC II / 12th Marks Sheet *', subtitle: 'Upload 12th marks sheet (PDF/JPG/PNG, max 2MB)' },
  { key: SEMI_PROFESSIONAL_FILE_KEYS.HOUSE_VIDEO, label: 'Short Video of the House *', subtitle: 'Record from outside moving inside, covering all rooms including kitchen, in landscape mode (MP4/AVI/MOV/MKV/WMV/3GP/WEBM, max 50MB)' },
  { key: SEMI_PROFESSIONAL_FILE_KEYS.ELECTRICITY_BILL, label: 'Latest Electricity Bill / Bhagyajyothi Document *', subtitle: 'Upload electricity bill or connection document (JPG/PNG, max 2MB)' },
  { key: SEMI_PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE, label: 'Income Certificate *', subtitle: 'Upload income certificate (JPG/PNG, max 2MB)' },
  { key: SEMI_PROFESSIONAL_FILE_KEYS.RATION_CARD, label: 'Ration Card Copy (Both Sides) *', subtitle: 'Upload both sides of ration card (JPG/PNG, max 2MB)' },
];

export default function DocumentSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData, uploadState, updateUploadState } = useFormEngineStore();

  const documentData = (formData as any).documents ?? {};

  const allUploaded = DOC_KEYS.every((doc) => !!documentData[doc.key]?.file);

  const handleFileUpload = async (documentKey: string) => {
    updateUploadState(documentKey, { isUploading: true, error: undefined, progress: 0 });

    const isVideo = documentKey === SEMI_PROFESSIONAL_FILE_KEYS.HOUSE_VIDEO;
    const file = await pickDocument(isVideo ? ['video/*'] : ['image/jpeg', 'image/png', 'application/pdf']);
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
    updateUploadState(documentKey, { isUploading: false, uploaded: true, error: undefined, progress: 100 });
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
    if (!allUploaded) {
      Alert.alert('Required Documents', 'Please upload all 9 required documents before proceeding.');
      return;
    }
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
      nextDisabled={false}
    >
      <FormSectionHeader
          icon="attach"
          title="Upload Documents"
          subtitle="Take photos using your mobile phone and upload them. Only image files are allowed. Fields marked with * are required."
        />

        {DOC_KEYS.map((doc) => {
          const rule = getSemiProfUploadRule(doc.key);
          const isVideo = doc.key === SEMI_PROFESSIONAL_FILE_KEYS.HOUSE_VIDEO;
          return (
            <FormCard key={doc.key}>
              <FileUploadField
                title={doc.label}
                subtitle={doc.subtitle}
                file={documentData[doc.key]?.file}
                meta={uploadState[doc.key]}
                onUpload={() => handleFileUpload(doc.key)}
                onDelete={() => handleDeleteFile(doc.key)}
                maxSize={rule?.maxSize ?? 2 * 1024 * 1024}
                acceptedTypes={isVideo ? VIDEO_TYPES : rule?.acceptedTypes ?? ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
              />
            </FormCard>
          );
        })}

        <FormCard>
          <View style={styles.guidelineContainer}>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineBullet}>•</Text>
              <Text style={styles.guidelineText}>
                Take photos using your mobile phone and upload them (only image files allowed)
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineBullet}>•</Text>
              <Text style={styles.guidelineText}>
                For House Video, upload video files only (MP4, AVI, MOV, MKV, WMV, 3GP, WEBM)
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineBullet}>•</Text>
              <Text style={styles.guidelineText}>
                Documents must be clear, readable, and not exceed 2MB (50MB for video)
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineBullet}>•</Text>
              <Text style={styles.guidelineText}>
                All 9 documents are mandatory — verified by the scholarship committee
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
                  documentData[doc.key]?.file ? styles.successText : styles.pendingText
                ]}>
                  {documentData[doc.key]?.file ? '✓ Uploaded' : 'Pending'}
                </Text>
              </View>
            ))}
          </View>
        </FormCard>
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
    flex: 1,
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
