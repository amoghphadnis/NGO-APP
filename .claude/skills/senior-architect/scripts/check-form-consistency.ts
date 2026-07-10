/**
 * check-form-consistency.ts
 * Verifies registry ↔ config ↔ mapper ↔ schema ↔ review section ↔ upload keys all agree.
 *
 * Usage: npx tsx scripts/check-form-consistency.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');

const FORM_TYPES = ['professional', 'puc', 'payana', 'semiProfessional'];

interface CheckResult {
  passed: boolean;
  messages: string[];
}

function fileExists(relativePath: string): boolean {
  return fs.existsSync(path.join(PROJECT_ROOT, relativePath));
}

function readFile(relativePath: string): string | null {
  const fullPath = path.join(PROJECT_ROOT, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, 'utf-8');
}

function checkRegistry(formType: string): CheckResult {
  const messages: string[] = [];
  const content = readFile('src/forms/shared/registry.ts');
  if (!content) {
    return { passed: false, messages: ['registry.ts not found'] };
  }
  if (!content.includes(formType)) {
    messages.push(`✗ Missing registry entry for '${formType}'`);
  } else {
    messages.push('✓ registry entry');
  }
  return { passed: messages.every((m) => m.startsWith('✓')), messages };
}

function checkConfig(formType: string): CheckResult {
  const messages: string[] = [];
  const content = readFile(`src/forms/${formType}/config.ts`);
  if (!content) {
    return { passed: false, messages: [`config.ts not found for ${formType}`] };
  }

  // Check steps include review and success
  if (!content.includes("'review'") && !content.includes('"review"')) {
    messages.push("✗ Missing 'review' step in config");
  } else {
    messages.push('✓ review step in config');
  }

  if (!content.includes("'success'") && !content.includes('"success"')) {
    messages.push("✗ Missing 'success' step in config");
  } else {
    messages.push('✓ success step in config');
  }

  // Check steps include guidelines
  if (!content.includes("'guidelines'") && !content.includes('"guidelines"')) {
    messages.push("✗ Missing 'guidelines' step in config");
  } else {
    messages.push('✓ guidelines step in config');
  }

  return { passed: messages.every((m) => m.startsWith('✓')), messages };
}

function checkMapper(formType: string): CheckResult {
  const messages: string[] = [];
  const content = readFile(`src/forms/${formType}/mapper.ts`);
  if (!content) {
    return { passed: false, messages: [`mapper.ts not found for ${formType}`] };
  }
  messages.push('✓ mapper exists');

  // Check it exports a mapper function
  if (!content.includes('export') || !content.includes('Mapper')) {
    messages.push('✗ Mapper does not export a mapper function');
  } else {
    messages.push('✓ mapper exports function');
  }

  return { passed: messages.every((m) => m.startsWith('✓')), messages };
}

function checkSchema(formType: string): CheckResult {
  const messages: string[] = [];
  const content = readFile(`src/validation/${formType}Schemas.ts`);
  if (!content) {
    return { passed: false, messages: [`Schemas file not found for ${formType}`] };
  }
  messages.push('✓ schema file exists');

  // Check it has a form-level schema
  if (!content.includes(`${formType}FormSchema`)) {
    messages.push(`✗ Missing ${formType}FormSchema export`);
  } else {
    messages.push('✓ form schema export');
  }

  return { passed: messages.every((m) => m.startsWith('✓')), messages };
}

function checkReviewSection(formType: string): CheckResult {
  const messages: string[] = [];
  const reviewPath = `src/screens/form-sections/${formType}/ReviewSection.tsx`;
  if (!fileExists(reviewPath)) {
    messages.push(`✗ Missing ReviewSection.tsx`);
    return { passed: false, messages };
  }
  messages.push('✓ review section exists');

  const content = readFile(reviewPath)!;
  if (!content.includes('isFormComplete') && !content.includes('declarationAccepted')) {
    messages.push('✗ Review section missing gatekeeper logic');
  } else {
    messages.push('✓ review gatekeeper logic');
  }

  return { passed: messages.every((m) => m.startsWith('✓')), messages };
}

function checkSuccessSection(formType: string): CheckResult {
  const messages: string[] = [];
  const successPath = `src/screens/form-sections/${formType}/SuccessSection.tsx`;
  if (!fileExists(successPath)) {
    messages.push(`✗ Missing SuccessSection.tsx`);
    return { passed: false, messages };
  }
  messages.push('✓ success section exists');

  const content = readFile(successPath)!;
  if (!content.includes('applicationId') && !content.includes('submissionState')) {
    messages.push('✗ Success section missing applicationId extraction');
  } else {
    messages.push('✓ applicationId extraction');
  }

  if (!content.includes('resetForm')) {
    messages.push('⚠ Success section does not call resetForm');
  } else {
    messages.push('✓ resetForm called');
  }

  return { passed: messages.every((m) => m.startsWith('✓')), messages };
}

function checkUploadKeys(formType: string): CheckResult {
  const messages: string[] = [];
  const fileKeysPath = `src/forms/${formType}/fileKeys.ts`;
  if (!fileExists(fileKeysPath)) {
    messages.push(`⚠ fileKeys.ts not found (may not need documents)`);
    return { passed: true, messages };
  }
  messages.push('✓ fileKeys.ts exists');

  const content = readFile(fileKeysPath)!;
  if (!content.includes('export')) {
    messages.push('✗ fileKeys.ts does not export keys');
  } else {
    messages.push('✓ file keys exported');
  }

  // Check mapper references file keys
  const mapperContent = readFile(`src/forms/${formType}/mapper.ts`);
  if (mapperContent && content) {
    const keyMatch = content.matchAll(/['"]([A-Za-z_][A-Za-z0-9_]*)['"]/g);
    const keys = [...keyMatch].map((m) => m[1]).filter((k) => !['export', 'const', 'type'].includes(k));
    const missingInMapper = keys.filter((k) => !mapperContent.includes(k));
    if (missingInMapper.length > 0) {
      messages.push(`⚠ File keys not in mapper: ${missingInMapper.join(', ')}`);
    } else {
      messages.push('✓ all file keys referenced in mapper');
    }
  }

  return { passed: messages.every((m) => m.startsWith('✓')), messages };
}

function checkFormRendererMap(formType: string): CheckResult {
  const messages: string[] = [];
  const content = readFile('src/components/FormRenderer.tsx');
  if (!content) {
    return { passed: false, messages: ['FormRenderer.tsx not found'] };
  }

  const mapName = `${formType}ComponentMap`;
  if (!content.includes(mapName)) {
    messages.push(`✗ Missing ${mapName} in FormRenderer.tsx`);
  } else {
    messages.push(`✓ ${mapName} in FormRenderer`);
  }

  return { passed: messages.every((m) => m.startsWith('✓')), messages };
}

function checkPreparePayload(formType: string): CheckResult {
  const messages: string[] = [];
  const content = readFile('src/submission/preparePayload.ts');
  if (!content) {
    return { passed: false, messages: ['preparePayload.ts not found'] };
  }
  if (!content.includes(formType)) {
    messages.push(`✗ ${formType} not handled in preparePayload.ts`);
  } else {
    messages.push('✓ preparePayload handles form type');
  }
  return { passed: messages.every((m) => m.startsWith('✓')), messages };
}

function checkSubmit(formType: string): CheckResult {
  const messages: string[] = [];
  const content = readFile('src/submission/submit.ts');
  if (!content) {
    return { passed: false, messages: ['submit.ts not found'] };
  }
  if (!content.includes(formType)) {
    messages.push(`✗ ${formType} not handled in submit.ts`);
  } else {
    messages.push('✓ submit handles form type');
  }
  return { passed: messages.every((m) => m.startsWith('✓')), messages };
}

function capitalize(s: string): string {
  if (s.startsWith('semi')) return 'SemiProfessional';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function validateForm(formType: string): boolean {
  console.log(`\n${capitalize(formType)}`);

  const checks: CheckResult[] = [
    checkRegistry(formType),
    checkConfig(formType),
    checkFormRendererMap(formType),
    checkSchema(formType),
    checkMapper(formType),
    checkReviewSection(formType),
    checkSuccessSection(formType),
    checkUploadKeys(formType),
    checkPreparePayload(formType),
    checkSubmit(formType),
  ];

  let allPassed = true;
  for (const check of checks) {
    for (const msg of check.messages) {
      console.log(`  ${msg}`);
    }
    if (!check.passed) allPassed = false;
  }

  return allPassed;
}

function main(): void {
  console.log('🔍 Checking form consistency across all layers...\n');

  let allPassed = true;
  for (const formType of FORM_TYPES) {
    if (!validateForm(formType)) {
      allPassed = false;
    }
  }

  console.log('');
  if (allPassed) {
    console.log('✅ All forms are consistent across registry, config, mapper, schema, review, and upload keys.');
  } else {
    console.log('❌ Some inconsistencies found. See output above.');
    process.exit(1);
  }
}

main();
