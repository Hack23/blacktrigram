# 🔧 E2E Test Improvements Backlog
## Black Trigram (흑괘) - Prioritized Test Quality Issues

**Generated From:** E2E_TEST_AUDIT_REPORT.md  
**Date:** 2025-01-25  
**Total Issues:** 10  
**Estimated Total Effort:** 33 hours

---

## 📋 P0 - Critical (Must Fix Immediately)

### Issue #1: Add Game Mechanic Verification to Combat Tests
**Status:** 🔴 Critical  
**Effort:** 4 hours  
**Files:** `cypress/e2e/combat.cy.ts`, `cypress/e2e/game-journey.cy.ts`

**Problem:**
Combat tests only verify UI elements exist, but don't verify actual combat mechanics work. Tests pass even if:
- Damage calculation is broken
- Health doesn't decrease
- Combat system is non-functional

**Current Code Example:**
```typescript
// ❌ Only checks screen exists, doesn't verify combat worked
it("should execute complete combat action sequence", () => {
  cy.gameActions(["1", " "]);
  cy.gameActions(["3", " "]);
  cy.get('[data-testid="combat-screen"]').should("exist");
});
```

**Recommended Fix (using correct test IDs):**
```typescript
// ✅ Verifies health changes using actual test IDs
it("should execute combat and verify health changes", () => {
  // NOTE: Requires adding data-health attributes to ProgressBar component first
  // Current implementation: testIds are "player1-health" and "player2-health"
  
  // Capture initial health (Option 1: if data-health attribute added)
  cy.get('[data-testid="player2-health"]')
    .invoke('attr', 'data-health')
    .then(parseFloat)
    .as('player2HealthBefore');

  // Execute attack
  cy.gameActions(["1", " "]);
  
  // Wait for combat resolution
  cy.get('[data-testid="combat-log"]', { timeout: 2000 })
    .should('contain', '공격'); // Verify attack logged

  // Verify damage was dealt
  cy.get('@player2HealthBefore').then((initial) => {
    cy.get('[data-testid="player2-health"]')
      .invoke('attr', 'data-health')
      .then(parseFloat)
      .should('be.lessThan', initial as number);
  });
  
  // Option 2: Parse text content (works without data attributes)
  // cy.get('[data-testid="player2-health"]').invoke('text').then((text) => {
  //   const health = parseFloat(text.match(/\d+/)[0]);
  //   // Compare health values
  // });
});
```

**Prerequisites:**
- [ ] Add `data-health`, `data-current`, and `data-max` attributes to ProgressBar component
  - Modify `src/components/three/ProgressBar.tsx` line 204:
  - `<div style={containerStyle} data-testid={testId} data-health={current} data-max={max}>`
- [ ] Alternative: Use text parsing if data attributes not added (more brittle)

**Required Changes:**
- [ ] Add health tracking before/after attacks (using player1-health, player2-health testIds)
- [ ] Verify combat log shows attack results
- [ ] Check damage calculation is correct  
- [ ] Verify player health decreases (not "enemy" - both are players)
- [ ] Test critical hits vs normal hits

**Acceptance Criteria:**
- ✅ Combat tests verify actual damage is dealt using correct test IDs
- ✅ Tests fail if combat system is broken
- ✅ Health/damage values are validated via data attributes or text parsing
- ✅ At least 10 combat tests updated with correct selectors

---

### Issue #2: Add Three.js Scene State Verification
**Status:** 🔴 High  
**Effort:** 3 hours  
**Files:** All test files, `src/App.tsx`, `cypress/support/commands.ts`

**Problem:**
Tests verify Canvas exists but never check if Three.js scene contains 3D objects. Tests would pass even if:
- Scene is empty (no camera, lights, objects)
- WebGL rendering is broken
- Canvas shows blank screen

**Current Code Example:**
```typescript
// ❌ Only checks canvas exists, not if it's rendering anything
cy.get("canvas").should("exist").and("be.visible");
```

