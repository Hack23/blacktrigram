# 🔍 Black Trigram (흑괘) - End-to-End Test Plan

**🔐 ISMS Alignment:** This E2E test plan implements [Hack23 Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) Section 4.3.3 - End-to-End Testing Requirements.

## 📋 Executive Summary

This End-to-End (E2E) Test Plan provides comprehensive testing coverage for the Black Trigram Korean martial arts combat simulator, ensuring all critical user journeys and game mechanics function correctly across different browsers, screen sizes, and performance scenarios.

### ISMS Compliance Requirements

Per Hack23 AB's Secure Development Policy, this project maintains:

| 🎯 **Requirement** | 📊 **Implementation** | ✅ **Status** | 📋 **ISMS Reference** |
|-------------------|---------------------|--------------|---------------------|
| **Critical Path Coverage** | Complete game flow testing | ✅ Implemented | Section 4.3.3.1 |
| **Browser Testing** | Chrome, Firefox, Edge | ✅ Validated | Section 4.3.3.2 |
| **Automated Execution** | Every PR via Cypress | ✅ Active | Section 4.3.3.3 |
| **Public Reporting** | Mochawesome reports | ✅ Published | Section 4.3.3.4 |
| **Performance Assertions** | Load time & FPS monitoring | ✅ Tracked | Section 4.3.3.5 |

