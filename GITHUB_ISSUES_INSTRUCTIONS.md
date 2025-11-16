# 📝 Instructions: Creating GitHub Issues from Analysis

## Overview

This directory contains comprehensive specifications for **5 priority GitHub issues** that should be created for the Black Trigram project. Each issue has been thoroughly analyzed and documented with:

- Detailed problem descriptions
- Acceptance criteria
- Technical implementation guidance
- ISMS policy alignment
- Agent assignment recommendations
- Success metrics

## Quick Start: Create Issues

### Option 1: Manual Creation (Recommended for Review)

1. **Review the Executive Summary**
   - Read [`TOP_5_PRIORITY_ISSUES.md`](./TOP_5_PRIORITY_ISSUES.md) for context

2. **Create Each Issue on GitHub**
   - Navigate to: https://github.com/Hack23/blacktrigram/issues/new
   - Use specifications from the detailed markdown files (see below)

### Option 2: GitHub CLI (Automated)

```bash
# Install GitHub CLI if needed
# https://cli.github.com/

# Issue #1: Bundle Size Optimization
gh issue create \
  --title "⚡ [Performance] Optimize bundle size - exceeds budget by 193KB (107% over)" \
  --label "performance,priority-critical,bundle-size,pixi,react,lighthouse" \
  --body-file /tmp/issue-1-bundle-size.md

# Issue #2: Production-Ready Animation System
gh issue create \
  --title "🎨 [Feature] Implement production-ready animation system for all 8 trigram stances" \
  --label "feature,priority-critical,pixi,ui-ux,korean-theming,martial-arts,combat-system" \
  --body-file /tmp/issue-2-animation-system.md

# Issue #3: React 19 Compatibility & Code Quality
gh issue create \
  --title "🔧 [Code Quality] Fix React 19 hooks violations and resolve 41 ESLint errors" \
  --label "code-quality,priority-high,react,typescript,eslint,technical-debt" \
  --body-file /tmp/issue-3-code-quality.md

# Issue #4: Test Coverage Improvement
gh issue create \
  --title "🧪 [Test] Increase unit and E2E test coverage from 51.61% to >90%" \
  --label "test,priority-high,coverage,technical-debt,ci-cd,quality" \
  --body-file /tmp/issue-4-test-coverage.md

# Issue #5: SBOM Generation & Security
gh issue create \
  --title "🔐 [Security] Generate and publish SBOM for supply chain transparency and OSSF Scorecard improvement" \
  --label "security,priority-high,isms-compliance,ossf-scorecard,sbom,vulnerability,supply-chain" \
  --body-file /tmp/issue-5-sbom-security.md
```

## Detailed Issue Specifications

### Issue #1: Bundle Size Optimization (P0 - CRITICAL)
- **File**: `/tmp/issue-1-bundle-size.md` (8,128 characters)
- **Priority**: 🔴 Critical
- **Agent**: @game-developer
- **Effort**: 2-3 sprints
- **Labels**: `performance`, `priority-critical`, `bundle-size`, `pixi`, `react`, `lighthouse`

**Key Points**:
- Current: 373 KB gzipped (107% over 180 KB budget)
- Target: <280 KB gzipped
- Approach: Code splitting, PixiJS tree-shaking, asset deferral

---

### Issue #2: Production-Ready Animation System (P0 - CRITICAL)
- **File**: `/tmp/issue-2-animation-system.md` (17,015 characters)
- **Priority**: 🔴 Critical
- **Agent**: @game-developer
- **Effort**: 3-4 sprints
- **Labels**: `feature`, `priority-critical`, `pixi`, `ui-ux`, `korean-theming`, `martial-arts`, `combat-system`

**Key Points**:
- Current: Placeholder animations (6.1/10 gameplay rating)
- Target: Fluid 60fps for all 8 trigram stances
- Approach: Animation state machine, spritesheet integration, combat coordination

---

### Issue #3: React 19 Compatibility & Code Quality (P1 - HIGH)
- **File**: `/tmp/issue-3-code-quality.md` (10,921 characters)
- **Priority**: 🟠 High
- **Agent**: @coding-agent
- **Effort**: 1-2 sprints
- **Labels**: `code-quality`, `priority-high`, `react`, `typescript`, `eslint`, `technical-debt`

