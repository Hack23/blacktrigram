# Screenshot Timing Guide

## Overview

This document explains the timing strategy for the screenshot capture workflow in Black Trigram. The workflow uses Playwright to capture screenshots of all major screens for UI/UX analysis.

## Problem Statement

Black Trigram uses Three.js with @react-three/fiber and Html overlays from @react-three/drei. Html overlays render **after** the canvas, which can cause screenshots to be taken before content is fully visible.

**Common Issue**: Menu sometimes appears as "just lines" because the Html overlay hasn't finished rendering when the screenshot is captured.

## Timing Strategy

### Core Principles

1. **Wait for Three.js Canvas**: Ensure WebGL context is initialized
2. **Wait for Html Overlays**: Critical - these render after the canvas
3. **Wait for Animations**: CSS transitions and animations need time to settle
4. **Wait for Network**: Ensure all assets are loaded
5. **Wait for Render Cycles**: Use requestAnimationFrame to ensure DOM is stable

### Timing Constants

```typescript
const TIMING = {
  CANVAS_TIMEOUT: 15000,           // Max wait for canvas element
  INITIAL_RENDER_DELAY: 2500,      // Wait for initial Three.js render
  ANIMATION_SETTLE_DELAY: 2000,    // Wait for animations to settle
  BUTTON_CLICK_DELAY: 3000,        // Wait after button clicks
  CONTENT_LOAD_DELAY: 4000,        // Wait for dynamic content to load
  RETRY_DELAY: 2500,               // Delay between retries
  HTML_OVERLAY_DELAY: 4000,        // Wait for Html overlays (CRITICAL)
  SCREEN_TRANSITION_DELAY: 5000,   // Wait for screen transitions
  RAF_CYCLES: 3,                   // requestAnimationFrame cycles
};
```

### Rationale for Each Timing

#### `CANVAS_TIMEOUT` (15000ms)
- **Purpose**: Maximum time to wait for canvas element to appear
- **Why 15s**: Allows for slow CI environments and cold starts
- **Failure Mode**: If canvas doesn't appear in 15s, something is broken

#### `INITIAL_RENDER_DELAY` (2500ms)
- **Purpose**: Wait for Three.js to complete initial render
- **Why 2.5s**: Three.js needs time to:
  - Initialize WebGL context
  - Load shaders
  - Render first frame
  - Apply materials
- **Increased from**: 2000ms (insufficient for complex scenes)

#### `ANIMATION_SETTLE_DELAY` (2000ms)
- **Purpose**: Let CSS transitions and animations complete
- **Why 2s**: Standard CSS transitions in the app are 0.3-0.5s
- **Buffer**: 4x longer than longest animation
- **Increased from**: 1500ms (animations were cut off)

#### `BUTTON_CLICK_DELAY` (3000ms)
- **Purpose**: Wait after button clicks for UI to respond
- **Why 3s**: Accounts for:
  - Event propagation
  - State updates in React
  - Screen transitions
  - Html overlay re-rendering
- **Increased from**: 2500ms (transitions were incomplete)

#### `CONTENT_LOAD_DELAY` (4000ms)
- **Purpose**: Wait for dynamic content to load
- **Why 4s**: Allows for:
  - Lazy-loaded components
  - Data fetching (if any)
  - Html overlay positioning
  - Font loading
- **Increased from**: 3000ms (content validation was failing)

#### `RETRY_DELAY` (2500ms)
- **Purpose**: Delay between content validation retries
- **Why 2.5s**: Give React time to:
  - Complete state updates
  - Re-render components
  - Update Html overlays
- **Increased from**: 2000ms (retries too fast)

#### `HTML_OVERLAY_DELAY` (4000ms) - **MOST CRITICAL**
- **Purpose**: Wait specifically for Html overlays to render
- **Why 4s**: Html overlays from @react-three/drei:
  - Render **after** the canvas
  - Depend on Three.js scene coordinates
  - Need React reconciliation
  - Require CSS layout calculations
- **This is the key fix**: Menu "just lines" issue
- **Increased from**: 3000ms (overlays not fully rendered)

#### `SCREEN_TRANSITION_DELAY` (5000ms)
- **Purpose**: Wait for screen transitions with lazy loading
- **Why 5s**: Screen transitions involve:
  - Unmounting previous screen
  - Lazy loading new screen component
  - Initializing new Three.js scene
  - Rendering new Html overlays
  - CSS transition effects
- **Increased from**: 4000ms (screens not fully loaded)

#### `RAF_CYCLES` (3 cycles)
- **Purpose**: Wait for multiple requestAnimationFrame cycles
- **Why 3 cycles**: Ensures:
  - DOM is updated
  - Layout is calculated
  - Paint is complete
  - Minimal overhead (3 frames = ~50ms at 60fps)

## Screenshot Capture Flow

### 1. Navigation Phase
```typescript
await page.goto(BASE_URL + config.path);
await page.waitForTimeout(1000);
```

### 2. Audio Initialization Phase
```typescript
if (!config.skipAudioInit) {
  await initializeAudio(page);
  // Includes BUTTON_CLICK_DELAY + error modal handling
}
```

### 3. Three.js Ready Phase
```typescript
if (!config.skipCanvasWait) {
  await waitForThreeJsReady(page);
  // Waits for:
  // - Canvas element
  // - INITIAL_RENDER_DELAY
  // - RAF cycles
  // - ANIMATION_SETTLE_DELAY
}
```

