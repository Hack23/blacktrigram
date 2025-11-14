# 🔄 Black Trigram (흑괘) — System Flowcharts

This document provides comprehensive flowchart diagrams illustrating data flows, user journeys, and system processes in the Black Trigram Korean martial arts combat simulator.

## 📚 Related Documentation

| Document | Focus | Description |
|----------|-------|-------------|
| [Architecture](ARCHITECTURE.md) | 🏛️ System | C4 model and system structure |
| [DATA_MODEL](DATA_MODEL.md) | 📊 Data | Game data structures and interfaces |
| [STATEDIAGRAM](STATEDIAGRAM.md) | 🎯 States | State machine transitions |
| [Combat Architecture](COMBAT_ARCHITECTURE.md) | ⚔️ Combat | Detailed combat system design |

---

## 🎮 User Journey Flow

### **Complete Player Journey**

```mermaid
flowchart TD
    START([Player Opens App]) --> LOAD[Loading Screen]
    LOAD --> INIT{Assets Loaded?}
    INIT -->|No| ERR[Display Error]
    INIT -->|Yes| INTRO[Intro Screen]
    
    INTRO --> CHOICE{Player Action?}
    CHOICE -->|Start Combat| SELECT[Character Select]
    CHOICE -->|Training| TRAIN[Training Mode]
    CHOICE -->|Settings| SETTINGS[Settings Screen]
    
    SELECT --> ARCHETYPE[Choose Archetype]
    ARCHETYPE --> COMBAT[Combat Screen]
    
    COMBAT --> FIGHT{Combat Loop}
    FIGHT -->|Continue| FIGHT
    FIGHT -->|Round End| ROUND_END{Match Over?}
    
    ROUND_END -->|No| COMBAT
    ROUND_END -->|Yes| RESULT[Match Result]
    
    RESULT --> FINAL{Continue?}
    FINAL -->|Rematch| COMBAT
    FINAL -->|Menu| INTRO
    FINAL -->|Quit| END([Exit])
    
    TRAIN --> PRACTICE[Practice Techniques]
    PRACTICE --> TRAIN_RESULT{Continue Training?}
    TRAIN_RESULT -->|Yes| PRACTICE
    TRAIN_RESULT -->|No| INTRO
    
    ERR --> RETRY{Retry?}
    RETRY -->|Yes| LOAD
    RETRY -->|No| END
    
    style START fill:#00ff88,stroke:#00cc44
    style END fill:#ff4444,stroke:#cc0000,color:#fff
    style COMBAT fill:#00ccff,stroke:#0088cc
    style ERR fill:#ffaa00,stroke:#ff8800
```

---

## ⚔️ Combat Flow Diagrams

### **Combat Turn Resolution**

```mermaid
flowchart TD
    START([Combat Turn Starts]) --> INPUT[Player Input Detected]
    INPUT --> VALIDATE{Valid Input?}
    VALIDATE -->|No| START
    VALIDATE -->|Yes| ACTION{Action Type?}
    
    ACTION -->|Stance Change| STANCE[Change Stance]
    ACTION -->|Attack| ATTACK[Execute Technique]
    ACTION -->|Block| BLOCK[Enter Guard]
    ACTION -->|Move| MOVE[Update Position]
    
    STANCE --> COST1[Deduct Ki/Stamina]
    COST1 --> UPDATE_STATE[Update Player State]
    
    ATTACK --> SELECT_TECH[Select Technique]
    SELECT_TECH --> CHECK_RES{Resources OK?}
    CHECK_RES -->|No| FAIL[Action Failed]
    CHECK_RES -->|Yes| COST2[Deduct Resources]
    COST2 --> HIT_CALC[Calculate Hit]
    
    HIT_CALC --> HIT_CHECK{Hit Landed?}
    HIT_CHECK -->|No| MISS[Miss Effect]
    HIT_CHECK -->|Yes| VP_CHECK{Vital Point?}
    
    VP_CHECK -->|No| NORMAL_DMG[Calculate Damage]
    VP_CHECK -->|Yes| VP_DMG[Enhanced Damage]
    
    VP_DMG --> STATUS{Apply Status?}
    STATUS -->|Yes| APPLY_STATUS[Add Status Effect]
    STATUS -->|No| APPLY_DMG[Apply Damage]
    
    NORMAL_DMG --> APPLY_DMG
    APPLY_STATUS --> APPLY_DMG
    
    APPLY_DMG --> AUDIO[Play Audio]
    AUDIO --> VISUAL[Render Effects]
    VISUAL --> UPDATE_STATE
    
    BLOCK --> BLOCK_STATE[Update Guard State]
    BLOCK_STATE --> UPDATE_STATE
    
    MOVE --> UPDATE_POS[Update Position]
    UPDATE_POS --> UPDATE_STATE
    
    MISS --> UPDATE_STATE
    FAIL --> UPDATE_STATE
    
    UPDATE_STATE --> CHECK_WIN{Win Condition?}
    CHECK_WIN -->|Yes| VICTORY([Round End])
    CHECK_WIN -->|No| NEXT_TURN[Next Frame]
    
    NEXT_TURN --> START
    
    style START fill:#00ff88,stroke:#00cc44
    style VICTORY fill:#ffd700,stroke:#ffaa00,color:#000
    style HIT_CHECK fill:#00ccff,stroke:#0088cc
    style VP_DMG fill:#ff4444,stroke:#cc0000,color:#fff
```

