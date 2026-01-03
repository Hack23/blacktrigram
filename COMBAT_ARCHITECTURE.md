# Black Trigram (흑괘) – Combat System Architecture

**2D Realistic Precision Combat Simulator** rooted in Korean martial arts and I Ching philosophy.

- **Audio-Visual Feedback**: 국악 (traditional Korean instruments) blended with cyberpunk aesthetics for immersive combat cues.
- **Anatomical Targeting**: 70 vital points with realistic damage calculation
- **Cultural Authenticity**: Traditional Korean martial arts with modern implementation
- **Dark Ops Integration**: 15 specialized techniques from Korean special operations units
- **Injury-Based Movement Penalties**: Realistic leg/body damage affects movement speed and stance changes

**Latest Update**: 
- **December 2024**: Added Dark Ops unit combat techniques (암흑작전부대 기술) for tactical assassination and silent incapacitation methods used by Korean special operations forces.
- **December 2024**: Implemented Injury-Based Movement Penalty System (이동 패널티 시스템) for realistic leg damage affecting mobility, stance changes, and balance.

Below, we define the Combat System's architecture in detail.

---

## 🔧 Core Combat System Architecture

```mermaid
graph TB
    subgraph "Combat System Controller (src/systems/CombatSystem.ts)"
        CSC[CombatSystemController]:::core
        CSC --> TCS[TrigramSystemFactory]:::trigram
        CSC --> VPS[VitalPointSystemFactory]:::vital
        CSC --> KTS[KoreanTechniqueSystemFactory]:::tech
        CSC --> DCS[DamageCalculationEngine]:::damage
        CSC --> AFS[AudioFeedbackSystem]:::audio
    end

    subgraph "Type System Foundation"
        TS[Type System]:::types
        TS --> CT[Combat Types]:::types
        TS --> PT[Player Types]:::types
        TS --> AT[Anatomy Types]:::types
        TS --> TT[Trigram Types]:::types
        TS --> AuT[Audio Types]:::types
    end

    subgraph "Trigram Combat Engine (src/systems/TrigramSystem.ts)"
        TCS --> SM[StanceManager]:::trigram
        TCS --> TC[TrigramCalculator]:::trigram
        TCS --> TR[TransitionCalculator]:::trigram
        TCS --> KC[KoreanCulture]:::trigram
        TCS --> KT[KoreanTechniques]:::trigram
    end

    subgraph "Vital Point System (src/systems/VitalPointSystem.ts)"
        VPS --> KA[KoreanAnatomy]:::vital
        VPS --> KVP[KoreanVitalPoints]:::vital
        VPS --> AR[AnatomicalRegions]:::vital
        VPS --> HD[HitDetection]:::vital
        VPS --> DC[DamageCalculator]:::vital
    end

    subgraph "Component Layer"
        CMP[Combat Components]:::components
        CMP --> CS[CombatScreen]:::components
        CMP --> CA[CombatArena]:::components
        CMP --> CH[CombatHUD]:::components
        CMP --> CC[CombatControls]:::components
    end

    classDef core fill:#00ffd0,stroke:#333,color:#000,stroke-width:3px
    classDef trigram fill:#ffd700,stroke:#333,color:#000,stroke-width:2px
    classDef vital fill:#ff6b6b,stroke:#333,color:#000,stroke-width:2px
    classDef tech fill:#4caf50,stroke:#333,color:#000,stroke-width:2px
    classDef damage fill:#ff8c00,stroke:#333,color:#000,stroke-width:2px
    classDef audio fill:#87CEFA,stroke:#333,color:#000,stroke-width:2px
    classDef types fill:#9370db,stroke:#333,color:#000,stroke-width:2px
    classDef components fill:#32cd32,stroke:#333,color:#000,stroke-width:2px

    CSC -.->|uses| TS
    CMP -.->|implements| CSC
```

---

## 🎯 Combat System Controller Architecture

- **CombatSystemController** (`src/systems/CombatSystem.ts`):
  - **Status**: Currently empty, needs full implementation
  - **Planned Methods**:
    - `executeKoreanTechnique(attacker, techniqueName, target)`: Execute authentic Korean martial arts techniques
    - `calculateTrigramAdvantage(attackerStance, defenderStance)`: I Ching-based stance effectiveness
    - `processVitalPointHit(targetState, hitPosition, technique)`: Anatomical damage calculation
    - `validateTechnique(playerState, techniqueName)`: Check stance compatibility and resources
    - `update(deltaTime, playerInputs)`: 60 FPS combat state advancement

---

## ☰ Trigram Combat System (팔괘 무술 체계)

```mermaid
graph LR
    subgraph "Eight Trigram Stances (팔괘)"
        G[☰ 건 Geon<br/>Heaven]:::geon
        T[☱ 태 Tae<br/>Lake]:::tae
        L[☲ 리 Li<br/>Fire]:::li
        J[☳ 진 Jin<br/>Thunder]:::jin
        S[☴ 손 Son<br/>Wind]:::son
        GA[☵ 감 Gam<br/>Water]:::gam
        GN[☶ 간 Gan<br/>Mountain]:::gan
        GO[☷ 곤 Gon<br/>Earth]:::gon
    end

    subgraph "Trigram System Components"
        SM[StanceManager]:::sys
        TC[TrigramCalculator]:::sys
        TR[TransitionCalculator]:::sys
        KT[KoreanTechniques]:::sys
    end

    G --> SM
    T --> SM
    L --> SM
    J --> SM
    S --> SM
    GA --> SM
    GN --> SM
    GO --> SM

    SM --> TC
    TC --> TR
    TR --> KT

    classDef geon fill:#ffd700,stroke:#333,color:#000
    classDef tae fill:#87ceeb,stroke:#333,color:#000
    classDef li fill:#ff4500,stroke:#333,color:#fff
    classDef jin fill:#9370db,stroke:#333,color:#fff
    classDef son fill:#98fb98,stroke:#333,color:#000
    classDef gam fill:#4169e1,stroke:#333,color:#fff
    classDef gan fill:#8b4513,stroke:#333,color:#fff
    classDef gon fill:#654321,stroke:#333,color:#fff
    classDef sys fill:#333,stroke:#ffd700,color:#ffd700,stroke-width:2px
```

