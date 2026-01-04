# Stance Laterality: Detailed Implementation Guide

## Quick Reference: Files to Modify

### Priority 1: Core Integration (Phases 4-5)
1. `src/components/three/SkeletalPlayer3D.tsx` - Add laterality prop and guard pose application
2. `src/components/combat/components/PlayerHUD.tsx` - Add L/R indicator
3. `src/components/combat/hooks/useCombatState.ts` - Track laterality state
4. `src/components/combat/CombatScreen3D.tsx` - Pass laterality to components

### Priority 2: Controls (Phase 6)
5. `src/components/combat/CombatScreen3D.tsx` - Add Q key handler
6. `src/components/combat/hooks/useCombatActions.ts` - Add side switch action
7. `src/components/combat/components/KeyboardHints.tsx` - Update hints

### Priority 3: Combat System (Phase 7)
8. `src/systems/CombatSystem.ts` - Add laterality modifiers
9. `src/systems/trigram/StanceTacticsSystem.ts` - NEW: Tactical calculations

### Priority 4: AI Integration (Phase 8)
10. `src/components/combat/hooks/useAICombat.ts` - Add AI laterality logic
11. `src/systems/ai/DecisionTree.ts` - Extend decision nodes

### Priority 5: Training Mode (Phase 9)
12. `src/components/training/TrainingScreen3D.tsx` - Add laterality controls
13. `src/components/training/hooks/useTrainingActions.ts` - Add side switch

## Detailed Implementation Steps

### Step 1: Skeletal Player 3D Integration

**File**: `src/components/three/SkeletalPlayer3D.tsx`

```typescript
// Add to imports
import { getGuardPoseForStance } from "@/systems/animation/StanceGuardPoses";
import { StanceLaterality } from "@/systems/trigram/types";
import { StanceGuardPose } from "@/types/skeletal";

// Update interface
export interface SkeletalPlayer3DProps {
  // ... existing props
  laterality?: StanceLaterality; // NEW: Stance side (defaults to "right")
}

// In component, destructure laterality
export const SkeletalPlayer3D: React.FC<SkeletalPlayer3DProps> = ({
  // ... existing destructuring
  laterality = "right", // NEW with default
}) => {
  // ... existing code
  
  // Update guard pose application (find existing useEffect for stance)
  useEffect(() => {
    if (!stance || !skeletonRef.current) return;
    
    // Get guard pose with laterality support
    const guardPose = getGuardPoseForStance(stance, laterality);
    
    if (guardPose && skeletonRef.current) {
      applyGuardPoseToSkeleton(skeletonRef.current, guardPose);
    }
  }, [stance, laterality]); // Add laterality to dependencies
  
  // ... rest of component
};

/**
 * Apply guard pose to skeleton (add this helper if not exists)
 */
function applyGuardPoseToSkeleton(
  skeleton: THREE.Skeleton,
  pose: StanceGuardPose
): void {
  const bones = skeleton.bones;
  
  // Find bones by name (adjust names based on your rig)
  const leftShoulder = bones.find(b => b.name.includes("LeftShoulder") || b.name.includes("L_Shoulder"));
  const leftElbow = bones.find(b => b.name.includes("LeftElbow") || b.name.includes("L_Elbow"));
  const leftWrist = bones.find(b => b.name.includes("LeftWrist") || b.name.includes("L_Wrist"));
  
  const rightShoulder = bones.find(b => b.name.includes("RightShoulder") || b.name.includes("R_Shoulder"));
  const rightElbow = bones.find(b => b.name.includes("RightElbow") || b.name.includes("R_Elbow"));
  const rightWrist = bones.find(b => b.name.includes("RightWrist") || b.name.includes("R_Wrist"));
  
  // Apply arm rotations
  if (leftShoulder) leftShoulder.rotation.copy(pose.leftArm.shoulder);
  if (leftElbow) leftElbow.rotation.copy(pose.leftArm.elbow);
  if (leftWrist) leftWrist.rotation.copy(pose.leftArm.wrist);
  
  if (rightShoulder) rightShoulder.rotation.copy(pose.rightArm.shoulder);
  if (rightElbow) rightElbow.rotation.copy(pose.rightArm.elbow);
  if (rightWrist) rightWrist.rotation.copy(pose.rightArm.wrist);
  
  // Apply torso rotation
  const spine = bones.find(b => b.name.includes("Spine") || b.name.includes("spine"));
  if (spine) spine.rotation.copy(pose.torso);
}
```

