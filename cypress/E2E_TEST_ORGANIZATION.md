# E2E Test Organization Guide

## 📋 Overview

This guide documents the organization and structure of E2E tests in the Black Trigram project, including shared utilities and best practices.

## 🗂️ Test Structure

### Directory Organization

```
cypress/e2e/
├── screens/              # Screen-level integration tests (7 files)
│   ├── intro-screen.cy.ts         (313 lines) - Menu, navigation, UI
│   ├── combat-screen.cy.ts        (387 lines) - Combat mechanics overview
│   ├── training-screen.cy.ts      (285 lines) - Training systems
│   ├── controls-screen.cy.ts      (256 lines) - Controls display
│   ├── philosophy-screen.cy.ts    (301 lines) - Philosophy content
│   ├── end-screen.cy.ts           (357 lines) - End game screen
│   └── trauma-visualization.cy.ts (204 lines) - Injury visualization
│
├── combat/               # Combat system-specific tests (3 files)
│   ├── balance-system.cy.ts       (377 lines) - Balance mechanics
│   ├── breathing-disruption.cy.ts (289 lines) - Breathing system
│   └── injury-movement.cy.ts      (267 lines) - Movement penalties
│
├── performance/          # Performance tests (1 file)
│   └── mobile-performance.cy.ts   (99 lines) - Mobile optimization
│
└── character-models.cy.ts (495 lines) - Visual regression tests
```

**Total: 12 test files, 3,630 lines**

## 🛠️ Shared Test Helpers

### Location
`cypress/support/test-helpers.ts`

### Categories of Helpers

#### 1. Setup/Teardown Helpers
- `setupScreen(screenType?)` - Standard setup for screen tests
- `teardownScreen()` - Standard teardown
- `getScreenShortcutKey(screen)` - Get keyboard shortcuts

#### 2. Canvas/WebGL Verification
- `verifyCanvasVisible()` - Basic canvas verification
- `verifyCanvasWithDimensions(minWidth, minHeight)` - Canvas with size check
- `verifyActiveWebGLRendering()` - Verify active Three.js rendering

#### 3. Combat Test Utilities
- `verifyCombatScreenReady()` - Verify combat initialization
- `executeCombatAttacks(count, delayMs)` - Execute attack sequence
- `verifyCombatHUD()` - Verify HUD elements

#### 4. Stance Testing Helpers
- `testAllTrigramStances(callback?)` - Test all 8 stances
- `changeStance(stanceNumber, stanceName?)` - Switch to specific stance
- `executeRapidStanceChanges(stances, delayMs)` - Rapid stance testing

#### 5. Bilingual Text Verification
- `verifyKoreanTextPresent(expectedTexts?)` - Verify Korean text
- `verifyBilingualText(korean, english)` - Verify Korean/English pair
- `verifyEnglishTextPresent(expectedText)` - Verify English text

#### 6. Common Assertions
- `verifyScreenElement(testId, shouldBeVisible)` - Element verification
- `verifyElementConditional(testId, fallbackMsg)` - Conditional verification
- `waitForTransition(durationMs)` - Wait for animations
- `verifyMultipleElements(testIds)` - Batch verification

#### 7. Training Test Utilities
- `verifyTrainingScreenReady()` - Verify training initialization
- `practiceStanceWithVerification(stanceNum, reps)` - Practice with logging

#### 8. Performance Test Utilities
- `verifyFPSRange(minFPS, maxFPS)` - FPS verification
- `verifyResponsiveViewport(width, height)` - Responsive testing

#### 9. Navigation Test Utilities
- `testNavigationRoundTrip(screen, buttonId, menuId, key)` - Round-trip navigation
- `testKeyboardShortcut(key, screen, testId)` - Keyboard shortcut testing
- `executeGameActions(actions, delayMs)` - Action sequence execution

## 📝 Usage Examples

### Example 1: Basic Screen Test Setup

```typescript
import { setupScreen, teardownScreen, verifyCanvasVisible } from "../../support/test-helpers";

describe("MyScreen Test", () => {
  beforeEach(() => {
    setupScreen('combat'); // or 'training', 'controls', etc.
  });

  afterEach(() => {
    teardownScreen();
  });

  it("should render correctly", () => {
    verifyCanvasVisible();
    // ... test logic
  });
});
```

### Example 2: Combat Test with Stance Changes

```typescript
import {
  setupScreen,
  teardownScreen,
  verifyCombatScreenReady,
  changeStance,
  executeCombatAttacks
} from "../../support/test-helpers";

describe("Combat Mechanics", () => {
  beforeEach(() => {
    setupScreen('combat');
  });

  afterEach(() => {
    teardownScreen();
  });

  it("should execute combat sequence", () => {
    verifyCombatScreenReady();
    changeStance(3, "Li (Fire) - precise strikes");
    executeCombatAttacks(5, 800);
  });
});
```

