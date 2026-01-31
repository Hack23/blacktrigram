---
name: testing-strategy-enforcement
description: |
  Enforces comprehensive testing standards for Black Trigram including >90% coverage,
  unit tests (Vitest), E2E tests (Cypress), Three.js component testing, performance
  testing (60fps target), and accessibility testing. Ensures test quality and coverage.
license: MIT
---

# Testing Strategy Enforcement Skill

## Purpose

This skill ensures that all code changes in Black Trigram maintain exceptional test coverage, proper testing strategies across unit/E2E layers, and validate performance and accessibility standards throughout the codebase.

## When to Apply

**Automatically trigger this skill when:**
- Adding new features or components
- Modifying existing game logic or systems
- Implementing UI components (React or Three.js)
- Working with combat, animation, or vital point systems
- Creating or updating state management logic
- Adding performance-critical code
- Implementing accessibility features
- Refactoring existing code
- Reviewing pull requests with code changes

## Core Principles

### 1. Test Coverage Requirements

**ALWAYS maintain these coverage thresholds:**

✅ **Overall Coverage Targets**
```typescript
// vitest.config.ts - Coverage configuration
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      lines: 90,        // Minimum 90% line coverage
      functions: 90,    // Minimum 90% function coverage
      branches: 85,     // Minimum 85% branch coverage
      statements: 90,   // Minimum 90% statement coverage
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.test.ts',
        '**/*.test.tsx',
        'src/test/**',
      ],
    },
  },
});
```

✅ **Coverage by Component Type**
```typescript
// Target coverage levels per component category
const COVERAGE_TARGETS = {
  // Core game systems - CRITICAL
  combatSystem: { unit: 95, e2e: 85 },
  vitalPointSystem: { unit: 95, e2e: 80 },
  trigramSystem: { unit: 95, e2e: 80 },
  animationSystem: { unit: 90, e2e: 75 },
  
  // Three.js components - MODERATE (harder to test)
  threejsComponents: { unit: 85, e2e: 70 },
  sceneComponents: { unit: 85, e2e: 70 },
  
  // UI components - HIGH
  reactComponents: { unit: 95, e2e: 80 },
  screens: { unit: 90, e2e: 85 },
  
  // Utility functions - MAXIMUM
  utilities: { unit: 100, e2e: 0 },
  constants: { unit: 100, e2e: 0 },
  
  // Audio system - HIGH
  audioSystem: { unit: 90, e2e: 75 },
  
  // State management - CRITICAL
  stateManagement: { unit: 95, e2e: 80 },
} as const;
```

### 2. Unit Testing Strategy (Vitest)

**ALWAYS write comprehensive unit tests:**

✅ **Test File Organization**
```typescript
// ALWAYS place unit tests in __tests__ directory
src/
├── systems/
│   ├── combat/
│   │   ├── CombatSystem.ts
│   │   └── __tests__/
│   │       ├── CombatSystem.test.ts
│   │       ├── VitalPointSystem.test.ts
│   │       └── DamageCalculation.test.ts
│   ├── trigram/
│   │   ├── TrigramSystem.ts
│   │   └── __tests__/
│   │       └── TrigramSystem.test.ts
```

✅ **Comprehensive Test Structure**
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CombatSystem } from '../CombatSystem';
import { TRIGRAM_STANCES } from '@/types/constants';

