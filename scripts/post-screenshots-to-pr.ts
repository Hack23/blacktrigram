/**
 * Post Screenshots to GitHub PR
 * 
 * This script uploads screenshots directly to GitHub's CDN and posts them
 * in the PR comment using the uploaded image URLs.
 * 
 * Usage:
 *   GITHUB_TOKEN=xxx PR_NUMBER=123 GITHUB_RUN_ID=456 npx tsx scripts/post-screenshots-to-pr.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots');
const REPORT_PATH = path.join(SCREENSHOTS_DIR, 'reports', 'ui-ux-analysis.md');
const BOT_COMMENT_IDENTIFIER = '<!-- screenshot-analysis-bot-comment -->';

interface GitHubAPIConfig {
  token: string;
  owner: string;
  repo: string;
  prNumber: number;
  runId?: string;
}

interface UploadedImage {
  filename: string;
  url: string;
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
  
  // Parse owner/repo from GITHUB_REPOSITORY or use defaults
  const repoEnv = process.env.GITHUB_REPOSITORY ?? 'Hack23/blacktrigram';
  const [owner, repo] = repoEnv.split('/');
  
  return {
    token,
    owner: owner ?? 'Hack23',
    repo: repo ?? 'blacktrigram',
    prNumber: parseInt(prNumber, 10),
    runId,
  };
}


/**
 * Upload a screenshot to GitHub's CDN
 */
async function uploadScreenshotToGitHub(
  config: GitHubAPIConfig,
  screenshotPath: string
): Promise<string> {
  const { token, owner, repo, prNumber } = config;
  const filename = path.basename(screenshotPath);
  
  console.log(`  📤 Uploading ${filename}...`);
  
  try {
    // Read file
    const fileBuffer = fs.readFileSync(screenshotPath);
    
    // Create multipart form data boundary
    const boundary = `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`;
    
    // Build multipart form data body
    const parts: Buffer[] = [];
    
    // Add file part
    parts.push(Buffer.from(`--${boundary}\r\n`));
    parts.push(Buffer.from(`Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`));
    parts.push(Buffer.from('Content-Type: image/png\r\n\r\n'));
    parts.push(fileBuffer);
    parts.push(Buffer.from('\r\n'));
    parts.push(Buffer.from(`--${boundary}--\r\n`));
    
    const body = Buffer.concat(parts);
    
    // Upload to GitHub using the issue/PR upload endpoint
    // This endpoint is used by the web UI when drag-dropping images
    const uploadUrl = `https://uploads.github.com/repos/${owner}/${repo}/issues/uploads`;
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length.toString(),
      },
      body: body,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} ${response.statusText}\n${errorText}`);
    }
    
    const result = await response.json();
    console.log(`  ✅ Uploaded: ${filename}`);
    
    return result.url ?? result.browser_download_url;
    
  } catch (error) {
    console.warn(`  ⚠️ Failed to upload ${filename}:`, error);
    throw error;
  }
}

/**
 * Find existing bot comment on the PR
 */
async function findExistingBotComment(
  config: GitHubAPIConfig
): Promise<number | null> {
  const { token, owner, repo, prNumber } = config;
  
  console.log('🔍 Checking for existing bot comment...');
  
  try {
    const commentsUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`;
    
    const response = await fetch(commentsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (!response.ok) {
      console.warn('  ⚠️ Failed to fetch comments, will create new comment');
      return null;
    }
    
    const comments = await response.json();
    
    // Find comment with our identifier
    const botComment = comments.find((comment: { body: string }) => 
      comment.body?.includes(BOT_COMMENT_IDENTIFIER)
    );
    
    if (botComment) {
      console.log(`  ✅ Found existing comment: #${botComment.id}`);
      return botComment.id;
    }
    
    console.log('  ℹ️ No existing comment found, will create new one');
    return null;
    
  } catch (error) {
    console.warn('  ⚠️ Error checking for existing comment:', error);
    return null;
  }
}

/**
 * Create or update PR comment with uploaded screenshots
 */
