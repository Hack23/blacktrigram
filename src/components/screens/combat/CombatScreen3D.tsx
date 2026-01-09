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
import { useAudio } from "../../../audio/AudioProvider";
import { useKeyboardControls } from "../../../hooks/useKeyboardControls";
import { usePlayerAnimation } from "../../../hooks/usePlayerAnimation";
import { useRoundTransition } from "../../../hooks/useRoundTransition";
import { useWebGLContextLossHandler } from "../../../hooks/useWebGLContextLossHandler";
import { HitEffect, PlayerState } from "../../../systems";
import { CombatSystem } from "../../../systems/CombatSystem";
import { BalanceSystem } from "../../../systems/combat/BalanceSystem";
import {
  determineRecoveryType,
  getRecoveryAnimationState,
} from "../../../systems/animation/RecoveryAnimations";
import {
  AdaptiveDifficulty,
  getPersonalityByArchetype,
} from "../../../systems/ai";
import {
  AnimationEvents,
  getAnimationForTechnique,
} from "../../../systems/animation";
import { AnimationState } from "../../../systems/animation/types";
import { HitEffectType } from "../../../systems/effects";
import { TRIGRAM_STANCES_ORDER } from "../../../systems/trigram/types";
import {
  GameMode,
  PlayerArchetype,
  Position,
  TrigramStance,
} from "../../../types";
import {
  FONT_FAMILY,
  KOREAN_COLORS,
  ROUND_ANNOUNCEMENT_TIMINGS,
} from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";
import { usePlayerMovement } from "../../../utils/inputSystem";
import { PerformanceOverlay3D } from "../../../utils/performance";
import { createPlayerFromArchetype } from "../../../utils/playerUtils";
import { ResponsiveContainer } from "../../shared/base/ResponsiveContainer";
import { Z_INDEX } from "../../../types/LayoutTypes";
import { VolumeControl } from "../../shared/ui/VolumeControl";
import { InputBufferDisplay } from "./components/indicators/InputBufferDisplay";
import { KeyboardHints } from "./components/controls/KeyboardHints";
import { MatchCountdown } from "./components/feedback/MatchCountdown";
import { RoundAnnouncement } from "./components/feedback/RoundAnnouncement";
import { RoundStartAnnouncement } from "./components/feedback/RoundStartAnnouncement";
import { StanceChangeIndicator } from "./components/indicators/StanceChangeIndicator";
// TODO: Create HTML versions of these UI components for Three.js
// import { CombatControls } from "./components/CombatControls";
// import { CombatFooter } from "./components/CombatFooter";
// import { CombatHUD } from "./components/CombatHUD";
// import { CombatStatsPanel } from "./components/CombatStatsPanel";
import { useActionFeedback } from "../../../hooks/useActionFeedback";
import { useCombatTimer } from "../../../hooks/useCombatTimer";
import { useTechniqueSelection } from "../../../hooks/useTechniqueSelection";
import { GestureEvent } from "../../../hooks/useTouchControls";
import { Technique } from "../../../types";
import {
  animationStateToPlayerAnimation,
  convertPlayerStateToProps,
  getBalanceState,
} from "../../../utils/player3DHelpers";
import { ButtonEventType } from "../../shared/mobile/ActionButtons";
import { Direction, DPadEventType } from "../../shared/mobile/VirtualDPad";
import { SkeletalPlayer3D } from "../../shared/three";
import { VitalPointMarkers3D, VitalPointOverlayControls } from "./components";
import { ActionFeedback, TechniqueName } from "./components/feedback/ActionFeedback";
import { BodyPartHealthDisplay } from "./components/indicators/BodyPartHealthDisplay";
import CombatArena3D from "./components/arena/CombatArena3D";
import { CombatControlsPanel } from "./components/controls/CombatControlsPanel";
import { CombatTimer } from "./components/hud/CombatTimer";
import { ComboCounter } from "./components/indicators/ComboCounter";
import { DamageNumbers } from "./components/feedback/DamageNumbers";
import { DifficultyIndicator } from "./components/hud/DifficultyIndicator";
import { FPSMonitor } from "./components/hud/FPSMonitor";
import HitEffects3D from "./components/effects/HitEffects3D";
import { MobileControlsWrapper } from "./components/hud/MobileControlsWrapper";
import { PauseMenu } from "./components/controls/PauseMenu";
import { PlayerHUD } from "./components/hud/PlayerHUD";
import { GuardIndicator } from "./components/indicators/GuardIndicator";
import { PlayerStateOverlay } from "./components/hud/PlayerStateOverlay";
import { SpeedIndicatorHUD } from "./components/hud/SpeedIndicatorHUD";
import { TechniqueBar } from "./components/indicators/TechniqueBar";
import {
  AnimationUpdater,
  ANNOUNCEMENT_FADE_OUT_DELAY,
  calculateAccuracy,
  STANCE_INDEX_MAP,
} from "./helpers";
import { useAICombat } from "./hooks/useAICombat";
import { useCombatActions } from "./hooks/useCombatActions";
import { useCombatAudio } from "./hooks/useCombatAudio";
import { useCombatLayout } from "./hooks/useCombatLayout";
import { useCombatState } from "./hooks/useCombatState";
import { SpeedModifierSystem, MovementType } from "../../../systems/physics/SpeedModifierSystem";

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
  // Track when content is ready to render (prevents flash of empty content)
  const [contentReady, setContentReady] = useState(false);

  // Track context loss count for debugging
  const contextLossCountRef = useRef(0);

  // Handle WebGL context loss and restoration
  useWebGLContextLossHandler({
    onContextLost: () => {
      console.warn("⚠️ WebGL context lost in CombatScreen");
      contextLossCountRef.current += 1;
      setContentReady(false);
    },
    onContextRestored: () => {
      // Context restored - re-enable content after short delay
      setTimeout(() => setContentReady(true), 100);
    },
    autoRestore: true,
  });

  // Ensure content renders after component is mounted and stable
  useEffect(() => {
    const timer = setTimeout(() => setContentReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

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

  // Camera and rendering configuration based on device
  const cameraConfig = useMemo(() => {
    // Mobile: Tighter FOV and closer camera for better framing of smaller arena
    // Desktop: Wider FOV and further camera for full arena view
    if (isMobile) {
      return {
        fov: 55, // Tighter FOV for smaller mobile arena
        position: [0, 6, 10] as [number, number, number], // Closer camera
        near: 0.1,
        far: 1000,
      };
    }
    return {
      fov: 60, // Standard FOV for desktop
      position: [0, 8, 12] as [number, number, number], // Further back for full view
      near: 0.1,
      far: 1000,
    };
  }, [isMobile]);

  // Rendering quality based on device (optimize for 60fps on mobile)
  const renderConfig = useMemo(() => {
    if (isMobile) {
      return {
        shadowMapSize: 1024, // Lower shadow resolution for mobile
        dpr: [1, 1.5] as [number, number], // Lower pixel ratio on mobile
        antialias: true,
      };
    }
    return {
      shadowMapSize: 2048, // High-quality shadows on desktop
      dpr: [1, 2] as [number, number], // Full retina support on desktop
      antialias: true,
    };
  }, [isMobile]);

  // Combat state management
  const { state: combatState, actions: combatActions } = useCombatState();

  // ═══════════════════════════════════════════════════════════════════════════
  // Vital Point Overlay Controls State
  // ═══════════════════════════════════════════════════════════════════════════

  // Vital point overlay state (for both players)
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [severityFilters, setSeverityFilters] = useState<
    import("../../../types/common").VitalPointSeverity[]
  >([]);
  const [regionFilter, setRegionFilter] =
    useState<import("./components").BodyRegionFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLabels, setShowLabels] = useState(true);
  const [animated, setAnimated] = useState(true);
  const [scale, setScale] = useState(1.2); // Larger scale for better visibility in combat

  // Keyboard shortcut for toggling overlay (V key)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "v" || e.key === "V") {
        setOverlayVisible((prev) => !prev);
        audio.playSFX("menu_select");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [audio]);

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

  // Player 1 position (controlled by player movement)
  // Player 1 starts closer to center - adjusted for arena scale
  const [player1Position, setPlayer1Position] = useState<Position>({
    x: arenaBounds.x + arenaBounds.width * 0.35,
    y: arenaBounds.y + arenaBounds.height * 0.5,
  });

  // Pause menu state - local state for pause menu visibility
  // Local state for pause menu UI visibility
  // Note: isPaused (prop) controls game pause from parent, showPauseMenu (state) controls menu UI
  // Both need to be checked because:
  // - isPaused: External pause state (e.g., from parent component or global game state)
  // - showPauseMenu: Local UI state for pause menu overlay
  // They can be out of sync intentionally (e.g., parent pauses game but menu not shown)
  const [showPauseMenu, setShowPauseMenu] = useState(false);

  // Pause menu handlers
  const handlePause = useCallback(() => {
    setShowPauseMenu(true);
    audio.playSFX("menu_select");
  }, [audio]);

  const handleResume = useCallback(() => {
    setShowPauseMenu(false);
    audio.playSFX("menu_select");
  }, [audio]);

  const handleRestart = useCallback(() => {
    // Note: React 19 automatically batches all these state updates into a single render
    // This ensures atomic state transitions without race conditions

    // Reset to first round
    setInternalRound(1);
    setMatchScore({ player1: 0, player2: 0 });
    matchScoreRef.current = { player1: 0, player2: 0 };

    // Reset combat state
    combatActions.setRoundEnded(false);
    combatActions.setRoundStarted(false);
    combatActions.setRoundDisplayStatus(null);

    // Reset player health, resources, and visual state
    // Includes consciousness, pain, balance to clear any blur/vignette effects
    onPlayerUpdate(0, {
      health: 100,
      stamina: 100,
      ki: 100,
      consciousness: 100,
      pain: 0,
      balance: 100,
    });
    onPlayerUpdate(1, {
      health: 100,
      stamina: 100,
      ki: 100,
      consciousness: 100,
      pain: 0,
      balance: 100,
    });

    // Reset player positions to starting positions for rematch
    setPlayer1Position({
      x: arenaBounds.x + arenaBounds.width * 0.35,
      y: arenaBounds.y + arenaBounds.height * 0.5,
    });
    onPlayerUpdate(1, {
      position: {
        x: arenaBounds.x + arenaBounds.width * 0.65,
        y: arenaBounds.y + arenaBounds.height * 0.5,
      },
    });

    // Close pause menu and start first round
    // The timer will reset automatically via the initialTime prop when round starts
    setShowPauseMenu(false);
    setShowRoundStart(true);

    audio.playSFX("menu_select");
  }, [audio, combatActions, onPlayerUpdate, arenaBounds, setPlayer1Position]);

  // Round transition complete handler - checks for match end or starts next round
  const handleRoundTransitionComplete = useCallback(() => {
    if (import.meta.env.DEV) {
      console.log("[DEV] Round transition complete, checking match status");
    }
    // Check if match is over (best of 3 - first to 2 wins)
    const currentScore = matchScoreRef.current;
    if (currentScore.player1 >= 2 || currentScore.player2 >= 2) {
      // Match is over - call onGameEnd instead of starting next round
      const matchWinner = currentScore.player1 >= 2 ? 0 : 1;
      if (import.meta.env.DEV) {
        console.log("[DEV] Match over, winner:", matchWinner);
      }
      onGameEnd(matchWinner);
      return; // Don't start next round
    }

    // Reset all combat state for next round (combos, hit effects, messages cleared)
    combatActions.resetRoundState();

    // Increment internal round counter for next round
    // Use the updater function to get the new value and trigger announcement
    setInternalRound((prev) => {
      const nextRound = prev + 1;
      if (import.meta.env.DEV) {
        console.log("[DEV] Incrementing round from", prev, "to", nextRound);
      }
      // Wait for transition duration plus fade-out to complete before showing next round announcement
      setTimeout(() => {
        if (import.meta.env.DEV) {
          console.log(
            "[DEV] Showing round start announcement for round",
            nextRound
          );
        }
        setShowRoundStart(true);
      }, ANNOUNCEMENT_FADE_OUT_DELAY);
      return nextRound;
    });

    // Reset player health, resources, and visual state for next round
    // Includes consciousness, pain, balance to clear any blur/vignette effects
    onPlayerUpdate(0, {
      health: 100,
      stamina: 100,
      ki: 100,
      consciousness: 100,
      pain: 0,
      balance: 100,
    });
    onPlayerUpdate(1, {
      health: 100,
      stamina: 100,
      ki: 100,
      consciousness: 100,
      pain: 0,
      balance: 100,
    });

    // Reset player positions to starting positions for new round
    setPlayer1Position({
      x: arenaBounds.x + arenaBounds.width * 0.35,
      y: arenaBounds.y + arenaBounds.height * 0.5,
    });
    // Player 2 position is reset via onPlayerUpdate
    onPlayerUpdate(1, {
      position: {
        x: arenaBounds.x + arenaBounds.width * 0.65,
        y: arenaBounds.y + arenaBounds.height * 0.5,
      },
    });
  }, [
    combatActions,
    onGameEnd,
    onPlayerUpdate,
    arenaBounds,
    // Note: setPlayer1Position is a stable React setState function and won't cause unnecessary re-renders
    setPlayer1Position,
  ]);

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
    handleRoundTransitionComplete
  );

  // Player 2 position - derived from players prop (AI-controlled)
  // Default position is used when players prop is empty or player2 has no position
  // Player 2 (AI) starts at right side of arena - adjusted for arena scale
  const player2Position = useMemo<Position>(() => {
    if (players.length >= 2 && players[1].position) {
      return players[1].position;
    }
    return {
      x: arenaBounds.x + arenaBounds.width * 0.65,
      y: arenaBounds.y + arenaBounds.height * 0.5,
    };
  }, [players, arenaBounds]);

  // Combined positions for backward compatibility with existing code
  const playerPositions = useMemo<Position[]>(() => {
    return [player1Position, player2Position];
  }, [player1Position, player2Position]);

  // Convert 2D positions to 3D world coordinates
  // Scale 3D coordinates based on arena scale for consistent positioning
  const player1Position3D: [number, number, number] = useMemo(() => {
    const relX = (playerPositions[0].x - arenaBounds.x) / arenaBounds.width;
    const relZ = (playerPositions[0].y - arenaBounds.y) / arenaBounds.height;
    // Map 0-1 to world coordinates, scaled for arena size
    const worldWidth = 16 * arenaBounds.scale;
    const worldDepth = 8 * arenaBounds.scale;
    const x = relX * worldWidth - worldWidth / 2;
    const z = relZ * worldDepth - worldDepth / 2;
    return [x, 0, z];
  }, [playerPositions, arenaBounds]);

  const player2Position3D: [number, number, number] = useMemo(() => {
    const relX = (playerPositions[1].x - arenaBounds.x) / arenaBounds.width;
    const relZ = (playerPositions[1].y - arenaBounds.y) / arenaBounds.height;
    // Map 0-1 to world coordinates, scaled for arena size
    const worldWidth = 16 * arenaBounds.scale;
    const worldDepth = 8 * arenaBounds.scale;
    const x = relX * worldWidth - worldWidth / 2;
    const z = relZ * worldDepth - worldDepth / 2;
    return [x, 0, z];
  }, [playerPositions, arenaBounds]);

  // Calculate dynamic rotations so players always face each other
  // atan2(dx, dz) gives the Y-axis rotation needed to face direction (dx, dz)
  // This is the standard formula for rotating around Y to point at a target
  const player1Rotation = useMemo(() => {
    const dx = player2Position3D[0] - player1Position3D[0];
    const dz = player2Position3D[2] - player1Position3D[2];
    return Math.atan2(dx, dz);
  }, [player1Position3D, player2Position3D]);

  const player2Rotation = useMemo(() => {
    const dx = player1Position3D[0] - player2Position3D[0];
    const dz = player1Position3D[2] - player2Position3D[2];
    return Math.atan2(dx, dz);
  }, [player1Position3D, player2Position3D]);

  // Combat system
  const combatSystem = useMemo(() => new CombatSystem(), []);

  // Balance system for recovery mechanics
  const balanceSystem = useMemo(() => new BalanceSystem(), []);

  // Speed Modifier System for dynamic movement speed calculations
  const speedModifierSystem = useMemo(() => new SpeedModifierSystem(), []);

  // Track speed modifiers for HUD display
  const [player1SpeedModifiers, setPlayer1SpeedModifiers] = useState({
    finalSpeed: 2.0,
    baseSpeed: 2.0,
    finalAcceleration: 4.0,
  });
  const [player2SpeedModifiers, setPlayer2SpeedModifiers] = useState({
    finalSpeed: 2.0,
    baseSpeed: 2.0,
    finalAcceleration: 4.0,
  });

  // Calculate speed modifiers for both players when state changes
  // Updates at 5Hz (every 200ms) to balance responsiveness and performance
  useEffect(() => {
    const updateSpeedModifiers = () => {
      if (players.length >= 2) {
        // Player 1 speed modifiers
        const player1Modifiers = speedModifierSystem.calculateSpeedModifiers(
          players[0],
          MovementType.WALKING, // Base calculation, actual type determined by input
          false // isCrouching
        );
        setPlayer1SpeedModifiers({
          finalSpeed: player1Modifiers.finalSpeed,
          baseSpeed: player1Modifiers.baseSpeed,
          finalAcceleration: player1Modifiers.finalAcceleration,
        });

        // Player 2 speed modifiers
        const player2Modifiers = speedModifierSystem.calculateSpeedModifiers(
          players[1],
          MovementType.WALKING,
          false
        );
        setPlayer2SpeedModifiers({
          finalSpeed: player2Modifiers.finalSpeed,
          baseSpeed: player2Modifiers.baseSpeed,
          finalAcceleration: player2Modifiers.finalAcceleration,
        });
      }
    };

    // Initial calculation
    updateSpeedModifiers();

    // Update every 200ms (5Hz) for responsive feedback without excessive re-renders
    const intervalId = setInterval(updateSpeedModifiers, 200);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]); // speedModifierSystem is memoized and never changes

  // Calculate leg injury factor for physics-based movement
  // Averages left and right leg health to determine speed penalty
  const calculateLegInjuryFactor = useCallback((player: PlayerState): number => {
    if (!player.bodyPartHealth) return 0;
    
    const leftLeg = player.bodyPartHealth.legLeft ?? player.maxHealth;
    const rightLeg = player.bodyPartHealth.legRight ?? player.maxHealth;
    const maxHealth = player.maxHealth;
    
    const averageLegHealth = (leftLeg + rightLeg) / (2 * maxHealth);
    return Math.max(0, Math.min(1, 1.0 - averageLegHealth)); // 0 = healthy, 1 = critical
  }, []);

  // Get player1 data for movement physics
  // Memoize based on player1 reference (React Compiler prefers less specific dependencies)
  const player1 = players.length > 0 ? players[0] : undefined;
  const player1Data = useMemo(() => {
    const p1 =
      player1 ?? createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
    return {
      currentStance: p1.currentStance,
      legInjuryFactor: calculateLegInjuryFactor(p1),
    };
  }, [player1, calculateLegInjuryFactor]);

  // Track current attack animation for each player
  // Used to determine which skeletal animation to play during attacks
  // 각 플레이어의 현재 공격 애니메이션 추적
  const [player1AttackAnimation, setPlayer1AttackAnimation] = useState<
    string | undefined
  >(undefined);
  const [player2AttackAnimation, setPlayer2AttackAnimation] = useState<
    string | undefined
  >(undefined);

  // Player movement with physics-based acceleration and stance modifiers
  const { isMoving: player1IsMoving } = usePlayerMovement({
    enabled:
      !isPaused &&
      combatState.roundStarted &&
      !combatState.roundEnded &&
      matchCountdownComplete &&
      !showRoundStart,
    bounds: arenaBounds,
    onPositionChange: (newPosition: Position) => {
      setPlayer1Position(newPosition);
      onPlayerUpdate(0, { position: newPosition });
    },
    initialPosition: player1Position,
    moveSpeed: 300,
    // Physics parameters for realistic movement (always enabled)
    currentStance: player1Data.currentStance,
    legInjuryFactor: player1Data.legInjuryFactor,
    isRunning: false, // TODO: Add run key detection
    useTacticalSteps: false,
    // Speed modifier overrides from SpeedModifierSystem
    maxSpeedOverride: player1SpeedModifiers.finalSpeed,
    accelerationOverride: player1SpeedModifiers.finalAcceleration,
  });

  // Use ref to store attack handler to avoid circular dependencies
  const handleAttackRef = useRef<(() => void) | null>(null);
  
  // Ref for player1Animation to avoid circular dependencies in animation events
  const player1AnimationRef = useRef<ReturnType<typeof usePlayerAnimation> | null>(null);
  
  // Ref for validPlayers to avoid circular dependencies
  const validPlayersRefForAnimation = useRef<[PlayerState, PlayerState] | null>(null);

  // Refs to clear attack animations after completion
  const clearPlayer1AttackAnimation = useRef<() => void>(() => {
    setPlayer1AttackAnimation(undefined);
  });
  const clearPlayer2AttackAnimation = useRef<() => void>(() => {
    setPlayer2AttackAnimation(undefined);
  });

  // Player animation state machines - manages animation transitions at 60fps
  // Memoize events object to maintain stability (required by usePlayerAnimation)
  const player1AnimationEvents = useMemo<AnimationEvents>(
    () => ({
      onFrame: (frame, state) => {
        // Execute attack at midpoint of animation (frame 6 of 12)
        if (state === AnimationState.ATTACK && frame === 6) {
          // Attack connects at the midpoint - execute combat logic here
          handleAttackRef.current?.();
        }
      },
      onAnimationComplete: (state) => {
        // Handle animation completion
        if (state === AnimationState.ATTACK || state === AnimationState.DEFEND) {
          combatActions.setExecutingTechnique(false);
          // Clear attack animation when attack completes
          // 공격 완료 시 공격 애니메이션 초기화
          if (state === AnimationState.ATTACK) {
            clearPlayer1AttackAnimation.current();
          }
        } else if (state === AnimationState.STANCE_CHANGE) {
          // Stance change animation completed - transition to stance guard
          // 자세 변경 완료 - 자세 가드로 전환
          audio.playSFX("menu_select");
          const players = validPlayersRefForAnimation.current;
          const currentStance = players?.[0]?.currentStance;
          if (currentStance && player1AnimationRef.current) {
            player1AnimationRef.current.transitionToStanceGuard(currentStance);
          }
        }
      },
    }),
    [combatActions, audio]
  );

  const player1Animation = usePlayerAnimation({
    events: player1AnimationEvents,
  });
  
  // Store animation ref for use in event callbacks
  useEffect(() => {
    player1AnimationRef.current = player1Animation;
  }, [player1Animation]);

  const player2Animation = usePlayerAnimation({
    events: {
      onFrame: (frame, state) => {
        if (state === AnimationState.ATTACK && frame === 6) {
          // AI attack hit detection
        }
      },
      onAnimationComplete: (state) => {
        // Clear AI attack animation when attack completes
        // AI 공격 완료 시 공격 애니메이션 초기화
        if (state === AnimationState.ATTACK) {
          clearPlayer2AttackAnimation.current();
        }
      },
    },
  });

  // Sync movement with player 1 animation (avoid circular dependency)
  const prevPlayer1IsMovingRef = useRef<boolean>(player1IsMoving);
  useEffect(() => {
    // Only trigger transition when isMoving changes
    if (prevPlayer1IsMovingRef.current !== player1IsMoving) {
      if (player1IsMoving) {
        player1Animation.transitionTo(AnimationState.WALK);
      } else if (player1Animation.currentState === AnimationState.WALK) {
        player1Animation.transitionTo(AnimationState.IDLE);
      }
      prevPlayer1IsMovingRef.current = player1IsMoving;
    }
  }, [player1IsMoving, player1Animation]);

  // Movement detection threshold for AI animation sync (in pixels)
  // Lower values = more sensitive to small movements, higher values = smoother transitions
  const MOVEMENT_DETECTION_THRESHOLD = 0.5;

  // Sync movement with player 2 animation (AI movement detection)
  const prevPlayer2PositionRef = useRef(player2Position);
  useEffect(() => {
    const currentPos = playerPositions[1];
    const prevPos = prevPlayer2PositionRef.current;

    // Detect if Player2 (AI) is moving by comparing positions
    const isMoving =
      Math.abs(currentPos.x - prevPos.x) > MOVEMENT_DETECTION_THRESHOLD ||
      Math.abs(currentPos.y - prevPos.y) > MOVEMENT_DETECTION_THRESHOLD;

    if (isMoving) {
      // AI is moving - transition to walk animation
      if (
        player2Animation.currentState !== AnimationState.WALK &&
        player2Animation.currentState !== AnimationState.ATTACK
      ) {
        player2Animation.transitionTo(AnimationState.WALK);
      }
    } else {
      // AI stopped - transition back to idle if currently walking
      if (player2Animation.currentState === AnimationState.WALK) {
        player2Animation.transitionTo(AnimationState.IDLE);
      }
    }

    prevPlayer2PositionRef.current = currentPos;
  }, [playerPositions, player2Animation]);

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
    validPlayersRefForAnimation.current = validPlayers;
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
        // Player 1 wins - update match score
        updateMatchScore(0);
        startTransitionRef.current(currentPlayers[0], internalRoundRef.current); // Player 1 wins round
      } else if (player2Health > player1Health) {
        // Player 2 wins - update match score
        updateMatchScore(1);
        startTransitionRef.current(currentPlayers[1], internalRoundRef.current); // Player 2 wins round
      } else {
        // Tie - no winner for this round, no score update
        startTransitionRef.current(null, internalRoundRef.current);
      }
    }
  }, [
    combatState.roundEnded,
    combatActions,
    addCombatMessage,
    updateMatchScore,
  ]);

  // Ref pattern to stabilize onTimeUp callback for timer
  const handleTimeUpRef = useRef(handleTimeUp);
  useEffect(() => {
    handleTimeUpRef.current = handleTimeUp;
  }, [handleTimeUp]);

  // Create a unique key for timer reset based on round number
  // This forces the timer to reset when a new round starts
  const timerResetKey = `round-${internalRound}`;

  const timerState = useCombatTimer({
    initialTime: Math.max(0, timeRemaining),
    isPaused:
      isPaused ||
      !combatState.roundStarted ||
      combatState.roundEnded ||
      !matchCountdownComplete ||
      showRoundStart,
    onTimeUp: useCallback(() => handleTimeUpRef.current(), []),
    warningThreshold: 10,
    urgentThreshold: 5,
    // Pass round number to force timer reset on new rounds
    resetKey: timerResetKey,
  });

  // Shared round start logic - forces round to start regardless of current state
  // This is called after state has been reset, so we trust the caller
  // Note: Using useCallback with complete dependencies to ensure closure has latest state
  const startRound = useCallback(() => {
    // Always start the round when this is called - the caller is responsible
    // for ensuring this is the right time to start
    if (import.meta.env.DEV) {
      console.log("[DEV] Starting round, setting roundStarted=true");
    }
    combatActions.setRoundStarted(true);
    combatActions.setRoundEnded(false); // Ensure roundEnded is false
    addCombatMessage("라운드 시작!", "Round Start!");

    const player = validPlayers[0];
    if (player?.archetype) {
      const playerArchetype = player.archetype.toLowerCase();
      combatAudio.playArchetypeMusic(playerArchetype, 2000);
    } else {
      combatAudio.playCombatMusic(2000);
    }
  }, [combatActions, addCombatMessage, validPlayers, combatAudio]);

  // Auto-start first round since countdown is disabled
  // Use a separate ref for the timer to avoid cleanup canceling the start
  const hasAutoStartedRef = useRef(false);

  useEffect(() => {
    if (matchCountdownComplete && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
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
      const currentStance = validPlayers[1].currentStance;
      
      // Start stance-specific transition animation for AI
      player2Animation.transitionToStanceChange(currentStance, stance);
      
      onPlayerUpdate(1, { currentStance: stance });
      addCombatMessage(
        `AI 자세 변경: ${stance}`,
        `AI Stance Change: ${stance}`
      );
    },
    [validPlayers, player2Animation, onPlayerUpdate, addCombatMessage]
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

  // Callback for updating player positions after knockback
  const handlePlayerPositionUpdate = useCallback(
    (playerIndex: number, position: Position) => {
      if (playerIndex === 0) {
        setPlayer1Position(position);
        onPlayerUpdate(0, { position });
      } else if (playerIndex === 1) {
        // For AI, update position through onPlayerUpdate
        // This will be reflected in player2Position which is derived from players prop
        onPlayerUpdate(1, { position });
      }
    },
    [onPlayerUpdate, setPlayer1Position]
  );

  // Combat action handlers
  const {
    handleAttack,
    handleDefend,
    handleStanceSwitch,
    handleStanceSideSwitch,
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
    onPlayerPositionUpdate: handlePlayerPositionUpdate,
    addCombatMessage,
    addHitEffect,
    arenaBounds,
    combatAudio,
    playerAnimations: {
      player1: player1Animation,
      player2: player2Animation,
    },
  });

  // Store handleAttack in ref for animation callback (avoid circular dependency)
  useEffect(() => {
    handleAttackRef.current = handleAttack;
  }, [handleAttack]);

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

        // Set attack animation based on technique
        // 기술에 따른 공격 애니메이션 설정
        const animationName = getAnimationForTechnique(
          technique.name.english || technique.id
        );
        setPlayer1AttackAnimation(animationName);

        // Trigger attack animation transition
        // 공격 애니메이션 전환 트리거
        player1Animation.transitionTo(AnimationState.ATTACK);
        combatActions.setExecutingTechnique(true);

        // Deduct resources
        onPlayerUpdate(0, {
          stamina: Math.max(0, validPlayers[0].stamina - technique.staminaCost),
          ki: Math.max(0, validPlayers[0].ki - technique.kiCost),
        });

        // Execute attack WITH the selected technique (not basic attack)
        handleAttack(technique);

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
        addCombatMessage,
        player1Animation,
        combatActions,
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

  // Track previous stance for visual feedback
  const [previousStance, setPreviousStance] = useState<number>(0);

  // Get current stance index for visual feedback using optimized lookup
  const currentPlayerStance = validPlayers[0].currentStance;
  const currentStanceIndex = useMemo(() => {
    return STANCE_INDEX_MAP.get(currentPlayerStance) ?? 0;
  }, [currentPlayerStance]);

  // Handler for stance changes with animation integration
  const handleStanceChangeWithAnimation = useCallback(
    (newStance: TrigramStance) => {
      const currentStance = validPlayers[0].currentStance;
      
      // Start stance-specific transition animation
      const success = player1Animation.transitionToStanceChange(
        currentStance,
        newStance
      );
      
      if (success) {
        // Capture previous stance for visual feedback
        const prevStance = STANCE_INDEX_MAP.get(currentStance) ?? 0;
        setPreviousStance(prevStance);
        
        // Update combat state
        handleStanceSwitch(newStance);
      }
    },
    [validPlayers, player1Animation, handleStanceSwitch]
  );

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

  // Create enhanced attack handler with action feedback and animation
  const handleAttackWithFeedback = useCallback(() => {
    // Set default attack animation for basic attacks (without specific technique)
    // 기본 공격 애니메이션 설정 (잽)
    setPlayer1AttackAnimation("jab");

    // Try to transition to attack animation
    const success = player1Animation.transitionTo(AnimationState.ATTACK);
    if (success) {
      // Attack execution will happen at frame 6 in onFrame callback
      combatActions.setExecutingTechnique(true);
    } else {
      // Fallback: animation transition failed, execute attack logic immediately
      console.warn(
        "Attack animation transition failed; executing attack logic directly."
      );
      handleAttack();
    }
  }, [player1Animation, combatActions, handleAttack]);

  // Create enhanced defend handler with action feedback and animation
  const handleDefendWithFeedback = useCallback(() => {
    const defenderPos = playerPositions[0];
    // Try to transition to defend animation
    const success = player1Animation.transitionTo(AnimationState.DEFEND);
    if (success) {
      handleDefend();
      feedbackActions.addActionFeedback(
        "blocked",
        "Blocked",
        "방어!",
        defenderPos
      );
    } else {
      // Fallback: animation transition failed, execute defend logic immediately
      console.warn(
        "Defend animation transition failed; executing defend logic directly."
      );
      handleDefend();
      feedbackActions.addActionFeedback(
        "blocked",
        "Blocked",
        "방어!",
        defenderPos
      );
    }
  }, [handleDefend, playerPositions, feedbackActions, player1Animation]);

  /**
   * Helper function to execute fallback recovery animation
   * when a specific recovery type cannot be performed.
   * 
   * Determines the appropriate recovery type based on ground state
   * and transitions to that animation.
   * 
   * @korean 대체회복실행
   */
  const executeFallbackRecovery = useCallback(() => {
    const groundState = balanceSystem.getGroundState(player1Animation.currentState);
    if (groundState) {
      const recoveryType = determineRecoveryType(groundState);
      const animationState = getRecoveryAnimationState(recoveryType);
      player1Animation.transitionTo(animationState as AnimationState);
    }
  }, [balanceSystem, player1Animation]);

  // Use keyboard controls hook for enhanced input handling with visual feedback
  const { queuedInputs, showHints } = useKeyboardControls({
    onStanceChange: useCallback(
      (stanceIndex: number) => {
        const stance = TRIGRAM_STANCES_ORDER[stanceIndex];
        if (stance) {
          // Use integrated stance transition animation
          handleStanceChangeWithAnimation(stance);
        }
      },
      [handleStanceChangeWithAnimation]
    ),
    onAction: useCallback(
      (action: string) => {
        switch (action) {
          case "attack":
            // Execute currently selected technique via technique selection system
            techniqueSelection.executeTechnique();
            break;
          case "block":
            handleDefendWithFeedback();
            break;
          // Recovery actions (기상 액션)
          case "recovery_quick": {
            // Quick recovery: determine type based on ground state
            executeFallbackRecovery();
            break;
          }
          case "recovery_roll": {
            // Roll recovery: costs stamina but fastest
            const player1 = players[0];
            if (balanceSystem.canRecoverWithType(player1, "roll_recovery")) {
              const updatedPlayer = balanceSystem.applyRecoveryCost(player1, "roll_recovery");
              onPlayerUpdate(0, { stamina: updatedPlayer.stamina });
              player1Animation.transitionTo(AnimationState.RECOVERY_ROLL);
            } else {
              // Not enough stamina, fallback to quick recovery
              audio.playSFX("menu_error");
              const player1Pos = playerPositions[0];
              feedbackActions.addActionFeedback(
                "blocked",
                "Not enough stamina!",
                "체력 부족!",
                player1Pos
              );
              executeFallbackRecovery();
            }
            break;
          }
          case "recovery_defensive": {
            // Defensive getup: slow but protected
            player1Animation.transitionTo(AnimationState.RECOVERY_DEFENSIVE);
            break;
          }
          
          // Footwork pattern actions
          case "footwork_circular_left":
          case "footwork_circular_right":
          case "footwork_slide_forward":
          case "footwork_slide_back":
          case "footwork_pivot_left":
          case "footwork_pivot_right":
          case "footwork_shuffle":
            // Execute footwork animation
            player1Animation.transitionTo(action as AnimationState);
            break;
          
          // Stance side switch
          case "stance_side_switch":
            // Switch front foot (mirror stance)
            player1Animation.transitionTo(AnimationState.STANCE_SIDE_SWITCH);
            break;
          
          // Movement and other actions handled by existing system
        }
      },
      [techniqueSelection, handleDefendWithFeedback, executeFallbackRecovery, balanceSystem, player1Animation, players, onPlayerUpdate, audio, feedbackActions, playerPositions]
    ),
    enabled:
      !isPaused &&
      !showPauseMenu &&
      combatState.roundStarted &&
      !combatState.roundEnded &&
      matchCountdownComplete &&
      !showRoundStart &&
      !combatState.isExecutingTechnique,
    currentStance: currentStanceIndex,
    playSFX: audio.playSFX,
    currentAnimationState: player1Animation.currentState,
  });

  // Mobile touch control state
  const [stanceWheelExpanded, setStanceWheelExpanded] = useState(false);
  const activeMobileKeyRef = useRef<string | null>(null);

  /**
   * Mobile touch control handler - Converts VirtualDPad touch inputs to keyboard events
   *
   * Dispatches synthetic KeyboardEvents with proper properties to ensure compatibility
   * with usePlayerMovement hook. The synthetic events include:
   * - key: The character key (w/a/s/d)
   * - code: The physical key code (KeyW/KeyA/KeyS/KeyD)
   * - bubbles: true - Allows event to propagate through DOM
   * - cancelable: true - Allows event to be prevented
   *
   * These properties are essential for the keyboard event listeners in inputSystem.ts
   * to properly recognize and process the movement commands.
   *
   * @param direction - The D-pad direction or null
   * @param eventType - 'start' for press, 'end' for release
   */
  const handleMobileMove = useCallback(
    (direction: Direction | null, eventType: DPadEventType) => {
      // Map D-pad directions to movement keys (WASD)
      const directionMap: Record<Direction, string> = {
        up: "w",
        "up-right": "w", // Diagonal simplified to primary direction
        right: "d",
        "down-right": "s",
        down: "s",
        "down-left": "s",
        left: "a",
        "up-left": "w",
      };

      if (eventType === "start" && direction) {
        // Release previous key if different (prevents stuck keys)
        if (
          activeMobileKeyRef.current &&
          activeMobileKeyRef.current !== directionMap[direction]
        ) {
          const prevKey = activeMobileKeyRef.current;
          window.dispatchEvent(
            new KeyboardEvent("keyup", {
              key: prevKey,
              code: `Key${prevKey.toUpperCase()}`,
              bubbles: true,
              cancelable: true,
            })
          );
        }

        // Press new key with proper keyboard event properties
        // These properties ensure usePlayerMovement recognizes the synthetic event
        const key = directionMap[direction];
        activeMobileKeyRef.current = key;
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key,
            code: `Key${key.toUpperCase()}`,
            bubbles: true,
            cancelable: true,
          })
        );
      } else if (eventType === "end") {
        // Release active key when D-pad released
        if (activeMobileKeyRef.current) {
          const key = activeMobileKeyRef.current;
          window.dispatchEvent(
            new KeyboardEvent("keyup", {
              key,
              code: `Key${key.toUpperCase()}`,
              bubbles: true,
              cancelable: true,
            })
          );
          activeMobileKeyRef.current = null;
        }
      }
    },
    []
  );

  const handleMobileAttack = useCallback(() => {
    // Execute currently selected technique via technique selection system
    techniqueSelection.executeTechnique();
  }, [techniqueSelection]);

  const handleMobileBlock = useCallback(
    (eventType: ButtonEventType) => {
      if (eventType === "start") {
        handleDefendWithFeedback();
      }
    },
    [handleDefendWithFeedback]
  );

  const handleMobileStanceChange = useCallback(
    (stanceIndex: number) => {
      const stance = TRIGRAM_STANCES_ORDER[stanceIndex];
      if (stance) {
        // Use integrated stance transition animation
        handleStanceChangeWithAnimation(stance);
      }
    },
    [handleStanceChangeWithAnimation]
  );

  const handleMobileGesture = useCallback(
    (gesture: GestureEvent) => {
      switch (gesture.type) {
        case "swipe-right":
          // Advance toward opponent
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "d" }));
          break;
        case "swipe-left":
          // Retreat from opponent
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
          break;
        case "swipe-up":
          // High attack mode - execute selected technique
          techniqueSelection.executeTechnique();
          break;
        case "swipe-down":
          // Low attack mode - execute selected technique
          techniqueSelection.executeTechnique();
          break;
        case "two-finger-tap":
          // Activate vital point targeting mode
          // TODO: Implement vital point mode toggle
          audio.playSFX("menu_select");
          break;
      }
    },
    [techniqueSelection, audio]
  );

  // Check if mobile controls should be enabled
  const mobileControlsEnabled =
    isMobile &&
    !isPaused &&
    !showPauseMenu &&
    combatState.roundStarted &&
    !combatState.roundEnded &&
    matchCountdownComplete &&
    !showRoundStart &&
    !combatState.isExecutingTechnique;

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

  // Create a ref for the callback to avoid circular dependency
  const executeAIActionCallbackRef = useRef<
    ((action: string, targetPos?: Position) => void) | undefined
  >(undefined);

  // AI Combat System - must be before executeAIActionCallback to provide aiState
  const { aiState, updateDifficultyTarget } = useAICombat({
    player: validPlayers[1],
    opponent: validPlayers[0],
    personality: aiPersonality,
    adaptiveDifficulty,
    isPaused,
    roundStarted: combatState.roundStarted,
    roundEnded: combatState.roundEnded,
    arenaBounds,
    onExecuteAction: (action, targetPos) =>
      executeAIActionCallbackRef.current?.(action, targetPos),
    onStanceChange: handleAIStanceChange,
    onLateralityChange: () => handleStanceSideSwitch(1), // AI player (index 1)
    playerLaterality: combatState.playerLaterality[1], // AI's own laterality
    opponentLaterality: combatState.playerLaterality[0], // Opponent (human) laterality
  });

  // Calculate current difficulty tier for display
  // Force recalculation when the adaptive difficulty system changes
  const currentDifficultyTier = useMemo(
    () => adaptiveDifficulty.getDifficultyTier(),
    [adaptiveDifficulty]
  );

  // Adaptive difficulty adjustment every 2-3 rounds after round ends
  useEffect(() => {
    // Only adjust after round ends (not during round or at start)
    if (!combatState.roundEnded || internalRound < 1) {
      return;
    }

    // Adjust every 2 rounds (after rounds 2, 4, 6, etc.)
    // This ensures at least 2 rounds between adjustments for smooth progression
    const roundsCompleted = internalRound;
    if (roundsCompleted % 2 === 0) {
      // Update AI skill metrics based on player performance.
      // NOTE (Phase 1 adaptive difficulty):
      // - Only hits/attacks/damage metrics are currently sourced from PlayerState.
      // - Combo, block, reaction-time, vital-point, and stance-change metrics are
      //   intentionally stubbed here (0 or constant) until PlayerState and telemetry
      //   are extended in a follow-up phase.
      //   This keeps the system functional while we iterate on richer skill tracking.
      const player1 = validPlayersRef.current[0];

      adaptiveDifficulty.updateSkillMetrics({
        hitsLanded: player1.hitsLanded ?? 0,
        totalAttacks: (player1.hitsLanded ?? 0) + (player1.misses ?? 0),
        combosExecuted: 0, // TODO (Phase 2): Track combo count in PlayerState
        perfectBlockCount: 0, // TODO (Phase 2): Track perfect blocks in PlayerState
        avgReactionTimeMs: 600, // TODO (Phase 2): Track player reaction time
        vitalPointsHit: 0, // TODO (Phase 2): Track vital point hits
        effectiveStanceChanges: 0, // TODO (Phase 2): Track stance changes
        damageDealt: player1.totalDamageDealt ?? 0,
        damageTaken: player1.totalDamageReceived ?? 0,
      });

      // Get new difficulty parameters and update AI
      const newParams = adaptiveDifficulty.getDifficultyParameters();
      updateDifficultyTarget(newParams);

      if (import.meta.env.DEV) {
        const tier = adaptiveDifficulty.getDifficultyTier();
        console.log(
          `[DEV] Difficulty adjusted after round ${roundsCompleted}, new tier: ${tier}`
        );
      }
    }
  }, [
    combatState.roundEnded,
    internalRound,
    adaptiveDifficulty,
    updateDifficultyTarget,
  ]);

  // AI action execution - uses aiState from useAICombat
  const executeAIActionCallback = useCallback(
    (action: string, targetPos?: Position) => {
      switch (action) {
        case "attack":
          // Set AI attack animation based on technique
          // AI 공격 애니메이션 설정
          if (
            aiState.selectedTechnique?.name?.english ||
            aiState.selectedTechnique?.englishName
          ) {
            const techName =
              aiState.selectedTechnique.name?.english ||
              aiState.selectedTechnique.englishName ||
              "jab";
            setPlayer2AttackAnimation(getAnimationForTechnique(techName));
          } else {
            setPlayer2AttackAnimation("jab");
          }
          player2Animation.transitionTo(AnimationState.ATTACK);
          handleAIAttack(aiState.selectedTechnique, aiState.targetVitalPoint);
          break;
        case "defend":
          player2Animation.transitionTo(AnimationState.DEFEND);
          handleAIDefend();
          break;
        case "technique":
        case "combo":
          // Set AI attack animation based on technique
          // AI 기술 애니메이션 설정
          if (
            aiState.selectedTechnique?.name?.english ||
            aiState.selectedTechnique?.englishName
          ) {
            const techName =
              aiState.selectedTechnique.name?.english ||
              aiState.selectedTechnique.englishName ||
              "cross";
            setPlayer2AttackAnimation(getAnimationForTechnique(techName));
          } else {
            setPlayer2AttackAnimation("cross");
          }
          player2Animation.transitionTo(AnimationState.ATTACK);
          handleAITechnique(
            aiState.selectedTechnique,
            aiState.targetVitalPoint
          );
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
          // Set AI attack animation for counter attack
          // AI 반격 애니메이션 설정
          if (
            aiState.selectedTechnique?.name?.english ||
            aiState.selectedTechnique?.englishName
          ) {
            const techName =
              aiState.selectedTechnique.name?.english ||
              aiState.selectedTechnique.englishName ||
              "cross";
            setPlayer2AttackAnimation(getAnimationForTechnique(techName));
          } else {
            setPlayer2AttackAnimation("cross");
          }
          player2Animation.transitionTo(AnimationState.ATTACK);
          handleAIAttack(aiState.selectedTechnique, aiState.targetVitalPoint);
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
      aiState.selectedTechnique,
      aiState.targetVitalPoint,
      player2Animation,
    ]
  );

  // Update the ref
  useEffect(() => {
    executeAIActionCallbackRef.current = executeAIActionCallback;
  }, [executeAIActionCallback]);

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
      // ESC key toggles pause menu (unless pause menu is already open)
      if (event.key === "Escape") {
        event.preventDefault();
        if (showPauseMenu) {
          handleResume();
        } else {
          handlePause();
        }
        return;
      }

      // Block all other combat inputs when paused or during pause menu
      // isPaused: External pause state from parent component
      // showPauseMenu: Local pause menu UI is visible
      // Both conditions block input to prevent combat actions while game is paused
      if (isPaused || showPauseMenu) {
        return;
      }

      // Block all combat inputs during countdown or round start announcement
      if (!matchCountdownComplete || showRoundStart) {
        return;
      }

      if (
        !combatState.roundStarted ||
        combatState.roundEnded ||
        combatState.isExecutingTechnique
      ) {
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

      // F key for stance side switching (laterality)
      // Using "F" (Flip/Footwork) because:
      // - Tab conflicts with browser navigation and accessibility
      // - Q-W-E-R-T-Y-U-Y are reserved for combat techniques
      // - Shift is already used for blocking
      // - CapsLock has inconsistent key events across browsers/OSes
      if (event.key === "f" || event.key === "F") {
        handleStanceSideSwitch(0); // Human player
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
    isPaused,
    showPauseMenu,
    handleStanceSwitch,
    handleStanceSideSwitch,
    handleAttackWithFeedback,
    handleDefendWithFeedback,
    handlePause,
    handleResume,
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
        camera={{
          position: cameraConfig.position,
          fov: cameraConfig.fov,
          near: cameraConfig.near,
          far: cameraConfig.far,
        }}
        gl={{
          antialias: renderConfig.antialias,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={renderConfig.dpr}
        shadows={false}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(KOREAN_COLORS.UI_BACKGROUND_DARK, 1);
          scene.fog = new THREE.Fog(KOREAN_COLORS.UI_BACKGROUND_DARK, 15, 35);
        }}
      >
        {/* Animation updater - updates both player animations at 60fps */}
        <AnimationUpdater
          player1Animation={player1Animation}
          player2Animation={player2Animation}
        />

        {/* 3D Combat Arena - with scale for mobile optimization */}
        <CombatArena3D lighting="cyberpunk" scale={arenaBounds.scale} />

        {/* Player 1 */}
        <SkeletalPlayer3D
          {...convertPlayerStateToProps(
            validPlayers[0],
            player1Position3D,
            player1Rotation, // Dynamic rotation - always faces opponent
            {
              isMobile,
              facing: "right", // No flip - rotation handles facing direction
              // Enable facial expressions and eye tracking - 얼굴 표정 및 눈 추적 활성화
              enableFacialExpressions: true,
              enableEyeTracking: true,
              opponentPosition: player2Position3D,
            }
          )}
          currentAnimation={animationStateToPlayerAnimation(
            player1Animation.currentState
          )}
          attackAnimation={player1AttackAnimation}
          laterality={combatState.playerLaterality[0]}
        />

        {/* Player 2 (AI) */}
        <SkeletalPlayer3D
          {...convertPlayerStateToProps(
            validPlayers[1],
            player2Position3D,
            player2Rotation, // Dynamic rotation - always faces opponent
            {
              isMobile,
              facing: "right", // No flip - rotation handles facing direction
              // Enable facial expressions and eye tracking - 얼굴 표정 및 눈 추적 활성화
              enableFacialExpressions: true,
              enableEyeTracking: true,
              opponentPosition: player1Position3D,
            }
          )}
          currentAnimation={animationStateToPlayerAnimation(
            player2Animation.currentState
          )}
          attackAnimation={player2AttackAnimation}
          laterality={combatState.playerLaterality[1]}
        />

        {/* Hit Effects */}
        <HitEffects3D
          effects={combatState.hitEffects}
          onEffectComplete={handleEffectComplete}
          arenaBounds={arenaBounds}
        />

        {/* Vital Point Overlay - Show on both players */}
        {overlayVisible && (
          <>
            {/* Player 1 Vital Points */}
            <VitalPointMarkers3D
              position={player1Position3D}
              visible={overlayVisible}
              severityFilter={severityFilters}
              regionFilter={regionFilter}
              searchQuery={searchQuery}
              showLabels={showLabels}
              scale={scale}
              animated={animated}
              onPointClick={() => {
                // Optional: Add point targeting in combat
              }}
            />

            {/* Player 2 Vital Points */}
            <VitalPointMarkers3D
              position={player2Position3D}
              visible={overlayVisible}
              severityFilter={severityFilters}
              regionFilter={regionFilter}
              searchQuery={searchQuery}
              showLabels={showLabels}
              scale={scale}
              animated={animated}
              onPointClick={() => {
                // Optional: Add point targeting in combat
              }}
            />
          </>
        )}

        {/* Vital Point Overlay Controls - fixed screen position, left side below player status */}
        <VitalPointOverlayControls
          screenPosition={{ top: "200px", left: "20px" }}
          visible={overlayVisible}
          onVisibleChange={setOverlayVisible}
          severityFilters={severityFilters}
          onSeverityFiltersChange={setSeverityFilters}
          regionFilter={regionFilter}
          onRegionFilterChange={setRegionFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          showLabels={showLabels}
          onShowLabelsChange={setShowLabels}
          animated={animated}
          onAnimatedChange={setAnimated}
          scale={scale}
          onScaleChange={setScale}
          isMobile={isMobile}
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

        {/* Round display status overlay - only show when content is ready */}
        {contentReady &&
          combatState.roundDisplayStatus &&
          combatState.roundDisplayStatus !== null && (
            <Html fullscreen>
              <ResponsiveContainer
                position={{ base: { x: 0, y: 0 } }}
                containerWidth={width}
                containerHeight={height}
                zIndex={Z_INDEX.MODAL}
                style={{
                  pointerEvents: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "72px",
                    fontWeight: "bold",
                    fontFamily: FONT_FAMILY.KOREAN,
                    textAlign: "center",
                    color: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(
                      6,
                      "0"
                    )}`,
                    textShadow: "0 0 20px rgba(255, 215, 0, 0.8)",
                  }}
                >
                  {combatState.roundDisplayStatus === "start" && "라운드 시작!"}
                  {combatState.roundDisplayStatus === "fight" && "전투!"}
                  {combatState.roundDisplayStatus === "end" && "라운드 종료"}
                  {combatState.roundDisplayStatus === "ko" && "K.O.!"}
                </div>
              </ResponsiveContainer>
            </Html>
          )}

        {/* Visual Feedback Components for Keyboard Controls */}
        <StanceChangeIndicator
          currentStance={currentStanceIndex}
          previousStance={previousStance}
          isMobile={isMobile}
        />

        <KeyboardHints
          visible={showHints}
          currentStance={currentStanceIndex}
          isMobile={isMobile}
        />

        <InputBufferDisplay queuedInputs={queuedInputs} isMobile={isMobile} />

        {/* Mobile Touch Controls - Only shown on mobile devices */}
        {isMobile && (
          <MobileControlsWrapper
            enabled={mobileControlsEnabled}
            currentStanceIndex={currentStanceIndex}
            stanceWheelExpanded={stanceWheelExpanded}
            onMove={handleMobileMove}
            onAttack={handleMobileAttack}
            onBlock={handleMobileBlock}
            onStanceChange={handleMobileStanceChange}
            onStanceWheelToggle={() =>
              setStanceWheelExpanded(!stanceWheelExpanded)
            }
            onGesture={handleMobileGesture}
          />
        )}

        {/* Performance Monitoring - FPS display (dev mode only) */}
        {process.env.NODE_ENV === "development" && (
          <FPSMonitor
            enabled={true}
            warningThreshold={50}
            criticalThreshold={30}
          />
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
          zIndex: Z_INDEX.HUD,
        }}
      >
        {/* Combat Title - Top Center */}
        <ResponsiveContainer
          position={{ base: { x: 0, y: 10 } }}
          containerWidth={width}
          useSafeArea
          safeAreaEdge="top"
          zIndex={Z_INDEX.HUD}
          style={{
            pointerEvents: "none",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: isMobile ? "18px" : "24px",
              fontWeight: "bold",
              textAlign: "center",
              fontFamily: FONT_FAMILY.KOREAN,
              color: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(
                6,
                "0"
              )}`,
              textShadow: "0 0 4px rgba(0,0,0,0.8)",
            }}
          >
            전투 | Combat
          </div>
        </ResponsiveContainer>

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

        {/* Volume Control - consistent with other screens */}
        <VolumeControl position="bottom-right" compact={isMobile} />

        {/* Player 1 HUD - Top Left */}
        <PlayerHUD
          player={validPlayers[0]}
          position="left"
          isMobile={isMobile}
          laterality={combatState.playerLaterality[0]}
        />

        {/* Player 1 Guard Indicator - Bottom Left */}
        <GuardIndicator
          currentStance={validPlayers[0].currentStance}
          isInGuard={player1Animation.isInStanceGuard()}
          position="left"
          isMobile={isMobile}
        />

        {/* Player 2 HUD - Top Right */}
        <PlayerHUD
          player={validPlayers[1]}
          position="right"
          isMobile={isMobile}
          laterality={combatState.playerLaterality[1]}
        />

        {/* Player 2 Guard Indicator - Bottom Right */}
        <GuardIndicator
          currentStance={validPlayers[1].currentStance}
          isInGuard={player2Animation.isInStanceGuard()}
          position="right"
          isMobile={isMobile}
        />

        {/* Player 1 Speed Indicator - Shows movement speed percentage */}
        <SpeedIndicatorHUD
          finalSpeed={player1SpeedModifiers.finalSpeed}
          baseSpeed={player1SpeedModifiers.baseSpeed}
          position="left"
          isMobile={isMobile}
          visible={true}
        />

        {/* Player 2 Speed Indicator - Shows movement speed percentage */}
        <SpeedIndicatorHUD
          finalSpeed={player2SpeedModifiers.finalSpeed}
          baseSpeed={player2SpeedModifiers.baseSpeed}
          position="right"
          isMobile={isMobile}
          visible={true}
        />

        {/* Body Part Health Displays - show individual body part health bars */}
        {validPlayers[0].bodyPartHealth && (
          <BodyPartHealthDisplay
            bodyPartHealth={validPlayers[0].bodyPartHealth}
            playerId={validPlayers[0].id}
            position="left"
            isMobile={isMobile}
          />
        )}

        {validPlayers[1].bodyPartHealth && (
          <BodyPartHealthDisplay
            bodyPartHealth={validPlayers[1].bodyPartHealth}
            playerId={validPlayers[1].id}
            position="right"
            isMobile={isMobile}
          />
        )}

        {/* AI Difficulty Indicator - Shows current adaptive difficulty tier */}
        <DifficultyIndicator tier={currentDifficultyTier} isMobile={isMobile} />

        {/* Player State Visual Indicators */}
        {/* Player 1 State Overlay - includes consciousness blur, pain vignette, etc. */}
        <PlayerStateOverlay
          pain={validPlayers[0].pain}
          balanceState={getBalanceState(validPlayers[0].balance)}
          position="left"
          consciousness={validPlayers[0].consciousness}
          bloodLoss={0} // FIXME: bloodLoss property not yet added to PlayerState interface - overlay will not display until implemented
          stamina={validPlayers[0].stamina}
          isMobile={isMobile}
        />

        {/* Note: Player 2 (AI) does not get fullscreen state overlays like consciousness blur */}
        {/* as those effects would incorrectly affect the player's view */}

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
        <CombatControlsPanel
          combatMessages={combatState.combatMessages}
          isMobile={isMobile}
        />

        {/* Combat Footer - Back Button */}
        <ResponsiveContainer
          position={{ base: { x: 0, y: height - (isMobile ? 70 : 80) } }}
          containerWidth={width}
          useSafeArea
          safeAreaEdge="bottom"
          zIndex={Z_INDEX.HUD}
          style={{
            pointerEvents: "auto",
            minHeight: "50px",
            display: "flex",
            justifyContent: "center",
            width: "100%",
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
        </ResponsiveContainer>

        {/* Pause Menu Overlay */}
        {(isPaused || showPauseMenu) && (
          <PauseMenu
            onResume={handleResume}
            onRestart={handleRestart}
            onReturnToMenu={onReturnToMenu}
            isMobile={isMobile}
          />
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
            } else {
              // Match continues - trigger transition to next round
              skipCountdown();
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
      {/* Note: showRoundStart is only set to true after round 1 ends, so no need for internalRound > 1 check */}
      {showRoundStart && (
        <RoundStartAnnouncement
          roundNumber={internalRound}
          duration={2}
          onComplete={() => {
            if (import.meta.env.DEV) {
              console.log(
                "[DEV] Round start announcement complete for round",
                internalRound
              );
            }
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
