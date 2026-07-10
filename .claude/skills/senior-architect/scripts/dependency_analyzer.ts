/**
 * dependency_analyzer.ts
 * Analyzes package.json for unused/deprecated dependencies.
 *
 * Usage: npx tsx scripts/dependency_analyzer.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function readPackageJson(): PackageJson {
  const pkgPath = path.join(PROJECT_ROOT, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    console.error('package.json not found');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
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
      const patterns = [
        new RegExp(`from\\s+['"]${packageName}['"]`),
        new RegExp(`from\\s+['"]${packageName}/`),
        new RegExp(`require\\(['"]${packageName}['"]\\)`),
        new RegExp(`require\\(['"]${packageName}/`),
      ];
      if (patterns.some((p) => p.test(content))) return true;
    }
  }
  return false;
}

// Packages that are used implicitly (not directly imported)
const IMPLICIT_PACKAGES = new Set([
  'expo',
  'react',
  'react-dom',
  'react-native',
  'react-native-web',
  'expo-status-bar',
  'expo-splash-screen',
  'expo-system-ui',
  'expo-constants',
  'expo-font',
  'expo-linking',
  'expo-router',
  'react-native-screens',
  'react-native-safe-area-context',
  'react-native-gesture-handler',
  'react-native-reanimated',
  'react-native-worklets',
  'expo-symbols',
  'expo-glass-effect',
  'expo-web-browser',
  'expo-device',
]);

function main(): void {
  console.log('🔍 Analyzing dependencies...\n');

  const pkg = readPackageJson();
  const deps = pkg.dependencies || {};
  const devDeps = pkg.devDependencies || {};

  const srcDir = path.join(PROJECT_ROOT, 'src');

  // Check runtime dependencies
  console.log('📦 Runtime Dependencies:\n');
  let unusedCount = 0;

  for (const [name, version] of Object.entries(deps)) {
    if (IMPLICIT_PACKAGES.has(name)) {
      console.log(`  ✓ ${name}@${version} (implicit)`);
      continue;
    }

    const isUsed = searchForImport(srcDir, name);
    if (isUsed) {
      console.log(`  ✓ ${name}@${version}`);
    } else {
      console.log(`  ✗ ${name}@${version} — NOT IMPORTED in src/`);
      unusedCount++;
    }
  }

  // Check dev dependencies
  console.log('\n🛠️ Dev Dependencies:\n');
  for (const [name, version] of Object.entries(devDeps)) {
    console.log(`  • ${name}@${version}`);
  }

  // Known deprecated/unused
  console.log('\n⚠️ Known Issues:\n');
  const knownUnused = ['axios', 'yup'];
  for (const name of knownUnused) {
    if (deps[name]) {
      console.log(`  ✗ ${name} — known unused, should be removed`);
    }
  }

  // Summary
  console.log(`\n📊 Summary:`);
  console.log(`  Total runtime deps: ${Object.keys(deps).length}`);
  console.log(`  Total dev deps: ${Object.keys(devDeps).length}`);
  console.log(`  Unused runtime deps: ${unusedCount}`);

  if (unusedCount > 0) {
    console.log('\n❌ Unused dependencies found. Consider removing them.');
    process.exit(1);
  } else {
    console.log('\n✅ All runtime dependencies are used.');
  }
}

main();
