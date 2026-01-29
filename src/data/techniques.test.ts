/**
 * Tests for technique data definitions and mappings
 *
 * **Korean**: 기술 데이터 테스트 (Technique Data Tests)
 *
 * Tests verify:
 * - Technique data integrity for all archetypes
 * - Technique-to-animation mappings
 * - Data validation (damage, stamina, cooldowns)
 * - Function behavior (getTechniquesForArchetype, getTechniqueById, getTechniquesForStanceAndArchetype)
 * - Edge cases and error handling
 *
 * @module data/techniques.test
 * @category Testing
 * @korean 기술데이터테스트
 */

import { describe, expect, it } from "vitest";
import {
  MUSA_TECHNIQUES,
  AMSALJA_TECHNIQUES,
  HACKER_TECHNIQUES,
  JEONGBO_YOWON_TECHNIQUES,
  JOJIK_POKRYEOKBAE_TECHNIQUES,
  getTechniquesForArchetype,
  getTechniquesForStanceAndArchetype,
  getTechniqueById,
} from "./techniques";
import { PlayerArchetype, TrigramStance, DamageType } from "@/types";
import { AttackAnimationType } from "@/types/skeletal";

// All technique constants for validation
const ALL_TECHNIQUE_SETS = [
  { name: "MUSA", techniques: MUSA_TECHNIQUES, archetype: PlayerArchetype.MUSA },
  { name: "AMSALJA", techniques: AMSALJA_TECHNIQUES, archetype: PlayerArchetype.AMSALJA },
  { name: "HACKER", techniques: HACKER_TECHNIQUES, archetype: PlayerArchetype.HACKER },
  { name: "JEONGBO_YOWON", techniques: JEONGBO_YOWON_TECHNIQUES, archetype: PlayerArchetype.JEONGBO_YOWON },
  { name: "JOJIK_POKRYEOKBAE", techniques: JOJIK_POKRYEOKBAE_TECHNIQUES, archetype: PlayerArchetype.JOJIK_POKRYEOKBAE },
] as const;

