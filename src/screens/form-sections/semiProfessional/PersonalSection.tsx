import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { getSemiProfessionalDropdowns } from '@/api/semiProfessionalApi';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import VPDatePickerField from '@/components/common/VPDatePickerField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { SemiProfPersonalFormValues, semiProfPersonalSchema } from '@/validation/semiProfessionalSchemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

interface PersonalSectionProps {
  navigation: any;
}

export default function PersonalSection({ navigation }: PersonalSectionProps) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [genderOptions, setGenderOptions] = useState<Option<number>[]>([]);
  const [casteOptions, setCasteOptions] = useState<Option<number>[]>([]);
  const [districtOptions, setDistrictOptions] = useState<Option<number>[]>([]);
  const [areaTypeOptions, setAreaTypeOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getSemiProfessionalDropdowns();
      console.log('[SemiPro PersonalSection] Dropdown response:', response);
      if (response.success && response.data) {
        setGenderOptions(response.data.genders?.map((g: any) => ({
          value: Number(g.value),
          label: g.label
        })) || []);
        setCasteOptions(response.data.casteCategories?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);
        setDistrictOptions(response.data.districts?.map((d: any) => ({
          value: Number(d.value),
          label: d.label
        })) || []);
        setAreaTypeOptions(response.data.areaTypes?.map((a: any) => ({
          value: Number(a.value),
          label: a.label
        })) || []);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const personalData = (formData as any).personal ?? {
    email: '',
    studentName: '',
    dateOfBirth: '',
    contactNumber: '',
    alternateNumber: '',
    residentialAddress: '',
    googleMapLink: '',
    areaTypeID: 0,
    districtID: 0,
    otherDistrict: '',
    genderID: 0,
    casteCategoryID: 0,
  };

  const { control, handleSubmit, formState, watch } = useForm<SemiProfPersonalFormValues>({
    defaultValues: {
      email: personalData.email ?? '',
      studentName: personalData.studentName ?? '',
      dateOfBirth: personalData.dateOfBirth ?? '',
      contactNumber: personalData.contactNumber ?? '',
      alternateNumber: personalData.alternateNumber ?? '',
      residentialAddress: personalData.residentialAddress ?? '',
      googleMapLink: personalData.googleMapLink ?? '',
      areaTypeID: personalData.areaTypeID ?? 0,
      districtID: personalData.districtID ?? 0,
      otherDistrict: personalData.otherDistrict ?? '',
      genderID: personalData.genderID ?? 0,
      casteCategoryID: personalData.casteCategoryID ?? 0,
    },
    resolver: zodResolver(semiProfPersonalSchema),
    mode: 'onChange',
  });

  const watchedEmail = watch('email');
  const emailSuccess = !!watchedEmail && !formState.errors.email;
  const selectedDistrict = watch('districtID');
  const showOtherDistrict = selectedDistrict === 11;

  const onSubmit = (data: SemiProfPersonalFormValues) => {
    updateSectionData('personal', data);
    updateValidationState('personal', { isValid: true, data });
    markStepComplete(1);
    navigation.navigate('family');
  };

  const isNextDisabled = !formState.isValid || loadingDropdowns;

  return (
    <FormScreenLayout
      title="Applicant's Information"
      step={2}
      totalSteps={7}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
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
          name="email"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Email"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={formState.errors.email?.message}
              successText={emailSuccess ? 'Email format looks good' : undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="studentName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Student Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your full name"
              error={formState.errors.studentName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field: { onChange, value } }) => (
            <VPDatePickerField
              label="Date of Birth"
              value={value}
              onChange={onChange}
              placeholder="Select date of birth"
              error={formState.errors.dateOfBirth?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="contactNumber"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Contact Number"
              value={value}
              onChangeText={onChange}
              placeholder="Enter 10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              error={formState.errors.contactNumber?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="alternateNumber"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Alternate Number"
              value={value ?? ''}
              onChangeText={onChange}
              placeholder="Enter alternate number (optional)"
              keyboardType="phone-pad"
              maxLength={10}
              error={formState.errors.alternateNumber?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="genderID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Gender"
              value={value}
              options={genderOptions}
              onChange={onChange}
              placeholder="Select gender"
              error={formState.errors.genderID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="casteCategoryID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Caste"
              value={value}
              options={casteOptions}
              onChange={onChange}
              placeholder="Select caste category"
              error={formState.errors.casteCategoryID?.message}
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
          name="areaTypeID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Area Type"
              value={value}
              options={areaTypeOptions}
              onChange={onChange}
              placeholder="Select area type"
              error={formState.errors.areaTypeID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="districtID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="District"
              value={value}
              options={districtOptions}
              disabled={loadingDropdowns}
              onChange={onChange}
              placeholder="Select district"
              error={formState.errors.districtID?.message}
              required
            />
          )}
        />

        {showOtherDistrict && (
          <Controller
            control={control}
            name="otherDistrict"
            render={({ field: { onChange, value } }) => (
              <VPInputField
                label="Other District"
                value={value ?? ''}
                onChangeText={onChange}
                placeholder="Enter district name"
                error={formState.errors.otherDistrict?.message}
                required
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="residentialAddress"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Residential Address"
              value={value}
              onChangeText={onChange}
              placeholder="Enter complete residential address"
              multiline
              numberOfLines={3}
              error={formState.errors.residentialAddress?.message}
              helperText="Include house number, street name, and landmarks"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="googleMapLink"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Google Map Link"
              value={value ?? ''}
              onChangeText={onChange}
              placeholder="Paste Google Maps link (optional)"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              error={formState.errors.googleMapLink?.message}
              helperText="Optional: Link to your residence location"
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
