/**
 * Generate timing normalization edits for animations
 * 
 * This script identifies animations that don't start at time 0 and generates
 * the code changes needed to normalize them.
 */
import { ALL_ANIMATIONS } from './src/systems/animation/core/AnimationRegistry';
import * as fs from 'fs';
import * as path from 'path';

interface AnimationTimingFix {
  name: string;
  file: string;
  firstTime: number;
  keyframes: Array<{time: number}>;
}

console.log('=== Generating Timing Normalization Plan ===\n');

const fixes: AnimationTimingFix[] = [];

for (const [name, anim] of ALL_ANIMATIONS) {
  if (anim.keyframes.length === 0) continue;
  
  const firstTime = anim.keyframes[0].time;
  
  if (firstTime !== 0) {
    // Determine likely file
    let file = '';
    if (name.startsWith('geon_')) file = 'src/systems/animation/catalogs/GeonStanceAnimations.ts';
    else if (name.startsWith('tae_')) file = 'src/systems/animation/catalogs/TaeStanceAnimations.ts';
    else if (name.startsWith('li_')) file = 'src/systems/animation/catalogs/LiTechniqueAnimations.ts';
    else if (name.startsWith('jin_')) file = 'src/systems/animation/catalogs/JinTechniqueAnimations.ts';
    else if (name.startsWith('son_')) file = 'src/systems/animation/catalogs/SonTechniqueAnimations.ts';
    else if (name.startsWith('gam_')) file = 'src/systems/animation/catalogs/GamTechniqueAnimations.ts';
    else if (name.startsWith('gan_')) file = 'src/systems/animation/catalogs/GanTechniqueAnimations.ts';
    else if (name.startsWith('gon_')) file = 'src/systems/animation/catalogs/StanceAnimations.ts';
    else if (name.startsWith('darkops_')) file = 'src/systems/animation/catalogs/DarkOpsAnimations.ts';
    else if (name.startsWith('combo_')) file = 'src/systems/animation/catalogs/ComboAnimations.ts';
    else if (name.startsWith('movement_')) file = 'src/systems/animation/catalogs/MovementAnimations.ts';
    else if (name.includes('kick')) file = 'src/systems/animation/catalogs/KickAnimations.ts';
    else if (name.match(/jab|cross|hook|uppercut|punch|backfist|hammer|palm_strike|overhand/)) file = 'src/systems/animation/catalogs/PunchAnimations.ts';
    else if (name.match(/elbow|knee/)) file = 'src/systems/animation/catalogs/ElbowKneeAnimations.ts';
    else if (name.match(/grappl|throw|lock|sweep|takedown|arm_bar|shoulder|wrist|hip_throw|suplex|slam/)) file = 'src/systems/animation/catalogs/GrapplingAnimations.ts';
    else file = 'src/systems/animation/catalogs/AttackAnimations.ts';
    
    fixes.push({
      name,
      file,
      firstTime,
      keyframes: anim.keyframes.map(kf => ({ time: kf.time }))
    });
  }
}

console.log(`Found ${fixes.length} animations needing timing normalization\n`);

// Group by file
const byFile = new Map<string, AnimationTimingFix[]>();
fixes.forEach(fix => {
  const existing = byFile.get(fix.file) || [];
  existing.push(fix);
  byFile.set(fix.file, existing);
});

console.log('=== Animations to Fix by File ===\n');
Array.from(byFile.entries())
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([file, fixes]) => {
    console.log(`${path.basename(file)}: ${fixes.length} animations`);
    fixes.slice(0, 3).forEach(fix => {
      const normalized = fix.keyframes.map(kf => (kf.time - fix.firstTime).toFixed(3)).join(', ');
      console.log(`  ${fix.name}: [${fix.keyframes.map(kf => kf.time.toFixed(3)).join(', ')}] → [${normalized}]`);
    });
    if (fixes.length > 3) {
      console.log(`  ... and ${fixes.length - 3} more`);
    }
    console.log();
  });

console.log('\n=== Implementation Strategy ===');
console.log('To normalize timing, for each animation:');
console.log('1. Find the first keyframe time (offset)');
console.log('2. Subtract offset from all keyframe times in that animation');
console.log('3. This shifts the animation to start at time 0');
console.log('\nExample for an animation starting at 0.100s:');
console.log('  Before: .at(0.1) .at(0.25) .at(0.4)');
console.log('  After:  .at(0) .at(0.15) .at(0.3)');
console.log('\nThis is a mechanical transformation that preserves animation behavior.');