### Step 2: Combat State - Track Laterality

**File**: `src/components/combat/hooks/useCombatState.ts`

```typescript
// Add to imports
import { StanceLaterality } from "@/systems/trigram/types";

// Extend CombatScreenState interface
export interface CombatScreenState {
  // ... existing properties
  playerLaterality: readonly [StanceLaterality, StanceLaterality]; // NEW: [player1, player2]
}

// In useCombatState hook
export function useCombatState(/* params */) {
  // Add state
  const [playerLaterality, setPlayerLaterality] = useState<[StanceLaterality, StanceLaterality]>([
    "right",
    "right"
  ]);
  
  // Add to returned state
  return {
    // ... existing returns
    playerLaterality,
    setPlayerLaterality, // Expose setter for updates
  };
}
```

### Step 3: Player HUD - Add L/R Indicator

**File**: `src/components/combat/components/PlayerHUD.tsx`

```typescript
// Add to imports
import { StanceLaterality } from "@/systems/trigram/types";

// Update interface
export interface PlayerHUDProps {
  readonly player: PlayerState;
  readonly position: "left" | "right";
  readonly isMobile: boolean;
  readonly laterality?: StanceLaterality; // NEW
}

// Add new component before PlayerHUDComponent
const LateralityIndicator: React.FC<{ 
  laterality: StanceLaterality;
  isMobile: boolean;
}> = React.memo(({ laterality, isMobile }) => {
  const isLeft = laterality === "left";
  
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "3px" : "4px",
      fontSize: isMobile ? "10px" : "11px",
      fontFamily: FONT_FAMILY.KOREAN,
      color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
    }}>
      <span style={{
        padding: isMobile ? "1px 4px" : "2px 6px",
        background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.8),
        border: `1px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.6)}`,
        borderRadius: "3px",
        fontWeight: "bold",
        minWidth: isMobile ? "16px" : "18px",
        textAlign: "center",
      }}>
        {isLeft ? "L" : "R"}
      </span>
      <span style={{ opacity: 0.8, whiteSpace: "nowrap" }}>
        {isLeft ? "왼발서기" : "오른발서기"}
      </span>
    </div>
  );
});
LateralityIndicator.displayName = "LateralityIndicator";

// In PlayerHUDComponent, destructure laterality
const PlayerHUDComponent: React.FC<PlayerHUDProps> = ({
  player,
  position,
  isMobile,
  laterality, // NEW
}) => {
  // ... existing code
  
  return (
    <div style={containerStyle}>
      <div style={iconContainerStyle}>
        {/* Existing archetype icon and name */}
      </div>
      
      {/* Existing bars */}
      <CombatReadinessBar /* ... */ />
      <HealthBar /* ... */ />
      <StaminaBar /* ... */ />
      
      {/* NEW: Laterality indicator */}
      {laterality && (
        <LateralityIndicator 
          laterality={laterality} 
          isMobile={isMobile} 
        />
      )}
      
      {/* Existing breathing indicator */}
      <BreathingIndicator /* ... */ />
    </div>
  );
};
```

### Step 4: Combat Screen - Pass Laterality Props

**File**: `src/components/combat/CombatScreen3D.tsx`

