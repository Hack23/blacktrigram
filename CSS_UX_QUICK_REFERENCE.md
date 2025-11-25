# CSS/UX Quick Reference Guide - Black Trigram

## 🚨 Critical Issues to Fix Immediately

### 1. Audio Initialization Error (BLACK SCREEN)
**File:** `src/audio/AudioProvider.tsx` or related audio components

```typescript
// Current issue: audio.stopMusic is not a function
// This causes complete black screen after clicking start

// Solution: Check AudioProvider interface and ensure all methods exist
interface AudioContextValue {
  playSFX: (soundId: string) => void;
  playMusic: (musicId: string) => void;
  stopMusic: () => void;  // ← Ensure this method exists
  setVolume: (volume: number) => void;
  // ... other methods
}
```

### 2. Duplicate CSS - Canvas Styling
**Files:** `App.css`, `index.css`, `Game.css`

**Current:** Same canvas styles defined 4+ times across files
```css
/* REMOVE from App.css line 375-390, 764-779 */
/* REMOVE from index.css line 106-117, 273-286 */
```

**Keep ONLY ONE version in index.css:**
```css
canvas {
  display: block;
  position: relative;
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  border: none;
  background: #000000;
  image-rendering: pixelated;
  cursor: pointer;
  outline: none;
  z-index: 1;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

### 3. CSS Variables Consolidation
**Files:** `App.css`, `index.css`

**Current:** 3 different variable naming systems
```css
/* App.css */
--korean-primary: #00d4ff;

/* index.css */
--primary-cyan: #00ffff;

/* App.css (again) */
--black-trigram-cyan: #00ffd0;
```

**Solution:** Pick ONE system and use everywhere
```css
/* Recommended: Keep in index.css ONLY */
:root {
  /* Primary Colors */
  --color-primary-cyan: #00ffff;
  --color-primary-gold: #ffd700;
  --color-primary-black: #000000;
  
  /* Korean Traditional (오방색) */
  --color-korean-east: #00ff88;
  --color-korean-west: #ffffff;
  --color-korean-south: #ff4444;
  --color-korean-north: #000000;
  --color-korean-center: #ffaa00;
  
  /* UI Colors */
  --color-bg-dark: #0a0a0f;
  --color-bg-medium: #1a1a2e;
  --color-text-primary: #ffffff;
  --color-text-secondary: #e0e0e0;
  
  /* Semantic */
  --color-danger: #ff3366;
  --color-warning: #ffb700;
  --color-success: #00ff88;
}
```

## ⚡ Performance Quick Wins

### 1. GPU-Accelerated Animations
**Replace text-shadow animations with opacity:**

```css
/* ❌ BAD - Triggers paint on every frame */
@keyframes korean-glow {
  0%, 100% { text-shadow: 0 0 5px var(--korean-glow); }
  50% { text-shadow: 0 0 20px var(--korean-glow); }
}

/* ✅ GOOD - GPU accelerated */
.glow-text {
  position: relative;
}

.glow-text::before {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  filter: blur(10px);
  animation: glow-opacity 2s ease-in-out infinite;
  z-index: -1;
}

