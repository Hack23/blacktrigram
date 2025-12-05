/**
 * CombatScreen3D - Three.js-based combat screen
 *
 * Maintains all existing combat logic and state management
 * Uses Html overlays for UI and 3D meshes for game objects
 */

import { Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { useAudio } from "../../audio/AudioProvider";
import { useRoundTransition } from "../../hooks/useRoundTransition";
import { useWebGLContextLossHandler } from "../../hooks/useWebGLContextLossHandler";
import { HitEffect, PlayerState } from "../../systems";
import { CombatSystem } from "../../systems/CombatSystem";
import {
  AdaptiveDifficulty,
  getPersonalityByArchetype,
} from "../../systems/ai";
import { HitEffectType } from "../../systems/effects";
import {
  GameMode,
  PlayerArchetype,
  Position,
  TrigramStance,
  VitalPointSeverity,
} from "../../types";
import {
  FONT_FAMILY,
  KOREAN_COLORS,
  ROUND_ANNOUNCEMENT_TIMINGS,
} from "../../types/constants";
import { hexToRgbaString } from "../../utils/colorUtils";
import { usePlayerMovement } from "../../utils/inputSystem";
import { PerformanceOverlay3D } from "../../utils/performance";
import { createPlayerFromArchetype } from "../../utils/playerUtils";
import { VolumeControl } from "../ui/VolumeControl";
import { MatchCountdown } from "./components/MatchCountdown";
import { RoundAnnouncement } from "./components/RoundAnnouncement";
import { RoundStartAnnouncement } from "./components/RoundStartAnnouncement";
// TODO: Create HTML versions of these UI components for Three.js
// import { CombatControls } from "./components/CombatControls";
// import { CombatFooter } from "./components/CombatFooter";
// import { CombatHUD } from "./components/CombatHUD";
// import { CombatStatsPanel } from "./components/CombatStatsPanel";
import { useActionFeedback } from "../../hooks/useActionFeedback";
import { useCombatTimer } from "../../hooks/useCombatTimer";
import { useTechniqueSelection } from "../../hooks/useTechniqueSelection";
import { Technique } from "../../types";
import { ActionFeedback, TechniqueName } from "./components/ActionFeedback";
import CombatArena3D from "./components/CombatArena3D";
import { CombatTimer } from "./components/CombatTimer";
import { ComboCounter } from "./components/ComboCounter";
import { DamageNumbers } from "./components/DamageNumbers";
import HitEffects3D from "./components/HitEffects3D";
import Player3DModel from "./components/Player3DModel";
import { PlayerHUD } from "./components/PlayerHUD";
import { TechniqueBar } from "./components/TechniqueBar";
import { useAICombat } from "./hooks/useAICombat";
import { useCombatActions } from "./hooks/useCombatActions";
import { useCombatAudio } from "./hooks/useCombatAudio";
import { useCombatLayout } from "./hooks/useCombatLayout";
import { useCombatState } from "./hooks/useCombatState";

/**
 * Calculate accuracy percentage for a player
 * Uses hits / (hits + misses) when miss tracking is available
 * Falls back to 100% if hits exist but no miss tracking, or 0% if no combat activity
 */
const calculateAccuracy = (player: PlayerState): number => {
  const hits = player.hitsLanded ?? 0;
  const misses = player.misses ?? 0;
  const totalAttempts = hits + misses;

  // If we have miss tracking, use proper accuracy formula
  if (totalAttempts > 0) {
    return (hits / totalAttempts) * 100;
  }

  // Fallback: if no miss tracking and hits exist, show 100%
  // Otherwise 0% (no combat activity)
  return hits > 0 ? 100 : 0;
};

/**
 * Props for the CombatScreen3D component.
 * Provides all state and callbacks required for the 3D combat screen.
 */
export interface CombatScreen3DProps {
  /**
   * Array of player states (expects exactly 2 players).
   * Each PlayerState contains all combat and status information for a player.
   */
  readonly players: readonly PlayerState[];
  /**
   * Callback to update a player's state by index.
   * @param playerIndex - Index of the player to update (0 or 1).
   * @param updates - Partial PlayerState with updated fields.
   */
  readonly onPlayerUpdate: (
    playerIndex: number,
    updates: Partial<PlayerState>
  ) => void;
  /**
   * Current round number (1-based).
   */
  readonly currentRound: number;
  /**
   * Remaining time in seconds for the current round.
   */
  readonly timeRemaining: number;
  /**
   * Whether combat is currently paused.
   */
  readonly isPaused: boolean;
  /**
   * Callback when the user exits to the menu.
   */
  readonly onReturnToMenu: () => void;
  /**
   * Callback when the match ends, with the winner's index (0 or 1).
   * @param winner - Index of the winning player.
   */
  readonly onGameEnd: (winner: number) => void;
  /**
   * Optional game mode (affects rules/behavior).
   */
  readonly gameMode?: GameMode;
  /**
   * Canvas width in pixels. Defaults to 1200.
   */
  readonly width?: number;
  /**
   * Canvas height in pixels. Defaults to 800.
   */
  readonly height?: number;
}

/**
 * CombatScreen3D Component
 * Three.js-based combat screen with 3D characters and effects
 */
export const CombatScreen3D: React.FC<CombatScreen3DProps> = ({
  players,
  onPlayerUpdate,
  currentRound,
  timeRemaining,
  isPaused,
  onReturnToMenu,
  onGameEnd,
  width = 1200,
  height = 800,
}) => {
  // Track context loss count for debugging
  const contextLossCountRef = useRef(0);

  // Handle WebGL context loss and restoration
  useWebGLContextLossHandler({
    onContextLost: () => {
      console.warn("⚠️ WebGL context lost in CombatScreen");
      contextLossCountRef.current += 1;
    },
    onContextRestored: () => {
      console.log("✅ WebGL context restored in CombatScreen");
    },
    autoRestore: true,
  });

  // Audio context for button interactions
  const audio = useAudio();

  // Performance marks - only in dev mode and memoized
  useEffect(() => {
    if (import.meta.env.DEV) {
      performance.mark("combat-3d-render-start");
      return () => {
        performance.mark("combat-3d-render-end");
        performance.measure(
          "combat-3d-render",
          "combat-3d-render-start",
          "combat-3d-render-end"
        );
      };
    }
  }, []);

  // Layout calculations
  const { arenaBounds, isMobile } = useCombatLayout(width, height);

  // Combat state management
  const { state: combatState, actions: combatActions } = useCombatState();

  // Action feedback system for damage numbers, combo counter, and technique names
  const { state: feedbackState, actions: feedbackActions } = useActionFeedback({
    damageNumberDuration: 1500,
    actionFeedbackDuration: 1200,
    techniqueDuration: 2000,
    comboResetTime: 2000,
  });

  // Combat audio
  const combatAudio = useCombatAudio();

  // Match score tracking - use ref for internal updates, state for rendering
  const [matchScore, setMatchScore] = useState({ player1: 0, player2: 0 });
  const matchScoreRef = useRef(matchScore);

  // Helper to update match score without triggering setState in effects
  const updateMatchScore = useCallback((winner: 0 | 1) => {
    const newScore = {
      player1:
        winner === 0
          ? matchScoreRef.current.player1 + 1
          : matchScoreRef.current.player1,
      player2:
        winner === 1
          ? matchScoreRef.current.player2 + 1
          : matchScoreRef.current.player2,
    };
    matchScoreRef.current = newScore;
    // Use setTimeout to defer the setState call outside the effect
    setTimeout(() => setMatchScore(newScore), 0);
  }, []);

  // Internal round tracking (since parent may always pass currentRound=1)
  const [internalRound, setInternalRound] = useState(currentRound);

  // Match countdown state - DISABLED: skip countdown and start combat immediately
  // Using state for hasShownMatchCountdown to avoid ref access during render
  const [hasShownMatchCountdown, setHasShownMatchCountdown] = useState(true); // Already shown (skipped)
  const [showMatchCountdown, setShowMatchCountdown] = useState(false); // Don't show
  const [showRoundStart, setShowRoundStart] = useState(false);
  const [matchCountdownComplete, setMatchCountdownComplete] = useState(true); // Already complete (skipped)

  // Round transition management
  const {
    showAnnouncement,
    roundWinner,
    currentRoundNumber: transitionRoundNumber,
    skipCountdown,
    startTransition,
  } = useRoundTransition(
    {
      announcementDuration: ROUND_ANNOUNCEMENT_TIMINGS.ANNOUNCEMENT_DURATION,
      countdownDuration: ROUND_ANNOUNCEMENT_TIMINGS.COUNTDOWN_DURATION,
      transitionDuration: ROUND_ANNOUNCEMENT_TIMINGS.TRANSITION_DURATION,
    },
    () => {
      // Callback when transition completes - start next round
      combatActions.setRoundEnded(false);
      combatActions.setRoundStarted(false);
      combatActions.setRoundDisplayStatus(null);

      // Increment internal round counter for next round
      setInternalRound((prev) => prev + 1);

      // Show round start announcement for rounds after the first
      // (always true here since this callback runs after a round ends)
      setShowRoundStart(true);
    }
  );

  // Player positions
  const [playerPositions, setPlayerPositions] = useState<Position[]>([
    {
      x: arenaBounds.x + arenaBounds.width * 0.3,
      y: arenaBounds.y + arenaBounds.height * 0.6,
    },
    {
      x: arenaBounds.x + arenaBounds.width * 0.7,
      y: arenaBounds.y + arenaBounds.height * 0.6,
    },
  ]);

  // Convert 2D positions to 3D world coordinates
  const player1Position3D: [number, number, number] = useMemo(() => {
    const relX = (playerPositions[0].x - arenaBounds.x) / arenaBounds.width;
    const relZ = (playerPositions[0].y - arenaBounds.y) / arenaBounds.height;
    const x = relX * 16 - 8; // Map 0-1 to -8 to 8
    const z = relZ * 8 - 4; // Map 0-1 to -4 to 4
    return [x, 0, z];
  }, [playerPositions, arenaBounds]);

  const player2Position3D: [number, number, number] = useMemo(() => {
    const relX = (playerPositions[1].x - arenaBounds.x) / arenaBounds.width;
    const relZ = (playerPositions[1].y - arenaBounds.y) / arenaBounds.height;
    const x = relX * 16 - 8; // Map 0-1 to -8 to 8
    const z = relZ * 8 - 4; // Map 0-1 to -4 to 4
    return [x, 0, z];
  }, [playerPositions, arenaBounds]);

  // Combat system
  const combatSystem = useMemo(() => new CombatSystem(), []);

  // Player movement
  const { isMoving } = usePlayerMovement({
    enabled:
      !isPaused &&
      combatState.roundStarted &&
      !combatState.roundEnded &&
      matchCountdownComplete &&
      !showRoundStart,
    bounds: arenaBounds,
    onPositionChange: (newPosition: Position) => {
      setPlayerPositions((prev) => [newPosition, prev[1]]);
      onPlayerUpdate(0, { position: newPosition });
    },
    initialPosition: playerPositions[0],
    moveSpeed: 300,
  });

  // Valid players with complete state
  const validPlayers = useMemo((): [PlayerState, PlayerState] => {
    if (players.length === 0) {
      const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

      return [
        { ...player1, position: playerPositions[0] },
        { ...player2, position: playerPositions[1] },
      ];
    }

    const player1 = players[0];
    const player2 =
      players[1] ?? createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

    return [
      { ...player1, position: playerPositions[0] },
      { ...player2, position: playerPositions[1] },
    ];
  }, [players, playerPositions]);

  // Use ref to access latest player health without causing re-renders
  const validPlayersRef = useRef<[PlayerState, PlayerState]>(validPlayers);
  useEffect(() => {
    validPlayersRef.current = validPlayers;
  }, [validPlayers]);

  // Use refs for stable access to startTransition and internalRound
  const startTransitionRef = useRef(startTransition);
  const internalRoundRef = useRef(internalRound);
  useEffect(() => {
    startTransitionRef.current = startTransition;
    internalRoundRef.current = internalRound;
  }, [startTransition, internalRound]);

  // Combat messages
  const addCombatMessage = useCallback(
    (korean: string, english: string) => {
      const message = `${korean} | ${english}`;
      combatActions.addCombatMessage(message);
    },
    [combatActions]
  );

  // Combat timer with warnings and time up handler
  const handleTimeUp = useCallback(() => {
    // End round when time runs out
    if (!combatState.roundEnded) {
      combatActions.setRoundEnded(true);
      addCombatMessage("시간 종료!", "Time's Up!");

      // Use refs to get latest values without dependency issues
      const currentPlayers = validPlayersRef.current;
      const player1Health = currentPlayers[0].health;
      const player2Health = currentPlayers[1].health;

      if (player1Health > player2Health) {
        startTransitionRef.current(currentPlayers[0], internalRoundRef.current); // Player 1 wins round
      } else if (player2Health > player1Health) {
        startTransitionRef.current(currentPlayers[1], internalRoundRef.current); // Player 2 wins round
      } else {
        // Tie - no winner for this round
        startTransitionRef.current(null, internalRoundRef.current);
      }
    }
  }, [combatState.roundEnded, combatActions, addCombatMessage]);

  // Ref pattern to stabilize onTimeUp callback for timer
  const handleTimeUpRef = useRef(handleTimeUp);
  useEffect(() => {
    handleTimeUpRef.current = handleTimeUp;
  }, [handleTimeUp]);

  const timerState = useCombatTimer({
    initialTime: Math.max(0, timeRemaining), // Ensure non-negative
    isPaused:
      isPaused ||
      !combatState.roundStarted ||
      combatState.roundEnded ||
      !matchCountdownComplete ||
      showRoundStart,
    onTimeUp: useCallback(() => handleTimeUpRef.current(), []),
    warningThreshold: 10,
    urgentThreshold: 5,
  });

  // Shared round start logic
  const startRound = useCallback(() => {
    console.log("[CombatScreen3D] startRound called", {
      roundStarted: combatState.roundStarted,
      roundEnded: combatState.roundEnded,
    });
    if (!combatState.roundStarted && !combatState.roundEnded) {
      console.log(
        "[CombatScreen3D] Starting round - setting roundStarted=true"
      );
      combatActions.setRoundStarted(true);
      addCombatMessage("라운드 시작!", "Round Start!");

      const player = validPlayers[0];
      if (player?.archetype) {
        const playerArchetype = player.archetype.toLowerCase();
        combatAudio.playArchetypeMusic(playerArchetype, 2000);
      } else {
        combatAudio.playCombatMusic(2000);
      }
    } else {
      console.log(
        "[CombatScreen3D] startRound skipped - already started or ended"
      );
    }
  }, [
    combatState.roundStarted,
    combatState.roundEnded,
    combatActions,
    addCombatMessage,
    validPlayers,
    combatAudio,
  ]);

  // Auto-start first round since countdown is disabled
  // Use a separate ref for the timer to avoid cleanup canceling the start
  const hasAutoStartedRef = useRef(false);

  useEffect(() => {
    if (matchCountdownComplete && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      console.log("[CombatScreen3D] Auto-starting combat round...");
      // Directly set roundStarted=true without going through startRound callback
      // This avoids dependency issues with the callback reference
      combatActions.setRoundStarted(true);
      addCombatMessage("라운드 시작!", "Round Start!");

      // Start music
      const player = validPlayers[0];
      if (player?.archetype) {
        const playerArchetype = player.archetype.toLowerCase();
        combatAudio.playArchetypeMusic(playerArchetype, 2000);
      } else {
        combatAudio.playCombatMusic(2000);
      }
    }
  }, [
    matchCountdownComplete,
    combatActions,
    addCombatMessage,
    validPlayers,
    combatAudio,
  ]);

  // AI systems
  const adaptiveDifficulty = useMemo(() => new AdaptiveDifficulty(), []);

  // Persist AI difficulty metrics
  useEffect(() => {
    try {
      const savedMetrics = localStorage.getItem("ai_difficulty_metrics");
      if (savedMetrics) {
        adaptiveDifficulty.importMetrics(savedMetrics);
      }
    } catch (err) {
      console.warn("Failed to load AI difficulty metrics:", err);
    }

    return () => {
      try {
        const metrics = adaptiveDifficulty.exportMetrics();
        localStorage.setItem("ai_difficulty_metrics", metrics);
      } catch (err) {
        console.warn("Failed to save AI difficulty metrics:", err);
      }
    };
  }, [adaptiveDifficulty]);

  const aiPersonality = useMemo(
    () => getPersonalityByArchetype(validPlayers[1].archetype),
    [validPlayers]
  );

  // AI stance change handler
  const handleAIStanceChange = useCallback(
    (stance: TrigramStance) => {
      onPlayerUpdate(1, { currentStance: stance });
      addCombatMessage(
        `AI 자세 변경: ${stance}`,
        `AI Stance Change: ${stance}`
      );
    },
    [onPlayerUpdate, addCombatMessage]
  );

  // Hit effect handlers
  const handleEffectComplete = useCallback(
    (effectId: string) => {
      combatActions.removeHitEffect(effectId);
    },
    [combatActions]
  );

  const createHitEffect = useCallback(
    (
      id: string,
      type: HitEffectType,
      position: Position,
      intensity: number
    ): HitEffect => ({
      id,
      type,
      attackerId: "player1",
      defenderId: "player2",
      timestamp: Date.now(),
      duration: 1000,
      position,
      intensity,
      startTime: Date.now(),
    }),
    []
  );

  const addHitEffect = useCallback(
    (type: HitEffectType, position: Position, intensity: number = 1) => {
      const effect = createHitEffect(
        `effect_${Date.now()}`,
        type,
        position,
        intensity
      );
      combatActions.addHitEffect(effect);
    },
    [createHitEffect, combatActions]
  );

  // Combat action handlers
  const {
    handleAttack,
    handleDefend,
    handleStanceSwitch,
    handleAIAttack,
    handleAIDefend,
    handleAITechnique,
    moveAIPlayer,
  } = useCombatActions({
    validPlayers,
    playerPositions: [playerPositions[0], playerPositions[1]],
    combatState,
    combatActions,
    combatSystem,
    onPlayerUpdate,
    addCombatMessage,
    addHitEffect,
    arenaBounds,
    combatAudio,
  });

  // Technique selection and execution
  const techniqueSelection = useTechniqueSelection({
    player: validPlayers[0],
    enabled:
      !isPaused &&
      combatState.roundStarted &&
      !combatState.roundEnded &&
      matchCountdownComplete &&
      !showRoundStart,
    onTechniqueExecute: useCallback(
      (technique: Technique) => {
        // Show technique name in action feedback
        feedbackActions.showTechnique(
          technique.name.korean,
          technique.name.english
        );

        // Deduct resources
        onPlayerUpdate(0, {
          stamina: Math.max(0, validPlayers[0].stamina - technique.staminaCost),
          ki: Math.max(0, validPlayers[0].ki - technique.kiCost),
        });

        // Execute attack with technique damage
        handleAttack();

        // Play SFX
        combatAudio.playAttackSound("heavy");

        // Add combat message
        addCombatMessage(
          `${technique.name.korean} 사용!`,
          `Used ${technique.name.english}!`
        );
      },
      [
        validPlayers,
        onPlayerUpdate,
        feedbackActions,
        handleAttack,
        combatAudio,
        addCombatMessage,
      ]
    ),
  });

  // Convert cooldowns to Map for TechniqueBar
  const cooldownsMap = useMemo(() => {
    const map = new Map<string, number>();
    techniqueSelection.activeCooldowns.forEach((cd) => {
      map.set(cd.techniqueId, cd.remaining);
    });
    return map;
  }, [techniqueSelection.activeCooldowns]);

  // Extract player health values for dependency arrays
  const player1Health = validPlayers[0].health;
  const player2Health = validPlayers[1].health;

  // Watch for player 2 health decrease to trigger damage feedback
  const lastPlayer2HealthRef = useRef(player2Health);
  useEffect(() => {
    const currentHealth = player2Health;
    const previousHealth = lastPlayer2HealthRef.current;
    const damageDone = previousHealth - currentHealth;

    if (damageDone > 0 && combatState.roundStarted && !combatState.roundEnded) {
      // Determine damage type based on amount
      const getDamageType = (): "critical" | "vital" | "normal" => {
        if (damageDone >= 25) return "critical";
        if (damageDone >= 20) return "vital";
        return "normal";
      };
      const damageType = getDamageType();

      // Add damage number at opponent position
      feedbackActions.addDamageNumber(
        Math.round(damageDone),
        playerPositions[1],
        damageType
      );

      // Increment combo
      feedbackActions.incrementCombo();

      // Add action feedback for critical hits
      if (damageType === "critical") {
        feedbackActions.addActionFeedback(
          "critical",
          "Critical!",
          "치명타!",
          playerPositions[0]
        );
      }
    }

    lastPlayer2HealthRef.current = currentHealth;
  }, [
    player2Health,
    validPlayers,
    playerPositions,
    feedbackActions,
    combatState.roundStarted,
    combatState.roundEnded,
  ]);

  // Watch for player 1 health decrease (AI attacks player)
  const lastPlayer1HealthRef = useRef(player1Health);
  useEffect(() => {
    const currentHealth = player1Health;
    const previousHealth = lastPlayer1HealthRef.current;
    const damageDone = previousHealth - currentHealth;

    if (damageDone > 0 && combatState.roundStarted && !combatState.roundEnded) {
      // Add damage number at player position for AI hits
      const damageType =
        damageDone >= 20 ? ("critical" as const) : ("normal" as const);
      feedbackActions.addDamageNumber(
        Math.round(damageDone),
        playerPositions[0],
        damageType
      );
    }

    lastPlayer1HealthRef.current = currentHealth;
  }, [
    player1Health,
    validPlayers,
    playerPositions,
    feedbackActions,
    combatState.roundStarted,
    combatState.roundEnded,
  ]);

  // Create enhanced attack handler with action feedback
  const handleAttackWithFeedback = useCallback(() => {
    // Execute the attack - health change will trigger useEffect above
    handleAttack();
  }, [handleAttack]);

  // Create enhanced defend handler with action feedback
  const handleDefendWithFeedback = useCallback(() => {
    const defenderPos = playerPositions[0];
    handleDefend();
    feedbackActions.addActionFeedback(
      "blocked",
      "Blocked",
      "방어!",
      defenderPos
    );
  }, [handleDefend, playerPositions, feedbackActions]);

  // Note: Player 1 position is updated via the onPositionChange callback
  // in usePlayerMovement config above, not via useEffect

  // Round management
  useEffect(() => {
    if (isPaused) return;

    if (timeRemaining <= 0 && !combatState.roundEnded) {
      combatActions.setRoundEnded(true);
      combatActions.setRoundStarted(false);
      combatActions.setRoundDisplayStatus("end");

      combatAudio.stopCombatMusic(1000);

      const winner = validPlayers[0].health > validPlayers[1].health ? 0 : 1;
      const roundWinner = validPlayers[winner];

      // Update match score using deferred callback
      updateMatchScore(winner);

      addCombatMessage("라운드 종료!", "Round Over!");

      // Start round transition instead of immediately ending game
      setTimeout(() => {
        startTransition(roundWinner, internalRound);
      }, 1500);
    }
    // Note: Round start is now triggered by MatchCountdown and RoundStartAnnouncement components
    // via their onComplete callbacks to ensure proper sequencing with countdown animations
  }, [
    timeRemaining,
    combatState.roundEnded,
    combatState.roundStarted,
    validPlayers,
    onGameEnd,
    addCombatMessage,
    internalRound,
    isPaused,
    combatActions,
    combatAudio,
    startTransition,
    updateMatchScore,
  ]);

  // AI action execution
  const executeAIActionCallback = useCallback(
    (action: string, targetPos?: Position) => {
      switch (action) {
        case "attack":
          handleAIAttack();
          break;
        case "defend":
          handleAIDefend();
          break;
        case "technique":
        case "combo":
          handleAITechnique();
          break;
        case "approach":
        case "retreat":
        case "circle":
          if (targetPos) {
            moveAIPlayer(targetPos);
          }
          break;
        case "feint":
          {
            const playerPos = validPlayers[0].position;
            const feintOffset = 50;
            const feintPos = {
              x: playerPos.x + (Math.random() - 0.5) * feintOffset,
              y: playerPos.y + (Math.random() - 0.5) * feintOffset,
            };
            moveAIPlayer(feintPos);
            addCombatMessage("AI 페인트", "AI Feint");

            setTimeout(() => {
              if (
                !combatState.roundEnded &&
                combatState.roundStarted &&
                validPlayers.length >= 2
              ) {
                const currentPlayerPos = validPlayers[0].position;
                const currentAiPos = validPlayers[1].position;
                const dx = currentAiPos.x - currentPlayerPos.x;
                const dy = currentAiPos.y - currentPlayerPos.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const retreatDistance = 80;
                const retreatPos = {
                  x: Math.max(
                    arenaBounds.x,
                    Math.min(
                      arenaBounds.x + arenaBounds.width - 60,
                      currentPlayerPos.x + (dx / dist) * retreatDistance
                    )
                  ),
                  y: Math.max(
                    arenaBounds.y,
                    Math.min(
                      arenaBounds.y + arenaBounds.height - 180,
                      currentPlayerPos.y + (dy / dist) * retreatDistance
                    )
                  ),
                };
                moveAIPlayer(retreatPos);
              }
            }, 200);
          }
          break;
        case "counter":
          handleAIAttack();
          addCombatMessage("AI 반격!", "AI Counter!");
          break;
      }
    },
    [
      handleAIAttack,
      handleAIDefend,
      handleAITechnique,
      moveAIPlayer,
      addCombatMessage,
      validPlayers,
      arenaBounds,
      combatState.roundEnded,
      combatState.roundStarted,
    ]
  );

  // AI Combat System
  useAICombat({
    player: validPlayers[1],
    opponent: validPlayers[0],
    personality: aiPersonality,
    adaptiveDifficulty,
    isPaused,
    roundStarted: combatState.roundStarted,
    roundEnded: combatState.roundEnded,
    arenaBounds,
    onExecuteAction: executeAIActionCallback,
    onStanceChange: handleAIStanceChange,
  });

  // Update adaptive difficulty metrics
  useEffect(() => {
    if (combatState.roundEnded && validPlayers.length === 2) {
      const player = validPlayers[0];
      const totalAttacks = (player.hitsLanded ?? 0) + (player.hitsTaken ?? 0);

      if (totalAttacks === 0) return;

      adaptiveDifficulty.updateSkillMetrics({
        hitsLanded: player.hitsLanded ?? 0,
        totalAttacks,
        combosExecuted: player.comboCount ?? 0,
        perfectBlockCount: 0,
        avgReactionTimeMs: 500,
        vitalPointsHit: player.vitalPointHits ?? 0,
        effectiveStanceChanges: 0,
        damageDealt: player.totalDamageDealt ?? 0,
        damageTaken: player.totalDamageReceived ?? 0,
      });
    }
  }, [combatState.roundEnded, adaptiveDifficulty, validPlayers]);

  // Check game end conditions
  const checkGameEnd = useCallback(() => {
    if (combatState.roundEnded) return;

    const p1Defeated = validPlayers[0].health <= 0;
    const p2Defeated = validPlayers[1].health <= 0;

    if (p1Defeated || p2Defeated) {
      combatActions.setRoundEnded(true);
      combatActions.setRoundStarted(false);
      combatActions.setRoundDisplayStatus("ko");
      const winner = p1Defeated ? 1 : 0;
      const roundWinner = validPlayers[winner];

      // Update match score using deferred callback
      updateMatchScore(winner);

      addCombatMessage(
        p1Defeated ? "플레이어 1 패배" : "플레이어 1 승리!",
        p1Defeated ? "Player 1 Defeated" : "Player 1 Victory!"
      );

      // Start round transition
      setTimeout(() => {
        startTransition(roundWinner, internalRound);
      }, 1500);
    }
  }, [
    validPlayers,
    addCombatMessage,
    combatState.roundEnded,
    combatActions,
    internalRound,
    startTransition,
    updateMatchScore,
  ]);

  useEffect(() => {
    checkGameEnd();
  }, [player1Health, player2Health, checkGameEnd]);

  // Keyboard input handling
  useEffect(() => {
    const handleCombatInput = (event: KeyboardEvent) => {
      // Block all combat inputs during countdown or round start announcement
      if (!matchCountdownComplete || showRoundStart) {
        if (event.key === "Escape") {
          onReturnToMenu();
          event.preventDefault();
        }
        return;
      }

      if (
        !combatState.roundStarted ||
        combatState.roundEnded ||
        combatState.isExecutingTechnique
      ) {
        if (event.key === "Escape") {
          onReturnToMenu();
          event.preventDefault();
        }
        return;
      }

      const key = event.key.toLowerCase();

      if (key >= "1" && key <= "8") {
        const stanceIndex = parseInt(key) - 1;
        const stances: TrigramStance[] = [
          TrigramStance.GEON,
          TrigramStance.TAE,
          TrigramStance.LI,
          TrigramStance.JIN,
          TrigramStance.SON,
          TrigramStance.GAM,
          TrigramStance.GAN,
          TrigramStance.GON,
        ];
        handleStanceSwitch(stances[stanceIndex]);
        event.preventDefault();
      }

      if (key === " ") {
        handleAttackWithFeedback();
        event.preventDefault();
      }

      if (event.key === "Shift") {
        handleDefendWithFeedback();
        event.preventDefault();
      }

      if (event.key === "Escape") {
        onReturnToMenu();
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleCombatInput);
    return () => window.removeEventListener("keydown", handleCombatInput);
  }, [
    combatState.roundStarted,
    combatState.roundEnded,
    combatState.isExecutingTechnique,
    matchCountdownComplete,
    showRoundStart,
    handleStanceSwitch,
    handleAttackWithFeedback,
    handleDefendWithFeedback,
    onReturnToMenu,
  ]);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
        backgroundColor: "#0a0a0a",
      }}
      data-testid="combat-screen"
    >
      {/* Three.js Canvas for 3D rendering */}
      <Canvas
        camera={{ position: [0, 8, 12], fov: 60 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        shadows={false}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(KOREAN_COLORS.UI_BACKGROUND_DARK, 1);
          scene.fog = new THREE.Fog(KOREAN_COLORS.UI_BACKGROUND_DARK, 15, 35);
        }}
      >
        {/* 3D Combat Arena */}
        <CombatArena3D lighting="cyberpunk" />

        {/* Player 1 */}
        <Player3DModel
          playerState={validPlayers[0]}
          position={player1Position3D}
          animationState={
            combatState.isExecutingTechnique
              ? "technique_execute"
              : isMoving
              ? "walk"
              : "idle"
          }
          facing="right"
          showVitalPoints={true}
          vitalPointSeverityFilter={[
            VitalPointSeverity.CRITICAL,
            VitalPointSeverity.MAJOR,
          ]}
        />

        {/* Player 2 (AI) */}
        <Player3DModel
          playerState={validPlayers[1]}
          position={player2Position3D}
          animationState="idle"
          facing="left"
          showVitalPoints={true}
          vitalPointSeverityFilter={[
            VitalPointSeverity.CRITICAL,
            VitalPointSeverity.MAJOR,
          ]}
        />

        {/* Hit Effects */}
        <HitEffects3D
          effects={combatState.hitEffects}
          onEffectComplete={handleEffectComplete}
          arenaBounds={arenaBounds}
        />

        {/* Action Feedback - Damage Numbers */}
        <DamageNumbers
          damages={feedbackState.damageNumbers}
          isMobile={isMobile}
          arenaBounds={arenaBounds}
        />

        {/* Action Feedback - Action Indicators */}
        <ActionFeedback
          feedbacks={feedbackState.actionFeedbacks}
          isMobile={isMobile}
          arenaBounds={arenaBounds}
        />

        {/* Combo Counter */}
        <ComboCounter combo={feedbackState.comboCount} isMobile={isMobile} />

        {/* Technique Name Display */}
        {feedbackState.currentTechnique && (
          <TechniqueName
            korean={feedbackState.currentTechnique.korean}
            english={feedbackState.currentTechnique.english}
            isMobile={isMobile}
            onComplete={() => feedbackActions.hideTechnique()}
          />
        )}

        {/* Performance Overlay (Development Only) - positioned in bottom-left of 3D scene */}
        {import.meta.env.DEV && (
          <PerformanceOverlay3D position={[-9, -2, 5]} visible={true} />
        )}

        {/* Round display status overlay */}
        {combatState.roundDisplayStatus &&
          combatState.roundDisplayStatus !== null && (
            <Html fullscreen>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "72px",
                  fontWeight: "bold",
                  fontFamily: FONT_FAMILY.KOREAN,
                  color: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(
                    6,
                    "0"
                  )}`,
                  textShadow: "0 0 20px rgba(255, 215, 0, 0.8)",
                  pointerEvents: "none",
                  zIndex: 1000,
                }}
              >
                {combatState.roundDisplayStatus === "start" && "라운드 시작!"}
                {combatState.roundDisplayStatus === "fight" && "전투!"}
                {combatState.roundDisplayStatus === "end" && "라운드 종료"}
                {combatState.roundDisplayStatus === "ko" && "K.O.!"}
              </div>
            </Html>
          )}
      </Canvas>

      {/* Html UI Overlays (positioned absolutely over Canvas) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {/* Combat Title - Top Center */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: isMobile ? "18px" : "24px",
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
            color: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(
              6,
              "0"
            )}`,
            textShadow: "0 0 4px rgba(0,0,0,0.8)",
            zIndex: 200,
          }}
        >
          전투 | Combat
        </div>

        {/* Combat Timer - Below Title */}
        {combatState.roundStarted &&
          !combatState.roundEnded &&
          matchCountdownComplete &&
          !showRoundStart && (
            <CombatTimer
              formattedTime={timerState.formattedTime}
              warningLevel={timerState.warningLevel}
              isTimeUp={timerState.isTimeUp}
              isMobile={isMobile}
              style={{ top: isMobile ? "45px" : "50px" }}
            />
          )}

        {/* Volume Control */}
        <VolumeControl position="top-right" compact={isMobile} />

        {/* Player 1 HUD - Top Left */}
        <PlayerHUD
          player={validPlayers[0]}
          position="left"
          isMobile={isMobile}
        />

        {/* Player 2 HUD - Top Right */}
        <PlayerHUD
          player={validPlayers[1]}
          position="right"
          isMobile={isMobile}
        />

        {/* Technique Bar - Bottom Center */}
        {combatState.roundStarted &&
          !combatState.roundEnded &&
          matchCountdownComplete &&
          !showRoundStart && (
            <TechniqueBar
              techniques={techniqueSelection.availableTechniques}
              player={validPlayers[0]}
              selectedIndex={techniqueSelection.selectedIndex}
              cooldowns={cooldownsMap}
              onTechniqueSelect={techniqueSelection.selectTechnique}
              onTechniqueHover={(_tech) => {
                // Could add additional hover effects here
              }}
              isMobile={isMobile}
              screenWidth={width}
              screenHeight={height}
            />
          )}

        {/* Combat Controls and Stats */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? "90px" : "100px",
            left: isMobile ? "5px" : "15px",
            right: isMobile ? "5px" : "15px",
            display: "flex",
            justifyContent: "space-between",
            pointerEvents: "auto",
          }}
        >
          {/* TODO: Replace with CombatControlsHTML component */}
          <div
            style={{
              width: isMobile ? "45%" : "400px",
              background: "rgba(10, 10, 15, 0.8)",
              border: "2px solid #00ffff",
              borderRadius: "8px",
              padding: "10px",
              color: "#00ffff",
              fontFamily: FONT_FAMILY.KOREAN,
            }}
          >
            <div>Controls: A/D - Attack/Defend | 1-8 - Stances</div>
          </div>
          {/* TODO: Replace with CombatStatsPanelHTML component */}
          <div
            style={{
              width: isMobile ? "45%" : "400px",
              background: "rgba(10, 10, 15, 0.8)",
              border: "2px solid #00ffff",
              borderRadius: "8px",
              padding: "10px",
              color: "#00ffff",
              fontFamily: FONT_FAMILY.KOREAN,
              maxHeight: "140px",
              overflow: "auto",
            }}
          >
            {combatState.combatMessages.slice(-5).map((msg, idx) => (
              <div
                key={`msg-${idx}-${msg.slice(0, 20)}`}
                style={{ fontSize: "12px", marginBottom: "4px" }}
              >
                {msg}
              </div>
            ))}
          </div>
        </div>

        {/* Combat Footer - Back Button */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? "20px" : "30px",
            left: "50%",
            transform: "translateX(-50%)",
            minHeight: "50px",
            pointerEvents: "auto",
            zIndex: 100,
          }}
        >
          {/* Back button container */}
          <div
            style={{
              textAlign: "center",
              background: "rgba(10, 10, 15, 0.85)",
              border: `2px solid ${hexToRgbaString(
                KOREAN_COLORS.PRIMARY_CYAN,
                0.8
              )}`,
              borderRadius: "8px",
              padding: isMobile ? "8px 12px" : "10px 16px",
            }}
          >
            <style>
              {`
                .combat-return-menu-btn {
                  background: ${hexToRgbaString(
                    KOREAN_COLORS.PRIMARY_CYAN,
                    0.9
                  )};
                  color: ${hexToRgbaString(
                    KOREAN_COLORS.UI_BACKGROUND_DARK,
                    1
                  )};
                  border: none;
                  border-radius: 8px;
                  padding: ${isMobile ? "10px 16px" : "12px 24px"};
                  font-size: ${isMobile ? "14px" : "16px"};
                  font-family: ${FONT_FAMILY.KOREAN};
                  font-weight: bold;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  min-height: 40px;
                }
                .combat-return-menu-btn:hover {
                  transform: scale(1.05);
                  box-shadow: 0 0 20px ${hexToRgbaString(
                    KOREAN_COLORS.PRIMARY_CYAN,
                    0.8
                  )};
                }
              `}
            </style>
            <button
              onClick={onReturnToMenu}
              onMouseEnter={() => audio.playSFX("menu_hover")}
              className="combat-return-menu-btn"
              data-testid="return-to-menu-button"
              aria-label="Return to main menu"
            >
              메뉴로 | Return to Menu
            </button>
          </div>
        </div>

        {/* Pause Overlay */}
        {isPaused && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "48px",
              fontWeight: "bold",
              fontFamily: FONT_FAMILY.KOREAN,
              color: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(
                6,
                "0"
              )}`,
              textShadow: "0 0 10px rgba(0,0,0,0.8)",
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: "20px 40px",
              borderRadius: "10px",
            }}
          >
            일시정지 | Paused
          </div>
        )}
      </div>

      {/* Round Announcement Overlay */}
      {showAnnouncement && roundWinner && (
        <RoundAnnouncement
          roundNumber={transitionRoundNumber}
          roundWinner={roundWinner}
          currentScore={matchScore}
          roundStats={{
            damageDealt: roundWinner.totalDamageDealt ?? 0,
            hitsLanded: roundWinner.hitsLanded ?? 0,
            vitalPointsHit: roundWinner.vitalPointHits ?? 0,
            accuracy: calculateAccuracy(roundWinner),
          }}
          onCountdownComplete={() => {
            // Check if match is over (best of 3)
            if (matchScore.player1 >= 2 || matchScore.player2 >= 2) {
              const winner = matchScore.player1 >= 2 ? 0 : 1;
              onGameEnd(winner);
            }
          }}
          onSkip={() => {
            // Check if match is over (best of 3) before skipping
            if (matchScore.player1 >= 2 || matchScore.player2 >= 2) {
              const winner = matchScore.player1 >= 2 ? 0 : 1;
              onGameEnd(winner);
            } else {
              skipCountdown();
            }
          }}
          isMobile={isMobile}
          totalRounds={3}
        />
      )}

      {/* Match Start Countdown Overlay - only shows once at match start */}
      {showMatchCountdown && !hasShownMatchCountdown && (
        <MatchCountdown
          onComplete={() => {
            setHasShownMatchCountdown(true);
            setShowMatchCountdown(false);
            setMatchCountdownComplete(true);
            // Start the first round after countdown
            startRound();
          }}
          isMobile={isMobile}
          showSkip={false}
        />
      )}

      {/* Round Start Announcement for subsequent rounds */}
      {showRoundStart && internalRound > 1 && (
        <RoundStartAnnouncement
          roundNumber={internalRound}
          duration={2}
          onComplete={() => {
            setShowRoundStart(false);
            // Start combat for this round
            startRound();
          }}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default CombatScreen3D;
