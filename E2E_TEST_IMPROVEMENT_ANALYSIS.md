# E2E Test Improvement Analysis

**Project:** Black Trigram (흑괘)  
**Date:** 2026-01-19  
**Cypress Version:** 15.9.0  
**Vitest Version:** 4.0.17  
**Status:** In Progress

---

## Executive Summary

This document provides a comprehensive analysis of Black Trigram's E2E test suite and outlines improvements to enhance test validation, fail-fast mechanisms, and leverage modern Cypress 15+ and Vitest 4.0 features.

### Key Metrics

| Metric | Current Value | Target | Status |
|--------|--------------|--------|---------|
| **Total E2E Tests** | 9 test files | - | ✅ |
| **Fixed Waits (cy.wait)** | 117 calls | <30 calls | ⚠️ Needs Improvement |
| **Test Files with Waits** | 8/9 files | <3/9 files | ⚠️ Needs Improvement |
| **Should Assertions** | 94 | >150 | ⚠️ Needs More |
| **Expect Assertions** | 52 | >80 | ⚠️ Needs More |
| **Cypress Version** | 15.9.0 | 15.9.0 | ✅ Latest |
| **Vitest Version** | 4.0.17 | 4.0.17 | ✅ Latest |

---

## Issues Identified

### 1. **Excessive Fixed Waits (HIGH PRIORITY)**

**Problem:**
- 117 `cy.wait()` calls across test suite
- Most waits are time-based rather than condition-based
- Slows down tests and can cause flakiness

**Examples from Current Tests:**
```typescript
// ❌ BAD: Fixed wait without condition
cy.wait(300);

// ❌ BAD: Arbitrary wait for canvas
cy.wait(800); // Wait for Three.js to initialize

// ❌ BAD: Sequential fixed waits
cy.wait(200);
cy.wait(150);
cy.wait(200);
```

**Impact:**
- Test execution time: ~10-12 minutes (could be 5-7 minutes)
- Flakiness risk: Medium (waits may be too short or too long)
- Fail-fast: Poor (waits delay error detection)

**Solution:**
```typescript
// ✅ GOOD: Assertion-based wait
cy.get('[data-testid="combat-screen"]', { timeout: 5000 })
  .should('exist')
  .and('be.visible');

// ✅ GOOD: Wait for specific condition
cy.get('canvas').should($canvas => {
  expect($canvas[0].width).to.be.greaterThan(0);
});

// ✅ GOOD: Wait for rendering to complete
cy.waitForCanvasReady(); // Uses assertions internally

// ✅ GOOD: Wait for network/animations
cy.waitUntil(() => 
  cy.window().then(win => win.__appReady === true)
, { timeout: 5000, interval: 100 });
```

### 2. **Missing Explicit Validations (MEDIUM PRIORITY)**

**Problem:**
- Many actions execute without verifying results
- Health changes not always verified
- Stance changes not always confirmed
- Movement effects not validated

**Examples from CombatScreen Test:**
```typescript
// ❌ BAD: Attack without verification
cy.get("body").type(" ");
cy.wait(300);
// No verification that damage was dealt

// ❌ BAD: Stance change without verification
cy.get("body").type("1");
cy.wait(100);
// No verification that stance actually changed

// ❌ BAD: Movement without verification
cy.gameActions(["w", "a", "s", "d"]);
cy.log("✅ WASD movement tested");
// No verification of position change
```

**Solution:**
```typescript
// ✅ GOOD: Attack with health verification
cy.get('[data-testid="player2-health"]')
  .invoke('attr', 'data-current')
  .then(initialHealth => {
    cy.get("body").type(" ");
    
    cy.get('[data-testid="player2-health"]', { timeout: 1000 })
      .invoke('attr', 'data-current')
      .should('be.lessThan', initialHealth);
  });

// ✅ GOOD: Stance change with verification
cy.get("body").type("1");
cy.get('[data-testid="player1-stance-indicator"]', { timeout: 1000 })
  .should('include.text', 'geon');

// ✅ GOOD: Movement with position verification
cy.window().then(win => {
  const initialPos = win.__playerPosition;
  cy.get("body").type("w");
  
  cy.window().should(w => {
    expect(w.__playerPosition.y).to.not.equal(initialPos.y);
  });
});
```

