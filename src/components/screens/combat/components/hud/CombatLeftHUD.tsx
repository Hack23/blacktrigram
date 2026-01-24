/**
 * CombatLeftHUD - Left side HUD for combat screen (Player 1)
 *
 * REUSES existing components:
 * - PlayerHUD: Archetype image, name, health/stamina bars
 * - SpeedIndicatorHUD: Movement speed percentage
 * - BodyPartHealthDisplay: Individual body part health bars
 * - GuardIndicator: Current stance guard status
 *
 * Gaming Layout Best Practice:
 * - Width: 14% of screen (mobile: 18%)
 * - Height: 100% minus top/bottom HUD heights
 * - Leaves 72% center for arena
 *
 * @korean 전투화면 왼쪽 HUD - 플레이어 1 상태
 */

import React from "react";
import { PlayerState } from "../../../../../systems";
import type { StanceLaterality } from "../../../../../systems/trigram/types";
import {
  HUD_WIDTH_PERCENT,
  HUD_HEIGHT,
} from "../../../../../types/LayoutTypes";
import { hexToRgbaString } from "../../../../../utils/colorUtils";
import { useKoreanTheme } from "../../../../shared/base/useKoreanTheme";
import { GuardIndicator } from "../../../../shared/three/indicators/GuardIndicator";
import { PlayerHUD } from "../../../../shared/three/ui/PlayerHUD";
import { SpeedIndicatorHUD } from "../../../../shared/three/ui/SpeedIndicatorHUD";
import { BodyPartHealthDisplay } from "../../../../shared/three/ui/BodyPartHealthDisplay";

export interface CombatLeftHUDProps {
  /** Screen width for layout calculations */
  readonly width: number;
  /** Screen height for layout calculations */
  readonly height: number;
  /** Whether mobile layout is active */
  readonly isMobile: boolean;
  /** Position scale multiplier for large displays */
  readonly positionScale: number;
  /** Player 1 state */
  readonly player: PlayerState;
  /** Player laterality (left/right foot forward) */
  readonly laterality: StanceLaterality;
  /** Whether player is in guard stance */
  readonly isInGuard: boolean;
  /** Player speed modifiers */
  readonly speedModifiers: {
    finalSpeed: number;
    baseSpeed: number;
  };
}

/**
 * CombatLeftHUD Component
 *
 * Left side of the combat screen containing Player 1's stats.
 * Takes 14% of screen width (18% on mobile), positioned between top and bottom HUDs.
 * REUSES existing PlayerHUD, SpeedIndicatorHUD, BodyPartHealthDisplay components.
 */
export const CombatLeftHUD: React.FC<CombatLeftHUDProps> = ({
  width,
  height,
  isMobile,
  positionScale,
  player,
  laterality,
  isInGuard,
  speedModifiers,
}) => {
  const theme = useKoreanTheme({
    variant: "primary",
    size: "md",
    isMobile,
  });

  // Layout calculations for left HUD with proper gaming proportions
  const layout = React.useMemo(() => {
    // Width: 14-18% of screen
    const hudWidthPercent = isMobile
      ? HUD_WIDTH_PERCENT.LEFT_MOBILE
      : HUD_WIDTH_PERCENT.LEFT_DESKTOP;
    const hudWidth = Math.round(width * hudWidthPercent);

    // Scale factors for 4K (positionScale: 1.0-1.5)
    const scaledTopHeight = isMobile
      ? HUD_HEIGHT.COMBAT_TOP_MOBILE
      : HUD_HEIGHT.COMBAT_TOP_DESKTOP * positionScale;
    const scaledBottomHeight = isMobile
      ? HUD_HEIGHT.COMBAT_BOTTOM_MOBILE
      : HUD_HEIGHT.COMBAT_BOTTOM_DESKTOP * positionScale;

    // Calculate available height between top and bottom HUDs
    const topOffset = scaledTopHeight;
    const bottomOffset = scaledBottomHeight;
    const availableHeight = height - topOffset - bottomOffset;

    // Internal padding
    const padding = isMobile ? 8 : 12 * positionScale;
    const gap = isMobile ? 10 : 14 * positionScale;

    return {
      hudWidth,
      topOffset,
      bottomOffset,
      availableHeight,
      padding,
      gap,
    };
  }, [width, height, isMobile, positionScale]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: `${layout.topOffset}px`,
        width: `${layout.hudWidth}px`,
        height: `${layout.availableHeight}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        pointerEvents: "none",
        padding: `${layout.padding}px`,
        boxSizing: "border-box",
        gap: `${layout.gap}px`,
        // Cyberpunk border - right edge only for left HUD
        borderRight: `2px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.4)}`,
        background: `linear-gradient(90deg, ${hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.85)} 0%, ${hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.4)} 100%)`,
        backdropFilter: "blur(8px)",
        overflow: "hidden",
      }}
      data-testid="combat-left-hud"
    >
      {/* Player 1 Stats - REUSING PlayerHUD component with embedded positioning */}
      <div
        style={{
          pointerEvents: "none",
          position: "relative",
        }}
        data-testid="combat-left-hud-player-section"
      >
        <PlayerHUD
          player={player}
          position="left"
          isMobile={isMobile}
          laterality={laterality}
        />
      </div>

      {/* Speed Indicator - REUSING SpeedIndicatorHUD component */}
      <div
        style={{
          pointerEvents: "none",
          position: "relative",
        }}
        data-testid="combat-left-hud-speed-section"
      >
        <SpeedIndicatorHUD
          finalSpeed={speedModifiers.finalSpeed}
          baseSpeed={speedModifiers.baseSpeed}
          position="left"
          isMobile={isMobile}
          visible={true}
        />
      </div>

      {/* Body Part Health - REUSING BodyPartHealthDisplay component */}
      {player.bodyPartHealth && (
        <div
          style={{
            pointerEvents: "none",
            position: "relative",
          }}
          data-testid="combat-left-hud-bodypart-section"
        >
          <BodyPartHealthDisplay
            bodyPartHealth={player.bodyPartHealth}
            playerId={player.id}
            position="left"
            isMobile={isMobile}
          />
        </div>
      )}

      {/* Guard Indicator - at bottom of HUD */}
      <div
        style={{
          pointerEvents: "none",
          marginTop: "auto",
          position: "relative",
        }}
        data-testid="combat-left-hud-guard-section"
      >
        <GuardIndicator
          currentStance={player.currentStance}
          isInGuard={isInGuard}
          position="left"
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default CombatLeftHUD;
