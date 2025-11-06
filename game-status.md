# 🎮 Black Trigram (흑괘) – Game Status Report

**Assessment Scope**: Frontend combat experience, systems integration, cultural fidelity, and asset readiness across UI, audio, and gameplay layers.

---

## 🎯 Executive Summary

Black Trigram has shifted from architectural readiness into a cohesive combat prototype. The arena (`CombatScreen.tsx`) now instantiates the shared `CombatSystem`, processes live attacks, and pipes bilingual combat feedback through HUD, hit FX, and logs. Layered UI elements—`HitEffectsLayer`, `PlayerVisuals`, `CombatHUD`, and the responsive `EndScreen`—are aligned behind the Pixi layout pipeline, while constants for color, typography, and animation duration are centralized. Remaining work sits squarely in polish: animation timing, richer AI, and performance tuning still lag the underlying systems.

### Overall Rating: **8.1/10** (Systems connected, polish phase underway)

**Strengths**: Fully wired combat UI stack, robust systems layer, comprehensive constants/tests, exceptional cultural authenticity, mature audio scaffolding.  
**Critical Needs**: Production-grade animation & transitions, deeper AI and technique variety, finalized visual FX pipeline, UX performance pass.

---

## 🚀 What’s New Since Last Review

- `src/components/combat/CombatScreen.tsx` instantiates `CombatSystem`, streams live hit resolution, manages arena layout, pause overlay, round banners, and AI stubs.
- Combat UI suite: `CombatControls.tsx`, `CombatHUD.tsx`, `CombatStatsPanel.tsx`, `PlayerStatusPanel.tsx`, `CombatFooter.tsx`, `PauseOverlay.tsx`, and `RoundStatusDisplay.tsx` provide full HUD coverage with responsive Korean theming.
- `src/components/ui/PlayerVisuals.tsx`, `HitEffectsLayer.tsx`, `RoundTimer.tsx`, `HealthBar.tsx`, `TrigramWheel.tsx`, `StanceIndicator.tsx`, and `KoreanHeader.tsx` deliver reusable combat visuals, bilingual typography, and status rendering.
- `src/components/ui/EndScreen.tsx` plus updated responsive base components complete the post-match flow.
- Systems refinements: `systems/game.ts` for match/session contracts, refreshed `systems/index.ts` exports, extended `TrigramSystem.ts`, `VitalPointSystem.ts`, and `CombatSystem.ts` logic now consumed by the UI.
- Constants & utilities refresh: `types/constants/animations.ts`, expanded `colors.ts`, upgraded `effectUtils.ts`, `colorUtils.ts`, and `playerUtils.ts`.
- Documentation now reflects the combat-focused stack; references to retired UI scaffolding have been removed.

---

## 🎨 Visual & UX Assessment – **7.6/10** (Responsive & complete, needs motion polish)

### ✅ Strengths

- `ResponsivePixiComponents` drive adaptive layouts across HUD, timers, and post-fight panels.
- `HitEffectsLayer` visualizes hits, crits, blocks, and misses with bilingual overlays and configurable fades.
- `PlayerVisuals` centralizes archetype materials, stance glyphs, and vital-point overlays for combat, training, and selection contexts.
- `CombatHUD` and `HealthBar` provide bilingual readouts, gradient bars, and stance-aware cues; `RoundTimer` highlights urgency with color/scale transitions.

### ⚠️ Gaps

- Attack, stance transition, and knockback animations remain placeholder; no tweened motion in `PlayerVisuals` yet.
- Environmental FX (`DojangBackground`) lacks parallax or lighting shifts, muting the cyberpunk tone.
- `CombatControls` still enumerates techniques from a mock class—real data exists in `CombatSystem` but is not surfaced.
- Mobile touch affordances exist, yet button sizing and drag thresholds still need usability testing.

### Key Screen Reviews

- **IntroScreen – 8.4/10**: Maintains bilingual archetype carousel, audio feedback, and responsive layout; next step is animated cityscape/background shaders.
- **CombatScreen – 6.5/10**: Major upgrade—player movement, AI stubs, round flow, and hit resolution are functional. Remaining work: connect full animation states, add camera motion, and harden stamina blocking/KO transitions.
- **TrainingScreen – 7.6/10**: Tracks accuracy, stances, and vital-point hits; needs richer visual cues when techniques land and difficulty scaling.
- **EndScreen – 7.8/10**: New bilingual summary with responsive layout and neon framing; connect aggregate combat stats once telemetry is finalized.

