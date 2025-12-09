/**
 * GestureRecognizer Component
 * 
 * Visual overlay for gesture detection feedback
 * Displays swipe trails and multi-touch indicators
 * 
 * @module components/mobile/GestureRecognizer
 * @category Mobile Controls
 * @korean 제스처 인식기
 */

import { Html } from '@react-three/drei';
import React, { useCallback, useEffect, useState } from 'react';
import { KOREAN_COLORS } from '../../types/constants';
import { GestureEvent, useTouchControls } from '../../hooks/useTouchControls';
import { getColorRGB } from '../../utils/colorHelpers';

/**
 * Props for GestureRecognizer component
 */
export interface GestureRecognizerProps {
  /** Callback when gesture is detected */
  readonly onGesture: (gesture: GestureEvent) => void;
  /** Whether gesture recognition is enabled */
  readonly enabled?: boolean;
  /** Whether to show visual feedback */
  readonly showFeedback?: boolean;
  /** Minimum swipe distance in pixels (default: 50) */
  readonly minSwipeDistance?: number;
}

/**
 * Visual feedback state for gestures
 */
interface GestureFeedback {
  readonly id: number;
  readonly type: string;
  readonly timestamp: number;
  readonly x: number;
  readonly y: number;
  readonly age?: number; // Cached age to avoid impure function calls during render
}

/**
 * GestureRecognizer Component
 * 
 * Provides gesture detection and visual feedback for mobile controls
 * Features:
 * - Swipe detection (4 directions)
 * - Two-finger tap detection
 * - Visual trail feedback
 * - Gesture type indicators
 * - Auto-fading feedback
 * 
 * Gesture Mappings:
 * - Swipe Right: Advance toward opponent
 * - Swipe Left: Retreat from opponent
 * - Swipe Up: High attack mode
 * - Swipe Down: Low attack mode
 * - Two-Finger Tap: Vital point targeting mode
 * 
 * @example
 * ```tsx
 * <GestureRecognizer
 *   onGesture={(gesture) => {
 *     console.log('Detected:', gesture.type);
 *     handleGesture(gesture);
 *   }}
 *   enabled={!isPaused}
 *   showFeedback={true}
 * />
 * ```
 * 
 * @public
 * @korean 제스처인식기
 */
export const GestureRecognizer: React.FC<GestureRecognizerProps> = ({
  onGesture,
  enabled = true,
  showFeedback = true,
  minSwipeDistance = 50,
}) => {
  const [feedbacks, setFeedbacks] = useState<GestureFeedback[]>([]);
  const [nextId, setNextId] = useState(0);

  /**
   * Handle detected gesture
   */
  const handleGesture = useCallback(
    (gesture: GestureEvent) => {
      // Pass gesture to parent
      onGesture(gesture);

      // Add visual feedback
      if (showFeedback && gesture.endX !== undefined && gesture.endY !== undefined) {
        const feedback: GestureFeedback = {
          id: nextId,
          type: gesture.type,
          timestamp: Date.now(),
          x: gesture.endX,
          y: gesture.endY,
        };

        setFeedbacks((prev) => [...prev, feedback]);
        setNextId((prev) => prev + 1);
      }
    },
    [onGesture, showFeedback, nextId]
  );

  /**
   * Use touch controls hook for gesture detection
   */
  useTouchControls({
    onGesture: handleGesture,
    enabled,
    minSwipeDistance,
  });

  /**
   * Clean up old feedback indicators and update ages
   */
  useEffect(() => {
    if (!showFeedback) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setFeedbacks((prev) =>
        prev
          .filter((fb) => now - fb.timestamp < 1000)
          .map((fb) => ({ ...fb, age: now - fb.timestamp }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, [showFeedback]);

  if (!showFeedback) {
    return null;
  }

  // Get RGB colors using shared utility
  const primaryColor = getColorRGB(KOREAN_COLORS.PRIMARY_CYAN);
  const goldColor = getColorRGB(KOREAN_COLORS.ACCENT_GOLD);

  /**
   * Get display info for gesture type
   */
  const getGestureDisplay = (type: string): { korean: string; english: string; icon: string } => {
    const displays: Record<string, { korean: string; english: string; icon: string }> = {
      'swipe-right': { korean: '전진', english: 'Advance', icon: '→' },
      'swipe-left': { korean: '후퇴', english: 'Retreat', icon: '←' },
      'swipe-up': { korean: '상단', english: 'High', icon: '↑' },
      'swipe-down': { korean: '하단', english: 'Low', icon: '↓' },
      'two-finger-tap': { korean: '급소', english: 'Vital Point', icon: '🎯' },
      tap: { korean: '터치', english: 'Tap', icon: '👆' },
    };
    return displays[type] ?? { korean: '제스처', english: 'Gesture', icon: '✋' };
  };

  return (
    <Html fullscreen>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1000,
        }}
        data-testid="gesture-recognizer"
      >
        {/* Gesture feedback indicators */}
        {feedbacks.map((feedback) => {
          const age = feedback.age ?? 0;
          const opacity = Math.max(0, 1 - age / 1000);
          const scale = 1 + age / 500;
          const display = getGestureDisplay(feedback.type);

          return (
            <div
              key={feedback.id}
              style={{
                position: 'absolute',
                left: `${feedback.x}px`,
                top: `${feedback.y}px`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
                transition: 'all 0.1s ease-out',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
              data-testid={`gesture-feedback-${feedback.id}`}
            >
              {/* Icon */}
              <div
                style={{
                  fontSize: '32px',
                  color: `rgba(${goldColor.r}, ${goldColor.g}, ${goldColor.b}, ${opacity})`,
                  textShadow: `0 0 10px rgba(${goldColor.r}, ${goldColor.g}, ${goldColor.b}, ${opacity * 0.8})`,
                }}
              >
                {display.icon}
              </div>

              {/* Label */}
              <div
                style={{
                  background: `rgba(0, 0, 0, ${opacity * 0.8})`,
                  border: `2px solid rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${opacity})`,
                  borderRadius: '8px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${opacity})`,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
                }}
              >
                {display.korean} | {display.english}
              </div>
            </div>
          );
        })}

        {/* Gesture instructions overlay (optional) */}
        {enabled && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(0, 0, 0, 0.7)',
              border: `2px solid rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.6)`,
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '10px',
              color: `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.9)`,
              maxWidth: '150px',
              opacity: 0.7,
            }}
            data-testid="gesture-instructions"
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>제스처 | Gestures</div>
            <div>← → 이동 | Move</div>
            <div>↑ ↓ 공격 | Attack</div>
            <div>🤞 급소 | Vital</div>
          </div>
        )}
      </div>
    </Html>
  );
};
