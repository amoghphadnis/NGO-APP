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
import { semiProfAcademicSchema, SemiProfAcademicFormValues } from '@/validation/semiProfessionalSchemas';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

const collegeTypeOptions: Option<number>[] = [
  { value: 1, label: 'Government' },
  { value: 2, label: 'Aided' },
  { value: 3, label: 'Private' },
];

// Semi Professional courses - will be loaded from API in production
const semiProfCourseOptions: Option<number>[] = [
  { value: 1, label: 'Diploma in Computer Science' },
  { value: 2, label: 'Diploma in Mechanical Engineering' },
  { value: 3, label: 'Diploma in Civil Engineering' },
  { value: 4, label: 'Diploma in Electrical Engineering' },
  { value: 5, label: 'Diploma in Electronics' },
  { value: 6, label: 'Diploma in Nursing' },
  { value: 7, label: 'Diploma in Pharmacy' },
  { value: 8, label: 'ITI' },
  { value: 9, label: 'Other' },
];

export default function AcademicSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const academicData = (formData as any).academic ?? {
    puPercentage: 0,
    semiProfessionalCourseID: 0,
    collegeName: '',
    collegeTypeID: 0,
    collegeFees: 0,
  };

  const { control, handleSubmit, formState } = useForm<SemiProfAcademicFormValues>({
    defaultValues: {
      puPercentage: academicData.puPercentage ?? 0,
      semiProfessionalCourseID: academicData.semiProfessionalCourseID ?? 0,
      collegeName: academicData.collegeName ?? '',
      collegeTypeID: academicData.collegeTypeID ?? 0,
      collegeFees: academicData.collegeFees ?? 0,
    },
    resolver: zodResolver(semiProfAcademicSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: SemiProfAcademicFormValues) => {
    updateSectionData('academic', data);
    updateValidationState('academic', { isValid: true, data });
    markStepComplete(4);
    navigation.navigate('documents');
  };

  const isNextDisabled = !formState.isValid;

  return (
    <FormScreenLayout
      title="Academic Details"
      step={5}
      totalSteps={8}
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
              label="PU Percentage"
              value={value?.toString() ?? ''}
              onChangeText={(text) => onChange(parseFloat(text) || 0)}
              placeholder="Enter PU percentage"
              keyboardType="numeric"
              suffix="%"
              error={formState.errors.puPercentage?.message}
              helperText="Enter your PU/12th grade percentage"
              required
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
          name="semiProfessionalCourseID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Semi Professional Course"
              value={value}
              options={semiProfCourseOptions}
              onChange={onChange}
              placeholder="Select Course"
              error={formState.errors.semiProfessionalCourseID?.message}
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
          name="collegeTypeID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="College Type"
              value={value}
              options={collegeTypeOptions}
              onChange={onChange}
              placeholder="Select college type"
              error={formState.errors.collegeTypeID?.message}
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
          name="collegeFees"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="College Fees"
              value={value?.toString() ?? ''}
              onChangeText={(text) => onChange(text ? parseFloat(text.replace(/,/g, '')) : undefined)}
              placeholder="Enter college fees"
              keyboardType="numeric"
              prefix="₹"
              error={formState.errors.collegeFees?.message}
              helperText="Enter total annual college fees"
              required
            />
          )}
        />
      </FormCard>

      {/* Guidelines */}
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
