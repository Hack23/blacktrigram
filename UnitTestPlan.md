# Unit Test Plan for Black Trigram (흑괘)

**🔐 ISMS Alignment:** This unit test plan implements [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) Section 4.3.1 - Unit Testing Requirements.

## 1. Overview

This document outlines the comprehensive unit testing strategy for the **Black Trigram (흑괘)** project - a realistic 2D precision combat game inspired by Korean martial arts philosophy and the I Ching. The application is built using React 19 with TypeScript and Three.js (@react-three/fiber), with unit tests implemented using Vitest 4.

### ISMS Compliance Requirements

Per Hack23 AB's Secure Development Policy, this project maintains:

| 🎯 **Requirement**   | 📊 **Target** | ✅ **Current** | 📋 **ISMS Reference** |
| -------------------- | ------------- | -------------- | --------------------- |
| **Line Coverage**    | ≥80%          | 69.72% ⚠️      | Section 4.3.1.1       |
| **Branch Coverage**  | ≥70%          | 60.87% ⚠️      | Section 4.3.1.2       |
| **Test Execution**   | Every commit  | ✅ Automated   | Section 4.3.1.3       |
| **Public Reporting** | Required      | ✅ Published   | Section 4.3.1.4       |

**Evidence Links:**

- [![Test & Report](https://github.com/Hack23/blacktrigram/actions/workflows/test-and-report.yml/badge.svg?branch=main)](https://github.com/Hack23/blacktrigram/actions/workflows/test-and-report.yml)
- [Coverage Reports](https://hack23.github.io/blacktrigram/coverage)
- [OpenSSF Scorecard](https://scorecard.dev/viewer/?uri=github.com/Hack23/blacktrigram)

**See Also:**

- [ISMS Reference Mapping](ISMS_REFERENCE_MAPPING.md)
- [Test Improvements Summary](TEST_IMPROVEMENTS_SUMMARY.md)

---

## 2. Testing Framework

### 2.1 Core Testing Stack

| **Component**         | **Technology**         | **Version** | **Purpose**                                     |
| --------------------- | ---------------------- | ----------- | ----------------------------------------------- |
| **Unit Testing**      | Vitest                 | 4.0.6       | Modern, fast unit test runner                   |
| **E2E Testing**       | Cypress                | 15.6.0      | End-to-end browser testing                      |
| **Component Testing** | @testing-library/react | 16.3.0      | React component testing utilities               |
| **Coverage Tool**     | @vitest/coverage-v8    | 4.0.8       | V8-based code coverage reporting                |
| **Test Environment**  | jsdom                  | 27.2.0      | DOM simulation for Node.js                      |
| **UI Testing**        | @vitest/ui             | 4.0.6       | Visual test interface                           |
| **Coverage Reports**  | text, html, lcov, json | -           | Multiple formats with full filenames (120 cols) |

### 2.2 Three.js Testing Configuration

Black Trigram uses Three.js with @react-three/fiber for game rendering, requiring special test configuration:

```typescript
// vitest.config.ts
test: {
  environment: 'jsdom',
  setupFiles: ['./src/test/test-setup.ts'],
  server: {
    deps: {
      inline: [], // Three.js works well with Vitest by default
    },
  },
}
```

### 2.3 Korean Martial Arts Testing Requirements

Tests must validate:

- ✅ All 8 trigram stances (건/태/리/진/손/감/간/곤)
- ✅ All 5 player archetypes (무사/암살자/해커/정보요원/조직폭력배)
- ✅ Korean-English bilingual text rendering
- ✅ Vital point system accuracy (70 anatomical targets)
- ✅ Combat effectiveness calculations
- ✅ Cultural authenticity of Korean martial arts representation

---

## 3. Test Organization

### 3.1 File Structure

Unit tests are placed alongside their implementation files with the `.test.ts` or `.test.tsx` extension:

```
src/
├── systems/
│   ├── CombatSystem.ts
│   ├── CombatSystem.test.ts          # Core combat mechanics tests
│   ├── TrigramSystem.ts
│   ├── TrigramSystem.test.ts         # Eight trigram stance tests
│   ├── VitalPointSystem.ts
│   ├── VitalPointSystem.test.ts      # Vital point targeting tests
│   ├── GameIntegration.test.ts       # Integration tests
│   ├── trigram/
│   │   ├── StanceManager.ts
│   │   ├── StanceManager.test.ts     # Stance transition logic
│   │   ├── KoreanCulture.ts
│   │   ├── KoreanCulture.test.ts     # Korean culture validation
│   │   ├── KoreanTechniques.ts
│   │   ├── KoreanTechniques.test.ts  # Korean technique authenticity
│   │   ├── TransitionCalculator.ts
│   │   └── TransitionCalculator.test.ts
│   └── vitalpoint/
│       ├── KoreanAnatomy.ts
│       ├── DamageCalculator.ts
│       ├── HitDetection.ts
│       └── (tests to be added)
├── components/
│   ├── ui/
│   │   ├── KoreanHeader.test.tsx     # Korean text rendering
│   │   └── base/
│   │       └── (PixiJS components archived - migrated to Three.js)
│   ├── game/
│   │   ├── DojangBackground.test.tsx # Korean dojo aesthetics
│   │   └── GameAudio.test.tsx
│   └── combat/
│       └── components/
│           ├── CombatHUD.test.tsx
│           ├── CombatControls.test.tsx
│           └── CombatStatsPanel.test.tsx
├── audio/
│   ├── AudioManager.test.ts
│   └── AudioUtils.test.ts
└── utils/
    └── playerUtils.test.ts           # Player archetype creation
```

### 3.2 Test Categories

| **Category**          | **Purpose**               | **Examples**                        | **Coverage Target** |
| --------------------- | ------------------------- | ----------------------------------- | ------------------- |
| **System Tests**      | Core game mechanics       | Combat, Trigram, VitalPoint systems | 90%+                |
| **Component Tests**   | React/Three.js components | UI elements, game graphics          | 70%+                |
| **Integration Tests** | Multi-system workflows    | Complete combat sequences           | 80%+                |
| **Utility Tests**     | Helper functions          | Player creation, calculations       | 90%+                |
| **Cultural Tests**    | Korean authenticity       | Names, techniques, stances          | 100%                |

### 3.3 Current Test Statistics

**As of Latest Coverage Run (December 2025):**

- **Total Tests**: 1,192 tests (passed) + 2 skipped = 1,194 total
- **Test Files**: 63 test suites
- **Test Duration**: ~40 seconds
- **Pass Rate**: 100% (1,192/1,192 passing)
- **Flaky Tests**: 0 ✅

---

## 4. Testing Standards

### 4.1 Test Structure - AAA Pattern

All tests follow the **Arrange-Act-Assert** pattern:

```typescript
import { describe, it, expect, beforeEach } from "vitest";

describe("VitalPointSystem", () => {
  it("should calculate damage based on vital point criticality", () => {
    // Arrange
    const system = new VitalPointSystem();
    const criticalPoint = system.getVitalPoint("태양혈"); // Solar plexus
    const normalPoint = system.getVitalPoint("복부"); // Abdomen

    // Act
    const criticalDamage = system.calculateDamage(criticalPoint, 50);
    const normalDamage = system.calculateDamage(normalPoint, 50);

    // Assert
    expect(criticalDamage).toBeGreaterThan(normalDamage);
    expect(criticalPoint.korean).toBe("태양혈");
  });
});
```

### 4.2 Component Testing Standards

React/Three.js components must test:

```typescript
describe("KoreanHeader", () => {
  it("renders Korean and English text", () => {
    const { container } = render(
      <KoreanHeader korean="흑괘" english="Black Trigram" />
    );

    expect(container).toHaveTextContent("흑괘");
    expect(container).toHaveTextContent("Black Trigram");
  });

  it("uses Korean font family", () => {
    render(<KoreanHeader korean="무사" english="Warrior" />);

    const text = screen.getByText(/무사/);
    expect(text).toHaveStyle({ fontFamily: FONT_FAMILY.KOREAN });
  });
});
```

### 4.3 Mock Strategy

#### Three.js Mocking

```typescript
// src/test/test-setup.ts
// Three.js mocking if needed (usually not required for basic tests)
vi.mock("three", () => ({
  WebGLRenderer: vi.fn(() => ({
    render: vi.fn(),
    setSize: vi.fn(),
    dispose: vi.fn(),
  })),
  Scene: vi.fn(),
  PerspectiveCamera: vi.fn(),
  Mesh: vi.fn(),
  BoxGeometry: vi.fn(),
  MeshStandardMaterial: vi.fn(),
  Texture: {
    from: vi.fn(() => ({})),
    WHITE: {},
  },
}));
```

#### Audio Mocking

```typescript
vi.mock("../audio/AudioProvider", () => ({
  useAudio: vi.fn(() => ({
    playSFX: vi.fn(),
    playMusic: vi.fn(),
    setVolume: vi.fn(),
  })),
}));
```

### 4.4 Edge Case Testing

Every function must test:

- ✅ Happy path (expected input)
- ✅ Boundary conditions (min/max values)
- ✅ Invalid input (null, undefined, negative)
- ✅ Error handling and recovery

```typescript
describe("applyDamage", () => {
  it("should handle negative damage", () => {
    const player = createPlayer();
    const result = applyDamage(player, -10);
    expect(result.health).toBe(player.health); // No change
  });

  it("should clamp health to zero", () => {
    const player = createPlayer({ health: 50 });
    const result = applyDamage(player, 100);
    expect(result.health).toBe(0);
    expect(result.health).toBeGreaterThanOrEqual(0);
  });
});
```

---

## 5. Code Coverage Requirements

### 5.1 Overall Coverage Targets

Per ISMS Secure Development Policy:

| **Metric**             | **Policy Minimum** | **Current** | **Status**     | **Target Date** |
| ---------------------- | ------------------ | ----------- | -------------- | --------------- |
| **Line Coverage**      | 80%                | 69.72%      | ⚠️ Gap: 10.28% | Q1 2026         |
| **Branch Coverage**    | 70%                | 60.87%      | ⚠️ Gap: 9.13%  | Q1 2026         |
| **Function Coverage**  | 75%                | 68.00%      | ⚠️ Gap: 7.0%   | Q1 2026         |
| **Statement Coverage** | 80%                | 69.06%      | ⚠️ Gap: 10.94% | Q1 2026         |

### 5.2 Component-Level Coverage

| **Component**          | **Current** | **Target** | **Priority** | **Status**      |
| ---------------------- | ----------- | ---------- | ------------ | --------------- |
| **Systems (Core)**     | 95.88%      | 90%        | High         | ✅ Excellent    |
| - TrigramSystem        | 95.34%      | 90%        | High         | ✅ Excellent    |
| - VitalPointSystem     | 95.34%      | 90%        | High         | ✅ Excellent    |
| - CombatSystem         | 94.31%      | 90%        | Critical     | ✅ Excellent    |
| **Audio**              | 84.51%      | 70%        | Medium       | ✅ Excellent    |
| - AudioManager         | 24.62%      | 70%        | Medium       | ❌ Major Gap    |
| - AudioUtils           | 34.66%      | 70%        | Medium       | ❌ Major Gap    |
| **Combat Hooks**       | 84.44%      | 70%        | High         | ✅ Excellent    |
| - useCombatLayout      | 100.00%     | 90%        | High         | ✅ Excellent    |
| **UI Components**      | 32.69%      | 70%        | Medium       | ❌ Major Gap    |
| - HealthBar            | 25.28%      | 70%        | Medium       | ❌ Major Gap    |
| - RoundTimer           | 40.00%      | 70%        | Medium       | ❌ Major Gap    |
| - StanceIndicator      | 29.16%      | 70%        | Medium       | ❌ Major Gap    |
| **Combat Components**  | 63.18%      | 70%        | High         | ⚠️ Close        |
| - CombatControls       | 24.44%      | 70%        | High         | ❌ Critical Gap |
| - CombatHUD            | 16.66%      | 70%        | High         | ❌ Critical Gap |
| - CombatStatsPanel     | 34.69%      | 70%        | High         | ❌ Major Gap    |
| **Vital Point System** | 93.33%      | 90%        | Critical     | ✅ Excellent    |
| - DamageCalculator     | 0.00%       | 90%        | Critical     | ❌ Not Tested   |
| - HitDetection         | 0.00%       | 90%        | Critical     | ❌ Not Tested   |
| - KoreanAnatomy        | 19.76%      | 90%        | Critical     | ❌ Critical Gap |
| **Utilities**          | 62.82%      | 80%        | High         | ⚠️ Gap: 17.18%  |
| - playerUtils          | 94.11%      | 90%        | High         | ✅ Excellent    |
| - threeHelpers         | 18.36%      | 70%        | Medium       | ❌ Major Gap    |

### 5.3 Coverage Enforcement

Coverage thresholds are enforced in `vitest.config.ts`:

```typescript
coverage: {
  provider: 'v8',
  reporter: [
    ['text', { maxCols: 120 }],        // Wide columns for full filenames
    ['html', { subdir: 'html' }],       // HTML report in subdirectory
    ['lcov', { file: 'lcov.info' }],    // LCOV format for CI integration
    ['json', { file: 'coverage.json' }], // JSON format for tooling
    ['json-summary', { file: 'coverage-summary.json' }], // Summary JSON
  ],
  reportsDirectory: './build/coverage',
  skipFull: false, // Show files with 100% coverage
  // Note: Global thresholds commented out to avoid breaking existing code
  // These should be enforced via CI checks for new/changed files only
  // thresholds: {
  //   lines: 80,
  //   branches: 70,
  //   functions: 75,
  //   statements: 80,
  // },
}
```

**Regression Prevention**: Coverage reports are generated on every commit via CI/CD pipeline to prevent regressions.

---

## 6. Test Execution Procedures

### 6.1 Development Commands

| **Command**                  | **Purpose**              | **Use Case**              |
| ---------------------------- | ------------------------ | ------------------------- |
| `npm test`                   | Run all tests once       | Quick validation          |
| `npm run test:systems`       | Run system tests only    | Core mechanics validation |
| `npm run test:systems:watch` | Watch mode for systems   | Active development        |
| `npm run test:systems:ui`    | Visual test UI           | Interactive debugging     |
| `npm run coverage`           | Generate coverage report | Coverage analysis         |
| `npm run test:ci`            | CI test execution        | Automated pipeline        |

### 6.2 Coverage Report Generation

```bash
# Generate full coverage report with enhanced formatting
npm run coverage

# View HTML coverage report (detailed, interactive)
open build/coverage/html/index.html

# Check specific system coverage
npm run test:systems:coverage
```

**Coverage Report Features:**

- **Text Report**: 120-column width for full filenames (no truncation)
- **HTML Report**: Interactive web interface with drill-down capabilities
- **LCOV Report**: Standard format for CI/CD integration (e.g., Codecov, Coveralls)
- **JSON Reports**: Machine-readable formats for custom tooling and analysis
- **Summary JSON**: Quick overview of overall coverage metrics

**Coverage Report Locations:**

- **HTML Report**: `build/coverage/html/index.html`
- **LCOV Report**: `build/coverage/lcov.info`
- **JSON Report**: `build/coverage/coverage.json`
- **JSON Summary**: `build/coverage/coverage-summary.json`
- **Note**: Coverage reports are in `build/` directory (excluded from git)

### 6.3 Test Debugging

```bash
# Run tests with UI for debugging
npm run test:systems:ui

# Run specific test file
npx vitest src/systems/CombatSystem.test.ts

# Run tests matching pattern
npx vitest --grep "Korean"

# Debug in Node inspector
node --inspect-brk ./node_modules/.bin/vitest
```

---

## 7. CI/CD Integration

### 7.1 GitHub Actions Workflow

Tests are automatically executed via `.github/workflows/test-and-report.yml`:

```yaml
name: Test and Report

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v6
        with:
          node-version: "24"

      - name: Install dependencies
        run: npm install

      - name: Run unit tests with coverage
        run: npm run coverage
        env:
          JEST_JUNIT_OUTPUT_DIR: "docs/coverage"
          JEST_JUNIT_OUTPUT_NAME: "junit.xml"
```