---

## 🏗️ Systems & Architecture – **9.3/10** (Battle-tested foundation)

- `CombatSystem.resolveAttack` and `.applyCombatResult` now drive the arena, producing deterministic damage, stamina, and status updates.
- `TrigramSystem` enforces stance transitions, costs, and matchup advantages; exposed via `systems/index.ts` for UI consumption.
- `VitalPointSystem` keeps its 70-point anatomical map with precise falloff and damage curves—ready for integration with `HitEffectsLayer` callouts.
- `systems/game.ts` defines `MatchConfig`, `GameEvent`, and save data contracts for upcoming persistence work.
- Type exports (`types/common.ts`, `types/constants/index.ts`) remain exhaustive, preserving TypeScript confidence across UI and systems.

---

## 🎵 Audio Integration – **8.7/10** (Mature, poised for polish)

- `AudioProvider`/`useAudio` wrap the component tree; combat events already trigger menu/interaction SFX.
- `VariantSelector` maps archetype, stance, and context to contextual tracks, ready to drive `CombatScreen` events.
- Asset registry includes combat, intro, and archetype themes; remaining gaps lie in alternate SFX layers for parries and heavy techniques.
- Recommendation: trigger stance transition swells and KO stingers once animation timing stabilizes.

---

## 🥋 Korean Cultural Authenticity – **9.8/10**

- Stance names, combat logs, and HUD copy remain bilingual (`건 | Heaven`, etc.).
- Trigram symbolism colors draw straight from `KOREAN_COLORS.TRIGRAM_*`.
- Vital points, archetype lore, and technique descriptors stay authentic and educational.

---

## ⚔️ Gameplay Implementation – **6.1/10** (Playable prototype, presentation lagging)

### Combat Loop

- Primary attack flow uses real combat math and spawns matching hit FX; defending toggles blocking with visual cues.
- Technique execution queue exists, but only a basic strike is exposed; integrate `CombatSystem.getAvailableTechniques` and stamina gating UI.
- KO/round transitions fire round banners but not full victory cutscenes yet.

### AI & Input

- Player one uses `usePlayerMovement` bounds-aware WASD; player two ships with an aggression-level stub needing behavior trees.
- Keyboard mapping to stance hotkeys lives in `inputSystem.ts`; on-screen controls emit events but still share mock data.

### Training Mode

- Tracks precision metrics, vital-point hits, and stance switches; add progressive target logic and audio coaching for mastery feedback.

### Game Flow

- `App.tsx` now transitions among intro, combat, training, and `EndScreen`; match statistics plumbing exists but awaits data binding.

---

## 📱 Platform & Performance – **8.2/10**

- Layout relies on `@pixi/layout` with mobile/tablet/desktop heuristics; HUD resizes cleanly down to ~640 px width.
- Need to profile `HitEffectsLayer` interval timer and large `PlayerVisuals` graphics to ensure 60 fps on mid-tier mobile.
- Add a formal performance script (e.g., simulated combat loop) before beta.

---

## 🧪 Training & Practice Modes – **7.8/10**

- `components/training/TrainingScreen.tsx` orchestrates dummy targets, stance swaps, and metric tracking via `TrainingControlsPanel`, `TrainingStatsPanel`, and `TrainingFeedback`.
- Vital-point rehearsal is live through `VitalPointTrainingPanel` and `TrainingDummy`, drawing directly from `systems/vitalpoint/KoreanVitalPoints.ts`.
- Scenario presets (`TrainingModeSelector`) make it easy to pivot between precision drills and endurance sets; introduce scripted difficulty curves and randomized dummy behavior next.
- Audio callouts and haptic-style cues are not yet wired—leverage `AudioManager` hooks once technique coaching VO is authored.
- Recommendation: Log per-session telemetry (accuracy, time-on-target) to feed future progression systems.

---

## 🧠 Systems Deep Dive

### Trigram Combat Engine

- `systems/trigram/TrigramCalculator.ts` and `TransitionCalculator.ts` model stance synergy, transition costs, and matchup weighting; unit tests (`*.test.ts`) validate cultural accuracy and balance.
- `TrigramSystem.ts` exposes `canTransitionTo`, `recommendStance`, and `getTransitionCost`, all consumed by combat/training UI.
- Cultural fidelity modules (`KoreanCulture.ts`, `KoreanTechniques.ts`) keep philosophy aligned with 오방색 color theory and trigram lore.

