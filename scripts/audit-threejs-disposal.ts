#!/usr/bin/env tsx
/**
 * Three.js Resource Disposal Audit Script
 * 
 * 자원 정리 감사 | Resource Cleanup Audit
 * 
 * Scans all TypeScript/TSX files for Three.js object instantiations
 * without proper disposal patterns. Identifies memory leak risks.
 * 
 * Usage:
 *   npx tsx scripts/audit-threejs-disposal.ts
 *   npx tsx scripts/audit-threejs-disposal.ts --verbose
 *   npx tsx scripts/audit-threejs-disposal.ts --fix-report
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface AuditResult {
  file: string;
  threeObjectCreations: string[];
  hasDispose: boolean;
  hasUseEffect: boolean;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  lineNumbers: number[];
}

interface AuditSummary {
  totalFiles: number;
  filesWithThreeObjects: number;
  filesWithDisposal: number;
  highRiskFiles: number;
  mediumRiskFiles: number;
  lowRiskFiles: number;
  safeFiles: number;
}

// Patterns to detect Three.js object instantiations that need disposal
const THREE_OBJECT_PATTERNS = [
  /new THREE\.(Box|Sphere|Plane|Cylinder|Cone|Torus|Capsule|Ring|Circle|Dodecahedron|Icosahedron|Octahedron|Tetrahedron|Tube|Shape|Lathe|Extrude|Edges)Geometry/g,
  /new THREE\.BufferGeometry\(/g,
  /new THREE\.InstancedBufferGeometry\(/g,
  /new THREE\.(MeshStandard|MeshBasic|MeshPhysical|MeshLambert|MeshPhong|Points|LineBasic|LineDashed|Shader|Raw)Material/g,
  /new THREE\.(Texture|CanvasTexture|VideoTexture|DataTexture|CompressedTexture|CubeTexture)\(/g,
];

// Patterns to detect disposal
const DISPOSAL_PATTERNS = [
  /\.dispose\(\)/,
  /geometry\.dispose/,
  /material\.dispose/,
  /texture\.dispose/,
];

// Patterns to detect useEffect (React component)
const USE_EFFECT_PATTERN = /useEffect\(/;

// File extensions to scan
const VALID_EXTENSIONS = ['.ts', '.tsx'];

// Directories to skip
const SKIP_DIRS = ['node_modules', 'dist', 'build', 'coverage', '.git'];

/**
 * Recursively find all TypeScript files
 */
function findTypeScriptFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      if (!SKIP_DIRS.includes(file)) {
        findTypeScriptFiles(filePath, fileList);
      }
    } else {
      const ext = file.substring(file.lastIndexOf('.'));
      if (VALID_EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Audit a single file for Three.js resource management
 */
function auditFile(filePath: string, verbose: boolean = false): AuditResult | null {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const threeObjectCreations: string[] = [];
  const lineNumbers: number[] = [];
  const seenObjects = new Set<string>(); // O(1) lookup instead of O(n)
  
  // Single pass through lines for efficiency - O(lines × patterns)
  lines.forEach((line, idx) => {
    THREE_OBJECT_PATTERNS.forEach(pattern => {
      // Reset lastIndex for global regex
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(line)) !== null) {
        const matchStr = match[0];
        if (!seenObjects.has(matchStr)) {
          seenObjects.add(matchStr);
          threeObjectCreations.push(matchStr);
        }
        lineNumbers.push(idx + 1);
      }
    });
  });
  
  // Skip files without Three.js objects
  if (threeObjectCreations.length === 0) {
    return null;
  }
  
  // Check for disposal patterns
  let hasDispose = false;
  DISPOSAL_PATTERNS.forEach(pattern => {
    if (pattern.test(content)) {
      hasDispose = true;
    }
  });
  
  // Check for useEffect (indicates React component)
  const hasUseEffect = USE_EFFECT_PATTERN.test(content);
  
  // Determine risk level
  let riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE' = 'SAFE';
  
  if (!hasDispose && threeObjectCreations.length >= 5) {
    riskLevel = 'HIGH';
  } else if (!hasDispose && threeObjectCreations.length >= 2) {
    riskLevel = 'MEDIUM';
  } else if (!hasDispose && threeObjectCreations.length >= 1) {
    riskLevel = 'LOW';
  } else if (hasDispose) {
    riskLevel = 'SAFE';
  }
  
  if (verbose) {
    console.log(`\n📄 ${filePath}`);
    console.log(`   Objects: ${threeObjectCreations.length}`);
    console.log(`   Dispose: ${hasDispose ? '✅' : '❌'}`);
    console.log(`   Risk: ${riskLevel}`);
  }
  
  return {
    file: filePath,
    threeObjectCreations,
    hasDispose,
    hasUseEffect,
    riskLevel,
    lineNumbers: [...new Set(lineNumbers)].sort((a, b) => a - b),
  };
}

/**
 * Generate audit report
 */
function generateReport(results: AuditResult[]): AuditSummary {
  const summary: AuditSummary = {
    totalFiles: results.length,
    filesWithThreeObjects: results.length,
    filesWithDisposal: results.filter(r => r.hasDispose).length,
    highRiskFiles: results.filter(r => r.riskLevel === 'HIGH').length,
    mediumRiskFiles: results.filter(r => r.riskLevel === 'MEDIUM').length,
    lowRiskFiles: results.filter(r => r.riskLevel === 'LOW').length,
    safeFiles: results.filter(r => r.riskLevel === 'SAFE').length,
  };
  
  return summary;
}

/**
 * Print summary report
 */
