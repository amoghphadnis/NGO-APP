import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { getSemiProfessionalDropdowns } from '@/api/semiProfessionalApi';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { SemiProfAcademicFormValues, semiProfAcademicSchema } from '@/validation/semiProfessionalSchemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function AcademicSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [collegeTypeOptions, setCollegeTypeOptions] = useState<Option<number>[]>([]);
  const [semiProfCourseOptions, setSemiProfCourseOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getSemiProfessionalDropdowns();
      console.log('[SemiPro AcademicSection] Dropdown response:', response);
      if (response.success && response.data) {
        setCollegeTypeOptions(response.data.collegeTypes?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);
        setSemiProfCourseOptions(response.data.semiProfessionalCourses?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);
        console.log('[SemiPro AcademicSection] College types:', response.data.collegeTypes);
        console.log('[SemiPro AcademicSection] Courses:', response.data.semiProfessionalCourses);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

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

  const isNextDisabled = !formState.isValid || loadingDropdowns;

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
              disabled={loadingDropdowns}
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
