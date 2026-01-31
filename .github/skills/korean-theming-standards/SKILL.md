---
name: korean-theming-standards
description: |
  Enforces Korean cyberpunk aesthetic and cultural authenticity for Black Trigram.
  Ensures proper Korean color palette usage, bilingual text, authentic martial arts
  terminology, and Eight Trigram system integration across all UI and game components.
license: MIT
---

# Korean Theming Standards Skill

## Purpose

This skill ensures that all visual, cultural, and thematic elements in Black Trigram maintain authentic Korean cyberpunk aesthetics and respect traditional Korean martial arts philosophy throughout the codebase.

## When to Apply

**Automatically trigger this skill when:**
- Creating or modifying UI components
- Adding visual effects or Three.js elements
- Implementing combat techniques or stances
- Working with text, labels, or descriptions
- Designing menus, HUDs, or overlays
- Adding color themes or styling
- Implementing Korean martial arts terminology
- Creating or modifying trigram stance systems
- Adding player archetypes or character attributes
- Reviewing pull requests with UI or cultural elements

## Core Principles

### 1. Korean Color Palette (색상 체계)

**ALWAYS use predefined KOREAN_COLORS constants:**

✅ **Primary Cyberpunk Colors (사이버펑크 주요 색상)**
```typescript
import { KOREAN_COLORS } from "@/types/constants/colors";

// PRIMARY COLORS - For main UI elements
KOREAN_COLORS.PRIMARY_CYAN      // 0x00e6e6 - Main UI accent
KOREAN_COLORS.PRIMARY_BLUE      // 0x0066ff - Interactive elements
KOREAN_COLORS.PRIMARY_RED       // 0xff4444 - Warnings, critical hits

// ACCENT COLORS - For emphasis and special effects
KOREAN_COLORS.ACCENT_GOLD       // 0xffc400 - Perfect strikes, highlights
KOREAN_COLORS.ACCENT_GREEN      // 0x44ff44 - Success, positive feedback
KOREAN_COLORS.ACCENT_PURPLE     // 0xaa44ff - Special effects, vital points
```

✅ **Korean Traditional Colors (한국 전통 색상)**
```typescript
// Five Cardinal Colors (오방색) - Based on I Ching
KOREAN_COLORS.CARDINAL_EAST     // 0x00ff88 - 동방 청색 (East/Spring)
KOREAN_COLORS.CARDINAL_WEST     // 0xffffff - 서방 백색 (West/Autumn)
KOREAN_COLORS.CARDINAL_SOUTH    // 0xff4444 - 남방 적색 (South/Summer)
KOREAN_COLORS.CARDINAL_NORTH    // 0x000000 - 북방 흑색 (North/Winter)
KOREAN_COLORS.CARDINAL_CENTER   // 0xffaa00 - 중앙 황색 (Center/Earth)
```

✅ **Trigram Stance Colors (팔괘 자세 색상)**
```typescript
// Eight Trigram colors for stance visualization
KOREAN_COLORS.TRIGRAM_GEON_PRIMARY    // 0xffd700 - ☰ Heaven (White/Gold)
KOREAN_COLORS.TRIGRAM_TAE_PRIMARY     // 0x87ceeb - ☱ Lake (Sky Blue)
KOREAN_COLORS.TRIGRAM_LI_PRIMARY      // 0xff4500 - ☲ Fire (Orange Red)
KOREAN_COLORS.TRIGRAM_JIN_PRIMARY     // 0x9370db - ☳ Thunder (Purple)
KOREAN_COLORS.TRIGRAM_SON_PRIMARY     // 0x32cd32 - ☴ Wind (Light Green)
KOREAN_COLORS.TRIGRAM_GAM_PRIMARY     // 0x1e90ff - ☵ Water (Blue)
KOREAN_COLORS.TRIGRAM_GAN_PRIMARY     // 0x8b4513 - ☶ Mountain (Brown)
KOREAN_COLORS.TRIGRAM_GON_PRIMARY     // 0x2f4f4f - ☷ Earth (Dark Gray)
```

