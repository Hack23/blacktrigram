/**
 * MenuButtons Component Tests
 * 
 * Tests for menu button grid with selection and hover states
 */

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GameMode } from "../../../../types/common";
import { MenuButtons } from "./MenuButtonsOverlayHtml";

const MOCK_MENU_ITEMS = [
  { mode: GameMode.VERSUS, korean: "대전", english: "Combat" },
  { mode: GameMode.TRAINING, korean: "훈련", english: "Training" },
  { mode: GameMode.CONTROLS, korean: "조작", english: "Controls" },
  { mode: GameMode.PHILOSOPHY, korean: "철학", english: "Philosophy" },
];

describe("MenuButtons", () => {
  it("should render all menu items", () => {
    render(
      <MenuButtons
        menuItems={MOCK_MENU_ITEMS}
        selectedIndex={0}
        hoveredIndex={null}
        onModeSelect={vi.fn()}
        onHoverChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId("main-menu-buttons")).toBeInTheDocument();
    expect(screen.getByTestId("menu-item-versus")).toBeInTheDocument();
    expect(screen.getByTestId("menu-item-training")).toBeInTheDocument();
    expect(screen.getByTestId("menu-item-controls")).toBeInTheDocument();
    expect(screen.getByTestId("menu-item-philosophy")).toBeInTheDocument();
  });

  it("should display Korean and English text", () => {
    render(
      <MenuButtons
        menuItems={MOCK_MENU_ITEMS}
        selectedIndex={0}
        hoveredIndex={null}
        onModeSelect={vi.fn()}
        onHoverChange={vi.fn()}
      />,
    );

    expect(screen.getByText(/대전.*Combat/)).toBeInTheDocument();
    expect(screen.getByText(/훈련.*Training/)).toBeInTheDocument();
    expect(screen.getByText(/조작.*Controls/)).toBeInTheDocument();
    expect(screen.getByText(/철학.*Philosophy/)).toBeInTheDocument();
  });

  it("should call onModeSelect when button is clicked", async () => {
    const user = userEvent.setup();
    const onModeSelect = vi.fn();

    render(
      <MenuButtons
        menuItems={MOCK_MENU_ITEMS}
        selectedIndex={0}
        hoveredIndex={null}
        onModeSelect={onModeSelect}
        onHoverChange={vi.fn()}
      />,
    );

    await user.click(screen.getByTestId("menu-item-training"));
    expect(onModeSelect).toHaveBeenCalledWith(GameMode.TRAINING);
  });

  it("should call onHoverChange when mouse enters button", async () => {
    const user = userEvent.setup();
    const onHoverChange = vi.fn();

    render(
      <MenuButtons
        menuItems={MOCK_MENU_ITEMS}
        selectedIndex={0}
        hoveredIndex={null}
        onModeSelect={vi.fn()}
        onHoverChange={onHoverChange}
      />,
    );

    await user.hover(screen.getByTestId("menu-item-training"));
    expect(onHoverChange).toHaveBeenCalledWith(1);
  });

  it("should call onHoverChange with null when mouse leaves button", async () => {
    const user = userEvent.setup();
    const onHoverChange = vi.fn();

    render(
      <MenuButtons
        menuItems={MOCK_MENU_ITEMS}
        selectedIndex={0}
        hoveredIndex={null}
        onModeSelect={vi.fn()}
        onHoverChange={onHoverChange}
      />,
    );

    const trainingButton = screen.getByTestId("menu-item-training");
    
    // First hover to set state
    await user.hover(trainingButton);
    expect(onHoverChange).toHaveBeenCalledWith(1);
    
    // Clear previous calls
    onHoverChange.mockClear();
    
    // Then unhover
    await user.unhover(trainingButton);
    expect(onHoverChange).toHaveBeenCalledWith(null);
  });

  it("should play sound effects on click", async () => {
    const user = userEvent.setup();
    const onPlaySFX = vi.fn();

    render(
      <MenuButtons
        menuItems={MOCK_MENU_ITEMS}
        selectedIndex={0}
        hoveredIndex={null}
        onModeSelect={vi.fn()}
        onHoverChange={vi.fn()}
        onPlaySFX={onPlaySFX}
      />,
    );

    await user.click(screen.getByTestId("menu-item-controls"));
    expect(onPlaySFX).toHaveBeenCalledWith("menu_select");
  });

  it("should play sound effects on hover", async () => {
    const user = userEvent.setup();
    const onPlaySFX = vi.fn();

    render(
      <MenuButtons
        menuItems={MOCK_MENU_ITEMS}
        selectedIndex={0}
        hoveredIndex={null}
        onModeSelect={vi.fn()}
        onHoverChange={vi.fn()}
        onPlaySFX={onPlaySFX}
      />,
    );

    await user.hover(screen.getByTestId("menu-item-philosophy"));
    expect(onPlaySFX).toHaveBeenCalledWith("menu_hover");
  });

  it("should apply aria-selected to selected item", () => {
    render(
      <MenuButtons
        menuItems={MOCK_MENU_ITEMS}
        selectedIndex={1}
        hoveredIndex={null}
        onModeSelect={vi.fn()}
        onHoverChange={vi.fn()}
      />,
    );

    const trainingButton = screen.getByTestId("menu-item-training");
    expect(trainingButton).toHaveAttribute("aria-selected", "true");

    const combatButton = screen.getByTestId("menu-item-versus");
    expect(combatButton).toHaveAttribute("aria-selected", "false");
  });

  it("should use column layout on small screens", () => {
    render(
      <MenuButtons
        menuItems={MOCK_MENU_ITEMS}
        selectedIndex={0}
        hoveredIndex={null}
        onModeSelect={vi.fn()}
        onHoverChange={vi.fn()}
        width={400}
      />,
    );

    const container = screen.getByTestId("main-menu-buttons");
    expect(container).toHaveStyle({ gridTemplateColumns: "1fr" });
  });

  it("should use grid layout on larger screens", () => {
    render(
      <MenuButtons
        menuItems={MOCK_MENU_ITEMS}
        selectedIndex={0}
        hoveredIndex={null}
        onModeSelect={vi.fn()}
        onHoverChange={vi.fn()}
        width={800}
      />,
    );

    const container = screen.getByTestId("main-menu-buttons");
    expect(container).toHaveStyle({ gridTemplateColumns: "1fr 1fr" });
  });

  it("should include backward compatibility test IDs", () => {
    render(
      <MenuButtons
        menuItems={MOCK_MENU_ITEMS}
        selectedIndex={0}
        hoveredIndex={null}
        onModeSelect={vi.fn()}
        onHoverChange={vi.fn()}
      />,
    );

    // Check for backward compatibility test IDs
    expect(screen.getByTestId("training-button")).toBeInTheDocument();
    expect(screen.getByTestId("combat-button")).toBeInTheDocument();
  });

  it("should have correct accessibility attributes", () => {
    render(
      <MenuButtons
        menuItems={MOCK_MENU_ITEMS}
        selectedIndex={0}
        hoveredIndex={null}
        onModeSelect={vi.fn()}
        onHoverChange={vi.fn()}
      />,
    );

    const buttons = screen.getAllByRole("menuitem");
    expect(buttons).toHaveLength(4);

    buttons.forEach((button) => {
      expect(button).toHaveAttribute("aria-label");
    });
  });

  it("should handle empty menu items array", () => {
    render(
      <MenuButtons
        menuItems={[]}
        selectedIndex={0}
        hoveredIndex={null}
        onModeSelect={vi.fn()}
        onHoverChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId("main-menu-buttons")).toBeInTheDocument();
    expect(screen.queryByRole("menuitem")).not.toBeInTheDocument();
  });

  it("should not call callbacks when hoveredIndex is already set", async () => {
    const user = userEvent.setup();
    const onHoverChange = vi.fn();
    const onPlaySFX = vi.fn();

    const { rerender } = render(
      <MenuButtons
        menuItems={MOCK_MENU_ITEMS}
        selectedIndex={0}
        hoveredIndex={null}
        onModeSelect={vi.fn()}
        onHoverChange={onHoverChange}
        onPlaySFX={onPlaySFX}
      />,
    );

    // First hover - should call callbacks
    await user.hover(screen.getByTestId("menu-item-training"));
    expect(onHoverChange).toHaveBeenCalledTimes(1);
    expect(onPlaySFX).toHaveBeenCalledTimes(1);

    // Clear mocks
    onHoverChange.mockClear();
    onPlaySFX.mockClear();

    // Update prop to reflect hovered state
    rerender(
      <MenuButtons
        menuItems={MOCK_MENU_ITEMS}
        selectedIndex={0}
        hoveredIndex={1}
        onModeSelect={vi.fn()}
        onHoverChange={onHoverChange}
        onPlaySFX={onPlaySFX}
      />,
    );

    // Leave hover - should call callback with null
    await user.unhover(screen.getByTestId("menu-item-training"));
    expect(onHoverChange).toHaveBeenCalledWith(null);
  });
});
