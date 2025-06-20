// Complete game engine for Black Trigram Korean martial arts

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import type { GameEngineProps } from "../../types/components";
import { CombatSystem } from "../../systems/CombatSystem";
import type { CombatResult } from "../../types/combat";
import type { PlayerState } from "../../types/player";

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
  const combatSystemRef = useRef<CombatSystem | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const gameLoopRef = useRef<number | null>(null);

  // Initialize combat system
  const combatSystem = useMemo(() => {
    if (!combatSystemRef.current) {
      combatSystemRef.current = new CombatSystem();
    }
    return combatSystemRef.current;
  }, []);

  // Handle player action
  const handlePlayerAction = useCallback(
    (playerId: number, action: string, data?: any) => {
      const player = players[playerId];
      if (!player) return;

      try {
        let result: CombatResult | null = null;

        switch (action) {
          case "attack":
            const target = players[1 - playerId];
            if (target) {
              result = combatSystem.executeAttack(player, target, data);
            }
            break;
          case "defend":
            result = combatSystem.executeDefense(player, data);
            break;
          case "stance_change":
            result = combatSystem.changeStance(player, data.stance);
            break;
          default:
            console.warn("Unknown action:", action);
            return;
        }

        if (result) {
          onPlayerUpdate(playerId, { ...player, stamina: Math.max(0, player.stamina - 5) }); // Example update
        }

      } catch (error) {
        console.error("Error handling player action:", error);
      }
    },
    [players, combatSystem, onPlayerUpdate]
  );

  // Game loop
  const gameLoop = useCallback(() => {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastUpdateTimeRef.current;
    lastUpdateTimeRef.current = currentTime;

    try {
      // Update combat system
      if (combatSystem) {
        const updatedPlayers = combatSystem.update(players, deltaTime);

        // Apply updates if players changed
        updatedPlayers.forEach((updatedPlayer, index) => {
          if (updatedPlayer !== players[index]) {
            onPlayerUpdate(index, updatedPlayer);
          }
        });
      }

      // Schedule next update
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } catch (error) {
      console.error("Game loop error:", error);
    }
  }, [combatSystem, players, onPlayerUpdate]);

  // Start/stop game loop
  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  // Expose game engine methods
  useEffect(() => {
    // onGameEvent("engine_ready", {
    //   handlePlayerAction,
    //   combatSystem,
    // });
  }, [handlePlayerAction, combatSystem]);

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
              handlePlayerAction(player.id, "attack", {
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
    [width, height, handlePlayerAction]
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
