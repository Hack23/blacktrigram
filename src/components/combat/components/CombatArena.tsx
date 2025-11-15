/**
 * CombatArena Component - Isolated Arena Rendering
 * 
 * Renders the combat arena with players, effects, and round status.
 * Optimized with React.memo and custom comparison to prevent unnecessary re-renders.
 *
 * Performance:
 * - Uses React.memo with shallow comparison
 * - Isolated from layout recalculations
 * - Targets <8ms render time for 60fps
 *
 * @example
 * ```typescript
 * <CombatArena
 *   width={800}
 *   height={600}
 *   players={[player1, player2]}
 *   playerPositions={positions}
 *   hitEffects={effects}
 *   comboCount={5}
 *   roundDisplayStatus="fight"
 *   currentRound={1}
 *   isMobile={false}
 *   isExecutingTechnique={false}
 *   isMoving={false}
 *   onEffectComplete={handleComplete}
 * />
 * ```
 */

import { HitEffect, PlayerState } from "@/systems";
import { CombatState, Position } from "@/types";
import { KOREAN_COLORS } from "@/types/constants";
import React from "react";
import { HitEffectsLayer } from "../../ui/HitEffectsLayer";
import { PlayerVisuals, PlayerAnimationState } from "../../ui/PlayerVisuals";
import { RoundStatusDisplay } from "./RoundStatusDisplay";

export interface CombatArenaProps {
  readonly width: number;
  readonly height: number;
  readonly players: readonly [PlayerState, PlayerState];
  readonly playerPositions: readonly [Position, Position];
  readonly hitEffects: readonly HitEffect[];
  readonly comboCount: number;
  readonly roundDisplayStatus: "start" | "fight" | "ko" | "end" | null;
  readonly currentRound: number;
  readonly isMobile: boolean;
  readonly isExecutingTechnique: boolean;
  readonly isMoving: boolean;
  readonly onEffectComplete: (effectId: string) => void;
}

/**
 * Get player animation state based on combat state
 */
function getPlayerAnimationState(
  playerIndex: number,
  players: readonly PlayerState[],
  isExecutingTechnique: boolean,
  isMoving: boolean
): PlayerAnimationState {
  const player = players[playerIndex];
  
  if (player.health <= 0) return "defeat";
  if (player.isBlocking) return "defend";
  if (player.combatState === CombatState.ATTACKING) return "attack";
  if (player.isStunned) return "hit";
  if (isExecutingTechnique && playerIndex === 0) return "technique_execute";
  if (playerIndex === 0 && isMoving) return "walk";

  return "idle";
}

/**
 * Combat Arena Component
 * Renders players, effects, and round status in the arena area
 */
export const CombatArena = React.memo<CombatArenaProps>(
  ({
    width,
    height,
    players,
    playerPositions,
    hitEffects,
    comboCount,
    roundDisplayStatus,
    currentRound,
    isMobile,
    isExecutingTechnique,
    isMoving,
    onEffectComplete,
  }) => {
    const arenaHeight = height;

    return (
      <pixiContainer
        data-testid="combat-arena"
        layout={{
          width: "100%",
          height: arenaHeight,
          flexShrink: 1,
          minHeight: 300, // Minimum arena height
        }}
      >
        {/* Player 1 Visuals - Use absolute positioning within arena */}
        <PlayerVisuals
          playerState={players[0]}
          x={playerPositions[0].x}
          y={playerPositions[0].y}
          scale={isMobile ? 0.8 : 1.0}
          renderMode="combat"
          facing="right"
          showDetails={true}
          showVitalPoints={false}
          showKiAura={true}
          showKoreanLabels={true}
          interactive={true}
          onPlayerClick={() => console.log("Player 1 clicked")}
          animationState={getPlayerAnimationState(
            0,
            players,
            isExecutingTechnique,
            isMoving
          )}
          data-testid="combat-player-1"
        />

        {/* Player 2 Visuals - Use absolute positioning within arena */}
        <PlayerVisuals
          playerState={players[1]}
          x={playerPositions[1].x}
          y={playerPositions[1].y}
          scale={isMobile ? 0.8 : 1.0}
          renderMode="combat"
          facing="left"
          showDetails={true}
          showVitalPoints={false}
          showKiAura={true}
          showKoreanLabels={true}
          interactive={true}
          onPlayerClick={() => console.log("Player 2 clicked")}
          animationState={getPlayerAnimationState(
            1,
            players,
            false,
            false
          )}
          data-testid="combat-player-2"
        />

        {/* Hit Effects Layer */}
        <HitEffectsLayer
          effects={hitEffects as HitEffect[]}
          onEffectComplete={onEffectComplete}
        />

        {/* Combo Counter Display */}
        {comboCount > 1 && (
          <pixiContainer
            x={width / 2}
            y={height * 0.3}
            data-testid="combo-counter"
          >
            <pixiText
              text={`${comboCount} HIT COMBO!`}
              style={{
                fontSize: 32 + comboCount * 2,
                fill: KOREAN_COLORS.ACCENT_GOLD,
                fontWeight: "bold",
                fontFamily: "Noto Sans KR",
              }}
              anchor={0.5}
              alpha={Math.min(1, comboCount / 5)}
            />
            <pixiText
              text={`${comboCount} 연속 공격!`}
              style={{
                fontSize: 20,
                fill: KOREAN_COLORS.PRIMARY_CYAN,
                fontWeight: "bold",
                fontFamily: "Noto Sans KR",
              }}
              anchor={0.5}
              y={40}
            />
          </pixiContainer>
        )}

        {/* Round Status Display */}
        {roundDisplayStatus && (
          <RoundStatusDisplay
            status={roundDisplayStatus}
            round={currentRound}
            width={width}
            height={height}
            onAnimationComplete={() => {
              /* Parent will handle */
            }}
          />
        )}
      </pixiContainer>
    );
  },
  // Custom comparison function for React.memo
  // Only re-render if critical props change
  (prevProps, nextProps) => {
    return (
      prevProps.width === nextProps.width &&
      prevProps.height === nextProps.height &&
      prevProps.players[0].health === nextProps.players[0].health &&
      prevProps.players[1].health === nextProps.players[1].health &&
      prevProps.players[0].combatState === nextProps.players[0].combatState &&
      prevProps.players[1].combatState === nextProps.players[1].combatState &&
      prevProps.playerPositions[0].x === nextProps.playerPositions[0].x &&
      prevProps.playerPositions[0].y === nextProps.playerPositions[0].y &&
      prevProps.playerPositions[1].x === nextProps.playerPositions[1].x &&
      prevProps.playerPositions[1].y === nextProps.playerPositions[1].y &&
      prevProps.hitEffects.length === nextProps.hitEffects.length &&
      prevProps.comboCount === nextProps.comboCount &&
      prevProps.roundDisplayStatus === nextProps.roundDisplayStatus &&
      prevProps.isExecutingTechnique === nextProps.isExecutingTechnique &&
      prevProps.isMoving === nextProps.isMoving
    );
  }
);

CombatArena.displayName = "CombatArena";
