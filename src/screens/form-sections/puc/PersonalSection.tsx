import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { getPUCDropdowns } from '@/api/pucApi';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import VPDatePickerField from '@/components/common/VPDatePickerField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { isPUCForm } from '@/types/forms';
import { PucFormat11PersonalFormValues, pucFormat11PersonalSchema } from '@/validation/pucFormat11Schemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function PersonalSection({ navigation }: any) {
  const {
    updateSectionData,
    markStepComplete,
    updateValidationState,
    formData,
  } = useFormEngineStore();

  const [genderOptions, setGenderOptions] = useState<Option<number>[]>([]);
  const [districtOptions, setDistrictOptions] = useState<Option<number>[]>([]);
  const [areaOptions, setAreaOptions] = useState<Option<number>[]>([]);
  const [casteOptions, setCasteOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getPUCDropdowns();
      if (response.success && response.data) {
        setGenderOptions(response.data.genders?.map((g: any) => ({
          value: Number(g.value),
          label: g.label
        })) || []);
        setDistrictOptions(response.data.districts?.map((d: any) => ({
          value: Number(d.value),
          label: d.label
        })) || []);
        setCasteOptions(response.data.castes?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);
        const places = response.data.places?.map((p: any) => ({
          value: Number(p.value),
          label: p.label
        })) || [];
        setAreaOptions(places.length > 0 ? places : [
          { value: 1, label: 'Urban' },
          { value: 2, label: 'Rural' },
          { value: 3, label: 'Semi-Urban' },
        ]);
      } else {
        setAreaOptions([
          { value: 1, label: 'Urban' },
          { value: 2, label: 'Rural' },
          { value: 3, label: 'Semi-Urban' },
        ]);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const personalData = isPUCForm(formData) ? formData.personal : ({} as any);
  const contactData = isPUCForm(formData) ? (formData as any).contact : ({} as any);
  const addressData = isPUCForm(formData) ? (formData as any).address : ({} as any);

  const { control, handleSubmit, watch, formState } =
    useForm<PucFormat11PersonalFormValues>({
      defaultValues: {
        StudentName: personalData?.StudentName || '',
        DateOfBirth: typeof personalData?.DateOfBirth === 'string' ? personalData.DateOfBirth : '',
        Gender: personalData?.Gender || 0,
        ContactNumber: contactData?.ContactNumber || personalData?.ContactNumber || '',
        AlternateNumber: contactData?.AlternateNumber || personalData?.AlternateNumber || '',
        Email: contactData?.Email || personalData?.Email || '',
        ResidentialAddress: addressData?.ResidentialAddress || personalData?.ResidentialAddress || '',
        Place: addressData?.Place || personalData?.Place || 0,
        District: addressData?.District || personalData?.District || 0,
        OtherDistrict: addressData?.OtherDistrict || personalData?.OtherDistrict || '',
        Taluk: addressData?.Taluk || personalData?.Taluk || '',
        PinCode: addressData?.PinCode || personalData?.PinCode || '',
        Caste: personalData?.Caste || 0,
      },
      resolver: zodResolver(pucFormat11PersonalSchema),
      mode: 'onChange',
    });

  const selectedDistrict = watch('District');
  const showOtherDistrict = selectedDistrict === 11;

  const onSubmit = (data: PucFormat11PersonalFormValues) => {
    // Keep personal, contact, and address synchronized for wire compatibility
    updateSectionData('personal', {
      StudentName: data.StudentName,
      DateOfBirth: data.DateOfBirth,
      Gender: data.Gender,
      Place: data.Place,
      Caste: data.Caste || 0,
    });
    updateSectionData('contact', {
      ContactNumber: data.ContactNumber,
      AlternateNumber: data.AlternateNumber,
      Email: data.Email,
    });
    updateSectionData('address', {
      ResidentialAddress: data.ResidentialAddress,
      District: data.District,
      OtherDistrict: data.OtherDistrict,
      Taluk: data.Taluk,
      PinCode: data.PinCode,
      Place: data.Place,
    });
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
      {/* Personal Details */}
      <FormSectionHeader
        icon="person"
        title="Personal Details"
        subtitle="Fields marked with * are required"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="StudentName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Student Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter student full name"
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
          name="Gender"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Gender"
              value={value}
              onChange={onChange}
              options={genderOptions}
              placeholder="Select gender"
              error={formState.errors.Gender?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />
      </FormCard>

      {/* Contact Details */}
      <FormSectionHeader
        icon="mail"
        title="Contact Details"
        subtitle="How can we reach you?"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="ContactNumber"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Contact Number (WhatsApp Number)"
              value={value}
              onChangeText={onChange}
              placeholder="Enter 10-digit WhatsApp number"
              keyboardType="phone-pad"
              maxLength={10}
              error={formState.errors.ContactNumber?.message}
              helperText="Retain this number for all communications"
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
              value={value || ''}
              onChangeText={onChange}
              placeholder="Enter 10-digit alternate number"
              keyboardType="phone-pad"
              maxLength={10}
              error={formState.errors.AlternateNumber?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="Email"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Email"
              value={value || ''}
              onChangeText={onChange}
              placeholder="Enter your email address (optional)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={formState.errors.Email?.message}
            />
          )}
        />
      </FormCard>

      {/* Address Details */}
      <FormSectionHeader
        icon="location"
        title="Address"
        subtitle="Where do you reside?"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="ResidentialAddress"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Residential Address"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your full residential address"
              multiline
              numberOfLines={3}
              error={formState.errors.ResidentialAddress?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="Place"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Area"
              value={value}
              onChange={onChange}
              options={areaOptions}
              placeholder="Select area"
              error={formState.errors.Place?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="District"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="District"
              value={value}
              onChange={onChange}
              options={districtOptions}
              placeholder="Select district"
              error={formState.errors.District?.message}
              required
              disabled={loadingDropdowns}
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
                value={value || ''}
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
          name="Taluk"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Taluka"
              value={value}
              onChangeText={onChange}
              placeholder="Enter taluka"
              error={formState.errors.Taluk?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="PinCode"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Pincode"
              value={value || ''}
              onChangeText={onChange}
              placeholder="Enter 6-digit pincode"
              keyboardType="numeric"
              maxLength={6}
              error={formState.errors.PinCode?.message}
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
});
