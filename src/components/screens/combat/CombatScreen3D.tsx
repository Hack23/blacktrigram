/**
 * CombatScreen3D - Three.js-based combat screen (Black Trigram 흑괘)
 *
 * Maintains all existing combat logic and state management
 * Uses Html overlays for UI and 3D meshes for game objects
 */

import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAudio } from "../../../audio/AudioProvider";
import { useActionFeedback } from "../../../hooks/useActionFeedback";
import { useCombatTimer } from "../../../hooks/useCombatTimer";
import { useKeyboardControls } from "../../../hooks/useKeyboardControls";
import { usePlayerAnimation } from "../../../hooks/usePlayerAnimation";
import { useRoundTransition } from "../../../hooks/useRoundTransition";
import { useTechniqueSelection } from "../../../hooks/useTechniqueSelection";
import { useWebGLContextLossHandler } from "../../../hooks/useWebGLContextLossHandler";
import { useCombatAttackMovement } from "./hooks/useCombatAttackMovement";
import { HitEffect, PlayerState } from "../../../systems";
import { CombatSystem } from "../../../systems/CombatSystem";
import {
  AdaptiveDifficulty,
  getPersonalityByArchetype,
} from "../../../systems/ai";
import {
  AnimationEvents,
  AnimationState,
  AnimationType,
  determineRecoveryType,
  getAnimation,
  getRecoveryAnimationState,
  resolveTechniqueAnimation,
} from "../../../systems/animation";
import { BalanceSystem } from "../../../systems/combat/BalanceSystem";
import type { BalancePlayerState } from "../../../systems/combat/BalanceSystem";
import { HitEffectType } from "../../../systems/effects";
import { injuryMovementModifier } from "../../../systems/movement/InjuryMovementModifier";
import { TRIGRAM_STANCES_ORDER } from "../../../systems/trigram/types";
import { TRIGRAM_TECHNIQUES } from "../../../systems/trigram/techniques";
import type { KoreanTechnique } from "../../../systems/vitalpoint/types";
import {
  CombatState,
  GameMode,
  PlayerArchetype,
  Position,
  TrigramStance,
} from "../../../types";
import { Injury, InjuryType } from "../../../types/injury";
import { Z_INDEX } from "../../../types/LayoutTypes";
import { getMobileControlsBottom } from "../../../types/constants/layout";
import {
  FONT_FAMILY,
  getPerformanceSettings,
  KOREAN_COLORS,
  ROUND_ANNOUNCEMENT_TIMINGS,
} from "@/types/constants";
import { getAnimationTypeForTechnique } from "../../../data/techniqueMappings";
import { toHexColor } from "../../../utils/colorHelpers";
import { usePlayerMovement } from "../../../utils/inputSystem";
import { PerformanceOverlay3D } from "../../../utils/performance";
import { createPlayerFromArchetype } from "../../../utils/playerUtils";
import { createCameraConfig } from "../../../utils/sharedPhysicsConfig";
import { useAdaptiveQuality } from "../../shared/three/optimization";
import { useKoreanTheme } from "../../shared/base/useKoreanTheme";
import {
  ActionFeedback,
  TechniqueName,
} from "../../shared/three/effects/ActionFeedback";
import { DamageNumbers } from "../../shared/three/effects/DamageNumbers";
import HitEffects3D from "../../shared/three/effects/HitEffects3D";
import { VitalPointMarkers3D } from "../../shared/three/effects/VitalPointMarkers3D";
import { StanceChangeIndicator } from "../../shared/three/indicators/StanceChangeIndicator";
import { CombatArena3D } from "../../shared/three/scene/CombatArena3D";
import { BreathingIndicator } from "../../shared/three/ui/BreathingIndicator";
import { ComboCounter } from "../../shared/three/ui/ComboCounter";
import { VitalPointOverlayControlsHtml } from "../../shared/three/ui/VitalPointOverlayControlsHtml";
import { KeyboardHints } from "./components/controls/KeyboardHints";
import { MatchCountdown } from "./components/feedback/MatchCountdown";
import { RoundAnnouncement } from "./components/feedback/RoundAnnouncementOverlayHtml";
import { RoundDisplayStatus } from "./components/feedback/RoundDisplayStatus";
import { RoundStartAnnouncement } from "./components/feedback/RoundStartAnnouncementOverlayHtml";
import { InputBufferDisplay } from "./components/indicators/InputBufferDisplay";
import { GestureEvent } from "../../../hooks/useTouchControls";
import {
  MovementType,
  SpeedModifierSystem,
} from "../../../systems/physics/SpeedModifierSystem";
import { Technique } from "../../../types";
import {
  animationStateToPlayerAnimation,
  convertPlayerStateToProps,
  getBalanceState,
} from "../../../utils/player3DHelpers";
import {
  GestureRecognizerPure,
  MobileControlsOverlay,
  StanceWheelPure,
} from "../../shared/mobile";
import { ButtonEventType } from "../../shared/mobile/ActionButtons";
import { Direction, DPadEventType } from "../../shared/mobile/VirtualDPad";
import { Player3DWithTransitions } from "../../shared/three/models/Player3DWithTransitions";
import { PauseMenu } from "./components/controls/PauseMenu";
import { TraumaOverlay3D } from "./components/effects/TraumaOverlay3D";
import { CombatParticleEffects3D } from "./components/effects/CombatParticleEffects3D";
import {
  CombatBottomHUD,
  CombatLeftHUD,
  CombatPortraitStatusStrip,
  CombatRightHUD,
  CombatTopHUD,
} from "./components/hud";
import { FPSMonitor } from "./components/hud/FPSMonitor";
import { PlayerStateOverlayHtml } from "./components/hud/PlayerStateOverlayHtml";
import { BalanceIndicatorOverlayHtml } from "../../ui/combat/BalanceIndicatorOverlayHtml";
import {
  ANNOUNCEMENT_FADE_OUT_DELAY,
  calculateAccuracy,
  STANCE_INDEX_MAP,
} from "./helpers";
import { AnimationUpdater } from "./helpers/AnimationUpdater";
import { AccelerationUpdater } from "../../../systems/movement/helpers/AccelerationUpdater";
import { isRunningSpeed } from "../../../systems/movement/helpers/accelerationUtils";
import { useAICombat } from "./hooks/useAICombat";
import { useCombatActions } from "./hooks/useCombatActions";
import { useCombatAudio } from "./hooks/useCombatAudio";
import { useCombatLayout } from "./hooks/useCombatLayout";
import { useCombatState } from "./hooks/useCombatState";

const FALLBACK_ATTACK_DURATION_SECONDS = 0.55; // Median short technique duration when skeletal metadata is unavailable.

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
    updates: Partial<PlayerState>,
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
  /**
   * Enable adaptive quality adjustment (default: true on mobile)
   */
  readonly enableAdaptiveQuality?: boolean;
  /**
   * Show performance overlay in dev mode (default: import.meta.env.DEV)
   */
  readonly showPerformanceOverlay?: boolean;
}

/**
 * CombatScreen3D Component
 * Three.js-based combat screen with 3D characters and effects
 */

/**
 * AdaptiveQualityWrapper - Internal component to use adaptive quality hook
 * Must be inside Canvas to use useFrame from @react-three/fiber
 *
 * Hoisted outside CombatScreen3D to avoid "Cannot create components during render"
 * warnings from react-hooks/component-creation. Keeps the component type stable
 * across renders of the parent.
 */
