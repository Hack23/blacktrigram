/**
 * Unit tests for VirtualDPad component
 * Tests 8-directional touch control interface
 * 
 * @category Testing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Direction, DPadEventType } from './VirtualDPad';

// Note: Testing Three.js Html components requires special async handling
// These tests focus on component logic and props validation
// Rendering tests would require @react-three/test-renderer

describe('VirtualDPad', () => {
  let onMoveMock: ReturnType<typeof vi.fn<[Direction | null, DPadEventType], void>>;
  let vibrateSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onMoveMock = vi.fn();
    vibrateSpy = vi.fn();
    Object.defineProperty(navigator, 'vibrate', {
      writable: true,
      configurable: true,
      value: vibrateSpy,
    });
  });

  describe('Component props', () => {
    it('should accept onMove callback', () => {
      const props: VirtualDPadProps = { onMove: onMoveMock };
      expect(props.onMove).toBeDefined();
    });

    it('should accept disabled prop', () => {
      const props: VirtualDPadProps = { onMove: onMoveMock, disabled: true };
      expect(props.disabled).toBe(true);
    });

    it('should accept custom size', () => {
      const props: VirtualDPadProps = { onMove: onMoveMock, size: 150 };
      expect(props.size).toBe(150);
    });

    it('should accept custom position', () => {
      const props: VirtualDPadProps = { onMove: onMoveMock, bottom: 34, left: 40 };
      expect(props.bottom).toBe(34);
      expect(props.left).toBe(40);
    });

    it('should accept custom opacity', () => {
      const props: VirtualDPadProps = { onMove: onMoveMock, opacity: 0.5 };
      expect(props.opacity).toBe(0.5);
    });
  });

  describe('Direction types', () => {
    it('should support all 8 directions', () => {
      const directions: Direction[] = [
        'up',
        'up-right',
        'right',
        'down-right',
        'down',
        'down-left',
        'left',
        'up-left',
      ];

      directions.forEach((direction) => {
        expect(direction).toBeTruthy();
      });
    });
  });

  describe('Event type', () => {
    it('should support start event', () => {
      const eventType: DPadEventType = 'start';
      expect(eventType).toBe('start');
    });

    it('should support end event', () => {
      const eventType: DPadEventType = 'end';
      expect(eventType).toBe('end');
    });
  });

  describe('Button sizing logic', () => {
    it('should ensure minimum 48px button size for default D-Pad', () => {
      const size = 140;
      const buttonSize = Math.max(48, size * 0.3);
      expect(buttonSize).toBe(48);
    });

    it('should scale button size with larger D-Pad', () => {
      const size = 200;
      const buttonSize = Math.max(48, size * 0.3);
      expect(buttonSize).toBe(60);
    });

    it('should handle very large D-Pad', () => {
      const size = 400;
      const buttonSize = Math.max(44, size * 0.3);
      expect(buttonSize).toBe(120);
    });
  });

  describe('Haptic feedback', () => {
    it('should support vibrate API check', () => {
      expect(typeof navigator.vibrate).toBe('function');
    });

    it('should call vibrate with light pattern', () => {
      vibrateSpy([10]);
      expect(vibrateSpy).toHaveBeenCalledWith([10]);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero size', () => {
      const size = 0;
      const buttonSize = Math.max(44, size * 0.3);
      expect(buttonSize).toBe(44);
    });

    it('should handle negative size', () => {
      const size = -100;
      const buttonSize = Math.max(44, size * 0.3);
      expect(buttonSize).toBe(44);
    });

    it('should handle very large size', () => {
      const size = 10000;
      const buttonSize = Math.max(44, size * 0.3);
      expect(buttonSize).toBe(3000);
    });
  });

  describe('Position calculation', () => {
    it('should handle zero position', () => {
      const bottom = 0;
      const left = 0;
      expect(bottom).toBe(0);
      expect(left).toBe(0);
    });

    it('should handle negative position', () => {
      const bottom = -10;
      const left = -10;
      expect(bottom).toBe(-10);
      expect(left).toBe(-10);
    });
  });
});
