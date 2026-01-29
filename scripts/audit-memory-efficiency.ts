#!/usr/bin/env tsx
/**
 * Comprehensive Memory Efficiency Audit Script
 * 
 * 메모리 효율성 종합 감사 | Comprehensive Memory Efficiency Audit
 * 
 * Scans all TypeScript/TSX files for common memory leak patterns:
 * - Timers without cleanup (setTimeout, setInterval)
 * - Event listeners without removal
 * - Animation frames without cancellation
 * - Test files without proper cleanup
 * - Large object allocations in loops
 * 
 * Usage:
 *   npx tsx scripts/audit-memory-efficiency.ts
 *   npx tsx scripts/audit-memory-efficiency.ts --verbose
 *   npx tsx scripts/audit-memory-efficiency.ts --fix-report
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface MemoryIssue {
  type: 'timer' | 'event' | 'animation' | 'test' | 'allocation';
  description: string;
  lineNumber: number;
  code: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface FileAuditResult {
  file: string;
  issues: MemoryIssue[];
  isTestFile: boolean;
  hasCleanup: boolean;
  riskScore: number;
}

interface AuditSummary {
  filesScanned: number;
  filesWithIssues: number;
  highRiskFiles: number;
  mediumRiskFiles: number;
  lowRiskFiles: number;
  timerIssues: number;
  eventIssues: number;
  animationIssues: number;
  testCleanupIssues: number;
  allocationIssues: number;
}

// File extensions to scan
const VALID_EXTENSIONS = ['.ts', '.tsx'];

// Directories to skip
const SKIP_DIRS = ['node_modules', 'dist', 'build', 'coverage', '.git'];

// Patterns to detect memory leak risks
const TIMER_CREATE = /setTimeout|setInterval/g;
const TIMER_CLEAR = /clearTimeout|clearInterval/g;
const EVENT_ADD = /addEventListener/g;
const EVENT_REMOVE = /removeEventListener/g;
const ANIMATION_REQUEST = /requestAnimationFrame/g;
const ANIMATION_CANCEL = /cancelAnimationFrame/g;
const USE_EFFECT_CLEANUP = /useEffect\([^)]*\)\s*{[^}]*return\s*\(\)\s*=>/gm;
const TEST_CLEANUP = /afterEach|beforeEach|afterAll|beforeAll/g;
const LARGE_ARRAY_ALLOC = /new\s+(Array|Float32Array|Float64Array|Int32Array|Uint32Array)\s*\(\s*\d{4,}\s*\)/g;

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
 * Audit a single file for memory efficiency issues
 */
