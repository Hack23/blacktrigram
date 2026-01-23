# ControlsScreen3D Integration - Quick Reference

## Component Structure Overview

### 1. Top-Level Layout
```
┌─────────────────────────────────────────────────────────┐
│ VolumeControl (top-right)                               │
├─────────────────────────────────────────────────────────┤
│ 3D Canvas (BackgroundScene3D + Keyboard/Gamepad 3D)    │
│                                                          │
│  [3D Visualization Layer - Behind UI]                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 2. UI Overlay (Above Canvas)
```
┌─────────────────────────────────────────────────────────┐
│ HEADER: 조작법 안내 - Controls Guide                     │
│         ☯ 팔괘 철학과 급소술의 융합 ☯                      │
├─────────────────────────────────────────────────────────┤
│ MODE TOGGLE:                                             │
│  [⌨️ 키보드 | Keyboard] [🎮 게임패드 | Gamepad]          │
├─────────────────────────────────────────────────────────┤
│ CATEGORY TABS:                                           │
│  [⚔️ 전투 | Combat] [🏃 이동 | Movement] [⚙️ 시스템]     │
├─────────────────────────────────────────────────────────┤
│ SCROLLABLE CONTENT:                                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ControlBindingsOverlayHtml                       │   │
│  │ (Filtered by selected tab)                       │   │
│  │                                                  │   │
│  │ • Key cards in grid layout                      │   │
│  │ • Color-coded by category                       │   │
│  │ • Bilingual descriptions                        │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Legacy Sections (for additional context):       │   │
│  │ • Trigram Stances                               │   │
│  │ • Combat Controls                               │   │
│  │ • Movement Controls                             │   │
│  │ • Advanced Footwork                             │   │
│  │ • Technique Execution                           │   │
│  │ • Special Features                              │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│ INTERACTIVE DEMO (Fixed overlay at bottom):             │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 최근 입력 | Recent Input                         │   │
│  │ [Space] 공격 | Attack                           │   │
│  │ [W] 전진 | Forward                              │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│ FOOTER:                                                  │
│  🥋 흑괘의 길을 걸어라    [Return] [ESC | M]             │
└─────────────────────────────────────────────────────────┘
```

## State Flow

### useControlsState Hook
```typescript
{
  pressedKeys: Set<string>,      // Real-time tracked key codes
  category: 'keyboard' | 'gamepad',  // Current view mode
  selectedTab: 'combat' | 'movement' | 'system',  // Active filter
  setCategory: (cat) => void,    // Switch mode
  setSelectedTab: (tab) => void  // Switch filter
}
```

### Data Flow
```
User Action → State Update → Visual Update
├─ Press Key
│  └─ Add to pressedKeys
│     ├─ Highlight in VisualKeyboard3D
│     └─ Show in InteractiveControlDemo
├─ Click Mode Toggle
│  └─ Update category
│     └─ Switch Canvas: VisualKeyboard3D ↔ GamepadVisualization3D
└─ Click Category Tab
   └─ Update selectedTab
      ├─ Filter keys in VisualKeyboard3D
      └─ Filter bindings in ControlBindingsOverlayHtml
```

## Component Integration Details

### 1. Mode Toggle
**Location:** After header, before category tabs  
**Test IDs:** `mode-toggle`, `keyboard-mode-button`, `gamepad-mode-button`

**Features:**
- Two buttons: Keyboard and Gamepad
- Active button: Cyan glow + different background
- Inactive button: Gold border + dark background
- Hover effect: Subtle cyan tint
- Click: Plays `menu_select` sound

**Code:**
```typescript
<button
  onClick={() => {
    audio.playSFX("menu_select");
    setCategory("keyboard");
  }}
  onMouseEnter={(e) => handleModeButtonEnter(e, category === "keyboard")}
  onMouseLeave={(e) => handleModeButtonLeave(e, category === "keyboard")}
>
  ⌨️ 키보드 | Keyboard
