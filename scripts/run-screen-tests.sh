#!/bin/bash

# Screen-Specific E2E Test Runner with Timing
# Usage: ./scripts/run-screen-tests.sh [screen-name]
# If no screen name provided, runs all screens

# Note: Don't use set -e to ensure all screens are tested even if one fails

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}⏱️  Screen-Specific E2E Test Runner${NC}"
echo "===================================="
echo ""

# Array of screen tests
SCREENS=("intro" "combat" "training" "controls" "philosophy")

# If a screen name is provided, run only that screen
if [ $# -eq 1 ]; then
    SCREENS=("$1")
    echo -e "${BLUE}Running single screen test: $1${NC}"
else
    echo -e "${BLUE}Running all screen tests${NC}"
fi

echo ""

# Track timing and failures
declare -A screen_durations
FAILED_SCREENS=""
TOTAL_START=$(date +%s)

# Run each screen test
for screen in "${SCREENS[@]}"; do
    echo ""
    echo -e "${BLUE}📋 Testing ${screen}-screen...${NC}"
    START=$(date +%s)
    
    # Run the test and capture exit code
    HEADLESS_FLAG=""
    if [ "$HEADLESS" = "true" ]; then
        HEADLESS_FLAG="--headless"
    fi
    if npx cypress run --spec "cypress/e2e/screens/${screen}-screen.cy.ts" --browser "${BROWSER:-chrome}" $HEADLESS_FLAG; then
        STATUS="${GREEN}✅ PASSED${NC}"
    else
        STATUS="${RED}❌ FAILED${NC}"
        FAILED_SCREENS="${FAILED_SCREENS} ${screen}"
    fi
    
    END=$(date +%s)
    DURATION=$((END - START))
    screen_durations["$screen"]=$DURATION
    
    echo ""
    echo -e "⏱️  ${screen}-screen: ${DURATION}s - $STATUS"
    
    # Check against target (3-4 min = 180-240s)
    if [ $DURATION -le 240 ]; then
        echo -e "${GREEN}✅ ${screen}-screen within 4-minute target${NC}"
    else
        echo -e "${YELLOW}⚠️  ${screen}-screen exceeded 4-minute target: ${DURATION}s${NC}"
    fi
done

# Calculate total time
TOTAL_END=$(date +%s)
TOTAL_DURATION=$((TOTAL_END - TOTAL_START))
TOTAL_MINUTES=$((TOTAL_DURATION / 60))
TOTAL_SECONDS=$((TOTAL_DURATION % 60))

# Print summary
echo ""
echo -e "${BLUE}📊 Screen-Specific E2E Test Summary${NC}"
echo "===================================="
for screen in "${SCREENS[@]}"; do
    DURATION=${screen_durations[$screen]}
    MINUTES=$((DURATION / 60))
    SECONDS=$((DURATION % 60))
    echo -e "${screen}-screen: ${DURATION}s (${MINUTES}m ${SECONDS}s)"
done

echo ""
echo -e "Total Duration: ${TOTAL_DURATION}s (${TOTAL_MINUTES}m ${TOTAL_SECONDS}s)"
echo "Target: 900-1200s (15-20 minutes)"

if [ $TOTAL_DURATION -le 1200 ]; then
    echo -e "${GREEN}✅ Within 20-minute target${NC}"
elif [ $TOTAL_DURATION -le 1800 ]; then
    echo -e "${YELLOW}⚠️  Exceeded 20-minute target but within baseline (20-30 minutes)${NC}"
else
    echo -e "${RED}❌ Exceeded baseline (>30 minutes)${NC}"
fi

echo ""
echo -e "${GREEN}✅ Screen test execution complete${NC}"

# Exit with failure if any screen tests failed
if [ -n "$FAILED_SCREENS" ]; then
    echo ""
    echo -e "${RED}❌ Failed screens:$FAILED_SCREENS${NC}"
    exit 1
fi
