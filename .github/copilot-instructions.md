# GitHub Copilot Instructions for Black Trigram (흑괘)

PRIO 1, complete functional game.
PRIO 2, Use graphics for all componets pixiJs and pixi react , react 19 style, strict typing,
PRIO 3, ui/ux cyberpunk style should be cool.


## Project Overview

Black Trigram is a **realistic 2D precision combat simulator** deeply rooted in Korean martial arts and the I Ching trigram philosophy. The game emphasizes anatomical realism, precise targeting, authentic martial techniques, and cyberpunk aesthetics.

**Genre**: 2D Realistic Precision Combat Simulator / Traditional Korean Martial Arts Training  
**Platform**: Web-based (HTML5/WebGL via PixiJS + React)  
**Core Focus**: Anatomical targeting, authentic Korean martial arts, 5 player archetypes, 70 vital points

## 🎯 Core Game Concepts

### Player Archetypes (Must Reference in All Combat Code)

- **무사 (Musa)** - Traditional Warrior: Honor through strength
- **암살자 (Amsalja)** - Shadow Assassin: Efficiency through invisibility
- **해커 (Hacker)** - Cyber Warrior: Information as power
- **정보요원 (Jeongbo Yowon)** - Intelligence Operative: Knowledge through observation
- **조직폭력배 (Jojik Pokryeokbae)** - Organized Crime: Survival through ruthlessness

### Eight Trigram Combat System (팔괘)

- **☰ 건 (Geon)** - Heaven: Direct bone-striking force
- **☱ 태 (Tae)** - Lake: Fluid joint manipulation
- **☲ 리 (Li)** - Fire: Precise nerve strikes
- **☳ 진 (Jin)** - Thunder: Stunning techniques
- **☴ 손 (Son)** - Wind: Continuous pressure
- **☵ 감 (Gam)** - Water: Blood flow restriction
- **☶ 간 (Gan)** - Mountain: Defensive counters
- **☷ 곤 (Gon)** - Earth: Ground techniques

### Combat Mechanics

- **70 Anatomical Vital Points** for precise targeting
- **Realistic Body Mechanics**: Health, consciousness, pain, balance, stamina
- **Authentic Korean Techniques** with cultural accuracy
- **Damage Calculation** based on technique precision and force

## 🏗️ Current Architecture

### System

src/audio/AudioAssetRegistry.ts
src/audio/AudioManager.ts
src/audio/AudioManager.tsx
src/audio/AudioProvider.tsx
src/audio/AudioUtils.ts
src/audio/DefaultSoundGenerator.ts
src/audio/index.ts
src/audio/placeholder-sounds.ts
src/audio/VariantSelector.ts
src/components
src/components/combat
src/components/combat/CombatScreen.tsx
src/components/combat/components
src/components/combat/components/CombatArena.tsx
src/components/combat/components/CombatControls.tsx
src/components/combat/components/CombatHUD.tsx
src/components/combat/components/index.ts
src/components/combat/index.ts
src/components/game
src/components/game/DojangBackground.tsx
src/components/game/GameEngine.tsx
src/components/game/GameUI.tsx
src/components/game/HitEffectsLayer.tsx
src/components/game/index.ts
src/components/game/Player.tsx
src/components/game/PlayerVisuals.tsx
src/components/index.ts
src/components/intro
src/components/intro/components
src/components/intro/components/ControlsSection.tsx
src/components/intro/components/MenuSection.tsx
src/components/intro/components/PhilosophySection.tsx
src/components/intro/index.ts
src/components/intro/IntroScreen.css
src/components/intro/IntroScreen.tsx
src/components/intro/sections
src/components/intro/sections/ControlsSection.tsx
src/components/intro/sections/index.ts
src/components/intro/sections/MenuSection.tsx
src/components/intro/sections/PhilosophySection.tsx
src/components/training
src/components/training/index.ts
src/components/training/TrainingScreen.tsx
src/components/ui
src/components/ui/base
src/components/ui/base/BackgroundGrid.tsx
src/components/ui/base/BaseButton.tsx
src/components/ui/base/index.ts
src/components/ui/base/KoreanHeader.tsx
src/components/ui/base/KoreanPixiComponents.tsx
src/components/ui/base/korean-text
src/components/ui/base/korean-text/components
src/components/ui/base/korean-text/components/index.ts
src/components/ui/base/korean-text/components/KoreanMartialText.tsx
src/components/ui/base/korean-text/components/KoreanPixiTextUtils.ts
src/components/ui/base/korean-text/components/KoreanStatusText.tsx
src/components/ui/base/korean-text/components/KoreanTechniqueText.tsx
src/components/ui/base/korean-text/components/KoreanText.tsx
src/components/ui/base/korean-text/components/KoreanTitle.tsx
src/components/ui/base/korean-text/constants.ts
src/components/ui/base/korean-text/hooks
src/components/ui/base/korean-text/hooks/useKoreanTextStyle.ts
src/components/ui/base/korean-text/index.ts
src/components/ui/base/korean-text/KoreanText.tsx
src/components/ui/base/korean-text/types.ts
src/components/ui/base/korean-text/utils.ts
src/components/ui/base/PixiComponents.tsx
src/components/ui/EndScreen.tsx
src/components/ui/index.ts
src/components/ui/KoreanHeader.tsx
src/components/ui/ProgressTracker.tsx
src/components/ui/TrigramWheel.tsx
src/hooks/useTexture.ts
src/main.tsx
src/systems/CombatSystem.ts
src/systems/trigram/KoreanCulture.ts
src/systems/trigram/KoreanTechniques.ts
src/systems/trigram/StanceManager.ts
src/systems/TrigramSystem.ts
src/systems/trigram/TransitionCalculator.ts
src/systems/trigram/TrigramCalculator.ts
src/systems/vitalpoint/AnatomicalRegions.ts
src/systems/vitalpoint/DamageCalculator.ts
src/systems/vitalpoint/HitDetection.ts
src/systems/vitalpoint/KoreanAnatomy.ts
src/systems/vitalpoint/KoreanVitalPoints.ts
src/systems/VitalPointSystem.ts
src/types/anatomy.ts
src/types/audio.ts
src/types/combat.ts
src/types/common.ts
src/types/components.ts
src/types/constants
src/types/constants/colors.ts
src/types/constants/combat.ts
src/types/constants/controls.ts
src/types/constants/game.ts
src/types/constants/index.ts
src/types/constants/player.ts
src/types/constants/techniques.ts
src/types/constants/trigram.ts
src/types/constants.ts
src/types/constants/typography.ts
src/types/constants/vital-points.ts
src/types/controls.ts
src/types/effects.ts
src/types/enums.ts
src/types/game.ts
src/types/index.ts
src/types/korean-text.ts
src/types/pixi-react.d.ts
src/types/player.ts
src/types/systems.ts
src/types/trigram.ts
src/types/ui.ts
src/utils/colorUtils.ts
src/utils/playerUtils.ts
src/vite-env.d.ts

