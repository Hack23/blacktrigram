# GitHub Copilot Instructions for Black Trigram (흑괘)

PRIO 1: Follow existing React + Three.js patterns for 3D rendering and UI overlays
PRIO 2: Use established component structure and Korean martial arts theming
PRIO 3: Maintain type safety and proper error handling throughout

## 🎯 Core Operating Principles

**YOU MUST BE DECISIVE AND AUTONOMOUS:**

1. **DO NOT ask questions when the rules are clear** - Apply the rules and implement solutions
2. **DO NOT create new .md documentation files** unless explicitly requested by the user
3. **DO run comprehensive checks** before committing any code changes:
   - Type checking: `npm run check`
   - Linting: `npm run lint`
   - Unit tests: `npm test`
   - Build verification: `npm run build`

### Enforcement Rules

```
Rule 1: Korean Theming
IF (creating UI component OR modifying styles)
THEN (use KOREAN_COLORS constants AND bilingual text format)
ELSE (reject component - refer to korean-theming-standards skill)

Rule 2: Test Coverage
IF (adding new feature OR modifying logic)
THEN (add/update tests to maintain >90% coverage)
ELSE (implementation incomplete - refer to testing-strategy-enforcement skill)

Rule 3: Security Changes
IF (modifying authentication OR handling user data OR external APIs)
THEN (update SECURITY_ARCHITECTURE.md AND add security tests)
ELSE (reject change - refer to security-architecture-validation skill)

Rule 4: Architecture Changes
IF (modifying component structure OR data models OR system design)
THEN (update relevant C4 architecture documents)
ELSE (documentation incomplete - refer to c4-architecture-documentation skill)

Rule 5: Performance Requirements
IF (adding Three.js rendering OR heavy computations)
THEN (ensure 60fps target AND bundle size <500KB initial)
ELSE (optimize - refer to performance-optimization skill)

Rule 6: Game Development
IF (implementing game loop OR combat system OR animations)
THEN (use clamped delta AND fixed timestep for physics AND state machine)
ELSE (refer to game-development-patterns skill)

Rule 7: Korean Martial Arts Authenticity
IF (implementing Eight Trigrams OR vital points OR combat techniques)
THEN (verify anatomical accuracy AND cultural respect AND proper terminology)
ELSE (refer to korean-martial-arts-authenticity skill)

Rule 8: 3D Combat Systems
IF (implementing combat physics OR collision detection OR damage calculation)
THEN (use Rapier physics AND anatomical hitboxes AND deterministic formulas)
ELSE (refer to 3d-combat-systems skill)

Rule 9: Audio Integration
IF (adding audio effects OR spatial audio OR combat sounds)
THEN (use Howler.js AND PositionalAudio for 3D AND Korean-themed audio)
ELSE (refer to audio-game-integration skill)
```

## 📚 Agent and Skills Catalog

**Skills** = automatic enforcement of quality standards.
**Agents** = on-demand implementation assistance.

### Available Skills (Automatically Loaded)

1. **[security-architecture-validation](./skills/security-architecture-validation/SKILL.md)** - ISMS security-by-design enforcement
2. **[c4-architecture-documentation](./skills/c4-architecture-documentation/SKILL.md)** - C4 Model architecture standards
3. **[korean-theming-standards](./skills/korean-theming-standards/SKILL.md)** - Korean cyberpunk aesthetic rules
4. **[testing-strategy-enforcement](./skills/testing-strategy-enforcement/SKILL.md)** - >90% test coverage requirements
5. **[performance-optimization](./skills/performance-optimization/SKILL.md)** - 60fps and bundle size enforcement
6. **[isms-compliance-checking](./skills/isms-compliance-checking/SKILL.md)** - ISO 27001, NIST CSF, CIS Controls
7. **[threejs-best-practices](./skills/threejs-best-practices/SKILL.md)** - Three.js/React optimization patterns
8. **[game-development-patterns](./skills/game-development-patterns/SKILL.md)** - Game loop, state machines, deterministic physics
9. **[korean-martial-arts-authenticity](./skills/korean-martial-arts-authenticity/SKILL.md)** - Eight Trigrams, vital points, cultural accuracy
10. **[3d-combat-systems](./skills/3d-combat-systems/SKILL.md)** - Physics-based combat, hitboxes, damage calculations
11. **[audio-game-integration](./skills/audio-game-integration/SKILL.md)** - Spatial audio, combat feedback, Korean soundscapes

