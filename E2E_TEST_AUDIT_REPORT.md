# 🔍 E2E Test Suite Audit Report
## Black Trigram (흑괘) - Three.js Implementation Verification

**Report Date:** 2025-01-25  
**Audit Scope:** All 7 E2E test files (2,148 lines, ~94 test cases)  
**Methodology:** Static code analysis, pattern detection, coverage gap analysis  
**Auditor:** GitHub Copilot Test Engineering Agent

---

## 📊 Executive Summary

### Overall Assessment: **⚠️ MODERATE RISK**

The E2E test suite has successfully migrated from PixiJS to Three.js patterns and provides broad coverage of UI navigation. However, **critical gaps exist in game mechanic verification** and several tests may pass with broken game logic.

| Category | Status | Risk Level | Priority |
|----------|--------|------------|----------|
| **Three.js Migration** | ✅ Complete | 🟢 Low | P3 |
| **Game Mechanic Testing** | ⚠️ Weak | 🔴 Critical | **P0** |
| **Timeout Configuration** | ⚠️ Excessive | 🟡 Medium | P1 |
| **Assertion Quality** | ⚠️ Weak | 🔴 High | **P0** |
| **State Verification** | ❌ Missing | 🔴 Critical | **P0** |
| **Coverage Gaps** | ⚠️ Significant | 🟡 Medium | P1 |

### Key Findings

✅ **Strengths:**
- **Zero PixiJS artifacts** - Clean migration to Three.js complete
- **Comprehensive UI coverage** - All screens and navigation paths tested
- **Performance monitoring** - FPS and load time assertions present (13 FPS checks, 17 performance logs)
- **Responsive testing** - Multiple viewport sizes validated
- **Korean localization** - Bilingual text verification present (9 checks)

❌ **Critical Issues (P0 - Must Fix):**
1. **96 weak assertions** only check element existence, not actual values or behavior
2. **Zero health/damage verification** - Combat doesn't verify actual damage dealt
3. **Zero Three.js scene validation** - Tests don't verify 3D objects exist in scene
4. **17 silent error continuations** - Tests may hide failures with "but continuing" patterns
5. **15+ tests verify only UI presence** - Don't test actual game mechanics

⚠️ **High Priority Issues (P1 - Should Fix):**
1. **18 excessive fixed waits (≥500ms)** - May hide timing issues
2. **9 very long timeouts (12s)** - Only for initial page load, acceptable but could be optimized
3. **Limited game state verification** - Most tests don't check combat outcomes
4. **22 flexible patterns** use conditional logic that may skip critical assertions

---

## 🔬 Detailed Analysis

### 1. Three.js Implementation Match: ✅ **EXCELLENT**

**Finding:** Tests correctly target Three.js Canvas and Html overlays, with zero PixiJS artifacts.

**Evidence:**
```bash
✅ Canvas checks: 28 occurrences
✅ PixiJS references: 0 (excluding old filename three-korean-martial-arts.cy.ts)
✅ Html overlay targeting: All menu buttons use correct data-testid
✅ Three.js-specific patterns: Canvas dimension validation in 13 tests
```

**Sample Correct Pattern:**
```typescript
// ✅ GOOD: Tests verify Three.js Canvas exists
cy.get("canvas").should("exist").and("be.visible");

// ✅ GOOD: Tests target Html overlay buttons
cy.get('[data-testid="combat-button"]')
  .should("be.visible")
  .and("contain", "대전")
  .and("contain", "Combat");
```

**Recommendation:** ✅ No action needed - implementation match is correct.

---

### 2. Game Mechanic Verification: ❌ **CRITICAL GAPS**

**Finding:** Tests verify UI exists but rarely verify actual game mechanics work correctly.

**Evidence:**
```bash
❌ Weak assertions (only .exist): 96 occurrences
❌ Health/damage checks: 0 occurrences
❌ Combat feedback validation: 4 occurrences (only checks element exists)
❌ Training feedback validation: 6 occurrences (only checks element exists)
⚠️ Strong assertions (.contain, expect): 43 total (vs 136 weak assertions)
```

**Critical Test Quality Issues:**

#### Issue 1: Combat Tests Don't Verify Damage Dealt

**Location:** `cypress/e2e/combat.cy.ts:108-123`