**Evidence Links:**
- **E2E Test Reports:** Available as downloadable CI artifacts from the [CI Workflow](https://github.com/Hack23/blacktrigram/actions/workflows/test-and-report.yml) (see the "Artifacts" section in each workflow run)
- [Test Execution Badge](https://github.com/Hack23/blacktrigram/actions/workflows/test-and-report.yml/badge.svg)

**See Also:** 
- [ISMS Reference Mapping](ISMS_REFERENCE_MAPPING.md)
- [Unit Test Plan](UnitTestPlan.md)
- [Architecture Documentation](ARCHITECTURE.md)

---

## 🎯 Testing Objectives

- **🥋 Validate Critical Game Workflows**: Ensure all Korean martial arts gameplay paths work correctly
- **🎮 Verify Combat Mechanics**: Test trigram system, vital point targeting, and combat calculations
- **🔄 Confirm State Management**: Validate game state persistence and transitions
- **🌐 Cross-Browser Compatibility**: Test across Chrome, Firefox, and Edge browsers
- **📱 Responsive Design Validation**: Ensure proper functionality on desktop, tablet, and mobile viewports
- **⚡ Performance Verification**: Confirm 60fps rendering and acceptable load times
- **🎨 PixiJS Integration**: Validate WebGL rendering and canvas interactions
- **🎵 Audio System**: Test Korean traditional music and combat sound effects

## 🧩 Test Categories

### 1. **🏛️ Core Game Journey Workflows**

**Test Coverage:**
- Complete navigation cycle: Intro → Training → Combat → Intro
- All 8 trigram stances in training mode
- Combat mechanics with movement and techniques
- State management and transitions
- Performance under load

**Critical User Journeys:**
| Journey | Priority | Test File | Status |
|---------|----------|-----------|--------|
| Intro → Training → Intro | ✅ High | game-journey.cy.ts | Implemented |
| Intro → Combat → Intro | ✅ High | game-journey.cy.ts | Implemented |
| Training - All Stances | ✅ High | training-flow.cy.ts | Implemented |
| Combat - Movement | ✅ High | combat-flow.cy.ts | Implemented |
| Combat - Trigram Techniques | ✅ High | combat-system-integration.cy.ts | Implemented |
| Combat - Vital Points | ✅ High | pixi-korean-martial-arts.cy.ts | Implemented |

### 2. **⚔️ Combat System Integration Workflows**

**Combat Mechanics Tested:**
- Movement system (WASD + Arrow keys)
- Trigram stance selection (1-8 keys)
- Technique execution (Space bar)
- Vital point targeting (Mouse clicks)
- Damage calculations (VitalPointSystem)
- Health/Ki resource management
- Combat feedback (visual + audio)
- AI opponent behavior

### 3. **🎨 PixiJS Rendering and Performance**

**Performance Assertions:**
| Metric | Target | Test Method |
|--------|--------|-------------|
| **Initial Load Time** | < 3 seconds | Measure time from visit() to canvas ready |
| **Screen Transition** | < 500ms | Time between ESC and new screen render |
| **Input Response** | < 100ms | Key press to visual feedback |
| **Combat Action** | < 200ms | Technique execution to effect render |
| **Frame Rate** | 60fps ±5% | Monitor FPS during intense combat |
| **Memory Usage** | < 512MB | Check heap size after 5 minutes |

### 4. **📱 Responsive Design and Browser Compatibility**

**Browser Testing Matrix:**
| Browser | Version | Platform | Priority | Status |
|---------|---------|----------|----------|--------|
| **Chrome** | Latest Stable | Windows/Mac/Linux | ✅ High | Tested |
| **Firefox** | Latest Stable | Windows/Mac/Linux | ✅ High | Tested |
| **Edge** | Latest Stable | Windows | ✅ High | Tested |
| **Safari** | Latest Stable | Mac | ⚠️ Medium | Planned |

**Viewport Testing Matrix:**
| Device Type | Width x Height | Orientation | Priority |
|-------------|----------------|-------------|----------|
| Desktop HD | 1280 x 720 | Landscape | ✅ High |
| Desktop FHD | 1920 x 1080 | Landscape | ✅ High |
| Tablet | 768 x 1024 | Portrait | ⚠️ Medium |
| Mobile | 375 x 667 | Portrait | 📱 Low |

### 5. **🎵 Audio System Integration**

**Audio Features Tested:**
- Traditional Korean music in Training Mode
- Cyberpunk combat music in Combat Mode
- Impact sounds for technique execution
- Bone crack audio for critical hits
- Audio synchronization with visuals

## 🧪 Test Implementation with Cypress

### Test Structure
```
cypress/
├── e2e/
│   ├── game-journey.cy.ts           # Complete game flow tests
│   ├── core-features.cy.ts          # Essential gameplay features
│   ├── combat-system-integration.cy.ts  # Combat mechanics
│   ├── training-system-integration.cy.ts # Training mode
│   ├── combat-flow.cy.ts            # Combat-specific workflows
│   ├── training-flow.cy.ts          # Training-specific workflows
│   ├── combat-screen-layout.cy.ts   # Combat UI validation
│   ├── combat-mode.cy.ts            # Combat mode entry/exit
│   ├── training-mode.cy.ts          # Training mode entry/exit
│   ├── pixi-korean-martial-arts.cy.ts # PixiJS integration
│   ├── app.cy.ts                    # Application smoke tests
│   └── game-flow.cy.ts              # Navigation flows
├── fixtures/
│   └── test-data.json               # Test data fixtures
├── support/
│   ├── e2e.ts                       # E2E support file
│   ├── component.ts                 # Component support
│   └── commands.ts                  # Custom Cypress commands
```

### Custom Cypress Commands

**Available Commands:**
- `cy.visitWithWebGLMock()` - Visit page with WebGL mocking for headless
- `cy.waitForCanvasReady()` - Wait for PixiJS canvas initialization
- `cy.gameActions()` - Execute game inputs with proper timing
- `cy.annotate()` - Add test annotations for reporting
- `cy.enterTrainingMode()` - Navigate to training mode
- `cy.enterCombatMode()` - Navigate to combat mode
- `cy.returnToIntro()` - Return to intro screen
- `cy.practiceStance()` - Practice specific trigram stance

## 📊 Test Data Management

### Game State Test Data
Test fixtures are defined in `cypress/fixtures/test-data.json`:

**Player Archetypes:**
- 무사 (Musa) - Traditional Warrior
- 암살자 (Amsalja) - Shadow Assassin
- 해커 (Hacker) - Cyber Warrior
- 정보요원 (Jeongbo Yowon) - Intelligence Operative
- 조직폭력배 (Jojik Pokryeokbae) - Organized Crime

**Trigram Stances:**
- 건 (Geon) - Heaven
- 태 (Tae) - Lake
- 리 (Li) - Fire
- 진 (Jin) - Thunder
- 손 (Son) - Wind
- 감 (Gam) - Water
- 간 (Gan) - Mountain
- 곤 (Gon) - Earth

## 📊 Test Reporting with Mochawesome

### Report Generation Process

**1. Test Execution:**
```bash
npm run test:e2e        # Local execution with Chrome
npm run test:e2e:ci     # CI execution (headless)
```

**2. Report Merging:**
```bash
npm run test:e2ereportmerge    # Merge JSON reports
npm run test:e2ereporthtmlall  # Generate HTML report
```

**3. Report Location (Local):**
- Individual JSON: `docs/cypress/mochawesome/*.json`
- Merged JSON: `docs/cypress/mochawesome-all.json`
- HTML Report: `docs/cypress/mochawesome/index.html`
- JUnit XML: `docs/cypress/junit/results-*.xml`

**4. CI Artifacts:**
CI uploads artifacts from the following locations (configured in cypress.config.ts to write to `docs/cypress/` but uploaded from standard Cypress paths):
- Videos: `cypress/videos/` (failures only) → uploaded to `docs/cypress/videos/`
- Screenshots: `cypress/screenshots/` (failures only) → uploaded to `docs/cypress/screenshots/`
- Results: `cypress/results/` → uploaded to `docs/cypress/results/`
- Reports: Available as downloadable artifacts from [GitHub Actions workflow runs](https://github.com/Hack23/blacktrigram/actions/workflows/test-and-report.yml)

### Mochawesome Report Contents
- ✅ Test pass/fail summary with percentages
- 📊 Interactive charts showing test distribution
- 🖼️ Embedded screenshots for failed tests
- 🎬 Video playback for failed test runs
- ⏱️ Execution time for each test suite
- 🔍 Detailed error messages and stack traces

## 🔄 CI/CD Integration

### GitHub Actions Workflow

**E2E Test Job:**
```yaml
e2e-tests:
  needs: [prepare, build-validation]
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v5
    - uses: actions/setup-node@v6
      with:
        node-version: "24"
    - name: Install dependencies
      run: npm install
    - name: Start app and run Cypress tests
      run: |
        xvfb-run --auto-servernum --server-args="-screen 0 1280x720x24" npm run test:e2e
    - name: Upload Cypress results
      if: always()
      uses: actions/upload-artifact@v5
      with:
        name: cypress-results
        path: |
          cypress/videos
          cypress/screenshots
          cypress/results
```

**Trigger Conditions:**
- ✅ Every push to `main` branch
- ✅ Every pull request to `main` branch
- ⚙️ Manual workflow dispatch (optional)

**Environment:**
- OS: Ubuntu Latest (Linux)
- Node: v24
- Display: Xvfb (virtual framebuffer for headless)
- Resolution: 1280x720x24 bit color depth
- Browser: Chrome (headless)

**Dependencies:**
- Korean font support: fonts-noto-cjk, fonts-noto-cjk-extra
- System libraries: libgtk-3-0, libgbm-dev, libnss3, etc.
- google-chrome-stable

## 📋 Test Coverage and Success Criteria

### Critical User Journeys Coverage

| Journey | Coverage | Tests | Status |
|---------|----------|-------|--------|
| **Intro → Training → Intro** | 100% | game-journey.cy.ts | ✅ |
| **Intro → Combat → Intro** | 100% | game-journey.cy.ts | ✅ |
| **Training Mode - All Stances** | 100% | training-flow.cy.ts | ✅ |
| **Combat - Movement** | 100% | combat-flow.cy.ts | ✅ |
| **Combat - Trigram Stances** | 100% | combat-system-integration.cy.ts | ✅ |
| **Combat - Vital Points** | 100% | pixi-korean-martial-arts.cy.ts | ✅ |
| **Responsive Design** | 100% | core-features.cy.ts | ✅ |
| **Cross-Browser** | 100% | All tests | ✅ |

### Test Execution KPIs

| Metric | Target | Current (Enhanced) | Previous | Status |
|--------|--------|-------------------|----------|--------|
| **Test Coverage** | >90% of user journeys | ~95% | ~95% | ✅ Excellent |
| **Pass Rate** | >95% | 100% (10/10) | ~98% | ✅ Excellent |
| **Execution Time** | 10-12 minutes | ~10-12 min (optimized) | ~20 min | ✅ Target Met |
| **Browser Compatibility** | 100% Chrome/Firefox/Edge | 100% | 100% | ✅ Complete |
| **Performance Compliance** | <3s load, <500ms interaction | Measured | Measured | ✅ Met |
| **Flaky Test Rate** | 0% | 0% (enhanced monitoring) | <1% | ✅ Zero Flakes |
| **Retry Count** | ≤1 | 1 (runMode), 0 (openMode) | 2 (runMode), 1 (openMode) | ✅ Improved |
| **Resource Leaks** | 0 detected | Monitored (10-30MB growth) | Not monitored | ✅ Tracked |
| **Test Isolation** | Complete | ✅ Implemented | Partial | ✅ Complete |

**Enhanced Reliability Features (Nov 2025):**
- ✅ **Test Isolation**: Complete state reset between tests (localStorage, sessionStorage, game state)
- ✅ **Resource Monitoring**: Tracks audio elements, canvas elements, memory usage, event listeners
- ✅ **Global Cleanup Hooks**: Automatic cleanup in beforeEach/afterEach for all tests
- ✅ **Flakiness Detection**: CI runs tests 3x on PRs to detect inconsistent behavior
- ✅ **Reliability Reporting**: Automated HTML report generation with flaky test detection
- ✅ **Reduced Retries**: From 2→1 (runMode), 1→0 (openMode) to catch flakes faster

**Note**: Execution time optimized from ~20 minutes to 10-12 minutes through configuration tuning, wait time reduction, and performance monitoring. Test reliability improvements (Nov 2025) added comprehensive isolation and monitoring to achieve 0% flaky rate. See [E2E_OPTIMIZATION_RESULTS.md](E2E_OPTIMIZATION_RESULTS.md) for details.

### Feature Coverage Matrix

| Feature | Unit Tests | E2E Tests | Status |
|---------|------------|-----------|--------|
| **Trigram System** | ✅ TrigramCalculator.test.ts | ✅ combat-system-integration.cy.ts | Complete |
| **Vital Points** | ✅ VitalPointSystem.test.ts | ✅ pixi-korean-martial-arts.cy.ts | Complete |
| **Combat Mechanics** | ✅ GameIntegration.test.ts | ✅ combat-flow.cy.ts | Complete |
| **Player Utils** | ✅ playerUtils.test.ts | ✅ game-journey.cy.ts | Complete |
| **UI Components** | ✅ CombatStatsPanel.test.tsx | ✅ combat-screen-layout.cy.ts | Complete |
| **State Management** | ✅ Integration tests | ✅ game-journey.cy.ts | Complete |

## 🎮 Game Screen Test Scenarios

### IntroScreen (인트로 화면)
**Test Coverage:**
- ✅ Korean logo rendering (흑괘)
- ✅ Menu navigation (Training/Combat buttons)
- ✅ Bilingual text display (Korean/English)
- ✅ Background visual effects
- ✅ Audio system initialization
- ✅ Keyboard navigation (1, 2 keys)

**Test Files:** `app.cy.ts`, `core-features.cy.ts`, `game-journey.cy.ts`

### TrainingScreen (훈련 모드)
**Test Coverage:**
- ✅ All 8 trigram stance practice
- ✅ Korean technique names display
- ✅ Visual technique feedback
- ✅ Training progression tracking
- ✅ Return to intro (ESC)

**Test Files:** `training-mode.cy.ts`, `training-flow.cy.ts`, `training-system-integration.cy.ts`

### CombatScreen (전투 화면)
**Test Coverage:**
- ✅ Combat HUD rendering
- ✅ Health bar display (player + opponent)
- ✅ Ki resource management
- ✅ Movement controls (WASD, arrows)
- ✅ Trigram stance selection (1-8)
- ✅ Technique execution (Space)
- ✅ Vital point targeting (Mouse)
- ✅ Combat log updates
- ✅ Damage calculations
- ✅ Visual effects (blood, impacts)
- ✅ Audio feedback (bone impacts)

**Test Files:** `combat-mode.cy.ts`, `combat-flow.cy.ts`, `combat-system-integration.cy.ts`, `combat-screen-layout.cy.ts`, `pixi-korean-martial-arts.cy.ts`

## 🔄 Test Maintenance Strategy

### Test Review Schedule
- **📅 Weekly**: Review failing tests and identify flaky tests
- **🔄 Bi-weekly**: Update test scenarios based on new features
- **📊 Monthly**: Comprehensive test coverage analysis
- **🎯 Quarterly**: Test framework and strategy evaluation

### Flaky Test Handling
- **🔁 Retries**: Configured in `cypress.config.ts`
  - `runMode: 2` - CI environment retries
  - `openMode: 1` - Local development retries
- **⏱️ Timeouts**: Optimized for game loading
  - `defaultCommandTimeout: 6000ms`
  - `pageLoadTimeout: 15000ms`

### Test Optimization
- **🚀 Memory Management**: `experimentalMemoryManagement: true`
- **💾 Test Retention**: `numTestsKeptInMemory: 5`
- **🎬 Video Optimization**: `videoUploadOnPasses: false` (failures only)
- **📸 Screenshots**: Only on failure
- **🧹 Cleanup**: `trashAssetsBeforeRuns: true`

## 🔐 Security Testing Integration

### Security Test Coverage
- **🔒 XSS Prevention**: Input validation tests
- **🛡️ CSP Compliance**: Content Security Policy validation
- **🔐 Dependency Scanning**: Automated via npm audit
- **📊 OWASP ZAP**: Periodic security scans
- **🎯 CodeQL**: Security vulnerability scanning

**Security Test Files:**
- ZAP scan: `.github/workflows/zap-scan.yml`
- CodeQL: `.github/workflows/codeql.yml`
- Scorecard: `.github/workflows/scorecards.yml`

## 📖 Test Execution Guide

### Local Development
```bash
# Install Cypress
npm run cypress:install
npm run cypress:verify

# Run all E2E tests
npm run test:e2e

# Open Cypress Test Runner (interactive)
npx cypress open

# Run specific test file
npx cypress run --spec "cypress/e2e/game-journey.cy.ts"

# Run tests in specific browser
npx cypress run --browser firefox
```

### CI Environment
```bash
# Tests run automatically on:
# - Push to main branch
# - Pull requests to main branch

# View test results:
# https://github.com/Hack23/blacktrigram/actions
```

### Troubleshooting

**Issue: Tests fail in headless mode**
```bash
xvfb-run --auto-servernum --server-args="-screen 0 1280x720x24" npm run test:e2e
```

**Issue: Korean fonts not rendering**
```bash
sudo apt-get install fonts-noto-cjk fonts-noto-cjk-extra
```

## 🎯 Compliance Mapping

### ISO 27001 Alignment
| Control | Requirement | Implementation |
|---------|-------------|----------------|
| **A.8.9** | Configuration Management | Version-controlled test plans |
| **A.14.2** | Testing in Development | Automated E2E testing |
| **A.14.3** | Test Data Protection | Sanitized test data only |

### NIST CSF Alignment
| Function | Category | Implementation |
|----------|----------|----------------|
| **PR.IP-1** | Baseline Configuration | Cypress config management |
| **PR.IP-2** | SDLC Integration | E2E tests in CI/CD |
| **DE.CM-4** | Malicious Code Detection | Dependency scanning |

### CIS Controls Alignment
| Control | Description | Implementation |
|---------|-------------|----------------|
| **2.1** | Software Inventory | Package.json tracking |
| **16.9** | Automated Testing | E2E test automation |
| **16.10** | Test Environment Segregation | Isolated test runs |

---

## 📚 Additional Resources

### Documentation
- [Cypress Documentation](https://docs.cypress.io/)
- [Mochawesome Reporter](https://github.com/adamgruber/mochawesome)
- [PixiJS Testing Guide](https://pixijs.com/)
- [Black Trigram Architecture](ARCHITECTURE.md)
- [Unit Test Plan](UnitTestPlan.md)

### Related Plans
- [Business Continuity Plan](BCPPlan.md)
- [ISMS Integration Analysis](ISMS_INTEGRATION_ANALYSIS.md)
- [Security Architecture](SECURITY_ARCHITECTURE.md)
- [Threat Model](THREAT_MODEL.md)
- [E2E Optimization Results](E2E_OPTIMIZATION_RESULTS.md) - **Performance optimization details**
- [E2E Execution Strategy](E2E_EXECUTION_STRATEGY.md) - **Smoke tests and CI strategy**

## ⚡ Performance Optimization

### Execution Time Improvement
The E2E test suite has been optimized to reduce execution time from ~20 minutes to the target of 10-12 minutes while maintaining full test coverage and reliability.

**Key Optimizations**:
1. **Configuration Tuning** (2-3 min savings)
   - Video compression optimized for faster encoding
   - Memory management improved
   - Timeout settings reduced appropriately

2. **Code Optimization** (3-4 min savings)
   - Fixed wait times replaced with assertions
   - Command delays reduced
   - Test transitions optimized

3. **Performance Monitoring** (observability)
   - Per-test timing metrics
   - Slowest test identification
   - CI duration reporting

**Test Suite Options**:
- **Smoke Tests** (`npm run test:e2e:smoke`): 5-6 minutes - Critical path validation
- **Full Suite** (`npm run test:e2e`): 10-12 minutes - Comprehensive testing
- **Reliability Check** (`npm run test:reliability`): <1 minute - Analyze flaky tests

For detailed optimization analysis and metrics, see [E2E_OPTIMIZATION_RESULTS.md](E2E_OPTIMIZATION_RESULTS.md).

---

## 🛡️ Test Reliability & Stability (Nov 2025)

### Test Isolation Infrastructure

**Global Cleanup Hooks** (`cypress/support/e2e.ts`):
```typescript
beforeEach(() => {
  // Clear browser storage
  cy.clearLocalStorage();
  cy.clearCookies();
  
  // Reset viewport
  cy.viewport(1280, 720);
  
  // Clear game state
  // Start resource monitoring
  cy.startResourceMonitoring();
});

afterEach(() => {
  // Detect resource leaks
  cy.detectResourceLeaks();
  
  // Log test metrics
  // Force cleanup resources
});
```

**Test Isolation Utilities** (`cypress/support/test-isolation.ts`):
- `cy.isolateTest()` - Reset to clean state before test
- `cy.cleanupTest()` - Clean up after test completion
- `cy.captureState()` - Capture current state for restoration
- `cy.restoreState()` - Restore previously captured state
- State management: localStorage, sessionStorage, game state, timers, event listeners

**Resource Monitoring** (`cypress/support/resource-monitoring.ts`):
- `cy.startResourceMonitoring()` - Begin tracking resources
- `cy.detectResourceLeaks()` - Check for leaks after test
- `cy.logResourceReport()` - Log detailed resource usage
- `cy.forceResourceCleanup()` - Force cleanup all resources
- Tracks: audio elements, canvas elements, memory usage, event listeners

### Flakiness Detection (CI)

**Pull Request Testing** (`.github/workflows/test-and-report.yml`):
- Runs smoke tests 3 times on every PR
- Detects inconsistent behavior (0 < failures < 3 = flaky)
- Reports consistent failures (all 3 runs fail)
- Uploads results as artifacts for analysis

**Reliability Reporting** (`scripts/generate-reliability-report.cjs`):
```bash
npm run test:reliability
```

Generates:
- HTML report with metrics and flaky test details
- Console summary with pass rates and failures
- Identifies flaky tests with pass rate percentages
- Lists consistently failing tests
- Calculates average test duration

### Configuration Changes

**Cypress Retries** (`cypress.config.ts`):
- `runMode`: Reduced from 2 to 1 (better flaky detection)
- `openMode`: Reduced from 1 to 0 (immediate feedback)
- Encourages fixing tests rather than masking flakiness

**Timeout Settings** (optimized for reliability):
- `defaultCommandTimeout`: 5000ms (fast failure detection)
- `pageLoadTimeout`: 12000ms (sufficient for app load)
- `requestTimeout`: 6000ms (reasonable for API calls)
- `responseTimeout`: 6000ms (matches request timeout)

### Best Practices for Test Authors

**Using Test Isolation**:
```typescript
describe('My Feature Tests', () => {
  beforeEach(() => {
    cy.isolateTest(); // Optional: explicit isolation
    cy.visit('/');
  });
  
  afterEach(() => {
    cy.cleanupTest(); // Optional: explicit cleanup
  });
  
  it('should work reliably', () => {
    // Test implementation
    // Global hooks handle most cleanup automatically
  });
});
```

**Resource Monitoring**:
```typescript
it('should not leak resources', () => {
  cy.startResourceMonitoring(); // Optional: already in global hook
  
  // Perform test actions
  cy.get('[data-testid="button"]').click();
  
  cy.detectResourceLeaks(); // Optional: already in global hook
  // Logs warnings if leaks detected
});
```

**Checking for Flakiness Locally**:
```bash
# Run tests multiple times
for i in {1..5}; do npm run test:e2e:smoke; done

# Generate reliability report
npm run test:reliability
```

### Metrics & Achievements

**Current Status** (as of Nov 2025):
- ✅ **0% Flaky Test Rate** (target achieved)
- ✅ **100% Pass Rate** (10/10 smoke tests)
- ✅ **Resource Monitoring Active** (detects 10-30MB memory growth)
- ✅ **Complete Test Isolation** (state reset between tests)
- ✅ **Reduced Retries** (1 or 0, down from 2)
- ✅ **CI Flakiness Detection** (3x runs on PRs)

**Before Improvements**:
- Flaky Test Rate: <1% (acceptable but not ideal)
- Retries: 2 (could mask flaky tests)
- Resource Leaks: Not monitored
- Test Isolation: Partial

**After Improvements**:
- Flaky Test Rate: 0% (zero tolerance)
- Retries: 1 (runMode), 0 (openMode)
- Resource Leaks: Monitored and logged
- Test Isolation: Complete with global hooks

---

**📋 Document Metadata:**  
**✅ Approved by:** Development Team  
**📤 Distribution:** Development Team, QA Team, Security Team  
**🔄 Review Cycle:** Monthly  
**⏰ Last Updated:** 2025-11-17  
**📝 Version:** 1.2.0 (Test Reliability Enhanced)  
**👤 Maintained by:** Test Specialist Agent

---

**🥋 흑괘의 품질을 지키라** - _Protect the Quality of Black Trigram_
