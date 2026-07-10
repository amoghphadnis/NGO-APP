/**
 * architecture-health.ts
 * Runs all VPApp health checks and produces a scored report (like `flutter doctor`).
 *
 * Usage: npx tsx scripts/architecture-health.ts
 *        npm run vp:health
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');

interface HealthCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  details: string[];
}

function fileExists(relativePath: string): boolean {
  return fs.existsSync(path.join(PROJECT_ROOT, relativePath));
}

function readFile(relativePath: string): string | null {
  const fullPath = path.join(PROJECT_ROOT, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, 'utf-8');
}

function searchForImport(dir: string, packageName: string): boolean {
  if (!fs.existsSync(dir)) return false;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      if (searchForImport(fullPath, packageName)) return true;
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (content.includes(`from '${packageName}'`) || content.includes(`from "${packageName}"`)) return true;
    }
  }
  return false;
}

function findTsxFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findTsxFiles(fullPath));
    } else if (entry.name.endsWith('.tsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

// --- Individual checks ---

function checkRegistry(): HealthCheck {
  const details: string[] = [];
  const content = readFile('src/forms/shared/registry.ts');
  if (!content) return { name: 'Registry', status: 'fail', details: ['registry.ts not found'] };

  const formTypes = ['professional', 'puc', 'payana', 'semiProfessional'];
  const missing = formTypes.filter((t) => !content.includes(t));
  if (missing.length > 0) {
    details.push(`Missing: ${missing.join(', ')}`);
    return { name: 'Registry', status: 'fail', details };
  }
  details.push('All 4 form types registered');
  return { name: 'Registry', status: 'pass', details };
}

function checkConfigs(): HealthCheck {
  const details: string[] = [];
  const formTypes = ['professional', 'puc', 'payana', 'semiProfessional'];
  let allOk = true;

  for (const type of formTypes) {
    const content = readFile(`src/forms/${type}/config.ts`);
    if (!content) {
      details.push(`✗ ${type}: config.ts missing`);
      allOk = false;
      continue;
    }
    if (!content.includes('review')) {
      details.push(`✗ ${type}: missing review step`);
      allOk = false;
    }
    if (!content.includes('success')) {
      details.push(`✗ ${type}: missing success step`);
      allOk = false;
    }
    if (!content.includes('guidelines')) {
      details.push(`✗ ${type}: missing guidelines step`);
      allOk = false;
    }
    if (content.includes('review') && content.includes('success') && content.includes('guidelines')) {
      details.push(`✓ ${type}: config OK`);
    }
  }

  return { name: 'Form Configs', status: allOk ? 'pass' : 'fail', details };
}

function checkMappers(): HealthCheck {
  const details: string[] = [];
  const formTypes = ['professional', 'puc', 'payana', 'semiProfessional'];
  let allOk = true;

  for (const type of formTypes) {
    if (!fileExists(`src/forms/${type}/mapper.ts`)) {
      details.push(`✗ ${type}: mapper.ts missing`);
      allOk = false;
    } else {
      details.push(`✓ ${type}: mapper exists`);
    }
  }

  // Check submission pipeline references all form types
  const preparePayload = readFile('src/submission/preparePayload.ts');
  const submit = readFile('src/submission/submit.ts');
  if (preparePayload) {
    const missing = formTypes.filter((t) => !preparePayload.includes(t));
    if (missing.length > 0) {
      details.push(`✗ preparePayload missing: ${missing.join(', ')}`);
      allOk = false;
    }
  }
  if (submit) {
    const missing = formTypes.filter((t) => !submit.includes(t));
    if (missing.length > 0) {
      details.push(`✗ submit.ts missing: ${missing.join(', ')}`);
      allOk = false;
    }
  }

  return { name: 'Mappers & Pipeline', status: allOk ? 'pass' : 'fail', details };
}

function checkUISystem(): HealthCheck {
  const details: string[] = [];
  const components = [
    'src/components/layout/FormScreenLayout.tsx',
    'src/components/common/StickyActionFooter.tsx',
    'src/components/common/VPInputField.tsx',
    'src/components/common/VPDatePickerField.tsx',
    'src/components/common/ModalSelectField.tsx',
    'src/components/common/FormCard.tsx',
    'src/components/common/FormSectionHeader.tsx',
  ];

  const missing = components.filter((c) => !fileExists(c));
  if (missing.length > 0) {
    details.push(`Missing: ${missing.map((m) => path.basename(m)).join(', ')}`);
    return { name: 'VP UI System', status: 'fail', details };
  }
  details.push(`All ${components.length} core components present`);

  // Check for raw TextInput usage in screens
  const screensDir = path.join(PROJECT_ROOT, 'src', 'screens');
  const files = findTsxFiles(screensDir);
  let rawTextInputCount = 0;
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    if (content.includes('<TextInput') && !content.includes('VPInputField') && !content.includes('VPDatePickerField')) {
      rawTextInputCount++;
      details.push(`⚠ ${path.relative(PROJECT_ROOT, file)}: raw <TextInput>`);
    }
  }
  if (rawTextInputCount === 0) {
    details.push('No raw TextInput usage in screens');
  }

  return { name: 'VP UI System', status: rawTextInputCount > 0 ? 'warn' : 'pass', details };
}

function checkUploadKeys(): HealthCheck {
  const details: string[] = [];
  const formTypes = ['professional', 'puc', 'payana', 'semiProfessional'];
  let allOk = true;

  for (const type of formTypes) {
    if (!fileExists(`src/forms/${type}/fileKeys.ts`)) {
      details.push(`⚠ ${type}: fileKeys.ts missing (may not need documents)`);
      continue;
    }
    details.push(`✓ ${type}: fileKeys.ts exists`);
  }

  // Check professional has 16 keys
  const profKeys = readFile('src/forms/professional/fileKeys.ts');
  if (profKeys) {
    const keyMatches = profKeys.matchAll(/['"]([A-Za-z_][A-Za-z0-9_]*)['"]/g);
    const keys = [...keyMatches].map((m) => m[1]).filter((k) => !['export', 'const', 'type', 'import'].includes(k));
    const uniqueKeys = new Set(keys);
    if (uniqueKeys.size === 16) {
      details.push('✓ Professional: 16 document keys');
    } else {
      details.push(`⚠ Professional: ${uniqueKeys.size} keys (expected 16)`);
      allOk = false;
    }
  }

  return { name: 'Upload Keys', status: allOk ? 'pass' : 'warn', details };
}

function checkTheme(): HealthCheck {
  const details: string[] = [];
  const files = [
    'src/theme/colors.ts',
    'src/theme/spacing.ts',
    'src/theme/platform.ts',
    'src/theme/typography.ts',
  ];

  const missing = files.filter((f) => !fileExists(f));
  if (missing.length > 0) {
    details.push(`Missing: ${missing.join(', ')}`);
    return { name: 'Theme System', status: 'fail', details };
  }
  details.push('All theme files present (colors, spacing, platform, typography)');

  // Check 8pt grid
  const spacing = readFile('src/theme/spacing.ts');
  if (spacing && spacing.includes('8')) {
    details.push('8pt grid spacing detected');
  } else {
    details.push('⚠ 8pt grid spacing not confirmed');
  }

  return { name: 'Theme System', status: 'pass', details };
}

function checkLegacyFiles(): HealthCheck {
  const details: string[] = [];
  let hasIssues = false;

  // Legacy mapper
  if (fileExists('src/mappers/mapApplicationToApi.ts')) {
    details.push('⚠ Legacy mapApplicationToApi.ts still exists');
    hasIssues = true;
  }

  // Unused deps
  const pkg = readFile('package.json');
  if (pkg) {
    if (pkg.includes('"axios"')) {
      details.push('⚠ axios in dependencies (unused — project uses native fetch)');
      hasIssues = true;
    }
    if (pkg.includes('"yup"')) {
      details.push('⚠ yup in dependencies (unused — project uses Zod)');
      hasIssues = true;
    }
  }

  // resetForm issue
  const store = readFile('src/store/useFormEngineStore.ts');
  if (store) {
    const resetMatch = store.match(/resetForm[\s\S]{0,500}?formData/);
    if (resetMatch && resetMatch[0].includes('Professional') && !resetMatch[0].includes('currentFormType')) {
      details.push('⚠ resetForm() defaults to Professional regardless of currentFormType');
      hasIssues = true;
    }
  }

  if (!hasIssues) {
    details.push('No legacy files or known issues detected');
  }

  return { name: 'Legacy & Debt', status: hasIssues ? 'warn' : 'pass', details };
}

function checkGuardrails(): HealthCheck {
  const details: string[] = [];
  let allOk = true;

  if (!fileExists('.devin/rules/instructions.md')) {
    details.push('✗ .devin/rules/instructions.md missing (native build guardrails)');
    allOk = false;
  } else {
    details.push('✓ Native build guardrails present');
  }

  if (!fileExists('.devin/project-context/instructions.md')) {
    details.push('✗ .devin/project-context/instructions.md missing (context maintenance rules)');
    allOk = false;
  } else {
    details.push('✓ Context maintenance rules present');
  }

  if (!fileExists('PROJECT_CONTEXT_CURRENT.md')) {
    details.push('⚠ PROJECT_CONTEXT_CURRENT.md missing');
    allOk = false;
  } else {
    details.push('✓ PROJECT_CONTEXT_CURRENT.md exists');
  }

  return { name: 'Guardrails & Docs', status: allOk ? 'pass' : 'warn', details };
}

// --- Report generation ---

function scoreCheck(check: HealthCheck): number {
  if (check.status === 'pass') return 100;
  if (check.status === 'warn') return 75;
  return 0;
}

function printCheck(check: HealthCheck): void {
  const icon = check.status === 'pass' ? '✓' : check.status === 'warn' ? '⚠' : '✗';
  console.log(`  ${icon} ${check.name}`);
  for (const detail of check.details) {
    console.log(`      ${detail}`);
  }
  console.log('');
}

function main(): void {
  console.log('\n🏥 VPApp Architecture Health Report\n');
  console.log('═══════════════════════════════════════\n');

  const checks: HealthCheck[] = [
    checkRegistry(),
    checkConfigs(),
    checkMappers(),
    checkUISystem(),
    checkUploadKeys(),
    checkTheme(),
    checkLegacyFiles(),
    checkGuardrails(),
  ];

  for (const check of checks) {
    printCheck(check);
  }

  // Calculate score
  const scores = checks.map(scoreCheck);
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const passCount = checks.filter((c) => c.status === 'pass').length;
  const warnCount = checks.filter((c) => c.status === 'warn').length;
  const failCount = checks.filter((c) => c.status === 'fail').length;

  console.log('═══════════════════════════════════════');
  console.log(`\n  Score: ${avgScore}/100`);
  console.log(`  Checks: ${passCount} passed, ${warnCount} warnings, ${failCount} failed\n`);

  if (avgScore >= 90) {
    console.log('  ✅ Architecture is healthy.');
  } else if (avgScore >= 70) {
    console.log('  ⚠ Architecture has minor issues. Address warnings before PR.');
  } else {
    console.log('  ❌ Architecture has significant issues. Fix failures before PR.');
  }

  console.log('');

  if (failCount > 0 || avgScore < 70) {
    process.exit(1);
  }
}

main();