### Vital Point Damage Stack

- `systems/vitalpoint` package covers anatomy metadata, hit detection, distance falloff, and damage curves; `DamageCalculator.ts` blends strike intensity with positional accuracy.
- Integration hooks exist in `VitalPointSystem.ts` and `CombatSystem.ts`; expose granular feedback in `HitEffectsLayer` (e.g., highlight the exact point struck).

### Combat Core

- `CombatSystem.ts` now merges technique data, stance bonuses, status effects from `systems/effects.ts`, and stamina gating.
- Training variant (`systems/combat/TrainingCombatSystem.ts`) softens penalties and logs practice metrics—ideal for automated tutorials.
- Status effect utilities (`utils/effectUtils.ts`) compute intensity, duration modifiers, and cumulative stat shifts for future buff/debuff UI overlays.

---

## 🎨 Asset Pipeline & Content Readiness

### Spritesheet Production Pipeline

- Core JSON manifests (`assets/spritesheets/amsalja_assassin.json`, `musa_warrior.json`, `jojik_crime.json`, `jeongbo_operative.json`, `hacker_cyber.json`) define frame coordinates, animation tags, and hitbox metadata for each archetype; `PlayerSpritesheet.ts` offers the runtime lookup layer wiring those manifests into `spriteUtils`.
- Authoring aides include markdown playbooks (`ai-guides/00_general_spritesheet_guidelines.md` plus archetype-specific guides `01_musa_warrior_guide.md`–`05_crime_fighter_guide.md`) that document pose requirements, costume notes, and cultural rationale.
- CSV manifests (`ai-guides/csv/*.csv`) enumerate desired animation clips per archetype, keeping parity between design intent and delivered imagery.
- Status: assets are organised and ready for ingestion; outstanding work is stitching these animations into `PlayerVisuals` and validating timing curves for attacks, blocks, and KO recoveries.

### Visual Assets

- Archetype portraits (`assets/visual/archetypes/{musa,amsalja,jojik_pokryeokbae,jeongbo_yowon,hacker}.png`) supply high-res character art for selection menus, HUD badges, and lore screens.
- Dojang environment textures (`assets/visual/bg/dojang/dojang_floor_tex.png`, `dojang_wall_tex.png`) drive the combat backdrop; intro skyline layers (`assets/visual/bg/intro/intro_bg_loop.png`, `background.png`, `right-panel.png`) provide parallax-ready panels.
- Knowledge visuals (`assets/visual/bg/archetyples/*.png`) and logos (`assets/visual/logo/black-trigram.png`, `black-trigram-256.png`) round out marketing and UI chrome.
- Status: coverage is complete for archetypes and primary environments; next steps include exporting additional resolution variants for device-specific optimization and introducing animated overlays (rain, neon flicker) to lift atmosphere.

### Audio Library

- Music catalogue pairs MP3/WebM versions for intro, combat, underground ambient, and each archetype theme (`assets/audio/music/**`).
- SFX families cover ki energy surges, blocks, movement, hits, combat techniques, match events, menu navigation, and special “perfect strike” cues. Each folder maintains MP3+WebM parity to safeguard browser compatibility, and helper scripts (e.g., `generate-missing-audio.sh`, `fix-1-version.sh`) keep naming conventions aligned.
- Status: breadth is excellent; recommended follow-up is levelling loudness across sets (movement vs. combat), tagging priority clips for streaming, and wiring the remaining categories (e.g., ki charge variants) into the in-game event matrix.

### Tooling & Scripts

- Generation scripts under `scripts/` (audio/video/image) streamline asset updates; ensure README callouts for usage before onboarding new contributors.

---

## 🌐 Holistic Art & Audio Experience – What Works Today

- **Visual Cohesion**: Archetype portraits, dojang textures, and intro skyline assets render cleanly within Pixi containers, delivering a cohesive Korean cyberpunk tone. Spritesheet manifests are production-ready, enabling the upcoming animation system to swap stance-specific poses without re-exporting art.
- **Audio Coverage**: Background music shifts seamlessly between intro, combat, and archetype themes; SFX libraries already power menu interactions, hit confirmation, and match start cues via `AudioManager` + `VariantSelector`.
- **Combat Feedback Loop**: `HitEffectsLayer`, HUD elements, and audio triggers combine to make basic attacks feel responsive—the pipeline from `CombatSystem.resolveAttack` to visuals/sounds is proven.
- **Outstanding Polish**: Real-time animation playback (spritesheet-driven), dynamic environmental FX, and fine-grained audio balancing are the key unlocks to elevate the immersion from prototype to ship-ready.

