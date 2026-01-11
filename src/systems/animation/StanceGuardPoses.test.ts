/**
 * Unit tests for Fighting Stance Guard Poses
 *
 * Tests all 8 trigram stance guard pose configurations, ensuring proper
 * Korean martial arts integration, breathing animation setup, and skeletal
 * rig compatibility.
 *
 * @module systems/animation/StanceGuardPoses.test
 * @category Animation
 * @korean 자세방어포즈테스트
 */

import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { TrigramStance } from "../../types/common";
import type { StanceGuardPose } from "../../types/skeletal";
import {
  GAM_WATER_GUARD_POSE,
  GAN_MOUNTAIN_GUARD_POSE,
  GEON_HIGH_GUARD_POSE,
  GON_EARTH_GUARD_POSE,
  JIN_THUNDER_GUARD_POSE,
  LI_FIRE_GUARD_POSE,
  SON_WIND_GUARD_POSE,
  STANCE_GUARD_CONFIGS,
  TAE_FLUID_GUARD_POSE,
  getAllStanceGuardPoses,
  getGuardConfigForStance,
  getGuardPoseForStance,
} from "./StanceGuardPoses";

describe("StanceGuardPoses", () => {
  describe("Individual Guard Poses", () => {
    describe("☰ 건 (Geon) - Heaven: High Guard", () => {
      it("should have valid high guard arm positions", () => {
        expect(GEON_HIGH_GUARD_POSE.leftArm.shoulder).toBeInstanceOf(
          THREE.Euler
        );
        expect(GEON_HIGH_GUARD_POSE.leftArm.elbow).toBeInstanceOf(THREE.Euler);
        expect(GEON_HIGH_GUARD_POSE.leftArm.wrist).toBeInstanceOf(THREE.Euler);

        expect(GEON_HIGH_GUARD_POSE.rightArm.shoulder).toBeInstanceOf(
          THREE.Euler
        );
        expect(GEON_HIGH_GUARD_POSE.rightArm.elbow).toBeInstanceOf(THREE.Euler);
        expect(GEON_HIGH_GUARD_POSE.rightArm.wrist).toBeInstanceOf(THREE.Euler);
      });

      it("should have forward weight distribution for aggressive positioning", () => {
        expect(GEON_HIGH_GUARD_POSE.weight).toBe("forward");
      });

      it("should have breathing range for chest expansion", () => {
        expect(GEON_HIGH_GUARD_POSE.breathingRange.min).toBeGreaterThan(0.95);
        expect(GEON_HIGH_GUARD_POSE.breathingRange.max).toBeLessThan(1.05);
        expect(GEON_HIGH_GUARD_POSE.breathingRange.max).toBeGreaterThan(
          GEON_HIGH_GUARD_POSE.breathingRange.min
        );
      });

      it("should have raised arms (negative shoulder rotation for upward)", () => {
        expect(GEON_HIGH_GUARD_POSE.leftArm.shoulder.x).toBeLessThan(0);
        expect(GEON_HIGH_GUARD_POSE.rightArm.shoulder.x).toBeLessThan(0);
      });
    });

    describe("☱ 태 (Tae) - Lake: Fluid Mid-Guard", () => {
      it("should have valid fluid guard arm positions", () => {
        expect(TAE_FLUID_GUARD_POSE.leftArm.shoulder).toBeInstanceOf(
          THREE.Euler
        );
        expect(TAE_FLUID_GUARD_POSE.rightArm.shoulder).toBeInstanceOf(
          THREE.Euler
        );
      });

      it("should have forward weight for reach advantage", () => {
        expect(TAE_FLUID_GUARD_POSE.weight).toBe("forward");
      });

      it("should have smooth breathing for fluid motion", () => {
        const range =
          TAE_FLUID_GUARD_POSE.breathingRange.max -
          TAE_FLUID_GUARD_POSE.breathingRange.min;
        expect(range).toBeGreaterThan(0.03); // Full exhale cycle
        expect(range).toBeLessThan(0.1);
      });

      it("should have forward torso lean", () => {
        expect(TAE_FLUID_GUARD_POSE.torso.x).toBeGreaterThan(0);
      });
    });

    describe("☲ 리 (Li) - Fire: Aggressive Forward Guard", () => {
      it("should have valid fire guard arm positions", () => {
        expect(LI_FIRE_GUARD_POSE.leftArm.shoulder).toBeInstanceOf(THREE.Euler);
        expect(LI_FIRE_GUARD_POSE.rightArm.shoulder).toBeInstanceOf(
          THREE.Euler
        );
      });

      it("should have neutral weight for stability", () => {
        expect(LI_FIRE_GUARD_POSE.weight).toBe("neutral");
      });

      it("should have controlled breathing for precision", () => {
        const range =
          LI_FIRE_GUARD_POSE.breathingRange.max -
          LI_FIRE_GUARD_POSE.breathingRange.min;
        expect(range).toBeLessThan(0.03); // Shallow, controlled
      });

      it("should have rotated torso for power", () => {
        expect(Math.abs(LI_FIRE_GUARD_POSE.torso.y)).toBeGreaterThan(0);
      });
    });

    describe("☳ 진 (Jin) - Thunder: Explosive Ready Stance", () => {
      it("should have valid thunder guard arm positions", () => {
        expect(JIN_THUNDER_GUARD_POSE.leftArm.shoulder).toBeInstanceOf(
          THREE.Euler
        );
        expect(JIN_THUNDER_GUARD_POSE.rightArm.shoulder).toBeInstanceOf(
          THREE.Euler
        );
      });

      it("should have back weight for explosive forward", () => {
        expect(JIN_THUNDER_GUARD_POSE.weight).toBe("back");
      });

      it("should have deep breathing for power generation", () => {
        const range =
          JIN_THUNDER_GUARD_POSE.breathingRange.max -
          JIN_THUNDER_GUARD_POSE.breathingRange.min;
        expect(range).toBeGreaterThan(0.05); // Deep breath cycle
      });

      it("should have chambered arms (high elbow bend)", () => {
        // Using Z rotation for tight bend (1.9 rad = ~109 degrees)
        expect(
          Math.abs(JIN_THUNDER_GUARD_POSE.leftArm.elbow.z)
        ).toBeGreaterThan(1.5);
        expect(
          Math.abs(JIN_THUNDER_GUARD_POSE.rightArm.elbow.z)
        ).toBeGreaterThan(1.5);
      });
    });

    describe("☴ 손 (Son) - Wind: Continuous Motion Guard", () => {
      it("should have valid wind guard arm positions", () => {
        expect(SON_WIND_GUARD_POSE.leftArm.shoulder).toBeInstanceOf(
          THREE.Euler
        );
        expect(SON_WIND_GUARD_POSE.rightArm.shoulder).toBeInstanceOf(
          THREE.Euler
        );
      });

      it("should have neutral weight for lateral movement", () => {
        expect(SON_WIND_GUARD_POSE.weight).toBe("neutral");
      });

      it("should have rhythmic breathing", () => {
        const range =
          SON_WIND_GUARD_POSE.breathingRange.max -
          SON_WIND_GUARD_POSE.breathingRange.min;
        expect(range).toBeGreaterThan(0.02);
        expect(range).toBeLessThan(0.04);
      });

      it("should have rotated torso for circular motion", () => {
        expect(Math.abs(SON_WIND_GUARD_POSE.torso.y)).toBeGreaterThan(0);
      });
    });

    describe("☵ 감 (Gam) - Water: Flowing Defensive Guard", () => {
      it("should have valid water guard arm positions", () => {
        expect(GAM_WATER_GUARD_POSE.leftArm.shoulder).toBeInstanceOf(
          THREE.Euler
        );
        expect(GAM_WATER_GUARD_POSE.rightArm.shoulder).toBeInstanceOf(
          THREE.Euler
        );
      });

      it("should have neutral weight for adaptability", () => {
        expect(GAM_WATER_GUARD_POSE.weight).toBe("neutral");
      });

      it("should have deep flowing breathing", () => {
        const range =
          GAM_WATER_GUARD_POSE.breathingRange.max -
          GAM_WATER_GUARD_POSE.breathingRange.min;
        expect(range).toBeGreaterThan(0.04);
      });

      it("should have side stance torso rotation for martial arts positioning", () => {
        // All stances now include side rotation for proper martial arts form
        expect(GAM_WATER_GUARD_POSE.torso.y).toBeLessThan(0);
      });

      it("should have mid-level guard position for parrying", () => {
        // Mid-level guard for parrying - arms elevated but not as high as peekaboo
        // Shoulder X around -0.85 for proper parrying position
        expect(
          Math.abs(GAM_WATER_GUARD_POSE.leftArm.shoulder.x)
        ).toBeGreaterThan(0.7);
        expect(
          Math.abs(GAM_WATER_GUARD_POSE.rightArm.shoulder.x)
        ).toBeGreaterThan(0.7);
      });
    });

    describe("☶ 간 (Gan) - Mountain: Solid Defensive Posture", () => {
      it("should have valid mountain guard arm positions", () => {
        expect(GAN_MOUNTAIN_GUARD_POSE.leftArm.shoulder).toBeInstanceOf(
          THREE.Euler
        );
        expect(GAN_MOUNTAIN_GUARD_POSE.rightArm.shoulder).toBeInstanceOf(
          THREE.Euler
        );
      });

      it("should have neutral weight for maximum stability", () => {
        expect(GAN_MOUNTAIN_GUARD_POSE.weight).toBe("neutral");
      });

      it("should have minimal breathing for steady control", () => {
        const range =
          GAN_MOUNTAIN_GUARD_POSE.breathingRange.max -
          GAN_MOUNTAIN_GUARD_POSE.breathingRange.min;
        expect(range).toBeLessThan(0.03);
      });

      it("should have tight defensive arms (high elbow bend)", () => {
        // Using Z rotation for tight bend (1.8 rad = ~103 degrees)
        expect(
          Math.abs(GAN_MOUNTAIN_GUARD_POSE.leftArm.elbow.z)
        ).toBeGreaterThan(1.5);
        expect(
          Math.abs(GAN_MOUNTAIN_GUARD_POSE.rightArm.elbow.z)
        ).toBeGreaterThan(1.5);
      });

      it("should have compact protective torso (slight forward lean with side rotation)", () => {
        // Slight forward lean for compact defensive shell
        expect(GAN_MOUNTAIN_GUARD_POSE.torso.x).toBeGreaterThanOrEqual(0);
        expect(GAN_MOUNTAIN_GUARD_POSE.torso.x).toBeLessThan(0.1);
        // Side stance rotation for proper martial arts positioning
        expect(GAN_MOUNTAIN_GUARD_POSE.torso.y).toBeLessThan(0);
      });
    });

    describe("☷ 곤 (Gon) - Earth: Grounded Low Guard", () => {
      it("should have valid earth guard arm positions", () => {
        expect(GON_EARTH_GUARD_POSE.leftArm.shoulder).toBeInstanceOf(
          THREE.Euler
        );
        expect(GON_EARTH_GUARD_POSE.rightArm.shoulder).toBeInstanceOf(
          THREE.Euler
        );
      });

      it("should have neutral weight for grounded stability", () => {
        expect(GON_EARTH_GUARD_POSE.weight).toBe("neutral");
      });

      it("should have deep diaphragm breathing", () => {
        const range =
          GON_EARTH_GUARD_POSE.breathingRange.max -
          GON_EARTH_GUARD_POSE.breathingRange.min;
        expect(range).toBeGreaterThan(0.06);
      });

      it("should have low underhook guard (protecting ribs)", () => {
        // Low wrestling guard - arms lower than other guards but still protecting
        // Shoulder X around -0.4 for proper rib protection position
        expect(GON_EARTH_GUARD_POSE.leftArm.shoulder.x).toBeGreaterThanOrEqual(
          -0.5
        );
        expect(GON_EARTH_GUARD_POSE.rightArm.shoulder.x).toBeGreaterThanOrEqual(
          -0.5
        );
        // Tight elbow bend for rib protection
        expect(Math.abs(GON_EARTH_GUARD_POSE.leftArm.elbow.z)).toBeGreaterThan(
          1.4
        );
      });
    });
  });

  describe("STANCE_GUARD_CONFIGS Map", () => {
    it("should contain all 8 trigram stances", () => {
      const stanceKeys = Object.keys(STANCE_GUARD_CONFIGS) as TrigramStance[];
      expect(stanceKeys.length).toBe(8);

      expect(STANCE_GUARD_CONFIGS[TrigramStance.GEON]).toBeDefined();
      expect(STANCE_GUARD_CONFIGS[TrigramStance.TAE]).toBeDefined();
      expect(STANCE_GUARD_CONFIGS[TrigramStance.LI]).toBeDefined();
      expect(STANCE_GUARD_CONFIGS[TrigramStance.JIN]).toBeDefined();
      expect(STANCE_GUARD_CONFIGS[TrigramStance.SON]).toBeDefined();
      expect(STANCE_GUARD_CONFIGS[TrigramStance.GAM]).toBeDefined();
      expect(STANCE_GUARD_CONFIGS[TrigramStance.GAN]).toBeDefined();
      expect(STANCE_GUARD_CONFIGS[TrigramStance.GON]).toBeDefined();
    });

    it("should have valid animation configs for all stances", () => {
      Object.entries(STANCE_GUARD_CONFIGS).forEach(([stance, config]) => {
        expect(config.stance).toBe(stance);
        expect(config.koreanName).toBeTruthy();
        expect(config.englishName).toBeTruthy();
        expect(config.guardPose).toBeTruthy();
        expect(config.breathingFrames).toBeGreaterThanOrEqual(4);
        expect(config.breathingFrames).toBeLessThanOrEqual(6);
        expect(config.fps).toBe(60);
        expect(config.loop).toBe(true);
        expect(config.priority).toBe(0);
      });
    });

    it("should have correct Korean names for all stances", () => {
      expect(STANCE_GUARD_CONFIGS[TrigramStance.GEON]?.koreanName).toBe("건");
      expect(STANCE_GUARD_CONFIGS[TrigramStance.TAE]?.koreanName).toBe("태");
      expect(STANCE_GUARD_CONFIGS[TrigramStance.LI]?.koreanName).toBe("리");
      expect(STANCE_GUARD_CONFIGS[TrigramStance.JIN]?.koreanName).toBe("진");
      expect(STANCE_GUARD_CONFIGS[TrigramStance.SON]?.koreanName).toBe("손");
      expect(STANCE_GUARD_CONFIGS[TrigramStance.GAM]?.koreanName).toBe("감");
      expect(STANCE_GUARD_CONFIGS[TrigramStance.GAN]?.koreanName).toBe("간");
      expect(STANCE_GUARD_CONFIGS[TrigramStance.GON]?.koreanName).toBe("곤");
    });

    it("should have correct English names for all stances", () => {
      expect(STANCE_GUARD_CONFIGS[TrigramStance.GEON]?.englishName).toBe(
        "Heaven"
      );
      expect(STANCE_GUARD_CONFIGS[TrigramStance.TAE]?.englishName).toBe("Lake");
      expect(STANCE_GUARD_CONFIGS[TrigramStance.LI]?.englishName).toBe("Fire");
      expect(STANCE_GUARD_CONFIGS[TrigramStance.JIN]?.englishName).toBe(
        "Thunder"
      );
      expect(STANCE_GUARD_CONFIGS[TrigramStance.SON]?.englishName).toBe("Wind");
      expect(STANCE_GUARD_CONFIGS[TrigramStance.GAM]?.englishName).toBe(
        "Water"
      );
      expect(STANCE_GUARD_CONFIGS[TrigramStance.GAN]?.englishName).toBe(
        "Mountain"
      );
      expect(STANCE_GUARD_CONFIGS[TrigramStance.GON]?.englishName).toBe(
        "Earth"
      );
    });

    it("should have varied breathing frame counts based on martial arts principles", () => {
      // Fire and Mountain use controlled breathing (4 frames)
      expect(STANCE_GUARD_CONFIGS[TrigramStance.LI]?.breathingFrames).toBe(4);
      expect(STANCE_GUARD_CONFIGS[TrigramStance.GAN]?.breathingFrames).toBe(4);

      // Thunder and Earth use deep breathing (5 frames)
      expect(STANCE_GUARD_CONFIGS[TrigramStance.JIN]?.breathingFrames).toBe(5);
      expect(STANCE_GUARD_CONFIGS[TrigramStance.GON]?.breathingFrames).toBe(5);

      // Others use full breathing cycles (6 frames)
      expect(STANCE_GUARD_CONFIGS[TrigramStance.GEON]?.breathingFrames).toBe(6);
      expect(STANCE_GUARD_CONFIGS[TrigramStance.TAE]?.breathingFrames).toBe(6);
      expect(STANCE_GUARD_CONFIGS[TrigramStance.SON]?.breathingFrames).toBe(6);
      expect(STANCE_GUARD_CONFIGS[TrigramStance.GAM]?.breathingFrames).toBe(6);
    });
  });

  describe("Helper Functions", () => {
    describe("getGuardPoseForStance", () => {
      it("should return correct guard pose for each stance", () => {
        expect(getGuardPoseForStance(TrigramStance.GEON)).toBe(
          GEON_HIGH_GUARD_POSE
        );
        expect(getGuardPoseForStance(TrigramStance.TAE)).toBe(
          TAE_FLUID_GUARD_POSE
        );
        expect(getGuardPoseForStance(TrigramStance.LI)).toBe(
          LI_FIRE_GUARD_POSE
        );
        expect(getGuardPoseForStance(TrigramStance.JIN)).toBe(
          JIN_THUNDER_GUARD_POSE
        );
        expect(getGuardPoseForStance(TrigramStance.SON)).toBe(
          SON_WIND_GUARD_POSE
        );
        expect(getGuardPoseForStance(TrigramStance.GAM)).toBe(
          GAM_WATER_GUARD_POSE
        );
        expect(getGuardPoseForStance(TrigramStance.GAN)).toBe(
          GAN_MOUNTAIN_GUARD_POSE
        );
        expect(getGuardPoseForStance(TrigramStance.GON)).toBe(
          GON_EARTH_GUARD_POSE
        );
      });

      it("should return undefined for invalid stance", () => {
        expect(
          getGuardPoseForStance("invalid_stance" as TrigramStance)
        ).toBeUndefined();
      });
    });

    describe("getGuardConfigForStance", () => {
      it("should return complete config for each stance", () => {
        const geonConfig = getGuardConfigForStance(TrigramStance.GEON);
        expect(geonConfig).toBeTruthy();
        expect(geonConfig?.stance).toBe(TrigramStance.GEON);
        expect(geonConfig?.guardPose).toBe(GEON_HIGH_GUARD_POSE);
        expect(geonConfig?.koreanName).toBe("건");
        expect(geonConfig?.englishName).toBe("Heaven");
      });

      it("should return undefined for invalid stance", () => {
        expect(
          getGuardConfigForStance("invalid_stance" as TrigramStance)
        ).toBeUndefined();
      });
    });
  });

  describe("Guard Pose Structural Validation", () => {
    const allPoses: Array<[string, StanceGuardPose]> = [
      ["Geon", GEON_HIGH_GUARD_POSE],
      ["Tae", TAE_FLUID_GUARD_POSE],
      ["Li", LI_FIRE_GUARD_POSE],
      ["Jin", JIN_THUNDER_GUARD_POSE],
      ["Son", SON_WIND_GUARD_POSE],
      ["Gam", GAM_WATER_GUARD_POSE],
      ["Gan", GAN_MOUNTAIN_GUARD_POSE],
      ["Gon", GON_EARTH_GUARD_POSE],
    ];

    allPoses.forEach(([name, pose]) => {
      describe(`${name} Pose Structure`, () => {
        it("should have valid left arm structure", () => {
          expect(pose.leftArm).toBeTruthy();
          expect(pose.leftArm.shoulder).toBeInstanceOf(THREE.Euler);
          expect(pose.leftArm.elbow).toBeInstanceOf(THREE.Euler);
          expect(pose.leftArm.wrist).toBeInstanceOf(THREE.Euler);
        });

        it("should have valid right arm structure", () => {
          expect(pose.rightArm).toBeTruthy();
          expect(pose.rightArm.shoulder).toBeInstanceOf(THREE.Euler);
          expect(pose.rightArm.elbow).toBeInstanceOf(THREE.Euler);
          expect(pose.rightArm.wrist).toBeInstanceOf(THREE.Euler);
        });

        it("should have valid torso rotation", () => {
          expect(pose.torso).toBeInstanceOf(THREE.Euler);
        });

        it("should have valid weight distribution", () => {
          expect(["forward", "neutral", "back"]).toContain(pose.weight);
        });

        it("should have valid breathing range", () => {
          expect(pose.breathingRange).toBeTruthy();
          expect(pose.breathingRange.min).toBeGreaterThan(0.9);
          expect(pose.breathingRange.min).toBeLessThan(1.0);
          expect(pose.breathingRange.max).toBeGreaterThan(1.0);
          expect(pose.breathingRange.max).toBeLessThan(1.1);
          expect(pose.breathingRange.max).toBeGreaterThan(
            pose.breathingRange.min
          );
        });

        it("should have reasonable rotation values (not extreme)", () => {
          const rotations = [
            pose.leftArm.shoulder,
            pose.leftArm.elbow,
            pose.leftArm.wrist,
            pose.rightArm.shoulder,
            pose.rightArm.elbow,
            pose.rightArm.wrist,
            pose.torso,
          ];

          rotations.forEach((rotation) => {
            expect(Math.abs(rotation.x)).toBeLessThan(Math.PI); // Within -180 to 180 degrees
            expect(Math.abs(rotation.y)).toBeLessThan(Math.PI);
            expect(Math.abs(rotation.z)).toBeLessThan(Math.PI);
          });
        });
      });
    });
  });

  describe("Performance and Integration", () => {
    it("should create all guard poses quickly (< 1ms)", () => {
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        getGuardPoseForStance(TrigramStance.GEON);
        getGuardPoseForStance(TrigramStance.TAE);
        getGuardPoseForStance(TrigramStance.LI);
        getGuardPoseForStance(TrigramStance.JIN);
        getGuardPoseForStance(TrigramStance.SON);
        getGuardPoseForStance(TrigramStance.GAM);
        getGuardPoseForStance(TrigramStance.GAN);
        getGuardPoseForStance(TrigramStance.GON);
      }

      const end = performance.now();
      const totalTime = end - start;

      expect(totalTime).toBeLessThan(100); // 1000 iterations in < 100ms
    });

    it("should maintain consistent stance IDs across record and enum", () => {
      const recordKeys = Object.keys(STANCE_GUARD_CONFIGS) as TrigramStance[];
      const enumValues = Object.values(TrigramStance);

      recordKeys.forEach((key) => {
        expect(enumValues).toContain(key);
      });
    });

    it("should have guard poses that can be applied to skeletal rig", () => {
      // Verify that all bone rotations are THREE.Euler instances
      // This ensures compatibility with skeletal rig bone rotation system
      Object.values(STANCE_GUARD_CONFIGS).forEach((config) => {
        const pose = config.guardPose;

        expect(pose.leftArm.shoulder).toBeInstanceOf(THREE.Euler);
        expect(pose.leftArm.elbow).toBeInstanceOf(THREE.Euler);
        expect(pose.leftArm.wrist).toBeInstanceOf(THREE.Euler);
        expect(pose.rightArm.shoulder).toBeInstanceOf(THREE.Euler);
        expect(pose.rightArm.elbow).toBeInstanceOf(THREE.Euler);
        expect(pose.rightArm.wrist).toBeInstanceOf(THREE.Euler);
        expect(pose.torso).toBeInstanceOf(THREE.Euler);
      });
    });
  });

  describe("Korean Martial Arts Authenticity", () => {
    it("should have distinct guard heights based on martial arts principles", () => {
      // All guards have elevated arms for protection - the "height" refers to target coverage
      // High guards protect face (shoulder.x around -1.0 to -1.4)
      // Mid guards protect torso (shoulder.x around -0.8 to -0.9)
      // Low guards protect ribs/hips (shoulder.x around -0.4)

      // HIGH guards - fists near face/head (very elevated, shoulder.x < -1.0)
      const highGuards = [
        GEON_HIGH_GUARD_POSE, // -1.2 (boxing high guard)
        LI_FIRE_GUARD_POSE, // -1.3 (peekaboo)
        GAN_MOUNTAIN_GUARD_POSE, // -1.4 (high cover)
      ];
      highGuards.forEach((pose) => {
        expect(pose.leftArm.shoulder.x).toBeLessThan(-1.0); // High guard: < -1.0
      });

      // MID guards - fists at chest/chin level (shoulder.x between -0.8 and -1.0)
      const midGuards = [
        TAE_FLUID_GUARD_POSE, // -0.8 lead, -1.1 rear
        JIN_THUNDER_GUARD_POSE, // -0.9 (chambered)
        SON_WIND_GUARD_POSE, // -0.9 lead, -1.15 rear
        GAM_WATER_GUARD_POSE, // -0.85 (parrying)
      ];
      midGuards.forEach((pose) => {
        // At least one arm at mid level
        const hasOneMidArm =
          (pose.leftArm.shoulder.x >= -1.0 && pose.leftArm.shoulder.x < -0.7) ||
          (pose.rightArm.shoulder.x >= -1.0 && pose.rightArm.shoulder.x < -0.7);
        expect(hasOneMidArm || pose.leftArm.shoulder.x < -0.7).toBe(true);
      });

      // LOW guards - wrestling/grappling (shoulder.x > -0.5)
      const lowGuards = [GON_EARTH_GUARD_POSE]; // -0.4 (underhooks)
      lowGuards.forEach((pose) => {
        expect(pose.leftArm.shoulder.x).toBeGreaterThan(-0.5); // Low guard: > -0.5
      });
    });

    it("should have correct weight distributions per Korean martial arts stance types", () => {
      // Forward stances (Ap Seogi, Ap Koobi Seogi)
      expect(GEON_HIGH_GUARD_POSE.weight).toBe("forward");
      expect(TAE_FLUID_GUARD_POSE.weight).toBe("forward");

      // Back stance (Dwi Koobi Seogi)
      expect(JIN_THUNDER_GUARD_POSE.weight).toBe("back");

      // Neutral stances (Juchum Seogi, Narani Seogi, etc.)
      expect(LI_FIRE_GUARD_POSE.weight).toBe("neutral");
      expect(SON_WIND_GUARD_POSE.weight).toBe("neutral");
      expect(GAM_WATER_GUARD_POSE.weight).toBe("neutral");
      expect(GAN_MOUNTAIN_GUARD_POSE.weight).toBe("neutral");
      expect(GON_EARTH_GUARD_POSE.weight).toBe("neutral");
    });

    it("should have breathing patterns matching combat philosophy", () => {
      // Power stances: deep breathing
      const deepBreathRange =
        JIN_THUNDER_GUARD_POSE.breathingRange.max -
        JIN_THUNDER_GUARD_POSE.breathingRange.min;
      expect(deepBreathRange).toBeGreaterThan(0.06);

      // Precision stances: controlled breathing
      const controlledBreathRange =
        LI_FIRE_GUARD_POSE.breathingRange.max -
        LI_FIRE_GUARD_POSE.breathingRange.min;
      expect(controlledBreathRange).toBeLessThan(0.03);

      // Defensive stances: steady breathing
      const steadyBreathRange =
        GAN_MOUNTAIN_GUARD_POSE.breathingRange.max -
        GAN_MOUNTAIN_GUARD_POSE.breathingRange.min;
      expect(steadyBreathRange).toBeLessThan(0.03);
    });
  });
});

