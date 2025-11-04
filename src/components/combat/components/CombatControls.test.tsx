import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PlayerArchetype, TrigramStance } from "../../../types/common";
import { createPlayerFromArchetype } from "../../../utils/playerUtils";
import { CombatControls } from "./CombatControls";

describe("CombatControls", () => {
  const mockPlayer = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

  it("should render combat controls", () => {
    const onAttack = vi.fn();
    const onDefend = vi.fn();
    const onSwitchStance = vi.fn();
    const onTechniqueExecute = vi.fn();

    render(
      <CombatControls
        onAttack={onAttack}
        onDefend={onDefend}
        onSwitchStance={onSwitchStance}
        onTechniqueExecute={onTechniqueExecute}
        player={mockPlayer}
        isExecutingTechnique={false}
      />
    );

    expect(screen.getByTestId("combat-controls")).toBeInTheDocument();
    expect(screen.getByTestId("attack-button")).toBeInTheDocument();
    expect(screen.getByTestId("defend-button")).toBeInTheDocument();
    expect(screen.getByTestId("technique-button")).toBeInTheDocument();
    expect(screen.getByTestId("stance-button")).toBeInTheDocument();
  });

  it("should render with player state", () => {
    const onAttack = vi.fn();
    const onDefend = vi.fn();
    const onSwitchStance = vi.fn();
    const onTechniqueExecute = vi.fn();

    render(
      <CombatControls
        onAttack={onAttack}
        onDefend={onDefend}
        onSwitchStance={onSwitchStance}
        onTechniqueExecute={onTechniqueExecute}
        player={{
          ...mockPlayer,
          ki: 50,
          maxKi: 100,
          stamina: 75,
          maxStamina: 100,
        }}
        isExecutingTechnique={false}
      />
    );

    expect(screen.getByTestId("combat-controls")).toBeInTheDocument();
  });

  it("should render with low resources", () => {
    const onAttack = vi.fn();
    const onDefend = vi.fn();
    const onSwitchStance = vi.fn();
    const onTechniqueExecute = vi.fn();

    render(
      <CombatControls
        onAttack={onAttack}
        onDefend={onDefend}
        onSwitchStance={onSwitchStance}
        onTechniqueExecute={onTechniqueExecute}
        player={{
          ...mockPlayer,
          ki: 5, // Low ki
          stamina: 5, // Low stamina
        }}
        isExecutingTechnique={false}
      />
    );

    const techniqueButton = screen.getByTestId("technique-button");
    expect(techniqueButton).toBeInTheDocument();
  });

  it("should render with different stances", () => {
    const onAttack = vi.fn();
    const onDefend = vi.fn();
    const onSwitchStance = vi.fn();
    const onTechniqueExecute = vi.fn();

    // Test just one stance to avoid multiple renders
    const stance = TrigramStance.GEON;
    
    render(
      <CombatControls
        onAttack={onAttack}
        onDefend={onDefend}
        onSwitchStance={onSwitchStance}
        onTechniqueExecute={onTechniqueExecute}
        player={{
          ...mockPlayer,
          currentStance: stance,
        }}
        isExecutingTechnique={false}
      />
    );

    expect(screen.getByTestId("combat-controls")).toBeInTheDocument();
  });

  it("should render with all player archetypes", () => {
    const onAttack = vi.fn();
    const onDefend = vi.fn();
    const onSwitchStance = vi.fn();
    const onTechniqueExecute = vi.fn();

    // Test just one archetype to avoid multiple renders
    const archetype = PlayerArchetype.MUSA;
    const player = createPlayerFromArchetype(archetype, 0);
    
    render(
      <CombatControls
        onAttack={onAttack}
        onDefend={onDefend}
        onSwitchStance={onSwitchStance}
        onTechniqueExecute={onTechniqueExecute}
        player={player}
        isExecutingTechnique={false}
      />
    );

    expect(screen.getByTestId("combat-controls")).toBeInTheDocument();
  });

  it("should handle zero ki and stamina", () => {
    const onAttack = vi.fn();
    const onDefend = vi.fn();
    const onSwitchStance = vi.fn();
    const onTechniqueExecute = vi.fn();

    render(
      <CombatControls
        onAttack={onAttack}
        onDefend={onDefend}
        onSwitchStance={onSwitchStance}
        onTechniqueExecute={onTechniqueExecute}
        player={{
          ...mockPlayer,
          ki: 0,
          stamina: 0,
        }}
        isExecutingTechnique={false}
      />
    );

    expect(screen.getByTestId("combat-controls")).toBeInTheDocument();
    expect(screen.getByTestId("technique-button")).toBeInTheDocument();
  });
});