describe('CombatSystem', () => {
  let combatSystem: CombatSystem;
  
  beforeEach(() => {
    // Setup fresh instance for each test
    combatSystem = new CombatSystem();
  });
  
  afterEach(() => {
    // Cleanup resources
    vi.clearAllMocks();
  });
  
  // Group related tests
  describe('Stance Management', () => {
    it('should initialize with Geon stance by default', () => {
      expect(combatSystem.currentStance).toBe('GEON');
    });
    
    it('should transition between all 8 trigram stances', () => {
      Object.keys(TRIGRAM_STANCES).forEach(stance => {
        combatSystem.setStance(stance);
        expect(combatSystem.currentStance).toBe(stance);
      });
    });
    
    it('should reject invalid stance names', () => {
      expect(() => combatSystem.setStance('INVALID')).toThrow();
    });
  });
  
  describe('Vital Point Targeting', () => {
    it('should detect all 70 vital points', () => {
      const vitalPoints = combatSystem.getVitalPoints();
      expect(vitalPoints).toHaveLength(70);
    });
    
    it('should calculate correct damage for vital point hit', () => {
      const damage = combatSystem.calculateVitalPointDamage({
        point: 'BAIHUI', // GV20
        force: 100,
        accuracy: 0.95,
      });
      
      expect(damage).toBeGreaterThan(100); // Vital point multiplier
      expect(damage).toBeLessThanOrEqual(200);
    });
    
    it('should apply reduced damage for missed vital points', () => {
      const missedDamage = combatSystem.calculateVitalPointDamage({
        point: 'BAIHUI',
        force: 100,
        accuracy: 0.3, // Poor accuracy
      });
      
      expect(missedDamage).toBeLessThan(100);
    });
  });
  
  describe('Performance', () => {
    it('should calculate combat within 5ms', () => {
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        combatSystem.calculateDamage(100, 0.8, 'BAIHUI');
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(5); // <5ms per frame budget
    });
  });
  
  describe('Edge Cases', () => {
    it('should handle zero damage gracefully', () => {
      const damage = combatSystem.calculateDamage(0, 1.0, 'BAIHUI');
      expect(damage).toBe(0);
    });
    
    it('should handle negative force by clamping to zero', () => {
      const damage = combatSystem.calculateDamage(-50, 1.0, 'BAIHUI');
      expect(damage).toBe(0);
    });
    
    it('should handle accuracy outside 0-1 range', () => {
      expect(() => 
        combatSystem.calculateDamage(100, 1.5, 'BAIHUI')
      ).toThrow();
    });
  });
});
```

✅ **Testing Three.js Components**
```typescript
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { describe, it, expect } from 'vitest';
import { CombatCharacter3D } from '../CombatCharacter3D';

