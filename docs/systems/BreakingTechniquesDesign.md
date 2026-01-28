# Breaking Techniques Design Document

**Korean**: 파쇄기술 설계 (Paswaegi Seolgye)

This document defines the design for breaking and counter-attack techniques that exploit exposed limbs during opponent attacks.

## Breaking Techniques Overview

Breaking techniques are counter-attacks that target exposed limbs during an opponent's technique execution. They leverage the LimbExposureSystem to identify vulnerability windows and apply devastating joint/bone damage.

## Korean Martial Arts Foundation

**관절기** (Gwanjeolgi - Joint Techniques):
- Hapkido wrist and elbow locks
- Yusul arm bars and leg locks
- Taekwondo defensive leg breaks

**후수공격** (Husu Gonggyeok - Counter-Strike Mastery):
- Timing-based defensive superiority
- Exploiting opponent's overextension
- Turning aggression into weakness

## Breaking Technique Categories

### 1. Ankle Breaking (발목 파쇄)
- **Ankle Stomp** (발목짓밟기): Stomp exposed ankle during kick recovery
- **Ankle Lock** (발목꺾기): Hapkido twist lock on planted foot
- **Targets**: Exposed during high kicks, spinning techniques
- **Effects**: Mobility reduction (60-80%), disabled limb

### 2. Knee Breaking (무릎 파쇄)
- **Knee Stomp** (무릎찍기): Devastating downward break
- **Inside Leg Kick** (안쪽다리차기): Hyperextension counter
- **Targets**: Exposed during kicks, stance transitions
- **Effects**: Severe injury, impaired mobility (80-90%)

### 3. Elbow Breaking (팔꿈치 파쇄)
- **Arm Bar** (팔꺾기): Yusul hyperextension technique
- **Elbow Strike Counter** (팔꿈치타격): Direct joint damage
- **Targets**: Exposed during overextended punches
- **Effects**: Disabled arm (65%), joint damage

### 4. Wrist Breaking (손목 파쇄)
- **Wrist Lock** (손목꺾기): Fast Hapkido twist
- **Wrist Snap** (손목부러뜨리기): Counter-grab technique
- **Targets**: Exposed during hand techniques
- **Effects**: Weakened grip (40%), sprained joint

## Implementation Requirements

### Status Effects

The breaking technique system uses status effect IDs defined in `src/systems/combat/BreakingStatusEffects.ts`:

```typescript
import { BREAKING_STATUS_EFFECT_IDS } from '@/systems/combat/BreakingStatusEffects';

// Available status effect IDs:
BREAKING_STATUS_EFFECT_IDS.PAIN              // "pain" - General pain effect
BREAKING_STATUS_EFFECT_IDS.SEVERE_INJURY     // "severe_injury" - High severity (>0.8)
BREAKING_STATUS_EFFECT_IDS.DISABLED_LIMB     // "disabled_limb" - Limb cannot be used
BREAKING_STATUS_EFFECT_IDS.INJURED_LIMB      // "injured_limb" - Moderate damage (0.5-0.8)
BREAKING_STATUS_EFFECT_IDS.SPRAINED_JOINT    // "sprained_joint" - Minor damage (<0.5)
BREAKING_STATUS_EFFECT_IDS.IMPAIRED_MOBILITY // "impaired_mobility" - Movement reduction
BREAKING_STATUS_EFFECT_IDS.BLEEDING          // "bleeding" - Bleeding from breaks (>0.6)
```

These constants provide:
- Type-safe status effect ID references
- Validation helper: `isBreakingStatusEffectId(id)`
- Complete list access: `getAllBreakingStatusEffectIds()`

**Note**: These IDs are defined as constants but do not yet have full StatusEffect implementations.
Integration with the game's effect system requires creating corresponding effect handlers.

## Integration with LimbExposureSystem

See `src/systems/combat/LimbExposureSystem.ts` for implementation details.

Key constants:
- `BREAKING_FORCE_THRESHOLD = 40` - Minimum force for successful break
- `BREAKING_MAX_FORCE = 80` - Maximum force for severity calculation
- `MAX_COUNTER_RANGE_METERS = 1.0` - Maximum range for counter-attacks

## AI Decision Making

The AI should prioritize breaking techniques when:
1. Opponent is executing high-extension technique (baseExtension > 1.0)
2. Counter opportunity window is active
3. AI has sufficient stamina (20-35 points)
4. Distance is close range (< 1.0m)
5. Breaking is allowed in current opportunity

See `src/systems/combat/AICounterAttackIntegration.ts` for integration patterns.

## Balance Considerations

### Breaking Success Requirements
- **Force Threshold**: 40+ damage required
- **Timing**: Must be within exposure window
- **Distance**: Close range only (< 1.0m)
- **Vulnerability Multiplier**: 1.5-2.5x for effective breaks

### Injury Severity Scale
- **0.0-0.3**: Failed break, minor bruising
- **0.4-0.6**: Sprained joint, 20-40% mobility reduction
- **0.7-0.8**: Moderate break, 50-65% reduction
- **0.9-1.0**: Severe fracture/dislocation, 75-90% reduction

## Related Files

- `src/systems/combat/LimbExposureSystem.ts` - Core limb exposure detection
- `src/types/physics.ts` - Type definitions for breaking mechanics
- `src/systems/combat/AICounterAttackIntegration.ts` - AI integration patterns
