import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { SemiProfAcademicFormValues, semiProfAcademicSchema } from '@/validation/semiProfessionalSchemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function AcademicSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const academicData = (formData as any).academic ?? {
    puPercentage: 0,
    cetRank: undefined,
    ptRank: undefined,
    courseApplying: '',
    courseStream: '',
  };

  const { control, handleSubmit, formState } = useForm<SemiProfAcademicFormValues>({
    defaultValues: {
      puPercentage: academicData.puPercentage ?? 0,
      cetRank: academicData.cetRank,
      ptRank: academicData.ptRank,
      courseApplying: academicData.courseApplying ?? '',
      courseStream: academicData.courseStream ?? '',
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

  const isNextDisabled = !formState.isValid;

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
          name="cetRank"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="CET Rank"
              value={value?.toString() ?? ''}
              onChangeText={(text) => {
                const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
                onChange(isNaN(num) ? '' : num);
              }}
              placeholder="Enter CET rank (if applicable)"
              keyboardType="numeric"
              error={formState.errors.cetRank?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="ptRank"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="PT Rank"
              value={value?.toString() ?? ''}
              onChangeText={(text) => {
                const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
                onChange(isNaN(num) ? '' : num);
              }}
              placeholder="Enter PT rank (if applicable)"
              keyboardType="numeric"
              error={formState.errors.ptRank?.message}
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
          name="courseApplying"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Course Applying For"
              value={value}
              onChangeText={onChange}
              placeholder="Enter course name you are applying for"
              error={formState.errors.courseApplying?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="courseStream"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Course Stream"
              value={value}
              onChangeText={onChange}
              placeholder="Enter course stream (e.g. Science, Commerce)"
              error={formState.errors.courseStream?.message}
              required
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
