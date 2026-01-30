/**
 * Memory Monitoring Plugin for Cypress E2E Tests
 * 
 * This plugin helps detect and log memory leaks during test execution.
 * It monitors JavaScript heap usage and provides warnings when thresholds are exceeded.
 * 
 * Usage in tests:
 * - Call logMemorySnapshot() at key points
 * - Memory warnings appear automatically in console
 * - Full report generated at end of test suite
 */

interface MemorySnapshot {
  timestamp: number;
  testName: string;
  usedHeapMB: number;
  totalHeapMB: number;
  limitMB: number;
  usagePercent: number;
}

class MemoryMonitor {
  private snapshots: MemorySnapshot[] = [];
  private readonly WARNING_THRESHOLD = 80; // Warn at 80% memory usage
  private readonly LEAK_THRESHOLD_MB = 50; // Warn if growth > 50MB between tests

  /**
   * Take a memory snapshot
   */
  takeSnapshot(testName: string, win: Window): MemorySnapshot | null {
    if (!(win.performance as any).memory) {
      return null;
    }

    const memory = (win.performance as any).memory;
    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      testName,
      usedHeapMB: memory.usedJSHeapSize / 1048576,
      totalHeapMB: memory.totalJSHeapSize / 1048576,
      limitMB: memory.jsHeapSizeLimit / 1048576,
      usagePercent: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
    };

    this.snapshots.push(snapshot);
    return snapshot;
  }

  /**
   * Check for potential memory leaks
   */
  checkForLeaks(currentSnapshot: MemorySnapshot): string[] {
    const warnings: string[] = [];

    // Check absolute usage
    if (currentSnapshot.usagePercent > this.WARNING_THRESHOLD) {
      warnings.push(
        `⚠️ High memory usage: ${currentSnapshot.usagePercent.toFixed(1)}% (${currentSnapshot.usedHeapMB.toFixed(2)}MB)`
      );
    }

    // Check growth since last snapshot
    if (this.snapshots.length > 1) {
      const lastSnapshot = this.snapshots[this.snapshots.length - 2];
      const growth = currentSnapshot.usedHeapMB - lastSnapshot.usedHeapMB;
      const growthPercent = (growth / lastSnapshot.usedHeapMB) * 100;

      if (growth > this.LEAK_THRESHOLD_MB) {
        warnings.push(
          `⚠️ Memory leak suspected: +${growth.toFixed(2)}MB (+${growthPercent.toFixed(1)}%) since last test`
        );
      }
    }

    return warnings;
  }

  /**
   * Generate memory usage report
   */
  generateReport(): string {
    if (this.snapshots.length === 0) {
      return "No memory snapshots recorded";
    }

    const firstSnapshot = this.snapshots[0];
    const lastSnapshot = this.snapshots[this.snapshots.length - 1];
    const totalGrowth = lastSnapshot.usedHeapMB - firstSnapshot.usedHeapMB;
    const avgUsage =
      this.snapshots.reduce((sum, s) => sum + s.usedHeapMB, 0) /
      this.snapshots.length;
    const maxUsage = Math.max(...this.snapshots.map((s) => s.usedHeapMB));

    const report = `
📊 Memory Usage Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Snapshots Taken: ${this.snapshots.length}
Initial Memory:  ${firstSnapshot.usedHeapMB.toFixed(2)}MB
Final Memory:    ${lastSnapshot.usedHeapMB.toFixed(2)}MB
Total Growth:    ${totalGrowth > 0 ? '+' : ''}${totalGrowth.toFixed(2)}MB
Average Usage:   ${avgUsage.toFixed(2)}MB
Peak Usage:      ${maxUsage.toFixed(2)}MB
Memory Limit:    ${lastSnapshot.limitMB.toFixed(2)}MB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    return report;
  }

  /**
   * Reset the monitor
   */
  reset(): void {
    this.snapshots = [];
  }
}

// Global monitor instance
const monitor = new MemoryMonitor();

// Cypress commands
Cypress.Commands.add('logMemorySnapshot', (testName: string) => {
  cy.window().then((win) => {
    const snapshot = monitor.takeSnapshot(testName, win);
    if (snapshot) {
      cy.log(
        `📊 Memory: ${snapshot.usedHeapMB.toFixed(2)}MB / ${snapshot.limitMB.toFixed(2)}MB (${snapshot.usagePercent.toFixed(1)}%)`
      );

      const warnings = monitor.checkForLeaks(snapshot);
      warnings.forEach((warning) => cy.log(warning));
    }
  });
});

Cypress.Commands.add('generateMemoryReport', () => {
  const report = monitor.generateReport();
  cy.log(report);
  monitor.reset();
});

// Auto-log memory at test end
afterEach(function () {
  if (this.currentTest) {
    cy.logMemorySnapshot(`After: ${this.currentTest.title}`);
  }
});

// Generate report after all tests
after(() => {
  cy.generateMemoryReport();
});

// Type declarations
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Log current memory usage snapshot
       * @param testName Name of the test or checkpoint
       */
      logMemorySnapshot(testName: string): void;

      /**
       * Generate and log memory usage report
       */
      generateMemoryReport(): void;
    }
  }
}

export {};
