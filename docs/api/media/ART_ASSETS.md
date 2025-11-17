Below is a focused breakdown of **exactly which art‐ and animation‐related assets** you’ll need for:

1. **Backgrounds** (especially the Intro/Main Menu & Dojang/Training Hall),
2. **UI Icons** (stances, trigrams, HUD elements), and
3. **Technique Animations** (attack, hit, finisher sequences)

Additionally, we call out the **Pixi.js modules** (dependencies) you’ll actually use when wiring everything together in code. Think of this as a “shopping list” for your 2D combat game’s art and animation pipeline, paired with the Pixi features you’ll need to load, display, and animate them.

## CURRENT ASSETS Available

```
src/assets/visual
src/assets/visual/archetypes
src/assets/visual/archetypes/amsalja.png
src/assets/visual/archetypes/hacker.png
src/assets/visual/archetypes/jeongbo_yowon.png
src/assets/visual/archetypes/jojik_pokryeokbae.png
src/assets/visual/archetypes/musa.png
src/assets/visual/bg
src/assets/visual/bg/archetyples
src/assets/visual/bg/archetyples/CyberpunkTeamDynamics.png
src/assets/visual/bg/archetyples/PlayerArchetypesExplained.png
src/assets/visual/bg/archetyples/PlayerArchetypesOverview.png
src/assets/visual/bg/dojang
src/assets/visual/bg/dojang/dojang_floor_tex.png
src/assets/visual/bg/dojang/dojang_wall_tex.png
src/assets/visual/bg/intro
src/assets/visual/bg/intro/intro_bg_loop.png
src/assets/visual/logo
src/assets/visual/logo/black-trigram-256.png
src/assets/visual/logo/black-trigram.png
---

## 1. Backgrounds & Environments

### 1.1 Intro / Main Menu Background

- **Asset Name:** `intro_bg_loop.png`

  - **Description:** A seamless 1920×1080 loopable tile of a rain‐slicked concrete floor with neon pipes and drifting data‐line grid.
  - **File Format:** PNG (plus normal/roughness if you want subtle 3D lighting on flat sprites, but PNG is usually enough).
  - **Folder:** `assets/visual/bg/intro/`
  - **Visual Style Notes:**

    - Base color: Obsidian (`#0A0F12`) with subtle film‐grain overlay.
    - Neon accents: teal/cyan reflections on puddles, flickering Hangul glyphs on pipes.
    - Animation: small “rain drip” loop in shader or flipbook.

- **Asset Name:** `mainmenu_foreground_overlay.png`

  - **Description:** A semi‐transparent obsidian vignette (20px “soft edge”) to darken screen edges, helping text/logo pop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/overlays/`
  - **Usage:** Placed above `intro_bg_loop` to darken corners.

### 1.2 Dojang / Training Hall Background

- **Asset Name:** `dojang_floor_tex.png`

  - **Description:** 2048×2048 PBR‐style image of matte‐black tatami mats, with subtle water puddle normals (if you want dynamic reflections).
  - **File Format:** PNG (or PNG + normal/roughness if desired)
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - Tileable so it can fill any resolution.
    - Slight neon cyan reflections at edges where wall meets floor.

- **Asset Name:** `dojang_wall_tex.png`

  - **Description:** 1024×1024 tile of corrugated metal with pipelines and emissive Hangul trigrams (☰, ☲, etc.) behind semi‐opaque panels.
  - **File Format:** PNG (with separate emissive mask channel if you plan to animate neon flicker).
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - The emissive mask will let you “pulse” each trigram glyph via a simple shader or a flicker sprite.

- **Asset Name:** `dojang_wall_neon_flicker.png` (optional flipbook)

  - **Description:** A small flipbook (e.g. 4 frames at 256×256) showing a neon glyph flicker (cycle through 0%, 50%, 100% brightness).
  - **File Format:** PNG sprite sheet
  - **Folder:** `assets/vfx/animations/`

- **Asset Name:** `training_console_model.png`

  - **Description:** 512×512 stylized grayscale sprite of a holo‐console (flat sprite) with cyan emissive accents (for real‐time data display).
  - **File Format:** PNG
  - **Folder:** `assets/visual/props/`
  - **Notes:** Use this as a static background element; you can overlay bitmaps of gauge bars, or simply let the console glow.

- **Asset Name:** `stance_pad_circle.png`

  - **Description:** 256×256 semi‐transparent PNG of a glowing floor circle. Pulses from 0 → 100% opacity in a 1s loop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/props/`

---

## 2. UI Icons & HUD Elements

### 2.1 Stance Icons

Each icon is a 64×64 px SVG (so it scales crisply). We’ll load them as textures in Pixi and tint/animate as needed.

1. **`icon_stance_defensive.svg`**

   - Outline style in Slate Gray (`#2E3538`) when inactive.
   - Filled with Teal Neon (`#00FFC8`) + soft glow when active.

2. **`icon_stance_balanced.svg`**

   - Outline in Slate Gray; filled with Teal Neon on hover/active.

3. **`icon_stance_aggressive.svg`**

   - Outline in Slate Gray; filled with Crimson (`#FF0044`) on “charged” or “ready” state, or Teal Neon when selected.

   **Folder:** `assets/ui/icons/stances/`

### 2.2 Trigram Icons

- **File Names:**

  ```
  icon_trigram_1.svg
  icon_trigram_2.svg
  …
  icon_trigram_8.svg
  ```

- **Each icon:** 48×48 px, dark background (Gunmetal `#424A50`) with the trigram glyph in Teal Neon.
- **States:**

  - Inactive: no glow, just basic fill.
  - Active: slight outer glow + subtle 1.1× scale “pulse.”
  - Hover: 1.05× scale + quick glow (0.2 s).

  **Folder:** `assets/ui/icons/trigrams/`

### 2.3 HUD Bars & Overlays

- **`hud_health_bar.png`** (800×32 px PNG)

  - 10 segmented blocks. Each filled segment is Cyan Glow (`#1BE7FF`); empty is Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`hud_pain_bar.png`** (800×16 px PNG)

  - 10 segments. Filled segments are Crimson (`#FF0044`); empty Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`ui_button_start_idle.png` & `ui_button_start_hover.png`** (256×64 px each)

  - Idle: Slate Gray panel with “▶ Start Combat” in Hangul+English.
  - Hover: Underline in Teal Neon + icon (“▶”) glows.
  - **Folder:** `assets/ui/buttons/`

- **`ui_panel_slate.png`** (1024×512 px)

  - A semi-opaque Slate Gray panel (70% opacity) with a subtle noise texture.
  - **Folder:** `assets/ui/panels/`

- **`tooltip_arrow.png`** (32×32 px PNG)

  - Small triangle arrow in Cyan Glow for tooltips.
  - **Folder:** `assets/ui/tooltips/`

---

## 3. Technique Animations (AnimatedSprite Sprite Sheets)

Any time you see code like:

```js
await Assets.load("path/to/spritesheet.json");
const frames = [];
for (let i = 0; i < N; i++) {
  frames.push(Texture.from(`frame${i}.png`));
}
const anim = new AnimatedSprite(frames);
```

…you need a **sprite sheet JSON** + **corresponding PNG atlas** for each “technique.” Below is a minimal required set of technique animations:

### 3.1 Light Strike Animation (All Archetypes)

- **Sprite Sheet JSON:** `strike_light_spritesheet.json`
- **Texture Atlas:** `strike_light_spritesheet.png` (e.g., 512×512 containing all 6 frames laid out in a grid).
- **Frame Count:** 6 frames, each \~128×256 (portrait orientation).
- **Animation Speed:** 0.6 (adjust per archetype).
- **Visual Content:** Character winds up → quick punch/kick → recoil. No background in atlas (transparent).
- **Folder:** `assets/characters/animations/techniques/light/`

### 3.2 Medium Strike Animation

- **Sprite Sheet JSON:** `strike_medium_spritesheet.json`
- **Texture Atlas:** `strike_medium_spritesheet.png` (6–8 frames, \~128×256 each).
- **Description:** More wind-up, more impact frames, a small dust puff frame integrated (see VFX).
- **Folder:** `assets/characters/animations/techniques/medium/`

### 3.3 Heavy Strike Animation

- **Sprite Sheet JSON:** `strike_heavy_spritesheet.json`
- **Texture Atlas:** `strike_heavy_spritesheet.png` (8 frames, \~256×256 each).
- **Description:** Big wind-up, slow-mo pause on impact, splash of embedded VFX dust/blood.
- **Folder:** `assets/characters/animations/techniques/heavy/`

### 3.4 Critical Strike / Finisher Animation

- **Sprite Sheet JSON:** `strike_critical_spritesheet.json`
- **Texture Atlas:** `strike_critical_spritesheet.png` (10–12 frames, \~256×256).
- **Description:** Slow-mo bone-breaking blow → flash frame → slowdown.
- **Folder:** `assets/characters/animations/techniques/critical/`

### 3.5 Dodge / Evade Animation

- **Sprite Sheet JSON:** `dodge_spritesheet.json`
- **Texture Atlas:** `dodge_spritesheet.png` (4–6 frames, \~128×256).
- **Description:** Quick sidestep/backflip frames, subtle afterimage.
- **Folder:** `assets/characters/animations/techniques/dodge/`

### 3.6 Block / Parry Animation

- **Sprite Sheet JSON:** `block_spritesheet.json`
- **Texture Atlas:** `block_spritesheet.png` (5 frames, \~128×256).
- **Description:** Character raises arm/weapon to block → recoil if successful.
- **Folder:** `assets/characters/animations/techniques/block/`

### 3.7 Hit Reaction Animation

- **Sprite Sheet JSON:** `hit_reaction_spritesheet.json`
- **Texture Atlas:** `hit_reaction_spritesheet.png` (4 frames, \~128×256).
- **Description:** Character flinches backwards, tinted red on final frame.
- **Folder:** `assets/characters/animations/techniques/hit/`

### 3.8 Finisher Sequence (All Archetypes)

- **Sprite Sheet JSON:** `finisher_musa_spritesheet.json`, `finisher_amsalja_spritesheet.json`, etc.
- **Texture Atlas:** `finisher_musa_spritesheet.png` (12 frames, \~256×256), etc.
- **Description:** A multi-stage “cinematic” finisher (pause → bone crushing → slow fade).
- **Folder:** `assets/characters/animations/finisher/`

---

## 4. Pixi.js Dependencies & Modules Needed

Below is a minimal list of **Pixi.js modules** (from `pixi.js/lib`) that you will rely on to load, animate, and render everything above. In your `package.json`, you’ve already installed `pixi.js`. At runtime, you’ll import exactly the pieces you use:

```ts
import {
  Application,
  TickerPlugin, // core ticker
  ResizePlugin, // auto resizes to window
  Assets, // for loading JSON/PNG atlases
  Texture,
  Sprite,
  AnimatedSprite,
  Container,
  TilingSprite, // if you want parallax/tiled backgrounds
  Loader, // older API if you prefer Loader instead of Assets
} from "pixi.js";
```

- **`Application`** (from `app/Application.mjs`)

  - Creates the Pixi canvas, WebGL context, stage, etc.

- **`TickerPlugin`** & **`ResizePlugin`**

  - Ensures your app’s ticker (main game loop) and auto-resize functionality.

- **`Assets`** (from `assets/Assets.mjs`)

  - The new recommended loader for JSON sprite sheets, PNGs, audio, etc.
  - Example:

    ```ts
    await Assets.load(
      "assets/characters/animations/techniques/light/strike_light_spritesheet.json"
    );
    ```

- **`Texture`** (from `rendering/texture/Texture.mjs`)

  - Create textures from loaded assets:

    ```ts
    const frameTex = Texture.from("strike_light_000.png");
    ```

- **`Sprite`** & **`AnimatedSprite`** (from `scene/sprite/Sprite.mjs` & `scene/sprite-animated/AnimatedSprite.mjs`)

  - `Sprite` for static images (UI icons, backgrounds).
  - `AnimatedSprite` for flipbook animations (techniques, VFX).

- **`Container`** (from `scene/container/Container.mjs`)

  - Use a parent `Container` for grouping layers:

    - `backgroundContainer`
    - `characterContainer`
    - `uiContainer`
    - `vfxContainer`

- **`TilingSprite`** (from `scene/sprite-tiling/TilingSprite.mjs`)

  - If you want to scroll/loop the `intro_bg_loop.png` or tile `dojang_floor_tex.png` seamlessly across a larger stage.

- **`Loader`** (from `assets/loader/Loader.mjs`)

  - If you prefer the older PIXI.Loader API to Assets. Both are possible; `Assets` is recommended for newer Pixi versions.

- **`Filter`** / **`BlurFilter`** / **`DisplacementFilter`** (from `filters/defaults/*`)

  - Useful for adding real-time blur afterimages (for `dodge`), screen shakes, or ripples when powering up Ki (`ki_charge`).

---

## 5. Directory Structure & Final Checklist

Below is a **consolidated folder structure** showing where each of the above assets live. This is what your repo (or build pipeline) needs before you start coding the Pixi setup:

```
/assets
│
├─ characters/
│  ├─ animations/
│  │   ├─ techniques/
│  │   │   ├─ light/
│  │   │   │   ├─ strike_light_spritesheet.json
│  │   │   │   └─ strike_light_spritesheet.png
│  │   │   ├─ medium/
│  │   │   │   ├─ strike_medium_spritesheet.json
│  │   │   │   └─ strike_medium_spritesheet.png
│  │   │   ├─ heavy/
│  │   │   │   ├─ strike_heavy_spritesheet.json
│  │   │   │   └─ strike_heavy_spritesheet.png
│  │   │   ├─ critical/
│  │   │   │   ├─ strike_critical_spritesheet.json
│  │   │   │   └─ strike_critical_spritesheet.png
│  │   │   ├─ dodge/
│  │   │   │   ├─ dodge_spritesheet.json
│  │   │   │   └─ dodge_spritesheet.png
│  │   │   ├─ block/
│  │   │   │   ├─ block_spritesheet.json
│  │   │   │   └─ block_spritesheet.png
│  │   │   └─ hit/
│  │   │       ├─ hit_reaction_spritesheet.json
│  │   │       └─ hit_reaction_spritesheet.png
│  │   └─ finisher/
│  │       ├─ musa_finisher_spritesheet.json
│  │       └─ musa_finisher_spritesheet.png
│  │       ├─ amsalja_finisher_spritesheet.json
│  │       └─ amsalja_finisher_spritesheet.png
│  │       └─ … (one per archetype)
│  └─ portraits/
│      ├─ portrait_musa.png
│      ├─ portrait_amsalja.png
│      └─ … (other archetypes)
│
├─ fonts/
│  ├─ BlackTrigram-Hangul.woff2
│  ├─ NotoSansKR-Regular.woff2
│  └─ Roboto-Regular.woff2
│
├─ i18n/
│  ├─ ko.json
│  └─ en.json
│
├─ props/
│  ├─ training_console_model.png
│  ├─ stance_pad_circle.png
│  └─ dummy_target_overlay.svg
│
├─ shaders/
│  ├─ rim_light.shader
│  ├─ blood_decal.shader
│  └─ neon_flicker.shader
│
├─ ui/
│  ├─ buttons/
│  │   ├─ ui_button_start_idle.png
│  │   └─ ui_button_start_hover.png
│  ├─ icons/
│  │   ├─ stances/
│  │   │   ├─ icon_stance_defensive.svg
│  │   │   ├─ icon_stance_balanced.svg
│  │   │   └─ icon_stance_aggressive.svg
│  │   ├─ trigrams/
│  │   │   ├─ icon_trigram_1.svg
│  │   │   ├─ icon_trigram_2.svg
│  │   │   └─ … up to icon_trigram_8.svg
│  │   └─ tooltip_arrow.png
│  └─ hud/
│      ├─ hud_health_bar.png
│      └─ hud_pain_bar.png
│
├─ vfx/
│  ├─ animations/
│  │   ├─ anim_logo_pulse.json
│  │   ├─ anim_menu_slide_0.png … anim_menu_slide_7.png
│  │   ├─ anim_strike_impact_0.png … anim_strike_impact_15.png
│  │   └─ anim_finisher_musa_0.png … anim_finisher_musa_11.png
│  ├─ particles/
│  │   ├─ vfx_dust_puff.png
│  │   ├─ vfx_blood_splatter.png
│  │   └─ confetti_sprites.png
│  └─ shaders/
│      ├─ vfx_impact_ring.png
│      ├─ vfx_neon_glow.png
│      └─ vfx_critical_flash.png
│
├─ visual/
│  ├─ bg/
│  │   ├─ intro/
│  │   │   ├─ intro_bg_loop.png
│  │   │   └─ mainmenu_foreground_overlay.png
│  │   └─ dojang/
│  │       ├─ dojang_floor_tex.png
│  │       └─ dojang_wall_tex.png
│  └─ overlays/
│      ├─ vital_region_head.png
│      ├─ vital_region_neck.png
│      ├─ vital_region_torso.png
│      ├─ vital_region_arms.png
│      ├─ vital_region_chest.png
│      └─ vital_region_legs.png
│
└─ public/
   └─ assets/
       └─ audio/
           ├─ music/
           │   ├─ intro_theme.webm
           │   ├─ combat_theme.webm
           │   ├─ combat_theme_geon.webm
           │   ├─ training_theme.webm
           │   ├─ meditation_theme.webm
           │   ├─ victory_theme.webm
           │   ├─ underground_rave_theme.webm
           │   └─ ambient_loop.webm
           └─ sfx/
               ├─ ambient/
               │   ├─ dojang_ambience.webm
               │   ├─ wind_effect.webm
               │   └─ dojo_crowd.webm
               ├─ attacks/
               │   ├─ attack_punch_light.webm
               │   ├─ attack_punch_medium.webm
               │   ├─ attack_kick_heavy.webm
               │   ├─ attack_light.webm
               │   ├─ attack_medium.webm
               │   ├─ attack_critical.webm
               │   ├─ attack_special_geon.webm
               │   ├─ dodge.webm
               │   ├─ block_success.webm
               │   ├─ block_break.webm
               │   └─ perfect_strike.webm
               ├─ hit/
               │   ├─ hit_light.webm
               │   ├─ hit_medium.webm
               │   ├─ hit_heavy.webm
               │   ├─ hit_critical.webm
               │   ├─ hit_flesh.webm
               │   └─ hit_block.webm
               ├─ combo/
               │   ├─ combo_buildup.webm
               │   ├─ combo_finish.webm
               │   └─ energy_pulse.webm
               ├─ match/
               │   ├─ match_start.webm
               │   ├─ countdown.webm
               │   ├─ match_end.webm
               │   ├─ victory.webm
               │   └─ defeat.webm
               ├─ movement/
               │   ├─ footstep.webm
               │   └─ stance_change.webm
               ├─ ki/
               │   ├─ ki_charge.webm
               │   └─ ki_release.webm
               ├─ stamina/
               │   └─ stamina_depleted.webm
               ├─ health/
               │   └─ health_low.webm
               └─ ui/
                   ├─ menu_click.webm
                   ├─ menu_navigate.webm
                   ├─ menu_select.webm
                   ├─ menu_hover.webm
                   └─ menu_back.webm
```

---

## 1. Backgrounds & Environments

### 1.1 Intro / Main Menu Background

- **Asset Name:** `intro_bg_loop.png`

  - **Description:** A seamless 1920×1080 loopable tile of a rain‐slicked concrete floor with neon pipes and drifting data‐line grid.
  - **File Format:** PNG (plus normal/roughness if you want subtle 3D lighting on flat sprites, but PNG is usually enough).
  - **Folder:** `assets/visual/bg/intro/`
  - **Visual Style Notes:**

    - Base color: Obsidian (`#0A0F12`) with subtle film‐grain overlay.
    - Neon accents: teal/cyan reflections on puddles, flickering Hangul glyphs on pipes.
    - Animation: small “rain drip” loop in shader or flipbook.

