# Technique Systems Analysis

## Executive Summary

Black Trigram currently has **TWO SEPARATE technique systems** with **ZERO overlap**:

1. **Archetype System**: 21 techniques (src/data/techniques.ts)
2. **Trigram System**: 66 techniques (src/systems/trigram/techniques/)

**Total: 87 unique techniques across both systems**

## System 1: Archetype-Based Techniques (21 techniques)

**Location**: `src/data/techniques.ts`

**Purpose**: Player-focused combat gameplay with keyboard shortcuts

**Organization**: By player archetype

### Archetypes & Techniques

**무사 (Musa) - Traditional Warrior (4 techniques)**
- `musa_thunder_strike` - Thunder Strike (천둥벽력)
- `musa_iron_defense` - Iron Defense (철벽방어)
- `musa_dragon_fist` - Dragon Fist (용권)
- `musa_mountain_breaker` - Mountain Breaker

**암살자 (Amsalja) - Shadow Assassin (4 techniques)**
- `amsalja_shadow_strike` - Shadow Strike
- `amsalja_nerve_strike` - Nerve Strike
- `amsalja_deadly_precision` - Deadly Precision
- `amsalja_silent_death` - Silent Death

**해커 (Hacker) - Cyber Warrior (4 techniques)**
- `hacker_electric_shock` - Electric Shock
- `hacker_data_strike` - Data Strike
- `hacker_cyber_overdrive` - Cyber Overdrive
- `hacker_system_crash` - System Crash

**정보요원 (Jeongbo) - Intelligence Operative (5 techniques)**
- `jeongbo_tactical_strike` - Tactical Strike
- `jeongbo_counter_intelligence` - Counter Intelligence
- `jeongbo_psychological_warfare` - Psychological Warfare
- `jeongbo_precision_takedown` - Precision Takedown
- `jeongbo_intelligence_strike` - Intelligence Strike

**조직폭력배 (Jojik) - Organized Crime (4 techniques)**
- `jojik_street_brawl` - Street Brawl
- `jojik_improvised_weapon` - Improvised Weapon
- `jojik_ruthless_assault` - Ruthless Assault
- `jojik_brutal_takedown` - Brutal Takedown

### Features

- Keyboard shortcuts (Q, E, R, T, Y, F, G, Z, X, C)
- Animation mappings (AttackAnimationType)
- Stamina/Ki costs
- Damage ranges
- Cooldowns
- Crit chances
- Stance requirements

## System 2: Trigram-Based Techniques (66 techniques)

**Location**: `src/systems/trigram/techniques/`

**Purpose**: Traditional Korean martial arts with Eight Trigrams stance system

**Organization**: By trigram stance (팔괘 - Eight Trigrams)

### Trigram Stances & Techniques

**☰ 건 (Geon) - Heaven (7 techniques)**
- `geon_heaven_strike` - Heaven Strike
- `geon_heavenly_fist` - Heavenly Fist
- `geon_frontal_kick` - Frontal Kick
- `geon_roundhouse_kick` - Roundhouse Kick
- `geon_axe_kick` - Axe Kick
- `geon_palm_strike` - Palm Strike
- `geon_elbow_smash` - Elbow Smash

**☱ 태 (Tae) - Lake (7 techniques)**
- `tae_flowing_strikes` - Flowing Strikes
- `tae_wrist_lock` - Wrist Lock
- `tae_small_circle` - Small Circle
- `tae_finger_lock` - Finger Lock
- `tae_elbow_lock` - Elbow Lock
- `tae_shoulder_lock` - Shoulder Lock
- `tae_arm_bar` - Arm Bar

**☲ 리 (Li) - Fire (6 techniques)**
- `li_flame_spear` - Flame Spear
- `li_temple_strike` - Temple Strike
- `li_nerve_strike` - Nerve Strike
- `li_sidekick` - Sidekick
- `li_pressure_point` - Pressure Point
- `li_solar_plexus_strike` - Solar Plexus Strike

