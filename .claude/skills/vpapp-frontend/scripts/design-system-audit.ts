/**
 * design-system-audit.ts
 * Flags raw TextInput usage, inline InputField definitions, and missing VP UI components.
 *
 * Usage: npx tsx scripts/design-system-audit.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const SCREENS_DIR = path.join(PROJECT_ROOT, 'src', 'screens');
const COMPONENTS_DIR = path.join(PROJECT_ROOT, 'src', 'components');

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

interface Violation {
  file: string;
  line: number;
  rule: string;
  snippet: string;
}

function auditFile(filePath: string): Violation[] {
  const violations: Violation[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relPath = path.relative(PROJECT_ROOT, filePath);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for raw TextInput import (not VPInputField or VPDatePickerField)
    if (
      line.includes('TextInput') &&
      !line.includes('VPInputField') &&
      !line.includes('VPDatePickerField') &&
      !line.includes('TextInputProps') &&
      !line.includes('//') &&
      (line.includes('import') || line.includes('<TextInput'))
    ) {
      // Flag raw <TextInput> usage (not import of TextInputProps)
      if (line.includes('<TextInput') && !line.includes('VP')) {
        violations.push({
          file: relPath,
          line: i + 1,
          rule: 'Raw <TextInput> — use VPInputField instead',
          snippet: line.trim(),
        });
      }
      // Flag import of TextInput without VPInputField
      if (
        line.includes('import') &&
        line.includes('TextInput') &&
        !line.includes('VPInputField') &&
        !line.includes('TextInputProps') &&
        !line.includes('VPDatePickerField')
      ) {
        violations.push({
          file: relPath,
          line: i + 1,
          rule: 'Importing raw TextInput — use VPInputField instead',
          snippet: line.trim(),
        });
      }
    }

    // Check for inline InputField definitions
    if (
      line.match(/^(const|function)\s+InputField\b/) &&
      !line.includes('VPInputField')
    ) {
      violations.push({
        file: relPath,
        line: i + 1,
        rule: 'Inline InputField definition — use VPInputField from components/common',
        snippet: line.trim(),
      });
    }

    // Check for hardcoded colors (hex values in style definitions)
    if (line.match(/color:\s*['"]#[0-9A-Fa-f]{3,8}['"]/) && !line.includes('colors.')) {
      violations.push({
        file: relPath,
        line: i + 1,
        rule: 'Hardcoded color — use theme colors from src/theme/colors.ts',
        snippet: line.trim(),
      });
    }

    // Check for hardcoded spacing in styles (common patterns)
    if (
      line.match(/(padding|margin):\s*\d+\b/) &&
      !line.includes('spacing.') &&
      !line.includes('platform.') &&
      !line.includes('StyleSheet')
    ) {
      const numMatch = line.match(/(padding|margin):\s*(\d+)/);
      if (numMatch && parseInt(numMatch[2]) > 8) {
        violations.push({
          file: relPath,
          line: i + 1,
          rule: `Hardcoded ${numMatch[1]} (${numMatch[2]}px) — use spacing tokens from src/theme/spacing.ts`,
          snippet: line.trim(),
        });
      }
    }
  }

  return violations;
}

function checkFormScreensUseVPLayout(): void {
  console.log('\n📋 Checking form section screens for FormScreenLayout usage...\n');
  const formSectionsDir = path.join(SCREENS_DIR, 'form-sections');
  const files = findTsxFiles(formSectionsDir);

  let missing = 0;
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const relPath = path.relative(PROJECT_ROOT, file);
    if (!content.includes('FormScreenLayout')) {
      console.log(`  ✗ ${relPath} — missing FormScreenLayout`);
      missing++;
    }
  }

  if (missing === 0) {
    console.log(`  ✓ All ${files.length} form section screens use FormScreenLayout`);
  } else {
    console.log(`  ✗ ${missing}/${files.length} screens missing FormScreenLayout`);
  }
}

function main(): void {
  console.log('🔍 Auditing design system compliance...\n');

  const allFiles = [...findTsxFiles(SCREENS_DIR), ...findTsxFiles(COMPONENTS_DIR)];
  let allViolations: Violation[] = [];

  for (const file of allFiles) {
    allViolations.push(...auditFile(file));
  }

  // Group by rule
  const byRule: Record<string, Violation[]> = {};
  for (const v of allViolations) {
    if (!byRule[v.rule]) byRule[v.rule] = [];
    byRule[v.rule].push(v);
  }

  if (allViolations.length === 0) {
    console.log('✅ No design system violations found in screens and components.');
  } else {
    console.log(`❌ Found ${allViolations.length} violations:\n`);
    for (const [rule, violations] of Object.entries(byRule)) {
      console.log(`  ${rule} (${violations.length} occurrences):`);
      for (const v of violations) {
        console.log(`    ${v.file}:${v.line} — ${v.snippet}`);
      }
      console.log('');
    }
  }

  checkFormScreensUseVPLayout();

  if (allViolations.length > 0) {
    process.exit(1);
  }
}

main();
