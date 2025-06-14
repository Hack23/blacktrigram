import React, { useCallback, useMemo } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { ProgressTracker } from "../../ui/ProgressTracker";
import { KOREAN_COLORS } from "../../../types/constants";
import type { TrainingDummyState } from "./types/training";

extend({ Container, Graphics, Text });

/**
 * ## Training Dummy Component
 *
 * **Business Purpose:**
 * Interactive practice target for Korean martial arts technique training.
 * Provides realistic feedback for:
 * - Technique accuracy assessment through hit detection
 * - Visual damage indication with Korean martial arts terminology
 * - Anatomical targeting practice with vital point awareness
 * - Progressive difficulty through adaptive defensive behaviors
 *
 * **Korean Martial Arts Integration:**
 * - Authentic vital point (급소) targeting system
 * - Traditional Korean feedback terminology ("정확한 타격", "빗나감")
 * - Realistic body mechanics reflecting Korean martial arts principles
 * - Visual styling consistent with traditional Korean training equipment
 *
 * **Architecture:**
 * - Responsive hit detection adapting to different screen sizes
 * - State-driven visual feedback with smooth animations
 * - Modular design allowing for different dummy types and behaviors
 * - Integration with training session statistics and progression tracking
 *
 * @component
 * @example
 * ```tsx
 * <TrainingDummy
 *   dummyState={{
 *     health: 150,
 *     maxHealth: 150,
 *     position: { x: 600, y: 400 },
 *     isActive: true,
 *     lastHitTime: 0,
 *     hitCount: 0,
 *     isStunned: false,
 *     defensiveMode: false
 *   }}
 *   onTechniqueExecute={handleTechniqueExecution}
 *   onReset={handleDummyReset}
 *   screenWidth={1200}
 *   screenHeight={800}
 *   isMobile={false}
 * />
 * ```
 *
 * @see {@link TrainingDummyState} For dummy state interface
 * @see {@link useTrainingSession} For technique execution integration
 * @see {@link VitalPointSystem} For anatomical targeting
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
export interface TrainingDummyProps {
  /** Current state of the training dummy including health, position, and behavioral flags */
  readonly dummyState: TrainingDummyState;

  /** Callback triggered when player executes a technique on the dummy */
  readonly onTechniqueExecute: () => void;

  /** Callback to reset dummy to initial state (full health, clear status effects) */
  readonly onReset: () => void;

  /** Screen width for responsive hit detection and visual scaling */
  readonly screenWidth: number;

  /** Screen height for responsive layout calculations */
  readonly screenHeight: number;

  /** Whether the interface is optimized for mobile devices */
  readonly isMobile: boolean;
}

/**
 * ## Training Dummy State Model
 *
 * **Business Model:**
 * Represents the physical and logical state of a training dummy
 * throughout a practice session. Tracks damage accumulation,
 * defensive responses, and interaction history.
 *
 * **State Management:**
 * Uses immutable state updates to ensure predictable behavior
 * and enable easy rollback/reset functionality.
 */
export interface TrainingDummyState {
  /** Current health points (0 = completely damaged) */
  readonly health: number;

  /** Maximum health when dummy is in perfect condition */
  readonly maxHealth: number;

  /** 2D position in training area coordinate system */
  readonly position: Position;

  /** Whether dummy is available for technique practice */
  readonly isActive: boolean;

  /** Timestamp of most recent technique hit */
  readonly lastHitTime: number;

  /** Total number of successful hits received */
  readonly hitCount: number;

  /** Whether dummy is in stunned state (brief period after hit) */
  readonly isStunned: boolean;

  /** Whether dummy is in defensive mode (harder to hit) */
  readonly defensiveMode: boolean;
}

/**
 * ## Training Dummy Component Implementation
 *
 * **Interaction Design:**
 * - Large hit zones for mobile accessibility
 * - Visual feedback for successful/missed hits
 * - Progressive damage visualization
 * - Clear reset affordances when heavily damaged
 *
 * **Performance Considerations:**
 * - Efficient hit detection using PIXI interactive events
 * - Optimized graphics rendering for smooth animations
 * - Minimal state updates to prevent unnecessary re-renders
 *
 * @param props - Training dummy configuration and event handlers
 * @returns JSX.Element representing the interactive training dummy
 */
