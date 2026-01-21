#!/usr/bin/env ts-node
/**
 * Event Listener Audit Script
 * 이벤트 리스너 감사 스크립트
 *
 * This script audits all addEventListener calls in the codebase to:
 * 1. Find all addEventListener calls
 * 2. Check for matching removeEventListener
 * 3. Identify potential memory leaks
 * 4. Suggest EventManager migration opportunities
 * 5. Generate report with Korean/English documentation
 *
 * Usage:
 *   npx tsx scripts/audit-event-listeners.ts
 *   npx tsx scripts/audit-event-listeners.ts --verbose
 */

import * as fs from "fs";
import * as path from "path";

interface EventListenerUsage {
  file: string;
  line: number;
  event: string;
  hasCleanup: boolean;
  isPassive: boolean;
  context: string;
}

interface AuditReport {
  totalAddEventListeners: number;
  totalRemoveEventListeners: number;
  filesWithPotentialLeaks: string[];
  passiveListenerUsage: number;
  recommendedForEventManager: EventListenerUsage[];
  summary: {
    cleanupRate: number;
    passiveRate: number;
    filesAudited: number;
  };
}

// Events that should use passive listeners
const PASSIVE_EVENTS = new Set([
  "scroll",
  "wheel",
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel",
  "mousewheel",
]);

// Directories to scan
const SRC_DIR = path.join(process.cwd(), "src");
const EXCLUDE_DIRS = ["node_modules", "dist", "build", "coverage"];

// Check if verbose mode
const isVerbose = process.argv.includes("--verbose");

/**
 * Get all TypeScript/TSX files in a directory
 */
function getTypeScriptFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (!EXCLUDE_DIRS.includes(entry.name)) {
          traverse(fullPath);
        }
      } else if (entry.isFile()) {
        if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) {
          files.push(fullPath);
        }
      }
    }
  }

  traverse(dir);
  return files;
}

/**
 * Check if a file has removeEventListener for an addEventListener
 */
function hasRemoveEventListener(
  content: string,
  eventType: string,
): boolean {
  // Check for removeEventListener with same event type
  const removePattern = new RegExp(
    `removeEventListener\\s*\\(\\s*["'\`]${eventType}["'\`]`,
    "g",
  );
  return removePattern.test(content);
}

/**
 * Check if an addEventListener call uses passive option
 */