describe('CombatCharacter3D', () => {
  // Helper to render Three.js components
  const render3D = (component: React.ReactElement) => {
    return render(
      <Canvas data-testid="test-canvas">
        <Suspense fallback={null}>
          {component}
        </Suspense>
      </Canvas>
    );
  };
  
  it('should render without crashing', () => {
    const { container } = render3D(
      <CombatCharacter3D 
        position={[0, 0, 0]} 
        stance="GEON" 
      />
    );
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
  
  it('should apply Korean theming colors', () => {
    const { container } = render3D(
      <CombatCharacter3D 
        position={[0, 0, 0]} 
        stance="GEON"
        data-testid="combat-character"
      />
    );
    
    // Verify component renders (color testing requires more complex setup)
    expect(container).toBeTruthy();
  });
  
  it('should update stance color when stance changes', () => {
    const { rerender } = render3D(
      <CombatCharacter3D position={[0, 0, 0]} stance="GEON" />
    );
    
    rerender(
      <Canvas>
        <CombatCharacter3D position={[0, 0, 0]} stance="TAE" />
      </Canvas>
    );
    
    // Verify re-render succeeds
    expect(true).toBe(true);
  });
});
```

### 3. E2E Testing Strategy (Cypress)

**ALWAYS write E2E tests for user workflows:**

✅ **E2E Test Organization**
```typescript
// cypress/e2e/ - User workflow tests
cypress/
├── e2e/
│   ├── combat-system.cy.ts       // Combat gameplay flows
│   ├── trigram-selection.cy.ts   // Stance selection UI
│   ├── vital-points.cy.ts        // Vital point targeting
│   ├── intro-screen.cy.ts        // Navigation flows
│   └── performance.cy.ts         // 60fps validation
```

✅ **Comprehensive E2E Test**
```typescript
describe('Combat System E2E', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid="start-button"]').click();
    cy.get('[data-testid="combat-screen"]').should('be.visible');
  });
  
  describe('Trigram Stance Selection', () => {
    it('should allow selecting all 8 trigram stances', () => {
      const stances = ['GEON', 'TAE', 'LI', 'JIN', 'SON', 'GAM', 'GAN', 'GON'];
      
      stances.forEach(stance => {
        cy.get(`[data-testid="stance-${stance}"]`).click();
        cy.get('[data-testid="current-stance"]')
          .should('contain', stance);
      });
    });
    
    it('should display bilingual Korean | English text', () => {
      cy.get('[data-testid="stance-GEON"]')
        .should('contain', '건')
        .and('contain', 'Heaven');
    });
    
    it('should show trigram symbol (☰)', () => {
      cy.get('[data-testid="stance-GEON"]')
        .should('contain', '☰');
    });
  });
  
  describe('Vital Point Targeting', () => {
    it('should highlight all 70 vital points', () => {
      cy.get('[data-testid="vital-point-overlay"]').click();
      cy.get('[data-testid^="vital-point-"]')
        .should('have.length', 70);
    });
    
    it('should show Korean and TCM names on hover', () => {
      cy.get('[data-testid="vital-point-BAIHUI"]').trigger('mouseover');
      cy.get('[data-testid="vital-point-tooltip"]')
        .should('contain', '백회')
        .and('contain', 'Baihui (GV20)');
    });
    
    it('should calculate critical damage on precise hit', () => {
      cy.get('[data-testid="vital-point-BAIHUI"]').click();
      cy.get('[data-testid="damage-indicator"]')
        .should('contain', 'CRITICAL')
        .and('have.css', 'color', 'rgb(255, 68, 68)'); // KOREAN_COLORS.CRITICAL_HIT
    });
  });
  
  describe('Combat Performance', () => {
    it('should maintain 60fps during combat', () => {
      cy.window().then(win => {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
          const currentTime = performance.now();
          const deltaTime = currentTime - lastTime;
          
          if (deltaTime >= 1000) {
            const fps = frameCount / (deltaTime / 1000);
            expect(fps).to.be.greaterThan(55); // Allow 5fps tolerance
            frameCount = 0;
            lastTime = currentTime;
          }
          
          frameCount++;
          
          if (frameCount < 300) { // Test for 5 seconds
            requestAnimationFrame(measureFPS);
          }
        };
        
        requestAnimationFrame(measureFPS);
      });
    });
  });
  
  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      cy.get('body').type('{tab}');
      cy.focused().should('have.attr', 'data-testid');
      
      // Test stance selection with number keys (1-8)
      cy.get('body').type('1');
      cy.get('[data-testid="current-stance"]').should('contain', 'GEON');
      
      cy.get('body').type('2');
      cy.get('[data-testid="current-stance"]').should('contain', 'TAE');
    });
    
    it('should have proper ARIA labels', () => {
      cy.get('[data-testid="stance-GEON"]')
        .should('have.attr', 'aria-label')
        .and('contain', '건')
        .and('contain', 'Heaven');
    });
    
    it('should meet WCAG 2.1 AA contrast standards', () => {
      cy.get('[data-testid="combat-screen"]').then($el => {
        const bgColor = $el.css('background-color');
        const textColor = $el.css('color');
        
        // Verify high contrast (manual check in CI)
        expect(bgColor).to.exist;
        expect(textColor).to.exist;
      });
    });
  });
});
```

### 4. Performance Testing Requirements

**ALWAYS validate 60fps performance:**

✅ **Performance Test Pattern**
```typescript
describe('Performance - Combat System', () => {
  it('should complete combat calculation in <5ms', () => {
    const combatSystem = new CombatSystem();
    const iterations = 1000;
    
    const start = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      combatSystem.calculateDamage(100, 0.85, 'BAIHUI');
    }
    
    const duration = performance.now() - start;
    const avgTime = duration / iterations;
    
    expect(avgTime).toBeLessThan(5); // <5ms per calculation
  });
  
  it('should handle 1000 vital point checks per frame', () => {
    const vitalPointSystem = new VitalPointSystem();
    
    const start = performance.now();
    
    for (let i = 0; i < 1000; i++) {
      vitalPointSystem.checkHit([
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      ]);
    }
    
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(16.67); // 60fps = 16.67ms frame budget
  });
  
  it('should maintain 60fps during 28-bone animation', () => {
    const animationSystem = new SkeletalAnimationSystem();
    const frameCount = 300; // 5 seconds at 60fps
    
    const start = performance.now();
    
    for (let i = 0; i < frameCount; i++) {
      animationSystem.updateBones(0.0166); // 60fps delta
    }
    
    const duration = performance.now() - start;
    const avgFrameTime = duration / frameCount;
    
    expect(avgFrameTime).toBeLessThan(16.67); // Maintain 60fps
  });
});
```

### 5. Accessibility Testing Standards

**ALWAYS ensure WCAG 2.1 Level AA compliance:**

✅ **Accessibility Test Pattern**
```typescript
describe('Accessibility - Combat UI', () => {
  it('should have proper semantic HTML structure', () => {
    const { container } = render(<CombatScreen width={1200} height={800} />);
    
    // Check for semantic elements
    expect(container.querySelector('main')).toBeInTheDocument();
    expect(container.querySelector('nav')).toBeInTheDocument();
  });
  
  it('should have ARIA labels on interactive elements', () => {
    const { getByRole } = render(<CombatScreen width={1200} height={800} />);
    
    const stanceButton = getByRole('button', { name: /건.*Heaven/i });
    expect(stanceButton).toHaveAttribute('aria-label');
  });
  
  it('should support keyboard navigation', () => {
    const { getByTestId } = render(<CombatScreen width={1200} height={800} />);
    const firstButton = getByTestId('stance-GEON');
    
    firstButton.focus();
    expect(document.activeElement).toBe(firstButton);
  });
  
  it('should meet WCAG 2.1 AA contrast ratio (4.5:1)', () => {
    // Use color contrast testing library or manual verification
    const textColor = KOREAN_COLORS.TEXT_PRIMARY; // 0xffffff
    const bgColor = KOREAN_COLORS.UI_BACKGROUND_DARK; // 0x0a0a0a
    
    // White on very dark = 20.3:1 contrast (exceeds WCAG AA 4.5:1)
    expect(textColor).toBe(0xffffff);
    expect(bgColor).toBe(0x0a0a0a);
  });
  
  it('should have focus indicators', () => {
    const { getByTestId } = render(<CombatScreen width={1200} height={800} />);
    const button = getByTestId('stance-GEON');
    
    button.focus();
    
    // Check for visible focus indicator (CSS outline or border)
    const styles = window.getComputedStyle(button);
    expect(
      styles.outline !== 'none' || 
      styles.border !== 'none'
    ).toBe(true);
  });
});
```

### 6. Common Testing Anti-Patterns to REJECT

**Immediately flag and reject these patterns:**

❌ **Missing Test Files**
```typescript
// BAD: New component without tests
src/systems/grappling/GrapplingSystem.ts
// Missing: src/systems/grappling/__tests__/GrapplingSystem.test.ts
```

❌ **Insufficient Test Coverage**
```typescript
// BAD: Only testing happy path
describe('CombatSystem', () => {
  it('should work', () => {
    const combat = new CombatSystem();
    expect(combat).toBeTruthy(); // Not enough!
  });
});

