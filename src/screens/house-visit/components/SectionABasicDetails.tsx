/**
 * Section A: Basic Details
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import VPInputField from '@/components/common/VPInputField';
import VPDatePickerField from '@/components/common/VPDatePickerField';
import { HouseVisitFormValues } from '@/validation/houseVisitSchemas';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface Props {
  control: Control<HouseVisitFormValues>;
  errors: FieldErrors<HouseVisitFormValues>;
}

export default function SectionABasicDetails({ control, errors }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Student Information</Text>

      <Controller
        control={control}
        name="basicDetails.studentName"
        render={({ field: { onChange, value } }) => (
          <VPInputField
            label="Student Name *"
            value={value}
            onChangeText={onChange}
            placeholder="Enter student name"
            error={errors.basicDetails?.studentName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="basicDetails.courseInstitution"
        render={({ field: { onChange, value } }) => (
          <VPInputField
            label="Course & Institution"
            value={value || ''}
            onChangeText={onChange}
            placeholder="Enter course and institution"
          />
        )}
      />

      <Controller
        control={control}
        name="basicDetails.address"
        render={({ field: { onChange, value } }) => (
          <VPInputField
            label="Address *"
            value={value}
            onChangeText={onChange}
            placeholder="Enter address"
            multiline
            numberOfLines={2}
            error={errors.basicDetails?.address?.message}
          />
        )}
      />

      <Text style={styles.sectionLabel}>Visit Details</Text>

      <Controller
        control={control}
        name="basicDetails.visitDate"
        render={({ field: { onChange, value } }) => (
          <VPInputField
            label="Date & Time of Visit *"
            value={value}
            onChangeText={onChange}
            placeholder="YYYY-MM-DD HH:mm"
            error={errors.basicDetails?.visitDate?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="basicDetails.fieldSupervisorName"
        render={({ field: { onChange, value } }) => (
          <VPInputField
            label="Field Supervisor Name"
            value={value || ''}
            onChangeText={onChange}
            placeholder="Enter supervisor name"
          />
        )}
      />

      <Controller
        control={control}
        name="basicDetails.personsInteracted"
        render={({ field: { onChange, value } }) => (
          <VPInputField
            label="Person(s) Interacted Onsite"
            value={value || ''}
            onChangeText={onChange}
            placeholder="Enter names of persons interacted"
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
});
