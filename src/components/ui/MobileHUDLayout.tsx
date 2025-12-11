/**
 * MobileHUDLayout Component
 * 
 * Mobile-optimized HUD layout for combat screens
 * Designed for touch-friendly interfaces with strategic element positioning
 * 
 * Features:
 * - Touch targets ≥44x44px (iOS guideline)
 * - Font sizes ≥14px body, ≥16px important text
 * - Safe area inset support
 * - Portrait and landscape mode optimization
 * - Simplified layout for small screens
 * 
 * @module components/ui/MobileHUDLayout
 * @category Mobile UI
 * @korean 모바일HUD레이아웃
 */

import { Html } from '@react-three/drei';
import React, { useMemo } from 'react';
import { PlayerState } from '../../systems';
import { KOREAN_COLORS, FONT_FAMILY } from '../../types/constants';
import { useWindowSize } from '../../hooks/useWindowSize';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import {
  calculateHUDHeight,
  calculateProgressBarSize,
  isValidTouchTarget,
} from '../../utils/responsiveLayout';

/**
 * Props for MobileHUDLayout component
 */
export interface MobileHUDLayoutProps {
  /** Player 1 state */
  readonly player1: PlayerState;
  /** Player 2 state */
  readonly player2: PlayerState;
  /** Time remaining in seconds */
  readonly timeRemaining: number;
  /** Current round number */
  readonly currentRound: number;
  /** Maximum rounds */
  readonly maxRounds: number;
  /** Rounds won by each player */
  readonly roundsWon?: { player1: number; player2: number };
  /** Whether game is paused */
  readonly isPaused?: boolean;
  /** Test ID for testing */
  readonly testId?: string;
}

/**
 * Mobile health bar component
 * Optimized for touch interaction and visibility
 */
interface MobileHealthBarProps {
  readonly player: PlayerState;
  readonly side: 'left' | 'right';
  readonly layout: ReturnType<typeof useResponsiveLayout>;
  readonly barSize: { width: number; height: number };
}

const MobileHealthBar: React.FC<MobileHealthBarProps> = ({
  player,
  side,
  layout,
  barSize,
}) => {
  const healthPercent = (player.health / player.maxHealth) * 100;
  const isLowHealth = healthPercent < 30;

  // Validate touch target
  const isValidTouch = isValidTouchTarget(barSize.width, barSize.height);
  const actualHeight = Math.max(barSize.height, 44); // Ensure minimum

  return (
    <div
      style={{
        position: 'absolute',
        [side]: layout.spacing.md,
        top: layout.safeArea.top + layout.spacing.sm,
        width: barSize.width,
        display: 'flex',
        flexDirection: 'column',
        gap: layout.spacing.xs,
      }}
      data-testid={`mobile-health-${side}`}
      data-valid-touch={isValidTouch}
    >
      {/* Player Name */}
      <div
        style={{
          fontSize: layout.fontSize.small,
          fontFamily: FONT_FAMILY.KOREAN,
          color: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(6, '0')}`,
          fontWeight: 'bold',
          textShadow: '0 0 4px rgba(0,0,0,0.8)',
        }}
      >
        {player.archetype}
      </div>

      {/* Health Bar */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: actualHeight,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: layout.spacing.xs,
          border: `2px solid #${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, '0')}`,
          overflow: 'hidden',
          boxShadow: isLowHealth
            ? `0 0 10px rgba(255, 0, 0, 0.6)`
            : 'none',
        }}
        data-testid={`health-bar-${side}`}
      >
        {/* Health Fill */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${healthPercent}%`,
            height: '100%',
            backgroundColor: isLowHealth
              ? `#${KOREAN_COLORS.ACCENT_RED.toString(16).padStart(6, '0')}`
              : `#${KOREAN_COLORS.HEALTH_FULL.toString(16).padStart(6, '0')}`,
            transition: 'width 0.3s ease, background-color 0.3s ease',
          }}
        />

        {/* Health Text */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: layout.fontSize.body,
            fontFamily: FONT_FAMILY.KOREAN,
            color: '#ffffff',
            fontWeight: 'bold',
            textShadow: '0 0 4px rgba(0,0,0,0.9)',
            pointerEvents: 'none',
          }}
        >
          {Math.ceil(player.health)} / {player.maxHealth}
        </div>
      </div>

      {/* Stamina Bar - Smaller */}
      <div
        style={{
          width: '100%',
          height: Math.max(layout.spacing.lg, 20),
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: layout.spacing.xs / 2,
          border: `1px solid #${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, '0')}`,
          overflow: 'hidden',
        }}
        data-testid={`stamina-bar-${side}`}
      >
        <div
          style={{
            width: `${(player.stamina / player.maxStamina) * 100}%`,
            height: '100%',
            backgroundColor: `#${KOREAN_COLORS.STAMINA_FULL.toString(16).padStart(6, '0')}`,
            transition: 'width 0.2s ease',
          }}
        />
      </div>
    </div>
  );
};

