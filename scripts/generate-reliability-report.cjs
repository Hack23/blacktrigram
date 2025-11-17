#!/usr/bin/env node

/**
 * Test Reliability Report Generator for Black Trigram
 * Analyzes test results to detect flaky tests and generate reliability metrics
 * 
 * Usage: node scripts/generate-reliability-report.js [results-directory]
 */

const fs = require('fs');
const path = require('path');

const REPORTS_DIR = process.argv[2] || 'build/cypress/mochawesome';

/**
 * Parse Mochawesome JSON reports
 */
function parseReports(reportsDir) {
  if (!fs.existsSync(reportsDir)) {
    console.error(`Error: Reports directory not found: ${reportsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(reportsDir)
    .filter((f) => f.endsWith('.json'))
    .filter((f) => !f.includes('mochawesome-all'));

  if (files.length === 0) {
    console.error('Error: No test result files found');
    process.exit(1);
  }

  console.log(`📊 Analyzing ${files.length} test result file(s)...`);

  const testResults = new Map();
  let totalDuration = 0;
  let testCount = 0;

  files.forEach((file) => {
    const content = fs.readFileSync(path.join(reportsDir, file), 'utf8');
    const report = JSON.parse(content);

    // Navigate Mochawesome structure
    if (report.results && Array.isArray(report.results)) {
      report.results.forEach((suite) => {
        processSuite(suite, testResults);
      });
    }

    // Collect duration stats
    if (report.stats) {
      totalDuration += report.stats.duration || 0;
      testCount += report.stats.tests || 0;
    }
  });

  // Identify flaky and consistently failing tests
  const flakyTests = [];
  const consistentFailures = [];

  testResults.forEach((stats, testKey) => {
    const [suite, test] = testKey.split('::');
    if (stats.passed > 0 && stats.failed > 0) {
      // Flaky test (sometimes passes, sometimes fails)
      flakyTests.push({
        test,
        suite,
        passRate: stats.passRate,
        failures: stats.failed,
        passes: stats.passed,
      });
    } else if (stats.failed > 0 && stats.passed === 0) {
      // Consistently failing test
      consistentFailures.push(testKey);
    }
  });

  // Calculate overall pass rate
  let totalPassed = 0;
  let totalFailed = 0;
  testResults.forEach((stats) => {
    totalPassed += stats.passed;
    totalFailed += stats.failed;
  });

  const overallPassRate = totalPassed + totalFailed > 0
    ? (totalPassed / (totalPassed + totalFailed)) * 100
    : 100;

  return {
    totalRuns: files.length,
    totalTests: testResults.size,
    flakyTests,
    consistentFailures,
    passRate: overallPassRate,
    averageDuration: testCount > 0 ? totalDuration / testCount : 0,
    testStats: testResults,
  };
}

/**
 * Process a test suite recursively
 */
function processSuite(suite, testResults, parentSuite = '') {
  const suiteName = parentSuite ? `${parentSuite} > ${suite.title}` : suite.title;

  // Process tests in this suite
  if (suite.tests && Array.isArray(suite.tests)) {
    suite.tests.forEach((test) => {
      const testKey = `${suiteName}::${test.title}`;

      if (!testResults.has(testKey)) {
        testResults.set(testKey, {
          passed: 0,
          failed: 0,
          total: 0,
          passRate: 0,
        });
      }

      const stats = testResults.get(testKey);
      stats.total++;

      if (test.state === 'passed') {
        stats.passed++;
      } else if (test.state === 'failed') {
        stats.failed++;
      }

      stats.passRate = (stats.passed / stats.total) * 100;
    });
  }

  // Process nested suites
  if (suite.suites && Array.isArray(suite.suites)) {
    suite.suites.forEach((childSuite) => {
      processSuite(childSuite, testResults, suiteName);
    });
  }
}

/**
 * Generate HTML report
 */
function generateHTMLReport(report, outputPath) {
  const timestamp = new Date().toISOString();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Reliability Report - Black Trigram (흑괘)</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 20px;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: #e0e0e0;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: #2d2d2d;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    h1 {
      color: #00ffff;
      text-align: center;
      margin-bottom: 10px;
    }
    .subtitle {
      text-align: center;
      color: #ffd700;
      margin-bottom: 30px;
      font-size: 1.2em;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .metric {
      background: #1a1a1a;
      padding: 20px;
      border-radius: 8px;
      border: 2px solid #404040;
      text-align: center;
    }
    .metric-label {
      font-size: 0.9em;
      color: #999;
      margin-bottom: 10px;
    }
    .metric-value {
      font-size: 2em;
      font-weight: bold;
    }
    .metric-value.passed { color: #4caf50; }
    .metric-value.warning { color: #ff9800; }
    .metric-value.failed { color: #f44336; }
    .section {
      margin-bottom: 30px;
    }
    .section h2 {
      color: #00ffff;
      border-bottom: 2px solid #404040;
      padding-bottom: 10px;
    }
    .test-list {
      list-style: none;
      padding: 0;
    }
    .test-item {
      background: #1a1a1a;
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 5px;
      border-left: 4px solid #ff9800;
    }
    .test-item.consistent-fail {
      border-left-color: #f44336;
    }
    .test-name {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .test-stats {
      font-size: 0.9em;
      color: #999;
    }
    .timestamp {
      text-align: center;
      color: #666;
      margin-top: 30px;
      font-size: 0.9em;
    }
    .pass-badge {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.9em;
      font-weight: bold;
    }
    .pass-badge.excellent { background: #4caf50; color: white; }
    .pass-badge.good { background: #8bc34a; color: white; }
    .pass-badge.warning { background: #ff9800; color: white; }
    .pass-badge.poor { background: #f44336; color: white; }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #4caf50;
      font-size: 1.2em;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎮 Black Trigram (흑괘)</h1>
    <div class="subtitle">Test Reliability Report</div>

    <div class="metrics">
      <div class="metric">
        <div class="metric-label">Pass Rate</div>
        <div class="metric-value ${report.passRate === 100 ? 'passed' : report.passRate >= 95 ? 'warning' : 'failed'}">
          ${report.passRate.toFixed(2)}%
        </div>
      </div>

      <div class="metric">
        <div class="metric-label">Flaky Tests</div>
        <div class="metric-value ${report.flakyTests.length === 0 ? 'passed' : 'warning'}">
          ${report.flakyTests.length}
        </div>
      </div>

      <div class="metric">
        <div class="metric-label">Total Tests</div>
        <div class="metric-value">
          ${report.totalTests}
        </div>
      </div>

      <div class="metric">
        <div class="metric-label">Test Runs</div>
        <div class="metric-value">
          ${report.totalRuns}
        </div>
      </div>

      <div class="metric">
        <div class="metric-label">Avg Duration</div>
        <div class="metric-value">
          ${(report.averageDuration / 1000).toFixed(2)}s
        </div>
      </div>

      <div class="metric">
        <div class="metric-label">Consistent Failures</div>
        <div class="metric-value ${report.consistentFailures.length === 0 ? 'passed' : 'failed'}">
          ${report.consistentFailures.length}
        </div>
      </div>
    </div>

    ${report.flakyTests.length > 0 ? `
    <div class="section">
      <h2>⚠️ Flaky Tests Detected</h2>
      <ul class="test-list">
        ${report.flakyTests.map(test => `
          <li class="test-item">
            <div class="test-name">${test.test}</div>
            <div class="test-stats">
              Suite: ${test.suite}<br>
              Pass Rate: ${test.passRate.toFixed(2)}% (${test.passes} passes, ${test.failures} failures)
            </div>
          </li>
        `).join('')}
      </ul>
    </div>
    ` : `
    <div class="section">
      <div class="empty-state">
        ✅ No Flaky Tests Detected!<br>
        All tests passed consistently across ${report.totalRuns} run(s).
      </div>
    </div>
    `}

    ${report.consistentFailures.length > 0 ? `
    <div class="section">
      <h2>❌ Consistently Failing Tests</h2>
      <ul class="test-list">
        ${report.consistentFailures.map(testKey => `
          <li class="test-item consistent-fail">
            <div class="test-name">${testKey.split('::')[1]}</div>
            <div class="test-stats">Suite: ${testKey.split('::')[0]}</div>
          </li>
        `).join('')}
      </ul>
    </div>
    ` : ''}

    <div class="timestamp">
      Generated: ${timestamp}<br>
      흑괘의 테스트 안정성을 보장하라 - Guarantee Black Trigram's Test Stability
    </div>
  </div>
</body>
</html>
  `;

  fs.writeFileSync(outputPath, html);
  console.log(`✅ HTML report saved to: ${outputPath}`);
}

/**
 * Generate console report
 */
function generateConsoleReport(report) {
  console.log('\n' + '='.repeat(80));
  console.log('🎮 Black Trigram (흑괘) - Test Reliability Report');
  console.log('='.repeat(80));
  console.log(`\n📊 Summary:`);
  console.log(`  Total Test Runs:       ${report.totalRuns}`);
  console.log(`  Total Unique Tests:    ${report.totalTests}`);
  console.log(`  Overall Pass Rate:     ${report.passRate.toFixed(2)}%`);
  console.log(`  Average Test Duration: ${(report.averageDuration / 1000).toFixed(2)}s`);
  console.log(`  Flaky Tests:           ${report.flakyTests.length}`);
  console.log(`  Consistent Failures:   ${report.consistentFailures.length}`);

  if (report.flakyTests.length > 0) {
    console.log(`\n⚠️  Flaky Tests Detected:`);
    report.flakyTests.forEach((test) => {
      console.log(`  - ${test.test}`);
      console.log(`    Suite: ${test.suite}`);
      console.log(`    Pass Rate: ${test.passRate.toFixed(2)}% (${test.passes}/${test.passes + test.failures})`);
    });
  } else {
    console.log(`\n✅ No Flaky Tests - Excellent!`);
  }

  if (report.consistentFailures.length > 0) {
    console.log(`\n❌ Consistently Failing Tests:`);
    report.consistentFailures.forEach((testKey) => {
      console.log(`  - ${testKey}`);
    });
  }

  console.log('\n' + '='.repeat(80));

  // Exit with error if flaky tests or failures detected
  if (report.flakyTests.length > 0 || report.consistentFailures.length > 0) {
    console.log('❌ Test reliability check FAILED');
    process.exit(1);
  } else {
    console.log('✅ Test reliability check PASSED');
    process.exit(0);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🎮 Black Trigram (흑괘) - Test Reliability Report Generator\n');

  const report = parseReports(REPORTS_DIR);

  // Ensure output directory exists
  const outputDir = 'build/reports';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate reports
  const htmlPath = path.join(outputDir, 'test-reliability-report.html');
  generateHTMLReport(report, htmlPath);
  generateConsoleReport(report);
}

// Run the script
main();
