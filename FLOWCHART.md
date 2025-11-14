# 🔄 Black Trigram (흑괘) Flowcharts

## 📚 Related Documentation

| Document                                      | Focus            | Description                                    |
| --------------------------------------------- | ---------------- | ---------------------------------------------- |
| [Architecture](ARCHITECTURE.md)               | 🏛️ Structure     | C4 model showing system components             |
| [Data Model](DATA_MODEL.md)                   | 📊 Data          | Type system and data structures                |
| [State Diagram](STATEDIAGRAM.md)              | 🎮 State Machine | Combat and game state transitions              |
| [Combat Architecture](COMBAT_ARCHITECTURE.md) | ⚔️ Combat System | Detailed combat mechanics implementation       |
| [Future Flowchart](FUTURE_FLOWCHART.md)       | 🔮 Evolution     | Planned workflow enhancements                  |

---

## 🎯 Overview

This document provides comprehensive flowcharts for Black Trigram (흑괘), documenting all major user flows, game processes, and system interactions. The flows use Korean cyberpunk color scheme consistent with the game's aesthetic.

---

## 🎮 User Journey Flows

### **Main User Flow**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#2979FF','primaryTextColor':'#fff','primaryBorderColor':'#0D47A1','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#FF3D00'}}}%%
flowchart TD
    Start([🎮 Launch Game]) --> Load{Loading<br/>Assets}
    
    Load -->|Success| Intro[📺 Intro Screen<br/>흑괘 Black Trigram]
    Load -->|Error| Error[❌ Error Screen<br/>Retry/Report]
    Error -->|Retry| Load
    
    Intro --> Menu{Main Menu}
    
    Menu -->|Training| Training[🥋 Training Mode]
    Menu -->|Versus| CharSelect[👤 Character Select]
    Menu -->|Tutorial| Tutorial[📚 Tutorial Mode]
    Menu -->|Settings| Settings[⚙️ Settings]
    Menu -->|Exit| Exit([🚪 Exit Game])
    
    Settings --> Menu
    
    CharSelect --> SelectArchetype{Choose Archetype}
    SelectArchetype -->|무사 Musa| Combat
    SelectArchetype -->|암살자 Amsalja| Combat
    SelectArchetype -->|해커 Hacker| Combat
    SelectArchetype -->|정보요원 Intelligence| Combat
    SelectArchetype -->|조직폭력배 Organized Crime| Combat
    
    Training --> TrainingFlow[Training Flow]
    Tutorial --> TutorialFlow[Tutorial Flow]
    
    Combat[⚔️ Combat Screen] --> Round{Round Start}
    Round --> Fight[Active Combat]
    
    Fight --> HitCheck{Attack Lands?}
    HitCheck -->|Yes| VPCheck{Vital Point<br/>Hit?}
    HitCheck -->|No| ContinueFight{Continue?}
    
    VPCheck -->|Yes| VPEffect[Apply VP Effects]
    VPCheck -->|No| RegularDmg[Regular Damage]
    
    VPEffect --> CheckKO{Knockout?}
    RegularDmg --> CheckKO
    
    CheckKO -->|Yes| RoundEnd[Round End]
    CheckKO -->|No| ContinueFight
    
    ContinueFight -->|Time Remaining| Fight
    ContinueFight -->|Time Up| RoundEnd
    
    RoundEnd --> MatchCheck{Match<br/>Complete?}
    MatchCheck -->|More Rounds| Round
    MatchCheck -->|Victory| Victory[🏆 Victory Screen]
    MatchCheck -->|Defeat| Defeat[💀 Defeat Screen]
    
    Victory --> Menu
    Defeat --> Menu
    
    style Start fill:#2979FF,stroke:#0D47A1,color:#fff
    style Intro fill:#00C853,stroke:#00796B,color:#fff
    style Combat fill:#FF3D00,stroke:#BF360C,color:#fff
    style VPCheck fill:#FFD600,stroke:#F57F17,color:#000
    style Victory fill:#00C853,stroke:#00796B,color:#fff
    style Defeat fill:#9E9E9E,stroke:#616161,color:#fff
    style Exit fill:#9C27B0,stroke:#6A1B9A,color:#fff
