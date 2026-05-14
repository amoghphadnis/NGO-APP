import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import { useFormEngineStore } from '../../store/useFormEngineStore';
import { isProfessionalForm } from '@/types/forms';
import { categoryDetailsSchema, CategoryDetailsFormValues } from '@/validation/formSchemas';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

export default function CategorySection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const { control, handleSubmit, formState } = useForm<CategoryDetailsFormValues>({
    defaultValues: {
      scholarshipCategory: isProfessionalForm(formData) ? formData.category.scholarshipCategory ?? '' : '',
      courseType: isProfessionalForm(formData) ? formData.category.courseType ?? '' : '',
    },
    resolver: zodResolver(categoryDetailsSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: CategoryDetailsFormValues) => {
    updateSectionData('category', data);
    updateValidationState('category', { isValid: true, data });
    markStepComplete(5);
    navigation.navigate('bank');
  };

  const isNextDisabled = !formState.isValid;

  return (
    <FormScreenLayout
      title="Category Details"
      step={6}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
    >
      {/* Scholarship Category */}
      <FormSectionHeader
        icon="pricetag"
        title="Scholarship Category"
        subtitle="Select your scholarship category"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="scholarshipCategory"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Scholarship Category"
              value={value}
              onChangeText={onChange}
              placeholder="Enter scholarship category"
              error={formState.errors.scholarshipCategory?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="courseType"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Course Type"
              value={value}
              onChangeText={onChange}
              placeholder="Enter course type"
              error={formState.errors.courseType?.message}
              required
            />
          )}
        />
      </FormCard>

      {/* Category Information */}
      <FormSectionHeader
        icon="information-circle"
        title="Category Information"
        subtitle="Details about scholarship categories"
      />
      
      <FormCard>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Available Categories:</Text>
          <Text style={styles.infoText}>• Merit-based Scholarship</Text>
          <Text style={styles.infoText}>• Need-based Scholarship</Text>
          <Text style={styles.infoText}>• Special Category Scholarship</Text>
          <Text style={styles.infoText}>• Sports Quota Scholarship</Text>
        </View>
      </FormCard>

      {/* Guidelines */}
      <FormCard>
        <View style={styles.guidelineContainer}>
          <Text style={styles.guidelineTitle}>Important Guidelines:</Text>
          <Text style={styles.guidelineText}>
            • Select the appropriate category based on your eligibility
          </Text>
          <Text style={styles.guidelineText}>
            • Category selection affects scholarship amount and benefits
          </Text>
          <Text style={styles.guidelineText}>
            • Documents may be required to verify category eligibility
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
