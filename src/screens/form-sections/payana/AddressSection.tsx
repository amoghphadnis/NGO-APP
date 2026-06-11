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
import { PayanaAddressFormValues, payanaAddressSchema } from '@/validation/payanaSchemas';

interface AddressSectionProps {
  navigation: any;
}

export default function AddressSection({ navigation }: AddressSectionProps) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [districtOptions, setDistrictOptions] = useState<Option<number>[]>([]);
  const [areaTypeOptions, setAreaTypeOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getPayanaDropdowns();
      console.log('[Payana AddressSection] Dropdown response:', response);
      if (response.success && response.data) {
        setDistrictOptions(response.data.districts?.map((d: any) => ({
          value: Number(d.value),
          label: d.label
        })) || []);
        // Area types may come from places or a separate endpoint
        setAreaTypeOptions(response.data.places?.map((p: any) => ({
          value: Number(p.value),
          label: p.label
        })) || []);
        console.log('[Payana AddressSection] District options:', response.data.districts);
        console.log('[Payana AddressSection] Area options:', response.data.places);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const addressData = (formData as any).address ?? {
    residentialAddress: '',
    currentAddress: '',
    place: '',
    taluka: '',
    districtID: 0,
    otherDistrict: '',
    pincode: '',
    areaTypeID: 0,
  };

  const { control, handleSubmit, watch, formState } = useForm<PayanaAddressFormValues>({
    defaultValues: addressData,
    resolver: zodResolver(payanaAddressSchema),
    mode: 'onChange',
  });

  const districtID = watch('districtID');
  const showOtherDistrict = districtID === 11;

  const onSubmit = (data: PayanaAddressFormValues) => {
    updateSectionData('address', data);
    updateValidationState('address', { isValid: true, data });
    markStepComplete(3);
    navigation.navigate('family');
  };

  return (
    <FormScreenLayout
      title="Address Details"
      step={4}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={!formState.isValid || loadingDropdowns}
    >
      <FormSectionHeader
        icon="location"
        title="Address Information"
        subtitle="Your residential and current address"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="residentialAddress"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Residential Address"
              value={value}
              onChangeText={onChange}
              placeholder="Enter residential address"
              multiline
              numberOfLines={3}
              error={formState.errors.residentialAddress?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="currentAddress"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Current Address"
              value={value}
              onChangeText={onChange}
              placeholder="Enter current address"
              multiline
              numberOfLines={3}
              error={formState.errors.currentAddress?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="place"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Place"
              value={value}
              onChangeText={onChange}
              placeholder="Enter place name"
              error={formState.errors.place?.message}
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
            />
          )}
        />

        {showOtherDistrict && (
          <Controller
            control={control}
            name="otherDistrict"
            render={({ field: { onChange, value } }) => (
              <VPInputField
                label="Other District"
                value={value}
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
              value={value}
              onChangeText={onChange}
              placeholder="Enter pin code"
              keyboardType="number-pad"
              maxLength={6}
              error={formState.errors.pincode?.message}
              required
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
