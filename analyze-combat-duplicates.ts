/**
 * Identify combat technique duplicates that need unique body movements
 */
import { ALL_ANIMATIONS } from './src/systems/animation/core/AnimationRegistry';

function getAnimationSignature(anim: any): string {
  return JSON.stringify(anim.keyframes.map((kf: any) => ({
    time: kf.time,
    rotations: Array.from(kf.boneRotations.entries()).sort(),
  })));
}

console.log('=== Combat Technique Duplicate Analysis ===\n');

const signatureMap = new Map<string, string[]>();

for (const [name, anim] of ALL_ANIMATIONS) {
  if (anim.keyframes.length === 0) continue;
  
  const sig = getAnimationSignature(anim);
  const existing = signatureMap.get(sig) || [];
  existing.push(name);
  signatureMap.set(sig, existing);
}

// Find duplicates, excluding movement animations (left/right pairs are intentional)
const duplicateGroups = Array.from(signatureMap.values())
  .filter(group => group.length > 1)
  .map(group => ({
    animations: group,
    isCombat: group.some(name => 
      !name.startsWith('movement_') && 
      !name.endsWith('_left') && 
      !name.endsWith('_right')
    )
  }));

const combatDuplicates = duplicateGroups.filter(g => g.isCombat);
const movementDuplicates = duplicateGroups.filter(g => !g.isCombat);

console.log(`Total duplicate groups: ${duplicateGroups.length}`);
console.log(`Combat technique duplicates: ${combatDuplicates.length}`);
console.log(`Movement duplicates (intentional): ${movementDuplicates.length}\n`);

console.log('=== Combat Technique Duplicates (Need Unique Movements) ===\n');

combatDuplicates.forEach((group, i) => {
  console.log(`${i + 1}. ${group.animations.join(', ')}`);
  
  // Categorize by technique type
  const categories = {
    elbow: group.animations.filter(n => n.includes('elbow')),
    pressure: group.animations.filter(n => n.includes('pressure') || n.includes('nerve')),
    block: group.animations.filter(n => n.includes('block') || n.includes('parry') || n.includes('deflect')),
    throw: group.animations.filter(n => n.includes('throw') || n.includes('takedown')),
    lock: group.animations.filter(n => n.includes('lock')),
    strike: group.animations.filter(n => n.includes('strike') || n.includes('punch'))
  };
  
  Object.entries(categories).forEach(([cat, anims]) => {
    if (anims.length > 0) {
      console.log(`   ${cat}: ${anims.length} techniques`);
    }
  });
  console.log();
});

console.log('\n=== Recommendations for Korean Martial Arts Authenticity ===\n');

console.log('1. ELBOW TECHNIQUES (팔꿈치 기술):');
console.log('   Each should have distinct angles and body mechanics:');
console.log('   - 수평팔꿈치 (Horizontal Elbow): Shoulder-height, 90° angle');
console.log('   - 상향팔꿈치 (Upward Elbow): Rising from below, 45° upward');
console.log('   - 하향팔꿈치 (Downward Elbow): Descending from above, hammer-like');
console.log('   - 회전팔꿈치 (Spinning Elbow): Full body rotation, 180-360°');
console.log('   - 후방팔꿈치 (Reverse Elbow): Backward strike using rear arm\n');

console.log('2. PRESSURE POINT TECHNIQUES (급소 공격):');
console.log('   Each should target different vital points with unique angles:');
console.log('   - 관자놀이 (Temple Strike): Side angle, precise finger strike');
console.log('   - 명치 (Solar Plexus): Straight thrust, palm or knuckle');
console.log('   - 경동맥 (Carotid): Diagonal chop, knife-hand');
console.log('   - 신경총 (Nerve Cluster): Pinch-grip, specific joint angles');
console.log('   - 급소연타 (Multiple Points): Fast chain, different heights\n');

console.log('3. BLOCK TECHNIQUES (막기 기술):');
console.log('   Each should have distinct defensive mechanics:');
console.log('   - 상단막기 (High Block): Arms raised, protect head');
console.log('   - 중단막기 (Mid Block): Forearm across body, torso protection');
console.log('   - 하단막기 (Low Block): Downward sweep, leg protection');
console.log('   - 원형막기 (Circular Block): Flowing redirection');
console.log('   - 십자막기 (Cross Block): X-pattern, two-arm defense\n');

console.log('4. THROWING TECHNIQUES (던지기 기술):');
console.log('   Each should use different leverage points:');
console.log('   - 허리치기 (Hip Throw): Hip as fulcrum, over the shoulder');
console.log('   - 발걸기 (Leg Reap): Foot sweeps, off-balance');
console.log('   - 어깨던지기 (Shoulder Throw): Shoulder leverage, rotation');
console.log('   - 희생던지기 (Sacrifice Throw): Drop own weight, opponent flies\n');
