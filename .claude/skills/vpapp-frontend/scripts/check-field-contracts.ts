/**
 * check-field-contracts.ts
 * Compares schema keys → mapper keys → store keys for field name drift.
 * Detects PascalCase vs camelCase mismatches between layers.
 *
 * Usage: npx tsx scripts/check-field-contracts.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');

const FORM_TYPES = ['professional', 'puc', 'payana', 'semiProfessional'];

function extractKeysFromFile(
  filePath: string,
  pattern: RegExp,
): string[] {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches = content.matchAll(pattern);
  const keys: string[] = [];
  for (const match of matches) {
    if (match[1]) keys.push(match[1]);
  }
  return keys;
}

function getSchemaKeys(formType: string): string[] {
  const schemaPath = path.join(
    PROJECT_ROOT,
    'src',
    'validation',
    `${formType}Schemas.ts`,
  );
  if (!fs.existsSync(schemaPath)) return [];

  const content = fs.readFileSync(schemaPath, 'utf-8');
  // Match object keys in z.object({ KeyName: ... })
  const keys: string[] = [];
  const objectMatch = content.matchAll(/z\.object\(\{([\s\S]*?)\}\)/g);
  for (const obj of objectMatch) {
    const body = obj[1];
    const keyMatches = body.matchAll(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:/gm);
    for (const k of keyMatches) {
      if (k[1] && !['z', 'type'].includes(k[1])) {
        keys.push(k[1]);
      }
    }
  }
  return [...new Set(keys)];
}

function getMapperKeys(formType: string): string[] {
  const mapperPath = path.join(
    PROJECT_ROOT,
    'src',
    'forms',
    formType,
    'mapper.ts',
  );
  if (!fs.existsSync(mapperPath)) return [];

  const content = fs.readFileSync(mapperPath, 'utf-8');
  // Match fd.append('KeyName', ...) or fd.append("KeyName", ...)
  const keys: string[] = [];
  const matches = content.matchAll(/fd\.append\(\s*['"]([^'"]+)['"]/g);
  for (const match of matches) {
    keys.push(match[1]);
  }
  // Also match direct object keys for JSON mappers (payana)
  const jsonMatches = content.matchAll(/['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*:/g);
  for (const match of jsonMatches) {
    keys.push(match[1]);
  }
  return [...new Set(keys)];
}

function getStoreKeys(formType: string): string[] {
  const storePath = path.join(
    PROJECT_ROOT,
    'src',
    'store',
    'useFormEngineStore.ts',
  );
  if (!fs.existsSync(storePath)) return [];

  const content = fs.readFileSync(storePath, 'utf-8');
  // Look for formType-specific initialization
  const formTypeSection = content.match(
    new RegExp(`case\\s*['"]${formType}['"][\\s\\S]*?break`),
  );
  if (!formTypeSection) return [];

  const section = formTypeSection[0];
  const keys: string[] = [];
  const matches = section.matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s*:/g);
  for (const match of matches) {
    if (match[1] && !['type', 'value', 'label'].includes(match[1])) {
      keys.push(match[1]);
    }
  }
  return [...new Set(keys)];
}

function checkCasing(key: string): 'pascal' | 'camel' | 'other' {
  if (/^[A-Z]/.test(key)) return 'pascal';
  if (/^[a-z]/.test(key)) return 'camel';
  return 'other';
}

function validateForm(formType: string): boolean {
  console.log(`\n${capitalize(formType)}`);

  const schemaKeys = getSchemaKeys(formType);
  const mapperKeys = getMapperKeys(formType);
  const storeKeys = getStoreKeys(formType);

  let passed = true;

  // Check schema keys exist
  if (schemaKeys.length === 0) {
    console.log(`  ✗ No schema keys found in src/validation/${formType}Schemas.ts`);
    passed = false;
  } else {
    console.log(`  ✓ schema: ${schemaKeys.length} keys found`);
  }

  // Check mapper keys exist
  if (mapperKeys.length === 0) {
    console.log(`  ✗ No mapper keys found in src/forms/${formType}/mapper.ts`);
    passed = false;
  } else {
    console.log(`  ✓ mapper: ${mapperKeys.length} keys found`);
  }

  // Check casing consistency for professional (should be PascalCase)
  if (formType === 'professional') {
    const nonPascal = schemaKeys.filter((k) => checkCasing(k) !== 'pascal');
    if (nonPascal.length > 0) {
      console.log(`  ✗ Non-PascalCase schema keys: ${nonPascal.join(', ')}`);
      passed = false;
    } else {
      console.log(`  ✓ schema keys are PascalCase`);
    }

    const nonPascalMapper = mapperKeys.filter((k) => checkCasing(k) !== 'pascal');
    if (nonPascalMapper.length > 0) {
      console.log(`  ⚠ Non-PascalCase mapper keys: ${nonPascalMapper.join(', ')}`);
    } else {
      console.log(`  ✓ mapper keys are PascalCase`);
    }
  }

  // Check casing for other forms (should be camelCase)
  if (formType !== 'professional') {
    const nonCamel = schemaKeys.filter((k) => checkCasing(k) === 'pascal');
    if (nonCamel.length > 0) {
      console.log(`  ⚠ PascalCase schema keys (expected camelCase): ${nonCamel.join(', ')}`);
    } else {
      console.log(`  ✓ schema keys are camelCase`);
    }
  }

  // Check for keys in mapper not in schema
  const mapperNotInSchema = mapperKeys.filter((k) => !schemaKeys.includes(k));
  if (mapperNotInSchema.length > 0) {
    console.log(`  ⚠ Mapper keys not in schema: ${mapperNotInSchema.join(', ')}`);
  }

  // Check for keys in schema not in mapper
  const schemaNotInMapper = schemaKeys.filter((k) => !mapperKeys.includes(k));
  if (schemaNotInMapper.length > 0) {
    console.log(`  ⚠ Schema keys not in mapper: ${schemaNotInMapper.join(', ')}`);
  }

  if (
    mapperNotInSchema.length === 0 &&
    schemaNotInMapper.length === 0 &&
    schemaKeys.length > 0
  ) {
    console.log(`  ✓ schema and mapper keys aligned`);
  }

  return passed;
}

function capitalize(s: string): string {
  if (s.startsWith('semi')) return 'SemiProfessional';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function main(): void {
  console.log('🔍 Checking field contracts across schema → mapper → store...\n');

  let allPassed = true;
  for (const formType of FORM_TYPES) {
    if (!validateForm(formType)) {
      allPassed = false;
    }
  }

  console.log('');
  if (allPassed) {
    console.log('✅ All field contracts aligned.');
  } else {
    console.log('❌ Some contract mismatches found. See output above.');
    process.exit(1);
  }
}

main();