✅ **UI Background Colors (WCAG AA Compliant)**
```typescript
// Dark backgrounds for maximum text contrast
KOREAN_COLORS.UI_BACKGROUND_DARK      // 0x0a0a0a - Very dark (20.3:1 contrast)
KOREAN_COLORS.UI_BACKGROUND_MEDIUM    // 0x1a1a1a - Dark gray panels
KOREAN_COLORS.UI_BACKGROUND_LIGHT     // 0x2a2a2a - Medium dark cards

// Text colors (WCAG 2.1 Level AA - 4.5:1 minimum)
KOREAN_COLORS.TEXT_PRIMARY            // 0xffffff - White (20.3:1)
KOREAN_COLORS.TEXT_SECONDARY          // 0xcccccc - Light gray (13.1:1)
KOREAN_COLORS.TEXT_ACCENT             // 0x00e6e6 - Cyan emphasis (15.8:1)
```

### 2. Bilingual Text Requirements (이중 언어 요구사항)

**ALL user-facing text MUST include Korean and English:**

✅ **Proper Bilingual Pattern**
```typescript
// GOOD: Korean | English format with proper spacing
interface BilingualText {
  readonly korean: string;
  readonly english: string;
}

// UI Component Example
<BilingualLabel 
  korean="건" 
  english="Heaven" 
  separator=" | "
/>

// Renders: "건 | Heaven"
```

✅ **Combat Technique Names**
```typescript
interface Technique {
  readonly nameKorean: string;      // "천둥벽력"
  readonly nameEnglish: string;     // "Thunder Wall Strike"
  readonly nameHanja?: string;      // "天雷壁列" (optional Sino-Korean)
  readonly description: BilingualText;
}

// Example implementation
const technique: Technique = {
  nameKorean: "천둥벽력",
  nameEnglish: "Thunder Wall Strike",
  nameHanja: "天雷壁列",
  description: {
    korean: "하늘의 천둥 같은 강력한 벽력 공격",
    english: "Powerful thunder wall strike from heaven"
  }
};
```

✅ **Vital Point Names (70 Points with Korean/English/TCM)**
```typescript
interface VitalPoint {
  readonly nameKorean: string;      // "백회"
  readonly nameEnglish: string;     // "Hundred Convergences"
  readonly nameTCM: string;         // "Baihui (GV20)"
  readonly location: string;        // Korean/English location description
}

// Example
const baihui: VitalPoint = {
  nameKorean: "백회",
  nameEnglish: "Hundred Convergences",
  nameTCM: "Baihui (GV20)",
  location: "정수리 중앙 | Crown of head center"
};
```

### 3. Korean Font Usage (한글 폰트 사용)

**ALWAYS use FONT_FAMILY constants for Korean text:**

✅ **Font Family Standards**
```typescript
// ALWAYS import and use these constants
export const FONT_FAMILY = {
  KOREAN: "'Noto Sans KR', 'Malgun Gothic', sans-serif",
  ENGLISH: "'Roboto', 'Arial', sans-serif",
  MONOSPACE: "'Fira Code', 'Consolas', monospace",
} as const;

// Apply in components
<div style={{
  fontFamily: FONT_FAMILY.KOREAN,
  fontSize: '18px',
  fontWeight: 'bold',
  color: KOREAN_COLORS.TEXT_PRIMARY,
}}>
  {korean} | {english}
</div>
```

✅ **Html Overlay with Korean Fonts**
```typescript
import { Html } from '@react-three/drei';
import { FONT_FAMILY, KOREAN_COLORS } from '@/types/constants';

<Html center position={[0, 2, 0]}>
  <div style={{
    fontFamily: FONT_FAMILY.KOREAN,
    fontSize: isMobile ? 14 : 18,
    color: KOREAN_COLORS.ACCENT_GOLD,
    fontWeight: 'bold',
    textAlign: 'center',
  }}>
    {korean} | {english}
  </div>
</Html>
```

### 4. Eight Trigram System Integration (팔괘 체계)

**ALWAYS reference authentic I Ching trigrams:**