### 4. Custom Actions Phase
```typescript
if (config.actions) {
  await config.actions(page);
  // Screen-specific actions (e.g., keyboard shortcuts)
}
```

### 5. Content Validation Phase
```typescript
const validationResult = await waitForContentWithRetry(page, config);
// For each retry:
// - Wait for network idle
// - Wait for RAF cycles
// - Wait CONTENT_LOAD_DELAY
// - Validate required elements
// - If failed, wait RETRY_DELAY and retry
```

### 6. Final Stabilization Phase
```typescript
// Wait for render cycles
await waitForRenderCycles(page);
// Final 1s wait
await page.waitForTimeout(1000);
```

### 7. Screenshot Capture
```typescript
await page.screenshot({ ... });
```

## Screen-Specific Considerations

### Splash Screen (01)
- **Skip canvas wait**: Pure HTML, no Three.js
- **Skip audio init**: Need to capture initial state
- **Timing**: 2000ms (fast, minimal content)

### Intro Screen Menu (02-03)
- **Challenge**: Menu Html overlays can appear as "just lines"
- **Solution**: `waitForMenuReady()` with extended `HTML_OVERLAY_DELAY`
- **Timing**: 4000ms + menu-specific waits

### Controls/Philosophy/Training Screens (04-06)
- **Challenge**: Screen transitions + complex Html overlays
- **Solution**: Extended `SCREEN_TRANSITION_DELAY` + `HTML_OVERLAY_DELAY`
- **Timing**: 5000-6000ms (allow for lazy loading)

### Combat Screens (07-08)
- **Challenge**: Most complex UI with HUD, player info, etc.
- **Solution**: Maximum wait times for all overlays
- **Timing**: 6000ms (highest timeout)

## Best Practices

### Adding New Screenshots

1. **Identify content type**:
   - Pure HTML → `skipCanvasWait: true`
   - Simple canvas → default timings
   - Complex Html overlays → increase `waitForTimeout`

2. **Define required content**:
   ```typescript
   requiredContent: [
     { selector: 'canvas', description: '3D canvas', required: true },
     { selector: '[data-testid="menu"]', description: 'Menu', required: true },
   ]
   ```

3. **Test with multiple runs**:
   - Run 3-5 times to ensure consistency
   - Check for "just lines" or missing content
   - Increase timing if needed

4. **Use keyboard shortcuts**:
   - More reliable than clicking through canvas
   - Example: `await page.keyboard.press('v')` for versus mode

### Debugging Tips

1. **Check console output**:
   - Look for "⚠️" warnings about missing content
   - Check validation failure messages

2. **Review screenshots**:
   - Look for partial renders
   - Check Html overlay positioning
   - Verify all expected content is visible

3. **Increase timing incrementally**:
   - Start with +500ms
   - Test and iterate
   - Don't blindly add massive delays

4. **Use `data-testid` attributes**:
   - More reliable than CSS classes
   - Won't break if styles change
   - Explicit about what you're looking for

## Performance Considerations

### Current Runtime
- **Baseline**: ~6 minutes (before improvements)
- **Target**: 7-8 minutes (after improvements)
- **Budget**: 1-2 minutes extra is acceptable

### Time Distribution (Estimated)

| Phase | Time per Screenshot | Total (8 screens) |
|-------|-------------------|------------------|
| Navigation | 1s | 8s |
| Audio Init | 3s | 24s |
| Canvas Ready | 5s | 40s |
| Actions | 5-10s | 60s |
| Content Validation | 4-8s | 48s |
| Final Stabilization | 2s | 16s |
| Screenshot Capture | 1s | 8s |
| **Total** | **21-30s** | **~200s (3.3min)** |

**Note**: Times overlap and vary per screen. Actual runtime is 7-8 minutes due to:
- Sequential execution
- Retries on validation failures
- Network idle waits
- RAF cycles

### Optimization Opportunities

**Do NOT optimize** (these are necessary):
- Html overlay delays - critical for correct rendering
- Screen transition delays - lazy loading requires time
- Content validation retries - catch transient failures

**Could optimize** (future work):
- Parallel screenshot capture (needs investigation)
- Smarter network idle detection
- Skip redundant waits if content already visible

## Troubleshooting

### "Menu appears as just lines"
**Cause**: Html overlay not fully rendered
**Solution**: Increase `HTML_OVERLAY_DELAY` or screen-specific `waitForTimeout`

### "Content validation failed"
**Cause**: Element not visible yet
**Solution**: 
- Check selector is correct with `data-testid`
- Increase `CONTENT_LOAD_DELAY`
- Add screen-specific wait in `actions`

### "Screenshot shows blank canvas"
**Cause**: Three.js not initialized
**Solution**: 
- Ensure `skipCanvasWait: false`
- Increase `INITIAL_RENDER_DELAY`
- Check WebGL is available

### "Inconsistent results between runs"
**Cause**: Race condition or timing too tight
**Solution**:
- Add RAF cycles before screenshot
- Increase relevant delay by 25-50%
- Add network idle wait

## References

- [Playwright Wait Strategies](https://playwright.dev/docs/api/class-page#page-wait-for-load-state)
- [@react-three/drei Html Component](https://github.com/pmndrs/drei#html)
- [Three.js Rendering Order](https://threejs.org/docs/#api/en/scenes/Scene)

## Version History

- **v1.0** (2026-01-07): Initial documentation
  - Added comprehensive timing strategy
  - Documented all timing constants
  - Provided troubleshooting guide
