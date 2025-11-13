# Top 5 Priority Issues for Next Minor Release (v0.4.0)

## Overview

This document contains 5 carefully prioritized GitHub issues for the Black Trigram project's next minor release. Each issue includes:
- Accurate baseline metrics from current codebase
- Specific, testable acceptance criteria
- Detailed implementation guidance with file paths
- Clear priority and effort estimates

**To create these issues:**
1. Copy each issue section below
2. Create a new GitHub issue at: https://github.com/Hack23/blacktrigram/issues/new
3. Use the title and body provided
4. Add the suggested labels

---

## Issue 1: ⚡ Increase test coverage from 49.56% to 70%+ for next release

**Title:** `⚡ Increase test coverage from 49.56% to 70%+ for next release`

**Labels:** `testing`, `quality`

**Body:**

## 🎯 Objective

Increase overall test coverage from **49.56%** to **70%+** to ensure code quality and stability for the next minor release.

## 📋 Background

Current test coverage analysis shows significant gaps in critical areas:
- **Overall coverage: 49.56%** (statements), 47.65% (branches), 50.88% (functions), 49.9% (lines)
- **Combat components: 23.96%** - CombatControls (24.44%), CombatHUD (16.66%)
- **UI components: 30.72%** - HealthBar (25.28%), RoundTimer (40%), StanceIndicator (29.16%)
- **VitalPoint system: 15.89%** - DamageCalculator (0%), HitDetection (0%), KoreanAnatomy (19.76%)
- **Audio system: 30.23%** - AudioManager (24.62%), AudioUtils (34.66%)

Well-tested areas:
- **Systems core: 79.85%** - CombatSystem (43.9%), TrigramSystem (93.18%), VitalPointSystem (93.33%)
- **Trigram system: 54.9%** - StanceManager (91.66%), TransitionCalculator (56.52%)

## ✅ Acceptance Criteria

- [ ] Overall test coverage increased to 70%+ (statements)
- [ ] Combat components coverage increased to 60%+ (from 23.96%)
- [ ] UI components coverage increased to 60%+ (from 30.72%)
- [ ] VitalPoint system coverage increased to 50%+ (from 15.89%)
- [ ] Audio system coverage increased to 60%+ (from 30.23%)
- [ ] All new tests pass in CI
- [ ] Coverage reports updated in `docs/coverage/`

## 🛠️ Implementation Guidance

### Files to Add/Modify

**Priority 1: Combat Components (24% → 60%)**
- `src/components/combat/components/__tests__/CombatControls.test.tsx` - Add tests for technique selection, stance changes, hotkey mappings
- `src/components/combat/components/__tests__/CombatHUD.test.tsx` - Add tests for HUD rendering, health updates, status displays
- `src/components/combat/components/__tests__/CombatStatsPanel.test.tsx` - Expand existing tests for stats calculation

**Priority 2: UI Components (31% → 60%)**
- `src/components/ui/__tests__/HealthBar.test.tsx` - Add tests for damage animation, color transitions, edge cases
- `src/components/ui/__tests__/RoundTimer.test.tsx` - Add tests for countdown, urgency states, time formatting
- `src/components/ui/__tests__/StanceIndicator.test.tsx` - Add tests for stance transitions, visual states

**Priority 3: VitalPoint System (16% → 50%)**
- `src/systems/vitalpoint/__tests__/DamageCalculator.test.ts` - Create comprehensive damage calculation tests
- `src/systems/vitalpoint/__tests__/HitDetection.test.ts` - Create hit box detection and collision tests
- `src/systems/vitalpoint/__tests__/KoreanAnatomy.test.ts` - Expand anatomical region tests

**Priority 4: Audio System (30% → 60%)**
- `src/audio/__tests__/AudioManager.test.ts` - Expand tests for audio playback, volume control, fade transitions
- `src/audio/__tests__/AudioUtils.test.ts` - Add tests for audio variant selection, context switching

### Approach

1. **Start with high-impact areas**: Focus on combat components and VitalPoint system first as they're critical for gameplay
2. **Use existing test patterns**: Follow patterns from well-tested files like `TrigramSystem.test.ts` and `StanceManager.test.ts`
3. **Test data-testid usage**: Ensure all interactive components have proper test IDs for E2E test integration
4. **Mock dependencies**: Use existing mocks in `src/test/setup.ts` for PixiJS and audio
5. **Incremental approach**: Add tests file by file, running coverage after each to track progress

