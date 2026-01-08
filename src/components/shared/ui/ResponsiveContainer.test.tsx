/**
 * Tests for ResponsiveContainer component
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ResponsiveContainer } from './ResponsiveContainer';

// Mock useWindowSize hook
vi.mock('../../hooks/useWindowSize', () => ({
  useWindowSize: () => ({ width: 375, height: 667 }),
}));

describe('ResponsiveContainer', () => {
  it('should render children', () => {
    render(
      <ResponsiveContainer>
        <div data-testid="child-element">Test Content</div>
      </ResponsiveContainer>
    );

    expect(screen.getByTestId('child-element')).toBeInTheDocument();
  });

  it('should apply default test ID', () => {
    render(
      <ResponsiveContainer>
        <div>Test</div>
      </ResponsiveContainer>
    );

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('should apply custom test ID', () => {
    render(
      <ResponsiveContainer testId="custom-container">
        <div>Test</div>
      </ResponsiveContainer>
    );

    expect(screen.getByTestId('custom-container')).toBeInTheDocument();
  });

  it('should apply safe area insets by default', () => {
    render(
      <ResponsiveContainer>
        <div>Test</div>
      </ResponsiveContainer>
    );

    const container = screen.getByTestId('responsive-container');

    // Safe area should be applied (44px top, 34px bottom for mobile)
    expect(container.style.paddingTop).toBeTruthy();
    expect(container.style.paddingBottom).toBeTruthy();
  });

  it('should not apply safe area when disabled', () => {
    render(
      <ResponsiveContainer applySafeArea={false}>
        <div>Test</div>
      </ResponsiveContainer>
    );

    const container = screen.getByTestId('responsive-container');

    // Safe area should not be in padding (will use normal padding instead)
    expect(container.style.paddingTop).not.toContain('44');
  });

  it('should apply custom className', () => {
    render(
      <ResponsiveContainer className="custom-class">
        <div>Test</div>
      </ResponsiveContainer>
    );

    const container = screen.getByTestId('responsive-container');
    expect(container.className).toContain('custom-class');
  });

  it('should apply custom style', () => {
    const customStyle = {
      backgroundColor: 'red',
      color: 'white',
    };

    render(
      <ResponsiveContainer style={customStyle}>
        <div>Test</div>
      </ResponsiveContainer>
    );

    const container = screen.getByTestId('responsive-container');
    expect(container.style.backgroundColor).toBe('red');
    expect(container.style.color).toBe('white');
  });

  it('should apply different padding densities', () => {
    const { rerender } = render(
      <ResponsiveContainer padding="compact">
        <div>Test</div>
      </ResponsiveContainer>
    );

    let container = screen.getByTestId('responsive-container');
    const compactPadding = container.style.paddingTop;

    rerender(
      <ResponsiveContainer padding="spacious">
        <div>Test</div>
      </ResponsiveContainer>
    );

    container = screen.getByTestId('responsive-container');
    const spaciousPadding = container.style.paddingTop;

    // Spacious should have more padding than compact
    expect(parseInt(spaciousPadding)).toBeGreaterThan(parseInt(compactPadding));
  });

  it('should apply no padding when padding is none', () => {
    render(
      <ResponsiveContainer padding="none" applySafeArea={false}>
        <div>Test</div>
      </ResponsiveContainer>
    );

    const container = screen.getByTestId('responsive-container');

    // With no padding and no safe area, should have minimal padding
    expect(container.style.padding === '0px' || !container.style.padding).toBeTruthy();
  });

  it('should set data attributes for mobile and landscape', () => {
    render(
      <ResponsiveContainer>
        <div>Test</div>
      </ResponsiveContainer>
    );

    const container = screen.getByTestId('responsive-container');

    // Should have mobile and landscape data attributes
    expect(container.dataset.mobile).toBeDefined();
    expect(container.dataset.landscape).toBeDefined();
  });
});
