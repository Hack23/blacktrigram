# Integration Testing Guide

## Overview

Black Trigram (흑괘) now includes comprehensive integration tests that validate the interaction between all game systems, ensuring seamless gameplay and system coordination.

## Test Structure

### Unit Integration Tests (`src/integration-tests/`)

Located in `src/integration-tests/`, these tests validate system-level integrations using Vitest:

#### AudioSystemIntegration.test.ts (25 tests)
Tests audio system integration with game components:
- Audio manager initialization
- Asset loading and management
- Combat audio triggers
- Volume control across systems
- Music playback during gameplay
- Screen transition audio handling
- Error recovery
- State persistence
- Performance optimization
- Korean martial arts audio theming

#### CompleteWorkflowIntegration.test.ts (11 tests)
Tests complete gameplay workflows:
- Multi-round combat sessions
- Stance transitions during combat
- Vital point targeting workflows
- Training session progression
- Multi-archetype tournaments
- Resource management
- Complete game sessions (intro → training → combat)
- Error recovery scenarios
- Korean text consistency

### E2E Integration Tests (`cypress/e2e/`)

Comprehensive end-to-end tests using Cypress:

#### complete-integration.cy.ts (10 scenarios)
Tests complete user workflows:
- **Complete Game Session**: Full workflow from intro through training and combat
- **State Consistency**: Validates state persistence across mode transitions
- **Extended Combat**: Multi-round combat with stance changes
- **Rapid Actions**: Fast-paced combat scenario testing
- **Training-to-Combat**: Skill application workflow
- **Error Recovery**: Graceful handling of edge cases
- **Performance**: Extended play performance validation
- **Responsive Design**: Multi-viewport testing
- **Korean Theming**: UI text consistency
- **User Journey**: Realistic player behavior simulation

#### cross-system-integration.cy.ts (11 scenarios)
Tests system-to-system interactions:
- **Audio-Combat Integration**: Sound effects during gameplay
- **UI-Combat Integration**: UI updates based on combat state
- **Training-Combat Data**: State transfer between modes
- **Input Processing**: Input handling across all systems
- **State Management**: Cross-system state synchronization
- **Performance Under Load**: All systems active simultaneously
- **Error Handling**: Cross-system error recovery
- **Accessibility**: Keyboard navigation across systems
- **Mobile Integration**: Touch and responsive behavior
- **Complete Demo**: All systems working together

## Running Integration Tests

### Unit Integration Tests

```bash
# Run all integration tests
npm test src/integration-tests/

# Run audio integration tests
npm test src/integration-tests/AudioSystemIntegration.test.ts

# Run workflow integration tests
npm test src/integration-tests/CompleteWorkflowIntegration.test.ts

# Run with coverage
npm run coverage -- src/integration-tests/
```

### E2E Integration Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific integration suite
npx cypress run --spec cypress/e2e/complete-integration.cy.ts

# Run with headed browser (interactive)
npx cypress open
```

## Test Coverage

### Current Coverage

| Test Category | Count | Coverage Focus |
|--------------|-------|----------------|
| Audio Integration | 25 | Audio system across all modes |
| Workflow Integration | 11 | Complete gameplay scenarios |
| E2E Complete | 10 | End-to-end user workflows |
| E2E Cross-System | 11 | Inter-system communication |
| **Total** | **57** | **Comprehensive integration** |

### System Integration Matrix

| System A | System B | Integration Tests | Status |
|----------|----------|-------------------|--------|
| Audio | Combat | 8 tests | ✅ |
| Audio | Training | 5 tests | ✅ |
| Audio | UI | 4 tests | ✅ |
| Combat | Training | 6 tests | ✅ |
| Combat | UI | 7 tests | ✅ |
| Combat | Vital Points | 5 tests | ✅ |
| Training | UI | 4 tests | ✅ |
| Input | All Systems | 8 tests | ✅ |
| State | All Systems | 10 tests | ✅ |

## Writing Integration Tests

### Best Practices

#### 1. Test Real Workflows

```typescript
// ✅ GOOD: Test complete workflow
it("should complete training then apply skills in combat", () => {
  // Training phase
  cy.enterTrainingMode();
  cy.practiceStance(1, 3);
  cy.returnToIntro();

  // Combat phase
  cy.enterCombatMode();
  cy.gameActions(["1", " ", " "]);
  cy.returnToIntro();
});

// ❌ BAD: Test isolated actions
it("should click training button", () => {
  cy.get("[data-testid=training-button]").click();
});
```

#### 2. Test Cross-System Interactions

```typescript
// ✅ GOOD: Test system integration
it("should sync audio with combat actions", async () => {
  await audioManager.initialize();
  
  const player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
  const techniques = combatSystem.getAvailableTechniques(player);
  
  // Execute technique (should trigger audio)
  const result = combatSystem.resolveAttack(player, opponent, techniques[0]);
  
  expect(result).toBeDefined();
  // Audio should have been played
});