### Edge Cases to Handle

- Health/stamina at 0, negative values, overflow
- Technique cooldowns and stamina costs
- Audio playback when muted or context not initialized
- Stance transitions with invalid combinations
- Hit detection at boundary coordinates
- Timer countdown to 0 and negative values

## 📊 Metadata

**Priority:** Critical  
**Effort:** Large (2-3 days)  
**Impact:** High - Ensures code quality and reduces regression risk

## 🔗 Related Resources

- Current coverage report: `docs/coverage/index.html`
- Test setup: `src/test/setup.ts`
- Test utilities: `src/test/test-utils.ts`
- Example tests: `src/systems/__tests__/TrigramSystem.test.ts`
- CI test workflow: `.github/workflows/test-and-report.yml`

---

## Issue 2: 🔒 Fix 6 npm security vulnerabilities (1 moderate, 5 high)

**Title:** `🔒 Fix 6 npm security vulnerabilities (1 moderate, 5 high)`

**Labels:** `security`, `dependencies`

**Body:**

## 🎯 Objective

Fix **6 security vulnerabilities** (1 moderate, 5 high) in npm dependencies to ensure application security for production deployment.

## 📋 Background

Current dependency security audit shows:
```json
{
  "vulnerabilities": {
    "info": 0,
    "low": 0,
    "moderate": 1,
    "high": 5,
    "critical": 0,
    "total": 6
  },
  "dependencies": {
    "prod": 32,
    "dev": 1365,
    "optional": 81,
    "peer": 64,
    "total": 1397
  }
}
```

These vulnerabilities pose security risks and must be resolved before the next minor release. The repository follows strict security practices (OSSF Scorecard, SLSA 3) and cannot ship with known vulnerabilities.

## ✅ Acceptance Criteria

- [ ] All 6 npm audit vulnerabilities resolved (0 moderate, 0 high, 0 critical)
- [ ] `npm audit` returns 0 vulnerabilities
- [ ] All dependencies updated to latest secure versions
- [ ] All tests pass after dependency updates
- [ ] Application builds successfully (`npm run build`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] No breaking changes introduced by dependency updates
- [ ] `package-lock.json` updated and committed

## 🛠️ Implementation Guidance

### Files to Modify
- `package.json` - Update vulnerable dependency versions
- `package-lock.json` - Will be auto-updated by npm

### Approach

**Step 1: Identify Vulnerable Dependencies**
```bash
npm audit --json > audit-report.json
npm audit --production  # Check production dependencies specifically
```

**Step 2: Review Vulnerability Details**
```bash
npm audit
# Review each vulnerability:
# - Severity level
# - Affected package
# - Vulnerable versions
# - Patched versions
# - Dependency path
```

**Step 3: Update Dependencies Safely**

For each vulnerability:

**Option A: Automatic Fix (Preferred)**
```bash
npm audit fix
npm audit fix --force  # Only if automatic fix doesn't work
```

**Option B: Manual Update**
```bash
# For direct dependencies
npm update <package-name>@latest

# For transitive dependencies
npm install <parent-package>@latest
```

**Step 4: Validate Changes**
```bash
# Verify no vulnerabilities remain
npm audit

# Check for breaking changes
npm run check
npm run lint
npm run test
npm run build
npm run test:e2e

# Test production build
npm run preview
```

### Edge Cases to Handle

- **Peer dependency conflicts**: Resolve with `npm install --legacy-peer-deps` if needed
- **Transitive dependencies**: May require updating parent packages
- **Breaking changes in minor versions**: Some packages don't follow semver strictly
- **Deprecated packages**: Consider replacing with maintained alternatives

## 📊 Metadata

**Priority:** Critical  
**Effort:** Small (2-4 hours)  
**Impact:** Critical - Security vulnerabilities must be fixed before release

## 🔗 Related Resources

- npm audit documentation: https://docs.npmjs.com/cli/v8/commands/npm-audit
- Security policy: `SECURITY.md`
- Dependency update workflow: `.github/workflows/test-and-report.yml`
- OSSF Scorecard: https://scorecard.dev/viewer/?uri=github.com/Hack23/blacktrigram
- Package.json: `package.json`

---

## Issue 3: 🎨 Implement player animation system with spritesheet integration

