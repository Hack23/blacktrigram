# Black Trigram (흑괘) - AI Spritesheet Generation Guidelines

## Overview

This document provides comprehensive guidelines for generating all spritesheet assets for Black Trigram, a 2D realistic precision combat simulator featuring Korean martial arts and cyberpunk aesthetics.

## Core Design Principles

### 1. Cultural Authenticity

- **Korean Martial Arts Foundation**: All characters based on traditional Korean fighting styles
- **Respectful Representation**: Honor Korean culture and martial arts heritage
- **Bilingual Integration**: Korean terminology with English translations
- **Traditional Elements**: Include authentic Korean martial arts uniform elements

### 2. Combat Realism

- **Anatomical Accuracy**: Precise targeting of 70+ vital points
- **Realistic Physics**: Authentic body mechanics and combat responses
- **Medical Accuracy**: Real physiological effects (fractures, nerve damage, circulation disruption)
- **Technique Authenticity**: Based on actual Korean martial arts principles

### 3. Cyberpunk Korean Aesthetic

- **Traditional + Future**: Korean culture meets cyberpunk technology
- **Neon Integration**: Subtle cyberpunk elements without overwhelming tradition
- **Color Harmony**: Korean traditional colors with cyberpunk accents
- **Tech Enhancement**: Subtle technological augmentation, not full sci-fi

## Technical Specifications

### Spritesheet Requirements

```
Target Frame Cell: 64x128 (portrait – full body)
Canvas Packing: Grid or tightly packed atlas; avoid overlapping limbs outside cell bounds
Color Space: sRGB, high contrast readability
Perspective: Orthographic / neutral side-front blend (no dramatic foreshortening)
Lighting: Consistent key light (cool cyan rim) + soft fill (neutral) + subtle emissive accents
Background: Transparent (alpha) or flat #000000 for easy chroma isolation
Outline: No thick cartoon outlines; allow subtle rim glow for cyberpunk readability
Palette Priority: Korean traditional base + high-tech neon accent (cyan, magenta, amber)
Anatomy: Realistic human proportions (approx 7–7.5 heads), grounded biomechanics
Frame Count Targets:
  Idle: 4
  Walk: 4–6 (loopable)
  Run (if produced): 6–8
  Attack (per trigram specialization): 6
  Stance Loop: 2–4
  Hit/Impact: 3–4 (non-loop)
  Defend/Block: 2–3
  Special / Technique: windup 2–3, execution 2–3, recovery 2–2
File Naming: {archetype}_{action}_{direction|stance}_{frameIndex}
Directions (8-way): north, northeast, east, southeast, south, southwest, west, northwest
Trigram Stances (romanized lowercase): geon, tae, li, jin, son, gam, gan, gon
Avoid: motion blur baked into frames; keep silhouettes crisp for runtime interpolation
```

### Naming Conventions

```
Archetypes: musa, amsalja, hacker, jeongbo, jojik
Example: musa_attack_geon_0, hacker_idle_south_3
No spaces; underscores only; zero-based frame indices
```

### Style Balance (Realistic Cyberpunk Priority)

- Realistic fabric folds, tactical seams, subtle reinforced joints
- Cybernetic / wearable tech as modular overlays (HUD lenses, neural cuffs, haptic forearm bands) – never full sci-fi exosuits
- Korean cultural motifs: subtle hanbok panel seam geometry, trigram glyph micro-etching, color blocking referencing 오방색
- Weathering: edge abrasion, micro-scuffs, light particulate grime; keep readability

### Animation Cohesion

- Center of Mass stability: vertical drift < 4px across idle loop
- Attack arcs should show anticipation → action → follow-through silhouettes
- Stance loops minimal lateral jitter; maintain anchor (x: center, y: foot midpoint horizon)

### Frame Differentiation

- Prioritize silhouette readability over micro detail changes
- Use accent lighting shifts & limb displacement to imply motion
- Maintain consistent limb length and joint alignment

### Layer / Detail Strategy

- Primary Pass: clean anatomy + clothing base
- Secondary Pass: tech augmentation, emissive seams, stance-specific energy subtle glows
- Tertiary Pass: optional atmospheric particles (kept minimal for clean extraction)

### Emissive / FX Discipline

- Limit glow spread to 2–4px feather
- Distinct color logic:
  - Geon (Heaven): crisp pale electric white-blue micro arcs
  - Jin (Thunder): staccato cyan pulses + micro plasma sparks
  - Li (Fire / Nerve): fine orange-amber neural filament flickers
  - Son (Wind / Flow): trailing faint teal motion wisps
  - Gam (Water / Adapt): subdued dark blue pulse gradients
  - Gan (Mountain / Defense): static, muted basaltic teal edge
  - Gon (Earth / Ground): low amber grounding resonance
  - Tae (Lake / Fluid): soft reflective sheen shifts

