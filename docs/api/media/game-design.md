# Black Trigram (흑괘) - Game Design Document

## Executive Summary

**Black Trigram** is a **realistic 2D precision combat game** inspired by classic martial arts fighters like **Budokan: The Martial Spirit** and **International Karate+**, reimagined with authentic Korean martial arts and modern combat techniques. Players master traditional vital point striking through precise, physics-based combat that emphasizes **anatomical targeting** and **one-strike effectiveness**.

### Core Pillars

- **정격자 (Jeonggyeokja)** - Precision Striker: Every strike targets anatomical vulnerabilities
- **비수 (Bisu)** - Lethal Technique: Realistic application of traditional martial arts
- **암살자 (Amsalja)** - Combat Specialist: Focus on immediate incapacitation
- **급소격 (Geupsogyeok)** - Vital Point Strike: Authentic pressure point combat

## Game Overview

### Genre

2D Realistic Combat Simulator / Traditional Martial Arts Training

### Platform

Web-based (HTML5/WebGL via PixiJS) optimized for authentic 60fps combat physics

### Target Audience

- Fans of realistic combat simulation (Budokan, IK+, Way of the Exploding Fist)
- Martial arts practitioners seeking authentic technique knowledge
- Players interested in traditional Korean martial arts techniques
- Combat enthusiasts wanting precision-based combat gameplay

### Unique Selling Points

1. **Realistic Combat Physics** - Real body mechanics with authentic combat focus
2. **Anatomical Precision** - 70 actual vital points for tactical advantage
3. **Combat Realism** - Blood, bruising, bone impact, realistic physics
4. **Korean Martial Arts** - Based on traditional techniques and philosophy
5. **Traditional Knowledge** - Teaches actual pressure points and applications

## Realistic Combat System

### Core Body Mechanics

#### Health & Combat System (건강 및 전투 체계)

```
COMBAT READINESS:
■■■■■■■■■■ 100% - Combat ready, full capability
■■■■■■■■□□  80% - Light damage, reduced capability
■■■■■■□□□□  60% - Moderate damage, significant impairment
■■■■□□□□□□  40% - Heavy damage, severe limitation
■■□□□□□□□□  20% - Critical damage, near incapacitation
□□□□□□□□□□   0% - Incapacitated/Defeated
```

#### Pain Response System (고통 반응 체계)

- **충격통 (Shock Pain)** - Instant reaction affecting all abilities
- **누적외상 (Cumulative Trauma)** - Progressive damage impairment
- **통증과부하 (Pain Overload)** - Complete incapacitation from overwhelming pain
- **무력화한계 (Incapacitation Threshold)** - Point of complete combat inability

#### Balance & Vulnerability (균형 및 취약성)

```
COMBAT STATES:
🟢 준비완료 (READY)     - Perfect combat position, full capability
🟡 동요상태 (SHAKEN)    - Slightly compromised, reduced accuracy
🟠 취약상태 (VULNERABLE) - Significantly exposed, high damage window
🔴 무력상태 (HELPLESS)  - Complete vulnerability, incapacitation opportunity
```

#### Consciousness Levels (의식 수준)

- **전투각성 (Combat Alert)** - Full awareness, optimal combat ability
- **혼란상태 (Disoriented)** - Reduced reaction, vulnerability window
- **기절직전 (Stunned)** - Severe impairment, incapacitation opportunity
- **무의식 (Unconscious)** - Complete incapacitation

### Player Archetypes

#### 1. 무사 (Musa) - Traditional Warrior

**Background**: Military special forces with traditional martial arts training  
**Philosophy**: Honor through strength, disciplined combat  
**Combat Style**: Direct confrontation, overwhelming force  
**Preferred Trigrams**: ☰ Heaven, ☳ Thunder  
**Equipment**: Tactical gear with traditional elements

**Combat Specialization**:

- **관절기법 (Joint Techniques)** - Traditional joint manipulation and control
- **급소타격 (Vital Point Strikes)** - Military-taught pressure point targeting
- **제압술 (Submission Techniques)** - Honor-based control methods

**Special Abilities**:

- **군인정신 (Gunin Jeongsin)** - Military discipline for increased focus
- **돌격명령 (Dolgyeok Myeongryeong)** - Assault command for team coordination
- **전투경험 (Jeontu Gyeongheom)** - Combat experience for damage resistance

**Signature Techniques**:

- **관절꺾기 (Joint Breaking)** - Honorable arm/wrist control for incapacitation
- **경동맥압박 (Carotid Compression)** - Traditional blood flow restriction
- **척추타격 (Spinal Strikes)** - Direct force spine-targeting attacks

#### 2. 암살자 (Amsalja) - Shadow Assassin

**Background**: Covert operative specializing in silent takedowns  
**Philosophy**: Efficiency through invisibility, one perfect strike  
**Combat Style**: Stealth approaches, instant takedowns  
**Preferred Trigrams**: ☴ Wind, ☵ Water

**Combat Specialization**:

- **무성제압 (Silent Takedowns)** - Techniques preventing vocal response
- **신경파괴 (Nerve Strikes)** - Precise neural disruption for stealth
- **호흡차단 (Respiratory Attacks)** - Silent breathing and consciousness targeting

**Special Abilities**:

- **그림자술 (Geurimja-sul)** - Shadow techniques for stealth
- **일격필살 (Ilgyeok Pilsal)** - One-strike incapacitation potential
- **침묵행보 (Chimmuk Haengbo)** - Silent movement

**Signature Techniques**:

- **경추타격 (Cervical Strikes)** - Silent neck strikes for instant incapacitation
- **늑간신경 (Intercostal Nerve)** - Hidden rib nerve strikes for paralysis
- **기도압박 (Tracheal Compression)** - Stealth windpipe control attacks

#### 3. 해커 (Hacker) - Cyber Warrior

**Background**: Digital native with physical combat training  
**Philosophy**: Information as power, technological advantage  
**Combat Style**: Environmental manipulation, tech-assisted strikes  
**Preferred Trigrams**: ☲ Fire, ☱ Lake

**Combat Specialization**:

- **해부학적분석 (Anatomical Analysis)** - Data-driven approach to vital points
- **생체역학파괴 (Biomechanical Destruction)** - Tech-enhanced body mechanics understanding
- **체계적제압 (Systematic Incapacitation)** - Algorithm-based damage accumulation

**Special Abilities**:

- **전자전 (Jeonja-jeon)** - Electronic warfare for distraction
- **데이터분석 (Data Bunseok)** - Opponent pattern analysis
- **시스템해킹 (System Hacking)** - Environmental control

**Signature Techniques**:

- **신경절차단 (Nerve Cluster Blocking)** - Tech-analyzed nerve center disruption
- **혈관압박 (Vascular Compression)** - Calculated blood flow restriction
- **관절파괴 (Joint Destruction)** - Data-driven joint incapacitation

#### 4. 정보요원 (Jeongbo Yowon) - Intelligence Operative

**Background**: Government agent with psychological warfare training  
**Philosophy**: Knowledge through observation, strategic thinking  
**Combat Style**: Psychological manipulation, precise timing  
**Preferred Trigrams**: ☶ Mountain, ☷ Earth

**Combat Specialization**:

- **고통순응 (Pain Compliance)** - Intelligence-based submission through pain
- **심리적압박 (Psychological Pressure)** - Mental intimidation through technique
- **정보추출 (Information Extraction)** - Combat methods from interrogation training

**Special Abilities**:

- **심리전 (Simri-jeon)** - Psychological warfare
- **정보수집 (Jeongbo Sujip)** - Intelligence gathering
- **전략분석 (Jeonryak Bunseok)** - Strategic analysis

**Signature Techniques**:

- **압점고문 (Pressure Point Control)** - Intelligence-based nerve pressure
- **심리적위압 (Psychological Intimidation)** - Fear-based tactical intimidation
- **복종유도 (Submission Induction)** - Strategic pain-based surrender

#### 5. 조직폭력배 (Jojik Pokryeokbae) - Organized Crime

**Background**: Underground fighter with street-smart brutality  
**Philosophy**: Survival through ruthlessness, practical violence  
**Combat Style**: Dirty fighting, improvised weapons  
**Preferred Trigrams**: ☳ Thunder, ☵ Water

**Combat Specialization**:

- **환경활용 (Environmental Usage)** - Street-smart use of surroundings as weapons
- **더러운기법 (Dirty Techniques)** - Brutal eye attacks, groin strikes, hair pulling
- **생존격투 (Survival Fighting)** - Underground whatever-it-takes combat

