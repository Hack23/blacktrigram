#!/bin/bash
# Script to create GitHub issues from RELEASE_ISSUES.md
# Usage: ./scripts/create-release-issues.sh

set -e

REPO="Hack23/blacktrigram"
ISSUES_FILE="RELEASE_ISSUES.md"

echo "🎯 Black Trigram Release Issues Creator"
echo "========================================"
echo ""

# Check for gh CLI
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed"
    echo "   Install from: https://cli.github.com/"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "❌ Error: Not authenticated with GitHub"
    echo "   Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI authenticated"
echo ""

# Issue 1: Test Coverage
echo "Creating Issue 1: Test Coverage..."
gh issue create \
    --repo "$REPO" \
    --title "⚡ Increase test coverage from 49.56% to 70%+ for next release" \
    --label "testing,quality" \
    --body "$(cat <<'EOF'
## 🎯 Objective

Increase overall test coverage from **49.56%** to **70%+** to ensure code quality and stability for the next minor release.

## 📋 Background

Current test coverage analysis shows significant gaps in critical areas:
- **Overall coverage: 49.56%** (statements), 47.65% (branches), 50.88% (functions), 49.9% (lines)
- **Combat components: 23.96%** - CombatControls (24.44%), CombatHUD (16.66%)
- **UI components: 30.72%** - HealthBar (25.28%), RoundTimer (40%), StanceIndicator (29.16%)
- **VitalPoint system: 15.89%** - DamageCalculator (0%), HitDetection (0%), KoreanAnatomy (19.76%)
- **Audio system: 30.23%** - AudioManager (24.62%), AudioUtils (34.66%)

## ✅ Acceptance Criteria

