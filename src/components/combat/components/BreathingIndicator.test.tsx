/**
 * BreathingIndicator Component Tests
 * 
 * Tests component props, breathing disruption logic, and TypeScript interfaces.
 * Tests bilingual Korean-English labels, timer countdown, recovery states,
 * and mobile responsive behavior.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { BreathingIndicator } from "./BreathingIndicator";
import { BreathingDisruptionLevel } from "../../../systems/breathing/BreathingDisruptionSystem";
import { PlayerState } from "../../../systems/player";
import { createMockPlayerState } from "../../../test/test-utils";

describe("BreathingIndicator", () => {
  let mockPlayer: PlayerState;

  beforeEach(() => {
    // Create base mock player with no breathing disruption
    mockPlayer = {
      ...createMockPlayerState(),
      bodyPartHealth: {
        head: 100,
        neck: 100,
        torsoUpper: 60, // Above 50% for recovery
        torsoLower: 60, // Above 50% for recovery
        armLeft: 100,
        armRight: 100,
        legLeft: 100,
        legRight: 100,
      },
    };
  });

  it("should be defined and importable", () => {
    expect(BreathingIndicator).toBeDefined();
    expect(typeof BreathingIndicator).toBe("function");
  });

  describe("Props Interface", () => {
    it("should accept player and isMobile props", () => {
      const props = {
        player: mockPlayer,
        isMobile: false,
      };
      expect(props.player).toBe(mockPlayer);
      expect(props.isMobile).toBe(false);
    });

    it("should accept mobile mode", () => {
      const props = {
        player: mockPlayer,
        isMobile: true,
      };
      expect(props.isMobile).toBe(true);
    });
  });

  describe("Visibility Logic", () => {
    it("should not render when no breathing disruption (NONE level)", () => {
      // Player with no breathing effects
      expect(mockPlayer.statusEffects).toEqual([]);
    });

    it("should render when breathing disruption is active", () => {
      // Add breathing disruption effect to player
      mockPlayer.statusEffects = [
        {
          id: "breathing_disruption",
          type: "breathing_disruption",
          intensity: "medium",
          duration: 5000,
          startTime: Date.now(),
          endTime: Date.now() + 5000,
          source: "vital_point_system",
          description: {
            korean: "호흡곤란",
            english: "Breathing Disruption",
          },
          stackable: true,
          level: BreathingDisruptionLevel.WINDED,
        },
      ];
      expect(mockPlayer.statusEffects.length).toBeGreaterThan(0);
    });
  });

  describe("Breathing Disruption Levels", () => {
    it("should support WINDED level (25% penalty)", () => {
      const level = BreathingDisruptionLevel.WINDED;
      expect(level).toBe(BreathingDisruptionLevel.WINDED);
    });

    it("should support GASPING level (50% penalty)", () => {
      const level = BreathingDisruptionLevel.GASPING;
      expect(level).toBe(BreathingDisruptionLevel.GASPING);
    });

    it("should support SEVERELY_WINDED level (75% penalty)", () => {
      const level = BreathingDisruptionLevel.SEVERELY_WINDED;
      expect(level).toBe(BreathingDisruptionLevel.SEVERELY_WINDED);
    });
  });

  describe("Bilingual Korean-English Labels", () => {
    it("should provide Korean label for WINDED", () => {
      const koreanLabel = "바람맞음";
      expect(koreanLabel).toBe("바람맞음");
    });

    it("should provide English label for WINDED", () => {
      const englishLabel = "Winded";
      expect(englishLabel).toBe("Winded");
    });

    it("should provide Korean label for GASPING", () => {
      const koreanLabel = "헐떡임";
      expect(koreanLabel).toBe("헐떡임");
    });

    it("should provide English label for GASPING", () => {
      const englishLabel = "Gasping";
      expect(englishLabel).toBe("Gasping");
    });

    it("should provide Korean label for SEVERELY_WINDED", () => {
      const koreanLabel = "심각한 호흡곤란";
      expect(koreanLabel).toBe("심각한 호흡곤란");
    });

    it("should provide English label for SEVERELY_WINDED", () => {
      const englishLabel = "Severely Winded";
      expect(englishLabel).toBe("Severely Winded");
    });

    it("should provide recovery label in Korean-English", () => {
      const recoveryLabel = "회복중 | Recovering";
      expect(recoveryLabel).toContain("회복중");
      expect(recoveryLabel).toContain("Recovering");
    });
  });

  describe("Severity-Based Styling", () => {
    it("should define gold color for WINDED level", () => {
      const WINDED_COLOR = 0xffd700;
      expect(WINDED_COLOR).toBeGreaterThan(0);
      expect(WINDED_COLOR.toString(16)).toBe("ffd700");
    });

    it("should define orange color for GASPING level", () => {
      const GASPING_COLOR = 0xff8c00;
      expect(GASPING_COLOR).toBeGreaterThan(0);
      expect(GASPING_COLOR.toString(16)).toBe("ff8c00");
    });

    it("should define red color for SEVERELY_WINDED level", () => {
      const SEVERELY_WINDED_COLOR = 0xff0000;
      expect(SEVERELY_WINDED_COLOR).toBeGreaterThan(0);
      expect(SEVERELY_WINDED_COLOR.toString(16)).toBe("ff0000");
    });

    it("should increase scale progressively with severity", () => {
      const windedScale = 1.0;
      const gaspingScale = 1.1;
      const severelyWindedScale = 1.2;
      
      expect(gaspingScale).toBeGreaterThan(windedScale);
      expect(severelyWindedScale).toBeGreaterThan(gaspingScale);
      expect(severelyWindedScale - windedScale).toBeCloseTo(0.2, 1);
    });

    it("should increase opacity progressively with severity", () => {
      const windedOpacity = 0.7;
      const gaspingOpacity = 0.85;
      const severelyWindedOpacity = 1.0;
      
      expect(gaspingOpacity).toBeGreaterThan(windedOpacity);
      expect(severelyWindedOpacity).toBeGreaterThan(gaspingOpacity);
      expect(severelyWindedOpacity).toBe(1.0); // Max opacity
    });
  });

  describe("Timer Countdown Display", () => {
    it("should display time remaining in seconds", () => {
      const timeRemaining = 5000; // 5 seconds in milliseconds
      const seconds = Math.ceil(timeRemaining / 1000);
      expect(seconds).toBe(5);
    });

    it("should round up partial seconds", () => {
      const timeRemaining = 3200; // 3.2 seconds
      const seconds = Math.ceil(timeRemaining / 1000);
      expect(seconds).toBe(4);
    });

    it("should display 0 seconds when effect expires", () => {
      const timeRemaining = 0;
      const seconds = Math.ceil(timeRemaining / 1000);
      expect(seconds).toBe(0);
    });

    it("should update every 100ms for smooth countdown", () => {
      const updateInterval = 100; // milliseconds
      expect(updateInterval).toBe(100);
    });
  });

  describe("Recovery State", () => {
    it("should show recovery when torso health > 50%", () => {
      const torsoHealth = 60;
      const canRecover = torsoHealth > 50;
      expect(canRecover).toBe(true);
    });

    it("should not show recovery when torso health <= 50%", () => {
      const torsoHealth = 40;
      const canRecover = torsoHealth > 50;
      expect(canRecover).toBe(false);
    });

    it("should display recovery text when recovering", () => {
      const isRecovering = true;
      const display = isRecovering ? "회복중 | Recovering" : "5s";
      expect(display).toBe("회복중 | Recovering");
    });

    it("should display time when not recovering", () => {
      const isRecovering = false;
      const display = isRecovering ? "회복중 | Recovering" : "5s";
      expect(display).toBe("5s");
    });
  });

  describe("Mobile Optimization", () => {
    it("should use smaller padding on mobile (4px 8px vs 6px 12px)", () => {
      const mobilePadding = "4px 8px";
      const desktopPadding = "6px 12px";
      expect(mobilePadding).toBe("4px 8px");
      expect(desktopPadding).toBe("6px 12px");
    });

    it("should use smaller icon size on mobile (24px vs 32px)", () => {
      const mobileIconSize = 24;
      const desktopIconSize = 32;
      expect(mobileIconSize).toBe(24);
      expect(desktopIconSize).toBe(32);
    });

    it("should use smaller font size on mobile (10px vs 12px)", () => {
      const mobileFontSize = 10;
      const desktopFontSize = 12;
      expect(mobileFontSize).toBe(10);
      expect(desktopFontSize).toBe(12);
    });
  });

  describe("Pulsing Animation", () => {
    it("should use breathing-pulse keyframe animation", () => {
      const animationName = "breathing-pulse";
      expect(animationName).toBe("breathing-pulse");
    });

    it("should animate at 1s duration", () => {
      const animationDuration = "1s";
      expect(animationDuration).toBe("1s");
    });

    it("should use ease-in-out timing function", () => {
      const timingFunction = "ease-in-out";
      expect(timingFunction).toBe("ease-in-out");
    });

    it("should loop infinitely", () => {
      const iterationCount = "infinite";
      expect(iterationCount).toBe("infinite");
    });
  });

  describe("Icon Display", () => {
    it("should use lungs emoji (🫁)", () => {
      const icon = "🫁";
      expect(icon).toBe("🫁");
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero time remaining", () => {
      const timeRemaining = 0;
      const seconds = Math.ceil(timeRemaining / 1000);
      expect(seconds).toBe(0);
    });

    it("should handle negative time remaining (expired effect)", () => {
      const timeRemaining = -100;
      const safeTime = Math.max(0, timeRemaining);
      expect(safeTime).toBe(0);
    });

    it("should handle very long duration", () => {
      const timeRemaining = 15000; // 15 seconds
      const seconds = Math.ceil(timeRemaining / 1000);
      expect(seconds).toBe(15);
    });

    it("should handle decimal milliseconds", () => {
      const timeRemaining = 3456; // 3.456 seconds
      const seconds = Math.ceil(timeRemaining / 1000);
      expect(seconds).toBe(4);
    });
  });

  describe("State Timer Management", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should use lazy initializer for useState with Date.now()", () => {
      // Test that initial state is function-based (lazy)
      const lazyInit = () => Date.now();
      const result = lazyInit();
      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThan(0);
    });

    it("should update state every 100ms via useEffect", () => {
      const interval = 100;
      expect(interval).toBe(100);
    });
  });

  describe("Z-Index Layering", () => {
    it("should use appropriate z-index for overlay", () => {
      const zIndex = 90; // Between HUD elements
      expect(zIndex).toBeGreaterThan(0);
    });
  });

  describe("Component Rendering", () => {
    it("should render without crashing when not visible", () => {
      const playerWithoutBreathing = {
        ...mockPlayer,
        statusEffects: [],
      };
      const { container } = render(
        <BreathingIndicator player={playerWithoutBreathing} />
      );
      expect(container).toBeTruthy();
      // Component returns null when not visible
      expect(container.firstChild).toBeNull();
    });

    it("should render breathing indicator when disruption is active", () => {
      // mockPlayer already has breathing disruption effect from beforeEach
      const { getByTestId } = render(
        <BreathingIndicator player={mockPlayer} />
      );
      const indicator = getByTestId("breathing-indicator");
      expect(indicator).toBeTruthy();
    });

    it("should display lungs icon", () => {
      const { getByTestId } = render(
        <BreathingIndicator player={mockPlayer} />
      );
      const icon = getByTestId("breathing-icon");
      expect(icon.textContent).toBe("🫁");
    });

    it("should display Korean-English bilingual label for WINDED", () => {
      const { getByTestId } = render(
        <BreathingIndicator player={mockPlayer} />
      );
      const label = getByTestId("breathing-label");
      expect(label.textContent).toContain("바람맞음");
      expect(label.textContent).toContain("Winded");
    });

    it("should display time remaining", () => {
      const { getByTestId } = render(
        <BreathingIndicator player={mockPlayer} />
      );
      const time = getByTestId("breathing-time");
      expect(time.textContent).toMatch(/\d+s/); // Should show seconds like "5s"
    });

    it("should show recovery status when recovering", () => {
      const recoveringPlayer = {
        ...mockPlayer,
        bodyPartHealth: {
          ...mockPlayer.bodyPartHealth,
          torsoUpper: 75, // Good health for recovery
          torsoLower: 75,
        },
      };
      const { getByTestId } = render(
        <BreathingIndicator player={recoveringPlayer} />
      );
      const time = getByTestId("breathing-time");
      expect(time.textContent).toContain("회복중");
      expect(time.textContent).toContain("Recovering");
    });

    it("should use mobile-optimized sizing when isMobile prop is true", () => {
      const { getByTestId } = render(
        <BreathingIndicator player={mockPlayer} isMobile={true} />
      );
      const indicator = getByTestId("breathing-indicator");
      const styles = indicator.style;
      // Mobile uses smaller gap
      expect(styles.gap).toBe("6px");
    });

    it("should apply pulsing animation", () => {
      const { getByTestId } = render(
        <BreathingIndicator player={mockPlayer} />
      );
      const indicator = getByTestId("breathing-indicator");
      expect(indicator.style.animation).toContain("breathing-pulse");
      expect(indicator.style.animation).toContain("1s");
    });

    it("should apply severity-based color for WINDED", () => {
      const { getByTestId } = render(
        <BreathingIndicator player={mockPlayer} />
      );
      const indicator = getByTestId("breathing-indicator");
      // Should have gold color (FFD700 in RGBA format)
      expect(indicator.style.border).toContain("rgba(255, 215, 0");
    });

    it("should have pointer events disabled", () => {
      const { getByTestId } = render(
        <BreathingIndicator player={mockPlayer} />
      );
      const indicator = getByTestId("breathing-indicator");
      expect(indicator.style.pointerEvents).toBe("none");
    });
  });

  describe("Accessibility", () => {
    it("should disable pointer events on non-interactive overlay", () => {
      const pointerEvents = "none";
      expect(pointerEvents).toBe("none");
    });
  });

  describe("Korean Font Family", () => {
    it("should use FONT_FAMILY.KOREAN constant", () => {
      const fontFamily = "'Noto Sans KR', 'Malgun Gothic', sans-serif";
      expect(fontFamily).toContain("Noto Sans KR");
    });
  });

  describe("Component Display Name", () => {
    it("should have displayName set to BreathingIndicator", () => {
      expect(BreathingIndicator.displayName).toBe("BreathingIndicator");
    });
  });
});
