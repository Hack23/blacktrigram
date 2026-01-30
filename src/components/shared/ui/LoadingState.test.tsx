/**
 * Tests for LoadingState component
 * Comprehensive coverage of loading states, progress indication, and accessibility
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingState, type LoadingStateProps } from "./LoadingState";

describe("LoadingState", () => {
  describe("Rendering", () => {
    it("should render loading state component", () => {
      render(<LoadingState />);

      expect(screen.getByTestId("loading-state")).toBeInTheDocument();
    });

    it("should render bilingual title", () => {
      render(<LoadingState />);

      const title = screen.getByText(/흑괘.*BLACK TRIGRAM/);
      expect(title).toBeInTheDocument();
      expect(title.textContent).toContain("흑괘");
      expect(title.textContent).toContain("BLACK TRIGRAM");
    });

    it("should render progress bar", () => {
      render(<LoadingState progress={50} />);

      expect(screen.getByTestId("loading-progress-bar")).toBeInTheDocument();
    });

    it("should render logo SVG", () => {
      render(<LoadingState />);

      const logo = screen.getByLabelText("Black Trigram Logo");
      expect(logo).toBeInTheDocument();
      expect(logo.tagName).toBe("svg");
    });

    it("should render loading spinner", () => {
      render(<LoadingState />);

      const spinner = screen.getByLabelText("Loading spinner");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("Progress Indication", () => {
    it("should display progress value when provided", () => {
      render(<LoadingState progress={75} />);

      const progressBar = screen.getByTestId("loading-progress-bar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "75");
    });

    it("should clamp progress to 0-100 range", () => {
      const { rerender } = render(<LoadingState progress={150} />);

      let progressBar = screen.getByTestId("loading-progress-bar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "100");

      rerender(<LoadingState progress={-50} />);

      progressBar = screen.getByTestId("loading-progress-bar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "0");
    });

    it("should show indeterminate progress when progress is undefined", () => {
      render(<LoadingState />);

      const progressBar = screen.getByTestId("loading-progress-bar");
      expect(progressBar).not.toHaveAttribute("aria-valuenow");
    });

    it("should apply indeterminate class when progress is undefined", () => {
      render(<LoadingState />);

      const progressBar = screen.getByTestId("loading-progress-bar");
      const innerBar = progressBar.querySelector(".loading-state__progress-bar");

      expect(innerBar).toHaveClass("loading-state__progress-bar--indeterminate");
    });

    it("should not apply indeterminate class when progress is defined", () => {
      render(<LoadingState progress={50} />);

      const progressBar = screen.getByTestId("loading-progress-bar");
      const innerBar = progressBar.querySelector(".loading-state__progress-bar");

      expect(innerBar).not.toHaveClass("loading-state__progress-bar--indeterminate");
    });

    it("should apply correct width style for progress", () => {
      render(<LoadingState progress={60} />);

      const progressBar = screen.getByTestId("loading-progress-bar");
      const innerBar = progressBar.querySelector(
        ".loading-state__progress-bar"
      ) as HTMLElement;

      expect(innerBar.style.width).toBe("60%");
    });

    it("should handle 0% progress", () => {
      render(<LoadingState progress={0} />);

      const progressBar = screen.getByTestId("loading-progress-bar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "0");

      const innerBar = progressBar.querySelector(
        ".loading-state__progress-bar"
      ) as HTMLElement;
      expect(innerBar.style.width).toBe("0%");
    });

    it("should handle 100% progress", () => {
      render(<LoadingState progress={100} />);

      const progressBar = screen.getByTestId("loading-progress-bar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "100");

      const innerBar = progressBar.querySelector(
        ".loading-state__progress-bar"
      ) as HTMLElement;
      expect(innerBar.style.width).toBe("100%");
    });
  });

  describe("Loading Stages", () => {
    it("should display default stage message", () => {
      render(<LoadingState />);

      expect(screen.getByText(/게임 준비 중.*Preparing Game/)).toBeInTheDocument();
    });

    it("should display assets stage message", () => {
      render(<LoadingState stage="assets" />);

      expect(screen.getByText(/자산 로드 중.*Loading Assets/)).toBeInTheDocument();
    });

    it("should display audio stage message", () => {
      render(<LoadingState stage="audio" />);

      expect(screen.getByText(/오디오 초기화.*Initializing Audio/)).toBeInTheDocument();
    });

    it("should display initialization stage message", () => {
      render(<LoadingState stage="initialization" />);

      expect(screen.getByText(/게임 준비 중.*Preparing Game/)).toBeInTheDocument();
    });

    it("should display complete stage message", () => {
      render(<LoadingState stage="complete" />);

      expect(screen.getByText(/완료.*Complete/)).toBeInTheDocument();
    });

    it("should support all stage types", () => {
      const stages: LoadingStateProps["stage"][] = [
        "assets",
        "audio",
        "initialization",
        "complete",
      ];

      stages.forEach((stage) => {
        const { unmount } = render(<LoadingState stage={stage} />);
        const stageElement = screen.getByTestId("loading-state");
        expect(stageElement).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("Custom Messages", () => {
    it("should display default message when not provided", () => {
      render(<LoadingState />);

      expect(screen.getByText(/로드 중.*Loading\.\.\./)).toBeInTheDocument();
    });

    it("should display custom message when provided", () => {
      const customMessage = "사용자 지정 메시지 | Custom Message";
      render(<LoadingState message={customMessage} />);

      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it("should handle empty string message", () => {
      render(<LoadingState message="" />);

      const loadingState = screen.getByTestId("loading-state");
      expect(loadingState).toBeInTheDocument();
    });

    it("should handle very long message", () => {
      const longMessage = "A".repeat(500);
      render(<LoadingState message={longMessage} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it("should handle special characters in message", () => {
      const specialMessage = "로딩... 特殊文字 © ® ™ <>&";
      render(<LoadingState message={specialMessage} />);

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper role attribute", () => {
      render(<LoadingState />);

      const loadingState = screen.getByTestId("loading-state");
      expect(loadingState).toHaveAttribute("role", "status");
    });

    it("should have aria-live attribute", () => {
      render(<LoadingState />);

      const loadingState = screen.getByTestId("loading-state");
      expect(loadingState).toHaveAttribute("aria-live", "polite");
    });

    it("should have aria-busy attribute", () => {
      render(<LoadingState />);

      const loadingState = screen.getByTestId("loading-state");
      expect(loadingState).toHaveAttribute("aria-busy", "true");
    });

    it("should have aria-label with progress when defined", () => {
      render(<LoadingState progress={45} />);

      const loadingState = screen.getByTestId("loading-state");
      expect(loadingState).toHaveAttribute("aria-label", "Loading progress: 45%");
    });

    it("should have generic aria-label when progress is undefined", () => {
      render(<LoadingState />);

      const loadingState = screen.getByTestId("loading-state");
      expect(loadingState).toHaveAttribute("aria-label", "Loading...");
    });

    it("should have progress bar with proper ARIA attributes", () => {
      render(<LoadingState progress={30} />);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute("aria-valuenow", "30");
      expect(progressBar).toHaveAttribute("aria-valuemin", "0");
      expect(progressBar).toHaveAttribute("aria-valuemax", "100");
    });

    it("should have progress bar aria-label", () => {
      render(<LoadingState progress={80} />);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute("aria-label", "Loading progress: 80%");
    });

    it("should have progress bar aria-label for indeterminate", () => {
      render(<LoadingState />);

      const progressBar = screen.getByTestId("loading-progress-bar");
      expect(progressBar).toHaveAttribute("aria-label", "Loading...");
    });

    it("should have accessible SVG logo", () => {
      render(<LoadingState />);

      const logo = screen.getByLabelText("Black Trigram Logo");
      expect(logo).toBeInTheDocument();
    });

    it("should have accessible spinner label", () => {
      render(<LoadingState />);

      const spinner = screen.getByLabelText("Loading spinner");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("should render with all props combined", () => {
      render(
        <LoadingState
          progress={65}
          message="통합 테스트 | Integration Test"
          stage="audio"
        />
      );

      expect(screen.getByTestId("loading-state")).toBeInTheDocument();
      expect(screen.getByText(/통합 테스트.*Integration Test/)).toBeInTheDocument();
      expect(screen.getByText(/오디오 초기화.*Initializing Audio/)).toBeInTheDocument();

      const progressBar = screen.getByTestId("loading-progress-bar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "65");
    });

    it("should update progress dynamically", () => {
      const { rerender } = render(<LoadingState progress={10} />);

      let progressBar = screen.getByTestId("loading-progress-bar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "10");

      rerender(<LoadingState progress={50} />);

      progressBar = screen.getByTestId("loading-progress-bar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "50");

      rerender(<LoadingState progress={90} />);

      progressBar = screen.getByTestId("loading-progress-bar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "90");
    });

    it("should update stage dynamically", () => {
      const { rerender } = render(<LoadingState stage="assets" />);

      expect(screen.getByText(/자산 로드 중.*Loading Assets/)).toBeInTheDocument();

      rerender(<LoadingState stage="audio" />);

      expect(screen.getByText(/오디오 초기화.*Initializing Audio/)).toBeInTheDocument();

      rerender(<LoadingState stage="complete" />);

      expect(screen.getByText(/완료.*Complete/)).toBeInTheDocument();
    });

    it("should update message dynamically", () => {
      const { rerender } = render(<LoadingState message="First message" />);

      expect(screen.getByText("First message")).toBeInTheDocument();

      rerender(<LoadingState message="Second message" />);

      expect(screen.queryByText("First message")).not.toBeInTheDocument();
      expect(screen.getByText("Second message")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle fractional progress values", () => {
      render(<LoadingState progress={33.33} />);

      const progressBar = screen.getByTestId("loading-progress-bar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "33.33");
    });

    it("should handle negative progress values", () => {
      render(<LoadingState progress={-10} />);

      const progressBar = screen.getByTestId("loading-progress-bar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "0");
    });

    it("should handle progress values over 100", () => {
      render(<LoadingState progress={250} />);

      const progressBar = screen.getByTestId("loading-progress-bar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "100");
    });

    it("should handle NaN progress", () => {
      render(<LoadingState progress={NaN} />);

      const progressBar = screen.getByTestId("loading-progress-bar");
      // NaN passes through Math.min/Math.max as NaN
      expect(progressBar).toHaveAttribute("aria-valuenow", "NaN");
    });

    it("should handle null message gracefully", () => {
      render(<LoadingState message={null as unknown as string} />);

      const loadingState = screen.getByTestId("loading-state");
      expect(loadingState).toBeInTheDocument();
    });

    it("should handle undefined stage gracefully", () => {
      render(<LoadingState stage={undefined} />);

      // Should fall back to 'initialization' stage
      expect(screen.getByText(/게임 준비 중.*Preparing Game/)).toBeInTheDocument();
    });
  });
});
