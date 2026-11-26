import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { getPUCDropdowns } from '@/api/pucApi';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { isPUCForm } from '@/types/forms';
import { PucFormat11AddressFormValues, pucFormat11AddressSchema } from '@/validation/pucFormat11Schemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function AddressSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [districtOptions, setDistrictOptions] = useState<Option<number>[]>([]);
  const [areaOptions, setAreaOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getPUCDropdowns();
      if (response.success && response.data) {
        setDistrictOptions(response.data.districts?.map((d: any) => ({
          value: Number(d.value),
          label: d.label
        })) || []);
        const places = response.data.places?.map((p: any) => ({
          value: Number(p.value),
          label: p.label
        })) || [];
        setAreaOptions(places.length > 0 ? places : [
          { value: 1, label: 'Urban' },
          { value: 2, label: 'Rural' },
          { value: 3, label: 'Semi-Urban' },
        ]);
      } else {
        setAreaOptions([
          { value: 1, label: 'Urban' },
          { value: 2, label: 'Rural' },
          { value: 3, label: 'Semi-Urban' },
        ]);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const addressData = isPUCForm(formData)
    ? formData.address
    : { District: 0, OtherDistrict: '', Taluk: '', ResidentialAddress: '', PinCode: '' };

  const { control, handleSubmit, formState } = useForm<PucFormat11AddressFormValues>({
    defaultValues: {
      District: addressData.District || 0,
      OtherDistrict: addressData.OtherDistrict,
      Taluk: addressData.Taluk,
      ResidentialAddress: addressData.ResidentialAddress,
      PinCode: (addressData as any).PinCode || '',
    },
    resolver: zodResolver(pucFormat11AddressSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: PucFormat11AddressFormValues) => {
    updateSectionData('address', data);
    updateValidationState('address', { isValid: true, data });
    markStepComplete(3);
    navigation.navigate('family');
  };

  const onInvalid = () => {
    Alert.alert('Missing Required Details', 'Please fill all details marked with * before proceeding.');
  };

  const isNextDisabled = loadingDropdowns;

  return (
    <FormScreenLayout
      title="Address Details"
      step={4}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
      nextDisabled={isNextDisabled}
    >
      <FormSectionHeader
        icon="location"
        title="Address Information"
        subtitle="Where do you live?"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="ResidentialAddress"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Residential Address"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your full address"
              multiline
              numberOfLines={3}
              error={formState.errors.ResidentialAddress?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="District"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="District"
              value={value}
              onChange={onChange}
              options={districtOptions}
              placeholder="Select district"
              error={formState.errors.District?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="OtherDistrict"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Other District (if not listed)"
              value={value}
              onChangeText={onChange}
              placeholder="Enter district name if not in list"
              error={formState.errors.OtherDistrict?.message}
              helperText="Fill only if your district is not in the list above"
            />
          )}
        />

        <Controller
          control={control}
          name="Taluk"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Taluka"
              value={value}
              onChangeText={onChange}
              placeholder="Enter taluka"
              error={formState.errors.Taluk?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="PinCode"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Pincode"
              value={value || ''}
              onChangeText={onChange}
              placeholder="Enter 6-digit pincode"
              keyboardType="numeric"
              maxLength={6}
              error={formState.errors.PinCode?.message}
              required
            />
          )}
        />
      </FormCard>

      <FormCard>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Address Guidelines:</Text>
          <Text style={styles.infoText}>
            • Provide accurate and complete address details
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
