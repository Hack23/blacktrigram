/**
 * VirtualDPad Component
 * 
 * 8-directional virtual D-Pad for mobile touch controls
 * Provides tactile movement control with visual feedback and haptic response
 * 
 * WCAG 2.1 Level AA Compliance:
 * - ARIA labels for all 8 directions
 * - Keyboard navigation (Arrow keys)
 * - Visible focus indicators (2px cyan border)
 * - role="group" with descriptive label
 * - 48x48px minimum touch targets
 * 
 * @module components/mobile/VirtualDPad
 * @category Mobile Controls
 * @korean 가상 방향 패드
 */

import { Html } from '@react-three/drei';
import React, { useCallback, useState, useMemo } from 'react';
import { KOREAN_COLORS } from '../../types/constants';
import { triggerHaptic } from '../../utils/haptics';
import { getColorRGB } from '../../utils/colorHelpers';
import { handleKeyboardNav, getFocusStyle } from '../../utils/accessibility';
import { createBilingualLabel } from '../../types/AccessibilityTypes';
import { useThrottle } from '../../hooks/useThrottle';

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
  /** Size of the D-Pad in pixels (default: 140) */
  readonly size?: number;
  /** Position from bottom in pixels (default: 34 for safe area) */
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
  readonly englishLabel: string; // English label for ARIA
}

/**
 * 8-directional configuration
 * Arranged clockwise starting from up (0°)
 */
const DIRECTIONS: readonly DirectionConfig[] = [
  { direction: 'up', angle: 0, korean: '↑', englishLabel: 'Up' },
  { direction: 'up-right', angle: 45, korean: '↗', englishLabel: 'Up Right' },
  { direction: 'right', angle: 90, korean: '→', englishLabel: 'Right' },
  { direction: 'down-right', angle: 135, korean: '↘', englishLabel: 'Down Right' },
  { direction: 'down', angle: 180, korean: '↓', englishLabel: 'Down' },
  { direction: 'down-left', angle: 225, korean: '↙', englishLabel: 'Down Left' },
  { direction: 'left', angle: 270, korean: '←', englishLabel: 'Left' },
  { direction: 'up-left', angle: 315, korean: '↖', englishLabel: 'Up Left' },
] as const;

/**
 * Individual D-Pad button component
 */
interface DPadButtonProps {
  readonly config: DirectionConfig;
  readonly active: boolean;
  readonly focused: boolean;
  readonly onStart: (e: React.TouchEvent | React.MouseEvent) => void;
  readonly onEnd: (e: React.TouchEvent | React.MouseEvent) => void;
  readonly onKeyDown: (e: React.KeyboardEvent) => void;
  readonly onFocus: () => void;
  readonly onBlur: () => void;
  readonly radius: number; // Radius for button positioning
  readonly buttonSize: number;
}

/**
 * D-Pad button positioned around the center
 * Memoized to prevent unnecessary re-renders
 */
const DPadButton = React.memo<DPadButtonProps>(({
  config,
  active,
  focused,
  onStart,
  onEnd,
  onKeyDown,
  onFocus,
  onBlur,
  radius,
  buttonSize,
}) => {
  // Calculate position using polar coordinates
  const radian = (config.angle - 90) * (Math.PI / 180); // -90 to start from top
  const x = Math.cos(radian) * radius;
  const y = Math.sin(radian) * radius;

  // Extract RGB colors using shared utility
  const goldColor = getColorRGB(KOREAN_COLORS.ACCENT_GOLD);
  const primaryColor = getColorRGB(KOREAN_COLORS.PRIMARY_CYAN);

  const ariaLabel = createBilingualLabel(
    `이동 ${config.korean}`,
    `Move ${config.englishLabel}`
  ).label;

  return (
    <button
      onTouchStart={onStart}
      onTouchEnd={onEnd}
      onMouseDown={onStart}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      style={{
        position: 'absolute',
        left: `calc(50% + ${x}px - ${buttonSize / 2}px)`,
        top: `calc(50% + ${y}px - ${buttonSize / 2}px)`,
        width: `${buttonSize}px`,
        height: `${buttonSize}px`,
        borderRadius: '50%',
        background: active
          ? `rgba(${goldColor.r}, ${goldColor.g}, ${goldColor.b}, 0.9)`
          : 'rgba(0, 0, 0, 0.5)',
        border: focused
          ? `3px solid rgb(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b})`
          : `2px solid rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${active ? 1 : 0.6})`,
        fontSize: '20px',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'none',
        transition: 'transform 0.2s ease, opacity 0.2s ease',
        transform: active ? 'scale(1.1)' : 'scale(1)',
        boxShadow: focused
          ? `0 0 0 4px rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.5), 0 0 15px rgba(${goldColor.r}, ${goldColor.g}, ${goldColor.b}, 0.8)`
          : active
          ? `0 0 15px rgba(${goldColor.r}, ${goldColor.g}, ${goldColor.b}, 0.8)`
          : 'none',
        ...getFocusStyle(focused),
      }}
      aria-label={ariaLabel}
      aria-pressed={active}
      role="button"
      tabIndex={0}
      data-testid={`dpad-button-${config.direction}`}
    >
      {config.korean}
    </button>
  );
}, (prevProps, nextProps) => {
  // Only re-render if active or focused state changes
  // config.direction comparison removed as config is a stable reference
  return prevProps.active === nextProps.active &&
         prevProps.focused === nextProps.focused;
});

