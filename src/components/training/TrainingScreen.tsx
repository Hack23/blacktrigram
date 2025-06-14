import React, { useState, useCallback, useMemo } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { DojangBackground } from "../game/DojangBackground";
import { TrigramWheel } from "../ui/TrigramWheel";
import { StanceIndicator } from "../ui/StanceIndicator";
import { ProgressTracker } from "../ui/ProgressTracker";
import { Player } from "../ui/Player";
import {
  ResponsivePixiContainer,
  ResponsivePixiButton,
  ResponsivePixiPanel,
} from "../ui/base/ResponsivePixiComponents";
import { KoreanHeader } from "../ui/base/KoreanHeader";
import { KOREAN_COLORS, COMBAT_CONSTANTS } from "../../types/constants";
import { TrigramStance } from "../../types/enums";
import type { PlayerState } from "../../types/player";
import { useAudio } from "../../audio/AudioProvider";

// Import extracted components
import {
  TrainingModeSelector,
  TrainingDummy,
  TrainingStatisticsPanel,
  TrainingControls,
  TrainingFeedbackSystem,
  useTrainingFeedback,
  useTrainingSession,
  TRAINING_MODES,
  type TrainingMode,
  type TrainingDummyState,
} from "./components";

// Import the new integration component
import { TrainingEnhancedIntegration } from "./components/TrainingEnhancedIntegration";

// Extend PIXI components
extend({ Container, Graphics, Text });

/**
 * ## Training Screen Component
 *
 * **Business Purpose:**
 * The primary training interface for Black Trigram's Korean martial arts simulator.
 * Provides an immersive dojang (training hall) environment where players can:
 * - Practice authentic Korean martial techniques
 * - Master the eight trigram stances (팔괘)
 * - Develop muscle memory through repetitive training
 * - Progress through structured skill development paths
 *
 * **Architecture:**
 * Implements a component-based architecture with:
 * - Centralized training state management via custom hooks
 * - Responsive UI that adapts to mobile, tablet, and desktop
 * - Real-time feedback systems for technique accuracy
 * - Integration with audio system for immersive experience
 *
 * **Korean Martial Arts Integration:**
 * - Respects traditional Korean training methodologies
 * - Implements authentic trigram philosophy from I Ching
 * - Provides bilingual Korean-English instruction
 * - Maintains cultural accuracy in technique names and descriptions
 *
 * @component
 * @example
 * ```tsx
 * <TrainingScreen
 *   player={playerState}
 *   onPlayerUpdate={handlePlayerUpdate}
 *   onReturnToMenu={handleMenuReturn}
 *   width={1200}
 *   height={800}
 * />
 * ```
 *
 * @see {@link useTrainingSession} For training session management
 * @see {@link TrainingModeSelector} For training mode selection
 * @see {@link TrainingDummy} For practice target interaction
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
export interface TrainingScreenProps {
  /** Current player state including stance, health, and experience */
  readonly player: PlayerState;

  /** Callback to update player state when training modifies attributes */
  readonly onPlayerUpdate: (updates: Partial<PlayerState>) => void;

  /** Callback to return to main menu when training session ends */
  readonly onReturnToMenu: () => void;

  /** Screen width for responsive layout calculations */
  readonly width: number;

  /** Screen height for responsive layout calculations */
  readonly height: number;

  /** Optional X position offset for component positioning */
  readonly x?: number;

  /** Optional Y position offset for component positioning */
  readonly y?: number;
}

/**
 * ## Main Training Screen Implementation
 *
 * **Business Logic:**
 * - Manages complete training workflow from setup to evaluation
 * - Tracks player progression through experience points and statistics
 * - Provides immediate feedback on technique execution quality
 * - Maintains training session persistence and resumption
 *
 * **Technical Architecture:**
 * - Uses React hooks for state management and side effects
 * - Implements responsive design patterns for cross-device compatibility
 * - Integrates with PixiJS for high-performance graphics rendering
 * - Manages audio feedback through centralized audio system
 *
 * **Performance Considerations:**
 * - Memoized layout calculations prevent unnecessary re-renders
 * - Lazy-loaded components reduce initial bundle size
 * - Optimized hit detection for smooth interaction feedback
 *
 * @param props - Training screen configuration and callbacks
 * @returns JSX.Element representing the complete training interface
 */
