/**
 * ClothingSystem component for rendering fighter clothing
 *
 * **Korean**: 의류 시스템 컴포넌트 (Clothing System Component)
 *
 * Renders archetype-specific clothing attached to the skeletal rig.
 * Clothing scales with body proportions and follows bone transformations.
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
 * scaling and attachment to skeletal bones.
 *
 * @korean 의류아이템렌더러
 */
const ClothingItemRenderer: React.FC<ClothingItemProps> = ({
  item,
  physicalAttributes,
  scale = 1,
}) => {
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
      overall: heightScale * scale * (item.scaleMultiplier ?? 1.0),
    };
  }, [physicalAttributes, scale, item.scaleMultiplier]);

  // Get geometry and position based on clothing type
  const clothingGeometry = useMemo(() => {
    // Map fit type to scale multiplier
    const fitScaleMap: Record<typeof item.fit, number> = {
      tight: 1.02,
      fitted: 1.05,
      loose: 1.15,
      oversized: 1.3,
    };
    const fitScale = fitScaleMap[item.fit];
    
    switch (item.type) {
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
        // Pants (per leg)
        const legThickness = 0.08 * fitScale;
        const legHeight = (physicalAttributes.legLength / 100) * scaleFactors.leg;
        
        return {
          geometry: new THREE.CylinderGeometry(
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
  }, [item, physicalAttributes, scaleFactors]);

  // Material configuration
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: item.colorPrimary,
      metalness: item.metalness ?? 0.2,
      roughness: item.roughness ?? 0.7,
    });
    
    if (item.colorEmissive !== undefined) {
      mat.emissive = new THREE.Color(item.colorEmissive);
      mat.emissiveIntensity = item.emissiveIntensity ?? 0.1;
    }
    
    return mat;
  }, [item.colorPrimary, item.colorEmissive, item.emissiveIntensity, item.metalness, item.roughness]);

  // Clean up Three.js resources when component unmounts or dependencies change
  useEffect(() => {
    return () => {
      clothingGeometry.geometry.dispose();
      material.dispose();
    };
  }, [clothingGeometry.geometry, material]);

  // For pants, create two meshes (left and right leg)
  if (item.type === "pants") {
    const hipWidth = (physicalAttributes.shoulderWidth / 100) * 0.4;
    
    // Common mesh properties
    const meshProps = {
      geometry: clothingGeometry.geometry,
      material: material,
      castShadow: item.castShadow ?? true,
      receiveShadow: item.receiveShadow ?? true,
    };
    
    return (
      <>
        {/* Left leg */}
        <mesh
          {...meshProps}
          position={[-hipWidth / 2, clothingGeometry.position.y, 0]}
          data-testid={`clothing-item-${item.id}-left`}
        />
        
        {/* Right leg */}
        <mesh
          {...meshProps}
          position={[hipWidth / 2, clothingGeometry.position.y, 0]}
          data-testid={`clothing-item-${item.id}-right`}
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
      castShadow={item.castShadow ?? true}
      receiveShadow={item.receiveShadow ?? true}
      data-testid={`clothing-item-${item.id}`}
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