**📖 [Complete Skills Documentation](./skills/README.md)**

### Available Custom Agents (On-Demand)

1. **[@task-agent](./agents/task-agent.md)** - Product quality orchestrator, creates issues
2. **[@coding-agent](./agents/coding-agent.md)** - TypeScript/React/Three.js implementation
3. **[@frontend-specialist](./agents/frontend-specialist.md)** - React 19 and strict TypeScript expert
4. **[@game-developer](./agents/game-developer.md)** - Three.js game systems and 60fps optimization
5. **[@korean-martial-arts-expert](./agents/korean-martial-arts-expert.md)** - Martial arts authenticity and vital point systems
6. **[@testing-agent](./agents/testing-agent.md)** - Vitest and Cypress test implementation
7. **[@test-engineer](./agents/test-engineer.md)** - Test strategy and CI integration
8. **[@documentation-writer](./agents/documentation-writer.md)** - Technical docs and bilingual content
9. **[@code-review-agent](./agents/code-review-agent.md)** - Code quality and standards review
10. **[@security-specialist](./agents/security-specialist.md)** - Supply chain security and OSSF Scorecard

**📖 [Complete Agents Documentation](./agents/README.md)**

### When to Use Skills vs Agents

| Situation | Use Skills | Use Agents |
|-----------|-----------|------------|
| Writing code | ✅ Automatic enforcement | ❌ Not needed |
| Complex feature | ✅ Quality validation | ✅ Invoke specialist agent |
| Bug fix | ✅ Standards enforcement | ✅ If complex, invoke agent |
| Documentation | ✅ Standards enforcement | ✅ Invoke @documentation-writer |
| Security review | ✅ Automatic validation | ✅ Invoke @security-specialist |

## 🔧 Code Patterns & Architecture

### React + Three.js Component Pattern

```typescript
import { Canvas } from '@react-three/fiber';
import { Html, PerspectiveCamera } from '@react-three/drei';
import { KOREAN_COLORS } from '../../types/constants';

export const ComponentName: React.FC<Props> = ({ width, height, isMobile }) => {
  const layout = useMemo(() => ({
    padding: isMobile ? 10 : 20,
    fontSize: isMobile ? 12 : 16,
  }), [isMobile]);

  return (
    <Canvas style={{ width, height }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]} data-testid="component-name">
      <ambientLight intensity={0.5} color={KOREAN_COLORS.PRIMARY_CYAN} />
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} />
      <Html fullscreen>
        <div style={{ padding: layout.padding }}>{/* UI content */}</div>
      </Html>
    </Canvas>
  );
};
```

### Korean Theming Pattern

```typescript
import { KOREAN_COLORS, FONT_FAMILY } from '../../types/constants';

// Bilingual text in Html overlay
<Html center position={[0, 2, 0]}>
  <div style={{ color: KOREAN_COLORS.ACCENT_GOLD, fontFamily: FONT_FAMILY.KOREAN }} data-testid="bilingual-text">
    {korean} | {english}
  </div>
</Html>

// Korean-themed 3D material
<meshStandardMaterial color={KOREAN_COLORS.UI_BACKGROUND_DARK}
  emissive={KOREAN_COLORS.PRIMARY_CYAN} emissiveIntensity={0.2} metalness={0.5} roughness={0.5} />
```

### Props & State Pattern

