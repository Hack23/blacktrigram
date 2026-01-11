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

import React, { useMemo, useEffect, useRef } from "react";
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
  scale: _scale = 1, // Reserved for future use
}) => {
  // Destructure item properties for stable useMemo dependencies
  const {
    type: itemType,
    fit: itemFit,
    scaleMultiplier: _scaleMultiplier, // Reserved for future use
    colorPrimary,
    colorEmissive,
    emissiveIntensity,
    metalness,
    roughness,
    castShadow,
    receiveShadow,
    id: itemId,
  } = item;

  // Get geometry and position based on clothing type
  // Inline scale calculations to avoid unnecessary object recreation
  const clothingGeometry = useMemo(() => {
    // Calculate scale factors inline
    const torsoScale = physicalAttributes.torsoLength / 59; // 59cm base torso
    const legScale = physicalAttributes.legLength / 96; // 96cm base leg
    
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
        const height = (physicalAttributes.torsoLength / 100) * torsoScale;
        const depth = 0.15 * fitScale; // Thickness
        
        return {
          geometry: new THREE.BoxGeometry(width, height, depth),
          position: new THREE.Vector3(0, height / 2, 0),
        };
      }
      
      case "pants": {
        // Pants (per leg) - create separate geometries for left and right legs
        const legThickness = 0.08 * fitScale;
        const legHeight = (physicalAttributes.legLength / 100) * legScale;
        
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
        const torsoScale = physicalAttributes.torsoLength / 59; // 59cm base torso
        const width = (physicalAttributes.shoulderWidth / 100) * 0.9 * fitScale;
        const height = (physicalAttributes.torsoLength / 100) * 0.7 * torsoScale;
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
  }, [itemType, itemFit, physicalAttributes]);

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

  // For pants, create a second material instance for the right leg
  const materialRight = useMemo(() => {
    if (itemType !== "pants") return null;
    
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
  }, [itemType, colorPrimary, colorEmissive, emissiveIntensity, metalness, roughness]);

  // Clean up Three.js resources when component unmounts or dependencies change
  // Store previous resources to dispose when they change
  const prevGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const prevGeometryRightRef = useRef<THREE.BufferGeometry | null>(null);
  const prevMaterialRef = useRef<THREE.Material | null>(null);
  const prevMaterialRightRef = useRef<THREE.Material | null>(null);

  useEffect(() => {
    // Dispose previous geometries if they changed
    if (prevGeometryRef.current && prevGeometryRef.current !== clothingGeometry.geometry) {
      prevGeometryRef.current.dispose();
    }
    if (prevGeometryRightRef.current && 'geometryRight' in clothingGeometry && 
        prevGeometryRightRef.current !== clothingGeometry.geometryRight) {
      prevGeometryRightRef.current.dispose();
    }
    
    // Dispose previous materials if they changed
    if (prevMaterialRef.current && prevMaterialRef.current !== material) {
      prevMaterialRef.current.dispose();
    }
    if (prevMaterialRightRef.current && prevMaterialRightRef.current !== materialRight) {
      prevMaterialRightRef.current.dispose();
    }
    
    // Update refs to current resources
    prevGeometryRef.current = clothingGeometry.geometry;
    prevGeometryRightRef.current = 'geometryRight' in clothingGeometry ? clothingGeometry.geometryRight ?? null : null;
    prevMaterialRef.current = material;
    prevMaterialRightRef.current = materialRight;
    
    // Cleanup on unmount
    return () => {
      clothingGeometry.geometry.dispose();
      // For pants, also dispose the second geometry
      if ('geometryRight' in clothingGeometry && clothingGeometry.geometryRight) {
        clothingGeometry.geometryRight.dispose();
      }
      material.dispose();
      // For pants, also dispose the second material
      if (materialRight) {
        materialRight.dispose();
      }
    };
  }, [clothingGeometry, material, materialRight]);

  // For pants, create two meshes (left and right leg) with separate geometries and materials
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
        
        {/* Right leg with separate geometry and material */}
        <mesh
          position={[hipWidth / 2, clothingGeometry.position.y, 0]}
          geometry={'geometryRight' in clothingGeometry ? clothingGeometry.geometryRight : clothingGeometry.geometry}
          material={materialRight ?? material}
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
  boneMap: _boneMap, // Reserved for future skeletal skinning implementation
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