### Current Implementation Status:

- **StanceManager** (`src/systems/trigram/StanceManager.ts`): ❌ Empty - needs full implementation
- **TrigramCalculator** (`src/systems/trigram/TrigramCalculator.ts`): ❌ Empty - needs stance effectiveness matrix
- **TransitionCalculator** (`src/systems/trigram/TransitionCalculator.ts`): ❌ Empty - needs Ki/Stamina cost calculation
- **KoreanTechniques** (`src/systems/trigram/KoreanTechniques.ts`): ❌ Empty - needs authentic technique database
- **KoreanCulture** (`src/systems/trigram/KoreanCulture.ts`): ❌ Empty - needs cultural context system

---

## 🎯 Vital Point Targeting System (급소 타격 체계)

```mermaid
graph TB
    subgraph "70 Vital Points (급소)"
        VPS[VitalPointSystem]:::vital
        VPS --> HEAD[머리 Head<br/>10 points]:::head
        VPS --> NECK[목 Neck<br/>8 points]:::neck
        VPS --> TORSO[몸통 Torso<br/>20 points]:::torso
        VPS --> ARMS[팔 Arms<br/>16 points]:::arms
        VPS --> LEGS[다리 Legs<br/>16 points]:::legs
    end

    subgraph "Anatomical Systems"
        KA[KoreanAnatomy]:::anatomy
        KVP[KoreanVitalPoints]:::anatomy
        AR[AnatomicalRegions]:::anatomy
        HD[HitDetection]:::anatomy
        DC[DamageCalculator]:::anatomy
    end

    HEAD --> KA
    NECK --> KA
    TORSO --> KA
    ARMS --> KA
    LEGS --> KA

    KA --> KVP
    KVP --> AR
    AR --> HD
    HD --> DC

    classDef vital fill:#ff6b6b,stroke:#333,color:#fff,stroke-width:2px
    classDef head fill:#ff0000,stroke:#333,color:#fff
    classDef neck fill:#ff4500,stroke:#333,color:#fff
    classDef torso fill:#ffa500,stroke:#333,color:#000
    classDef arms fill:#90ee90,stroke:#333,color:#000
    classDef legs fill:#87ceeb,stroke:#333,color:#000
    classDef anatomy fill:#333,stroke:#ff6b6b,color:#ff6b6b,stroke-width:2px
```

### Current Implementation Status:

- **VitalPointSystem** (`src/systems/VitalPointSystem.ts`): ❌ Empty - needs core vital point logic
- **KoreanAnatomy** (`src/systems/vitalpoint/KoreanAnatomy.ts`): ❌ Empty - needs anatomical model
- **KoreanVitalPoints** (`src/systems/vitalpoint/KoreanVitalPoints.ts`): ❌ Empty - needs 70 vital points data
- **AnatomicalRegions** (`src/systems/vitalpoint/AnatomicalRegions.ts`): ❌ Empty - needs body region mapping
- **HitDetection** (`src/systems/vitalpoint/HitDetection.ts`): ❌ Empty - needs collision detection
- **DamageCalculator** (`src/systems/vitalpoint/DamageCalculator.ts`): ❌ Empty - needs realistic damage math

---

## 👤 Player Archetype Combat Specializations (무사 유형별 전투 특화)

```mermaid
graph LR
    subgraph "Five Player Archetypes (오대 무사)"
        M[무사 Musa<br/>Traditional Warrior]:::musa
        A[암살자 Amsalja<br/>Shadow Assassin]:::amsalja
        H[해커 Hacker<br/>Cyber Warrior]:::hacker
        J[정보요원 Jeongbo<br/>Intelligence Op]:::jeongbo
        JO[조직폭력배 Jojik<br/>Organized Crime]:::jojik
    end

    subgraph "Combat Modifiers"
        CB[Combat Bonuses]:::bonus
        ST[Stance Preferences]:::stance
        TM[Technique Mastery]:::tech
        SP[Special Abilities]:::special
    end

    M --> CB
    A --> CB
    H --> CB
    J --> CB
    JO --> CB

    CB --> ST
    ST --> TM
    TM --> SP

    classDef musa fill:#ffd700,stroke:#333,color:#000
    classDef amsalja fill:#2d2d2d,stroke:#00ffff,color:#00ffff
    classDef hacker fill:#00ff41,stroke:#333,color:#000
    classDef jeongbo fill:#4169e1,stroke:#333,color:#fff
    classDef jojik fill:#8b0000,stroke:#333,color:#fff
    classDef bonus fill:#ff8c00,stroke:#333,color:#000
    classDef stance fill:#9370db,stroke:#333,color:#fff
    classDef tech fill:#32cd32,stroke:#333,color:#000
    classDef special fill:#ff1493,stroke:#333,color:#fff
```

---

## 🌑 Dark Ops Unit Combat Techniques (암흑작전부대 기술)