---

## ✅ Testing & Tooling Coverage

- Unit suites exist for core systems: `TrigramSystem.test.ts`, `TrigramCalculator.test.ts`, `TransitionCalculator.test.ts`, `KoreanCulture.test.ts`, and `CombatSystem.test.ts`.
- Audio infrastructure validated via `AudioManager.test.ts`, `AudioUtils.test.ts`, and `GameAudio.test.tsx` for React hooks.
- UI smoke tests (`ResponsivePixiComponents.test.tsx`, `KoreanHeader.test.tsx`, `DojangBackground.test.tsx`) confirm rendering and prop handling.
- Test helpers in `src/test/` mock Pixi, audio, and input systems; leverage them when expanding coverage to `CombatScreen` and `TrainingScreen`.
- Recommendation: Add integration tests for end-to-end combat flow and snapshot baselines for `HitEffectsLayer` once animation states stabilize.

---

## 🧩 UI Component Library – **8.0/10**

### Base Layer (`components/ui/base`)

- `BaseButton.tsx` and `ResponsivePixiComponents.tsx` encapsulate Pixi layout patterns, hit slop, and hover states; tests (`ResponsivePixiComponents.test.tsx`) validate rendering across breakpoints.
- Korean typography suite (`base/korean-text/`) centralizes Hangul/English pairing with sizing constants—a strong foundation for bilingual UI.
- Opportunity: expose a style token map so combat/intro screens reference theme values without duplicating inline styles.

### Combat & HUD Elements (`components/ui`)

- `HealthBar.tsx`, `StanceIndicator.tsx`, `RoundTimer.tsx`, and `TrigramWheel.tsx` combine responsive layout with trigram color coding.
- `Player.tsx` and `PlayerVisuals.tsx` render archetype silhouettes, status effects, and stance glyphs; animation hooks are stubbed but not yet bound to spritesheets.
- `HitEffectsLayer.tsx` now owns visual FX, though shader-driven highlights and performance batching remain on the backlog.
- Recommendation: create a shared animation controller to coordinate these components with `CombatScreen` events.

### Meta & Post-Match UI

- `EndScreen.tsx` and `KoreanHeader.tsx` supply finish-state visuals and bilingual headings, backed by Vitest snapshots.
- Expand `EndScreen` stats once telemetry is plumbed from combat logs.

---

## 🖥️ Screen Suite & Meta Navigation – **7.4/10**

- `components/screens` contains focused sections (Philosophy, Controls) reused in intro and future story beats; each leverages bilingual text blocks and responsive panels.
- `IntroScreen.tsx` orchestrates archetype carousel, menu flows, and audio cues via `MenuSection` and `ArchetypeDisplay`—solid UX requiring only background motion polish.
- `ControlsScreen.tsx` and `PhilosophyScreen.tsx` function as static guides; convert to dynamic data sources to ease localisation and content updates.
- Routing remains manual in `App.tsx`; consider abstracting screen transitions into a finite state machine for clarity and analytics hooks.

## 🗺️ Screen-by-Screen Status & Action Plans

### IntroScreen (`IntroScreen.tsx`)

- **What works**: Responsive layout adapts to desktop/mobile, archetype carousel syncs with `ArchetypeDisplay`, bilingual copy and audio cues reinforce tone, and menu selection drives navigation events cleanly.
- **Gaps**: Background parallax and animated skyline layers are static, version/motd blocks read from hardcoded constants, and touch gestures for carousel/menus need validation.
- **Action plan**: Wire cityscape textures into a multi-layer parallax scroller, fetch release notes + patch highlights from configuration, and implement swipe/drag gesture handling paired with `useAudio` feedback for mobile.

### CombatScreen (`CombatScreen.tsx`)

- **What works**: Fully instantiates `CombatSystem`, streams hit results into HUD/FX/audio, manages round banners via `RoundStatusDisplay`, and coordinates `HitEffectsLayer`, `PlayerVisuals`, and `CombatHUD` under a responsive layout.
- **Gaps**: Player animations still rely on placeholder states, AI routine is a basic aggression stub, technique list in `CombatControls` is mocked, and camera/environment lack dynamic reactions.
- **Action plan**: Bind spritesheet animations through `PlayerVisuals` + `PlayerSpritesheet`, expose real techniques from `CombatSystem` into `CombatControls`, implement stance-aware AI behaviors, and add camera shake/parallax/environment FX tied to combat events.

