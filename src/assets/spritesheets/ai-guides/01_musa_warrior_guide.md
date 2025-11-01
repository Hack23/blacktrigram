# 암흑작전부대 (Amheuk Jakjeon Budae) - Dark Operations Unit Spritesheet Generation Guide

## Character Overview

**Archetype**: Dark Operations Unit (암흑작전부대, Amheuk Jakjeon Budae)  
**Motto**: Blade in the darkness (어둠 속의 칼날, Eodum Sok-ui Kalnal)  
**Philosophy**: Operating under cover of darkness, blending cutting-edge technology with traditional fieldcraft  
**Primary Color**: Blue (#4A90E2)  
**Secondary Color**: Korean Red (#C8102E)  
**Combat Focus**: Direct force (☰ Geon) and Defensive mastery (☶ Gan)  
**Combat Effects**: Surgical strikes, skeletal damage, midnight infiltration techniques, black-site extraction
**Special Abilities**: Midnight Infiltration (심야 침투, Simya Chimtu), Surgical Strike, Black-Site Extraction

## Complete AI Generation Prompt

### 1. Base Master Prompt (System-Agnostic)

```
CONTEXT:
Dark Operations Unit (암흑작전부대 Amheuk Jakjeon Budae) – clandestine Korean special forces operative. Midnight infiltration specialist combining cutting-edge stealth technology with traditional Korean martial arts. Disciplined, lethal precision under cover of darkness. Advanced tactical gear with Korean military heritage elements + covert operation cybernetic enhancements (night-vision implants, tactical data overlay, suppressed weapon systems).

STYLE:
Realistic tactical military anatomy; no cartoon; high-fidelity tactical fabric textures; controlled cyan rim light for tech elements; restrained midnight operation stance energy filaments.

TECH:
Frame cell 64x128, full body centered, transparent background, orthographic neutral perspective, consistent anchor at foot midpoint (y ~80%). Clean silhouette optimized for covert operations, no motion blur, no perspective distortion.

PALETTE:
Primary tactical midnight blue (#4A90E2), secondary Korean red (#C8102E) covert accents, tactical black base, minimal cyan luminescence from night-vision systems.

COSTUME:
Advanced tactical infiltration suit with hanbok-inspired stealth panel geometry, night-vision goggles integrated, suppressed weapon holsters, tactical utility harness, reinforced covert operation boots, stealth-optimized gear.

AUGMENTATION (TACTICAL):
Integrated night-vision optical systems, minimal tactical LED indicators, covert communication nodes, suppressed weapon mounting points.

LIGHTING:
Low-key tactical lighting, subtle blue night-vision glow, minimal signature, optimized for darkness operations.

NEGATIVE:
low quality, blur, bloom overflow, extra limbs, distorted hands, cartoon, anime, chibi, watermark, logo, text, heavy armor bulk, fisheye, perspective warp, over-saturation, thick outline, bright colors.

CONSISTENCY ANCHOR:
"amheuk jakjeon tactical dark ops striker"
```

### 2. Action Sub-Prompts

```
IDLE LOOP (4 frames):
Tactical alert stance, micro surveillance sweep, shoulders stable tactical readiness, vertical drift <4px.

WALK SOUTH (4–6 frames):
Covert advance, silent heel-ball-toe infiltration stride, minimal noise signature, tactical awareness posture.

ATTACK GEON (6 frames):
1 tactical assessment (center lowers), 2 coil, 3 explosive surgical strike extension (precision force), 4 impact follow-through, 5 controlled tactical retraction, 6 recovery guard position.

STANCE GEON LOOP (2–3 frames):
Controlled tactical breathing, faint night-vision system glow (cyan-white) around tactical gear.

HIT REACT (3–4 frames):
Quick tactical recoil, immediate defensive recovery, maintain operational composure.

BLOCK / DEFEND (2–3 frames):
Tactical forearms crossing defensive position, stable covert operation base.

VICTORY (3–4 frames):
Minimal tactical acknowledgment, mission-focused discipline, no theatrical display.
```

### 3. OpenAI (gpt-image) Composite Prompt

```
Dark Operations Unit Korean special forces operative (암흑작전부대 Amheuk Jakjeon Budae) realistic full-body sprite frame, 64x128 cell, transparent background, orthographic, centered, amheuk jakjeon tactical dark ops striker.
Scene: {ACTION_DESCRIPTION}.
Clothing: advanced tactical infiltration suit with Korean military heritage elements, night-vision integrated systems, suppressed weapon holsters, tactical harness, covert operation boots.
Accents: tactical midnight blue base, Korean red covert trim, subtle cyan night-vision glow, micro tactical stance indicators (only if stance/attack).
Lighting: low-key tactical lighting + minimal cyan night-vision glow.
Anatomy: realistic tactical operator proportions, stable covert stance.
Avoid: cartoon, blur, bright colors, logos, text, distortion, extra limbs, thick outlines, heavy armor.
```

Replace {ACTION_DESCRIPTION} per frame, e.g.:

```
IDLE FRAME 0 ACTION_DESCRIPTION = tactical alert stance, covert readiness
IDLE FRAME 1 ACTION_DESCRIPTION = micro surveillance sweep right
ATTACK FRAME 3 ACTION_DESCRIPTION = explosive surgical strike extension mid-impact
```

### 4. AWS Bedrock Titan Image Prompt

```
Context:
Realistic Korean special forces Dark Operations Unit (Amheuk Jakjeon Budae). Tactical discipline, surgical strikes, midnight infiltration specialist. Advanced covert operation technology.

Technical:
64x128 sprite cell, full body, centered, transparent background, orthographic neutral camera, no tilt.

Style:
Realistic tactical fabrics, advanced covert operation gear with Korean military heritage, tactical blue primary (#4A90E2), Korean red secondary, subtle cyan night-vision glow, minimal tactical system indicators on operational frames.

Action:
{ACTION_LINE}

Quality:
Sharp tactical edges, clean operational silhouette, no motion blur, consistent tactical anchor.

Exclude:
cartoon, anime, chibi, gore, heavy exosuit, over-glow, watermark, text, logo, extra limbs, anatomy distortion, thick outline, bright colors.

Consistency:
Token = amheuk jakjeon tactical dark ops striker
```

### 5. AWS Bedrock Stability SDXL Prompt

```
(amheuk jakjeon tactical dark ops striker), realistic Korean special forces operative, full body, {ACTION_LINE}, 64x128 sprite frame, centered, transparent background, low-key tactical lighting, subtle cyan night-vision glow, disciplined covert posture, tactical fabric detail, minimal operational system indicators

NEGATIVE:
cartoon, anime, chibi, deformed, extra arms, extra fingers, blur, bloom, grain, watermark, text, logo, heavy armor, mecha, fisheye, perspective warp, overexposed, bright colors
```

### 6. Action Line Examples

```
IDLE_SOUTH_0: tactical alert stance covert readiness
IDLE_SOUTH_1: micro surveillance sweep right
IDLE_SOUTH_2: micro surveillance sweep left
IDLE_SOUTH_3: subtle operational breathing

IDLE_NORTH_0: reverse tactical guard position
IDLE_NORTH_1: operational shoulder settle
IDLE_NORTH_2: tactical breath control
IDLE_NORTH_3: centered covert stillness

IDLE_EAST_0: profile tactical guard stable
IDLE_EAST_1: tactical shoulder micro adjust
IDLE_EAST_2: operational breathing cadence
IDLE_EAST_3: return tactical neutral

IDLE_WEST_0: reverse profile tactical guard
IDLE_WEST_1: operational stance micro settle
IDLE_WEST_2: tactical weight micro shift
IDLE_WEST_3: covert breathing discipline

WALK_SOUTH_0: covert advance lead foot silent
WALK_SOUTH_1: trailing foot passes tactical center
WALK_SOUTH_2: weight transfer stealth mode
WALK_SOUTH_3: tactical recovery stance

WALK_NORTH_0: reverse tactical advance start
WALK_NORTH_1: passing step controlled covert
WALK_NORTH_2: hip transfer restrained tactical
WALK_NORTH_3: guarded operational recovery

WALK_EAST_0: profile tactical advance start
WALK_EAST_1: controlled covert step pass
WALK_EAST_2: torso counter rotation tactical
WALK_EAST_3: reset tactical alignment

WALK_WEST_0: reverse profile tactical step
WALK_WEST_1: mid transfer covert
WALK_WEST_2: arm balance tactical adjust
WALK_WEST_3: foot set operational recovery

ATTACK_GEON_0: tactical assessment lowering
ATTACK_GEON_1: coiled surgical strike load
ATTACK_GEON_2: explosive precision extension start
ATTACK_GEON_3: peak surgical impact extension
ATTACK_GEON_4: controlled tactical follow-through
ATTACK_GEON_5: recoil recovery operational guard

STANCE_IDLE_GEON_0: calm tactical charged stance
STANCE_IDLE_GEON_1: breathing expansion tactical subtle

STANCE_CHANGE_GEON_0: tactical transition load
STANCE_CHANGE_GEON_1: operational transition settle

TECHNIQUE_WINDUP_GEON_0: focused tactical entry load
TECHNIQUE_WINDUP_GEON_1: coil compression operational

TECHNIQUE_EXECUTE_GEON_0: release tactical vector
TECHNIQUE_EXECUTE_GEON_1: surgical force channel

TECHNIQUE_RECOVER_GEON_0: guard tactical retraction
TECHNIQUE_RECOVER_GEON_1: operational neutral reset

HIT_0: tactical torso recoil initial
HIT_1: impact stagger operational
HIT_2: guard recovery tactical
HIT_3: stance stabilization covert

DEFEND_0: tactical forearm guard set
DEFEND_1: brace compression operational
DEFEND_2: guard retention tactical

BLOCK_0: compact tactical shield posture
BLOCK_1: absorption stabilization operational

STUNNED_0: tactical dazed sway start
STUNNED_1: oscillate micro drift operational
STUNNED_2: recover focus tactical attempt

KNOCKED_DOWN_0: descent phase tactical
KNOCKED_DOWN_1: ground impact operational
KNOCKED_DOWN_2: low posture tactical still

GETTING_UP_0: arm post support tactical
GETTING_UP_1: hip drive operational
GETTING_UP_2: torso rise tactical
GETTING_UP_3: stance reestablish covert

VICTORY_0: tactical acknowledgment minimal
VICTORY_1: operational hold disciplined
VICTORY_2: return tactical neutral guard

DEFEAT_0: controlled tactical kneel descent
DEFEAT_1: lowered operational posture
DEFEAT_2: still subdued tactical
```

### 7. Negative Prompt (Reusable)

```
low quality, blur, smear, bloom overflow, over-saturation, cartoon, anime, chibi, thick outline, distorted limbs, extra fingers, missing fingers, warped torso, fisheye, tilted camera, watermark, logo, text, bright colors, heavy armor
```

### 8. Consistency Instructions

Use identical seed (if available) per animation set; maintain token amheuk jakjeon tactical dark ops striker; keep lighting & palette stable for covert operations aesthetic; verify frame alignment by overlay.

흑괘의 길을 걸어라
