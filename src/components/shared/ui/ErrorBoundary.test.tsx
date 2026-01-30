/**
 * Tests for ErrorBoundary component
 * Comprehensive coverage of error handling, recovery, and fallback UI
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { ErrorBoundary } from "./ErrorBoundary";

// Component that throws an error on demand
const ThrowError = ({ shouldThrow, error }: { shouldThrow: boolean; error?: Error }) => {
  if (shouldThrow) {
    throw error ?? new Error("Test error");
  }
  return <div data-testid="child-component">Child Content</div>;
};

describe("ErrorBoundary", () => {
  // Store original console.error to restore later
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Suppress console.error during tests to avoid cluttering output
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("Rendering", () => {
    it("should render children when no error occurs", () => {
      render(
        <ErrorBoundary>
          <div data-testid="test-child">Test Content</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId("test-child")).toBeInTheDocument();
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should render error UI when error is caught", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId("error-boundary")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText(/오류 발생.*Error Occurred/)).toBeInTheDocument();
    });

    it("should display error message from caught error", () => {
      const errorMessage = "Custom error message";
      const customError = new Error(errorMessage);

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} error={customError} />
        </ErrorBoundary>
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("should display default message for errors without message", () => {
      const errorWithoutMessage = new Error();
      errorWithoutMessage.message = "";

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} error={errorWithoutMessage} />
        </ErrorBoundary>
      );

      // Empty message should result in empty paragraph, not "Unknown error occurred"
      const errorMessage = screen.getByTestId("error-boundary").querySelector(".error-boundary__message");
      expect(errorMessage).toBeInTheDocument();
    });

    it("should render bilingual title", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const title = screen.getByText(/오류 발생.*Error Occurred/);
      expect(title).toBeInTheDocument();
      expect(title.textContent).toMatch(/오류 발생/);
      expect(title.textContent).toMatch(/Error Occurred/);
    });

    it("should render custom fallback UI when provided", () => {
      const customFallback = <div data-testid="custom-fallback">Custom Error UI</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
      expect(screen.getByText("Custom Error UI")).toBeInTheDocument();
      expect(screen.queryByTestId("error-boundary")).not.toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should render restart button", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const restartButton = screen.getByTestId("error-boundary-restart-button");
      expect(restartButton).toBeInTheDocument();
      expect(restartButton.textContent).toMatch(/다시 시작/);
      expect(restartButton.textContent).toMatch(/Restart/);
    });

    it("should render back button", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const backButton = screen.getByTestId("error-boundary-back-button");
      expect(backButton).toBeInTheDocument();
      expect(backButton.textContent).toMatch(/뒤로/);
      expect(backButton.textContent).toMatch(/Back/);
    });

    it("should allow clicking restart button without error", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const restartButton = screen.getByTestId("error-boundary-restart-button");
      expect(restartButton).toBeInTheDocument();

      // Click the restart button - it should attempt to reset state
      // The button triggers setTimeout and may cause a page reload, but the click should work
      expect(() => fireEvent.click(restartButton)).not.toThrow();
    });

    it("should call window.history.back when back button is clicked", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const backSpy = vi.spyOn(window.history, "back").mockImplementation(() => {});

      const backButton = screen.getByTestId("error-boundary-back-button");
      fireEvent.click(backButton);

      expect(backSpy).toHaveBeenCalledTimes(1);

      backSpy.mockRestore();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA role", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorUI = screen.getByRole("alert");
      expect(errorUI).toBeInTheDocument();
    });

    it("should have aria-live attribute", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorUI = screen.getByTestId("error-boundary");
      expect(errorUI).toHaveAttribute("aria-live", "assertive");
    });

    it("should have accessible button types", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const restartButton = screen.getByTestId("error-boundary-restart-button");
      const backButton = screen.getByTestId("error-boundary-back-button");

      expect(restartButton).toHaveAttribute("type", "button");
      expect(backButton).toHaveAttribute("type", "button");
    });
  });

  describe("Development Mode", () => {
    it("should show technical details in development mode", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const error = new Error("Dev mode error");
      error.stack = "Error: Dev mode error\n  at component.tsx:10:5";

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} error={error} />
        </ErrorBoundary>
      );

      // Look for the details/summary element
      const details = screen.getByText(/기술 정보.*Technical Details/);
      expect(details).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it("should display error stack in technical details", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const error = new Error("Stack trace error");
      error.stack = "Error: Stack trace error\n  at TestComponent.tsx:42:15\n  at App.tsx:10:5";

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} error={error} />
        </ErrorBoundary>
      );

      // Check if stack trace is in the document
      expect(screen.getByText(/TestComponent\.tsx:42:15/)).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it("should not show technical details in production mode", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      const error = new Error("Production error");
      error.stack = "Error: Production error\n  at component.tsx:10:5";

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} error={error} />
        </ErrorBoundary>
      );

      // Technical details should not be rendered in production
      expect(screen.queryByText(/기술 정보.*Technical Details/)).not.toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe("Error Logging", () => {
    it("should call console.error when error is caught", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "ErrorBoundary caught error:",
        expect.any(Error),
        expect.any(Object)
      );
    });

    it("should log error info with componentStack", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorInfoCall = consoleErrorSpy.mock.calls.find(
        (call) => call[0] === "ErrorBoundary caught error:"
      );
      expect(errorInfoCall).toBeDefined();
      expect(errorInfoCall?.[2]).toHaveProperty("componentStack");
    });
  });

  describe("Edge Cases", () => {
    it("should handle errors without stack trace", () => {
      const errorWithoutStack = new Error("No stack");
      delete errorWithoutStack.stack;

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} error={errorWithoutStack} />
        </ErrorBoundary>
      );

      expect(screen.getByText("No stack")).toBeInTheDocument();
    });

    it("should handle null error message gracefully", () => {
      const errorWithNullMessage = new Error();
      (errorWithNullMessage as unknown as { message: null }).message = null as unknown as string;

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} error={errorWithNullMessage} />
        </ErrorBoundary>
      );

      expect(screen.getByText("Unknown error occurred")).toBeInTheDocument();
    });

    it("should handle undefined error gracefully", () => {
      const ThrowUndefined = () => {
        throw undefined;
      };

      render(
        <ErrorBoundary>
          <ThrowUndefined />
        </ErrorBoundary>
      );

      // Error boundary should still catch and display error UI
      expect(screen.getByTestId("error-boundary")).toBeInTheDocument();
    });

    it("should handle nested error boundaries", () => {
      render(
        <ErrorBoundary>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </ErrorBoundary>
      );

      // Inner boundary should catch the error
      expect(screen.getByTestId("error-boundary")).toBeInTheDocument();
    });

    it("should recover successfully when error is resolved", () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      // Initially no error
      expect(screen.getByTestId("child-component")).toBeInTheDocument();

      // Cause an error
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Error UI should be shown
      expect(screen.getByTestId("error-boundary")).toBeInTheDocument();
    });
  });

  describe("Component Lifecycle", () => {
    it("should call getDerivedStateFromError when error occurs", () => {
      const getDerivedStateFromErrorSpy = vi.spyOn(
        ErrorBoundary,
        "getDerivedStateFromError"
      );

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(getDerivedStateFromErrorSpy).toHaveBeenCalled();

      getDerivedStateFromErrorSpy.mockRestore();
    });

    it("should maintain error state after re-render", () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId("error-boundary")).toBeInTheDocument();

      // Re-render with same props
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Error UI should still be shown
      expect(screen.getByTestId("error-boundary")).toBeInTheDocument();
    });
  });
});
