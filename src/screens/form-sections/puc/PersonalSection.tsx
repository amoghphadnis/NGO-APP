import ModalSelectField, { Option } from "@/components/common/ModalSelectField";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import { getPUCDropdowns } from "@/api/pucApi";
import FormCard from "@/components/common/FormCard";
import FormSectionHeader from "@/components/common/FormSectionHeader";
import VPDatePickerField from "@/components/common/VPDatePickerField";
import VPInputField from "@/components/common/VPInputField";
import FormScreenLayout from "@/components/layout/FormScreenLayout";
import { colors } from "@/theme/colors";
import { platform } from "@/theme/platform";
import { spacing } from "@/theme/spacing";
import { isPUCForm } from "@/types/forms";
import {
    PersonalDetailsFormValues,
    personalDetailsSchema,
} from "@/validation/sharedSchemas";
import { useFormEngineStore } from "../../../store/useFormEngineStore";

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
      const response = await getPUCDropdowns();
      console.log('[PersonalSection] Dropdown response:', response);
      if (response.success && response.data) {
        setGenderOptions(response.data.genders?.map((g: any) => ({
          value: Number(g.value),
          label: g.label
        })) || []);
        setCasteOptions(response.data.castes?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);
        console.log('[PersonalSection] Gender options:', response.data.genders);
        console.log('[PersonalSection] Caste options:', response.data.castes);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const personalData = isPUCForm(formData)
    ? formData.personal
    : { name: "", dateOfBirth: "", genderID: 0, casteCategoryID: 0 };

  const { control, handleSubmit, watch, formState } =
    useForm<PersonalDetailsFormValues>({
      defaultValues: {
        name: personalData.name,
        dateOfBirth:
          typeof personalData.dateOfBirth === "string"
            ? personalData.dateOfBirth
            : "",
        genderID: personalData.genderID || 0,
        casteCategoryID: personalData.casteCategoryID || 0,
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
          name="genderID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Gender"
              placeholder="Select gender"
              value={value}
              onChange={onChange}
              options={genderOptions}
              error={formState.errors.genderID?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="casteCategoryID"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Caste"
              placeholder="Select caste"
              value={value}
              onChange={onChange}
              options={casteOptions}
              error={formState.errors.casteCategoryID?.message}
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
