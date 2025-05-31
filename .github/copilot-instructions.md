# Copilot Instructions

# 🎨 Black Trigram — Art & Asset Style Guide

**Goal:** Capture the dark, cyberpunk-meets-traditional Korean martial-arts vibe shown in the concept art, and translate it into a cohesive set of game assets—UI elements, icons, character silhouettes, environment textures, VFX, and more.

## Executive Summary

Black Trigram is a sophisticated 2D precision combat simulator deeply rooted in Korean martial arts and modern combat technology, set against a cyberpunk backdrop. It emphasizes anatomical realism, precise targeting, authentic martial techniques, and dark futuristic aesthetics.

Game Identity
Genre:
2D Realistic Precision Combat Simulator / Traditional Korean Martial Arts Training (Cyberpunk Style)

Platforms:

Web-based (HTML5/WebGL via PixiJS)

Optimized for authentic 60fps combat physics

Audience:

Fans of precise combat gameplay (Budokan, IK+)

Practitioners and enthusiasts of Korean martial arts

Cyberpunk aesthetics and narrative enthusiasts

Players seeking realistic and anatomical combat precision

Visual and Thematic Direction (Cyberpunk Korean Martial Arts)
Based on the concept art:

Dark cyberpunk aesthetic, blending traditional Korean martial attire with tactical modern gear.

## Coding Guidelines

- **Strict Typing:**
  - _Use explicit types and interfaces; avoid `any` (use `unknown` if needed)_.
  - _Leverage utility types (Pick, Omit, Partial) and always define return types_.
  - _Enable TypeScript's strict options in `tsconfig.json` (e.g., `strictNullChecks`, `noImplicitAny`)_.

## Testing Guidelines

- **Vite & Vitest Integration:**
  - Configure Vite and Vitest for fast feedback and native ESM support.
  - Separate unit and integration tests, leveraging Vite's watch mode and coverage tools.
  - Mock external dependencies using existing helpers with proper TypeScript typings.
- **Quality Standards:**
  - Aim for a minimum of 80% code coverage.
  - Write tests for critical business logic and security paths.

## Summary

## UX Components

https://www.npmjs.com/package/@pixi/react?activeTab=readme
https://pixijs.com/8.x/guides/getting-started/intro


src/main.tsx
src/components/intro/IntroScreen.tsx
src/components/intro/components/MenuSection.tsx
src/components/intro/components/ControlsSection.tsx
src/components/intro/components/PhilosophySection.tsx
src/components/game/GameUI.tsx
src/components/game/PlayerVisuals.tsx
src/components/game/GameEngine.tsx
src/components/game/HitEffectsLayer.tsx
src/components/game/DojangBackground.tsx
src/components/game/Player.tsx
src/components/ui/KoreanHeader.tsx
src/components/ui/TrigramWheel.tsx
src/components/ui/ProgressTracker.tsx
src/components/ui/base/KoreanText.tsx
src/components/ui/base/BackgroundGrid.tsx
src/components/ui/base/BaseButton.tsx
src/components/ui/base/KoreanPixiComponents.tsx
src/components/ui/base/PixiComponents.tsx
src/components/training/TrainingScreen.tsx
src/App.tsx
src/audio/AudioManager.tsx

## System

src/components/intro/components
src/components/intro
src/components/game
src/components/ui/base/index.ts
src/components/ui/base
src/components/ui
src/components/training/index.ts
src/components/training
src/components
src/audio/placeholder-sounds.ts
src/audio/AudioManager.ts
src/audio/DefaultSoundGenerator.ts
src/audio/AudioUtils.ts
src/vite-env.d.ts
src/hooks/useTexture.ts
src/types/pixi-react.d.ts
src/types/index.ts
src/systems/CombatSystem.ts
src/systems/VitalPointSystem.ts
src/systems/TrigramSystem.ts
src/systems/vitalpoint/KoreanAnatomy.ts
src/systems/vitalpoint/AnatomicalRegions.ts
src/systems/vitalpoint/KoreanVitalPoints.ts
src/systems/vitalpoint/HitDetection.ts
src/systems/vitalpoint/DamageCalculator.ts
src/systems/trigram/StanceManager.ts
src/systems/trigram/TrigramCalculator.ts
src/systems/trigram/KoreanCulture.ts
src/systems/trigram/TransitionCalculator.ts
src/systems/trigram/KoreanTechniques.ts

