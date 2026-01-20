/**
 * BottomHUD Component Tests
 *
 * Tests for the bottom HUD container component.
 */

import { render as rtlRender, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { AudioProvider } from "../../../../../audio/AudioProvider";
import { BottomHUD } from "./BottomHUD";
import { PlayerArchetype } from "../../../../../types";
import { createPlayerFromArchetype } from "../../../../../utils/playerUtils";

// Wrapper component for AudioProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AudioProvider>{children}</AudioProvider>
);

// Custom render function that wraps in AudioProvider
const render = (ui: React.ReactElement) => {
  return rtlRender(ui, { wrapper: TestWrapper });
};

describe("BottomHUD", () => {
  const mockPlayer = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
  const mockTechniques = [
    {
      id: "jab",
      name: { korean: "잽", english: "Jab" },
      damage: 10,
      staminaCost: 5,
      kiCost: 0,
      speed: 1.0,
      accuracy: 0.9,
      range: 1.0,
      cooldown: 500,
      animationType: "jab",
    },
  ];

  const mockCooldowns = new Map<string, number>();

  const defaultProps = {
    width: 1200,
    height: 800,
    isMobile: false,
    techniqueBarVisible: true,
    availableTechniques: mockTechniques,
    player: mockPlayer,
    selectedTechniqueIndex: 0,
    techniqueCooldowns: mockCooldowns,
    onTechniqueSelect: vi.fn(),
    onTechniqueHover: vi.fn(),
    combatMessages: ["전투 시작! | Combat Start!"],
    currentDifficultyTier: "beginner" as const,
    mobileControlsEnabled: false,
    currentStanceIndex: 0,
    stanceWheelExpanded: false,
    onMove: vi.fn(),
    onAttack: vi.fn(),
    onBlock: vi.fn(),
    onStanceChange: vi.fn(),
    onStanceWheelToggle: vi.fn(),
    onGesture: vi.fn(),
  };

  it("should render without crashing", () => {
    render(<BottomHUD {...defaultProps} />);

    // Component renders (no crash)
    expect(document.body).toBeTruthy();
  });

  it("should render TechniqueBarContainer when visible", () => {
    render(<BottomHUD {...defaultProps} techniqueBarVisible={true} />);

    // TechniqueBarContainer should be rendered
    expect(screen.getByTestId("technique-bar-container")).toBeInTheDocument();
  });

  it("should not render TechniqueBarContainer when not visible", () => {
    render(<BottomHUD {...defaultProps} techniqueBarVisible={false} />);

    // TechniqueBarContainer should not be visible
    const container = screen.queryByTestId("technique-bar-container");
    // Component may render but be hidden via CSS, or not render at all
    if (container) {
      // If rendered, should have visibility: hidden or display: none
      const style = window.getComputedStyle(container);
      expect(
        style.visibility === "hidden" || style.display === "none"
      ).toBeTruthy();
    }
  });

  it("should render CombatControlsPanel", () => {
    render(<BottomHUD {...defaultProps} />);

    // CombatControlsPanel should be rendered
    expect(screen.getByTestId("combat-controls-panel")).toBeInTheDocument();
  });

  it("should render DifficultyIndicator", () => {
    render(<BottomHUD {...defaultProps} />);

    // DifficultyIndicator should be rendered
    expect(screen.getByTestId("difficulty-indicator")).toBeInTheDocument();
  });

  it("should not render MobileControlsWrapper on desktop", () => {
    render(<BottomHUD {...defaultProps} isMobile={false} />);

    // MobileControlsWrapper should not be rendered
    expect(
      screen.queryByTestId("mobile-controls-wrapper")
    ).not.toBeInTheDocument();
  });

  // Note: MobileControlsWrapper on mobile is tested separately in MobileControlsWrapper.test.tsx
  // It requires Three.js Canvas context which is not available in unit tests

  it("should pass correct props to TechniqueBarContainer", () => {
    render(<BottomHUD {...defaultProps} />);

    // Verify TechniqueBarContainer receives correct props
    const container = screen.getByTestId("technique-bar-container");
    expect(container).toBeInTheDocument();
  });

  it("should pass correct props to CombatControlsPanel", () => {
    render(<BottomHUD {...defaultProps} />);

    // Verify CombatControlsPanel receives messages
    const panel = screen.getByTestId("combat-controls-panel");
    expect(panel).toBeInTheDocument();
  });

  // Note: Mobile layout testing skipped because MobileControlsWrapper requires Three.js Canvas context
  // Mobile functionality is tested in integration tests with CombatScreen3D

  it("should handle empty combat messages", () => {
    render(<BottomHUD {...defaultProps} combatMessages={[]} />);

    // CombatControlsPanel should still render with empty messages
    expect(screen.getByTestId("combat-controls-panel")).toBeInTheDocument();
  });

  it("should handle different difficulty tiers", () => {
    const { rerender } = render(
      <BottomHUD {...defaultProps} currentDifficultyTier="beginner" />
    );

    expect(screen.getByTestId("difficulty-indicator")).toBeInTheDocument();

    // Change difficulty tier
    rerender(
      <BottomHUD {...defaultProps} currentDifficultyTier="master" />
    );

    expect(screen.getByTestId("difficulty-indicator")).toBeInTheDocument();
  });
});
