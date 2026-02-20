# 🤖 AI Governance Skill

> **Strategic Principle**: AI-powered development must be transparent, accountable, and aligned with organizational policies.

## 🎯 Purpose

Enforce AI governance standards for Black Trigram, ensuring AI-assisted development (GitHub Copilot, coding agents) follows Hack23 ISMS policies for transparency, security, and compliance.

**Reference**: [Hack23 ISMS Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) | [EU AI Act](https://artificialintelligenceact.eu/)

## Enforcement Rules

### Rule 1: AI-Generated Code Review
```
IF (code generated or assisted by AI: Copilot, coding agents)
THEN (review for security vulnerabilities, license compliance, and correctness)
ELSE (AI-generated code may contain vulnerabilities or license issues)
```

### Rule 2: AI Agent Governance
```
IF (using GitHub Copilot coding agents)
THEN (define clear instructions via agents/*.md, enforce skills, limit permissions)
ELSE (ungoverned AI agents may produce non-compliant code)
```

### Rule 3: Data Privacy in AI
```
IF (AI tool processes code or data)
THEN (verify no sensitive data (secrets, PII) is sent to AI services)
ELSE (data leakage through AI service APIs)
```

### Rule 4: AI Output Verification
```
IF (AI generates security-critical code: auth, crypto, input validation)
THEN (mandatory human review AND automated security scanning)
ELSE (AI may generate insecure patterns)
```

### Rule 5: AI Transparency
```
IF (AI significantly contributes to implementation)
THEN (document AI involvement in PR description or commit message)
ELSE (lack of transparency in development process)
```

## Core Patterns

### Agent Governance Structure
```
.github/agents/          → Agent definitions with frontmatter
.github/skills/          → Skill enforcement rules
.github/copilot-instructions.md → Global AI instructions
.github/copilot-mcp.json → MCP server configuration
```

### Agent Size Limits
```
IF (agent .md file)
THEN (must be < 30,000 characters)
ELSE (agent will not load properly)
```

### AI Code Review Checklist
```
□ No hardcoded secrets or credentials
□ Input validation present for all user inputs
□ Error handling follows project patterns
□ Types are strict (no 'any')
□ Tests are comprehensive and meaningful
□ Korean theming applied correctly
□ Performance considerations addressed
□ License-compatible with project
```

## EU AI Act Alignment

| Requirement | Implementation |
|-------------|---------------|
| Transparency | AI contributions documented in PRs |
| Human oversight | Human review required for all AI PRs |
| Risk management | Security scanning of AI-generated code |
| Data governance | No PII/secrets sent to AI services |
| Technical documentation | Agent and skill documentation maintained |

## GitHub Copilot Governance

### Allowed Uses
- ✅ Code completion and suggestions
- ✅ Test generation
- ✅ Documentation writing
- ✅ Code review assistance
- ✅ Issue analysis and triage

### Required Controls
- ✅ All AI PRs require human approval
- ✅ Security scanning (CodeQL) on all AI code
- ✅ License compliance verification
- ✅ Agent instructions within character limits
- ✅ Skill enforcement rules applied

## Testing Requirements

- ✅ AI-generated code passes all existing tests
- ✅ Security scanning clean (CodeQL, npm audit)
- ✅ No license violations in AI suggestions
- ✅ Agent files within size limits
- ✅ Skills properly enforce rules

## Compliance

- **ISO 27001:2022**: A.5.1 (Policies for information security)
- **EU AI Act**: Transparency and human oversight requirements
- **NIST AI RMF**: Govern, Map, Measure, Manage
- **Hack23 ISMS**: Information Security Policy, Secure Development Policy

---

**흑괘의 AI 거버넌스** - _AI Governance of the Black Trigram_
