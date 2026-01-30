/**
 * Automated timing normalization script
 * 
 * This script normalizes animation timing by ensuring all animations start at time 0.
 * For each animation that starts at a non-zero time, it subtracts that offset from
 * all keyframe times, preserving the relative timing between keyframes.
 */

import * as fs from 'fs';
import * as path from 'path';

interface FileEdit {
  file: string;
  animations: Array<{
    name: string;
    pattern: RegExp;
    offset: number;
  }>;
}

// Map of files to animations that need timing fixes
// Based on our analysis from check-timing.ts
const FILE_EDITS: FileEdit[] = [
  // We'll process files in order of impact (most animations first)
  {
    file: 'src/systems/animation/catalogs/ComboAnimations.ts',
    animations: [] // Will be populated programmatically
  },
  {
    file: 'src/systems/animation/catalogs/DarkOpsAnimations.ts',
    animations: []
  },
  {
    file: 'src/systems/animation/catalogs/MovementAnimations.ts',
    animations: []
  },
  // Add more files as needed
];

/**
 * Process a single file to normalize timing
 */
function normalizeFileTimings(filePath: string): void {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  let changesCount = 0;

  // Pattern to match .at(number) calls
  // We look for patterns like:
  // .at(0.150)  or  .at(0.15)  or  .at(0.1)
  const atPattern = /\.at\((\d+\.?\d*)\)/g;

  // Find all animation builder chains in the file
  // Pattern: MartialArtsAnimationBuilder.create(...) ... .build();
  const animationPattern = /MartialArtsAnimationBuilder\.create\([^)]+\)([\s\S]*?)\.build\(\);/g;

  let match;
  const animations: Array<{start: number; end: number; content: string; firstTime: number | null}> = [];

  while ((match = animationPattern.exec(content)) !== null) {
    const animStart = match.index;
    const animEnd = animStart + match[0].length;
    const animContent = match[0];

    // Find first .at() call in this animation
    const atMatch = atPattern.exec(animContent);
    atPattern.lastIndex = 0; // Reset regex

    if (atMatch) {
      const firstTime = parseFloat(atMatch[1]);
      animations.push({
        start: animStart,
        end: animEnd,
        content: animContent,
        firstTime: firstTime > 0 ? firstTime : null
      });
    }
  }

  // Process animations in reverse order (to preserve indices)
  animations.reverse();

  for (const anim of animations) {
    if (anim.firstTime === null || anim.firstTime === 0) {
      continue; // Already starts at 0
    }

    const offset = anim.firstTime;
    let newContent = anim.content;

    // Replace all .at(X) with .at(X - offset)
    newContent = newContent.replace(/\.at\((\d+\.?\d*)\)/g, (match, timeStr) => {
      const time = parseFloat(timeStr);
      const newTime = time - offset;
      // Format to 2 decimal places, removing trailing zeros
      const formatted = newTime.toFixed(3).replace(/\.?0+$/, '');
      return `.at(${formatted === '' || formatted === '-0' ? '0' : formatted})`;
    });

    // Replace in content
    content = content.substring(0, anim.start) + newContent + content.substring(anim.end);
    changesCount++;
  }

  if (changesCount > 0) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Normalized ${changesCount} animations in ${filePath}`);
  } else {
    console.log(`⏭️  No changes needed in ${filePath}`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('=== Animation Timing Normalization ===\n');
  console.log('This script will normalize animation timing by ensuring all animations start at time 0.\n');

  // Get all animation catalog files
  const catalogDir = path.join(process.cwd(), 'src/systems/animation/catalogs');
  const files = fs.readdirSync(catalogDir)
    .filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts'))
    .map(f => `src/systems/animation/catalogs/${f}`);

  console.log(`Found ${files.length} animation catalog files to process\n`);

  for (const file of files) {
    try {
      normalizeFileTimings(file);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  console.log('\n✅ Timing normalization complete!');
  console.log('\nNext steps:');
  console.log('1. Run: npm test -- --run');
  console.log('2. Verify animations still work correctly');
  console.log('3. Commit changes if tests pass');
}

main().catch(console.error);
