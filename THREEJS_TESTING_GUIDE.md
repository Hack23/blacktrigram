# Three.js Cypress Testing Guide

## 🎯 Overview

This guide documents Cypress E2E testing patterns for Three.js components in Black Trigram (흑괘). After migrating from PixiJS to Three.js, our testing approach has evolved to properly test Canvas-based rendering and Html overlays.

## 📁 Test File Structure

### Core Test Files
```
cypress/e2e/
├── app.cy.ts                          # Smoke tests for essential app functionality
├── combat.cy.ts                       # Combat mode tests (CombatScreen3D)
├── training.cy.ts                     # Training mode tests (TrainingScreen3D)
├── game-journey.cy.ts                 # Complete game flow and navigation
├── intro-threejs.cy.ts               # ✨ NEW: IntroScreen Three.js tests
├── performance-threejs.cy.ts         # ✨ NEW: FPS and performance tests
└── three-korean-martial-arts.cy.ts   # Three.js Korean martial arts integration
```

### Support Files
```
cypress/support/
├── commands.ts                 # Custom Cypress commands
├── fps-monitor.ts             # ✨ NEW: FPS monitoring utilities
├── performance.ts             # Performance tracking
├── resource-monitoring.ts     # Resource usage monitoring
└── e2e.ts                     # E2E test setup
```

## 🎮 Three.js Testing Patterns

### 1. Canvas Rendering Tests

**Verify Three.js Canvas exists and renders:**

```typescript
describe("Canvas Rendering", () => {
  it("should render Three.js canvas", () => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
    
    // Verify canvas exists
    cy.get("canvas").should("exist").and("be.visible");
    
    // Verify canvas dimensions
    cy.get("canvas").should(($canvas) => {
      const canvas = $canvas[0];
      const rect = canvas.getBoundingClientRect();
      expect(rect.width).to.be.greaterThan(100);
      expect(rect.height).to.be.greaterThan(100);
    });
  });
});
```

### 2. Html Overlay Tests

**Test Html components rendered over Three.js Canvas:**

```typescript
describe("Html Overlays", () => {
  it("should display menu buttons over canvas", () => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
    
    // Verify Html overlay buttons
    cy.get('[data-testid="combat-button"]')
      .should("be.visible")
      .and("contain", "대전")
      .and("contain", "Combat");
      
    cy.get('[data-testid="training-button"]')
      .should("be.visible")
      .and("contain", "훈련")
      .and("contain", "Training");
  });
});
```

### 3. FPS Performance Monitoring

**Monitor and assert frame rate during gameplay:**

```typescript
describe("Performance", () => {
  it("should maintain 60fps during gameplay", () => {
    cy.visitWithWebGLMock("/");
    cy.waitForCanvasReady();
    cy.enterCombatMode();
    
    // Assert smooth 60fps performance
    cy.assertSmoothFPS(2000);
    
    // Or assert minimum FPS threshold
    cy.assertMinFPS(30, 2000);
  });
  
  it("should track FPS metrics", () => {
    cy.visitWithWebGLMock("/");
    cy.waitForCanvasReady();
    
    // Monitor and get detailed metrics
    cy.monitorFPS(2000).then((metrics) => {
      cy.log(`Average FPS: ${metrics.averageFPS.toFixed(2)}`);
      cy.log(`Min FPS: ${metrics.minFPS.toFixed(2)}`);
      cy.log(`Max FPS: ${metrics.maxFPS.toFixed(2)}`);
      cy.log(`Dropped frames: ${metrics.droppedFrames}/${metrics.samples}`);
      
      expect(metrics.averageFPS).to.be.greaterThan(40);
    });
  });
});
```

### 4. WebGL Context Validation

**Test WebGL context initialization and handling:**

