import React, { useCallback, useMemo } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { ResponsivePixiPanel } from "../../ui/base/ResponsivePixiComponents";
import { KOREAN_COLORS } from "../../../types/constants";
import type { TrainingMode, TrainingModeConfig } from "./types/training";
import { TRAINING_MODES } from "./constants/trainingModes";

extend({ Container, Graphics, Text });

/**
 * ## Training Mode Selector Component
 *
 * **Business Purpose:**
 * Comprehensive training mode selection interface for structured Korean martial arts learning.
 * Provides progressive skill development through:
 * - Basics Mode: Fundamental stances and movements for beginners
 * - Advanced Mode: Complex technique combinations for experienced practitioners
 * - Free Mode: Open practice with full technique access for masters
 * - Specialized modes for different martial arts disciplines
 *
 * **Korean Martial Arts Integration:**
 * - Authentic Korean training progression methodology
 * - Traditional belt/rank system integration with mode accessibility
 * - Korean terminology for all training modes and descriptions
 * - Cultural respect for martial arts learning hierarchy and progression
 *
 * **Architecture:**
 * - Responsive design adapting to different screen sizes and orientations
 * - Level-gated access system preventing premature advancement
 * - Integration with player progression and experience tracking
 * - Visual feedback for mode requirements and learning objectives
 *
 * @component
 * @example
 * ```tsx
 * <TrainingModeSelector
 *   currentMode="basics"
 *   selectedModeIndex={0}
 *   playerLevel={5}
 *   onModeSelect={(mode, index) => handleModeChange(mode, index)}
 *   x={50}
 *   y={100}
 *   width={400}
 *   height={150}
 *   screenWidth={1200}
 *   screenHeight={800}
 *   isMobile={false}
 * />
 * ```
 *
 * @see {@link TrainingMode} For available training mode types
 * @see {@link TRAINING_MODES} For complete mode configuration data
 * @see {@link useTrainingSession} For mode integration with training state
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
export interface TrainingModeSelectorProps {
  /** Currently active training mode identifier */
  readonly currentMode: TrainingMode;

  /** Index of currently selected mode in TRAINING_MODES array */
  readonly selectedModeIndex: number;

  /** Player's current level (determines mode accessibility) */
  readonly playerLevel: number;

  /** Callback when player selects a new training mode */
  readonly onModeSelect: (mode: TrainingMode, modeIndex: number) => void;

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
 * ## Training Mode Selector Implementation
 *
 * **Business Logic:**
 * - Manages progressive unlocking of training modes based on player advancement
 * - Provides clear descriptions of learning objectives for each mode
 * - Validates player eligibility before allowing mode transitions
 * - Tracks and displays progress indicators for mode completion
 *
 * **Technical Architecture:**
 * - Responsive UI that adapts to mobile, tablet, and desktop layouts
 * - Integration with player progression system for level-based access control
 * - Visual feedback system using traditional Korean color schemes
 * - Performance-optimized rendering with efficient state management
 *
 * **Korean Martial Arts Features:**
 * - Authentic Korean training methodology reflected in mode progression
 * - Traditional Korean terminology for all training concepts
 * - Cultural accuracy in learning path design and advancement requirements
 * - Visual design inspired by traditional Korean martial arts training materials
 *
 * @param props - Mode selector configuration and interaction handlers
 * @returns JSX.Element representing the complete training mode selection interface
 */
