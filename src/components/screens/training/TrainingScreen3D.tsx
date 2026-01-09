/**
 * TrainingScreen3D - Three.js-based training screen
 *
 * Refactored to use consolidated hooks matching CombatScreen architecture.
 * Provides 3D training dummy with vital point targeting and Html UI overlays.
 *
 * @korean 훈련화면3D - 훈련 상태 훅을 사용한 리팩토링된 3D 훈련 화면
 */

import { Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useAudio } from "../../../audio/AudioProvider";
import { usePlayerAnimation } from "../../../hooks/usePlayerAnimation";
import { useTechniqueSelection } from "../../../hooks/useTechniqueSelection";
import { GestureEvent } from "../../../hooks/useTouchControls";
import { useWebGLContextLossHandler } from "../../../hooks/useWebGLContextLossHandler";
import { PlayerState } from "../../../systems";
import { AnimationEvents } from "../../../systems/animation";
import { TRIGRAM_STANCES_ORDER } from "../../../systems/trigram/types";
import {
  CombatState,
  PlayerArchetype,
  Position,
  Technique,
} from "../../../types";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { Z_INDEX } from "../../../types/LayoutTypes";
import { hexToRgbaString } from "../../../utils/colorUtils";
import { usePlayerMovement } from "../../../utils/inputSystem";
import {
  animationStateToPlayerAnimation,
  convertPlayerStateToProps,
} from "../../../utils/player3DHelpers";
import { ResponsiveContainer } from "../../shared/base/ResponsiveContainer";
import {
  ActionButtons,
  GestureRecognizer,
  StanceWheel,
  VirtualDPad,
} from "../../shared/mobile";
import { ButtonEventType } from "../../shared/mobile/ActionButtons";
import { Direction, DPadEventType } from "../../shared/mobile/VirtualDPad";
import { SkeletalPlayer3D } from "../../shared/three";
import { VolumeControl } from "../../shared/ui/VolumeControl";
import {
  VitalPointMarkers3D,
  VitalPointOverlayControls,
  type BodyRegionFilter,
} from "../combat/components";
import { GuardIndicator } from "../combat/components/indicators/GuardIndicator";
import { TechniqueBar } from "../combat/components/indicators/TechniqueBar";
import { useCombatLayout } from "../combat/hooks/useCombatLayout";
import AnatomyControlsHTML from "./components/AnatomyControlsHTML";
import AnatomyOverlay3D, {
  type AnatomyLayer,
} from "./components/AnatomyOverlay3D";
import HitFeedbackEffect3D from "./components/HitFeedbackEffect3D";
import TrainingArena3D from "./components/TrainingArena3D";
import TrainingControlsHTML from "./components/TrainingControlsHTML";
import type { DifficultyMode } from "./components/TrainingDummy3D";
import TrainingDummy3D from "./components/TrainingDummy3D";
import TrainingFeedbackHTML from "./components/TrainingFeedbackHTML";
import TrainingModeSelectorHTML from "./components/TrainingModeSelectorHTML";
import TrainingStatsHTML from "./components/TrainingStatsHTML";
import VitalPointTrainingHTML from "./components/VitalPointTrainingHTML";
import useTrainingActions from "./hooks/useTrainingActions";
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

  // Content is always mounted/visible (no loading gate)
  const isMounted = true;

  // Consolidated training state management (matches useCombatState pattern)
  const { state: trainingState, actions: trainingActions } = useTrainingState();

  // Audio context
  const audio = useAudio();

  // Responsive detection and layout (matching CombatScreen pattern)
  const { arenaBounds, isMobile } = useCombatLayout(width, height);

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
  // SECTION 3: Movement & Position Management
  // ═══════════════════════════════════════════════════════════════════════════

  // Initial player position in pixel space (left side of arena, centered vertically)
  // Matches CombatScreen pattern: positions are pixel-based, converted to 3D for rendering
  const initialPosition = useMemo<Position>(
    () => ({
      x: arenaBounds.x + arenaBounds.width * 0.25, // 25% from left
      y: arenaBounds.y + arenaBounds.height * 0.5, // Centered vertically
    }),
    [arenaBounds]
  );

  // Player movement with physics-based acceleration and stance modifiers
  const { playerPosition, isMoving } = usePlayerMovement({
    enabled: true, // Always allow movement in training screen
    bounds: arenaBounds,
    onPositionChange: (newPosition: Position) => {
      onPlayerUpdate({ position: newPosition });
    },
    initialPosition,
    moveSpeed: 300,
    // Physics parameters for realistic training movement (always enabled)
    currentStance: TRIGRAM_STANCES_ORDER[trainingState.currentStanceIndex],
    legInjuryFactor: 0, // No injury in training mode
    isRunning: false,
  });

  // Convert 2D pixel position to 3D world coordinates (matching CombatScreen pattern)
  const player3DPosition = useMemo<[number, number, number]>(() => {
    const relX = (playerPosition.x - arenaBounds.x) / arenaBounds.width;
    const relZ = (playerPosition.y - arenaBounds.y) / arenaBounds.height;
    const x = relX * 16 - 8; // Map 0-1 to -8 to 8
    const z = relZ * 8 - 4; // Map 0-1 to -4 to 4
    return [x, 0, z];
  }, [playerPosition, arenaBounds]);

  // Dummy position (fixed in 3D space, right side of arena)
  const dummyPosition = useMemo<[number, number, number]>(() => [5, 0, 0], []);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 4: Player Animation State Machine
  // ═══════════════════════════════════════════════════════════════════════════

  // Reference for pending attack (executed at animation frame 6)
  const pendingAttackRef = useRef<{
    accuracy: number;
    vitalPoint: string;
  } | null>(null);

  // Forward ref for handleDummyHit (defined in actions hook)
  const handleDummyHitRef = useRef<(vitalPointId: string) => boolean>(
    () => false
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
          audio.playSFX("menu_select");
          const currentStance =
            TRIGRAM_STANCES_ORDER[trainingState.currentStanceIndex];
          if (currentStance && playerAnimationRef.current) {
            playerAnimationRef.current.transitionToStanceGuard(currentStance);
          }
        }
      },
    }),
    [audio, trainingState.currentStanceIndex]
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
    audio,
    onPlayerUpdate: (updates) => {
      onPlayerUpdate(updates);
    },
    playerAnimation: {
      transitionTo: playerAnimation.transitionTo,
      currentState: playerAnimation.currentState,
    },
    pendingAttackRef, // Share the ref with animation events
  });

  // Update the ref so animation events can call handleDummyHit
  useEffect(() => {
    handleDummyHitRef.current = handleDummyHit;
  }, [handleDummyHit]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 6: Movement-Animation Synchronization
  // ═══════════════════════════════════════════════════════════════════════════

  // Sync movement with animation (matches CombatScreen pattern)
  const prevIsMovingRef = useRef<boolean>(isMoving);
  useEffect(() => {
    if (prevIsMovingRef.current !== isMoving) {
      if (isMoving) {
        playerAnimation.transitionTo("walk");
      } else if (playerAnimation.currentState === "walk") {
        playerAnimation.transitionTo("idle");
      }
      prevIsMovingRef.current = isMoving;
    }
  }, [isMoving, playerAnimation]);

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

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 7B: Technique Selection System
  // ═══════════════════════════════════════════════════════════════════════════

  // Technique selection and execution for training
  const techniqueSelection = useTechniqueSelection({
    player: trainingPlayerState,
    enabled: trainingState.isTraining,
    onTechniqueExecute: useCallback(
      (technique: Technique) => {
        // Show technique usage feedback
        trainingActions.setFeedback(
          `${technique.name.korean} 사용! | Used ${technique.name.english}!`
        );

        // In training mode, do not deduct resources to allow continuous practice
        // Resources are displayed for educational purposes only

        // Execute attack with technique (visual feedback)
        handleAttack();
      },
      [handleAttack, trainingActions]
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
            })
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
    [audio]
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
              : "vital_point"
          );
          audio.playSFX("menu_select");
          break;
      }
    },
    [trainingState, trainingActions, audio]
  );

  // Mobile stance change handler
  const handleMobileStanceChange = useCallback(
    (stanceIndex: number) => {
      handleStanceChange(stanceIndex);
    },
    [handleStanceChange]
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
        handleStanceChange(stanceIndex);
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
  }, [onReturnToMenu, handleStanceChange, handleAttack]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 10: Audio Lifecycle Management & Auto-Start Training
  // ═══════════════════════════════════════════════════════════════════════════

  // Track if component has mounted to enable auto-start once
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
          "오디오 초기화 실패 | Audio initialization failed"
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
  useEffect(() => {
    if (trainingState.showFeedback) {
      const timer = setTimeout(() => trainingActions.hideFeedback(), 1500);
      return () => clearTimeout(timer);
    }
  }, [trainingState.showFeedback, trainingActions]);

  // Update session duration
  useEffect(() => {
    if (!trainingState.isTraining || !trainingState.sessionStartTime) return;

    const interval = setInterval(() => {
      trainingActions.updateSessionDuration(
        Math.floor((Date.now() - (trainingState.sessionStartTime ?? 0)) / 1000)
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
    trainingState.trainingMode
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
    [trainingActions]
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 13: Anatomy Layer Toggle
  // ═══════════════════════════════════════════════════════════════════════════

  const handleAnatomyLayerToggle = useCallback(
    (layer: AnatomyLayer) => {
      trainingActions.toggleAnatomyLayer(layer);
      audio.playSFX("menu_click");
    },
    [trainingActions, audio]
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 14: Camera Configuration
  // ═══════════════════════════════════════════════════════════════════════════

  const cameraConfig = useMemo(
    () => ({
      position: [0, 8, 12] as [number, number, number],
      fov: 60,
    }),
    []
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 15: RENDER
  // ═══════════════════════════════════════════════════════════════════════════

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
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        shadows
        onCreated={({ gl }) => {
          gl.setClearColor(KOREAN_COLORS.UI_BACKGROUND_DARK, 1);
        }}
        camera={cameraConfig}
      >
        {/* Korean-themed lighting (오방색 - Five Cardinal Colors) */}
        <ambientLight intensity={0.4} color={KOREAN_COLORS.PRIMARY_CYAN} />

        {/* Main directional light - Center (황색/Yellow) */}
        <directionalLight
          position={[0, 10, 5]}
          intensity={1}
          color={KOREAN_COLORS.SECONDARY_YELLOW}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {/* East (청색/Blue-Green) */}
        <pointLight
          position={[10, 5, 0]}
          intensity={0.6}
          color={KOREAN_COLORS.ACCENT_GREEN}
          distance={20}
        />

        {/* West (백색/White) */}
        <pointLight
          position={[-10, 5, 0]}
          intensity={0.6}
          color={KOREAN_COLORS.WHITE_SOLID}
          distance={20}
        />

        {/* South (적색/Red) */}
        <pointLight
          position={[0, 5, 10]}
          intensity={0.5}
          color={KOREAN_COLORS.ACCENT_RED}
          distance={20}
        />

        {/* North (흑색/Black) - dim for depth */}
        <pointLight
          position={[0, 5, -10]}
          intensity={0.3}
          color={KOREAN_COLORS.UI_BACKGROUND_MEDIUM}
          distance={20}
        />

        {/* Animation updater - updates player animation at 60fps */}
        <TrainingAnimationUpdater playerAnimation={playerAnimation} />

        {/* Training arena ground */}
        <TrainingArena3D />

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
            onPointClick={(pointId) => {
              trainingActions.setSelectedVitalPoint(pointId);
              audio.playSFX("menu_select");
            }}
          />
        )}

        {/* VitalPointOverlayControls - fixed screen position */}
        {overlayVisible && (
          <VitalPointOverlayControls
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

        {/* Player model */}
        <SkeletalPlayer3D
          {...convertPlayerStateToProps(
            trainingPlayerState,
            player3DPosition,
            0, // rotation - facing right towards dummy
            {
              isMobile,
              facing: "right",
              // Enable facial expressions and eye tracking - 얼굴 표정 및 눈 추적 활성화
              enableFacialExpressions: true,
              enableEyeTracking: true,
              opponentPosition: dummyPosition,
            }
          )}
          currentAnimation={animationStateToPlayerAnimation(
            playerAnimation.currentState
          )}
        />

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

        {/* Html UI Overlays - only render when content is ready */}
        <Html fullscreen>
          <div
            style={{
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              position: "relative",
              opacity: isMounted ? 1 : 0,
              transition: "opacity 0.2s ease-out",
            }}
          >
            {/* Top Left - Training Controls */}
            <ResponsiveContainer
              position={{ base: { x: 20, y: 20 } }}
              containerWidth={width}
              useSafeArea
              safeAreaEdge="top"
              zIndex={Z_INDEX.HUD}
              style={{ pointerEvents: "all" }}
            >
              <TrainingControlsHTML
                isTraining={trainingState.isTraining}
                onStartTraining={handleStartTraining}
                onStopTraining={handleStopTraining}
                isMobile={isMobile}
              />
            </ResponsiveContainer>

            {/* Top Right - Training Stats (below VolumeControl) */}
            <ResponsiveContainer
              position={{
                base: {
                  x: width - (isMobile ? 310 : 320),
                  y: isMobile ? 90 : 120,
                },
              }}
              containerWidth={width}
              useSafeArea
              safeAreaEdge="top"
              zIndex={Z_INDEX.HUD}
              style={{
                pointerEvents: "all",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                alignItems: "flex-end",
              }}
            >
              <TrainingStatsHTML
                stats={{
                  ...trainingState.stats,
                  sessionDuration: trainingState.sessionDuration,
                  bestCombo: trainingState.bestCombo,
                  perfectStrikes: trainingState.perfectStrikes,
                }}
                isMobile={isMobile}
              />
            </ResponsiveContainer>

            {/* Top Center - Training Mode Selector (below hint/above center) */}
            <ResponsiveContainer
              position={{
                base: {
                  x: width / 2 - (isMobile ? 140 : 160),
                  y: isMobile ? 70 : 90,
                },
              }}
              containerWidth={width}
              useSafeArea
              safeAreaEdge="top"
              zIndex={Z_INDEX.HUD}
              style={{
                pointerEvents: "all",
              }}
            >
              <TrainingModeSelectorHTML
                currentMode={trainingState.trainingMode}
                onModeChange={trainingActions.setTrainingMode}
                isMobile={isMobile}
              />
            </ResponsiveContainer>

            {/* Archetype Selector - Top Left below Training Controls */}
            <ResponsiveContainer
              position={{
                base: {
                  x: 20,
                  y: isMobile ? 80 : 100,
                },
              }}
              containerWidth={width}
              useSafeArea
              safeAreaEdge="top"
              zIndex={Z_INDEX.MODAL}
              style={{
                pointerEvents: "all",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  padding: isMobile ? "8px 12px" : "10px 16px",
                  background: hexToRgbaString(
                    KOREAN_COLORS.UI_BACKGROUND_DARK,
                    0.9
                  ),
                  border: `2px solid ${hexToRgbaString(
                    KOREAN_COLORS.ACCENT_GOLD,
                    0.6
                  )}`,
                  borderRadius: "8px",
                  fontFamily: FONT_FAMILY.KOREAN,
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? "10px" : "12px",
                    color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  원형 선택 | Archetype
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px",
                    justifyContent: "center",
                  }}
                >
                  {Object.values(PlayerArchetype).map((arch) => (
                    <button
                      key={arch}
                      onClick={() => {
                        setSelectedArchetype(arch);
                        audio.playSFX("menu_select");
                      }}
                      style={{
                        padding: isMobile ? "4px 8px" : "6px 10px",
                        fontSize: isMobile ? "9px" : "11px",
                        fontFamily: FONT_FAMILY.KOREAN,
                        fontWeight:
                          selectedArchetype === arch ? "bold" : "normal",
                        background:
                          selectedArchetype === arch
                            ? hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.8)
                            : hexToRgbaString(
                                KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                                0.8
                              ),
                        color:
                          selectedArchetype === arch
                            ? hexToRgbaString(
                                KOREAN_COLORS.UI_BACKGROUND_DARK,
                                1
                              )
                            : hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY, 1),
                        border: `1px solid ${hexToRgbaString(
                          selectedArchetype === arch
                            ? KOREAN_COLORS.ACCENT_GOLD
                            : KOREAN_COLORS.UI_BORDER,
                          0.6
                        )}`,
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {arch.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </ResponsiveContainer>

            {/* Bottom Left - Anatomy Controls (mode selector is top-center) */}
            <ResponsiveContainer
              position={{
                base: {
                  x: isMobile ? 10 : 20,
                  y: height - (isMobile ? 180 : 200),
                },
              }}
              containerWidth={width}
              useSafeArea
              safeAreaEdge="bottom"
              zIndex={Z_INDEX.HUD}
              style={{
                pointerEvents: "all",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <AnatomyControlsHTML
                visibleLayers={trainingState.visibleAnatomyLayers}
                onLayerToggle={handleAnatomyLayerToggle}
                isMobile={isMobile}
              />
            </ResponsiveContainer>

            {/* Bottom Left - Guard Indicator (below anatomy controls) */}
            <div
              style={{
                position: "absolute",
                bottom: isMobile ? "65px" : "75px",
                left: isMobile ? "10px" : "20px",
                pointerEvents: "none",
              }}
            >
              <GuardIndicator
                currentStance={
                  TRIGRAM_STANCES_ORDER[trainingState.currentStanceIndex]
                }
                isInGuard={playerAnimation.isInStanceGuard()}
                position="left"
                isMobile={isMobile}
              />
            </div>

            {/* Bottom Right - Vital Point Panel */}
            <ResponsiveContainer
              position={{
                base: {
                  x: width - (isMobile ? 310 : 420),
                  y: height - (isMobile ? 100 : 110),
                },
              }}
              containerWidth={width}
              useSafeArea
              safeAreaEdge="bottom"
              zIndex={Z_INDEX.HUD}
              style={{ pointerEvents: "all" }}
            >
              <VitalPointTrainingHTML
                selectedVitalPoint={trainingState.selectedVitalPoint}
                onVitalPointSelect={trainingActions.setSelectedVitalPoint}
                isMobile={isMobile}
              />
            </ResponsiveContainer>

            {/* Vital Point Overlay Hint - Top Center */}
            {!overlayVisible && (
              <ResponsiveContainer
                position={{ base: { x: 0, y: isMobile ? 20 : 30 } }}
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
                    padding: isMobile ? "8px 12px" : "10px 16px",
                    background: hexToRgbaString(
                      KOREAN_COLORS.UI_BACKGROUND_DARK,
                      0.9
                    ),
                    border: `2px solid ${hexToRgbaString(
                      KOREAN_COLORS.PRIMARY_CYAN,
                      0.6
                    )}`,
                    borderRadius: "8px",
                    fontSize: isMobile ? "12px" : "14px",
                    fontFamily: FONT_FAMILY.KOREAN,
                    color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  <div>
                    💡 급소 오버레이 | Vital Point Overlay: Press{" "}
                    <span
                      style={{
                        color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
                      }}
                    >
                      V
                    </span>
                  </div>
                </div>
              </ResponsiveContainer>
            )}

            {/* Center - Feedback Message */}
            {trainingState.showFeedback && (
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
                <TrainingFeedbackHTML
                  message={trainingState.feedback}
                  isMobile={isMobile}
                />
              </ResponsiveContainer>
            )}

            {/* Technique Bar - Bottom Center (above menu button) - Always visible for training */}
            <TechniqueBar
              techniques={techniqueSelection.availableTechniques}
              player={trainingPlayerState}
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

            {/* Bottom Center - Return to Menu Button */}
            <ResponsiveContainer
              position={{ base: { x: 0, y: height - (isMobile ? 75 : 85) } }}
              containerWidth={width}
              useSafeArea
              safeAreaEdge="bottom"
              zIndex={Z_INDEX.HUD}
              style={{
                pointerEvents: "all",
                minHeight: "50px",
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <style>
                {`
                  .training-return-menu-btn {
                    background: ${hexToRgbaString(
                      KOREAN_COLORS.ACCENT_GOLD,
                      1
                    )};
                    border: none;
                    border-radius: 8px;
                    padding: ${isMobile ? "10px 16px" : "12px 24px"};
                    font-size: ${isMobile ? "14px" : "16px"};
                    font-weight: bold;
                    font-family: ${FONT_FAMILY.KOREAN};
                    color: ${hexToRgbaString(KOREAN_COLORS.KOREAN_BLACK, 1)};
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 0 10px ${hexToRgbaString(
                      KOREAN_COLORS.ACCENT_GOLD,
                      0.5
                    )};
                    min-height: 40px;
                  }
                  .training-return-menu-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 20px ${hexToRgbaString(
                      KOREAN_COLORS.ACCENT_GOLD,
                      0.8
                    )};
                  }
                `}
              </style>
              <button
                onClick={onReturnToMenu}
                onMouseEnter={() => audio.playSFX("menu_hover")}
                className="training-return-menu-btn"
                data-testid="return-to-menu-button"
                aria-label="Return to main menu"
              >
                메뉴로 | Return to Menu
              </button>
            </ResponsiveContainer>
          </div>
        </Html>

        {/* Mobile Touch Controls - Only shown on mobile devices */}
        {isMobile && (
          <>
            <VirtualDPad
              onMove={handleMobileMove}
              disabled={!mobileControlsEnabled}
              opacity={0.8}
            />

            <ActionButtons
              onAttack={handleMobileAttack}
              onBlock={handleMobileBlock}
              disabled={!mobileControlsEnabled}
              opacity={0.8}
            />

            <StanceWheel
              currentStance={trainingState.currentStanceIndex}
              onStanceChange={handleMobileStanceChange}
              expanded={trainingState.stanceWheelExpanded}
              onToggle={trainingActions.toggleStanceWheel}
              disabled={!mobileControlsEnabled}
              opacity={0.8}
            />

            <GestureRecognizer
              onGesture={handleMobileGesture}
              enabled={mobileControlsEnabled}
              showFeedback={true}
              minSwipeDistance={50}
            />
          </>
        )}
      </Canvas>

      {/* Volume Control - positioned outside Canvas to maintain AudioProvider context */}
      <VolumeControl position="top-right" compact={isMobile} />
    </div>
  );
};

export default TrainingScreen3D;
