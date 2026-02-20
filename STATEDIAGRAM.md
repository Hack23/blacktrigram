# 🎮 Black Trigram (흑괘) State Diagrams

**🔐 ISMS Alignment:** This document follows [Hack23 Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) architecture documentation requirements.

## 📚 Related Documentation

| Document                                      | Focus            | Description                                    |
| --------------------------------------------- | ---------------- | ---------------------------------------------- |
| [Architecture](ARCHITECTURE.md)               | 🏛️ Structure     | C4 model showing system components             |
| [Data Model](DATA_MODEL.md)                   | 📊 Data          | Type system and data structures                |
| [Flowchart](FLOWCHART.md)                     | 🔄 Process Flow  | Game flow and user journeys                    |
| [Combat Architecture](COMBAT_ARCHITECTURE.md) | ⚔️ Combat System | Detailed combat mechanics implementation       |
| [Future State Diagram](FUTURE_STATEDIAGRAM.md)| 🔮 Evolution     | Planned state machine enhancements             |

---

## 🎯 Overview

This document provides comprehensive state machine diagrams for Black Trigram (흑괘), documenting all game states, combat states, and their valid transitions. State diagrams use Korean cyberpunk color scheme consistent with the game's aesthetic.

---

## 🎮 Main Game State Machine

### **Top-Level Game States**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#2979FF','primaryTextColor':'#fff','primaryBorderColor':'#0D47A1','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#FF3D00'}}}%%
stateDiagram-v2
    [*] --> Loading: App Start
    
    Loading --> Intro: Assets Loaded
    Loading --> Error: Load Failed
    
    Error --> Loading: Retry
    Error --> [*]: Exit
    
    Intro --> MainMenu: Continue
    
    MainMenu --> CharacterSelect: Start Versus
    MainMenu --> Training: Start Training
    MainMenu --> Tutorial: Start Tutorial
    MainMenu --> Settings: Open Settings
    MainMenu --> [*]: Exit Game
    
    Settings --> MainMenu: Save & Close
    
    CharacterSelect --> Combat: Players Selected
    CharacterSelect --> MainMenu: Cancel
    
    Training --> MainMenu: Exit Training
    Tutorial --> MainMenu: Exit Tutorial
    
    Combat --> Paused: Pause Button
    Combat --> Victory: Player Wins
    Combat --> Defeat: Player Loses
    
    Paused --> Combat: Resume
    Paused --> MainMenu: Quit to Menu
    
    Victory --> MainMenu: Continue
    Defeat --> MainMenu: Continue
    Defeat --> Combat: Rematch
    
    note right of Loading
        Load audio/visual assets
        Initialize game systems
        Prepare PixiJS renderer
    end note
    
    note right of Combat
        Active combat round
        8 trigram stances
        70 vital points
        Real-time physics
    end note
    
    note right of Training
        Practice vital points
        Learn trigram stances
        Master techniques
    end note
