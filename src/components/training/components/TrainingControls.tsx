import React, { useCallback, useMemo } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import {
  ResponsivePixiPanel,
  ResponsivePixiButton,
} from "../../ui/base/ResponsivePixiComponents";
import { KOREAN_COLORS } from "../../../types/constants";

extend({ Container, Graphics, Text });

/**
 * ## Training Controls Component
 *
 * **Business Purpose:**
 * Primary control interface for Korean martial arts training sessions.
 * Provides intuitive controls for:
 * - Training session management (start, pause, resume, stop)
 * - Technique execution with authentic Korean martial arts feedback
 * - Training dummy interaction and reset capabilities
 * - Performance evaluation and progress assessment
 *
 * **Korean Martial Arts Integration:**
 * - Traditional Korean training command terminology ("시작", "정지", "평가")
 * - Authentic martial arts training workflow and interaction patterns
 * - Cultural accuracy in training session management and progression
 * - Visual design inspired by traditional Korean martial arts training equipment
 *
 * **Architecture:**
 * - Responsive design adapting to mobile, tablet, and desktop interfaces
 * - State-driven UI reflecting current training session status
 * - Integration with audio feedback for immersive training experience
 * - Accessibility features ensuring usability across different interaction methods
 *
 * @component
 * @example
 * ```tsx
 * <TrainingControls
 *   isTraining={true}
 *   isSessionPaused={false}
 *   canExecute={true}
 *   onToggleTraining={handleTrainingToggle}
 *   onExecuteTechnique={handleTechniqueExecution}
 *   onResetDummy={handleDummyReset}
 *   onEvaluate={handlePerformanceEvaluation}
 *   x={20}
 *   y={500}
 *   width={300}
 *   height={200}
 *   screenWidth={1200}
 *   screenHeight={800}
 *   isMobile={false}
 * />
 * ```
 *
 * @see {@link useTrainingSession} For training session state integration
 * @see {@link TrainingDummy} For dummy interaction coordination
 * @see {@link TrainingStatistics} For evaluation metrics
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
export interface TrainingControlsProps {
  /** Whether training session is currently active */
  readonly isTraining: boolean;

  /** Whether training session is paused (only relevant when isTraining is true) */
  readonly isSessionPaused: boolean;

  /** Whether technique execution is currently allowed (based on session limits) */
  readonly canExecute: boolean;

  /** Callback to start or stop training session */
  readonly onToggleTraining: () => void;

  /** Callback to pause or resume active training session */
  readonly onTogglePause: () => void;

  /** Callback to execute a martial arts technique during training */
  readonly onExecuteTechnique: () => void;

  /** Callback to reset training dummy to initial state */
  readonly onResetDummy: () => void;

  /** Callback to evaluate current training performance */
  readonly onEvaluate: () => void;

  /** X position offset for component placement */
  readonly x: number;

  /** Y position offset for component placement */
  readonly y: number;

  /** Component width for responsive layout */
  readonly width: number;

  /** Component height for responsive layout */
  readonly height: number;

  /** Screen width for responsive breakpoint calculations */
  readonly screenWidth: number;

  /** Screen height for responsive layout optimization */
  readonly screenHeight: number;

  /** Whether interface is optimized for mobile devices */
  readonly isMobile: boolean;
}

/**
 * ## Training Controls Implementation
 *
 * **Business Logic:**
 * - Manages complete training session workflow with intuitive controls
 * - Provides immediate feedback for all training actions and state changes
 * - Validates user actions based on current training context and limitations
 * - Integrates with broader training system for coordinated state management
 *
 * **Technical Architecture:**
 * - Responsive button layout adapting to different screen sizes and orientations
 * - State-driven visual feedback reflecting current training session status
 * - Integration with audio system for immersive training experience
 * - Accessibility-focused design with proper focus management and keyboard support
 *
 * **Korean Martial Arts Features:**
 * - Authentic Korean training terminology for all control labels and feedback
 * - Traditional training workflow reflected in control organization and flow
 * - Cultural accuracy in training session management and evaluation processes
 * - Visual design consistent with traditional Korean martial arts aesthetics
 *
 * @param props - Training controls configuration and interaction handlers
 * @returns JSX.Element representing the complete training control interface
 */