## Image assets

src/assets/black-trigram-256.png
src/assets/PlayerArchetypesExplained.png

src/assets/black-trigram.png
src/assets/CyberpunkTeamDynamics.png
src/assets/PlayerArchetypesOverview.png
src/assets/react.svg
src/assets/dark-trigram.png
src/assets/black-trigram.webp

## CSS

src/Game.css
src/App.css
src/index.css

## Systemm

src/components/intro/components
src/components/intro
src/components/game
src/components/ui/base/index.ts
src/components/ui/base
src/components/ui
src/components/training/index.ts
src/components/training
src/components
src/audio/placeholder-sounds.ts
src/audio/AudioManager.ts
src/audio/DefaultSoundGenerator.ts
src/audio/AudioUtils.ts
src/vite-env.d.ts
src/hooks/useTexture.ts
src/types/pixi-react.d.ts
src/types/index.ts
src/systems/CombatSystem.ts
src/systems/VitalPointSystem.ts
src/systems/TrigramSystem.ts
src/systems/vitalpoint/KoreanAnatomy.ts
src/systems/vitalpoint/AnatomicalRegions.ts
src/systems/vitalpoint/KoreanVitalPoints.ts
src/systems/vitalpoint/HitDetection.ts
src/systems/vitalpoint/DamageCalculator.ts
src/systems/trigram/StanceManager.ts
src/systems/trigram/TrigramCalculator.ts
src/systems/trigram/KoreanCulture.ts
src/systems/trigram/TransitionCalculator.ts
src/systems/trigram/KoreanTechniques.ts

Focus on stability, strict TypeScript usage, and Vite-enhanced testing while reusing existing code.

## Comprehensive Testing Strategy

### 🧪 Unit Testing Plan

**Scope**: Individual components, utilities, and pure functions
**Tools**: Vitest + React Testing Library
**Coverage Target**: 90%+ for core game logic

#### Core Testing Areas:

1. **Audio System** (`src/audio/`)

   - AudioManager initialization and configuration
   - Sound effect playback with damage-based parameters
   - Music crossfading and volume control
   - Korean martial arts audio themes

2. **Game Logic** (`src/components/game/`)

   - Combat system calculations (damage, distance, vital points)
   - Player state management (health, stamina, stance)
   - Trigram technique mechanics
   - Korean martial arts philosophy integration

3. **Utility Functions** (`src/utils/`)
   - Input validation and sanitization
   - Performance calculations
   - Korean text handling and display

#### Unit Test Example:

```typescript
// src/components/game/__tests__/CombatSystem.test.ts
import { describe, it, expect } from "vitest";
import { CombatSystem } from "../CombatSystem";

describe("CombatSystem", () => {
  describe("calculateDamage", () => {
    it("should calculate damage based on technique and distance", () => {
      const damage = CombatSystem.calculateDamage("천둥벽력", 50, 100);
      expect(damage).toBeGreaterThan(0);
      expect(damage).toBeLessThanOrEqual(35); // Max damage for 천둥벽력
    });

    it("should apply precision multiplier for close-range attacks", () => {
      const closeDamage = CombatSystem.calculateDamage("화염지창", 10, 100);
      const farDamage = CombatSystem.calculateDamage("화염지창", 90, 100);
      expect(closeDamage).toBeGreaterThan(farDamage);
    });

    it("should handle vital point detection correctly", () => {
      const distance = 30;
      const isVitalPoint = CombatSystem.isVitalPointHit(distance, "sternum");
      expect(typeof isVitalPoint).toBe("boolean");
    });
  });

  describe("Korean technique names", () => {
    it("should return correct Korean names for techniques", () => {
      const koreanName = CombatSystem.getKoreanTechniqueName("천둥벽력");
      expect(koreanName).toBe("천둥벽력 (Thunder Strike)");
    });
  });
});
```

