/**
 * RightHUD - Right-side HUD container for Player 2 information
 *
 * Organizes all Player 2 (AI opponent) HUD elements:
 * - Player health/stats (top-right)
 * - Guard indicator (bottom-right)
 * - Speed indicator (right side)
 * - Body part health display (right side)
 *
 * 오른쪽 HUD - 플레이어 2 정보 컨테이너
 */

import React from "react";
import { PlayerState, TrigramStance } from "../../../../../types";
import { BodyPartHealth } from "../../../../../types/combat";
import { BodyPartHealthDisplay } from "../indicators/BodyPartHealthDisplay";
import { GuardIndicator } from "../indicators/GuardIndicator";
import { PlayerHUD } from "./PlayerHUD";
import { SpeedIndicatorHUD } from "./SpeedIndicatorHUD";

/**
 * Props for the RightHUD component.
 * Contains all state needed for Player 2 (right-side) displays.
 */
export interface RightHUDProps {
  /** Player 2 state with all combat information */
  readonly player: PlayerState;
  /** Current stance for guard indicator */
  readonly currentStance: TrigramStance;
  /** Whether player is in guard stance (for guard indicator) */
  readonly isInGuard: boolean;
  /** Player laterality (orthodox/southpaw) */
  readonly laterality: "orthodox" | "southpaw";
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
 * RightHUD Component
 *
 * Organizes all Player 2 HUD elements in the right side of the screen.
 * Uses position="right" for all child components to maintain consistent layout.
 *
 * @example
 * ```tsx
 * <RightHUD
 *   player={validPlayers[1]}
 *   currentStance={validPlayers[1].currentStance}
 *   isInGuard={player2Animation.isInStanceGuard()}
 *   laterality={combatState.playerLaterality[1]}
 *   speedModifiers={player2SpeedModifiers}
 *   bodyPartHealth={validPlayers[1].bodyPartHealth}
 *   isMobile={isMobile}
 *   showSpeedIndicator={true}
 * />
 * ```
 */
export const RightHUD: React.FC<RightHUDProps> = ({
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
      {/* Player 2 HUD - Top Right */}
      <PlayerHUD
        player={player}
        position="right"
        isMobile={isMobile}
        laterality={laterality}
      />

      {/* Player 2 Guard Indicator - Bottom Right */}
      <GuardIndicator
        currentStance={currentStance}
        isInGuard={isInGuard}
        position="right"
        isMobile={isMobile}
      />

      {/* Player 2 Speed Indicator - Shows movement speed percentage */}
      {showSpeedIndicator && (
        <SpeedIndicatorHUD
          finalSpeed={speedModifiers.finalSpeed}
          baseSpeed={speedModifiers.baseSpeed}
          position="right"
          isMobile={isMobile}
          visible={true}
        />
      )}

      {/* Body Part Health Display - Individual body part health bars */}
      {bodyPartHealth && (
        <BodyPartHealthDisplay
          bodyPartHealth={bodyPartHealth}
          playerId={player.id}
          position="right"
          isMobile={isMobile}
        />
      )}
    </>
  );
};

export default RightHUD;
