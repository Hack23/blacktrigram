# GitHub Copilot Instructions for Black Trigram (흑괘)

PRIO 1: Complete functional game with robust error handling and reusable UI components
PRIO 2: Use PixiJS UI (@pixi/ui) and Layout (@pixi/layout) for all interface components
PRIO 3: Implement cyberpunk Korean aesthetic with excellent UX/UI experience using extensible components

## 🔧 Code Completion Guidelines

### PixiJS UI & Layout Integration

- ALWAYS use @pixi/ui components as base building blocks
- ALWAYS implement @pixi/layout for responsive layouts
- ALWAYS extend existing UI components rather than creating from scratch
- PREFER composition over inheritance for component reusability
- USE layout properties for responsive design across all screen sizes

### PixiJS UI Component Patterns

```typescript
// Preferred PixiJS UI component extension pattern
import { Button, FancyButton } from "@pixi/ui";
import "@pixi/layout"; // Import for layout mixins

// Extend existing UI components for Korean martial arts theme
class KoreanButton extends FancyButton {
  constructor(options: KoreanButtonOptions) {
    super({
      ...options,
      defaultView: "korean-button-idle.png",
      hoverView: "korean-button-hover.png",
      pressedView: "korean-button-pressed.png",
      text: {
        text: options.koreanText || options.text,
        style: {
          fontFamily: "Noto Sans KR, NanumGothic, sans-serif",
          fill: KOREAN_COLORS.TEXT_PRIMARY,
          fontSize: 16,
        },
      },
    });
  }
}

// Layout-powered container pattern
const createKoreanPanel = (content: DisplayObject[]) => {
  const panel = new Container({
    layout: {
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      padding: 20,
      backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
      borderRadius: 8,
    },
  });

  content.forEach((child) => panel.addChild(child));
  return panel;
};
```

### Layout System Best Practices

```typescript
// Always use layout properties for responsive design
import "@pixi/layout";

// Stage layout setup
app.stage.layout = {
  width: app.screen.width,
  height: app.screen.height,
  justifyContent: "center",
  alignItems: "center",
};

// Component layout patterns
const combatHUD = new Container({
  layout: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: { left: 20, right: 20 },
  },
});

// Korean text with proper layout
const koreanLabel = new Text("무사 (Musa)", {
  fontFamily: "Noto Sans KR",
  fontSize: 18,
  fill: KOREAN_COLORS.ACCENT_GOLD,
  layout: {
    alignSelf: "center",
    marginBottom: 10,
  },
});
```

### TypeScript Best Practices

- ALWAYS use explicit return types for functions
- ALWAYS use readonly modifiers for props interfaces
- ALWAYS use strict null checks and proper error handling
- PREFER type unions over any/unknown when possible
- USE existing type definitions from the type system extensively

### File Structure Best Practices

- ALWAYS add proper file headers with filepath comments
- ALWAYS use proper imports organization (external, internal, relative)
- AVOID creating incomplete or truncated code blocks

### React + PixiJS Integration Patterns

```typescript
// React component wrapping PixiJS UI components
import { extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { Button, ScrollBox } from "@pixi/ui";
import "@pixi/layout";

extend({ Container, Graphics, Button, ScrollBox });

interface KoreanUIComponentProps {
  readonly koreanText: KoreanText;
  readonly onAction?: (data: Type) => void;
}

export const KoreanUIComponent: React.FC<KoreanUIComponentProps> = ({
  koreanText,
  onAction,
}) => {
  const handlePress = useCallback(() => {
    onAction?.(/* data */);
  }, [onAction]);

  return (
    <pixiContainer
      layout={{
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <pixiButton
        text={koreanText.korean}
        onPress={handlePress}
        layout={{ marginBottom: 10 }}
        data-testid="korean-button"
      />
    </pixiContainer>
  );
};

export default KoreanUIComponent;
```

## 📚 Project Documentation

### Core Documentation

- **[Game Design](../game-design.md)** - Complete Korean martial arts combat system design, eight trigram philosophy, player archetypes, and cultural authenticity guidelines
- **[System Architecture](../ARCHITECTURE.md)** - Technical architecture, state management, component patterns, and Korean martial arts integration
- **[Combat Architecture](../COMBAT_ARCHITECTURE.md)** - Detailed combat system implementation, trigram effectiveness matrix, vital point system
- **[Audio Assets](../AUDIO_ASSETS.md)** - Korean traditional instrument integration, combat audio, and cultural music guidelines
- **[Art Assets](../ART_ASSETS.md)** - Korean cyberpunk visual design, color systems, character art, and UI iconography
- **[Future Architecture](../FUTURE_ARCHITECTURE.md)** - Planned features, scalability considerations, and long-term technical roadmap

## 🎯 Project Overview

