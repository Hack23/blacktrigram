#!/usr/bin/env node

/**
 * Sitemap Generator for Black Trigram (흑괘)
 * Generates both sitemap.xml and sitemap.html from docs directory
 * For SEO optimization on blacktrigram.com
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://blacktrigram.com';
const DOCS_DIR = path.join(__dirname, 'docs');
// NOTE: CURRENT_DATE is evaluated once at module load time.
// This is acceptable for short-lived, single-run sitemap generation.
// If this script is ever used as a long-running process or daemon, consider
// computing the date at the time of use instead of relying on this constant.
const CURRENT_DATE = new Date().toISOString().split('T')[0];

// Priority and change frequency configuration
const CONFIG = {
  // Main pages - highest priority
  main: { priority: 1.0, changefreq: 'daily' },
  // API documentation
  api: { priority: 0.8, changefreq: 'weekly' },
  // Test results and coverage
  tests: { priority: 0.6, changefreq: 'weekly' },
  // Architecture documentation
  architecture: { priority: 0.7, changefreq: 'weekly' },
  // Markdown documentation
  markdown: { priority: 0.7, changefreq: 'weekly' },
  // Assets and resources
  assets: { priority: 0.4, changefreq: 'monthly' },
  // Default for other files
  default: { priority: 0.5, changefreq: 'monthly' },
};

// Category mapping based on file paths
const CATEGORIES = {
  'API Documentation': { pattern: /^\.\/api\//, config: CONFIG.api },
  'Test Results': { pattern: /^\.\/(coverage|test-results)\//, config: CONFIG.tests },
  'E2E Test Reports': { pattern: /^\.\/cypress\//, config: CONFIG.tests },
  'Architecture': { pattern: /^\.\/architecture\//, config: CONFIG.architecture },
  'Documentation': { pattern: /^\.\/[^/]*\.md$/, config: CONFIG.markdown },
  'Vital Points': { pattern: /^\.\/vital-points\//, config: CONFIG.architecture },
  'Dependencies': { pattern: /^\.\/dependencies\//, config: CONFIG.assets },
  'Main Pages': { pattern: /^\.\/(index|offline)\.html$/, config: CONFIG.main },
};

// Files to exclude from sitemap
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /\.(json|txt|css|js|map|ico|svg|png|jpg|jpeg|gif|webp|mp3|wav|ogg)$/i,
  /^\.\/assets\//,  // Exclude asset files
  /^\.\/icons\//,   // Exclude icons
  /\/assets\//,     // Exclude assets in subdirectories
];

/**
 * Recursively find all files in a directory
 */
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    // Use lstat to detect symbolic links and avoid following them
    let stat;
    try {
      stat = fs.lstatSync(filePath);
    } catch (error) {
      console.warn(`⚠️  Unable to read file stats: ${filePath}`);
      return;
    }

    // Skip symbolic links to avoid potential circular references
    if (stat.isSymbolicLink()) {
      return;
    }

    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (stat.isFile()) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Get relative path from docs directory
 */
function getRelativePath(filePath) {
  return './' + path.relative(DOCS_DIR, filePath).replace(/\\/g, '/');
}

/**
 * Check if file should be included
 */
function shouldInclude(relativePath) {
  // Must be HTML or MD file
  if (!/\.(html|md)$/i.test(relativePath)) {
    return false;
  }

  // Check exclude patterns
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.test(relativePath)) {
      return false;
    }
  }

  return true;
}

/**
 * Get category and config for a file
 */
function getCategoryConfig(relativePath) {
  for (const [category, { pattern, config }] of Object.entries(CATEGORIES)) {
    if (pattern.test(relativePath)) {
      return { category, config };
    }
  }
  return { category: 'Other', config: CONFIG.default };
}

/**
 * Convert relative path to URL
 */