```typescript
// ALWAYS use readonly properties with explicit types
export interface ComponentProps {
  readonly width: number;
  readonly height: number;
  readonly isMobile?: boolean;
  readonly onAction?: (data: ActionData) => void;
}

// Use ?? for null coalescing, useCallback for handlers
const handleAction = useCallback((param: string) => { onAction?.(param); }, [onAction]);
const safeValue = value ?? defaultValue;
```

### Audio Integration Pattern

```typescript
import { useAudio } from '../../audio/AudioProvider';
const audio = useAudio();
const handleAction = useCallback(() => { audio.playSFX('menu_select'); }, [audio]);
```

### useFrame Animation Pattern

```typescript
// ALWAYS use useFrame for 60fps animations, never create objects per frame
useFrame((state, delta) => {
  if (!groupRef.current) return;
  velocityRef.current.lerp(targetVelocity, 0.1);
  groupRef.current.position.add(velocityRef.current.clone().multiplyScalar(delta));
  groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, 0.1);
});
```

### Html Overlay vs 3D Mesh Decision

| Content Type | Use | Why |
|---|---|---|
| UI elements (buttons, text, HUD, menus) | `<Html>` overlay | Interactive, styled with CSS, bilingual text |
| Game objects (characters, arena, weapons) | 3D `<mesh>` / `<group>` | Part of 3D world, physics-enabled |
| Visual effects (particles, auras, impacts) | 3D `<pointLight>` / shaders | GPU-accelerated, in-world |
| Player labels / health bars over characters | `<Html center position={...}>` | Tracks 3D position, renders as HTML |
| Fullscreen HUD / control panels | `<Html fullscreen>` | Absolute positioned over entire canvas |

**Hybrid approach recommended**: Combine 3D meshes for the game world with Html overlays for UI.

## 📚 File Organization

```plaintext
src/components/
├── ui/                       # UI components (React + CSS)
│   ├── base/                 # KoreanButton, KoreanPanel, BaseComponents
│   ├── combat/               # TrigramSelector, HealthBar, VitalPointOverlayControlsHtml
│   ├── containers/           # CombatHUD, PlayerStatusPanel
│   └── texts/                # BilingualText, CombatLog
├── three/                    # Three.js 3D components
│   ├── scenes/               # CombatScene, TrainingScene
│   ├── models/               # Character3D, Environment3D
│   └── effects/              # ParticleEffects, StanceAura3D
├── audio/                    # AudioProvider, sounds/
├── hooks/                    # useCombat, usePlayer, useThreeScene
├── screens/                  # CombatScreen, IntroScreen, SettingsScreen
└── utils/                    # constants, threeHelpers, helpers
```

### Component Naming Conventions

| Suffix | Type | Examples |
|---|---|---|
| `*OverlayHtml.tsx` | HTML overlay (2D UI over 3D) | `TrainingStatsOverlayHtml`, `PlayerStateOverlayHtml`, `BaseButtonOverlayHtml` |
| `*3D.tsx` | Three.js mesh/group (3D objects) | `TrainingDummy3D`, `CombatArena3D`, `VitalPointMarker3D` |

### Component Design Principles

- **Three.js Foundation**: All 3D content uses @react-three/fiber and @react-three/drei
- **Html Overlays**: Use `Html` from @react-three/drei for UI elements over 3D scenes
- **Korean Theming**: Consistent cyberpunk Korean aesthetic with traditional color harmony
- **Composition**: Build complex interfaces through component composition
- **Responsiveness**: All components adapt to mobile (`width < 768`), tablet, and desktop

### Three.js Component Extensions

| Base Pattern | Korean Extension | Use Case |
|---|---|---|
| `mesh` | `KoreanStyledMesh` | Game objects with Korean aesthetics |
| `group` | `CharacterGroup` | Character models in eight trigram stances |
| `Html` | `KoreanHUD`, `StatusPanel` | Combat HUD and player information |
| `pointLight` | `StanceAura` | Trigram stance visual indicators |
| `particleSystem` | `CombatEffects` | Attack and defense visual feedback |
| `Canvas` | `GameCanvas` | Main game rendering surface |

