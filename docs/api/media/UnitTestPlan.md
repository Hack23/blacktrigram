# Unit Test Plan for Black Trigram (흑괘)

**🔐 ISMS Alignment:** This unit test plan implements [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) Section 4.3.1 - Unit Testing Requirements.

## 1. Overview

This document outlines the comprehensive unit testing strategy for the **Black Trigram (흑괘)** project - a realistic 2D precision combat game inspired by Korean martial arts philosophy and the I Ching. The application is built using React 19 with TypeScript and Three.js (@react-three/fiber), with unit tests implemented using Vitest 4.

### ISMS Compliance Requirements

Per Hack23 AB's Secure Development Policy, this project maintains:

| 🎯 **Requirement**   | 📊 **Target** | ✅ **Current** | 📋 **ISMS Reference** |
| -------------------- | ------------- | -------------- | --------------------- |
| **Line Coverage**    | ≥80%          | 49.90% ⚠️      | Section 4.3.1.1       |
| **Branch Coverage**  | ≥70%          | 47.65% ⚠️      | Section 4.3.1.2       |
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

| **Component**         | **Technology**         | **Version** | **Purpose**                       |
| --------------------- | ---------------------- | ----------- | --------------------------------- |
| **Unit Testing**      | Vitest                 | 4.0.6       | Modern, fast unit test runner     |
| **E2E Testing**       | Cypress                | 15.6.0      | End-to-end browser testing        |
| **Component Testing** | @testing-library/react | 16.3.0      | React component testing utilities |
| **Coverage Tool**     | @vitest/coverage-v8    | 4.0.8       | V8-based code coverage reporting  |
| **Test Environment**  | jsdom                  | 27.2.0      | DOM simulation for Node.js        |
| **UI Testing**        | @vitest/ui             | 4.0.6       | Visual test interface             |

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

| **Category**          | **Purpose**             | **Examples**                        | **Coverage Target** |
| --------------------- | ----------------------- | ----------------------------------- | ------------------- |
| **System Tests**      | Core game mechanics     | Combat, Trigram, VitalPoint systems | 90%+                |
| **Component Tests**   | React/PixiJS components | UI elements, game graphics          | 70%+                |
| **Integration Tests** | Multi-system workflows  | Complete combat sequences           | 80%+                |
| **Utility Tests**     | Helper functions        | Player creation, calculations       | 90%+                |
| **Cultural Tests**    | Korean authenticity     | Names, techniques, stances          | 100%                |

### 3.3 Current Test Statistics

**As of Latest Coverage Run:**

- **Total Tests**: 229 tests
- **Test Files**: 19 test suites
- **Test Duration**: ~14.73 seconds
- **Pass Rate**: 100% (229/229 passing)
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
| **Line Coverage**      | 80%                | 49.90%      | ⚠️ Gap: 30.1%  | Q2 2025         |
| **Branch Coverage**    | 70%                | 47.65%      | ⚠️ Gap: 22.35% | Q2 2025         |
| **Function Coverage**  | 75%                | 50.88%      | ⚠️ Gap: 24.12% | Q2 2025         |
| **Statement Coverage** | 80%                | 49.56%      | ⚠️ Gap: 30.44% | Q2 2025         |

### 5.2 Component-Level Coverage

| **Component**          | **Current** | **Target** | **Priority** | **Status**      |
| ---------------------- | ----------- | ---------- | ------------ | --------------- |
| **Systems (Core)**     | 79.85%      | 90%        | High         | ⚠️ Close        |
| - TrigramSystem        | 95.34%      | 90%        | High         | ✅ Excellent    |
| - VitalPointSystem     | 95.34%      | 90%        | High         | ✅ Excellent    |
| - CombatSystem         | 43.90%      | 90%        | Critical     | ❌ Major Gap    |
| **Audio**              | 30.23%      | 70%        | Medium       | ❌ Major Gap    |
| - AudioManager         | 24.62%      | 70%        | Medium       | ❌ Major Gap    |
| - AudioUtils           | 34.66%      | 70%        | Medium       | ❌ Major Gap    |
| **UI Components**      | 32.69%      | 70%        | Medium       | ❌ Major Gap    |
| - HealthBar            | 25.28%      | 70%        | Medium       | ❌ Major Gap    |
| - RoundTimer           | 40.00%      | 70%        | Medium       | ❌ Major Gap    |
| - StanceIndicator      | 29.16%      | 70%        | Medium       | ❌ Major Gap    |
| **Combat Components**  | 23.96%      | 70%        | High         | ❌ Critical Gap |
| - CombatControls       | 24.44%      | 70%        | High         | ❌ Critical Gap |
| - CombatHUD            | 16.66%      | 70%        | High         | ❌ Critical Gap |
| - CombatStatsPanel     | 34.69%      | 70%        | High         | ❌ Major Gap    |
| **Vital Point System** | 15.89%      | 90%        | Critical     | ❌ Critical Gap |
| - DamageCalculator     | 0.00%       | 90%        | Critical     | ❌ Not Tested   |
| - HitDetection         | 0.00%       | 90%        | Critical     | ❌ Not Tested   |
| - KoreanAnatomy        | 19.76%      | 90%        | Critical     | ❌ Critical Gap |
| **Utilities**          | 50.00%      | 80%        | High         | ⚠️ Major Gap    |
| - playerUtils          | 94.11%      | 90%        | High         | ✅ Excellent    |
| - threeHelpers         | 18.36%      | 70%        | Medium       | ❌ Major Gap    |

