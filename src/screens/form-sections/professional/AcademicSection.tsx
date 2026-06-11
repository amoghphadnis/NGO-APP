import React, { useEffect, useState } from 'react';
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
import { getProfessionalDropdowns } from '@/api/professionalApi';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';

export default function AcademicSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [courseOptions, setCourseOptions] = useState<Option<number>[]>([]);
  const [collegeTypeOptions, setCollegeTypeOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getProfessionalDropdowns();
      console.log('[AcademicSection] Dropdown response:', response);
      if (response.success && response.data) {
        setCourseOptions(response.data.courses?.map((c: any) => ({ 
          value: Number(c.value), 
          label: c.label 
        })) || []);
        setCollegeTypeOptions(response.data.collegeTypes?.map((t: any) => ({ 
          value: Number(t.value), 
          label: t.label 
        })) || []);
        console.log('[AcademicSection] Course options:', response.data.courses);
        console.log('[AcademicSection] CollegeType options:', response.data.collegeTypes);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const { control, handleSubmit, formState } = useForm<AcademicDetailsFormValues>({
    defaultValues: {
      PUPercentage: isProfessionalForm(formData) ? formData.academic.PUPercentage ?? 0 : 0,
      CET_NEET_Rank: isProfessionalForm(formData) ? formData.academic.CET_NEET_Rank ?? undefined : undefined,
      CourseTypeID: isProfessionalForm(formData) ? formData.academic.CourseTypeID ?? 0 : 0,
      CollegeName: isProfessionalForm(formData) ? formData.academic.CollegeName ?? '' : '',
      CollegeTypeID: isProfessionalForm(formData) ? formData.academic.CollegeTypeID ?? 0 : 0,
      CollegeFees: isProfessionalForm(formData) ? formData.academic.CollegeFees ?? 0 : 0,
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

  const isNextDisabled = !formState.isValid || loadingDropdowns;

  return (
    <FormScreenLayout
      title="Academic Details"
      step={6}
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
          name="PUPercentage"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="PU/12th Percentage"
              value={value?.toString() ?? ''}
              onChangeText={(text) => onChange(parseFloat(text) || 0)}
              placeholder="Enter percentage"
              keyboardType="numeric"
              suffix="%"
              error={formState.errors.PUPercentage?.message}
              helperText="Enter your PU/12th grade percentage"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="CET_NEET_Rank"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="CET/NEET Rank"
              value={value ?? ''}
              onChangeText={onChange}
              placeholder="Enter rank or 'Not Appeared'"
              error={formState.errors.CET_NEET_Rank?.message}
              helperText="Optional: Enter CET/NEET rank or 'Not Appeared'"
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
          name="CourseTypeID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Course"
              placeholder="Select course"
              value={value}
              onChange={onChange}
              options={courseOptions}
              error={formState.errors.CourseTypeID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="CollegeName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="College Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your college name"
              error={formState.errors.CollegeName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="CollegeTypeID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="College Type"
              placeholder="Select college type"
              value={value}
              onChange={onChange}
              options={collegeTypeOptions}
              error={formState.errors.CollegeTypeID?.message}
              required
              disabled={loadingDropdowns}
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
          name="CollegeFees"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Annual College Fees"
              value={value?.toString() ?? ''}
              onChangeText={(text) => onChange(text ? parseFloat(text.replace(/,/g, '')) : undefined)}
              placeholder="Enter annual fees"
              keyboardType="numeric"
              prefix="₹"
              error={formState.errors.CollegeFees?.message}
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
