# 🔄 Black Trigram (흑괘) Flowcharts

**Last Updated:** 2026-04-21  
**Product Version:** 0.7.32  
**Status:** Production-Ready

**🔐 ISMS Alignment:** This document follows [Hack23 Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) architecture documentation requirements.

## 📚 Related Documentation

| Document                                      | Focus            | Description                              |
| --------------------------------------------- | ---------------- | ---------------------------------------- |
| [Architecture](ARCHITECTURE.md)               | 🏛️ Structure     | C4 model showing system components       |
| [Data Model](DATA_MODEL.md)                   | 📊 Data          | Type system and data structures          |
| [State Diagram](STATEDIAGRAM.md)              | 🎮 State Machine | Combat and game state transitions        |
| [Combat Architecture](COMBAT_ARCHITECTURE.md) | ⚔️ Combat System | Detailed combat mechanics implementation |
| [Future Flowchart](FUTURE_FLOWCHART.md)       | 🔮 Evolution     | Planned workflow enhancements            |

---

## 🎯 Overview

This document provides comprehensive flowcharts for Black Trigram (흑괘), documenting all major user flows, game processes, and system interactions. The flows use Korean cyberpunk color scheme consistent with the game's aesthetic.

**Flowchart Index:**
- [Main User Flow](#main-user-flow) — Complete game navigation from launch to combat
- [Training Mode Flow](#training-mode-flow) — Practice modes, drills, and feedback
- [Pause Menu Flow](#pause-menu-flow) — In-combat pause navigation and settings
- [Rematch Flow](#rematch-flow) — Post-match rematch and archetype re-selection
- [Combat Round Flow](#combat-round-flow) — Round initialization through completion
- [Attack Resolution Flow](#attack-resolution-flow) — Damage calculation pipeline
- [Vital Point Strike Flow](#vital-point-strike-resolution-70-targets) — VP targeting mechanics
- Cross-reference: [State Diagrams](STATEDIAGRAM.md) for state transitions, [Data Model](DATA_MODEL.md) for type definitions

---

## 🎮 User Journey Flows

### **Main User Flow**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#2979FF','primaryTextColor':'#fff','primaryBorderColor':'#0D47A1','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#FF3D00'}}}%%
flowchart TD
    Start(["🎮 Launch Game"]) --> Load{Loading<br/>Assets}

    Load -->|Success| Intro["📺 Intro Screen<br/>흑괘 Black Trigram"]
    Load -->|Error| Error["❌ Error Screen<br/>Retry/Report"]
    Error -->|Retry| Load

    Intro --> Menu{Main Menu}

    Menu -->|Training| Training["🥋 Training Mode"]
    Menu -->|Versus| CharSelect["👤 Character Select"]
    Menu -->|Tutorial| Tutorial["📚 Tutorial Mode"]
    Menu -->|Philosophy| Philosophy["☯️ Philosophy Mode"]
    Menu -->|Controls| Controls["🎮 Controls Guide"]
    Menu -->|Settings| Settings["⚙️ Settings"]
    Menu -->|Exit| Exit(["🚪 Exit Game"])

    Settings --> Menu
    Philosophy --> Menu
    Controls --> Menu

    CharSelect --> SelectArchetype{Choose Archetype}
    SelectArchetype -->|무사 Musa| Combat
    SelectArchetype -->|암살자 Amsalja| Combat
    SelectArchetype -->|해커 Hacker| Combat
    SelectArchetype -->|정보요원 Intelligence| Combat
    SelectArchetype -->|조직폭력배 Organized Crime| Combat

    Training --> TrainingFlow["🥋 Training Flow<br/>See Training Mode Flowchart"]
    Tutorial --> TutorialGuide["📚 Guided Tutorial<br/>기초 안내 Basic Guidance"]

    Combat["⚔️ Combat Screen"] --> Round{Round Start}
    Round --> Fight[Active Combat]

    Fight -->|Pause| PauseMenu["⏸️ Pause Menu<br/>See Pause Menu Flow"]
    PauseMenu -->|Resume| Fight

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
    MatchCheck -->|Victory| Victory["🏆 Victory Screen"]
    MatchCheck -->|Defeat| Defeat["💀 Defeat Screen"]

    Victory --> PostMatch{Post-Match}
    Defeat --> PostMatch
    PostMatch -->|Return to Menu| Menu
    PostMatch -->|Rematch| RematchFlow["🔄 Rematch Flow<br/>See Rematch Flowchart"]
    RematchFlow --> Round

    style Start fill:#2979FF,stroke:#0D47A1,color:#fff
    style Intro fill:#00C853,stroke:#00796B,color:#fff
    style Combat fill:#FF3D00,stroke:#BF360C,color:#fff
    style VPCheck fill:#FFD600,stroke:#F57F17,color:#000
    style Victory fill:#00C853,stroke:#00796B,color:#fff
    style Defeat fill:#9E9E9E,stroke:#616161,color:#fff
    style Exit fill:#9C27B0,stroke:#6A1B9A,color:#fff
    style PauseMenu fill:#9C27B0,stroke:#6A1B9A,color:#fff
    style TrainingFlow fill:#00C853,stroke:#00796B,color:#fff
    style RematchFlow fill:#FFD600,stroke:#F57F17,color:#000
```

---

### **Training Mode Flow**

Training mode provides structured practice modes for mastering vital points, trigram stances, and footwork techniques. Based on the actual `TrainingScreen3D` component implementation.

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#00C853','primaryTextColor':'#fff','primaryBorderColor':'#00796B','lineColor':'#2979FF','secondaryColor':'#FFD600','tertiaryColor':'#FF3D00'}}}%%
flowchart TD
    Enter(["🥋 Enter Training Mode"]) --> TrainingMenu[Training Menu<br/>Select Practice Mode]

    TrainingMenu --> ModeSelect{Choose Mode}

    ModeSelect -->|Free Practice| FreePractice["🥊 Free Practice<br/>자유 연습<br/>Open Sparring with Dummy"]
    ModeSelect -->|Vital Point Drill| VPDrill["🎯 Vital Point Drill<br/>급소 훈련<br/>Target 70 Vital Points"]
    ModeSelect -->|Footwork Drill| FootworkDrill["👣 Footwork Drill<br/>발놀림 훈련<br/>Movement & Positioning"]
    ModeSelect -->|Anatomy Study| AnatomyStudy["🔬 Anatomy Study<br/>해부학 학습<br/>Body System Visualization"]

    FreePractice --> SelectArchetype{Select Archetype<br/>for Dummy}
    SelectArchetype -->|무사 Musa| ActiveTraining
    SelectArchetype -->|암살자 Amsalja| ActiveTraining
    SelectArchetype -->|해커 Hacker| ActiveTraining
    SelectArchetype -->|정보요원 Intelligence| ActiveTraining
    SelectArchetype -->|조직폭력배 Crime| ActiveTraining

    VPDrill --> SelectVPFilter{VP Overlay Filters}
    SelectVPFilter -->|By Severity| FilterSeverity[Filter: Minor → Lethal<br/>5 Severity Levels]
    SelectVPFilter -->|By Region| FilterRegion[Filter: Head/Torso/Arms/Legs<br/>8 Body Regions]
    SelectVPFilter -->|Search| FilterSearch[Search by Name<br/>Korean or English]
    FilterSeverity --> ActiveTraining
    FilterRegion --> ActiveTraining
    FilterSearch --> ActiveTraining

    FootworkDrill --> ActiveTraining["⚡ Active Training<br/>활성 훈련"]
    AnatomyStudy --> AnatomyView["🔬 Anatomy Overlay<br/>Layer Visualization<br/>Skeletal/Muscle/VP"]
    AnatomyView --> ActiveTraining

    ActiveTraining --> TrainingLoop{Training Action}
    TrainingLoop -->|Attack| ExecuteAttack[Execute Technique<br/>28-Bone Animation<br/>Hand Pose Selection]
    TrainingLoop -->|Stance Change| ChangeStance[Change Trigram Stance<br/>8 Stances Available]
    TrainingLoop -->|Toggle Overlay| ToggleVP[Toggle VP Overlay<br/>V Key Shortcut]
    TrainingLoop -->|Adjust Scale| AdjustScale[Adjust View Scale<br/>Default: 1.2x]

    ExecuteAttack --> Feedback["📊 Feedback Display<br/>Hit Location<br/>Damage Calculation<br/>VP Hit Result"]
    ChangeStance --> Feedback
    Feedback --> StatsUpdate["📈 Stats Update<br/>Hits Landed<br/>VP Accuracy<br/>Technique Mastery"]
    StatsUpdate --> TrainingLoop

    ToggleVP --> TrainingLoop
    AdjustScale --> TrainingLoop

    TrainingLoop -->|Return| TrainingMenu
    TrainingMenu -->|Exit| Exit(["🏠 Return to Main Menu"])

    style Enter fill:#00C853,stroke:#00796B,color:#fff
    style ActiveTraining fill:#2979FF,stroke:#0D47A1,color:#fff
    style Feedback fill:#FFD600,stroke:#F57F17,color:#000
    style StatsUpdate fill:#9C27B0,stroke:#6A1B9A,color:#fff
    style Exit fill:#9E9E9E,stroke:#616161,color:#fff
    style VPDrill fill:#FF3D00,stroke:#BF360C,color:#fff
```

---

### **Pause Menu Flow**

The pause menu provides access to game controls, settings adjustments, and navigation options during combat. Based on the actual `PauseMenu.tsx` and `usePauseMenu.ts` hook implementation.

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#9C27B0','primaryTextColor':'#fff','primaryBorderColor':'#6A1B9A','lineColor':'#FFD600','secondaryColor':'#2979FF','tertiaryColor':'#FF3D00'}}}%%
flowchart TD
    Combat(["⚔️ Active Combat"]) -->|Escape Key / Pause Button| PauseTriggered["⏸️ Pause Triggered<br/>Combat Frozen"]

    PauseTriggered --> PauseMenu[Pause Menu<br/>일시정지 메뉴<br/>Cyberpunk Korean UI]

    PauseMenu --> MenuItem{Menu Selection}

    MenuItem -->|▶️ 계속 Resume| Resume[Resume Combat<br/>Restore Combat State]
    MenuItem -->|🔄 재시작 Restart| ConfirmRestart{Confirm Restart?<br/>재시작 확인}
    MenuItem -->|🎮 조작법 Controls| ControlsGuide[Controls Guide<br/>조작법 안내<br/>Keyboard + Gamepad]
    MenuItem -->|⚙️ 설정 Settings| QuickSettings[Quick Settings<br/>설정 조정]
    MenuItem -->|🏠 메인 메뉴 Return| ConfirmQuit{Confirm Quit?<br/>메인 메뉴 확인}

    ConfirmRestart -->|Yes| RestartMatch["🔄 Restart Match<br/>Reset Round State<br/>Reset Player Health"]
    ConfirmRestart -->|No| PauseMenu

    ControlsGuide --> BackToPause1[Back to Pause Menu]
    BackToPause1 --> PauseMenu

    QuickSettings --> SettingsOptions{Settings Category}
    SettingsOptions -->|🔊 Audio| AudioSettings[Audio Settings<br/>Volume Control]
    SettingsOptions -->|🖥️ Display| DisplaySettings[Display Settings<br/>Visual Options]
    SettingsOptions -->|♿ Accessibility| AccessSettings[Accessibility<br/>접근성 설정]
    AudioSettings --> BackToPause2[Back to Pause Menu]
    DisplaySettings --> BackToPause2
    AccessSettings --> BackToPause2
    BackToPause2 --> PauseMenu

    ConfirmQuit -->|Yes| MainMenu(["🏠 Return to Main Menu"])
    ConfirmQuit -->|No| PauseMenu

    Resume --> Combat2(["⚔️ Resume Combat<br/>60fps Restored"])
    RestartMatch --> Combat3(["⚔️ New Match<br/>Round 1 Start"])

    style PauseTriggered fill:#9C27B0,stroke:#6A1B9A,color:#fff
    style PauseMenu fill:#9C27B0,stroke:#6A1B9A,color:#fff
    style Resume fill:#00C853,stroke:#00796B,color:#fff
    style MainMenu fill:#2979FF,stroke:#0D47A1,color:#fff
    style ControlsGuide fill:#FFD600,stroke:#F57F17,color:#000
    style QuickSettings fill:#FFD600,stroke:#F57F17,color:#000
    style RestartMatch fill:#FF3D00,stroke:#BF360C,color:#fff
```

---

### **Rematch Flow**

After a match ends (Victory or Defeat), the rematch flow allows players to start a new match while preserving or changing archetype selection.

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#FFD600','primaryTextColor':'#000','primaryBorderColor':'#F57F17','lineColor':'#FF3D00','secondaryColor':'#2979FF','tertiaryColor':'#00C853'}}}%%
flowchart TD
    MatchEnd(["🏆 Match End<br/>Victory / Defeat Screen"]) --> PostMatch{Post-Match Choice}

    PostMatch -->|Rematch| RematchDecision{Same Archetypes?}
    PostMatch -->|Return to Menu| MainMenu(["🏠 Main Menu"])

    RematchDecision -->|Yes - Quick Rematch| QuickRematch["⚡ Quick Rematch<br/>Same Archetypes<br/>Reset Health/Ki/Stamina<br/>Reset Round Count"]
    RematchDecision -->|No - Change Setup| ChangeSetup["👤 Return to<br/>Character Select<br/>New Archetype Choice"]

    QuickRematch --> ResetState[Reset Combat State<br/>Clear Status Effects<br/>Reset Body Part HP<br/>Reset VP State<br/>Reset Consciousness]

    ChangeSetup --> SelectArchetype{Choose New Archetype}
    SelectArchetype -->|무사 Musa| ResetState
    SelectArchetype -->|암살자 Amsalja| ResetState
    SelectArchetype -->|해커 Hacker| ResetState
    SelectArchetype -->|정보요원 Intelligence| ResetState
    SelectArchetype -->|조직폭력배 Crime| ResetState

    ResetState --> NewMatch[Initialize New Match<br/>Load 3D Assets<br/>28-Bone Skeleton Setup<br/>Reset Timer]
    NewMatch --> Countdown[3... 2... 1...<br/>건 Heaven Stance]
    Countdown --> Fight(["⚔️ FIGHT!<br/>New Match Begins"])

    style MatchEnd fill:#FFD600,stroke:#F57F17,color:#000
    style QuickRematch fill:#00C853,stroke:#00796B,color:#fff
    style ChangeSetup fill:#2979FF,stroke:#0D47A1,color:#fff
    style Fight fill:#FF3D00,stroke:#BF360C,color:#fff
    style MainMenu fill:#9E9E9E,stroke:#616161,color:#fff
```

---

## ⚔️ Combat System Flows

### **Combat Round Flow**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#FF3D00','primaryTextColor':'#fff','primaryBorderColor':'#BF360C','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#2979FF'}}}%%
flowchart TD
    RoundStart(["⏱️ Round Start"]) --> Init[Initialize Round<br/>Reset Positions<br/>28-Bone Skeleton<br/>Reset Resources]

    Init --> Ready[Ready State<br/>3...2...1...<br/>Stance: 건 Heaven]
    Ready --> Fight["🥊 FIGHT!"]

    Fight --> Input{Player Input}

    Input -->|Attack Space| ProcessAttack[Process Attack<br/>Check Stance]
    Input -->|Stance 1-8| ChangeStance[Change Stance<br/>8 Trigrams]
    Input -->|Block Shift| Block[Enter Block State<br/>Guard Animation]
    Input -->|WASD| Move[Update Position<br/>Check Leg Damage]

    ProcessAttack --> CheckStance{Valid Stance<br/>for Technique?}
    CheckStance -->|No| Input
    CheckStance -->|Yes| CheckKi{Sufficient Ki<br/>& Stamina?}

    CheckKi -->|No| Input
    CheckKi -->|Yes| ExecuteAttack[Execute Attack<br/>Skeletal Animation<br/>Hand Pose]

    ExecuteAttack --> HitDetection[Hit Detection<br/>Polygon-Based]
    HitDetection --> CheckVP{Hit Vital Point?<br/>70 Targets}

    CheckVP -->|No| BaseDmg[Base Damage<br/>Body Part Health]
    CheckVP -->|Yes| CheckPrecision{Precision Roll<br/>≥ VP Threshold?}

    CheckPrecision -->|No| GlancingHit[Glancing Hit<br/>50% VP Effect]
    CheckPrecision -->|Yes| PerfectVP[Perfect VP Strike!<br/>Full Multiplier]

    GlancingHit --> ApplyDamage[Apply Damage<br/>Update 8 Body Parts]
    PerfectVP --> ApplyDamage
    BaseDmg --> ApplyDamage

    ApplyDamage --> ApplyEffects[Apply Status Effects<br/>Pain Response<br/>Consciousness Level<br/>Breathing Disruption]
    
    ApplyEffects --> UpdateAnimation[Update Skeletal Animation<br/>Muscle Tension<br/>Injury Feedback]

    UpdateAnimation --> CheckKO{Victory<br/>Condition?}
    CheckKO -->|Health ≤ 0| RoundEnd(["🏁 Round End"])
    CheckKO -->|Consciousness ≤ 0| RoundEnd
    CheckKO -->|Time Up| RoundEnd
    CheckKO -->|Continue| Input

    ChangeStance --> ConsumeResources[Consume Ki/Stamina<br/>Transition Animation]
    ConsumeResources --> Input

    Block --> BlockState[Block State Active<br/>Reduce Damage 50-80%<br/>Guard Animation]
    BlockState --> Input

    Move --> CheckInjury{Leg Injury<br/>Movement Penalty?}
    CheckInjury -->|Yes| SlowMovement[Reduced Speed<br/>Balance Loss Risk]
    CheckInjury -->|No| NormalMovement[Normal Speed]
    SlowMovement --> Input
    NormalMovement --> Input

    style RoundStart fill:#2979FF,stroke:#0D47A1,color:#fff
    style Fight fill:#FF3D00,stroke:#BF360C,color:#fff
    style ExecuteAttack fill:#FFD600,stroke:#F57F17,color:#000
    style PerfectVP fill:#00C853,stroke:#00796B,color:#fff
    style RoundEnd fill:#9C27B0,stroke:#6A1B9A,color:#fff
```

### **Attack Resolution Flow**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#FFD600','primaryTextColor':'#000','primaryBorderColor':'#F57F17','lineColor':'#FF3D00','secondaryColor':'#00C853','tertiaryColor':'#2979FF'}}}%%
flowchart LR
    A["⚔️ Attack Input"] --> B{Validate Attack}

    B -->|Invalid| X1["❌ Cancel Attack<br/>Play Error SFX"]
    B -->|Valid| C[Consume Ki/Stamina]

    C --> D[Calculate Hit Box]
    D --> E{Collision<br/>Detected?}

    E -->|No| X2["🌀 Miss<br/>Play Woosh SFX"]
    E -->|Yes| F{Defender<br/>Blocking?}

    F -->|Yes| G[Reduce Damage<br/>50-80%]
    F -->|No| H[Full Damage]

    G --> I[Calculate Final<br/>Damage]
    H --> I

    I --> J{Critical Hit?<br/>Roll < Crit%}

    J -->|Yes| K["×2 Damage<br/>✨ Critical Effect"]
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

    T --> U["✅ Attack Complete"]
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

### **Vital Point Strike Resolution (70 Targets)**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#00C853','primaryTextColor':'#fff','primaryBorderColor':'#00796B','lineColor':'#FF3D00','secondaryColor':'#FFD600','tertiaryColor':'#2979FF'}}}%%
flowchart TD
    Start(["🎯 VP Strike Attempt<br/>70 Targets"]) --> CheckStance{Correct Stance<br/>for VP Category?<br/>8 Trigrams}

    CheckStance -->|No| Penalty["⚠️ Stance Penalty<br/>-30% effectiveness"]
    CheckStance -->|Yes| CheckTechnique{Archetype<br/>Skill Match?<br/>5 Archetypes}

    Penalty --> CheckTechnique

    CheckTechnique -->|Poor Match| SkillPenalty["⚠️ Skill Penalty<br/>-20% precision"]
    CheckTechnique -->|Good Match| RollPrecision["🎲 Roll Precision<br/>Random 0-100<br/>vs VP Threshold"]

    SkillPenalty --> RollPrecision

    RollPrecision --> ComparePrecision{Roll ≥<br/>VP Precision<br/>Requirement?}

    ComparePrecision -->|No| Glance["⚡ Glancing VP<br/>50% effectiveness<br/>Partial damage"]
    ComparePrecision -->|Yes| PerfectHit["✨ Perfect Strike!<br/>Full VP effect<br/>Maximum damage"]

    Glance --> ApplyDamage[Apply Damage<br/>×VP multiplier<br/>Update Body Part]
    PerfectHit --> ApplyDamage

    ApplyDamage --> DetermineSeverity{VP Severity<br/>Level?<br/>5 Categories}

    DetermineSeverity -->|Minor 🟢| MinorEffect[Minor Effect<br/>Dmg: 10-20<br/>Duration: 5-10s<br/>Light stun]
    DetermineSeverity -->|Moderate 🟡| ModEffect[Moderate Effect<br/>Dmg: 20-40<br/>Duration: 10-20s<br/>Pain increase]
    DetermineSeverity -->|Major ⚡| MajorEffect[Major Effect<br/>Dmg: 40-60<br/>Duration: 20-40s<br/>Stat reduction]
    DetermineSeverity -->|Critical ⚠️| CritEffect[Critical Effect<br/>Dmg: 60-80<br/>Duration: 30-60s<br/>Severe debuff]
    DetermineSeverity -->|Lethal ☠️| LethalEffect[Lethal Effect<br/>Dmg: 80-100<br/>Duration: Permanent<br/>Instant KO risk]

    MinorEffect --> CategoryEffect{Anatomical<br/>Category?<br/>7 Types}
    ModEffect --> CategoryEffect
    MajorEffect --> CategoryEffect
    CritEffect --> CategoryEffect
    LethalEffect --> CategoryEffect

    CategoryEffect -->|Neurological 🧠| NeuroEffect[Nerve damage<br/>Paralysis<br/>Pain response]
    CategoryEffect -->|Skeletal 🦴| BoneEffect[Bone fracture<br/>Structure damage<br/>Movement loss]
    CategoryEffect -->|Joint 🔗| JointEffect[Dislocation<br/>Mobility loss<br/>Range limited]
    CategoryEffect -->|Organ 💓| OrganEffect[Internal damage<br/>Bleeding<br/>System failure]
    CategoryEffect -->|Muscular 💪| MuscleEffect[Muscle tear<br/>Spasm<br/>Weakness]
    CategoryEffect -->|Vascular 🩸| VascularEffect[Blood flow disruption<br/>Consciousness loss<br/>Bleeding]
    CategoryEffect -->|Respiratory 🫁| RespEffect[Breathing disruption<br/>Stamina drain<br/>Panic]

    NeuroEffect --> ApplyStatus[Apply Status Effects<br/>Update Combat State]
    BoneEffect --> ApplyStatus
    JointEffect --> ApplyStatus
    OrganEffect --> ApplyStatus
    MuscleEffect --> ApplyStatus
    VascularEffect --> ApplyStatus
    RespEffect --> ApplyStatus

    ApplyStatus --> UpdateSystems[Update Systems<br/>Pain Response<br/>Consciousness<br/>Breathing]

    UpdateSystems --> CheckKO{KO Condition?<br/>Health ≤ 0 OR<br/>Consciousness ≤ 0?}

    CheckKO -->|Yes| KO["💀 Knockout<br/>Round End<br/>Victory"]
    CheckKO -->|No| Continue["✅ Continue Fight<br/>Combat Active"]

    KO --> End([Attack Complete])
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
    Start(["🥋 Training Start"]) --> Select{Select Training}

    Select -->|Vital Points| VPTraining[Vital Point<br/>Training]
    Select -->|Stances| StanceTraining[Trigram Stance<br/>Training]
    Select -->|Combos| ComboTraining[Combo<br/>Training]
    Select -->|Free Practice| FreePractice[Free Practice<br/>Mode]

    VPTraining --> ShowVP[Display VP<br/>Anatomy Model]
    ShowVP --> SelectVP[Player Selects<br/>Target VP]
    SelectVP --> AttemptStrike[Execute Strike]
    AttemptStrike --> Grade{Grade<br/>Accuracy}

    Grade -->|Perfect| Perfect["⭐ Perfect!<br/>+100 points"]
    Grade -->|Good| Good["✅ Good<br/>+50 points"]
    Grade -->|Poor| Poor["⚠️ Poor<br/>+10 points"]
    Grade -->|Miss| Miss["❌ Miss<br/>0 points"]

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

    GradeTransition -->|Fast| FastGrade["⚡ Fast!<br/>< 0.5s"]
    GradeTransition -->|Normal| NormalGrade["✅ Normal<br/>0.5-1s"]
    GradeTransition -->|Slow| SlowGrade["🐢 Slow<br/>> 1s"]

    FastGrade --> Continue2{Continue?}
    NormalGrade --> Continue2
    SlowGrade --> Continue2

    Continue2 -->|Yes| PracticeStance
    Continue2 -->|No| SaveProgress

    ComboTraining --> ShowCombo[Display Combo<br/>Sequence]
    ShowCombo --> ExecuteCombo[Execute Combo<br/>Steps]
    ExecuteCombo --> CheckCombo{Combo<br/>Correct?}

    CheckCombo -->|Perfect| ComboSuccess["🎯 Perfect Combo!<br/>Max points"]
    CheckCombo -->|Partial| ComboPartial["⚡ Partial<br/>Some correct"]
    CheckCombo -->|Failed| ComboFail["❌ Failed<br/>Retry"]

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
    ShowStats --> End(["🎓 Training Complete"])

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
    U --> V["✅ Audio Complete"]
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

### **Game Initialization Flow (Three.js)**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#FFD600','primaryTextColor':'#000','primaryBorderColor':'#F57F17','lineColor':'#00C853','secondaryColor':'#2979FF','tertiaryColor':'#FF3D00'}}}%%
flowchart TD
    Start(["🚀 App Start"]) --> CheckCache{Assets<br/>Cached?<br/>Browser Storage}

    CheckCache -->|Yes| LoadCached[Load from<br/>Browser Cache<br/>IndexedDB]
    CheckCache -->|No| LoadRemote[Load from CDN<br/>Audio + 3D Models]

    LoadCached --> VerifyCache{Cache<br/>Valid?<br/>Version Check}

    VerifyCache -->|No| LoadRemote
    VerifyCache -->|Yes| InitAudio[Initialize<br/>Audio System<br/>Howler.js + Web Audio]

    LoadRemote --> Progress[Show Loading<br/>Progress Bar<br/>Asset Counter]
    Progress --> DownloadAssets{Download<br/>Success?}

    DownloadAssets -->|No| Retry{Retry<br/>Count < 3?}
    DownloadAssets -->|Yes| CacheAssets[Cache Assets<br/>IndexedDB<br/>Service Worker]

    Retry -->|Yes| LoadRemote
    Retry -->|No| ErrorScreen["❌ Loading Error<br/>Offline Mode?<br/>Error Details"]

    ErrorScreen --> End([Exit/Retry])

    CacheAssets --> InitAudio

    InitAudio --> LoadAudioFiles[Load Audio Files<br/>Korean Traditional<br/>Combat SFX<br/>Cyberpunk BGM]
    LoadAudioFiles --> InitThree["Initialize Three.js<br/>@react-three/fiber<br/>WebGL Context"]
    
    InitThree --> CreateScene[Create 3D Scene<br/>Camera Setup<br/>Lighting<br/>Environment]
    
    CreateScene --> LoadModels[Load 3D Models<br/>Character Meshes<br/>Skeletal Rigs<br/>28-Bone System]
    
    LoadModels --> InitGame[Initialize<br/>Game Systems]

    InitGame --> CombatSystem[Combat System<br/>CombatSystemController]
    InitGame --> TrigramSystem[Trigram System<br/>8 Stances<br/>StanceManager]
    InitGame --> VPSystem[Vital Point System<br/>70 Targets<br/>VitalPointSystem]
    InitGame --> AnimationSystem[Animation System<br/>28 Bones<br/>7 Hand Poses<br/>Muscle Tension]
    InitGame --> AISystem[AI System<br/>5 Archetypes<br/>Combat Behaviors]

    CombatSystem --> Ready{All Systems<br/>Ready?<br/>Health Check}
    TrigramSystem --> Ready
    VPSystem --> Ready
    AnimationSystem --> Ready
    AISystem --> Ready

    Ready -->|No| Wait[Wait for<br/>Initialization<br/>Loading Spinner]
    Ready -->|Yes| Complete["✅ Ready to Play<br/>All Systems Online<br/>60fps Active"]

    Wait --> Ready
    Complete --> ShowIntro[Show Intro<br/>Screen<br/>흑괘 Logo]
    ShowIntro --> GameLoop(["⚡ Enter Game Loop<br/>60fps Target"])

    style Start fill:#2979FF,stroke:#0D47A1,color:#fff
    style LoadRemote fill:#FFD600,stroke:#F57F17,color:#000
    style Complete fill:#00C853,stroke:#00796B,color:#fff
    style GameLoop fill:#9C27B0,stroke:#6A1B9A,color:#fff
```

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram through Process Flow_

These flowcharts document the complete user journey and system processes for Black Trigram, ensuring comprehensive understanding of game mechanics and state transitions for authentic Korean martial arts combat simulation.

---

**📋 Document Control:**  
**✅ Approved by:** James Pether Sörling, CEO  
**📤 Distribution:** Public  
**🏷️ Classification:** [![Confidentiality: Public](https://img.shields.io/badge/C-Public-lightgrey?style=flat-square&logo=shield&logoColor=black)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#confidentiality-levels) [![Integrity: Moderate](https://img.shields.io/badge/I-Moderate-yellow?style=flat-square&logo=check-circle&logoColor=black)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#integrity-levels) [![Availability: Standard](https://img.shields.io/badge/A-Standard-lightgreen?style=flat-square&logo=server&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#availability-levels)  
**📅 Effective Date:** 2026-04-21  
**⏰ Next Review:** 2026-10-21  
**🎯 Framework Compliance:** [![ISO 27001](https://img.shields.io/badge/ISO_27001-2022_Aligned-blue?style=flat-square&logo=iso&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![NIST CSF 2.0](https://img.shields.io/badge/NIST_CSF-2.0_Aligned-green?style=flat-square&logo=nist&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)
