import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import { useFormEngineStore } from '../../../store/useFormEngineStore';
import { isProfessionalForm } from '@/types/forms';
import {
  professionalFamilyDetailsSchema,
  ProfessionalFamilyDetailsFormValues,
} from '@/validation/professionalSchemas';
import { getProfessionalDropdowns } from '@/api/professionalApi';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

export default function FamilySection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [fatherOccupationOptions, setFatherOccupationOptions] = useState<Option<number>[]>([]);
  const [motherOccupationOptions, setMotherOccupationOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getProfessionalDropdowns();
      if (response.success && response.data) {
        setFatherOccupationOptions(response.data.fatherOcc?.map((o: any) => ({ value: o.id, label: o.name })) || []);
        setMotherOccupationOptions(response.data.motherOcc?.map((o: any) => ({ value: o.id, label: o.name })) || []);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const familyData = isProfessionalForm(formData) 
    ? formData.family 
    : { FatherOccupationID: undefined, MotherOccupationID: undefined, FamilyMembers: 1, AnnualIncome: '' };

  const { control, handleSubmit, formState } = useForm<ProfessionalFamilyDetailsFormValues>({
    defaultValues: {
      FatherOccupationID: familyData.FatherOccupationID ?? undefined,
      MotherOccupationID: familyData.MotherOccupationID ?? undefined,
      FamilyMembers: familyData.FamilyMembers || 1,
      AnnualIncome: familyData.AnnualIncome || '',
    },
    resolver: zodResolver(professionalFamilyDetailsSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: ProfessionalFamilyDetailsFormValues) => {
    updateSectionData('family', data);
    updateValidationState('family', { isValid: true, data });
    markStepComplete(4);
    navigation.navigate('academic');
  };

  return (
    <FormScreenLayout
      title="Family Information"
      step={5}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
    >
      {/* Parents Information */}
      <FormSectionHeader
        icon="people"
        title="Parents Information"
        subtitle="Tell us about your parents"
      />

      <FormCard>
        <Controller
          control={control}
          name="FatherOccupationID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Father's Occupation"
              placeholder="Select father's occupation (Optional)"
              value={value}
              onChange={onChange}
              options={fatherOccupationOptions}
              error={formState.errors.FatherOccupationID?.message}
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="MotherOccupationID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Mother's Occupation"
              placeholder="Select mother's occupation (Optional)"
              value={value}
              onChange={onChange}
              options={motherOccupationOptions}
              error={formState.errors.MotherOccupationID?.message}
              disabled={loadingDropdowns}
            />
          )}
        />
      </FormCard>

      {/* Family Details */}
      <FormSectionHeader
        icon="home"
        title="Family Details"
        subtitle="Information about your family"
      />

      <FormCard>
        <Controller
          control={control}
          name="FamilyMembers"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Total Family Members"
              value={value?.toString() ?? ''}
              onChangeText={(text) => {
                const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
                onChange(isNaN(num) ? 1 : num);
              }}
              placeholder="Enter total family members"
              keyboardType="numeric"
              maxLength={2}
              selectTextOnFocus
              error={formState.errors.FamilyMembers?.message}
              helperText="Include all family members living together"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="AnnualIncome"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Annual Family Income"
              value={value}
              onChangeText={onChange}
              placeholder="Enter annual family income"
              keyboardType="numeric"
              prefix="₹"
              error={formState.errors.AnnualIncome?.message}
              helperText="Total annual income from all sources"
              required
            />
          )}
        />
      </FormCard>

      {/* Income Guidelines */}
      <FormCard>
        <View style={styles.guidelineContainer}>
          <Text style={styles.guidelineTitle}>Income Guidelines:</Text>
          <Text style={styles.guidelineText}>
            • Income should be from all family members
          </Text>
          <Text style={styles.guidelineText}>
            • Include salary, business, agricultural income
          </Text>
          <Text style={styles.guidelineText}>
            • Income certificates may be required for verification
          </Text>
          <Text style={styles.guidelineText}>
            • False information may lead to scholarship cancellation
          </Text>
        </View>
      </FormCard>

      {/* Privacy Notice */}
      <FormCard>
        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>🔒</Text>
          <Text style={styles.infoText}>
            Family information is kept confidential and used only for scholarship eligibility assessment.
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
  },
});
