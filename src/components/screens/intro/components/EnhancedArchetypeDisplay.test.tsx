import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KOREAN_COLORS } from "../../../../types/constants";
import { EnhancedArchetypeDisplay, EnhancedArchetypeDisplayProps } from "./EnhancedArchetypeDisplay";
import { ArchetypeDataShape } from "./ArchetypeDisplayHTML";

const mockArchetypeData: ArchetypeDataShape[] = [
  {
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
];

describe("EnhancedArchetypeDisplay", () => {
  const defaultProps: EnhancedArchetypeDisplayProps = {
    archetypes: mockArchetypeData,
    selectedIndex: 0,
    onArchetypeChange: vi.fn(),
    onPlaySFX: vi.fn(),
    width: 800,
    height: 300,
    isMobile: false,
    allowDetailedView: true,
  };

  it("should render in compact view by default", () => {
    render(<EnhancedArchetypeDisplay {...defaultProps} />);

    // Should show compact view (ArchetypeDisplayHTML)
    expect(screen.getByTestId("archetype-display-container")).toBeInTheDocument();
  });

  it("should show view toggle button when allowDetailedView is true", () => {
    render(<EnhancedArchetypeDisplay {...defaultProps} />);

    const toggleButton = screen.getByTestId("view-toggle-button");
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton.textContent).toBe("상세 보기 | Detailed View");
  });

  it("should not show view toggle button on mobile", () => {
    render(<EnhancedArchetypeDisplay {...defaultProps} isMobile={true} />);

    const toggleButton = screen.queryByTestId("view-toggle-button");
    expect(toggleButton).not.toBeInTheDocument();
  });

  it("should not show view toggle button when allowDetailedView is false", () => {
    render(
      <EnhancedArchetypeDisplay {...defaultProps} allowDetailedView={false} />
    );

    const toggleButton = screen.queryByTestId("view-toggle-button");
    expect(toggleButton).not.toBeInTheDocument();
  });

  it("should toggle to detailed view when button is clicked", () => {
    render(<EnhancedArchetypeDisplay {...defaultProps} />);

    const toggleButton = screen.getByTestId("view-toggle-button");
    fireEvent.click(toggleButton);

    // Should now show detailed view (ArchetypeCardGrid)
    expect(screen.getByTestId("archetype-card-grid")).toBeInTheDocument();
  });

  it("should play SFX when toggling view", () => {
    const onPlaySFX = vi.fn();
    render(<EnhancedArchetypeDisplay {...defaultProps} onPlaySFX={onPlaySFX} />);

    const toggleButton = screen.getByTestId("view-toggle-button");
    fireEvent.click(toggleButton);

    expect(onPlaySFX).toHaveBeenCalledWith("menu_hover");
  });

  it("should change toggle button text when in detailed view", () => {
    render(<EnhancedArchetypeDisplay {...defaultProps} />);

    const toggleButton = screen.getByTestId("view-toggle-button");
    fireEvent.click(toggleButton);

    expect(toggleButton.textContent).toBe("간단 보기 | Compact View");
  });

  it("should toggle back to compact view when clicking button again", () => {
    render(<EnhancedArchetypeDisplay {...defaultProps} />);

    const toggleButton = screen.getByTestId("view-toggle-button");

    // Toggle to detailed
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("archetype-card-grid")).toBeInTheDocument();

    // Toggle back to compact
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("archetype-display-container")).toBeInTheDocument();
  });

  it("should transform archetype data to card format for detailed view", () => {
    render(<EnhancedArchetypeDisplay {...defaultProps} />);

    const toggleButton = screen.getByTestId("view-toggle-button");
    fireEvent.click(toggleButton);

    // Check that cards are rendered with transformed data
    expect(screen.getByTestId("archetype-card-musa")).toBeInTheDocument();
    expect(screen.getByTestId("archetype-card-amsalja")).toBeInTheDocument();
  });

  it("should pass through specialAbilities from archetype data", () => {
    render(<EnhancedArchetypeDisplay {...defaultProps} />);

    const toggleButton = screen.getByTestId("view-toggle-button");
    fireEvent.click(toggleButton);

    // Check that abilities are displayed (from AbilityList component)
    const abilityLists = screen.getAllByTestId("ability-list");
    expect(abilityLists.length).toBeGreaterThan(0);
  });

  it("should handle missing specialAbilities gracefully", () => {
    const dataWithoutAbilities: ArchetypeDataShape[] = [
      {
        ...mockArchetypeData[0],
        specialAbilities: undefined,
      },
    ];

    render(
      <EnhancedArchetypeDisplay
        {...defaultProps}
        archetypes={dataWithoutAbilities}
      />
    );

    const toggleButton = screen.getByTestId("view-toggle-button");
    fireEvent.click(toggleButton);

    // Should render without error
    expect(screen.getByTestId("archetype-card-musa")).toBeInTheDocument();
  });

  it("should call onArchetypeChange when archetype is changed in compact view", () => {
    const onArchetypeChange = vi.fn();
    render(
      <EnhancedArchetypeDisplay
        {...defaultProps}
        onArchetypeChange={onArchetypeChange}
      />
    );

    const nextButton = screen.getByTestId("next-archetype-button");
    fireEvent.click(nextButton);

    expect(onArchetypeChange).toHaveBeenCalledWith(1);
  });

  it("should call onArchetypeChange when archetype is changed in detailed view", () => {
    const onArchetypeChange = vi.fn();
    render(
      <EnhancedArchetypeDisplay
        {...defaultProps}
        onArchetypeChange={onArchetypeChange}
      />
    );

    // Toggle to detailed view
    const toggleButton = screen.getByTestId("view-toggle-button");
    fireEvent.click(toggleButton);

    // Click on a different archetype card
    const amsaljaCard = screen.getByTestId("archetype-card-amsalja");
    fireEvent.click(amsaljaCard);

    expect(onArchetypeChange).toHaveBeenCalledWith(1);
  });

  it("should maintain selected archetype when toggling views", () => {
    render(<EnhancedArchetypeDisplay {...defaultProps} selectedIndex={1} />);

    const toggleButton = screen.getByTestId("view-toggle-button");

    // Toggle to detailed view
    fireEvent.click(toggleButton);

    // Check that correct archetype is selected
    const amsaljaCard = screen.getByTestId("archetype-card-amsalja");
    expect(amsaljaCard).toHaveAttribute("aria-pressed", "true");

    // Toggle back to compact
    fireEvent.click(toggleButton);

    // Check that correct archetype is still selected
    const archetypeTitle = screen.getByTestId("archetype-title");
    expect(archetypeTitle.textContent).toContain("암살자 (Amsalja)");
  });

  it("should use custom width and height for compact view", () => {
    render(
      <EnhancedArchetypeDisplay {...defaultProps} width={1000} height={400} />
    );

    const displayContainer = screen.getByTestId("archetype-display-container");
    expect(displayContainer).toHaveStyle({ width: "1000px", height: "400px" });
  });

  it("should use increased height for detailed view", () => {
    render(<EnhancedArchetypeDisplay {...defaultProps} height={300} />);

    const toggleButton = screen.getByTestId("view-toggle-button");
    fireEvent.click(toggleButton);

    const gridContainer = screen.getByTestId("archetype-card-grid");
    // Detailed view should use at least 600px or 2x the compact height
    expect(gridContainer).toHaveStyle({ minHeight: "600px" });
  });

  it("should correctly map archetype enum from id", () => {
    render(<EnhancedArchetypeDisplay {...defaultProps} />);

    const toggleButton = screen.getByTestId("view-toggle-button");
    fireEvent.click(toggleButton);

    // Should find and render the correct archetype enum
    expect(screen.getByTestId("archetype-card-musa")).toBeInTheDocument();
  });

  it("should handle archetype change from card selection", () => {
    const onArchetypeChange = vi.fn();
    render(
      <EnhancedArchetypeDisplay
        {...defaultProps}
        selectedIndex={0}
        onArchetypeChange={onArchetypeChange}
      />
    );

    const toggleButton = screen.getByTestId("view-toggle-button");
    fireEvent.click(toggleButton);

    const amsaljaCard = screen.getByTestId("archetype-card-amsalja");
    fireEvent.click(amsaljaCard);

    // Should convert back to index
    expect(onArchetypeChange).toHaveBeenCalledWith(1);
  });
});
