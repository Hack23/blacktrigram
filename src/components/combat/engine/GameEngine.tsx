/**
 * @fileoverview Korean Martial Arts Game Engine Component
 * @description Core game engine for Black Trigram combat simulation with authentic Korean martial arts mechanics
 */

import React, {
  useCallback,
  useEffect,
  useReducer,
  useMemo,
  useRef,
  useState,
} from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { useAudio } from "../../../audio/AudioProvider";
import type { PlayerState } from "../../../types/player";
import type { GridPosition, OctagonalGrid } from "../../../types/combat";
import type { KoreanTechnique } from "../../../types/combat";
import type { HitEffect } from "../../../types/effects";
import { HitEffectType } from "../../../types/effects";
import { KOREAN_COLORS, TRIGRAM_DATA } from "../../../types/constants";
import { TrigramStance } from "../../../types/enums";
import { createGridPosition } from "../../../types/combat";

// Extend PixiJS components
extend({ Container, Graphics, Text });

export interface GameEngineProps {
  /** First player (left side) - typically human player */
  readonly player1: PlayerState;
  /** Second player (right side) - typically AI or second human player */
  readonly player2: PlayerState;
  /** Callback when player state needs updating */
  readonly onPlayerUpdate: (
    playerId: string,
    updates: Partial<PlayerState>
  ) => void;
  /** Callback when combat ends with winner ID or "draw" */
  readonly onCombatEnd?: (winnerId: string | "draw") => void;
  /** Engine canvas width */
  readonly width?: number;
  /** Engine canvas height */
  readonly height?: number;
  /** X position offset */
  readonly x?: number;
  /** Y position offset */
  readonly y?: number;
  /** Game mode settings */
  readonly gameMode?: "versus" | "training" | "practice";
  /** AI difficulty level */
  readonly aiDifficulty?: "beginner" | "intermediate" | "advanced" | "master";
  /** Enable Korean martial arts realism mode */
  readonly realismMode?: boolean;
  /** Debug mode for development */
  readonly debugMode?: boolean;
}

/**
 * @interface GameEngineState
 * @description Internal state of the Korean martial arts game engine
 */
interface GameEngineState {
  /** Current active player index (0 or 1) */
  readonly activePlayerIndex: number;
  /** Current game phase */
  readonly phase: "preparation" | "combat" | "victory" | "defeat";
  /** Turn counter for match tracking */
  readonly turnCount: number;
  /** Combat log entries in Korean and English */
  readonly combatLog: readonly string[];
  /** Active visual effects */
  readonly activeEffects: readonly HitEffect[];
  /** Current octagonal grid state */
  readonly grid: OctagonalGrid;
  /** Last action timestamp for timing */
  readonly lastActionTime: number;
  /** AI thinking state */
  readonly aiThinking: boolean;
}

/**
 * @type GameEngineAction
 * @description Available actions for the game engine state machine
 */
type GameEngineAction =
  | { type: "SWITCH_PLAYER" }
  | {
      type: "EXECUTE_TECHNIQUE";
      payload: { technique: KoreanTechnique; targetId: string };
    }
  | {
      type: "MOVE_PLAYER";
      payload: { playerId: string; newPosition: GridPosition };
    }
  | { type: "ADD_EFFECT"; payload: { effect: HitEffect } }
  | { type: "REMOVE_EFFECT"; payload: { effectId: string } }
  | { type: "LOG_ACTION"; payload: { message: string } }
  | { type: "SET_PHASE"; payload: { phase: GameEngineState["phase"] } }
  | { type: "AI_START_THINKING" }
  | { type: "AI_STOP_THINKING" };

/**
 * @function gameEngineReducer
 * @description Manages game engine state transitions with Korean martial arts logic
 *
 * @param state - Current game engine state
 * @param action - Action to process
 * @returns Updated game engine state
 */
