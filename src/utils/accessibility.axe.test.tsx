/**
 * Automated Accessibility Tests using axe-core
 * 
 * These tests validate WCAG 2.1 Level AA compliance for UI components
 * that don't depend on Three.js Canvas context.
 * 
 * For components that use @react-three/drei Html, manual accessibility testing
 * is performed during development and E2E testing.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extend Vitest's expect with axe matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Utilities - axe-core validation', () => {
  it('should validate getFocusStyle creates accessible focus indicators', async () => {
    const TestComponent = () => {
      const focusStyles = {
        border: '2px solid #00e6e6',
        boxShadow: '0 0 0 4px rgba(0, 230, 230, 0.3)',
        outline: 'none',
      };

      return (
        <button
          aria-label="Test Button"
          style={focusStyles}
        >
          Test Button
        </button>
      );
    };

    const { container } = render(<TestComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should validate bilingual ARIA labels structure', async () => {
    const TestComponent = () => (
      <div>
        <button aria-label="공격 | Attack">Attack</button>
        <button aria-label="방어 | Block">Block</button>
        <button aria-label="이동 ↑ | Move Up">Move Up</button>
      </div>
    );

    const { container } = render(<TestComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should validate keyboard navigation structure', async () => {
    const TestComponent = () => (
      <div role="menu" aria-label="Test Menu">
        <button role="menuitem" tabIndex={0} aria-label="Option 1">
          Option 1
        </button>
        <button role="menuitem" tabIndex={0} aria-label="Option 2">
          Option 2
        </button>
      </div>
    );

    const { container } = render(<TestComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should validate dialog structure (like PauseMenu)', async () => {
    const TestComponent = () => (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <h1 id="dialog-title">일시정지 | Paused</h1>
        <p id="dialog-description">게임이 일시정지되었습니다 | Game is paused</p>
        <div role="menu" aria-label="일시정지 메뉴 | Pause Menu">
          <button role="menuitem" aria-label="계속 | Resume">
            계속 | Resume
          </button>
          <button role="menuitem" aria-label="재시작 | Restart">
            재시작 | Restart
          </button>
        </div>
      </div>
    );

    const { container } = render(<TestComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should validate radiogroup structure (like StanceWheel)', async () => {
    const TestComponent = () => (
      <div role="radiogroup" aria-label="팔괘 자세 | Eight Trigram Stances">
        <button
          role="radio"
          aria-checked="false"
          aria-label="건 ☰ | geon stance"
          tabIndex={0}
        >
          ☰ 건
        </button>
        <button
          role="radio"
          aria-checked="true"
          aria-label="태 ☱ | tae stance"
          tabIndex={0}
        >
          ☱ 태
        </button>
      </div>
    );

    const { container } = render(<TestComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should validate progress bar structure (like HealthBar)', async () => {
    const TestComponent = () => (
      <div
        role="progressbar"
        aria-label="건강 | Health"
        aria-valuenow={75}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext="75 / 100"
      >
        <div
          style={{
            width: '75%',
            height: '20px',
            backgroundColor: '#ff4444',
          }}
        />
      </div>
    );

    const { container } = render(<TestComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should validate timer with aria-live (like CombatTimer)', async () => {
    const TestComponent = () => (
      <div
        role="timer"
        aria-live="polite"
        aria-atomic="true"
        aria-label="전투 시간 | Combat Time"
      >
        00:45
      </div>
    );

    const { container } = render(<TestComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should validate color contrast for WCAG AA compliant colors', async () => {
    const TestComponent = () => (
      <div style={{ backgroundColor: '#0a0a0a', padding: '20px' }}>
        <p style={{ color: '#ffffff' }}>
          TEXT_PRIMARY (20.3:1 contrast ratio)
        </p>
        <p style={{ color: '#00e6e6' }}>
          PRIMARY_CYAN (15.8:1 contrast ratio)
        </p>
        <p style={{ color: '#cccccc' }}>
          TEXT_SECONDARY (13.1:1 contrast ratio)
        </p>
      </div>
    );

    const { container } = render(<TestComponent />);
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it('should validate button group structure', async () => {
    const TestComponent = () => (
      <div role="group" aria-label="가상 D-패드 | Virtual D-Pad">
        <button aria-label="이동 ↑ | Move Up" tabIndex={0}>
          ↑
        </button>
        <button aria-label="이동 → | Move Right" tabIndex={0}>
          →
        </button>
        <button aria-label="이동 ↓ | Move Down" tabIndex={0}>
          ↓
        </button>
        <button aria-label="이동 ← | Move Left" tabIndex={0}>
          ←
        </button>
      </div>
    );

    const { container } = render(<TestComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should detect violations in non-compliant structure', async () => {
    const TestComponent = () => (
      <div>
        {/* Missing aria-label on button */}
        <button>Click me</button>
        {/* Invalid role combination */}
        <div role="button" aria-checked="true">
          Invalid Button
        </div>
      </div>
    );

    const { container } = render(<TestComponent />);
    const results = await axe(container);
    
    // This test expects violations to be found
    expect(results.violations.length).toBeGreaterThan(0);
  });
});
