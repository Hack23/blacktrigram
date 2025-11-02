#!/bin/bash

# Validate GitHub Copilot Setup for Black Trigram
# This script validates the custom copilot instructions and agent files

set -e

echo "🔍 Validating GitHub Copilot Setup for Black Trigram..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to report error
error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
    ERRORS=$((ERRORS + 1))
}

# Function to report warning
warning() {
    echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

# Function to report success
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

echo "1. Checking copilot-instructions.md..."
if [ ! -f ".github/copilot-instructions.md" ]; then
    error "Missing .github/copilot-instructions.md"
else
    success "Found .github/copilot-instructions.md"
    
    # Check for unmatched code blocks
    CODE_BLOCKS=$(grep -c '^```' .github/copilot-instructions.md || echo "0")
    if [ $((CODE_BLOCKS % 2)) -ne 0 ]; then
        error "Unmatched code blocks in copilot-instructions.md (found $CODE_BLOCKS backticks)"
    else
        success "All code blocks properly matched in copilot-instructions.md ($((CODE_BLOCKS / 2)) blocks)"
    fi
    
    # Check for Korean text encoding
    if grep -q $'\xef\xbb\xbf' .github/copilot-instructions.md; then
        warning "BOM (Byte Order Mark) found in copilot-instructions.md"
    fi
fi

echo ""
echo "2. Checking agent files..."
AGENT_DIR=".github/agents"
if [ ! -d "$AGENT_DIR" ]; then
    error "Missing $AGENT_DIR directory"
else
    success "Found $AGENT_DIR directory"
    
    AGENT_COUNT=$(find "$AGENT_DIR" -name "*.md" -type f | wc -l)
    echo "   Found $AGENT_COUNT agent files"
    
    # Validate each agent file
    for agent in "$AGENT_DIR"/*.md; do
        if [ -f "$agent" ]; then
            FILENAME=$(basename "$agent")
            CODE_BLOCKS=$(grep -c '^```' "$agent" || echo "0")
            
            if [ $((CODE_BLOCKS % 2)) -ne 0 ]; then
                error "Unmatched code blocks in $FILENAME"
            else
                success "  $FILENAME: $((CODE_BLOCKS / 2)) code blocks"
            fi
        fi
    done
fi

echo ""
echo "3. Checking referenced files exist..."

# Check if referenced test files exist
if [ -f "src/test/setup.ts" ]; then
    success "src/test/setup.ts exists"
else
    error "src/test/setup.ts not found"
fi

if [ -f "src/test/test-utils.ts" ]; then
    success "src/test/test-utils.ts exists"
else
    error "src/test/test-utils.ts not found"
fi

# Check for audio test files
if ls src/audio/*.test.ts 1> /dev/null 2>&1; then
    success "Audio test files found"
else
    warning "No audio test files found"
fi

echo ""
echo "4. Checking TypeScript constants..."

# Check if KOREAN_COLORS is exported
if grep -q "export.*KOREAN_COLORS" src/types/constants/index.ts; then
    success "KOREAN_COLORS is exported"
else
    error "KOREAN_COLORS not found in exports"
fi

# Check if FONT_FAMILY is exported
if grep -q "FONT_FAMILY" src/types/constants/index.ts; then
    success "FONT_FAMILY is exported"
else
    error "FONT_FAMILY not found in exports"
fi

echo ""
echo "5. Checking component structure..."

# Check if main directories exist
for dir in src/components/combat src/components/intro src/components/training src/components/screens src/components/ui; do
    if [ -d "$dir" ]; then
        success "$(basename $dir) directory exists"
    else
        warning "$(basename $dir) directory not found"
    fi
done

echo ""
echo "6. Validating PixiJS extensions..."

if [ -f "src/utils/pixiExtensions.ts" ]; then
    success "pixiExtensions.ts exists"
    
    if grep -q "extendPixiComponents" src/utils/pixiExtensions.ts; then
        success "extendPixiComponents function found"
    else
        error "extendPixiComponents function not found"
    fi
else
    error "src/utils/pixiExtensions.ts not found"
fi

echo ""
echo "7. Checking audio system..."

if [ -f "src/audio/AudioProvider.tsx" ]; then
    success "AudioProvider.tsx exists"
    
    if grep -q "useAudio" src/audio/AudioProvider.tsx; then
        success "useAudio hook found"
    else
        error "useAudio hook not found"
    fi
else
    error "src/audio/AudioProvider.tsx not found"
fi

echo ""
echo "═══════════════════════════════════════════════"
echo "Validation Summary:"
echo "═══════════════════════════════════════════════"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Validation completed with $WARNINGS warning(s)${NC}"
    exit 0
else
    echo -e "${RED}❌ Validation failed with $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    exit 1
fi