describe("techniques.ts Data Layer", () => {
  describe("MUSA_TECHNIQUES", () => {
    it("should have 4 techniques defined", () => {
      expect(MUSA_TECHNIQUES.length).toBe(4);
    });

    it("should have valid structure for each technique", () => {
      MUSA_TECHNIQUES.forEach((technique) => {
        expect(technique).toHaveProperty("id");
        expect(technique).toHaveProperty("name");
        expect(technique).toHaveProperty("description");
        expect(technique).toHaveProperty("staminaCost");
        expect(technique).toHaveProperty("kiCost");
        expect(technique).toHaveProperty("damage");
        expect(technique).toHaveProperty("damageType");
        expect(technique).toHaveProperty("cooldown");
        expect(technique).toHaveProperty("keyboardShortcut");
        expect(technique).toHaveProperty("animationDuration");
        expect(technique).toHaveProperty("animation");
      });
    });

    it("should have bilingual Korean-English names", () => {
      MUSA_TECHNIQUES.forEach((technique) => {
        expect(technique.name.korean).toBeTruthy();
        expect(technique.name.english).toBeTruthy();
        expect(technique.name.korean).not.toBe(technique.name.english);
      });
    });

    it("should have valid damage ranges", () => {
      MUSA_TECHNIQUES.forEach((technique) => {
        // Some defensive techniques may have min damage of 0
        expect(technique.damage.min).toBeGreaterThanOrEqual(0);
        expect(technique.damage.max).toBeGreaterThanOrEqual(technique.damage.min);
        expect(technique.damage.max).toBeLessThanOrEqual(100);
      });
    });

    it("should have valid stamina costs", () => {
      MUSA_TECHNIQUES.forEach((technique) => {
        expect(technique.staminaCost).toBeGreaterThan(0);
        expect(technique.staminaCost).toBeGreaterThanOrEqual(5);
        expect(technique.staminaCost).toBeLessThanOrEqual(50);
      });
    });

    it("should have valid ki costs", () => {
      MUSA_TECHNIQUES.forEach((technique) => {
        expect(technique.kiCost).toBeGreaterThan(0);
        expect(technique.kiCost).toBeGreaterThanOrEqual(5);
        expect(technique.kiCost).toBeLessThanOrEqual(30);
      });
    });

    it("should have valid cooldown times", () => {
      MUSA_TECHNIQUES.forEach((technique) => {
        expect(technique.cooldown).toBeGreaterThan(0);
        expect(technique.cooldown).toBeGreaterThanOrEqual(500);
        expect(technique.cooldown).toBeLessThanOrEqual(3000);
      });
    });

    it("should have valid animation durations", () => {
      MUSA_TECHNIQUES.forEach((technique) => {
        expect(technique.animationDuration).toBeGreaterThan(0);
        expect(technique.animationDuration).toBeLessThanOrEqual(technique.cooldown);
      });
    });

    it("should have valid DamageType enums", () => {
      const validDamageTypes = Object.values(DamageType);
      MUSA_TECHNIQUES.forEach((technique) => {
        expect(validDamageTypes).toContain(technique.damageType);
      });
    });

    it("should have valid AttackAnimationType", () => {
      const validAnimationTypes = Object.values(AttackAnimationType);
      MUSA_TECHNIQUES.forEach((technique) => {
        expect(technique.animation).toBeDefined();
        if (technique.animation) {
          expect(validAnimationTypes).toContain(technique.animation.type);
        }
      });
    });

    it("should have unique technique IDs", () => {
      const ids = MUSA_TECHNIQUES.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it("should have unique keyboard shortcuts", () => {
      const shortcuts = MUSA_TECHNIQUES.map((t) => t.keyboardShortcut);
      const uniqueShortcuts = new Set(shortcuts);
      expect(shortcuts.length).toBe(uniqueShortcuts.size);
    });
  });

  describe("AMSALJA_TECHNIQUES", () => {
    it("should have 4 techniques defined", () => {
      expect(AMSALJA_TECHNIQUES.length).toBe(4);
    });

    it("should have valid structure for each technique", () => {
      AMSALJA_TECHNIQUES.forEach((technique) => {
        expect(technique).toHaveProperty("id");
        expect(technique).toHaveProperty("name");
        expect(technique.name).toHaveProperty("korean");
        expect(technique.name).toHaveProperty("english");
      });
    });

    it("should have bilingual names", () => {
      AMSALJA_TECHNIQUES.forEach((technique) => {
        expect(technique.name.korean).toBeTruthy();
        expect(technique.name.english).toBeTruthy();
      });
    });

    it("should have valid damage ranges", () => {
      AMSALJA_TECHNIQUES.forEach((technique) => {
        expect(technique.damage.min).toBeGreaterThan(0);
        expect(technique.damage.max).toBeGreaterThan(technique.damage.min);
      });
    });

    it("should have techniques targeting vital points", () => {
      const vitalPointTechs = AMSALJA_TECHNIQUES.filter((t) => t.targetsVitalPoint);
      expect(vitalPointTechs.length).toBeGreaterThan(0);
    });

    it("should use NERVE and PRESSURE damage types for assassin", () => {
      const nerveDamage = AMSALJA_TECHNIQUES.filter(
        (t) => t.damageType === DamageType.NERVE || t.damageType === DamageType.PRESSURE
      );
      expect(nerveDamage.length).toBeGreaterThan(0);
    });
  });

  describe("HACKER_TECHNIQUES", () => {
    it("should have 4 techniques defined", () => {
      expect(HACKER_TECHNIQUES.length).toBe(4);
    });

    it("should have valid structure for each technique", () => {
      HACKER_TECHNIQUES.forEach((technique) => {
        expect(technique).toHaveProperty("id");
        expect(technique).toHaveProperty("name");
        expect(technique).toHaveProperty("damage");
      });
    });

    it("should use ELECTRIC and PSYCHIC damage types for cyber warrior", () => {
      const cyberDamage = HACKER_TECHNIQUES.filter(
        (t) => t.damageType === DamageType.ELECTRIC || t.damageType === DamageType.PSYCHIC
      );
      expect(cyberDamage.length).toBeGreaterThan(0);
    });

    it("should have techniques with special effects", () => {
      const specialEffects = HACKER_TECHNIQUES.filter((t) => t.specialEffect);
      expect(specialEffects.length).toBeGreaterThan(0);
    });
  });

  describe("JEONGBO_YOWON_TECHNIQUES", () => {
    it("should have 5 techniques defined", () => {
      expect(JEONGBO_YOWON_TECHNIQUES.length).toBe(5);
    });

    it("should have valid structure for each technique", () => {
      JEONGBO_YOWON_TECHNIQUES.forEach((technique) => {
        expect(technique).toHaveProperty("id");
        expect(technique).toHaveProperty("name");
        expect(technique).toHaveProperty("damage");
      });
    });

    it("should have precision techniques targeting vital points", () => {
      const vitalPointTechs = JEONGBO_YOWON_TECHNIQUES.filter((t) => t.targetsVitalPoint);
      expect(vitalPointTechs.length).toBeGreaterThan(2);
    });

    it("should have signature move", () => {
      const signatureMoves = JEONGBO_YOWON_TECHNIQUES.filter(
        (t) => t.specialEffect === "signature_move"
      );
      expect(signatureMoves.length).toBe(1);
    });
  });

  describe("JOJIK_POKRYEOKBAE_TECHNIQUES", () => {
    it("should have 4 techniques defined", () => {
      expect(JOJIK_POKRYEOKBAE_TECHNIQUES.length).toBe(4);
    });

    it("should have valid structure for each technique", () => {
      JOJIK_POKRYEOKBAE_TECHNIQUES.forEach((technique) => {
        expect(technique).toHaveProperty("id");
        expect(technique).toHaveProperty("name");
        expect(technique).toHaveProperty("damage");
      });
    });

    it("should use BLUNT and CRUSHING damage for street fighter", () => {
      const brutalDamage = JOJIK_POKRYEOKBAE_TECHNIQUES.filter(
        (t) => t.damageType === DamageType.BLUNT || t.damageType === DamageType.CRUSHING
      );
      expect(brutalDamage.length).toBeGreaterThan(0);
    });

    it("should have brutal special effects", () => {
      const specialEffects = JOJIK_POKRYEOKBAE_TECHNIQUES.filter((t) => t.specialEffect);
      expect(specialEffects.length).toBeGreaterThan(0);
    });
  });

  describe("All Technique Sets Validation", () => {
    it("all techniques should have unique IDs across archetypes", () => {
      const allIds: string[] = [];
      ALL_TECHNIQUE_SETS.forEach(({ techniques }) => {
        techniques.forEach((t) => allIds.push(t.id));
      });
      const uniqueIds = new Set(allIds);
      expect(allIds.length).toBe(uniqueIds.size);
    });

    it("all techniques should have valid keyboard shortcuts", () => {
      const validShortcuts = ["Q", "E", "R", "T", "Y", "F", "G", "Z", "X", "C"];
      ALL_TECHNIQUE_SETS.forEach(({ techniques }) => {
        techniques.forEach((t) => {
          expect(validShortcuts).toContain(t.keyboardShortcut);
        });
      });
    });

    it("all techniques should have cooldown greater than animation duration", () => {
      ALL_TECHNIQUE_SETS.forEach(({ techniques }) => {
        techniques.forEach((t) => {
          if (t.animationDuration !== undefined) {
            expect(t.cooldown).toBeGreaterThanOrEqual(t.animationDuration);
          }
        });
      });
    });

    it("all techniques should have valid animation speed modifiers", () => {
      ALL_TECHNIQUE_SETS.forEach(({ techniques }) => {
        techniques.forEach((t) => {
          if (t.animation && t.animation.speedModifier !== undefined) {
            expect(t.animation.speedModifier).toBeGreaterThan(0);
            expect(t.animation.speedModifier).toBeLessThanOrEqual(2);
          }
        });
      });
    });

    it("all techniques should have valid critical chance ranges", () => {
      ALL_TECHNIQUE_SETS.forEach(({ techniques }) => {
        techniques.forEach((t) => {
          if (t.criticalChance !== undefined) {
            expect(t.criticalChance).toBeGreaterThanOrEqual(0);
            expect(t.criticalChance).toBeLessThanOrEqual(1);
          }
        });
      });
    });

    it("all techniques should have bilingual descriptions", () => {
      ALL_TECHNIQUE_SETS.forEach(({ techniques }) => {
        techniques.forEach((t) => {
          expect(t.description.korean).toBeTruthy();
          expect(t.description.english).toBeTruthy();
          expect(t.description.korean).not.toBe(t.description.english);
        });
      });
    });

    it("techniques with required stance should have valid TrigramStance", () => {
      const validStances = Object.values(TrigramStance);
      ALL_TECHNIQUE_SETS.forEach(({ techniques }) => {
        techniques.forEach((t) => {
          if (t.requiredStance) {
            expect(validStances).toContain(t.requiredStance);
          }
        });
      });
    });
  });

  describe("getTechniquesForArchetype() function", () => {
    it("should return MUSA techniques for MUSA archetype", () => {
      const techniques = getTechniquesForArchetype(PlayerArchetype.MUSA);
      expect(techniques).toEqual(MUSA_TECHNIQUES);
      expect(techniques.length).toBe(4);
    });

    it("should return AMSALJA techniques for AMSALJA archetype", () => {
      const techniques = getTechniquesForArchetype(PlayerArchetype.AMSALJA);
      expect(techniques).toEqual(AMSALJA_TECHNIQUES);
      expect(techniques.length).toBe(4);
    });

    it("should return HACKER techniques for HACKER archetype", () => {
      const techniques = getTechniquesForArchetype(PlayerArchetype.HACKER);
      expect(techniques).toEqual(HACKER_TECHNIQUES);
      expect(techniques.length).toBe(4);
    });

    it("should return JEONGBO_YOWON techniques for JEONGBO_YOWON archetype", () => {
      const techniques = getTechniquesForArchetype(PlayerArchetype.JEONGBO_YOWON);
      expect(techniques).toEqual(JEONGBO_YOWON_TECHNIQUES);
      expect(techniques.length).toBe(5);
    });

    it("should return JOJIK_POKRYEOKBAE techniques for JOJIK_POKRYEOKBAE archetype", () => {
      const techniques = getTechniquesForArchetype(PlayerArchetype.JOJIK_POKRYEOKBAE);
      expect(techniques).toEqual(JOJIK_POKRYEOKBAE_TECHNIQUES);
      expect(techniques.length).toBe(4);
    });

    it("should return readonly array", () => {
      const techniques = getTechniquesForArchetype(PlayerArchetype.MUSA);
      expect(techniques).toBeDefined();
      expect(Array.isArray(techniques)).toBe(true);
    });
  });

  describe("getTechniqueById() function", () => {
    it("should return correct technique for valid MUSA ID", () => {
      const technique = getTechniqueById("musa_thunder_strike");
      expect(technique).toBeDefined();
      expect(technique?.id).toBe("musa_thunder_strike");
      expect(technique?.name.korean).toBe("천둥벽력");
    });

    it("should return correct technique for valid AMSALJA ID", () => {
      const technique = getTechniqueById("amsalja_shadow_strike");
      expect(technique).toBeDefined();
      expect(technique?.id).toBe("amsalja_shadow_strike");
      expect(technique?.name.korean).toBe("암영격");
    });

    it("should return correct technique for valid HACKER ID", () => {
      const technique = getTechniqueById("hacker_electric_shock");
      expect(technique).toBeDefined();
      expect(technique?.id).toBe("hacker_electric_shock");
    });

    it("should return correct technique for valid JEONGBO ID", () => {
      const technique = getTechniqueById("jeongbo_tactical_strike");
      expect(technique).toBeDefined();
      expect(technique?.id).toBe("jeongbo_tactical_strike");
    });

    it("should return correct technique for valid JOJIK ID", () => {
      const technique = getTechniqueById("jojik_street_brawl");
      expect(technique).toBeDefined();
      expect(technique?.id).toBe("jojik_street_brawl");
    });

    it("should return undefined for invalid technique ID", () => {
      const technique = getTechniqueById("invalid_technique_id");
      expect(technique).toBeUndefined();
    });

    it("should return undefined for empty string", () => {
      const technique = getTechniqueById("");
      expect(technique).toBeUndefined();
    });

    it("should handle null/undefined safely", () => {
      // TypeScript prevents this, but test runtime behavior
      expect(() => getTechniqueById(null as any)).not.toThrow();
      expect(() => getTechniqueById(undefined as any)).not.toThrow();
      expect(getTechniqueById(null as any)).toBeUndefined();
      expect(getTechniqueById(undefined as any)).toBeUndefined();
    });
  });

  describe("getTechniquesForStanceAndArchetype() function", () => {
    it("should return techniques for MUSA with GEON stance", () => {
      const techniques = getTechniquesForStanceAndArchetype(
        TrigramStance.GEON,
        PlayerArchetype.MUSA
      );
      expect(techniques).toBeDefined();
      expect(Array.isArray(techniques)).toBe(true);
      expect(techniques.length).toBeGreaterThan(0);
      expect(techniques.length).toBeLessThanOrEqual(10);
    });

    it("should return techniques for AMSALJA with LI stance", () => {
      const techniques = getTechniquesForStanceAndArchetype(
        TrigramStance.LI,
        PlayerArchetype.AMSALJA
      );
      expect(techniques).toBeDefined();
      expect(techniques.length).toBeGreaterThan(0);
    });

    it("should return techniques for HACKER with JIN stance", () => {
      const techniques = getTechniquesForStanceAndArchetype(
        TrigramStance.JIN,
        PlayerArchetype.HACKER
      );
      expect(techniques).toBeDefined();
      expect(techniques.length).toBeGreaterThan(0);
    });

    it("should return techniques for JEONGBO_YOWON with GAM stance", () => {
      const techniques = getTechniquesForStanceAndArchetype(
        TrigramStance.GAM,
        PlayerArchetype.JEONGBO_YOWON
      );
      expect(techniques).toBeDefined();
      expect(techniques.length).toBeGreaterThan(0);
    });

    it("should return techniques for JOJIK_POKRYEOKBAE with GON stance", () => {
      const techniques = getTechniquesForStanceAndArchetype(
        TrigramStance.GON,
        PlayerArchetype.JOJIK_POKRYEOKBAE
      );
      expect(techniques).toBeDefined();
      expect(techniques.length).toBeGreaterThan(0);
    });

    it("should limit techniques to maximum 10", () => {
      const stances = Object.values(TrigramStance);
      const archetypes = Object.values(PlayerArchetype);
      
      stances.forEach((stance) => {
        archetypes.forEach((archetype) => {
          const techniques = getTechniquesForStanceAndArchetype(stance, archetype);
          expect(techniques.length).toBeLessThanOrEqual(10);
        });
      });
    });

    it("should assign unique keyboard shortcuts", () => {
      const techniques = getTechniquesForStanceAndArchetype(
        TrigramStance.GEON,
        PlayerArchetype.MUSA
      );
      const shortcuts = techniques.map((t) => t.keyboardShortcut);
      const uniqueShortcuts = new Set(shortcuts);
      expect(shortcuts.length).toBe(uniqueShortcuts.size);
    });

    it("should assign keyboard shortcuts in correct order", () => {
      const techniques = getTechniquesForStanceAndArchetype(
        TrigramStance.GEON,
        PlayerArchetype.MUSA
      );
      const expectedShortcuts = ["Q", "E", "R", "T", "Y", "F", "G", "Z", "X", "C"];
      techniques.forEach((t, index) => {
        expect(t.keyboardShortcut).toBe(expectedShortcuts[index]);
      });
    });

    it("should combine stance techniques with archetype techniques", () => {
      const techniques = getTechniquesForStanceAndArchetype(
        TrigramStance.GEON,
        PlayerArchetype.MUSA
      );
      // Should include techniques from KoreanTechniquesSystem and archetype-specific
      expect(techniques.length).toBeGreaterThan(0);
    });

    it("should filter archetype techniques by stance requirement", () => {
      // Test with a stance that has no matching archetype techniques
      const techniques = getTechniquesForStanceAndArchetype(
        TrigramStance.TAE,
        PlayerArchetype.MUSA
      );
      // Should still return techniques (from KoreanTechniquesSystem)
      expect(techniques).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle null/undefined technique ID safely in getTechniqueById", () => {
      expect(() => getTechniqueById(null as any)).not.toThrow();
      expect(() => getTechniqueById(undefined as any)).not.toThrow();
    });

    it("should return undefined for non-existent technique", () => {
      expect(getTechniqueById("nonexistent")).toBeUndefined();
      expect(getTechniqueById("")).toBeUndefined();
    });

    it("all technique constants should be readonly arrays", () => {
      expect(Array.isArray(MUSA_TECHNIQUES)).toBe(true);
      expect(Array.isArray(AMSALJA_TECHNIQUES)).toBe(true);
      expect(Array.isArray(HACKER_TECHNIQUES)).toBe(true);
      expect(Array.isArray(JEONGBO_YOWON_TECHNIQUES)).toBe(true);
      expect(Array.isArray(JOJIK_POKRYEOKBAE_TECHNIQUES)).toBe(true);
    });

    it("techniques should have consistent ID format", () => {
      const archetypePrefixes: Record<string, string> = {
        "MUSA": "musa",
        "AMSALJA": "amsalja",
        "HACKER": "hacker",
        "JEONGBO_YOWON": "jeongbo", // Uses short form "jeongbo" not full name
        "JOJIK_POKRYEOKBAE": "jojik", // Uses short form "jojik" not full name
      };
      
      ALL_TECHNIQUE_SETS.forEach(({ name, techniques }) => {
        const prefix = archetypePrefixes[name];
        techniques.forEach((t) => {
          expect(t.id).toMatch(/^[a-z_]+$/); // lowercase with underscores
          expect(t.id.startsWith(prefix)).toBe(true);
        });
      });
    });

    it("technique damage min should never exceed max", () => {
      ALL_TECHNIQUE_SETS.forEach(({ techniques }) => {
        techniques.forEach((t) => {
          expect(t.damage.min).toBeLessThanOrEqual(t.damage.max);
        });
      });
    });

    it("animation duration should be reasonable for gameplay", () => {
      ALL_TECHNIQUE_SETS.forEach(({ techniques }) => {
        techniques.forEach((t) => {
          expect(t.animationDuration).toBeGreaterThanOrEqual(100);
          expect(t.animationDuration).toBeLessThanOrEqual(2000);
        });
      });
    });

    it("cooldown should be reasonable for gameplay", () => {
      ALL_TECHNIQUE_SETS.forEach(({ techniques }) => {
        techniques.forEach((t) => {
          expect(t.cooldown).toBeGreaterThanOrEqual(500);
          expect(t.cooldown).toBeLessThanOrEqual(3000);
        });
      });
    });
  });

  describe("Data Integrity Cross-Checks", () => {
    it("all techniques should have matching animation types", () => {
      const validAnimationTypes = Object.values(AttackAnimationType);
      ALL_TECHNIQUE_SETS.forEach(({ techniques }) => {
        techniques.forEach((t) => {
          if (t.animation) {
            expect(validAnimationTypes).toContain(t.animation.type);
          }
        });
      });
    });

    it("all techniques should have matching damage types", () => {
      const validDamageTypes = Object.values(DamageType);
      ALL_TECHNIQUE_SETS.forEach(({ techniques }) => {
        techniques.forEach((t) => {
          expect(validDamageTypes).toContain(t.damageType);
        });
      });
    });

    it("techniques with special effects should have valid effect names", () => {
      const knownEffects = [
        "defense_boost",
        "armor_break",
        "paralysis",
        "instant_kill_chance",
        "stun",
        "multi_hit",
        "system_shutdown",
        "counter_stance",
        "confusion",
        "signature_move",
        "knockdown",
        "bleed",
        "rage",
      ];
      ALL_TECHNIQUE_SETS.forEach(({ techniques }) => {
        techniques.forEach((t) => {
          if (t.specialEffect) {
            expect(knownEffects).toContain(t.specialEffect);
          }
        });
      });
    });

    it("required stances should match technique archetype philosophy", () => {
      // MUSA favors GEON (Heaven)
      const musaStanceTechs = MUSA_TECHNIQUES.filter((t) => t.requiredStance);
      musaStanceTechs.forEach((t) => {
        expect([TrigramStance.GEON, TrigramStance.GAN]).toContain(t.requiredStance);
      });

      // AMSALJA favors LI (Fire)
      const amsaljaStanceTechs = AMSALJA_TECHNIQUES.filter((t) => t.requiredStance);
      amsaljaStanceTechs.forEach((t) => {
        expect(t.requiredStance).toBe(TrigramStance.LI);
      });

      // HACKER favors JIN (Thunder)
      const hackerStanceTechs = HACKER_TECHNIQUES.filter((t) => t.requiredStance);
      hackerStanceTechs.forEach((t) => {
        expect(t.requiredStance).toBe(TrigramStance.JIN);
      });

      // JEONGBO_YOWON favors GAM (Water)
      const jeongboStanceTechs = JEONGBO_YOWON_TECHNIQUES.filter((t) => t.requiredStance);
      jeongboStanceTechs.forEach((t) => {
        expect(t.requiredStance).toBe(TrigramStance.GAM);
      });

      // JOJIK_POKRYEOKBAE favors GON (Earth)
      const jojikStanceTechs = JOJIK_POKRYEOKBAE_TECHNIQUES.filter((t) => t.requiredStance);
      jojikStanceTechs.forEach((t) => {
        expect(t.requiredStance).toBe(TrigramStance.GON);
      });
    });
  });

  describe("Cultural Accuracy", () => {
    it("technique names should use appropriate Korean terminology", () => {
      // MUSA (무사) should use traditional martial arts terms
      expect(MUSA_TECHNIQUES.some((t) => t.name.korean.includes("벽력"))).toBe(true);
      expect(MUSA_TECHNIQUES.some((t) => t.name.korean.includes("방어"))).toBe(true);

      // AMSALJA (암살자) should use stealth/assassination terms
      expect(AMSALJA_TECHNIQUES.some((t) => t.name.korean.includes("암"))).toBe(true);
      expect(AMSALJA_TECHNIQUES.some((t) => t.name.korean.includes("신경"))).toBe(true);

      // HACKER (해커) should use cyber/tech terms
      expect(HACKER_TECHNIQUES.some((t) => t.name.korean.includes("전격") || t.name.korean.includes("사이버"))).toBe(true);

      // JEONGBO_YOWON (정보요원) should use intelligence terms
      expect(JEONGBO_YOWON_TECHNIQUES.some((t) => t.name.korean.includes("전술") || t.name.korean.includes("정보"))).toBe(true);

      // JOJIK_POKRYEOKBAE (조직폭력배) should use street fighting terms
      expect(JOJIK_POKRYEOKBAE_TECHNIQUES.some((t) => t.name.korean.includes("거리") || t.name.korean.includes("잔혹"))).toBe(true);
    });

    it("bilingual names should be culturally consistent", () => {
      ALL_TECHNIQUE_SETS.forEach(({ techniques }) => {
        techniques.forEach((t) => {
          // Korean name should not be empty
          expect(t.name.korean.length).toBeGreaterThan(0);
          // English name should not be empty
          expect(t.name.english.length).toBeGreaterThan(0);
          // Korean and English should be different
          expect(t.name.korean).not.toBe(t.name.english);
        });
      });
    });
  });
});
