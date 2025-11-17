## Contributing

[fork]: /fork
[pr]: /compare
[code-of-conduct]: CODE_OF_CONDUCT.md

Hi there! We're thrilled that you'd like to contribute to this project. Your help is essential for keeping it great.

Please note that this project is released with a [Contributor Code of Conduct][code-of-conduct]. By participating in this project you agree to abide by its terms.

## Issues and PRs

If you have suggestions for how this project could be improved, or want to report a bug, open an issue! We'd love all and any contributions. If you have questions, too, we'd love to hear them.

We'd also love PRs. If you're thinking of a large PR, we advise opening up an issue first to talk about it, though! Look at the links below if you're not sure how to open a PR.

## Submitting a pull request

1. [Fork][fork] and clone the repository.
1. Configure and install the dependencies: `npm install`
1. Make sure the tests pass on your machine: `npm test`
1. Create a new branch: `git checkout -b my-branch-name`
1. Make your change, add tests, and make sure the tests still pass.
1. Push to your fork and [submit a pull request][pr].
1. Pat your self on the back and wait for your pull request to be reviewed and merged.

Here are a few things you can do that will increase the likelihood of your pull request being accepted:

- Write and update tests.
- Keep your changes as focused as possible. If there are multiple changes you would like to make that are not dependent upon each other, consider submitting them as separate pull requests.
- Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).

Work in Progress pull requests are also welcome to get feedback early on, or if there is something blocked you.

## 🤖 Using GitHub Copilot

This project is fully configured for GitHub Copilot with comprehensive instructions and custom agents:

### Quick Start with Copilot

1. **Read the Instructions**: Start with [.github/copilot-instructions.md](.github/copilot-instructions.md) for coding patterns and best practices
2. **Use Custom Agents**: Check [.github/agents/README.md](.github/agents/README.md) for specialized agents:
   - 🛠️ Coding Agent - Feature implementation and bug fixes
   - ⚛️ Frontend Specialist - React 19 and TypeScript
   - 🎮 Game Developer - PixiJS game systems
   - 🧪 Testing Agent - Vitest and Cypress tests
   - 📝 Documentation Writer - Technical documentation
   - 🛡️ Security Specialist - Security and dependencies
   - 🔍 Code Review Agent - Code quality reviews

3. **MCP Configuration**: The project uses Model Context Protocol servers for enhanced capabilities - see [.github/COPILOT_MCP_SETUP.md](.github/COPILOT_MCP_SETUP.md)

### Development Workflow with Copilot

```bash
# Validate your setup
npm run validate:mcp

# Start development with Copilot assistance
npm run dev

# Run checks before committing
npm run check      # TypeScript validation
npm run lint       # Code quality
npm test           # Unit tests
```

### Best Practices

- Follow the patterns in [copilot-instructions.md](.github/copilot-instructions.md)
- Use the appropriate custom agent for your task
- Include Korean-English bilingual text for all user-facing strings
- Add `data-testid` attributes for testable components
- Follow the React + PixiJS integration patterns
- Maintain 60fps performance targets

## 🔐 Security Contribution Guidelines

Black Trigram follows Hack23 AB's [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md). All contributions must:

### Security Requirements

- **🔍 Security Testing**: Run security checks before submitting PRs
  ```bash
  npm run check        # TypeScript validation
  npm run lint         # ESLint security rules
  npm test             # Unit tests with security test cases
  npm run test:e2e     # E2E security tests
  ```

- **📦 Dependency Security**: All new dependencies must:
  - Have no known high/critical vulnerabilities
  - Use exact version pinning (no `^` or `~`)
  - Include justification in PR description
  - Pass FOSSA license compliance check

- **🛡️ Secure Coding**: Follow secure coding practices:
  - No hardcoded secrets or credentials
  - Input validation for all user inputs
  - Proper error handling (no sensitive data in errors)
  - CSP-compliant code (no inline scripts)
  - Follow [OWASP Top 10](https://owasp.org/www-project-top-ten/) guidelines

- **🎯 Vulnerability Reporting**: Report security issues via:
  - [GitHub Security Advisories](https://github.com/Hack23/blacktrigram/security/advisories)
  - Follow [SECURITY.md](./SECURITY.md) disclosure process
  - Do NOT open public issues for security vulnerabilities

### ISMS Policy References

Contributors should be familiar with:

- [🛠️ Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) - Security-integrated SDLC standards
- [🔍 Vulnerability Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md) - Security testing procedures
- [🔓 Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md) - Open source governance
- [📝 Change Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Change_Management.md) - Risk-controlled changes

## Resources

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Using Pull Requests](https://help.github.com/articles/about-pull-requests/)
- [GitHub Help](https://help.github.com)

---

## 📚 Related Documents

### 🔐 Security & Compliance
- [🔒 Security Policy](./SECURITY.md) - Vulnerability reporting process
- [🛡️ Security Architecture](./SECURITY_ARCHITECTURE.md) - Security implementation
- [🎯 Threat Model](./THREAT_MODEL.md) - Security threat analysis
- [📋 CRA Assessment](./CRA-ASSESSMENT.md) - EU Cyber Resilience Act compliance
- [🗺️ ISMS Reference Mapping](./ISMS_REFERENCE_MAPPING.md) - Complete ISMS policy mapping

### 🛠️ Development
- [🔧 Development Guide](./development.md) - Security features and testing
- [🔄 Workflows](./WORKFLOWS.md) - CI/CD security automation
- [📐 Architecture](./ARCHITECTURE.md) - System design

### 🧪 Testing
- [🧪 Unit Test Plan](./UnitTestPlan.md) - Unit testing strategy
- [🎯 E2E Test Plan](./E2ETestPlan.md) - End-to-end testing

---

**📋 Document Control:**  
**✅ Approved by:** James Pether Sörling, CEO  
**📤 Distribution:** Public  
**🏷️ Classification:** [![Confidentiality: Public](https://img.shields.io/badge/C-Public-lightgrey?style=flat-square&logo=shield&logoColor=black)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#confidentiality-levels) [![Integrity: Moderate](https://img.shields.io/badge/I-Moderate-yellow?style=flat-square&logo=check-circle&logoColor=black)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#integrity-levels) [![Availability: Standard](https://img.shields.io/badge/A-Standard-lightgreen?style=flat-square&logo=server&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#availability-levels)  
**📅 Effective Date:** 2025-01-15  
**⏰ Next Review:** 2025-04-15  
**🎯 Framework Compliance:** [![ISO 27001](https://img.shields.io/badge/ISO_27001-2022_Aligned-blue?style=flat-square&logo=iso&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![NIST CSF 2.0](https://img.shields.io/badge/NIST_CSF-2.0_Aligned-green?style=flat-square&logo=nist&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![CIS Controls](https://img.shields.io/badge/CIS_Controls-v8.1_Aligned-orange?style=flat-square&logo=cisecurity&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)
