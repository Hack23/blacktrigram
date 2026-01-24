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
 * - Width: Resolution-based 14-18% of screen
 * - Height: 100% minus top/bottom HUD heights
 * - Leaves 72% center for arena
 *
 * Now uses shared HUD utilities with resolution-based sizing.
 *
 * @korean 전투화면 왼쪽 HUD - 플레이어 1 상태
 */

import React from "react";
import { useHUDLayout } from "../../../../../hooks/useHUDLayout";
import { PlayerState } from "../../../../../systems";
import type { StanceLaterality } from "../../../../../systems/trigram/types";
import { BaseHUDContainer } from "../../../../shared/ui/BaseHUDContainer";
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
 * Uses shared HUD utilities for consistent layout and styling.
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
  // Use shared HUD layout hook
  const layout = useHUDLayout(
    width,
    height,
    positionScale,
    isMobile,
    'left',
    'combat'
  );

  return (
    <BaseHUDContainer
      position="left"
      width={layout.hudWidth}
      height={layout.availableHeight}
      topOffset={layout.topOffset}
      padding={layout.padding}
      gap={layout.gap}
      style={{ overflow: "hidden" }}
      dataTestId="combat-left-hud"
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
    </BaseHUDContainer>
  );
};

export default CombatLeftHUD;
