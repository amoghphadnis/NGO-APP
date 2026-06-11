import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { getSemiProfessionalDropdowns } from '@/api/semiProfessionalApi';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { SemiProfAddressFormValues, semiProfAddressSchema } from '@/validation/semiProfessionalSchemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function AddressSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [districtOptions, setDistrictOptions] = useState<Option<number>[]>([]);
  const [placeOptions, setPlaceOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getSemiProfessionalDropdowns();
      console.log('[SemiPro AddressSection] Dropdown response:', response);
      if (response.success && response.data) {
        setDistrictOptions(response.data.districts?.map((d: any) => ({
          value: Number(d.value),
          label: d.label
        })) || []);
        setPlaceOptions(response.data.places?.map((p: any) => ({
          value: Number(p.value),
          label: p.label
        })) || []);
        console.log('[SemiPro AddressSection] District options:', response.data.districts);
        console.log('[SemiPro AddressSection] Place options:', response.data.places);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

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
              disabled={loadingDropdowns}
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
              disabled={loadingDropdowns}
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
