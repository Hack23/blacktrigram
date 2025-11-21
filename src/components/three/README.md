# Three.js Korean UI Component Library

A comprehensive collection of reusable Three.js UI components with Korean cyberpunk theming for the Black Trigram game.

## 🎯 Overview

This library provides bilingual (Korean/English) UI components designed for use with `@react-three/fiber` and `@react-three/drei`. All components follow strict TypeScript practices and maintain the Black Trigram aesthetic.

## 📦 Components

### KoreanButton

A bilingual button component with multiple variants and sizes.

```tsx
import { KoreanButton } from "@/components/three";

<KoreanButton
  korean="공격"
  english="Attack"
  onClick={() => console.log("Attack!")}
  variant="primary" // primary | secondary | danger
  size="md" // sm | md | lg
  position={[0, 0, 0]}
  testId="attack-button"
/>
```

**Props:**
- `korean` (string): Korean text
- `english` (string): English text
- `onClick` (function): Click handler
- `disabled` (boolean): Disable state
- `variant` ("primary" | "secondary" | "danger"): Button style
- `size` ("sm" | "md" | "lg"): Button size
- `position` ([number, number, number]): 3D position
- `fullWidth` (boolean): Full width mode
- `testId` (string): Test identifier

### KoreanPanel

A container component with Korean cyberpunk styling.

```tsx
import { KoreanPanel } from "@/components/three";

<KoreanPanel
  variant="bordered" // default | bordered | elevated
  width={400}
  height="auto"
  padding={20}
  position={[0, 0, 0]}
>
  <div>Panel Content</div>
</KoreanPanel>
```

**Props:**
- `children` (ReactNode): Panel content
- `position` ([number, number, number]): 3D position
- `width` (number | string): Panel width
- `height` (number | string): Panel height
- `padding` (number): Internal padding
- `variant` ("default" | "bordered" | "elevated"): Panel style
- `testId` (string): Test identifier

### KoreanText3D

A bilingual text component with flexible layouts.

```tsx
import { KoreanText3D } from "@/components";

<KoreanText3D
  korean="흑괘"
  english="Black Trigram"
  size="large" // small | medium | large | xlarge
  layout="vertical" // vertical | horizontal
  color={KOREAN_COLORS.ACCENT_GOLD}
  align="center" // left | center | right
  weight="bold" // normal | bold
  position={[0, 0, 0]}
/>
```

**Props:**
- `korean` (string): Korean text
- `english` (string): English text
- `position` ([number, number, number]): 3D position
- `size` ("small" | "medium" | "large" | "xlarge"): Text size
- `color` (number): Text color (hex)
- `align` ("left" | "center" | "right"): Text alignment
- `weight` ("normal" | "bold"): Font weight
- `layout` ("vertical" | "horizontal"): Text layout
- `testId` (string): Test identifier

### MenuList

A navigational menu component with hover states.

```tsx
import { MenuList } from "@/components/three";

const items = [
  { id: "combat", korean: "대전", english: "Combat" },
  { id: "training", korean: "훈련", english: "Training", disabled: true },
];

<MenuList
  items={items}
  onSelect={(id) => console.log(id)}
  selectedId="combat"
  width={300}
  position={[0, 0, 0]}
/>
```

**Props:**
- `items` (MenuItem[]): Menu items
- `onSelect` (function): Selection handler
- `selectedId` (string): Currently selected item ID
- `position` ([number, number, number]): 3D position
- `width` (number): Menu width
- `testId` (string): Test identifier

**MenuItem Interface:**
```typescript
interface MenuItem {
  readonly id: string;
  readonly korean: string;
  readonly english: string;
  readonly disabled?: boolean;
}
```

### ArchetypeCard

A card component for displaying player archetypes.

```tsx
import { ArchetypeCard } from "@/components/three";
import { PlayerArchetype } from "@/types/common";

<ArchetypeCard
  archetype={PlayerArchetype.MUSA}
  onSelect={(archetype) => console.log(archetype)}
  isSelected={true}
  width={320}
  showStats={true}
  position={[0, 0, 0]}
/>
```