```

---

## ⚔️ Combat State Machine

### **Combat Round States (70 Vital Points + 28-Bone Animation)**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#FF3D00','primaryTextColor':'#fff','primaryBorderColor':'#BF360C','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#2979FF'}}}%%
stateDiagram-v2
    [*] --> RoundStart: Initialize Round
    
    RoundStart --> LoadAssets: Load 3D Assets
    LoadAssets --> InitSkeleton: Initialize 28-Bone Skeleton
    InitSkeleton --> Ready: Setup Complete
    
    Ready --> Countdown: Start Timer
    
    Countdown --> Fighting: Count == 0<br/>Recommended starting stance: 건 (Geon, Heaven)
    
    Fighting --> Idle: No Input
    Fighting --> Attacking: Attack Input (Space)
    Fighting --> Defending: Block Input (Shift)
    Fighting --> Transitioning: Stance Change (1-8)
    Fighting --> Moving: Movement (WASD)
    
    Idle --> Attacking: Attack Input
    Idle --> Defending: Block Input
    Idle --> Transitioning: Stance Change
    Idle --> Moving: Movement Input
    
    Attacking --> ExecutingTechnique: Validate Stance + Ki
    ExecutingTechnique --> SkeletalAnimation: Play Attack Animation<br/>Update 28 Bones<br/>Apply Hand Pose
    SkeletalAnimation --> HitDetection: Polygon-based Detection
    
    HitDetection --> VPCheck: Check 70 Vital Points
    VPCheck --> Hit: VP Hit Detected
    VPCheck --> Miss: No VP Hit
    VPCheck --> Countered: Counter-Attack
    
    Hit --> ApplyVPDamage: Calculate VP Damage<br/>5 Severity Levels<br/>7 Anatomical Categories
    ApplyVPDamage --> UpdateBodyParts: Update 8 Body Parts<br/>Pain Response<br/>Consciousness
    UpdateBodyParts --> Stunned: VP Stun Effect
    
    Miss --> Recovering: Recovery Period<br/>Return to Idle
    
    Countered --> Stunned: Counter Success<br/>Defender Counterattacks
    
    Defending --> BlockActive: Block State Active<br/>Guard Animation<br/>Stance-Specific
    BlockActive --> Idle: Block Window Ends
    BlockActive --> Countering: Perfect Block Timing
    
    Countering --> CounterAttack: Counter Window Active<br/>Bonus Damage<br/>Fast Technique
    CounterAttack --> Idle: Counter Complete
    Countering --> Idle: Window Expires
    
    Transitioning --> ConsumeResources: Consume Ki/Stamina<br/>Transition Cost
    ConsumeResources --> UpdateStance: Update Trigram Stance<br/>New Techniques Available
    UpdateStance --> Idle: Stance Changed
    
    Moving --> CheckLegInjury: Check Leg Damage<br/>Movement Penalties
    CheckLegInjury --> SlowMovement: Injured: Reduced Speed
    CheckLegInjury --> NormalMovement: Healthy: Normal Speed
    SlowMovement --> Idle: Movement Complete
    NormalMovement --> Idle: Movement Complete
    
    Stunned --> MuscleTension: Update Muscle Tension<br/>Visual Feedback<br/>Skeletal System
    MuscleTension --> Recovering: Stun Duration Ends
    
    Recovering --> Idle: Recovery Complete<br/>Ready to Fight
    
    Idle --> CheckKO: Check KO Conditions
    CheckKO --> RoundEnd: Health ≤ 0
    CheckKO --> RoundEnd: Consciousness ≤ 0
    CheckKO --> RoundEnd: Time Up
    CheckKO --> Idle: Fight Continues
    Stunned --> CheckKO: While Stunned
    
    RoundEnd --> SaveStats: Save Combat Statistics
    SaveStats --> [*]: Match Complete
    SaveStats --> RoundStart: Next Round
    
    note right of ExecutingTechnique
        Validate stance compatibility
        Check Ki/Stamina resources
        Select appropriate technique
        8 trigram stances available
    end note
    
    note right of VPCheck
        70 vital point targets
        5 severity levels:
        Lethal, Critical, Major,
        Moderate, Minor
        7 anatomical categories
    end note
    
    note right of UpdateBodyParts
        8 body parts tracked:
        Head, Torso, Arms (2),
        Legs (2), Hands (2)
        Pain response system
        Consciousness levels
        Breathing disruption
    end note
    
    note right of SkeletalAnimation
        28-bone hierarchy
        7 hand poses (HandPoseType enum):
        FIST, KNIFE_HAND, SPEAR_HAND,
        PALM_HEEL, GRAPPLING, OPEN, RELAXED
        Muscle tension visualization (0.0-1.0)
    end note
    
    note right of Countering
        Brief counter window (0.2-0.5s)
        Extra damage bonus (1.5x)
        Requires precise timing
        Advanced technique mastery
        Stance-dependent options
    end note
```