**Required Changes:**
- [ ] Expose `__threeScene` in dev mode for testing (1h)
- [ ] Add `cy.verifyThreeJSScene()` command to cypress/support/commands.ts (1h)
- [ ] Add scene verification to >12 existing tests (1h)
- [ ] Verify scene contains camera, lights, objects
- [ ] Check object count matches expected
- [ ] Validate camera positioning

**Implementation:**
```typescript
// Step 1: In src/App.tsx (dev mode only) - Expose scene for testing
if (import.meta.env.DEV) {
  (window as any).__threeScene = sceneRef.current;
}

// Step 2: Add to cypress/support/commands.ts - Custom command
Cypress.Commands.add('verifyThreeJSScene', (options?: {
  minChildren?: number;
  requiredTypes?: string[];
}) => {
  const { minChildren = 1, requiredTypes = [] } = options || {};
  
  cy.window().then((win) => {
    const scene = (win as any).__threeScene;
    
    if (!scene) {
      cy.log('⚠️ Three.js scene not exposed (production build?)');
      return;
    }

    // Note: scene.children includes ALL objects (cameras, lights, meshes, groups)
    expect(scene.children.length).to.be.greaterThan(minChildren,
      `Scene should have at least ${minChildren} children (including cameras, lights, meshes)`);

    // Verify specific object types if required
    requiredTypes.forEach(type => {
      const hasType = scene.children.some((obj: any) => obj.type === type);
      expect(hasType).to.be.true(`Scene should contain ${type}`);
    });

    cy.log(`✅ Scene verified: ${scene.children.length} total children`);
  });
});

// Step 3: Add TypeScript declaration
declare global {
  namespace Cypress {
    interface Chainable {
      verifyThreeJSScene(options?: {
        minChildren?: number;
        requiredTypes?: string[];
      }): Chainable<void>;
    }
  }
}
```

**Acceptance Criteria:**
- ✅ `verifyThreeJSScene()` command implemented in cypress/support/commands.ts
- ✅ Scene exposure added to src/App.tsx (dev mode only)
- ✅ Scene object verification added to >12 tests
- ✅ Tests fail if scene is empty or missing required types
- ✅ Camera and light verification included via requiredTypes parameter

**Note:** The 3h effort includes implementing the command (2h) and adding it to tests (1h).

---

### Issue #3: Remove Silent Error Continuations
**Status:** 🔴 High  
**Effort:** 2 hours  
**Files:** `training.cy.ts`, `three-korean-martial-arts.cy.ts`, `intro-threejs.cy.ts`

**Problem:**
17 tests use "but continuing" patterns that silently skip assertions when elements are missing. Tests pass with warnings even when features are broken.

**Problematic Pattern:**
```typescript
// ❌ Silent continuation - test passes even if feature missing
cy.get("body").then(($body) => {
  if ($body.find('[data-testid="training-dummy"]').length > 0) {
    cy.get('[data-testid="training-dummy"]').should("exist");
  } else {
    cy.log("⚠️ No training dummy found, but continuing");
  }
});
```

**Locations:**
- `training.cy.ts:44` - Training elements
- `training.cy.ts:63` - Training dummy
- `three-korean-martial-arts.cy.ts:96` - Combat controls
- `three-korean-martial-arts.cy.ts:117` - Training area
- Plus 13 more instances

**Required Changes:**
- [ ] Convert required features to strict assertions
- [ ] Use `this.skip()` for truly optional features
- [ ] Document which features are optional vs required
- [ ] Remove all "but continuing" patterns

**Acceptance Criteria:**
- ✅ Zero "but continuing" patterns remain
- ✅ Required features have strict assertions
- ✅ Optional features use `this.skip()`
- ✅ Documentation of optional vs required features

---

## 📊 P1 - High Priority (Should Fix Soon)

### Issue #4: Replace Fixed Waits with Assertion-Based Waits
**Status:** 🟡 Medium  
**Effort:** 3 hours  
**Files:** All test files, `cypress/support/commands.ts`

**Problem:**
65 fixed waits (cy.wait with milliseconds) mask timing issues and slow down tests:
- 9 × 1000ms waits = 9 seconds wasted
- 18 × 500ms waits = 9 seconds wasted
- Total ~18+ seconds unnecessary waiting per full run

