# 🎯 GitHub Copilot Agent Skills for Black Trigram (흑괘)

## What Are Agent Skills?

**Agent Skills** are specialized, reusable instructions that GitHub Copilot automatically loads to enforce project-specific standards, patterns, and best practices. Unlike agents (which handle specific tasks), skills are **strategic, high-level principles** that guide all development work.

### Skills vs Agents

| **Skills** | **Agents** |
|-----------|-----------|
| Strategic principles and rules | Task-specific implementers |
| Automatically activated by context | Explicitly invoked |
| Enforce standards and patterns | Execute specific workflows |
| High-level, declarative | Detailed, procedural |
| Focus on "what" and "why" | Focus on "how" |

**Example:**
- **Skill**: "All security changes must update SECURITY_ARCHITECTURE.md"
- **Agent**: "I will implement JWT authentication in `src/auth/jwt.ts`"

---

## 📚 Available Skills

Black Trigram includes **27 comprehensive skills** organized by domain:

### 🔐 Security & Compliance

#### 1. [secure-development-lifecycle](./secure-development-lifecycle/SKILL.md)
**Purpose**: Enforce comprehensive Secure Development Lifecycle (SDLC) practices for all phases from requirements to retirement

**Key Rules:**
- All 7 SDLC phases completed (Requirements, Design, Implementation, Testing, Deployment, Maintenance, Retirement)
- Threat modeling (STRIDE) required for all new features
- OWASP Top 10 2021 and CWE Top 25 prevention controls mandatory
- Security test coverage ≥90% with security-specific test cases
- CodeQL SAST, npm audit, OSSF Scorecard (≥7.0) must pass
- DevSecOps automation: CI/CD security scanning, SBOM generation, signed commits
- Supply chain security: OSSF Scorecard, SLSA Level 3, CycloneDX/SPDX SBOM
- Security code review checklist required for all PRs
- Input validation with Zod schemas mandatory
- Secrets management (AWS Secrets Manager, no hardcoding)
- Vulnerability management with SLA-based patching
- Incident response integration with lessons learned

**Triggers:**
- Developing new features or components
- Reviewing pull requests and code changes
- Planning deployments or releases
- Configuring CI/CD pipelines and automation
- Writing or updating security documentation
- Implementing authentication, authorization, or cryptography
- Conducting security assessments or threat modeling
- Managing dependencies or supply chain
- Refactoring or maintaining existing code
- Decommissioning features or systems

**Compliance:** ISO 27001:2022 (A.14.1, A.14.2, A.12.6, A.8.24), NIST CSF 2.0 (ID.RA, PR.DS, PR.IP, DE.CM, RS.MA, GV.SC), CIS Controls v8.1 (2, 3, 4, 7, 16, 18)

**Reference**: [Hack23 ISMS Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) (95KB comprehensive policy)

---

#### 2. [security-architecture-validation](./security-architecture-validation/SKILL.md)
**Purpose**: Enforce Hack23 ISMS security-by-design principles

**Key Rules:**
- All security changes must update SECURITY_ARCHITECTURE.md
- No hard-coded secrets (use environment variables)
- All inputs must be validated and outputs encoded
- Security tests required for security controls
- ISMS policy references required

**Triggers:**
- Authentication/authorization code
- Data encryption or protection
- External API integration
- Security documentation updates

**Compliance:** ISO 27001, NIST CSF 2.0, CIS Controls v8.1

---

#### 3. [isms-compliance-checking](./isms-compliance-checking/SKILL.md)
**Purpose**: Validate all code against Hack23 ISMS framework

**Key Rules:**
- ISO 27001:2022 Annex A control mapping required
- NIST CSF 2.0 all 6 functions (GOVERN, IDENTIFY, PROTECT, DETECT, RESPOND, RECOVER)
- CIS Controls v8.1 alignment (18 controls)
- GDPR, NIS2, EU Cyber Resilience Act compliance
- OSSF Scorecard >8.0, SLSA, SBOM requirements

**Triggers:**
- Security policy updates
- Compliance documentation
- Supply chain security
- Regulatory requirements

**Compliance:** ISO 27001:2022, NIST CSF 2.0, CIS Controls v8.1, GDPR, NIS2, EU CRA

---

#### 4. [compliance-framework-alignment](./compliance-framework-alignment/SKILL.md)
**Purpose**: Enforce unified compliance across ISO 27001:2022, NIST CSF 2.0, and CIS Controls v8.1

