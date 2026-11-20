import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import { getPayanaDropdowns } from '@/api/payanaApi';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { PayanaAcademicFormValues, payanaAcademicSchema } from '@/validation/payanaSchemas';

interface AcademicSectionProps {
  navigation: any;
}

export default function AcademicSection({ navigation }: AcademicSectionProps) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [collegeTypeOptions, setCollegeTypeOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const payanaResponse = await getPayanaDropdowns();
      if (payanaResponse.success && payanaResponse.data) {
        setCollegeTypeOptions(payanaResponse.data.collegeTypes?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);
      }

      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const academicData = (formData as any).academic ?? {
    collegeName: '',
    collegeTypeID: 0,
    collegeCNumber: '',
    courseSA: '',
    courseStream: '',
    annualFees: '',
    totalExpenses: '',
    reference: '',
    studentAchievements: '',
    securedPercentage: '',
  };

  const { control, handleSubmit, formState } = useForm<PayanaAcademicFormValues>({
    defaultValues: academicData,
    resolver: zodResolver(payanaAcademicSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: PayanaAcademicFormValues) => {
    updateSectionData('academic', data);
    updateValidationState('academic', { isValid: true, data });
    markStepComplete(7);
    navigation.navigate('documents');
  };

  return (
    <FormScreenLayout
      title="Academic Details"
      step={8}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={!formState.isValid || loadingDropdowns}
    >
      <FormSectionHeader
        icon="school"
        title="Education Information"
        subtitle="Course and college details"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="collegeName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="College Name"
              value={value ?? ''}
              onChangeText={onChange}
              placeholder="Enter college name"
              error={formState.errors.collegeName?.message}
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
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="collegeCNumber"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="College Contact Number"
              value={value}
              onChangeText={onChange}
              placeholder="Enter college contact (optional)"
              keyboardType="phone-pad"
              error={formState.errors.collegeCNumber?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="courseSA"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Course Specialization"
              value={value}
              onChangeText={onChange}
              placeholder="e.g., Computer Science"
              error={formState.errors.courseSA?.message}
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
              placeholder="Enter stream (optional)"
              error={formState.errors.courseStream?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="annualFees"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Annual Fees"
              value={value}
              onChangeText={onChange}
              placeholder="Enter annual fees"
              keyboardType="number-pad"
              error={formState.errors.annualFees?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="totalExpenses"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Total Educational Expenses"
              value={value}
              onChangeText={onChange}
              placeholder="Enter total expenses"
              keyboardType="number-pad"
              error={formState.errors.totalExpenses?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="reference"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Who Referred you regarding Payana?"
              value={value}
              onChangeText={onChange}
              placeholder="Enter reference name"
              error={formState.errors.reference?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="studentAchievements"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Student Achievements"
              value={value}
              onChangeText={onChange}
              placeholder="Enter achievements"
              multiline
              numberOfLines={3}
              error={formState.errors.studentAchievements?.message}
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
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
