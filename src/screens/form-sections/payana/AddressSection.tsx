import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { payanaAddressSchema, PayanaAddressFormValues } from '@/validation/payanaSchemas';

interface AddressSectionProps {
  navigation: any;
}

// These would typically come from API
const districtOptions: Option<number>[] = [
  { value: 1, label: 'Dharwad' },
  { value: 2, label: 'Gadag' },
  { value: 3, label: 'Belagavi' },
  { value: 4, label: 'Koppal' },
  { value: 5, label: 'Bagalkot' },
  { value: 6, label: 'Vijaypura' },
  { value: 7, label: 'Uttarakannada' },
  { value: 8, label: 'Shimogga' },
  { value: 9, label: 'Davangere' },
  { value: 10, label: 'Haveri' },
  { value: 11, label: 'Other' },
];

const areaTypeOptions: Option<number>[] = [
  { value: 1, label: 'Urban' },
  { value: 2, label: 'Rural' },
];

export default function AddressSection({ navigation }: AddressSectionProps) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

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
      nextDisabled={!formState.isValid}
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
