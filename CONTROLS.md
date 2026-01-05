# 🎮 Black Trigram (흑괘) - Complete Controls Reference

**Version**: 0.5.37  
**Last Updated**: January 2026  
**Status**: ✅ Production Ready

This document is the **single source of truth** for all game controls in Black Trigram. It describes the currently implemented control scheme and clearly marks planned future enhancements.

---

## 📋 Quick Reference

### Desktop Controls (Currently Implemented)

| **Action** | **Key(s)** | **Korean** | **Description** |
|------------|------------|------------|-----------------|
| **Stance 1 - ☰ Geon** | `1` | 건 (Heaven) | Bone-striking force |
| **Stance 2 - ☱ Tae** | `2` | 태 (Lake) | Joint manipulation |
| **Stance 3 - ☲ Li** | `3` | 리 (Fire) | Precise nerve strikes |
| **Stance 4 - ☳ Jin** | `4` | 진 (Thunder) | Stunning techniques |
| **Stance 5 - ☴ Son** | `5` | 손 (Wind) | Continuous pressure |
| **Stance 6 - ☵ Gam** | `6` | 감 (Water) | Flow and adaptation |
| **Stance 7 - ☶ Gan** | `7` | 간 (Mountain) | Defensive mastery |
| **Stance 8 - ☷ Gon** | `8` | 곤 (Earth) | Grounding techniques |
| **Technique 1-10** | `Q` `E` `R` `T` `Y` `F` `G` `Z` `X` `C` | 기술 실행 | Execute archetype techniques (3-10 available) |
| **Movement** | `W` `A` `S` `D` or Arrow Keys | 이동 | 8-directional tactical positioning |
| **Attack** | `Space` | 공격 | Execute current stance technique |
| **Block/Guard** | `B` | 방어 | Defensive positioning and blocks |
| **Vital Points Overlay** | `V` | 급소 표시 | Toggle anatomical targeting overlay |
| **Pause Menu** | `ESC` or `M` | 일시정지 | Pause game / Return to menu |

> ✅ **NEW: Zero-Conflict Control Scheme**:
> 
> **All control conflicts eliminated!**  Technique keys (Q-E-R-T-Y-F-G-Z-X-C) are positioned around WASD for easy reach with your left hand while keeping WASD free for movement.
> 
> - **Techniques**: Use keys around WASD (Q, E, R, T, Y, F, G, Z, X, C)
> - **Movement**: WASD remains fully functional
> - **No browser conflicts**: No function keys or Ctrl shortcuts
> - **Ergonomic**: All keys within easy reach of left hand

### Mobile Controls (Touch Screen)

| **Control** | **Location** | **Korean** | **Description** |
|-------------|--------------|------------|-----------------|
| **Virtual D-Pad** | Bottom-Left | 가상 방향키 | 8-directional movement (140x140px) |
| **Attack Button** | Bottom-Right | 공격 버튼 | Gold ⚡ button (80x80px) |
| **Block Button** | Bottom-Right | 방어 버튼 | Blue 🛡️ button (70x70px) |
| **Stance Wheel** | Bottom-Center | 자세 선택 | Circular 8-trigram selector (200px) |
| **Swipe Right →** | Anywhere | 전진 | Advance toward opponent |
| **Swipe Left ←** | Anywhere | 후퇴 | Retreat from opponent |
| **Swipe Up ↑** | Anywhere | 상단 공격 | High attack execution |
| **Swipe Down ↓** | Anywhere | 하단 공격 | Low attack execution |
| **Two-Finger Tap** | Anywhere | 급소 모드 | Toggle vital point targeting mode |

---

## 🎯 Detailed Control Specifications

### 1. Eight Trigram Stance System (팔괘 체계)

The core of Black Trigram combat is the Eight Trigrams stance system from the I Ching (易經). Each stance has unique combat properties and techniques.

#### ☰ 1: Geon (건 - Heaven)
- **Korean Name**: 건 (Geon)
- **English**: Heaven
- **Technique**: 천둥벽력 (Thunder Strike)
- **Combat Focus**: 골격타격 (Bone-striking force)
- **Effects**: Fractures, structural damage
- **Philosophy**: Direct overwhelming power from above

#### ☱ 2: Tae (태 - Lake)
- **Korean Name**: 태 (Tae)
- **English**: Lake
- **Technique**: 유수연타 (Flowing Strike)
- **Combat Focus**: 관절조작 (Joint manipulation)
- **Effects**: Dislocations, mobility loss
- **Philosophy**: Fluid redirection like water