**Special Abilities**:

- **거리격투 (Geori Gyeoktu)** - Street fighting techniques
- **생존본능 (Saengjon Bonneung)** - Survival instincts
- **조직력 (Jojik-ryeok)** - Gang coordination

**Signature Techniques**:

- **눈찌르기 (Eye Strikes)** - Street-brutal blinding attacks
- **사타구니공격 (Groin Attacks)** - Ruthless incapacitating strikes
- **목조르기 (Choking)** - Underground strangulation techniques

### Authentic Trigram Applications

#### ☰ 건 (Geon) - Heaven/Direct Force

**Combat Application**: Overwhelming physical power

- **기법 (Technique)**: Direct bone-striking attacks, structural damage
- **전투효과 (Combat Effect)**: Fractures, concussions, immediate trauma
- **음향 (Audio)**: Deep bone impact, crushing contact sounds

#### ☱ 태 (Tae) - Lake/Flowing

**Combat Application**: Fluid redirection techniques

- **기법 (Technique)**: Joint manipulation, throws
- **전투효과 (Combat Effect)**: Dislocations, torn ligaments
- **음향 (Audio)**: Joint popping, ligament stress sounds

#### ☲ 리 (Li) - Fire/Precision

**Combat Application**: Exact vital point targeting

- **기법 (Technique)**: Needle-point accuracy strikes
- **전투효과 (Combat Effect)**: Nerve damage, temporary paralysis
- **음향 (Audio)**: Sharp impact, breath disruption

#### ☳ 진 (Jin) - Thunder/Shock

**Combat Application**: Stunning nerve strikes

- **기법 (Technique)**: Electric-like nerve disruption
- **전투효과 (Combat Effect)**: Temporary paralysis, muscle spasms
- **음향 (Audio)**: Sharp crack, neural impact

#### ☴ 손 (Son) - Wind/Persistence

**Combat Application**: Continuous pressure techniques

- **기법 (Technique)**: Sustained pressure point attacks
- **전투효과 (Combat Effect)**: Gradual incapacitation, cumulative pain
- **음향 (Audio)**: Sustained pressure, grinding contact

#### ☵ 감 (Gam) - Water/Adaptation

**Combat Application**: Counter-grappling, escape techniques

- **기법 (Technique)**: Slippery escapes, flow reversals
- **전투효과 (Combat Effect)**: Joint strain, ligament damage
- **음향 (Audio)**: Sliding, escaping friction

#### ☶ 간 (Gan) - Mountain/Defense

**Combat Application**: Immovable defensive positions

- **기법 (Technique)**: Blocking, absorbing, redirecting
- **전투효과 (Combat Effect)**: Bruising, impact absorption
- **음향 (Audio)**: Solid blocks, deflection impacts

#### ☷ 곤 (Gon) - Earth/Grounding

**Combat Application**: Takedowns, ground control

- **기법 (Technique)**: Wrestling, ground techniques
- **전투효과 (Combat Effect)**: Impact trauma, positional control
- **음향 (Audio)**: Body impact, ground contact

## Realistic Visual & Audio Feedback

### Authentic Combat Effects

#### Blood & Trauma System

- **경상출혈 (Minor Bleeding)** - Small cuts, facial bleeding
- **중등외상 (Moderate Trauma)** - Deep lacerations, significant bleeding
- **중상출혈 (Severe Bleeding)** - Heavy bleeding requiring immediate attention
- **점진적손상 (Progressive Damage)** - Realistic trauma accumulation

#### Realistic Sound Design

- **골절음 (Bone Breaking)** - Authentic bone fracture sounds
- **타격음 (Flesh Impact)** - Body contact sounds with appropriate intensity
- **관절음 (Joint Manipulation)** - Realistic joint movement and stress
- **호흡음 (Breathing Effects)** - Gasping, wheezing, breath disruption
- **낙하음 (Falling Sounds)** - Body impact with ground contact

#### Body Response Animation

- **통증반응 (Pain Reactions)** - Realistic flinching and protective responses
- **균형상실 (Balance Loss)** - Authentic stumbling and recovery attempts
- **무의식상태 (Unconsciousness)** - Proper collapse and incapacitation mechanics
- **손상적응 (Injury Adaptation)** - Movement changes based on damage

### Anatomical Training

#### Vital Point Education (급소 교육)

- **70+ 급소점 (70+ Vital Points)** with combat explanations
- **생리학적효과 (Physiological Effects)** - Real consequences of each strike
- **전투정보 (Combat Information)** - Understanding of technique applications
- **실전통합 (Combat Integration)** - Practical combat response training

#### Combat Training

- **골격표적 (Skeleton Targeting)** - Show bone structure and vulnerabilities
- **신경파괴 (Nerve Targeting)** - Display nervous system targets
- **혈류차단 (Blood Flow Restriction)** - Circulation control points
- **호흡차단 (Respiratory Control)** - Breathing disruption techniques

## Game Modes (Combat Focus)

### 1. 해부학 연구 (Anatomical Study) - Target Analysis

- **급소학습 (Vital Point Study)** - Learn vital point locations and effects
- **정밀타격 (Precision Striking)** - Vital point targeting techniques
- **고급기법 (Advanced Techniques)** - Professional combat applications
- **실전응용 (Practical Application)** - Combat scenario training

### 2. 무술 기법 (Martial Techniques) - Skill Development

- **기본기 (Fundamentals)** - Basic strikes and positioning
- **팔괘술 (Trigram Arts)** - Eight trigram combat applications
- **연계기법 (Combination Techniques)** - Realistic technique chains
- **정밀술 (Precision Arts)** - Scenario-based combat training

### 3. 실전 훈련 (Combat Training) - Realistic Sparring

- **일대일 (One-on-One)** - Single opponent realistic combat
- **다대일 (Multiple Opponents)** - Realistic multi-attacker scenarios
- **환경전투 (Environmental Combat)** - Using surroundings tactically
- **연속대전 (Continuous Combat)** - Endurance-based realistic combat

### 4. 정신 수양 (Mental Cultivation) - Psychological Training

- **고통내성 (Pain Tolerance)** - Building resistance to pain
- **정신집중 (Mental Focus)** - Concentration under pressure
- **공포극복 (Fear Management)** - Dealing with combat stress
- **의지력 (Willpower)** - Maintaining consciousness under duress

## Technical Implementation

### Realistic Combat Calculation

## Cultural and Traditional Integration

### Korean Martial Arts Authenticity

- **전통기법 (Traditional Techniques)** - Based on actual Korean martial arts (태권도, 합기도, 택견, 유술)
- **정통용어 (Authentic Terminology)** - Traditional Korean names with combat translations
- **역사적맥락 (Historical Context)** - Real Korean military and martial arts history
- **철학적기반 (Philosophical Foundation)** - Genuine I Ching principles in combat application

### Educational Value

- **무술교육 (Martial Education)** - Real anatomy and combat learning
- **전통사 (Traditional History)** - Korean fighting tradition education
- **안전의식 (Safety Awareness)** - Understanding technique consequences
- **응급처치 (First Aid Training)** - Basic medical response to injuries

### Traditional Framework

- **실전적용 (Practical Application)** - Emphasis on self-defense and sport application
- **전투인식 (Combat Awareness)** - Clear understanding of technique effects
- **현실적경고 (Realistic Warnings)** - Proper warnings about real-world application
- **교육목적 (Educational Purpose)** - Focus on learning traditional martial arts

## Success Metrics

### Combat Proficiency

- **해부학적지식 (Anatomical Knowledge)** - Accurate vital point identification
- **기법정밀도 (Technique Precision)** - Exact targeting and timing
- **안전의식 (Safety Awareness)** - Understanding of technique consequences
- **실전응용 (Combat Application)** - Proper technique execution

### Traditional Achievement

- **무술이해 (Martial Understanding)** - Comprehension of combat effects
- **문화학습 (Cultural Learning)** - Korean martial arts knowledge
- **전투의식 (Combat Consciousness)** - Responsible technique awareness
- **무예기술 (Martial Skills)** - Practical combat response capability

---

## 🌑 Dark Architecture

### Shadow Combat System Architecture

