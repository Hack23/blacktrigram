# Creating Release Issues

This directory contains scripts to automate creation of GitHub issues for releases.

## Quick Start

To create all 5 priority issues for the next release:

```bash
# 1. Install GitHub CLI (if not already installed)
# Visit: https://cli.github.com/

# 2. Authenticate with GitHub
gh auth login

# 3. Run the script
./scripts/create-release-issues.sh
```

## What Gets Created

The script creates 5 issues:

1. **⚡ Test Coverage** - Increase from 49.56% to 70%+ (Critical, Large)
2. **🔒 Security Vulnerabilities** - Fix 6 npm vulnerabilities (Critical, Small)
3. **🎨 Animation System** - Wire spritesheet integration (High, Large)
4. **⚡ Bundle Optimization** - Reduce 1.23MB to <800KB (High, Medium)
5. **🛡️ ZAP Security Findings** - Fix 12 OWASP findings (High, Medium)

All issues include:
- Accurate baseline metrics from current codebase
- Specific, testable acceptance criteria
- Detailed implementation guidance with file paths
- Clear priority and effort estimates

## Manual Creation

If you prefer to create issues manually, see [`RELEASE_ISSUES.md`](../RELEASE_ISSUES.md) for complete issue bodies to copy/paste.

## Troubleshooting

**"gh: command not found"**
- Install GitHub CLI: https://cli.github.com/

**"Not authenticated with GitHub"**
- Run: `gh auth login`
- Follow the prompts to authenticate

**"Permission denied"**
- Make script executable: `chmod +x scripts/create-release-issues.sh`

## Script Details

- **Location:** `scripts/create-release-issues.sh`
- **Requirements:** GitHub CLI (`gh`) with authentication
- **Repository:** Hack23/blacktrigram
- **Labels:** Automatically applied based on issue type
- **Source:** All content from `RELEASE_ISSUES.md`