- **Asset Name:** `mainmenu_foreground_overlay.png`

  - **Description:** A semi‐transparent obsidian vignette (20px “soft edge”) to darken screen edges, helping text/logo pop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/overlays/`
  - **Usage:** Placed above `intro_bg_loop` to darken corners.

### 1.2 Dojang / Training Hall Background

- **Asset Name:** `dojang_floor_tex.png`

  - **Description:** 2048×2048 PBR‐style image of matte‐black tatami mats, with subtle water puddle normals (if you want dynamic reflections).
  - **File Format:** PNG (or PNG + normal/roughness if desired)
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - Tileable so it can fill any resolution.
    - Slight neon cyan reflections at edges where wall meets floor.

- **Asset Name:** `dojang_wall_tex.png`

  - **Description:** 1024×1024 tile of corrugated metal with pipelines and emissive Hangul trigrams (☰, ☲, etc.) behind semi‐opaque panels.
  - **File Format:** PNG (with separate emissive mask channel if you plan to animate neon flicker).
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - The emissive mask will let you “pulse” each trigram glyph via a simple shader or a flicker sprite.

- **Asset Name:** `dojang_wall_neon_flicker.png` (optional flipbook)

  - **Description:** A small flipbook (e.g. 4 frames at 256×256) showing a neon glyph flicker (cycle through 0%, 50%, 100% brightness).
  - **File Format:** PNG sprite sheet
  - **Folder:** `assets/vfx/animations/`

- **Asset Name:** `training_console_model.png`

  - **Description:** 512×512 stylized grayscale sprite of a holo‐console (flat sprite) with cyan emissive accents (for real‐time data display).
  - **File Format:** PNG
  - **Folder:** `assets/visual/props/`
  - **Notes:** Use this as a static background element; you can overlay bitmaps of gauge bars, or simply let the console glow.

- **Asset Name:** `stance_pad_circle.png`

  - **Description:** 256×256 semi‐transparent PNG of a glowing floor circle. Pulses from 0 → 100% opacity in a 1s loop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/props/`

---

## 2. UI Icons & HUD Elements

### 2.1 Stance Icons

Each icon is a 64×64 px SVG (so it scales crisply). We’ll load them as textures in Pixi and tint/animate as needed.

1. **`icon_stance_defensive.svg`**

   - Outline style in Slate Gray (`#2E3538`) when inactive.
   - Filled with Teal Neon (`#00FFC8`) + soft glow when active.

2. **`icon_stance_balanced.svg`**

   - Outline in Slate Gray; filled with Teal Neon on hover/active.

3. **`icon_stance_aggressive.svg`**

   - Outline in Slate Gray; filled with Crimson (`#FF0044`) on “charged” or “ready” state, or Teal Neon when selected.

   **Folder:** `assets/ui/icons/stances/`

### 2.2 Trigram Icons

- **File Names:**

  ```
  icon_trigram_1.svg
  icon_trigram_2.svg
  …
  icon_trigram_8.svg
  ```

- **Each icon:** 48×48 px, dark background (Gunmetal `#424A50`) with the trigram glyph in Teal Neon.
- **States:**

  - Inactive: no glow, just basic fill.
  - Active: slight outer glow + subtle 1.1× scale “pulse.”
  - Hover: 1.05× scale + quick glow (0.2 s).

  **Folder:** `assets/ui/icons/trigrams/`

### 2.3 HUD Bars & Overlays

- **`hud_health_bar.png`** (800×32 px PNG)

  - 10 segmented blocks. Each filled segment is Cyan Glow (`#1BE7FF`); empty is Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`hud_pain_bar.png`** (800×16 px PNG)

  - 10 segments. Filled segments are Crimson (`#FF0044`); empty Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`ui_button_start_idle.png` & `ui_button_start_hover.png`** (256×64 px each)

  - Idle: Slate Gray panel with “▶ Start Combat” in Hangul+English.
  - Hover: Underline in Teal Neon + icon (“▶”) glows.
  - **Folder:** `assets/ui/buttons/`

- **`ui_panel_slate.png`** (1024×512 px)

  - A semi-opaque Slate Gray panel (70% opacity) with a subtle noise texture.
  - **Folder:** `assets/ui/panels/`

- **`tooltip_arrow.png`** (32×32 px PNG)

  - Small triangle arrow in Cyan Glow for tooltips.
  - **Folder:** `assets/ui/tooltips/`

---

## 3. Technique Animations (AnimatedSprite Sprite Sheets)

Any time you see code like:

```js
await Assets.load("path/to/spritesheet.json");
const frames = [];
for (let i = 0; i < N; i++) {
  frames.push(Texture.from(`frame${i}.png`));
}
const anim = new AnimatedSprite(frames);
```

…you need a **sprite sheet JSON** + **corresponding PNG atlas** for each “technique.” Below is a minimal required set of technique animations:

### 3.1 Light Strike Animation (All Archetypes)

- **Sprite Sheet JSON:** `strike_light_spritesheet.json`
- **Texture Atlas:** `strike_light_spritesheet.png` (e.g., 512×512 containing all 6 frames laid out in a grid).
- **Frame Count:** 6 frames, each \~128×256 (portrait orientation).
- **Animation Speed:** 0.6 (adjust per archetype).
- **Visual Content:** Character winds up → quick punch/kick → recoil. No background in atlas (transparent).
- **Folder:** `assets/characters/animations/techniques/light/`

### 3.2 Medium Strike Animation

- **Sprite Sheet JSON:** `strike_medium_spritesheet.json`
- **Texture Atlas:** `strike_medium_spritesheet.png` (6–8 frames, \~128×256 each).
- **Description:** More wind-up, more impact frames, a small dust puff frame integrated (see VFX).
- **Folder:** `assets/characters/animations/techniques/medium/`

### 3.3 Heavy Strike Animation

- **Sprite Sheet JSON:** `strike_heavy_spritesheet.json`
- **Texture Atlas:** `strike_heavy_spritesheet.png` (8 frames, \~256×256 each).
- **Description:** Big wind-up, slow-mo pause on impact, splash of embedded VFX dust/blood.
- **Folder:** `assets/characters/animations/techniques/heavy/`

### 3.4 Critical Strike / Finisher Animation

- **Sprite Sheet JSON:** `strike_critical_spritesheet.json`
- **Texture Atlas:** `strike_critical_spritesheet.png` (10–12 frames, \~256×256).
- **Description:** Slow-mo bone-breaking blow → flash frame → slowdown.
- **Folder:** `assets/characters/animations/techniques/critical/`

### 3.5 Dodge / Evade Animation

- **Sprite Sheet JSON:** `dodge_spritesheet.json`
- **Texture Atlas:** `dodge_spritesheet.png` (4–6 frames, \~128×256).
- **Description:** Quick sidestep/backflip frames, subtle afterimage.
- **Folder:** `assets/characters/animations/techniques/dodge/`

### 3.6 Block / Parry Animation

- **Sprite Sheet JSON:** `block_spritesheet.json`
- **Texture Atlas:** `block_spritesheet.png` (5 frames, \~128×256).
- **Description:** Character raises arm/weapon to block → recoil if successful.
- **Folder:** `assets/characters/animations/techniques/block/`

### 3.7 Hit Reaction Animation

- **Sprite Sheet JSON:** `hit_reaction_spritesheet.json`
- **Texture Atlas:** `hit_reaction_spritesheet.png` (4 frames, \~128×256).
- **Description:** Character flinches backwards, tinted red on final frame.
- **Folder:** `assets/characters/animations/techniques/hit/`

### 3.8 Finisher Sequence (All Archetypes)

- **Sprite Sheet JSON:** `finisher_musa_spritesheet.json`, `finisher_amsalja_spritesheet.json`, etc.
- **Texture Atlas:** `finisher_musa_spritesheet.png` (12 frames, \~256×256), etc.
- **Description:** A multi-stage “cinematic” finisher (pause → bone crushing → slow fade).
- **Folder:** `assets/characters/animations/finisher/`

---

## 4. Pixi.js Dependencies & Modules Needed

Below is a minimal list of **Pixi.js modules** (from `pixi.js/lib`) that you will rely on to load, animate, and render everything above. In your `package.json`, you’ve already installed `pixi.js`. At runtime, you’ll import exactly the pieces you use:

```ts
import {
  Application,
  TickerPlugin, // core ticker
  ResizePlugin, // auto resizes to window
  Assets, // for loading JSON/PNG atlases
  Texture,
  Sprite,
  AnimatedSprite,
  Container,
  TilingSprite, // if you want parallax/tiled backgrounds
  Loader, // older API if you prefer Loader instead of Assets
} from "pixi.js";
```

- **`Application`** (from `app/Application.mjs`)

  - Creates the Pixi canvas, WebGL context, stage, etc.

- **`TickerPlugin`** & **`ResizePlugin`**

  - Ensures your app’s ticker (main game loop) and auto-resize functionality.

- **`Assets`** (from `assets/Assets.mjs`)

  - The new recommended loader for JSON sprite sheets, PNGs, audio, etc.
  - Example:

    ```ts
    await Assets.load(
      "assets/characters/animations/techniques/light/strike_light_spritesheet.json"
    );
    ```

- **`Texture`** (from `rendering/texture/Texture.mjs`)

  - Create textures from loaded assets:

    ```ts
    const frameTex = Texture.from("strike_light_000.png");
    ```

- **`Sprite`** & **`AnimatedSprite`** (from `scene/sprite/Sprite.mjs` & `scene/sprite-animated/AnimatedSprite.mjs`)

  - `Sprite` for static images (UI icons, backgrounds).
  - `AnimatedSprite` for flipbook animations (techniques, VFX).

- **`Container`** (from `scene/container/Container.mjs`)

  - Use a parent `Container` for grouping layers:

    - `backgroundContainer`
    - `characterContainer`
    - `uiContainer`
    - `vfxContainer`

- **`TilingSprite`** (from `scene/sprite-tiling/TilingSprite.mjs`)

  - If you want to scroll/loop the `intro_bg_loop.png` or tile `dojang_floor_tex.png` seamlessly across a larger stage.

- **`Loader`** (from `assets/loader/Loader.mjs`)

  - If you prefer the older PIXI.Loader API to Assets. Both are possible; `Assets` is recommended for newer Pixi versions.

- **`Filter`** / **`BlurFilter`** / **`DisplacementFilter`** (from `filters/defaults/*`)

  - Useful for adding real-time blur afterimages (for `dodge`), screen shakes, or ripples when powering up Ki (`ki_charge`).

---

## 5. Directory Structure & Final Checklist

Below is a **consolidated folder structure** showing where each of the above assets live. This is what your repo (or build pipeline) needs before you start coding the Pixi setup:

```
/assets
│
├─ characters/
│  ├─ animations/
│  │   ├─ techniques/
│  │   │   ├─ light/
│  │   │   │   ├─ strike_light_spritesheet.json
│  │   │   │   └─ strike_light_spritesheet.png
│  │   │   ├─ medium/
│  │   │   │   ├─ strike_medium_spritesheet.json
│  │   │   │   └─ strike_medium_spritesheet.png
│  │   │   ├─ heavy/
│  │   │   │   ├─ strike_heavy_spritesheet.json
│  │   │   │   └─ strike_heavy_spritesheet.png
│  │   │   ├─ critical/
│  │   │   │   ├─ strike_critical_spritesheet.json
│  │   │   │   └─ strike_critical_spritesheet.png
│  │   │   ├─ dodge/
│  │   │   │   ├─ dodge_spritesheet.json
│  │   │   │   └─ dodge_spritesheet.png
│  │   │   ├─ block/
│  │   │   │   ├─ block_spritesheet.json
│  │   │   │   └─ block_spritesheet.png
│  │   │   └─ hit/
│  │   │       ├─ hit_reaction_spritesheet.json
│  │   │       └─ hit_reaction_spritesheet.png
│  │   └─ finisher/
│  │       ├─ musa_finisher_spritesheet.json
│  │       └─ musa_finisher_spritesheet.png
│  │       ├─ amsalja_finisher_spritesheet.json
│  │       └─ amsalja_finisher_spritesheet.png
│  │       └─ … (one per archetype)
│  └─ portraits/
│      ├─ portrait_musa.png
│      ├─ portrait_amsalja.png
│      └─ … (other archetypes)
│
├─ fonts/
│  ├─ BlackTrigram-Hangul.woff2
│  ├─ NotoSansKR-Regular.woff2
│  └─ Roboto-Regular.woff2
│
├─ i18n/
│  ├─ ko.json
│  └─ en.json
│
├─ props/
│  ├─ training_console_model.png
│  ├─ stance_pad_circle.png
│  └─ dummy_target_overlay.svg
│
├─ shaders/
│  ├─ rim_light.shader
│  ├─ blood_decal.shader
│  └─ neon_flicker.shader
│
├─ ui/
│  ├─ buttons/
│  │   ├─ ui_button_start_idle.png
│  │   └─ ui_button_start_hover.png
│  ├─ icons/
│  │   ├─ stances/
│  │   │   ├─ icon_stance_defensive.svg
│  │   │   ├─ icon_stance_balanced.svg
│  │   │   └─ icon_stance_aggressive.svg
│  │   ├─ trigrams/
│  │   │   ├─ icon_trigram_1.svg
│  │   │   ├─ icon_trigram_2.svg
│  │   │   └─ … up to icon_trigram_8.svg
│  │   └─ tooltip_arrow.png
│  └─ hud/
│      ├─ hud_health_bar.png
│      └─ hud_pain_bar.png
│
├─ vfx/
│  ├─ animations/
│  │   ├─ anim_logo_pulse.json
│  │   ├─ anim_menu_slide_0.png … anim_menu_slide_7.png
│  │   ├─ anim_strike_impact_0.png … anim_strike_impact_15.png
│  │   └─ anim_finisher_musa_0.png … anim_finisher_musa_11.png
│  ├─ particles/
│  │   ├─ vfx_dust_puff.png
│  │   ├─ vfx_blood_splatter.png
│  │   └─ confetti_sprites.png
│  └─ shaders/
│      ├─ vfx_impact_ring.png
│      ├─ vfx_neon_glow.png
│      └─ vfx_critical_flash.png
│
├─ visual/
│  ├─ bg/
│  │   ├─ intro/
│  │   │   ├─ intro_bg_loop.png
│  │   │   └─ mainmenu_foreground_overlay.png
│  │   └─ dojang/
│  │       ├─ dojang_floor_tex.png
│  │       └─ dojang_wall_tex.png
│  └─ overlays/
│      ├─ vital_region_head.png
│      ├─ vital_region_neck.png
│      ├─ vital_region_torso.png
│      ├─ vital_region_arms.png
│      ├─ vital_region_chest.png
│      └─ vital_region_legs.png
│
└─ public/
   └─ assets/
       └─ audio/
           ├─ music/
           │   ├─ intro_theme.webm
           │   ├─ combat_theme.webm
           │   ├─ combat_theme_geon.webm
           │   ├─ training_theme.webm
           │   ├─ meditation_theme.webm
           │   ├─ victory_theme.webm
           │   ├─ underground_rave_theme.webm
           │   └─ ambient_loop.webm
           └─ sfx/
               ├─ ambient/
               │   ├─ dojang_ambience.webm
               │   ├─ wind_effect.webm
               │   └─ dojo_crowd.webm
               ├─ attacks/
               │   ├─ attack_punch_light.webm
               │   ├─ attack_punch_medium.webm
               │   ├─ attack_kick_heavy.webm
               │   ├─ attack_light.webm
               │   ├─ attack_medium.webm
               │   ├─ attack_critical.webm
               │   ├─ attack_special_geon.webm
               │   ├─ dodge.webm
               │   ├─ block_success.webm
               │   ├─ block_break.webm
               │   └─ perfect_strike.webm
               ├─ hit/
               │   ├─ hit_light.webm
               │   ├─ hit_medium.webm
               │   ├─ hit_heavy.webm
               │   ├─ hit_critical.webm
               │   ├─ hit_flesh.webm
               │   └─ hit_block.webm
               ├─ combo/
               │   ├─ combo_buildup.webm
               │   ├─ combo_finish.webm
               │   └─ energy_pulse.webm
               ├─ match/
               │   ├─ match_start.webm
               │   ├─ countdown.webm
               │   ├─ match_end.webm
               │   ├─ victory.webm
               │   └─ defeat.webm
               ├─ movement/
               │   ├─ footstep.webm
               │   └─ stance_change.webm
               ├─ ki/
               │   ├─ ki_charge.webm
               │   └─ ki_release.webm
               ├─ stamina/
               │   └─ stamina_depleted.webm
               ├─ health/
               │   └─ health_low.webm
               └─ ui/
                   ├─ menu_click.webm
                   ├─ menu_navigate.webm
                   ├─ menu_select.webm
                   ├─ menu_hover.webm
                   └─ menu_back.webm
```

---

## 1. Backgrounds & Environments

### 1.1 Intro / Main Menu Background

- **Asset Name:** `intro_bg_loop.png`

  - **Description:** A seamless 1920×1080 loopable tile of a rain‐slicked concrete floor with neon pipes and drifting data‐line grid.
  - **File Format:** PNG (plus normal/roughness if you want subtle 3D lighting on flat sprites, but PNG is usually enough).
  - **Folder:** `assets/visual/bg/intro/`
  - **Visual Style Notes:**

    - Base color: Obsidian (`#0A0F12`) with subtle film‐grain overlay.
    - Neon accents: teal/cyan reflections on puddles, flickering Hangul glyphs on pipes.
    - Animation: small “rain drip” loop in shader or flipbook.

- **Asset Name:** `mainmenu_foreground_overlay.png`

  - **Description:** A semi‐transparent obsidian vignette (20px “soft edge”) to darken screen edges, helping text/logo pop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/overlays/`
  - **Usage:** Placed above `intro_bg_loop` to darken corners.

### 1.2 Dojang / Training Hall Background

- **Asset Name:** `dojang_floor_tex.png`

  - **Description:** 2048×2048 PBR‐style image of matte‐black tatami mats, with subtle water puddle normals (if you want dynamic reflections).
  - **File Format:** PNG (or PNG + normal/roughness if desired)
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - Tileable so it can fill any resolution.
    - Slight neon cyan reflections at edges where wall meets floor.

- **Asset Name:** `dojang_wall_tex.png`

  - **Description:** 1024×1024 tile of corrugated metal with pipelines and emissive Hangul trigrams (☰, ☲, etc.) behind semi‐opaque panels.
  - **File Format:** PNG (with separate emissive mask channel if you plan to animate neon flicker).
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - The emissive mask will let you “pulse” each trigram glyph via a simple shader or a flicker sprite.

- **Asset Name:** `dojang_wall_neon_flicker.png` (optional flipbook)

  - **Description:** A small flipbook (e.g. 4 frames at 256×256) showing a neon glyph flicker (cycle through 0%, 50%, 100% brightness).
  - **File Format:** PNG sprite sheet
  - **Folder:** `assets/vfx/animations/`

- **Asset Name:** `training_console_model.png`

  - **Description:** 512×512 stylized grayscale sprite of a holo‐console (flat sprite) with cyan emissive accents (for real‐time data display).
  - **File Format:** PNG
  - **Folder:** `assets/visual/props/`
  - **Notes:** Use this as a static background element; you can overlay bitmaps of gauge bars, or simply let the console glow.

- **Asset Name:** `stance_pad_circle.png`

  - **Description:** 256×256 semi‐transparent PNG of a glowing floor circle. Pulses from 0 → 100% opacity in a 1s loop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/props/`

---

## 2. UI Icons & HUD Elements

### 2.1 Stance Icons

Each icon is a 64×64 px SVG (so it scales crisply). We’ll load them as textures in Pixi and tint/animate as needed.

1. **`icon_stance_defensive.svg`**

   - Outline style in Slate Gray (`#2E3538`) when inactive.
   - Filled with Teal Neon (`#00FFC8`) + soft glow when active.

2. **`icon_stance_balanced.svg`**

   - Outline in Slate Gray; filled with Teal Neon on hover/active.

3. **`icon_stance_aggressive.svg`**

   - Outline in Slate Gray; filled with Crimson (`#FF0044`) on “charged” or “ready” state, or Teal Neon when selected.

   **Folder:** `assets/ui/icons/stances/`

### 2.2 Trigram Icons

- **File Names:**

  ```
  icon_trigram_1.svg
  icon_trigram_2.svg
  …
  icon_trigram_8.svg
  ```

