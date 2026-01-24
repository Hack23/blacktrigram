/**
 * CombatRightHUD - Right side HUD for combat screen (Player 2 / AI)
 *
 * REUSES existing components:
 * - PlayerHUD: Archetype image, name, health/stamina bars
 * - SpeedIndicatorHUD: Movement speed percentage
 * - BodyPartHealthDisplay: Individual body part health bars
 * - DifficultyIndicator: AI difficulty tier display
 *
 * Gaming Layout Best Practice:
 * - Width: 14% of screen (mobile: 18%)
 * - Height: 100% minus top/bottom HUD heights
 * - Leaves 72% center for arena
 *
 * Now uses shared HUD utilities to reduce code duplication.
 *
 * @korean 전투화면 오른쪽 HUD - 플레이어 2/AI 상태
 */

import React from "react";
import { useHUDLayout } from "../../../../../hooks/useHUDLayout";
import { PlayerState } from "../../../../../systems";
import type { StanceLaterality } from "../../../../../systems/trigram/types";
import { BaseHUDContainer } from "../../../../shared/ui/BaseHUDContainer";
import { BodyPartHealthDisplay } from "../../../../shared/three/ui/BodyPartHealthDisplay";
import { PlayerHUD } from "../../../../shared/three/ui/PlayerHUD";
import { SpeedIndicatorHUD } from "../../../../shared/three/ui/SpeedIndicatorHUD";
import { DifficultyIndicator } from "./DifficultyIndicator";

export interface CombatRightHUDProps {
  /** Screen width for layout calculations */
  readonly width: number;
  /** Screen height for layout calculations */
  readonly height: number;
  /** Whether mobile layout is active */
  readonly isMobile: boolean;
  /** Position scale multiplier for large displays */
  readonly positionScale: number;
  /** Player 2/AI state */
  readonly player: PlayerState;
  /** Player laterality (left/right foot forward) */
  readonly laterality: StanceLaterality;
  /** Current AI difficulty tier (1-5) */
  readonly difficultyTier: number;
  /** Player speed modifiers */
  readonly speedModifiers: {
    finalSpeed: number;
    baseSpeed: number;
  };
}

/**
 * CombatRightHUD Component
 *
 * Right side of the combat screen containing Player 2/AI stats.
 * Takes 14% of screen width (18% on mobile), positioned between top and bottom HUDs.
 * REUSES existing PlayerHUD, SpeedIndicatorHUD, BodyPartHealthDisplay, DifficultyIndicator.
 * Uses shared HUD utilities for consistent layout and styling.
 */
export const CombatRightHUD: React.FC<CombatRightHUDProps> = ({
  width,
  height,
  isMobile,
  positionScale,
  player,
  laterality,
  difficultyTier,
  speedModifiers,
}) => {
  // Use shared HUD layout hook
  const layout = useHUDLayout(
    width,
    height,
    positionScale,
    isMobile,
    'right',
    'combat'
  );

  return (
    <BaseHUDContainer
      position="right"
      width={layout.hudWidth}
      height={layout.availableHeight}
      topOffset={layout.topOffset}
      padding={layout.padding}
      gap={layout.gap}
      isMobile={isMobile}
      style={{ overflow: "hidden" }}
      dataTestId="combat-right-hud"
    >
      {/* Player 2/AI Stats - REUSING PlayerHUD component */}
      <div
        style={{
          pointerEvents: "none",
          position: "relative",
        }}
        data-testid="combat-right-hud-player-section"
      >
        <PlayerHUD
          player={player}
          position="right"
          isMobile={isMobile}
          laterality={laterality}
        />
      </div>

      {/* Difficulty Tier - REUSING DifficultyIndicator component */}
      <div
        style={{
          pointerEvents: "none",
          position: "relative",
        }}
        data-testid="combat-right-hud-difficulty-section"
      >
        <DifficultyIndicator tier={difficultyTier} isMobile={isMobile} />
      </div>

      {/* Speed Indicator - REUSING SpeedIndicatorHUD component */}
      <div
        style={{
          pointerEvents: "none",
          position: "relative",
        }}
        data-testid="combat-right-hud-speed-section"
      >
        <SpeedIndicatorHUD
          finalSpeed={speedModifiers.finalSpeed}
          baseSpeed={speedModifiers.baseSpeed}
          position="right"
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
            marginTop: "auto",
          }}
          data-testid="combat-right-hud-bodypart-section"
        >
          <BodyPartHealthDisplay
            bodyPartHealth={player.bodyPartHealth}
            playerId={player.id}
            position="right"
            isMobile={isMobile}
          />
        </div>
      )}
    </BaseHUDContainer>
  );
};

export default CombatRightHUD;
