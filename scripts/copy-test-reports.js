#!/usr/bin/env node

/**
 * Copy test reports from build/ to docs/ for GitHub Pages deployment
 * This script is only run during release builds
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
 * Recursively copy a directory
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 */
function copyDir(src, dest) {
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
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Main function to copy test reports
 */
function main() {
  log("📋 Copying test reports from build/ to docs/", colors.blue);

  const buildDir = path.join(__dirname, "..", "build");
  const docsDir = path.join(__dirname, "..", "docs");

  // Check if build directory exists
  if (!fs.existsSync(buildDir)) {
    log("⚠️  Warning: build/ directory does not exist. Skipping.", colors.yellow);
    return;
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
    // Remove old coverage reports if they exist
    if (fs.existsSync(docsCoverage)) {
      fs.rmSync(docsCoverage, { recursive: true, force: true });
    }
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
    // Remove old cypress reports if they exist
    if (fs.existsSync(docsCypress)) {
      fs.rmSync(docsCypress, { recursive: true, force: true });
    }
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
    // Remove old test results if they exist
    if (fs.existsSync(docsTestResults)) {
      fs.rmSync(docsTestResults, { recursive: true, force: true });
    }
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
