# Clothing System Documentation

**한글**: 의류 시스템 문서 (Clothing System Documentation)

## Overview | 개요

The Clothing System provides realistic, culturally-appropriate attire for each of the five fighter archetypes in Black Trigram. This system replaces the previous nude skeletal models with characteristic Korean martial arts clothing combined with cyberpunk aesthetics.

의류 시스템은 블랙 트라이그램의 다섯 가지 전투 원형 각각에 대해 현실적이고 문화적으로 적절한 의상을 제공합니다. 이 시스템은 이전의 누드 골격 모델을 사이버펑크 미학과 결합된 특징적인 한국 무술 의상으로 대체합니다.

## Architecture | 구조

### Core Components | 핵심 구성 요소

1. **Type Definitions** (`src/types/clothing.ts`)
   - TypeScript interfaces for clothing items and sets
   - Material and fit type definitions
   - Component props interfaces

2. **Clothing Data** (`src/data/archetypeClothing.ts`)
   - Five complete clothing sets (one per archetype)
   - Korean-themed color schemes
   - Material configurations

3. **Rendering Component** (`src/components/shared/three/models/ClothingSystem.tsx`)
   - Three.js mesh generation for static clothing meshes
   - Automatic scaling based on archetype physical attributes
   - Performance-optimized rendering with proper resource cleanup
   - **Current Limitation**: Clothing meshes are static and not yet skinned to individual bones

4. **Integration** (`src/components/shared/three/models/SkeletalPlayer3D.tsx`)
   - Positioned alignment with the existing skeletal player model
   - Visibility toggle for debug mode
   - Proper layering with other visual effects
   - **Note**: Full skeletal-rig integration (per-bone attachment) is planned for future versions

## Archetype Clothing Sets | 원형별 의류 세트

### 1. 무사 (Musa) - Traditional Warrior

**Philosophy**: Honor through disciplined strength  
**Style**: Military dobok with tactical enhancements

**Clothing Items**:
- 전투 도복 상의 (Combat Dobok Top) - Dark gray gi with gold accents
- 전투 도복 하의 (Combat Dobok Pants) - Matching dobok pants
- 검은 띠 (Black Belt) - Traditional martial arts black belt
- 전투 부츠 (Combat Boots) - Military-style black boots

**Colors**:
- Primary: Dark gray (0x2d2d2d)
- Secondary: Gold (0xffc400)
- Accent: Black (0x000000)

### 2. 암살자 (Amsalja) - Shadow Assassin

**Philosophy**: Efficiency through invisibility  
**Style**: Stealth bodysuit with cyber enhancements

**Clothing Items**:
- 스텔스 바디슈트 (Stealth Bodysuit) - Black synthetic with cyan glow
- 스텔스 팬츠 (Stealth Pants) - Form-fitting tactical pants
- 사이버 조끼 (Cyber Vest) - Armored tactical vest
- 스텔스 부츠 (Stealth Boots) - Silent movement boots

**Colors**:
- Primary: Black (0x000000)
- Secondary: Cyan (0x00e6e6)
- Accent: Dark gray (0x0a0a0a)

**Special Features**:
- High emissive intensity for cyberpunk glow
- Tight fit for agility
- Metallic materials for tech aesthetic

### 3. 해커 (Hacker) - Cyber Warrior

**Philosophy**: Information as power through technology  
**Style**: Casual tech wear with AR elements

**Clothing Items**:
- 사이버 후드티 (Cyber Hoodie) - Tech-enhanced hoodie
- 테크 팬츠 (Tech Pants) - Tactical cargo pants
- 데이터 글러브 (Data Gloves) - Cybernetic interface gloves
- 스마트 스니커즈 (Smart Sneakers) - Tech-enhanced footwear

**Colors**:
- Primary: Medium gray (0x2d2d2d)
- Secondary: Purple (0xaa44ff)
- Accent: Black (0x000000)

**Special Features**:
- Purple emissive theme
- Cybernetic gloves for hacking
- Loose fit for street style

### 4. 정보요원 (Jeongbo Yowon) - Intelligence Operative

**Philosophy**: Knowledge through observation  
**Style**: Professional tactical suit

**Clothing Items**:
- 작전 재킷 (Tactical Jacket) - Government operative jacket
- 작전 팬츠 (Tactical Pants) - Professional tactical pants
- 작전 조끼 (Tactical Vest) - Armored protective vest
- 전술 벨트 (Tactical Belt) - Equipment belt
- 작전 부츠 (Tactical Boots) - Professional field boots

