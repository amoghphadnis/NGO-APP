import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import { useFormEngineStore } from '../../../store/useFormEngineStore';
import { isProfessionalForm } from '@/types/forms';
import { bankDetailsSchema, BankDetailsFormValues } from '@/validation/professionalSchemas';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

export default function BankSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const { control, handleSubmit, formState } = useForm<BankDetailsFormValues>({
    defaultValues: {
      accountHolderName: isProfessionalForm(formData) ? formData.bank.accountHolderName ?? '' : '',
      bankName: isProfessionalForm(formData) ? formData.bank.bankName ?? '' : '',
      accountNumber: isProfessionalForm(formData) ? formData.bank.accountNumber ?? '' : '',
      ifscCode: isProfessionalForm(formData) ? formData.bank.ifscCode ?? '' : '',
      branchName: isProfessionalForm(formData) ? formData.bank.branchName ?? '' : '',
      ifscVerified: isProfessionalForm(formData) ? formData.bank.ifscVerified ?? false : false,
    },
    resolver: zodResolver(bankDetailsSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: BankDetailsFormValues) => {
    updateSectionData('bank', data);
    updateValidationState('bank', { isValid: true, data });
    markStepComplete(7);
    navigation.navigate('documents');
  };

  const isNextDisabled = !formState.isValid;

  return (
    <FormScreenLayout
      title="Bank Details"
      step={8}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
    >
      {/* Account Information */}
      <FormSectionHeader
        icon="card"
        title="Account Information"
        subtitle="Bank account details for scholarship disbursement"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="accountHolderName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Account Holder Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter account holder name"
              error={formState.errors.accountHolderName?.message}
              helperText="Name should match bank records"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="bankName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Bank Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter bank name"
              error={formState.errors.bankName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="accountNumber"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Account Number"
              value={value}
              onChangeText={onChange}
              placeholder="Enter account number"
              keyboardType="numeric"
              maxLength={18}
              error={formState.errors.accountNumber?.message}
              helperText="Enter your complete bank account number"
              required
            />
          )}
        />
      </FormCard>

      {/* IFSC Details */}
      <FormSectionHeader
        icon="code"
        title="IFSC Details"
        subtitle="Bank identification code"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="ifscCode"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="IFSC Code"
              value={value}
              onChangeText={onChange}
              placeholder="Enter IFSC code"
              autoCapitalize="characters"
              maxLength={11}
              error={formState.errors.ifscCode?.message}
              helperText="11-character IFSC code (e.g., SBIN0001234)"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="branchName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Branch Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter branch name"
              error={formState.errors.branchName?.message}
              helperText="Optional: Enter bank branch name"
            />
          )}
        />
      </FormCard>

      {/* Bank Guidelines */}
      <FormCard>
        <View style={styles.guidelineContainer}>
          <Text style={styles.guidelineTitle}>Important Guidelines:</Text>
          <Text style={styles.guidelineText}>
            • Account should be in student's name
          </Text>
          <Text style={styles.guidelineText}>
            • Account should be active and operational
          </Text>
          <Text style={styles.guidelineText}>
            • IFSC code is mandatory for NEFT transfers
          </Text>
          <Text style={styles.guidelineText}>
            • Bank details will be verified before disbursement
          </Text>
          <Text style={styles.guidelineText}>
            • Any incorrect information may delay scholarship payment
          </Text>
        </View>
      </FormCard>

      {/* Security Notice */}
      <FormCard>
        <View style={styles.securityContainer}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>
            Your bank information is encrypted and will only be used for scholarship disbursement. We do not store your CVV or PIN.
          </Text>
        </View>
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  guidelineContainer: {
    padding: spacing.sm,
  },
  guidelineTitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  guidelineText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  securityContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.sm,
  },
  securityIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  securityText: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
  },
});
