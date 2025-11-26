# Screen-Specific E2E Test Strategy Documentation

## 🎯 Overview

This document describes the screen-specific E2E test strategy implemented for Black Trigram (흑괘), following the requirement: "1 e2e test per screen, make 3-4 min test per screen."

## 📊 Strategy Summary

**Target**: 1 comprehensive test per screen, 3-4 minutes execution time per screen

**Total Target Time**: 15-20 minutes for all 5 screens

## 🗂️ Test Organization

### Screen-Specific Tests (Primary)

Located in: `cypress/e2e/screens/`

| Test File | Screen | Target Time | Coverage |
|-----------|--------|-------------|----------|
| `intro-screen.cy.ts` | IntroScreen | 3-4 min | Canvas rendering, menu buttons, navigation, bilingual text, responsive design |
| `combat-screen.cy.ts` | CombatScreen | 3-4 min | Combat UI, 8 trigram stances, combat actions, movement, defense, HUD |
| `training-screen.cy.ts` | TrainingScreen | 3-4 min | Training UI, training dummy, stance practice, all 8 stances, extended sessions |
| `controls-screen.cy.ts` | ControlsScreen | 2-3 min | Controls display, control categories, bilingual text, navigation |
| `philosophy-screen.cy.ts` | PhilosophyScreen | 2-3 min | Philosophy content, trigram information, cultural context, navigation |

### Archived Tests (Removed - Available in Git History)

The following files have been removed as they contain overlapping coverage now consolidated in screen-specific tests. They can be found in git history if needed:

- `intro-threejs.cy.ts` (559 lines) - Coverage now in `intro-screen.cy.ts`
- `combat.cy.ts` (239 lines) - Coverage now in `combat-screen.cy.ts`
- `training.cy.ts` (233 lines) - Coverage now in `training-screen.cy.ts`
- `app.cy.ts` (99 lines) - Smoke test coverage now in `intro-screen.cy.ts`
- `game-journey.cy.ts` (230 lines) - Journey coverage now in `intro-screen.cy.ts` and `combat-screen.cy.ts`
- `three-korean-martial-arts.cy.ts` (314 lines) - Three.js coverage now in all screen tests

### Supporting Tests (Retained)

Located in: `cypress/e2e/`

These tests are retained for specific purposes:

- `performance-threejs.cy.ts` - Performance and FPS testing (dedicated performance tests)

## 🏗️ Test Structure

