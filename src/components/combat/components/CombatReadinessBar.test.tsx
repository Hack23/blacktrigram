/**
 * CombatReadinessBar Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CombatReadinessBar } from "./CombatReadinessBar";
import { createMockPlayerState } from "../../../test/test-utils";

describe("CombatReadinessBar", () => {
  const defaultProps = {
    player: createMockPlayerState({
      bodyPartHealth: {
        head: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 100,
        legRight: 100,
      },
      pain: 0,
      consciousness: 100,
      balance: 100,
    }),
    playerId: "player-1",
    isMobile: false,
  };

  describe("Rendering", () => {
    it("should render combat readiness bar with correct test ID", () => {
      render(<CombatReadinessBar {...defaultProps} />);
      expect(screen.getByTestId("combat-readiness-bar-player-1")).toBeInTheDocument();
    });

    it("should display Korean and English labels", () => {
      render(<CombatReadinessBar {...defaultProps} />);
      expect(screen.getByText(/전투 준비도.*Combat Readiness/)).toBeInTheDocument();
    });

    it("should display combat readiness percentage", () => {
      render(<CombatReadinessBar {...defaultProps} />);
      const valueElement = screen.getByTestId("combat-readiness-value-player-1");
      expect(valueElement.textContent).toContain("100%");
    });

    it("should render correct number of segments (10)", () => {
      render(<CombatReadinessBar {...defaultProps} />);
      const segments = screen.getAllByTestId(/combat-readiness-segment-player-1-/);
      expect(segments).toHaveLength(10);
    });

    it("should display status label for combat ready state", () => {
      render(<CombatReadinessBar {...defaultProps} />);
      const valueElement = screen.getByTestId("combat-readiness-value-player-1");
      expect(valueElement.textContent).toContain("전투 준비");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA progressbar role", () => {
      render(<CombatReadinessBar {...defaultProps} />);
      const bar = screen.getByTestId("combat-readiness-bar-player-1");
      expect(bar).toHaveAttribute("role", "progressbar");
    });

    it("should have proper ARIA label with Korean and English text", () => {
      render(<CombatReadinessBar {...defaultProps} />);
      const bar = screen.getByTestId("combat-readiness-bar-player-1");
      expect(bar).toHaveAttribute("aria-label", "전투 준비도 | Combat Readiness");
    });

    it("should have correct aria-valuenow attribute", () => {
      render(<CombatReadinessBar {...defaultProps} />);
      const bar = screen.getByTestId("combat-readiness-bar-player-1");
      expect(bar).toHaveAttribute("aria-valuenow", "100");
    });

    it("should have correct aria-valuemin attribute", () => {
      render(<CombatReadinessBar {...defaultProps} />);
      const bar = screen.getByTestId("combat-readiness-bar-player-1");
      expect(bar).toHaveAttribute("aria-valuemin", "0");
    });

    it("should have correct aria-valuemax attribute", () => {
      render(<CombatReadinessBar {...defaultProps} />);
      const bar = screen.getByTestId("combat-readiness-bar-player-1");
      expect(bar).toHaveAttribute("aria-valuemax", "100");
    });

    it("should have readable aria-valuetext", () => {
      render(<CombatReadinessBar {...defaultProps} />);
      const bar = screen.getByTestId("combat-readiness-bar-player-1");
      expect(bar).toHaveAttribute("aria-valuetext");
      const valueText = bar.getAttribute("aria-valuetext");
      expect(valueText).toContain("100%");
      expect(valueText).toContain("Combat Readiness");
    });

    it("should update ARIA attributes when readiness changes", () => {
      const { rerender } = render(<CombatReadinessBar {...defaultProps} />);
      const bar = screen.getByTestId("combat-readiness-bar-player-1");
      expect(bar).toHaveAttribute("aria-valuenow", "100");

      // Update to moderate damage
      const updatedPlayer = createMockPlayerState({
        bodyPartHealth: {
          head: 50,
          torsoUpper: 50,
          torsoLower: 50,
          armLeft: 50,
          armRight: 50,
          legLeft: 50,
          legRight: 50,
        },
        pain: 50,
        consciousness: 50,
        balance: 50,
      });

      rerender(<CombatReadinessBar {...defaultProps} player={updatedPlayer} />);
      expect(bar).toHaveAttribute("aria-valuenow", "50");
    });
  });

  describe("Combat Readiness Colors", () => {
    it("should use green color for readiness >80%", () => {
      const { container } = render(<CombatReadinessBar {...defaultProps} />);
      const segments = container.querySelectorAll('[data-testid*="combat-readiness-segment"]');
      const firstSegment = segments[0] as HTMLElement;
      // Green color (full capability)
      expect(firstSegment.style.backgroundColor).toContain("rgb(0, 255, 0)");
    });

    it("should use yellow color for readiness 60-79%", () => {
      const player = createMockPlayerState({
        bodyPartHealth: {
          head: 70,
          torsoUpper: 70,
          torsoLower: 70,
          armLeft: 70,
          armRight: 70,
          legLeft: 70,
          legRight: 70,
        },
        pain: 30,
        consciousness: 70,
        balance: 70,
      });

      const { container } = render(<CombatReadinessBar {...defaultProps} player={player} />);
      const segments = container.querySelectorAll('[data-testid*="combat-readiness-segment"]');
      const firstSegment = segments[0] as HTMLElement;
      // Yellow color (light impairment)
      expect(firstSegment.style.backgroundColor).toContain("rgb(255, 255, 0)");
    });

    it("should use orange color for readiness 40-59%", () => {
      const player = createMockPlayerState({
        bodyPartHealth: {
          head: 50,
          torsoUpper: 50,
          torsoLower: 50,
          armLeft: 50,
          armRight: 50,
          legLeft: 50,
          legRight: 50,
        },
        pain: 50,
        consciousness: 50,
        balance: 50,
      });

      const { container } = render(<CombatReadinessBar {...defaultProps} player={player} />);
      const segments = container.querySelectorAll('[data-testid*="combat-readiness-segment"]');
      const firstSegment = segments[0] as HTMLElement;
      // Orange color (moderate impairment)
      expect(firstSegment.style.backgroundColor).toContain("rgb(255, 136, 0)");
    });

    it("should use red color for readiness 20-39%", () => {
      const player = createMockPlayerState({
        bodyPartHealth: {
          head: 30,
          torsoUpper: 30,
          torsoLower: 30,
          armLeft: 30,
          armRight: 30,
          legLeft: 30,
          legRight: 30,
        },
        pain: 70,
        consciousness: 30,
        balance: 30,
      });

      const { container } = render(<CombatReadinessBar {...defaultProps} player={player} />);
      const segments = container.querySelectorAll('[data-testid*="combat-readiness-segment"]');
      const firstSegment = segments[0] as HTMLElement;
      // Red color (heavy impairment)
      expect(firstSegment.style.backgroundColor).toContain("rgb(255, 51, 51)");
    });

    it("should use dark red color for readiness <20%", () => {
      const player = createMockPlayerState({
        bodyPartHealth: {
          head: 10,
          torsoUpper: 10,
          torsoLower: 10,
          armLeft: 10,
          armRight: 10,
          legLeft: 10,
          legRight: 10,
        },
        pain: 90,
        consciousness: 10,
        balance: 10,
      });

      const { container } = render(<CombatReadinessBar {...defaultProps} player={player} />);
      const segments = container.querySelectorAll('[data-testid*="combat-readiness-segment"]');
      const firstSegment = segments[0] as HTMLElement;
      // Dark red color (critical)
      expect(firstSegment.style.backgroundColor).toContain("rgb(153, 0, 0)");
    });
  });

  describe("Segment Filling", () => {
    it("should fill all 10 segments at 100% readiness", () => {
      const { container } = render(<CombatReadinessBar {...defaultProps} />);
      const segments = container.querySelectorAll('[data-testid*="combat-readiness-segment"]');
      
      segments.forEach((segment) => {
        const bgColor = (segment as HTMLElement).style.backgroundColor;
        // Should be filled (not dark gray)
        expect(bgColor).not.toContain("rgb(22, 33, 62)");
      });
    });

    it("should fill 5 segments at 50% readiness", () => {
      const player = createMockPlayerState({
        bodyPartHealth: {
          head: 50,
          torsoUpper: 50,
          torsoLower: 50,
          armLeft: 50,
          armRight: 50,
          legLeft: 50,
          legRight: 50,
        },
        pain: 50,
        consciousness: 50,
        balance: 50,
      });

      const { container } = render(<CombatReadinessBar {...defaultProps} player={player} />);
      const segments = container.querySelectorAll('[data-testid*="combat-readiness-segment"]');
      
      // First 5 segments should be filled
      for (let i = 0; i < 5; i++) {
        const bgColor = (segments[i] as HTMLElement).style.backgroundColor;
        expect(bgColor).not.toContain("rgb(22, 33, 62)");
      }
      
      // Last 5 segments should be empty
      for (let i = 5; i < 10; i++) {
        const bgColor = (segments[i] as HTMLElement).style.backgroundColor;
        expect(bgColor).toContain("rgb(22, 33, 62)");
      }
    });

    it("should handle zero readiness correctly", () => {
      const player = createMockPlayerState({
        bodyPartHealth: {
          head: 0,
          torsoUpper: 0,
          torsoLower: 0,
          armLeft: 0,
          armRight: 0,
          legLeft: 0,
          legRight: 0,
        },
        pain: 100,
        consciousness: 0,
        balance: 0,
      });

      render(<CombatReadinessBar {...defaultProps} player={player} />);
      const valueElement = screen.getByTestId("combat-readiness-value-player-1");
      expect(valueElement.textContent).toContain("0%");
    });
  });

  describe("Responsive Sizing", () => {
    it("should use mobile sizing when isMobile is true", () => {
      const { container } = render(<CombatReadinessBar {...defaultProps} isMobile={true} />);
      const bar = container.querySelector('[data-testid="combat-readiness-bar-player-1"]') as HTMLElement;
      expect(bar.style.width).toBe("180px");
    });

    it("should use desktop sizing when isMobile is false", () => {
      const { container } = render(<CombatReadinessBar {...defaultProps} isMobile={false} />);
      const bar = container.querySelector('[data-testid="combat-readiness-bar-player-1"]') as HTMLElement;
      expect(bar.style.width).toBe("250px");
    });
  });

  describe("Pulse Animation", () => {
    it("should apply pulse animation when readiness <20%", () => {
      const player = createMockPlayerState({
        bodyPartHealth: {
          head: 15,
          torsoUpper: 15,
          torsoLower: 15,
          armLeft: 15,
          armRight: 15,
          legLeft: 15,
          legRight: 15,
        },
        pain: 85,
        consciousness: 15,
        balance: 15,
      });

      const { container } = render(<CombatReadinessBar {...defaultProps} player={player} />);
      const segmentContainer = container.querySelector('[data-testid*="combat-readiness-segment"]')?.parentElement;
      expect(segmentContainer?.style.animation).toContain("healthPulse");
    });

    it("should not apply pulse animation when readiness >=20%", () => {
      const player = createMockPlayerState({
        bodyPartHealth: {
          head: 25,
          torsoUpper: 25,
          torsoLower: 25,
          armLeft: 25,
          armRight: 25,
          legLeft: 25,
          legRight: 25,
        },
        pain: 75,
        consciousness: 25,
        balance: 25,
      });

      const { container } = render(<CombatReadinessBar {...defaultProps} player={player} />);
      const segmentContainer = container.querySelector('[data-testid*="combat-readiness-segment"]')?.parentElement;
      expect(segmentContainer?.style.animation).toBe("none");
    });
  });

  describe("Status Labels", () => {
    it("should show 'Combat Ready' label at 100%", () => {
      render(<CombatReadinessBar {...defaultProps} />);
      const valueElement = screen.getByTestId("combat-readiness-value-player-1");
      expect(valueElement.textContent).toContain("전투 준비");
    });

    it("should show appropriate label for different readiness levels", () => {
      const player = createMockPlayerState({
        bodyPartHealth: {
          head: 30,
          torsoUpper: 30,
          torsoLower: 30,
          armLeft: 30,
          armRight: 30,
          legLeft: 30,
          legRight: 30,
        },
        pain: 70,
        consciousness: 30,
        balance: 30,
      });

      render(<CombatReadinessBar {...defaultProps} player={player} />);
      const valueElement = screen.getByTestId("combat-readiness-value-player-1");
      // Should show Korean label for heavy damage
      expect(valueElement.textContent).toContain("중증 손상");
    });
  });

  describe("Real-time Updates", () => {
    it("should update when player state changes", () => {
      const { rerender } = render(<CombatReadinessBar {...defaultProps} />);
      let valueElement = screen.getByTestId("combat-readiness-value-player-1");
      expect(valueElement.textContent).toContain("100%");

      // Simulate taking damage
      const damagedPlayer = createMockPlayerState({
        bodyPartHealth: {
          head: 60,
          torsoUpper: 60,
          torsoLower: 60,
          armLeft: 60,
          armRight: 60,
          legLeft: 60,
          legRight: 60,
        },
        pain: 40,
        consciousness: 60,
        balance: 60,
      });

      rerender(<CombatReadinessBar {...defaultProps} player={damagedPlayer} />);
      valueElement = screen.getByTestId("combat-readiness-value-player-1");
      expect(valueElement.textContent).toContain("60%");
    });
  });

  describe("Fallback Behavior", () => {
    it("should use aggregate health when bodyPartHealth is undefined", () => {
      const player = createMockPlayerState({
        health: 75,
        maxHealth: 100,
        pain: 25,
        consciousness: 75,
        balance: 75,
      });

      // Don't set bodyPartHealth
      const playerWithoutBodyParts = { ...player, bodyPartHealth: undefined };

      render(<CombatReadinessBar {...defaultProps} player={playerWithoutBodyParts} />);
      const valueElement = screen.getByTestId("combat-readiness-value-player-1");
      // Should still calculate readiness
      expect(valueElement.textContent).toMatch(/\d+%/);
    });
  });
});