#### ☲ 3: Li (리 - Fire)
- **Korean Name**: 리 (Li)
- **English**: Fire
- **Technique**: 화염지창 (Fire Spear)
- **Combat Focus**: 정밀신경타격 (Precise nerve strikes)
- **Effects**: Temporary paralysis, numbness
- **Philosophy**: Precise burning intensity

#### ☳ 4: Jin (진 - Thunder)
- **Korean Name**: 진 (Jin)
- **English**: Thunder
- **Technique**: 벽력일섬 (Lightning Strike)
- **Combat Focus**: 기절기법 (Stunning techniques)
- **Effects**: Disorientation, knockouts
- **Philosophy**: Explosive shocking power

#### ☴ 5: Son (손 - Wind)
- **Korean Name**: 손 (Son)
- **English**: Wind
- **Technique**: 선풍연격 (Whirlwind Combo)
- **Combat Focus**: 지속압박 (Continuous pressure)
- **Effects**: Gradual incapacitation
- **Philosophy**: Persistent grinding assault

#### ☵ 6: Gam (감 - Water)
- **Korean Name**: 감 (Gam)
- **English**: Water
- **Technique**: 수류반격 (Flowing Counter)
- **Combat Focus**: 적응반격 (Adaptive counters)
- **Effects**: Flow reversals, escapes
- **Philosophy**: Adaptive formless response

#### ☶ 7: Gan (간 - Mountain)
- **Korean Name**: 간 (Gan)
- **English**: Mountain
- **Technique**: 반석방어 (Rock Defense)
- **Combat Focus**: 방어전문 (Defensive mastery)
- **Effects**: Blocks, deflections, counters
- **Philosophy**: Immovable defensive positioning

#### ☷ 8: Gon (곤 - Earth)
- **Korean Name**: 곤 (Gon)
- **English**: Earth
- **Technique**: 대지포옹 (Earth Embrace)
- **Combat Focus**: 지면제압 (Ground control)
- **Effects**: Throws, takedowns, locks
- **Philosophy**: Grounding and overwhelming mass

---

### 2. Archetype Technique System (기술 체계)

**Implementation**: Q-E-R-T-Y-F-G-Z-X-C keys execute archetype-specific combat techniques (3-10 per archetype)

Each player archetype has unique techniques that reflect their combat philosophy. These techniques are more powerful than basic attacks but require Ki and Stamina resources.

#### Technique Properties
- **Keyboard Shortcuts**: `Q` `E` `R` `T` `Y` `F` `G` `Z` `X` `C` (up to 10 techniques)
- **Resource Cost**: Varies by technique (8-35 stamina, 10-35 Ki)
- **Cooldown**: 2-5 seconds depending on power level
- **Damage**: 25-55 base damage (higher than basic attacks)
- **Stance Requirement**: Some techniques require specific trigram stances
- **Zero Conflicts**: Keys positioned around WASD for easy access without interfering with movement

#### Archetype Technique Examples

##### 무사 (Musa) - Traditional Warrior
| Key | Technique | Korean | Damage | Cost | Stance | Description |
|-----|-----------|--------|--------|------|--------|-------------|
| `Q` | Thunder Strike | 천둥벽력 | 25-35 | 30🔋 20⚡ | ☰ Geon | Strike with power of heaven |
| `T` | Iron Defense | 철벽방어 | 0-5 | 20🔋 15⚡ | ☶ Gan | Immovable defensive stance |
| `E` | Dragon Fist | 용권 | 30-40 | 35🔋 25⚡ | Any | Pierce through with dragon's might |
| `R` | Mountain Breaker | 파산격 | 35-50 | 40🔋 30⚡ | ☰ Geon | Devastating blow that shatters mountains |

##### 암살자 (Amsalja) - Shadow Assassin
| Key | Technique | Korean | Damage | Cost | Stance | Description |
|-----|-----------|--------|--------|------|--------|-------------|
| `Q` | Shadow Strike | 암영격 | 20-35 | 25🔋 20⚡ | ☲ Li | Strike vital points with shadow speed |
| `T` | Nerve Strike | 신경타 | 15-25 | 30🔋 25⚡ | Any | Paralyze with precise nerve strikes |
| `E` | Deadly Precision | 치명정밀 | 25-45 | 35🔋 30⚡ | ☲ Li | Attack critical points with perfect accuracy |
| `R` | Silent Death | 무음살 | 40-60 | 45🔋 35⚡ | Any | Deliver a silent, lethal strike |