DPadButton.displayName = "DPadButton";

/**
 * VirtualDPad Component
 * 
 * 8-directional virtual D-Pad for touch-based movement control
 * Features:
 * - 8 directional buttons arranged in a circle
 * - Visual feedback on active direction
 * - Haptic feedback on touch
 * - Korean theming with cyberpunk aesthetics
 * - 48x48px minimum touch targets (improved from iOS 44px guideline)
 * - 140x140px default size for better mobile usability
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
 *   size={140}
 *   bottom={34}
 * />
 * ```
 * 
 * @public
 * @korean 가상방향패드
 */
const VirtualDPadComponent: React.FC<VirtualDPadProps> = ({
  onMove,
  disabled = false,
  size = 140,
  bottom = 34,
  left = 20,
  opacity = 0.8,
}) => {
  const [activeDirection, setActiveDirection] = useState<Direction | null>(null);
  const [focusedDirection, setFocusedDirection] = useState<Direction | null>(null);

  // Throttle onMove callbacks to ~60fps for performance
  const throttledOnMove = useThrottle(onMove, 16);

  /**
   * Handle touch or mouse start on a direction button
   * Throttled for performance
   */
  const handleStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent, direction: Direction) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      setActiveDirection(direction);
      throttledOnMove(direction, 'start');
      triggerHaptic('light');
    },
    [disabled, throttledOnMove]
  );

  /**
   * Handle touch or mouse end
   * Throttled for performance
   */
  const handleEnd = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      setActiveDirection(null);
      throttledOnMove(null, 'end');
    },
    [disabled, throttledOnMove]
  );

  /**
   * Handle keyboard navigation for D-Pad
   */
  const handleKeyDown = useCallback(
    (direction: Direction) => (e: React.KeyboardEvent) => {
      if (disabled) return;
      handleKeyboardNav(e.nativeEvent, {
        onActivate: () => {
          setActiveDirection(direction);
          throttledOnMove(direction, 'start');
          triggerHaptic('light');
          // Release after brief delay
          setTimeout(() => {
            setActiveDirection(null);
            throttledOnMove(null, 'end');
          }, 150);
        },
      });
    },
    [disabled, throttledOnMove]
  );

  // Memoize calculated dimensions to avoid recalculation
  const dimensions = useMemo(() => ({
    buttonSize: Math.max(48, size * 0.3),
    radius: (size - Math.max(48, size * 0.3)) / 2,
  }), [size]);

  // Memoize color values
  const colors = useMemo(() => ({
    primary: getColorRGB(KOREAN_COLORS.PRIMARY_CYAN),
    gold: getColorRGB(KOREAN_COLORS.ACCENT_GOLD),
  }), []);

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
            border: `2px solid rgba(${colors.primary.r}, ${colors.primary.g}, ${colors.primary.b}, 0.8)`,
            boxShadow: `0 0 20px rgba(${colors.primary.r}, ${colors.primary.g}, ${colors.primary.b}, 0.3)`,
          }}
          role="group"
          aria-label={createBilingualLabel('방향 패드', 'Directional Pad').label}
        >
          {/* Directional Buttons */}
          {DIRECTIONS.map((config) => (
            <DPadButton
              key={config.direction}
              config={config}
              active={activeDirection === config.direction}
              focused={focusedDirection === config.direction}
              onStart={(e) => handleStart(e, config.direction)}
              onEnd={handleEnd}
              onKeyDown={handleKeyDown(config.direction)}
              onFocus={() => setFocusedDirection(config.direction)}
              onBlur={() => setFocusedDirection(null)}
              radius={dimensions.radius}
              buttonSize={dimensions.buttonSize}
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
                ? `rgba(${colors.gold.r}, ${colors.gold.g}, ${colors.gold.b}, 0.9)`
                : `rgba(${colors.primary.r}, ${colors.primary.g}, ${colors.primary.b}, 0.7)`,
              border: '2px solid #fff',
              transition: 'transform 0.15s ease, opacity 0.15s ease',
              boxShadow: activeDirection
                ? `0 0 15px rgba(${colors.gold.r}, ${colors.gold.g}, ${colors.gold.b}, 0.8)`
                : 'none',
            }}
            data-testid="dpad-center"
          />
        </div>
      </div>
    </Html>
  );
};

/**
 * Memoized VirtualDPad with custom comparison
 * Only re-renders when props change
 */
export const VirtualDPad = React.memo(
  VirtualDPadComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.disabled === nextProps.disabled &&
      prevProps.size === nextProps.size &&
      prevProps.bottom === nextProps.bottom &&
      prevProps.left === nextProps.left &&
      prevProps.opacity === nextProps.opacity &&
      prevProps.onMove === nextProps.onMove
    );
  }
);

VirtualDPad.displayName = "VirtualDPad";