### 3. **Cypress 15+ Features Not Fully Utilized (MEDIUM PRIORITY)**

**Available Features Not Used:**
- ✅ `experimentalMemoryManagement` - ENABLED
- ✅ `experimentalRunAllSpecs` - ENABLED
- ❌ `cy.session()` - NOT USED (test isolation)
- ❌ Component testing with Vite - MINIMAL USE
- ❌ Cypress 15 test retries - BASIC CONFIG ONLY
- ❌ `cy.origin()` - NOT APPLICABLE (single origin)
- ❌ Advanced selector strategies - NOT USED

**Recommendations:**

#### Use `cy.session()` for Better Test Isolation
```typescript
// ✅ NEW: Session-based test isolation
beforeEach(() => {
  cy.session('game-state', () => {
    cy.visitWithWebGLMock("/");
    cy.waitForCanvasReady();
  }, {
    validate: () => {
      cy.get('[data-testid="intro-screen"]').should('exist');
    }
  });
});
```

#### Leverage Component Testing
```typescript
// ✅ NEW: Component test for CombatHUD
import { CombatHUD } from '../../src/components/combat/CombatHUD';

describe('CombatHUD Component', () => {
  it('should display health correctly', () => {
    cy.mount(<CombatHUD health={75} maxHealth={100} />);
    cy.get('[data-testid="health-bar"]')
      .should('have.attr', 'data-percentage', '75');
  });
});
```

#### Advanced Retries Configuration
```typescript
// cypress.config.ts - ✅ IMPROVED
{
  retries: {
    runMode: 1, // Already optimal
    openMode: 0, // Already optimal
  },
  // NEW: Per-test retry configuration
  env: {
    FLAKY_TEST_RETRIES: 2, // For known flaky tests
  }
}

// In test file:
it('flaky test', { retries: Cypress.env('FLAKY_TEST_RETRIES') }, () => {
  // Test code
});
```

### 4. **Vitest 4.0 Integration Opportunities (LOW PRIORITY)**

**Current State:**
- Vitest 4.0.17 configured for unit tests
- No shared utilities between Cypress and Vitest
- Separate test helpers

**Opportunities:**

#### Shared Test Utilities
```typescript
// ✅ NEW: src/test/shared/test-helpers.ts
export const createMockPlayer = (overrides = {}) => ({
  health: 100,
  maxHealth: 100,
  stance: 'geon',
  position: { x: 0, y: 0 },
  ...overrides
});

// Use in Vitest:
import { createMockPlayer } from '../test/shared/test-helpers';
const player = createMockPlayer({ health: 50 });

// Use in Cypress:
import { createMockPlayer } from '../../src/test/shared/test-helpers';
cy.window().then(win => {
  win.__mockPlayer = createMockPlayer({ health: 50 });
});
```

#### Cross-Framework Assertions
```typescript
// ✅ NEW: src/test/shared/assertions.ts
export const assertHealthInRange = (health: number, min: number, max: number) => {
  if (health < min || health > max) {
    throw new Error(`Health ${health} not in range [${min}, ${max}]`);
  }
};

// Use in Vitest:
import { assertHealthInRange } from './shared/assertions';
assertHealthInRange(player.health, 0, 100);

// Use in Cypress:
cy.get('[data-testid="health"]').invoke('text').then(h => {
  assertHealthInRange(Number(h), 0, 100);
});
```

### 5. **Cleanup and Test Isolation (MEDIUM PRIORITY)**

**Current State:**
- Basic cleanup in some tests
- Global beforeEach/afterEach in e2e.ts
- Some tests don't properly cleanup

**Issues:**
```typescript
// ❌ BAD: No cleanup after combat
describe('Combat Tests', () => {
  it('should attack', () => {
    cy.enterCombatMode();
    cy.get('body').type(' ');
    // No returnToIntro or cleanup
  });
});

// ❌ BAD: Shared state between tests
let playerHealth = 100; // Shared state!
it('test 1', () => { playerHealth -= 10; });
it('test 2', () => { 
  expect(playerHealth).to.equal(100); // FAILS!
});
```

