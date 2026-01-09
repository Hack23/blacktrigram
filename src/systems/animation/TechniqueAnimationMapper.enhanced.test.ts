/**
 * Unit tests for enhanced TechniqueAnimationMapper
 * 
 * **Korean**: 향상된 기술 애니메이션 매퍼 단위 테스트
 * 
 * Tests comprehensive technique-stance-animation mapping system
 * with O(1) lookup performance and intelligent fallback.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  TechniqueAnimationMapper,
  techniqueAnimationMapper,
} from "./TechniqueAnimationMapper";
import { TrigramStance } from "@/types";
import { BodyPart } from "../bodypart/types";
import {
  AnimationState,
  type TechniqueAnimationKey,
  type TechniqueIntensity,
  type TechniqueTypeCategory,
} from "./types";

describe("TechniqueAnimationMapper", () => {
  let mapper: TechniqueAnimationMapper;

  beforeEach(() => {
    mapper = new TechniqueAnimationMapper();
  });

  describe("initialization", () => {
    it("should initialize with complete mapping table", () => {
      const mappedCount = mapper.getMappedCount();
      expect(mappedCount).toBeGreaterThan(0);
    });

    it("should have mappings for all 8 stances", () => {
      const stances = Object.values(TrigramStance);
      expect(stances).toHaveLength(8);

      // Mapping of stances to their Korean names
      const stanceKoreanNames: Record<string, string> = {
        [TrigramStance.GEON]: "건괘",
        [TrigramStance.TAE]: "태괘",
        [TrigramStance.LI]: "리괘",
        [TrigramStance.JIN]: "진괘",
        [TrigramStance.SON]: "손괘",
        [TrigramStance.GAM]: "감괘",
        [TrigramStance.GAN]: "간괘",
        [TrigramStance.GON]: "곤괘",
      };

      // Verify at least one mapping exists for each stance
      stances.forEach((stance) => {
        const key: TechniqueAnimationKey = {
          stance,
          techniqueType: "strike",
          bodyPart: BodyPart.HEAD,
          intensity: "medium",
        };
        const animation = techniqueAnimationMapper.getAnimation(key);
        expect(animation).toBeDefined();
        expect(animation.koreanName).toContain(stanceKoreanNames[stance]);
      });
    });

    it("should provide singleton instance", () => {
      expect(techniqueAnimationMapper).toBeInstanceOf(TechniqueAnimationMapper);
      expect(techniqueAnimationMapper).toBe(techniqueAnimationMapper); // Same instance
    });
  });

  describe("getAnimation", () => {
    it("should return exact match for specific combination", () => {
      const key: TechniqueAnimationKey = {
        stance: TrigramStance.GEON,
        techniqueType: "strike",
        bodyPart: BodyPart.HEAD,
        intensity: "heavy",
      };

      const animation = techniqueAnimationMapper.getAnimation(key);

      expect(animation).toBeDefined();
      expect(animation.animationState).toBe(AnimationState.ATTACK);
      expect(animation.koreanName).toContain("건괘");
      expect(animation.koreanName).toContain("두부");
      expect(animation.englishName).toContain("Heaven");
      expect(animation.englishName).toContain("Head");
      expect(animation.priority).toBeGreaterThan(0);
    });

    it("should return animations for all 8 stances", () => {
      const stances = Object.values(TrigramStance);

      stances.forEach((stance) => {
        const key: TechniqueAnimationKey = {
          stance,
          techniqueType: "strike",
          bodyPart: BodyPart.TORSO_UPPER,
          intensity: "medium",
        };

        const animation = techniqueAnimationMapper.getAnimation(key);
        expect(animation).toBeDefined();
        expect(animation.koreanName).toBeTruthy();
        expect(animation.englishName).toBeTruthy();
      });
    });

    it("should return animations for all technique types", () => {
      const techniqueTypes: TechniqueTypeCategory[] = [
        "strike",
        "joint",
        "throw",
        "pressure_point",
      ];

      techniqueTypes.forEach((techniqueType) => {
        const key: TechniqueAnimationKey = {
          stance: TrigramStance.LI,
          techniqueType,
          bodyPart: BodyPart.ARM_LEFT,
          intensity: "medium",
        };

        const animation = techniqueAnimationMapper.getAnimation(key);
        expect(animation).toBeDefined();
        expect(animation.duration).toBeGreaterThan(0);
      });
    });

    it("should return animations for all body parts", () => {
      const bodyParts = Object.values(BodyPart);

      bodyParts.forEach((bodyPart) => {
        const key: TechniqueAnimationKey = {
          stance: TrigramStance.TAE,
          techniqueType: "strike",
          bodyPart,
          intensity: "medium",
        };

        const animation = techniqueAnimationMapper.getAnimation(key);
        expect(animation).toBeDefined();
        expect(animation.impactFrame).toBeGreaterThan(0);
      });
    });

    it("should return animations for all intensity levels", () => {
      const intensities: TechniqueIntensity[] = [
        "light",
        "medium",
        "heavy",
        "critical",
      ];

      intensities.forEach((intensity) => {
        const key: TechniqueAnimationKey = {
          stance: TrigramStance.JIN,
          techniqueType: "strike",
          bodyPart: BodyPart.NECK,
          intensity,
        };

        const animation = techniqueAnimationMapper.getAnimation(key);
        expect(animation).toBeDefined();
        expect(animation.recoveryFrames).toBeGreaterThan(0);
      });
    });

    it("should adjust duration based on intensity", () => {
      const baseKey: TechniqueAnimationKey = {
        stance: TrigramStance.SON,
        techniqueType: "strike",
        bodyPart: BodyPart.TORSO_LOWER,
        intensity: "medium",
      };

      const lightKey: TechniqueAnimationKey = { ...baseKey, intensity: "light" };
      const heavyKey: TechniqueAnimationKey = { ...baseKey, intensity: "heavy" };
      const criticalKey: TechniqueAnimationKey = { ...baseKey, intensity: "critical" };

      const mediumAnim = techniqueAnimationMapper.getAnimation(baseKey);
      const lightAnim = techniqueAnimationMapper.getAnimation(lightKey);
      const heavyAnim = techniqueAnimationMapper.getAnimation(heavyKey);
      const criticalAnim = techniqueAnimationMapper.getAnimation(criticalKey);

      // Light should be faster (shorter duration)
      expect(lightAnim.duration).toBeLessThan(mediumAnim.duration);
      // Heavy should be slower (longer duration)
      expect(heavyAnim.duration).toBeGreaterThan(mediumAnim.duration);
      // Critical should be slowest
      expect(criticalAnim.duration).toBeGreaterThan(heavyAnim.duration);
    });

    it("should use fallback for unmapped combinations", () => {
      // Create a potentially unmapped key by using unusual combination
      // (Fallback system should handle it gracefully)
      const key: TechniqueAnimationKey = {
        stance: TrigramStance.GAM,
        techniqueType: "pressure_point",
        bodyPart: BodyPart.LEG_RIGHT,
        intensity: "critical",
      };

      const animation = techniqueAnimationMapper.getAnimation(key);

      // Should return a valid animation even if exact match doesn't exist
      expect(animation).toBeDefined();
      expect(animation.animationState).toBeDefined();
      expect(animation.duration).toBeGreaterThan(0);
      expect(animation.impactFrame).toBeGreaterThanOrEqual(0);
      expect(animation.recoveryFrames).toBeGreaterThan(0);
    });
  });

  describe("stance-specific animations", () => {
    it("should have Geon (Heaven) stance emphasizing direct force", () => {
      const key: TechniqueAnimationKey = {
        stance: TrigramStance.GEON,
        techniqueType: "strike",
        bodyPart: BodyPart.TORSO_UPPER,
        intensity: "heavy",
      };

      const animation = techniqueAnimationMapper.getAnimation(key);

      expect(animation.koreanName).toContain("건괘");
      expect(animation.englishName).toContain("Heaven");
      // Geon should have standard to slightly faster animations (direct force)
      expect(animation.duration).toBeGreaterThan(0.5);
      expect(animation.duration).toBeLessThan(2.0);
    });

    it("should have Tae (Lake) stance emphasizing fluidity", () => {
      const key: TechniqueAnimationKey = {
        stance: TrigramStance.TAE,
        techniqueType: "joint",
        bodyPart: BodyPart.ARM_LEFT,
        intensity: "medium",
      };

      const animation = techniqueAnimationMapper.getAnimation(key);

      expect(animation.koreanName).toContain("태괘");
      expect(animation.englishName).toContain("Lake");
      // Tae should have faster recovery (fluid)
      expect(animation.recoveryFrames).toBeLessThanOrEqual(15);
    });

    it("should have Li (Fire) stance emphasizing speed", () => {
      const key: TechniqueAnimationKey = {
        stance: TrigramStance.LI,
        techniqueType: "pressure_point",
        bodyPart: BodyPart.NECK,
        intensity: "medium",
      };

      const animation = techniqueAnimationMapper.getAnimation(key);

      expect(animation.koreanName).toContain("리괘");
      expect(animation.englishName).toContain("Fire");
      // Li should have shorter durations (speed and precision)
      expect(animation.duration).toBeLessThan(0.7);
    });

    it("should have Jin (Thunder) stance emphasizing explosive power", () => {
      const key: TechniqueAnimationKey = {
        stance: TrigramStance.JIN,
        techniqueType: "strike",
        bodyPart: BodyPart.TORSO_UPPER,
        intensity: "heavy",
      };

      const animation = techniqueAnimationMapper.getAnimation(key);

      expect(animation.koreanName).toContain("진괘");
      expect(animation.englishName).toContain("Thunder");
      // Jin should have standard to slightly longer recovery (explosive)
      expect(animation.recoveryFrames).toBeGreaterThanOrEqual(12);
    });

    it("should have Son (Wind) stance emphasizing mobility", () => {
      const key: TechniqueAnimationKey = {
        stance: TrigramStance.SON,
        techniqueType: "strike",
        bodyPart: BodyPart.LEG_LEFT,
        intensity: "light",
      };

      const animation = techniqueAnimationMapper.getAnimation(key);

      expect(animation.koreanName).toContain("손괘");
      expect(animation.englishName).toContain("Wind");
      // Son should have faster recovery (mobility)
      expect(animation.recoveryFrames).toBeLessThanOrEqual(12);
    });

    it("should have Gam (Water) stance emphasizing adaptation", () => {
      const key: TechniqueAnimationKey = {
        stance: TrigramStance.GAM,
        techniqueType: "throw",
        bodyPart: BodyPart.TORSO_LOWER,
        intensity: "medium",
      };

      const animation = techniqueAnimationMapper.getAnimation(key);

      expect(animation.koreanName).toContain("감괘");
      expect(animation.englishName).toContain("Water");
      // Gam should have slightly longer durations (adaptive flow)
      expect(animation.duration).toBeGreaterThan(0.5);
    });

    it("should have Gan (Mountain) stance emphasizing defense", () => {
      const key: TechniqueAnimationKey = {
        stance: TrigramStance.GAN,
        techniqueType: "joint",
        bodyPart: BodyPart.ARM_RIGHT,
        intensity: "heavy",
      };

      const animation = techniqueAnimationMapper.getAnimation(key);

      expect(animation.koreanName).toContain("간괘");
      expect(animation.englishName).toContain("Mountain");
      // Gan should have longer durations and recovery (defensive, immovable)
      expect(animation.duration).toBeGreaterThan(0.6);
      expect(animation.recoveryFrames).toBeGreaterThanOrEqual(15);
    });

    it("should have Gon (Earth) stance emphasizing throws", () => {
      const key: TechniqueAnimationKey = {
        stance: TrigramStance.GON,
        techniqueType: "throw",
        bodyPart: BodyPart.TORSO_UPPER,
        intensity: "heavy",
      };

      const animation = techniqueAnimationMapper.getAnimation(key);

      expect(animation.koreanName).toContain("곤괘");
      expect(animation.englishName).toContain("Earth");
      // Gon throws should have significantly longer durations
      expect(animation.duration).toBeGreaterThan(1.0);
    });
  });

  describe("Korean terminology", () => {
    it("should include proper Korean names for all stances", () => {
      const stanceKoreanNames = [
        "건괘", // Geon
        "태괘", // Tae
        "리괘", // Li
        "진괘", // Jin
        "손괘", // Son
        "감괘", // Gam
        "간괘", // Gan
        "곤괘", // Gon
      ];

      const stances = Object.values(TrigramStance);

      stances.forEach((stance, index) => {
        const key: TechniqueAnimationKey = {
          stance,
          techniqueType: "strike",
          bodyPart: BodyPart.HEAD,
          intensity: "medium",
        };

        const animation = techniqueAnimationMapper.getAnimation(key);
        expect(animation.koreanName).toContain(stanceKoreanNames[index]);
      });
    });

    it("should include proper Korean names for body parts", () => {
      const bodyPartKoreanNames: Record<string, string> = {
        [BodyPart.HEAD]: "두부",
        [BodyPart.NECK]: "경부",
        [BodyPart.TORSO_UPPER]: "상체",
        [BodyPart.TORSO_LOWER]: "하체",
      };

      Object.entries(bodyPartKoreanNames).forEach(([bodyPart, koreanName]) => {
        const key: TechniqueAnimationKey = {
          stance: TrigramStance.GEON,
          techniqueType: "strike",
          bodyPart,
          intensity: "medium",
        };

        const animation = techniqueAnimationMapper.getAnimation(key);
        expect(animation.koreanName).toContain(koreanName);
      });
    });

    it("should include bilingual technique names", () => {
      const key: TechniqueAnimationKey = {
        stance: TrigramStance.LI,
        techniqueType: "pressure_point",
        bodyPart: BodyPart.NECK,
        intensity: "critical",
      };

      const animation = techniqueAnimationMapper.getAnimation(key);

      // Should have both Korean and English names
      expect(animation.koreanName).toBeTruthy();
      expect(animation.koreanName.length).toBeGreaterThan(0);
      expect(animation.englishName).toBeTruthy();
      expect(animation.englishName.length).toBeGreaterThan(0);
      
      // Korean name should contain Korean characters
      expect(animation.koreanName).toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/);
      
      // English name should be readable ASCII
      expect(animation.englishName).toMatch(/^[A-Za-z\s]+$/);
    });
  });

  describe("validateCompleteness", () => {
    it("should report high coverage percentage", () => {
      const validation = mapper.validateCompleteness();

      expect(validation.coverage).toBeGreaterThan(95); // At least 95% coverage
      expect(validation.total).toBeGreaterThan(0);
      expect(validation.mapped).toBeGreaterThan(0);
      expect(validation.mapped).toBeLessThanOrEqual(validation.total);
    });

    it("should calculate coverage correctly", () => {
      const validation = mapper.validateCompleteness();

      const expectedCoverage = (validation.mapped / validation.total) * 100;
      expect(validation.coverage).toBeCloseTo(expectedCoverage, 2);
    });

    it("should list missing mappings if any", () => {
      const validation = mapper.validateCompleteness();

      expect(validation.missing).toBeDefined();
      expect(Array.isArray(validation.missing)).toBe(true);
      
      // Each missing item should have required properties
      validation.missing.forEach((missing) => {
        expect(missing.stance).toBeDefined();
        expect(missing.techniqueType).toBeDefined();
        expect(missing.bodyPart).toBeDefined();
        expect(missing.intensity).toBeDefined();
      });
    });

    it("should report correct total combinations", () => {
      const validation = mapper.validateCompleteness();

      // 8 stances × 4 technique types × 8 body parts × 4 intensities = 1024
      expect(validation.total).toBe(1024);
    });

    it("should report that all combinations are mapped", () => {
      const validation = mapper.validateCompleteness();

      // We expect 100% coverage with the full implementation
      expect(validation.coverage).toBe(100);
      expect(validation.missing).toHaveLength(0);
    });
  });

  describe("performance", () => {
    it("should perform O(1) lookup", () => {
      const iterations = 10000;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        const stance = Object.values(TrigramStance)[i % 8];
        const techniqueType: TechniqueTypeCategory = ["strike", "joint", "throw", "pressure_point"][i % 4];
        const bodyPart = Object.values(BodyPart)[i % 8];
        const intensity: TechniqueIntensity = ["light", "medium", "heavy", "critical"][i % 4];

        const key: TechniqueAnimationKey = {
          stance,
          techniqueType,
          bodyPart,
          intensity,
        };

        techniqueAnimationMapper.getAnimation(key);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = totalTime / iterations;

      // Average lookup should be very fast (< 0.01ms per lookup)
      expect(avgTime).toBeLessThan(0.01);
    });

    it("should handle rapid successive lookups", () => {
      const keys: TechniqueAnimationKey[] = [
        {
          stance: TrigramStance.GEON,
          techniqueType: "strike",
          bodyPart: BodyPart.HEAD,
          intensity: "heavy",
        },
        {
          stance: TrigramStance.TAE,
          techniqueType: "joint",
          bodyPart: BodyPart.ARM_LEFT,
          intensity: "medium",
        },
        {
          stance: TrigramStance.LI,
          techniqueType: "pressure_point",
          bodyPart: BodyPart.NECK,
          intensity: "critical",
        },
      ];

      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        keys.forEach((key) => {
          techniqueAnimationMapper.getAnimation(key);
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should complete 3000 lookups in well under 100ms
      expect(totalTime).toBeLessThan(100);
    });
  });

  describe("fallback system", () => {
    it("should provide valid fallback for any combination", () => {
      const allStances = Object.values(TrigramStance);
      const allTechniqueTypes: TechniqueTypeCategory[] = [
        "strike",
        "joint",
        "throw",
        "pressure_point",
      ];
      const allBodyParts = Object.values(BodyPart);
      const allIntensities: TechniqueIntensity[] = [
        "light",
        "medium",
        "heavy",
        "critical",
      ];

      // Test a sample of combinations
      for (let i = 0; i < 50; i++) {
        const key: TechniqueAnimationKey = {
          stance: allStances[Math.floor(Math.random() * allStances.length)],
          techniqueType: allTechniqueTypes[Math.floor(Math.random() * allTechniqueTypes.length)],
          bodyPart: allBodyParts[Math.floor(Math.random() * allBodyParts.length)],
          intensity: allIntensities[Math.floor(Math.random() * allIntensities.length)],
        };

        const animation = techniqueAnimationMapper.getAnimation(key);

        // Should always return valid animation
        expect(animation).toBeDefined();
        expect(animation.animationState).toBeDefined();
        expect(animation.duration).toBeGreaterThan(0);
        expect(animation.impactFrame).toBeGreaterThanOrEqual(0);
        expect(animation.recoveryFrames).toBeGreaterThan(0);
        expect(animation.priority).toBeGreaterThanOrEqual(0);
        expect(animation.koreanName).toBeTruthy();
        expect(animation.englishName).toBeTruthy();
      }
    });

    it("should provide fallback with reasonable properties", () => {
      // Use a combination that might not have exact match
      const key: TechniqueAnimationKey = {
        stance: TrigramStance.GAN,
        techniqueType: "throw",
        bodyPart: BodyPart.LEG_RIGHT,
        intensity: "light",
      };

      const animation = techniqueAnimationMapper.getAnimation(key);

      // Even if it's a fallback, should have reasonable values
      expect(animation.duration).toBeGreaterThan(0.2);
      expect(animation.duration).toBeLessThan(3.0);
      expect(animation.impactFrame).toBeGreaterThan(0);
      expect(animation.impactFrame).toBeLessThan(60); // Within 1 second at 60fps
      expect(animation.recoveryFrames).toBeGreaterThan(0);
      expect(animation.recoveryFrames).toBeLessThan(100);
    });
  });

  describe("animation timing", () => {
    it("should have appropriate impact frames for different intensities", () => {
      const stances = [TrigramStance.GEON, TrigramStance.LI, TrigramStance.GAM];

      stances.forEach((stance) => {
        const lightKey: TechniqueAnimationKey = {
          stance,
          techniqueType: "strike",
          bodyPart: BodyPart.TORSO_UPPER,
          intensity: "light",
        };

        const criticalKey: TechniqueAnimationKey = {
          ...lightKey,
          intensity: "critical",
        };

        const lightAnim = techniqueAnimationMapper.getAnimation(lightKey);
        const criticalAnim = techniqueAnimationMapper.getAnimation(criticalKey);

        // Light attacks should have earlier impact frames
        expect(lightAnim.impactFrame).toBeLessThan(criticalAnim.impactFrame);
      });
    });

    it("should have appropriate recovery frames for different intensities", () => {
      const key: TechniqueAnimationKey = {
        stance: TrigramStance.JIN,
        techniqueType: "strike",
        bodyPart: BodyPart.HEAD,
        intensity: "medium",
      };

      const lightAnim = techniqueAnimationMapper.getAnimation({ ...key, intensity: "light" });
      const mediumAnim = techniqueAnimationMapper.getAnimation(key);
      const heavyAnim = techniqueAnimationMapper.getAnimation({ ...key, intensity: "heavy" });
      const criticalAnim = techniqueAnimationMapper.getAnimation({ ...key, intensity: "critical" });

      // Recovery frames should increase with intensity
      expect(lightAnim.recoveryFrames).toBeLessThan(mediumAnim.recoveryFrames);
      expect(mediumAnim.recoveryFrames).toBeLessThan(heavyAnim.recoveryFrames);
      expect(heavyAnim.recoveryFrames).toBeLessThan(criticalAnim.recoveryFrames);
    });
  });

  describe("getMappedCount", () => {
    it("should return total number of mapped combinations", () => {
      const count = mapper.getMappedCount();

      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThanOrEqual(1024); // Max possible combinations
    });

    it("should match validation mapped count", () => {
      const validation = mapper.validateCompleteness();
      const directCount = mapper.getMappedCount();

      expect(directCount).toBe(validation.mapped);
    });
  });
});

describe("techniqueAnimationMapper singleton", () => {
  it("should provide ready-to-use mapper instance", () => {
    expect(techniqueAnimationMapper).toBeInstanceOf(TechniqueAnimationMapper);
  });

  it("should work immediately after import", () => {
    const key: TechniqueAnimationKey = {
      stance: TrigramStance.GEON,
      techniqueType: "strike",
      bodyPart: BodyPart.HEAD,
      intensity: "heavy",
    };

    const animation = techniqueAnimationMapper.getAnimation(key);

    expect(animation).toBeDefined();
    expect(animation.koreanName).toBeTruthy();
  });

  it("should provide consistent results across multiple calls", () => {
    const key: TechniqueAnimationKey = {
      stance: TrigramStance.TAE,
      techniqueType: "joint",
      bodyPart: BodyPart.ARM_LEFT,
      intensity: "medium",
    };

    const result1 = techniqueAnimationMapper.getAnimation(key);
    const result2 = techniqueAnimationMapper.getAnimation(key);

    expect(result1.koreanName).toBe(result2.koreanName);
    expect(result1.englishName).toBe(result2.englishName);
    expect(result1.duration).toBe(result2.duration);
    expect(result1.impactFrame).toBe(result2.impactFrame);
  });

  // ===== Torso & Hip Rotation Tests (허리 및 골반 회전 테스트) =====
  
  describe("Torso and Hip Rotation Integration", () => {
    it("should include torso rotation for all techniques", () => {
      const key: TechniqueAnimationKey = {
        stance: TrigramStance.GEON,
        techniqueType: "strike",
        bodyPart: BodyPart.HEAD,
        intensity: "heavy",
      };

      const animation = techniqueAnimationMapper.getAnimation(key);

      expect(animation.torsoRotation).toBeDefined();
      expect(typeof animation.torsoRotation).toBe("number");
      expect(animation.torsoRotation).toBeGreaterThanOrEqual(-Math.PI / 2);
      expect(animation.torsoRotation).toBeLessThanOrEqual(Math.PI / 2);
    });

    it("should include hip engagement for all techniques", () => {
      const key: TechniqueAnimationKey = {
        stance: TrigramStance.JIN,
        techniqueType: "throw",
        bodyPart: BodyPart.TORSO_LOWER,
        intensity: "critical",
      };

      const animation = techniqueAnimationMapper.getAnimation(key);

      expect(animation.hipEngagement).toBeDefined();
      expect(typeof animation.hipEngagement).toBe("number");
      expect(animation.hipEngagement).toBeGreaterThanOrEqual(0);
      expect(animation.hipEngagement).toBeLessThanOrEqual(1);
    });

    it("should calculate power modifier based on hip engagement", () => {
      const key: TechniqueAnimationKey = {
        stance: TrigramStance.GEON,
        techniqueType: "strike",
        bodyPart: BodyPart.HEAD,
        intensity: "heavy",
      };

      const animation = techniqueAnimationMapper.getAnimation(key);

      expect(animation.powerModifier).toBeDefined();
      expect(typeof animation.powerModifier).toBe("number");
      expect(animation.powerModifier).toBeGreaterThanOrEqual(1.0);
      expect(animation.powerModifier).toBeLessThanOrEqual(1.3);
    });

    it("should have higher hip engagement for Jin (Thunder) stance", () => {
      const jinKey: TechniqueAnimationKey = {
        stance: TrigramStance.JIN,
        techniqueType: "strike",
        bodyPart: BodyPart.HEAD,
        intensity: "heavy",
      };

      const ganKey: TechniqueAnimationKey = {
        stance: TrigramStance.GAN, // Mountain - defensive, low engagement
        techniqueType: "strike",
        bodyPart: BodyPart.HEAD,
        intensity: "heavy",
      };

      const jinAnimation = techniqueAnimationMapper.getAnimation(jinKey);
      const ganAnimation = techniqueAnimationMapper.getAnimation(ganKey);

      expect(jinAnimation.hipEngagement).toBeGreaterThan(ganAnimation.hipEngagement!);
    });

    it("should have higher torso rotation for throws than joint techniques", () => {
      const throwKey: TechniqueAnimationKey = {
        stance: TrigramStance.GEON,
        techniqueType: "throw",
        bodyPart: BodyPart.TORSO_UPPER,
        intensity: "heavy",
      };

      const jointKey: TechniqueAnimationKey = {
        stance: TrigramStance.GEON,
        techniqueType: "joint",
        bodyPart: BodyPart.TORSO_UPPER,
        intensity: "heavy",
      };

      const throwAnimation = techniqueAnimationMapper.getAnimation(throwKey);
      const jointAnimation = techniqueAnimationMapper.getAnimation(jointKey);

      expect(throwAnimation.torsoRotation).toBeGreaterThan(jointAnimation.torsoRotation!);
    });

    it("should increase hip engagement with technique intensity", () => {
      const lightKey: TechniqueAnimationKey = {
        stance: TrigramStance.GEON,
        techniqueType: "strike",
        bodyPart: BodyPart.HEAD,
        intensity: "light",
      };

      const criticalKey: TechniqueAnimationKey = {
        stance: TrigramStance.GEON,
        techniqueType: "strike",
        bodyPart: BodyPart.HEAD,
        intensity: "critical",
      };

      const lightAnimation = techniqueAnimationMapper.getAnimation(lightKey);
      const criticalAnimation = techniqueAnimationMapper.getAnimation(criticalKey);

      expect(criticalAnimation.hipEngagement).toBeGreaterThan(lightAnimation.hipEngagement!);
    });

    it("should give strikes higher power modifier than joint techniques", () => {
      const strikeKey: TechniqueAnimationKey = {
        stance: TrigramStance.GEON,
        techniqueType: "strike",
        bodyPart: BodyPart.HEAD,
        intensity: "heavy",
      };

      const jointKey: TechniqueAnimationKey = {
        stance: TrigramStance.GEON,
        techniqueType: "joint",
        bodyPart: BodyPart.HEAD,
        intensity: "heavy",
      };

      const strikeAnimation = techniqueAnimationMapper.getAnimation(strikeKey);
      const jointAnimation = techniqueAnimationMapper.getAnimation(jointKey);

      expect(strikeAnimation.powerModifier).toBeGreaterThan(jointAnimation.powerModifier!);
    });

    it("should have minimal torso rotation for Gan (Mountain) stance", () => {
      const ganKey: TechniqueAnimationKey = {
        stance: TrigramStance.GAN,
        techniqueType: "strike",
        bodyPart: BodyPart.HEAD,
        intensity: "heavy",
      };

      const gonKey: TechniqueAnimationKey = {
        stance: TrigramStance.GON, // Earth - deep rotation
        techniqueType: "strike",
        bodyPart: BodyPart.HEAD,
        intensity: "heavy",
      };

      const ganAnimation = techniqueAnimationMapper.getAnimation(ganKey);
      const gonAnimation = techniqueAnimationMapper.getAnimation(gonKey);

      expect(ganAnimation.torsoRotation).toBeLessThan(gonAnimation.torsoRotation!);
      expect(ganAnimation.torsoRotation).toBeLessThan(Math.PI / 18); // Less than 10°
    });

    it("should provide rotation data for all 1024 combinations", () => {
      const stances = Object.values(TrigramStance);
      const techniqueTypes: TechniqueTypeCategory[] = ["strike", "joint", "throw", "pressure_point"];
      const bodyParts = Object.values(BodyPart);
      const intensities: TechniqueIntensity[] = ["light", "medium", "heavy", "critical"];

      let countWithRotation = 0;

      stances.forEach((stance) => {
        techniqueTypes.forEach((techniqueType) => {
          bodyParts.forEach((bodyPart) => {
            intensities.forEach((intensity) => {
              const animation = techniqueAnimationMapper.getAnimation({
                stance,
                techniqueType,
                bodyPart,
                intensity,
              });

              if (animation.torsoRotation !== undefined && 
                  animation.hipEngagement !== undefined &&
                  animation.powerModifier !== undefined) {
                countWithRotation++;
              }
            });
          });
        });
      });

      expect(countWithRotation).toBe(1024); // All combinations have rotation data
    });
  });
});