- **Each icon:** 48×48 px, dark background (Gunmetal `#424A50`) with the trigram glyph in Teal Neon.
- **States:**

  - Inactive: no glow, just basic fill.
  - Active: slight outer glow + subtle 1.1× scale “pulse.”
  - Hover: 1.05× scale + quick glow (0.2 s).

  **Folder:** `assets/ui/icons/trigrams/`

### 2.3 HUD Bars & Overlays

- **`hud_health_bar.png`** (800×32 px PNG)

  - 10 segmented blocks. Each filled segment is Cyan Glow (`#1BE7FF`); empty is Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`hud_pain_bar.png`** (800×16 px PNG)

  - 10 segments. Filled segments are Crimson (`#FF0044`); empty Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`ui_button_start_idle.png` & `ui_button_start_hover.png`** (256×64 px each)

  - Idle: Slate Gray panel with “▶ Start Combat” in Hangul+English.
  - Hover: Underline in Teal Neon + icon (“▶”) glows.
  - **Folder:** `assets/ui/buttons/`

- **`ui_panel_slate.png`** (1024×512 px)

  - A semi-opaque Slate Gray panel (70% opacity) with a subtle noise texture.
  - **Folder:** `assets/ui/panels/`

- **`tooltip_arrow.png`** (32×32 px PNG)

  - Small triangle arrow in Cyan Glow for tooltips.
  - **Folder:** `assets/ui/tooltips/`

---

## 3. Technique Animations (AnimatedSprite Sprite Sheets)

Any time you see code like:

```js
await Assets.load("path/to/spritesheet.json");
const frames = [];
for (let i = 0; i < N; i++) {
  frames.push(Texture.from(`frame${i}.png`));
}
const anim = new AnimatedSprite(frames);
```

…you need a **sprite sheet JSON** + **corresponding PNG atlas** for each “technique.” Below is a minimal required set of technique animations:

### 3.1 Light Strike Animation (All Archetypes)

- **Sprite Sheet JSON:** `strike_light_spritesheet.json`
- **Texture Atlas:** `strike_light_spritesheet.png` (e.g., 512×512 containing all 6 frames laid out in a grid).
- **Frame Count:** 6 frames, each \~128×256 (portrait orientation).
- **Animation Speed:** 0.6 (adjust per archetype).
- **Visual Content:** Character winds up → quick punch/kick → recoil. No background in atlas (transparent).
- **Folder:** `assets/characters/animations/techniques/light/`

### 3.2 Medium Strike Animation

- **Sprite Sheet JSON:** `strike_medium_spritesheet.json`
- **Texture Atlas:** `strike_medium_spritesheet.png` (6–8 frames, \~128×256 each).
- **Description:** More wind-up, more impact frames, a small dust puff frame integrated (see VFX).
- **Folder:** `assets/characters/animations/techniques/medium/`

### 3.3 Heavy Strike Animation

- **Sprite Sheet JSON:** `strike_heavy_spritesheet.json`
- **Texture Atlas:** `strike_heavy_spritesheet.png` (8 frames, \~256×256 each).
- **Description:** Big wind-up, slow-mo pause on impact, splash of embedded VFX dust/blood.
- **Folder:** `assets/characters/animations/techniques/heavy/`

### 3.4 Critical Strike / Finisher Animation

- **Sprite Sheet JSON:** `strike_critical_spritesheet.json`
- **Texture Atlas:** `strike_critical_spritesheet.png` (10–12 frames, \~256×256).
- **Description:** Slow-mo bone-breaking blow → flash frame → slowdown.
- **Folder:** `assets/characters/animations/techniques/critical/`

### 3.5 Dodge / Evade Animation

- **Sprite Sheet JSON:** `dodge_spritesheet.json`
- **Texture Atlas:** `dodge_spritesheet.png` (4–6 frames, \~128×256).
- **Description:** Quick sidestep/backflip frames, subtle afterimage.
- **Folder:** `assets/characters/animations/techniques/dodge/`

### 3.6 Block / Parry Animation

- **Sprite Sheet JSON:** `block_spritesheet.json`
- **Texture Atlas:** `block_spritesheet.png` (5 frames, \~128×256).
- **Description:** Character raises arm/weapon to block → recoil if successful.
- **Folder:** `assets/characters/animations/techniques/block/`

### 3.7 Hit Reaction Animation

- **Sprite Sheet JSON:** `hit_reaction_spritesheet.json`
- **Texture Atlas:** `hit_reaction_spritesheet.png` (4 frames, \~128×256).
- **Description:** Character flinches backwards, tinted red on final frame.
- **Folder:** `assets/characters/animations/techniques/hit/`

### 3.8 Finisher Sequence (All Archetypes)

- **Sprite Sheet JSON:** `finisher_musa_spritesheet.json`, `finisher_amsalja_spritesheet.json`, etc.
- **Texture Atlas:** `finisher_musa_spritesheet.png` (12 frames, \~256×256), etc.
- **Description:** A multi-stage “cinematic” finisher (pause → bone crushing → slow fade).
- **Folder:** `assets/characters/animations/finisher/`

---

## 4. Pixi.js Dependencies & Modules Needed

Below is a minimal list of **Pixi.js modules** (from `pixi.js/lib`) that you will rely on to load, animate, and render everything above. In your `package.json`, you’ve already installed `pixi.js`. At runtime, you’ll import exactly the pieces you use:

```ts
import {
  Application,
  TickerPlugin, // core ticker
  ResizePlugin, // auto resizes to window
  Assets, // for loading JSON/PNG atlases
  Texture,
  Sprite,
  AnimatedSprite,
  Container,
  TilingSprite, // if you want parallax/tiled backgrounds
  Loader, // older API if you prefer Loader instead of Assets
} from "pixi.js";
```

- **`Application`** (from `app/Application.mjs`)

  - Creates the Pixi canvas, WebGL context, stage, etc.

- **`TickerPlugin`** & **`ResizePlugin`**

  - Ensures your app’s ticker (main game loop) and auto-resize functionality.

- **`Assets`** (from `assets/Assets.mjs`)

  - The new recommended loader for JSON sprite sheets, PNGs, audio, etc.
  - Example:

    ```ts
    await Assets.load(
      "assets/characters/animations/techniques/light/strike_light_spritesheet.json"
    );
    ```

- **`Texture`** (from `rendering/texture/Texture.mjs`)

  - Create textures from loaded assets:

    ```ts
    const frameTex = Texture.from("strike_light_000.png");
    ```

- **`Sprite`** & **`AnimatedSprite`** (from `scene/sprite/Sprite.mjs` & `scene/sprite-animated/AnimatedSprite.mjs`)

  - `Sprite` for static images (UI icons, backgrounds).
  - `AnimatedSprite` for flipbook animations (techniques, VFX).

- **`Container`** (from `scene/container/Container.mjs`)

  - Use a parent `Container` for grouping layers:

    - `backgroundContainer`
    - `characterContainer`
    - `uiContainer`
    - `vfxContainer`

- **`TilingSprite`** (from `scene/sprite-tiling/TilingSprite.mjs`)

  - If you want to scroll/loop the `intro_bg_loop.png` or tile `dojang_floor_tex.png` seamlessly across a larger stage.

- **`Loader`** (from `assets/loader/Loader.mjs`)

  - If you prefer the older PIXI.Loader API to Assets. Both are possible; `Assets` is recommended for newer Pixi versions.

- **`Filter`** / **`BlurFilter`** / **`DisplacementFilter`** (from `filters/defaults/*`)

  - Useful for adding real-time blur afterimages (for `dodge`), screen shakes, or ripples when powering up Ki (`ki_charge`).

---

## 5. Directory Structure & Final Checklist

Below is a **consolidated folder structure** showing where each of the above assets live. This is what your repo (or build pipeline) needs before you start coding the Pixi setup:

```
/assets
│
├─ characters/
│  ├─ animations/
│  │   ├─ techniques/
│  │   │   ├─ light/
│  │   │   │   ├─ strike_light_spritesheet.json
│  │   │   │   └─ strike_light_spritesheet.png
│  │   │   ├─ medium/
│  │   │   │   ├─ strike_medium_spritesheet.json
│  │   │   │   └─ strike_medium_spritesheet.png
│  │   │   ├─ heavy/
│  │   │   │   ├─ strike_heavy_spritesheet.json
│  │   │   │   └─ strike_heavy_spritesheet.png
│  │   │   ├─ critical/
│  │   │   │   ├─ strike_critical_spritesheet.json
│  │   │   │   └─ strike_critical_spritesheet.png
│  │   │   ├─ dodge/
│  │   │   │   ├─ dodge_spritesheet.json
│  │   │   │   └─ dodge_spritesheet.png
│  │   │   ├─ block/
│  │   │   │   ├─ block_spritesheet.json
│  │   │   │   └─ block_spritesheet.png
│  │   │   └─ hit/
│  │   │       ├─ hit_reaction_spritesheet.json
│  │   │       └─ hit_reaction_spritesheet.png
│  │   └─ finisher/
│  │       ├─ musa_finisher_spritesheet.json
│  │       └─ musa_finisher_spritesheet.png
│  │       ├─ amsalja_finisher_spritesheet.json
│  │       └─ amsalja_finisher_spritesheet.png
│  │       └─ … (one per archetype)
│  └─ portraits/
│      ├─ portrait_musa.png
│      ├─ portrait_amsalja.png
│      └─ … (other archetypes)
│
├─ fonts/
│  ├─ BlackTrigram-Hangul.woff2
│  ├─ NotoSansKR-Regular.woff2
│  └─ Roboto-Regular.woff2
│
├─ i18n/
│  ├─ ko.json
│  └─ en.json
│
├─ props/
│  ├─ training_console_model.png
│  ├─ stance_pad_circle.png
│  └─ dummy_target_overlay.svg
│
├─ shaders/
│  ├─ rim_light.shader
│  ├─ blood_decal.shader
│  └─ neon_flicker.shader
│
├─ ui/
│  ├─ buttons/
│  │   ├─ ui_button_start_idle.png
│  │   └─ ui_button_start_hover.png
│  ├─ icons/
│  │   ├─ stances/
│  │   │   ├─ icon_stance_defensive.svg
│  │   │   ├─ icon_stance_balanced.svg
│  │   │   └─ icon_stance_aggressive.svg
│  │   ├─ trigrams/
│  │   │   ├─ icon_trigram_1.svg
│  │   │   ├─ icon_trigram_2.svg
│  │   │   └─ … up to icon_trigram_8.svg
│  │   └─ tooltip_arrow.png
│  └─ hud/
│      ├─ hud_health_bar.png
│      └─ hud_pain_bar.png
│
├─ vfx/
│  ├─ animations/
│  │   ├─ anim_logo_pulse.json
│  │   ├─ anim_menu_slide_0.png … anim_menu_slide_7.png
│  │   ├─ anim_strike_impact_0.png … anim_strike_impact_15.png
│  │   └─ anim_finisher_musa_0.png … anim_finisher_musa_11.png
│  ├─ particles/
│  │   ├─ vfx_dust_puff.png
│  │   ├─ vfx_blood_splatter.png
│  │   └─ confetti_sprites.png
│  └─ shaders/
│      ├─ vfx_impact_ring.png
│      ├─ vfx_neon_glow.png
│      └─ vfx_critical_flash.png
│
├─ visual/
│  ├─ bg/
│  │   ├─ intro/
│  │   │   ├─ intro_bg_loop.png
│  │   │   └─ mainmenu_foreground_overlay.png
│  │   └─ dojang/
│  │       ├─ dojang_floor_tex.png
│  │       └─ dojang_wall_tex.png
│  └─ overlays/
│      ├─ vital_region_head.png
│      ├─ vital_region_neck.png
│      ├─ vital_region_torso.png
│      ├─ vital_region_arms.png
│      ├─ vital_region_chest.png
│      └─ vital_region_legs.png
│
└─ public/
   └─ assets/
       └─ audio/
           ├─ music/
           │   ├─ intro_theme.webm
           │   ├─ combat_theme.webm
           │   ├─ combat_theme_geon.webm
           │   ├─ training_theme.webm
           │   ├─ meditation_theme.webm
           │   ├─ victory_theme.webm
           │   ├─ underground_rave_theme.webm
           │   └─ ambient_loop.webm
           └─ sfx/
               ├─ ambient/
               │   ├─ dojang_ambience.webm
               │   ├─ wind_effect.webm
               │   └─ dojo_crowd.webm
               ├─ attacks/
               │   ├─ attack_punch_light.webm
               │   ├─ attack_punch_medium.webm
               │   ├─ attack_kick_heavy.webm
               │   ├─ attack_light.webm
               │   ├─ attack_medium.webm
               │   ├─ attack_critical.webm
               │   ├─ attack_special_geon.webm
               │   ├─ dodge.webm
               │   ├─ block_success.webm
               │   ├─ block_break.webm
               │   └─ perfect_strike.webm
               ├─ hit/
               │   ├─ hit_light.webm
               │   ├─ hit_medium.webm
               │   ├─ hit_heavy.webm
               │   ├─ hit_critical.webm
               │   ├─ hit_flesh.webm
               │   └─ hit_block.webm
               ├─ combo/
               │   ├─ combo_buildup.webm
               │   ├─ combo_finish.webm
               │   └─ energy_pulse.webm
               ├─ match/
               │   ├─ match_start.webm
               │   ├─ countdown.webm
               │   ├─ match_end.webm
               │   ├─ victory.webm
               │   └─ defeat.webm
               ├─ movement/
               │   ├─ footstep.webm
               │   └─ stance_change.webm
               ├─ ki/
               │   ├─ ki_charge.webm
               │   └─ ki_release.webm
               ├─ stamina/
               │   └─ stamina_depleted.webm
               ├─ health/
               │   └─ health_low.webm
               └─ ui/
                   ├─ menu_click.webm
                   ├─ menu_navigate.webm
                   ├─ menu_select.webm
                   ├─ menu_hover.webm
                   └─ menu_back.webm
```

---

## 1. Backgrounds & Environments

### 1.1 Intro / Main Menu Background

- **Asset Name:** `intro_bg_loop.png`

  - **Description:** A seamless 1920×1080 loopable tile of a rain‐slicked concrete floor with neon pipes and drifting data‐line grid.
  - **File Format:** PNG (plus normal/roughness if you want subtle 3D lighting on flat sprites, but PNG is usually enough).
  - **Folder:** `assets/visual/bg/intro/`
  - **Visual Style Notes:**

    - Base color: Obsidian (`#0A0F12`) with subtle film‐grain overlay.
    - Neon accents: teal/cyan reflections on puddles, flickering Hangul glyphs on pipes.
    - Animation: small “rain drip” loop in shader or flipbook.

- **Asset Name:** `mainmenu_foreground_overlay.png`

  - **Description:** A semi‐transparent obsidian vignette (20px “soft edge”) to darken screen edges, helping text/logo pop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/overlays/`
  - **Usage:** Placed above `intro_bg_loop` to darken corners.

### 1.2 Dojang / Training Hall Background

- **Asset Name:** `dojang_floor_tex.png`

  - **Description:** 2048×2048 PBR‐style image of matte‐black tatami mats, with subtle water puddle normals (if you want dynamic reflections).
  - **File Format:** PNG (or PNG + normal/roughness if desired)
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - Tileable so it can fill any resolution.
    - Slight neon cyan reflections at edges where wall meets floor.

- **Asset Name:** `dojang_wall_tex.png`

  - **Description:** 1024×1024 tile of corrugated metal with pipelines and emissive Hangul trigrams (☰, ☲, etc.) behind semi‐opaque panels.
  - **File Format:** PNG (with separate emissive mask channel if you plan to animate neon flicker).
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - The emissive mask will let you “pulse” each trigram glyph via a simple shader or a flicker sprite.

- **Asset Name:** `dojang_wall_neon_flicker.png` (optional flipbook)

  - **Description:** A small flipbook (e.g. 4 frames at 256×256) showing a neon glyph flicker (cycle through 0%, 50%, 100% brightness).
  - **File Format:** PNG sprite sheet
  - **Folder:** `assets/vfx/animations/`

- **Asset Name:** `training_console_model.png`

  - **Description:** 512×512 stylized grayscale sprite of a holo‐console (flat sprite) with cyan emissive accents (for real‐time data display).
  - **File Format:** PNG
  - **Folder:** `assets/visual/props/`
  - **Notes:** Use this as a static background element; you can overlay bitmaps of gauge bars, or simply let the console glow.

- **Asset Name:** `stance_pad_circle.png`

  - **Description:** 256×256 semi‐transparent PNG of a glowing floor circle. Pulses from 0 → 100% opacity in a 1s loop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/props/`

---

## 2. UI Icons & HUD Elements

### 2.1 Stance Icons

Each icon is a 64×64 px SVG (so it scales crisply). We’ll load them as textures in Pixi and tint/animate as needed.

1. **`icon_stance_defensive.svg`**

   - Outline style in Slate Gray (`#2E3538`) when inactive.
   - Filled with Teal Neon (`#00FFC8`) + soft glow when active.

2. **`icon_stance_balanced.svg`**

   - Outline in Slate Gray; filled with Teal Neon on hover/active.

3. **`icon_stance_aggressive.svg`**

   - Outline in Slate Gray; filled with Crimson (`#FF0044`) on “charged” or “ready” state, or Teal Neon when selected.

   **Folder:** `assets/ui/icons/stances/`

### 2.2 Trigram Icons

- **File Names:**

  ```
  icon_trigram_1.svg
  icon_trigram_2.svg
  …
  icon_trigram_8.svg
  ```

- **Each icon:** 48×48 px, dark background (Gunmetal `#424A50`) with the trigram glyph in Teal Neon.
- **States:**

  - Inactive: no glow, just basic fill.
  - Active: slight outer glow + subtle 1.1× scale “pulse.”
  - Hover: 1.05× scale + quick glow (0.2 s).

  **Folder:** `assets/ui/icons/trigrams/`

### 2.3 HUD Bars & Overlays

- **`hud_health_bar.png`** (800×32 px PNG)

  - 10 segmented blocks. Each filled segment is Cyan Glow (`#1BE7FF`); empty is Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`hud_pain_bar.png`** (800×16 px PNG)

  - 10 segments. Filled segments are Crimson (`#FF0044`); empty Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`ui_button_start_idle.png` & `ui_button_start_hover.png`** (256×64 px each)

  - Idle: Slate Gray panel with “▶ Start Combat” in Hangul+English.
  - Hover: Underline in Teal Neon + icon (“▶”) glows.
  - **Folder:** `assets/ui/buttons/`

- **`ui_panel_slate.png`** (1024×512 px)

  - A semi-opaque Slate Gray panel (70% opacity) with a subtle noise texture.
  - **Folder:** `assets/ui/panels/`

- **`tooltip_arrow.png`** (32×32 px PNG)

  - Small triangle arrow in Cyan Glow for tooltips.
  - **Folder:** `assets/ui/tooltips/`

---

## 3. Technique Animations (AnimatedSprite Sprite Sheets)

Any time you see code like:

```js
await Assets.load("path/to/spritesheet.json");
const frames = [];
for (let i = 0; i < N; i++) {
  frames.push(Texture.from(`frame${i}.png`));
}
const anim = new AnimatedSprite(frames);
```

…you need a **sprite sheet JSON** + **corresponding PNG atlas** for each “technique.” Below is a minimal required set of technique animations:

### 3.1 Light Strike Animation (All Archetypes)

- **Sprite Sheet JSON:** `strike_light_spritesheet.json`
- **Texture Atlas:** `strike_light_spritesheet.png` (e.g., 512×512 containing all 6 frames laid out in a grid).
- **Frame Count:** 6 frames, each \~128×256 (portrait orientation).
- **Animation Speed:** 0.6 (adjust per archetype).
- **Visual Content:** Character winds up → quick punch/kick → recoil. No background in atlas (transparent).
- **Folder:** `assets/characters/animations/techniques/light/`

### 3.2 Medium Strike Animation

- **Sprite Sheet JSON:** `strike_medium_spritesheet.json`
- **Texture Atlas:** `strike_medium_spritesheet.png` (6–8 frames, \~128×256 each).
- **Description:** More wind-up, more impact frames, a small dust puff frame integrated (see VFX).
- **Folder:** `assets/characters/animations/techniques/medium/`

### 3.3 Heavy Strike Animation

