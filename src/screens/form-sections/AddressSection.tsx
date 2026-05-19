import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import { useFormEngineStore } from '../../store/useFormEngineStore';
import { addressDetailsSchema, AddressDetailsFormValues } from '@/validation/formSchemas';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';
import { DropdownField } from '@/components/form/DropdownField';

// Dropdown options matching HTML form
const districtOptions = [
  { value: '1', label: 'Dharwad' },
  { value: '2', label: 'Gadag' },
  { value: '3', label: 'Belagavi' },
  { value: '4', label: 'Koppal' },
  { value: '5', label: 'Bagalkot' },
  { value: '6', label: 'Vijaypura' },
  { value: '7', label: 'Uttarakannada' },
  { value: '8', label: 'Shimogga' },
  { value: '9', label: 'Davangere' },
  { value: '10', label: 'Haveri' },
  { value: '11', label: 'Other' },
];

const placeOptions = [
  { value: '1', label: 'Rural' },
  { value: '2', label: 'Urban' },
  { value: '3', label: 'Semi_Urban' },
];

export default function AddressSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  // Defensive rendering: ensure address object exists
  const addressData = formData?.address ?? {
    pincode: '',
    district: '',
    otherDistrict: '',
    taluk: '',
    place: '',
    address: '',
  };

  const { control, handleSubmit, formState } = useForm<AddressDetailsFormValues>({
    defaultValues: {
      pincode: addressData.pincode ?? '',
      district: addressData.district ?? '',
      taluk: addressData.taluk ?? '',
      place: addressData.place ?? '',
      address: addressData.address ?? '',
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

  return (
    <FormScreenLayout
      title="Address Details"
      step={4}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
    >
      {/* Address Information */}
      <FormSectionHeader
        icon="location"
        title="Address Information"
        subtitle="Where do you currently reside?"
      />
      
      <FormCard>
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
              helperText="Enter the pincode of your residence"
            />
          )}
        />

        <Controller
          control={control}
          name="district"
          render={({ field: { onChange, value } }) => (
            <DropdownField
              label="District"
              value={value}
              onValueChange={onChange}
              options={districtOptions}
              placeholder="Select district"
              error={formState.errors.district?.message}
            />
          )}
        />

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
            />
          )}
        />

        <Controller
          control={control}
          name="place"
          render={({ field: { onChange, value } }) => (
            <DropdownField
              label="Place/Village"
              value={value}
              onValueChange={onChange}
              options={placeOptions}
              placeholder="Select place or village"
              error={formState.errors.place?.message}
            />
          )}
        />
      </FormCard>

      {/* Complete Address */}
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
              label="Street Address"
              value={value}
              onChangeText={onChange}
              placeholder="Enter complete street address"
              multiline
              numberOfLines={3}
              error={formState.errors.address?.message}
              helperText="Include house number, street name, and landmarks"
            />
          )}
        />
      </FormCard>

      {/* Address Guidelines */}
      <FormCard>
        <View style={styles.guidelineContainer}>
          <Text style={styles.guidelineTitle}>Address Guidelines:</Text>
          <Text style={styles.guidelineText}>
            • Ensure the address is complete and accurate
          </Text>
          <Text style={styles.guidelineText}>
            • Include nearby landmarks for easy identification
          </Text>
          <Text style={styles.guidelineText}>
            • This address will be used for document verification
          </Text>
          <Text style={styles.guidelineText}>
            • Any change in address must be updated immediately
          </Text>
        </View>
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  guidelineContainer: {
    padding: spacing.sm,
  },
  guidelineTitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  guidelineText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
});
