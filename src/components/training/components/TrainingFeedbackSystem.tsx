import React, { useEffect, useState } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { KOREAN_COLORS } from "../../../types/constants";
import { ResponsivePixiContainer } from "../../ui/base/ResponsivePixiComponents";
import type { FeedbackMessage } from "./hooks/useTrainingFeedback";

// Extend PIXI components
extend({ Container, Graphics, Text });

/**
 * ## Training Feedback System Component
 *
 * **Business Purpose:**
 * Real-time feedback display system for Korean martial arts training sessions.
 * Provides immediate visual and textual feedback including:
 * - Technique execution quality assessment with Korean terminology
 * - Performance improvement suggestions based on traditional methods
 * - Cultural encouragement using authentic Korean martial arts expressions
 * - Visual feedback with traditional Korean color coding system
 *
 * **Korean Martial Arts Integration:**
 * - Authentic Korean martial arts feedback terminology ("잘했습니다", "더 집중하세요")
 * - Traditional Korean color symbolism for different feedback types
 * - Cultural accuracy in encouragement and correction language
 * - Integration with Korean martial arts learning progression philosophy
 *
 * **Architecture:**
 * - Real-time message queue management with priority system
 * - Smooth animations respecting traditional Korean aesthetic principles
 * - Responsive design adapting to mobile, tablet, and desktop layouts
 * - Integration with audio feedback system for immersive experience
 *
 * @component
 * @example
 * ```tsx
 * <TrainingFeedbackSystem
 *   feedbackMessages={[
 *     { id: "1", text: "완벽한 타격!", type: "success", timestamp: Date.now() },
 *     { id: "2", text: "자세를 확인하세요", type: "warning", timestamp: Date.now() }
 *   ]}
 *   x={600}
 *   y={100}
 *   screenWidth={1200}
 *   screenHeight={800}
 *   isMobile={false}
 * />
 * ```
 *
 * @see {@link useTrainingFeedback} For feedback message management
 * @see {@link TrainingScreen} For integration context
 * @see {@link FeedbackMessage} For message data structure
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
export interface TrainingFeedbackSystemProps {
  /** Array of feedback messages to display with Korean text and type classification */
  readonly feedbackMessages: FeedbackMessage[];

  /** X position offset for component placement */
  readonly x: number;

  /** Y position offset for component placement */
  readonly y: number;

  /** Screen width for responsive layout calculations */
  readonly screenWidth: number;

  /** Screen height for responsive breakpoint calculations */
  readonly screenHeight: number;

  /** Whether interface is optimized for mobile devices */
  readonly isMobile: boolean;

  /** Maximum number of messages to display simultaneously */
  readonly maxMessages?: number;

  /** Duration each message remains visible (milliseconds) */
  readonly messageDuration?: number;
}

/**
 * ## Training Feedback System Implementation
 *
 * **Business Logic:**
 * - Manages real-time display of training feedback with Korean martial arts terminology
 * - Prioritizes critical feedback over routine information messages
 * - Provides visual feedback using traditional Korean color symbolism
 * - Integrates with audio system for comprehensive sensory feedback
 *
 * **Technical Architecture:**
 * - Efficient message queue management with automatic cleanup
 * - Smooth fade-in/fade-out animations respecting Korean aesthetic principles
 * - Responsive positioning that adapts to different screen sizes
 * - Performance-optimized rendering with minimal impact on training performance
 *
 * **Korean Martial Arts Features:**
 * - Authentic Korean martial arts feedback terminology and expressions
 * - Traditional Korean color coding for different types of feedback
 * - Cultural accuracy in encouragement and instructional language
 * - Visual design consistent with traditional Korean martial arts training materials
 *
 * @param props - Feedback system configuration and message data
 * @returns JSX.Element representing the complete feedback display system
 */
