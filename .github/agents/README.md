# GitHub Copilot Agent Instructions

This directory contains specialized agent instruction files for GitHub Copilot to assist with different aspects of Black Trigram (흑괘) development.

## What are Copilot Agents?

GitHub Copilot agents are specialized AI assistants with focused expertise in specific domains. Each agent has detailed instructions that help it provide better, more contextual assistance for particular tasks.

## Available Agents

### 🛠️ [Coding Agent](./coding-agent.md)
**Specialization**: TypeScript/React/PixiJS Development

**Use for:**
- Implementing new features
- Creating UI components
- Fixing bugs
- Refactoring code
- Integrating Korean theming
- Working with PixiJS and layout system

**Key Responsibilities:**
- Component development with React + PixiJS
- Korean theming and bilingual text support
- Layout system integration
- Combat system implementation
- Error handling and type safety

---

### ⚛️ [Frontend Specialist](./frontend-specialist.md)
**Specialization**: React 19 + Strict TypeScript

**Use for:**
- React 19 features and patterns
- Strict TypeScript configuration
- Component architecture design
- React Testing Library tests
- State management patterns
- Type-safe development

**Key Responsibilities:**
- React 19 best practices
- Strict TypeScript enforcement
- Component composition patterns
- React Testing Library integration
- Performance optimization
- Type safety validation

---

### 🎮 [Game Developer](./game-developer.md)
**Specialization**: PixiJS 8.x + Game Systems

**Use for:**
- PixiJS 8.x integration
- Game loop implementation
- Audio system integration
- Performance optimization
- Collision detection
- Rendering optimization

**Key Responsibilities:**
- PixiJS v8 best practices
- Game loop patterns
- Audio management with Howler.js
- Texture and resource management
- Object pooling
- 60fps optimization

---

### 🧪 [Testing Agent](./testing-agent.md)
**Specialization**: Vitest & Cypress Testing

**Use for:**
- Writing unit tests
- Creating integration tests
- Developing E2E tests
- Debugging test failures
- Improving test coverage
- Testing Korean UI components

**Key Responsibilities:**
- Unit testing with Vitest
- PixiJS component testing
- Combat system testing
- Responsive design testing
- E2E testing with Cypress

---

### 🔬 [Test Engineer](./test-engineer.md)
**Specialization**: Vitest + Cypress + CI Integration

**Use for:**
- Comprehensive test strategies
- Coverage enforcement
- CI/CD test integration
- Test parallelization
- Performance testing
- Accessibility testing

**Key Responsibilities:**
- Test suite organization
- Coverage threshold enforcement
- GitHub Actions integration
- Visual regression testing
- Test metrics and reporting
- Mutation testing

---

### 📚 [Documentation Agent](./documentation-agent.md)
**Specialization**: Technical & Game Documentation

**Use for:**
- Writing code documentation
- Creating API documentation
- Explaining Korean martial arts concepts
- Writing tutorials and guides
- Maintaining architecture docs
- Bilingual documentation (Korean/English)

**Key Responsibilities:**
- TSDoc/JSDoc comments
- README and guide creation
- Korean terminology documentation
- Component usage documentation
- Architecture documentation

---

### 📝 [Documentation Writer](./documentation-writer.md)
**Specialization**: Technical Docs + Security Policies

**Use for:**
- TSDoc/JSDoc code documentation
- User guides and tutorials
- Security policy documentation
- API reference documentation
- Korean cultural context
- Bilingual content creation

**Key Responsibilities:**
- Comprehensive code documentation
- User guide creation
- Security policy writing (SECURITY.md)
- API reference generation
- Korean martial arts explanations
- Bilingual technical writing

---

### 🔍 [Code Review Agent](./code-review-agent.md)
**Specialization**: Code Quality & Standards

**Use for:**
- Reviewing pull requests
- Checking code quality
- Verifying Korean theming compliance
- Validating test coverage
- Ensuring accessibility
- Performance review

