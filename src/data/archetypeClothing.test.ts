/**
 * Tests for archetype clothing data
 *
 * @category Tests
 * @korean 원형의류데이터테스트
 */

import { describe, it, expect } from "vitest";
import { PlayerArchetype } from "@/types";
import {
  getArchetypeClothing,
  MUSA_CLOTHING,
  AMSALJA_CLOTHING,
  HACKER_CLOTHING,
  JEONGBO_CLOTHING,
  JOJIK_CLOTHING,
} from "./archetypeClothing";

describe("archetypeClothing", () => {
  describe("getArchetypeClothing", () => {
    it("should return MUSA clothing for MUSA archetype", () => {
      const clothing = getArchetypeClothing(PlayerArchetype.MUSA);
      expect(clothing).toBe(MUSA_CLOTHING);
    });

    it("should return AMSALJA clothing for AMSALJA archetype", () => {
      const clothing = getArchetypeClothing(PlayerArchetype.AMSALJA);
      expect(clothing).toBe(AMSALJA_CLOTHING);
    });

    it("should return HACKER clothing for HACKER archetype", () => {
      const clothing = getArchetypeClothing(PlayerArchetype.HACKER);
      expect(clothing).toBe(HACKER_CLOTHING);
    });

    it("should return JEONGBO clothing for JEONGBO_YOWON archetype", () => {
      const clothing = getArchetypeClothing(PlayerArchetype.JEONGBO_YOWON);
      expect(clothing).toBe(JEONGBO_CLOTHING);
    });

    it("should return JOJIK clothing for JOJIK_POKRYEOKBAE archetype", () => {
      const clothing = getArchetypeClothing(PlayerArchetype.JOJIK_POKRYEOKBAE);
      expect(clothing).toBe(JOJIK_CLOTHING);
    });
  });

  describe("MUSA_CLOTHING", () => {
    it("should have correct archetype", () => {
      expect(MUSA_CLOTHING.archetype).toBe(PlayerArchetype.MUSA);
    });

    it("should have bilingual names", () => {
      expect(MUSA_CLOTHING.nameKorean).toBe("무사 군복");
      expect(MUSA_CLOTHING.nameEnglish).toBe("Military Warrior Uniform");
    });

    it("should have bilingual descriptions", () => {
      expect(MUSA_CLOTHING.descriptionKorean).toContain("도복");
      expect(MUSA_CLOTHING.descriptionEnglish).toContain("dobok");
    });

    it("should have at least 4 clothing items", () => {
      expect(MUSA_CLOTHING.items.length).toBeGreaterThanOrEqual(4);
    });

    it("should include traditional dobok components", () => {
      const hasGi = MUSA_CLOTHING.items.some(item => item.id === "musa_torso_gi");
      const hasPants = MUSA_CLOTHING.items.some(item => item.id === "musa_pants");
      const hasBelt = MUSA_CLOTHING.items.some(item => item.id === "musa_belt");
      const hasBoots = MUSA_CLOTHING.items.some(item => item.id === "musa_boots");

      expect(hasGi).toBe(true);
      expect(hasPants).toBe(true);
      expect(hasBelt).toBe(true);
      expect(hasBoots).toBe(true);
    });

    it("should have fabric material for dobok", () => {
      const gi = MUSA_CLOTHING.items.find(item => item.id === "musa_torso_gi");
      expect(gi?.material).toBe("fabric");
    });
  });

  describe("AMSALJA_CLOTHING", () => {
    it("should have correct archetype", () => {
      expect(AMSALJA_CLOTHING.archetype).toBe(PlayerArchetype.AMSALJA);
    });

    it("should have bilingual names", () => {
      expect(AMSALJA_CLOTHING.nameKorean).toBe("암살자 전투복");
      expect(AMSALJA_CLOTHING.nameEnglish).toBe("Shadow Assassin Suit");
    });

    it("should have stealth-themed clothing", () => {
      const hasBodysuit = AMSALJA_CLOTHING.items.some(item => item.id === "amsalja_bodysuit");
      const hasVest = AMSALJA_CLOTHING.items.some(item => item.id === "amsalja_vest");
      const hasBoots = AMSALJA_CLOTHING.items.some(item => item.id === "amsalja_boots");

      expect(hasBodysuit).toBe(true);
      expect(hasVest).toBe(true);
      expect(hasBoots).toBe(true);
    });

    it("should use synthetic and armored materials", () => {
      const bodysuit = AMSALJA_CLOTHING.items.find(item => item.id === "amsalja_bodysuit");
      const vest = AMSALJA_CLOTHING.items.find(item => item.id === "amsalja_vest");

      expect(bodysuit?.material).toBe("synthetic");
      expect(vest?.material).toBe("armored");
    });

    it("should have emissive cyan accents", () => {
      const bodysuit = AMSALJA_CLOTHING.items.find(item => item.id === "amsalja_bodysuit");
      expect(bodysuit?.colorEmissive).toBeDefined();
      expect(bodysuit?.emissiveIntensity).toBeGreaterThan(0);
    });
  });

  describe("HACKER_CLOTHING", () => {
    it("should have correct archetype", () => {
      expect(HACKER_CLOTHING.archetype).toBe(PlayerArchetype.HACKER);
    });

    it("should have bilingual names", () => {
      expect(HACKER_CLOTHING.nameKorean).toBe("해커 전투복");
      expect(HACKER_CLOTHING.nameEnglish).toBe("Hacker Combat Wear");
    });

    it("should have cyber-themed clothing", () => {
      const hasHoodie = HACKER_CLOTHING.items.some(item => item.id === "hacker_hoodie");
      const hasPants = HACKER_CLOTHING.items.some(item => item.id === "hacker_pants");
      const hasGloves = HACKER_CLOTHING.items.some(item => item.id === "hacker_gloves");
      const hasBoots = HACKER_CLOTHING.items.some(item => item.id === "hacker_boots");

      expect(hasHoodie).toBe(true);
      expect(hasPants).toBe(true);
      expect(hasGloves).toBe(true);
      expect(hasBoots).toBe(true);
    });

    it("should have data gloves with cybernetic material", () => {
      const gloves = HACKER_CLOTHING.items.find(item => item.id === "hacker_gloves");
      expect(gloves?.material).toBe("cybernetic");
    });

    it("should have purple emissive theme", () => {
      const hoodie = HACKER_CLOTHING.items.find(item => item.id === "hacker_hoodie");
      expect(hoodie?.colorEmissive).toBeDefined();
    });
  });

  describe("JEONGBO_CLOTHING", () => {
    it("should have correct archetype", () => {
      expect(JEONGBO_CLOTHING.archetype).toBe(PlayerArchetype.JEONGBO_YOWON);
    });

    it("should have bilingual names", () => {
      expect(JEONGBO_CLOTHING.nameKorean).toBe("정보요원 작전복");
      expect(JEONGBO_CLOTHING.nameEnglish).toBe("Intelligence Operative Gear");
    });

    it("should have tactical operative clothing", () => {
      const hasJacket = JEONGBO_CLOTHING.items.some(item => item.id === "jeongbo_jacket");
      const hasPants = JEONGBO_CLOTHING.items.some(item => item.id === "jeongbo_pants");
      const hasVest = JEONGBO_CLOTHING.items.some(item => item.id === "jeongbo_vest");
      const hasBelt = JEONGBO_CLOTHING.items.some(item => item.id === "jeongbo_belt");
      const hasBoots = JEONGBO_CLOTHING.items.some(item => item.id === "jeongbo_boots");

      expect(hasJacket).toBe(true);
      expect(hasPants).toBe(true);
      expect(hasVest).toBe(true);
      expect(hasBelt).toBe(true);
      expect(hasBoots).toBe(true);
    });

    it("should use tactical materials", () => {
      const jacket = JEONGBO_CLOTHING.items.find(item => item.id === "jeongbo_jacket");
      const pants = JEONGBO_CLOTHING.items.find(item => item.id === "jeongbo_pants");

      expect(jacket?.material).toBe("tactical");
      expect(pants?.material).toBe("tactical");
    });
  });

  describe("JOJIK_CLOTHING", () => {
    it("should have correct archetype", () => {
      expect(JOJIK_CLOTHING.archetype).toBe(PlayerArchetype.JOJIK_POKRYEOKBAE);
    });

    it("should have bilingual names", () => {
      expect(JOJIK_CLOTHING.nameKorean).toBe("조직폭력배 복장");
      expect(JOJIK_CLOTHING.nameEnglish).toBe("Street Fighter Gear");
    });

    it("should have street fighter clothing", () => {
      const hasJacket = JOJIK_CLOTHING.items.some(item => item.id === "jojik_leather_jacket");
      const hasPants = JOJIK_CLOTHING.items.some(item => item.id === "jojik_pants");
      const hasBelt = JOJIK_CLOTHING.items.some(item => item.id === "jojik_belt");
      const hasGloves = JOJIK_CLOTHING.items.some(item => item.id === "jojik_gloves");
      const hasBoots = JOJIK_CLOTHING.items.some(item => item.id === "jojik_boots");

      expect(hasJacket).toBe(true);
      expect(hasPants).toBe(true);
      expect(hasBelt).toBe(true);
      expect(hasGloves).toBe(true);
      expect(hasBoots).toBe(true);
    });

    it("should use leather materials for intimidating look", () => {
      const jacket = JOJIK_CLOTHING.items.find(item => item.id === "jojik_leather_jacket");
      const gloves = JOJIK_CLOTHING.items.find(item => item.id === "jojik_gloves");
      const boots = JOJIK_CLOTHING.items.find(item => item.id === "jojik_boots");

      expect(jacket?.material).toBe("leather");
      expect(gloves?.material).toBe("leather");
      expect(boots?.material).toBe("leather");
    });

    it("should have oversized fit for intimidating presence", () => {
      const jacket = JOJIK_CLOTHING.items.find(item => item.id === "jojik_leather_jacket");
      expect(jacket?.fit).toBe("oversized");
    });
  });

  describe("Clothing Item Validation", () => {
    const allClothingSets = [
      MUSA_CLOTHING,
      AMSALJA_CLOTHING,
      HACKER_CLOTHING,
      JEONGBO_CLOTHING,
      JOJIK_CLOTHING,
    ];

    it("all clothing items should have unique IDs within their set", () => {
      allClothingSets.forEach((clothingSet) => {
        const ids = clothingSet.items.map(item => item.id);
        const uniqueIds = new Set(ids);
        expect(ids.length).toBe(uniqueIds.size);
      });
    });

    it("all clothing items should have valid attached bones", () => {
      allClothingSets.forEach((clothingSet) => {
        clothingSet.items.forEach((item) => {
          expect(item.attachedBones).toBeDefined();
          expect(item.attachedBones.length).toBeGreaterThan(0);
        });
      });
    });

    it("all clothing items should have valid color values", () => {
      allClothingSets.forEach((clothingSet) => {
        clothingSet.items.forEach((item) => {
          expect(typeof item.colorPrimary).toBe("number");
          expect(item.colorPrimary).toBeGreaterThanOrEqual(0);
          expect(item.colorPrimary).toBeLessThanOrEqual(0xffffff);
        });
      });
    });

    it("all clothing items should have valid material properties", () => {
      allClothingSets.forEach((clothingSet) => {
        clothingSet.items.forEach((item) => {
          if (item.metalness !== undefined) {
            expect(item.metalness).toBeGreaterThanOrEqual(0);
            expect(item.metalness).toBeLessThanOrEqual(1);
          }
          
          if (item.roughness !== undefined) {
            expect(item.roughness).toBeGreaterThanOrEqual(0);
            expect(item.roughness).toBeLessThanOrEqual(1);
          }
          
          if (item.emissiveIntensity !== undefined) {
            expect(item.emissiveIntensity).toBeGreaterThanOrEqual(0);
            expect(item.emissiveIntensity).toBeLessThanOrEqual(1);
          }
        });
      });
    });

    it("clothing with emissive intensity should also have emissive color", () => {
      allClothingSets.forEach((clothingSet) => {
        clothingSet.items.forEach((item) => {
          if (item.emissiveIntensity !== undefined && item.emissiveIntensity > 0) {
            expect(item.colorEmissive).toBeDefined();
          }
        });
      });
    });
  });

  describe("Cultural Accuracy", () => {
    it("MUSA black belt should represent mastery", () => {
      const belt = MUSA_CLOTHING.items.find(item => item.id === "musa_belt");
      expect(belt?.nameKorean).toContain("검은 띠");
      expect(belt?.nameEnglish).toContain("Black Belt");
    });

    it("clothing names should use appropriate Korean terminology", () => {
      // MUSA should use traditional martial arts terms
      expect(MUSA_CLOTHING.nameKorean).toContain("무사");
      
      // AMSALJA should use assassin terminology
      expect(AMSALJA_CLOTHING.nameKorean).toContain("암살자");
      
      // HACKER should use cyber terminology
      expect(HACKER_CLOTHING.nameKorean).toContain("해커");
      
      // JEONGBO should use intelligence operative terminology
      expect(JEONGBO_CLOTHING.nameKorean).toContain("정보요원");
      
      // JOJIK should use organized crime terminology
      expect(JOJIK_CLOTHING.nameKorean).toContain("조직폭력배");
    });
  });

  describe("Theme Colors", () => {
    it("all clothing sets should have theme colors", () => {
      const allClothingSets = [
        MUSA_CLOTHING,
        AMSALJA_CLOTHING,
        HACKER_CLOTHING,
        JEONGBO_CLOTHING,
        JOJIK_CLOTHING,
      ];

      allClothingSets.forEach((clothingSet) => {
        expect(clothingSet.themeColors).toBeDefined();
        expect(clothingSet.themeColors.primary).toBeDefined();
        expect(clothingSet.themeColors.secondary).toBeDefined();
        expect(clothingSet.themeColors.accent).toBeDefined();
      });
    });

    it("theme colors should be valid hex numbers", () => {
      const allClothingSets = [
        MUSA_CLOTHING,
        AMSALJA_CLOTHING,
        HACKER_CLOTHING,
        JEONGBO_CLOTHING,
        JOJIK_CLOTHING,
      ];

      allClothingSets.forEach((clothingSet) => {
        expect(typeof clothingSet.themeColors.primary).toBe("number");
        expect(typeof clothingSet.themeColors.secondary).toBe("number");
        expect(typeof clothingSet.themeColors.accent).toBe("number");
        
        expect(clothingSet.themeColors.primary).toBeGreaterThanOrEqual(0);
        expect(clothingSet.themeColors.primary).toBeLessThanOrEqual(0xffffff);
      });
    });
  });
});