**Colors**:
- Primary: Dark gray (0x0a0a0a)
- Secondary: Blue (0x3399ff)
- Accent: Medium gray (0x2d2d2d)

**Special Features**:
- Clean, professional appearance
- Multiple tactical gear pieces
- Fitted for operational flexibility

### 5. 조직폭력배 (Jojik Pokryeokbae) - Street Fighter

**Philosophy**: Survival through brutality  
**Style**: Intimidating street gang attire

**Clothing Items**:
- 가죽 재킷 (Leather Jacket) - Heavy leather jacket with red accents
- 카고 팬츠 (Cargo Pants) - Loose cargo pants
- 체인 벨트 (Chain Belt) - Metal chain belt
- 스터드 장갑 (Studded Gloves) - Leather gloves with studs
- 전투 부츠 (Combat Boots) - Heavy combat boots

**Colors**:
- Primary: Black (0x000000)
- Secondary: Red (0xff4444)
- Accent: Dark gray (0x0a0a0a)

**Special Features**:
- Oversized fit for intimidation
- Heavy leather materials
- Metallic accents (chains, studs)

## Technical Implementation | 기술 구현

### Scaling System | 크기 조정 시스템

Clothing automatically scales based on fighter physical attributes:

```typescript
const scaleFactors = {
  height: physicalAttributes.totalHeight / 180, // Base height
  torso: physicalAttributes.torsoLength / 59,   // Base torso
  leg: physicalAttributes.legLength / 96,       // Base leg
  shoulder: physicalAttributes.shoulderWidth / 46, // Base shoulder
};
```

### Fit Types | 착용 스타일

- **Tight**: 1.02x body size (bodysuits, gloves)
- **Fitted**: 1.05x body size (tactical gear, dobok)
- **Loose**: 1.15x body size (hoodies, cargo pants)
- **Oversized**: 1.3x body size (intimidating street wear)

### Material Properties | 재료 속성

Each clothing item has configurable material properties:

- **Metalness**: 0.0 to 1.0 (fabric = 0.1, metal = 0.8)
- **Roughness**: 0.0 to 1.0 (polished = 0.2, cloth = 0.8)
- **Emissive Color**: Hex color for glowing effects
- **Emissive Intensity**: 0.0 to 1.0 (cyberpunk accents)

### Performance Optimization | 성능 최적화

The clothing system is designed for 60fps performance:

1. **Simple Geometry**: Box and cylinder primitives (< 1000 triangles per character)
2. **Optimized Dependencies**: useMemo with specific property dependencies to prevent unnecessary re-renders
3. **Dual Mesh Rendering**: Pants rendered as two separate meshes (left/right leg) with independent geometries and materials
4. **LOD Support**: Ready for level-of-detail implementation
5. **Static Positioning**: Clothing positioned with character (skeletal skinning planned for future)

## Usage Example | 사용 예시

```typescript
import ClothingSystem from "./ClothingSystem";
import { PlayerArchetype } from "@/types";
import { getArchetypePhysicalAttributes } from "@/data/archetypePhysicalAttributes";

// In SkeletalPlayer3D component
<ClothingSystem
  archetype={PlayerArchetype.MUSA}
  physicalAttributes={getArchetypePhysicalAttributes(PlayerArchetype.MUSA)}
  boneMap={rig.bones}
  scale={1.0}
  visible={!showSkeleton} // Hide for debug view
/>
```

## Testing | 테스트

The clothing system has comprehensive test coverage:

- **Component Tests**: 22 tests for rendering and behavior
- **Data Tests**: 39 tests for clothing configurations
- **Total Coverage**: 61 tests passing

Run tests with:
```bash
npm test -- src/components/shared/three/models/ClothingSystem.test.tsx
npm test -- src/data/archetypeClothing.test.ts
```

## Material & Color Utilities | 재료 및 색상 유틸리티

### Material Presets (src/utils/clothingMaterials.ts)

The clothing system includes comprehensive material presets for realistic rendering:

**Natural Fabrics**: cotton, silk, wool
**Synthetic Fabrics**: nylon, polyester, spandex  
**Leather Types**: leather, leatherPolished, leatherDistressed
**Tactical Materials**: tacticalFabric, kevlar
**Cyberpunk Materials**: cyberSynthetic, neoprene, holographic
**Metal Accents**: steel, chrome, brushedMetal

