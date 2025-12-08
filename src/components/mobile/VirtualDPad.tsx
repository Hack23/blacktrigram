/**
 * VirtualDPad Component
 * 
 * 8-directional virtual D-Pad for mobile touch controls
 * Provides tactile movement control with visual feedback and haptic response
 * 
 * @module components/mobile/VirtualDPad
 * @category Mobile Controls
 * @korean 가상 방향 패드
 */

import { Html } from '@react-three/drei';
import React, { useCallback, useState } from 'react';
import { KOREAN_COLORS } from '../../types/constants';
import { triggerHaptic } from '../../utils/haptics';

/**
 * 8 directions for movement control
 */
export type Direction =
  | 'up'
  | 'up-right'
  | 'right'
  | 'down-right'
  | 'down'
  | 'down-left'
  | 'left'
  | 'up-left';

/**
 * Event type for D-Pad interactions
 */
export type DPadEventType = 'start' | 'end';

/**
 * Props for VirtualDPad component
 */
export interface VirtualDPadProps {
  /** Callback when direction changes */
  readonly onMove: (direction: Direction | null, eventType: DPadEventType) => void;
  /** Whether D-Pad is disabled */
  readonly disabled?: boolean;
  /** Size of the D-Pad in pixels (default: 120) */
  readonly size?: number;
  /** Position from bottom in pixels (default: 20) */
  readonly bottom?: number;
  /** Position from left in pixels (default: 20) */
  readonly left?: number;
  /** Opacity of the D-Pad (default: 0.8) */
  readonly opacity?: number;
}

/**
 * Direction configuration for D-Pad buttons
 */
interface DirectionConfig {
  readonly direction: Direction;
  readonly angle: number; // Angle in degrees for positioning
  readonly korean: string; // Korean label
}

/**
 * 8-directional configuration
 * Arranged clockwise starting from up (0°)
 */
const DIRECTIONS: readonly DirectionConfig[] = [
  { direction: 'up', angle: 0, korean: '↑' },
  { direction: 'up-right', angle: 45, korean: '↗' },
  { direction: 'right', angle: 90, korean: '→' },
  { direction: 'down-right', angle: 135, korean: '↘' },
  { direction: 'down', angle: 180, korean: '↓' },
  { direction: 'down-left', angle: 225, korean: '↙' },
  { direction: 'left', angle: 270, korean: '←' },
  { direction: 'up-left', angle: 315, korean: '↖' },
] as const;

/**
 * Individual D-Pad button component
 */
interface DPadButtonProps {
  readonly config: DirectionConfig;
  readonly active: boolean;
  readonly onTouchStart: (e: React.TouchEvent) => void;
  readonly onTouchEnd: (e: React.TouchEvent) => void;
  readonly radius: number; // Radius for button positioning
  readonly buttonSize: number;
}

/**
 * D-Pad button positioned around the center
 */
const DPadButton: React.FC<DPadButtonProps> = ({
  config,
  active,
  onTouchStart,
  onTouchEnd,
  radius,
  buttonSize,
}) => {
  // Calculate position using polar coordinates
  const radian = (config.angle - 90) * (Math.PI / 180); // -90 to start from top
  const x = Math.cos(radian) * radius;
  const y = Math.sin(radian) * radius;

  return (
    <button
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position: 'absolute',
        left: `calc(50% + ${x}px - ${buttonSize / 2}px)`,
        top: `calc(50% + ${y}px - ${buttonSize / 2}px)`,
        width: `${buttonSize}px`,
        height: `${buttonSize}px`,
        borderRadius: '50%',
        background: active
          ? `rgba(${KOREAN_COLORS.ACCENT_GOLD >> 16}, ${(KOREAN_COLORS.ACCENT_GOLD >> 8) & 0xff}, ${KOREAN_COLORS.ACCENT_GOLD & 0xff}, 0.9)`
          : 'rgba(0, 0, 0, 0.5)',
        border: `2px solid rgba(${KOREAN_COLORS.PRIMARY_CYAN >> 16}, ${(KOREAN_COLORS.PRIMARY_CYAN >> 8) & 0xff}, ${KOREAN_COLORS.PRIMARY_CYAN & 0xff}, ${active ? 1 : 0.6})`,
        fontSize: '20px',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'none',
        transition: 'all 0.1s ease',
        transform: active ? 'scale(1.1)' : 'scale(1)',
        boxShadow: active
          ? `0 0 15px rgba(${KOREAN_COLORS.ACCENT_GOLD >> 16}, ${(KOREAN_COLORS.ACCENT_GOLD >> 8) & 0xff}, ${KOREAN_COLORS.ACCENT_GOLD & 0xff}, 0.8)`
          : 'none',
      }}
      data-testid={`dpad-button-${config.direction}`}
    >
      {config.korean}
    </button>
  );
};

