/**
 * TrainingFeedbackOverlayHtml tests
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KOREAN_COLORS } from "../../../../types/constants";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import { TrainingFeedbackOverlayHtml } from "./TrainingFeedbackOverlayHtml";

describe("TrainingFeedbackOverlayHtml", () => {
  describe("Rendering", () => {
    it("should render with message", () => {
      render(
        <TrainingFeedbackOverlayHtml 
          message="Great hit!" 
          isMobile={false}
        />
      );

      const feedback = screen.getByTestId("training-feedback-html");
      expect(feedback).toBeInTheDocument();
      expect(feedback).toHaveTextContent("Great hit!");
    });

    it("should render with Korean message", () => {
      render(
        <TrainingFeedbackOverlayHtml 
          message="완벽한 타격!" 
          isMobile={false}
        />
      );

      const feedback = screen.getByTestId("training-feedback-html");
      expect(feedback).toHaveTextContent("완벽한 타격!");
    });

    it("should render empty message", () => {
      render(
        <TrainingFeedbackOverlayHtml 
          message="" 
          isMobile={false}
        />
      );

      const feedback = screen.getByTestId("training-feedback-html");
      expect(feedback).toBeInTheDocument();
      expect(feedback).toHaveTextContent("");
    });
  });

  describe("Responsive Design", () => {
    it("should apply desktop class when isMobile is false", () => {
      render(
        <TrainingFeedbackOverlayHtml 
          message="Test" 
          isMobile={false}
        />
      );

      const feedback = screen.getByTestId("training-feedback-html");
      expect(feedback).toHaveClass("training-feedback");
      expect(feedback).toHaveClass("desktop");
      expect(feedback).not.toHaveClass("mobile");
    });

    it("should apply mobile class when isMobile is true", () => {
      render(
        <TrainingFeedbackOverlayHtml 
          message="Test" 
          isMobile={true}
        />
      );

      const feedback = screen.getByTestId("training-feedback-html");
      expect(feedback).toHaveClass("training-feedback");
      expect(feedback).toHaveClass("mobile");
      expect(feedback).not.toHaveClass("desktop");
    });
  });

  describe("Korean Theming", () => {
    it("should apply Korean font family", () => {
      render(
        <TrainingFeedbackOverlayHtml 
          message="Test" 
          isMobile={false}
        />
      );

      const feedback = screen.getByTestId("training-feedback-html");
      const style = window.getComputedStyle(feedback);
      expect(style.fontFamily).toBeTruthy();
    });

    it("should apply ACCENT_GOLD color", () => {
      render(
        <TrainingFeedbackOverlayHtml 
          message="Test" 
          isMobile={false}
        />
      );

      const feedback = screen.getByTestId("training-feedback-html");
      const expectedColor = hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD);
      expect(feedback).toHaveStyle({
        color: expectedColor,
      });
    });

    it("should apply bold font weight", () => {
      render(
        <TrainingFeedbackOverlayHtml 
          message="Test" 
          isMobile={false}
        />
      );

      const feedback = screen.getByTestId("training-feedback-html");
      expect(feedback).toHaveStyle({
        fontWeight: "bold",
      });
    });

    it("should apply text shadow with ACCENT_GOLD glow", () => {
      render(
        <TrainingFeedbackOverlayHtml 
          message="Test" 
          isMobile={false}
        />
      );

      const feedback = screen.getByTestId("training-feedback-html");
      const glowColor = hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.5);
      expect(feedback).toHaveStyle({
        textShadow: expect.stringContaining(glowColor),
      });
    });
  });

  describe("React.memo Optimization", () => {
    it("should have displayName set", () => {
      expect(TrainingFeedbackOverlayHtml.displayName).toBe("TrainingFeedbackOverlayHtml");
    });

    it("should be memoized component", () => {
      // Check that the component is wrapped with React.memo
      expect(TrainingFeedbackOverlayHtml.$$typeof).toBeDefined();
    });
  });

  describe("Bilingual Content", () => {
    it("should handle bilingual messages with pipe separator", () => {
      render(
        <TrainingFeedbackOverlayHtml 
          message="완벽한 타격! | Perfect Hit!" 
          isMobile={false}
        />
      );

      const feedback = screen.getByTestId("training-feedback-html");
      expect(feedback).toHaveTextContent("완벽한 타격! | Perfect Hit!");
    });

    it("should handle messages with special characters", () => {
      render(
        <TrainingFeedbackOverlayHtml 
          message="+100 점수! | +100 Score!" 
          isMobile={false}
        />
      );

      const feedback = screen.getByTestId("training-feedback-html");
      expect(feedback).toHaveTextContent("+100 점수! | +100 Score!");
    });

    it("should handle long messages", () => {
      const longMessage = "이것은 매우 긴 피드백 메시지입니다. This is a very long feedback message that tests text wrapping.";
      render(
        <TrainingFeedbackOverlayHtml 
          message={longMessage} 
          isMobile={false}
        />
      );

      const feedback = screen.getByTestId("training-feedback-html");
      expect(feedback).toHaveTextContent(longMessage);
    });
  });

  describe("Accessibility", () => {
    it("should be accessible via test id", () => {
      render(
        <TrainingFeedbackOverlayHtml 
          message="Test" 
          isMobile={false}
        />
      );

      expect(screen.getByTestId("training-feedback-html")).toBeInTheDocument();
    });

    it("should render content in a single text node", () => {
      render(
        <TrainingFeedbackOverlayHtml 
          message="Test Message" 
          isMobile={false}
        />
      );

      const feedback = screen.getByTestId("training-feedback-html");
      expect(feedback.textContent).toBe("Test Message");
    });
  });
});
