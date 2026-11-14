import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { getNewStudentDropdowns } from '@/api/newStudentApi';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { NewStudentAcademicFormValues, newStudentAcademicSchema } from '@/validation/newStudentSchemas';

export default function AcademicSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [courseOptions, setCourseOptions] = useState<Option<number>[]>([]);
  const [collegeTypeOptions, setCollegeTypeOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getNewStudentDropdowns();
      if (response.success && response.data) {
        setCourseOptions(response.data.courses?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);
        setCollegeTypeOptions(response.data.collegeTypes?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const academicData = (formData as any).academic ?? {
    courseID: 0,
    collegeName: '',
    collegeTypeID: 0,
    expectedFees: '',
    securedPercentage: '',
    totalMarks: '',
  };

  const { control, handleSubmit, formState } = useForm<NewStudentAcademicFormValues>({
    defaultValues: academicData,
    resolver: zodResolver(newStudentAcademicSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: NewStudentAcademicFormValues) => {
    updateSectionData('academic', data);
    updateValidationState('academic', { isValid: true, data });
    markStepComplete(6);
    navigation.navigate('documents');
  };

  const onInvalid = () => {
    Alert.alert('Missing Required Details', 'Please fill all details marked with * before proceeding.');
  };

  return (
    <FormScreenLayout
      title="Academic Details"
      step={7}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
      nextDisabled={loadingDropdowns}
    >
      <FormSectionHeader
        icon="school"
        title="Education Information"
        subtitle="Fields marked with * are required"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="courseID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Course"
              value={value}
              options={courseOptions}
              onChange={onChange}
              placeholder="Select course"
              error={formState.errors.courseID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="collegeName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="College Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter college name"
              error={formState.errors.collegeName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="collegeTypeID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="College Type"
              value={value}
              options={collegeTypeOptions}
              onChange={onChange}
              placeholder="Select college type"
              error={formState.errors.collegeTypeID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="expectedFees"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Expected Fees"
              value={value}
              onChangeText={onChange}
              placeholder="Enter expected annual fees"
              keyboardType="number-pad"
              error={formState.errors.expectedFees?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="securedPercentage"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Secured Percentage"
              value={value}
              onChangeText={onChange}
              placeholder="e.g., 85.5"
              keyboardType="decimal-pad"
              error={formState.errors.securedPercentage?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="totalMarks"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Total Marks"
              value={value}
              onChangeText={onChange}
              placeholder="Enter total marks secured"
              keyboardType="number-pad"
              error={formState.errors.totalMarks?.message}
              required
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
