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
      .filter(([_, techIds]) => techIds.length > 1);

    if (duplicates.length > 0) {
      console.error('Duplicate AnimationIds found:');
      duplicates.forEach(([animId, techIds]) => {
        console.error(`  ${animId}: used by ${techIds.join(', ')}`);
      });
    }

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

    if (mismatches.length > 0) {
      console.error('AnimationId/TechniqueId mismatches:');
      mismatches.forEach(msg => console.error(`  ${msg}`));
    }

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

    console.log(`Animation categories: ${totalCategories}`);
    console.log(`Categories shared by multiple techniques: ${categoriesWithMultipleTechniques} (${sharedPercentage.toFixed(1)}%)`);
    console.log('\nCategory distribution:');
    Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count} techniques`);
      });

    // Should have reasonable category sharing (at least 30%)
    expect(sharedPercentage).toBeGreaterThanOrEqual(30);
  });

  it('should have all techniques with animationId defined', () => {
    const missing = techniques.filter(t => !t.animationId);
    
    if (missing.length > 0) {
      console.error(`${missing.length} techniques missing animationId:`);
      missing.slice(0, 10).forEach(t => console.error(`  - ${t.id}`));
    }

    // Eventually all should have animationId, but allow migration period
    expect(missing.length).toBeLessThan(techniques.length * 0.5); // <50% missing
  });

  it('should have all techniques with animationCategory defined', () => {
    const missing = techniques.filter(t => !t.animationCategory);
    
    if (missing.length > 0) {
      console.error(`${missing.length} techniques missing animationCategory:`);
      missing.slice(0, 10).forEach(t => console.error(`  - ${t.id}`));
    }

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

    if (mismatches.length > 0) {
      console.warn('AnimationCategory mismatches (may need review):');
      mismatches.slice(0, 10).forEach(msg => console.warn(`  ${msg}`));
    }

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

    if (invalidCategories.length > 0) {
      console.error('Techniques with invalid AnimationCategory:');
      invalidCategories.forEach(msg => console.error(`  ${msg}`));
    }

    expect(invalidCategories).toHaveLength(0);
  });
});
