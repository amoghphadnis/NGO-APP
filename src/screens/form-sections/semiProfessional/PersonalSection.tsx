import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert } from 'react-native';

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

// Web fallback order: 1 = Urban, 2 = Rural, 3 = Semi Urban
const FALLBACK_AREA_TYPES: Option<number>[] = [
  { value: 1, label: 'Urban' },
  { value: 2, label: 'Rural' },
  { value: 3, label: 'Semi Urban' },
];

export default function PersonalSection({ navigation }: PersonalSectionProps) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const [genderOptions, setGenderOptions] = useState<Option<number>[]>([]);
  const [casteOptions, setCasteOptions] = useState<Option<number>[]>([]);
  const [districtOptions, setDistrictOptions] = useState<Option<number>[]>([]);
  const [areaTypeOptions, setAreaTypeOptions] = useState<Option<number>[]>(FALLBACK_AREA_TYPES);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getSemiProfessionalDropdowns();
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
        const areaTypes = response.data.areaTypes?.map((a: any) => ({
          value: Number(a.value),
          label: a.label
        })) || [];
        if (areaTypes.length > 0) {
          setAreaTypeOptions(areaTypes);
        }
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
    genderID: 0,
    casteCategoryID: 0,
    areaTypeID: 0,
    districtID: 0,
    otherDistrict: '',
    residentialAddress: '',
    googleMapLink: '',
  };

  const { control, handleSubmit, formState, watch } = useForm<SemiProfPersonalFormValues>({
    defaultValues: {
      email: personalData.email ?? '',
      studentName: personalData.studentName ?? '',
      dateOfBirth: personalData.dateOfBirth ?? '',
      contactNumber: personalData.contactNumber ?? '',
      alternateNumber: personalData.alternateNumber ?? '',
      genderID: personalData.genderID ?? 0,
      casteCategoryID: personalData.casteCategoryID ?? 0,
      areaTypeID: personalData.areaTypeID ?? 0,
      districtID: personalData.districtID ?? 0,
      otherDistrict: personalData.otherDistrict ?? '',
      residentialAddress: personalData.residentialAddress ?? '',
      googleMapLink: personalData.googleMapLink ?? '',
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
              label="Name of the Student"
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
              label="Contact Number (WhatsApp Number)"
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
              placeholder="Enter 10-digit alternate number"
              keyboardType="phone-pad"
              maxLength={10}
              error={formState.errors.alternateNumber?.message}
              required
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
          name="residentialAddress"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Residential Address"
              value={value}
              onChangeText={onChange}
              placeholder="Enter complete address"
              multiline
              numberOfLines={4}
              error={formState.errors.residentialAddress?.message}
              helperText="Include father's name, house number, street name, village/city, landmark, post, taluka, district and pin code"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="googleMapLink"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Mention your home address Google Map link here"
              value={value ?? ''}
              onChangeText={onChange}
              placeholder="https://maps.google.com/..."
              autoCapitalize="none"
              error={formState.errors.googleMapLink?.message}
              helperText="Open Google Maps, find your home, and paste the share link"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="areaTypeID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Place"
              value={value}
              options={areaTypeOptions}
              onChange={onChange}
              placeholder="Select"
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
      </FormCard>

      <FormSectionHeader
        icon="person-circle"
        title="Other Details"
        subtitle="Gender and category"
      />

      <FormCard>
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
              label="Caste & Category"
              value={value}
              options={casteOptions}
              onChange={onChange}
              placeholder="Select caste category"
              error={formState.errors.casteCategoryID?.message}
              disabled={loadingDropdowns}
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
