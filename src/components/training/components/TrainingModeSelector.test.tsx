import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { renderWithPixi } from "../../../test/test-utils";
import { TrainingModeSelector } from "./TrainingModeSelector";
import { TRAINING_MODES } from "./constants/trainingModes";

/**
 * ## Training Mode Selector Test Suite
 *
 * **Business Purpose:**
 * Validates the training mode selection interface ensures proper Korean martial arts
 * progression methodology. Tests verify that:
 * - Players can only access appropriate training levels based on experience
 * - Korean terminology is displayed correctly throughout the interface
 * - Training mode transitions follow traditional martial arts learning paths
 * - Accessibility features work properly for inclusive training experience
 *
 * **Korean Martial Arts Integration:**
 * - Validates authentic Korean training progression (기본 → 고급 → 자유)
 * - Ensures cultural accuracy in mode descriptions and terminology
 * - Tests level-gated access following traditional Korean martial arts hierarchy
 * - Verifies bilingual Korean-English mode presentation
 *
 * **Business Value:**
 * These tests ensure the training selection interface maintains educational integrity
 * while providing an intuitive user experience that respects Korean martial arts traditions.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
describe("TrainingModeSelector", () => {
  const defaultProps = {
    currentMode: "basics" as const,
    selectedModeIndex: 0,
    playerLevel: 1,
    onModeSelect: vi.fn(),
    x: 0,
    y: 0,
    width: 400,
    height: 150,
    screenWidth: 1200,
    screenHeight: 800,
    isMobile: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * **Business Requirement:** Initial training interface must display Korean martial arts
   * mode options with authentic terminology and proper visual hierarchy
   */
  describe("Initial Rendering", () => {
    it("should render all available training modes with Korean names", async () => {
      renderWithPixi(<TrainingModeSelector {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId("training-mode-selector")).toBeInTheDocument();

        // Verify Korean mode names are displayed
        expect(screen.getByTestId("mode-basics")).toBeInTheDocument();
        expect(screen.getByTestId("mode-advanced")).toBeInTheDocument();
        expect(screen.getByTestId("mode-free")).toBeInTheDocument();
      });
    });

    it("should highlight currently selected mode following Korean UI principles", async () => {
      renderWithPixi(
        <TrainingModeSelector
          {...defaultProps}
          currentMode="advanced"
          selectedModeIndex={1}
        />
      );

      await waitFor(() => {
        const selectedMode = screen.getByTestId("mode-advanced");
        expect(selectedMode).toHaveAttribute("data-selected", "true");
      });
    });

    it("should display mode descriptions in Korean with English translations", async () => {
      renderWithPixi(<TrainingModeSelector {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId("current-mode-description")).toBeInTheDocument();
        expect(screen.getByTestId("current-mode-korean-name")).toBeInTheDocument();
      });
    });
  });

  /**
   * **Business Requirement:** Training progression must follow traditional Korean
   * martial arts hierarchy where students advance through structured levels
   */
  describe("Level-Based Access Control", () => {
    it("should prevent access to advanced modes for low-level players", async () => {
      const lowLevelProps = { ...defaultProps, playerLevel: 1 };
      renderWithPixi(<TrainingModeSelector {...lowLevelProps} />);

      const advancedMode = await screen.findByTestId("mode-advanced");
      fireEvent.click(advancedMode);

      // Should not allow selection due to level requirement
      expect(defaultProps.onModeSelect).not.toHaveBeenCalled();

      await waitFor(() => {
        expect(screen.getByTestId("access-denied-message")).toBeInTheDocument();
      });
    });

    it("should allow access to appropriate modes for qualified players", async () => {
      const qualifiedProps = { ...defaultProps, playerLevel: 5 };
      renderWithPixi(<TrainingModeSelector {...qualifiedProps} />);

      const advancedMode = await screen.findByTestId("mode-advanced");
      fireEvent.click(advancedMode);

      expect(defaultProps.onModeSelect).toHaveBeenCalledWith("advanced", 1);
    });

    it("should display level requirements in Korean for locked modes", async () => {
      const lowLevelProps = { ...defaultProps, playerLevel: 1 };
      renderWithPixi(<TrainingModeSelector {...lowLevelProps} />);

      await waitFor(() => {
        const lockedModes = screen.getAllByTestId(/mode-.*-locked/);
        expect(lockedModes.length).toBeGreaterThan(0);

        // Verify Korean level requirement text
        lockedModes.forEach((mode) => {
          expect(mode.textContent).toMatch(/레벨 \d+ 필요/);
        });
      });
    });
  });

  /**
   * **Business Requirement:** Training mode selection must provide clear feedback
   * about available stances and focus areas for informed decision-making
   */
  describe("Mode Information Display", () => {
    it("should show available trigram stances for each mode", async () => {
      renderWithPixi(<TrainingModeSelector {...defaultProps} />);

      await waitFor(() => {
        const availableStances = screen.getByTestId("available-stances-list");
        expect(availableStances).toBeInTheDocument();

        // Verify trigram stances are displayed
        expect(screen.getByTestId("available-stance-geon")).toBeInTheDocument();
      });
    });

    it("should display focus areas with Korean martial arts terminology", async () => {
      renderWithPixi(<TrainingModeSelector {...defaultProps} />);

      await waitFor(() => {
        const focusAreas = screen.getByTestId("focus-areas");
        expect(focusAreas).toBeInTheDocument();
        expect(focusAreas.textContent).toMatch(/정확도|힘|속도|기술/);
      });
    });

    it("should show maximum attempts allowed for each mode", async () => {
      renderWithPixi(<TrainingModeSelector {...defaultProps} />);

      await waitFor(() => {
        const maxAttempts = screen.getByTestId("max-attempts-display");
        expect(maxAttempts).toBeInTheDocument();
        expect(maxAttempts.textContent).toMatch(/최대 \d+회/);
      });
    });
  });

  /**
   * **Business Requirement:** Mode selection interface must adapt to different
   * screen sizes while maintaining Korean text readability
   */
  describe("Responsive Design", () => {
    it("should adapt layout for mobile devices without losing Korean text clarity", async () => {
      const mobileProps = {
        ...defaultProps,
        isMobile: true,
        screenWidth: 400,
        screenHeight: 600,
      };
      renderWithPixi(<TrainingModeSelector {...mobileProps} />);

      await waitFor(() => {
        const selector = screen.getByTestId("training-mode-selector");
        expect(selector).toBeInTheDocument();

        // Verify mobile-optimized Korean text is still readable
        const koreanText = screen.getByTestId("current-mode-korean-name");
        expect(koreanText).toBeInTheDocument();
      });
    });

    it("should maintain proper button sizing for touch interaction", async () => {
      const mobileProps = { ...defaultProps, isMobile: true };
      renderWithPixi(<TrainingModeSelector {...mobileProps} />);

      const modeButtons = await screen.findAllByTestId(/mode-.*-button/);
      modeButtons.forEach((button) => {
        const rect = button.getBoundingClientRect();
        expect(rect.height).toBeGreaterThanOrEqual(44); // iOS touch target minimum
      });
    });
  });

  /**
   * **Business Requirement:** Training mode progression must provide meaningful
   * feedback to guide player development through Korean martial arts mastery
   */
  describe("Mode Transition Feedback", () => {
    it("should provide Korean encouragement when player advances to new mode", async () => {
      const mockOnModeSelect = vi.fn();
      renderWithPixi(<TrainingModeSelector {...defaultProps} onModeSelect={mockOnModeSelect} />);

      const basicsMode = await screen.findByTestId("mode-basics");
      fireEvent.click(basicsMode);

      expect(mockOnModeSelect).toHaveBeenCalledWith("basics", 0);

      await waitFor(() => {
        expect(screen.getByTestId("mode-selection-feedback")).toBeInTheDocument();
      });
    });

    it("should explain progression requirements in Korean for locked modes", async () => {
      const lowLevelProps = { ...defaultProps, playerLevel: 1 };
      renderWithPixi(<TrainingModeSelector {...lowLevelProps} />);

      const advancedMode = await screen.findByTestId("mode-advanced");
      fireEvent.click(advancedMode);

      await waitFor(() => {
        const requirementText = screen.getByTestId("progression-requirement");
        expect(requirementText.textContent).toMatch(/더 많은 연습|경험이 필요/);
      });
    });
  });

  /**
   * **Business Requirement:** Interface must support keyboard navigation for
   * accessibility while maintaining Korean martial arts immersion
   */
  describe("Accessibility and Keyboard Navigation", () => {
    it("should support keyboard navigation between modes", async () => {
      renderWithPixi(<TrainingModeSelector {...defaultProps} />);

      const selector = await screen.findByTestId("training-mode-selector");
      selector.focus();

      // Test arrow key navigation
      fireEvent.keyDown(selector, { key: "ArrowRight" });

      await waitFor(() => {
        expect(screen.getByTestId("mode-advanced")).toHaveAttribute("data-focused", "true");
      });
    });

    it("should announce mode changes in Korean for screen readers", async () => {
      renderWithPixi(<TrainingModeSelector {...defaultProps} />);

      const advancedMode = await screen.findByTestId("mode-advanced");
      fireEvent.click(advancedMode);

      await waitFor(() => {
        expect(screen.getByTestId("sr-announcement")).toHaveTextContent(/고급 모드 선택됨/);
      });
    });
  });

  /**
   * **Business Requirement:** Training mode data must be validated to ensure
   * Korean martial arts educational integrity
   */
  describe("Data Validation", () => {
    it("should validate training mode configuration data", () => {
      TRAINING_MODES.forEach((mode, index) => {
        expect(mode).toHaveProperty("name.korean");
        expect(mode).toHaveProperty("name.english");
        expect(mode).toHaveProperty("description.korean");
        expect(mode).toHaveProperty("requiredLevel");
        expect(mode).toHaveProperty("availableStances");
        expect(mode.availableStances.length).toBeGreaterThan(0);
      });
    });

    it("should ensure progressive difficulty in mode requirements", () => {
      for (let i = 1; i < TRAINING_MODES.length; i++) {
        expect(TRAINING_MODES[i].requiredLevel).toBeGreaterThanOrEqual(
          TRAINING_MODES[i - 1].requiredLevel
        );
      }
    });
  });
});
      const currentModeName = screen.getByTestId("current-mode-name");
      expect(currentModeName.getAttribute("text")).toBe("선택되지 않음");
    });

    it("should handle missing onModeSelect gracefully", () => {
      renderTrainingModeSelector({ onModeSelect: undefined });

      const basicsButton = screen.getByTestId("mode-button-basics");

      // Should not crash when clicking without handler
      expect(() => {
        fireEvent.click(basicsButton);
      }).not.toThrow();
    });

    it("should handle edge case player levels", () => {
      renderTrainingModeSelector({ playerLevel: -1 });

      // Should handle negative levels gracefully
      expect(screen.getByTestId("training-mode-selector")).toBeInTheDocument();

      // Very high level
      renderTrainingModeSelector({ playerLevel: 999 });
      expect(screen.getByTestId("training-mode-selector")).toBeInTheDocument();
    });
  });

  describe("Korean Text Handling", () => {
    it("should display Korean mode names correctly", () => {
      renderTrainingModeSelector();

      const modes = [
        { testId: "mode-title-basics", expected: "기본" },
        { testId: "mode-title-advanced", expected: "고급" },
        { testId: "mode-title-techniques", expected: "기술" },
        { testId: "mode-title-combat", expected: "실전" },
        { testId: "mode-title-free", expected: "자유" },
      ];

      modes.forEach(({ testId, expected }) => {
        const element = screen.getByTestId(testId);
        expect(element.getAttribute("text")).toBe(expected);
      });
    });

    it("should display Korean descriptions correctly", () => {
      renderTrainingModeSelector();

      const currentModeDescription = screen.getByTestId(
        "current-mode-description"
      );
      expect(currentModeDescription.getAttribute("text")).toMatch(
        /[\u3131-\u318E\uAC00-\uD7A3]/
      );
    });
  });
});
