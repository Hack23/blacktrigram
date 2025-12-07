# Pause Menu System Documentation

## Overview

The pause menu system provides a comprehensive in-game menu for the Black Trigram combat system, allowing players to pause combat, adjust settings, view controls, restart the match, or return to the main menu.

## Components

### PauseMenu

Main pause menu overlay with Korean cyberpunk theming.

**Features:**
- Resume combat
- Restart match (with confirmation)
- View controls guide
- Access quick settings
- Return to main menu (with confirmation)
- ESC key to toggle pause
- Backdrop blur effect
- Responsive mobile/desktop layouts

**Usage:**
```tsx
import { PauseMenu } from './components/combat/components';

<PauseMenu
  onResume={() => setIsPaused(false)}
  onRestart={() => resetMatch()}
  onReturnToMenu={() => navigate('/menu')}
  isMobile={window.innerWidth < 768}
/>
```

### ConfirmDialog

Modal confirmation dialog for destructive actions.

**Features:**
- Korean/English bilingual text
- Keyboard shortcuts (Enter = confirm, ESC = cancel)
- Backdrop click to cancel
- Audio feedback
- Cyberpunk Korean styling

**Usage:**
```tsx
import { ConfirmDialog } from './components/combat/components';

<ConfirmDialog
  isOpen={showConfirm}
  title="Restart Match?"
  titleKorean="경기를 재시작하시겠습니까?"
  message="All progress will be lost."
  messageKorean="모든 진행 상황이 초기화됩니다."
  onConfirm={() => handleRestart()}
  onCancel={() => setShowConfirm(false)}
  isMobile={isMobile}
/>
```

### QuickSettings

In-game audio settings panel.

**Features:**
- SFX volume slider
- Music volume slider
- Mute toggle
- Real-time audio feedback
- Responsive layout

**Usage:**
```tsx
import { QuickSettings } from './components/combat/components';

<QuickSettings
  onClose={() => setShowSettings(false)}
  isMobile={isMobile}
/>
```

### ControlsGuide

Combat controls reference overlay.

**Features:**
- Complete control mapping
- Korean/English labels
- Organized by action type
- Tips section
- Scrollable on mobile

**Usage:**
```tsx
import { ControlsGuide } from './components/combat/components';

<ControlsGuide
  onClose={() => setShowControls(false)}
  isMobile={isMobile}
/>
```

## Hook: usePauseMenu

State management hook for pause menu and submenus.

**Features:**
- Submenu navigation (main, controls, settings)
- Confirmation dialog state
- Type-safe state transitions

**Usage:**
```tsx
import { usePauseMenu } from './hooks';

const {
  activeSubmenu,
  confirmDialog,
  showControls,
  showSettings,
  closeSubmenu,
  openConfirmDialog,
  closeConfirmDialog,
  confirmAndClose,
} = usePauseMenu();

// Show controls
showControls();

// Open confirmation
openConfirmDialog({
  title: "Are you sure?",
  titleKorean: "확실합니까?",
  message: "This cannot be undone.",
  messageKorean: "취소할 수 없습니다.",
  onConfirm: () => performAction(),
});

// Close submenu
closeSubmenu();
```

## Integration with CombatScreen3D

The pause menu is integrated into CombatScreen3D and responds to the `isPaused` prop and ESC key:

```tsx
// ESC key toggles pause menu
useEffect(() => {
  const handleCombatInput = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      if (showPauseMenu) {
        handleResume();
      } else {
        handlePause();
      }
      return;
    }
    // ... other controls
  };
  
  window.addEventListener("keydown", handleCombatInput);
  return () => window.removeEventListener("keydown", handleCombatInput);
}, [showPauseMenu, handlePause, handleResume]);
```

## Keyboard Shortcuts

- **ESC** - Toggle pause menu / Close submenus / Resume
- **Enter** - Confirm action in dialog
- **ESC** - Cancel action in dialog

## Accessibility

All components include:
- `data-testid` attributes for testing
- Korean/English bilingual text
- Keyboard navigation support
- Proper ARIA labels (where applicable)
- Mobile-optimized touch targets

## Testing

Comprehensive test coverage:
- **PauseMenu.test.tsx**: 12 tests (rendering, interactions, keyboard nav)
- **ConfirmDialog.test.tsx**: 12 tests (rendering, interactions, keyboard shortcuts)
- **usePauseMenu.test.ts**: 13 tests (state management, navigation, dialogs)

Run tests:
```bash
npm test -- PauseMenu.test
npm test -- ConfirmDialog.test
npm test -- usePauseMenu.test
```

## Styling

All components use the Korean cyberpunk color palette from `KOREAN_COLORS`:
- **Primary**: Cyan (`0x00ffff`)
- **Accent**: Gold (`0xffd700`)
- **Background**: Dark (`0x1a1a2e`)
- **Text**: Primary white, Secondary cyan

Font: `FONT_FAMILY.KOREAN` for Korean text support

## Performance

- Backdrop blur: `8px` for balanced performance/aesthetics
- Minimal re-renders with proper memoization
- Audio feedback on hover/click
- Smooth transitions with CSS
- Responsive layout calculations

## Future Enhancements

Potential improvements:
- Custom keybinding support
- Graphics settings (quality, resolution)
- Language selection
- Save/load game state
- Statistics and achievements display