✅ **Trigram Stance Definitions**
```typescript
export const TRIGRAM_STANCES = {
  GEON: {
    symbol: "☰",
    korean: "건",
    english: "Heaven",
    hanja: "乾",
    element: "Metal",
    direction: "Northwest",
    philosophy: "Creative force, initiative, direct power",
    techniqueKorean: "천둥벽력",
    techniqueEnglish: "Thunder Wall Strike",
    color: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
  },
  TAE: {
    symbol: "☱",
    korean: "태",
    english: "Lake",
    hanja: "兌",
    element: "Metal",
    direction: "West",
    philosophy: "Joyful, fluid movement, adaptability",
    techniqueKorean: "유수연타",
    techniqueEnglish: "Flowing Water Strike",
    color: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,
  },
  LI: {
    symbol: "☲",
    korean: "리",
    english: "Fire",
    hanja: "離",
    element: "Fire",
    direction: "South",
    philosophy: "Illumination, precision, clarity",
    techniqueKorean: "화염지창",
    techniqueEnglish: "Flame Spear",
    color: KOREAN_COLORS.TRIGRAM_LI_PRIMARY,
  },
  JIN: {
    symbol: "☳",
    korean: "진",
    english: "Thunder",
    hanja: "震",
    element: "Wood",
    direction: "East",
    philosophy: "Explosive energy, sudden action",
    techniqueKorean: "벽력일섬",
    techniqueEnglish: "Lightning Flash",
    color: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,
  },
  SON: {
    symbol: "☴",
    korean: "손",
    english: "Wind",
    hanja: "巽",
    element: "Wood",
    direction: "Southeast",
    philosophy: "Gentle persistence, penetration",
    techniqueKorean: "선풍연격",
    techniqueEnglish: "Whirlwind Strike",
    color: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
  },
  GAM: {
    symbol: "☵",
    korean: "감",
    english: "Water",
    hanja: "坎",
    element: "Water",
    direction: "North",
    philosophy: "Flow, adaptation, depth",
    techniqueKorean: "수류반격",
    techniqueEnglish: "Water Flow Counter",
    color: KOREAN_COLORS.TRIGRAM_GAM_PRIMARY,
  },
  GAN: {
    symbol: "☶",
    korean: "간",
    english: "Mountain",
    hanja: "艮",
    element: "Earth",
    direction: "Northeast",
    philosophy: "Stillness, immovability, defense",
    techniqueKorean: "반석방어",
    techniqueEnglish: "Mountain Defense",
    color: KOREAN_COLORS.TRIGRAM_GAN_PRIMARY,
  },
  GON: {
    symbol: "☷",
    korean: "곤",
    english: "Earth",
    hanja: "坤",
    element: "Earth",
    direction: "Southwest",
    philosophy: "Receptive, grounding, endurance",
    techniqueKorean: "대지포옹",
    techniqueEnglish: "Earth Embrace",
    color: KOREAN_COLORS.TRIGRAM_GON_PRIMARY,
  },
} as const;
```

### 5. Player Archetypes (플레이어 원형)

**ALWAYS use authentic Korean character archetypes:**

✅ **Five Player Archetypes**
```typescript
export const PLAYER_ARCHETYPES = {
  MUSA: {
    korean: "무사",
    english: "Traditional Warrior",
    hanja: "武士",
    philosophy: "Honor through disciplined strength",
    combatStyle: "Balanced offense and defense",
    preferredStances: ["GEON", "GAN"],
  },
  AMSALJA: {
    korean: "암살자",
    english: "Shadow Assassin",
    hanja: "暗殺者",
    philosophy: "Precision through stealth",
    combatStyle: "Vital point targeting, critical strikes",
    preferredStances: ["LI", "SON"],
  },
  HACKER: {
    korean: "해커",
    english: "Cyber Warrior",
    hanja: "駭客",
    philosophy: "Technology-enhanced combat",
    combatStyle: "Analytical, exploit-focused",
    preferredStances: ["JIN", "GAM"],
  },
  JEONGBO_YOWON: {
    korean: "정보요원",
    english: "Intelligence Operative",
    hanja: "情報要員",
    philosophy: "Strategic analysis and adaptation",
    combatStyle: "Adaptive, counter-focused",
    preferredStances: ["GAM", "TAE"],
  },
  JOJIK_POKRYEOKBAE: {
    korean: "조직폭력배",
    english: "Organized Crime",
    hanja: "組織暴力輩",
    philosophy: "Ruthless pragmatism",
    combatStyle: "Aggressive, power-focused",
    preferredStances: ["GEON", "GON"],
  },
} as const;
```

