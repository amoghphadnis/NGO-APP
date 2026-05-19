import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import { useFormEngineStore } from '../../store/useFormEngineStore';
import { familyDetailsSchema, FamilyDetailsFormValues } from '@/validation/formSchemas';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';
import { DropdownField } from '@/components/form/DropdownField';

const fatherOccupationOptions = [
  { value: "1", label: "Carpenter" },
  { value: "2", label: "Coolie" },
  { value: "3", label: "Daily Wage" },
]; // 1=Carpenter, 2=Coolie, 3=Daily Wage

const motherOccupationOptions = [
  { value: "1", label: "Coolie" },
  { value: "2", label: "Daily wages" },
  { value: "3", label: "Home maker" },
  { value: "4", label: "Not working" },
  { value: "5", label: "Tailor" },
  { value: "6", label: "Expired" },
  { value: "7", label: "Other" },
]; // 1=Coolie, 2=Daily wages, 3=Home maker, 4=Not working, 5=Tailor, 6=Expired, 7=Other

export default function FamilySection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const familyData = formData?.family ?? {
    fatherOccupationID: '',
    motherOccupationID: '',
    familyMembers: 1,
    familyComposition: [],
    annualIncome: '',
  };

  const { control, handleSubmit, formState } = useForm<FamilyDetailsFormValues>({
    defaultValues: {
      fatherOccupationID: familyData.fatherOccupationID,
      motherOccupationID: familyData.motherOccupationID,
      familyMembers: familyData.familyMembers,
      familyComposition: familyData.familyComposition,
      annualIncome: familyData.annualIncome,
    },
    resolver: zodResolver(familyDetailsSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: FamilyDetailsFormValues) => {
    updateSectionData('family', data);
    updateValidationState('family', { isValid: true, data });
    markStepComplete(4);
    
    // Navigate based on form type
    const currentFormType = useFormEngineStore.getState().currentFormType;
    if (currentFormType === 'puc') {
      navigation.navigate('documents');
    } else {
      navigation.navigate('category');
    }
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
          name="fatherOccupationID"
          render={({ field: { onChange, value } }) => (
            <DropdownField
              label="Father's Occupation"
              value={value?.toString() ?? ''}
              onValueChange={onChange}
              options={fatherOccupationOptions}
              placeholder="Select father's occupation"
              error={formState.errors.fatherOccupationID?.message}
              helperText="Select occupation from dropdown"
            />
          )}
        />

        <Controller
          control={control}
          name="motherOccupationID"
          render={({ field: { onChange, value } }) => (
            <DropdownField
              label="Mother's Occupation"
              value={value?.toString() ?? ''}
              onValueChange={onChange}
              options={motherOccupationOptions}
              placeholder="Select mother's occupation"
              error={formState.errors.motherOccupationID?.message}
              helperText="Select occupation from dropdown"
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
          name="familyMembers"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Total Family Members"
              value={value?.toString() ?? '1'}
              onChangeText={(text) => onChange(parseInt(text) || 1)}
              placeholder="Enter total family members"
              keyboardType="numeric"
              error={formState.errors.familyMembers?.message}
              helperText="Include all family members living together"
            />
          )}
        />

        <Controller
          control={control}
          name="annualIncome"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Annual Family Income"
              value={value}
              onChangeText={onChange}
              placeholder="Enter annual family income"
              keyboardType="numeric"
              prefix="₹"
              error={formState.errors.annualIncome?.message}
              helperText="Total annual income from all sources"
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
