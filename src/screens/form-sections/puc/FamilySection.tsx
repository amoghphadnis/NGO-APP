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
import { pucFamilyDetailsSchema, PucFamilyDetailsFormValues } from '@/validation/pucSchemas';
import { isPUCForm } from '@/types/forms';
import { OCCUPATION_OPTIONS } from '@/constants/formOptions';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

const occupationOptions: Option<number>[] = OCCUPATION_OPTIONS.map(opt => ({ value: parseInt(opt.value, 10), label: opt.label }));

export default function FamilySection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const familyData = isPUCForm(formData) ? formData.family ?? {
    fatherName: '',
    motherName: '',
    fatherOccupationID: undefined,
    motherOccupationID: undefined,
    familyMembers: 1,
    familyComposition: [],
    annualIncome: '',
    monthlyRent: '',
    residenceType: undefined,
  } : {
    fatherName: '',
    motherName: '',
    fatherOccupationID: undefined,
    motherOccupationID: undefined,
    familyMembers: 1,
    familyComposition: [],
    annualIncome: '',
    monthlyRent: '',
    residenceType: undefined,
  };

  const { control, handleSubmit, formState } = useForm<PucFamilyDetailsFormValues>({
    defaultValues: {
      fatherName: familyData.fatherName,
      motherName: familyData.motherName,
      fatherOccupationID: familyData.fatherOccupationID,
      motherOccupationID: familyData.motherOccupationID,
      familyMembers: familyData.familyMembers,
      familyComposition: familyData.familyComposition,
      annualIncome: familyData.annualIncome,
      monthlyRent: familyData.monthlyRent,
      residenceType: familyData.residenceType,
    },
    resolver: zodResolver(pucFamilyDetailsSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: PucFamilyDetailsFormValues) => {
    updateSectionData('family', data);
    updateValidationState('family', { isValid: true, data });
    markStepComplete(4);
    navigation.navigate('category');
  };

  const isNextDisabled = !formState.isValid;

  return (
    <FormScreenLayout
      title="Family Details"
      step={5}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
    >
      {/* Family Information */}
      <FormSectionHeader
        icon="people"
        title="Family Information"
        subtitle="Tell us about your family"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="fatherName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Father Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter father's full name"
              error={formState.errors.fatherName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="motherName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Mother Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter mother's full name"
              error={formState.errors.motherName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="familyMembers"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Family Members"
              value={String(value)}
              onChangeText={(text) => onChange(Number(text))}
              placeholder="Enter number of family members"
              keyboardType="numeric"
              error={formState.errors.familyMembers?.message}
              required
            />
          )}
        />
      </FormCard>

      {/* Occupation Details */}
      <FormSectionHeader
        icon="briefcase"
        title="Occupation Details"
        subtitle="Parent/guardian occupation"
      />
      
      <FormCard>
        <Controller
          control={control}
          name="fatherOccupationID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Father Occupation"
              value={value}
              onChange={onChange}
              options={occupationOptions}
              placeholder="Select father's occupation"
              error={formState.errors.fatherOccupationID?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="motherOccupationID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Mother Occupation"
              value={value}
              onChange={onChange}
              options={occupationOptions}
              placeholder="Select mother's occupation"
              error={formState.errors.motherOccupationID?.message}
            />
          )}
        />
      </FormCard>

      {/* Income Details */}
      <FormSectionHeader
        icon="cash"
        title="Income Details"
        subtitle="Annual family income"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="annualIncome"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Annual Family Income"
              value={value}
              onChangeText={onChange}
              placeholder="Enter annual income in rupees"
              keyboardType="numeric"
              error={formState.errors.annualIncome?.message}
              helperText="Enter total annual income of all family members"
            />
          )}
        />
      </FormCard>

      {/* Guidelines */}
      <FormCard>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Income Guidelines:</Text>
          <Text style={styles.infoText}>
            • Provide accurate income information
          </Text>
          <Text style={styles.infoText}>
            • Income certificates may be required for verification
          </Text>
          <Text style={styles.infoText}>
            • Include income from all sources
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
