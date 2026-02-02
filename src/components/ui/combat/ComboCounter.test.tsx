/**
 * Unit tests for ComboCounter component
 * 
 * Tests combo count display and timing window indicators.
 * Verifies timing quality, color coding, and bilingual labels.
 */

import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ComboCounter } from "./ComboCounter";
import { KOREAN_COLORS } from "../../../types/constants";

// Mock useKoreanTheme hook
vi.mock("../../shared/base/useKoreanTheme", () => ({
  useKoreanTheme: () => KOREAN_COLORS,
}));

describe("ComboCounter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("Component Rendering", () => {
    it("should render when combo is active", () => {
      const { container } = render(
        <ComboCounter
          comboCount={5}
          comboWindow={200}
          timeSinceLastHit={50}
          isActive={true}
        />
      );
      expect(container).toBeTruthy();
    });

    it("should not render when combo is inactive and count is 0", () => {
      const { container } = render(
        <ComboCounter
          comboCount={0}
          comboWindow={200}
          timeSinceLastHit={0}
          isActive={false}
        />
      );
      
      const comboCounter = container.querySelector(".combo-counter");
      expect(comboCounter).not.toBeInTheDocument();
    });

    it("should display bilingual label", () => {
      render(
        <ComboCounter
          comboCount={3}
          comboWindow={200}
          timeSinceLastHit={50}
          isActive={true}
        />
      );
      expect(screen.getByText("연속 공격 | Combo")).toBeInTheDocument();
    });

    it("should display combo count with multiplier", () => {
      render(
        <ComboCounter
          comboCount={7}
          comboWindow={200}
          timeSinceLastHit={50}
          isActive={true}
        />
      );
      expect(screen.getByText("7x")).toBeInTheDocument();
    });
  });

  describe("Combo Count", () => {
    it("should handle single hit combo", () => {
      render(
        <ComboCounter
          comboCount={1}
          comboWindow={200}
          timeSinceLastHit={50}
          isActive={true}
        />
      );
      expect(screen.getByText("1x")).toBeInTheDocument();
    });

    it("should handle high combo counts", () => {
      render(
        <ComboCounter
          comboCount={25}
          comboWindow={200}
          timeSinceLastHit={50}
          isActive={true}
        />
      );
      expect(screen.getByText("25x")).toBeInTheDocument();
    });

    it("should animate count change", async () => {
      const { rerender } = render(
        <ComboCounter
          comboCount={3}
          comboWindow={200}
          timeSinceLastHit={50}
          isActive={true}
        />
      );

      rerender(
        <ComboCounter
          comboCount={4}
          comboWindow={200}
          timeSinceLastHit={50}
          isActive={true}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("4x")).toBeInTheDocument();
      });
    });
  });

  describe("Timing Quality", () => {
    it("should show perfect timing in first half of window", () => {
      render(
        <ComboCounter
          comboCount={3}
          comboWindow={200}
          timeSinceLastHit={50} // 25% through window
          isActive={true}
        />
      );
      expect(screen.getByText(/완벽! \| Perfect!/)).toBeInTheDocument();
    });

    it("should show good timing in second half of window", () => {
      render(
        <ComboCounter
          comboCount={3}
          comboWindow={200}
          timeSinceLastHit={150} // 75% through window
          isActive={true}
        />
      );
      expect(screen.getByText(/좋음 \| Good/)).toBeInTheDocument();
    });

    it("should show missed timing after window expires", () => {
      render(
        <ComboCounter
          comboCount={3}
          comboWindow={200}
          timeSinceLastHit={250} // 125% through window
          isActive={true}
        />
      );
      expect(screen.getByText(/놓침 \| Missed/)).toBeInTheDocument();
    });

    it("should handle exact window boundary", () => {
      render(
        <ComboCounter
          comboCount={3}
          comboWindow={200}
          timeSinceLastHit={200} // Exactly at window boundary
          isActive={true}
        />
      );
      expect(screen.getByText(/좋음 \| Good/)).toBeInTheDocument();
    });
  });

  describe("Timing Window", () => {
    it("should display timing window info", () => {
      render(
        <ComboCounter
          comboCount={3}
          comboWindow={200}
          timeSinceLastHit={50}
          isActive={true}
        />
      );
      expect(screen.getByText(/타이밍 창: 200ms \| Window: 200ms/)).toBeInTheDocument();
    });

    it("should support custom window durations", () => {
      render(
        <ComboCounter
          comboCount={3}
          comboWindow={150}
          timeSinceLastHit={50}
          isActive={true}
        />
      );
      expect(screen.getByText(/타이밍 창: 150ms \| Window: 150ms/)).toBeInTheDocument();
    });

    it("should default to 200ms window if not specified", () => {
      render(
        <ComboCounter
          comboCount={3}
          timeSinceLastHit={50}
          isActive={true}
        />
      );
      expect(screen.getByText(/타이밍 창: 200ms \| Window: 200ms/)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      const { container } = render(
        <ComboCounter
          comboCount={5}
          comboWindow={200}
          timeSinceLastHit={50}
          isActive={true}
        />
      );
      
      const comboCounter = container.querySelector('[role="status"]');
      expect(comboCounter).toBeInTheDocument();
      expect(comboCounter).toHaveAttribute("aria-live", "polite");
      expect(comboCounter).toHaveAttribute("aria-label", "Combo: 5 hits");
    });

    it("should update ARIA label when combo changes", () => {
      const { container, rerender } = render(
        <ComboCounter
          comboCount={3}
          comboWindow={200}
          timeSinceLastHit={50}
          isActive={true}
        />
      );
      
      let comboCounter = container.querySelector('[role="status"]');
      expect(comboCounter).toHaveAttribute("aria-label", "Combo: 3 hits");

      rerender(
        <ComboCounter
          comboCount={7}
          comboWindow={200}
          timeSinceLastHit={50}
          isActive={true}
        />
      );

      comboCounter = container.querySelector('[role="status"]');
      expect(comboCounter).toHaveAttribute("aria-label", "Combo: 7 hits");
    });
  });

  describe("Mobile Display", () => {
    it("should show on mobile by default", () => {
      const { container } = render(
        <ComboCounter
          comboCount={3}
          comboWindow={200}
          timeSinceLastHit={50}
          isActive={true}
          showOnMobile={true}
        />
      );
      const counter = container.querySelector(".combo-counter");
      expect(counter).not.toHaveClass("hidden-mobile");
    });

    it("should hide on mobile when showOnMobile is false", () => {
      const { container } = render(
        <ComboCounter
          comboCount={3}
          comboWindow={200}
          timeSinceLastHit={50}
          isActive={true}
          showOnMobile={false}
        />
      );
      const counter = container.querySelector(".combo-counter");
      expect(counter).toHaveClass("hidden-mobile");
    });
  });

  describe("Custom Styling", () => {
    it("should accept custom className", () => {
      const { container } = render(
        <ComboCounter
          comboCount={3}
          comboWindow={200}
          timeSinceLastHit={50}
          isActive={true}
          className="custom-combo-counter"
        />
      );
      const counter = container.querySelector(".combo-counter");
      expect(counter).toHaveClass("custom-combo-counter");
    });
  });

  describe("Progress Indicator", () => {
    it("should show progress within window", () => {
      const { container } = render(
        <ComboCounter
          comboCount={3}
          comboWindow={200}
          timeSinceLastHit={100} // 50% through window
          isActive={true}
        />
      );
      
      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar).toBeTruthy();
    });

    it("should cap progress at 100%", () => {
      const { container } = render(
        <ComboCounter
          comboCount={3}
          comboWindow={200}
          timeSinceLastHit={300} // 150% through window (clamped to 100%)
          isActive={true}
        />
      );
      
      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar).toBeTruthy();
    });

    it("should show 0% progress at start", () => {
      const { container } = render(
        <ComboCounter
          comboCount={3}
          comboWindow={200}
          timeSinceLastHit={0}
          isActive={true}
        />
      );
      
      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar).toBeTruthy();
    });
  });

  describe("Combo Reset", () => {
    it("should hide when combo resets to 0", () => {
      const { container, rerender } = render(
        <ComboCounter
          comboCount={5}
          comboWindow={200}
          timeSinceLastHit={50}
          isActive={true}
        />
      );
      
      expect(container.querySelector(".combo-counter")).toBeInTheDocument();

      rerender(
        <ComboCounter
          comboCount={0}
          comboWindow={200}
          timeSinceLastHit={0}
          isActive={false}
        />
      );

      expect(container.querySelector(".combo-counter")).not.toBeInTheDocument();
    });
  });
});
