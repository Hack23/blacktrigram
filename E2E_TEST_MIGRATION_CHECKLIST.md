# E2E Test Migration Checklist

**Black Trigram (흑괘) - Step-by-Step Improvement Guide**  
**Version:** 1.0  
**Date:** 2026-01-19

---

## Overview

Use this checklist to systematically improve each E2E test file. Work through tests one at a time, validating improvements before moving to the next.

---

## Pre-Migration Setup

### Environment Validation
- [ ] Cypress version is 15.9.0 or higher
- [ ] Vitest version is 4.0.17 or higher
- [ ] All existing tests pass (baseline)
- [ ] Execution time measured (baseline)
- [ ] Documentation reviewed

### Baseline Metrics
```bash
# Record current state
echo "=== BASELINE METRICS ===" > migration-log.txt
date >> migration-log.txt

# Count fixed waits
echo "Fixed waits:" >> migration-log.txt
grep -r "cy.wait(" cypress/e2e --include="*.cy.ts" | wc -l >> migration-log.txt

# Count assertions
echo "Should assertions:" >> migration-log.txt
grep -r "should(" cypress/e2e --include="*.cy.ts" | wc -l >> migration-log.txt
echo "Expect assertions:" >> migration-log.txt
grep -r "expect(" cypress/e2e --include="*.cy.ts" | wc -l >> migration-log.txt

# Measure execution time
echo "Execution time:" >> migration-log.txt
time npm run test:e2e 2>&1 | grep real >> migration-log.txt
```

---

## Per-File Migration Checklist

Use this checklist for EACH test file you migrate.

### File: `_______________________`

#### Phase 1: Analysis (5-10 minutes)
- [ ] Open test file in editor
- [ ] Count `cy.wait()` calls: _____ calls
- [ ] List actions without assertions: _____
- [ ] Identify potential flaky patterns: _____
- [ ] Note current test structure

**Analysis Notes:**
```
Fixed waits found:
1. cy.wait(500) - line __
2. cy.wait(300) - line __
3. ...

Actions without validation:
1. cy.get('button').click() - line __
2. cy.get('body').type('1') - line __
3. ...
```

---

#### Phase 2: Backup & Branch (2 minutes)
```bash
# Create backup
cp cypress/e2e/path/to/test.cy.ts cypress/e2e/path/to/test.cy.ts.backup

# Verify backup
ls -la cypress/e2e/path/to/test.cy.ts*
```

---

#### Phase 3: Test Structure Updates (10-15 minutes)

##### beforeEach() Hook
- [ ] Add cy.session() for test isolation
- [ ] Add validation callback
- [ ] Remove redundant setup code

**Pattern:**
```typescript
beforeEach(() => {
  cy.session('test-session', () => {
    cy.visitWithWebGLMock("/");
    cy.waitForCanvasReady();
    // Add any screen navigation
  }, {
    validate: () => {
      cy.get('[data-testid="screen"]').should('exist');
    }
  });
  
  // Ensure correct state after session restore
  cy.get('[data-testid="screen"]').should('exist');
});
```

##### afterEach() Hook
- [ ] Add window cleanup
- [ ] Add game state cleanup
- [ ] Add navigation to safe state

**Pattern:**
```typescript
afterEach(() => {
  // Clean up game state
  cy.window().then(win => {
    if ((win as any).__game?.cleanup) {
      (win as any).__game.cleanup();
    }
  });
  
  // Return to safe state
  cy.get('body').then($body => {
    if ($body.find('[data-testid="non-intro-screen"]').length > 0) {
      cy.returnToIntro();
    }
  });
});
```

---

#### Phase 4: Replace Fixed Waits (20-30 minutes)

For EACH `cy.wait()` call:

##### Wait #1: `cy.wait(___)`
- [ ] Identify what we're waiting for: _____
- [ ] Replace with assertion-based wait
- [ ] Test still passes

**Before:**
```typescript
cy.wait(500);
```

**After:**
```typescript
cy.get('[data-testid="element"]', { timeout: 2000 })
  .should('exist')
  .and('be.visible');
```