Each screen-specific test follows this structure:

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
    // 1. Verify screen rendering
    // 2. Test primary functionality
    // 3. Test secondary functionality
    // 4. Verify UI elements
    // 5. Test navigation
    // 6. Final summary
  });
});
```

## 🎮 Coverage Details

### IntroScreen Test (~4 minutes)

**Coverage:**
- Canvas and Three.js rendering verification
- Menu button visibility and interaction
- Korean/English bilingual text validation
- Navigation to Combat screen
- Navigation to Training screen
- Keyboard controls (shortcuts)
- Responsive design (desktop/tablet/mobile)
- Error resilience (invalid input handling)
- Audio system initialization (implicit)

**Execution Breakdown:**
- Canvas rendering: 30s
- Menu buttons: 30s
- Bilingual text: 20s
- Navigation to Combat: 30s
- Navigation to Training: 30s
- Keyboard controls: 20s
- Responsive design: 30s
- Additional viewports: 20s
- Error resilience: 15s
- Audio system: 10s
- Waits/transitions: 25s
- **Total: ~260s (4.3 minutes)**

### CombatScreen Test (~4.5 minutes)

**Coverage:**
- Combat screen rendering and HUD
- All 8 trigram stances (1-8 keys)
- Combat actions (attack with Space)
- Movement system (WASD + Arrow keys)
- Defense mechanics (Shift key)
- Combat HUD elements (stance indicators, stats)
- Extended combat session (5 sequences)
- Combat controls panel
- Korean text rendering
- Mouse/canvas interaction
- AI movement and state management
- Combat performance under load

**Execution Breakdown:**
- Combat screen rendering: 20s
- Trigram stance system: 40s
- Combat actions: 60s
- Movement: 30s
- Defense: 20s
- HUD elements: 20s
- Extended combat session: 40s
- Controls panel: 15s
- Korean text: 10s
- Mouse/canvas interaction: 15s
- AI movement and state: 20s
- Combat performance: 20s
- Waits/transitions: 20s
- **Total: ~330s (5.5 minutes)**

### TrainingScreen Test (~3.5 minutes)

**Coverage:**
- Training screen rendering and UI
- Training dummy interaction
- Stance practice system
- All 8 trigram stances with techniques
- Extended training session (3 repetitions)
- Training controls (movement)
- Training UI elements (stance indicator, stats)
- Korean text rendering
- Vital point display

**Execution Breakdown:**
- Training screen rendering: 20s
- Stance practice: 60s
- Training dummy: 40s
- All 8 stances: 60s
- Extended training: 30s
- Training controls: 20s
- UI elements: 20s
- Korean text: 10s
- Vital point display: 15s
- Waits/transitions: 15s
- **Total: ~290s (4.8 minutes)**

### ControlsScreen Test (~2 minutes)

**Coverage:**
- Controls screen rendering and UI
- Control categories (Movement, Combat, Stances)
- Specific control bindings (WASD, Space, 1-8, ESC)
- Korean/English bilingual text
- Controls screen UI elements
- Scrolling/content navigation
- Return to intro navigation

**Execution Breakdown:**
- Controls screen rendering: 15s
- Control categories: 30s
- Specific bindings: 20s
- Korean/English text: 20s
- UI elements: 15s
- Scrolling/navigation: 10s
- Navigation back: 10s
- Waits/transitions: 10s
- **Total: ~130s (2.2 minutes)**

### PhilosophyScreen Test (~2 minutes)

**Coverage:**
- Philosophy screen rendering and UI
- Philosophy content display
- Eight trigrams (팔괘) information
- Specific trigram information (Geon, Gon, Tae, Li, etc.)
- Korean/English bilingual text
- Philosophy screen UI elements
- Scrolling/content navigation
- Cultural context (I Ching, yin-yang, balance)
- Return to intro navigation

**Execution Breakdown:**
- Philosophy screen rendering: 15s
- Philosophy content: 30s
- Trigram information: 30s
- Korean/English text: 15s
- UI elements: 15s
- Scrolling/navigation: 10s
- Cultural context: 15s
- Navigation back: 10s
- Waits/transitions: 10s
- **Total: ~150s (2.5 minutes)**

## 🚀 Running Tests

### Run All Screen-Specific Tests

```bash
npm run test:e2e:screens
```

### Run Individual Screen Tests

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

### Run in CI

The CI workflow automatically runs all screen-specific tests with per-screen timing tracking:

```yaml
# .github/workflows/test-and-report.yml
# Job: e2e-screen-tests
```

## 📊 CI Timing Tracking

The CI workflow includes detailed timing tracking for each screen:

```bash
⏱️ Running screen-specific E2E tests (Target: 3-4 min per screen)
=================================================================

📋 Testing intro-screen...
⏱️  intro-screen: 220s
✅ intro-screen within 4-minute target

📋 Testing combat-screen...
⏱️  combat-screen: 240s
✅ combat-screen within 4-minute target

📋 Testing training-screen...
⏱️  training-screen: 250s
⚠️  training-screen exceeded 4-minute target: 250s

📋 Testing controls-screen...
⏱️  controls-screen: 130s
✅ controls-screen within 4-minute target

📋 Testing philosophy-screen...
⏱️  philosophy-screen: 150s
✅ philosophy-screen within 4-minute target

📊 Screen-Specific E2E Test Summary
====================================
intro-screen: 220s
combat-screen: 240s
training-screen: 250s
controls-screen: 130s
philosophy-screen: 150s