- **Sprite Sheet JSON:** `strike_heavy_spritesheet.json`
- **Texture Atlas:** `strike_heavy_spritesheet.png` (8 frames, \~256×256 each).
- **Description:** Big wind-up, slow-mo pause on impact, splash of embedded VFX dust/blood.
- **Folder:** `assets/characters/animations/techniques/heavy/`

### 3.4 Critical Strike / Finisher Animation

- **Sprite Sheet JSON:** `strike_critical_spritesheet.json`
- **Texture Atlas:** `strike_critical_spritesheet.png` (10–12 frames, \~256×256).
- **Description:** Slow-mo bone-breaking blow → flash frame → slowdown.
- **Folder:** `assets/characters/animations/techniques/critical/`

### 3.5 Dodge / Evade Animation

- **Sprite Sheet JSON:** `dodge_spritesheet.json`
- **Texture Atlas:** `dodge_spritesheet.png` (4–6 frames, \~128×256).
- **Description:** Quick sidestep/backflip frames, subtle afterimage.
- **Folder:** `assets/characters/animations/techniques/dodge/`

### 3.6 Block / Parry Animation

- **Sprite Sheet JSON:** `block_spritesheet.json`
- **Texture Atlas:** `block_spritesheet.png` (5 frames, \~128×256).
- **Description:** Character raises arm/weapon to block → recoil if successful.
- **Folder:** `assets/characters/animations/techniques/block/`

### 3.7 Hit Reaction Animation

- **Sprite Sheet JSON:** `hit_reaction_spritesheet.json`
- **Texture Atlas:** `hit_reaction_spritesheet.png` (4 frames, \~128×256).
- **Description:** Character flinches backwards, tinted red on final frame.
- **Folder:** `assets/characters/animations/techniques/hit/`

### 3.8 Finisher Sequence (All Archetypes)

- **Sprite Sheet JSON:** `finisher_musa_spritesheet.json`, `finisher_amsalja_spritesheet.json`, etc.
- **Texture Atlas:** `finisher_musa_spritesheet.png` (12 frames, \~256×256), etc.
- **Description:** A multi-stage “cinematic” finisher (pause → bone crushing → slow fade).
- **Folder:** `assets/characters/animations/finisher/`

---

## 4. Pixi.js Dependencies & Modules Needed

Below is a minimal list of **Pixi.js modules** (from `pixi.js/lib`) that you will rely on to load, animate, and render everything above. In your `package.json`, you’ve already installed `pixi.js`. At runtime, you’ll import exactly the pieces you use:

```ts
import {
  Application,
  TickerPlugin, // core ticker
  ResizePlugin, // auto resizes to window
  Assets, // for loading JSON/PNG atlases
  Texture,
  Sprite,
  AnimatedSprite,
  Container,
  TilingSprite, // if you want parallax/tiled backgrounds
  Loader, // older API if you prefer Loader instead of Assets
} from "pixi.js";
```

- **`Application`** (from `app/Application.mjs`)

  - Creates the Pixi canvas, WebGL context, stage, etc.

- **`TickerPlugin`** & **`ResizePlugin`**

  - Ensures your app’s ticker (main game loop) and auto-resize functionality.

- **`Assets`** (from `assets/Assets.mjs`)

  - The new recommended loader for JSON sprite sheets, PNGs, audio, etc.
  - Example:

    ```ts
    await Assets.load(
      "assets/characters/animations/techniques/light/strike_light_spritesheet.json"
    );
    ```

- **`Texture`** (from `rendering/texture/Texture.mjs`)

  - Create textures from loaded assets:

    ```ts
    const frameTex = Texture.from("strike_light_000.png");
    ```

- **`Sprite`** & **`AnimatedSprite`** (from `scene/sprite/Sprite.mjs` & `scene/sprite-animated/AnimatedSprite.mjs`)

  - `Sprite` for static images (UI icons, backgrounds).
  - `AnimatedSprite` for flipbook animations (techniques, VFX).

- **`Container`** (from `scene/container/Container.mjs`)

  - Use a parent `Container` for grouping layers:

    - `backgroundContainer`
    - `characterContainer`
    - `uiContainer`
    - `vfxContainer`

- **`TilingSprite`** (from `scene/sprite-tiling/TilingSprite.mjs`)

  - If you want to scroll/loop the `intro_bg_loop.png` or tile `dojang_floor_tex.png` seamlessly across a larger stage.

- **`Loader`** (from `assets/loader/Loader.mjs`)

  - If you prefer the older PIXI.Loader API to Assets. Both are possible; `Assets` is recommended for newer Pixi versions.

- **`Filter`** / **`BlurFilter`** / **`DisplacementFilter`** (from `filters/defaults/*`)

  - Useful for adding real-time blur afterimages (for `dodge`), screen shakes, or ripples when powering up Ki (`ki_charge`).

---

## 5. Directory Structure & Final Checklist

Below is a **consolidated folder structure** showing where each of the above assets live. This is what your repo (or build pipeline) needs before you start coding the Pixi setup:

```
/assets
│
├─ characters/
│  ├─ animations/
│  │   ├─ techniques/
│  │   │   ├─ light/
│  │   │   │   ├─ strike_light_spritesheet.json
│  │   │   │   └─ strike_light_spritesheet.png
│  │   │   ├─ medium/
│  │   │   │   ├─ strike_medium_spritesheet.json
│  │   │   │   └─ strike_medium_spritesheet.png
│  │   │   ├─ heavy/
│  │   │   │   ├─ strike_heavy_spritesheet.json
│  │   │   │   └─ strike_heavy_spritesheet.png
│  │   │   ├─ critical/
│  │   │   │   ├─ strike_critical_spritesheet.json
│  │   │   │   └─ strike_critical_spritesheet.png
│  │   │   ├─ dodge/
│  │   │   │   ├─ dodge_spritesheet.json
│  │   │   │   └─ dodge_spritesheet.png
│  │   │   ├─ block/
│  │   │   │   ├─ block_spritesheet.json
│  │   │   │   └─ block_spritesheet.png
│  │   │   └─ hit/
│  │   │       ├─ hit_reaction_spritesheet.json
│  │   │       └─ hit_reaction_spritesheet.png
│  │   └─ finisher/
│  │       ├─ musa_finisher_spritesheet.json
│  │       └─ musa_finisher_spritesheet.png
│  │       ├─ amsalja_finisher_spritesheet.json
│  │       └─ amsalja_finisher_spritesheet.png
│  │       └─ … (one per archetype)
│  └─ portraits/
│      ├─ portrait_musa.png
│      ├─ portrait_amsalja.png
│      └─ … (other archetypes)
│
├─ fonts/
│  ├─ BlackTrigram-Hangul.woff2
│  ├─ NotoSansKR-Regular.woff2
│  └─ Roboto-Regular.woff2
│
├─ i18n/
│  ├─ ko.json
│  └─ en.json
│
├─ props/
│  ├─ training_console_model.png
│  ├─ stance_pad_circle.png
│  └─ dummy_target_overlay.svg
│
├─ shaders/
│  ├─ rim_light.shader
│  ├─ blood_decal.shader
│  └─ neon_flicker.shader
│
├─ ui/
│  ├─ buttons/
│  │   ├─ ui_button_start_idle.png
│  │   └─ ui_button_start_hover.png
│  ├─ icons/
│  │   ├─ stances/
│  │   │   ├─ icon_stance_defensive.svg
│  │   │   ├─ icon_stance_balanced.svg
│  │   │   └─ icon_stance_aggressive.svg
│  │   ├─ trigrams/
│  │   │   ├─ icon_trigram_1.svg
│  │   │   ├─ icon_trigram_2.svg
│  │   │   └─ … up to icon_trigram_8.svg
│  │   └─ tooltip_arrow.png
│  └─ hud/
│      ├─ hud_health_bar.png
│      └─ hud_pain_bar.png
│
├─ vfx/
│  ├─ animations/
│  │   ├─ anim_logo_pulse.json
│  │   ├─ anim_menu_slide_0.png … anim_menu_slide_7.png
│  │   ├─ anim_strike_impact_0.png … anim_strike_impact_15.png
│  │   └─ anim_finisher_musa_0.png … anim_finisher_musa_11.png
│  ├─ particles/
│  │   ├─ vfx_dust_puff.png
│  │   ├─ vfx_blood_splatter.png
│  │   └─ confetti_sprites.png
│  └─ shaders/
│      ├─ vfx_impact_ring.png
│      ├─ vfx_neon_glow.png
│      └─ vfx_critical_flash.png
│
├─ visual/
│  ├─ bg/
│  │   ├─ intro/
│  │   │   ├─ intro_bg_loop.png
│  │   │   └─ mainmenu_foreground_overlay.png
│  │   └─ dojang/
│  │       ├─ dojang_floor_tex.png
│  │       └─ dojang_wall_tex.png
│  └─ overlays/
│      ├─ vital_region_head.png
│      ├─ vital_region_neck.png
│      ├─ vital_region_torso.png
│      ├─ vital_region_arms.png
│      ├─ vital_region_chest.png
│      └─ vital_region_legs.png
│
└─ public/
   └─ assets/
       └─ audio/
           ├─ music/
           │   ├─ intro_theme.webm
           │   ├─ combat_theme.webm
           │   ├─ combat_theme_geon.webm
           │   ├─ training_theme.webm
           │   ├─ meditation_theme.webm
           │   ├─ victory_theme.webm
           │   ├─ underground_rave_theme.webm
           │   └─ ambient_loop.webm
           └─ sfx/
               ├─ ambient/
               │   ├─ dojang_ambience.webm
               │   ├─ wind_effect.webm
               │   └─ dojo_crowd.webm
               ├─ attacks/
               │   ├─ attack_punch_light.webm
               │   ├─ attack_punch_medium.webm
               │   ├─ attack_kick_heavy.webm
               │   ├─ attack_light.webm
               │   ├─ attack_medium.webm
               │   ├─ attack_critical.webm
               │   ├─ attack_special_geon.webm
               │   ├─ dodge.webm
               │   ├─ block_success.webm
               │   ├─ block_break.webm
               │   └─ perfect_strike.webm
               ├─ hit/
               │   ├─ hit_light.webm
               │   ├─ hit_medium.webm
               │   ├─ hit_heavy.webm
               │   ├─ hit_critical.webm
               │   ├─ hit_flesh.webm
               │   └─ hit_block.webm
               ├─ combo/
               │   ├─ combo_buildup.webm
               │   ├─ combo_finish.webm
               │   └─ energy_pulse.webm
               ├─ match/
               │   ├─ match_start.webm
               │   ├─ countdown.webm
               │   ├─ match_end.webm
               │   ├─ victory.webm
               │   └─ defeat.webm
               ├─ movement/
               │   ├─ footstep.webm
               │   └─ stance_change.webm
               ├─ ki/
               │   ├─ ki_charge.webm
               │   └─ ki_release.webm
               ├─ stamina/
               │   └─ stamina_depleted.webm
               ├─ health/
               │   └─ health_low.webm
               └─ ui/
                   ├─ menu_click.webm
                   ├─ menu_navigate.webm
                   ├─ menu_select.webm
                   ├─ menu_hover.webm
                   └─ menu_back.webm
```

---

## 1. Backgrounds & Environments

### 1.1 Intro / Main Menu Background

- **Asset Name:** `intro_bg_loop.png`

  - **Description:** A seamless 1920×1080 loopable tile of a rain‐slicked concrete floor with neon pipes and drifting data‐line grid.
  - **File Format:** PNG (plus normal/roughness if you want subtle 3D lighting on flat sprites, but PNG is usually enough).
  - **Folder:** `assets/visual/bg/intro/`
  - **Visual Style Notes:**

    - Base color: Obsidian (`#0A0F12`) with subtle film‐grain overlay.
    - Neon accents: teal/cyan reflections on puddles, flickering Hangul glyphs on pipes.
    - Animation: small “rain drip” loop in shader or flipbook.

- **Asset Name:** `mainmenu_foreground_overlay.png`

  - **Description:** A semi‐transparent obsidian vignette (20px “soft edge”) to darken screen edges, helping text/logo pop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/overlays/`
  - **Usage:** Placed above `intro_bg_loop` to darken corners.

### 1.2 Dojang / Training Hall Background

- **Asset Name:** `dojang_floor_tex.png`

  - **Description:** 2048×2048 PBR‐style image of matte‐black tatami mats, with subtle water puddle normals (if you want dynamic reflections).
  - **File Format:** PNG (or PNG + normal/roughness if desired)
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - Tileable so it can fill any resolution.
    - Slight neon cyan reflections at edges where wall meets floor.

- **Asset Name:** `dojang_wall_tex.png`

  - **Description:** 1024×1024 tile of corrugated metal with pipelines and emissive Hangul trigrams (☰, ☲, etc.) behind semi‐opaque panels.
  - **File Format:** PNG (with separate emissive mask channel if you plan to animate neon flicker).
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - The emissive mask will let you “pulse” each trigram glyph via a simple shader or a flicker sprite.

- **Asset Name:** `dojang_wall_neon_flicker.png` (optional flipbook)

  - **Description:** A small flipbook (e.g. 4 frames at 256×256) showing a neon glyph flicker (cycle through 0%, 50%, 100% brightness).
  - **File Format:** PNG sprite sheet
  - **Folder:** `assets/vfx/animations/`

- **Asset Name:** `training_console_model.png`

  - **Description:** 512×512 stylized grayscale sprite of a holo‐console (flat sprite) with cyan emissive accents (for real‐time data display).
  - **File Format:** PNG
  - **Folder:** `assets/visual/props/`
  - **Notes:** Use this as a static background element; you can overlay bitmaps of gauge bars, or simply let the console glow.

- **Asset Name:** `stance_pad_circle.png`

  - **Description:** 256×256 semi‐transparent PNG of a glowing floor circle. Pulses from 0 → 100% opacity in a 1s loop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/props/`

---

## 2. UI Icons & HUD Elements

### 2.1 Stance Icons

Each icon is a 64×64 px SVG (so it scales crisply). We’ll load them as textures in Pixi and tint/animate as needed.

1. **`icon_stance_defensive.svg`**

   - Outline style in Slate Gray (`#2E3538`) when inactive.
   - Filled with Teal Neon (`#00FFC8`) + soft glow when active.

2. **`icon_stance_balanced.svg`**

   - Outline in Slate Gray; filled with Teal Neon on hover/active.

3. **`icon_stance_aggressive.svg`**

   - Outline in Slate Gray; filled with Crimson (`#FF0044`) on “charged” or “ready” state, or Teal Neon when selected.

   **Folder:** `assets/ui/icons/stances/`

### 2.2 Trigram Icons

- **File Names:**

  ```
  icon_trigram_1.svg
  icon_trigram_2.svg
  …
  icon_trigram_8.svg
  ```

- **Each icon:** 48×48 px, dark background (Gunmetal `#424A50`) with the trigram glyph in Teal Neon.
- **States:**

  - Inactive: no glow, just basic fill.
  - Active: slight outer glow + subtle 1.1× scale “pulse.”
  - Hover: 1.05× scale + quick glow (0.2 s).

  **Folder:** `assets/ui/icons/trigrams/`

### 2.3 HUD Bars & Overlays

- **`hud_health_bar.png`** (800×32 px PNG)

  - 10 segmented blocks. Each filled segment is Cyan Glow (`#1BE7FF`); empty is Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`hud_pain_bar.png`** (800×16 px PNG)

  - 10 segments. Filled segments are Crimson (`#FF0044`); empty Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`ui_button_start_idle.png` & `ui_button_start_hover.png`** (256×64 px each)

  - Idle: Slate Gray panel with “▶ Start Combat” in Hangul+English.
  - Hover: Underline in Teal Neon + icon (“▶”) glows.
  - **Folder:** `assets/ui/buttons/`

- **`ui_panel_slate.png`** (1024×512 px)

  - A semi-opaque Slate Gray panel (70% opacity) with a subtle noise texture.
  - **Folder:** `assets/ui/panels/`

- **`tooltip_arrow.png`** (32×32 px PNG)

  - Small triangle arrow in Cyan Glow for tooltips.
  - **Folder:** `assets/ui/tooltips/`

---

## 3. Technique Animations (AnimatedSprite Sprite Sheets)

Any time you see code like:

```js
await Assets.load("path/to/spritesheet.json");
const frames = [];
for (let i = 0; i < N; i++) {
  frames.push(Texture.from(`frame${i}.png`));
}
const anim = new AnimatedSprite(frames);
```

…you need a **sprite sheet JSON** + **corresponding PNG atlas** for each “technique.” Below is a minimal required set of technique animations:

### 3.1 Light Strike Animation (All Archetypes)

- **Sprite Sheet JSON:** `strike_light_spritesheet.json`
- **Texture Atlas:** `strike_light_spritesheet.png` (e.g., 512×512 containing all 6 frames laid out in a grid).
- **Frame Count:** 6 frames, each \~128×256 (portrait orientation).
- **Animation Speed:** 0.6 (adjust per archetype).
- **Visual Content:** Character winds up → quick punch/kick → recoil. No background in atlas (transparent).
- **Folder:** `assets/characters/animations/techniques/light/`

### 3.2 Medium Strike Animation

- **Sprite Sheet JSON:** `strike_medium_spritesheet.json`
- **Texture Atlas:** `strike_medium_spritesheet.png` (6–8 frames, \~128×256 each).
- **Description:** More wind-up, more impact frames, a small dust puff frame integrated (see VFX).
- **Folder:** `assets/characters/animations/techniques/medium/`

### 3.3 Heavy Strike Animation

- **Sprite Sheet JSON:** `strike_heavy_spritesheet.json`
- **Texture Atlas:** `strike_heavy_spritesheet.png` (8 frames, \~256×256 each).
- **Description:** Big wind-up, slow-mo pause on impact, splash of embedded VFX dust/blood.
- **Folder:** `assets/characters/animations/techniques/heavy/`

### 3.4 Critical Strike / Finisher Animation

- **Sprite Sheet JSON:** `strike_critical_spritesheet.json`
- **Texture Atlas:** `strike_critical_spritesheet.png` (10–12 frames, \~256×256).
- **Description:** Slow-mo bone-breaking blow → flash frame → slowdown.
- **Folder:** `assets/characters/animations/techniques/critical/`

### 3.5 Dodge / Evade Animation

- **Sprite Sheet JSON:** `dodge_spritesheet.json`
- **Texture Atlas:** `dodge_spritesheet.png` (4–6 frames, \~128×256).
- **Description:** Quick sidestep/backflip frames, subtle afterimage.
- **Folder:** `assets/characters/animations/techniques/dodge/`

### 3.6 Block / Parry Animation

- **Sprite Sheet JSON:** `block_spritesheet.json`
- **Texture Atlas:** `block_spritesheet.png` (5 frames, \~128×256).
- **Description:** Character raises arm/weapon to block → recoil if successful.
- **Folder:** `assets/characters/animations/techniques/block/`

### 3.7 Hit Reaction Animation

- **Sprite Sheet JSON:** `hit_reaction_spritesheet.json`
- **Texture Atlas:** `hit_reaction_spritesheet.png` (4 frames, \~128×256).
- **Description:** Character flinches backwards, tinted red on final frame.
- **Folder:** `assets/characters/animations/techniques/hit/`

### 3.8 Finisher Sequence (All Archetypes)

- **Sprite Sheet JSON:** `finisher_musa_spritesheet.json`, `finisher_amsalja_spritesheet.json`, etc.
- **Texture Atlas:** `finisher_musa_spritesheet.png` (12 frames, \~256×256), etc.
- **Description:** A multi-stage “cinematic” finisher (pause → bone crushing → slow fade).
- **Folder:** `assets/characters/animations/finisher/`

---

## 4. Pixi.js Dependencies & Modules Needed

Below is a minimal list of **Pixi.js modules** (from `pixi.js/lib`) that you will rely on to load, animate, and render everything above. In your `package.json`, you’ve already installed `pixi.js`. At runtime, you’ll import exactly the pieces you use:

```ts
import {
  Application,
  TickerPlugin, // core ticker
  ResizePlugin, // auto resizes to window
  Assets, // for loading JSON/PNG atlases
  Texture,
  Sprite,
  AnimatedSprite,
  Container,
  TilingSprite, // if you want parallax/tiled backgrounds
  Loader, // older API if you prefer Loader instead of Assets
} from "pixi.js";
```

