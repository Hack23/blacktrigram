/**
 * Unit tests for CombatScreen3D component
 * Tests the Three.js-based combat screen with 3D characters and effects
 */

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PlayerState } from "../../../systems";
import { PlayerArchetype, TrigramStance } from "../../../types/common";
import { createPlayerFromArchetype } from "../../../utils/playerUtils";
import { CombatScreen3D } from "./CombatScreen3D";

// Mock AudioProvider
vi.mock("../../../audio/AudioProvider", () => ({
  useAudio: () => ({
    isInitialized: true,
    isAudioReady: true,
    playMusic: vi.fn(),
    stopMusic: vi.fn(),
    playSFX: vi.fn(),
    setSFXVolume: vi.fn(),
    setMusicVolume: vi.fn(),
    fadeIn: vi.fn(() => Promise.resolve()),
    fadeOut: vi.fn(() => Promise.resolve()),
  }),
}));

// Mock Three.js Canvas and related components
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="three-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
  useThree: () => ({
    gl: {},
    scene: {},
    camera: {},
  }),
}));

// Mock @react-three/drei
vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay">{children}</div>
  ),
  OrbitControls: () => null,
}));

// Mock Three.js
vi.mock("three", () => ({
  Group: class MockGroup {},
  Mesh: class MockMesh {},
  Vector3: class MockVector3 {
    constructor(public x = 0, public y = 0, public z = 0) {}
    clone() {
      return new MockVector3(this.x, this.y, this.z);
    }
    add(v: MockVector3) {
      return new MockVector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    sub(v: MockVector3) {
      return new MockVector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    toArray() {
      return [this.x, this.y, this.z];
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    normalize() {
      const len = this.length();
      if (len > 0) {
        return new MockVector3(this.x / len, this.y / len, this.z / len);
      }
      return new MockVector3(0, 0, 0);
    }
    set(x: number, y: number, z: number) {
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    }
    copy(v: MockVector3) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      return this;
    }
  },
  Euler: class MockEuler {
    constructor(
      public x = 0,
      public y = 0,
      public z = 0,
      public order = "XYZ"
    ) {}
    clone() {
      return new MockEuler(this.x, this.y, this.z, this.order);
    }
    copy(e: MockEuler) {
      this.x = e.x;
      this.y = e.y;
      this.z = e.z;
      this.order = e.order;
      return this;
    }
    toArray() {
      return [this.x, this.y, this.z, this.order];
    }
    setFromQuaternion(_q: any) {
      return this;
    }
  },
  Quaternion: class MockQuaternion {
    constructor(public x = 0, public y = 0, public z = 0, public w = 1) {}
    setFromEuler(_e: any) {
      return this;
    }
    slerpQuaternions(_qa: any, _qb: any, _t: number) {
      return this;
    }
    setFromUnitVectors(_vFrom: any, _vTo: any) {
      return this;
    }
  },
  Raycaster: class MockRaycaster {
    set(_origin: any, _direction: any) {
      return this;
    }
    intersectObject(_object: any) {
      return [];
    }
    far = 1000;
  },
  MeshStandardMaterial: class MockMeshStandardMaterial {},
  DoubleSide: 2,
  Color: class MockColor {},
  BoxGeometry: class MockBoxGeometry {},
  SphereGeometry: class MockSphereGeometry {},
  CapsuleGeometry: class MockCapsuleGeometry {},
  BufferGeometry: class MockBufferGeometry {
    dispose() {}
  },
}));

describe("CombatScreen3D", () => {
  let mockPlayers: PlayerState[];
  let mockOnPlayerUpdate: (
    playerIndex: number,
    updates: Partial<PlayerState>
  ) => void;
  let mockOnReturnToMenu: () => void;
  let mockOnGameEnd: (winner: number) => void;

  beforeEach(() => {
    // Create two test players
    mockPlayers = [
      createPlayerFromArchetype(PlayerArchetype.MUSA, 0),
      createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1),
    ];

    // Create mock callbacks with proper types
    mockOnPlayerUpdate =
      vi.fn<(playerIndex: number, updates: Partial<PlayerState>) => void>();
    mockOnReturnToMenu = vi.fn<() => void>();
    mockOnGameEnd = vi.fn<(winner: number) => void>();
  });

  it("should render without crashing", () => {
    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render Three.js canvas", () => {
    render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(screen.getByTestId("three-canvas")).toBeInTheDocument();
  });

  it("should render with custom dimensions", () => {
    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
        width={1920}
        height={1080}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with default dimensions", () => {
    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render in paused state", () => {
    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={true}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render in unpaused state", () => {
    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with different round numbers", () => {
    const rounds = [1, 2, 3];

    rounds.forEach((round) => {
      const { unmount } = render(
        <CombatScreen3D
          players={mockPlayers}
          onPlayerUpdate={mockOnPlayerUpdate}
          currentRound={round}
          timeRemaining={120}
          isPaused={false}
          onReturnToMenu={mockOnReturnToMenu}
          onGameEnd={mockOnGameEnd}
        />
      );

      expect(screen.getByTestId("three-canvas")).toBeInTheDocument();
      unmount();
    });
  });

  it("should render with different time remaining values", () => {
    const times = [120, 60, 30, 10];

    times.forEach((time) => {
      const { unmount } = render(
        <CombatScreen3D
          players={mockPlayers}
          onPlayerUpdate={mockOnPlayerUpdate}
          currentRound={1}
          timeRemaining={time}
          isPaused={false}
          onReturnToMenu={mockOnReturnToMenu}
          onGameEnd={mockOnGameEnd}
        />
      );

      expect(screen.getByTestId("three-canvas")).toBeInTheDocument();
      unmount();
    });
  });

  it("should render with two players of different archetypes and show correct labels", () => {
    const players = [
      createPlayerFromArchetype(PlayerArchetype.MUSA, 0),
      createPlayerFromArchetype(PlayerArchetype.HACKER, 1),
    ];

    const { unmount } = render(
      <CombatScreen3D
        players={players}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(screen.getByTestId("three-canvas")).toBeInTheDocument();
    // Check for Korean-English archetype labels for both players
    expect(screen.getAllByText(/무사|Musa/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/해커|Hacker/i).length).toBeGreaterThan(0);
    unmount();
  });

  it("should render with two players of the same archetype and show correct label", () => {
    const players = [
      createPlayerFromArchetype(PlayerArchetype.AMSALJA, 0),
      createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1),
    ];

    const { unmount } = render(
      <CombatScreen3D
        players={players}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(screen.getByTestId("three-canvas")).toBeInTheDocument();
    // Check for Korean-English archetype label for both players
    expect(
      screen.getAllByText(/암살자|Amsalja/i).length
    ).toBeGreaterThanOrEqual(2);
    unmount();
  });

  it("should render with players having different stances", () => {
    const stances = [
      TrigramStance.GEON,
      TrigramStance.TAE,
      TrigramStance.LI,
      TrigramStance.JIN,
      TrigramStance.SON,
      TrigramStance.GAM,
      TrigramStance.GAN,
      TrigramStance.GON,
    ];

    stances.forEach((stance) => {
      const players = [
        { ...mockPlayers[0], currentStance: stance },
        { ...mockPlayers[1], currentStance: stance },
      ];

      const { unmount } = render(
        <CombatScreen3D
          players={players}
          onPlayerUpdate={mockOnPlayerUpdate}
          currentRound={1}
          timeRemaining={120}
          isPaused={false}
          onReturnToMenu={mockOnReturnToMenu}
          onGameEnd={mockOnGameEnd}
        />
      );

      expect(screen.getByTestId("three-canvas")).toBeInTheDocument();
      unmount();
    });
  });

  it("should render with players at low health", () => {
    const lowHealthPlayers = mockPlayers.map((player) => ({
      ...player,
      health: 10,
      maxHealth: 100,
    }));

    const { container } = render(
      <CombatScreen3D
        players={lowHealthPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with mobile dimensions", () => {
    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
        width={375}
        height={667}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with tablet dimensions", () => {
    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
        width={768}
        height={1024}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with desktop dimensions", () => {
    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
        width={1920}
        height={1080}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should handle exactly 2 players", () => {
    expect(mockPlayers).toHaveLength(2);

    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render return-to-menu button", () => {
    render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );
    expect(screen.getByTestId("return-to-menu-button")).toBeInTheDocument();
  });

  it("should call onReturnToMenu when button clicked", () => {
    const mockCallback = vi.fn();
    render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockCallback}
        onGameEnd={mockOnGameEnd}
      />
    );
    const button = screen.getByTestId("return-to-menu-button");
    button.click();
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