**Key Responsibilities:**
- Code quality assessment
- Korean theming compliance
- Testing coverage verification
- Performance review
- Security assessment
- Accessibility validation

---

### 🔒 [Security & Performance Agent](./security-performance-agent.md)
**Specialization**: Security & Optimization

**Use for:**
- Security vulnerability assessment
- Performance optimization
- Memory leak detection
- Bundle size reduction
- FPS optimization
- Security best practices

**Key Responsibilities:**
- Security audits
- Performance profiling
- React/PixiJS optimization
- Memory management
- Bundle analysis
- Load time optimization

---

### 🛡️ [Security Specialist](./security-specialist.md)
**Specialization**: Supply Chain + Compliance

**Use for:**
- Supply chain security
- OSSF Scorecard compliance
- SBOM generation
- License compliance
- Vulnerability management
- Security automation

**Key Responsibilities:**
- Dependency security scanning
- OSSF Scorecard optimization
- Software Bill of Materials (SBOM)
- License compatibility checking
- Automated security workflows
- Security policy enforcement

## How to Use These Agents

### With GitHub Copilot Chat

When using GitHub Copilot in your IDE, you can reference these agents:

```
@workspace /explain this component following the patterns in .github/agents/coding-agent.md
```

```
@workspace Help me write tests for this component using patterns from .github/agents/testing-agent.md
```

### With GitHub Copilot Pull Requests

These agents help Copilot provide better code review feedback when reviewing PRs.

### With GitHub Copilot CLI

```bash
gh copilot suggest "Create a new combat component following .github/agents/coding-agent.md"
```

## Agent Development Guidelines

All agents should:

✅ Reference the main `.github/copilot-instructions.md` file
✅ Provide specific, actionable guidance
✅ Include code examples
✅ Follow the project's Korean theming requirements
✅ Emphasize testing and quality standards
✅ Be focused on their specific domain
✅ Include anti-patterns to avoid
✅ Provide checklists where applicable

## Relationship to Main Instructions

These agent files are **complementary** to the main `.github/copilot-instructions.md` file:

- **Main Instructions**: Comprehensive coding guidelines for all developers and Copilot
- **Agent Files**: Specialized, task-focused instructions for specific activities

**Always consult both:**
1. The agent file for specialized, task-specific guidance
2. The main instructions for comprehensive patterns and standards

## Korean Philosophy Integration

All agents respect Black Trigram's core philosophy:

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

- Traditional Korean martial arts wisdom
- Modern interactive technology
- Cyberpunk Korean aesthetic
- Bilingual support (Korean | English)
- Cultural authenticity and respect

## Updating Agents

When updating agent instructions:

1. Ensure consistency with main `.github/copilot-instructions.md`
2. Add relevant code examples
3. Update checklists and anti-patterns
4. Test with actual Copilot interactions
5. Keep focus on the agent's specialization
6. Maintain Korean cultural context

## Contributing

When adding new agents:

1. Identify a clear, focused specialization
2. Create comprehensive instructions
3. Include practical examples
4. Add to this README
5. Link to related documentation
6. Ensure Korean theming integration

## Success Metrics

Effective agents should:

✅ Reduce development time
✅ Improve code quality
✅ Ensure consistent patterns
✅ Maintain Korean theming
✅ Increase test coverage
✅ Enhance documentation quality
✅ Improve security posture
✅ Optimize performance

## Support

For questions or issues:

- Review `.github/copilot-instructions.md` for comprehensive guidelines
- Check existing codebase for established patterns
- Consult game design docs: `game-design.md`, `COMBAT_ARCHITECTURE.md`
- See architectural docs: `ARCHITECTURE.md`

---

**Project**: Black Trigram (흑괘)
**Description**: A realistic 2D precision combat game inspired by Korean martial arts
**Tech Stack**: React, TypeScript, PixiJS, Vite, Vitest, Cypress

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
