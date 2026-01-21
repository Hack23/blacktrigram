/**
 * Tests for AccessibilityProvider and useAccessibility hook
 */

import { render, screen, renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { AccessibilityProvider, useAccessibility } from "./AccessibilityProvider";

describe("AccessibilityProvider", () => {
  let matchMediaMock: any;

  beforeEach(() => {
    // Mock matchMedia
    matchMediaMock = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockReturnValue(matchMediaMock),
    });
  });

  afterEach(() => {
    // Clean up
    document.body.classList.remove("high-contrast");
  });

  it("should be defined and importable", () => {
    expect(AccessibilityProvider).toBeDefined();
    expect(typeof AccessibilityProvider).toBe("function");
  });

  it("should have proper display name", () => {
    expect(AccessibilityProvider.displayName).toBe("AccessibilityProvider");
  });

  it("should render children", () => {
    render(
      <AccessibilityProvider>
        <div data-testid="test-child">Test Child</div>
      </AccessibilityProvider>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });

  it("should provide default accessibility context", () => {
    const { result } = renderHook(() => useAccessibility(), {
      wrapper: AccessibilityProvider,
    });

    expect(result.current.highContrast).toBe(false);
    expect(result.current.reducedMotion).toBe(false);
    expect(typeof result.current.setHighContrast).toBe("function");
    expect(typeof result.current.toggleHighContrast).toBe("function");
  });

  it("should detect reduced motion preference", () => {
    matchMediaMock.matches = true;

    const { result } = renderHook(() => useAccessibility(), {
      wrapper: AccessibilityProvider,
    });

    expect(result.current.reducedMotion).toBe(true);
  });

  it("should toggle high contrast mode", () => {
    const { result } = renderHook(() => useAccessibility(), {
      wrapper: AccessibilityProvider,
    });

    expect(result.current.highContrast).toBe(false);

    act(() => {
      result.current.toggleHighContrast();
    });

    expect(result.current.highContrast).toBe(true);

    act(() => {
      result.current.toggleHighContrast();
    });

    expect(result.current.highContrast).toBe(false);
  });

  it("should set high contrast mode", () => {
    const { result } = renderHook(() => useAccessibility(), {
      wrapper: AccessibilityProvider,
    });

    expect(result.current.highContrast).toBe(false);

    act(() => {
      result.current.setHighContrast(true);
    });

    expect(result.current.highContrast).toBe(true);

    act(() => {
      result.current.setHighContrast(false);
    });

    expect(result.current.highContrast).toBe(false);
  });

  it("should apply high-contrast class to body when enabled", () => {
    const { result } = renderHook(() => useAccessibility(), {
      wrapper: AccessibilityProvider,
    });

    expect(document.body.classList.contains("high-contrast")).toBe(false);

    act(() => {
      result.current.setHighContrast(true);
    });

    expect(document.body.classList.contains("high-contrast")).toBe(true);

    act(() => {
      result.current.setHighContrast(false);
    });

    expect(document.body.classList.contains("high-contrast")).toBe(false);
  });

  it("should listen to prefers-reduced-motion changes", () => {
    let changeHandler: any = null;
    matchMediaMock.addEventListener = vi.fn((event, handler) => {
      if (event === "change") {
        changeHandler = handler;
      }
    });

    const { result } = renderHook(() => useAccessibility(), {
      wrapper: AccessibilityProvider,
    });

    expect(result.current.reducedMotion).toBe(false);

    // Simulate media query change
    if (changeHandler) {
      act(() => {
        changeHandler({ matches: true } as MediaQueryListEvent);
      });

      expect(result.current.reducedMotion).toBe(true);
    }
  });

  it("should throw error when useAccessibility is used outside provider", () => {
    // Suppress console.error for this test
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAccessibility());
    }).toThrow("useAccessibility must be used within AccessibilityProvider");

    consoleErrorSpy.mockRestore();
  });

  it("should clean up event listeners on unmount", () => {
    const { unmount } = renderHook(() => useAccessibility(), {
      wrapper: AccessibilityProvider,
    });

    expect(matchMediaMock.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));

    unmount();

    expect(matchMediaMock.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });
});
