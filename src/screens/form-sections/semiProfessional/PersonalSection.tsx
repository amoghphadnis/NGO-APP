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
import { useFormEngineStore } from '../../../store/useFormEngineStore';
import { semiProfPersonalSchema, SemiProfPersonalFormValues } from '@/validation/semiProfessionalSchemas';
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

const casteOptions: Option<number>[] = [
  { value: 1, label: 'General' },
  { value: 2, label: 'OBC' },
  { value: 3, label: 'SC' },
  { value: 4, label: 'ST' },
  { value: 5, label: 'EWS' },
];

export default function PersonalSection({ navigation }: PersonalSectionProps) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const personalData = (formData as any).personal ?? {
    studentName: '',
    email: '',
    dateOfBirth: '',
    contactNumber: '',
    genderID: 0,
    casteCategoryID: 0,
  };

  const { control, handleSubmit, formState, watch } = useForm<SemiProfPersonalFormValues>({
    defaultValues: {
      studentName: personalData.studentName ?? '',
      email: personalData.email ?? '',
      dateOfBirth: personalData.dateOfBirth ?? '',
      contactNumber: personalData.contactNumber ?? '',
      genderID: personalData.genderID ?? 0,
      casteCategoryID: personalData.casteCategoryID ?? 0,
    },
    resolver: zodResolver(semiProfPersonalSchema),
    mode: 'onChange',
  });

  const watchedEmail = watch('email');
  const emailSuccess = !!watchedEmail && !formState.errors.email;

  const onSubmit = (data: SemiProfPersonalFormValues) => {
    updateSectionData('personal', data);
    updateValidationState('personal', { isValid: true, data });
    markStepComplete(1);
    navigation.navigate('address');
  };

  const isNextDisabled = !formState.isValid;

  return (
    <FormScreenLayout
      title="Personal Details"
      step={2}
      totalSteps={8}
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
          name="email"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Email"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={formState.errors.email?.message}
              successText={emailSuccess ? 'Email format looks good' : undefined}
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
          name="contactNumber"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Contact Number"
              value={value}
              onChangeText={onChange}
              placeholder="Enter 10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              error={formState.errors.contactNumber?.message}
              required
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

        <Controller
          control={control}
          name="casteCategoryID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Caste"
              value={value}
              options={casteOptions}
              onChange={onChange}
              placeholder="Select caste category"
              error={formState.errors.casteCategoryID?.message}
              required
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
