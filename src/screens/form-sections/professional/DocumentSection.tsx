import { useForm } from 'react-hook-form';

import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FileUploadField from '@/components/form/FileUploadField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { PROFESSIONAL_FILE_KEYS } from '@/forms/professional/fileKeys';
import { PROFESSIONAL_UPLOAD_RULES, validateUpload } from '@/forms/professional/uploads';
import { pickDocument } from '@/utils/filePicker';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function DocumentSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData, uploadState, updateUploadState } = useFormEngineStore();

  const documentData = (formData as any).documents ?? {
    StudentSelfie: undefined,
    CETNEETRankSheet: undefined,
    DwellingUnitPhoto: undefined,
    MarksSheet12: undefined,
    RequestLetter: undefined,
    HouseVideo: undefined,
    ElectricityBill: undefined,
    IncomeCertificate: undefined,
    RationCard: undefined,
  };

  const { handleSubmit } = useForm();

  const handleFileUpload = async (documentKey: string) => {
    updateUploadState(documentKey, { isUploading: true, error: undefined, progress: 0 });

    const file = await pickDocument();

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

  const allDocumentsUploaded =
    uploadState[PROFESSIONAL_FILE_KEYS.STUDENT_SELFIE]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.CET_NEET_RANK_SHEET]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.DWELLING_UNIT_PHOTO]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.MARKS_SHEET_12]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.REQUEST_LETTER]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.HOUSE_VIDEO]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.ELECTRICITY_BILL]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE]?.uploaded &&
    uploadState[PROFESSIONAL_FILE_KEYS.RATION_CARD]?.uploaded;

  const onSubmit = () => {
    updateValidationState('documents', { isValid: allDocumentsUploaded, data: documentData });
    markStepComplete(4);
    navigation.navigate('review');
  };

  const isNextDisabled = !allDocumentsUploaded;

  const renderUploadField = (fileKey: string, title: string, subtitle: string) => {
    const rule = PROFESSIONAL_UPLOAD_RULES.find((r) => r.key === fileKey);
    return (
      <FormCard>
        <FileUploadField
          title={title}
          subtitle={subtitle}
          file={documentData[fileKey]?.file}
          meta={uploadState[fileKey]}
          onUpload={() => handleFileUpload(fileKey)}
          onDelete={() => handleDeleteFile(fileKey)}
          maxSize={rule?.maxSize ?? 2 * 1024 * 1024}
          acceptedTypes={rule?.acceptedTypes ?? ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
        />
      </FormCard>
    );
  };

  return (
    <FormScreenLayout
      title="Document Upload"
      step={5}
      totalSteps={7}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
      nextLabel="Continue to Review"
    >
      <FormSectionHeader
        icon="attach"
        title="Required Documents"
        subtitle="Upload all mandatory documents (PDF/JPG/PNG, max 2MB each)"
        showRequired
      />

      {renderUploadField(PROFESSIONAL_FILE_KEYS.STUDENT_SELFIE, 'Student Selfie/Photograph', 'Upload your selfie or photograph')}
      {renderUploadField(PROFESSIONAL_FILE_KEYS.CET_NEET_RANK_SHEET, 'CET/NEET Rank Sheet', 'Upload your CET or NEET rank sheet')}
      {renderUploadField(PROFESSIONAL_FILE_KEYS.DWELLING_UNIT_PHOTO, 'Dwelling Unit Photo', 'Upload photo of your dwelling unit')}
      {renderUploadField(PROFESSIONAL_FILE_KEYS.MARKS_SHEET_12, '12th Marks Sheet', 'Upload your 12th/PU marks sheet')}
      {renderUploadField(PROFESSIONAL_FILE_KEYS.REQUEST_LETTER, 'Request Letter', 'Upload handwritten request letter')}
      {renderUploadField(PROFESSIONAL_FILE_KEYS.HOUSE_VIDEO, 'House Video', 'Upload house video link or file')}
      {renderUploadField(PROFESSIONAL_FILE_KEYS.ELECTRICITY_BILL, 'Electricity Bill', 'Upload recent electricity bill')}
      {renderUploadField(PROFESSIONAL_FILE_KEYS.INCOME_CERTIFICATE, 'Income Certificate', 'Upload family income certificate')}
      {renderUploadField(PROFESSIONAL_FILE_KEYS.RATION_CARD, 'Ration Card', 'Upload ration card (both sides)')}
    </FormScreenLayout>
  );
}