**Current (Problematic):**
```typescript
it("should execute complete combat action sequence", () => {
  cy.annotate("Testing combat action sequence");

  // Stance + Attack combinations
  cy.gameActions(["1", " "]);
  cy.wait(200);
  
  cy.gameActions(["3", " "]);
  cy.wait(200);
  
  cy.gameActions(["5", " "]);
  cy.wait(200);

  cy.get('[data-testid="combat-screen"]').should("exist"); // ❌ Only checks UI exists
  cy.log("✅ Combat action sequence completed");
});
```

**Problem:** Test passes even if:
- Attack doesn't execute
- Damage calculation is broken
- Enemy health doesn't change
- Combat system is completely non-functional

**Recommended Fix:**
```typescript
it("should execute combat and verify damage dealt", () => {
  cy.annotate("Testing combat with damage verification");

  // Record initial enemy health
  cy.get('[data-testid="enemy-health"]')
    .invoke('attr', 'data-health')
    .then(parseFloat)
    .as('initialHealth');

  // Execute attack
  cy.gameActions(["1", " "]);
  
  // Wait for combat resolution
  cy.get('[data-testid="combat-log"]', { timeout: 2000 })
    .should('contain', '공격'); // Verify attack logged

  // Verify damage was dealt
  cy.get('@initialHealth').then((initial) => {
    cy.get('[data-testid="enemy-health"]')
      .invoke('attr', 'data-health')
      .then(parseFloat)
      .should('be.lessThan', initial as number);
  });

  cy.log("✅ Combat action verified with damage calculation");
});
```

#### Issue 2: Training Tests Don't Verify Stance Changes

**Location:** `cypress/e2e/training.cy.ts:70-83`

**Current (Problematic):**
```typescript
it("should practice all 8 trigram stances", () => {
  cy.annotate("Testing all 8 trigram stances in training");

  // Practice each stance once
  for (let i = 1; i <= 8; i++) {
    cy.get("body").type(i.toString());
    cy.wait(200);
    cy.get("body").type(" ");
    cy.wait(200);
  }

  cy.get('[data-testid="training-screen"]').should("exist"); // ❌ Only checks screen exists
  cy.log("✅ All 8 stances practiced");
});
```

**Problem:** Test passes even if:
- Stance system is broken
- Keys 1-8 don't change stance
- Training dummy doesn't respond
- No feedback is provided to user

**Recommended Fix:**
```typescript
it("should practice all 8 trigram stances with verification", () => {
  cy.annotate("Testing all 8 trigram stances with stance change verification");

  const stances = ["건", "태", "리", "진", "손", "감", "간", "곤"];

  for (let i = 1; i <= 8; i++) {
    // Change stance
    cy.get("body").type(i.toString());
    
    // Verify stance changed
    cy.get('[data-testid="current-stance"]', { timeout: 1000 })
      .should('contain', stances[i - 1])
      .or('contain', `Stance ${i}`);

    // Execute technique
    cy.get("body").type(" ");
    
    // Verify training feedback (technique executed)
    cy.get('[data-testid="training-feedback"]')
      .should('contain', '수행') // Korean for "executed"
      .or('contain', 'practice');
    
    cy.wait(100); // Minimal wait for next stance
  }

  cy.log("✅ All 8 stances verified with feedback");
});
```

#### Issue 3: No Three.js Scene State Verification

**Finding:** Tests verify Canvas exists but never check if 3D objects are rendered in the scene.

**Problem:** Tests would pass even if:
- Three.js scene is empty (no camera, no lights, no objects)
- Scene fails to render 3D models
- Canvas shows blank screen
- WebGL context is broken

**Recommended Fix:**
```typescript
// Add to cypress/support/commands.ts
Cypress.Commands.add('verifyThreeJSScene', () => {
  cy.window().then((win) => {
    // Access Three.js scene from window (requires exposing it in dev mode)
    const scene = (win as any).__threeScene;
    
    if (scene) {
      expect(scene.children.length).to.be.greaterThan(0, 
        'Three.js scene should contain objects');
      cy.log(`✅ Three.js scene contains ${scene.children.length} objects`);
    } else {
      cy.log('⚠️ Three.js scene not exposed, skipping verification');
    }
  });
});

// Use in tests:
it("should render 3D combat scene with objects", () => {
  cy.enterCombatMode();
  cy.get("canvas").should("be.visible");
  cy.verifyThreeJSScene(); // ✅ Verify actual 3D content
});
```

