/**
 * Clothing Material Utilities
 *
 * **Korean**: 의류 재료 유틸리티 (Clothing Material Utilities)
 *
 * Provides material presets and utility functions for clothing materials
 * following Korean cyberpunk aesthetic principles.
 *
 * @module utils/clothingMaterials
 * @category Utilities
 * @korean 의류재료유틸리티
 */

import type { MaterialPreset } from "@/types/clothing";

/**
 * Material presets for different clothing types
 *
 * These presets define realistic material properties based on
 * real-world fabric and material characteristics.
 *
 * @korean 재료프리셋
 */
export const CLOTHING_MATERIAL_PRESETS: Record<string, MaterialPreset> = {
  // Natural fabrics
  cotton: {
    metalness: 0.0,
    roughness: 0.9,
    emissiveIntensity: 0.0,
  },
  silk: {
    metalness: 0.1,
    roughness: 0.3,
    emissiveIntensity: 0.0,
  },
  wool: {
    metalness: 0.0,
    roughness: 0.95,
    emissiveIntensity: 0.0,
  },
  
  // Synthetic fabrics
  nylon: {
    metalness: 0.2,
    roughness: 0.4,
    emissiveIntensity: 0.0,
  },
  polyester: {
    metalness: 0.15,
    roughness: 0.5,
    emissiveIntensity: 0.0,
  },
  spandex: {
    metalness: 0.3,
    roughness: 0.3,
    emissiveIntensity: 0.0,
  },
  
  // Leather types
  leather: {
    metalness: 0.3,
    roughness: 0.7,
    emissiveIntensity: 0.0,
  },
  leatherPolished: {
    metalness: 0.5,
    roughness: 0.4,
    emissiveIntensity: 0.0,
  },
  leatherDistressed: {
    metalness: 0.2,
    roughness: 0.85,
    emissiveIntensity: 0.0,
  },
  
  // Tactical/Military
  tacticalFabric: {
    metalness: 0.2,
    roughness: 0.7,
    emissiveIntensity: 0.0,
  },
  kevlar: {
    metalness: 0.4,
    roughness: 0.6,
    emissiveIntensity: 0.0,
  },
  
  // Cyberpunk materials
  cyberSynthetic: {
    metalness: 0.6,
    roughness: 0.3,
    emissiveIntensity: 0.2,
  },
  neoprene: {
    metalness: 0.5,
    roughness: 0.4,
    emissiveIntensity: 0.1,
  },
  holographic: {
    metalness: 0.9,
    roughness: 0.1,
    emissiveIntensity: 0.5,
  },
  
  // Metal accents
  steel: {
    metalness: 0.9,
    roughness: 0.3,
    emissiveIntensity: 0.0,
  },
  chrome: {
    metalness: 1.0,
    roughness: 0.1,
    emissiveIntensity: 0.0,
  },
  brushedMetal: {
    metalness: 0.8,
    roughness: 0.5,
    emissiveIntensity: 0.0,
  },
};

/**
 * Get material preset by name
 *
 * @param presetName - Name of the material preset
 * @returns Material preset configuration
 * @korean 재료프리셋가져오기
 */
export function getMaterialPreset(presetName: string): MaterialPreset {
  return CLOTHING_MATERIAL_PRESETS[presetName] ?? CLOTHING_MATERIAL_PRESETS.cotton;
}

/**
 * Blend two material presets
 *
 * Useful for creating hybrid materials (e.g., leather with metallic accents)
 *
 * @param preset1 - First material preset
 * @param preset2 - Second material preset
 * @param blend - Blend factor (0 = all preset1, 1 = all preset2)
 * @returns Blended material preset
 * @korean 재료프리셋혼합
 */
export function blendMaterialPresets(
  preset1: MaterialPreset,
  preset2: MaterialPreset,
  blend: number
): MaterialPreset {
  const t = Math.max(0, Math.min(1, blend)); // Clamp to [0, 1]
  
  return {
    metalness: preset1.metalness * (1 - t) + preset2.metalness * t,
    roughness: preset1.roughness * (1 - t) + preset2.roughness * t,
    emissiveIntensity: (preset1.emissiveIntensity ?? 0) * (1 - t) + 
                       (preset2.emissiveIntensity ?? 0) * t,
  };
}

/**
 * Adjust material preset for wear and tear
 *
 * Simulates material degradation over time or from combat damage
 *
 * @param preset - Base material preset
 * @param wearLevel - Wear amount (0 = new, 1 = heavily worn)
 * @returns Adjusted material preset
 * @korean 재료마모조정
 */
export function applyWear(preset: MaterialPreset, wearLevel: number): MaterialPreset {
  const wear = Math.max(0, Math.min(1, wearLevel));
  
  return {
    metalness: preset.metalness * (1 - wear * 0.3), // Metal loses shine
    roughness: Math.min(1, preset.roughness + wear * 0.3), // Surface gets rougher
    emissiveIntensity: (preset.emissiveIntensity ?? 0) * (1 - wear * 0.5), // Glow fades
  };
}

/**
 * Get material preset for archetype-specific style
 *
 * Returns appropriate material based on archetype philosophy
 *
 * @param archetype - Player archetype
 * @param clothingType - Type of clothing item
 * @returns Recommended material preset
 * @korean 원형재료프리셋
 */
export function getArchetypeMaterialStyle(
  archetype: string,
  clothingType: string
): MaterialPreset {
  // Musa (Traditional Warrior) - Natural fabrics
  if (archetype === "MUSA") {
    if (clothingType === "torso") return CLOTHING_MATERIAL_PRESETS.cotton;
    if (clothingType === "belt") return CLOTHING_MATERIAL_PRESETS.silk;
    return CLOTHING_MATERIAL_PRESETS.tacticalFabric;
  }
  
  // Amsalja (Shadow Assassin) - High-tech synthetics
  if (archetype === "AMSALJA") {
    return CLOTHING_MATERIAL_PRESETS.cyberSynthetic;
  }
  
  // Hacker (Cyber Warrior) - Casual tech wear
  if (archetype === "HACKER") {
    if (clothingType === "gloves") return CLOTHING_MATERIAL_PRESETS.holographic;
    return CLOTHING_MATERIAL_PRESETS.neoprene;
  }
  
  // Jeongbo (Intelligence Operative) - Professional tactical
  if (archetype === "JEONGBO_YOWON") {
    if (clothingType === "vest") return CLOTHING_MATERIAL_PRESETS.kevlar;
    return CLOTHING_MATERIAL_PRESETS.tacticalFabric;
  }
  
  // Jojik (Street Fighter) - Heavy leather
  if (archetype === "JOJIK_POKRYEOKBAE") {
    if (clothingType === "torso") return CLOTHING_MATERIAL_PRESETS.leatherDistressed;
    if (clothingType === "belt") return CLOTHING_MATERIAL_PRESETS.steel;
    return CLOTHING_MATERIAL_PRESETS.leather;
  }
  
  // Default
  return CLOTHING_MATERIAL_PRESETS.cotton;
}
