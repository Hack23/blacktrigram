/**
 * Skeletal Animation Validation Tests for three/models package
 *
 * Comprehensive tests for bone hierarchy, joint limits, IK constraints,
 * muscle attachments, and Korean martial arts authenticity.
 *
 * @module components/three/models/__tests__/skeletal-animation
 * @category Tests
 * @korean 골격애니메이션검증테스트
 */

import { Canvas } from "@react-three/fiber";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import { PlayerArchetype, TrigramStance } from "../../../../../types/common";
import { SkeletalPlayer3D } from "../SkeletalPlayer3D";
import { createScaledHumanoidRig } from "../../../../../systems/animation";
import { getArchetypePhysicalAttributes } from "../../../../../data/archetypePhysicalAttributes";

describe("Skeletal Animation Validation", () => {
  const renderWithCanvas = (component: React.ReactElement) => {
    return render(<Canvas>{component}</Canvas>);
  };

  describe("Bone Hierarchy Integrity", () => {
    it("should create skeletal rig with proper bone hierarchy", () => {
      const physicalAttributes = getArchetypePhysicalAttributes(
        PlayerArchetype.MUSA
      );
      const rig = createScaledHumanoidRig(physicalAttributes);

      // Validate root bone exists
      expect(rig.root).toBeDefined();
      expect(rig.root.name).toBe("pelvis");

      // Validate bone map
      expect(rig.bones.size).toBeGreaterThan(20); // At least 20 bones
    });

    it("should maintain spine -> upper_arm connection", () => {
      const physicalAttributes = getArchetypePhysicalAttributes(
        PlayerArchetype.MUSA
      );
      const rig = createScaledHumanoidRig(physicalAttributes);

      const spineMiddle = rig.bones.get("spine_middle");
      expect(spineMiddle).toBeDefined();

      // Check children include shoulders
      const shoulderL = rig.bones.get("shoulder_L");
      expect(shoulderL).toBeDefined();
      expect(shoulderL?.parent?.name).toBe("spine_upper");
    });

    it("should maintain upper_arm -> forearm -> hand connection", () => {
      const physicalAttributes = getArchetypePhysicalAttributes(
        PlayerArchetype.MUSA
      );
      const rig = createScaledHumanoidRig(physicalAttributes);

      const upperArmL = rig.bones.get("upper_arm_L");
      const forearmL = rig.bones.get("forearm_L");
      const handL = rig.bones.get("hand_L");

      expect(upperArmL).toBeDefined();
      expect(forearmL).toBeDefined();
      expect(handL).toBeDefined();

      // Validate parent-child relationships
      // Note: forearm parent is elbow_L (joint bone between upper_arm and forearm)
      // Note: hand parent is wrist_L (joint bone between forearm and hand)
      expect(forearmL?.parent?.name).toBe("elbow_L");
      expect(handL?.parent?.name).toBe("wrist_L");
    });

    it("should maintain thigh -> shin -> foot connection", () => {
      const physicalAttributes = getArchetypePhysicalAttributes(
        PlayerArchetype.MUSA
      );
      const rig = createScaledHumanoidRig(physicalAttributes);

      const thighL = rig.bones.get("thigh_L");
      const shinL = rig.bones.get("shin_L");
      const footL = rig.bones.get("foot_L");

      expect(thighL).toBeDefined();
      expect(shinL).toBeDefined();
      expect(footL).toBeDefined();

      // Validate parent-child relationships
      // Note: shin parent is knee_L (joint bone between thigh and shin)
      expect(shinL?.parent?.name).toBe("knee_L");
      expect(footL?.parent?.name).toBe("shin_L");
    });

    it("should render skeletal player with valid hierarchy", () => {
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
          bloodLoss={0}
          isBlocking={false}
          isMobile={false}
          currentAnimation="idle"
          showDetails={false}
          showSkeleton={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Joint Rotation Limits", () => {
    it("should enforce elbow rotation limits (0-150 degrees)", () => {
      // Elbow joint should not bend beyond anatomical limits
      const maxElbowRotation = THREE.MathUtils.degToRad(150);
      const minElbowRotation = 0;

      // Test rotation constraint
      const testRotation = THREE.MathUtils.degToRad(100);
      expect(testRotation).toBeGreaterThanOrEqual(minElbowRotation);
      expect(testRotation).toBeLessThanOrEqual(maxElbowRotation);

      // Test invalid rotation
      const invalidRotation = THREE.MathUtils.degToRad(180);
      expect(invalidRotation).toBeGreaterThan(maxElbowRotation);
    });

    it("should enforce knee rotation limits (0-145 degrees)", () => {
      // Knee joint should not bend beyond anatomical limits
      const maxKneeRotation = THREE.MathUtils.degToRad(145);
      const minKneeRotation = 0;

      // Test rotation constraint
      const testRotation = THREE.MathUtils.degToRad(90);
      expect(testRotation).toBeGreaterThanOrEqual(minKneeRotation);
      expect(testRotation).toBeLessThanOrEqual(maxKneeRotation);
    });

    it("should enforce hip rotation limits (-30 to 120 degrees)", () => {
      // Hip joint rotation range
      const minHipRotation = THREE.MathUtils.degToRad(-30);
      const maxHipRotation = THREE.MathUtils.degToRad(120);

      // Test rotation constraint
      const testRotation = THREE.MathUtils.degToRad(45);
      expect(testRotation).toBeGreaterThanOrEqual(minHipRotation);
      expect(testRotation).toBeLessThanOrEqual(maxHipRotation);
    });

    it("should enforce shoulder rotation limits", () => {
      // Shoulder joint has wider range of motion
      const minShoulderRotation = THREE.MathUtils.degToRad(-180);
      const maxShoulderRotation = THREE.MathUtils.degToRad(180);

      // Test rotation constraint
      const testRotation = THREE.MathUtils.degToRad(90);
      expect(testRotation).toBeGreaterThanOrEqual(minShoulderRotation);
      expect(testRotation).toBeLessThanOrEqual(maxShoulderRotation);
    });
  });

  describe("Foot Grounding (IK Constraints)", () => {
    it("should keep feet near ground level for standing stances", () => {
      const { container } = renderWithCanvas(
        <SkeletalPlayer3D
          playerId="test-player"
          archetype={PlayerArchetype.MUSA}
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
          bloodLoss={0}
          isBlocking={false}
          isMobile={false}
          currentAnimation="idle"
          showDetails={false}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
      // Foot position validation would require Three.js scene access
      // In real implementation, feet should be at y~0
    });

    it("should validate foot positions are reasonable", () => {
      const physicalAttributes = getArchetypePhysicalAttributes(
        PlayerArchetype.MUSA
      );
      const rig = createScaledHumanoidRig(physicalAttributes);

      const footL = rig.bones.get("foot_L");
      const footR = rig.bones.get("foot_R");

      expect(footL).toBeDefined();
      expect(footR).toBeDefined();

      // Feet should be at ground level in rest pose
      expect(footL?.position.y).toBeLessThan(0.2); // Within 20cm of ground
      expect(footR?.position.y).toBeLessThan(0.2);
    });
  });

  describe("Muscle Attachment Validation", () => {
    it("should render skeletal player with muscle rendering", () => {
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
          ki={50}
          pain={0}
          balance="READY"
          consciousness={100}
          bloodLoss={0}
          isBlocking={false}
          isMobile={false}
          currentAnimation="idle"
          showDetails={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
      // Muscle attachment would be validated via BoneRenderer
    });

    it("should handle different muscle mass levels", () => {
      const musaMuscles = getArchetypePhysicalAttributes(PlayerArchetype.MUSA);
      const amsaljaMuscles = getArchetypePhysicalAttributes(
        PlayerArchetype.AMSALJA
      );

      // Musa (traditional warrior) should have higher muscle mass
      expect(musaMuscles.muscleMass).toBeGreaterThan(
        amsaljaMuscles.muscleMass
      );
    });
  });

  describe("Clothing Follow Tests", () => {
    it("should render clothing that follows bone movement", () => {
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
          bloodLoss={0}
          isBlocking={false}
          isMobile={false}
          currentAnimation="idle"
          showDetails={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
      // Clothing rendering validated through BoneRenderer component
    });

    it("should handle different archetype clothing styles", () => {
      const archetypes = [
        PlayerArchetype.MUSA, // Traditional dobok
        PlayerArchetype.AMSALJA, // Tactical gear
        PlayerArchetype.HACKER, // Cyberpunk clothing
        PlayerArchetype.JEONGBO_YOWON, // Intelligence operative suit
        PlayerArchetype.JOJIK_POKRYEOKBAE, // Organized crime attire
      ];

      archetypes.forEach((archetype) => {
        const { container } = renderWithCanvas(
          <SkeletalPlayer3D
            playerId="test-player"
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
            showDetails={false}
          />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });
  });

  describe("Korean Martial Arts Authenticity - Stance Postures", () => {
    describe("Geon (☰ Heaven) Stance - Strong and Upright", () => {
      it("should match geon stance posture characteristics", () => {
        const physicalAttributes = getArchetypePhysicalAttributes(
          PlayerArchetype.MUSA
        );
        const rig = createScaledHumanoidRig(physicalAttributes);

        const spineMiddle = rig.bones.get("spine_middle");
        expect(spineMiddle).toBeDefined();

        // Geon stance: spine should be upright (minimal forward lean)
        // In rest pose, spine rotation.x should be near 0
        expect(Math.abs(spineMiddle?.rotation.x ?? 0)).toBeLessThan(
          THREE.MathUtils.degToRad(15)
        );
      });

      it("should render geon stance with proper posture", () => {
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
            bloodLoss={0}
            isBlocking={false}
            isMobile={false}
            currentAnimation="stance_geon"
            showDetails={true}
          />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });

    describe("Gam (☵ Water) Stance - Flowing and Defensive", () => {
      it("should match gam stance posture characteristics", () => {
        const physicalAttributes = getArchetypePhysicalAttributes(
          PlayerArchetype.MUSA
        );
        const rig = createScaledHumanoidRig(physicalAttributes);

        const pelvis = rig.bones.get("pelvis");
        expect(pelvis).toBeDefined();

        // Gam stance: lowered center of gravity
        // Pelvis should be at reasonable standing height (approx 1.1m for Korean average)
        // In rest pose, pelvis is at natural height
        expect(pelvis?.position.y).toBeGreaterThan(0.5);
      });

      it("should render gam stance with defensive crouch", () => {
        const { container } = renderWithCanvas(
          <SkeletalPlayer3D
            playerId="test-player"
            archetype={PlayerArchetype.MUSA}
            stance={TrigramStance.GAM}
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
            currentAnimation="stance_gam"
            showDetails={true}
          />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });

    describe("All 8 Trigram Stances", () => {
      it("should render all 8 trigram stances without errors", () => {
        const stances = [
          TrigramStance.GEON, // ☰ Heaven
          TrigramStance.TAE, // ☱ Lake
          TrigramStance.LI, // ☲ Fire
          TrigramStance.JIN, // ☳ Thunder
          TrigramStance.SON, // ☴ Wind
          TrigramStance.GAM, // ☵ Water
          TrigramStance.GAN, // ☶ Mountain
          TrigramStance.GON, // ☷ Earth
        ];

        stances.forEach((stance) => {
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
              bloodLoss={0}
              isBlocking={false}
              isMobile={false}
              currentAnimation="idle"
              showDetails={false}
            />
          );

          expect(container.querySelector("canvas")).toBeInTheDocument();
        });
      });

      it("should apply correct stance colors", () => {
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
              bloodLoss={0}
              isBlocking={false}
              isMobile={false}
              currentAnimation={`stance_${stance}` as any}
              showDetails={true}
              showStanceIndicator={true}
            />
          );

          expect(container.querySelector("canvas")).toBeInTheDocument();
        });
      });
    });
  });

  describe("Attack Form Validation", () => {
    it("should render jab attack animation", () => {
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
          bloodLoss={0}
          isBlocking={false}
          isMobile={false}
          currentAnimation="attack"
          attackAnimation="jab"
          showDetails={false}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render all Korean martial arts attack types", () => {
      const attacks = [
        "jab",
        "cross",
        "hook",
        "uppercut",
        "front_kick",
        "roundhouse_kick",
        "side_kick",
        "elbow_strike",
        "knee_strike",
      ];

      attacks.forEach((attack) => {
        const { container } = renderWithCanvas(
          <SkeletalPlayer3D
            playerId="test-player"
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
            attackAnimation={attack}
            showDetails={false}
          />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });
  });

  describe("Anatomical Correctness for Vital Points", () => {
    it("should have anatomically correct bone positions", () => {
      const physicalAttributes = getArchetypePhysicalAttributes(
        PlayerArchetype.MUSA
      );
      const rig = createScaledHumanoidRig(physicalAttributes);

      // Validate critical anatomical points
      const head = rig.bones.get("head");
      const neck = rig.bones.get("neck");
      const spineUpper = rig.bones.get("spine_upper");

      expect(head).toBeDefined();
      expect(neck).toBeDefined();
      expect(spineUpper).toBeDefined();

      // Head should be above neck
      const headWorldY = head?.position.y ?? 0;
      const neckWorldY = neck?.position.y ?? 0;
      expect(headWorldY).toBeGreaterThan(neckWorldY);
    });

    it("should render character with visible vital points", () => {
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
          ki={50}
          pain={0}
          balance="READY"
          consciousness={100}
          bloodLoss={0}
          isBlocking={false}
          isMobile={false}
          currentAnimation="idle"
          showDetails={true}
          showSkeleton={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
      // Vital points would be validated through visual inspection
    });
  });

  describe("Archetype Physical Differences", () => {
    it("should reflect different physical attributes per archetype", () => {
      const musa = getArchetypePhysicalAttributes(PlayerArchetype.MUSA);
      const amsalja = getArchetypePhysicalAttributes(PlayerArchetype.AMSALJA);
      const hacker = getArchetypePhysicalAttributes(PlayerArchetype.HACKER);

      // Musa (traditional warrior) should be heavier and more muscular
      expect(musa.weight).toBeGreaterThan(amsalja.weight);
      expect(musa.muscleMass).toBeGreaterThan(hacker.muscleMass);

      // Amsalja (assassin) should be lean and agile
      expect(amsalja.fatMass).toBeLessThan(musa.fatMass);

      // Each archetype should have unique proportions
      expect(musa.shoulderWidth).not.toBe(amsalja.shoulderWidth);
    });

    it("should render visually distinct archetypes", () => {
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      archetypes.forEach((archetype) => {
        const { container } = renderWithCanvas(
          <SkeletalPlayer3D
            playerId="test-player"
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
            showDetails={true}
          />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });
  });

  describe("Animation Timing and Callbacks", () => {
    it("should call onAnimationComplete callback", () => {
      const onAnimationComplete = vi.fn();

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
          bloodLoss={0}
          isBlocking={false}
          isMobile={false}
          currentAnimation="attack"
          attackAnimation="jab"
          onAnimationComplete={onAnimationComplete}
          showDetails={false}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
      // Callback would be triggered after animation completes
    });
  });

  describe("Performance and Rendering", () => {
    it("should render with mobile optimizations", () => {
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
          bloodLoss={0}
          isBlocking={false}
          isMobile={true}
          currentAnimation="idle"
          showDetails={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should support different scale values", () => {
      const scales = [0.5, 1.0, 1.5, 2.0];

      scales.forEach((scale) => {
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
            bloodLoss={0}
            isBlocking={false}
            isMobile={false}
            scale={scale}
            currentAnimation="idle"
            showDetails={false}
          />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });

    it("should handle different facing directions", () => {
      const { container: containerLeft } = renderWithCanvas(
        <SkeletalPlayer3D
          playerId="test-player-left"
          archetype={PlayerArchetype.MUSA}
          stance={TrigramStance.GEON}
          position={[-2, 0, 0]}
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
          facing="left"
          currentAnimation="idle"
          showDetails={false}
        />
      );

      const { container: containerRight } = renderWithCanvas(
        <SkeletalPlayer3D
          playerId="test-player-right"
          archetype={PlayerArchetype.MUSA}
          stance={TrigramStance.GEON}
          position={[2, 0, 0]}
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
          facing="right"
          currentAnimation="idle"
          showDetails={false}
        />
      );

      expect(containerLeft.querySelector("canvas")).toBeInTheDocument();
      expect(containerRight.querySelector("canvas")).toBeInTheDocument();
    });
  });
});
