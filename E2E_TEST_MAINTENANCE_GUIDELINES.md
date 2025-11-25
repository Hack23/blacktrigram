# 🧪 E2E Test Maintenance Guidelines
## Black Trigram (흑괘) - Best Practices for Quality E2E Testing

**Version:** 1.0  
**Last Updated:** 2025-01-25  
**Status:** Active - Apply to all new and updated tests

---

## 🎯 Core Principles

### 1. Test Behavior, Not Implementation
**❌ Bad:** Test internal state or implementation details  
**✅ Good:** Test user-visible behavior and outcomes

```typescript
// ❌ BAD: Testing implementation details
it("should call attackEnemy() function", () => {
  cy.window().then(win => {
    expect(win.game.attackEnemy).to.have.been.called;
  });
});

// ✅ GOOD: Testing user-visible outcome
// NOTE: Requires adding data-health attribute to ProgressBar component
it("should deal damage when attacking", () => {
  // Use player2-health (opponent), not "enemy-health"
  cy.get('[data-testid="player2-health"]').invoke('attr', 'data-health')
    .then(parseFloat).as('healthBefore');
  
  cy.gameActions(["1", " "]); // Attack
  
  cy.get('@healthBefore').then((initial) => {
    cy.get('[data-testid="player2-health"]')
      .invoke('attr', 'data-health')
      .then(parseFloat)
      .should('be.lessThan', initial as number);
  });
});
```

**Prerequisites:** Add `data-health` attribute to ProgressBar component:
```typescript
// In src/components/three/ProgressBar.tsx, line 204:
<div style={containerStyle} data-testid={testId} data-health={current} data-max={max}>
```

### 2. Verify Game State, Not Just UI Presence
**❌ Bad:** Only check that elements exist  
**✅ Good:** Verify elements contain correct values and game state changed

```typescript
// ❌ BAD: Only checks UI exists
it("should show health bar", () => {
  cy.get('[data-testid="player1-health"]').should("exist");
});

// ✅ GOOD: Verifies health value is correct
// NOTE: Requires adding data-health attribute to ProgressBar component
it("should show correct health after damage", () => {
  cy.get('[data-testid="player1-health"]')
    .should('have.attr', 'data-health', '100');
  
  cy.gameActions(["1", " "]); // Take damage
  
  cy.get('[data-testid="player1-health"]')
    .should('have.attr', 'data-health')
    .then(health => {
      expect(parseFloat(health as string)).to.be.lessThan(100);
    });
});
```

**Alternative without data attributes** (works with current implementation):
```typescript
// Parse text content instead of data attribute
it("should show correct health after damage (text parsing)", () => {
  cy.get('[data-testid="player1-health"]')
    .invoke('text')
    .then(text => {
      // Text format: "체력 | Health  75 / 100  75%"
      const healthMatch = text.match(/(\d+)\s*\/\s*\d+/);
      const initialHealth = parseInt(healthMatch[1]);
      
      cy.gameActions(["1", " "]); // Take damage
      
      cy.get('[data-testid="player1-health"]')
        .invoke('text')
        .then(newText => {
          const newMatch = newText.match(/(\d+)\s*\/\s*\d+/);
          const currentHealth = parseInt(newMatch[1]);
          expect(currentHealth).to.be.lessThan(initialHealth);
        });
    });
});
```

### 3. Use Assertion-Based Waiting, Not Fixed Delays
**❌ Bad:** Fixed waits that may be too short or too long  
**✅ Good:** Wait for specific conditions using `.should()`

```typescript
// ❌ BAD: Fixed wait
cy.get("body").type("1");
cy.wait(1000); // May be too short or waste time
cy.get('[data-testid="combat-screen"]');

// ✅ GOOD: Assertion-based wait
cy.get("body").type("1");
cy.get('[data-testid="combat-screen"]', { timeout: 5000 })
  .should('exist')
  .and('be.visible');
```

### 4. Fail Fast on Critical Features
**❌ Bad:** Silent error catching that hides failures  
**✅ Good:** Strict assertions that fail immediately