export const TrainingFeedbackSystem: React.FC<TrainingFeedbackSystemProps> = ({
  feedbackMessages,
  x,
  y,
  screenWidth,
  screenHeight,
  isMobile,
  maxMessages = 3,
  messageDuration = 3000,
}) => {
  const [displayMessages, setDisplayMessages] = useState<FeedbackMessage[]>([]);

  // Message management with automatic cleanup
  useEffect(() => {
    const recentMessages = feedbackMessages
      .slice(-maxMessages)
      .filter((msg) => Date.now() - msg.timestamp < messageDuration);

    setDisplayMessages(recentMessages);
  }, [feedbackMessages, maxMessages, messageDuration]);

  // Get feedback color based on message type using Korean color symbolism
  const getFeedbackColor = (type: FeedbackMessage["type"]) => {
    switch (type) {
      case "success":
        return KOREAN_COLORS.ACCENT_GREEN; // Traditional Korean success color
      case "warning":
        return KOREAN_COLORS.ACCENT_GOLD; // Traditional Korean caution color
      case "error":
        return KOREAN_COLORS.ACCENT_RED; // Traditional Korean error color
      case "info":
      default:
        return KOREAN_COLORS.PRIMARY_CYAN; // Traditional Korean information color
    }
  };

  return (
    <ResponsivePixiContainer
      x={x}
      y={y}
      screenWidth={screenWidth}
      screenHeight={screenHeight}
      data-testid="training-feedback"
    >
      {displayMessages.map((message, index) => {
        const messageAge = Date.now() - message.timestamp;
        const alpha = Math.max(0, 1 - messageAge / messageDuration);
        const offsetY = index * (isMobile ? 35 : 45);

        return (
          <pixiContainer
            key={message.id}
            x={0}
            y={offsetY}
            alpha={alpha}
            data-testid={`feedback-message-${message.id}`}
          >
            {/* Message Background with Korean Styling */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: getFeedbackColor(message.type),
                  alpha: 0.9,
                });
                g.roundRect(
                  -(isMobile ? 150 : 200),
                  -15,
                  isMobile ? 300 : 400,
                  30,
                  8
                );
                g.fill();

                // Traditional Korean border styling
                g.stroke({
                  width: 2,
                  color: KOREAN_COLORS.ACCENT_GOLD,
                  alpha: 0.8,
                });
                g.roundRect(
                  -(isMobile ? 150 : 200),
                  -15,
                  isMobile ? 300 : 400,
                  30,
                  8
                );
                g.stroke();
              }}
              data-testid={`feedback-background-${message.id}`}
            />

            {/* Message Text with Korean Typography */}
            <pixiText
              text={message.text}
              style={{
                fontSize: isMobile ? 12 : 16,
                fill:
                  message.type === "success" || message.type === "error"
                    ? KOREAN_COLORS.WHITE_SOLID
                    : KOREAN_COLORS.BLACK_SOLID,
                fontWeight: "bold",
                align: "center",
                fontFamily: "Noto Sans KR, Arial, sans-serif",
              }}
              anchor={0.5}
              data-testid={`feedback-text-${message.id}`}
            />

            {/* Priority Indicator for Important Messages */}
            {(message.type === "error" || message.type === "success") && (
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({
                    color: KOREAN_COLORS.ACCENT_GOLD,
                    alpha: 0.8,
                  });
                  g.star(-(isMobile ? 170 : 220), 0, 5, 8, 12);
                  g.fill();
                }}
                data-testid={`priority-indicator-${message.id}`}
              />
            )}
          </pixiContainer>
        );
      })}

      {/* Current Feedback Status */}
      {displayMessages.length === 0 && (
        <pixiContainer data-testid="default-feedback">
          <pixiText
            text="계속 연습하세요!"
            style={{
              fontSize: isMobile ? 10 : 14,
              fill: KOREAN_COLORS.TEXT_TERTIARY,
              align: "center",
              fontFamily: "Noto Sans KR, Arial, sans-serif",
            }}
            anchor={0.5}
            data-testid="feedback-message"
          />
        </pixiContainer>
      )}
    </ResponsivePixiContainer>
  );
};

export default TrainingFeedbackSystem;