// GOOD: Comprehensive coverage
describe('CombatSystem', () => {
  it('should initialize with default values', () => { /* ... */ });
  it('should handle valid input', () => { /* ... */ });
  it('should reject invalid input', () => { /* ... */ });
  it('should handle edge cases', () => { /* ... */ });
  it('should meet performance targets', () => { /* ... */ });
});
```

❌ **Missing data-testid Attributes**
```typescript
// BAD: Interactive element without test ID
<button onClick={handleClick}>
  공격 | Attack
</button>

// GOOD: Proper test ID for E2E testing
<button 
  data-testid="attack-button"
  aria-label="공격 | Attack"
  onClick={handleClick}
>
  공격 | Attack
</button>
```

❌ **No Performance Tests**
```typescript
// BAD: Performance-critical code without performance tests
export function calculateDamage(force: number, accuracy: number): number {
  // Complex calculation
  return result;
}

// GOOD: Include performance validation
describe('calculateDamage Performance', () => {
  it('should complete in <5ms', () => {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      calculateDamage(100, 0.85);
    }
    const duration = performance.now() - start;
    expect(duration / 1000).toBeLessThan(5);
  });
});
```

❌ **No Accessibility Tests**
```typescript
// BAD: UI component without accessibility validation
export const StanceSelector: React.FC = () => {
  return <div>Stance selection</div>;
};

// GOOD: Include accessibility tests
describe('StanceSelector Accessibility', () => {
  it('should have ARIA labels', () => { /* ... */ });
  it('should be keyboard navigable', () => { /* ... */ });
  it('should meet WCAG contrast standards', () => { /* ... */ });
});
```

### 7. Required Testing Patterns

**Enforce these testing patterns:**

✅ **Complete Test Suite Structure**
```typescript
describe('ComponentName', () => {
  // Setup and teardown
  beforeEach(() => { /* Initialize */ });
  afterEach(() => { /* Cleanup */ });
  
  // Initialization tests
  describe('Initialization', () => {
    it('should initialize with default values', () => { /* ... */ });
    it('should accept custom configuration', () => { /* ... */ });
  });
  
  // Functionality tests
  describe('Core Functionality', () => {
    it('should handle valid input correctly', () => { /* ... */ });
    it('should reject invalid input', () => { /* ... */ });
    it('should maintain state correctly', () => { /* ... */ });
  });
  
  // Edge cases
  describe('Edge Cases', () => {
    it('should handle empty input', () => { /* ... */ });
    it('should handle boundary values', () => { /* ... */ });
    it('should handle concurrent operations', () => { /* ... */ });
  });
  
  // Performance tests
  describe('Performance', () => {
    it('should complete within performance budget', () => { /* ... */ });
    it('should scale with input size', () => { /* ... */ });
  });
  
  // Integration tests
  describe('Integration', () => {
    it('should integrate with dependent systems', () => { /* ... */ });
  });
});
```

✅ **Mock Audio System for Testing**
```typescript
// src/test/setup.ts - Global test setup
import { vi } from 'vitest';

