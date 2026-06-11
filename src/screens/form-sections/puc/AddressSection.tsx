import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
// Local Components
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';

import { getPUCDropdowns } from '@/api/pucApi';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { isPUCForm } from '@/types/forms';
import { AddressDetailsFormValues, addressDetailsSchema } from '@/validation/sharedSchemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function AddressSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [districtOptions, setDistrictOptions] = useState<Option<number>[]>([]);
  const [placeOptions, setPlaceOptions] = useState<Option<number>[]>([]);
  const [areaOptions, setAreaOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getPUCDropdowns();
      console.log('[AddressSection] Dropdown response:', response);
      if (response.success && response.data) {
        setDistrictOptions(response.data.districts?.map((d: any) => ({
          value: Number(d.value),
          label: d.label
        })) || []);
        setPlaceOptions(response.data.places?.map((p: any) => ({
          value: Number(p.value),
          label: p.label
        })) || []);
        setAreaOptions(response.data.places?.map((p: any) => ({
          value: Number(p.value),
          label: p.label
        })) || []);
        console.log('[AddressSection] District options:', response.data.districts);
        console.log('[AddressSection] Place options:', response.data.places);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const addressData = isPUCForm(formData)
    ? formData.address
    : { pincode: '', districtID: 0, otherDistrict: '', taluk: '', placeID: 0, address: '', areaID: 0 };

  const { control, handleSubmit, formState } = useForm<AddressDetailsFormValues>({
    defaultValues: {
      pincode: addressData.pincode,
      districtID: addressData.districtID || 0,
      otherDistrict: addressData.otherDistrict,
      taluk: addressData.taluk,
      placeID: addressData.placeID || 0,
      address: addressData.address,
      areaID: addressData.areaID || 0,
    },
    resolver: zodResolver(addressDetailsSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: AddressDetailsFormValues) => {
    updateSectionData('address', data);
    updateValidationState('address', { isValid: true, data });
    markStepComplete(3);
    navigation.navigate('family');
  };

  const isNextDisabled = !formState.isValid || loadingDropdowns;

  return (
    <FormScreenLayout
      title="Address Details"
      step={4}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
    >
      {/* Address Section */}
      <FormSectionHeader
        icon="location"
        title="Address Information"
        subtitle="Where do you live?"
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
              placeholder="Enter your full address"
              multiline
              numberOfLines={3}
              error={formState.errors.address?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="areaID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Area"
              value={value}
              onChange={onChange}
              options={areaOptions}
              placeholder="Select area type"
              error={formState.errors.areaID?.message}
              disabled={loadingDropdowns}
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
              onChange={onChange}
              options={districtOptions}
              placeholder="Select district"
              error={formState.errors.districtID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="taluk"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Taluka"
              value={value}
              onChangeText={onChange}
              placeholder="Enter taluka"
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
              onChange={onChange}
              options={placeOptions}
              placeholder="Select place/village"
              error={formState.errors.placeID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="pincode"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Pincode"
              value={value}
              onChangeText={onChange}
              placeholder="Enter 6-digit pincode"
              keyboardType="numeric"
              maxLength={6}
              error={formState.errors.pincode?.message}
              required
            />
          )}
        />
      </FormCard>

      {/* Address Guidelines */}
      <FormCard>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Address Guidelines:</Text>
          <Text style={styles.infoText}>
            • Provide accurate and complete address details
          </Text>
          <Text style={styles.infoText}>
            • Ensure pincode matches your location
          </Text>
          <Text style={styles.infoText}>
            • This address will be used for document verification
          </Text>
        </View>
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    padding: spacing.sm,
  },
  infoTitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
});
