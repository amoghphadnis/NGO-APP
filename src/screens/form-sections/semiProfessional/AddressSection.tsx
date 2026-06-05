import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import { useFormEngineStore } from '../../../store/useFormEngineStore';
import { semiProfAddressSchema, SemiProfAddressFormValues } from '@/validation/semiProfessionalSchemas';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

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

const placeOptions: Option<number>[] = [
  { value: 1, label: 'Urban' },
  { value: 2, label: 'Rural' },
  { value: 3, label: 'Semi Urban' },
];

export default function AddressSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const addressData = (formData as any).address ?? {
    districtID: 0,
    otherDistrict: '',
    taluk: '',
    placeID: 0,
    address: '',
  };

  const { control, handleSubmit, formState, watch } = useForm<SemiProfAddressFormValues>({
    defaultValues: {
      districtID: addressData.districtID ?? 0,
      otherDistrict: addressData.otherDistrict ?? '',
      taluk: addressData.taluk ?? '',
      placeID: addressData.placeID ?? 0,
      address: addressData.address ?? '',
    },
    resolver: zodResolver(semiProfAddressSchema),
    mode: 'onChange',
  });

  const selectedDistrict = watch('districtID');
  const showOtherDistrict = selectedDistrict === 11;

  const onSubmit = (data: SemiProfAddressFormValues) => {
    updateSectionData('address', data);
    updateValidationState('address', { isValid: true, data });
    markStepComplete(2);
    navigation.navigate('family');
  };

  return (
    <FormScreenLayout
      title="Address Details"
      step={3}
      totalSteps={8}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
    >
      <FormSectionHeader
        icon="location"
        title="Address Information"
        subtitle="Where do you currently reside?"
        showRequired
      />

      <FormCard>
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
          name="taluk"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Taluk"
              value={value}
              onChangeText={onChange}
              placeholder="Enter taluk name"
              error={formState.errors.taluk?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="placeID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Place"
              value={value}
              options={placeOptions}
              onChange={onChange}
              placeholder="Select place"
              error={formState.errors.placeID?.message}
              required
            />
          )}
        />
      </FormCard>

      <FormSectionHeader
        icon="home"
        title="Complete Address"
        subtitle="Detailed address for correspondence"
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
              helperText="Include house number, street name, and landmarks"
              required
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