**Key Rules:**
- All security features must map to all three frameworks simultaneously
- Evidence must be verifiable and current (within 90 days)
- Compliance documentation updated with code changes
- Multi-framework traceability required (ISO → NIST → CIS → Implementation)
- Implementation Groups match organizational size (IG1 focus for single-person org)

**Triggers:**
- Implementing security controls or features
- Creating/modifying security documentation
- Conducting security reviews or audits
- Adding compliance evidence
- Updating architecture or data models

**Compliance:** ISO 27001:2022 (93 controls), NIST CSF 2.0 (6 functions), CIS Controls v8.1 (18 controls)

---

#### 5. [classification-framework-enforcement](./classification-framework-enforcement/SKILL.md)
**Purpose**: Enforce comprehensive classification of assets across security, business impact, and recovery objectives

**Key Rules:**
- All assets classified with confidentiality, integrity, availability, privacy levels
- Business Impact Analysis (BIA) required for high-criticality assets (financial, operational, reputational, regulatory)
- Recovery objectives (RTO/RPO) defined for high availability systems
- Defense-in-depth controls match classification levels
- Privacy classification follows GDPR requirements (Art. 4, Art. 9)
- Classification reviewed quarterly (every 90 days)
- Project type determines baseline security levels

**Triggers:**
- Implementing new features or systems
- Handling sensitive data or user information
- Designing security controls or access restrictions
- Planning disaster recovery or business continuity
- Classifying project assets or repositories
- Conducting risk assessments or impact analysis
- Defining RTO/RPO requirements

**Compliance:** ISO 27001:2022 (A.5.12, A.5.13, A.8.6, A.17.1), NIST CSF 2.0 (ID.AM-05, ID.RA-01, PR.DS-01/02, RC.RP-01), CIS Controls v8.1 (1, 2, 3, 11, 12)

---

#### 6. [gdpr-compliance](./gdpr-compliance/SKILL.md)
**Purpose**: Enforce GDPR and EU privacy requirements for data protection by design

**Key Rules:**
- Data minimization: collect only what's strictly necessary
- Explicit consent required before data storage (localStorage, cookies)
- Right to erasure: implement data deletion functionality
- Privacy by design for all new features
- NIS2 Directive and EU Cyber Resilience Act alignment

**Triggers:**
- Data collection or storage
- User preferences handling
- Analytics implementation
- Privacy notice updates

**Compliance:** GDPR Articles 5, 6, 13, 17, 25, 32; NIS2 Directive; EU CRA; ISO 27001 A.5.34

---

#### 7. [incident-response](./incident-response/SKILL.md)
**Purpose**: Enforce security incident response procedures aligned with Hack23 ISMS

**Key Rules:**
- Severity classification (Critical/High/Medium/Low) with response SLAs
- Critical vulnerabilities patched within 24 hours
- Secret exposure: immediate revocation, rotation, audit
- Lessons learned documented for all incidents
- Automated detection via Dependabot, CodeQL, npm audit

**Triggers:**
- Security vulnerability detected
- Secret exposure
- Dependency vulnerability alert
- CI/CD security failure

**Compliance:** ISO 27001 A.5.24-A.5.28, NIST CSF DE.AE/RS.AN/RS.MA, CIS Controls 17

---

#### 8. [secrets-management](./secrets-management/SKILL.md)
**Purpose**: Ensure API keys, tokens, and credentials are handled securely

**Key Rules:**
- No hardcoded secrets in source code
- Environment variables (import.meta.env.VITE_*) for client-side config
- GitHub Secrets for CI/CD credentials
- .env files in .gitignore
- Secret rotation every 90 days maximum

**Triggers:**
- Configuration with sensitive values
- CI/CD workflow secrets
- API key management
- Credential rotation

**Compliance:** ISO 27001 A.8.24, NIST CSF PR.DS-1, CIS Controls 3.11, OWASP A02:2021

---

#### 9. [vulnerability-management](./vulnerability-management/SKILL.md)
**Purpose**: Continuously identify, assess, and remediate vulnerabilities

**Key Rules:**
- Dependency scanning with Dependabot and npm audit
- Remediation SLAs: Critical 24h, High 72h, Medium 2 weeks, Low 30 days
- OSSF Scorecard maintenance ≥ 8.0
- SBOM generation on every release (CycloneDX format)
- CodeQL analysis required on all PRs

