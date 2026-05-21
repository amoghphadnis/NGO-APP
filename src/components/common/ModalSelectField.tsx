import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import VPInputField from "./VPInputField";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { platform } from "@/theme/platform"; 

export type Option<T extends string | number> = {
  label: string;
  value: T;
};

type ModalSelectFieldProps<T extends string | number> = {
  label: string;
  placeholder?: string;
  value?: T;
  options: Option<T>[];

  onChange: (value: T) => void;

  error?: string;
  required?: boolean;
  disabled?: boolean;

  modalTitle?: string;
};

export default function ModalSelectField<T extends string | number>({
  label,
  placeholder = "Select an option",
  value,
  options,
  onChange,
  error,
  required = false,
  disabled = false,
  modalTitle,
}: ModalSelectFieldProps<T>) {
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find(
    (option) => option.value === value,
  );

  const handleSelect = (selectedValue: T) => {
    onChange(selectedValue);
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        onPress={() => setVisible(true)}
      >
        <View pointerEvents="none">
          <VPInputField
            label={label}
            value={selectedOption?.label || ""}
            placeholder={placeholder}
            editable={false}
            error={error}
            required={required}
            rightIcon={
              <Text style={styles.dropdownIcon}>
                ⌄
              </Text>
            }
          />
        </View>
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        statusBarTranslucent
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>
              {modalTitle || label}
            </Text>

            {options.map((option) => {
              const isSelected =
                option.value === value;

              return (
                <TouchableOpacity
                  key={option.value}
                  style={styles.optionRow}
                  onPress={() =>
                    handleSelect(option.value)
                  }
                >
                  <Text style={styles.optionText}>
                    {option.label}
                  </Text>

                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dropdownIcon: {
      fontSize: platform.normalize.fontSize.body,
      color: colors.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.form.screenHorizontal,
    },
    modalContainer: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: spacing.form.borderRadius,
      padding: spacing.form.cardPadding,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
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
      fontWeight: "600",
    },
    optionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
});