### css

src/Game.css
src/App.css
src/index.css

## 🎯 Strict TypeScript Usage

**ALWAYS use explicit types from existing type system:**

**Component Reuse Strategy**

**ALWAYS check existing components before creating new ones:**

## 🎨 PixiJS + React Integration

## 🧪 Testing Strategy

### Existing Test Infrastructure (✅ Excellent)

- **Setup**: `src/test/setup.ts` (8) - PixiJS and audio mocking
- **Utils**: `src/test/test-utils.ts` (4) - Testing utilities
- **Audio Tests**: Comprehensive coverage in `src/audio/__tests__/`
- **System Tests**: Coverage for combat systems

### Test Patterns to Follow

Testing best pracices, using test id in code, testable code and resilient test

## 🎯 Core Game Design Philosophy

### Combat Pillars (Must Guide All Implementation)

- **정격자 (Jeonggyeokja)** - Precision Striker: Every strike targets anatomical vulnerabilities
- **비수 (Bisu)** - Lethal Technique: Realistic application of traditional martial arts
- **암살자 (Amsalja)** - Combat Specialist: Focus on immediate incapacitation
- **급소격 (Geupsogyeok)** - Vital Point Strike: Authentic pressure point combat

### Realistic Combat Mechanics

## 👤 Player Archetypes (Must Reference in All Combat Code)

## 🎨 Visual Design System

### Cyberpunk Korean Aesthetic (Apply to All Visual Components)

## 🎮 Combat Controls & UX

### Precision Input System (Implement in All Combat Components)

#### Primary Combat Controls

```typescript
// Combat control mapping
const COMBAT_CONTROLS = {
  // Trigram stance system (1-8 keys)
  stanceControls: {
    "1": { stance: "geon", korean: "건", technique: "천둥벽력" },
    "2": { stance: "tae", korean: "태", technique: "유수연타" },
    "3": { stance: "li", korean: "리", technique: "화염지창" },
    "4": { stance: "jin", korean: "진", technique: "벽력일섬" },
    "5": { stance: "son", korean: "손", technique: "선풍연격" },
    "6": { stance: "gam", korean: "감", technique: "수류반격" },
    "7": { stance: "gan", korean: "간", technique: "반석방어" },
    "8": { stance: "gon", korean: "곤", technique: "대지포옹" },
  },

  // Movement and combat actions
  movement: {
    WASD: "Tactical positioning and footwork",
    ArrowKeys: "Alternative movement system",
  },

  combat: {
    SPACE: "Execute current stance technique",
    SHIFT: "Defensive guard/block position",
    CTRL: "Precision vital point targeting mode",
    TAB: "Cycle through player archetypes",
  },

  // System controls
  system: {
    ESC: "Pause menu / Return to intro",
    F1: "Help / Controls guide",
    M: "Mute / Audio settings",
  },
};

// Implement responsive controls
function handleCombatInput(event: KeyboardEvent, player: PlayerState) {
  const key = event.key;

  // Stance changes (1-8)
  if (key >= "1" && key <= "8") {
    const stanceIndex = parseInt(key) - 1;
    const stance = TRIGRAM_STANCES_ORDER[stanceIndex];
    return executeStanceChange(player, stance);
  }

  // Combat actions
  switch (key) {
    case " ": // Space
      return executeTechnique(player);
    case "Shift":
      return toggleGuard(player);
    case "Control":
      return enterVitalPointMode(player);
  }
}
```

### Advanced UX Features

#### Visual Feedback System

## 🏗️ Implementation Patterns

### Component Structure (Follow EXISTING These Patterns)

### Testing Requirements (Follow Existing Patterns)

#### Combat System Tests

## 🌟 Success Criteria

When following these guidelines, code should:

- ✅ Implement authentic Korean martial arts mechanics
- ✅ Respect traditional Korean culture and terminology
- ✅ Achieve realistic combat physics and feedback
- ✅ Maintain cyberpunk aesthetic integration
- ✅ Provide comprehensive accessibility features
- ✅ Target 60fps performance for all combat
- ✅ Use existing type system and components extensively
- ✅ Include proper Korean-English bilingual support

## 🎯 Philosophy Integration

### Traditional Korean Values (Integrate into All Interactions)

**Remember**: Black Trigram represents the intersection of traditional Korean martial arts wisdom and modern interactive technology. Every implementation should honor this balance while providing authentic, educational, and respectful gameplay.

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
