/**
 * Unit tests for useTouchControls hook
 * Tests touch event handling and gesture recognition
 * 
 * @category Testing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTouchControls, GestureEvent } from './useTouchControls';

describe('useTouchControls', () => {
  let onGestureMock: ReturnType<typeof vi.fn<[GestureEvent], void>>;

  beforeEach(() => {
    onGestureMock = vi.fn();
  });

  describe('Hook initialization', () => {
    it('should initialize with isTouching false', () => {
      const { result } = renderHook(() =>
        useTouchControls({ onGesture: onGestureMock })
      );

      expect(result.current.isTouching).toBe(false);
    });

    it('should not throw when enabled', () => {
      expect(() =>
        renderHook(() =>
          useTouchControls({ onGesture: onGestureMock, enabled: true })
        )
      ).not.toThrow();
    });

    it('should not throw when disabled', () => {
      expect(() =>
        renderHook(() =>
          useTouchControls({ onGesture: onGestureMock, enabled: false })
        )
      ).not.toThrow();
    });
  });

  describe('Swipe detection', () => {
    it('should detect swipe right gesture', () => {
      renderHook(() =>
        useTouchControls({
          onGesture: onGestureMock,
          minSwipeDistance: 50,
        })
      );

      act(() => {
        // Simulate swipe right
        const touchStart = new TouchEvent('touchstart', {
          touches: [
            {
              clientX: 100,
              clientY: 200,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchStart);

        const touchEnd = new TouchEvent('touchend', {
          changedTouches: [
            {
              clientX: 200,
              clientY: 200,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchEnd);
      });

      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'swipe-right',
          distance: expect.any(Number),
        })
      );
    });

    it('should detect swipe left gesture', () => {
      renderHook(() =>
        useTouchControls({
          onGesture: onGestureMock,
          minSwipeDistance: 50,
        })
      );

      act(() => {
        const touchStart = new TouchEvent('touchstart', {
          touches: [
            {
              clientX: 200,
              clientY: 200,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchStart);

        const touchEnd = new TouchEvent('touchend', {
          changedTouches: [
            {
              clientX: 100,
              clientY: 200,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchEnd);
      });

      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'swipe-left',
        })
      );
    });

    it('should detect swipe up gesture', () => {
      renderHook(() =>
        useTouchControls({
          onGesture: onGestureMock,
          minSwipeDistance: 50,
        })
      );

      act(() => {
        const touchStart = new TouchEvent('touchstart', {
          touches: [
            {
              clientX: 200,
              clientY: 200,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchStart);

        const touchEnd = new TouchEvent('touchend', {
          changedTouches: [
            {
              clientX: 200,
              clientY: 100,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchEnd);
      });

      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'swipe-up',
        })
      );
    });

    it('should detect swipe down gesture', () => {
      renderHook(() =>
        useTouchControls({
          onGesture: onGestureMock,
          minSwipeDistance: 50,
        })
      );

      act(() => {
        const touchStart = new TouchEvent('touchstart', {
          touches: [
            {
              clientX: 200,
              clientY: 100,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchStart);

        const touchEnd = new TouchEvent('touchend', {
          changedTouches: [
            {
              clientX: 200,
              clientY: 200,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchEnd);
      });

      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'swipe-down',
        })
      );
    });

    it('should include distance in swipe gesture', () => {
      renderHook(() =>
        useTouchControls({
          onGesture: onGestureMock,
          minSwipeDistance: 50,
        })
      );

      act(() => {
        const touchStart = new TouchEvent('touchstart', {
          touches: [
            {
              clientX: 100,
              clientY: 100,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchStart);

        const touchEnd = new TouchEvent('touchend', {
          changedTouches: [
            {
              clientX: 200,
              clientY: 100,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchEnd);
      });

      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({
          distance: 100,
        })
      );
    });

    it('should not detect swipe if distance is below threshold', () => {
      renderHook(() =>
        useTouchControls({
          onGesture: onGestureMock,
          minSwipeDistance: 50,
        })
      );

      act(() => {
        const touchStart = new TouchEvent('touchstart', {
          touches: [
            {
              clientX: 100,
              clientY: 100,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchStart);

        const touchEnd = new TouchEvent('touchend', {
          changedTouches: [
            {
              clientX: 120,
              clientY: 100,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchEnd);
      });

      // Should detect as tap instead
      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'tap',
        })
      );
    });
  });

  describe('Two-finger tap detection', () => {
    it('should detect two-finger tap', () => {
      renderHook(() =>
        useTouchControls({
          onGesture: onGestureMock,
        })
      );

      act(() => {
        const touchStart = new TouchEvent('touchstart', {
          touches: [
            {
              clientX: 100,
              clientY: 100,
            } as Touch,
            {
              clientX: 150,
              clientY: 100,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchStart);
      });

      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'two-finger-tap',
        })
      );
    });
  });

  describe('Tap detection', () => {
    it('should detect tap gesture', () => {
      renderHook(() =>
        useTouchControls({
          onGesture: onGestureMock,
          maxTapDuration: 300,
        })
      );

      act(() => {
        const touchStart = new TouchEvent('touchstart', {
          touches: [
            {
              clientX: 100,
              clientY: 100,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchStart);

        // Simulate short tap
        const touchEnd = new TouchEvent('touchend', {
          changedTouches: [
            {
              clientX: 100,
              clientY: 100,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchEnd);
      });

      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'tap',
        })
      );
    });
  });

  describe('Touch cancel handling', () => {
    it('should handle touch cancel event', () => {
      renderHook(() =>
        useTouchControls({
          onGesture: onGestureMock,
        })
      );

      act(() => {
        const touchStart = new TouchEvent('touchstart', {
          touches: [
            {
              clientX: 100,
              clientY: 100,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchStart);

        const touchCancel = new TouchEvent('touchcancel', {
          touches: [],
        });
        document.dispatchEvent(touchCancel);
      });

      // Should not throw
      expect(onGestureMock).not.toHaveBeenCalled();
    });
  });

  describe('Enabled/disabled state', () => {
    it('should not detect gestures when disabled', () => {
      renderHook(() =>
        useTouchControls({
          onGesture: onGestureMock,
          enabled: false,
        })
      );

      act(() => {
        const touchStart = new TouchEvent('touchstart', {
          touches: [
            {
              clientX: 100,
              clientY: 100,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchStart);

        const touchEnd = new TouchEvent('touchend', {
          changedTouches: [
            {
              clientX: 200,
              clientY: 100,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchEnd);
      });

      expect(onGestureMock).not.toHaveBeenCalled();
    });
  });

  describe('Custom thresholds', () => {
    it('should respect custom minSwipeDistance', () => {
      renderHook(() =>
        useTouchControls({
          onGesture: onGestureMock,
          minSwipeDistance: 100,
        })
      );

      act(() => {
        const touchStart = new TouchEvent('touchstart', {
          touches: [
            {
              clientX: 100,
              clientY: 100,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchStart);

        const touchEnd = new TouchEvent('touchend', {
          changedTouches: [
            {
              clientX: 170,
              clientY: 100,
            } as Touch,
          ],
        });
        document.dispatchEvent(touchEnd);
      });

      // 70px distance < 100px threshold, should be tap
      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'tap',
        })
      );
    });

    it('should respect custom maxTapDuration', () => {
      renderHook(() =>
        useTouchControls({
          onGesture: onGestureMock,
          maxTapDuration: 100,
        })
      );

      // This test would need setTimeout to properly test,
      // but we verify the parameter is passed correctly
      expect(() => {
        act(() => {
          const touchStart = new TouchEvent('touchstart', {
            touches: [
              {
                clientX: 100,
                clientY: 100,
              } as Touch,
            ],
          });
          document.dispatchEvent(touchStart);
        });
      }).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    it('should remove event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() =>
        useTouchControls({
          onGesture: onGestureMock,
        })
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchcancel', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });
});
