/**
 * Script to identify animation duplicates
 */
import { ALL_ANIMATIONS } from './src/systems/animation/core/AnimationRegistry';

function getAnimationSignature(anim: any): string {
  // Create a signature based on keyframes
  return JSON.stringify(anim.keyframes.map((kf: any) => ({
    time: kf.time,
    rotations: Array.from(kf.boneRotations.entries()).sort(),
    positions: kf.bonePositions ? Array.from(kf.bonePositions.entries()).sort() : []
  })));
}

console.log('=== Finding Duplicate Animations ===\n');

const signatureMap = new Map<string, string[]>();
const emptyAnimations: string[] = [];
let startingAtZero = 0;
let total = 0;

for (const [name, anim] of ALL_ANIMATIONS) {
  // Check for empty animations
  if (anim.keyframes.length === 0) {
    emptyAnimations.push(name);
    continue;
  }
  
  // Check timing
  total++;
  if (anim.keyframes[0].time === 0) {
    startingAtZero++;
  }
  
  // Check for duplicates
  const sig = getAnimationSignature(anim);
  const existing = signatureMap.get(sig) || [];
  existing.push(name);
  signatureMap.set(sig, existing);
}

// Report empty animations
console.log(`Empty animations (0 keyframes): ${emptyAnimations.length}`);
if (emptyAnimations.length > 0) {
  console.log(emptyAnimations.slice(0, 10));
}

// Report timing
const ratio = startingAtZero / total;
console.log(`\nAnimations starting at time 0: ${startingAtZero}/${total} (${(ratio * 100).toFixed(1)}%)`);

// Report duplicates
const duplicateGroups = Array.from(signatureMap.values()).filter(group => group.length > 1);
console.log(`\n=== Duplicate Animation Groups: ${duplicateGroups.length} ===\n`);

let instanceCount = 0;
duplicateGroups.forEach((group, index) => {
  console.log(`${index + 1}. [${group.length} instances]`, group.slice(0, 5));
  if (group.length > 5) {
    console.log(`   ... and ${group.length - 5} more`);
  }
  instanceCount += group.length;
});

console.log(`\nTotal duplicate instances: ${instanceCount}`);
console.log(`Target: 0 duplicate groups`);