---

### 3. Silent Error Continuations: ⚠️ **MAY HIDE FAILURES**

**Finding:** 17 tests use "but continuing" patterns that silently skip assertions when elements are missing.

**Evidence:**
```typescript
// ❌ PROBLEMATIC: Silent continuation
cy.get("body").then(($body) => {
  if ($body.find('[data-testid="training-dummy"]').length > 0) {
    cy.get('[data-testid="training-dummy"]').should("exist");
    cy.log("✅ Training dummy found");
  } else {
    cy.log("⚠️ No training dummy found, but continuing"); // ❌ Hides missing feature
  }
});
```

**Problem:** If training dummy is removed or broken, test still passes with a warning.

**Locations:**
- `training.cy.ts:44` - Training elements "but continuing test"
- `training.cy.ts:63` - Training dummy "but continuing"
- `three-korean-martial-arts.cy.ts:96` - Combat controls "but continuing"
- `three-korean-martial-arts.cy.ts:117` - Training area "but continuing"
- Plus 13 more instances across files

**Recommended Fix:**

**Option 1: Make assertions required (strict mode)**
```typescript
// ✅ GOOD: Fail fast if element missing
it("should display training dummy", () => {
  cy.get('[data-testid="training-dummy"]', { timeout: 5000 })
    .should('exist')
    .and('be.visible');
  
  cy.log("✅ Training dummy verified");
});
```

**Option 2: Use optional checks only for truly optional features**
```typescript
// ✅ ACCEPTABLE: For optional/future features
it("should display archetype selector if implemented", () => {
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid="archetype-selector"]').length > 0) {
      cy.get('[data-testid="archetype-selector"]')
        .should('be.visible')
        .and('contain', '무사'); // Actually test the feature
      cy.log("✅ Archetype selector found and functional");
    } else {
      cy.log("ℹ️ Archetype selector not yet implemented (future feature)");
      // Mark test as pending in report
      this.skip(); // Skip test if feature not implemented
    }
  });
});
```

---

### 4. Timeout Analysis: ⚠️ **EXCESSIVE FIXED WAITS**

**Finding:** While timeout values for page load are acceptable (12s), excessive fixed waits (500ms+) may hide timing issues.

**Evidence:**
```bash
Timeout Distribution:
- 12s timeouts: 9 (all for cy.visitWithWebGLMock - acceptable)
- 10s timeouts: 5 (for screen transitions - acceptable)
- 8s timeouts: 1
- 5s timeouts: 8

Fixed Wait Distribution:
- 1000ms waits: 9 ⚠️
- 500ms waits: 18 ⚠️
- 300ms waits: 12 ✅
- 200ms waits: 13 ✅
- 100ms waits: 13 ✅
```

**Problematic Patterns:**

#### Pattern 1: Fixed Wait Instead of Assertion-Based Wait

**Location:** `intro-threejs.cy.ts:223`

**Current (Problematic):**
```typescript
cy.get("body").type("1");
cy.wait(1000); // ❌ Fixed 1s wait

// Verify navigation occurred
cy.get("body").then(($body) => {
  const hasCombat = $body.find('[data-testid="combat-screen"]').length > 0;
  // ...
});
```

**Problem:** 
- If navigation takes 1.1s, test fails
- If navigation takes 100ms, test wastes 900ms
- Masks actual navigation speed issues

**Recommended Fix:**
```typescript
cy.get("body").type("1");

// ✅ Wait for actual state change, not fixed time
cy.get('[data-testid="combat-screen"]', { timeout: 5000 })
  .should('exist');

cy.log("✅ Navigation completed");
```

#### Pattern 2: waitForCanvasReady() Uses Fixed 500ms Wait

**Location:** `cypress/support/commands.ts:161-173`

**Current (Problematic):**
```typescript
Cypress.Commands.add("waitForCanvasReady", () => {
  cy.get("canvas", { timeout: 10000 }).should(($canvas) => {
    expect($canvas).to.have.length.greaterThan(0);
    const canvas = $canvas[0];
    const rect = canvas.getBoundingClientRect();
    expect(rect.width).to.be.greaterThan(50);
    expect(rect.height).to.be.greaterThan(50);
  });

  // ❌ Fixed 500ms wait after canvas exists
  cy.wait(500);
});
```

**Problem:** 
- Used 22 times across all tests
- Adds 11 seconds of unnecessary waiting per test run
- Doesn't verify Three.js actually initialized