**Triggers:**
- Dependency updates
- Security scanning alerts
- OSSF Scorecard monitoring
- Release builds

**Compliance:** ISO 27001 A.8.8, NIST CSF ID.RA/DE.CM, CIS Controls 7, OWASP A06:2021

---

#### 10. [input-validation](./input-validation/SKILL.md)
**Purpose**: Enforce input validation at all system boundaries

**Key Rules:**
- Validate type, length, format, and range for all user input
- Use Zod schemas or type guards at data boundaries
- React auto-escaping for output encoding (no dangerouslySetInnerHTML)
- Combat data validation against known ranges and enums
- Schema validation for localStorage/URL data

**Triggers:**
- User input handling
- Data boundary crossing
- Combat data processing
- localStorage/URL parsing

**Compliance:** ISO 27001 A.8.26, NIST CSF PR.DS-1, CIS Controls 16.6, OWASP A03:2021

---

#### 11. [data-protection](./data-protection/SKILL.md)
**Purpose**: Protect data at every stage of its lifecycle

**Key Rules:**
- Data classification: Public, Internal, Confidential, Restricted
- HTTPS/TLS 1.2+ for all network communication
- Content Security Policy (CSP) headers configured
- Subresource Integrity (SRI) for external resources
- Minimal data retention with automatic cleanup

**Triggers:**
- Data storage implementation
- Network communication
- Security header configuration
- Asset loading

**Compliance:** ISO 27001 A.8.10-A.8.12, NIST CSF PR.DS, CIS Controls 3, GDPR Art. 5/25/32

---

#### 12. [risk-assessment-frameworks](./risk-assessment-frameworks/SKILL.md)
**Purpose**: Systematically identify, evaluate, and treat security risks

**Key Rules:**
- Risk assessment required for new dependencies and integrations
- Risk treatment: Mitigate, Accept, Transfer, or Avoid (documented)
- Supply chain risk assessment for npm dependencies
- Risk register maintained and reviewed quarterly
- Dependency checklist: audit, maintenance, license, OSSF score

**Triggers:**
- Adding dependencies
- External integrations
- Architecture changes
- Quarterly risk review

**Compliance:** ISO 27001 6.1/6.2, NIST CSF ID.RA, CIS Controls 7, ISO 31000

---

### 🏗️ Architecture & Documentation

#### 13. [c4-architecture-documentation](./c4-architecture-documentation/SKILL.md)
**Purpose**: Enforce C4 Architecture Model standards

**Key Rules:**
- Maintain 12 architecture documents (6 current + 6 future)
- All C4 diagrams must use Mermaid syntax
- Quantified metrics required (X/Y complete, N% coverage)
- Architecture changes must update relevant docs
- Korean martial arts context integrated

**Required Docs:**
- ARCHITECTURE.md, DATA_MODEL.md, FLOWCHART.md
- STATEDIAGRAM.md, MINDMAP.md, SWOT.md
- FUTURE_* versions of all above

**Triggers:**
- Architecture changes
- Data model updates
- System design work
- Documentation updates

**Compliance:** ISO 27001 A.5.1, A.18.1, A.18.2

---

#### 14. [documentation-standards](./documentation-standards/SKILL.md)
**Purpose**: Enforce consistent documentation standards with bilingual support

**Key Rules:**
- JSDoc/TSDoc for all exported functions, classes, and interfaces
- Architecture documentation updated with code changes
- Bilingual Korean-English documentation with romanization
- Security documentation updated for security changes
- TypeDoc generates without errors

**Triggers:**
- New public APIs
- Architecture changes
- Korean terminology additions
- Security documentation updates

**Compliance:** ISO 27001 A.5.37, NIST CSF GV.PO/ID.AM

---

### 🎨 Visual & Cultural Standards

#### 15. [korean-theming-standards](./korean-theming-standards/SKILL.md)
**Purpose**: Enforce Korean cyberpunk aesthetic and cultural authenticity

**Key Rules:**
- Use KOREAN_COLORS constants for all colors
- Bilingual text format: `Korean | English`
- FONT_FAMILY.KOREAN for Korean text
- Authentic Eight Trigram symbols (☰☱☲☳☴☵☶☷)
- WCAG 2.1 AA contrast requirements (4.5:1)

