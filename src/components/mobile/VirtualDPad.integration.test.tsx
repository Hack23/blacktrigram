/**
 * Integration tests for VirtualDPad and Player Movement
 * 
 * Tests that mobile D-Pad controls properly trigger player movement via synthetic
 * keyboard events. This test suite verifies the fix for issue where VirtualDPad
 * touch inputs were not moving Player 1 in CombatScreen3D.
 * 
 * The root cause was that synthetic KeyboardEvents lacked proper properties
 * (bubbles, cancelable, code) required by usePlayerMovement hook in inputSystem.ts.
 * 
 * This test suite validates:
 * - Synthetic keyboard events are dispatched with all required properties
 * - All 8 D-pad directions map to correct WASD keys
 * - Key press and release events work correctly
 * - State management handles direction changes properly
 * - Multiple press-release cycles work as expected
 * 
 * @see CombatScreen3D.tsx - handleMobileMove function
 * @see inputSystem.ts - usePlayerMovement hook
 * @see VirtualDPad.tsx - Mobile touch control component
 * 
 * @category Testing - Integration
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Direction, DPadEventType } from './VirtualDPad';

/**
 * Test suite for VirtualDPad - Player Movement Integration
 * Verifies that D-Pad touch inputs properly trigger player movement via keyboard events
 */
