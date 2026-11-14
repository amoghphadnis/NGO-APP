import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { listSemiProfessionalCourses } from '@/api/semiProfessionalCoursesApi';
import DecimalInputField from '@/components/common/DecimalInputField';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { SemiProfAcademicFormValues, semiProfAcademicSchema } from '@/validation/semiProfessionalSchemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function AcademicSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [courseOptions, setCourseOptions] = useState<Option<number>[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await listSemiProfessionalCourses();
        if (res.success && res.data) {
          setCourseOptions(res.data.map((c) => ({
            value: c.CourseId,
            label: c.CourseName,
          })));
        }
      } finally {
        setLoadingCourses(false);
      }
    }
    loadCourses();
  }, []);

  const academicData = (formData as any).academic ?? {
    puPercentage: undefined as number | undefined,
    cetRank: undefined as number | undefined,
    ptRank: undefined as number | undefined,
    semiProfessionalCourseID: 0,
    courseApplying: '',
    courseStream: '',
  };

  const { control, handleSubmit, setValue, formState } = useForm<SemiProfAcademicFormValues>({
    defaultValues: {
      puPercentage: academicData.puPercentage || undefined,
      cetRank: academicData.cetRank,
      ptRank: academicData.ptRank,
      semiProfessionalCourseID: academicData.semiProfessionalCourseID ?? 0,
      courseApplying: academicData.courseApplying ?? '',
      courseStream: academicData.courseStream ?? '',
    },
    resolver: zodResolver(semiProfAcademicSchema),
    mode: 'onChange',
  });



  const onSubmit = (data: SemiProfAcademicFormValues) => {
    updateSectionData('academic', data);
    updateValidationState('academic', { isValid: true, data });
    markStepComplete(3);
    navigation.navigate('documents');
  };

  const onInvalid = () => {
    Alert.alert('Missing Required Details', 'Please fill all details marked with * before proceeding.');
  };

  const isNextDisabled = false;

  return (
    <FormScreenLayout
      title="Academic Details"
      step={4}
      totalSteps={7}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
      nextDisabled={isNextDisabled}
    >
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
            <DecimalInputField
              label="Secured Percentage in PUC II / 12th Grade"
              value={value}
              onChangeValue={onChange}
              placeholder="Enter your percentage"
              suffix="%"
              error={formState.errors.puPercentage?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="cetRank"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="CET Rank"
              value={value?.toString() ?? ''}
              onChangeText={(text) => {
                const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
                onChange(isNaN(num) ? undefined : num);
              }}
              placeholder="Enter your CET rank"
              keyboardType="numeric"
              error={formState.errors.cetRank?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="ptRank"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Agriculture/Veterinary/Horticulture (PT Rank)"
              value={value?.toString() ?? ''}
              onChangeText={(text) => {
                const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
                onChange(isNaN(num) ? undefined : num);
              }}
              placeholder="Enter your PT rank"
              keyboardType="numeric"
              error={formState.errors.ptRank?.message}
              helperText="Practical Test rank for Agriculture, Veterinary or Horticulture courses"
              required
            />
          )}
        />
      </FormCard>

      <FormSectionHeader
        icon="book"
        title="Course Information"
        subtitle="Details about the course you are applying for"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="semiProfessionalCourseID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Course Applying For"
              value={value}
              options={courseOptions}
              onChange={(id) => {
                onChange(id);
                const picked = courseOptions.find((o) => o.value === id);
                setValue('courseApplying', picked?.label ?? '', { shouldValidate: true });
              }}
              placeholder="Select course"
              error={formState.errors.semiProfessionalCourseID?.message}
              required
              disabled={loadingCourses}
            />
          )}
        />

        <Controller
          control={control}
          name="courseStream"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Course Stream"
              value={value}
              onChangeText={onChange}
              placeholder="e.g. Nursing, Agriculture, Veterinary"
              error={formState.errors.courseStream?.message}
              required
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