function pathToURL(relativePath) {
  // Remove leading ./
  let urlPath = relativePath.replace(/^\.\//, '');
  
  // Normalize Windows-style path separators to URL-style
  urlPath = urlPath.replace(/\\/g, '/');
  
  // For index.html at root, use root URL
  if (urlPath === 'index.html') {
    return BASE_URL;
  }

  // Encode each path segment to produce a valid URL path
  const encodedPath = urlPath
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');
  
  return `${BASE_URL}/${encodedPath}`;
}

/**
 * Escape special XML characters
 */
function escapeXML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Escape special HTML characters
 */
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate sitemap.xml
 */
function generateSitemapXML(entries) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Group by category for organized output
  const grouped = {};
  entries.forEach(entry => {
    if (!grouped[entry.category]) {
      grouped[entry.category] = [];
    }
    grouped[entry.category].push(entry);
  });

  // Sort categories by importance
  const categoryOrder = [
    'Main Pages',
    'API Documentation',
    'Architecture',
    'Documentation',
    'Test Results',
    'E2E Test Reports',
    'Vital Points',
    'Dependencies',
    'Other',
  ];

  categoryOrder.forEach(category => {
    if (grouped[category]) {
      xml += `\n  <!-- ${category} -->\n`;
      
      // Sort entries within category by URL
      grouped[category].sort((a, b) => a.url.localeCompare(b.url));
      
      grouped[category].forEach(entry => {
        xml += '  <url>\n';
        xml += `    <loc>${escapeXML(entry.url)}</loc>\n`;
        xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
        xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
        xml += `    <priority>${entry.priority}</priority>\n`;
        xml += '  </url>\n';
      });
    }
  });

  xml += '\n</urlset>\n';
  return xml;
}

/**
 * Generate sitemap.html
 */