```mermaid
graph TB
    subgraph "Dark Korean Martial Core"
        DKMA[Dark Korean Martial Engine] --> SPS[Shadow Philosophy System]
        DKMA --> LVP[Lethal Vital Point System - 70 Targets]
        DKMA --> UKT[Underground Korean Techniques]
        DKMA --> BCP[Brutal Combat Physics]
    end

    subgraph "Underground Systems"
        US[Underground System] --> SL[Shadow Learning]
        US --> LA[Lethal Anatomy Teaching]
        US --> DP[Dark Philosophy]
        US --> UC[Underground Culture]
    end

    subgraph "Assassination Targeting"
        AT[Assassination Targeting] --> LHD[Lethal Hit Detection]
        AT --> DAC[Damage Amplification Calculator]
        AT --> PDM[Precise Distance Measurement]
        AT --> LVV[Lethal Vital Validator]
    end

    DKMA --> US
    DKMA --> AT
    style DKMA fill:#8b0000,stroke:#ff0000,color:#fff
    style US fill:#2d1b69,stroke:#6a0dad,color:#fff
    style AT fill:#000000,stroke:#ff6b6b,color:#fff
```

### Underground Dojang Environment Design

#### **Shadow Dojang Setting**

- **지하도장 (Underground Dojang)** - Hidden training facility beneath the city
- **네온조명 (Neon Lighting)** - Red and cyan lighting creating dramatic shadows
- **혈흔 (Blood Stains)** - Evidence of previous brutal training sessions
- **전투장비 (Combat Equipment)** - Professional-grade training tools for lethal practice

#### **Cyberpunk Korean Aesthetics**

- **한글네온 (Hangul Neon)** - Korean characters in cyberpunk styling
- **어둠속기호 (Symbols in Darkness)** - Traditional trigrams with modern dark interpretation
- **지하분위기 (Underground Atmosphere)** - Gritty, realistic underground environment
- **전투의식 (Combat Ritual)** - Dark ceremonial elements for serious training

### Brutal Audio Design Integration

#### **Underground Korean Music**

- **어둠의가야금 (Dark Gayageum)** - Traditional Korean instruments with industrial elements
- **지하전투음 (Underground Combat Sounds)** - Realistic bone-breaking and impact audio
- **한국타악기 (Korean Percussion)** - War drums and traditional instruments for intensity
- **침묵의순간 (Moments of Silence)** - Strategic audio pauses for psychological impact

---

## 🎭 Dark Training Modules Enhanced

### 🌑 암흑수련 (Dark Training) - Shadow Path Mastery

#### **그림자기법 (Shadow Techniques)**

- **은밀살상 (Stealth Killing)** - Silent takedown techniques from Korean special forces
- **신경파괴술 (Neural Destruction)** - Advanced nerve strike applications
- **혈관차단법 (Vascular Occlusion)** - Blood flow restriction for incapacitation
- **기도폐쇄술 (Airway Closure)** - Respiratory control techniques

#### **지하무술 (Underground Martial Arts)**

- **거리생존술 (Street Survival)** - Brutal Korean street fighting adaptations
- **암살기법 (Assassination Techniques)** - Professional elimination methods
- **고문술 (Interrogation Techniques)** - Pressure point applications for information extraction
- **생존격투 (Survival Combat)** - Whatever-it-takes underground fighting

#### **심리전술 (Psychological Warfare)**

- **공포유발 (Fear Induction)** - Using technique demonstration for intimidation
- **정신압박 (Mental Pressure)** - Psychological dominance through combat skill
- **의지파괴 (Will Breaking)** - Breaking opponent's fighting spirit
- **굴복유도 (Submission Induction)** - Forcing surrender through demonstrated capability

### 🔴 실전혈투 (Real Blood Combat) - Underground Tournaments

#### **지하토너먼트 (Underground Tournament)**

- **무규칙격투 (No-Rules Fighting)** - Anything-goes underground combat
- **생존경기 (Survival Matches)** - Last-fighter-standing competitions
- **급소대전 (Vital Point Duels)** - Precision targeting competitions
- **혈전스페셜 (Blood Match Special)** - Intense, realistic combat scenarios

#### **계급승급 (Rank Advancement)**

```
암흑단계 (Dark Levels):
🔴 입문자 (Initiate) - Basic shadow techniques
⚫ 수련생 (Practitioner) - Intermediate lethal skills
🩸 전문가 (Expert) - Advanced killing techniques
💀 대가 (Master) - Perfect assassination capability
👹 전설 (Legend) - Underground martial arts mythology
```

---

## 🌟 Dark Success Metrics

### **Underground Achievement System**

#### **살상기술 (Lethal Skill) Mastery**

- **완벽한정밀도 (Perfect Precision)** - 100% vital point accuracy
- **일격제압 (One-Strike Takedown)** - Single-strike incapacitation capability
- **침묵의대가 (Silent Master)** - Stealth takedown expertise
- **혈투승리자 (Blood Combat Victor)** - Underground tournament champion

#### **어둠의지식 (Dark Knowledge) Acquisition**

- **해부학전문가 (Anatomy Expert)** - Complete understanding of all 70 vital points
- **신경파괴술사 (Neural Destructor)** - Master of nerve targeting techniques
- **혈관조작사 (Vascular Manipulator)** - Expert in blood flow control
- **의식조작자 (Consciousness Controller)** - Master of awareness manipulation

#### **지하명성 (Underground Reputation)**

- **그림자전설 (Shadow Legend)** - Mythical status in underground circles
- **공포의상징 (Symbol of Fear)** - Opponents fear to face you
- **완벽한암살자 (Perfect Assassin)** - Undetectable takedown capability
- **지하왕 (Underground King)** - Supreme ruler of shadow martial arts

---

## 🎓 Dark Educational Philosophy

**Black Trigram** transcends traditional gaming by serving as a bridge between ancient Korean shadow wisdom and modern interactive lethal learning. Through respectful representation of underground martial arts philosophy, combat medical knowledge, and cultural traditions, players gain practical fighting skills while developing deep appreciation for Korean shadow heritage.

The game emphasizes **respect, discipline, and lethal mastery** - core values of traditional Korean underground martial arts - while providing authentic knowledge that extends beyond the digital realm into real-world combat application within ethical boundaries.

---

_"어둠 속에서 완벽한 일격을 찾아라"_  
_"In darkness, seek the perfect strike"_

### 🌑 The Shadow Path Awaits

**Black Trigram** offers a mature, respectful exploration of Korean martial arts' darker applications while maintaining cultural authenticity and educational value. Through careful balance of intensity and respect, players gain genuine understanding of combat techniques within a framework of Korean philosophical tradition.

_Enter the shadow dojang. Master the dark arts. Walk the path of the perfect lethal strike._

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

---

## 2. Core Gameplay

### 2.1 Arena: 10×10 Octagonal Grid

- **Grid Layout**  
  - The combat arena is a **10×10 square grid** with coordinates \((x, y) ∈ \{0…9\}²\).  
  - Each cell measures ~0.3 m per side (the full square is ~3 m×3 m).  
  - Inscribed within the square is a **regular octagon** whose vertices touch the midpoints of each edge of the square.
  - Visual Representation (conceptual):

%% Legend:  
%% 🔵 = Fighter A  
%% 🔴 = Fighter B  
%% 🟩 = Possible Move  
%% ⬜ = Playable Cell  

Both fighters can move in any of the eight adjacent directions (↑ ↓ ← → ↖ ↗ ↘ ↙). Below is an 8×8 grid showing Fighter A (🔵) at (4, 3) and Fighter B (🔴) at (5, 6), along with all of their possible moves (🟩):

|     |     |     |     |     |     |     |     |
|-----|-----|-----|-----|-----|-----|-----|-----|
| ⬜  | ⬜  | ⬜  | ⬜  | ⬜  | ⬜  | ⬜  | ⬜  | 1
| ⬜  | ⬜  | ⬜  | ⬜  | ⬜  | ⬜  | ⬜  | ⬜  | 2
| ⬜  | 🟩  | 🟩  | 🟩  | ⬜  | ⬜  | ⬜  | ⬜  | 3
| ⬜  | 🟩  | 🔵  | 🟩  | 🟩  | 🟩  | 🟩  | ⬜  | 4
| ⬜  | 🟩  | 🟩  | 🟩  | 🟩  | 🔴  | 🟩  | ⬜  | 5
| ⬜  | ⬜  | ⬜  | ⬜  | 🟩  | 🟩  | 🟩  | ⬜  | 6
| ⬜  | ⬜  | ⬜  | ⬜  | ⬜  | ⬜  | ⬜  | ⬜  | 7
| ⬜  | ⬜  | ⬜  | ⬜  | ⬜  | ⬜  | ⬜  | ⬜  | 8
  1    2    3    4    5    6    7    8  