## 🎮 Korean Martial Arts Integration

### Eight Trigram System (팔괘 체계)

- **☰ 건 (Geon)** - Heaven: Direct force techniques
- **☱ 태 (Tae)** - Lake: Fluid joint manipulation
- **☲ 리 (Li)** - Fire: Precise nerve strikes
- **☳ 진 (Jin)** - Thunder: Explosive power techniques
- **☴ 손 (Son)** - Wind: Continuous pressure attacks
- **☵ 감 (Gam)** - Water: Flow and adaptation techniques
- **☶ 간 (Gan)** - Mountain: Defensive mastery
- **☷ 곤 (Gon)** - Earth: Grounding and takedown techniques

### Player Archetypes (플레이어 원형)

- **무사 (Musa)** - Traditional Warrior: Honor through disciplined strength
- **암살자 (Amsalja)** - Shadow Assassin: Precision through stealth
- **해커 (Hacker)** - Cyber Warrior: Technology-enhanced combat
- **정보요원 (Jeongbo Yowon)** - Intelligence Operative: Strategic analysis
- **조직폭력배 (Jojik Pokryeokbae)** - Organized Crime: Ruthless pragmatism

### Combat Pillars

- **정격자 (Jeonggyeokja)** - Precision Striker: Every strike targets anatomical vulnerabilities
- **비수 (Bisu)** - Lethal Technique: Realistic application of traditional martial arts
- **암살자 (Amsalja)** - Combat Specialist: Focus on immediate incapacitation
- **급소격 (Geupsogyeok)** - Vital Point Strike: Authentic pressure point combat

## 🧪 Testing Strategy

### Infrastructure

- **Setup**: `src/test/setup.ts` - Audio and Three.js mocking
- **Utils**: `src/test/test-utils.ts` - Testing utilities
- **Audio Tests**: Comprehensive coverage in `src/audio/__tests__/`
- **System Tests**: Coverage for combat systems

### Test Pattern for Three.js Components

```typescript
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';

function render3D(component: React.ReactElement) {
  return render(<Canvas><Suspense fallback={null}>{component}</Suspense></Canvas>);
}

describe('Component3D', () => {
  it('should render without crashing', () => {
    const { container } = render3D(<Component3D position={[0, 0, 0]} stance="geon" />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });
});
```

### Coverage Goals

- Three.js components: >85% | UI components: >95% | Korean text: 100% | Accessibility: >85%

### Test Best Practices

- Always add `data-testid` attributes to interactive elements
- Use `vi.fn()` for mock handlers
- Test responsive behavior with different width/height props
- Write resilient tests that don't depend on implementation details

## 🔨 Build and Development Workflow

### Essential Commands

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run check            # TypeScript type checking
npm run lint             # ESLint code quality

# Building
npm run build            # Production build
npm run build:analyze    # Bundle size analysis
npm run preview          # Preview production build

# Testing
npm test                 # Unit tests (Vitest)
npm run coverage         # Tests with coverage report
npm run test:e2e         # Cypress E2E tests
npm run test:systems     # Combat system tests

