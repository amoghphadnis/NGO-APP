import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import { useFormEngineStore } from '../../../store/useFormEngineStore';
import { isProfessionalForm } from '@/types/forms';
import { academicDetailsSchema, AcademicDetailsFormValues } from '@/validation/professionalSchemas';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';

const collegeType: Option<'1' | '2' | '3'>[] = [
  { value: '1', label: 'Government' },
  { value: '2', label: 'Aided' },
  { value: '3', label: 'Private' },
];

export default function AcademicSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const { control, handleSubmit, formState } = useForm<AcademicDetailsFormValues>({
    defaultValues: {
      puPercentage: isProfessionalForm(formData) ? formData.academic.puPercentage ?? 0 : 0,
      cetNeetRank: isProfessionalForm(formData) ? formData.academic.cetNeetRank ?? undefined : undefined,
      courseTypeID: isProfessionalForm(formData) ? formData.academic.courseTypeID ?? '' : '',
      collegeName: isProfessionalForm(formData) ? formData.academic.collegeName ?? '' : '',
      collegeTypeID: isProfessionalForm(formData) ? formData.academic.collegeTypeID ?? '1' : '1',
      collegeFees: isProfessionalForm(formData) ? formData.academic.collegeFees ?? 0 : 0,
    },
    resolver: zodResolver(academicDetailsSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: AcademicDetailsFormValues) => {
    updateSectionData('academic', data);
    updateValidationState('academic', { isValid: true, data });
    markStepComplete(5);
    navigation.navigate('documents');
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
              onChangeText={(text) => onChange(text ? parseInt(text, 10) : undefined)}
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
          name="courseTypeID"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Course Type"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your course type"
              error={formState.errors.courseTypeID?.message}
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
            render={({ field }) => (
              <ModalSelectField
                label="College Type"
                placeholder="Select college type"
                value={field.value}
                onChange={field.onChange}
                options={collegeType}
                error={
                  formState.errors.collegeTypeID
                    ?.message
                }
                required
              />
            )}
          />
          
        
        {/* <Controller
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
        /> */}
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
              label="Annual College Fees"
              value={value?.toString() ?? ''}
              onChangeText={(text) => onChange(text ? parseFloat(text.replace(/,/g, '')) : undefined)}
              placeholder="Enter annual fees"
              keyboardType="numeric"
              prefix="₹"
              error={formState.errors.collegeFees?.message}
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
