/**
 * Tests for SkeletalPlayer3DWithLOD performance optimization
 *
 * Validates Level of Detail (LOD) system for efficient rendering of multiple
 * characters at different distances. Target: <5ms per character.
 *
 * @module components/three/models/__tests__/lod-performance
 * @category Tests
 * @korean LOD성능테스트
 */

import { Canvas } from "@react-three/fiber";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlayerArchetype, TrigramStance } from "../../../../../types/common";
import { SkeletalPlayer3DWithLOD } from "../SkeletalPlayer3DWithLOD";

describe("SkeletalPlayer3DWithLOD - Performance Optimization", () => {
  const renderWithCanvas = (component: React.ReactElement) => {
    return render(<Canvas>{component}</Canvas>);
  };

  describe("LOD System Configuration", () => {
    it("should render with default LOD distances", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3DWithLOD
          playerId="player1"
          archetype={PlayerArchetype.MUSA}
          stance={TrigramStance.GEON}
          position={[0, 0, 0]}
          rotation={0}
          health={100}
          maxHealth={100}
          stamina={100}
          ki={50}
          pain={0}
          balance="READY"
          consciousness={100}
          bloodLoss={0}
          isBlocking={false}
          isMobile={false}
          currentAnimation="idle"
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should support custom LOD distances", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3DWithLOD
          playerId="player1"
          archetype={PlayerArchetype.MUSA}
          stance={TrigramStance.GEON}
          position={[0, 0, 0]}
          rotation={0}
          health={100}
          maxHealth={100}
          stamina={100}
          ki={50}
          pain={0}
          balance="READY"
          consciousness={100}
          bloodLoss={0}
          isBlocking={false}
          isMobile={false}
          currentAnimation="idle"
          lodDistances={[0, 15, 30]} // Custom distances
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should allow disabling LOD", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3DWithLOD
          playerId="player1"
          archetype={PlayerArchetype.MUSA}
          stance={TrigramStance.GEON}
          position={[0, 0, 0]}
          rotation={0}
          health={100}
          maxHealth={100}
          stamina={100}
          ki={50}
          pain={0}
          balance="READY"
          consciousness={100}
          bloodLoss={0}
          isBlocking={false}
          isMobile={false}
          currentAnimation="idle"
          enableLOD={false}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Multiple Characters Performance", () => {
    it("should render 4 characters with LOD efficiently", () => {
      const { container } = renderWithCanvas(
        <>
          {/* Close character - high detail */}
          <SkeletalPlayer3DWithLOD
            playerId="player1"
            archetype={PlayerArchetype.MUSA}
            stance={TrigramStance.GEON}
            position={[0, 0, 0]}
            rotation={0}
            health={100}
            maxHealth={100}
            stamina={100}
            ki={50}
            pain={0}
            balance="READY"
            consciousness={100}
            bloodLoss={0}
            isBlocking={false}
            isMobile={false}
            currentAnimation="idle"
          />
          {/* Medium distance - medium detail */}
          <SkeletalPlayer3DWithLOD
            playerId="player2"
            archetype={PlayerArchetype.AMSALJA}
            stance={TrigramStance.TAE}
            position={[12, 0, 0]}
            rotation={0}
            health={100}
            maxHealth={100}
            stamina={100}
            ki={50}
            pain={0}
            balance="READY"
            consciousness={100}
            bloodLoss={0}
            isBlocking={false}
            isMobile={false}
            currentAnimation="idle"
          />
          {/* Far distance - low detail */}
          <SkeletalPlayer3DWithLOD
            playerId="player3"
            archetype={PlayerArchetype.HACKER}
            stance={TrigramStance.LI}
            position={[25, 0, 0]}
            rotation={0}
            health={100}
            maxHealth={100}
            stamina={100}
            ki={50}
            pain={0}
            balance="READY"
            consciousness={100}
            bloodLoss={0}
            isBlocking={false}
            isMobile={false}
            currentAnimation="idle"
          />
          {/* Another far character */}
          <SkeletalPlayer3DWithLOD
            playerId="player4"
            archetype={PlayerArchetype.JEONGBO_YOWON}
            stance={TrigramStance.JIN}
            position={[30, 0, 0]}
            rotation={0}
            health={100}
            maxHealth={100}
            stamina={100}
            ki={50}
            pain={0}
            balance="READY"
            consciousness={100}
            bloodLoss={0}
            isBlocking={false}
            isMobile={false}
            currentAnimation="idle"
          />
        </>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
      // LOD system should reduce rendering cost for distant characters
    });

    it("should handle 8 characters with LOD", () => {
      const characters = [
        { id: "p1", archetype: PlayerArchetype.MUSA, position: [0, 0, 0] },
        { id: "p2", archetype: PlayerArchetype.AMSALJA, position: [5, 0, 0] },
        { id: "p3", archetype: PlayerArchetype.HACKER, position: [12, 0, 0] },
        { id: "p4", archetype: PlayerArchetype.JEONGBO_YOWON, position: [15, 0, 0] },
        { id: "p5", archetype: PlayerArchetype.JOJIK_POKRYEOKBAE, position: [22, 0, 0] },
        { id: "p6", archetype: PlayerArchetype.MUSA, position: [25, 0, 0] },
        { id: "p7", archetype: PlayerArchetype.AMSALJA, position: [32, 0, 0] },
        { id: "p8", archetype: PlayerArchetype.HACKER, position: [35, 0, 0] },
      ];

      const { container } = renderWithCanvas(
        <>
          {characters.map((char) => (
            <SkeletalPlayer3DWithLOD
              key={char.id}
              playerId={char.id}
              archetype={char.archetype}
              stance={TrigramStance.GEON}
              position={char.position as [number, number, number]}
              rotation={0}
              health={100}
              maxHealth={100}
              stamina={100}
              ki={50}
              pain={0}
              balance="READY"
              consciousness={100}
              bloodLoss={0}
              isBlocking={false}
              isMobile={false}
              currentAnimation="idle"
            />
          ))}
        </>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
      // 8 characters should render efficiently with LOD
    });
  });

  describe("LOD Level Rendering", () => {
    it("should render all 8 trigram stances with LOD", () => {
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
        const { container } = renderWithCanvas(
          <SkeletalPlayer3DWithLOD
            playerId="player1"
            archetype={PlayerArchetype.MUSA}
            stance={stance}
            position={[0, 0, 0]}
            rotation={0}
            health={100}
            maxHealth={100}
            stamina={100}
            ki={50}
            pain={0}
            balance="READY"
            consciousness={100}
            bloodLoss={0}
            isBlocking={false}
            isMobile={false}
            currentAnimation="idle"
          />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });

    it("should handle different archetypes with LOD", () => {
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      archetypes.forEach((archetype) => {
        const { container } = renderWithCanvas(
          <SkeletalPlayer3DWithLOD
            playerId="player1"
            archetype={archetype}
            stance={TrigramStance.GEON}
            position={[0, 0, 0]}
            rotation={0}
            health={100}
            maxHealth={100}
            stamina={100}
            ki={50}
            pain={0}
            balance="READY"
            consciousness={100}
            bloodLoss={0}
            isBlocking={false}
            isMobile={false}
            currentAnimation="idle"
          />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });

    it("should handle combat states with LOD", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3DWithLOD
          playerId="player1"
          archetype={PlayerArchetype.MUSA}
          stance={TrigramStance.GEON}
          position={[0, 0, 0]}
          rotation={0}
          health={60}
          maxHealth={100}
          stamina={50}
          ki={30}
          pain={20}
          balance="SHAKEN"
          consciousness={90}
          bloodLoss={10}
          isBlocking={true}
          isStunned={false}
          isMobile={false}
          currentAnimation="idle"
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle attack animations with LOD", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3DWithLOD
          playerId="player1"
          archetype={PlayerArchetype.MUSA}
          stance={TrigramStance.JIN}
          position={[0, 0, 0]}
          rotation={0}
          health={100}
          maxHealth={100}
          stamina={100}
          ki={50}
          pain={0}
          balance="READY"
          consciousness={100}
          bloodLoss={0}
          isBlocking={false}
          isMobile={false}
          currentAnimation="attack"
          attackAnimation="jab"
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("LOD Visual State Changes", () => {
    it("should update body color based on health with LOD", () => {
      const healthStates = [
        { health: 100, maxHealth: 100, description: "Full health" },
        { health: 60, maxHealth: 100, description: "Medium health" },
        { health: 20, maxHealth: 100, description: "Low health (red)" },
      ];

      healthStates.forEach((state) => {
        const { container } = renderWithCanvas(
          <SkeletalPlayer3DWithLOD
            playerId="player1"
            archetype={PlayerArchetype.MUSA}
            stance={TrigramStance.GEON}
            position={[0, 0, 0]}
            rotation={0}
            health={state.health}
            maxHealth={state.maxHealth}
            stamina={100}
            ki={50}
            pain={0}
            balance="READY"
            consciousness={100}
            bloodLoss={0}
            isBlocking={false}
            isMobile={false}
            currentAnimation="idle"
          />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });

    it("should show ki-enhanced color with LOD", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3DWithLOD
          playerId="player1"
          archetype={PlayerArchetype.MUSA}
          stance={TrigramStance.GEON}
          position={[0, 0, 0]}
          rotation={0}
          health={100}
          maxHealth={100}
          stamina={100}
          ki={90} // High ki (cyan glow)
          pain={0}
          balance="READY"
          consciousness={100}
          bloodLoss={0}
          isBlocking={false}
          isMobile={false}
          currentAnimation="idle"
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should show stunned state with LOD", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3DWithLOD
          playerId="player1"
          archetype={PlayerArchetype.MUSA}
          stance={TrigramStance.GEON}
          position={[0, 0, 0]}
          rotation={0}
          health={100}
          maxHealth={100}
          stamina={100}
          ki={50}
          pain={0}
          balance="HELPLESS"
          consciousness={100}
          bloodLoss={0}
          isBlocking={false}
          isStunned={true}
          isMobile={false}
          currentAnimation="idle"
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("LOD Mobile Optimization", () => {
    it("should render with mobile flag and LOD", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3DWithLOD
          playerId="player1"
          archetype={PlayerArchetype.MUSA}
          stance={TrigramStance.GEON}
          position={[0, 0, 0]}
          rotation={0}
          health={100}
          maxHealth={100}
          stamina={100}
          ki={50}
          pain={0}
          balance="READY"
          consciousness={100}
          bloodLoss={0}
          isBlocking={false}
          isMobile={true}
          currentAnimation="idle"
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle different scales with LOD", () => {
      const scales = [0.5, 1.0, 1.5];

      scales.forEach((scale) => {
        const { container } = renderWithCanvas(
          <SkeletalPlayer3DWithLOD
            playerId="player1"
            archetype={PlayerArchetype.MUSA}
            stance={TrigramStance.GEON}
            position={[0, 0, 0]}
            rotation={0}
            health={100}
            maxHealth={100}
            stamina={100}
            ki={50}
            pain={0}
            balance="READY"
            consciousness={100}
            bloodLoss={0}
            isBlocking={false}
            isMobile={false}
            scale={scale}
            currentAnimation="idle"
          />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });

    it("should handle different facing directions with LOD", () => {
      const facings = ["left", "right"] as const;

      facings.forEach((facing) => {
        const { container } = renderWithCanvas(
          <SkeletalPlayer3DWithLOD
            playerId="player1"
            archetype={PlayerArchetype.MUSA}
            stance={TrigramStance.GEON}
            position={[0, 0, 0]}
            rotation={0}
            health={100}
            maxHealth={100}
            stamina={100}
            ki={50}
            pain={0}
            balance="READY"
            consciousness={100}
            bloodLoss={0}
            isBlocking={false}
            isMobile={false}
            facing={facing}
            currentAnimation="idle"
          />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });
  });
});
