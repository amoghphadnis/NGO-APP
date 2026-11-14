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
import { NewStudentFamilyFormValues, newStudentFamilySchema } from '@/validation/newStudentSchemas';

export default function FamilySection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [fatherOccOptions, setFatherOccOptions] = useState<Option<number>[]>([]);
  const [motherOccOptions, setMotherOccOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getNewStudentDropdowns();
      if (response.success && response.data) {
        setFatherOccOptions(response.data.fatherOcc?.map((o: any) => ({
          value: Number(o.value),
          label: o.label
        })) || []);
        setMotherOccOptions(response.data.motherOcc?.map((o: any) => ({
          value: Number(o.value),
          label: o.label
        })) || []);
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
    familyIncome: '',
    familyMembers: undefined,
  };

  const { control, handleSubmit, formState } = useForm<NewStudentFamilyFormValues>({
    defaultValues: familyData,
    resolver: zodResolver(newStudentFamilySchema),
    mode: 'onChange',
  });

  const onSubmit = (data: NewStudentFamilyFormValues) => {
    updateSectionData('family', data);
    updateValidationState('family', { isValid: true, data });
    markStepComplete(4);
    navigation.navigate('category');
  };

  const onInvalid = () => {
    Alert.alert('Missing Required Details', 'Please fill all details marked with * before proceeding.');
  };

  return (
    <FormScreenLayout
      title="Family Details"
      step={5}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
      nextDisabled={loadingDropdowns}
    >
      <FormSectionHeader
        icon="people"
        title="Family Information"
        subtitle="Fields marked with * are required"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="fatherName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Father/Guardian name"
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
              label="Mother/Guardian name"
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
              label="Father/Guardian Occupation"
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
              label="Mother/Guardian Occupation"
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
              label="Family Income"
              value={value}
              onChangeText={onChange}
              placeholder="Enter family income"
              keyboardType="number-pad"
              error={formState.errors.familyIncome?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="familyMembers"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Total Number of Family Members"
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