**Recommended Fix:**
```typescript
Cypress.Commands.add("waitForCanvasReady", () => {
  // Verify canvas exists with correct dimensions
  cy.get("canvas", { timeout: 10000 }).should(($canvas) => {
    expect($canvas).to.have.length.greaterThan(0);
    const canvas = $canvas[0];
    const rect = canvas.getBoundingClientRect();
    expect(rect.width).to.be.greaterThan(50);
    expect(rect.height).to.be.greaterThan(50);
  });

  // ✅ Wait for first frame to render (proof Three.js is active)
  cy.window().then((win) => {
    return new Cypress.Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve); // Wait for 2nd frame to ensure rendering
      });
    });
  });

  cy.log("✅ Canvas ready and rendering");
});
```

**Impact:** Would reduce test suite runtime by ~11 seconds.

---

### 5. Coverage Gap Analysis

#### A. Game Mechanics NOT Tested

| Mechanic | Current Coverage | Gap | Priority |
|----------|-----------------|-----|----------|
| **Damage Calculation** | ❌ None | No verification damage is dealt | **P0** |
| **Health System** | ❌ None | No health change verification | **P0** |
| **Stance Benefits** | ❌ None | No verification stance affects combat | **P0** |
| **Vital Point Targeting** | ❌ None | No verification vital points work | **P0** |
| **Ki/Stamina System** | ❌ None | No resource management testing | P1 |
| **Combo System** | ❌ None | No combo detection testing | P1 |
| **Victory Conditions** | ❌ None | No win/loss state testing | P1 |
| **AI Behavior** | ⚠️ Minimal | Only checks AI doesn't crash | P2 |
| **Training Progress** | ⚠️ Minimal | No XP/skill gain verification | P2 |

#### B. Three.js Features NOT Tested

| Feature | Current Coverage | Gap | Priority |
|---------|-----------------|-----|----------|
| **Scene Object Count** | ❌ None | No verification 3D objects exist | **P0** |
| **Camera Positioning** | ❌ None | No verification camera is placed | P1 |
| **Lighting Setup** | ❌ None | No verification lights exist | P1 |
| **Material Loading** | ❌ None | No verification textures loaded | P2 |
| **Animation System** | ❌ None | No verification animations play | P2 |
| **Memory Cleanup** | ⚠️ Basic | Memory leak detection exists but weak | P1 |

#### C. Edge Cases NOT Tested

| Edge Case | Current Coverage | Risk | Priority |
|-----------|-----------------|------|----------|
| **Attack with 0 stamina** | ❌ None | May cause crash | **P0** |
| **Stance change during attack** | ❌ None | May cause invalid state | **P0** |
| **Multiple simultaneous attacks** | ❌ None | May cause race condition | P1 |
| **Defeat with 0 health** | ❌ None | Game over logic untested | P1 |
| **Screen resize during combat** | ⚠️ Partial | Tested but no state verification | P2 |
| **WebGL context loss** | ✅ Tested | Good coverage | ✅ |
| **Rapid ESC spam** | ❌ None | May cause navigation bugs | P2 |

#### D. Performance Regression Gaps

**Good Coverage:**
- FPS monitoring: 13 assertions
- Load time tracking: Multiple tests
- Performance logging: 17 calls

**Missing:**
- No frame drop detection during combat
- No memory growth tracking over time
- No texture loading performance verification
- No bundle size monitoring

---

## 🎯 Prioritized Remediation Plan

### P0 - Critical Issues (Must Fix Immediately)

#### 1. Add Game Mechanic Verification to Combat Tests
**Effort:** 4 hours  
**Impact:** 🔴 Critical - Tests currently don't verify combat works

**Action Items:**
- [ ] Add health/damage verification to combat tests
- [ ] Verify combat log shows attack results
- [ ] Check enemy health decreases after attack
- [ ] Verify damage calculation uses correct formula
- [ ] Test critical hits vs normal hits

**Files to Update:**
- `cypress/e2e/combat.cy.ts` - Add damage verification
- `cypress/e2e/game-journey.cy.ts` - Add combat outcome checks

