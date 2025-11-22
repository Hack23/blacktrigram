# Cypress E2E Test Execution Guide

## 🚀 Quick Start

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Smoke Tests Only (Faster)
```bash
npm run test:e2e:smoke
```

### Run Specific Test File
```bash
# Three.js specific tests
npx cypress run --spec "cypress/e2e/three-korean-martial-arts.cy.ts"

# Combat tests
npx cypress run --spec "cypress/e2e/combat.cy.ts"

# Training tests
npx cypress run --spec "cypress/e2e/training.cy.ts"

# Game journey tests
npx cypress run --spec "cypress/e2e/game-journey.cy.ts"

# Smoke tests
npx cypress run --spec "cypress/e2e/app.cy.ts"
```

### Interactive Mode (Development)
```bash
npx cypress open
```

## 📊 Test Execution Times

| Test File | Estimated Time | Priority |
|-----------|---------------|----------|
| app.cy.ts (smoke) | ~30s | High |
| combat.cy.ts | ~1.5min | Medium |
| training.cy.ts | ~1.5min | Medium |
| game-journey.cy.ts | ~2min | High |
| three-korean-martial-arts.cy.ts | ~2min | Medium |

**Total:** ~7.5min for all tests
**Smoke only:** ~2.5min (app.cy.ts + game-journey.cy.ts)

## 🎯 Test Categories

### Smoke Tests (Critical Path)
- **app.cy.ts** - Essential app functionality
- **game-journey.cy.ts** - Complete game flow

Run these first to catch critical failures quickly:
```bash
npm run test:e2e:smoke
```

### Feature Tests (Domain Specific)
- **combat.cy.ts** - Combat system testing
- **training.cy.ts** - Training system testing
- **three-korean-martial-arts.cy.ts** - Three.js integration

Run these for comprehensive feature validation:
```bash
npm run test:e2e
```

## 🔍 Test Scenarios

### Canvas Rendering Tests
All test files verify:
- ✅ Three.js Canvas element exists
- ✅ Canvas is visible with proper dimensions
- ✅ Canvas renders at different viewport sizes

### Html Overlay Tests
- ✅ Menu buttons (intro screen)
- ✅ Combat HUD (combat screen)
- ✅ Training UI (training screen)
- ✅ Control panels (all screens)

### Korean Martial Arts Features
- ✅ Eight trigram stances (1-8 keys)
- ✅ Bilingual text (Korean | English)
- ✅ Cyberpunk Korean theming
- ✅ Vital point system
- ✅ Player archetypes

### Performance Tests
- ✅ Rendering performance (<5s per operation)
- ✅ Scene transitions (<8s per transition)
- ✅ Rapid interactions (<5s for sequences)

### Responsive Design
- ✅ Desktop (1280x720)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

## 🛠️ CI/CD Configuration

### GitHub Actions
Tests run automatically on:
- Push to main branch
- Pull request creation
- Pull request updates

### CI Commands
```bash
# Headless mode (CI)
npm run test:e2e:ci

# Smoke tests only (CI)
npm run test:e2e:smoke:ci
```

## 🐛 Debugging Failed Tests

### View Test Output
```bash
# Run with debug output
DEBUG=cypress:* npx cypress run --spec "cypress/e2e/app.cy.ts"
```

### Interactive Debugging
```bash
# Open Cypress Test Runner
npx cypress open

# Select and run specific test
# Watch test execution in real-time
# Use Chrome DevTools for debugging
```

### Common Issues

#### Canvas Not Rendering
```bash
# Check WebGL support
# Verify Three.js imports
# Check browser console for errors
```

#### Test Timing Issues
```bash
# Increase timeouts in cypress.config.ts
# Add explicit waits: cy.wait(1000)
# Use cy.waitForCanvasReady()
```

#### Data-testid Not Found
```bash
# Verify component has data-testid attribute
# Check for typos in selector
# Use cy.get('[data-testid="element"]')
```

## 📝 Writing New Tests

### Test Structure Template
```typescript
describe("Feature Name", () => {
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
  });

  it("should test specific behavior", () => {
    cy.annotate("Testing specific feature");

    // Arrange
    cy.enterCombatMode();

    // Act
    cy.gameActions(["1", " "]);

    // Assert
    cy.get('[data-testid="combat-screen"]').should("exist");

    cy.log("✅ Test completed");
  });
});
```

### Best Practices
1. ✅ Use custom commands (enterCombatMode, gameActions, etc.)
2. ✅ Add data-testid to new components
3. ✅ Use cy.annotate() for test documentation
4. ✅ Keep tests independent (beforeEach setup)
5. ✅ Clean up after tests (afterEach cleanup)
6. ✅ Use cy.wait() sparingly, prefer assertions
7. ✅ Test user behavior, not implementation

### Custom Commands Available
```typescript
// Navigation
cy.enterTrainingMode()
cy.enterCombatMode()
cy.returnToIntro()

// Interactions
cy.gameActions(["1", "2", " "])
cy.practiceStance(1, 3)

// Utilities
cy.waitForCanvasReady()
cy.checkCanvasVisibility()
cy.annotate("Test message")
```

## 🎮 Test Data

### Keyboard Controls Tested
- **1-8**: Trigram stance selection
- **WASD**: Player movement
- **Arrow Keys**: Alternative movement
- **Space**: Execute technique
- **ESC**: Return to menu
- **Shift**: Defensive guard
- **Ctrl**: Vital point targeting

### Test Viewports
```typescript
const viewports = [
  [1280, 720],  // Desktop
  [768, 1024],  // Tablet
  [375, 667],   // Mobile
];
```

## 📊 Test Reports

### Results Location
- **Local:** `cypress/results/`
- **CI:** GitHub Actions artifacts
- **Videos:** `cypress/videos/`
- **Screenshots:** `cypress/screenshots/`

### Performance Metrics
Collected via `cy.task("logPerformance", metrics)`:
- Operation name
- Duration (ms)
- Timestamp

## ✅ Success Criteria

Tests pass when:
- ✅ All assertions succeed
- ✅ No uncaught exceptions (except ignored)
- ✅ Canvas renders correctly
- ✅ Html overlays are visible
- ✅ Performance targets met (<5s per test)
- ✅ All screens navigate properly

## 🔧 Troubleshooting

### Tests Fail in CI but Pass Locally
- Check CI browser version
- Verify viewport sizes
- Check timing differences
- Review CI logs for errors

### Flaky Tests
- Increase wait times
- Use assertion-based waits
- Check for race conditions
- Add cy.waitForCanvasReady()

### Performance Issues
- Run fewer tests in parallel
- Increase timeouts
- Check CI resource limits
- Profile test execution

## 📚 Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Black Trigram Testing Guide](./CYPRESS_THREEJS_MIGRATION.md)
- [Custom Commands](./cypress/support/commands.ts)

## 🎯 Next Steps

After running tests:
1. ✅ Review test results
2. ✅ Check performance metrics
3. ✅ Fix any failures
4. ✅ Update documentation if needed
5. ✅ Merge when all tests pass

**흑괘 테스트 실행 가이드** - *Black Trigram Test Execution Guide*
