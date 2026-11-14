import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import { useFormEngineStore } from '@/store/useFormEngineStore';
import { payanaBankSchema, PayanaBankFormValues } from '@/validation/payanaSchemas';

interface BankSectionProps {
  navigation: any;
}

export default function BankSection({ navigation }: BankSectionProps) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const bankData = (formData as any).bank ?? {
    accountHolderName: '',
    bankAccountNo: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
  };

  const { control, handleSubmit, formState } = useForm<PayanaBankFormValues>({
    defaultValues: bankData,
    resolver: zodResolver(payanaBankSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: PayanaBankFormValues) => {
    updateSectionData('bank', data);
    updateValidationState('bank', { isValid: true, data });
    markStepComplete(4);
    navigation.navigate('family');
  };

  return (
    <FormScreenLayout
      title="Bank Details"
      step={5}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={!formState.isValid}
    >
      <FormSectionHeader
        icon="card"
        title="Bank Account Information"
        subtitle="Student bank account for scholarship disbursement"
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
              required
            />
          )}
        />

        <Controller
          control={control}
          name="bankAccountNo"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Bank Account Number"
              value={value}
              onChangeText={onChange}
              placeholder="Enter account number"
              keyboardType="number-pad"
              error={formState.errors.bankAccountNo?.message}
              required
            />
          )}
        />

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
              error={formState.errors.ifscCode?.message}
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
          name="branchName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Branch Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter branch name"
              error={formState.errors.branchName?.message}
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
