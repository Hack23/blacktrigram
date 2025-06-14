import React, { useState, useCallback, useEffect } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { ResponsivePixiContainer } from "../../ui/base/ResponsivePixiComponents";
import { KOREAN_COLORS } from "../../../types/constants";
import { useAudio } from "../../../audio/AudioProvider";

extend({ Container, Graphics, Text });

export interface TrainingFeedback {
  readonly message: string;
  readonly type: "success" | "warning" | "info" | "error";
  readonly timestamp: number;
  readonly duration: number;
}

export interface TrainingFeedbackSystemProps {
  readonly x: number;
  readonly y: number;
  readonly screenWidth: number;
  readonly screenHeight: number;
}

export class TrainingFeedbackManager {
  private feedbackMessages: TrainingFeedback[] = [];
  private listeners: ((messages: TrainingFeedback[]) => void)[] = [];

  addMessage(
    message: string,
    type: TrainingFeedback["type"] = "info",
    duration: number = 3000
  ): void {
    const feedback: TrainingFeedback = {
      message,
      type,
      timestamp: Date.now(),
      duration,
    };

    this.feedbackMessages = [...this.feedbackMessages.slice(-4), feedback];
    this.notifyListeners();
  }

  subscribe(listener: (messages: TrainingFeedback[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.feedbackMessages));
  }

  cleanup(): void {
    const now = Date.now();
    const filtered = this.feedbackMessages.filter(
      (msg) => now - msg.timestamp < msg.duration
    );

    if (filtered.length !== this.feedbackMessages.length) {
      this.feedbackMessages = filtered;
      this.notifyListeners();
    }
  }

  getMessages(): TrainingFeedback[] {
    return this.feedbackMessages;
  }
}

export const TrainingFeedbackSystem: React.FC<TrainingFeedbackSystemProps> = ({
  x,
  y,
  screenWidth,
  screenHeight,
}) => {
  const [feedbackMessages, setFeedbackMessages] = useState<TrainingFeedback[]>(
    []
  );
  const isMobile = screenWidth < 768;

  return (
    <ResponsivePixiContainer
      x={x}
      y={y}
      screenWidth={screenWidth}
      screenHeight={screenHeight}
      data-testid="feedback-messages-container"
    >
      {feedbackMessages.map((feedback, index) => {
        const alpha = Math.max(
          0.1,
          1 - (Date.now() - feedback.timestamp) / feedback.duration
        );
        const offsetY = index * (isMobile ? 25 : 30);

        return (
          <pixiContainer
            key={feedback.timestamp}
            y={offsetY}
            alpha={alpha}
            data-testid={`feedback-message-${index}`}
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                const bgColor =
                  feedback.type === "success"
                    ? KOREAN_COLORS.ACCENT_GREEN
                    : feedback.type === "warning"
                    ? KOREAN_COLORS.WARNING_YELLOW
                    : feedback.type === "error"
                    ? KOREAN_COLORS.ACCENT_RED
                    : KOREAN_COLORS.PRIMARY_CYAN;

                g.fill({ color: bgColor, alpha: 0.8 });
                g.roundRect(-100, -12, 200, 24, 8);
                g.fill();
              }}
            />
            <pixiText
              text={feedback.message}
              style={{
                fontSize: isMobile ? 10 : 12,
                fill: KOREAN_COLORS.BLACK_SOLID,
                fontWeight: "bold",
                align: "center",
              }}
              anchor={0.5}
            />
          </pixiContainer>
        );
      })}
    </ResponsivePixiContainer>
  );
};

// Hook for using the feedback system
export const useTrainingFeedback = (): [
  TrainingFeedback[],
  (message: string, type?: TrainingFeedback["type"], duration?: number) => void
] => {
  const [feedbackMessages, setFeedbackMessages] = useState<TrainingFeedback[]>(
    []
  );
  const [manager] = useState(() => new TrainingFeedbackManager());
  const audio = useAudio();

  useEffect(() => {
    const unsubscribe = manager.subscribe(setFeedbackMessages);

    const cleanup = setInterval(() => {
      manager.cleanup();
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(cleanup);
    };
  }, [manager]);

  const addFeedbackMessage = useCallback(
    (
      message: string,
      type: TrainingFeedback["type"] = "info",
      duration: number = 3000
    ) => {
      manager.addMessage(message, type, duration);

      // Audio feedback based on type
      switch (type) {
        case "success":
          audio.playSFX("perfect_strike");
          break;
        case "warning":
          audio.playSFX("block");
          break;
        case "error":
          audio.playSFX("miss");
          break;
        default:
          audio.playSFX("menu_hover");
      }
    },
    [manager, audio]
  );

  return [feedbackMessages, addFeedbackMessage];
};

export default TrainingFeedbackSystem;
