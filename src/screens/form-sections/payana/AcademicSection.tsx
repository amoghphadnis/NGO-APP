import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { payanaAcademicSchema, PayanaAcademicFormValues } from '@/validation/payanaSchemas';

interface AcademicSectionProps {
  navigation: any;
}

const courseOptions: Option<number>[] = [
  { value: 1, label: 'BCA' },
  { value: 2, label: 'B.Com' },
  { value: 3, label: 'B.Sc' },
  { value: 4, label: 'BA' },
  { value: 5, label: 'BE/B.Tech' },
  { value: 6, label: 'MBBS' },
  { value: 7, label: 'Other' },
];

const collegeTypeOptions: Option<number>[] = [
  { value: 1, label: 'Government' },
  { value: 2, label: 'Private' },
];

export default function AcademicSection({ navigation }: AcademicSectionProps) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const academicData = (formData as any).academic ?? {
    courseID: 0,
    collegeName: '',
    collegeTypeID: 0,
    collegeCNumber: '',
    courseSA: '',
    courseStream: '',
    annualFees: '',
    totalExpenses: '',
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
    markStepComplete(6);
    navigation.navigate('bank');
  };

  return (
    <FormScreenLayout
      title="Academic Details"
      step={7}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={!formState.isValid}
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
          name="studentAchievements"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Student Achievements"
              value={value}
              onChangeText={onChange}
              placeholder="Enter achievements (optional)"
              multiline
              numberOfLines={3}
              error={formState.errors.studentAchievements?.message}
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
