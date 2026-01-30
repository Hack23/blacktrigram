#!/usr/bin/env tsx
/**
 * Analysis: AnimationType vs AnimationId architectural issue
 * 
 * PROBLEM: AnimationType is being used as a unique identifier, but semantically
 * it should represent a TYPE/CATEGORY of animation, not a unique instance.
 * 
 * CURRENT (WRONG):
 * - AnimationType.GEON_HEAVENLY_FIST - This is an ID, not a type!
 * - AnimationType.SON_RHYTHMIC_STRIKES - This is an ID, not a type!
 * 
 * CORRECT ARCHITECTURE:
 * - AnimationType: Category (e.g., PUNCH, KICK, THROW, GRAPPLE)
 * - AnimationId: Unique identifier (e.g., "geon_heavenly_fist", "son_rhythmic_strikes")
 * - TechniqueId: Already correct (e.g., "geon_heavenly_fist")
 */

import { getAllTechniques } from './src/systems/trigram/techniques/index';

console.log('=== Architecture Analysis: Type vs ID ===\n');

const techniques = getAllTechniques();

// Group techniques by what their animation TYPE should actually be
const properTypes = new Map<string, string[]>();

techniques.forEach(tech => {
  // Determine proper type based on combat attack type
  let properType = 'UNKNOWN';
  
  const techType = tech.type?.toString() || '';
  const animType = tech.animationType?.toString() || '';
  
  // Map combat types to animation types
  if (techType.includes('PUNCH')) properType = 'PUNCH';
  else if (techType.includes('KICK')) properType = 'KICK';
  else if (techType.includes('STRIKE')) {
    if (animType.includes('elbow')) properType = 'ELBOW_STRIKE';
    else if (animType.includes('knee')) properType = 'KNEE_STRIKE';
    else if (animType.includes('palm')) properType = 'PALM_STRIKE';
    else properType = 'STRIKE';
  }
  else if (techType.includes('THROW')) properType = 'THROW';
  else if (techType.includes('GRAPPLE')) properType = 'GRAPPLE';
  else if (techType.includes('BLOCK') || techType.includes('COUNTER')) properType = 'DEFENSIVE';
  else if (techType.includes('ELBOW')) properType = 'ELBOW_STRIKE';
  else if (techType.includes('KNEE')) properType = 'KNEE_STRIKE';
  
  const existing = properTypes.get(properType) || [];
  existing.push(`${tech.id} (currently: ${animType})`);
  properTypes.set(properType, existing);
});

console.log('How techniques SHOULD be grouped by AnimationType:\n');
Array.from(properTypes.entries())
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([type, techs]) => {
    console.log(`${type}: ${techs.length} techniques`);
    techs.slice(0, 3).forEach(t => console.log(`  - ${t}`));
    if (techs.length > 3) console.log(`  ... and ${techs.length - 3} more`);
    console.log();
  });

console.log('\n=== Proposed Architecture ===\n');
console.log('1. AnimationType: Category enum (PUNCH, KICK, THROW, etc.)');
console.log('   - Represents the TYPE of animation');
console.log('   - Shared across multiple techniques');
console.log('   - Used for animation system categorization\n');

console.log('2. AnimationId: Unique string identifier');
console.log('   - Same as TechniqueId for 1-1 mapping');
console.log('   - Example: "geon_heavenly_fist"');
console.log('   - References specific animation data\n');

console.log('3. TechniqueId: Already correct');
console.log('   - Unique identifier for technique');
console.log('   - Example: "geon_heavenly_fist"\n');

console.log('BENEFITS:');
console.log('✓ Semantic clarity: Types are types, IDs are IDs');
console.log('✓ Proper separation of concerns');
console.log('✓ Animation system can work with types (variations, fallbacks)');
console.log('✓ Each technique still has unique animation via AnimationId');
console.log('✓ 1-1 mapping maintained: TechniqueId === AnimationId');
