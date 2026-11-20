import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import { getPayanaDropdowns } from '@/api/payanaApi';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { PayanaCategoryFormValues, payanaCategorySchema } from '@/validation/payanaSchemas';

interface CategorySectionProps {
  navigation: any;
}

export default function CategorySection({ navigation }: CategorySectionProps) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [casteOptions, setCasteOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getPayanaDropdowns();
      console.log('[Payana CategorySection] Dropdown response:', response);
      if (response.success && response.data) {
        setCasteOptions(response.data.castes?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);
        console.log('[Payana CategorySection] Caste options:', response.data.castes);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const categoryData = (formData as any).category ?? {
    casteCategoryID: 0,
  };

  const { control, handleSubmit, formState } = useForm<PayanaCategoryFormValues>({
    defaultValues: categoryData,
    resolver: zodResolver(payanaCategorySchema),
    mode: 'onChange',
  });

  const onSubmit = (data: PayanaCategoryFormValues) => {
    updateSectionData('category', data);
    updateValidationState('category', { isValid: true, data });
    markStepComplete(6);
    navigation.navigate('academic');
  };

  return (
    <FormScreenLayout
      title="Category Details"
      step={7}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={!formState.isValid || loadingDropdowns}
    >
      <FormSectionHeader
        icon="pricetag"
        title="Category Information"
        subtitle="Caste category details"
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
              disabled={loadingDropdowns}
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