**Example Fix:**
```typescript
// Add helper command
Cypress.Commands.add('verifyDamageDealt', (expectedMin: number) => {
  cy.get('[data-testid="enemy-health"]')
    .invoke('attr', 'data-health')
    .then(parseFloat)
    .as('healthAfter');
  
  cy.get('@healthBefore').then((before) => {
    cy.get('@healthAfter').then((after) => {
      const damage = (before as number) - (after as number);
      expect(damage).to.be.greaterThan(expectedMin);
      cy.log(`✅ Damage dealt: ${damage}`);
    });
  });
});
```

#### 2. Add Three.js Scene Verification
**Effort:** 3 hours  
**Impact:** 🔴 High - Tests don't verify 3D rendering works

**Action Items:**
- [ ] Expose `__threeScene` in dev mode for testing
- [ ] Add `verifyThreeJSScene()` command
- [ ] Verify scene contains camera, lights, objects
- [ ] Check object count matches expected
- [ ] Validate camera is positioned correctly

**Implementation:**
```typescript
// In src/App.tsx (dev mode only)
if (import.meta.env.DEV) {
  (window as any).__threeScene = sceneRef.current;
}

// In cypress/support/commands.ts
Cypress.Commands.add('verifyThreeJSScene', (options?: {
  minObjects?: number;
  requiredTypes?: string[];
}) => {
  const { minObjects = 1, requiredTypes = [] } = options || {};
  
  cy.window().then((win) => {
    const scene = (win as any).__threeScene;
    
    if (!scene) {
      cy.log('⚠️ Three.js scene not exposed (production build?)');
      return;
    }

    expect(scene.children.length).to.be.greaterThan(minObjects,
      `Scene should have at least ${minObjects} objects`);

    requiredTypes.forEach(type => {
      const hasType = scene.children.some((obj: any) => obj.type === type);
      expect(hasType).to.be.true(`Scene should contain ${type}`);
    });

    cy.log(`✅ Scene verified: ${scene.children.length} objects`);
  });
});
```

#### 3. Remove Silent Error Continuations
**Effort:** 2 hours  
**Impact:** 🔴 High - Tests may hide failures

**Action Items:**
- [ ] Review all 17 "but continuing" patterns
- [ ] Convert required features to strict assertions
- [ ] Use `this.skip()` for truly optional features
- [ ] Document which features are optional vs required

**Pattern to Apply:**
```typescript
// ❌ BAD: Silent continuation
if ($body.find('[data-testid="feature"]').length > 0) {
  cy.get('[data-testid="feature"]').should("exist");
} else {
  cy.log("⚠️ Feature not found, but continuing");
}

// ✅ GOOD: Strict for required features
cy.get('[data-testid="feature"]', { timeout: 5000 })
  .should('exist')
  .and('be.visible');

// ✅ ACCEPTABLE: Skip for optional features
cy.get("body").then(($body) => {
  if ($body.find('[data-testid="optional-feature"]').length === 0) {
    cy.log("ℹ️ Optional feature not implemented");
    this.skip(); // Mark test as skipped
  } else {
    // Test the feature properly
  }
});
```

---

### P1 - High Priority (Should Fix Soon)

#### 4. Replace Fixed Waits with Assertion-Based Waits
**Effort:** 3 hours  
**Impact:** 🟡 Medium - Improves test reliability and speed

**Action Items:**
- [ ] Replace 9 × 1000ms waits with `.should()` assertions
- [ ] Replace 18 × 500ms waits with `.should()` assertions
- [ ] Optimize `waitForCanvasReady()` to use frame detection
- [ ] Document when fixed waits are acceptable (animation delays)

**Expected Improvement:** 
- Reduce test runtime by ~15 seconds
- Eliminate false failures from timing issues
- More accurate performance measurement

#### 5. Add Stance System Verification
**Effort:** 2 hours  
**Impact:** 🟡 Medium - Verifies core game mechanic works

**Action Items:**
- [ ] Verify stance changes update UI indicator
- [ ] Check stance affects available techniques
- [ ] Verify stance changes combat stats
- [ ] Test all 8 trigram stances individually

#### 6. Add Edge Case Coverage
**Effort:** 4 hours  
**Impact:** 🟡 Medium - Catches boundary condition bugs

**Action Items:**
- [ ] Test attack with 0 stamina (should be prevented)
- [ ] Test stance change during attack animation
- [ ] Test rapid input spam (button mashing)
- [ ] Test defeat scenario (health reaches 0)
- [ ] Test victory scenario (enemy health reaches 0)

---

