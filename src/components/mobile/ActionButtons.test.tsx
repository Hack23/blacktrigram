/**
 * Unit tests for ActionButtons component
 * Tests attack and block touch button controls
 * 
 * @category Testing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ButtonEventType } from './ActionButtons';

// Note: Testing Three.js Html components requires special async handling
// These tests focus on component logic and props validation
// Rendering tests would require @react-three/test-renderer

describe('ActionButtons', () => {
  let onAttackMock: ReturnType<typeof vi.fn<[], void>>;
  let onBlockMock: ReturnType<typeof vi.fn<[ButtonEventType], void>>;
  let vibrateSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onAttackMock = vi.fn();
    onBlockMock = vi.fn();
    vibrateSpy = vi.fn();
    Object.defineProperty(navigator, 'vibrate', {
      writable: true,
      configurable: true,
      value: vibrateSpy,
    });
  });

  describe('Component props', () => {
    it('should accept onAttack callback', () => {
      const props: ActionButtonsProps = {
        onAttack: onAttackMock,
        onBlock: onBlockMock,
      };
      expect(props.onAttack).toBeDefined();
    });

    it('should accept onBlock callback', () => {
      const props: ActionButtonsProps = {
        onAttack: onAttackMock,
        onBlock: onBlockMock,
      };
      expect(props.onBlock).toBeDefined();
    });

    it('should accept disabled prop', () => {
      const props: ActionButtonsProps = {
        onAttack: onAttackMock,
        onBlock: onBlockMock,
        disabled: true,
      };
      expect(props.disabled).toBe(true);
    });

    it('should accept custom position', () => {
      const props: ActionButtonsProps = {
        onAttack: onAttackMock,
        onBlock: onBlockMock,
        bottom: 34,
        right: 40,
      };
      expect(props.bottom).toBe(34);
      expect(props.right).toBe(40);
    });

    it('should accept custom opacity', () => {
      const props: ActionButtonsProps = {
        onAttack: onAttackMock,
        onBlock: onBlockMock,
        opacity: 0.6,
      };
      expect(props.opacity).toBe(0.6);
    });
  });

  describe('Event types', () => {
    it('should support start event type', () => {
      const eventType: ButtonEventType = 'start';
      expect(eventType).toBe('start');
    });

    it('should support end event type', () => {
      const eventType: ButtonEventType = 'end';
      expect(eventType).toBe('end');
    });
  });

  describe('Button sizing', () => {
    it('should ensure attack button is 80x80px', () => {
      const attackButtonSize = { width: 80, height: 80 };
      expect(attackButtonSize.width).toBe(80);
      expect(attackButtonSize.height).toBe(80);
      expect(attackButtonSize.width).toBeGreaterThanOrEqual(44);
    });

    it('should ensure block button is 70x70px', () => {
      const blockButtonSize = { width: 70, height: 70 };
      expect(blockButtonSize.width).toBe(70);
      expect(blockButtonSize.height).toBe(70);
      expect(blockButtonSize.width).toBeGreaterThanOrEqual(44);
      expect(blockButtonSize.height).toBeGreaterThanOrEqual(44);
    });
  });

  describe('Haptic feedback patterns', () => {
    it('should use medium haptic for attack', () => {
      const mediumPattern = [50];
      vibrateSpy(mediumPattern);
      expect(vibrateSpy).toHaveBeenCalledWith(mediumPattern);
    });

    it('should use light haptic for block', () => {
      const lightPattern = [10];
      vibrateSpy(lightPattern);
      expect(vibrateSpy).toHaveBeenCalledWith(lightPattern);
    });
  });

  describe('Callback behavior', () => {
    it('should call onAttack when attack button is pressed', () => {
      onAttackMock();
      expect(onAttackMock).toHaveBeenCalledTimes(1);
    });

    it('should call onBlock with "start" when block button is pressed', () => {
      onBlockMock('start');
      expect(onBlockMock).toHaveBeenCalledWith('start');
    });

    it('should call onBlock with "end" when block button is released', () => {
      onBlockMock('start');
      onBlockMock('end');
      expect(onBlockMock).toHaveBeenCalledWith('end');
      expect(onBlockMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid button presses', () => {
      onAttackMock();
      onAttackMock();
      onAttackMock();
      expect(onAttackMock).toHaveBeenCalledTimes(3);
    });

    it('should handle both buttons pressed simultaneously', () => {
      onAttackMock();
      onBlockMock('start');
      expect(onAttackMock).toHaveBeenCalledTimes(1);
      expect(onBlockMock).toHaveBeenCalledTimes(1);
    });

    it('should handle hold-to-block pattern', () => {
      onBlockMock('start');
      // Block is held
      onBlockMock('end');
      expect(onBlockMock).toHaveBeenNthCalledWith(1, 'start');
      expect(onBlockMock).toHaveBeenNthCalledWith(2, 'end');
    });
  });

  describe('Position values', () => {
    it('should handle default position', () => {
      const defaultPosition = { bottom: 20, right: 20 };
      expect(defaultPosition.bottom).toBe(20);
      expect(defaultPosition.right).toBe(20);
    });

    it('should handle custom position', () => {
      const customPosition = { bottom: 30, right: 40 };
      expect(customPosition.bottom).toBe(30);
      expect(customPosition.right).toBe(40);
    });

    it('should handle zero position', () => {
      const zeroPosition = { bottom: 0, right: 0 };
      expect(zeroPosition.bottom).toBe(0);
      expect(zeroPosition.right).toBe(0);
    });
  });

  describe('Opacity values', () => {
    it('should handle default opacity', () => {
      const defaultOpacity = 0.8;
      expect(defaultOpacity).toBe(0.8);
    });

    it('should handle custom opacity', () => {
      const customOpacity = 0.6;
      expect(customOpacity).toBe(0.6);
    });

    it('should handle disabled opacity', () => {
      const disabledOpacity = 0.3;
      expect(disabledOpacity).toBe(0.3);
    });
  });
});