```typescript
import { getMaterialPreset, blendMaterialPresets, applyWear } from "@/utils/clothingMaterials";

// Get a material preset
const leather = getMaterialPreset("leather");

// Blend materials for hybrid effects
const techLeather = blendMaterialPresets(
  getMaterialPreset("leather"),
  getMaterialPreset("cyberSynthetic"),
  0.3 // 30% cyber, 70% leather
);

// Apply wear for combat damage
const worn = applyWear(leather, 0.5); // 50% worn
```

### Color Utilities (src/utils/clothingColors.ts)

Color manipulation utilities for customization and effects:

```typescript
import { 
  adjustBrightness, 
  adjustSaturation,
  shiftHue,
  mixColors,
  createColorVariation,
  applyDamageColor
} from "@/utils/clothingColors";

// Create color variations
const lighterBlue = adjustBrightness(0x0088ff, 1.3);
const desaturated = adjustSaturation(0xff4444, 0.6);
const complementary = shiftHue(0x00ff00, 0.5);

// Apply damage effects
const damagedColor = applyDamageColor(0xffffff, 0.7); // 70% damaged
```

## Future Enhancements | 향후 개선사항

1. **Dynamic Cloth Physics**: Wind and movement effects
2. **Customization System**: Player-selectable colors and variants (utilities provided)
3. **Damage System**: Visual wear and tear during combat (utilities provided)
4. **Seasonal Variants**: Alternative outfits for events
5. **Unlockable Skins**: Achievement-based cosmetics
6. **LOD System**: Distance-based level of detail (interface provided)
7. **Skeletal Skinning**: Full bone attachment for animations (planned)

## Korean Cultural References | 한국 문화적 참고사항

### Traditional Elements | 전통 요소

- **도복 (Dobok)**: Traditional Korean martial arts uniform (Musa)
- **검은 띠 (Black Belt)**: Represents martial arts mastery
- **한복 영향**: Subtle hanbok-inspired elements in designs

### Cyberpunk Integration | 사이버펑크 통합

- **네온 효과 (Neon Effects)**: Emissive colors for futuristic aesthetic
- **기술 통합 (Tech Integration)**: Cybernetic enhancements
- **전통과 현대 (Traditional + Modern)**: Korean heritage meets future tech

## Performance Metrics | 성능 지표

**Target**: 60fps with clothing rendered  
**Geometry Complexity**: Low (< 1000 triangles per character)  
**Material Count**: 4-6 materials per character  
**Draw Calls**: Optimized through instancing

## API Reference | API 참조

### ClothingSystemProps

```typescript
interface ClothingSystemProps {
  archetype: PlayerArchetype;        // Fighter archetype
  physicalAttributes: PhysicalAttributes; // Body dimensions
  boneMap: Map<string, Bone>;        // Skeletal rig bones
  scale?: number;                    // Overall scale (default: 1)
  visible?: boolean;                 // Show/hide (default: true)
}
```

### ClothingItem

```typescript
interface ClothingItem {
  id: string;                        // Unique identifier
  nameKorean: string;                // Korean name
  nameEnglish: string;               // English name
  type: ClothingType;                // torso, pants, boots, etc.
  material: ClothingMaterial;        // fabric, leather, synthetic, etc.
  fit: ClothingFit;                  // tight, fitted, loose, oversized
  colorPrimary: number;              // Base color (hex)
  colorSecondary?: number;           // Accent color (hex)
  colorEmissive?: number;            // Glow color (hex)
  emissiveIntensity?: number;        // Glow strength (0-1)
  metalness?: number;                // Metal appearance (0-1)
  roughness?: number;                // Surface roughness (0-1)
  attachedBones: string[];           // Bone attachment points
  castShadow?: boolean;              // Cast shadows
  receiveShadow?: boolean;           // Receive shadows
}
```

## Contributing | 기여하기

When adding new clothing items:

1. Follow existing naming conventions (Korean + English)
2. Use Korean color scheme constants from `src/types/constants/colors.ts`
3. Add comprehensive tests for new items
4. Ensure bilingual documentation
5. Maintain 60fps performance target

## License | 라이선스

Part of the Black Trigram project. See main LICENSE file.

---

**흑괘의 길을 걸어라** - Walk the Path of the Black Trigram