### **Player Combat States (5 Archetypes + Skeletal System)**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#00C853','primaryTextColor':'#fff','primaryBorderColor':'#00796B','lineColor':'#FF3D00','secondaryColor':'#FFD600','tertiaryColor':'#2979FF'}}}%%
stateDiagram-v2
    [*] --> Spawn: Enter Combat Arena
    Spawn --> InitializeArchetype: Load Archetype
    
    state InitializeArchetype {
        [*] --> SelectArchetype
        SelectArchetype --> Musa: 무사 Warrior
        SelectArchetype --> Amsalja: 암살자 Assassin
        SelectArchetype --> Hacker: 해커 Hacker
        SelectArchetype --> Intelligence: 정보요원 Agent
        SelectArchetype --> Crime: 조직폭력배 Criminal
        
        Musa --> LoadSkills: Load Archetype Skills
        Amsalja --> LoadSkills
        Hacker --> LoadSkills
        Intelligence --> LoadSkills
        Crime --> LoadSkills
        
        LoadSkills --> [*]
    }
    
    InitializeArchetype --> Idle: Ready to Fight
    
    Idle --> Attacking: Press Attack (Space)
    Idle --> Blocking: Hold Block (Shift)
    Idle --> Moving: Movement Input (WASD)
    Idle --> StanceChange: Press Stance Key (1-8)
    
    Attacking --> ValidateInput: Check Input Validity
    ValidateInput --> AttackExecution: Valid Input<br/>Sufficient Resources
    ValidateInput --> Idle: Invalid Input
    
    AttackExecution --> SkeletalAnimation: Execute 28-Bone Animation
    
    state SkeletalAnimation {
        [*] --> UpdatePelvis: Root Bone
        UpdatePelvis --> UpdateSpine: 3 Spine Bones
        UpdateSpine --> UpdateNeck: Neck + Head
        UpdateNeck --> UpdateArms: L/R Arms (6 bones each)
        UpdateArms --> UpdateLegs: L/R Legs (5 bones each)
        UpdateLegs --> ApplyHandPose: Select Hand Pose (7 types)
        ApplyHandPose --> UpdateMuscles: Muscle Tension (0.0-1.0)
        UpdateMuscles --> [*]
    }
    
    SkeletalAnimation --> HitboxActive: Hitbox Active
    HitboxActive --> AttackRecovery: Attack Complete
    AttackRecovery --> Idle: Recovery Done
    
    Blocking --> BlockAnimation: Guard Pose<br/>Stance-Specific
    BlockAnimation --> BlockActive: Block Window Open
    BlockActive --> Idle: Release Block
    BlockActive --> PerfectBlock: Perfect Timing (±0.1s)
    
    PerfectBlock --> Countering: Counter Window<br/>0.5s Duration
    
    Countering --> CounterAttack: Execute Counter<br/>1.5x Damage
    CounterAttack --> Idle: Counter Complete
    Countering --> Idle: Window Expired
    
    Moving --> UpdatePosition: Calculate New Position
    UpdatePosition --> CheckInjuries: Check Leg Damage
    
    state CheckInjuries {
        [*] --> EvaluateLegHealth
        EvaluateLegHealth --> HealthyLegs: Both Legs > 70%
        EvaluateLegHealth --> InjuredLeg: One Leg < 70%
        EvaluateLegHealth --> BothInjured: Both Legs < 70%
        
        HealthyLegs --> NormalSpeed: 100% Speed
        InjuredLeg --> ReducedSpeed: 70% Speed
        BothInjured --> SeverelySlowed: 40% Speed
        
        NormalSpeed --> [*]
        ReducedSpeed --> [*]
        SeverelySlowed --> [*]
    }
    
    CheckInjuries --> Idle: Movement Complete
    
    StanceChange --> ValidateStance: Check Ki/Stamina
    ValidateStance --> Transitioning: Sufficient Resources
    ValidateStance --> Idle: Insufficient Resources
    
    Transitioning --> TransitionAnimation: Play Transition<br/>Skeletal Animation
    TransitionAnimation --> UpdateStanceBonus: Update Stance<br/>8 Trigram Effects
    UpdateStanceBonus --> Idle: Transition Complete
    
    Idle --> TakeHit: Hit by Opponent
    Attacking --> TakeHit: Interrupted
    Moving --> TakeHit: Hit During Movement
    
    TakeHit --> EvaluateHit: Calculate Damage
    
    state EvaluateHit {
        [*] --> CheckVPHit
        CheckVPHit --> VPHit: Vital Point Struck<br/>70 Targets
        CheckVPHit --> NormalHit: Regular Hit
        
        VPHit --> DetermineSeverity
        DetermineSeverity --> LethalHit: Lethal (80-100 dmg)
        DetermineSeverity --> CriticalHit: Critical (60-80 dmg)
        DetermineSeverity --> MajorHit: Major (40-60 dmg)
        DetermineSeverity --> ModerateHit: Moderate (20-40 dmg)
        DetermineSeverity --> MinorHit: Minor (10-20 dmg)
        
        NormalHit --> ApplyBaseDamage
        LethalHit --> ApplyVPDamage
        CriticalHit --> ApplyVPDamage
        MajorHit --> ApplyVPDamage
        ModerateHit --> ApplyVPDamage
        MinorHit --> ApplyVPDamage
        
        ApplyBaseDamage --> [*]
        ApplyVPDamage --> [*]
    }
    
    EvaluateHit --> UpdateBodyParts: Update 8 Body Parts
    
    state UpdateBodyParts {
        [*] --> UpdateHead
        UpdateHead --> UpdateTorso
        UpdateTorso --> UpdateLeftArm
        UpdateLeftArm --> UpdateRightArm
        UpdateRightArm --> UpdateLeftLeg
        UpdateLeftLeg --> UpdateRightLeg
        UpdateRightLeg --> UpdateLeftHand
        UpdateLeftHand --> UpdateRightHand
        UpdateRightHand --> [*]
    }
    
    UpdateBodyParts --> ApplyCombatEffects: Apply Effects
    
    state ApplyCombatEffects {
        [*] --> PainResponse: Calculate Pain Level
        PainResponse --> ConsciousnessCheck: Update Consciousness
        ConsciousnessCheck --> BreathingCheck: Check Breathing
        BreathingCheck --> StatusEffects: Apply Status Effects
        StatusEffects --> [*]
    }
    
    ApplyCombatEffects --> CheckStunned: Check Stun
    CheckStunned --> Stunned: Stun Applied
    CheckStunned --> Recovering: No Stun
    
    Stunned --> StunAnimation: Cannot Move<br/>Cannot Attack<br/>Skeletal Tremor
    StunAnimation --> StunTimer: Duration Timer
    StunTimer --> Recovering: Stun Duration Ends
    
    Recovering --> RecoveryAnimation: Play Recovery<br/>Breathing Animation
    RecoveryAnimation --> Idle: Recovery Complete
    
    Idle --> CheckKnockout: Health Check
    Stunned --> CheckKnockout: Consciousness Check
    
    CheckKnockout --> Knocked: Health ≤ 0<br/>OR Consciousness ≤ 0
    CheckKnockout --> Idle: Fight Continues
    
    Knocked --> KOAnimation: Knockout Animation<br/>Collapse Sequence
    KOAnimation --> [*]: Round End
    
    note right of Attacking
        Ki cost applied
        Stamina consumed
        28-bone animation plays
        Hit detection active
        7 hand pose options
        Muscle tension updates
    end note
    
    note right of Stunned
        Cannot move
        Cannot attack
        Cannot block
        Cannot change stance
        Vulnerable state
        Duration: 0.5s - 8s
        Based on VP severity
    end note
    
    note right of StanceChange
        Consume Ki energy
        Brief vulnerability window
        Update stance bonuses
        Change available techniques
        8 trigram stances:
        건 태 리 진 손 감 간 곤
    end note
    
    note right of EvaluateHit
        70 vital point targets
        5 severity levels
        7 anatomical categories
        Polygon-based detection
        Stance effectiveness check
        Precision roll calculation
    end note
