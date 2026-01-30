#!/usr/bin/env tsx
/**
 * Automated Migration Script: Add animationCategory and animationId to all techniques
 * 
 * This script reads all technique files and adds the new architecture fields:
 * - animationCategory: Inferred from technique type/animation
 * - animationId: Same as technique id (1-1 mapping)
 */

import * as fs from 'fs';
import * as path from 'path';
import { getAllTechniques } from './src/systems/trigram/techniques/index';
import { getAnimationCategoryFromId } from './src/systems/animation/AnimationCategory';

console.log('=== Technique Migration Script ===\n');

const techniques = getAllTechniques();
console.log(`Total techniques to migrate: ${techniques.length}\n`);

// Group by file
const techniquesByFile = new Map<string, typeof techniques>();

techniques.forEach(tech => {
  // Determine which file this technique belongs to based on stance/id
  let fileName = '';
  const id = tech.id.toLowerCase();
  
  if (id.startsWith('geon_')) fileName = 'GeonTechniques.ts';
  else if (id.startsWith('tae_')) fileName = 'TaeTechniques.ts';
  else if (id.startsWith('li_')) fileName = 'LiTechniques.ts';
  else if (id.startsWith('jin_')) fileName = 'JinTechniques.ts';
  else if (id.startsWith('son_')) fileName = 'SonTechniques.ts';
  else if (id.startsWith('gam_')) fileName = 'GamTechniques.ts';
  else if (id.startsWith('gan_')) fileName = 'GanTechniques.ts';
  else if (id.startsWith('gon_')) fileName = 'GonTechniques.ts';
  else if (id.startsWith('darkops_')) fileName = 'DarkOpsTechniques.ts';
  
  if (fileName) {
    const existing = techniquesByFile.get(fileName) || [];
    existing.push(tech);
    techniquesByFile.set(fileName, existing);
  }
});

console.log('Techniques by file:');
techniquesByFile.forEach((techs, file) => {
  console.log(`  ${file}: ${techs.length} techniques`);
});

console.log('\n=== Generating Migration Commands ===\n');

// For each technique, generate the migration
techniques.forEach(tech => {
  const category = getAnimationCategoryFromId(tech.id);
  
  console.log(`// ${tech.id}`);
  console.log(`animationCategory: "${category}",`);
  console.log(`animationId: "${tech.id}",`);
  console.log();
});

console.log('\n=== Migration Strategy ===');
console.log('1. For each technique definition in the TypeScript files:');
console.log('2. Add these two lines after the "effects: []," line:');
console.log('   animationCategory: "<inferred_category>",');
console.log('   animationId: "<technique_id>",');
console.log('3. Keep existing animationType for backward compatibility\n');

// Generate file-specific migration data
console.log('\n=== File-Specific Migration Data ===\n');

techniquesByFile.forEach((techs, fileName) => {
  console.log(`\n// ${fileName}`);
  techs.forEach(tech => {
    const category = getAnimationCategoryFromId(tech.id);
    console.log(`  "${tech.id}": { category: "${category}", id: "${tech.id}" },`);
  });
});

export {};
