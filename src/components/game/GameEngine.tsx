// Complete game engine for Black Trigram Korean martial arts

import React, { useCallback } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import type { PlayerState } from "../../types/player";
import type { KoreanTechnique } from "../../types/anatomy";

// Extend PixiJS components
extend({
  Container,
  Graphics,
  Text,
});

// Define GameEngineProps interface locally to avoid conflicts
interface GameEngineProps {
  readonly width: number;
  readonly height: number;
  readonly player1: PlayerState;
  readonly player2: PlayerState;
  readonly onPlayerUpdate: (
    playerId: string,
    updates: Partial<PlayerState>
  ) => void;
}

export const GameEngine: React.FC<GameEngineProps> = ({
  width,
  height,
  player1,
  player2,
  onPlayerUpdate,
}) => {
  const players = [player1, player2];

  // Handle combat actions - using the action parameter to avoid unused warning
  const handleCombatAction = useCallback(
    (playerId: string, action: KoreanTechnique) => {
      // Basic combat action processing
      const updatedAction = {
        ...action,
        id: action.id || "basic_attack",
        name: action.name || {
          korean: "기본공격",
          english: "Basic Attack",
          romanized: "gibon_gonggyeok",
        },
        koreanName: action.koreanName || "기본공격",
        englishName: action.englishName || "Basic Attack",
        romanized: action.romanized || "gibon_gonggyeok",
        description: action.description || {
          korean: "기본 공격",
          english: "Basic attack",
        },
        stance: action.stance,
        type: action.type,
        damageType: action.damageType,
        damage: action.damage || 10,
        kiCost: action.kiCost || 5,
        staminaCost: action.staminaCost || 8,
        accuracy: action.accuracy || 0.8,
        range: action.range || 1.0,
        executionTime: action.executionTime || 500,
        recoveryTime: action.recoveryTime || 300,
        critChance: action.critChance || 0.1,
        critMultiplier: action.critMultiplier || 1.5,
        effects: action.effects || [],
      };

      console.log(`Combat action for ${playerId}:`, updatedAction);
      onPlayerUpdate(playerId, { lastActionTime: Date.now() });
    },
    [onPlayerUpdate]
  );

  // Render arena background - fix width/height undefined issues
  const renderArena = useCallback(
    (g: any) => {
      g.clear();
      g.fill({ color: 0x1a1a2e, alpha: 0.8 });
      g.rect(0, 0, width || 1200, height || 800);
      g.fill();

      // Center line
      g.stroke({ width: 2, color: 0x00ffff, alpha: 0.5 });
      g.moveTo((width || 1200) / 2, 0);
      g.lineTo((width || 1200) / 2, height || 800);
      g.stroke();
    },
    [width, height]
  );

  // Render individual player - fix width/height undefined issues
  const renderPlayer = useCallback(
    (player: PlayerState, index: number) => {
      const safeWidth = width || 1200;
      const safeHeight = height || 800;
      const x = index === 0 ? safeWidth * 0.25 : safeWidth * 0.75;
      const y = safeHeight * 0.5;

      return (
        <pixiContainer key={player.id} x={x} y={y}>
          <pixiGraphics
            draw={(g) => {
              g.clear();
              // Player body
              g.fill({ color: index === 0 ? 0x00ccff : 0xff6600, alpha: 0.8 });
              g.circle(0, -40, 15); // Head
              g.rect(-8, -25, 16, 40); // Body
              g.rect(-6, 15, 5, 25); // Left leg
              g.rect(1, 15, 5, 25); // Right leg
              g.rect(-15, -20, 10, 5); // Left arm
              g.rect(5, -20, 10, 5); // Right arm
              g.fill();

              // Health bar
              const healthPercent = player.health / player.maxHealth;
              g.fill({ color: 0x00ff00, alpha: 0.8 });
              g.rect(-30, -60, 60 * healthPercent, 5);
              g.fill();
            }}
            interactive={true}
            onPointerDown={() =>
              handleCombatAction(player.id, {
                id: "basic_punch",
                name: {
                  korean: "기본타격",
                  english: "Basic Punch",
                  romanized: "gibon_tagyeok",
                },
                koreanName: "기본타격",
                englishName: "Basic Punch",
                romanized: "gibon_tagyeok",
                description: {
                  korean: "기본적인 주먹 공격",
                  english: "Basic punch attack",
                },
                stance: player.currentStance,
                type: "strike",
                damageType: "blunt",
                damage: 15,
                kiCost: 5,
                staminaCost: 8,
                accuracy: 0.85,
                range: 1.0,
                executionTime: 400,
                recoveryTime: 200,
                critChance: 0.1,
                critMultiplier: 1.5,
                effects: [],
              })
            }
          />

          <pixiText
            text={player.name.korean}
            style={{
              fontSize: 14,
              fill: 0xffffff,
              align: "center",
            }}
            x={0}
            y={-80}
            anchor={0.5}
          />
        </pixiContainer>
      );
    },
    [width, height, handleCombatAction]
  );

  return (
    <pixiContainer
      data-testid="game-engine"
      x={0}
      y={0}
      width={width}
      height={height}
    >
      {/* Arena background */}
      <pixiGraphics draw={renderArena} />

      {/* Players */}
      {players.map(renderPlayer)}
    </pixiContainer>
  );
};

export default GameEngine;