```typescript
describe("WebGL Context", () => {
  it("should initialize WebGL context", () => {
    cy.visitWithWebGLMock("/");
    cy.waitForCanvasReady();
    
    cy.window().then((win) => {
      const canvas = win.document.querySelector("canvas");
      expect(canvas).to.exist;
      
      if (canvas) {
        const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
        if (gl) {
          cy.log("✅ WebGL context initialized");
        } else {
          cy.log("⚠️ WebGL context mocked (expected in Cypress)");
        }
      }
    });
  });
  
  it("should handle WebGL context loss", () => {
    cy.visitWithWebGLMock("/");
    cy.waitForCanvasReady();
    
    cy.window().then((win) => {
      const canvas = win.document.querySelector("canvas");
      if (canvas) {
        // Simulate context loss
        const event = new Event("webglcontextlost");
        canvas.dispatchEvent(event);
        
        cy.wait(500);
        
        // App should still be functional
        cy.get('[data-testid="intro-screen"]').should("exist");
      }
    });
  });
});
```

### 5. Scene Transition Tests

**Test transitions between different Three.js scenes:**

```typescript
describe("Scene Transitions", () => {
  it("should transition between screens smoothly", () => {
    cy.visitWithWebGLMock("/");
    cy.waitForCanvasReady();
    
    // Intro -> Combat
    cy.get('[data-testid="intro-screen"]').should("exist");
    cy.enterCombatMode();
    cy.get('[data-testid="combat-screen"]').should("exist");
    cy.get("canvas").should("be.visible");
    
    // Combat -> Intro
    cy.returnToIntro();
    cy.get('[data-testid="intro-screen"]').should("exist");
    cy.get("canvas").should("be.visible");
    
    // Verify FPS maintained during transitions
    cy.assertMinFPS(30, 1500);
  });
});
```

### 6. Responsive Design Tests

**Test Canvas and overlays at different viewport sizes:**

```typescript
describe("Responsive Design", () => {
  it("should render correctly at all viewport sizes", () => {
    const viewports: [number, number][] = [
      [1280, 720],  // Desktop
      [768, 1024],  // Tablet
      [375, 667],   // Mobile
    ];
    
    viewports.forEach(([width, height]) => {
      cy.viewport(width, height);
      cy.visitWithWebGLMock("/");
      cy.waitForCanvasReady();
      
      // Verify canvas exists and adapts
      cy.get("canvas").should("exist").and("be.visible");
      
      cy.get("canvas").should(($canvas) => {
        const canvas = $canvas[0];
        const rect = canvas.getBoundingClientRect();
        expect(rect.width).to.be.greaterThan(50);
        expect(rect.height).to.be.greaterThan(50);
      });
      
      // Verify Html overlays are still visible
      cy.get('[data-testid="combat-button"]').should("be.visible");
    });
  });
});
```

## 🛠️ Custom Cypress Commands

### Canvas and WebGL Commands

```typescript
// Wait for Three.js Canvas to be ready
cy.waitForCanvasReady();

// Check canvas visibility and dimensions
cy.checkCanvasVisibility();

// Visit with WebGL mocking enabled
cy.visitWithWebGLMock("/", { timeout: 12000 });
```

### FPS Monitoring Commands

```typescript
// Monitor FPS for duration (returns metrics)
cy.monitorFPS(duration?: number, targetFPS?: number);

// Assert minimum FPS threshold
cy.assertMinFPS(minFPS?: number, duration?: number);

// Assert smooth 60fps performance
cy.assertSmoothFPS(duration?: number);

// Verify canvas is actively rendering
cy.assertCanvasRendering(duration?: number);

// Check for memory leaks
cy.assertNoMemoryLeaks(duration?: number);
```

### Navigation Commands

```typescript
// Enter combat mode
cy.enterCombatMode();

// Enter training mode
cy.enterTrainingMode();

// Return to intro screen
cy.returnToIntro();

// Perform game actions with timing
cy.gameActions(["1", " ", "w", "a", "s", "d"]);

// Practice a stance in training
cy.practiceStance(stanceNumber, repetitions);
```

## 📊 Performance Benchmarks

### Target Metrics

