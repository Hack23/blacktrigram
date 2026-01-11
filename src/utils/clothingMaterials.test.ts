/**
 * Tests for clothing material utilities
 *
 * @module utils/clothingMaterials.test
 * @category Tests
 * @korean 의류재료유틸리티테스트
 */

import { describe, it, expect } from "vitest";
import {
  CLOTHING_MATERIAL_PRESETS,
  getMaterialPreset,
  blendMaterialPresets,
  applyWear,
  getArchetypeMaterialStyle,
} from "./clothingMaterials";

describe("clothingMaterials", () => {
  describe("CLOTHING_MATERIAL_PRESETS", () => {
    it("should have material presets for natural fabrics", () => {
      expect(CLOTHING_MATERIAL_PRESETS.cotton).toBeDefined();
      expect(CLOTHING_MATERIAL_PRESETS.silk).toBeDefined();
      expect(CLOTHING_MATERIAL_PRESETS.wool).toBeDefined();
    });

    it("should have material presets for synthetic fabrics", () => {
      expect(CLOTHING_MATERIAL_PRESETS.nylon).toBeDefined();
      expect(CLOTHING_MATERIAL_PRESETS.polyester).toBeDefined();
      expect(CLOTHING_MATERIAL_PRESETS.spandex).toBeDefined();
    });

    it("should have material presets for leather", () => {
      expect(CLOTHING_MATERIAL_PRESETS.leather).toBeDefined();
      expect(CLOTHING_MATERIAL_PRESETS.leatherPolished).toBeDefined();
      expect(CLOTHING_MATERIAL_PRESETS.leatherDistressed).toBeDefined();
    });

    it("should have material presets for tactical materials", () => {
      expect(CLOTHING_MATERIAL_PRESETS.tacticalFabric).toBeDefined();
      expect(CLOTHING_MATERIAL_PRESETS.kevlar).toBeDefined();
    });

    it("should have material presets for cyberpunk materials", () => {
      expect(CLOTHING_MATERIAL_PRESETS.cyberSynthetic).toBeDefined();
      expect(CLOTHING_MATERIAL_PRESETS.neoprene).toBeDefined();
      expect(CLOTHING_MATERIAL_PRESETS.holographic).toBeDefined();
    });

    it("should have material presets for metal accents", () => {
      expect(CLOTHING_MATERIAL_PRESETS.steel).toBeDefined();
      expect(CLOTHING_MATERIAL_PRESETS.chrome).toBeDefined();
      expect(CLOTHING_MATERIAL_PRESETS.brushedMetal).toBeDefined();
    });

    it("should have valid metalness values (0-1)", () => {
      Object.values(CLOTHING_MATERIAL_PRESETS).forEach((preset) => {
        expect(preset.metalness).toBeGreaterThanOrEqual(0);
        expect(preset.metalness).toBeLessThanOrEqual(1);
      });
    });

    it("should have valid roughness values (0-1)", () => {
      Object.values(CLOTHING_MATERIAL_PRESETS).forEach((preset) => {
        expect(preset.roughness).toBeGreaterThanOrEqual(0);
        expect(preset.roughness).toBeLessThanOrEqual(1);
      });
    });

    it("should have cotton as non-metallic, rough fabric", () => {
      const cotton = CLOTHING_MATERIAL_PRESETS.cotton;
      expect(cotton.metalness).toBe(0.0);
      expect(cotton.roughness).toBeGreaterThan(0.8);
      expect(cotton.emissiveIntensity).toBe(0.0);
    });

    it("should have chrome as highly metallic, smooth material", () => {
      const chrome = CLOTHING_MATERIAL_PRESETS.chrome;
      expect(chrome.metalness).toBe(1.0);
      expect(chrome.roughness).toBeLessThan(0.2);
    });

    it("should have holographic material with emissive properties", () => {
      const holographic = CLOTHING_MATERIAL_PRESETS.holographic;
      expect(holographic.metalness).toBeGreaterThan(0.8);
      expect(holographic.emissiveIntensity).toBeGreaterThan(0);
    });
  });

  describe("getMaterialPreset", () => {
    it("should return correct preset for valid name", () => {
      const cotton = getMaterialPreset("cotton");
      expect(cotton).toEqual(CLOTHING_MATERIAL_PRESETS.cotton);
    });

    it("should return cotton preset for invalid name (fallback)", () => {
      const unknown = getMaterialPreset("nonexistent_material");
      expect(unknown).toEqual(CLOTHING_MATERIAL_PRESETS.cotton);
    });

    it("should return same reference for multiple calls", () => {
      const first = getMaterialPreset("leather");
      const second = getMaterialPreset("leather");
      expect(first).toBe(second);
    });
  });

  describe("blendMaterialPresets", () => {
    it("should return first preset when blend is 0", () => {
      const cotton = CLOTHING_MATERIAL_PRESETS.cotton;
      const steel = CLOTHING_MATERIAL_PRESETS.steel;
      const blended = blendMaterialPresets(cotton, steel, 0);
      
      expect(blended.metalness).toBe(cotton.metalness);
      expect(blended.roughness).toBe(cotton.roughness);
    });

    it("should return second preset when blend is 1", () => {
      const cotton = CLOTHING_MATERIAL_PRESETS.cotton;
      const steel = CLOTHING_MATERIAL_PRESETS.steel;
      const blended = blendMaterialPresets(cotton, steel, 1);
      
      expect(blended.metalness).toBe(steel.metalness);
      expect(blended.roughness).toBe(steel.roughness);
    });

    it("should return midpoint when blend is 0.5", () => {
      const cotton = CLOTHING_MATERIAL_PRESETS.cotton;
      const steel = CLOTHING_MATERIAL_PRESETS.steel;
      const blended = blendMaterialPresets(cotton, steel, 0.5);
      
      expect(blended.metalness).toBeCloseTo(
        (cotton.metalness + steel.metalness) / 2,
        5
      );
      expect(blended.roughness).toBeCloseTo(
        (cotton.roughness + steel.roughness) / 2,
        5
      );
    });

    it("should clamp blend value to [0, 1]", () => {
      const cotton = CLOTHING_MATERIAL_PRESETS.cotton;
      const steel = CLOTHING_MATERIAL_PRESETS.steel;
      
      const belowZero = blendMaterialPresets(cotton, steel, -0.5);
      expect(belowZero.metalness).toBe(cotton.metalness);
      
      const aboveOne = blendMaterialPresets(cotton, steel, 1.5);
      expect(aboveOne.metalness).toBe(steel.metalness);
    });

    it("should handle emissiveIntensity correctly", () => {
      const cotton = CLOTHING_MATERIAL_PRESETS.cotton; // no emissive
      const holographic = CLOTHING_MATERIAL_PRESETS.holographic; // has emissive
      
      const blended = blendMaterialPresets(cotton, holographic, 0.5);
      expect(blended.emissiveIntensity).toBeDefined();
      expect(blended.emissiveIntensity).toBeCloseTo(
        (holographic.emissiveIntensity ?? 0) / 2,
        5
      );
    });
  });

  describe("applyWear", () => {
    it("should not modify material when wear is 0", () => {
      const steel = CLOTHING_MATERIAL_PRESETS.steel;
      const worn = applyWear(steel, 0);
      
      expect(worn.metalness).toBe(steel.metalness);
      expect(worn.roughness).toBe(steel.roughness);
    });

    it("should reduce metalness with wear", () => {
      const steel = CLOTHING_MATERIAL_PRESETS.steel;
      const worn = applyWear(steel, 0.5);
      
      expect(worn.metalness).toBeLessThan(steel.metalness);
    });

    it("should increase roughness with wear", () => {
      const steel = CLOTHING_MATERIAL_PRESETS.steel;
      const worn = applyWear(steel, 0.5);
      
      expect(worn.roughness).toBeGreaterThan(steel.roughness);
    });

    it("should reduce emissive intensity with wear", () => {
      const holographic = CLOTHING_MATERIAL_PRESETS.holographic;
      const worn = applyWear(holographic, 0.5);
      
      expect(worn.emissiveIntensity).toBeLessThan(
        holographic.emissiveIntensity ?? 0
      );
    });

    it("should clamp wear value to [0, 1]", () => {
      const steel = CLOTHING_MATERIAL_PRESETS.steel;
      
      const belowZero = applyWear(steel, -0.5);
      expect(belowZero.metalness).toBe(steel.metalness);
      
      const aboveOne = applyWear(steel, 1.5);
      expect(aboveOne.metalness).toBeLessThan(steel.metalness);
    });

    it("should not allow roughness to exceed 1.0", () => {
      const rough = { metalness: 0.5, roughness: 0.9, emissiveIntensity: 0 };
      const worn = applyWear(rough, 1.0);
      
      expect(worn.roughness).toBeLessThanOrEqual(1.0);
    });
  });

  describe("getArchetypeMaterialStyle", () => {
    it("should return cotton for Musa torso", () => {
      const material = getArchetypeMaterialStyle("MUSA", "torso");
      expect(material).toEqual(CLOTHING_MATERIAL_PRESETS.cotton);
    });

    it("should return silk for Musa belt", () => {
      const material = getArchetypeMaterialStyle("MUSA", "belt");
      expect(material).toEqual(CLOTHING_MATERIAL_PRESETS.silk);
    });

    it("should return cyberSynthetic for Amsalja", () => {
      const material = getArchetypeMaterialStyle("AMSALJA", "torso");
      expect(material).toEqual(CLOTHING_MATERIAL_PRESETS.cyberSynthetic);
    });

    it("should return holographic for Hacker gloves", () => {
      const material = getArchetypeMaterialStyle("HACKER", "gloves");
      expect(material).toEqual(CLOTHING_MATERIAL_PRESETS.holographic);
    });

    it("should return neoprene for Hacker other items", () => {
      const material = getArchetypeMaterialStyle("HACKER", "torso");
      expect(material).toEqual(CLOTHING_MATERIAL_PRESETS.neoprene);
    });

    it("should return kevlar for Jeongbo vest", () => {
      const material = getArchetypeMaterialStyle("JEONGBO_YOWON", "vest");
      expect(material).toEqual(CLOTHING_MATERIAL_PRESETS.kevlar);
    });

    it("should return tacticalFabric for Jeongbo other items", () => {
      const material = getArchetypeMaterialStyle("JEONGBO_YOWON", "pants");
      expect(material).toEqual(CLOTHING_MATERIAL_PRESETS.tacticalFabric);
    });

    it("should return leatherDistressed for Jojik torso", () => {
      const material = getArchetypeMaterialStyle("JOJIK_POKRYEOKBAE", "torso");
      expect(material).toEqual(CLOTHING_MATERIAL_PRESETS.leatherDistressed);
    });

    it("should return steel for Jojik belt", () => {
      const material = getArchetypeMaterialStyle("JOJIK_POKRYEOKBAE", "belt");
      expect(material).toEqual(CLOTHING_MATERIAL_PRESETS.steel);
    });

    it("should return leather for Jojik other items", () => {
      const material = getArchetypeMaterialStyle("JOJIK_POKRYEOKBAE", "boots");
      expect(material).toEqual(CLOTHING_MATERIAL_PRESETS.leather);
    });

    it("should return cotton as fallback for unknown archetype", () => {
      const material = getArchetypeMaterialStyle("UNKNOWN_ARCHETYPE", "torso");
      expect(material).toEqual(CLOTHING_MATERIAL_PRESETS.cotton);
    });
  });

  describe("Material preset consistency", () => {
    it("should have all presets with required properties", () => {
      Object.entries(CLOTHING_MATERIAL_PRESETS).forEach(([_name, preset]) => {
        expect(preset.metalness).toBeDefined();
        expect(preset.roughness).toBeDefined();
        // emissiveIntensity is optional
      });
    });

    it("should have logical metalness progression", () => {
      // Natural fabrics should have low metalness
      expect(CLOTHING_MATERIAL_PRESETS.cotton.metalness).toBeLessThan(0.2);
      expect(CLOTHING_MATERIAL_PRESETS.wool.metalness).toBeLessThan(0.2);
      
      // Metals should have high metalness
      expect(CLOTHING_MATERIAL_PRESETS.steel.metalness).toBeGreaterThan(0.8);
      expect(CLOTHING_MATERIAL_PRESETS.chrome.metalness).toBeGreaterThan(0.8);
    });

    it("should have logical roughness progression", () => {
      // Polished materials should have low roughness
      expect(CLOTHING_MATERIAL_PRESETS.chrome.roughness).toBeLessThan(0.2);
      expect(CLOTHING_MATERIAL_PRESETS.leatherPolished.roughness).toBeLessThan(0.5);
      
      // Rough materials should have high roughness
      expect(CLOTHING_MATERIAL_PRESETS.wool.roughness).toBeGreaterThan(0.8);
      expect(CLOTHING_MATERIAL_PRESETS.leatherDistressed.roughness).toBeGreaterThan(0.8);
    });
  });
});