function printSummary(summary: AuditSummary, results: AuditResult[], totalScanned: number) {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 Three.js Resource Disposal Audit Report');
  console.log('자원 정리 감사 보고서 | Resource Cleanup Audit Report');
  console.log('='.repeat(80));
  
  console.log('\n📊 Summary Statistics:');
  console.log(`   Total files scanned: ${totalScanned}`);
  console.log(`   Files with Three.js objects: ${summary.totalFiles}`);
  console.log(`   Files with disposal: ${summary.filesWithDisposal} (${((summary.filesWithDisposal / summary.filesWithThreeObjects) * 100).toFixed(1)}%)`);
  console.log(`   Files needing fixes: ${summary.highRiskFiles + summary.mediumRiskFiles + summary.lowRiskFiles}`);
  
  console.log('\n⚠️  Risk Distribution:');
  console.log(`   🔴 HIGH Risk:   ${summary.highRiskFiles} files (5+ objects, no disposal)`);
  console.log(`   🟡 MEDIUM Risk: ${summary.mediumRiskFiles} files (2-4 objects, no disposal)`);
  console.log(`   🟢 LOW Risk:    ${summary.lowRiskFiles} files (1 object, no disposal)`);
  console.log(`   ✅ SAFE:        ${summary.safeFiles} files (has disposal)`);
  
  // Print high-risk files
  const highRisk = results.filter(r => r.riskLevel === 'HIGH');
  if (highRisk.length > 0) {
    console.log('\n🔴 HIGH PRIORITY - Fix These First:');
    highRisk.slice(0, 20).forEach((result, idx) => {
      const relativePath = result.file.replace(process.cwd(), '');
      console.log(`   ${idx + 1}. ${relativePath}`);
      console.log(`      Objects: ${result.threeObjectCreations.length}, Lines: ${result.lineNumbers.slice(0, 5).join(', ')}${result.lineNumbers.length > 5 ? '...' : ''}`);
    });
    if (highRisk.length > 20) {
      console.log(`   ... and ${highRisk.length - 20} more files`);
    }
  }
  
  // Print medium-risk files
  const mediumRisk = results.filter(r => r.riskLevel === 'MEDIUM');
  if (mediumRisk.length > 0) {
    console.log('\n🟡 MEDIUM PRIORITY:');
    mediumRisk.slice(0, 10).forEach((result, idx) => {
      const relativePath = result.file.replace(process.cwd(), '');
      console.log(`   ${idx + 1}. ${relativePath}`);
    });
    if (mediumRisk.length > 10) {
      console.log(`   ... and ${mediumRisk.length - 10} more files`);
    }
  }
  
  console.log('\n💡 Recommendations:');
  console.log('   1. Start with HIGH risk files (most objects without cleanup)');
  console.log('   2. Add useEffect cleanup with geometry.dispose() and material.dispose()');
  console.log('   3. Follow patterns from src/utils/particlePool.ts');
  console.log('   4. Test memory usage with Chrome DevTools before/after');
  console.log('   5. Ensure 60fps performance is maintained');
  
  console.log('\n' + '='.repeat(80));
}

/**
 * Generate fix report for detailed analysis
 */
function generateFixReport(results: AuditResult[]) {
  console.log('\n' + '='.repeat(80));
  console.log('🛠️  Detailed Fix Report');
  console.log('='.repeat(80));
  
  const needsFix = results.filter(r => r.riskLevel !== 'SAFE');
  
  needsFix.forEach((result, idx) => {
    const relativePath = result.file.replace(process.cwd(), '');
    console.log(`\n[${idx + 1}/${needsFix.length}] ${relativePath}`);
    console.log(`Risk: ${result.riskLevel} | Objects: ${result.threeObjectCreations.length} | Has useEffect: ${result.hasUseEffect ? 'Yes' : 'No'}`);
    console.log(`Lines with THREE objects: ${result.lineNumbers.join(', ')}`);
    console.log(`\nObjects created:`);
    result.threeObjectCreations.forEach(obj => {
      console.log(`  - ${obj}`);
    });
    
    if (!result.hasUseEffect && result.file.endsWith('.tsx')) {
      console.log('\n⚠️  No useEffect found - Add cleanup pattern:');
      console.log('useEffect(() => {');
      console.log('  return () => {');
      result.threeObjectCreations.forEach(obj => {
        if (obj.includes('Geometry')) {
          console.log('    geometry.dispose();');
        } else if (obj.includes('Material')) {
          console.log('    material.dispose();');
        } else if (obj.includes('Texture')) {
          console.log('    texture.dispose();');
        }
      });
      console.log('  };');
      console.log('}, [dependencies]);');
    }
  });
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose');
  const fixReport = args.includes('--fix-report');
  
  console.log('🔍 Starting Three.js Resource Disposal Audit...\n');
  
  const srcDir = join(process.cwd(), 'src');
  const files = findTypeScriptFiles(srcDir);
  
  console.log(`Found ${files.length} TypeScript files to scan...\n`);
  
  const results: AuditResult[] = [];
  
  files.forEach(file => {
    const result = auditFile(file, verbose);
    if (result) {
      results.push(result);
    }
  });
  
  const summary = generateReport(results);
  printSummary(summary, results, files.length);
  
  if (fixReport) {
    generateFixReport(results);
  }
  
  // Exit with error code if high-risk files found
  if (summary.highRiskFiles > 0) {
    console.log('\n⚠️  Audit found HIGH risk memory leaks. Please fix before proceeding.\n');
    process.exit(1);
  }
}

// Run audit
main();