function auditFile(filePath: string, verbose: boolean = false): FileAuditResult {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const isTestFile = filePath.includes('.test.') || filePath.includes('.spec.');
  
  const issues: MemoryIssue[] = [];
  
  // Check for timers without cleanup
  let hasSetTimeout = false;
  let hasClearTimeout = false;
  lines.forEach((line, idx) => {
    if (TIMER_CREATE.test(line)) {
      hasSetTimeout = true;
      const hasCleanupInLine = TIMER_CLEAR.test(line);
      if (!hasCleanupInLine) {
        issues.push({
          type: 'timer',
          description: 'Timer created without immediate cleanup reference',
          lineNumber: idx + 1,
          code: line.trim(),
          severity: 'MEDIUM'
        });
      }
    }
    if (TIMER_CLEAR.test(line)) {
      hasClearTimeout = true;
    }
  });
  
  // If timers exist but no cleanup at all, high severity
  if (hasSetTimeout && !hasClearTimeout && content.includes('setTimeout')) {
    issues.push({
      type: 'timer',
      description: 'File uses timers but has no cleanup (clearTimeout/clearInterval)',
      lineNumber: 0,
      code: 'Global file issue',
      severity: 'HIGH'
    });
  }
  
  // Check for event listeners without removal
  let hasEventAdd = false;
  let hasEventRemove = false;
  lines.forEach((line, idx) => {
    if (EVENT_ADD.test(line)) {
      hasEventAdd = true;
      issues.push({
        type: 'event',
        description: 'Event listener added - verify removeEventListener in cleanup',
        lineNumber: idx + 1,
        code: line.trim(),
        severity: 'MEDIUM'
      });
    }
    if (EVENT_REMOVE.test(line)) {
      hasEventRemove = true;
    }
  });
  
  if (hasEventAdd && !hasEventRemove) {
    issues.push({
      type: 'event',
      description: 'File adds event listeners but has no removal',
      lineNumber: 0,
      code: 'Global file issue',
      severity: 'HIGH'
    });
  }
  
  // Check for animation frames without cancellation
  let hasAnimationRequest = false;
  let hasAnimationCancel = false;
  lines.forEach((line, idx) => {
    if (ANIMATION_REQUEST.test(line)) {
      hasAnimationRequest = true;
      issues.push({
        type: 'animation',
        description: 'requestAnimationFrame used - verify cancelAnimationFrame in cleanup',
        lineNumber: idx + 1,
        code: line.trim(),
        severity: 'MEDIUM'
      });
    }
    if (ANIMATION_CANCEL.test(line)) {
      hasAnimationCancel = true;
    }
  });
  
  if (hasAnimationRequest && !hasAnimationCancel) {
    issues.push({
      type: 'animation',
      description: 'File uses requestAnimationFrame but has no cancellation',
      lineNumber: 0,
      code: 'Global file issue',
      severity: 'HIGH'
    });
  }
  
  // Check test files for cleanup
  if (isTestFile) {
    const hasTestCleanup = TEST_CLEANUP.test(content);
    if (!hasTestCleanup) {
      issues.push({
        type: 'test',
        description: 'Test file has no afterEach/beforeEach cleanup hooks',
        lineNumber: 0,
        code: 'Test cleanup missing',
        severity: 'LOW'
      });
    }
  }
  
  // Check for large allocations in loops
  lines.forEach((line, idx) => {
    const match = LARGE_ARRAY_ALLOC.exec(line);
    if (match) {
      issues.push({
        type: 'allocation',
        description: 'Large array allocation (consider pooling or reuse)',
        lineNumber: idx + 1,
        code: line.trim(),
        severity: 'LOW'
      });
    }
  });
  
  // Check for useEffect cleanup
  const hasUseEffectCleanup = USE_EFFECT_CLEANUP.test(content);
  
  // Calculate risk score
  let riskScore = 0;
  issues.forEach(issue => {
    switch (issue.severity) {
      case 'HIGH': riskScore += 10; break;
      case 'MEDIUM': riskScore += 5; break;
      case 'LOW': riskScore += 1; break;
    }
  });
  
  if (verbose && issues.length > 0) {
    console.log(`\n📄 ${filePath}`);
    console.log(`   Issues: ${issues.length}, Risk Score: ${riskScore}`);
    issues.forEach(issue => {
      const emoji = issue.severity === 'HIGH' ? '🔴' : issue.severity === 'MEDIUM' ? '🟡' : '🟢';
      console.log(`   ${emoji} Line ${issue.lineNumber}: ${issue.description}`);
    });
  }
  
  return {
    file: filePath,
    issues,
    isTestFile,
    hasCleanup: hasClearTimeout || hasEventRemove || hasAnimationCancel || hasUseEffectCleanup,
    riskScore
  };
}

/**
 * Generate summary report
 */
function generateSummary(results: FileAuditResult[]): AuditSummary {
  const filesWithIssues = results.filter(r => r.issues.length > 0);
  
  return {
    filesScanned: results.length,
    filesWithIssues: filesWithIssues.length,
    highRiskFiles: results.filter(r => r.riskScore >= 20).length,
    mediumRiskFiles: results.filter(r => r.riskScore >= 10 && r.riskScore < 20).length,
    lowRiskFiles: results.filter(r => r.riskScore > 0 && r.riskScore < 10).length,
    timerIssues: results.reduce((sum, r) => sum + r.issues.filter(i => i.type === 'timer').length, 0),
    eventIssues: results.reduce((sum, r) => sum + r.issues.filter(i => i.type === 'event').length, 0),
    animationIssues: results.reduce((sum, r) => sum + r.issues.filter(i => i.type === 'animation').length, 0),
    testCleanupIssues: results.reduce((sum, r) => sum + r.issues.filter(i => i.type === 'test').length, 0),
    allocationIssues: results.reduce((sum, r) => sum + r.issues.filter(i => i.type === 'allocation').length, 0)
  };
}

/**
 * Print summary report
 */