**☳ 진 (Jin) - Thunder (6 techniques)**
- `jin_lightning_flash` - Lightning Flash
- `jin_jumping_front_kick` - Jumping Front Kick
- `jin_tornado_kick` - Tornado Kick
- `jin_flying_sidekick` - Flying Sidekick
- `jin_back_kick` - Back Kick
- `jin_knee_strike` - Knee Strike

**☴ 손 (Son) - Wind (6 techniques)**
- `son_whirlwind_barrage` - Whirlwind Barrage
- `son_sweeping_low_kick` - Sweeping Low Kick
- `son_rapid_footwork` - Rapid Footwork
- `son_rhythmic_strikes` - Rhythmic Strikes
- `son_flowing_push` - Flowing Push
- `son_spinning_elbow` - Spinning Elbow

**☵ 감 (Gam) - Water (6 techniques)**
- `gam_water_counter` - Water Counter
- `gam_redirect_throw` - Redirect Throw
- `gam_hip_throw` - Hip Throw
- `gam_flowing_block` - Flowing Block
- `gam_circular_parry` - Circular Parry
- `gam_wrist_twist_counter` - Wrist Twist Counter

**☶ 간 (Gan) - Mountain (6 techniques)**
- `gan_rock_defense` - Rock Defense
- `gan_immovable_stance` - Immovable Stance
- `gan_iron_block` - Iron Block
- `gan_counter_strike` - Counter Strike
- `gan_reversal_technique` - Reversal Technique
- `gan_mountain_stance_lock` - Mountain Stance Lock

**☷ 곤 (Gon) - Earth (7 techniques)**
- `gon_earth_embrace` - Earth Embrace
- `gon_leg_sweep` - Leg Sweep
- `gon_ankle_pick` - Ankle Pick
- `gon_ssireum_throw` - Ssireum Throw (traditional Korean wrestling)
- `gon_ground_pound` - Ground Pound
- `gon_body_lock_takedown` - Body Lock Takedown
- `gon_sacrifice_throw` - Sacrifice Throw

**Dark Ops (15 techniques)**
- `darkops_silent_carotid` - Silent Carotid Strike
- `darkops_nerve_paralysis` - Nerve Paralysis
- `darkops_liver_disruption` - Liver Disruption
- `darkops_kidney_strike` - Kidney Strike
- `darkops_throat_strike` - Throat Strike
- `darkops_solar_plexus_paralyze` - Solar Plexus Paralyze
- `darkops_brachial_plexus_strike` - Brachial Plexus Strike
- `darkops_femoral_nerve_strike` - Femoral Nerve Strike
- `darkops_rear_choke` - Rear Choke
- `darkops_spinal_strike` - Spinal Strike
- `darkops_jaw_dislocation` - Jaw Dislocation
- `darkops_temple_strike` - Temple Strike
- `darkops_achilles_sever` - Achilles Sever
- `darkops_ear_strike` - Ear Strike
- `darkops_eye_gouge` - Eye Gouge

### Features

- Trigram stance alignment
- Vital point targeting (70 points system)
- Damage type effectiveness
- Archetype bonuses
- Traditional Korean terminology
- Cultural authenticity

## Comparison

| Aspect | Archetype System | Trigram System |
|--------|-----------------|----------------|
| **Count** | 21 techniques | 66 techniques |
| **Organization** | Player class | Trigram stance |
| **Focus** | Gameplay | Cultural authenticity |
| **Keyboard** | Yes (Q-C keys) | No |
| **Stances** | Required for some | Organized by stance |
| **Vital Points** | Some target vital points | Extensive vital point system |
| **IDs** | `archetype_name` | `stance_name` |
| **Enum** | TechniqueId (21) | Not in enum |
| **Animation Map** | Yes (21 mappings) | Partial |

## Issues Identified

### 1. Zero Overlap