**Title:** `🎨 Implement player animation system with spritesheet integration`

**Labels:** `graphics`, `animation`

**Body:**

## 🎯 Objective

Implement complete player animation system with spritesheet integration to bring combat visuals to life, transitioning from placeholder states to production-ready character animations.

## 📋 Background

Current state (from `game-status.md`):
- **Visual Implementation: 5/10** - Player animations rely on placeholder states
- **Combat Screen: 6.5/10** - Major upgrade complete, but animation states not connected
- **Spritesheet Production: 100%** - All spritesheet manifests ready (`assets/spritesheets/*.json`)

Assets ready for integration:
- 5 archetype spritesheet manifests: `amsalja_assassin.json`, `musa_warrior.json`, `jojik_crime.json`, `jeongbo_operative.json`, `hacker_cyber.json`
- Animation guides: `ai-guides/00_general_spritesheet_guidelines.md` plus archetype-specific guides
- CSV manifests: Enumerate desired animation clips per archetype

**Gap**: Spritesheets exist but are not yet bound to `PlayerVisuals` component. Combat feels static without fluid character movement.

## ✅ Acceptance Criteria

- [ ] `PlayerVisuals.tsx` integrated with `PlayerSpritesheet.ts` runtime lookup
- [ ] All 8 trigram stance animations implemented (건/Geon through 곤/Gon)
- [ ] Attack animations for light/medium/heavy techniques connected to combat events
- [ ] Defensive animations (block, dodge, parry) wired to combat system
- [ ] Hit reaction and KO animations trigger properly
- [ ] Idle and movement animations loop smoothly
- [ ] Animation state machine implemented for smooth transitions
- [ ] All 5 archetypes have working animations
- [ ] Performance: Maintains 60fps during combat with animations active
- [ ] Animations respect Korean martial arts authenticity

## 🛠️ Implementation Guidance

### Files to Modify

**Core Animation System:**
- `src/components/ui/PlayerVisuals.tsx` - Connect spritesheet animations to player state
- `src/utils/spriteUtils.ts` - Extend with animation frame lookup and transition logic
- `src/utils/PlayerSpritesheet.ts` - Runtime lookup layer for animation states

**Combat Integration:**
- `src/components/combat/CombatScreen.tsx` - Trigger animations based on combat events
- `src/systems/CombatSystem.ts` - Add animation trigger hooks to combat resolution
- `src/components/ui/HitEffectsLayer.tsx` - Synchronize VFX with animation timing

**New Files to Create:**
- `src/systems/animation/AnimationController.ts` - State machine for animation transitions
- `src/systems/animation/types.ts` - Animation state types and transition rules
- `src/components/ui/__tests__/PlayerVisuals.test.tsx` - Unit tests for animation system

### Approach

**Phase 1: Animation State Machine (Day 1)** - Create AnimationController class with state transitions
**Phase 2: Spritesheet Integration (Day 2)** - Connect PlayerVisuals to spritesheet frames
**Phase 3: Combat Event Integration (Day 3)** - Trigger animations from combat system
**Phase 4: Testing & Polish (Day 4)** - Unit tests, performance validation, visual QA

### Edge Cases to Handle

- Animation interruption (heavy attack interrupted by faster strike)
- Simultaneous hits (both players hit each other)
- KO during animation
- Stance change during attack
- Missing frames (fallback to placeholder)
- Performance degradation on low-end devices

## 📊 Metadata

**Priority:** High  
**Effort:** Large (3-4 days)  
**Impact:** High - Dramatically improves visual polish and combat feel

## 🔗 Related Resources

- Game status report: `game-status.md` (Section: Visual & UX Assessment)
- Spritesheet manifests: `assets/spritesheets/*.json`
- Animation guides: `ai-guides/00_general_spritesheet_guidelines.md`
- PlayerVisuals component: `src/components/ui/PlayerVisuals.tsx`
- Animation constants: `src/types/constants/animations.ts`

---

## Issue 4: ⚡ Optimize bundle size from 1.23MB to <800KB and ensure 60fps

**Title:** `⚡ Optimize bundle size from 1.23MB to <800KB and ensure 60fps`

**Labels:** `performance`, `optimization`

**Body:**

## 🎯 Objective

