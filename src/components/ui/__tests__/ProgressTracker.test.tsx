import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressTracker } from "../ProgressTracker";

describe("ProgressTracker", () => {
  const defaultProps = {
    label: "Test Progress",
    current: 50,
    maximum: 100,
  };

  it("should render progress information", () => {
    render(<ProgressTracker {...defaultProps} />);

    expect(screen.getByText("Test Progress")).toBeInTheDocument();
  });
});