function gameEngineReducer(
  state: GameEngineState,
  action: GameEngineAction
): GameEngineState {
  switch (action.type) {
    case "SWITCH_PLAYER":
      return {
        ...state,
        activePlayerIndex: state.activePlayerIndex === 0 ? 1 : 0,
        turnCount: state.turnCount + 1,
        lastActionTime: Date.now(),
      };

    case "EXECUTE_TECHNIQUE":
      return {
        ...state,
        combatLog: [
          ...state.combatLog.slice(-9),
          `${action.payload.technique.name.korean} 실행! - ${action.payload.technique.name.english} executed!`,
        ],
        lastActionTime: Date.now(),
      };

    case "MOVE_PLAYER":
      return {
        ...state,
        combatLog: [
          ...state.combatLog.slice(-9),
          `플레이어 이동 - Player moved to ${action.payload.newPosition.row}, ${action.payload.newPosition.col}`,
        ],
        lastActionTime: Date.now(),
      };

    case "ADD_EFFECT":
      return {
        ...state,
        activeEffects: [...state.activeEffects, action.payload.effect],
      };

    case "REMOVE_EFFECT":
      return {
        ...state,
        activeEffects: state.activeEffects.filter(
          (effect) => effect.id !== action.payload.effectId
        ),
      };

    case "LOG_ACTION":
      return {
        ...state,
        combatLog: [...state.combatLog.slice(-9), action.payload.message],
      };

    case "SET_PHASE":
      return {
        ...state,
        phase: action.payload.phase,
      };

    case "AI_START_THINKING":
      return {
        ...state,
        aiThinking: true,
      };

    case "AI_STOP_THINKING":
      return {
        ...state,
        aiThinking: false,
      };

    default:
      return state;
  }
}

/**
 * @function createOctagonalGrid
 * @description Creates an octagonal combat grid following Korean martial arts traditions
 *
 * @param size - Grid dimension (typically 9x9 for traditional Korean martial arts)
 * @returns Octagonal grid with valid positions marked
 */
function createOctagonalGrid(size: number = 9): OctagonalGrid {
  const grid: boolean[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(false));
  const center = Math.floor(size / 2);
  const radius = center - 1;

  // Create octagonal pattern
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const dx = Math.abs(col - center);
      const dy = Math.abs(row - center);

      // Octagonal boundary calculation
      if (dx + dy <= radius || (dx <= radius && dy <= radius)) {
        grid[row][col] = true;
      }
    }
  }

  return {
    size,
    validPositions: grid,
    centerPosition: createGridPosition(center, center),
  };
}

/**
 * @function getInitialPlayerPositions
 * @description Sets initial positions for players according to Korean martial arts ceremony
 *
 * @param grid - The octagonal combat grid
 * @returns Initial positions for both players
 */
function getInitialPlayerPositions(
  grid: OctagonalGrid
): [GridPosition, GridPosition] {
  const center = Math.floor(grid.size / 2);

  // Traditional starting positions - players face each other with respect
  return [
    createGridPosition(center, 2),
    createGridPosition(center, grid.size - 3),
  ];
}

/**
 * @component GameEngine
 * @description Core Korean martial arts combat engine with authentic trigram system
 *
 * This component implements a complete combat simulation based on traditional Korean
 * martial arts principles, featuring:
 *
 * - Eight trigram (팔괘) stance system
 * - Anatomical vital point targeting
 * - Realistic combat physics and damage calculation
 * - AI opponents with Korean martial arts behavior
 * - Traditional Korean martial arts ceremony and respect
 *
 * @param props - Game engine configuration and callbacks
 * @returns React component rendering the combat engine
 *
 * @public
 * @since 1.0.0
 */
