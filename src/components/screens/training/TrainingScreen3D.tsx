/**
 * TrainingScreen3D - Three.js-based training screen
 *
 * Refactored to use consolidated hooks matching CombatScreen architecture.
 * Provides 3D training dummy with vital point targeting and UI overlays.
 *
 * UI Rendering: All HUD elements are rendered in an absolute-positioned div
 * OUTSIDE the Canvas, matching CombatScreen's reliable rendering pattern.
 * This eliminates the need for Html overlays inside Three.js and ensures
 * HUDs appear immediately without waiting for Canvas initialization.
 *
 * Architecture (Consolidated in PR #1394 + Issue #1398):
 * - TrainingLeftHUD: Anatomy controls, guard indicator
 * - TrainingRightHUD: Training stats, mode selector, vital point selection
 * - TrainingTopHUD: Training controls, archetype selector, return button
 * - TrainingBottomHUD: Technique bar, feedback messages, mobile controls
 * - VitalPointOverlayControlsPure: Vital point overlay controls (pure DOM)
 *
 * All UI components render as pure DOM in the HUD overlay div (lines 1230+).
 * NO Html components from @react-three/drei are used inside the Canvas.
 * This ensures clean separation of 3D rendering and UI layers.
 *
 * @korean 훈련화면3D - 훈련 상태 훅을 사용한 리팩토링된 3D 훈련 화면
 */

// UI renders outside Canvas in absolute-positioned div - no Html needed
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAudio } from "../../../audio/AudioProvider";
import { useCombatAudio } from "../../screens/combat/hooks/useCombatAudio";
import { getArchetypePhysicalAttributes } from "../../../data/archetypePhysicalAttributes";
import { usePlayerAnimation } from "../../../hooks/usePlayerAnimation";
import { useTechniqueSelection } from "../../../hooks/useTechniqueSelection";
import { GestureEvent } from "../../../hooks/useTouchControls";
import { useWebGLContextLossHandler } from "../../../hooks/useWebGLContextLossHandler";
import { PlayerState } from "../../../systems";
import {
  AnimationEvents,
  AnimationState,
  AnimationType,
  getAnimationForTechnique,
} from "../../../systems/animation";
import { getAnimationForTechniqueOrDefault } from "../../../systems/animation/core/TechniqueAnimationMapping";
import { physicalReachCalculator } from "../../../systems/physics";
import {
  MovementType,
  SpeedModifierSystem,
} from "../../../systems/physics/SpeedModifierSystem";
import { TRIGRAM_STANCES_ORDER } from "../../../systems/trigram/types";
import {
  CombatState,
  PlayerArchetype,
  Position,
  Technique,
} from "../../../types";
import { getPerformanceSettings } from "../../../types/constants";
import { getMobileControlsBottom } from "../../../types/constants/layout";
import { Z_INDEX } from "../../../types/LayoutTypes";
import { DEFAULT_BODY_RADIUS_METERS } from "../../../types/physicsConstants";
import { usePlayerMovement } from "../../../utils/inputSystem";
import { calculateDistance3D } from "../../../utils/math";
import {
  animationStateToPlayerAnimation,
  convertPlayerStateToProps,
} from "../../../utils/player3DHelpers";
import { useKoreanTheme } from "../../shared/base/useKoreanTheme";
import {
  GestureRecognizerPure,
  StanceWheelPure,
} from "../../shared/mobile";
import {
  MobileControlsOverlay,
  type ButtonEventType,
  type Direction,
  type DPadEventType,
} from "../../shared/mobile/MobileControlsPure";
import {
  Player3DWithTransitions,
  VitalPointMarkers3D,
  type BodyRegionFilter,
} from "../../shared/three";
import { StanceChangeIndicator } from "../../shared/three/indicators/StanceChangeIndicator";
import { CombatArena3D } from "../../shared/three/scene/CombatArena3D";
import { VitalPointOverlayControlsPure } from "../../shared/ui/VitalPointOverlayControlsPure";
import AnatomyOverlay3D, {
  type AnatomyLayer,
} from "./components/AnatomyOverlay3D";
import FootPlacementMarkers3D from "./components/FootPlacementMarkers3D";
import HitFeedbackEffect3D from "./components/HitFeedbackEffect3D";
import type { DifficultyMode } from "./components/TrainingDummy3D";
import TrainingDummy3D from "./components/TrainingDummy3D";
// HUD Components - Organized UI layout
import {
  TrainingBottomHUD,
  TrainingLeftHUD,
  TrainingRightHUD,
  TrainingTopHUD,
} from "./components/hud";
// Attack movement hook for player forward momentum
import { useAttackMovement } from "./hooks/useAttackMovement";
import useTrainingActions from "./hooks/useTrainingActions";
import { useTrainingLayout } from "./hooks/useTrainingLayout";
import useTrainingState from "./hooks/useTrainingState";

/**
 * AnimationUpdater - Component that updates player animation at 60fps
 *
 * @korean 훈련애니메이션업데이터 - 60fps로 플레이어 애니메이션을 업데이트하는 컴포넌트
 */
interface TrainingAnimationUpdaterProps {
  readonly playerAnimation: ReturnType<typeof usePlayerAnimation>;
}

const TrainingAnimationUpdater: React.FC<TrainingAnimationUpdaterProps> = ({
  playerAnimation,
}) => {
  useFrame((_state, delta) => {
    playerAnimation.update(delta);
  });

  return null;
};

/**
 * Props for the TrainingScreen3D component
 */
