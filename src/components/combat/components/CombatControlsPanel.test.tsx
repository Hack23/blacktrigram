/**
 * Tests for CombatControlsPanel component
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CombatControlsPanel } from "./CombatControlsPanel";

describe("CombatControlsPanel", () => {
  const mockMessages = [
    "Player attacked!",
    "AI defended!",
    "Critical hit!",
    "Player gained Ki",
    "Round started",
  ];

  it("should render without crashing", () => {
    render(
      <CombatControlsPanel combatMessages={mockMessages} isMobile={false} />
    );

    const panel = screen.getByTestId("combat-controls-panel");
    expect(panel).toBeInTheDocument();
  });

  it("should display controls guide", () => {
    render(
      <CombatControlsPanel combatMessages={mockMessages} isMobile={false} />
    );

    const guide = screen.getByTestId("combat-controls-guide");
    expect(guide).toBeInTheDocument();
    expect(guide).toHaveTextContent("Controls");
  });

  it("should display combat messages", () => {
    render(
      <CombatControlsPanel combatMessages={mockMessages} isMobile={false} />
    );

    const log = screen.getByTestId("combat-message-log");
    expect(log).toBeInTheDocument();
    expect(screen.getByText("Player attacked!")).toBeInTheDocument();
    expect(screen.getByText("Critical hit!")).toBeInTheDocument();
  });

  it("should show last 5 messages only", () => {
    const manyMessages = Array.from({ length: 10 }, (_, i) => `Message ${i}`);
    
    render(
      <CombatControlsPanel combatMessages={manyMessages} isMobile={false} />
    );

    // Should show messages 5-9 (last 5)
    expect(screen.getByText("Message 5")).toBeInTheDocument();
    expect(screen.getByText("Message 9")).toBeInTheDocument();
    expect(screen.queryByText("Message 0")).not.toBeInTheDocument();
    expect(screen.queryByText("Message 4")).not.toBeInTheDocument();
  });

  it("should use mobile sizing when isMobile is true", () => {
    const { container } = render(
      <CombatControlsPanel combatMessages={mockMessages} isMobile={true} />
    );

    const panel = container.querySelector('[data-testid="combat-controls-panel"]') as HTMLElement;
    expect(panel.style.bottom).toBe("90px"); // Mobile bottom position
  });

  it("should handle empty messages array", () => {
    render(<CombatControlsPanel combatMessages={[]} isMobile={false} />);

    const log = screen.getByTestId("combat-message-log");
    expect(log).toBeInTheDocument();
    expect(log.children.length).toBe(0);
  });
});
