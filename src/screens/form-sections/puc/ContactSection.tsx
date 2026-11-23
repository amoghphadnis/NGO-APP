import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, View } from 'react-native';

import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { isPUCForm } from '@/types/forms';
import { PucFormat11ContactFormValues, pucFormat11ContactSchema } from '@/validation/pucFormat11Schemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function ContactSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const contactData = isPUCForm(formData)
    ? formData.contact
    : { Email: '', ContactNumber: '', AlternateNumber: '' };

  const { control, handleSubmit, watch, formState } = useForm<PucFormat11ContactFormValues>({
    defaultValues: {
      Email: contactData.Email,
      ContactNumber: contactData.ContactNumber,
      AlternateNumber: contactData.AlternateNumber,
    },
    resolver: zodResolver(pucFormat11ContactSchema),
    mode: 'onChange',
  });

  const watchedEmail = watch('Email');
  const emailSuccess = !!watchedEmail && !formState.errors.Email;

  const onSubmit = (data: PucFormat11ContactFormValues) => {
    updateSectionData('contact', data);
    updateValidationState('contact', { isValid: true, data });
    markStepComplete(2);
    navigation.navigate('address');
  };

  const onInvalid = () => {
    Alert.alert('Missing Required Details', 'Please fill all details marked with * before proceeding.');
  };

  const isNextDisabled = false;

  return (
    <FormScreenLayout
      title="Contact Information"
      step={3}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
      nextDisabled={isNextDisabled}
    >
      <FormSectionHeader
        icon="mail"
        title="Contact Details"
        subtitle="How can we reach you?"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="Email"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Email Address (Optional)"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={formState.errors.Email?.message}
              successText={emailSuccess ? 'Email format looks good' : undefined}
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
              helperText="We'll use this number for important updates"
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
              value={value}
              onChangeText={onChange}
              placeholder="Enter alternate 10-digit number"
              keyboardType="phone-pad"
              maxLength={10}
              error={formState.errors.AlternateNumber?.message}
              helperText="Optional alternate contact number"
            />
          )}
        />
      </FormCard>

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