##### Wait #2: `cy.wait(___)`
- [ ] Identify what we're waiting for: _____
- [ ] Replace with assertion-based wait
- [ ] Test still passes

##### Wait #3: `cy.wait(___)`
- [ ] Identify what we're waiting for: _____
- [ ] Replace with assertion-based wait
- [ ] Test still passes

**Continue for all waits...**

---

#### Phase 5: Add Missing Assertions (15-20 minutes)

For EACH action without validation:

##### Action #1: _____________________
- [ ] Identify expected result
- [ ] Add assertion
- [ ] Test still passes

**Before:**
```typescript
cy.get('button').click();
```

**After:**
```typescript
cy.get('button', { timeout: 2000 })
  .should('be.visible')
  .click();

cy.get('[data-testid="result"]', { timeout: 1500 })
  .should('exist')
  .and('be.visible');
```

##### Action #2: _____________________
- [ ] Identify expected result
- [ ] Add assertion
- [ ] Test still passes

**Continue for all actions...**

---

#### Phase 6: Add State Validation (15-20 minutes)

For EACH state-changing action:

##### State Change #1: _____________________
- [ ] Capture initial state
- [ ] Perform action
- [ ] Verify state changed
- [ ] Test still passes

**Pattern:**
```typescript
cy.get('[data-testid="state-indicator"]')
  .invoke('attr', 'data-value')
  .then(initialValue => {
    // Perform action
    cy.get('button').click();
    
    // Verify state changed
    cy.get('[data-testid="state-indicator"]', { timeout: 1500 })
      .invoke('attr', 'data-value')
      .should('not.equal', initialValue);
  });
```

##### State Change #2: _____________________
- [ ] Capture initial state
- [ ] Perform action
- [ ] Verify state changed
- [ ] Test still passes

**Continue for all state changes...**

---

#### Phase 7: Add Performance Assertions (10 minutes)

- [ ] Add FPS monitoring for 3D scenes
- [ ] Add performance budgets for actions
- [ ] Test still passes

**Patterns:**
```typescript
// FPS monitoring
cy.assertMinFPS(30, 2000);
cy.assertSmoothFPS(2000); // For 60fps target

// Performance budgets
const startTime = Date.now();
cy.get('[data-testid="element"]').should('exist');
cy.wrap(null).then(() => {
  const duration = Date.now() - startTime;
  expect(duration, 'Action should complete quickly').to.be.lessThan(1000);
  cy.task('logPerformance', { name: 'Action Name', duration });
});
```

---

#### Phase 8: Add Error Handling (10 minutes)

- [ ] Add error element checks
- [ ] Add fallback navigation
- [ ] Add graceful degradation
- [ ] Test still passes

**Patterns:**
```typescript
// Check for errors
cy.get('body').then($body => {
  const errors = $body.find('[data-testid*="error"], .error');
  expect(errors, 'No errors should be present').to.have.length(0);
});

// Fallback navigation
cy.get('body').then($body => {
  if ($body.find('[data-testid="button"]').length > 0) {
    cy.get('[data-testid="button"]').click();
  } else {
    cy.log('⚠️ Button not found, using keyboard shortcut');
    cy.get('body').type('1');
  }
});
```

---

#### Phase 9: Validation & Testing (15 minutes)

- [ ] Run test file in isolation
```bash
npx cypress run --spec "cypress/e2e/path/to/test.cy.ts"
```

- [ ] Test passes ✅
- [ ] Run test 3x to check for flakiness
```bash
for i in {1..3}; do 
  npx cypress run --spec "cypress/e2e/path/to/test.cy.ts"
done
```

- [ ] All 3 runs pass ✅
- [ ] Measure new execution time: _____ seconds
- [ ] Compare to baseline: _____ seconds (___% improvement)

---

#### Phase 10: Documentation (5 minutes)

- [ ] Add comments for complex logic
- [ ] Update test description
- [ ] Document any gotchas

