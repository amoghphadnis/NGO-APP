import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import DecimalInputField from '@/components/common/DecimalInputField';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { AcademicDetailsFormValues, academicDetailsSchema } from '@/validation/professionalSchemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function AcademicSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const academicData = (formData as any).academic ?? {
    PUPercentage: undefined,
    CETRank: undefined,
    NEETRank: undefined,
    CourseApplying: '',
    CourseStream: '',
  };

  const { control, handleSubmit, formState } = useForm<AcademicDetailsFormValues>({
    defaultValues: {
      PUPercentage: academicData.PUPercentage || undefined,
      CETRank: academicData.CETRank,
      NEETRank: academicData.NEETRank,
      CourseApplying: academicData.CourseApplying ?? '',
      CourseStream: academicData.CourseStream ?? '',
    },
    resolver: zodResolver(academicDetailsSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: AcademicDetailsFormValues) => {
    updateSectionData('academic', data);
    updateValidationState('academic', { isValid: true, data });
    markStepComplete(3);
    navigation.navigate('documents');
  };

  const onInvalid = () => {
    Alert.alert('Missing Required Details', 'Please fill all details marked with * before proceeding.');
  };

  const isNextDisabled = false;

  return (
    <FormScreenLayout
      title="Academic Details"
      step={4}
      totalSteps={7}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
      nextDisabled={isNextDisabled}
    >
      <FormSectionHeader
        icon="school"
        title="Academic Performance"
        subtitle="Your academic achievements"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="PUPercentage"
          render={({ field: { onChange, value } }) => (
            <DecimalInputField
              label="Secured Percentage in 12th Grade"
              value={value}
              onChangeValue={onChange}
              placeholder="Enter percentage"
              suffix="%"
              error={formState.errors.PUPercentage?.message}
              helperText="Enter your PU/12th grade percentage"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="CETRank"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="CET Rank (Mandatory for Engineering course)"
              value={value === undefined || value === null ? '' : String(value)}
              onChangeText={(text) => {
                const cleanText = text.replace(/[^0-9]/g, '');
                const num = cleanText === '' ? undefined : parseInt(cleanText, 10);
                onChange(num);
              }}
              placeholder="Enter CET rank (optional)"
              keyboardType="numeric"
              error={formState.errors.CETRank?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="NEETRank"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="NEET Rank"
              value={value === undefined || value === null ? '' : String(value)}
              onChangeText={(text) => {
                const cleanText = text.replace(/[^0-9]/g, '');
                const num = cleanText === '' ? undefined : parseInt(cleanText, 10);
                onChange(num);
              }}
              placeholder="Enter NEET rank (optional)"
              keyboardType="numeric"
              error={formState.errors.NEETRank?.message}
            />
          )}
        />
      </FormCard>

      <FormSectionHeader
        icon="book"
        title="Course Information"
        subtitle="Details about the course you are applying for"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="CourseApplying"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Course Applying"
              value={value}
              onChangeText={onChange}
              placeholder="Enter course name"
              error={formState.errors.CourseApplying?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="CourseStream"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Course Stream"
              value={value}
              onChangeText={onChange}
              placeholder="Enter course stream (e.g., Engineering, Medical)"
              error={formState.errors.CourseStream?.message}
              required
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
