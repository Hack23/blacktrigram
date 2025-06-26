# 🎮 Black Trigram (흑괘) – Technical Architecture

---

## 📚 Architecture Documentation Map

| Document                                                              | Focus            | Description                                                                                                |
| --------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------- |
| **[🌐 System Context](#-system-context)**                             | C4 Model         | High-level view showing actors (Player, CDNs) and the entirely front-end application                       |
| **[🏢 Container View](#-container-view)**                             | C4 Model         | Frontend-only architecture: UI Layer, Game Logic, Asset Loader, Renderer, and State Management             |
| **[🧩 Component View](#-component-view)**                             | C4 Model         | Detailed breakdown of all key modules: Combat System, Trigram System, Vital Point System, Audio, UI        |
| **[🔧 File Structure](#-file-structure-highlights)**                  | Organization     | Current project structure and key file locations                                                           |
| **[🔄 Combat Flow Sequence](#-combat-flow-sequence)**                 | Sequence Diagram | How input flows through logic to rendering and feedback in real time                                       |
| **[⚡ Security & Performance](#-security--performance-architecture)** | Performance      | Client-side performance profiling, optimization techniques, and graceful degradation strategies            |
| **[📊 SWOT Analysis](#-swot-analysis)**                               | Strategy         | Strengths, Weaknesses, Opportunities, Threats for a 100% frontend, no-persistence "Black Trigram" web game |
| **[🎯 Core Game Concepts](#-core-game-concepts)**                     | Game Design      | Player archetypes, trigram system, resources & mechanics                                                   |
| **[🏗️ Architecture Concepts](#-architecture-concepts)**               | Technical Design | Mindmap of system architecture layers and components                                                       |
| **[🔄 UX Flow](#-ux-flow)**                                           | User Experience  | User journey through screens and interactions                                                              |
| **[🔄 Combat Mechanics](#-combat-mechanics--data-relationships)**     | Game Mechanics   | Detailed combat system data flow and relationships                                                         |

---

## 🌐 System Context

```mermaid
C4Context
  title 🌐 System Context Diagram – Black Trigram (흑괘)

  Person(player, "🧑‍🤝‍🧑 Player", "Controls an archetype in realistic 2D combat via browser")
  System(browserGame, "🌐 Black Trigram Web App", "Runs entirely in-browser (React + PixiJS) on modern browsers")
  System_Ext(audioCDN, "🎵 Audio CDN", "Hosts Korean martial arts SFX & music assets")
  System_Ext(artCDN, "🖼️ Art CDN", "Hosts graphical sprites, backgrounds, and particle textures")

  Rel(player, browserGame, "Plays via keyboard/mouse/touch")
  Rel(browserGame, audioCDN, "Fetches Korean SFX & Music from")
  Rel(browserGame, artCDN, "Fetches graphical assets from")

  UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")
```

> **Legend**
>
> - 🧑‍🤝‍🧑 **Player**: End-user interacting with Black Trigram through desktop or mobile browser.
> - 🌐 **Black Trigram Web App**: Entirely front-end, built with React + PixiJS (TypeScript). All game logic, state, & rendering occur in-browser—no backend.
> - 🎵 **Audio CDN**: Serves SFX (bone cracks, impacts, ambient kyūdō sounds) and traditional Korean background music.
> - 🖼️ **Art CDN**: Serves character sprites, particle bitmaps (ki energy, blood splatter), UI icons, fonts (including Korean text), and other graphical assets.

---

## 🏢 Container View

```mermaid
C4Container
    title 🏢 Container Diagram – Black Trigram (Frontend-Only)

    Person(player, "🧑‍🤝‍🧑 Player", "Controls an archetype in realistic 2D combat")

    System_Boundary(browserGame, "🌐 Black Trigram Web App") {
        Container(UI, "🖥️ UI Layer", "React Components (TypeScript)", "Manages screens, HUD, menus, Korean text, and styling")
        Container(gameLogic, "⚙️ Game Logic Layer", "TypeScript Modules", "Handles combat, trigram, vital-point calculations, and state")
        Container(assetLoader, "📦 Asset Loader", "TypeScript (PixiJS Loader & Hooks)", "Dynamically loads images, audio, JSON from CDNs")
        Container(renderer, "🎨 Rendering Engine", "PixiJS (TypeScript)", "Renders sprites, animations, particles, UI overlays")
        Container(stateMgmt, "🗄️ State Management", "Zustand / React Context", "In-memory state: player, enemy, UI flags; no persistence")
    }

    Rel(player, UI, "Interacts with UI via mouse/keyboard/touch")
    Rel(UI, gameLogic, "Dispatches player actions & reads game state")
    Rel(gameLogic, assetLoader, "Requests asset URLs & metadata")
    Rel(gameLogic, stateMgmt, "Reads/Writes combat & training state")
    Rel(assetLoader, renderer, "Supplies textures & audio buffers")
    Rel(stateMgmt, UI, "Provides state (health, stance, UI flags)")
    Rel(UI, renderer, "Instructs rendering via PixiJS")

    UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")

    %% Styling
    style UI          fill:#A5D6A7,stroke:#333,stroke-width:2px,color:#000
    style gameLogic   fill:#00FFD0,stroke:#333,stroke-width:2px,color:#000
    style assetLoader fill:#87CEFA,stroke:#333,stroke-width:2px,color:#000
    style renderer    fill:#B0BEC5,stroke:#333,stroke-width:2px,color:#000
    style stateMgmt   fill:#FFDAB9,stroke:#333,stroke-width:2px,color:#000
```

> **Containers Overview**
>
> - **🖥️ UI Layer**:
>
>   - React + TypeScript functional components.
>   - Screens: `CombatScreen`, `TrainingScreen`, `IntroScreen`.
>   - Common UI: `CombatHUD`, `TrigramWheel`, `ProgressTracker`, etc.
>   - Base modules in base: `BaseButton`, `KoreanText`, `BackgroundGrid`, etc.
>   - CSS: App.css, `src/CombatScreen.css`, etc.

> - **⚙️ Game Logic Layer**:
>
>   - Under `src/systems/*`, `src/types/*`.
>   - **CombatSystem (src/systems/CombatSystem.ts)**: Orchestrates input → trigram → vital-point → damage → audio/visual.
>   - **TrigramSystem (src/systems/trigram/**)\*\*:
>
>     - `StanceManager.ts`: Tracks current stance, validates Ki/Stamina, handles transition cost.
>     - `TransitionCalculator.ts`: Computes validity of stance switches.
>     - `TrigramCalculator.ts`: Provides technique data & advantage multipliers.
>     - `KoreanCulture.ts`: Supplies I Ching lore, Korean labels/descriptions.
>
>   - **VitalPointSystem (src/systems/vitalpoint/**)\*\*:
>
>     - `KoreanAnatomy.ts` & `KoreanVitalPoints.ts`: Defines all 70 vital points (critical, secondary, standard) and multipliers.
>     - `HitDetection.ts`: Checks collisions between attack hitboxes & character bounding boxes.
>     - `DamageCalculator.ts`: Applies base damage × trigram advantage × vital-point multiplier.
>
>   - **AudioManager (src/audio/**)\*\*:
>
>     - `AudioAssetRegistry.ts`, `AudioManager.ts`, `AudioUtils.ts`, `DefaultSoundGenerator.ts`, `VariantSelector.ts`: Load & play SFX/music via Web Audio API.
>
>   - **Physics & AI** (planned under `src/systems/AISystem.ts`): Minimal NPC behaviors.

> - **📦 Asset Loader**:
>
>   - PixiJS `Loader` (`@pixi/loaders`) and custom hooks (`useTexture.ts`) for textures & JSON data.
>   - Helpers in playerUtils.ts, `colorUtils.ts` map asset keys to URLs.
>   - Dynamically import large JSON (e.g., `src/types/constants/trigram.ts`) at runtime.

> - **🎨 Rendering Engine**:
>
>   - PixiJS (wrapped by `@pixi/react`) via GameEngine.tsx.
>   - Manages a single PixiJS `Application` (Canvas/WebGL).
>   - Renders: Character sprites (`PlayerVisuals.tsx`, `EnemyVisuals.tsx`), background (`DojangBackground.tsx`), particles (`HitEffectsLayer.tsx`).
>   - Draws UI overlays (health, Ki, stance auras) via Pixi primitives (`Graphics`, `Text`).

> - **🗄️ State Management**:
>
>   - In-browser only (no backend). Uses **Zustand** (or React Context fallback) under hooks.
>   - `useGameState.ts`, `useUIState.ts`, `useEnemyState.ts` store: health, stamina, Ki, current stance, enemy state, UI flags.
>   - **No Persistence**: Refresh resets all state / progress.

---

## 🧩 Component View

```mermaid
C4Component
    title 🧩 Component Diagram – Black Trigram (Component-Level)

    Container_Boundary(UI, "🖥️ UI Layer") {
        Component(App, "App.tsx", "React", "Root component; sets up routes & context providers")
        Component(IntroScreen, "IntroScreen.tsx", "React", "Title, menu, philosophy, controls overview")
        Component(CombatScreen, "CombatScreen.tsx", "React", "Hosts PixiJS canvas, HUD, stance wheel, controls")
        Component(TrainingScreen, "TrainingScreen.tsx", "React", "Vital-point targeting practice, archetype drills")
        Component(GameUI, "GameUI.tsx", "React", "Common UI: health bar, stamina bar, tooltips")
        Component(CombatHUD, "CombatHUD.tsx", "React", "Displays health, Ki, stamina, stance indicator")
        Component(TrigramWheel, "TrigramWheel.tsx", "React", "Circular selector of 8 stances")
        Component(EndScreen, "EndScreen.tsx", "React", "Post-combat summary and results")
        Component(BaseButton, "BaseButton.tsx", "React", "Reusable styled button")
        Component(KoreanText, "KoreanText.tsx", "React", "Stylized Korean fonts & kerning")
        Component(BackgroundGrid, "BackgroundGrid.tsx", "React", "Grid overlay for training mode")
    }

    Container_Boundary(gameLogic, "⚙️ Game Logic Layer") {
        Component(CombatSystem, "CombatSystem.ts", "TypeScript", "Orchestrates combat step-by-step")
        Component(TrigramSystem, "TrigramSystem.ts", "TypeScript", "Facade over stance, transition, technique modules")
        Component(StanceManager, "StanceManager.ts", "TypeScript", "Maintains current stance state, Ki/Stamina deduction")
        Component(TransitionCalculator, "TransitionCalculator.ts", "TypeScript", "Calculates cost of switching stances")
        Component(TrigramCalculator, "TrigramCalculator.ts", "TypeScript", "Selects technique data, advantage multipliers")
        Component(KoreanCulture, "KoreanCulture.ts", "TypeScript", "Provides I Ching lore, Korean labels & descriptions")
        Component(VitalPointSystem, "VitalPointSystem.ts", "TypeScript", "Facade over hit detection & damage calculation")
        Component(AnatomicalRegions, "AnatomicalRegions.ts", "TypeScript", "Defines critical/secondary/standard regions")
        Component(HitDetection, "HitDetection.ts", "TypeScript", "Checks bounding-box intersection between attacks & targets")
        Component(DamageCalculatorVP, "DamageCalculator.ts", "TypeScript", "Applies vital-point multipliers to base damage")
        Component(AudioManager, "AudioManager.ts", "TypeScript", "Interfaces with Howler.js to play SFX/music")
        Component(DefaultSoundGenerator, "DefaultSoundGenerator.ts", "TypeScript", "Generates procedural fallback sounds")
        Component(VariantSelector, "VariantSelector.ts", "TypeScript", "Randomizes audio variants for variety")
    }

    Container_Boundary(assetLoader, "📦 Asset Loader") {
        Component(PixiLoader, "Pixi Assets API", "TypeScript", "Loads textures (sprites, particles) from Art CDN")
        Component(AudioLoader, "AudioLoader.ts", "TypeScript", "Fetches audio buffers from Audio CDN, decodes via Howler.js")
        Component(TrigramDataLoader, "TrigramData.ts / JSON", "TypeScript", "Loads JSON for stances & techniques at runtime")
        Component(VitalPointsDataLoader, "VitalPointsData.ts / JSON", "TypeScript", "Loads JSON for 70 vital points & anatomical data")
    }

    Container_Boundary(stateMgmt, "🗄️ State Management") {
        Component(useGameState, "useGameState.ts (Zustand)", "TypeScript", "Global game state: health, stamina, Ki, scores")
        Component(useUIState, "useUIState.ts (Zustand)", "TypeScript", "UI toggles: menu, training mode, debug overlays")
        Component(useEnemyState, "useEnemyState.ts (Zustand)", "TypeScript", "Current enemy health, stance, AI flags")
    }

    Container_Boundary(renderer, "🎨 Rendering Engine") {
        Component(PixiStage, "StagePixi.tsx", "React + @pixi/react", "Creates & manages PIXI.Application instance")
        Component(PlayerVisuals, "PlayerVisuals.tsx", "React + PixiJS", "Draws player sprite, stance aura, animations")
        Component(EnemyVisuals, "EnemyVisuals.tsx", "React + PixiJS", "Draws enemy sprite, hit reactions, health bar")
        Component(ParticlesLayer, "HitEffectsLayer.tsx", "React + PixiJS", "Renders ki energy particles, hit sparks, blood effects")
        Component(BackgroundRenderer, "DojangBackground.tsx", "React + PixiJS", "Draws dojo floor, background grid, environment")
    }

    Rel(App, IntroScreen, "🚦 Routes to")
    Rel(App, CombatScreen, "🚦 Routes to")
    Rel(App, TrainingScreen, "🚦 Routes to")

    Rel(CombatScreen, CombatSystem, "⚔️ Dispatches player inputs to")
    Rel(CombatSystem, StanceManager, "🥋 Updates stance")
    Rel(CombatSystem, TransitionCalculator, "🔁 Validates stance transitions")
    Rel(CombatSystem, TrigramCalculator, "💡 Fetches technique data")
    Rel(CombatSystem, VitalPointSystem, "🎯 Checks hits & calculates damage")
    Rel(CombatSystem, AudioManager, "🔊 Plays SFX/music")
    Rel(CombatSystem, stateMgmt, "🗄️ Reads/Writes game state")
    Rel(CombatScreen, PixiStage, "📡 Sends rendering commands to")
    Rel(PixiStage, PlayerVisuals, "👤 Draws player textures from PixiLoader")
    Rel(PixiStage, EnemyVisuals, "👺 Draws enemy textures from PixiLoader")
    Rel(PixiStage, ParticlesLayer, "💥 Renders hit & ki energy effects")
    Rel(PixiStage, BackgroundRenderer, "🌳 Draws dojo environment")
    Rel(CombatSystem, AudioLoader, "🎵 Requests audio assets from")
    Rel(StanceManager, TrigramDataLoader, "📥 Loads stance/technique JSON from")
    Rel(VitalPointSystem, VitalPointsDataLoader, "📥 Loads vital points JSON from")
    Rel(PixiLoader, renderer, "🖼️ Supplies textures to")
    Rel(AudioLoader, AudioManager, "🔊 Supplies decoded buffers to")
    Rel(stateMgmt, UI, "📦 Provides reactive state to")

    %% Styling
    style UI                      fill:#A5D6A7,stroke:#333,stroke-width:2px,color:#000
    style gameLogic               fill:#00FFD0,stroke:#333,stroke-width:2px,color:#000
    style assetLoader             fill:#87CEFA,stroke:#333,stroke-width:2px,color:#000
    style stateMgmt               fill:#FFDAB9,stroke:#333,stroke-width:2px,color:#000
    style renderer                fill:#B0BEC5,stroke:#333,stroke-width:2px,color:#000
    style CombatSystem            fill:#00ffd0,stroke:#333,stroke-width:2px,color:#000
    style TrigramSystem           fill:#ffd700,stroke:#333,stroke-width:2px,color:#000
    style VitalPointSystem        fill:#ff6b6b,stroke:#333,stroke-width:2px,color:#000
    style AudioManager            fill:#87CEFA,stroke:#333,stroke-width:2px,color:#000
    style PixiLoader              fill:#d3d3d3,stroke:#333,stroke-width:2px,color:#000
    style useGameState            fill:#a5d6a7,stroke:#333,stroke-width:2px,color:#000
    style PixiStage               fill:#b0bec5,stroke:#333,stroke-width:2px,color:#000
```

---

## 🔧 File Structure Highlights

- **src/components/ui/base**

  - `BaseButton.tsx`, `BackgroundGrid.tsx`, `KoreanText.tsx`, `KoreanHeader.tsx`, `PixiComponents.tsx`: Reusable UI primitives and Korean font utilities.

- **src/components/combat**

  - `CombatScreen.tsx`, `CombatArena.tsx`, `CombatControls.tsx`, `CombatHUD.tsx`: All UI & logic for real-time combat.

- **src/components/training**

  - `TrainingScreen.tsx`, `TrainingControlsPanel.tsx`, `VitalPointTrainingPanel.tsx`: Components for practicing vital-point targeting.

- **src/hooks**

  - `useTexture.ts`: Custom hook wrapping PixiJS loader for image caching.
  - `useGameState.ts`, `useUIState.ts`, `useEnemyState.ts`: Zustand stores for global state.

- **src/systems/trigram**

  - `KoreanCulture.ts`, `StanceManager.ts`, `TransitionCalculator.ts`, `TrigramCalculator.ts`: Trigram mechanics and data access.

- **src/systems/vitalpoint**

  - `AnatomicalRegions.ts`, `HitDetection.ts`, `DamageCalculator.ts`, `KoreanVitalPoints.ts`: Vital-point definitions, detection, and damage logic.

- **src/audio**

  - `AudioAssetRegistry.ts`, `AudioManager.ts`, `AudioUtils.ts`, `DefaultSoundGenerator.ts`, `VariantSelector.ts`: All sound loading and playback.

- **src/utils**

  - `playerUtils.ts`, `colorUtils.ts`: Helper functions for mapping archetype data and color schemes.

---

## 🔄 Combat Flow Sequence

```mermaid
sequenceDiagram
    title 🔄 Combat Flow – Fully Frontend (Black Trigram)

    participant Player                                           as "🧑‍🤝‍🧑 Player"
    participant InputSystem        as "🎮 InputSystem"
    participant CombatEngine       as "⚔️ Combat Engine"
    participant TrigramSystem      as "🔶 Trigram System"
    participant VitalPointSystem   as "🎯 VitalPoint System"
    participant AudioManager       as "🎵 Audio Manager"
    participant StateStore         as "🗄️ Zustand Store"
    participant PixiStage          as "🎨 PixiJS Renderer"

    classDef playerClass            fill:#A0D6B4,stroke:#333,stroke-width:2px,color:#000
    classDef inputClass             fill:#87CEFA,stroke:#333,stroke-width:2px,color:#000
    classDef combatClass            fill:#00FFD0,stroke:#333,stroke-width:2px,color:#000
    classDef trigramClass           fill:#FFD700,stroke:#333,stroke-width:2px,color:#000
    classDef vitalClass             fill:#FF6B6B,stroke:#333,stroke-width:2px,color:#000
    classDef audioClass             fill:#9C27B0,stroke:#333,stroke-width:2px,color:#FFF
    classDef stateClass             fill:#F8BBD0,stroke:#333,stroke-width:2px,color:#000
    classDef rendererClass          fill:#B0BEC5,stroke:#333,stroke-width:2px,color:#000

    class Player           playerClass
    class InputSystem      inputClass
    class CombatEngine     combatClass
    class TrigramSystem    trigramClass
    class VitalPointSystem vitalClass
    class AudioManager     audioClass
    class StateStore       stateClass
    class PixiStage        rendererClass

    Note over Player,PixiStage: 🥋 Korean Martial Arts Real-Time Combat

    Player->>InputSystem: 🥋 Press stance key (e.g., '1' for 건/Geon)
    InputSystem->>CombatEngine: 🔃 Stance change request
    CombatEngine->>TrigramSystem: 🔁 Calculate transition (Current → Geon)
    TrigramSystem->>StateStore: ➖ Deduct Ki/Stamina
    TrigramSystem-->>CombatEngine: ✅ Transition result (Success/Fail)
    CombatEngine->>AudioManager: 🔊 Play stance change SFX
    CombatEngine->>PixiStage: ✨ Update player aura visuals (PlayerVisuals)

    Player->>InputSystem: ⚔️ Click to attack (Mouse click)
    InputSystem->>CombatEngine: 🎯 Attack command with screen coords
    CombatEngine->>TrigramSystem: 💡 Get current technique parameters
    CombatEngine->>VitalPointSystem: 🔍 Hit detection (range & bounding boxes)
    VitalPointSystem-->VitalPointSystem: 🎯 Compute precision vs 70 vital points
    VitalPointSystem-->>CombatEngine: ✅ Hit result (VitalPointData, Multiplier)
    CombatEngine->>CombatEngine: 🧮 Compute final damage (base × trigram_adv × vp_mult)
    CombatEngine->>StateStore: 🩸 Reduce enemy health
    CombatEngine->>AudioManager: 🔊 Play impact SFX (bone crack / muscle thud)
    CombatEngine->>PixiStage: 💥 Render hit sparks, blood, damage numbers (ParticlesLayer)
    CombatEngine->>StateStore: ⚡ Update visual state (enemy hit flag, UI flags)
    CombatEngine-->>PixiStage: 👺 Trigger enemy reaction animation (EnemyVisuals)
```

> **Note**
>
> - **InputSystem**: Lives in React (e.g., `CombatControls.tsx`), dispatching events to `CombatEngine`.
> - **CombatEngine**: Aggregates all combat logic in `CombatSystem.ts`.
> - **TrigramSystem**: Handles stance logic, technique lookup, state updates (Zustand).
> - **VitalPointSystem**: Performs in-memory geometry collision detection & returns multipliers.
> - **AudioManager**: Web Audio API plays sound buffers loaded at runtime from the Audio CDN.
> - **PixiStage**: Via `@pixi/react` (`StagePixi.tsx`), renders player, enemy, UI overlays, particles.
> - **Zustand Store**: All shared state (player health, Ki, stance) resides in memory; React components subscribe.

---

## ⚡ Security & Performance Architecture

```mermaid
graph TD
    subgraph "🔍 Performance Monitoring & Profiling"
      PM[📈 Performance Monitor] --> FPS[FPS Tracking (Stats.js)]
      PM --> Memory[💾 Memory Usage (Chrome DevTools)]
      PM --> GC[🗑️ GC Observations]
      PM --> AssetTiming[⏱️ Asset Load Times (Network Tab)]
    end

    subgraph "🚀 Optimization Techniques"
      OT[⚙️ Optimization Engine] --> SpriteBatch[📦 PixiJS Sprite Batching]
      OT --> AtlasTextures[🎨 Texture Atlases (Spritesheet)]
      OT --> ObjectPooling[🔄 Object Pooling (Particles & Effects)]
      OT --> AssetCaching[🔒 useTexture & React.lazy]
      OT --> CodeSplitting[📂 Dynamic `import()`]
      OT --> AudioCompression[🎵 OGG/MP3 Streaming]
      OT --> Debounce[⏳ Debounce/Throttle Inputs & Animations]
      OT --> Memoization[🧠 React.memo / useMemo / useCallback]
      OT --> WebGLExtensions[🖥️ Enable EXT_disjoint_timer_query]
    end

    subgraph "🛡️ Fallback Systems (Graceful Degradation)"
      FS[⚠️ Fallback Manager] --> LowQualityMode[📉 Low Quality Graphics on Low-end GPUs]
      FS --> ReducedEffects[❌ Disable Blood / High-poly Particles]
      FS --> ProceduralAudio[🎹 Procedural SFX fallback if CDN missing]
      FS --> Canvas2D[🖼️ Fallback to Canvas 2D if WebGL Unsupported]
    end

    PM -.-> OT
    OT -.-> FS

    %% Styling
    classDef perfMon fill:#4ecdc4,stroke:#333,stroke-width:2px,color:#000
    classDef optTech fill:#45b7d1,stroke:#333,stroke-width:2px,color:#000
    classDef fallback fill:#f9ca24,stroke:#333,stroke-width:2px,color:#000

    class PM, FPS, Memory, GC, AssetTiming perfMon
    class OT, SpriteBatch, AtlasTextures, ObjectPooling, AssetCaching, CodeSplitting, AudioCompression, Debounce, Memoization, WebGLExtensions optTech
    class FS, LowQualityMode, ReducedEffects, ProceduralAudio, Canvas2D fallback
```

### **Performance Monitoring**

- **📈 FPS Tracking**: Integrate [Stats.js](https://github.com/mrdoob/stats.js/) to measure and display real-time framerate.
- **💾 Memory Usage**: Use Chrome DevTools to inspect memory footprint; watch for leaks when large particle sets spawn.
- **🗑️ GC Observations**: Monitor GC pauses when many objects (particles, temporary data) are created/destroyed; mitigate via object pooling.
- **⏱️ Asset Timing**: Leverage Network panel or custom timing code to measure JSON, texture, and audio load times from CDNs.

### **Optimization Techniques**

1. **📦 PixiJS Sprite Batching**

   - Group sprites sharing textures into batch draw calls (e.g., `ParticleContainer` for hit effects).
   - Use Pixi's `ParticleContainer` or `SpriteBatch` for high particle counts (ki energy, blood).

2. **🎨 Texture Atlases**

   - Combine character frames, UI icons, and particle frames into single spritesheets (e.g., `characters.json`, `particles.json`).
   - Minimizes WebGL texture switches, increasing draw performance.

3. **🔄 Object Pooling**

   - Pre-allocate particle/effect objects (blood splatter, ki orbs) and recycle instead of allocating new instances.
   - Pool frequently used objects (damage-number labels, aura filters) to reduce GC pressure.

4. **🔒 Asset Caching**

   - Custom `useTexture` hook: ensures textures load once and reuse across components.
   - Leverage browser-level caching (Cache-Control headers on CDN) to avoid re-fetching.

5. **📂 Code Splitting**

   - Lazy-load heavy modules: `TrainingScreen`, concept art galleries, large JSON data (non-MVP features).
   - Use dynamic `import()` to download code only when needed.

6. **🎵 Audio Compression & Streaming**

   - Store audio on CDN as compressed OGG/MP3.
   - Stream large background tracks, pre-decode short SFX in memory for low-latency playback.

7. **⏳ Debounce / Throttle**

   - Prevent rapid-fire input (stance spamming) from overwhelming main loop.
   - Throttle UI updates (animation triggers, combo pop-ups) using `useThrottle`/`useDebounce`.

8. **🧠 Memoization**

   - Use `React.memo` for pure UI components (`TrigramWheel`, `CombatHUD`) so they only re-render on relevant prop changes.
   - Leverage `useMemo` / `useCallback` for expensive calculations inside React components.

9. **🖥️ WebGL Extensions**

   - Enable `EXT_disjoint_timer_query` in PixiJS to gather GPU timing metrics for deeper profiling.

### **Fallback Systems (Graceful Degradation)**

1. **📉 Low Quality Mode**

   - Detect GPU capabilities at startup. If low, reduce canvas resolution and disable sub-pixel effects.
   - Toggle via "Low Graphics" checkbox in settings (Zustand flag: `useUIState.isLowGraphicsMode`).

2. **❌ Reduced Effects**

   - On performance drop (FPS < 30), disable expensive particles: blood splatter, continuous ki swirl.
   - Use `useUIState.isLowPerfMode` to toggle off these render layers.

3. **🎹 Procedural Audio**

   - If Audio CDN fails (e.g., offline), fall back to simple beep-thump procedural sounds via `DefaultSoundGenerator.ts`.

4. **🖼️ Canvas2D Fallback**

   - If WebGL unavailable (older browsers), switch to Canvas 2D renderer for core gameplay (no advanced particles, simplified effects).

---

## 📊 SWOT Analysis

### Traditional SWOT Quadrant Chart

```mermaid
%%{init: {
  "theme": "neutral",
  "themeVariables": {
    "quadrant1Fill": "#2b83ba",
    "quadrant2Fill": "#1a9641",
    "quadrant3Fill": "#fdae61",
    "quadrant4Fill": "#d7191c",
    "quadrantTitleFill": "#ffffff",
    "quadrantPointFill": "#ffffff",
    "quadrantPointTextFill": "#000000",
    "quadrantXAxisTextFill": "#000000",
    "quadrantYAxisTextFill": "#000000"
  },
  "quadrantChart": {
    "chartWidth": 700,
    "chartHeight": 700,
    "pointLabelFontSize": 14,
    "titleFontSize": 24,
    "quadrantLabelFontSize": 18,
    "xAxisLabelFontSize": 16,
    "yAxisLabelFontSize": 16
  }
}}%%
quadrantChart
    title 📊 Black Trigram (흑괘) Frontend-Only SWOT Analysis
    x-axis Internal --> External
    y-axis Negative --> Positive
    quadrant-1 Opportunities
    quadrant-2 Strengths
    quadrant-3 Weaknesses
    quadrant-4 Threats

    "💡 PWA & Offline Caching":[0.8,0.9] radius:7 color:#a4c2f4 stroke-color:#3d64ba stroke-width:2px
    "📱 Mobile-First UX":[0.7,0.8] radius:7 color:#a4c2f4 stroke-color:#3d64ba stroke-width:2px
    "🎨 Community Modding":[0.85,0.75] radius:7 color:#a4c2f4 stroke-color:#3d64ba stroke-width:2px
    "🤖 AI-Driven Tutorials":[0.75,0.85] radius:7 color:#a4c2f4 stroke-color:#3d64ba stroke-width:2px
    "🌱 Ecosystem Partnerships":[0.65,0.7] radius:6 color:#a4c2f4 stroke-color:#3d64ba stroke-width:2px

    "🛠️ Zero-Install Web App":[0.2,0.8] radius:7 color:#a2d2a4 stroke-color:#2c882c stroke-width:2px
    "⏱ Fast Iteration":[0.25,0.75] radius:6 color:#a2d2a4 stroke-color:#2c882c stroke-width:2px
    "💸 Reduced Operational Costs":[0.15,0.85] radius:6 color:#a2d2a4 stroke-color:#2c882c stroke-width:2px
    "🚀 Immediate CDN Updates":[0.1,0.7] radius:7 color:#a2d2a4 stroke-color:#2c882c stroke-width:2px
    "🌍 Global Accessibility":[0.05,0.9] radius:6 color:#a2d2a4 stroke-color:#2c882c stroke-width:2px

    "🌀 No Persistence (Session-Only)":[0.2,0.25] radius:7 color:#f5a9a9 stroke-color:#aa3939 stroke-width:2px
    "🐢 Asset Load Latency":[0.3,0.2] radius:7 color:#f5a9a9 stroke-color:#aa3939 stroke-width:2px
    "📴 Limited Offline Play":[0.15,0.3] radius:6 color:#f5a9a9 stroke-color:#aa3939 stroke-width:2px
    "🌐 Browser Compatibility":[0.25,0.15] radius:7 color:#f5a9a9 stroke-color:#aa3939 stroke-width:2px
    "⚠️ Memory/GC Spikes":[0.35,0.1] radius:6 color:#f5a9a9 stroke-color:#aa3939 stroke-width:2px

    "🌩️ CDN Outages/Latency":[0.8,0.3] radius:7 color:#d5a6bd stroke-color:#9b568a stroke-width:2px
    "⚠️ WebGL Deprecation":[0.7,0.2] radius:7 color:#d5a6bd stroke-color:#9b568a stroke-width:2px
    "🏆 Competitive Mobile Games":[0.75,0.25] radius:7 color:#d5a6bd stroke-color:#9b568a stroke-width:2px
    "📉 Tech Debt (State Complexity)":[0.9,0.2] radius:6 color:#d5a6bd stroke-color:#9b568a stroke-width:2px
    "🔒 CDN Security Risks":[0.85,0.15] radius:6 color:#d5a6bd stroke-color:#9b568a stroke-width:2px
    "🌐 Browser Standards Changes":[0.65,0.25] radius:6 color:#d5a6bd stroke-color:#9b568a stroke-width:2px
```

### Mindmap of Strengths

```mindmap
  root((🟢 Strengths))
    id1(🛠️ Zero-Install Web App)
      id1.1[Play immediately—no download/sign-up]
      id1.2[Instant patching via static hosting]
      id1.3[High adoption barrier removed]
    id2(⏱ Fast Iteration)
      id2.1[Front-end only; no backend migrations]
      id2.2[Rapid prototyping & feature rollout]
      id2.3[Hot reloading in dev mode]
    id3(💸 Reduced Operational Costs)
      id3.1[No server infrastructure costs]
      id3.2[Leverage static CDNs (Cloudflare/AWS S3)]
      id3.3[Minimal DevOps overhead]
    id4(🚀 Immediate CDN Updates)
      id4.1[Push new animations & sounds instantly]
      id4.2[JSON/trigram data can update in real time]
      id4.3[Rapid asset iteration in production]
    id5(🌍 Global Accessibility)
      id5.1[Runs in any modern browser]
      id5.2[Cross-platform compatibility: desktop & mobile]
      id5.3[Low barrier to entry for users]
    id6(🔶 Authentic Korean Martial Arts Integration)
      id6.1[Deep I Ching (팔괘) philosophy]
      id6.2[70 traditional vital points]
      id6.3[Korean labels, audio, cultural immersion]
    id7(🎵 Rich Audio-Visual Experience)
      id7.1[Traditional Korean instruments & cyberpunk fusion]
      id7.2[Spectacular ki energy & blood particles]
      id7.3[Responsive, low-latency SFX]
    id8(⚙️ Modular Architecture)
      id8.1[Clear separation: Combat, Trigram, VitalPoint, Audio]
      id8.2[Reusable React + PixiJS components]
      id8.3[Zustand slices for isolated state]
    id9(🔑 Comprehensive Testing Framework)
      id9.1[Unit tests for combat & trigram logic]
      id9.2[Integration tests for full combat flow]
      id9.3[Performance tests (FPS, latency) with Stats.js]
```

### Mindmap of Weaknesses

```mindmap
  root((🟠 Weaknesses))
    id1(🌀 No Persistence (Session-Only))
      id1.1[All progress lost on refresh]
      id1.2[No saved unlocks or training logs]
      id1.3[Limited long-term engagement]
    id2(🐢 Asset Load Latency)
      id2.1[Large JSON/trigram data slows startup]
      id2.2[High-res textures cause delays]
      id2.3[Initial loading screen can be lengthy]
    id3(📴 Limited Offline Play)
      id3.1[Without service workers, no offline mode]
      id3.2[Users with spotty connectivity struggle]
      id3.3[No cached game state]
    id4(🌐 Browser Compatibility Challenges)
      id4.1[WebGL differences across browsers]
      id4.2[Web Audio API support varies]
      id4.3[Mobile browser quirks]
    id5(⚠️ Memory/GC Spikes)
      id5.1[Many particles cause GC pauses]
      id5.2[Object churn in combat heavy scenes]
      id5.3[Zustand state updates triggering re-renders]
    id6(⚙️ Complex State Management)
      id6.1[Multiple Zustand slices can desync]
      id6.2[No unified persistence layer]
      id6.3[Harder to trace bugs across stores]
    id7(❌ Incomplete Features)
      id7.1[Some techniques/stances lack polish]
      id7.2[Missing grappling (유술) & blocking (방어기) for certain stances]
      id7.3[Training mode limited in scope]
    id8(🔍 UX Learning Curve)
      id8.1[Complex trigram interactions require tutorials]
      id8.2[70 vital points may overwhelm new players]
      id8.3[Not immediately intuitive for casual users]
    id9(🛠️ Limited Analytics)
      id9.1[No built-in user metrics or telemetry]
      id9.2[Hard to measure player behavior/performance]
      id9.3[No A/B testing framework]
```

### Mindmap of Opportunities

```mindmap
  root((🔵 Opportunities))
    id1(💡 PWA & Offline Caching)
      id1.1[Implement service workers for asset caching]
      id1.2[Cache JSON & textures for offline play]
      id1.3[Persistence via IndexedDB/localStorage]
    id2(📱 Mobile-First UX)
      id2.1[Optimize controls for touch; swipe/drag]
      id2.2[Adaptive UI layouts for small screens]
      id2.3[Accelerometer-based stance changes]
    id3(🎨 Community Modding)
      id3.1[Allow custom skins via URL overlays]
      id3.2[Custom particle packs/community-created assets]
      id3.3[User-generated stances & techniques]
    id4(🤖 AI-Driven Tutorial Modules)
      id4.1[WebAssembly/TF.js for adaptive feedback]
      id4.2[Real-time guidance on vital-point targeting]
      id4.3[Progressive difficulty based on performance]
    id5(🌱 Ecosystem Partnerships)
      id5.1[Collaboration with martial arts schools]
      id5.2[Cultural institution sponsorships]
      id5.3[Cross-promotion with Korean cultural events]
    id6(🔧 Third-Party Integrations)
      id6.1[Discord & Twitch combat overlays]
      id6.2[Leaderboard integration via Firebase]
      id6.3[Social sharing (Twitter, Instagram) of combo replays]
    id7(⚙️ Advanced Analytics)
      id7.1[Track detailed player telemetry]
      id7.2[Heatmaps of vital-point targeting accuracy]
      id7.3[User segmentation & A/B tests for features]
    id8(📚 E-Learning Mode)
      id8.1[Structured courses on 팔괘 이론]
      id8.2[Guided practice sessions on vital points]
      id8.3[Certification badges for skill milestones]
    id9(🌐 Global Localization)
      id9.1[Support multiple languages (KR, EN, JP, CN)]
      id9.2[Localized UI/UX for regional audiences]
      id9.3[Region-specific AI tutor voice-overs]
```

### Mindmap of Threats

```mindmap
  root((🔴 Threats))
    id1(🌩️ CDN Outages / Latency)
      id1.1[Audio CDN or Art CDN downtime]
      id1.2[High global latency affects playability]
      id1.3[Single region CDN cold starts]
    id2(⚠️ WebGL / API Deprecation)
      id2.1[Future browser changes break PixiJS]
      id2.2[Web Audio API behavior shifts]
      id2.3[Mobile browser limitations]
    id3(🏆 Competitive Mobile Titles)
      id3.1[Native mobile games with deeper UX]
      id3.2[Lower-latency touch controls]
      id3.3[Larger marketing budgets]
    id4(📉 Technical Debt Accumulation)
      id4.1[Complex Zustand stores & no persistence]
      id4.2[Inconsistent data patterns]
      id4.3[Inefficient combat loops]
    id5(🔒 CDN Asset Security Risks)
      id5.1[MITM if CDN not HTTPS + SRI]
      id5.2[Compromised asset hosting]
      id5.3[Unverified third-party scripts]
    id6(📶 Browser Standards Evolution)
      id6.1[root((🔴 Threats))
    id1(🌩️ CDN Outages / Latency)
      id1.1[Audio CDN or Art CDN downtime]
      id1.2[High global latency affects playability]
      id1.3[Single region CDN cold starts]
    id2(⚠️ WebGL / API Deprecation)
      id2.1[Future browser changes break PixiJS]
      id2.2[Web Audio API behavior shifts]
      id2.3[Mobile browser limitations]
    id3(🏆 Competitive Mobile Titles)
      id3.1[Native mobile games with deeper UX]
      id3.2[Lower-latency touch controls]
      id3.3[Larger marketing budgets]
    id4(📉 Technical Debt Accumulation)
      id4.1[Complex Zustand stores & no persistence]
      id4.2[Inconsistent data patterns]
      id4.3[Inefficient combat loops]
    id5(🔒 CDN Asset Security Risks)
      id5.1[MITM if CDN not HTTPS + SRI]
      id5.2[Compromised asset hosting]
      id5.3[Unverified third-party scripts]
    id6(📶 Browser Standards Evolution)
      id6.1[Changes to ES modules affect bundling]
      id6.2[New security policies (CORS, CSP)]
      id6.3[Deprecated features in future standards]
    id7(🎮 Player Retention Challenges)
      id7.1[Without persistence, limited engagement]
      id7.2[Lack of progression incentives]
      id7.3[Session-only gameplay limits depth]
    id8(💰 Monetization Limitations)
      id8.1[No backend for payment processing]
      id8.2[Limited ability to track purchases]
      id8.3[Difficult to implement premium features]
    id9(🌍 Cultural Sensitivity Issues)
      id9.1[Misrepresentation of Korean culture]
      id9.2[Inappropriate use of traditional symbols]
      id9.3[Lack of cultural consultant validation]
```

---

## 🎯 Core Game Concepts

### Player Archetypes & Combat Philosophy

```mermaid
mindmap
  root((🥋 Black Trigram Core))
    id1[🎮 Player Archetypes]
      id1.1[무사 Musa - Traditional Warrior]
        id1.1.1[Honor-bound combat]
        id1.1.2[Balanced techniques]
        id1.1.3[Strong fundamentals]
      id1.2[암살자 Amsalja - Shadow Assassin]
        id1.2.1[Precision strikes]
        id1.2.2[Stealth mechanics]
        id1.2.3[Critical damage focus]
      id1.3[해커 Hacker - Cyber Warrior]
        id1.3.1[Tech-enhanced combat]
        id1.3.2[Digital disruption]
        id1.3.3[Augmented abilities]
      id1.4[정보요원 Jeongbo - Intelligence Op]
        id1.4.1[Analytical combat]
        id1.4.2[Predictive strikes]
        id1.4.3[Tactical advantage]
      id1.5[조직폭력배 Jojik - Crime Fighter]
        id1.5.1[Brutal efficiency]
        id1.5.2[Street techniques]
        id1.5.3[Overwhelming force]

    id2[☯️ Eight Trigrams (팔괘)]
      id2.1[☰ 건 Geon - Heaven]
        id2.1.1[Direct strikes]
        id2.1.2[Overwhelming power]
      id2.2[☱ 태 Tae - Lake]
        id2.2.1[Fluid movements]
        id2.2.2[Joint manipulation]
      id2.3[☲ 리 Li - Fire]
        id2.3.1[Nerve strikes]
        id2.3.2[Burning techniques]
      id2.4[☳ 진 Jin - Thunder]
        id2.4.1[Explosive attacks]
        id2.4.2[Sudden impacts]
      id2.5[☴ 손 Son - Wind]
        id2.5.1[Continuous pressure]
        id2.5.2[Rapid combos]
      id2.6[☵ 감 Gam - Water]
        id2.6.1[Adaptive defense]
        id2.6.2[Flow counters]
      id2.7[☶ 간 Gan - Mountain]
        id2.7.1[Immovable defense]
        id2.7.2[Counter strikes]
      id2.8[☷ 곤 Gon - Earth]
        id2.8.1[Grounding attacks]
        id2.8.2[Takedown focus]

    id3[🎯 Vital Points (급소)]
      id3.1[Critical Points (치명타)]
        id3.1.1[Instant KO potential]
        id3.1.2[x5.0 damage multiplier]
      id3.2[Secondary Points (보조)]
        id3.2.1[Major damage]
        id3.2.2[x3.0 damage multiplier]
      id3.3[Standard Points (일반)]
        id3.3.1[Basic damage]
        id3.3.2[x1.5 damage multiplier]

    id4[⚡ Resources]
      id4.1[❤️ Health (체력)]
        id4.1.1[100 HP per fighter]
        id4.1.2[No regeneration]
      id4.2[💪 Stamina (지구력)]
        id4.2.1[Physical actions]
        id4.2.2[Slow regeneration]
      id4.3[🔵 Ki Energy (기)]
        id4.3.1[Special techniques]
        id4.3.2[Stance transitions]
```

---

## 🏗️ Architecture Concepts

### System Architecture Layers

```mermaid
mindmap
  root((🏗️ Architecture))
    id1[🖥️ Presentation Layer]
      id1.1[React Components]
        id1.1.1[Screens]
        id1.1.2[HUD Elements]
        id1.1.3[Controls]
      id1.2[PixiJS Rendering]
        id1.2.1[Sprites]
        id1.2.2[Particles]
        id1.2.3[Animations]
      id1.3[UI/UX Design]
        id1.3.1[Korean Typography]
        id1.3.2[Cyberpunk Theme]
        id1.3.3[Responsive Layout]

    id2[⚙️ Business Logic]
      id2.1[Combat System]
        id2.1.1[Damage Calculation]
        id2.1.2[Hit Detection]
        id2.1.3[Combat Flow]
      id2.2[Trigram System]
        id2.2.1[Stance Management]
        id2.2.2[Transitions]
        id2.2.3[Techniques]
      id2.3[Vital Point System]
        id2.3.1[Anatomy Mapping]
        id2.3.2[Multipliers]
        id2.3.3[Effects]

    id3[🗄️ State Management]
      id3.1[Zustand Stores]
        id3.1.1[Game State]
        id3.1.2[UI State]
        id3.1.3[Enemy State]
      id3.2[React Context]
        id3.2.1[Audio Context]
        id3.2.2[Theme Context]
      id3.3[Session Storage]
        id3.3.1[Temporary Data]
        id3.3.2[Settings]

    id4[📦 Asset Management]
      id4.1[PixiJS Loader]
        id4.1.1[Texture Loading]
        id4.1.2[Sprite Sheets]
      id4.2[Audio System]
        id4.2.1[Howler.js]
        id4.2.2[Web Audio API]
      id4.3[Data Loading]
        id4.3.1[JSON Import]
        id4.3.2[Dynamic Loading]

    id5[🔧 Infrastructure]
      id5.1[Build System]
        id5.1.1[Vite]
        id5.1.2[TypeScript]
        id5.1.3[ESBuild]
      id5.2[Testing]
        id5.2.1[Vitest]
        id5.2.2[React Testing Library]
        id5.2.3[Cypress]
      id5.3[Deployment]
        id5.3.1[Static Hosting]
        id5.3.2[CDN Distribution]
        id5.3.3[CI/CD Pipeline]
```

---

## 🔄 UX Flow

### User Journey Through Game

```mermaid
flowchart TD
    Start([🎮 Game Load]) --> Loading[⏳ Loading Assets]
    Loading --> Intro[🏮 Intro Screen]

    Intro --> |New Game| CharSelect[👤 Archetype Selection]
    Intro --> |Training| Training[🎯 Training Mode]
    Intro --> |Settings| Settings[⚙️ Settings Menu]

    CharSelect --> Combat[⚔️ Combat Arena]
    Training --> VitalPractice[🎯 Vital Point Practice]
    Training --> StancePractice[☯️ Stance Training]

    Combat --> |Victory| Victory[🏆 Victory Screen]
    Combat --> |Defeat| Defeat[💀 Defeat Screen]
    Combat --> |Pause| PauseMenu[⏸️ Pause Menu]

    Victory --> Intro
    Defeat --> Intro
    PauseMenu --> |Resume| Combat
    PauseMenu --> |Quit| Intro

    VitalPractice --> |Exit| Training
    StancePractice --> |Exit| Training
    Training --> |Back| Intro
    Settings --> |Back| Intro

    %% Styling
    classDef screenNode fill:#FFD700,stroke:#333,stroke-width:2px,color:#000
    classDef actionNode fill:#00FFD0,stroke:#333,stroke-width:2px,color:#000
    classDef menuNode fill:#FF6B6B,stroke:#333,stroke-width:2px,color:#000

    class Intro,CharSelect,Combat,Victory,Defeat,Training,Settings screenNode
    class Loading,VitalPractice,StancePractice actionNode
    class PauseMenu menuNode
```

---

## 🔄 Combat Mechanics & Data Relationships

### Combat System Data Flow

```mermaid
graph TB
    subgraph "🎮 Input Layer"
        KI[Keyboard Input]
        MI[Mouse Input]
        TI[Touch Input]
    end

    subgraph "⚙️ Combat Engine"
        IS[Input System]
        SM[Stance Manager]
        TC[Technique Calculator]
        HD[Hit Detection]
        DC[Damage Calculator]
        ES[Effect System]
    end

    subgraph "📊 Game State"
        PS[Player State]
        ES2[Enemy State]
        CS[Combat State]
    end

    subgraph "🎨 Rendering"
        VS[Visual System]
        AS[Audio System]
        PS2[Particle System]
    end

    KI --> IS
    MI --> IS
    TI --> IS

    IS --> SM
    SM --> TC
    TC --> HD
    HD --> DC
    DC --> ES

    SM <--> PS
    DC <--> ES2
    ES <--> CS

    CS --> VS
    CS --> AS
    CS --> PS2

    %% Styling
    classDef inputClass fill:#87CEFA,stroke:#333,stroke-width:2px
    classDef engineClass fill:#00FFD0,stroke:#333,stroke-width:2px
    classDef stateClass fill:#FFD700,stroke:#333,stroke-width:2px
    classDef renderClass fill:#FF6B6B,stroke:#333,stroke-width:2px

    class KI,MI,TI inputClass
    class IS,SM,TC,HD,DC,ES engineClass
    class PS,ES2,CS stateClass
    class VS,AS,PS2 renderClass
```

### Trigram Advantage Matrix

```mermaid
graph LR
    subgraph "☯️ Trigram Relationships"
        G[☰ 건 Geon]
        T[☱ 태 Tae]
        L[☲ 리 Li]
        J[☳ 진 Jin]
        S[☴ 손 Son]
        GM[☵ 감 Gam]
        GN[☶ 간 Gan]
        K[☷ 곤 Gon]
    end

    %% Advantage relationships (→ means "has advantage over")
    G -->|Power > Fluid| T
    T -->|Fluid > Fire| L
    L -->|Fire > Thunder| J
    J -->|Thunder > Wind| S
    S -->|Wind > Water| GM
    GM -->|Water > Mountain| GN
    GN -->|Mountain > Earth| K
    K -->|Earth > Heaven| G

    %% Defensive advantages (⇢ means "defends well against")
    G -.->|Blocks Earth| K
    GN -.->|Blocks Water| GM
    GM -.->|Blocks Wind| S

    %% Style colors
    style G fill:#FFD700,stroke:#333,stroke-width:3px
    style T fill:#87CEEB,stroke:#333,stroke-width:3px
    style L fill:#FF6347,stroke:#333,stroke-width:3px
    style J fill:#FF1493,stroke:#333,stroke-width:3px
    style S fill:#98FB98,stroke:#333,stroke-width:3px
    style GM fill:#4682B4,stroke:#333,stroke-width:3px
    style GN fill:#8B4513,stroke:#333,stroke-width:3px
    style K fill:#D2691E,stroke:#333,stroke-width:3px
```

---

## 📈 Performance Optimization Strategy

### Resource Loading Pipeline

```mermaid
sequenceDiagram
    participant B as Browser
    participant L as Asset Loader
    participant CDN as CDN Servers
    participant C as Cache
    participant G as Game Engine

    B->>L: Initialize game
    L->>C: Check local cache

    alt Assets cached
        C-->>L: Return cached assets
    else Assets not cached
        L->>CDN: Request assets
        CDN-->>L: Stream assets
        L->>C: Store in cache
    end

    L->>G: Assets ready
    G->>B: Start game

    Note over B,G: Lazy load non-critical assets during gameplay
```

### Memory Management Strategy

```mermaid
graph TD
    subgraph "🧠 Memory Pools"
        PP[Particle Pool<br/>Pre-allocated: 1000]
        DP[Damage Number Pool<br/>Pre-allocated: 50]
        EP[Effect Pool<br/>Pre-allocated: 100]
    end

    subgraph "♻️ Object Lifecycle"
        CR[Create/Reset]
        US[Use in Scene]
        RE[Return to Pool]
    end

    subgraph "🗑️ Garbage Collection Mitigation"
        RA[Reuse Allocations]
        PO[Pool Objects]
        LG[Limit Generation]
    end

    PP --> CR
    DP --> CR
    EP --> CR

    CR --> US
    US --> RE
    RE --> PP
    RE --> DP
    RE --> EP

    RA --> PO
    PO --> LG

    style PP fill:#A5D6A7,stroke:#333,stroke-width:2px
    style DP fill:#81C784,stroke:#333,stroke-width:2px
    style EP fill:#66BB6A,stroke:#333,stroke-width:2px
```

---

## 🔒 Security Considerations

### Frontend Security Architecture

```mermaid
graph TB
    subgraph "🛡️ Security Layers"
        CSP[Content Security Policy]
        SRI[Subresource Integrity]
        CORS[CORS Headers]
        VAL[Input Validation]
    end

    subgraph "🔐 Asset Security"
        HTTPS[HTTPS Only CDN]
        SIGN[Signed Assets]
        HASH[Asset Hashing]
    end

    subgraph "🚫 Attack Mitigation"
        XSS[XSS Prevention]
        CSRF[CSRF Protection]
        INJ[Injection Prevention]
    end

    CSP --> XSS
    SRI --> SIGN
    CORS --> HTTPS
    VAL --> INJ

    HTTPS --> HASH
    SIGN --> HASH

    style CSP fill:#FF6B6B,stroke:#333,stroke-width:2px
    style HTTPS fill:#FFD700,stroke:#333,stroke-width:2px
    style XSS fill:#87CEEB,stroke:#333,stroke-width:2px
```

---

## 🚀 Deployment Architecture

### CI/CD Pipeline

```mermaid
graph LR
    subgraph "🔧 Development"
        DEV[Local Dev]
        TEST[Test Suite]
    end

    subgraph "🏗️ Build Pipeline"
        GH[GitHub Actions]
        BUILD[Vite Build]
        OPT[Optimization]
    end

    subgraph "📦 Distribution"
        CDN1[Asset CDN]
        CDN2[App CDN]
        CACHE[Edge Cache]
    end

    subgraph "🌍 Global Delivery"
        US[US Servers]
        EU[EU Servers]
        ASIA[Asia Servers]
    end

    DEV --> TEST
    TEST --> GH
    GH --> BUILD
    BUILD --> OPT

    OPT --> CDN1
    OPT --> CDN2

    CDN1 --> CACHE
    CDN2 --> CACHE

    CACHE --> US
    CACHE --> EU
    CACHE --> ASIA

    style GH fill:#24292E,stroke:#fff,stroke-width:2px,color:#fff
    style CDN1 fill:#FF9500,stroke:#333,stroke-width:2px
    style CACHE fill:#00C851,stroke:#333,stroke-width:2px
```

---

## 📊 Metrics & Monitoring

### Performance Monitoring Dashboard

```mermaid
graph TD
    subgraph "📈 Client Metrics"
        FPS[FPS Counter]
        MEM[Memory Usage]
        LAT[Input Latency]
        LOAD[Asset Load Time]
    end

    subgraph "📊 Game Metrics"
        DMG[Damage Dealt]
        ACC[Hit Accuracy]
        COMBO[Combo Success]
        TIME[Session Duration]
    end

    subgraph "🔍 Analytics"
        GA[Google Analytics]
        CUSTOM[Custom Events]
        ERROR[Error Tracking]
    end

    FPS --> GA
    MEM --> GA
    LAT --> CUSTOM
    LOAD --> CUSTOM

    DMG --> CUSTOM
    ACC --> CUSTOM
    COMBO --> CUSTOM
    TIME --> GA

    GA --> ERROR
    CUSTOM --> ERROR

    style FPS fill:#4CAF50,stroke:#333,stroke-width:2px
    style GA fill:#FFA726,stroke:#333,stroke-width:2px
    style ERROR fill:#EF5350,stroke:#333,stroke-width:2px
```

---

## 🎮 Future Architecture Considerations

### Potential Backend Integration

```mermaid
graph TD
    subgraph "Current: Frontend Only"
        FE[React + PixiJS]
        LOCAL[Local State]
        CDN[Static CDN]
    end

    subgraph "Future: Optional Backend"
        API[REST API]
        DB[Database]
        AUTH[Authentication]
        LEAD[Leaderboards]
        SAVE[Save Games]
    end

    FE -.->|Future Integration| API
    LOCAL -.->|Sync| DB
    CDN -.->|Dynamic Assets| API

    API --> AUTH
    API --> LEAD
    API --> SAVE

    style FE fill:#61DAFB,stroke:#333,stroke-width:2px
    style API fill:#FF6B6B,stroke:#333,stroke-width:2px,stroke-dasharray: 5 5
    style DB fill:#336791,stroke:#333,stroke-width:2px,stroke-dasharray: 5 5
```

---

## 📝 Architecture Decision Records (ADRs)

### ADR-001: Frontend-Only Architecture

**Status**: Accepted  
**Date**: 2024-01-01  
**Context**: Need to minimize operational complexity and maximize accessibility  
**Decision**: Build as purely frontend application with no backend dependencies  
**Consequences**:

- ✅ Zero server costs
- ✅ Instant deployment
- ✅ No database management
- ❌ No persistence
- ❌ Limited multiplayer options

### ADR-002: React + PixiJS Integration

**Status**: Accepted  
**Date**: 2024-01-01  
**Context**: Need powerful 2D rendering with modern React development  
**Decision**: Use @pixi/react for seamless integration  
**Consequences**:

- ✅ Best of both worlds
- ✅ Strong ecosystem
- ✅ Type safety with TypeScript
- ❌ Learning curve for PixiJS
- ❌ Bundle size considerations

### ADR-003: Zustand for State Management

**Status**: Accepted  
**Date**: 2024-01-01  
**Context**: Need lightweight state management without Redux complexity  
**Decision**: Use Zustand for all global state  
**Consequences**:

- ✅ Minimal boilerplate
- ✅ TypeScript friendly
- ✅ DevTools support
- ❌ Less ecosystem than Redux
- ❌ Need custom persistence layer

---

## 🏁 Conclusion

Black Trigram's architecture represents a modern approach to browser-based gaming, leveraging cutting-edge web technologies while maintaining simplicity through its frontend-only design. The modular architecture supports rapid iteration and easy deployment while providing a rich, culturally authentic gaming experience.

### Key Architectural Strengths:

- **Zero Backend Complexity**: Pure frontend eliminates server management
- **Modular Design**: Clear separation of concerns across systems
- **Performance Focused**: Optimization strategies baked into architecture
- **Culturally Rich**: Deep integration of Korean martial arts philosophy
- **Developer Friendly**: TypeScript, modern React, comprehensive testing

### Areas for Future Enhancement:

- **Persistence Layer**: Optional backend for save games
- **Multiplayer Support**: WebRTC or server-based PvP
- **Advanced Analytics**: Deeper player behavior tracking
- **Mobile Optimization**: Native app wrapper or PWA
- **Content Expansion**: More stances, techniques, and vital points

The architecture is designed to scale with the game's ambitions while maintaining the core philosophy of accessibility, authenticity, and engaging combat mechanics.

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

```

This completes the ARCHITECTURE.md document, providing a comprehensive technical architecture overview of the Black Trigram game, including all the remaining sections that were cut off in your original excerpt.This completes the ARCHITECTURE.md document, providing a comprehensive technical architecture overview of the Black Trigram game, including all the remaining sections that were cut off in your original excerpt.
```