**Update migration log:**
```bash
echo "=== FILE MIGRATED ===" >> migration-log.txt
echo "File: cypress/e2e/path/to/test.cy.ts" >> migration-log.txt
echo "Fixed waits removed: ___" >> migration-log.txt
echo "Assertions added: ___" >> migration-log.txt
echo "Execution time: ___ seconds" >> migration-log.txt
echo "Improvement: ___%" >> migration-log.txt
echo "" >> migration-log.txt
```

---

#### Phase 11: Cleanup (2 minutes)

- [ ] Remove backup file
```bash
rm cypress/e2e/path/to/test.cy.ts.backup
```

- [ ] Commit changes
```bash
git add cypress/e2e/path/to/test.cy.ts
git commit -m "Improve E2E test: [test name] - remove waits, add validation"
```

---

## File-by-File Progress Tracker

### Test Files to Migrate (8 total)

#### 1. intro-screen.cy.ts
- [ ] Analysis complete
- [ ] Structure updated
- [ ] Waits replaced: ___ / ___
- [ ] Assertions added: ___
- [ ] Validation complete
- [ ] Performance: ___ seconds (___% improvement)
- [ ] Status: ⏳ Not Started / 🔄 In Progress / ✅ Complete

#### 2. combat-screen.cy.ts
- [ ] Analysis complete
- [ ] Structure updated
- [ ] Waits replaced: ___ / ___
- [ ] Assertions added: ___
- [ ] Validation complete
- [ ] Performance: ___ seconds (___% improvement)
- [ ] Status: ⏳ Not Started / 🔄 In Progress / ✅ Complete

#### 3. training-screen.cy.ts
- [ ] Analysis complete
- [ ] Structure updated
- [ ] Waits replaced: ___ / ___
- [ ] Assertions added: ___
- [ ] Validation complete
- [ ] Performance: ___ seconds (___% improvement)
- [ ] Status: ⏳ Not Started / 🔄 In Progress / ✅ Complete

#### 4. controls-screen.cy.ts
- [ ] Analysis complete
- [ ] Structure updated
- [ ] Waits replaced: ___ / ___
- [ ] Assertions added: ___
- [ ] Validation complete
- [ ] Performance: ___ seconds (___% improvement)
- [ ] Status: ⏳ Not Started / 🔄 In Progress / ✅ Complete

#### 5. philosophy-screen.cy.ts
- [ ] Analysis complete
- [ ] Structure updated
- [ ] Waits replaced: ___ / ___
- [ ] Assertions added: ___
- [ ] Validation complete
- [ ] Performance: ___ seconds (___% improvement)
- [ ] Status: ⏳ Not Started / 🔄 In Progress / ✅ Complete

#### 6. webgl-verification.cy.ts
- [ ] Analysis complete
- [ ] Structure updated
- [ ] Waits replaced: ___ / ___
- [ ] Assertions added: ___
- [ ] Validation complete
- [ ] Performance: ___ seconds (___% improvement)
- [ ] Status: ⏳ Not Started / 🔄 In Progress / ✅ Complete

#### 7. performance-threejs.cy.ts
- [ ] Analysis complete
- [ ] Structure updated
- [ ] Waits replaced: ___ / ___
- [ ] Assertions added: ___
- [ ] Validation complete
- [ ] Performance: ___ seconds (___% improvement)
- [ ] Status: ⏳ Not Started / 🔄 In Progress / ✅ Complete

#### 8. mobile-overlay-responsiveness.cy.ts
- [ ] Analysis complete
- [ ] Structure updated
- [ ] Waits replaced: ___ / ___
- [ ] Assertions added: ___
- [ ] Validation complete
- [ ] Performance: ___ seconds (___% improvement)
- [ ] Status: ⏳ Not Started / 🔄 In Progress / ✅ Complete

---

## Post-Migration Validation

### Final Test Run
```bash
# Run entire test suite
npm run test:e2e

# Measure final execution time
time npm run test:e2e
```

