/**
 * Quick check script for gan_immovable_stance animation
 */
import { GAN_IMMOVABLE_STANCE_ANIMATION } from './src/systems/animation/catalogs/StanceAnimations';
import { ALL_ANIMATIONS } from './src/systems/animation/core/AnimationRegistry';

console.log('=== Checking GAN_IMMOVABLE_STANCE_ANIMATION ===');
console.log('Name:', GAN_IMMOVABLE_STANCE_ANIMATION.name);
console.log('Korean Name:', GAN_IMMOVABLE_STANCE_ANIMATION.koreanName);
console.log('Duration:', GAN_IMMOVABLE_STANCE_ANIMATION.duration);
console.log('Loop:', GAN_IMMOVABLE_STANCE_ANIMATION.loop);
console.log('Keyframes count:', GAN_IMMOVABLE_STANCE_ANIMATION.keyframes.length);
console.log('Keyframes:', GAN_IMMOVABLE_STANCE_ANIMATION.keyframes.map(kf => ({
  time: kf.time,
  boneRotations: kf.boneRotations.size,
  bonePositions: kf.bonePositions?.size || 0
})));

console.log('\n=== Checking in ALL_ANIMATIONS registry ===');
const registered = ALL_ANIMATIONS.get('gan_immovable_stance');
if (registered) {
  console.log('Found in registry!');
  console.log('Name:', registered.name);
  console.log('Keyframes count:', registered.keyframes.length);
} else {
  console.log('NOT FOUND in registry!');
}

console.log('\n=== Checking for animations with 0 keyframes ===');
const emptyAnimations: string[] = [];
for (const [name, anim] of ALL_ANIMATIONS) {
  if (anim.keyframes.length === 0) {
    emptyAnimations.push(name);
  }
}
console.log('Empty animations:', emptyAnimations);
