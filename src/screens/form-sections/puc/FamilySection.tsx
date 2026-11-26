import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet } from 'react-native';

import { getPUCDropdowns } from '@/api/pucApi';
import DecimalInputField from '@/components/common/DecimalInputField';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { PUC_HOUSE_TYPE_OPTIONS, PUC_REFERENCE_SOURCE_OPTIONS } from '@/constants/formOptions';
import { isPUCForm } from '@/types/forms';
import { PucFormat11FamilyFormValues, pucFormat11FamilySchema } from '@/validation/pucFormat11Schemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function FamilySection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [fatherOccOptions, setFatherOccOptions] = useState<Option<number>[]>([]);
  const [motherOccOptions, setMotherOccOptions] = useState<Option<number>[]>([]);
  const [casteOptions, setCasteOptions] = useState<Option<number>[]>([]);
  const [houseTypeOptions, setHouseTypeOptions] = useState<Option<number>[]>([]);
  const [referenceSourceOptions, setReferenceSourceOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getPUCDropdowns();
      if (response.success && response.data) {
        setFatherOccOptions(response.data.fatherOcc?.map((o: any) => ({
          value: Number(o.value),
          label: o.label
        })) || []);
        setMotherOccOptions(response.data.motherOcc?.map((o: any) => ({
          value: Number(o.value),
          label: o.label
        })) || []);
        setCasteOptions(response.data.castes?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);

        // House Types: use API if returned, otherwise fallback to standard PUC constants
        const apiHouseTypes = response.data.houseTypes?.map((h: any) => ({
          value: Number(h.value),
          label: h.label
        })) || [];
        setHouseTypeOptions(
          apiHouseTypes.length > 0
            ? apiHouseTypes
            : PUC_HOUSE_TYPE_OPTIONS.map((h) => ({ value: Number(h.value), label: h.label }))
        );

        // Reference Sources: use API if returned, otherwise fallback to standard PUC constants
        const apiRefSources = response.data.referenceSources?.map((r: any) => ({
          value: Number(r.value),
          label: r.label
        })) || [];
        setReferenceSourceOptions(
          apiRefSources.length > 0
            ? apiRefSources
            : PUC_REFERENCE_SOURCE_OPTIONS.map((r) => ({ value: Number(r.value), label: r.label }))
        );
      } else {
        setHouseTypeOptions(
          PUC_HOUSE_TYPE_OPTIONS.map((h) => ({ value: Number(h.value), label: h.label }))
        );
        setReferenceSourceOptions(
          PUC_REFERENCE_SOURCE_OPTIONS.map((r) => ({ value: Number(r.value), label: r.label }))
        );
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const familyData = isPUCForm(formData) ? formData.family : ({} as any);

  const { control, handleSubmit, formState, watch } = useForm<PucFormat11FamilyFormValues>({
    defaultValues: {
      FatherName: (familyData as any)?.FatherName || '',
      MotherName: (familyData as any)?.MotherName || '',
      FatherOccupation: familyData?.FatherOccupation || 0,
      MotherOccupation: familyData?.MotherOccupation || 0,
      TotalFamilyMembers: familyData?.TotalFamilyMembers || undefined,
      FamilyAnnualIncome: familyData?.FamilyAnnualIncome || undefined,
      CasteCategoryID: (familyData as any)?.CasteCategoryID || 0,
      HouseTypeID: (familyData as any)?.HouseTypeID || 0,
      MonthlyRent: (familyData as any)?.MonthlyRent,
      ReferenceSourceID: (familyData as any)?.ReferenceSourceID || 0,
    },
    resolver: zodResolver(pucFormat11FamilySchema),
    mode: 'onChange',
  });

  const selectedHouseType = watch('HouseTypeID');
  const showMonthlyRent = selectedHouseType === 2 || selectedHouseType === 3;

  const onSubmit = (data: PucFormat11FamilyFormValues) => {
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
        title="Family Details"
        subtitle="Tell us about your family"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="FatherName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Father Name"
              value={value || ''}
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
              value={value || ''}
              onChangeText={onChange}
              placeholder="Enter mother's full name"
              error={formState.errors.MotherName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="TotalFamilyMembers"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Total Number of Family Members"
              value={value === undefined || value === null || isNaN(value) ? '' : String(value)}
              onChangeText={(text) => {
                const clean = text.replace(/[^0-9]/g, '');
                onChange(clean === '' ? undefined : Number(clean));
              }}
              placeholder="Enter total family members"
              keyboardType="numeric"
              error={formState.errors.TotalFamilyMembers?.message}
              helperText="Including parents, yourself, and all dependents"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="FatherOccupation"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Father/Guardian Occupation"
              value={value}
              onChange={onChange}
              options={fatherOccOptions}
              placeholder="Select father's occupation"
              error={formState.errors.FatherOccupation?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="MotherOccupation"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Mother/Guardian Occupation"
              value={value}
              onChange={onChange}
              options={motherOccOptions}
              placeholder="Select mother's occupation"
              error={formState.errors.MotherOccupation?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="FamilyAnnualIncome"
          render={({ field: { onChange, value } }) => (
            <DecimalInputField
              label="Family Income"
              value={value}
              onChangeValue={onChange}
              placeholder="Enter annual family income"
              prefix="₹"
              error={formState.errors.FamilyAnnualIncome?.message}
              required
            />
          )}
        />
      </FormCard>

      <FormSectionHeader
        icon="home"
        title="Category & Housing"
        subtitle="Accommodation and program reference details"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="CasteCategoryID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Caste & Category"
              value={value}
              onChange={onChange}
              options={casteOptions}
              placeholder="Select caste & category"
              error={formState.errors.CasteCategoryID?.message}
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="HouseTypeID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="House Type"
              value={value}
              onChange={onChange}
              options={houseTypeOptions}
              placeholder="Select house type"
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
              <VPInputField
                label="Monthly Rent (If rented house)"
                value={value === undefined || value === null ? '' : String(value)}
                onChangeText={(text) => {
                  const clean = text.replace(/[^0-9]/g, '');
                  onChange(clean === '' ? undefined : Number(clean));
                }}
                placeholder="Enter monthly rent amount"
                keyboardType="numeric"
                error={formState.errors.MonthlyRent?.message}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="ReferenceSourceID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Reference Source (How did you come to know about this financial assistance program?)"
              value={value}
              onChange={onChange}
              options={referenceSourceOptions}
              placeholder="Select reference source"
              error={formState.errors.ReferenceSourceID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({});
