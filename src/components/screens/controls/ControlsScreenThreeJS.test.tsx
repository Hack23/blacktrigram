import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ControlsScreenThreeJS } from "./ControlsScreenThreeJS";

// Mock Three.js Canvas to avoid WebGL issues in test environment
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="three-canvas">{children}</div>,
  useFrame: vi.fn(),
}));

vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => <div data-testid="three-html">{children}</div>,
}));

// Mock audio provider
vi.mock("../../../audio/AudioProvider", () => ({
  useAudio: () => ({
    playSFX: vi.fn(),
    playMusic: vi.fn(),
    stopMusic: vi.fn(),
    fadeIn: vi.fn().mockResolvedValue(undefined),
    fadeOut: vi.fn().mockResolvedValue(undefined),
    isInitialized: true,
  }),
}));

describe("ControlsScreenThreeJS", () => {
  it("should render without crashing", () => {
    const onReturnToMenu = vi.fn();
    const { container } = render(
      <ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />
    );

    expect(container).toBeTruthy();
  });

  it("should have controls-screen test id", () => {
    const onReturnToMenu = vi.fn();
    const { getByTestId } = render(
      <ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />
    );

    expect(getByTestId("controls-screen")).toBeTruthy();
  });

  it("should render Three.js Canvas", () => {
    const onReturnToMenu = vi.fn();
    const { getByTestId } = render(
      <ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />
    );

    expect(getByTestId("three-canvas")).toBeTruthy();
  });

  it("should render HTML overlay", () => {
    const onReturnToMenu = vi.fn();
    const { getByTestId } = render(
      <ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />
    );

    expect(getByTestId("three-html")).toBeTruthy();
  });

  it("should accept width and height props", () => {
    const onReturnToMenu = vi.fn();
    const { container } = render(
      <ControlsScreenThreeJS 
        onReturnToMenu={onReturnToMenu} 
        width={1920}
        height={1080}
      />
    );

    const screenElement = container.querySelector('[data-testid="controls-screen"]');
    expect(screenElement).toBeTruthy();
  });

  describe("Control Sections", () => {
    it("should render trigram stances section", () => {
      const onReturnToMenu = vi.fn();
      render(<ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />);

      const trigramSection = screen.getByTestId("trigram-controls");
      expect(trigramSection).toBeTruthy();
      expect(trigramSection.textContent).toContain("팔괘 무술 자세");
      expect(trigramSection.textContent).toContain("Eight Trigram Combat Stances");
    });

    it("should render all 8 stance controls", () => {
      const onReturnToMenu = vi.fn();
      render(<ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />);

      // Check for all 8 stances (1-8 keys)
      for (let i = 1; i <= 8; i++) {
        const stanceControl = screen.getByTestId(`stance-control-${i}`);
        expect(stanceControl).toBeTruthy();
      }
    });

    it("should render combat controls section", () => {
      const onReturnToMenu = vi.fn();
      render(<ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />);

      const combatSection = screen.getByTestId("combat-controls");
      expect(combatSection).toBeTruthy();
      expect(combatSection.textContent).toContain("실전 격투 조작");
      expect(combatSection.textContent).toContain("Combat Actions");
    });

    it("should render movement controls section with WASD and Arrow keys", () => {
      const onReturnToMenu = vi.fn();
      render(<ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />);

      const movementSection = screen.getByTestId("movement-controls");
      expect(movementSection).toBeTruthy();
      expect(movementSection.textContent).toContain("이동 조작");
      expect(movementSection.textContent).toContain("Movement Controls");
      expect(movementSection.textContent).toContain("WASD");
      expect(movementSection.textContent).toContain("방향키");
    });

    it("should render advanced footwork section", () => {
      const onReturnToMenu = vi.fn();
      render(<ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />);

      const footworkSection = screen.getByTestId("advanced-footwork");
      expect(footworkSection).toBeTruthy();
      expect(footworkSection.textContent).toContain("고급 보법");
      expect(footworkSection.textContent).toContain("Advanced Footwork");
    });

    it("should display tactical steps (Shift+WASD) with IMPLEMENTED status", () => {
      const onReturnToMenu = vi.fn();
      render(<ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />);

      const footworkSection = screen.getByTestId("advanced-footwork");
      expect(footworkSection.textContent).toContain("전술보법");
      expect(footworkSection.textContent).toContain("Shift + WASD");
      expect(footworkSection.textContent).toContain("IMPLEMENTED");
      expect(footworkSection.textContent).toContain("전진보법"); // Forward step
      expect(footworkSection.textContent).toContain("후퇴보법"); // Retreat step
    });

    it("should display footwork patterns (Ctrl+WASD) with IMPLEMENTED status", () => {
      const onReturnToMenu = vi.fn();
      render(<ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />);

      const footworkSection = screen.getByTestId("advanced-footwork");
      expect(footworkSection.textContent).toContain("원형보"); // Circular step
      expect(footworkSection.textContent).toContain("Ctrl+A");
      expect(footworkSection.textContent).toContain("Ctrl+D");
      expect(footworkSection.textContent).toContain("미끄럼보"); // Slide step
      expect(footworkSection.textContent).toContain("Ctrl+W");
      expect(footworkSection.textContent).toContain("Ctrl+S");
    });

    it("should display all advanced footwork patterns including pivot and shuffle", () => {
      const onReturnToMenu = vi.fn();
      render(<ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />);

      const footworkSection = screen.getByTestId("advanced-footwork");
      expect(footworkSection.textContent).toContain("추가 보법"); // Advanced Patterns
      expect(footworkSection.textContent).toContain("축족회전"); // Pivot
      expect(footworkSection.textContent).toContain("섞음보"); // Shuffle
      expect(footworkSection.textContent).toContain("IMPLEMENTED"); // Now implemented
      expect(footworkSection.textContent).toContain("Shift+Ctrl"); // New keybinding
    });

    it("should render stance side switch section", () => {
      const onReturnToMenu = vi.fn();
      render(<ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />);

      const sideSwitchSection = screen.getByTestId("stance-side-switch");
      expect(sideSwitchSection).toBeTruthy();
      expect(sideSwitchSection.textContent).toContain("자세 발 바꿈");
      expect(sideSwitchSection.textContent).toContain("Stance Side Switch");
      expect(sideSwitchSection.textContent).toContain("H"); // H key
      expect(sideSwitchSection.textContent).toContain("Switch Front Foot");
      expect(sideSwitchSection.textContent).toContain("IMPLEMENTED");
    });

    it("should render technique controls section", () => {
      const onReturnToMenu = vi.fn();
      render(<ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />);

      const techniqueSection = screen.getByTestId("technique-controls");
      expect(techniqueSection).toBeTruthy();
      expect(techniqueSection.textContent).toContain("기술 실행");
      expect(techniqueSection.textContent).toContain("Technique Execution");
    });

    it("should display all 10 technique keys", () => {
      const onReturnToMenu = vi.fn();
      render(<ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />);

      const techniqueSection = screen.getByTestId("technique-controls");
      const techniqueKeys = ["Q", "E", "R", "T", "Y", "F", "G", "Z", "X", "C"];
      
      techniqueKeys.forEach((key) => {
        expect(techniqueSection.textContent).toContain(key);
      });
    });

    it("should render special features section", () => {
      const onReturnToMenu = vi.fn();
      render(<ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />);

      const specialSection = screen.getByTestId("special-features");
      expect(specialSection).toBeTruthy();
      expect(specialSection.textContent).toContain("특수 기능");
      expect(specialSection.textContent).toContain("Special Features");
    });

    it("should display vital points overlay control (V key)", () => {
      const onReturnToMenu = vi.fn();
      render(<ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />);

      const specialSection = screen.getByTestId("special-features");
      expect(specialSection.textContent).toContain("V");
      expect(specialSection.textContent).toContain("급소 표시");
      expect(specialSection.textContent).toContain("vital points");
    });

    it("should display block/guard control (B key)", () => {
      const onReturnToMenu = vi.fn();
      render(<ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />);

      const specialSection = screen.getByTestId("special-features");
      expect(specialSection.textContent).toContain("B");
      expect(specialSection.textContent).toContain("방어 자세");
    });

    it("should display control hints key (F1)", () => {
      const onReturnToMenu = vi.fn();
      render(<ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />);

      const specialSection = screen.getByTestId("special-features");
      expect(specialSection.textContent).toContain("F1");
      expect(specialSection.textContent).toContain("조작법 힌트");
    });

    it("should display pause/menu controls (ESC/M)", () => {
      const onReturnToMenu = vi.fn();
      render(<ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />);

      const specialSection = screen.getByTestId("special-features");
      expect(specialSection.textContent).toContain("ESC");
      expect(specialSection.textContent).toContain("M");
      expect(specialSection.textContent).toContain("일시정지");
    });
  });

  describe("Responsive Layout", () => {
    it("should adapt to mobile layout (width < 768px)", () => {
      const onReturnToMenu = vi.fn();
      const { container } = render(
        <ControlsScreenThreeJS 
          onReturnToMenu={onReturnToMenu} 
          width={400}
          height={600}
        />
      );

      const screenElement = container.querySelector('[data-testid="controls-screen"]');
      expect(screenElement).toBeTruthy();
    });

    it("should adapt to desktop layout (width >= 768px)", () => {
      const onReturnToMenu = vi.fn();
      const { container } = render(
        <ControlsScreenThreeJS 
          onReturnToMenu={onReturnToMenu} 
          width={1200}
          height={800}
        />
      );

      const screenElement = container.querySelector('[data-testid="controls-screen"]');
      expect(screenElement).toBeTruthy();
    });
  });

  describe("Korean Translations", () => {
    it("should display Korean text for all major sections", () => {
      const onReturnToMenu = vi.fn();
      const { container } = render(
        <ControlsScreenThreeJS onReturnToMenu={onReturnToMenu} />
      );

      const content = container.textContent || "";
      
      // Check for Korean section headers
      expect(content).toContain("팔괘 무술 자세"); // Trigram stances
      expect(content).toContain("실전 격투 조작"); // Combat actions
      expect(content).toContain("이동 조작"); // Movement
      expect(content).toContain("고급 보법"); // Advanced footwork
      expect(content).toContain("기술 실행"); // Technique execution
      expect(content).toContain("특수 기능"); // Special features
    });
  });
});
