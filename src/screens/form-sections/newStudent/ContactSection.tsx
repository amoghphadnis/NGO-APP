import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { NewStudentContactFormValues, newStudentContactSchema } from '@/validation/newStudentSchemas';

export default function ContactSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const contactData = (formData as any).contact ?? {
    contactNumber: '',
    alternateNumber: '',
    email: '',
  };

  const { control, handleSubmit, formState } = useForm<NewStudentContactFormValues>({
    defaultValues: contactData,
    resolver: zodResolver(newStudentContactSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: NewStudentContactFormValues) => {
    updateSectionData('contact', data);
    updateValidationState('contact', { isValid: true, data });
    markStepComplete(2);
    navigation.navigate('address');
  };

  const onInvalid = () => {
    Alert.alert('Missing Required Details', 'Please fill all details marked with * before proceeding.');
  };

  return (
    <FormScreenLayout
      title="Contact Details"
      step={3}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
    >
      <FormSectionHeader
        icon="call"
        title="Contact Information"
        subtitle="Fields marked with * are required"
        showRequired
      />

      <FormCard>
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
              value={value}
              onChangeText={onChange}
              placeholder="Enter 10-digit alternate number"
              keyboardType="phone-pad"
              maxLength={10}
              error={formState.errors.alternateNumber?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Email"
              value={value ?? ''}
              onChangeText={onChange}
              placeholder="Enter your email address (optional)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={formState.errors.email?.message}
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