```typescript
// Find where SkeletalPlayer3D is rendered (around line 1400-1500)
// Update both player instances

<SkeletalPlayer3D
  // ... existing props
  laterality={playerLaterality[0]} // NEW: Player 1 laterality
/>

<SkeletalPlayer3D
  // ... existing props (player 2)
  laterality={playerLaterality[1]} // NEW: Player 2 laterality
/>

// Find where PlayerHUD is rendered (around line 1600-1700)
// Update both HUD instances

<PlayerHUD
  player={validPlayers[0]}
  position="left"
  isMobile={isMobile}
  laterality={playerLaterality[0]} // NEW
/>

<PlayerHUD
  player={validPlayers[1]}
  position="right"
  isMobile={isMobile}
  laterality={playerLaterality[1]} // NEW
/>
```

### Step 5: Combat Actions - Add Side Switch Handler

**File**: `src/components/combat/hooks/useCombatActions.ts`

```typescript
// Add to imports
import { StanceManager } from "@/systems/trigram/StanceManager";
import { StanceLaterality } from "@/systems/trigram/types";

// Update interface
export interface UseCombatActionsConfig {
  // ... existing
  readonly setPlayerLaterality?: (
    updater: (prev: [StanceLaterality, StanceLaterality]) => [StanceLaterality, StanceLaterality]
  ) => void; // NEW
}

// In useCombatActions hook
export function useCombatActions(config: UseCombatActionsConfig) {
  const {
    // ... existing destructuring
    setPlayerLaterality, // NEW
  } = config;
  
  // Add stance side switch handler
  const handleStanceSideSwitch = useCallback(
    (playerIndex: 0 | 1) => {
      const player = validPlayers[playerIndex];
      const stanceManager = new StanceManager();
      
      const result = stanceManager.switchStanceSide(player);
      
      if (result.success) {
        // Update player state
        onPlayerUpdate(playerIndex, result.updatedPlayer);
        
        // Update laterality state
        if (setPlayerLaterality) {
          setPlayerLaterality(prev => {
            const newLaterality: [StanceLaterality, StanceLaterality] = [...prev];
            newLaterality[playerIndex] = result.laterality!;
            return newLaterality;
          });
        }
        
        // Audio feedback
        combatAudio?.playStanceSwitchSound?.();
        
        // Visual feedback
        const koreanText = result.laterality === "left" ? "왼발서기" : "오른발서기";
        const englishText = result.laterality === "left" ? "Left Stance" : "Right Stance";
        addCombatMessage(koreanText, englishText);
        
        // Trigger animation
        combatActions.triggerAnimation(playerIndex, "stance_side_switch");
      } else {
        // Feedback for failed switch
        if (result.message?.includes("stamina")) {
          addCombatMessage("체력 부족", "Insufficient Stamina");
        } else if (result.message?.includes("cooldown")) {
          addCombatMessage("대기 중", "On Cooldown");
        }
      }
    },
    [validPlayers, onPlayerUpdate, setPlayerLaterality, combatAudio, addCombatMessage, combatActions]
  );
  
  // Return handler
  return {
    // ... existing returns
    handleStanceSideSwitch, // NEW
  };
}
```

### Step 6: Keyboard Controls - Add Q Key

**File**: `src/components/combat/CombatScreen3D.tsx`

```typescript
// Find the keyboard control useEffect (around line 800-1000)
// Add Q key handling

useEffect(() => {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (isPaused || roundEnded || !roundStarted) return;
    
    // ... existing key handlers (1-8 for stances, etc.)
    
    // NEW: Q key for stance side switch
    if (event.key === 'q' || event.key === 'Q') {
      event.preventDefault();
      handleStanceSideSwitch(0); // Player 1 (human)
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [isPaused, roundEnded, roundStarted, handleStanceSideSwitch]);

// Make sure handleStanceSideSwitch is available in scope
const {
  // ... existing destructured handlers
  handleStanceSideSwitch, // NEW from useCombatActions
} = useCombatActions({
  // ... existing config
  setPlayerLaterality, // NEW: pass from useCombatState
});
```

### Step 7: Keyboard Hints - Document Q Key

**File**: `src/components/combat/components/KeyboardHints.tsx`

