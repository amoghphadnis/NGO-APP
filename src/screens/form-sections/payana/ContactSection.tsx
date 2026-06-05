import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { payanaContactSchema, PayanaContactFormValues } from '@/validation/payanaSchemas';

interface ContactSectionProps {
  navigation: any;
}

export default function ContactSection({ navigation }: ContactSectionProps) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const contactData = (formData as any).contact ?? {
    contactNumber: '',
    alternateNumber: '',
    email: '',
  };

  const { control, handleSubmit, formState } = useForm<PayanaContactFormValues>({
    defaultValues: {
      contactNumber: contactData.contactNumber,
      alternateNumber: contactData.alternateNumber,
      email: contactData.email,
    },
    resolver: zodResolver(payanaContactSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: PayanaContactFormValues) => {
    updateSectionData('contact', data);
    updateValidationState('contact', { isValid: true, data });
    markStepComplete(2);
    navigation.navigate('address');
  };

  return (
    <FormScreenLayout
      title="Contact Information"
      step={3}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={!formState.isValid}
    >
      <FormSectionHeader
        icon="call"
        title="Contact Details"
        subtitle="How can we reach you"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="contactNumber"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Primary (WhatsApp) Number"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your WhatsApp number"
              keyboardType="phone-pad"
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
              placeholder="Enter alternate number (optional)"
              keyboardType="phone-pad"
              error={formState.errors.alternateNumber?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Email Address"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              error={formState.errors.email?.message}
              required
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
