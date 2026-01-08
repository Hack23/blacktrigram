import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PlayerArchetype } from "../../../../../types/common";
import { KOREAN_COLORS } from "../../../../../types/constants";
import { ArchetypeCardGrid, ArchetypeCardGridProps } from "./ArchetypeCardGrid";
import { ArchetypeCardData } from "./ArchetypeCard";

const mockArchetypeData: ArchetypeCardData[] = [
  {
    archetype: PlayerArchetype.MUSA,
    id: "musa",
    korean: "무사 (Musa)",
    english: "Traditional Warrior",
    description: "Path of the traditional warrior",
    color: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
    textureKey: "musa",
    stats: {
      attackPower: 85,
      defense: 90,
      speed: 70,
      technique: 80,
    },
    philosophy: {
      korean: "명예와 정의의 길",
      english: "The way of honor and justice",
    },
    specialAbilities: ["Honor Strike", "Defensive Mastery"],
  },
  {
    archetype: PlayerArchetype.AMSALJA,
    id: "amsalja",
    korean: "암살자 (Amsalja)",
    english: "Shadow Assassin",
    description: "Efficiency from the shadows",
    color: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
    textureKey: "amsalja",
    stats: {
      attackPower: 95,
      defense: 60,
      speed: 95,
      technique: 90,
    },
    philosophy: {
      korean: "침묵과 정확성의 도",
      english: "The way of silence and precision",
    },
    specialAbilities: ["Shadow Strike", "Vital Point Mastery"],
  },
  {
    archetype: PlayerArchetype.HACKER,
    id: "hacker",
    korean: "해커 (Hacker)",
    english: "Cyber Warrior",
    description: "Power through information",
    color: KOREAN_COLORS.PRIMARY_CYAN,
    textureKey: "hacker",
    stats: {
      attackPower: 75,
      defense: 70,
      speed: 85,
      technique: 95,
    },
    philosophy: {
      korean: "지식과 기술의 융합",
      english: "The fusion of knowledge and technology",
    },
    specialAbilities: ["System Override", "Digital Precision"],
  },
];