```typescript
// Find the hints array and add Q key entry
const keyboardHints = [
  { key: "WASD", action: "이동", actionEn: "Move" },
  { key: "Space", action: "공격", actionEn: "Attack" },
  { key: "Shift", action: "방어", actionEn: "Defend" },
  { key: "Q", action: "측면 전환", actionEn: "Switch Side" }, // NEW
  { key: "1-8", action: "자세 변경", actionEn: "Change Stance" },
  { key: "E", action: "기술", actionEn: "Technique" },
  { key: "Esc", action: "일시정지", actionEn: "Pause" },
];
```

### Step 8: AI Combat - Add Laterality Logic

**File**: `src/components/combat/hooks/useAICombat.ts`

```typescript
// Add helper function near the top of file
/**
 * Determine if AI should switch stance side based on strategy
 * @korean AI 측면 전환 결정
 */
function shouldAISwitchStanceSide(
  personality: AIPersonality,
  currentLaterality: StanceLaterality,
  opponentLaterality: StanceLaterality,
  healthPercentage: number
): boolean {
  // Aggressive: Prefer matching stance for offensive openings
  if (personality.aggressiveness > 0.7) {
    return currentLaterality !== opponentLaterality && Math.random() < 0.3;
  }
  
  // Defensive: Prefer mismatched stance for protection
  if (personality.defensiveness > 0.7) {
    return currentLaterality === opponentLaterality && Math.random() < 0.3;
  }
  
  // Low health: Switch to defensive (mismatched)
  if (healthPercentage < 0.4) {
    return currentLaterality === opponentLaterality && Math.random() < 0.4;
  }
  
  // Random variation (10% chance)
  return Math.random() < 0.1;
}

// In useAICombat hook, add laterality decision to AI loop
// Find the existing AI decision logic (around line 400-600)

// Add near other action decisions
if (player.stamina >= 2 && timeSinceLastAction > 500) {
  const shouldSwitch = shouldAISwitchStanceSide(
    personality,
    currentLaterality, // Get from stance manager
    opponentLaterality, // Get from opponent
    player.health / 100
  );
  
  if (shouldSwitch) {
    // Execute stance side switch
    onStanceChange?.(player.id, "SWITCH_SIDE");
  }
}
```

## Testing Checklist

### Unit Tests
- [ ] `handleStanceSideSwitch` updates laterality state
- [ ] Q key triggers side switch action
- [ ] AI laterality decisions follow personality
- [ ] Guard pose mirrors correctly for left stance
- [ ] Laterality indicator displays correct text

### Integration Tests
- [ ] Combat screen with laterality switching
- [ ] Player HUD shows L/R indicator
- [ ] Skeletal rendering shows mirrored guard
- [ ] AI switches sides strategically
- [ ] Training mode allows practice

### Performance Tests
- [ ] 60fps maintained with laterality
- [ ] No memory leaks from laterality state
- [ ] Guard pose caching effective
- [ ] Smooth animation transitions

## Deployment Steps

1. **Commit Phase 4 changes** (Skeletal + State)
2. **Test visual rendering**
3. **Commit Phase 5 changes** (HUD indicators)
4. **Test UI display**
5. **Commit Phase 6 changes** (Controls)
6. **Test player interaction**
7. **Commit Phase 7-8 changes** (Combat + AI)
8. **Full integration test**
9. **Playtest and balance**
10. **Final commit and PR update**

## Common Issues & Solutions

### Issue: Guard pose not mirroring
**Solution**: Check laterality prop is passed to SkeletalPlayer3D and guard pose effect dependencies include laterality

### Issue: Q key not responding
**Solution**: Verify keyboard event handler is active and handleStanceSideSwitch is in scope

### Issue: Laterality not persisting
**Solution**: Ensure setPlayerLaterality is called in handleStanceSideSwitch and state is properly lifted

### Issue: Performance drop
**Solution**: Verify guard pose caching, use React.memo on LateralityIndicator, check for unnecessary re-renders

---

**Ready for implementation!** Follow these steps in order for smooth integration.

**흑괘의 길을 걸어라** - *Walk the Path of the Black Trigram*