### TrainingScreen (`TrainingScreen.tsx`)

- **What works**: Mode selector, vital-point targeting, scoring, and bilingual feedback run off live `VitalPointTrainingPanel`, `TrainingDummy`, and `TrainingStatsPanel` components with responsive positioning.
- **Gaps**: Dummy behaviour is stationary, combo/score multipliers lack persistence, and coaching audio/SFX hooks are not yet triggered.
- **Action plan**: Add scripted dummy movement + timing challenges, persist training telemetry for progression, and map milestone events to `AudioManager` cues alongside subtle hit FX.

### ControlsScreen (`ControlsScreen.tsx`)

- **What works**: Presents combat/stance/system controls in Korean-English format, keyboard navigation allows on-screen focus shifts, and layout maintains readability across breakpoints.
- **Gaps**: Content duplicates definitions from `COMBAT_CONTROLS`, there’s no live preview of inputs, and controller/touch mappings aren’t surfaced.
- **Action plan**: Source control strings directly from shared constants, embed interactive button demos (e.g., highlight `TrigramWheel` on stance key), and document controller/touch layouts with future gamepad detection hooks.

### PhilosophyScreen (`PhilosophyScreen.tsx`)

- **What works**: Delivers martial values, trigram lore, and archetype philosophies with bilingual styling and responsive columns, matching cultural brief.
- **Gaps**: Static content requires code edits for updates, lacks ambient narration/audio, and absence of timeline or interactive storytelling reduces engagement.
- **Action plan**: Externalise philosophy content into data files, layer ambient soundscape + optional voiceover via `AudioProvider`, and add interactive timeline/cards to connect values with gameplay scenarios.

### EndScreen (`EndScreen.tsx`)

- **What works**: Responsive gradient backdrop, bilingual victory messaging, match summary slots, and menu actions already integrate with `ResponsivePixiContainer`.
- **Gaps**: Real match statistics aren’t piped in yet, celebration animation is minimal, and rematch/menu flows don’t surface player progression rewards.
- **Action plan**: Connect `CombatStatsPanel` telemetry into display slots, introduce victory animations (stance-specific) and particle FX, and surface rewards/XP hooks alongside buttons for rematch, training, or archetype review.

---

## 🛖 In-Game Environment Components – **7.0/10**

- `components/game/DojangBackground.tsx` renders layered parallax panels with customizable neon accents; paired tests confirm gradient and texture application.
- Environmental SFX (`GameAudio.test.tsx`) validate audio triggers but visual effects (e.g., volumetric lighting, crowd silhouettes) are pending.
- Future work: tie background mood to match state (round start, KO) and integrate subtle camera sway.

---

## 🛠️ Utility & Hook Infrastructure – **8.5/10**

- `utils/colorUtils.ts` and `effectUtils.ts` provide color blending, status effect math, and hit effect builders consumed by combat and HUD layers.
- Movement/input handled by `inputSystem.ts` (hook + class) supporting WASD and stance hotkeys; extend to controller/touch gestures soon.
- `spriteUtils.ts` and `PlayerSpritesheet.ts` map archetype animation states to spritesheet frames, ready for the animation system once timing is defined.
- `pixiExtensions.ts` standardizes Pixi component registration and text styling.
- Hooks (`hooks/useTexture.ts`, index exports) abstract asset loading; add suspense/error boundaries for resilience.

---

## 📚 Types, Config & Entry Points – **9.0/10**

- `types/constants/*.ts` consolidate typography, colors, UI constants, and animation timing—minimizes magic numbers across components.
- `types/common.ts`, `systems/types.ts`, and `test-types.ts` offer deep TypeScript coverage, aiding autocomplete and reducing runtime bugs.
- `vite-env.d.ts` extends Pixi JSX intrinsics and environment variables, keeping bundler typings aligned.
- Entry files (`App.tsx`, `main.tsx`, `index.ts`) bootstrap Pixi/React integration, manage lazy-loaded screens, and register providers (Audio, Pixi extensions).
- Suggest documenting environment variable usage (`VITE_API_URL`, analytics flags) and adding an automated type-check in CI if absent.

---

## 📋 Latest Analysis (2025-11-06)

### Code Health Assessment ✅

