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

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Gesture types supported by the touch control system
 * 
 * Added tactical step gestures for Korean martial arts footwork:
 * - tap-{direction}: Quick tap for tactical 30cm step
 * - hold-{direction}: Hold for continuous walk
 * 
 * @korean 제스처타입
 */
export type GestureType =
  | 'swipe-right'
  | 'swipe-left'
  | 'swipe-up'
  | 'swipe-down'
  | 'two-finger-tap'
  | 'tap'
  | 'tap-forward'
  | 'tap-back'
  | 'tap-left'
  | 'tap-right'
  | 'tap-forward-left'
  | 'tap-forward-right'
  | 'tap-back-left'
  | 'tap-back-right'
  | 'hold-forward'
  | 'hold-back'
  | 'hold-left'
  | 'hold-right';

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
  /** Time threshold for hold vs tap in ms (default: 200) */
  readonly holdThreshold?: number;
  /** Enable haptic feedback for steps (default: true) */
  readonly enableHaptics?: boolean;
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
 * - Tactical step gestures (tap) vs continuous walk (hold)
 * - Distance calculation for swipe intensity
 * - Configurable thresholds
 * - Haptic feedback for tactical steps
 * 
 * Gesture Mapping:
 * - Swipe Right: Advance toward opponent
 * - Swipe Left: Retreat from opponent
 * - Swipe Up: High stance mode
 * - Swipe Down: Low stance mode
 * - Two-Finger Tap: Activate vital point targeting mode
 * - Single Tap (directional): Tactical 30cm step (전술적 발걸음)
 * - Hold (directional): Continuous walk movement
 * 
 * @example
 * ```typescript
 * const { isTouching } = useTouchControls({
 *   onGesture: (gesture) => {
 *     switch (gesture.type) {
 *       case 'tap-forward':
 *         handleTacticalStep('forward'); // 전진보법
 *         break;
 *       case 'hold-forward':
 *         handleContinuousWalk('forward');
 *         break;
 *       case 'two-finger-tap':
 *         activateVitalPointMode();
 *         break;
 *     }
 *   },
 *   enabled: !isPaused,
 *   holdThreshold: 200, // 200ms to distinguish tap from hold
 *   enableHaptics: true,
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
  holdThreshold = 200,
  enableHaptics = true,
}: UseTouchControlsProps): UseTouchControlsReturn {
  const touchStartRef = useRef<Touch | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const [isTouching, setIsTouching] = useState<boolean>(false);
  const holdTimerRef = useRef<number | null>(null);
  
  /**
   * Trigger haptic feedback for tactical step
   * Light vibration (10ms) to confirm step input
   * 
   * @korean 햅틱피드백
   */
  const triggerStepHaptic = useCallback(() => {
    if (!enableHaptics || !navigator.vibrate) return;
    
    try {
      // Short, light vibration for step (10ms)
      navigator.vibrate(10);
    } catch (error) {
      // Haptic feedback not supported or failed
      console.debug('Haptic feedback not available:', error);
    }
  }, [enableHaptics]);
  
  /**
   * Determine directional gesture from touch position
   * Used for D-pad style controls
   * Returns null for ambiguous/stationary taps
   * 
   * @korean 방향제스처감지
   */
  const getDirectionalGesture = useCallback((
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    isTap: boolean
  ): GestureType | null => {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    // If movement is too small, it's not a directional gesture
    const minDirectionalMovement = 15; // pixels
    if (absX < minDirectionalMovement && absY < minDirectionalMovement) {
      return null; // Ambiguous tap, not directional
    }
    
    // Check for diagonal gestures (45-degree threshold)
    const isDiagonal = absX > 20 && absY > 20 && Math.abs(absX - absY) < 30;
    
    const prefix = isTap ? 'tap' : 'hold';
    
    if (isDiagonal) {
      // Diagonal gestures (only for taps/steps)
      if (isTap) {
        if (deltaY < 0 && deltaX < 0) return 'tap-forward-left';
        if (deltaY < 0 && deltaX > 0) return 'tap-forward-right';
        if (deltaY > 0 && deltaX < 0) return 'tap-back-left';
        if (deltaY > 0 && deltaX > 0) return 'tap-back-right';
      }
      return null;
    }
    
    // Cardinal directions
    if (absX > absY) {
      // Horizontal
      return deltaX > 0 ? `${prefix}-right` as GestureType : `${prefix}-left` as GestureType;
    } else {
      // Vertical
      return deltaY < 0 ? `${prefix}-forward` as GestureType : `${prefix}-back` as GestureType;
    }
  }, []);

  /**
   * Handle touch start event
   */
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;

    const touch = e.touches[0];
    touchStartRef.current = touch;
    touchStartTimeRef.current = Date.now();
    setIsTouching(true);

    // Check for two-finger tap immediately
    if (e.touches.length === 2) {
      e.preventDefault();
      onGesture({
        type: 'two-finger-tap',
        startX: touch.clientX,
        startY: touch.clientY,
      });
      return;
    }
    
    // Set up hold detection timer
    holdTimerRef.current = window.setTimeout(() => {
      // Touch held for longer than threshold - trigger hold gesture
      if (touchStartRef.current && isTouching) {
        const holdGesture = getDirectionalGesture(
          touchStartRef.current.clientX,
          touchStartRef.current.clientY,
          touch.clientX,
          touch.clientY,
          false // Not a tap, it's a hold
        );
        
        if (holdGesture) {
          onGesture({
            type: holdGesture,
            startX: touchStartRef.current.clientX,
            startY: touchStartRef.current.clientY,
          });
        }
      }
    }, holdThreshold);
  }, [enabled, onGesture, holdThreshold, getDirectionalGesture, isTouching]);

  /**
   * Handle touch end event
   */
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enabled || !touchStartRef.current) return;

    const touchEnd = e.changedTouches[0];
    const touchStart = touchStartRef.current;
    const touchDuration = Date.now() - touchStartTimeRef.current;

    // Clear hold timer
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    // Calculate deltas
    const deltaX = touchEnd.clientX - touchStart.clientX;
    const deltaY = touchEnd.clientY - touchStart.clientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Reset touch state
    setIsTouching(false);

    // Detect gesture type
    if (distance >= minSwipeDistance) {
      // Swipe gesture (for quick directional inputs)
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
    } else if (touchDuration <= maxTapDuration && touchDuration < holdThreshold) {
      // Quick tap - tactical step gesture
      e.preventDefault();
      
      const tapGesture = getDirectionalGesture(
        touchStart.clientX,
        touchStart.clientY,
        touchEnd.clientX,
        touchEnd.clientY,
        true // Is a tap
      );
      
      if (tapGesture) {
        // Directional step tap
        triggerStepHaptic();
        onGesture({
          type: tapGesture,
          startX: touchStart.clientX,
          startY: touchStart.clientY,
          endX: touchEnd.clientX,
          endY: touchEnd.clientY,
        });
      } else {
        // Generic tap (fallback)
        onGesture({
          type: 'tap',
          startX: touchStart.clientX,
          startY: touchStart.clientY,
          endX: touchEnd.clientX,
          endY: touchEnd.clientY,
        });
      }
    }

    // Clear touch start reference
    touchStartRef.current = null;
  }, [enabled, minSwipeDistance, maxTapDuration, holdThreshold, onGesture, getDirectionalGesture, triggerStepHaptic]);

  /**
   * Handle touch cancel event
   */
  const handleTouchCancel = useCallback(() => {
    // Clear hold timer
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    
    touchStartRef.current = null;
    touchStartTimeRef.current = 0;
    setIsTouching(false);
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
    isTouching,
  };
}
