#!/usr/bin/env tsx
/**
 * Asset Audit Script for Black Trigram (흑괘)
 * 
 * Verifies all asset references in the codebase point to existing files.
 * Scans source code for asset paths and validates them against the filesystem.
 * 
 * @korean 에셋 감사 스크립트
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface AssetReference {
  readonly file: string;
  readonly line: number;
  readonly column: number;
  readonly assetPath: string;
  readonly exists: boolean;
  readonly actualPath: string;
  readonly type: 'visual' | 'audio' | 'other';
}

interface AuditReport {
  readonly totalReferences: number;
  readonly validReferences: number;
  readonly missingReferences: number;
  readonly references: ReadonlyArray<AssetReference>;
  readonly missingAssets: ReadonlyArray<AssetReference>;
  readonly assetTypes: {
    readonly visual: number;
    readonly audio: number;
    readonly other: number;
  };
}

/**
 * Find all source files to scan
 */
function findSourceFiles(dir: string, extensions: string[]): string[] {
  const results: string[] = [];

  function scanDir(currentDir: string): void {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        // Skip node_modules, dist, build, etc.
        if (entry.isDirectory()) {
          if (!['node_modules', 'dist', 'build', '.git', 'coverage', 'cypress'].includes(entry.name)) {
            scanDir(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (extensions.includes(ext)) {
            results.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${currentDir}:`, error);
    }
  }

  scanDir(dir);
  return results;
}

/**
 * Extract asset references from source code
 */
function extractAssetReferences(filePath: string, projectRoot: string): AssetReference[] {
  const references: AssetReference[] = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // Regex patterns to match asset paths
    const patterns = [
      // Match /assets/... in strings
      /['"`](\/(assets\/[^'"`\s]+))['"`]/g,
      // Match ./assets/... or ../assets/...
      /['"`](\.\.\/(assets\/[^'"`\s]+))['"`]/g,
      /['"`](\.\/(assets\/[^'"`\s]+))['"`]/g,
      // Match public/assets/...
      /['"`](public\/(assets\/[^'"`\s]+))['"`]/g,
    ];

    lines.forEach((line, lineIndex) => {
      for (const pattern of patterns) {
        let match: RegExpExecArray | null;
        const regex = new RegExp(pattern.source, pattern.flags);
        
        while ((match = regex.exec(line)) !== null) {
          const assetPath = match[1];
          const column = match.index;

          // Skip template strings with variables (${...})
          if (assetPath.includes('${')) {
            continue;
          }

          // Skip test file paths that are intentionally non-existent
          if (filePath.includes('.test.') || filePath.includes('.spec.')) {
            // Skip paths that look like test fixtures (e.g., "/test", "/test.mp3", "/assets/audio/sfx/test")
            if (assetPath.includes('/test') && !assetPath.includes('/tests/')) {
              continue;
            }
          }

          // Normalize the path to check existence
          let checkPath = assetPath;
          
          // Remove leading slash and 'public/' prefix
          checkPath = checkPath.replace(/^\//, '');
          checkPath = checkPath.replace(/^public\//, '');
          
          const fullPath = path.join(projectRoot, 'public', checkPath);
          const exists = fs.existsSync(fullPath);

          // Determine asset type
          let type: 'visual' | 'audio' | 'other' = 'other';
          if (assetPath.includes('/visual/') || /\.(png|jpg|jpeg|webp|svg|gif)$/i.test(assetPath)) {
            type = 'visual';
          } else if (assetPath.includes('/audio/') || /\.(mp3|webm|ogg|wav|m4a)$/i.test(assetPath)) {
            type = 'audio';
          }

          references.push({
            file: path.relative(projectRoot, filePath),
            line: lineIndex + 1,
            column,
            assetPath,
            exists,
            actualPath: fullPath,
            type,
          });
        }
      }
    });
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}:`, error);
  }

  return references;
}

/**
 * Generate audit report
 */
function generateAuditReport(references: AssetReference[]): AuditReport {
  const missingAssets = references.filter(ref => !ref.exists);
  const validReferences = references.filter(ref => ref.exists);

  const assetTypes = {
    visual: references.filter(ref => ref.type === 'visual').length,
    audio: references.filter(ref => ref.type === 'audio').length,
    other: references.filter(ref => ref.type === 'other').length,
  };

  return {
    totalReferences: references.length,
    validReferences: validReferences.length,
    missingReferences: missingAssets.length,
    references,
    missingAssets,
    assetTypes,
  };
}

/**
 * Print audit report
 */
function printReport(report: AuditReport, verbose: boolean = false): void {
  console.log('\n' + '='.repeat(80));
  console.log('🎮 BLACK TRIGRAM ASSET AUDIT REPORT (흑괘 에셋 감사 보고서)');
  console.log('='.repeat(80) + '\n');

  console.log('📊 Summary:');
  console.log(`  Total asset references: ${report.totalReferences}`);
  console.log(`  Valid references: ${report.validReferences} ✅`);
  console.log(`  Missing references: ${report.missingReferences} ❌`);
  console.log('');
  
  console.log('📦 Asset Types:');
  console.log(`  Visual assets: ${report.assetTypes.visual}`);
  console.log(`  Audio assets: ${report.assetTypes.audio}`);
  console.log(`  Other assets: ${report.assetTypes.other}`);
  console.log('');

  if (report.missingReferences > 0) {
    console.log('❌ MISSING ASSETS:');
    console.log('─'.repeat(80));

    // Group by asset path
    const grouped = new Map<string, AssetReference[]>();
    for (const ref of report.missingAssets) {
      const existing = grouped.get(ref.assetPath) || [];
      existing.push(ref);
      grouped.set(ref.assetPath, existing);
    }

    for (const [assetPath, refs] of grouped.entries()) {
      console.log(`\n  📁 ${assetPath} (${refs[0].type})`);
      console.log(`     Referenced in ${refs.length} location(s):`);
      for (const ref of refs) {
        console.log(`       • ${ref.file}:${ref.line}`);
      }
    }

    console.log('\n' + '─'.repeat(80));
  } else {
    console.log('✅ All asset references are valid!\n');
  }

  if (verbose && report.validReferences > 0) {
    console.log('\n✅ VALID ASSET REFERENCES:');
    console.log('─'.repeat(80));

    // Group valid references by asset path
    const validGrouped = new Map<string, AssetReference[]>();
    for (const ref of report.references.filter(r => r.exists)) {
      const existing = validGrouped.get(ref.assetPath) || [];
      existing.push(ref);
      validGrouped.set(ref.assetPath, existing);
    }

    for (const [assetPath, refs] of validGrouped.entries()) {
      console.log(`\n  📁 ${assetPath} (${refs[0].type})`);
      console.log(`     Referenced in ${refs.length} location(s)`);
    }

    console.log('\n' + '─'.repeat(80));
  }

  console.log('');
}

/**
 * Main audit function
 */
async function auditAssets(): Promise<void> {
  const projectRoot = path.resolve(__dirname, '..');
  const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');

  console.log('🔍 Starting asset audit...\n');
  console.log(`📂 Project root: ${projectRoot}`);
  console.log(`📄 Scanning source files...\n`);

  // Find all source files
  const sourceFiles = [
    ...findSourceFiles(path.join(projectRoot, 'src'), ['.ts', '.tsx', '.js', '.jsx']),
    ...findSourceFiles(path.join(projectRoot, 'cypress'), ['.ts', '.tsx', '.js', '.jsx']),
  ];

  console.log(`   Found ${sourceFiles.length} source files to scan\n`);

  // Extract all asset references
  const allReferences: AssetReference[] = [];
  for (const file of sourceFiles) {
    const refs = extractAssetReferences(file, projectRoot);
    allReferences.push(...refs);
  }

  // Generate report
  const report = generateAuditReport(allReferences);

  // Print report
  printReport(report, verbose);

  // Exit with error if missing assets found
  if (report.missingReferences > 0) {
    console.error('❌ Asset audit failed: Missing asset references found!\n');
    console.error('💡 Actions to take:');
    console.error('   1. Check if the asset file exists but is in a different location');
    console.error('   2. Update the asset path in the source code');
    console.error('   3. Remove the reference if the asset is no longer needed');
    console.error('   4. Add the missing asset file to public/assets/\n');
    process.exit(1);
  } else {
    console.log('✅ Asset audit passed successfully!\n');
    process.exit(0);
  }
}

// Run audit
auditAssets().catch((error) => {
  console.error('💥 Fatal error during asset audit:', error);
  process.exit(1);
});
