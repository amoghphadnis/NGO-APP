/**
 * check-dead-deps.ts
 * Flags unused dependencies (axios, yup, legacy mapper) and known dead code.
 *
 * Usage: npx tsx scripts/check-dead-deps.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');

interface DepCheck {
  name: string;
  type: 'dependency' | 'file';
  reason: string;
  check: () => boolean;
}

function isImportedInSrc(packageName: string): boolean {
  const srcDir = path.join(PROJECT_ROOT, 'src');
  return searchForImport(srcDir, packageName);
}

function searchForImport(dir: string, packageName: string): boolean {
  if (!fs.existsSync(dir)) return false;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (searchForImport(fullPath, packageName)) return true;
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      // Check for import statements or require calls
      const importPattern = new RegExp(
        `(from\\s+['"]${packageName}['"]|require\\(['"]${packageName}['"]\\)|from\\s+['"]${packageName}/)`,
        'g',
      );
      if (importPattern.test(content)) return true;
    }
  }
  return false;
}

function fileExists(relativePath: string): boolean {
  return fs.existsSync(path.join(PROJECT_ROOT, relativePath));
}

function isFileImportedInSrc(relativePath: string): boolean {
  const srcDir = path.join(PROJECT_ROOT, 'src');
  const fileName = path.basename(relativePath, path.extname(relativePath));
  return searchForImport(srcDir, fileName);
}

const checks: DepCheck[] = [
  {
    name: 'axios',
    type: 'dependency',
    reason: 'Project uses native fetch via src/api/client.ts. axios is unused.',
    check: () => !isImportedInSrc('axios'),
  },
  {
    name: 'yup',
    type: 'dependency',
    reason: 'Project uses Zod for all validation. yup is unused.',
    check: () => !isImportedInSrc('yup'),
  },
  {
    name: 'src/mappers/mapApplicationToApi.ts',
    type: 'file',
    reason: 'Legacy mapper replaced by src/forms/professional/mapper.ts. Not used by submission pipeline.',
    check: () => fileExists('src/mappers/mapApplicationToApi.ts') && !isFileImportedInSrc('mapApplicationToApi'),
  },
];

function main(): void {
  console.log('🔍 Checking for dead dependencies and files...\n');

  let foundDead = false;

  for (const check of checks) {
    const isDead = check.check();
    if (isDead) {
      console.log(`  ✗ ${check.name}`);
      console.log(`    ${check.reason}`);
      foundDead = true;
    } else {
      console.log(`  ✓ ${check.name} — OK`);
    }
  }

  // Check package.json for deps that aren't imported
  const packageJsonPath = path.join(PROJECT_ROOT, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const deps = Object.keys(pkg.dependencies || {});

    console.log('\n📦 Checking all package.json dependencies...\n');
    for (const dep of deps) {
      // Skip peer/meta packages
      if (['react', 'react-dom', 'react-native', 'react-native-web'].includes(dep)) continue;
      if (dep.startsWith('expo-') || dep.startsWith('@react-native-') || dep.startsWith('@react-navigation/')) continue;
      if (dep.startsWith('@expo/') || dep.startsWith('@tanstack/')) continue;
      if (dep === 'expo' || dep === 'zustand' || dep === 'zod' || dep === 'react-hook-form') continue;
      if (dep === '@hookform/resolvers' || dep === 'dayjs') continue;

      if (!isImportedInSrc(dep)) {
        console.log(`  ⚠ ${dep} — not imported in src/`);
        foundDead = true;
      }
    }
  }

  console.log('');
  if (foundDead) {
    console.log('❌ Dead dependencies/files found. Consider removing them.');
    process.exit(1);
  } else {
    console.log('✅ No dead dependencies found.');
  }
}

main();
