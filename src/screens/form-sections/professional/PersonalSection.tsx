import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { getProfessionalDropdowns } from '@/api/professionalApi';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import VPDatePickerField from '@/components/common/VPDatePickerField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { ProfessionalPersonalDetailsFormValues, professionalPersonalDetailsSchema } from '@/validation/professionalSchemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function PersonalSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [genderOptions, setGenderOptions] = useState<Option<number>[]>([]);
  const [casteOptions, setCasteOptions] = useState<Option<number>[]>([]);
  const [districtOptions, setDistrictOptions] = useState<Option<number>[]>([]);
  const [areaTypeOptions, setAreaTypeOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getProfessionalDropdowns();
      if (response.success && response.data) {
        setGenderOptions(response.data.genders?.map((g: any) => ({
          value: Number(g.value),
          label: g.label
        })) || []);
        setCasteOptions(response.data.castes?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);
        setDistrictOptions(response.data.districts?.map((d: any) => ({
          value: Number(d.value),
          label: d.label
        })) || []);
        const areas = response.data.areaTypes?.map((a: any) => ({
          value: Number(a.value),
          label: a.label
        })) || [];
        setAreaTypeOptions(areas.length > 0 ? areas : [
          { value: 1, label: 'Urban' },
          { value: 2, label: 'Rural' },
          { value: 3, label: 'Semi-Urban' },
        ]);
      } else {
        setAreaTypeOptions([
          { value: 1, label: 'Urban' },
          { value: 2, label: 'Rural' },
          { value: 3, label: 'Semi-Urban' },
        ]);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const personalData = (formData as any).personal ?? {
    Email: '',
    StudentName: '',
    DateOfBirth: '',
    ContactNumber: '',
    AlternateNumber: '',
    ResidentialAddress: '',
    GoogleMapLink: '',
    AreaTypeID: 0,
    DistrictID: 0,
    OtherDistrict: '',
    GenderID: 0,
    CasteCategoryID: 0,
  };

  const { control, handleSubmit, formState, watch } = useForm<ProfessionalPersonalDetailsFormValues>({
    defaultValues: {
      Email: personalData.Email ?? '',
      StudentName: personalData.StudentName ?? '',
      DateOfBirth: personalData.DateOfBirth ?? '',
      ContactNumber: personalData.ContactNumber ?? '',
      AlternateNumber: personalData.AlternateNumber ?? '',
      ResidentialAddress: personalData.ResidentialAddress ?? '',
      GoogleMapLink: personalData.GoogleMapLink ?? '',
      AreaTypeID: personalData.AreaTypeID ?? 0,
      DistrictID: personalData.DistrictID ?? 0,
      OtherDistrict: personalData.OtherDistrict ?? '',
      GenderID: personalData.GenderID ?? 0,
      CasteCategoryID: personalData.CasteCategoryID ?? 0,
    },
    resolver: zodResolver(professionalPersonalDetailsSchema),
    mode: 'onChange',
  });

  const watchedEmail = watch('Email');
  const emailSuccess = !!watchedEmail && !formState.errors.Email;
  const selectedDistrict = watch('DistrictID');
  const showOtherDistrict = selectedDistrict === 11;

  const onSubmit = (data: ProfessionalPersonalDetailsFormValues) => {
    updateSectionData('personal', data);
    updateValidationState('personal', { isValid: true, data });
    markStepComplete(1);
    navigation.navigate('family');
  };

  const onInvalid = () => {
    Alert.alert('Missing Required Details', 'Please fill all details marked with * before proceeding.');
  };

  const isNextDisabled = loadingDropdowns;

  return (
    <FormScreenLayout
      title="Applicant's Information"
      step={2}
      totalSteps={7}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
      nextDisabled={isNextDisabled}
    >
      <FormSectionHeader
        icon="person"
        title="Personal Details"
        subtitle="Fields marked with * are required"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="Email"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Email"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={formState.errors.Email?.message}
              successText={emailSuccess ? 'Email format looks good' : undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="StudentName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Student Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your full name"
              error={formState.errors.StudentName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="DateOfBirth"
          render={({ field: { onChange, value } }) => (
            <VPDatePickerField
              label="Date of Birth"
              value={value}
              onChange={onChange}
              placeholder="Select date of birth"
              error={formState.errors.DateOfBirth?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="ContactNumber"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Contact Number"
              value={value}
              onChangeText={onChange}
              placeholder="Enter 10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              error={formState.errors.ContactNumber?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="AlternateNumber"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Alternate Number"
              value={value ?? ''}
              onChangeText={onChange}
              placeholder="Enter alternate number (optional)"
              keyboardType="phone-pad"
              maxLength={10}
              error={formState.errors.AlternateNumber?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="GenderID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Gender"
              value={value}
              options={genderOptions}
              onChange={onChange}
              placeholder="Select gender"
              error={formState.errors.GenderID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="CasteCategoryID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Caste"
              value={value}
              options={casteOptions}
              onChange={onChange}
              placeholder="Select caste category"
              error={formState.errors.CasteCategoryID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />
      </FormCard>

      <FormSectionHeader
        icon="location"
        title="Address Details"
        subtitle="Where do you currently reside?"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="AreaTypeID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Area Type"
              value={value}
              options={areaTypeOptions}
              onChange={onChange}
              placeholder="Select area type"
              error={formState.errors.AreaTypeID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="DistrictID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="District"
              value={value}
              options={districtOptions}
              disabled={loadingDropdowns}
              onChange={onChange}
              placeholder="Select district"
              error={formState.errors.DistrictID?.message}
              required
            />
          )}
        />

        {showOtherDistrict && (
          <Controller
            control={control}
            name="OtherDistrict"
            render={({ field: { onChange, value } }) => (
              <VPInputField
                label="Other District"
                value={value ?? ''}
                onChangeText={onChange}
                placeholder="Enter district name"
                error={formState.errors.OtherDistrict?.message}
                required
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="ResidentialAddress"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Residential Address"
              value={value}
              onChangeText={onChange}
              placeholder="Enter complete residential address"
              multiline
              numberOfLines={3}
              error={formState.errors.ResidentialAddress?.message}
              helperText="Include house number, street name, and landmarks"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="GoogleMapLink"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Google Map Link"
              value={value ?? ''}
              onChangeText={onChange}
              placeholder="Paste Google Maps link (optional)"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              error={formState.errors.GoogleMapLink?.message}
              helperText="Optional: Link to your residence location"
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