describe("ArchetypeCardGrid", () => {
  const defaultProps: ArchetypeCardGridProps = {
    archetypes: mockArchetypeData,
    selectedArchetype: PlayerArchetype.MUSA,
    onArchetypeChange: vi.fn(),
    onPlaySFX: vi.fn(),
    width: 900,
    height: 600,
    isMobile: false,
  };

  it("should render grid header with Korean and English text", () => {
    render(<ArchetypeCardGrid {...defaultProps} />);

    const header = screen.getByTestId("grid-header");
    expect(header).toBeInTheDocument();
    expect(header.textContent).toBe("원형 선택 | Select Archetype");
  });

  it("should render hint text for keyboard navigation", () => {
    render(<ArchetypeCardGrid {...defaultProps} />);

    const hint = screen.getByTestId("grid-hint");
    expect(hint).toBeInTheDocument();
    expect(hint.textContent).toContain("Arrow keys to navigate");
  });

  it("should render all archetype cards", () => {
    render(<ArchetypeCardGrid {...defaultProps} />);

    expect(screen.getByTestId("archetype-card-musa")).toBeInTheDocument();
    expect(screen.getByTestId("archetype-card-amsalja")).toBeInTheDocument();
    expect(screen.getByTestId("archetype-card-hacker")).toBeInTheDocument();
  });

  it("should call onArchetypeChange when card is clicked", () => {
    const onArchetypeChange = vi.fn();
    render(
      <ArchetypeCardGrid
        {...defaultProps}
        onArchetypeChange={onArchetypeChange}
      />
    );

    const amsaljaCard = screen.getByTestId("archetype-card-amsalja");
    fireEvent.click(amsaljaCard);

    expect(onArchetypeChange).toHaveBeenCalledWith(PlayerArchetype.AMSALJA);
  });

  it("should play SFX when card is selected", () => {
    const onPlaySFX = vi.fn();
    render(<ArchetypeCardGrid {...defaultProps} onPlaySFX={onPlaySFX} />);

    const hackerCard = screen.getByTestId("archetype-card-hacker");
    fireEvent.click(hackerCard);

    expect(onPlaySFX).toHaveBeenCalledWith("menu_hover");
  });

  it("should handle ArrowRight keyboard navigation", () => {
    const onArchetypeChange = vi.fn();
    render(
      <ArchetypeCardGrid
        {...defaultProps}
        onArchetypeChange={onArchetypeChange}
      />
    );

    const grid = screen.getByTestId("archetype-card-grid");
    fireEvent.keyDown(grid, { key: "ArrowRight" });

    expect(onArchetypeChange).toHaveBeenCalledWith(PlayerArchetype.AMSALJA);
  });

  it("should handle ArrowLeft keyboard navigation", () => {
    const onArchetypeChange = vi.fn();
    render(
      <ArchetypeCardGrid
        {...defaultProps}
        selectedArchetype={PlayerArchetype.AMSALJA}
        onArchetypeChange={onArchetypeChange}
      />
    );

    const grid = screen.getByTestId("archetype-card-grid");
    fireEvent.keyDown(grid, { key: "ArrowLeft" });

    expect(onArchetypeChange).toHaveBeenCalledWith(PlayerArchetype.MUSA);
  });

  it("should handle ArrowDown keyboard navigation", () => {
    const onArchetypeChange = vi.fn();
    render(
      <ArchetypeCardGrid
        {...defaultProps}
        onArchetypeChange={onArchetypeChange}
      />
    );

    const grid = screen.getByTestId("archetype-card-grid");
    fireEvent.keyDown(grid, { key: "ArrowDown" });

    expect(onArchetypeChange).toHaveBeenCalledWith(PlayerArchetype.AMSALJA);
  });

  it("should handle ArrowUp keyboard navigation", () => {
    const onArchetypeChange = vi.fn();
    render(
      <ArchetypeCardGrid
        {...defaultProps}
        selectedArchetype={PlayerArchetype.AMSALJA}
        onArchetypeChange={onArchetypeChange}
      />
    );

    const grid = screen.getByTestId("archetype-card-grid");
    fireEvent.keyDown(grid, { key: "ArrowUp" });

    expect(onArchetypeChange).toHaveBeenCalledWith(PlayerArchetype.MUSA);
  });

  it("should handle Enter key to confirm selection", () => {
    const onArchetypeConfirm = vi.fn();
    render(
      <ArchetypeCardGrid
        {...defaultProps}
        onArchetypeConfirm={onArchetypeConfirm}
      />
    );

    const grid = screen.getByTestId("archetype-card-grid");
    fireEvent.keyDown(grid, { key: "Enter" });

    expect(onArchetypeConfirm).toHaveBeenCalledWith(PlayerArchetype.MUSA);
  });

  it("should wrap around to last archetype when pressing ArrowLeft on first", () => {
    const onArchetypeChange = vi.fn();
    render(
      <ArchetypeCardGrid
        {...defaultProps}
        selectedArchetype={PlayerArchetype.MUSA}
        onArchetypeChange={onArchetypeChange}
      />
    );

    const grid = screen.getByTestId("archetype-card-grid");
    fireEvent.keyDown(grid, { key: "ArrowLeft" });

    expect(onArchetypeChange).toHaveBeenCalledWith(PlayerArchetype.HACKER);
  });

  it("should wrap around to first archetype when pressing ArrowRight on last", () => {
    const onArchetypeChange = vi.fn();
    render(
      <ArchetypeCardGrid
        {...defaultProps}
        selectedArchetype={PlayerArchetype.HACKER}
        onArchetypeChange={onArchetypeChange}
      />
    );

    const grid = screen.getByTestId("archetype-card-grid");
    fireEvent.keyDown(grid, { key: "ArrowRight" });

    expect(onArchetypeChange).toHaveBeenCalledWith(PlayerArchetype.MUSA);
  });

  it("should calculate 1 column for mobile layout", () => {
    render(<ArchetypeCardGrid {...defaultProps} isMobile={true} width={400} />);

    const container = screen.getByTestId("card-grid-container");
    expect(container).toHaveStyle({ gridTemplateColumns: "repeat(1, 1fr)" });
  });

  it("should calculate 2 columns for standard desktop width", () => {
    render(<ArchetypeCardGrid {...defaultProps} width={1000} />);

    const container = screen.getByTestId("card-grid-container");
    expect(container).toHaveStyle({ gridTemplateColumns: "repeat(2, 1fr)" });
  });

  it("should calculate 3 columns for large desktop width", () => {
    render(<ArchetypeCardGrid {...defaultProps} width={1500} />);

    const container = screen.getByTestId("card-grid-container");
    expect(container).toHaveStyle({ gridTemplateColumns: "repeat(3, 1fr)" });
  });

  it("should show mobile hint text when on mobile", () => {
    render(<ArchetypeCardGrid {...defaultProps} isMobile={true} />);

    const hint = screen.getByTestId("grid-hint");
    expect(hint.textContent).toBe("카드를 탭하여 선택");
  });

  it("should show desktop hint text when not on mobile", () => {
    render(<ArchetypeCardGrid {...defaultProps} isMobile={false} />);

    const hint = screen.getByTestId("grid-hint");
    expect(hint.textContent).toContain(
      "화살표 키로 탐색, 엔터로 확인 | Arrow keys to navigate, Enter to confirm"
    );
  });

  it("should not show footer hint on mobile", () => {
    render(<ArchetypeCardGrid {...defaultProps} isMobile={true} />);

    const footer = screen.queryByTestId("grid-footer");
    expect(footer).not.toBeInTheDocument();
  });

  it("should show footer hint on desktop", () => {
    render(<ArchetypeCardGrid {...defaultProps} isMobile={false} />);

    const footer = screen.getByTestId("grid-footer");
    expect(footer).toBeInTheDocument();
  });

  it("should not call onArchetypeConfirm when Enter pressed without callback", () => {
    render(<ArchetypeCardGrid {...defaultProps} onArchetypeConfirm={undefined} />);

    const grid = screen.getByTestId("archetype-card-grid");
    // Should not throw error
    fireEvent.keyDown(grid, { key: "Enter" });
  });

  it("should have tabIndex for keyboard focus", () => {
    render(<ArchetypeCardGrid {...defaultProps} />);

    const grid = screen.getByTestId("archetype-card-grid");
    expect(grid).toHaveAttribute("tabIndex", "0");
  });

  it("should have proper ARIA attributes for accessibility", () => {
    render(<ArchetypeCardGrid {...defaultProps} />);

    const grid = screen.getByTestId("archetype-card-grid");
    expect(grid).toHaveAttribute("role", "region");
    expect(grid).toHaveAttribute("aria-label", "Archetype selection grid");
  });
});
