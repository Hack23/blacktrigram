#!/usr/bin/env tsx
/**
 * Complete Technique Migration Fix
 * 
 * Fixes the partial migration by:
 * 1. Consolidating categories from 27 to 15
 * 2. Ensuring each technique has unique animationId matching its id
 * 3. Updating all 51 techniques correctly
 */

import * as fs from 'fs';
import * as path from 'path';

// Consolidated proper categories (15 total)
const properCategories: Record<string, string> = {
  // Kicks - consolidate all kick types
  "front_kick": "kick",
  "roundhouse_kick": "kick",
  "axe_kick": "kick",
  "side_kick": "kick",
  "back_kick": "kick",
  "low_kick": "kick",
  "tornado_kick": "kick",
  "jumping_kick": "jumping_kick", // Keep separate for jumping variants
  
  // Strikes - consolidate palm/nerve/pressure point
  "palm_strike": "strike",
  "nerve_strike": "strike",
  "pressure_point": "strike",
  
  // Defensive - consolidate blocks/parry
  "block": "defensive",
  "block_high": "defensive",
  "parry": "defensive",
  
  // Keep these as-is (already proper categories)
  "punch": "punch",
  "joint_lock": "joint_lock",
  "throw": "throw",
  "grapple": "grapple",
  "sweep": "sweep",
  "takedown": "takedown",
  "counter": "counter",
  "elbow_strike": "elbow_strike",
  "knee_strike": "knee_strike",
  "stance": "stance",
  "footwork": "footwork",
};

// Complete migration data with consolidated categories
const migrations: Record<string, { category: string; id: string }> = {
  // Geon techniques (Heaven - Direct Force)
  "geon_heaven_strike": { category: "punch", id: "geon_heaven_strike" },
  "geon_heavenly_fist": { category: "punch", id: "geon_heavenly_fist" },
  "geon_frontal_kick": { category: "kick", id: "geon_frontal_kick" },
  "geon_roundhouse_kick": { category: "kick", id: "geon_roundhouse_kick" },
  "geon_axe_kick": { category: "kick", id: "geon_axe_kick" },
  "geon_palm_strike": { category: "strike", id: "geon_palm_strike" },
  "geon_elbow_smash": { category: "elbow_strike", id: "geon_elbow_smash" },
  
  // Tae techniques (Lake - Flowing Circular)
  "tae_flowing_strikes": { category: "punch", id: "tae_flowing_strikes" },
  "tae_wrist_lock": { category: "joint_lock", id: "tae_wrist_lock" },
  "tae_small_circle": { category: "joint_lock", id: "tae_small_circle" },
  "tae_finger_lock": { category: "joint_lock", id: "tae_finger_lock" },
  "tae_elbow_lock": { category: "joint_lock", id: "tae_elbow_lock" },
  "tae_shoulder_lock": { category: "joint_lock", id: "tae_shoulder_lock" },
  "tae_arm_bar": { category: "joint_lock", id: "tae_arm_bar" },
  
  // Li techniques (Fire - Precision Strikes)
  "li_flame_spear": { category: "strike", id: "li_flame_spear" },
  "li_temple_strike": { category: "elbow_strike", id: "li_temple_strike" },
  "li_nerve_strike": { category: "strike", id: "li_nerve_strike" },
  "li_sidekick": { category: "kick", id: "li_sidekick" },
  "li_pressure_point": { category: "strike", id: "li_pressure_point" },
  "li_solar_plexus_strike": { category: "strike", id: "li_solar_plexus_strike" },
  
  // Jin techniques (Thunder - Explosive Power)
  "jin_lightning_flash": { category: "punch", id: "jin_lightning_flash" },
  "jin_jumping_front_kick": { category: "jumping_kick", id: "jin_jumping_front_kick" },
  "jin_tornado_kick": { category: "kick", id: "jin_tornado_kick" },
  "jin_flying_sidekick": { category: "jumping_kick", id: "jin_flying_sidekick" },
  "jin_back_kick": { category: "kick", id: "jin_back_kick" },
  "jin_knee_strike": { category: "knee_strike", id: "jin_knee_strike" },
  
  // Son techniques (Wind - Continuous Pressure)
  "son_rapid_barrage": { category: "punch", id: "son_rapid_barrage" },
  "son_sweeping_low_kick": { category: "kick", id: "son_sweeping_low_kick" },
  "son_rapid_footwork": { category: "footwork", id: "son_rapid_footwork" },
  "son_rhythmic_strikes": { category: "punch", id: "son_rhythmic_strikes" },
  "son_flowing_push": { category: "strike", id: "son_flowing_push" },
  "son_elbow_strike": { category: "elbow_strike", id: "son_elbow_strike" },
  
  // Gam techniques (Water - Yielding Redirection)
  "gam_water_counter": { category: "counter", id: "gam_water_counter" },
  "gam_redirect_throw": { category: "throw", id: "gam_redirect_throw" },
  "gam_hip_throw": { category: "throw", id: "gam_hip_throw" },
  "gam_flowing_block": { category: "defensive", id: "gam_flowing_block" },
  "gam_circular_parry": { category: "defensive", id: "gam_circular_parry" },
  "gam_wrist_twist_counter": { category: "joint_lock", id: "gam_wrist_twist_counter" },
  
  // Gan techniques (Mountain - Immovable Defense)
  "gan_rock_defense": { category: "defensive", id: "gan_rock_defense" },
  "gan_immovable_stance": { category: "stance", id: "gan_immovable_stance" },
  "gan_iron_block": { category: "defensive", id: "gan_iron_block" },
  "gan_counter_strike": { category: "counter", id: "gan_counter_strike" },
  "gan_reversal_technique": { category: "counter", id: "gan_reversal_technique" },
  "gan_mountain_stance_lock": { category: "grapple", id: "gan_mountain_stance_lock" },
  
  // Gon techniques (Earth - Grounding Control)
  "gon_earth_embrace": { category: "grapple", id: "gon_earth_embrace" },
  "gon_leg_sweep": { category: "sweep", id: "gon_leg_sweep" },
  "gon_ground_grapple": { category: "grapple", id: "gon_ground_grapple" },
  "gon_ssireum_throw": { category: "throw", id: "gon_ssireum_throw" },
  "gon_body_lock_takedown": { category: "takedown", id: "gon_body_lock_takedown" },
  "gon_ankle_pick": { category: "sweep", id: "gon_ankle_pick" },
  "gon_sacrifice_throw": { category: "throw", id: "gon_sacrifice_throw" },
};

