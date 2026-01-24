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
 * - Height: Resolution-based ~6% of screen height (40-80px)
 *
 * @korean 전투화면 상단 바 - 라운드, 타이머, 메뉴 복귀
 */

import React from "react";
import { UseCombatTimerReturn } from "../../../../../hooks/useCombatTimer";
// No longer using HUD_HEIGHT - using resolution-based sizing
import { hexToRgbaString } from "../../../../../utils/colorUtils";
import {
  getHUDHeight,
  getResponsiveFontSize,
  getResponsivePadding,
  shouldShowMobileControls,
} from "../../../../../utils/responsiveLayout";
import { useKoreanTheme } from "../../../../shared/base/useKoreanTheme";
import { CombatTimer } from "../../../../shared/ui/CombatTimer";
import { CombatReturnToMenuButton } from "../controls/CombatButtons";

export interface CombatTopHUDProps {
  /** Screen width for layout calculations */
  readonly width: number;
  /** Screen height for layout calculations */
  readonly height: number;
  /** Whether mobile controls should be shown (NOT for sizing) */
  readonly isMobile?: boolean;
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
 * Uses resolution-based sizing for all dimensions.
 */
export const CombatTopHUD: React.FC<CombatTopHUDProps> = ({
  width,
  height,
  isMobile = false,
  positionScale,
  currentRound,
  totalRounds,
  timerState,
  showTimer,
  onReturnToMenu,
  isPaused: _isPaused, // Reserved for future pause indicator
}) => {
  // isMobile only used for mobile controls visibility
  const showMobileControls = shouldShowMobileControls(width, isMobile);

  const theme = useKoreanTheme({
    variant: "primary",
    size: "md",
    isMobile: showMobileControls,
  });

  // Layout calculations for slim top bar with resolution-based sizing
  const layout = React.useMemo(() => {
    // Resolution-based HUD height (6% of screen height, 40-80px range)
    const hudHeight = getHUDHeight(height, 0.06) * positionScale;

    // Resolution-based padding
    const padding = getResponsivePadding(width) * positionScale;
    
    // Resolution-based gap (slightly larger than padding)
    const gap = padding * 1.2;
    
    // Resolution-based font sizes
    const baseFontSize = getResponsiveFontSize(width) * positionScale;
    const fontSize = baseFontSize * 0.875; // Slightly smaller for body text
    const titleSize = baseFontSize * 1.125; // Larger for titles

    return {
      hudHeight,
      padding,
      gap,
      fontSize,
      titleSize,
      hudWidth: width,
    };
  }, [width, height, positionScale]);

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
        borderBottom: `2px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.4)}`,
        background: `linear-gradient(180deg, ${hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.9)} 0%, ${hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.7)} 100%)`,
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
            fontWeight: "bold",
            fontFamily: theme.koreanTypography.fontFamily,
            color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
            textShadow: `0 0 10px ${hexToRgbaString(theme.colors.ACCENT_GOLD, 0.5)}`,
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
            fontFamily: theme.koreanTypography.fontFamily,
            color: hexToRgbaString(theme.colors.PRIMARY_CYAN, 1),
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
            isMobile={showMobileControls}
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
          isMobile={showMobileControls}
        />
      </div>
    </div>
  );
};

export default CombatTopHUD;