export const TrainingDummy: React.FC<TrainingDummyProps> = ({
  dummyState,
  onTechniqueExecute,
  onReset,
  screenWidth,
  screenHeight,
  isMobile,
  "data-testid": testId,
}) => {
  const dummySize = isMobile ? 60 : 80;
  const dummyHeight = isMobile ? 100 : 140;

  // Calculate visual states
  const healthPercentage = useMemo(() => {
    return dummyState.health / dummyState.maxHealth;
  }, [dummyState.health, dummyState.maxHealth]);

  const dummyColor = useMemo(() => {
    if (dummyState.isStunned) return KOREAN_COLORS.WARNING_YELLOW;
    if (healthPercentage > 0.7) return KOREAN_COLORS.NEUTRAL_GRAY;
    if (healthPercentage > 0.4) return KOREAN_COLORS.WARNING_ORANGE;
    return KOREAN_COLORS.ACCENT_RED;
  }, [healthPercentage, dummyState.isStunned]);

  // Draw main dummy body
  const drawDummyBody = useCallback(
    (g: any) => {
      g.clear();

      // Main body
      g.fill({ color: dummyColor, alpha: 0.9 });
      g.roundRect(0, 0, dummySize, dummyHeight, 8);
      g.fill();

      // Body outline
      g.stroke({
        width: 2,
        color: dummyState.isActive
          ? KOREAN_COLORS.ACCENT_CYAN
          : KOREAN_COLORS.UI_DISABLED_BORDER,
        alpha: 0.8,
      });
      g.roundRect(0, 0, dummySize, dummyHeight, 8);
      g.stroke();

      // Impact zones (vital points simulation)
      const zones = [
        { x: dummySize * 0.3, y: dummyHeight * 0.2, size: 8 }, // Head
        { x: dummySize * 0.5, y: dummyHeight * 0.4, size: 12 }, // Chest
        { x: dummySize * 0.5, y: dummyHeight * 0.7, size: 10 }, // Abdomen
      ];

      zones.forEach((zone) => {
        g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.6 });
        g.circle(zone.x, zone.y, zone.size);
        g.fill();
      });

      // Stun effect
      if (dummyState.isStunned) {
        g.stroke({ width: 3, color: KOREAN_COLORS.WARNING_YELLOW, alpha: 0.8 });
        g.circle(dummySize / 2, dummyHeight / 2, dummySize * 0.6);
        g.stroke();
      }
    },
    [
      dummySize,
      dummyHeight,
      dummyColor,
      dummyState.isActive,
      dummyState.isStunned,
    ]
  );

  // Draw damage indicators
  const drawDamageIndicators = useCallback(
    (g: any) => {
      g.clear();

      if (dummyState.hitCount > 0) {
        // Hit counter display
        g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
        g.roundRect(-10, -25, 40, 20, 4);
        g.fill();

        g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.6 });
        g.roundRect(-10, -25, 40, 20, 4);
        g.stroke();
      }

      // Recent hit indicators
      const timeSinceHit = Date.now() - dummyState.lastHitTime;
      if (timeSinceHit < 2000) {
        const alpha = Math.max(0, 1 - timeSinceHit / 2000);
        g.fill({ color: KOREAN_COLORS.ACCENT_RED, alpha: alpha * 0.5 });
        g.circle(dummySize / 2, dummyHeight / 2, dummySize * 0.4);
        g.fill();
      }
    },
    [dummyState.hitCount, dummyState.lastHitTime, dummySize, dummyHeight]
  );

  /**
   * **Business Logic:** Handles player technique execution on dummy
   *
   * Validates hit conditions and triggers appropriate responses:
   * - Checks if dummy is in valid state for hits
   * - Applies hit effects and damage calculations
   * - Triggers audio and visual feedback systems
   * - Updates training statistics and progression
   *
   * **Korean Martial Arts:** Simulates realistic striking feedback
   * based on traditional training dummy responses
   */
  const handleDummyHit = useCallback(() => {
    if (!dummyState.isActive || dummyState.isStunned) return;

    onTechniqueExecute();
    audio.playSFX("training_hit");
  }, [dummyState.isActive, dummyState.isStunned, onTechniqueExecute, audio]);

  return (
    <pixiContainer
      x={dummyState.position.x}
      y={dummyState.position.y}
      interactive={dummyState.isActive}
      onPointerDown={onTechniqueExecute}
      data-testid="training-dummy"
    >
      {/* Main Dummy Body */}
      <pixiGraphics draw={drawDummyBody} data-testid="dummy-body" />

      {/* Damage Indicators */}
      <pixiGraphics
        draw={drawDamageIndicators}
        data-testid="dummy-damage-indicators"
      />

      {/* Hit Counter */}
      {dummyState.hitCount > 0 && (
        <pixiText
          text={`${dummyState.hitCount}타`}
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
            align: "center",
          }}
          x={dummySize / 2}
          y={-15}
          anchor={0.5}
          data-testid="dummy-hit-counter"
        />
      )}

      {/* Dummy Status */}
      <pixiText
        text={
          dummyState.isStunned
            ? "기절"
            : dummyState.defensiveMode
            ? "방어"
            : "대기"
        }
        style={{
          fontSize: isMobile ? 9 : 11,
          fill: dummyState.isStunned
            ? KOREAN_COLORS.WARNING_YELLOW
            : dummyState.defensiveMode
            ? KOREAN_COLORS.PRIMARY_BLUE
            : KOREAN_COLORS.TEXT_SECONDARY,
          fontWeight: "bold",
          align: "center",
        }}
        x={dummySize / 2}
        y={dummyHeight + 15}
        anchor={0.5}
        data-testid="dummy-status"
      />

      {/* Health Tracker */}
      <pixiContainer
        x={-20}
        y={dummyHeight + 35}
        data-testid="training-dummy-container"
      >
        <ProgressTracker
          title="더미 체력"
          korean="체력"
          progress={healthPercentage}
          maxProgress={1}
          currentValue={dummyState.health}
          x={0}
          y={0}
          width={dummySize + 40}
          height={isMobile ? 15 : 20}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          color={
            healthPercentage > 0.6
              ? KOREAN_COLORS.POSITIVE_GREEN
              : healthPercentage > 0.3
              ? KOREAN_COLORS.WARNING_YELLOW
              : KOREAN_COLORS.NEGATIVE_RED
          }
          showText={true}
          data-testid="dummy-health-tracker"
        />
      </pixiContainer>

      {/* Reset Button (when health is low) */}
      {healthPercentage < 0.2 && (
        <pixiContainer
          x={dummySize + 10}
          y={dummyHeight / 2}
          data-testid="dummy-reset-area"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.ACCENT_CYAN, alpha: 0.8 });
              g.circle(0, 0, 15);
              g.fill();

              g.stroke({
                width: 2,
                color: KOREAN_COLORS.WHITE_SOLID,
                alpha: 0.9,
              });
              g.circle(0, 0, 15);
              g.stroke();
            }}
            interactive={true}
            onPointerDown={onReset}
            data-testid="dummy-reset-button"
          />
          <pixiText
            text="↻"
            style={{
              fontSize: 16,
              fill: KOREAN_COLORS.BLACK_SOLID,
              fontWeight: "bold",
              align: "center",
            }}
            anchor={0.5}
            data-testid="dummy-reset-text"
          />
        </pixiContainer>
      )}

      {/* Training Instructions */}
      <pixiText
        text="클릭하여 기술 실행"
        style={{
          fontSize: isMobile ? 8 : 10,
          fill: KOREAN_COLORS.TEXT_TERTIARY,
          align: "center",
          fontStyle: "italic",
        }}
        x={dummySize / 2}
        y={-35}
        anchor={0.5}
        data-testid="dummy-instructions"
      />

      {/* Dummy Information Panel */}
      <pixiContainer
        x={dummyState.position.x + (isMobile ? 35 : 50)}
        y={dummyState.position.y - (isMobile ? 40 : 60)}
        data-testid="dummy-info-panel"
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
            g.roundRect(0, 0, isMobile ? 80 : 100, isMobile ? 60 : 80, 4);
            g.fill();

            g.stroke({
              width: 1,
              color: KOREAN_COLORS.UI_BORDER,
              alpha: 0.6,
            });
            g.roundRect(0, 0, isMobile ? 80 : 100, isMobile ? 60 : 80, 4);
            g.stroke();
          }}
        />

        <pixiText
          text="훈련 더미"
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
          }}
          x={5}
          y={5}
          data-testid="dummy-label"
        />

        <pixiText
          text={`체력: ${Math.round(dummyState.health)}/${
            dummyState.maxHealth
          }`}
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          x={5}
          y={isMobile ? 18 : 22}
          data-testid="dummy-health-text"
        />

        <pixiText
          text={`타격 수: ${dummyState.hitCount}`}
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          x={5}
          y={isMobile ? 31 : 38}
          data-testid="dummy-hits-text"
        />

        <pixiText
          text={`상태: ${
            dummyState.isStunned
              ? "기절"
              : dummyState.defensiveMode
              ? "방어"
              : "정상"
          }`}
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: getDummyColor(),
          }}
          x={5}
          y={isMobile ? 44 : 54}
          data-testid="dummy-state-text"
        />
      </pixiContainer>

      {/* Interactive Elements */}
      <pixiContainer
        interactive={true}
        onPointerDown={handleDummyClick}
        data-testid="dummy-interactive-area"
      >
        {/* Dummy body graphics and other content */}
        {/* ...existing dummy rendering code... */}
      </pixiContainer>
    </pixiContainer>
  );
};

export default TrainingDummy;