Optimize bundle size from **1.23 MB** to under **800 KB** (35% reduction) and ensure consistent **60fps** performance across desktop, tablet, and mobile devices.

## 📋 Background

Current production build metrics:
```
dist/index.html                  6.84 kB
dist/assets/game-D4Ohx9.css     14.46 kB
dist/assets/index-8T0J5r.js  1,232.78 kB  ⚠️ TOO LARGE
✓ built in 4.74s
```

**Issues:**
- **Bundle size: 1.23 MB** - Exceeds best practice (<500 KB for initial load)
- **No code splitting** - Entire app loads at once
- **PixiJS bundle size** - Large WebGL library included
- **Asset optimization** - Images and audio not optimized for web
- **Performance profiling** - No formal 60fps validation across devices

From `game-status.md` Platform & Performance (8.2/10):
- "Need to profile `HitEffectsLayer` interval timer and large `PlayerVisuals` graphics to ensure 60 fps on mid-tier mobile"
- "Add a formal performance script (e.g., simulated combat loop) before beta"

## ✅ Acceptance Criteria

- [ ] Main bundle reduced to <800 KB (gzipped: <250 KB)
- [ ] Code splitting implemented (separate chunks for intro, combat, training)
- [ ] PixiJS tree-shaking optimized (remove unused modules)
- [ ] Images optimized (WebP format, proper sizing)
- [ ] Audio streaming implemented (lazy load audio files)
- [ ] Lighthouse Performance score >90
- [ ] 60fps maintained during combat on mid-tier mobile (simulated)
- [ ] Bundle analysis report generated and documented
- [ ] Performance monitoring added to CI pipeline

## 🛠️ Implementation Guidance

### Files to Modify

**Build Configuration:**
- `vite.config.ts` - Add code splitting, optimize chunks, configure compression
- `package.json` - Add bundle analysis scripts

**Lazy Loading:**
- `src/App.tsx` - Implement React.lazy() for screen components
- `src/main.tsx` - Configure route-based code splitting

**Asset Optimization:**
- `public/assets/audio/` - Implement streaming, convert to optimal formats
- `public/assets/visual/` - Optimize images (WebP, proper sizing)

**Performance Monitoring:**
- `src/utils/performanceMonitor.ts` - Create FPS tracker
- `scripts/performance-test.ts` - Automated performance benchmarks

### Approach

**Phase 1: Bundle Analysis (Day 1)** - Generate bundle report, identify largest dependencies
**Phase 2: Code Splitting (Day 1-2)** - Implement lazy loading for screens, vendor chunks
**Phase 3: PixiJS Optimization (Day 2)** - Tree-shake unused modules, optimize imports
**Phase 4: Asset Optimization (Day 2-3)** - Convert to WebP, lazy load audio
**Phase 5: Performance Monitoring (Day 3)** - Create FPS tracker, automated benchmarks
**Phase 6: Compression (Day 3)** - Enable gzip/brotli compression

### Expected Results

**Before:**
- Main bundle: 1,232.78 KB
- Initial load time: ~3-4s on 3G
- No code splitting
- FPS: Unknown

**After:**
- Main bundle: <300 KB
- Vendor chunk: <400 KB
- Combat chunk: <150 KB (lazy loaded)
- Training chunk: <100 KB (lazy loaded)
- Initial load time: <1.5s on 3G
- FPS: 60 (validated on mobile)

## 📊 Metadata

**Priority:** High  
**Effort:** Medium (2-3 days)  
**Impact:** High - Improves user experience and mobile performance

## 🔗 Related Resources

- Vite config: `vite.config.ts`
- Game status: `game-status.md` (Platform & Performance section)
- Bundle analysis: Run `npm run build:analyze`
- Lighthouse CI: `.github/workflows/lighthouse.yml`
- Performance testing plan: `performance-testing.md`

---

## Issue 5: 🛡️ Fix 12 OWASP ZAP security findings (CSP, HSTS, headers)

**Title:** `🛡️ Fix 12 OWASP ZAP security findings (CSP, HSTS, headers)`

**Labels:** `security`, `infrastructure`

**Body:**

## 🎯 Objective

Fix **12 high-priority security findings** from OWASP ZAP scan to harden the production deployment at blacktrigram.com.

## 📋 Background