describe("Laterality Support", () => {
  describe("getGuardPoseForStance with laterality", () => {
    it("should return base pose for right laterality", () => {
      const rightPose = getGuardPoseForStance(TrigramStance.GEON, "right");
      expect(rightPose).toBeDefined();
      expect(rightPose).toBe(GEON_HIGH_GUARD_POSE); // Should be exact same object
    });

    it("should return mirrored pose for left laterality", () => {
      const leftPose = getGuardPoseForStance(TrigramStance.GEON, "left");
      const rightPose = getGuardPoseForStance(TrigramStance.GEON, "right");

      expect(leftPose).toBeDefined();
      expect(rightPose).toBeDefined();

      // Left and right should be different
      expect(leftPose).not.toBe(rightPose);

      // Left arm should match right arm's position (mirrored)
      expect(leftPose!.leftArm.shoulder.y).toBeCloseTo(
        -rightPose!.rightArm.shoulder.y
      );
      expect(leftPose!.rightArm.shoulder.y).toBeCloseTo(
        -rightPose!.leftArm.shoulder.y
      );
    });

    it("should default to right laterality when not specified", () => {
      const defaultPose = getGuardPoseForStance(TrigramStance.GEON);
      const rightPose = getGuardPoseForStance(TrigramStance.GEON, "right");

      expect(defaultPose).toBe(rightPose);
    });

    it("should work for all 8 trigram stances", () => {
      const stances = Object.values(TrigramStance);

      stances.forEach((stance) => {
        const leftPose = getGuardPoseForStance(stance, "left");
        const rightPose = getGuardPoseForStance(stance, "right");

        expect(leftPose).toBeDefined();
        expect(rightPose).toBeDefined();
        expect(leftPose).not.toBe(rightPose);
      });
    });
  });

  describe("getAllStanceGuardPoses", () => {
    it("should return 16 total poses (8 stances × 2 laterality)", () => {
      const allPoses = getAllStanceGuardPoses();
      expect(allPoses.size).toBe(16);
    });

    it("should have both left and right variants for each stance", () => {
      const allPoses = getAllStanceGuardPoses();
      const stances = Object.values(TrigramStance);

      stances.forEach((stance) => {
        expect(allPoses.has(`${stance}_left`)).toBe(true);
        expect(allPoses.has(`${stance}_right`)).toBe(true);
      });
    });

    it("should have distinct poses for left and right variants", () => {
      const allPoses = getAllStanceGuardPoses();
      const stances = Object.values(TrigramStance);

      stances.forEach((stance) => {
        const leftPose = allPoses.get(`${stance}_left`);
        const rightPose = allPoses.get(`${stance}_right`);

        expect(leftPose).toBeDefined();
        expect(rightPose).toBeDefined();
        expect(leftPose).not.toBe(rightPose);
      });
    });
  });
});
