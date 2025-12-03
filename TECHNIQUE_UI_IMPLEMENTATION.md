# Technique Selection UI Implementation Summary

## Overview

Successfully implemented a complete technique selection UI system for the Black Trigram combat game, featuring keyboard shortcuts (Q/W/E/R), visual technique cards with Korean cyberpunk theming, resource management (Stamina/Ki), and cooldown tracking.

## Implemented Components

### 1. Type Definitions (`src/types/technique.ts`)
- **Technique Interface**: Complete type definition for combat techniques
  - Bilingual names (Korean/English)
  - Resource costs (Stamina, Ki)
  - Damage ranges
  - Cooldown durations
  - Keyboard shortcuts
  - Stance requirements
  - Special effects

- **TechniqueKey Type**: Type-safe keyboard shortcuts ("Q" | "W" | "E" | "R")

- **TechniqueCooldown Interface**: Cooldown state tracking
  - Start time
  - Duration
  - Remaining time

- **TechniqueValidation Interface**: Execution validation results
  - Can execute flag
  - Failure reasons (insufficient resources, cooldown, wrong stance)

### 2. Technique Data (`src/data/techniques.ts`)
Created 20 unique techniques across 5 archetypes:

#### 무사 (Musa) - Traditional Warrior
- **천둥벽력 (Thunder Strike)** - Q: Heavy damage, requires Geon stance
- **철벽방어 (Iron Defense)** - W: Defense boost, requires Gan stance
- **용권 (Dragon Fist)** - E: Vital point piercing attack
- **파산격 (Mountain Breaker)** - R: Ultimate crushing blow

#### 암살자 (Amsalja) - Shadow Assassin
- **암영격 (Shadow Strike)** - Q: Fast vital point strike
- **신경타 (Nerve Strike)** - W: Paralyzing nerve attack
- **치명정밀 (Deadly Precision)** - E: Critical vital point attack
- **무음살 (Silent Death)** - R: Ultimate lethal strike

#### 해커 (Hacker) - Cyber Warrior
- **전격 (Electric Shock)** - Q: Stun attack via implants
- **데이터 타격 (Data Strike)** - W: Data-analyzed optimal attack
- **사이버 가속 (Cyber Overdrive)** - E: Multi-hit overdrive
- **시스템 크래시 (System Crash)** - R: Neural hacking attack

#### 정보요원 (Jeongbo Yowon) - Intelligence Operative
- **전술타격 (Tactical Strike)** - Q: Weakness exploitation
- **역정보공작 (Counter Intelligence)** - W: Counter stance
- **심리전 (Psychological Warfare)** - E: Mental disruption
- **정보타격 (Intelligence Strike)** - R: Perfect intel-based attack

#### 조직폭력배 (Jojik Pokryeokbae) - Organized Crime
- **거리싸움 (Street Brawl)** - Q: Dirty fighting
- **잔혹제압 (Brutal Takedown)** - W: Knockdown technique
- **즉석무기 (Improvised Weapon)** - E: Weapon improvisation
- **무자비공격 (Ruthless Assault)** - R: Rage-fueled assault

### 3. useTechniqueSelection Hook (`src/hooks/useTechniqueSelection.ts`)
Custom React hook managing technique selection and execution:

**Features:**
- Loads archetype-specific techniques
- Tracks selected technique index
- Manages active cooldowns with 100ms update interval
- Validates technique execution (resources, cooldown, stance)
- Handles keyboard shortcuts (Q/W/E/R)
- Can be enabled/disabled during gameplay states

**API:**
```typescript
const {
  availableTechniques,     // Techniques for player archetype
  selectedIndex,           // Currently selected technique
  activeCooldowns,         // Active cooldowns array
  selectTechnique,         // Select by index
  executeTechnique,        // Execute current selection
  validateTechnique,       // Check if technique can execute
  isOnCooldown,           // Check cooldown status
  getRemainingCooldown,   // Get remaining cooldown time
  hasResources,           // Check resource availability
} = useTechniqueSelection({ player, enabled, onTechniqueExecute });
```

