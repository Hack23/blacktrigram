# E2E Test Best Practices Guide

**Black Trigram (흑괘) - Cypress 15+ & Vitest 4.0**  
**Version:** 1.0  
**Date:** 2026-01-19  
**Status:** Active

---

## Quick Reference

### ❌ DON'T DO THIS
```typescript
// BAD: Fixed waits
cy.wait(300);
cy.get('button').click();
cy.wait(500);

// BAD: No validation
cy.get('button').click();
// What happened? Did it work?

// BAD: Ignoring state
cy.get('[data-testid="health"]').should('exist');
// Is it the right value?
```

### ✅ DO THIS INSTEAD
```typescript
// GOOD: Assertion-based waits
cy.get('button', { timeout: 2000 })
  .should('be.visible')
  .click();

cy.get('[data-testid="success"]', { timeout: 1500 })
  .should('exist')
  .and('be.visible');

// GOOD: Validate state changes
cy.get('[data-testid="health"]')
  .invoke('attr', 'data-current')
  .then(initial => {
    cy.get('button').click();
    cy.get('[data-testid="health"]', { timeout: 1500 })
      .invoke('attr', 'data-current')
      .should('not.equal', initial);
  });
```

---

## Core Principles

### 1. **Fail Fast, Fail Clear**
```typescript
// ❌ BAD: Silent failure
cy.get('button').click();
cy.wait(1000); // Hope it worked?

// ✅ GOOD: Explicit validation
cy.get('button', { timeout: 2000 })
  .should('be.visible', 'Button should be visible before clicking')
  .click();

cy.get('[data-testid="result"]', { timeout: 1500 })
  .should('exist', 'Result should appear after click')
  .and('be.visible', 'Result should be visible to user');
```

### 2. **Assert State Changes**
```typescript
// ❌ BAD: No state verification
cy.get('body').type('1'); // Change stance
// Did it actually change?

// ✅ GOOD: Verify state changed
cy.get('[data-testid="stance"]')
  .invoke('text')
  .then(oldStance => {
    cy.get('body').type('1');
    
    cy.get('[data-testid="stance"]', { timeout: 1000 })
      .invoke('text')
      .should('not.equal', oldStance)
      .and('include', 'geon');
  });
```

### 3. **Use Cypress 15 Features**
```typescript
// ✅ NEW: cy.session() for test isolation
beforeEach(() => {
  cy.session('combat-mode', () => {
    cy.visit('/');
    cy.enterCombatMode();
  }, {
    validate: () => {
      cy.get('[data-testid="combat-screen"]').should('exist');
    }
  });
});

// ✅ NEW: Per-test performance budgets
it('should load quickly', () => {
  const start = Date.now();
  
  cy.get('[data-testid="element"]').should('exist');
  
  cy.wrap(null).then(() => {
    const duration = Date.now() - start;
    expect(duration).to.be.lessThan(1000);
    cy.task('logPerformance', { name: 'Load Time', duration });
  });
});
```

### 4. **Always Clean Up**
```typescript
// ✅ GOOD: Comprehensive cleanup
afterEach(() => {
  // Clean game state
  cy.window().then(win => {
    if ((win as any).__game?.cleanup) {
      (win as any).__game.cleanup();
    }
  });
  
  // Return to known state
  cy.get('body').then($body => {
    if ($body.find('[data-testid="combat-screen"]').length > 0) {
      cy.returnToIntro();
    }
  });
});
```

---

## Pattern Library

### Pattern 1: Replace cy.wait() with Assertions

#### ❌ BEFORE
```typescript
describe('Combat Test', () => {
  it('should attack', () => {
    cy.enterCombatMode();
    cy.wait(500); // Wait for screen
    cy.get('body').type(' '); // Attack
    cy.wait(300); // Wait for damage
    cy.log('Attack completed');
  });
});
```

#### ✅ AFTER
```typescript
describe('Combat Test', () => {
  it('should attack with damage verification', () => {
    cy.enterCombatMode();
    
    // Wait for combat screen using assertion
    cy.get('[data-testid="combat-screen"]', { timeout: 3000 })
      .should('exist')
      .and('be.visible');
    
    // Capture health before attack
    cy.get('[data-testid="opponent-health"]')
      .invoke('attr', 'data-current')
      .then(initialHealth => {
        // Execute attack
        cy.get('body').type(' ');
        
        // Verify damage was dealt (assertion-based wait)
        cy.get('[data-testid="opponent-health"]', { timeout: 1500 })
          .invoke('attr', 'data-current')
          .should('not.equal', initialHealth)
          .then(newHealth => {
            const damage = parseFloat(initialHealth) - parseFloat(newHealth);
            expect(damage).to.be.greaterThan(0);
            cy.log(`Attack dealt ${damage.toFixed(1)} damage`);
          });
      });
  });
});
```

