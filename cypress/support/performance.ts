/// <reference types="cypress" />

/**
 * Performance monitoring hooks for E2E tests
 * Tracks test execution times and logs metrics for optimization
 */

let testStartTime: number;
let suiteStartTime: number;
const testTimings: Record<string, number> = {};

// Track suite start time
before(() => {
  suiteStartTime = Date.now();
  console.log("\n🚀 E2E Test Suite Started\n");
});

// Track individual test timing
beforeEach(function () {
  testStartTime = Date.now();
  const testTitle = this.currentTest?.title || "Unknown Test";
  console.log(`\n⏱️  Starting: ${testTitle}`);
});

afterEach(function () {
  const testTitle = this.currentTest?.title || "Unknown Test";
  const duration = Date.now() - testStartTime;
  testTimings[testTitle] = duration;
  
  const status = this.currentTest?.state || "unknown";
  const emoji = status === "passed" ? "✅" : status === "failed" ? "❌" : "⚠️";
  
  console.log(`${emoji} ${testTitle}: ${duration}ms`);
  
  // Log to Cypress task for CI reporting
  cy.task("logTestMetrics", {
    test: testTitle,
    status,
    duration,
  }).then(() => {
    // Warn on slow tests
    if (duration > 15000) {
      console.warn(`⚠️  SLOW TEST DETECTED: ${testTitle} took ${duration}ms`);
    }
  });
});

// Log suite summary
after(() => {
  const totalDuration = Date.now() - suiteStartTime;
  const testCount = Object.keys(testTimings).length;
  const avgDuration = testCount > 0 ? totalDuration / testCount : 0;
  
  console.log("\n📊 E2E Test Suite Summary");
  console.log("================================");
  console.log(`Total Tests: ${testCount}`);
  console.log(`Total Duration: ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`);
  console.log(`Average Test Duration: ${avgDuration.toFixed(0)}ms`);
  console.log("\n🔝 Slowest Tests:");
  
  // Sort tests by duration and show top 5 slowest
  const sortedTests = Object.entries(testTimings)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  
  sortedTests.forEach(([test, duration], index) => {
    console.log(`  ${index + 1}. ${test}: ${duration}ms`);
  });
  
  console.log("\n✅ E2E Test Suite Completed\n");
});
