# Animation Architecture Migration Guide

## 🎯 Problem Statement

**AnimationType was being misused as a unique identifier instead of representing animation TYPES/CATEGORIES.**

### Before (Incorrect)
```typescript
animationType: AnimationType.GEON_HEAVENLY_FIST  // ❌ ID, not a type!
```

### After (Correct)
```typescript
animationCategory: "punch",           // ✅ Type/category (can be shared)
animationId: "geon_heavenly_fist",    // ✅ Unique ID (1-1 with technique)
```

## 📐 New Architecture

### Three Distinct Concepts

1. **AnimationCategory** (Type - Shared)
   - Represents broad categories of animations
   - Examples: `"punch"`, `"kick"`, `"throw"`, `"grapple"`
   - Multiple techniques share the same category
   - Used for: Animation blending, fallbacks, categorization

2. **AnimationId** (Unique Identifier - 1-1 Mapping)
   - Unique identifier for specific animation instance
   - Example: `"geon_heavenly_fist"`, `"son_rhythmic_strikes"`
   - Should match TechniqueId for 1-1 mapping
   - Used for: Direct animation lookup

3. **TechniqueId** (Unique Identifier)
   - Unique identifier for technique
   - Example: `"geon_heavenly_fist"`
   - Relationship: `TechniqueId === AnimationId` (1-1 mapping)

## 🔄 Migration Process

### Step 1: Update Interface (DONE ✅)

```typescript
// src/systems/vitalpoint/types.ts
export interface KoreanTechnique {
  // ... existing fields ...
  
  // NEW: Proper architecture
  animationCategory?: string;  // Type: shared category
  animationId?: string;         // ID: unique identifier
  
  // Legacy: kept for backward compatibility
  animationType?: AnimationType;
}
```

### Step 2: Add AnimationCategory Enum (DONE ✅)

```typescript
// src/systems/animation/AnimationCategory.ts
export enum AnimationCategory {
  PUNCH = "punch",
  KICK = "kick",
  THROW = "throw",
  GRAPPLE = "grapple",
  // ... ~15 categories total
}
```

### Step 3: Update Technique Definitions

For each technique in `src/systems/trigram/techniques/*.ts`:

```typescript
{
  id: "geon_heavenly_fist",
  // ... other fields ...
  
  // ADD THESE:
  animationCategory: "punch",              // Category (from AnimationCategory enum)
  animationId: "geon_heavenly_fist",       // Unique ID (matches technique id)
  
  // KEEP FOR NOW (backward compatibility):
  animationType: AnimationType.GEON_HEAVENLY_FIST,
}
```

### Step 4: Validation Tests (DONE ✅)

Created `TechniqueAnimationMapping.test.ts` to validate:
- ✅ 1-1 mapping between TechniqueId and AnimationId
- ✅ AnimationId matches TechniqueId
- ✅ AnimationCategory is shared (not unique per technique)
- ✅ All techniques have both fields defined
- ✅ Categories match the inferred category from ID

## 📋 Migration Checklist

### Core Files Updated
- ✅ `src/systems/animation/AnimationCategory.ts` - New category enum
- ✅ `src/systems/vitalpoint/types.ts` - Updated interface
- ✅ `src/systems/trigram/techniques/TechniqueId.ts` - Technique ID enum
- ✅ `src/systems/trigram/__tests__/TechniqueAnimationMapping.test.ts` - Validation tests

### Technique Files to Update (51 total)
- ⏳ `GeonTechniques.ts` - Example done for first technique
- ⏳ `TaeTechniques.ts` - 7 techniques
- ⏳ `LiTechniques.ts` - 6 techniques
- ⏳ `JinTechniques.ts` - 6 techniques
- ⏳ `SonTechniques.ts` - 6 techniques
- ⏳ `GamTechniques.ts` - 6 techniques
- ⏳ `GanTechniques.ts` - 6 techniques
- ⏳ `GonTechniques.ts` - 7 techniques
- ⏳ `DarkOpsTechniques.ts` - 15 techniques

### Animation System Updates (Future)
- ⏳ Update animation registry to use animationId for lookup
- ⏳ Update animation mapper to use animationCategory for fallbacks
- ⏳ Update animation blending system to use categories
- ⏳ Deprecate old AnimationType usage
- ⏳ Remove AnimationType enum after full migration

## 🎯 Benefits

### Semantic Clarity
```typescript
// BEFORE: Confusing - is this a type or an ID?
animationType: AnimationType.GEON_HEAVENLY_FIST

// AFTER: Crystal clear
animationCategory: "punch",           // This is a type
animationId: "geon_heavenly_fist",    // This is an ID
```

### Proper Categorization
```typescript
// Animation system can now:
// 1. Group animations by category
const punchAnimations = getAllAnimationsByCategory("punch");

// 2. Provide fallbacks
if (!animationExists(animationId)) {
  return getDefaultAnimationForCategory(animationCategory);
}

// 3. Blend similar animations
blendAnimations(animationCategory1, animationCategory2);
```

### 1-1 Mapping Maintained
```typescript
// Simple lookup remains:
const animation = getAnimationById(technique.animationId);
// technique.animationId === technique.id (for clarity)
```

## 🔧 Automated Migration Script

```typescript
// migrate-technique-animations.ts
import { AnimationCategory, getAnimationCategoryFromId } from './src/systems/animation/AnimationCategory';

function migrateTechnique(technique: any) {
  return {
    ...technique,
    animationCategory: getAnimationCategoryFromId(technique.id),
    animationId: technique.id, // 1-1 mapping with technique ID
    // Keep animationType for backward compatibility
  };
}
```

## 📊 Progress Tracking

- Total Techniques: 51
- Migrated: 1 (example)
- Remaining: 50
- Tests Created: 7 validation tests
- Test Status: ⏳ Will pass after full migration

## 🚀 Next Steps

1. Run migration script on all technique files
2. Verify tests pass
3. Update animation system to use new fields
4. Remove AnimationType usage gradually
5. Complete deprecation after validation period

## 📖 Documentation

- See `AnimationCategory.ts` for category enum
- See `TechniqueAnimationMapping.test.ts` for validation rules
- See `TechniqueId.ts` for all technique IDs

---

**Status**: Architecture defined ✅ | Migration in progress ⏳ | Tests ready ✅
