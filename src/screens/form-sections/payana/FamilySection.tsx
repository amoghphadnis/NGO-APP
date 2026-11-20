import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import { getPayanaDropdowns } from '@/api/payanaApi';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { PayanaFamilyFormValues, payanaFamilySchema } from '@/validation/payanaSchemas';

interface FamilySectionProps {
  navigation: any;
}

export default function FamilySection({ navigation }: FamilySectionProps) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [fatherOccOptions, setFatherOccOptions] = useState<Option<number>[]>([]);
  const [motherOccOptions, setMotherOccOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getPayanaDropdowns();
      console.log('[Payana FamilySection] Dropdown response:', response);
      if (response.success && response.data) {
        setFatherOccOptions(response.data.fatherOcc?.map((o: any) => ({
          value: Number(o.value),
          label: o.label
        })) || []);
        setMotherOccOptions(response.data.motherOcc?.map((o: any) => ({
          value: Number(o.value),
          label: o.label
        })) || []);
        console.log('[Payana FamilySection] Father occupation options:', response.data.fatherOcc);
        console.log('[Payana FamilySection] Mother occupation options:', response.data.motherOcc);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const familyData = (formData as any).family ?? {
    fatherName: '',
    motherName: '',
    fatherOccupationID: undefined,
    motherOccupationID: undefined,
    familyMembers: undefined,
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
    markStepComplete(5);
    navigation.navigate('category');
  };

  return (
    <FormScreenLayout
      title="Family Information"
      step={6}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={!formState.isValid || loadingDropdowns}
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
              options={fatherOccOptions}
              onChange={onChange}
              placeholder="Select father's occupation"
              error={formState.errors.fatherOccupationID?.message}
              required
              disabled={loadingDropdowns}
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
              options={motherOccOptions}
              onChange={onChange}
              placeholder="Select mother's occupation"
              error={formState.errors.motherOccupationID?.message}
              required
              disabled={loadingDropdowns}
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

        <Controller
          control={control}
          name="familyMembers"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Family Members"
              value={value === undefined || value === null || isNaN(value) ? '' : String(value)}
              onChangeText={(text) => {
                const clean = text.replace(/[^0-9]/g, '');
                onChange(clean === '' ? undefined : parseInt(clean, 10));
              }}
              placeholder="Enter number of family members"
              keyboardType="number-pad"
              error={formState.errors.familyMembers?.message}
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