### 5.3 Coverage Enforcement

Coverage thresholds are enforced in `vitest.config.ts`:

```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'html', 'lcov', 'json'],
  reportsDirectory: './docs/coverage',
  // Note: Thresholds to be added when baseline improves
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
# Generate full coverage report
npm run coverage

# View HTML coverage report
open docs/coverage/index.html

# Check specific system coverage
npm run test:systems:coverage
```

**Coverage Report Locations:**

- **HTML Report**: `docs/coverage/index.html`
- **LCOV Report**: `docs/coverage/lcov.info`
- **JSON Summary**: `docs/coverage/coverage-final.json`
- **Published**: https://hack23.github.io/blacktrigram/coverage

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

### 7.2 Automated Quality Gates

| **Gate**                 | **Requirement** | **Current**    | **Status**         |
| ------------------------ | --------------- | -------------- | ------------------ |
| **All Tests Pass**       | 100%            | 100% (229/229) | ✅ Pass            |
| **Build Success**        | Required        | ✅ Passing     | ✅ Pass            |
| **No TypeScript Errors** | Required        | ✅ Clean       | ✅ Pass            |
| **ESLint Clean**         | Required        | ✅ Clean       | ✅ Pass            |
| **Coverage > 80%**       | Required        | ⚠️ 49.90%      | ❌ Below Threshold |

### 7.3 Pull Request Requirements

All PRs must:

- ✅ Pass all existing tests (229/229)
- ✅ Include tests for new features
- ✅ Not decrease overall coverage
- ✅ Pass TypeScript compilation
- ✅ Pass ESLint checks
- ✅ Validate Korean text rendering (if applicable)
- ✅ Test all affected player archetypes

### 7.4 Coverage Reporting

Coverage reports are:

1. Generated on every commit
2. Published to GitHub Pages (`docs/coverage/`)
3. Tracked historically for regression prevention
4. Reviewed during code review process

---

## 8. Current Status & Improvement Roadmap

### 8.1 Recent Achievements ✅

**November 2024 Test Improvements:**

- ✅ Increased test count by 77% (129 → 229 tests)
- ✅ Achieved 95%+ coverage on VitalPointSystem
- ✅ Achieved 94%+ coverage on playerUtils
- ✅ Added comprehensive integration tests (19 tests)
- ✅ Validated all 5 player archetypes
- ✅ Validated all 8 trigram stances
- ✅ Zero flaky tests maintained
- ✅ 100% test pass rate achieved

### 8.2 Critical Coverage Gaps

#### Priority 1: Critical Systems (Q1 2025)

| **System**                 | **Current** | **Gap** | **Tests Needed** |
| -------------------------- | ----------- | ------- | ---------------- |
| **CombatSystem**           | 43.90%      | 46.1%   | ~40 tests        |
| **Vital Point Subsystems** | 15.89%      | 74.11%  | ~60 tests        |
| - DamageCalculator         | 0%          | 90%     | ~20 tests        |
| - HitDetection             | 0%          | 90%     | ~20 tests        |
| - KoreanAnatomy            | 19.76%      | 70.24%  | ~20 tests        |

**Impact**: These are core combat mechanics; low coverage represents security and quality risk.

#### Priority 2: UI Components (Q2 2025)

| **Component**         | **Current** | **Gap** | **Tests Needed** |
| --------------------- | ----------- | ------- | ---------------- |
| **Combat UI**         | 23.96%      | 46.04%  | ~30 tests        |
| **PixiJS Components** | 32.69%      | 37.31%  | ~25 tests        |
| **Game Components**   | 46.66%      | 23.34%  | ~15 tests        |