const techniquesDir = path.join(process.cwd(), 'src', 'systems', 'trigram', 'techniques');

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

console.log('=== Complete Technique Migration Fix ===\n');

let totalUpdated = 0;
let totalAlreadyMigrated = 0;

files.forEach(fileName => {
  const filePath = path.join(techniquesDir, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${fileName}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let updated = 0;
  let alreadyMigrated = 0;
  
  // For each technique in this file, add the new fields
  Object.entries(migrations).forEach(([techId, { category, id }]) => {
    // Only process techniques that belong to this file
    const prefix = fileName.replace('Techniques.ts', '').toLowerCase();
    if (!techId.startsWith(prefix)) return;
    
    // Check if already migrated
    if (content.includes(`animationId: "${id}"`)) {
      alreadyMigrated++;
      return;
    }
    
    // Pattern: Find technique by ID, then find effects: [], then add fields before animationType
    const techniquePattern = new RegExp(
      `(id: "${techId}",\\s*[\\s\\S]*?effects: \\[\\],\\s*)` +
      `((?:\\/\\/[^\\n]*\\n\\s*)?animationType:)`,
      'g'
    );
    
    const replacement = `$1// NEW ARCHITECTURE: Category (type) + ID (unique 1-1 mapping)
    animationCategory: "${category}", // Shared category
    animationId: "${id}", // Unique ID matching technique
    // Legacy:
    $2`;
    
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
  }
  
  if (alreadyMigrated > 0) {
    console.log(`✓  ${fileName}: ${alreadyMigrated} already migrated`);
    totalAlreadyMigrated += alreadyMigrated;
  }
  
  if (updated === 0 && alreadyMigrated === 0) {
    console.log(`⏭️  ${fileName}: No changes needed`);
  }
});

console.log(`\n=== Migration Complete ===`);
console.log(`Total techniques updated: ${totalUpdated}`);
console.log(`Total already migrated: ${totalAlreadyMigrated}`);
console.log(`Grand total: ${totalUpdated + totalAlreadyMigrated}`);

console.log(`\n=== Category Consolidation ===`);
const categories = new Set(Object.values(migrations).map(m => m.category));
console.log(`Categories used: ${categories.size}`);
console.log(`Categories: ${Array.from(categories).sort().join(', ')}`);

console.log(`\n=== Next Steps ===`);
console.log(`1. Run: npm test TechniqueAnimationMapping.test.ts`);
console.log(`2. Verify all 7 tests pass`);
console.log(`3. Commit changes`);