**Problem**: No techniques exist in both systems
- 21 archetype techniques NOT in trigram system
- 66 trigram techniques NOT in archetype system
- Total disconnect between gameplay and cultural systems

### 2. TechniqueId Enum Incomplete

**Problem**: Enum only has 21 archetype techniques
- Missing all 66 trigram techniques
- Type safety only for archetype system
- Can't use enum for trigram techniques

### 3. Animation Mappings Incomplete

**Problem**: Animation mappings only cover 21 techniques
- 66 trigram techniques may lack animation mappings
- Unclear if animations are unique per technique
- Risk of duplicate or missing animations

### 4. System Confusion

**Problem**: Unclear which system to use when
- Combat screen uses which system?
- Training mode uses which system?
- AI uses which system?
- How do they interact?

## Recommended Solution

### Option A: Merge Systems (RECOMMENDED)

**Approach**: Create unified technique system with both archetypes and stances

**Benefits**:
- Best of both worlds
- Cultural authenticity + gameplay variety
- 87 total techniques available
- Rich combat system

**Implementation**:
1. Extend TechniqueId enum to include all 87 techniques
2. Map archetype techniques to preferred trigram stances
3. Allow players to learn trigram techniques
4. Create technique unlock progression system
5. Ensure all 87 techniques have unique animations

**Example Mapping**:
```typescript
// Musa (무사) prefers Heaven (☰ 건) stance
const MUSA_TECHNIQUES = [
  TechniqueId.MUSA_THUNDER_STRIKE,  // Archetype technique
  TechniqueId.GEON_HEAVEN_STRIKE,   // Trigram technique (learned)
  TechniqueId.GEON_HEAVENLY_FIST,   // Trigram technique (learned)
  // ...
];
```

### Option B: Document Separation

**Approach**: Keep systems separate, clarify usage

**Benefits**:
- Simpler implementation
- Clear boundaries
- No refactoring needed

**Implementation**:
1. Document when each system is used
2. Ensure both have proper animations
3. Create validation tests
4. Update documentation

### Option C: Deprecate One System

**Approach**: Choose one system, remove the other

**Not recommended**: Would lose significant work

## Animation Requirements

Regardless of chosen option, **all 87 techniques must have unique animations**:

### Animation Audit Needed

1. **Archetype Techniques (21)**
   - Check AttackAnimationType assignments
   - Verify no duplicates
   - Ensure all mapped in TECHNIQUE_TO_ANIMATION_TYPE

2. **Trigram Techniques (66)**
   - Check if animations assigned
   - Map to AnimationType
   - Ensure uniqueness

3. **Validation**
   - Create test: all techniques have animation
   - Create test: no duplicate animations
   - Create test: animations are valid types

## Next Steps

### Immediate (This PR)

1. ✅ Document both systems (this file)
2. [ ] Create technique validation tests
3. [ ] Audit animation assignments for all 87 techniques
4. [ ] Identify duplicate/missing animations
5. [ ] Document recommended path forward

### Short Term (Next PR)

1. [ ] Decide on Option A or Option B
2. [ ] If Option A: Design unified system
3. [ ] If Option B: Document system boundaries
4. [ ] Ensure 100% animation coverage
5. [ ] Create animation uniqueness tests

### Long Term

1. [ ] If Option A: Implement full integration
2. [ ] Expand to 100+ techniques (per requirement)
3. [ ] Add technique progression system
4. [ ] Create technique combo system
5. [ ] Full animation coverage validation

## Conclusion

Black Trigram has a rich foundation with 87 techniques across two systems. The key is to:

1. **Recognize** the two systems exist
2. **Document** their purposes and usage
3. **Ensure** all techniques have unique animations
4. **Decide** on integration strategy
5. **Implement** unified or documented approach

This analysis provides the foundation for making informed decisions about the technique systems moving forward.

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

**Date**: 2026-01-29
**Status**: Analysis Complete
**Action Required**: Yes - Decision on integration strategy
