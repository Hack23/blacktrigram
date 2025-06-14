import { screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { renderWithPixi } from "../../../test/test-utils";
import { TrainingEnhancedIntegration } from "./TrainingEnhancedIntegration";
import { TrigramStance, PlayerArchetype } from "../../../types/enums";
import type { TrainingStatistics } from "./types/training";

/**
 * ## Training Enhanced Integration Test Suite
 *
 * **Business Purpose:**
 * Validates the advanced integration layer that coordinates all training subsystems
 * for a cohesive Korean martial arts training experience. Tests ensure that:
 * - Real-time stance transitions integrate seamlessly with traditional flow
 * - Performance analytics provide meaningful Korean martial arts assessment
 * - Audio-visual feedback synchronization enhances training immersion
 * - Cultural authenticity is maintained throughout all integration points
 *
 * **Korean Martial Arts Integration:**
 * - Tests traditional Korean martial arts training methodology compliance
 * - Validates authentic trigram philosophy implementation in system coordination
 * - Ensures cultural accuracy across all integrated training components
 * - Verifies harmony between training aspects following Korean aesthetic principles
 *
 * **Business Value:**
 * These tests ensure the integration layer provides seamless coordination
 * while maintaining authentic Korean martial arts learning principles.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
describe("TrainingEnhancedIntegration", () => {
  const mockStats: TrainingStatistics = {
    attempts: 15,
    hits: 12,
    perfectStrikes: 5,
    accuracy: 80,
    sessionTime: 300,
    experienceGained: 120,
  };

  const defaultProps = {
    selectedStance: TrigramStance.GEON,
    playerArchetype: PlayerArchetype.MUSA,
    trainingMode: "basics" as const,
    isTraining: false,
    currentCombo: 0,
    stats: mockStats,
    screenWidth: 1200,
    screenHeight: 800,
    onStateChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * **Business Requirement:** Integration system must coordinate all training
   * subsystems without introducing performance bottlenecks
   */
  describe("System Coordination", () => {
    it("should render integration layer without crashing", async () => {
      renderWithPixi(<TrainingEnhancedIntegration {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByTestId("training-enhanced-integration")
        ).toBeInTheDocument();
      });
    });

    it("should monitor integration health in development mode", async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      renderWithPixi(<TrainingEnhancedIntegration {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.getByTestId("integration-status-debug")
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("integration-status-title")
        ).toBeInTheDocument();
      });

      process.env.NODE_ENV = originalEnv;
    });

    it("should track stance changes for integration analytics", async () => {
      const { rerender } = renderWithPixi(
        <TrainingEnhancedIntegration {...defaultProps} />
      );

      // Change stance
      rerender(
        <TrainingEnhancedIntegration
          {...defaultProps}
          selectedStance={TrigramStance.TAE}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("integration-stance")).toBeInTheDocument();
      });
    });

    it("should coordinate archetype-specific integration patterns", async () => {
      const { rerender } = renderWithPixi(
        <TrainingEnhancedIntegration {...defaultProps} />
      );

      // Test different archetypes
      const archetypes = [
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      for (const archetype of archetypes) {
        rerender(
          <TrainingEnhancedIntegration
            {...defaultProps}
            playerArchetype={archetype}
          />
        );

        await waitFor(() => {
          expect(
            screen.getByTestId("integration-archetype")
          ).toBeInTheDocument();
        });
      }
    });
  });

  /**
   * **Business Requirement:** Integration must adapt to different training modes
   * while maintaining Korean martial arts educational integrity
   */
  describe("Training Mode Integration", () => {
    it("should adapt integration behavior for different training modes", async () => {
      const trainingModes = ["basics", "advanced", "free"] as const;

      for (const mode of trainingModes) {
        const { rerender } = renderWithPixi(
          <TrainingEnhancedIntegration {...defaultProps} />
        );

        rerender(
          <TrainingEnhancedIntegration {...defaultProps} trainingMode={mode} />
        );

        await waitFor(() => {
          expect(screen.getByTestId("integration-mode")).toBeInTheDocument();
        });
      }
    });

    it("should provide mode-specific integration complexity", async () => {
      renderWithPixi(
        <TrainingEnhancedIntegration
          {...defaultProps}
          trainingMode="advanced"
        />
      );

      await waitFor(() => {
        const modeDisplay = screen.getByTestId("integration-mode");
        expect(modeDisplay.textContent).toBe("advanced");
      });
    });
  });

  /**
   * **Business Requirement:** Active training sessions must show enhanced
   * integration effects and performance optimization
   */
  describe("Active Training Integration", () => {
    it("should activate enhanced effects during training sessions", async () => {
      renderWithPixi(
        <TrainingEnhancedIntegration
          {...defaultProps}
          isTraining={true}
          currentCombo={3}
        />
      );

      await waitFor(() => {
        // Should not show performance enhancement for low combo
        expect(
          screen.queryByTestId("performance-enhancement")
        ).not.toBeInTheDocument();
      });
    });

    it("should display ki enhancement effects for high combo streaks", async () => {
      renderWithPixi(
        <TrainingEnhancedIntegration
          {...defaultProps}
          isTraining={true}
          currentCombo={6}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("performance-enhancement")
        ).toBeInTheDocument();
        expect(screen.getByTestId("ki-enhancement-symbol")).toBeInTheDocument();
      });
    });

    it("should provide training state coordination callbacks", async () => {
      const mockStateChange = vi.fn();

      renderWithPixi(
        <TrainingEnhancedIntegration
          {...defaultProps}
          isTraining={true}
          onStateChange={mockStateChange}
        />
      );

      await waitFor(() => {
        expect(mockStateChange).toHaveBeenCalledWith(
          expect.objectContaining({
            status: "active",
            performance: expect.any(Object),
            authenticity: expect.any(Object),
            userExperience: expect.any(Object),
          })
        );
      });
    });
  });

  /**
   * **Business Requirement:** Cultural authenticity indicators must provide
   * feedback on Korean martial arts accuracy throughout training
   */
  describe("Cultural Authenticity Integration", () => {
    it("should display cultural authenticity indicators for high accuracy", async () => {
      const highAccuracyStats = {
        ...mockStats,
        accuracy: 85,
      };

      renderWithPixi(
        <TrainingEnhancedIntegration
          {...defaultProps}
          stats={highAccuracyStats}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("cultural-authenticity")).toBeInTheDocument();
        expect(screen.getByTestId("authenticity-message")).toBeInTheDocument();
      });
    });

    it("should use authentic Korean martial arts terminology", async () => {
      const highAccuracyStats = {
        ...mockStats,
        accuracy: 90,
      };

      renderWithPixi(
        <TrainingEnhancedIntegration
          {...defaultProps}
          stats={highAccuracyStats}
        />
      );

      await waitFor(() => {
        const authenticityMessage = screen.getByTestId("authenticity-message");
        expect(authenticityMessage.textContent).toMatch(/전통 무예 정신 구현/);
      });
    });

    it("should coordinate cultural elements across different stances", async () => {
      const stances = [
        TrigramStance.GEON,
        TrigramStance.TAE,
        TrigramStance.LI,
        TrigramStance.JIN,
        TrigramStance.SON,
        TrigramStance.GAM,
        TrigramStance.GAN,
        TrigramStance.GON,
      ];

      for (const stance of stances) {
        const { rerender } = renderWithPixi(
          <TrainingEnhancedIntegration {...defaultProps} />
        );

        rerender(
          <TrainingEnhancedIntegration
            {...defaultProps}
            selectedStance={stance}
            stats={{ ...mockStats, accuracy: 85 }}
          />
        );

        await waitFor(() => {
          expect(
            screen.getByTestId("cultural-authenticity")
          ).toBeInTheDocument();
        });
      }
    });
  });

  /**
   * **Business Requirement:** Integration must provide performance monitoring
   * without impacting training session smoothness
   */
  describe("Performance Monitoring", () => {
    it("should monitor integration performance metrics", async () => {
      const mockStateChange = vi.fn();

      renderWithPixi(
        <TrainingEnhancedIntegration
          {...defaultProps}
          onStateChange={mockStateChange}
        />
      );

      // Wait for periodic monitoring
      await waitFor(
        () => {
          expect(mockStateChange).toHaveBeenCalledWith(
            expect.objectContaining({
              performance: expect.objectContaining({
                frameRate: expect.any(Number),
                memoryUsage: expect.any(Number),
                renderTime: expect.any(Number),
              }),
            })
          );
        },
        { timeout: 6000 }
      );
    });

    it("should track user experience optimization metrics", async () => {
      const mockStateChange = vi.fn();

      renderWithPixi(
        <TrainingEnhancedIntegration
          {...defaultProps}
          onStateChange={mockStateChange}
        />
      );

      await waitFor(() => {
        expect(mockStateChange).toHaveBeenCalledWith(
          expect.objectContaining({
            userExperience: expect.objectContaining({
              responsiveness: expect.any(Number),
              feedbackLatency: expect.any(Number),
              visualClarity: expect.any(Number),
            }),
          })
        );
      });
    });
  });

  /**
   * **Business Requirement:** Integration must support responsive design
   * while maintaining Korean martial arts visual consistency
   */
  describe("Responsive Integration", () => {
    it("should adapt integration display for mobile devices", async () => {
      renderWithPixi(
        <TrainingEnhancedIntegration
          {...defaultProps}
          screenWidth={400}
          screenHeight={600}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("training-enhanced-integration")
        ).toBeInTheDocument();
      });
    });

    it("should maintain integration status visibility across screen sizes", async () => {
      const screenSizes = [
        { width: 400, height: 600 }, // Mobile
        { width: 800, height: 600 }, // Tablet
        { width: 1200, height: 800 }, // Desktop
        { width: 1920, height: 1080 }, // Large desktop
      ];

      for (const size of screenSizes) {
        const { rerender } = renderWithPixi(
          <TrainingEnhancedIntegration {...defaultProps} />
        );

        rerender(
          <TrainingEnhancedIntegration
            {...defaultProps}
            screenWidth={size.width}
            screenHeight={size.height}
          />
        );

        await waitFor(() => {
          expect(
            screen.getByTestId("training-enhanced-integration")
          ).toBeInTheDocument();
        });
      }
    });
  });

  /**
   * **Business Requirement:** Integration state changes must be handled
   * gracefully without disrupting training flow
   */
  describe("State Change Management", () => {
    it("should handle training pause/resume integration", async () => {
      const mockStateChange = vi.fn();
      const { rerender } = renderWithPixi(
        <TrainingEnhancedIntegration
          {...defaultProps}
          isTraining={true}
          onStateChange={mockStateChange}
        />
      );

      // Pause training
      rerender(
        <TrainingEnhancedIntegration
          {...defaultProps}
          isTraining={false}
          onStateChange={mockStateChange}
        />
      );

      await waitFor(() => {
        expect(mockStateChange).toHaveBeenCalledWith(
          expect.objectContaining({
            status: "paused",
          })
        );
      });
    });

    it("should coordinate combo-based integration effects", async () => {
      const { rerender } = renderWithPixi(
        <TrainingEnhancedIntegration {...defaultProps} />
      );

      // Increase combo count
      rerender(
        <TrainingEnhancedIntegration {...defaultProps} currentCombo={8} />
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("performance-enhancement")
        ).toBeInTheDocument();
      });
    });
  });

  /**
   * **Business Requirement:** Integration must provide meaningful development
   * and debugging information while remaining production-ready
   */
  describe("Development Integration Features", () => {
    it("should provide development status information when in dev mode", async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      renderWithPixi(
        <TrainingEnhancedIntegration
          {...defaultProps}
          selectedStance={TrigramStance.LI}
          playerArchetype={PlayerArchetype.HACKER}
          trainingMode="advanced"
        />
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("integration-status-debug")
        ).toBeInTheDocument();
        expect(screen.getByTestId("integration-stance")).toBeInTheDocument();
        expect(screen.getByTestId("integration-archetype")).toBeInTheDocument();
        expect(screen.getByTestId("integration-mode")).toBeInTheDocument();
      });

      process.env.NODE_ENV = originalEnv;
    });

    it("should hide debug information in production mode", async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      renderWithPixi(<TrainingEnhancedIntegration {...defaultProps} />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("integration-status-debug")
        ).not.toBeInTheDocument();
      });

      process.env.NODE_ENV = originalEnv;
    });
  });

  /**
   * **Business Requirement:** Integration must handle error states gracefully
   * while maintaining training session stability
   */
  describe("Error Handling", () => {
    it("should handle invalid state changes gracefully", async () => {
      const mockStateChange = vi.fn().mockImplementation(() => {
        throw new Error("State change error");
      });

      // Should not crash the component
      expect(() => {
        renderWithPixi(
          <TrainingEnhancedIntegration
            {...defaultProps}
            onStateChange={mockStateChange}
          />
        );
      }).not.toThrow();
    });

    it("should maintain integration status during rapid state changes", async () => {
      const mockStateChange = vi.fn();
      const { rerender } = renderWithPixi(
        <TrainingEnhancedIntegration
          {...defaultProps}
          onStateChange={mockStateChange}
        />
      );

      // Rapid state changes
      for (let i = 0; i < 5; i++) {
        rerender(
          <TrainingEnhancedIntegration
            {...defaultProps}
            currentCombo={i}
            onStateChange={mockStateChange}
          />
        );
      }

      await waitFor(() => {
        expect(
          screen.getByTestId("training-enhanced-integration")
        ).toBeInTheDocument();
      });
    });
  });
});
