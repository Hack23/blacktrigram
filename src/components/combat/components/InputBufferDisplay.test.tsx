/**
 * Unit tests for InputBufferDisplay component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { InputBufferDisplay } from "./InputBufferDisplay";
import { QueuedInput } from "../../../hooks/useKeyboardControls";
import React from "react";

// Mock Html from @react-three/drei
vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("InputBufferDisplay", () => {
  it("should not render when queue is empty", () => {
    render(<InputBufferDisplay queuedInputs={[]} />);

    expect(
      screen.queryByTestId("input-buffer-display")
    ).not.toBeInTheDocument();
  });

  it("should render when queue has inputs", () => {
    const inputs: QueuedInput[] = [
      { action: "Stance 3", key: "3", timestamp: Date.now() },
    ];

    render(<InputBufferDisplay queuedInputs={inputs} />);

    expect(screen.getByTestId("input-buffer-display")).toBeInTheDocument();
  });

  it("should display queued inputs", () => {
    const inputs: QueuedInput[] = [
      { action: "Stance 3", key: "3", timestamp: Date.now() },
      { action: "Attack", key: " ", timestamp: Date.now() - 100 },
    ];

    render(<InputBufferDisplay queuedInputs={inputs} />);

    expect(screen.getByTestId("queued-input-0")).toBeInTheDocument();
    expect(screen.getByTestId("queued-input-1")).toBeInTheDocument();
  });

  it("should show action names", () => {
    const inputs: QueuedInput[] = [
      { action: "Stance 5", key: "5", timestamp: Date.now() },
      { action: "Block", key: "b", timestamp: Date.now() - 100 },
    ];

    render(<InputBufferDisplay queuedInputs={inputs} />);

    const display = screen.getByTestId("input-buffer-display");
    expect(display.textContent).toContain("Stance 5");
    expect(display.textContent).toContain("Block");
  });

  it("should show key badges", () => {
    const inputs: QueuedInput[] = [
      { action: "Stance 3", key: "3", timestamp: Date.now() },
    ];

    render(<InputBufferDisplay queuedInputs={inputs} />);

    const display = screen.getByTestId("input-buffer-display");
    expect(display.textContent).toContain("3");
  });

  it("should uppercase key displays", () => {
    const inputs: QueuedInput[] = [
      { action: "Attack", key: "space", timestamp: Date.now() },
    ];

    render(<InputBufferDisplay queuedInputs={inputs} />);

    const display = screen.getByTestId("input-buffer-display");
    expect(display.textContent).toContain("SPACE");
  });

  it("should display title", () => {
    const inputs: QueuedInput[] = [
      { action: "Stance 1", key: "1", timestamp: Date.now() },
    ];

    render(<InputBufferDisplay queuedInputs={inputs} />);

    const display = screen.getByTestId("input-buffer-display");
    expect(display.textContent).toContain("Input Queue");
  });

  it("should handle multiple inputs", () => {
    const inputs: QueuedInput[] = [
      { action: "Stance 2", key: "2", timestamp: Date.now() },
      { action: "Attack", key: " ", timestamp: Date.now() - 100 },
      { action: "Block", key: "b", timestamp: Date.now() - 200 },
    ];

    render(<InputBufferDisplay queuedInputs={inputs} />);

    expect(screen.getByTestId("queued-input-0")).toBeInTheDocument();
    expect(screen.getByTestId("queued-input-1")).toBeInTheDocument();
    expect(screen.getByTestId("queued-input-2")).toBeInTheDocument();
  });

  it("should adapt to mobile layout", () => {
    const inputs: QueuedInput[] = [
      { action: "Stance 1", key: "1", timestamp: Date.now() },
    ];

    render(
      <InputBufferDisplay queuedInputs={inputs} isMobile={true} />
    );

    const display = screen.getByTestId("input-buffer-display");
    expect(display).toBeInTheDocument();

    // Mobile should have smaller font sizes (testing via style attribute)
    expect(display).toHaveStyle({ top: "10px", right: "10px" });
  });

  it("should handle empty action strings", () => {
    const inputs: QueuedInput[] = [
      { action: "", key: "x", timestamp: Date.now() },
    ];

    render(<InputBufferDisplay queuedInputs={inputs} />);

    const display = screen.getByTestId("input-buffer-display");
    expect(display).toBeInTheDocument();
  });

  it("should show most recent input first", () => {
    const now = Date.now();
    const inputs: QueuedInput[] = [
      { action: "Latest", key: "a", timestamp: now },
      { action: "Middle", key: "b", timestamp: now - 500 },
      { action: "Oldest", key: "c", timestamp: now - 1000 },
    ];

    render(<InputBufferDisplay queuedInputs={inputs} />);

    const firstInput = screen.getByTestId("queued-input-0");
    expect(firstInput.textContent).toContain("Latest");
  });

  it("should handle special characters in keys", () => {
    const inputs: QueuedInput[] = [
      { action: "Attack", key: " ", timestamp: Date.now() },
      { action: "Precision", key: "Control", timestamp: Date.now() - 100 },
    ];

    render(<InputBufferDisplay queuedInputs={inputs} />);

    const display = screen.getByTestId("input-buffer-display");
    // Space should be displayed (though it might be hard to see visually)
    expect(display.textContent).toContain("CONTROL");
  });
});
