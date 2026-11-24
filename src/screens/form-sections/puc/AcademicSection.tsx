import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet } from 'react-native';

import { getPUCDropdowns } from '@/api/pucApi';
import DecimalInputField from '@/components/common/DecimalInputField';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { isPUCForm } from '@/types/forms';
import { PucFormat11AcademicFormValues, pucFormat11AcademicSchema } from '@/validation/pucFormat11Schemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function AcademicSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [courseOptions, setCourseOptions] = useState<Option<number>[]>([]);
  const [collegeTypeOptions, setCollegeTypeOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getPUCDropdowns();
      if (response.success && response.data) {
        setCourseOptions(response.data.courses?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);
        setCollegeTypeOptions(response.data.collegeTypes?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const academicData = isPUCForm(formData)
    ? formData.academic
    : { SSLCPercentage: undefined as any, CourseJoined: 0, CollegeName: '', CollegeType: 0, CollegeFees: 0 };

  const { control, handleSubmit, formState } = useForm<PucFormat11AcademicFormValues>({
    defaultValues: {
      SSLCPercentage: academicData.SSLCPercentage || undefined,
      CourseJoined: academicData.CourseJoined || 0,
      CollegeName: academicData.CollegeName,
      CollegeType: academicData.CollegeType || 0,
      CollegeFees: academicData.CollegeFees || 0,
    },
    resolver: zodResolver(pucFormat11AcademicSchema),
    mode: 'onChange',
  });



  const onSubmit = (data: PucFormat11AcademicFormValues) => {
    updateSectionData('academic', data);
    updateValidationState('academic', { isValid: true, data });
    markStepComplete(5);
    navigation.navigate('documents');
  };

  const onInvalid = () => {
    Alert.alert('Missing Required Details', 'Please fill all details marked with * before proceeding.');
  };

  const isNextDisabled = loadingDropdowns;

  return (
    <FormScreenLayout
      title="Academic Details"
      step={6}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
      nextDisabled={isNextDisabled}
    >
      <FormSectionHeader
        icon="school"
        title="Academic Information"
        subtitle="Course and academic details"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="SSLCPercentage"
          render={({ field: { onChange, value } }) => (
            <DecimalInputField
              label="SSLC Percentage"
              value={value}
              onChangeValue={onChange}
              placeholder="Enter SSLC percentage"
              error={formState.errors.SSLCPercentage?.message}
              helperText="Percentage obtained in SSLC (0-100)"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="CourseJoined"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Course Joined"
              value={value}
              onChange={onChange}
              options={courseOptions}
              placeholder="Select course"
              error={formState.errors.CourseJoined?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />
      </FormCard>

      <FormSectionHeader icon="business" title="College Details" showRequired />

      <FormCard>
        <Controller
          control={control}
          name="CollegeName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="College Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter college name"
              error={formState.errors.CollegeName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="CollegeType"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="College Type"
              value={value}
              onChange={onChange}
              options={collegeTypeOptions}
              placeholder="Select college type"
              error={formState.errors.CollegeType?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="CollegeFees"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="College Fees"
              value={String(value)}
              onChangeText={(text) => onChange(Number(text))}
              placeholder="Enter college fees"
              keyboardType="numeric"
              error={formState.errors.CollegeFees?.message}
              required
            />
          )}
        />
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
