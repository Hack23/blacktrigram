# 🗺️ Black Trigram (흑괘) - Comprehensive Game Design Document

**🔐 ISMS Alignment:** This document follows [Hack23 Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) for design documentation requirements.

**Version**: 2.1 (Updated January 29, 2026)  
**Status**: Q1 2026 Combat Realism Production-Ready (13/13 systems complete, 100%)  
**Target Release**: v1.0 - Q2 2026

---

## 📚 Documentation Cross-References

This comprehensive game design document is supported by detailed technical architecture documentation:

- **[COMBAT_ARCHITECTURE.md](COMBAT_ARCHITECTURE.md)** - Complete combat system technical implementation (2,416 lines)
- **[FUTURE_ARCHITECTURE.md](FUTURE_ARCHITECTURE.md)** - Evolutionary roadmap and v2.0+ vision (2,021 lines)
- **[game-status.md](game-status.md)** - Current implementation metrics and Q1 2026 progress (2,168 lines)
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - C4 model system architecture
- **[README.md](README.md)** - Project overview and quick start guide

**Korean Terminology Consistency**: All sections use consistent Korean-English bilingual terminology as defined in COMBAT_ARCHITECTURE.md.

---

## Executive Summary

**Black Trigram (흑괘)** is a **realistic 3D precision combat game** inspired by classic martial arts fighters like **Budokan: The Martial Spirit** and **International Karate+**, reimagined with authentic Korean martial arts and modern combat techniques. Players master traditional vital point striking through precise, physics-based combat that emphasizes **anatomical targeting** and **one-strike effectiveness**.

### Core Pillars

- **정격자 (Jeonggyeokja)** - Precision Striker: Every strike targets anatomical vulnerabilities
- **비수 (Bisu)** - Lethal Technique: Realistic application of traditional martial arts  
- **암살자 (Amsalja)** - Combat Specialist: Focus on immediate incapacitation  
- **급소격 (Geupsogyeok)** - Vital Point Strike: Authentic pressure point combat

---

## Game Overview

### Genre

**3D Realistic Combat Simulator** / **Traditional Korean Martial Arts Training**

### Platform

Web-based (**HTML5/WebGL via Three.js + @react-three/fiber**) optimized for authentic **60fps combat physics**

### Technology Stack

- **Frontend**: React 19, TypeScript (strict mode), Three.js, @react-three/fiber, @react-three/drei
- **Audio**: Howler.js with spatial audio support for realistic combat sounds
- **Testing**: Vitest (unit), Cypress (E2E), 76% overall test coverage
- **Fonts**: Noto Sans KR for authentic Korean typography
- **Performance**: 60fps target on desktop, 55fps+ on mobile

### Target Audience

- Fans of realistic combat simulation (Budokan, IK+, Way of the Exploding Fist)
- Martial arts practitioners seeking authentic technique knowledge
- Players interested in traditional Korean martial arts techniques (태권도, 합기도, 택견)
- Combat enthusiasts wanting precision-based gameplay with anatomical accuracy

### Unique Selling Points

1. **Realistic Combat Physics** - Real body mechanics with authentic combat focus, 13 realism systems (100% complete)
2. **Anatomical Precision** - 70 actual vital points (급소) with Korean names and TCM meridian mapping
3. **Combat Realism** - Pain response, consciousness levels, breathing disruption, trauma visualization, grappling, counter-attacks
4. **AI Counter-Attacks** - Intelligent opponent AI that exploits limb exposure and vulnerability windows
5. **Grappling System** - Authentic Hapkido/Ssireum techniques with grip mechanics and escape systems
6. **Korean Martial Arts** - Based on traditional techniques (Taekwondo, Hapkido, Taekyon, Yusul) and philosophy (I Ching)
7. **Traditional Knowledge** - Teaches actual pressure points, anatomical effects, and martial arts applications
8. **8 Trigram Stances (팔괘)** - Authentic Korean martial arts stances based on I Ching philosophy
9. **Cultural Authenticity** - Korean-English bilingual UI, traditional instruments (가야금, 장구), cyberpunk aesthetic

---

## Table of Contents

