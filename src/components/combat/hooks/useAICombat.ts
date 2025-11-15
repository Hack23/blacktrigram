import { useCallback, useEffect, useState } from "react";
import { PlayerState } from "@/systems";
import { Position } from "@/types";
import { ArenaBounds } from "./useCombatLayout";

/**
 * AI state for combat decision making
 */
export interface AIState {
  readonly nextAction: number;
  readonly actionCooldown: number;
  readonly isMoving: boolean;
  readonly targetPosition: Position;
  readonly aggressionLevel: number;
  readonly lastActionType: string;
  readonly consecutiveAttacks: number;
}

/**
 * AI combat callbacks
 */
export interface AICombatCallbacks {
  readonly onAttack: () => void;
  readonly onDefend: () => void;
  readonly onTechnique: () => void;
  readonly onMove: (position: Position) => void;
}

/**
 * Custom hook for managing AI combat behavior
 * Extracts AI decision-making logic from main component
 * 
 * @param enabled - Whether AI is active
 * @param playerPositions - Current positions of both players
 * @param validPlayers - Player state objects
 * @param arenaBounds - Arena boundaries for movement
 * @param callbacks - AI action callbacks
 */
export function useAICombat(
  enabled: boolean,
  playerPositions: readonly [Position, Position],
  validPlayers: readonly [PlayerState, PlayerState],
  arenaBounds: ArenaBounds,
  callbacks: AICombatCallbacks
) {
  const [aiState, setAiState] = useState<AIState>({
    nextAction: Date.now() + 1000,
    actionCooldown: 400,
    isMoving: false,
    targetPosition: { x: 0, y: 0 },
    aggressionLevel: 0.65,
    lastActionType: "idle",
    consecutiveAttacks: 0,
  });

  /**
   * Calculate distance between two positions
   */
  const calculateDistance = useCallback(
    (pos1: Position, pos2: Position): number => {
      return Math.sqrt(
        Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
      );
    },
    []
  );

  /**
   * Determine AI action based on game state
   */
  const determineAIAction = useCallback(
    (
      player1Pos: Position,
      player2Pos: Position,
      distanceToPlayer: number
    ): { action: string; targetPosition: Position } => {
      const healthPercent = validPlayers[1].health / validPlayers[1].maxHealth;
      const kiPercent = validPlayers[1].ki / validPlayers[1].maxKi;
      const isLowHealth = healthPercent < 0.3;
      const hasEnoughResources = kiPercent > 0.3;

      let aiAction = "idle";
      let newTargetPosition = aiState.targetPosition;

      // Combo attack logic - continue attacking if on a roll
      if (
        aiState.consecutiveAttacks > 0 &&
        aiState.consecutiveAttacks < 3 &&
        distanceToPlayer < 130
      ) {
        const comboRandom = Math.random();
        if (comboRandom < 0.7) {
          // 70% chance to continue combo
          aiAction = comboRandom < 0.5 ? "attack" : "technique";
        }
      } else if (isLowHealth) {
        // Defensive when low health - smarter retreat
        const shouldDefend = Math.random() < 0.4;
        if (shouldDefend && distanceToPlayer < 150) {
          aiAction = "defend";
        } else {
          aiAction = "retreat";
          newTargetPosition = {
            x: Math.max(
              arenaBounds.x,
              Math.min(
                arenaBounds.x + arenaBounds.width - 60,
                player2Pos.x + (player2Pos.x > player1Pos.x ? 100 : -100)
              )
            ),
            y: player2Pos.y + (Math.random() - 0.5) * 40,
          };
        }
      } else if (distanceToPlayer < 120) {
        // Close combat - varied attacks
        const random = Math.random();
        const aggression = aiState.aggressionLevel;

        if (random < aggression * 0.8) {
          aiAction = "attack";
        } else if (random < aggression * 0.8 + 0.1 && hasEnoughResources) {
          aiAction = "technique";
        } else {
          aiAction = "defend";
        }
      } else if (distanceToPlayer > 250) {
        // Move closer with tactical positioning
        aiAction = "approach";
        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 60;
        newTargetPosition = {
          x: Math.max(
            arenaBounds.x,
            Math.min(
              arenaBounds.x + arenaBounds.width - 60,
              player1Pos.x + offsetX
            )
          ),
          y: Math.max(
            arenaBounds.y,
            Math.min(
              arenaBounds.y + arenaBounds.height - 180,
              player1Pos.y + offsetY
            )
          ),
        };
      } else {
        // Medium distance - tactical movement or opportunistic attack
        const tacticChoice = Math.random();
        if (tacticChoice < 0.3 && hasEnoughResources) {
          aiAction = "technique";
        } else if (tacticChoice < 0.5) {
          aiAction = "approach";
          newTargetPosition = {
            x: player1Pos.x + (Math.random() - 0.5) * 80,
            y: player1Pos.y + (Math.random() - 0.5) * 60,
          };
        } else {
          aiAction = "circle";
          const angle = Math.atan2(
            player1Pos.y - player2Pos.y,
            player1Pos.x - player2Pos.x
          );
          const circleRadius = 150 + Math.random() * 50;
          newTargetPosition = {
            x: player1Pos.x + Math.cos(angle + Math.PI / 2) * circleRadius,
            y: player1Pos.y + Math.sin(angle + Math.PI / 2) * circleRadius,
          };
        }
      }

      return { action: aiAction, targetPosition: newTargetPosition };
    },
    [aiState, validPlayers, arenaBounds]
  );

  /**
   * Execute AI action
   */
  const executeAIAction = useCallback(
    (action: string, targetPos: Position) => {
      switch (action) {
        case "attack":
          callbacks.onAttack();
          break;
        case "defend":
          callbacks.onDefend();
          break;
        case "technique":
          callbacks.onTechnique();
          break;
        case "approach":
        case "retreat":
        case "circle":
          callbacks.onMove(targetPos);
          break;
      }
    },
    [callbacks]
  );

  // AI decision loop
  useEffect(() => {
    if (!enabled) return;

    const aiInterval = setInterval(() => {
      const now = Date.now();
      if (now < aiState.nextAction) return;

      const player1Pos = playerPositions[0];
      const player2Pos = playerPositions[1];
      const distanceToPlayer = calculateDistance(player1Pos, player2Pos);

      // Determine AI action
      const { action: aiAction, targetPosition: newTargetPosition } =
        determineAIAction(player1Pos, player2Pos, distanceToPlayer);

      // Track consecutive attacks for combo logic
      const newConsecutiveAttacks =
        aiAction === "attack" || aiAction === "technique"
          ? aiState.consecutiveAttacks + 1
          : 0;

      // Execute AI action
      executeAIAction(aiAction, newTargetPosition);

      // Set next action time with dynamic cooldown based on action
      const actionCooldown =
        aiAction === "attack" || aiAction === "technique" ? 600 : 400;

      setAiState((prev) => ({
        ...prev,
        nextAction: now + actionCooldown + Math.random() * 200,
        targetPosition: newTargetPosition,
        lastActionType: aiAction,
        consecutiveAttacks: newConsecutiveAttacks,
      }));
    }, 50); // 50ms interval for responsive AI

    return () => clearInterval(aiInterval);
  }, [
    enabled,
    playerPositions,
    validPlayers,
    aiState.nextAction,
    aiState.consecutiveAttacks,
    aiState.aggressionLevel,
    calculateDistance,
    determineAIAction,
    executeAIAction,
  ]);

  return {
    aiState,
    setAiState,
  };
}