### 6. Korean Martial Arts Terminology Accuracy

**ALWAYS use authentic Korean martial arts terms:**

✅ **Combat Terminology**
```typescript
export const COMBAT_TERMS = {
  // Strikes (타격 기술)
  STRIKE: { korean: "타격", english: "Strike", hanja: "打擊" },
  PUNCH: { korean: "주먹", english: "Fist", hanja: "拳" },
  KICK: { korean: "차기", english: "Kick", hanja: "蹴" },
  
  // Defense (방어 기술)
  BLOCK: { korean: "막기", english: "Block", hanja: "防禦" },
  DODGE: { korean: "회피", english: "Dodge", hanja: "回避" },
  COUNTER: { korean: "반격", english: "Counter", hanja: "反擊" },
  
  // Vital Points (급소)
  VITAL_POINT: { korean: "급소", english: "Vital Point", hanja: "急所" },
  PRESSURE_POINT: { korean: "경혈", english: "Acupoint", hanja: "經穴" },
  
  // Stances (자세)
  STANCE: { korean: "자세", english: "Stance", hanja: "姿勢" },
  READY_POSITION: { korean: "준비자세", english: "Ready Position" },
  
  // Energy (기)
  KI: { korean: "기", english: "Ki Energy", hanja: "氣" },
  FOCUS: { korean: "집중", english: "Focus", hanja: "集中" },
  
  // Techniques (기술)
  TECHNIQUE: { korean: "기술", english: "Technique", hanja: "技術" },
  SPECIAL_MOVE: { korean: "필살기", english: "Special Move", hanja: "必殺技" },
} as const;
```

### 7. Common Theming Anti-Patterns to REJECT

**Immediately flag and reject these patterns:**

❌ **Hard-coded Colors Instead of Constants**
```typescript
// BAD: Hard-coded hex color
<div style={{ color: '#00ffff' }}>Text</div>

// GOOD: Use KOREAN_COLORS constant
<div style={{ color: `#${KOREAN_COLORS.PRIMARY_CYAN.toString(16)}` }}>
  Text
</div>
```

❌ **English-Only Text**
```typescript
// BAD: Missing Korean translation
<button>Attack</button>

// GOOD: Bilingual text
<button>공격 | Attack</button>
```

❌ **Generic Font Families**
```typescript
// BAD: Generic sans-serif without Korean support
<div style={{ fontFamily: 'Arial, sans-serif' }}>한글</div>

// GOOD: Use FONT_FAMILY.KOREAN
<div style={{ fontFamily: FONT_FAMILY.KOREAN }}>한글</div>
```

❌ **Incorrect Trigram Names**
```typescript
// BAD: Wrong Korean spelling or English translation
const stance = { korean: "건", english: "Sky" }; // Wrong!

// GOOD: Authentic I Ching terminology
const stance = { 
  symbol: "☰",
  korean: "건", 
  english: "Heaven",
  hanja: "乾"
};
```

❌ **Missing Cultural Context**
```typescript
// BAD: No philosophy or cultural meaning
const technique = { name: "Thunder Strike" };

// GOOD: Include Korean philosophy
const technique = {
  nameKorean: "천둥벽력",
  nameEnglish: "Thunder Wall Strike",
  philosophy: "Embodies sudden explosive power like thunder from heaven",
  iChingReference: "☰ Geon (Heaven) - Creative force",
};
```

❌ **Non-WCAG Compliant Colors**
```typescript
// BAD: Low contrast text on dark background
<div style={{ 
  background: '#1a1a1a', 
  color: '#444444' // Only 2.6:1 contrast - fails WCAG AA
}}>
  Text