export interface TrainingScreen3DProps {
  /** Callback to update player state */
  readonly onPlayerUpdate: (updates: Partial<PlayerState>) => void;
  /** Callback when returning to menu */
  readonly onReturnToMenu: () => void;
  /** Canvas width in pixels. Defaults to 1200 */
  readonly width?: number;
  /** Canvas height in pixels. Defaults to 800 */
  readonly height?: number;
  /** Initial archetype from IntroScreen selection. Defaults to MUSA */
  readonly initialArchetype?: PlayerArchetype;
}

/**
 * TrainingScreen3D Component
 * Three.js-based training screen with 3D dummy and Html UI
 *
 * Uses consolidated hooks for state management matching CombatScreen architecture.
 */
export const TrainingScreen3D: React.FC<TrainingScreen3DProps> = ({
  onPlayerUpdate,
  onReturnToMenu,
  width = 1200,
  height = 800,
  initialArchetype = PlayerArchetype.MUSA,
}) => {
  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1: Core State Management (Hooks)
  // ═══════════════════════════════════════════════════════════════════════════

  // UI overlays now render outside Canvas in absolute-positioned div
  // This matches CombatScreen pattern for reliable, immediate rendering
  // No mount delay needed - UI is not dependent on Three.js render loop

  // Consolidated training state management (matches useCombatState pattern)
  const { state: trainingState, actions: trainingActions } = useTrainingState();

  // Audio context
  const audio = useAudio();
  
  // Combat audio for bone impact sounds
  const { playBoneImpactSound, playAttackSound, playStanceChangeSound } =
    useCombatAudio();

  // Responsive detection and layout (using dedicated training layout hook)
  const { trainingAreaBounds, isMobile, screenSize } = useTrainingLayout(
    width,
    height,
  );

  // Use Korean theme hook for consistent theming
  const theme = useKoreanTheme({
    variant: "primary",
    size: "md",
    isMobile,
  });

  // Screen size scaling for 4K and large displays
  // Uses SPACING_SCALE_MAP values: mobile=0.5, tablet=0.75, desktop=1.0, large=1.25, xlarge=1.5
  const positionScale = React.useMemo(() => {
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
  }, [screenSize]);

  // Training difficulty and vital point configuration
  const difficulty: DifficultyMode = "normal";
  const vitalPointCount = 70; // Show all 70 vital points

  // Archetype selection for training (allows testing different body types)
  // 원형 선택 - 다양한 체형 테스트 가능
  // Uses initialArchetype from IntroScreen selection, can be changed locally
  const [selectedArchetype, setSelectedArchetype] =
    React.useState<PlayerArchetype>(initialArchetype);

  // Vital point overlay state
  const [overlayVisible, setOverlayVisible] = React.useState(false);
  const [severityFilters, setSeverityFilters] = React.useState<
    import("../../../types/common").VitalPointSeverity[]
  >([]);
  const [regionFilter, setRegionFilter] =
    React.useState<BodyRegionFilter>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showLabels, setShowLabels] = React.useState(true);
  const [animated, setAnimated] = React.useState(true);
  const [scale, setScale] = React.useState(1.0);

  // Track current attack animation for technique-specific animations
  // 기술별 애니메이션을 위한 현재 공격 애니메이션 추적
  const [attackAnimation, setAttackAnimation] = React.useState<
    string | undefined
  >(undefined);

  // Keyboard shortcut for toggling overlay (V key)
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "v" || e.key === "V") {
        setOverlayVisible((prev) => !prev);
        audio.playSFX("menu_select");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [audio]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2: WebGL Context Management
  // ═══════════════════════════════════════════════════════════════════════════

  // Track context loss for recovery
  const contextLossCountRef = useRef(0);

  // Handle WebGL context loss and restoration (for 3D scene only)
  useWebGLContextLossHandler({
    onContextLost: () => {
      console.warn("⚠️ WebGL context lost in TrainingScreen");
      contextLossCountRef.current += 1;
    },
    onContextRestored: () => {
      console.log("✓ WebGL context restored in TrainingScreen");
    },
    autoRestore: true,
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2B: Speed Modifier System (matching CombatScreen pattern)
  // ═══════════════════════════════════════════════════════════════════════════

  // Speed Modifier System for dynamic movement speed calculations
  const speedModifierSystem = useMemo(() => new SpeedModifierSystem(), []);

  // Track speed modifiers for movement (simplified for training - no injuries)
  // Initial values match SpeedModifierSystem.BASE_WALKING_SPEED and BASE_ACCELERATION
  const [speedModifiers, setSpeedModifiers] = useState({
    finalSpeed: 6.0, // BASE_WALK_SPEED (6.0 m/s for responsive combat)
    baseSpeed: 6.0,
    finalAcceleration: 12.0, // BASE_ACCELERATION (12.0 m/s² for quick response)
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 3: Movement & Position Management
  // ═══════════════════════════════════════════════════════════════════════════

  // Initial player position in pixel space (left side of arena, centered vertically)
  // Physics-first: initial position in METERS (relative to arena center)
  // 0% from center (centered laterally) creates ~1.2m distance to dummy
  // This allows most kicks to land immediately, punches require 1-2 steps (realistic)
  const initialPositionMeters = useMemo<Position>(
    () => ({
      x: trainingAreaBounds.worldWidthMeters * 0.0, // Centered laterally
      y: 0, // Centered vertically
    }),
    [trainingAreaBounds],
  );

  // CRITICAL FIX: Memoize onPositionChange to prevent usePlayerMovement callback recreation
  // Without this, a new function is created every render, causing animation frame cancellation
  const handlePositionChange = useCallback(
    (newPosition: Position) => {
      onPlayerUpdate({ position: newPosition });
    },
    [onPlayerUpdate],
  );

  // CRITICAL FIX: Memoize bounds object to prevent usePlayerMovement callback recreation
  // Without this, a new object reference is created every render, causing animation frame cancellation
  const movementBounds = useMemo(
    () => ({
      worldWidthMeters: trainingAreaBounds.worldWidthMeters,
      worldDepthMeters: trainingAreaBounds.worldDepthMeters,
    }),
    [trainingAreaBounds.worldWidthMeters, trainingAreaBounds.worldDepthMeters],
  );

  // Player movement with physics-based acceleration and stance modifiers
  // All positions are in METERS - no pixel conversions
  const { playerPosition, isMoving, velocity } = usePlayerMovement({
    enabled: true, // Always allow movement in training screen
    bounds: movementBounds, // Use memoized bounds object
    onPositionChange: handlePositionChange, // Use memoized callback
    initialPositionMeters,
    // Physics parameters for realistic training movement (always enabled)
    currentStance: TRIGRAM_STANCES_ORDER[trainingState.currentStanceIndex],
    legInjuryFactor: 0, // No injury in training mode
    isRunning: false,
    // Speed modifier overrides from SpeedModifierSystem (no hardcoded values)
    maxSpeedOverride: speedModifiers.finalSpeed,
    accelerationOverride: speedModifiers.finalAcceleration,
  });

  // Physics-first: playerPosition is already in METERS (x = lateral, y = forward/backward)
  // Direct conversion to 3D world coordinates - no pixel math needed
  const player3DPosition = useMemo<[number, number, number]>(() => {
    // playerPosition.x is lateral position in meters (- = left, + = right)
    // playerPosition.y is forward/backward position in meters (- = toward camera, + = away)
    return [playerPosition.x, 0, playerPosition.y];
  }, [playerPosition]);

  // Dummy position in meters (right side, creating optimal training distance)
  // Positioned at 15% from center to give ~1.2-1.6m distance depending on archetype
  // Allows kicks to hit from starting position, punches with slight approach
  // Uses world dimensions for physics-consistent positioning
  const dummyPosition = useMemo<[number, number, number]>(
    () => [trainingAreaBounds.worldWidthMeters * 0.15, 0, 0],
    [trainingAreaBounds.worldWidthMeters],
  );

  // Calculate center-to-center distance to dummy in meters
  const centerToCenterDistance = useMemo(
    () => calculateDistance3D(player3DPosition, dummyPosition),
    [player3DPosition, dummyPosition],
  );

  // Calculate effective distance (adjusted for body radius)
  // Attacks hit the body surface, not the center point
  // Training dummy uses DEFAULT_BODY_RADIUS_METERS since it has no archetype
  // For combat between players, use calculateBodyRadius(targetPhysicalAttributes)
  // 실제 타격거리 = 중심간거리 - 목표체 반경
  const distanceToDummy = useMemo(
    () => Math.max(0, centerToCenterDistance - DEFAULT_BODY_RADIUS_METERS),
    [centerToCenterDistance],
  );

  // Track last facing rotation for when movement stops
  const lastFacingRotationRef = useRef<number>(0);

  // Calculate rotation: face movement direction when moving, face dummy when idle
  // 이동 중에는 이동 방향을, 정지 시에는 더미를 향함
  const playerRotation = useMemo(() => {
    if (isMoving && velocity && (velocity.x !== 0 || velocity.y !== 0)) {
      // When moving: face the direction of movement
      // velocity.y is actually the Z direction in 3D space
      return Math.atan2(velocity.x, -velocity.y);
    } else {
      // When idle: face the dummy (target)
      const dx = dummyPosition[0] - player3DPosition[0];
      const dz = dummyPosition[2] - player3DPosition[2];
      return Math.atan2(dx, dz);
    }
  }, [isMoving, velocity, player3DPosition, dummyPosition]);

  // Update ref in effect to avoid updating during render
  useEffect(() => {
    lastFacingRotationRef.current = playerRotation;
  }, [playerRotation]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 4: Player Animation State Machine
  // ═══════════════════════════════════════════════════════════════════════════

  // Reference for pending attack (executed at animation frame 6)
  // Includes animationType and startTime for distance-based hit detection
  // matching CombatSystem behavior
  const pendingAttackRef = useRef<{
    accuracy: number;
    vitalPoint: string;
    animationType?: AnimationType;
    startTime?: number;
  } | null>(null);

  // Forward ref for handleDummyHit (defined in actions hook)
  const handleDummyHitRef = useRef<(vitalPointId: string) => boolean>(
    () => false,
  );

  // Ref for playerAnimation to avoid circular dependencies in animation events
  const playerAnimationRef = useRef<ReturnType<
    typeof usePlayerAnimation
  > | null>(null);

  // Player animation events (matches CombatScreen pattern)
  const playerAnimationEvents = useMemo<AnimationEvents>(
    () => ({
      onFrame: (frame, state) => {
        // Execute attack at midpoint of animation (frame 6 of 12)
        if (state === "attack" && frame === 6 && pendingAttackRef.current) {
          const attackData = pendingAttackRef.current;
          pendingAttackRef.current = null;
          // Execute dummy hit with stored vital point
          handleDummyHitRef.current(attackData.vitalPoint);
        }
      },
      onAnimationComplete: (state) => {
        if (state === "stance_change") {
          // Stance change animation completed - transition to stance guard
          // 자세 변경 완료 - 자세 가드로 전환
          playStanceChangeSound();
          const currentStance =
            TRIGRAM_STANCES_ORDER[trainingState.currentStanceIndex];
          if (currentStance && playerAnimationRef.current) {
            playerAnimationRef.current.transitionToStanceGuard(currentStance);
          }
        }
      },
    }),
    [playStanceChangeSound, trainingState.currentStanceIndex],
  );

  const playerAnimation = usePlayerAnimation({
    events: playerAnimationEvents,
  });

  // Store animation ref for use in event callbacks
  useEffect(() => {
    playerAnimationRef.current = playerAnimation;
  }, [playerAnimation]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 5: Training Actions (Hook-based)
  // ═══════════════════════════════════════════════════════════════════════════

  // Get current stance for animation transitions (needed before useTrainingActions)
  // 현재 자세 (애니메이션 전환용)
  const currentStance = useMemo(
    () => TRIGRAM_STANCES_ORDER[trainingState.currentStanceIndex],
    [trainingState.currentStanceIndex],
  );

  // Track previous stance for visual feedback (StanceChangeIndicator)
  // 이전 자세 추적 - 자세 변경 표시기 시각적 피드백용
  const [previousStanceIndex, setPreviousStanceIndex] = useState<number>(0);

  // Ref to track current technique's animation type (updated by technique selection)
  // This allows useTrainingActions to access the current technique's animation type
  // without creating circular dependencies
  const currentTechniqueAnimationTypeRef = useRef<AnimationType>(
    AnimationType.JAB,
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 7: Training Player State (Visual Display)
  // ═══════════════════════════════════════════════════════════════════════════

  // Training player state for visualization
  const trainingPlayerState = useMemo<PlayerState>(() => {
    return {
      id: "training-player",
      name: { korean: "훈련생", english: "Trainee" },
      archetype: selectedArchetype,
      health: 100,
      maxHealth: 100,
      ki: 100,
      maxKi: 100,
      stamina: 100,
      maxStamina: 100,
      energy: 100,
      maxEnergy: 100,
      attackPower: 10,
      defense: 10,
      speed: 10,
      technique: 10,
      pain: 0,
      consciousness: 100,
      balance: 100,
      momentum: 0,
      currentStance: TRIGRAM_STANCES_ORDER[trainingState.currentStanceIndex],
      combatState: CombatState.IDLE,
      position: playerPosition,
      isBlocking: false,
      isStunned: false,
      isCountering: false,
      lastActionTime: 0,
      recoveryTime: 0,
      lastStanceChangeTime: 0,
      statusEffects: [],
      activeEffects: [],
      vitalPoints: [],
      totalDamageReceived: 0,
      totalDamageDealt: 0,
      hitsTaken: 0,
      hitsLanded: trainingState.stats.hits,
      perfectStrikes: trainingState.perfectStrikes,
      vitalPointHits: 0,
      misses: trainingState.stats.misses,
      accuracy: trainingState.stats.accuracy,
      comboCount: trainingState.stats.combo,
    };
  }, [playerPosition, trainingState, selectedArchetype]);

  // Calculate speed modifiers when player state changes
  // Updates at 5Hz (every 200ms) matching CombatScreen pattern
  useEffect(() => {
    const updateSpeedModifiers = () => {
      const modifiers = speedModifierSystem.calculateSpeedModifiers(
        trainingPlayerState,
        MovementType.WALKING, // Base calculation, actual type determined by input
        false, // isCrouching
      );

      setSpeedModifiers({
        finalSpeed: modifiers.finalSpeed,
        baseSpeed: modifiers.baseSpeed,
        finalAcceleration: modifiers.finalAcceleration,
      });
    };

    // Initial calculation
    updateSpeedModifiers();

    // Update every 200ms (5Hz) for responsive feedback without excessive re-renders
    const intervalId = setInterval(updateSpeedModifiers, 200);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingPlayerState]); // speedModifierSystem is memoized and never changes

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 5: Player Attack Movement (Forward Momentum)
  // ═══════════════════════════════════════════════════════════════════════════

  // Determine if player is currently attacking based on animation state
  const isPlayerAttacking = useMemo(
    () => playerAnimation?.currentState === "attack",
    [playerAnimation],
  );

  // Calculate attack direction (toward dummy)
  const attackDirection = useMemo(() => {
    const dx = dummyPosition[0] - player3DPosition[0];
    const dz = dummyPosition[2] - player3DPosition[2];
    return new THREE.Vector3(dx, 0, dz).normalize();
  }, [dummyPosition, player3DPosition]);

  // Apply attack movement physics to player position
  const {
    currentPosition: player3DPositionWithAttackMovement,
  } = useAttackMovement({
    isAttacking: isPlayerAttacking,
    animationType: currentTechniqueAnimationTypeRef.current,
    currentStance: trainingPlayerState.currentStance,
    basePosition: player3DPosition,
    attackDirection,
    animationDuration: 0.4,
  });

  // Use position with attack movement for rendering
  const finalPlayer3DPosition = isPlayerAttacking
    ? player3DPositionWithAttackMovement
    : player3DPosition;

  // ═══════════════════════════════════════════════════════════════════════════

  // Ref to store handleAttack for use in useTechniqueSelection callback
  // This breaks circular dependency between useTechniqueSelection and useTrainingActions
  const handleAttackRef = useRef<(() => void) | null>(null);

  // Technique selection and execution for training
  // Moved before useTrainingActions to provide selectedTechniqueId
  const techniqueSelection = useTechniqueSelection({
    player: trainingPlayerState,
    enabled: trainingState.isTraining,
    onTechniqueExecute: useCallback(
      (technique: Technique) => {
        // Show technique usage feedback
        trainingActions.setFeedback(
          `${technique.name.korean} 사용! | Used ${technique.name.english}!`,
        );

        // Set attack animation based on technique
        // 기술에 따른 공격 애니메이션 설정
        const animationName = getAnimationForTechnique(
          technique.name.english || technique.id,
        );
        setAttackAnimation(animationName);

        // In training mode, do not deduct resources to allow continuous practice
        // Resources are displayed for educational purposes only

        // Execute attack with technique (visual feedback)
        // Use ref to avoid circular dependency
        handleAttackRef.current?.();
      },
      [trainingActions],
    ),
  });

  // Derive selected technique ID for intensity-based attack sounds
  const selectedTechniqueId = useMemo(() => {
    const techniques = techniqueSelection.availableTechniques;
    const selectedIdx = techniqueSelection.selectedIndex;
    if (techniques.length === 0 || selectedIdx < 0 || selectedIdx >= techniques.length) {
      return undefined;
    }
    return techniques[selectedIdx]?.id;
  }, [techniqueSelection.availableTechniques, techniqueSelection.selectedIndex]);

  // Training actions hook (matches useCombatActions pattern)
  const {
    handleStartTraining,
    handleStopTraining,
    handleDummyHit,
    handleDummyDefeated,
    handleStanceChange,
    handleAttack,
  } = useTrainingActions({
    state: trainingState,
    actions: trainingActions,
    playerPosition,
    player3DPosition,
    dummyPosition,
    playerArchetype: selectedArchetype,
    playerStance: currentStance,
    currentTechniqueAnimationTypeRef, // Ref for technique's animation type
    audio,
    playBoneImpactSound, // Pass bone impact audio function from useCombatAudio
    playAttackSound, // Pass attack sound function from useCombatAudio
    selectedTechniqueId, // Pass selected technique ID for intensity-based attack sounds
    onPlayerUpdate: (updates) => {
      onPlayerUpdate(updates);
    },
    playerAnimation: {
      transitionTo: playerAnimation.transitionTo,
      transitionToStanceGuard: playerAnimation.transitionToStanceGuard,
      currentState: playerAnimation.currentState,
    },
    pendingAttackRef, // Share the ref with animation events
  });

  // Update handleAttack ref for useTechniqueSelection callback
  useEffect(() => {
    handleAttackRef.current = handleAttack;
  }, [handleAttack]);

  // Update the ref so animation events can call handleDummyHit
  useEffect(() => {
    handleDummyHitRef.current = handleDummyHit;
  }, [handleDummyHit]);

  // Wrapped stance change handler with visual feedback tracking
  // 시각적 피드백 추적을 포함한 자세 변경 핸들러 래퍼
  const handleStanceChangeWithVisualFeedback = useCallback(
    (stanceIndex: number) => {
      // Capture previous stance before the change for visual indicator
      setPreviousStanceIndex(trainingState.currentStanceIndex);
      // Execute the actual stance change
      handleStanceChange(stanceIndex);
    },
    [handleStanceChange, trainingState.currentStanceIndex],
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 6: Movement-Animation Synchronization
  // ═══════════════════════════════════════════════════════════════════════════

  // Sync movement with animation (matches CombatScreen pattern)
  const prevIsMovingRef = useRef<boolean>(isMoving);
  useEffect(() => {
    if (prevIsMovingRef.current !== isMoving) {
      if (isMoving) {
        playerAnimation.transitionTo(AnimationState.WALK);
      } else if (playerAnimation.currentState === AnimationState.WALK) {
        // When stopping movement, transition to stance-specific guard animation
        // 이동 중지 시 자세별 가드 애니메이션으로 전환
        playerAnimation.transitionToStanceGuard(currentStance);
      }
      prevIsMovingRef.current = isMoving;
    }
  }, [isMoving, playerAnimation, currentStance]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 7B: Technique Selection System (Moved earlier - see before useTrainingActions)
  // ═══════════════════════════════════════════════════════════════════════════

  // Convert cooldowns to Map for TechniqueBar
  const cooldownsMap = useMemo(() => {
    const map = new Map<string, number>();
    techniqueSelection.activeCooldowns.forEach((cd) => {
      map.set(cd.techniqueId, cd.remaining);
    });
    return map;
  }, [techniqueSelection.activeCooldowns]);

  // Calculate effective reach based on selected technique (matches CombatSystem)
  // 선택된 기술에 따른 유효 사정거리 계산 (전투 시스템과 동일)
  const { currentTechniqueReach, currentAnimationType } = useMemo(() => {
    const techniques = techniqueSelection.availableTechniques;
    const selectedIdx = techniqueSelection.selectedIndex;
    if (techniques.length === 0) {
      return {
        currentTechniqueReach: 0.7,
        currentAnimationType: AnimationType.JAB,
      };
    }
    const currentTechnique =
      techniques[Math.min(selectedIdx, techniques.length - 1)];
    if (!currentTechnique) {
      return {
        currentTechniqueReach: 0.7,
        currentAnimationType: AnimationType.JAB,
      };
    }
    // Get animation type from technique ID
    const animConfig = getAnimationForTechniqueOrDefault(currentTechnique.id);
    // Calculate max reach using physical attributes and stance
    const physicalAttributes =
      getArchetypePhysicalAttributes(selectedArchetype);
    const reach = physicalReachCalculator.calculateMaxReach(
      physicalAttributes,
      animConfig.type,
      currentStance,
    );
    return {
      currentTechniqueReach: reach,
      currentAnimationType: animConfig.type,
    };
  }, [
    techniqueSelection.availableTechniques,
    techniqueSelection.selectedIndex,
    selectedArchetype,
    currentStance,
  ]);

  // Update the animation type ref in an effect (not during render)
  // 렌더링 중이 아닌 effect에서 ref 업데이트
  useEffect(() => {
    currentTechniqueAnimationTypeRef.current = currentAnimationType;
  }, [currentAnimationType]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 8: Mobile Touch Controls
  // ═══════════════════════════════════════════════════════════════════════════

  // Reference for tracking active mobile movement key (prevents stuck keys)
  const activeMobileKeyRef = useRef<string | null>(null);

  // Enable mobile controls always in training (allow movement even before starting training)
  const mobileControlsEnabled = isMobile;

  // Mobile D-pad movement handler (matches CombatScreen implementation)
  const handleMobileMove = useCallback(
    (direction: Direction | null, eventType: DPadEventType) => {
      // Map D-pad directions to movement keys (WASD)
      const directionMap: Record<Direction, string> = {
        up: "w",
        "up-right": "w",
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
            }),
          );
        }

        // Press new key with proper keyboard event properties
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
        // Release active key when D-pad released
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

  // Mobile attack handler - uses the same handleAttack from training actions
  const handleMobileAttack = useCallback(() => {
    handleAttack();
  }, [handleAttack]);

  // Mobile block handler
  const handleMobileBlock = useCallback(
    (eventType: ButtonEventType) => {
      if (eventType === "start") {
        audio.playSFX("block");
      }
    },
    [audio],
  );

  // Mobile gesture handler
  const handleMobileGesture = useCallback(
    (gesture: GestureEvent) => {
      switch (gesture.type) {
        case "swipe-right":
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "d" }));
          break;
        case "swipe-left":
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
          break;
        case "swipe-up":
          if (trainingState.isTraining) {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
          }
          break;
        case "swipe-down":
          trainingActions.resetDummy();
          break;
        case "two-finger-tap":
          trainingActions.setTrainingMode(
            trainingState.trainingMode === "vital_point"
              ? "basics"
              : "vital_point",
          );
          audio.playSFX("menu_select");
          break;
      }
    },
    [trainingState, trainingActions, audio],
  );

  // Mobile stance change handler
  const handleMobileStanceChange = useCallback(
    (stanceIndex: number) => {
      handleStanceChangeWithVisualFeedback(stanceIndex);
    },
    [handleStanceChangeWithVisualFeedback],
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 9: Keyboard Input Handling
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      // ESC key - return to menu
      if (key === "escape") {
        onReturnToMenu();
        return;
      }

      // Handle stance changes (1-8) - always available for exploration
      if (key >= "1" && key <= "8") {
        const stanceIndex = parseInt(key) - 1;
        handleStanceChangeWithVisualFeedback(stanceIndex);
        event.preventDefault();
        return;
      }

      // Handle attacks (Space key) - always available for exploration
      if (key === " ") {
        handleAttack();
        event.preventDefault();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onReturnToMenu, handleStanceChangeWithVisualFeedback, handleAttack]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 10: Audio Lifecycle Management & Auto-Start Training
  // ═══════════════════════════════════════════════════════════════════════════

  // Track if component has mounted to enable auto-start once
  const hasMountedRef = useRef(false);

  useEffect(() => {
    let audioStarted = false;

    const startMusic = async () => {
      try {
        // Start training music with a smooth 2s fade-in for better UX
        await audio.fadeIn("cyberpunk_fusion", 2000);
        audioStarted = true;
      } catch (err) {
        console.warn("Failed to start training music:", err);
        trainingActions.setFeedback(
          "오디오 초기화 실패 | Audio initialization failed",
        );
      }
    };

    void startMusic();

    return () => {
      if (audioStarted) {
        void audio
          .fadeOut(2000)
          .then(() => audio.stopMusic())
          .catch((err) => console.warn("Failed to stop training music:", err));
      }
    };
  }, [audio, trainingActions]);

  // Auto-start training on mount (only once) - separate effect to avoid re-runs
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      handleStartTraining();
    }
  }, [handleStartTraining]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 11: Feedback & Session Timer Effects
  // ═══════════════════════════════════════════════════════════════════════════

  // Hide feedback after delay - 1500ms provides adequate time for bilingual text readability
  // IMPORTANT: We depend on BOTH showFeedback AND feedback message so the timer resets
  // when a new message arrives (even if showFeedback was already true)
  useEffect(() => {
    if (trainingState.showFeedback) {
      const timer = setTimeout(() => trainingActions.hideFeedback(), 1500);
      return () => clearTimeout(timer);
    }
  }, [trainingState.showFeedback, trainingState.feedback, trainingActions]);

  // Update session duration
  useEffect(() => {
    if (!trainingState.isTraining || !trainingState.sessionStartTime) return;

    const interval = setInterval(() => {
      trainingActions.updateSessionDuration(
        Math.floor((Date.now() - (trainingState.sessionStartTime ?? 0)) / 1000),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [
    trainingState.isTraining,
    trainingState.sessionStartTime,
    trainingActions,
  ]);

  // Auto-restart training when mode changes
  const prevTrainingModeRef = useRef<typeof trainingState.trainingMode>(
    trainingState.trainingMode,
  );
  const isFirstModeEffectRef = useRef<boolean>(true);
  const isTrainingRef = useRef<boolean>(trainingState.isTraining);
  const modeChangeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep a ref in sync with the latest training state for use inside timeouts
  useEffect(() => {
    isTrainingRef.current = trainingState.isTraining;
  }, [trainingState.isTraining]);

  // Store callbacks in refs to avoid effect re-runs when they change
  const handleStartTrainingRef = useRef(handleStartTraining);
  const handleStopTrainingRef = useRef(handleStopTraining);

  useEffect(() => {
    handleStartTrainingRef.current = handleStartTraining;
    handleStopTrainingRef.current = handleStopTraining;
  }, [handleStartTraining, handleStopTraining]);

  useEffect(() => {
    // Explicitly skip the first execution on initial mount
    if (isFirstModeEffectRef.current) {
      isFirstModeEffectRef.current = false;
      prevTrainingModeRef.current = trainingState.trainingMode;
      return;
    }

    const previousMode = prevTrainingModeRef.current;
    const modeChanged = previousMode !== trainingState.trainingMode;

    if (!modeChanged) {
      return;
    }

    // Update previous mode only when an actual change is detected
    prevTrainingModeRef.current = trainingState.trainingMode;

    // Clear any existing timer to prevent stale callbacks
    if (modeChangeTimerRef.current) {
      clearTimeout(modeChangeTimerRef.current);
      modeChangeTimerRef.current = null;
    }

    // Restart training on mode change (matches UI message "Auto-restarts on mode change")
    if (isTrainingRef.current) {
      handleStopTrainingRef.current();
    }

    // Small delay to allow state to settle, then (re)start training unconditionally
    modeChangeTimerRef.current = setTimeout(() => {
      handleStartTrainingRef.current();
      modeChangeTimerRef.current = null;
    }, 100);

    return () => {
      if (modeChangeTimerRef.current) {
        clearTimeout(modeChangeTimerRef.current);
        modeChangeTimerRef.current = null;
      }
    };
  }, [trainingState.trainingMode]); // Only depend on training mode to avoid unnecessary re-runs

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 12: Hit Effect Management
  // ═══════════════════════════════════════════════════════════════════════════

  const handleEffectComplete = useCallback(
    (effectId: number) => {
      trainingActions.removeHitEffect(effectId);
    },
    [trainingActions],
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 13: Anatomy Layer Toggle
  // ═══════════════════════════════════════════════════════════════════════════

  const handleAnatomyLayerToggle = useCallback(
    (layer: AnatomyLayer) => {
      trainingActions.toggleAnatomyLayer(layer);
      audio.playSFX("menu_click");
    },
    [trainingActions, audio],
  );

  const handleVitalPointClick = useCallback(
    (pointId: string) => {
      trainingActions.setSelectedVitalPoint(pointId);
      audio.playSFX("menu_select");
    },
    [trainingActions, audio],
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 14: Camera Configuration
  // ═══════════════════════════════════════════════════════════════════════════

  const cameraConfig = useMemo(
    () => ({
      position: [0, 8, 12] as [number, number, number],
      fov: 60,
    }),
    [],
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 15: RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  // Performance settings based on device tier
  const performanceSettings = useMemo(() => {
    return getPerformanceSettings(width, isMobile);
  }, [width, isMobile]);

  // SSAO removed - was causing WebGL context loss without NormalPass

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
      }}
      data-testid="training-screen-3d"
    >
      <Canvas
        style={{ width, height }}
        gl={{
          antialias: performanceSettings.antialias,
          alpha: false,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false, // Don't fail in software renderer
          preserveDrawingBuffer: true, // Help with context stability
        }}
        dpr={performanceSettings.dpr}
        shadows={false} // Temporarily disable shadows
        onCreated={({ gl }) => {
          gl.setClearColor(theme.colors.UI_BACKGROUND_DARK, 1);
          // Disable fog temporarily for debugging
        }}
        camera={cameraConfig}
      >
        {/* Lighting - base lighting, arena provides additional */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />

        {/* Combat Arena 3D Environment - uses physics-based world dimensions */}
        <CombatArena3D
          lighting="cyberpunk"
          scale={trainingAreaBounds.scale}
          worldWidthMeters={trainingAreaBounds.worldWidthMeters}
          worldDepthMeters={trainingAreaBounds.worldDepthMeters}
        />

        {/* Animation updater - 60fps updates */}
        <TrainingAnimationUpdater playerAnimation={playerAnimation} />

        {/* Training dummy at fixed position */}
        <TrainingDummy3D
          position={dummyPosition}
          selectedVitalPoint={trainingState.selectedVitalPoint}
          isTraining={trainingState.isTraining}
          health={trainingState.dummyHealth}
          onVitalPointHit={handleDummyHit}
          onDefeated={handleDummyDefeated}
          difficulty={difficulty}
          vitalPointCount={vitalPointCount}
          isMobile={isMobile}
        />

        {/* Anatomy overlay for educational visualization */}
        {trainingState.visibleAnatomyLayers.length > 0 && (
          <AnatomyOverlay3D
            position={dummyPosition}
            visibleLayers={trainingState.visibleAnatomyLayers}
            opacity={0.6}
            isMobile={isMobile}
          />
        )}

        {/* Vital Point Overlay - Show all 70 points on dummy */}
        {overlayVisible && (
          <VitalPointMarkers3D
            position={dummyPosition}
            visible={overlayVisible}
            severityFilter={severityFilters}
            regionFilter={regionFilter}
            searchQuery={searchQuery}
            showLabels={showLabels}
            scale={scale}
            animated={animated}
            selectedPoint={trainingState.selectedVitalPoint}
            onPointClick={handleVitalPointClick}
          />
        )}

        {/* Player model */}
        <Player3DWithTransitions
          {...convertPlayerStateToProps(
            trainingPlayerState,
            finalPlayer3DPosition,
            playerRotation,
            {
              isMobile,
              facing: "right",
              enableFacialExpressions: true,
              enableEyeTracking: true,
              opponentPosition: dummyPosition,
            },
          )}
          currentAnimation={animationStateToPlayerAnimation(
            playerAnimation.currentState,
          )}
          attackAnimation={attackAnimation}
          laterality="right"
          enableTransitionEffects={!isMobile}
          enableStanceSymbol={true}
          enableStanceAudio={true}
        />

        {/* Foot Placement Markers for Footwork Drills */}
        {trainingState.trainingMode === "footwork" &&
          trainingState.footworkDrillActive && (
            <FootPlacementMarkers3D
              centerPosition={dummyPosition}
              pattern={
                trainingState.footworkDrillType === "free_practice"
                  ? "none"
                  : trainingState.footworkDrillType
              }
              currentStep={trainingState.footworkDrillStep}
              visible={true}
              scale={1.0}
              animated={true}
            />
          )}

        {/* Hit effects */}
        {trainingState.hitEffects.map((effect) => (
          <HitFeedbackEffect3D
            key={effect.id}
            position={effect.position}
            type={effect.type}
            damage={effect.damage}
            visible={effect.visible}
            onComplete={() => handleEffectComplete(effect.id)}
            isMobile={isMobile}
          />
        ))}

        {/* Stance Change Visual Indicator */}
        <StanceChangeIndicator
          currentStance={trainingState.currentStanceIndex}
          previousStance={previousStanceIndex}
          isMobile={isMobile}
        />

        {/* NOTE: Mobile controls moved OUTSIDE Canvas for reliable touch events */}
        {/* See MobileControlsPure component rendered after HUDs */}

        {/* Post-processing Effects - lightweight only */}
        {isMobile ? (
          <EffectComposer multisampling={0}>
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
        ) : (
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

      {/* Html UI Overlays (positioned absolutely over Canvas) - matches CombatScreen pattern */}
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
        data-testid="training-hud-overlay"
      >
        {/* Left HUD - Anatomy Controls, Guard Indicator */}
        <TrainingLeftHUD
          width={width}
          height={height}
          isMobile={isMobile}
          positionScale={positionScale}
          visibleAnatomyLayers={trainingState.visibleAnatomyLayers}
          onAnatomyLayerToggle={handleAnatomyLayerToggle}
          currentStanceIndex={trainingState.currentStanceIndex}
          isInGuard={playerAnimation.isInStanceGuard()}
        />

        {/* Top HUD - Training Controls, Archetype Selector, Return Button */}
        <TrainingTopHUD
          width={width}
          height={height}
          isMobile={isMobile}
          positionScale={positionScale}
          isTraining={trainingState.isTraining}
          onStartTraining={handleStartTraining}
          onStopTraining={handleStopTraining}
          selectedArchetype={selectedArchetype}
          onArchetypeSelect={setSelectedArchetype}
          overlayVisible={overlayVisible}
          onReturnToMenu={onReturnToMenu}
          onPlaySFX={(sound) => audio.playSFX(sound)}
        />

        {/* Right HUD - Mode Selector, Stats, Vital Point Selection */}
        <TrainingRightHUD
          width={width}
          height={height}
          isMobile={isMobile}
          positionScale={positionScale}
          trainingMode={trainingState.trainingMode}
          onModeChange={trainingActions.setTrainingMode}
          stats={{
            ...trainingState.stats,
            sessionDuration: trainingState.sessionDuration,
            bestCombo: trainingState.bestCombo,
            perfectStrikes: trainingState.perfectStrikes,
          }}
          distanceToDummy={distanceToDummy}
          effectiveReach={currentTechniqueReach}
          selectedVitalPoint={trainingState.selectedVitalPoint}
          onVitalPointSelect={trainingActions.setSelectedVitalPoint}
          footworkDrillType={trainingState.footworkDrillType}
          footworkDrillStep={trainingState.footworkDrillStep}
          footworkDrillActive={trainingState.footworkDrillActive}
          onStartFootworkDrill={trainingActions.startFootworkDrill}
          onStopFootworkDrill={trainingActions.stopFootworkDrill}
          onAdvanceFootworkStep={trainingActions.advanceFootworkStep}
        />

        {/* Bottom HUD - Technique Bar, Feedback Messages, Mobile Controls */}
        <TrainingBottomHUD
          width={width}
          height={height}
          isMobile={isMobile}
          positionScale={positionScale}
          techniques={techniqueSelection.availableTechniques}
          player={trainingPlayerState}
          selectedIndex={techniqueSelection.selectedIndex}
          cooldowns={cooldownsMap}
          onTechniqueSelect={techniqueSelection.selectTechnique}
          showFeedback={trainingState.showFeedback}
          feedbackMessage={trainingState.feedback}
          selectedArchetype={selectedArchetype}
          onArchetypeSelect={setSelectedArchetype}
          onPlaySFX={(sound) => audio.playSFX(sound)}
        />

        {/* Vital Point Overlay Controls - Pure DOM overlay (outside Canvas) */}
        {overlayVisible && (
          <VitalPointOverlayControlsPure
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
            screenPosition={{ top: "180px", left: "20px" }}
            isMobile={isMobile}
          />
        )}

        {/* Mobile Controls - Pure DOM overlay (outside Canvas for reliable touch) */}
        {isMobile && (
          <>
            <MobileControlsOverlay
              onMove={handleMobileMove}
              onAttack={handleMobileAttack}
              onBlock={handleMobileBlock}
              disabled={!mobileControlsEnabled}
              bottom={getMobileControlsBottom()}
              opacity={0.85}
            />

            <StanceWheelPure
              currentStance={trainingState.currentStanceIndex}
              onStanceChange={handleMobileStanceChange}
              expanded={trainingState.stanceWheelExpanded}
              onToggle={trainingActions.toggleStanceWheel}
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
    </div>
  );
};

export default TrainingScreen3D;
