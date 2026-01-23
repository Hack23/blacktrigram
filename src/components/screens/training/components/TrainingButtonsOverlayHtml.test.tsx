/**
 * TrainingButtons Component Tests
 * 
 * Tests for return-to-menu button and archetype selection buttons
 * Updated to work with BaseButtonOverlayHtml structure
 */

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PlayerArchetype } from "../../../../types/common";
import {
  ArchetypeSelectionButtons,
  ReturnToMenuButton,
} from "./TrainingButtonsOverlayHtml";

describe("ReturnToMenuButton", () => {
  it("should render with bilingual text", () => {
    render(
      <ReturnToMenuButton onClick={vi.fn()} isMobile={false} />,
    );

    expect(screen.getByText("메뉴로")).toBeInTheDocument();
    expect(screen.getByText("Return to Menu")).toBeInTheDocument();
  });

  it("should render mobile text on mobile", () => {
    render(
      <ReturnToMenuButton onClick={vi.fn()} isMobile={true} />,
    );

    expect(screen.getByText("메뉴")).toBeInTheDocument();
    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <ReturnToMenuButton onClick={onClick} isMobile={false} />,
    );

    await user.click(screen.getByTestId("return-to-menu-button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should call onMouseEnter when hovered", async () => {
    const user = userEvent.setup();
    const onMouseEnter = vi.fn();

    render(
      <ReturnToMenuButton
        onClick={vi.fn()}
        onMouseEnter={onMouseEnter}
        isMobile={false}
      />,
    );

    await user.hover(screen.getByTestId("return-to-menu-button"));
    expect(onMouseEnter).toHaveBeenCalled();
  });

  it("should be a button element", () => {
    render(
      <ReturnToMenuButton onClick={vi.fn()} isMobile={false} />,
    );

    const button = screen.getByTestId("return-to-menu-button");
    expect(button.tagName).toBe("BUTTON");
  });
});

describe("ArchetypeSelectionButtons", () => {
  it("should render all archetype buttons", () => {
    render(
      <ArchetypeSelectionButtons
        selectedArchetype={PlayerArchetype.MUSA}
        onArchetypeSelect={vi.fn()}
        isMobile={false}
      />,
    );

    expect(
      screen.getByTestId("archetype-selection-buttons"),
    ).toBeInTheDocument();

    // Check that all archetypes are rendered
    Object.values(PlayerArchetype).forEach((archetype) => {
      expect(
        screen.getByTestId(`archetype-button-${archetype}`),
      ).toBeInTheDocument();
    });
  });

  it("should display archetype names in uppercase", () => {
    render(
      <ArchetypeSelectionButtons
        selectedArchetype={PlayerArchetype.MUSA}
        onArchetypeSelect={vi.fn()}
        isMobile={false}
      />,
    );

    Object.values(PlayerArchetype).forEach((archetype) => {
      expect(screen.getByText(archetype.toUpperCase())).toBeInTheDocument();
    });
  });

  it("should call onArchetypeSelect when button is clicked", async () => {
    const user = userEvent.setup();
    const onArchetypeSelect = vi.fn();

    render(
      <ArchetypeSelectionButtons
        selectedArchetype={PlayerArchetype.MUSA}
        onArchetypeSelect={onArchetypeSelect}
        isMobile={false}
      />,
    );

    await user.click(
      screen.getByTestId(`archetype-button-${PlayerArchetype.HACKER}`),
    );
    expect(onArchetypeSelect).toHaveBeenCalledWith(PlayerArchetype.HACKER);
  });

  it("should play sound effect when button is clicked", async () => {
    const user = userEvent.setup();
    const onPlaySFX = vi.fn();

    render(
      <ArchetypeSelectionButtons
        selectedArchetype={PlayerArchetype.MUSA}
        onArchetypeSelect={vi.fn()}
        onPlaySFX={onPlaySFX}
        isMobile={false}
      />,
    );

    await user.click(
      screen.getByTestId(`archetype-button-${PlayerArchetype.AMSALJA}`),
    );
    expect(onPlaySFX).toHaveBeenCalledWith("menu_select");
  });

  it("should mark selected archetype with aria-pressed", () => {
    render(
      <ArchetypeSelectionButtons
        selectedArchetype={PlayerArchetype.MUSA}
        onArchetypeSelect={vi.fn()}
        isMobile={false}
      />,
    );

    const musaButton = screen.getByTestId(
      `archetype-button-${PlayerArchetype.MUSA}`,
    );
    expect(musaButton).toHaveAttribute("aria-pressed", "true");

    const hackerButton = screen.getByTestId(
      `archetype-button-${PlayerArchetype.HACKER}`,
    );
    expect(hackerButton).toHaveAttribute("aria-pressed", "false");
  });

  it("should have correct accessibility labels", () => {
    render(
      <ArchetypeSelectionButtons
        selectedArchetype={PlayerArchetype.MUSA}
        onArchetypeSelect={vi.fn()}
        isMobile={false}
      />,
    );

    Object.values(PlayerArchetype).forEach((archetype) => {
      const button = screen.getByTestId(`archetype-button-${archetype}`);
      expect(button).toHaveAttribute("aria-label", `Select ${archetype} archetype`);
    });
  });

  it("should render all 5 archetypes", () => {
    render(
      <ArchetypeSelectionButtons
        selectedArchetype={PlayerArchetype.MUSA}
        onArchetypeSelect={vi.fn()}
        isMobile={false}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);
  });

  it("should handle rapid clicks without error", async () => {
    const user = userEvent.setup();
    const onArchetypeSelect = vi.fn();

    render(
      <ArchetypeSelectionButtons
        selectedArchetype={PlayerArchetype.MUSA}
        onArchetypeSelect={onArchetypeSelect}
        isMobile={false}
      />,
    );

    const button = screen.getByTestId(
      `archetype-button-${PlayerArchetype.HACKER}`,
    );

    // Click multiple times rapidly
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(onArchetypeSelect).toHaveBeenCalledTimes(3);
  });
});
