import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { getNewStudentDropdowns } from '@/api/newStudentApi';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { NewStudentCategoryFormValues, newStudentCategorySchema } from '@/validation/newStudentSchemas';

export default function CategorySection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [casteOptions, setCasteOptions] = useState<Option<number>[]>([]);
  const [areaTypeOptions, setAreaTypeOptions] = useState<Option<number>[]>([]);
  const [houseTypeOptions, setHouseTypeOptions] = useState<Option<number>[]>([]);
  const [referenceOptions, setReferenceOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getNewStudentDropdowns();
      if (response.success && response.data) {
        setCasteOptions(response.data.castes?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);
        setAreaTypeOptions(response.data.areaTypes?.map((a: any) => ({
          value: Number(a.value),
          label: a.label
        })) || []);
        setHouseTypeOptions(response.data.houseTypes?.map((h: any) => ({
          value: Number(h.value),
          label: h.label
        })) || []);
        setReferenceOptions(response.data.referenceSources?.map((r: any) => ({
          value: Number(r.value),
          label: r.label
        })) || []);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const categoryData = (formData as any).category ?? {
    casteCategoryID: 0,
    areaTypeID: 0,
    houseTypeID: 0,
    monthlyRent: '',
    referenceSourceID: 0,
    referenceSourceOther: '',
  };

  const { control, handleSubmit, formState, watch } = useForm<NewStudentCategoryFormValues>({
    defaultValues: categoryData,
    resolver: zodResolver(newStudentCategorySchema),
    mode: 'onChange',
  });

  const selectedHouseType = watch('houseTypeID');
  const selectedReference = watch('referenceSourceID');
  const showMonthlyRent = selectedHouseType === 2 || selectedHouseType === 3;
  const showReferenceOther = referenceOptions
    .find((o) => o.value === selectedReference)
    ?.label?.toLowerCase()
    .includes('other') ?? false;

  const onSubmit = (data: NewStudentCategoryFormValues) => {
    updateSectionData('category', data);
    updateValidationState('category', { isValid: true, data });
    markStepComplete(5);
    navigation.navigate('academic');
  };

  const onInvalid = () => {
    Alert.alert('Missing Required Details', 'Please fill all details marked with * before proceeding.');
  };

  return (
    <FormScreenLayout
      title="Category Details"
      step={6}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
      nextDisabled={loadingDropdowns}
    >
      <FormSectionHeader
        icon="pricetag"
        title="Category & Reference"
        subtitle="Fields marked with * are required"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="casteCategoryID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Caste & Category"
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

        <Controller
          control={control}
          name="areaTypeID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Area Type"
              value={value}
              options={areaTypeOptions}
              onChange={onChange}
              placeholder="Select area type"
              error={formState.errors.areaTypeID?.message}
              required
              disabled={loadingDropdowns}
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
              disabled={loadingDropdowns}
            />
          )}
        />

        {showMonthlyRent && (
          <Controller
            control={control}
            name="monthlyRent"
            render={({ field: { onChange, value } }) => (
              <VPInputField
                label="Monthly Rent (If rented house)"
                value={value ?? ''}
                onChangeText={onChange}
                placeholder="Enter monthly rent"
                keyboardType="number-pad"
                error={formState.errors.monthlyRent?.message}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="referenceSourceID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Reference Source"
              value={value}
              options={referenceOptions}
              onChange={onChange}
              placeholder="How did you hear about us?"
              error={formState.errors.referenceSourceID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        {showReferenceOther && (
          <Controller
            control={control}
            name="referenceSourceOther"
            render={({ field: { onChange, value } }) => (
              <VPInputField
                label="Reference Source (Other)"
                value={value ?? ''}
                onChangeText={onChange}
                placeholder="Please specify"
                error={formState.errors.referenceSourceOther?.message}
                required
              />
            )}
          />
        )}
      </FormCard>
    </FormScreenLayout>
  );
}
