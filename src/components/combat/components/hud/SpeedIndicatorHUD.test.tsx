/**
 * Unit tests for SpeedIndicatorHUD component
 * 
 * **Korean**: 속도 표시기 테스트
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SpeedIndicatorHUD } from './SpeedIndicatorHUD';

describe('SpeedIndicatorHUD', () => {
  describe('Rendering', () => {
    it('should render with base props', () => {
      const { getByTestId } = render(
        <SpeedIndicatorHUD
          finalSpeed={2.0}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      const indicator = getByTestId('speed-indicator-left');
      expect(indicator).toBeInTheDocument();
    });

    it('should render on right side', () => {
      const { getByTestId } = render(
        <SpeedIndicatorHUD
          finalSpeed={2.0}
          baseSpeed={2.0}
          position="right"
          isMobile={false}
        />
      );

      const indicator = getByTestId('speed-indicator-right');
      expect(indicator).toBeInTheDocument();
    });

    it('should hide when visible is false', () => {
      const { getByTestId } = render(
        <SpeedIndicatorHUD
          finalSpeed={2.0}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
          visible={false}
        />
      );

      const indicator = getByTestId('speed-indicator-left');
      expect(indicator).toHaveStyle({ display: 'none' });
    });

    it('should show when visible is true', () => {
      const { getByTestId } = render(
        <SpeedIndicatorHUD
          finalSpeed={2.0}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
          visible={true}
        />
      );

      const indicator = getByTestId('speed-indicator-left');
      expect(indicator).toHaveStyle({ display: 'flex' });
    });
  });

  describe('Speed Percentage Calculation', () => {
    it('should display 100% when finalSpeed equals baseSpeed', () => {
      const { getByText } = render(
        <SpeedIndicatorHUD
          finalSpeed={2.0}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      expect(getByText('100%')).toBeInTheDocument();
    });

    it('should display 50% when finalSpeed is half of baseSpeed', () => {
      const { getByText } = render(
        <SpeedIndicatorHUD
          finalSpeed={1.0}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      expect(getByText('50%')).toBeInTheDocument();
    });

    it('should display 120% when finalSpeed exceeds baseSpeed', () => {
      const { getByText } = render(
        <SpeedIndicatorHUD
          finalSpeed={2.4}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      expect(getByText('120%')).toBeInTheDocument();
    });

    it('should display 25% when heavily reduced', () => {
      const { getByText } = render(
        <SpeedIndicatorHUD
          finalSpeed={0.5}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      expect(getByText('25%')).toBeInTheDocument();
    });

    it('should display 0% when stopped', () => {
      const { getByText } = render(
        <SpeedIndicatorHUD
          finalSpeed={0.0}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      expect(getByText('0%')).toBeInTheDocument();
    });

    it('should handle zero baseSpeed gracefully', () => {
      const { getByText } = render(
        <SpeedIndicatorHUD
          finalSpeed={0.0}
          baseSpeed={0.0}
          position="left"
          isMobile={false}
        />
      );

      // Should default to 100% when baseSpeed is 0
      expect(getByText('100%')).toBeInTheDocument();
    });
  });

  describe('Speed Labels', () => {
    it('should display BOOSTED label at 100%+ speed', () => {
      const { getByText } = render(
        <SpeedIndicatorHUD
          finalSpeed={2.5}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      expect(getByText('가속')).toBeInTheDocument(); // Korean
      expect(getByText('BOOSTED')).toBeInTheDocument(); // English
    });

    it('should display GOOD label at 80-99% speed', () => {
      const { getByText } = render(
        <SpeedIndicatorHUD
          finalSpeed={1.8}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      expect(getByText('양호')).toBeInTheDocument(); // Korean
      expect(getByText('GOOD')).toBeInTheDocument(); // English
    });

    it('should display REDUCED label at 50-79% speed', () => {
      const { getByText } = render(
        <SpeedIndicatorHUD
          finalSpeed={1.4}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      expect(getByText('감소')).toBeInTheDocument(); // Korean
      expect(getByText('REDUCED')).toBeInTheDocument(); // English
    });

    it('should display SLOWED label at 25-49% speed', () => {
      const { getByText } = render(
        <SpeedIndicatorHUD
          finalSpeed={0.8}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      expect(getByText('저하')).toBeInTheDocument(); // Korean
      expect(getByText('SLOWED')).toBeInTheDocument(); // English
    });

    it('should display CRITICAL label at <25% speed', () => {
      const { getByText } = render(
        <SpeedIndicatorHUD
          finalSpeed={0.4}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      expect(getByText('위급')).toBeInTheDocument(); // Korean
      expect(getByText('CRITICAL')).toBeInTheDocument(); // English
    });
  });

  describe('Bilingual Support', () => {
    it('should display Korean and English labels', () => {
      const { getByText } = render(
        <SpeedIndicatorHUD
          finalSpeed={2.0}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      expect(getByText('속도변경 | Speed')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const { getByTestId } = render(
        <SpeedIndicatorHUD
          finalSpeed={1.6}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      const indicator = getByTestId('speed-indicator-left');
      expect(indicator).toHaveAttribute('role', 'status');
      expect(indicator).toHaveAttribute('aria-live', 'polite');
      expect(indicator).toHaveAttribute('aria-label');
    });

    it('should update aria-label based on speed', () => {
      const { getByTestId } = render(
        <SpeedIndicatorHUD
          finalSpeed={1.8}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      const indicator = getByTestId('speed-indicator-left');
      const ariaLabel = indicator.getAttribute('aria-label');
      expect(ariaLabel).toContain('90%');
      expect(ariaLabel).toContain('양호');
      expect(ariaLabel).toContain('GOOD');
    });
  });

  describe('Mobile Layout', () => {
    it('should render in mobile mode', () => {
      const { getByTestId } = render(
        <SpeedIndicatorHUD
          finalSpeed={2.0}
          baseSpeed={2.0}
          position="left"
          isMobile={true}
        />
      );

      const indicator = getByTestId('speed-indicator-left');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('Positioning', () => {
    it('should position on left side', () => {
      const { getByTestId } = render(
        <SpeedIndicatorHUD
          finalSpeed={2.0}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      const indicator = getByTestId('speed-indicator-left');
      // Left positioning should have left property set
      expect(indicator.style.left).toBeTruthy();
      expect(indicator.style.right).toBe('auto');
    });

    it('should position on right side', () => {
      const { getByTestId } = render(
        <SpeedIndicatorHUD
          finalSpeed={2.0}
          baseSpeed={2.0}
          position="right"
          isMobile={false}
        />
      );

      const indicator = getByTestId('speed-indicator-right');
      // Right positioning should have right property set
      expect(indicator.style.right).toBeTruthy();
      expect(indicator.style.left).toBe('auto');
    });
  });

  describe('Integration Scenarios', () => {
    it('should display reduced speed from injury (moderate damage)', () => {
      // Simulating 50% leg damage -> 50% health -> LIMPING (0.8 multiplier) -> 0.2 penalty
      // Final speed: 2.0 * 0.8 = 1.6 m/s (80%)
      const { getByText } = render(
        <SpeedIndicatorHUD
          finalSpeed={1.6}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      expect(getByText('80%')).toBeInTheDocument();
      expect(getByText('양호')).toBeInTheDocument(); // GOOD
    });

    it('should display heavily reduced speed from multiple factors', () => {
      // Simulating: Mountain stance (0.8x) + moderate injury (0.8x) + attacking (0.7x)
      // Final: 2.0 * 0.8 * 0.8 * 0.7 ≈ 0.896 m/s (~45%)
      const { getByText } = render(
        <SpeedIndicatorHUD
          finalSpeed={0.9}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      expect(getByText('45%')).toBeInTheDocument();
      expect(getByText('저하')).toBeInTheDocument(); // SLOWED
    });

    it('should display boosted speed from Wind stance', () => {
      // Simulating: Wind stance (1.25x) with no penalties
      // Final: 2.0 * 1.25 = 2.5 m/s (125%)
      const { getByText } = render(
        <SpeedIndicatorHUD
          finalSpeed={2.5}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      expect(getByText('125%')).toBeInTheDocument();
      expect(getByText('가속')).toBeInTheDocument(); // BOOSTED
    });

    it('should display critical speed when stunned', () => {
      // Simulating: STUNNED state (100% penalty) = 0 m/s
      const { getByText } = render(
        <SpeedIndicatorHUD
          finalSpeed={0.0}
          baseSpeed={2.0}
          position="left"
          isMobile={false}
        />
      );

      expect(getByText('0%')).toBeInTheDocument();
      expect(getByText('위급')).toBeInTheDocument(); // CRITICAL
    });
  });
});
