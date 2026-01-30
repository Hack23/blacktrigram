#!/usr/bin/env tsx
/**
 * Script to analyze technique-to-animation mappings
 */
import { getAllTechniques } from './src/systems/trigram/techniques/index';

const techniques = getAllTechniques();

console.log('=== Technique to Animation Mapping Analysis ===\n');
console.log(`Total techniques: ${techniques.length}\n`);

// Group by animation type
const animationMap = new Map<string, string[]>();

techniques.forEach(tech => {
  const animType = tech.animationType?.toString() || 'UNDEFINED';
  const existing = animationMap.get(animType) || [];
  existing.push(tech.id);
  animationMap.set(animType, existing);
});

console.log('Animation Type Usage:\n');
Array.from(animationMap.entries())
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([animType, techIds]) => {
    console.log(`${animType}: ${techIds.length} techniques`);
    if (techIds.length > 1) {
      console.log(`  Techniques: ${techIds.slice(0, 5).join(', ')}${techIds.length > 5 ? '...' : ''}`);
    }
  });

// Check for missing animations
const missingAnimations = techniques.filter(t => !t.animationType);
if (missingAnimations.length > 0) {
  console.log(`\n⚠️ ${missingAnimations.length} techniques without animationType:`);
  missingAnimations.forEach(t => console.log(`  - ${t.id}`));
}

// Check for duplicate technique IDs
const idMap = new Map<string, number>();
techniques.forEach(tech => {
  idMap.set(tech.id, (idMap.get(tech.id) || 0) + 1);
});
const duplicates = Array.from(idMap.entries()).filter(([_, count]) => count > 1);
if (duplicates.length > 0) {
  console.log(`\n⚠️ Duplicate technique IDs found:`);
  duplicates.forEach(([id, count]) => console.log(`  - ${id}: ${count} instances`));
}

console.log(`\n✅ Unique technique IDs: ${idMap.size}`);
console.log(`✅ Unique animation types: ${animationMap.size}`);
