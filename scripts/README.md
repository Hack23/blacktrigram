# Scripts Directory

This directory contains utility scripts for the Black Trigram (흑괘) project.

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