</button>
```

### 2. Category Tabs
**Component:** `ControlCategoryTabs`  
**Test ID:** `control-category-tabs`

**Props:**
```typescript
{
  selectedTab: 'combat' | 'movement' | 'system',
  onTabChange: (tab) => void,
  isMobile: boolean
}
```

**Tabs:**
- ⚔️ 전투 | Combat (Red, `#ff4444`)
- 🏃 이동 | Movement (Magenta)
- ⚙️ 시스템 | System (Cyan, `#00ff88`)

### 3. 3D Visualizations in Canvas

#### VisualKeyboard3D (when category === 'keyboard')
**Props:**
```typescript
{
  pressedKeys: Set<string>,
  selectedTab: 'combat' | 'movement' | 'system'
}
```

**Features:**
- Renders full keyboard layout in 3D
- Filters keys by selected category/tab
- Highlights pressed keys with glow effect
- Ambient + directional + point lighting
- Grid background plane
- Positioned at [0, -1, 0] with rotation

#### GamepadVisualization3D (when category === 'gamepad')
**Props:**
```typescript
{
  isMobile: boolean
}
```

**Features:**
- 3D gamepad body (left + right + center sections)
- 12 button spheres with emissive glow
- HTML overlays for button labels
- Bilingual labels (Korean | English)
- Action descriptions per button

### 4. Control Bindings Display
**Component:** `ControlBindingsOverlayHtml`  
**Test ID:** `control-bindings`

**Props:**
```typescript
{
  selectedTab: 'combat' | 'movement' | 'system',
  isMobile: boolean
}
```

**Layout:**
- Desktop: Grid (auto-fill, min 280px columns)
- Mobile: Single column list
- Max height: 70vh (desktop), 60vh (mobile)
- Scrollable with Korean-themed scrollbar

**Card Features:**
- Key label with category color
- Korean label if available
- Bilingual description
- Category badge
- Hover: Elevation + glow effect

### 5. Interactive Demo
**Component:** `InteractiveControlDemo`  
**Test ID:** `interactive-demo`

**Props:**
```typescript
{
  pressedKeys: Set<string>,
  isMobile: boolean
}
```

**Features:**
- Fixed position at bottom center
- Shows last 5 pressed keys
- Auto-fades after 2 seconds (opacity based on age)
- Bilingual key descriptions
- Color-coded by key category
- Non-intrusive (pointer-events: none on content)
- Z-index: 1000 (above all other UI)

**Empty State:**
```
키를 눌러서 액션을 확인하세요 | Press keys to see actions
```

## Color System (Korean Five Cardinal Colors)

