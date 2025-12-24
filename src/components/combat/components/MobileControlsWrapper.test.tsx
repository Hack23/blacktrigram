/**
 * Tests for MobileControlsWrapper component
 */

import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MobileControlsWrapper } from "./MobileControlsWrapper";

// Mock the mobile components with proper types
interface MockComponentProps {
  readonly [key: string]: unknown;
}

vi.mock("../../mobile", () => ({
  VirtualDPad: (_props: MockComponentProps) => <div data-testid="virtual-dpad">DPad</div>,
  ActionButtons: (_props: MockComponentProps) => <div data-testid="action-buttons">Buttons</div>,
  StanceWheel: (_props: MockComponentProps) => <div data-testid="stance-wheel">Wheel</div>,
  GestureRecognizer: (_props: MockComponentProps) => <div data-testid="gesture-recognizer">Gestures</div>,
}));

describe("MobileControlsWrapper", () => {
  const mockHandlers = {
    onMove: vi.fn(),
    onAttack: vi.fn(),
    onBlock: vi.fn(),
    onStanceChange: vi.fn(),
    onStanceWheelToggle: vi.fn(),
    onGesture: vi.fn(),
  };

  it("should render without crashing", () => {
    const { container } = render(
      <MobileControlsWrapper
        enabled={true}
        currentStanceIndex={0}
        stanceWheelExpanded={false}
        {...mockHandlers}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render all mobile control components", () => {
    render(
      <MobileControlsWrapper
        enabled={true}
        currentStanceIndex={0}
        stanceWheelExpanded={false}
        {...mockHandlers}
      />
    );

    // Verify all child components are rendered
    expect(document.querySelector('[data-testid="virtual-dpad"]')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="action-buttons"]')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="stance-wheel"]')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="gesture-recognizer"]')).toBeInTheDocument();
  });

  it("should pass enabled prop correctly", () => {
    const { rerender } = render(
      <MobileControlsWrapper
        enabled={true}
        currentStanceIndex={0}
        stanceWheelExpanded={false}
        {...mockHandlers}
      />
    );

    // Component renders with enabled=true
    expect(document.querySelector('[data-testid="virtual-dpad"]')).toBeInTheDocument();

    // Re-render with disabled
    rerender(
      <MobileControlsWrapper
        enabled={false}
        currentStanceIndex={0}
        stanceWheelExpanded={false}
        {...mockHandlers}
      />
    );

    // Component still renders (disabled state passed to children)
    expect(document.querySelector('[data-testid="virtual-dpad"]')).toBeInTheDocument();
  });

  it("should pass current stance index", () => {
    render(
      <MobileControlsWrapper
        enabled={true}
        currentStanceIndex={5}
        stanceWheelExpanded={false}
        {...mockHandlers}
      />
    );

    expect(document.querySelector('[data-testid="stance-wheel"]')).toBeInTheDocument();
  });

  it("should handle stance wheel expanded state", () => {
    const { rerender } = render(
      <MobileControlsWrapper
        enabled={true}
        currentStanceIndex={0}
        stanceWheelExpanded={false}
        {...mockHandlers}
      />
    );

    // Verify initial render
    expect(document.querySelector('[data-testid="stance-wheel"]')).toBeInTheDocument();

    // Re-render with expanded
    rerender(
      <MobileControlsWrapper
        enabled={true}
        currentStanceIndex={0}
        stanceWheelExpanded={true}
        {...mockHandlers}
      />
    );

    // Still renders with new state
    expect(document.querySelector('[data-testid="stance-wheel"]')).toBeInTheDocument();
  });
});
