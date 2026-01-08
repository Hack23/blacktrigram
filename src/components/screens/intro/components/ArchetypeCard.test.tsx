import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PlayerArchetype } from "../../../../../types/common";
import { KOREAN_COLORS } from "../../../../../types/constants";
import { ArchetypeCard, ArchetypeCardData } from "./ArchetypeCard";

const mockArchetypeData: ArchetypeCardData = {
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
};

describe("ArchetypeCard", () => {
  it("should render archetype name in Korean and English", () => {
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={false}
        onSelect={vi.fn()}
      />
    );

    const name = screen.getByTestId("archetype-name");
    expect(name).toBeInTheDocument();
    expect(name.textContent).toContain("무사 (Musa)");
    expect(name.textContent).toContain("Traditional Warrior");
  });

  it("should render archetype philosophy in both languages", () => {
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={false}
        onSelect={vi.fn()}
      />
    );

    const philosophy = screen.getByTestId("archetype-philosophy");
    expect(philosophy).toBeInTheDocument();
    expect(philosophy.textContent).toContain("명예와 정의의 길");
    expect(philosophy.textContent).toContain("The way of honor and justice");
  });

  it("should render all four stat bars", () => {
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={false}
        onSelect={vi.fn()}
      />
    );

    const stats = screen.getByTestId("archetype-stats");
    expect(stats).toBeInTheDocument();

    // Check for all stat bars
    expect(screen.getByTestId("stat-bar-공격")).toBeInTheDocument();
    expect(screen.getByTestId("stat-bar-방어")).toBeInTheDocument();
    expect(screen.getByTestId("stat-bar-속도")).toBeInTheDocument();
    expect(screen.getByTestId("stat-bar-기술")).toBeInTheDocument();
  });

  it("should render special abilities when provided", () => {
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={false}
        onSelect={vi.fn()}
      />
    );

    const abilityList = screen.getByTestId("ability-list");
    expect(abilityList).toBeInTheDocument();
  });

  it("should call onSelect when card is clicked and not selected", () => {
    const onSelect = vi.fn();
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={false}
        onSelect={onSelect}
      />
    );

    const card = screen.getByTestId(`archetype-card-${PlayerArchetype.MUSA}`);
    fireEvent.click(card);

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("should not call onSelect when card is clicked and already selected", () => {
    const onSelect = vi.fn();
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={true}
        onSelect={onSelect}
      />
    );

    const card = screen.getByTestId(`archetype-card-${PlayerArchetype.MUSA}`);
    fireEvent.click(card);

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("should show selected badge when isSelected is true", () => {
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={true}
        onSelect={vi.fn()}
      />
    );

    const badge = screen.getByTestId("selected-badge");
    expect(badge).toBeInTheDocument();
    expect(badge.textContent).toBe("선택됨 | Selected");
  });

  it("should not show selected badge when isSelected is false", () => {
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={false}
        onSelect={vi.fn()}
      />
    );

    const badge = screen.queryByTestId("selected-badge");
    expect(badge).not.toBeInTheDocument();
  });

  it("should show select button when selected and showSelectButton is true", () => {
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={true}
        onSelect={vi.fn()}
        onConfirm={vi.fn()}
        showSelectButton={true}
      />
    );

    const button = screen.getByTestId(`select-button-${PlayerArchetype.MUSA}`);
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe("선택 | Select");
  });

  it("should not show select button when not selected", () => {
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={false}
        onSelect={vi.fn()}
        onConfirm={vi.fn()}
        showSelectButton={true}
      />
    );

    const button = screen.queryByTestId(`select-button-${PlayerArchetype.MUSA}`);
    expect(button).not.toBeInTheDocument();
  });

  it("should call onConfirm when select button is clicked", () => {
    const onConfirm = vi.fn();
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={true}
        onSelect={vi.fn()}
        onConfirm={onConfirm}
        showSelectButton={true}
      />
    );

    const button = screen.getByTestId(`select-button-${PlayerArchetype.MUSA}`);
    fireEvent.click(button);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("should apply scale transformation when selected", () => {
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={true}
        onSelect={vi.fn()}
      />
    );

    const card = screen.getByTestId(`archetype-card-${PlayerArchetype.MUSA}`);
    expect(card).toHaveStyle({ transform: "scale(1.05)" });
  });

  it("should not apply scale transformation when not selected", () => {
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={false}
        onSelect={vi.fn()}
      />
    );

    const card = screen.getByTestId(`archetype-card-${PlayerArchetype.MUSA}`);
    expect(card).toHaveStyle({ transform: "scale(1)" });
  });

  it("should render archetype image", () => {
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={false}
        onSelect={vi.fn()}
      />
    );

    const image = screen.getByTestId("archetype-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/assets/visual/archetypes/musa.png");
    expect(image).toHaveAttribute("alt", "무사 (Musa) - Traditional Warrior");
  });

  it("should handle keyboard navigation with Enter key", () => {
    const onSelect = vi.fn();
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={false}
        onSelect={onSelect}
      />
    );

    const card = screen.getByTestId(`archetype-card-${PlayerArchetype.MUSA}`);
    fireEvent.keyDown(card, { key: "Enter" });

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("should handle keyboard navigation with Space key", () => {
    const onSelect = vi.fn();
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={false}
        onSelect={onSelect}
      />
    );

    const card = screen.getByTestId(`archetype-card-${PlayerArchetype.MUSA}`);
    fireEvent.keyDown(card, { key: " " });

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("should render in mobile mode with adjusted dimensions", () => {
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={false}
        onSelect={vi.fn()}
        isMobile={true}
      />
    );

    const card = screen.getByTestId(`archetype-card-${PlayerArchetype.MUSA}`);
    expect(card).toBeInTheDocument();
    // Mobile adjusts internal spacing and font sizes, card renders with mobile=true
  });

  it("should use custom width when provided", () => {
    render(
      <ArchetypeCard
        data={mockArchetypeData}
        isSelected={false}
        onSelect={vi.fn()}
        width={500}
      />
    );

    const card = screen.getByTestId(`archetype-card-${PlayerArchetype.MUSA}`);
    expect(card).toHaveStyle({ width: "500px" });
  });
});