Black Trigram is a **realistic 2D precision combat simulator** deeply rooted in Korean martial arts and the I Ching trigram philosophy. The game emphasizes anatomical realism, precise targeting, authentic martial techniques, and cyberpunk aesthetics through reusable, extensible UI components.

**Genre**: 2D Realistic Precision Combat Simulator / Traditional Korean Martial Arts Training
**Platform**: Web-based (HTML5/WebGL via PixiJS + React)
**Core Focus**: Extensible UI components, responsive layouts, authentic Korean martial arts

### Key Features

- **Eight Trigram Stances**: Traditional Korean martial arts forms (팔괘) with authentic techniques
- **Five Player Archetypes**: 무사 (Musa), 암살자 (Amsalja), 해커 (Hacker), 정보요원 (Jeongbo Yowon), 조직폭력배 (Jojik Pokryeokbae)
- **Anatomical Targeting**: 70+ vital points based on traditional Korean medicine
- **Cyberpunk Korean Aesthetic**: Modern visual design honoring traditional culture
- **Bilingual Support**: Korean-English throughout with proper romanization

## 🎯 UI Component Architecture

### Core UI Component Library Structure

```plaintext
src/components/ui/
├── base/                    # Foundation components extending @pixi/ui
│   ├── KoreanButton.ts     # Extended FancyButton with Korean styling
│   ├── KoreanPanel.ts      # Layout-powered container with Korean aesthetics
│   ├── ResponsiveContainer.ts # Layout-responsive wrapper component
│   └── BasePixiComponents.ts # Core PixiJS UI extensions
├── combat/                  # Combat-specific UI components
│   ├── TrigramSelector.ts  # Eight trigram stance selection (RadioGroup)
│   ├── StanceIndicator.ts  # Current stance display
│   ├── HealthBar.ts        # Extended ProgressBar for combat stats
│   └── VitalPointOverlay.ts # Anatomical targeting interface
├── containers/              # Layout containers and panels
│   ├── CombatHUD.ts        # Main combat interface layout
│   ├── PlayerStatusPanel.ts # Player information display
│   └── GameMenu.ts         # Menu system with Korean navigation
└── texts/                   # Korean-English text components
    ├── BilingualText.ts    # Korean-English dual display
    ├── KoreanHeader.ts     # Styled Korean headers
    └── CombatLog.ts        # Scrolling combat history
```

### Component Design Principles

- **PixiJS UI Foundation**: All components extend @pixi/ui base classes (Button, FancyButton, ProgressBar, RadioGroup, etc.)
- **Layout-Powered**: Use @pixi/layout for responsive design and flexible positioning
- **Korean Theming**: Consistent cyberpunk Korean aesthetic with traditional color harmony
- **Extensibility**: Components designed for easy customization and extension
- **Composition**: Build complex interfaces through component composition
- **Responsiveness**: All components adapt to mobile, tablet, and desktop screen sizes

### PixiJS UI Extensions for Korean Martial Arts

| **Base @pixi/ui Component** | **Korean Extension** | **Layout Features**                      | **Use Case**                     |
| --------------------------- | -------------------- | ---------------------------------------- | -------------------------------- |
| `Button`                    | `KoreanButton`       | Responsive padding, Korean text styling  | Basic actions with Korean labels |
| `FancyButton`               | `TrigramButton`      | Flexbox alignment, hover animations      | Eight trigram stance selection   |
| `ProgressBar`               | `HealthBar`, `KiBar` | Responsive width, status color changes   | Combat resource display          |
| `RadioGroup`                | `TrigramSelector`    | Grid layout, responsive columns          | Stance selection interface       |
| `ScrollBox`                 | `CombatLog`          | Flexible height, auto-scroll             | Combat history and notifications |
| `Container`                 | `KoreanPanel`        | Flexbox layout, Korean border patterns   | UI panel backgrounds             |
| `Input`                     | `KoreanInput`        | Bilingual validation, Korean IME support | Korean text input fields         |

## 🔧 PixiJS UI & Layout Implementation Patterns

### Responsive Layout Patterns

```typescript
// Korean-themed responsive layout constants
export const KOREAN_LAYOUTS = {
  // Main combat HUD layout
  COMBAT_HUD: {
    width: "100%",
    height: 80,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    padding: { left: 20, right: 20, top: 10, bottom: 10 },
  },

  // Trigram stance selector grid
  TRIGRAM_GRID: {
    display: "flex",
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    justifyContent: "center" as const,
    gap: 15,
    maxWidth: 400,
    padding: 20,
  },

  // Player status panel layout
  PLAYER_STATUS: {
    width: 200,
    flexDirection: "column" as const,
    gap: 12,
    padding: 15,
    backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
    borderRadius: 8,
  },

  // Mobile-optimized layouts
  MOBILE_COMBAT_HUD: {
    width: "100%",
    height: 60,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: 5,
    padding: 10,
  },
} as const;
```