**Triggers:**
- UI components
- Text content
- Color usage
- Korean martial arts content
- Cultural references

**Standards:** WCAG 2.1 AA, Korean typography, I Ching authenticity

---

### 🧪 Testing & Quality

#### 16. [testing-strategy-enforcement](./testing-strategy-enforcement/SKILL.md)
**Purpose**: Enforce comprehensive testing standards

**Key Rules:**
- >90% test coverage (line, function, branch, statement)
- Unit tests (Vitest) for all business logic
- E2E tests (Cypress) for user workflows
- Three.js component testing patterns
- Performance tests (<5ms, 60fps targets)
- Accessibility tests (WCAG 2.1 AA)

**Triggers:**
- New features
- Bug fixes
- Refactoring
- Performance optimizations

**Standards:** >90% coverage, WCAG 2.1 AA, 60fps performance

---

#### 17. [code-quality-excellence](./code-quality-excellence/SKILL.md)
**Purpose**: Enforce code quality standards for maintainable, type-safe code

**Key Rules:**
- Search existing code before creating new implementations
- No 'any' types, no type assertions without justification
- Function complexity < 10, lines < 50
- Organized imports: React → External → Internal → Types → Constants
- Explicit error handling with try/catch or null coalescing

**Triggers:**
- New code creation
- Code refactoring
- Type safety issues
- Complexity increases

**Compliance:** ISO 27001 A.8.25, NIST CSF PR.DS, CIS Controls 16

---

#### 18. [accessibility-wcag-patterns](./accessibility-wcag-patterns/SKILL.md)
**Purpose**: Enforce WCAG 2.1 Level AA accessibility for inclusive game design

**Key Rules:**
- Semantic HTML in Html overlays (nav, main, button, label)
- ARIA attributes for custom interactive components
- Keyboard navigation for all interactive elements
- WCAG AA contrast ratio: 4.5:1 normal, 3:1 large text
- Screen reader support via aria-live regions

**Triggers:**
- UI component creation
- Interactive element implementation
- Color usage with KOREAN_COLORS
- Game state announcements

**Compliance:** WCAG 2.1 Level AA, EN 301 549, ISO 27001 A.8.26

---

#### 19. [typescript-strict-patterns](./typescript-strict-patterns/SKILL.md)
**Purpose**: Maximize TypeScript type safety for compile-time error detection

**Key Rules:**
- Strict mode compliance (strict: true, no suppressions)
- No 'any' type (use 'unknown' with type guards)
- Readonly by default for interfaces and parameters
- Exhaustive pattern matching for union types
- Explicit return types for exported functions

**Triggers:**
- TypeScript code writing
- Type definition updates
- Pattern matching on enums/unions
- Interface design

**Compliance:** ISO 27001 A.8.25, CWE-843 (Type Confusion)

---

### ⚡ Performance & Optimization

#### 20. [performance-optimization](./performance-optimization/SKILL.md)
**Purpose**: Enforce 60fps rendering and optimal bundle size

**Key Rules:**
- 60fps target for all Three.js rendering
- Bundle size: <500KB initial, <2MB total
- Lighthouse performance score >90
- Memory leak prevention
- Efficient Three.js patterns (instancing, LOD, culling)

**Triggers:**
- Three.js rendering code
- Bundle size increases
- Performance regressions
- Memory leaks

**Metrics:** 60fps, <500KB initial, Lighthouse >90

---

### 🌐 Three.js Best Practices

#### 21. [threejs-best-practices](./threejs-best-practices/SKILL.md)
**Purpose**: Enforce @react-three/fiber patterns and Three.js optimization

**Key Rules:**
- Use @react-three/fiber and @react-three/drei
- Proper resource cleanup (dispose patterns)
- Html overlay vs 3D mesh decision guide
- Performance optimization (useFrame, useMemo, instancing)
- Korean-themed materials and lighting

**Triggers:**
- Three.js component creation
- 3D scene setup
- Performance issues
- Resource management

**Standards:** @react-three/fiber, React 19, Three.js r170+

---

### 🎮 Game Development & Combat

#### 22. [game-development-patterns](./game-development-patterns/SKILL.md)
**Purpose**: Enforce game development best practices for Black Trigram

**Key Rules:**
- Game loop with clamped delta (MAX_DELTA = 1/30)
- Fixed timestep for deterministic physics (60 Hz)
- State machine architecture for game flow
- Layered combat system (state, actions, rules, events)
- Delta-time independent animations