**Solution:**
```typescript
// ✅ GOOD: Proper cleanup
describe('Combat Tests', () => {
  beforeEach(() => {
    cy.visitWithWebGLMock("/");
    cy.waitForCanvasReady();
  });

  afterEach(() => {
    // Clean up game state
    cy.window().then(win => {
      if (win.__game) {
        win.__game.cleanup();
      }
    });
    
    // Return to intro if not already there
    cy.get('body').then($body => {
      if ($body.find('[data-testid="combat-screen"]').length > 0) {
        cy.returnToIntro();
      }
    });
  });

  it('should attack', () => {
    cy.enterCombatMode();
    cy.get('body').type(' ');
    // Cleanup handled by afterEach
  });
});
```

### 6. **Performance Assertions Missing (LOW PRIORITY)**

**Current State:**
- FPS monitoring utilities exist but underutilized
- No performance budgets per test
- No frame drop detection

**Recommendation:**
```typescript
// ✅ NEW: Performance budget per test
describe('Combat Performance', () => {
  it('should maintain 60fps during combat', () => {
    cy.enterCombatMode();
    
    // Measure baseline FPS
    cy.assertSmoothFPS(2000); // 60fps target
    
    // Perform intensive action
    cy.practiceStance(1, 10);
    
    // FPS should remain stable
    cy.assertMinFPS(55, 2000); // Allow small drop
  });
});

// ✅ NEW: Frame drop detection
cy.monitorFPS(5000, 60).then(metrics => {
  const dropRate = (metrics.droppedFrames / metrics.samples) * 100;
  expect(dropRate).to.be.lessThan(10);
  cy.log(`Frame drop rate: ${dropRate.toFixed(1)}%`);
});
```

---

## Improvement Roadmap

### Phase 1: Critical Fixes (Week 1)
**Priority:** HIGH  
**Goal:** Fix fail-fast and validation issues

- [ ] Audit all `cy.wait()` calls
- [ ] Replace 80%+ fixed waits with assertion-based waits
- [ ] Add explicit assertions after all actions
- [ ] Implement proper error messages

**Success Criteria:**
- `cy.wait()` calls reduced from 117 to <40
- All actions have corresponding assertions
- Test execution time reduced by 20%+

### Phase 2: Cypress 15 Features (Week 2)
**Priority:** MEDIUM  
**Goal:** Leverage modern Cypress features

- [ ] Implement `cy.session()` for test isolation
- [ ] Add component tests for UI components
- [ ] Configure advanced retry strategies
- [ ] Optimize test parallelization

**Success Criteria:**
- 5+ components have component tests
- `cy.session()` used in all test files
- Test reliability score >98%

### Phase 3: Vitest Integration (Week 3)
**Priority:** LOW  
**Goal:** Share utilities across frameworks

- [ ] Create shared test utilities
- [ ] Implement cross-framework assertions
- [ ] Add Vitest browser mode tests
- [ ] Optimize coverage reporting

**Success Criteria:**
- 10+ shared utilities
- Coverage reports consolidated
- Browser mode tests for critical paths

### Phase 4: Performance & Reliability (Week 4)
**Priority:** MEDIUM  
**Goal:** Ensure fast, reliable tests

- [ ] Add performance budgets
- [ ] Implement comprehensive cleanup
- [ ] Add flaky test detection
- [ ] Document test patterns

**Success Criteria:**
- All tests have performance assertions
- Zero flaky tests detected
- Test execution time <8 minutes
- Documentation complete

---

## Test Patterns to Follow

### Pattern 1: Assertion-Based Waits
```typescript
// ❌ AVOID
cy.wait(500);

// ✅ PREFER
cy.get('[data-testid="element"]', { timeout: 2000 })
  .should('exist')
  .and('be.visible');

// ✅ BEST
cy.get('[data-testid="element"]').should($el => {
  expect($el).to.be.visible;
  expect($el.attr('data-ready')).to.equal('true');
});
```

### Pattern 2: Action + Verification
```typescript
// ❌ AVOID
cy.get('button').click();
cy.wait(300);

// ✅ PREFER
cy.get('button').click();
cy.get('[data-testid="success-message"]')
  .should('be.visible');

// ✅ BEST
cy.get('button').click();
cy.get('[data-testid="success-message"]')
  .should('be.visible')
  .and('contain.text', 'Success');
cy.get('[data-testid="result"]')
  .should('have.attr', 'data-state', 'completed');
```

