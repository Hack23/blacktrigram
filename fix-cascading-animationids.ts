#!/usr/bin/env tsx
/**
 * Fix Cascading AnimationId Issue
 * 
 * The migration added animationId fields but with cascading errors where
 * each technique got the previous technique's ID.
 * 
 * This script fixes by directly replacing incorrect animationIds.
 */

import * as fs from 'fs';
import * as path from 'path';

// Define correct mappings - id to animationId (should be 1-1)
const correctMappings: Record<string, string> = {
  // Geon
  "geon_heaven_strike": "geon_heaven_strike",
  "geon_heavenly_fist": "geon_heavenly_fist",
  "geon_frontal_kick": "geon_frontal_kick",
  "geon_roundhouse_kick": "geon_roundhouse_kick",
  "geon_axe_kick": "geon_axe_kick",
  "geon_palm_strike": "geon_palm_strike",
  "geon_elbow_smash": "geon_elbow_smash",
  
  // Tae
  "tae_flowing_strikes": "tae_flowing_strikes",
  "tae_wrist_lock": "tae_wrist_lock",
  "tae_small_circle": "tae_small_circle",
  "tae_finger_lock": "tae_finger_lock",
  "tae_elbow_lock": "tae_elbow_lock",
  "tae_shoulder_lock": "tae_shoulder_lock",
  "tae_arm_bar": "tae_arm_bar",
  
  // Li
  "li_flame_spear": "li_flame_spear",
  "li_temple_strike": "li_temple_strike",
  "li_nerve_strike": "li_nerve_strike",
  "li_sidekick": "li_sidekick",
  "li_pressure_point": "li_pressure_point",
  "li_solar_plexus_strike": "li_solar_plexus_strike",
  
  // Jin
  "jin_lightning_flash": "jin_lightning_flash",
  "jin_jumping_front_kick": "jin_jumping_front_kick",
  "jin_tornado_kick": "jin_tornado_kick",
  "jin_flying_sidekick": "jin_flying_sidekick",
  "jin_back_kick": "jin_back_kick",
  "jin_knee_strike": "jin_knee_strike",
  
  // Son
  "son_rapid_barrage": "son_rapid_barrage",
  "son_sweeping_low_kick": "son_sweeping_low_kick",
  "son_rapid_footwork": "son_rapid_footwork",
  "son_rhythmic_strikes": "son_rhythmic_strikes",
  "son_flowing_push": "son_flowing_push",
  "son_elbow_strike": "son_elbow_strike",
  
  // Gam
  "gam_water_counter": "gam_water_counter",
  "gam_redirect_throw": "gam_redirect_throw",
  "gam_hip_throw": "gam_hip_throw",
  "gam_flowing_block": "gam_flowing_block",
  "gam_circular_parry": "gam_circular_parry",
  "gam_wrist_twist_counter": "gam_wrist_twist_counter",
  
  // Gan
  "gan_rock_defense": "gan_rock_defense",
  "gan_immovable_stance": "gan_immovable_stance",
  "gan_iron_block": "gan_iron_block",
  "gan_counter_strike": "gan_counter_strike",
  "gan_reversal_technique": "gan_reversal_technique",
  "gan_mountain_stance_lock": "gan_mountain_stance_lock",
  
  // Gon
  "gon_earth_embrace": "gon_earth_embrace",
  "gon_leg_sweep": "gon_leg_sweep",
  "gon_ground_grapple": "gon_ground_grapple",
  "gon_ssireum_throw": "gon_ssireum_throw",
  "gon_body_lock_takedown": "gon_body_lock_takedown",
  "gon_ankle_pick": "gon_ankle_pick",
  "gon_sacrifice_throw": "gon_sacrifice_throw",
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

console.log('=== Fixing Cascading AnimationId Errors ===\n');

let totalFixed = 0;

files.forEach(fileName => {
  const filePath = path.join(techniquesDir, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${fileName}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let fixed = 0;
  
  // For each technique, find and fix animationId
  Object.entries(correctMappings).forEach(([techId, correctAnimId]) => {
    // Only process techniques for this file
    const prefix = fileName.replace('Techniques.ts', '').toLowerCase();
    if (!techId.startsWith(prefix)) return;
    
    // Find the technique block and fix animationId
    // Pattern: id: "techId", ... animationId: "WRONG_VALUE" 
    // Replace with: animationId: "correctAnimId"
    
    const pattern = new RegExp(
      `(id: "${techId}",\\s*[\\s\\S]*?animationId: )"[^"]*"`,
      'g'
    );
    
    const newContent = content.replace(pattern, `$1"${correctAnimId}"`);
    
    if (newContent !== content) {
      content = newContent;
      fixed++;
    }
  });
  
  if (fixed > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ ${fileName}: Fixed ${fixed} animationId values`);
    totalFixed += fixed;
  } else {
    console.log(`✓  ${fileName}: All animationIds correct`);
  }
});

console.log(`\n=== Fix Complete ===`);
console.log(`Total animationIds fixed: ${totalFixed}`);

console.log(`\n=== Verification ===`);
console.log(`Run: npm test TechniqueAnimationMapping.test.ts`);
console.log(`Expected: All 7 tests should pass`);
