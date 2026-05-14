import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import { useFormEngineStore } from '../../store/useFormEngineStore';
import { contactDetailsSchema, ContactDetailsFormValues } from '@/validation/formSchemas';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

export default function ContactSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const contactData = formData?.contact ?? {
    email: '',
    phone: '',
  };

  const { control, handleSubmit, watch, formState } = useForm<ContactDetailsFormValues>({
    defaultValues: {
      email: contactData.email,
      phone: contactData.phone,
    },
    resolver: zodResolver(contactDetailsSchema),
    mode: 'onChange',
  });

  const watchedEmail = watch('email');
  const emailSuccess = !!watchedEmail && !formState.errors.email;

  const onSubmit = (data: ContactDetailsFormValues) => {
    updateSectionData('contact', data);
    updateValidationState('contact', { isValid: true, data });
    markStepComplete(2);
    navigation.navigate('family');
  };

  const isNextDisabled = !formState.isValid;

  return (
    <FormScreenLayout
      title="Contact Information"
      step={3}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
    >
      {/* Contact Details Section */}
      <FormSectionHeader
        icon="mail"
        title="Contact Details"
        subtitle="How can we reach you?"
        showRequired
      />
      
      <FormCard>
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
              autoCorrect={false}
              error={formState.errors.email?.message}
              successText={emailSuccess ? 'Email format looks good' : undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Mobile Number"
              value={value}
              onChangeText={onChange}
              placeholder="Enter 10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              error={formState.errors.phone?.message}
              helperText="We'll use this number for important updates"
              required
            />
          )}
        />
      </FormCard>

      {/* Communication Preferences */}
      <FormSectionHeader
        icon="notifications"
        title="Communication Preferences"
        subtitle="How would you like to receive updates?"
      />
      
      <FormCard>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>
            • Application status updates via SMS and email
          </Text>
        </View>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>
            • Important announcements via email
          </Text>
        </View>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>
            • Document verification reminders via SMS
          </Text>
        </View>
      </FormCard>

      {/* Privacy Notice */}
      <FormCard>
        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>🔒</Text>
          <Text style={styles.infoText}>
            Your contact information will be used only for scholarship-related communications and will never be shared with third parties.
          </Text>
        </View>
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  preferenceItem: {
    marginBottom: spacing.sm,
  },
  preferenceText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
  },
});
