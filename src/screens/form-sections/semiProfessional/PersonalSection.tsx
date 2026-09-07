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
  const [placeOptions, setPlaceOptions] = useState<Option<number>[]>([]);
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
        setPlaceOptions(response.data.places?.map((p: any) => ({
          value: Number(p.value),
          label: p.label
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
    genderID: 0,
    casteCategoryID: 0,
    districtID: 0,
    otherDistrict: '',
    taluk: '',
    address: '',
    placeID: 0,
  };

  const { control, handleSubmit, formState, watch } = useForm<SemiProfPersonalFormValues>({
    defaultValues: {
      email: personalData.email ?? '',
      studentName: personalData.studentName ?? '',
      dateOfBirth: personalData.dateOfBirth ?? '',
      contactNumber: personalData.contactNumber ?? '',
      genderID: personalData.genderID ?? 0,
      casteCategoryID: personalData.casteCategoryID ?? 0,
      districtID: personalData.districtID ?? 0,
      otherDistrict: personalData.otherDistrict ?? '',
      taluk: personalData.taluk ?? '',
      address: personalData.address ?? '',
      placeID: personalData.placeID ?? 0,
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
          name="placeID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Place"
              value={value}
              options={placeOptions}
              onChange={onChange}
              placeholder="Select place"
              error={formState.errors.placeID?.message}
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
          name="taluk"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Taluk"
              value={value}
              onChangeText={onChange}
              placeholder="Enter taluk name"
              error={formState.errors.taluk?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Address"
              value={value}
              onChangeText={onChange}
              placeholder="Enter complete address"
              multiline
              numberOfLines={3}
              error={formState.errors.address?.message}
              helperText="Include house number, street name, and landmarks"
              required
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
