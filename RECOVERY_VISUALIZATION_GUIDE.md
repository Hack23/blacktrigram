# Recovery Phase Visualization - Usage Examples

## Overview

The recovery visualization utilities help developers tune and debug recovery phases during development. They provide console output, ASCII charts, and comparison tables.

## Quick Start

```typescript
import { 
  generateRecoveryVisualization,
  printRecoveryAnalysis,
  generateTensionChart,
  compareRecoveryPhases,
} from 'systems/animation';

// Analyze a single animation
const viz = generateRecoveryVisualization(JAB_ANIMATION_ENHANCED);
printRecoveryAnalysis(viz);
```

## Example Outputs

### 1. Single Animation Analysis

```
======================================================================
Recovery Phase Analysis: jab (잽)
======================================================================

📊 Validation:
  Valid: ✅
  Recovery Duration: 200.0ms
  Recovery Keyframes: 2

📈 Recovery Timeline:
  Recovery Start: 0.300s
  Recovery End: 0.500s
  Duration: 200.0ms

🔍 Key Tension Points:
  Peak: 0.90 at 0.150s
  Recovery Start: 0.90 at 0.300s
  Intermediate: 0.35 at 0.420s
  Final: 0.05 at 0.500s

======================================================================
```

### 2. ASCII Tension Chart

```
Muscle Tension: jab (잽)
────────────────────────────────────────────────────────
1.0│○○○○                                              
0.9│    ○○○○○○                                        
0.8│          ○○○○                                    
0.7│              ○○○○                                
0.6│                  ○○○○                            
0.5│                      ○○○●                        
0.4│                          ●●●                     
0.3│                             ●●●                  
0.2│                                ●●●               
0.1│                                   ●●●            
0.0│                                      ●●●         
   └─────────────────────────────────────────────────
    0s                                            0.50s

Legend: ○ Execution  ● Recovery Phase
```

### 3. Multi-Animation Comparison

```
================================================================================
Recovery Phase Comparison (복귀 단계 비교)
================================================================================

Animation         Korean Name       Duration  Recovery  Valid  Peak→Intermediate→Final
────────────────────────────────────────────────────────────────────────────────
Jab               잽                500ms     200ms     ✅     0.90 → 0.35 → 0.05
Cross             크로스            570ms     220ms     ✅     1.00 → 0.45 → 0.12
Elbow Strike      팔꿈치치기        510ms     160ms     ✅     1.00 → 0.35 → 0.08
Knee Strike       무릎차기          590ms     190ms     ✅     1.00 → 0.42 → 0.12
================================================================================
```

## Use Cases

### 1. Debugging Recovery Timing

When tuning a new animation's recovery phase:

```typescript
const viz = generateRecoveryVisualization(MY_NEW_ANIMATION);

// Check if recovery duration is in valid range
if (!viz.validation.isValid) {
  console.log('Issues found:', viz.validation.issues);
}

// View detailed timeline
printRecoveryAnalysis(viz);
```

### 2. Comparing Technique Types

Compare recovery characteristics across different technique categories:

```typescript
const punchComparison = compareRecoveryPhases({
  'Jab': JAB_ANIMATION_ENHANCED,
  'Cross': CROSS_ANIMATION_ENHANCED,
  'Hook': HOOK_ANIMATION_ENHANCED,
});

const kickComparison = compareRecoveryPhases({
  'Front Kick': FRONT_KICK_ANIMATION_ENHANCED,
  'Roundhouse': ROUNDHOUSE_KICK_ANIMATION_ENHANCED,
  'Side Kick': SIDE_KICK_ANIMATION_ENHANCED,
});
```

### 3. Visualizing Muscle Tension Curves

Generate ASCII charts to see tension release patterns:

```typescript
const viz = generateRecoveryVisualization(TECHNIQUE_ANIMATION);
const chart = generateTensionChart(viz, 60, 10);
console.log(chart);
```

### 4. Extracting Timeline Data

Get raw timeline data for custom visualization:

```typescript
const viz = generateRecoveryVisualization(ANIMATION);

// Access timeline points
viz.timeline.forEach(point => {
  console.log(`Time: ${point.time.toFixed(3)}s`);
  console.log(`Tension: ${point.tension.toFixed(2)}`);
  console.log(`Phase: ${point.phase} (${point.phaseKorean})`);
});
```

## Korean Martial Arts Principles Validated

The visualization tools help verify that animations follow proper recovery principles:

- **복귀 (Bokgwi)** - Return to stance through two-phase keyframes
- **균형회복 (Gyunhyeong Hoebog)** - Gradual balance restoration visible in tension curve
- **자세복귀 (Jase Bokgwi)** - Complete return to neutral position (validated)
- **호흡조절 (Hoheup Jojoel)** - Recovery timing matches breath cycle (150-250ms)
- **근육이완 (Geunryuk Ihwan)** - Muscle tension release visible in charts

## Performance Considerations

All visualization functions are optimized for development use:

- Timeline sampling at 60fps by default (configurable)
- Efficient tension calculations (<0.01ms per sample)
- Suitable for real-time debugging during animation tuning

## Integration with Testing

Use visualization in unit tests to validate recovery characteristics:

```typescript
describe("MyAnimation Recovery", () => {
  it("should have proper recovery phase", () => {
    const viz = generateRecoveryVisualization(MY_ANIMATION);
    
    expect(viz.validation.isValid).toBe(true);
    expect(viz.validation.recoveryDuration).toBeGreaterThan(150);
    expect(viz.validation.recoveryDuration).toBeLessThan(250);
  });
});
```

## API Reference

See TypeScript documentation for complete API details:
- `generateRecoveryVisualization()` - Generate timeline data
- `printRecoveryAnalysis()` - Console output
- `generateTensionChart()` - ASCII visualization
- `compareRecoveryPhases()` - Multi-animation comparison
