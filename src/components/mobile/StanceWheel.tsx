/**
 * StanceWheel Component
 * 
 * Circular 8-segment stance selector for mobile touch controls
 * Provides visual and tactile stance switching interface
 * 
 * @module components/mobile/StanceWheel
 * @category Mobile Controls
 * @korean 자세 휠
 */

import { Html } from '@react-three/drei';
import React, { useCallback, useState } from 'react';
import { KOREAN_COLORS } from '../../types/constants';
import { TRIGRAM_STANCES_ORDER } from '../../systems/trigram/types';
import { TrigramStance } from '../../types/common';
import { triggerHaptic } from '../../utils/haptics';
import { getColorRGB } from '../../utils/colorHelpers';

/**
 * Props for StanceWheel component
 */
export interface StanceWheelProps {
  /** Current stance index (0-7) */
  readonly currentStance: number;
  /** Callback when stance changes */
  readonly onStanceChange: (stanceIndex: number) => void;
  /** Whether wheel is expanded */
  readonly expanded: boolean;
  /** Callback to toggle expansion */
  readonly onToggle: () => void;
  /** Whether wheel is disabled */
  readonly disabled?: boolean;
  /** Position from bottom in pixels (default: 34 when collapsed, 100 when expanded for safe area) */
  readonly bottom?: number;
  /** Opacity of wheel (default: 0.8) */
  readonly opacity?: number;
}

/**
 * Trigram symbols for each stance
 */
const TRIGRAM_SYMBOLS = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'] as const;

/**
 * Korean names for each stance
 */
const STANCE_KOREAN_NAMES = [
  '건', // Geon - Heaven
  '태', // Tae - Lake
  '리', // Li - Fire
  '진', // Jin - Thunder
  '손', // Son - Wind
  '감', // Gam - Water
  '간', // Gan - Mountain
  '곤', // Gon - Earth
] as const;

/**
 * Get color for a specific stance
 */
const getStanceColor = (stance: TrigramStance): number => {
  const stanceColors: Record<TrigramStance, number> = {
    geon: 0xffd700, // Gold - Heaven
    tae: 0x00ffff, // Cyan - Lake
    li: 0xff4444, // Red - Fire
    jin: 0xffaa00, // Orange - Thunder
    son: 0x88ff88, // Light Green - Wind
    gam: 0x0088ff, // Blue - Water
    gan: 0x8844ff, // Purple - Mountain
    gon: 0xaa6644, // Brown - Earth
  };
  return stanceColors[stance] ?? KOREAN_COLORS.PRIMARY_CYAN;
};

/**
 * StanceWheel Component
 * 
 * Circular stance selector with 8 segments for trigram stances
 * Features:
 * - Expandable/collapsible interface
 * - Visual stance indicator when collapsed (60x60px)
 * - 8 touch-optimized stance buttons when expanded (50x50px each)
 * - 200px wheel diameter with safe positioning
 * - Korean trigram symbols and names
 * - Color-coded by stance element
 * - Haptic feedback on selection
 * - 50x50px minimum touch targets
 * 
 * Usage in Combat:
 * - Tap collapsed indicator to expand wheel
 * - Select from 8 trigram stances
 * - Current stance highlighted with gold accent
 * - Tap current stance to collapse wheel
 * 
 * @example
 * ```tsx
 * <StanceWheel
 *   currentStance={player.stance}
 *   onStanceChange={(index) => handleStanceChange(index)}
 *   expanded={wheelExpanded}
 *   onToggle={() => setWheelExpanded(!wheelExpanded)}
 *   disabled={isPaused}
 * />
 * ```
 * 
 * @public
 * @korean 자세휠
 */
