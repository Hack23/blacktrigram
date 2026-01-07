# Stance Laterality Integration Plan

## Overview

This document outlines the comprehensive integration strategy for the stance laterality system into Black Trigram's combat, training, AI, and control systems.

## Integration Points

### 1. Combat Screen Integration (`CombatScreen3D.tsx`)

#### Current State
- Stance switching handled via `handleStanceSwitch` in `useCombatActions`
- Keyboard controls for stance changes (1-8 keys)
- Stance indicator shows current trigram stance

#### Required Changes

**A. Add Q Key for Laterality Switching**
```typescript
// In CombatScreen3D.tsx keyboard controls section
useEffect(() => {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (isPaused || roundEnded) return;
    
    // Existing stance keys 1-8...
    
    // NEW: Tab key for stance side switch
    if (event.key === 'q' || event.key === 'Q') {
      handleStanceSideSwitch();
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [isPaused, roundEnded, handleStanceSideSwitch]);
```

**B. Add Stance Side Switch Handler**
```typescript
// In useCombatActions.ts
const handleStanceSideSwitch = useCallback(() => {
  const player = validPlayers[0]; // Human player
  const stanceManager = new StanceManager();
  
  // Switch stance side
  const result = stanceManager.switchStanceSide(player);
  
  if (result.success) {
    // Update player state
    onPlayerUpdate(0, result.updatedPlayer);
    
    // Audio feedback
    combatAudio?.playStanceSwitchSound?.();
    
    // Visual feedback
    addCombatMessage(
      result.laterality === "left" ? "왼발서기" : "오른발서기",
      result.laterality === "left" ? "Left Stance" : "Right Stance"
    );
    
    // Trigger animation
    combatActions.triggerAnimation(0, "stance_side_switch");
  } else {
    // Feedback for failed switch (cooldown or insufficient stamina)
    if (result.message?.includes("stamina")) {
      addCombatMessage("체력 부족", "Insufficient Stamina");
    } else if (result.message?.includes("cooldown")) {
      addCombatMessage("대기 중", "On Cooldown");
    }
  }
}, [validPlayers, onPlayerUpdate, combatAudio, addCombatMessage, combatActions]);
```

**C. Track Laterality in Combat State**
```typescript
// In useCombatState.ts, extend combat state
interface CombatScreenState {
  // ... existing state
  playerLaterality: [StanceLaterality, StanceLaterality]; // [player1, player2]
}

// Initialize with default right stance
const [playerLaterality, setPlayerLaterality] = useState<[StanceLaterality, StanceLaterality]>([
  "right",
  "right"
]);
```

### 2. Player HUD Updates (`PlayerHUD.tsx`)

#### Add Laterality Indicator

```typescript
// In PlayerHUD.tsx, add laterality display
const LateralityIndicator: React.FC<{ laterality: StanceLaterality }> = ({ laterality }) => {
  const isLeft = laterality === "left";
  
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "4px",
      fontSize: "11px",
      fontFamily: FONT_FAMILY.KOREAN,
      color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
    }}>
      <span style={{
        padding: "2px 6px",
        background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.8),
        border: `1px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.6)}`,
        borderRadius: "3px",
        fontWeight: "bold",
      }}>
        {isLeft ? "L" : "R"}
      </span>
      <span style={{ opacity: 0.8 }}>
        {isLeft ? "왼발서기" : "오른발서기"}
      </span>
    </div>
  );
};

// Add to PlayerHUD component
export interface PlayerHUDProps {
  readonly player: PlayerState;
  readonly position: "left" | "right";
  readonly isMobile: boolean;
  readonly laterality?: StanceLaterality; // NEW
}

// In render, add indicator below stance display
<div style={infoContainerStyle}>
  {/* Existing name, readiness, health, stamina */}
  
  {/* NEW: Laterality indicator */}
  {laterality && <LateralityIndicator laterality={laterality} />}
</div>
```

### 3. AI Combat Integration (`useAICombat.ts`)

#### Extend AI Decision Making

