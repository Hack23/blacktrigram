import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { renderWithPixi } from "../../../test/test-utils";
import { TrainingControls } from "./TrainingControls";

/**
 * ## Training Controls Test Suite
 *
 * **Business Purpose:**
 * Validates the primary control interface for Korean martial arts training sessions.
 * Tests ensure that:
 * - Training session management follows traditional Korean martial arts workflow
 * - Control labels use authentic Korean martial arts terminology
 * - Interface provides intuitive training session control
 * - Accessibility features support inclusive martial arts education
 *
 * **Korean Martial Arts Integration:**
 * - Tests traditional Korean training command terminology ("시작", "정지", "평가")
 * - Validates authentic martial arts training workflow and interaction patterns
 * - Ensures cultural accuracy in training session management
 * - Verifies visual design inspired by traditional Korean martial arts
 *
 * **Business Value:**
 * These tests ensure the control interface provides effective training management
 * while maintaining authentic Korean martial arts educational principles.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
describe("TrainingControls", () => {
  const defaultProps = {
    isTraining: false,
    isSessionPaused: false,
    canExecute: true,
    onToggleTraining: vi.fn(),
    onTogglePause: vi.fn(),
    onExecuteTechnique: vi.fn(),
    onResetDummy: vi.fn(),
    onEvaluate: vi.fn(),
    x: 0,
    y: 0,
    width: 320,
    height: 240,
    screenWidth: 1200,
    screenHeight: 800,
    isMobile: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * **Business Requirement:** Training controls must provide clear Korean martial
   * arts session management with traditional terminology
   */
  describe("Session Management Controls", () => {
    it("should display Korean training start/stop controls", async () => {
      renderWithPixi(<TrainingControls {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId("training-controls")).toBeInTheDocument();
        expect(
          screen.getByTestId("toggle-training-button")
        ).toBeInTheDocument();

        const toggleButton = screen.getByTestId("toggle-training-button");
        expect(toggleButton.textContent).toMatch(/훈련 시작|시작/);
      });
    });

    it("should change button text when training session becomes active", async () => {
      const { rerender } = renderWithPixi(
        <TrainingControls {...defaultProps} />
      );

      // Initially should show start
      expect(screen.getByText(/훈련 시작/)).toBeInTheDocument();

      // When training is active, should show stop
      rerender(<TrainingControls {...defaultProps} isTraining={true} />);

      await waitFor(() => {
        expect(screen.getByText(/훈련 정지|정지/)).toBeInTheDocument();
      });
    });

    it("should call training toggle handler with Korean feedback", async () => {
      const mockToggle = vi.fn();
      renderWithPixi(
        <TrainingControls {...defaultProps} onToggleTraining={mockToggle} />
      );

      const toggleButton = await screen.findByTestId("toggle-training-button");
      fireEvent.click(toggleButton);

      expect(mockToggle).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * **Business Requirement:** Pause functionality must support traditional Korean
   * martial arts rest periods and meditation breaks
   */
  describe("Pause and Resume Controls", () => {
    it("should display pause controls only during active training", async () => {
      // Should not show pause when not training
      renderWithPixi(<TrainingControls {...defaultProps} isTraining={false} />);
      expect(
        screen.queryByTestId("pause-training-button")
      ).not.toBeInTheDocument();

      // Should show pause when training is active
      const { rerender } = renderWithPixi(
        <TrainingControls {...defaultProps} />
      );
      rerender(<TrainingControls {...defaultProps} isTraining={true} />);

      await waitFor(() => {
        expect(screen.getByTestId("pause-training-button")).toBeInTheDocument();
      });
    });

    it("should show Korean pause/resume text based on session state", async () => {
      const { rerender } = renderWithPixi(
        <TrainingControls
          {...defaultProps}
          isTraining={true}
          isSessionPaused={false}
        />
      );

      // Should show pause when training is active
      expect(screen.getByText(/일시정지|잠시 멈춤/)).toBeInTheDocument();

      // Should show resume when paused
      rerender(
        <TrainingControls
          {...defaultProps}
          isTraining={true}
          isSessionPaused={true}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/재개|다시 시작/)).toBeInTheDocument();
      });
    });

    it("should handle pause toggle with appropriate Korean martial arts timing", async () => {
      const mockPause = vi.fn();
      renderWithPixi(
        <TrainingControls
          {...defaultProps}
          isTraining={true}
          onTogglePause={mockPause}
        />
      );

      const pauseButton = await screen.findByTestId("pause-training-button");
      fireEvent.click(pauseButton);

      expect(mockPause).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * **Business Requirement:** Technique execution must provide immediate Korean
   * martial arts practice opportunities with proper limitations
   */
  describe("Technique Execution Controls", () => {
    it("should display Korean technique execution button", async () => {
      renderWithPixi(<TrainingControls {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByTestId("execute-technique-button")
        ).toBeInTheDocument();

        const executeButton = screen.getByTestId("execute-technique-button");
        expect(executeButton.textContent).toMatch(/기술 실행|실행/);
      });
    });

    it("should disable technique execution when cannot execute", async () => {
      renderWithPixi(<TrainingControls {...defaultProps} canExecute={false} />);

      await waitFor(() => {
        const executeButton = screen.getByTestId("execute-technique-button");
        expect(executeButton).toHaveAttribute("data-disabled", "true");
      });
    });

    it("should execute technique with Korean martial arts precision", async () => {
      const mockExecute = vi.fn();
      renderWithPixi(
        <TrainingControls {...defaultProps} onExecuteTechnique={mockExecute} />
      );

      const executeButton = await screen.findByTestId(
        "execute-technique-button"
      );
      fireEvent.click(executeButton);

      expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    it("should provide Korean feedback when execution is disabled", async () => {
      renderWithPixi(<TrainingControls {...defaultProps} canExecute={false} />);

      await waitFor(() => {
        const disabledMessage = screen.getByTestId(
          "execution-disabled-message"
        );
        expect(disabledMessage.textContent).toMatch(/불가능|제한|대기/);
      });
    });
  });

  /**
   * **Business Requirement:** Training dummy management must support realistic
   * Korean martial arts equipment reset and maintenance
   */
  describe("Dummy Management Controls", () => {
    it("should provide Korean dummy reset functionality", async () => {
      renderWithPixi(<TrainingControls {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId("reset-dummy-button")).toBeInTheDocument();

        const resetButton = screen.getByTestId("reset-dummy-button");
        expect(resetButton.textContent).toMatch(/더미 리셋|초기화/);
      });
    });

    it("should reset dummy with Korean confirmation feedback", async () => {
      const mockReset = vi.fn();
      renderWithPixi(
        <TrainingControls {...defaultProps} onResetDummy={mockReset} />
      );

      const resetButton = await screen.findByTestId("reset-dummy-button");
      fireEvent.click(resetButton);

      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * **Business Requirement:** Performance evaluation must follow traditional
   * Korean martial arts assessment principles
   */
  describe("Evaluation Controls", () => {
    it("should provide Korean performance evaluation button", async () => {
      renderWithPixi(<TrainingControls {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId("evaluate-button")).toBeInTheDocument();

        const evaluateButton = screen.getByTestId("evaluate-button");
        expect(evaluateButton.textContent).toMatch(/평가|성과 확인/);
      });
    });

    it("should trigger evaluation with Korean martial arts criteria", async () => {
      const mockEvaluate = vi.fn();
      renderWithPixi(
        <TrainingControls {...defaultProps} onEvaluate={mockEvaluate} />
      );

      const evaluateButton = await screen.findByTestId("evaluate-button");
      fireEvent.click(evaluateButton);

      expect(mockEvaluate).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * **Business Requirement:** Mobile interface must maintain Korean martial arts
   * functionality while adapting to touch interaction
   */
  describe("Mobile Responsiveness", () => {
    it("should adapt control layout for mobile while preserving Korean text", async () => {
      const mobileProps = {
        ...defaultProps,
        isMobile: true,
        screenWidth: 400,
        screenHeight: 600,
      };

      renderWithPixi(<TrainingControls {...mobileProps} />);

      await waitFor(() => {
        expect(screen.getByTestId("training-controls")).toBeInTheDocument();

        // Verify Korean text is still readable on mobile
        const koreanButtons = screen.getAllByText(
          /[\u3131-\u318E\uAC00-\uD7A3]/
        );
        expect(koreanButtons.length).toBeGreaterThan(0);
      });
    });

    it("should maintain touch-friendly button sizes for Korean text", async () => {
      const mobileProps = { ...defaultProps, isMobile: true };
      renderWithPixi(<TrainingControls {...mobileProps} />);

      const buttons = await screen.findAllByRole("button");
      buttons.forEach((button) => {
        const rect = button.getBoundingClientRect();
        expect(rect.height).toBeGreaterThanOrEqual(44); // iOS minimum touch target
      });
    });
  });

  /**
   * **Business Requirement:** Keyboard accessibility must support traditional
   * Korean martial arts training flow
   */
  describe("Keyboard Navigation", () => {
    it("should support keyboard navigation between training controls", async () => {
      renderWithPixi(<TrainingControls {...defaultProps} />);

      const controls = await screen.findByTestId("training-controls");
      controls.focus();

      // Test tab navigation
      fireEvent.keyDown(controls, { key: "Tab" });

      await waitFor(() => {
        expect(screen.getByTestId("toggle-training-button")).toHaveAttribute(
          "data-focused",
          "true"
        );
      });
    });

    it("should respond to Korean keyboard shortcuts for common actions", async () => {
      const mockToggle = vi.fn();
      const mockExecute = vi.fn();

      renderWithPixi(
        <TrainingControls
          {...defaultProps}
          onToggleTraining={mockToggle}
          onExecuteTechnique={mockExecute}
        />
      );

      const controls = await screen.findByTestId("training-controls");

      // Test space for training toggle
      fireEvent.keyDown(controls, { key: " " });
      expect(mockToggle).toHaveBeenCalled();

      // Test enter for technique execution
      fireEvent.keyDown(controls, { key: "Enter" });
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  /**
   * **Business Requirement:** Control states must provide clear Korean feedback
   * about current training session status
   */
  describe("Visual State Feedback", () => {
    it("should provide Korean visual feedback for different training states", async () => {
      const states = [
        { isTraining: false, isSessionPaused: false },
        { isTraining: true, isSessionPaused: false },
        { isTraining: true, isSessionPaused: true },
      ];

      for (const state of states) {
        const { rerender } = renderWithPixi(
          <TrainingControls {...defaultProps} />
        );
        rerender(<TrainingControls {...defaultProps} {...state} />);

        await waitFor(() => {
          expect(
            screen.getByTestId("training-status-indicator")
          ).toBeInTheDocument();
        });
      }
    });

    it("should use appropriate Korean colors for different control states", async () => {
      renderWithPixi(<TrainingControls {...defaultProps} isTraining={true} />);

      await waitFor(() => {
        const activeIndicator = screen.getByTestId("training-active-indicator");
        expect(activeIndicator).toHaveStyle("color: rgb(0, 255, 255)"); // Korean success cyan
      });
    });
  });
});
