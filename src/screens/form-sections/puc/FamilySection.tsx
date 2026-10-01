import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { getPUCDropdowns } from '@/api/pucApi';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { isPUCForm } from '@/types/forms';
import { PucFormat11FamilyFormValues, pucFormat11FamilySchema } from '@/validation/pucFormat11Schemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function FamilySection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [fatherOccOptions, setFatherOccOptions] = useState<Option<number>[]>([]);
  const [motherOccOptions, setMotherOccOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getPUCDropdowns();
      if (response.success && response.data) {
        setFatherOccOptions(response.data.fatherOcc?.map((o: any) => ({
          value: Number(o.value),
          label: o.label
        })) || []);
        setMotherOccOptions(response.data.motherOcc?.map((o: any) => ({
          value: Number(o.value),
          label: o.label
        })) || []);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const familyData = isPUCForm(formData)
    ? formData.family
    : { FatherOccupation: 0, MotherOccupation: 0, TotalFamilyMembers: undefined as any, FamilyAnnualIncome: undefined as any };

  const { control, handleSubmit, formState } = useForm<PucFormat11FamilyFormValues>({
    defaultValues: {
      FatherOccupation: familyData.FatherOccupation || 0,
      MotherOccupation: familyData.MotherOccupation || 0,
      TotalFamilyMembers: familyData.TotalFamilyMembers || undefined,
      FamilyAnnualIncome: familyData.FamilyAnnualIncome || undefined,
    },
    resolver: zodResolver(pucFormat11FamilySchema),
    mode: 'onChange',
  });

  const onSubmit = (data: PucFormat11FamilyFormValues) => {
    updateSectionData('family', data);
    updateValidationState('family', { isValid: true, data });
    markStepComplete(4);
    navigation.navigate('academic');
  };

  const onInvalid = () => {
    Alert.alert('Missing Required Details', 'Please fill all details marked with * before proceeding.');
  };

  const isNextDisabled = loadingDropdowns;

  return (
    <FormScreenLayout
      title="Family Information"
      step={5}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
      nextDisabled={isNextDisabled}
    >
      <FormSectionHeader
        icon="people"
        title="Family Details"
        subtitle="Tell us about your family"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="FatherOccupation"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Father's Occupation"
              value={value}
              onChange={onChange}
              options={fatherOccOptions}
              placeholder="Select father's occupation"
              error={formState.errors.FatherOccupation?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="MotherOccupation"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Mother's Occupation"
              value={value}
              onChange={onChange}
              options={motherOccOptions}
              placeholder="Select mother's occupation"
              error={formState.errors.MotherOccupation?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="TotalFamilyMembers"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Total Family Members"
              value={value === undefined || value === null || isNaN(value) ? '' : String(value)}
              onChangeText={(text) => {
                const clean = text.replace(/[^0-9]/g, '');
                onChange(clean === '' ? undefined : Number(clean));
              }}
              placeholder="Enter total family members"
              keyboardType="numeric"
              error={formState.errors.TotalFamilyMembers?.message}
              helperText="Including parents, yourself, and all dependents"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="FamilyAnnualIncome"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Family Annual Income"
              value={value === undefined || value === null || isNaN(value) ? '' : String(value)}
              onChangeText={(text) => {
                const clean = text.replace(/[^0-9.]/g, '');
                onChange(clean === '' ? undefined : Number(clean));
              }}
              placeholder="Enter annual family income"
              keyboardType="numeric"
              prefix="₹"
              error={formState.errors.FamilyAnnualIncome?.message}
              helperText="Total annual income from all sources"
              required
            />
          )}
        />
      </FormCard>

      <FormCard>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Note:</Text>
          <Text style={styles.infoText}>
            • Family income is used to determine scholarship eligibility
          </Text>
          <Text style={styles.infoText}>
            • Include income from all earning members of the family
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
