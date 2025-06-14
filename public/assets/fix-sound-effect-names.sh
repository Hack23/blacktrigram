#!/bin/bash
# filepath: bulletproof_rename.sh

# Simple file-by-file renaming - no arrays, no complex logic
echo "🥋 Black Trigram (흑괘) SFX Renaming - BULLETPROOF VERSION"
echo "========================================================="

count=0

# Direct file processing - one at a time
echo "🎵 Processing MP3 files..."

# Process attack sounds
for file in 11L-attack_critical_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> attack_critical_$((++count)).mp3"; mv "$file" "attack_critical_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-attack_light_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> attack_light_$((++count)).mp3"; mv "$file" "attack_light_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-attack_medium_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> attack_medium_$((++count)).mp3"; mv "$file" "attack_medium_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-attack_punch_light_*.mp3; do [[ -f "$file" ]] && { echo "  $file -> attack_punch_light_$((++count)).mp3"; mv "$file" "attack_punch_light_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-attack_punch_medium*.mp3; do [[ -f "$file" ]] && { echo "  $file -> attack_punch_medium_$((++count)).mp3"; mv "$file" "attack_punch_medium_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-attack_special_geon*.mp3; do [[ -f "$file" ]] && { echo "  $file -> attack_special_geon_$((++count)).mp3"; mv "$file" "attack_special_geon_$count.mp3" 2>/dev/null || true; }; done; count=0

# Process hit sounds
for file in 11L-hit_block_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> hit_block_$((++count)).mp3"; mv "$file" "hit_block_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-hit_critical_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> hit_critical_$((++count)).mp3"; mv "$file" "hit_critical_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-hit_flesh_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> hit_flesh_$((++count)).mp3"; mv "$file" "hit_flesh_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-hit_heavy_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> hit_heavy_$((++count)).mp3"; mv "$file" "hit_heavy_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-hit_light_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> hit_light_$((++count)).mp3"; mv "$file" "hit_light_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-hit_medium_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> hit_medium_$((++count)).mp3"; mv "$file" "hit_medium_$count.mp3" 2>/dev/null || true; }; done; count=0

# Process block sounds
for file in 11L-block_break_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> block_break_$((++count)).mp3"; mv "$file" "block_break_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-block_success_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> block_success_$((++count)).mp3"; mv "$file" "block_success_$count.mp3" 2>/dev/null || true; }; done; count=0

# Process menu sounds
for file in 11L-hover_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> menu_hover_$((++count)).mp3"; mv "$file" "menu_hover_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-back_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> menu_back_$((++count)).mp3"; mv "$file" "menu_back_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-menu_click_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> menu_click_$((++count)).mp3"; mv "$file" "menu_click_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-select_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> menu_select_$((++count)).mp3"; mv "$file" "menu_select_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-menu_navigate_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> menu_navigate_$((++count)).mp3"; mv "$file" "menu_navigate_$count.mp3" 2>/dev/null || true; }; done; count=0

# Process combat sounds
for file in 11L-dodge_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> dodge_$((++count)).mp3"; mv "$file" "dodge_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-perfect_strike_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> perfect_strike_$((++count)).mp3"; mv "$file" "perfect_strike_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-stance_change_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> stance_change_$((++count)).mp3"; mv "$file" "stance_change_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-footstep_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> footstep_$((++count)).mp3"; mv "$file" "footstep_$count.mp3" 2>/dev/null || true; }; done; count=0

# Process match sounds
for file in 11L-match_end_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> match_end_$((++count)).mp3"; mv "$file" "match_end_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-match_start_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> match_start_$((++count)).mp3"; mv "$file" "match_start_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-countdown_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> countdown_$((++count)).mp3"; mv "$file" "countdown_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-victory_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> victory_$((++count)).mp3"; mv "$file" "victory_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-defeat_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> defeat_$((++count)).mp3"; mv "$file" "defeat_$count.mp3" 2>/dev/null || true; }; done; count=0

# Process energy sounds
for file in 11L-ki_charge_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> ki_charge_$((++count)).mp3"; mv "$file" "ki_charge_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-ki_release_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> ki_release_$((++count)).mp3"; mv "$file" "ki_release_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-energy_pulse_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> energy_pulse_$((++count)).mp3"; mv "$file" "energy_pulse_$count.mp3" 2>/dev/null || true; }; done; count=0

# Process combo sounds
for file in 11L-combo_buildup_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> combo_buildup_$((++count)).mp3"; mv "$file" "combo_buildup_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-combo_finish_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> combo_finish_$((++count)).mp3"; mv "$file" "combo_finish_$count.mp3" 2>/dev/null || true; }; done; count=0

# Process status sounds
for file in 11L-health_low_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> health_low_$((++count)).mp3"; mv "$file" "health_low_$count.mp3" 2>/dev/null || true; }; done; count=0
for file in 11L-stamina_depleted_SFX*.mp3; do [[ -f "$file" ]] && { echo "  $file -> stamina_depleted_$((++count)).mp3"; mv "$file" "stamina_depleted_$count.mp3" 2>/dev/null || true; }; done; count=0

# Process special sounds
for file in 11L-body_realistic_sound*.mp3; do [[ -f "$file" ]] && { echo "  $file -> body_realistic_sound_$((++count)).mp3"; mv "$file" "body_realistic_sound_$count.mp3" 2>/dev/null || true; }; done; count=0

echo ""
echo "🎵 Processing WEBM files..."

# Repeat for WEBM files
for file in 11L-attack_critical_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> attack_critical_$((++count)).webm"; mv "$file" "attack_critical_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-attack_light_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> attack_light_$((++count)).webm"; mv "$file" "attack_light_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-attack_medium_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> attack_medium_$((++count)).webm"; mv "$file" "attack_medium_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-attack_punch_light_*.webm; do [[ -f "$file" ]] && { echo "  $file -> attack_punch_light_$((++count)).webm"; mv "$file" "attack_punch_light_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-attack_punch_medium*.webm; do [[ -f "$file" ]] && { echo "  $file -> attack_punch_medium_$((++count)).webm"; mv "$file" "attack_punch_medium_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-attack_special_geon*.webm; do [[ -f "$file" ]] && { echo "  $file -> attack_special_geon_$((++count)).webm"; mv "$file" "attack_special_geon_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-hit_block_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> hit_block_$((++count)).webm"; mv "$file" "hit_block_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-hit_critical_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> hit_critical_$((++count)).webm"; mv "$file" "hit_critical_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-hit_flesh_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> hit_flesh_$((++count)).webm"; mv "$file" "hit_flesh_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-hit_heavy_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> hit_heavy_$((++count)).webm"; mv "$file" "hit_heavy_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-hit_light_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> hit_light_$((++count)).webm"; mv "$file" "hit_light_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-hit_medium_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> hit_medium_$((++count)).webm"; mv "$file" "hit_medium_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-block_break_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> block_break_$((++count)).webm"; mv "$file" "block_break_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-block_success_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> block_success_$((++count)).webm"; mv "$file" "block_success_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-hover_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> menu_hover_$((++count)).webm"; mv "$file" "menu_hover_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-back_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> menu_back_$((++count)).webm"; mv "$file" "menu_back_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-menu_click_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> menu_click_$((++count)).webm"; mv "$file" "menu_click_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-select_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> menu_select_$((++count)).webm"; mv "$file" "menu_select_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-menu_navigate_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> menu_navigate_$((++count)).webm"; mv "$file" "menu_navigate_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-dodge_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> dodge_$((++count)).webm"; mv "$file" "dodge_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-perfect_strike_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> perfect_strike_$((++count)).webm"; mv "$file" "perfect_strike_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-stance_change_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> stance_change_$((++count)).webm"; mv "$file" "stance_change_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-footstep_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> footstep_$((++count)).webm"; mv "$file" "footstep_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-match_end_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> match_end_$((++count)).webm"; mv "$file" "match_end_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-match_start_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> match_start_$((++count)).webm"; mv "$file" "match_start_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-countdown_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> countdown_$((++count)).webm"; mv "$file" "countdown_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-victory_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> victory_$((++count)).webm"; mv "$file" "victory_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-defeat_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> defeat_$((++count)).webm"; mv "$file" "defeat_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-ki_charge_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> ki_charge_$((++count)).webm"; mv "$file" "ki_charge_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-ki_release_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> ki_release_$((++count)).webm"; mv "$file" "ki_release_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-energy_pulse_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> energy_pulse_$((++count)).webm"; mv "$file" "energy_pulse_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-combo_buildup_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> combo_buildup_$((++count)).webm"; mv "$file" "combo_buildup_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-combo_finish_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> combo_finish_$((++count)).webm"; mv "$file" "combo_finish_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-health_low_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> health_low_$((++count)).webm"; mv "$file" "health_low_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-stamina_depleted_SFX*.webm; do [[ -f "$file" ]] && { echo "  $file -> stamina_depleted_$((++count)).webm"; mv "$file" "stamina_depleted_$count.webm" 2>/dev/null || true; }; done; count=0
for file in 11L-body_realistic_sound*.webm; do [[ -f "$file" ]] && { echo "  $file -> body_realistic_sound_$((++count)).webm"; mv "$file" "body_realistic_sound_$count.webm" 2>/dev/null || true; }; done; count=0

echo ""
echo "✅ BULLETPROOF RENAMING COMPLETE!"
echo "================================="

# Show results
echo "🎵 AudioManager-ready files:"
ls -1 *.mp3 *.webm 2>/dev/null | grep -E '^[a-z_]+_[1-4]\.(mp3|webm)$' | wc -l | xargs echo "Total converted:"

echo ""
echo "🥋 Black Trigram (흑괘) SFX files ready for integration!"