function generateSitemapHTML(entries) {
  // Group by category
  const grouped = {};
  entries.forEach(entry => {
    if (!grouped[entry.category]) {
      grouped[entry.category] = [];
    }
    grouped[entry.category].push(entry);
  });

  // Sort categories
  const categoryOrder = [
    'Main Pages',
    'API Documentation',
    'Architecture',
    'Documentation',
    'Test Results',
    'E2E Test Reports',
    'Vital Points',
    'Dependencies',
    'Other',
  ];

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sitemap - Black Trigram (흑괘)</title>
  <meta name="description" content="Complete sitemap for Black Trigram - Korean martial arts combat game with cyberpunk aesthetics">
  <meta name="keywords" content="Black Trigram, 흑괘, sitemap, documentation, API, Korean martial arts">
  <link rel="canonical" href="https://blacktrigram.com/sitemap.html">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      /* Korean cyberpunk color palette */
      --primary-cyan: #00ffff;
      --secondary-yellow: #ffd700;
      --accent-gold: #ffaa00;
      --bg-dark: #0a0a0a;
      --bg-medium: #1a1a1a;
      --bg-light: #2d2d2d;
      --text-primary: #ffffff;
      --text-secondary: #cccccc;
      --border-color: #00ffff44;
    }

    body {
      /* Korean-first font stack, aligned with FONT_FAMILY.KOREAN usage in app UI */
      font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic',
        system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, var(--bg-dark) 0%, var(--bg-medium) 100%);
      color: var(--text-primary);
      line-height: 1.6;
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    header {
      text-align: center;
      margin-bottom: 60px;
      padding: 40px 20px;
      background: var(--bg-medium);
      border: 2px solid var(--primary-cyan);
      border-radius: 12px;
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
    }

    h1 {
      font-size: 3rem;
      color: var(--primary-cyan);
      text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
      margin-bottom: 10px;
      font-weight: 700;
    }

    .subtitle {
      font-size: 1.5rem;
      color: var(--secondary-yellow);
      margin-bottom: 20px;
    }

    .description {
      color: var(--text-secondary);
      font-size: 1.1rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin-top: 30px;
      flex-wrap: wrap;
    }

    .stat {
      background: var(--bg-light);
      padding: 15px 30px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .stat-value {
      font-size: 2rem;
      color: var(--accent-gold);
      font-weight: 700;
    }

    .stat-label {
      font-size: 0.9rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .category {
      margin-bottom: 50px;
    }

    .category-header {
      background: var(--bg-medium);
      padding: 20px 30px;
      border-left: 4px solid var(--primary-cyan);
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .category-header:hover {
      background: var(--bg-light);
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
    }

    .category-title {
      font-size: 1.8rem;
      color: var(--primary-cyan);
      font-weight: 600;
    }

    .category-count {
      background: var(--accent-gold);
      color: var(--bg-dark);
      padding: 5px 15px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 1rem;
    }

    .category-content {
      background: var(--bg-medium);
      padding: 20px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .category-content.collapsed {
      display: none;
    }

    .url-list {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 10px;
    }

    .url-item {
      padding: 12px 15px;
      background: var(--bg-light);
      border-radius: 6px;
      border: 1px solid transparent;
      transition: all 0.3s ease;
    }

    .url-item:hover {
      border-color: var(--primary-cyan);
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
      transform: translateX(5px);
    }

    .url-link {
      color: var(--text-primary);
      text-decoration: none;
      display: block;
      word-break: break-all;
    }

    .url-link:hover {
      color: var(--primary-cyan);
    }

    .url-meta {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-top: 5px;
      display: flex;
      gap: 15px;
    }

    .priority-high { color: #00ff00; }
    .priority-medium { color: var(--secondary-yellow); }
    .priority-low { color: #ff9900; }

    footer {
      text-align: center;
      padding: 40px 20px;
      margin-top: 60px;
      border-top: 2px solid var(--border-color);
      color: var(--text-secondary);
    }

    .footer-links {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-top: 20px;
      flex-wrap: wrap;
    }

    .footer-link {
      color: var(--primary-cyan);
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .footer-link:hover {
      color: var(--accent-gold);
      text-shadow: 0 0 10px rgba(255, 170, 0, 0.5);
    }

    @media (max-width: 768px) {
      h1 { font-size: 2rem; }
      .subtitle { font-size: 1.2rem; }
      .stats { gap: 20px; }
      .url-list { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🥋 Black Trigram Sitemap</h1>
      <div class="subtitle">흑괘 사이트맵</div>
      <p class="description">
        Complete navigation for Black Trigram - A Korean martial arts combat game 
        featuring realistic anatomy-based combat, Eight Trigram stances, and cyberpunk aesthetics
      </p>
      <div class="stats">
        <div class="stat">
          <div class="stat-value">${entries.length}</div>
          <div class="stat-label">Total Pages</div>
        </div>
        <div class="stat">
          <div class="stat-value">${Object.keys(grouped).length}</div>
          <div class="stat-label">Categories</div>
        </div>
        <div class="stat">
          <div class="stat-value">${CURRENT_DATE}</div>
          <div class="stat-label">Last Updated</div>
        </div>
      </div>
    </header>

    <main>
`;

  categoryOrder.forEach(category => {
    if (grouped[category]) {
      const items = grouped[category];
      items.sort((a, b) => a.url.localeCompare(b.url));

      html += `
      <div class="category">
        <div class="category-header" onclick="toggleCategory(this)">
          <h2 class="category-title">${category}</h2>
          <span class="category-count">${items.length}</span>
        </div>
        <div class="category-content">
          <ul class="url-list">
`;

      items.forEach(item => {
        const priorityClass = 
          item.priority >= 0.8 ? 'priority-high' :
          item.priority >= 0.6 ? 'priority-medium' : 'priority-low';

        // Get display name from URL
        const displayName = item.url
          .replace(BASE_URL + '/', '')
          .replace(BASE_URL, 'Home')
          .replace(/\.html$/, '')
          .replace(/\//g, ' / ');

        html += `
            <li class="url-item">
              <a href="${escapeHTML(item.url)}" class="url-link">${escapeHTML(displayName || 'Home')}</a>
              <div class="url-meta">
                <span class="${priorityClass}">Priority: ${item.priority}</span>
                <span>Updated: ${item.changefreq}</span>
              </div>
            </li>
`;
      });

      html += `
          </ul>
        </div>
      </div>
`;
    }
  });

  html += `
    </main>

    <footer>
      <p>&copy; 2025 Black Trigram (흑괘). All rights reserved.</p>
      <p>Korean Martial Arts Combat Game with Cyberpunk Aesthetics</p>
      <div class="footer-links">
        <a href="/" class="footer-link">Home</a>
        <a href="/api/" class="footer-link">API Documentation</a>
        <a href="/sitemap.xml" class="footer-link">XML Sitemap</a>
        <a href="https://github.com/Hack23/blacktrigram" class="footer-link" target="_blank">GitHub</a>
      </div>
    </footer>
  </div>

  <!-- Note: Inline script is intentional for this standalone sitemap page.
       This keeps the sitemap self-contained and avoids external dependencies.
       The script is minimal and only handles category toggling. -->
  <script>
    function toggleCategory(header) {
      const content = header.nextElementSibling;
      content.classList.toggle('collapsed');
    }

    // Collapse all categories except first one by default
    document.addEventListener('DOMContentLoaded', () => {
      const categories = document.querySelectorAll('.category-content');
      categories.forEach((cat, index) => {
        if (index > 0) {
          cat.classList.add('collapsed');
        }
      });
    });
  </script>
</body>
</html>
`;

  return html;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Black Trigram Sitemap Generator');

  // Validate docs directory before proceeding
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`❌ Docs directory does not exist: ${DOCS_DIR}`);
    process.exitCode = 1;
    return;
  }

  try {
    const stats = fs.statSync(DOCS_DIR);
    if (!stats.isDirectory()) {
      console.error(`❌ Docs path is not a directory: ${DOCS_DIR}`);
      process.exitCode = 1;
      return;
    }
  } catch (error) {
    console.error(`❌ Unable to access docs directory: ${DOCS_DIR}`);
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
    return;
  }

  console.log('📁 Scanning docs directory...\n');

  try {
    // Find all files
    const allFiles = findFiles(DOCS_DIR);
    console.log(`Found ${allFiles.length} total files`);

    // Filter and process files
    const entries = [];
    allFiles.forEach(filePath => {
      const relativePath = getRelativePath(filePath);
      
      if (shouldInclude(relativePath)) {
        const { category, config } = getCategoryConfig(relativePath);
        const url = pathToURL(relativePath);

        entries.push({
          url,
          lastmod: CURRENT_DATE,
          changefreq: config.changefreq,
          priority: config.priority,
          category,
          relativePath,
        });
      }
    });

    console.log(`✅ Processed ${entries.length} pages for sitemap\n`);

    // Show category breakdown
    const categoryCount = {};
    entries.forEach(entry => {
      categoryCount[entry.category] = (categoryCount[entry.category] || 0) + 1;
    });

    console.log('📊 Category Breakdown:');
    Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count} pages`);
      });
    console.log('');

    // Generate sitemap.xml
    const sitemapXML = generateSitemapXML(entries);
    const xmlPath = path.join(DOCS_DIR, 'sitemap.xml');
    fs.writeFileSync(xmlPath, sitemapXML, 'utf8');
    console.log(`✅ Generated sitemap.xml (${entries.length} URLs)`);

    // Generate sitemap.html
    const sitemapHTML = generateSitemapHTML(entries);
    const htmlPath = path.join(DOCS_DIR, 'sitemap.html');
    fs.writeFileSync(htmlPath, sitemapHTML, 'utf8');
    console.log(`✅ Generated sitemap.html (human-friendly version)`);

    console.log('\n🎉 Sitemap generation complete!');
    console.log(`   XML: ${xmlPath}`);
    console.log(`   HTML: ${htmlPath}`);
  } catch (error) {
    console.error('❌ Sitemap generation failed due to a filesystem error.');
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

// Run the generator
main();