### P2 - Medium Priority (Nice to Have)

#### 7. Add Visual Regression Testing
**Effort:** 6 hours  
**Impact:** 🟠 Low - Catches visual bugs in Three.js rendering

**Action Items:**
- [ ] Set up Cypress snapshot testing
- [ ] Capture baseline screenshots for each screen
- [ ] Add visual diff assertions
- [ ] Document acceptable visual variance thresholds

#### 8. Improve Performance Regression Detection
**Effort:** 3 hours  
**Impact:** 🟠 Low - Better performance monitoring

**Action Items:**
- [ ] Track frame drops during combat
- [ ] Monitor memory growth over extended sessions
- [ ] Add bundle size tracking
- [ ] Set up performance budgets

---

### P3 - Low Priority (Future Improvements)

#### 9. Add Korean Text Validation
**Effort:** 2 hours  
**Impact:** 🟢 Low - Already has basic coverage (9 checks)

**Action Items:**
- [ ] Verify all Korean text renders correctly
- [ ] Test font loading
- [ ] Validate bilingual display format
- [ ] Check for missing translations

#### 10. Optimize Test Execution Time
**Effort:** 4 hours  
**Impact:** 🟢 Low - Tests run reasonably fast already

**Action Items:**
- [ ] Parallelize test execution
- [ ] Reduce unnecessary waits
- [ ] Cache asset loading between tests
- [ ] Use test sharding for CI

---

## 📈 Test Quality Metrics

### Current State

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| **Total Tests** | 94 | 94 | ✅ |
| **Test Files** | 7 | 7 | ✅ |
| **Weak Assertions** | 96 (70%) | <30% | ❌ -40% |
| **Strong Assertions** | 43 (30%) | >70% | ❌ +40% |
| **Game Mechanic Verification** | 6 tests | >50 tests | ❌ +44 |
| **Three.js Scene Verification** | 0 tests | >10 tests | ❌ +10 |
| **Fixed Waits** | 65 | <20 | ❌ -45 |
| **Silent Continuations** | 17 | 0 | ❌ -17 |
| **Average Test Duration** | ~2s | <1.5s | ⚠️ -0.5s |

### After P0 Fixes (Estimated)

| Metric | After P0 | Target | Gap |
|--------|----------|--------|-----|
| **Weak Assertions** | 50 (35%) | <30% | ⚠️ -5% |
| **Strong Assertions** | 90 (65%) | >70% | ⚠️ +5% |
| **Game Mechanic Verification** | 25 tests | >50 tests | ⚠️ +25 |
| **Three.js Scene Verification** | 12 tests | >10 tests | ✅ |
| **Silent Continuations** | 0 | 0 | ✅ |

---

## 🛡️ Test Maintenance Guidelines

### Before Merging New E2E Tests

**Checklist:**
- [ ] Test verifies actual game mechanic, not just UI presence
- [ ] Assertions check values/state, not only existence
- [ ] No fixed waits >300ms (use assertion-based waiting)
- [ ] Timeout values ≤8000ms (except page load: 12000ms acceptable)
- [ ] No silent error catching with "but continuing"
- [ ] Korean text validated where applicable
- [ ] Test fails when feature is intentionally broken (negative test)
- [ ] Run test 5 times to verify no flakiness

### Writing Quality E2E Tests

#### ✅ DO:
```typescript
// ✅ Verify actual game state changes
it("should deal damage when attacking", () => {
  cy.get('[data-testid="enemy-health"]')
    .invoke('attr', 'data-health')
    .then(parseFloat)
    .as('healthBefore');

  cy.gameActions(["1", " "]); // Stance 1 + Attack

  cy.get('[data-testid="combat-log"]', { timeout: 2000 })
    .should('contain', '공격');

  cy.get('@healthBefore').then((initial) => {
    cy.get('[data-testid="enemy-health"]')
      .invoke('attr', 'data-health')
      .then(parseFloat)
      .should('be.lessThan', initial as number);
  });
});

// ✅ Use assertion-based waiting
cy.get('[data-testid="combat-screen"]', { timeout: 5000 })
  .should('exist')
  .and('be.visible');

// ✅ Verify Three.js scene content
cy.verifyThreeJSScene({ minObjects: 5 });
```

