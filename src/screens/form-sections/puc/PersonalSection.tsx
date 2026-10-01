import ModalSelectField, { Option } from "@/components/common/ModalSelectField";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
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
import { PucFormat11PersonalFormValues, pucFormat11PersonalSchema } from "@/validation/pucFormat11Schemas";
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
  const [placeOptions, setPlaceOptions] = useState<Option<number>[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getPUCDropdowns();
      if (response.success && response.data) {
        setGenderOptions(response.data.genders?.map((g: any) => ({
          value: Number(g.value),
          label: g.label
        })) || []);
        setCasteOptions(response.data.castes?.map((c: any) => ({
          value: Number(c.value),
          label: c.label
        })) || []);
        const places = response.data.places?.map((p: any) => ({
          value: Number(p.value),
          label: p.label
        })) || [];
        setPlaceOptions(places.length > 0 ? places : [
          { value: 1, label: 'Urban' },
          { value: 2, label: 'Rural' },
          { value: 3, label: 'Semi-Urban' },
        ]);
      } else {
        setPlaceOptions([
          { value: 1, label: 'Urban' },
          { value: 2, label: 'Rural' },
          { value: 3, label: 'Semi-Urban' },
        ]);
      }
      setLoadingDropdowns(false);
    }
    loadDropdowns();
  }, []);

  const personalData = isPUCForm(formData)
    ? formData.personal
    : { StudentName: "", DateOfBirth: "", Gender: 0, Caste: 0, Place: 0 };

  const { control, handleSubmit, watch, formState } =
    useForm<PucFormat11PersonalFormValues>({
      defaultValues: {
        StudentName: personalData.StudentName,
        DateOfBirth:
          typeof personalData.DateOfBirth === "string"
            ? personalData.DateOfBirth
            : "",
        Gender: personalData.Gender || 0,
        Caste: personalData.Caste || 0,
        Place: personalData.Place || 0,
      },
      resolver: zodResolver(pucFormat11PersonalSchema),
      mode: "onChange",
    });

  const watchedName = watch("StudentName");
  const nameSuccess = !!watchedName && !formState.errors.StudentName;

  const onSubmit = (data: PucFormat11PersonalFormValues) => {
    updateSectionData("personal", data);
    updateValidationState("personal", { isValid: true, data });
    markStepComplete(1);
    navigation.navigate("contact");
  };

  const onInvalid = () => {
    Alert.alert('Missing Required Details', 'Please fill all details marked with * before proceeding.');
  };

  const isNextDisabled = loadingDropdowns;

  return (
    <FormScreenLayout
      title="Personal Details"
      step={2}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
      nextDisabled={isNextDisabled}
    >
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
                if (typeof date === 'string') {
                  onChange(date);
                  return;
                }
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

      <FormSectionHeader icon="people" title="Demographics" showRequired />

      <FormCard>
        <Controller
          control={control}
          name="Gender"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Gender"
              placeholder="Select gender"
              value={value}
              onChange={onChange}
              options={genderOptions}
              error={formState.errors.Gender?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="Caste"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Caste"
              placeholder="Select caste"
              value={value}
              onChange={onChange}
              options={casteOptions}
              error={formState.errors.Caste?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />

        <Controller
          control={control}
          name="Place"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Place"
              placeholder="Select place"
              value={value}
              onChange={onChange}
              options={placeOptions}
              error={formState.errors.Place?.message}
              required
              disabled={loadingDropdowns}
            />
          )}
        />
      </FormCard>

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