```

---

## 🎯 Trigram Stance State Machine

### **Eight Trigram Transitions**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#FFD600','primaryTextColor':'#000','primaryBorderColor':'#F57F17','lineColor':'#2979FF','secondaryColor':'#00C853','tertiaryColor':'#FF3D00'}}}%%
stateDiagram-v2
    [*] --> Geon: Default Start
    
    state "☰ 건 Geon<br/>Heaven" as Geon
    state "☱ 태 Tae<br/>Lake" as Tae
    state "☲ 리 Li<br/>Fire" as Li
    state "☳ 진 Jin<br/>Thunder" as Jin
    state "☴ 손 Son<br/>Wind" as Son
    state "☵ 감 Gam<br/>Water" as Gam
    state "☶ 간 Gan<br/>Mountain" as Gan
    state "☷ 곤 Gon<br/>Earth" as Gon
    
    Geon --> Tae: Press 2
    Geon --> Li: Press 3
    Geon --> Jin: Press 4
    Geon --> Son: Press 5
    Geon --> Gam: Press 6
    Geon --> Gan: Press 7
    Geon --> Gon: Press 8
    
    Tae --> Geon: Press 1
    Tae --> Li: Press 3
    Tae --> Jin: Press 4
    Tae --> Son: Press 5
    Tae --> Gam: Press 6
    Tae --> Gan: Press 7
    Tae --> Gon: Press 8
    
    Li --> Geon: Press 1
    Li --> Tae: Press 2
    Li --> Jin: Press 4
    Li --> Son: Press 5
    Li --> Gam: Press 6
    Li --> Gan: Press 7
    Li --> Gon: Press 8
    
    Jin --> Geon: Press 1
    Jin --> Tae: Press 2
    Jin --> Li: Press 3
    Jin --> Son: Press 5
    Jin --> Gam: Press 6
    Jin --> Gan: Press 7
    Jin --> Gon: Press 8
    
    Son --> Geon: Press 1
    Son --> Tae: Press 2
    Son --> Li: Press 3
    Son --> Jin: Press 4
    Son --> Gam: Press 6
    Son --> Gan: Press 7
    Son --> Gon: Press 8
    
    Gam --> Geon: Press 1
    Gam --> Tae: Press 2
    Gam --> Li: Press 3
    Gam --> Jin: Press 4
    Gam --> Son: Press 5
    Gam --> Gan: Press 7
    Gam --> Gon: Press 8
    
    Gan --> Geon: Press 1
    Gan --> Tae: Press 2
    Gan --> Li: Press 3
    Gan --> Jin: Press 4
    Gan --> Son: Press 5
    Gan --> Gam: Press 6
    Gan --> Gon: Press 8
    
    Gon --> Geon: Press 1
    Gon --> Tae: Press 2
    Gon --> Li: Press 3
    Gon --> Jin: Press 4
    Gon --> Son: Press 5
    Gon --> Gam: Press 6
    Gon --> Gan: Press 7
    
    note right of Geon
        Direct force
        +Attack Power
        Traditional techniques
    end note
    
    note right of Gam
        Flow & adaptation
        +Speed
        Counter techniques
    end note
    
    note right of Gan
        Defensive mastery
        +Defense
        Block techniques
    end note
```