</div>

// GOOD: WCAG AA compliant colors
<div style={{ 
  background: `#${KOREAN_COLORS.UI_BACKGROUND_DARK.toString(16)}`,
  color: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16)}` // 20.3:1 contrast
}}>
  Text
</div>
```

### 8. Required Theming Patterns

**Enforce these Korean theming patterns:**

✅ **Three.js Material with Korean Colors**
```typescript
import { KOREAN_COLORS } from '@/types/constants/colors';
import * as THREE from 'three';

// GOOD: Korean-themed material for 3D objects
const koreanMaterial = new THREE.MeshStandardMaterial({
  color: KOREAN_COLORS.PRIMARY_CYAN,
  emissive: KOREAN_COLORS.ACCENT_GOLD,
  emissiveIntensity: 0.2,
  metalness: 0.5,
  roughness: 0.5,
});

// Apply to mesh
<mesh material={koreanMaterial}>
  <boxGeometry args={[1, 1, 1]} />
</mesh>
```

✅ **Stance Aura Effect with Trigram Colors**
```typescript
export const StanceAura3D: React.FC<{ stance: TrigramStance }> = ({ stance }) => {
  const stanceData = TRIGRAM_STANCES[stance];
  
  return (
    <pointLight
      position={[0, 1, 0]}
      intensity={0.8}
      distance={5}
      decay={2}
      color={stanceData.color}
    />
  );
};
```