### Negative Content (Hard Exclusions)

```
NO: gore, blood splatter, dismemberment, firearms, corporate logos, copyrighted logos, religious symbols, nationalistic propaganda, anime chibi forms, exaggerated cartoon proportions, huge shoulder pads, mecha armor, floating UI holograms covering anatomy, blurred smear frames, camera tilt, dynamic perspective warping
```

### Universal Negative Prompt Snippet

```
low quality, jpeg artifacts, blur, bloom overflow, overexposed, underexposed, duplicate limbs, distorted anatomy, extra fingers, missing fingers, broken joints, melted shapes, cartoon, anime, chibi, watermark, logo, text overlay, weapon clutter, heavy sci-fi exosuit, thick outlines, fisheye, perspective distortion
```

### Multi-Model Prompt Strategy

Provide layered prompt blocks:

1. Context Block (immutable core identity + aesthetic)
2. Technical Block (resolution, framing, cell integrity)
3. Motion / Action Block (per animation)
4. Style Block (realistic cyberpunk + Korean martial arts infusion)
5. Negative Block (model-specific)
6. Consistency Anchor (color, lighting, proportions)

### Model-Specific Notes

OpenAI gpt-image:

- Responds well to explicit camera & lighting directives
- Prefers single cohesive instruction paragraph + bullet style clarifiers

AWS Bedrock Titan Image:

- Benefits from clear structural segmentation (Context:, Style:, Technical:, Exclude:)
- Handles realism & layered clothing if avoided ambiguous metaphors

AWS Bedrock Stability SDXL:

- Strong with stylized realism; rein in over-saturation
- Provide “DO NOT” block to constrain excess glow / distortion

### Consistency Anchor Tokens

Use a short archetype token phrase repeated lightly across related prompts, e.g.:

```
Consistency Anchor: "musa disciplined azure striker"
```

Keep anchor stable across all prompts for that archetype set.

### Reusable Prompt Macros

```
{CELL_SPEC} = full body, centered, entire figure fits inside 64x128 cell, neutral orthographic, transparent background
{LIGHTING_CORE} = cinematic cool key light + subtle cyan rim + soft neutral fill
{REALISM} = realistic human anatomy, proportionate limbs, natural joints
```

### Example Macro Assembly

```
{CONTEXT}: Traditional cyberpunk Korean warrior (무사) – disciplined strength
{CELL_SPEC}, idle loop frame {frameIndex}, minimal vertical drift, {LIGHTING_CORE}, {REALISM}
Clothing: reinforced martial jacket with subtle hanbok panel geometry, cybernetic forearm haptic bands
Accents: controlled geon stance micro electric filaments, restrained
```

### Evaluation Checklist

- Silhouette stable across loop
- Limb continuity & anchor alignment
- Palette coherent with archetype spec
- No stray pixels outside bounds
- Emissive accents consistent brightness

### Output QA Tips

- Overlay frames to detect jitter
- Histogram check for overblown whites
- Palette audit: avoid accidental neon rainbow

### Export Recommendations

- PNG sequence → TexturePacker (trim disabled for now to keep uniform anchors)
- Preserve file naming to align with runtime loader

### Master Template Blocks (Copy/Paste)

```
[CONTEXT BLOCK]
[TECHNICAL BLOCK]
[STYLE BLOCK]
[ACTION VARIANT]
[NEGATIVE BLOCK]
[CONSISTENCY ANCHOR]
```

Use these patterns in each archetype guide.

흑괘의 길을 걸어라

### Automation & Pipeline (Orchestrated Generation)

Use the coordinator script to expand Action Lines into per‑frame image generations.

Command:

```
npx tsx scripts/generate_archetype_sprites.ts <archetype> [provider=openai] [--actions=CSV] [--out=dir] [--size=1024x1024] [--concurrency=2] [--dry-run]
```

Examples:

```
# Generate all Musa frames (OpenAI)
npx tsx scripts/generate_archetype_sprites.ts musa

# Only GEON attack frames
npx tsx scripts/generate_archetype_sprites.ts musa --actions=ATTACK_GEON

# Multiple actions + custom output
npx tsx scripts/generate_archetype_sprites.ts hacker --actions=IDLE_SOUTH,ATTACK_LI --out=generated/hacker --size=1024x1024
```

