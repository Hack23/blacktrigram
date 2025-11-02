#!/bin/bash
# Validation script for Copilot MCP configuration
# This script validates that all MCP configuration files are present and syntactically correct

set -e

echo "🔍 Validating Copilot MCP Configuration..."

# Check if required files exist
echo "📁 Checking file existence..."
files=(
  ".github/copilot-mcp.json"
  ".github/copilot-setup-steps.yml"
  ".github/COPILOT_MCP_SETUP.md"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file exists"
  else
    echo "  ❌ $file not found"
    exit 1
  fi
done

# Validate JSON syntax
echo ""
echo "🔍 Validating JSON syntax..."
if node -e "require('./.github/copilot-mcp.json')" 2>/dev/null; then
  echo "  ✅ copilot-mcp.json is valid JSON"
else
  echo "  ❌ copilot-mcp.json has invalid JSON syntax"
  exit 1
fi

# Validate YAML syntax (using Python if available)
echo ""
echo "🔍 Validating YAML syntax..."
if command -v python3 &> /dev/null; then
  if python3 -c "import yaml; yaml.safe_load(open('.github/copilot-setup-steps.yml'))" 2>/dev/null; then
    echo "  ✅ copilot-setup-steps.yml is valid YAML"
  else
    echo "  ❌ copilot-setup-steps.yml has invalid YAML syntax"
    exit 1
  fi
else
  echo "  ⚠️  Python3 not available, skipping YAML validation"
fi

# Check for required MCP servers in configuration
echo ""
echo "🔍 Checking MCP server configuration..."
required_servers=("github" "playwright" "filesystem" "sequential-thinking")

for server in "${required_servers[@]}"; do
  if grep -q "\"$server\"" .github/copilot-mcp.json; then
    echo "  ✅ MCP server '$server' configured"
  else
    echo "  ❌ MCP server '$server' not found in configuration"
    exit 1
  fi
done

# Validate documentation links
echo ""
echo "🔍 Checking documentation links..."
if grep -q "COPILOT_MCP_SETUP.md" README.md; then
  echo "  ✅ MCP documentation linked in README.md"
else
  echo "  ⚠️  MCP documentation not linked in README.md"
fi

if grep -q "COPILOT_MCP_SETUP.md" development.md; then
  echo "  ✅ MCP documentation linked in development.md"
else
  echo "  ⚠️  MCP documentation not linked in development.md"
fi

echo ""
echo "✅ All validations passed!"
echo ""
echo "📚 MCP Configuration Summary:"
echo "  - GitHub server: Repository operations"
echo "  - Playwright server: Browser automation"
echo "  - Filesystem server: File operations"
echo "  - Sequential Thinking server: Complex problem solving"
echo ""
echo "For more information, see .github/COPILOT_MCP_SETUP.md"
