import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { getPUCDropdowns } from '@/api/pucApi';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { isPUCForm } from '@/types/forms';
import { PucCategoryHousingFormValues, pucCategoryHousingSchema } from '@/validation/pucSchemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function CategorySection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [casteOptions, setCasteOptions] = useState<Option<number>[]>([]);
  const [houseTypeOptions, setHouseTypeOptions] = useState<Option<number>[]>([]);
  const [referenceSourceOptions, setReferenceSourceOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getPUCDropdowns();
      console.log('[CategorySection] Dropdown response:', response);
      if (response.success && response.data) {
        setCasteOptions(response.data.castes?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);
        setHouseTypeOptions(response.data.houseTypes?.map((h: any) => ({
          value: Number(h.value),
          label: h.label
        })) || []);
        setReferenceSourceOptions(response.data.referenceSources?.map((r: any) => ({
          value: Number(r.value),
          label: r.label
        })) || []);
        console.log('[CategorySection] Caste options:', response.data.castes);
        console.log('[CategorySection] House type options:', response.data.houseTypes);
        console.log('[CategorySection] Reference source options:', response.data.referenceSources);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const categoryData = isPUCForm(formData) ? formData.category ?? {
    casteCategoryID: 0,
    houseTypeID: 0,
    monthlyRent: '',
    referenceSourceID: 0,
  } : {
    casteCategoryID: 0,
    houseTypeID: 0,
    monthlyRent: '',
    referenceSourceID: 0,
  };

  const { control, handleSubmit, formState } = useForm<PucCategoryHousingFormValues>({
    defaultValues: {
      casteCategoryID: categoryData.casteCategoryID || 0,
      houseTypeID: categoryData.houseTypeID || 0,
      monthlyRent: categoryData.monthlyRent,
      referenceSourceID: categoryData.referenceSourceID || 0,
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

  const isNextDisabled = !formState.isValid || loadingDropdowns;

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
          name="casteCategoryID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Caste"
              value={value}
              onChange={onChange}
              options={casteOptions}
              placeholder="Select caste"
              error={formState.errors.casteCategoryID?.message}
              required
              disabled={loadingDropdowns}
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
          name="houseTypeID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="House Type"
              value={value}
              onChange={onChange}
              options={houseTypeOptions}
              placeholder="Select house type"
              error={formState.errors.houseTypeID?.message}
              required
              disabled={loadingDropdowns}
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
          name="referenceSourceID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Reference Source"
              value={value}
              onChange={onChange}
              options={referenceSourceOptions}
              placeholder="Select reference source"
              error={formState.errors.referenceSourceID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