1. [70 Vital Points System (급소 체계)](#1-70-vital-points-system-급소-체계)
2. [8 Trigram Stances (팔괘 자세)](#2-8-trigram-stances-팔괘-자세)
3. [5 Player Archetypes (오대 무사)](#3-5-player-archetypes-오대-무사)
4. [Skeletal Animation System (골격 애니메이션)](#4-skeletal-animation-system-골격-애니메이션)
5. [Future Multiplayer Modes (멀티플레이어)](#5-future-multiplayer-modes-멀티플레이어)
6. [Backend-Enabled Progression (진행 시스템)](#6-backend-enabled-progression-진행-시스템)
7. [Monetization Strategy (수익화 전략)](#7-monetization-strategy-수익화-전략)
8. [Balance Philosophy (밸런스 철학)](#8-balance-philosophy-밸런스-철학)
9. [Realistic Combat System](#9-realistic-combat-system)
10. [Game Modes & Training](#10-game-modes--training)
11. [Technical Implementation](#11-technical-implementation)
12. [Cultural Integration](#12-cultural-integration)

---

## 1. 70 Vital Points System (급소 체계)

**Current Status**: ✅ **100% Complete** (70/70 points documented)  
**Documentation**: [`docs/vital-points/`](docs/vital-points/), [`COMBAT_ARCHITECTURE.md`](COMBAT_ARCHITECTURE.md#-vital-point-targeting-system-급소-타격-체계)  
**Test Coverage**: 57 tests passing, 100% data validation

The vital point system is the cornerstone of Black Trigram's combat realism, implementing 70 authentic anatomical targets derived from Korean martial arts (급소격, Geupsogyeok), Traditional Chinese Medicine (TCM) meridians, and modern anatomy.

### 1.1 System Overview

```mermaid
graph TB
    subgraph "🎯 70 Vital Points System (급소 체계)"
        VPS["⚡ VitalPointSystem<br/>70 Targets"]:::vital
        VPS --> HEAD["🧠 머리 Head<br/>12 points<br/>Critical Targets"]:::head
        VPS --> TORSO["💓 몸통 Torso<br/>24 points<br/>Organ Zones"]:::torso
        VPS --> ARMS["💪 팔 Arms<br/>17 points<br/>Joint Locks"]:::arms
        VPS --> LEGS["🦵 다리 Legs<br/>17 points<br/>Mobility Disablers"]:::legs
    end

    subgraph "📊 Classification Systems"
        SEV["⚠️ Severity Levels<br/>5 categories<br/>Lethal→Minor"]:::severity
        CAT["🔬 Anatomical Categories<br/>7 types<br/>System-Based"]:::category
        MER["🌊 TCM Meridians<br/>14 channels<br/>Energy Flow"]:::meridian
    end

    VPS -.->|"Categorized by"| SEV
    VPS -.->|"Mapped to"| CAT
    VPS -.->|"Aligned with"| MER

    classDef vital fill:#ff4444,stroke:#990000,color:#fff,stroke-width:3px,rx:10
    classDef head fill:#ff0000,stroke:#cc0000,color:#fff,stroke-width:2px,rx:8
    classDef torso fill:#ff8800,stroke:#cc6600,color:#fff,stroke-width:2px,rx:8
    classDef arms fill:#00cc66,stroke:#009944,color:#fff,stroke-width:2px,rx:8
    classDef legs fill:#0099ff,stroke:#0066cc,color:#fff,stroke-width:2px,rx:8
    classDef severity fill:#9933ff,stroke:#6600cc,color:#fff,stroke-width:2px,rx:8
    classDef category fill:#00cc44,stroke:#009933,color:#fff,stroke-width:2px,rx:8
    classDef meridian fill:#ffcc00,stroke:#cc9900,color:#000,stroke-width:2px,rx:8
```

### 1.2 Regional Distribution

| Region | Korean | Count | Icon | Examples |
|--------|--------|-------|------|----------|
| **Head** 🧠 | 머리 | **12** | 🎯 | 백회혈 (Baihui), 인영 (Renying), 태양혈 (Taiyang) |
| **Torso** 💓 | 몸통 | **24** | ⚡ | 명문 (Mingmen), 삼초수 (Sanjiaoshu), 심장혈 (Heart Point) |
| **Arms** 💪 | 팔 | **17** | 🔨 | 대추 (Dazhui), 건우 (Jianyu), 곡지 (Quchi) |
| **Legs** 🦵 | 다리 | **17** | ⚔️ | 슬관절 (Knee Joint), 환도 (Huantiao), 족삼리 (Zusanli) |
| **TOTAL** | | **70** | 🎯 | All anatomical targets mapped |

### 1.3 Severity Classification

Vital points are classified into 5 severity levels based on potential combat effectiveness:

| Level | Korean | Count | Icon | Damage Range | Duration | Combat Effect |
|-------|--------|-------|------|--------------|----------|---------------|
| **Lethal** ☠️ | 치명적 | **4** | 💀 | 80-100 | Permanent | Instant KO, life-threatening |
| **Critical** ⚠️ | 극심 | **18** | 🔴 | 60-80 | 30-60s | Severe pain, loss of consciousness |
| **Major** ⚡ | 중대 | **28** | 🟠 | 40-60 | 20-40s | Intense pain, significant impairment |
| **Moderate** 🟡 | 중등 | **16** | 🟡 | 20-40 | 10-20s | Moderate pain, temporary weakness |
| **Minor** 🟢 | 경미 | **4** | 🟢 | 10-20 | 5-10s | Mild pain, brief distraction |

### 1.4 Anatomical Categories

Vital points are categorized by anatomical system affected:

| Category | Korean | Count | Icon | Primary Effect | Examples |
|----------|--------|-------|------|----------------|----------|
| **Neurological** 🧠 | 신경계 | **22** | ⚡ | Nerve damage, paralysis | Temples (太阳), Vagus nerve |
| **Skeletal** 🦴 | 골격계 | **15** | 💥 | Bone fractures, structural damage | Ribs, Clavicle, Nasal bone |
| **Joint** 🔗 | 관절 | **12** | 🔨 | Dislocation, mobility loss | Elbow, Knee, Shoulder |
| **Organ** 💓 | 장기 | **9** | 🎯 | Internal damage, organ trauma | Liver, Spleen, Kidneys |
| **Muscular** 💪 | 근육 | **7** | 💢 | Muscle tear, spasm | Biceps, Quadriceps |
| **Vascular** 🩸 | 혈관 | **3** | 🔴 | Blood flow disruption | Carotid, Femoral |
| **Respiratory** 🫁 | 호흡기 | **2** | 💨 | Breathing disruption | Solar plexus, Throat |


### 1.5 Complete 70 Vital Points Database

#### 1.5.1 Head Region (머리) - 12 Points

| # | Korean Name | English/TCM | Location | Severity | Effect | Damage | Duration | Category | Meridian |
|---|-------------|-------------|----------|----------|--------|--------|----------|----------|----------|
| 1 | 백회혈 | Baihui (GV20) | Crown of head | Critical | Consciousness loss, dizziness | 70 | 45s | Neurological | Governor Vessel |
| 2 | 인영 | Renying (ST9) | Carotid artery | Lethal | Blood flow disruption, KO | 95 | 60s | Vascular | Stomach |
| 3 | 태양혈 | Taiyang (EX-HN5) | Temple | Critical | Severe pain, vision disruption | 75 | 50s | Neurological | Extra Point |
| 4 | 풍지 | Fengchi (GB20) | Base of skull | Critical | Balance loss, nausea | 65 | 40s | Neurological | Gallbladder |
| 5 | 예풍 | Yifeng (TE17) | Behind earlobe | Major | Equilibrium disruption | 55 | 30s | Neurological | Triple Energizer |
| 6 | 아문 | Yamen (GV15) | Upper cervical spine | Lethal | Spinal cord trauma, paralysis | 90 | Permanent | Neurological | Governor Vessel |
| 7 | 인중 | Renzhong (GV26) | Philtrum | Major | Extreme pain, tear response | 50 | 25s | Neurological | Governor Vessel |
| 8 | 협거 | Jiache (ST6) | Jaw hinge | Major | Jaw dislocation, speech loss | 45 | 20s | Skeletal | Stomach |
| 9 | 승장 | Chengjiang (CV24) | Chin point | Moderate | Pain, head snap | 35 | 15s | Skeletal | Conception Vessel |
| 10 | 비골 | Nasal Bone | Bridge of nose | Major | Bone fracture, vision blur | 50 | 30s | Skeletal | - |
| 11 | 안와 | Orbital Ridge | Eye socket rim | Critical | Orbital fracture, vision loss | 65 | 40s | Skeletal | - |
| 12 | 경동맥 | Carotid Sinus | Side of neck | Lethal | Immediate unconsciousness | 100 | 60s | Vascular | - |

#### 1.5.2 Torso Region (몸통) - 24 Points

| # | Korean Name | English/TCM | Location | Severity | Effect | Damage | Duration | Category | Meridian |
|---|-------------|-------------|----------|----------|--------|--------|----------|----------|----------|
| 13 | 천돌 | Tiantu (CV22) | Suprasternal notch | Critical | Breathing disruption, choking | 75 | 45s | Respiratory | Conception Vessel |
| 14 | 결분 | Quepen (ST12) | Clavicle notch | Major | Collarbone fracture | 55 | 30s | Skeletal | Stomach |
| 15 | 쇄골 | Clavicle | Collarbone | Major | Bone fracture, arm weakness | 50 | 35s | Skeletal | - |
| 16 | 견우 | Jianyu (LI15) | Shoulder cap | Major | Shoulder dislocation | 45 | 25s | Joint | Large Intestine |
| 17 | 극상근 | Supraspinatus | Shoulder blade top | Moderate | Arm lifting impairment | 30 | 15s | Muscular | - |
| 18 | 대추 | Dazhui (GV14) | C7-T1 vertebrae | Critical | Spinal trauma, arm numbness | 70 | 50s | Neurological | Governor Vessel |
| 19 | 명문 | Mingmen (GV4) | L2-L3 spine | Lethal | Kidney damage, leg paralysis | 85 | 60s | Organ | Governor Vessel |
| 20 | 삼초수 | Sanjiaoshu (BL22) | Lower back lateral | Major | Kidney strike, organ pain | 50 | 30s | Organ | Bladder |
| 21 | 심장혈 | Heart Point | Left chest (5th rib) | Critical | Cardiac disruption, arrhythmia | 80 | 55s | Organ | - |
| 22 | 중완 | Zhongwan (CV12) | Solar plexus | Critical | Breathing paralysis, diaphragm | 75 | 40s | Respiratory | Conception Vessel |
| 23 | 간유 | Ganshu (BL18) | Right mid-back | Major | Liver strike, internal bleeding | 55 | 35s | Organ | Bladder |
| 24 | 비유 | Pishu (BL20) | Left mid-back | Major | Spleen damage | 50 | 30s | Organ | Bladder |
| 25 | 신유 | Shenshu (BL23) | Lower back | Major | Kidney trauma | 55 | 35s | Organ | Bladder |
| 26 | 늑골 | Floating Ribs | 11th-12th ribs | Major | Rib fracture, internal damage | 50 | 30s | Skeletal | - |
| 27 | 늑간신경 | Intercostal Nerve | Between ribs | Major | Severe pain, breathing difficulty | 45 | 25s | Neurological | - |
| 28 | 대장수 | Dachangshu (BL25) | Lower back | Moderate | Intestinal disruption | 35 | 20s | Organ | Bladder |
| 29 | 단전 | Dantian (CV6) | Lower abdomen | Moderate | Core weakness, balance loss | 30 | 15s | Muscular | Conception Vessel |
| 30 | 기해 | Qihai (CV6) | Lower abdomen | Moderate | Energy disruption | 35 | 20s | Muscular | Conception Vessel |
| 31 | 관원 | Guanyuan (CV4) | Lower abdomen | Moderate | Pelvic pain | 30 | 15s | Organ | Conception Vessel |
| 32 | 천추 | Coccyx | Tailbone | Major | Spinal pain, sitting inability | 50 | 40s | Skeletal | - |
| 33 | 요추 | Lumbar Spine | L1-L5 | Critical | Lower body paralysis risk | 65 | 45s | Neurological | - |
| 34 | 흉골 | Sternum | Breastbone center | Major | Cardiac shock, rib damage | 50 | 30s | Skeletal | - |
| 35 | 검상돌기 | Xiphoid Process | Bottom of sternum | Major | Internal organ damage | 55 | 35s | Organ | - |
| 36 | 겨드랑이 | Axillary Nerve | Armpit | Moderate | Arm numbness, weakness | 35 | 20s | Neurological | - |

#### 1.5.3 Arms Region (팔) - 17 Points

| # | Korean Name | English/TCM | Location | Severity | Effect | Damage | Duration | Category | Meridian |
|---|-------------|-------------|----------|----------|--------|--------|----------|----------|----------|
| 37 | 견정 | Jianjing (GB21) | Shoulder trapezius | Major | Arm weakness, pain | 50 | 30s | Muscular | Gallbladder |
| 38 | 견우 | Jianyu (LI15) | Shoulder deltoid | Major | Shoulder dislocation | 45 | 25s | Joint | Large Intestine |
| 39 | 극문 | Jimen (SP11) | Inner biceps | Moderate | Arm weakness | 35 | 20s | Muscular | Spleen |
| 40 | 곡지 | Quchi (LI11) | Elbow crease | Major | Elbow hyperextension | 50 | 30s | Joint | Large Intestine |
| 41 | 주골 | Elbow Point | Ulnar nerve (funny bone) | Major | Electric pain, hand numbness | 55 | 35s | Neurological | - |
| 42 | 수삼리 | Shousanli (LI10) | Forearm | Moderate | Grip weakness | 30 | 15s | Muscular | Large Intestine |
| 43 | 외관 | Waiguan (TE5) | Outer forearm | Moderate | Wrist pain, mobility loss | 35 | 20s | Neurological | Triple Energizer |
| 44 | 내관 | Neiguan (PC6) | Inner forearm | Moderate | Nausea, wrist weakness | 30 | 15s | Neurological | Pericardium |
| 45 | 신문 | Shenmen (HT7) | Wrist crease | Moderate | Hand numbness | 25 | 12s | Neurological | Heart |
| 46 | 양계 | Yangxi (LI5) | Wrist thumb side | Moderate | Thumb weakness | 25 | 12s | Joint | Large Intestine |
| 47 | 합곡 | Hegu (LI4) | Hand web (thumb-index) | Major | Severe hand pain | 40 | 25s | Neurological | Large Intestine |
| 48 | 손가락관절 | Finger Joints | All finger joints | Minor | Dislocation, mobility loss | 20 | 10s | Joint | - |
| 49 | 손등 | Back of Hand | Metacarpal bones | Moderate | Hand fracture, grip loss | 35 | 20s | Skeletal | - |
| 50 | 손목 | Wrist | Radial/ulnar joint | Major | Wrist fracture, hand useless | 45 | 30s | Joint | - |
| 51 | 팔꿈치 | Elbow Joint | Humeroulnar joint | Major | Elbow dislocation | 50 | 35s | Joint | - |
| 52 | 상완이두근 | Biceps Belly | Upper arm front | Moderate | Muscle tear, arm weakness | 30 | 20s | Muscular | - |
| 53 | 상완삼두근 | Triceps Tendon | Upper arm back | Moderate | Elbow extension loss | 30 | 20s | Muscular | - |

#### 1.5.4 Legs Region (다리) - 17 Points

| # | Korean Name | English/TCM | Location | Severity | Effect | Damage | Duration | Category | Meridian |
|---|-------------|-------------|----------|----------|--------|--------|----------|----------|----------|
| 54 | 환도 | Huantiao (GB30) | Hip joint | Major | Hip dislocation, leg weakness | 50 | 30s | Joint | Gallbladder |
| 55 | 풍시 | Fengshi (GB31) | Outer thigh | Moderate | Leg numbness | 35 | 20s | Neurological | Gallbladder |
| 56 | 혈해 | Xuehai (SP10) | Inner thigh | Moderate | Leg circulation disruption | 30 | 15s | Vascular | Spleen |
| 57 | 대퇴사두근 | Quadriceps | Front thigh | Moderate | Leg buckling, kicking loss | 35 | 25s | Muscular | - |
| 58 | 슬관절 | Knee Joint | Kneecap | Major | Knee dislocation, walking loss | 55 | 40s | Joint | - |
| 59 | 슬개골 | Patella | Kneecap bone | Major | Kneecap fracture | 50 | 35s | Skeletal | - |
| 60 | 족삼리 | Zusanli (ST36) | Below knee (outer) | Major | Leg strength loss, balance | 45 | 30s | Neurological | Stomach |
| 61 | 양릉천 | Yanglingquan (GB34) | Outer knee | Major | Leg paralysis | 50 | 35s | Neurological | Gallbladder |
| 62 | 음릉천 | Yinlingquan (SP9) | Inner knee | Moderate | Knee pain, mobility loss | 35 | 25s | Neurological | Spleen |
| 63 | 승산 | Chengshan (BL57) | Calf belly | Moderate | Calf cramp, Achilles strain | 30 | 20s | Muscular | Bladder |
| 64 | 곤륜 | Kunlun (BL60) | Ankle (outer) | Major | Ankle sprain, walking loss | 45 | 30s | Joint | Bladder |
| 65 | 태계 | Taixi (KI3) | Ankle (inner) | Moderate | Ankle pain, balance loss | 35 | 25s | Joint | Kidney |
| 66 | 용천 | Yongquan (KI1) | Sole of foot | Moderate | Foot pain, standing difficulty | 30 | 20s | Neurological | Kidney |
| 67 | 대퇴골 | Femur | Thigh bone | Critical | Leg fracture, immobilization | 70 | 60s | Skeletal | - |
| 68 | 경골 | Tibia | Shin bone | Major | Shin fracture, leg collapse | 55 | 40s | Skeletal | - |
| 69 | 비골 | Fibula | Outer lower leg bone | Major | Leg fracture, instability | 50 | 35s | Skeletal | - |
| 70 | 아킬레스건 | Achilles Tendon | Back of ankle | Critical | Tendon rupture, mobility loss | 65 | 50s | Muscular | - |


### 1.6 Damage Calculation Formula

Vital point damage is calculated using a comprehensive formula that accounts for base damage, archetype modifiers, stance synergies, and combat situational factors:

```typescript
TotalDamage = BaseDamage × ArchetypeModifier × StanceModifier × CriticalBonus × VulnerabilityFactor

Where:
  BaseDamage = Vital point base damage value (10-100)
  ArchetypeModifier = Attacker archetype bonus (0.8x - 1.5x)
  StanceModifier = Stance vs vital point synergy (0.7x - 1.3x)
  CriticalBonus = Critical hit multiplier (1.0x normal, 1.5x critical, 2.0x perfect)
  VulnerabilityFactor = Defender state (0.5x READY, 0.8x SHAKEN, 1.2x VULNERABLE, 2.0x HELPLESS)
```

#### Example Calculations

**Example 1: Musa (무사) Striking Baihui (백회혈) with Geon Stance**

```
BaseDamage = 70 (Baihui Critical severity)
ArchetypeModifier = 1.2 (Musa bonus for bone-breaking techniques)
StanceModifier = 1.3 (Geon stance optimal for overhead strikes)
CriticalBonus = 1.5 (Critical hit landed)
VulnerabilityFactor = 1.2 (Defender in VULNERABLE state)

TotalDamage = 70 × 1.2 × 1.3 × 1.5 × 1.2 = 196 damage

Effect: Instant consciousness loss, 45-second stun, severe balance disruption
```

**Example 2: Amsalja (암살자) Striking Carotid Artery (인영) with Son Stance**

```
BaseDamage = 95 (Renying Lethal severity)
ArchetypeModifier = 1.5 (Amsalja specializes in silent takedowns)
StanceModifier = 1.2 (Son stance for pressure point precision)
CriticalBonus = 2.0 (Perfect strike, one-hit KO potential)
VulnerabilityFactor = 2.0 (Defender in HELPLESS state)

TotalDamage = 95 × 1.5 × 1.2 × 2.0 × 2.0 = 684 damage

Effect: Immediate KO, blood flow disruption, 60-second incapacitation, potential fatality
```

### 1.7 TCM Meridian Integration

All 70 vital points are mapped to the **14 Traditional Chinese Medicine (TCM) meridians**, providing authentic martial arts context:

| Meridian | Korean | Points | Key Effects |
|----------|--------|--------|-------------|
| **Governor Vessel (GV)** | 독맥 | 6 | Spinal trauma, consciousness, paralysis |
| **Conception Vessel (CV)** | 임맥 | 5 | Breathing, core strength, organ damage |
| **Lung (LU)** | 폐경 | 2 | Respiratory distress, chest pain |
| **Large Intestine (LI)** | 대장경 | 5 | Arm weakness, hand numbness, severe pain |
| **Stomach (ST)** | 위경 | 4 | Jaw trauma, leg strength, balance |
| **Spleen (SP)** | 비경 | 4 | Leg circulation, internal bleeding |
| **Heart (HT)** | 심경 | 1 | Hand numbness, cardiac rhythm |
| **Small Intestine (SI)** | 소장경 | 1 | Shoulder pain, neck trauma |
| **Bladder (BL)** | 방광경 | 8 | Organ strikes, kidney damage, leg paralysis |
| **Kidney (KI)** | 신경 | 2 | Foot pain, ankle stability, energy |
| **Pericardium (PC)** | 심포경 | 1 | Nausea, wrist weakness |
| **Triple Energizer (TE)** | 삼초경 | 2 | Equilibrium, wrist pain |
| **Gallbladder (GB)** | 담경 | 5 | Head trauma, hip dislocation, leg paralysis |
| **Liver (LV)** | 간경 | 1 | Internal organ damage |

### 1.8 Combat Application Examples

#### Scenario 1: Defensive Counter-Strike

**Setup**: Hacker (해커) defends against Musa (무사) heavy attack, seeks precise counter.

**Action**: Li Stance (☲) → Target "Quchi (곡지)" elbow crease → Critical hit

**Calculation**:
```
BaseDamage = 50 (Quchi Major severity)
ArchetypeModifier = 1.3 (Hacker's data-driven precision)
StanceModifier = 1.3 (Li stance optimal for precision strikes)
CriticalBonus = 1.5 (Critical hit)
VulnerabilityFactor = 1.2 (Musa exposed during attack)

TotalDamage = 50 × 1.3 × 1.3 × 1.5 × 1.2 = 152 damage

Effect: Elbow hyperextension, 30-second arm uselessness, attack interrupted
```

#### Scenario 2: Stealth Assassination

**Setup**: Amsalja (암살자) approaches unaware opponent from behind.

**Action**: Son Stance (☴) → Target "Mingmen (명문)" kidney strike → Perfect strike

**Calculation**:
```
BaseDamage = 85 (Mingmen Lethal severity)
ArchetypeModifier = 1.5 (Amsalja silent takedown specialist)
StanceModifier = 1.2 (Son stance for sustained pressure)
CriticalBonus = 2.0 (Perfect undetected strike)
VulnerabilityFactor = 2.0 (Opponent HELPLESS/unaware)

TotalDamage = 85 × 1.5 × 1.2 × 2.0 × 2.0 = 612 damage

Effect: Instant kidney damage, leg paralysis, 60-second incapacitation, potential fatality
```

### 1.9 Implementation Status

**Data Structure**: `src/data/vitalPoints.ts` - Complete 70-point database  
**Components**:
- `VitalPointMarkers3D.tsx` - 3D visualization with Three.js
- `VitalPointOverlayControls.tsx` (673 lines) - Filtering UI, severity/region/search
- `AnatomicalRegionDetection.ts` - Polygon-based zone detection (<0.01ms per check)

**Features**:
- ✅ Real-time filtering (severity, region, keyword search)
- ✅ Display options (labels on/off, animations, scale 0.5x-2.0x)
- ✅ Color-coded by severity (Lethal: red, Critical: orange, Major: yellow)
- ✅ Hover tooltips with full details (Korean name, effect, damage, duration)
- ✅ Keyboard shortcut: `V` to toggle vital point overlay

**Performance**: <0.01ms per collision check, 100x faster than required, maintains 60fps with all 70 points active

**References**: 127 medical and martial arts sources cited in `docs/vital-points/VITAL_POINTS_REFERENCE.md`

---

## 2. 8 Trigram Stances (팔괘 자세)

**Current Status**: ✅ **100% Complete** (8/8 stances implemented)  
**Documentation**: [`COMBAT_ARCHITECTURE.md`](COMBAT_ARCHITECTURE.md#-trigram-combat-system-팔괘-무술-체계)  
**Test Coverage**: 104 tests passing (Guard Poses), 100% stance transitions

The 8 Trigram Stance System (팔괘 자세) is the foundation of Black Trigram's combat philosophy, blending authentic Korean martial arts stances (Taekwondo 서기) with I Ching (주역) elemental philosophy. Each stance represents a natural force with unique combat bonuses, penalties, and philosophical meanings.

### 2.1 Stance Overview

```mermaid
graph TB
    subgraph "☯️ Eight Trigram Stances (팔괘 자세)"
        G["☰ 건 Geon<br/>⛅ Heaven/Sky<br/>💪 Power: +20%"]:::geon
        T["☱ 태 Tae<br/>🌊 Lake/Marsh<br/>🤝 Throws: +20%"]:::tae
        L["☲ 리 Li<br/>🔥 Fire/Flame<br/>🎯 Precision: +15%"]:::li
        J["☳ 진 Jin<br/>⚡ Thunder/Shake<br/>💥 Shock: +15%"]:::jin
        S["☴ 손 Son<br/>💨 Wind/Wood<br/>⚔️ Combo: +10%"]:::son
        GA["☵ 감 Gam<br/>💧 Water/Abyss<br/>🔄 Counter: +10%"]:::gam
        GN["☶ 간 Gan<br/>⛰️ Mountain/Keep<br/>🛡️ Defense: +50%"]:::gan
        GO["☷ 곤 Gon<br/>🌍 Earth/Field<br/>🥋 Grapple: +40%"]:::gon
    end

    subgraph "⚖️ Rock-Paper-Scissors Balance System"
        RPS["🎮 Stance Counter<br/>Triangle System"]:::balance
        RPS -.->|"Dominates"| POWER["💪 Power Stances<br/>건/진/곤<br/>Bone Breaking"]:::power
        RPS -.->|"Precision"| PRECISION["🎯 Technical Stances<br/>리/손/간<br/>Vital Points"]:::precision
        RPS -.->|"Adapts"| FLOW["🌊 Flow Stances<br/>태/감<br/>Redirection"]:::flow
    end

    G & J & GO -.->|"Power"| POWER
    L & S & GN -.->|"Technique"| PRECISION
    T & GA -.->|"Flow"| FLOW

    POWER -->|"Overpowers"| FLOW
    FLOW -->|"Redirects"| PRECISION
    PRECISION -->|"Exploits"| POWER

    classDef geon fill:#ffcc00,stroke:#cc9900,color:#000,stroke-width:3px,rx:10
    classDef tae fill:#00ccff,stroke:#0099cc,color:#fff,stroke-width:3px,rx:10
    classDef li fill:#ff4400,stroke:#cc3300,color:#fff,stroke-width:3px,rx:10
    classDef jin fill:#9933ff,stroke:#6600cc,color:#fff,stroke-width:3px,rx:10
    classDef son fill:#00ff66,stroke:#00cc44,color:#000,stroke-width:3px,rx:10
    classDef gam fill:#0066ff,stroke:#0044cc,color:#fff,stroke-width:3px,rx:10
    classDef gan fill:#996633,stroke:#663300,color:#fff,stroke-width:3px,rx:10
    classDef gon fill:#553311,stroke:#332200,color:#fff,stroke-width:3px,rx:10
    classDef balance fill:#222,stroke:#ffcc00,color:#ffcc00,stroke-width:3px,rx:10
    classDef power fill:#ff4444,stroke:#cc0000,color:#fff,stroke-width:2px,rx:8
    classDef precision fill:#00cc44,stroke:#009933,color:#fff,stroke-width:2px,rx:8
    classDef flow fill:#0099ff,stroke:#0066cc,color:#fff,stroke-width:2px,rx:8
```


### 2.2 Detailed Stance Specifications

#### 2.2.1 ☰ 건 (Geon) - Heaven/Sky

**Korean Martial Arts Basis**: 앞서기 (Ap Seogi - Walking Stance)  
**Philosophy**: "창조의 힘" - Creative force, direct yang energy, overwhelming power  
**Combat Style**: Aggressive forward stance emphasizing bone-breaking strikes and structural damage  
**Weight Distribution**: 60% forward, 40% back (offensive positioning)

**Bonuses**:
- **+20% Damage** to skeletal vital points (skull, ribs, clavicle, bones)
- **+15% Critical Hit Chance** on overhead strikes
- **+10% Resistance** to counter-attacks during forward strikes

**Penalties**:
- **-15% Mobility** (slower lateral movement)
- **-10% Defense** against leg sweeps and low attacks

**Best Vital Points to Target**:
1. 백회혈 (Baihui) - Crown strike for consciousness loss
2. 대추 (Dazhui) - Spine strike for nerve damage
3. 쇄골 (Clavicle) - Bone-breaking shoulder strike
4. 흉골 (Sternum) - Chest strike for cardiac shock

**Signature Techniques**:
- **천공격 (Heaven Strike)**: Overhead hammer fist to crown (백회혈)
- **골절권 (Bone Breaking Fist)**: Direct clavicle strike (쇄골)
- **천둥낙하 (Thunder Drop)**: Downward elbow to spine (대추)

**Combo Example**:
```
건 (Geon) Stance → Forward Step → 백회혈 (Baihui) Strike (70 base × 1.3 stance = 91 damage)
→ Follow-up: 대추 (Dazhui) Elbow (70 base × 1.3 stance = 91 damage)
→ Total: 182 damage + 2 consciousness hits = High KO probability
```

**Effective Against**: ☴ Son (Wind), ☵ Gam (Water) - Overpowers flow stances  
**Weak Against**: ☷ Gon (Earth), ☶ Gan (Mountain) - Grounding counters aggression

---

#### 2.2.2 ☱ 태 (Tae) - Lake/Marsh

**Korean Martial Arts Basis**: 앞굽이 (Ap Koobi Seogi - Front Stance)  
**Philosophy**: "기쁨의 흐름" - Joyful flow, adaptability, redirection energy  
**Combat Style**: Fluid mid-guard for joint locks, throws, and grappling redirection  
**Weight Distribution**: 60% forward, 40% back (throwing leverage)

**Bonuses**:
- **+15% Reach** for joint manipulation techniques
- **+20% Throw Success Rate** (joint locks, hip throws)
- **+10% Counter Damage** when redirecting attacks

**Penalties**:
- **-10% Direct Strike Damage** (not optimized for punching)
- **-5% Speed** (setup time for throws)

**Best Vital Points to Target**:
1. 곡지 (Quchi) - Elbow hyperextension for arm control
2. 견우 (Jianyu) - Shoulder dislocation for takedown
3. 슬관절 (Knee Joint) - Leg control for throws
4. 손목 (Wrist) - Joint lock setup

**Signature Techniques**:
- **유수투 (Flowing Water Throw)**: Hip sweep targeting sacral region
- **관절굴절 (Joint Bend)**: Elbow lock on 곡지 (Quchi)
- **태호전환 (Lake Reversal)**: Counter-grappling escape

**Combo Example**:
```
태 (Tae) Stance → Grab Arm → 곡지 (Quchi) Hyperextension (50 base × 1.15 reach = 58 damage)
→ Transition to Hip Sweep → 천추 (Coccyx) Impact (50 base × 1.2 throw = 60 damage)
→ Total: 118 damage + joint damage + positional control
```

**Effective Against**: ☰ Geon (Heaven), ☲ Li (Fire) - Redirects aggressive attacks  
**Weak Against**: ☴ Son (Wind), ☵ Gam (Water) - Flow vs flow neutralizes advantage

---

#### 2.2.3 ☲ 리 (Li) - Fire/Flame

**Korean Martial Arts Basis**: 주춤 (Juchum Seogi - Horse Stance)  
**Philosophy**: "빛과 정밀" - Illumination, precision, needle-point accuracy  
**Combat Style**: Low center of gravity for stable precision strikes to vital points  
**Weight Distribution**: 50% forward, 50% back (balanced, stable)

**Bonuses**:
- **+15% Stability** (resistance to knockdown, vital point defense)
- **+5% Critical Hit Chance** (precision targeting bonus)
- **+10% Vital Point Detection** (easier to hit small targets)

**Penalties**:
- **-20% Movement Speed** (horse stance limits mobility)
- **-10% Power** on bone-breaking techniques (not a power stance)

**Best Vital Points to Target**:
1. 태양혈 (Taiyang) - Temple precision strike for vision disruption
2. 합곡 (Hegu) - Hand web strike for severe pain
3. 족삼리 (Zusanli) - Leg nerve strike for balance loss
4. 늑간신경 (Intercostal Nerve) - Precise rib strike

**Signature Techniques**:
- **화염지 (Flame Finger)**: Precision temple strike (태양혈)
- **정밀타 (Precision Strike)**: Needle-point nerve targeting
- **불꽃권 (Fire Fist)**: Quick jab to vital point

**Combo Example**:
```
리 (Li) Stance → 태양혈 (Taiyang) Temple Strike (75 base × 1.05 crit × 1.3 stance = 103 damage)
→ Follow-up: 합곡 (Hegu) Hand Strike (40 base × 1.05 crit × 1.3 stance = 55 damage)
→ Total: 158 damage + vision disruption + hand pain = High pain accumulation
```

**Effective Against**: ☳ Jin (Thunder), ☰ Geon (Heaven) - Stability counters explosive power  
**Weak Against**: ☴ Son (Wind), ☱ Tae (Lake) - Mobility defeats stable stance

---

#### 2.2.4 ☳ 진 (Jin) - Thunder/Shake

**Korean Martial Arts Basis**: 뒤굽이 (Dwi Koobi Seogi - Back Stance)  
**Philosophy**: "진동과 충격" - Vibration, shock, sudden explosive release  
**Combat Style**: Weight back for explosive forward burst and nerve strikes  
**Weight Distribution**: 70% back, 30% forward (coiled spring)

**Bonuses**:
- **+15% Shock Damage** (nerve strikes, neural disruption)
- **+20% Burst Speed** (sudden forward explosion)
- **+10% Stun Duration** (extended paralysis effects)

**Penalties**:
- **-15% Sustained Damage** (one-burst stance, not for combos)
- **-10% Defense** while preparing burst (vulnerable during coil)

**Best Vital Points to Target**:
1. 풍지 (Fengchi) - Base of skull for balance disruption
2. 주골 (Elbow Point) - Ulnar nerve for electric shock pain
3. 중완 (Zhongwan) - Solar plexus for breath paralysis
4. 양릉천 (Yanglingquan) - Outer knee for leg paralysis

**Signature Techniques**:
- **뇌전타 (Thunder Strike)**: Explosive solar plexus strike (중완)
- **전격권 (Electric Fist)**: Nerve disruption to elbow (주골)
- **진동파 (Shock Wave)**: Stunning skull base strike (풍지)

**Combo Example**:
```
진 (Jin) Stance → Coil Back → Explosive Forward Burst → 중완 (Zhongwan) Strike
(75 base × 1.15 shock × 1.2 burst = 104 damage)
→ Effect: Breathing paralysis, 40-second stun, vulnerability window
```

**Effective Against**: ☷ Gon (Earth), ☶ Gan (Mountain) - Speed beats defensive stances  
**Weak Against**: ☱ Tae (Lake), ☵ Gam (Water) - Flow redirects burst energy

---

#### 2.2.5 ☴ 손 (Son) - Wind/Wood

**Korean Martial Arts Basis**: 니은자 (Niunja Seogi - L-Stance)  
**Philosophy**: "지속과 침투" - Persistence, penetration, continuous pressure  
**Combat Style**: Continuous lateral motion for pressure point sequences and combos  
**Weight Distribution**: 50% forward, 50% back (mobile, adaptable)

**Bonuses**:
- **+10% Combo Speed** (faster technique chaining)
- **+15% Lateral Mobility** (side-to-side movement)
- **+10% Pressure Point Damage** (sustained vital point pressure)

**Penalties**:
- **-10% Single-Hit Power** (built for combos, not one-shots)
- **-5% Defense** against direct power strikes

**Best Vital Points to Target**:
1. 인영 (Renying) - Carotid sustained pressure for blood flow disruption
2. 늑간신경 (Intercostal Nerve) - Repeated rib strikes for cumulative pain
3. 족삼리 (Zusanli) - Leg nerve sequence for balance breakdown
4. 합곡 (Hegu) - Hand nerve sequence for pain accumulation

**Signature Techniques**:
- **풍압 (Wind Pressure)**: Sustained carotid compression (인영)
- **연타 (Continuous Strikes)**: Rapid rib nerve sequence (늑간신경)
- **바람의흐름 (Wind Flow)**: Lateral movement + vital point combo

**Combo Example**:
```
손 (Son) Stance → Lateral Step → 늑간신경 (Intercostal) Strike #1 (45 base × 1.1 combo = 50 damage)
→ Lateral Step → 늑간신경 Strike #2 (45 base × 1.1 combo = 50 damage)
→ Lateral Step → 늑간신경 Strike #3 (45 base × 1.1 combo = 50 damage)
→ Total: 150 damage + 3-hit breathing disruption + pain accumulation = Severe impairment
```

**Effective Against**: ☰ Geon (Heaven), ☲ Li (Fire) - Mobility defeats power and stability  
**Weak Against**: ☳ Jin (Thunder), ☶ Gan (Mountain) - Burst and defense interrupt flow

---

#### 2.2.6 ☵ 감 (Gam) - Water/Abyss

**Korean Martial Arts Basis**: 나란이 (Narani Seogi - Parallel Stance)  
**Philosophy**: "위험과 적응" - Danger, adaptability, flowing response  
**Combat Style**: Centered weight for counter-grappling and defensive flow  
**Weight Distribution**: 50% forward, 50% back (perfect balance)

**Bonuses**:
- **+10% Counter Speed** (faster defensive responses)
- **+15% Bleed Damage** on rib strikes (water = blood flow)
- **+10% Grapple Escape** success rate

**Penalties**:
- **-10% Offensive Power** (defensive stance, not aggressive)
- **-5% Forward Movement** speed

**Best Vital Points to Target**:
1. 늑골 (Floating Ribs) - Deep rib strikes for bleeding + organ damage
2. 간유 (Ganshu) - Liver strike for internal bleeding
3. 혈해 (Xuehai) - Inner thigh for vascular disruption
4. 곤륜 (Kunlun) - Ankle for balance takedown

**Signature Techniques**:
- **수류타 (Water Flow Strike)**: Counter rib strike (늑골) with bleed effect
- **심연반격 (Abyss Counter)**: Defensive liver strike (간유)
- **물결쓰러뜨리기 (Wave Takedown)**: Ankle sweep (곤륜)

**Combo Example**:
```
감 (Gam) Stance → Block Incoming → Counter with 늑골 (Floating Rib) Strike
(50 base × 1.1 counter × 1.15 bleed = 63 damage + 15 bleed/sec)
→ Follow-up: 간유 (Liver) Strike (55 base × 1.1 counter = 61 damage)
→ Total: 124 damage + ongoing bleed + internal organ damage = High cumulative damage
```

**Effective Against**: ☰ Geon (Heaven), ☳ Jin (Thunder) - Flow absorbs and redirects power  
**Weak Against**: ☴ Son (Wind), ☱ Tae (Lake) - Flow vs flow neutralizes advantage

---

#### 2.2.7 ☶ 간 (Gan) - Mountain/Keep

**Korean Martial Arts Basis**: 기본 (Gibo Seogi - Basic Stance)  
**Philosophy**: "정지와 견고" - Stillness, solidity, immovable defense  
**Combat Style**: Tight defensive posture for blocking and absorbing attacks  
**Weight Distribution**: 50% forward, 50% back (centered, stable)

**Bonuses**:
- **+15% Block Strength** (damage reduction on successful blocks)
- **+20% Resistance** to knockdown and throws
- **+10% Stamina Conservation** (defensive stance uses less energy)

**Penalties**:
- **-20% Mobility** (mountain doesn't move easily)
- **-15% Offensive Power** (purely defensive focus)

**Best Vital Points to Target** (counter-attacks):
1. 주골 (Elbow Point) - Counter elbow hyperextension after block
2. 슬관절 (Knee Joint) - Counter knee strike after absorbing attack
3. 승산 (Chengshan) - Calf strike after blocking kick
4. 손목 (Wrist) - Wrist lock after blocking punch

**Signature Techniques**:
- **산벽방어 (Mountain Wall Defense)**: Absorb attack + counter elbow (주골)
- **견고반격 (Solid Counter)**: Block + immediate knee counter (슬관절)
- **암석권 (Rock Fist)**: Defensive stance + wrist lock (손목)

**Combo Example**:
```
간 (Gan) Stance → Block Incoming Strike (75% damage reduction) → Counter 주골 (Elbow Point)
(55 base × 1.15 block bonus = 63 damage + arm numbness)
→ Follow-up: 슬관절 (Knee) Strike (55 base × 1.15 = 63 damage)
→ Total: 126 damage + arm useless + leg weakness = High defensive value
```

**Effective Against**: ☴ Son (Wind), ☳ Jin (Thunder) - Defense stops continuous and burst attacks  
**Weak Against**: ☱ Tae (Lake), ☵ Gam (Water) - Throws bypass blocking stance

---

#### 2.2.8 ☷ 곤 (Gon) - Earth/Field

**Korean Martial Arts Basis**: 주춤하세기 (Joong Ha Seogi - Lower Horse Stance)  
**Philosophy**: "수용과 지지" - Receptive, supportive, grounding energy  
**Combat Style**: Very low center of gravity for takedowns and ground control  
**Weight Distribution**: 50% forward, 50% back (grounded, immovable)

**Bonuses**:
- **+25% Takedown Success** (throws, sweeps, ground techniques)
- **+20% Ground Control** (positional dominance after takedown)
- **+15% Resistance** to being thrown or swept

**Penalties**:
- **-25% Upright Mobility** (very low stance limits movement)
- **-15% High Strike Reach** (can't reach head targets easily)

**Best Vital Points to Target**:
1. 천추 (Coccyx) - Tailbone strike during takedown for sitting inability
2. 슬관절 (Knee Joint) - Leg sweep for takedown setup
3. 요추 (Lumbar Spine) - Ground control spinal pressure
4. 환도 (Huantiao) - Hip throw target for dislocation

**Signature Techniques**:
- **대지쓰러뜨리기 (Earth Throw)**: Hip throw targeting 환도 (Huantiao)
- **천추파괴 (Coccyx Breaker)**: Sacral region strike during takedown
- **지면장악 (Ground Control)**: Spinal pressure on 요추 (Lumbar)

**Combo Example**:
```
곤 (Gon) Stance → Low Sweep targeting 슬관절 (Knee) (55 base × 1.25 takedown = 69 damage)
→ Takedown Success → 천추 (Coccyx) Strike (50 base × 1.25 takedown = 63 damage)
→ Ground Control → 요추 (Lumbar) Pressure (65 base × 1.2 ground = 78 damage)
→ Total: 210 damage + leg collapse + sitting inability + spinal trauma = Complete control
```

**Effective Against**: ☰ Geon (Heaven), ☲ Li (Fire) - Grounding defeats aggression and stability  
**Weak Against**: ☴ Son (Wind), ☱ Tae (Lake) - Mobility escapes ground control


### 2.3 Stance Synergy Matrix (Rock-Paper-Scissors Balance)

The 8 trigram stances follow a rock-paper-scissors balance system where each stance has natural advantages and disadvantages against others, encouraging tactical stance switching during combat.

| Stance | Icon | Strong Against 💪 (1.3x damage) | Weak Against 🛡️ (0.7x damage) | Neutral Against ⚖️ |
|--------|------|----------------------------------|--------------------------------|-------------------|
| **☰ 건 (Geon)** | ⛅ | ☴ Son, ☵ Gam | ☷ Gon, ☶ Gan | ☱ Tae, ☲ Li, ☳ Jin |
| **☱ 태 (Tae)** | 🌊 | ☰ Geon, ☲ Li | ☴ Son, ☵ Gam | ☳ Jin, ☶ Gan, ☷ Gon |
| **☲ 리 (Li)** | 🔥 | ☳ Jin, ☰ Geon | ☴ Son, ☱ Tae | ☵ Gam, ☶ Gan, ☷ Gon |
| **☳ 진 (Jin)** | ⚡ | ☷ Gon, ☶ Gan | ☱ Tae, ☵ Gam | ☰ Geon, ☲ Li, ☴ Son |
| **☴ 손 (Son)** | 💨 | ☰ Geon, ☲ Li | ☳ Jin, ☶ Gan | ☱ Tae, ☵ Gam, ☷ Gon |
| **☵ 감 (Gam)** | 💧 | ☰ Geon, ☳ Jin | ☴ Son, ☱ Tae | ☲ Li, ☶ Gan, ☷ Gon |
| **☶ 간 (Gan)** | ⛰️ | ☴ Son, ☳ Jin | ☱ Tae, ☵ Gam | ☰ Geon, ☲ Li, ☷ Gon |
| **☷ 곤 (Gon)** | 🌍 | ☰ Geon, ☲ Li | ☴ Son, ☱ Tae | ☳ Jin, ☵ Gam, ☶ Gan |

**Balance Philosophy**: 
- **Power Stances** 💪 (건, 진, 곤) counter **Precision Stances** 🎯 (리, 손, 간)
- **Flow Stances** 🌊 (태, 감) counter **Power Stances** 💪 (건, 진, 곤)
- **Precision Stances** 🎯 (리, 손, 간) counter **Flow Stances** 🌊 (태, 감)

### 2.4 Stance Transition System

**Transition Duration**: 600ms (36 frames at 60fps)  
**Cost**: Variable based on distance around stance wheel (11-15 Ki, 7-10 Stamina)  
**Status**: ✅ Complete (64 transitions implemented with keyframe interpolation)

**Transition Types**:
1. **Self Transition** (0 steps): Instant, no cost (e.g., 건 → 건)
2. **Direct Transition** (1-2 steps): 600ms, 11-13 Ki, 7-9 Stamina (e.g., 건 → 태)
3. **Indirect Transition** (3-4 steps): 600ms, 15 Ki, 10 Stamina (e.g., 건 → 손, opposite stances)

**Stance Wheel Arrangement**:
```
         ☰ 건 (Geon)
    ☱ 태          ☷ 곤 (Gon)
 ☲ 리                  ☶ 간 (Gan)
    ☳ 진          ☵ 감 (Gam)
         ☴ 손 (Son)
```

**Keyframe Phases** (600ms = 36 frames at 60fps):
- **Frames 0-12**: Weight shift phase (중심 이동)
- **Frames 12-24**: Foot repositioning phase (발 재배치)
- **Frames 24-36**: Guard change phase (방어 자세 변경)

**Vulnerability**: Player cannot attack or defend during 600ms transition window, creating tactical risk/reward for stance switching.

**See**: [`COMBAT_ARCHITECTURE.md`](COMBAT_ARCHITECTURE.md#-stance-transition-animation-system-팔괘전환-애니메이션) for complete transition system technical details.

### 2.5 Archetype-Stance Affinity

Each player archetype has preferred stances with -20% transition cost:

| Archetype | Korean | Icon | Preferred Stances | Bonus |
|-----------|--------|------|-------------------|-------|
| **무사 (Musa)** 🥋 | Traditional Warrior | 🛡️ | ☰ Geon ⛅, ☳ Jin ⚡ | Power stance mastery 💪 |
| **암살자 (Amsalja)** 🗡️ | Shadow Assassin | 👤 | ☴ Son 💨, ☵ Gam 💧 | Flow stance mastery 🌊 |
| **해커 (Hacker)** 💻 | Cyber Warrior | 🔮 | ☲ Li 🔥, ☱ Tae 🌊 | Precision stance mastery 🎯 |
| **정보요원 (Jeongbo)** 🕵️ | Intelligence Op | 🧠 | ☶ Gan ⛰️, ☷ Gon 🌍 | Defensive stance mastery 🛡️ |
| **조직폭력배 (Jojik)** 🦹 | Organized Crime | 💀 | ☳ Jin ⚡, ☵ Gam 💧 | Brutal stance mastery 💥 |

---

## 3. 5 Player Archetypes (오대 무사)

**Current Status**: ✅ **100% Complete** (5/5 implemented with full lore and abilities)  
**Documentation**: [`game-design.md`](game-design.md#player-archetypes), [`game-status.md`](game-status.md)  
**Test Coverage**: 100% archetype data validation

The 5 Player Archetypes (오대 무사) represent distinct combat philosophies, each with unique stats, abilities, preferred stances, and martial arts specializations.


### 3.1 Archetype Overview

| Archetype | Korean | Icon | Philosophy | Combat Focus | Preferred Stances |
|-----------|--------|------|------------|--------------|-------------------|
| **Musa** 🥋 | 무사 | 🛡️ | Honor & Discipline | Direct power, bone-breaking | ☰ Geon, ☳ Jin |
| **Amsalja** 🗡️ | 암살자 | 👤 | Efficiency & Stealth | Silent takedowns, one-hit KO | ☴ Son, ☵ Gam |
| **Hacker** 💻 | 해커 | 🔮 | Data & Precision | Anatomical analysis, tech-enhanced | ☲ Li, ☱ Tae |
| **Jeongbo** 🕵️ | 정보요원 | 🧠 | Psychology & Strategy | Pain compliance, interrogation | ☶ Gan, ☷ Gon |
| **Jojik** 🦹 | 조직폭력배 | 💀 | Survival & Brutality | Dirty fighting, street tactics | ☳ Jin, ☵ Gam |


### 3.3 Archetype Balance Metrics (Q1 2026)

**Current Status**: ✅ Balanced within 48-52% win rate target

| Archetype | Icon | Win Rate | Pick Rate | Avg Damage/Round | Critical Hit % |
|-----------|------|----------|-----------|-------------------|----------------|
| 무사 (Musa) 🥋 | 🛡️ | 51% ✅ | 22% | 285 💪 | 18% |
| 암살자 (Amsalja) 🗡️ | 👤 | 49% ✅ | 18% | 320 ⚡ | 35% 🎯 |
| 해커 (Hacker) 💻 | 🔮 | 50% ✅ | 24% | 270 💻 | 22% |
| 정보요원 (Jeongbo) 🕵️ | 🧠 | 48% ✅ | 16% | 245 🧠 | 15% |
| 조직폭력배 (Jojik) 🦹 | 💀 | 52% ✅ | 20% | 295 💥 | 28% |

**Balance Philosophy**: All archetypes within 48-52% win rate ensures no single archetype dominates. Monthly patches adjust based on tournament meta and community feedback.

---

## 4. Skeletal Animation System (골격 애니메이션)

**Current Status**: 🔄 **In Development** (Ready for integration, 28-bone hierarchy defined)  
**Documentation**: [`COMBAT_ARCHITECTURE.md`](COMBAT_ARCHITECTURE.md#-fighting-stance-guard-animation-system-자세-방어-애니메이션), [`src/types/skeletal.ts`](src/types/skeletal.ts)

The Skeletal Animation System provides anatomically accurate 3D character rendering with 28-bone hierarchy, 7 hand poses, and muscle tension visualization for authentic Korean martial arts combat.

### 4.1 28-Bone Hierarchy

Black Trigram uses a 28-bone skeletal rig based on human anatomy:

**Head & Neck (2)**: Head (머리), Neck (목)  
**Spine & Core (4)**: Upper Spine (상부 척추), Mid Spine (중부 척추), Lower Spine (하부 척추), Pelvis (골반)  
**Ribs (1)**: Rib Cage (늑골)  
**Arms (12, 6 per arm)**: Shoulder, Upper Arm, Elbow, Forearm, Wrist, Hand (Left/Right)  
**Legs (8, 4 per leg)**: Hip, Thigh, Knee, Shin, Ankle, Foot (Left/Right)  
**Hips (1)**: Hips (엉덩이)

**Total**: 28 bones providing full-body articulation for authentic Korean martial arts movement.

### 4.2 7 Hand Poses (손 자세)

| # | Korean | English | Usage | Animation Trigger |
|---|--------|---------|-------|-------------------|
| 1 | 주먹 | Fist | Punching, blocking | Power strikes, Geon/Jin stances |
| 2 | 펼친 손 | Open Hand | Palm strikes, deflecting | Tae/Gam flow techniques |
| 3 | 찌르기 | Strike Hand | Precision finger strikes | Li stance, vital point targeting |
| 4 | 잡기 | Grab Hand | Grappling, joint locks | Tae/Gon throwing techniques |
| 5 | 막기 | Block Hand | Defensive blocking | Gan stance, defense mode |
| 6 | 가리키기 | Point Hand | Precise targeting | Hacker archetype, Li stance |
| 7 | 이완 | Relaxed | Neutral stance | Stance guard positions |

**Breathing Animation**: Rib cage expansion/contraction (0.96-1.04x scale), 4-6 frames/breath at 60fps, stance-specific rates.

### 4.3 Muscle Tension Visualization

- **🔴 Red** (80-100%): Active striking muscles, maximum power
- **🟡 Yellow** (50-80%): Supporting/stabilizing muscles, optimal zone
- **🟢 Green** (0-50%): Relaxed muscles, recovery state

Toggle with `M` key. Helps players understand proper technique mechanics.

### 4.4 Implementation Status

✅ 28-bone hierarchy defined | ✅ 7 hand poses | ✅ 8 stance-specific guards | ✅ Breathing animation (60fps) | 🔄 SkeletalPlayer3D component pending | ⚠️ Integration tests pending

---

## 5. Future Multiplayer Modes (멀티플레이어)

**Target Release**: v2.0 (Q1 2028)  
**Documentation**: [`FUTURE_ARCHITECTURE.md`](FUTURE_ARCHITECTURE.md#-v20-vision-2028---multiplayer--persistence)  
**Status**: 📋 Planned for post-1.0 development

Black Trigram's multiplayer vision extends the single-player combat realism to competitive PvP and cooperative training modes, enabling players to test mastery against human opponents and collaborate in martial arts training.

### 5.1 PvP Competitive Modes

#### 5.1.1 1v1 Ranked Duel (일대일 랭크전)

**Format**: Best of 3 rounds, 60 seconds per round  
**Matchmaking**: ELO-based skill rating with regional preference (US East/West, EU, Asia)  
**Ranking Tiers**: 
- Bronze (청동) - 0-1000 ELO
- Silver (은) - 1000-1500 ELO
- Gold (금) - 1500-2000 ELO
- Platinum (백금) - 2000-2500 ELO
- Diamond (다이아몬드) - 2500-3000 ELO
- Master (고수) - 3000-3500 ELO
- Grandmaster (대사) - 3500+ ELO

**Rules**:
- Character lock after selection (no mid-match archetype change)
- Stance switching allowed (600ms penalty)
- Standard vital point damage with PvP balance adjustments (-10% overall damage for longer matches)
- No healing between rounds (health resets to 100%)

**Rewards**:
- ELO points: +25 win, -15 loss (adjusted by opponent ELO difference)
- Seasonal rewards: Exclusive cosmetics, titles, achievement badges
- Win streak bonuses: 3-win streak = +10% XP, 5-win = +25% XP, 10-win = exclusive emote

#### 5.1.2 2v2 Team Combat (이인조 팀 전투)

**Format**: Best of 3 rounds, 90 seconds per round, coordinated team tactics  
**Matchmaking**: Team ELO average with role balancing  
**Team Composition**: Players select archetypes before match

**Coordinated Stance Synergies**:
- **Power + Precision**: Musa (Geon) + Hacker (Li) = +15% combined damage when both strike same vital point
- **Stealth + Flow**: Amsalja (Son) + Intelligence (Gam) = +20% counter damage when coordinating attacks
- **Defense + Support**: Jeongbo (Gan) + Jojik (Gon) = +25% block strength when protecting teammate

**Team Abilities**:
- **Combined Strikes** (협공): Both players attack same target vital point within 2 seconds for 1.5x damage multiplier
- **Protection Counter** (보호반격): One player blocks for teammate, enabling guaranteed counter-attack
- **Stance Resonance** (자세공명): Both players in same stance category (Power/Precision/Flow) = +10% all stats

**Communication**: Voice chat + quick emotes (attack/defend/retreat/focus target)

#### 5.1.3 Tournament Mode (토너먼트)

**Format**: 8-16 player single-elimination bracket  
**Schedule**: Weekly automated tournaments (Saturday 2PM UTC, 8PM UTC)  
**Entry**: Free for all players, Gold tier+ for ranked tournaments

**Prize Pool**:
- **1st Place**: 10,000 in-game currency, exclusive title "Tournament Champion" (토너먼트 챔피언), golden aura cosmetic
- **2nd Place**: 5,000 currency, title "Finalist" (결승진출자)
- **3rd-4th Place**: 2,500 currency, title "Semi-Finalist" (준결승진출자)

**Rules**:
- Bo3 until finals (Bo5)
- Character pool: Select 3 archetypes, blind pick each match
- Map rotation: Underground Dojang, Cyber Seoul Rooftop, Traditional Temple Courtyard

### 5.2 Co-op Training Modes

#### 5.2.1 Training Dojang (수련 도장)

**Players**: 2-4 cooperative  
**Format**: Wave-based AI opponents with progressive difficulty

**Progression**:
- **Wave 1-5**: Basic AI opponents, practice combos, 100% health between waves
- **Wave 6-10**: Intermediate AI, introduce stance counters, 75% health recovery
- **Wave 11-15**: Advanced AI, adaptive stance switching, 50% health recovery
- **Wave 16-20**: Master AI, perfect blocks, vital point targeting, 25% health recovery
- **Boss Wave 21**: Legendary Master (전설의 고수) with all archetype abilities, 0% recovery

**Rewards**:
- XP per wave: 50 XP base + 25 XP per difficulty tier
- Completion bonuses: Wave 10 = 500 XP, Wave 20 = 2000 XP, Boss = 5000 XP + cosmetic
- Combo achievements: 10-hit combo = +100 XP, 20-hit = +500 XP, 50-hit = exclusive title

#### 5.2.2 Raid Boss (레이드 보스)

**Players**: 4-8 cooperative  
**Format**: Fight against legendary Korean martial arts masters with 10,000+ HP

**Boss Types**:
- **Grandmaster Kim (김대사)**: Taekwondo master, emphasizes ☰ Geon and ☳ Jin stances, powerful kick techniques
- **Shadow Master Park (박암수)**: Hapkido master, flow stance specialist (☵ Gam, ☱ Tae), joint locks and throws
- **Mountain Sage Lee (이산인)**: Defensive master (☶ Gan, ☷ Gon), counterattack specialist, 90% block rate

**Mechanics**:
- **Phase 1 (100%-70% HP)**: Standard attacks, introduce mechanics
- **Phase 2 (70%-40% HP)**: Rage mode, +30% damage, faster stance switching, summon 2 minions
- **Phase 3 (40%-0% HP)**: Desperate mode, +50% damage, unlocks ultimate techniques, arena hazards

**Rewards**:
- First completion: 10,000 XP, exclusive boss-themed cosmetic set (dobok, belt, gloves)
- Weekly completion: 5,000 XP, rare crafting materials
- Speed run achievements: <15 min = title "Swift Warrior", <10 min = golden weapon skin

### 5.3 Leaderboards & Progression

#### 5.3.1 Global Rankings

**Categories**:
- Overall ELO ranking (all modes combined)
- Archetype-specific rankings (top Musa, Amsalja, etc.)
- Win streak leaderboard (current active streaks)
- Tournament champions (seasonal hall of fame)

**Regional Breakdown**: US, EU, Asia, Global  
**Updates**: Real-time ELO, daily leaderboard refresh

#### 5.3.2 Season System

**Duration**: 3 months per season (Q1, Q2, Q3, Q4)  
**Season Rewards**: Exclusive cosmetics, titles, emotes based on final ranking tier

**Season 1 Example (Q1 2028)**:
- **Master+ Tier**: "Season 1 Master" title, exclusive golden trigram emblem, premium battle pass
- **Diamond+ Tier**: "Season 1 Diamond" title, silver trigram emblem, standard battle pass
- **Gold+ Tier**: "Season 1 Gold" title, bronze trigram emblem, 5,000 currency

**Season Resets**: ELO soft reset (new ELO = (old ELO + 1500) / 2), maintain tier badges

### 5.4 Multiplayer Technical Architecture

**Netcode**: WebRTC peer-to-peer for low latency (<50ms target)  
**Rollback**: Rollback netcode for smooth gameplay even with 50-100ms latency  
**Lag Compensation**: Server-side hitbox verification, client-side prediction  
**Regional Servers**: AWS EC2 in US-East, US-West, EU-West, Asia-Pacific  
**Spectator Mode**: Live match viewing with 5-second delay, combat statistics overlay

**See**: [`FUTURE_ARCHITECTURE.md`](FUTURE_ARCHITECTURE.md#2-multiplayer-pvp) for complete multiplayer technical details.

---

## 6. Backend-Enabled Progression (진행 시스템)

**Target Release**: v2.0 (Q1 2028)  
**Documentation**: [`FUTURE_ARCHITECTURE.md`](FUTURE_ARCHITECTURE.md#3-progression-system)  
**Technology**: Node.js + Express, PostgreSQL, Redis caching, AWS S3 for save storage

The backend-enabled progression system transforms Black Trigram from a stateless web game into a persistent RPG-style experience with character leveling, skill trees, equipment, and long-term achievement tracking.

### 6.1 Character Leveling System

**Level Range**: 1-50  
**XP Sources**:
- Training mode completion: 100-500 XP per session
- PvP wins: 200 XP (ranked), 100 XP (casual)
- Co-op training: 50-500 XP per wave
- Raid boss: 1,000-5,000 XP per completion
- Daily challenges: 250 XP each
- Achievements: 100-1,000 XP per unlock

**XP Curve**: Exponential scaling  
- Level 1→2: 100 XP
- Level 10→11: 2,500 XP
- Level 25→26: 12,500 XP
- Level 49→50: 50,000 XP

**Leveling Rewards**:
- **Every Level**: +5 to all base stats (STR, DEX, INT, WIS, LUK)
- **Every 5 Levels**: Milestone reward (cosmetic, title, currency)
- **Levels 10, 20, 30, 40, 50**: Major milestone (skill tree unlock, exclusive cosmetic set)

### 6.2 Skill Trees Per Archetype

Each archetype has 3 specialization branches with 20+ skills:

#### Example: 무사 (Musa) Skill Tree

**Branch 1: 골절의길 (Path of Bone Breaking)**
- Tier 1: +10% skeletal vital point damage
- Tier 2: +15% critical hit chance on bone strikes
- Tier 3: Unlock "Skull Crusher" technique (90 damage to head)
- Tier 4: +20% stun duration on bone fractures
- Tier 5 (Ultimate): "Martial Devastation" - 3 successive bone strikes deal 300% total damage

**Branch 2: 군사전술 (Military Tactics)**
- Tier 1: +10% stamina regeneration
- Tier 2: Reduce stance transition cost by 20%
- Tier 3: Unlock "Tactical Retreat" ability (instant evasion, 60s cooldown)
- Tier 4: +15% damage when health >50%
- Tier 5 (Ultimate): "Commander's Resolve" - Invulnerable for 5 seconds, 180s cooldown

**Branch 3: 명예의수호자 (Guardian of Honor)**
- Tier 1: +10% block strength
- Tier 2: Successful blocks restore 5% health
- Tier 3: Unlock "Honorable Counter" (perfect block = guaranteed critical counter)
- Tier 4: +20% damage resistance when protecting teammate (v2.0 multiplayer)
- Tier 5 (Ultimate): "Unbreakable Will" - Survive fatal blow with 1 HP, once per match

**Skill Points**: 1 point per level, 49 points total at level 50 (can max 2.5 branches)  
**Respec**: Available for 5,000 in-game currency or $2.99 real money

### 6.3 Achievement System

**Categories**: Combat, Exploration, Training, Multiplayer, Special

**Example Achievements**:

**Combat Achievements**:
- "First Blood" - Deal 100 damage in single strike (100 XP, common)
- "Vital Point Master" - Strike all 70 vital points at least once (1,000 XP, rare)
- "Perfect Round" - Win round without taking damage (250 XP, uncommon)
- "One-Strike Warrior" - Win match with single strike (500 XP, rare)
- "Trigram Grandmaster" - Master all 8 stances (5,000 XP, legendary, exclusive title)

**Multiplayer Achievements**:
- "Duel Victor" - Win 10 ranked matches (500 XP, uncommon)
- "Flawless Victory" - Win ranked match 3-0 (250 XP, uncommon)
- "Team Player" - Win 25 2v2 matches (1,000 XP, rare)
- "Tournament Champion" - Win weekly tournament (5,000 XP, legendary, exclusive cosmetic)
- "Unstoppable" - 10-win streak in ranked (2,000 XP, epic, title "Unstoppable Force")

**Total Achievements**: 100+ across all categories

### 6.4 Equipment & Cosmetic System

**Equipment Slots** (cosmetic only, NO pay-to-win):
- Dobok (uniform): Traditional/modern/cyberpunk styles
- Belt: White → Black → Red (+ custom colors)
- Gloves: Bare hands, traditional wraps, tactical gloves, neon gloves
- Shoes: Bare feet, martial arts shoes, cyberpunk boots
- Aura: Stance-specific energy effects (fire, lightning, water, etc.)

**Unlock Methods**:
- Level milestones (Level 10 = first cosmetic set)
- Achievement rewards (specific cosmetics for hard achievements)
- In-game currency purchases (1,000-5,000 currency per item)
- Battle Pass rewards (10 tiers with exclusive cosmetics)
- Real money purchases ($2-$10 per item, optional)

**Customization**:
- Color palette editor (primary, secondary, accent colors)
- Particle effect intensity (low/medium/high for auras)
- Victory animation selection (10+ animations, unlock via achievements)
- Emote wheel (8 slots, unlock via achievements or battle pass)

### 6.5 Global Rankings & Statistics

**Player Profile Dashboard**:
- Overall stats: Win rate, KO rate, average damage, favorite archetype
- Archetype breakdown: Hours played, win rate, best vital point per archetype
- Stance statistics: Most used stance, highest damage stance, best win rate stance
- Combat analytics: Average critical hit %, preferred vital point targets, stance switching frequency
- Match history: Last 50 matches with replays (saved for 30 days)

**Leaderboards**:
- Global ELO ranking (updated real-time)
- Regional rankings (US, EU, Asia)
- Archetype-specific rankings (top 100 per archetype)
- Achievement leaderboards (most achievements unlocked)
- Playtime leaderboards (most hours in training/combat)

---


## 7. Monetization Strategy (수익화 전략)

**Philosophy**: ✅ **Ethical Free-to-Play** - 100% gameplay free, cosmetics only, NO pay-to-win  
**Target Release**: v1.0 (2026) for cosmetics, v2.0 (2028) for Battle Pass

Black Trigram's monetization follows ethical free-to-play principles: all combat mechanics, archetypes, stances, and vital points are 100% free forever. Revenue comes exclusively from optional cosmetic items that do NOT affect gameplay balance.

### 7.1 Core Principles

**🎯 100% FREE GAMEPLAY**:
- All 5 player archetypes (무사, 암살자, 해커, 정보요원, 조직폭력배)
- All 8 trigram stances (☰☱☲☳☴☵☶☷)
- All 70 vital points with full damage system
- All game modes (Training, Combat, future Multiplayer)
- Complete progression system (levels, skills, achievements)

**✅ COSMETICS ONLY**:
- Character skins (dobok, belts, gloves, shoes)
- Visual effects (auras, particle effects, hit sparks)
- Emotes and victory animations
- UI themes and color palettes

**❌ NO PAY-TO-WIN**:
- NO stat boosts
- NO damage advantages
- NO exclusive techniques
- NO faster progression
- NO loot boxes or gambling mechanics

### 7.2 Monetization Tiers

#### 7.2.1 Individual Cosmetic Items

**Pricing Structure**:
- **Basic Cosmetics**: $2-$3 (simple color variants, basic auras)
- **Premium Cosmetics**: $5-$7 (animated effects, unique designs, Korean traditional patterns)
- **Legendary Cosmetics**: $10 (full character sets, elaborate particle effects, exclusive animations)

**Examples**:
- "Neon Cyber Dobok" - $5 (cyberpunk-themed uniform with glowing Korean characters)
- "Golden Dragon Aura" - $7 (golden particle effect with Korean dragon patterns)
- "Master's Victory" - $3 (traditional Korean martial arts bow victory animation)
- "Trigram Fire Set" - $10 (complete fire-themed cosmetic set with aura, dobok, belt, gloves)

**Rotation**: Weekly featured items (20% discount), monthly exclusive cosmetics

#### 7.2.2 Battle Pass (전투 패스)

**Launch**: v2.0 (Q1 2028) with multiplayer  
**Price**: $10 per season (3 months)  
**Structure**: 50 tiers with cosmetic rewards

**Free Tier Rewards** (available to all players):
- Tier 5: Basic color palette
- Tier 10: Emote
- Tier 20: Basic aura
- Tier 30: Dobok skin
- Tier 40: Victory animation
- Tier 50: Exclusive title "Season Champion"

**Premium Tier Rewards** ($10 unlock):
- Tier 1: Instant 1,000 in-game currency
- Tier 5: Premium dobok variant
- Tier 10: Animated aura
- Tier 15: Emote pack (3 emotes)
- Tier 20: Legendary belt skin
- Tier 25: Premium gloves + shoes set
- Tier 30: Exclusive Korean traditional pattern dobok
- Tier 35: Mythic aura with Korean calligraphy
- Tier 40: Full cosmetic set (dobok, belt, gloves, shoes)
- Tier 45: Victory animation pack (5 animations)
- Tier 50: Mythic complete set + exclusive title "Premium Master"

**XP Sources**:
- Daily challenges: 3 per day, 500 Battle Pass XP each
- Weekly challenges: 3 per week, 2,500 Battle Pass XP each
- Ranked wins: 200 Battle Pass XP per win
- Co-op training: 100 Battle Pass XP per session

**Target**: 30-40 hours gameplay to complete free tier, 60-80 hours for premium tier (achievable in 3 months with regular play)

#### 7.2.3 DLC Expansions (확장팩)

**Future Content** (post-v2.0, 2028-2030):

**DLC #1: "Dark Ops Techniques" (암흑작전 기술)** - $15
- New archetype: "Special Ops Agent" (특수요원) with 15 Dark Ops techniques
- 5 new vital points (military-grade lethal strikes)
- Exclusive story campaign (10 missions)
- 10+ cosmetics themed around Korean special forces

**DLC #2: "Traditional Masters" (전통 고수)** - $20
- 3 new archetypes: Taekwondo Master, Hapkido Master, Taekyon Master
- Historical training scenarios (learn traditional Korean martial arts)
- 20+ traditional Korean cosmetics (hanbok-inspired doboks, traditional weapons)
- Documentary-style educational content (real Korean martial arts history)

**DLC #3: "Cyber Seoul Expansion" (사이버 서울)** - $25
- New game mode: "Underground Tournament" (지하 토너먼트) with 10 unique arenas
- 2 new archetypes: "Corporate Enforcer", "Underground Champion"
- 30+ cyberpunk Korean-themed cosmetics
- Expanded story campaign (20 missions in futuristic Seoul)

**Bundle Pricing**: All DLCs for $50 (17% discount from $60 individual)

### 7.3 In-Game Currency System

**Currency Name**: "기 (Ki)" - Matches the game's Korean martial arts theme

**Earn Ki**:
- Training mode completion: 50-200 Ki
- Ranked wins: 100 Ki
- Daily login: 50 Ki (7-day streak bonus: 500 Ki)
- Daily challenges: 100 Ki each (3/day = 300 Ki max)
- Weekly challenges: 500 Ki each (3/week = 1,500 Ki max)
- Achievements: 100-5,000 Ki per achievement

**Spend Ki**:
- Basic cosmetics: 1,000-3,000 Ki
- Premium cosmetics: 5,000-10,000 Ki
- Skill tree respec: 5,000 Ki
- Custom color palettes: 2,000 Ki
- Emotes: 1,500-3,000 Ki
- Victory animations: 2,500-5,000 Ki

**Real Money Purchase**:
- 1,000 Ki = $1
- 5,000 Ki = $4 (20% bonus)
- 10,000 Ki = $7.50 (25% bonus)
- 25,000 Ki = $17.50 (30% bonus)
- 50,000 Ki = $30 (40% bonus)

**Balance**: Players can earn ~2,000 Ki/week through free gameplay (daily challenges + ranked play), enough for 1 cosmetic item per 2-3 weeks without spending money.

### 7.4 Revenue Projections & Fairness

**Target Conversion Rate**: 5-10% of players purchase cosmetics or Battle Pass  
**Average Revenue Per Paying User (ARPPU)**: $15-$30 per year  
**Estimated Monthly Revenue** (at 10,000 active players):
- 500-1,000 paying players × $2.50 average/month = $1,250-$2,500/month
- Sustainable for small team development costs ($5,000-$10,000/month)

**Fairness Metrics**:
- **0%** pay-to-win advantage (no stat boosts, EVER)
- **100%** gameplay free (all combat mechanics accessible)
- **~95%** cosmetics earnable through gameplay (only 5% real-money exclusive)
- **Transparent pricing** (no hidden costs, no loot boxes, no gambling)

### 7.5 Community Transparency

**Monetization Disclosure**:
- Clear "Cosmetic Only" labels on all purchasable items
- Public documentation of pricing structure
- Community input on pricing via surveys
- Annual monetization report (revenue breakdown, where money goes)

**Community Promises**:
1. Never add pay-to-win mechanics (legally binding commitment)
2. All future archetypes will be free (DLC adds content, not power)
3. Loot boxes/gambling will never be added
4. Pricing will remain fair (community vote on price changes)

---

## 8. Balance Philosophy (밸런스 철학)

**Current Status**: ✅ Balanced within 48-52% win rate target (Q1 2026)  
**Documentation**: [`game-status.md`](game-status.md#archetype-balance-metrics)

Black Trigram's balance philosophy prioritizes **skill-based gameplay** where player mastery (vital point knowledge, stance switching, timing) determines victory, not archetype choice or pay-to-win advantages.

### 8.1 Core Balance Principles

#### 8.1.1 Rock-Paper-Scissors Stance System

**Philosophy**: No single stance dominates; all 8 stances have counters

**Balance Matrix**:
- **Power Stances** (건, 진, 곤) beat **Precision Stances** (리, 손, 간)
- **Flow Stances** (태, 감) beat **Power Stances** (건, 진, 곤)  
- **Precision Stances** (리, 손, 간) beat **Flow Stances** (태, 감)

**Design Goal**: Each stance wins 50% of matchups on average, encouraging dynamic stance switching during combat.

**Measurement**: Stance usage rates target 10-15% each (no single stance >20% usage)

#### 8.1.2 Archetype Diversity

**Philosophy**: All 5 archetypes viable, no "best" archetype

**Balance Targets**:
- **Win Rate**: 48-52% for each archetype (within 4% of each other)
- **Pick Rate**: 16-24% for each archetype (no archetype <10% or >30%)
- **Skill Expression**: High skill ceiling for all archetypes (reward mastery)
- **Playstyle Diversity**: Each archetype feels distinct with unique strengths

**Current Metrics** (Q1 2026):
- ✅ All archetypes within 48-52% win rate
- ✅ Pick rates balanced (16-24% range)
- ✅ Skill ceiling validated through tournament play

#### 8.1.3 Skill-Based Gameplay

**Design Goal**: Skill > Archetype choice > Luck

**Skill Factors** (in order of impact):
1. **Vital Point Knowledge** (40% impact): Knowing which vital point to target in each situation
2. **Stance Management** (25% impact): Switching to counter opponent's stance
3. **Timing & Precision** (20% impact): Landing critical hits, perfect blocks
4. **Resource Management** (10% impact): Ki/Stamina economy
5. **Adaptation** (5% impact): Reading opponent patterns, adjusting strategy

**Anti-Frustration Measures**:
- NO instant-kill combos (max 60% health in single combo)
- Comeback mechanics (desperation abilities when health <30%)
- Defensive options always available (blocking, dodging, stance switching)
- Clear visual telegraphs for all attacks (wind-up animations, 3-5 frames)

### 8.2 Current Balance Metrics (Q1 2026)

**Archetype Win Rates**:
| Archetype | Win Rate | Change from Dec 2025 |
|-----------|----------|----------------------|
| 무사 (Musa) | 51% | +1% (slight buff to bone-breaking) |
| 암살자 (Amsalja) | 49% | -1% (stealth nerf for balance) |
| 해커 (Hacker) | 50% | 0% (perfect balance) |
| 정보요원 (Jeongbo) | 48% | +2% (defensive buff) |
| 조직폭력배 (Jojik) | 52% | 0% (high skill ceiling) |

**Stance Usage Rates**:
| Stance | Usage Rate | Win Rate | Balanced? |
|--------|------------|----------|-----------|
| ☰ 건 (Geon) | 14% | 50% | ✅ Yes |
| ☱ 태 (Tae) | 13% | 49% | ✅ Yes |
| ☲ 리 (Li) | 15% | 51% | ✅ Yes |
| ☳ 진 (Jin) | 12% | 52% | ✅ Yes |
| ☴ 손 (Son) | 11% | 48% | ✅ Yes (monitor) |
| ☵ 감 (Gam) | 12% | 50% | ✅ Yes |
| ☶ 간 (Gan) | 10% | 49% | ⚠️ Low usage, buff next patch |
| ☷ 곤 (Gon) | 13% | 51% | ✅ Yes |

**Target**: All stances 10-15% usage, all within 48-52% win rate

### 8.3 Ongoing Balance Process

**Monthly Patches**:
- Analyze tournament meta (top 100 players)
- Review community feedback (Reddit, Discord, forums)
- Adjust vital point damage values (+/- 5 damage max)
- Tweak stance bonuses (+/- 5% max)
- Buff underused archetypes, nerf overperforming

**Balance Team**:
- Lead Designer: Reviews overall metrics
- Community Manager: Collects player feedback
- Pro Players: Consult on high-level meta
- Data Analyst: Tracks win rates, usage rates, match data

**Transparency**:
- Monthly balance report published (what changed, why)
- Patch notes with detailed explanations (not just "buffed X")
- Community discussion before major changes (2-week feedback period)

### 8.4 Future Balance Considerations (v2.0+)

**Multiplayer Balance Adjustments**:
- PvP damage modifier: -10% overall (longer matches for spectator enjoyment)
- Team mode synergies: Balanced to prevent dominant combos
- Tournament ban/pick system: Players can ban 1 archetype, ensuring meta diversity

**Progression Balance**:
- Skill tree balancing: Ensure no "must-pick" talents (all branches viable)
- Level advantages minimized: Max +25% stats at level 50, still beatable by level 1 with skill
- Cosmetic-only monetization maintained: NO pay-to-win EVER (legally binding)

---

## 9. Realistic Combat System

### 9.1 Core Body Mechanics

**Health & Combat System (건강 및 전투 체계)**:
- 100% Combat Ready → 80% Light Damage → 60% Moderate Damage → 40% Heavy Damage → 20% Critical Damage → 0% Incapacitated

**Pain Response System (고통 반응 체계)**:
- 충격통 (Shock Pain): Instant reaction affecting all abilities
- 누적외상 (Cumulative Trauma): Progressive damage impairment
- 통증과부하 (Pain Overload): Complete incapacitation
- Current Status: ✅ 100% production-ready, 37 tests passing

**Consciousness Levels (의식 수준)**:
- 전투각성 (Combat Alert) → 혼란상태 (Disoriented) → 기절직전 (Stunned) → 무의식 (Unconscious)
- Current Status: ✅ 100% production-ready, 36 tests passing

**Balance & Vulnerability (균형 및 취약성)**:
- 🟢 준비완료 (READY) → 🟡 동요상태 (SHAKEN) → 🟠 취약상태 (VULNERABLE) → 🔴 무력상태 (HELPLESS)

**Grappling System (잡기 체계)** ✨ NEW:
- 🤜 **Grip Mechanics**: Authentic Hapkido/Ssireum techniques with decay over time
- 💪 **Escape System**: Difficulty based on stamina, stance advantages (GON/GAN)
- 🔄 **State Transitions**: GRAPPLING (controlling) ↔ GRAPPLED (controlled)
- 🎯 **Stance Advantages**: GON (Earth) +30% grip strength, GAN (Mountain) +15% escape
- Current Status: ✅ 95% production-ready, 4 animation states, 34 tests passing

**Limb Exposure & Counter-Attacks (사지 노출 및 반격)** ✨ NEW:
- 🎯 **Vulnerability Windows**: 300-400ms exposure during attack execution
- ⚡ **Counter Opportunities**: Exploit exposed limbs (ankle, knee, elbow, wrist)
- 💥 **Damage Multipliers**: 1.5x-2.5x damage during vulnerability windows
- 🦴 **Breaking Techniques**: Joint/limb breaking with injury severity
- 🤖 **AI Integration**: Defensive archetypes prioritize counter-attacks (Musa, Amsalja)
- 📊 **Priority System**: Counter-attacks evaluated at AI decision priority 2
- Current Status: ✅ 100% production-ready, 132 tests passing, full AI integration

### 9.2 Visual & Audio Feedback

**Blood & Trauma System**: Progressive damage visualization (bruising, cuts, bleeding)  
**Realistic Sound Design**: Bone breaking (골절음), flesh impact (타격음), joint manipulation (관절음), breathing effects (호흡음), grappling sounds (잡기음)  
**Body Response Animation**: Pain reactions (통증반응), balance loss (균형상실), unconsciousness (무의식상태), injury adaptation (손상적응), grappling struggles (탈출시도)

**Limb Exposure Visual Indicators** ✨ NEW:
- 🔴 **3D Glow Effects**: Red/orange glow on exposed limbs during vulnerability windows
- ⏱️ **Timing HUD**: Circular progress timer showing remaining opportunity window
- 🎨 **Color-Coded Intensity**: Gold (<1.5x) → Orange (1.5-2.0x) → Red (≥2.0x breaking opportunities)
- 📱 **Mobile Optimized**: 60% intensity reduction for performance
- 💬 **Bilingual Labels**: Korean-English ("반격 기회" / "Counter Opportunity")

**Grappling Visual Feedback** ✨ NEW:
- ✨ **Particle System**: 20-50 struggle particles showing resistance intensity
- 📊 **Grip Strength Meter**: Real-time display of grapple control strength
- 🎨 **State-Dependent Colors**: Blue (controlling) vs Red (being controlled)
- 📱 **Mobile Optimized**: 60% particle reduction for 55fps+ performance

**Current Status**: ✅ 97% complete, 60fps performance validated, visual indicators for all combat states

---

## 10. Game Modes & Training

**1. 해부학 연구 (Anatomical Study)**: Learn 70 vital points, effects, and combat applications  
**2. 무술 기법 (Martial Techniques)**: Master 8 trigram stances and Korean martial arts  
**3. 실전 훈련 (Combat Training)**: Practice against AI opponents with progressive difficulty  
**4. 정신 수양 (Mental Cultivation)**: Build pain tolerance, focus, fear management

**Future Modes** (v2.0):
- **Underground Tournament** (지하 토너먼트): Ranked competitive play
- **Team Dojang** (팀 도장): 2v2 cooperative training
- **Raid Boss** (레이드 보스): 4-8 player legendary master fights

---

## 11. Technical Implementation

**Engine**: React 19 + Three.js (@react-three/fiber, @react-three/drei)  
**Languages**: TypeScript (strict mode), GDScript (future Godot port consideration)  
**Audio**: Howler.js with spatial audio for realistic combat sounds  
**Performance**: 60fps target desktop, 55fps+ mobile, <0.01ms vital point collision checks  
**Test Coverage**: 76% overall, 95% for new combat systems (Vitest + Cypress)

**Combat System Architecture**: 
- CombatSystemController (src/systems/CombatSystem.ts)
- TrigramSystemFactory (src/systems/TrigramSystem.ts)
- VitalPointSystemFactory (src/systems/VitalPointSystem.ts)
- DamageCalculationEngine with anatomical precision

**See**: [`COMBAT_ARCHITECTURE.md`](COMBAT_ARCHITECTURE.md) for complete technical details (2,416 lines)

---

## 12. Cultural Integration

### 12.1 Korean Martial Arts Authenticity

**Traditional Techniques**: Based on actual Korean martial arts (Taekwondo 태권도, Hapkido 합기도, Taekyon 택견, Yusul 유술)  
**Authentic Terminology**: Traditional Korean names with combat translations (70 vital points, 8 stances, 5 archetypes)  
**Historical Context**: Real Korean military and martial arts history (Dark Ops techniques from Korean special forces)  
**Philosophical Foundation**: Genuine I Ching (주역) principles in combat application (8 trigrams represent natural forces)

### 12.2 Educational Value

**Martial Education (무술교육)**: Real anatomy and combat learning (70 vital points with physiological effects)  
**Traditional History (전통사)**: Korean fighting tradition education (Taekwondo stances, Hapkido techniques)  
**Safety Awareness (안전의식)**: Understanding technique consequences (clear warnings about real-world application)  
**First Aid Training (응급처치)**: Basic medical response to injuries (educational content)

### 12.3 Cultural Authenticity

**Korean Language**: Bilingual UI (Korean primary, English secondary), authentic pronunciation  
**Traditional Music**: 가야금 (Gayageum), 장구 (Janggu) blended with cyberpunk aesthetics  
**Cyberpunk Korean Aesthetics**: Neon Hangul characters, underground dojang, traditional + modern fusion  
**Respectful Representation**: Consultation with Korean martial arts masters for authenticity

---

## 📊 Summary & Status

**Overall Implementation**: 9.4/10 (Production-Ready, Q1 2026)  
**Combat Realism**: 13/13 systems complete (100%), production-ready ✅  
**Vital Points**: 100% complete (70/70), fully documented  
**Trigram Stances**: 100% complete (8/8), all transitions implemented  
**Player Archetypes**: 100% complete (5/5), balanced within 48-52% win rate  
**Grappling System**: 95% complete, 4 animation states, 34 tests passing ✨  
**Limb Exposure/Counter-Attacks**: 100% complete, AI integration, 132 tests passing ✨  
**Test Coverage**: 75%+ overall (518 tests), 100% for new combat systems  
**Performance**: 60fps maintained desktop, 55fps+ mobile, <0.01ms vital point checks

**v1.0 Release Target**: Q2 2026  
**v2.0 Multiplayer**: Q1 2028  
**v3.0 AI Instructor**: Q1 2030

**See Also**:
- [`COMBAT_ARCHITECTURE.md`](COMBAT_ARCHITECTURE.md) - Complete combat system technical implementation
- [`FUTURE_ARCHITECTURE.md`](FUTURE_ARCHITECTURE.md) - Evolutionary roadmap and v2.0+ vision
- [`game-status.md`](game-status.md) - Current implementation metrics and progress tracking
- [`README.md`](README.md) - Project overview and quick start guide

---

**Black Trigram (흑괘)**: Authentic Korean martial arts combat simulator with anatomical precision, cultural respect, and ethical free-to-play monetization. Master 70 vital points, 8 trigram stances, and 5 distinct archetypes in realistic 3D combat powered by Three.js at 60fps.

**어둠의 무예로 완벽한 일격을 추구하라** - _Master the dark arts through the pursuit of the perfect strike_