```typescript
// In useAICombat.ts

/**
 * AI laterality decision logic
 * 
 * Strategic considerations:
 * - Stance matching: Same laterality creates open lines for body attacks
 * - Stance mismatching: Opposite laterality creates closed centerline
 * - Aggressive AI: Prefer stance matching for offense
 * - Defensive AI: Prefer stance mismatching for protection
 */
const decideStanceSideSwitchActions = useCallback(
  (context: CombatContext): AIActionType | null => {
    const { player, opponent } = context;
    
    // Get laterality from stance manager
    const stanceManager = new StanceManager();
    const currentLaterality = stanceManager.getCurrentLaterality();
    const opponentLaterality = getOpponentLaterality(opponent); // Helper function
    
    // Don't switch too frequently (cooldown check)
    const timeSinceLastSwitch = Date.now() - (player.lastStanceChangeTime || 0);
    if (timeSinceLastSwitch < 500) return null;
    
    // Strategic decision based on personality
    const shouldSwitch = shouldAISwitchStanceSide(
      personality,
      currentLaterality,
      opponentLaterality,
      context
    );
    
    if (shouldSwitch && player.stamina >= 2) {
      return "STANCE_SIDE_SWITCH" as AIActionType;
    }
    
    return null;
  },
  [personality]
);

/**
 * Helper: Determine if AI should switch stance side
 */
function shouldAISwitchStanceSide(
  personality: AIPersonality,
  currentLaterality: StanceLaterality,
  opponentLaterality: StanceLaterality,
  context: CombatContext
): boolean {
  const { player, opponent } = context;
  const healthPercentage = player.health / 100;
  
  // Aggressive striker: Prefer stance matching for openings
  if (personality.aggressiveness > 0.7) {
    return currentLaterality !== opponentLaterality;
  }
  
  // Defensive fighter: Prefer stance mismatching for protection
  if (personality.defensiveness > 0.7) {
    return currentLaterality === opponentLaterality;
  }
  
  // Balanced: Mix based on health and stamina
  if (healthPercentage < 0.4) {
    // Low health: Switch to defensive (mismatched)
    return currentLaterality === opponentLaterality;
  }
  
  // Random variation (20% chance)
  return Math.random() < 0.2;
}

// Add to decision tree evaluation
const evaluateDecisionTree = useCallback(() => {
  const context = buildCombatContext();
  
  // Check stance side switch first (low stamina cost)
  const sideSwitch = decideStanceSideSwitchActions(context);
  if (sideSwitch) {
    return { type: sideSwitch, priority: 2 };
  }
  
  // Existing decision logic...
}, [/* dependencies */]);
```

### 4. Combat Actions Integration (`useCombatActions.ts`)

#### Extend Action Handler

```typescript
// In useCombatActions.ts interface
export interface UseCombatActionsConfig {
  // ... existing properties
  readonly stanceManagers?: [StanceManager, StanceManager]; // NEW: One per player
}

// Add stance side switch action handler
export interface UseCombatActionsReturn {
  // ... existing handlers
  readonly handleStanceSideSwitch: (playerIndex: number) => void; // NEW
}

const handleStanceSideSwitch = useCallback(
  (playerIndex: number) => {
    const player = validPlayers[playerIndex];
    const stanceManager = stanceManagers?.[playerIndex] ?? new StanceManager();
    
    const result = stanceManager.switchStanceSide(player);
    
    if (result.success) {
      onPlayerUpdate(playerIndex, result.updatedPlayer);
      
      // Visual and audio feedback
      addCombatMessage(
        result.laterality === "left" ? "왼발서기" : "오른발서기",
        result.laterality === "left" ? "Left Stance" : "Right Stance"
      );
      
      combatAudio?.playStanceSwitchSound?.();
      
      // Trigger animation
      combatActions.triggerAnimation(playerIndex, "stance_side_switch");
    }
  },
  [validPlayers, stanceManagers, onPlayerUpdate, addCombatMessage, combatAudio, combatActions]
);
```

### 5. Training Screen Integration (`TrainingScreen3D.tsx`)

#### Add Laterality Practice

```typescript
// In TrainingScreen3D.tsx

// Add laterality switch button to training controls
const TrainingLateralityControls: React.FC = () => {
  const handleSwitchSide = useCallback(() => {
    // Practice stance side switching
    trainingActions.switchStanceSide();
  }, [trainingActions]);
  
  return (
    <div style={{
      position: "absolute",
      bottom: "120px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "8px",
    }}>
      <button
        onClick={handleSwitchSide}
        style={{
          padding: "8px 16px",
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9),
          border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8)}`,
          borderRadius: "4px",
          color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
          fontFamily: FONT_FAMILY.KOREAN,
          cursor: "pointer",
        }}
      >
        측면 전환 (Q) | Switch Side
      </button>
    </div>
  );
};

