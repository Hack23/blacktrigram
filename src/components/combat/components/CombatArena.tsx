import { HitEffect, PlayerState } from "@/systems";
import { FONT_FAMILY, KOREAN_COLORS } from "@/types/constants";
import React, { memo } from "react";
import { HitEffectsLayer } from "../../ui/HitEffectsLayer";
import { PlayerAnimationState, PlayerVisuals } from "../../ui/PlayerVisuals";
import { RoundStatusDisplay } from "./RoundStatusDisplay";

/**
 * Props for CombatArena component
 */
export interface CombatArenaProps {
  readonly players: readonly [PlayerState, PlayerState];
  readonly playerPositions: readonly [
    { readonly x: number; readonly y: number },
    { readonly x: number; readonly y: number }
  ];
  readonly hitEffects: readonly HitEffect[];
  readonly comboCount: number;
  readonly roundDisplayStatus: "start" | "fight" | "ko" | "end" | null;
  readonly currentRound: number;
  readonly width: number;
  readonly height: number;
  readonly arenaHeight: number;
  readonly isMobile: boolean;
  readonly getPlayerAnimationState: (playerIndex: number) => PlayerAnimationState;
  readonly onEffectComplete: (effectId: string) => void;
  readonly onRoundAnimationComplete: () => void;
}

/**
 * CombatArena - Focused component for rendering the combat arena and players
 * Extracted from CombatScreen for better performance and maintainability
 * 
 * Uses React.memo with custom comparison to prevent unnecessary re-renders
 */
export const CombatArena: React.FC<CombatArenaProps> = memo(
  ({
    players,
    playerPositions,
    hitEffects,
    comboCount,
    roundDisplayStatus,
    currentRound,
    width,
    height,
    arenaHeight,
    isMobile,
    getPlayerAnimationState,
    onEffectComplete,
    onRoundAnimationComplete,
  }) => {
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
          animationState={getPlayerAnimationState(0)}
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
          animationState={getPlayerAnimationState(1)}
          data-testid="combat-player-2"
        />

        {/* Hit Effects Layer */}
        <HitEffectsLayer
          effects={hitEffects}
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
                fontFamily: FONT_FAMILY.KOREAN,
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
                fontFamily: FONT_FAMILY.KOREAN,
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
            onAnimationComplete={onRoundAnimationComplete}
          />
        )}
      </pixiContainer>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function to optimize re-renders
    // Only re-render if critical props have changed
    return (
      prevProps.players[0].health === nextProps.players[0].health &&
      prevProps.players[1].health === nextProps.players[1].health &&
      prevProps.players[0].isBlocking === nextProps.players[0].isBlocking &&
      prevProps.players[1].isBlocking === nextProps.players[1].isBlocking &&
      prevProps.playerPositions[0].x === nextProps.playerPositions[0].x &&
      prevProps.playerPositions[0].y === nextProps.playerPositions[0].y &&
      prevProps.playerPositions[1].x === nextProps.playerPositions[1].x &&
      prevProps.playerPositions[1].y === nextProps.playerPositions[1].y &&
      prevProps.hitEffects === nextProps.hitEffects && // Reference equality check
      prevProps.comboCount === nextProps.comboCount &&
      prevProps.roundDisplayStatus === nextProps.roundDisplayStatus &&
      prevProps.currentRound === nextProps.currentRound &&
      prevProps.isMobile === nextProps.isMobile &&
      prevProps.width === nextProps.width &&
      prevProps.height === nextProps.height &&
      prevProps.arenaHeight === nextProps.arenaHeight &&
      prevProps.getPlayerAnimationState === nextProps.getPlayerAnimationState &&
      prevProps.onEffectComplete === nextProps.onEffectComplete &&
      prevProps.onRoundAnimationComplete === nextProps.onRoundAnimationComplete
    );
  }
);

CombatArena.displayName = "CombatArena";