### **Damage Calculation Flow**

```mermaid
flowchart LR
    A[Technique Executed] --> B[Base Damage]
    B --> C{Critical Hit?}
    C -->|Yes| D[Apply 2x Multiplier]
    C -->|No| E[Normal Damage]
    
    D --> F[Check Vital Point]
    E --> F
    
    F --> G{Vital Point Hit?}
    G -->|Yes| H[Apply VP Multiplier]
    G -->|No| I[Calculate Stance Bonus]
    
    H --> J[Add Status Effects]
    J --> K[Apply Defender Defense]
    
    I --> K
    K --> L[Final Damage]
    
    L --> M[Update Health]
    M --> N[Check Balance Impact]
    N --> O[Update Consciousness]
    
    style A fill:#00ccff,stroke:#0088cc
    style L fill:#ffd700,stroke:#ffaa00,color:#000
    style D fill:#ff4444,stroke:#cc0000,color:#fff
    style H fill:#ff4444,stroke:#cc0000,color:#fff
```

---

## 🎯 Vital Point Targeting Flow

```mermaid
flowchart TD
    START[Player Enters Target Mode] --> DISPLAY[Display Vital Points Overlay]
    DISPLAY --> WAIT{Player Input?}
    
    WAIT -->|Cancel| EXIT[Exit Target Mode]
    WAIT -->|Select VP| TARGET[Target Selected]
    
    TARGET --> CALC[Calculate Accuracy]
    CALC --> PRECISION{Precision Check}
    
    PRECISION -->|< Threshold| MISS[Miss Vital Point]
    PRECISION -->|>= Threshold| HIT[Hit Vital Point]
    
    HIT --> VERIFY[Verify Stance Match]
    VERIFY --> BONUS{Stance Bonus?}
    
    BONUS -->|Yes| ENHANCED[Enhanced Effect]
    BONUS -->|No| NORMAL[Normal Effect]
    
    ENHANCED --> APPLY_VP[Apply VP Effects]
    NORMAL --> APPLY_VP
    
    APPLY_VP --> DURATION[Set Effect Duration]
    DURATION --> STATUS_FX[Add Status Effect]
    STATUS_FX --> DMG[Calculate VP Damage]
    
    DMG --> AUDIO[Play Impact Sound]
    AUDIO --> VISUAL[Render VP Effect]
    
    MISS --> FALLBACK[Standard Attack]
    FALLBACK --> AUDIO
    
    VISUAL --> END([Return to Combat])
    EXIT --> END
    
    style START fill:#00ccff,stroke:#0088cc
    style HIT fill:#00ff88,stroke:#00cc44
    style ENHANCED fill:#ffd700,stroke:#ffaa00,color:#000
    style MISS fill:#ffaa00,stroke:#ff8800
```

---

## 🔄 Stance Transition Flow

```mermaid
flowchart LR
    A[Player Presses 1-8] --> B[Identify Stance]
    B --> C{Same Stance?}
    C -->|Yes| D[No Change]
    C -->|No| E[Check Transition]
    
    E --> F{Valid Transition?}
    F -->|No| G[Show Warning]
    F -->|Yes| H[Check Resources]
    
    H --> I{Ki/Stamina OK?}
    I -->|No| J[Insufficient Resources]
    I -->|Yes| K[Deduct Costs]
    
    K --> L[Begin Transition]
    L --> M[Play Animation]
    M --> N[Update Stance]
    N --> O[Apply Bonuses]
    
    O --> P[Update UI]
    P --> Q[Play Sound]
    Q --> R([Transition Complete])
    
    D --> R
    G --> R
    J --> R
    
    style A fill:#00ccff,stroke:#0088cc
    style N fill:#ffd700,stroke:#ffaa00,color:#000
    style R fill:#00ff88,stroke:#00cc44
```