Recent ZAP Full Scan (Issue #16) identified 12 categories of security findings:

**High Priority (Must Fix):**
1. Content Security Policy (CSP) Header Not Set [10038] - 1 instance
2. Missing Anti-clickjacking Header [10020] - 1 instance
3. Strict-Transport-Security Header Not Set [10035] - 7 instances
4. X-Content-Type-Options Header Missing [10021] - 5 instances
5. Permissions Policy Header Not Set [10063] - 5 instances

**Medium Priority (Should Fix):**
6. CORS Misconfiguration [40040] - 9 instances
7. Cross-Domain Misconfiguration [10098] - 7 instances
8. CSP: Failure to Define Directive with No Fallback [10055] - 4 instances
9. CSP: style-src unsafe-inline [10055] - 2 instances
10. Sub Resource Integrity Attribute Missing [90003] - 3 instances
11. Insufficient Site Isolation Against Spectre Vulnerability [90004] - 2 instances
12. Information Disclosure - Suspicious Comments [10027] - 2 instances

Full ZAP report: https://github.com/Hack23/blacktrigram/actions/runs/15312040733

## ✅ Acceptance Criteria

- [ ] Content Security Policy (CSP) header implemented with strict directives
- [ ] X-Frame-Options header added to prevent clickjacking
- [ ] Strict-Transport-Security (HSTS) header added for all responses
- [ ] X-Content-Type-Options header set to 'nosniff'
- [ ] Permissions-Policy header configured
- [ ] CORS policy properly configured (restrict to blacktrigram.com only)
- [ ] Subresource Integrity (SRI) hashes added to script/link tags
- [ ] Cross-Origin-Embedder-Policy and Cross-Origin-Opener-Policy headers added
- [ ] Suspicious comments removed from production bundles
- [ ] ZAP scan shows 0 high-priority findings
- [ ] All headers validated in production deployment

## 🛠️ Implementation Guidance

### Files to Modify

**GitHub Pages Configuration:**
- Create: `.github/workflows/deploy-with-headers.yml` - Deploy workflow with header injection
- Modify: `vite.config.ts` - Add CSP meta tag and SRI generation
- Create: `public/_headers` - Netlify-style headers file

**Build Process:**
- Modify: `vite.config.ts` - Configure SRI plugin
- Create: `scripts/generate-sri.ts` - Generate SRI hashes for assets
- Modify: `index.html` - Add security meta tags

### Approach

**Phase 1: Security Headers Configuration (Day 1)** - Implement headers via Cloudflare Pages or Service Worker
**Phase 2: Content Security Policy (Day 1)** - Add CSP meta tag with proper directives
**Phase 3: Subresource Integrity (Day 2)** - Generate and add SRI hashes
**Phase 4: CORS Policy (Day 2)** - Configure proper CORS headers
**Phase 5: Remove Suspicious Comments (Day 2)** - Strip comments in production build
**Phase 6: Validation (Day 3)** - Test headers locally and in production

### Complete Security Headers

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; worker-src 'self' blob:; frame-ancestors 'none'
```

**Note:** We need `'unsafe-inline'` for PixiJS and React inline styles. Monitor CSP violations and tighten gradually.

## 📊 Metadata

**Priority:** High  
**Effort:** Medium (2-3 days)  
**Impact:** High - Critical for production security compliance

## 🔗 Related Resources

- ZAP Scan Report: Issue #16
- Security policy: `SECURITY.md`
- OWASP ZAP documentation: https://www.zaproxy.org/docs/
- CSP Evaluator: https://csp-evaluator.withgoogle.com/
- Vite config: `vite.config.ts`

---

## Summary

These 5 issues represent the highest priority work for the next minor release (v0.4.0):

| Issue | Priority | Effort | Impact | Dependencies |
|-------|----------|--------|--------|--------------|
| #1 Test Coverage | Critical | Large (2-3d) | High | None |
| #2 Security Vulnerabilities | Critical | Small (2-4h) | Critical | None |
| #3 Animation System | High | Large (3-4d) | High | None |
| #4 Bundle Optimization | High | Medium (2-3d) | High | None |
| #5 ZAP Security Findings | High | Medium (2-3d) | High | None |

**Total Estimated Effort:** 10-15 days  
**Recommended Approach:** Tackle issues #2 (security) and #1 (testing) first, then proceed with #3, #4, and #5 in parallel.

**흑괘의 길을 걸어라** - *Walk the Path of the Black Trigram*
