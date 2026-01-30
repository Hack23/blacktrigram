#!/usr/bin/env python3
"""
Reliable Technique Migration Script
Add animationCategory and animationId to all techniques
"""

import re
import sys

# Migration data: technique_id -> (category, animation_id)
MIGRATIONS = {
    # Geon techniques
    "geon_heaven_strike": ("punch", "geon_heaven_strike"),
    "geon_heavenly_fist": ("punch", "geon_heavenly_fist"),
    "geon_frontal_kick": ("front_kick", "geon_frontal_kick"),
    "geon_roundhouse_kick": ("roundhouse_kick", "geon_roundhouse_kick"),
    "geon_axe_kick": ("axe_kick", "geon_axe_kick"),
    "geon_palm_strike": ("palm_strike", "geon_palm_strike"),
    "geon_elbow_smash": ("elbow_strike", "geon_elbow_smash"),
    
    # Tae techniques
    "tae_flowing_strikes": ("punch", "tae_flowing_strikes"),
    "tae_wrist_lock": ("joint_lock", "tae_wrist_lock"),
    "tae_small_circle": ("joint_lock", "tae_small_circle"),
    "tae_finger_lock": ("joint_lock", "tae_finger_lock"),
    "tae_elbow_lock": ("joint_lock", "tae_elbow_lock"),
    "tae_shoulder_lock": ("joint_lock", "tae_shoulder_lock"),
    "tae_arm_bar": ("joint_lock", "tae_arm_bar"),
    
    # Li techniques
    "li_flame_spear": ("palm_strike", "li_flame_spear"),
    "li_temple_strike": ("elbow_strike", "li_temple_strike"),
    "li_nerve_strike": ("nerve_strike", "li_nerve_strike"),
    "li_sidekick": ("side_kick", "li_sidekick"),
    "li_pressure_point": ("pressure_point", "li_pressure_point"),
    "li_solar_plexus_strike": ("palm_strike", "li_solar_plexus_strike"),
    
    # Jin techniques
    "jin_lightning_flash": ("punch", "jin_lightning_flash"),
    "jin_jumping_front_kick": ("jumping_kick", "jin_jumping_front_kick"),
    "jin_tornado_kick": ("tornado_kick", "jin_tornado_kick"),
    "jin_flying_sidekick": ("jumping_kick", "jin_flying_sidekick"),
    "jin_back_kick": ("back_kick", "jin_back_kick"),
    "jin_knee_strike": ("knee_strike", "jin_knee_strike"),
    
    # Son techniques (Note: added missing ones)
    "son_rapid_barrage": ("punch", "son_rapid_barrage"),
    "son_sweeping_low_kick": ("low_kick", "son_sweeping_low_kick"),
    "son_rapid_footwork": ("footwork", "son_rapid_footwork"),
    "son_rhythmic_strikes": ("punch", "son_rhythmic_strikes"),
    "son_flowing_push": ("palm_strike", "son_flowing_push"),
    "son_elbow_strike": ("elbow_strike", "son_elbow_strike"),
    "son_whirlwind_barrage": ("punch", "son_whirlwind_barrage"),  # ADDED
    "son_spinning_elbow": ("spinning_elbow", "son_spinning_elbow"),  # ADDED
    
    # Gam techniques
    "gam_water_counter": ("counter", "gam_water_counter"),
    "gam_redirect_throw": ("throw", "gam_redirect_throw"),
    "gam_hip_throw": ("throw", "gam_hip_throw"),
    "gam_flowing_block": ("block", "gam_flowing_block"),
    "gam_circular_parry": ("parry", "gam_circular_parry"),
    "gam_wrist_twist_counter": ("joint_lock", "gam_wrist_twist_counter"),
    
    # Gan techniques
    "gan_rock_defense": ("block", "gan_rock_defense"),
    "gan_immovable_stance": ("stance", "gan_immovable_stance"),
    "gan_iron_block": ("block_high", "gan_iron_block"),
    "gan_counter_strike": ("counter", "gan_counter_strike"),
    "gan_reversal_technique": ("counter", "gan_reversal_technique"),
    "gan_mountain_stance_lock": ("grapple", "gan_mountain_stance_lock"),
    
    # Gon techniques (Note: added missing one)
    "gon_earth_embrace": ("grapple", "gon_earth_embrace"),
    "gon_leg_sweep": ("sweep", "gon_leg_sweep"),
    "gon_ground_grapple": ("grapple", "gon_ground_grapple"),
    "gon_ssireum_throw": ("throw", "gon_ssireum_throw"),
    "gon_body_lock_takedown": ("takedown", "gon_body_lock_takedown"),
    "gon_ankle_pick": ("sweep", "gon_ankle_pick"),
    "gon_sacrifice_throw": ("throw", "gon_sacrifice_throw"),
    "gon_ground_pound": ("slam", "gon_ground_pound"),  # ADDED
}