---

## 📊 Audio System Flow

```mermaid
flowchart TD
    EVENT[Combat Event Triggered] --> TYPE{Event Type?}
    
    TYPE -->|Attack| ATK[Attack Sound Category]
    TYPE -->|Hit| HIT[Hit Sound Category]
    TYPE -->|Block| BLK[Block Sound]
    TYPE -->|Stance| STN[Stance Change Sound]
    
    ATK --> ATK_SEV{Severity?}
    ATK_SEV -->|Light| SFX1[attack_light]
    ATK_SEV -->|Medium| SFX2[attack_medium]
    ATK_SEV -->|Heavy| SFX3[attack_heavy]
    ATK_SEV -->|Critical| SFX4[attack_critical]
    
    HIT --> HIT_SEV{Impact Level?}
    HIT_SEV -->|Light| SFX5[hit_light]
    HIT_SEV -->|Medium| SFX6[hit_medium]
    HIT_SEV -->|Heavy| SFX7[hit_heavy]
    HIT_SEV -->|Critical| SFX8[critical_hit]
    
    BLK --> SFX9[block_success]
    STN --> SFX10[stance_change]
    
    SFX1 & SFX2 & SFX3 & SFX4 & SFX5 & SFX6 & SFX7 & SFX8 & SFX9 & SFX10 --> PLAY[Play via Howler.js]
    
    PLAY --> VOLUME[Apply Volume]
    VOLUME --> SPATIAL[Apply 3D Position]
    SPATIAL --> OUTPUT[Audio Output]
    
    style EVENT fill:#00ccff,stroke:#0088cc
    style SFX4 fill:#ff4444,stroke:#cc0000,color:#fff
    style SFX8 fill:#ff4444,stroke:#cc0000,color:#fff
    style OUTPUT fill:#00ff88,stroke:#00cc44
```

---

## 🎨 Visual Effects Flow

```mermaid
flowchart LR
    A[Combat Result] --> B{Effect Type?}
    B -->|Impact| C[Create Impact Particles]
    B -->|Blood| D[Create Blood Effect]
    B -->|Energy| E[Create Energy Glow]
    B -->|Critical| F[Create Flash Effect]
    
    C --> G[Set Position]
    D --> G
    E --> G
    F --> G
    
    G --> H[Set Velocity]
    H --> I[Set Lifetime]
    I --> J[Add to Scene]
    
    J --> K[Update Loop]
    K --> L{Still Alive?}
    L -->|Yes| M[Update Position]
    L -->|No| N[Remove from Scene]
    
    M --> O[Update Alpha]
    O --> P[Update Size]
    P --> K
    
    N --> Q[Cleanup]
    
    style A fill:#00ccff,stroke:#0088cc
    style F fill:#ffd700,stroke:#ffaa00,color:#000
    style Q fill:#00ff88,stroke:#00cc44
```

---

## 🧠 AI Decision Flow (Training Mode)