```

---

## ⚔️ Combat System Flows

### **Combat Round Flow**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#FF3D00','primaryTextColor':'#fff','primaryBorderColor':'#BF360C','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#2979FF'}}}%%
flowchart TD
    RoundStart([⏱️ Round Start]) --> Init[Initialize Round<br/>Reset Positions<br/>Reset Timers]
    
    Init --> Ready[Ready State<br/>3...2...1...]
    Ready --> Fight[🥊 FIGHT!]
    
    Fight --> Input{Player Input}
    
    Input -->|Attack Key| ProcessAttack[Process Attack]
    Input -->|Stance Change| ChangeStance[Change Stance]
    Input -->|Block| Block[Enter Block State]
    Input -->|Movement| Move[Update Position]
    
    ProcessAttack --> CheckStance{Valid Stance?}
    CheckStance -->|No| Input
    CheckStance -->|Yes| CheckKi{Sufficient Ki?}
    
    CheckKi -->|No| Input
    CheckKi -->|Yes| ExecuteAttack[Execute Attack]
    
    ExecuteAttack --> CalcDamage[Calculate Damage]
    CalcDamage --> CheckVP{Target is<br/>Vital Point?}
    
    CheckVP -->|No| BaseDmg[Base Damage<br/>Apply]
    CheckVP -->|Yes| CheckPrecision{Precision<br/>Sufficient?}
    
    CheckPrecision -->|No| BaseDmg
    CheckPrecision -->|Yes| VPDmg[Vital Point Damage<br/>Multiplier Applied]
    
    VPDmg --> ApplyEffects[Apply VP Effects<br/>Stun/Pain/etc]
    BaseDmg --> UpdateState[Update Player States]
    ApplyEffects --> UpdateState
    
    UpdateState --> CheckWin{Victory<br/>Condition?}
    CheckWin -->|KO| RoundEnd([🏁 Round End])
    CheckWin -->|Health 0| RoundEnd
    CheckWin -->|Time Up| RoundEnd
    CheckWin -->|Continue| Input
    
    ChangeStance --> UpdateStance[Update Current Stance<br/>Consume Ki]
    UpdateStance --> Input
    
    Block --> BlockState[Block State Active<br/>Reduce Damage]
    BlockState --> Input
    
    Move --> UpdatePos[Update Position<br/>Check Bounds]
    UpdatePos --> Input
    
    style RoundStart fill:#2979FF,stroke:#0D47A1,color:#fff
    style Fight fill:#FF3D00,stroke:#BF360C,color:#fff
    style ExecuteAttack fill:#FFD600,stroke:#F57F17,color:#000
    style VPDmg fill:#00C853,stroke:#00796B,color:#fff
    style RoundEnd fill:#9C27B0,stroke:#6A1B9A,color:#fff
```

### **Attack Resolution Flow**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#FFD600','primaryTextColor':'#000','primaryBorderColor':'#F57F17','lineColor':'#FF3D00','secondaryColor':'#00C853','tertiaryColor':'#2979FF'}}}%%
flowchart LR
    A[⚔️ Attack Input] --> B{Validate Attack}
    
    B -->|Invalid| X1[❌ Cancel Attack<br/>Play Error SFX]
    B -->|Valid| C[Consume Ki/Stamina]
    
    C --> D[Calculate Hit Box]
    D --> E{Collision<br/>Detected?}
    
    E -->|No| X2[🌀 Miss<br/>Play Woosh SFX]
    E -->|Yes| F{Defender<br/>Blocking?}
    
    F -->|Yes| G[Reduce Damage<br/>50-80%]
    F -->|No| H[Full Damage]
    
    G --> I[Calculate Final<br/>Damage]
    H --> I
    
    I --> J{Critical Hit?<br/>Roll < Crit%}
    
    J -->|Yes| K[×2 Damage<br/>✨ Critical Effect]
    J -->|No| L[Normal Damage]
    
    K --> M{Vital Point<br/>Hit?}
    L --> M
    
    M -->|Yes| N[Apply VP<br/>Multiplier<br/>3x-10x]
    M -->|No| O[Base Damage<br/>Only]
    
    N --> P[Apply Status<br/>Effects]
    O --> Q[Update Health]
    P --> Q
    
    Q --> R[Trigger Visual<br/>Effects]
    R --> S[Play Audio<br/>Feedback]
    S --> T[Update Combat<br/>Stats]
    
    T --> U[✅ Attack Complete]
    X1 --> U
    X2 --> U
    
    style A fill:#2979FF,stroke:#0D47A1,color:#fff
    style E fill:#FFD600,stroke:#F57F17,color:#000
    style M fill:#FF3D00,stroke:#BF360C,color:#fff
    style N fill:#00C853,stroke:#00796B,color:#fff
    style U fill:#9C27B0,stroke:#6A1B9A,color:#fff
