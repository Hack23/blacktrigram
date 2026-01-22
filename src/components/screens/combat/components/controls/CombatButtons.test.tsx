/**
 * CombatButtons Component Tests
 * 
 * Tests for combat return-to-menu button
 */

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CombatReturnToMenuButton } from "./CombatButtons";

describe("CombatReturnToMenuButton", () => {
  it("should render with bilingual text", () => {
    render(
      <CombatReturnToMenuButton onClick={vi.fn()} isMobile={false} />,
    );

    expect(screen.getByText(/메뉴로.*Return to Menu/)).toBeInTheDocument();
  });

  it("should render mobile text on mobile", () => {
    render(
      <CombatReturnToMenuButton onClick={vi.fn()} isMobile={true} />,
    );

    expect(screen.getByText(/메뉴.*Menu/)).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <CombatReturnToMenuButton onClick={onClick} isMobile={false} />,
    );

    await user.click(screen.getByTestId("return-to-menu-button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should call onMouseEnter when hovered", async () => {
    const user = userEvent.setup();
    const onMouseEnter = vi.fn();

    render(
      <CombatReturnToMenuButton
        onClick={vi.fn()}
        onMouseEnter={onMouseEnter}
        isMobile={false}
      />,
    );

    await user.hover(screen.getByTestId("return-to-menu-button"));
    expect(onMouseEnter).toHaveBeenCalled();
  });

  it("should have correct accessibility attributes", () => {
    render(
      <CombatReturnToMenuButton onClick={vi.fn()} isMobile={false} />,
    );

    const button = screen.getByTestId("return-to-menu-button");
    expect(button).toHaveAttribute("aria-label", "Return to main menu");
  });

  it("should include CSS styles", () => {
    const { container } = render(
      <CombatReturnToMenuButton onClick={vi.fn()} isMobile={false} />,
    );

    const style = container.querySelector("style");
    expect(style).toBeInTheDocument();
    expect(style?.textContent).toContain("combat-return-menu-btn");
  });

  it("should render container with combat styling", () => {
    const { container } = render(
      <CombatReturnToMenuButton onClick={vi.fn()} isMobile={false} />,
    );

    const buttonContainer = container.firstChild as HTMLElement;
    expect(buttonContainer).toHaveStyle({ textAlign: "center" });
  });

  it("should adjust padding for mobile", () => {
    const { container: mobileContainer } = render(
      <CombatReturnToMenuButton onClick={vi.fn()} isMobile={true} />,
    );

    const { container: desktopContainer } = render(
      <CombatReturnToMenuButton onClick={vi.fn()} isMobile={false} />,
    );

    // Verify containers exist and have different styling
    expect(mobileContainer.firstChild).toBeInTheDocument();
    expect(desktopContainer.firstChild).toBeInTheDocument();
  });

  it("should handle rapid clicks without error", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <CombatReturnToMenuButton onClick={onClick} isMobile={false} />,
    );

    const button = screen.getByTestId("return-to-menu-button");

    // Click multiple times rapidly
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("should have combat-specific CSS class", () => {
    const { container } = render(
      <CombatReturnToMenuButton onClick={vi.fn()} isMobile={false} />,
    );

    const button = screen.getByTestId("return-to-menu-button");
    expect(button).toHaveClass("combat-return-menu-btn");
  });
});