**Problematic Pattern:**
```typescript
// ❌ Fixed wait - may be too short or too long
cy.get("body").type("1");
cy.wait(1000);
cy.get('[data-testid="combat-screen"]');
```

**Required Changes:**
- [ ] Replace 1000ms waits with `.should()` assertions
- [ ] Replace 500ms waits with `.should()` assertions
- [ ] Optimize `waitForCanvasReady()` to use frame detection
- [ ] Document when fixed waits are acceptable

**Recommended Pattern:**
```typescript
// ✅ Assertion-based wait - as fast or slow as needed
cy.get("body").type("1");
cy.get('[data-testid="combat-screen"]', { timeout: 5000 })
  .should('exist');
```

**Acceptance Criteria:**
- ✅ <20 fixed waits remain (down from 65)
- ✅ `waitForCanvasReady()` uses frame detection
- ✅ Test runtime reduced by ~15 seconds
- ✅ Documentation of acceptable fixed wait usage

---

### Issue #5: Add Stance System Verification
**Status:** 🟡 Medium  
**Effort:** 2 hours  
**Files:** `cypress/e2e/training.cy.ts`, `cypress/e2e/combat.cy.ts`

**Problem:**
Tests execute stance changes (keys 1-8) but don't verify:
- Stance actually changed
- UI indicator updated
- Stance affects combat effectiveness
- All 8 stances work correctly

**Current Code:**
```typescript
// ❌ Only executes stance change, doesn't verify it worked
for (let i = 1; i <= 8; i++) {
  cy.get("body").type(i.toString());
  cy.wait(200);
}
cy.get('[data-testid="training-screen"]').should("exist");
```

**Required Changes:**
- [ ] Verify stance indicator updates
- [ ] Check stance name displayed (Korean + English)
- [ ] Verify stance affects available techniques
- [ ] Test stance affects combat stats
- [ ] Validate all 8 trigram stances

**Acceptance Criteria:**
- ✅ Stance change verification in >8 tests
- ✅ UI indicator validation added
- ✅ All 8 stances individually verified
- ✅ Stance impact on combat tested

---

### Issue #6: Add Edge Case Coverage
**Status:** 🟡 Medium  
**Effort:** 4 hours  
**Files:** New test files or sections in existing files

**Problem:**
Missing tests for boundary conditions and error scenarios:
- Attack with 0 stamina (may crash)
- Stance change during attack (may cause invalid state)
- Multiple simultaneous attacks (race condition)
- Defeat/victory conditions (game over logic)

**Required Changes:**
- [ ] Test attack with 0 stamina (should be prevented)
- [ ] Test stance change during attack animation
- [ ] Test rapid input spam (button mashing)
- [ ] Test defeat scenario (health reaches 0)
- [ ] Test victory scenario (enemy health reaches 0)
- [ ] Test screen resize during combat
- [ ] Test rapid ESC spam

**Acceptance Criteria:**
- ✅ >10 edge case tests added
- ✅ Boundary conditions covered
- ✅ Error handling verified
- ✅ Race conditions tested

---

## 🔧 P2 - Medium Priority (Nice to Have)

### Issue #7: Add Visual Regression Testing
**Status:** 🟠 Low  
**Effort:** 6 hours  
**Files:** New visual regression test suite

**Problem:**
No visual regression testing for Three.js rendering. Visual bugs in 3D scenes, lighting, or materials may go undetected.

**Required Changes:**
- [ ] Set up Cypress snapshot testing
- [ ] Capture baseline screenshots for each screen
- [ ] Add visual diff assertions
- [ ] Document acceptable visual variance thresholds
- [ ] Integrate with CI pipeline

**Acceptance Criteria:**
- ✅ Visual regression tests for all screens
- ✅ Baseline screenshots captured
- ✅ Visual diff threshold configured
- ✅ CI integration complete

---

### Issue #8: Improve Performance Regression Detection
**Status:** 🟠 Low  
**Effort:** 3 hours  
**Files:** `cypress/e2e/performance-threejs.cy.ts`, CI configuration