- **`Application`** (from `app/Application.mjs`)

  - Creates the Pixi canvas, WebGL context, stage, etc.

- **`TickerPlugin`** & **`ResizePlugin`**

  - Ensures your app’s ticker (main game loop) and auto-resize functionality.

- **`Assets`** (from `assets/Assets.mjs`)

  - The new recommended loader for JSON sprite sheets, PNGs, audio, etc.
  - Example:

    ```ts
    await Assets.load(
      "assets/characters/animations/techniques/light/strike_light_spritesheet.json"
    );
    ```

- **`Texture`** (from `rendering/texture/Texture.mjs`)

  - Create textures from loaded assets:

    ```ts
    const frameTex = Texture.from("strike_light_000.png");
    ```

- **`Sprite`** & **`AnimatedSprite`** (from `scene/sprite/Sprite.mjs` & `scene/sprite-animated/AnimatedSprite.mjs`)

  - `Sprite` for static images (UI icons, backgrounds).
  - `AnimatedSprite` for flipbook animations (techniques, VFX).

- **`Container`** (from `scene/container/Container.mjs`)

  - Use a parent `Container` for grouping layers:

    - `backgroundContainer`
    - `characterContainer`
    - `uiContainer`
    - `vfxContainer`

- **`TilingSprite`** (from `scene/sprite-tiling/TilingSprite.mjs`)

  - If you want to scroll/loop the `intro_bg_loop.png` or tile `dojang_floor_tex.png` seamlessly across a larger stage.

- **`Loader`** (from `assets/loader/Loader.mjs`)

  - If you prefer the older PIXI.Loader API to Assets. Both are possible; `Assets` is recommended for newer Pixi versions.

- **`Filter`** / **`BlurFilter`** / **`DisplacementFilter`** (from `filters/defaults/*`)

  - Useful for adding real-time blur afterimages (for `dodge`), screen shakes, or ripples when powering up Ki (`ki_charge`).

---

## 5. Directory Structure & Final Checklist

Below is a **consolidated folder structure** showing where each of the above assets live. This is what your repo (or build pipeline) needs before you start coding the Pixi setup:

```
/assets
├─ characters/
│  ├─ animations/
│  │   ├─ techniques/
│  │   │   ├─ light/
│  │   │   │   ├─ strike_light_spritesheet.json
│  │   │   │   └─ strike_light_spritesheet.png
│  │   │   ├─ medium/
│  │   │   │   ├─ strike_medium_spritesheet.json
│  │   │   │   └─ strike_medium_spritesheet.png
│  │   │   ├─ heavy/
│  │   │   │   ├─ strike_heavy_spritesheet.json
│  │   │   │   └─ strike_heavy_spritesheet.png
│  │   │   ├─ critical/
│  │   │   │   ├─ strike_critical_spritesheet.json
│  │   │   │   └─ strike_critical_spritesheet.png
│  │   │   ├─ dodge/
│  │   │   │   ├─ dodge_spritesheet.json
│  │   │   │   └─ dodge_spritesheet.png
│  │   │   ├─ block/
│  │   │   │   ├─ block_spritesheet.json
│  │   │   │   └─ block_spritesheet.png
│  │   │   └─ hit/
│  │   │       ├─ hit_reaction_spritesheet.json
│  │   │       └─ hit_reaction_spritesheet.png
│  │   └─ finisher/
│  │       ├─ musa_finisher_spritesheet.json
│  │       └─ musa_finisher_spritesheet.png
│  │       ├─ amsalja_finisher_spritesheet.json
│  │       └─ amsalja_finisher_spritesheet.png
│  │       └─ … (one per archetype)
│  └─ portraits/
│      ├─ portrait_musa.png
│      ├─ portrait_amsalja.png
│      └─ … (other archetypes)
│
├─ fonts/
│  ├─ BlackTrigram-Hangul.woff2
│  ├─ NotoSansKR-Regular.woff2
│  └─ Roboto-Regular.woff2
│
├─ i18n/
│  ├─ ko.json
│  └─ en.json
│
├─ props/
│  ├─ training_console_model.png
│  ├─ stance_pad_circle.png
│  └─ dummy_target_overlay.svg
│
├─ shaders/
│  ├─ rim_light.shader
│  ├─ blood_decal.shader
│  └─ neon_flicker.shader
│
├─ ui/
│  ├─ buttons/
│  │   ├─ ui_button_start_idle.png
│  │   └─ ui_button_start_hover.png
│  ├─ icons/
│  │   ├─ stances/
│  │   │   ├─ icon_stance_defensive.svg
│  │   │   ├─ icon_stance_balanced.svg
│  │   │   └─ icon_stance_aggressive.svg
│  │   ├─ trigrams/
│  │   │   ├─ icon_trigram_1.svg
│  │   │   ├─ icon_trigram_2.svg
│  │   │   └─ … up to icon_trigram_8.svg
│  │   └─ tooltip_arrow.png
│  └─ hud/
│      ├─ hud_health_bar.png
│      └─ hud_pain_bar.png
│
├─ vfx/
│  ├─ animations/
│  │   ├─ anim_logo_pulse.json
│  │   ├─ anim_menu_slide_0.png … anim_menu_slide_7.png
│  │   ├─ anim_strike_impact_0.png … anim_strike_impact_15.png
│  │   └─ anim_finisher_musa_0.png … anim_finisher_musa_11.png
│  ├─ particles/
│  │   ├─ vfx_dust_puff.png
│  │   ├─ vfx_blood_splatter.png
│  │   └─ confetti_sprites.png
│  └─ shaders/
│      ├─ vfx_impact_ring.png
│      ├─ vfx_neon_glow.png
│      └─ vfx_critical_flash.png
│
├─ visual/
│  ├─ bg/
│  │   ├─ intro/
│  │   │   ├─ intro_bg_loop.png
│  │   │   └─ mainmenu_foreground_overlay.png
│  │   └─ dojang/
│  │       ├─ dojang_floor_tex.png
│  │       └─ dojang_wall_tex.png
│  └─ overlays/
│      ├─ vital_region_head.png
│      ├─ vital_region_neck.png
│      ├─ vital_region_torso.png
│      ├─ vital_region_arms.png
│      ├─ vital_region_chest.png
│      └─ vital_region_legs.png
│
└─ public/
   └─ assets/
       └─ audio/
           ├─ music/
           │   ├─ intro_theme.webm
           │   ├─ combat_theme.webm
           │   ├─ combat_theme_geon.webm
           │   ├─ training_theme.webm
           │   ├─ meditation_theme.webm
           │   ├─ victory_theme.webm
           │   ├─ underground_rave_theme.webm
           │   └─ ambient_loop.webm
           └─ sfx/
               ├─ ambient/
               │   ├─ dojang_ambience.webm
               │   ├─ wind_effect.webm
               │   └─ dojo_crowd.webm
               ├─ attacks/
               │   ├─ attack_punch_light.webm
               │   ├─ attack_punch_medium.webm
               │   ├─ attack_kick_heavy.webm
               │   ├─ attack_light.webm
               │   ├─ attack_medium.webm
               │   ├─ attack_critical.webm
               │   ├─ attack_special_geon.webm
               │   ├─ dodge.webm
               │   ├─ block_success.webm
               │   ├─ block_break.webm
               │   └─ perfect_strike.webm
               ├─ hit/
               │   ├─ hit_light.webm
               │   ├─ hit_medium.webm
               │   ├─ hit_heavy.webm
               │   ├─ hit_critical.webm
               │   ├─ hit_flesh.webm
               │   └─ hit_block.webm
               ├─ combo/
               │   ├─ combo_buildup.webm
               │   ├─ combo_finish.webm
               │   └─ energy_pulse.webm
               ├─ match/
               │   ├─ match_start.webm
               │   ├─ countdown.webm
               │   ├─ match_end.webm
               │   ├─ victory.webm
               │   └─ defeat.webm
               ├─ movement/
               │   ├─ footstep.webm
               │   └─ stance_change.webm
               ├─ ki/
               │   ├─ ki_charge.webm
               │   └─ ki_release.webm
               ├─ stamina/
               │   └─ stamina_depleted.webm
               ├─ health/
               │   └─ health_low.webm
               └─ ui/
                   ├─ menu_click.webm
                   ├─ menu_navigate.webm
                   ├─ menu_select.webm
                   ├─ menu_hover.webm
                   └─ menu_back.webm
```

---

## 1. Backgrounds & Environments

### 1.1 Intro / Main Menu Background

- **Asset Name:** `intro_bg_loop.png`

  - **Description:** A seamless 1920×1080 loopable tile of a rain‐slicked concrete floor with neon pipes and drifting data‐line grid.
  - **File Format:** PNG (plus normal/roughness if you want subtle 3D lighting on flat sprites, but PNG is usually enough).
  - **Folder:** `assets/visual/bg/intro/`
  - **Visual Style Notes:**

    - Base color: Obsidian (`#0A0F12`) with subtle film‐grain overlay.
    - Neon accents: teal/cyan reflections on puddles, flickering Hangul glyphs on pipes.
    - Animation: small “rain drip” loop in shader or flipbook.

- **Asset Name:** `mainmenu_foreground_overlay.png`

  - **Description:** A semi‐transparent obsidian vignette (20px “soft edge”) to darken screen edges, helping text/logo pop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/overlays/`
  - **Usage:** Placed above `intro_bg_loop` to darken corners.

### 1.2 Dojang / Training Hall Background

- **Asset Name:** `dojang_floor_tex.png`

  - **Description:** 2048×2048 PBR‐style image of matte‐black tatami mats, with subtle water puddle normals (if you want dynamic reflections).
  - **File Format:** PNG (or PNG + normal/roughness if desired)
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - Tileable so it can fill any resolution.
    - Slight neon cyan reflections at edges where wall meets floor.

- **Asset Name:** `dojang_wall_tex.png`

  - **Description:** 1024×1024 tile of corrugated metal with pipelines and emissive Hangul trigrams (☰, ☲, etc.) behind semi‐opaque panels.
  - **File Format:** PNG (with separate emissive mask channel if you plan to animate neon flicker).
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - The emissive mask will let you “pulse” each trigram glyph via a simple shader or a flicker sprite.

- **Asset Name:** `dojang_wall_neon_flicker.png` (optional flipbook)

  - **Description:** A small flipbook (e.g. 4 frames at 256×256) showing a neon glyph flicker (cycle through 0%, 50%, 100% brightness).
  - **File Format:** PNG sprite sheet
  - **Folder:** `assets/vfx/animations/`

- **Asset Name:** `training_console_model.png`

  - **Description:** 512×512 stylized grayscale sprite of a holo‐console (flat sprite) with cyan emissive accents (for real‐time data display).
  - **File Format:** PNG
  - **Folder:** `assets/visual/props/`
  - **Notes:** Use this as a static background element; you can overlay bitmaps of gauge bars, or simply let the console glow.

- **Asset Name:** `stance_pad_circle.png`

  - **Description:** 256×256 semi‐transparent PNG of a glowing floor circle. Pulses from 0 → 100% opacity in a 1s loop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/props/`

---

## 2. UI Icons & HUD Elements

### 2.1 Stance Icons

Each icon is a 64×64 px SVG (so it scales crisply). We’ll load them as textures in Pixi and tint/animate as needed.

1. **`icon_stance_defensive.svg`**

   - Outline style in Slate Gray (`#2E3538`) when inactive.
   - Filled with Teal Neon (`#00FFC8`) + soft glow when active.

2. **`icon_stance_balanced.svg`**

   - Outline in Slate Gray; filled with Teal Neon on hover/active.

3. **`icon_stance_aggressive.svg`**

   - Outline in Slate Gray; filled with Crimson (`#FF0044`) on “charged” or “ready” state, or Teal Neon when selected.

   **Folder:** `assets/ui/icons/stances/`

### 2.2 Trigram Icons

- **File Names:**

  ```
  icon_trigram_1.svg
  icon_trigram_2.svg
  …
  icon_trigram_8.svg
  ```

- **Each icon:** 48×48 px, dark background (Gunmetal `#424A50`) with the trigram glyph in Teal Neon.
- **States:**

  - Inactive: no glow, just basic fill.
  - Active: slight outer glow + subtle 1.1× scale “pulse.”
  - Hover: 1.05× scale + quick glow (0.2 s).

  **Folder:** `assets/ui/icons/trigrams/`

### 2.3 HUD Bars & Overlays

- **`hud_health_bar.png`** (800×32 px PNG)

  - 10 segmented blocks. Each filled segment is Cyan Glow (`#1BE7FF`); empty is Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`hud_pain_bar.png`** (800×16 px PNG)

  - 10 segments. Filled segments are Crimson (`#FF0044`); empty Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`ui_button_start_idle.png` & `ui_button_start_hover.png`** (256×64 px each)

  - Idle: Slate Gray panel with “▶ Start Combat” in Hangul+English.
  - Hover: Underline in Teal Neon + icon (“▶”) glows.
  - **Folder:** `assets/ui/buttons/`

- **`ui_panel_slate.png`** (1024×512 px)

  - A semi-opaque Slate Gray panel (70% opacity) with a subtle noise texture.
  - **Folder:** `assets/ui/panels/`

- **`tooltip_arrow.png`** (32×32 px PNG)

  - Small triangle arrow in Cyan Glow for tooltips.
  - **Folder:** `assets/ui/tooltips/`

---

## 3. Technique Animations (AnimatedSprite Sprite Sheets)

Any time you see code like:

```js
await Assets.load("path/to/spritesheet.json");
const frames = [];
for (let i = 0; i < N; i++) {
  frames.push(Texture.from(`frame${i}.png`));
}
const anim = new AnimatedSprite(frames);
```

…you need a **sprite sheet JSON** + **corresponding PNG atlas** for each “technique.” Below is a minimal required set of technique animations:

### 3.1 Light Strike Animation (All Archetypes)

- **Sprite Sheet JSON:** `strike_light_spritesheet.json`
- **Texture Atlas:** `strike_light_spritesheet.png` (e.g., 512×512 containing all 6 frames laid out in a grid).
- **Frame Count:** 6 frames, each \~128×256 (portrait orientation).
- **Animation Speed:** 0.6 (adjust per archetype).
- **Visual Content:** Character winds up → quick punch/kick → recoil. No background in atlas (transparent).
- **Folder:** `assets/characters/animations/techniques/light/`

### 3.2 Medium Strike Animation

- **Sprite Sheet JSON:** `strike_medium_spritesheet.json`
- **Texture Atlas:** `strike_medium_spritesheet.png` (6–8 frames, \~128×256 each).
- **Description:** More wind-up, more impact frames, a small dust puff frame integrated (see VFX).
- **Folder:** `assets/characters/animations/techniques/medium/`

### 3.3 Heavy Strike Animation

- **Sprite Sheet JSON:** `strike_heavy_spritesheet.json`
- **Texture Atlas:** `strike_heavy_spritesheet.png` (8 frames, \~256×256 each).
- **Description:** Big wind-up, slow-mo pause on impact, splash of embedded VFX dust/blood.
- **Folder:** `assets/characters/animations/techniques/heavy/`

### 3.4 Critical Strike / Finisher Animation

- **Sprite Sheet JSON:** `strike_critical_spritesheet.json`
- **Texture Atlas:** `strike_critical_spritesheet.png` (10–12 frames, \~256×256).
- **Description:** Slow-mo bone-breaking blow → flash frame → slowdown.
- **Folder:** `assets/characters/animations/techniques/critical/`

### 3.5 Dodge / Evade Animation

- **Sprite Sheet JSON:** `dodge_spritesheet.json`
- **Texture Atlas:** `dodge_spritesheet.png` (4–6 frames, \~128×256).
- **Description:** Quick sidestep/backflip frames, subtle afterimage.
- **Folder:** `assets/characters/animations/techniques/dodge/`

### 3.6 Block / Parry Animation

- **Sprite Sheet JSON:** `block_spritesheet.json`
- **Texture Atlas:** `block_spritesheet.png` (5 frames, \~128×256).
- **Description:** Character raises arm/weapon to block → recoil if successful.
- **Folder:** `assets/characters/animations/techniques/block/`

### 3.7 Hit Reaction Animation

- **Sprite Sheet JSON:** `hit_reaction_spritesheet.json`
- **Texture Atlas:** `hit_reaction_spritesheet.png` (4 frames, \~128×256).
- **Description:** Character flinches backwards, tinted red on final frame.
- **Folder:** `assets/characters/animations/techniques/hit/`

### 3.8 Finisher Sequence (All Archetypes)

- **Sprite Sheet JSON:** `finisher_musa_spritesheet.json`, `finisher_amsalja_spritesheet.json`, etc.
- **Texture Atlas:** `finisher_musa_spritesheet.png` (12 frames, \~256×256), etc.
- **Description:** A multi-stage “cinematic” finisher (pause → bone crushing → slow fade).
- **Folder:** `assets/characters/animations/finisher/`

---

## 4. Pixi.js Dependencies & Modules Needed

Below is a minimal list of **Pixi.js modules** (from `pixi.js/lib`) that you will rely on to load, animate, and render everything above. In your `package.json`, you’ve already installed `pixi.js`. At runtime, you’ll import exactly the pieces you use:

```ts
import {
  Application,
  TickerPlugin, // core ticker
  ResizePlugin, // auto resizes to window
  Assets, // for loading JSON/PNG atlases
  Texture,
  Sprite,
  AnimatedSprite,
  Container,
  TilingSprite, // if you want parallax/tiled backgrounds
  Loader, // older API if you prefer Loader instead of Assets
} from "pixi.js";
```

- **`Application`** (from `app/Application.mjs`)

  - Creates the Pixi canvas, WebGL context, stage, etc.

- **`TickerPlugin`** & **`ResizePlugin`**

  - Ensures your app’s ticker (main game loop) and auto-resize functionality.

- **`Assets`** (from `assets/Assets.mjs`)

  - The new recommended loader for JSON sprite sheets, PNGs, audio, etc.
  - Example:

    ```ts
    await Assets.load(
      "assets/characters/animations/techniques/light/strike_light_spritesheet.json"
    );
    ```

- **`Texture`** (from `rendering/texture/Texture.mjs`)

  - Create textures from loaded assets:

    ```ts
    const frameTex = Texture.from("strike_light_000.png");
    ```

- **`Sprite`** & **`AnimatedSprite`** (from `scene/sprite/Sprite.mjs` & `scene/sprite-animated/AnimatedSprite.mjs`)

  - `Sprite` for static images (UI icons, backgrounds).
  - `AnimatedSprite` for flipbook animations (techniques, VFX).

- **`Container`** (from `scene/container/Container.mjs`)

  - Use a parent `Container` for grouping layers:

    - `backgroundContainer`
    - `characterContainer`
    - `uiContainer`
    - `vfxContainer`

- **`TilingSprite`** (from `scene/sprite-tiling/TilingSprite.mjs`)

  - If you want to scroll/loop the `intro_bg_loop.png` or tile `dojang_floor_tex.png` seamlessly across a larger stage.

- **`Loader`** (from `assets/loader/Loader.mjs`)

  - If you prefer the older PIXI.Loader API to Assets. Both are possible; `Assets` is recommended for newer Pixi versions.

- **`Filter`** / **`BlurFilter`** / **`DisplacementFilter`** (from `filters/defaults/*`)

  - Useful for adding real-time blur afterimages (for `dodge`), screen shakes, or ripples when powering up Ki (`ki_charge`).

---

## 5. Directory Structure & Final Checklist

Below is a **consolidated folder structure** showing where each of the above assets live. This is what your repo (or build pipeline) needs before you start coding the Pixi setup:

```
/assets
├─ characters/
│  ├─ animations/
│  │   ├─ techniques/
│  │   │   ├─ light/
│  │   │   │   ├─ strike_light_spritesheet.json
│  │   │   │   └─ strike_light_spritesheet.png
│  │   │   ├─ medium/
│  │   │   │   ├─ strike_medium_spritesheet.json
│  │   │   │   └─ strike_medium_spritesheet.png
│  │   │   ├─ heavy/
│  │   │   │   ├─ strike_heavy_spritesheet.json
│  │   │   │   └─ strike_heavy_spritesheet.png
│  │   │   ├─ critical/
│  │   │   │   ├─ strike_critical_spritesheet.json
│  │   │   │   └─ strike_critical_spritesheet.png
│  │   │   ├─ dodge/
│  │   │     │   │   │   ├─ dodge_spritesheet.json
│  │   │   │   └─ dodge_spritesheet.png
│  │   │   ├─ block/
│  │   │   │   ├─ block_spritesheet.json
│  │   │   │   └─ block_spritesheet.png
│  │   │   └─ hit/
│  │   │       ├─ hit_reaction_spritesheet.json
│  │   │       └─ hit_reaction_spritesheet.png
│  │   └─ finisher/
│  │       ├─ musa_finisher_spritesheet.json
│  │       └─ musa_finisher_spritesheet.png
│  │       ├─ amsalja_finisher_spritesheet.json
│  │       └─ amsalja_finisher_spritesheet.png
│  │       └─ … (one per archetype)
│  └─ portraits/
│      ├─ portrait_musa.png
│      ├─ portrait_amsalja.png
│      └─ … (other archetypes)
│
├─ fonts/
│  ├─ BlackTrigram-Hangul.woff2
│  ├─ NotoSansKR-Regular.woff2
│  └─ Roboto-Regular.woff2
│
├─ i18n/
│  ├─ ko.json
│  └─ en.json
│
├─ props/
│  ├─ training_console_model.png
│  ├─ stance_pad_circle.png
│  └─ dummy_target_overlay.svg
│
├─ shaders/
│  ├─ rim_light.shader
│  ├─ blood_decal.shader
│  └─ neon_flicker.shader
│
├─ ui/
│  ├─ buttons/
│  │   ├─ ui_button_start_idle.png
│  │   └─ ui_button_start_hover.png
│  ├─ icons/
│  │   ├─ stances/
│  │   │   ├─ icon_stance_defensive.svg
│  │   │   ├─ icon_stance_balanced.svg
│  │   │   └─ icon_stance_aggressive.svg
│  │   ├─ trigrams/
│  │   │   ├─ icon_trigram_1.svg
│  │   │   ├─ icon_trigram_2.svg
│  │   │   └─ … up to icon_trigram_8.svg
│  │   └─ tooltip_arrow.png
│  └─ hud/
│      ├─ hud_health_bar.png
│      └─ hud_pain_bar.png
│
├─ vfx/
│  ├─ animations/
│  │   ├─ anim_logo_pulse.json
│  │   ├─ anim_menu_slide_0.png … anim_menu_slide_7.png
│  │   ├─ anim_strike_impact_0.png … anim_strike_impact_15.png
│  │   └─ anim_finisher_musa_0.png … anim_finisher_musa_11.png
│  ├─ particles/
│  │   ├─ vfx_dust_puff.png
│  │   ├─ vfx_blood_splatter.png
│  │   └─ confetti_sprites.png
│  └─ shaders/
│      ├─ vfx_impact_ring.png
│      ├─ vfx_neon_glow.png
│      └─ vfx_critical_flash.png
│
├─ visual/
│  ├─ bg/
│  │   ├─ intro/
│  │   │   ├─ intro_bg_loop.png
│  │   │   └─ mainmenu_foreground_overlay.png
│  │   └─ dojang/
│  │       ├─ dojang_floor_tex.png
│  │       └─ dojang_wall_tex.png
│  └─ overlays/
│      ├─ vital_region_head.png
│      ├─ vital_region_neck.png
│      ├─ vital_region_torso.png
│      ├─ vital_region_arms.png
│      ├─ vital_region_chest.png
│      └─ vital_region_legs.png
│
└─ public/
   └─ assets/
       └─ audio/
           ├─ music/
           │   ├─ intro_theme.webm
           │   ├─ combat_theme.webm
           │   ├─ combat_theme_geon.webm
           │   ├─ training_theme.webm
           │   ├─ meditation_theme.webm
           │   ├─ victory_theme.webm
           │   ├─ underground_rave_theme.webm
           │   └─ ambient_loop.webm
           └─ sfx/
               ├─ ambient/
               │   ├─ dojang_ambience.webm
               │   ├─ wind_effect.webm
               │   └─ dojo_crowd.webm
               ├─ attacks/
               │   ├─ attack_punch_light.webm
               │   ├─ attack_punch_medium.webm
               │   ├─ attack_kick_heavy.webm
               │   ├─ attack_light.webm
               │   ├─ attack_medium.webm
               │   ├─ attack_critical.webm
               │   ├─ attack_special_geon.webm
               │   ├─ dodge.webm
               │   ├─ block_success.webm
               │   ├─ block_break.webm
               │   └─ perfect_strike.webm
               ├─ hit/
               │   ├─ hit_light.webm
               │   ├─ hit_medium.webm
               │   ├─ hit_heavy.webm
               │   ├─ hit_critical.webm
               │   ├─ hit_flesh.webm
               │   └─ hit_block.webm
               ├─ combo/
               │   ├─ combo_buildup.webm
               │   ├─ combo_finish.webm
               │   └─ energy_pulse.webm
               ├─ match/
               │   ├─ match_start.webm
               │   ├─ countdown.webm
               │   ├─ match_end.webm
               │   ├─ victory.webm
               │   └─ defeat.webm
               ├─ movement/
               │   ├─ footstep.webm
               │   └─ stance_change.webm
               ├─ ki/
               │   ├─ ki_charge.webm
               │   └─ ki_release.webm
               ├─ stamina/
               │   └─ stamina_depleted.webm
               ├─ health/
               │   └─ health_low.webm
               └─ ui/
                   ├─ menu_click.webm
                   ├─ menu_navigate.webm
                   ├─ menu_select.webm
                   ├─ menu_hover.webm
                   └─ menu_back.webm
```

---

## 1. Backgrounds & Environments

### 1.1 Intro / Main Menu Background

- **Asset Name:** `intro_bg_loop.png`

  - **Description:** A seamless 1920×1080 loopable tile of a rain‐slicked concrete floor with neon pipes and drifting data‐line grid.
  - **File Format:** PNG (plus normal/roughness if you want subtle 3D lighting on flat sprites, but PNG is usually enough).
  - **Folder:** `assets/visual/bg/intro/`
  - **Visual Style Notes:**

    - Base color: Obsidian (`#0A0F12`) with subtle film‐grain overlay.
    - Neon accents: teal/cyan reflections on puddles, flickering Hangul glyphs on pipes.
    - Animation: small “rain drip” loop in shader or flipbook.

- **Asset Name:** `mainmenu_foreground_overlay.png`

  - **Description:** A semi‐transparent obsidian vignette (20px “soft edge”) to darken screen edges, helping text/logo pop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/overlays/`
  - **Usage:** Placed above `intro_bg_loop` to darken corners.

### 1.2 Dojang / Training Hall Background

- **Asset Name:** `dojang_floor_tex.png`

  - **Description:** 2048×2048 PBR‐style image of matte‐black tatami mats, with subtle water puddle normals (if you want dynamic reflections).
  - **File Format:** PNG (or PNG + normal/roughness if desired)
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - Tileable so it can fill any resolution.
    - Slight neon cyan reflections at edges where wall meets floor.

- **Asset Name:** `dojang_wall_tex.png`

  - **Description:** 1024×1024 tile of corrugated metal with pipelines and emissive Hangul trigrams (☰, ☲, etc.) behind semi‐opaque panels.
  - **File Format:** PNG (with separate emissive mask channel if you plan to animate neon flicker).
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - The emissive mask will let you “pulse” each trigram glyph via a simple shader or a flicker sprite.

- **Asset Name:** `dojang_wall_neon_flicker.png` (optional flipbook)

  - **Description:** A small flipbook (e.g. 4 frames at 256×256) showing a neon glyph flicker (cycle through 0%, 50%, 100% brightness).
  - **File Format:** PNG sprite sheet
  - **Folder:** `assets/vfx/animations/`

- **Asset Name:** `training_console_model.png`

  - **Description:** 512×512 stylized grayscale sprite of a holo‐console (flat sprite) with cyan emissive accents (for real‐time data display).
  - **File Format:** PNG
  - **Folder:** `assets/visual/props/`
  - **Notes:** Use this as a static background element; you can overlay bitmaps of gauge bars, or simply let the console glow.

- **Asset Name:** `stance_pad_circle.png`

  - **Description:** 256×256 semi‐transparent PNG of a glowing floor circle. Pulses from 0 → 100% opacity in a 1s loop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/props/`

---

## 2. UI Icons & HUD Elements

### 2.1 Stance Icons

Each icon is a 64×64 px SVG (so it scales crisply). We’ll load them as textures in Pixi and tint/animate as needed.

1. **`icon_stance_defensive.svg`**

   - Outline style in Slate Gray (`#2E3538`) when inactive.
   - Filled with Teal Neon (`#00FFC8`) + soft glow when active.

2. **`icon_stance_balanced.svg`**

   - Outline in Slate Gray; filled with Teal Neon on hover/active.

3. **`icon_stance_aggressive.svg`**

   - Outline in Slate Gray; filled with Crimson (`#FF0044`) on “charged” or “ready” state, or Teal Neon when selected.

   **Folder:** `assets/ui/icons/stances/`

### 2.2 Trigram Icons

- **File Names:**

  ```
  icon_trigram_1.svg
  icon_trigram_2.svg
  …
  icon_trigram_8.svg
  ```

- **Each icon:** 48×48 px, dark background (Gunmetal `#424A50`) with the trigram glyph in Teal Neon.
- **States:**

  - Inactive: no glow, just basic fill.
  - Active: slight outer glow + subtle 1.1× scale “pulse.”
  - Hover: 1.05× scale + quick glow (0.2 s).

  **Folder:** `assets/ui/icons/trigrams/`

### 2.3 HUD Bars & Overlays

- **`hud_health_bar.png`** (800×32 px PNG)

  - 10 segmented blocks. Each filled segment is Cyan Glow (`#1BE7FF`); empty is Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`hud_pain_bar.png`** (800×16 px PNG)

  - 10 segments. Filled segments are Crimson (`#FF0044`); empty Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`ui_button_start_idle.png` & `ui_button_start_hover.png`** (256×64 px each)

  - Idle: Slate Gray panel with “▶ Start Combat” in Hangul+English.
  - Hover: Underline in Teal Neon + icon (“▶”) glows.
  - **Folder:** `assets/ui/buttons/`

- **`ui_panel_slate.png`** (1024×512 px)

  - A semi-opaque Slate Gray panel (70% opacity) with a subtle noise texture.
  - **Folder:** `assets/ui/panels/`

- **`tooltip_arrow.png`** (32×32 px PNG)

  - Small triangle arrow in Cyan Glow for tooltips.
  - **Folder:** `assets/ui/tooltips/`

---

## 3. Technique Animations (AnimatedSprite Sprite Sheets)

Any time you see code like:

```js
await Assets.load("path/to/spritesheet.json");
const frames = [];
for (let i = 0; i < N; i++) {
  frames.push(Texture.from(`frame${i}.png`));
}
const anim = new AnimatedSprite(frames);
```

…you need a **sprite sheet JSON** + **corresponding PNG atlas** for each “technique.” Below is a minimal required set of technique animations:

### 3.1 Light Strike Animation (All Archetypes)

- **Sprite Sheet JSON:** `strike_light_spritesheet.json`
- **Texture Atlas:** `strike_light_spritesheet.png` (e.g., 512×512 containing all 6 frames laid out in a grid).
- **Frame Count:** 6 frames, each \~128×256 (portrait orientation).
- **Animation Speed:** 0.6 (adjust per archetype).
- **Visual Content:** Character winds up → quick punch/kick → recoil. No background in atlas (transparent).
- **Folder:** `assets/characters/animations/techniques/light/`

### 3.2 Medium Strike Animation

- **Sprite Sheet JSON:** `strike_medium_spritesheet.json`
- **Texture Atlas:** `strike_medium_spritesheet.png` (6–8 frames, \~128×256 each).
- **Description:** More wind-up, more impact frames, a small dust puff frame integrated (see VFX).
- **Folder:** `assets/characters/animations/techniques/medium/`

### 3.3 Heavy Strike Animation

- **Sprite Sheet JSON:** `strike_heavy_spritesheet.json`
- **Texture Atlas:** `strike_heavy_spritesheet.png` (8 frames, \~256×256 each).
- **Description:** Big wind-up, slow-mo pause on impact, splash of embedded VFX dust/blood.
- **Folder:** `assets/characters/animations/techniques/heavy/`

### 3.4 Critical Strike / Finisher Animation

- **Sprite Sheet JSON:** `strike_critical_spritesheet.json`
- **Texture Atlas:** `strike_critical_spritesheet.png` (10–12 frames, \~256×256).
- **Description:** Slow-mo bone-breaking blow → flash frame → slowdown.
- **Folder:** `assets/characters/animations/techniques/critical/`

### 3.5 Dodge / Evade Animation

- **Sprite Sheet JSON:** `dodge_spritesheet.json`
- **Texture Atlas:** `dodge_spritesheet.png` (4–6 frames, \~128×256).
- **Description:** Quick sidestep/backflip frames, subtle afterimage.
- **Folder:** `assets/characters/animations/techniques/dodge/`

### 3.6 Block / Parry Animation

- **Sprite Sheet JSON:** `block_spritesheet.json`
- **Texture Atlas:** `block_spritesheet.png` (5 frames, \~128×256).
- **Description:** Character raises arm/weapon to block → recoil if successful.
- **Folder:** `assets/characters/animations/techniques/block/`

### 3.7 Hit Reaction Animation

- **Sprite Sheet JSON:** `hit_reaction_spritesheet.json`
- **Texture Atlas:** `hit_reaction_spritesheet.png` (4 frames, \~128×256).
- **Description:** Character flinches backwards, tinted red on final frame.
- **Folder:** `assets/characters/animations/techniques/hit/`

### 3.8 Finisher Sequence (All Archetypes)

- **Sprite Sheet JSON:** `finisher_musa_spritesheet.json`, `finisher_amsalja_spritesheet.json`, etc.
- **Texture Atlas:** `finisher_musa_spritesheet.png` (12 frames, \~256×256), etc.
- **Description:** A multi-stage “cinematic” finisher (pause → bone crushing → slow fade).
- **Folder:** `assets/characters/animations/finisher/`

---

## 4. Pixi.js Dependencies & Modules Needed

Below is a minimal list of **Pixi.js modules** (from `pixi.js/lib`) that you will rely on to load, animate, and render everything above. In your `package.json`, you’ve already installed `pixi.js`. At runtime, you’ll import exactly the pieces you use:

```ts
import {
  Application,
  TickerPlugin, // core ticker
  ResizePlugin, // auto resizes to window
  Assets, // for loading JSON/PNG atlases
  Texture,
  Sprite,
  AnimatedSprite,
  Container,
  TilingSprite, // if you want parallax/tiled backgrounds
  Loader, // older API if you prefer Loader instead of Assets
} from "pixi.js";
```

- **`Application`** (from `app/Application.mjs`)

  - Creates the Pixi canvas, WebGL context, stage, etc.

- **`TickerPlugin`** & **`ResizePlugin`**

  - Ensures your app’s ticker (main game loop) and auto-resize functionality.

- **`Assets`** (from `assets/Assets.mjs`)

  - The new recommended loader for JSON sprite sheets, PNGs, audio, etc.
  - Example:

    ```ts
    await Assets.load(
      "assets/characters/animations/techniques/light/strike_light_spritesheet.json"
    );
    ```

- **`Texture`** (from `rendering/texture/Texture.mjs`)

  - Create textures from loaded assets:

    ```ts
    const frameTex = Texture.from("strike_light_000.png");
    ```

- **`Sprite`** & **`AnimatedSprite`** (from `scene/sprite/Sprite.mjs` & `scene/sprite-animated/AnimatedSprite.mjs`)

  - `Sprite` for static images (UI icons, backgrounds).
  - `AnimatedSprite` for flipbook animations (techniques, VFX).

- **`Container`** (from `scene/container/Container.mjs`)

  - Use a parent `Container` for grouping layers:

    - `backgroundContainer`
    - `characterContainer`
    - `uiContainer`
    - `vfxContainer`

- **`TilingSprite`** (from `scene/sprite-tiling/TilingSprite.mjs`)

  - If you want to scroll/loop the `intro_bg_loop.png` or tile `dojang_floor_tex.png` seamlessly across a larger stage.

- **`Loader`** (from `assets/loader/Loader.mjs`)

  - If you prefer the older PIXI.Loader API to Assets. Both are possible; `Assets` is recommended for newer Pixi versions.

- **`Filter`** / **`BlurFilter`** / **`DisplacementFilter`** (from `filters/defaults/*`)

  - Useful for adding real-time blur afterimages (for `dodge`), screen shakes, or ripples when powering up Ki (`ki_charge`).

---

## 5. Directory Structure & Final Checklist

Below is a **consolidated folder structure** showing where each of the above assets live. This is what your repo (or build pipeline) needs before you start coding the Pixi setup:

```
/assets
├─ characters/
│  ├─ animations/
│  │   ├─ techniques/
│  │   │   ├─ light/
│  │   │   │   ├─ strike_light_spritesheet.json
│  │   │   │   └─ strike_light_spritesheet.png
│  │   │   ├─ medium/
│  │   │   │   ├─ strike_medium_spritesheet.json
│  │   │   │   └─ strike_medium_spritesheet.png
│  │   │   ├─ heavy/
│  │   │   │   ├─ strike_heavy_spritesheet.json
│  │   │   │   └─ strike_heavy_spritesheet.png
│  │   │   ├─ critical/
│  │   │   │   ├─ strike_critical_spritesheet.json
│  │   │   │   └─ strike_critical_spritesheet.png
│  │   │   ├─ dodge/
│  │   │   │   ├─ dodge_spritesheet.json
│  │   │   │   └─ dodge_spritesheet.png
│  │   │   ├─ block/
│  │   │   │   ├─ block_spritesheet.json
│  │   │   │   └─ block_spritesheet.png
│  │   │   └─ hit/
│  │   │       ├─ hit_reaction_spritesheet.json
│  │   │       └─ hit_reaction_spritesheet.png
│  │   └─ finisher/
│  │       ├─ musa_finisher_spritesheet.json
│  │       └─ musa_finisher_spritesheet.png
│  │       ├─ amsalja_finisher_spritesheet.json
│  │       └─ amsalja_finisher_spritesheet.png
│  │       └─ … (one per archetype)
│  └─ portraits/
│      ├─ portrait_musa.png
│      ├─ portrait_amsalja.png
│      └─ … (other archetypes)
│
├─ fonts/
│  ├─ BlackTrigram-Hangul.woff2
│  ├─ NotoSansKR-Regular.woff2
│  └─ Roboto-Regular.woff2
│
├─ i18n/
│  ├─ ko.json
│  └─ en.json
│
├─ props/
│  ├─ training_console_model.png
│  ├─ stance_pad_circle.png
│  └─ dummy_target_overlay.svg
│
├─ shaders/
│  ├─ rim_light.shader
│  ├─ blood_decal.shader
│  └─ neon_flicker.shader
│
├─ ui/
│  ├─ buttons/
│  │   ├─ ui_button_start_idle.png
│  │   └─ ui_button_start_hover.png
│  ├─ icons/
│  │   ├─ stances/
│  │   │   ├─ icon_stance_defensive.svg
│  │   │   ├─ icon_stance_balanced.svg
│  │   │   └─ icon_stance_aggressive.svg
│  │   ├─ trigrams/
│  │   │   ├─ icon_trigram_1.svg
│  │   │   ├─ icon_trigram_2.svg
│  │   │   └─ … up to icon_trigram_8.svg
│  │   └─ tooltip_arrow.png
│  └─ hud/
│      ├─ hud_health_bar.png
│      └─ hud_pain_bar.png
│
├─ vfx/
│  ├─ animations/
│  │   ├─ anim_logo_pulse.json
│  │   ├─ anim_menu_slide_0.png … anim_menu_slide_7.png
│  │   ├─ anim_strike_impact_0.png … anim_strike_impact_15.png
│  │   └─ anim_finisher_musa_0.png … anim_finisher_musa_11.png
│  ├─ particles/
│  │   ├─ vfx_dust_puff.png
│  │   ├─ vfx_blood_splatter.png
│  │   └─ confetti_sprites.png
│  └─ shaders/
│      ├─ vfx_impact_ring.png
│      ├─ vfx_neon_glow.png
│      └─ vfx_critical_flash.png
│
├─ visual/
│  ├─ bg/
│  │   ├─ intro/
│  │   │   ├─ intro_bg_loop.png
│  │   │   └─ mainmenu_foreground_overlay.png
│  │   └─ dojang/
│  │       ├─ dojang_floor_tex.png
│  │       └─ dojang_wall_tex.png
│  └─ overlays/
│      ├─ vital_region_head.png
│      ├─ vital_region_neck.png
│      ├─ vital_region_torso.png
│      ├─ vital_region_arms.png
│      ├─ vital_region_chest.png
│      └─ vital_region_legs.png
│
└─ public/
   └─ assets/
       └─ audio/
           ├─ music/
           │   ├─ intro_theme.webm
           │   ├─ combat_theme.webm
           │   ├─ combat_theme_geon.webm
           │   ├─ training_theme.webm
           │   ├─ meditation_theme.webm
           │   ├─ victory_theme.webm
           │   ├─ underground_rave_theme.webm
           │   └─ ambient_loop.webm
           └─ sfx/
               ├─ ambient/
               │   ├─ dojang_ambience.webm
               │   ├─ wind_effect.webm
               │   └─ dojo_crowd.webm
               ├─ attacks/
               │   ├─ attack_punch_light.webm
               │   ├─ attack_punch_medium.webm
               │   ├─ attack_kick_heavy.webm
               │   ├─ attack_light.webm
               │   ├─ attack_medium.webm
               │   ├─ attack_critical.webm
               │   ├─ attack_special_geon.webm
               │   ├─ dodge.webm
               │   ├─ block_success.webm
               │   ├─ block_break.webm
               │   └─ perfect_strike.webm
               ├─ hit/
               │   ├─ hit_light.webm
               │   ├─ hit_medium.webm
               │   ├─ hit_heavy.webm
               │   ├─ hit_critical.webm
               │   ├─ hit_flesh.webm
               │   └─ hit_block.webm
               ├─ combo/
               │   ├─ combo_buildup.webm
               │   ├─ combo_finish.webm
               │   └─ energy_pulse.webm
               ├─ match/
               │   ├─ match_start.webm
               │   ├─ countdown.webm
               │   ├─ match_end.webm
               │   ├─ victory.webm
               │   └─ defeat.webm
               ├─ movement/
               │   ├─ footstep.webm
               │   └─ stance_change.webm
               ├─ ki/
               │   ├─ ki_charge.webm
               │   └─ ki_release.webm
               ├─ stamina/
               │   └─ stamina_depleted.webm
               ├─ health/
               │   └─ health_low.webm
               └─ ui/
                   ├─ menu_click.webm
                   ├─ menu_navigate.webm
                   ├─ menu_select.webm
                   ├─ menu_hover.webm
                   └─ menu_back.webm
```

