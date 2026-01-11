/**
 * ClothingSystem component for rendering fighter clothing
 *
 * **Korean**: 의류 시스템 컴포넌트 (Clothing System Component)
 *
 * Renders archetype-specific clothing as static meshes positioned with the character.
 * Clothing scales based on physical attributes but is not yet skinned to individual bones.
 *
 * **Current Implementation**: Static meshes with automatic scaling
 * **Future Enhancement**: Full skeletal skinning for bone-following animations
 *
 * @module components/three/ClothingSystem
 * @category 3D Components
 * @korean 의류시스템컴포넌트
 */

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { getArchetypeClothing } from "../../../../data/archetypeClothing";
import type { ClothingSystemProps, ClothingItemProps } from "../../../../types/clothing";

/**
 * Individual clothing item renderer
 *
 * Renders a single clothing item (torso, pants, belt, etc.) with proper
 * scaling based on physical attributes. Items are rendered as static meshes.
 *
 * @korean 의류아이템렌더러
 */
const ClothingItemRenderer: React.FC<ClothingItemProps> = ({
  item,
  physicalAttributes,
  scale = 1,
}) => {
  // Destructure item properties for stable useMemo dependencies
  const {
    type: itemType,
    fit: itemFit,
    scaleMultiplier,
    colorPrimary,
    colorEmissive,
    emissiveIntensity,
    metalness,
    roughness,
    castShadow,
    receiveShadow,
    id: itemId,
  } = item;

  // Calculate scale factors based on physical attributes
  const scaleFactors = useMemo(() => {
    const baseHeight = 180; // Base height in cm
    const heightScale = physicalAttributes.totalHeight / baseHeight;
    
    // Scale factors for different body parts
    const torsoScale = physicalAttributes.torsoLength / 59; // 59cm base torso
    const legScale = physicalAttributes.legLength / 96; // 96cm base leg
    const shoulderScale = physicalAttributes.shoulderWidth / 46; // 46cm base shoulder
    
    return {
      height: heightScale,
      torso: torsoScale,
      leg: legScale,
      shoulder: shoulderScale,
      overall: heightScale * scale * (scaleMultiplier ?? 1.0),
    };
  }, [physicalAttributes, scale, scaleMultiplier]);

  // Get geometry and position based on clothing type
  const clothingGeometry = useMemo(() => {
    // Map fit type to scale multiplier
    const fitScaleMap: Record<typeof itemFit, number> = {
      tight: 1.02,
      fitted: 1.05,
      loose: 1.15,
      oversized: 1.3,
    };
    const fitScale = fitScaleMap[itemFit];
    
    switch (itemType) {
      case "torso": {
        // Torso clothing (shirt, jacket, bodysuit)
        const width = (physicalAttributes.shoulderWidth / 100) * fitScale;
        const height = (physicalAttributes.torsoLength / 100) * scaleFactors.torso;
        const depth = 0.15 * fitScale; // Thickness
        
        return {
          geometry: new THREE.BoxGeometry(width, height, depth),
          position: new THREE.Vector3(0, height / 2, 0),
        };
      }
      
      case "pants": {
        // Pants (per leg) - create separate geometries for left and right legs
        const legThickness = 0.08 * fitScale;
        const legHeight = (physicalAttributes.legLength / 100) * scaleFactors.leg;
        
        return {
          geometry: new THREE.CylinderGeometry(
            legThickness,
            legThickness * 0.9,
            legHeight,
            16
          ),
          // Create a second geometry for the other leg to avoid shared geometry issues
          geometryRight: new THREE.CylinderGeometry(
            legThickness,
            legThickness * 0.9,
            legHeight,
            16
          ),
          position: new THREE.Vector3(0, -legHeight / 2, 0),
        };
      }
      
      case "belt": {
        // Belt around waist
        const beltWidth = (physicalAttributes.shoulderWidth / 100) * 0.8;
        const beltHeight = 0.08;
        const beltDepth = 0.12;
        
        return {
          geometry: new THREE.BoxGeometry(beltWidth, beltHeight, beltDepth),
          position: new THREE.Vector3(0, 0, 0),
        };
      }
      
      case "boots": {
        // Footwear
        const footLength = 0.15;
        const footWidth = 0.08;
        const footHeight = 0.1;
        
        return {
          geometry: new THREE.BoxGeometry(footLength, footHeight, footWidth),
          position: new THREE.Vector3(0, -footHeight / 2, footLength / 4),
        };
      }
      
      case "gloves": {
        // Hand protection
        const gloveSize = 0.06;
        
        return {
          geometry: new THREE.BoxGeometry(gloveSize, gloveSize * 1.2, gloveSize * 0.8),
          position: new THREE.Vector3(0, 0, 0),
        };
      }
      
      case "vest": {
        // Protective vest (slightly smaller than torso)
        const width = (physicalAttributes.shoulderWidth / 100) * 0.9 * fitScale;
        const height = (physicalAttributes.torsoLength / 100) * 0.7 * scaleFactors.torso;
        const depth = 0.1 * fitScale;
        
        return {
          geometry: new THREE.BoxGeometry(width, height, depth),
          position: new THREE.Vector3(0, height / 2, 0.05), // Slightly in front
        };
      }
      
      case "headgear": {
        // Headwear
        const headRadius = (physicalAttributes.headSize / 200);
        
        return {
          geometry: new THREE.SphereGeometry(headRadius * 1.1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
          position: new THREE.Vector3(0, 0, 0),
        };
      }
      
      case "accessory":
      default: {
        // Generic accessory
        return {
          geometry: new THREE.BoxGeometry(0.05, 0.05, 0.05),
          position: new THREE.Vector3(0, 0, 0),
        };
      }
    }
  }, [itemType, itemFit, physicalAttributes, scaleFactors]);

  // Material configuration
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: colorPrimary,
      metalness: metalness ?? 0.2,
      roughness: roughness ?? 0.7,
    });
    
    if (colorEmissive !== undefined) {
      mat.emissive = new THREE.Color(colorEmissive);
      mat.emissiveIntensity = emissiveIntensity ?? 0.1;
    }
    
    return mat;
  }, [colorPrimary, colorEmissive, emissiveIntensity, metalness, roughness]);

  // Clean up Three.js resources when component unmounts or dependencies change
  useEffect(() => {
    return () => {
      clothingGeometry.geometry.dispose();
      // For pants, also dispose the second geometry
      if ('geometryRight' in clothingGeometry && clothingGeometry.geometryRight) {
        clothingGeometry.geometryRight.dispose();
      }
      material.dispose();
    };
  }, [clothingGeometry, material]);

  // For pants, create two meshes (left and right leg) with separate geometries
  if (itemType === "pants") {
    const hipWidth = (physicalAttributes.shoulderWidth / 100) * 0.4;
    
    return (
      <>
        {/* Left leg */}
        <mesh
          position={[-hipWidth / 2, clothingGeometry.position.y, 0]}
          geometry={clothingGeometry.geometry}
          material={material}
          castShadow={castShadow ?? true}
          receiveShadow={receiveShadow ?? true}
          data-testid={`clothing-item-${itemId}-left`}
        />
        
        {/* Right leg with separate geometry */}
        <mesh
          position={[hipWidth / 2, clothingGeometry.position.y, 0]}
          geometry={'geometryRight' in clothingGeometry ? clothingGeometry.geometryRight : clothingGeometry.geometry}
          material={material}
          castShadow={castShadow ?? true}
          receiveShadow={receiveShadow ?? true}
          data-testid={`clothing-item-${itemId}-right`}
        />
      </>
    );
  }

  // Single mesh for other clothing types
  return (
    <mesh
      position={clothingGeometry.position}
      geometry={clothingGeometry.geometry}
      material={material}
      castShadow={castShadow ?? true}
      receiveShadow={receiveShadow ?? true}
      data-testid={`clothing-item-${itemId}`}
    />
  );
};