**Problem:**
Basic FPS monitoring exists but missing:
- Frame drop detection during combat
- Memory growth tracking over time
- Texture loading performance
- Bundle size monitoring

**Required Changes:**
- [ ] Add frame drop detection
- [ ] Track memory growth over extended sessions
- [ ] Monitor texture loading performance
- [ ] Set up performance budgets
- [ ] Add performance budget enforcement in CI

**Acceptance Criteria:**
- ✅ Frame drop detection implemented
- ✅ Memory leak tracking improved
- ✅ Performance budgets defined
- ✅ CI fails on performance regression

---

## 🌟 P3 - Low Priority (Future Improvements)

### Issue #9: Enhance Korean Text Validation
**Status:** 🟢 Low  
**Effort:** 2 hours  
**Files:** All test files

**Problem:**
Basic Korean text validation exists (9 checks) but could be more comprehensive:
- Verify all Korean text renders correctly
- Test font loading
- Validate bilingual display format
- Check for missing translations

**Required Changes:**
- [ ] Add comprehensive Korean text assertions
- [ ] Verify font loading
- [ ] Test character encoding
- [ ] Validate all translations present
- [ ] Check formatting (Korean | English)

**Acceptance Criteria:**
- ✅ >30 Korean text validation checks
- ✅ Font loading verified
- ✅ Translation completeness checked
- ✅ Bilingual format validated

---

### Issue #10: Optimize Test Execution Time
**Status:** 🟢 Low  
**Effort:** 4 hours  
**Files:** CI configuration, test setup

**Problem:**
Tests run reasonably fast but could be optimized:
- Unnecessary waits slow down execution
- Asset loading repeated for each test
- Tests run sequentially (no parallelization)

**Required Changes:**
- [ ] Implement test parallelization
- [ ] Cache asset loading between tests
- [ ] Use test sharding for CI
- [ ] Optimize waitForCanvasReady()
- [ ] Reduce unnecessary setup/teardown

**Acceptance Criteria:**
- ✅ Test runtime reduced by >30%
- ✅ Parallel execution implemented
- ✅ Asset caching functional
- ✅ CI execution time <5 minutes

---

## 📊 Summary Statistics

| Priority | Issues | Total Effort | Impact |
|----------|--------|--------------|--------|
| **P0 - Critical** | 3 | 9 hours | 🔴 High |
| **P1 - High** | 3 | 9 hours | 🟡 Medium |
| **P2 - Medium** | 2 | 9 hours | 🟠 Low |
| **P3 - Low** | 2 | 6 hours | 🟢 Minimal |
| **Total** | **10** | **33 hours** | - |

### Recommended Implementation Order

**Sprint 1 (P0 Issues):** 9 hours
1. Issue #3: Remove Silent Continuations (2h) - Quick win
2. Issue #2: Three.js Scene Verification (3h) - Foundation
3. Issue #1: Game Mechanic Verification (4h) - Most critical

**Sprint 2 (P1 Issues):** 9 hours
4. Issue #5: Stance System Verification (2h) - Quick win
5. Issue #4: Replace Fixed Waits (3h) - Performance improvement
6. Issue #6: Edge Case Coverage (4h) - Robustness

**Sprint 3 (P2-P3 Issues):** 15 hours
7. Issue #8: Performance Regression (3h)
8. Issue #9: Korean Text Validation (2h)
9. Issue #10: Optimize Execution (4h)
10. Issue #7: Visual Regression (6h) - Most complex

---

## 🎯 Success Metrics

After completing P0 issues:
- ✅ Game mechanic verification in >25 tests (vs 6 currently)
- ✅ Zero silent error continuations (vs 17 currently)
- ✅ Three.js scene validation in >12 tests (vs 0 currently)
- ✅ Strong assertions >60% (vs 30% currently)

After completing all issues:
- ✅ Test runtime reduced by >30%
- ✅ >100 strong assertions
- ✅ <20 fixed waits
- ✅ Visual regression coverage
- ✅ Comprehensive edge case testing

**흑괘의 길을 걸어라** - *Walk the Path of the Black Trigram*
