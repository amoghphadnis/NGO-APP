import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import { useFormEngineStore } from '../../../store/useFormEngineStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

const guidelinesSchema = z.object({
  guidelinesAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the guidelines to proceed'
  })
});

interface GuidelinesFormData {
  guidelinesAccepted: boolean;
}

export default function GuidelinesSection({ navigation }: any) {
  const { markStepComplete, updateValidationState } = useFormEngineStore();

  const { control, handleSubmit, formState } = useForm<GuidelinesFormData>({
    defaultValues: {
      guidelinesAccepted: false,
    },
    resolver: zodResolver(guidelinesSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: GuidelinesFormData) => {
    updateValidationState('guidelines', { isValid: true, data });
    markStepComplete(0);
    navigation.navigate('personal');
  };

  const isNextDisabled = !formState.isValid;

  return (
    <FormScreenLayout
      title="Application Guidelines"
      step={0}
      totalSteps={8}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
      nextLabel="Accept & Continue"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Instructions */}
        <FormSectionHeader
          icon="information-circle"
          title="Instructions"
          subtitle="Please read carefully before filling the form"
        />

        <FormCard>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Fields marked with * are <Text style={styles.bold}>mandatory</Text> and must be filled.
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Provide <Text style={styles.bold}>accurate personal, academic, and family details</Text>.
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Select appropriate options from dropdowns. If "Other" is selected, fill the additional field.
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark" size={20} color={colors.success} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Ensure <Text style={styles.bold}>mobile number and email</Text> are correct for communication.
            </Text>
          </View>
        </FormCard>

        {/* Document Upload Guidelines */}
        <FormSectionHeader
          icon="attach"
          title="Document Upload Guidelines"
          subtitle="Keep these documents ready for upload"
        />

        <FormCard>
          <View style={styles.guidelineItem}>
            <Ionicons name="document" size={20} color={colors.primary} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Upload clear and valid documents only.
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="document" size={20} color={colors.primary} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Allowed formats: <Text style={styles.bold}>PDF, JPG, PNG</Text>.
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="document" size={20} color={colors.primary} style={styles.icon} />
            <Text style={styles.guidelineText}>
              Ensure documents are <Text style={styles.bold}>readable and not blurred</Text>.
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="document" size={20} color={colors.primary} style={styles.icon} />
            <Text style={styles.guidelineText}>
              File size should preferably be <Text style={styles.bold}>less than 2MB</Text>.
            </Text>
          </View>
        </FormCard>

        {/* Terms Acceptance */}
        <FormSectionHeader
          icon="shield-checkmark"
          title="Terms & Conditions"
          subtitle="Accept the terms to proceed"
        />

        <FormCard>
          <Controller
            control={control}
            name="guidelinesAccepted"
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => onChange(!value)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                  {value && (
                    <Ionicons name="checkmark" size={16} color={colors.card} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>
                  I have read and understood all the guidelines and instructions. I confirm that all information I provide will be true and accurate.
                </Text>
              </TouchableOpacity>
            )}
          />
        </FormCard>
      </ScrollView>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  icon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  guidelineText: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
  },
  bold: {
    fontWeight: '700',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
  },
});