export const TrainingControls: React.FC<TrainingControlsProps> = ({
  isTraining,
  isSessionPaused,
  canExecute,
  onToggleTraining,
  onTogglePause,
  onExecuteTechnique,
  onResetDummy,
  onEvaluate,
  x,
  y,
  width,
  height,
  screenWidth,
  screenHeight,
  isMobile,
}) => {
  const buttonLayout = useMemo(() => {
    const buttonWidth = isMobile ? width * 0.9 : (width - 30) / 2;
    const buttonHeight = isMobile ? 32 : 38;
    const spacing = 8;

    return {
      primary: {
        x: 10,
        y: 15,
        width: buttonWidth,
        height: buttonHeight + 5,
      },
      secondary: {
        x: isMobile ? 10 : buttonWidth + 20,
        y: isMobile ? 58 : 15,
        width: buttonWidth,
        height: buttonHeight,
      },
      execute: {
        x: 10,
        y: isMobile ? 98 : 65,
        width: buttonWidth,
        height: buttonHeight,
      },
      utility: {
        x: isMobile ? 10 : buttonWidth + 20,
        y: isMobile ? 138 : 65,
        width: buttonWidth,
        height: buttonHeight,
      },
    };
  }, [width, height, isMobile]);

  const getTrainingButtonText = useCallback(() => {
    if (!isTraining) return "훈련 시작";
    if (isSessionPaused) return "훈련 재개";
    return "훈련 정지";
  }, [isTraining, isSessionPaused]);

  const getTrainingButtonVariant = useCallback(() => {
    if (!isTraining) return "primary";
    if (isSessionPaused) return "accent";
    return "secondary";
  }, [isTraining, isSessionPaused]);

  return (
    <ResponsivePixiPanel
      title="훈련 제어 - Training Controls"
      x={x}
      y={y}
      width={width}
      height={height}
      screenWidth={screenWidth}
      screenHeight={screenHeight}
      data-testid="training-controls"
    >
      {/* Primary Training Control */}
      <ResponsivePixiButton
        text={getTrainingButtonText()}
        x={buttonLayout.primary.x}
        y={buttonLayout.primary.y}
        width={buttonLayout.primary.width}
        height={buttonLayout.primary.height}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        variant={getTrainingButtonVariant()}
        onClick={onToggleTraining}
        data-testid="toggle-training-button"
      />

      {/* Pause/Resume Control */}
      {isTraining && (
        <ResponsivePixiButton
          text={isSessionPaused ? "재개" : "일시정지"}
          x={buttonLayout.secondary.x}
          y={buttonLayout.secondary.y}
          width={buttonLayout.secondary.width}
          height={buttonLayout.secondary.height}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          variant="secondary"
          onClick={onTogglePause}
          data-testid="pause-resume-button"
        />
      )}

      {/* Technique Execution */}
      <ResponsivePixiButton
        text="기술 실행"
        x={buttonLayout.execute.x}
        y={buttonLayout.execute.y}
        width={buttonLayout.execute.width}
        height={buttonLayout.execute.height}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        variant="accent"
        disabled={!canExecute || !isTraining || isSessionPaused}
        onClick={onExecuteTechnique}
        data-testid="execute-technique-button"
      />

      {/* Utility Controls */}
      <pixiContainer
        x={buttonLayout.utility.x}
        y={buttonLayout.utility.y}
        data-testid="utility-controls"
      >
        <ResponsivePixiButton
          text="더미 리셋"
          x={0}
          y={0}
          width={buttonLayout.utility.width * 0.48}
          height={buttonLayout.utility.height}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          variant="ghost"
          onClick={onResetDummy}
          data-testid="reset-dummy-button"
        />

        <ResponsivePixiButton
          text="평가"
          x={buttonLayout.utility.width * 0.52}
          y={0}
          width={buttonLayout.utility.width * 0.48}
          height={buttonLayout.utility.height}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          variant="ghost"
          onClick={onEvaluate}
          data-testid="evaluate-button"
        />
      </pixiContainer>

      {/* Training Status Indicators */}
      <pixiContainer
        x={10}
        y={height - 35}
        data-testid="training-status-indicators"
      >
        {/* Active Training Indicator */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            if (isTraining) {
              const color = isSessionPaused
                ? KOREAN_COLORS.WARNING_YELLOW
                : KOREAN_COLORS.ACCENT_GREEN;

              g.fill({ color, alpha: 0.8 });
              g.circle(6, 6, 4);
              g.fill();

              // Pulsing effect for active training
              if (!isSessionPaused) {
                const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
                g.fill({ color, alpha: pulse * 0.5 });
                g.circle(6, 6, 8);
                g.fill();
              }
            }
          }}
          data-testid="training-active-indicator"
        />

        <pixiText
          text={
            !isTraining
              ? "훈련 대기 중"
              : isSessionPaused
              ? "일시정지"
              : "훈련 중"
          }
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: isTraining
              ? isSessionPaused
                ? KOREAN_COLORS.WARNING_YELLOW
                : KOREAN_COLORS.ACCENT_GREEN
              : KOREAN_COLORS.TEXT_SECONDARY,
            fontWeight: isTraining ? "bold" : "normal",
          }}
          x={18}
          y={2}
          data-testid="training-status-text"
        />

        {/* Execution Status */}
        <pixiText
          text={canExecute ? "실행 가능" : "실행 불가"}
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: canExecute
              ? KOREAN_COLORS.POSITIVE_GREEN
              : KOREAN_COLORS.ACCENT_RED,
          }}
          x={18}
          y={15}
          data-testid="execution-status-text"
        />
      </pixiContainer>

      {/* Control Help Text */}
      <pixiContainer x={width - 120} y={height - 50} data-testid="control-help">
        <pixiText
          text="단축키:"
          style={{
            fontSize: isMobile ? 8 : 9,
            fill: KOREAN_COLORS.TEXT_TERTIARY,
            fontWeight: "bold",
          }}
          data-testid="shortcuts-label"
        />

        <pixiText
          text="SPACE: 기술 실행"
          style={{
            fontSize: isMobile ? 7 : 8,
            fill: KOREAN_COLORS.TEXT_TERTIARY,
          }}
          y={12}
          data-testid="space-shortcut"
        />

        <pixiText
          text="P: 일시정지"
          style={{
            fontSize: isMobile ? 7 : 8,
            fill: KOREAN_COLORS.TEXT_TERTIARY,
          }}
          y={24}
          data-testid="pause-shortcut"
        />

        <pixiText
          text="R: 리셋"
          style={{
            fontSize: isMobile ? 7 : 8,
            fill: KOREAN_COLORS.TEXT_TERTIARY,
          }}
          y={36}
          data-testid="reset-shortcut"
        />
      </pixiContainer>
    </ResponsivePixiPanel>
  );
};

export default TrainingControls;