### 🔗 Integration Testing Plan

**Scope**: Component interactions, game flow, audio-visual synchronization
**Tools**: Vitest + React Testing Library + Audio Mocks
**Coverage Target**: 85%+ for component interactions

#### Integration Test Areas:

1. **Game Engine Integration**

   - Player movement and combat coordination
   - Audio feedback during combat sequences
   - UI state synchronization with game state

2. **Audio-Visual Synchronization**

   - Attack animations with corresponding sound effects
   - Korean martial arts stance changes with audio cues
   - Music transitions between game modes

3. **Korean Localization**
   - Korean text rendering and display
   - Cultural authenticity in martial arts terminology
   - Proper trigram symbol display

#### Integration Test Example:

```typescript
// src/components/game/__tests__/GameEngineIntegration.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { GameEngine } from "../GameEngine";
import { useAudio } from "../../audio/AudioManager";

vi.mock("../../audio/AudioManager");

describe("GameEngine Integration", () => {
  it("should coordinate player actions with audio feedback", async () => {
    const mockAudio = {
      playAttackSound: vi.fn(),
      playHitSound: vi.fn(),
      playStanceChangeSound: vi.fn(),
    };
    vi.mocked(useAudio).mockReturnValue(mockAudio as any);

    render(<GameEngine />);

    // Simulate attack sequence
    fireEvent.click(screen.getByTestId("attack-button"));

    await waitFor(() => {
      expect(mockAudio.playAttackSound).toHaveBeenCalled();
    });

    // Verify audio parameters match Korean martial arts
    expect(mockAudio.playAttackSound).toHaveBeenCalledWith(
      expect.any(Number) // damage value
    );
  });

  it("should handle Korean trigram stance changes", async () => {
    render(<GameEngine />);

    // Test each trigram stance (1-8 keys)
    for (let i = 1; i <= 8; i++) {
      fireEvent.keyDown(document, { key: i.toString() });

      await waitFor(() => {
        // Verify stance change audio and visual feedback
        expect(screen.getByTestId("stance-indicator")).toBeInTheDocument();
      });
    }
  });
});
```

### 🌐 E2E Testing Plan

**Scope**: Complete user journeys, real browser interactions, Korean input
**Tools**: Cypress with custom commands
**Coverage Target**: 100% of critical user flows

#### E2E Test Scenarios:

1. **Complete Game Session Flow**

   ```
   Intro Screen → Training Mode → Combat Mode → Victory/Defeat
   ```

2. **Korean Martial Arts Journey**

   ```
   Learn Trigrams → Practice Techniques → Master Combat → Philosophy Study
   ```

3. **Audio System Validation**

   ```
   Music Playback → Sound Effects → Volume Control → Korean Audio
   ```

4. **Performance & Accessibility**
   ```
   60 FPS Gameplay → Korean Text Rendering → Mobile Compatibility
   ```

#### E2E Test Example:

```typescript
// cypress/e2e/korean-martial-arts-flow.cy.ts
describe("Korean Martial Arts Complete Journey", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForGameInit();
  });

  it("should complete full martial arts training sequence", () => {
    // Start from intro with Korean aesthetics
    cy.dataCy("intro-screen").should("be.visible");
    cy.contains("흑괘 무술 도장").should("be.visible");

    // Enter training mode
    cy.dataCy("training-mode-button").click();
    cy.waitForAudioReady();

    // Practice each trigram technique
    const trigrams = ["건", "태", "리", "진", "손", "감", "간", "곤"];
    trigrams.forEach((trigram, index) => {
      cy.get("body").type((index + 1).toString());
      cy.wait(500);

      // Verify Korean technique name display
      cy.contains(trigram).should("be.visible");

      // Check audio feedback
      cy.checkAudioPlayback("technique_sound");
    });

    // Progress to combat mode
    cy.dataCy("combat-mode-button").click();
    cy.waitForGameTransition();

    // Execute combat sequence with Korean techniques
    cy.startCombatSession();

    // Test vital point targeting (급소 공격)
    cy.executeVitalPointAttack("천둥벽력");
    cy.verifyKoreanText(".damage-indicator");

    // Complete combat with victory
    cy.defeatOpponent();
    cy.contains("승리").should("be.visible");
  });

  it("should maintain 60 FPS during intense combat", () => {
    cy.visit("/");
    cy.startGameMode("combat");

    // Monitor performance during rapid Korean technique execution
    cy.monitorPerformance(() => {
      // Rapid trigram technique combinations
      for (let i = 0; i < 50; i++) {
        cy.get("body").type("1"); // 건 (Heaven)
        cy.wait(100);
        cy.get("body").type("3"); // 리 (Fire)
        cy.wait(100);
      }
    });

    cy.checkPerformanceMetrics({
      minFPS: 60,
      maxFrameTime: 16.67,
      memoryLeak: false,
    });
  });

  it("should handle Korean text input and display correctly", () => {
    cy.visit("/");

    // Test Korean font loading
    cy.verifyKoreanFontLoading();

    // Verify all Korean martial arts terms render correctly
    const koreanTerms = [
      "흑괘 무술 도장",
      "천둥벽력",
      "화염지창",
      "급소 공격",
      "승리",
    ];

    koreanTerms.forEach((term) => {
      cy.verifyKoreanText(`:contains("${term}")`);
    });
  });
});
```

