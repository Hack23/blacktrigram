# Remaining Tasks for Black Trigram Project

This document consolidates all outstanding issues, improvements, and recommendations identified during comprehensive audits of the Black Trigram codebase.

**Status**: Updated 2026-01-29  
**Priority**: High (Code Quality & Completeness)

---

## Executive Summary

### Critical Metrics
- **Test Coverage**: 64.6% → Target: 90%+
- **Files Without Tests**: 179 files (35.4% gap)
- **Console Pollution**: 100+ test files need cleanup
- **Animation Duplicates**: 29 groups (~150 instances)
- **Technique Systems**: 2 separate systems (72 total techniques)

### Timeline
- **4 weeks** to 90%+ coverage
- **7 phases** of improvements
- **Parallel work streams** for efficiency

---

## Phase 1: Critical Test Coverage (Week 1)

### Priority: HIGH - 50 files

**Animation Systems (26 files - 11% coverage):**
- `src/systems/animation/builders/` - 10 files
- `src/systems/animation/catalogs/` - 9 files
- `src/systems/animation/core/` - 6 files
- `src/systems/animation/utils/` - 1 file

**AI & Physics (8 files):**
- `src/systems/ai/DecisionTree.ts`
- `src/systems/ai/AIController.ts`
- `src/systems/ai/AIState.ts`
- `src/systems/physics/CombatPhysics.ts`
- `src/systems/physics/PhysicsEngine.ts`
- `src/systems/physics/CollisionDetection.ts`
- `src/systems/physics/ForceCalculator.ts`
- `src/systems/physics/VelocityManager.ts`

**Data Layer (2 files):**
- `src/data/techniques.ts` - Partial coverage
- `src/data/animations.ts` - Partial coverage

**Combat Helpers (2 files):**
- `src/components/screens/combat/helpers/techniqueSelection.ts`
- `src/components/screens/combat/helpers/stanceTransition.ts`

**Action Items:**
1. Create test files following naming convention: `module.test.ts`
2. Target 80%+ coverage for each file
3. Focus on business logic, not trivial getters
4. Use existing test patterns from repository

**Template:**
```typescript
import { describe, expect, it } from 'vitest';
import { functionUnderTest } from './module';

describe('Module', () => {
  describe('functionUnderTest', () => {
    it('should handle normal case', () => {
      expect(functionUnderTest(input)).toBe(expected);
    });

    it('should handle edge case', () => {
      expect(functionUnderTest(edgeInput)).toBe(edgeExpected);
    });

    it('should handle error case', () => {
      expect(() => functionUnderTest(invalid)).toThrow();
    });
  });
});
```

---

## Phase 2: Console Output Cleanup (Week 1-2)

### Priority: HIGH - 100+ files

**Problem**: Tests using `console.log/warn/error` instead of assertions pollute CI logs and hide real issues.

**Files Identified:**
- `AnimationRegistryCompleteness.test.ts`
- `DecisionTree.test.ts`
- `TechniqueVariety.test.ts`
- ~97 additional files

**Action Items:**
1. Search for `console.log` in test files: `grep -r "console\." src/**/*.test.ts`
2. Replace with proper assertions:
   - `console.log(value)` → `expect(value).toBeDefined()`
   - `console.warn(issue)` → `expect(issue).toBeNull()` or fail the test
   - `console.error(error)` → `expect(fn).toThrow()`
3. Remove debug statements entirely
4. Use test descriptions for documentation instead

**Pattern:**
```typescript
// ❌ Bad
console.log('Testing feature X...');
console.log(`Result: ${result}`);

// ✅ Good
it('should produce correct result for feature X', () => {
  expect(result).toBe(expectedResult);
});
```

---

## Phase 3: Cypress Test Consolidation (Week 2)

### Priority: MEDIUM - Duplicate E2E tests

**Duplicates Identified:**
1. `cypress/e2e/screens/intro-screen.cy.ts` (87 lines)
2. `cypress/e2e/screens/intro-screen-fix-verification.cy.ts` (76 lines)

**Action Items:**
1. Merge both files into single `intro-screen.cy.ts`
2. Combine overlapping test cases
3. Remove redundant assertions
4. Organize into logical describe blocks

**Pattern:**
```typescript
describe('Intro Screen', () => {
  describe('Initial Load', () => {
    it('should render all elements', () => { /* ... */ });
  });

  describe('Interactions', () => {
    it('should respond to clicks', () => { /* ... */ });
  });

  describe('Accessibility', () => {
    it('should meet WCAG standards', () => { /* ... */ });
  });
});
```

