/**
 * useTrainingAI Hook
 * 
 * Manages AI opponent state and behavior in training mode
 */

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { TrainingAI, AITrainingDifficulty } from "../../../systems/ai/TrainingAI";
import { PlayerState } from "../../../systems/player";
import { Position, TrigramStance, PlayerArchetype } from "../../../types/common";
import { AIActionType } from "../../../systems/ai/DecisionTree";

/**
 * AI state for UI display
 */
export interface TrainingAIDisplayState {
  readonly position: Position;
  readonly stance: TrigramStance;
  readonly health: number;
  readonly maxHealth: number;
  readonly isAttacking: boolean;
  readonly currentAction: string;
}

/**
 * Hook options
 */
export interface UseTrainingAIOptions {
  readonly enabled: boolean;
  readonly difficulty: AITrainingDifficulty;
  readonly onAIAction?: (actionType: AIActionType) => void;
}

/**
 * Hook return type
 */
export interface UseTrainingAIReturn {
  readonly aiDisplayState: TrainingAIDisplayState;
  readonly aiPlayerState: PlayerState;
  readonly setDifficulty: (difficulty: AITrainingDifficulty) => void;
  readonly resetAI: () => void;
}

/**
 * Create a mock player state for AI
 */
function createAIPlayerState(
  position: Position,
  stance: TrigramStance,
  health: number
): PlayerState {
  return {
    id: "ai_opponent",
    name: { korean: "AI 상대", english: "AI Opponent" },
    archetype: PlayerArchetype.MUSA,
    health,
    maxHealth: 100,
    ki: 100,
    maxKi: 100,
    stamina: 100,
    maxStamina: 100,
    energy: 100,
    maxEnergy: 100,
    attackPower: 50,
    defense: 50,
    speed: 50,
    technique: 50,
    pain: 0,
    consciousness: 100,
    balance: 100,
    momentum: 0,
    currentStance: stance,
    combatState: "idle" as any,
    position,
    isBlocking: false,
    isStunned: false,
    isCountering: false,
    lastActionTime: Date.now(),
    recoveryTime: 0,
    lastStanceChangeTime: 0,
    statusEffects: [],
    activeEffects: [],
    vitalPoints: [],
    totalDamageReceived: 0,
    totalDamageDealt: 0,
    hitsTaken: 0,
    hitsLanded: 0,
    perfectStrikes: 0,
    vitalPointHits: 0,
  };
}

/**
 * useTrainingAI Hook
 * Manages AI opponent in training mode
 */
export function useTrainingAI(
  playerState: PlayerState,
  options: UseTrainingAIOptions
): UseTrainingAIReturn {
  const { enabled, difficulty, onAIAction } = options;

  // Initialize AI system
  const aiRef = useRef<TrainingAI | null>(null);
  const attackTimerRef = useRef(0);
  const [aiHealth, setAIHealth] = useState(100);
  const [aiStance, setAIStance] = useState<TrigramStance>(TrigramStance.GEON);
  const [aiPosition, setAIPosition] = useState<Position>({ x: 5, y: 0 });
  const [isAttacking, setIsAttacking] = useState(false);
  const [currentAction, setCurrentAction] = useState<string>("idle");

  // Initialize AI on mount
  useEffect(() => {
    if (!aiRef.current) {
      aiRef.current = new TrainingAI(difficulty, { x: 5, y: 0 });
    }
  }, []);

  // Update AI difficulty when it changes
  useEffect(() => {
    if (aiRef.current) {
      aiRef.current.setDifficulty(difficulty);
    }
  }, [difficulty]);

  // Activate/deactivate AI based on enabled state
  useEffect(() => {
    if (!aiRef.current) return;

    if (enabled && !aiRef.current.getState().isActive) {
      aiRef.current.activate();
    } else if (!enabled && aiRef.current.getState().isActive) {
      aiRef.current.deactivate();
    }
  }, [enabled]);

  // AI update loop using useFrame
  useFrame((_state, delta) => {
    if (!enabled || !aiRef.current) return;

    // Update attack timer
    if (attackTimerRef.current > 0) {
      attackTimerRef.current = Math.max(0, attackTimerRef.current - delta);
      if (attackTimerRef.current === 0) {
        setIsAttacking(false);
      }
    }

    const aiPlayerState = createAIPlayerState(aiPosition, aiStance, aiHealth);

    // Update AI decision
    const decision = aiRef.current.update(delta, playerState, aiPlayerState);

    if (decision) {
      setCurrentAction(decision.action);

      // Handle AI actions
      switch (decision.action) {
        case AIActionType.ATTACK:
        case AIActionType.TECHNIQUE:
          setIsAttacking(true);
          attackTimerRef.current = 0.3; // 300ms in seconds
          onAIAction?.(decision.action);
          break;

        case AIActionType.STANCE_CHANGE:
          if (decision.targetStance) {
            setAIStance(decision.targetStance);
            aiRef.current.updateStance(decision.targetStance);
          }
          break;

        case AIActionType.APPROACH:
        case AIActionType.RETREAT:
        case AIActionType.CIRCLE:
          if (decision.targetPosition) {
            // Smoothly interpolate to target position
            const newPosition = {
              x: aiPosition.x + (decision.targetPosition.x - aiPosition.x) * delta * 2,
              y: aiPosition.y + (decision.targetPosition.y - aiPosition.y) * delta * 2,
            };
            setAIPosition(() => newPosition);
            aiRef.current.updatePosition(newPosition);
          }
          break;

        default:
          setIsAttacking(false);
      }
    }
  });

  // Set difficulty
  const setDifficulty = useCallback((newDifficulty: AITrainingDifficulty) => {
    if (aiRef.current) {
      aiRef.current.setDifficulty(newDifficulty);
    }
  }, []);

  // Reset AI
  const resetAI = useCallback(() => {
    if (aiRef.current) {
      aiRef.current.reset();
      setAIHealth(100);
      setAIPosition({ x: 5, y: 0 });
      setAIStance(TrigramStance.GEON);
      setIsAttacking(false);
      setCurrentAction("idle");
    }
  }, []);

  // AI display state
  const aiDisplayState = useMemo<TrainingAIDisplayState>(
    () => ({
      position: aiPosition,
      stance: aiStance,
      health: aiHealth,
      maxHealth: 100,
      isAttacking,
      currentAction,
    }),
    [aiPosition, aiStance, aiHealth, isAttacking, currentAction]
  );

  // AI player state for combat systems
  const aiPlayerState = useMemo(
    () => createAIPlayerState(aiPosition, aiStance, aiHealth),
    [aiPosition, aiStance, aiHealth]
  );

  return {
    aiDisplayState,
    aiPlayerState,
    setDifficulty,
    resetAI,
  };
}

export default useTrainingAI;