export const StanceWheel: React.FC<StanceWheelProps> = ({
  currentStance,
  onStanceChange,
  expanded,
  onToggle,
  disabled = false,
  bottom,
  opacity = 0.8,
}) => {
  const [hoveredStance, setHoveredStance] = useState<number | null>(null);

  /**
   * Handle stance selection (touch or mouse)
   */
  const handleStanceSelect = useCallback(
    (e: React.TouchEvent | React.MouseEvent, stanceIndex: number) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      // Don't allow selecting the same stance
      if (stanceIndex === currentStance) {
        // Collapse wheel if tapping current stance
        onToggle();
        triggerHaptic('light');
        return;
      }

      onStanceChange(stanceIndex);
      triggerHaptic('medium');

      // Auto-collapse after selection (optional)
      // onToggle();
    },
    [disabled, currentStance, onStanceChange, onToggle]
  );

  /**
   * Handle wheel toggle (touch or mouse)
   */
  const handleToggle = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      onToggle();
      triggerHaptic('light');
    },
    [disabled, onToggle]
  );

  // Dynamic bottom position with safe area consideration
  const dynamicBottom = bottom ?? (expanded ? 100 : 34);

  // Get RGB values for colors using shared utility
  const currentStanceColor = getColorRGB(getStanceColor(TRIGRAM_STANCES_ORDER[currentStance]));
  const goldColor = getColorRGB(KOREAN_COLORS.ACCENT_GOLD);
  const primaryColor = getColorRGB(KOREAN_COLORS.PRIMARY_CYAN);

  if (expanded) {
    // Expanded: Show full 8-segment wheel
    const wheelSize = 200;
    const segmentAngle = 360 / 8;

    return (
      <Html fullscreen>
        <div
          style={{
            position: 'absolute',
            bottom: `${dynamicBottom}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: disabled ? 0.3 : opacity,
            pointerEvents: disabled ? 'none' : 'auto',
            transition: 'all 0.3s ease',
          }}
          data-testid="stance-wheel-expanded"
        >
          <div
            style={{
              width: `${wheelSize}px`,
              height: `${wheelSize}px`,
              position: 'relative',
            }}
          >
            {/* Stance buttons arranged in circle */}
            {TRIGRAM_STANCES_ORDER.map((stance, index) => {
              const angle = index * segmentAngle;
              const radian = (angle - 90) * (Math.PI / 180); // -90 to start from top
              const x = Math.cos(radian) * 80 + 100;
              const y = Math.sin(radian) * 80 + 100;
              const isActive = index === currentStance;
              const isHovered = index === hoveredStance;
              const stanceColor = getColorRGB(getStanceColor(stance));

              return (
                <button
                  key={stance}
                  onTouchStart={(e) => handleStanceSelect(e, index)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setHoveredStance(null);
                  }}
                  onMouseDown={(e) => handleStanceSelect(e, index)}
                  onMouseEnter={() => setHoveredStance(index)}
                  onMouseLeave={() => setHoveredStance(null)}
                  style={{
                    position: 'absolute',
                    left: `${x - 25}px`,
                    top: `${y - 25}px`,
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: isActive
                      ? `rgba(${goldColor.r}, ${goldColor.g}, ${goldColor.b}, 0.95)`
                      : `rgba(${stanceColor.r}, ${stanceColor.g}, ${stanceColor.b}, 0.8)`,
                    border: `3px solid ${isActive ? '#fff' : `rgba(${stanceColor.r}, ${stanceColor.g}, ${stanceColor.b}, 1)`}`,
                    fontSize: '24px',
                    color: isActive ? '#000' : '#fff',
                    fontWeight: 'bold',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    touchAction: 'none',
                    transition: 'all 0.15s ease',
                    transform: isActive || isHovered ? 'scale(1.15)' : 'scale(1)',
                    boxShadow: isActive
                      ? `0 0 25px rgba(${goldColor.r}, ${goldColor.g}, ${goldColor.b}, 0.9)`
                      : isHovered
                      ? `0 0 15px rgba(${stanceColor.r}, ${stanceColor.g}, ${stanceColor.b}, 0.8)`
                      : `0 4px 10px rgba(0, 0, 0, 0.5)`,
                  }}
                  data-testid={`stance-button-${index}`}
                >
                  <div style={{ fontSize: '20px', lineHeight: 1 }}>{TRIGRAM_SYMBOLS[index]}</div>
                  <div style={{ fontSize: '8px', marginTop: '2px' }}>{STANCE_KOREAN_NAMES[index]}</div>
                </button>
              );
            })}

            {/* Center label */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '12px',
                color: `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.9)`,
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
                fontWeight: 'bold',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              자세 선택
              <br />
              <span style={{ fontSize: '10px' }}>Stance</span>
            </div>
          </div>
        </div>
      </Html>
    );
  }

  // Collapsed: Show current stance indicator
  return (
    <Html fullscreen>
      <div
        style={{
          position: 'absolute',
          bottom: `${dynamicBottom}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: disabled ? 0.3 : opacity,
          pointerEvents: disabled ? 'none' : 'auto',
          transition: 'all 0.3s ease',
        }}
        data-testid="stance-wheel-collapsed"
      >
        <button
          onTouchStart={handleToggle}
          onMouseDown={handleToggle}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: `rgba(${currentStanceColor.r}, ${currentStanceColor.g}, ${currentStanceColor.b}, 0.9)`,
            border: `3px solid rgba(${goldColor.r}, ${goldColor.g}, ${goldColor.b}, 0.9)`,
            fontSize: '28px',
            color: '#fff',
            fontWeight: 'bold',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            touchAction: 'none',
            transition: 'all 0.15s ease',
            boxShadow: `0 4px 15px rgba(0, 0, 0, 0.6), 0 0 20px rgba(${currentStanceColor.r}, ${currentStanceColor.g}, ${currentStanceColor.b}, 0.6)`,
          }}
          disabled={disabled}
          data-testid="stance-wheel-toggle"
        >
          <div style={{ fontSize: '24px', lineHeight: 1 }}>{TRIGRAM_SYMBOLS[currentStance]}</div>
          <div style={{ fontSize: '10px', marginTop: '2px' }}>{STANCE_KOREAN_NAMES[currentStance]}</div>
        </button>
      </div>
    </Html>
  );
};
