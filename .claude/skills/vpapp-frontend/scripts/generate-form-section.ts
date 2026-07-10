/**
 * generate-form-section.ts
 * Scaffolds a new form section: component + validation schema + config entry reminder.
 *
 * Usage: npx tsx scripts/generate-form-section.ts <formType> <sectionName>
 * Example: npx tsx scripts/generate-form-section.ts professional Academic
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');

interface Args {
  formType: string;
  sectionName: string;
}

function parseArgs(): Args {
  const [, , formType, sectionName] = process.argv;
  if (!formType || !sectionName) {
    console.error('Usage: npx tsx scripts/generate-form-section.ts <formType> <sectionName>');
    console.error('Example: npx tsx scripts/generate-form-section.ts professional Academic');
    process.exit(1);
  }
  const validTypes = ['professional', 'puc', 'payana', 'semiProfessional'];
  if (!validTypes.includes(formType)) {
    console.error(`Invalid formType: ${formType}. Must be one of: ${validTypes.join(', ')}`);
    process.exit(1);
  }
  return { formType, sectionName };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateComponent(formType: string, sectionName: string): string {
  const pascalName = `${capitalize(sectionName)}Section`;
  const schemaName = `${formType}${capitalize(sectionName)}DetailsSchema`;
  const valuesType = `${formType}${capitalize(sectionName)}DetailsFormValues`;
  const isProfessional = formType === 'professional';

  return `import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormScreenLayout from "@/components/layout/FormScreenLayout";
import FormSectionHeader from "@/components/common/FormSectionHeader";
import FormCard from "@/components/common/FormCard";
import VPInputField from "@/components/common/VPInputField";
import { useFormEngineStore } from "../../../store/useFormEngineStore";
import { ${schemaName}, ${valuesType} } from "@/validation/${formType}Schemas";

export default function ${pascalName}({ navigation }: any) {
  const { updateSectionData, markStepComplete, updateValidationState, formData } =
    useFormEngineStore();

  const { control, handleSubmit, formState } = useForm<${valuesType}>({
    defaultValues: {},
    resolver: zodResolver(${schemaName}),
    mode: "onChange",
  });

  const onSubmit = (data: ${valuesType}) => {
    updateSectionData("${sectionName.toLowerCase()}", data);
    updateValidationState("${sectionName.toLowerCase()}", { isValid: true, data });
    markStepComplete(0);
    navigation.navigate("nextStep");
  };

  return (
    <FormScreenLayout
      title="${capitalize(sectionName)} Details"
      step={0}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={!formState.isValid}
    >
      <FormSectionHeader
        icon="information-circle"
        title="${capitalize(sectionName)} Information"
        showRequired
      />
      <FormCard>
        <Controller
          control={control}
          name="${isProfessional ? 'FieldName' : 'fieldName'}"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Field Label"
              value={value}
              onChangeText={onChange}
              placeholder="Enter value"
              error={formState.errors.${isProfessional ? 'FieldName' : 'fieldName'}?.message as string | undefined}
              required
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}
`;
}

function generateSchema(formType: string, sectionName: string): string {
  const isProfessional = formType === 'professional';
  const schemaName = `${formType}${capitalize(sectionName)}DetailsSchema`;
  const valuesType = `${formType}${capitalize(sectionName)}DetailsFormValues`;
  const fieldKey = isProfessional ? 'FieldName' : 'fieldName';

  return `import { z } from 'zod';

export const ${schemaName} = z.object({
  ${fieldKey}: z.string().min(1, { message: 'This field is required' }),
});

export type ${valuesType} = z.infer<typeof ${schemaName}>;
`;
}

function main(): void {
  const { formType, sectionName } = parseArgs();
  const pascalName = `${capitalize(sectionName)}Section`;

  const sectionDir = path.join(
    PROJECT_ROOT,
    'src',
    'screens',
    'form-sections',
    formType,
  );
  const sectionFile = path.join(sectionDir, `${pascalName}.tsx`);

  if (fs.existsSync(sectionFile)) {
    console.error(`✗ ${pascalName}.tsx already exists at ${sectionFile}`);
    process.exit(1);
  }

  // Generate component
  fs.mkdirSync(sectionDir, { recursive: true });
  fs.writeFileSync(sectionFile, generateComponent(formType, sectionName));
  console.log(`✓ Created ${path.relative(PROJECT_ROOT, sectionFile)}`);

  // Generate schema (append to validation file)
  const validationFile = path.join(
    PROJECT_ROOT,
    'src',
    'validation',
    `${formType}Schemas.ts`,
  );
  if (fs.existsSync(validationFile)) {
    const schemaContent = generateSchema(formType, sectionName);
    fs.appendFileSync(validationFile, `\n${schemaContent}`);
    console.log(`✓ Appended schema to ${path.relative(PROJECT_ROOT, validationFile)}`);
  } else {
    fs.writeFileSync(validationFile, generateSchema(formType, sectionName));
    console.log(`✓ Created ${path.relative(PROJECT_ROOT, validationFile)}`);
  }

  // Reminders
  console.log('\n📋 Manual steps required:');
  console.log(`  1. Add '${sectionName.toLowerCase()}' to steps array in src/forms/${formType}/config.ts`);
  console.log(`  2. Add ${pascalName} to component map in src/components/FormRenderer.tsx`);
  console.log(`  3. Map step to schema in config's validation record`);
  console.log(`  4. Update PROJECT_CONTEXT_CURRENT.md`);
  console.log(`  5. Run: npx tsx .claude/skills/vpapp-frontend/scripts/validate-form-config.ts`);
}

main();