async function createOrUpdatePRComment(
  config: GitHubAPIConfig,
  reportContent: string,
  uploadedImages: UploadedImage[]
): Promise<void> {
  const { token, owner, repo, prNumber, runId } = config;
  
  console.log('\n📝 Creating/updating PR comment...');
  
  try {
    // Build comment body with embedded uploaded screenshots
    let commentBody = `${BOT_COMMENT_IDENTIFIER}\n\n`;
    commentBody += `## 📸 Automated UI/UX Screenshot Analysis\n\n`;
    commentBody += `This comment contains automated screenshots of all major screens in the application.\n\n`;
    
    if (uploadedImages.length > 0) {
      commentBody += `### 🎯 Quick Preview\n\n`;
      
      // Add thumbnail grid
      commentBody += `<table>\n`;
      commentBody += `<tr>\n`;
      
      for (let i = 0; i < uploadedImages.length; i += 4) {
        const row = uploadedImages.slice(i, i + 4);
        row.forEach(img => {
          commentBody += `<td width="25%"><img src="${img.url}" width="100%" /></td>\n`;
        });
        commentBody += `</tr>\n<tr>\n`;
        row.forEach(img => {
          const displayName = img.filename.replace('.png', '').replace(/-/g, ' ');
          commentBody += `<td align="center"><small>${displayName}</small></td>\n`;
        });
        commentBody += `</tr>\n`;
        
        if (i + 4 < uploadedImages.length) {
          commentBody += `<tr>\n`;
        }
      }
      
      commentBody += `</table>\n\n`;
    } else {
      commentBody += `⚠️ No screenshots were uploaded. Check the workflow logs.\n\n`;
    }
    
    commentBody += `### 📊 Detailed Analysis\n\n`;
    commentBody += `<details>\n<summary>Click to expand full analysis report</summary>\n\n`;
    commentBody += reportContent;
    commentBody += `\n</details>\n\n`;
    
    // Add artifact download link
    if (runId) {
      commentBody += `### 📦 Download Screenshots\n\n`;
      commentBody += `[Download all screenshots as artifacts](https://github.com/${owner}/${repo}/actions/runs/${runId})\n\n`;
    }
    
    commentBody += `---\n\n`;
    commentBody += `🤖 *This analysis was automatically generated using Playwright automation*\n`;
    
    // Check for existing comment
    const existingCommentId = await findExistingBotComment(config);
    
    if (existingCommentId) {
      // Update existing comment
      const updateUrl = `https://api.github.com/repos/${owner}/${repo}/issues/comments/${existingCommentId}`;
      
      console.log(`  📍 Updating comment: ${updateUrl}`);
      
      const response = await fetch(updateUrl, {
        method: 'PATCH',
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
        throw new Error(`Failed to update comment: ${response.status} ${response.statusText}\n${errorText}`);
      }
      
      const result = await response.json();
      console.log(`  ✅ Comment updated: ${result.html_url}`);
      
    } else {
      // Create new comment
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
    }
    
  } catch (error) {
    console.error('  ❌ Failed to create/update PR comment:', error);
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
    
    // Upload screenshots to GitHub CDN
    const uploadedImages: UploadedImage[] = [];
    
    if (screenshotPaths.length > 0) {
      console.log('📤 Uploading screenshots to GitHub CDN...');
      
      for (const screenshotPath of screenshotPaths) {
        try {
          const url = await uploadScreenshotToGitHub(config, screenshotPath);
          uploadedImages.push({
            filename: path.basename(screenshotPath),
            url,
          });
        } catch (error) {
          console.error(`  ❌ Failed to upload ${path.basename(screenshotPath)}:`, error);
          // Continue with other uploads
        }
      }
      
      console.log(`\n  ✅ Successfully uploaded ${uploadedImages.length}/${screenshotPaths.length} screenshots\n`);
      
      if (uploadedImages.length === 0) {
        console.warn('  ⚠️ No screenshots were uploaded successfully. Will still post comment with artifact link.\n');
      }
    }
    
    // Create or update PR comment
    await createOrUpdatePRComment(config, reportContent, uploadedImages);
    
    console.log('\n✅ Successfully posted screenshots to PR!');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
