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
import { semiProfFamilySchema, SemiProfFamilyFormValues } from '@/validation/semiProfessionalSchemas';
import { OCCUPATION_OPTIONS } from '@/constants/formOptions';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

const fatherOccupationOptions: Option<number>[] = OCCUPATION_OPTIONS.map(opt => ({
  value: parseInt(opt.value, 10),
  label: opt.label,
}));

const motherOccupationOptions: Option<number>[] = OCCUPATION_OPTIONS.map(opt => ({
  value: parseInt(opt.value, 10),
  label: opt.label,
}));

export default function FamilySection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const familyData = (formData as any).family ?? {
    fatherOccupationID: 0,
    motherOccupationID: 0,
    familyMembers: 1,
    annualIncome: 0,
  };

  const { control, handleSubmit, formState } = useForm<SemiProfFamilyFormValues>({
    defaultValues: {
      fatherOccupationID: familyData.fatherOccupationID ?? 0,
      motherOccupationID: familyData.motherOccupationID ?? 0,
      familyMembers: familyData.familyMembers ?? 1,
      annualIncome: familyData.annualIncome ?? 0,
    },
    resolver: zodResolver(semiProfFamilySchema),
    mode: 'onChange',
  });

  const onSubmit = (data: SemiProfFamilyFormValues) => {
    updateSectionData('family', data);
    updateValidationState('family', { isValid: true, data });
    markStepComplete(3);
    navigation.navigate('academic');
  };

  return (
    <FormScreenLayout
      title="Family Information"
      step={4}
      totalSteps={8}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
    >
      {/* Parents Information */}
      <FormSectionHeader
        icon="people"
        title="Parents Information"
        subtitle="Tell us about your parents"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="fatherOccupationID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Father Occupation"
              placeholder="Select father's occupation"
              value={value}
              onChange={onChange}
              options={fatherOccupationOptions}
              error={formState.errors.fatherOccupationID?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="motherOccupationID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Mother Occupation"
              placeholder="Select mother's occupation"
              value={value}
              onChange={onChange}
              options={motherOccupationOptions}
              error={formState.errors.motherOccupationID?.message}
              required
            />
          )}
        />
      </FormCard>

      {/* Family Details */}
      <FormSectionHeader
        icon="home"
        title="Family Details"
        subtitle="Information about your family"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="familyMembers"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Family Members"
              value={value?.toString() ?? ''}
              onChangeText={(text) => {
                const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
                onChange(isNaN(num) ? '' : num);
              }}
              placeholder="Enter total family members"
              keyboardType="numeric"
              maxLength={2}
              error={formState.errors.familyMembers?.message}
              helperText="Include all family members living together"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="annualIncome"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Annual Income"
              value={value?.toString() ?? ''}
              onChangeText={(text) => {
                const num = parseFloat(text.replace(/[^0-9.]/g, ''));
                onChange(isNaN(num) ? '' : num);
              }}
              placeholder="Enter annual family income"
              keyboardType="numeric"
              prefix="₹"
              error={formState.errors.annualIncome?.message}
              helperText="Total annual income from all sources"
              required
            />
          )}
        />
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