function isPassiveListener(line: string, content: string): boolean {
  // Direct passive: true
  if (/passive\s*:\s*true/.test(line) || /\{\s*passive\s*:\s*true/.test(line)) {
    return true;
  }

  // Check for options variable that might have passive
  const optionsMatch = line.match(/addEventListener\s*\([^,]+,\s*[^,]+,\s*(\w+)\)/);
  if (optionsMatch) {
    const optionsVar = optionsMatch[1];
    // Look for the options definition in the file
    const optionsDefRegex = new RegExp(`${optionsVar}[^=]*=\\s*\\{[^}]*passive\\s*:[^}]*\\}`);
    if (optionsDefRegex.test(content)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if an addEventListener call uses once option (auto-cleanup)
 */
function hasOnceOption(line: string): boolean {
  return /once\s*:\s*true/.test(line) || /\{\s*once\s*:\s*true/.test(line);
}

/**
 * Extract event type from addEventListener call
 */
function extractEventType(line: string): string | null {
  const match = line.match(/addEventListener\s*\(\s*["'`]([^"'`]+)["'`]/);
  return match ? match[1] : null;
}

/**
 * Check if line is in a test file context
 */
function isTestContext(filePath: string, content: string, lineIndex: number): boolean {
  // Check if file is a test file
  if (/\.test\.(ts|tsx)$/.test(filePath)) {
    return true;
  }

  // Check if within a describe/it/test block
  const lines = content.split("\n");
  for (let i = lineIndex; i >= 0; i--) {
    if (/^\s*(describe|it|test)\s*\(/.test(lines[i])) {
      return true;
    }
  }

  return false;
}

/**
 * Audit a single file for event listener usage
 */
function auditFile(filePath: string): EventListenerUsage[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const usages: EventListenerUsage[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip comments
    if (/^\s*(\/\/|\/\*)/.test(line)) {
      continue;
    }

    if (/addEventListener/.test(line)) {
      const eventType = extractEventType(line);
      if (!eventType) continue;

      // Skip test mocks
      if (isTestContext(filePath, content, i)) {
        continue;
      }

      // Check if this uses { once: true } which auto-removes
      const hasOnce = hasOnceOption(line);
      const hasCleanup = hasOnce || hasRemoveEventListener(content, eventType);
      const isPassive = isPassiveListener(line, content);

      usages.push({
        file: path.relative(process.cwd(), filePath),
        line: i + 1,
        event: eventType,
        hasCleanup,
        isPassive,
        context: line.trim(),
      });
    }
  }

  return usages;
}

/**
 * Generate audit report
 */
function generateReport(allUsages: EventListenerUsage[]): AuditReport {
  const filesWithLeaks = new Set<string>();
  const recommendedForEventManager: EventListenerUsage[] = [];
  let passiveListenerCount = 0;

  for (const usage of allUsages) {
    // Count passive listeners
    if (usage.isPassive) {
      passiveListenerCount++;
    }

    // Check if event should be passive but isn't
    if (PASSIVE_EVENTS.has(usage.event) && !usage.isPassive) {
      recommendedForEventManager.push({
        ...usage,
        context: `⚠️ Should use passive listener: ${usage.context}`,
      });
    }

    // Check for missing cleanup
    if (!usage.hasCleanup) {
      filesWithLeaks.add(usage.file);
      recommendedForEventManager.push({
        ...usage,
        context: `⚠️ Missing cleanup: ${usage.context}`,
      });
    }
  }

  const filesAudited = new Set(allUsages.map((u) => u.file)).size;
  const cleanupRate =
    allUsages.length > 0
      ? ((allUsages.filter((u) => u.hasCleanup).length / allUsages.length) * 100)
      : 100;
  const passiveRate =
    allUsages.length > 0 ? ((passiveListenerCount / allUsages.length) * 100) : 0;

  return {
    totalAddEventListeners: allUsages.length,
    totalRemoveEventListeners: allUsages.filter((u) => u.hasCleanup).length,
    filesWithPotentialLeaks: Array.from(filesWithLeaks),
    passiveListenerUsage: passiveListenerCount,
    recommendedForEventManager,
    summary: {
      cleanupRate,
      passiveRate,
      filesAudited,
    },
  };
}

/**
 * Print the audit report
 */
function printReport(report: AuditReport) {
  console.log("\n" + "=".repeat(80));
  console.log("🎯 Event Listener Audit Report | 이벤트 리스너 감사 보고서");
  console.log("=".repeat(80) + "\n");

  // Summary
  console.log("📊 Summary | 요약:");
  console.log(`  Files Audited: ${report.summary.filesAudited}`);
  console.log(`  Total addEventListener calls: ${report.totalAddEventListeners}`);
  console.log(`  Total removeEventListener calls: ${report.totalRemoveEventListeners}`);
  console.log(`  Cleanup Rate: ${report.summary.cleanupRate.toFixed(1)}%`);
  console.log(`  Passive Listener Usage: ${report.passiveListenerUsage} (${report.summary.passiveRate.toFixed(1)}%)`);
  console.log("");

  // Potential Memory Leaks
  if (report.filesWithPotentialLeaks.length > 0) {
    console.log("⚠️  Files with Potential Memory Leaks | 잠재적 메모리 누수가 있는 파일:");
    report.filesWithPotentialLeaks.forEach((file) => {
      console.log(`  - ${file}`);
    });
    console.log("");
  } else {
    console.log("✅ No potential memory leaks detected! | 잠재적 메모리 누수가 감지되지 않았습니다!\n");
  }

  // Recommendations
  if (report.recommendedForEventManager.length > 0) {
    console.log("💡 Recommendations for EventManager Migration | EventManager 마이그레이션 권장 사항:");
    console.log(`  ${report.recommendedForEventManager.length} locations can benefit from EventManager\n`);

    if (isVerbose) {
      report.recommendedForEventManager.forEach((usage, index) => {
        console.log(`  ${index + 1}. ${usage.file}:${usage.line}`);
        console.log(`     Event: ${usage.event}`);
        console.log(`     ${usage.context}`);
        console.log("");
      });
    } else {
      console.log("  Run with --verbose flag to see detailed recommendations");
    }
  } else {
    console.log("✅ All event listeners are properly managed! | 모든 이벤트 리스너가 올바르게 관리됩니다!\n");
  }

  // Performance Insights
  console.log("📈 Performance Insights | 성능 인사이트:");
  const shouldBePassive = report.recommendedForEventManager.filter((u) =>
    PASSIVE_EVENTS.has(u.event) && !u.isPassive
  ).length;

  if (shouldBePassive > 0) {
    console.log(`  ⚠️  ${shouldBePassive} events should use passive listeners for better scroll performance`);
    console.log("     패시브 리스너를 사용하면 스크롤 성능이 향상됩니다");
  } else {
    console.log("  ✅ All scroll/touch events use passive listeners");
    console.log("     모든 스크롤/터치 이벤트가 패시브 리스너를 사용합니다");
  }
  console.log("");

  // Migration Tips
  console.log("🔧 Migration Tips | 마이그레이션 팁:");
  console.log("  1. Use EventManager for centralized event management");
  console.log("     중앙 집중식 이벤트 관리를 위해 EventManager 사용");
  console.log("  2. EventManager automatically applies passive to scroll/touch events");
  console.log("     EventManager는 스크롤/터치 이벤트에 자동으로 패시브 적용");
  console.log("  3. Always use the cleanup function returned by EventManager.add()");
  console.log("     항상 EventManager.add()가 반환하는 정리 함수 사용");
  console.log("");

  console.log("=".repeat(80) + "\n");
}

/**
 * Main audit function
 */
async function main() {
  console.log("🔍 Starting event listener audit...");
  console.log("   이벤트 리스너 감사를 시작합니다...\n");

  // Get all TypeScript files
  const files = getTypeScriptFiles(SRC_DIR);
  console.log(`📁 Found ${files.length} TypeScript files to audit\n`);

  // Audit each file
  let allUsages: EventListenerUsage[] = [];
  for (const file of files) {
    const usages = auditFile(file);
    allUsages = allUsages.concat(usages);
  }

  // Generate and print report
  const report = generateReport(allUsages);
  printReport(report);

  // Exit with error code if there are potential leaks
  if (report.filesWithPotentialLeaks.length > 0) {
    process.exit(1);
  }
}

// Run the audit
main().catch((error) => {
  console.error("❌ Error running audit:", error);
  process.exit(1);
});
