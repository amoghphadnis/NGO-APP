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
import { NewStudentAddressFormValues, newStudentAddressSchema } from '@/validation/newStudentSchemas';

export default function AddressSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [districtOptions, setDistrictOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getNewStudentDropdowns();
      if (response.success && response.data) {
        setDistrictOptions(response.data.districts?.map((d: any) => ({
          value: Number(d.value),
          label: d.label
        })) || []);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const addressData = (formData as any).address ?? {
    address: '',
    taluka: '',
    districtID: 0,
    otherDistrict: '',
    pincode: '',
  };

  const { control, handleSubmit, formState, watch } = useForm<NewStudentAddressFormValues>({
    defaultValues: addressData,
    resolver: zodResolver(newStudentAddressSchema),
    mode: 'onChange',
  });

  const selectedDistrictID = watch('districtID');

  const onSubmit = (data: NewStudentAddressFormValues) => {
    updateSectionData('address', data);
    updateValidationState('address', { isValid: true, data });
    markStepComplete(3);
    navigation.navigate('family');
  };

  const onInvalid = () => {
    Alert.alert('Missing Required Details', 'Please fill all details marked with * before proceeding.');
  };

  return (
    <FormScreenLayout
      title="Address Details"
      step={4}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
      nextDisabled={loadingDropdowns}
    >
      <FormSectionHeader
        icon="location"
        title="Address Information"
        subtitle="Fields marked with * are required"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Address"
              value={value}
              onChangeText={onChange}
              placeholder="Enter complete address"
              multiline
              numberOfLines={3}
              error={formState.errors.address?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="taluka"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Taluka"
              value={value}
              onChangeText={onChange}
              placeholder="Enter taluka"
              error={formState.errors.taluka?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="districtID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="District"
              value={value}
              options={districtOptions}
              onChange={onChange}
              placeholder="Select district"
              error={formState.errors.districtID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        {selectedDistrictID === 11 && (
          <Controller
            control={control}
            name="otherDistrict"
            render={({ field: { onChange, value } }) => (
              <VPInputField
                label="Other District"
                value={value ?? ''}
                onChangeText={onChange}
                placeholder="Enter district name"
                error={formState.errors.otherDistrict?.message}
                required
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="pincode"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Pin Code"
              value={value ?? ''}
              onChangeText={onChange}
              placeholder="Enter pin code"
              keyboardType="number-pad"
              maxLength={6}
              error={formState.errors.pincode?.message}
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