export const GameEngine: React.FC<GameEngineProps> = ({
  player1,
  player2,
  onPlayerUpdate,
  onCombatEnd,
  width = 1200,
  height = 800,
  x = 0,
  y = 0,
  gameMode = "versus",
  aiDifficulty = "intermediate",
  realismMode = true,
  debugMode = false,
}) => {
  const audio = useAudio();
  const gameLoopRef = useRef<number>(0);

  // Initialize octagonal grid and player positions
  const [grid] = useState(() => createOctagonalGrid(9));
  const [player1Position, setPlayer1Position] = useState<GridPosition>(
    () => getInitialPlayerPositions(grid)[0]
  );
  const [player2Position, setPlayer2Position] = useState<GridPosition>(
    () => getInitialPlayerPositions(grid)[1]
  );

  const [victory, setVictory] = useState<{
    winner: PlayerState;
    method: string;
  } | null>(null);

  const [gameState, dispatch] = useReducer(gameEngineReducer, {
    activePlayerIndex: 0,
    phase: "preparation",
    turnCount: 0,
    combatLog: ["전투 준비 중... - Preparing for combat..."],
    activeEffects: [],
    grid,
    lastActionTime: Date.now(),
    aiThinking: false,
  });

  // Apply game mode and realism settings
  const gameSettings = useMemo(() => {
    const baseSettings = {
      realismMode,
      showDebug: debugMode,
      aiEnabled: gameMode !== "versus",
      kiRegenRate: realismMode ? 0.5 : 1.0,
      staminaRegenRate: realismMode ? 0.3 : 0.6,
    };

    switch (gameMode) {
      case "training":
        return { ...baseSettings, allowPause: true, slowMotion: true };
      case "practice":
        return { ...baseSettings, aiDifficulty: "beginner" };
      default:
        return baseSettings;
    }
  }, [gameMode, realismMode, debugMode]);

  /**
   * @function validateAndUpdatePosition
   * @description Validates and updates player position on the octagonal grid
   *
   * @param playerId - ID of the player to move
   * @param newPosition - Proposed new position
   * @returns Success status of the movement
   */
  const validateAndUpdatePosition = useCallback(
    (playerId: string, newPosition: GridPosition): boolean => {
      // Validate position is within grid bounds and valid
      if (!validatePosition(newPosition, grid)) {
        return false;
      }

      // Check if position is occupied by the other player
      const otherPosition =
        playerId === player1.id ? player2Position : player1Position;
      if (
        otherPosition.row === newPosition.row &&
        otherPosition.col === newPosition.col
      ) {
        return false;
      }

      // Update position
      if (playerId === player1.id) {
        setPlayer1Position(newPosition);
      } else {
        setPlayer2Position(newPosition);
      }

      // Update player state
      onPlayerUpdate(playerId, {
        position: {
          x: newPosition.col,
          y: newPosition.row,
        },
        stamina: Math.max(
          0,
          (playerId === player1.id ? player1.stamina : player2.stamina) - 2
        ),
      });

      dispatch({
        type: "MOVE_PLAYER",
        payload: { playerId, newPosition },
      });
      return true;
    },
    [
      grid,
      player1Position,
      player2Position,
      player1.id,
      player1.stamina,
      player2.stamina,
      onPlayerUpdate,
    ]
  );

  /**
   * @function executeKoreanTechnique
   * @description Executes a Korean martial arts technique with authentic calculations
   *
   * @param technique - The Korean technique to execute
   * @param attackerId - ID of the attacking player
   * @param defenderId - ID of the defending player
   */
  const executeKoreanTechnique = useCallback(
    async (
      technique: KoreanTechnique,
      attackerId: string,
      defenderId: string
    ): Promise<void> => {
      const attacker = attackerId === player1.id ? player1 : player2;
      const defender = defenderId === player1.id ? player1 : player2;
      const attackerPos =
        attackerId === player1.id ? player1Position : player2Position;
      const defenderPos =
        defenderId === player1.id ? player1Position : player2Position;

      // Check if technique is in range
      const distance = calculateDistance(attackerPos, defenderPos);
      if (distance > technique.range) {
        dispatch({
          type: "LOG_ACTION",
          payload: {
            message:
              "거리가 너무 멀어서 공격할 수 없습니다! - Too far to attack!",
          },
        });
        return;
      }

      // Check if attacker has sufficient resources
      if (
        attacker.ki < technique.kiCost ||
        attacker.stamina < technique.staminaCost
      ) {
        dispatch({
          type: "LOG_ACTION",
          payload: {
            message:
              "기력이나 체력이 부족합니다! - Insufficient Ki or Stamina!",
          },
        });
        return;
      }

      try {
        // Execute technique using trigram system
        const result = await executeTrigramTechnique(
          technique,
          attacker,
          defender
        );

        // Update attacker resources
        onPlayerUpdate(attackerId, {
          ki: Math.max(0, attacker.ki - technique.kiCost),
          stamina: Math.max(0, attacker.stamina - technique.staminaCost),
        });

        // Update defender based on result
        onPlayerUpdate(defenderId, {
          health: Math.max(0, defender.health - result.damage),
          consciousness: Math.max(
            0,
            defender.consciousness - result.damage * 0.5
          ),
          balance: Math.max(0, defender.balance - (result.impact || 0)),
        });

        // Fix: Use proper HitEffectType enum
        const effect: HitEffect = {
          id: `technique_${Date.now()}`,
          type: result.isCritical ? HitEffectType.CRITICAL : HitEffectType.HIT,
          attackerId,
          defenderId,
          timestamp: Date.now(),
          duration: result.isCritical ? 1500 : 1000,
          position: {
            x: defenderPos.col * (width / grid.size) + width / (grid.size * 2),
            y:
              defenderPos.row * (height / grid.size) + height / (grid.size * 2),
          },
          intensity: result.isCritical ? 1.5 : 1.0,
          startTime: Date.now(),
          text: result.isCritical ? "치명타!" : technique.name.korean,
        };

        dispatch({ type: "ADD_EFFECT", payload: { effect } });
        dispatch({
          type: "EXECUTE_TECHNIQUE",
          payload: { technique, targetId: defenderId },
        });

        // Play appropriate audio
        try {
          if (result.isCritical) {
            audio.playSFX("critical_hit");
          } else if (result.isVitalPoint) {
            audio.playSFX("vital_point_hit");
          } else {
            audio.playSFX("attack_medium");
          }
        } catch (audioError) {
          console.warn("Audio playback failed:", audioError);
        }

        // Remove effect after duration
        setTimeout(() => {
          dispatch({ type: "REMOVE_EFFECT", payload: { effectId: effect.id } });
        }, effect.duration);

        // Switch active player
        dispatch({ type: "SWITCH_PLAYER" });
      } catch (error) {
        console.error("Technique execution failed:", error);
        dispatch({
          type: "LOG_ACTION",
          payload: { message: "기술 실행 실패! - Technique execution failed!" },
        });
      }
    },
    [
      player1,
      player2,
      player1Position,
      player2Position,
      onPlayerUpdate,
      grid,
      width,
      height,
      audio,
    ]
  );

  /**
   * @function executeAITurn
   * @description Executes AI opponent turn with Korean martial arts strategy
   */
  const executeAITurn = useCallback(async (): Promise<void> => {
    if (gameState.activePlayerIndex !== 1 || gameState.aiThinking) return;

    dispatch({ type: "AI_START_THINKING" });

    // AI decision making based on Korean martial arts principles
    const aiPlayer = player2;
    const humanPlayer = player1;
    const aiPos = player2Position;
    const humanPos = player1Position;

    try {
      // Calculate optimal action based on current situation
      const distance = calculateDistance(aiPos, humanPos);
      const healthRatio = aiPlayer.health / aiPlayer.maxHealth;
      const kiRatio = aiPlayer.ki / aiPlayer.maxKi;

      // Decision tree based on Korean martial arts strategy
      if (distance > 2 && healthRatio > 0.7) {
        // Move closer when healthy and far
        const possibleMoves = [
          createGridPosition(aiPos.row, Math.max(0, aiPos.col - 1)),
          createGridPosition(aiPos.row, Math.min(grid.size - 1, aiPos.col + 1)),
          createGridPosition(Math.max(0, aiPos.row - 1), aiPos.col),
          createGridPosition(Math.min(grid.size - 1, aiPos.row + 1), aiPos.col),
        ].filter(
          (pos) =>
            validatePosition(pos, grid) &&
            !(pos.row === humanPos.row && pos.col === humanPos.col)
        );

        if (possibleMoves.length > 0) {
          const bestMove = possibleMoves.reduce((best, current) =>
            calculateDistance(current, humanPos) <
            calculateDistance(best, humanPos)
              ? current
              : best
          );

          validateAndUpdatePosition(aiPlayer.id, bestMove);
        }
      } else if (distance <= 2 && kiRatio > 0.3) {
        // Attack when in range and have ki
        const currentStanceData = TRIGRAM_DATA[aiPlayer.currentStance];
        if (currentStanceData?.techniques?.primary) {
          const technique: KoreanTechnique = {
            id: `${aiPlayer.currentStance}_ai_primary`,
            name: currentStanceData.techniques.primary,
            koreanName: currentStanceData.techniques.primary.korean,
            englishName: currentStanceData.techniques.primary.english,
            romanized: currentStanceData.techniques.primary.korean,
            description: currentStanceData.techniques.primary.description,
            stance: aiPlayer.currentStance,
            type: "strike" as any,
            damageType: "blunt" as any,
            damage: currentStanceData.techniques.primary.damage,
            kiCost: currentStanceData.techniques.primary.kiCost,
            staminaCost: currentStanceData.techniques.primary.staminaCost,
            accuracy: currentStanceData.techniques.primary.hitChance,
            range: 2.0,
            executionTime: 600,
            recoveryTime: 800,
            critChance: currentStanceData.techniques.primary.criticalChance,
            critMultiplier: 1.5,
            effects: [],
          };

          await executeKoreanTechnique(technique, aiPlayer.id, humanPlayer.id);
        }
      } else {
        // Change stance for better positioning
        const stances = Object.values(TrigramStance);
        const newStance = stances[Math.floor(Math.random() * stances.length)];
        onPlayerUpdate(aiPlayer.id, { currentStance: newStance });

        dispatch({
          type: "LOG_ACTION",
          payload: {
            message: `AI가 ${newStance} 자세로 변경! - AI changed to ${newStance} stance!`,
          },
        });
        dispatch({ type: "SWITCH_PLAYER" });
      }
    } catch (error) {
      console.error("AI turn execution failed:", error);
      dispatch({ type: "SWITCH_PLAYER" });
    } finally {
      dispatch({ type: "AI_STOP_THINKING" });
    }
  }, [
    gameState.activePlayerIndex,
    gameState.aiThinking,
    player1,
    player2,
    player1Position,
    player2Position,
    grid,
    onPlayerUpdate,
    validateAndUpdatePosition,
    executeKoreanTechnique,
  ]);

  /**
   * @function handleKeyboardInput
   * @description Handles keyboard input for Korean martial arts controls
   */
  const handleKeyboardInput = useCallback(
    (event: KeyboardEvent): void => {
      if (gameState.phase !== "combat" || gameState.activePlayerIndex !== 0)
        return;

      const key = event.key;
      const activePlayer = player1;
      const currentPos = player1Position;

      // Movement controls (WASD)
      let newPosition: GridPosition | null = null;
      switch (key.toLowerCase()) {
        case "w": // Move up
          newPosition = createGridPosition(
            Math.max(0, currentPos.row - 1),
            currentPos.col
          );
          break;
        case "s": // Move down
          newPosition = createGridPosition(
            Math.min(grid.size - 1, currentPos.row + 1),
            currentPos.col
          );
          break;
        case "a": // Move left
          newPosition = createGridPosition(
            currentPos.row,
            Math.max(0, currentPos.col - 1)
          );
          break;
        case "d": // Move right
          newPosition = createGridPosition(
            currentPos.row,
            Math.min(grid.size - 1, currentPos.col + 1)
          );
          break;
      }

      if (newPosition && isValidMove(currentPos, newPosition, grid)) {
        event.preventDefault();
        validateAndUpdatePosition(activePlayer.id, newPosition);
        dispatch({ type: "SWITCH_PLAYER" });
        return;
      }

      // Stance changes (1-8 keys for eight trigrams)
      if (key >= "1" && key <= "8") {
        event.preventDefault();
        const stanceIndex = parseInt(key) - 1;
        const stances = Object.values(TrigramStance);
        if (stances[stanceIndex]) {
          onPlayerUpdate(activePlayer.id, {
            currentStance: stances[stanceIndex],
            stamina: Math.max(0, activePlayer.stamina - 3),
          });

          dispatch({
            type: "LOG_ACTION",
            payload: {
              message: `${stances[stanceIndex]} 자세로 변경! - Changed to ${stances[stanceIndex]} stance!`,
            },
          });
          dispatch({ type: "SWITCH_PLAYER" });
        }
        return;
      }

      // Combat actions
      switch (key) {
        case " ": // Space for basic attack
          event.preventDefault();
          const currentStanceData = TRIGRAM_DATA[activePlayer.currentStance];
          if (currentStanceData?.techniques?.primary) {
            const technique: KoreanTechnique = {
              id: `${activePlayer.currentStance}_basic`,
              name: currentStanceData.techniques.primary,
              koreanName: currentStanceData.techniques.primary.korean,
              englishName: currentStanceData.techniques.primary.english,
              romanized: currentStanceData.techniques.primary.korean,
              description: currentStanceData.techniques.primary.description,
              stance: activePlayer.currentStance,
              type: "strike" as any,
              damageType: "blunt" as any,
              damage: currentStanceData.techniques.primary.damage,
              kiCost: currentStanceData.techniques.primary.kiCost,
              staminaCost: currentStanceData.techniques.primary.staminaCost,
              accuracy: currentStanceData.techniques.primary.hitChance,
              range: 2.0,
              executionTime: 500,
              recoveryTime: 600,
              critChance: currentStanceData.techniques.primary.criticalChance,
              critMultiplier: 1.5,
              effects: [],
            };

            executeKoreanTechnique(technique, activePlayer.id, player2.id);
          }
          break;

        case "Shift": // Guard/block
          event.preventDefault();
          onPlayerUpdate(activePlayer.id, {
            isBlocking: true,
            stamina: Math.max(0, activePlayer.stamina - 5),
          });

          dispatch({
            type: "LOG_ACTION",
            payload: { message: "방어 자세! - Defensive stance!" },
          });

          setTimeout(() => {
            onPlayerUpdate(activePlayer.id, { isBlocking: false });
          }, 1000);

          dispatch({ type: "SWITCH_PLAYER" });
          break;
      }
    },
    [
      gameState.phase,
      gameState.activePlayerIndex,
      player1,
      player1Position,
      grid,
      onPlayerUpdate,
      validateAndUpdatePosition,
      executeKoreanTechnique,
      player2.id,
    ]
  );

  // Victory condition checking
  useEffect(() => {
    const checkVictoryConditions = (): void => {
      const player1Dead = player1.health <= 0 || player1.consciousness <= 0;
      const player2Dead = player2.health <= 0 || player2.consciousness <= 0;

      if (player1Dead && player2Dead) {
        dispatch({ type: "SET_PHASE", payload: { phase: "victory" } });
        onCombatEnd?.("draw");
      } else if (player1Dead) {
        setVictory({ winner: player2, method: "knockout" });
        dispatch({ type: "SET_PHASE", payload: { phase: "defeat" } });
        onCombatEnd?.(player2.id);
      } else if (player2Dead) {
        setVictory({ winner: player1, method: "knockout" });
        dispatch({ type: "SET_PHASE", payload: { phase: "victory" } });
        onCombatEnd?.(player1.id);
      }
    };

    if (gameState.phase === "combat") {
      checkVictoryConditions();
    }
  }, [
    player1.health,
    player1.consciousness,
    player2.health,
    player2.consciousness,
    gameState.phase,
    onCombatEnd,
    player1.id,
    player2.id,
  ]);

  // Initialize combat phase
  useEffect(() => {
    if (gameState.phase === "preparation") {
      const timer = setTimeout(() => {
        dispatch({ type: "SET_PHASE", payload: { phase: "combat" } });
        dispatch({
          type: "LOG_ACTION",
          payload: {
            message:
              "전투 시작! 팔괘의 힘을 보여라! - Combat begins! Show the power of the Eight Trigrams!",
          },
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.phase]);

  // AI turn management
  useEffect(() => {
    if (
      gameState.activePlayerIndex === 1 &&
      gameState.phase === "combat" &&
      gameSettings.aiEnabled
    ) {
      const aiDelay =
        aiDifficulty === "master"
          ? 800
          : aiDifficulty === "advanced"
          ? 1200
          : 1500;
      const timer = setTimeout(() => {
        executeAITurn();
      }, aiDelay);
      return () => clearTimeout(timer);
    }
  }, [
    gameState.activePlayerIndex,
    gameState.phase,
    aiDifficulty,
    gameSettings.aiEnabled,
    executeAITurn,
  ]);

  // Keyboard input handling
  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardInput);
    return () => window.removeEventListener("keydown", handleKeyboardInput);
  }, [handleKeyboardInput]);

  // Resource regeneration game loop
  useEffect(() => {
    const gameLoop = (): void => {
      if (gameState.phase === "combat") {
        onPlayerUpdate(player1.id, {
          ki: Math.min(player1.maxKi, player1.ki + gameSettings.kiRegenRate),
          stamina: Math.min(
            player1.maxStamina,
            player1.stamina + gameSettings.staminaRegenRate
          ),
        });

        onPlayerUpdate(player2.id, {
          ki: Math.min(player2.maxKi, player2.ki + gameSettings.kiRegenRate),
          stamina: Math.min(
            player2.maxStamina,
            player2.stamina + gameSettings.staminaRegenRate
          ),
        });
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [
    gameState.phase,
    player1.id,
    player1.maxKi,
    player1.ki,
    player1.maxStamina,
    player1.stamina,
    player2.id,
    player2.maxKi,
    player2.ki,
    player2.maxStamina,
    player2.stamina,
    onPlayerUpdate,
    gameSettings,
  ]);

  const cellSize = useMemo(
    () => Math.min(width / grid.size, height / grid.size),
    [width, height, grid.size]
  );
  const gridOffsetX = useMemo(
    () => (width - grid.size * cellSize) / 2,
    [width, grid.size, cellSize]
  );
  const gridOffsetY = useMemo(
    () => (height - grid.size * cellSize) / 2,
    [height, grid.size, cellSize]
  );

  return (
    <pixiContainer x={x} y={y} data-testid="game-engine">
      {/* Combat Grid Visualization */}
      <pixiGraphics
        draw={(g) => {
          g.clear();

          // Draw octagonal grid
          g.stroke({ width: 1, color: KOREAN_COLORS.UI_BORDER, alpha: 0.3 });
          for (let row = 0; row < grid.size; row++) {
            for (let col = 0; col < grid.size; col++) {
              if (grid.validPositions[row][col]) {
                const x = gridOffsetX + col * cellSize;
                const y = gridOffsetY + row * cellSize;
                g.rect(x, y, cellSize, cellSize);
              }
            }
          }
          g.stroke();

          // Highlight active positions
          g.fill({ color: KOREAN_COLORS.PLAYER_1_COLOR, alpha: 0.3 });
          g.rect(
            gridOffsetX + player1Position.col * cellSize,
            gridOffsetY + player1Position.row * cellSize,
            cellSize,
            cellSize
          );
          g.fill();

          g.fill({ color: KOREAN_COLORS.PLAYER_2_COLOR, alpha: 0.3 });
          g.rect(
            gridOffsetX + player2Position.col * cellSize,
            gridOffsetY + player2Position.row * cellSize,
            cellSize,
            cellSize
          );
          g.fill();
        }}
        data-testid="combat-grid"
      />

      {/* Game State Display */}
      <pixiContainer x={10} y={10} data-testid="game-state-display">
        <pixiText
          text={`라운드 ${gameState.turnCount + 1} | ${
            gameState.activePlayerIndex === 0
              ? player1.name.korean
              : player2.name.korean
          }의 차례`}
          style={{
            fontSize: 16,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
          }}
        />

        <pixiText
          text={`Phase: ${gameState.phase} | Active: Player ${
            gameState.activePlayerIndex + 1
          }`}
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          y={20}
        />
      </pixiContainer>

      {/* Combat Log Display */}
      <pixiContainer x={10} y={height - 120} data-testid="combat-log-display">
        <pixiText
          text="전투 기록 - Combat Log"
          style={{
            fontSize: 14,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
          }}
        />

        {gameState.combatLog.slice(-5).map((entry, index) => (
          <pixiText
            key={index}
            text={entry}
            style={{
              fontSize: 10,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
            }}
            y={20 + index * 15}
          />
        ))}
      </pixiContainer>

      {/* AI Thinking Indicator */}
      {gameState.aiThinking && (
        <pixiContainer x={width - 150} y={10} data-testid="ai-thinking">
          <pixiText
            text="AI 사고 중... - AI Thinking..."
            style={{
              fontSize: 12,
              fill: KOREAN_COLORS.WARNING_YELLOW,
            }}
          />
        </pixiContainer>
      )}

      {/* Debug Information */}
      {gameSettings.showDebug && (
        <pixiContainer x={width - 200} y={50} data-testid="debug-info">
          <pixiText
            text={`P1 Pos: ${player1Position.row},${player1Position.col}`}
            style={{
              fontSize: 10,
              fill: KOREAN_COLORS.TEXT_TERTIARY,
            }}
          />
          <pixiText
            text={`P2 Pos: ${player2Position.row},${player2Position.col}`}
            style={{
              fontSize: 10,
              fill: KOREAN_COLORS.TEXT_TERTIARY,
            }}
            y={15}
          />
          <pixiText
            text={`Distance: ${calculateDistance(
              player1Position,
              player2Position
            ).toFixed(1)}`}
            style={{
              fontSize: 10,
              fill: KOREAN_COLORS.TEXT_TERTIARY,
            }}
            y={30}
          />
        </pixiContainer>
      )}

      {/* Victory overlay */}
      {victory && (
        <pixiContainer x={width / 2} y={height / 2}>
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
              g.rect(-200, -100, 400, 200);
              g.fill();
            }}
          />
          <pixiText
            text={`${victory.winner.name.korean} 승리!`}
            style={{
              fontSize: 32,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
              align: "center",
            }}
            anchor={0.5}
          />
        </pixiContainer>
      )}
    </pixiContainer>
  );
};

export default GameEngine;

// Helper functions with proper type safety
function validatePosition(
  position: GridPosition,
  grid: OctagonalGrid
): boolean {
  const { row, col } = position;
  if (row < 0 || row >= grid.size) return false;
  if (col < 0 || col >= grid.size) return false;
  return grid.validPositions[row][col];
}

function calculateDistance(pos1: GridPosition, pos2: GridPosition): number {
  const dx = pos1.col - pos2.col;
  const dy = pos1.row - pos2.row;
  return Math.sqrt(dx * dx + dy * dy);
}

function isValidMove(
  from: GridPosition,
  to: GridPosition,
  grid: OctagonalGrid
): boolean {
  if (!validatePosition(to, grid)) return false;
  const distance = calculateDistance(from, to);
  return distance <= 1.5;
}

async function executeTrigramTechnique(
  technique: KoreanTechnique,
  attacker: PlayerState,
  defender: PlayerState
): Promise<{
  damage: number;
  isCritical: boolean;
  isVitalPoint: boolean;
  impact?: number;
}> {
  // Use technique and player data for realistic calculations
  const baseDamage = technique.damage || 15;
  const attackerSkill = attacker.level * 2;
  const defenderDefense = defender.defense || 5;

  const critRoll = Math.random();
  const isCritical = critRoll <= (technique.critChance || 0.1);
  const critMultiplier = isCritical ? technique.critMultiplier || 1.5 : 1.0;

  const skillBonus = Math.max(0, attackerSkill - defenderDefense) * 0.5;
  const finalDamage = Math.round((baseDamage + skillBonus) * critMultiplier);

  return {
    damage: finalDamage,
    isCritical,
    isVitalPoint: false,
    impact: finalDamage * 0.3,
  };
}
