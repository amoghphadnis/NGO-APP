import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import VPDatePickerField from '@/components/common/VPDatePickerField';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { payanaPersonalSchema, PayanaPersonalFormValues } from '@/validation/payanaSchemas';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface PersonalSectionProps {
  navigation: any;
}

const genderOptions: Option<number>[] = [
  { value: 1, label: 'Male' },
  { value: 2, label: 'Female' },
  { value: 3, label: 'Other' },
];

export default function PersonalSection({ navigation }: PersonalSectionProps) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const personalData = (formData as any).personal ?? {
    studentName: '',
    dateOfBirth: '',
    genderID: 0,
  };

  const { control, handleSubmit, formState } = useForm<PayanaPersonalFormValues>({
    defaultValues: {
      studentName: personalData.studentName,
      dateOfBirth: personalData.dateOfBirth,
      genderID: personalData.genderID,
    },
    resolver: zodResolver(payanaPersonalSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: PayanaPersonalFormValues) => {
    updateSectionData('personal', data);
    updateValidationState('personal', { isValid: true, data });
    markStepComplete(1);
    navigation.navigate('contact');
  };

  const isNextDisabled = !formState.isValid;

  return (
    <FormScreenLayout
      title="Personal Details"
      step={2}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
    >
      <FormSectionHeader
        icon="person"
        title="Student Information"
        subtitle="Fields marked with * are required"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="studentName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Student Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your full name"
              error={formState.errors.studentName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field: { onChange, value } }) => (
            <VPDatePickerField
              label="Date of Birth"
              value={value}
              onChange={onChange}
              placeholder="Select date of birth"
              error={formState.errors.dateOfBirth?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="genderID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Gender"
              value={value}
              options={genderOptions}
              onChange={onChange}
              placeholder="Select gender"
              error={formState.errors.genderID?.message}
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