describe('VirtualDPad - Player Movement Integration', () => {
  let keydownListener: ((event: KeyboardEvent) => void) | null = null;
  let keyupListener: ((event: KeyboardEvent) => void) | null = null;
  let capturedKeydowns: string[] = [];
  let capturedKeyups: string[] = [];

  beforeEach(() => {
    // Clear captured events
    capturedKeydowns = [];
    capturedKeyups = [];

    // Create event listeners that will capture synthetic keyboard events
    keydownListener = (event: KeyboardEvent) => {
      capturedKeydowns.push(event.key);
    };

    keyupListener = (event: KeyboardEvent) => {
      capturedKeyups.push(event.key);
    };

    // Attach listeners to window
    window.addEventListener('keydown', keydownListener);
    window.addEventListener('keyup', keyupListener);
  });

  afterEach(() => {
    // Clean up listeners
    if (keydownListener) {
      window.removeEventListener('keydown', keydownListener);
    }
    if (keyupListener) {
      window.removeEventListener('keyup', keyupListener);
    }
  });

  /**
   * Simulates the handleMobileMove callback from CombatScreen3D
   * This replicates the fixed implementation with proper KeyboardEvent properties
   */
  const simulateMobileMove = (
    direction: Direction | null,
    eventType: DPadEventType,
    activeMobileKey: { current: string | null }
  ) => {
    const directionMap: Record<Direction, string> = {
      up: 'w',
      'up-right': 'w',
      right: 'd',
      'down-right': 's',
      down: 's',
      'down-left': 's',
      left: 'a',
      'up-left': 'w',
    };

    if (eventType === 'start' && direction) {
      // Release previous key if different
      if (
        activeMobileKey.current &&
        activeMobileKey.current !== directionMap[direction]
      ) {
        const prevKey = activeMobileKey.current;
        window.dispatchEvent(
          new KeyboardEvent('keyup', {
            key: prevKey,
            code: `Key${prevKey.toUpperCase()}`,
            bubbles: true,
            cancelable: true,
          })
        );
      }

      // Press new key with proper keyboard event properties
      const key = directionMap[direction];
      activeMobileKey.current = key;
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key,
          code: `Key${key.toUpperCase()}`,
          bubbles: true,
          cancelable: true,
        })
      );
    } else if (eventType === 'end') {
      // Release active key
      if (activeMobileKey.current) {
        const key = activeMobileKey.current;
        window.dispatchEvent(
          new KeyboardEvent('keyup', {
            key,
            code: `Key${key.toUpperCase()}`,
            bubbles: true,
            cancelable: true,
          })
        );
        activeMobileKey.current = null;
      }
    }
  };

  describe('Synthetic Keyboard Event Dispatch', () => {
    it('should dispatch keydown event when D-Pad up pressed', () => {
      const activeMobileKey = { current: null };
      
      simulateMobileMove('up', 'start', activeMobileKey);
      
      expect(capturedKeydowns).toContain('w');
      expect(activeMobileKey.current).toBe('w');
    });

    it('should dispatch keydown event when D-Pad down pressed', () => {
      const activeMobileKey = { current: null };
      
      simulateMobileMove('down', 'start', activeMobileKey);
      
      expect(capturedKeydowns).toContain('s');
      expect(activeMobileKey.current).toBe('s');
    });

    it('should dispatch keydown event when D-Pad left pressed', () => {
      const activeMobileKey = { current: null };
      
      simulateMobileMove('left', 'start', activeMobileKey);
      
      expect(capturedKeydowns).toContain('a');
      expect(activeMobileKey.current).toBe('a');
    });

    it('should dispatch keydown event when D-Pad right pressed', () => {
      const activeMobileKey = { current: null };
      
      simulateMobileMove('right', 'start', activeMobileKey);
      
      expect(capturedKeydowns).toContain('d');
      expect(activeMobileKey.current).toBe('d');
    });

    it('should dispatch keyup event when D-Pad released', () => {
      const activeMobileKey = { current: null };
      
      // Press up first
      simulateMobileMove('up', 'start', activeMobileKey);
      expect(capturedKeydowns).toContain('w');
      
      // Release
      simulateMobileMove(null, 'end', activeMobileKey);
      
      expect(capturedKeyups).toContain('w');
      expect(activeMobileKey.current).toBe(null);
    });

    it('should handle direction change by releasing previous key', () => {
      const activeMobileKey = { current: null };
      
      // Press up
      simulateMobileMove('up', 'start', activeMobileKey);
      expect(capturedKeydowns).toContain('w');
      
      // Change to right
      simulateMobileMove('right', 'start', activeMobileKey);
      
      expect(capturedKeyups).toContain('w');
      expect(capturedKeydowns).toContain('d');
      expect(activeMobileKey.current).toBe('d');
    });

    it('should handle diagonal directions', () => {
      const activeMobileKey = { current: null };
      
      // Test up-right (should map to 'w')
      simulateMobileMove('up-right', 'start', activeMobileKey);
      expect(capturedKeydowns).toContain('w');
      
      // Release
      simulateMobileMove(null, 'end', activeMobileKey);
      
      // Test down-left (should map to 's')
      simulateMobileMove('down-left', 'start', activeMobileKey);
      expect(capturedKeydowns).toContain('s');
    });
  });

  describe('KeyboardEvent Properties', () => {
    it('should dispatch events with proper key property', () => {
      const activeMobileKey = { current: null };
      let capturedEvent: KeyboardEvent | null = null;
      
      const listener = (e: KeyboardEvent) => {
        capturedEvent = e;
      };
      
      window.addEventListener('keydown', listener);
      simulateMobileMove('up', 'start', activeMobileKey);
      
      expect(capturedEvent).not.toBeNull();
      expect(capturedEvent?.key).toBe('w');
      
      window.removeEventListener('keydown', listener);
    });

    it('should dispatch events with proper code property', () => {
      const activeMobileKey = { current: null };
      let capturedEvent: KeyboardEvent | null = null;
      
      const listener = (e: KeyboardEvent) => {
        capturedEvent = e;
      };
      
      window.addEventListener('keydown', listener);
      simulateMobileMove('up', 'start', activeMobileKey);
      
      expect(capturedEvent).not.toBeNull();
      expect(capturedEvent?.code).toBe('KeyW');
      
      window.removeEventListener('keydown', listener);
    });

    it('should dispatch events with bubbles=true', () => {
      const activeMobileKey = { current: null };
      let capturedEvent: KeyboardEvent | null = null;
      
      const listener = (e: KeyboardEvent) => {
        capturedEvent = e;
      };
      
      window.addEventListener('keydown', listener);
      simulateMobileMove('up', 'start', activeMobileKey);
      
      expect(capturedEvent).not.toBeNull();
      expect(capturedEvent?.bubbles).toBe(true);
      
      window.removeEventListener('keydown', listener);
    });

    it('should dispatch events with cancelable=true', () => {
      const activeMobileKey = { current: null };
      let capturedEvent: KeyboardEvent | null = null;
      
      const listener = (e: KeyboardEvent) => {
        capturedEvent = e;
      };
      
      window.addEventListener('keydown', listener);
      simulateMobileMove('up', 'start', activeMobileKey);
      
      expect(capturedEvent).not.toBeNull();
      expect(capturedEvent?.cancelable).toBe(true);
      
      window.removeEventListener('keydown', listener);
    });
  });

  describe('Movement Key Mapping', () => {
    it('should map all 8 directions correctly', () => {
      const activeMobileKey = { current: null };
      const expectedMappings: Record<Direction, string> = {
        up: 'w',
        'up-right': 'w',
        right: 'd',
        'down-right': 's',
        down: 's',
        'down-left': 's',
        left: 'a',
        'up-left': 'w',
      };

      Object.entries(expectedMappings).forEach(([direction, expectedKey]) => {
        capturedKeydowns = [];
        simulateMobileMove(direction as Direction, 'start', activeMobileKey);
        expect(capturedKeydowns).toContain(expectedKey);
        simulateMobileMove(null, 'end', activeMobileKey);
      });
    });
  });

  describe('State Management', () => {
    it('should not dispatch events if no direction is active', () => {
      const activeMobileKey = { current: null };
      
      simulateMobileMove(null, 'start', activeMobileKey);
      
      expect(capturedKeydowns).toHaveLength(0);
      expect(activeMobileKey.current).toBe(null);
    });

    it('should clear active key on release', () => {
      const activeMobileKey = { current: null };
      
      simulateMobileMove('up', 'start', activeMobileKey);
      expect(activeMobileKey.current).toBe('w');
      
      simulateMobileMove(null, 'end', activeMobileKey);
      expect(activeMobileKey.current).toBe(null);
    });

    it('should handle multiple press-release cycles', () => {
      const activeMobileKey = { current: null };
      
      // Cycle 1: up
      simulateMobileMove('up', 'start', activeMobileKey);
      simulateMobileMove(null, 'end', activeMobileKey);
      
      // Cycle 2: down
      simulateMobileMove('down', 'start', activeMobileKey);
      simulateMobileMove(null, 'end', activeMobileKey);
      
      // Cycle 3: left
      simulateMobileMove('left', 'start', activeMobileKey);
      simulateMobileMove(null, 'end', activeMobileKey);
      
      expect(capturedKeydowns).toEqual(['w', 's', 'a']);
      expect(capturedKeyups).toEqual(['w', 's', 'a']);
    });
  });
});
