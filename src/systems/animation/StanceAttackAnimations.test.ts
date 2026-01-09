/**
 * Unit tests for Stance-Specific Attack Animations
 * 
 * Tests all 24 stance-specific attack animations (3 per stance × 8 stances),
 * verifying keyframe data, Korean terminology, and animation integrity.
 * 
 * @module systems/animation/StanceAttackAnimations.test
 * @category Animation Tests
 * @korean 자세공격애니메이션테스트
 */

import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { TrigramStance } from "../../types/common";
import {
  // GEON (Heaven) attacks
  GEON_BONE_BREAKING_STRIKE_1,
  GEON_THUNDEROUS_UPPERCUT,
  GEON_CRUSHING_ELBOW,
  // TAE (Lake) attacks
  TAE_WRIST_LOCK_STRIKE,
  TAE_FLOWING_ARM_BAR,
  TAE_SPIRAL_SHOULDER_THROW,
  // LI (Fire) attacks
  LI_BURNING_FINGER_STRIKE_1,
  LI_SOLAR_PLEXUS_SPEAR,
  LI_PHOENIX_EYE_STRIKE,
  // JIN (Thunder) attacks
  JIN_LIGHTNING_STRAIGHT,
  JIN_SHOCKING_HAMMER_FIST,
  JIN_EXPLOSIVE_KNEE,
  // SON (Wind) attacks
  SON_WHIRLWIND_COMBO_1,
  SON_PRESSURE_POINT_CHAIN,
  SON_PENETRATING_PALM_RUSH,
  // GAM (Water) attacks
  GAM_FLOWING_RIVER_STRIKE,
  GAM_TIDAL_WAVE_PALM,
  GAM_WHIRLPOOL_COUNTER,
  // GAN (Mountain) attacks
  GAN_FORTRESS_COUNTER_STRIKE,
  GAN_AVALANCHE_HAMMER,
  GAN_STONE_WALL_THRUST,
  // GON (Earth) attacks
  GON_GROUND_SWEEP_STRIKE,
  GON_EARTHQUAKE_STOMP,
  GON_ROOTING_TAKEDOWN,
  // Helper functions
  getAttackAnimationsForStance,
  getAttackAnimation,
  ATTACK_ANIMATIONS_BY_STANCE,
  ALL_ATTACK_ANIMATIONS,
} from "./StanceAttackAnimations";

