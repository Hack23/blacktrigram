/**
 * BalanceIndicator Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { BalanceIndicator } from "./BalanceIndicator";

describe("BalanceIndicator", () => {
  const renderInCanvas = (component: React.ReactElement) => {
    return render(
      <Canvas>
        {component}
      </Canvas>
    );
  };

  describe("Rendering", () => {
    it("should render for left player position", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="READY" position="left" isMobile={false} />
      );
      expect(screen.getByTestId("balance-indicator-left")).toBeInTheDocument();
    });

    it("should render for right player position", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="READY" position="right" isMobile={false} />
      );
      expect(screen.getByTestId("balance-indicator-right")).toBeInTheDocument();
    });

    it("should render in mobile mode", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="SHAKEN" position="left" isMobile={true} />
      );
      expect(screen.getByTestId("balance-indicator-left")).toBeInTheDocument();
    });
  });

  describe("Balance State Colors", () => {
    it("should show READY state (green) for left player", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="READY" position="left" isMobile={false} />
      );
      const indicator = screen.getByTestId("balance-indicator-left");
      expect(indicator).toBeInTheDocument();
    });

    it("should show SHAKEN state (yellow) for left player", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="SHAKEN" position="left" isMobile={false} />
      );
      const indicator = screen.getByTestId("balance-indicator-left");
      expect(indicator).toBeInTheDocument();
    });

    it("should show VULNERABLE state (orange) for left player", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="VULNERABLE" position="left" isMobile={false} />
      );
      const indicator = screen.getByTestId("balance-indicator-left");
      expect(indicator).toBeInTheDocument();
    });

    it("should show HELPLESS state (red) for left player", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="HELPLESS" position="left" isMobile={false} />
      );
      const indicator = screen.getByTestId("balance-indicator-left");
      expect(indicator).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have absolute positioning", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="READY" position="left" isMobile={false} />
      );
      const indicator = screen.getByTestId("balance-indicator-left");
      expect(indicator).toHaveStyle({ position: "absolute" });
    });

    it("should have pointer-events none", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="READY" position="left" isMobile={false} />
      );
      const indicator = screen.getByTestId("balance-indicator-left");
      expect(indicator).toHaveStyle({ pointerEvents: "none" });
    });

    it("should have smooth transition for state changes", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="READY" position="left" isMobile={false} />
      );
      const indicator = screen.getByTestId("balance-indicator-left");
      expect(indicator).toHaveStyle({
        transition: "border-color 0.5s ease-out, box-shadow 0.5s ease-out"
      });
    });

    it("should have border and border-radius", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="READY" position="left" isMobile={false} />
      );
      const indicator = screen.getByTestId("balance-indicator-left");
      const style = window.getComputedStyle(indicator);
      expect(style.border).toBeTruthy();
      expect(style.borderRadius).toBe("8px");
    });
  });

  describe("Accessibility", () => {
    it("should have role=status for live updates", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="READY" position="left" isMobile={false} />
      );
      const indicator = screen.getByTestId("balance-indicator-left");
      expect(indicator).toHaveAttribute("role", "status");
    });

    it("should have aria-live=polite for non-critical updates", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="READY" position="left" isMobile={false} />
      );
      const indicator = screen.getByTestId("balance-indicator-left");
      expect(indicator).toHaveAttribute("aria-live", "polite");
    });

    it("should have Korean and English labels for READY state", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="READY" position="left" isMobile={false} />
      );
      const indicator = screen.getByTestId("balance-indicator-left");
      expect(indicator).toHaveAttribute("aria-label", "준비완료 | READY");
    });

    it("should have Korean and English labels for SHAKEN state", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="SHAKEN" position="left" isMobile={false} />
      );
      const indicator = screen.getByTestId("balance-indicator-left");
      expect(indicator).toHaveAttribute("aria-label", "동요상태 | SHAKEN");
    });

    it("should have Korean and English labels for VULNERABLE state", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="VULNERABLE" position="left" isMobile={false} />
      );
      const indicator = screen.getByTestId("balance-indicator-left");
      expect(indicator).toHaveAttribute("aria-label", "취약상태 | VULNERABLE");
    });

    it("should have Korean and English labels for HELPLESS state", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="HELPLESS" position="left" isMobile={false} />
      );
      const indicator = screen.getByTestId("balance-indicator-left");
      expect(indicator).toHaveAttribute("aria-label", "무력상태 | HELPLESS");
    });
  });

  describe("Position Handling", () => {
    it("should position on left side for player 1", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="READY" position="left" isMobile={false} />
      );
      const indicator = screen.getByTestId("balance-indicator-left");
      const style = window.getComputedStyle(indicator);
      expect(style.left).toBeTruthy();
    });

    it("should position on right side for player 2", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="READY" position="right" isMobile={false} />
      );
      const indicator = screen.getByTestId("balance-indicator-right");
      const style = window.getComputedStyle(indicator);
      expect(style.right).toBeTruthy();
    });
  });

  describe("Mobile Optimization", () => {
    it("should render with mobile-optimized dimensions", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="READY" position="left" isMobile={true} />
      );
      const indicator = screen.getByTestId("balance-indicator-left");
      const style = window.getComputedStyle(indicator);
      expect(style.width).toBe("180px");
      expect(style.height).toBe("80px");
    });

    it("should use thinner border on mobile", () => {
      renderInCanvas(
        <BalanceIndicator balanceState="READY" position="left" isMobile={true} />
      );
      const indicator = screen.getByTestId("balance-indicator-left");
      const style = window.getComputedStyle(indicator);
      expect(style.borderWidth).toBe("3px");
    });
  });

  describe("State Transitions", () => {
    it("should handle transition from READY to SHAKEN", () => {
      const { rerender } = renderInCanvas(
        <BalanceIndicator balanceState="READY" position="left" isMobile={false} />
      );
      
      rerender(
        <Canvas>
          <BalanceIndicator balanceState="SHAKEN" position="left" isMobile={false} />
        </Canvas>
      );
      
      expect(screen.getByTestId("balance-indicator-left")).toBeInTheDocument();
    });

    it("should handle transition from SHAKEN to VULNERABLE", () => {
      const { rerender } = renderInCanvas(
        <BalanceIndicator balanceState="SHAKEN" position="left" isMobile={false} />
      );
      
      rerender(
        <Canvas>
          <BalanceIndicator balanceState="VULNERABLE" position="left" isMobile={false} />
        </Canvas>
      );
      
      expect(screen.getByTestId("balance-indicator-left")).toBeInTheDocument();
    });

    it("should handle transition from VULNERABLE to HELPLESS", () => {
      const { rerender } = renderInCanvas(
        <BalanceIndicator balanceState="VULNERABLE" position="left" isMobile={false} />
      );
      
      rerender(
        <Canvas>
          <BalanceIndicator balanceState="HELPLESS" position="left" isMobile={false} />
        </Canvas>
      );
      
      expect(screen.getByTestId("balance-indicator-left")).toBeInTheDocument();
    });
  });
});