### 🎮 Custom Cypress Commands for Game Testing

```typescript
// cypress/support/commands.ts (additions)
declare global {
  namespace Cypress {
    interface Chainable {
      waitForGameInit(): Chainable<void>;
      startGameMode(mode: "training" | "combat"): Chainable<void>;
      executeVitalPointAttack(technique: string): Chainable<void>;
      checkAudioPlayback(soundType: string): Chainable<void>;
      verifyKoreanText(selector: string): Chainable<void>;
      monitorPerformance(actions: () => void): Chainable<void>;
      startCombatSession(): Chainable<void>;
      defeatOpponent(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("waitForGameInit", () => {
  cy.get("canvas").should("be.visible");
  cy.wait(1000); // Allow PixiJS initialization
});

Cypress.Commands.add("startGameMode", (mode: "training" | "combat") => {
  if (mode === "training") {
    cy.get("body").type("2"); // Training mode key
  } else {
    cy.get("body").type("1"); // Combat mode key
  }
  cy.wait(500);
});

Cypress.Commands.add("executeVitalPointAttack", (technique: string) => {
  // Map Korean technique names to key inputs
  const techniqueMap: Record<string, string> = {
    천둥벽력: "1", // Heaven - Thunder Strike
    화염지창: "3", // Fire - Flame Spear
    벽력일섬: "4", // Thunder - Lightning Flash
  };

  const key = techniqueMap[technique];
  if (key) {
    cy.get("body").type(key);
    cy.wait(200);
  }
});

Cypress.Commands.add("verifyKoreanText", (selector: string) => {
  cy.get(selector).should(($el) => {
    const text = $el.text();
    // Verify Korean characters are properly rendered
    const hasKorean = /[\uAC00-\uD7AF]/.test(text);
    expect(hasKorean).to.be.true;
  });
});
```

## PixiJS with React Guidelines

- **Leverage `@pixi/react` Components:**
  - Utilize components like `Stage`, `Container`, `Sprite`, `Graphics`, `Text` from `@pixi/react` for declarative scene graph construction.
  - Refer to the official `@pixi/react` documentation: https://react.pixijs.io/getting-started/
- **Extend PixiJS Objects:**
  - Use the `extend` function from `@pixi/react` to make PixiJS display objects (e.g., `Graphics`, `Sprite`) available as React components.
  - Example: `extend({ Graphics, Sprite });`
- **Component-Based Architecture:**
  - Structure your game elements as reusable React components.
  - Manage state within components using React hooks (`useState`, `useReducer`).
  - Encapsulate PixiJS drawing logic within these components, often using `useCallback` for draw functions passed to `<pixiGraphics />`.
- **Game Loop and State Updates:**
  - Use the `useTick` hook from `@pixi/react` for logic that needs to run every frame (e.g., animations, physics).
  - Manage game state with React's state management (e.g., `useState`, `useContext`, or external libraries like Zustand/Redux if complexity grows).
  - Ensure state updates correctly trigger re-renders of PixiJS components.