// Add laterality indicators to training dummy positions
const TrainingDummyLaterality: React.FC<{ laterality: StanceLaterality }> = ({ laterality }) => {
  return (
    <Html position={[0, 2, 0]} center>
      <div style={{
        padding: "4px 8px",
        background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.8),
        border: `1px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.6)}`,
        borderRadius: "3px",
        color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
        fontFamily: FONT_FAMILY.KOREAN,
        fontSize: "12px",
      }}>
        {laterality === "left" ? "L 왼발서기" : "R 오른발서기"}
      </div>
    </Html>
  );
};
```

### 6. Skeletal Rendering Integration (`SkeletalPlayer3D.tsx`)

#### Apply Guard Pose Mirroring

```typescript
// In SkeletalPlayer3D.tsx

import { getGuardPoseForStance, mirrorGuardPose } from "@/systems/animation/StanceGuardPoses";
import { StanceLaterality } from "@/systems/trigram/types";

interface SkeletalPlayer3DProps {
  // ... existing props
  laterality?: StanceLaterality; // NEW: Stance side
}

// In guard pose application
useEffect(() => {
  if (!stance || !skeletonRef.current) return;
  
  // Get guard pose with laterality
  const guardPose = getGuardPoseForStance(stance, laterality ?? "right");
  
  if (guardPose) {
    // Apply pose to skeleton rig
    applyGuardPoseToSkeleton(skeletonRef.current, guardPose);
  }
}, [stance, laterality]);

/**
 * Apply guard pose to skeleton rig with proper bone rotations
 */
function applyGuardPoseToSkeleton(
  skeleton: THREE.Skeleton,
  pose: StanceGuardPose
): void {
  const bones = skeleton.bones;
  
  // Find arm bones
  const leftShoulder = bones.find(b => b.name === "LeftShoulder");
  const leftElbow = bones.find(b => b.name === "LeftElbow");
  const leftWrist = bones.find(b => b.name === "LeftWrist");
  
  const rightShoulder = bones.find(b => b.name === "RightShoulder");
  const rightElbow = bones.find(b => b.name === "RightElbow");
  const rightWrist = bones.find(b => b.name === "RightWrist");
  
  // Apply rotations from pose
  if (leftShoulder) leftShoulder.rotation.copy(pose.leftArm.shoulder);
  if (leftElbow) leftElbow.rotation.copy(pose.leftArm.elbow);
  if (leftWrist) leftWrist.rotation.copy(pose.leftArm.wrist);
  
  if (rightShoulder) rightShoulder.rotation.copy(pose.rightArm.shoulder);
  if (rightElbow) rightElbow.rotation.copy(pose.rightArm.elbow);
  if (rightWrist) rightWrist.rotation.copy(pose.rightArm.wrist);
  
  // Apply torso rotation
  const spine = bones.find(b => b.name === "Spine");
  if (spine) spine.rotation.copy(pose.torso);
  
  // Apply weight distribution (visual lean)
  const hips = bones.find(b => b.name === "Hips");
  if (hips) {
    // Shift weight forward/back based on pose.weight
    const weightShift = (pose.weight.forward - 0.5) * 0.1; // ±0.05 units
    hips.position.z = weightShift;
  }
}
```

### 7. Combat System Integration

#### Tactical Advantages/Disadvantages

```typescript
// In CombatSystem.ts or new StanceTacticsSystem.ts

/**
 * Calculate tactical modifier based on stance laterality matching
 * 
 * Korean martial arts tactical considerations:
 * - Matched stances (both left or both right): Open lines, easier body attacks
 * - Mismatched stances (left vs right): Closed centerline, harder to attack
 * 
 * @korean 자세 측면 전술적 수정자
 */
export function calculateLateralityModifier(
  attackerLaterality: StanceLaterality,
  defenderLaterality: StanceLaterality,
  attackType: "high" | "mid" | "low"
): number {
  const isMatched = attackerLaterality === defenderLaterality;
  
  if (isMatched) {
    // Matched stances: Easier to hit body/torso
    return attackType === "mid" ? 1.15 : 1.0;
  } else {
    // Mismatched stances: Harder to hit centerline
    return attackType === "mid" ? 0.9 : 1.0;
  }
}

// Apply in damage calculation
export function calculateDamageWithLaterality(
  baseDamage: number,
  attackerLaterality: StanceLaterality,
  defenderLaterality: StanceLaterality,
  targetZone: "high" | "mid" | "low"
): number {
  const lateralityModifier = calculateLateralityModifier(
    attackerLaterality,
    defenderLaterality,
    targetZone
  );
  
  return baseDamage * lateralityModifier;
}
```

### 8. Keyboard Controls Documentation

#### Update KeyboardHints Component

```typescript
// In KeyboardHints.tsx