export const TrainingScreen: React.FC<TrainingScreenProps> = ({
  player,
  onPlayerUpdate,
  onReturnToMenu,
  width,
  height,
  x = 0,
  y = 0,
}) => {
  const audio = useAudio();

  // Enhanced training state
  const [selectedStance, setSelectedStance] = useState<TrigramStance>(
    player.currentStance || TrigramStance.GEON
  );
  const [trainingMode, setTrainingMode] = useState<TrainingMode>("basics");
  const [selectedModeIndex, setSelectedModeIndex] = useState(0);

  // Use extracted training session hook
  const {
    isTraining,
    isSessionPaused,
    stats,
    currentCombo,
    lastTechniqueTime,
    startTraining,
    stopTraining,
    pauseTraining,
    resumeTraining,
    executeTrainingTechnique,
    resetTrainingSession,
  } = useTrainingSession({
    mode: trainingMode,
    modeData: TRAINING_MODES[selectedModeIndex],
    player,
    onPlayerUpdate,
    audio,
  });

  // Training dummy state
  const [dummy, setDummy] = useState<TrainingDummyState>({
    health: 150,
    maxHealth: 150,
    position: { x: width * 0.7, y: height * 0.5 },
    isActive: true,
    lastHitTime: 0,
    hitCount: 0,
    isStunned: false,
    defensiveMode: false,
  });

  // Use extracted feedback system
  const { feedbackMessages, addFeedbackMessage } = useTrainingFeedback(audio);

  // Responsive design with improved breakpoints
  const { isMobile, isTablet, isDesktop } = useMemo(() => {
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1200;
    const isDesktop = width >= 1200;
    return { isMobile, isTablet, isDesktop };
  }, [width]);

  // Enhanced layout calculations for better UI/UX
  const layout = useMemo(() => {
    return {
      header: {
        y: isMobile ? 10 : 20,
        height: isMobile ? 60 : 80,
      },
      modeSelector: {
        x: isMobile ? 10 : 20,
        y: isMobile ? 80 : 110,
        width: isMobile ? width * 0.9 : isTablet ? 380 : 400,
        height: isMobile ? 120 : 140,
      },
      player: {
        x: width * (isMobile ? 0.2 : 0.25),
        y: height * (isMobile ? 0.45 : 0.5),
        width: isMobile ? 50 : isTablet ? 70 : 80,
        height: isMobile ? 80 : isTablet ? 120 : 140,
      },
      dummy: {
        x: width * (isMobile ? 0.7 : 0.72),
        y: height * (isMobile ? 0.45 : 0.5),
      },
      trigramWheel: {
        x: width - (isMobile ? 80 : isTablet ? 110 : 130),
        y: height - (isMobile ? 80 : isTablet ? 110 : 130),
        size: isMobile ? 60 : isTablet ? 80 : 90,
      },
      controls: {
        x: isMobile ? 10 : 20,
        y: height - (isMobile ? 200 : isTablet ? 240 : 280),
        width: isMobile ? width * 0.46 : isTablet ? 280 : 320,
        height: isMobile ? 160 : isTablet ? 200 : 240,
      },
      statistics: {
        x: width - (isMobile ? width * 0.46 + 10 : isTablet ? 300 : 340),
        y: height - (isMobile ? 200 : isTablet ? 240 : 280),
        width: isMobile ? width * 0.46 : isTablet ? 280 : 320,
        height: isMobile ? 160 : isTablet ? 200 : 240,
      },
    };
  }, [width, height, isMobile, isTablet]);

  /**
   * **Business Logic:** Handles selection of different training modes
   * Each mode represents a different learning path:
   * - Basics: Fundamental stances and movements
   * - Advanced: Complex technique combinations
   * - Free: Open practice with full technique access
   *
   * **Architecture:** Validates player level requirements and updates
   * training session configuration accordingly
   *
   * @param mode - Selected training mode identifier
   * @param modeIndex - Index of mode in TRAINING_MODES array
   */
  const handleModeSelect = useCallback(
    (mode: TrainingMode, modeIndex: number) => {
      const modeData = TRAINING_MODES[modeIndex];
      const playerLevel = Math.floor((player.experiencePoints || 0) / 100);

      if (playerLevel < modeData.requiredLevel) {
        addFeedbackMessage(
          `레벨 ${modeData.requiredLevel} 필요 (현재: ${playerLevel})`,
          "warning"
        );
        return;
      }

      setTrainingMode(mode);
      setSelectedModeIndex(modeIndex);
      addFeedbackMessage(`${modeData.name.korean} 모드 선택됨`, "info");
    },
    [player.experiencePoints, addFeedbackMessage]
  );

  /**
   * **Business Logic:** Manages trigram stance transitions following
   * traditional Korean martial arts principles
   *
   * **Korean Martial Arts:** Each stance represents one of the eight
   * trigrams from I Ching, with specific combat applications
   *
   * @param newStance - Target trigram stance to transition to
   */
  const handleStanceChange = useCallback(
    (newStance: TrigramStance) => {
      if (newStance === selectedStance) return;

      setSelectedStance(newStance);
      onPlayerUpdate({ currentStance: newStance });

      addFeedbackMessage(`${newStance} 자세로 변경`, "info");
      audio.playSFX("stance_change");
    },
    [selectedStance, onPlayerUpdate, addFeedbackMessage, audio]
  );

  // Enhanced training session control
  const handleToggleTraining = useCallback(() => {
    if (!isTraining) {
      startTraining();
      setDummy((prev) => ({
        ...prev,
        health: prev.maxHealth,
        hitCount: 0,
        isStunned: false,
        defensiveMode: false,
      }));
      addFeedbackMessage("훈련 시작!", "success");
    } else {
      const finalAccuracy =
        stats.attempts > 0 ? (stats.perfectStrikes / stats.attempts) * 100 : 0;
      stopTraining();
      addFeedbackMessage(
        `훈련 완료! 정확도: ${Math.round(finalAccuracy)}%`,
        finalAccuracy >= 70 ? "success" : "info"
      );
    }
  }, [isTraining, stats, startTraining, stopTraining, addFeedbackMessage]);

  // Pause/Resume training
  const handleTogglePause = useCallback(() => {
    if (!isTraining) return;

    if (isSessionPaused) {
      resumeTraining();
      addFeedbackMessage("훈련 재개", "info");
    } else {
      pauseTraining();
      addFeedbackMessage("훈련 일시정지", "info");
    }
  }, [
    isTraining,
    isSessionPaused,
    pauseTraining,
    resumeTraining,
    addFeedbackMessage,
  ]);

  // Enhanced technique execution using extracted hook
  const handleTechniqueExecute = useCallback(() => {
    if (!dummy.isActive || !isTraining || isSessionPaused) return;

    const currentMode = TRAINING_MODES[selectedModeIndex];
    if (stats.attempts >= currentMode.maxAttempts) {
      addFeedbackMessage("최대 시도 횟수 도달!", "warning");
      return;
    }

    const result = executeTrainingTechnique({
      stance: selectedStance,
      dummy,
      currentCombo,
      lastTechniqueTime,
    });

    // Update dummy based on technique result
    setDummy((prev) => ({
      ...prev,
      health: Math.max(0, prev.health - result.damage),
      lastHitTime: Date.now(),
      hitCount: prev.hitCount + (result.hit ? 1 : 0),
      isStunned: result.critical,
      defensiveMode: prev.hitCount > 5 && Math.random() > 0.6,
    }));

    // Provide feedback based on result
    if (result.miss) {
      addFeedbackMessage("빗나감!", "error");
    } else if (result.critical) {
      addFeedbackMessage(
        `치명타! ${Math.round(result.damage)} 데미지`,
        "success"
      );
    } else if (result.perfect) {
      addFeedbackMessage(
        `완벽한 타격! ${Math.round(result.damage)} 데미지`,
        "success"
      );
    } else {
      addFeedbackMessage(`타격! ${Math.round(result.damage)} 데미지`, "info");
    }

    if (currentCombo > 1) {
      addFeedbackMessage(`${currentCombo} 연속 공격!`, "success");
    }

    // Auto-reset dummy if defeated
    if (dummy.health - result.damage <= 0) {
      setTimeout(() => {
        setDummy((prev) => ({
          ...prev,
          health: prev.maxHealth,
          hitCount: 0,
          isStunned: false,
          defensiveMode: false,
        }));
        addFeedbackMessage("더미 리셋됨", "info");
      }, 2000);
    }
  }, [
    dummy,
    isTraining,
    isSessionPaused,
    stats.attempts,
    selectedModeIndex,
    currentCombo,
    lastTechniqueTime,
    selectedStance,
    executeTrainingTechnique,
    addFeedbackMessage,
  ]);

  // Reset dummy with enhanced feedback
  const handleResetDummy = useCallback(() => {
    setDummy((prev) => ({
      ...prev,
      health: prev.maxHealth,
      hitCount: 0,
      isStunned: false,
      defensiveMode: false,
    }));
    addFeedbackMessage("더미가 리셋되었습니다", "info");
    audio.playSFX("ki_charge");
  }, [addFeedbackMessage, audio]);

  // Enhanced evaluation with detailed feedback
  const handleEvaluate = useCallback(() => {
    if (stats.attempts === 0) {
      addFeedbackMessage("먼저 훈련을 해보세요!", "warning");
      return;
    }

    let evaluation = "";
    if (stats.accuracy >= 90) {
      evaluation = "완벽한 실력! 고수의 경지입니다.";
    } else if (stats.accuracy >= 80) {
      evaluation = "훌륭한 실력! 거의 완성 단계입니다.";
    } else if (stats.accuracy >= 70) {
      evaluation = "좋은 실력! 꾸준히 발전하고 있습니다.";
    } else if (stats.accuracy >= 60) {
      evaluation = "괜찮은 실력! 더 많은 연습이 필요합니다.";
    } else if (stats.accuracy >= 40) {
      evaluation = "기본은 갖춰졌습니다. 정확도를 높이세요.";
    } else {
      evaluation = "기본기부터 다시 시작하세요.";
    }

    addFeedbackMessage(evaluation, stats.accuracy >= 70 ? "success" : "info");
    audio.playSFX("menu_select");
  }, [stats, addFeedbackMessage, audio]);

  // Current training mode data
  const currentModeData = TRAINING_MODES[selectedModeIndex];
  const playerLevel = Math.floor((player.experiencePoints || 0) / 100);

  return (
    <ResponsivePixiContainer
      x={x}
      y={y}
      screenWidth={width}
      screenHeight={height}
      data-testid="training-screen"
    >
      {/* Enhanced Dojang Background */}
      <DojangBackground
        width={width}
        height={height}
        lighting="training"
        animate={true}
        data-testid="dojang-background"
      />

      {/* Enhanced Training Header */}
      <KoreanHeader
        title={{
          korean: "흑괘 무술 도장",
          english: "Black Trigram Martial Arts Dojang",
        }}
        subtitle={{
          korean: "전통 무예 훈련소",
          english: "Traditional Martial Arts Training",
        }}
        size={isMobile ? "small" : "medium"}
        alignment="center"
        x={width / 2}
        y={layout.header.y}
        data-testid="training-title"
      />

      {/* Training Mode Selection using extracted component */}
      <TrainingModeSelector
        currentMode={trainingMode}
        selectedModeIndex={selectedModeIndex}
        playerLevel={playerLevel}
        onModeSelect={handleModeSelect}
        x={layout.modeSelector.x}
        y={layout.modeSelector.y}
        width={layout.modeSelector.width}
        height={layout.modeSelector.height}
        screenWidth={width}
        screenHeight={height}
        isMobile={isMobile}
        data-testid="training-mode-selector"
      />

      {/* Enhanced Player Character */}
      <Player
        playerState={player}
        playerIndex={0}
        x={layout.player.x}
        y={layout.player.y}
        width={layout.player.width}
        height={layout.player.height}
        data-testid="training-player"
      />

      {/* Enhanced Training Dummy using extracted component */}
      <TrainingDummy
        dummyState={dummy}
        onTechniqueExecute={handleTechniqueExecute}
        onReset={handleResetDummy}
        screenWidth={width}
        screenHeight={height}
        isMobile={isMobile}
        data-testid="training-dummy"
      />

      {/* Enhanced Trigram Wheel */}
      <TrigramWheel
        selectedStance={selectedStance}
        onStanceChange={handleStanceChange}
        onStanceSelect={handleStanceChange}
        x={layout.trigramWheel.x}
        y={layout.trigramWheel.y}
        size={layout.trigramWheel.size}
        data-testid="training-trigram-wheel"
      />

      {/* Current Stance Indicator */}
      <StanceIndicator
        stance={selectedStance}
        x={layout.player.x - 25}
        y={layout.player.y + layout.player.height + 20}
        size={isMobile ? 35 : 45}
        data-testid="current-stance-indicator"
      />

      {/* Training Controls using extracted component */}
      <TrainingControls
        isTraining={isTraining}
        isSessionPaused={isSessionPaused}
        canExecute={stats.attempts < currentModeData.maxAttempts}
        onToggleTraining={handleToggleTraining}
        onTogglePause={handleTogglePause}
        onExecuteTechnique={handleTechniqueExecute}
        onResetDummy={handleResetDummy}
        onEvaluate={handleEvaluate}
        x={layout.controls.x}
        y={layout.controls.y}
        width={layout.controls.width}
        height={layout.controls.height}
        screenWidth={width}
        screenHeight={height}
        isMobile={isMobile}
        data-testid="training-controls"
      />

      {/* Training Statistics using extracted component */}
      <TrainingStatisticsPanel
        stats={stats}
        currentCombo={currentCombo}
        selectedStance={selectedStance}
        maxAttempts={currentModeData.maxAttempts}
        x={layout.statistics.x}
        y={layout.statistics.y}
        width={layout.statistics.width}
        height={layout.statistics.height}
        screenWidth={width}
        screenHeight={height}
        isMobile={isMobile}
        data-testid="training-statistics"
      />

      {/* Enhanced Progress Trackers */}
      <ProgressTracker
        title="경험치"
        korean="경험치"
        progress={((player.experiencePoints || 0) % 100) / 100}
        maxProgress={100}
        currentValue={(player.experiencePoints || 0) % 100}
        x={width / 2 - (isMobile ? 100 : 120)}
        y={height - (isMobile ? 60 : 80)}
        width={isMobile ? 200 : 240}
        height={isMobile ? 35 : 45}
        screenWidth={width}
        screenHeight={height}
        color={KOREAN_COLORS.ACCENT_CYAN}
        showText={true}
        data-testid="experience-tracker"
      />

      {/* Player Level Display */}
      <ResponsivePixiContainer
        x={width / 2}
        y={height - (isMobile ? 80 : 100)}
        screenWidth={width}
        screenHeight={height}
        data-testid="player-level-display"
      >
        <pixiText
          text={`레벨 ${playerLevel} 무사`}
          style={{
            fontSize: isMobile ? 10 : 14,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
            align: "center",
          }}
          anchor={0.5}
          data-testid="player-level-text"
        />
      </ResponsivePixiContainer>

      {/* Training Feedback System using extracted component */}
      <TrainingFeedbackSystem
        feedbackMessages={feedbackMessages}
        x={width / 2}
        y={isMobile ? 40 : 60}
        screenWidth={width}
        screenHeight={height}
        isMobile={isMobile}
        data-testid="training-feedback"
      />

      {/* Return to Menu */}
      <ResponsivePixiButton
        text="메뉴로 돌아가기"
        x={width / 2 - (isMobile ? 80 : 110)}
        y={height - (isMobile ? 25 : 35)}
        width={isMobile ? 160 : 220}
        height={isMobile ? 20 : 30}
        screenWidth={width}
        screenHeight={height}
        variant="secondary"
        onClick={onReturnToMenu}
        data-testid="return-to-menu-button"
      />

      {/* Training Status Overlay */}
      {isTraining && (
        <ResponsivePixiContainer
          x={width / 2}
          y={isMobile ? 20 : 30}
          screenWidth={width}
          screenHeight={height}
          data-testid="training-status"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              const statusColor = isSessionPaused
                ? KOREAN_COLORS.WARNING_YELLOW
                : KOREAN_COLORS.ACCENT_GREEN;

              g.fill({ color: statusColor, alpha: 0.9 });
              g.roundRect(-60, -15, 120, 30, 8);
              g.fill();

              g.stroke({
                width: 2,
                color: KOREAN_COLORS.PRIMARY_CYAN,
                alpha: 0.8,
              });
              g.roundRect(-60, -15, 120, 30, 8);
              g.stroke();
            }}
          />
          <pixiText
            text={isSessionPaused ? "훈련 일시정지" : "훈련 중"}
            style={{
              fontSize: isMobile ? 10 : 14,
              fill: KOREAN_COLORS.BLACK_SOLID,
              fontWeight: "bold",
              align: "center",
            }}
            anchor={0.5}
            data-testid="training-active-indicator"
          />
        </ResponsivePixiContainer>
      )}

      {/* Enhanced Integration Layer - NEW */}
      <TrainingEnhancedIntegration
        selectedStance={selectedStance}
        playerArchetype={player.archetype}
        trainingMode={trainingMode}
        isTraining={isTraining}
        currentCombo={currentCombo}
        stats={stats}
        screenWidth={width}
        screenHeight={height}
        onStateChange={(state) => {
          // Handle integration state changes
          console.log("Training integration state:", state);
        }}
      />
    </ResponsivePixiContainer>
  );
};

export default TrainingScreen;