---

## 1. Backgrounds & Environments

### 1.1 Intro / Main Menu Background

- **Asset Name:** `intro_bg_loop.png`

  - **Description:** A seamless 1920×1080 loopable tile of a rain‐slicked concrete floor with neon pipes and drifting data‐line grid.
  - **File Format:** PNG (plus normal/roughness if you want subtle 3D lighting on flat sprites, but PNG is usually enough).
  - **Folder:** `assets/visual/bg/intro/`
  - **Visual Style Notes:**

    - Base color: Obsidian (`#0A0F12`) with subtle film‐grain overlay.
    - Neon accents: teal/cyan reflections on puddles, flickering Hangul glyphs on pipes.
    - Animation: small “rain drip” loop in shader or flipbook.

- **Asset Name:** `mainmenu_foreground_overlay.png`

  - **Description:** A semi‐transparent obsidian vignette (20px “soft edge”) to darken screen edges, helping text/logo pop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/overlays/`
  - **Usage:** Placed above `intro_bg_loop` to darken corners.

### 1.2 Dojang / Training Hall Background

- **Asset Name:** `dojang_floor_tex.png`

  - **Description:** 2048×2048 PBR‐style image of matte‐black tatami mats, with subtle water puddle normals (if you want dynamic reflections).
  - **File Format:** PNG (or PNG + normal/roughness if desired)
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - Tileable so it can fill any resolution.
    - Slight neon cyan reflections at edges where wall meets floor.

- **Asset Name:** `dojang_wall_tex.png`

  - **Description:** 1024×1024 tile of corrugated metal with pipelines and emissive Hangul trigrams (☰, ☲, etc.) behind semi‐opaque panels.
  - **File Format:** PNG (with separate emissive mask channel if you plan to animate neon flicker).
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - The emissive mask will let you “pulse” each trigram glyph via a simple shader or a flicker sprite.

- **Asset Name:** `dojang_wall_neon_flicker.png` (optional flipbook)

  - **Description:** A small flipbook (e.g. 4 frames at 256×256) showing a neon glyph flicker (cycle through 0%, 50%, 100% brightness).
  - **File Format:** PNG sprite sheet
  - **Folder:** `assets/vfx/animations/`

- **Asset Name:** `training_console_model.png`

  - **Description:** 512×512 stylized grayscale sprite of a holo‐console (flat sprite) with cyan emissive accents (for real‐time data display).
  - **File Format:** PNG
  - **Folder:** `assets/visual/props/`
  - **Notes:** Use this as a static background element; you can overlay bitmaps of gauge bars, or simply let the console glow.

- **Asset Name:** `stance_pad_circle.png`

  - **Description:** 256×256 semi‐transparent PNG of a glowing floor circle. Pulses from 0 → 100% opacity in a 1s loop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/props/`

---

## 2. UI Icons & HUD Elements

### 2.1 Stance Icons

Each icon is a 64×64 px SVG (so it scales crisply). We’ll load them as textures in Pixi and tint/animate as needed.

1. **`icon_stance_defensive.svg`**

   - Outline style in Slate Gray (`#2E3538`) when inactive.
   - Filled with Teal Neon (`#00FFC8`) + soft glow when active.

2. **`icon_stance_balanced.svg`**

   - Outline in Slate Gray; filled with Teal Neon on hover/active.

3. **`icon_stance_aggressive.svg`**

   - Outline in Slate Gray; filled with Crimson (`#FF0044`) on “charged” or “ready” state, or Teal Neon when selected.

   **Folder:** `assets/ui/icons/stances/`

### 2.2 Trigram Icons

- **File Names:**

  ```
  icon_trigram_1.svg
  icon_trigram_2.svg
  …
  icon_trigram_8.svg
  ```

- **Each icon:** 48×48 px, dark background (Gunmetal `#424A50`) with the trigram glyph in Teal Neon.
- **States:**

  - Inactive: no glow, just basic fill.
  - Active: slight outer glow + subtle 1.1× scale “pulse.”
  - Hover: 1.05× scale + quick glow (0.2 s).

  **Folder:** `assets/ui/icons/trigrams/`

### 2.3 HUD Bars & Overlays

- **`hud_health_bar.png`** (800×32 px PNG)

  - 10 segmented blocks. Each filled segment is Cyan Glow (`#1BE7FF`); empty is Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`hud_pain_bar.png`** (800×16 px PNG)

  - 10 segments. Filled segments are Crimson (`#FF0044`); empty Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`ui_button_start_idle.png` & `ui_button_start_hover.png`** (256×64 px each)

  - Idle: Slate Gray panel with “▶ Start Combat” in Hangul+English.
  - Hover: Underline in Teal Neon + icon (“▶”) glows.
  - **Folder:** `assets/ui/buttons/`

- **`ui_panel_slate.png`** (1024×512 px)

  - A semi-opaque Slate Gray panel (70% opacity) with a subtle noise texture.
  - **Folder:** `assets/ui/panels/`

- **`tooltip_arrow.png`** (32×32 px PNG)

  - Small triangle arrow in Cyan Glow for tooltips.
  - **Folder:** `assets/ui/tooltips/`

---

## 3. Technique Animations (AnimatedSprite Sprite Sheets)

Any time you see code like:

```js
await Assets.load("path/to/spritesheet.json");
const frames = [];
for (let i = 0; i < N; i++) {
  frames.push(Texture.from(`frame${i}.png`));
}
const anim = new AnimatedSprite(frames);
```

…you need a **sprite sheet JSON** + **corresponding PNG atlas** for each “technique.” Below is a minimal required set of technique animations:

### 3.1 Light Strike Animation (All Archetypes)

- **Sprite Sheet JSON:** `strike_light_spritesheet.json`
- **Texture Atlas:** `strike_light_spritesheet.png` (e.g., 512×512 containing all 6 frames laid out in a grid).
- **Frame Count:** 6 frames, each \~128×256 (portrait orientation).
- **Animation Speed:** 0.6 (adjust per archetype).
- **Visual Content:** Character winds up → quick punch/kick → recoil. No background in atlas (transparent).
- **Folder:** `assets/characters/animations/techniques/light/`

### 3.2 Medium Strike Animation

- **Sprite Sheet JSON:** `strike_medium_spritesheet.json`
- **Texture Atlas:** `strike_medium_spritesheet.png` (6–8 frames, \~128×256 each).
- **Description:** More wind-up, more impact frames, a small dust puff frame integrated (see VFX).
- **Folder:** `assets/characters/animations/techniques/medium/`

### 3.3 Heavy Strike Animation

- **Sprite Sheet JSON:** `strike_heavy_spritesheet.json`
- **Texture Atlas:** `strike_heavy_spritesheet.png` (8 frames, \~256×256 each).
- **Description:** Big wind-up, slow-mo pause on impact, splash of embedded VFX dust/blood.
- **Folder:** `assets/characters/animations/techniques/heavy/`

### 3.4 Critical Strike / Finisher Animation

- **Sprite Sheet JSON:** `strike_critical_spritesheet.json`
- **Texture Atlas:** `strike_critical_spritesheet.png` (10–12 frames, \~256×256).
- **Description:** Slow-mo bone-breaking blow → flash frame → slowdown.
- **Folder:** `assets/characters/animations/techniques/critical/`

### 3.5 Dodge / Evade Animation

- **Sprite Sheet JSON:** `dodge_spritesheet.json`
- **Texture Atlas:** `dodge_spritesheet.png` (4–6 frames, \~128×256).
- **Description:** Quick sidestep/backflip frames, subtle afterimage.
- **Folder:** `assets/characters/animations/techniques/dodge/`

### 3.6 Block / Parry Animation

- **Sprite Sheet JSON:** `block_spritesheet.json`
- **Texture Atlas:** `block_spritesheet.png` (5 frames, \~128×256).
- **Description:** Character raises arm/weapon to block → recoil if successful.
- **Folder:** `assets/characters/animations/techniques/block/`

### 3.7 Hit Reaction Animation

- **Sprite Sheet JSON:** `hit_reaction_spritesheet.json`
- **Texture Atlas:** `hit_reaction_spritesheet.png` (4 frames, \~128×256).
- **Description:** Character flinches backwards, tinted red on final frame.
- **Folder:** `assets/characters/animations/techniques/hit/`

### 3.8 Finisher Sequence (All Archetypes)

- **Sprite Sheet JSON:** `finisher_musa_spritesheet.json`, `finisher_amsalja_spritesheet.json`, etc.
- **Texture Atlas:** `finisher_musa_spritesheet.png` (12 frames, \~256×256), etc.
- **Description:** A multi-stage “cinematic” finisher (pause → bone crushing → slow fade).
- **Folder:** `assets/characters/animations/finisher/`

---

## 4. Pixi.js Dependencies & Modules Needed

Below is a minimal list of **Pixi.js modules** (from `pixi.js/lib`) that you will rely on to load, animate, and render everything above. In your `package.json`, you’ve already installed `pixi.js`. At runtime, you’ll import exactly the pieces you use:

```ts
import {
  Application,
  TickerPlugin, // core ticker
  ResizePlugin, // auto resizes to window
  Assets, // for loading JSON/PNG atlases
  Texture,
  Sprite,
  AnimatedSprite,
  Container,
  TilingSprite, // if you want parallax/tiled backgrounds
  Loader, // older API if you prefer Loader instead of Assets
} from "pixi.js";
```

- **`Application`** (from `app/Application.mjs`)

  - Creates the Pixi canvas, WebGL context, stage, etc.

- **`TickerPlugin`** & **`ResizePlugin`**

  - Ensures your app’s ticker (main game loop) and auto-resize functionality.

- **`Assets`** (from `assets/Assets.mjs`)

  - The new recommended loader for JSON sprite sheets, PNGs, audio, etc.
  - Example:

    ```ts
    await Assets.load(
      "assets/characters/animations/techniques/light/strike_light_spritesheet.json"
    );
    ```

- **`Texture`** (from `rendering/texture/Texture.mjs`)

  - Create textures from loaded assets:

    ```ts
    const frameTex = Texture.from("strike_light_000.png");
    ```

- **`Sprite`** & **`AnimatedSprite`** (from `scene/sprite/Sprite.mjs` & `scene/sprite-animated/AnimatedSprite.mjs`)

  - `Sprite` for static images (UI icons, backgrounds).
  - `AnimatedSprite` for flipbook animations (techniques, VFX).

- **`Container`** (from `scene/container/Container.mjs`)

  - Use a parent `Container` for grouping layers:

    - `backgroundContainer`
    - `characterContainer`
    - `uiContainer`
    - `vfxContainer`

- **`TilingSprite`** (from `scene/sprite-tiling/TilingSprite.mjs`)

  - If you want to scroll/loop the `intro_bg_loop.png` or tile `dojang_floor_tex.png` seamlessly across a larger stage.

- **`Loader`** (from `assets/loader/Loader.mjs`)

  - If you prefer the older PIXI.Loader API to Assets. Both are possible; `Assets` is recommended for newer Pixi versions.

- **`Filter`** / **`BlurFilter`** / **`DisplacementFilter`** (from `filters/defaults/*`)

  - Useful for adding real-time blur afterimages (for `dodge`), screen shakes, or ripples when powering up Ki (`ki_charge`).

---

## 5. Directory Structure & Final Checklist

Below is a **consolidated folder structure** showing where each of the above assets live. This is what your repo (or build pipeline) needs before you start coding the Pixi setup:

```
/assets
├─ characters/
│  ├─ animations/
│  │   ├─ techniques/
│  │   │   ├─ light/
│  │   │   │   ├─ strike_light_spritesheet.json
│  │   │   │   └─ strike_light_spritesheet.png
│  │   │   ├─ medium/
│  │   │   │   ├─ strike_medium_spritesheet.json
│  │   │   │   └─ strike_medium_spritesheet.png
│  │   │   ├─ heavy/
│  │   │   │   ├─ strike_heavy_spritesheet.json
│  │   │   │   └─ strike_heavy_spritesheet.png
│  │   │   ├─ critical/
│  │   │   │   ├─ strike_critical_spritesheet.json
│  │   │   │   └─ strike_critical_spritesheet.png
│  │   │   ├─ dodge/
│  │   │   │   ├─ dodge_spritesheet.json
│  │   │   │   └─ dodge_spritesheet.png
│  │   │   ├─ block/
│  │   │   │   ├─ block_spritesheet.json
│  │   │   │   └─ block_spritesheet.png
│  │   │   └─ hit/
│  │   │       ├─ hit_reaction_spritesheet.json
│  │   │       └─ hit_reaction_spritesheet.png
│  │   └─ finisher/
│  │       ├─ musa_finisher_spritesheet.json
│  │       └─ musa_finisher_spritesheet.png
│  │       ├─ amsalja_finisher_spritesheet.json
│  │       └─ amsalja_finisher_spritesheet.png
│  │       └─ … (one per archetype)
│  └─ portraits/
│      ├─ portrait_musa.png
│      ├─ portrait_amsalja.png
│      └─ … (other archetypes)
│
├─ fonts/
│  ├─ BlackTrigram-Hangul.woff2
│  ├─ NotoSansKR-Regular.woff2
│  └─ Roboto-Regular.woff2
│
├─ i18n/
│  ├─ ko.json
│  └─ en.json
│
├─ props/
│  ├─ training_console_model.png
│  ├─ stance_pad_circle.png
│  └─ dummy_target_overlay.svg
│
├─ shaders/
│  ├─ rim_light.shader
│  ├─ blood_decal.shader
│  └─ neon_flicker.shader
│
├─ ui/
│  ├─ buttons/
│  │   ├─ ui_button_start_idle.png
│  │   └─ ui_button_start_hover.png
│  ├─ icons/
│  │   ├─ stances/
│  │   │   ├─ icon_stance_defensive.svg
│  │   │   ├─ icon_stance_balanced.svg
│  │   │   └─ icon_stance_aggressive.svg
│  │   ├─ trigrams/
│  │   │   ├─ icon_trigram_1.svg
│  │   │   ├─ icon_trigram_2.svg
│  │   │   └─ … up to icon_trigram_8.svg
│  │   └─ tooltip_arrow.png
│  └─ hud/
│      ├─ hud_health_bar.png
│      └─ hud_pain_bar.png
│
├─ vfx/
│  ├─ animations/
│  │   ├─ anim_logo_pulse.json
│  │   ├─ anim_menu_slide_0.png … anim_menu_slide_7.png
│  │   ├─ anim_strike_impact_0.png … anim_strike_impact_15.png
│  │   └─ anim_finisher_musa_0.png … anim_finisher_musa_11.png
│  ├─ particles/
│  │   ├─ vfx_dust_puff.png
│  │   ├─ vfx_blood_splatter.png
│  │   └─ confetti_sprites.png
│  └─ shaders/
│      ├─ vfx_impact_ring.png
│      ├─ vfx_neon_glow.png
│      └─ vfx_critical_flash.png
│
├─ visual/
│  ├─ bg/
│  │   ├─ intro/
│  │   │   ├─ intro_bg_loop.png
│  │   │   └─ mainmenu_foreground_overlay.png
│  │   └─ dojang/
│  │       ├─ dojang_floor_tex.png
│  │       └─ dojang_wall_tex.png
│  └─ overlays/
│      ├─ vital_region_head.png
│      ├─ vital_region_neck.png
│      ├─ vital_region_torso.png
│      ├─ vital_region_arms.png
│      ├─ vital_region_chest.png
│      └─ vital_region_legs.png
│
└─ public/
   └─ assets/
       └─ audio/
           ├─ music/
           │   ├─ intro_theme.webm
           │   ├─ combat_theme.webm
           │   ├─ combat_theme_geon.webm
           │   ├─ training_theme.webm
           │   ├─ meditation_theme.webm
           │   ├─ victory_theme.webm
           │   ├─ underground_rave_theme.webm
           │   └─ ambient_loop.webm
           └─ sfx/
               ├─ ambient/
               │   ├─ dojang_ambience.webm
               │   ├─ wind_effect.webm
               │   └─ dojo_crowd.webm
               ├─ attacks/
               │   ├─ attack_punch_light.webm
               │   ├─ attack_punch_medium.webm
               │   ├─ attack_kick_heavy.webm
               │   ├─ attack_light.webm
               │   ├─ attack_medium.webm
               │   ├─ attack_critical.webm
               │   ├─ attack_special_geon.webm
               │   ├─ dodge.webm
               │   ├─ block_success.webm
               │   ├─ block_break.webm
               │   └─ perfect_strike.webm
               ├─ hit/
               │   ├─ hit_light.webm
               │   ├─ hit_medium.webm
               │   ├─ hit_heavy.webm
               │   ├─ hit_critical.webm
               │   ├─ hit_flesh.webm
               │   └─ hit_block.webm
               ├─ combo/
               │   ├─ combo_buildup.webm
               │   ├─ combo_finish.webm
               │   └─ energy_pulse.webm
               ├─ match/
               │   ├─ match_start.webm
               │   ├─ countdown.webm
               │   ├─ match_end.webm
               │   ├─ victory.webm
               │   └─ defeat.webm
               ├─ movement/
               │   ├─ footstep.webm
               │   └─ stance_change.webm
               ├─ ki/
               │   ├─ ki_charge.webm
               │   └─ ki_release.webm
               ├─ stamina/
               │   └─ stamina_depleted.webm
               ├─ health/
               │   └─ health_low.webm
               └─ ui/
                   ├─ menu_click.webm
                   ├─ menu_navigate.webm
                   ├─ menu_select.webm
                   ├─ menu_hover.webm
                   └─ menu_back.webm
```

