/**
 * validate-form-config.ts
 * Checks for duplicate steps, missing components, invalid registry entries.
 *
 * Usage: npx tsx scripts/validate-form-config.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');

interface FormConfig {
  type: string;
  steps: string[];
  totalSteps: number;
}

const FORM_TYPES = ['professional', 'puc', 'payana', 'semiProfessional'];
const VALID_STEPS = [
  'guidelines', 'personal', 'contact', 'address',
  'family', 'category', 'academic', 'bank',
  'documents', 'review', 'success',
];

function loadConfig(formType: string): FormConfig | null {
  const configPath = path.join(
    PROJECT_ROOT,
    'src',
    'forms',
    formType,
    'config.ts',
  );
  if (!fs.existsSync(configPath)) {
    console.error(`  ✗ Config file not found: ${path.relative(PROJECT_ROOT, configPath)}`);
    return null;
  }

  const content = fs.readFileSync(configPath, 'utf-8');
  const stepsMatch = content.match(/steps:\s*\[([^\]]+)\]/);
  if (!stepsMatch) {
    console.error(`  ✗ Could not parse steps from config`);
    return null;
  }

  const steps = stepsMatch[1]
    .split(',')
    .map((s) => s.trim().replace(/['"]/g, ''))
    .filter(Boolean);

  return { type: formType, steps, totalSteps: steps.length };
}

function checkComponentExists(formType: string, step: string): boolean {
  const pascalStep = step.charAt(0).toUpperCase() + step.slice(1);
  const componentPath = path.join(
    PROJECT_ROOT,
    'src',
    'screens',
    'form-sections',
    formType,
    `${pascalStep}Section.tsx`,
  );
  return fs.existsSync(componentPath);
}

function checkRegistryEntry(formType: string): boolean {
  const registryPath = path.join(
    PROJECT_ROOT,
    'src',
    'forms',
    'shared',
    'registry.ts',
  );
  if (!fs.existsSync(registryPath)) return false;
  const content = fs.readFileSync(registryPath, 'utf-8');
  return content.includes(formType);
}

function checkFormRendererMap(formType: string): boolean {
  const rendererPath = path.join(
    PROJECT_ROOT,
    'src',
    'components',
    'FormRenderer.tsx',
  );
  if (!fs.existsSync(rendererPath)) return false;
  const content = fs.readFileSync(rendererPath, 'utf-8');
  const mapName = `${formType}ComponentMap`;
  return content.includes(mapName);
}

function validateForm(formType: string): boolean {
  let passed = true;
  console.log(`\n${capitalize(formType)}`);

  // Check registry
  if (!checkRegistryEntry(formType)) {
    console.log(`  ✗ Missing registry entry in src/forms/shared/registry.ts`);
    passed = false;
  } else {
    console.log(`  ✓ registry entry`);
  }

  // Check FormRenderer component map
  if (!checkFormRendererMap(formType)) {
    console.log(`  ✗ Missing component map in FormRenderer.tsx`);
    passed = false;
  } else {
    console.log(`  ✓ component map`);
  }

  // Load config
  const config = loadConfig(formType);
  if (!config) {
    return false;
  }

  // Check for duplicate steps
  const seen = new Set<string>();
  for (const step of config.steps) {
    if (seen.has(step)) {
      console.log(`  ✗ Duplicate step: ${step}`);
      passed = false;
    }
    seen.add(step);
  }
  if (config.steps.length === seen.size) {
    console.log(`  ✓ no duplicate steps (${config.steps.length} steps)`);
  }

  // Check for invalid step names
  for (const step of config.steps) {
    if (!VALID_STEPS.includes(step)) {
      console.log(`  ✗ Invalid step name: ${step}`);
      passed = false;
    }
  }

  // Check each step has a component
  for (const step of config.steps) {
    if (!checkComponentExists(formType, step)) {
      const pascalStep = step.charAt(0).toUpperCase() + step.slice(1);
      console.log(`  ✗ Missing component: ${pascalStep}Section.tsx`);
      passed = false;
    }
  }
  const allComponentsExist = config.steps.every((s) => checkComponentExists(formType, s));
  if (allComponentsExist) {
    console.log(`  ✓ all section components exist`);
  }

  // Check review and success are present
  if (!config.steps.includes('review')) {
    console.log(`  ✗ Missing 'review' step`);
    passed = false;
  }
  if (!config.steps.includes('success')) {
    console.log(`  ✗ Missing 'success' step`);
    passed = false;
  }
  if (config.steps.includes('review') && config.steps.includes('success')) {
    console.log(`  ✓ review and success steps present`);
  }

  return passed;
}

function capitalize(s: string): string {
  if (s.startsWith('semi')) {
    return 'SemiProfessional';
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function main(): void {
  console.log('🔍 Validating form configurations...\n');

  let allPassed = true;
  for (const formType of FORM_TYPES) {
    if (!validateForm(formType)) {
      allPassed = false;
    }
  }

  console.log('');
  if (allPassed) {
    console.log('✅ All form configurations valid.');
  } else {
    console.log('❌ Some validations failed. See output above.');
    process.exit(1);
  }
}

main();
