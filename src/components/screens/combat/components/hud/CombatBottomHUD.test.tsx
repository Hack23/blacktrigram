/**
 * Tests for CombatBottomHUD component
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AudioProvider } from "../../../../../audio/AudioProvider";
import { createMockPlayerState } from "../../../../../test/test-utils";
import { DamageType } from "../../../../../types/common";
import { Technique } from "../../../../../types";
import { CombatBottomHUD } from "./CombatBottomHUD";

// Mock techniques
const mockTechniques: Technique[] = [
  {
    id: "jab",
    name: { korean: "잽", english: "Jab" },
    description: { korean: "빠른 펀치", english: "Quick punch" },
    staminaCost: 5,
    kiCost: 0,
    damage: { min: 8, max: 12 },
    damageType: DamageType.BLUNT,
    cooldown: 500,
    keyboardShortcut: "Q",
  },
];

// Wrapper with AudioProvider
const renderWithAudio = (ui: React.ReactElement) => {
  return render(<AudioProvider>{ui}</AudioProvider>);
};

describe("CombatBottomHUD", () => {
  const defaultProps = {
    width: 1920,
    height: 1080,
    isMobile: false,
    positionScale: 1,
    visible: true,
    techniques: mockTechniques,
    player: createMockPlayerState(),
    selectedIndex: 0,
    cooldowns: new Map<string, number>(),
    onTechniqueSelect: vi.fn(),
    combatMessages: [],
  };

  it("should render with correct test id", () => {
    renderWithAudio(<CombatBottomHUD {...defaultProps} />);
    
    expect(screen.getByTestId("combat-bottom-hud")).toBeInTheDocument();
  });

  it("should render technique section when visible", () => {
    renderWithAudio(<CombatBottomHUD {...defaultProps} />);
    
    expect(screen.getByTestId("combat-bottom-hud-technique-section")).toBeInTheDocument();
  });

  it("should not render technique section when not visible", () => {
    renderWithAudio(<CombatBottomHUD {...defaultProps} visible={false} />);
    
    expect(screen.queryByTestId("combat-bottom-hud-technique-section")).not.toBeInTheDocument();
  });

  it("should render volume control section", () => {
    renderWithAudio(<CombatBottomHUD {...defaultProps} />);
    
    expect(screen.getByTestId("combat-bottom-hud-volume-section")).toBeInTheDocument();
  });

  it("should render combat messages when provided", () => {
    const messages = ["Test message 1", "Test message 2", "Test message 3"];
    renderWithAudio(<CombatBottomHUD {...defaultProps} combatMessages={messages} />);
    
    expect(screen.getByTestId("combat-bottom-hud-messages")).toBeInTheDocument();
    expect(screen.getByText("Test message 1")).toBeInTheDocument();
    expect(screen.getByText("Test message 2")).toBeInTheDocument();
    expect(screen.getByText("Test message 3")).toBeInTheDocument();
  });

  it("should not render messages section when no messages", () => {
    renderWithAudio(<CombatBottomHUD {...defaultProps} combatMessages={[]} />);
    
    expect(screen.queryByTestId("combat-bottom-hud-messages")).not.toBeInTheDocument();
  });

  it("should only show last 3 messages", () => {
    const messages = ["Message 1", "Message 2", "Message 3", "Message 4", "Message 5"];
    renderWithAudio(<CombatBottomHUD {...defaultProps} combatMessages={messages} />);
    
    expect(screen.queryByText("Message 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Message 2")).not.toBeInTheDocument();
    expect(screen.getByText("Message 3")).toBeInTheDocument();
    expect(screen.getByText("Message 4")).toBeInTheDocument();
    expect(screen.getByText("Message 5")).toBeInTheDocument();
  });

  it("should apply mobile layout when isMobile is true", () => {
    renderWithAudio(<CombatBottomHUD {...defaultProps} isMobile={true} />);
    
    const bottomHud = screen.getByTestId("combat-bottom-hud");
    // Mobile height should be 100px
    expect(bottomHud).toHaveStyle({ height: "100px" });
  });

  it("should apply desktop layout by default", () => {
    renderWithAudio(<CombatBottomHUD {...defaultProps} />);
    
    const bottomHud = screen.getByTestId("combat-bottom-hud");
    // Desktop height should be 120px
    expect(bottomHud).toHaveStyle({ height: "120px" });
  });

  it("should scale layout with positionScale", () => {
    renderWithAudio(<CombatBottomHUD {...defaultProps} positionScale={1.5} />);
    
    const bottomHud = screen.getByTestId("combat-bottom-hud");
    // Desktop height * positionScale = 120 * 1.5 = 180px
    expect(bottomHud).toHaveStyle({ height: "180px" });
  });

  it("should position correctly at the bottom", () => {
    renderWithAudio(<CombatBottomHUD {...defaultProps} />);
    
    const bottomHud = screen.getByTestId("combat-bottom-hud");
    expect(bottomHud).toHaveStyle({ position: "absolute", bottom: "0" });
  });
});