/**
 * ClothingSystem Component
 *
 * Main component that renders all clothing items for an archetype.
 * Attaches clothing to the skeletal rig and handles scaling.
 *
 * @example
 * ```tsx
 * <ClothingSystem
 *   archetype={PlayerArchetype.MUSA}
 *   physicalAttributes={musaPhysical}
 *   boneMap={skeletalRig.boneMap}
 *   scale={1.0}
 *   visible={true}
 * />
 * ```
 *
 * @korean 의류시스템컴포넌트
 */
export const ClothingSystem: React.FC<ClothingSystemProps> = ({
  archetype,
  physicalAttributes,
  scale = 1,
  visible = true,
}) => {
  // Get clothing set for archetype (must be called before any early returns)
  const clothingSet = useMemo(
    () => getArchetypeClothing(archetype),
    [archetype]
  );

  // Early return if not visible to avoid unnecessary rendering
  if (!visible) {
    return null;
  }

  // Render all clothing items
  return (
    <group data-testid={`clothing-system-${archetype}`}>
      {clothingSet.items.map((item) => (
        <group key={item.id} data-testid={`clothing-group-${item.id}`}>
          <ClothingItemRenderer
            item={item}
            physicalAttributes={physicalAttributes}
            scale={scale}
          />
        </group>
      ))}
    </group>
  );
};

export default ClothingSystem;