#### Technique Execution Flow

1. **Select Stance** (1-8) - Choose trigram stance for bonuses
2. **Check Resources** - Ensure sufficient Stamina (🔋) and Ki (⚡)
3. **Press Technique Key** (Q-E-R-T-Y-F-G-Z-X-C) - Execute the technique
4. **Cooldown Period** - Wait 2-12 seconds before reusing (varies by technique)
5. **Resource Regeneration** - Stamina and Ki regenerate over time

**Note**: Only the first 10 techniques per archetype are assigned keyboard shortcuts. Additional techniques (if any) can be accessed via mouse/touch on the technique bar.

#### Technique UI Indicators

- **Technique Bar**: Displays available techniques with icons and shortcuts
- **Green Indicator**: Technique ready to use
- **Red Indicator**: Insufficient resources or on cooldown
- **Cooldown Timer**: Shows remaining time before technique available
- **Resource Costs**: Displays 🔋 stamina and ⚡ Ki requirements

#### ✅ Zero-Conflict Design

**New Control Scheme Eliminates ALL Conflicts**:
- **Q, E, R, T, Y**: Top row keys around WASD
- **F, G**: Middle row keys near left hand
- **Z, X, C**: Bottom row keys under left hand
- **Result**: No interference with WASD movement, no browser shortcuts, no function keys

**Left Hand Layout**:
```
[1][2][3][4][5][6][7][8]  ← Stances
   [Q][W][E][R][T][Y]     ← Techniques (Q,E,R,T,Y) + Movement (W)
    [A][S][D][F][G]       ← Movement (A,S,D) + Techniques (F,G)
     [Z][X][C][V][B]      ← Techniques (Z,X,C) + Vital Points (V) + Block (B)
      [Space]             ← Attack
```

---

### 3. Movement Controls (이동 조작)

**Current Implementation**: Simple 8-directional movement on arena grid

| **Keys** | **Action** | **Description** |
|----------|------------|-----------------|
| `W` or `↑` | Move Up/North | Move one grid cell north |
| `A` or `←` | Move Left/West | Move one grid cell west |
| `S` or `↓` | Move Down/South | Move one grid cell south |
| `D` or `→` | Move Right/East | Move one grid cell east |
| `W+A` or `↖` | Move Northwest | Diagonal movement northwest |
| `W+D` or `↗` | Move Northeast | Diagonal movement northeast |
| `S+A` or `↙` | Move Southwest | Diagonal movement southwest |
| `S+D` or `↘` | Move Southeast | Diagonal movement southeast |

**Movement Properties**:
- Speed varies by stance (fast stances: Geon/Son, slow stances: Gon/Jin)
- Stamina cost: 5-7 per cell moved
- Animation: 8-10 frames per movement
- Boundaries: Octagonal arena with out-of-bounds detection

---

### 3. Combat Actions (전투 조작)

#### Attack (Space)
- **Key**: `Spacebar`
- **Korean**: 공격 (Gonggyeok)
- **Function**: Execute the current stance's primary technique
- **Properties**:
  - Damage determined by stance and vital point targeting
  - Stamina cost: 8-15 depending on technique
  - Animation frames: 12-20
  - Range: Melee (adjacent cells)
  - Can be blocked or parried

#### Block/Guard (B)
- **Key**: `B`
- **Korean**: 방어 (Bang-eo)
- **Function**: Enter defensive guard position
- **Properties**:
  - Reduces incoming damage by stance-specific percentage
  - Stamina cost: 3 (tap) or 2/sec (hold)
  - Vital Resistance Bonus: +15-30% depending on stance
  - Best stances for blocking: Gan (Mountain), Gon (Earth)

---

### 4. Special Features (특수 기능)

#### Vital Points Overlay (V)
- **Key**: `V`
- **Korean**: 급소 표시 (Geupso Pyosi)
- **Function**: Toggle anatomical vital point overlay
- **Features**:
  - Shows all 70 authentic vital points
  - Filter by severity (Lethal, Critical, Major, Moderate, Minor)
  - Filter by body region (Head, Torso, Arms, Legs)
  - Search by Korean or English name
  - Scale adjustment (0.5x - 2.0x)
  - Label toggle
  - Animation toggle

#### Pause/Menu (ESC or M)
- **Keys**: `ESC` or `M`
- **Korean**: 일시정지 (Ilsijeongji)
- **Function**: Pause game or return to menu
- **Options in Pause Menu**:
  - Resume (다시 시작)
  - Restart Match (재시합)
  - Return to Menu (메뉴로 돌아가기)
  - Audio Volume Controls