```

---

## 🎯 Vital Point Targeting Flow

### **Vital Point Strike Resolution**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#00C853','primaryTextColor':'#fff','primaryBorderColor':'#00796B','lineColor':'#FF3D00','secondaryColor':'#FFD600','tertiaryColor':'#2979FF'}}}%%
flowchart TD
    Start([🎯 VP Strike Attempt]) --> CheckStance{Correct Stance<br/>for VP?}
    
    CheckStance -->|No| Penalty[⚠️ Damage Penalty<br/>-50% effectiveness]
    CheckStance -->|Yes| CheckTechnique{Technique<br/>≥ Required?}
    
    Penalty --> CheckTechnique
    
    CheckTechnique -->|No| Miss[❌ Miss VP<br/>Regular hit only]
    CheckTechnique -->|Yes| RollPrecision[🎲 Roll Precision<br/>Random(0-100)]
    
    Miss --> End([Attack Complete])
    
    RollPrecision --> ComparePrecision{Roll ≥<br/>VP.precision?}
    
    ComparePrecision -->|No| Glance[⚡ Glancing VP<br/>50% effectiveness]
    ComparePrecision -->|Yes| PerfectHit[✨ Perfect Strike<br/>Full VP effect]
    
    Glance --> ApplyDamage[Apply Damage<br/>×VP multiplier]
    PerfectHit --> ApplyDamage
    
    ApplyDamage --> DetermineSeverity{VP Severity<br/>Level}
    
    DetermineSeverity -->|Minor| MinorEffect[Minor Effect<br/>Light stun 0.5s]
    DetermineSeverity -->|Moderate| ModEffect[Moderate Effect<br/>Stun 1-2s<br/>Pain increase]
    DetermineSeverity -->|Major| MajorEffect[Major Effect<br/>Stun 3-5s<br/>Stat reduction]
    DetermineSeverity -->|Critical| CritEffect[Critical Effect<br/>Stun 5-8s<br/>Severe debuff]
    DetermineSeverity -->|Lethal| LethalEffect[⚠️ Lethal Effect<br/>Instant KO risk]
    
    MinorEffect --> ApplyStatus[Apply Status Effects]
    ModEffect --> ApplyStatus
    MajorEffect --> ApplyStatus
    CritEffect --> ApplyStatus
    LethalEffect --> ApplyStatus
    
    ApplyStatus --> CheckKO{Health ≤ 0<br/>or<br/>Consciousness ≤ 0?}
    
    CheckKO -->|Yes| KO[💀 Knockout<br/>Round End]
    CheckKO -->|No| Continue[✅ Continue Fight]
    
    KO --> End
    Continue --> End
    
    style Start fill:#2979FF,stroke:#0D47A1,color:#fff
    style PerfectHit fill:#00C853,stroke:#00796B,color:#fff
    style LethalEffect fill:#FF3D00,stroke:#BF360C,color:#fff
    style KO fill:#9E9E9E,stroke:#616161,color:#fff
    style End fill:#9C27B0,stroke:#6A1B9A,color:#fff
```

---

## 🥋 Training Mode Flow

