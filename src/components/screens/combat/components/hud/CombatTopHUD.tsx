/**
 * CombatTopHUD - Slim top bar for combat screen
 *
 * Gaming Best Practice - Minimal Top Bar:
 * - Round indicator (left)
 * - Timer (center)
 * - Return to Menu button (right)
 *
 * Layout:
 * - Width: 100% of screen
 * - Height: Compact 60-80px (minimal obstruction)
 *
 * @korean 전투화면 상단 바 - 라운드, 타이머, 메뉴 복귀
 */

import React from "react";
import { UseCombatTimerReturn } from "../../../../../hooks/useCombatTimer";
import { HUD_HEIGHT } from "../../../../../types/LayoutTypes";
import { SPACING, TYPOGRAPHY, HIERARCHY, BORDERS, GRADIENTS, HUD_STYLE } from "../../../../../types/constants/designSystem";
import { CombatTimer } from "../../../../shared/ui/CombatTimer";
import { CombatReturnToMenuButton } from "../controls/CombatButtons";

export interface CombatTopHUDProps {
  /** Screen width for layout calculations */
  readonly width: number;
  /** Whether mobile layout is active */
  readonly isMobile: boolean;
  /** Position scale multiplier for large displays */
  readonly positionScale: number;
  /** Current round number */
  readonly currentRound: number;
  /** Max rounds in match */
  readonly totalRounds: number;
  /** Timer state from useCombatTimer hook */
  readonly timerState: UseCombatTimerReturn;
  /** Whether to show timer */
  readonly showTimer: boolean;
  /** Handler for returning to menu */
  readonly onReturnToMenu: () => void;
  /** Whether the game is paused */
  readonly isPaused: boolean;
}

/**
 * CombatTopHUD Component
 *
 * Slim top bar containing round info, timer, and return to menu button.
 */
export const CombatTopHUD: React.FC<CombatTopHUDProps> = ({
  width,
  isMobile,
  positionScale,
  currentRound,
  totalRounds,
  timerState,
  showTimer,
  onReturnToMenu,
  isPaused: _isPaused, // Reserved for future pause indicator
}) => {
  // Layout calculations for slim top bar
  const layout = React.useMemo(() => {
    const hudHeight = isMobile
      ? HUD_HEIGHT.COMBAT_TOP_MOBILE
      : HUD_HEIGHT.COMBAT_TOP_DESKTOP * positionScale;

    const padding = isMobile ? parseInt(SPACING.xs, 10) : parseInt(SPACING.sm, 10) * positionScale;
    const gap = isMobile ? parseInt(SPACING.xs, 10) : parseInt(SPACING.sm, 10) * positionScale;
    const fontSize = isMobile ? parseInt(TYPOGRAPHY.bodySmall.fontSize, 10) : parseInt(TYPOGRAPHY.body.fontSize, 10) * positionScale;
    const titleSize = isMobile ? parseInt(TYPOGRAPHY.body.fontSize, 10) : parseInt(TYPOGRAPHY.heading3.fontSize, 10) * positionScale;

    return {
      hudHeight,
      padding,
      gap,
      fontSize,
      titleSize,
      hudWidth: width,
    };
  }, [width, isMobile, positionScale]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${layout.hudHeight}px`,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: `${layout.padding}px ${layout.padding * 1.5}px`,
        pointerEvents: "none",
        boxSizing: "border-box",
        borderBottom: BORDERS.default,
        background: GRADIENTS.vertical(0.9),
        backdropFilter: "blur(8px)",
      }}
      data-testid="combat-top-hud"
    >
      {/* Left Section - Round Info */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          pointerEvents: "none",
          alignItems: "flex-start",
        }}
        data-testid="combat-top-hud-left-section"
      >
        {/* Title */}
        <div
          style={{
            fontSize: `${layout.titleSize}px`,
            fontWeight: 600,
            fontFamily: TYPOGRAPHY.heading2.fontFamily,
            color: HIERARCHY.gold.color,
            textShadow: HUD_STYLE.accentGlow,
          }}
        >
          전투 | Combat
        </div>

        {/* Round indicator */}
        <div
          style={{
            display: "flex",
            gap: `${layout.gap}px`,
            alignItems: "center",
            fontSize: `${layout.fontSize}px`,
            fontFamily: TYPOGRAPHY.body.fontFamily,
            color: HIERARCHY.accent.color,
          }}
        >
          <span>
            라운드 {currentRound}/{totalRounds}
          </span>
        </div>
      </div>

      {/* Center Section - Timer */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
        }}
        data-testid="combat-top-hud-center-section"
      >
        {showTimer && (
          <CombatTimer
            formattedTime={timerState.formattedTime}
            warningLevel={timerState.warningLevel}
            isTimeUp={timerState.isTimeUp}
            isMobile={isMobile}
            style={{ position: "relative", top: 0 }}
          />
        )}
      </div>

      {/* Right Section - Return to Menu */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          pointerEvents: "all",
        }}
        data-testid="combat-top-hud-right-section"
      >
        <CombatReturnToMenuButton
          onClick={onReturnToMenu}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default CombatTopHUD;