**Benefits:**
- ✅ Validates damage was actually dealt
- ✅ Fails fast if health doesn't change
- ✅ No arbitrary timeouts
- ✅ Clear error messages

---

### Pattern 2: Validate UI State Changes

#### ❌ BEFORE
```typescript
it('should select archetype', () => {
  cy.get('[data-testid="archetype-musa"]').click();
  cy.wait(200);
  cy.log('Archetype selected');
});
```

#### ✅ AFTER
```typescript
it('should select archetype with validation', () => {
  // Capture initial state
  cy.get('[data-testid="selected-archetype"]')
    .invoke('text')
    .then(initial => {
      // Perform action
      cy.get('[data-testid="archetype-musa"]', { timeout: 2000 })
        .should('be.visible')
        .click();
      
      // Verify state changed
      cy.get('[data-testid="selected-archetype"]', { timeout: 1500 })
        .invoke('text')
        .should('not.equal', initial)
        .and('include', 'musa');
      
      // Verify visual feedback
      cy.get('[data-testid="archetype-musa"]')
        .should('have.attr', 'data-selected', 'true');
      
      cy.log('✅ Archetype musa selected and verified');
    });
});
```

---

### Pattern 3: Test with Performance Budgets

#### ❌ BEFORE
```typescript
it('should navigate screens', () => {
  cy.get('[data-testid="combat-button"]').click();
  cy.wait(1000);
  cy.returnToIntro();
  cy.wait(1000);
});
```

#### ✅ AFTER
```typescript
it('should navigate screens within performance budget', () => {
  const startTime = Date.now();
  
  // Navigate to combat
  cy.get('[data-testid="combat-button"]', { timeout: 2000 })
    .should('be.visible')
    .click();
  
  cy.get('[data-testid="combat-screen"]', { timeout: 3000 })
    .should('exist')
    .and('be.visible');
  
  const navTime = Date.now() - startTime;
  expect(navTime, 'Navigation should be fast').to.be.lessThan(3000);
  
  // Return to intro
  cy.returnToIntro();
  
  cy.get('[data-testid="intro-screen"]', { timeout: 3000 })
    .should('exist');
  
  // Total time budget
  cy.wrap(null).then(() => {
    const totalTime = Date.now() - startTime;
    expect(totalTime, 'Round trip should complete quickly').to.be.lessThan(5000);
    cy.task('logPerformance', { name: 'Screen Navigation', duration: totalTime });
  });
});
```

---

### Pattern 4: Combat Action with Full Validation

#### ❌ BEFORE
```typescript
it('should change stance and attack', () => {
  cy.enterCombatMode();
  cy.wait(500);
  cy.get('body').type('1'); // Stance
  cy.wait(100);
  cy.get('body').type(' '); // Attack
  cy.wait(300);
  cy.returnToIntro();
});
```

#### ✅ AFTER
```typescript
it('should change stance and verify attack damage', () => {
  cy.enterCombatMode();
  
  // Wait for combat ready
  cy.get('[data-testid="combat-screen"]', { timeout: 3000 }).should('exist');
  cy.get('[data-testid="player1-stance"]', { timeout: 2000 }).should('exist');
  
  // Change stance with verification
  cy.get('[data-testid="player1-stance"]')
    .invoke('text')
    .then(oldStance => {
      cy.get('body').type('1');
      
      cy.get('[data-testid="player1-stance"]', { timeout: 1000 })
        .invoke('text')
        .should('not.equal', oldStance)
        .and('include', 'geon');
      
      cy.log('✅ Stance changed to geon');
    });
  
  // Attack with damage verification
  cy.get('[data-testid="opponent-health"]')
    .invoke('attr', 'data-current')
    .then(beforeHealth => {
      cy.get('body').type(' ');
      
      cy.get('[data-testid="opponent-health"]', { timeout: 1500 })
        .invoke('attr', 'data-current')
        .should('not.equal', beforeHealth)
        .then(afterHealth => {
          const before = parseFloat(beforeHealth);
          const after = parseFloat(afterHealth);
          const damage = before - after;
          
          expect(damage, 'Damage should be positive').to.be.greaterThan(0);
          expect(after, 'Health should not go negative').to.be.at.least(0);
          
          cy.log(`✅ Attack dealt ${damage.toFixed(1)} damage (${before.toFixed(1)} → ${after.toFixed(1)})`);
        });
    });
  
  // Performance check
  cy.assertMinFPS(30, 2000);
  
  // Clean return
  cy.returnToIntro();
  cy.get('[data-testid="intro-screen"]', { timeout: 3000 }).should('exist');
});
```