### **Training Session Flow**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#2979FF','primaryTextColor':'#fff','primaryBorderColor':'#0D47A1','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#FF3D00'}}}%%
flowchart TD
    Start([🥋 Training Start]) --> Select{Select Training}
    
    Select -->|Vital Points| VPTraining[Vital Point<br/>Training]
    Select -->|Stances| StanceTraining[Trigram Stance<br/>Training]
    Select -->|Combos| ComboTraining[Combo<br/>Training]
    Select -->|Free Practice| FreePractice[Free Practice<br/>Mode]
    
    VPTraining --> ShowVP[Display VP<br/>Anatomy Model]
    ShowVP --> SelectVP[Player Selects<br/>Target VP]
    SelectVP --> AttemptStrike[Execute Strike]
    AttemptStrike --> Grade{Grade<br/>Accuracy}
    
    Grade -->|Perfect| Perfect[⭐ Perfect!<br/>+100 points]
    Grade -->|Good| Good[✅ Good<br/>+50 points]
    Grade -->|Poor| Poor[⚠️ Poor<br/>+10 points]
    Grade -->|Miss| Miss[❌ Miss<br/>0 points]
    
    Perfect --> ShowFeedback[Show Feedback<br/>& Statistics]
    Good --> ShowFeedback
    Poor --> ShowFeedback
    Miss --> ShowFeedback
    
    ShowFeedback --> Continue{Continue<br/>Training?}
    
    Continue -->|Yes| SelectVP
    Continue -->|No| SaveProgress[Save Progress<br/>Session Storage]
    
    StanceTraining --> ShowStances[Display 8<br/>Trigram Stances]
    ShowStances --> PracticeStance[Practice Stance<br/>Transitions]
    PracticeStance --> TimeTransition[Time Transition<br/>Speed]
    TimeTransition --> GradeTransition{Grade<br/>Transition}
    
    GradeTransition -->|Fast| FastGrade[⚡ Fast!<br/>< 0.5s]
    GradeTransition -->|Normal| NormalGrade[✅ Normal<br/>0.5-1s]
    GradeTransition -->|Slow| SlowGrade[🐢 Slow<br/>> 1s]
    
    FastGrade --> Continue2{Continue?}
    NormalGrade --> Continue2
    SlowGrade --> Continue2
    
    Continue2 -->|Yes| PracticeStance
    Continue2 -->|No| SaveProgress
    
    ComboTraining --> ShowCombo[Display Combo<br/>Sequence]
    ShowCombo --> ExecuteCombo[Execute Combo<br/>Steps]
    ExecuteCombo --> CheckCombo{Combo<br/>Correct?}
    
    CheckCombo -->|Perfect| ComboSuccess[🎯 Perfect Combo!<br/>Max points]
    CheckCombo -->|Partial| ComboPartial[⚡ Partial<br/>Some correct]
    CheckCombo -->|Failed| ComboFail[❌ Failed<br/>Retry]
    
    ComboSuccess --> Continue3{Continue?}
    ComboPartial --> Continue3
    ComboFail --> Continue3
    
    Continue3 -->|Yes| ShowCombo
    Continue3 -->|No| SaveProgress
    
    FreePractice --> PracticeLoop[Practice Freely<br/>No Restrictions]
    PracticeLoop --> CheckExit{Exit?}
    CheckExit -->|No| PracticeLoop
    CheckExit -->|Yes| SaveProgress
    
    SaveProgress --> ShowStats[Show Session<br/>Statistics]
    ShowStats --> End([🎓 Training Complete])
    
    style Start fill:#2979FF,stroke:#0D47A1,color:#fff
    style Perfect fill:#00C853,stroke:#00796B,color:#fff
    style VPTraining fill:#FFD600,stroke:#F57F17,color:#000
    style End fill:#9C27B0,stroke:#6A1B9A,color:#fff
```

---

## 🎵 Audio System Flow

### **Audio Feedback Flow**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#9C27B0','primaryTextColor':'#fff','primaryBorderColor':'#6A1B9A','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#FF3D00'}}}%%
flowchart LR
    A[Game Event] --> B{Event Type}
    
    B -->|Attack| C[Attack SFX]
    B -->|Hit| D[Impact SFX]
    B -->|VP Hit| E[VP Strike SFX]
    B -->|Block| F[Block SFX]
    B -->|Stance Change| G[Stance SFX]
    B -->|KO| H[KO SFX]
    B -->|UI| I[Menu SFX]
    
    C --> J{Check Volume<br/>Settings}
    D --> J
    E --> J
    F --> J
    G --> J
    H --> J
    I --> J
    
    J -->|Muted| X[Skip Audio]
    J -->|Active| K[Load Sound]
    
    K --> L{Sound<br/>Loaded?}
    
    L -->|No| M[Load from<br/>Audio Assets]
    L -->|Yes| N[Use Cached<br/>Sound]
    
    M --> O[Cache Sound]
    N --> P[Apply Volume]
    O --> P
    
    P --> Q[Play Sound]
    Q --> R[Track Playing<br/>Sounds]
    
    R --> S{Max Sounds<br/>Exceeded?}
    
    S -->|Yes| T[Stop Oldest<br/>Sound]
    S -->|No| U[Continue]
    
    T --> U
    U --> V[✅ Audio Complete]
    X --> V
    
    style A fill:#2979FF,stroke:#0D47A1,color:#fff
    style E fill:#FF3D00,stroke:#BF360C,color:#fff
    style Q fill:#00C853,stroke:#00796B,color:#fff
    style V fill:#9C27B0,stroke:#6A1B9A,color:#fff
```

