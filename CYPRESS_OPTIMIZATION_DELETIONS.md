# Cypress Test Optimization - Files to Delete

## After verifying the new optimized tests work correctly, DELETE these redundant test files:

### Files to DELETE (once optimizations are verified):
1. `cypress/e2e/core-features.cy.ts` - Merged into `game-journey.cy.ts`
2. `cypress/e2e/game-flow.cy.ts` - Merged into `game-journey.cy.ts`
3. `cypress/e2e/combat-mode.cy.ts` - Merged into `combat-flow.cy.ts`
4. `cypress/e2e/combat-screen-layout.cy.ts` - Merged into `combat-flow.cy.ts`
5. `cypress/e2e/combat-system-integration.cy.ts` - Merged into `combat-flow.cy.ts`
6. `cypress/e2e/training-mode.cy.ts` - Merged into `training-flow.cy.ts`
7. `cypress/e2e/training-system-integration.cy.ts` - Merged into `training-flow.cy.ts`

### Files to KEEP (optimized):
1. `cypress/e2e/app.cy.ts` - **OPTIMIZED** as fast smoke test
2. `cypress/e2e/pixi-korean-martial-arts.cy.ts` - **OPTIMIZED** with reduced granularity
3. `cypress/e2e/game-journey.cy.ts` - **NEW** consolidated game flow tests
4. `cypress/e2e/combat-flow.cy.ts` - **NEW** consolidated combat tests
5. `cypress/e2e/training-flow.cy.ts` - **NEW** consolidated training tests

## Test Count Summary:

### Before Optimization:
- **9 test files**
- **~70 individual test cases**
- **~21 minutes runtime**

### After Optimization:
- **5 test files** (4 deleted, 3 new created, 2 optimized)
- **~25-30 test cases** (consolidated)
- **~6-8 minutes expected runtime** (60-65% reduction)

## Deletion Command (use after verification):

```bash
# DO NOT run until new tests are verified to work!
cd cypress/e2e
rm core-features.cy.ts
rm game-flow.cy.ts
rm combat-mode.cy.ts
rm combat-screen-layout.cy.ts
rm combat-system-integration.cy.ts
rm training-mode.cy.ts
rm training-system-integration.cy.ts
```

## Verification Steps Before Deletion:

1. Run new tests locally: `npm run test:e2e`
2. Verify all pass
3. Check CI test run passes
4. Compare coverage - should be same or better
5. Review test times - should be 60%+ faster
6. Only then delete the old files

## Coverage Verification:

Use this command to ensure no coverage loss:
```bash
# Run coverage comparison
npm run test:e2e -- --spec "cypress/e2e/game-journey.cy.ts,cypress/e2e/combat-flow.cy.ts,cypress/e2e/training-flow.cy.ts"
# Compare with old:
# npm run test:e2e -- --spec "cypress/e2e/game-flow.cy.ts,cypress/e2e/core-features.cy.ts,cypress/e2e/combat-*.cy.ts,cypress/e2e/training-*.cy.ts"
```
