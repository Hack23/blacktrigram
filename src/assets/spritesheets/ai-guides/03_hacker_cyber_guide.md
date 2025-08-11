# 해커 (Hacker) - Cyber Warrior Spritesheet Generation Guide

## Character Overview

**Archetype**: Cyber Warrior (해커)  
**Philosophy**: Information as power, technological advantage  
**Primary Color**: Cyan (#00FFFF)  
**Secondary Color**: Electric Blue (#0080FF)  
**Combat Focus**: Precision nerve strikes (☲ Li) and Explosive power (☳ Jin)  
**Combat Effects**: Temporary paralysis, neural disruption, disorientation, knockouts

## Complete AI Generation Prompt

### Master Prompt

```
CONTEXT:
Cyber warrior (해커) leveraging precision nerve strike (Li ☲) + explosive power (Jin ☳). High-integration bio-interface gear – still human, realistic anatomy.

STYLE:
Realistic tactical cyberpunk, clean form-fitting neural fiber suit with modular plates, cyan (#00FFFF) primary glow accents, electric blue (#0080FF) secondary, controlled luminous neural filament pulses along forearms & temples.

TECH:
64x128 cell, full body, centered, orthographic, transparent background, stable anchor. No extreme perspective.

AUGMENTATIONS:
Temporal neural visor band, cranial micro ports, wrist haptic injectors (subtle lumens), thoracic conduit lines.

LIGHTING:
Cool balanced key + crisp cyan rim + low-power internal glow pulses (regulated).

FX:
During Li attacks: fine orange-amber nerve disruption sparks at strike limb.
During Jin attacks: staccato cyan kinetic discharge arcs.

NEGATIVE:
over-glow, bloom flood, cartoon, anime, bulky exosuit, mech plating, graffiti, text, logo, distorted anatomy.

CONSISTENCY TOKEN:
"hacker cyan neural vector"
```

### Animation Targets

```
Idle South (4), Idle North (4)
Walk South (4)
Override / Tech Channel (4): engaged neural channel focusing routine
Attack Li (6): precision sequential nerve strike, linear crisp motions
Attack Jin (6): explosive concussive chain, higher force arcs
Stance Li Loop (2–3 optional): minimal pulsating neural nodes
```

### OpenAI gpt-image Prompt Template

```
Cyber warrior hacker, hacker cyan neural vector, {ACTION_LINE}, realistic full body, 64x128 sprite frame, transparent background, orthographic, cyan primary glow accents + electric blue secondary, precise neural filament suit, controlled luminous pulses, cool cinematic lighting, clean silhouette.
Add fine amber nerve sparks if Li attack frame.
Add cyan kinetic discharge arcs if Jin attack frame.
Avoid cartoon, bloom excess, text, logo, extra limbs, bulky armor.
```

### AWS Titan Image Prompt

```
Context:
Realistic Korean cyber warrior (Hacker) – precision nerve disruption + explosive power.

Technical:
64x128 cell, centered, full body, transparent, orthographic.

Action:
{ACTION_LINE}

Style:
Form-fitting neural conduit suit, cyan glow seams, electric blue secondary lines, subtle internal light.

FX Rules:
Li frames: fine amber micro sparks near striking hand/foot.
Jin frames: short cyan arc bursts, no over-bloom.

Exclude:
cartoon, anime, gore, watermark, text, logo, mech bulk, excessive glow, perspective warp.

Consistency:
Token = hacker cyan neural vector
```

### AWS Stability SDXL Prompt

```
(hacker cyan neural vector), realistic cyber warrior, full body, {ACTION_LINE}, 64x128 sprite frame, transparent background, cool key light, cyan rim glow, neural conduit suit, subtle controlled luminescence

Conditional FX:
{OPTIONAL_FX}

NEGATIVE:
cartoon, anime, bloom flood, blur, watermark, text, logo, extra limbs, distorted hands, heavy armor
```

Use OPTIONAL_FX:

```
Li attack frame: fine amber nerve spark filaments at striking limb
Jin attack frame: compact cyan kinetic discharge arcs
Else: none
```

### Action Lines

```
IDLE_SOUTH_0: relaxed cyber guard forward
IDLE_SOUTH_1: neural scan micro tilt
IDLE_SOUTH_2: subtle breathing expansion
IDLE_SOUTH_3: refocus posture

WALK_SOUTH_0: forward neural stride
WALK_SOUTH_1: balanced conduit step
WALK_SOUTH_2: controlled gait transfer
WALK_SOUTH_3: stabilized reset

OVERRIDE_0: visor engagement onset
OVERRIDE_1: heightened neural channel glow
OVERRIDE_2: data pulse stabilization
OVERRIDE_3: controlled channel sustain

ATTACK_LI_0: precise nerve target alignment
ATTACK_LI_1: linear strike extension
ATTACK_LI_2: contact micro spark
ATTACK_LI_3: follow-through taper
ATTACK_LI_4: secondary nerve jab
ATTACK_LI_5: recovery posture

ATTACK_JIN_0: kinetic coil load
ATTACK_JIN_1: explosive release start
ATTACK_JIN_2: peak force arc
ATTACK_JIN_3: shockwave follow-through
ATTACK_JIN_4: recoil stabilization
ATTACK_JIN_5: ready stance reset
```

### Negative Prompt

```
low quality, blur, heavy bloom, neon flood, cartoon, anime, chibi, watermark, text, logo, mecha bulk, extra limbs, deformed hands, oversharpen halo
```

### Consistency

Keep glow intensity numeric target (luminosity mid-high but not clipping). Maintain identical suit panel mapping across frames.

흑괘의 길을 걸어라