**What Changed:**
- ✅ No fixed waits
- ✅ Stance change verified
- ✅ Attack damage validated
- ✅ Health bounds checked
- ✅ Performance monitored
- ✅ Clear logging

---

### Pattern 5: Three.js Rendering Verification

#### ❌ BEFORE
```typescript
it('should render canvas', () => {
  cy.visit('/');
  cy.wait(1000);
  cy.get('canvas').should('exist');
});
```

#### ✅ AFTER
```typescript
it('should verify Three.js is actively rendering', () => {
  cy.visit('/');
  
  // Verify canvas exists and has dimensions
  cy.get('canvas', { timeout: 3000 })
    .should('exist')
    .and('be.visible')
    .and($canvas => {
      const canvas = $canvas[0] as HTMLCanvasElement;
      expect(canvas.width).to.be.greaterThan(100);
      expect(canvas.height).to.be.greaterThan(100);
    });
  
  // Verify rendering is active (not frozen/blank)
  cy.verifyThreeJSRendering({
    timeout: 3000,
    minPixelChange: 50
  });
  
  // Verify performance
  cy.assertSmoothFPS(2000); // Target 60fps
  
  cy.log('✅ Three.js rendering verified as active and smooth');
});
```

---

## Cypress 15 Features Checklist

### Session Management ✅ NEW
```typescript
describe('Combat Tests', () => {
  // ✅ Use cy.session() for consistent state
  beforeEach(() => {
    cy.session('combat-session', () => {
      cy.visitWithWebGLMock('/');
      cy.waitForCanvasReady();
      cy.enterCombatMode();
    }, {
      validate: () => {
        cy.get('[data-testid="combat-screen"]').should('exist');
      },
      cacheAcrossSpecs: false // Test isolation
    });
    
    // Ensure we're in combat after session restore
    cy.get('[data-testid="combat-screen"]').should('exist');
  });
});
```

### Per-Test Retries ✅ NEW
```typescript
// cypress.config.ts
{
  retries: {
    runMode: 1,
    openMode: 0
  }
}

// In test file - override for specific test
it('potentially flaky test', { retries: 2 }, () => {
  // Test code
});
```

### Test Isolation ✅ ENABLED
```typescript
// cypress.config.ts
{
  testIsolation: true, // ✅ Already enabled
  experimentalMemoryManagement: true, // ✅ Already enabled
  experimentalRunAllSpecs: true, // ✅ Already enabled
}
```

---

## Vitest 4.0 Integration

### Shared Test Utilities
```typescript
// src/test/shared/test-helpers.ts
export const createMockPlayer = (overrides = {}) => ({
  health: 100,
  maxHealth: 100,
  stance: 'geon',
  position: { x: 0, y: 0 },
  ...overrides
});

// Use in Cypress
cy.window().then(win => {
  (win as any).__testPlayer = createMockPlayer({ health: 50 });
});

// Use in Vitest
import { createMockPlayer } from '../test/shared/test-helpers';
const player = createMockPlayer({ health: 50 });
```

### Cross-Framework Assertions
```typescript
// src/test/shared/assertions.ts
export const assertHealthInRange = (health: number, min: number, max: number) => {
  if (health < min || health > max) {
    throw new Error(`Health ${health} not in range [${min}, ${max}]`);
  }
  return true;
};

// Use in both Cypress and Vitest
assertHealthInRange(player.health, 0, 100);
```

---

## Common Mistakes & Fixes

### Mistake 1: Not Waiting for Elements
```typescript
// ❌ BAD
cy.get('button').click(); // Might not be ready

// ✅ GOOD
cy.get('button', { timeout: 2000 })
  .should('be.visible')
  .and('not.be.disabled')
  .click();
```