### Korean UI Color System

```typescript
export const KOREAN_COLORS = {
  // Primary cyberpunk Korean colors
  PRIMARY_CYAN: 0x00ffff,
  SECONDARY_YELLOW: 0xffd700,
  ACCENT_GOLD: 0xffaa00,
  ACCENT_BLUE: 0x0088ff,

  // UI background colors
  UI_BACKGROUND_DARK: 0x1a1a1a,
  UI_BACKGROUND_MEDIUM: 0x2d2d2d,
  UI_BACKGROUND_LIGHT: 0x404040,

  // Korean traditional colors (오방색)
  CARDINAL_EAST: 0x00ff88, // 동방 청색
  CARDINAL_WEST: 0xffffff, // 서방 백색
  CARDINAL_SOUTH: 0xff4444, // 남방 적색
  CARDINAL_NORTH: 0x000000, // 북방 흑색
  CARDINAL_CENTER: 0xffaa00, // 중앙 황색
} as const;
```

## 🧪 Testing Strategy

### PixiJS UI Component Testing

```typescript
// Test pattern for Korean UI components
describe("KoreanTrigramSelector", () => {
  it("should render all eight trigram options with layout", () => {
    const selector = new TrigramSelector({
      layout: KOREAN_LAYOUTS.TRIGRAM_GRID,
      onStanceChange: mockHandler,
    });

    expect(selector.children).toHaveLength(8);
    expect(selector.layout.gap).toBe(15);
  });

  it("should respond to stance selection", () => {
    const onStanceChange = vi.fn();
    const selector = new TrigramSelector({ onStanceChange });

    selector.selectStance(TrigramStance.GEON);
    expect(onStanceChange).toHaveBeenCalledWith(TrigramStance.GEON);
  });

  it("should adapt layout for mobile screens", () => {
    const selector = new TrigramSelector({
      responsive: true,
      mobileLayout: KOREAN_LAYOUTS.MOBILE_TRIGRAM_GRID,
    });

    // Test responsive behavior
    selector.updateScreenSize(400, 600); // Mobile dimensions
    expect(selector.layout.flexDirection).toBe("column");
  });
});
```

### Test Coverage Goals

- UI Component tests: >95% coverage
- Layout responsiveness tests: >90% coverage
- Korean text rendering tests: 100% accuracy validation
- Accessibility tests: >85% coverage

## 🎮 Korean Martial Arts Integration

### Eight Trigram System (팔괘 체계)

- **☰ 건 (Geon)** - Heaven: Direct force techniques
- **☱ 태 (Tae)** - Lake: Fluid joint manipulation
- **☲ 리 (Li)** - Fire: Precise nerve strikes
- **☳ 진 (Jin)** - Thunder: Explosive power techniques
- **☴ 손 (Son)** - Wind: Continuous pressure attacks
- **☵ 감 (Gam)** - Water: Flow and adaptation techniques
- **☶ 간 (Gan)** - Mountain: Defensive mastery
- **☷ 곤 (Gon)** - Earth: Grounding and takedown techniques

### Player Archetypes (플레이어 원형)

- **무사 (Musa)** - Traditional Warrior: Honor through disciplined strength
- **암살자 (Amsalja)** - Shadow Assassin: Precision through stealth
- **해커 (Hacker)** - Cyber Warrior: Technology-enhanced combat
- **정보요원 (Jeongbo Yowon)** - Intelligence Operative: Strategic analysis
- **조직폭력배 (Jojik Pokryeokbae)** - Organized Crime: Ruthless pragmatism

## 🌟 Success Criteria

When following these guidelines, UI code should:

- ✅ Use @pixi/ui and @pixi/layout as foundational building blocks
- ✅ Extend existing components rather than creating from scratch
- ✅ Implement responsive layouts that work across all screen sizes
- ✅ Include proper Korean-English bilingual support
- ✅ Follow accessibility best practices with proper test IDs
- ✅ Maintain cyberpunk Korean aesthetic consistently
- ✅ Achieve 60fps performance for all UI interactions
- ✅ Provide comprehensive test coverage for all components

## 🎯 Philosophy Integration

**Remember**: Black Trigram represents the intersection of traditional Korean martial arts wisdom and modern interactive technology. Every UI component should honor this balance while providing authentic, educational, and respectful user experience through extensible, reusable design patterns.

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

### Code Completion Anti-Patterns to Avoid

- ❌ Creating custom UI components when @pixi/ui alternatives exist
- ❌ Hardcoded positioning instead of layout-based responsive design
- ❌ Missing Korean cultural context in UI component design
- ❌ Non-extensible component implementations
- ❌ Incomplete accessibility implementation
- ❌ Missing layout properties for responsive behavior
- ❌ Performance-heavy UI operations without optimization
  }}
  />
  );
  };

````

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
````

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

```

```
