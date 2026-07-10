/**
 * update-project-context.ts
 * Generates PROJECT_CONTEXT_CURRENT.md AND PROJECT_CONTEXT_CURRENT.json from codebase analysis.
 *
 * Usage: npx tsx scripts/update-project-context.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');

const FORM_TYPES = ['professional', 'puc', 'payana', 'semiProfessional'];

interface FormInfo {
  type: string;
  steps: string[];
  stepCount: number;
  hasMapper: boolean;
  hasSchema: boolean;
  hasReview: boolean;
  hasSuccess: boolean;
  hasFileKeys: boolean;
  uploadKeyCount: number;
}

interface ProjectContext {
  generated: string;
  project: string;
  stack: {
    framework: string;
    runtime: string;
    language: string;
    navigation: string;
    state: string;
    forms: string;
    validation: string;
    http: string;
  };
  forms: FormInfo[];
  api: {
    baseUrl: string;
    endpoints: Record<string, string>;
  };
  uiComponents: string[];
  theme: {
    colors: number;
    spacing: string;
    platform: boolean;
  };
  technicalDebt: string[];
}

function readFile(relativePath: string): string | null {
  const fullPath = path.join(PROJECT_ROOT, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, 'utf-8');
}

function parseSteps(configContent: string): string[] {
  const stepsMatch = configContent.match(/steps:\s*\[([^\]]+)\]/);
  if (!stepsMatch) return [];
  return stepsMatch[1]
    .split(',')
    .map((s) => s.trim().replace(/['"]/g, ''))
    .filter(Boolean);
}

function countUploadKeys(formType: string): number {
  const content = readFile(`src/forms/${formType}/fileKeys.ts`);
  if (!content) return 0;
  const matches = content.matchAll(/['"]([A-Za-z_][A-Za-z0-9_]*)['"]/g);
  const keys = [...matches]
    .map((m) => m[1])
    .filter((k) => !['export', 'const', 'type', 'import'].includes(k));
  return new Set(keys).size;
}

function getFormInfo(formType: string): FormInfo {
  const configContent = readFile(`src/forms/${formType}/config.ts`) || '';
  const steps = parseSteps(configContent);

  return {
    type: formType,
    steps,
    stepCount: steps.length,
    hasMapper: fs.existsSync(path.join(PROJECT_ROOT, `src/forms/${formType}/mapper.ts`)),
    hasSchema: fs.existsSync(path.join(PROJECT_ROOT, `src/validation/${formType}Schemas.ts`)),
    hasReview: fs.existsSync(path.join(PROJECT_ROOT, `src/screens/form-sections/${formType}/ReviewSection.tsx`)),
    hasSuccess: fs.existsSync(path.join(PROJECT_ROOT, `src/screens/form-sections/${formType}/SuccessSection.tsx`)),
    hasFileKeys: fs.existsSync(path.join(PROJECT_ROOT, `src/forms/${formType}/fileKeys.ts`)),
    uploadKeyCount: countUploadKeys(formType),
  };
}

function getBaseUrl(): string {
  const content = readFile('src/config/environment.ts');
  if (!content) return 'unknown';
  const match = content.match(/API_BASE_URL\s*[=:]\s*['"]([^'"]+)['"]/);
  return match ? match[1] : 'unknown';
}

function getEndpoints(): Record<string, string> {
  const endpoints: Record<string, string> = {};
  const apiDir = path.join(PROJECT_ROOT, 'src', 'api');
  if (!fs.existsSync(apiDir)) return endpoints;

  const files = fs.readdirSync(apiDir).filter((f) => f.endsWith('.ts') && f !== 'client.ts');
  for (const file of files) {
    const content = fs.readFileSync(path.join(apiDir, file), 'utf-8');
    const matches = content.matchAll(/['"`]([^'"`]*\/[^'"`]*)['"`]/g);
    for (const match of matches) {
      const endpoint = match[1];
      if (endpoint.includes('/') && !endpoint.includes('import') && !endpoint.includes('http')) {
        endpoints[file.replace('.ts', '')] = endpoint;
      }
    }
  }
  return endpoints;
}

function getUIComponents(): string[] {
  const commonDir = path.join(PROJECT_ROOT, 'src', 'components', 'common');
  const layoutDir = path.join(PROJECT_ROOT, 'src', 'components', 'layout');
  const components: string[] = [];

  for (const dir of [commonDir, layoutDir]) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.tsx'));
    for (const file of files) {
      components.push(file.replace('.tsx', ''));
    }
  }
  return components;
}

function getTechnicalDebt(): string[] {
  const debt: string[] = [];

  if (fs.existsSync(path.join(PROJECT_ROOT, 'src/mappers/mapApplicationToApi.ts'))) {
    debt.push('Legacy mapApplicationToApi.ts still exists (deprecated)');
  }

  const pkg = readFile('package.json');
  if (pkg) {
    if (pkg.includes('"axios"')) debt.push('axios in dependencies but unused');
    if (pkg.includes('"yup"')) debt.push('yup in dependencies but unused');
  }

  const store = readFile('src/store/useFormEngineStore.ts');
  if (store && store.includes('ProfessionalFormValues') && store.includes('resetForm')) {
    const resetMatch = store.match(/resetForm[\s\S]*?formData/);
    if (resetMatch && resetMatch[0].includes('Professional')) {
      debt.push('resetForm() defaults to Professional form regardless of currentFormType');
    }
  }

  return debt;
}

function generateJSON(context: ProjectContext): string {
  return JSON.stringify(context, null, 2);
}

function generateMarkdown(context: ProjectContext): string {
  const date = context.generated;

  let md = `# PROJECT_CONTEXT_CURRENT.md\n\n`;
  md += `> **Generated:** ${date} (auto-generated by update-project-context.ts)\n`;
  md += `> **Project:** ${context.project}\n`;
  md += `> **Stack:** ${context.stack.framework} + ${context.stack.language} + ${context.stack.state} + ${context.stack.forms} + ${context.stack.validation}\n\n`;
  md += `---\n\n## Forms\n\n`;
  md += `| Form Type | Steps | Count | Mapper | Schema | Review | Success | Upload Keys |\n`;
  md += `|---|---|---|---|---|---|---|---|\n`;
  for (const form of context.forms) {
    md += `| ${form.type} | ${form.steps.join('→')} | ${form.stepCount} | ${form.hasMapper ? '✓' : '✗'} | ${form.hasSchema ? '✓' : '✗'} | ${form.hasReview ? '✓' : '✗'} | ${form.hasSuccess ? '✓' : '✗'} | ${form.uploadKeyCount} |\n`;
  }

  md += `\n## API\n\n`;
  md += `**Base URL:** \`${context.api.baseUrl}\`\n\n`;
  md += `| Module | Endpoint |\n|---|---|\n`;
  for (const [module, endpoint] of Object.entries(context.api.endpoints)) {
    md += `| ${module} | \`${endpoint}\` |\n`;
  }

  md += `\n## UI Components\n\n`;
  for (const comp of context.uiComponents) {
    md += `- ${comp}\n`;
  }

  md += `\n## Technical Debt\n\n`;
  if (context.technicalDebt.length === 0) {
    md += `No known technical debt.\n`;
  } else {
    for (const item of context.technicalDebt) {
      md += `- ${item}\n`;
    }
  }

  return md;
}

function main(): void {
  console.log('🔍 Analyzing codebase...\n');

  const context: ProjectContext = {
    generated: new Date().toISOString().split('T')[0],
    project: 'Vidya Poshak Scholarship App (VPApp)',
    stack: {
      framework: 'Expo 54',
      runtime: 'React Native 0.81',
      language: 'TypeScript 5.9',
      navigation: 'Expo Router 6',
      state: 'Zustand 5',
      forms: 'React Hook Form 7',
      validation: 'Zod 4',
      http: 'Native fetch',
    },
    forms: FORM_TYPES.map(getFormInfo),
    api: {
      baseUrl: getBaseUrl(),
      endpoints: getEndpoints(),
    },
    uiComponents: getUIComponents(),
    theme: {
      colors: 15,
      spacing: '8pt grid',
      platform: fs.existsSync(path.join(PROJECT_ROOT, 'src/theme/platform.ts')),
    },
    technicalDebt: getTechnicalDebt(),
  };

  // Write JSON
  const jsonPath = path.join(PROJECT_ROOT, 'PROJECT_CONTEXT_CURRENT.json');
  fs.writeFileSync(jsonPath, generateJSON(context));
  console.log(`✓ Created ${path.relative(PROJECT_ROOT, jsonPath)}`);

  // Write Markdown
  const mdPath = path.join(PROJECT_ROOT, 'PROJECT_CONTEXT_CURRENT.md');
  fs.writeFileSync(mdPath, generateMarkdown(context));
  console.log(`✓ Updated ${path.relative(PROJECT_ROOT, mdPath)}`);

  // Summary
  console.log(`\n📊 Summary:`);
  console.log(`  Forms: ${context.forms.length}`);
  console.log(`  API endpoints: ${Object.keys(context.api.endpoints).length}`);
  console.log(`  UI components: ${context.uiComponents.length}`);
  console.log(`  Technical debt items: ${context.technicalDebt.length}`);
}

main();
