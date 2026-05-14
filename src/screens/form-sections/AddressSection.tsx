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

export default function AddressSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const { control, handleSubmit, formState } = useForm<AddressDetailsFormValues>({
    defaultValues: {
      pincode: formData.address.pincode ?? '',
      district: formData.address.district ?? '',
      taluk: formData.address.taluk ?? '',
      place: formData.address.place ?? '',
      address: formData.address.address ?? '',
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
            <VPInputField
              label="District"
              value={value}
              onChangeText={onChange}
              placeholder="Enter district name"
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
            <VPInputField
              label="Place/Village"
              value={value}
              onChangeText={onChange}
              placeholder="Enter place or village name"
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