const keyboardHints = [
  // ... existing hints
  { key: "Q", action: "측면 전환", actionEn: "Switch Side" }, // NEW
  { key: "1-8", action: "자세 변경", actionEn: "Change Stance" },
  // ... rest
];
```

## Implementation Phases

### Phase 4: Skeletal System (Immediate)
- [x] Type definitions complete
- [x] StanceManager integration ready
- [ ] Update `SkeletalPlayer3D.tsx` to accept `laterality` prop
- [ ] Apply guard pose mirroring in rendering
- [ ] Test visual distinction between left/right stances

### Phase 5: UI/HUD Updates (Next)
- [ ] Add laterality indicator to `PlayerHUD.tsx`
- [ ] Display L/R badge with Korean text
- [ ] Update `StanceChangeIndicator` for side switches
- [ ] Add to `KeyboardHints` component

### Phase 6: Controls & Input (After UI)
- [ ] Map Tab key in `CombatScreen3D.tsx`
- [ ] Add `handleStanceSideSwitch` to `useCombatActions`
- [ ] Implement cooldown feedback
- [ ] Add mobile touch control for side switch

### Phase 7: Combat System (Concurrent with Phase 6)
- [ ] Implement `calculateLateralityModifier`
- [ ] Integrate with damage calculations
- [ ] Add to combat effectiveness matrix
- [ ] Test tactical advantages

### Phase 8: AI Integration (After Phase 7)
- [ ] Extend `useAICombat` with laterality decisions
- [ ] Add `shouldAISwitchStanceSide` logic
- [ ] Integrate with AI decision tree
- [ ] Test AI strategic behavior

### Phase 9: Training Mode (Parallel with Phases 5-6)
- [ ] Add laterality controls to training UI
- [ ] Display laterality on training dummy
- [ ] Practice mode for side switching
- [ ] Tutorial hints for laterality

## Testing Strategy

### Unit Tests
```typescript
describe("Stance Laterality Integration", () => {
  it("should handle Tab key for stance side switch", () => {
    // Test keyboard control
  });
  
  it("should update laterality in combat state", () => {
    // Test state management
  });
  
  it("should apply laterality modifier to damage", () => {
    // Test combat calculations
  });
  
  it("should make AI laterality decisions", () => {
    // Test AI behavior
  });
});
```

### Integration Tests
- Combat screen with laterality switching
- AI vs player with mixed lateralities
- Training mode laterality practice
- Performance at 60fps with laterality rendering

### Playtest Scenarios
1. **Stance Clarity**: Visual distinction between left/right
2. **Combat Flow**: Natural feel of Tab key switching
3. **AI Behavior**: Strategic laterality decisions
4. **Tactical Impact**: Noticeable advantage/disadvantage

## Performance Considerations

### Optimizations
- ✅ Caching in `getAllStanceGuardPoses()` (already implemented)
- Memoize laterality calculations in combat loop
- Batch laterality state updates
- Use React.memo for laterality-dependent components

### Target Metrics
- 60fps maintained with laterality rendering
- <10ms for AI laterality decisions
- <5ms for guard pose mirroring
- <2ms for combat modifier calculations

## Korean Martial Arts Authenticity

### Traditional References
- **왼발서기 (Oenbal Seogi)**: Orthodox stance in Taekwondo
- **오른발서기 (Oreun Bal Seogi)**: Southpaw stance
- **측면성 (Cheungmyeonseong)**: Laterality concept

### Tactical Principles
- Stance matching creates open targets
- Stance mismatching protects centerline
- Lead hand controls distance
- Rear hand provides power

## Summary

This integration plan provides a comprehensive roadmap for implementing stance laterality across all game systems. The phased approach ensures:

1. **Solid Foundation**: Phases 1-3 complete (types, manager, animation)
2. **Visual Feedback**: Phase 4-5 (skeletal rendering, UI)
3. **Interactive Control**: Phase 6 (Tab key, mobile controls)
4. **Combat Depth**: Phase 7 (tactical modifiers)
5. **AI Intelligence**: Phase 8 (strategic decisions)
6. **Learning**: Phase 9 (training mode)

Each phase builds on the previous, maintaining the high quality and authenticity that defines Black Trigram.

---

**흑괘의 길을 걸어라** - *Walk the Path of the Black Trigram*