### Mistake 2: Ignoring Test Isolation
```typescript
// ❌ BAD: Shared state
let playerHealth = 100;
it('test 1', () => { playerHealth = 50; });
it('test 2', () => { expect(playerHealth).to.equal(100); }); // FAILS!

// ✅ GOOD: Fresh state per test
it('test 1', () => {
  cy.window().then(win => {
    (win as any).__playerHealth = 50;
  });
});

it('test 2', () => {
  cy.window().then(win => {
    (win as any).__playerHealth = 100;
    expect((win as any).__playerHealth).to.equal(100);
  });
});
```

### Mistake 3: No Error Handling
```typescript
// ❌ BAD
cy.get('[data-testid="button"]').click();
// What if it errors?

// ✅ GOOD
cy.get('body').then($body => {
  if ($body.find('[data-testid="button"]').length > 0) {
    cy.get('[data-testid="button"]').click();
  } else {
    cy.log('⚠️ Button not found, using fallback');
    cy.get('body').type('1'); // Keyboard shortcut
  }
});

// Verify no errors occurred
cy.get('[data-testid="error"]').should('not.exist');
```

### Mistake 4: Missing Performance Checks
```typescript
// ❌ BAD: No performance validation
it('should render', () => {
  cy.get('canvas').should('exist');
});

// ✅ GOOD: With performance budget
it('should render with good performance', () => {
  const start = Date.now();
  
  cy.get('canvas', { timeout: 3000 }).should('exist');
  
  cy.wrap(null).then(() => {
    const duration = Date.now() - start;
    expect(duration).to.be.lessThan(2000);
  });
  
  cy.assertSmoothFPS(2000);
});
```

---

## Migration Checklist

Use this checklist when updating existing tests:

### Per Test File
- [ ] Remove all fixed `cy.wait()` calls
- [ ] Add `cy.session()` to beforeEach
- [ ] Add explicit assertions after actions
- [ ] Validate state changes
- [ ] Add performance checks
- [ ] Implement proper cleanup
- [ ] Add error handling
- [ ] Update test descriptions
- [ ] Add fail-fast error messages
- [ ] Test in isolation

### Validation
- [ ] Run test 3x to check for flakiness
- [ ] Verify execution time improved
- [ ] Check all assertions pass
- [ ] Verify cleanup works
- [ ] Check no error leaks

---

## Quick Wins

### 1. Replace Top 10 cy.wait() Calls
Target the most-used fixed waits first:
```bash
# Find most common waits
grep -r "cy.wait(" cypress/e2e --include="*.cy.ts" | \
  sed 's/.*cy.wait(\([0-9]*\).*/\1/' | \
  sort | uniq -c | sort -rn | head -10
```

### 2. Add Missing Assertions
After every action, ask: "What changed?"
```typescript
cy.get('button').click();
// What should happen now?
cy.get('[data-testid="result"]').should('exist'); // ✅ Add this!
```

### 3. Use Custom Commands
Leverage existing commands:
```typescript
// ✅ Use these instead of manual steps
cy.enterCombatMode();
cy.enterTrainingMode();
cy.returnToIntro();
cy.waitForCanvasReady();
cy.verifyHealthBar('player1-health', 0, 100);
cy.assertMinFPS(30, 2000);
```

---

## Success Metrics

### Before Improvements
- ❌ 117 fixed waits
- ❌ ~10-12 minute execution
- ❌ Limited validation
- ❌ Some flaky tests

### After Improvements
- ✅ <40 fixed waits (65% reduction)
- ✅ <8 minute execution (33% faster)
- ✅ Explicit validation everywhere
- ✅ 0% flaky test rate

---

## Resources

### Documentation
- [Cypress 15 Docs](https://docs.cypress.io/guides/overview/why-cypress)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Three.js Cypress Testing](./CHROME_CYPRESS_THREEJS_CONFIG.md)
- [E2E Test Plan](./E2ETestPlan.md)

### Internal Docs
- [E2E Improvement Analysis](./E2E_TEST_IMPROVEMENT_ANALYSIS.md)
- [Unit Test Plan](./UnitTestPlan.md)
- [Architecture](./ARCHITECTURE.md)

---

**Version:** 1.0  
**Last Updated:** 2026-01-19  
**Maintained By:** Test Specialist Agent  
**Review Cycle:** Monthly