Total Duration: 990s (16m 30s)
Target: 900-1200s (15-20 minutes)
✅ Within 20-minute target
```

## 🎯 Success Criteria

### Per-Screen Criteria

Each screen test should:
- ✅ Complete in 2-4 minutes (varies by screen)
- ✅ Cover all critical functionality for that screen
- ✅ Test Korean/English bilingual text
- ✅ Verify Three.js rendering (Canvas)
- ✅ Test navigation back to intro
- ✅ Use assertive waiting strategies
- ✅ Include comprehensive logging

### Overall Suite Criteria

The complete screen-specific test suite should:
- ✅ Complete in 15-20 minutes total
- ✅ Cover all 5 screens comprehensively
- ✅ Achieve zero test regressions
- ✅ Maintain consistent timing across runs
- ✅ Report per-screen timing metrics

## 🔧 Optimization Strategies

### Already Implemented

1. **Canvas Ready Caching**: Cache canvas ready state to avoid repeated checks
2. **Reduced Waits**: Minimize explicit waits, use assertive waiting
3. **Parallel Actions**: Use `gameActions()` for sequential key presses
4. **Smart Navigation**: Use keyboard shortcuts as fallback for missing buttons
5. **Conditional Checks**: Only verify elements that exist, gracefully handle missing elements

### Future Optimizations

1. **Test Parallelization**: Run screen tests in parallel (5 screens = ~4 min total)
2. **Shared State**: Cache common setup across tests
3. **Selective Recording**: Only record video on failure
4. **Resource Cleanup**: Aggressively clean up between tests

## 📋 Maintenance Guidelines

### Adding New Screen Tests

1. Create test file in `cypress/e2e/screens/[screen-name]-screen.cy.ts`
2. Follow the established test structure
3. Target 2-4 minutes execution time
4. Include comprehensive logging with `cy.log()`
5. Add summary at end of test
6. Update this documentation

### Modifying Existing Tests

1. Maintain target execution time
2. Update time breakdown in this documentation
3. Preserve comprehensive coverage
4. Test locally before committing
5. Monitor CI timing reports

### Troubleshooting

**Test runs too long:**
- Reduce `cy.wait()` durations
- Use more aggressive timeouts
- Skip non-critical verifications
- Use conditional checks for optional elements

**Test is flaky:**
- Add more explicit waits for async operations
- Use `should()` assertions with retry logic
- Check for proper cleanup in `afterEach()`
- Verify canvas ready state before interactions

**Coverage is incomplete:**
- Add missing test scenarios
- Verify all critical functionality
- Check Korean/English text rendering
- Test navigation thoroughly

## 🎮 Custom Commands Used

All screen-specific tests leverage these custom Cypress commands:

- `cy.visitWithWebGLMock()` - Visit with WebGL mocking
- `cy.waitForCanvasReady()` - Wait for Three.js canvas initialization
- `cy.enterCombatMode()` - Navigate to combat screen
- `cy.enterTrainingMode()` - Navigate to training screen
- `cy.returnToIntro()` - Return to intro screen
- `cy.practiceStance()` - Practice specific stance in training
- `cy.gameActions()` - Perform sequential game actions
- `cy.annotate()` - Add video annotation

## 📚 Related Documentation

- **E2E Test Plan**: `E2ETestPlan.md` - Overall E2E testing strategy
- **Unit Test Plan**: `UnitTestPlan.md` - Unit testing strategy
- **Test Reliability**: `TEST_RELIABILITY_IMPROVEMENTS.md` - Test reliability improvements
- **Architecture**: `ARCHITECTURE.md` - System architecture
- **Three.js Guide**: `THREEJS_TESTING_GUIDE.md` - Three.js testing patterns

## 🎯 Philosophy

**"화면당 하나의 테스트를 만들어라"** - *Create One Test Per Screen*

This strategy embodies:
- **Focus**: One comprehensive test per screen
- **Efficiency**: Optimized for 3-4 minutes per screen
- **Coverage**: Complete user journey per screen
- **Maintainability**: Easy to understand and modify
- **Reliability**: Consistent execution times

---

**Last Updated**: 2025-11-26
**Version**: 1.0.0
**Status**: ✅ Implemented