**TypeScript Compilation**: ✅ Clean build with no errors  
**Test Suite**: ✅ 229 tests passing across 19 test files  
**Test Coverage**: Combat systems, Trigram logic, UI components, Audio integration  

### Architecture Validation

The codebase demonstrates excellent architectural patterns:
- **PixiJS 8.x Integration**: Proper use of @pixi/react with @pixi/layout system
- **Component Organization**: Well-structured directories (combat/, training/, ui/, systems/)
- **Korean Theming**: Consistent KOREAN_COLORS and bilingual text throughout
- **State Management**: Clean separation with hooks and context providers
- **Asset Pipeline**: Comprehensive spritesheet manifests and audio registry

### Critical Path Analysis

Based on comprehensive review of game-status.md, ARCHITECTURE.md, and codebase analysis:

**Top 5 High-Impact Issues** (ready for game developer agent):
1. 🎬 **Animation System Integration** - PlayerVisuals needs spritesheet wiring for stance transitions
2. ⚔️ **Technique Catalog UI** - CombatControls should surface real CombatSystem techniques  
3. ✨ **Combat Feedback Enhancement** - Synchronize HitEffectsLayer with audio and particle effects
4. 🤖 **AI Behavior System** - Replace aggression stub with stance-aware decision trees
5. 📊 **Telemetry & Stats Integration** - Pipe combat data to EndScreen for match summaries

**Performance Baseline**:
- Build time: ~8s (TypeScript compilation + Vite)
- Test execution: ~15s for full suite
- No blocking issues in critical paths

### Asset Readiness Review

**Spritesheet Manifests**: ✅ Complete JSON definitions for all 5 archetypes  
**Audio Assets**: ✅ MP3/WebM versions for music, SFX, combat sounds  
**Visual Assets**: ✅ Archetype portraits, dojang textures, intro backgrounds  
**Documentation**: ✅ AI guides for spritesheet creation with cultural notes

**Outstanding Work**:
- Animation timing integration with PlayerVisuals
- Environmental FX (parallax, lighting effects)
- Mobile touch optimization and testing
- Performance profiling on mid-tier devices

---

## 🔧 Priority Work (Next 2–3 Sprints)

1. **Animation & Motion System**: Wire `PlayerVisuals` to trigram animations, add tweened stance transitions, integrate knockback/KO sequences.
2. **Technique & AI Expansion**: Replace mock technique list in `CombatControls`, surface `CombatSystem` techniques, and implement archetype-specific AI routines.
3. **FX & Feedback Polish**: Layer particle shaders, camera shake, and damage popups; synchronize hit SFX with `HitEffectsLayer`.
4. **Telemetry & EndScreen Data**: Pipe combat stats (damage dealt, perfect strikes, stance usage) into `CombatStatsPanel` and `EndScreen`.
5. **Performance Pass**: Benchmark on mobile, optimize `HitEffectsLayer`, and ensure asset loading is streamed.

---

## 📊 Updated Development Priorities

| Feature                        | Technical Readiness | Visual Implementation | System Integration | Priority     |
| ------------------------------ | ------------------- | --------------------- | ------------------ | ------------ |
| **Combat Logic**               | 9/10                | 5/10                  | 6/10               | **CRITICAL** |
| **Player Visuals & Animation** | 7/10                | 4/10                  | 4/10               | **CRITICAL** |
| **AI System**                  | 6/10                | N/A                   | 3/10               | **HIGH**     |
| **Audio/FX Synchronization**   | 8/10                | 5/10                  | 5/10               | **HIGH**     |
| **Game Flow & Telemetry**      | 8/10                | 6/10                  | 5/10               | **MEDIUM**   |
| **Performance/Optimization**   | 6/10                | 5/10                  | 4/10               | **MEDIUM**   |

---

## 🛣️ Path to Alpha

1. **Connect Technique Catalog** – surface stance-specific techniques in `CombatControls`, hook into `CombatSystem`.
2. **Ship Animation Layer** – implement state machine in `PlayerVisuals` and coordinate with `RoundStatusDisplay`.
3. **Finalize FX & Audio Hooks** – ensure every hit, block, KO triggers synchronized visuals and sounds.
4. **Deliver End-to-End Match Loop** – fully populate `CombatStatsPanel`, enable rematch/menu flows, and log telemetry for balancing.
5. **Run Performance QA** – mobile/desktop FPS validation, memory profiling, asset streaming audit.

---

**흑괘의 길을 걸어라** – _Walk the Path of the Black Trigram_