**Added**: December 2024 - Specialized techniques from Korean special operations forces

### Overview

The Dark Ops technique system integrates authentic Korean special operations combat methods into the game, providing 15 specialized techniques focused on silent incapacitation, tactical assassination, and nerve strike warfare.

```mermaid
graph TB
    subgraph "Dark Ops Units (암흑작전 부대)"
        DO[암흑작전부대<br/>Dark Operations Unit]:::darkops
        SC[암흑특공대<br/>Shadow Commando]:::darkops
        NF[심야작전부대<br/>Nightfall Squadron]:::darkops
        BO[블랙옵스부대<br/>Black Ops Task Force]:::darkops
        DS[심해침투부대<br/>Deep Sea Unit]:::darkops
    end
    
    subgraph "Technique Categories"
        SI[Silent Incapacitation<br/>무음 제압]:::category
        NS[Nerve Strikes<br/>신경타격]:::category
        CV[Cardiovascular<br/>혈관 차단]:::category
        RC[Respiratory Control<br/>호흡 제어]:::category
    end
    
    subgraph "Special Mechanics"
        AB[Archetype Bonus<br/>원형 보너스]:::mechanic
        NB[Night Operations<br/>야간 작전]:::mechanic
        SE[Special Effects<br/>특수 효과]:::mechanic
    end
    
    DO --> SI
    SC --> CV
    NF --> RC
    BO --> NS
    DS --> SI
    
    SI --> AB
    NS --> NB
    CV --> SE
    RC --> SE
    
    classDef darkops fill:#1a1a1a,stroke:#00ffff,color:#00ffff,stroke-width:2px
    classDef category fill:#2d2d2d,stroke:#ffd700,color:#ffd700,stroke-width:2px
    classDef mechanic fill:#404040,stroke:#ff6b6b,color:#ff6b6b,stroke-width:2px
```

### Technique Count: 15 Total

| Dark Ops Unit | Techniques | Specialization |
|--------------|------------|----------------|
| 암흑작전부대 (Dark Operations) | 3 | Silent infiltration, carotid strikes |
| 암흑특공대 (Shadow Commando) | 3 | Demolition tactics, internal trauma |
| 심야작전부대 (Nightfall Squadron) | 3 | Night operations, breathing disruption |
| 블랙옵스부대 (Black Ops Task Force) | 3 | Cyber-enhanced targeting, nerve strikes |
| 심해침투부대 (Deep Sea Unit) | 3 | Amphibious combat, chokeholds |

### Archetype Effectiveness

| Archetype | Effectiveness | Rationale |
|-----------|--------------|-----------|
| 암살자 (Amsalja) | **+30%** | Shadow Assassin specialty - silent incapacitation |
| 정보요원 (Jeongbo) | +15% | Intelligence operative espionage training |
| 해커 (Hacker) | +10% | Cyber-enhanced targeting synergy |
| 조직 (Jojik) | +5% | Ruthless pragmatism alignment |
| 무사 (Musa) | **-15%** | Dishonorable tactics conflict with warrior code |

### Night Operations Bonus

Dark Ops techniques gain time-of-day effectiveness multipliers:

- **Night** (00:00-06:00, 18:00-23:59): **+25%** effectiveness
- **Twilight** (05:00-07:00, 17:00-19:00): **+15%** effectiveness
- **Day** (06:00-18:00): Normal effectiveness

### Special Effects System

Dark Ops techniques apply unique status effects:

#### 1. Silent Attack (무음 공격)
- **Effect**: No combat alert triggered
- **Duration**: Instant
- **Usage**: Stealth infiltration scenarios

#### 2. Paralysis (마비)
- **Effect**: Temporary limb immobilization
- **Duration**: 3 seconds
- **Techniques**: Nerve strikes, brachial plexus attacks

#### 3. Unconsciousness (의식 상실)
- **Effect**: Complete incapacitation
- **Duration**: 5 seconds
- **Techniques**: Carotid strikes, temple knockouts

#### 4. Breathing Difficulty (호흡 곤란)
- **Effect**: -75% stamina regeneration
- **Duration**: 5 seconds
- **Techniques**: Throat strikes, solar plexus attacks

#### 5. Disorientation (방향 감각 상실)
- **Effect**: -50% accuracy penalty
- **Duration**: 4 seconds
- **Techniques**: Ear box strikes, jaw dislocations

### Sample Dark Ops Techniques

#### Silent Carotid Strike (은밀 경동맥 차단)
- **Unit**: Dark Operations Unit
- **Stance**: Water (감)
- **Damage**: 28
- **Accuracy**: 92%
- **Effect**: Unconsciousness within 3 seconds
- **Ki Cost**: 30 | **Stamina**: 25

#### Nerve Paralysis Strike (신경마비타격)
- **Unit**: Black Ops Task Force
- **Stance**: Fire (리)
- **Damage**: 26
- **Accuracy**: 95%
- **Effect**: Limb paralysis, 3s duration
- **Ki Cost**: 25 | **Stamina**: 20

#### Spinal Column Strike (척추타격)
- **Unit**: Deep Sea Unit
- **Stance**: Heaven (건)
- **Damage**: 40 (highest in game)
- **Accuracy**: 78%
- **Effect**: Full-body paralysis + unconsciousness
- **Ki Cost**: 35 | **Stamina**: 35

### Integration with Vital Point System

Dark Ops techniques target specific anatomical vulnerable points:

| Technique Category | Vital Point Targets |
|-------------------|---------------------|
| Nerve Strikes | Brachial plexus, femoral nerve, radial nerve |
| Cardiovascular | Carotid artery, liver, kidney |
| Respiratory | Throat, solar plexus, diaphragm |
| Neurological | Temple, spinal column, jaw |

### Balance Considerations

**Average Stats** (across 15 techniques):
- **Ki Cost**: 26.4 (balanced resource drain)
- **Stamina Cost**: 25.5 (moderate physical exertion)
- **Accuracy**: 86.5% (high precision requirement)
- **Damage**: 31.5 (above standard techniques)
- **Execution Time**: 630ms (slightly slower for precision)
- **Recovery Time**: 1025ms (longer due to complexity)

**Design Philosophy**:
- Higher resource costs than standard techniques
- Increased accuracy to reward precision gameplay
- Longer execution/recovery times for tactical balance
- Powerful effects balanced by drawbacks for non-Amsalja archetypes

---

## 🦵 Injury-Based Movement Penalty System (이동 패널티 시스템)

**Added**: December 2024 - Realistic leg and body damage affecting movement, stance changes, and combat mobility

### Overview

The Movement Penalty System implements realistic injury-based movement penalties where leg and body damage reduces movement speed, restricts stance changes, and affects balance. This system creates authentic combat trauma effects based on Korean martial arts principles where targeting legs (다리) is a fundamental combat strategy.

```mermaid
graph TB
    subgraph "Movement Penalty System (src/systems/bodypart/MovementPenaltySystem.ts)"
        MPS[MovementPenaltySystem]:::movement
        MPS --> SM[Speed Multiplier]:::calc
        MPS --> AD[Asymmetric Damage]:::calc
        MPS --> IP[Instant Penalties]:::calc
        MPS --> SC[Stance Change]:::calc
        MPS --> BS[Balance States]:::calc
    end
    
    subgraph "Body Part Health"
        BPH[BodyPartHealth]:::bodypart
        BPH --> LL[Left Leg]:::leg
        BPH --> RL[Right Leg]:::leg
        LL --> LH[Health %]:::health
        RL --> RH[Health %]:::health
    end
    
    subgraph "Movement Effects"
        ME[Movement Effects]:::effect
        ME --> NS[Normal 100%]:::normal
        ME --> LM[Limping 80%]:::limp
        ME --> SL[Severe Limp 60%]:::severe
        ME --> HB[Hobbled 40%]:::hobbled
    end
    
    BPH --> MPS
    MPS --> ME
    
    classDef movement fill:#00ff88,stroke:#333,color:#000,stroke-width:3px
    classDef calc fill:#ffd700,stroke:#333,color:#000,stroke-width:2px
    classDef bodypart fill:#ff6b6b,stroke:#333,color:#fff,stroke-width:2px
    classDef leg fill:#ff8c00,stroke:#333,color:#000,stroke-width:2px
    classDef health fill:#87ceeb,stroke:#333,color:#000
    classDef effect fill:#9370db,stroke:#333,color:#fff,stroke-width:2px
    classDef normal fill:#00ff00,stroke:#333,color:#000
    classDef limp fill:#ffff00,stroke:#333,color:#000
    classDef severe fill:#ffa500,stroke:#333,color:#000
    classDef hobbled fill:#ff0000,stroke:#333,color:#fff
```

### Movement Speed Penalties

Progressive speed reduction based on average leg health:

| Leg Health | Injury State | Speed Multiplier | Can Run | Korean Term |
|------------|--------------|------------------|---------|-------------|
| 100-70% | Normal | 1.0x (100%) | ✅ Yes | 정상 (Jeongsang) |
| 69-50% | Limping | 0.8x (80%) | ✅ Yes | 절름 (Jeolreum) |
| 49-30% | Severe Limp | 0.6x (60%) | ✅ Yes | 심한 절름 (Simhan Jeolreum) |
| <30% | Hobbled | 0.4x (40%) | ❌ No | 절뚝거림 (Jeolttukgeorim) |

**Korean Martial Arts Context**: Traditional Korean martial arts emphasize 하단 공격 (hadan gonggyeok - low attacks) targeting legs to disable opponent mobility. This system reflects authentic combat where leg damage is decisive.

### Stance Change Penalties

Damaged legs affect ability to transition between the Eight Trigram stances:

- **Legs ≥50% health**: Normal stance change speed (1.0x)
- **Legs <50% health**: Stance change takes 2x longer
- **Legs <30% health**: Cannot access advanced stances (restricted to basic stances only)

**Korean Philosophy**: The Eight Trigrams (팔괘) require solid footing and leg strength. Injured legs prevent proper stance transitions, limiting tactical options.

### Instant Penalties from Knee/Ankle Strikes

Striking specific leg vital points causes immediate severe movement impairment:

**Target Zones**:
- **무릎 (Mureup)** - Knee joint
- **발목 (Balmok)** - Ankle joint
- **아킬레스건 (Akilles-geon)** - Achilles tendon

**Effect**:
- **Speed**: 30% movement speed (0.3x multiplier)
- **Duration**: 5 seconds
- **Overrides**: Takes precedence over regular injury penalties

### Asymmetric Damage Effects

Left and right leg damage affects directional movement asymmetrically:

**Movement Penalties**:
- **Left leg injured + moving left**: 20% additional penalty (0.8x)
- **Left leg injured + moving right**: 10% additional penalty (0.9x)
- **Right leg injured + moving right**: 20% additional penalty (0.8x)
- **Right leg injured + moving left**: 10% additional penalty (0.9x)

**Combat Realism**: This creates authentic limping behavior where movement toward the injured side is more impaired, forcing tactical positioning adjustments.