---

### 5. Mobile Touch Controls (모바일 터치 조작)

Black Trigram provides comprehensive touch controls optimized for mobile devices (375x667px and larger).

#### Virtual D-Pad (가상 방향키)
- **Location**: Bottom-left corner
- **Size**: 140x140px total, 48x48px buttons
- **Function**: 8-directional movement
- **Safe Area**: 34px from bottom for iOS/Android notches
- **Haptic Feedback**: Light vibration (10ms) on direction press

#### Action Buttons (행동 버튼)
- **Location**: Bottom-right corner
- **Attack Button**:
  - Size: 80x80px
  - Icon: ⚡ (Gold)
  - Function: Execute stance technique
  - Haptic: Medium vibration (50ms)
- **Block Button**:
  - Size: 70x70px
  - Icon: 🛡️ (Blue)
  - Function: Activate guard
  - Haptic: Medium vibration (50ms)

#### Stance Wheel (자세 휠)
- **Location**: Bottom-center
- **Size**: 200px diameter when expanded
- **Function**: Select one of 8 trigram stances
- **Layout**: Circular with 8 trigram symbols
- **Activation**: Tap to expand, tap symbol to select
- **Korean Names**: 건 태 리 진 손 감 간 곤
- **Haptic**: Light vibration (10ms) on selection

#### Gesture Controls (제스처 조작)
- **Swipe Right** (→): Advance/forward dash
- **Swipe Left** (←): Retreat/backward dash
- **Swipe Up** (↑): High attack/jump attack
- **Swipe Down** (↓): Low attack/sweep
- **Two-Finger Tap**: Toggle vital point overlay

#### Mobile Haptic Feedback
- **Light** (10ms): Menu navigation, D-pad movement
- **Medium** (50ms): Attack execution, block activation
- **Heavy** (100ms): Critical hits, vital point strikes, match events

---

## 🚧 Future Control Enhancements (Planned)

The following controls are documented in `game-design.md` but **NOT YET IMPLEMENTED**. They are planned for future releases.

### Advanced Footwork System (PLANNED)

#### Swap Front Foot (X)
- **Status**: 🚧 Not Implemented
- **Key**: `X`
- **Function**: Mirror stance by swapping which foot is forward
- **Properties**:
  - Stamina cost: 2
  - Frames: 6
  - No position change
  - Changes attack/defense angles

#### Short Step (Z + Arrow)
- **Status**: 🚧 Not Implemented
- **Keys**: `Z` + Direction Arrow
- **Function**: Move one cell while keeping current front foot forward
- **Properties**:
  - Stamina cost: 5
  - Frames: 10
  - No auto-pivot
  - Maintains attack angle

#### Step & Swap (X + Arrow)
- **Status**: 🚧 Not Implemented
- **Keys**: `X` + Direction Arrow
- **Function**: Mirror foot, then move one cell
- **Properties**:
  - Stamina cost: 10
  - Frames: 14
  - Changes both position and foot
  - Full orientation change

### Advanced Attack System (PLANNED)

#### Directional Attacks (PLANNED)
- **Space + ↑**: Front-leg kick (12 stamina, 16 frames)
- **Space + ←**: Front-elbow strike (10 stamina, 14 frames)
- **Space + ↓**: Front-knee strike (10 stamina, 14 frames)
- **Space + →**: Back-hand strike (9 stamina, 13 frames)

#### Rotational Backcast (PLANNED)
- **Keys**: `Space` then `↓` in same frame
- **Function**: 180° pivot + spinning back strike
- **Properties**:
  - Stamina cost: 15
  - Frames: 20 (10 pivot + 10 strike)
  - Full position reversal

#### Queued Attacks (PLANNED)
- **Keys**: Hold `Space+Arrow` during movement
- **Function**: Queue attack to execute immediately after movement lands
- **Properties**:
  - Reduces reaction time
  - Enables smooth combos

---

## ⚙️ Control Customization

### Current State
- Controls are **hardcoded** with defaults defined in `src/utils/controlMapping.ts`
- No in-game customization UI currently available
- LocalStorage persistence implemented but not exposed to users

### Planned Customization Features
- [ ] In-game control remapping UI
- [ ] Preset control schemes (Classic, FPS-style, Fighting Game)
- [ ] Gamepad support with customization
- [ ] Control conflict detection and resolution
- [ ] Export/import control configurations

---

## 🎮 Control Design Philosophy

