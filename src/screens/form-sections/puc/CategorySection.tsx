import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import ModalSelectField from '@/components/common/ModalSelectField';
import { useFormEngineStore } from '../../../store/useFormEngineStore';
import { pucCategoryHousingSchema, PucCategoryHousingFormValues } from '@/validation/pucSchemas';
import { isPUCForm } from '@/types/forms';
import {
  PUC_CASTE_OPTIONS,
  PUC_HOUSE_TYPE_OPTIONS,
  PUC_REFERENCE_SOURCE_OPTIONS,
} from '@/constants/formOptions';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

export default function CategorySection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const categoryData = isPUCForm(formData) ? formData.category ?? {
    caste: '',
    houseType: '',
    monthlyRent: '',
    referenceSource: '',
  } : {
    caste: '',
    houseType: '',
    monthlyRent: '',
    referenceSource: '',
  };

  const { control, handleSubmit, formState } = useForm<PucCategoryHousingFormValues>({
    defaultValues: {
      caste: categoryData.caste,
      houseType: categoryData.houseType,
      monthlyRent: categoryData.monthlyRent,
      referenceSource: categoryData.referenceSource,
    },
    resolver: zodResolver(pucCategoryHousingSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: PucCategoryHousingFormValues) => {
    updateSectionData('category', data);
    updateValidationState('category', { isValid: true, data });
    markStepComplete(4);
    navigation.navigate('academic');
  };

  const isNextDisabled = !formState.isValid;

  return (
    <FormScreenLayout
      title="Category & Housing"
      step={5}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
    >
      {/* Caste Category */}
      <FormSectionHeader
        icon="people"
        title="Caste Category"
        subtitle="Select your caste category"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="caste"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Caste"
              value={value}
              onChange={onChange}
              options={PUC_CASTE_OPTIONS as any}
              placeholder="Select caste"
              error={formState.errors.caste?.message}
              required
            />
          )}
        />
      </FormCard>

      {/* Housing Details */}
      <FormSectionHeader
        icon="home"
        title="Housing Details"
        subtitle="Information about your residence"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="houseType"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="House Type"
              value={value}
              onChange={onChange}
              options={PUC_HOUSE_TYPE_OPTIONS as any}
              placeholder="Select house type"
              error={formState.errors.houseType?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="monthlyRent"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Monthly Rent"
              value={value}
              onChangeText={onChange}
              placeholder="Enter monthly rent amount"
              keyboardType="numeric"
              error={formState.errors.monthlyRent?.message}
            />
          )}
        />
      </FormCard>

      {/* Reference Source */}
      <FormSectionHeader
        icon="information-circle"
        title="Reference Source"
        subtitle="How did you come to know about this financial assistance program?"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="referenceSource"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Reference Source"
              value={value}
              onChange={onChange}
              options={PUC_REFERENCE_SOURCE_OPTIONS as any}
              placeholder="Select reference source"
              error={formState.errors.referenceSource?.message}
              required
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
