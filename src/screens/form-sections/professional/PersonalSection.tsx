import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import ModalSelectField, { Option } from "@/components/common/ModalSelectField";

import FormScreenLayout from "@/components/layout/FormScreenLayout";
import FormSectionHeader from "@/components/common/FormSectionHeader";
import FormCard from "@/components/common/FormCard";
import VPInputField from "@/components/common/VPInputField";
import VPDatePickerField from "@/components/common/VPDatePickerField";
import { useFormEngineStore } from "../../../store/useFormEngineStore";

import {
  personalDetailsSchema,
  PersonalDetailsFormValues,
} from "@/validation/sharedSchemas";
import { GENDER_OPTIONS, CASTE_OPTIONS } from "@/constants/formOptions";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { platform } from "@/theme/platform";

const genderOptions: Option<string>[] = GENDER_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }));
const casteOptions: Option<string>[] = CASTE_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }));

export default function PersonalSection({ navigation }: any) {
  const {
    updateSectionData,
    markStepComplete,
    updateValidationState,
    formData,
  } = useFormEngineStore();

  // const [showGenderPicker, setShowGenderPicker] = useState(false);
  // const [showCastePicker, setShowCastePicker] = useState(false);

  const parseDate = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const personalData = formData?.personal ?? {
    name: "",
    dateOfBirth: "",
    gender: "",
    caste: "",
  };

  const { control, handleSubmit, watch, formState } =
    useForm<PersonalDetailsFormValues>({
      defaultValues: {
        name: personalData.name,
        dateOfBirth:
          typeof personalData.dateOfBirth === "string"
            ? personalData.dateOfBirth
            : "",
        gender: personalData.gender,
        caste: personalData.caste,
      },
      resolver: zodResolver(personalDetailsSchema),
      mode: "onChange",
    });

  const watchedName = watch("name");
  const nameSuccess = !!watchedName && !formState.errors.name;

  const onSubmit = (data: PersonalDetailsFormValues) => {
    updateSectionData("personal", data);
    updateValidationState("personal", { isValid: true, data });
    markStepComplete(1);
    navigation.navigate("contact");
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
              successText={nameSuccess ? "Name looks good" : undefined}
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
                  String(date.getMonth() + 1).padStart(2, "0"),
                  String(date.getDate()).padStart(2, "0"),
                ].join("-");

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
      <FormSectionHeader icon="people" title="Demographics" showRequired />

      <FormCard>
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Gender"
              placeholder="Select gender"
              value={value}
              onChange={onChange}
              options={genderOptions}
              error={
                formState.errors.gender
                  ?.message
              }
              required
            />
          )}
        />

        <Controller
          control={control}
          name="caste"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Caste"
              placeholder="Select caste"
              value={value}
              onChange={onChange}
              options={casteOptions}
              error={
                formState.errors.caste
                  ?.message
              }
              required
            />
          )}
        />
      </FormCard>

      {/* Security Notice */}
      <FormCard>
        <View style={styles.infoBanner}>
          <Ionicons
            name="shield-checkmark"
            size={24}
            color={colors.primary}
            style={styles.bannerIcon}
          />
          <Text style={styles.bannerText}>
            Your personal information is securely encrypted and will only be
            used for scholarship purposes.
          </Text>
        </View>
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
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