/**
 * VirtualDPad Component
 * 
 * 8-directional virtual D-Pad for touch-based movement control
 * Features:
 * - 8 directional buttons arranged in a circle
 * - Visual feedback on active direction
 * - Haptic feedback on touch
 * - Korean theming with cyberpunk aesthetics
 * - 44x44px minimum touch targets (iOS guideline)
 * 
 * Usage in Combat/Training:
 * - Provides tactical positioning and footwork
 * - Alternative to keyboard WASD controls
 * - Essential for mobile gameplay
 * 
 * @example
 * ```tsx
 * <VirtualDPad
 *   onMove={(direction, eventType) => {
 *     if (eventType === 'start' && direction) {
 *       handleMovement(direction);
 *     } else if (eventType === 'end') {
 *       stopMovement();
 *     }
 *   }}
 *   disabled={isPaused}
 *   size={120}
 * />
 * ```
 * 
 * @public
 * @korean 가상방향패드
 */
export const VirtualDPad: React.FC<VirtualDPadProps> = ({
  onMove,
  disabled = false,
  size = 120,
  bottom = 20,
  left = 20,
  opacity = 0.8,
}) => {
  const [activeDirection, setActiveDirection] = useState<Direction | null>(null);

  /**
   * Handle touch start on a direction button
   */
  const handleTouchStart = useCallback(
    (e: React.TouchEvent, direction: Direction) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      setActiveDirection(direction);
      onMove(direction, 'start');
      triggerHaptic('light');
    },
    [disabled, onMove]
  );

  /**
   * Handle touch end
   */
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      setActiveDirection(null);
      onMove(null, 'end');
    },
    [disabled, onMove]
  );

  // Calculate dimensions
  const buttonSize = Math.max(44, size * 0.3); // Minimum 44px for touch target
  const radius = (size - buttonSize) / 2;

  return (
    <Html fullscreen>
      <div
        style={{
          position: 'absolute',
          bottom: `${bottom}px`,
          left: `${left}px`,
          width: `${size}px`,
          height: `${size}px`,
          opacity: disabled ? 0.3 : opacity,
          pointerEvents: disabled ? 'none' : 'auto',
        }}
        data-testid="virtual-dpad"
      >
        {/* D-Pad Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '50%',
            border: `2px solid rgba(${KOREAN_COLORS.PRIMARY_CYAN >> 16}, ${(KOREAN_COLORS.PRIMARY_CYAN >> 8) & 0xff}, ${KOREAN_COLORS.PRIMARY_CYAN & 0xff}, 0.8)`,
            boxShadow: `0 0 20px rgba(${KOREAN_COLORS.PRIMARY_CYAN >> 16}, ${(KOREAN_COLORS.PRIMARY_CYAN >> 8) & 0xff}, ${KOREAN_COLORS.PRIMARY_CYAN & 0xff}, 0.3)`,
          }}
        >
          {/* Directional Buttons */}
          {DIRECTIONS.map((config) => (
            <DPadButton
              key={config.direction}
              config={config}
              active={activeDirection === config.direction}
              onTouchStart={(e) => handleTouchStart(e, config.direction)}
              onTouchEnd={handleTouchEnd}
              radius={radius}
              buttonSize={buttonSize}
            />
          ))}

          {/* Center Indicator */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: activeDirection
                ? `rgba(${KOREAN_COLORS.ACCENT_GOLD >> 16}, ${(KOREAN_COLORS.ACCENT_GOLD >> 8) & 0xff}, ${KOREAN_COLORS.ACCENT_GOLD & 0xff}, 0.9)`
                : `rgba(${KOREAN_COLORS.PRIMARY_CYAN >> 16}, ${(KOREAN_COLORS.PRIMARY_CYAN >> 8) & 0xff}, ${KOREAN_COLORS.PRIMARY_CYAN & 0xff}, 0.7)`,
              border: '2px solid #fff',
              transition: 'all 0.15s ease',
              boxShadow: activeDirection
                ? `0 0 15px rgba(${KOREAN_COLORS.ACCENT_GOLD >> 16}, ${(KOREAN_COLORS.ACCENT_GOLD >> 8) & 0xff}, ${KOREAN_COLORS.ACCENT_GOLD & 0xff}, 0.8)`
                : 'none',
            }}
            data-testid="dpad-center"
          />
        </div>
      </div>
    </Html>
  );
};