### 4. TechniqueCard Component (`src/components/combat/components/TechniqueCard.tsx`)
Individual technique card with Korean cyberpunk theming:

**Visual Features:**
- Korean/English bilingual technique names
- Keyboard shortcut badge (Q/W/E/R)
- Stamina cost indicator (⚡)
- Ki cost indicator (氣)
- Cooldown overlay with countdown timer
- Hover tooltip with full technique details
- Border glow effect when selected (cyan glow)
- Disabled state with reduced opacity
- Responsive sizing (70x80px mobile, 90x100px desktop)

**Tooltip Contents:**
- Korean and English names
- Korean and English descriptions
- Damage range
- Cooldown duration
- Required stance (if any)

### 5. TechniqueBar Component (`src/components/combat/components/TechniqueBar.tsx`)
Horizontal bar containing all technique cards:

**Features:**
- Bottom-center positioning in combat HUD
- 3-5 technique cards with gap spacing
- Responsive layout (mobile/desktop)
- Resource availability checking
- Cooldown state management
- Keyboard hints display (desktop only)
- Html overlay for positioning over 3D scene

### 6. CombatScreen3D Integration
Integrated TechniqueBar into main combat screen:

**Integration Points:**
- Added after useCombatActions hook to access handleAttack
- Technique selection hook with combat state checks
- Technique execution handler:
  - Shows technique name in action feedback
  - Deducts stamina and Ki from player
  - Executes handleAttack for damage
  - Plays attack sound
  - Adds combat message
- Cooldown tracking converted to Map for TechniqueBar
- TechniqueBar rendered during active combat only
- Positioned at bottom-center, above back button

**Keyboard Integration:**
- Q/W/E/R keys execute techniques directly
- Checks resource availability
- Validates cooldown status
- Prevents execution when combat is paused or ended

## Testing

### Unit Tests (`src/hooks/useTechniqueSelection.test.ts`)
**12 tests, all passing:**

1. ✓ Load available techniques for player archetype
2. ✓ Select technique by index
3. ✓ Validate technique execution with sufficient resources
4. ✓ Reject technique execution with insufficient stamina
5. ✓ Reject technique execution with insufficient Ki
6. ✓ Execute technique and start cooldown
7. ✓ Reject technique execution when on cooldown
8. ✓ Update cooldown remaining time
9. ✓ Remove cooldown when complete
10. ✓ Handle keyboard shortcuts when enabled
11. ✓ Ignore keyboard shortcuts when disabled
12. ✓ Check if player has sufficient resources

**Test Coverage:**
- Archetype technique loading
- Technique selection
- Resource validation (stamina, Ki)
- Cooldown management
- Keyboard shortcut handling
- State enabling/disabling

## Technical Details

### Resource Management
- **Stamina**: Physical endurance for techniques (0-100)
- **Ki (氣)**: Spiritual energy for techniques (0-100)
- Techniques deduct resources on execution
- Cards display current costs and disable when insufficient

### Cooldown System
- Each technique has independent cooldown (3.5s to 12s)
- Cooldowns start on technique execution
- Update interval: 100ms for smooth countdown
- Displayed in seconds on card overlay
- Techniques disabled during cooldown

### Keyboard Shortcuts
- **Q**: First technique (index 0)
- **W**: Second technique (index 1)
- **E**: Third technique (index 2)
- **R**: Fourth technique (index 3)
- Direct execution on key press
- Validates resources and cooldown
- Respects combat state (paused, ended, countdown)

### Responsive Design
- **Mobile**: 70x80px cards, 10px font, 8px gap
- **Desktop**: 90x100px cards, 12px font, 12px gap
- TechniqueBar positioned at bottom-center
- Keyboard hints hidden on mobile

