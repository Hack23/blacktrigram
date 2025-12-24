# Sitemap Generation Guide

## Overview

The Black Trigram project includes automated sitemap generation for SEO optimization on the GitHub Pages site at `blacktrigram.com`.

## Generated Files

- **docs/sitemap.xml** - XML sitemap for search engines (typically 1500+ URLs)
- **docs/sitemap.html** - Human-friendly HTML sitemap with Korean cyberpunk theme

## Usage

### Generate Sitemaps

```bash
npm run docs:sitemap
```

This will scan the `docs/` directory and generate both sitemap files.

### When to Regenerate

Regenerate sitemaps after:
- Building API documentation (`npm run docs`)
- Running tests with coverage (`npm run coverage`)
- Running E2E tests (`npm run test:e2e`)
- Adding new documentation files
- Updating architecture diagrams

### Automated Generation

For automated builds, add to your workflow:

```bash
npm run docs              # Generate API docs
npm run coverage          # Generate test coverage
npm run test:e2e          # Generate E2E reports
npm run docs:sitemap      # Generate sitemaps
```

## What's Included

The sitemaps automatically include all HTML and Markdown files from the docs directory. Typical category breakdown (approximate counts as of December 2024):

| Category | Approximate Count | Priority | Change Frequency |
|----------|-------------------|----------|------------------|
| **Main Pages** | ~2 | 1.0 | daily |
| **API Documentation** | ~600+ | 0.8 | weekly |
| **Test Results** | ~600+ | 0.6 | weekly |
| **E2E Test Reports** | ~200+ | 0.6 | weekly |
| **Documentation** | ~10+ | 0.7 | weekly |
| **Vital Points** | ~5+ | 0.7 | weekly |
| **Architecture** | ~1+ | 0.7 | weekly |

*Note: Actual counts vary based on your latest documentation build. Run `npm run docs:sitemap` to see current statistics.*

## SEO Configuration

The sitemaps are referenced in `docs/robots.txt`:

```txt
User-agent: *
Allow: /

# XML Sitemap for search engines
Sitemap: https://blacktrigram.com/sitemap.xml

# Human-readable sitemap
# Visit: https://blacktrigram.com/sitemap.html
```

## Implementation Details

### Generator Script

Located at: `generate-sitemaps.js`

Features:
- Automatically scans all HTML and MD files in docs directory
- Categorizes content by directory structure
- Assigns appropriate priorities and change frequencies
- Excludes asset files (images, audio, etc.)
- Generates both XML and HTML formats
- Uses current date for lastmod values

### HTML Sitemap Features

- **Korean Cyberpunk Theme** - Matches game aesthetic
- **Collapsible Categories** - Easy navigation
- **Statistics Dashboard** - Total pages, categories, last update
- **Priority Indicators** - Color-coded priority levels
- **Responsive Design** - Mobile-friendly layout
- **Bilingual Headers** - Korean (흑괘) and English

### XML Sitemap Format

Standard sitemap protocol with:
- Valid XML structure
- Proper URL encoding
- Organized by categories
- SEO-optimized priorities
- Current lastmod dates

## Customization

To customize the sitemap generator, edit `generate-sitemaps.js`:

### Adjust Priorities

```javascript
const CONFIG = {
  main: { priority: 1.0, changefreq: 'daily' },
  api: { priority: 0.8, changefreq: 'weekly' },
  tests: { priority: 0.6, changefreq: 'weekly' },
  // ... customize as needed
};
```

### Add Exclusions

```javascript
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /\.(json|txt|css|js)$/i,
  // ... add more patterns
];
```

### Modify Categories

```javascript
const CATEGORIES = {
  'API Documentation': { pattern: /^\.\/api\//, config: CONFIG.api },
  'Custom Category': { pattern: /^\.\/custom\//, config: CONFIG.custom },
  // ... add more categories
};
```

## Verification

### Check XML Validity

```bash
xmllint --noout docs/sitemap.xml
```

### Count URLs

```bash
grep -c "<url>" docs/sitemap.xml
```

### View in Browser

- XML: https://blacktrigram.com/sitemap.xml
- HTML: https://blacktrigram.com/sitemap.html

## Troubleshooting

### Sitemap not updating?

1. Clear browser cache
2. Check GitHub Pages build status
3. Verify files are committed to gh-pages branch
4. Check CNAME file is present

### Missing URLs?

1. Verify files exist in docs directory
2. Check EXCLUDE_PATTERNS in generator
3. Ensure files have .html or .md extensions
4. Review category patterns

### XML validation errors?

1. Check for special characters in URLs
2. Verify XML structure is valid
3. Ensure proper URL encoding
4. Review lastmod date format

## SEO Best Practices

✅ **DO:**
- Regenerate after significant content updates
- Keep priorities consistent with content importance
- Use appropriate change frequencies
- Include all user-accessible pages
- Keep lastmod dates current

❌ **DON'T:**
- Include duplicate URLs
- List temporary or test pages
- Use priority > 1.0
- Include non-existent pages
- Forget to submit to search engines

## Submission to Search Engines

After generating sitemaps, submit to:

1. **Google Search Console**
   - https://search.google.com/search-console

2. **Bing Webmaster Tools**
   - https://www.bing.com/webmasters

3. **Manual Submission**
   - Submit sitemap URL: `https://blacktrigram.com/sitemap.xml`

## License

Part of the Black Trigram (흑괘) project.
Korean Martial Arts Combat Game with Cyberpunk Aesthetics.

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