#### ❌ DON'T:
```typescript
// ❌ Only check UI exists, don't verify behavior
it("should have attack button", () => {
  cy.get('[data-testid="attack-button"]').should("exist");
});

// ❌ Use fixed waits instead of assertions
cy.wait(1000);
cy.get('[data-testid="result"]'); // May not be ready

// ❌ Silent error continuation
if ($body.find('[data-testid="feature"]').length > 0) {
  cy.log("✅ Feature found");
} else {
  cy.log("⚠️ Feature missing, but continuing"); // Hides failure
}

// ❌ Overly generous timeout
cy.get('[data-testid="button"]', { timeout: 30000 }); // 30s is too long
```

### Red Flags to Avoid

| Pattern | Why It's Bad | Alternative |
|---------|-------------|-------------|
| `cy.wait(500+)` | Hides timing issues | Use `.should()` with timeout |
| `timeout: 15000+` | Masks slow operations | Fix performance, use 8s max |
| `should("exist")` only | Doesn't verify functionality | Add value/state assertions |
| `.then(() => { if (...) {} })` | May skip critical assertions | Use required assertions |
| No game outcome checks | Test passes with broken logic | Verify health, damage, state |

---

## 🎓 Lessons Learned

### What Went Well
1. **Complete Three.js migration** - No PixiJS artifacts, clean codebase
2. **Good test organization** - Well-structured describe blocks
3. **Performance monitoring** - FPS and load time tracking present
4. **Responsive testing** - Multiple viewport validation

### What Needs Improvement
1. **Assertion quality** - Too many weak assertions (96 vs 43 strong)
2. **Game mechanic verification** - Tests verify UI, not actual gameplay
3. **State validation** - No health/damage/stance verification
4. **Fixed waits** - 65 fixed waits should be replaced with assertions
5. **Test coverage** - Missing edge cases and error conditions

### Recommendations for Future Development

1. **Test-Driven Development:** Write tests that verify game mechanics BEFORE implementing features
2. **Negative Testing:** Add tests that verify features fail correctly (e.g., attack with 0 stamina)
3. **Performance Budgets:** Set strict FPS and load time budgets, fail tests if exceeded
4. **Visual Regression:** Add snapshot testing for Three.js rendering
5. **Accessibility Testing:** Add keyboard navigation and screen reader testing

---

## 📊 Appendix: Test File Breakdown

### File-by-File Analysis

| File | Lines | Tests | Suites | Quality Score | Priority |
|------|-------|-------|--------|---------------|----------|
| `app.cy.ts` | 99 | 3 | 1 | 🟢 Good | ✅ |
| `combat.cy.ts` | 240 | 12 | 6 | 🔴 Weak | **P0** |
| `game-journey.cy.ts` | 231 | 7 | 7 | 🟡 Fair | P1 |
| `intro-threejs.cy.ts` | 559 | 25 | 11 | 🟡 Fair | P1 |
| `performance-threejs.cy.ts` | 471 | 22 | 9 | 🟢 Good | ✅ |
| `three-korean-martial-arts.cy.ts` | 315 | 14 | 8 | 🟡 Fair | P1 |
| `training.cy.ts` | 233 | 11 | 7 | 🔴 Weak | **P0** |

**Quality Score Criteria:**
- 🟢 Good: Strong assertions (>50%), game mechanic verification, minimal fixed waits
- 🟡 Fair: Mixed assertions, some game verification, moderate fixed waits
- 🔴 Weak: Mostly weak assertions, little game verification, many fixed waits

---

## ✅ Conclusion

The E2E test suite has successfully migrated to Three.js and provides comprehensive UI navigation coverage. However, **critical gaps exist in game mechanic verification** that must be addressed to ensure tests will catch real issues.

### Immediate Actions Required (P0):
1. **Add damage/health verification to combat tests** (4h effort)
2. **Add Three.js scene state verification** (3h effort)
3. **Remove silent error continuations** (2h effort)

**Total P0 Effort:** ~9 hours  
**Impact:** 🔴 Critical - Without these fixes, tests may pass with broken game logic

### Success Metrics (After P0 Fixes):
- ✅ Game mechanic verification in >25 tests (vs 6 currently)
- ✅ Zero silent error continuations (vs 17 currently)
- ✅ Three.js scene validation in >12 tests (vs 0 currently)
- ✅ Strong assertions increase to >60% (vs 30% currently)

**흑괘의 길을 걸어라** - *Walk the Path of the Black Trigram*

---

**Report End**
