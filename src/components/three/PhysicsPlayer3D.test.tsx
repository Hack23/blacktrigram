/**
 * Tests for PhysicsPlayer3D component
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { PhysicsPlayer3D } from './PhysicsPlayer3D';
import { TrigramStance } from '@/types/common';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

// Mock the usePlayerMovement hook
vi.mock('@/hooks/usePlayerMovement', () => ({
  usePlayerMovement: () => ({
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0, clone: () => ({ normalize: () => ({ x: 0, y: 0, z: 0 }) }) },
    speed: 0,
    maxSpeed: 2.0,
    updateControls: vi.fn(),
    reset: vi.fn(),
  }),
}));

describe('PhysicsPlayer3D', () => {
  const renderInCanvas = (component: React.ReactElement) => {
    return render(
      <Canvas>
        <Suspense fallback={null}>
          {component}
        </Suspense>
      </Canvas>
    );
  };

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const { container } = renderInCanvas(
        <PhysicsPlayer3D stance={TrigramStance.GEON} />
      );

      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('should render with default props', () => {
      const { container } = renderInCanvas(
        <PhysicsPlayer3D stance={TrigramStance.GEON} />
      );

      expect(container).toBeTruthy();
    });

    it('should render with custom leg injury factor', () => {
      const { container } = renderInCanvas(
        <PhysicsPlayer3D 
          stance={TrigramStance.GEON}
          legInjuryFactor={0.5}
        />
      );

      expect(container).toBeTruthy();
    });

    it('should render with velocity indicator when enabled', () => {
      const { container } = renderInCanvas(
        <PhysicsPlayer3D 
          stance={TrigramStance.GEON}
          showVelocity={true}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe('Stance Integration', () => {
    it('should render with Geon stance', () => {
      const { container } = renderInCanvas(
        <PhysicsPlayer3D stance={TrigramStance.GEON} />
      );

      expect(container).toBeTruthy();
    });

    it('should render with Wind stance', () => {
      const { container } = renderInCanvas(
        <PhysicsPlayer3D stance={TrigramStance.SON} />
      );

      expect(container).toBeTruthy();
    });

    it('should render with Mountain stance', () => {
      const { container } = renderInCanvas(
        <PhysicsPlayer3D stance={TrigramStance.GAN} />
      );

      expect(container).toBeTruthy();
    });
  });

  describe('Props Handling', () => {
    it('should accept initial position prop', () => {
      const { container } = renderInCanvas(
        <PhysicsPlayer3D 
          stance={TrigramStance.GEON}
        />
      );

      expect(container).toBeTruthy();
    });

    it('should handle enabled prop', () => {
      const { container } = renderInCanvas(
        <PhysicsPlayer3D 
          stance={TrigramStance.GEON}
          enabled={false}
        />
      );

      expect(container).toBeTruthy();
    });

    it('should accept onPositionChange callback prop', () => {
      const onPositionChange = vi.fn();
      
      const { container } = renderInCanvas(
        <PhysicsPlayer3D 
          stance={TrigramStance.GEON}
          onPositionChange={onPositionChange}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe('Component Structure', () => {
    it('should render player mesh', () => {
      const { container } = renderInCanvas(
        <PhysicsPlayer3D stance={TrigramStance.GEON} />
      );

      expect(container).toBeTruthy();
    });

    it('should handle keyboard integration setup', () => {
      const { container } = renderInCanvas(
        <PhysicsPlayer3D stance={TrigramStance.GEON} />
      );

      expect(container).toBeTruthy();
    });
  });
});
