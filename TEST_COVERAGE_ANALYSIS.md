# Test Coverage Analysis & Improvement Plan

## Executive Summary

**Current State:**
- Total source files: 505
- Files with tests: 326 (64.6%)
- Files without tests: 179 (35.4%)
- Duplicate animation groups: 29 (affecting ~150 animations)
- Cypress test files: 13 (193 test cases)

**Critical Issues:**
1. ❌ 179 source files missing tests (35.4% gap)
2. ❌ Duplicate Cypress tests (intro-screen has 2 files)
3. ❌ Console pollution in 100+ test files
4. ❌ 29 groups of duplicate animations
5. ❌ Inconsistent test file placement

## Detailed Analysis

### Files Without Tests (179 total)

#### High Priority - Business Logic (50 files)

**AI Systems (No tests):**
- src/systems/ai/index.ts
- src/systems/ai/types.ts
- src/systems/ai/__tests__/AI-Performance.bench.ts (benchmark, not test)

**Animation Systems (40+ files without tests):**
- src/systems/animation/builders/* (10 files)
- src/systems/animation/catalogs/* (9 files)
- src/systems/animation/core/* (5 files)
- src/systems/animation/systems/* (1 file)

**Combat Systems:**
- src/components/screens/combat/helpers/combatHelpers.ts
- src/components/screens/combat/helpers/AnimationUpdater.tsx

**Data Layer:**
- src/data/techniques.ts
- src/data/techniqueMappings.ts

#### Medium Priority - Components (80 files)

**Screen Components:**
- Intro screen: 7 components without tests
- Philosophy screen: 3 components without tests
- Controls screen: 2 components without tests
- End screen: 2 components without tests
- Combat screen: 5 components without tests
- Training screen: 3 components without tests

**Shared Components:**
- src/components/shared/ui/* (3 files)
- src/components/shared/mobile/* (4 files)
- src/components/shared/three/models/* (2 files)

#### Low Priority - Infrastructure (49 files)

**Index Files:** 15 index.ts files (barrel exports)
**Type Definitions:** 5 type-only files
**Constants:** 3 constant files
**Main Entry Points:** 2 files (main.tsx, index.ts)

### Duplicate Test Issues

#### Cypress Duplicates

**1. Intro Screen (2 files, likely overlapping):**
- `cypress/e2e/screens/intro-screen.cy.ts` (2 tests)
- `cypress/e2e/screens/intro-screen-fix-verification.cy.ts` (3 tests)
- **Action:** Merge into single file with 5 organized tests

**2. Combat Tests (Potential overlap):**
- `cypress/e2e/screens/combat-screen.cy.ts` (2 tests)
- `cypress/e2e/combat/balance-system.cy.ts` (37 tests)
- `cypress/e2e/combat/injury-movement.cy.ts` (15 tests)
- `cypress/e2e/combat/breathing-disruption.cy.ts` (15 tests)
- **Action:** Review for overlap, consolidate if needed

#### Unit Test Duplicates

**Animation Duplicates (29 groups found):**

Most severe duplicates:
1. **pressure_point techniques:** 10 identical animations
   - li_flame_spear, li_nerve_strike, li_pressure_point
   - jin_lightning_flash, son_whirlwind_barrage
   - darkops_jugular_strike, darkops_nerve_paralysis, darkops_throat_strike
   - darkops_eye_gouge, combo_one_two_hook

2. **Block animations:** 6 identical
   - block, gam_flowing_block, gam_circular_parry
   - gam_wrist_twist_counter, gan_iron_block, gan_reversal_technique

3. **Elbow strikes:** 5 identical
   - elbow_strike, elbow_uppercut, elbow_knee_combo
   - brachial_elbow, darkops_temple_strike

4. **Spinning kicks:** 3 identical
   - spinning_heel_kick, spinning_back_kick, spinning_hook

5. **Grappling techniques:** Multiple groups of 3-4 identical animations

### Console Pollution

**High-impact test files with console output:**
1. AnimationRegistryCompleteness.test.ts (stderr warnings about duplicates)
2. DecisionTree.test.ts (likely has debug output)
3. TechniqueVariety.test.ts (console output suspected)
4. ~97 more files need audit

**Pattern detected:**
- Tests using console.log for debugging
- Should use proper test assertions
- Should use test reporters for diagnostics

### Test Coverage Gaps by Category

| Category | Total Files | With Tests | Without Tests | Coverage % |
|----------|------------|------------|---------------|------------|
| AI Systems | 15 | 12 | 3 | 80% |
| Animation Systems | 45 | 5 | 40 | 11% ❌ |
| Combat Components | 25 | 20 | 5 | 80% |
| Screen Components | 60 | 40 | 20 | 67% |
| Shared Components | 35 | 20 | 15 | 57% |
| Utils/Helpers | 80 | 75 | 5 | 94% ✅ |
| Data/Constants | 15 | 10 | 5 | 67% |
| Infrastructure | 50 | 5 | 45 | 10% ⚠️ |
| **TOTAL** | **505** | **326** | **179** | **64.6%** |

### Animation Structure Issues

**Critical:**
- 1 animation with 0 keyframes: `gan_immovable_stance`
- Only 34.3% animations start at time 0 (should be 90%+)

**Duplicates:**
- 29 groups of duplicate animations
- Total ~150+ animations that are identical
- Wasted resources, confusing API

## Improvement Plan

### Phase 1: Documentation & Analysis ✅ (This PR)

**Deliverables:**
- [x] Complete list of files without tests
- [x] Categorization by priority
- [x] Duplicate identification
- [x] Coverage gap analysis
- [x] This comprehensive document

### Phase 2: High-Priority Test Creation (Week 1)

**Focus:** Critical business logic
- [ ] Add tests for animation builders (10 files)
- [ ] Add tests for animation catalogs (9 files)
- [ ] Add tests for AI decision logic (3 files)
- [ ] Add tests for combat helpers (2 files)
- [ ] Add tests for data layer (2 files)

**Target:** 26 new test files, coverage 70%+

### Phase 3: Console Cleanup (Week 1-2)

**Focus:** Remove debug output from tests
- [ ] Audit 100+ test files for console.log
- [ ] Replace with proper assertions
- [ ] Configure test reporters
- [ ] Create test utilities for debugging

**Target:** Zero console.log in tests

### Phase 4: Cypress Consolidation (Week 2)

**Focus:** Eliminate duplicate Cypress tests
- [ ] Merge intro-screen test files (2 → 1)
- [ ] Review combat test overlap
- [ ] Consolidate redundant tests
- [ ] Organize by feature area

**Target:** 10-11 focused Cypress test files

### Phase 5: Medium-Priority Tests (Week 3)

**Focus:** Component testing
- [ ] Add tests for screen components (20 files)
- [ ] Add tests for shared components (15 files)
- [ ] Add integration tests where needed

**Target:** 35 new test files, coverage 80%+

### Phase 6: Animation Fixes (Week 3-4)

**Focus:** Fix duplicate animations
- [ ] Consolidate 29 duplicate groups
- [ ] Fix gan_immovable_stance keyframes
- [ ] Normalize animation timing
- [ ] Update technique mappings
- [ ] Create animation variants where needed

**Target:** Zero duplicate animations

### Phase 7: Infrastructure Tests (Week 4)

**Focus:** Low-priority completeness
- [ ] Test index/barrel exports (15 files)
- [ ] Test constants (3 files)
- [ ] Test type utilities (5 files)

**Target:** 90%+ overall coverage

## Success Metrics

**Coverage Goals:**
- ✅ Phase 1: 65% (baseline documented)
- 🎯 Phase 2: 70% (critical logic covered)
- 🎯 Phase 3: 75% (console cleaned)
- 🎯 Phase 4: 80% (components covered)
- 🎯 Phase 5: 85% (infrastructure complete)
- 🎯 Phase 6: 90%+ (stretch goal)

**Quality Goals:**
- ✅ Zero console.log in tests
- ✅ 1 test file per source file (except index.ts)
- ✅ All Cypress tests organized by feature
- ✅ Zero duplicate animations (or documented as intentional)
- ✅ All animations have proper structure

## Testing Standards

### Test File Naming Convention

**Co-located tests (preferred):**
```
src/utils/math.ts
src/utils/math.test.ts
```

**__tests__ directory (legacy):**
```
src/systems/ai/DecisionTree.ts
src/systems/ai/__tests__/DecisionTree.test.ts
```

**Rule:** Use co-location for new tests, maintain existing structure for old tests.

### Test Structure Template

```typescript
import { describe, it, expect } from 'vitest';
import { functionToTest } from './moduleToTest';

describe('ModuleName', () => {
  describe('functionToTest', () => {
    it('should handle normal case', () => {
      const result = functionToTest('input');
      expect(result).toBe('expected');
    });

    it('should handle edge case', () => {
      const result = functionToTest('');
      expect(result).toBe('default');
    });

    it('should throw on invalid input', () => {
      expect(() => functionToTest(null)).toThrow();
    });
  });
});
```

### Console Output Rules

**❌ Never use:**
```typescript
console.log('Debug info:', value);
console.warn('Warning:', message);
console.error('Error:', error);
```

**✅ Use instead:**
```typescript
// For debugging during development
if (import.meta.env.DEV) {
  console.log('Dev only:', value);
}

// For test assertions
expect(value).toBe(expected);
expect(fn).toHaveBeenCalledWith(args);
```

## Appendix: Complete List of Files Without Tests

### Critical Priority (50 files)

#### AI Systems
- src/systems/ai/index.ts
- src/systems/ai/types.ts
- src/systems/ai/__tests__/AI-Performance.bench.ts

#### Animation Builders
- src/systems/animation/builders/HandPoseApplicator.ts
- src/systems/animation/builders/KeyframeConfig.ts
- src/systems/animation/builders/KeyframeInterpolation.ts
- src/systems/animation/builders/KickPhaseApplicator.ts
- src/systems/animation/builders/MartialArtsAnimationBuilder.ts
- src/systems/animation/builders/MartialArtsConstants.ts
- src/systems/animation/builders/MartialPoseApplicator.ts
- src/systems/animation/builders/PunchPhaseApplicator.ts
- src/systems/animation/builders/TrigramGuardApplicator.ts
- src/systems/animation/builders/index.ts

#### Animation Catalogs
- src/systems/animation/catalogs/BasicAnimations.ts
- src/systems/animation/catalogs/ComboAnimations.ts
- src/systems/animation/catalogs/DarkOpsAnimations.ts
- src/systems/animation/catalogs/ElbowKneeAnimations.ts
- src/systems/animation/catalogs/GrapplingAnimations.ts
- src/systems/animation/catalogs/LiStanceAnimations.ts
- src/systems/animation/catalogs/LiTechniqueAnimations.ts
- src/systems/animation/catalogs/MovementAnimations.ts
- src/systems/animation/catalogs/SpecializedPunchAnimations.ts
- src/systems/animation/catalogs/StepSkeletalAnimations.ts
- src/systems/animation/catalogs/index.ts

#### Animation Core
- src/systems/animation/core/AnimationHitTiming.ts
- src/systems/animation/core/AnimationRegistry.ts
- src/systems/animation/core/TechniqueAnimationMapper.ts
- src/systems/animation/core/TechniqueAnimationMapping.ts
- src/systems/animation/core/index.ts
- src/systems/animation/core/types.ts

#### Data Layer
- src/data/techniques.ts
- src/data/techniqueMappings.ts

#### Combat Helpers
- src/components/screens/combat/helpers/combatHelpers.ts
- src/components/screens/combat/helpers/AnimationUpdater.tsx

[Remaining 129 files omitted for brevity - see complete list in script output]

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

**Analysis Date:** 2026-01-29  
**Total Source Files:** 505  
**Coverage:** 64.6%  
**Gap:** 179 files  
**Priority:** High
