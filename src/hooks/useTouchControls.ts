/**
 * Touch Controls Hook
 * 
 * Manages touch event handling and gesture recognition for mobile gameplay
 * Provides swipe detection, multi-touch support, and touch-based movement
 * 
 * @module hooks/useTouchControls
 * @category Mobile Controls
 * @korean 터치 컨트롤 훅
 */

import { useCallback, useEffect, useRef } from 'react';

/**
 * Gesture types supported by the touch control system
 */
export type GestureType =
  | 'swipe-right'
  | 'swipe-left'
  | 'swipe-up'
  | 'swipe-down'
  | 'two-finger-tap'
  | 'tap';

/**
 * Gesture event data
 */
export interface GestureEvent {
  /** Type of gesture detected */
  readonly type: GestureType;
  /** Distance of swipe in pixels (for swipe gestures) */
  readonly distance?: number;
  /** Coordinates of touch start */
  readonly startX?: number;
  readonly startY?: number;
  /** Coordinates of touch end */
  readonly endX?: number;
  readonly endY?: number;
}

/**
 * Props for useTouchControls hook
 */
export interface UseTouchControlsProps {
  /** Callback when gesture is detected */
  readonly onGesture: (gesture: GestureEvent) => void;
  /** Whether touch input is enabled */
  readonly enabled?: boolean;
  /** Minimum swipe distance in pixels (default: 50) */
  readonly minSwipeDistance?: number;
  /** Maximum time for tap in ms (default: 300) */
  readonly maxTapDuration?: number;
}

/**
 * Return type for useTouchControls hook
 */
export interface UseTouchControlsReturn {
  /** Whether a touch is currently active */
  readonly isTouching: boolean;
}

/**
 * Custom hook for handling touch controls and gesture recognition
 * 
 * Features:
 * - Swipe detection (horizontal and vertical)
 * - Two-finger tap detection for vital point mode
 * - Single tap detection
 * - Distance calculation for swipe intensity
 * - Configurable thresholds
 * 
 * Gesture Mapping:
 * - Swipe Right: Advance toward opponent
 * - Swipe Left: Retreat from opponent
 * - Swipe Up: High stance mode
 * - Swipe Down: Low stance mode
 * - Two-Finger Tap: Activate vital point targeting mode
 * - Single Tap: Context-specific action
 * 
 * @example
 * ```typescript
 * const { isTouching } = useTouchControls({
 *   onGesture: (gesture) => {
 *     switch (gesture.type) {
 *       case 'swipe-right':
 *         handleAdvance();
 *         break;
 *       case 'two-finger-tap':
 *         activateVitalPointMode();
 *         break;
 *     }
 *   },
 *   enabled: !isPaused,
 *   minSwipeDistance: 50,
 * });
 * ```
 * 
 * @public
 * @korean 터치컨트롤사용
 */
export function useTouchControls({
  onGesture,
  enabled = true,
  minSwipeDistance = 50,
  maxTapDuration = 300,
}: UseTouchControlsProps): UseTouchControlsReturn {
  const touchStartRef = useRef<Touch | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const isTouchingRef = useRef<boolean>(false);

  /**
   * Handle touch start event
   */
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;

    const touch = e.touches[0];
    touchStartRef.current = touch;
    touchStartTimeRef.current = Date.now();
    isTouchingRef.current = true;

    // Check for two-finger tap immediately
    if (e.touches.length === 2) {
      e.preventDefault();
      onGesture({
        type: 'two-finger-tap',
        startX: touch.clientX,
        startY: touch.clientY,
      });
    }
  }, [enabled, onGesture]);

  /**
   * Handle touch end event
   */
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enabled || !touchStartRef.current) return;

    const touchEnd = e.changedTouches[0];
    const touchStart = touchStartRef.current;
    const touchDuration = Date.now() - touchStartTimeRef.current;

    // Calculate deltas
    const deltaX = touchEnd.clientX - touchStart.clientX;
    const deltaY = touchEnd.clientY - touchStart.clientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Reset touch state
    isTouchingRef.current = false;

    // Detect gesture type
    if (distance >= minSwipeDistance) {
      // Swipe gesture
      e.preventDefault();

      // Determine primary direction
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          onGesture({
            type: 'swipe-right',
            distance,
            startX: touchStart.clientX,
            startY: touchStart.clientY,
            endX: touchEnd.clientX,
            endY: touchEnd.clientY,
          });
        } else {
          onGesture({
            type: 'swipe-left',
            distance,
            startX: touchStart.clientX,
            startY: touchStart.clientY,
            endX: touchEnd.clientX,
            endY: touchEnd.clientY,
          });
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          onGesture({
            type: 'swipe-down',
            distance,
            startX: touchStart.clientX,
            startY: touchStart.clientY,
            endX: touchEnd.clientX,
            endY: touchEnd.clientY,
          });
        } else {
          onGesture({
            type: 'swipe-up',
            distance,
            startX: touchStart.clientX,
            startY: touchStart.clientY,
            endX: touchEnd.clientX,
            endY: touchEnd.clientY,
          });
        }
      }
    } else if (touchDuration <= maxTapDuration) {
      // Tap gesture (short duration, small distance)
      onGesture({
        type: 'tap',
        startX: touchStart.clientX,
        startY: touchStart.clientY,
        endX: touchEnd.clientX,
        endY: touchEnd.clientY,
      });
    }

    // Clear touch start reference
    touchStartRef.current = null;
  }, [enabled, minSwipeDistance, maxTapDuration, onGesture]);

  /**
   * Handle touch cancel event
   */
  const handleTouchCancel = useCallback(() => {
    touchStartRef.current = null;
    touchStartTimeRef.current = 0;
    isTouchingRef.current = false;
  }, []);

  /**
   * Setup touch event listeners
   */
  useEffect(() => {
    if (!enabled) return;

    const options: AddEventListenerOptions = {
      passive: false, // Allow preventDefault for gesture handling
    };

    document.addEventListener('touchstart', handleTouchStart, options);
    document.addEventListener('touchend', handleTouchEnd, options);
    document.addEventListener('touchcancel', handleTouchCancel, options);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [enabled, handleTouchStart, handleTouchEnd, handleTouchCancel]);

  return {
    isTouching: isTouchingRef.current,
  };
}
