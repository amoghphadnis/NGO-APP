import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { getSemiProfessionalDropdowns } from '@/api/semiProfessionalApi';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { SemiProfFamilyFormValues, semiProfFamilySchema } from '@/validation/semiProfessionalSchemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function FamilySection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [fatherOccupationOptions, setFatherOccupationOptions] = useState<Option<number>[]>([]);
  const [motherOccupationOptions, setMotherOccupationOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getSemiProfessionalDropdowns();
      if (response.success && response.data) {
        setFatherOccupationOptions(response.data.fatherOccupations?.map((o: any) => ({
          value: Number(o.value),
          label: o.label
        })) || []);
        setMotherOccupationOptions(response.data.motherOccupations?.map((o: any) => ({
          value: Number(o.value),
          label: o.label
        })) || []);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const familyData = (formData as any).family ?? {
    fatherOccupationID: 0,
    motherOccupationID: 0,
    familyMembers: 1,
    annualIncome: 0,
  };

  const { control, handleSubmit, formState } = useForm<SemiProfFamilyFormValues>({
    defaultValues: {
      fatherOccupationID: familyData.fatherOccupationID ?? 0,
      motherOccupationID: familyData.motherOccupationID ?? 0,
      familyMembers: familyData.familyMembers ?? 1,
      annualIncome: familyData.annualIncome ?? 0,
    },
    resolver: zodResolver(semiProfFamilySchema),
    mode: 'onChange',
  });

  const onSubmit = (data: SemiProfFamilyFormValues) => {
    updateSectionData('family', data);
    updateValidationState('family', { isValid: true, data });
    markStepComplete(2);
    navigation.navigate('academic');
  };

  const isNextDisabled = !formState.isValid || loadingDropdowns;

  return (
    <FormScreenLayout
      title="Family Details"
      step={3}
      totalSteps={7}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
    >
      <FormSectionHeader
        icon="people"
        title="Parents Information"
        subtitle="Fields marked with * are required"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="fatherOccupationID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Father's Occupation"
              placeholder="Select father's occupation"
              value={value}
              onChange={onChange}
              options={fatherOccupationOptions}
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
              label="Mother's Occupation"
              placeholder="Select mother's occupation"
              value={value}
              onChange={onChange}
              options={motherOccupationOptions}
              error={formState.errors.motherOccupationID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />
      </FormCard>

      <FormSectionHeader
        icon="home"
        title="Family Information"
        subtitle="Family size and income details"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="familyMembers"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Number of Family Members"
              value={value?.toString() ?? ''}
              onChangeText={(text) => {
                const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
                onChange(isNaN(num) ? '' : num);
              }}
              placeholder="Enter total family members"
              keyboardType="numeric"
              maxLength={2}
              error={formState.errors.familyMembers?.message}
              helperText="Include all family members living together"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="annualIncome"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Annual Income"
              value={value?.toString() ?? ''}
              onChangeText={(text) => {
                const num = parseFloat(text.replace(/[^0-9.]/g, ''));
                onChange(isNaN(num) ? '' : num);
              }}
              placeholder="Enter total annual income"
              keyboardType="numeric"
              prefix="₹"
              error={formState.errors.annualIncome?.message}
              helperText="Total income from all sources per year"
              required
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
