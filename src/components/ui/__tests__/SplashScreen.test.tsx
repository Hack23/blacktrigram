import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SplashScreen } from "../SplashScreen";

describe("SplashScreen", () => {
  const defaultProps = {
    onStart: vi.fn(),
    width: 1200,
    height: 800,
  };

  it("should render splash screen with title", () => {
    render(<SplashScreen {...defaultProps} />);

    expect(screen.getByText("흑괘")).toBeInTheDocument();
    expect(screen.getByText("BLACK TRIGRAM")).toBeInTheDocument();
    expect(screen.getByText("Korean Martial Arts Dojang")).toBeInTheDocument();
  });

  it("should display start button", () => {
    render(<SplashScreen {...defaultProps} />);

    const startButton = screen.getByTestId("splash-start-button");
    expect(startButton).toBeInTheDocument();
    expect(startButton).toHaveTextContent("시작 | Start");
  });

  it("should call onStart when button is clicked", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();

    render(<SplashScreen {...defaultProps} onStart={onStart} />);

    const startButton = screen.getByTestId("splash-start-button");
    await user.click(startButton);

    await waitFor(() => {
      expect(onStart).toHaveBeenCalledTimes(1);
    });
  });

  it("should show loading state after clicking start", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();

    render(<SplashScreen {...defaultProps} onStart={onStart} />);

    const startButton = screen.getByTestId("splash-start-button");
    await user.click(startButton);

    // Button should show loading text immediately
    expect(startButton).toHaveTextContent("시작 중... Starting...");
    expect(startButton).toBeDisabled();
  });

  it("should display audio initialization instructions", () => {
    render(<SplashScreen {...defaultProps} />);

    expect(
      screen.getByText("Audio initialization requires user interaction")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Click the button above to enable sound and start the game")
    ).toBeInTheDocument();
  });

  it("should adapt to mobile screen size", () => {
    render(<SplashScreen {...defaultProps} width={400} height={600} />);

    const startButton = screen.getByTestId("splash-start-button");
    expect(startButton).toBeInTheDocument();
  });

  it("should have proper test IDs for testing", () => {
    render(<SplashScreen {...defaultProps} />);

    expect(screen.getByTestId("splash-screen")).toBeInTheDocument();
    expect(screen.getByTestId("splash-start-button")).toBeInTheDocument();
  });

  it("should prevent multiple clicks while loading", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();

    render(<SplashScreen {...defaultProps} onStart={onStart} />);

    const startButton = screen.getByTestId("splash-start-button");
    
    // Click multiple times rapidly
    await user.click(startButton);
    await user.click(startButton);
    await user.click(startButton);

    // Should only call onStart once due to disabled state
    await waitFor(() => {
      expect(onStart).toHaveBeenCalledTimes(1);
    });
  });

  it("should display version info", () => {
    render(<SplashScreen {...defaultProps} />);

    // Check that version element exists
    expect(screen.getByText(/v\d+\.\d+\.\d+|v0\.5\.3/)).toBeInTheDocument();
  });
});