```mermaid
flowchart TD
    START[AI Turn] --> ASSESS[Assess Situation]
    ASSESS --> HEALTH{Health Status?}
    
    HEALTH -->|Low| DEFENSIVE[Defensive Strategy]
    HEALTH -->|Medium| BALANCED[Balanced Strategy]
    HEALTH -->|High| AGGRESSIVE[Aggressive Strategy]
    
    DEFENSIVE --> DEF_ACTION{Choose Action}
    DEF_ACTION -->|Priority| BLOCK_AI[Block/Guard]
    DEF_ACTION -->|Secondary| EVADE[Move Away]
    DEF_ACTION -->|Tertiary| COUNTER[Counter Attack]
    
    BALANCED --> BAL_ACTION{Evaluate Opening}
    BAL_ACTION -->|Opening| ATTACK_AI[Execute Attack]
    BAL_ACTION -->|Guarded| STANCE_AI[Change Stance]
    BAL_ACTION -->|Neutral| WAIT_AI[Wait for Opening]
    
    AGGRESSIVE --> AGG_ACTION{Choose Attack}
    AGG_ACTION -->|VP Available| VP_ATTACK[Target Vital Point]
    AGG_ACTION -->|Combo| COMBO_AI[Execute Combo]
    AGG_ACTION -->|Simple| BASIC_AI[Basic Attack]
    
    BLOCK_AI --> EXECUTE[Execute Action]
    EVADE --> EXECUTE
    COUNTER --> EXECUTE
    ATTACK_AI --> EXECUTE
    STANCE_AI --> EXECUTE
    WAIT_AI --> EXECUTE
    VP_ATTACK --> EXECUTE
    COMBO_AI --> EXECUTE
    BASIC_AI --> EXECUTE
    
    EXECUTE --> RESULT[Process Result]
    RESULT --> LEARN[Update AI State]
    LEARN --> END([Turn Complete])
    
    style START fill:#00ccff,stroke:#0088cc
    style VP_ATTACK fill:#ff4444,stroke:#cc0000,color:#fff
    style END fill:#00ff88,stroke:#00cc44
```

---

## 🔧 Asset Loading Flow

```mermaid
flowchart TD
    START([App Initialization]) --> MANIFEST[Load Asset Manifest]
    MANIFEST --> CHECK_CACHE{Assets Cached?}
    
    CHECK_CACHE -->|Yes| VERIFY[Verify Integrity]
    CHECK_CACHE -->|No| DOWNLOAD[Download Assets]
    
    VERIFY --> VALID{Valid?}
    VALID -->|Yes| LOAD_CACHED[Load from Cache]
    VALID -->|No| DOWNLOAD
    
    DOWNLOAD --> PROGRESS[Update Progress Bar]
    PROGRESS --> STORE_CACHE[Store in Cache]
    STORE_CACHE --> LOAD[Load Assets]
    
    LOAD_CACHED --> LOAD
    
    LOAD --> PARSE[Parse Assets]
    PARSE --> TYPES{Asset Type?}
    
    TYPES -->|Image| IMG[Create Texture]
    TYPES -->|Audio| AUD[Load Audio Buffer]
    TYPES -->|Font| FONT[Load Font]
    TYPES -->|Data| DATA[Parse JSON]
    
    IMG --> REGISTER[Register Asset]
    AUD --> REGISTER
    FONT --> REGISTER
    DATA --> REGISTER
    
    REGISTER --> COMPLETE{All Loaded?}
    COMPLETE -->|No| PROGRESS
    COMPLETE -->|Yes| READY([Assets Ready])
    
    style START fill:#00ccff,stroke:#0088cc
    style READY fill:#00ff88,stroke:#00cc44
    style DOWNLOAD fill:#ffaa00,stroke:#ff8800
```

---

## 📱 Input Handling Flow

```mermaid
flowchart LR
    A[Input Event] --> B{Input Type?}
    B -->|Keyboard| C[Key Handler]
    B -->|Touch| D[Touch Handler]
    B -->|Gamepad| E[Gamepad Handler]
    
    C --> F{Key Code?}
    F -->|1-8| G[Stance Change]
    F -->|Space| H[Execute Technique]
    F -->|Shift| I[Block/Guard]
    F -->|Ctrl| J[Target Mode]
    F -->|WASD| K[Movement]
    F -->|Esc| L[Pause]
    
    D --> M[Touch Position]
    M --> N{Touch Area?}
    N -->|Stance Wheel| G
    N -->|Attack Button| H
    N -->|Movement Pad| K
    N -->|Vital Point| J
    
    E --> O[Gamepad State]
    O --> P{Button/Axis?}
    P -->|D-Pad| G
    P -->|Face Buttons| H
    P -->|Triggers| I
    P -->|Stick| K
    
    G & H & I & J & K & L --> Q[Validate Input]
    Q --> R[Queue Action]
    R --> S[Process Next Frame]
    
    style A fill:#00ccff,stroke:#0088cc
    style S fill:#00ff88,stroke:#00cc44
```

---

**📋 Document Control:**  
**✅ Approved by:** CEO  
**📤 Distribution:** Public  
**🏷️ Classification:** Public  
**📅 Effective Date:** 2025-11-14  
**⏰ Next Review:** 2026-11-14  
**🎯 Compliance:** ISO 27001 (A.8.9), NIST CSF (PR.IP-1)
