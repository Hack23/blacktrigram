# 무사 (Musa) - Traditional Korean Warrior Spritesheet Generation Guide

## Character Overview

**Archetype**: Traditional Warrior (무사)  
**Philosophy**: Honor through disciplined strength  
**Primary Color**: Blue (#4A90E2)  
**Secondary Color**: Korean Red (#C8102E)  
**Combat Focus**: Direct force (☰ Geon) and Defensive mastery (☶ Gan)  
**Combat Effects**: Fractures, concussions, immediate trauma, counter-attacks, blocks

## Complete AI Generation Prompt

### 1. Base Master Prompt (System-Agnostic)

```
CONTEXT:
Traditional Korean cyberpunk warrior (무사 Musa) – disciplined strength, efficient biomechanics, calm lethal focus. Subtle fusion of classic Korean martial attire + tactical modern fabric + minimal cybernetic augmentation (forearm haptic bands, neural collar node).

STYLE:
Realistic grounded anatomy; no cartoon; high-fidelity fabric folds; controlled cyan rim light; restrained micro electric geon (☰) stance energy filaments.

TECH:
Frame cell 64x128, full body centered, transparent background, orthographic neutral perspective, consistent anchor at foot midpoint (y ~80%). Clean silhouette, no motion blur, no perspective distortion.

PALETTE:
Primary deep disciplined azure (#4A90E2), secondary Korean red (#C8102E) accents, subtle metallic neutrals, minimal cyan luminescence.

COSTUME:
Reinforced martial jacket with hanbok-inspired wrap panel geometry, tactical bracers, compact waist utility belt, light armored shin guards.

AUGMENTATION (SUBTLE):
Neural collar seam, minimal LED data bead line along forearm bands.

LIGHTING:
Cinematic cool key, soft neutral fill, subtle cyan rim, no harsh bloom.

NEGATIVE:
low quality, blur, bloom overflow, extra limbs, distorted hands, cartoon, anime, chibi, watermark, logo, text, exosuit bulk, fisheye, perspective warp, over-saturation, thick outline.

CONSISTENCY ANCHOR:
"musa disciplined azure striker"
```

### 2. Action Sub-Prompts

```
IDLE LOOP (4 frames):
Calm poised stance, micro weight shift, shoulders stable, vertical drift <4px.

WALK SOUTH (4–6 frames):
Measured advance, heel-ball-toe, subtle torso counter-rotation, arms disciplined.

ATTACK GEON (6 frames):
1 anticipation (center lowers), 2 coil, 3 explosive forward strike extension (direct force), 4 impact follow-through, 5 controlled retraction, 6 recovery guard.

STANCE GEON LOOP (2–3 frames):
Minimal breathing expansion, faint electric micro arcs (white-cyan) around fists.

HIT REACT (3–4 frames):
Quick torso recoil, guarded recovery, maintain disciplined composure.

BLOCK / DEFEND (2–3 frames):
Forearms crossing or angled guard, stable foot base.

VICTORY (3–4 frames):
Subtle respectful acknowledgment, no theatrical exaggeration.
```

### 3. OpenAI (gpt-image) Composite Prompt

```
Traditional Korean cyberpunk warrior (무사 Musa) realistic full-body sprite frame, 64x128 cell, transparent background, orthographic, centered, musa disciplined azure striker.
Scene: {ACTION_DESCRIPTION}.
Clothing: reinforced martial jacket with hanbok wrap geometry, tactical bracers, slim utility belt, armored shins.
Accents: disciplined azure base, Korean red trim, subtle cyan rim light, micro electric geon stance filaments (only if stance/attack).
Lighting: cinematic cool key + soft neutral fill + cyan rim.
Anatomy: realistic proportions, stable anchor feet.
Avoid: cartoon, blur, bloom, logos, text, distortion, extra limbs, thick outlines.
```

Replace {ACTION_DESCRIPTION} per frame, e.g.:

```
IDLE FRAME 0 ACTION_DESCRIPTION = calm poised idle, neutral guarded hands
IDLE FRAME 1 ACTION_DESCRIPTION = slight micro weight shift right
ATTACK FRAME 3 ACTION_DESCRIPTION = explosive forward strike extension mid-impact
```

### 4. AWS Bedrock Titan Image Prompt

```
Context:
Realistic cyberpunk Korean warrior (Musa). Discipline, direct force (Geon). Subtle augmentations only.

Technical:
64x128 sprite cell, full body, centered, transparent background, orthographic neutral camera, no tilt.

Style:
Realistic fabrics, tactical hybrid martial attire, azure primary (#4A90E2), Korean red secondary, subtle cyan rim light, minimal electric filaments on attack or stance frames.

Action:
{ACTION_LINE}

Quality:
Sharp edges, clean silhouette, no motion blur, consistent anchor.

Exclude:
cartoon, anime, chibi, gore, heavy exosuit, over-glow, watermark, text, logo, extra limbs, anatomy distortion, thick outline.

Consistency:
Token = musa disciplined azure striker
```

### 5. AWS Bedrock Stability SDXL Prompt

```
(musa disciplined azure striker), realistic Korean cyberpunk martial warrior, full body, {ACTION_LINE}, 64x128 sprite frame, centered, transparent background, cinematic cool lighting, subtle cyan rim, disciplined posture, refined fabric detail, minimal geon electric filament accents

NEGATIVE:
cartoon, anime, chibi, deformed, extra arms, extra fingers, blur, bloom, grain, watermark, text, logo, heavy armor, mecha, fisheye, perspective warp, overexposed
```

### 6. Frame Action Lines Examples

```
IDLE_SOUTH_0: calm neutral guard
IDLE_SOUTH_1: micro weight shift right
IDLE_SOUTH_2: micro weight shift left
IDLE_SOUTH_3: subtle breathing expansion

WALK_SOUTH_0: forward step lead foot extended
WALK_SOUTH_1: trailing foot passes center
WALK_SOUTH_2: weight transfer mid
WALK_SOUTH_3: recovery stance

ATTACK_GEON_0: anticipatory lowering
ATTACK_GEON_1: coiled torque load
ATTACK_GEON_2: explosive extension start
ATTACK_GEON_3: peak impact extension
ATTACK_GEON_4: controlled follow-through
ATTACK_GEON_5: recoil recovery guard
```

### 7. Negative Prompt (Reusable)

```
low quality, blur, smear, bloom overflow, over-saturation, cartoon, anime, chibi, thick outline, distorted limbs, extra fingers, missing fingers, warped torso, fisheye, tilted camera, watermark, logo, text
```

### 8. Consistency Instructions

Use identical seed (if available) per animation set; maintain token musa disciplined azure striker; keep lighting & palette stable; verify frame alignment by overlay.

흑괘의 길을 걸어라
