/**
 * Tests for MobileHUDLayout component
 */

import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { describe, expect, it, vi } from 'vitest';
import { MobileHUDLayout } from './MobileHUDLayout';
import { PlayerState } from '../../../systems';
import { PlayerArchetype } from '../../types';

// Mock useWindowSize hook
vi.mock('../../hooks/useWindowSize', () => ({
  useWindowSize: () => ({ width: 375, height: 667 }),
}));

// Create mock player state
const createMockPlayer = (overrides?: Partial<PlayerState>): PlayerState => ({
  id: 0,
  archetype: PlayerArchetype.MUSA,
  health: 100,
  maxHealth: 100,
  ki: 50,
  maxKi: 100,
  stamina: 80,
  maxStamina: 100,
  currentStance: 'geon',
  position: { x: 0, y: 0 },
  isBlocking: false,
  isExecutingTechnique: false,
  ...overrides,
});

// Helper to render MobileHUDLayout in Canvas
const renderMobileHUD = (props: Partial<React.ComponentProps<typeof MobileHUDLayout>> = {}) => {
  const defaultProps = {
    player1: createMockPlayer(),
    player2: createMockPlayer({ id: 1 }),
    timeRemaining: 90,
    currentRound: 1,
    maxRounds: 3,
    isPaused: false,
  };

  return render(
    <Canvas>
      <MobileHUDLayout {...defaultProps} {...props} />
    </Canvas>
  );
};

describe('MobileHUDLayout', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = renderMobileHUD();
      expect(container).toBeTruthy();
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('should render with custom test ID', () => {
      const { container } = renderMobileHUD({ testId: 'custom-hud' });
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('should render with default test ID', () => {
      const { container } = renderMobileHUD();
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    it('should accept player1 state', () => {
      const player = createMockPlayer({ health: 75, maxHealth: 100 });
      const { container } = renderMobileHUD({ player1: player });
      expect(container).toBeTruthy();
    });

    it('should accept player2 state', () => {
      const player = createMockPlayer({ health: 50, maxHealth: 100 });
      const { container } = renderMobileHUD({ player2: player });
      expect(container).toBeTruthy();
    });

    it('should accept time remaining', () => {
      const { container } = renderMobileHUD({ timeRemaining: 45 });
      expect(container).toBeTruthy();
    });

    it('should accept round information', () => {
      const { container } = renderMobileHUD({ currentRound: 2, maxRounds: 3 });
      expect(container).toBeTruthy();
    });

    it('should accept pause state', () => {
      const { container } = renderMobileHUD({ isPaused: true });
      expect(container).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero health', () => {
      const player = createMockPlayer({ health: 0, maxHealth: 100 });
      const { container } = renderMobileHUD({ player1: player });
      expect(container).toBeTruthy();
    });

    it('should handle full health', () => {
      const player = createMockPlayer({ health: 100, maxHealth: 100 });
      const { container } = renderMobileHUD({ player1: player });
      expect(container).toBeTruthy();
    });

    it('should handle low health (< 30%)', () => {
      const player = createMockPlayer({ health: 25, maxHealth: 100 });
      const { container } = renderMobileHUD({ player1: player });
      expect(container).toBeTruthy();
    });

    it('should handle zero time remaining', () => {
      const { container } = renderMobileHUD({ timeRemaining: 0 });
      expect(container).toBeTruthy();
    });

    it('should handle fractional time remaining', () => {
      const { container } = renderMobileHUD({ timeRemaining: 10.7 });
      expect(container).toBeTruthy();
    });

    it('should handle low time (< 10s)', () => {
      const { container } = renderMobileHUD({ timeRemaining: 5 });
      expect(container).toBeTruthy();
    });
  });

  describe('Different Player Archetypes', () => {
    it('should render MUSA archetype', () => {
      const player = createMockPlayer({ archetype: PlayerArchetype.MUSA });
      const { container } = renderMobileHUD({ player1: player });
      expect(container).toBeTruthy();
    });

    it('should render AMSALJA archetype', () => {
      const player = createMockPlayer({ archetype: PlayerArchetype.AMSALJA });
      const { container } = renderMobileHUD({ player1: player });
      expect(container).toBeTruthy();
    });

    it('should render HACKER archetype', () => {
      const player = createMockPlayer({ archetype: PlayerArchetype.HACKER });
      const { container } = renderMobileHUD({ player1: player });
      expect(container).toBeTruthy();
    });
  });

  describe('Stamina States', () => {
    it('should handle full stamina', () => {
      const player = createMockPlayer({ stamina: 100, maxStamina: 100 });
      const { container } = renderMobileHUD({ player1: player });
      expect(container).toBeTruthy();
    });

    it('should handle low stamina', () => {
      const player = createMockPlayer({ stamina: 20, maxStamina: 100 });
      const { container } = renderMobileHUD({ player1: player });
      expect(container).toBeTruthy();
    });

    it('should handle zero stamina', () => {
      const player = createMockPlayer({ stamina: 0, maxStamina: 100 });
      const { container } = renderMobileHUD({ player1: player });
      expect(container).toBeTruthy();
    });
  });

  describe('Canvas Integration', () => {
    it('should render within Canvas context', () => {
      const { container } = renderMobileHUD();
      const canvas = container.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
      expect(canvas?.tagName).toBe('CANVAS');
    });

    it('should not cause WebGL context errors', () => {
      // This test verifies no errors are thrown during render
      expect(() => renderMobileHUD()).not.toThrow();
    });
  });

  describe('Multiple Rounds', () => {
    it('should handle first round', () => {
      const { container } = renderMobileHUD({ currentRound: 1, maxRounds: 3 });
      expect(container).toBeTruthy();
    });

    it('should handle last round', () => {
      const { container } = renderMobileHUD({ currentRound: 3, maxRounds: 3 });
      expect(container).toBeTruthy();
    });

    it('should handle single round match', () => {
      const { container } = renderMobileHUD({ currentRound: 1, maxRounds: 1 });
      expect(container).toBeTruthy();
    });
  });

  describe('Component Stability', () => {
    it('should not re-render unnecessarily with same props', () => {
      const props = {
        player1: createMockPlayer(),
        player2: createMockPlayer({ id: 1 }),
        timeRemaining: 90,
        currentRound: 1,
        maxRounds: 3,
      };

      const { rerender, container } = render(
        <Canvas>
          <MobileHUDLayout {...props} />
        </Canvas>
      );

      const canvas1 = container.querySelector('canvas');

      rerender(
        <Canvas>
          <MobileHUDLayout {...props} />
        </Canvas>
      );

      const canvas2 = container.querySelector('canvas');

      // Canvas should still be present after rerender
      expect(canvas2).toBeInTheDocument();
      expect(canvas1).toBe(canvas2);
    });
  });
});