| Metric | Target | Acceptable | Warning |
|--------|--------|-----------|---------|
| **Average FPS** | 60 | >40 | <30 |
| **Minimum FPS** | 55 | >35 | <25 |
| **Frame Drops** | <5% | <15% | >20% |
| **Load Time** | <3s | <5s | >8s |
| **Transition** | <1s | <2s | >3s |
| **Memory Increase** | <20% | <50% | >75% |

### Usage Example

```typescript
it("should meet performance benchmarks", () => {
  // Test load time with proper async timing
  cy.wrap(Date.now()).then((startTime) => {
    cy.visitWithWebGLMock("/");
    cy.waitForCanvasReady();
    cy.get('[data-testid="intro-screen"]').should("exist");
    
    cy.wrap(Date.now() - startTime).then((loadTime) => {
      expect(loadTime).to.be.lessThan(3000); // Target: <3s
    });
  });
  
  // Test FPS
  cy.assertSmoothFPS(2000); // Target: 60fps
  
  // Test memory
  cy.assertNoMemoryLeaks(3000); // Target: <20% increase
});
```

**Note on Timing Measurements:**
When measuring elapsed time in Cypress, always wrap `Date.now()` in `cy.wrap()` to ensure timing is captured within the async command chain. This ensures accurate measurement of actual command execution time rather than just synchronous JavaScript execution time.

```typescript
// ✅ CORRECT: Async-aware timing
cy.wrap(Date.now()).then((startTime) => {
  cy.someAsyncCommand();
  cy.wrap(Date.now() - startTime).then((duration) => {
    expect(duration).to.be.lessThan(5000);
  });
});

// ❌ INCORRECT: Synchronous timing (measures only JS execution)
const startTime = Date.now();
cy.someAsyncCommand();
cy.wrap(null).then(() => {
  const duration = Date.now() - startTime; // Wrong! Measured before commands run
});
```

## 🎯 Test Coverage Requirements

### IntroScreen (intro-threejs.cy.ts)
- ✅ Canvas rendering verification
- ✅ Html menu button interactions
- ✅ Bilingual text rendering (Korean/English)
- ✅ Keyboard navigation
- ✅ Player archetype selection
- ✅ Background animation
- ✅ WebGL context validation
- ✅ Performance monitoring
- ✅ Accessibility (ARIA labels, keyboard-only)
- ✅ Error handling

### CombatScreen (combat.cy.ts)
- ✅ Combat UI components
- ✅ Trigram stance system (8 stances)
- ✅ Combat actions (attack, defend, move)
- ✅ Player movement (WASD, arrows)
- ✅ Rapid input handling
- ✅ State persistence
- ✅ Performance during intense combat

### TrainingScreen (training.cy.ts)
- ✅ Training UI components
- ✅ Training dummy rendering
- ✅ Stance practice (all 8 stances)
- ✅ Training statistics tracking
- ✅ Progress persistence
- ✅ Korean martial arts theming

### Performance (performance-threejs.cy.ts)
- ✅ IntroScreen FPS (60fps target)
- ✅ CombatScreen FPS during actions
- ✅ TrainingScreen FPS during exercises
- ✅ Scene transition performance
- ✅ Canvas rendering verification
- ✅ Memory leak detection
- ✅ Performance under load
- ✅ Benchmark tests

## 🚀 Running Tests

### Local Development

```bash
# Run all E2E tests
npm run test:e2e

# Run smoke tests only (faster)
npm run test:e2e:smoke

# Run specific test file
npx cypress run --spec "cypress/e2e/intro-threejs.cy.ts"

# Open Cypress Test Runner (interactive)
npx cypress open
```

### CI/CD

```bash
# Run tests in CI mode (headless)
npm run test:e2e:ci

# Run smoke tests in CI
npm run test:e2e:smoke:ci
```

## 📈 Performance Optimization Tips

### 1. Reduce Fixed Waits
❌ **Bad:**
```typescript
cy.wait(5000); // Fixed wait
```