### Balance State Integration

Low leg health increases vulnerability to balance-disrupting attacks:

**Balance State Transitions**:
- **Legs <30% health**: Enter VULNERABLE state (more susceptible to knockdowns)
- **Both legs <30% health**: Enter HELPLESS state (cannot maintain combat stance)

**Korean Combat Theory**: The concept of 중심 (jungsim - center/balance) is fundamental. Damaged legs compromise 하단 안정성 (hadan anjeongseon - lower body stability), increasing vulnerability.

### Performance Characteristics

**Calculation Speed**:
- **Single calculation**: <1ms
- **Average over 1000 calculations**: <1ms
- **60 FPS compatible**: ✅ Yes

**Integration Points**:
- **AI Movement**: `useCombatActions.ts` - `moveAIPlayer()` function
- **Player Movement**: Ready for integration (hook system in place)
- **Combat System**: Prepared for instant penalty triggers on vital point hits

### Implementation Status

| Feature | Status | Coverage |
|---------|--------|----------|
| Core Movement Penalty System | ✅ Complete | 38 tests |
| Speed Multiplier Calculation | ✅ Complete | 8 tests |
| Asymmetric Damage | ✅ Complete | 5 tests |
| Instant Penalties | ✅ Complete | 4 tests |
| Stance Change Penalties | ✅ Complete | 4 tests |
| Balance State Integration | ✅ Complete | 5 tests |
| AI Movement Integration | ✅ Complete | Tested |
| Player Movement Integration | 🔄 Pending | - |
| Visual Effects (Limping) | 📋 Planned | - |

### Code Example

```typescript
import { movementPenaltySystem } from "@/systems/bodypart";

// Calculate current movement penalty
const penalty = movementPenaltySystem.calculateMovementPenalty(
  bodyPartHealth,
  maxHealth,
  activeInstantPenalty
);

// Apply to movement speed
const actualSpeed = baseSpeed * penalty.speedMultiplier;

// Check if advanced stances are restricted
if (penalty.advancedStancesRestricted) {
  // Only allow basic stances
  allowedStances = BASIC_STANCES_ONLY;
}

// Check for balance state transitions
if (movementPenaltySystem.shouldEnterHelplessState(health, maxHealth)) {
  enterCombatState(CombatState.HELPLESS);
}
```

### Future Enhancements

**Visual Feedback** (Planned):
- Limping animation states favoring injured leg
- Reduced stride length based on injury severity
- Balance wobbling when turning with damaged legs
- Leg injury indicators in combat HUD

**Combat Integration** (Planned):
- Automatic instant penalty application on knee/ankle hits
- Recovery system for gradual penalty reduction
- Archetype-specific resistance (e.g., 무사 has higher leg resilience)
- Training modules for leg conditioning

---

## 🧬 Physical Attributes System (신체 속성 시스템)

**Added**: January 2025 - Realistic body dimensions and composition affecting all combat calculations

### Overview

The Physical Attributes System implements authentic biomechanics where each fighter's body dimensions (weight, limb length, muscle/fat mass, age) directly affect combat performance. Based on realistic human physiology and Korean martial arts principles, this system ensures that combat feels authentic and strategic.

```mermaid
graph TB
    subgraph "Physical Attributes System (src/data/archetypePhysicalAttributes.ts)"
        PAS[PhysicalAttributesSystem]:::physical
        PAS --> WM[Weight & Mass]:::calc
        PAS --> LL[Limb Lengths]:::calc
        PAS --> BC[Body Composition]:::calc
        PAS --> AG[Age Factor]:::calc
    end
    
    subgraph "Archetype Physical Profiles"
        APH[ArchetypeProfiles]:::profile
        APH --> MU[무사 (Musa)]:::musa
        APH --> AM[암살자 (Amsalja)]:::amsalja
        APH --> HK[해커 (Hacker)]:::hacker
        APH --> JB[정보요원 (Jeongbo)]:::jeongbo
        APH --> JJ[조직폭력배 (Jojik)]:::jojik
    end
    
    subgraph "Combat Physics Engine (src/utils/combatPhysics.ts)"
        CPE[CombatPhysicsEngine]:::engine
        CPE --> RNG[Reach Calculation]:::function
        CPE --> SPD[Movement Speed]:::function
        CPE --> DMG[Damage Modifier]:::function
        CPE --> DEF[Defense Modifier]:::function
        CPE --> STA[Stamina System]:::function
    end
    
    APH --> PAS
    PAS --> CPE
    
    classDef physical fill:#00ff88,stroke:#333,color:#000,stroke-width:3px
    classDef calc fill:#ffd700,stroke:#333,color:#000,stroke-width:2px
    classDef profile fill:#ff8c00,stroke:#333,color:#000,stroke-width:2px
    classDef musa fill:#4169e1,stroke:#333,color:#fff
    classDef amsalja fill:#2d2d2d,stroke:#00ffff,color:#00ffff
    classDef hacker fill:#00ff41,stroke:#333,color:#000
    classDef jeongbo fill:#6a5acd,stroke:#333,color:#fff
    classDef jojik fill:#8b0000,stroke:#333,color:#fff
    classDef engine fill:#9370db,stroke:#333,color:#fff,stroke-width:2px
    classDef function fill:#87ceeb,stroke:#333,color:#000
```

### Physical Attributes Components

Each fighter has six key physical attributes:

| **Attribute** | **Korean** | **Range** | **Affects** |
|---------------|-----------|-----------|-------------|
| **Weight** | 체중 (Chejung) | 55-95 kg | Movement speed (inversely), knockback resistance, throw power |
| **Leg Length** | 다리 길이 (Dari Giri) | 85-105 cm | Kick range, movement speed, sweep effectiveness |
| **Arm Length** | 팔 길이 (Pal Giri) | 65-85 cm | Punch/strike range, grappling reach, block coverage |
| **Muscle Mass** | 근육량 (Geunyuklyang) | 25-45 kg | Base damage output, stamina pool, grappling power |
| **Fat Mass** | 지방량 (Jibanglyang) | 8-20 kg | Damage absorption, stamina drain rate, mobility |
| **Age** | 나이 (Nai) | 22-45 years | Stamina recovery, Ki regeneration, technique speed |

### Archetype Physical Profiles

Each of the five player archetypes has a unique physical profile reflecting their training and combat style:

#### 무사 (Musa) - Traditional Warrior
**Philosophy**: Balanced warrior with traditional training

```
Weight: 75 kg    | Balanced strength and mobility
Legs:   95 cm    | Average kicking range
Arms:   75 cm    | Standard striking reach
Muscle: 38 kg    | High strength-to-weight ratio
Fat:    12 kg    | Low for mobility
Age:    32 years | Prime combat age
```

**Combat Characteristics**:
- Balanced across all metrics
- Reliable damage output and defense
- Consistent stamina management
- Well-rounded for prolonged combat

#### 암살자 (Amsalja) - Shadow Assassin
**Philosophy**: Lean and agile for stealth

```
Weight: 68 kg    | Lightest for stealth
Legs:   98 cm    | Longest for reach
Arms:   78 cm    | Extended precision
Muscle: 32 kg    | Lean for speed
Fat:     9 kg    | Minimal for agility
Age:    28 years | Peak reflexes
```

**Combat Characteristics**:
- **Fastest movement speed** (+14% vs Musa)
- **Longest reach** for vital point strikes
- Lower raw damage but superior precision
- Excellent stamina recovery
- Vulnerable to heavy hits

#### 해커 (Hacker) - Cyber Warrior
**Philosophy**: Average build with tech compensation

```
Weight: 70 kg    | Standard build
Legs:   92 cm    | Average range
Arms:   73 cm    | Standard reach
Muscle: 34 kg    | Moderate strength
Fat:    14 kg    | Slightly higher
Age:    26 years | Young and adaptive
```

**Combat Characteristics**:
- Average physical stats
- Relies on tech augmentation
- Good stamina recovery (youngest)
- Flexible combat style

#### 정보요원 (Jeongbo Yowon) - Intelligence Operative
**Philosophy**: Fit operative with tactical training

```
Weight: 73 kg    | Agency standard
Legs:   94 cm    | Balanced mobility
Arms:   74 cm    | Versatile reach
Muscle: 36 kg    | Functional fitness
Fat:    11 kg    | Low operational fat
Age:    34 years | Experienced
```

**Combat Characteristics**:
- Balanced attributes
- Good endurance
- Strategic fighting style
- Reliable across scenarios

#### 조직폭력배 (Jojik Pokryeokbae) - Organized Crime
**Philosophy**: Heavy and brutal street fighter

```
Weight: 85 kg    | Heaviest for power
Legs:   90 cm    | Shorter, stable
Arms:   76 cm    | Strong grappling
Muscle: 42 kg    | Maximum strength
Fat:    18 kg    | Damage absorption
Age:    36 years | Battle-hardened
```

**Combat Characteristics**:
- **Highest damage output** (+6% vs Musa)
- **Best defense** (+10% damage reduction)
- **Slowest movement** (-12% vs Musa)
- High grappling effectiveness
- Poor stamina recovery

### Combat Physics Integration

#### Reach Calculation (거리 계산)

Different attack types use different limbs with varying extensions:

| **Attack Type** | **Limb Used** | **Extension** | **Example Range** |
|----------------|---------------|---------------|-------------------|
| Kick | Leg Length | 70-100% | 63-95 cm (Musa) |
| Punch/Strike | Arm Length | 80-100% | 60-75 cm (Musa) |
| Elbow | Arm × 0.6 | 90-100% | 40-45 cm (Musa) |
| Knee | Leg × 0.6 | 90-100% | 51-57 cm (Musa) |
| Grapple/Throw | Arm Length | 40-60% | 30-45 cm (Musa) |

**Code Integration**:
```typescript
import { calculateAttackRange, isWithinAttackRange } from "@/utils/combatPhysics";

// Validate kick can reach
if (isWithinAttackRange(attacker, target, CombatAttackType.KICK, 0.9)) {
  const kickRange = calculateAttackRange(attacker, CombatAttackType.KICK, 0.9);
  executeTechnique(attacker, target, kickTechnique);
}
```

#### Movement Speed (이동 속도)

Formula: `baseSpeed × (legLength / 95) × (75 / weight)`

**Modifiers**:
- Stamina < 30%: Speed × (stamina / 30), minimum 50%
- Consciousness < 50%: Speed × (consciousness / 50), minimum 30%
- Pain > 30: Speed × (1.0 - pain/200), minimum 60%

**Archetype Comparison**:
- Amsalja: ~114 speed (fastest)
- Musa: ~100 speed (baseline)
- Jojik: ~88 speed (slowest)

#### Damage Output (공격력)

Formula: `baseDamage × muscleModifier × attackPower × technique × momentum`

**Muscle Modifier**: `1.0 + ((muscleMass - 35) / 35) × 0.3`

