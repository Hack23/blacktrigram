/**
 * Post Screenshots to GitHub PR
 * 
 * This script posts screenshot information to PR comments with links to
 * workflow artifacts. Screenshots are preserved as artifacts for 30 days.
 * 
 * Usage:
 *   GITHUB_TOKEN=xxx PR_NUMBER=123 GITHUB_RUN_ID=456 npx tsx scripts/post-screenshots-to-pr.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots');
const REPORT_PATH = path.join(SCREENSHOTS_DIR, 'reports', 'ui-ux-analysis.md');
const BOT_COMMENT_IDENTIFIER = '<!-- screenshot-analysis-bot-comment -->';
const ARTIFACT_RETENTION_DAYS = 30;

interface GitHubAPIConfig {
  readonly token: string;
  readonly owner: string;
  readonly repo: string;
  readonly prNumber: number;
  readonly runId?: string;
}

interface ScreenshotInfo {
  readonly filename: string;
}

/**
 * Get GitHub API configuration from environment
 */
function getGitHubConfig(): GitHubAPIConfig {
  const token = process.env.GITHUB_TOKEN;
  const prNumber = process.env.PR_NUMBER ?? process.env.GITHUB_PR_NUMBER;
  const runId = process.env.GITHUB_RUN_ID;
  
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }
  
  if (!prNumber) {
    throw new Error('PR_NUMBER or GITHUB_PR_NUMBER environment variable is required');
  }
  
  if (runId && !/^\d+$/.test(runId)) {
    throw new Error(`Invalid GITHUB_RUN_ID format: "${runId}". Must be a numeric workflow run ID`);
  }
  
  // Parse owner/repo from GITHUB_REPOSITORY or use defaults
  const repoEnv = process.env.GITHUB_REPOSITORY ?? 'Hack23/blacktrigram';
  const parts = repoEnv.split('/');
  if (parts.length !== 2) {
    throw new Error(`Invalid GITHUB_REPOSITORY format: "${repoEnv}". Expected "owner/repo"`);
  }
  const [owner, repo] = parts;
  
  const parsedPrNumber = parseInt(prNumber, 10);
  if (isNaN(parsedPrNumber) || parsedPrNumber <= 0) {
    throw new Error(`Invalid PR number: "${prNumber}". Must be a positive integer`);
  }
  
  return {
    token,
    owner,
    repo,
    prNumber: parsedPrNumber,
    runId,
  };
}


/**
 * Create PR comment with screenshot list and artifact links
 */
async function createPRComment(
  config: GitHubAPIConfig,
  reportContent: string,
  screenshots: ScreenshotInfo[]
): Promise<void> {
  const { token, owner, repo, prNumber, runId } = config;
  
  console.log('\n📝 Creating PR comment...');
  
  try {
    // Build comment body with screenshot list and artifact links
    let commentBody = `${BOT_COMMENT_IDENTIFIER}\n\n`;
    commentBody += `## 📸 Automated UI/UX Screenshot Analysis\n\n`;
    commentBody += `This comment lists automated screenshots of all major screens in the application.\n\n`;
    
    if (screenshots.length > 0) {
      commentBody += `### 📋 Screenshots Captured\n\n`;
      
      screenshots.forEach(screenshot => {
        const displayName = screenshot.filename.replace('.png', '').replace(/-/g, ' ');
        commentBody += `- **${displayName}** (${screenshot.filename})\n`;
      });
      
      commentBody += `\n`;
    } else {
      commentBody += `⚠️ No screenshots were captured. Check the workflow logs.\n\n`;
    }
    
    commentBody += `### 📊 Detailed Analysis\n\n`;
    commentBody += `<details>\n<summary>Click to expand full analysis report</summary>\n\n`;
    // Remove markdown image links from report content to avoid broken URLs in PR comments
    const cleanedReport = reportContent.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');
    commentBody += cleanedReport;
    commentBody += `\n</details>\n\n`;
    
    // Add artifact download link
    if (runId) {
      commentBody += `### 📦 Download Screenshots\n\n`;
      commentBody += `All screenshots are available as workflow artifacts. [Download screenshots from this workflow run](https://github.com/${owner}/${repo}/actions/runs/${runId})\n\n`;
      commentBody += `> **Note**: GitHub does not provide a public API for uploading images to PR comments. `;
      commentBody += `Screenshots are preserved as workflow artifacts for ${ARTIFACT_RETENTION_DAYS} days and can be downloaded from the link above.\n\n`;
    }
    
    commentBody += `---\n\n`;
    commentBody += `🤖 *This analysis was automatically generated using Playwright automation*\n`;
    
    // Always create new comment
    const createUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`;
    
    console.log(`  📍 Creating new comment: ${createUrl}`);
    
    const response = await fetch(createUrl, {
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
      throw new Error(`Failed to create comment: ${response.status} ${response.statusText}\n${errorText}`);
    }
    
    const result = await response.json();
    console.log(`  ✅ Comment created: ${result.html_url}`);
    
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
    console.log(`PR Number: #${config.prNumber}`);
    if (config.runId) {
      console.log(`Run ID: ${config.runId}`);
    }
    console.log();
    
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
    const screenshotPaths = fs.readdirSync(SCREENSHOTS_DIR)
      .filter(file => file.endsWith('.png'))
      .map(file => path.join(SCREENSHOTS_DIR, file))
      .sort();
    
    console.log(`  ✅ Found ${screenshotPaths.length} screenshots\n`);
    
    // Note: GitHub does not provide a public API for uploading issue/PR attachments
    // We'll create a comment with artifact download links instead
    console.log('📦 Using artifact links for screenshots (GitHub does not provide upload API)\n');
    
    const screenshotList: { filename: string }[] = screenshotPaths.map(p => ({
      filename: path.basename(p),
    }));
    
    // Create PR comment with artifact links
    await createPRComment(config, reportContent, screenshotList);
    
    console.log('\n✅ Successfully posted screenshots to PR!');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
