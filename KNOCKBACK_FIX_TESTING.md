# Manual Testing Guide: Knockback Boundary Fix

## Overview
This fix ensures that players stay within the arena boundaries when hit with knockback effects (kicks, punches). Previously, strong knockback could push players outside the visible arena.

## What Was Fixed
- **Before**: Boundary checking used pixel coordinates instead of meter coordinates
- **After**: Boundary checking now correctly uses meter-based arena dimensions
- **Result**: Players are clamped to arena boundaries even with extreme knockback

## Test Scenarios

### Scenario 1: Normal Knockback (Should Work As Before)
**Setup:**
- Arena: Any size
- Position: Players at starting positions (near center)
- Action: Normal attacks (punches, light kicks)

**Expected Result:**
- Players receive knockback as normal
- Players stay well within arena boundaries
- No visible change from before

**How to Test:**
1. Start a combat match
2. Perform various attacks
3. Observe player positions after hits
4. ✅ Players should move naturally within arena

### Scenario 2: Heavy Knockback Near Edge (Main Fix)
**Setup:**
- Arena: 8m × 6m (tablet size, 768-1199px width)
- Position: Move one player near arena edge (walk to edge)
- Stance: Defender in Fire stance (☲ 리) - most vulnerable
- Balance: Get defender's balance low (< 40%) through repeated hits
- Action: Heavy kick or critical strike

**Expected Result:**
- Strong knockback applied (4-7 meters)
- Player pushed toward edge but stops at boundary
- Player does NOT disappear outside arena
- Player visible at arena edge after knockback

**How to Test:**
1. Start combat match
2. Player 1 walks toward right edge
3. Switch Player 1 to Fire stance (key: 3)
4. Player 2 attacks repeatedly to lower balance
5. When balance < 40%, Player 2 performs heavy kick
6. ✅ Player 1 should stop at arena edge, not go outside

### Scenario 3: Different Arena Sizes
**Setup:**
- Test on different screen sizes to trigger different arena sizes:
  - Mobile (< 768px): 6m × 4.5m arena
  - Tablet (768-1199px): 8m × 6m arena
  - Desktop (1200-1919px): 10m × 7.5m arena
  - Large (1920-2559px): 12m × 9m arena
  - Ultra (≥ 2560px): 14m × 10.5m arena

**Expected Result:**
- Knockback works correctly on all arena sizes
- Players always stay within visible boundaries
- Larger arenas allow more knockback before clamping

**How to Test:**
1. Resize browser window to different widths
2. Start combat match at each size
3. Perform heavy attacks near edges
4. ✅ Players should stay in bounds at all sizes

### Scenario 4: Extreme Case - Multiple Knockbacks
**Setup:**
- Arena: Small (6m) on mobile
- Position: Player near edge
- Action: Multiple heavy attacks in succession

**Expected Result:**
- Each knockback respects boundary
- Player remains at edge even with repeated hits
- No accumulation of out-of-bounds displacement

**How to Test:**
1. Use mobile screen size (< 768px)
2. Move player to arena edge
3. Perform 3-5 heavy attacks rapidly
4. ✅ Player should stay at boundary, not accumulate displacement

### Scenario 5: Knockback Toward Center (No Clamping)
**Setup:**
- Arena: Any size
- Position: Player at edge
- Direction: Attack pushes player toward center

**Expected Result:**
- Knockback moves player toward center
- No clamping needed (within bounds)
- Natural knockback feel

**How to Test:**
1. Position player at right edge
2. Attack from right side (pushes left/center)
3. ✅ Player should move naturally toward center

## Quick Test Checklist

- [ ] Normal attacks work as expected (center position)
- [ ] Heavy knockback near right edge - player stays in bounds
- [ ] Heavy knockback near left edge - player stays in bounds
- [ ] Heavy knockback near top edge - player stays in bounds
- [ ] Heavy knockback near bottom edge - player stays in bounds
- [ ] Test on mobile screen size (< 768px)
- [ ] Test on tablet screen size (768-1199px)
- [ ] Test on desktop screen size (1200-1919px)
- [ ] Players visible at all times during combat
- [ ] No visual glitches or position jumping

## What to Look For

### ✅ Good Signs (Fix Working)
- Players always visible within arena
- Knockback feels natural, just stops at edges
- No players outside arena boundaries
- Smooth position updates

### ❌ Bad Signs (Issues)
- Players disappear outside arena
- Players teleport/jump positions
- Knockback feels unnatural or janky
- Console errors related to positions

## Debugging

If you see issues:

1. **Check console for errors**
   - Press F12 to open developer tools
   - Look for position-related errors

2. **Check player positions**
   - Add console.log in CombatScreen3D.tsx
   - Log player positions after knockback
   - Verify they're within ±(worldWidthMeters/2)

3. **Check arena dimensions**
   - Log `arenaBounds.worldWidthMeters` and `worldDepthMeters`
   - Verify they match expected sizes for screen width

## Technical Details

**Coordinate System:**
- Origin (0, 0) at arena center
- X-axis: -worldWidthMeters/2 to +worldWidthMeters/2
- Z-axis (position.y): -worldDepthMeters/2 to +worldDepthMeters/2

**Example Calculation (8m arena):**
- Boundaries: X: -4m to +4m, Z: -3m to +3m
- Player at x=3.5m
- Knockback: +4.875m
- Result: 3.5 + 4.875 = 8.375m → clamped to 4.0m (boundary)

## Questions?

If you encounter any issues or unexpected behavior:
1. Check the console for errors
2. Verify arena size matches screen size
3. Test with different knockback strengths
4. Document steps to reproduce any issues
