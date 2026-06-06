import React, { useEffect, useState } from "react";

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
import { isProfessionalForm } from "@/types/forms";

import {
  professionalPersonalDetailsSchema,
  ProfessionalPersonalDetailsFormValues,
} from "@/validation/professionalSchemas";
import { getProfessionalDropdowns } from "@/api/professionalApi";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { platform } from "@/theme/platform";

export default function PersonalSection({ navigation }: any) {
  const {
    updateSectionData,
    markStepComplete,
    updateValidationState,
    formData,
  } = useFormEngineStore();

  const [genderOptions, setGenderOptions] = useState<Option<number>[]>([]);
  const [casteOptions, setCasteOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getProfessionalDropdowns();
      if (response.success && response.data) {
        setGenderOptions(response.data.genders?.map((g: any) => ({ value: g.id, label: g.name })) || []);
        setCasteOptions(response.data.castes?.map((c: any) => ({ value: c.id, label: c.name })) || []);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const parseDate = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const personalData = isProfessionalForm(formData) 
    ? formData.personal 
    : { StudentName: "", DateOfBirth: "", GenderID: 0, CasteCategoryID: 0 };

  const { control, handleSubmit, watch, formState } =
    useForm<ProfessionalPersonalDetailsFormValues>({
      defaultValues: {
        StudentName: personalData.StudentName || "",
        DateOfBirth: personalData.DateOfBirth || "",
        GenderID: personalData.GenderID || 0,
        CasteCategoryID: personalData.CasteCategoryID || 0,
      },
      resolver: zodResolver(professionalPersonalDetailsSchema),
      mode: "onChange",
    });

  const watchedName = watch("StudentName");
  const nameSuccess = !!watchedName && !formState.errors.StudentName;

  const onSubmit = (data: ProfessionalPersonalDetailsFormValues) => {
    updateSectionData("personal", data);
    updateValidationState("personal", { isValid: true, data });
    markStepComplete(1);
    navigation.navigate("contact");
  };

  const isNextDisabled = !formState.isValid || loadingDropdowns;

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
          name="StudentName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Student Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your full name"
              error={formState.errors.StudentName?.message}
              successText={nameSuccess ? "Name looks good" : undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="DateOfBirth"
          render={({ field: { onChange, value } }) => (
            <VPDatePickerField
              label="Date of Birth"
              value={value ? new Date(value) : undefined}
              onChange={(date) => {
                // If already a string (YYYY-MM-DD format), pass through directly
                if (typeof date === 'string') {
                  onChange(date);
                  return;
                }
                // Otherwise format the Date object
                const formatted = [
                  date.getFullYear(),
                  String(date.getMonth() + 1).padStart(2, "0"),
                  String(date.getDate()).padStart(2, "0"),
                ].join("-");

                onChange(formatted);
              }}
              helperText="Enter your date of birth as on certificate"
              error={formState.errors.DateOfBirth?.message}
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
          name="GenderID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Gender"
              placeholder="Select gender"
              value={value}
              onChange={onChange}
              options={genderOptions}
              error={formState.errors.GenderID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="CasteCategoryID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Caste"
              placeholder="Select caste"
              value={value}
              onChange={onChange}
              options={casteOptions}
              error={formState.errors.CasteCategoryID?.message}
              required
              disabled={loadingDropdowns}
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
