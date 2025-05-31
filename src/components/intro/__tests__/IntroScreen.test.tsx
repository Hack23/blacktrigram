import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { IntroScreen } from "../IntroScreen";

// Mock PixiJS components by removing conflicting declarations
vi.mock("@pixi/react", () => ({
  Application: vi.fn(() => null),
  extend: vi.fn(),
  useExtend: vi.fn(),
  useApplication: vi.fn(() => ({ app: {} })),
  useTick: vi.fn(),
}));

describe("IntroScreen", () => {
  const mockOnGamePhaseChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the main title correctly", () => {
    render(<IntroScreen onGamePhaseChange={mockOnGamePhaseChange} />);

    expect(screen.getByText("흑괘 무술 도장")).toBeInTheDocument();
    expect(
      screen.getByText("Black Trigram Martial Arts Academy")
    ).toBeInTheDocument();
  });

  it("should render navigation buttons", () => {
    render(<IntroScreen onGamePhaseChange={mockOnGamePhaseChange} />);

    expect(screen.getByText("메뉴 (Menu)")).toBeInTheDocument();
    expect(screen.getByText("조작법 (Controls)")).toBeInTheDocument();
    expect(screen.getByText("철학 (Philosophy)")).toBeInTheDocument();
  });

  it("should switch between sections correctly", () => {
    render(<IntroScreen onGamePhaseChange={mockOnGamePhaseChange} />);

    // Click on Controls section
    fireEvent.click(screen.getByText("조작법 (Controls)"));
    expect(screen.getByText("조작법")).toBeInTheDocument();

    // Click on Philosophy section
    fireEvent.click(screen.getByText("철학 (Philosophy)"));
    expect(screen.getByText("팔괘 철학")).toBeInTheDocument();

    // Click back to Menu section
    fireEvent.click(screen.getByText("메뉴 (Menu)"));
    expect(screen.getByText("게임 모드 선택")).toBeInTheDocument();
  });

  it("should handle game phase changes from menu", () => {
    render(<IntroScreen onGamePhaseChange={mockOnGamePhaseChange} />);

    // Should start in menu section by default
    const trainingButton = screen.getByText(/수련 모드/);
    fireEvent.click(trainingButton);

    expect(mockOnGamePhaseChange).toHaveBeenCalledWith("training");
  });

  it("should show Korean martial arts terminology", () => {
    render(<IntroScreen onGamePhaseChange={mockOnGamePhaseChange} />);

    // Switch to philosophy section
    fireEvent.click(screen.getByText("철학 (Philosophy)"));

    // Should show trigram symbols and Korean names
    expect(screen.getByText("☰")).toBeInTheDocument(); // Heaven trigram
    expect(screen.getByText(/건/)).toBeInTheDocument(); // Korean name for Heaven
  });
});