---

## 1. Backgrounds & Environments

### 1.1 Intro / Main Menu Background

- **Asset Name:** `intro_bg_loop.png`

  - **Description:** A seamless 1920×1080 loopable tile of a rain‐slicked concrete floor with neon pipes and drifting data‐line grid.
  - **File Format:** PNG (plus normal/roughness if you want subtle 3D lighting on flat sprites, but PNG is usually enough).
  - **Folder:** `assets/visual/bg/intro/`
  - **Visual Style Notes:**

    - Base color: Obsidian (`#0A0F12`) with subtle film‐grain overlay.
    - Neon accents: teal/cyan reflections on puddles, flickering Hangul glyphs on pipes.
    - Animation: small “rain drip” loop in shader or flipbook.

- **Asset Name:** `mainmenu_foreground_overlay.png`

  - **Description:** A semi‐transparent obsidian vignette (20px “soft edge”) to darken screen edges, helping text/logo pop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/overlays/`
  - **Usage:** Placed above `intro_bg_loop` to darken corners.

### 1.2 Dojang / Training Hall Background

- **Asset Name:** `dojang_floor_tex.png`

  - **Description:** 2048×2048 PBR‐style image of matte‐black tatami mats, with subtle water puddle normals (if you want dynamic reflections).
  - **File Format:** PNG (or PNG + normal/roughness if desired)
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - Tileable so it can fill any resolution.
    - Slight neon cyan reflections at edges where wall meets floor.

- **Asset Name:** `dojang_wall_tex.png`

  - **Description:** 1024×1024 tile of corrugated metal with pipelines and emissive Hangul trigrams (☰, ☲, etc.) behind semi‐opaque panels.
  - **File Format:** PNG (with separate emissive mask channel if you plan to animate neon flicker).
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - The emissive mask will let you “pulse” each trigram glyph via a simple shader or a flicker sprite.

- **Asset Name:** `dojang_wall_neon_flicker.png` (optional flipbook)

  - **Description:** A small flipbook (e.g. 4 frames at 256×256) showing a neon glyph flicker (cycle through 0%, 50%, 100% brightness).
  - **File Format:** PNG sprite sheet
  - **Folder:** `assets/vfx/animations/`

- **Asset Name:** `training_console_model.png`

  - **Description:** 512×512 stylized grayscale sprite of a holo‐console (flat sprite) with cyan emissive accents (for real‐time data display).
  - **File Format:** PNG
  - **Folder:** `assets/visual/props/`
  - **Notes:** Use this as a static background element; you can overlay bitmaps of gauge bars, or simply let the console glow.

- **Asset Name:** `stance_pad_circle.png`

  - **Description:** 256×256 semi‐transparent PNG of a glowing floor circle. Pulses from 0 → 100% opacity in a 1s loop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/props/`

---

## 2. UI Icons & HUD Elements

### 2.1 Stance Icons

Each icon is a 64×64 px SVG (so it scales crisply). We’ll load them as textures in Pixi and tint/animate as needed.

1. **`icon_stance_defensive.svg`**

   - Outline style in Slate Gray (`#2E3538`) when inactive.
   - Filled with Teal Neon (`#00FFC8`) + soft glow when active.

2. **`icon_stance_balanced.svg`**

   - Outline in Slate Gray; filled with Teal Neon on hover/active.

3. **`icon_stance_aggressive.svg`**

   - Outline in Slate Gray; filled with Crimson (`#FF0044`) on “charged” or “ready” state, or Teal Neon when selected.

   **Folder:** `assets/ui/icons/stances/`

### 2.2 Trigram Icons

- **File Names:**

  ```
  icon_trigram_1.svg
  icon_trigram_2.svg
  …
  icon_trigram_8.svg
  ```

- **Each icon:** 48×48 px, dark background (Gunmetal `#424A50`) with the trigram glyph in Teal Neon.
- **States:**

  - Inactive: no glow, just basic fill.
  - Active: slight outer glow + subtle 1.1× scale “pulse.”
  - Hover: 1.05× scale + quick glow (0.2 s).

  **Folder:** `assets/ui/icons/trigrams/`

### 2.3 HUD Bars & Overlays

- **`hud_health_bar.png`** (800×32 px PNG)

  - 10 segmented blocks. Each filled segment is Cyan Glow (`#1BE7FF`); empty is Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`hud_pain_bar.png`** (800×16 px PNG)

  - 10 segments. Filled segments are Crimson (`#FF0044`); empty Slate Gray.
  - **Folder:** `assets/ui/hud/`

- **`ui_button_start_idle.png` & `ui_button_start_hover.png`** (256×64 px each)

  - Idle: Slate Gray panel with “▶ Start Combat” in Hangul+English.
  - Hover: Underline in Teal Neon + icon (“▶”) glows.
  - **Folder:** `assets/ui/buttons/`

- **`ui_panel_slate.png`** (1024×512 px)

  - A semi-opaque Slate Gray panel (70% opacity) with a subtle noise texture.
  - **Folder:** `assets/ui/panels/`

- **`tooltip_arrow.png`** (32×32 px PNG)

  - Small triangle arrow in Cyan Glow for tooltips.
  - **Folder:** `assets/ui/tooltips/`

---

## 3. Technique Animations (AnimatedSprite Sprite Sheets)

Any time you see code like:

```js
await Assets.load("path/to/spritesheet.json");
const frames = [];
for (let i = 0; i < N; i++) {
  frames.push(Texture.from(`frame${i}.png`));
}
const anim = new AnimatedSprite(frames);
```

…you need a **sprite sheet JSON** + **corresponding PNG atlas** for each “technique.” Below is a minimal required set of technique animations:

### 3.1 Light Strike Animation (All Archetypes)

- **Sprite Sheet JSON:** `strike_light_spritesheet.json`
- **Texture Atlas:** `strike_light_spritesheet.png` (e.g., 512×512 containing all 6 frames laid out in a grid).
- **Frame Count:** 6 frames, each \~128×256 (portrait orientation).
- **Animation Speed:** 0.6 (adjust per archetype).
- **Visual Content:** Character winds up → quick punch/kick → recoil. No background in atlas (transparent).
- **Folder:** `assets/characters/animations/techniques/light/`

### 3.2 Medium Strike Animation

- **Sprite Sheet JSON:** `strike_medium_spritesheet.json`
- **Texture Atlas:** `strike_medium_spritesheet.png` (6–8 frames, \~128×256 each).
- **Description:** More wind-up, more impact frames, a small dust puff frame integrated (see VFX).
- **Folder:** `assets/characters/animations/techniques/medium/`

### 3.3 Heavy Strike Animation

- **Sprite Sheet JSON:** `strike_heavy_spritesheet.json`
- **Texture Atlas:** `strike_heavy_spritesheet.png` (8 frames, \~256×256 each).
- **Description:** Big wind-up, slow-mo pause on impact, splash of embedded VFX dust/blood.
- **Folder:** `assets/characters/animations/techniques/heavy/`

### 3.4 Critical Strike / Finisher Animation

- **Sprite Sheet JSON:** `strike_critical_spritesheet.json`
- **Texture Atlas:** `strike_critical_spritesheet.png` (10–12 frames, \~256×256).
- **Description:** Slow-mo bone-breaking blow → flash frame → slowdown.
- **Folder:** `assets/characters/animations/techniques/critical/`

### 3.5 Dodge / Evade Animation

- **Sprite Sheet JSON:** `dodge_spritesheet.json`
- **Texture Atlas:** `dodge_spritesheet.png` (4–6 frames, \~128×256).
- **Description:** Quick sidestep/backflip frames, subtle afterimage.
- **Folder:** `assets/characters/animations/techniques/dodge/`

### 3.6 Block / Parry Animation

- **Sprite Sheet JSON:** `block_spritesheet.json`
- **Texture Atlas:** `block_spritesheet.png` (5 frames, \~128×256).
- **Description:** Character raises arm/weapon to block → recoil if successful.
- **Folder:** `assets/characters/animations/techniques/block/`

### 3.7 Hit Reaction Animation

- **Sprite Sheet JSON:** `hit_reaction_spritesheet.json`
- **Texture Atlas:** `hit_reaction_spritesheet.png` (4 frames, \~128×256).
- **Description:** Character flinches backwards, tinted red on final frame.
- **Folder:** `assets/characters/animations/techniques/hit/`

### 3.8 Finisher Sequence (All Archetypes)

- **Sprite Sheet JSON:** `finisher_musa_spritesheet.json`, `finisher_amsalja_spritesheet.json`, etc.
- **Texture Atlas:** `finisher_musa_spritesheet.png` (12 frames, \~256×256), etc.
- **Description:** A multi-stage “cinematic” finisher (pause → bone crushing → slow fade).
- **Folder:** `assets/characters/animations/finisher/`

---

## 4. Pixi.js Dependencies & Modules Needed

Below is a minimal list of **Pixi.js modules** (from `pixi.js/lib`) that you will rely on to load, animate, and render everything above. In your `package.json`, you’ve already installed `pixi.js`. At runtime, you’ll import exactly the pieces you use:

```ts
import {
  Application,
  TickerPlugin, // core ticker
  ResizePlugin, // auto resizes to window
  Assets, // for loading JSON/PNG atlases
  Texture,
  Sprite,
  AnimatedSprite,
  Container,
  TilingSprite, // if you want parallax/tiled backgrounds
  Loader, // older API if you prefer Loader instead of Assets
} from "pixi.js";
```

- **`Application`** (from `app/Application.mjs`)

  - Creates the Pixi canvas, WebGL context, stage, etc.

- **`TickerPlugin`** & **`ResizePlugin`**

  - Ensures your app’s ticker (main game loop) and auto-resize functionality.

- **`Assets`** (from `assets/Assets.mjs`)

  - The new recommended loader for JSON sprite sheets, PNGs, audio, etc.
  - Example:

    ```ts
    await Assets.load(
      "assets/characters/animations/techniques/light/strike_light_spritesheet.json"
    );
    ```

- **`Texture`** (from `rendering/texture/Texture.mjs`)

  - Create textures from loaded assets:

    ```ts
    const frameTex = Texture.from("strike_light_000.png");
    ```

- **`Sprite`** & **`AnimatedSprite`** (from `scene/sprite/Sprite.mjs` & `scene/sprite-animated/AnimatedSprite.mjs`)

  - `Sprite` for static images (UI icons, backgrounds).
  - `AnimatedSprite` for flipbook animations (techniques, VFX).

- **`Container`** (from `scene/container/Container.mjs`)

  - Use a parent `Container` for grouping layers:

    - `backgroundContainer`
    - `characterContainer`
    - `uiContainer`
    - `vfxContainer`

- **`TilingSprite`** (from `scene/sprite-tiling/TilingSprite.mjs`)

  - If you want to scroll/loop the `intro_bg_loop.png` or tile `dojang_floor_tex.png` seamlessly across a larger stage.

- **`Loader`** (from `assets/loader/Loader.mjs`)

  - If you prefer the older PIXI.Loader API to Assets. Both are possible; `Assets` is recommended for newer Pixi versions.

- **`Filter`** / **`BlurFilter`** / **`DisplacementFilter`** (from `filters/defaults/*`)

  - Useful for adding real-time blur afterimages (for `dodge`), screen shakes, or ripples when powering up Ki (`ki_charge`).

---

## 5. Directory Structure & Final Checklist

Below is a **consolidated folder structure** showing where each of the above assets live. This is what your repo (or build pipeline) needs before you start coding the Pixi setup:

```
/assets
├─ characters/
│  ├─ animations/
│  │   ├─ techniques/
│  │   │   ├─ light/
│  │   │   │   ├─ strike_light_spritesheet.json
│  │   │   │   └─ strike_light_spritesheet.png
│  │   │   ├─ medium/
│  │   │   │   ├─ strike_medium_spritesheet.json
│  │   │   │   └─ strike_medium_spritesheet.png
│  │   │   ├─ heavy/
│  │   │   │   ├─ strike_heavy_spritesheet.json
│  │   │   │   └─ strike_heavy_spritesheet.png
│  │   │   ├─ critical/
│  │   │   │   ├─ strike_critical_spritesheet.json
│  │   │   │   └─ strike_critical_spritesheet.png
│  │   │   ├─ dodge/
│  │   │   │   ├─ dodge_spritesheet.json
│  │   │   │   └─ dodge_spritesheet.png
│  │   │   ├─ block/
│  │   │   │   ├─ block_spritesheet.json
│  │   │   │   └─ block_spritesheet.png
│  │   │   └─ hit/
│  │   │       ├─ hit_reaction_spritesheet.json
│  │   │       └─ hit_reaction_spritesheet.png
│  │   └─ finisher/
│  │       ├─ musa_finisher_spritesheet.json
│  │       └─ musa_finisher_spritesheet.png
│  │       ├─ amsalja_finisher_spritesheet.json
│  │       └─ amsalja_finisher_spritesheet.png
│  │       └─ … (one per archetype)
│  └─ portraits/
│      ├─ portrait_musa.png
│      ├─ portrait_amsalja.png
│      └─ … (other archetypes)
│
├─ fonts/
│  ├─ BlackTrigram-Hangul.woff2
│  ├─ NotoSansKR-Regular.woff2
│  └─ Roboto-Regular.woff2
│
├─ i18n/
│  ├─ ko.json
│  └─ en.json
│
├─ props/
│  ├─ training_console_model.png
│  ├─ stance_pad_circle.png
│  └─ dummy_target_overlay.svg
│
├─ shaders/
│  ├─ rim_light.shader
│  ├─ blood_decal.shader
│  └─ neon_flicker.shader
│
├─ ui/
│  ├─ buttons/
│  │   ├─ ui_button_start_idle.png
│  │   └─ ui_button_start_hover.png
│  ├─ icons/
│  │   ├─ stances/
│  │   │   ├─ icon_stance_defensive.svg
│  │   │   ├─ icon_stance_balanced.svg
│  │   │   └─ icon_stance_aggressive.svg
│  │   ├─ trigrams/
│  │   │   ├─ icon_trigram_1.svg
│  │   │   ├─ icon_trigram_2.svg
│  │   │   └─ … up to icon_trigram_8.svg
│  │   └─ tooltip_arrow.png
│  └─ hud/
│      ├─ hud_health_bar.png
│      └─ hud_pain_bar.png
│
├─ vfx/
│  ├─ animations/
│  │   ├─ anim_logo_pulse.json
│  │   ├─ anim_menu_slide_0.png … anim_menu_slide_7.png
│  │   ├─ anim_strike_impact_0.png … anim_strike_impact_15.png
│  │   └─ anim_finisher_musa_0.png … anim_finisher_musa_11.png
│  ├─ particles/
│  │   ├─ vfx_dust_puff.png
│  │   ├─ vfx_blood_splatter.png
│  │   └─ confetti_sprites.png
│  └─ shaders/
│      ├─ vfx_impact_ring.png
│      ├─ vfx_neon_glow.png
│      └─ vfx_critical_flash.png
│
├─ visual/
│  ├─ bg/
│  │   ├─ intro/
│  │   │   ├─ intro_bg_loop.png
│  │   │   └─ mainmenu_foreground_overlay.png
│  │   └─ dojang/
│  │       ├─ dojang_floor_tex.png
│  │       └─ dojang_wall_tex.png
│  └─ overlays/
│      ├─ vital_region_head.png
│      ├─ vital_region_neck.png
│      ├─ vital_region_torso.png
│      ├─ vital_region_arms.png
│      ├─ vital_region_chest.png
│      └─ vital_region_legs.png
│
└─ public/
   └─ assets/
       └─ audio/
           ├─ music/
           │   ├─ intro_theme.webm
           │   ├─ combat_theme.webm
           │   ├─ combat_theme_geon.webm
           │   ├─ training_theme.webm
           │   ├─ meditation_theme.webm
           │   ├─ victory_theme.webm
           │   ├─ underground_rave_theme.webm
           │   └─ ambient_loop.webm
           └─ sfx/
               ├─ ambient/
               │   ├─ dojang_ambience.webm
               │   ├─ wind_effect.webm
               │   └─ dojo_crowd.webm
               ├─ attacks/
               │   ├─ attack_punch_light.webm
               │   ├─ attack_punch_medium.webm
               │   ├─ attack_kick_heavy.webm
               │   ├─ attack_light.webm
               │   ├─ attack_medium.webm
               │   ├─ attack_critical.webm
               │   ├─ attack_special_geon.webm
               │   ├─ dodge.webm
               │   ├─ block_success.webm
               │   ├─ block_break.webm
               │   └─ perfect_strike.webm
               ├─ hit/
               │   ├─ hit_light.webm
               │   ├─ hit_medium.webm
               │   ├─ hit_heavy.webm
               │   ├─ hit_critical.webm
               │   ├─ hit_flesh.webm
               │   └─ hit_block.webm
               ├─ combo/
               │   ├─ combo_buildup.webm
               │   ├─ combo_finish.webm
               │   └─ energy_pulse.webm
               ├─ match/
               │   ├─ match_start.webm
               │   ├─ countdown.webm
               │   ├─ match_end.webm
               │   ├─ victory.webm
               │   └─ defeat.webm
               ├─ movement/
               │   ├─ footstep.webm
               │   └─ stance_change.webm
               ├─ ki/
               │   ├─ ki_charge.webm
               │   └─ ki_release.webm
               ├─ stamina/
               │   └─ stamina_depleted.webm
               ├─ health/
               │   └─ health_low.webm
               └─ ui/
                   ├─ menu_click.webm
                   ├─ menu_navigate.webm
                   ├─ menu_select.webm
                   ├─ menu_hover.webm
                   └─ menu_back.webm
```

---

## 1. Backgrounds & Environments

### 1.1 Intro / Main Menu Background

- **Asset Name:** `intro_bg_loop.png`

  - **Description:** A seamless 1920×1080 loopable tile of a rain‐slicked concrete floor with neon pipes and drifting data‐line grid.
  - **File Format:** PNG (plus normal/roughness if you want subtle 3D lighting on flat sprites, but PNG is usually enough).
  - **Folder:** `assets/visual/bg/intro/`
  - **Visual Style Notes:**

    - Base color: Obsidian (`#0A0F12`) with subtle film‐grain overlay.
    - Neon accents: teal/cyan reflections on puddles, flickering Hangul glyphs on pipes.
    - Animation: small “rain drip” loop in shader or flipbook.

- **Asset Name:** `mainmenu_foreground_overlay.png`

  - **Description:** A semi‐transparent obsidian vignette (20px “soft edge”) to darken screen edges, helping text/logo pop.
  - **File Format:** PNG (alpha)
  - **Folder:** `assets/visual/overlays/`
  - **Usage:** Placed above `intro_bg_loop` to darken corners.

### 1.2 Dojang / Training Hall Background

- **Asset Name:** `dojang_floor_tex.png`

  - **Description:** 2048×2048 PBR‐style image of matte‐black tatami mats, with subtle water puddle normals (if you want dynamic reflections).
  - **File Format:** PNG (or PNG + normal/roughness if desired)
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - Tileable so it can fill any resolution.
    - Slight neon cyan reflections at edges where wall meets floor.

- **Asset Name:** `dojang_wall_tex.png`

  - **Description:** 1024×1024 tile of corrugated metal with pipelines and emissive Hangul trigrams (☰, ☲, etc.) behind semi‐opaque panels.
  - **File Format:** PNG (with separate emissive mask channel if you plan to animate neon flicker).
  - **Folder:** `assets/visual/bg/dojang/`
  - **Style Notes:**

    - The emissive mask will let you “pulse” each trigram glyph via a simple shader or a flicker sprite.

- **Asset Name:** `dojang_wall_neon_flicker.png` (optional flipbook)

  - **Description:** A small flipbook (e.g. 4 frames at 256×256) showing a neon glyph flicker (cycle through 0%, 50%, 100% brightness).
  - **File Format:** PNG sprite sheet
  - **Folder:** `assets/vfx/animations/`

- **Asset Name:** `training_console_model.png`

  - **Description:** 512×512 stylized grayscale sprite of a holo‐console (flat sprite) with cyan emissive accents (for real‐time data display).
  - **File Format:** PNG
