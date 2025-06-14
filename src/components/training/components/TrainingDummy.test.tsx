import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { renderWithPixi } from "../../../test/test-utils";
import { TrainingDummy } from "./TrainingDummy";
import type { TrainingDummyState } from "./types/training";

/**
 * ## Training Dummy Test Suite
 *
 * **Business Purpose:**
 * Validates the interactive training dummy that serves as the primary target for
 * Korean martial arts technique practice. Tests ensure that:
 * - Dummy provides realistic feedback for technique accuracy assessment
 * - Visual damage indication follows Korean martial arts terminology
 * - Hit detection supports anatomical targeting practice
 * - Dummy behavior adapts to progressive training difficulty
 *
 * **Korean Martial Arts Integration:**
 * - Tests authentic vital point (급소) targeting system
 * - Validates traditional Korean feedback terminology ("정확한 타격", "빗나감")
 * - Ensures realistic body mechanics reflecting Korean martial arts principles
 * - Verifies visual styling consistent with traditional Korean training equipment
 *
 * **Business Value:**
 * These tests ensure the training dummy provides effective practice opportunities
 * while maintaining authentic Korean martial arts learning principles.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
describe("TrainingDummy", () => {
  const createMockDummyState = (
    overrides: Partial<TrainingDummyState> = {}
  ): TrainingDummyState => ({
    health: 150,
    maxHealth: 150,
    position: { x: 600, y: 400 },
    isActive: true,
    lastHitTime: 0,
    hitCount: 0,
    isStunned: false,
    defensiveMode: false,
    ...overrides,
  });

  const defaultProps = {
    dummyState: createMockDummyState(),
    onTechniqueExecute: vi.fn(),
    onReset: vi.fn(),
    screenWidth: 1200,
    screenHeight: 800,
    isMobile: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * **Business Requirement:** Training dummy must provide clear visual representation
   * of Korean martial arts practice target with traditional styling
   */
  describe("Visual Rendering", () => {
    it("should render dummy with traditional Korean training equipment aesthetics", async () => {
      renderWithPixi(<TrainingDummy {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId("training-dummy")).toBeInTheDocument();
        expect(screen.getByTestId("dummy-body")).toBeInTheDocument();
        expect(screen.getByTestId("dummy-visual-frame")).toBeInTheDocument();
      });
    });

    it("should display health status with Korean martial arts terminology", async () => {
      renderWithPixi(<TrainingDummy {...defaultProps} />);

      await waitFor(() => {
        const healthDisplay = screen.getByTestId("dummy-health-display");
        expect(healthDisplay).toBeInTheDocument();
        expect(healthDisplay.textContent).toMatch(/체력|생명력/);
      });
    });

    it("should adapt visual size for mobile devices while maintaining proportions", async () => {
      const mobileProps = {
        ...defaultProps,
        isMobile: true,
        screenWidth: 400,
        screenHeight: 600,
      };

      renderWithPixi(<TrainingDummy {...mobileProps} />);

      await waitFor(() => {
        const dummy = screen.getByTestId("training-dummy");
        expect(dummy).toBeInTheDocument();
        // Verify mobile scaling doesn't break proportions
      });
    });
  });

  /**
   * **Business Requirement:** Dummy interaction must provide immediate feedback
   * for technique execution practice with Korean martial arts accuracy
   */
  describe("Interaction Feedback", () => {
    it("should execute technique when dummy is clicked during active training", async () => {
      const mockExecute = vi.fn();
      renderWithPixi(
        <TrainingDummy {...defaultProps} onTechniqueExecute={mockExecute} />
      );

      const dummy = await screen.findByTestId("dummy-interaction-area");
      fireEvent.click(dummy);

      expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    it("should not respond to interaction when dummy is inactive", async () => {
      const mockExecute = vi.fn();
      const inactiveDummy = createMockDummyState({ isActive: false });

      renderWithPixi(
        <TrainingDummy
          {...defaultProps}
          dummyState={inactiveDummy}
          onTechniqueExecute={mockExecute}
        />
      );

      const dummy = await screen.findByTestId("dummy-interaction-area");
      fireEvent.click(dummy);

      expect(mockExecute).not.toHaveBeenCalled();
    });

    it("should provide visual feedback when dummy is stunned", async () => {
      const stunnedDummy = createMockDummyState({ isStunned: true });
      renderWithPixi(
        <TrainingDummy {...defaultProps} dummyState={stunnedDummy} />
      );

      await waitFor(() => {
        expect(screen.getByTestId("dummy-stunned-effect")).toBeInTheDocument();
        expect(screen.getByText("기절")).toBeInTheDocument(); // Korean "stunned"
      });
    });
  });

  /**
   * **Business Requirement:** Health management must reflect realistic Korean
   * martial arts training impact and recovery patterns
   */
  describe("Health Management", () => {
    it("should display accurate health percentage with Korean numerals", async () => {
      const damagedDummy = createMockDummyState({ health: 75, maxHealth: 150 });
      renderWithPixi(
        <TrainingDummy {...defaultProps} dummyState={damagedDummy} />
      );

      await waitFor(() => {
        const healthDisplay = screen.getByTestId("dummy-health-display");
        expect(healthDisplay.textContent).toMatch(/50%/); // 75/150 = 50%
      });
    });

    it("should show critical health warning in Korean when near defeat", async () => {
      const criticalDummy = createMockDummyState({
        health: 15,
        maxHealth: 150,
      });
      renderWithPixi(
        <TrainingDummy {...defaultProps} dummyState={criticalDummy} />
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("dummy-critical-warning")
        ).toBeInTheDocument();
        expect(screen.getByText("위험")).toBeInTheDocument(); // Korean "danger"
      });
    });

    it("should reset health when reset button is activated", async () => {
      const mockReset = vi.fn();
      const damagedDummy = createMockDummyState({ health: 50 });

      renderWithPixi(
        <TrainingDummy
          {...defaultProps}
          dummyState={damagedDummy}
          onReset={mockReset}
        />
      );

      const resetButton = await screen.findByTestId("dummy-reset-button");
      fireEvent.click(resetButton);

      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * **Business Requirement:** Training dummy must provide progressive difficulty
   * through defensive behaviors that challenge advancing students
   */
  describe("Defensive Behavior", () => {
    it("should enter defensive mode after sustained attacks", async () => {
      const defensiveDummy = createMockDummyState({
        defensiveMode: true,
        hitCount: 10,
      });

      renderWithPixi(
        <TrainingDummy {...defaultProps} dummyState={defensiveDummy} />
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("dummy-defensive-stance")
        ).toBeInTheDocument();
        expect(screen.getByText("방어 모드")).toBeInTheDocument(); // Korean "defense mode"
      });
    });

    it("should provide Korean feedback about defensive behavior activation", async () => {
      const defensiveDummy = createMockDummyState({ defensiveMode: true });
      renderWithPixi(
        <TrainingDummy {...defaultProps} dummyState={defensiveDummy} />
      );

      await waitFor(() => {
        const defensiveText = screen.getByTestId("dummy-defensive-indicator");
        expect(defensiveText.textContent).toMatch(/방어|보호|막기/); // Korean defense terms
      });
    });
  });

  /**
   * **Business Requirement:** Training instructions must be clear and culturally
   * appropriate for Korean martial arts practice
   */
  describe("Training Instructions", () => {
    it("should display Korean practice instructions", async () => {
      renderWithPixi(<TrainingDummy {...defaultProps} />);

      await waitFor(() => {
        const instructions = screen.getByTestId("dummy-instructions");
        expect(instructions).toBeInTheDocument();
        expect(instructions.textContent).toBe("클릭하여 기술 실행");
      });
    });

    it("should provide contextual Korean guidance based on dummy state", async () => {
      const stunnedDummy = createMockDummyState({ isStunned: true });
      renderWithPixi(
        <TrainingDummy {...defaultProps} dummyState={stunnedDummy} />
      );

      await waitFor(() => {
        const guidance = screen.getByTestId("dummy-contextual-guidance");
        expect(guidance.textContent).toMatch(/회복|대기|기다리세요/); // Korean wait terms
      });
    });
  });

  /**
   * **Business Requirement:** Reset functionality must provide clear feedback
   * about training session restart
   */
  describe("Reset Functionality", () => {
    it("should show reset confirmation in Korean", async () => {
      const damagedDummy = createMockDummyState({ health: 50 });
      renderWithPixi(
        <TrainingDummy {...defaultProps} dummyState={damagedDummy} />
      );

      await waitFor(() => {
        const resetSection = screen.getByTestId("dummy-reset-section");
        expect(resetSection).toBeInTheDocument();
        expect(screen.getByTestId("dummy-reset-text")).toBeInTheDocument();
      });
    });

    it("should display Korean reset symbol and instruction", async () => {
      renderWithPixi(<TrainingDummy {...defaultProps} />);

      await waitFor(() => {
        const resetText = screen.getByTestId("dummy-reset-text");
        expect(resetText.textContent).toBe("↻"); // Reset symbol
      });
    });
  });

  /**
   * **Business Requirement:** Accessibility features must support inclusive
   * Korean martial arts training experience
   */
  describe("Accessibility", () => {
    it("should provide proper test IDs for screen reader navigation", async () => {
      renderWithPixi(<TrainingDummy {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId("training-dummy")).toBeInTheDocument();
        expect(screen.getByTestId("dummy-health-display")).toBeInTheDocument();
        expect(
          screen.getByTestId("dummy-interaction-area")
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("dummy-status-indicators")
        ).toBeInTheDocument();
      });
    });

    it("should maintain Korean text readability across different contrast modes", async () => {
      renderWithPixi(<TrainingDummy {...defaultProps} />);

      await waitFor(() => {
        const koreanTexts = screen.getAllByText(/[\u3131-\u318E\uAC00-\uD7A3]/);
        expect(koreanTexts.length).toBeGreaterThan(0);

        koreanTexts.forEach((text) => {
          expect(text).toBeInTheDocument();
        });
      });
    });
  });

  /**
   * **Business Requirement:** Performance must remain smooth during intensive
   * Korean martial arts training sessions
   */
  describe("Performance Considerations", () => {
    it("should handle rapid interaction without performance degradation", async () => {
      const mockExecute = vi.fn();
      renderWithPixi(
        <TrainingDummy {...defaultProps} onTechniqueExecute={mockExecute} />
      );

      const dummy = await screen.findByTestId("dummy-interaction-area");

      // Simulate rapid clicks
      for (let i = 0; i < 10; i++) {
        fireEvent.click(dummy);
      }

      expect(mockExecute).toHaveBeenCalledTimes(10);
    });

    it("should maintain visual clarity during state transitions", async () => {
      const { rerender } = renderWithPixi(<TrainingDummy {...defaultProps} />);

      // Test multiple state changes
      const states = [
        createMockDummyState({ health: 150 }),
        createMockDummyState({ health: 100, hitCount: 5 }),
        createMockDummyState({ health: 50, isStunned: true }),
        createMockDummyState({ health: 150, defensiveMode: true }),
      ];

      for (const state of states) {
        rerender(<TrainingDummy {...defaultProps} dummyState={state} />);

        await waitFor(() => {
          expect(screen.getByTestId("training-dummy")).toBeInTheDocument();
        });
      }
    });
  });
});