```typescript
// ❌ BAD: Silent continuation
cy.get("body").then(($body) => {
  if ($body.find('[data-testid="attack-button"]').length > 0) {
    cy.log("✅ Attack button found");
  } else {
    cy.log("⚠️ Attack button not found, but continuing");
  }
});

// ✅ GOOD: Fail fast
cy.get('[data-testid="attack-button"]', { timeout: 5000 })
  .should('exist')
  .and('be.visible');
```

---

## 📝 Test Quality Checklist

Before merging any E2E test, verify:

### ✅ Assertion Quality
- [ ] Test verifies actual game mechanic, not just UI presence
- [ ] Assertions check values/state, not only `.exist` or `.be.visible`
- [ ] Test verifies outcomes (damage dealt, stance changed, health decreased)
- [ ] Korean text validated where applicable
- [ ] No weak "existence-only" assertions without value checks

### ✅ Timing & Performance
- [ ] No fixed waits >300ms (use assertion-based waiting)
- [ ] Timeout values ≤8000ms (except page load: 12000ms acceptable)
- [ ] No unnecessary `cy.wait()` calls
- [ ] Test completes in reasonable time (<5s for simple tests)

### ✅ Error Handling
- [ ] No silent error catching with "but continuing" patterns
- [ ] Required features have strict assertions (fail fast)
- [ ] Optional features use `this.skip()` if not implemented
- [ ] Test fails when feature is intentionally broken (negative test)