- Fighter A (🔵) is at row 4, column 3.  
- Fighter B (🔴) is at row 5, column 6.  

**Fighter A’s possible moves (🟩):**  
- Row 3: (3, 2), (3, 3), (3, 4)  
- Row 4: (4, 2), (4, 4)  
- Row 5: (5, 2), (5, 3), (5, 4)  

**Fighter B’s possible moves (🟩):**  
- Row 4: (4, 5), (4, 6), (4, 7)  
- Row 5: (5, 5), (5, 7)  
- Row 6: (6, 5), (6, 6), (6, 7)  

All other cells are playable (⬜) but not occupied or targeted this turn.  

> **Note:** Only cells whose centers lie inside or on the inscribed octagon are **playable**. Other cells are displayed in a darker shade (**out-of-bounds**).

  - **Playable Cells:**  
    - A cell is “in-play” if its center \((x × 0.3 + 0.15,\;y × 0.3 + 0.15)\) lies inside or on the octagon boundary.
    - These cells are fully accessible for movement, attacks, and throws.
  - **Out‐of‐Bounds Cells:**  
    - Still visible (darkened), but cannot be entered or attacked from.
    - Attempting to move into one triggers a **“skid” animation** (8‐frame recovery, no displacement, no stamina refund).

- **Octagon Definition Steps**  
  1. Draw a regular octagon inscribed in the 10×10 square so that each vertex touches the midpoint of one square edge.  
  2. For each cell \((x, y)\), compute its center:  
     \[
       \bigl(x \times 0.3 \,\text{m} + 0.15 \,\text{m},\; y \times 0.3 \,\text{m} + 0.15 \,\text{m}\bigr).
     \]  
  3. If that point lies inside or on the octagon, mark the cell **Playable**; otherwise, **Out‐of‐Bounds**.

- **Starting Positions**  
  - **Player 1** spawns at the leftmost playable edge cell (either \((0,4)\) or \((0,5)\), whichever is inside) facing **east**.  
  - **Player 2** spawns symmetrically at \((9,4)\) or \((9,5)\), facing **west**.  
  - Both begin in **☰ Geon (Ap Seogi)** with **right‐foot forward** by default (players can press `X` pre‐round to swap feet).  
  - Initial CombatStats for each player:  
    ```typescript
    {
      health: 100,
      pain: 0,
      balance: "READY",
      consciousness: 100,
      bloodLoss: 0,
      stamina: 100
    }
    ```

- **Coordinate Validation**  
  - A move from \((x, y) → (x′, y′)\) is valid only if:  
    1. \(0 ≤ x′, y′ ≤ 9\), and  
    2. Cell \((x′, y′)\) is **Playable**.  
  - **Invalid Moves:**  
    - Trigger **Skid Animation**:  
      - **8-frame recovery**  
      - No position change  
      - No stamina refund  

---

### 2.2 CombatStats & States

Each fighter’s condition is tracked by six core stats:

| **Stat**          | **Icon** | **Range** | **Description**                                                                                             |
|-------------------|:--------:|:---------:|:-----------------------------------------------------------------------------------------------------------|
| **health**        | ❤️       | 0–100     | Vital Health; when ≤ 0 → **KO** (One-Strike Finish).                                                         |
| **pain**          | 😖       | 0–100     | Accumulated pain; drives **balance** transitions (READY → SHAKEN → VULNERABLE → HELPLESS).                    |
| **balance**       | ⚖️       | Enum      | “READY” (🟢), “SHAKEN” (🟡), “VULNERABLE” (🟠), “HELPLESS” (🔴). Affects movement speed, block cost, damage taken. |
| **consciousness** | 🧠      | 0–100     | Awareness; ≤ 0 → **HELPLESS** (stunned) for 3 sec, then recovers to 20 (balance → VULNERABLE).                  |
| **bloodLoss**     | 🩸      | 0–100     | Cumulative bleed; while > 0:  
|                   |          |           | &nbsp;&nbsp;• health −= 1/sec  
|                   |          |           | &nbsp;&nbsp;• pain += 2/sec  
|                   |          |           | &nbsp;&nbsp;• consciousness −= 2/sec  
|                   |          |           | ≥ 100 → **HELPLESS** (bleed-out).  
| **stamina**       | 🔋      | 0–100     | Energy for movement/attacks; regenerates when idle; at 0, actions cost +5 stamina and +5 frames.              |

#### 2.2.1 Balance States & Effects

