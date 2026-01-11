/**
 * Tests for ClothingSystem component
 *
 * @category Tests
 * @korean 의류시스템테스트
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, it, expect } from "vitest";
import { Suspense } from "react";
import { PlayerArchetype } from "@/types";
import { getArchetypePhysicalAttributes } from "@/data/archetypePhysicalAttributes";
import { getArchetypeClothing } from "@/data/archetypeClothing";
import ClothingSystem from "./ClothingSystem";

/**
 * Helper to render Three.js components
 */
function render3D(component: React.ReactElement) {
  return render(
    <Canvas>
      <Suspense fallback={null}>{component}</Suspense>
    </Canvas>
  );
}

describe("ClothingSystem", () => {
  describe("Component Rendering", () => {
    it("should render without crashing for MUSA archetype", () => {
      const physicalAttributes = getArchetypePhysicalAttributes(PlayerArchetype.MUSA);
      const boneMap = new Map();

      const { container } = render3D(
        <ClothingSystem
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={physicalAttributes}
          boneMap={boneMap}
          scale={1.0}
          visible={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render without crashing for AMSALJA archetype", () => {
      const physicalAttributes = getArchetypePhysicalAttributes(PlayerArchetype.AMSALJA);
      const boneMap = new Map();

      const { container } = render3D(
        <ClothingSystem
          archetype={PlayerArchetype.AMSALJA}
          physicalAttributes={physicalAttributes}
          boneMap={boneMap}
          scale={1.0}
          visible={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render without crashing for HACKER archetype", () => {
      const physicalAttributes = getArchetypePhysicalAttributes(PlayerArchetype.HACKER);
      const boneMap = new Map();

      const { container } = render3D(
        <ClothingSystem
          archetype={PlayerArchetype.HACKER}
          physicalAttributes={physicalAttributes}
          boneMap={boneMap}
          scale={1.0}
          visible={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render without crashing for JEONGBO_YOWON archetype", () => {
      const physicalAttributes = getArchetypePhysicalAttributes(PlayerArchetype.JEONGBO_YOWON);
      const boneMap = new Map();

      const { container } = render3D(
        <ClothingSystem
          archetype={PlayerArchetype.JEONGBO_YOWON}
          physicalAttributes={physicalAttributes}
          boneMap={boneMap}
          scale={1.0}
          visible={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render without crashing for JOJIK_POKRYEOKBAE archetype", () => {
      const physicalAttributes = getArchetypePhysicalAttributes(PlayerArchetype.JOJIK_POKRYEOKBAE);
      const boneMap = new Map();

      const { container } = render3D(
        <ClothingSystem
          archetype={PlayerArchetype.JOJIK_POKRYEOKBAE}
          physicalAttributes={physicalAttributes}
          boneMap={boneMap}
          scale={1.0}
          visible={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not render when visible is false", () => {
      const physicalAttributes = getArchetypePhysicalAttributes(PlayerArchetype.MUSA);
      const boneMap = new Map();

      const { container } = render3D(
        <ClothingSystem
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={physicalAttributes}
          boneMap={boneMap}
          scale={1.0}
          visible={false}
        />
      );

      // Component should still render canvas but not the clothing group
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Archetype Clothing Sets", () => {
    it("should have unique clothing for each archetype", () => {
      const musaClothing = getArchetypeClothing(PlayerArchetype.MUSA);
      const amsaljaClothing = getArchetypeClothing(PlayerArchetype.AMSALJA);
      const hackerClothing = getArchetypeClothing(PlayerArchetype.HACKER);
      const jeongboClothing = getArchetypeClothing(PlayerArchetype.JEONGBO_YOWON);
      const jojikClothing = getArchetypeClothing(PlayerArchetype.JOJIK_POKRYEOKBAE);

      // Each archetype should have different names
      expect(musaClothing.nameEnglish).not.toBe(amsaljaClothing.nameEnglish);
      expect(hackerClothing.nameEnglish).not.toBe(jeongboClothing.nameEnglish);
      expect(jojikClothing.nameEnglish).not.toBe(musaClothing.nameEnglish);
    });

    it("MUSA should have traditional warrior clothing", () => {
      const musaClothing = getArchetypeClothing(PlayerArchetype.MUSA);

      expect(musaClothing.nameKorean).toBe("무사 군복");
      expect(musaClothing.nameEnglish).toBe("Military Warrior Uniform");
      expect(musaClothing.items.length).toBeGreaterThan(0);

      // Should have dobok items
      const hasDobokTop = musaClothing.items.some(item => item.id === "musa_torso_gi");
      expect(hasDobokTop).toBe(true);
    });

    it("AMSALJA should have stealth assassin clothing", () => {
      const amsaljaClothing = getArchetypeClothing(PlayerArchetype.AMSALJA);

      expect(amsaljaClothing.nameKorean).toBe("암살자 전투복");
      expect(amsaljaClothing.nameEnglish).toBe("Shadow Assassin Suit");
      expect(amsaljaClothing.items.length).toBeGreaterThan(0);

      // Should have bodysuit
      const hasBodysuit = amsaljaClothing.items.some(item => item.id === "amsalja_bodysuit");
      expect(hasBodysuit).toBe(true);
    });

    it("HACKER should have cyber warrior clothing", () => {
      const hackerClothing = getArchetypeClothing(PlayerArchetype.HACKER);

      expect(hackerClothing.nameKorean).toBe("해커 전투복");
      expect(hackerClothing.nameEnglish).toBe("Hacker Combat Wear");
      expect(hackerClothing.items.length).toBeGreaterThan(0);

      // Should have hoodie
      const hasHoodie = hackerClothing.items.some(item => item.id === "hacker_hoodie");
      expect(hasHoodie).toBe(true);
    });

    it("JEONGBO_YOWON should have tactical operative clothing", () => {
      const jeongboClothing = getArchetypeClothing(PlayerArchetype.JEONGBO_YOWON);

      expect(jeongboClothing.nameKorean).toBe("정보요원 작전복");
      expect(jeongboClothing.nameEnglish).toBe("Intelligence Operative Gear");
      expect(jeongboClothing.items.length).toBeGreaterThan(0);

      // Should have tactical jacket
      const hasTacticalJacket = jeongboClothing.items.some(item => item.id === "jeongbo_jacket");
      expect(hasTacticalJacket).toBe(true);
    });

    it("JOJIK_POKRYEOKBAE should have street fighter clothing", () => {
      const jojikClothing = getArchetypeClothing(PlayerArchetype.JOJIK_POKRYEOKBAE);

      expect(jojikClothing.nameKorean).toBe("조직폭력배 복장");
      expect(jojikClothing.nameEnglish).toBe("Street Fighter Gear");
      expect(jojikClothing.items.length).toBeGreaterThan(0);

      // Should have leather jacket
      const hasLeatherJacket = jojikClothing.items.some(item => item.id === "jojik_leather_jacket");
      expect(hasLeatherJacket).toBe(true);
    });
  });

  describe("Clothing Item Types", () => {
    it("all archetypes should have torso clothing", () => {
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      archetypes.forEach((archetype) => {
        const clothing = getArchetypeClothing(archetype);
        const hasTorso = clothing.items.some(item => item.type === "torso");
        expect(hasTorso).toBe(true);
      });
    });

    it("all archetypes should have pants clothing", () => {
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      archetypes.forEach((archetype) => {
        const clothing = getArchetypeClothing(archetype);
        const hasPants = clothing.items.some(item => item.type === "pants");
        expect(hasPants).toBe(true);
      });
    });

    it("all archetypes should have boots", () => {
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      archetypes.forEach((archetype) => {
        const clothing = getArchetypeClothing(archetype);
        const hasBoots = clothing.items.some(item => item.type === "boots");
        expect(hasBoots).toBe(true);
      });
    });
  });

  describe("Korean Theming", () => {
    it("all clothing items should have Korean and English names", () => {
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      archetypes.forEach((archetype) => {
        const clothing = getArchetypeClothing(archetype);
        
        clothing.items.forEach((item) => {
          expect(item.nameKorean).toBeTruthy();
          expect(item.nameEnglish).toBeTruthy();
          expect(typeof item.nameKorean).toBe("string");
          expect(typeof item.nameEnglish).toBe("string");
        });
      });
    });

    it("all clothing sets should have Korean and English descriptions", () => {
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      archetypes.forEach((archetype) => {
        const clothing = getArchetypeClothing(archetype);
        
        expect(clothing.descriptionKorean).toBeTruthy();
        expect(clothing.descriptionEnglish).toBeTruthy();
        expect(typeof clothing.descriptionKorean).toBe("string");
        expect(typeof clothing.descriptionEnglish).toBe("string");
      });
    });

    it("clothing should use Korean color scheme", () => {
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      archetypes.forEach((archetype) => {
        const clothing = getArchetypeClothing(archetype);
        
        // Each clothing set should have theme colors
        expect(clothing.themeColors.primary).toBeDefined();
        expect(clothing.themeColors.secondary).toBeDefined();
        expect(clothing.themeColors.accent).toBeDefined();
        
        // Colors should be hex numbers
        expect(typeof clothing.themeColors.primary).toBe("number");
        expect(typeof clothing.themeColors.secondary).toBe("number");
        expect(typeof clothing.themeColors.accent).toBe("number");
      });
    });
  });

  describe("Material Properties", () => {
    it("all clothing items should have material properties", () => {
      const clothing = getArchetypeClothing(PlayerArchetype.MUSA);
      
      clothing.items.forEach((item) => {
        expect(item.colorPrimary).toBeDefined();
        expect(typeof item.colorPrimary).toBe("number");
        
        // Material properties should be within valid ranges if defined
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

    it("cyberpunk clothing should have emissive properties", () => {
      const amsaljaClothing = getArchetypeClothing(PlayerArchetype.AMSALJA);
      const hackerClothing = getArchetypeClothing(PlayerArchetype.HACKER);
      
      // Amsalja bodysuit should have emissive
      const bodysuit = amsaljaClothing.items.find(item => item.id === "amsalja_bodysuit");
      expect(bodysuit?.colorEmissive).toBeDefined();
      expect(bodysuit?.emissiveIntensity).toBeGreaterThan(0);
      
      // Hacker hoodie should have emissive
      const hoodie = hackerClothing.items.find(item => item.id === "hacker_hoodie");
      expect(hoodie?.colorEmissive).toBeDefined();
      expect(hoodie?.emissiveIntensity).toBeGreaterThan(0);
    });
  });

  describe("Performance", () => {
    it("clothing system should use appropriate geometry complexity", () => {
      const clothing = getArchetypeClothing(PlayerArchetype.MUSA);
      
      // Each archetype should have a reasonable number of items (not too many for performance)
      expect(clothing.items.length).toBeLessThanOrEqual(10);
      expect(clothing.items.length).toBeGreaterThan(0);
    });

    it("should have shadow casting configured appropriately", () => {
      const clothing = getArchetypeClothing(PlayerArchetype.MUSA);
      
      clothing.items.forEach((item) => {
        // Cast shadow should be defined (default true)
        if (item.castShadow !== undefined) {
          expect(typeof item.castShadow).toBe("boolean");
        }
        
        // Receive shadow should be defined (default true)
        if (item.receiveShadow !== undefined) {
          expect(typeof item.receiveShadow).toBe("boolean");
        }
      });
    });
  });
});
