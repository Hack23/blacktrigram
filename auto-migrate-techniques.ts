#!/usr/bin/env tsx
/**
 * Automated Technique Migration - Add animationCategory and animationId
 * 
 * This script updates all technique files by adding the new architecture fields.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Migration data for each technique
const migrations: Record<string, { category: string; id: string }> = {
  // Geon techniques
  "geon_heaven_strike": { category: "punch", id: "geon_heaven_strike" },
  "geon_heavenly_fist": { category: "punch", id: "geon_heavenly_fist" },
  "geon_frontal_kick": { category: "front_kick", id: "geon_frontal_kick" },
  "geon_roundhouse_kick": { category: "roundhouse_kick", id: "geon_roundhouse_kick" },
  "geon_axe_kick": { category: "axe_kick", id: "geon_axe_kick" },
  "geon_palm_strike": { category: "palm_strike", id: "geon_palm_strike" },
  "geon_elbow_smash": { category: "elbow_strike", id: "geon_elbow_smash" },
  
  // Tae techniques
  "tae_flowing_strikes": { category: "punch", id: "tae_flowing_strikes" },
  "tae_wrist_lock": { category: "joint_lock", id: "tae_wrist_lock" },
  "tae_small_circle": { category: "joint_lock", id: "tae_small_circle" },
  "tae_finger_lock": { category: "joint_lock", id: "tae_finger_lock" },
  "tae_elbow_lock": { category: "joint_lock", id: "tae_elbow_lock" },
  "tae_shoulder_lock": { category: "joint_lock", id: "tae_shoulder_lock" },
  "tae_arm_bar": { category: "joint_lock", id: "tae_arm_bar" },
  
  // Li techniques
  "li_flame_spear": { category: "palm_strike", id: "li_flame_spear" },
  "li_temple_strike": { category: "elbow_strike", id: "li_temple_strike" },
  "li_nerve_strike": { category: "nerve_strike", id: "li_nerve_strike" },
  "li_sidekick": { category: "side_kick", id: "li_sidekick" },
  "li_pressure_point": { category: "pressure_point", id: "li_pressure_point" },
  "li_solar_plexus_strike": { category: "palm_strike", id: "li_solar_plexus_strike" },
  
  // Jin techniques
  "jin_lightning_flash": { category: "punch", id: "jin_lightning_flash" },
  "jin_jumping_front_kick": { category: "jumping_kick", id: "jin_jumping_front_kick" },
  "jin_tornado_kick": { category: "tornado_kick", id: "jin_tornado_kick" },
  "jin_flying_sidekick": { category: "jumping_kick", id: "jin_flying_sidekick" },
  "jin_back_kick": { category: "back_kick", id: "jin_back_kick" },
  "jin_knee_strike": { category: "knee_strike", id: "jin_knee_strike" },
  
  // Son techniques
  "son_rapid_barrage": { category: "punch", id: "son_rapid_barrage" },
  "son_sweeping_low_kick": { category: "low_kick", id: "son_sweeping_low_kick" },
  "son_rapid_footwork": { category: "footwork", id: "son_rapid_footwork" },
  "son_rhythmic_strikes": { category: "punch", id: "son_rhythmic_strikes" },
  "son_flowing_push": { category: "palm_strike", id: "son_flowing_push" },
  "son_elbow_strike": { category: "elbow_strike", id: "son_elbow_strike" },
  
  // Gam techniques
  "gam_water_counter": { category: "counter", id: "gam_water_counter" },
  "gam_redirect_throw": { category: "throw", id: "gam_redirect_throw" },
  "gam_hip_throw": { category: "throw", id: "gam_hip_throw" },
  "gam_flowing_block": { category: "block", id: "gam_flowing_block" },
  "gam_circular_parry": { category: "parry", id: "gam_circular_parry" },
  "gam_wrist_twist_counter": { category: "joint_lock", id: "gam_wrist_twist_counter" },
  
  // Gan techniques
  "gan_rock_defense": { category: "block", id: "gan_rock_defense" },
  "gan_immovable_stance": { category: "stance", id: "gan_immovable_stance" },
  "gan_iron_block": { category: "block_high", id: "gan_iron_block" },
  "gan_counter_strike": { category: "counter", id: "gan_counter_strike" },
  "gan_reversal_technique": { category: "counter", id: "gan_reversal_technique" },
  "gan_mountain_stance_lock": { category: "grapple", id: "gan_mountain_stance_lock" },
  
  // Gon techniques
  "gon_earth_embrace": { category: "grapple", id: "gon_earth_embrace" },
  "gon_leg_sweep": { category: "sweep", id: "gon_leg_sweep" },
  "gon_ground_grapple": { category: "grapple", id: "gon_ground_grapple" },
  "gon_ssireum_throw": { category: "throw", id: "gon_ssireum_throw" },
  "gon_body_lock_takedown": { category: "takedown", id: "gon_body_lock_takedown" },
  "gon_ankle_pick": { category: "sweep", id: "gon_ankle_pick" },
  "gon_sacrifice_throw": { category: "throw", id: "gon_sacrifice_throw" },
};

const techniquesDir = path.join(__dirname, 'src', 'systems', 'trigram', 'techniques');

// Files to update
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

console.log('=== Automated Technique Migration ===\n');

let totalUpdated = 0;

files.forEach(fileName => {
  const filePath = path.join(techniquesDir, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${fileName}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let updated = 0;
  
  // For each technique in this file, add the new fields
  Object.entries(migrations).forEach(([techId, { category, id }]) => {
    // Only process techniques that belong to this file
    const prefix = fileName.replace('Techniques.ts', '').toLowerCase();
    if (!techId.startsWith(prefix)) return;
    
    // Pattern to find: effects: [], followed by animationType (or other fields)
    // We want to insert BEFORE animationType line
    
    // Look for the technique definition
    const techniquePattern = new RegExp(
      `(id: "${techId}",[\\s\\S]*?effects: \\[\\],\\s*(?:\\/\\/[^\\n]*\\n\\s*)?)` +
      `((?:\\/\\/[^\\n]*\\n\\s*)?animationType:)`,
      'g'
    );
    
    const replacement = `$1// NEW ARCHITECTURE: Separate type (category) from ID (unique)\n    animationCategory: "${category}", // Type: shared category\n    animationId: "${id}", // ID: unique 1-1 mapping\n    // Legacy field for backward compatibility\n    $2`;
    
    const newContent = content.replace(techniquePattern, replacement);
    
    if (newContent !== content) {
      content = newContent;
      updated++;
    }
  });
  
  if (updated > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ ${fileName}: Updated ${updated} techniques`);
    totalUpdated += updated;
  } else {
    console.log(`⏭️  ${fileName}: No changes needed`);
  }
});

console.log(`\n=== Migration Complete ===`);
console.log(`Total techniques updated: ${totalUpdated}`);
console.log(`\nNext steps:`);
console.log(`1. Run: npm test TechniqueAnimationMapping.test.ts`);
console.log(`2. Verify all tests pass`);
console.log(`3. Commit changes`);