**Triggers:**
- Implementing game loops with `useFrame`
- Creating combat systems or state machines
- Managing game state (player, enemies, combat flow)
- Working with fixed timesteps or delta time
- Debugging timing or synchronization issues

**Standards:** 60fps, deterministic combat, proper state machines

---

#### 23. [korean-martial-arts-authenticity](./korean-martial-arts-authenticity/SKILL.md)
**Purpose**: Enforce authentic Korean martial arts systems (11 arts) with Dark Ops combat applications

**Key Rules:**
- All 11 Korean martial arts with proper terminology (Hapkido, Taekwondo, Taekyon, Kuk Sool Won, Tang Soo Do, Hwa Rang Do, Gumdo, Ssireum, Subak, Yudo, Gongkwon Yusul)
- Accurate Eight Trigram system (팔괘) with correct symbols and philosophy
- 70 vital points (급소) with anatomical precision
- Proper Korean terminology (Revised Romanization standard)
- Cultural context and educational tooltips
- 5 Korean special forces units with tactical integration
- Dark Ops combat applications (silent_kill, suppression, interrogation, mobility_denial)
- Equipment-enhanced combat (night vision +15%, cyber +25%)

**Triggers:**
- Implementing Eight Trigram stance system
- Adding vital point targeting
- Creating combat techniques from any Korean martial art
- Writing Korean martial arts terminology
- Implementing Dark Ops special forces techniques
- Adding tactical combat applications
- Integrating equipment-enhanced martial arts

**Standards:** Anatomical accuracy, cultural respect, I Ching authenticity, tactical realism, 11 martial arts coverage

---

#### 24. [3d-combat-systems](./3d-combat-systems/SKILL.md)
**Purpose**: Enforce 3D physics-based combat patterns for Black Trigram

**Key Rules:**
- Rapier physics integration for realistic combat
- Anatomically accurate hitbox/hurtbox system
- Deterministic damage calculations (no random)
- Trigram matchup multipliers
- Vital point damage modifiers

**Triggers:**
- Implementing physics-based combat with Rapier
- Creating collision detection systems
- Implementing attack/defense mechanics
- Calculating damage from strikes
- Creating hitboxes or hurtboxes

**Standards:** Physics-based, deterministic, anatomically accurate

---

#### 25. [audio-game-integration](./audio-game-integration/SKILL.md)
**Purpose**: Enforce audio best practices for immersive combat feedback

**Key Rules:**
- Howler.js for global audio management
- PositionalAudio for spatial 3D combat sounds
- Korean-themed soundscapes (traditional instruments)
- Distinct audio for hit/miss/critical outcomes
- Proper audio resource management and cleanup

**Triggers:**
- Adding audio effects or music
- Implementing spatial 3D audio
- Creating combat sound feedback
- Managing audio resources
- Optimizing audio performance

**Standards:** Spatial audio, Korean themes, clear feedback

---

#### 26. [github-agentic-workflows](./github-agentic-workflows/SKILL.md)
**Purpose**: Enforce comprehensive GitHub Agentic Workflows (gh-aw) best practices for AI-powered automation

**Key Rules:**
- Defense-in-depth security (5 layers: substrate, configuration, plan, runtime, output)
- Safe outputs for all write operations (permission isolation)
- Read-only agent permissions by default
- Network isolation with explicit domain allowlists
- MCP server sandboxing and tool filtering
- Threat detection with AI-powered analysis
- Workflow compilation and validation (strict mode)
- Token management with GitHub App preferred
- Operational pattern alignment (12 OpPatterns)
- Memory management (cache-memory, repo-memory)
- Natural language instructions over procedural logic
- Frontmatter configuration standards

**Triggers:**
- Creating or modifying `.github/workflows/*.md` files
- Configuring workflow frontmatter (YAML)
- Implementing safe outputs (create-issue, add-comment, create-pull-request)
- Setting up MCP servers or custom tools
- Configuring network permissions and firewall
- Using GitHub Copilot CLI, Claude, or Codex engines
- Implementing operational patterns (IssueOps, ChatOps, DailyOps)
- Managing workflow state and memory
- Designing AI workflow security

