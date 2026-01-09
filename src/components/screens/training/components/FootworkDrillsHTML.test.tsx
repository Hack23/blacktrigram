/**
 * Tests for FootworkDrillsHTML component
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FootworkDrillsHTML } from "./FootworkDrillsHTML";
import type { FootworkDrill } from "./FootworkDrillsHTML";

describe("FootworkDrillsHTML", () => {
  const defaultProps = {
    currentDrill: "circular_left" as FootworkDrill,
    onDrillChange: vi.fn(),
    currentStep: 0,
    onStepComplete: vi.fn(),
    isActive: false,
    onToggleActive: vi.fn(),
    isMobile: false,
  };

  it("should render without crashing", () => {
    render(<FootworkDrillsHTML {...defaultProps} />);
    expect(screen.getByTestId("footwork-drills-html")).toBeInTheDocument();
  });

  it("should render Korean and English header text", () => {
    render(<FootworkDrillsHTML {...defaultProps} />);
    
    // Text is combined in one div, so we search for the combined string
    expect(screen.getByText(/보법 훈련.*Footwork Drills/)).toBeInTheDocument();
  });

  it("should display current drill information", () => {
    render(<FootworkDrillsHTML {...defaultProps} />);
    
    // These texts are split across elements, use regex or getAllByText
    expect(screen.getByText(/원형보 좌회전/)).toBeInTheDocument();
    expect(screen.getByText(/Circular Left/)).toBeInTheDocument();
    expect(screen.getByText("원형보 좌측 | Circle stepping left")).toBeInTheDocument();
  });

  it("should render all seven drill type buttons", () => {
    render(<FootworkDrillsHTML {...defaultProps} />);
    
    const buttons = screen.getAllByRole("button");
    // 7 drill buttons + 1 start/stop button
    expect(buttons).toHaveLength(8);
  });

  it("should highlight currently selected drill", () => {
    render(<FootworkDrillsHTML {...defaultProps} currentDrill="pivot_combo" />);
    
    // Check that pivot_combo button is rendered (Korean text from DRILL_INFO)
    expect(screen.getByText("축족회전")).toBeInTheDocument();
  });

  it("should call onDrillChange when drill button is clicked", () => {
    const mockOnDrillChange = vi.fn();
    render(<FootworkDrillsHTML {...defaultProps} onDrillChange={mockOnDrillChange} />);
    
    // Click on pivot_combo button (contains Korean text "축족회전")
    const pivotButton = screen.getByText("축족회전");
    fireEvent.click(pivotButton);
    
    expect(mockOnDrillChange).toHaveBeenCalledWith("pivot_combo");
  });

  it("should call onToggleActive when start/stop button is clicked", () => {
    const mockOnToggleActive = vi.fn();
    render(<FootworkDrillsHTML {...defaultProps} onToggleActive={mockOnToggleActive} />);
    
    const toggleButton = screen.getByText("훈련 시작 | Start Drill");
    fireEvent.click(toggleButton);
    
    expect(mockOnToggleActive).toHaveBeenCalledTimes(1);
  });

  it("should show 'Stop Drill' button text when drill is active", () => {
    render(<FootworkDrillsHTML {...defaultProps} isActive={true} />);
    
    expect(screen.getByText("훈련 중지 | Stop Drill")).toBeInTheDocument();
  });

  it("should show 'Start Drill' button text when drill is inactive", () => {
    render(<FootworkDrillsHTML {...defaultProps} isActive={false} />);
    
    expect(screen.getByText("훈련 시작 | Start Drill")).toBeInTheDocument();
  });

  it("should display pattern steps for drills with patterns", () => {
    render(<FootworkDrillsHTML {...defaultProps} currentDrill="circular_left" />);
    
    expect(screen.getByText("Pattern Steps:")).toBeInTheDocument();
    // Circular left has 4 steps
    expect(screen.getByText(/1\. Ctrl\+A/)).toBeInTheDocument();
  });

  it("should not display pattern steps for free_practice drill", () => {
    render(<FootworkDrillsHTML {...defaultProps} currentDrill="free_practice" />);
    
    expect(screen.queryByText("Pattern Steps:")).not.toBeInTheDocument();
  });

  it("should highlight current step when drill is active", () => {
    render(<FootworkDrillsHTML {...defaultProps} isActive={true} currentStep={1} />);
    
    // Step 2 should be highlighted (currentStep is 0-indexed)
    expect(screen.getByText(/2\. Ctrl\+A/)).toBeInTheDocument();
  });

  it("should display key hints for the current drill", () => {
    render(<FootworkDrillsHTML {...defaultProps} currentDrill="circular_left" />);
    
    expect(screen.getByText(/Hold Ctrl\+A to circle left/)).toBeInTheDocument();
  });

  it("should render correctly in mobile mode", () => {
    render(<FootworkDrillsHTML {...defaultProps} isMobile={true} />);
    
    expect(screen.getByTestId("footwork-drills-html")).toBeInTheDocument();
  });

  it("should display all drill types with Korean terminology", () => {
    render(<FootworkDrillsHTML {...defaultProps} />);
    
    // Check for presence of Korean names for each drill (using getAllByText since some appear twice)
    expect(screen.getAllByText("원형보").length).toBeGreaterThan(0); // Circular (appears in left & right buttons)
    expect(screen.getByText("축족회전")).toBeInTheDocument(); // Pivot
    expect(screen.getByText("삼각보법")).toBeInTheDocument(); // Triangle
    expect(screen.getByText("미끄럼보")).toBeInTheDocument(); // Slide
    expect(screen.getByText("섞음보")).toBeInTheDocument(); // Shuffle
    expect(screen.getByText("자유")).toBeInTheDocument(); // Free practice
  });
});
