import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import { useFormEngineStore } from '../../../store/useFormEngineStore';
import { isProfessionalForm } from '@/types/forms';
import {
  professionalAddressDetailsSchema,
  ProfessionalAddressDetailsFormValues,
} from '@/validation/professionalSchemas';
import { getProfessionalDropdowns } from '@/api/professionalApi';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

export default function AddressSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [districtOptions, setDistrictOptions] = useState<Option<number>[]>([]);
  const [placeOptions, setPlaceOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getProfessionalDropdowns();
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
        console.log('[AddressSection] District options:', response.data.districts);
        console.log('[AddressSection] Place options:', response.data.places);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  // Defensive rendering: ensure address object exists
  const addressData = isProfessionalForm(formData) 
    ? formData.address 
    : { Pincode: '', DistrictID: 0, OtherDistrict: '', Taluk: '', PlaceID: 0, Address: '' };

  const { control, handleSubmit, watch, formState } = useForm<ProfessionalAddressDetailsFormValues>({
    defaultValues: {
      Pincode: addressData.Pincode ?? '',
      DistrictID: addressData.DistrictID ?? 0,
      OtherDistrict: addressData.OtherDistrict ?? '',
      Taluk: addressData.Taluk ?? '',
      PlaceID: addressData.PlaceID ?? 0,
      Address: addressData.Address ?? '',
    },
    resolver: zodResolver(professionalAddressDetailsSchema),
    mode: 'onChange',
  });

  const selectedDistrict = watch('DistrictID');
  const showOtherDistrict = selectedDistrict === 11; // "Other" district ID

  const onSubmit = (data: ProfessionalAddressDetailsFormValues) => {
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
          name="Pincode"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Pincode"
              value={value}
              onChangeText={onChange}
              placeholder="Enter 6-digit pincode"
              keyboardType="numeric"
              maxLength={6}
              error={formState.errors.Pincode?.message}
              helperText="Enter the pincode of your residence"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="DistrictID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="District"
              placeholder="Select district"
              value={value}
              onChange={onChange}
              options={districtOptions}
              error={formState.errors.DistrictID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        {showOtherDistrict && (
          <Controller
            control={control}
            name="OtherDistrict"
            render={({ field: { onChange, value } }) => (
              <VPInputField
                label="Other District Name"
                value={value}
                onChangeText={onChange}
                placeholder="Enter district name"
                error={formState.errors.OtherDistrict?.message}
                required
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="Taluk"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Taluk"
              value={value}
              onChangeText={onChange}
              placeholder="Enter taluk name"
              error={formState.errors.Taluk?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="PlaceID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Place/Village"
              placeholder="Select place or village"
              value={value}
              onChange={onChange}
              options={placeOptions}
              error={formState.errors.PlaceID?.message}
              required
              disabled={loadingDropdowns}
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
          name="Address"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Residential Address"
              value={value}
              onChangeText={onChange}
              placeholder="Enter complete street address"
              multiline
              numberOfLines={3}
              error={formState.errors.Address?.message}
              helperText="Include house number, street name, and landmarks"
              required
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
