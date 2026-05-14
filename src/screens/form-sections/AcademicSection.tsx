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
import { academicDetailsSchema, AcademicDetailsFormValues } from '@/validation/formSchemas';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

export default function AcademicSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const { control, handleSubmit, formState } = useForm<AcademicDetailsFormValues>({
    defaultValues: {
      puPercentage: isProfessionalForm(formData) ? formData.academic.puPercentage ?? 0 : 0,
      cetNeetRank: isProfessionalForm(formData) ? formData.academic.cetNeetRank ?? undefined : undefined,
      course: isProfessionalForm(formData) ? formData.academic.course ?? '' : '',
      collegeName: isProfessionalForm(formData) ? formData.academic.collegeName ?? '' : '',
      collegeType: isProfessionalForm(formData) ? formData.academic.collegeType ?? 'Government' : 'Government',
      annualCollegeFees: isProfessionalForm(formData) ? formData.academic.annualCollegeFees ?? 0 : 0,
    },
    resolver: zodResolver(academicDetailsSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: AcademicDetailsFormValues) => {
    updateSectionData('academic', data);
    updateValidationState('academic', { isValid: true, data });
    markStepComplete(6);
    navigation.navigate('bank');
  };

  const isNextDisabled = !formState.isValid;

  return (
    <FormScreenLayout
      title="Academic Details"
      step={7}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
    >
      {/* Academic Performance */}
      <FormSectionHeader
        icon="school"
        title="Academic Performance"
        subtitle="Your academic achievements"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="puPercentage"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="PU/12th Percentage"
              value={value?.toString() ?? ''}
              onChangeText={(text) => onChange(parseFloat(text) || 0)}
              placeholder="Enter percentage"
              keyboardType="numeric"
              suffix="%"
              error={formState.errors.puPercentage?.message}
              helperText="Enter your PU/12th grade percentage"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="cetNeetRank"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="CET/NEET Rank"
              value={value?.toString() ?? ''}
              onChangeText={(text) => onChange(parseInt(text) || 0)}
              placeholder="Enter rank if applicable"
              keyboardType="numeric"
              error={formState.errors.cetNeetRank?.message}
              helperText="Optional: Enter CET/NEET rank if applicable"
            />
          )}
        />
      </FormCard>

      {/* Course Information */}
      <FormSectionHeader
        icon="book"
        title="Course Information"
        subtitle="Details about your current course"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="course"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Course Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your course name"
              error={formState.errors.course?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="collegeName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="College Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your college name"
              error={formState.errors.collegeName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="collegeType"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="College Type"
              value={value}
              onChangeText={onChange}
              placeholder="Select college type"
              error={formState.errors.collegeType?.message}
              required
            />
          )}
        />
      </FormCard>

      {/* Fee Information */}
      <FormSectionHeader
        icon="card"
        title="Fee Information"
        subtitle="Annual college fees details"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="annualCollegeFees"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Annual College Fees"
              value={value?.toString() ?? ''}
              onChangeText={(text) => onChange(parseFloat(text.replace(/,/g, '')) || 0)}
              placeholder="Enter annual fees"
              keyboardType="numeric"
              prefix="₹"
              error={formState.errors.annualCollegeFees?.message}
              helperText="Enter total annual college fees"
              required
            />
          )}
        />
      </FormCard>

      {/* Academic Guidelines */}
      <FormCard>
        <View style={styles.guidelineContainer}>
          <Text style={styles.guidelineTitle}>Important Guidelines:</Text>
          <Text style={styles.guidelineText}>
            • Enter accurate academic information
          </Text>
          <Text style={styles.guidelineText}>
            • Percentage should be from recognized board/university
          </Text>
          <Text style={styles.guidelineText}>
            • College fees should include tuition and other mandatory fees
          </Text>
          <Text style={styles.guidelineText}>
            • Documents may be verified during the process
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