export const TrainingModeSelector: React.FC<TrainingModeSelectorProps> = ({
  currentMode,
  selectedModeIndex,
  playerLevel,
  onModeSelect,
  x,
  y,
  width,
  height,
  screenWidth,
  screenHeight,
  isMobile,
}) => {
  // Calculate available modes based on player level
  const availableModes = useMemo(() => {
    return TRAINING_MODES.map((mode, index) => ({
      ...mode,
      index,
      isUnlocked: playerLevel >= mode.requiredLevel,
      isSelected: index === selectedModeIndex,
    }));
  }, [playerLevel, selectedModeIndex]);

  // Handle mode selection with validation
  const handleModeClick = useCallback(
    (mode: TrainingModeConfig, modeIndex: number) => {
      if (playerLevel >= mode.requiredLevel) {
        onModeSelect(mode.mode, modeIndex);
      }
    },
    [playerLevel, onModeSelect]
  );

  // Get mode selection color based on state
  const getModeColor = useCallback((mode: any) => {
    if (!mode.isUnlocked) return KOREAN_COLORS.UI_DISABLED_BG;
    if (mode.isSelected) return KOREAN_COLORS.ACCENT_GOLD;
    return KOREAN_COLORS.UI_BACKGROUND_MEDIUM;
  }, []);

  return (
    <ResponsivePixiPanel
      title="훈련 모드 선택 - Training Mode Selection"
      x={x}
      y={y}
      width={width}
      height={height}
      screenWidth={screenWidth}
      screenHeight={screenHeight}
      data-testid="training-mode-selector"
    >
      <pixiContainer x={10} y={10} data-testid="mode-buttons-container">
        {availableModes.map((mode, index) => (
          <pixiContainer
            key={mode.mode}
            x={0}
            y={index * (isMobile ? 35 : 45)}
            data-testid={`mode-${mode.mode}`}
          >
            {/* Mode Button Background */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                const bgColor = getModeColor(mode);
                g.fill({ color: bgColor, alpha: 0.8 });
                g.roundRect(0, 0, width - 40, isMobile ? 30 : 40, 5);
                g.fill();

                // Border with unlock state indication
                g.stroke({
                  width: 2,
                  color: mode.isUnlocked
                    ? mode.isSelected
                      ? KOREAN_COLORS.PRIMARY_CYAN
                      : KOREAN_COLORS.ACCENT_GOLD
                    : KOREAN_COLORS.UI_DISABLED_BORDER,
                  alpha: 0.8,
                });
                g.roundRect(0, 0, width - 40, isMobile ? 30 : 40, 5);
                g.stroke();

                // Lock indicator for locked modes
                if (!mode.isUnlocked) {
                  g.fill({ color: KOREAN_COLORS.UI_DISABLED_TEXT, alpha: 0.6 });
                  g.rect(width - 60, 5, 15, 10);
                  g.fill();
                }
              }}
              interactive={mode.isUnlocked}
              onPointerDown={() => handleModeClick(mode, index)}
              data-testid={`mode-button-${mode.mode}`}
            />

            {/* Mode Title */}
            <pixiText
              text={mode.name.korean}
              style={{
                fontSize: isMobile ? 12 : 14,
                fill: mode.isUnlocked
                  ? mode.isSelected
                    ? KOREAN_COLORS.BLACK_SOLID
                    : KOREAN_COLORS.TEXT_PRIMARY
                  : KOREAN_COLORS.UI_DISABLED_TEXT,
                fontWeight: mode.isSelected ? "bold" : "normal",
              }}
              x={10}
              y={isMobile ? 8 : 10}
              data-testid={`mode-title-${mode.mode}`}
            />

            {/* Mode Subtitle */}
            <pixiText
              text={mode.name.english}
              style={{
                fontSize: isMobile ? 9 : 10,
                fill: mode.isUnlocked
                  ? KOREAN_COLORS.TEXT_SECONDARY
                  : KOREAN_COLORS.UI_DISABLED_TEXT,
                fontStyle: "italic",
              }}
              x={10}
              y={isMobile ? 18 : 22}
              data-testid={`mode-subtitle-${mode.mode}`}
            />

            {/* Level Requirement */}
            {!mode.isUnlocked && (
              <pixiText
                text={`레벨 ${mode.requiredLevel} 필요`}
                style={{
                  fontSize: isMobile ? 8 : 9,
                  fill: KOREAN_COLORS.WARNING_YELLOW,
                  fontWeight: "bold",
                }}
                x={width - 120}
                y={isMobile ? 15 : 18}
                data-testid={`mode-requirement-${mode.mode}`}
              />
            )}

            {/* Max Attempts Indicator */}
            {mode.isUnlocked && (
              <pixiText
                text={`최대 ${mode.maxAttempts}회`}
                style={{
                  fontSize: isMobile ? 8 : 9,
                  fill: KOREAN_COLORS.TEXT_TERTIARY,
                }}
                x={width - 80}
                y={isMobile ? 15 : 18}
                data-testid={`mode-attempts-${mode.mode}`}
              />
            )}
          </pixiContainer>
        ))}
      </pixiContainer>

      {/* Current Mode Description */}
      <pixiContainer
        x={10}
        y={height - (isMobile ? 60 : 80)}
        data-testid="current-mode-info"
      >
        <pixiText
          text="현재 모드:"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
          }}
          data-testid="mode-title"
        />

        <pixiText
          text={
            TRAINING_MODES[selectedModeIndex]?.name.korean || "선택되지 않음"
          }
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
          }}
          y={isMobile ? 15 : 18}
          data-testid="current-mode-name"
        />

        <pixiText
          text={
            TRAINING_MODES[selectedModeIndex]?.description.korean ||
            "모드를 선택하세요"
          }
          style={{
            fontSize: isMobile ? 9 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            wordWrap: true,
            wordWrapWidth: width - 40,
          }}
          y={isMobile ? 30 : 35}
          data-testid="current-mode-description"
        />
      </pixiContainer>

      {/* Available Stances for Current Mode */}
      <pixiContainer x={width - 120} y={35} data-testid="available-stances">
        <pixiText
          text="사용 가능한 자세:"
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontWeight: "bold",
          }}
          data-testid="available-stances-title"
        />

        {(TRAINING_MODES[selectedModeIndex]?.availableStances || [])
          .slice(0, 4)
          .map((stance, index) => (
            <pixiText
              key={stance}
              text={stance}
              style={{
                fontSize: isMobile ? 7 : 8,
                fill: KOREAN_COLORS.ACCENT_CYAN,
              }}
              x={0}
              y={12 + index * 10}
              data-testid={`available-stance-${stance}`}
            />
          ))}
      </pixiContainer>
    </ResponsivePixiPanel>
  );
};

export default TrainingModeSelector;
export default TrainingModeSelector;