---

## Phase 4: Component Test Coverage (Week 3)

### Priority: MEDIUM - 35 files

**Screen Components (20 files - 67% coverage):**
- Combat screens with complex state
- Training screens with animations
- Menu screens with navigation

**Shared Components (15 files - 57% coverage):**
- UI components (buttons, panels)
- 3D components (meshes, effects)
- Utility components (loaders, errors)

**Focus Areas:**
1. User interactions (clicks, keyboard)
2. State management (props, hooks)
3. Rendering logic (conditional, loops)
4. Error boundaries

**React Testing Pattern:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Component } from './Component';

describe('Component', () => {
  it('should render with props', () => {
    render(<Component prop={value} />);
    expect(screen.getByText('Expected')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    const onAction = vi.fn();
    render(<Component onAction={onAction} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onAction).toHaveBeenCalled();
  });
});
```

---

## Phase 5: Animation Duplicate Consolidation (Week 3-4)

### Priority: MEDIUM - 29 groups

**Major Duplicates:**
1. **pressure_point** (10 techniques) - 47% of archetype techniques
2. **punch_mid** (5 techniques) - 24%
3. **punch_high** (3 techniques) - 14%
4. **block variations** (6 techniques)
5. **elbow strikes** (5 techniques)
6. **spinning kicks** (3 techniques)

**Structural Issues:**
- `gan_immovable_stance`: 0 keyframes (needs keyframes added)
- Only 34.3% of animations start at time 0 (should be 90%+)

**Action Items:**
1. Create unique animation variants:
   - `pressure_point` → `pressure_point_quick`, `pressure_point_strong`, etc.
   - Or use animation parameters (speed, power) instead of duplicates
2. Fix `gan_immovable_stance` by adding proper keyframes
3. Normalize animation timing (start all at time 0)
4. Update technique definitions to reference unique animations
5. Test all techniques to verify animations play correctly

**Strategy:**
```typescript
// Option A: Create variants
pressure_point_quick: { /* animation data */ }
pressure_point_strong: { /* animation data */ }
pressure_point_precise: { /* animation data */ }

// Option B: Parameterize (preferred)
pressure_point: {
  keyframes: [/* ... */],
  variants: {
    speed: [0.8, 1.0, 1.2],
    power: [0.8, 1.0, 1.2]
  }
}
```

---

## Phase 6: Infrastructure Test Coverage (Week 4)

### Priority: LOW - 49 files

**Infrastructure (45 files - 10% coverage):**
- Build configuration files
- Vite plugins
- Test utilities
- Type definitions
- Index/barrel files

**Utils/Helpers (5 files - 94% coverage - mostly complete):**
- Just 5 remaining utility files need tests

**Action Items:**
1. Test public APIs only (not internals)
2. Focus on configuration parsing
3. Test error handling in utilities
4. Skip trivial re-exports (index files)

---

## Phase 7: Technique System Integration (Week 4+)

### Priority: MEDIUM - Strategic decision needed

**Current State:**
- **Archetype System**: 21 techniques (gameplay-focused)
- **Trigram System**: 51 techniques (traditional Korean martial arts)
- **Total**: 72 unique techniques with ZERO overlap

### Merge Systems
**Benefits:**
- 72+ total techniques available
- Cultural authenticity + gameplay variety
- Each archetype can use trigram stances
- Unified technique selection

**Requirements:**
1. Extend `TechniqueId` enum to include all 72 techniques
2. Map trigram techniques to `AnimationType` in `TECHNIQUE_TO_ANIMATION_TYPE`
3. Update `CombatScreen3D.getTechniqueAnimationType()` to handle both systems
4. Create unified technique selection UI
5. Test all combinations

**Effort**: 2-3 weeks

---

## Critical Issues (Immediate Attention)

### 1. getTechniqueAnimationType Fallback
**Issue**: Function returns undefined for trigram techniques, disabling attack movement.

**Fix Required:**
```typescript
const getTechniqueAnimationType = useCallback(
  (techniqueId: string | undefined): AnimationType | undefined => {
    if (!techniqueId) return undefined;
    
    // Primary: enum-based mapping (archetype techniques)
    const mappedType = getAnimationTypeForTechnique(techniqueId);
    if (mappedType !== undefined) {
      return mappedType;
    }
    
    // Fallback: derive from animation system (trigram techniques)
    const animation = getAnimationForTechnique(techniqueId);
    if (animation && typeof animation === 'object') {
      return animation.type || animation.animationType;
    }
    
    return undefined;
  },
  []
);
```

**Location**: `src/components/screens/combat/CombatScreen3D.tsx:1056-1064`

### 2. Type Safety in Mappings
**Issue**: `getAnimationTypeForTechnique` casts string to TechniqueId unsafely.

**Status**: ✅ Fixed with improved documentation

### 3. Test Console Pollution
**Issue**: 100+ test files with console output.

**Status**: ⚠️ In Progress (Phase 2)

---

## Success Metrics

### Coverage Goals
| Phase | Target | Files | Increment |
|-------|--------|-------|-----------|
| Current | 64.6% | 326 | Baseline |
| Phase 1 | 70% | +26 | +5.4% |
| Phase 2 | 75% | +25 | +5.0% |
| Phase 3 | 80% | +25 | +5.0% |
| Phase 4 | 85% | +25 | +5.0% |
| Phase 5 | 90% | +25 | +5.0% |
| **Target** | **90%+** | **+179** | **+25.4%** |

### Quality Improvements
- Console output: High → Zero
- Duplicate Cypress: 2 → 1
- Duplicate animations: 29 groups → 0
- Test coverage: 64.6% → 90%+

### Testing Standards
1. **File Naming**: `module.ts` + `module.test.ts` (co-located)
2. **Test Structure**: `describe` → `it` pattern
3. **No Console**: Only `expect()` assertions
4. **Coverage**: 80%+ for new code, 95%+ for critical paths

---

## Resource Allocation

### Parallel Work Streams

**Stream 1** (Weeks 1-2): Critical Business Logic
- Animation systems tests
- AI decision tree tests
- Physics engine tests
- Data layer tests

**Stream 2** (Weeks 1-2): Quality Cleanup
- Console output removal
- Cypress consolidation
- Test organization

**Stream 3** (Weeks 2-3): Component Coverage
- Screen component tests
- Shared component tests
- Integration tests

**Stream 4** (Weeks 3-4): Completion
- Infrastructure tests
- Animation fixes
- Final push to 90%+

---

## Implementation Checklist

### Week 1
- [ ] Create 26 test files for animation systems
- [ ] Create 8 test files for AI & physics
- [ ] Remove console.log from 50 high-priority test files
- [ ] Document remaining console cleanup items

### Week 2
- [ ] Remove console.log from remaining 50 test files
- [ ] Merge Cypress duplicate tests
- [ ] Create 15 test files for screen components
- [ ] Begin animation duplicate analysis

### Week 3
- [ ] Create 20 test files for remaining components
- [ ] Fix animation structural issues (0 keyframes, timing)
- [ ] Create animation variants or parameterization
- [ ] Update technique definitions

### Week 4
- [ ] Create 49 test files for infrastructure
- [ ] Complete animation consolidation
- [ ] Run full test suite and verify 90%+ coverage
- [ ] Update documentation

### Post-Week 4
- [ ] Decision on technique system integration
- [ ] Implement chosen integration option
- [ ] Final testing and validation
- [ ] Celebrate success! 🎉

---

## Risk Assessment

### Low Risk
- Adding new tests (no behavior change)
- Console cleanup (output only)
- Documentation updates

### Medium Risk
- Cypress consolidation (E2E coverage)
- Animation deduplication (gameplay impact)
- Component refactoring

### High Risk
- Technique system integration (architectural change)
- Breaking changes to animation system

### Mitigation
- Incremental changes with validation
- Full test suite after each phase
- Visual regression testing for animations
- Staged rollout for major changes
- Rollback plan for each phase

---

## Progress Tracking

### Completed ✅
- Comprehensive test coverage analysis
- Technique system audit (all 72 techniques verified)
- Memory efficiency audit (A+ grade achieved)
- Audit script improvements (90% false positive reduction)
- Enum-based technique mapping system

### In Progress 🔄
- Test file creation (Phase 1)
- Console output cleanup (Phase 2)

### Not Started ⏳
- Cypress consolidation (Phase 3)
- Component test coverage (Phase 4)
- Animation consolidation (Phase 5)
- Infrastructure tests (Phase 6)
- Technique integration (Phase 7)

---

## Contact & Questions

For questions or clarifications on any task:
1. Review referenced documentation files
2. Check existing test patterns in codebase
3. Follow established coding standards
4. Create GitHub issue for discussion if needed

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

**Status**: Ready for Execution  
**Priority**: High  
**Timeline**: 4 weeks to 90%+ coverage  
**Confidence**: High