**Archetype Damage Multipliers**:
- Jojik: ×1.06 (highest muscle mass)
- Musa: ×1.026 (balanced)
- Amsalja: ×0.974 (lowest, compensated by precision)

#### Defense Effectiveness (방어력)

Formula: `(defenseModifier - 1.0) × 0.5 + defense/200 + blockBonus`

**Defense Modifier**: `1.0 + (fatMass / 100) + (muscleMass / 200)`

**Block Bonus**: +30% damage reduction when actively blocking

**Archetype Defense**:
- Jojik: ~0.39 (39% damage reduction)
- Musa: ~0.31 (31% damage reduction)
- Amsalja: ~0.25 (25% damage reduction)

#### Stamina System (체력 시스템)

**Drain**: `baseCost × (weight / 75) × (1.0 + (fatMass - 12) / 50)`
- Heavy fighters with high fat drain stamina faster
- Fatigue penalty: ×1.5 cost when stamina < 30%

**Recovery**: `baseRate × ageFactor × fatFactor`
- Age factor peaks at 30 years, decreases before/after
- Fat factor: Lower fat = faster recovery
- Pain penalty: Reduces recovery when pain > 20
- No recovery while stunned

**Archetype Recovery Rates** (per second):
- Amsalja: ~10.2 (best recovery)
- Musa: ~9.8 (balanced)
- Jojik: ~8.4 (slowest recovery)

#### Weight Advantage (체급 우세)

Grappling and throwing effectiveness based on weight difference:

Formula: `1.0 + ((attackerWeight - defenderWeight) / 5) × 0.05`

**Examples**:
- Jojik (85kg) vs Amsalja (68kg): +17kg = **+17% throw damage**
- Amsalja (68kg) vs Jojik (85kg): -17kg = **-17% throw damage**
- Cap: ±30% maximum advantage/disadvantage

### Performance Characteristics

**Calculation Speed**:
- Single attribute lookup: <0.1ms
- Full combat physics calculation: <1ms
- 60 FPS compatible: ✅ Yes

**Integration Points**:
- Player creation: Automatic attribute loading
- Combat actions: Real-time physics calculations
- AI behavior: Optimal distance and strategy
- Visual feedback: Reach indicators and spacing

### Implementation Status

| Feature | Status | File | Tests |
|---------|--------|------|-------|
| Physical Attributes Interface | ✅ Complete | `types/common.ts` | Type-safe |
| Archetype Profiles | ✅ Complete | `data/archetypePhysicalAttributes.ts` | 59 tests |
| Calculation Utilities | ✅ Complete | `data/archetypePhysicalAttributes.ts` | 100% coverage |
| Combat Physics Engine | ✅ Complete | `utils/combatPhysics.ts` | Documented |
| Player Integration | ✅ Complete | `utils/playerUtils.ts` | Tested |
| Combat System Hooks | 🔄 Pending | - | - |
| Visual Reach Indicators | 📋 Planned | - | - |

### Code Examples

#### Checking Attack Range
```typescript
import { isWithinAttackRange, calculateAttackRange } from "@/utils/combatPhysics";

// Before executing technique
if (isWithinAttackRange(player, opponent, CombatAttackType.KICK)) {
  executeTechnique(player, opponent, kickTechnique);
} else {
  // Move closer or choose different technique
  const currentDist = getDistance(player, opponent);
  const kickRange = calculateAttackRange(player, CombatAttackType.KICK, 0.9);
  console.log(`Need to move ${currentDist - kickRange}cm closer`);
}
```

#### Applying Physical Modifiers
```typescript
import { 
  calculatePlayerMovementSpeed,
  calculateAttackDamage,
  calculateDefenseEffectiveness
} from "@/utils/combatPhysics";

// Movement with physics
const movementSpeed = calculatePlayerMovementSpeed(player, BASE_SPEED);
movePlayer(player, direction, movementSpeed * deltaTime);

// Damage calculation
const damageMultiplier = calculateAttackDamage(attacker);
const finalDamage = baseTechniqueDamage * damageMultiplier;

// Defense application
const defenseReduction = calculateDefenseEffectiveness(defender, isBlocking);
const damageTaken = finalDamage * (1.0 - defenseReduction);
```

#### AI Optimal Spacing
```typescript
import { calculateOptimalAttackDistance } from "@/utils/combatPhysics";

// AI maintains ideal fighting distance
const optimalDistance = calculateOptimalAttackDistance(aiPlayer);
const currentDistance = getDistance(aiPlayer, opponent);

if (currentDistance > optimalDistance + 50) {
  // Move closer
  moveTowards(aiPlayer, opponent);
} else if (currentDistance < optimalDistance - 50) {
  // Back away
  moveAway(aiPlayer, opponent);
}
```

### Future Enhancements

**Visual Feedback** (Planned):
- Attack range indicators showing effective reach
- Color-coded spacing markers (green = optimal, red = too far)
- Limb extension visualizations during attacks
- Weight class indicators in HUD

**Advanced Mechanics** (Planned):
- Fatigue-based limb extension reduction
- Injury-specific reach penalties
- Stance-specific reach modifiers
- Training system for attribute improvement

---

## 🎮 Combat Component Architecture

