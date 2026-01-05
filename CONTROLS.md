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

> ✅ **NEW: Zero-Conflict Control Scheme** (Current Version):
> 
> In **v0.5.37**, all **currently implemented** controls avoid conflicts: technique keys (Q-E-R-T-Y-F-G-Z-X-C) are positioned around WASD for easy reach with your left hand while keeping WASD free for movement.
> 
> - **Techniques (now)**: Use keys around WASD (Q, E, R, T, Y, F, G, Z, X, C)
> - **Movement**: WASD remains fully functional
> - **No browser conflicts**: No function keys or Ctrl shortcuts
> - **Ergonomic**: All keys within easy reach of left hand
> - **⚠️ Future Note**: The planned **Advanced Footwork System** (NOT YET IMPLEMENTED) proposes using `X` for **Swap Front Foot** and `Z` for **Short Step**. In that future update, technique bindings for `Z`/`X` may be remapped to avoid conflicts; refer to this document's version header for the active scheme.

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
- **Cooldown**: 4-12 seconds depending on power level
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
4. **Cooldown Period** - Wait 4-12 seconds before reusing (varies by technique)
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

#### 3.1 Basic Movement

**WASD or Arrow Keys** - 8-directional movement
- **W / ↑**: Forward | 전진 (Jeonjin)
- **S / ↓**: Backward | 후퇴 (Hutoe)
- **A / ←**: Left | 좌 (Jwa)
- **D / →**: Right | 우 (U)
- **Diagonals**: Combine keys for 45° angles | 대각선 이동 (Daegakseon Idong)

#### 3.2 Tactical Steps (전술보법 - Shift+WASD)

**Shift + WASD** - Precise 30cm tactical repositioning (18 frames, 300ms)

Tactical steps execute committed footwork movements for positional advantage:

| **Input** | **Direction** | **Korean** | **Distance** | **Duration** |
|-----------|---------------|------------|--------------|--------------|
| `Shift+W` | Forward Step | 전진보법 | 30cm | 300ms |
| `Shift+S` | Retreat Step | 후퇴보법 | 30cm | 300ms |
| `Shift+A` | Left Step | 좌측면보법 | 30cm | 300ms |
| `Shift+D` | Right Step | 우측면보법 | 30cm | 300ms |
| `Shift+W+A` | Forward-Left | 전좌측보법 | 30cm | 300ms |
| `Shift+W+D` | Forward-Right | 전우측보법 | 30cm | 300ms |
| `Shift+S+A` | Back-Left | 후좌측보법 | 30cm | 300ms |
| `Shift+S+D` | Back-Right | 후우측보법 | 30cm | 300ms |

**Tactical Step Properties:**
- ✅ **Non-interruptible**: Committed movement (Priority 5)
- ✅ **Guard maintained**: Fighting stance preserved
- ✅ **Stamina cost**: 5 stamina per step
- ✅ **Precise distance**: Exactly 30cm (one foot width)

#### 3.3 Advanced Footwork Patterns (보법 체계 - Ctrl+WASD) ⭐ NEW

**Ctrl + WASD** - Specialized Korean martial arts footwork patterns

Advanced footwork adds 4 distinct movement patterns for tactical combat positioning:

##### Circular Steps (원형보 - Wonhyeongbo)
Lateral movement while maintaining guard facing forward.

| **Input** | **Pattern** | **Korean** | **Distance** | **Duration** |
|-----------|-------------|------------|--------------|--------------|
| `Ctrl+A` | Circular Left | 원형보 좌 | 30cm lateral | 300ms (18 frames) |
| `Ctrl+D` | Circular Right | 원형보 우 | 30cm lateral | 300ms (18 frames) |

**Circular Step Properties:**
- 🎯 **Maintains guard facing**: Body stays oriented toward opponent
- ⚡ **Non-interruptible**: Committed footwork (Priority 5)
- 🥋 **Tactical advantage**: Circle around opponent while keeping guard
- 📊 **Same distance as tactical steps**: 30cm movement

##### Slide Steps (미끄럼보 - Mikkeureombo)
Both feet move together without weight transfer.

| **Input** | **Pattern** | **Korean** | **Distance** | **Duration** |
|-----------|-------------|------------|--------------|--------------|
| `Ctrl+W` | Slide Forward | 미끄럼보 전 | 30cm | 200ms (12 frames) |
| `Ctrl+S` | Slide Back | 미끄럼보 후 | 30cm | 200ms (12 frames) |

**Slide Step Properties:**
- 🏃 **Faster than tactical steps**: 200ms vs 300ms
- 🔄 **Interruptible**: Can be canceled (Priority 4)
- ⚖️ **Stable base**: Both feet move together
- 🎯 **Good for spacing**: Quick in/out without commitment

##### Pivot Rotations (축족회전 - Chukjok Hoejeon)
90° rotation on planted foot for angle changes.

| **Input** | **Pattern** | **Korean** | **Rotation** | **Duration** |
|-----------|-------------|------------|--------------|--------------|
| `Ctrl+Q` | Pivot Left | 축족회전 좌 | 90° counter-clockwise | 250ms (15 frames) |
| `Ctrl+E` | Pivot Right | 축족회전 우 | 90° clockwise | 250ms (15 frames) |

**Pivot Properties:**
- 🔄 **Fast direction change**: 90° rotation in 250ms
- 🎯 **Planted foot stays**: One foot is pivot point
- ⚡ **Non-interruptible**: Committed rotation (Priority 5)
- 🥋 **Tactical repositioning**: Change facing without retreating

##### Shuffle Step (섞음보 - Seokkeumbo)
Quick 15cm micro-adjustment for fine positioning.

| **Input** | **Pattern** | **Korean** | **Distance** | **Duration** |
|-----------|-------------|------------|--------------|--------------|
| `Ctrl+Space` | Shuffle | 섞음보 | 15cm any direction | 100ms (6 frames) |

**Shuffle Properties:**
- ⚡ **Fastest footwork**: Only 100ms (6 frames)
- 🎯 **Micro-adjustment**: Half the distance of other steps (15cm)
- 🔄 **Fully interruptible**: Can cancel anytime (Priority 3)
- 🏃 **Fine-tuning**: Perfect for precise positioning

##### Footwork Pattern Comparison

| Pattern | Korean | Frames | Duration | Distance | Priority | Interruptible | Use Case |
|---------|--------|--------|----------|----------|----------|---------------|----------|
| **Tactical Step** | 전술보법 | 18 | 300ms | 30cm | 5 | ❌ | Standard repositioning |
| **Circular** | 원형보 | 18 | 300ms | 30cm | 5 | ❌ | Lateral while maintaining guard |
| **Pivot** | 축족회전 | 15 | 250ms | 90° | 5 | ❌ | Fast angle changes |
| **Slide** | 미끄럼보 | 12 | 200ms | 30cm | 4 | ✅ | Quick in/out spacing |
| **Shuffle** | 섞음보 | 6 | 100ms | 15cm | 3 | ✅ | Micro-adjustments |

**Movement Control Philosophy:**
- **Regular WASD**: Continuous movement, no commitment
- **Shift+WASD**: Tactical steps with commitment (30cm)
- **Ctrl+WASD**: Advanced footwork patterns for specialized movement
- **All patterns**: Maintain 60fps performance target

---

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
