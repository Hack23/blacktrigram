import { screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { renderWithPixi } from "../../../../test/test-utils";
import { TrainingStatisticsPanel } from "./TrainingStatisticsPanel";
import { TrigramStance } from "../../../../types/enums";
import type { TrainingStatistics } from "./types/training";

const mockStats: TrainingStatistics = {
  attempts: 10,
  techniquesExecuted: 8,
  perfectStrikes: 3,
  criticalHits: 2,
  totalDamage: 150,
  sessionTime: 120, // 2 minutes
  accuracy: 75,
  averageDamage: 18.75,
  bestCombo: 4,
  stanceChanges: 5,
};

const defaultProps = {
  stats: mockStats,
  currentCombo: 2,
  selectedStance: TrigramStance.GEON,
  maxAttempts: 20,
  x: 100,
  y: 100,
  width: 300,
  height: 250,
  screenWidth: 1200,
  screenHeight: 800,
  isMobile: false,
};

const renderTrainingStatisticsPanel = (props = {}) => {
  return renderWithPixi(
    <TrainingStatisticsPanel {...defaultProps} {...props} />
  );
};

describe("TrainingStatisticsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render all essential statistics", () => {
      renderTrainingStatisticsPanel();

      expect(screen.getByTestId("training-stats-panel")).toBeInTheDocument();
      expect(screen.getByTestId("stats-container")).toBeInTheDocument();
      expect(screen.getByTestId("attempts-count")).toBeInTheDocument();
      expect(screen.getByTestId("accuracy-display")).toBeInTheDocument();
      expect(screen.getByTestId("perfect-strikes-count")).toBeInTheDocument();
      expect(screen.getByTestId("critical-hits-count")).toBeInTheDocument();
      expect(screen.getByTestId("total-damage-display")).toBeInTheDocument();
    });

    it("should display correct Korean and English text", () => {
      renderTrainingStatisticsPanel();

      const attemptsText = screen.getByTestId("attempts-count");
      expect(attemptsText.getAttribute("text")).toBe("시도: 10/20");

      const accuracyText = screen.getByTestId("accuracy-display");
      expect(accuracyText.getAttribute("text")).toBe("정확도: 75% - 精確度");

      const perfectStrikesText = screen.getByTestId("perfect-strikes-count");
      expect(perfectStrikesText.getAttribute("text")).toBe(
        "완벽한 타격: 3 - 完璧打"
      );
    });

    it("should show current stance information", () => {
      renderTrainingStatisticsPanel({ selectedStance: TrigramStance.TAE });

      const stanceText = screen.getByTestId("current-stance-display");
      expect(stanceText.getAttribute("text")).toContain("태");
      expect(stanceText.getAttribute("text")).toContain("TAE");
    });
  });

  describe("Accuracy Display", () => {
    it("should use green color for high accuracy", () => {
      renderTrainingStatisticsPanel({
        stats: { ...mockStats, accuracy: 85 },
      });

      const accuracyText = screen.getByTestId("accuracy-display");
      const textStyle = accuracyText.getAttribute("style");
      expect(textStyle).toContain("0x2ECC40"); // POSITIVE_GREEN
    });

    it("should use red color for low accuracy", () => {
      renderTrainingStatisticsPanel({
        stats: { ...mockStats, accuracy: 30 },
      });

      const accuracyText = screen.getByTestId("accuracy-display");
      const textStyle = accuracyText.getAttribute("style");
      expect(textStyle).toContain("0xFF4136"); // ACCENT_RED
    });

    it("should render accuracy bar correctly", () => {
      renderTrainingStatisticsPanel();

      expect(screen.getByTestId("accuracy-bar")).toBeInTheDocument();
    });
  });

  describe("Combat Statistics", () => {
    it("should display critical hits correctly", () => {
      renderTrainingStatisticsPanel();

      const criticalText = screen.getByTestId("critical-hits-count");
      expect(criticalText.getAttribute("text")).toBe("치명타: 2 - 致命打");
    });

    it("should display total damage correctly", () => {
      renderTrainingStatisticsPanel();

      const damageText = screen.getByTestId("total-damage-display");
      expect(damageText.getAttribute("text")).toBe("총 데미지: 150 - 總損傷");
    });

    it("should display session time in correct format", () => {
      renderTrainingStatisticsPanel();

      const timeText = screen.getByTestId("session-time");
      expect(timeText.getAttribute("text")).toBe("세션 시간: 2:00");
    });
  });

  describe("Combo Display", () => {
    it("should highlight current combo when > 3", () => {
      renderTrainingStatisticsPanel({ currentCombo: 5 });

      const comboContainer = screen.getByTestId("current-combo-container");
      expect(comboContainer).toBeInTheDocument();

      const comboText = screen.getByTestId("current-combo-display");
      expect(comboText.getAttribute("text")).toBe("현재 연속: 5회 - 現在連續");
    });

    it("should not highlight combo when <= 3", () => {
      renderTrainingStatisticsPanel({ currentCombo: 2 });

      const comboText = screen.getByTestId("current-combo-display");
      const style = comboText.getAttribute("style");
      expect(style).not.toContain("bold");
    });

    it("should display best combo", () => {
      renderTrainingStatisticsPanel();

      const bestComboText = screen.getByTestId("best-combo-display");
      expect(bestComboText.getAttribute("text")).toBe(
        "최고 연속: 4회 - 最高連續"
      );
    });
  });

  describe("Feedback Messages", () => {
    it("should show appropriate feedback for high accuracy", () => {
      renderTrainingStatisticsPanel({
        stats: { ...mockStats, accuracy: 85 },
      });

      const feedbackText = screen.getByTestId("feedback-message");
      expect(feedbackText.getAttribute("text")).toBe("훌륭한 실력입니다!");
    });

    it("should show appropriate feedback for low accuracy", () => {
      renderTrainingStatisticsPanel({
        stats: { ...mockStats, accuracy: 25 },
      });

      const feedbackText = screen.getByTestId("feedback-message");
      expect(feedbackText.getAttribute("text")).toBe(
        "기본기부터 다시 시작하세요."
      );
    });

    it("should show encouragement for new training", () => {
      renderTrainingStatisticsPanel({
        stats: { ...mockStats, attempts: 0 },
      });

      const feedbackText = screen.getByTestId("feedback-message");
      expect(feedbackText.getAttribute("text")).toBe("계속 연습하세요!");
    });
  });

  describe("Mobile Responsiveness", () => {
    it("should adjust layout for mobile", () => {
      renderTrainingStatisticsPanel({ isMobile: true });

      const attemptsText = screen.getByTestId("attempts-count");
      const style = attemptsText.getAttribute("style");
      expect(style).toContain("fontSize: 9");
    });

    it("should adjust layout for desktop", () => {
      renderTrainingStatisticsPanel({ isMobile: false });

      const attemptsText = screen.getByTestId("attempts-count");
      const style = attemptsText.getAttribute("style");
      expect(style).toContain("fontSize: 11");
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero statistics gracefully", () => {
      const zeroStats: TrainingStatistics = {
        attempts: 0,
        techniquesExecuted: 0,
        perfectStrikes: 0,
        criticalHits: 0,
        totalDamage: 0,
        sessionTime: 0,
        accuracy: 0,
        averageDamage: 0,
        bestCombo: 0,
        stanceChanges: 0,
      };

      renderTrainingStatisticsPanel({ stats: zeroStats });

      const attemptsText = screen.getByTestId("attempts-count");
      expect(attemptsText.getAttribute("text")).toBe("시도: 0/20");

      const accuracyText = screen.getByTestId("accuracy-display");
      expect(accuracyText.getAttribute("text")).toBe("정확도: 0% - 精確度");
    });

    it("should handle very high statistics", () => {
      const highStats: TrainingStatistics = {
        attempts: 1000,
        techniquesExecuted: 950,
        perfectStrikes: 800,
        criticalHits: 300,
        totalDamage: 25000,
        sessionTime: 3600, // 1 hour
        accuracy: 95,
        averageDamage: 26.3,
        bestCombo: 50,
        stanceChanges: 200,
      };

      renderTrainingStatisticsPanel({
        stats: highStats,
        maxAttempts: 1000,
        currentCombo: 25,
      });

      const timeText = screen.getByTestId("session-time");
      expect(timeText.getAttribute("text")).toBe("세션 시간: 60:00");

      const comboText = screen.getByTestId("current-combo-display");
      expect(comboText.getAttribute("text")).toBe("현재 연속: 25회 - 現在連續");
    });
  });

  describe("Stance Integration", () => {
    it.each([
      [TrigramStance.GEON, "건"],
      [TrigramStance.TAE, "태"],
      [TrigramStance.LI, "리"],
      [TrigramStance.JIN, "진"],
      [TrigramStance.SON, "손"],
      [TrigramStance.GAM, "감"],
      [TrigramStance.GAN, "간"],
      [TrigramStance.GON, "곤"],
    ])(
      "should display correct Korean name for stance %s",
      (stance, expectedKorean) => {
        renderTrainingStatisticsPanel({ selectedStance: stance });

        const stanceText = screen.getByTestId("current-stance-display");
        expect(stanceText.getAttribute("text")).toContain(expectedKorean);
        expect(stanceText.getAttribute("text")).toContain(stance);
      }
    );
  });

  describe("Data-testid Coverage", () => {
    it("should have all required test IDs", () => {
      renderTrainingStatisticsPanel();

      const requiredTestIds = [
        "training-stats-panel",
        "stats-container",
        "attempts-count",
        "accuracy-display",
        "accuracy-bar",
        "perfect-strikes-count",
        "critical-hits-count",
        "total-damage-display",
        "average-damage-display",
        "best-combo-display",
        "session-time",
        "current-combo-container",
        "current-combo-display",
        "current-stance-display",
        "feedback-container",
        "feedback-message",
        "korean-grade-display", // Added test ID for Korean martial arts grading
      ];

      requiredTestIds.forEach((testId) => {
        expect(screen.getByTestId(testId)).toBeInTheDocument();
      });
    });
  });

  /**
   * ## Training Statistics Panel Test Suite
   *
   * **Business Purpose:**
   * Validates the statistics display that provides Korean martial arts performance
   * tracking and progress visualization for training sessions.
   *
   * @since 0.2.5
   * @author Black Trigram Development Team
   */
  describe("TrainingStatisticsPanel", () => {
    const mockStats = {
      attempts: 10,
      hits: 7,
      perfectStrikes: 3,
      accuracy: 70,
      sessionTime: 120,
      experienceGained: 150,
    };

    const defaultProps = {
      stats: mockStats,
      currentCombo: 2,
      selectedStance: TrigramStance.GEON,
      maxAttempts: 20,
      x: 100,
      y: 100,
      width: 300,
      height: 200,
      screenWidth: 1200,
      screenHeight: 800,
      isMobile: false,
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should render statistics correctly", () => {
      renderWithPixi(<TrainingStatisticsPanel {...defaultProps} />);

      expect(screen.getByTestId("training-statistics")).toBeInTheDocument();
      expect(screen.getByTestId("attempts-count")).toBeInTheDocument();
      expect(screen.getByTestId("accuracy-display")).toBeInTheDocument();
    });

    it("should display Korean martial arts grading", () => {
      renderWithPixi(<TrainingStatisticsPanel {...defaultProps} />);

      const gradeDisplay = screen.getByTestId("korean-grade-display");
      expect(gradeDisplay).toBeInTheDocument();
    });

    it("should adapt to mobile layout", () => {
      renderWithPixi(
        <TrainingStatisticsPanel {...defaultProps} isMobile={true} />
      );

      expect(screen.getByTestId("training-statistics")).toBeInTheDocument();
      // Mobile layout should still show essential stats
      expect(screen.getByTestId("attempts-count")).toBeInTheDocument();
    });
  });
});