describe("StanceAttackAnimations", () => {
  describe("☰ GEON (Heaven) - Direct Force Attacks", () => {
    it("should have 3 attack variations", () => {
      const animations = getAttackAnimationsForStance(TrigramStance.GEON);
      expect(animations).toHaveLength(3);
    });

    describe("Bone-Breaking Strike 1 (뼈부러뜨리기 1)", () => {
      it("should have correct metadata", () => {
        expect(GEON_BONE_BREAKING_STRIKE_1.name).toBe("geon_bone_breaking_strike_1");
        expect(GEON_BONE_BREAKING_STRIKE_1.koreanName).toBe("건 뼈부러뜨리기 1");
        expect(GEON_BONE_BREAKING_STRIKE_1.type).toBe("attack");
        expect(GEON_BONE_BREAKING_STRIKE_1.loop).toBe(false);
      });

      it("should have appropriate duration (350ms)", () => {
        expect(GEON_BONE_BREAKING_STRIKE_1.duration).toBe(0.35);
      });

      it("should have keyframes in chronological order", () => {
        const keyframes = GEON_BONE_BREAKING_STRIKE_1.keyframes;
        expect(keyframes.length).toBeGreaterThan(1);
        for (let i = 1; i < keyframes.length; i++) {
          expect(keyframes[i].time).toBeGreaterThan(keyframes[i - 1].time);
        }
      });

      it("should have valid bone rotations", () => {
        const firstKeyframe = GEON_BONE_BREAKING_STRIKE_1.keyframes[0];
        expect(firstKeyframe.boneRotations).toBeInstanceOf(Map);
        expect(firstKeyframe.boneRotations.size).toBeGreaterThan(0);
        
        // Check that rotations are THREE.Euler instances
        firstKeyframe.boneRotations.forEach((rotation) => {
          expect(rotation).toBeInstanceOf(THREE.Euler);
        });
      });
    });

    describe("Thunderous Uppercut (천둥어퍼컷)", () => {
      it("should have correct metadata", () => {
        expect(GEON_THUNDEROUS_UPPERCUT.name).toBe("geon_thunderous_uppercut");
        expect(GEON_THUNDEROUS_UPPERCUT.koreanName).toBe("건 천둥어퍼컷");
        expect(GEON_THUNDEROUS_UPPERCUT.type).toBe("attack");
      });

      it("should have appropriate duration (300ms)", () => {
        expect(GEON_THUNDEROUS_UPPERCUT.duration).toBe(0.3);
      });
    });

    describe("Crushing Elbow (분쇄 팔꿈치)", () => {
      it("should have correct metadata", () => {
        expect(GEON_CRUSHING_ELBOW.name).toBe("geon_crushing_elbow");
        expect(GEON_CRUSHING_ELBOW.koreanName).toBe("건 파괴팔꿈치");
        expect(GEON_CRUSHING_ELBOW.type).toBe("attack");
      });

      it("should have appropriate duration (280ms)", () => {
        expect(GEON_CRUSHING_ELBOW.duration).toBe(0.28);
      });
    });
  });

  describe("☱ TAE (Lake) - Joint Manipulation Attacks", () => {
    it("should have 3 attack variations", () => {
      const animations = getAttackAnimationsForStance(TrigramStance.TAE);
      expect(animations).toHaveLength(3);
    });

    it("should have correct Korean names", () => {
      expect(TAE_WRIST_LOCK_STRIKE.koreanName).toBe("태 손목꺾기타격");
      expect(TAE_FLOWING_ARM_BAR.koreanName).toBe("태 유수팔걸이");
      expect(TAE_SPIRAL_SHOULDER_THROW.koreanName).toBe("태 회오리어깨던지기");
    });

    it("should have longer durations for throws (380-400ms)", () => {
      expect(TAE_FLOWING_ARM_BAR.duration).toBe(0.38);
      expect(TAE_SPIRAL_SHOULDER_THROW.duration).toBe(0.4);
    });
  });

  describe("☲ LI (Fire) - Nerve Strike Attacks", () => {
    it("should have 3 attack variations", () => {
      const animations = getAttackAnimationsForStance(TrigramStance.LI);
      expect(animations).toHaveLength(3);
    });

    it("should have fast precision strikes (240-260ms)", () => {
      expect(LI_BURNING_FINGER_STRIKE_1.duration).toBe(0.25);
      expect(LI_SOLAR_PLEXUS_SPEAR.duration).toBe(0.26);
      expect(LI_PHOENIX_EYE_STRIKE.duration).toBe(0.24);
    });

    it("should have correct Korean names", () => {
      expect(LI_BURNING_FINGER_STRIKE_1.koreanName).toBe("리 화염지창 1");
      expect(LI_SOLAR_PLEXUS_SPEAR.koreanName).toBe("리 태양신경총창");
      expect(LI_PHOENIX_EYE_STRIKE.koreanName).toBe("리 봉안권");
    });
  });

  describe("☳ JIN (Thunder) - Explosive Power Attacks", () => {
    it("should have 3 attack variations", () => {
      const animations = getAttackAnimationsForStance(TrigramStance.JIN);
      expect(animations).toHaveLength(3);
    });

    it("should have explosive fast attacks (200-280ms)", () => {
      expect(JIN_LIGHTNING_STRAIGHT.duration).toBe(0.2);
      expect(JIN_SHOCKING_HAMMER_FIST.duration).toBe(0.22);
      expect(JIN_EXPLOSIVE_KNEE.duration).toBe(0.28);
    });

    it("should have correct Korean names", () => {
      expect(JIN_LIGHTNING_STRAIGHT.koreanName).toBe("진 벽력일섬");
      expect(JIN_SHOCKING_HAMMER_FIST.koreanName).toBe("진 충격망치");
      expect(JIN_EXPLOSIVE_KNEE.koreanName).toBe("진 폭발무릎");
    });
  });

  describe("☴ SON (Wind) - Continuous Pressure Attacks", () => {
    it("should have 3 attack variations", () => {
      const animations = getAttackAnimationsForStance(TrigramStance.SON);
      expect(animations).toHaveLength(3);
    });

    it("should have longer combo attacks (380-420ms)", () => {
      expect(SON_WHIRLWIND_COMBO_1.duration).toBe(0.4);
      expect(SON_PRESSURE_POINT_CHAIN.duration).toBe(0.38);
      expect(SON_PENETRATING_PALM_RUSH.duration).toBe(0.42);
    });

    it("should have correct Korean names", () => {
      expect(SON_WHIRLWIND_COMBO_1.koreanName).toBe("손 선풍연격 1");
      expect(SON_PRESSURE_POINT_CHAIN.koreanName).toBe("손 연속급소타격");
      expect(SON_PENETRATING_PALM_RUSH.koreanName).toBe("손 관통장타");
    });
  });

  describe("☵ GAM (Water) - Flow-Counter Attacks", () => {
    it("should have 3 attack variations", () => {
      const animations = getAttackAnimationsForStance(TrigramStance.GAM);
      expect(animations).toHaveLength(3);
    });

    it("should have medium flow-counter durations (340-380ms)", () => {
      expect(GAM_FLOWING_RIVER_STRIKE.duration).toBe(0.34);
      expect(GAM_TIDAL_WAVE_PALM.duration).toBe(0.36);
      expect(GAM_WHIRLPOOL_COUNTER.duration).toBe(0.38);
    });

    it("should have correct Korean names", () => {
      expect(GAM_FLOWING_RIVER_STRIKE.koreanName).toBe("감 유수타격");
      expect(GAM_TIDAL_WAVE_PALM.koreanName).toBe("감 파도장타");
      expect(GAM_WHIRLPOOL_COUNTER.koreanName).toBe("감 소용돌이반격");
    });
  });

  describe("☶ GAN (Mountain) - Defensive Counter Attacks", () => {
    it("should have 3 attack variations", () => {
      const animations = getAttackAnimationsForStance(TrigramStance.GAN);
      expect(animations).toHaveLength(3);
    });

    it("should have defensive counter durations (300-350ms)", () => {
      expect(GAN_FORTRESS_COUNTER_STRIKE.duration).toBe(0.3);
      expect(GAN_AVALANCHE_HAMMER.duration).toBe(0.35);
      expect(GAN_STONE_WALL_THRUST.duration).toBe(0.32);
    });

    it("should have correct Korean names", () => {
      expect(GAN_FORTRESS_COUNTER_STRIKE.koreanName).toBe("간 요새반격타");
      expect(GAN_AVALANCHE_HAMMER.koreanName).toBe("간 눈사태망치");
      expect(GAN_STONE_WALL_THRUST.koreanName).toBe("간 석벽관통");
    });
  });

  describe("☷ GON (Earth) - Grounding/Takedown Attacks", () => {
    it("should have 3 attack variations", () => {
      const animations = getAttackAnimationsForStance(TrigramStance.GON);
      expect(animations).toHaveLength(3);
    });

    it("should have appropriate grounding durations (320-450ms)", () => {
      expect(GON_GROUND_SWEEP_STRIKE.duration).toBe(0.38);
      expect(GON_EARTHQUAKE_STOMP.duration).toBe(0.32);
      expect(GON_ROOTING_TAKEDOWN.duration).toBe(0.45);
    });

    it("should have correct Korean names", () => {
      expect(GON_GROUND_SWEEP_STRIKE.koreanName).toBe("곤 접지쓸기");
      expect(GON_EARTHQUAKE_STOMP.koreanName).toBe("곤 지진발구르기");
      expect(GON_ROOTING_TAKEDOWN.koreanName).toBe("곤 뿌리내림꺾기");
    });
  });

  describe("Complete Animation Coverage", () => {
    it("should have all 24 animations (8 stances × 3 attacks)", () => {
      expect(ALL_ATTACK_ANIMATIONS.size).toBe(24);
    });

    it("should have all 8 stances in the map", () => {
      expect(ATTACK_ANIMATIONS_BY_STANCE.size).toBe(8);
      expect(ATTACK_ANIMATIONS_BY_STANCE.has(TrigramStance.GEON)).toBe(true);
      expect(ATTACK_ANIMATIONS_BY_STANCE.has(TrigramStance.TAE)).toBe(true);
      expect(ATTACK_ANIMATIONS_BY_STANCE.has(TrigramStance.LI)).toBe(true);
      expect(ATTACK_ANIMATIONS_BY_STANCE.has(TrigramStance.JIN)).toBe(true);
      expect(ATTACK_ANIMATIONS_BY_STANCE.has(TrigramStance.SON)).toBe(true);
      expect(ATTACK_ANIMATIONS_BY_STANCE.has(TrigramStance.GAM)).toBe(true);
      expect(ATTACK_ANIMATIONS_BY_STANCE.has(TrigramStance.GAN)).toBe(true);
      expect(ATTACK_ANIMATIONS_BY_STANCE.has(TrigramStance.GON)).toBe(true);
    });

    it("should have correct animation type for all attacks", () => {
      ALL_ATTACK_ANIMATIONS.forEach((animation) => {
        expect(animation.type).toBe("attack");
      });
    });

    it("should have Korean names for all animations", () => {
      ALL_ATTACK_ANIMATIONS.forEach((animation) => {
        expect(animation.koreanName).toBeDefined();
        expect(animation.koreanName.length).toBeGreaterThan(0);
      });
    });

    it("should have non-looping animations", () => {
      ALL_ATTACK_ANIMATIONS.forEach((animation) => {
        expect(animation.loop).toBe(false);
      });
    });

    it("should have realistic durations (150-450ms)", () => {
      ALL_ATTACK_ANIMATIONS.forEach((animation) => {
        expect(animation.duration).toBeGreaterThanOrEqual(0.15);
        expect(animation.duration).toBeLessThanOrEqual(0.45);
      });
    });
  });

  describe("Helper Functions", () => {
    describe("getAttackAnimationsForStance", () => {
      it("should return 3 animations for each stance", () => {
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
          const animations = getAttackAnimationsForStance(stance);
          expect(animations).toHaveLength(3);
        });
      });

      it("should return empty array for invalid stance", () => {
        const animations = getAttackAnimationsForStance("invalid" as TrigramStance);
        expect(animations).toHaveLength(0);
      });
    });

    describe("getAttackAnimation", () => {
      it("should retrieve animation by name", () => {
        const animation = getAttackAnimation("geon_bone_breaking_strike_1");
        expect(animation).toBeDefined();
        expect(animation?.name).toBe("geon_bone_breaking_strike_1");
      });

      it("should return undefined for non-existent animation", () => {
        const animation = getAttackAnimation("nonexistent_animation");
        expect(animation).toBeUndefined();
      });
    });
  });

  describe("Animation Quality Checks", () => {
    it("should have at least 2 keyframes per animation", () => {
      ALL_ATTACK_ANIMATIONS.forEach((animation) => {
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(2);
      });
    });

    it("should have keyframes at time 0 and duration", () => {
      ALL_ATTACK_ANIMATIONS.forEach((animation) => {
        const firstKeyframe = animation.keyframes[0];
        const lastKeyframe = animation.keyframes[animation.keyframes.length - 1];
        
        expect(firstKeyframe.time).toBe(0);
        expect(lastKeyframe.time).toBeCloseTo(animation.duration, 2);
      });
    });

    it("should have valid easing values", () => {
      const validEasings = ["linear", "ease-in", "ease-out", "ease-in-out"];
      
      ALL_ATTACK_ANIMATIONS.forEach((animation) => {
        animation.keyframes.forEach((keyframe) => {
          expect(validEasings).toContain(keyframe.easing);
        });
      });
    });

    it("should have bone rotations in each keyframe", () => {
      ALL_ATTACK_ANIMATIONS.forEach((animation) => {
        animation.keyframes.forEach((keyframe) => {
          expect(keyframe.boneRotations).toBeInstanceOf(Map);
        });
      });
    });
  });

  describe("Korean Martial Arts Authenticity", () => {
    it("should reflect stance philosophy in attack characteristics", () => {
      // Fire (LI) should have fastest attacks (precision)
      const liAnimations = getAttackAnimationsForStance(TrigramStance.LI);
      const liAvgDuration = liAnimations.reduce((sum, a) => sum + a.duration, 0) / liAnimations.length;
      
      // Wind (SON) should have longest attacks (combos)
      const sonAnimations = getAttackAnimationsForStance(TrigramStance.SON);
      const sonAvgDuration = sonAnimations.reduce((sum, a) => sum + a.duration, 0) / sonAnimations.length;
      
      expect(liAvgDuration).toBeLessThan(sonAvgDuration);
    });

    it("should have unique attack counts per stance", () => {
      const animationCounts = new Set();
      
      ATTACK_ANIMATIONS_BY_STANCE.forEach((animations) => {
        animations.forEach((animation) => {
          animationCounts.add(animation.name);
        });
      });
      
      // All 24 animations should be unique
      expect(animationCounts.size).toBe(24);
    });
  });
});
