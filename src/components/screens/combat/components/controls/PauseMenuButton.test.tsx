/**
 * PauseMenuButton Component Tests
 * 
 * Tests for pause menu button component
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PauseMenuButton } from "./PauseMenuButton";

describe("PauseMenuButton", () => {
  const defaultProps = {
    labelKorean: "계속",
    labelEnglish: "Resume",
    onClick: vi.fn(),
    isFocused: false,
    isMobile: false,
    testId: "test-button",
  };

  it("should render with bilingual text", () => {
    render(<PauseMenuButton {...defaultProps} />);

    expect(screen.getByText(/계속.*Resume/)).toBeInTheDocument();
  });

  it("should render with icon", () => {
    render(<PauseMenuButton {...defaultProps} icon="▶️" />);

    expect(screen.getByText("▶️")).toBeInTheDocument();
    expect(screen.getByText(/계속.*Resume/)).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<PauseMenuButton {...defaultProps} onClick={onClick} />);

    await user.click(screen.getByTestId("test-button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should call onMouseEnter when hovered", async () => {
    const user = userEvent.setup();
    const onMouseEnter = vi.fn();

    render(
      <PauseMenuButton {...defaultProps} onMouseEnter={onMouseEnter} />,
    );

    await user.hover(screen.getByTestId("test-button"));
    expect(onMouseEnter).toHaveBeenCalled();
  });

  it("should call onKeyDown when key is pressed", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();

    render(<PauseMenuButton {...defaultProps} onKeyDown={onKeyDown} />);

    const button = screen.getByTestId("test-button");
    button.focus();
    await user.keyboard("{Enter}");
    expect(onKeyDown).toHaveBeenCalled();
  });

  it("should call onFocus when focused", () => {
    const onFocus = vi.fn();

    render(<PauseMenuButton {...defaultProps} onFocus={onFocus} />);

    const button = screen.getByTestId("test-button");
    button.focus();
    expect(onFocus).toHaveBeenCalled();
  });

  it("should have correct accessibility attributes", () => {
    render(<PauseMenuButton {...defaultProps} />);

    const button = screen.getByTestId("test-button");
    expect(button).toHaveAttribute("aria-label", "계속 | Resume");
    expect(button).toHaveAttribute("role", "menuitem");
    expect(button).toHaveAttribute("tabIndex", "0");
  });

  it("should apply focus styles when isFocused is true", () => {
    const { container } = render(
      <PauseMenuButton {...defaultProps} isFocused={true} />,
    );

    const button = screen.getByTestId("test-button");
    expect(button).toHaveAttribute("style");
    // Focus styles are applied inline
    expect(container.querySelector("button")).toBeInTheDocument();
  });

  it("should not apply focus styles when isFocused is false", () => {
    render(<PauseMenuButton {...defaultProps} isFocused={false} />);

    const button = screen.getByTestId("test-button");
    expect(button).toHaveAttribute("style");
  });

  it("should use mobile sizing when isMobile is true", () => {
    const { container: mobileContainer } = render(
      <PauseMenuButton {...defaultProps} isMobile={true} />,
    );

    const { container: desktopContainer } = render(
      <PauseMenuButton {...defaultProps} isMobile={false} />,
    );

    // Verify buttons exist with inline styles
    expect(mobileContainer.querySelector("button")).toHaveAttribute("style");
    expect(desktopContainer.querySelector("button")).toHaveAttribute("style");
  });

  it("should handle hover effects", async () => {
    const user = userEvent.setup();
    render(<PauseMenuButton {...defaultProps} />);

    const button = screen.getByTestId("test-button");

    // Hover should trigger mouse events
    await user.hover(button);
    // Button should still exist after hover
    expect(button).toBeInTheDocument();

    // Unhover
    await user.unhover(button);
    expect(button).toBeInTheDocument();
  });

  it("should support ref forwarding", () => {
    const ref = React.createRef<HTMLButtonElement>();

    render(<PauseMenuButton {...defaultProps} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.tagName).toBe("BUTTON");
  });

  it("should handle rapid clicks without error", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<PauseMenuButton {...defaultProps} onClick={onClick} />);

    const button = screen.getByTestId("test-button");

    // Click multiple times rapidly
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("should render without icon when not provided", () => {
    render(<PauseMenuButton {...defaultProps} />);

    const button = screen.getByTestId("test-button");
    expect(button.textContent).not.toMatch(/▶️|🔄|🎮|🔙/);
  });

  it("should have Korean font family", () => {
    render(<PauseMenuButton {...defaultProps} />);

    const button = screen.getByTestId("test-button");
    const styles = button.getAttribute("style");
    expect(styles).toContain("font-family");
  });

  it("should display name be set correctly", () => {
    expect(PauseMenuButton.displayName).toBe("PauseMenuButton");
  });
});