### Example 3: Bilingual Text Verification

```typescript
import {
  setupScreen,
  verifyBilingualText,
  verifyKoreanTextPresent
} from "../../support/test-helpers";

it("should display Korean and English text", () => {
  verifyKoreanTextPresent(["전투", "훈련"]);
  verifyBilingualText("건", "Heaven");
});
```

## 🎯 Best Practices

### 1. Use Shared Helpers
✅ **DO**: Use shared helpers for common operations
```typescript
setupScreen('combat');
verifyCombatScreenReady();
changeStance(3);
```

❌ **DON'T**: Duplicate setup code
```typescript
cy.visitWithWebGLMock("/", { timeout: 12000 });
cy.waitForCanvasReady();
cy.enterCombatMode();
cy.get('[data-testid="combat-screen"]').should("exist");
```

### 2. Consistent Test Structure
- Use `beforeEach` and `afterEach` with shared helpers
- Follow the AAA pattern (Arrange, Act, Assert)
- Add clear section comments with timing estimates
- Use `cy.log()` for progress tracking

### 3. Test Organization
- **Screen tests** (`/screens/`) - High-level user journeys
- **System tests** (`/combat/`, `/performance/`) - Specific systems
- **Visual tests** - Visual regression and rendering
- Keep tests focused on one primary concern

### 4. Naming Conventions
- Test files: `<feature>-<subject>.cy.ts`
- Test suites: `describe("Feature - E2E Test (Target: X min)")`
- Test cases: `it("should <action> when <condition>")`
- Helpers: Use descriptive, action-oriented names

### 5. Performance Considerations
- Set realistic timeout values
- Use `waitForTransition()` instead of arbitrary waits
- Target execution times: 2-4 minutes per test file
- Minimize unnecessary waits

## 🔄 Migration Guide

### Refactoring Existing Tests

1. **Add imports**:
```typescript
import {
  setupScreen,
  teardownScreen,
  verifyCombatScreenReady
} from "../../support/test-helpers";
```

2. **Replace beforeEach/afterEach**:
```typescript
// Before
beforeEach(() => {
  cy.visitWithWebGLMock("/", { timeout: 12000 });
  cy.waitForCanvasReady();
  cy.enterCombatMode();
});

// After
beforeEach(() => {
  setupScreen('combat');
});
```

3. **Replace common assertions**:
```typescript
// Before
cy.get('[data-testid="combat-screen"]').should("exist");
cy.get("canvas").should("be.visible");

// After
verifyCombatScreenReady();
```

4. **Replace stance changes**:
```typescript
// Before
cy.get("body").type("3");
cy.wait(500);
cy.log("✅ Switched to Li stance");

// After
changeStance(3, "Li (Fire)");
```

## 📊 Benefits of Shared Helpers

### Code Reduction
- **Before refactoring**: ~520 lines of duplicate code
- **After refactoring**: ~350 lines of shared utilities
- **Net savings**: ~170 lines per full refactor

### Maintainability
- ✅ Single source of truth for common operations
- ✅ Easier to update test patterns globally
- ✅ Consistent behavior across all tests
- ✅ Reduced cognitive load when writing new tests

### Quality
- ✅ Standardized error messages and logging
- ✅ Consistent timing and wait strategies
- ✅ Better test reliability
- ✅ Easier debugging

## 🚀 Future Improvements

### Planned Enhancements
1. **Page Object Models**: Create page objects for complex screens
2. **Test Data Factories**: Centralized test data generation
3. **Custom Cypress Commands**: Move helpers to Cypress commands
4. **Visual Regression**: Expand visual testing utilities
5. **Accessibility Testing**: Add a11y helper utilities

### Areas for Consolidation
1. Consider merging similar combat system tests
2. Create shared fixtures for common test data
3. Extract magic numbers to constants
4. Add more granular helper functions as patterns emerge

## 📚 Related Documentation
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Black Trigram E2E Test Plan](../../E2ETestPlan.md)
- [Cypress Support Files](../support/README.md)

## 🤝 Contributing

When adding new tests:
1. Check if shared helpers can be used
2. Add new helpers to `test-helpers.ts` if patterns repeat 3+ times
3. Update this documentation
4. Follow the established naming conventions
5. Add JSDoc comments to new helper functions

---

**Last Updated**: 2026-01-29
**Maintainer**: Test Specialist Team
