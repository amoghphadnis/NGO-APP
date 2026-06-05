import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { payanaCategorySchema, PayanaCategoryFormValues } from '@/validation/payanaSchemas';

interface CategorySectionProps {
  navigation: any;
}

const casteOptions: Option<number>[] = [
  { value: 1, label: 'General' },
  { value: 2, label: 'OBC' },
  { value: 3, label: 'SC' },
  { value: 4, label: 'ST' },
];

const houseTypeOptions: Option<number>[] = [
  { value: 1, label: 'Own House' },
  { value: 2, label: 'Rental House' },
];

export default function CategorySection({ navigation }: CategorySectionProps) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const categoryData = (formData as any).category ?? {
    casteCategoryID: 0,
    houseTypeID: 0,
  };

  const { control, handleSubmit, formState } = useForm<PayanaCategoryFormValues>({
    defaultValues: categoryData,
    resolver: zodResolver(payanaCategorySchema),
    mode: 'onChange',
  });

  const onSubmit = (data: PayanaCategoryFormValues) => {
    updateSectionData('category', data);
    updateValidationState('category', { isValid: true, data });
    markStepComplete(5);
    navigation.navigate('academic');
  };

  return (
    <FormScreenLayout
      title="Category Details"
      step={6}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={!formState.isValid}
    >
      <FormSectionHeader
        icon="pricetag"
        title="Category Information"
        subtitle="Caste and housing details"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="casteCategoryID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Caste Category"
              value={value}
              options={casteOptions}
              onChange={onChange}
              placeholder="Select caste category"
              error={formState.errors.casteCategoryID?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="houseTypeID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="House Type"
              value={value}
              options={houseTypeOptions}
              onChange={onChange}
              placeholder="Select house type"
              error={formState.errors.houseTypeID?.message}
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
