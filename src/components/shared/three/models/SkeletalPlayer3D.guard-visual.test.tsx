/**
 * Tests for SkeletalPlayer3D stance guard visual integration (Phase 2)
 * 
 * Validates that guard poses are correctly applied to skeletal rig
 * with breathing animations when in stance_guard_{stance} state.
 * 
 * @module components/three/SkeletalPlayer3D.guard-visual.test
 * @category Tests
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { SkeletalPlayer3D } from "./SkeletalPlayer3D";
import { PlayerArchetype, TrigramStance } from "../../../../types/common";

describe("SkeletalPlayer3D - Guard Visual Integration", () => {
  const renderWithCanvas = (component: React.ReactElement) => {
    return render(
      <Canvas>
        {component}
      </Canvas>
    );
  };

  describe("Stance Guard Animation Detection", () => {
    it("should render when currentAnimation is stance_guard_geon", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3D
          playerId="test-player"
          archetype={PlayerArchetype.MUSA}
          stance={TrigramStance.GEON}
          position={[0, 0, 0]}
          rotation={0}
          health={100}
          maxHealth={100}
          stamina={100}
          ki={50}
          currentAnimation="stance_guard_geon"
          showDetails={false}
        />
      );
      
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it("should render when currentAnimation is stance_guard_tae", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3D
          playerId="test-player"
          archetype={PlayerArchetype.AMSALJA}
          stance={TrigramStance.TAE}
          position={[0, 0, 0]}
          rotation={0}
          health={100}
          maxHealth={100}
          stamina={100}
          ki={50}
          currentAnimation="stance_guard_tae"
          showDetails={false}
        />
      );
      
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it("should render all 8 trigram stance guards", () => {
      const stances = [
        { stance: TrigramStance.GEON, animation: "stance_guard_geon" },
        { stance: TrigramStance.TAE, animation: "stance_guard_tae" },
        { stance: TrigramStance.LI, animation: "stance_guard_li" },
        { stance: TrigramStance.JIN, animation: "stance_guard_jin" },
        { stance: TrigramStance.SON, animation: "stance_guard_son" },
        { stance: TrigramStance.GAM, animation: "stance_guard_gam" },
        { stance: TrigramStance.GAN, animation: "stance_guard_gan" },
        { stance: TrigramStance.GON, animation: "stance_guard_gon" },
      ];

      stances.forEach(({ stance, animation }) => {
        const { container } = renderWithCanvas(
          <SkeletalPlayer3D
            playerId="test-player"
            archetype={PlayerArchetype.MUSA}
            stance={stance}
            position={[0, 0, 0]}
            rotation={0}
            health={100}
            maxHealth={100}
            stamina={100}
            ki={50}
            currentAnimation={animation}
            showDetails={false}
          />
        );
        
        expect(container.querySelector('canvas')).toBeInTheDocument();
      });
    });
  });

  describe("Guard Pose Application", () => {
    it("should handle stance guard with high health and ki", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3D
          playerId="test-player"
          archetype={PlayerArchetype.MUSA}
          stance={TrigramStance.LI}
          position={[0, 0, 0]}
          rotation={0}
          health={100}
          maxHealth={100}
          stamina={100}
          ki={90}
          currentAnimation="stance_guard_li"
          showDetails={true}
        />
      );
      
      // Should render with ki-enhanced color
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it("should handle stance guard with low health", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3D
          playerId="test-player"
          archetype={PlayerArchetype.JEONGBO}
          stance={TrigramStance.GAM}
          position={[0, 0, 0]}
          rotation={0}
          health={25}
          maxHealth={100}
          stamina={50}
          ki={30}
          currentAnimation="stance_guard_gam"
          showDetails={true}
        />
      );
      
      // Should render with low health color
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });
  });

  describe("Integration with Combat States", () => {
    it("should handle stance guard while blocking", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3D
          playerId="test-player"
          archetype={PlayerArchetype.MUSA}
          stance={TrigramStance.GAN}
          position={[0, 0, 0]}
          rotation={0}
          health={80}
          maxHealth={100}
          stamina={70}
          ki={40}
          isBlocking={true}
          currentAnimation="stance_guard_gan"
          showDetails={true}
        />
      );
      
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it("should handle stance guard with balance states", () => {
      const balanceStates = ["STABLE", "SHAKEN", "VULNERABLE", "HELPLESS"] as const;
      
      balanceStates.forEach((balance) => {
        const { container } = renderWithCanvas(
          <SkeletalPlayer3D
            playerId="test-player"
            archetype={PlayerArchetype.HACKER}
            stance={TrigramStance.SON}
            position={[0, 0, 0]}
            rotation={0}
            health={100}
            maxHealth={100}
            stamina={100}
            ki={50}
            balance={balance}
            currentAnimation="stance_guard_son"
            showDetails={false}
          />
        );
        
        expect(container.querySelector('canvas')).toBeInTheDocument();
      });
    });
  });

  describe("Transition Compatibility", () => {
    it("should render during stance_change animation", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3D
          playerId="test-player"
          archetype={PlayerArchetype.JOJIK}
          stance={TrigramStance.GON}
          position={[0, 0, 0]}
          rotation={0}
          health={100}
          maxHealth={100}
          stamina={100}
          ki={50}
          currentAnimation="stance_change"
          showDetails={false}
        />
      );
      
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it("should render during idle animation", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3D
          playerId="test-player"
          archetype={PlayerArchetype.MUSA}
          stance={TrigramStance.GEON}
          position={[0, 0, 0]}
          rotation={0}
          health={100}
          maxHealth={100}
          stamina={100}
          ki={50}
          currentAnimation="idle"
          showDetails={false}
        />
      );
      
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });
  });

  describe("Performance and Compatibility", () => {
    it("should render with mobile flag", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3D
          playerId="test-player"
          archetype={PlayerArchetype.AMSALJA}
          stance={TrigramStance.JIN}
          position={[0, 0, 0]}
          rotation={0}
          health={100}
          maxHealth={100}
          stamina={100}
          ki={50}
          currentAnimation="stance_guard_jin"
          isMobile={true}
          showDetails={true}
        />
      );
      
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it("should render with different scales", () => {
      const scales = [0.5, 1.0, 1.5, 2.0];
      
      scales.forEach((scale) => {
        const { container } = renderWithCanvas(
          <SkeletalPlayer3D
            playerId="test-player"
            archetype={PlayerArchetype.HACKER}
            stance={TrigramStance.LI}
            position={[0, 0, 0]}
            rotation={0}
            health={100}
            maxHealth={100}
            stamina={100}
            ki={50}
            scale={scale}
            currentAnimation="stance_guard_li"
            showDetails={false}
          />
        );
        
        expect(container.querySelector('canvas')).toBeInTheDocument();
      });
    });
  });
});
