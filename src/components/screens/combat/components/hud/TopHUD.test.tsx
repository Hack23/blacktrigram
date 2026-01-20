/**
 * TopHUD Component Tests
 *
 * Tests for the top HUD container component.
 */

import { render as rtlRender, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { AudioProvider } from "../../../../../audio/AudioProvider";
import { TopHUD } from "./TopHUD";

// Wrapper component for AudioProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AudioProvider>{children}</AudioProvider>
);

// Custom render function that wraps in AudioProvider
const render = (ui: React.ReactElement) => {
  return rtlRender(ui, { wrapper: TestWrapper });
};

describe("TopHUD", () => {
  const mockTimerState = {
    formattedTime: "01:30",
    warningLevel: "none" as const,
    isTimeUp: false,
  };

  const mockOnReturnToMenu = vi.fn();
  const mockOnAudioHover = vi.fn();

  it("should render without crashing", () => {
    render(
      <TopHUD
        width={1200}
        isMobile={false}
        positionScale={1.0}
        timerState={mockTimerState}
        showTimer={true}
        onReturnToMenu={mockOnReturnToMenu}
        onAudioHover={mockOnAudioHover}
      />
    );

    // Component renders (no crash)
    expect(document.body).toBeTruthy();
  });

  it("should render combat title", () => {
    render(
      <TopHUD
        width={1200}
        isMobile={false}
        positionScale={1.0}
        timerState={mockTimerState}
        showTimer={true}
        onReturnToMenu={mockOnReturnToMenu}
        onAudioHover={mockOnAudioHover}
      />
    );

    // Title should be visible
    expect(screen.getByText(/전투.*Combat/)).toBeInTheDocument();
  });

  it("should render combat timer when showTimer is true", () => {
    render(
      <TopHUD
        width={1200}
        isMobile={false}
        positionScale={1.0}
        timerState={mockTimerState}
        showTimer={true}
        onReturnToMenu={mockOnReturnToMenu}
        onAudioHover={mockOnAudioHover}
      />
    );

    // Timer should be visible
    expect(screen.getByTestId("combat-timer")).toBeInTheDocument();
  });

  it("should not render combat timer when showTimer is false", () => {
    render(
      <TopHUD
        width={1200}
        isMobile={false}
        positionScale={1.0}
        timerState={mockTimerState}
        showTimer={false}
        onReturnToMenu={mockOnReturnToMenu}
        onAudioHover={mockOnAudioHover}
      />
    );

    // Timer should not be visible
    expect(screen.queryByTestId("combat-timer")).not.toBeInTheDocument();
  });

  it("should render back button", () => {
    render(
      <TopHUD
        width={1200}
        isMobile={false}
        positionScale={1.0}
        timerState={mockTimerState}
        showTimer={true}
        onReturnToMenu={mockOnReturnToMenu}
        onAudioHover={mockOnAudioHover}
      />
    );

    // Back button should be visible
    expect(screen.getByTestId("return-to-menu-button")).toBeInTheDocument();
  });

  it("should call onReturnToMenu when back button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <TopHUD
        width={1200}
        isMobile={false}
        positionScale={1.0}
        timerState={mockTimerState}
        showTimer={true}
        onReturnToMenu={mockOnReturnToMenu}
        onAudioHover={mockOnAudioHover}
      />
    );

    const backButton = screen.getByTestId("return-to-menu-button");
    await user.click(backButton);

    expect(mockOnReturnToMenu).toHaveBeenCalledTimes(1);
  });

  it("should call onAudioHover when back button is hovered", async () => {
    const user = userEvent.setup();

    render(
      <TopHUD
        width={1200}
        isMobile={false}
        positionScale={1.0}
        timerState={mockTimerState}
        showTimer={true}
        onReturnToMenu={mockOnReturnToMenu}
        onAudioHover={mockOnAudioHover}
      />
    );

    const backButton = screen.getByTestId("return-to-menu-button");
    await user.hover(backButton);

    expect(mockOnAudioHover).toHaveBeenCalledTimes(1);
  });

  it("should adapt to mobile layout", () => {
    render(
      <TopHUD
        width={400}
        isMobile={true}
        positionScale={1.0}
        timerState={mockTimerState}
        showTimer={true}
        onReturnToMenu={mockOnReturnToMenu}
        onAudioHover={mockOnAudioHover}
      />
    );

    // Title should be smaller on mobile
    const title = screen.getByText(/전투.*Combat/);
    expect(title).toHaveStyle({ fontSize: "18px" });
  });

  it("should scale positions for large displays", () => {
    render(
      <TopHUD
        width={2560}
        isMobile={false}
        positionScale={1.5}
        timerState={mockTimerState}
        showTimer={true}
        onReturnToMenu={mockOnReturnToMenu}
        onAudioHover={mockOnAudioHover}
      />
    );

    // Component renders with larger position scale
    expect(screen.getByText(/전투.*Combat/)).toBeInTheDocument();
  });

  it("should render volume control", () => {
    render(
      <TopHUD
        width={1200}
        isMobile={false}
        positionScale={1.0}
        timerState={mockTimerState}
        showTimer={true}
        onReturnToMenu={mockOnReturnToMenu}
        onAudioHover={mockOnAudioHover}
      />
    );

    // Volume control should be visible
    expect(screen.getByTestId("volume-control")).toBeInTheDocument();
  });
});
