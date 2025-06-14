import { CombatState } from "../../types/enums";
import { renderWithPixi, screen, fireEvent } from "../../test/test-utils";
import { TrigramStance, PlayerArchetype } from "@/types/enums";
import type { PlayerState } from "../../../types/player";
import Player from "./Player";

const mockPlayerState: PlayerState = {
  id: "test-player",
  name: { korean: "테스트", english: "Test" },
  archetype: PlayerArchetype.MUSA,
  health: 100,
  maxHealth: 100,
  ki: 100,
  maxKi: 100,
  stamina: 100,
  maxStamina: 100,
  energy: 100,
  maxEnergy: 100,
  attackPower: 50,
  defense: 50,
  speed: 50,
  technique: 50, // Fix: Use number instead of null
  pain: 0,
  consciousness: 100,
  balance: 100,
  momentum: 0, // Fix: Use number instead of Position
  currentStance: TrigramStance.GEON,
  position: { x: 100, y: 100 },
  isBlocking: false,
  isStunned: false,
  isCountering: false,
  lastActionTime: 0,
  recoveryTime: 0,
  statusEffects: [],
  activeEffects: [],
  combatState: CombatState.IDLE,
  lastStanceChangeTime: 0,
  vitalPoints: [],
  totalDamageReceived: 0,
  totalDamageDealt: 0,
  hitsTaken: 0,
  hitsLanded: 0,
  perfectStrikes: 0,
  vitalPointHits: 0,
};

describe("Player", () => {
  it("renders without crashing", () => {
    renderWithPixi(<Player player={mockPlayerState} x={100} y={100} />);
    expect(screen.getByTestId("player")).toBeInTheDocument();
  });

  it("displays player correctly", () => {
    renderWithPixi(<Player player={mockPlayerState} x={100} y={100} />);
    expect(screen.getByTestId("player")).toBeInTheDocument();
    expect(screen.getByText(mockPlayerState.name.korean)).toBeInTheDocument();
  });

  it("handles player interaction", () => {
    const mockOnInteract = vi.fn();
    renderWithPixi(
      <Player
        player={mockPlayerState}
        x={100}
        y={100}
        onInteract={mockOnInteract}
      />
    );

    const playerElement = screen.getByTestId("player");
    fireEvent.click(playerElement);
    expect(playerElement).toBeInTheDocument();
  });

  it("displays player stance correctly", () => {
    renderWithPixi(<Player player={mockPlayerState} x={100} y={100} />);
    expect(screen.getByTestId("player")).toBeInTheDocument();
  });
});
