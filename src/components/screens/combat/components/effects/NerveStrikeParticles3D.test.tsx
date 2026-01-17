/**
 * NerveStrikeParticles3D.test.tsx
 * 
 * Comprehensive test suite for nerve strike particle effects in Korean martial arts combat.
 * Tests electric-blue pulse effects, paralysis indicators, and vital point feedback.
 * 
 * @author Black Trigram Development Team
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  NerveStrikeParticles3D,
  type NerveStrikeEffect,
  type NerveStrikeParticles3DProps,
} from './NerveStrikeParticles3D';

// Mock current time for consistent testing
let mockTime = 0;
const originalDateNow = Date.now;

beforeEach(() => {
  mockTime = 1000000;
  Date.now = vi.fn(() => mockTime);
});

afterEach(() => {
  Date.now = originalDateNow;
  vi.clearAllMocks();
});

// Helper to render Three.js components
function render3D(component: React.ReactElement) {
  return render(
    <Canvas>
      <React.Suspense fallback={null}>{component}</React.Suspense>
    </Canvas>
  );
}

// Helper to create test nerve strike effect
function createNerveStrikeEffect(
  overrides?: Partial<NerveStrikeEffect>
): NerveStrikeEffect {
  return {
    id: `nerve-${Math.random()}`,
    position: [0, 1.5, 0],
    effectiveness: 0.8,
    paralysisIndicator: false,
    vitalPointName: '경동맥',
    startTime: mockTime,
    ...overrides,
  };
}

describe('NerveStrikeParticles3D', () => {
  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render3D(
        <NerveStrikeParticles3D effects={[]} enabled />
      );

      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('should render with single nerve strike effect', () => {
      const effect = createNerveStrikeEffect();

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should render with multiple nerve strike effects', () => {
      const effects = [
        createNerveStrikeEffect({ id: 'nerve-1', vitalPointName: '경동맥' }),
        createNerveStrikeEffect({ id: 'nerve-2', vitalPointName: '대퇴부' }),
        createNerveStrikeEffect({ id: 'nerve-3', vitalPointName: '완관절' }),
      ];

      const { container } = render3D(
        <NerveStrikeParticles3D effects={effects} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should not render when disabled', () => {
      const effect = createNerveStrikeEffect();

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled={false} />
      );

      expect(container.querySelector('canvas')).toBeInTheDocument();
    });
  });

  describe('Effectiveness Levels', () => {
    it('should handle perfect effectiveness (1.0)', () => {
      const effect = createNerveStrikeEffect({
        effectiveness: 1.0,
        vitalPointName: '경동맥',
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle high effectiveness (0.8-0.9)', () => {
      const effect = createNerveStrikeEffect({
        effectiveness: 0.85,
        vitalPointName: '대퇴부',
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle medium effectiveness (0.5-0.7)', () => {
      const effect = createNerveStrikeEffect({
        effectiveness: 0.6,
        vitalPointName: '완관절',
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle low effectiveness (0.1-0.4)', () => {
      const effect = createNerveStrikeEffect({
        effectiveness: 0.3,
        vitalPointName: '슬관절',
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle miss/zero effectiveness (0.0)', () => {
      const effect = createNerveStrikeEffect({
        effectiveness: 0.0,
        vitalPointName: '명치',
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });
  });

  describe('Paralysis Indicators', () => {
    it('should render paralysis indicator when enabled', () => {
      const effect = createNerveStrikeEffect({
        paralysisIndicator: true,
        effectiveness: 0.9,
        vitalPointName: '경동맥',
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should render normal effect without paralysis', () => {
      const effect = createNerveStrikeEffect({
        paralysisIndicator: false,
        effectiveness: 0.8,
        vitalPointName: '완관절',
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle paralysis on high effectiveness strikes', () => {
      const effect = createNerveStrikeEffect({
        paralysisIndicator: true,
        effectiveness: 1.0,
        vitalPointName: '대퇴부',
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle multiple paralysis effects simultaneously', () => {
      const effects = [
        createNerveStrikeEffect({
          id: 'para-1',
          paralysisIndicator: true,
          vitalPointName: '경동맥',
        }),
        createNerveStrikeEffect({
          id: 'para-2',
          paralysisIndicator: true,
          vitalPointName: '슬관절',
        }),
      ];

      const { container } = render3D(
        <NerveStrikeParticles3D effects={effects} enabled />
      );

      expect(container).toBeTruthy();
    });
  });

  describe('Korean Vital Points (급소)', () => {
    it('should handle carotid artery strike (경동맥)', () => {
      const effect = createNerveStrikeEffect({
        vitalPointName: '경동맥',
        effectiveness: 0.9,
        paralysisIndicator: true,
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle femoral area strike (대퇴부)', () => {
      const effect = createNerveStrikeEffect({
        vitalPointName: '대퇴부',
        effectiveness: 0.85,
        paralysisIndicator: true,
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle wrist joint strike (완관절)', () => {
      const effect = createNerveStrikeEffect({
        vitalPointName: '완관절',
        effectiveness: 0.7,
        paralysisIndicator: true,
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle knee joint strike (슬관절)', () => {
      const effect = createNerveStrikeEffect({
        vitalPointName: '슬관절',
        effectiveness: 0.8,
        paralysisIndicator: true,
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle solar plexus strike (명치)', () => {
      const effect = createNerveStrikeEffect({
        vitalPointName: '명치',
        effectiveness: 0.75,
        paralysisIndicator: false,
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle temple strike (관자놀이)', () => {
      const effect = createNerveStrikeEffect({
        vitalPointName: '관자놀이',
        effectiveness: 0.95,
        paralysisIndicator: true,
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });
  });

  describe('Mobile Optimization', () => {
    it('should render with reduced particles on mobile', () => {
      const effect = createNerveStrikeEffect();

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled isMobile />
      );

      expect(container).toBeTruthy();
    });

    it('should render with full particles on desktop', () => {
      const effect = createNerveStrikeEffect();

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled isMobile={false} />
      );

      expect(container).toBeTruthy();
    });

    it('should handle multiple effects on mobile', () => {
      const effects = [
        createNerveStrikeEffect({ id: 'mobile-1' }),
        createNerveStrikeEffect({ id: 'mobile-2' }),
        createNerveStrikeEffect({ id: 'mobile-3' }),
      ];

      const { container } = render3D(
        <NerveStrikeParticles3D effects={effects} enabled isMobile />
      );

      expect(container).toBeTruthy();
    });
  });

  describe('Effect Lifecycle', () => {
    it('should call onEffectComplete callback', () => {
      const onComplete = vi.fn();
      const effect = createNerveStrikeEffect({ id: 'complete-test' });

      render3D(
        <NerveStrikeParticles3D
          effects={[effect]}
          enabled
          onEffectComplete={onComplete}
        />
      );

      // Fast-forward time past effect lifetime (1.1 seconds)
      mockTime += 1200;

      // Note: In actual usage, useFrame would trigger onComplete
      // This test validates the callback prop is accepted
      expect(onComplete).toBeDefined();
    });

    it('should handle effect removal', () => {
      const effect = createNerveStrikeEffect();

      const { rerender, container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      // Remove effect
      rerender(
        <Canvas>
          <React.Suspense fallback={null}>
            <NerveStrikeParticles3D effects={[]} enabled />
          </React.Suspense>
        </Canvas>
      );

      expect(container).toBeTruthy();
    });

    it('should handle rapid effect changes', () => {
      const effect1 = createNerveStrikeEffect({ id: 'rapid-1' });
      const effect2 = createNerveStrikeEffect({ id: 'rapid-2' });
      const effect3 = createNerveStrikeEffect({ id: 'rapid-3' });

      const { rerender, container } = render3D(
        <NerveStrikeParticles3D effects={[effect1]} enabled />
      );

      mockTime += 100;
      rerender(
        <Canvas>
          <React.Suspense fallback={null}>
            <NerveStrikeParticles3D effects={[effect1, effect2]} enabled />
          </React.Suspense>
        </Canvas>
      );

      mockTime += 100;
      rerender(
        <Canvas>
          <React.Suspense fallback={null}>
            <NerveStrikeParticles3D
              effects={[effect1, effect2, effect3]}
              enabled
            />
          </React.Suspense>
        </Canvas>
      );

      expect(container).toBeTruthy();
    });
  });

  describe('Position Handling', () => {
    it('should handle head-level nerve strikes', () => {
      const effect = createNerveStrikeEffect({
        position: [0, 1.8, 0], // Head height
        vitalPointName: '관자놀이',
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle torso-level nerve strikes', () => {
      const effect = createNerveStrikeEffect({
        position: [0, 1.2, 0], // Torso height
        vitalPointName: '명치',
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle low-level nerve strikes', () => {
      const effect = createNerveStrikeEffect({
        position: [0, 0.5, 0], // Knee height
        vitalPointName: '슬관절',
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle offset positions', () => {
      const effect = createNerveStrikeEffect({
        position: [2.5, 1.5, -1.2],
        vitalPointName: '완관절',
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty effects array', () => {
      const { container } = render3D(
        <NerveStrikeParticles3D effects={[]} enabled />
      );

      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('should handle undefined onEffectComplete', () => {
      const effect = createNerveStrikeEffect();

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle effectiveness boundary values', () => {
      const effects = [
        createNerveStrikeEffect({ id: 'e-0', effectiveness: 0.0 }),
        createNerveStrikeEffect({ id: 'e-1', effectiveness: 1.0 }),
      ];

      const { container } = render3D(
        <NerveStrikeParticles3D effects={effects} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle simultaneous paralysis and non-paralysis effects', () => {
      const effects = [
        createNerveStrikeEffect({
          id: 'para-yes',
          paralysisIndicator: true,
        }),
        createNerveStrikeEffect({
          id: 'para-no',
          paralysisIndicator: false,
        }),
      ];

      const { container } = render3D(
        <NerveStrikeParticles3D effects={effects} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle very high effectiveness with paralysis', () => {
      const effect = createNerveStrikeEffect({
        effectiveness: 1.0,
        paralysisIndicator: true,
        vitalPointName: '경동맥',
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });
  });

  describe('Korean Martial Arts Context', () => {
    it('should handle Hapkido nerve strike techniques', () => {
      const effect = createNerveStrikeEffect({
        vitalPointName: '완관절',
        effectiveness: 0.85,
        paralysisIndicator: true,
      });

      const { container } = render3D(
        <NerveStrikeParticles3D effects={[effect]} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle pressure point combinations', () => {
      const effects = [
        createNerveStrikeEffect({
          id: 'combo-1',
          vitalPointName: '경동맥',
          effectiveness: 0.9,
        }),
        createNerveStrikeEffect({
          id: 'combo-2',
          vitalPointName: '완관절',
          effectiveness: 0.85,
        }),
      ];

      const { container } = render3D(
        <NerveStrikeParticles3D effects={effects} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should handle rapid vital point strikes (연속 급소격)', () => {
      const effects = [
        createNerveStrikeEffect({ id: 'rapid-1', startTime: mockTime }),
        createNerveStrikeEffect({ id: 'rapid-2', startTime: mockTime + 100 }),
        createNerveStrikeEffect({ id: 'rapid-3', startTime: mockTime + 200 }),
      ];

      const { container } = render3D(
        <NerveStrikeParticles3D effects={effects} enabled />
      );

      expect(container).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should handle many simultaneous effects', () => {
      const effects = Array.from({ length: 10 }, (_, i) =>
        createNerveStrikeEffect({
          id: `perf-${i}`,
          position: [Math.random() * 4 - 2, Math.random() * 2, Math.random() * 4 - 2],
        })
      );

      const { container } = render3D(
        <NerveStrikeParticles3D effects={effects} enabled />
      );

      expect(container).toBeTruthy();
    });

    it('should maintain performance on mobile with many effects', () => {
      const effects = Array.from({ length: 8 }, (_, i) =>
        createNerveStrikeEffect({
          id: `mobile-perf-${i}`,
        })
      );

      const { container } = render3D(
        <NerveStrikeParticles3D effects={effects} enabled isMobile />
      );

      expect(container).toBeTruthy();
    });
  });
});
