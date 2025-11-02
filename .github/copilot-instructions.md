# GitHub Copilot Instructions for Black Trigram (흑괘)

PRIO 1: Follow existing React + PixiJS patterns with layout system integration
PRIO 2: Use established component structure and Korean martial arts theming
PRIO 3: Maintain type safety and proper error handling throughout

## 🔧 Current Code Patterns & Architecture

### React + PixiJS Integration Pattern

```typescript
// ALWAYS follow this established pattern from existing components
import "@pixi/layout";
import { LayoutContainer } from "@pixi/layout/components";
import "@pixi/layout/react";
import { extend } from "@pixi/react";
import { Container } from "pixi.js";
import { extendPixiComponents } from "../../utils/pixiExtensions";

// Register components
extend({ Container, LayoutContainer });
extendPixiComponents();

// Component structure
export const ComponentName: React.FC<Props> = ({ ...props }) => {
  // State management with proper typing
  const [state, setState] = useState<StateType>(initialValue);

  // Layout calculations (from CombatScreen pattern)
  const layoutConstants = useMemo(
    () => ({
      padding: isMobile ? 10 : 20,
      headerHeight: isMobile ? 50 : 60,
      // ... other responsive calculations
    }),
    [isMobile]
  );

  return (
    <pixiContainer
      layout={{
        width,
        height,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: layoutConstants.padding,
      }}
      data-testid="component-name"
    >
      {/* Component content */}
    </pixiContainer>
  );
};
```

### Layout System Usage (From CombatScreen)

```typescript
// ALWAYS use layout properties for responsive design
const layoutConstants = {
  padding: 10,
  hudHeight: 120,
  controlsHeight: 100,
  footerHeight: 40,
};

// Flex container pattern
<pixiContainer
  layout={{
    width: "100%",
    height: layoutConstants.hudHeight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0, // Prevents shrinking
  }}
>
```

### Korean Theming Pattern

```typescript
// ALWAYS use Korean colors and bilingual text
import { KOREAN_COLORS, FONT_FAMILY } from "../../types/constants";

// Bilingual text pattern (from IntroScreen)
<pixiText
  text={`${korean} | ${english}`}
  style={{
    fontSize: isMobile ? 14 : 18,
    fill: KOREAN_COLORS.ACCENT_GOLD,
    fontFamily: FONT_FAMILY.KOREAN,
    fontWeight: "bold",
  }}
  data-testid="bilingual-text"
/>

// Enhanced graphics with Korean aesthetics
<pixiGraphics
  draw={(g) => {
    g.clear();
    g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.95 });
    g.roundRect(0, 0, width, height, 8);
    g.fill();

    // Korean-inspired border
    g.stroke({ width: 2, color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.8 });
    g.roundRect(0, 0, width, height, 8);
    g.stroke();
  }}
/>
```

### State Management Pattern

```typescript
// ALWAYS use proper typing and responsive state
interface ComponentState {
  readonly isActive: boolean;
  readonly selectedIndex: number;
  // ... other state properties
}

// State with proper initialization
const [componentState, setComponentState] = useState<ComponentState>({
  isActive: false,
  selectedIndex: 0,
});

// Event handlers with useCallback
const handleAction = useCallback(
  (param: string) => {
    // Action logic
    onAction?.(param);
  },
  [onAction]
);
```

### Component Props Interface Pattern

```typescript
// ALWAYS use readonly properties with explicit types
export interface ComponentProps {
  readonly width: number;
  readonly height: number;
  readonly x?: number;
  readonly y?: number;
  readonly isMobile?: boolean;
  readonly onAction?: (data: ActionData) => void;
  readonly children?: React.ReactNode;
}

// Default props in destructuring
export const Component: React.FC<ComponentProps> = ({
  width = 1200,
  height = 800,
  x = 0,
  y = 0,
  isMobile = false,
  onAction,
  children,
}) => {
  // Component implementation
};
```

### Responsive Design Pattern (From CombatScreen)

```typescript
// ALWAYS calculate responsive values
const isMobile = useMemo(() => width < 768, [width]);

const layoutCalculation = useMemo(() => ({
  buttonSize: isMobile ? 40 : 60,
  fontSize: isMobile ? 12 : 16,
  padding: isMobile ? 10 : 20,
  spacing: isMobile ? 8 : 15,
}), [isMobile]);

// Apply in components
<pixiContainer
  layout={{
    gap: layoutCalculation.spacing,
    padding: layoutCalculation.padding,
  }}
>
```

### Audio Integration Pattern

```typescript
// ALWAYS use audio context from provider
import { useAudio } from "../../audio/AudioProvider";

export const Component: React.FC<Props> = ({ ... }) => {
  const audio = useAudio();

  const handleAction = useCallback(() => {
    audio.playSFX("menu_select");
    // Action logic
  }, [audio]);
};
```

### Error Handling & Testing Pattern

```typescript
// ALWAYS include data-testid for testing
<pixiContainer data-testid="unique-component-id">

// ALWAYS handle potential null/undefined
const safeValue = value ?? defaultValue;

// ALWAYS use proper error boundaries
try {
  // Risky operation
} catch (error) {
  console.warn("Operation failed:", error);
  // Fallback behavior
}
```

## 📚 File Organization Patterns

### Component File Structure

```plaintext
src/components/
├── ui/                       # UI components following @pixi/ui patterns
│   ├── base/                 # Base components with Korean theming
│   │   ├── KoreanButton.ts  # Extended button with Korean styles
│   │   ├── KoreanPanel.ts   # Panel component with layout integration
│   │   └── BasePixiComponents.ts # Core PixiJS UI extensions
│   ├── combat/               # Combat-specific UI components
│   │   ├── TrigramSelector.ts # Trigram stance selection component
│   │   ├── HealthBar.ts     # Health bar with Korean aesthetics
│   │   └── VitalPointOverlay.ts # Anatomical targeting interface
│   ├── containers/           # Layout containers and panels
│   │   ├── CombatHUD.ts     # Main combat interface layout
│   │   └── PlayerStatusPanel.ts # Player information display
│   └── texts/                # Text components with bilingual support
│       ├── BilingualText.ts # Korean-English dual display
│       └── CombatLog.ts     # Scrolling combat history
├── audio/                    # Audio context and hooks
│   ├── AudioProvider.ts     # Context provider for audio
│   └── sounds/               # Audio files and assets
├── hooks/                    # Custom hooks
│   ├── useCombat.ts         # Combat-related hooks
│   └── usePlayer.ts         # Player state hooks
├── screens/                  # Screen components
│   ├── CombatScreen.ts      # Main combat screen
│   ├── IntroScreen.ts       # Introduction and menu screen
│   └── SettingsScreen.ts    # Settings and configuration screen
└── utils/                   # Utility functions and constants
    ├── constants.ts         # Constant values and configurations
    ├── pixiExtensions.ts    # PixiJS component extensions
    └── helpers.ts           # Helper functions
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

**Remember**: Black Trigram represents the intersection of traditional Korean martial arts wisdom and modern interactive technology. Every implementation should honor this balance while providing authentic, educational, and respectful gameplay.

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
