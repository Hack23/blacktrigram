/**
 * TrainingScreen3D - Three.js-based training screen
 *
 * Refactored to use consolidated hooks matching CombatScreen architecture.
 * Provides 3D training dummy with vital point targeting and Html UI overlays.
 *
 * @korean 훈련화면3D - 훈련 상태 훅을 사용한 리팩토링된 3D 훈련 화면
 */

import { Canvas, useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useAudio } from "../../audio/AudioProvider";
import { usePlayerAnimation } from "../../hooks/usePlayerAnimation";
import { useTechniqueSelection } from "../../hooks/useTechniqueSelection";
import { GestureEvent } from "../../hooks/useTouchControls";
import { useWebGLContextLossHandler } from "../../hooks/useWebGLContextLossHandler";
import { PlayerState } from "../../systems";
import { AnimationEvents } from "../../systems/animation";
import { TRIGRAM_STANCES_ORDER } from "../../systems/trigram/types";
import { CombatState, PlayerArchetype, Position, Technique } from "../../types";
import { FONT_FAMILY, KOREAN_COLORS } from "../../types/constants";
import { hexToRgbaString } from "../../utils/colorUtils";
import { usePlayerMovement } from "../../utils/inputSystem";
import {
  animationStateToPlayerAnimation,
  convertPlayerStateToProps,
} from "../../utils/player3DHelpers";
import { TechniqueBar } from "../combat/components/TechniqueBar";
import { VitalPointMarkers3D, VitalPointOverlayControls } from "../combat/components";
import {
  ActionButtons,
  GestureRecognizer,
  StanceWheel,
  VirtualDPad,
} from "../mobile";
import { ButtonEventType } from "../mobile/ActionButtons";
import { Direction, DPadEventType } from "../mobile/VirtualDPad";
import { SkeletalPlayer3D } from "../three/SkeletalPlayer3D";
import { VolumeControl } from "../ui/VolumeControl";
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
}) => {
  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1: Core State Management (Hooks)
  // ═══════════════════════════════════════════════════════════════════════════

  // Consolidated training state management (matches useCombatState pattern)
  const { state: trainingState, actions: trainingActions } = useTrainingState();

  // Audio context
  const audio = useAudio();

  // Responsive detection
  const isMobile = useMemo(() => width < 768, [width]);

  // Training difficulty and vital point configuration
  const difficulty: DifficultyMode = "normal";
  const vitalPointCount = 70; // ✅ Show all 70 vital points

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1.5: Vital Point Overlay Controls State
  // ═══════════════════════════════════════════════════════════════════════════

  // Vital point overlay state
  const [overlayVisible, setOverlayVisible] = React.useState(false);
  const [severityFilters, setSeverityFilters] = React.useState<import("../../types/common").VitalPointSeverity[]>([]);
  const [regionFilter, setRegionFilter] = React.useState<import("../../components/combat/components").BodyRegionFilter>("all");
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

  // Handle WebGL context loss and restoration
  useWebGLContextLossHandler({
    onContextLost: () => {
      console.warn("⚠️ WebGL context lost in TrainingScreen");
      contextLossCountRef.current += 1;
    },
    onContextRestored: () => {
      // Context restored - component will re-render automatically
    },
    autoRestore: true,
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 3: Movement & Position Management
  // ═══════════════════════════════════════════════════════════════════════════

  // Arena bounds for player movement
  const arenaBounds = useMemo(
    () => ({
      x: -8,
      y: -6,
      width: 16,
      height: 12,
    }),
    []
  );

  // Initial player position in 3D space
  const initialPosition = useMemo<Position>(
    () => ({
      x: -5,
      y: 0,
    }),
    []
  );

  // Player movement with input system
  const { playerPosition, isMoving } = usePlayerMovement({
    enabled: true, // Always allow movement in training screen
    bounds: arenaBounds,
    onPositionChange: (newPosition: Position) => {
      onPlayerUpdate({ position: newPosition });
    },
    initialPosition,
    moveSpeed: 300,
  });

  // Convert 2D position to 3D coordinates
  const player3DPosition = useMemo<[number, number, number]>(
    () => [playerPosition.x, 0, playerPosition.y],
    [playerPosition]
  );

  // Dummy position (fixed)
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
          audio.playSFX("menu_select");
        }
      },
    }),
    [audio]
  );

  const playerAnimation = usePlayerAnimation({
    events: playerAnimationEvents,
  });

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
      archetype: PlayerArchetype.MUSA,
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
  }, [playerPosition, trainingState]);

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

  const mobileControlsEnabled = isMobile && trainingState.isTraining;

  // Mobile D-pad movement handler
  const handleMobileMove = useCallback(
    (direction: Direction | null, eventType: DPadEventType) => {
      if (!direction || eventType !== "start") return;

      const directionMap: Record<Direction, string> = {
        up: "w",
        "up-right": "d",
        right: "d",
        "down-right": "d",
        down: "s",
        "down-left": "a",
        left: "a",
        "up-left": "w",
      };

      const key = directionMap[direction];
      if (key) {
        window.dispatchEvent(new KeyboardEvent("keydown", { key }));
      }
    },
    []
  );

  // Mobile attack handler
  const handleMobileAttack = useCallback(() => {
    if (trainingState.isTraining) {
      // Calculate attack accuracy
      const dx = playerPosition.x - dummyPosition[0];
      const dz = playerPosition.y - dummyPosition[2];
      const squaredDistance = dx * dx + dz * dz;
      const accuracy = Math.max(0, 1 - squaredDistance / 64);

      pendingAttackRef.current = {
        accuracy,
        vitalPoint: trainingState.selectedVitalPoint ?? "generic",
      };

      playerAnimation.transitionTo("attack");
    }
  }, [
    trainingState.isTraining,
    trainingState.selectedVitalPoint,
    playerPosition,
    dummyPosition,
    playerAnimation,
  ]);

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

      // Training mode controls only work when training is active
      if (!trainingState.isTraining) return;

      // Handle stance changes (1-8)
      if (key >= "1" && key <= "8") {
        const stanceIndex = parseInt(key) - 1;
        handleStanceChange(stanceIndex);
        event.preventDefault();
      }

      // Handle attacks (Space key)
      if (key === " ") {
        handleAttack();
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    trainingState.isTraining,
    onReturnToMenu,
    handleStanceChange,
    handleAttack,
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 10: Audio Lifecycle Management
  // ═══════════════════════════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 11: Feedback & Session Timer Effects
  // ═══════════════════════════════════════════════════════════════════════════

  // Hide feedback after delay
  useEffect(() => {
    if (trainingState.showFeedback) {
      const timer = setTimeout(() => trainingActions.hideFeedback(), 2000);
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
            onPointHover={() => {
              // Optional: Add hover feedback in the future
            }}
          />
        )}

        {/* Vital Point Overlay Controls - Positioned for visibility from camera at [0,8,12] */}
        <VitalPointOverlayControls
          position={[-8, 2, 3]}
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

        {/* Mobile Touch Controls - Only shown on mobile devices */}
        {isMobile && (
          <>
            <VirtualDPad
              onMove={handleMobileMove}
              disabled={!mobileControlsEnabled}
              size={120}
              bottom={20}
              left={20}
              opacity={0.8}
            />

            <ActionButtons
              onAttack={handleMobileAttack}
              onBlock={handleMobileBlock}
              disabled={!mobileControlsEnabled}
              bottom={20}
              right={20}
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

      {/* HTML UI Overlays (positioned absolutely over Canvas) */}
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
        {/* Top Left - Training Controls */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            pointerEvents: "auto",
          }}
        >
          <TrainingControlsHTML
            isTraining={trainingState.isTraining}
            onStartTraining={handleStartTraining}
            onStopTraining={handleStopTraining}
            isMobile={isMobile}
          />
        </div>

        {/* Top Right - Training Stats (below VolumeControl) */}
        <div
          style={{
            position: "absolute",
            top: isMobile ? 90 : 120,
            right: 20,
            pointerEvents: "auto",
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
        </div>

        {/* Bottom Left - Mode Selector and Anatomy Controls */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? 100 : 110,
            left: isMobile ? 10 : 20,
            pointerEvents: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <TrainingModeSelectorHTML
            currentMode={trainingState.trainingMode}
            onModeChange={trainingActions.setTrainingMode}
            isMobile={isMobile}
          />

          <AnatomyControlsHTML
            visibleLayers={trainingState.visibleAnatomyLayers}
            onLayerToggle={handleAnatomyLayerToggle}
            isMobile={isMobile}
          />

          {/* Vital Point Overlay Hint */}
          <div
            style={{
              background: `${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9)}`,
              border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.6)}`,
              borderRadius: "8px",
              padding: isMobile ? "8px 12px" : "10px 16px",
              fontSize: isMobile ? 10 : 12,
              fontFamily: FONT_FAMILY.KOREAN,
              color: hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY, 1),
              maxWidth: isMobile ? 180 : 220,
              boxShadow: `0 2px 12px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.3)}`,
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "4px", color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1) }}>
              💡 TIP
            </div>
            <div>
              Press <kbd style={{ 
                background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 1),
                padding: "2px 6px",
                borderRadius: "4px",
                border: `1px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.5)}`,
                fontFamily: "monospace",
              }}>V</kbd> to toggle vital point overlay
            </div>
            <div style={{ fontSize: isMobile ? 9 : 10, marginTop: "4px", opacity: 0.8 }}>
              급소 오버레이 토글
            </div>
          </div>
        </div>

        {/* Bottom Right - Vital Point Panel */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? 100 : 110,
            right: isMobile ? 10 : 20,
            pointerEvents: "auto",
          }}
        >
          <VitalPointTrainingHTML
            selectedVitalPoint={trainingState.selectedVitalPoint}
            onVitalPointSelect={trainingActions.setSelectedVitalPoint}
            isMobile={isMobile}
          />
        </div>

        {/* Center - Feedback Message */}
        {trainingState.showFeedback && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          >
            <TrainingFeedbackHTML
              message={trainingState.feedback}
              isMobile={isMobile}
            />
          </div>
        )}

        {/* Technique Bar - Bottom Center (above menu button) */}
        {trainingState.isTraining && (
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
        )}

        {/* Bottom Center - Return to Menu Button */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? 25 : 35,
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "auto",
            minHeight: "50px",
            zIndex: 100,
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
        </div>
      </div>

      {/* Volume Control - positioned outside Canvas to maintain AudioProvider context */}
      <VolumeControl position="top-right" compact={isMobile} />
    </div>
  );
};

export default TrainingScreen3D;