```mermaid
stateDiagram-v2
    direction LR

    %% Define states with labels
    state ReadyState: Ready
    state ShakenState: Shaken
    state VulnerableState: Vulnerable
    state HelplessState: Helpless

    %% Apply custom styling
    style ReadyState fill:#00cc44,stroke:#007700,stroke-width:2px
    style ShakenState fill:#ffcc00,stroke:#aa8800,stroke-width:2px
    style VulnerableState fill:#ff8800,stroke:#aa4400,stroke-width:2px
    style HelplessState fill:#cc0000,stroke:#770000,stroke-width:2px

    %% Transitions
    [*] --> ReadyState: pain < 20
    ReadyState --> ShakenState: pain ≥ 20

    ShakenState --> VulnerableState: pain ≥ 50 or health < 20
    ShakenState --> ReadyState: pain < 20

    VulnerableState --> HelplessState: pain ≥ 80 or consciousness ≤ 0 or bloodLoss ≥ 100
    VulnerableState --> ShakenState: pain < 50

    HelplessState --> VulnerableState: recovery complete
````

* **READY (🟢):**

  * Condition: `pain < 20` **and** `consciousness > 50` **and** `bloodLoss < 100`.
  * Effects:

    * Movement: no penalty
    * Block cost: normal
    * Vital Resistance: +0% (base)

* **SHAKEN (🟡):**

  * Condition: `20 ≤ pain < 50` **and** `consciousness > 40` **and** `bloodLoss < 100`.
  * Effects:

    * Movement: –10% speed
    * Block cost: +10%
    * Vital Resistance: –5%

* **VULNERABLE (🟠):**

  * Condition: `(50 ≤ pain < 80 or health < 20)` **and** `consciousness > 20` **and** `bloodLoss < 100`.
  * Effects:

    * Movement: –20% speed
    * Block cost: ×2
    * Incoming damage: +10%
    * Outgoing damage: +10%

* **HELPLESS (🔴):**

  * Condition: `pain ≥ 80` **or** `consciousness ≤ 0` **or** `bloodLoss ≥ 100`.
  * Effects:

    * Cannot move, block, or attack
    * Remains helpless for 2–3 sec
    * On recovery:

      * `balance = VULNERABLE`
      * `pain += 10` (max 100)
      * `bloodLoss −= 20`
      * `consciousness = 20`
      * `health += 10` (max 100)

#### 2.2.2 Stat Interactions & Recovery

| **Effect**                  | **Stat Impact**                                          | **Details**                                                                                                        |
| --------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Pain Accumulation**       | `pain += (baseDamage × 0.1) + attackPain`                | Each landed strike adds pain. Blocking reduces pain via Vital Resistance (see 2.6.1).                              |
| **Pain Decay**              | `pain −= 5 / sec`                                        | If no new hits for ≥ 1 sec, pain steadily decreases until 0.                                                       |
| **Blood Loss Accumulation** | `bloodLoss += bleedValue`                                | Certain strikes (rib stabs, vascular attacks) add +10–20 bleed points.                                             |
| **Blood Loss Effects**      | If `bloodLoss > 0`:                                      |                                                                                                                    |
|                             | `health −= 1/sec; pain += 2/sec; consciousness −= 2/sec` | Bleed‐out sim: continuous health drain & pain increase;                                                            |
|                             |                                                          | if `bloodLoss ≥ 100` → immediate **HELPLESS** (unconscious).                                                       |
| **Consciousness Drop**      | `consciousness −= concussValue`                          | Head/nerve strikes subtract consciousness; if ≤ 0 → **HELPLESS** for 3 sec, recovers to 20 (balance → VULNERABLE). |
| **Stamina Drain**           | See **2.8 Stamina Costs**                                | Each movement, attack, block drains stamina as specified.                                                          |
| **Stamina Regeneration**    | `stamina += 10/sec` if idle ≥ 1 sec                      | Idle regen; if `stamina ≤ 0`, all movement costs +5, attacks cost +5 frames extra.                                 |

---

### 2.3 Trigram‐Based Stance System

Players press **1–8** to select one of the eight Trigrams (☰–☷). Each Trigram corresponds to a **Taekwondo/Hapkido stance**—**Short**, **Long**, **Low**, or **Deep**—instantly adjusting hitboxes, attack/defense properties, and stat modifiers. **Foot orientation** (which leg leads) is controlled via `X`, auto‐pivot logic, and `Z+Arrow` moves.

#### 2.3.1 Stance Table & Stat Modifiers

| **Trigram**                                 | **Key** | **Category** | **Stance (K/H)**                  | **Stat Modifiers**                   |
| ------------------------------------------- | :-----: | :----------: | :-------------------------------- | :----------------------------------- |
| ☰ Geon (건, Heaven)                          |    1    | Short Stance | **Ap Seogi (앞서기)** (Walking)      | • +15% movement speed                |
| • +10% startup on bone-break attacks        |         |              |                                   |                                      |
| • –10% throw power                          |         |              |                                   |                                      |
| • +5% pivot speed                           |         |              |                                   |                                      |
| • 🩸 bleed from bone-break +5               |         |              |                                   |                                      |
| ☱ Tae (태, Lake)                             |    2    |  Long Stance | **Ap Koobi Seogi (앞굽이)** (Front)  | • +15% reach (throws/sweeps)         |
| • +10% takedown damage                      |         |              |                                   |                                      |
| • –10% lateral agility                      |         |              |                                   |                                      |
| • +5% stability vs. pushes                  |         |              |                                   |                                      |
| • 🩸 bleed from joint locks +10             |         |              |                                   |                                      |
| ☲ Li (리, Fire)                              |    3    |  Low Stance  | **Juchum Seogi (주춤)** (Horse)     | • +15% stability vs. vital strikes   |
| • +10% knockdown resistance                 |         |              |                                   |                                      |
| • –10% movement speed                       |         |              |                                   |                                      |
| • +5% crit hit chance                       |         |              |                                   |                                      |
| • 🧠 +0 consciousness drop from body shots  |         |              |                                   |                                      |
| • 🩸 +5 bleed per hit                       |         |              |                                   |                                      |
| ☳ Jin (진, Thunder)                          |    4    |  Deep Stance | **Dwi Koobi Seogi (뒤굽이)** (Back)  | • +15% shock damage on nerve strikes |
| • +10% stability vs. impact                 |         |              |                                   |                                      |
| • –10% forward mobility                     |         |              |                                   |                                      |
| • +5% pivot speed                           |         |              |                                   |                                      |
| • 🧠 –30 consciousness on head hits         |         |              |                                   |                                      |
| • 🩸 +5 bleed                               |         |              |                                   |                                      |
| ☴ Son (손, Wind)                             |    5    | Short Stance | **Niunja Seogi (니은자)** (L-Stance) | • +10% lateral movement              |
| • +10% chaining speed on pressure sequences |         |              |                                   |                                      |
| • –5% reach                                 |         |              |                                   |                                      |
| • +5% flank block coverage                  |         |              |                                   |                                      |
| • 🩸 +5 bleed per elbow grind               |         |              |                                   |                                      |
| ☵ Gam (감, Water)                            |    6    |  Long Stance | **Narani Seogi (나란이)** (Parallel) | • +10% adaptability/counter speed    |
| • +5% block vs. sweeps                      |         |              |                                   |                                      |
| • –5% heavy strike damage                   |         |              |                                   |                                      |
| • –5% ground stability                      |         |              |                                   |                                      |
| • 🩸 +15 bleed on rib shots                 |         |              |                                   |                                      |
| ☶ Gan (간, Mountain)                         |    7    |  Low Stance  | **Gibo Seogi (기본)** (Basic)       | • +15% block strength                |
| • +10% counter-strike speed                 |         |              |                                   |                                      |
| • –10% throw power                          |         |              |                                   |                                      |
| • +5% recoil stability                      |         |              |                                   |                                      |
| • 🩸 +10 bleed on heavy blocks              |         |              |                                   |                                      |
| ☷ Gon (곤, Earth)                            |    8    |  Deep Stance | **Joong Ha Seogi (중하)** (Deep)    | • +20% ground-control advantage      |
| • +10% throw/lock success                   |         |              |                                   |                                      |
| • –15% movement speed                       |         |              |                                   |                                      |
| • –5% vertical reach                        |         |              |                                   |                                      |
| • 🩸 +20 bleed on takedowns                 |         |              |                                   |                                      |
| • 🧠 +0 consciousness change                |         |              |                                   |                                      |

##### 2.3.1.1 Short Stance Details (☰ Geon, ☴ Son)

* **Ap Seogi (☰ Geon)**

  * **Stamina Drain:** –5 per step
  * **Balance Baseline:** “READY”
  * **Use Case:**

    * Fast, mobile bone-breaking jabs and palm strikes.
    * Vulnerable to counters if overextended.
  * **Cyberpunk Flair:**

    * Neon particle trails behind each step, tinted **#00CCFF**.

* **Niunja Seogi (☴ Son)**

  * **Stamina Drain:** –5 per step
  * **Balance:** +5% flank block coverage
  * **Use Case:**

    * Swift lateral pressure, chaining elbow sequences to accumulate pain.
  * **Cyberpunk Flair:**

    * Holographic side-scan reticle highlights opponent’s ribs when lining up low strikes.

##### 2.3.1.2 Long Stance Details (☱ Tae, ☵ Gam)

* **Ap Koobi Seogi (☱ Tae)**

  * **Stamina Drain:** –10 per step/swap
  * **Balance:** +5% frontal stability
  * **Use Case:**

    * Heavy throws and sweeps; excellent reach but slow side-to-side.
  * **Cyberpunk Flair:**

    * Motion paths glow **#FF8800**, indicating throw arcs.

* **Narani Seogi (☵ Gam)**

  * **Stamina Drain:** –5 per step
  * **Balance:** +5% block vs. low sweeps
  * **Use Case:**

    * Flow‐into counters—slip-and-shuck to vital zones.
  * **Cyberpunk Flair:**

    * “Digital slip” effect: brief transparency when evading.

##### 2.3.1.3 Low Stance Details (☲ Li, ☶ Gan)

* **Juchum Seogi (☲ Li)**

  * **Stamina Drain:** –10 per kick
  * **Balance:** –5% walk speed, +15% stability versus vital strikes
  * **Use Case:**

    * Precise vital-point attacks; rock-solid under pressure.
  * **Cyberpunk Flair:**

    * Virtual reticle locks on vital points when stance is held for > 0.5 sec.

* **Gibo Seogi (☶ Gan)**

  * **Stamina Drain:** –2/sec when blocking
  * **Balance:** +15% block strength
  * **Use Case:**

    * Impenetrable defense; punishes reckless attackers with quick counters.
  * **Cyberpunk Flair:**

    * A shimmering energy shield (hexagonal pattern) appears on successful block.

##### 2.3.1.4 Deep Stance Details (☳ Jin, ☷ Gon)

* **Dwi Koobi Seogi (☳ Jin)**

  * **Stamina Drain:** +15 on shock strikes
  * **Balance:** +10% stability when struck
  * **Consciousness:** –30 if hit on head
  * **Use Case:**

    * Root-and-retaliate shock counters; highly stable.
    * Slow to advance.
  * **Cyberpunk Flair:**

    * When a nerve strike lands, the screen briefly flashes tinted **#FF00FF**.

* **Joong Ha Seogi (☷ Gon)**

  * **Stamina Drain:** –12 per takedown
  * **Balance:** Vulnerable threshold lowers if pain > 80
  * **Bleed:** +20 per ground-lock
  * **Use Case:**

    * Ground clinches, throws, heavy bleed potential.
    * Very slow movement.
  * **Cyberpunk Flair:**

    * Ground-lock triggers a pulsating readout of blood flow on screen edges.

---

#### 2.3.2 Stance Switching & Footwork

1. **Select a New Trigram (1–8)**

   * **Instant** switch to chosen stance; applies new stat modifiers immediately (no foot swap).
   * Visual: stance icon hologram flickers to new symbol in **#00FFAA**.

2. **Swap Front Foot (Mirror Stance)**

   * **Key:** `X`
   * Flip which leg is forward (mirror stance).
   * **Cost:** 🔋 –2; no stance change.
   * Visual: neon foot icon flips in HUD.

3. **Move One Cell (Auto-Pivot)**

   * **Key:** Arrow alone (`↑`,`↓`,`←`,`→`, diagonals)
   * Moves one cell. If current front foot conflicts with movement direction → auto-pivot (mirror stance, flip foot).
   * **Cost:** 🔋 –7 (auto-pivot) else 🔋 –5.
   * **Frames:** 8–10.
   * Visual: small neon radial burst at new cell.

4. **Short Step (Keep Front Foot)**

   * **Key:** `Z`+Arrow
   * Move one cell, force current front foot stay forward (no pivot).
   * **Cost:** 🔋 –5.
   * **Frames:** 10.
   * Visual: small neon “trail” behind leading foot.

5. **Step & Swap Foot (Explicit Foot Change)**

   * **Key:** `X`+Arrow
   * Mirror front foot, then move one cell.
   * **Cost:** 🔋 –10.
   * **Frames:** 14.
   * Visual: HUD foot icon swaps, step emits neon spark.

---

### 2.4 Controls & Input Mapping

| **Action**                              | **Key**                                 | **Effect**                                                                                                                             |
| --------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Select Trigram Style (☰–☷)**          | `1`–`8`                                 | Switch to corresponding stance; apply immediate stat modifiers (no foot change). HUD icon glows **#00FFAA**.                           |
| **Swap Front Foot (Mirror Stance)**     | `X`                                     | Flip front/back foot; cost 🔋 –2; stance remains. HUD foot icon flips direction.                                                       |
| **Move One Cell (Auto-Pivot)**          | Arrow only (`↑`,`↓`,`←`,`→`, diagonals) | Move one cell; if feet conflict → auto-pivot (flip stance) for 🔋 –7; else 🔋 –5. Takes 8–10 frames. Position updates with neon trail. |
| **Short Step (Keep Front Foot)**        | `Z`+Arrow                               | Move one cell, maintain front foot orientation (no pivot). Cost 🔋 –5; 10 frames. Emits small neon “afterimage.”                       |
| **Step & Swap Foot (No Stance Change)** | `X`+Arrow                               | Mirror foot (flip stance), then move one cell; cost 🔋 –10; 14 frames. HUD foot icon swaps, neon spark on cell entry.                  |
| **Block (Hold or Tap)**                 | `B`                                     | Enter current stance’s block posture:                                                                                                  |

* **Tap `B`:** Snap block (4 frames), 🔋 –3; Vital Resistance Bonus +15–30% (stance‐dependent).
* **Hold `B`:** Sustained guard; drains 🔋 –2/sec; Resist Bonus reapplied each hit. HUD shield icon glows **#0088FF**.                                                                           |
  \| **Attack (Front-Hand & Directional)**  | **Space** (with optional Arrow)   | **Space** alone → stance’s **Front-Hand Strike**; 🔋 –8; 12 frames; neon motion trail.
* `Space` + `↑` → **Front-Leg Kick**; 🔋 –12; 16 frames; ground crackle.
* `Space` + `←` → **Front-Elbow Strike**; 🔋 –10; 14 frames; swift slice.
* `Space` + `↓` → **Front-Knee Strike**; 🔋 –10; 14 frames; stomping echo.
* `Space` + `→` → **Back-Hand Strike**; 🔋 –9; 13 frames; echoing thump.
* **Rotational Backcast:** Press `Space` then `↓` in same frame → 180° pivot (10 frames) + spinning back strike (10 frames); 🔋 –15; radial neon shock.
* **Queued Attacks:** While moving (`Arrow` or `Z+Arrow`), hold `Space+Arrow` to queue immediate limb strike on landing. HUD attack icon flashes **#FF0055**.                                                                                                                |
  \| **Rotate Camera / UI**               | (N/A in 2D)                      | Not applicable; fixed 2D side view.                                                                                                                                                                                                                                          |

---

### 2.5 Stat Tables & Interactions

#### 2.5.1 CombatStats at a Glance

| **Stat**          | **Icon** | **Initial** | **Min** | **Max** | **Decay / Regen**                                                                                                              |
| ----------------- | :------: | :---------: | :-----: | :-----: | :----------------------------------------------------------------------------------------------------------------------------- |
| **health**        |    ❤️    |     100     |    0    |   100   | Bleed drains –1/sec; KO at 0 → **HELPLESS**.                                                                                   |
| **pain**          |    😖    |      0      |    0    |   100   | Decays –5/sec if no hits ≥ 1 sec; influences **balance** transitions (see 2.2.1).                                              |
| **balance**       |    ⚖️    |    READY    |    –    |    –    | Changes based on `pain`, `health`, `bloodLoss`, `consciousness` (see 2.2.1 / mermaid state diagram).                           |
| **consciousness** |    🧠    |     100     |    0    |   100   | Head strikes subtract; at 0 → **HELPLESS** (3 sec), recovers to 20 → **VULNERABLE**.                                           |
| **bloodLoss**     |    🩸    |      0      |    0    |   100   | Each bleed strike adds +10–20; while >0: health –1/sec; pain +2/sec; consciousness –2/sec. At ≥100 → **HELPLESS (bleed-out).** |
| **stamina**       |    🔋    |     100     |    0    |   100   | Drains per action (see 2.8); regenerates +10/sec if idle ≥ 1 sec; if ≤0, all moves/attacks cost +5 more and +5 frames extra.   |

#### 2.5.2 Balance State Transitions

```mermaid
flowchart LR
    %% Define each state with a simpler label (using ASCII comparisons)
    Ready["READY 🟢<br/>Pain < 20 & Cons > 50 & Blood < 100"]
    Shaken["SHAKEN 🟡<br/>20 ≤ Pain < 50 & Cons > 40 & Blood < 100"]
    Vulnerable["VULNERABLE 🟠<br/>50 ≤ Pain < 80 or Health < 20<br/>Cons > 20 & Blood < 100"]
    Helpless["HELPLESS 🔴<br/>Pain ≥ 80 or Cons ≤ 0 or Blood ≥ 100"]

    %% Apply custom styling
    style Ready      fill:#00cc44,stroke:#007700,stroke-width:2px
    style Shaken     fill:#ffcc00,stroke:#aa8800,stroke-width:2px
    style Vulnerable fill:#ff8800,stroke:#aa4400,stroke-width:2px
    style Helpless   fill:#cc0000,stroke:#770000,stroke-width:2px

    %% Transitions (each label is quoted to avoid parse errors)
    Ready      --> Shaken      : "pain ≥ 20"
    Shaken     --> Vulnerable  : "pain ≥ 50 or health < 20"
    Vulnerable --> Helpless    : "pain ≥ 80 or consciousness ≤ 0 or bloodLoss ≥ 100"
    Helpless   --> Vulnerable  : "recovery (3 sec) | pain +10 | bloodLoss –20 | cons = 20 | health +10"
    Shaken     --> Ready       : "pain < 20"
    Vulnerable --> Shaken      : "pain < 50"
