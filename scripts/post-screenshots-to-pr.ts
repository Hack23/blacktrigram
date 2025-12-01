/**
 * Post Screenshots to GitHub PR
 * 
 * This script posts the screenshot analysis report to the current PR
 * using GitHub's API.
 * 
 * Usage:
 *   GITHUB_TOKEN=xxx PR_NUMBER=123 npx tsx scripts/post-screenshots-to-pr.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots');
const REPORT_PATH = path.join(SCREENSHOTS_DIR, 'reports', 'ui-ux-analysis.md');

interface GitHubAPIConfig {
  token: string;
  owner: string;
  repo: string;
  prNumber: number;
}

/**
 * Get GitHub API configuration from environment
 */
function getGitHubConfig(): GitHubAPIConfig {
  const token = process.env.GITHUB_TOKEN;
  const prNumber = process.env.PR_NUMBER || process.env.GITHUB_PR_NUMBER;
  
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }
  
  if (!prNumber) {
    throw new Error('PR_NUMBER or GITHUB_PR_NUMBER environment variable is required');
  }
  
  // Parse owner/repo from GITHUB_REPOSITORY or use defaults
  const repoEnv = process.env.GITHUB_REPOSITORY || 'Hack23/blacktrigram';
  const [owner, repo] = repoEnv.split('/');
  
  return {
    token,
    owner: owner || 'Hack23',
    repo: repo || 'blacktrigram',
    prNumber: parseInt(prNumber, 10),
  };
}

/**
 * Upload screenshot to GitHub as a PR comment attachment
 */
async function uploadScreenshot(
  config: GitHubAPIConfig,
  screenshotPath: string
): Promise<string | null> {
  try {
    const screenshotName = path.basename(screenshotPath);
    const screenshotData = fs.readFileSync(screenshotPath);
    const base64Data = screenshotData.toString('base64');
    
    console.log(`  📤 Uploading ${screenshotName}...`);
    
    // Note: GitHub doesn't have a direct upload API for PR comments
    // Instead, we'll embed images as base64 data URLs or reference them from the repo
    // For production, consider using GitHub releases or external image hosting
    
    // For now, we'll assume screenshots are committed to the repo
    const repoPath = `screenshots/${screenshotName}`;
    return repoPath;
    
  } catch (error) {
    console.error(`  ❌ Failed to process ${screenshotPath}:`, error);
    return null;
  }
}

/**
 * Create PR comment with screenshots and analysis
 */
async function createPRComment(
  config: GitHubAPIConfig,
  reportContent: string,
  screenshotPaths: string[]
): Promise<void> {
  const { token, owner, repo, prNumber } = config;
  
  console.log('\n📝 Creating PR comment...');
  
  try {
    // Build comment body with embedded screenshots
    let commentBody = `## 📸 Automated UI/UX Screenshot Analysis\n\n`;
    commentBody += `This comment contains automated screenshots of all major screens in the application.\n\n`;
    commentBody += `### 🎯 Quick Preview\n\n`;
    
    // Add thumbnail grid
    commentBody += `<table>\n`;
    commentBody += `<tr>\n`;
    
    const screenshotNames = screenshotPaths.map(p => path.basename(p));
    for (let i = 0; i < screenshotNames.length; i += 4) {
      const row = screenshotNames.slice(i, i + 4);
      row.forEach(name => {
        const url = `https://raw.githubusercontent.com/${owner}/${repo}/copilot/analyze-ui-ux-completeness/screenshots/${name}`;
        commentBody += `<td width="25%"><img src="${url}" width="100%" /></td>\n`;
      });
      commentBody += `</tr>\n<tr>\n`;
      row.forEach(name => {
        const displayName = name.replace('.png', '').replace(/-/g, ' ');
        commentBody += `<td align="center"><small>${displayName}</small></td>\n`;
      });
      commentBody += `</tr>\n`;
      
      if (i + 4 < screenshotNames.length) {
        commentBody += `<tr>\n`;
      }
    }
    
    commentBody += `</table>\n\n`;
    
    commentBody += `### 📊 Detailed Analysis\n\n`;
    commentBody += `<details>\n<summary>Click to expand full analysis report</summary>\n\n`;
    commentBody += reportContent;
    commentBody += `\n</details>\n\n`;
    
    commentBody += `---\n\n`;
    commentBody += `🤖 *This analysis was automatically generated using Playwright automation*\n`;
    
    // Post comment using GitHub API
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`;
    
    console.log(`  📍 Posting to: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: commentBody,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}\n${errorText}`);
    }
    
    const result = await response.json();
    console.log(`  ✅ Comment posted: ${result.html_url}`);
    
  } catch (error) {
    console.error('  ❌ Failed to create PR comment:', error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🎮 Black Trigram - Post Screenshots to PR\n');
  
  try {
    // Get GitHub configuration
    const config = getGitHubConfig();
    console.log(`Repository: ${config.owner}/${config.repo}`);
    console.log(`PR Number: #${config.prNumber}\n`);
    
    // Check if report exists
    if (!fs.existsSync(REPORT_PATH)) {
      throw new Error(`Report not found: ${REPORT_PATH}\nRun capture-screenshots.ts first.`);
    }
    
    // Read report
    console.log('📄 Reading analysis report...');
    const reportContent = fs.readFileSync(REPORT_PATH, 'utf-8');
    console.log('  ✅ Report loaded\n');
    
    // Find all screenshots
    console.log('🔍 Finding screenshots...');
    const screenshots = fs.readdirSync(SCREENSHOTS_DIR)
      .filter(file => file.endsWith('.png'))
      .map(file => path.join(SCREENSHOTS_DIR, file))
      .sort();
    
    console.log(`  ✅ Found ${screenshots.length} screenshots\n`);
    
    // Create PR comment
    await createPRComment(config, reportContent, screenshots);
    
    console.log('\n✅ Successfully posted screenshots to PR!');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
