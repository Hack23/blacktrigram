# GitHub Copilot MCP Configuration

This repository is configured with Model Context Protocol (MCP) servers to enhance GitHub Copilot's capabilities for this project.

## 🤖 What is MCP?

Model Context Protocol (MCP) is a protocol that allows AI assistants like GitHub Copilot to interact with external tools and services. This enables Copilot to:

- Access and understand your repository structure
- Run browser automation for testing
- Execute file operations with proper context
- Use advanced reasoning for complex problems

## 🔧 Configured MCP Servers

This project uses the following MCP servers to optimize Copilot for our React + PixiJS game development stack:

### 1. GitHub Server (`@modelcontextprotocol/server-github`)

**Purpose**: Enables Copilot to interact with GitHub repository features

**Capabilities**:
- Read repository files and structure
- Access commit history and branches
- View pull requests and issues
- Search code across the repository
- List and analyze workflows

**Use Cases**:
- Understanding codebase organization
- Finding related code changes
- Analyzing test results from CI/CD
- Reviewing workflow configurations

### 2. Playwright Server (`@executeautomation/playwright-mcp-server`)

**Purpose**: Browser automation for testing and debugging

**Capabilities**:
- Navigate web pages
- Take screenshots of the game
- Interact with UI elements
- Execute JavaScript in browser context
- Capture network requests
- Test responsive layouts

**Use Cases**:
- E2E test development
- Visual regression testing
- Debugging UI issues
- Testing PixiJS rendering
- Validating game mechanics

### 3. Filesystem Server (`@modelcontextprotocol/server-filesystem`)

**Purpose**: Direct filesystem access with project context

**Capabilities**:
- Read and write files
- Search directory structures
- Create and delete files
- Move and rename files
- List directory contents

**Use Cases**:
- Code refactoring
- Asset management (sprites, audio)
- Configuration updates
- Generating boilerplate code
- Organizing project structure

### 4. Sequential Thinking Server (`@modelcontextprotocol/server-sequential-thinking`)

**Purpose**: Enhanced reasoning for complex problems

**Capabilities**:
- Multi-step problem solving
- Breaking down complex tasks
- Maintaining context across steps
- Reasoning about architectural decisions

**Use Cases**:
- Game architecture planning
- Combat system design
- Performance optimization strategies
- Debugging complex state issues
- Designing new features

## 📋 Setup Configuration

### Automatic Setup with Copilot Workspace

The `.github/copilot-setup-steps.yml` file configures automatic dependency installation when Copilot Workspace starts:

**Pre-installed dependencies**:
- Node.js 24 environment
- System libraries for PixiJS and graphics rendering
- Chrome browser for testing
- Display server for headless testing
- npm packages and dependencies
- Global MCP server packages
- TypeScript and ESLint tools

**Environment variables**:
- `DISPLAY`: Configured for headless testing
- `GITHUB_TOKEN`: Automatically provided by GitHub
- `NPM_CONFIG_*`: Optimized npm settings

### MCP Server Configuration

The `.github/copilot-mcp.json` file defines how Copilot connects to each MCP server:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}" }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/runner/work/blacktrigram/blacktrigram"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

### Validating Configuration

You can validate the MCP configuration at any time using:

```bash
npm run validate:mcp
```

This will check:
- File existence and validity
- JSON and YAML syntax
- Required MCP servers are configured
- Documentation is properly linked

## 🎮 Game Development Use Cases

### Korean Martial Arts Combat System

**Scenario**: Implementing trigram-based combat mechanics

**MCP Assistance**:
1. **Sequential Thinking**: Plan the eight trigram stance system architecture
2. **GitHub**: Search for similar combat systems in other projects
3. **Filesystem**: Generate trigram component files with Korean translations
4. **Playwright**: Test stance selection and combat animations

### PixiJS Performance Optimization

**Scenario**: Optimizing sprite rendering and animation

**MCP Assistance**:
1. **Sequential Thinking**: Analyze performance bottlenecks
2. **Filesystem**: Locate all sprite usage across components
3. **Playwright**: Capture performance metrics during gameplay
4. **GitHub**: Review commit history for previous optimizations

### E2E Testing for Combat

**Scenario**: Creating end-to-end tests for combat scenarios

**MCP Assistance**:
1. **Playwright**: Automate combat sequence interactions
2. **Filesystem**: Generate test fixtures for different archetypes
3. **GitHub**: Review existing test patterns
4. **Sequential Thinking**: Design comprehensive test coverage strategy

### Audio Asset Management

**Scenario**: Organizing and implementing Korean martial arts sound effects

**MCP Assistance**:
1. **Filesystem**: Restructure audio directories by category
2. **GitHub**: Track audio asset changes in commit history
3. **Sequential Thinking**: Design audio state management system
4. **Playwright**: Test audio playback in different scenarios

## 🚀 Using MCP with Copilot

### In Copilot Chat

When working with Copilot Chat, you can explicitly request MCP functionality:

**Examples**:
- "Use the filesystem server to find all components that use PixiJS containers"
- "With the GitHub server, show me recent changes to the combat system"
- "Use Playwright to take a screenshot of the trigram selector"
- "Apply sequential thinking to design the new vital points targeting system"

### Automatic Context

Copilot automatically uses MCP servers to:
- Understand your project structure when making suggestions
- Provide context-aware code completions
- Generate tests that match your testing patterns
- Suggest imports from your existing code

## 🔒 Security Considerations

### Token Access

The GitHub MCP server uses `GITHUB_TOKEN` which is:
- Automatically provided by GitHub Copilot Workspace
- Read-only for most operations
- Scoped to the current repository
- Never exposed in logs or artifacts

### Filesystem Boundaries

The filesystem MCP server is restricted to:
- The project directory: `/home/runner/work/blacktrigram/blacktrigram`
- No access to system files
- No access to other repositories

### Network Access

MCP servers can only:
- Access GitHub API
- Run local browser automation
- No access to arbitrary external services

## 📚 Additional Resources

### MCP Documentation
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [GitHub Copilot MCP Guide](https://docs.github.com/copilot/using-github-copilot/using-mcp-servers)

### MCP Server Repositories
- [@modelcontextprotocol/server-github](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [@executeautomation/playwright-mcp-server](https://github.com/executeautomation/playwright-mcp-server)
- [@modelcontextprotocol/server-filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)
- [@modelcontextprotocol/server-sequential-thinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking)

### Project Documentation
- [Development Guide](./development.md)
- [Contributing](./CONTRIBUTING.md)
- [Game Design](./game-design.md)
- [Architecture](./ARCHITECTURE.md)

## 🎯 Philosophy

**Black Trigram (흑괘)** represents the intersection of traditional Korean martial arts wisdom and modern interactive technology. MCP servers enhance this philosophy by:

- **Respecting context**: Understanding the Korean cultural elements in our code
- **Enabling precision**: Like martial arts, our tools help achieve perfect execution
- **Building mastery**: Progressive assistance that helps developers learn and improve
- **Maintaining authenticity**: Supporting bilingual (Korean-English) development

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
