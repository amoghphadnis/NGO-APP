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
import { payanaFamilySchema, PayanaFamilyFormValues } from '@/validation/payanaSchemas';

interface FamilySectionProps {
  navigation: any;
}

const occupationOptions: Option<number>[] = [
  { value: 1, label: 'Farmer' },
  { value: 2, label: 'Driver' },
  { value: 3, label: 'Daily Wage' },
  { value: 4, label: 'Carpenter' },
  { value: 5, label: 'Coolie' },
  { value: 6, label: 'Home maker' },
  { value: 7, label: 'Not working' },
  { value: 8, label: 'Expired' },
  { value: 9, label: 'Other' },
];

export default function FamilySection({ navigation }: FamilySectionProps) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const familyData = (formData as any).family ?? {
    fatherName: '',
    motherName: '',
    fatherOccupationID: undefined,
    motherOccupationID: undefined,
    familyMembers: 1,
    familyIncome: '',
    parentBank: '',
  };

  const { control, handleSubmit, formState } = useForm<PayanaFamilyFormValues>({
    defaultValues: familyData,
    resolver: zodResolver(payanaFamilySchema),
    mode: 'onChange',
  });

  const onSubmit = (data: PayanaFamilyFormValues) => {
    updateSectionData('family', data);
    updateValidationState('family', { isValid: true, data });
    markStepComplete(4);
    navigation.navigate('category');
  };

  return (
    <FormScreenLayout
      title="Family Information"
      step={5}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={!formState.isValid}
    >
      <FormSectionHeader
        icon="people"
        title="Family Details"
        subtitle="Information about your parents and family"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="fatherName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Father Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter father's name"
              error={formState.errors.fatherName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="motherName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Mother Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter mother's name"
              error={formState.errors.motherName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="fatherOccupationID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Father Occupation"
              value={value}
              options={occupationOptions}
              onChange={onChange}
              placeholder="Select occupation"
              error={formState.errors.fatherOccupationID?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="motherOccupationID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Mother Occupation"
              value={value}
              options={occupationOptions}
              onChange={onChange}
              placeholder="Select occupation"
              error={formState.errors.motherOccupationID?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="familyMembers"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Family Members"
              value={value?.toString()}
              onChangeText={(text) => onChange(parseInt(text) || 0)}
              placeholder="Enter number of family members"
              keyboardType="number-pad"
              error={formState.errors.familyMembers?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="familyIncome"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Family Annual Income"
              value={value}
              onChangeText={onChange}
              placeholder="Enter annual income"
              keyboardType="number-pad"
              error={formState.errors.familyIncome?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="parentBank"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Parent Bank Balance"
              value={value}
              onChangeText={onChange}
              placeholder="Enter parent bank balance"
              keyboardType="number-pad"
              error={formState.errors.parentBank?.message}
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