```

---

### 2.6 Vital-Point Attack System

Each limb attack targets a specific anatomical zone (vital point). Landing high-value strikes can result in one-strike KOs or severe status effects.

#### 2.6.1 Attack → Vital Zone Mapping

| **Trigram** | **Attack**                        | **Zone**             | **Damage (health)** | **Pain** | **Bleed** | **Consciousness** | **Balance Impact**                                                      |
| ----------- | --------------------------------- | -------------------- | ------------------- | -------- | --------- | ----------------- | ----------------------------------------------------------------------- |
| **☲ Li**    | Needle-Point Jab                  | Solar Plexus         | –20                 | +15      | +5        | 0                 | If `health < 50` post-hit → **VULNERABLE**.                             |
| **☲ Li**    | Thumb-Push                        | Jugular Notch        | –75 (Critical)      | +25      | +10       | –20               | Instant KO if `health ≤ 75`; consciousness drop may → **HELPLESS**.     |
| **☳ Jin**   | Shock Palm                        | Temple               | –50                 | +30      | +5        | –30               | If blocked, also –10 consciousness; may → **HELPLESS**.                 |
| **☳ Jin**   | Hammerfist                        | Clavicle             | –30                 | +20      | +5        | 0                 | May stagger → **SHAKEN**.                                               |
| **☴ Son**   | Elbow Grind (×n)                  | Intercostal Nerves   | –15 × n             | +10 × n  | +5 × n    | 0                 | Builds pain quickly; if cumulative `pain ≥ 50` → **VULNERABLE**.        |
| **☴ Son**   | Knee-Tap                          | Patellar Nerve       | –40                 | +30      | +10       | 0                 | May → **VULNERABLE**.                                                   |
| **☷ Gon**   | Spinning Takedown                 | Lower Lumbar (Spine) | –60 (Major)         | +40      | +20       | 0                 | If defender **VULNERABLE** or **SHAKEN** → KO; else → **VULNERABLE**.   |
| **☷ Gon**   | Ground-Lock                       | Brachial Plexus      | –50                 | +35      | +15       | 0                 | If blocked, bleed still applies; pain → **VULNERABLE**.                 |
| **☱ Tae**   | Thrown Arm Lock                   | Elbow Joint          | –30                 | +25      | +10       | 0                 | If defender **SHAKEN** → **VULNERABLE**.                                |
| **☱ Tae**   | Hip Sweep                         | Sacral Region        | –40                 | +30      | +10       | 0                 | If blocked: `NetDamage = 40 × (1 – Res%)`; pain may → **VULNERABLE**.   |
| **☵ Gam**   | Slip & Shuck                      | Floating Ribs        | –25                 | +20      | +15       | 0                 | May induce bleed over time; pain → **SHAKEN**.                          |
| **☵ Gam**   | Reversal Choke                    | Carotid Artery       | –75 (Critical)      | +30      | +10       | 0                 | Instant KO if defender’s Vital Resistance < 25%; else → **VULNERABLE**. |
| **☶ Gan**   | Parry + Counter Palm              | Solar Plexus         | –20                 | +15      | +10       | 0                 | If defender was **READY**, counters may → **SHAKEN**.                   |
| **☶ Gan**   | Forearm Block + Counter to Kidney | Kidney               | –35                 | +20      | +10       | 0                 | Blocks bleed then punishes; if defender **SHAKEN** → **VULNERABLE**.    |
| **☰ Geon**  | Straight Bone-Break Jab           | Sternum              | –30                 | +20      | +5        | 0                 | If unblocked, may fracture; pain → **SHAKEN**.                          |
| **☰ Geon**  | Cross-Bone Edge                   | Mandible (Jaw)       | –40                 | +25      | +5        | 0                 | If unblocked and target `health < 40` → **VULNERABLE**.                 |

##### 2.6.1.1 Blocking & Resistance

* **When Blocking (`B`):**

  1. Compute **Vital Resistance Bonus (VRB)** based on current stance:

     * ☶ Gan: +30% vs. torso zones (solar plexus, ribs)
     * ☷ Gon: +25% vs. ground-lock zones (spine, sacrum)
     * ☱ Tae: +20% vs. limb-lock zones (elbow, knee)
     * Others: +15% generic vs. all vital zones
  2. **Snap Block Bonus:** If `B` tapped ≤ 3 frames before impact → VRB += 10% (max 50%).
  3. **NetDamage =** `BaseDamage × (1 – VRB)`.
  4. Apply stats:

     * `health –= NetDamage`
     * `pain += attackPain + floor(NetDamage × 0.1)`
     * `bloodLoss += bleedValue`
     * `consciousness –= concussValue`
     * Update `balance` (see 2.2.1).

---

### 2.7 Round Duration & Flow

#### 2.7.1 Round Structure

* **Duration:** **60 seconds** per round (HUD countdown).
* **Start Signal:** At 0:00, a “READY” flash and digital gong play → combat begins.
* **End Signal:** At 0:00, a second gong, 2-frame freeze → winner screen.

##### Winning Conditions

1. **KO via Vital-Point Strike**

   * If a single strike reduces `health ≤ 0` → immediate KO (“One-Strike Finish”).
2. **Timeout (00:00)**

   * If no KO, compare `health`; higher wins.
   * If tied, compare timestamp of first significant hit (> 10 damage).
   * If still tied → **Draw**.

#### 2.7.2 Sample Combat Flow

|                                                                                                          **Time** | **Action**                                                                                                                         | **Resulting Stats / Positions** |
| ----------------------------------------------------------------------------------------------------------------: | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
|                                                                                                          **0:00** | Round start:                                                                                                                       |                                 |
|                                                                                             • P1 @ (0,4), ☰ Geon, |                                                                                                                                    |                                 |
|                                   health:100, pain:0, balance\:READY, consciousness:100, bloodLoss:0, stamina:100 |                                                                                                                                    |                                 |
|                                                                             • P2 @ (9,4), ☰ Geon, identical stats | Both free to move, no actions yet.                                                                                                 |                                 |
|                                                                                                          **0:58** | • P1 holds `Z+→`: short-step → (1,4). 📉 🔋 –5 → 95, 10 frames.                                                                    |                                 |
|                                                   • P2 holds `Z+←`: short-step → (8,4). 📉 🔋 –5 → 95, 10 frames. | P1: {health:100,pain:0,balance\:READY,cons:100,bloodLoss:0,stamina:95}                                                             |                                 |
|                                            P2: {health:100,pain:0,balance\:READY,cons:100,bloodLoss:0,stamina:95} |                                                                                                                                    |                                 |
|                                                                                                          **0:55** | • P1 presses `2` → switch to ☱ Tae (Ap Koobi Seogi).                                                                               |                                 |
|                                                                 • P2 presses `3` → switch to ☲ Li (Juchum Seogi). | P1 stance: ☱ Tae (+reach, –agility)                                                                                                |                                 |
|                                                                             P2 stance: ☲ Li (+stability, –speed). |                                                                                                                                    |                                 |
|                                                                                                          **0:50** | P1 (☱ at (1,4)) holds `Space+↓`: **Hip Sweep** (–40 HP, +30 pain, +10 bleed). 📉 🔋 –12 → 83, startup 14 frames.                   |                                 |
|                                                              P2 blocks (tap `B`) in ☲: VRB=15% +10% (snap) = 25%. |                                                                                                                                    |                                 |
|                                                                                 → NetDamage = 40 × (1–0.25) = 30: |                                                                                                                                    |                                 |
|                       • P2 health:100→70; pain:0→30; bloodLoss:0→10; cons:100→100; balance=SHAKEN; stamina:95→83. | P2: {health:70,pain:30,balance\:SHAKEN,cons:100,bloodLoss:10,stamina:83}                                                           |                                 |
|                                            P1: {health:100,pain:0,balance\:READY,cons:100,bloodLoss:0,stamina:83} |                                                                                                                                    |                                 |
|                                                                                                          **0:45** | P2 (☲ at (8,4)) taps `Space+←`: **Front Elbow** to solar plexus (–20 HP, +15 pain, +5 bleed). 📉 🔋 –10 → 73, 14 frames.           |                                 |
|                                                                                                  P1 didn’t block: |                                                                                                                                    |                                 |
|                        • P1 health:100→80; pain:0→20; bloodLoss:0→5; cons:100→100; balance=SHAKEN; stamina:83→73. | P1: {health:80,pain:20,balance\:SHAKEN,cons:100,bloodLoss:5,stamina:73}                                                            |                                 |
|                                          P2: {health:70,pain:30,balance\:SHAKEN,cons:100,bloodLoss:10,stamina:73} |                                                                                                                                    |                                 |
|                                                                                                          **0:40** | • P1 holds `X+↑`: **Swap foot** (now left-lead in ☱), move → (1,3). 📉 🔋 –10 → 63, 14 frames.                                     |                                 |
|                                                   • P2 holds `Z+↑`: short-step → (8,3). 📉 🔋 –5 → 68, 10 frames. | P1: {health:80,pain:20,balance\:SHAKEN,cons:100,bloodLoss:5,stamina:63}                                                            |                                 |
|                                          P2: {health:70,pain:30,balance\:SHAKEN,cons:100,bloodLoss:10,stamina:68} |                                                                                                                                    |                                 |
|                                                                                                          **0:35** | P1 (☱ at (1,3)) holds `↑` → move → (2,3). 📉 🔋 –5 → 58, 10 frames; queues `Space+←` → **Arm Lock** (–30 HP, +25 pain, +10 bleed). |                                 |
|                                                                                          P2 tries block (no `B`): |                                                                                                                                    |                                 |
|                                • P2 health:70→40; pain:30→60; bloodLoss:10→20; balance=VULNERABLE; stamina:68→68. | P2: {health:40,pain:60,balance\:VULNERABLE,cons:100,bloodLoss:20,stamina:68}                                                       |                                 |
|                                           P1: {health:80,pain:20,balance\:SHAKEN,cons:100,bloodLoss:0,stamina:58} |                                                                                                                                    |                                 |
|                                                                                                          **0:30** | • P2 presses `8` → switch to ☷ Gon (Joong Ha Seogi); no cost.                                                                      |                                 |
| • P1 holds `↑` → (3,3). 📉 🔋 –5 → 53, 10 frames; queues `Space+↓` → **Hip Sweep** (–40 HP, +30 pain, +10 bleed). |                                                                                                                                    |                                 |
|                                                      P2 blocks (tap `B`) in ☷: VRB=25%; NetDamage=40×(1–0.25)=30: |                                                                                                                                    |                                 |
|                                  • P2 health:40→10; pain:60→93; bloodLoss:20→30; balance=HELPLESS; stamina:68→68. | P2: {health:10,pain:93,balance\:HELPLESS,cons:100,bloodLoss:30,stamina:68}                                                         |                                 |
|                                           P1: {health:80,pain:20,balance\:SHAKEN,cons:100,bloodLoss:0,stamina:53} |                                                                                                                                    |                                 |
|                                                                                 → P2 knocked down; P1 wins by KO. |                                                                                                                                    |                                 |

---

### 2.8 Stamina Costs & Recovery

| **Action**                         | **Stamina Cost** | **Frames** | **Remarks**                                                  |
| ---------------------------------- | ---------------- | ---------- | ------------------------------------------------------------ |
| **Move One Cell (no pivot)**       | – 5              | 8          | Standard step; no stance or foot change.                     |
| **Move One Cell (with pivot)**     | – 7              | 10         | Auto-pivot (mirror stance).                                  |
| **Short Step (Z + Arrow)**         | – 5              | 10         | Forcing current front foot; no pivot.                        |
| **Step & Swap (X + Arrow)**        | – 10             | 14         | Mirror foot, then step.                                      |
| **Swap Foot (X alone)**            | – 2              | 6          | Mirror stance without moving.                                |
| **Block Tap (B)**                  | – 3              | 4          | Snap block; Vital Resistance applies.                        |
| **Block Hold (B)**                 | – 2/sec          | –          | Sustained guard; Vital Resistance applies each incoming hit. |
| **Front-Hand Strike (Space)**      | – 8              | 12         | Default hand strike.                                         |
| **Front-Leg Kick (Space + ↑)**     | – 12             | 16         | Powerful forward kick.                                       |
| **Front-Elbow Strike (Space + ←)** | – 10             | 14         | Quick elbow blow.                                            |
| **Front-Knee Strike (Space + ↓)**  | – 10             | 14         | Low knee strike.                                             |
| **Back-Hand Strike (Space + →)**   | – 9              | 13         | Rear hand swing.                                             |
| **Rotational Backcast**            | – 15             | 20         | 180° pivot + spinning back strike.                           |
| **Hip Sweep (☱ Tae, Space + ↓)**   | – 12             | 14         | Strong takedown to sacral region.                            |
| **Throw (☷ Gon, Space + ↓)**       | – 12             | 16         | Ground-control takedown.                                     |

* **Stamina Regeneration:**

  * If idle ≥ 1 sec → **+10** stamina/sec.
  * If `stamina ≤ 0`:

    * All movement costs **+5** more.
    * All attack animations take **+5** frames longer.

---

### 2.9 Round Summary & Design Rationale

1. **60-Second Round Timer**

   * Forces players to juggle offense, defense, and stamina under time pressure.
   * Encourages “all-in” plays or cautious footwork.

2. **Octagonal Grid → Tactical Depth**

   * Discrete 0.3 m cells; diagonal steps change attack angles.
   * Tight corners trap players; encourages spatial control.

3. **CombatStats → Realistic Feedback**

   * **health (❤️):** True Vital Health; critical hits can instantly drop to 0.
   * **pain (😖):** Drives transitions: 🟢 READY → 🟡 SHAKEN → 🟠 VULNERABLE → 🔴 HELPLESS.
   * **consciousness (🧠):** Lost via head/nerve strikes; ≤ 0 → KO for 3 sec.
   * **bloodLoss (🩸):** Bleed drains health/pain over time; can unbalance even a blocking fighter.
   * **stamina (🔋):** Governs movement & attack economy; running out severely limits options.

4. **Trigram Stances → Authentic Martial Integration**

   * Each Trigram ↔ real Taekwondo/Hapkido stance, with cyberpunk flair (neon effects).
   * **Footwork** (auto-pivot, short-step, swap) remains under direct player control, layering decisions: “Which stance?” **and** “Which foot?”

5. **Vital-Point Attacks → High Skill Ceiling**

   * Limb strikes target distinct anatomical zones; perfect timing can yield one-strike KOs.
   * Defensive Vital Resistance demands correct stance and timing.

6. **Fluid, High-Risk Combat**

   * 8-direction movement, stance switching, vital-point targeting ensure dynamic, unpredictable exchanges.
   * One slip—mis‐timed pivot or wrong stance—can cost the round.

---

**🎯 Black Trigram** melds a **10×10 octagonal grid**, **cyberpunk‐enhanced Korean stances**, and a **layered CombatStat system** to deliver a visceral, high-stakes martial arts simulator. Every cell, every stance switch, and every strike influences **health**, **pain**, **balance**, **consciousness**, **bloodLoss**, and **stamina**—rewarding players who master both tactical grid control and precise, anatomy-based combat.

---

## 3. Winning and Losing

### 3.1 Victory Conditions

* **Knockout (KO):** Opponent’s health ≤ 0 → instant “One-Strike Finish.”
* **Time Out:** At 0:00, the higher remaining health wins.

  * If tied, compare timestamp of first significant hit (> 10 damage).
  * If still tied → **Draw (무승부, Museungbu).**

### 3.2 Match Structure

* Standard match: **Best of 3** (or 5) rounds.
* First to required wins → match victory.

---

## 4. Game Flow & UI

### 4.1 Intro Screen

* Displays **Black Trigram** logo (`black-trigram-256.png`) with pulsating neon glow.
* **Menu Options:**

  * **Play**
  * **Controls**
  * **Stance Guide**
  * **Music Select**
  * **Exit**

### 4.2 Combat Screen

* **Player Stats (Left/Right):**

  * Health (❤️), Pain (😖), Balance (⚖️), Consciousness (🧠), BloodLoss (🩸), Stamina (🔋).
* **Trigram Display:**

  * Octagon icon showing current stance, glowing in stance’s accent color.
* **Timer:**

  * 60 sec countdown (neon digital font).
* **Round Counter:**

  * “Round 1 / 3” positioned under timer.
* **Combat Log:**

  * Scrolling feed of key actions: e.g.,

    * “☲ Li Thumb-Push → Jugular Notch: –75 HP (KO).”
  * Text glows **#FF0055** for critical strikes, **#00CCFF** for normal hits.
* **Neon Effects:**

  * Octagon border pulses in the color of the leading fighter’s stance.
  * Hit sparks use contrasting neon bursts.

### 4.3 Game Over / Victory Screen

* Full-screen neon glitch effect; champion’s name displayed in Hangul & English.
* **Message:**

  * “Player 1 Wins!” (플레이어 1 승리!) or “DRAW.”
* **Options:**

  * **Play Again (다시하기)** → restarts match.
  * **Return to Menu (메뉴로 돌아가기)** → back to Intro Screen.
  * **Spectate AI Sparring (AI 대전 관전)** (only if AI mode unlocked).

---

> **Note:** All mermaid diagrams use custom colors to highlight states and accentuate cyberpunk neon vibes.
>
> * ✅ Green (#00cc44) for **READY**
> * ⚠️ Yellow (#ffcc00) for **SHAKEN**
> * 🔶 Orange (#ff8800) for **VULNERABLE**
> * 🔴 Red (#cc0000) for **HELPLESS**


## 5. Asset Integration

- **Logo**: `black-trigram-256.png` used on the Intro Screen and potentially other branding locations.
- **Informational Images**:
  - `PlayerArchetypesExplained.png`: Displayed in the Philosophy section or a dedicated "Lore/Guide" section to explain character types or combat styles.
  - `CyberpunkTeamDynamics.png`: Could be used in a similar context if team-based modes or lore are expanded.
  - `PlayerArchetypesOverview.png`: Similar to `PlayerArchetypesExplained.png`.
- **Backgrounds**: Cyberpunk-themed Dojang backgrounds.
- **Character Sprites**: Silhouettes or detailed 2D sprites with traditional Korean martial arts attire mixed with tactical gear.
- **VFX**: Effects for Ki energy, impacts, stance auras.

## 6. Technical Details

- **Platform**: Web-based (HTML5/WebGL via PixiJS with React).
- **Physics**: Aim for authentic 60fps combat physics.
- **Audio**: Dynamic sound effects based on impact, damage, and Korean martial arts themes.

## 7. Future Considerations

- AI opponents with varying difficulty.
- Expanded move sets and combos.
- Online multiplayer.
- Deeper story mode.