```mermaid
graph TB
    subgraph "React Components Layer"
        CS[CombatScreen]:::react
        CS --> CA[CombatArena]:::react
        CS --> CH[CombatHUD]:::react
        CS --> CC[CombatControls]:::react
    end

    subgraph "PixiJS Rendering Layer"
        PL[Player Visuals]:::pixi
        HL[HitEffectsLayer]:::pixi
        DB[DojangBackground]:::pixi
        UI[UI Components]:::pixi
    end

    subgraph "Game Logic Layer"
        GE[GameEngine]:::logic
        PS[PlayerState]:::logic
        GS[GameState]:::logic
    end

    CS --> PL
    CA --> HL
    CH --> DB
    CC --> UI

    PL --> GE
    HL --> PS
    DB --> GS
    UI --> GE

    classDef react fill:#61dafb,stroke:#333,color:#000
    classDef pixi fill:#ff6b9d,stroke:#333,color:#fff
    classDef logic fill:#f7df1e,stroke:#333,color:#000
```

---

## 🔊 Audio System Integration

```mermaid
graph LR
    subgraph "Traditional Korean Instruments (국악)"
        GAY[가야금 Gayageum]:::traditional
        BUK[북 Buk Drums]:::traditional
        KKW[꽹과리 Kkwaenggwari]:::traditional
        HAE[해금 Haegeum]:::traditional
    end

    subgraph "Combat Audio Events"
        HIT[타격음 Hit Sounds]:::combat
        TECH[기법음 Technique Sounds]:::combat
        VITAL[급소음 Vital Point Sounds]:::combat
        STANCE[자세음 Stance Sounds]:::combat
    end

    subgraph "Cyberpunk Elements"
        SYNTH[신스 Synth Drones]:::cyber
        GLITCH[글리치 Digital Glitches]:::cyber
        NEON[네온 Neon Ambience]:::cyber
    end

    GAY --> HIT
    BUK --> TECH
    KKW --> VITAL
    HAE --> STANCE

    HIT --> SYNTH
    TECH --> GLITCH
    VITAL --> NEON
    STANCE --> SYNTH

    classDef traditional fill:#8b4513,stroke:#ffd700,color:#ffd700
    classDef combat fill:#ff4500,stroke:#333,color:#fff
    classDef cyber fill:#00ffff,stroke:#333,color:#000
```

---

## 📊 Type System Foundation

### Core Combat Types Structure:

```typescript
// Current Type System Implementation Status:

// ✅ COMPLETE - Well-defined interfaces
interface CombatResult {
  damage: number;
  hit: boolean;
  critical: boolean;
  vitalPointsHit: VitalPoint[];
  // ... comprehensive combat result data
}

// ✅ COMPLETE - Player archetype definitions
type PlayerArchetype =
  | "musa"
  | "amsalja"
  | "hacker"
  | "jeongbo_yowon"
  | "jojik_pokryeokbae";

// ✅ COMPLETE - Trigram stance system
type TrigramStance =
  | "geon"
  | "tae"
  | "li"
  | "jin"
  | "son"
  | "gam"
  | "gan"
  | "gon";

// ✅ COMPLETE - Vital point system
interface VitalPoint {
  id: string;
  name: KoreanText;
  category: VitalPointCategory;
  severity: VitalPointSeverity;
  // ... anatomical positioning and effects
}

// ❌ NEEDS IMPLEMENTATION - Combat techniques
interface KoreanTechnique {
  // Defined but needs population with authentic Korean martial arts data
}
```

---

## 🚀 Implementation Priority Matrix

### Phase 1: Core Combat Foundation (Current Priority)

1. **CombatSystemController** - Central orchestration logic
2. **StanceManager** - Trigram stance transitions and validation
3. **KoreanVitalPoints** - 70 authentic vital points database
4. **DamageCalculator** - Realistic anatomical damage calculation

### Phase 2: Trigram System (High Priority)

1. **TrigramCalculator** - I Ching effectiveness relationships
2. **TransitionCalculator** - Ki/Stamina cost calculation
3. **KoreanTechniques** - Authentic technique implementations
4. **KoreanCulture** - Philosophy integration

### Phase 3: Advanced Features (Medium Priority)

1. **HitDetection** - Precise anatomical collision detection
2. **AnatomicalRegions** - Body region mapping system
3. **Enhanced Audio** - Korean traditional instrument integration
4. **Combat Analytics** - Performance and effectiveness tracking

---

## 💡 Technical Specifications

### Performance Requirements:

- **Target FPS**: 60 FPS during intense combat
- **Memory Usage**: < 512MB for full combat simulation
- **Audio Latency**: < 100ms for responsive feedback
- **Input Lag**: < 16ms for precise control

### Cultural Authenticity Standards:

- **Korean Terminology**: Bilingual Korean-English throughout
- **Martial Arts Accuracy**: Traditional techniques with proper names
- **Philosophy Integration**: I Ching principles in combat mechanics
- **Respectful Representation**: Honor Korean martial arts heritage

### Combat Realism Targets:

- **Anatomical Accuracy**: 70 precise vital points
- **Damage Calculation**: Physics-based trauma simulation
- **Status Effects**: Pain, consciousness, balance, blood loss
- **Recovery Systems**: Realistic healing and regeneration

---

## 🎯 Success Metrics

```mermaid
graph LR
    subgraph "Combat Effectiveness Metrics"
        ACC[정확도 Accuracy<br/>85%+ hit detection]:::metric
        REA[사실성 Realism<br/>Authentic damage calc]:::metric
        CUL[문화성 Culture<br/>100% Korean terms]:::metric
        PER[성능 Performance<br/>60 FPS target]:::metric
    end

    classDef metric fill:#00ff00,stroke:#333,color:#000,stroke-width:2px
```

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

---

_This architecture document reflects the current implementation state of Black Trigram's combat system as of the latest codebase analysis. All empty system files represent planned implementations following authentic Korean martial arts principles._