### Principles
1. **Accessibility First**: All actions available via keyboard, mouse, touch, and gamepad
2. **No Hidden Inputs**: All controls clearly documented and discoverable
3. **Muscle Memory**: Consistent key positions across all screens
4. **Cultural Respect**: Korean terminology and philosophy integrated authentically
5. **60fps Responsive**: All inputs processed at 60Hz with minimal latency

### Korean Martial Arts Integration
- **8 Stances** based on I Ching trigrams (팔괘)
- **70 Vital Points** from Korean martial arts anatomy (급소)
- **Authentic Techniques** with Korean and English names
- **Philosophy-Driven**: Each stance embodies a natural element's combat principle

---

## 📱 Platform-Specific Notes

### Desktop
- ✅ Full keyboard support
- ✅ Mouse support for menus
- ⚠️ Gamepad support planned but not implemented
- Target: 60fps at 1920x1080

### Mobile
- ✅ Touch controls (375x667px minimum)
- ✅ Gesture recognition
- ✅ Haptic feedback
- ✅ Safe area aware (iOS/Android notches)
- Target: 30-60fps on mid-range devices

### Tablet
- ✅ Touch controls scaled for larger screens
- ✅ Landscape and portrait modes
- ⚠️ Stylus support planned
- Target: 60fps at 1024x768+

---

## 🧪 Testing Controls

### Manual Testing Checklist
- [ ] All 8 stances accessible via 1-8 keys
- [ ] WASD and Arrow keys both work for movement
- [ ] Spacebar executes attacks in all stances
- [ ] B key activates block in all stances
- [ ] V key toggles vital points overlay
- [ ] ESC and M both open pause menu
- [ ] Mobile D-pad responds to all 8 directions
- [ ] Mobile attack/block buttons responsive
- [ ] Mobile stance wheel selects all 8 stances
- [ ] Gesture recognition works (swipes, two-finger tap)
- [ ] Haptic feedback triggers correctly

### Automated Testing
- Control mapping tests: `src/utils/controlMapping.test.ts`
- Keyboard controls tests: `src/hooks/useKeyboardControls.test.ts`
- Combat controls tests: `src/components/combat/components/CombatControlsPanel.test.tsx`
- Mobile controls tests: `src/components/mobile/ActionButtons.test.tsx`

---

## 📖 References

### Code Implementation
- **Control Mapping**: `src/utils/controlMapping.ts`
- **Combat Controls**: `src/systems/types.ts` (line 744: `COMBAT_CONTROLS`)
- **Keyboard Hooks**: `src/hooks/useKeyboardControls.ts`
- **Mobile Controls**: `src/components/mobile/*`
- **Controls Screen**: `src/components/screens/ControlsScreenThreeJS.tsx`

### Documentation
- **Game Design**: `game-design.md` (lines 939-1133: Combat Controls & Stamina)
- **README Controls**: `README.md` (lines 213-287: Combat Controls section)
- **Game Status**: `game-status.md` (Overall implementation: 7.9/10)

### Testing
- **E2E Controls Test**: `cypress/e2e/screens/controls-screen.cy.ts`
- **Combat Screen Test**: `cypress/e2e/screens/combat-screen.cy.ts`
- **Unit Tests**: Multiple files in `src/` directories

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.5.37 | Jan 2026 | **Zero-conflict control redesign**: Technique keys changed from Q-W-E-R-T-Y-U-I-O-P to Q-E-R-T-Y-F-G-Z-X-C to eliminate WASD movement conflicts |
| 0.5.37 | Jan 2026 | Initial comprehensive controls documentation |
| 0.5.36 | Dec 2025 | Vital points overlay (V key) implemented |
| 0.5.30 | Nov 2025 | Mobile touch controls complete |
| 0.5.20 | Oct 2025 | Eight trigram stances finalized |

---

## 💡 Tips for Players

### Combat Effectiveness
- **Master Stances**: Each trigram has strengths against specific body regions
- **Mix Movement**: Don't just face-tank - positioning matters
- **Block Timing**: Tap B right before impact for bonus resistance
- **Vital Points**: Press V to study anatomy and target critical zones
- **Stance Cycling**: 1-8 keys cycle quickly - find your flow

### Mobile Players
- **Two-Handed**: Use D-pad with left thumb, buttons with right
- **Swipe Combos**: Combine swipes with button taps for variety
- **Stance Wheel**: Master quick taps - don't hold the wheel open
- **Haptics**: Feel the feedback - it tells you when inputs register

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

🥋 Master the controls. Master the combat. Master the art. 🥋