Process:

1. Script loads the archetype guide markdown.
2. Extracts the first prompt template containing `{ACTION_LINE}` or `{ACTION_DESCRIPTION}` (provider-specific preference: OpenAI template first).
3. Parses Action Lines code block(s) (keys like `ATTACK_GEON_3: peak impact extension`).
4. Substitutes placeholder with frame description; logs final resolved prompt (dry-run prints only).
5. Calls provider API → saves each frame as `{archetype}/{action_group}/{frameKey}.png`.
6. Writes a manifest JSON summarizing generated frame → file mapping for packing.

Notes:

- Images are generated at high resolution (`--size`) for downscale/crop into 64x128 cells manually or via future post‑processor.
- Maintain consistent seed manually (provider dependent) for loop coherence; future enhancement: `--seed`.
- Bedrock path currently stubbed; extend template selection logic for Titan / SDXL with same placeholder semantics.

Manifest Example (saved as `manifest.json` in output root):

```
{
  "archetype": "musa",
  "provider": "openai",
  "size": "1024x1024",
  "frames": [
    { "key": "IDLE_0", "file": "musa/idle/IDLE_0.png", "promptHash": "..." }
  ]
}
```

Next Steps (not yet automated):

- Crop & pack frames into 64x128 atlas grid.
- Validate anchor alignment (center, foot baseline).
- Inject into runtime loader & update spritesheet JSON definitions.

### Action Line Coverage Requirements (For Orchestrator)

To ensure the automation script can produce every frame required by the final spritesheet JSONs:

- Provide an Action Line entry for every animation-direction or animation-stance-frame needed.
- Directional keys MUST embed direction after the action, e.g. IDLE_SOUTH_0, IDLE_NORTH_3, WALK_EAST_1.
- Stance attacks MUST use ATTACK*{STANCE}*{frameIndex}, e.g. ATTACK_GEON_5, ATTACK_JIN_2.
- Stance idle loops (if needed) should use STANCE*{STANCE}*{frameIndex}.
- Unique sequences (e.g. OVERRIDE, OBSERVE, STEALTH*IDLE) should follow {SEQUENCE_NAME}*{frameIndex}.

If a frame key is omitted from the guide, the orchestrator will NOT generate it and the spritesheet JSON will remain incomplete.

### Orchestrator Filename Mapping

The generation script maps Action Line keys to final filenames as follows:

```
ATTACK_GEON_3      -> {archetype}_attack_geon_3.png
IDLE_SOUTH_1       -> {archetype}_idle_south_1.png
WALK_NORTH_2       -> {archetype}_walk_north_2.png
OVERRIDE_0         -> {archetype}_override_0.png
OBSERVE_3          -> {archetype}_observe_3.png
STEALTH_IDLE_2     -> {archetype}_stealth_idle_2.png
STANCE_GON_1       -> {archetype}_stance_gon_1.png
```

Directory layout groups by primary action (attack/, idle/, walk/, observe/, stealth/, stance/).

Use `--raw-names` flag to retain legacy folder/key naming (UPPERCASE group folders) if needed.

### Gap Analysis Reminder

Current guides are missing directional Action Lines for:

- Musa: north idle/walk + stance loop keys
- Amsalja: idle direction variants (north/east/west) as explicit Action Lines
  Add these to achieve parity with existing JSON spritesheets.

### CSV-Based Generation (Optional Alternative)

You can bypass markdown Action Line parsing with a per–archetype CSV:

Location (auto-detected):
src/assets/spritesheets/ai-guides/csv/<archetype>\_sprites.csv
Example: src/assets/spritesheets/ai-guides/csv/musa_sprites.csv

Invoke:

```
npx tsx scripts/generate_archetype_sprites.ts musa --csv=src/assets/spritesheets/ai-guides/csv/musa_sprites.csv
```

CSV Columns (header required, case-insensitive):
key,description,full_prompt,seed

Rules:

- key: ACTION tokens (e.g. ATTACK_GEON_3, IDLE_SOUTH_0)
- description: Used to fill template if full_prompt empty
- full_prompt: If provided (non-empty) it overrides template substitution entirely
- seed: Stored in manifest (future reproducibility)

Example:

```
key,description,full_prompt,seed
IDLE_SOUTH_0,calm neutral guard,,
ATTACK_GEON_3,peak impact extension,"Traditional warrior sprite, musa disciplined azure striker, peak impact extension mid-strike, 64x128 transparent...",12345
```

If both CSV and markdown exist, CSV wins (unless --csv omitted and no auto file found).
