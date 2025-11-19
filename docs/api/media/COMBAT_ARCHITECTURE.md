# Black Trigram (흑괘) – Combat System Architecture

**2D Realistic Precision Combat Simulator** rooted in Korean martial arts and I Ching philosophy.

- **Audio-Visual Feedback**: 국악 (traditional Korean instruments) blended with cyberpunk aesthetics for immersive combat cues.
- **Anatomical Targeting**: 70 vital points with realistic damage calculation
- **Cultural Authenticity**: Traditional Korean martial arts with modern implementation

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
