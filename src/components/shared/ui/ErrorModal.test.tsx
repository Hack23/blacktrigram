/**
 * Test suite for ErrorModal component
 * Validates Korean-themed error dialog with retry/continue functionality
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorModal } from "./ErrorModal";

describe("ErrorModal", () => {
  it("should render error modal with bilingual message", () => {
    const mockRetry = vi.fn();
    const mockContinue = vi.fn();

    render(
      <ErrorModal
        message="Test error message | 테스트 오류 메시지"
        onRetry={mockRetry}
        onContinue={mockContinue}
      />
    );

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText(/Test error message/)).toBeInTheDocument();
  });

  it("should render Korean bilingual title", () => {
    const mockRetry = vi.fn();
    const mockContinue = vi.fn();

    render(
      <ErrorModal
        message="Error occurred"
        onRetry={mockRetry}
        onContinue={mockContinue}
      />
    );

    expect(screen.getByText("오류 발생 | Error Occurred")).toBeInTheDocument();
  });

  it("should call onRetry when retry button is clicked", async () => {
    const user = userEvent.setup();
    const mockRetry = vi.fn();
    const mockContinue = vi.fn();

    render(
      <ErrorModal
        message="Error message"
        onRetry={mockRetry}
        onContinue={mockContinue}
      />
    );

    const retryButton = screen.getByTestId("error-modal-retry");
    await user.click(retryButton);

    expect(mockRetry).toHaveBeenCalledTimes(1);
    expect(mockContinue).not.toHaveBeenCalled();
  });

  it("should call onContinue when continue button is clicked", async () => {
    const user = userEvent.setup();
    const mockRetry = vi.fn();
    const mockContinue = vi.fn();

    render(
      <ErrorModal
        message="Error message"
        onRetry={mockRetry}
        onContinue={mockContinue}
      />
    );

    const continueButton = screen.getByTestId("error-modal-continue");
    await user.click(continueButton);

    expect(mockContinue).toHaveBeenCalledTimes(1);
    expect(mockRetry).not.toHaveBeenCalled();
  });

  it("should have proper accessibility attributes", () => {
    const mockRetry = vi.fn();
    const mockContinue = vi.fn();

    render(
      <ErrorModal
        message="Error message"
        onRetry={mockRetry}
        onContinue={mockContinue}
      />
    );

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveAttribute("aria-labelledby", "error-modal-title");
    expect(dialog).toHaveAttribute("aria-describedby", "error-modal-description");

    expect(screen.getByText("오류 발생 | Error Occurred")).toHaveAttribute("id", "error-modal-title");
    expect(screen.getByText("Error message")).toHaveAttribute("id", "error-modal-description");
  });

  it("should render with proper testids", () => {
    const mockRetry = vi.fn();
    const mockContinue = vi.fn();

    render(
      <ErrorModal
        message="Error message"
        onRetry={mockRetry}
        onContinue={mockContinue}
      />
    );

    expect(screen.getByTestId("error-modal")).toBeInTheDocument();
    expect(screen.getByTestId("error-modal-retry")).toBeInTheDocument();
    expect(screen.getByTestId("error-modal-continue")).toBeInTheDocument();
  });

  it("should display bilingual button text", () => {
    const mockRetry = vi.fn();
    const mockContinue = vi.fn();

    render(
      <ErrorModal
        message="Error message"
        onRetry={mockRetry}
        onContinue={mockContinue}
      />
    );

    // BaseButtonHTML renders Korean and English in separate spans
    // Check for both texts separately
    expect(screen.getByText("재시도")).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
    expect(screen.getByText("무음으로 계속")).toBeInTheDocument();
    expect(screen.getByText("Continue Without Sound")).toBeInTheDocument();
  });

  it("should call onContinue when Escape key is pressed", async () => {
    const user = userEvent.setup();
    const mockRetry = vi.fn();
    const mockContinue = vi.fn();

    render(
      <ErrorModal
        message="Error message"
        onRetry={mockRetry}
        onContinue={mockContinue}
      />
    );

    // Press Escape key
    await user.keyboard("{Escape}");

    expect(mockContinue).toHaveBeenCalledTimes(1);
    expect(mockRetry).not.toHaveBeenCalled();
  });

  it("should focus retry button when modal opens", () => {
    const mockRetry = vi.fn();
    const mockContinue = vi.fn();

    render(
      <ErrorModal
        message="Error message"
        onRetry={mockRetry}
        onContinue={mockContinue}
      />
    );

    const retryButton = screen.getByTestId("error-modal-retry");
    expect(retryButton).toHaveFocus();
  });
});
