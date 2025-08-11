# 암살자 (Amsalja) - Shadow Assassin Spritesheet Generation Guide

## Character Overview

**Archetype**: Shadow Assassin (암살자)  
**Philosophy**: Efficiency through invisibility, one perfect strike  
**Primary Color**: Purple (#7B68EE)  
**Secondary Color**: Shadow Black (#1A1A1A)  
**Combat Focus**: Continuous pressure (☴ Son) and Adaptive flow (☵ Gam)  
**Combat Effects**: Gradual incapacitation, cumulative pain, circulation disruption

## Complete AI Generation Prompt

### Base Master Prompt

```
CONTEXT:
Shadow assassin (암살자 Amsalja) – silent precision, fluid continuous pressure (Son ☴) + adaptive flow (Gam ☵). Cyberpunk realism focused on stealth infiltration.

STYLE:
Low-reflective layered stealth fabrics, segmented flexible panels, subtle purple (#7B68EE) gradient with shadow black (#1A1A1A) base, pinpoint violet micro-glow at joints (minimal), adaptive flow wisps for stance/attack only (semi-transparent teal-lilac filaments).

TECH:
64x128 cell, full body centered, transparent background, orthographic, consistent anchor feet. No exaggerated poses; maintain predator grace.

AUGMENTATIONS:
Light neural ocular node (small), wrist pulse dampeners, muted data fiber along spine.

LIGHTING:
Dim neutral key + cool edge highlight + faint purple rim, preserve stealth mood.

NEGATIVE:
cartoon, anime, heavy bloom, bulky armor, mech plating, oversaturated neon, wide camera, fisheye, extra limbs, gore, text, logo.

CONSISTENCY TOKEN:
"amsalja silent violet vector"
```

### Key Animations

```
Idle (4): poised low center, subtle breathing, minimal vertical shift.
Walk (shadow glide 4): soft toe-first footfalls, arms close, hips stable.
Stealth Idle (4): deeper crouch, heightened readiness micro-twitch.
Attack Son (6): continuous flowing chain strike sequence (no abrupt stops).
Attack Gam (optional alt 6): adaptive redirection—deflect → counter.
Idle Direction Variants: south, north, east, west (profiles crisp).
```

### OpenAI gpt-image Prompt Template

```
Shadow assassin Korean cyberpunk operative (암살자), amsalja silent violet vector, {ACTION_LINE}, 64x128 sprite frame, full body centered, transparent background, realistic anatomy, layered matte stealth suit purple + shadow black, subtle teal-lilac flow wisps if attack or stance, dim neutral key light + cool purple rim, no motion blur, clean silhouette.
Avoid cartoon, bloom, text, logo, extra limbs, heavy armor, fisheye.
```

### AWS Titan Image Prompt

```
Context:
Realistic stealth cyberpunk Korean assassin (Amsalja). Continuous pressure and adaptive flow.

Technical:
64x128 cell, centered, orthographic neutral, transparent background.

Action:
{ACTION_LINE}

Style:
Matte stealth suit, layered tactical fabrics, controlled violet accent (#7B68EE), minimal teal flow energy only during attack or special stance frames.

Lighting:
Subtle low-intensity key + soft purple rim for edge readability.

Exclude:
cartoon, anime, gore, watermark, text, logo, heavy mech armor, excessive glow, perspective distortion, extra limbs.

Consistency:
Token = amsalja silent violet vector
```

### AWS Stability SDXL Prompt

```
(amsalja silent violet vector), realistic stealth Korean cyberpunk assassin, full body, {ACTION_LINE}, 64x128 sprite frame, transparent background, dim cinematic lighting, subtle purple edge light, adaptive flow wisps (only if attack), matte tactical fabrics

NEGATIVE:
cartoon, anime, bright neon flood, blur, bloom, watermark, text, logo, deformed hands, extra fingers, heavy armor, mecha suit
```

### Action Line Examples

```
IDLE_SOUTH_0: low poised stealth guard
IDLE_SOUTH_1: micro center shift right
IDLE_SOUTH_2: micro center shift left
IDLE_SOUTH_3: controlled exhale subtle

WALK_SOUTH_0: soft glide lead foot
WALK_SOUTH_1: trailing foot silent pass
WALK_SOUTH_2: weight transition fluid
WALK_SOUTH_3: poised recovery alignment

STEALTH_IDLE_0: deeper crouch tension
STEALTH_IDLE_1: shoulder micro roll
STEALTH_IDLE_2: weight shift toes
STEALTH_IDLE_3: latent strike coil

ATTACK_SON_0: fluid chain strike windup
ATTACK_SON_1: slicing forearm sweep
ATTACK_SON_2: seamless follow-through arc
ATTACK_SON_3: redirected second vector
ATTACK_SON_4: pressure continuation
ATTACK_SON_5: recovery flowing guard
```

### Negative Prompt

```
low quality, blur, smear, bloom overflow, oversaturated neon, cartoon, anime, chibi, watermark, text, logo, extra limbs, missing fingers, thick outlines, distorted perspective
```

### Consistency Instructions

Use same token phrase; maintain identical lighting values; verify alignment overlay; keep energy FX intensity constant across attack frames.

흑괘의 길을 걸어라