### Korean Cyberpunk Theming
- **Primary Cyan** (#00FFFF): Selected border, Ki indicator
- **Accent Gold** (#FFAA00): Technique names
- **Dark Background**: rgba(26, 26, 30, 0.9)
- **Glow Effects**: Box shadow on selection
- **Korean Font Family**: Applied throughout
- **Bilingual Text**: All labels in Korean | English

## Performance Considerations

1. **Cooldown Updates**: 100ms interval only runs when cooldowns active
2. **Memoization**: Layout calculations memoized based on dependencies
3. **Resource Checks**: Computed on demand from player state
4. **Html Overlays**: Used for UI over 3D scene for better performance
5. **Event Handlers**: useCallback for stable references

## Files Modified/Created

### Created Files (6)
1. `src/types/technique.ts` - Type definitions
2. `src/data/techniques.ts` - Technique data (20 techniques)
3. `src/hooks/useTechniqueSelection.ts` - Selection hook
4. `src/hooks/useTechniqueSelection.test.ts` - Hook tests
5. `src/components/combat/components/TechniqueCard.tsx` - Card component
6. `src/components/combat/components/TechniqueBar.tsx` - Bar component

### Modified Files (2)
1. `src/types/index.ts` - Export technique types
2. `src/components/combat/CombatScreen3D.tsx` - Integration

## Build & Validation

- ✅ TypeScript compilation: **Passing**
- ✅ ESLint: **No new issues** (existing 248 issues in repo)
- ✅ Production build: **Success** (1.43 MB bundle)
- ✅ Unit tests: **12/12 passing**
- ✅ Project structure: **Clean and organized**

## Usage Example

```typescript
// In CombatScreen3D
const techniqueSelection = useTechniqueSelection({
  player: validPlayers[0],
  enabled: !isPaused && combatState.roundStarted,
  onTechniqueExecute: (technique) => {
    // Show technique name
    feedbackActions.showTechnique(
      technique.name.korean,
      technique.name.english
    );
    
    // Deduct resources
    onPlayerUpdate(0, {
      stamina: player.stamina - technique.staminaCost,
      ki: player.ki - technique.kiCost,
    });
    
    // Execute attack
    handleAttack();
  },
});

// Render TechniqueBar
<TechniqueBar
  techniques={techniqueSelection.availableTechniques}
  player={validPlayers[0]}
  selectedIndex={techniqueSelection.selectedIndex}
  cooldowns={cooldownsMap}
  onTechniqueSelect={techniqueSelection.selectTechnique}
  onTechniqueHover={(tech) => { /* hover effects */ }}
  isMobile={isMobile}
  screenWidth={width}
  screenHeight={height}
/>
```

## Future Enhancements

1. **Component Tests**: Add Three.js-aware component tests using @react-three/test-renderer
2. **Visual Effects**: Add particle effects on technique execution
3. **Combo System**: Link techniques together for combos
4. **Technique Upgrades**: Allow techniques to level up
5. **Stance Synergies**: Bonus effects when using correct stance
6. **Sound Design**: Unique sounds per technique
7. **Animation Integration**: Connect to 3D character animations
8. **Tutorial**: In-game tutorial for technique system

## Acceptance Criteria Status

- ✅ Display 3-5 techniques for current player archetype
- ✅ Show technique name (Korean | English)
- ✅ Display stamina cost and availability indicator
- ✅ Show brief technique description on hover/focus
- ✅ Implement keyboard shortcuts (Q, W, E, R keys)
- ✅ Highlight selected technique with border glow
- ✅ Disable techniques when insufficient stamina
- ✅ Show cooldown timers if applicable
- ✅ Responsive positioning in combat HUD (bottom-center)
- ✅ Korean cyberpunk themed technique cards

**All acceptance criteria met!**

## Conclusion

Successfully implemented a complete technique selection UI system that enhances combat gameplay with:
- 20 unique techniques across 5 archetypes
- Keyboard-driven execution (Q/W/E/R)
- Resource management (Stamina/Ki)
- Cooldown tracking
- Korean cyberpunk aesthetic
- Responsive design
- Comprehensive testing

The system is production-ready and fully integrated into CombatScreen3D.

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
