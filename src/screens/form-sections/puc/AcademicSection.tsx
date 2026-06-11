import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { getPUCDropdowns } from '@/api/pucApi';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { isPUCForm } from '@/types/forms';
import { PucAcademicDetailsFormValues, pucAcademicDetailsSchema } from '@/validation/pucSchemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function AcademicSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [courseOptions, setCourseOptions] = useState<Option<number>[]>([]);
  const [collegeTypeOptions, setCollegeTypeOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getPUCDropdowns();
      console.log('[AcademicSection] Dropdown response:', response);
      if (response.success && response.data) {
        setCourseOptions(response.data.courses?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);
        setCollegeTypeOptions(response.data.collegeTypes?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);
        console.log('[AcademicSection] Course options:', response.data.courses);
        console.log('[AcademicSection] College type options:', response.data.collegeTypes);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const academicData = isPUCForm(formData) ? formData.academic ?? {
    courseID: 0,
    collegeName: '',
    collegeTypeID: 0,
    expectedFees: 0,
    percentage: 0,
    totalMarks: 0,
  } : {
    courseID: 0,
    collegeName: '',
    collegeTypeID: 0,
    expectedFees: 0,
    percentage: 0,
    totalMarks: 0,
  };

  const { control, handleSubmit, formState } = useForm<PucAcademicDetailsFormValues>({
    defaultValues: {
      courseID: academicData.courseID || 0,
      collegeName: academicData.collegeName,
      collegeTypeID: academicData.collegeTypeID || 0,
      expectedFees: academicData.expectedFees,
      percentage: academicData.percentage,
      totalMarks: academicData.totalMarks,
    },
    resolver: zodResolver(pucAcademicDetailsSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: PucAcademicDetailsFormValues) => {
    updateSectionData('academic', data);
    updateValidationState('academic', { isValid: true, data });
    markStepComplete(6);
    navigation.navigate('documents');
  };

  const isNextDisabled = !formState.isValid || loadingDropdowns;

  return (
    <FormScreenLayout
      title="Academic Details"
      step={7}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
    >
      {/* Course Information */}
      <FormSectionHeader
        icon="school"
        title="Course Information"
        subtitle="Details about your course"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="courseID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Course"
              value={value}
              onChange={onChange}
              options={courseOptions}
              placeholder="Select your course"
              error={formState.errors.courseID?.message}
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
              placeholder="Enter college name"
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
              onChange={onChange}
              options={collegeTypeOptions}
              placeholder="Select college type"
              error={formState.errors.collegeTypeID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />
      </FormCard>

      {/* Academic Performance */}
      <FormSectionHeader
        icon="analytics"
        title="Academic Performance"
        subtitle="Your SSLC examination details"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="percentage"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Percentage"
              value={String(value)}
              onChangeText={(text) => onChange(Number(text))}
              placeholder="Enter SSLC percentage"
              keyboardType="numeric"
              error={formState.errors.percentage?.message}
              helperText="Enter percentage obtained in SSLC"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="totalMarks"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Total Marks"
              value={String(value)}
              onChangeText={(text) => onChange(Number(text))}
              placeholder="Enter total marks obtained"
              keyboardType="numeric"
              error={formState.errors.totalMarks?.message}
              required
            />
          )}
        />
      </FormCard>

      {/* Fee Details */}
      <FormSectionHeader
        icon="cash"
        title="Fee Details"
        subtitle="Expected college fees"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="expectedFees"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Expected Fees"
              value={String(value)}
              onChangeText={(text) => onChange(Number(text))}
              placeholder="Enter expected annual fees"
              keyboardType="numeric"
              error={formState.errors.expectedFees?.message}
              helperText="Enter total annual college fees in rupees"
              required
            />
          )}
        />
      </FormCard>

      {/* Guidelines */}
      <FormCard>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Important Guidelines:</Text>
          <Text style={styles.infoText}>
            • Ensure all academic details are accurate
          </Text>
          <Text style={styles.infoText}>
            • Marks card will be verified
          </Text>
          <Text style={styles.infoText}>
            • Fee structure should match college documents
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
