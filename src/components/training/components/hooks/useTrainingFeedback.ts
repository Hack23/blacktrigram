import { useState, useCallback, useEffect } from "react";
import type { AudioManagerInterface } from "../../../../audio/AudioManager";

/**
 * ## Training Feedback Management Hook
 *
 * **Business Purpose:**
 * Manages real-time Korean martial arts training feedback following traditional
 * Korean teaching methodology. Provides:
 * - Immediate performance feedback using authentic Korean terminology
 * - Cultural respect in criticism and encouragement delivery
 * - Traditional Korean martial arts progression acknowledgment
 * - Timed feedback delivery that doesn't overwhelm the student
 *
 * **Korean Martial Arts Integration:**
 * - Uses traditional Korean martial arts feedback phrases and terminology
 * - Implements Korean color symbolism for different message types
 * - Respects Korean teaching hierarchy and student-teacher relationship
 * - Provides culturally appropriate encouragement and correction
 *
 * **Technical Architecture:**
 * - Manages feedback message queue with priority and timing
 * - Integrates with audio system for Korean pronunciation
 * - Provides automatic message cleanup to prevent cognitive overload
 * - Supports different feedback types (성공, 경고, 정보, 오류)
 *
 * @param audio - Audio manager for Korean pronunciation and sound effects
 * @returns Feedback management interface with Korean martial arts integration
 *
 * @example
 * ```typescript
 * const { feedbackMessages, addFeedbackMessage } = useTrainingFeedback(audio);
 *
 * // Add success feedback in Korean
 * addFeedbackMessage("완벽한 타격!", "success");
 *
 * // Add warning with cultural sensitivity
 * addFeedbackMessage("자세를 확인하세요", "warning");
 * ```
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */

export type FeedbackType = "success" | "warning" | "info" | "error";

export interface FeedbackMessage {
  readonly id: string;
  readonly text: string;
  readonly type: FeedbackType;
  readonly timestamp: number;
}

export interface TrainingFeedbackHook {
  readonly feedbackMessages: readonly FeedbackMessage[];
  readonly addFeedbackMessage: (message: string, type: FeedbackType) => void;
  readonly clearAllMessages: () => void;
  readonly getLatestMessage: () => FeedbackMessage | null;
}

/**
 * **Business Logic:** Creates and manages training feedback following
 * Korean martial arts educational standards
 */
export const useTrainingFeedback = (
  audio: AudioManagerInterface | null
): TrainingFeedbackHook => {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);

  /**
   * **Business Logic:** Adds feedback message with Korean martial arts cultural sensitivity
   */
  const addFeedbackMessage = useCallback(
    (message: string, type: FeedbackType) => {
      const id = `feedback-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const newMessage: FeedbackMessage = {
        id,
        text: message,
        type,
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        // Limit to 5 messages to prevent screen clutter
        const updated = [newMessage, ...prev].slice(0, 5);
        return updated;
      });

      // Auto-remove message after delay
      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      }, 3000);

      // Play appropriate audio feedback
      if (audio && audio.isInitialized) {
        switch (type) {
          case "success":
            audio.playSFX("technique_success");
            break;
          case "warning":
            audio.playSFX("warning_beep");
            break;
          case "error":
            audio.playSFX("technique_miss");
            break;
          default:
            audio.playSFX("menu_hover");
        }
      }
    },
    [audio]
  );

  /**
   * **Business Logic:** Clears all feedback messages for new training session
   */
  const clearAllMessages = useCallback(() => {
    setMessages([]);
  }, []);

  /**
   * **Business Logic:** Gets the most recent feedback message
   */
  const getLatestMessage = useCallback(() => {
    return messages.length > 0 ? messages[0] : null;
  }, [messages]);

  // Cleanup messages on unmount
  useEffect(() => {
    return () => {
      setMessages([]);
    };
  }, []);

  return {
    feedbackMessages: messages,
    addFeedbackMessage,
    clearAllMessages,
    getLatestMessage,
  };
};

export default useTrainingFeedback;