/**
 * Mobile timer component
 * Centered at top with large, readable font
 */
interface MobileTimerProps {
  readonly timeRemaining: number;
  readonly currentRound: number;
  readonly maxRounds: number;
  readonly layout: ReturnType<typeof useResponsiveLayout>;
}

const MobileTimer: React.FC<MobileTimerProps> = ({
  timeRemaining,
  currentRound,
  maxRounds,
  layout,
}) => {
  const isLowTime = timeRemaining < 10;

  return (
    <div
      style={{
        position: 'absolute',
        top: layout.safeArea.top + layout.spacing.sm,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: layout.spacing.xs,
      }}
      data-testid="mobile-timer"
    >
      {/* Round Display */}
      <div
        style={{
          fontSize: layout.fontSize.small,
          fontFamily: FONT_FAMILY.KOREAN,
          color: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, '0')}`,
          fontWeight: 'bold',
          textShadow: '0 0 4px rgba(0,0,0,0.8)',
        }}
      >
        R{currentRound}/{maxRounds}
      </div>

      {/* Timer */}
      <div
        style={{
          fontSize: layout.fontSize.hud,
          fontFamily: FONT_FAMILY.KOREAN,
          color: isLowTime
            ? `#${KOREAN_COLORS.ACCENT_RED.toString(16).padStart(6, '0')}`
            : `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(6, '0')}`,
          fontWeight: 'bold',
          textShadow: isLowTime
            ? '0 0 8px rgba(255, 0, 0, 0.8)'
            : '0 0 4px rgba(0,0,0,0.8)',
          animation: isLowTime ? 'pulse 1s infinite' : 'none',
        }}
        data-testid="timer-value"
      >
        {Math.ceil(timeRemaining)}s
      </div>
    </div>
  );
};

/**
 * MobileHUDLayout Component
 * 
 * Optimized HUD layout for mobile combat gameplay
 * Automatically adjusts for:
 * - iPhone SE (375x667)
 * - iPhone 11/12/13 (414x896)
 * - Portrait and landscape orientations
 * 
 * Design Principles:
 * - Essential information only (health, timer, rounds)
 * - Touch-friendly element sizing (≥44px)
 * - High contrast for outdoor visibility
 * - Minimal screen real estate usage
 * - Safe area aware positioning
 * 
 * @example
 * ```tsx
 * <MobileHUDLayout
 *   player1={player1State}
 *   player2={player2State}
 *   timeRemaining={90}
 *   currentRound={1}
 *   maxRounds={3}
 * />
 * ```
 * 
 * @public
 * @korean 모바일HUD레이아웃
 */
export const MobileHUDLayout: React.FC<MobileHUDLayoutProps> = ({
  player1,
  player2,
  timeRemaining,
  currentRound,
  maxRounds,
  // roundsWon - reserved for future round indicator dots
  isPaused = false,
  testId = 'mobile-hud-layout',
}) => {
  const { width, height } = useWindowSize();
  const layout = useResponsiveLayout(width, height);

  // Note: roundsWon parameter is available for future round indicator dots UI
  // Currently, round info is shown in timer component

  // Calculate optimal HUD dimensions
  const hudHeight = useMemo(
    () => calculateHUDHeight(width, height, layout.isLandscape),
    [width, height, layout.isLandscape]
  );

  // Calculate progress bar sizes
  const healthBarSize = useMemo(
    () => calculateProgressBarSize(layout.isMobile, 'health'),
    [layout.isMobile]
  );

  return (
    <Html fullscreen>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: hudHeight,
          pointerEvents: 'none',
        }}
        data-testid={testId}
        data-mobile={layout.isMobile}
        data-landscape={layout.isLandscape}
      >
        {/* Player 1 HUD - Left Side */}
        <MobileHealthBar
          player={player1}
          side="left"
          layout={layout}
          barSize={healthBarSize}
        />

        {/* Timer and Round Info - Center */}
        <MobileTimer
          timeRemaining={timeRemaining}
          currentRound={currentRound}
          maxRounds={maxRounds}
          layout={layout}
        />

        {/* Player 2 HUD - Right Side */}
        <MobileHealthBar
          player={player2}
          side="right"
          layout={layout}
          barSize={healthBarSize}
        />

        {/* Pause Indicator */}
        {isPaused && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: layout.fontSize.hero,
              fontFamily: FONT_FAMILY.KOREAN,
              color: `#${KOREAN_COLORS.ACCENT_RED.toString(16).padStart(6, '0')}`,
              fontWeight: 'bold',
              textShadow: '0 0 10px rgba(0,0,0,0.9)',
              pointerEvents: 'none',
            }}
            data-testid="pause-indicator"
          >
            일시정지 | PAUSED
          </div>
        )}

        {/* Global pulse animation */}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
        `}</style>
      </div>
    </Html>
  );
};

MobileHUDLayout.displayName = 'MobileHUDLayout';