---

## 🥋 Training Mode States

### **Training Session State Machine**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#2979FF','primaryTextColor':'#fff','primaryBorderColor':'#0D47A1','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#FF3D00'}}}%%
stateDiagram-v2
    [*] --> ModeSelect: Enter Training
    
    ModeSelect --> VPTraining: Select VP Training
    ModeSelect --> StanceTraining: Select Stance Training
    ModeSelect --> ComboTraining: Select Combo Training
    ModeSelect --> FreePractice: Select Free Practice
    ModeSelect --> [*]: Exit
    
    VPTraining --> SelectingVP: Initialize
    SelectingVP --> AttemptingStrike: VP Selected
    AttemptingStrike --> Grading: Strike Executed
    
    Grading --> Perfect: Perfect Hit
    Grading --> Good: Good Hit
    Grading --> Poor: Poor Hit
    Grading --> Missed: Missed
    
    Perfect --> ShowingFeedback: Display Results
    Good --> ShowingFeedback
    Poor --> ShowingFeedback
    Missed --> ShowingFeedback
    
    ShowingFeedback --> SelectingVP: Continue
    ShowingFeedback --> ModeSelect: Change Mode
    
    StanceTraining --> PracticingStances: Initialize
    PracticingStances --> TimingTransition: Transition Started
    TimingTransition --> GradingSpeed: Transition Complete
    
    GradingSpeed --> FastTransition: < 0.5s
    GradingSpeed --> NormalTransition: 0.5-1s
    GradingSpeed --> SlowTransition: > 1s
    
    FastTransition --> PracticingStances: Continue
    NormalTransition --> PracticingStances
    SlowTransition --> PracticingStances
    
    FastTransition --> ModeSelect: Change Mode
    NormalTransition --> ModeSelect
    SlowTransition --> ModeSelect
    
    ComboTraining --> DisplayingCombo: Show Sequence
    DisplayingCombo --> ExecutingCombo: Start Execution
    ExecutingCombo --> CheckingCombo: Combo Complete
    
    CheckingCombo --> PerfectCombo: All Correct
    CheckingCombo --> PartialCombo: Some Correct
    CheckingCombo --> FailedCombo: Failed
    
    PerfectCombo --> DisplayingCombo: Next Combo
    PartialCombo --> DisplayingCombo
    FailedCombo --> DisplayingCombo
    
    PerfectCombo --> ModeSelect: Change Mode
    PartialCombo --> ModeSelect
    FailedCombo --> ModeSelect
    
    FreePractice --> Practicing: Initialize
    Practicing --> Practicing: Any Action
    Practicing --> ModeSelect: Exit
    
    note right of VPTraining
        Learn 70 vital points
        Practice precision
        Build muscle memory
        Track progress
    end note
    
    note right of StanceTraining
        Master 8 stances
        Improve speed
        Learn transitions
        Optimize energy use
    end note
    
    note right of ComboTraining
        Learn techniques
        Build combos
        Timing practice
        Advanced moves
    end note