# Code Quality
npm run find:unused      # Find unused code (Knip)
npm run test:licenses    # Validate dependency licenses
npm run validate:mcp     # Validate Copilot MCP config
npm run docs             # Generate TypeDoc documentation
```

### Development Workflow

1. **Before coding**: `npm run check && npm run lint`
2. **During development**: `npm run dev` for hot reload
3. **Before committing**: `npm run lint && npm run check && npm test`
4. **For PRs**: Ensure `npm run test:e2e` passes and review `npm run coverage`

### TypeScript Configuration

- **Strict mode enabled** — no implicit any, always provide explicit types
- **Readonly properties** — prefer `readonly` for interfaces and props
- **Null handling** — use `??` for null coalescing, avoid `||` where possible

## 📦 Dependency Management

- ✅ **Core**: React 19, Three.js, TypeScript
- ✅ **3D**: @react-three/fiber, @react-three/drei
- ✅ **Audio**: Howler.js
- ✅ **Testing**: Vitest, Cypress, Testing Library
- ✅ **Build**: Vite, ESLint, TypeScript
- ⚠️ **New deps**: Must pass `npm audit` and `npm run test:licenses`, install with `--save-exact`

Update policy: Security updates immediately, minor/patch after testing, major after architecture review.

## 🔍 Code Review Standards

### Before Requesting Review

- [ ] All tests pass (`npm test` and `npm run test:e2e`)
- [ ] No TypeScript errors (`npm run check`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] Coverage maintained or improved (`npm run coverage`)
- [ ] Documentation updated (JSDoc, README, ARCHITECTURE.md if needed)
- [ ] MCP validated (`npm run validate:mcp`), no unused code (`npm run find:unused`)
- [ ] License compliance verified (`npm run test:licenses`)

### Review Checklist

**Architecture**: Follows React + Three.js patterns, proper Html overlay use, Korean theming, component composition
**Code Quality**: Strict TypeScript, error handling, 60fps performance, no console.log in production, useMemo/useCallback optimization
**Testing**: Unit tests for new logic, E2E for workflows, data-testid on interactive elements, edge cases covered
**Documentation**: JSDoc for public APIs, bilingual text provided, README/ARCHITECTURE.md updated if needed

## ⚠️ Anti-Patterns to Avoid

- ❌ Creating new Three.js objects every frame — use `useMemo` to reuse geometry/materials
- ❌ Not cleaning up Three.js resources on unmount — `dispose()` in `useEffect` cleanup
- ❌ Using Html overlays for in-world objects — prefer 3D meshes for game objects
- ❌ Hardcoded positioning — use responsive layout calculations with `useMemo`
- ❌ Missing `data-testid` attributes on interactive elements
- ❌ Non-readonly interface properties — always use `readonly`
- ❌ Using `||` instead of `??` for defaults — `??` handles `0` and `""` correctly
- ❌ Unsafe non-null assertion (`!`) — use proper null checks
- ❌ Missing Korean cultural context in component design
- ❌ Performance-heavy operations without optimization (instancing, LOD, memoization)
- ❌ Missing Korean font — always use `FONT_FAMILY.KOREAN` from constants
- ❌ No console.log in production code

### Three.js Performance Rules

- Use `Instances`/`Instance` from drei for repeated geometry
- Use `Detailed` (LOD) from drei for distant objects
- Memoize shared geometries and materials with `useMemo`
- Clean up with `.dispose()` in `useEffect` return

## 🌟 Success Criteria

All code following these guidelines should:

- ✅ Use Three.js with @react-three/fiber for 3D rendering
- ✅ Use Html overlays from @react-three/drei for UI elements
- ✅ Implement responsive layouts across all screen sizes
- ✅ Include proper Korean-English bilingual support
- ✅ Follow accessibility best practices with proper test IDs
- ✅ Maintain cyberpunk Korean aesthetic consistently
- ✅ Achieve 60fps performance for all 3D rendering
- ✅ Provide >90% test coverage (>85% for Three.js components)
- ✅ Use proper Three.js optimization (instancing, LOD, memoization)
- ✅ Implement authentic Korean martial arts mechanics
- ✅ Respect traditional Korean culture and terminology
- ✅ Use existing type system and components extensively

## 🎯 Philosophy

**Remember**: Black Trigram represents the intersection of traditional Korean martial arts wisdom and modern interactive technology. Every implementation should honor this balance while providing authentic, educational, and respectful gameplay through 3D immersion and extensible design patterns.

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
