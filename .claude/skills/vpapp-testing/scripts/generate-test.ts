/**
 * generate-test.ts
 * Generates a test file for a given form section or module.
 *
 * Usage: npx tsx scripts/generate-test.ts <modulePath>
 * Example: npx tsx scripts/generate-test.ts professional/PersonalSection
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');

function parseArgs(): { modulePath: string } {
  const modulePath = process.argv[2];
  if (!modulePath) {
    console.error('Usage: npx tsx scripts/generate-test.ts <modulePath>');
    console.error('Example: npx tsx scripts/generate-test.ts professional/PersonalSection');
    process.exit(1);
  }
  return { modulePath };
}

function generateComponentTest(modulePath: string): string {
  const parts = modulePath.split('/');
  const fileName = parts[parts.length - 1];
  const pascalName = fileName.replace(/Section$/, '');

  return `import React from 'react';
import { render } from '@testing-library/react-native';

import ${fileName} from '@/screens/form-sections/${modulePath}';

// Mock store
jest.mock('@/store/useFormEngineStore', () => ({
  useFormEngineStore: () => ({
    formData: {},
    updateSectionData: jest.fn(),
    markStepComplete: jest.fn(),
    updateValidationState: jest.fn(),
  }),
}));

// Mock navigation
const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};

describe('${fileName}', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<${fileName} navigation={mockNavigation} />);
    expect(toJSON()).toBeTruthy();
  });

  it('displays section title', () => {
    const { getByText } = render(<${fileName} navigation={mockNavigation} />);
    // Adjust expected text based on section
    expect(getByText(/${pascalName}/i)).toBeTruthy();
  });
});
`;
}

function generateSchemaTest(modulePath: string): string {
  const parts = modulePath.split('/');
  const formType = parts[0] || 'professional';
  const sectionName = parts[parts.length - 1].replace(/Section$/, '');

  return `import { ${formType}${sectionName}DetailsSchema } from '@/validation/${formType}Schemas';

describe('${formType}${sectionName}DetailsSchema', () => {
  it('accepts valid data', () => {
    const result = ${formType}${sectionName}DetailsSchema.safeParse({});
    // Add valid test data
    // expect(result.success).toBe(true);
  });

  it('rejects empty data', () => {
    const result = ${formType}${sectionName}DetailsSchema.safeParse({});
    // Expect failures for required fields
    // expect(result.success).toBe(false);
  });
});
`;
}

function generateMapperTest(modulePath: string): string {
  const formType = modulePath.split('/')[0] || 'professional';

  return `import { ${formType}Mapper } from '@/forms/${formType}/mapper';

describe('${formType}Mapper', () => {
  it('produces ${formType === 'payana' ? 'JSON object' : 'FormData'}', () => {
    const mockData = {} as any;
    const result = ${formType}Mapper(mockData);
    ${formType === 'payana'
      ? "expect(result).toBeInstanceOf(Object);"
      : "expect(result).toBeInstanceOf(FormData);"}
  });

  it('handles empty documents gracefully', () => {
    const mockData = { documents: {} } as any;
    expect(() => ${formType}Mapper(mockData)).not.toThrow();
  });
});
`;
}

function main(): void {
  const { modulePath } = parseArgs();

  // Determine test type based on path
  const isSchema = modulePath.includes('Schema') || modulePath.includes('schema');
  const isMapper = modulePath.includes('Mapper') || modulePath.includes('mapper');
  const isSection = modulePath.includes('Section');

  let testContent: string;
  let testDir: string;
  let testFile: string;

  if (isSchema) {
    testContent = generateSchemaTest(modulePath);
    testDir = path.join(PROJECT_ROOT, '__tests__', 'validation');
    testFile = path.join(testDir, `${modulePath.replace(/\//g, '_')}.test.ts`);
  } else if (isMapper) {
    testContent = generateMapperTest(modulePath);
    testDir = path.join(PROJECT_ROOT, '__tests__', 'mappers');
    testFile = path.join(testDir, `${modulePath.replace(/\//g, '_')}.test.ts`);
  } else if (isSection) {
    testContent = generateComponentTest(modulePath);
    testDir = path.join(PROJECT_ROOT, '__tests__', 'screens');
    testFile = path.join(testDir, `${modulePath.replace(/\//g, '_')}.test.tsx`);
  } else {
    console.error('Could not determine test type. Path should contain "Section", "Schema", or "Mapper".');
    process.exit(1);
  }

  if (fs.existsSync(testFile)) {
    console.error(`✗ Test file already exists: ${path.relative(PROJECT_ROOT, testFile)}`);
    process.exit(1);
  }

  fs.mkdirSync(testDir, { recursive: true });
  fs.writeFileSync(testFile, testContent);
  console.log(`✓ Created ${path.relative(PROJECT_ROOT, testFile)}`);
  console.log('\n📋 Next steps:');
  console.log('  1. Fill in test data based on the schema/component');
  console.log('  2. Run: npm test');
}

main();