```

---

## 🎵 Audio State Machine

### **Audio System States**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#9C27B0','primaryTextColor':'#fff','primaryBorderColor':'#6A1B9A','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#FF3D00'}}}%%
stateDiagram-v2
    [*] --> Initializing: App Start
    
    Initializing --> Ready: Audio Context Created
    Initializing --> Failed: Init Error
    
    Failed --> Initializing: Retry
    Failed --> [*]: Give Up
    
    Ready --> Idle: No Audio Playing
    
    Idle --> LoadingSound: Play Request
    
    LoadingSound --> Cached: Sound in Cache
    LoadingSound --> Downloading: Fetch from CDN
    
    Cached --> Playing: Start Playback
    
    Downloading --> Playing: Download Complete
    Downloading --> Failed: Download Error
    
    Playing --> Idle: Playback Complete
    Playing --> Paused: Pause Request
    Playing --> Stopped: Stop Request
    
    Paused --> Playing: Resume Request
    Paused --> Stopped: Stop Request
    
    Stopped --> Idle: Cleanup Complete
    
    note right of Playing
        Track active sounds
        Apply volume settings
        Manage sound pool
        Prevent overlap
    end note
    
    note right of Cached
        Use browser cache
        Instant playback
        No network delay
    end note
```

---

## 🔄 UI State Machine