**Compliance:** ISO 27001 (A.5.15, A.8.2, A.8.3, A.8.22, A.8.25, A.8.28), NIST CSF 2.0 (GV.PO, ID.RA, PR.AC, PR.DS, PR.IP, DE.CM, RS.MA), CIS Controls v8.1 (2.3, 3.3, 4.1, 4.7, 12.2, 16.1, 18.3)

**Reference**: [GitHub Agentic Workflows Documentation](https://github.github.com/gh-aw/)

---

#### 27. [ai-governance](./ai-governance/SKILL.md)
**Purpose**: Enforce AI governance for transparent, accountable AI-assisted development

**Key Rules:**
- AI-generated code reviewed for security, license, and correctness
- Agent governance via agents/*.md instructions and skills enforcement
- No sensitive data (secrets, PII) sent to AI services
- Mandatory human review for security-critical AI code
- Agent files must be < 30,000 characters
- AI contributions documented in PR descriptions

**Triggers:**
- AI-assisted code generation
- Agent configuration updates
- Security-critical code review
- AI tool integration

**Compliance:** EU AI Act, ISO 27001 A.5.1, NIST AI RMF

---

## 🎯 How Skills Work

### Automatic Activation

Skills are **automatically loaded** by GitHub Copilot when relevant context is detected:

```
IF (file contains "SECURITY_ARCHITECTURE")
THEN load security-architecture-validation

IF (file contains "KOREAN_COLORS" OR "한글")
THEN load korean-theming-standards

IF (file contains "describe(" OR "it(")
THEN load testing-strategy-enforcement

IF (file contains "@react-three/fiber")
THEN load threejs-best-practices
```

### Enforcement Flow

Skills detect context → Load relevant skills → Apply rules → Accept/reject with suggestions → Developer fixes → Re-check

### Multiple Skills

Copilot can load **multiple skills simultaneously**:

```
IF (Three.js security code with Korean UI)
THEN load [security-architecture-validation, 
          korean-theming-standards,
          threejs-best-practices]
```

---

## 📖 Skill Structure

Every skill follows this structure:

```markdown
---
name: skill-name
description: Brief description of the skill's purpose
license: MIT
---

# Skill Title

## Purpose
Clear statement of what this skill enforces

## When to Apply
Specific triggers and contexts

## Core Principles
Strategic, high-level rules

### 1. Principle Name
Explanation and rules

### 2. Another Principle
More strategic guidance

## Enforcement Rules
Rule 1: IF-THEN-ELSE logic
Rule 2: Clear enforcement criteria

## Anti-Patterns to REJECT
❌ Bad Pattern 1
❌ Bad Pattern 2

## Required Patterns
✅ Good Pattern 1
✅ Good Pattern 2

## Compliance Framework
ISO 27001, NIST CSF, CIS Controls alignment

## Remember
Key takeaways and philosophy
```

---

## 🛠️ Using Skills in Development

### VS Code (with Copilot)

Skills are **automatically loaded** - no manual activation needed!

```typescript
// Copilot automatically loads korean-theming-standards
const colors = {
  primary: KOREAN_COLORS.PRIMARY_CYAN,  // ✅ Copilot suggests this
  text: "#00FFFF"  // ❌ Copilot flags: "Use KOREAN_COLORS constant"
};
```

### GitHub Copilot CLI

```bash
# Skills are applied during code generation
gh copilot suggest "Create a security validator"
# → Loads security-architecture-validation automatically

gh copilot suggest "Build a Korean-themed button"
# → Loads korean-theming-standards automatically
```

### Pull Request Reviews

Skills inform Copilot's code review:

```yaml
# .github/workflows/copilot-review.yml
# Skills are automatically applied during PR review
- Security changes without SECURITY_ARCHITECTURE.md update → flagged
- Korean UI without WCAG AA contrast → flagged
- New feature without tests → flagged
```

---

## 🔧 Creating New Skills

### When to Create a Skill

Create a new skill when you have:

✅ **Strategic principles** that apply across the codebase  
✅ **Enforceable rules** that can be checked automatically  
✅ **Common patterns** that developers should follow  
✅ **Anti-patterns** that should be avoided  
✅ **Compliance requirements** that must be met

❌ **Don't create skills for:**
- One-off tasks (use agents instead)
- Procedural workflows (use agents)
- Temporary guidelines
- Non-enforceable recommendations

### Skill Creation Template

Follow the structure used by existing skills: YAML frontmatter (name, description, license) → Purpose → When to Apply → Core Principles → Enforcement Rules (IF-THEN-ELSE) → Anti-Patterns → Required Patterns → Compliance Framework → Remember. See any existing skill in this directory for a complete example.

### Skill Naming Convention

- **Lowercase with hyphens**: `security-architecture-validation`
- **Descriptive and specific**: `korean-theming-standards` not `ui-rules`
- **Action-oriented**: `testing-strategy-enforcement` not `testing-docs`

---

## 📊 Skill Quality Standards

All skills must include: YAML frontmatter, clear purpose, activation triggers, IF-THEN-ELSE enforcement rules, anti-patterns with examples, required patterns with examples, compliance framework alignment, and Korean philosophy integration.

**Naming Convention:** Lowercase with hyphens, descriptive and specific, action-oriented (e.g., `testing-strategy-enforcement`).

---

## 🔗 Integration with Agents

Skills and agents work together:

| **Skills Provide** | **Agents Use** |
|-------------------|---------------|
| Strategic principles | Tactical implementations |
| Enforcement rules | Execution logic |
| Quality standards | Quality checks |
| Anti-patterns to avoid | Pattern detection |

**Skills provide** strategic principles, enforcement rules, quality standards, and anti-patterns → **Agents use** them for tactical implementations, execution logic, quality checks, and pattern detection.

**Workflow:** Developer requests task → Copilot loads relevant skills → Agent implements with skill constraints → Skills validate output → Code generated with best practices.

---

## 📈 Success Metrics

### Skill Effectiveness

Track skill effectiveness through:

1. **Enforcement Rate**: % of PRs that comply with skills
2. **Violation Detection**: Issues caught by skills
3. **Developer Feedback**: Usefulness ratings
4. **Code Quality**: Metrics before/after skill adoption

### Target Metrics

- **Security Violations**: <5% of PRs
- **Testing Coverage**: >90% maintained
- **ISMS Compliance**: 100% policy references
- **Korean Theming**: 100% WCAG AA compliance
- **Performance**: >95% meet 60fps target

---

## 🔄 Skill Maintenance

- **Monthly**: Update examples with latest patterns
- **Quarterly**: Review enforcement rules effectiveness
- **Annually**: Major revisions for framework updates
- Update when: new ISMS policies, framework updates, technology changes, recurring violations

---

## 🎓 Learning Resources

### Official Documentation

- [GitHub Copilot Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [VS Code Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [GitHub Blog: Agent Skills Announcement](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/)

### Best Practices

- [Anthropic Skills Repository](https://github.com/anthropics/skills)
- [Awesome Copilot](https://github.com/github/awesome-copilot)
- [Teaching AI Your Repository Patterns](https://dev.to/qa-leaders/github-copilot-agent-skills-teaching-ai-your-repository-patterns-1oa8)

### Hack23 ISMS Framework

- [Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md)
- [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
- [Vulnerability Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md)

---

## 🤝 Contributing

### Adding New Skills

1. Identify a strategic need (not tactical implementation)
2. Create skill directory: `.github/skills/skill-name/`
3. Write comprehensive `SKILL.md` using template
4. Include code examples and anti-patterns
5. Add compliance framework alignment
6. Test with actual development scenarios
7. Update this README with new skill documentation

### Improving Existing Skills

1. Gather developer feedback
2. Identify gaps or unclear rules
3. Add better examples
4. Clarify enforcement logic
5. Update compliance references
6. Submit PR with improvements

---

## 📝 License

All skills are licensed under **MIT License**, ensuring they can be freely used, modified, and shared.

---

## 🎯 Philosophy

### 흑괘의 지혜를 따르라

_Follow the Wisdom of the Black Trigram_

Just as Korean martial arts teach precision, discipline, and adaptability, our skills enforce:

- **정확성 (Jeonghaek-seong)** - Precision in code and documentation
- **훈련 (Hullyeon)** - Disciplined adherence to standards
- **적응성 (Jeok-eung-seong)** - Adaptive quality enforcement
- **존중 (Jonjung)** - Respect for cultural authenticity
- **완벽성 (Wanbyeok-seong)** - Pursuit of perfection

**Every skill is a step on the path to mastery.**

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

---

**Project**: Black Trigram (흑괘)  
**Owner**: Hack23 AB  
**License**: MIT  
**Version**: 2.0  
**Last Updated**: 2026-02-20
