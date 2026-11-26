import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { getProfessionalDropdowns } from '@/api/professionalApi';
import DecimalInputField from '@/components/common/DecimalInputField';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { ProfessionalFamilyDetailsFormValues, professionalFamilyDetailsSchema } from '@/validation/professionalSchemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function FamilySection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [fatherOccupationOptions, setFatherOccupationOptions] = useState<Option<number>[]>([]);
  const [motherOccupationOptions, setMotherOccupationOptions] = useState<Option<number>[]>([]);
  const [houseTypeOptions, setHouseTypeOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getProfessionalDropdowns();
      if (response.success && response.data) {
        setFatherOccupationOptions(response.data.fatherOcc?.map((o: any) => ({
          value: Number(o.value),
          label: o.label
        })) || []);
        setMotherOccupationOptions(response.data.motherOcc?.map((o: any) => ({
          value: Number(o.value),
          label: o.label
        })) || []);
        setHouseTypeOptions(response.data.houseTypes?.map((h: any) => ({
          value: Number(h.value),
          label: h.label
        })) || []);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const familyData = (formData as any).family ?? {
    FatherName: '',
    MotherName: '',
    FatherOccupationID: 0,
    MotherOccupationID: 0,
    FamilyMembers: undefined,
    HouseTypeID: 0,
    MonthlyRent: undefined,
    FamilyIncome: 0,
  };

  const { control, handleSubmit, formState, watch } = useForm<ProfessionalFamilyDetailsFormValues>({
    defaultValues: {
      FatherName: familyData.FatherName ?? '',
      MotherName: familyData.MotherName ?? '',
      FatherOccupationID: familyData.FatherOccupationID ?? 0,
      MotherOccupationID: familyData.MotherOccupationID ?? 0,
      FamilyMembers: familyData.FamilyMembers || undefined,
      HouseTypeID: familyData.HouseTypeID ?? 0,
      MonthlyRent: familyData.MonthlyRent,
      FamilyIncome: familyData.FamilyIncome ?? 0,
    },
    resolver: zodResolver(professionalFamilyDetailsSchema),
    mode: 'onChange',
  });

  const selectedHouseType = watch('HouseTypeID');
  const showMonthlyRent = selectedHouseType === 2 || selectedHouseType === 3;

  const onSubmit = (data: ProfessionalFamilyDetailsFormValues) => {
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
        subtitle="Tell us about your parents"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="FatherName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Father Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter father's full name"
              error={formState.errors.FatherName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="MotherName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Mother Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter mother's full name"
              error={formState.errors.MotherName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="FatherOccupationID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Father/Guardian Occupation"
              placeholder="Select father's occupation"
              value={value}
              onChange={onChange}
              options={fatherOccupationOptions}
              error={formState.errors.FatherOccupationID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="MotherOccupationID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Mother/Guardian Occupation"
              placeholder="Select mother's occupation"
              value={value}
              onChange={onChange}
              options={motherOccupationOptions}
              error={formState.errors.MotherOccupationID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />
      </FormCard>

      <FormSectionHeader
        icon="home"
        title="Family & Housing Details"
        subtitle="Information about your family and housing"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="FamilyMembers"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Total Number of Family Members"
              value={value === undefined || value === null ? '' : String(value)}
              onChangeText={(text) => {
                const cleanText = text.replace(/[^0-9]/g, '');
                const num = cleanText === '' ? undefined : parseInt(cleanText, 10);
                onChange(num);
              }}
              placeholder="Enter total family members"
              keyboardType="numeric"
              maxLength={2}
              error={formState.errors.FamilyMembers?.message}
              helperText="Include all family members living together"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="HouseTypeID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="House Type"
              placeholder="Select house type"
              value={value}
              onChange={onChange}
              options={houseTypeOptions}
              error={formState.errors.HouseTypeID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        {showMonthlyRent && (
          <Controller
            control={control}
            name="MonthlyRent"
            render={({ field: { onChange, value } }) => (
              <DecimalInputField
                label="If you are staying in rented house, kindly mention the monthly rent amount"
                value={value}
                onChangeValue={onChange}
                placeholder="Enter monthly rent amount"
                prefix="₹"
                error={formState.errors.MonthlyRent?.message}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="FamilyIncome"
          render={({ field: { onChange, value } }) => (
            <DecimalInputField
              label="Family Income (Monthly)"
              value={value}
              onChangeValue={onChange}
              placeholder="Enter family monthly income"
              prefix="₹"
              error={formState.errors.FamilyIncome?.message}
              helperText="The total family income should be less than ₹15,000/- per month"
              required
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