- **PixiJS Core API:**
  - For advanced features or direct manipulation not covered by `@pixi/react` abstractions, you can still access the core PixiJS API.
  - Refer to the PixiJS API documentation: https://pixijs.download/release/docs/index.html
- **Event Handling:**
  - Use `@pixi/react`'s event props (e.g., `onClick`, `onPointerDown`) on Pixi components, similar to DOM event handling in React.
  - Ensure `interactive={true}` is set on components that need to respond to pointer events.
- **Strict Typing with PixiJS:**
  - When interacting with PixiJS objects directly or defining props for Pixi-React components, use precise TypeScript types provided by `pixi.js` and `@pixi/react`.
  - For instance, when using `Graphics`, type the draw callback parameter explicitly: `draw={(g: PIXI.Graphics) => { ... }}`.

### Black Trigram Specific Examples

#### Korean Martial Arts Player Component

```tsx
import { Container, Graphics, Text, useTick } from "@pixi/react";
import { useState, useCallback } from "react";
import { useAudio } from "../audio/AudioManager";
import type { Graphics as PixiGraphics } from "pixi.js";

interface KoreanMartialArtistProps {
  readonly x: number;
  readonly y: number;
  readonly stance: TrigramStance;
  readonly isAttacking: boolean;
  readonly onTechniqueExecute: (technique: string, damage: number) => void;
}

export function KoreanMartialArtist({
  x,
  y,
  stance,
  isAttacking,
  onTechniqueExecute,
}: KoreanMartialArtistProps): JSX.Element {
  const [animationTime, setAnimationTime] = useState<number>(0);
  const audio = useAudio();

  // Korean trigram techniques with proper typing
  const techniques: Record<TrigramStance, { name: string; damage: number }> = {
    geon: { name: "천둥벽력", damage: 28 }, // Heaven - Thunder Strike
    tae: { name: "유수연타", damage: 18 }, // Lake - Flowing Combo
    li: { name: "화염지창", damage: 35 }, // Fire - Flame Spear
    jin: { name: "벽력일섬", damage: 40 }, // Thunder - Lightning Flash
    son: { name: "선풍연격", damage: 15 }, // Wind - Whirlwind
    gam: { name: "수류반격", damage: 25 }, // Water - Counter Strike
    gan: { name: "반석방어", damage: 12 }, // Mountain - Defense
    gon: { name: "대지포옹", damage: 30 }, // Earth - Grappling
  };

  useTick(
    useCallback((delta: number) => {
      setAnimationTime((prev) => prev + delta);
    }, [])
  );

  const executeKoreanTechnique = useCallback(() => {
    const technique = techniques[stance];
    audio.playAttackSound(technique.damage);
    onTechniqueExecute(technique.name, technique.damage);
  }, [stance, techniques, audio, onTechniqueExecute]);

  const drawMartialArtist = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      // Traditional Korean martial arts uniform (dobok)
      g.setFillStyle({ color: 0xffffff, alpha: 0.9 });
      g.rect(-25, -90, 50, 90);
      g.fill();

      // Belt color indicating mastery level
      g.setFillStyle({ color: 0x8b0000 }); // Red belt for master
      g.rect(-27, -25, 54, 10);
      g.fill();

      // Stance-specific energy aura
      if (isAttacking) {
        const stanceColors: Record<TrigramStance, number> = {
          geon: 0xffd700, // Gold - Heaven
          tae: 0x87ceeb, // Sky Blue - Lake
          li: 0xff4500, // Red Orange - Fire
          jin: 0x9370db, // Purple - Thunder
          son: 0x98fb98, // Pale Green - Wind
          gam: 0x4169e1, // Royal Blue - Water
          gan: 0x8b4513, // Saddle Brown - Mountain
          gon: 0x654321, // Dark Brown - Earth
        };

        const auraAlpha = Math.sin(animationTime * 0.3) * 0.4 + 0.6;
        g.setStrokeStyle({
          color: stanceColors[stance],
          width: 8,
          alpha: auraAlpha,
        });
        g.circle(0, -45, 45 + Math.sin(animationTime * 0.5) * 5);
        g.stroke();
      }
    },
    [stance, isAttacking, animationTime]
  );

  return (
    <Container
      x={x}
      y={y}
      interactive={true}
      onPointerDown={executeKoreanTechnique}
    >
      <Graphics draw={drawMartialArtist} />

      {/* Korean technique name display */}
      <Text
        text={`${techniques[stance].name} (${stance.toUpperCase()})`}
        anchor={{ x: 0.5, y: 0.5 }}
        y={-120}
        style={{
          fontFamily: "Noto Sans KR",
          fontSize: 16,
          fill: 0xffd700,
          fontWeight: "bold",
        }}
      />

      {/* Trigram symbol */}
      <Text
        text={getTrigramSymbol(stance)}
        anchor={{ x: 0.5, y: 0.5 }}
        y={-140}
        style={{
          fontFamily: "serif",
          fontSize: 24,
          fill: 0xffffff,
        }}
      />
    </Container>
  );
}

// Helper function with proper typing
function getTrigramSymbol(stance: TrigramStance): string {
  const symbols: Record<TrigramStance, string> = {
    geon: "☰", // Heaven
    tae: "☱", // Lake
    li: "☲", // Fire
    jin: "☳", // Thunder
    son: "☴", // Wind
    gam: "☵", // Water
    gan: "☶", // Mountain
    gon: "☷", // Earth
  };
  return symbols[stance];
}
```

