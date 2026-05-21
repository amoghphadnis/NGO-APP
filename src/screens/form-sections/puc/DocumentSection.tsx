import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import FileUploadField from '@/components/form/FileUploadField';
import { useFormEngineStore } from '../../../store/useFormEngineStore';
import { pickDocument } from '@/utils/filePicker';
import { isPUCForm } from '@/types/forms';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

const PUC_FILE_KEYS = [
  'sslcMarksCard',
  'studentPhoto',
  'electricityBill',
  'rationCard',
  'incomeCert',
  'familyPhoto',
  'houseVideo',
] as const;

export default function DocumentSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData, uploadState, updateUploadState } = useFormEngineStore();

  const documentData = isPUCForm(formData) ? formData.documents ?? {
    sslcMarksCard: undefined,
    studentPhoto: undefined,
    electricityBill: undefined,
    rationCard: undefined,
    incomeCert: undefined,
    familyPhoto: undefined,
    houseVideo: undefined,
    houseVisitLink: '',
  } : {
    sslcMarksCard: undefined,
    studentPhoto: undefined,
    electricityBill: undefined,
    rationCard: undefined,
    incomeCert: undefined,
    familyPhoto: undefined,
    houseVideo: undefined,
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

  const allDocumentsUploaded = PUC_FILE_KEYS.every(key => uploadState[key]?.uploaded);

  const onSubmit = () => {
    updateValidationState('documents', { isValid: allDocumentsUploaded, data: documentData });
    markStepComplete(8);
    navigation.navigate('review');
  };

  const isNextDisabled = !allDocumentsUploaded;

  return (
    <FormScreenLayout
      title="Document Upload"
      step={9}
      onBack={navigation.goBack}
      onNext={onSubmit}
      nextDisabled={isNextDisabled}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Document Guidelines */}
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

        {/* SSLC Marks Card */}
        <FormSectionHeader
          icon="school"
          title="SSLC Marks Card"
          subtitle="Upload your SSLC marks card (photo)"
          showRequired
        />
        
        <FormCard>
          <FileUploadField
            title="SSLC Marks Card"
            subtitle="Upload your SSLC marks card photo"
            file={documentData.sslcMarksCard?.file}
            meta={uploadState.sslcMarksCard}
            onUpload={() => handleFileUpload('sslcMarksCard')}
            onDelete={() => handleDeleteFile('sslcMarksCard')}
          />
        </FormCard>

        {/* Student Photo */}
        <FormSectionHeader
          icon="person"
          title="Student Photo"
          subtitle="Upload your recent photo/selfie"
          showRequired
        />
        
        <FormCard>
          <FileUploadField
            title="Student Photo"
            subtitle="Upload your recent photo"
            file={documentData.studentPhoto?.file}
            meta={uploadState.studentPhoto}
            onUpload={() => handleFileUpload('studentPhoto')}
            onDelete={() => handleDeleteFile('studentPhoto')}
            acceptedTypes={['image/jpeg', 'image/png']}
          />
        </FormCard>

        {/* Electricity Bill */}
        <FormSectionHeader
          icon="flash"
          title="Electricity Bill"
          subtitle="Upload recent electricity bill (photo)"
          showRequired
        />
        
        <FormCard>
          <FileUploadField
            title="Electricity Bill"
            subtitle="Upload recent electricity bill photo"
            file={documentData.electricityBill?.file}
            meta={uploadState.electricityBill}
            onUpload={() => handleFileUpload('electricityBill')}
            onDelete={() => handleDeleteFile('electricityBill')}
          />
        </FormCard>

        {/* Ration Card */}
        <FormSectionHeader
          icon="card"
          title="Ration Card"
          subtitle="Upload ration card (photo)"
          showRequired
        />
        
        <FormCard>
          <FileUploadField
            title="Ration Card"
            subtitle="Upload ration card photo"
            file={documentData.rationCard?.file}
            meta={uploadState.rationCard}
            onUpload={() => handleFileUpload('rationCard')}
            onDelete={() => handleDeleteFile('rationCard')}
          />
        </FormCard>

        {/* Income Certificate */}
        <FormSectionHeader
          icon="cash"
          title="Income Certificate"
          subtitle="Upload income certificate"
          showRequired
        />
        
        <FormCard>
          <FileUploadField
            title="Income Certificate"
            subtitle="Upload income certificate"
            file={documentData.incomeCert?.file}
            meta={uploadState.incomeCert}
            onUpload={() => handleFileUpload('incomeCert')}
            onDelete={() => handleDeleteFile('incomeCert')}
          />
        </FormCard>

        {/* Family Photo */}
        <FormSectionHeader
          icon="people"
          title="Family Photo"
          subtitle="Upload family photo taken in front of dwelling unit/house"
          showRequired
        />
        
        <FormCard>
          <FileUploadField
            title="Family Photo"
            subtitle="Family photo in front of house"
            file={documentData.familyPhoto?.file}
            meta={uploadState.familyPhoto}
            onUpload={() => handleFileUpload('familyPhoto')}
            onDelete={() => handleDeleteFile('familyPhoto')}
            acceptedTypes={['image/jpeg', 'image/png']}
          />
        </FormCard>

        {/* House Video */}
        <FormSectionHeader
          icon="videocam"
          title="House Video"
          subtitle="Full video of dwelling unit (exterior + interior clearly visible)"
          showRequired
        />
        
        <FormCard>
          <FileUploadField
            title="House Video"
            subtitle="Full video of dwelling unit"
            file={documentData.houseVideo?.file}
            meta={uploadState.houseVideo}
            onUpload={() => handleFileUpload('houseVideo')}
            onDelete={() => handleDeleteFile('houseVideo')}
            acceptedTypes={['video/mp4', 'video/quicktime', 'video/x-msvideo']}
            maxSize={50 * 1024 * 1024}
          />
        </FormCard>

        {/* House Visit Google Link */}
        <FormSectionHeader
          icon="location"
          title="House Visit Google Link"
          subtitle="Paste Google link here"
          showRequired
        />
        
        <FormCard>
          <VPInputField
            label="House Visit Google Link"
            value={documentData.houseVisitLink}
            onChangeText={(text) => {
              const updatedDocuments = {
                ...documentData,
                houseVisitLink: text,
              };
              updateSectionData('documents', updatedDocuments);
            }}
            placeholder="Paste Google link here"
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            helperText="Provide Google Maps link to your residence"
          />
        </FormCard>
      </ScrollView>
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