✅ **Bilingual Combat HUD**
```typescript
export const CombatHUD: React.FC = () => {
  return (
    <Html fullscreen>
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        fontFamily: FONT_FAMILY.KOREAN,
        color: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16)}`,
      }}>
        <div>
          {stance.korean} | {stance.english}
        </div>
        <div style={{ color: `#${KOREAN_COLORS.TEXT_ACCENT.toString(16)}` }}>
          {`${stance.symbol} ${stance.hanja}`}
        </div>
      </div>
    </Html>
  );
};
```

✅ **Vital Point Overlay with Korean Names**
```typescript
export const VitalPointMarker: React.FC<{ point: VitalPoint }> = ({ point }) => {
  return (
    <Html position={point.location} center>
      <div style={{
        fontFamily: FONT_FAMILY.KOREAN,
        fontSize: 12,
        color: `#${KOREAN_COLORS.VITAL_POINT_HIT.toString(16)}`,
        background: `#${KOREAN_COLORS.UI_BACKGROUND_DARK.toString(16)}cc`,
        padding: '4px 8px',
        borderRadius: '4px',
        border: `1px solid #${KOREAN_COLORS.ACCENT_PURPLE.toString(16)}`,
      }}>
        <div>{point.nameKorean} | {point.nameEnglish}</div>
        <div style={{ fontSize: 10 }}>{point.nameTCM}</div>
      </div>
    </Html>
  );
};
```

## Enforcement Rules

### Rule 1: All Colors Must Use KOREAN_COLORS Constants

```
IF (color value is hard-coded in hex or RGB)
THEN (replace with KOREAN_COLORS constant)
ELSE (reject the change)
```

### Rule 2: All User-Facing Text Must Be Bilingual

```
IF (text is displayed to user)
THEN (include both Korean AND English with " | " separator)
ELSE (add bilingual support before approval)
```

### Rule 3: Korean Text Must Use FONT_FAMILY.KOREAN

```
IF (Korean characters are displayed)
THEN (apply FONT_FAMILY.KOREAN to ensure proper rendering)
ELSE (add font family before approval)
```

### Rule 4: Trigram Stances Must Use Authentic I Ching Symbols

```
IF (trigram stance added or modified)
THEN (use correct ☰☱☲☳☴☵☶☷ symbols AND Korean/English/Hanja names)
ELSE (correct symbols and terminology)
```

### Rule 5: Combat Terms Must Use Authentic Korean Martial Arts Vocabulary

```
IF (combat technique or term added)
THEN (verify authenticity with Korean martial arts sources)
ELSE (research correct terminology before approval)
```

### Rule 6: WCAG 2.1 Level AA Compliance Required

```
IF (text or UI element added)
THEN (verify 4.5:1 contrast ratio for text, 3:1 for UI components)
ELSE (adjust colors to meet WCAG AA standards)
```

## Cultural Authenticity Checklist

**Before approving any Korean-themed change:**

- [ ] **Colors**: Uses KOREAN_COLORS constants exclusively
- [ ] **Bilingual Text**: Korean | English format with proper spacing
- [ ] **Fonts**: FONT_FAMILY.KOREAN for Korean characters
- [ ] **Trigrams**: Authentic I Ching symbols (☰☱☲☳☴☵☶☷) with correct names
- [ ] **Martial Arts Terms**: Verified Korean martial arts terminology
- [ ] **Philosophy**: I Ching philosophy properly referenced
- [ ] **Hanja**: Sino-Korean characters (한자) included where appropriate
- [ ] **WCAG Compliance**: Text meets 4.5:1 contrast ratio
- [ ] **Cultural Context**: Korean cultural meaning explained
- [ ] **Respect**: Traditional martial arts treated with respect

## ISO 27001 Alignment

This skill enforces controls from:

- **A.7.2** - Information Classification (Korean cultural information properly categorized)
- **A.8.1** - Inventory of Assets (Korean assets cataloged)
- **A.12.1** - Operational Procedures (Korean theming standards documented)
- **A.18.1** - Compliance with Legal Requirements (Cultural authenticity and respect)

## NIST CSF 2.0 Alignment

- **GV.OC-02**: Internal stakeholders understand Korean cultural requirements
- **GV.PO-01**: Korean theming policy established and communicated
- **ID.AM-02**: Korean cultural assets inventoried
- **PR.DS-06**: Integrity of Korean cultural information maintained

## CIS Controls v8.1 Alignment

- **Control 1**: Inventory of Korean theming assets
- **Control 2**: Korean software assets (fonts, constants) inventoried
- **Control 14**: Korean cultural awareness in development

## Korean Philosophy Integration

### 흑괘의 미학 (Black Trigram Aesthetics)

**Core Aesthetic Principles:**

1. **음양 조화 (Yin-Yang Harmony)** - Balance dark backgrounds with bright neon accents
2. **오방색 (Five Cardinal Colors)** - Use traditional Korean colors for cultural authenticity
3. **사이버펑크 융합 (Cyberpunk Fusion)** - Merge traditional Korean aesthetics with futuristic cyberpunk
4. **명료함 (Clarity)** - Ensure high contrast for readability (WCAG AA)
5. **존중 (Respect)** - Honor traditional Korean martial arts philosophy

### Traditional Korean Color Philosophy

**오방색 (Five Cardinal Colors) - Based on I Ching:**

- **청색 (Blue/Green)** - East, Spring, Wood element - Growth and vitality
- **백색 (White)** - West, Autumn, Metal element - Purity and righteousness
- **적색 (Red)** - South, Summer, Fire element - Passion and energy
- **흑색 (Black)** - North, Winter, Water element - Depth and wisdom
- **황색 (Yellow)** - Center, Earth element - Balance and stability

**Application in Black Trigram:**
- Use these colors for trigram stance indicators
- Apply to UI elements representing cardinal directions
- Integrate into particle effects and visual feedback

## Remember

**Korean theming is not decoration—it is the soul of Black Trigram. Every color, every word, every symbol must honor Korean martial arts tradition while embracing cyberpunk innovation.**

When implementing Korean theming:
1. **RESEARCH** - Verify authentic Korean terminology
2. **CONSTANTS** - Always use KOREAN_COLORS and FONT_FAMILY
3. **BILINGUAL** - Include Korean and English for all text
4. **PHILOSOPHY** - Reference I Ching and Korean martial arts concepts
5. **RESPECT** - Treat Korean culture with authenticity and honor
6. **ACCESSIBILITY** - Ensure WCAG 2.1 Level AA compliance

**흑괘의 미학을 지켜라** - _Protect the Aesthetics of the Black Trigram_
