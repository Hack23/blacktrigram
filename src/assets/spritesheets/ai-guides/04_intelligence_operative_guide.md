# 정보요원 (Jeongbo Yowon) - Intelligence Operative Guide

## Character Overview

**Archetype**: Intelligence Operative (정보요원)  
**Philosophy**: Knowledge through observation, strategic thinking  
**Primary Color**: Green (#32CD32)  
**Secondary Color**: Military Gray (#708090)  
**Combat Focus**: Fluid adaptation (☱ Tae) and Immovable defense (☶ Gan)  
**Combat Effects**: Dislocations, torn ligaments, counter-attacks, blocks

## Complete AI Generation Prompt

### Master Prompt

```
CONTEXT:
Intelligence operative (정보요원 Jeongbo) – strategic observation, fluid joint manipulation (Tae ☱) + immovable defense (Gan ☶). Realistic tactical analysis specialist with subtle cyber analysis tools.

STYLE:
Hybrid recon attire: layered adaptive fabric jacket, modular shoulder sensor patch, data wrist slate, compact utility pouches. Primary green (#32CD32), secondary subdued slate gray (#708090), minimal amber diagnostic LEDs.

TECH:
64x128 frame cell, full body centered, transparent background, orthographic neutral. Stable anchor.

AUGMENTATIONS:
Subtle ocular analysis lens, forearm micro-interface band, chest low-profile biometric plate.

LIGHTING:
Neutral-diffuse key + soft green reflective accent + restrained cyan rim.

FX:
Tae stance: soft fluid reflective sheen shifts on fabric edges.
Gan stance: subdued static defensive aura (low opacity basaltic teal contour).

NEGATIVE:
cartoon, anime, over-saturation, bulky armor, hologram clutter, bloom overflow, text, logo, extra limbs.

CONSISTENCY TOKEN:
"jeongbo tactical green analyst"
```

### Animation Plan

```
Idle South (4)
Idle North (4)
Walk South (4)
Observe (4): analytical scanning – subtle head & sensor focus
Attack Tae (6): fluid joint redirection sequence
Attack Gan (6): firm structural interception → controlled counter
Stance Tae Loop (2–3)
Stance Gan Loop (2–3)
```

### OpenAI gpt-image Prompt Template

```
Intelligence operative cyberpunk Korean (정보요원), jeongbo tactical green analyst, {ACTION_LINE}, 64x128 full body sprite, transparent background, realistic anatomy, adaptive recon jacket green + slate gray, subtle sensor modules, minimal LEDs, neutral key light + soft green accent + cyan rim, clean silhouette.
Apply fluid reflective sheen if Tae stance/attack.
Apply static defensive teal contour if Gan stance/attack.
Avoid cartoon, bloom, text, logo, extra limbs, heavy armor.
```

### AWS Titan Image Prompt

```
Context:
Realistic Korean intelligence operative specializing in observation and structural defense.

Technical:
64x128 sprite frame, orthographic, transparent, centered.

Action:
{ACTION_LINE}

Style:
Green primary (#32CD32), slate gray secondary, modular recon gear, subtle sensor nodes, minimal amber diagnostic lights.

FX Rules:
Tae: gentle fabric edge sheen (motion continuity).
Gan: faint static teal contour aura.

Exclude:
cartoon, anime, hologram clutter, bloom excess, watermark, text, logo, distorted anatomy.

Consistency:
Token = jeongbo tactical green analyst
```

### AWS Stability SDXL Prompt

```
(jeongbo tactical green analyst), realistic tactical intelligence operative, full body, {ACTION_LINE}, 64x128 sprite, transparent background, neutral cinematic lighting, subtle recon sensors, green primary, slate gray secondary

Conditional FX:
{FX_LINE}

NEGATIVE:
cartoon, anime, blur, bloom flood, watermark, text, logo, mecha, extra limbs
```

FX_LINE examples:

```
Tae attack frame: fluid reflective edge sheen
Gan attack frame: static teal structural aura
Else: none
```

### Action Lines

```
IDLE_SOUTH_0: composed analytical stance
IDLE_SOUTH_1: subtle head shift scan left
IDLE_SOUTH_2: micro weight re-center
IDLE_SOUTH_3: quiet breath control

OBSERVE_0: sensor focus activation
OBSERVE_1: micro ocular lens flare
OBSERVE_2: data assessment posture
OBSERVE_3: conclusion stabilization

ATTACK_TAE_0: capture limb entry
ATTACK_TAE_1: joint redirection torque
ATTACK_TAE_2: leverage pivot
ATTACK_TAE_3: destabilization follow
ATTACK_TAE_4: controlled displacement
ATTACK_TAE_5: release neutral guard

ATTACK_GAN_0: structural guard set
ATTACK_GAN_1: intercept contact
ATTACK_GAN_2: force absorption
ATTACK_GAN_3: counter initiation
ATTACK_GAN_4: guided redirect
ATTACK_GAN_5: stabilized posture
```

### Negative Prompt

```
low quality, blur, over-glow, cartoon, anime, chibi, watermark, text, logo, exaggerated armor, bulky mech, distortion
```

### Consistency

Maintain token phrase across all sets; ensure stable sensor placements; lighting & green tone remain consistent.

흑괘의 길을 걸어라
