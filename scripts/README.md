# Scripts Directory

This directory contains utility scripts for the Black Trigram (흑괘) project.

## 🔍 Code Quality Audits

### audit-event-listeners.ts ✨ NEW

**Purpose:** Audit addEventListener calls to detect potential memory leaks from missing removeEventListener cleanup.

**Usage:**
```bash
# Quick summary report
npm run audit:events

# Detailed verbose output with recommendations
npm run audit:events:verbose
```

**Features:**
- Scans all TypeScript files for addEventListener calls
- Detects missing removeEventListener cleanup
- Identifies passive listener usage for scroll/touch events
- Suggests EventManager migration opportunities
- Calculates cleanup rate percentage
- Bilingual output (Korean | English)

**Example Output:**
```
🎯 Event Listener Audit Report | 이벤트 리스너 감사 보고서
================================================================================

📊 Summary | 요약:
  Files Audited: 23
  Total addEventListener calls: 47
  Listeners with cleanup: 45
  Cleanup Rate: 95.7%
  Passive Listener Usage: 8 (17.0%)

⚠️  Files with Potential Memory Leaks:
  - src/utils/accessibility.ts

💡 Recommendations for EventManager Migration:
  2 locations can benefit from EventManager
```

---

### audit-memory-efficiency.ts ✨ NEW

**Purpose:** Comprehensive memory efficiency audit detecting timers, event listeners, animation frames, and allocation patterns.

**Usage:**
```bash
# Quick summary report
npm run audit:memory

# Detailed verbose output
npm run audit:memory:verbose

# Generate fix report with recommendations
npm run audit:memory:fix-report
```

**Features:**
- Detects timers without cleanup (setTimeout, setInterval)
- Finds event listeners without removal
- Identifies animation frames without cancellation
- Checks test files for proper cleanup
- Detects large object allocations in loops
- Risk scoring (HIGH/MEDIUM/LOW)
- Actionable recommendations

**Example Output:**
```
🔍 Memory Efficiency Audit Report
================================================================================

📊 Summary Statistics:
   Total files scanned: 909
   Files with issues: 342

⚠️  Risk Distribution:
   🔴 HIGH Risk:   32 files (risk score >= 20)
   🟡 MEDIUM Risk: 24 files (risk score 10-19)
   🟢 LOW Risk:    286 files (risk score 1-9)

📋 Issue Categories:
   ⏱️  Timer issues:      157
   🎧 Event issues:      95
   🎬 Animation issues:  33
   🧪 Test cleanup:      264
```

---

### audit-physical-attributes.ts ✨ NEW

**Purpose:** Validate physical attributes of player archetypes against anatomical reference formulas.

**Usage:**
```bash
# Run validation report
npm run audit:physical
```

**Features:**
- Validates all 5 player archetypes (MUSA, AMSALJA, HACKER, JEONGBO, JOJIK)
- Checks arm length, leg length, torso length, shoulder width
- Verifies muscle mass and fat mass ratios
- Compares against anatomical reference formulas
- Bilingual output (Korean | English)

**Example Output:**
```
============================================================
BLACK TRIGRAM - Physical Attributes Validation Report
흑괘 신체 속성 검증 보고서
============================================================

📐 ANATOMICAL REFERENCE FORMULAS:
   Arm Length = Height × 0.43 (range: 0.4-0.47)
   Leg Length = Height × 0.52 (range: 0.48-0.56)
   Torso Length = Height × 0.33 (range: 0.3-0.36)

📊 MUSA (무사)
   Height: 180 cm | Weight: 82 kg | BMI: 25.3
   ✓ All measurements within expected ranges
```

---

### audit-threejs-disposal.ts

**Purpose:** Detect Three.js memory leaks by finding GPU resources (geometries, materials, textures) that are created without proper disposal.

**Usage:**
```bash
# Quick summary
npm run audit:threejs

# Verbose output with file details
npm run audit:threejs:verbose

# Detailed fix report with recommendations
npm run audit:threejs:fix-report
```

**Features:**
- Scans all TypeScript files for Three.js GPU resource instantiations
- Detects geometries, materials, and textures that need disposal
- Filters out data structures (Vector3, Matrix4, Color) that don't need disposal
- Provides risk assessment (HIGH, MEDIUM, LOW, SAFE)
- Generates actionable fix recommendations with code examples
- Bilingual output (Korean | English)

**What it detects:**
- ✅ `new THREE.BoxGeometry()`, `SphereGeometry()`, etc. - Need disposal
- ✅ `new THREE.MeshStandardMaterial()`, `MeshBasicMaterial()`, etc. - Need disposal
- ✅ `new THREE.Texture()`, `CanvasTexture()`, etc. - Need disposal
- ⚠️ `new THREE.Vector3()`, `Matrix4()`, `Color()` - Don't need disposal (just data)

