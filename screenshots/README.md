# Screenshot Automation for UI/UX Analysis

This directory contains automated screenshots of all major screens in the Black Trigram application, captured using Playwright for UI/UX analysis and documentation purposes.

## 📁 Directory Structure

```
screenshots/
├── 01-splash-screen.png              # Initial app loading screen  
├── 02-intro-screen-menu.png          # Main menu with game modes
├── 03-intro-screen-archetype-selector.png # Player archetype selection
├── 04-controls-screen.png            # Game controls and keybindings
├── 05-philosophy-screen.png          # Korean martial arts philosophy
├── 06-training-screen.png            # Training mode with vital points
├── 07-combat-screen-practice.png     # Practice mode gameplay
├── 08-combat-screen-versus.png       # Versus mode gameplay
└── reports/
    └── ui-ux-analysis.md             # Detailed analysis report
```

## 🔧 Capturing Screenshots

### Automated Capture

Screenshots are automatically captured when you run:

```bash
# Start dev server and capture all screens
npm run screenshots:capture

# Or manually:
# Terminal 1
npm run dev

# Terminal 2 (after dev server is running)
npx tsx scripts/capture-screenshots.ts
```

### Manual Capture

You can also use Playwright directly for custom captures:

```typescript
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:5173');
await page.screenshot({ path: 'custom-screenshot.png' });
await browser.close();
```

## 📊 Analysis Report

The automated analysis report (`reports/ui-ux-analysis.md`) includes:

- **Success Rate**: Percentage of screens successfully captured
- **Individual Screenshots**: Detailed view of each screen
- **UI/UX Assessment**: Completeness and integration analysis
- **Recommendations**: Suggestions for improvement

## 🎯 Coverage

Current screens captured:

1. ✅ **Splash Screen** - Initial loading/start screen  
2. ✅ **Intro Screen** - Main menu with archetype selection
3. ✅ **Controls Screen** - Game controls help
4. ✅ **Philosophy Screen** - Korean martial arts lore
5. ✅ **Training Screen** - Training mode interface
6. ✅ **Combat Screen (Practice)** - Practice mode gameplay
7. ✅ **Combat Screen (Versus)** - Versus mode gameplay  
8. ⚠️  **End Screen** - Match results (captured via gameplay)

## 🔄 Updating Screenshots

Screenshots should be updated when:

- Major UI changes are made
- New screens are added
- Visual bugs are fixed
- Release milestones are reached

To update:

```bash
# Delete old screenshots
rm screenshots/*.png

# Capture new screenshots
npm run screenshots:capture
```

## 📝 CI/CD Integration

Screenshots are automatically captured in GitHub Actions:

- **Trigger**: On pull requests or manual workflow dispatch
- **Browser**: Chromium (Playwright) with WebGL support
- **Upload**: Artifacts saved for 30 days
- **PR Comments**: Screenshots posted to PR automatically

See `.github/workflows/screenshot-analysis.yml` for details.

## 🎨 Technical Details

### Browser Configuration

- **Browser**: Chromium (headless)
- **Viewport**: 1280x800
- **WebGL**: Enabled with SwiftShader fallback
- **Audio**: Autoplay enabled
- **Format**: PNG

### Three.js Rendering

The script waits for Three.js canvas to be ready:

1. Wait for `<canvas>` element
2. Check WebGL context availability
3. Wait for initial render (1.5s)
4. Additional animation settling (1s)

### Capture Process

For each screen:

1. Navigate to URL
2. Initialize audio (bypass splash)
3. Execute screen-specific actions (e.g., click menu button)
4. Wait for Three.js rendering
5. Capture screenshot
6. Save to `screenshots/` directory

## 🐛 Troubleshooting

### Screenshot Failures

Common issues:

- **Canvas not found**: Increase `waitForTimeout` in config
- **Audio initialization fails**: Check audio file paths
- **Button not clickable**: Canvas may be overlaying buttons
- **WebGL not available**: Install system dependencies

### System Dependencies

For Xvfb (CI environment):

```bash
sudo apt-get update
sudo apt-get install -y xvfb
Xvfb :99 -ac -screen 0 1280x1024x24 &
export DISPLAY=:99
```

For Playwright browsers:

```bash
npx playwright install chromium --with-deps
```

## 📈 Success Metrics

Target metrics:

- **Coverage**: 100% of screens captured
- **Success Rate**: >90% capture success
- **Quality**: Clear, fully-rendered screenshots
- **Consistency**: Same viewport/browser settings

Current status: **88% success rate** (7/8 screens)

## 🤝 Contributing

When adding new screens:

1. Add screen config to `scripts/capture-screenshots.ts`
2. Define navigation actions if needed
3. Run capture and verify output
4. Update this README with new screen info
5. Commit screenshots to repository

---

**Last Updated**: 2025-12-01  
**Tool**: Playwright + TypeScript  
**Maintainer**: Black Trigram Development Team