### Final Metrics
```bash
echo "=== FINAL METRICS ===" >> migration-log.txt
date >> migration-log.txt

# Count fixed waits
echo "Fixed waits:" >> migration-log.txt
grep -r "cy.wait(" cypress/e2e --include="*.cy.ts" | wc -l >> migration-log.txt

# Count assertions
echo "Should assertions:" >> migration-log.txt
grep -r "should(" cypress/e2e --include="*.cy.ts" | wc -l >> migration-log.txt
echo "Expect assertions:" >> migration-log.txt
grep -r "expect(" cypress/e2e --include="*.cy.ts" | wc -l >> migration-log.txt

# Compare to baseline
echo "" >> migration-log.txt
echo "=== IMPROVEMENTS ===" >> migration-log.txt
```

### Success Checklist
- [ ] All tests pass
- [ ] Execution time < 8 minutes (33% improvement)
- [ ] Fixed waits < 40 (65% reduction)
- [ ] Assertions > 250 (70% increase)
- [ ] No flaky tests (3x run validation)
- [ ] Documentation updated

---

## Common Patterns Reference

### Pattern 1: Replace Simple Wait
```typescript
// ❌ BEFORE
cy.wait(300);

// ✅ AFTER
cy.get('[data-testid="element"]', { timeout: 2000 })
  .should('exist')
  .and('be.visible');
```

### Pattern 2: Replace Wait After Action
```typescript
// ❌ BEFORE
cy.get('button').click();
cy.wait(500);

// ✅ AFTER
cy.get('button', { timeout: 2000 })
  .should('be.visible')
  .click();

cy.get('[data-testid="result"]', { timeout: 1500 })
  .should('exist');
```

### Pattern 3: Validate State Change
```typescript
// ❌ BEFORE
cy.get('body').type('1');
cy.wait(100);

// ✅ AFTER
cy.get('[data-testid="state"]')
  .invoke('text')
  .then(before => {
    cy.get('body').type('1');
    cy.get('[data-testid="state"]', { timeout: 1000 })
      .invoke('text')
      .should('not.equal', before);
  });
```

### Pattern 4: Combat Action Validation
```typescript
// ❌ BEFORE
cy.get('body').type(' '); // Attack
cy.wait(300);

// ✅ AFTER
cy.get('[data-testid="opponent-health"]')
  .invoke('attr', 'data-current')
  .then(before => {
    cy.get('body').type(' ');
    cy.get('[data-testid="opponent-health"]', { timeout: 1500 })
      .invoke('attr', 'data-current')
      .should('not.equal', before);
  });
```

---

## Troubleshooting

### Test Fails After Migration
1. Check timeout values (may need adjustment)
2. Verify element selectors are correct
3. Check if state changes immediately
4. Review Cypress logs for exact failure
5. Compare to improved examples

### Test Becomes Flaky
1. Check for race conditions
2. Increase timeout values
3. Add intermediate assertions
4. Verify element is stable before interaction
5. Use cy.session() for better isolation

### Test Runs Slower
1. Review timeout values (may be too long)
2. Check for redundant assertions
3. Verify cleanup is efficient
4. Consider parallel test execution
5. Profile test execution

---

## Resources

### Documentation
- [E2E_TEST_IMPROVEMENT_ANALYSIS.md](./E2E_TEST_IMPROVEMENT_ANALYSIS.md)
- [E2E_TEST_BEST_PRACTICES_GUIDE.md](./E2E_TEST_BEST_PRACTICES_GUIDE.md)
- [E2E_TEST_IMPROVEMENT_SUMMARY.md](./E2E_TEST_IMPROVEMENT_SUMMARY.md)

### Examples
- [combat-screen-improved.cy.ts](./cypress/e2e/screens/combat-screen-improved.cy.ts)
- [intro-screen-improved.cy.ts](./cypress/e2e/screens/intro-screen-improved.cy.ts)

---

**Checklist Version:** 1.0  
**Last Updated:** 2026-01-19  
**Maintained By:** Test Specialist Agent

**🥋 흑괘의 품질을 지키라** - _Protect the Quality of Black Trigram_