function printSummary(summary: AuditSummary, results: FileAuditResult[]) {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 Memory Efficiency Audit Report');
  console.log('메모리 효율성 감사 보고서 | Memory Efficiency Audit Report');
  console.log('='.repeat(80));
  
  console.log('\n📊 Summary Statistics:');
  console.log(`   Total files scanned: ${summary.filesScanned}`);
  console.log(`   Files with issues: ${summary.filesWithIssues}`);
  
  console.log('\n⚠️  Risk Distribution:');
  console.log(`   🔴 HIGH Risk:   ${summary.highRiskFiles} files (risk score >= 20)`);
  console.log(`   🟡 MEDIUM Risk: ${summary.mediumRiskFiles} files (risk score 10-19)`);
  console.log(`   🟢 LOW Risk:    ${summary.lowRiskFiles} files (risk score 1-9)`);
  
  console.log('\n📋 Issue Categories:');
  console.log(`   ⏱️  Timer issues:      ${summary.timerIssues}`);
  console.log(`   🎧 Event issues:      ${summary.eventIssues}`);
  console.log(`   🎬 Animation issues:  ${summary.animationIssues}`);
  console.log(`   🧪 Test cleanup:      ${summary.testCleanupIssues}`);
  console.log(`   💾 Allocation issues: ${summary.allocationIssues}`);
  
  // Print high-risk files
  const highRisk = results.filter(r => r.riskScore >= 20).sort((a, b) => b.riskScore - a.riskScore);
  if (highRisk.length > 0) {
    console.log('\n🔴 HIGH RISK FILES:');
    highRisk.slice(0, 10).forEach((result, idx) => {
      const relativePath = result.file.replace(process.cwd(), '');
      console.log(`   ${idx + 1}. ${relativePath} (Score: ${result.riskScore})`);
      result.issues.filter(i => i.severity === 'HIGH').forEach(issue => {
        console.log(`      - ${issue.description}`);
      });
    });
    if (highRisk.length > 10) {
      console.log(`   ... and ${highRisk.length - 10} more files`);
    }
  }
  
  console.log('\n💡 Recommendations:');
  console.log('   1. Fix HIGH risk files first (score >= 20)');
  console.log('   2. Add cleanup in useEffect return functions');
  console.log('   3. Add afterEach cleanup in test files');
  console.log('   4. Use refs to store timer/listener IDs for cleanup');
  console.log('   5. Consider object pooling for large allocations');
  
  console.log('\n' + '='.repeat(80));
}

/**
 * Generate detailed fix report
 */
function generateFixReport(results: FileAuditResult[]) {
  console.log('\n' + '='.repeat(80));
  console.log('🛠️  Detailed Fix Report');
  console.log('='.repeat(80));
  
  const needsFix = results.filter(r => r.riskScore >= 10).sort((a, b) => b.riskScore - a.riskScore);
  
  needsFix.forEach((result, idx) => {
    const relativePath = result.file.replace(process.cwd(), '');
    console.log(`\n[${idx + 1}/${needsFix.length}] ${relativePath}`);
    console.log(`Risk Score: ${result.riskScore} | Issues: ${result.issues.length} | Test File: ${result.isTestFile ? 'Yes' : 'No'}`);
    
    result.issues.forEach(issue => {
      const emoji = issue.severity === 'HIGH' ? '🔴' : issue.severity === 'MEDIUM' ? '🟡' : '🟢';
      console.log(`\n${emoji} ${issue.type.toUpperCase()} - ${issue.severity}`);
      console.log(`   Line ${issue.lineNumber}: ${issue.description}`);
      if (issue.lineNumber > 0) {
        console.log(`   Code: ${issue.code}`);
      }
    });
    
    // Suggest fix pattern
    if (result.issues.some(i => i.type === 'timer' || i.type === 'event' || i.type === 'animation')) {
      console.log('\n💡 Suggested Fix Pattern:');
      console.log('```typescript');
      console.log('useEffect(() => {');
      if (result.issues.some(i => i.type === 'timer')) {
        console.log('  const timerId = setTimeout(() => { ... }, delay);');
      }
      if (result.issues.some(i => i.type === 'event')) {
        console.log('  const handleEvent = () => { ... };');
        console.log('  element.addEventListener("event", handleEvent);');
      }
      if (result.issues.some(i => i.type === 'animation')) {
        console.log('  let animationId: number;');
        console.log('  const animate = () => {');
        console.log('    animationId = requestAnimationFrame(animate);');
        console.log('  };');
        console.log('  animate();');
      }
      console.log('  return () => {');
      if (result.issues.some(i => i.type === 'timer')) {
        console.log('    clearTimeout(timerId);');
      }
      if (result.issues.some(i => i.type === 'event')) {
        console.log('    element.removeEventListener("event", handleEvent);');
      }
      if (result.issues.some(i => i.type === 'animation')) {
        console.log('    cancelAnimationFrame(animationId);');
      }
      console.log('  };');
      console.log('}, [dependencies]);');
      console.log('```');
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
  
  console.log('🔍 Starting Memory Efficiency Audit...\n');
  
  const srcDir = join(process.cwd(), 'src');
  const files = findTypeScriptFiles(srcDir);
  
  console.log(`Found ${files.length} TypeScript files to scan...\n`);
  
  const results: FileAuditResult[] = [];
  
  files.forEach(file => {
    const result = auditFile(file, verbose);
    results.push(result);
  });
  
  const summary = generateSummary(results);
  printSummary(summary, results);
  
  if (fixReport) {
    generateFixReport(results);
  }
  
  // Exit with warning if high-risk files found
  if (summary.highRiskFiles > 0) {
    console.log('\n⚠️  Audit found HIGH risk memory efficiency issues.\n');
    process.exit(1);
  }
}

// Run audit
main();