### Pattern 3: State Change Verification
```typescript
// ❌ AVOID
cy.get('body').type('1'); // Change stance
// No verification

// ✅ PREFER
cy.get('body').type('1');
cy.get('[data-testid="stance-indicator"]')
  .should('contain.text', 'geon');

// ✅ BEST
cy.get('[data-testid="stance-indicator"]')
  .invoke('text')
  .then(initialStance => {
    cy.get('body').type('1');
    cy.get('[data-testid="stance-indicator"]', { timeout: 1000 })
      .invoke('text')
      .should('not.equal', initialStance)
      .and('include', 'geon');
  });
```

### Pattern 4: Error Handling
```typescript
// ❌ AVOID
cy.get('[data-testid="button"]').click();
// No error handling

// ✅ PREFER
cy.get('[data-testid="button"]').click();
cy.get('[data-testid="error"]').should('not.exist');

// ✅ BEST
cy.get('[data-testid="button"]').click();
cy.get('body').then($body => {
  // Verify no error elements exist
  expect($body.find('[data-testid="error"]')).to.have.length(0);
  expect($body.find('.error-message')).to.have.length(0);
  
  // Verify success state
  expect($body.find('[data-testid="success"]')).to.have.length.greaterThan(0);
});
```

### Pattern 5: Performance Assertions
```typescript
// ❌ AVOID
cy.get('canvas').should('exist');
// No performance check

// ✅ PREFER
cy.get('canvas').should('exist');
cy.assertMinFPS(30, 2000);

// ✅ BEST
cy.get('canvas').should('exist');
cy.assertSmoothFPS(3000); // 60fps target

const startTime = Date.now();
cy.get('button').click();
cy.get('[data-testid="result"]').should('exist');
cy.wrap(null).then(() => {
  const duration = Date.now() - startTime;
  expect(duration).to.be.lessThan(500); // 500ms budget
  cy.task('logPerformance', { name: 'Action', duration });
});
```

---

## Cypress 15+ Features Checklist

### Already Enabled ✅
- [x] `experimentalMemoryManagement: true`
- [x] `numTestsKeptInMemory: 3`
- [x] `experimentalRunAllSpecs: true`
- [x] `testIsolation: true`
- [x] `waitForAnimations: false`
- [x] `animationDistanceThreshold: 5`

### To Implement 📋
- [ ] `cy.session()` for test state management
- [ ] Component testing with React 19
- [ ] Advanced test parallelization
- [ ] Custom selector strategies
- [ ] Test replay functionality
- [ ] CI-specific optimizations

---

## Vitest 4.0 Features Checklist

### Already Enabled ✅
- [x] Vitest 4.0.17
- [x] Coverage with v8 provider
- [x] HTML + LCOV reporters
- [x] Global test environment

### To Implement 📋
- [ ] Vitest browser mode (experimental)
- [ ] Shared test fixtures with Cypress
- [ ] Cross-framework test utilities
- [ ] Unified coverage reporting
- [ ] Performance benchmarking

---

## Success Metrics

### Test Execution Time
- **Current:** ~10-12 minutes
- **Target:** <8 minutes
- **Stretch Goal:** <6 minutes

### Test Reliability
- **Current:** 100% pass rate (10/10)
- **Target:** 100% pass rate with 3x runs
- **Flaky Rate:** <0.5%

### Code Coverage
- **Current Unit:** 76%
- **Current E2E:** Not tracked
- **Target:** 80% combined

### Assertion Density
- **Current:** ~146 assertions / 117 waits = 1.25 ratio
- **Target:** >3.0 ratio (more assertions, fewer waits)

---

## Next Steps

1. **Immediate Actions (This Week):**
   - Run test suite 3x to identify flaky tests
   - Audit top 5 most-used test files
   - Replace obvious fixed waits with assertions
   - Add missing validations to combat tests

2. **Short-Term (2 Weeks):**
   - Implement all Phase 1 improvements
   - Document improved patterns
   - Train team on new patterns
   - Add component tests for 5 components

3. **Long-Term (1 Month):**
   - Complete all 4 phases
   - Achieve <8 minute test execution
   - Reach 80%+ coverage
   - Publish best practices guide

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-19  
**Maintained By:** Test Specialist Agent  
**Review Cycle:** Weekly during improvement period