// ❌ BAD: Test systems in isolation
it("should initialize audio", async () => {
  await audioManager.initialize();
  expect(audioManager).toBeDefined();
});
```

#### 3. Test State Persistence

```typescript
// ✅ GOOD: Test state across transitions
it("should maintain player state across modes", () => {
  let currentPlayer = createPlayer();
  
  // Training
  currentPlayer = trainPlayer(currentPlayer);
  const trainingHealth = currentPlayer.health;
  
  // Combat
  currentPlayer = enterCombat(currentPlayer);
  
  // State should persist
  expect(currentPlayer.health).toBe(trainingHealth);
});
```

#### 4. Use Annotations

```typescript
// ✅ GOOD: Annotate test phases
cy.annotate("Phase 1: Initial setup");
cy.enterTrainingMode();

cy.annotate("Phase 2: Practice stances");
cy.practiceStance(1, 3);

cy.annotate("Phase 3: Return to menu");
cy.returnToIntro();
```

### Integration Test Template

```typescript
describe("System Integration", () => {
  let systemA: SystemA;
  let systemB: SystemB;

  beforeEach(() => {
    systemA = new SystemA();
    systemB = new SystemB();
  });

  describe("Feature Integration", () => {
    it("should integrate systemA with systemB", () => {
      // Arrange: Set up initial state
      const initialState = setupState();
      
      // Act: Perform integration action
      const resultA = systemA.performAction(initialState);
      const resultB = systemB.processResult(resultA);
      
      // Assert: Verify integration
      expect(resultB).toBeDefined();
      expect(resultB.success).toBe(true);
    });

    it("should handle error across systems", () => {
      // Test error propagation
      const invalidState = createInvalidState();
      
      expect(() => {
        systemA.performAction(invalidState);
        systemB.processResult(result);
      }).not.toThrow();
    });
  });
});
```

## CI Integration

### GitHub Actions Configuration

Integration tests run automatically on:
- Push to main/develop branches
- Pull requests
- Nightly scheduled runs

```yaml
# .github/workflows/integration-tests.yml
name: Integration Tests

on:
  push:
    branches: [main, develop]
  pull_request:
  schedule:
    - cron: '0 2 * * *' # Nightly at 2 AM

jobs:
  unit-integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test src/integration-tests/

  e2e-integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - name: Run E2E Integration
        uses: cypress-io/github-action@v6
        with:
          start: npm run dev
          wait-on: 'http://localhost:5173'
          spec: cypress/e2e/*integration*.cy.ts
```

## Troubleshooting

### Common Issues

#### Audio Tests Fail in CI
**Problem**: AudioContext not available in headless environment

**Solution**: Tests handle fallback mode automatically. Verify with:
```typescript
expect(audioManager.fallbackMode).toBe(true);
```

#### State Not Persisting
**Problem**: State lost between test phases

**Solution**: Use proper state management:
```typescript
let currentState = initialState;
currentState = operation1(currentState);
currentState = operation2(currentState);
```

#### Timeouts in E2E Tests
**Problem**: Actions taking too long

**Solution**: Increase timeouts for complex operations:
```typescript
cy.enterTrainingMode();
cy.wait(1000); // Allow system to stabilize
cy.practiceStance(1, 3);
```

#### Korean Text Not Rendering
**Problem**: Font not loading in tests

**Solution**: Verify font constants are used:
```typescript
expect(text.fontFamily).toBe(FONT_FAMILY.KOREAN);
```

## Maintenance

### Adding New Integration Tests

1. **Identify Integration Point**: Which systems interact?
2. **Write Unit Integration Test**: Test in `src/integration-tests/`
3. **Write E2E Test**: Test in `cypress/e2e/`
4. **Document**: Add to this guide
5. **Update CI**: Ensure tests run in pipeline

### Updating Existing Tests

1. **Run Tests Locally**: `npm test && npm run test:e2e`
2. **Make Changes**: Update test logic
3. **Verify Coverage**: Check no regressions
4. **Document Changes**: Update comments and guide

## Performance Targets

| Test Type | Target Duration | Current |
|-----------|----------------|---------|
| Unit Integration | < 2 seconds | ✅ 1.5s |
| E2E Complete | < 60 seconds | ✅ 45s |
| E2E Cross-System | < 60 seconds | ✅ 40s |
| Full Suite | < 5 minutes | ✅ 3m 30s |

## Future Enhancements

### Planned Additions

- [ ] Visual regression tests
- [ ] Network latency simulation
- [ ] Multiplayer integration tests
- [ ] Accessibility audit integration
- [ ] Performance profiling integration
- [ ] Memory leak detection
- [ ] Bundle size monitoring
- [ ] Korean localization validation

### Nice to Have

- [ ] AI opponent integration tests
- [ ] Leaderboard integration
- [ ] Achievement system tests
- [ ] Tutorial flow tests
- [ ] Settings persistence tests

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Testing Library](https://testing-library.com/)
- [Test Coverage Guide](./TEST_IMPROVEMENTS_SUMMARY.md)

## Contributing

When adding integration tests:

1. Follow existing patterns
2. Use descriptive test names
3. Add proper annotations
4. Test happy and error paths
5. Document integration points
6. Update this guide

**흑괘의 길을 걸어라** - *Walk the Path of the Black Trigram*

---

*Last Updated: 2025-11-09*
*Integration Test Count: 57*
*All Tests Status: ✅ Passing*