**Impact**: UI bugs affect user experience and game playability.

#### Priority 3: Audio System (Q2 2025)

| **Component**    | **Current** | **Gap** | **Tests Needed** |
| ---------------- | ----------- | ------- | ---------------- |
| **AudioManager** | 24.62%      | 45.38%  | ~25 tests        |
| **AudioUtils**   | 34.66%      | 35.34%  | ~20 tests        |

**Impact**: Audio enhances immersion; moderate priority for gameplay.

### 8.3 Improvement Roadmap

#### Phase 1: Critical Systems (Q1 2025)

**Target**: Bring core combat systems to 80%+ coverage

- [ ] **CombatSystem** (43.90% → 90%)

  - [ ] Attack resolution tests (15 tests)
  - [ ] Defense mechanics tests (10 tests)
  - [ ] Technique execution tests (15 tests)
  - [ ] Status effect tests (10 tests)

- [ ] **Vital Point Subsystems** (15.89% → 90%)
  - [ ] DamageCalculator complete suite (20 tests)
  - [ ] HitDetection complete suite (20 tests)
  - [ ] KoreanAnatomy validation (20 tests)
  - [ ] Integration with CombatSystem (10 tests)

**Expected Outcome**: Overall coverage 60%+ by end of Q1 2025

#### Phase 2: UI & Components (Q2 2025)

**Target**: Bring UI components to 70%+ coverage

- [ ] **Combat UI Components** (23.96% → 70%)

  - [ ] CombatControls interaction tests (20 tests)
  - [ ] CombatHUD rendering tests (15 tests)
  - [ ] CombatStatsPanel update tests (10 tests)

- [x] **PixiJS Components** (ARCHIVED - Migrated to Three.js)
  - [x] ResponsivePixiComponents removed (replaced with Three.js Html overlays)
  - [ ] Korean theming validation (10 tests) - migrated to Three.js components
  - [ ] Layout system integration (10 tests) - using standard CSS layouts

**Expected Outcome**: Overall coverage 70%+ by end of Q2 2025

#### Phase 3: Audio & Polish (Q3 2025)

**Target**: Achieve ISMS compliance (80%+ overall)

- [ ] **Audio System** (30.23% → 70%)

  - [ ] AudioManager lifecycle tests (15 tests)
  - [ ] Sound effect triggering tests (10 tests)
  - [ ] Music state management tests (10 tests)
  - [ ] Korean audio integration tests (10 tests)

- [ ] **Remaining Utilities** (50% → 80%)
  - [ ] threeHelpers validation (15 tests)
  - [ ] Edge case coverage (10 tests)

**Expected Outcome**: 80%+ overall coverage, ISMS compliance achieved

### 8.4 Metrics Tracking

Progress is tracked via:

- **Weekly Coverage Reports**: Generated by CI/CD
- **Monthly Test Reviews**: Coverage trend analysis
- **Quarterly ISMS Audits**: Compliance validation
- **Coverage Badges**: Real-time status in README.md

**Dashboard**: https://hack23.github.io/blacktrigram/coverage

---

## 9. Korean Martial Arts Testing Patterns

### 9.1 Cultural Authenticity Testing

All Korean elements must be tested for authenticity:

```typescript
describe("Korean Cultural Elements", () => {
  it("should use correct Korean martial arts terminology", () => {
    const stances = getAllStances();

    expect(stances[0].korean).toBe("건"); // Geon (Heaven)
    expect(stances[1].korean).toBe("태"); // Tae (Lake)
    expect(stances[2].korean).toBe("리"); // Li (Fire)
    // ... all 8 stances
  });

  it("should provide bilingual descriptions", () => {
    const technique = getKoreanTechnique("천둥벽력");

    expect(technique.korean).toBe("천둥벽력");
    expect(technique.english).toBe("Thunder Strike");
    expect(technique.description).toContain("Korean");
  });
});
```

### 9.2 Player Archetype Testing

All 5 player archetypes must be validated:

```typescript
describe("Player Archetypes", () => {
  const archetypes = [
    PlayerArchetype.MUSA, // 무사 - Warrior
    PlayerArchetype.AMSALJA, // 암살자 - Assassin
    PlayerArchetype.HACKER, // 해커 - Hacker
    PlayerArchetype.JEONGBO_YOWON, // 정보요원 - Intelligence
    PlayerArchetype.JOJIK_POKRYEOKBAE, // 조직폭력배 - Organized Crime
  ];

  archetypes.forEach((archetype) => {
    it(`should create ${archetype} with Korean name`, () => {
      const player = createPlayerFromArchetype(archetype, 0);

      expect(player.archetype).toBe(archetype);
      expect(player.koreanName).toBeTruthy();
      expect(player.koreanName).toMatch(/^[\uAC00-\uD7AF]+$/); // Korean characters
    });
  });
});
```

### 9.3 Eight Trigram Stance Testing

All 8 trigram stances from the I Ching must be tested:

```typescript
describe("Eight Trigram Stances", () => {
  const stances = [
    TrigramStance.GEON, // ☰ 건 (Heaven)
    TrigramStance.TAE, // ☱ 태 (Lake)
    TrigramStance.LI, // ☲ 리 (Fire)
    TrigramStance.JIN, // ☳ 진 (Thunder)
    TrigramStance.SON, // ☴ 손 (Wind)
    TrigramStance.GAM, // ☵ 감 (Water)
    TrigramStance.GAN, // ☶ 간 (Mountain)
    TrigramStance.GON, // ☷ 곤 (Earth)
  ];

  stances.forEach((stance) => {
    it(`should calculate effectiveness for ${stance} stance`, () => {
      const system = new TrigramSystem();
      const effectiveness = system.calculateStanceEffectiveness(stance);

      expect(effectiveness).toBeGreaterThan(0);
      expect(effectiveness).toBeLessThanOrEqual(2.0);
    });
  });
});
```

### 9.4 Vital Point System Testing

Korean anatomical vital points (급소) must be validated:

```typescript
describe("Korean Vital Points", () => {
  it("should include traditional Korean vital point names", () => {
    const system = new VitalPointSystem();
    const vitalPoints = system.getAllVitalPoints();

    const koreanPoints = [
      "태양혈", // Solar plexus
      "경동맥", // Carotid artery
      "명치", // Xiphoid process
      "금강", // Groin
      "인중", // Philtrum
      // ... all 70 vital points
    ];

    koreanPoints.forEach((koreanName) => {
      const point = vitalPoints.find((p) => p.korean === koreanName);
      expect(point).toBeDefined();
      expect(point?.korean).toBe(koreanName);
      expect(point?.english).toBeTruthy();
    });
  });

  it("should calculate damage based on vital point criticality", () => {
    const system = new VitalPointSystem();

    const headStrike = system.calculateDamage("태양혈", 50);
    const bodyStrike = system.calculateDamage("복부", 50);

    expect(headStrike).toBeGreaterThan(bodyStrike);
  });
});
```

---

## 10. Areas Requiring Coverage Improvements

### 10.1 Critical Gaps Analysis

Based on latest coverage report, the following areas require immediate attention:

#### **Vital Point System (15.89% → 90% target)**

**Uncovered Files:**

- `DamageCalculator.ts` (0% coverage) - 151 lines uncovered
- `HitDetection.ts` (0% coverage) - 95 lines uncovered
- `KoreanAnatomy.ts` (19.76% coverage) - 494 lines uncovered
- `KoreanVitalPoints.ts` (36.84% coverage) - 181 lines uncovered

**Required Tests:**

```typescript
// DamageCalculator.ts - 20 tests needed
- Calculate base damage for each vital point
- Apply distance modifiers
- Apply stance modifiers
- Apply archetype modifiers
- Critical hit calculation
- Damage over time effects

// HitDetection.ts - 20 tests needed
- Point-in-hitbox detection
- Distance from vital point
- Accuracy calculation
- Miss detection
- Glancing blow detection
- Perfect hit detection

// KoreanAnatomy.ts - 20 tests needed
- All 70 vital point definitions
- Anatomical region mapping
- Criticality levels
- Korean name validation
- Bilingual descriptions
- Anatomical accuracy
```

#### **Combat System (43.90% → 90% target)**

**Uncovered Areas (Lines 122-443, 479-495):**

- Advanced combat mechanics
- Multi-round combat
- Status effect application
- Technique chaining
- Combo system
- Guard breaking
- Counter attacks

**Required Tests:**

```typescript
// CombatSystem.ts - 40 tests needed
- Complete attack sequences (10 tests)
- Defense and blocking (8 tests)
- Technique execution (10 tests)
- Status effects (8 tests)
- Resource management (4 tests)
```

