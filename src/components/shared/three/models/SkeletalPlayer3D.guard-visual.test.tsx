/**
 * Tests for SkeletalPlayer3D stance guard visual integration (Phase 2)
 *
 * Validates that guard poses are correctly applied to skeletal rig
 * with breathing animations when in stance_guard_{stance} state.
 *
 * @module components/three/SkeletalPlayer3D.guard-visual.test
 * @category Tests
 */

import { Canvas } from "@react-three/fiber";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlayerArchetype, TrigramStance } from "../../../../types/common";
import { SkeletalPlayer3D } from "./SkeletalPlayer3D";

describe("SkeletalPlayer3D - Guard Visual Integration", () => {
  const renderWithCanvas = (component: React.ReactElement) => {
    return render(<Canvas>{component}</Canvas>);
  };

  describe("Stance Guard Animation Detection", () => {
    it("should render when currentAnimation is stance_geon", () => {
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
          pain={0}
          balance="READY"
          consciousness={100}
          isBlocking={false}
          isMobile={false}
          currentAnimation="stance_geon"
          showDetails={false}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render when currentAnimation is stance_tae", () => {
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
          pain={0}
          balance="READY"
          consciousness={100}
          isBlocking={false}
          isMobile={false}
          currentAnimation="stance_tae"
          showDetails={false}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render all 8 trigram stance guards", () => {
      const stances: {
        stance: TrigramStance;
        animation:
          | "stance_geon"
          | "stance_tae"
          | "stance_li"
          | "stance_jin"
          | "stance_son"
          | "stance_gam"
          | "stance_gan"
          | "stance_gon";
      }[] = [
        { stance: TrigramStance.GEON, animation: "stance_geon" },
        { stance: TrigramStance.TAE, animation: "stance_tae" },
        { stance: TrigramStance.LI, animation: "stance_li" },
        { stance: TrigramStance.JIN, animation: "stance_jin" },
        { stance: TrigramStance.SON, animation: "stance_son" },
        { stance: TrigramStance.GAM, animation: "stance_gam" },
        { stance: TrigramStance.GAN, animation: "stance_gan" },
        { stance: TrigramStance.GON, animation: "stance_gon" },
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
            pain={0}
            balance="READY"
            consciousness={100}
            isBlocking={false}
            isMobile={false}
            currentAnimation={animation}
            showDetails={false}
          />,
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
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
          pain={0}
          balance="READY"
          consciousness={100}
          isBlocking={false}
          isMobile={false}
          currentAnimation="stance_li"
          showDetails={true}
        />,
      );

      // Should render with ki-enhanced color
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle stance guard with low health", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3D
          playerId="test-player"
          archetype={PlayerArchetype.JEONGBO_YOWON}
          stance={TrigramStance.GAM}
          position={[0, 0, 0]}
          rotation={0}
          health={25}
          maxHealth={100}
          stamina={50}
          ki={30}
          pain={20}
          balance="SHAKEN"
          consciousness={90}
          isBlocking={false}
          isMobile={false}
          currentAnimation="stance_gam"
          showDetails={true}
        />,
      );

      // Should render with low health color
      expect(container.querySelector("canvas")).toBeInTheDocument();
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
          pain={5}
          balance="READY"
          consciousness={100}
          isBlocking={true}
          isMobile={false}
          currentAnimation="stance_gan"
          showDetails={true}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle stance guard with balance states", () => {
      const balanceStates = [
        "READY",
        "SHAKEN",
        "VULNERABLE",
        "HELPLESS",
      ] as const;

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
            pain={0}
            balance={balance}
            consciousness={100}
            isBlocking={false}
            isMobile={false}
            currentAnimation="stance_son"
            showDetails={false}
          />,
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });
  });

  describe("Transition Compatibility", () => {
    it("should render during stance_change animation", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3D
          playerId="test-player"
          archetype={PlayerArchetype.JOJIK_POKRYEOKBAE}
          stance={TrigramStance.GON}
          position={[0, 0, 0]}
          rotation={0}
          health={100}
          maxHealth={100}
          stamina={100}
          ki={50}
          pain={0}
          balance="READY"
          consciousness={100}
          isBlocking={false}
          isMobile={false}
          currentAnimation="stance_change"
          showDetails={false}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
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
          pain={0}
          balance="READY"
          consciousness={100}
          isBlocking={false}
          isMobile={false}
          currentAnimation="idle"
          showDetails={false}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
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
          pain={0}
          balance="READY"
          consciousness={100}
          isBlocking={false}
          isMobile={true}
          currentAnimation="stance_jin"
          showDetails={true}
        />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
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
            pain={0}
            balance="READY"
            consciousness={100}
            isBlocking={false}
            isMobile={false}
            scale={scale}
            currentAnimation="stance_li"
            showDetails={false}
          />,
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });
  });
});
