import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { getSemiProfessionalDropdowns } from '@/api/semiProfessionalApi';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { SemiProfAcademicFormValues, semiProfAcademicSchema } from '@/validation/semiProfessionalSchemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function AcademicSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [courseOptions, setCourseOptions] = useState<Option<number>[]>([]);
  const [collegeTypeOptions, setCollegeTypeOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getSemiProfessionalDropdowns();
      if (response.success && response.data) {
        setCourseOptions(response.data.semiProfessionalCourses?.map((c: any) => ({
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
    puPercentage: 0,
    semiProfessionalCourseID: 0,
    collegeName: '',
    collegeTypeID: 0,
    collegeFees: 0,
  };

  const { control, handleSubmit, formState } = useForm<SemiProfAcademicFormValues>({
    defaultValues: {
      puPercentage: academicData.puPercentage ?? 0,
      semiProfessionalCourseID: academicData.semiProfessionalCourseID ?? 0,
      collegeName: academicData.collegeName ?? '',
      collegeTypeID: academicData.collegeTypeID ?? 0,
      collegeFees: academicData.collegeFees ?? 0,
    },
    resolver: zodResolver(semiProfAcademicSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: SemiProfAcademicFormValues) => {
    updateSectionData('academic', data);
    updateValidationState('academic', { isValid: true, data });
    markStepComplete(3);
    navigation.navigate('documents');
  };

  const isNextDisabled = !formState.isValid || loadingDropdowns;

  return (
    <FormScreenLayout
      title="Academic Details"
      step={4}
      totalSteps={7}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
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
          name="puPercentage"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="PU Percentage"
              value={value?.toString() ?? ''}
              onChangeText={(text) => onChange(parseFloat(text) || 0)}
              placeholder="Enter PU percentage"
              keyboardType="numeric"
              suffix="%"
              error={formState.errors.puPercentage?.message}
              helperText="Enter your PU/12th grade percentage"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="semiProfessionalCourseID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Course"
              value={value}
              options={courseOptions}
              onChange={onChange}
              placeholder="Select course"
              error={formState.errors.semiProfessionalCourseID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />
      </FormCard>

      <FormSectionHeader
        icon="book"
        title="College Information"
        subtitle="Details about your college"
        showRequired
      />

      <FormCard>
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
          name="collegeFees"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="College Fees"
              value={value?.toString() ?? ''}
              onChangeText={(text) => {
                const num = parseFloat(text.replace(/[^0-9.]/g, ''));
                onChange(isNaN(num) ? '' : num);
              }}
              placeholder="Enter annual college fees"
              keyboardType="numeric"
              prefix="₹"
              error={formState.errors.collegeFees?.message}
              required
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
