---
name: github-agentic-workflows
description: |
  Enforces comprehensive GitHub Agentic Workflows (gh-aw) best practices including
  workflow structure, frontmatter configuration, safe outputs, MCP integration,
  security architecture, operational patterns, and compliance with defense-in-depth
  security model for AI-powered automation in GitHub Actions.
license: MIT
---

# GitHub Agentic Workflows Skill

## 📚 Icon Reference Guide

This skill uses standardized icons from [Hack23 ISMS Style Guide](https://github.com/Hack23/ISMS-PUBLIC/blob/main/STYLE_GUIDE.md):

- 🤖 AI/Agentic Operations
- 🔐 Security & Access Control
- 🛡️ Defense-in-Depth Security
- 🔑 Authentication & Tokens
- 🌐 Network & Firewall
- 📊 Workflow Automation
- ✅ Safe Operations
- ⚠️ Security Warning
- ❌ Anti-Pattern
- 📋 Configuration
- 🏗️ Architecture
- 🔧 Tools & MCP Servers
- 🎯 Operational Patterns
- 📝 Documentation
- 🔒 Permissions & Roles
- 💾 Memory & State
- 🚀 Continuous AI
- ⚡ Performance
- 🔍 Monitoring & Logs

## Purpose

This skill ensures that all GitHub Agentic Workflows (gh-aw) implementations follow best practices for **agentic automation**, **defense-in-depth security**, **safe outputs**, and **Model Context Protocol (MCP) integration**. It enforces the official gh-aw patterns for creating AI-powered workflows that run securely in GitHub Actions with proper isolation, permission separation, and threat detection.

## When to Apply

**Automatically trigger this skill when:**
- Creating or modifying `.github/workflows/*.md` agentic workflow files
- Configuring `.github/workflows/*.lock.yml` compiled workflow files
- Working with workflow frontmatter (YAML between `---` markers)
- Implementing safe outputs (`create-issue`, `add-comment`, `create-pull-request`)
- Configuring MCP servers for tool integration
- Setting up network permissions and firewall rules
- Implementing operational patterns (IssueOps, ChatOps, DailyOps, etc.)
- Designing security architecture for AI workflows
- Using GitHub Copilot CLI, Claude, or Codex engines
- Managing workflow memory (cache-memory, repo-memory)
- Implementing threat detection and output sanitization

## 🔗 Related Skills

This skill integrates with Hack23 ISMS enforcement skills:

- **[security-architecture-validation](../security-architecture-validation/SKILL.md)** - Security-by-design principles
- **[isms-compliance-checking](../isms-compliance-checking/SKILL.md)** - ISMS policy validation
- **[classification-framework-enforcement](../classification-framework-enforcement/SKILL.md)** - Asset classification
- **[secure-development-lifecycle](../secure-development-lifecycle/SKILL.md)** - SDLC integration

## Core Principles

### 1. 🤖 Agentic vs Traditional Workflows

**Agentic workflows** use AI to understand context and make decisions flexibly through natural language instructions. Traditional workflows execute fixed if/then logic.

**Key Characteristics:**
```markdown
---
on: issues
tools:
  github:
  edit:
---
# Natural Language Instructions
Analyze this issue and provide helpful triage comments...
```

**✅ Agentic Pattern:**
```markdown
Analyze the issue content and suggest appropriate labels
based on the technical domain and severity.
```

**❌ Traditional Pattern (Don't Use):**
```yaml
if: contains(github.event.issue.body, 'bug')
run: gh issue label ${{ github.event.issue.number }} "bug"
```

### 2. 📋 Workflow Structure

All workflows follow this canonical structure:

```markdown
---
# Frontmatter (YAML configuration)
on: trigger-events
permissions: read-only-by-default
tools:
  github:
  bash: ["safe", "commands"]
safe-outputs:
  create-issue:
network:
  allowed:
    - defaults
---

# Markdown Instructions (Natural Language)
Clear, specific task description for the AI agent...
```

**Required Elements:**
- Frontmatter between `---` markers
- Trigger events (`on:`)
- Permissions (least privilege)
- Tools configuration
- Natural language instructions

### 3. 🔐 Defense-in-Depth Security Architecture

GitHub Agentic Workflows implements **5 layers of security**:

#### Layer 1: Substrate-Level Trust
- Hardware/kernel enforcement (CPU, MMU, kernel)
- Container runtime isolation
- Network firewall (iptables)
- MCP Gateway sandboxing

#### Layer 2: Configuration-Level Trust
- Declarative configuration artifacts
- Network firewall policies
- MCP server configurations
- Token distribution control

#### Layer 3: Plan-Level Trust
- Workflow decomposition into stages
- SafeOutputs subsystem
- Buffered artifacts with filtering
- Sanitization pipelines

#### Layer 4: Runtime Isolation
- Read-only agent permissions
- Containerized MCP servers
- Domain allowlists
- Tool filtering

#### Layer 5: Output Security
- Threat detection (AI-powered)
- Safe outputs (permission separation)
- Output sanitization
- Secret redaction

**Security Flow:**
```
Input → Compilation → Runtime → Isolation → Output Security → GitHub API
  ↓         ↓           ↓          ↓            ↓
Schema    SHA Pin    Firewall   MCP         Threat
Validate   Actions   Network    Sandbox     Detection
```

### 4. ✅ Safe Outputs: Permission Isolation

**Core Principle:** Agent execution NEVER has direct write access.

```markdown
safe-outputs:
  create-issue:
    max: 1
    expires: 7d
  add-comment:
    max: 1
```

**Job Separation:**
```
┌─────────────────┐
│ Agent Job       │
│ (read-only)     │ → agent_output.json → ┌──────────────────┐
│ permissions: {} │                       │ Threat Detection │
└─────────────────┘                       │ (AI analysis)    │
                                          └──────────────────┘
                                                  ↓
                                          ┌──────────────────┐
                                          │ Safe Output Jobs │
                                          │ (write perms)    │
                                          │ - create-issue   │
                                          │ - add-comment    │
                                          └──────────────────┘
```

**Available Safe Outputs:**
- **Issues**: `create-issue`, `update-issue`, `close-issue`, `link-sub-issue`
- **Pull Requests**: `create-pull-request`, `update-pull-request`, `close-pull-request`
- **Comments**: `add-comment`, `hide-comment`
- **Labels**: `add-labels`, `remove-labels`
- **Projects**: `create-project`, `update-project`
- **Security**: `create-code-scanning-alert`, `autofix-code-scanning-alert`
- **Assignments**: `assign-to-agent`, `assign-to-user`, `add-reviewer`

### 5. 🔧 Tools & MCP Integration

#### GitHub Tools (Default)
```markdown
tools:
  github:
    toolsets: [repos, issues, pull_requests]
    mode: remote
    read-only: true
```

**Available Toolsets:**
- `context` - User/team info
- `repos` - Repository operations, code search
- `issues` - Issue management
- `pull_requests` - PR operations
- `actions` - Workflows, runs, artifacts
- `code_security` - Scanning alerts
- `discussions` - GitHub Discussions
- `projects` - GitHub Projects V2

#### Built-in Tools
```markdown
tools:
  edit:              # File editing
  bash: ["git", "gh"] # Shell commands
  web-fetch:         # HTTP requests
  web-search:        # Web search
  playwright:        # Browser automation
    allowed_domains: ["defaults", "github"]
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
  
  postgres:
    container: "postgres:15"
    env:
      POSTGRES_PASSWORD: "${{ secrets.DB_PASSWORD }}"
```

#### Memory Tools
```markdown
tools:
  cache-memory:  # 7-day retention (Actions cache)
  repo-memory:   # Unlimited retention (Git branches)
```

### 6. 🌐 Network Permissions & Agent Workflow Firewall (AWF)

**Default: No network access**. Explicit allowlists required.

```markdown
network:
  allowed:
    - defaults     # Certificates, JSON schema
    - python       # PyPI ecosystem
    - node         # npm ecosystem
    - github       # GitHub API/Pages
    - "api.example.com"  # Custom domain
```

**Agent Workflow Firewall (AWF):**
- Containerizes agent with Docker network
- Squid proxy enforces domain allowlist
- iptables redirect HTTP/HTTPS traffic
- Chroot mode for host binary access

**AWF Architecture:**
```
┌────────────────┐
│ AI Agent       │
│ (container)    │
└────────┬───────┘
         │
┌────────▼───────┐
│ Squid Proxy    │ ← Domain allowlist
│ (172.30.0.10)  │
└────────┬───────┘
         │
┌────────▼───────┐
│ Allowed        │ → Internet
│ Domains        │
└────────────────┘
```

### 7. 🎯 Operational Patterns (OpPatterns)

GitHub Agentic Workflows defines **12 operational patterns**:

| Pattern | Trigger | Use Case |
|---------|---------|----------|
| **ChatOps** | Slash commands | Interactive automation (`/review`, `/deploy`) |
| **DailyOps** | Schedule | Incremental improvements, technical debt |
| **DataOps** | Schedule/dispatch | Data aggregation, report generation |
| **DispatchOps** | workflow_dispatch | Manual execution, testing, debugging |
| **IssueOps** | Issue opened | Auto-triage, routing, quality checks |
| **LabelOps** | Label changes | Priority workflows, stage transitions |
| **MemoryOps** | Any + memory | Stateful workflows, trend analysis |
| **MultiRepoOps** | Cross-repo | Organization-wide coordination |
| **ProjectOps** | Issue/PR | GitHub Projects board management |
| **SideRepoOps** | Side repo | Isolated automation artifacts |
| **SpecOps** | Spec changes | W3C-style specification maintenance |
| **TaskOps** | Multi-phase | Research → plan → implement workflow |
| **TrialOps** | Trial repos | Safe testing in isolated repositories |

### 8. 🔑 Authentication & Token Management

**Token Precedence (highest to lowest):**
1. Safe-output specific token (`create-issue.github-token`)
2. Safe-outputs global token
3. Top-level `github-token`
4. `GH_AW_GITHUB_TOKEN` secret
5. `GITHUB_TOKEN` (default)

**GitHub App Authentication (Recommended):**
```markdown
tools:
  github:
    app:
      app-id: ${{ vars.APP_ID }}
      private-key: ${{ secrets.APP_PRIVATE_KEY }}
```

**Benefits:**
- On-demand token minting
- Automatic revocation
- Short-lived credentials
- Permissions from agent job

### 9. �� Frontmatter Configuration

**Minimal Example:**
```markdown
---
on: issues
tools:
  github:
safe-outputs:
  add-comment:
---
```

**Comprehensive Example:**
```markdown
---
name: Issue Triage
description: "Analyzes and triages new issues"
labels: [automation, triage]
on:
  issues:
    types: [opened]
permissions:
  contents: read
  issues: read
roles: [write, maintain, admin]
strict: true
timeout-minutes: 30
engine: copilot
tools:
  github:
    toolsets: [repos, issues]
    mode: remote
  bash: ["git", "gh"]
  web-fetch:
network:
  allowed:
    - defaults
    - github
safe-outputs:
  create-issue:
    max: 1
    expires: 7d
  add-comment:
    max: 1
  add-labels:
    allowed: [bug, enhancement, documentation]
    max: 3
---

# Triage Instructions
Analyze the issue content and:
1. Determine the issue type (bug, feature, docs)
2. Suggest appropriate labels
3. Add helpful context or questions
```

### 10. 🛡️ Threat Detection

**Automatic Security Analysis:**
```markdown
threat-detection:
  prompt: |
    Check for:
    - Internal infrastructure references
    - CI/CD config modifications
    - Security-sensitive file changes
  steps:
    - name: Run TruffleHog
      run: trufflehog filesystem /tmp/gh-aw --only-verified
    - name: Run Semgrep
      run: semgrep scan /tmp/gh-aw/aw.patch --config=auto
```

**Detection Checks:**
- Secret leaks (API keys, tokens)
- Malicious code patterns
- Backdoors/vulnerabilities
- Policy violations
- Suspicious modifications

### 11. 💾 Memory & State Management

**Cache Memory (7-day retention):**
```markdown
tools:
  cache-memory:
    id: "workflow-state"
```

**Repo Memory (unlimited retention):**
```markdown
tools:
  repo-memory:
    branch: "workflow-data"
```

**Use Cases:**
- Incremental processing
- Trend analysis
- Workflow coordination
- Progress tracking
- Historical context

### 12. 🚀 Continuous AI Patterns

Enable **systematic, automated AI application** to software collaboration:

- **Documentation Currency**: Keep docs synced with code
- **Code Quality**: Incremental improvements
- **Intelligent Triage**: Context-aware issue/PR routing
- **Automated Review**: AI-powered code review

**Best Practices:**
- Start simple and iterate
- Clear, specific instructions
- Test with `gh aw compile --watch`
- Monitor costs with `gh aw logs`
- Review AI output before merging

## Enforcement Rules

### Rule 1: Workflow Structure Compliance
```
IF (creating workflow file)
THEN (use .github/workflows/<name>.md format)
  AND (include frontmatter between --- markers)
  AND (write natural language instructions)
  AND (compile to .lock.yml with gh aw compile)
ELSE (reject: "Invalid workflow structure")
```

### Rule 2: Security-First Configuration
```
IF (configuring workflow)
THEN (use read-only permissions by default)
  AND (implement safe outputs for writes)
  AND (enable strict mode: true)
  AND (configure network allowlist)
  AND (use least privilege permissions)
ELSE (reject: "Security requirements not met")
```

### Rule 3: Safe Outputs Required
```
IF (workflow needs write operations)
THEN (use safe-outputs for GitHub API writes)
  AND (never grant write permissions to agent job)
  AND (configure max limits for each output type)
  AND (enable threat detection)
ELSE (reject: "Direct write permissions prohibited")
```

### Rule 4: Network Isolation
```
IF (workflow needs external access)
THEN (configure network.allowed with specific domains)
  AND (use ecosystem bundles: defaults, python, node)
  AND (avoid wildcard * in strict mode)
  AND (enable AWF firewall: true)
ELSE (reject: "Network access not properly restricted")
```

### Rule 5: MCP Server Security
```
IF (using custom MCP servers)
THEN (configure in mcp-servers section)
  AND (use tool filtering with allowed: [])
  AND (inject secrets via env variables)
  AND (enable container isolation)
  AND (configure network permissions)
ELSE (reject: "MCP server security not configured")
```

### Rule 6: Token Management
```
IF (using GitHub tokens)
THEN (use secrets.GH_AW_GITHUB_TOKEN or GitHub App)
  AND (never hardcode tokens in workflow files)
  AND (use minimal token scopes)
  AND (prefer GitHub App for auto-revocation)
ELSE (reject: "Insecure token handling")
```

### Rule 7: Operational Pattern Alignment
```
IF (implementing automation workflow)
THEN (follow established OpPattern)
  AND (document pattern in workflow description)
  AND (use pattern-specific best practices)
  AND (implement pattern-appropriate triggers)
ELSE (suggest: "Use established operational pattern")
```

### Rule 8: Compilation & Validation
```
IF (modifying workflow .md file)
THEN (run gh aw compile --strict)
  AND (commit both .md and .lock.yml files)
  AND (validate with actionlint/zizmor/poutine)
  AND (test with gh aw run --dry-run)
ELSE (reject: "Workflow not properly compiled")
```

## Anti-Patterns to REJECT

### ❌ Anti-Pattern 1: Direct Write Permissions
**DON'T:**
```yaml
permissions:
  issues: write
  contents: write
```

**DO:**
```markdown
permissions:
  contents: read
safe-outputs:
  create-issue:
  create-pull-request:
```

### ❌ Anti-Pattern 2: Hardcoded Tokens
**DON'T:**
```yaml
env:
  GITHUB_TOKEN: ghp_hardcoded123
```

**DO:**
```yaml
github-token: ${{ secrets.GH_AW_GITHUB_TOKEN }}
```

### ❌ Anti-Pattern 3: Unrestricted Network
**DON'T:**
```yaml
network:
  allowed: ["*"]
```

**DO:**
```yaml
network:
  allowed:
    - defaults
    - github
    - "api.specific-service.com"
```

### ❌ Anti-Pattern 4: Procedural YAML Logic
**DON'T:**
```yaml
if: contains(github.event.issue.body, 'bug')
run: gh issue label ${{ github.event.issue.number }} "bug"
```

**DO:**
```markdown
Analyze the issue and suggest appropriate labels based on content.
```

### ❌ Anti-Pattern 5: Missing Tool Restrictions
**DON'T:**
```yaml
tools:
  bash: [":*"]  # Unrestricted
```

**DO:**
```yaml
tools:
  bash: ["git", "gh", "npm"]  # Specific commands
```

### ❌ Anti-Pattern 6: No Threat Detection
**DON'T:**
```yaml
safe-outputs:
  create-pull-request:
# No threat detection
```

**DO:**
```yaml
safe-outputs:
  create-pull-request:
threat-detection:
  steps:
    - name: Security scan
      run: semgrep scan --config=auto
```

### ❌ Anti-Pattern 7: Uncompiled Workflows
**DON'T:**
```bash
# Only commit .md file
git add .github/workflows/triage.md
git commit -m "Add workflow"
```

**DO:**
```bash
# Compile and commit both
gh aw compile --strict
git add .github/workflows/triage.md
git add .github/workflows/triage.lock.yml
git commit -m "Add compiled workflow"
```

### ❌ Anti-Pattern 8: Missing Expiration
**DON'T:**
```yaml
safe-outputs:
  create-issue:
    max: 10
# No expiration - stale issues accumulate
```

**DO:**
```yaml
safe-outputs:
  create-issue:
    max: 10
    expires: 7d  # Auto-close after 7 days
```

## Required Patterns

### ✅ Pattern 1: Canonical Workflow Template
```markdown
---
name: Workflow Name
description: "Clear purpose statement"
labels: [automation, domain]
on:
  trigger: event
permissions:
  contents: read
roles: [write, maintain, admin]
strict: true
engine: copilot
tools:
  github:
    toolsets: [repos, issues]
network:
  allowed:
    - defaults
safe-outputs:
  type:
    max: limit
---

# Clear Instructions
Specific task description with:
- Context requirements
- Expected outputs
- Constraints
```

### ✅ Pattern 2: IssueOps Implementation
```markdown
---
on:
  issues:
    types: [opened]
tools:
  github:
    toolsets: [repos, issues]
safe-outputs:
  add-comment:
  add-labels:
    allowed: [bug, enhancement, documentation]
---

# Triage Workflow
Analyze the issue and:
1. Determine type
2. Suggest labels
3. Add helpful context
```

### ✅ Pattern 3: ChatOps with Slash Commands
```markdown
---
on:
  slash_command:
    command: review
tools:
  github:
    toolsets: [repos, pull_requests, code_security]
  bash: ["git", "gh"]
safe-outputs:
  create-pull-request-review-comment:
    max: 10
---

# Code Review
Perform security and quality review of the PR:
- Check for common vulnerabilities
- Suggest improvements
- Validate best practices
```

### ✅ Pattern 4: DailyOps for Continuous Improvement
```markdown
---
on:
  schedule:
    - cron: "0 9 * * 1-5"  # Weekdays 9 AM
tools:
  github:
    toolsets: [repos, issues]
  bash: ["git", "find", "grep"]
safe-outputs:
  create-pull-request:
    max: 1
---

# Daily Code Quality
Make small, incremental improvements:
- Fix one TODO comment
- Update one outdated dependency
- Improve one test case
```

### ✅ Pattern 5: MemoryOps for State Tracking
```markdown
---
on: issues
tools:
  github:
    toolsets: [repos, issues]
  cache-memory:
  repo-memory:
safe-outputs:
  add-comment:
---

# Stateful Analysis
Track issue trends across runs:
1. Load previous statistics
2. Analyze current issue
3. Update trend data
4. Report on patterns
```

## Compliance Framework

### ISO 27001:2022 Alignment
- **A.5.15** - Access control (read-only by default)
- **A.8.2** - Privileged access rights (least privilege)
- **A.8.3** - Information access restriction (network allowlists)
- **A.8.8** - Management of technical vulnerabilities (threat detection)
- **A.8.22** - Segregation in networks (AWF isolation)
- **A.8.25** - Secure development life cycle (compilation validation)
- **A.8.28** - Secure coding (safe outputs, input validation)

### NIST CSF 2.0 Alignment
- **GV.PO** - Governance and Policy (operational patterns)
- **ID.RA** - Risk Assessment (threat detection)
- **PR.AC** - Access Control (permission isolation)
- **PR.DS** - Data Security (token management, secret injection)
- **PR.IP** - Protective Technology (AWF, MCP sandboxing)
- **DE.CM** - Continuous Monitoring (workflow logging)
- **RS.MA** - Response Mitigation (threat detection blocking)

### CIS Controls v8.1 Alignment
- **2.3** - Address Unauthorized Software (tool allowlisting)
- **3.3** - Configure Data Access Control (read-only permissions)
- **4.1** - Establish Secure Configurations (strict mode, validation)
- **4.7** - Manage Default Accounts (token precedence)
- **12.2** - Establish Network Boundary Defenses (AWF firewall)
- **16.1** - Establish Application Security (safe outputs, threat detection)
- **18.3** - Remediate Penetration Findings (security scanning)

## Remember

**흑괘의 자동화 원칙** - _Black Trigram Automation Principles_

GitHub Agentic Workflows represents the intersection of **AI-powered automation** and **defense-in-depth security**. Every implementation should honor this balance:

- **🤖 Agentic Intelligence** - Let AI understand context and make decisions
- **🛡️ Security First** - Never compromise on isolation and permission separation
- **✅ Safe by Default** - Read-only agent, write through safe outputs
- **🌐 Network Isolation** - Explicit allowlists for all external access
- **🔧 Tool Restriction** - Minimal, purpose-specific tool access
- **💾 Stateful Workflows** - Use memory for continuous improvement
- **📊 Operational Patterns** - Follow established automation patterns
- **🔍 Continuous Validation** - Compile, validate, test every change
- **🚀 Incremental Progress** - Small, reviewable changes
- **🎯 Clear Instructions** - Natural language with specific goals

**Every workflow is a step toward systematic AI collaboration.**

**GitHub Agentic Workflows를 통한 완벽한 자동화** - _Perfect Automation Through GitHub Agentic Workflows_

---

**Project**: Black Trigram (흑괘)  
**Owner**: Hack23 AB  
**License**: MIT  
**Version**: 1.0  
**Last Updated**: 2026-02-11  
**Documentation**: https://github.github.com/gh-aw/