// Mock Web Audio API
global.AudioContext = vi.fn().mockImplementation(() => ({
  createGain: vi.fn().mockReturnValue({
    connect: vi.fn(),
    gain: { value: 1 },
  }),
  createOscillator: vi.fn().mockReturnValue({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }),
}));

// Mock Howler.js
vi.mock('howler', () => ({
  Howl: vi.fn().mockImplementation(() => ({
    play: vi.fn(),
    stop: vi.fn(),
    volume: vi.fn(),
  })),
}));
```

## Enforcement Rules

### Rule 1: No New Code Without Tests

```
IF (new feature or component added)
THEN (unit tests AND E2E tests MUST be included)
ELSE (reject the change)
```

### Rule 2: Maintain Minimum 90% Coverage

```
IF (pull request submitted)
THEN (verify coverage meets 90% threshold)
ELSE (add tests to meet coverage requirement)
```

### Rule 3: All Interactive Elements Need data-testid

```
IF (button, input, or interactive element added)
THEN (add data-testid attribute)
ELSE (add test ID before approval)
```

### Rule 4: Performance Tests for Critical Code

```
IF (code affects combat, animation, or rendering)
THEN (include performance tests with <5ms budget)
ELSE (add performance validation)
```

### Rule 5: Accessibility Tests for UI Components

```
IF (UI component added or modified)
THEN (include ARIA labels, keyboard nav, WCAG contrast tests)
ELSE (add accessibility tests)
```

## Test Quality Checklist

**Before approving any code change:**

- [ ] **Unit Tests**: >90% coverage for new/modified code
- [ ] **E2E Tests**: User workflows covered with Cypress
- [ ] **data-testid**: All interactive elements have test IDs
- [ ] **Performance**: Critical code has <5ms performance tests
- [ ] **Accessibility**: WCAG 2.1 AA compliance validated
- [ ] **Edge Cases**: Boundary conditions and error cases tested
- [ ] **Mocking**: External dependencies properly mocked
- [ ] **Korean Context**: Bilingual text tested (Korean | English)
- [ ] **Three.js**: 3D components have Canvas-wrapped tests
- [ ] **Documentation**: Test purpose and scenarios documented

## ISO 27001 Alignment

This skill enforces controls from:

- **A.12.1** - Operational Procedures (Testing standards documented)
- **A.14.2** - Security in Development Processes (Testing in SDLC)
- **A.14.3** - Test Data (Test data management practices)
- **A.18.2** - Compliance with Security Policies (Testing compliance)

## NIST CSF 2.0 Alignment

- **GV.PO-01**: Testing policy established and communicated
- **ID.RA-01**: Asset vulnerabilities identified (via testing)
- **PR.DS-06**: Integrity checking through automated tests
- **DE.AE-02**: Event analysis capabilities (test failures)
- **RS.AN-03**: Analysis performed to understand root cause (test debugging)

## CIS Controls v8.1 Alignment

- **Control 4**: Secure Configuration (validated through tests)
- **Control 16**: Application Software Security (comprehensive testing)
- **Control 17**: Incident Response Management (test failure handling)

## Remember

**Testing is not a checkbox—it is the foundation of quality. Every feature, every component, every line of code must be validated through comprehensive, meaningful tests.**

When writing tests:
1. **COVER** - Achieve >90% coverage with meaningful tests
2. **VALIDATE** - Test happy paths, edge cases, and error conditions
3. **PERFORM** - Ensure code meets 60fps performance targets
4. **ACCESS** - Validate WCAG 2.1 Level AA accessibility
5. **INTEGRATE** - Test E2E user workflows with Cypress
6. **AUTOMATE** - Run tests in CI/CD pipeline

**흑괘의 품질을 검증하라** - _Validate the Quality of the Black Trigram_
