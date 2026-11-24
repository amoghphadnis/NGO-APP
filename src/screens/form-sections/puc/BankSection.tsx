import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, View } from 'react-native';

import DecimalInputField from '@/components/common/DecimalInputField';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { isPUCForm } from '@/types/forms';
import { PucFormat11BankFormValues, pucFormat11BankSchema } from '@/validation/pucFormat11Schemas';
import { useFormEngineStore } from '../../../store/useFormEngineStore';

export default function BankSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();

  const bankData = (isPUCForm(formData) && formData.bank)
    ? formData.bank
    : { ParentsBankBalance: 0, AccountHolderName: '', AccountNumber: '', IFSCCode: '', BankName: '', BranchName: '' };

  const { control, handleSubmit, formState } = useForm<PucFormat11BankFormValues>({
    defaultValues: {
      ParentsBankBalance: bankData.ParentsBankBalance || 0,
      AccountHolderName: bankData.AccountHolderName,
      AccountNumber: bankData.AccountNumber,
      IFSCCode: bankData.IFSCCode,
      BankName: bankData.BankName,
      BranchName: bankData.BranchName,
    },
    resolver: zodResolver(pucFormat11BankSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: PucFormat11BankFormValues) => {
    updateSectionData('bank', data);
    updateValidationState('bank', { isValid: true, data });
    markStepComplete(6);
    navigation.navigate('documents');
  };

  const onInvalid = () => {
    Alert.alert('Missing Required Details', 'Please fill all details marked with * before proceeding.');
  };

  const isNextDisabled = false;

  return (
    <FormScreenLayout
      title="Bank Details"
      step={7}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
      nextDisabled={isNextDisabled}
    >
      <FormSectionHeader
        icon="card"
        title="Bank Account Information"
        subtitle="Parent/Guardian bank account details"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="ParentsBankBalance"
          render={({ field: { onChange, value } }) => (
            <DecimalInputField
              label="Parents Bank Balance"
              value={value}
              onChangeValue={(v) => onChange(v ?? 0)}
              placeholder="Enter parents bank balance"
              error={formState.errors.ParentsBankBalance?.message}
              helperText="Current bank balance of parents/guardian"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="AccountHolderName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Account Holder Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter account holder name"
              error={formState.errors.AccountHolderName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="AccountNumber"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Account Number"
              value={value}
              onChangeText={onChange}
              placeholder="Enter bank account number"
              keyboardType="numeric"
              error={formState.errors.AccountNumber?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="IFSCCode"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="IFSC Code"
              value={value}
              onChangeText={onChange}
              placeholder="Enter IFSC code"
              autoCapitalize="none"
              error={formState.errors.IFSCCode?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="BankName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Bank Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter bank name"
              error={formState.errors.BankName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="BranchName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Branch Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter branch name"
              error={formState.errors.BranchName?.message}
              required
            />
          )}
        />
      </FormCard>

      <FormCard>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Note:</Text>
          <Text style={styles.infoText}>
            • Bank account should be in the name of parent/guardian
          </Text>
          <Text style={styles.infoText}>
            • Ensure IFSC code is correct for fund transfer
          </Text>
          <Text style={styles.infoText}>
            • Bank passbook copy will be required as document proof
          </Text>
        </View>
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    padding: spacing.sm,
  },
  infoTitle: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
});