✅ **Good:**
```typescript
cy.get('[data-testid="combat-screen"]', { timeout: 10000 }).should("exist");
```

### 2. Use Efficient Selectors
❌ **Bad:**
```typescript
cy.get("div.menu button.combat-btn");
```

✅ **Good:**
```typescript
cy.get('[data-testid="combat-button"]');
```

### 3. Minimize Screen Transitions
❌ **Bad:**
```typescript
// Testing in multiple separate tests
it("test 1", () => { cy.enterCombatMode(); /* test */ cy.returnToIntro(); });
it("test 2", () => { cy.enterCombatMode(); /* test */ cy.returnToIntro(); });
```

✅ **Good:**
```typescript
// Batch related tests
it("should test multiple combat features", () => {
  cy.enterCombatMode();
  // Test feature 1
  // Test feature 2
  // Test feature 3
  cy.returnToIntro();
});
```

### 4. Use Custom Commands
❌ **Bad:**
```typescript
cy.get('[data-testid="combat-button"]').click();
cy.wait(1000);
cy.get('[data-testid="combat-screen"]').should("exist");
```

✅ **Good:**
```typescript
cy.enterCombatMode(); // Handles timing and assertions
```

## 🐛 Debugging Tips

### 1. Enable Video Recording
Videos are automatically recorded for failed tests. Check `build/cypress/videos/`.

### 2. Take Screenshots
```typescript
cy.screenshot("debug-screenshot");
```

### 3. Log FPS Metrics
```typescript
cy.monitorFPS(2000).then((metrics) => {
  console.log("FPS Metrics:", metrics);
  cy.screenshot("fps-debug");
});
```

### 4. Check WebGL Errors
```typescript
cy.on("uncaught:exception", (err) => {
  console.error("WebGL Error:", err);
  return false; // Don't fail test
});
```

## 📝 Best Practices

### ✅ DO:
- Use `data-testid` attributes for reliable element selection
- Test Canvas rendering with `cy.assertCanvasRendering()`
- Monitor FPS with `cy.assertSmoothFPS()` or `cy.assertMinFPS()`
- Verify Html overlays are visible and interactive
- Test responsive design at multiple viewport sizes
- Handle WebGL context mocking with `cy.visitWithWebGLMock()`
- Add bilingual text verification (Korean + English)
- Test keyboard navigation in addition to clicks

### ❌ DON'T:
- Rely on fixed `cy.wait()` - use assertions instead
- Test WebGL shaders directly (use visual testing tools instead)
- Expect exact pixel-perfect rendering (browsers differ)
- Ignore performance monitoring
- Skip responsive design tests
- Hardcode viewport sizes - use constants
- Test implementation details - test user behavior

## 🎓 Learning Resources

### Cypress Documentation
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)
- [Network Requests](https://docs.cypress.io/guides/guides/network-requests)

### Three.js Testing
- [react-three/fiber Testing](https://docs.pmnd.rs/react-three-fiber/advanced/testing)
- [WebGL Testing Guide](https://github.com/regl-project/regl/wiki/Testing)

### Black Trigram Specific
- `CYPRESS_EXECUTION_GUIDE.md` - Execution strategies
- `E2ETestPlan.md` - Overall test plan
- `CYPRESS_THREEJS_MIGRATION.md` - Migration notes

## 🤝 Contributing

When adding new Three.js components:

1. **Create test file**: `cypress/e2e/[component]-threejs.cy.ts`
2. **Test Canvas rendering**: Verify Three.js Canvas exists and renders
3. **Test Html overlays**: Verify UI components over Canvas
4. **Add performance tests**: Monitor FPS during interaction
5. **Test responsive design**: Verify at multiple viewport sizes
6. **Add to CI**: Update test scripts if needed
7. **Document patterns**: Update this guide with new patterns

## 📞 Support

For questions or issues:
- Check existing test files for examples
- Review Cypress logs and videos
- Ask in team chat or create an issue

**흑괘의 길을 걸어라** - *Walk the Path of the Black Trigram*
