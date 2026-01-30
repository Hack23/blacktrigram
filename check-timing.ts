/**
 * Script to identify animations needing timing normalization
 */
import { ALL_ANIMATIONS } from './src/systems/animation/core/AnimationRegistry';

console.log('=== Animation Timing Analysis ===\n');

const needsTimingFix: Array<{name: string; firstTime: number; keyframeCount: number}> = [];
let startingAtZero = 0;
let total = 0;

for (const [name, anim] of ALL_ANIMATIONS) {
  if (anim.keyframes.length === 0) continue;
  
  total++;
  const firstTime = anim.keyframes[0].time;
  
  if (firstTime === 0) {
    startingAtZero++;
  } else {
    needsTimingFix.push({
      name,
      firstTime,
      keyframeCount: anim.keyframes.length
    });
  }
}

const ratio = startingAtZero / total;
console.log(`Current: ${startingAtZero}/${total} (${(ratio * 100).toFixed(1)}%) start at time 0`);
console.log(`Target: ${Math.ceil(total * 0.9)}/${total} (90.0%)`);
console.log(`Need to fix: ${needsTimingFix.length} animations\n`);

// Show sample animations that need fixing
console.log('Sample animations needing timing fix (first 20):');
needsTimingFix.slice(0, 20).forEach((anim, i) => {
  console.log(`  ${i + 1}. ${anim.name} - starts at ${anim.firstTime.toFixed(3)}s (${anim.keyframeCount} keyframes)`);
});

if (needsTimingFix.length > 20) {
  console.log(`  ... and ${needsTimingFix.length - 20} more`);
}

// Group by file (if we can infer from naming patterns)
console.log('\n=== Timing Fixes Grouped by Likely File ===');
const fileGroups = new Map<string, string[]>();

needsTimingFix.forEach(anim => {
  let file = 'unknown';
  if (anim.name.startsWith('geon_')) file = 'GeonStanceAnimations.ts';
  else if (anim.name.startsWith('tae_')) file = 'TaeStanceAnimations.ts';
  else if (anim.name.startsWith('li_')) file = 'LiStanceAnimations.ts or StanceAnimations.ts';
  else if (anim.name.startsWith('jin_')) file = 'JinStanceAnimations.ts';
  else if (anim.name.startsWith('son_')) file = 'SonStanceAnimations.ts';
  else if (anim.name.startsWith('gam_')) file = 'GamStanceAnimations.ts';
  else if (anim.name.startsWith('gan_')) file = 'GanStanceAnimations.ts or GanTechniqueAnimations.ts';
  else if (anim.name.startsWith('gon_')) file = 'GonStanceAnimations.ts';
  else if (anim.name.startsWith('darkops_')) file = 'DarkOpsAnimations.ts';
  else if (anim.name.startsWith('combo_')) file = 'ComboAnimations.ts';
  else if (anim.name.startsWith('movement_')) file = 'MovementAnimations.ts';
  else if (anim.name.includes('kick')) file = 'KickAnimations.ts';
  else if (anim.name.includes('punch') || anim.name.includes('jab') || anim.name.includes('cross')) file = 'PunchAnimations.ts';
  else if (anim.name.includes('elbow') || anim.name.includes('knee')) file = 'ElbowKneeAnimations.ts';
  else if (anim.name.includes('grappl') || anim.name.includes('throw') || anim.name.includes('lock')) file = 'GrapplingAnimations.ts';
  
  const existing = fileGroups.get(file) || [];
  existing.push(anim.name);
  fileGroups.set(file, existing);
});

Array.from(fileGroups.entries())
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([file, anims]) => {
    console.log(`\n${file}: ${anims.length} animations`);
    anims.slice(0, 5).forEach(name => console.log(`  - ${name}`));
    if (anims.length > 5) {
      console.log(`  ... and ${anims.length - 5} more`);
    }
  });
