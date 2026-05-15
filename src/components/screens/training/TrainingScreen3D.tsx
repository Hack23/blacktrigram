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

import { Canvas, useFrame } from "@react-three/fiber";
import { AccelerationUpdater } from "../../../systems/movement/helpers/AccelerationUpdater";
import {
  isRunningSpeed,
  STEP_DISTANCE_THRESHOLDS,
} from "../../../systems/movement/helpers/accelerationUtils";
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
  resolveTechniqueAnimation,
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
  TrigramStance,
} from "../../../types";
import { getPerformanceSettings } from "../../../types/constants";
import { getMobileControlsBottom } from "../../../types/constants/layout";
import { Z_INDEX } from "../../../types/LayoutTypes";
import { DEFAULT_BODY_RADIUS_METERS } from "../../../types/physicsConstants";
import { usePlayerMovement } from "../../../utils/inputSystem";
import { calculateDistance3D } from "../../../utils/math";
import { getHUDPositionScale } from "../../../utils/responsiveLayoutHelpers";
import { createCameraConfig } from "../../../utils/sharedPhysicsConfig";
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
import {
  TrainingBottomHUD,
  TrainingLeftHUD,
  TrainingRightHUD,
  TrainingTopHUD,
} from "./components/hud";
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


  const { state: trainingState, actions: trainingActions } = useTrainingState();

  const audio = useAudio();
  
  const { playBoneImpactSound, playAttackSound, playStanceChangeSound } =
    useCombatAudio();

  const { trainingAreaBounds, isMobile, isPortrait, screenSize } =
    useTrainingLayout(width, height);

  const theme = useKoreanTheme({
    variant: "primary",
    size: "md",
    isMobile,
  });

  const positionScale = React.useMemo(
    () => getHUDPositionScale(screenSize, isMobile),
    [screenSize, isMobile],
  );

  const difficulty: DifficultyMode = "normal";
  const vitalPointCount = 70; // Show all 70 vital points

  const [selectedArchetype, setSelectedArchetype] =
    React.useState<PlayerArchetype>(initialArchetype);

  const [overlayVisible, setOverlayVisible] = React.useState(false);
  const [severityFilters, setSeverityFilters] = React.useState<
    import("../../../types/common").VitalPointSeverity[]
  >([]);
  const [regionFilter, setRegionFilter] =
    React.useState<BodyRegionFilter>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showLabels, setShowLabels] = React.useState(true);
  const [animated, setAnimated] = React.useState(true);
  const [scale, setScale] = React.useState(1.2);


  const [attackAnimation, setAttackAnimation] = React.useState<
    string | undefined
  >(undefined);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "v" || e.key === "V") {
        setOverlayVisible((prev) => !prev);
        audio.playSFX("menu_select");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [audio]);


  const contextLossCountRef = useRef(0);

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


  const speedModifierSystem = useMemo(() => new SpeedModifierSystem(), []);

  const [speedModifiers, setSpeedModifiers] = useState({
    finalSpeed: 6.0, // BASE_WALK_SPEED (6.0 m/s for responsive combat)
    baseSpeed: 6.0,
    finalAcceleration: 12.0, // BASE_ACCELERATION (12.0 m/s² for quick response)
  });

  const [walkRunSpeeds, setWalkRunSpeeds] = useState({
    walkSpeed: 6.0,
    runSpeed: 10.0,
  });


  const initialPositionMeters = useMemo<Position>(
    () => ({
      x: trainingAreaBounds.worldWidthMeters * 0.0, // Centered laterally
      y: 0, // Centered vertically
    }),
    [trainingAreaBounds],
  );

  const handlePositionChange = useCallback(
    (newPosition: Position) => {
      onPlayerUpdate({ position: newPosition });
    },
    [onPlayerUpdate],
  );

  const movementBounds = useMemo(
    () => ({
      worldWidthMeters: trainingAreaBounds.worldWidthMeters,
      worldDepthMeters: trainingAreaBounds.worldDepthMeters,
    }),
    [trainingAreaBounds.worldWidthMeters, trainingAreaBounds.worldDepthMeters],
  );

  
  const movementTimeRef = useRef(0);
  const lastDirectionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const [accelerationBasedSpeed, setAccelerationBasedSpeed] = useState(
    walkRunSpeeds.walkSpeed
  );
  
  const isRunning = isRunningSpeed(accelerationBasedSpeed, walkRunSpeeds.runSpeed);

  const { playerPosition, isMoving, velocity } = usePlayerMovement({
    enabled: true, // Always allow movement in training screen
    bounds: movementBounds, // Use memoized bounds object
    onPositionChange: handlePositionChange, // Use memoized callback
    initialPositionMeters,
    currentStance: TRIGRAM_STANCES_ORDER[trainingState.currentStanceIndex],
    legInjuryFactor: 0, // No injury in training mode
    isRunning, // Use computed acceleration-based running state
    maxSpeedOverride: accelerationBasedSpeed,
    accelerationOverride: speedModifiers.finalAcceleration,
  });

  const player3DPosition = useMemo<[number, number, number]>(() => {
    return [playerPosition.x, 0, playerPosition.y];
  }, [playerPosition]);

  const dummyPosition = useMemo<[number, number, number]>(
    () => [trainingAreaBounds.worldWidthMeters * 0.15, 0, 0],
    [trainingAreaBounds.worldWidthMeters],
  );

  const centerToCenterDistance = useMemo(
    () => calculateDistance3D(player3DPosition, dummyPosition),
    [player3DPosition, dummyPosition],
  );

  const distanceToDummy = useMemo(
    () => Math.max(0, centerToCenterDistance - DEFAULT_BODY_RADIUS_METERS),
    [centerToCenterDistance],
  );

  const lastFacingRotationRef = useRef<number>(0);

  const playerRotation = useMemo(() => {
    if (isMoving && velocity && (velocity.x !== 0 || velocity.y !== 0)) {
      return Math.atan2(velocity.x, velocity.y);
    } else {
      const dx = dummyPosition[0] - player3DPosition[0];
      const dz = dummyPosition[2] - player3DPosition[2];
      return Math.atan2(dx, dz);
    }
  }, [isMoving, velocity, player3DPosition, dummyPosition]);

  useEffect(() => {
    lastFacingRotationRef.current = playerRotation;
  }, [playerRotation]);


  const [currentLaterality, setCurrentLaterality] = useState<"left" | "right">("right");
  
  const stepCounterRef = useRef(0);
  const lastPositionRef = useRef<Position>(playerPosition);
  
  useEffect(() => {
    if (!isMoving) {
      stepCounterRef.current = 0;
      lastPositionRef.current = playerPosition;
      return;
    }

    const dx = playerPosition.x - lastPositionRef.current.x;
    const dy = playerPosition.y - lastPositionRef.current.y;
    const distanceMoved = Math.sqrt(dx * dx + dy * dy);
    
    const stepThreshold = isRunning 
      ? STEP_DISTANCE_THRESHOLDS.RUN 
      : STEP_DISTANCE_THRESHOLDS.WALK;
    stepCounterRef.current += distanceMoved;
    
    const stepsCrossed = Math.floor(stepCounterRef.current / stepThreshold);
    if (stepsCrossed > 0) {
      if (stepsCrossed % 2 === 1) {
        setCurrentLaterality(prev => prev === "right" ? "left" : "right");
      }
      stepCounterRef.current -= stepsCrossed * stepThreshold;
    }
    
    lastPositionRef.current = playerPosition;
  }, [playerPosition, isMoving, isRunning]);


  const pendingAttackRef = useRef<{
    accuracy: number;
    vitalPoint: string;
    animationType?: AnimationType;
    startTime?: number;
    techniqueId?: string;
  } | null>(null);

  const handleDummyHitRef = useRef<
    (
      vitalPointId: string,
      attackContext?: {
        animationType?: AnimationType;
        techniqueId?: string;
      },
    ) => boolean
  >(() => false);

  const playerAnimationRef = useRef<ReturnType<
    typeof usePlayerAnimation
  > | null>(null);

  const playerAnimationEvents = useMemo<AnimationEvents>(
    () => ({
      onFrame: (frame, state) => {
        if (state === "attack" && frame === 6 && pendingAttackRef.current) {
          const attackData = pendingAttackRef.current;
          handleDummyHitRef.current(attackData.vitalPoint, {
            animationType: attackData.animationType,
            techniqueId: attackData.techniqueId,
          });
          pendingAttackRef.current = null;
        }
      },
      onAnimationComplete: (state) => {
        if (state === "stance_change") {
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

  useEffect(() => {
    playerAnimationRef.current = playerAnimation;
  }, [playerAnimation]);


  const currentStance = useMemo(
    () => TRIGRAM_STANCES_ORDER[trainingState.currentStanceIndex],
    [trainingState.currentStanceIndex],
  );

  const [previousStanceIndex, setPreviousStanceIndex] = useState<number>(0);

  const currentTechniqueAnimationTypeRef = useRef<AnimationType>(
    AnimationType.JAB,
  );


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

  useEffect(() => {
    const updateSpeedModifiers = () => {
      const walkModifiers = speedModifierSystem.calculateSpeedModifiers(
        trainingPlayerState,
        MovementType.WALKING,
        false, // isCrouching
      );

      const runModifiers = speedModifierSystem.calculateSpeedModifiers(
        trainingPlayerState,
        MovementType.RUNNING,
        false, // isCrouching
      );

      setSpeedModifiers({
        finalSpeed: walkModifiers.finalSpeed,
        baseSpeed: walkModifiers.baseSpeed,
        finalAcceleration: walkModifiers.finalAcceleration,
      });

      setWalkRunSpeeds({
        walkSpeed: walkModifiers.finalSpeed,
        runSpeed: runModifiers.finalSpeed,
      });
    };

    updateSpeedModifiers();

    const intervalId = setInterval(updateSpeedModifiers, 200);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingPlayerState]); // speedModifierSystem is memoized and never changes


  const isPlayerAttacking = useMemo(
    () => playerAnimation?.currentState === "attack",
    [playerAnimation],
  );

  const attackDirection = useMemo(() => {
    if (!isPlayerAttacking) {
      return new THREE.Vector3(0, 0, 1); // Default forward direction
    }
    const dx = dummyPosition[0] - player3DPosition[0];
    const dz = dummyPosition[2] - player3DPosition[2];
    return new THREE.Vector3(dx, 0, dz).normalize();
  }, [dummyPosition, player3DPosition, isPlayerAttacking]);

  const {
    currentPosition: player3DPositionWithAttackMovement,
  } = useAttackMovement({
    isAttacking: isPlayerAttacking,
    // eslint-disable-next-line react-hooks/refs -- ref value is set synchronously before isAttacking becomes true; hook only reads this at attack start
    animationType: currentTechniqueAnimationTypeRef.current,
    currentStance: trainingPlayerState.currentStance,
    basePosition: player3DPosition,
    attackDirection,
    animationDuration: 0.4,
  });

  const finalPlayer3DPosition = isPlayerAttacking
    ? player3DPositionWithAttackMovement
    : player3DPosition;


  const handleAttackRef = useRef<(() => void) | null>(null);

  const techniqueSelection = useTechniqueSelection({
    player: trainingPlayerState,
    enabled: trainingState.isTraining,
    onTechniqueExecute: useCallback(
      (technique: Technique) => {
        trainingActions.setFeedback(
          `${technique.name.korean} 사용! | Used ${technique.name.english}!`,
        );

        const animationName = resolveTechniqueAnimation(technique);
        setAttackAnimation(animationName);


        handleAttackRef.current?.();
      },
      [trainingActions],
    ),
  });

  const selectedTechniqueId = useMemo(() => {
    const techniques = techniqueSelection.availableTechniques;
    const selectedIdx = techniqueSelection.selectedIndex;
    if (techniques.length === 0 || selectedIdx < 0 || selectedIdx >= techniques.length) {
      return undefined;
    }
    return techniques[selectedIdx]?.id;
  }, [techniqueSelection.availableTechniques, techniqueSelection.selectedIndex]);

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
      transitionToAttack: playerAnimation.transitionToAttack,
      transitionToStanceGuard: playerAnimation.transitionToStanceGuard,
      currentState: playerAnimation.currentState,
    },
    pendingAttackRef, // Share the ref with animation events
  });

  useEffect(() => {
    handleAttackRef.current = handleAttack;
  }, [handleAttack]);

  useEffect(() => {
    handleDummyHitRef.current = handleDummyHit;
  }, [handleDummyHit]);

  const handleStanceChangeWithVisualFeedback = useCallback(
    (stanceIndex: number) => {
      setPreviousStanceIndex(trainingState.currentStanceIndex);
      handleStanceChange(stanceIndex);
    },
    [handleStanceChange, trainingState.currentStanceIndex],
  );


  const prevIsMovingRef = useRef<boolean>(isMoving);
  const prevIsRunningRef = useRef<boolean>(isRunning);
  const prevStanceRef = useRef<TrigramStance>(currentStance);
  
  useEffect(() => {
    const isMovingChanged = prevIsMovingRef.current !== isMoving;
    const isRunningChanged = prevIsRunningRef.current !== isRunning;
    const stanceChanged = prevStanceRef.current !== currentStance;
    
    if (isMovingChanged || isRunningChanged) {
      if (isMoving) {
        if (isRunning) {
          playerAnimation.transitionTo(AnimationState.RUN);
        } else {
          playerAnimation.transitionTo(AnimationState.WALK);
        }
      } else if (playerAnimation.currentState === AnimationState.WALK || 
                 playerAnimation.currentState === AnimationState.RUN) {
        playerAnimation.transitionToStanceGuard(currentStance);
      }
      prevIsMovingRef.current = isMoving;
      prevIsRunningRef.current = isRunning;
    }
    
    if (stanceChanged && !isMoving) {
      if (playerAnimation.currentState === AnimationState.IDLE || 
          playerAnimation.isInStanceGuard()) {
        playerAnimation.transitionToStanceGuard(currentStance);
      }
      prevStanceRef.current = currentStance;
    }
  }, [isMoving, isRunning, currentStance, playerAnimation]);


  const cooldownsMap = useMemo(() => {
    const map = new Map<string, number>();
    techniqueSelection.activeCooldowns.forEach((cd) => {
      map.set(cd.techniqueId, cd.remaining);
    });
    return map;
  }, [techniqueSelection.activeCooldowns]);

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
    const animConfig = getAnimationForTechniqueOrDefault(currentTechnique.id);
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

  useEffect(() => {
    currentTechniqueAnimationTypeRef.current = currentAnimationType;
  }, [currentAnimationType]);


  const activeMobileKeyRef = useRef<string | null>(null);

  const mobileControlsEnabled = isMobile;

  const handleMobileMove = useCallback(
    (direction: Direction | null, eventType: DPadEventType) => {
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
    handleAttack();
  }, [handleAttack]);

  const handleMobileBlock = useCallback(
    (eventType: ButtonEventType) => {
      if (eventType === "start") {
        audio.playSFX("block");
      }
    },
    [audio],
  );

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

  const handleMobileStanceChange = useCallback(
    (stanceIndex: number) => {
      handleStanceChangeWithVisualFeedback(stanceIndex);
    },
    [handleStanceChangeWithVisualFeedback],
  );


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (key === "escape") {
        onReturnToMenu();
        return;
      }

      if (key >= "1" && key <= "8") {
        const stanceIndex = parseInt(key) - 1;
        handleStanceChangeWithVisualFeedback(stanceIndex);
        event.preventDefault();
        return;
      }

      if (key === " ") {
        handleAttack();
        event.preventDefault();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onReturnToMenu, handleStanceChangeWithVisualFeedback, handleAttack]);


  const hasMountedRef = useRef(false);

  useEffect(() => {
    let audioStarted = false;

    const startMusic = async () => {
      try {
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

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      handleStartTraining();
    }
  }, [handleStartTraining]);


  useEffect(() => {
    if (trainingState.showFeedback) {
      const timer = setTimeout(() => trainingActions.hideFeedback(), 1500);
      return () => clearTimeout(timer);
    }
  }, [trainingState.showFeedback, trainingState.feedback, trainingActions]);

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

  const prevTrainingModeRef = useRef<typeof trainingState.trainingMode>(
    trainingState.trainingMode,
  );
  const isFirstModeEffectRef = useRef<boolean>(true);
  const isTrainingRef = useRef<boolean>(trainingState.isTraining);
  const modeChangeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isTrainingRef.current = trainingState.isTraining;
  }, [trainingState.isTraining]);

  const handleStartTrainingRef = useRef(handleStartTraining);
  const handleStopTrainingRef = useRef(handleStopTraining);

  useEffect(() => {
    handleStartTrainingRef.current = handleStartTraining;
    handleStopTrainingRef.current = handleStopTraining;
  }, [handleStartTraining, handleStopTraining]);

  useEffect(() => {
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

    prevTrainingModeRef.current = trainingState.trainingMode;

    if (modeChangeTimerRef.current) {
      clearTimeout(modeChangeTimerRef.current);
      modeChangeTimerRef.current = null;
    }

    if (isTrainingRef.current) {
      handleStopTrainingRef.current();
    }

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


  const handleEffectComplete = useCallback(
    (effectId: number) => {
      trainingActions.removeHitEffect(effectId);
    },
    [trainingActions],
  );


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


  const performanceSettings = useMemo(() => {
    return getPerformanceSettings(width, isMobile);
  }, [width, isMobile]);


  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
        overflow: "hidden", // Prevent content from extending beyond container
      }}
      data-testid="training-screen-3d"
    >
      <Canvas
        style={{ width: `${width}px`, height: `${height}px` }}
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

        {/* Acceleration updater - tracks movement time and updates speed */}
        <AccelerationUpdater
          isMoving={isMoving}
          velocity={velocity}
          movementTimeRef={movementTimeRef}
          lastDirectionRef={lastDirectionRef}
          onSpeedUpdate={setAccelerationBasedSpeed}
          walkSpeed={walkRunSpeeds.walkSpeed}
          runSpeed={walkRunSpeeds.runSpeed}
        />

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
          laterality={currentLaterality}
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

        {/* Post-processing Effects - desktop high tier only for Android WebGL stability */}
        {performanceSettings.postProcessing && (
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
          overflow: "clip",
        }}
        data-testid="training-hud-overlay"
      >
        {/* Left HUD - Anatomy Controls, Guard Indicator.
            Hidden on mobile because the side HUD occludes the compressed
            arena in both portrait and landscape. Anatomy layer toggles remain
            available on larger viewports where there is room for side panels. */}
        {!isMobile && (
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
        )}

        {/* Top HUD - Training Controls, Archetype Selector, Return Button. */}
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

        {/* Right HUD - Mode Selector, Stats, Vital Point Selection.
            Hidden on mobile to keep the training dojang visible and usable.
            The core start/stop, archetype, vital-point toggle, technique bar,
            stance wheel, gestures, and touch controls remain available. */}
        {!isMobile && (
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
        )}
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
              bottom={getMobileControlsBottom(height)}
              opacity={0.85}
              viewportWidth={width}
              viewportHeight={height}
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