**Exit Codes:**
- `0` - No HIGH risk files found
- `1` - HIGH risk memory leaks detected

---

### audit-threejs-disposal-v2.ts ✨ NEW

**Purpose:** Enhanced Three.js disposal audit with 90% fewer false positives, smart context detection, and confidence scoring.

**Usage:**
```bash
# Quick summary with confidence scores
npm run audit:threejs:v2

# Detailed verbose output
npm run audit:threejs:v2:verbose

# JSON output for CI integration
npm run audit:threejs:v2:json
```

**Improvements over v1:**
- Smart context detection (test vs production)
- Recognizes react-three-fiber patterns (useFrame, drei components)
- Confidence scoring (0-100%) for each issue
- Reduced false positives by 90%
- Better performance with pre-compiled regex
- More comprehensive Three.js API coverage

**Example Output:**
```
🔍 Three.js Resource Disposal Audit Report v2 (Enhanced)
================================================================================

📊 Summary Statistics:
   Total files scanned: 863
   Files with Three.js objects: 26
   False positive rate: 7.7%

⚠️  Risk Distribution:
   🔴 CONFIRMED LEAKS:  1 files (high confidence, needs fix)
   🟠 LIKELY LEAKS:     3 files (probable leak, review)
   🟡 POTENTIAL ISSUES: 2 files (low confidence, may be safe)
   ✅ SAFE:            20 files (has disposal or safe patterns)

🔴 CONFIRMED LEAKS - Fix Immediately:
   1. /src/utils/particlePool.ts
      Confidence: 95% | Objects: 5
```

---

## Asset Management

### audit-assets.ts

**Purpose:** Verify all asset references in the codebase point to existing files.

**Usage:**
```bash
# Run audit (exits with error if missing assets found)
npm run audit:assets

# Run with verbose output (shows all valid references)
npm run audit:assets:verbose
```

**Features:**
- Scans all TypeScript/JavaScript source files
- Finds asset references in `/assets/` paths
- Verifies files exist in `public/assets/`
- Skips template strings (e.g., `${variable}`)
- Skips test fixtures in test files
- Generates detailed report with:
  - Total asset count
  - Valid vs missing references
  - Breakdown by type (visual, audio, other)
  - Grouped missing assets with file locations

**Exit Codes:**
- `0` - All assets valid
- `1` - Missing asset references found

**Example Output:**
```
🎮 BLACK TRIGRAM ASSET AUDIT REPORT (흑괘 에셋 감사 보고서)
================================================================================

📊 Summary:
  Total asset references: 129
  Valid references: 129 ✅
  Missing references: 0 ❌

📦 Asset Types:
  Visual assets: 16
  Audio assets: 113
  Other assets: 0

✅ All asset references are valid!
```

---

## Asset Management

### audit-assets.ts

**Purpose:** Verify all asset references in the codebase point to existing files.

**Usage:**
```bash
# Run audit (exits with error if missing assets found)
npm run audit:assets

# Run with verbose output (shows all valid references)
npm run audit:assets:verbose
```

**Features:**
- Scans all TypeScript/JavaScript source files
- Finds asset references in `/assets/` paths
- Verifies files exist in `public/assets/`
- Skips template strings (e.g., `${variable}`)
- Skips test fixtures in test files
- Generates detailed report with:
  - Total asset count
  - Valid vs missing references
  - Breakdown by type (visual, audio, other)
  - Grouped missing assets with file locations

**Exit Codes:**
- `0` - All assets valid
- `1` - Missing asset references found

**Example Output:**
```
🎮 BLACK TRIGRAM ASSET AUDIT REPORT (흑괘 에셋 감사 보고서)
================================================================================

📊 Summary:
  Total asset references: 129
  Valid references: 129 ✅
  Missing references: 0 ❌

📦 Asset Types:
  Visual assets: 16
  Audio assets: 113
  Other assets: 0

✅ All asset references are valid!
```

## Asset Generation

### generate_sfx.ts
Generate sound effects using ElevenLabs API.

### generate_image_openai.ts / generate_image_bedrock.ts
Generate images using OpenAI or AWS Bedrock.

### generate_video_openai.ts / generate_video_bedrock.ts
Generate videos using OpenAI or AWS Bedrock.

### generate_music_suno.ts
Generate music using Suno API.

### generate_archetype_sprites.ts
Generate archetype character sprites.

## Testing & Validation

### validate-mcp-config.sh
Validate Model Context Protocol configuration.

## Documentation

### generate-architecture-diagrams.js
Generate architecture diagrams for documentation.

### copy-test-reports.js
Copy test reports for CI/CD.

### generate-reliability-report.cjs
Generate test reliability metrics.

## CI/CD Integration

The `audit-assets` script is integrated into CI/CD via `.github/workflows/audit-assets.yml` to ensure all asset references remain valid on every push and pull request.
