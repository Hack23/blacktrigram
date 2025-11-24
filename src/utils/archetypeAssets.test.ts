/**
 * Tests for archetype asset mapping and integration
 */

import { describe, it, expect } from "vitest";
import { PlayerArchetype } from "../types/common";
import { ARCHETYPE_ASSETS, ARCHETYPE_BACKGROUNDS } from "../types/constants";
import { getArchetypeAssets } from "./playerUtils";

describe("Archetype Assets", () => {
  describe("ARCHETYPE_ASSETS constant", () => {
    it("should have assets for all 5 archetypes", () => {
      const archetypes = ["musa", "amsalja", "hacker", "jeongbo_yowon", "jojik_pokryeokbae"];
      
      archetypes.forEach((archetype) => {
        expect(ARCHETYPE_ASSETS[archetype as keyof typeof ARCHETYPE_ASSETS]).toBeDefined();
      });
    });

    it("should have correct structure for each archetype", () => {
      const archetypes = Object.values(ARCHETYPE_ASSETS);
      
      archetypes.forEach((archetype) => {
        expect(archetype).toHaveProperty("id");
        expect(archetype).toHaveProperty("image");
        expect(archetype).toHaveProperty("theme");
        expect(archetype).toHaveProperty("themeId");
        expect(archetype).toHaveProperty("name_korean");
        expect(archetype).toHaveProperty("name_english");
        expect(archetype).toHaveProperty("textureKey");
      });
    });

    it("should have valid image paths for all archetypes", () => {
      const archetypes = Object.values(ARCHETYPE_ASSETS);
      
      archetypes.forEach((archetype) => {
        expect(archetype.image).toBeTruthy();
        expect(archetype.image).toContain('/assets/visual/');
        expect(archetype.image).toMatch(/\.png$/);
      });
    });

    it("should have valid theme music paths for all archetypes", () => {
      const archetypes = Object.values(ARCHETYPE_ASSETS);
      
      archetypes.forEach((archetype) => {
        expect(archetype.theme).toMatch(/^\/assets\/audio\/music\/archetype_themes\/.+\.mp3$/);
      });
    });

    it("should have unique theme IDs for all archetypes", () => {
      const themeIds = Object.values(ARCHETYPE_ASSETS).map((a) => a.themeId);
      const uniqueThemeIds = new Set(themeIds);
      
      expect(uniqueThemeIds.size).toBe(themeIds.length);
    });

    it("should have bilingual names for all archetypes", () => {
      const archetypes = Object.values(ARCHETYPE_ASSETS);
      
      archetypes.forEach((archetype) => {
        expect(archetype.name_korean).toBeTruthy();
        expect(archetype.name_english).toBeTruthy();
        expect(typeof archetype.name_korean).toBe("string");
        expect(typeof archetype.name_english).toBe("string");
      });
    });
  });

  describe("ARCHETYPE_BACKGROUNDS constant", () => {
    it("should have all 3 background images", () => {
      expect(ARCHETYPE_BACKGROUNDS.overview).toBeDefined();
      expect(ARCHETYPE_BACKGROUNDS.explained).toBeDefined();
      expect(ARCHETYPE_BACKGROUNDS.teamDynamics).toBeDefined();
    });

    it("should have valid background image paths", () => {
      const backgrounds = Object.values(ARCHETYPE_BACKGROUNDS);
      
      // Note: Directory name "archetyples" matches actual directory structure
      backgrounds.forEach((background) => {
        expect(background).toBeTruthy();
        expect(background).toContain('/assets/visual/bg/');
        expect(background).toMatch(/\.png$/);
      });
    });
  });

  describe("getArchetypeAssets utility function", () => {
    it("should return assets for MUSA archetype", () => {
      const assets = getArchetypeAssets(PlayerArchetype.MUSA);
      
      expect(assets.id).toBe("musa");
      expect(assets.name_korean).toBe("무사");
      expect(assets.name_english).toBe("Traditional Warrior");
      expect(assets.image).toBe("/assets/visual/archetypes/musa.png");
      expect(assets.theme).toBe("/assets/audio/music/archetype_themes/musa_warrior.mp3");
      expect(assets.themeId).toBe("musa_warrior_theme");
    });

    it("should return assets for AMSALJA archetype", () => {
      const assets = getArchetypeAssets(PlayerArchetype.AMSALJA);
      
      expect(assets.id).toBe("amsalja");
      expect(assets.name_korean).toBe("암살자");
      expect(assets.name_english).toBe("Shadow Assassin");
      expect(assets.image).toBe("/assets/visual/archetypes/amsalja.png");
    });

    it("should return assets for HACKER archetype", () => {
      const assets = getArchetypeAssets(PlayerArchetype.HACKER);
      
      expect(assets.id).toBe("hacker");
      expect(assets.name_korean).toBe("해커");
      expect(assets.name_english).toBe("Cyber Warrior");
    });

    it("should return assets for JEONGBO_YOWON archetype", () => {
      const assets = getArchetypeAssets(PlayerArchetype.JEONGBO_YOWON);
      
      expect(assets.id).toBe("jeongbo_yowon");
      expect(assets.name_korean).toBe("정보요원");
      expect(assets.name_english).toBe("Intelligence Operative");
    });

    it("should return assets for JOJIK_POKRYEOKBAE archetype", () => {
      const assets = getArchetypeAssets(PlayerArchetype.JOJIK_POKRYEOKBAE);
      
      expect(assets.id).toBe("jojik_pokryeokbae");
      expect(assets.name_korean).toBe("조직폭력배");
      expect(assets.name_english).toBe("Organized Crime");
    });

    it("should return all assets for each archetype", () => {
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      archetypes.forEach((archetype) => {
        const assets = getArchetypeAssets(archetype);
        
        expect(assets.image).toBeTruthy();
        expect(assets.theme).toBeTruthy();
        expect(assets.themeId).toBeTruthy();
        expect(assets.name_korean).toBeTruthy();
        expect(assets.name_english).toBeTruthy();
        expect(assets.textureKey).toBeTruthy();
      });
    });
  });

  describe("Asset path consistency", () => {
    it("should have matching texture keys and image filenames", () => {
      const archetypes = Object.values(ARCHETYPE_ASSETS);
      
      archetypes.forEach((archetype) => {
        const expectedFilename = `${archetype.textureKey}.png`;
        expect(archetype.image).toContain(expectedFilename);
      });
    });

    it("should have matching IDs and texture keys", () => {
      const archetypes = Object.values(ARCHETYPE_ASSETS);
      
      archetypes.forEach((archetype) => {
        expect(archetype.id).toBe(archetype.textureKey);
      });
    });
  });
});
