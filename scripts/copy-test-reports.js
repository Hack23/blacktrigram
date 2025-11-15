#!/usr/bin/env node

/**
 * Copy test reports from build/ to docs/ for GitHub Pages deployment
 * 
 * This script is automatically run during release builds by the CI/CD pipeline.
 * It should NOT be run during local development or PR work.
 * 
 * Purpose:
 * - Copies test artifacts (coverage, cypress reports, test results) from build/ to docs/
 * - Used exclusively in release.yml workflow after all tests have completed
 * - Ensures test reports are available on GitHub Pages without cluttering PR diffs
 * 
 * Behavior:
 * - In CI environments (CI=true or GITHUB_ACTIONS=true): Fails if build/ directory is missing
 * - In local environments: Silently skips if build/ directory is missing
 * 
 * Usage:
 *   npm run build:test-reports    # Run manually (not recommended)
 *   # Automatically called in release.yml workflow
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Remove a directory if it exists
 * @param {string} dir - Directory path to remove
 */
function removeDirectoryIfExists(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Recursively copy a directory with error handling
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 * @throws {Error} If copy operation fails
 */
function copyDir(src, dest) {
  try {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    // Read source directory
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        try {
          fs.copyFileSync(srcPath, destPath);
        } catch (error) {
          throw new Error(
            `Failed to copy file ${srcPath} to ${destPath}: ${error.message}`
          );
        }
      }
    }
  } catch (error) {
    if (error.message.startsWith("Failed to copy file")) {
      throw error;
    }
    throw new Error(`Failed to copy directory ${src} to ${dest}: ${error.message}`);
  }
}

/**
 * Main function to copy test reports
 */
function main() {
  log("📋 Copying test reports from build/ to docs/", colors.blue);

  const buildDir = path.join(__dirname, "..", "build");
  const docsDir = path.join(__dirname, "..", "docs");
  const isCI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";

  // Check if build directory exists
  if (!fs.existsSync(buildDir)) {
    const message = "build/ directory does not exist";
    if (isCI) {
      // In CI, missing test reports is an error
      log(`❌ Error: ${message}. Tests may not have been run.`, colors.red);
      process.exit(1);
    } else {
      // In local development, it's just a warning
      log(`⚠️  Warning: ${message}. Skipping.`, colors.yellow);
      return;
    }
  }

  // Ensure docs directory exists
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
    log("✓ Created docs/ directory", colors.green);
  }

  // Copy coverage reports
  const buildCoverage = path.join(buildDir, "coverage");
  const docsCoverage = path.join(docsDir, "coverage");
  if (fs.existsSync(buildCoverage)) {
    log("  → Copying coverage reports...", colors.blue);
    removeDirectoryIfExists(docsCoverage);
    copyDir(buildCoverage, docsCoverage);
    log("  ✓ Coverage reports copied", colors.green);
  } else {
    log("  ⊗ No coverage reports found", colors.yellow);
  }

  // Copy cypress reports
  const buildCypress = path.join(buildDir, "cypress");
  const docsCypress = path.join(docsDir, "cypress");
  if (fs.existsSync(buildCypress)) {
    log("  → Copying Cypress reports...", colors.blue);
    removeDirectoryIfExists(docsCypress);
    copyDir(buildCypress, docsCypress);
    log("  ✓ Cypress reports copied", colors.green);
  } else {
    log("  ⊗ No Cypress reports found", colors.yellow);
  }

  // Copy test results
  const buildTestResults = path.join(buildDir, "test-results");
  const docsTestResults = path.join(docsDir, "test-results");
  if (fs.existsSync(buildTestResults)) {
    log("  → Copying test results...", colors.blue);
    removeDirectoryIfExists(docsTestResults);
    copyDir(buildTestResults, docsTestResults);
    log("  ✓ Test results copied", colors.green);
  } else {
    log("  ⊗ No test results found", colors.yellow);
  }

  log("✅ Test reports copy complete!", colors.green);
}

// Run the script
try {
  main();
} catch (error) {
  log(`❌ Error copying test reports: ${error.message}`, colors.red);
  process.exit(1);
}
