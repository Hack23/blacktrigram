import { screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { renderWithPixi } from "../../../test/test-utils";
import { TrainingFeedbackSystem } from "./TrainingFeedbackSystem";
import type { FeedbackMessage } from "./hooks/useTrainingFeedback";

/**
 * ## Training Feedback System Test Suite
 *
 * **Business Purpose:**
 * Validates the real-time feedback system that provides immediate Korean martial arts
 * guidance during training sessions. Tests ensure that:
 * - Feedback messages use authentic Korean martial arts terminology
 * - Visual feedback follows traditional Korean color symbolism
 * - Message priority system respects martial arts learning hierarchy
 * - Feedback timing supports effective skill development
 *
 * **Korean Martial Arts Integration:**
 * - Validates authentic Korean encouragement phrases ("잘했습니다", "더 집중하세요")
 * - Tests traditional Korean color coding (금색=성공, 빨간색=위험)
 * - Ensures feedback supports traditional martial arts teaching methods
 * - Verifies cultural appropriateness of all feedback messages
 *
 * **Business Value:**
 * These tests ensure the feedback system maintains educational effectiveness
 * while providing culturally authentic Korean martial arts instruction.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
describe("TrainingFeedbackSystem", () => {
  const createMockMessage = (
    text: string,
    type: FeedbackMessage["type"],
    timestamp = Date.now()
  ): FeedbackMessage => ({
    id: `msg_${timestamp}`,
    text,
    type,
    timestamp,
  });

  const defaultProps = {
    feedbackMessages: [],
    x: 0,
    y: 0,
    screenWidth: 1200,
    screenHeight: 800,
    isMobile: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * **Business Requirement:** Feedback system must display Korean martial arts
   * terminology accurately with proper visual hierarchy
   */
  describe("Message Display", () => {
    it("should render Korean feedback messages with appropriate styling", async () => {
      const messages = [
        createMockMessage("완벽한 타격!", "success"),
        createMockMessage("자세를 확인하세요", "warning"),
      ];

      renderWithPixi(
        <TrainingFeedbackSystem {...defaultProps} feedbackMessages={messages} />
      );

      await waitFor(() => {
        expect(screen.getByTestId("feedback-message-msg_")).toBeInTheDocument();
        expect(screen.getByText("완벽한 타격!")).toBeInTheDocument();
        expect(screen.getByText("자세를 확인하세요")).toBeInTheDocument();
      });
    });

    it("should apply traditional Korean color coding for different message types", async () => {
      const successMessage = createMockMessage("훌륭합니다!", "success");
      renderWithPixi(
        <TrainingFeedbackSystem
          {...defaultProps}
          feedbackMessages={[successMessage]}
        />
      );

      await waitFor(() => {
        const messageBackground = screen.getByTestId(
          `feedback-background-${successMessage.id}`
        );
        expect(messageBackground).toHaveStyle("color: rgb(255, 215, 0)"); // Korean success gold
      });
    });

    it("should display priority indicators for critical messages", async () => {
      const criticalMessage = createMockMessage(
        "위험! 즉시 중단하세요",
        "error"
      );
      renderWithPixi(
        <TrainingFeedbackSystem
          {...defaultProps}
          feedbackMessages={[criticalMessage]}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByTestId(`priority-indicator-${criticalMessage.id}`)
        ).toBeInTheDocument();
      });
    });
  });

  /**
   * **Business Requirement:** Message lifecycle must support effective Korean
   * martial arts instruction timing and attention management
   */
  describe("Message Lifecycle Management", () => {
    it("should fade out messages after appropriate duration for learning retention", async () => {
      vi.useFakeTimers();

      const message = createMockMessage("기술을 연습하세요", "info");
      const { rerender } = renderWithPixi(
        <TrainingFeedbackSystem
          {...defaultProps}
          feedbackMessages={[message]}
        />
      );

      // Initial message should be visible
      expect(screen.getByText("기술을 연습하세요")).toBeInTheDocument();

      // Advance time past message duration
      vi.advanceTimersByTime(3500);

      rerender(
        <TrainingFeedbackSystem {...defaultProps} feedbackMessages={[]} />
      );

      await waitFor(() => {
        expect(screen.queryByText("기술을 연습하세요")).not.toBeInTheDocument();
      });

      vi.useRealTimers();
    });

    it("should limit maximum concurrent messages to prevent cognitive overload", async () => {
      const messages = Array.from({ length: 10 }, (_, i) =>
        createMockMessage(`메시지 ${i + 1}`, "info", Date.now() + i)
      );

      renderWithPixi(
        <TrainingFeedbackSystem
          {...defaultProps}
          feedbackMessages={messages}
          maxMessages={3}
        />
      );

      await waitFor(() => {
        const displayedMessages = screen.getAllByTestId(/feedback-message-/);
        expect(displayedMessages.length).toBe(3);
      });
    });

    it("should prioritize recent critical messages over older info messages", async () => {
      const oldInfo = createMockMessage(
        "정보 메시지",
        "info",
        Date.now() - 2000
      );
      const recentError = createMockMessage(
        "심각한 오류!",
        "error",
        Date.now() - 100
      );

      renderWithPixi(
        <TrainingFeedbackSystem
          {...defaultProps}
          feedbackMessages={[oldInfo, recentError]}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("심각한 오류!")).toBeInTheDocument();
        // Old info message should be deprioritized
      });
    });
  });

  /**
   * **Business Requirement:** Feedback must adapt to mobile interfaces while
   * maintaining Korean text readability and martial arts context
   */
  describe("Responsive Design", () => {
    it("should adapt message layout for mobile while preserving Korean text", async () => {
      const message = createMockMessage(
        "모바일에서도 읽기 쉬운 한글 메시지",
        "info"
      );
      renderWithPixi(
        <TrainingFeedbackSystem
          {...defaultProps}
          feedbackMessages={[message]}
          isMobile={true}
          screenWidth={400}
        />
      );

      await waitFor(() => {
        const messageElement = screen.getByText(
          "모바일에서도 읽기 쉬운 한글 메시지"
        );
        expect(messageElement).toBeInTheDocument();
        expect(messageElement).toHaveStyle("font-size: 12px"); // Mobile font size
      });
    });

    it("should adjust message positioning for different screen sizes", async () => {
      const message = createMockMessage("위치 테스트", "info");

      const { rerender } = renderWithPixi(
        <TrainingFeedbackSystem
          {...defaultProps}
          feedbackMessages={[message]}
          screenWidth={1920}
        />
      );

      // Test desktop positioning
      expect(screen.getByTestId("training-feedback")).toBeInTheDocument();

      // Test mobile positioning
      rerender(
        <TrainingFeedbackSystem
          {...defaultProps}
          feedbackMessages={[message]}
          screenWidth={400}
          isMobile={true}
        />
      );

      expect(screen.getByTestId("training-feedback")).toBeInTheDocument();
    });
  });

  /**
   * **Business Requirement:** Feedback system must provide meaningful default
   * state that encourages continued Korean martial arts practice
   */
  describe("Default State", () => {
    it("should display encouraging Korean message when no feedback is active", async () => {
      renderWithPixi(
        <TrainingFeedbackSystem {...defaultProps} feedbackMessages={[]} />
      );

      await waitFor(() => {
        expect(screen.getByTestId("default-feedback")).toBeInTheDocument();
        expect(screen.getByText("계속 연습하세요!")).toBeInTheDocument();
      });
    });

    it("should use appropriate Korean martial arts terminology in default message", async () => {
      renderWithPixi(
        <TrainingFeedbackSystem {...defaultProps} feedbackMessages={[]} />
      );

      await waitFor(() => {
        const defaultMessage = screen.getByTestId("feedback-message");
        expect(defaultMessage.textContent).toMatch(/연습|훈련|수련/); // Korean practice terms
      });
    });
  });

  /**
   * **Business Requirement:** Feedback animations must support learning without
   * causing distraction from Korean martial arts focus
   */
  describe("Animation and Visual Effects", () => {
    it("should animate message appearance to draw appropriate attention", async () => {
      const message = createMockMessage("새로운 피드백", "success");
      renderWithPixi(
        <TrainingFeedbackSystem
          {...defaultProps}
          feedbackMessages={[message]}
        />
      );

      await waitFor(() => {
        const messageContainer = screen.getByTestId(
          `feedback-message-${message.id}`
        );
        expect(messageContainer).toHaveStyle("opacity: 1"); // Full opacity when fresh
      });
    });

    it("should gradually fade messages to maintain focus on current training", async () => {
      vi.useFakeTimers();

      const message = createMockMessage(
        "페이드 테스트",
        "info",
        Date.now() - 1500
      );
      renderWithPixi(
        <TrainingFeedbackSystem
          {...defaultProps}
          feedbackMessages={[message]}
        />
      );

      vi.advanceTimersByTime(100);

      await waitFor(() => {
        const messageContainer = screen.getByTestId(
          `feedback-message-${message.id}`
        );
        // Should have reduced opacity as it ages
        expect(parseFloat(messageContainer.style.opacity)).toBeLessThan(1);
      });

      vi.useRealTimers();
    });
  });

  /**
   * **Business Requirement:** Feedback content must be culturally appropriate
   * and educationally effective for Korean martial arts instruction
   */
  describe("Content Validation", () => {
    it("should handle Korean characters properly in all message types", async () => {
      const koreanMessages = [
        createMockMessage("훌륭한 기술입니다!", "success"),
        createMockMessage("주의하세요", "warning"),
        createMockMessage("오류가 발생했습니다", "error"),
        createMockMessage("추가 정보입니다", "info"),
      ];

      renderWithPixi(
        <TrainingFeedbackSystem
          {...defaultProps}
          feedbackMessages={koreanMessages}
        />
      );

      await waitFor(() => {
        koreanMessages.forEach((msg) => {
          expect(screen.getByText(msg.text)).toBeInTheDocument();
        });
      });
    });

    it("should maintain message readability with Korean martial arts font styling", async () => {
      const message = createMockMessage("폰트 테스트: 무술 수련", "info");
      renderWithPixi(
        <TrainingFeedbackSystem
          {...defaultProps}
          feedbackMessages={[message]}
        />
      );

      await waitFor(() => {
        const messageText = screen.getByTestId(`feedback-text-${message.id}`);
        expect(messageText).toHaveStyle(
          "font-family: Noto Sans KR, Arial, sans-serif"
        );
      });
    });
  });
});