### **Menu Navigation States**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#00C853','primaryTextColor':'#fff','primaryBorderColor':'#00796B','lineColor':'#2979FF','secondaryColor':'#FFD600','tertiaryColor':'#FF3D00'}}}%%
stateDiagram-v2
    [*] --> MainMenu: App Ready
    
    MainMenu --> VersusMenu: Select Versus
    MainMenu --> TrainingMenu: Select Training
    MainMenu --> TutorialMenu: Select Tutorial
    MainMenu --> SettingsMenu: Select Settings
    MainMenu --> [*]: Exit
    
    VersusMenu --> CharacterSelect: Start Game
    VersusMenu --> MainMenu: Back
    
    TrainingMenu --> TrainingSession: Start Training
    TrainingMenu --> MainMenu: Back
    
    TutorialMenu --> TutorialSession: Start Tutorial
    TutorialMenu --> MainMenu: Back
    
    SettingsMenu --> AudioSettings: Audio Tab
    SettingsMenu --> VideoSettings: Video Tab
    SettingsMenu --> ControlSettings: Controls Tab
    SettingsMenu --> MainMenu: Save & Exit
    
    AudioSettings --> SettingsMenu: Back to Settings
    VideoSettings --> SettingsMenu
    ControlSettings --> SettingsMenu
    
    CharacterSelect --> LoadingMatch: Characters Selected
    CharacterSelect --> VersusMenu: Cancel
    
    LoadingMatch --> InMatch: Assets Loaded
    InMatch --> PauseMenu: Pause
    InMatch --> VictoryScreen: Round Won
    InMatch --> DefeatScreen: Round Lost
    
    PauseMenu --> InMatch: Resume
    PauseMenu --> MainMenu: Quit
    
    VictoryScreen --> MainMenu: Continue
    VictoryScreen --> LoadingMatch: Rematch
    
    DefeatScreen --> MainMenu: Continue
    DefeatScreen --> LoadingMatch: Retry
    
    TrainingSession --> TrainingMenu: Exit Training
    TutorialSession --> TutorialMenu: Exit Tutorial
    
    note right of SettingsMenu
        Audio: Volume controls
        Video: Quality settings
        Controls: Key bindings
        Language: Korean/English
    end note
    
    note right of CharacterSelect
        Choose archetype:
        무사 Musa
        암살자 Amsalja
        해커 Hacker
        정보요원 Intelligence
        조직폭력배 Organized Crime
    end note
```

---

## 📊 Resource Management States

### **Player Resource States**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#FF3D00','primaryTextColor':'#fff','primaryBorderColor':'#BF360C','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#2979FF'}}}%%
stateDiagram-v2
    [*] --> FullResources: Match Start
    
    state FullResources {
        [*] --> HealthFull
        [*] --> KiFull
        [*] --> StaminaFull
    }
    
    FullResources --> Depleting: Actions Taken
    
    state Depleting {
        HealthFull --> HealthModerate: Take Damage
        HealthModerate --> HealthLow: More Damage
        HealthLow --> HealthCritical: Critical Damage
        HealthCritical --> HealthZero: Fatal Damage
        
        KiFull --> KiModerate: Use Technique
        KiModerate --> KiLow: More Techniques
        KiLow --> KiEmpty: Exhausted
        
        StaminaFull --> StaminaModerate: Physical Exertion
        StaminaModerate --> StaminaLow: More Exertion
        StaminaLow --> StaminaEmpty: Exhausted
    }
    
    Depleting --> Regenerating: Rest/Recovery
    
    state Regenerating {
        HealthModerate --> HealthFull: Healing
        HealthLow --> HealthModerate: Partial Healing
        HealthCritical --> HealthLow: Emergency Healing
        
        KiModerate --> KiFull: Ki Recovery
        KiLow --> KiModerate: Partial Recovery
        KiEmpty --> KiLow: Slow Recovery
        
        StaminaModerate --> StaminaFull: Rest
        StaminaLow --> StaminaModerate: Partial Rest
        StaminaEmpty --> StaminaLow: Recovery
    }
    
    Regenerating --> Depleting: Resume Action
    Regenerating --> FullResources: Full Recovery
    
    HealthZero --> [*]: Knockout
    
    note right of FullResources
        Health: 100%
        Ki: 100%
        Stamina: 100%
        Ready for combat
    end note
    
    note right of Depleting
        Resources consumed
        by actions:
        - Attacks use Ki
        - Movement uses Stamina
        - Damage reduces Health
    end note
```

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram through State Transitions_

These state diagrams document all valid state transitions for Black Trigram game systems, ensuring comprehensive understanding of state management for authentic Korean martial arts combat simulation.
