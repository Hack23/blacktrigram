---
name: github-agentic-workflows
description: |
  Enforces GitHub Agentic Workflows (gh-aw) best practices: workflow structure,
  frontmatter, safe outputs, MCP integration, defense-in-depth security,
  operational patterns, multi-engine support, and Continuous AI automation.
license: MIT
---

# GitHub Agentic Workflows Skill

> **Repository automation, running the coding agents you know and love, with strong guardrails in GitHub Actions.** — [gh-aw docs](https://github.github.com/gh-aw/)

## Purpose

Ensures all gh-aw implementations follow best practices for **agentic automation**, **defense-in-depth security**, **safe outputs**, **MCP integration**, and **Continuous AI**. Enforces official patterns for AI-powered workflows running securely in GitHub Actions with isolation, permission separation, threat detection, and multi-engine support (Copilot, Claude, Codex, Gemini).

## When to Apply

- Creating/modifying `.github/workflows/*.md` agentic workflow files
- Working with frontmatter configuration (YAML between `---` markers)
- Implementing safe outputs or threat detection
- Configuring MCP servers, tools, or network permissions
- Implementing operational patterns (IssueOps, ChatOps, DailyOps, TaskOps, etc.)
- Using any AI engine: Copilot, Claude, Codex, or Gemini
- Managing workflow memory (cache-memory, repo-memory)
- Creating cross-repo, multi-PR, or stacked workflows

## 🔗 Related Skills

- **[security-architecture-validation](../security-architecture-validation/SKILL.md)** - Security-by-design
- **[isms-compliance-checking](../isms-compliance-checking/SKILL.md)** - ISMS policy validation
- **[secure-development-lifecycle](../secure-development-lifecycle/SKILL.md)** - SDLC integration

## Core Principles

### 1. 🤖 Agentic vs Traditional Workflows

**Agentic workflows** use AI to understand context and make decisions through natural language. Traditional workflows execute fixed if/then logic.

```markdown
---
on: issues
tools:
  github:
  edit:
---
# Analyze the issue content and suggest appropriate labels
# based on the technical domain and severity.
```

❌ **Don't use procedural YAML**: `if: contains(github.event.issue.body, 'bug')` → Use natural language instructions instead.

### 2. 📋 Workflow Structure

```markdown
---
name: Workflow Name
on: trigger-events           # Required: when to run
permissions:                 # Required: least privilege (read-only)
  contents: read
engine: copilot              # AI engine: copilot | claude | codex | gemini
timeout-minutes: 30          # Prevent runaway costs
strict: true                 # Enforce security constraints
roles: [write, maintain]     # Who can trigger
tools:                       # What agent can use
  github:
    toolsets: [repos, issues]
  bash: ["git", "gh"]
network:                     # Network allowlist
  allowed: [defaults, github]
safe-outputs:                # Write operations (isolated jobs)
  create-issue:
    max: 1
threat-detection:            # Security scanning
  steps: [...]
---

# Natural Language Instructions
Clear, specific task description for the AI agent...
```

### 3. 🔐 Defense-in-Depth Security (5 Layers)

| Layer | Protection | Mechanism |
|-------|-----------|-----------|
| **1. Substrate** | Hardware/container isolation | CPU/MMU, container runtime, iptables, MCP Gateway |
| **2. Configuration** | Declarative artifacts | Network firewall policies, MCP configs, token control |
| **3. Plan** | Workflow decomposition | SafeOutputs subsystem, buffered artifacts, sanitization |
| **4. Runtime** | Agent isolation | Read-only permissions, containerized MCP, domain allowlists |
| **5. Output** | Write gating | AI-powered threat detection, safe outputs, secret redaction |

```
Event → Agent (read-only, sandboxed, firewalled) → Proposed Output (artifact)
  → Threat Detection (AI scan) → ✓ Safe Output Jobs (scoped write) → GitHub API
                                → ✗ Blocked
```

### 4. ✅ Safe Outputs: Permission Isolation

**Core principle:** Agent NEVER has direct write access. Writes go through isolated jobs.

**Available Safe Outputs:**

| Category | Operations |
|----------|-----------|
| **Issues** | `create-issue`, `update-issue`, `close-issue`, `link-sub-issue` |
| **PRs** | `create-pull-request`, `update-pull-request`, `close-pull-request` |
| **Comments** | `add-comment`, `hide-comment` |
| **Labels** | `add-labels`, `remove-labels` |
| **Reviews** | `create-pull-request-review-comment`, `add-reviewer` |
| **Projects** | `create-project`, `update-project` |
| **Security** | `create-code-scanning-alert`, `autofix-code-scanning-alert` |
| **Assignments** | `assign-to-agent`, `assign-to-user` |

**Configuration options:** `max` (limit per run), `expires` (auto-close), `title-prefix`, `labels`, `allowed` (label allowlist), `close-older-issues`, `github-token`.

```markdown
safe-outputs:
  create-issue:
    max: 1
    expires: 7d
    title-prefix: "[triage] "
    labels: [automation]
  add-labels:
    allowed: [bug, enhancement, documentation]
    max: 3
  create-pull-request:
    max: 1
```

### 5. 🔧 Tools & MCP Integration

#### GitHub Tools (Remote MCP)
```markdown
tools:
  github:
    toolsets: [repos, issues, pull_requests, actions, code_security, discussions, projects]
    mode: remote           # Remote MCP (recommended) or local
    min-integrity: approved # Integrity filtering for public repos
```

**Toolsets:** `context`, `repos`, `issues`, `pull_requests`, `actions`, `code_security`, `discussions`, `projects`

#### Built-in Tools
```markdown
tools:
  edit:                    # File editing
  bash: ["git", "gh"]     # Shell (specific commands only)
  web-fetch:               # HTTP GET requests
  web-search:              # Web search
  playwright:              # Browser automation
    allowed_domains: ["defaults", "github"]
  cache-memory:            # 7-day retention (Actions cache)
  repo-memory:             # Unlimited retention (Git branches)
```

#### Custom MCP Servers
```markdown
mcp-servers:
  slack:
    command: "npx"
    args: ["-y", "@slack/mcp-server"]
    env:
      SLACK_BOT_TOKEN: "${{ secrets.SLACK_BOT_TOKEN }}"
    allowed: ["send_message"]
```

### 6. 🌐 Network Permissions & AWF Firewall

**Default: No network access.** Explicit allowlists required.

```markdown
network:
  allowed:
    - defaults     # Certificates, JSON schema
    - python       # PyPI ecosystem
    - node         # npm ecosystem
    - github       # GitHub API/Pages
    - "api.example.com"  # Custom domain
```

**Agent Workflow Firewall (AWF):** Squid proxy enforces domain allowlist via iptables. All HTTP/HTTPS traffic routed through proxy. Unauthorized destinations blocked at kernel level.

### 7. 🎯 Operational Patterns (14 Patterns)

| Pattern | Trigger | Use Case |
|---------|---------|----------|
| **ChatOps** | Slash commands (`/review`) | Interactive automation |
| **DailyOps** | Schedule (cron) | Incremental improvements, tech debt |
| **DataOps** | Schedule/dispatch | Data aggregation, reports |
| **DispatchOps** | workflow_dispatch | Manual execution, debugging |
| **IssueOps** | Issue opened/labeled | Auto-triage, routing |
| **LabelOps** | Label changes | Priority workflows, stage transitions |
| **MemoryOps** | Any + memory tools | Stateful workflows, trend analysis |
| **MultiRepoOps** | Cross-repo events | Organization-wide coordination |
| **ProjectOps** | Issue/PR events | GitHub Projects V2 board management |
| **SideRepoOps** | Side repo events | Isolated automation artifacts |
| **SpecOps** | Spec file changes | W3C-style specification maintenance |
| **TaskOps** | Multi-phase | Research → plan → implement (highest-volume) |
| **TrialOps** | Trial repos | Safe testing in isolated repositories |
| **MultiPhaseOps** | Chained workflows | Sequential multi-step improvements |

**TaskOps** is the highest-volume pattern: Plan Command drove **514 merged PRs (67% merge rate)** via `/plan` decomposition.

### 8. 🔑 Authentication & Token Management

**Token Precedence:** safe-output token → global safe-outputs token → `github-token` → `GH_AW_GITHUB_TOKEN` secret → `GITHUB_TOKEN`

**GitHub App (Recommended):**
```markdown
tools:
  github:
    app:
      app-id: ${{ vars.APP_ID }}
      private-key: ${{ secrets.APP_PRIVATE_KEY }}
```

### 9. 🚀 Multi-Engine Support

| Engine | Strengths | Config |
|--------|----------|--------|
| **Copilot** | General-purpose, GitHub-native | `engine: copilot` (default) |
| **Claude** | Deep analysis, long context | `engine: claude` |
| **Codex** | Code generation, fast | `engine: codex` |
| **Gemini** | Multi-modal, research | `engine: gemini` |

### 10. 🛡️ Threat Detection

```markdown
threat-detection:
  prompt: |
    Check for infrastructure references, CI/CD modifications, security-sensitive changes
  steps:
    - name: Run TruffleHog
      run: trufflehog filesystem /tmp/gh-aw --only-verified
    - name: Run Semgrep
      run: semgrep scan /tmp/gh-aw/aw.patch --config=auto
```

### 11. 💾 Memory & Integrity

**Cache Memory** (7-day): `cache-memory:` — incremental processing and coordination.
**Repo Memory** (unlimited): `repo-memory:` — trend analysis and historical context.

**Integrity Filtering** (public repos): `min-integrity: approved` restricts visibility to collaborators. Set `min-integrity: none` for public issue triage.

### 12. 🔄 Advanced Patterns

**Cross-Repo PRs:** Create PRs in other repositories using safe-outputs.
**Multi-PR Workflows:** Create multiple related PRs in a single run.
**Stacked PRs:** Build incremental changes using `base_ref` targeting.
**Workflow Calls:** Chain workflows using `workflow_call` trigger.

## Enforcement Rules

### Rule 1: Workflow Structure
```
IF (creating workflow) THEN use .github/workflows/<name>.md + frontmatter + natural language + compile to .lock.yml
```

### Rule 2: Security-First
```
IF (configuring workflow) THEN read-only permissions + safe outputs + strict: true + network allowlist + least privilege
```

### Rule 3: Safe Outputs Required
```
IF (needs writes) THEN safe-outputs with max limits + threat detection; NEVER grant write permissions to agent job
```

### Rule 4: Network Isolation
```
IF (needs external access) THEN network.allowed with specific domains/bundles; no wildcards in strict mode
```

### Rule 5: MCP Server Security
```
IF (custom MCP) THEN tool filtering (allowed: []) + secrets via env + container isolation
```

### Rule 6: Token Management
```
IF (using tokens) THEN secrets only (never hardcoded) + minimal scopes + prefer GitHub App
```

### Rule 7: Operational Pattern
```
IF (implementing automation) THEN follow established OpPattern + document pattern + use appropriate triggers
```

### Rule 8: Compilation
```
IF (modifying .md) THEN gh aw compile --strict + commit both .md and .lock.yml + validate
```

## Anti-Patterns to REJECT

| # | Anti-Pattern | Instead |
|---|-------------|---------|
| 1 | Direct write permissions (`issues: write`) | Use `safe-outputs: create-issue:` |
| 2 | Hardcoded tokens (`ghp_...`) | Use `${{ secrets.GH_AW_GITHUB_TOKEN }}` |
| 3 | Unrestricted network (`allowed: ["*"]`) | Specific domains: `[defaults, github]` |
| 4 | Procedural YAML logic (`if: contains(...)`) | Natural language instructions |
| 5 | Unrestricted bash (`bash: [":*"]`) | Specific: `bash: ["git", "gh", "npm"]` |
| 6 | No threat detection on write outputs | Add `threat-detection:` with security scans |
| 7 | Uncompiled workflows (only .md) | `gh aw compile --strict` + commit both |
| 8 | Missing expiration on issues | `expires: 7d` on create-issue outputs |

## Required Patterns

### ✅ IssueOps Triage
```markdown
---
timeout-minutes: 5
on:
  issue:
    types: [opened, reopened]
permissions:
  issues: read
tools:
  github:
    toolsets: [issues, labels]
safe-outputs:
  add-labels:
    allowed: [bug, feature, enhancement, documentation]
  add-comment: {}
---
# Issue Triage Agent
Analyze unlabeled issues, add labels, explain reasoning in comment.
```

### ✅ ChatOps with Slash Commands
```markdown
---
on:
  slash_command:
    command: review
tools:
  github:
    toolsets: [repos, pull_requests, code_security]
safe-outputs:
  create-pull-request-review-comment:
    max: 10
---
# Security and quality review of the PR.
```

### ✅ DailyOps Continuous Improvement
```markdown
---
on:
  schedule:
    - cron: "0 9 * * 1-5"
tools:
  github:
    toolsets: [repos, issues]
  bash: ["git", "find", "grep"]
safe-outputs:
  create-pull-request:
    max: 1
---
# Make small, incremental code quality improvements.
```

### ✅ TaskOps Multi-Phase (Highest-Volume Pattern)
```markdown
---
on:
  issue_comment:
    types: [created]
tools:
  github:
    toolsets: [repos, issues]
safe-outputs:
  create-issue:
    max: 5
  link-sub-issue: {}
---
# /plan - Break down issue into actionable sub-tasks.
```

### ✅ MemoryOps Stateful Analysis
```markdown
---
on: issues
tools:
  github:
  cache-memory:
  repo-memory:
safe-outputs:
  add-comment:
---
# Track issue trends: load history, analyze, update, report.
```

## Compliance Framework

| Standard | Controls |
|----------|----------|
| **ISO 27001:2022** | A.5.15 (access control), A.8.2 (least privilege), A.8.3 (network restriction), A.8.8 (vuln management), A.8.22 (network segregation), A.8.25 (SDLC), A.8.28 (secure coding) |
| **NIST CSF 2.0** | GV.PO (governance), ID.RA (risk assessment), PR.AC (access control), PR.DS (data security), PR.IP (protective tech), DE.CM (monitoring), RS.MA (response) |
| **CIS Controls v8.1** | 2.3 (software allowlisting), 3.3 (data access), 4.1 (secure configs), 12.2 (network defenses), 16.1 (app security), 18.3 (security scanning) |

## Remember

**흑괘의 자동화 원칙** - _Black Trigram Automation Principles_

- 🤖 **Agentic Intelligence** - Natural language, context-aware AI decisions
- 🛡️ **Security First** - 5-layer defense-in-depth, never compromise isolation
- ✅ **Safe by Default** - Read-only agent, write through safe outputs only
- 🌐 **Network Isolation** - Explicit allowlists, AWF firewall enforcement
- 🔧 **Tool Restriction** - Minimal, purpose-specific tool and bash access
- 💾 **Stateful Workflows** - Memory tools for continuous improvement
- 🚀 **Multi-Engine** - Choose Copilot, Claude, Codex, or Gemini per task
- 🎯 **Operational Patterns** - Follow established patterns (14 OpPatterns)
- 🔄 **Continuous AI** - Systematic, automated AI application to collaboration

**Every workflow is a step toward systematic AI collaboration.**

---

**Project**: Black Trigram (흑괘) | **Owner**: Hack23 AB | **License**: MIT | **Version**: 2.0
**Updated**: 2026-04-02 | **Docs**: https://github.github.com/gh-aw/
