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

export default function FamilySection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const familyData = formData?.family ?? {
    fatherOccupation: '',
    motherOccupation: '',
    familyMembers: 1,
    familyComposition: [],
    annualIncome: '',
  };

  const { control, handleSubmit, formState } = useForm<FamilyDetailsFormValues>({
    defaultValues: {
      fatherOccupation: familyData.fatherOccupation,
      motherOccupation: familyData.motherOccupation,
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
          name="fatherOccupation"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Father's Occupation"
              value={value}
              onChangeText={onChange}
              placeholder="Enter father's occupation"
              error={formState.errors.fatherOccupation?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="motherOccupation"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Mother's Occupation"
              value={value}
              onChangeText={onChange}
              placeholder="Enter mother's occupation"
              error={formState.errors.motherOccupation?.message}
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
