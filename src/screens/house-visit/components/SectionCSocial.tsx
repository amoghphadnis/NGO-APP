import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Control, Controller } from 'react-hook-form';
import VPInputField from '@/components/common/VPInputField';
import { HouseVisitFormValues } from '@/validation/houseVisitSchemas';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const RATION_OPTIONS = ['BPL', 'PHH', 'NPHH', 'APL'];
const DIGITAL_OPTIONS = ['Smartphone', 'Keypad', 'iPhone', 'Laptop / Tablet'];
const LIVING_OPTIONS = ['Poor', 'Average', 'Satisfactory'];

interface Props {
  control: Control<HouseVisitFormValues>;
}

function RadioGroup({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  label: string;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.optionsRow}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, value === option && styles.optionSelected]}
            onPress={() => onChange(option)}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, value === option && styles.optionTextSelected]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function SectionCSocial({ control }: Props) {
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="socialData.rationCardType"
        render={({ field: { onChange, value } }) => (
          <RadioGroup
            label="Ration Card Type"
            options={RATION_OPTIONS}
            value={value || ''}
            onChange={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="socialData.digitalAccess"
        render={({ field: { onChange, value } }) => (
          <RadioGroup
            label="Digital & Learning Access"
            options={DIGITAL_OPTIONS}
            value={value || ''}
            onChange={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="socialData.livingCondition"
        render={({ field: { onChange, value } }) => (
          <View style={styles.group}>
            <Text style={styles.groupLabel}>General Living Condition</Text>
            <View style={styles.optionsRow}>
              {LIVING_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    (value || []).includes(option) && styles.optionSelected,
                  ]}
                  onPress={() => {
                    const newValue = (value || []).includes(option)
                      ? (value || []).filter((v) => v !== option)
                      : [...(value || []), option];
                    onChange(newValue);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      (value || []).includes(option) && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />

      <Controller
        control={control}
        name="socialData.latestElecBill"
        render={({ field: { onChange, value } }) => (
          <VPInputField
            label="Latest Electricity Bill Amount"
            value={value || ''}
            onChangeText={onChange}
            placeholder="Enter amount"
          />
        )}
      />

      <Controller
        control={control}
        name="socialData.elecUnitsCons"
        render={({ field: { onChange, value } }) => (
          <VPInputField
            label="Electricity Units Consumed"
            value={value || ''}
            onChangeText={onChange}
            placeholder="Enter units"
          />
        )}
      />

      <Controller
        control={control}
        name="socialData.internetBillCharges"
        render={({ field: { onChange, value } }) => (
          <VPInputField
            label="Internet Bill Charges"
            value={value || ''}
            onChangeText={onChange}
            placeholder="Enter amount"
          />
        )}
      />

      <Controller
        control={control}
        name="socialData.remarkGeneralLivingCondition"
        render={({ field: { onChange, value } }) => (
          <VPInputField
            label="Remarks on Living Condition"
            value={value || ''}
            onChangeText={onChange}
            placeholder="Enter remarks"
            multiline
            numberOfLines={2}
          />
        )}
      />
    </View>
  );
}

import { TouchableOpacity } from 'react-native';

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