---

## 🔄 State Synchronization Flow

### **State Update Flow**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#00C853','primaryTextColor':'#fff','primaryBorderColor':'#00796B','lineColor':'#2979FF','secondaryColor':'#FFD600','tertiaryColor':'#FF3D00'}}}%%
flowchart TD
    Input([User Input]) --> Validate{Validate<br/>Input}
    
    Validate -->|Invalid| Reject[Reject Input<br/>Show Error]
    Validate -->|Valid| Process[Process Action]
    
    Reject --> End([End])
    
    Process --> CalcNewState[Calculate New<br/>State]
    CalcNewState --> CheckRules{Game Rules<br/>Valid?}
    
    CheckRules -->|No| Reject
    CheckRules -->|Yes| CreateState[Create New<br/>Immutable State]
    
    CreateState --> UpdateReact[Update React<br/>State]
    UpdateReact --> TriggerEffects[Trigger Side<br/>Effects]
    
    TriggerEffects --> Audio[Audio Updates]
    TriggerEffects --> Visual[Visual Updates]
    TriggerEffects --> UI[UI Updates]
    
    Audio --> Sync[Synchronize<br/>All Updates]
    Visual --> Sync
    UI --> Sync
    
    Sync --> Render[Render Frame]
    Render --> End
    
    style Input fill:#2979FF,stroke:#0D47A1,color:#fff
    style CreateState fill:#00C853,stroke:#00796B,color:#fff
    style Render fill:#9C27B0,stroke:#6A1B9A,color:#fff
    style End fill:#FFD600,stroke:#F57F17,color:#000
```

---

## 📊 Asset Loading Flow

### **Game Initialization Flow**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#FFD600','primaryTextColor':'#000','primaryBorderColor':'#F57F17','lineColor':'#00C853','secondaryColor':'#2979FF','tertiaryColor':'#FF3D00'}}}%%
flowchart TD
    Start([🚀 App Start]) --> CheckCache{Assets<br/>Cached?}
    
    CheckCache -->|Yes| LoadCached[Load from<br/>Browser Cache]
    CheckCache -->|No| LoadRemote[Load from CDN]
    
    LoadCached --> VerifyCache{Cache<br/>Valid?}
    
    VerifyCache -->|No| LoadRemote
    VerifyCache -->|Yes| InitAudio[Initialize<br/>Audio System]
    
    LoadRemote --> Progress[Show Loading<br/>Progress]
    Progress --> DownloadAssets{Download<br/>Success?}
    
    DownloadAssets -->|No| Retry{Retry<br/>Count < 3?}
    DownloadAssets -->|Yes| CacheAssets[Cache Assets<br/>Locally]
    
    Retry -->|Yes| LoadRemote
    Retry -->|No| ErrorScreen[❌ Loading Error<br/>Offline Mode?]
    
    ErrorScreen --> End([Exit/Retry])
    
    CacheAssets --> InitAudio
    
    InitAudio --> InitPixi[Initialize<br/>PixiJS Renderer]
    InitPixi --> InitGame[Initialize<br/>Game Systems]
    
    InitGame --> Combat[Combat System]
    InitGame --> Trigram[Trigram System]
    InitGame --> VP[Vital Point System]
    
    Combat --> Ready{All Systems<br/>Ready?}
    Trigram --> Ready
    VP --> Ready
    
    Ready -->|No| Wait[Wait for<br/>Initialization]
    Ready -->|Yes| Complete[✅ Ready to Play]
    
    Wait --> Ready
    Complete --> ShowIntro[Show Intro<br/>Screen]
    ShowIntro --> GameLoop([⚡ Enter Game Loop])
    
    style Start fill:#2979FF,stroke:#0D47A1,color:#fff
    style LoadRemote fill:#FFD600,stroke:#F57F17,color:#000
    style Complete fill:#00C853,stroke:#00796B,color:#fff
    style GameLoop fill:#9C27B0,stroke:#6A1B9A,color:#fff
```

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram through Process Flow_

These flowcharts document the complete user journey and system processes for Black Trigram, ensuring comprehensive understanding of game mechanics and state transitions for authentic Korean martial arts combat simulation.
