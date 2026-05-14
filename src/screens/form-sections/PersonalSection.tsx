import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';

import FormScreenLayout from '@/components/layout/FormScreenLayout';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormCard from '@/components/common/FormCard';
import VPInputField from '@/components/common/VPInputField';
import VPDatePickerField from '@/components/common/VPDatePickerField';
import { useFormEngineStore } from '../../store/useFormEngineStore';
import { personalDetailsSchema, PersonalDetailsFormValues } from '@/validation/formSchemas';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { platform } from '@/theme/platform';

const genderOptions = ['Male', 'Female', 'Other'];
const casteOptions = ['General', 'OBC', 'SC', 'ST', 'Other'];

export default function PersonalSection({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } = useFormEngineStore();
  
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showCastePicker, setShowCastePicker] = useState(false);

  const parseDate = (date: string) => {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const personalData = formData?.personal ?? {
    name: '',
    dateOfBirth: '',
    gender: '',
    caste: '',
  };

  const { control, handleSubmit, watch, formState } = useForm<PersonalDetailsFormValues>({
    defaultValues: {
      name: personalData.name,
      dateOfBirth: 
        typeof personalData.dateOfBirth === 'string'
          ? personalData.dateOfBirth
          : '',
      gender: personalData.gender,
      caste: personalData.caste,
    },
    resolver: zodResolver(personalDetailsSchema),
    mode: 'onChange',
  });

  const watchedName = watch('name');
  const nameSuccess = !!watchedName && !formState.errors.name;

  const onSubmit = (data: PersonalDetailsFormValues) => {
    updateSectionData('personal', data);
    updateValidationState('personal', { isValid: true, data });
    markStepComplete(1);
    navigation.navigate('contact');
  };

  const isNextDisabled = !formState.isValid;

  return (
    <FormScreenLayout
      title="Personal Details"
      step={2}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
    >
      {/* Basic Information Section */}
      <FormSectionHeader
        icon="person"
        title="Basic Information"
        subtitle="Fields marked with * are required"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Student Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your full name"
              error={formState.errors.name?.message}
              successText={nameSuccess ? 'Name looks good' : undefined}
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
              value={value ? new Date(value) : undefined}
              onChange={(date) => {
                const formatted = [
                  date.getFullYear(),
                  String(date.getMonth() + 1).padStart(2, '0'),
                  String(date.getDate()).padStart(2, '0'),
                ].join('-');

                onChange(formatted);
              }}
              helperText="Enter your date of birth as on certificate"
              error={formState.errors.dateOfBirth?.message}
              required
            />
          )}
        />
      </FormCard>

      {/* Demographics Section */}
      <FormSectionHeader
        icon="people"
        title="Demographics"
        showRequired
      />
      
      <FormCard>
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <View>
              <TouchableOpacity onPress={() => setShowGenderPicker(true)} activeOpacity={0.8}>
                <View pointerEvents="none">
                  <VPInputField
                    label="Gender"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Select gender"
                    editable={false}
                    rightIcon={<Text style={styles.dropdownIcon}>⌄</Text>}
                    error={formState.errors.gender?.message}
                    required
                  />
                </View>
              </TouchableOpacity>

              {showGenderPicker && (
                <Modal transparent visible={showGenderPicker} animationType="fade">
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.modalTitle}>Choose gender</Text>

                      {genderOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={styles.optionRow}
                          onPress={() => {
                            onChange(option);
                            setShowGenderPicker(false);
                          }}
                        >
                          <Text style={styles.optionText}>{option}</Text>

                          {value === option && (
                            <Ionicons
                              name="checkmark"
                              size={20}
                              color={colors.primary}
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </Modal>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="caste"
          render={({ field: { onChange, value } }) => (
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowCastePicker(true)}
              >
                <View pointerEvents="none">
                  <VPInputField
                    label="Caste"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Select caste"
                    editable={false}
                    rightIcon={<Text style={styles.dropdownIcon}>⌄</Text>}
                    error={formState.errors.caste?.message}
                    required
                  />
                </View>
              </TouchableOpacity>

              <Modal
                transparent
                visible={showCastePicker}
                animationType="fade"
                statusBarTranslucent
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Choose caste</Text>

                    {casteOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.optionRow}
                        onPress={() => {
                          onChange(option);
                          setShowCastePicker(false);
                        }}
                      >
                        <Text style={styles.optionText}>{option}</Text>

                        {value === option && (
                          <Ionicons
                            name="checkmark"
                            size={20}
                            color={colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </Modal>
            </View>
          )}
        />
      </FormCard>

      {/* Security Notice */}
      <FormCard>
        <View style={styles.infoBanner}>
          <Ionicons name="shield-checkmark" size={24} color={colors.primary} style={styles.bannerIcon} />
          <Text style={styles.bannerText}>
            Your personal information is securely encrypted and will only be used for scholarship purposes.
          </Text>
        </View>
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  dropdownIcon: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.form.screenHorizontal,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: spacing.form.borderRadius,
    padding: spacing.form.cardPadding,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalTitle: {
    fontSize: platform.normalize.fontSize.h2,
    lineHeight: platform.normalize.lineHeight.h2,
    color: colors.textPrimary,
    marginBottom: spacing.form.fieldSpacing,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: platform.input.paddingVertical,
    paddingHorizontal: platform.input.paddingHorizontal,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textPrimary,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bannerIcon: {
    marginRight: spacing.form.labelSpacing,
    marginTop: 2,
  },
  bannerText: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
  },
});