#### Audio-Integrated Combat System

```tsx
import { useAudio } from "../audio/AudioManager";
import { useCallback } from "react";

interface CombatAudioIntegrationProps {
  readonly onCombatEvent: (event: CombatEvent) => void;
}

export function CombatAudioIntegration({
  onCombatEvent,
}: CombatAudioIntegrationProps): JSX.Element {
  const audio = useAudio();

  const handleKoreanCombatSequence = useCallback(async () => {
    // Start combat with traditional Korean music
    await audio.playMusic("combat_theme");

    // Execute attack with damage-based audio feedback
    const damage = 35;
    audio.playAttackSound(damage);

    // Vital point hit with Korean martial arts authenticity
    const isVitalPoint = true;
    audio.playHitSound(damage, isVitalPoint);

    // Combo achievement with progressive audio
    const comboCount = 3;
    audio.playComboSound(comboCount);

    // Traditional stance change audio
    audio.playStanceChangeSound();

    onCombatEvent({
      type: "korean_technique_executed",
      technique: "천둥벽력",
      damage,
      isVitalPoint,
    });
  }, [audio, onCombatEvent]);

  // Component implementation with proper Korean martial arts integration
  return <Container>{/* Combat system implementation */}</Container>;
}
```

## Testing Best Practices for Black Trigram

### Mock Strategies

```typescript
// Comprehensive audio mocking for Korean martial arts
vi.mock("../audio/AudioManager", () => ({
  useAudio: () => ({
    playMusic: vi.fn(),
    playAttackSound: vi.fn(),
    playHitSound: vi.fn(),
    playComboSound: vi.fn(),
    playStanceChangeSound: vi.fn(),
    setMasterVolume: vi.fn(),
    getMasterVolume: vi.fn(() => 0.7),
    isEnabled: vi.fn(() => true),
  }),
}));

// Korean text rendering validation
expect(screen.getByText("천둥벽력")).toBeInTheDocument();
expect(screen.getByText(/급소 공격/)).toBeVisible();
```

### Performance Testing

```typescript
// Test game performance during Korean martial arts sequences
it("should maintain 60 FPS during trigram technique combinations", () => {
  const startTime = performance.now();

  // Execute all 8 trigram techniques rapidly
  for (let i = 1; i <= 8; i++) {
    fireEvent.keyDown(document, { key: i.toString() });
  }

  const endTime = performance.now();
  const duration = endTime - startTime;

  // Should complete within 16.67ms for 60 FPS
  expect(duration).toBeLessThan(100);
});
```

https://react.pixijs.io/getting-started/
https://pixijs.download/release/docs/index.html