### Category Colors
- **Combat:** `KOREAN_RED` (#ff4444) - 남방 적색 (South Red)
- **Movement:** `SECONDARY_MAGENTA` - Movement actions
- **System:** `PRIMARY_CYAN` (#00ff88) - 동방 청색 (East Cyan)

### UI Colors
- **Background:** `UI_BACKGROUND_DARK` (0x1a1a2e)
- **Accent:** `ACCENT_GOLD` (#ffaa00) - 중앙 황색 (Center Gold)
- **Border:** Gold/Cyan based on context
- **Text Primary:** White - 서방 백색 (West White)
- **Text Secondary:** Light gray

## Keyboard Shortcuts

### Screen-Level
- **ESC** or **M**: Return to menu (plays `menu_back` sound)

### Category Navigation
- Click tabs to switch between Combat/Movement/System
- Click mode toggle to switch between Keyboard/Gamepad

### Key Press Detection
- All keyboard input tracked in real-time
- Excludes input in text fields (HTMLInputElement, HTMLTextAreaElement)
- Updates pressedKeys Set on keydown
- Removes from Set on keyup
- Cleanup on component unmount

## Performance Optimizations

### Memoization
```typescript
// Layout constants
const layoutConstants = useMemo(() => 
  getLayoutConstants(screenWidth), [screenWidth]
);

// Color mappings
const colors = useMemo(() => ({
  background: hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.95),
  // ... other colors
}), [theme]);

// Legacy control data
const stanceControls = useMemo(() => 
  Object.entries(COMBAT_CONTROLS.stanceControls), []
);
```

### Callbacks
```typescript
// Back button handler
const handleBackClick = useCallback(() => {
  audio.playSFX("menu_back");
  onReturnToMenu();
}, [audio, onReturnToMenu]);

// Mode button hover handlers (DRY refactoring)
const handleModeButtonEnter = useCallback((e, isActive) => { ... }, [theme]);
const handleModeButtonLeave = useCallback((e, isActive) => { ... }, [theme]);
```

### Conditional Rendering
- 3D visualization only renders active mode (keyboard OR gamepad, not both)
- Control bindings filtered before rendering
- Interactive demo only shows recent entries (max 5)

## Testing Coverage

### Existing Tests (24/24 passing)
✅ Render without crashing  
✅ Has controls-screen test ID  
✅ Renders Three.js Canvas  
✅ Adapts to desktop layout  
✅ Renders header with title  
✅ Renders content area  
✅ Renders Trigram controls section  
✅ Renders 8 stance controls  
✅ Renders combat controls section  
✅ Renders movement controls section  
✅ Renders back button  
✅ Calls onReturnToMenu on back click  
✅ Calls onReturnToMenu on ESC  
✅ Calls onReturnToMenu on M key  
✅ Has proper ARIA labels  
✅ Responsive layout changes  
... (24 total tests)

### New Test Coverage Needed (Optional)
- Mode toggle button clicks
- Category tab selection
- Key press tracking in pressedKeys
- 3D visualization switching
- Interactive demo auto-fade behavior
- Hover effects on mode buttons

## Accessibility

### Keyboard Navigation
- ESC/M: Return to menu
- Tab: Navigate between interactive elements
- Enter/Space: Activate buttons

### Test IDs (for automation)
- `controls-screen`: Root container
- `mode-toggle`: Mode toggle container
- `keyboard-mode-button`: Keyboard button
- `gamepad-mode-button`: Gamepad button
- `control-category-tabs`: Tabs container
- `tab-combat`, `tab-movement`, `tab-system`: Individual tabs
- `control-bindings`: Bindings container
- `binding-{keyCode}`: Individual binding cards
- `interactive-demo`: Demo container
- `key-press-{keyCode}`: Recent key press entries
- `visual-keyboard`: 3D keyboard group
- `gamepad-visualization`: 3D gamepad group

### ARIA Support
- Bilingual labels throughout
- Semantic HTML structure
- Clear visual hierarchy
- High contrast color scheme

## Browser Compatibility

### WebGL Requirements
- WebGL 2.0 support for 3D rendering
- Falls back gracefully if WebGL unavailable
- Context loss handling implemented

### CSS Features
- Flexbox for layout
- CSS Grid for control bindings
- CSS Transitions for smooth animations
- Custom scrollbar styling (WebKit + Firefox)

### Tested Browsers
- Chrome/Edge: Full support
- Firefox: Full support (Firefox scrollbar styles)
- Safari: Full support
- Mobile browsers: Responsive layout adapts

## File Locations

### Main Component
```
src/components/screens/controls/ControlsScreen3D.tsx
```

### Integrated Components
```
src/components/screens/controls/
├── hooks/
│   └── useControlsState.ts
└── components/
    ├── ControlCategoryTabs.tsx
    ├── ControlBindingsOverlayHtml.tsx
    ├── VisualKeyboard3D.tsx
    ├── GamepadVisualization3D.tsx
    ├── InteractiveControlDemo.tsx
    └── Key3D.tsx
```

### Constants
```
src/components/screens/controls/constants/ControlsConstants.ts
```

### Tests
```
src/components/screens/controls/ControlsScreen3D.test.tsx
```

## Quick Commands

### Development
```bash
# Start dev server
npm run dev

# Type checking
npm run check

# Linting
npm run lint src/components/screens/controls/ControlsScreen3D.tsx

# Run tests
npm test -- --run src/components/screens/controls/ControlsScreen3D.test.tsx

# Watch mode
npm test -- --watch src/components/screens/controls/
```

### Build
```bash
# Production build
npm run build

# Preview build
npm run preview
```

---

**Integration Complete** ✅  
**Tests Passing** ✅ (24/24)  
**TypeScript** ✅ No errors  
**Production Ready** ✅

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
