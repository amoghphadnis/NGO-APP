import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Control, Controller } from 'react-hook-form';
import { HouseVisitFormValues } from '@/validation/houseVisitSchemas';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const CHECKBOX_OPTIONS: Record<string, string[]> = {
  houseType: ['Kutcha', 'Semi-Pucca', 'Pucca'],
  ownership: ['Own', 'Rented', "Relative's", 'Government Housing'],
  rooms: ['1', '2', 'More than 3'],
  floor: ['Ground', '1', '2', '3+'],
};

interface Props {
  control: Control<HouseVisitFormValues>;
}

function CheckboxGroup({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string[];
  onChange: (val: string[]) => void;
  label: string;
}) {
  const toggleOption = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter((v) => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.optionsRow}>
        {options.map((option) => (
          <TouchableOption
            key={option}
            label={option}
            selected={value.includes(option)}
            onPress={() => toggleOption(option)}
          />
        ))}
      </View>
    </View>
  );
}

function TouchableOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.option, selected && styles.optionSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

import { TouchableOpacity } from 'react-native';

export default function SectionBHousing({ control }: Props) {
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="housingConditions.houseType"
        render={({ field: { onChange, value } }) => (
          <CheckboxGroup
            label="Type of House"
            options={CHECKBOX_OPTIONS.houseType}
            value={value || []}
            onChange={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="housingConditions.ownership"
        render={({ field: { onChange, value } }) => (
          <CheckboxGroup
            label="Ownership"
            options={CHECKBOX_OPTIONS.ownership}
            value={value || []}
            onChange={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="housingConditions.rooms"
        render={({ field: { onChange, value } }) => (
          <CheckboxGroup
            label="Rooms"
            options={CHECKBOX_OPTIONS.rooms}
            value={value || []}
            onChange={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="housingConditions.floor"
        render={({ field: { onChange, value } }) => (
          <CheckboxGroup
            label="Floor"
            options={CHECKBOX_OPTIONS.floor}
            value={value || []}
            onChange={onChange}
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
  group: {
    marginBottom: spacing.sm,
  },
  groupLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
