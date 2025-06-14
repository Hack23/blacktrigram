import { useState, useCallback, useEffect } from "react";
import type { AudioManagerInterface } from "../../../../types/audio";

export type FeedbackType = "success" | "error" | "warning" | "info";

export interface FeedbackMessage {
  readonly id: string;
  readonly text: string;
  readonly type: FeedbackType;
  readonly timestamp: number;
  readonly duration: number;
}

export interface TrainingFeedbackHook {
  readonly feedbackMessages: FeedbackMessage[];
  readonly addFeedbackMessage: (message: string, type: FeedbackType) => void;
  readonly clearFeedbackMessages: () => void;
  readonly getLatestFeedback: () => FeedbackMessage | null;
}

/**
 * **Business Logic:** Creates and manages training feedback following
 * Korean martial arts educational standards
 */
export const useTrainingFeedback = (
  audio: AudioManagerInterface | null
): TrainingFeedbackHook => {
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([]);

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
        duration: 3000,
      };

      setFeedbackMessages((prev) => {
        const updated = [newMessage, ...prev].slice(0, 5);
        return updated;
      });

      // Auto-remove after duration
      setTimeout(() => {
        setFeedbackMessages((prev) => prev.filter((msg) => msg.id !== id));
      }, newMessage.duration);

      // Play audio feedback
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
            break;
        }
      }
    },
    [audio]
  );

  const clearFeedbackMessages = useCallback(() => {
    setFeedbackMessages([]);
  }, []);

  const getLatestFeedback = useCallback(() => {
    return feedbackMessages.length > 0 ? feedbackMessages[0] : null;
  }, [feedbackMessages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setFeedbackMessages([]);
    };
  }, []);

  return {
    feedbackMessages,
    addFeedbackMessage,
    clearFeedbackMessages,
    getLatestFeedback,
  };
};

export default useTrainingFeedback;
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

  const clearFeedbackMessages = useCallback(() => {
    setFeedbackMessages([]);
  }, []);

  const getLatestFeedback = useCallback(() => {
    return feedbackMessages.length > 0 ? feedbackMessages[0] : null;
  }, [feedbackMessages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setFeedbackMessages([]);
    };
  }, []);

  return {
    feedbackMessages,
    addFeedbackMessage,
    clearFeedbackMessages,
    getLatestFeedback,
  };
};

export default useTrainingFeedback;
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