@keyframes glow-opacity {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
```

### 2. Remove !important
**Search and destroy unnecessary !important:**

```bash
# Find all !important usage
grep -r "!important" src/*.css

# Most can be removed by increasing specificity properly
```

```css
/* ❌ BAD */
canvas {
  width: 100vw !important;
  height: 100vh !important;
}

/* ✅ GOOD */
.game-container canvas {
  width: 100vw;
  height: 100vh;
}
```

### 3. Font Loading Optimization
**File:** `index.html`

```html
<!-- ❌ Current: Render blocking -->
<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap");
</style>

<!-- ✅ Better: Preload with font-display -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" 
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Orbitron:wght@400;700&display=swap"
      media="print" 
      onload="this.media='all'">
```

## 🎯 UX Quick Fixes

### 1. Error Boundary Component
**Create:** `src/components/ui/ErrorBoundary.tsx`

```typescript
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #8b0000 0%, #4b0000 100%)',
          color: '#fff',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            오류 발생 | Error Occurred
          </h1>
          <p style={{ marginBottom: '2rem', color: '#ff6b6b' }}>
            {this.state.error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
              background: '#ffd700',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            다시 시작 | Restart
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Use in App.tsx:**
```typescript
import { ErrorBoundary } from './components/ui/ErrorBoundary';

export const App = () => (
  <ErrorBoundary>
    {/* Your app content */}
  </ErrorBoundary>
);
```

### 2. Loading State with Progress
**Create:** `src/components/ui/LoadingState.tsx`

```typescript
interface LoadingStateProps {
  progress: number;
  message: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  progress, 
  message 
}) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #000a12 0%, #001a25 100%)'
  }}>
    <h1 style={{ 
      fontSize: '2.5rem', 
      color: '#ffd700',
      marginBottom: '2rem'
    }}>
      흑괘 | BLACK TRIGRAM
    </h1>
    
    <div style={{
      width: '300px',
      height: '8px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '1rem'
    }}>
      <div style={{
        width: `${progress}%`,
        height: '100%',
        background: 'linear-gradient(90deg, #00ffff, #ffd700)',
        transition: 'width 0.3s ease'
      }} />
    </div>
    
    <p style={{ color: '#fff', fontSize: '1.2rem' }}>
      {message}
    </p>
  </div>
);
```

### 3. Button Accessibility
**Update button styles in all CSS files:**

```css
.button,
.cyberpunk-button,
.menu-button {
  /* Minimum touch target */
  min-width: 44px;
  min-height: 44px;
  padding: 0.75rem 1.5rem;
  
  /* Keyboard focus */
  outline: none;
}

.button:focus-visible {
  outline: 3px solid var(--color-primary-cyan);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.2);
}

/* Mobile touch targets */
@media (max-width: 768px) {
  .button {
    min-width: 48px;
    min-height: 48px;
    padding: 1rem 1.5rem;
  }
}
```

## 📱 Mobile Quick Fixes

### 1. Viewport Height Fix
**Add to:** `src/utils/viewport.ts`

```typescript
export function setupViewportUnits() {
  function update() {
    const vh = window.innerHeight * 0.01;
    const vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
  }
  
  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', update);
  update();
}
```

**Call in main.tsx:**
```typescript
import { setupViewportUnits } from './utils/viewport';

setupViewportUnits();
```

**Use in CSS:**
```css
.game-container {
  height: calc(var(--vh, 1vh) * 100);
  width: calc(var(--vw, 1vw) * 100);
}
```

### 2. Touch Optimization
**Add to index.css:**

```css
@media (max-width: 768px) {
  /* Prevent zoom on double-tap */
  .game-screen,
  .combat-screen,
  .training-screen {
    touch-action: manipulation;
  }
  
  /* Prevent text selection */
  .game-screen {
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
  
  /* Tap feedback (not hover) */
  @media (hover: none) {
    .button:hover {
      /* Remove hover effect on touch devices */
      background: initial;
      transform: none;
    }
    
    .button:active {
      /* Add tap feedback instead */
      transform: scale(0.98);
      background: rgba(0, 212, 255, 0.3);
    }
  }
}
```

## 🎨 Color Contrast Fixes

### Update Text Colors for WCAG AA
**In index.css or tokens file:**

```css
:root {
  /* WCAG AAA compliant (7:1 ratio) */
  --color-text-primary: #ffffff;    /* 21:1 on black */
  --color-text-secondary: #e0e0e0;  /* 12:1 on black */
  --color-text-tertiary: #b0b0b0;   /* 7.5:1 on black */
  
  /* For large text (18px+ or 14px+ bold) - WCAG AA (4.5:1) */
  --color-text-muted: #999999;      /* 5.4:1 on black */
}

/* Replace all instances of low-contrast colors */
.intro-subtitle,
.korean-text-secondary {
  color: var(--color-text-secondary);  /* Was #cccccc */
}

.caption,
.help-text {
  color: var(--color-text-muted);
  font-size: 1.25rem;  /* Must be large text for this contrast */
}
```

## 📋 File Cleanup Checklist

### Files to Consolidate
- [ ] Remove duplicate canvas styles from App.css (lines 375-390, 764-779)
- [ ] Remove duplicate canvas styles from index.css (keep only one version)
- [ ] Consolidate CSS variables into single definition in index.css
- [ ] Remove duplicate !important declarations
- [ ] Merge duplicate media query blocks

### Files to Create
- [ ] `src/components/ui/ErrorBoundary.tsx`
- [ ] `src/components/ui/LoadingState.tsx`
- [ ] `src/utils/viewport.ts`
- [ ] `src/styles/tokens/` directory (future refactor)

### Tests to Add
- [ ] ErrorBoundary component test
- [ ] LoadingState component test
- [ ] Viewport utils test
- [ ] Accessibility audit (Lighthouse, axe)

## 🔍 Testing Commands

```bash
# Run TypeScript check
npm run check

# Run linter
npm run lint

# Run tests
npm test

# Build and check bundle size
npm run build
npm run build:analyze

# Test accessibility
npm install -g @axe-core/cli
axe http://localhost:5173

# Check for unused CSS
npm run find:unused
```

## 📊 Success Metrics

### Before Fixes
- CSS Size: ~1,629 lines
- Duplicate CSS: ~300+ lines
- !important count: 50+
- Runtime errors: Yes (audio)
- Loading feedback: Minimal
- Error handling: None

### After Fixes (Target)
- CSS Size: <1,000 lines
- Duplicate CSS: 0 lines
- !important count: <10
- Runtime errors: Handled gracefully
- Loading feedback: Progress bar
- Error handling: User-friendly recovery

## 🚀 Implementation Order

1. **Fix audio error** (blocks everything)
2. **Add ErrorBoundary** (prevents black screen)
3. **Add LoadingState** (better UX)
4. **Consolidate CSS variables** (one source of truth)
5. **Remove duplicate CSS** (reduce bundle size)
6. **Fix button accessibility** (WCAG compliance)
7. **Optimize animations** (60fps gameplay)
8. **Mobile viewport fix** (better mobile UX)

---

## 💡 Pro Tips

1. **Use CSS custom properties for everything themeable**
2. **Avoid !important - fix specificity instead**
3. **Test on real mobile devices, not just browser DevTools**
4. **Run Lighthouse audit after each major change**
5. **Keep components small and focused**
6. **Document why !important is used if absolutely necessary**
7. **Use BEM naming for new components**
8. **Test with keyboard navigation**
9. **Verify color contrast with WebAIM tool**
10. **Profile performance with Chrome DevTools**

---

**For full details, see:** `CSS_UX_UI_REVIEW.md`
