# 조직폭력배 (Jojik Pokryeokbae) - Organized Crime Guide

## Character Overview

**Archetype**: Organized Crime Fighter (조직폭력배)  
**Philosophy**: Survival through ruthlessness, practical violence  
**Primary Color**: Orange (#FF4500)  
**Secondary Color**: Dark Red (#8B0000)  
**Combat Focus**: Explosive power (☳ Jin) and Grounding attacks (☷ Gon)  
**Combat Effects**: Disorientation, knockouts, throws, takedowns

## Visual Design Requirements

### Character Appearance

- **Age**: 30-40 years old, street-hardened veteran
- **Build**: Rough, practical physique built for survival
- **Height**: Stocky, intimidating presence (64x128 pixels)
- **Clothing**: Street-modified gi, practical survival gear
- **Colors**: Orange and dark red, weathered and worn appearance
- **Hair**: Rough cut, possibly scarred or damaged
- **Facial Features**: Hard-lived face, battle scars, intimidating expression
- **Accessories**: Improvised gear, street modifications, survival tools

### Combat Specialization Visual Cues

- **Street Fighting**: Practical gear, improvised weapons readiness
- **Survival Focus**: Weathered equipment, battle-tested appearance
- **Ruthless Efficiency**: Intimidating posture, no-nonsense approach
- **Ground Combat**: Low-center stance, takedown readiness

## Animation Requirements

### 1. 8-Directional Movement (4 frames each)

#### Idle Animations

- **South (Forward)**: Aggressive street stance, intimidating presence
- **North (Back)**: Defensive street position, ready for anything
- **East/West**: Profile street-smart stances
- **Diagonals**: Transitional combat-ready positions

#### Walking Animations

- **Movement Style**: Aggressive, intimidating, street-smart
- **Posture**: Low, ready for violence, survival-oriented
- **Approach**: Practical, no-wasted-movement efficiency

### 2. Street-Specific Animations

#### Intimidation Stance (4 frames)

- **Frame 0**: Aggressive posturing, territorial display
- **Frame 1**: Threatening advance, psychological pressure for stunning setup
- **Frame 2**: Ready for explosive violence, intimidation peak
- **Frame 3**: Maintained threat, dominance assertion for ground control

### 3. Trigram Stance Specializations

#### ☳ Jin (Thunder) - Explosive Power Stance

- **Frames 0-1**: Brutal setup for explosive consciousness disruption
- **Frames 2-3**: Devastating explosive stunning strike delivery
- **Frames 4-5**: Ruthless follow-through, knockout confirmation
- **Visual Elements**: Brutal efficiency, explosive power for disorientation

#### ☷ Gon (Earth) - Grounding Attacks Stance

- **Frames 0-1**: Takedown positioning, ground control setup
- **Frames 2-3**: Brutal throw or takedown execution to ground
- **Frames 4-5**: Ground dominance, submission positioning
- **Visual Elements**: Street-fighting brutality, practical ground control

### 4. Combat Animations

#### Attack Sequences

- **Explosive Brutality**: Practical, survival-focused stunning techniques
- **Intimidation Factor**: Psychological warfare through explosive violence
- **Ground Control**: Practical street fighting takedown dominance

#### Combat Effects Visualization

- **Knockout Focus**: Brutal consciousness disruption through explosive techniques
- **Takedown Mastery**: Street-effective throwing and ground control
- **Survival Efficiency**: Whatever works, practical explosive violence

## AI Generation Prompts

### Master Prompt

```
CONTEXT:
Organized crime enforcer (조직폭력배 Jojik) – survival ruthlessness, explosive power (Jin ☳) + grounding takedowns (Gon ☷). Realistic street-modified combat gear, weathered & practical.

STYLE:
Rugged layered street gi hybrid + reinforced urban jacket, scuffed flexible boots, taped knuckles, improvised protective panels. Primary orange (#FF4500) with dark red (#8B0000) distressed accents. Gritty but clean silhouette.

TECH:
64x128 frame cell, full body centered, transparent background, orthographic. Powerful compact physique.

AUGMENTATIONS:
Minimal – maybe forearm shock inducers (low-key), cervical stabilizer patch.

LIGHTING:
Warm-neutral key with subtle contrasting cyan rim to maintain HUD readability; controlled highlights.

FX:
Jin attack: explosive concussive cyan-orange shock arcs.
Gon attack: ground dust displacement & low amber resonance under feet (subtle).

NEGATIVE:
cartoon, anime, extreme gore, bloom flood, mech armor, superhero cape, text, logo, extra limbs, perspective distortion.

CONSISTENCY TOKEN:
"jojik ruthless grounded force"
```

### Animation Focus

```
Intimidation Stance (4)
Idle 8-direction set (if produced) or at least south/east/west/north
Walk (aggressive low gait) 4–6
Attack Jin (6): explosive strike cascade
Attack Gon (6): takedown chain sequence
Hit React (4)
Defend / Block (3)
Victory (3)
Defeat (3–4)
```

### OpenAI gpt-image Prompt Template

```
Organized crime Korean enforcer, jojik ruthless grounded force, {ACTION_LINE}, realistic compact power build, 64x128 full body sprite, transparent background, rugged layered street gi + reinforced jacket, orange primary with dark red distress, taped knuckles, subtle forearm shock inducers, warm-neutral key light + cyan rim, clean silhouette.
If Jin attack: explosive cyan-orange shock arcs mid-strike.
If Gon attack: low amber ground resonance + subtle dust displacement.
Avoid cartoon, bloom excess, text, logo, mecha armor, extra limbs.
```

### AWS Titan Image Prompt

```
Context:
Realistic street combat survival specialist (Jojik). Emphasis: explosive kinetic power + grounding takedowns.

Technical:
64x128 sprite frame, centered, orthographic, transparent.

Action:
{ACTION_LINE}

Style:
Weathered orange (#FF4500) dominant, dark red (#8B0000) secondary, layered rugged fabrics, scuffed boots, taped hands, minimal tech.

FX Rules:
Jin frames: concise cyan-orange shock arcs (not over-bright).
Gon frames: subtle dust + low amber ground pulse.

Exclude:
cartoon, anime, exaggerated gore, watermark, text, logo, heavy sci-fi armor, perspective warp.

Consistency:
Token = jojik ruthless grounded force
```

### AWS Stability SDXL Prompt

```
(jojik ruthless grounded force), realistic rugged Korean street combatant, full body, {ACTION_LINE}, 64x128 sprite, transparent background, warm-neutral lighting with cyan rim, layered weathered street gi hybrid, taped knuckles, compact powerful stance

Conditional FX:
{FX_LINE}

NEGATIVE:
cartoon, anime, bloom flood, watermark, text, logo, mecha, extra limbs, blur
```

FX_LINE examples:

```
Jin attack: explosive cyan-orange kinetic arcs
Gon attack: subtle dust + amber ground pulse
Else: none
```

### Action Lines

```
IDLE_SOUTH_0: hard-set street guard
IDLE_SOUTH_1: intimidation breath swell
IDLE_SOUTH_2: shoulder torque preload
IDLE_SOUTH_3: grounded dominance hold

WALK_SOUTH_0: heavy forward plant
WALK_SOUTH_1: weight drive advance
WALK_SOUTH_2: hip power shift
WALK_SOUTH_3: brutal intent reset

INTIMIDATION_0: aggressive forward lean
INTIMIDATION_1: threat advance micro step
INTIMIDATION_2: clenched power coil
INTIMIDATION_3: dominance hold posture

ATTACK_JIN_0: explosive load
ATTACK_JIN_1: initial burst
ATTACK_JIN_2: peak shock extension
ATTACK_JIN_3: concussive follow-through
ATTACK_JIN_4: secondary impact settling
ATTACK_JIN_5: recovery guard

ATTACK_GON_0: low entry setup
ATTACK_GON_1: leg capture motion
ATTACK_GON_2: lift destabilization
ATTACK_GON_3: ground drive throw
ATTACK_GON_4: pin dominance
ATTACK_GON_5: stabilization posture
```

### Negative Prompt

```
low quality, blur, bloom overflow, cartoon, anime, chibi, watermark, text, logo, excessive gore, mecha plating, exosuit, distorted limbs, thick outline
```

### Consistency Notes

Keep facial scar pattern, taped knuckle texture constant; maintain muscle volume proportion; minimize hue drift of orange primary across frames.

흑괘의 길을 걸어라
