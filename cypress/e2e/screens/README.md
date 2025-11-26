# Screen-Specific E2E Tests

This directory contains comprehensive E2E tests for each screen in the Black Trigram (흑괘) application, following the "1 test per screen" strategy.

## 📂 Test Files

| File | Screen | Target Time | Status |
|------|--------|-------------|--------|
| `intro-screen.cy.ts` | IntroScreen | 3-4 min | ✅ Implemented |
| `combat-screen.cy.ts` | CombatScreen | 3-4 min | ✅ Implemented |
| `training-screen.cy.ts` | TrainingScreen | 3-4 min | ✅ Implemented |
| `controls-screen.cy.ts` | ControlsScreen | 2-3 min | ✅ Implemented |
| `philosophy-screen.cy.ts` | PhilosophyScreen | 2-3 min | ✅ Implemented |

**Total Target Time**: 15-20 minutes for all 5 screens

## 🎯 Test Philosophy

Each test file contains **exactly one comprehensive test** that covers the complete user journey for that screen. This approach:

- ✅ Makes tests easy to understand and maintain
- ✅ Ensures consistent execution times
- ✅ Reduces test duplication
- ✅ Simplifies CI/CD integration
- ✅ Makes it easy to run tests individually

## 🚀 Running Tests

### Run All Screen Tests

```bash
npm run test:e2e:screens
```

### Run Individual Screen Test

```bash
# Intro screen
npx cypress run --spec "cypress/e2e/screens/intro-screen.cy.ts"

# Combat screen
npx cypress run --spec "cypress/e2e/screens/combat-screen.cy.ts"

# Training screen
npx cypress run --spec "cypress/e2e/screens/training-screen.cy.ts"

# Controls screen
npx cypress run --spec "cypress/e2e/screens/controls-screen.cy.ts"

# Philosophy screen
npx cypress run --spec "cypress/e2e/screens/philosophy-screen.cy.ts"
```

### Run in Interactive Mode

```bash
npx cypress open
# Then select the screen test you want to run
```

## 📊 What Each Test Covers

### IntroScreen (`intro-screen.cy.ts`)

- Canvas and Three.js rendering
- Menu button visibility and interaction
- Korean/English bilingual text
- Navigation to Combat and Training screens
- Keyboard shortcuts
- Responsive design (desktop/tablet)
- Audio system initialization

### CombatScreen (`combat-screen.cy.ts`)

- Combat screen rendering and HUD
- All 8 trigram stances (1-8 keys)
- Combat actions (attack with Space)
- Movement system (WASD + Arrow keys)
- Defense mechanics (Shift key)
- Combat UI elements
- Extended combat session
- Korean text rendering

### TrainingScreen (`training-screen.cy.ts`)

- Training screen rendering and UI
- Training dummy interaction
- Stance practice system
- All 8 trigram stances with techniques
- Extended training session
- Training controls (movement)
- UI elements (stance indicator, stats)
- Vital point display

### ControlsScreen (`controls-screen.cy.ts`)

- Controls screen rendering
- Control categories (Movement, Combat, Stances)
- Specific control bindings (WASD, Space, 1-8, ESC)
- Korean/English bilingual text
- Scrolling/content navigation
- Return to intro navigation

### PhilosophyScreen (`philosophy-screen.cy.ts`)

- Philosophy screen rendering
- Philosophy content display
- Eight trigrams (팔괘) information
- Specific trigram details (Geon, Gon, Tae, Li, etc.)
- Korean/English bilingual text
- Cultural context (I Ching, yin-yang)
- Return to intro navigation

## ✅ Best Practices

### Test Structure

Each test follows this structure:

```typescript
describe("[Screen] - Comprehensive E2E Test (Target: X-Y min)", () => {
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
    // Navigate to screen if needed
  });

  afterEach(() => {
    cy.returnToIntro(); // Clean up
  });

  it("should render [Screen] with all [functionality]", () => {
    // Test sections with clear logging
    cy.log("1️⃣ Section 1");
    // ... test code
    
    cy.log("2️⃣ Section 2");
    // ... test code
    
    // Final summary
    cy.log("✅ Test completed");
  });
});
```

### Timing Guidelines

- Use `cy.wait()` sparingly (prefer assertive waiting)
- Cache canvas ready state to avoid repeated checks
- Use `cy.log()` for clear test progress tracking
- Include time estimates in comments at end of file
- Target 2-4 minutes per screen test

### Adding New Screen Tests

1. Create file: `[screen-name]-screen.cy.ts`
2. Follow the established structure
3. Target 2-4 minutes execution time
4. Include comprehensive logging
5. Add summary at end of test
6. Update this README

## 🔧 Custom Commands Used

All screen tests use these custom Cypress commands:

- `cy.visitWithWebGLMock()` - Visit with WebGL mocking
- `cy.waitForCanvasReady()` - Wait for Three.js canvas
- `cy.enterCombatMode()` - Navigate to combat
- `cy.enterTrainingMode()` - Navigate to training
- `cy.returnToIntro()` - Return to intro screen
- `cy.practiceStance()` - Practice stance in training
- `cy.gameActions()` - Sequential game actions
- `cy.annotate()` - Add video annotation

See `cypress/support/commands.ts` for full command definitions.

## 📚 Related Documentation

- **Strategy Doc**: `/SCREEN_SPECIFIC_E2E_STRATEGY.md` - Full strategy documentation
- **E2E Test Plan**: `/E2ETestPlan.md` - Overall E2E testing strategy
- **CI Workflow**: `/.github/workflows/test-and-report.yml` - CI integration

## 🎮 Test Philosophy

**"화면당 하나의 테스트를 만들어라"** - *Create One Test Per Screen*

These tests embody:
- **Focus**: One comprehensive test per screen
- **Efficiency**: Optimized for 3-4 minutes per screen
- **Coverage**: Complete user journey per screen
- **Maintainability**: Easy to understand and modify
- **Reliability**: Consistent execution times

---

**Last Updated**: 2025-11-26
**Version**: 1.0.0
**Status**: ✅ Active
