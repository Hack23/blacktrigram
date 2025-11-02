# Maintaining GitHub Copilot Setup

This document explains how to maintain and validate the custom GitHub Copilot setup for Black Trigram.

## Overview

The Black Trigram project uses custom GitHub Copilot instructions to ensure consistent code quality, Korean theming, and adherence to project patterns. The setup consists of:

- **Main Instructions**: `.github/copilot-instructions.md` - Comprehensive coding guidelines
- **Specialized Agents**: `.github/agents/*.md` - Domain-specific agent instructions (11 agents)
- **Validation Script**: `scripts/validate-copilot-setup.sh` - Automated validation

## Validation Script

### Running the Validation

```bash
# Make script executable (first time only)
chmod +x scripts/validate-copilot-setup.sh

# Run validation
./scripts/validate-copilot-setup.sh
```

### What It Checks

1. **Markdown Syntax**
   - Verifies all code blocks are properly matched (opening and closing ```)
   - Checks for encoding issues with Korean characters
   - Validates all agent files

2. **File References**
   - Ensures all referenced files exist in the codebase
   - Validates test infrastructure files
   - Checks component directory structure

3. **TypeScript Exports**
   - Verifies KOREAN_COLORS is properly exported
   - Checks FONT_FAMILY availability
   - Validates constant exports

4. **Code Structure**
   - Confirms component directories exist
   - Validates PixiJS extensions
   - Checks audio system setup

## Common Issues and Fixes

### Unmatched Code Blocks

**Problem**: Code examples using wrong number of backticks (e.g., ```````` instead of ```)

**Fix**:
```bash
# Check for issues
awk '/^```/ {count++} END {if (count%2 != 0) print "UNMATCHED"}' .github/copilot-instructions.md

# Each code block should have exactly 3 backticks
```

**Example**:
```markdown
❌ Wrong:
````jsx
const example = "code";
````

✅ Correct:
```jsx
const example = "code";
```
```

### Outdated File Structure

**Problem**: Documentation refers to files/directories that don't exist

**Fix**: Update the file structure section to match reality:
```bash
# Check actual structure
tree -L 3 src/components

# Update .github/copilot-instructions.md to match
```

### Missing Exports

**Problem**: Code examples import constants that aren't exported

**Fix**: Verify exports in `src/types/constants/index.ts`:
```typescript
// Ensure these are exported
export { KOREAN_COLORS } from "./colors";
export { FONT_FAMILY } from "./typography";
```

## Updating Copilot Instructions

### When to Update

Update copilot instructions when:
- Adding new architectural patterns
- Introducing new libraries or frameworks
- Changing component structure
- Adding new Korean cultural elements
- Updating testing patterns

### Update Process

1. **Edit Instructions**
   ```bash
   # Edit main instructions
   vi .github/copilot-instructions.md
   
   # Or edit specific agent
   vi .github/agents/coding-agent.md
   ```

2. **Validate Changes**
   ```bash
   # Run validation
   ./scripts/validate-copilot-setup.sh
   
   # Check tests still pass
   npm run test
   ```

3. **Test Code Examples**
   ```bash
   # Ensure TypeScript compiles
   npm run check
   
   # Ensure linting passes
   npm run lint
   ```

4. **Commit Changes**
   ```bash
   git add .github/
   git commit -m "Update copilot instructions: [description]"
   ```

## Agent Files

### Available Agents

1. **coding-agent.md** - TypeScript/React/PixiJS development
2. **frontend-specialist.md** - React 19 + Strict TypeScript
3. **game-developer.md** - PixiJS 8.x + Game systems
4. **testing-agent.md** - Vitest & Cypress testing
5. **test-engineer.md** - Comprehensive test strategies
6. **documentation-agent.md** - Technical documentation
7. **documentation-writer.md** - Technical docs + security
8. **code-review-agent.md** - Code quality & standards
9. **security-performance-agent.md** - Security & optimization
10. **security-specialist.md** - Supply chain + compliance
11. **README.md** - Agent overview and usage

### Agent File Structure

Each agent file should include:

```markdown
# Agent Name

## Specialization
Clear description of domain expertise

## When to Use
Specific scenarios where this agent helps

## Key Responsibilities
- Bullet points of main duties
- Specific patterns to follow

## Code Examples
```language
// Working examples
```

## Anti-Patterns
- Things to avoid
- Common mistakes

## Checklists
- [ ] Validation items
```

## Korean Theming Validation

### Required Elements

All code examples should demonstrate:

1. **Korean Colors**: Use of KOREAN_COLORS constants
2. **Bilingual Text**: Korean | English format
3. **Cultural Context**: Proper Korean martial arts terminology
4. **Typography**: Korean font families

### Example Validation

```typescript
// ✅ Correct - Uses Korean theming
import { KOREAN_COLORS, FONT_FAMILY } from "../../types/constants";

<pixiText
  text={`건 | Geon`}
  style={{
    fill: KOREAN_COLORS.ACCENT_GOLD,
    fontFamily: FONT_FAMILY.KOREAN,
  }}
/>

// ❌ Wrong - No Korean theming
<pixiText
  text="Geon"
  style={{
    fill: 0xffffff,
    fontFamily: "Arial",
  }}
/>
```

## CI/CD Integration

### Adding to GitHub Actions

Create `.github/workflows/validate-copilot.yml`:

```yaml
name: Validate Copilot Setup

on:
  pull_request:
    paths:
      - '.github/copilot-instructions.md'
      - '.github/agents/**'
  push:
    branches:
      - main

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate Copilot Setup
        run: ./scripts/validate-copilot-setup.sh
```

## Best Practices

### Documentation

1. **Keep Examples Current**: Ensure code examples match actual codebase patterns
2. **Test Examples**: All TypeScript examples should compile
3. **Use Real Paths**: Reference actual files that exist in the project
4. **Update Regularly**: Review and update monthly

### Code Blocks

1. **Use 3 Backticks**: Always use ``` for code blocks
2. **Specify Language**: Use ```typescript, ```jsx, etc.
3. **Complete Examples**: Provide full working examples
4. **Match Style**: Follow existing code style

### Korean Content

1. **Proper Encoding**: Use UTF-8 encoding
2. **Test Rendering**: Verify Korean text displays correctly
3. **Bilingual Format**: Use "한글 | English" pattern
4. **Cultural Accuracy**: Consult Korean martial arts resources

## Troubleshooting

### Script Fails to Run

```bash
# Ensure script is executable
chmod +x scripts/validate-copilot-setup.sh

# Check for line ending issues (Windows)
dos2unix scripts/validate-copilot-setup.sh
```

### False Positive Errors

```bash
# Check exact error message
./scripts/validate-copilot-setup.sh 2>&1 | grep "ERROR"

# Validate manually
grep -c '^```' .github/copilot-instructions.md
```

### Korean Text Not Displaying

```bash
# Check file encoding
file .github/copilot-instructions.md

# Should show: UTF-8 Unicode text
```

## Resources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Markdown Guide](https://www.markdownguide.org/)
- [Black Trigram Architecture](../ARCHITECTURE.md)
- [Korean Martial Arts Reference](../game-design.md)

## Support

For issues with copilot setup:

1. Run validation script: `./scripts/validate-copilot-setup.sh`
2. Check this documentation
3. Review recent changes to copilot instructions
4. Open an issue with validation output

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