**Props:**
- `archetype` (PlayerArchetype): Archetype to display
- `onSelect` (function): Selection handler
- `isSelected` (boolean): Selection state
- `position` ([number, number, number]): 3D position
- `width` (number): Card width
- `showStats` (boolean): Show archetype stats
- `testId` (string): Test identifier

### ProgressBar

A progress bar component for health, ki, and stamina.

```tsx
import { ProgressBar } from "@/components/three";

<ProgressBar
  type="health" // health | ki | stamina
  current={75}
  max={100}
  label={{ korean: "체력", english: "Health" }}
  width={200}
  height={24}
  showText={true}
  animated={true}
  position={[0, 0, 0]}
/>
```

**Props:**
- `type` ("health" | "ki" | "stamina"): Bar type
- `current` (number): Current value
- `max` (number): Maximum value
- `label` ({ korean: string, english: string }): Bar label
- `position` ([number, number, number]): 3D position
- `width` (number): Bar width
- `height` (number): Bar height
- `showText` (boolean): Show percentage text
- `animated` (boolean): Animate bar
- `testId` (string): Test identifier

### KoreanUIDemo

An interactive showcase of all components.

```tsx
import { KoreanUIDemo } from "@/components/three";

<KoreanUIDemo width={1200} height={800} />
```

**Props:**
- `width` (number): Demo width (default: 1200)
- `height` (number): Demo height (default: 800)

## 🎨 Theming

All components use the `KOREAN_COLORS` constants for consistent theming:

```typescript
import { KOREAN_COLORS } from "@/types/constants";

// Primary colors
KOREAN_COLORS.PRIMARY_CYAN      // 0x00ffff - Neon cyan
KOREAN_COLORS.ACCENT_GOLD       // 0xffd700 - Gold accents
KOREAN_COLORS.ACCENT_RED        // 0xff3333 - Danger/warning

// Background colors
KOREAN_COLORS.UI_BACKGROUND_DARK    // 0x1a1a2e - Main background
KOREAN_COLORS.UI_BACKGROUND_MEDIUM  // 0x16213e - Panel background

// Text colors
KOREAN_COLORS.TEXT_PRIMARY    // 0xffffff - Primary text
KOREAN_COLORS.TEXT_SECONDARY  // 0xcccccc - Secondary text
```

## 🧪 Testing

All components include comprehensive unit tests with Vitest:

```bash
# Run all tests
npm test

# Run Three.js component tests only
npm test -- src/components/three

# Run with coverage
npm run coverage
```

**Test Coverage:**
- 79 unit tests across 6 components
- 100% component coverage
- All tests passing

## 📝 TypeScript

All components are fully typed with strict TypeScript:

```typescript
import type {
  KoreanButtonProps,
  KoreanPanelProps,
  KoreanTextProps,
  MenuListProps,
  MenuItem,
  ArchetypeCardProps,
  ProgressBarProps,
  ProgressBarType,
} from "@/components/three";
```

## 🚀 Usage in Canvas

All components must be used within a `@react-three/fiber` Canvas:

```tsx
import { Canvas } from "@react-three/fiber";
import { KoreanButton, KoreanPanel } from "@/components/three";

function MyScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <KoreanButton
        korean="시작"
        english="Start"
        onClick={() => console.log("Start game")}
        position={[0, 0, 0]}
      />
    </Canvas>
  );
}
```

## 🎯 Best Practices

1. **Always use Html overlays for interactive UI**: Buttons, panels, and text work best as Html overlays
2. **Use 3D meshes for game objects**: Characters, effects, and environment objects should be 3D meshes
3. **Memoize callbacks**: Use `useCallback` for event handlers to optimize performance
4. **Provide test IDs**: Always include `testId` prop for testing
5. **Follow Korean theming**: Use KOREAN_COLORS constants for consistency
6. **Support bilingual text**: Always provide both Korean and English text

## 📚 Examples

See `src/components/three/KoreanUIDemo.tsx` for a complete interactive example showcasing all components.

## 🔧 Dependencies

- `react` ^19.2.0
- `@react-three/fiber` 9.4.0
- `@react-three/drei` 10.7.7
- `three` 0.181.2

## 📄 License

Part of the Black Trigram project. See main project LICENSE for details.

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
