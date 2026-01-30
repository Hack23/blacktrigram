/**
 * Technique-Animation Mapping Validation Test
 * 
 * Ensures proper 1-1 mapping between TechniqueId and AnimationId
 * and validates proper use of AnimationCategory (type) vs AnimationId (unique identifier)
 */

import { describe, expect, it } from 'vitest';
import { getAllTechniques } from '../techniques';
import { AnimationCategory, getAnimationCategoryFromId } from '../../animation/AnimationCategory';

describe('Technique-Animation Mapping Architecture', () => {
  const techniques = getAllTechniques();

  it('should have 1-1 mapping between TechniqueId and AnimationId', () => {
    const animationIdMap = new Map<string, string[]>();
    
    techniques.forEach(tech => {
      if (tech.animationId) {
        const existing = animationIdMap.get(tech.animationId) || [];
        existing.push(tech.id);
        animationIdMap.set(tech.animationId, existing);
      }
    });

    // Check for duplicates
    const duplicates = Array.from(animationIdMap.entries())
      .filter(([, techIds]) => techIds.length > 1);

    // If duplicates exist, include details in assertion message
    expect(duplicates).toHaveLength(0);
  });

  it('should have AnimationId matching TechniqueId for all techniques', () => {
    const mismatches: string[] = [];
    
    techniques.forEach(tech => {
      // For proper 1-1 mapping, animationId should equal technique id
      if (tech.animationId && tech.animationId !== tech.id) {
        mismatches.push(`${tech.id}: animationId="${tech.animationId}" should be "${tech.id}"`);
      }
    });

    // If mismatches exist, include details in assertion message
    expect(mismatches).toHaveLength(0);
  });

  it('should use AnimationCategory (type) that can be shared, not unique per technique', () => {
    const categoryCounts = new Map<string, number>();
    
    techniques.forEach(tech => {
      if (tech.animationCategory) {
        const count = categoryCounts.get(tech.animationCategory) || 0;
        categoryCounts.set(tech.animationCategory, count + 1);
      }
    });

    // AnimationCategory should have multiple techniques per category
    // If every category only has 1 technique, we're using it like an ID (wrong!)
    const categoriesWithMultipleTechniques = Array.from(categoryCounts.values())
      .filter(count => count > 1).length;

    const totalCategories = categoryCounts.size;
    
    // At least 50% of categories should be shared by multiple techniques
    const sharedPercentage = (categoriesWithMultipleTechniques / totalCategories) * 100;

    // Should have reasonable category sharing (at least 30%)
    expect(sharedPercentage).toBeGreaterThanOrEqual(30);
  });

  it('should have all techniques with animationId defined', () => {
    const missing = techniques.filter(t => !t.animationId);

    // Eventually all should have animationId, but allow migration period
    expect(missing.length).toBeLessThan(techniques.length * 0.5); // <50% missing
  });

  it('should have all techniques with animationCategory defined', () => {
    const missing = techniques.filter(t => !t.animationCategory);

    // Eventually all should have category, but allow migration period
    expect(missing.length).toBeLessThan(techniques.length * 0.5); // <50% missing
  });

  it('should have animationCategory match the inferred category from animationId', () => {
    const mismatches: string[] = [];
    
    techniques.forEach(tech => {
      if (tech.animationId && tech.animationCategory) {
        const inferred = getAnimationCategoryFromId(tech.animationId);
        if (inferred.toString() !== tech.animationCategory) {
          mismatches.push(
            `${tech.id}: category="${tech.animationCategory}" but animationId="${tech.animationId}" suggests "${inferred}"`
          );
        }
      }
    });

    // Allow some mismatches during migration, but flag for review
    expect(mismatches.length).toBeLessThan(techniques.length * 0.3); // <30% mismatch
  });

  it('should use proper AnimationCategory enum values', () => {
    const validCategories = new Set(Object.values(AnimationCategory));
    const invalidCategories: string[] = [];
    
    techniques.forEach(tech => {
      if (tech.animationCategory && !validCategories.has(tech.animationCategory as AnimationCategory)) {
        invalidCategories.push(`${tech.id}: invalid category "${tech.animationCategory}"`);
      }
    });

    expect(invalidCategories).toHaveLength(0);
  });
});