def migrate_technique_file(filepath, tech_ids_for_file):
    """Migrate a single technique file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        updated_count = 0
        
        for tech_id in tech_ids_for_file:
            if tech_id not in MIGRATIONS:
                print(f"  ⚠️  No migration data for {tech_id}")
                continue
            
            category, anim_id = MIGRATIONS[tech_id]
            
            # Pattern: Find "effects: []," and insert our fields BEFORE "animationType:"
            # We want to match the specific technique section
            pattern = rf'(id: "{tech_id}".*?effects: \[\],\s*)((?://[^\n]*\n\s*)?animationType:)'
            
            replacement = (
                r'\1'
                r'// NEW ARCHITECTURE: Separate type (category) from ID (unique)\n    '
                rf'animationCategory: "{category}", // Type: shared category\n    '
                rf'animationId: "{anim_id}", // ID: unique 1-1 mapping\n    '
                r'// Legacy field for backward compatibility\n    '
                r'\2'
            )
            
            new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
            
            if new_content != content:
                content = new_content
                updated_count += 1
        
        if updated_count > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ {filepath.split('/')[-1]}: Updated {updated_count} techniques")
            return updated_count
        else:
            print(f"⏭️  {filepath.split('/')[-1]}: No changes needed")
            return 0
            
    except Exception as e:
        print(f"❌ Error processing {filepath}: {e}")
        return 0

def main():
    base_path = "src/systems/trigram/techniques"
    
    files_and_techniques = {
        f"{base_path}/GeonTechniques.ts": [k for k in MIGRATIONS.keys() if k.startswith('geon_')],
        f"{base_path}/TaeTechniques.ts": [k for k in MIGRATIONS.keys() if k.startswith('tae_')],
        f"{base_path}/LiTechniques.ts": [k for k in MIGRATIONS.keys() if k.startswith('li_')],
        f"{base_path}/JinTechniques.ts": [k for k in MIGRATIONS.keys() if k.startswith('jin_')],
        f"{base_path}/SonTechniques.ts": [k for k in MIGRATIONS.keys() if k.startswith('son_')],
        f"{base_path}/GamTechniques.ts": [k for k in MIGRATIONS.keys() if k.startswith('gam_')],
        f"{base_path}/GanTechniques.ts": [k for k in MIGRATIONS.keys() if k.startswith('gan_')],
        f"{base_path}/GonTechniques.ts": [k for k in MIGRATIONS.keys() if k.startswith('gon_')],
    }
    
    print("=== Reliable Technique Migration ===\n")
    
    total_updated = 0
    for filepath, tech_ids in files_and_techniques.items():
        count = migrate_technique_file(filepath, tech_ids)
        total_updated += count
    
    print(f"\n=== Migration Complete ===")
    print(f"Total techniques updated: {total_updated}")
    print(f"Total in migration data: {len(MIGRATIONS)}")
    print(f"\nNext steps:")
    print(f"1. Run: npm test TechniqueAnimationMapping.test.ts")
    print(f"2. Verify all tests pass")
    print(f"3. Commit changes")

if __name__ == "__main__":
    main()