#### **Combat UI Components (23.96% → 70% target)**

**Uncovered Components:**

- `CombatControls.tsx` (24.44% coverage) - Lines 62-152, 163-521
- `CombatHUD.tsx` (16.66% coverage) - Lines 65-97, 173-468
- `CombatStatsPanel.tsx` (34.69% coverage) - Lines 79-113, 235-248

**Required Tests:**

```typescript
// CombatControls.tsx - 20 tests
- Button interactions
- Stance selection
- Technique activation
- Guard toggling
- Keyboard controls
- Mobile touch controls

// CombatHUD.tsx - 15 tests
- Health bar updates
- Ki bar updates
- Timer display
- Status effects display
- Round indicator
- Korean text rendering

// CombatStatsPanel.tsx - 10 tests
- Stat display updates
- Damage tracking
- Technique history
- Bilingual text
```

#### **Audio System (30.23% → 70% target)**

**Uncovered Areas:**

- `AudioManager.ts` (24.62% coverage) - Lines 70-143, 191-259, 281-298
- `AudioUtils.ts` (34.66% coverage) - Lines 24-42, 104-107, 119-274

**Required Tests:**

```typescript
// AudioManager.ts - 25 tests
- Sound effect triggering
- Music playback control
- Volume management
- Audio state persistence
- Korean audio integration
- Spatial audio positioning

// AudioUtils.ts - 20 tests
- Audio file loading
- Format conversion
- Volume calculations
- Fade in/out effects
- Korean audio naming
```

### 10.2 Coverage Improvement Strategy

**Step 1: Focus on High-Impact Areas**

1. VitalPointSystem (critical for gameplay) - Q1 2025
2. CombatSystem (core mechanics) - Q1 2025
3. Combat UI (user experience) - Q2 2025

**Step 2: Incremental Progress**

- Add 10-15 tests per week
- Review coverage reports weekly
- Adjust priorities based on development

**Step 3: Maintain Quality**

- All new code must include tests
- No PR merges that decrease coverage
- Regular test review and refactoring

### 10.3 Test Development Estimates

| **Component**    | **Tests Needed** | **Estimated Hours** | **Target Quarter** |
| ---------------- | ---------------- | ------------------- | ------------------ |
| VitalPointSystem | 60 tests         | 40 hours            | Q1 2025            |
| CombatSystem     | 40 tests         | 30 hours            | Q1 2025            |
| Combat UI        | 45 tests         | 35 hours            | Q2 2025            |
| Audio System     | 45 tests         | 30 hours            | Q3 2025            |
| **Total**        | **190 tests**    | **135 hours**       | **2025**           |

---

## 11. Quality Assurance Standards

### 11.1 Test Quality Checklist

Every test must:

- [ ] Follow AAA pattern (Arrange-Act-Assert)
- [ ] Have descriptive test names
- [ ] Test one specific behavior
- [ ] Be independent and isolated
- [ ] Be deterministic (no random failures)
- [ ] Clean up resources (no side effects)
- [ ] Run in < 100ms (unit tests)
- [ ] Include Korean text validation (if applicable)

### 11.2 Code Review Requirements

Before merging:

- [ ] All tests pass locally
- [ ] Coverage does not decrease
- [ ] New features have tests
- [ ] Bug fixes have regression tests
- [ ] Korean cultural elements validated
- [ ] TypeScript compilation clean
- [ ] ESLint checks pass

### 11.3 Test Maintenance

**Monthly Activities:**

- Review and update deprecated test patterns
- Remove flaky tests or fix root cause
- Refactor brittle tests
- Update mocks to match latest APIs
- Validate Korean text still renders correctly

**Quarterly Activities:**

- Comprehensive test suite review
- Coverage gap analysis
- Test performance optimization
- Documentation updates

---

## 12. Resources & References

### 12.1 Documentation

- [Test Improvements Summary](TEST_IMPROVEMENTS_SUMMARY.md) - Recent test enhancements
- [ISMS Reference Mapping](ISMS_REFERENCE_MAPPING.md) - Compliance mapping
- [Architecture Documentation](ARCHITECTURE.md) - System architecture
- [Combat Architecture](COMBAT_ARCHITECTURE.md) - Combat system design
- [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) - ISMS policy

### 12.2 Coverage Reports