const AdaptiveQualityWrapper: React.FC<{
  readonly enabled: boolean;
  readonly isMobile: boolean;
  readonly children: React.ReactNode;
}> = ({ enabled, isMobile, children }) => {
  useAdaptiveQuality(enabled, isMobile, (newQuality) => {
    if (import.meta.env.DEV) {
      console.log(`[CombatScreen3D] Quality adjusted to: ${newQuality}`);
    }
  });

  return <>{children}</>;
};

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
  enableAdaptiveQuality,
  showPerformanceOverlay = import.meta.env.DEV,
}) => {
  const [contentReady, setContentReady] = useState(false);

  const contextLossCountRef = useRef(0);

  useWebGLContextLossHandler({
    onContextLost: () => {
      console.warn("⚠️ WebGL context lost in CombatScreen");
      contextLossCountRef.current += 1;
      setContentReady(false);
    },
    onContextRestored: () => {
      setTimeout(() => setContentReady(true), 100);
    },
    autoRestore: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => setContentReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const audio = useAudio();

  useEffect(() => {
    if (import.meta.env.DEV) {
      performance.mark("combat-3d-render-start");
      return () => {
        performance.mark("combat-3d-render-end");
        performance.measure(
          "combat-3d-render",
          "combat-3d-render-start",
          "combat-3d-render-end",
        );
      };
    }
  }, []);

  const { arenaBounds, isMobile, isPortrait, screenSize, layoutConstants } =
    useCombatLayout(width, height);

  const theme = useKoreanTheme({
    variant: "primary",
    size: "md",
    isMobile,
  });

  const positionScale = useMemo(() => {
    if (isMobile) {
      return 1.0;
    }

    switch (screenSize) {
      case "mobile":
        return 1.0; // Mobile already has special handling
      case "tablet":
        return 1.0;
      case "desktop":
        return 1.0;
      case "large":
        return 1.25;
      case "xlarge":
        return 1.5; // 4K displays need 1.5x offsets
      default:
        return 1.0;
    }
  }, [isMobile, screenSize]);

  const cameraConfig = useMemo(() => {
    const base = createCameraConfig(isMobile);
    if (!isPortrait) return base;
    return {
      ...base,
      fov: Math.min(80, base.fov + 15),
      position: [base.position[0], base.position[1], base.position[2] + 4] as [
        number,
        number,
        number,
      ],
    };
  }, [isMobile, isPortrait]);

  const renderConfig = useMemo(() => {
    const performanceSettings = getPerformanceSettings(width, isMobile);

    return {
      shadowMapSize: performanceSettings.shadowMapSize,
      dpr: performanceSettings.dpr,
      antialias: performanceSettings.antialias,
      maxParticles: performanceSettings.maxParticles,
      postProcessing: performanceSettings.postProcessing,
    };
  }, [isMobile, width]);

  const shouldEnableAdaptiveQuality = enableAdaptiveQuality ?? isMobile;

  const { state: combatState, actions: combatActions } = useCombatState();


  const [overlayVisible, setOverlayVisible] = useState(false);
  const [severityFilters, setSeverityFilters] = useState<
    import("../../../types/common").VitalPointSeverity[]
  >([]);
  const [regionFilter, setRegionFilter] =
    useState<
      import("../../shared/three/ui/VitalPointOverlayControlsHtml").BodyRegionFilter
    >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLabels, setShowLabels] = useState(true);
  const [animated, setAnimated] = useState(true);
  const [scale, setScale] = useState(1.2); // Larger scale for better visibility in combat
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "v" || e.key === "V") {
        setOverlayVisible((prev) => !prev);
        audio.playSFX("menu_select");
      }
      if (e.key === "F9" && import.meta.env.DEV) {
        e.preventDefault();
        setShowPerformanceMonitor((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [audio]);

  const { state: feedbackState, actions: feedbackActions } = useActionFeedback({
    damageNumberDuration: 1500,
    actionFeedbackDuration: 1200,
    techniqueDuration: 2000,
    comboResetTime: 2000,
  });

  const combatAudio = useCombatAudio();
  const { playStanceChangeSound } = combatAudio;

  const [matchScore, setMatchScore] = useState({ player1: 0, player2: 0 });
  const matchScoreRef = useRef(matchScore);

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
    setTimeout(() => setMatchScore(newScore), 0);
  }, []);

  const [internalRound, setInternalRound] = useState(currentRound);

  const [currentTime, setCurrentTime] = useState(() => Date.now());

  const [hasShownMatchCountdown, setHasShownMatchCountdown] = useState(true); // Already shown (skipped)
  const [showMatchCountdown, setShowMatchCountdown] = useState(false); // Don't show
  const [showRoundStart, setShowRoundStart] = useState(false);
  const [matchCountdownComplete, setMatchCountdownComplete] = useState(true); // Already complete (skipped)

  const [player1Position, setPlayer1Position] = useState<Position>({
    x: arenaBounds.worldWidthMeters * -0.1, // 10% left of center (~0.8m for 8m arena)
    y: 0, // Centered
  });

  const [showPauseMenu, setShowPauseMenu] = useState(false);

  const handlePause = useCallback(() => {
    setShowPauseMenu(true);
    audio.playSFX("menu_select");
  }, [audio]);

  const handleResume = useCallback(() => {
    setShowPauseMenu(false);
    audio.playSFX("menu_select");
  }, [audio]);

  const handleRestart = useCallback(() => {

    setInternalRound(1);
    setMatchScore({ player1: 0, player2: 0 });
    matchScoreRef.current = { player1: 0, player2: 0 };

    combatActions.setRoundEnded(false);
    combatActions.setRoundStarted(false);
    combatActions.setRoundDisplayStatus(null);

    onPlayerUpdate(0, {
      health: 100,
      stamina: 100,
      ki: 100,
      consciousness: 100,
      pain: 0,
      balance: 100,
      combatState: CombatState.IDLE,
      isStunned: false,
      isBlocking: false,
    });
    onPlayerUpdate(1, {
      health: 100,
      stamina: 100,
      ki: 100,
      consciousness: 100,
      pain: 0,
      balance: 100,
      combatState: CombatState.IDLE,
      isStunned: false,
      isBlocking: false,
    });

    setPlayer1Position({
      x: arenaBounds.worldWidthMeters * -0.1, // 10% left of center in meters
      y: 0, // Centered
    });
    onPlayerUpdate(1, {
      position: {
        x: arenaBounds.worldWidthMeters * 0.1, // 10% right of center in meters
        y: 0, // Centered
      },
    });

    setShowPauseMenu(false);
    setShowRoundStart(true);

    audio.playSFX("menu_select");
  }, [audio, combatActions, onPlayerUpdate, arenaBounds, setPlayer1Position]);

  const handleRoundTransitionComplete = useCallback(() => {
    if (import.meta.env.DEV) {
      console.log("[DEV] Round transition complete, checking match status");
    }
    const currentScore = matchScoreRef.current;
    if (currentScore.player1 >= 2 || currentScore.player2 >= 2) {
      const matchWinner = currentScore.player1 >= 2 ? 0 : 1;
      if (import.meta.env.DEV) {
        console.log("[DEV] Match over, winner:", matchWinner);
      }
      onGameEnd(matchWinner);
      return; // Don't start next round
    }

    combatActions.resetRoundState();

    setInternalRound((prev) => {
      const nextRound = prev + 1;
      if (import.meta.env.DEV) {
        console.log("[DEV] Incrementing round from", prev, "to", nextRound);
      }
      setTimeout(() => {
        if (import.meta.env.DEV) {
          console.log(
            "[DEV] Showing round start announcement for round",
            nextRound,
          );
        }
        setShowRoundStart(true);
      }, ANNOUNCEMENT_FADE_OUT_DELAY);
      return nextRound;
    });

    onPlayerUpdate(0, {
      health: 100,
      stamina: 100,
      ki: 100,
      consciousness: 100,
      pain: 0,
      balance: 100,
      combatState: CombatState.IDLE,
      isStunned: false,
      isBlocking: false,
    });
    onPlayerUpdate(1, {
      health: 100,
      stamina: 100,
      ki: 100,
      consciousness: 100,
      pain: 0,
      balance: 100,
      combatState: CombatState.IDLE,
      isStunned: false,
      isBlocking: false,
    });

    setPlayer1Position({
      x: arenaBounds.worldWidthMeters * -0.1, // 10% left of center in meters
      y: 0, // Centered
    });
    onPlayerUpdate(1, {
      position: {
        x: arenaBounds.worldWidthMeters * 0.1, // 10% right of center in meters
        y: 0, // Centered
      },
    });
  }, [
    combatActions,
    onGameEnd,
    onPlayerUpdate,
    arenaBounds,
    setPlayer1Position,
  ]);

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
    handleRoundTransitionComplete,
  );

  const player2Position = useMemo<Position>(() => {
    if (players.length >= 2 && players[1].position) {
      return players[1].position;
    }
    return {
      x: arenaBounds.worldWidthMeters * 0.1, // 10% right of center (~0.8m for 8m arena)
      y: 0, // Centered
    };
  }, [players, arenaBounds]);

  const playerPositions = useMemo<Position[]>(() => {
    return [player1Position, player2Position];
  }, [player1Position, player2Position]);

  const player1Position3D: [number, number, number] = useMemo(() => {
    return [playerPositions[0].x, 0, playerPositions[0].y];
  }, [playerPositions]);

  const player2Position3D: [number, number, number] = useMemo(() => {
    return [playerPositions[1].x, 0, playerPositions[1].y];
  }, [playerPositions]);


  const player2Rotation = useMemo(() => {
    const dx = player1Position3D[0] - player2Position3D[0];
    const dz = player1Position3D[2] - player2Position3D[2];
    return Math.atan2(dx, dz);
  }, [player1Position3D, player2Position3D]);

  const combatSystem = useMemo(() => new CombatSystem(), []);

  const balanceSystem = useMemo(() => new BalanceSystem(), []);

  const speedModifierSystem = useMemo(() => new SpeedModifierSystem(), []);

  const [player1SpeedModifiers, setPlayer1SpeedModifiers] = useState({
    finalSpeed: 6.0, // BASE_WALK_SPEED (6.0 m/s)
    baseSpeed: 6.0,
    finalAcceleration: 12.0, // BASE_ACCELERATION (12.0 m/s²)
  });
  const [player2SpeedModifiers, setPlayer2SpeedModifiers] = useState({
    finalSpeed: 6.0, // BASE_WALK_SPEED (6.0 m/s)
    baseSpeed: 6.0,
    finalAcceleration: 12.0, // BASE_ACCELERATION (12.0 m/s²)
  });

  const [player1WalkRunSpeeds, setPlayer1WalkRunSpeeds] = useState({
    walkSpeed: 6.0,
    runSpeed: 10.0,
  });

  useEffect(() => {
    const updateSpeedModifiers = () => {
      if (players.length >= 2) {
        const player1WalkModifiers =
          speedModifierSystem.calculateSpeedModifiers(
            players[0],
            MovementType.WALKING,
            false, // isCrouching
          );
        const player1RunModifiers = speedModifierSystem.calculateSpeedModifiers(
          players[0],
          MovementType.RUNNING,
          false, // isCrouching
        );

        setPlayer1SpeedModifiers({
          finalSpeed: player1WalkModifiers.finalSpeed,
          baseSpeed: player1WalkModifiers.baseSpeed,
          finalAcceleration: player1WalkModifiers.finalAcceleration,
        });

        setPlayer1WalkRunSpeeds({
          walkSpeed: player1WalkModifiers.finalSpeed,
          runSpeed: player1RunModifiers.finalSpeed,
        });

        const player2Modifiers = speedModifierSystem.calculateSpeedModifiers(
          players[1],
          MovementType.WALKING,
          false,
        );
        setPlayer2SpeedModifiers({
          finalSpeed: player2Modifiers.finalSpeed,
          baseSpeed: player2Modifiers.baseSpeed,
          finalAcceleration: player2Modifiers.finalAcceleration,
        });
      }
    };

    updateSpeedModifiers();

    const intervalId = setInterval(updateSpeedModifiers, 200);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]); // speedModifierSystem is memoized and never changes

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(Date.now());
    };

    const intervalId = setInterval(updateTime, 200);

    return () => clearInterval(intervalId);
  }, []);

  const calculateLegInjuryFactor = useCallback(
    (player: PlayerState): number => {
      if (!player.bodyPartHealth) return 0;

      const leftLeg = player.bodyPartHealth.legLeft ?? player.maxHealth;
      const rightLeg = player.bodyPartHealth.legRight ?? player.maxHealth;
      const maxHealth = player.maxHealth;

      const averageLegHealth = (leftLeg + rightLeg) / (2 * maxHealth);
      return Math.max(0, Math.min(1, 1.0 - averageLegHealth)); // 0 = healthy, 1 = critical
    },
    [],
  );

  const player1 = players.length > 0 ? players[0] : undefined;
  const player1Data = useMemo(() => {
    const p1 = player1 ?? createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
    return {
      currentStance: p1.currentStance,
      legInjuryFactor: calculateLegInjuryFactor(p1),
    };
  }, [player1, calculateLegInjuryFactor]);

  const [player1AttackAnimation, setPlayer1AttackAnimation] = useState<
    string | undefined
  >(undefined);
  const [player2AttackAnimation, setPlayer2AttackAnimation] = useState<
    string | undefined
  >(undefined);

  const [player1TechniqueId, setPlayer1TechniqueId] = useState<
    string | undefined
  >(undefined);
  const [player2TechniqueId, setPlayer2TechniqueId] = useState<
    string | undefined
  >(undefined);

  const [player1Injuries, setPlayer1Injuries] = useState<readonly Injury[]>([]);
  const [player2Injuries, setPlayer2Injuries] = useState<readonly Injury[]>([]);

  useEffect(() => {
    return () => {
      setPlayer1Injuries([]);
      setPlayer2Injuries([]);
    };
  }, []);

  useEffect(() => {
    if (players.length >= 2) {
      const player1 = players[0];
      const player2 = players[1];

      if (
        player1?.health === player1?.maxHealth &&
        player2?.health === player2?.maxHealth
      ) {
        setPlayer1Injuries([]);
        setPlayer2Injuries([]);
      }
    }
  }, [players]);

  const handlePlayer1PositionChange = useCallback(
    (newPosition: Position) => {
      setPlayer1Position(newPosition);
      onPlayerUpdate(0, { position: newPosition });
    },
    [onPlayerUpdate],
  );

  const movementBounds = useMemo(
    () => ({
      worldWidthMeters: arenaBounds.worldWidthMeters,
      worldDepthMeters: arenaBounds.worldDepthMeters,
    }),
    [arenaBounds.worldWidthMeters, arenaBounds.worldDepthMeters],
  );


  const player1MovementTimeRef = useRef(0);
  const player1LastDirectionRef = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [player1AccelerationBasedSpeed, setPlayer1AccelerationBasedSpeed] =
    useState(player1WalkRunSpeeds.walkSpeed);

  const player1IsRunning = isRunningSpeed(
    player1AccelerationBasedSpeed,
    player1WalkRunSpeeds.runSpeed,
  );

  const { isMoving: player1IsMoving, velocity: player1Velocity } =
    usePlayerMovement({
      enabled:
        !isPaused &&
        combatState.roundStarted &&
        !combatState.roundEnded &&
        matchCountdownComplete &&
        !showRoundStart,
      bounds: movementBounds, // Use memoized bounds object
      onPositionChange: handlePlayer1PositionChange, // Use memoized callback
      initialPositionMeters: player1Position,
      currentStance: player1Data.currentStance,
      legInjuryFactor: player1Data.legInjuryFactor,
      isRunning: player1IsRunning, // Use computed acceleration-based running state
      useTacticalSteps: false,
      maxSpeedOverride: player1AccelerationBasedSpeed,
      accelerationOverride: player1SpeedModifiers.finalAcceleration,
    });

  const player1Rotation = useMemo(() => {
    if (
      player1IsMoving &&
      player1Velocity &&
      (player1Velocity.x !== 0 || player1Velocity.y !== 0)
    ) {
      const movementRotation = Math.atan2(player1Velocity.x, player1Velocity.y);
      return movementRotation;
    } else {
      const dx = player2Position3D[0] - player1Position3D[0];
      const dz = player2Position3D[2] - player1Position3D[2];
      const targetRotation = Math.atan2(dx, dz);
      return targetRotation;
    }
  }, [player1IsMoving, player1Velocity, player1Position3D, player2Position3D]);

  const handleAttackRef = useRef<(() => void) | null>(null);

  const player1AnimationRef = useRef<ReturnType<
    typeof usePlayerAnimation
  > | null>(null);

  const validPlayersRefForAnimation = useRef<[PlayerState, PlayerState] | null>(
    null,
  );

  const player1HitTriggerFrameRef = useRef<number>(6);
  const player1AttackHitFiredRef = useRef<boolean>(false);

  const [player1AttackDuration, setPlayer1AttackDuration] =
    useState<number>(0.55);
  const [player2AttackDuration, setPlayer2AttackDuration] =
    useState<number>(0.55);

  const clearPlayer1AttackAnimation = useRef<() => void>(() => {
    setPlayer1AttackAnimation(undefined);
    setPlayer1TechniqueId(undefined);
  });
  const clearPlayer2AttackAnimation = useRef<() => void>(() => {
    setPlayer2AttackAnimation(undefined);
    setPlayer2TechniqueId(undefined);
  });

  const player1AnimationEvents = useMemo<AnimationEvents>(
    () => ({
      onFrame: (frame, state) => {
        if (
          state === AnimationState.ATTACK &&
          frame >= player1HitTriggerFrameRef.current &&
          !player1AttackHitFiredRef.current
        ) {
          player1AttackHitFiredRef.current = true;
          handleAttackRef.current?.();
        }
      },
      onAnimationComplete: (state) => {
        if (
          state === AnimationState.ATTACK ||
          state === AnimationState.DEFEND
        ) {
          combatActions.setExecutingTechnique(false);
          if (state === AnimationState.ATTACK) {
            clearPlayer1AttackAnimation.current();
          }
        } else if (state === AnimationState.STANCE_CHANGE) {
          audio.playSFX("menu_select");
          const players = validPlayersRefForAnimation.current;
          const currentStance = players?.[0]?.currentStance;
          if (currentStance && player1AnimationRef.current) {
            player1AnimationRef.current.transitionToStanceGuard(currentStance);
          }
        }
      },
    }),
    [combatActions, audio],
  );

  const player1Animation = usePlayerAnimation({
    events: player1AnimationEvents,
  });

  useEffect(() => {
    player1AnimationRef.current = player1Animation;
  }, [player1Animation]);

  const player2Animation = usePlayerAnimation({
    events: {
      onFrame: (frame, state) => {
        if (state === AnimationState.ATTACK && frame === 6) { /* attack frame hook */ }
      },
      onAnimationComplete: (state) => {
        if (state === AnimationState.ATTACK) {
          clearPlayer2AttackAnimation.current();
        }
      },
    },
  });

  const prevPlayer1IsMovingRef = useRef<boolean>(player1IsMoving);
  const prevPlayer1IsRunningRef = useRef<boolean>(player1IsRunning);
  useEffect(() => {
    const movementChanged = prevPlayer1IsMovingRef.current !== player1IsMoving;
    const runningChanged = prevPlayer1IsRunningRef.current !== player1IsRunning;

    if (movementChanged || runningChanged) {
      if (player1IsMoving) {
        const targetState = player1IsRunning
          ? AnimationState.RUN
          : AnimationState.WALK;
        if (player1Animation.currentState !== targetState) {
          player1Animation.transitionTo(targetState);
        }
      } else if (
        player1Animation.currentState === AnimationState.WALK ||
        player1Animation.currentState === AnimationState.RUN
      ) {
        player1Animation.transitionToStanceGuard(player1Data.currentStance);
      }
      prevPlayer1IsMovingRef.current = player1IsMoving;
      prevPlayer1IsRunningRef.current = player1IsRunning;
    }
  }, [
    player1IsMoving,
    player1IsRunning,
    player1Animation,
    player1Data.currentStance,
  ]);

  const MOVEMENT_DETECTION_THRESHOLD = 0.5;

  const player2Stance = useMemo(() => {
    return players[1]?.currentStance ?? TrigramStance.GEON;
  }, [players]);

  const prevPlayer2PositionRef = useRef(player2Position);
  useEffect(() => {
    const currentPos = playerPositions[1];
    const prevPos = prevPlayer2PositionRef.current;

    const isMoving =
      Math.abs(currentPos.x - prevPos.x) > MOVEMENT_DETECTION_THRESHOLD ||
      Math.abs(currentPos.y - prevPos.y) > MOVEMENT_DETECTION_THRESHOLD;

    if (isMoving) {
      if (
        player2Animation.currentState !== AnimationState.WALK &&
        player2Animation.currentState !== AnimationState.ATTACK
      ) {
        player2Animation.transitionTo(AnimationState.WALK);
      }
    } else {
      if (player2Animation.currentState === AnimationState.WALK) {
        player2Animation.transitionToStanceGuard(player2Stance);
      }
    }

    prevPlayer2PositionRef.current = currentPos;
  }, [playerPositions, player2Animation, player2Stance]);

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

  const validPlayersRef = useRef<[PlayerState, PlayerState]>(validPlayers);
  useEffect(() => {
    validPlayersRef.current = validPlayers;
    validPlayersRefForAnimation.current = validPlayers;
  }, [validPlayers]);

  const getTechniqueAnimationType = useCallback(
    (techniqueId: string | undefined): AnimationType | undefined => {
      if (!techniqueId) return undefined;

      return getAnimationTypeForTechnique(techniqueId);
    },
    [],
  );

  const {
    player1Position: player1PositionWithAttackMovement,
    player2Position: player2PositionWithAttackMovement,
  } = useCombatAttackMovement({
    player1Attacking: player1Animation.currentState === AnimationState.ATTACK,
    player1AnimationType: getTechniqueAnimationType(player1TechniqueId),
    player1Stance: player1Data.currentStance,
    player1BasePosition: player1Position3D,
    player1AnimationDuration: player1AttackDuration,
    player2Attacking: player2Animation.currentState === AnimationState.ATTACK,
    player2AnimationType: getTechniqueAnimationType(player2TechniqueId),
    player2Stance: validPlayers[1].currentStance,
    player2BasePosition: player2Position3D,
    player2AnimationDuration: player2AttackDuration,
  });

  const [player1LocalStance, setPlayer1LocalStance] = useState<TrigramStance>(
    validPlayers[0].currentStance,
  );

  useEffect(() => {
    setPlayer1LocalStance(validPlayers[0].currentStance);
  }, [validPlayers]);

  const player1WithLocalStance = useMemo(
    (): PlayerState => ({
      ...validPlayers[0],
      currentStance: player1LocalStance,
    }),
    [validPlayers, player1LocalStance],
  );

  const startTransitionRef = useRef(startTransition);
  const internalRoundRef = useRef(internalRound);
  useEffect(() => {
    startTransitionRef.current = startTransition;
    internalRoundRef.current = internalRound;
  }, [startTransition, internalRound]);

  const addCombatMessage = useCallback(
    (korean: string, english: string) => {
      const message = `${korean} | ${english}`;
      combatActions.addCombatMessage(message);
    },
    [combatActions],
  );

  const handleTimeUp = useCallback(() => {
    if (!combatState.roundEnded) {
      combatActions.setRoundEnded(true);
      addCombatMessage("시간 종료!", "Time's Up!");

      const currentPlayers = validPlayersRef.current;
      const player1Health = currentPlayers[0].health;
      const player2Health = currentPlayers[1].health;

      if (player1Health > player2Health) {
        updateMatchScore(0);
        startTransitionRef.current(currentPlayers[0], internalRoundRef.current); // Player 1 wins round
      } else if (player2Health > player1Health) {
        updateMatchScore(1);
        startTransitionRef.current(currentPlayers[1], internalRoundRef.current); // Player 2 wins round
      } else {
        startTransitionRef.current(null, internalRoundRef.current);
      }
    }
  }, [
    combatState.roundEnded,
    combatActions,
    addCombatMessage,
    updateMatchScore,
  ]);

  const handleTimeUpRef = useRef(handleTimeUp);
  useEffect(() => {
    handleTimeUpRef.current = handleTimeUp;
  }, [handleTimeUp]);

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
    resetKey: timerResetKey,
  });

  const startRound = useCallback(() => {
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

  const hasAutoStartedRef = useRef(false);

  useEffect(() => {
    if (matchCountdownComplete && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      combatActions.setRoundStarted(true);
      addCombatMessage("라운드 시작!", "Round Start!");

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

  const adaptiveDifficulty = useMemo(() => new AdaptiveDifficulty(), []);

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
    [validPlayers],
  );

  const handleAIStanceChange = useCallback(
    (stance: TrigramStance) => {
      const currentStance = validPlayers[1].currentStance;

      player2Animation.transitionToStanceChange(currentStance, stance);

      onPlayerUpdate(1, { currentStance: stance });
      addCombatMessage(
        `AI 자세 변경: ${stance}`,
        `AI Stance Change: ${stance}`,
      );
    },
    [validPlayers, player2Animation, onPlayerUpdate, addCombatMessage],
  );

  const handleEffectComplete = useCallback(
    (effectId: string) => {
      combatActions.removeHitEffect(effectId);
    },
    [combatActions],
  );

  const createHitEffect = useCallback(
    (
      id: string,
      type: HitEffectType,
      position: Position,
      intensity: number,
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
    [],
  );

  const addHitEffect = useCallback(
    (type: HitEffectType, position: Position, intensity: number = 1) => {
      const effect = createHitEffect(
        `effect_${Date.now()}`,
        type,
        position,
        intensity,
      );
      combatActions.addHitEffect(effect);
    },
    [createHitEffect, combatActions],
  );

  const handlePlayerPositionUpdate = useCallback(
    (playerIndex: number, position: Position) => {
      if (playerIndex === 0) {
        setPlayer1Position(position);
        onPlayerUpdate(0, { position });
      } else if (playerIndex === 1) {
        onPlayerUpdate(1, { position });
      }
    },
    [onPlayerUpdate, setPlayer1Position],
  );

  const handleInjuryCreated = useCallback(
    (injury: Injury, targetPlayerIndex: number) => {
      const updateInjuries = (prev: readonly Injury[]): readonly Injury[] => {
        const recentHitTime = 5000; // 5 seconds
        const now = Date.now();

        const recentHit = prev.find(
          (existing) =>
            existing.region === injury.region &&
            now - existing.timestamp < recentHitTime &&
            existing.type === InjuryType.BRUISE &&
            injury.type === InjuryType.BRUISE,
        );

        if (recentHit) {
          const newHitCount = recentHit.hitCount + 1;
          const escalatedSeverity = Math.min(1.0, recentHit.severity + 0.15);

          return prev.map((existing) =>
            existing.id === recentHit.id
              ? {
                  ...existing,
                  hitCount: newHitCount,
                  severity: escalatedSeverity,
                  timestamp: now, // Update timestamp for progressive tracking
                }
              : existing,
          );
        }

        return [...prev, injury];
      };

      if (targetPlayerIndex === 0) {
        setPlayer1Injuries(updateInjuries);
      } else if (targetPlayerIndex === 1) {
        setPlayer2Injuries(updateInjuries);
      }
    },
    [],
  );

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
    onLateralityUpdate: (playerIndex, laterality) => {
      combatActions.setPlayerLateralityIndex(playerIndex as 0 | 1, laterality);
    },
    onInjuryCreated: handleInjuryCreated,
    addCombatMessage,
    addHitEffect,
    arenaBounds,
    combatAudio,
    playerAnimations: {
      player1: player1Animation,
      player2: player2Animation,
    },
  });

  useEffect(() => {
    handleAttackRef.current = handleAttack;
  }, [handleAttack]);

  const techniqueSelection = useTechniqueSelection({
    player: player1WithLocalStance,
    enabled:
      !isPaused &&
      combatState.roundStarted &&
      !combatState.roundEnded &&
      matchCountdownComplete &&
      !showRoundStart,
    onTechniqueExecute: useCallback(
      (technique: Technique) => {
        feedbackActions.showTechnique(
          technique.name.korean,
          technique.name.english,
        );

        const animationName = resolveTechniqueAnimation(technique);
        setPlayer1AttackAnimation(animationName);

        setPlayer1TechniqueId(technique.id);

        const skeletalAnim = getAnimation(animationName);
        const attackDuration = skeletalAnim?.duration ?? 0.55;

        const attackFrames = Math.max(1, Math.round(attackDuration * 60));
        player1HitTriggerFrameRef.current = Math.round(attackFrames * 0.4);
        player1AttackHitFiredRef.current = false;
        setPlayer1AttackDuration(attackDuration);
        player1Animation.transitionToAttack(attackDuration);
        combatActions.setExecutingTechnique(true);

        onPlayerUpdate(0, {
          stamina: Math.max(0, validPlayers[0].stamina - technique.staminaCost),
          ki: Math.max(0, validPlayers[0].ki - technique.kiCost),
        });

        handleAttack(technique);

        addCombatMessage(
          `${technique.name.korean} 사용!`,
          `Used ${technique.name.english}!`,
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
      ],
    ),
  });

  const cooldownsMap = useMemo(() => {
    const map = new Map<string, number>();
    techniqueSelection.activeCooldowns.forEach((cd) => {
      map.set(cd.techniqueId, cd.remaining);
    });
    return map;
  }, [techniqueSelection.activeCooldowns]);

  const [previousStance, setPreviousStance] = useState<number>(0);

  const currentPlayerStance = validPlayers[0].currentStance;
  const currentStanceIndex = useMemo(() => {
    return STANCE_INDEX_MAP.get(currentPlayerStance) ?? 0;
  }, [currentPlayerStance]);

  const handleStanceChangeWithAnimation = useCallback(
    (newStance: TrigramStance) => {
      const currentStance = validPlayers[0].currentStance;

      const success = player1Animation.transitionToStanceChange(
        currentStance,
        newStance,
      );

      if (success) {
        const prevStance = STANCE_INDEX_MAP.get(currentStance) ?? 0;
        setPreviousStance(prevStance);

        setPlayer1LocalStance(newStance);

        handleStanceSwitch(newStance);

        playStanceChangeSound();
      }
    },
    [validPlayers, player1Animation, handleStanceSwitch, playStanceChangeSound],
  );

  const player1Health = validPlayers[0].health;
  const player2Health = validPlayers[1].health;

  const lastPlayer2HealthRef = useRef(player2Health);
  useEffect(() => {
    const currentHealth = player2Health;
    const previousHealth = lastPlayer2HealthRef.current;
    const damageDone = previousHealth - currentHealth;

    if (damageDone > 0 && combatState.roundStarted && !combatState.roundEnded) {
      const getDamageType = (): "critical" | "vital" | "normal" => {
        if (damageDone >= 25) return "critical";
        if (damageDone >= 20) return "vital";
        return "normal";
      };
      const damageType = getDamageType();

      feedbackActions.addDamageNumber(
        Math.round(damageDone),
        playerPositions[1],
        damageType,
      );

      feedbackActions.incrementCombo();

      if (damageType === "critical") {
        feedbackActions.addActionFeedback(
          "critical",
          "Critical!",
          "치명타!",
          playerPositions[0],
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

  const lastPlayer1HealthRef = useRef(player1Health);
  useEffect(() => {
    const currentHealth = player1Health;
    const previousHealth = lastPlayer1HealthRef.current;
    const damageDone = previousHealth - currentHealth;

    if (damageDone > 0 && combatState.roundStarted && !combatState.roundEnded) {
      const damageType =
        damageDone >= 20 ? ("critical" as const) : ("normal" as const);
      feedbackActions.addDamageNumber(
        Math.round(damageDone),
        playerPositions[0],
        damageType,
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

  const handleAttackWithFeedback = useCallback(() => {
    const basicTechnique = techniqueSelection.availableTechniques[0];
    const animationName = basicTechnique
      ? resolveTechniqueAnimation(basicTechnique)
      : "jab";
    setPlayer1AttackAnimation(animationName);
    if (basicTechnique?.id) {
      setPlayer1TechniqueId(basicTechnique.id);
    }

    const skeletalAnim = getAnimation(animationName);
    const attackDuration =
      skeletalAnim?.duration ?? FALLBACK_ATTACK_DURATION_SECONDS;
    setPlayer1AttackDuration(attackDuration);
    const success = player1Animation.transitionToAttack(attackDuration);
    if (success) {
      combatActions.setExecutingTechnique(true);
    } else {
      console.warn(
        "Attack animation transition failed; executing attack logic directly.",
      );
      handleAttack();
    }
  }, [
    player1Animation,
    combatActions,
    handleAttack,
    techniqueSelection.availableTechniques,
  ]);

  const handleDefendWithFeedback = useCallback(() => {
    const defenderPos = playerPositions[0];
    const success = player1Animation.transitionTo(AnimationState.DEFEND);
    if (success) {
      handleDefend();
      feedbackActions.addActionFeedback(
        "blocked",
        "Blocked",
        "방어!",
        defenderPos,
      );
    } else {
      console.warn(
        "Defend animation transition failed; executing defend logic directly.",
      );
      handleDefend();
      feedbackActions.addActionFeedback(
        "blocked",
        "Blocked",
        "방어!",
        defenderPos,
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
    const groundState = balanceSystem.getGroundState(
      player1Animation.currentState,
    );
    if (groundState) {
      const recoveryType = determineRecoveryType(groundState);
      const animationState = getRecoveryAnimationState(recoveryType);
      player1Animation.transitionTo(animationState as AnimationState);
    }
  }, [balanceSystem, player1Animation]);

  const { queuedInputs, showHints } = useKeyboardControls({
    onStanceChange: useCallback(
      (stanceIndex: number) => {
        const stance = TRIGRAM_STANCES_ORDER[stanceIndex];
        if (stance) {
          handleStanceChangeWithAnimation(stance);
        }
      },
      [handleStanceChangeWithAnimation],
    ),
    onAction: useCallback(
      (action: string) => {
        switch (action) {
          case "attack":
            techniqueSelection.executeTechnique();
            break;
          case "block":
            handleDefendWithFeedback();
            break;
          case "recovery_quick": {
            executeFallbackRecovery();
            break;
          }
          case "recovery_roll": {
            const player1 = players[0];
            if (balanceSystem.canRecoverWithType(player1, "roll_recovery")) {
              const updatedPlayer = balanceSystem.applyRecoveryCost(
                player1,
                "roll_recovery",
              );
              onPlayerUpdate(0, { stamina: updatedPlayer.stamina });
              player1Animation.transitionTo(AnimationState.RECOVERY_ROLL);
            } else {
              audio.playSFX("menu_error");
              const player1Pos = playerPositions[0];
              feedbackActions.addActionFeedback(
                "blocked",
                "Not enough stamina!",
                "체력 부족!",
                player1Pos,
              );
              executeFallbackRecovery();
            }
            break;
          }
          case "recovery_defensive": {
            player1Animation.transitionTo(AnimationState.RECOVERY_DEFENSIVE);
            break;
          }

          case "footwork_circular_left":
          case "footwork_circular_right":
          case "footwork_slide_forward":
          case "footwork_slide_back":
          case "footwork_pivot_left":
          case "footwork_pivot_right":
          case "footwork_shuffle":
            player1Animation.transitionTo(action as AnimationState);
            break;

          case "stance_side_switch":
            handleStanceSideSwitch(0);
            break;

        }
      },
      [
        techniqueSelection,
        handleDefendWithFeedback,
        executeFallbackRecovery,
        balanceSystem,
        player1Animation,
        handleStanceSideSwitch,
        players,
        onPlayerUpdate,
        audio,
        feedbackActions,
        playerPositions,
      ],
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
            }),
          );
        }

        const key = directionMap[direction];
        activeMobileKeyRef.current = key;
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key,
            code: `Key${key.toUpperCase()}`,
            bubbles: true,
            cancelable: true,
          }),
        );
      } else if (eventType === "end") {
        if (activeMobileKeyRef.current) {
          const key = activeMobileKeyRef.current;
          window.dispatchEvent(
            new KeyboardEvent("keyup", {
              key,
              code: `Key${key.toUpperCase()}`,
              bubbles: true,
              cancelable: true,
            }),
          );
          activeMobileKeyRef.current = null;
        }
      }
    },
    [],
  );

  const handleMobileAttack = useCallback(() => {
    techniqueSelection.executeTechnique();
  }, [techniqueSelection]);

  const handleMobileBlock = useCallback(
    (eventType: ButtonEventType) => {
      if (eventType === "start") {
        handleDefendWithFeedback();
      }
    },
    [handleDefendWithFeedback],
  );

  const handleMobileStanceChange = useCallback(
    (stanceIndex: number) => {
      const stance = TRIGRAM_STANCES_ORDER[stanceIndex];
      if (stance) {
        handleStanceChangeWithAnimation(stance);
      }
    },
    [handleStanceChangeWithAnimation],
  );

  const handleMobileGesture = useCallback(
    (gesture: GestureEvent) => {
      switch (gesture.type) {
        case "swipe-right":
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "d" }));
          setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent("keyup", { key: "d" }));
          }, 100);
          break;
        case "swipe-left":
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
          setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent("keyup", { key: "a" }));
          }, 100);
          break;
        case "swipe-up":
          techniqueSelection.executeTechnique();
          break;
        case "swipe-down":
          techniqueSelection.executeTechnique();
          break;
        case "two-finger-tap":
          audio.playSFX("menu_select");
          break;
      }
    },
    [techniqueSelection, audio],
  );

  const toggleStanceWheel = useCallback(() => {
    setStanceWheelExpanded((prev) => !prev);
  }, []);

  const mobileControlsEnabled =
    isMobile &&
    !isPaused &&
    !showPauseMenu &&
    combatState.roundStarted &&
    !combatState.roundEnded &&
    matchCountdownComplete &&
    !showRoundStart &&
    !combatState.isExecutingTechnique;


  useEffect(() => {
    if (isPaused) return;

    if (timeRemaining <= 0 && !combatState.roundEnded) {
      combatActions.setRoundEnded(true);
      combatActions.setRoundStarted(false);
      combatActions.setRoundDisplayStatus("end");

      combatAudio.stopCombatMusic(1000);

      const winner = validPlayers[0].health > validPlayers[1].health ? 0 : 1;
      const roundWinner = validPlayers[winner];

      updateMatchScore(winner);

      addCombatMessage("라운드 종료!", "Round Over!");

      setTimeout(() => {
        startTransition(roundWinner, internalRound);
      }, 1500);
    }
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

  const executeAIActionCallbackRef = useRef<
    | ((
        action: string,
        targetPos?: Position,
        selectedTechnique?: KoreanTechnique,
        targetVitalPoint?: string,
      ) => void)
    | undefined
  >(undefined);

  const { updateDifficultyTarget } = useAICombat({
    player: validPlayers[1],
    opponent: validPlayers[0],
    personality: aiPersonality,
    adaptiveDifficulty,
    isPaused,
    roundStarted: combatState.roundStarted,
    roundEnded: combatState.roundEnded,
    arenaBounds,
    onExecuteAction: (action, targetPos, selectedTechnique, targetVitalPoint) =>
      executeAIActionCallbackRef.current?.(
        action,
        targetPos,
        selectedTechnique,
        targetVitalPoint,
      ),
    onStanceChange: handleAIStanceChange,
    onLateralityChange: () => handleStanceSideSwitch(1), // AI player (index 1)
    playerLaterality: combatState.playerLaterality[1], // AI's own laterality
    opponentLaterality: combatState.playerLaterality[0], // Opponent (human) laterality
  });

  const currentDifficultyTier = useMemo(
    () => adaptiveDifficulty.getDifficultyTier(),
    [adaptiveDifficulty],
  );

  useEffect(() => {
    if (!combatState.roundEnded || internalRound < 1) {
      return;
    }

    const roundsCompleted = internalRound;
    if (roundsCompleted % 2 === 0) {
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

      const newParams = adaptiveDifficulty.getDifficultyParameters();
      updateDifficultyTarget(newParams);

      if (import.meta.env.DEV) {
        const tier = adaptiveDifficulty.getDifficultyTier();
        console.log(
          `[DEV] Difficulty adjusted after round ${roundsCompleted}, new tier: ${tier}`,
        );
      }
    }
  }, [
    combatState.roundEnded,
    internalRound,
    adaptiveDifficulty,
    updateDifficultyTarget,
  ]);

  const executeAIActionCallback = useCallback(
    (
      action: string,
      targetPos?: Position,
      selectedTechnique?: KoreanTechnique,
      targetVitalPoint?: string,
    ) => {
      const aiStance = validPlayers[1]?.currentStance ?? TrigramStance.GEON;
      const aiFallbackTechnique = TRIGRAM_TECHNIQUES[aiStance]?.[0];
      const aiFallbackAnim = aiFallbackTechnique
        ? resolveTechniqueAnimation(aiFallbackTechnique)
        : "jab";
      switch (action) {
        case "attack":
          if (selectedTechnique) {
            const p2AttackAnimName = resolveTechniqueAnimation(selectedTechnique);
            setPlayer2AttackAnimation(p2AttackAnimName);

            if (selectedTechnique.id) {
              setPlayer2TechniqueId(selectedTechnique.id);
            }
            const p2AttackAnim = getAnimation(p2AttackAnimName);
            const p2AttackDur = p2AttackAnim?.duration ?? 0.55;
            setPlayer2AttackDuration(p2AttackDur);
            player2Animation.transitionToAttack(p2AttackDur);
          } else {
            setPlayer2AttackAnimation(aiFallbackAnim);
            if (aiFallbackTechnique?.id) {
              setPlayer2TechniqueId(aiFallbackTechnique.id);
            }
            const p2FallbackAnim = getAnimation(aiFallbackAnim);
            const p2FallbackDur = p2FallbackAnim?.duration ?? 0.55;
            setPlayer2AttackDuration(p2FallbackDur);
            player2Animation.transitionToAttack(p2FallbackDur);
          }
          handleAIAttack(selectedTechnique, targetVitalPoint);
          break;
        case "defend":
          player2Animation.transitionTo(AnimationState.DEFEND);
          handleAIDefend();
          break;
        case "technique":
        case "combo":
          if (selectedTechnique) {
            const p2TechAnimName = resolveTechniqueAnimation(selectedTechnique);
            setPlayer2AttackAnimation(p2TechAnimName);

            if (selectedTechnique.id) {
              setPlayer2TechniqueId(selectedTechnique.id);
            }
            const p2TechAnim = getAnimation(p2TechAnimName);
            const p2TechDur = p2TechAnim?.duration ?? 0.6;
            setPlayer2AttackDuration(p2TechDur);
            player2Animation.transitionToAttack(p2TechDur);
          } else {
            setPlayer2AttackAnimation(aiFallbackAnim);
            if (aiFallbackTechnique?.id) {
              setPlayer2TechniqueId(aiFallbackTechnique.id);
            }
            const p2FallbackAnim = getAnimation(aiFallbackAnim);
            const p2FallbackDur = p2FallbackAnim?.duration ?? 0.6;
            setPlayer2AttackDuration(p2FallbackDur);
            player2Animation.transitionToAttack(p2FallbackDur);
          }
          handleAITechnique(selectedTechnique, targetVitalPoint);
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
            const feintOffsetMeters = 0.5;
            const feintPos = {
              x: playerPos.x + (Math.random() - 0.5) * feintOffsetMeters,
              y: playerPos.y + (Math.random() - 0.5) * feintOffsetMeters,
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
                const retreatDistanceMeters = 0.8;
                const halfWidth = arenaBounds.worldWidthMeters / 2;
                const halfDepth = arenaBounds.worldDepthMeters / 2;
                const retreatPos = {
                  x: Math.max(
                    -halfWidth + 0.5, // 0.5m from edge
                    Math.min(
                      halfWidth - 0.5,
                      currentPlayerPos.x + (dx / dist) * retreatDistanceMeters,
                    ),
                  ),
                  y: Math.max(
                    -halfDepth + 0.5, // 0.5m from edge
                    Math.min(
                      halfDepth - 0.5,
                      currentPlayerPos.y + (dy / dist) * retreatDistanceMeters,
                    ),
                  ),
                };
                moveAIPlayer(retreatPos);
              }
            }, 200);
          }
          break;
        case "counter":
          if (selectedTechnique) {
            const p2CounterAnimName = resolveTechniqueAnimation(selectedTechnique);
            setPlayer2AttackAnimation(p2CounterAnimName);

            if (selectedTechnique.id) {
              setPlayer2TechniqueId(selectedTechnique.id);
            }
            const p2CounterAnim = getAnimation(p2CounterAnimName);
            const p2CounterDur = p2CounterAnim?.duration ?? 0.6;
            setPlayer2AttackDuration(p2CounterDur);
            player2Animation.transitionToAttack(p2CounterDur);
          } else {
            setPlayer2AttackAnimation(aiFallbackAnim);
            if (aiFallbackTechnique?.id) {
              setPlayer2TechniqueId(aiFallbackTechnique.id);
            }
            const p2FallbackAnim = getAnimation(aiFallbackAnim);
            const p2FallbackDur = p2FallbackAnim?.duration ?? 0.6;
            setPlayer2AttackDuration(p2FallbackDur);
            player2Animation.transitionToAttack(p2FallbackDur);
          }
          handleAIAttack(selectedTechnique, targetVitalPoint);
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
      player2Animation,
    ],
  );

  useEffect(() => {
    executeAIActionCallbackRef.current = executeAIActionCallback;
  }, [executeAIActionCallback]);

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

      updateMatchScore(winner);

      addCombatMessage(
        p1Defeated ? "플레이어 1 패배" : "플레이어 1 승리!",
        p1Defeated ? "Player 1 Defeated" : "Player 1 Victory!",
      );

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

  useEffect(() => {
    const handleCombatInput = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (showPauseMenu) {
          handleResume();
        } else {
          handlePause();
        }
        return;
      }

      if (isPaused || showPauseMenu) {
        return;
      }

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

  const player1MovementState = useMemo(() => {
    if (!validPlayers[0]?.bodyPartHealth) {
      return {
        statusText: { korean: "정상", english: "Normal" },
        isLimping: false,
        isSevereLimp: false,
      };
    }

    const result = injuryMovementModifier.calculateMovementSpeed(
      1.0,
      validPlayers[0].bodyPartHealth,
      validPlayers[0].currentStance ?? TrigramStance.GEON,
      validPlayers[0].pain ?? 0,
    );

    return {
      statusText: result.statusText,
      isLimping: result.isLimping,
      isSevereLimp: result.isSevereLimp,
      speedMultiplier: result.speedMultiplier,
    };
  }, [validPlayers]);

  const player2MovementState = useMemo(() => {
    if (!validPlayers[1]?.bodyPartHealth) {
      return {
        statusText: { korean: "정상", english: "Normal" },
        isLimping: false,
        isSevereLimp: false,
      };
    }

    const result = injuryMovementModifier.calculateMovementSpeed(
      1.0,
      validPlayers[1].bodyPartHealth,
      validPlayers[1].currentStance ?? TrigramStance.GEON,
      validPlayers[1].pain ?? 0,
    );

    return {
      statusText: result.statusText,
      isLimping: result.isLimping,
      isSevereLimp: result.isSevereLimp,
      speedMultiplier: result.speedMultiplier,
    };
  }, [validPlayers]);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
        backgroundColor: toHexColor(KOREAN_COLORS.UI_BACKGROUND_DARK),
        overflow: "hidden", // Prevent content from extending beyond container
      }}
      data-testid="combat-screen"
    >
      {/* Three.js Canvas for 3D rendering */}
      <Canvas
        style={{ width: `${width}px`, height: `${height}px` }}
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
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={renderConfig.dpr}
        shadows={false} // Temporarily disable shadows
        onCreated={({ gl }) => {
          gl.setClearColor(theme.colors.UI_BACKGROUND_DARK, 1);
        }}
      >
        {/* Lighting - CombatArena3D provides ambient, we add directional for shadows */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />

        {/* Adaptive Quality Wrapper monitors FPS and adjusts quality */}
        <AdaptiveQualityWrapper
          enabled={shouldEnableAdaptiveQuality}
          isMobile={isMobile}
        >
          {/* Performance overlay (dev mode) - controlled by showPerformanceOverlay prop */}
          {showPerformanceOverlay && !isMobile && !showPerformanceMonitor && (
            <PerformanceOverlay3D />
          )}

          {/* Combat Arena 3D Environment - uses physics-based world dimensions */}
          <CombatArena3D
            lighting="cyberpunk"
            scale={arenaBounds.scale}
            worldWidthMeters={arenaBounds.worldWidthMeters}
            worldDepthMeters={arenaBounds.worldDepthMeters}
          />

          {/* Animation updater - updates both player animations at 60fps */}
          <AnimationUpdater
            player1Animation={player1Animation}
            player2Animation={player2Animation}
          />

          {/* Acceleration updater - tracks player 1 movement time and updates speed */}
          <AccelerationUpdater
            isMoving={player1IsMoving}
            velocity={player1Velocity}
            movementTimeRef={player1MovementTimeRef}
            lastDirectionRef={player1LastDirectionRef}
            onSpeedUpdate={setPlayer1AccelerationBasedSpeed}
            walkSpeed={player1WalkRunSpeeds.walkSpeed}
            runSpeed={player1WalkRunSpeeds.runSpeed}
          />

          {/* Player 1 (Human) */}
          <Player3DWithTransitions
            {...convertPlayerStateToProps(
              validPlayers[0],
              player1PositionWithAttackMovement,
              player1Rotation,
              {
                isMobile,
                facing: "right",
                enableFacialExpressions: true,
                enableEyeTracking: true,
                opponentPosition: player2PositionWithAttackMovement,
              },
            )}
            currentAnimation={animationStateToPlayerAnimation(
              player1Animation.currentState,
            )}
            attackAnimation={player1AttackAnimation}
            laterality={combatState.playerLaterality[0]}
            enableTransitionEffects={!isMobile}
            enableStanceSymbol={!isMobile}
            enableStanceAudio={true}
          />

          {/* Player 2 (AI) */}
          <Player3DWithTransitions
            {...convertPlayerStateToProps(
              validPlayers[1],
              player2PositionWithAttackMovement,
              player2Rotation,
              {
                isMobile,
                facing: "right",
                enableFacialExpressions: true,
                enableEyeTracking: true,
                opponentPosition: player1PositionWithAttackMovement,
              },
            )}
            currentAnimation={animationStateToPlayerAnimation(
              player2Animation.currentState,
            )}
            attackAnimation={player2AttackAnimation}
            laterality={combatState.playerLaterality[1]}
            enableTransitionEffects={!isMobile}
            enableStanceSymbol={!isMobile}
            enableStanceAudio={true}
          />

          {/* Movement Status Indicators - Korean/English Bilingual */}
          {/* Player 1 Movement Status */}
          {(player1MovementState.isLimping ||
            player1MovementState.isSevereLimp) && (
            <Html
              position={[
                player1Position3D[0],
                player1Position3D[1] + 2.5,
                player1Position3D[2],
              ]}
              center
              data-testid="player1-movement-status"
            >
              <div
                style={{
                  fontSize: isMobile ? "12px" : "14px",
                  color: player1MovementState.isSevereLimp
                    ? toHexColor(KOREAN_COLORS.TEXT_ERROR)
                    : toHexColor(KOREAN_COLORS.ACCENT_GOLD),
                  fontFamily: FONT_FAMILY.KOREAN,
                  fontWeight: "bold",
                  textShadow: "0 0 4px rgba(0,0,0,0.8)",
                  background: "rgba(0, 0, 0, 0.6)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  whiteSpace: "nowrap",
                }}
              >
                {player1MovementState.statusText.korean} |{" "}
                {player1MovementState.statusText.english}
              </div>
            </Html>
          )}

          {/* Player 2 Movement Status */}
          {(player2MovementState.isLimping ||
            player2MovementState.isSevereLimp) && (
            <Html
              position={[
                player2Position3D[0],
                player2Position3D[1] + 2.5,
                player2Position3D[2],
              ]}
              center
              data-testid="player2-movement-status"
            >
              <div
                style={{
                  fontSize: isMobile ? "12px" : "14px",
                  color: player2MovementState.isSevereLimp
                    ? toHexColor(KOREAN_COLORS.TEXT_ERROR)
                    : toHexColor(KOREAN_COLORS.ACCENT_GOLD),
                  fontFamily: FONT_FAMILY.KOREAN,
                  fontWeight: "bold",
                  textShadow: "0 0 4px rgba(0,0,0,0.8)",
                  background: "rgba(0, 0, 0, 0.6)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  whiteSpace: "nowrap",
                }}
              >
                {player2MovementState.statusText.korean} |{" "}
                {player2MovementState.statusText.english}
              </div>
            </Html>
          )}

          {/* Trauma Overlays - Injury Visualization (외상 오버레이 - 부상 시각화) */}
          {/* Player 1 Injuries */}
          <TraumaOverlay3D
            playerId="player"
            health={validPlayers[0].health}
            injuries={player1Injuries}
            characterPosition={player1Position3D}
            isMobile={isMobile}
            showFractures={true}
          />

          {/* Player 2 Injuries */}
          <TraumaOverlay3D
            playerId="enemy"
            health={validPlayers[1].health}
            injuries={player2Injuries}
            characterPosition={player2Position3D}
            isMobile={isMobile}
            showFractures={true}
          />

          {/* Hit Effects */}
          <HitEffects3D
            effects={combatState.hitEffects}
            onEffectComplete={handleEffectComplete}
            arenaBounds={arenaBounds}
          />

          {/* Combat Particle Effects - Blood viscosity, organ damage, audio (전투 입자 효과) */}
          <CombatParticleEffects3D
            hitEffects={combatState.hitEffects}
            enabled={true}
            isMobile={isMobile}
          />

          {/* Vital Point Overlay - Show on both players when V is pressed */}
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
                }}
              />

              {/* Vital Point Overlay Controls - only visible when overlay is active */}
              <VitalPointOverlayControlsHtml
                screenPosition={{
                  top: `${layoutConstants.hudHeight + layoutConstants.padding}px`,
                  left: `${layoutConstants.padding}px`,
                }}
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
            </>
          )}

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

          {/* Performance Overlay (Development Only) - Toggle with P key */}
          {import.meta.env.DEV && showPerformanceMonitor && (
            <PerformanceOverlay3D visible={true} />
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

          {/* 3D Balance Indicators - Positioned below top HUD, to the right of side HUDs */}
          {/* Player 1 Balance Indicator - Upper left area, below top HUD */}
          {validPlayers[0] && (
            <BalanceIndicatorOverlayHtml
              player={validPlayers[0] as BalancePlayerState}
              currentTime={currentTime}
              position={[
                -2.5, // Left side of arena (to the right of left HUD in 3D space)
                2.5, // Upper area (below top HUD)
                -1.0, // Slightly forward toward camera
              ]}
              isMobile={isMobile}
            />
          )}

          {/* Player 2 Balance Indicator - Upper right area, below top HUD */}
          {validPlayers[1] && (
            <BalanceIndicatorOverlayHtml
              player={validPlayers[1] as BalancePlayerState}
              currentTime={currentTime}
              position={[
                2.5, // Right side of arena (to the left of right HUD in 3D space)
                2.5, // Upper area (below top HUD)
                -1.0, // Slightly forward toward camera
              ]}
              isMobile={isMobile}
            />
          )}

          {/* Mobile Touch Controls moved outside Canvas - using MobileControlsOverlay for reliable touch events */}

          {/* Performance Monitoring - FPS display (dev mode, toggle with P key) */}
          {process.env.NODE_ENV === "development" && showPerformanceMonitor && (
            <FPSMonitor
              enabled={true}
              warningThreshold={50}
              criticalThreshold={30}
            />
          )}
        </AdaptiveQualityWrapper>

        {/* Post-processing Effects - desktop high tier only for Android WebGL stability */}
        {renderConfig.postProcessing && (
          <EffectComposer multisampling={4}>
            <Bloom
              luminanceThreshold={0.9}
              luminanceSmoothing={0.9}
              mipmapBlur
              intensity={0.8}
              radius={0.4}
            />
            <Noise opacity={0.03} />
            <Vignette eskil={false} offset={0.1} darkness={0.3} />
          </EffectComposer>
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
          overflow: "clip",
        }}
      >
        {/* Top HUD - Round info, timer, return to menu */}
        <CombatTopHUD
          width={width}
          height={height}
          isMobile={isMobile}
          positionScale={positionScale}
          currentRound={internalRound}
          totalRounds={3}
          timerState={timerState}
          showTimer={
            combatState.roundStarted &&
            !combatState.roundEnded &&
            matchCountdownComplete &&
            !showRoundStart
          }
          onReturnToMenu={onReturnToMenu}
          isPaused={isPaused || showPauseMenu}
        />

        {/* Left HUD - Player 1 stats.
            On mobile, side HUDs occlude the 3D arena in both portrait and
            landscape; collapse them away so the arena stays fully visible.
            Player status remains available via CombatPortraitStatusStrip and
            bottom combat controls. */}
        {!isMobile && (
          <CombatLeftHUD
            width={width}
            height={height}
            isMobile={isMobile}
            positionScale={positionScale}
            player={validPlayers[0]}
            laterality={combatState.playerLaterality[0]}
            isInGuard={player1Animation.isInStanceGuard()}
            speedModifiers={player1SpeedModifiers}
          />
        )}

        {/* Right HUD - Player 2/AI stats with difficulty indicator */}
        {!isMobile && (
          <CombatRightHUD
            width={width}
            height={height}
            isMobile={isMobile}
            positionScale={positionScale}
            player={validPlayers[1]}
            laterality={combatState.playerLaterality[1]}
            speedModifiers={player2SpeedModifiers}
            difficultyTier={currentDifficultyTier}
          />
        )}

        {/* Portrait-mobile HP/stamina strip. Replaces the hidden side HUDs
            so both players can still see their health at a glance without
            re-introducing arena occlusion. */}
        {isMobile && isPortrait && (
          <CombatPortraitStatusStrip
            width={width}
            height={height}
            player1={validPlayers[0]}
            player2={validPlayers[1]}
            positionScale={positionScale}
            topOffset={layoutConstants.hudHeight}
          />
        )}

        {/* Bottom HUD - Technique bar, volume, messages */}
        <CombatBottomHUD
          width={width}
          height={height}
          isMobile={isMobile}
          positionScale={positionScale}
          visible={
            combatState.roundStarted &&
            !combatState.roundEnded &&
            matchCountdownComplete &&
            !showRoundStart
          }
          techniques={techniqueSelection.availableTechniques}
          player={validPlayers[0]}
          selectedIndex={techniqueSelection.selectedIndex}
          cooldowns={cooldownsMap}
          onTechniqueSelect={techniqueSelection.selectTechnique}
          combatMessages={combatState.combatMessages}
        />

        {/* Player State Visual Indicators */}
        {/* Player 1 State Overlay - includes consciousness blur, pain vignette, etc.
            In portrait mobile the arena is already rendered in a compressed 3:4
            aspect ratio, so halve the fullscreen vignette/blur/flash intensity
            to avoid further obscuring the scene. */}
        <PlayerStateOverlayHtml
          pain={validPlayers[0].pain}
          balanceState={getBalanceState(validPlayers[0].balance)}
          position="left"
          consciousness={validPlayers[0].consciousness}
          bloodLoss={0} // FIXME: bloodLoss property not yet added to PlayerState interface - overlay will not display until implemented
          stamina={validPlayers[0].stamina}
          isMobile={isMobile}
          intensityScale={isMobile && isPortrait ? 0.5 : 1}
        />

        {/* Note: Player 2 (AI) does not get fullscreen state overlays like consciousness blur */}
        {/* as those effects would incorrectly affect the player's view */}

        {/* Breathing Disruption Indicators */}
        {/* Player 1 Breathing Indicator - positioned near left HUD */}
        <div
          style={{
            position: "absolute",
            left: isMobile ? "10px" : "20px",
            top: isMobile ? "120px" : "160px",
            zIndex: Z_INDEX.HUD + 1,
            pointerEvents: "none",
          }}
          data-testid="player1-breathing-indicator-container"
        >
          <BreathingIndicator player={validPlayers[0]} isMobile={isMobile} />
        </div>

        {/* Player 2 Breathing Indicator - positioned near right HUD */}
        <div
          style={{
            position: "absolute",
            right: isMobile ? "10px" : "20px",
            top: isMobile ? "120px" : "160px",
            zIndex: Z_INDEX.HUD + 1,
            pointerEvents: "none",
          }}
          data-testid="player2-breathing-indicator-container"
        >
          <BreathingIndicator player={validPlayers[1]} isMobile={isMobile} />
        </div>

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
            if (matchScore.player1 >= 2 || matchScore.player2 >= 2) {
              const winner = matchScore.player1 >= 2 ? 0 : 1;
              onGameEnd(winner);
            } else {
              skipCountdown();
            }
          }}
          onSkip={() => {
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
                internalRound,
              );
            }
            setShowRoundStart(false);
            startRound();
          }}
          isMobile={isMobile}
        />
      )}

      {/* Round Display Status - Brief status messages */}
      {contentReady && combatState.roundDisplayStatus && (
        <RoundDisplayStatus
          status={combatState.roundDisplayStatus}
          isMobile={isMobile}
        />
      )}

      {/* Mobile Controls - Pure DOM, rendered OUTSIDE Canvas for reliable touch events */}
      {/* Uses pure DOM handlers instead of drei's Html which can block touch events on mobile */}
      {isMobile && (
        <>
          <MobileControlsOverlay
            onMove={handleMobileMove}
            onAttack={handleMobileAttack}
            onBlock={handleMobileBlock}
            bottom={getMobileControlsBottom(height)}
            viewportWidth={width}
            viewportHeight={height}
          />

          <StanceWheelPure
            currentStance={currentStanceIndex}
            onStanceChange={handleMobileStanceChange}
            expanded={stanceWheelExpanded}
            onToggle={toggleStanceWheel}
            disabled={!mobileControlsEnabled}
            opacity={0.8}
          />

          <GestureRecognizerPure
            onGesture={handleMobileGesture}
            enabled={mobileControlsEnabled}
            showFeedback={true}
            minSwipeDistance={50}
          />
        </>
      )}
    </div>
  );
};

export default CombatScreen3D;
