# Black Trigram v0.4.0 - Top 5 Priority Issues

**Generated:** 2025-11-11  
**Target Release:** v0.4.0  
**Analysis Method:** Comprehensive repository analysis using Task Agent

## 🎯 Quick Reference

This document provides quick access to the top 5 priority issues for the next Black Trigram release. Full analysis and issue templates are available in `/tmp/` directory.

### Priority Issues Summary

| # | Issue | Priority | Effort | Impact | Status |
|---|-------|----------|--------|--------|--------|
| 1 | [Performance & Mobile Optimization](#1-performance--mobile-optimization) | **CRITICAL** | M (4-8h) | High | 📋 Ready |
| 2 | [Animation System Integration](#2-animation-system-integration) | **CRITICAL** | M (6-8h) | High | 📋 Ready |
| 3 | [Test Coverage Improvement](#3-test-coverage-improvement) | **HIGH** | L (8-12h) | Medium | 📋 Ready |
| 4 | [Security Hardening](#4-security-hardening) | **HIGH** | M (4-6h) | High | 📋 Ready |
| 5 | [Asset Pipeline Automation](#5-asset-pipeline-automation) | **MEDIUM** | L (10-15h) | Medium | 📋 Ready |

**Total Estimated Effort:** 32-49 hours

---

## 1. Performance & Mobile Optimization

### Objective
Achieve consistent 60fps on mobile devices and improve initial load times by 40%.

### Key Deliverables
- ✅ Object pooling for HitEffectsLayer
- ✅ LOD system for PlayerVisuals  
- ✅ Asset streaming with progressive loading
- ✅ Performance benchmarking CI integration
- ✅ Mobile device testing (iOS/Android)

### Files to Modify
- `src/components/ui/HitEffectsLayer.tsx`
- `src/components/ui/PlayerVisuals.tsx`
- `src/main.tsx`
- `scripts/performance-benchmark.ts` (NEW)
- `vite.config.ts`

### Performance Targets
| Metric | Current | Target |
|--------|---------|--------|
| Desktop FPS | ~55fps | 60fps |
| Mobile FPS | ~40fps | 60fps |
| Load Time | TBD | <3s |
| Memory Peak | TBD | <150MB |

**Issue Template:** `/tmp/issue-1-performance-mobile.md`

---

## 2. Animation System Integration

### Objective
Wire PlayerVisuals component to production spritesheet system and implement animation state machine.

### Key Deliverables
- ✅ Animation state machine with 8 states (idle, attack light/medium/heavy, block, hit, dodge, KO)
- ✅ PlayerVisuals + PlayerSpritesheet integration
- ✅ Combat event synchronization
- ✅ All 5 archetype animations functional
- ✅ Stance-specific animation support (8 trigram stances)

### Files to Modify
- `src/components/ui/PlayerVisuals.tsx`
- `src/utils/spriteUtils.ts`
- `src/systems/types.ts`
- `src/components/combat/CombatScreen.tsx`
- `src/test/AnimationStateManager.test.ts` (NEW)

### Animation States
```
IDLE → ATTACK_LIGHT/MEDIUM/HEAVY → IDLE
IDLE → BLOCK → IDLE
IDLE → DODGE → IDLE
IDLE → HIT → IDLE/KO
```

**Issue Template:** `/tmp/issue-2-animation-system.md`

---

## 3. Test Coverage Improvement

### Objective
Increase test coverage from 53.73% to 80%+ across critical systems.

### Key Deliverables
- ✅ Vital point system tests (15.89% → 80%)
- ✅ UI component tests (30.72% → 70%)
- ✅ Pixi extensions tests (18.36% → 75%)
- ✅ Integration tests for combat flow
- ✅ Coverage enforcement in CI (75% threshold)

### Priority Testing Areas
1. **Vital Point System** (15.89% → 80%) - HIGHEST
   - DamageCalculator.ts (currently 0%)
   - HitDetection.ts (currently 0%)
   - KoreanAnatomy.ts (currently 19.76%)

2. **UI Components** (30.72% → 70%) - HIGH
   - HealthBar.tsx (currently 25.28%)
   - RoundTimer.tsx (currently 40%)
   - StanceIndicator.tsx (currently 29.16%)

3. **Integration Tests** - NEW
   - Complete combat flow testing
   - E2E match scenarios

**Issue Template:** `/tmp/issue-3-test-coverage.md`

---

## 4. Security Hardening

### Objective
Address all HIGH and MEDIUM severity findings from ZAP Full Scan Report (Issue #16).

### Key Deliverables
- ✅ Content Security Policy (CSP) header configured
- ✅ HTTP Strict Transport Security (HSTS) enabled
- ✅ X-Frame-Options anti-clickjacking protection
- ✅ X-Content-Type-Options nosniff
- ✅ Subresource Integrity (SRI) for external resources
- ✅ CORS policy explicitly defined

### Security Issues Addressed
| Category | Count | Severity |
|----------|-------|----------|
| CORS Misconfiguration | 9 | MEDIUM |
| CSP Missing/Incomplete | 5 | HIGH |
| HSTS Not Set | 7 | HIGH |
| Missing Security Headers | 6 | MEDIUM |

### Files to Modify
- `vite.config.ts`
- `index.html`
- `public/_headers` (NEW)
- `.github/workflows/zap-scan.yml`
- `scripts/generate-sri-hashes.ts` (NEW)

**Issue Template:** `/tmp/issue-4-security-hardening.md`

---

## 5. Asset Pipeline Automation

### Objective
Automate audio and visual asset generation and integrate production-ready assets.

### Key Deliverables
- ✅ 38 lethal combat SFX generated (bone breaking, flesh destruction, death energy)
- ✅ 6 underground rave music tracks composed
- ✅ 5 archetype spritesheet atlases with all animation frames
- ✅ Asset validation pipeline implemented
- ✅ Audio optimization: WebM (256kbps) + MP3 (192kbps)

### Asset Categories
**Audio Assets (44 total):**
- Menu/Interface: 3 SFX
- Match Events: 5 SFX
- Movement: 3 SFX
- Combat Strikes: 8 SFX
- Hit Effects: 6 SFX
- Special Effects: 7 SFX
- Music Tracks: 6 compositions

**Visual Assets (5 archetypes):**
- Musa Warrior spritesheet
- Amsalja Assassin spritesheet
- Hacker Cyber spritesheet
- Jeongbo Operative spritesheet
- Jojik Crime spritesheet

### Files to Create/Modify
- `scripts/generate-combat-sfx.ts` (NEW)
- `scripts/generate-underground-music.ts` (NEW)
- `scripts/validate-assets.ts` (NEW)
- `scripts/pack-spritesheets.ts` (NEW)

**Issue Template:** `/tmp/issue-5-asset-pipeline.md`

---

## 🚀 Creating the Issues

### Automated Creation

```bash
# Run the automated script
/tmp/create-priority-issues.sh
```

### Manual Creation

If automated creation is not available, copy content from:
- `/tmp/issue-1-performance-mobile.md`
- `/tmp/issue-2-animation-system.md`
- `/tmp/issue-3-test-coverage.md`
- `/tmp/issue-4-security-hardening.md`
- `/tmp/issue-5-asset-pipeline.md`

And create issues manually on GitHub with appropriate labels.

---

## 📊 Implementation Timeline

### Week 1: Critical Performance & Animation
- **Days 1-2:** Performance optimization (HitEffectsLayer, PlayerVisuals)
- **Days 3-5:** Animation system integration
- **Continuous:** Begin test coverage improvements

### Week 2: Quality & Security
- **Days 1-2:** Security hardening (headers, CSP, SRI)
- **Days 3-5:** Test coverage expansion (vital points, UI)

### Week 3: Assets & Integration
- **Days 1-3:** Asset generation (audio SFX, music)
- **Days 4-5:** Spritesheet generation and packing

### Week 4: Final Integration & Testing
- **Days 1-2:** Asset integration validation
- **Days 3-4:** E2E testing and performance validation
- **Day 5:** Release preparation

---

## 🔗 Related Resources

### Documentation
- [Full Analysis](/tmp/TOP_5_PRIORITY_ISSUES_README.md)
- [game-status.md](game-status.md) - Current development status
- [SWOT.md](SWOT.md) - Strategic analysis
- [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md) - Security overview

### Issue References
- [Issue #16: ZAP Full Scan Report](https://github.com/Hack23/blacktrigram/issues/16)
- [Issue #22: Generate Audio Assets](https://github.com/Hack23/blacktrigram/issues/22)
- [Issue #23: Generate Art Assets](https://github.com/Hack23/blacktrigram/issues/23)

---

## 📈 Success Metrics

### Must-Have for v0.4.0
- [ ] 60fps on mobile (iOS/Android)
- [ ] 80%+ test coverage
- [ ] Zero HIGH security findings in ZAP scan
- [ ] All 5 archetype animations functional
- [ ] Complete audio integration

### Nice-to-Have
- [ ] < 3s initial load time
- [ ] < 150MB memory usage
- [ ] 90%+ test coverage
- [ ] All asset pipeline automation complete

---

**흑괘의 길을 걸어라** - *Walk the Path of the Black Trigram*
