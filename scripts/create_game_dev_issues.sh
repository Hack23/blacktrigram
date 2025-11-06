#!/bin/bash
# Script to create 5 game development issues for Black Trigram
# Requires: gh CLI installed and authenticated
# Usage: ./create_game_dev_issues.sh

set -e

REPO="Hack23/blacktrigram"
TEMPLATE_DIR=".github/ISSUE_TEMPLATE"

echo "🎮 Creating 5 Game Development Issues for Black Trigram"
echo "Repository: $REPO"
echo ""

# Function to extract body from markdown template
extract_body() {
    local file=$1
    # Remove YAML frontmatter (lines between ---) and extract body
    sed '/^---$/,/^---$/d' "$file"
}

# Issue 1: Animation System
echo "Creating Issue 1: 🎬 Animation System Integration..."
ISSUE1=$(gh issue create \
  --repo "$REPO" \
  --title "🎬 Implement Player Animation System with Spritesheet Integration" \
  --body "$(extract_body $TEMPLATE_DIR/issue_1_animation_system.md)" \
  --label "game-development,animation,high-priority,PixiJS" \
  2>&1) || echo "Failed to create Issue 1"

echo "$ISSUE1"
echo ""

# Issue 2: Technique Catalog
echo "Creating Issue 2: ⚔️ Technique Catalog UI..."
ISSUE2=$(gh issue create \
  --repo "$REPO" \
  --title "⚔️ Build Technique Catalog UI with Real Combat Data" \
  --body "$(extract_body $TEMPLATE_DIR/issue_2_technique_catalog.md)" \
  --label "game-development,ui,high-priority,combat" \
  2>&1) || echo "Failed to create Issue 2"

echo "$ISSUE2"
echo ""

# Issue 3: Combat Feedback
echo "Creating Issue 3: ✨ Combat Feedback Enhancement..."
ISSUE3=$(gh issue create \
  --repo "$REPO" \
  --title "✨ Enhance Combat Feedback with Synchronized Effects" \
  --body "$(extract_body $TEMPLATE_DIR/issue_3_combat_feedback.md)" \
  --label "game-development,effects,high-priority,audio" \
  2>&1) || echo "Failed to create Issue 3"

echo "$ISSUE3"
echo ""

# Issue 4: AI System
echo "Creating Issue 4: 🤖 AI Behavior System..."
ISSUE4=$(gh issue create \
  --repo "$REPO" \
  --title "🤖 Develop AI Opponent Behavior System" \
  --body "$(extract_body $TEMPLATE_DIR/issue_4_ai_system.md)" \
  --label "game-development,ai,high-priority,gameplay" \
  2>&1) || echo "Failed to create Issue 4"

echo "$ISSUE4"
echo ""

# Issue 5: Telemetry & Stats
echo "Creating Issue 5: 📊 Telemetry & Stats Integration..."
ISSUE5=$(gh issue create \
  --repo "$REPO" \
  --title "📊 Integrate Combat Telemetry and EndScreen Stats" \
  --body "$(extract_body $TEMPLATE_DIR/issue_5_telemetry_stats.md)" \
  --label "game-development,ui,high-priority,telemetry" \
  2>&1) || echo "Failed to create Issue 5"

echo "$ISSUE5"
echo ""

echo "✅ Issue creation complete!"
echo ""
echo "All issues have been created with:"
echo "  - Detailed objectives and context"
echo "  - Clear acceptance criteria"
echo "  - Technical specifications"
echo "  - Reference files"
echo "  - Korean theming requirements"
echo "  - Estimated effort: 14-18 days total"
echo ""
echo "Ready for game developer agent assignment!"