### ✅ Reliability
- [ ] Run test 5 times to verify no flakiness
- [ ] Test is independent (doesn't depend on other test state)
- [ ] Test cleans up after itself (returns to known state)
- [ ] No race conditions or timing dependencies

### ✅ Documentation
- [ ] Test name clearly describes what is being tested
- [ ] Comments explain complex assertions or waits
- [ ] Korean text includes English translation in comments
- [ ] Test purpose is clear from description

---

## 🎨 Code Patterns & Examples

### Pattern 1: Testing Combat Mechanics

```typescript
describe("Combat Damage System", () => {
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
    cy.enterCombatMode();
  });

  afterEach(() => {
    cy.returnToIntro();
  });

  it("should deal damage based on stance and vital point", () => {
    cy.annotate("Testing damage calculation");

    // Record initial health (player2 is opponent)
    // NOTE: Requires data-health attribute on ProgressBar
    cy.get('[data-testid="player2-health"]')
      .invoke('attr', 'data-health')
      .then(parseFloat)
      .as('healthBefore');

    // Select stance (건 / Geon - Heaven stance)
    cy.get("body").type("1");
    cy.get('[data-testid="current-stance"]', { timeout: 2000 })
      .should('contain', '건')
      .or('contain', 'Geon');

    // Execute attack
    cy.get("body").type(" ");

    // Verify combat log shows attack
    cy.get('[data-testid="combat-log"]', { timeout: 3000 })
      .should('contain', '공격') // Korean for "attack"
      .and('contain', '데미지'); // Korean for "damage"

    // Verify damage was dealt
    cy.get('@healthBefore').then((initial) => {
      cy.get('[data-testid="player2-health"]')
        .invoke('attr', 'data-health')
        .then(parseFloat)
        .should('be.lessThan', initial as number)
        .and('be.greaterThanOrEqual', 0);
    });

    cy.log("✅ Damage calculation verified");
  });

  it("should prevent attack when stamina is zero", () => {
    cy.annotate("Testing stamina requirement");

    // Deplete stamina (if system exists)
    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="player-stamina"]').length > 0) {
        // Exhaust stamina through repeated attacks
        for (let i = 0; i < 10; i++) {
          cy.get("body").type(" ");
          cy.wait(100);
        }

        // Verify stamina is zero
        cy.get('[data-testid="player-stamina"]')
          .invoke('attr', 'data-stamina')
          .should('equal', '0');

        // Attempt attack with zero stamina
        cy.get('[data-testid="player2-health"]')
          .invoke('attr', 'data-health')
          .as('healthBeforeZeroStamina');

        cy.get("body").type(" ");
        cy.wait(500);

        // Verify no damage dealt (stamina requirement enforced)
        cy.get('@healthBeforeZeroStamina').then((before) => {
          cy.get('[data-testid="player2-health"]')
            .invoke('attr', 'data-health')
            .should('equal', before); // Health unchanged
        });

        cy.log("✅ Zero stamina attack prevention verified");
      } else {
        cy.log("ℹ️ Stamina system not implemented, skipping test");
        this.skip();
      }
    });
  });
});
```

### Pattern 2: Testing Training Mode

```typescript
describe("Training Stance Practice", () => {
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
    cy.enterTrainingMode();
  });

  afterEach(() => {
    cy.returnToIntro();
  });

  it("should change stance and show technique name", () => {
    cy.annotate("Testing stance change with technique display");

    const stances = [
      { key: "1", korean: "건", english: "Geon", technique: "천둥벽력" },
      { key: "3", korean: "리", english: "Li", technique: "화염지창" },
      { key: "5", korean: "손", english: "Son", technique: "선풍연격" },
    ];

    stances.forEach(stance => {
      // Change stance
      cy.get("body").type(stance.key);

      // Verify stance changed
      cy.get('[data-testid="current-stance"]', { timeout: 2000 })
        .should('contain', stance.korean)
        .or('contain', stance.english);

      // Verify technique name shown
      cy.get('[data-testid="current-technique"]')
        .should('contain', stance.technique)
        .or('contain', stance.english); // Fallback to English name

      cy.log(`✅ Stance ${stance.korean} verified`);
    });
  });

  it("should track training statistics", () => {
    cy.annotate("Testing training stats tracking");

    // Practice stance multiple times
    cy.practiceStance(1, 3); // Stance 1, 3 repetitions

    // Verify stats updated
    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="training-stats"]').length > 0) {
        cy.get('[data-testid="training-stats"]')
          .should('contain', '3') // 3 repetitions
          .and('contain', '건'); // Stance name

        cy.log("✅ Training stats verified");
      } else {
        cy.log("ℹ️ Training stats not implemented");
        // Don't fail test, but document feature is missing
        this.skip();
      }
    });
  });
});
```

### Pattern 3: Testing Three.js Rendering

```typescript
describe("Three.js Scene Verification", () => {
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
  });

  it("should render 3D scene with correct objects on intro", () => {
    cy.annotate("Verifying Three.js scene objects");

    // Verify canvas exists
    cy.get("canvas").should("exist").and("be.visible");

    // Verify canvas has content (not blank)
    cy.get("canvas").should(($canvas) => {
      const canvas = $canvas[0] as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      
      // Canvas should be visible size
      expect(rect.width).to.be.greaterThan(200);
      expect(rect.height).to.be.greaterThan(200);
    });

    // Verify Three.js scene (if exposed in dev mode)
    cy.verifyThreeJSScene({ minObjects: 3 });

    cy.log("✅ Three.js scene verified");
  });

  it("should render character models in combat", () => {
    cy.annotate("Verifying combat 3D models");

    cy.enterCombatMode();

    // Verify canvas rendering
    cy.get("canvas").should("be.visible");
    cy.assertCanvasRendering(1000);

    // Verify scene contains expected objects
    cy.verifyThreeJSScene({
      minObjects: 5, // Camera, lights, player, enemy, arena
      requiredTypes: ['PerspectiveCamera', 'DirectionalLight', 'AmbientLight']
    });

    cy.log("✅ Combat 3D models verified");
  });

  it("should maintain performance during rendering", () => {
    cy.annotate("Testing rendering performance");

    cy.enterCombatMode();

    // Monitor FPS for 2 seconds
    cy.assertMinFPS(40, 2000); // Minimum 40fps acceptable

    // Perform actions and verify FPS maintained
    cy.gameActions(["1", " ", "w", "a", "s", "d"]);
    cy.assertMinFPS(35, 2000); // Allow slight drop during action

    cy.log("✅ Rendering performance verified");
  });
});
```

### Pattern 4: Responsive Testing

```typescript
describe("Responsive Design", () => {
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
  });

  it("should adapt UI for all viewport sizes", () => {
    cy.annotate("Testing responsive design");

    const viewports: [number, number, string][] = [
      [1920, 1080, "Desktop Large"],
      [1280, 720, "Desktop"],
      [768, 1024, "Tablet"],
      [375, 667, "Mobile"],
    ];

    viewports.forEach(([width, height, name]) => {
      cy.viewport(width, height);
      cy.wait(300); // Allow time for resize

      // Verify essential elements adapt
      cy.get('[data-testid="app-container"]').should("be.visible");
      cy.get("canvas").should("be.visible");

      // Verify buttons are accessible
      cy.get('[data-testid="combat-button"]')
        .should("be.visible")
        .and("contain", "대전");

      // Verify text is readable (not cut off)
      cy.get('[data-testid="combat-button"]').should(($btn) => {
        const text = $btn.text();
        expect(text.length).to.be.greaterThan(0);
      });

      cy.log(`✅ ${name} (${width}x${height}) verified`);
    });

    // Reset viewport
    cy.viewport(1280, 720);
  });
});
```

---

## 🚫 Anti-Patterns to Avoid

### 1. Existence-Only Testing
```typescript
// ❌ BAD: Only checks element exists
it("should have combat UI", () => {
  cy.get('[data-testid="combat-screen"]').should("exist");
  cy.get('[data-testid="attack-button"]').should("exist");
  cy.get('[data-testid="health-bar"]').should("exist");
});

// ✅ GOOD: Verifies functionality
it("should display functional combat UI", () => {
  cy.get('[data-testid="combat-screen"]')
    .should('exist')
    .and('be.visible');
  
  cy.get('[data-testid="attack-button"]')
    .should('be.visible')
    .and('not.be.disabled')
    .click();
  
  cy.get('[data-testid="combat-log"]', { timeout: 2000 })
    .should('contain', '공격');
});
```

### 2. Over-Generous Timeouts
```typescript
// ❌ BAD: 30 second timeout hides performance issues
it("should load screen", () => {
  cy.get('[data-testid="combat-screen"]', { timeout: 30000 })
    .should("exist");
});

// ✅ GOOD: Reasonable timeout catches performance issues
it("should load screen quickly", () => {
  const startTime = Date.now();
  
  cy.get('[data-testid="combat-screen"]', { timeout: 5000 })
    .should("exist");
  
  cy.wrap(Date.now() - startTime).should('be.lessThan', 3000);
});
```

### 3. Silent Error Swallowing
```typescript
// ❌ BAD: Catches errors and continues
it("should test feature", () => {
  cy.get("body").then(() => {
    try {
      cy.get('[data-testid="feature"]').click();
    } catch (e) {
      cy.log("⚠️ Feature not found, continuing");
    }
  });
});

// ✅ GOOD: Fail fast or skip appropriately
it("should test feature if implemented", () => {
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid="feature"]').length === 0) {
      cy.log("ℹ️ Feature not implemented");
      this.skip();
    } else {
      cy.get('[data-testid="feature"]')
        .should('be.visible')
        .click();
      // Verify click had effect
      cy.get('[data-testid="feature-result"]')
        .should('contain', 'success');
    }
  });
});
```

### 4. Testing Implementation Details
```typescript
// ❌ BAD: Tests internal function calls
it("should call damage calculation", () => {
  cy.window().then(win => {
    const spy = cy.spy(win.game, 'calculateDamage');
    cy.get("body").type(" ");
    expect(spy).to.have.been.called;
  });
});

// ✅ GOOD: Tests user-visible outcome
// NOTE: Requires data-health attribute on ProgressBar
it("should deal damage when attacking", () => {
  cy.get('[data-testid="player2-health"]')
    .invoke('attr', 'data-health')
    .as('before');
  
  cy.get("body").type(" ");
  
  cy.get('@before').then(before => {
    cy.get('[data-testid="player2-health"]')
      .invoke('attr', 'data-health')
      .then(after => {
        expect(parseFloat(after)).to.be.lessThan(parseFloat(before));
      });
  });
});
```

### 5. Flaky Test Patterns
```typescript
// ❌ BAD: Race condition - may click before button is interactive
it("should navigate to combat", () => {
  cy.get('[data-testid="combat-button"]').click();
  cy.get('[data-testid="combat-screen"]').should("exist");
});

// ✅ GOOD: Wait for button to be ready
it("should navigate to combat", () => {
  cy.get('[data-testid="combat-button"]')
    .should('be.visible')
    .and('not.be.disabled')
    .click();
  
  cy.get('[data-testid="combat-screen"]', { timeout: 5000 })
    .should('exist')
    .and('be.visible');
});
```

---

## 📊 Test Quality Metrics

### Good Test Characteristics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Strong Assertions** | >70% | Count `.contain()`, `expect()`, value checks |
| **Weak Assertions** | <30% | Count `.exist()`, `.visible()` only |
| **Fixed Waits** | <20 total | Count `cy.wait(number)` |
| **Assertion-Based Waits** | >80% | Count `.should()` with timeout |
| **Game Mechanic Verification** | >50% tests | Tests that verify outcomes, not just UI |
| **Timeout Duration** | ≤8000ms | Except page load (12000ms) |
| **Test Duration** | <5s | Simple tests should be fast |

### Code Review Checklist

When reviewing E2E test PRs:

**Must Have:**
- [ ] Test name clearly describes what is being tested
- [ ] Test verifies actual game behavior, not just UI presence
- [ ] Assertions check values/state, not only existence
- [ ] No fixed waits >300ms (justified if used)
- [ ] No silent error catching
- [ ] Test is reliable (no flakiness when run 5 times)

**Should Have:**
- [ ] Test documents edge cases tested
- [ ] Korean text includes English translation
- [ ] Test completes in <5 seconds
- [ ] No redundant assertions or checks

**Nice to Have:**
- [ ] Test includes performance assertions
- [ ] Test verifies accessibility
- [ ] Test includes negative scenarios

---

## 🔧 Custom Commands to Use

### Available Helper Commands

```typescript
// Navigation
cy.enterCombatMode();
cy.enterTrainingMode();
cy.returnToIntro();

// Game Actions
cy.gameActions(["1", " ", "w", "a", "s", "d"]); // Batch actions
cy.practiceStance(1, 3); // Stance number, repetitions

// Waiting & Verification
cy.waitForCanvasReady(); // Wait for Three.js canvas
cy.checkCanvasVisibility(); // Verify canvas visible
cy.waitForGameReady(); // Wait for game initialization

// Performance
cy.assertMinFPS(40, 2000); // Min FPS, duration
cy.assertSmoothFPS(2000); // Expect 60fps
cy.assertCanvasRendering(1000); // Verify actively rendering
cy.assertNoMemoryLeaks(3000); // Check memory usage

// Three.js Verification ⚠️ NOT YET IMPLEMENTED
// See E2E_TEST_IMPROVEMENTS_BACKLOG.md Issue #2
// Requires: 1) Exposing scene via window.__threeScene in dev mode
//           2) Adding custom Cypress command to cypress/support/commands.ts
// Example usage (will NOT work until implemented):
cy.verifyThreeJSScene({ minChildren: 5, requiredTypes: ['PerspectiveCamera'] });

// Annotation
cy.annotate("Testing combat mechanics"); // Add visible annotation
```

---

## 📚 Additional Resources

### Documentation
- **E2E Test Plan:** `E2ETestPlan.md`
- **Audit Report:** `E2E_TEST_AUDIT_REPORT.md`
- **Improvements Backlog:** `E2E_TEST_IMPROVEMENTS_BACKLOG.md`
- **Three.js Testing Guide:** `THREEJS_TESTING_GUIDE.md`
- **Cypress Documentation:** https://docs.cypress.io/

### Examples
- **Good Example:** `cypress/e2e/performance-threejs.cy.ts` (FPS testing)
- **Needs Improvement:** `cypress/e2e/combat.cy.ts` (add game mechanic verification)
- **Needs Improvement:** `cypress/e2e/training.cy.ts` (add stance verification)

### Support
- **Slack Channel:** #testing (if available)
- **Code Review:** Request review from test engineering team
- **Questions:** Open discussion issue in GitHub

---

## ✅ Summary

**Golden Rules:**
1. ✅ Test behavior, not implementation
2. ✅ Verify game state, not just UI presence
3. ✅ Use assertion-based waiting
4. ✅ Fail fast on critical features
5. ✅ Run tests multiple times to verify reliability

**Before Merging:**
- [ ] Run test 5 times - no flakiness
- [ ] Test verifies actual game mechanics
- [ ] No fixed waits >300ms
- [ ] No silent error catching
- [ ] Strong assertions (values, not just existence)
- [ ] Code review approval

**흑괘의 길을 걸어라** - *Walk the Path of the Black Trigram*

---

**Document Version:** 1.0  
**Effective Date:** 2025-01-25  
**Next Review:** 2025-04-25 (3 months)
