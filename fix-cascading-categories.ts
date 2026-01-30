#!/usr/bin/env tsx
/**
 * Fix Cascading AnimationCategory Issue
 * 
 * The animationCategories are cascading like the IDs were.
 * This script fixes by setting the correct categories.
 */

import * as fs from 'fs';
import * as path from 'path';

// Correct category mappings - consolidated to 15 categories
const correctCategories: Record<string, string> = {
  // Geon (Heaven - Direct Force)
  "geon_heaven_strike": "punch",
  "geon_heavenly_fist": "punch",
  "geon_frontal_kick": "kick",
  "geon_roundhouse_kick": "kick",
  "geon_axe_kick": "kick",
  "geon_palm_strike": "strike",
  "geon_elbow_smash": "elbow_strike",
  
  // Tae (Lake - Flowing Circular)
  "tae_flowing_strikes": "punch",
  "tae_wrist_lock": "joint_lock",
  "tae_small_circle": "joint_lock",
  "tae_finger_lock": "joint_lock",
  "tae_elbow_lock": "joint_lock",
  "tae_shoulder_lock": "joint_lock",
  "tae_arm_bar": "joint_lock",
  
  // Li (Fire - Precision)
  "li_flame_spear": "strike",
  "li_temple_strike": "elbow_strike",
  "li_nerve_strike": "strike",
  "li_sidekick": "kick",
  "li_pressure_point": "strike",
  "li_solar_plexus_strike": "strike",
  
  // Jin (Thunder - Explosive)
  "jin_lightning_flash": "punch",
  "jin_jumping_front_kick": "jumping_kick",
  "jin_tornado_kick": "kick",
  "jin_flying_sidekick": "jumping_kick",
  "jin_back_kick": "kick",
  "jin_knee_strike": "knee_strike",
  
  // Son (Wind - Continuous)
  "son_rapid_barrage": "punch",
  "son_sweeping_low_kick": "kick",
  "son_rapid_footwork": "footwork",
  "son_rhythmic_strikes": "punch",
  "son_flowing_push": "strike",
  "son_elbow_strike": "elbow_strike",
  
  // Gam (Water - Yielding)
  "gam_water_counter": "counter",
  "gam_redirect_throw": "throw",
  "gam_hip_throw": "throw",
  "gam_flowing_block": "defensive",
  "gam_circular_parry": "defensive",
  "gam_wrist_twist_counter": "joint_lock",
  
  // Gan (Mountain - Immovable)
  "gan_rock_defense": "defensive",
  "gan_immovable_stance": "stance",
  "gan_iron_block": "defensive",
  "gan_counter_strike": "counter",
  "gan_reversal_technique": "counter",
  "gan_mountain_stance_lock": "grapple",
  
  // Gon (Earth - Grounding)
  "gon_earth_embrace": "grapple",
  "gon_leg_sweep": "sweep",
  "gon_ground_grapple": "grapple",
  "gon_ssireum_throw": "throw",
  "gon_body_lock_takedown": "takedown",
  "gon_ankle_pick": "sweep",
  "gon_sacrifice_throw": "throw",
};

const techniquesDir = path.join(process.cwd(), 'src', 'systems', 'trigram', 'techniques');

const files = [
  'GeonTechniques.ts',
  'TaeTechniques.ts',
  'LiTechniques.ts',
  'JinTechniques.ts',
  'SonTechniques.ts',
  'GamTechniques.ts',
  'GanTechniques.ts',
  'GonTechniques.ts',
];

console.log('=== Fixing Cascading AnimationCategory Errors ===\n');

let totalFixed = 0;

files.forEach(fileName => {
  const filePath = path.join(techniquesDir, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${fileName}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let fixed = 0;
  
  // For each technique, find and fix animationCategory
  Object.entries(correctCategories).forEach(([techId, correctCategory]) => {
    // Only process techniques for this file
    const prefix = fileName.replace('Techniques.ts', '').toLowerCase();
    if (!techId.startsWith(prefix)) return;
    
    // Pattern: id: "techId", ... animationCategory: "WRONG_VALUE"
    const pattern = new RegExp(
      `(id: "${techId}",\\s*[\\s\\S]*?animationCategory: )"[^"]*"`,
      'g'
    );
    
    const newContent = content.replace(pattern, `$1"${correctCategory}"`);
    
    if (newContent !== content) {
      content = newContent;
      fixed++;
    }
  });
  
  if (fixed > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ ${fileName}: Fixed ${fixed} animationCategory values`);
    totalFixed += fixed;
  } else {
    console.log(`✓  ${fileName}: All animationCategories correct`);
  }
});

console.log(`\n=== Fix Complete ===`);
console.log(`Total animationCategories fixed: ${totalFixed}`);

// Show category distribution
const categories = new Set(Object.values(correctCategories));
console.log(`\n=== Category Summary ===`);
console.log(`Total categories: ${categories.size} (consolidated from 27)`);
console.log(`Categories: ${Array.from(categories).sort().join(', ')}`);

const categoryCounts: Record<string, number> = {};
Object.values(correctCategories).forEach(cat => {
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
});

console.log(`\nDistribution:`);
Object.entries(categoryCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count} techniques`);
  });

console.log(`\n=== Verification ===`);
console.log(`Run: npm test TechniqueAnimationMapping.test.ts`);
console.log(`Expected: ALL 7 tests should pass ✅`);
