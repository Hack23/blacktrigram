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

src/App.css
src/App.tsx
src/audio
src/audio/AudioAssetRegistry.ts
src/audio/AudioManager.test.ts
src/audio/AudioManager.ts
src/audio/AudioManager.tsx
src/audio/AudioProvider.tsx
src/audio/AudioUtils.test.ts
src/audio/AudioUtils.ts
src/audio/DefaultSoundGenerator.ts
src/audio/index.ts
src/audio/placeholder-sounds.ts
src/audio/**tests**
src/audio/VariantSelector.ts
src/components
src/components/combat
src/components/combat/CombatScreen.tsx
src/components/combat/components
src/components/combat/components/CombatArena.tsx
src/components/combat/components/CombatControls.tsx
src/components/combat/components/CombatHUD.tsx
src/components/combat/components/CombatStats.tsx
src/components/combat/components/index.ts
src/components/combat/components/PlayerStatusPanel.tsx
src/components/combat/index.ts
src/components/game
src/components/game/DojangBackground.test.tsx
src/components/game/DojangBackground.tsx
src/components/game/GameAudio.test.tsx
src/components/game/GameEngine.test.tsx
src/components/game/GameEngine.tsx
src/components/game/HitEffectsLayer.tsx
src/components/game/index.ts
src/components/game/Player.test.tsx
src/components/game/Player.tsx
src/components/game/PlayerVisuals.tsx
src/components/index.ts
src/components/intro
src/components/intro/components
src/components/intro/components/ControlsSection.tsx
src/components/intro/components/index.ts
src/components/intro/components/MenuSection.tsx
src/components/intro/components/PhilosophySection.tsx
src/components/intro/index.ts
src/components/intro/IntroScreen.css
src/components/intro/IntroScreen.tsx
src/components/training
src/components/training/components
src/components/training/components/constants
src/components/training/components/constants/trainingModes.ts
src/components/training/components/effects
src/components/training/components/effects/TrainingVisualEffects.tsx
src/components/training/components/hooks
src/components/training/components/hooks/useTrainingFeedback.ts
src/components/training/components/hooks/useTrainingSession.test.ts
src/components/training/components/hooks/useTrainingSession.ts
src/components/training/components/hooks/useTrainingStatistics.test.ts
src/components/training/components/hooks/useTrainingStatistics.ts
src/components/training/components/index.ts
src/components/training/components/TrainingArtDisplay.test.tsx
src/components/training/components/TrainingArtDisplay.tsx
src/components/training/components/TrainingAudioManager.test.tsx
src/components/training/components/TrainingAudioManager.tsx
src/components/training/components/TrainingControls.test.tsx
src/components/training/components/TrainingControls.tsx
src/components/training/components/TrainingDummy.test.tsx
src/components/training/components/TrainingDummy.tsx
src/components/training/components/TrainingEnhancedIntegration.test.tsx
src/components/training/components/TrainingEnhancedIntegration.tsx
src/components/training/components/TrainingFeedbackSystem.test.tsx
src/components/training/components/TrainingFeedbackSystem.tsx
src/components/training/components/TrainingModeSelector.test.tsx
src/components/training/components/TrainingModeSelector.tsx
src/components/training/components/TrainingScreen.test.tsx
src/components/training/components/TrainingStatisticsPanel.test.tsx
src/components/training/components/TrainingStatisticsPanel.tsx
src/components/training/components/TrainingStatistics.tsx
src/components/training/components/types
src/components/training/components/types/training.ts
src/components/training/components/useTrainingFeedback.test.ts
src/components/training/components/useTrainingSession.test.ts
src/components/training/components/utils
src/components/training/components/utils/trainingCalculations.ts
src/components/training/components/utils/trainingUtils.test.ts
src/components/training/components/utils/trainingUtils.ts
src/components/training/index.ts
src/components/training/systems
src/components/training/TrainingScreen.test.tsx
src/components/training/TrainingScreen.tsx
src/components/ui
src/components/ui/ArchetypeDisplay.tsx
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
src/components/ui/base/korean-text/components/KoreanPixiTextUtils.tsx
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
src/components/ui/base/PixiTestableComponents.tsx
src/components/ui/base/ResponsivePixiComponents.tsx
src/components/ui/EndScreen.tsx
src/components/ui/HealthBar.tsx
src/components/ui/HitEffectsLayer.tsx
src/components/ui/index.test.tsx
src/components/ui/index.ts
src/components/ui/KoreanHeader.test.tsx
src/components/ui/KoreanHeader.tsx
src/components/ui/Player.tsx
src/components/ui/PlayerVisuals.tsx
src/components/ui/ProgressTracker.tsx
src/components/ui/ResponsivePixiComponents.test.tsx
src/components/ui/RoundTimer.tsx
src/components/ui/ScoreDisplay.tsx
src/components/ui/StanceIndicator.tsx
src/components/ui/TrigramWheel.test.tsx
src/components/ui/TrigramWheel.tsx
src/Game.css
src/hooks
src/hooks/useTexture.ts
src/index.css
src/main.tsx
src/systems
src/systems/combat
src/systems/CombatSystem.test.ts
src/systems/CombatSystem.ts
src/systems/combat/TrainingCombatSystem.ts
src/systems/trigram
src/systems/trigram/KoreanCulture.test.ts
src/systems/trigram/KoreanCulture.ts
src/systems/trigram/KoreanTechniques.test.ts
src/systems/trigram/KoreanTechniques.ts
src/systems/trigram/StanceManager.test.ts
src/systems/trigram/StanceManager.ts
src/systems/TrigramSystem.test.ts
src/systems/TrigramSystem.ts
src/systems/trigram/TransitionCalculator.test.ts
src/systems/trigram/TransitionCalculator.ts
src/systems/trigram/TrigramCalculator.test.ts
src/systems/trigram/TrigramCalculator.ts
src/systems/vitalpoint
src/systems/vitalpoint/AnatomicalRegions.ts
src/systems/vitalpoint/DamageCalculator.ts
src/systems/vitalpoint/HitDetection.ts
src/systems/vitalpoint/KoreanAnatomy.ts
src/systems/vitalpoint/KoreanVitalPoints.ts
src/systems/VitalPointSystem.test.ts
src/systems/VitalPointSystem.ts
src/test
src/test/pixi-cypress-helpers.ts
src/test/pixi-test-helpers.ts
src/test/setup.ts
src/test/test-setup.ts
src/test/test-utils.ts
src/test/test-utils.tsx
src/test-types.ts
src/types
src/types/anatomy.ts
src/types/audio.ts
src/types/combat.ts
src/types/common.ts
src/types/components.ts
src/types/constants
src/types/constants/animations.ts
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
src/types/constants/ui.ts
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
src/types/training.ts
src/types/trigram.ts
src/types/ui.ts
src/utils
src/utils/colorUtils.ts
src/utils/effectUtils.ts
src/utils/hooks
src/utils/pixiExtensions.ts
src/utils/playerUtils.ts
src/vite-env.d.ts

### css

src/Game.css
src/App.css
src/index.css

## ART Image assets

src/assets/visual
src/assets/visual/archetypes
src/assets/visual/archetypes/amsalja.png
src/assets/visual/archetypes/hacker.png
src/assets/visual/archetypes/jeongbo_yowon.png
src/assets/visual/archetypes/jojik_pokryeokbae.png
src/assets/visual/archetypes/musa.png
src/assets/visual/bg
src/assets/visual/bg/archetyples
src/assets/visual/bg/archetyples/CyberpunkTeamDynamics.png
src/assets/visual/bg/archetyples/PlayerArchetypesExplained.png
src/assets/visual/bg/archetyples/PlayerArchetypesOverview.png
src/assets/visual/bg/dojang
src/assets/visual/bg/dojang/dojang_floor_tex.png
src/assets/visual/bg/dojang/dojang_wall_tex.png
src/assets/visual/bg/intro
src/assets/visual/bg/intro/intro_bg_loop.png
src/assets/visual/logo
src/assets/visual/logo/black-trigram-256.png
src/assets/visual/logo/black-trigram.png

## AUDIO assets

# Music

src/assets/audio/music/underground_theme.mp3
src/assets/audio/music/intro_theme.webm
src/assets/audio/music/intro_theme.mp3
src/assets/audio/music/archetype_themes/amsalja_shadow.mp3
src/assets/audio/music/archetype_themes/musa_warrior.mp3
src/assets/audio/music/archetype_themes/hacker_cyber.mp3
src/assets/audio/music/archetype_themes/jojik_street.mp3
src/assets/audio/music/archetype_themes/jeongbo_intel.mp3
src/assets/audio/music/archetype_themes
src/assets/audio/music/cyberpunk_fusion.webm
src/assets/audio/music/cyberpunk_fusion.mp3
src/assets/audio/music/combat_theme.webm
src/assets/audio/music/underground_theme.webm
src/assets/audio/music/combat_theme.mp3

# Sound effects

src/assets/audio/sfx/\*

## 🎯 Strict TypeScript Usage

**ALWAYS use explicit types from existing type system:**

**Component Reuse Strategy**

**ALWAYS check existing components before creating new ones:**

## 🎨 PixiJS + React Integration

### Pixie React Usage

```jsx
import { Application, extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { useCallback } from "react";

extend({
  Container,
  Graphics,
});

const MyComponent = () => {
  const drawCallback = useCallback((graphics) => {
    graphics.clear();
    graphics.setFillStyle({ color: "red" });
    graphics.rect(0, 0, 100, 100);
    graphics.fill();
  }, []);

  return (
    <Application>
      <pixiContainer x={100} y={100}>
        <pixiGraphics draw={drawCallback} />
      </pixiContainer>
    </Application>
  );
};
```

## Docs

### `extend`

One of the most important concepts to understand with v8 is `extend`. Normally `@pixi/react` would have to import all pf Pixi.js to be able to provide the full library as JSX components. Instead, we use an internal catalogue of components populated by the `extend` API. This allows you to define exactly which parts of Pixi.js you want to import, keeping your bundle sizes small.

To allow `@pixi/react` to use a Pixi.js component, pass it to the `extend` API:

```jsx
import { Container } from "pixi.js";
import { extend } from "@pixi/react";

extend({ Container });

const MyComponent = () => <pixiContainer />;
```

> [!CAUTION]
> Attempting to use components that haven't been passed to the `extend` API **will result in errors**.

### Components

#### `<Application>`

The `<Application>` component is used to wrap your `@pixi/react` app. The `<Application>` component can take [all props that can be set](https://pixijs.download/release/docs/app.ApplicationOptions.html) on [`PIXI.Application`](https://pixijs.download/release/docs/app.Application.html).

##### Example Usage

```jsx
import { Application } from "@pixi/react";

const MyComponent = () => {
  return <Application autoStart sharedTicker />;
};
```

###### `defaultTextStyle`

`defaultTextStyle` is a convenience property. Whatever is passed will automatically be assigned to Pixi.js's [`TextStyle.defaultTextStyle`](https://pixijs.download/release/docs/text.TextStyle.html#defaultTextStyle).

> [!NOTE]
> This property **is not retroactive**. It will only apply to text components created after `defaultTextStyle` is set. Any text components created before setting `defaultTextStyle` will retain the base styles they had before `defaultTextStyle` was changed.

###### `extensions`

`extensions` is an array of extensions to be loaded. Adding and removing items from this array will automatically load/unload the extensions. The first time this is handled happens before the application is initialised. See Pixi.js's [`extensions`](https://pixijs.download/release/docs/extensions.html) documentation for more info on extensions.

###### `resizeTo`

The `<Application>` component supports the `resizeTo` property, with some additional functionality: it can accept any HTML element **or** it can take a React `ref` directly.

```jsx
import { Application } from "@pixi/react";
import { useRef } from "react";
const MyComponent = () => {
  const parentRef = useRef(null);
  return (
    <div ref={parentRef}>
      <Application resizeTo={parentRef} />
    </div>
  );
};
```

#### Pixi Components

All other components should be included in your IDE's intellisense/autocomplete once you've installed/imported `@pixi/react`. If it's exported from Pixi.js, it's supported as a component with the `pixi` prefix. Here's a selection of commonly used components:

```jsx
<pixiContainer />
<pixiGraphics />
<pixiSprite />
<pixiAnimatedSprite />
<pixiText />
<pixiHtmlText />
```

##### `<pixiGraphics>`

The `pixiGraphics` component has a special `draw` property. `draw` takes a callback which receives the `Graphics` context, allowing drawing to happen on every tick.

```jsx
const MyComponent = () => {
  return (
    <pixiGraphics
      draw={(graphics) => {
        graphics.clear();
        graphics.setFillStyle({ color: "red" });
        graphics.rect(0, 0, 100, 100);
        graphics.fill();
      }}
    />
  );
};
```

#### Custom Components

`@pixi/react` supports custom components via the `extend` API. For example, you can create a `<viewport>` component using the [`pixi-viewport`](https://github.com/davidfig/pixi-viewport) library:

```jsx
import { extend } from "@pixi/react";
import { Viewport } from "pixi-viewport";

extend({ Viewport });

const MyComponent = () => {
  <viewport>
    <pixiContainer />
  </viewport>;
};
```

The `extend` API will teach `@pixi/react` about your components, but TypeScript won't know about them nor their props.

### Hooks

#### `useApplication`

`useApplication` allows access to the parent `PIXI.Application` created by the `<Application>` component. This hook _will not work_ outside of an `<Application>` component. Additionally, the parent application is passed via [React Context](https://react.dev/reference/react/useContext). This means `useApplication` will only work appropriately in _child components_, and in the same component that creates the `<Application>`.

For example, the following example `useApplication` **will not** be able to access the parent application:

```jsx
import { Application, useApplication } from "@pixi/react";

const ParentComponent = () => {
  // This will cause an invariant violation.
  const { app } = useApplication();

  return <Application />;
};
```

Here's a working example where `useApplication` **will** be able to access the parent application:

```jsx
import { Application, useApplication } from "@pixi/react";

const ChildComponent = () => {
  const { app } = useApplication();

  console.log(app);

  return <container />;
};

const ParentComponent = () => (
  <Application>
    <ChildComponent />
  </Application>
);
```

#### `useExtend`

`useExtend` allows the `extend` API to be used as a React hook. Additionally, the `useExtend` hook is memoised, while the `extend` function is not.

```jsx
import { Container } from "pixi.js";
import { useExtend } from "@pixi/react";

const MyComponent = () => {
  useExtend({ Container });

  return <container />;
};
```

#### `useTick`

`useTick` allows a callback to be attached to the [`Ticker`](https://pixijs.download/release/docs/ticker.Ticker.html) on the parent application.

```jsx
import { useTick } from "@pixi/react";

const MyComponent = () => {
  useTick(() => console.log("This will be logged on every tick"));
};
```

`useTick` optionally takes an options object. This allows control of all [`ticker.add`](https://pixijs.download/release/docs/ticker.Ticker.html#add) options, as well as adding the `isEnabled` option. Setting `isEnabled` to `false` will cause the callback to be disabled until the argument is changed to true again.

```jsx
import { useState } from 'react'
import { useTick } from '@pixi/react'

const MyComponent = () => {
  const [isEnabled, setIsEnabled] = useState(false)

  useTick(() => console.log('This will be logged on every tick as long as `isEnabled` is `true`'), isEnabled)

  return (
    <sprite onClick={setIsEnabled(previousState => !previousState)}>
  )
}
```

### For Typescript Users

#### Custom Components

`@pixi/react` already offers types for built-in components, but custom components need to be added to the library's type catalogue so it knows how to handle them. This can be achieved by adding your custom components to the `PixiElements` interface. Here's what it may look like to add the `viewport` component from our earlier `extend` example:

```ts
// global.d.ts
import { type PixiReactElementProps } from "@pixi/react";
import { type Viewport } from "pixi-viewport";

declare module "@pixi/react" {
  interface PixiElements {
    viewport: PixiReactElementProps<typeof Viewport>;
  }
}
```

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