- [ ] Overall test coverage increased to 70%+ (statements)
- [ ] Combat components coverage increased to 60%+ (from 23.96%)
- [ ] UI components coverage increased to 60%+ (from 30.72%)
- [ ] VitalPoint system coverage increased to 50%+ (from 15.89%)
- [ ] Audio system coverage increased to 60%+ (from 30.23%)
- [ ] All new tests pass in CI
- [ ] Coverage reports updated in \`docs/coverage/\`

## 🛠️ Implementation Guidance

### Files to Add/Modify

**Priority 1: Combat Components (24% → 60%)**
- \`src/components/combat/components/__tests__/CombatControls.test.tsx\`
- \`src/components/combat/components/__tests__/CombatHUD.test.tsx\`
- \`src/components/combat/components/__tests__/CombatStatsPanel.test.tsx\`

**Priority 2: UI Components (31% → 60%)**
- \`src/components/ui/__tests__/HealthBar.test.tsx\`
- \`src/components/ui/__tests__/RoundTimer.test.tsx\`
- \`src/components/ui/__tests__/StanceIndicator.test.tsx\`

**Priority 3: VitalPoint System (16% → 50%)**
- \`src/systems/vitalpoint/__tests__/DamageCalculator.test.ts\`
- \`src/systems/vitalpoint/__tests__/HitDetection.test.ts\`
- \`src/systems/vitalpoint/__tests__/KoreanAnatomy.test.ts\`

See RELEASE_ISSUES.md for full details.

## 📊 Metadata

**Priority:** Critical  
**Effort:** Large (2-3 days)  
**Impact:** High - Ensures code quality and reduces regression risk
EOF
)" && echo "✅ Issue 1 created" || echo "❌ Issue 1 failed"

# Issue 2: Security Vulnerabilities
echo "Creating Issue 2: Security Vulnerabilities..."
gh issue create \
    --repo "$REPO" \
    --title "🔒 Fix 6 npm security vulnerabilities (1 moderate, 5 high)" \
    --label "security,dependencies" \
    --body "$(cat <<'EOF'
## 🎯 Objective

Fix **6 security vulnerabilities** (1 moderate, 5 high) in npm dependencies to ensure application security for production deployment.

## 📋 Background

Current dependency security audit shows:
- **1 moderate severity** vulnerability
- **5 high severity** vulnerabilities
- **Total: 1,397 dependencies** (32 prod, 1,365 dev)

These must be resolved before the next minor release per OSSF Scorecard requirements.

## ✅ Acceptance Criteria

- [ ] All 6 npm audit vulnerabilities resolved
- [ ] \`npm audit\` returns 0 vulnerabilities
- [ ] All tests pass after dependency updates
- [ ] Application builds successfully
- [ ] E2E tests pass
- [ ] No breaking changes introduced

## 🛠️ Implementation Guidance

**Step 1:** Run \`npm audit\` to identify vulnerabilities
**Step 2:** Update dependencies with \`npm audit fix\`
**Step 3:** Validate all tests pass

See RELEASE_ISSUES.md for detailed approach.

## 📊 Metadata

**Priority:** Critical  
**Effort:** Small (2-4 hours)  
**Impact:** Critical - Security compliance
EOF
)" && echo "✅ Issue 2 created" || echo "❌ Issue 2 failed"

# Issue 3: Animation System
echo "Creating Issue 3: Animation System..."
gh issue create \
    --repo "$REPO" \
    --title "🎨 Implement player animation system with spritesheet integration" \
    --label "graphics,animation" \
    --body "$(cat <<'EOF'
## 🎯 Objective

Implement complete player animation system with spritesheet integration to bring combat visuals to life.

## 📋 Background

Current state:
- **Visual Implementation: 5/10** - Placeholder animations only
- **Spritesheet Production: 100%** - All 5 archetype manifests ready
- **Gap:** Spritesheets not connected to PlayerVisuals component

Assets ready:
- 5 archetype manifests: amsalja, musa, jojik, jeongbo, hacker
- Animation guides complete
- CSV manifests available

## ✅ Acceptance Criteria

- [ ] PlayerVisuals integrated with PlayerSpritesheet runtime lookup
- [ ] All 8 trigram stance animations implemented
- [ ] Attack/defense animations wired to combat events
- [ ] Animation state machine for smooth transitions
- [ ] All 5 archetypes working
- [ ] Maintains 60fps with animations active

## 🛠️ Implementation Guidance

**Phase 1:** Animation state machine (Day 1)
**Phase 2:** Spritesheet integration (Day 2)
**Phase 3:** Combat event integration (Day 3)
**Phase 4:** Testing & polish (Day 4)

See RELEASE_ISSUES.md for detailed implementation.

## 📊 Metadata

**Priority:** High  
**Effort:** Large (3-4 days)  
**Impact:** High - Dramatically improves visual polish
EOF
)" && echo "✅ Issue 3 created" || echo "❌ Issue 3 failed"

# Issue 4: Bundle Optimization
echo "Creating Issue 4: Bundle Optimization..."
gh issue create \
    --repo "$REPO" \
    --title "⚡ Optimize bundle size from 1.23MB to <800KB and ensure 60fps" \
    --label "performance,optimization" \
    --body "$(cat <<'EOF'
## 🎯 Objective

Optimize bundle size from **1.23 MB** to under **800 KB** (35% reduction) and ensure consistent **60fps** performance.

## 📋 Background

Current build metrics:
- **Bundle size: 1,232.78 KB** ⚠️ Too large
- **No code splitting** - Entire app loads at once
- **No formal 60fps validation**

## ✅ Acceptance Criteria

- [ ] Main bundle reduced to <800 KB (gzipped: <250 KB)
- [ ] Code splitting by route (intro/combat/training)
- [ ] PixiJS tree-shaking optimized
- [ ] Images optimized (WebP format)
- [ ] Audio streaming implemented
- [ ] Lighthouse Performance score >90
- [ ] 60fps maintained on mid-tier mobile

## 🛠️ Implementation Guidance

**Phase 1:** Bundle analysis (Day 1)
**Phase 2:** Code splitting (Day 1-2)
**Phase 3:** PixiJS optimization (Day 2)
**Phase 4:** Asset optimization (Day 2-3)
**Phase 5:** Performance monitoring (Day 3)

Expected results:
- Main: <300 KB
- Vendor: <400 KB
- Combat: <150 KB (lazy)
- Training: <100 KB (lazy)

See RELEASE_ISSUES.md for detailed approach.

## 📊 Metadata

**Priority:** High  
**Effort:** Medium (2-3 days)  
**Impact:** High - Mobile UX improvement
EOF
)" && echo "✅ Issue 4 created" || echo "❌ Issue 4 failed"

# Issue 5: OWASP ZAP Findings
echo "Creating Issue 5: OWASP ZAP Security Findings..."
gh issue create \
    --repo "$REPO" \
    --title "🛡️ Fix 12 OWASP ZAP security findings (CSP, HSTS, headers)" \
    --label "security,infrastructure" \
    --body "$(cat <<'EOF'
## 🎯 Objective

Fix **12 high-priority security findings** from OWASP ZAP scan to harden production deployment at blacktrigram.com.

## 📋 Background

ZAP Full Scan identified 12 categories of findings:

**High Priority (Must Fix):**
1. Content Security Policy (CSP) Header Not Set
2. Missing Anti-clickjacking Header (X-Frame-Options)
3. Strict-Transport-Security Header Not Set (7 instances)
4. X-Content-Type-Options Header Missing (5 instances)
5. Permissions Policy Header Not Set (5 instances)

**Medium Priority:**
6. CORS Misconfiguration (9 instances)
7. Cross-Domain Misconfiguration (7 instances)
8. Sub Resource Integrity Missing (3 instances)

Full report: Issue #16

## ✅ Acceptance Criteria

- [ ] CSP header implemented with strict directives
- [ ] X-Frame-Options: DENY header added
- [ ] HSTS header added (max-age=31536000)
- [ ] X-Content-Type-Options: nosniff header set
- [ ] Permissions-Policy header configured
- [ ] CORS restricted to blacktrigram.com
- [ ] SRI hashes added to script/link tags
- [ ] Zero high-priority ZAP findings

## 🛠️ Implementation Guidance

**Phase 1:** Security headers configuration (Day 1)
**Phase 2:** Content Security Policy (Day 1)
**Phase 3:** Subresource Integrity (Day 2)
**Phase 4:** CORS policy (Day 2)
**Phase 5:** Validation (Day 3)

See RELEASE_ISSUES.md for complete security headers.

## 📊 Metadata

**Priority:** High  
**Effort:** Medium (2-3 days)  
**Impact:** High - Production security compliance
EOF
)" && echo "✅ Issue 5 created" || echo "❌ Issue 5 failed"

echo ""
echo "======================================"
echo "✅ All 5 issues created successfully!"
echo "View at: https://github.com/$REPO/issues"
echo "======================================"