**Key Points**:
- Current: 41 ESLint errors, 248 warnings, React hooks violations
- Target: 0 errors, <50 warnings
- Approach: Fix hooks purity/immutability, TypeScript strict mode, nullish coalescing

---

### Issue #4: Increase Test Coverage to >90% (P1 - HIGH)
- **File**: `/tmp/issue-4-test-coverage.md` (14,928 characters)
- **Priority**: 🟠 High
- **Agent**: @test-engineer
- **Effort**: 2-3 sprints
- **Labels**: `test`, `priority-high`, `coverage`, `technical-debt`, `ci-cd`, `quality`

**Key Points**:
- Current: 51.61% coverage (38.39% gap from target)
- Target: >90% statements, branches, functions, lines
- Approach: Expand unit tests (audio, combat UI), add E2E critical paths, enforce gates

---

### Issue #5: SBOM Generation & Supply Chain Security (P1 - HIGH)
- **File**: `/tmp/issue-5-sbom-security.md` (13,559 characters)
- **Priority**: 🟠 High
- **Agent**: @security-specialist
- **Effort**: 1 sprint
- **Labels**: `security`, `priority-high`, `isms-compliance`, `ossf-scorecard`, `sbom`, `vulnerability`, `supply-chain`

**Key Points**:
- Current: No SBOM (0/10 OSSF Scorecard), 6 vulnerabilities
- Target: CycloneDX SBOM published, 10/10 score, 0 high/critical vulnerabilities
- Approach: Add @cyclonedx/cyclonedx-npm, integrate into release workflow

---

## Implementation Roadmap

### Sprint 1-2: Quick Wins & Foundation
- **Week 1-2**: Issue #5 (SBOM) - Quick win for OSSF Scorecard
- **Week 2-4**: Issue #3 (Code Quality) - Reduce technical debt

### Sprint 3-5: Critical Path
- **Week 5-8**: Issue #1 (Bundle Size) - Performance optimization
- **Week 5-10**: Issue #2 (Animations) - Parallel start with #1

### Sprint 6-8: Quality Assurance
- **Week 11-16**: Issue #4 (Test Coverage) - Continuous alongside other work

## ISMS Policy References

Each issue aligns with Hack23 AB's ISMS policies:

| Issue | Primary ISMS Policy |
|-------|---------------------|
| #1 | [Performance Monitoring](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Security_Metrics.md) |
| #2 | [Quality Assurance](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md#quality-assurance) |
| #3 | [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) |
| #4 | [Testing Standards](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md#testing-standards) |
| #5 | [SBOM Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) |

## Success Metrics

### Before (v0.3.30)
- Bundle: 373 KB gzipped (❌ 107% over budget)
- Gameplay: 6.1/10 (⚠️ Placeholder animations)
- ESLint: 41 errors (❌ Critical violations)
- Coverage: 51.61% (❌ 38.39% below target)
- OSSF SBOM: 0/10 (❌ No SBOM)

### After (Target)
- Bundle: <280 KB gzipped (✅ Within budget)
- Gameplay: >8.5/10 (✅ Production-ready)
- ESLint: 0 errors (✅ Zero tolerance)
- Coverage: >90% (✅ Target achieved)
- OSSF SBOM: 10/10 (✅ Published)

## Korean Cultural Authenticity

All issues preserve Black Trigram's Korean martial arts authenticity:
- ✅ Traditional audio quality
- ✅ Trigram stance accuracy
- ✅ Bilingual text (Korean | English)
- ✅ 70 vital points validation
- ✅ Open source transparency

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

---

## Questions or Issues?

- Review: [`TOP_5_PRIORITY_ISSUES.md`](./TOP_5_PRIORITY_ISSUES.md) for executive summary
- Contact: Repository maintainers or @pethers
- ISMS: https://github.com/Hack23/ISMS-PUBLIC

**Analysis Date**: November 16, 2025  
**Generated by**: Task Agent  
**Status**: Ready for GitHub issue creation
