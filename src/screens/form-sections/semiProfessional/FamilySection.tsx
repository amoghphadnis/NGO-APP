import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { getSemiProfessionalDropdowns } from '@/api/semiProfessionalApi';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { SemiProfFamilyFormValues, semiProfFamilySchema } from '@/validation/semiProfessionalSchemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

// Web fallback: 1 = Own, 2 = Rent, 3 = Leased
const FALLBACK_HOUSE_TYPES: Option<number>[] = [
  { value: 1, label: 'Own' },
  { value: 2, label: 'Rent' },
  { value: 3, label: 'Leased' },
];

export default function FamilySection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [fatherOccupationOptions, setFatherOccupationOptions] = useState<Option<number>[]>([]);
  const [motherOccupationOptions, setMotherOccupationOptions] = useState<Option<number>[]>([]);
  const [houseTypeOptions, setHouseTypeOptions] = useState<Option<number>[]>(FALLBACK_HOUSE_TYPES);
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
        const houseTypes = response.data.houseTypes?.map((h: any) => ({
          value: Number(h.value),
          label: h.label
        })) || [];
        if (houseTypes.length > 0) {
          setHouseTypeOptions(houseTypes);
        }
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const familyData = (formData as any).family ?? {
    fatherName: '',
    motherName: '',
    fatherOccupationID: 0,
    motherOccupationID: 0,
    familyMembers: undefined,
    houseTypeID: 0,
    monthlyRent: undefined as number | undefined,
    familyIncome: undefined as any,
  };

  const { control, handleSubmit, formState, watch } = useForm<SemiProfFamilyFormValues>({
    defaultValues: {
      fatherName: familyData.fatherName ?? '',
      motherName: familyData.motherName ?? '',
      fatherOccupationID: familyData.fatherOccupationID ?? 0,
      motherOccupationID: familyData.motherOccupationID ?? 0,
      familyMembers: familyData.familyMembers || undefined,
      houseTypeID: familyData.houseTypeID ?? 0,
      monthlyRent: familyData.monthlyRent,
      familyIncome: familyData.familyIncome || undefined,
    },
    resolver: zodResolver(semiProfFamilySchema),
    mode: 'onChange',
  });

  const watchedHouseType = watch('houseTypeID');
  const showMonthlyRent = watchedHouseType === 2;

  const onSubmit = (data: SemiProfFamilyFormValues) => {
    updateSectionData('family', data);
    updateValidationState('family', { isValid: true, data });
    markStepComplete(2);
    navigation.navigate('academic');
  };

  const onInvalid = () => {
    Alert.alert('Missing Required Details', 'Please fill all details marked with * before proceeding.');
  };

  const isNextDisabled = loadingDropdowns;

  return (
    <FormScreenLayout
      title="Family Details"
      step={3}
      totalSteps={7}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
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
          name="fatherName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Father's Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter father's full name"
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
              label="Mother's Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter mother's full name"
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
        subtitle="Family size, housing and income details"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="familyMembers"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Total Number of Family Members"
              value={value === undefined || value === null || isNaN(value) ? '' : String(value)}
              onChangeText={(text) => {
                const cleanText = text.replace(/[^0-9]/g, '');
                const num = cleanText === '' ? undefined : parseInt(cleanText, 10);
                onChange(num);
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

        {showMonthlyRent && (
          <Controller
            control={control}
            name="monthlyRent"
            render={({ field: { onChange, value } }) => (
              <VPInputField
                label="Monthly Rent Amount"
                value={value?.toString() ?? ''}
                onChangeText={(text) => {
                  const num = parseFloat(text.replace(/[^0-9.]/g, ''));
                  onChange(isNaN(num) ? '' : num);
                }}
                placeholder="Enter monthly rent"
                keyboardType="numeric"
                prefix="₹"
                error={formState.errors.monthlyRent?.message}
                helperText="If you are staying in a rented house, kindly mention the monthly rent amount"
                required
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="familyIncome"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Total Monthly Family Income"
              value={value?.toString() ?? ''}
              onChangeText={(text) => {
                const num = parseFloat(text.replace(/[^0-9.]/g, ''));
                onChange(isNaN(num) ? undefined : num);
              }}
              placeholder="Enter total family income"
              keyboardType="numeric"
              prefix="₹"
              error={formState.errors.familyIncome?.message}
              helperText="Total income from all sources"
              required
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
