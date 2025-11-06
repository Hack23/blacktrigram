# 🎮 Game Development Issue Templates

This directory contains 5 high-priority, well-defined issue templates for game development improvements in Black Trigram (흑괘).

## 📋 Available Templates

### 1. 🎬 Animation System Integration
**File**: `issue_1_animation_system.md`  
**Labels**: `game-development`, `animation`, `high-priority`, `PixiJS`  
**Effort**: 3-4 days

Integrate spritesheet manifests with PlayerVisuals for dynamic stance transitions, attack animations, and combat sequences.

### 2. ⚔️ Technique Catalog UI
**File**: `issue_2_technique_catalog.md`  
**Labels**: `game-development`, `ui`, `high-priority`, `combat`  
**Effort**: 2-3 days

Replace mock technique list with real CombatSystem data, implementing stamina gating and bilingual display.

### 3. ✨ Combat Feedback Enhancement
**File**: `issue_3_combat_feedback.md`  
**Labels**: `game-development`, `effects`, `high-priority`, `audio`  
**Effort**: 3 days

Synchronize HitEffectsLayer with audio triggers, add camera shake and particle effects.

### 4. 🤖 AI Behavior System
**File**: `issue_4_ai_system.md`  
**Labels**: `game-development`, `ai`, `high-priority`, `gameplay`  
**Effort**: 4-5 days

Replace aggression stub with stance-aware AI featuring decision trees and archetype-specific patterns.

### 5. 📊 Telemetry & Stats Integration
**File**: `issue_5_telemetry_stats.md`  
**Labels**: `game-development`, `ui`, `high-priority`, `telemetry`  
**Effort**: 2-3 days

Implement combat stat tracking and display system for detailed match summaries.

## 🚀 Creating Issues

### Automatic Method (Recommended)

Use the provided script to create all 5 issues at once:

```bash
# From repository root
./scripts/create_game_dev_issues.sh
```

**Prerequisites**: 
- GitHub CLI (`gh`) installed
- Authenticated with GitHub: `gh auth login`

### Manual Method

For each template file:

1. Open the GitHub repository in your browser
2. Navigate to **Issues** → **New Issue**
3. Click **"Get started"** next to the corresponding template
4. Review and submit

### Using GitHub Web Interface

These templates are automatically available in the GitHub issue creation interface:
1. Go to https://github.com/Hack23/blacktrigram/issues/new/choose
2. Select the desired template
3. Fill in any additional details
4. Create issue

## 📚 Additional Documentation

- **GAME_DEV_ISSUES.md** - Comprehensive issue catalog with implementation guidance
- **game-status.md** - Current game state and analysis (updated 2025-11-06)
- **.github/copilot-instructions.md** - Development patterns and best practices

## 🎯 Issue Priority & Dependencies

### Recommended Implementation Order

**Phase 1 - Foundation** (Week 1):
1. ✅ Issue #1: Animation System (blocks visual work)
2. ✅ Issue #2: Technique Catalog (gameplay improvement)

**Phase 2 - Polish** (Week 2):
3. ✅ Issue #3: Combat Feedback (needs animation events)
4. ✅ Issue #5: Telemetry & Stats (independent)

**Phase 3 - Intelligence** (Week 3):
5. ✅ Issue #4: AI System (benefits from animations + techniques)

### Dependencies

```
Issue #1 (Animation) → Issue #3 (Feedback)
Issue #1 (Animation) → Issue #4 (AI)
Issue #2 (Techniques) → Issue #4 (AI)
```

## 🏗️ Technical Standards

All issues follow these standards:

### Code Quality
- ✅ TypeScript strict mode compliance
- ✅ Comprehensive unit tests
- ✅ Integration tests with combat flow
- ✅ Performance validation (60fps)

### Korean Theming
- ✅ Bilingual UI (한글 | English)
- ✅ KOREAN_COLORS palette usage
- ✅ Trigram symbolism (☰–☷)
- ✅ Cultural authenticity

### Architecture
- ✅ PixiJS 8.x + @pixi/react patterns
- ✅ @pixi/layout for responsive design
- ✅ Follows .github/copilot-instructions.md
- ✅ Modular system architecture

## ✅ Success Criteria

Each issue includes:
- 🎯 Clear objective
- 📋 Detailed context
- ✅ Specific acceptance criteria
- 🔧 Technical specifications
- 📚 Reference files
- 🎨 Visual/UX requirements
- ⚠️ Implementation notes
- 🏆 Success metrics

## 👥 For Game Developer Agent

When assigned an issue:

1. **Review**:
   - Read the full issue template
   - Review referenced source files
   - Understand acceptance criteria

2. **Implement**:
   - Follow patterns in .github/copilot-instructions.md
   - Maintain Korean theming throughout
   - Write comprehensive tests
   - Optimize for 60fps performance

3. **Validate**:
   - `npm run check` (TypeScript)
   - `npm test` (unit + integration)
   - `npm run lint` (code quality)
   - Manual testing for gameplay/visuals

4. **Report**:
   - Use `report_progress` after milestones
   - Update issue checklist
   - Document architecture decisions

## 📞 Support

- **Technical Questions**: See .github/copilot-instructions.md
- **Cultural Context**: Review game-design.md and ai-guides/
- **Performance**: Check ARCHITECTURE.md optimization sections

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

**Total Estimated Effort**: 14-18 days (2.8-3.6 weeks)
