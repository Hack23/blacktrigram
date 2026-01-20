/**
 * LeftHUD - Left-side HUD container for Player 1 information
 *
 * Organizes all Player 1 (human player) HUD elements:
 * - Player health/stats (top-left)
 * - Guard indicator (bottom-left)
 * - Speed indicator (left side)
 * - Body part health display (left side)
 *
 * 왼쪽 HUD - 플레이어 1 정보 컨테이너
 */

import React from "react";
import { TrigramStance } from "../../../../../types";
import { PlayerState } from "../../../../../systems/player";
import { BodyPartHealth } from "../../../../../systems/bodypart/types";
import { StanceLaterality } from "../../../../../systems/trigram/types";
import { BodyPartHealthDisplay } from "../indicators/BodyPartHealthDisplay";
import { GuardIndicator } from "../indicators/GuardIndicator";
import { PlayerHUD } from "./PlayerHUD";
import { SpeedIndicatorHUD } from "./SpeedIndicatorHUD";

/**
 * Props for the LeftHUD component.
 * Contains all state needed for Player 1 (left-side) displays.
 */
export interface LeftHUDProps {
  /** Player 1 state with all combat information */
  readonly player: PlayerState;
  /** Current stance for guard indicator */
  readonly currentStance: TrigramStance;
  /** Whether player is in guard stance (for guard indicator) */
  readonly isInGuard: boolean;
  /** Player laterality (left/right stance) */
  readonly laterality: StanceLaterality;
  /** Speed modifiers for movement */
  readonly speedModifiers: {
    readonly finalSpeed: number;
    readonly baseSpeed: number;
  };
  /** Body part health data (optional, only shown if present) */
  readonly bodyPartHealth?: BodyPartHealth;
  /** Mobile layout flag */
  readonly isMobile: boolean;
  /** Speed indicator visibility */
  readonly showSpeedIndicator?: boolean;
}

/**
 * LeftHUD Component
 *
 * Organizes all Player 1 HUD elements in the left side of the screen.
 * Uses position="left" for all child components to maintain consistent layout.
 *
 * @example
 * ```tsx
 * <LeftHUD
 *   player={validPlayers[0]}
 *   currentStance={validPlayers[0].currentStance}
 *   isInGuard={player1Animation.isInStanceGuard()}
 *   laterality={combatState.playerLaterality[0]}
 *   speedModifiers={player1SpeedModifiers}
 *   bodyPartHealth={validPlayers[0].bodyPartHealth}
 *   isMobile={isMobile}
 *   showSpeedIndicator={true}
 * />
 * ```
 */
export const LeftHUD: React.FC<LeftHUDProps> = ({
  player,
  currentStance,
  isInGuard,
  laterality,
  speedModifiers,
  bodyPartHealth,
  isMobile,
  showSpeedIndicator = true,
}) => {
  return (
    <>
      {/* Player 1 HUD - Top Left */}
      <PlayerHUD
        player={player}
        position="left"
        isMobile={isMobile}
        laterality={laterality}
      />

      {/* Player 1 Guard Indicator - Bottom Left */}
      <GuardIndicator
        currentStance={currentStance}
        isInGuard={isInGuard}
        position="left"
        isMobile={isMobile}
      />

      {/* Player 1 Speed Indicator - Shows movement speed percentage */}
      {showSpeedIndicator && (
        <SpeedIndicatorHUD
          finalSpeed={speedModifiers.finalSpeed}
          baseSpeed={speedModifiers.baseSpeed}
          position="left"
          isMobile={isMobile}
          visible={true}
        />
      )}

      {/* Body Part Health Display - Individual body part health bars */}
      {bodyPartHealth && (
        <BodyPartHealthDisplay
          bodyPartHealth={bodyPartHealth}
          playerId={player.id}
          position="left"
          isMobile={isMobile}
        />
      )}
    </>
  );
};

export default LeftHUD;
