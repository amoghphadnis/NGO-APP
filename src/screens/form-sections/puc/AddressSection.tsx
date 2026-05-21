import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import { useFormEngineStore } from '../../../store/useFormEngineStore';
import { addressDetailsSchema, AddressDetailsFormValues } from '@/validation/sharedSchemas';
import { PUC_AREA_OPTIONS } from '@/constants/formOptions';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

const areaOptions: Option<string>[] = PUC_AREA_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }));

export default function AddressSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const addressData = formData?.address ?? {
    pincode: '',
    district: '',
    otherDistrict: '',
    taluk: '',
    place: '',
    address: '',
    area: '',
  };

  const { control, handleSubmit, formState } = useForm<AddressDetailsFormValues>({
    defaultValues: {
      pincode: addressData.pincode,
      district: addressData.district,
      otherDistrict: addressData.otherDistrict,
      taluk: addressData.taluk,
      place: addressData.place,
      address: addressData.address,
      area: addressData.area,
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

  const isNextDisabled = !formState.isValid;

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
          name="area"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Area"
              value={value}
              onChange={onChange}
              options={areaOptions}
              placeholder="Select area type"
              error={formState.errors.area?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="district"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="District"
              value={value}
              onChangeText={onChange}
              placeholder="Enter district"
              error={formState.errors.district?.message}
              required
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
          name="place"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Place"
              value={value}
              onChangeText={onChange}
              placeholder="Enter place/village"
              error={formState.errors.place?.message}
              required
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