- **HTML Report**: [docs/coverage/index.html](https://hack23.github.io/blacktrigram/coverage)
- **LCOV Report**: `docs/coverage/lcov.info`
- **JSON Summary**: `docs/coverage/coverage-final.json`

### 12.3 CI/CD Pipeline

- [Test & Report Workflow](.github/workflows/test-and-report.yml)
- [CodeQL Analysis](.github/workflows/codeql.yml)
- [Security Scorecard](.github/workflows/scorecards.yml)

### 12.4 External Links

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [OpenSSF Best Practices](https://www.bestpractices.dev/en/projects/10777)

---

## 13. Compliance & Audit Trail

### 13.1 ISMS Compliance Status

| **Control**          | **Requirement**                | **Status**     | **Evidence**        |
| -------------------- | ------------------------------ | -------------- | ------------------- |
| **ISO 27001 A.8.9**  | Software development lifecycle | ✅ Implemented | This document       |
| **NIST CSF PR.IP-1** | Configuration baseline         | ✅ Maintained  | vitest.config.ts    |
| **CIS Controls 2.1** | Software inventory             | ✅ Current     | package.json        |
| **Section 4.3.1.1**  | Line coverage ≥80%             | ⚠️ In Progress | 49.90% current      |
| **Section 4.3.1.2**  | Branch coverage ≥70%           | ⚠️ In Progress | 47.65% current      |
| **Section 4.3.1.3**  | Automated execution            | ✅ Implemented | test-and-report.yml |
| **Section 4.3.1.4**  | Public reporting               | ✅ Published   | GitHub Pages        |

### 13.2 Audit History

| **Date**   | **Auditor**      | **Finding**           | **Action**              | **Status**       |
| ---------- | ---------------- | --------------------- | ----------------------- | ---------------- |
| 2024-11-06 | Development Team | Test coverage 45%     | Increase by 77% tests   | ✅ Complete      |
| 2024-11-14 | ISMS Review      | Coverage below 80%    | Create improvement plan | ✅ This Document |
| 2025-Q1    | Planned          | Coverage validation   | Achieve 60%+            | 📅 Scheduled     |
| 2025-Q2    | Planned          | Coverage validation   | Achieve 70%+            | 📅 Scheduled     |
| 2025-Q3    | Planned          | ISMS compliance audit | Achieve 80%+            | 📅 Scheduled     |

### 13.3 Change History

| **Version** | **Date**   | **Author**       | **Changes**                         |
| ----------- | ---------- | ---------------- | ----------------------------------- |
| 1.0.0       | 2024-11-14 | Development Team | Initial comprehensive documentation |

---

## 14. Success Metrics

### 14.1 Key Performance Indicators

| **KPI**              | **Current** | **Q1 2025** | **Q2 2025** | **Q3 2025** | **Target** |
| -------------------- | ----------- | ----------- | ----------- | ----------- | ---------- |
| **Overall Coverage** | 49.90%      | 60%         | 70%         | 80%         | 80%+       |
| **Total Tests**      | 229         | 300+        | 400+        | 500+        | 500+       |
| **Test Pass Rate**   | 100%        | 100%        | 100%        | 100%        | 100%       |
| **Flaky Tests**      | 0           | 0           | 0           | 0           | 0          |
| **Test Duration**    | 14.73s      | <20s        | <25s        | <30s        | <30s       |
| **Critical Systems** | 79.85%      | 90%         | 90%         | 90%         | 90%+       |

### 14.2 Quality Goals

- ✅ Zero flaky tests maintained
- ✅ 100% test pass rate
- ✅ All PRs include tests
- ⚠️ Coverage increases monthly
- ⚠️ No coverage regressions
- ✅ Korean authenticity validated

### 14.3 Compliance Goals

- ⚠️ Achieve 80% line coverage by Q3 2025
- ⚠️ Achieve 70% branch coverage by Q3 2025
- ✅ Maintain automated testing on every commit
- ✅ Publish coverage reports publicly
- ✅ Document test strategy comprehensively

---

## 15. Contact & Support

### 15.1 Development Team

- **Project Lead**: James Pether Sörling
- **Repository**: https://github.com/Hack23/blacktrigram
- **Issues**: https://github.com/Hack23/blacktrigram/issues

### 15.2 ISMS Compliance

- **ISMS Policy**: https://github.com/Hack23/ISMS-PUBLIC
- **Secure Development**: https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md

### 15.3 Community

- **Discussions**: https://github.com/Hack23/blacktrigram/discussions
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Code of Conduct**: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

---

_Last Updated: November 14, 2024_  
_Document Version: 1.0.0_  
_ISMS Compliance: In Progress_  
_Next Review: Q1 2025_
