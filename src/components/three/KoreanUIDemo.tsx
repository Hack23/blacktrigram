/**
 * KoreanUIDemo - Demonstration component for Three.js Korean UI Library
 * 
 * Showcases all available UI components with Korean theming
 * Serves as both integration example and component documentation
 * 
 * @module components/three
 */

import { Canvas } from "@react-three/fiber";
import React, { useState, useCallback } from "react";
import { PlayerArchetype } from "../../types/common";
import { KOREAN_COLORS } from "../../types/constants";
import {
  KoreanButton,
  KoreanPanel,
  KoreanText,
  MenuList,
  ArchetypeCard,
} from "./index";
import type { MenuItem } from "./MenuList";

/**
 * Props for KoreanUIDemo component
 */
export interface KoreanUIDemoProps {
  readonly width?: number;
  readonly height?: number;
}

/**
 * KoreanUIDemo Component
 * 
 * A showcase component demonstrating all Korean UI components.
 * Provides a visual reference for component usage and styling.
 * 
 * @example
 * ```tsx
 * <KoreanUIDemo width={1200} height={800} />
 * ```
 */
export const KoreanUIDemo: React.FC<KoreanUIDemoProps> = ({
  width = 1200,
  height = 800,
}) => {
  const [selectedMenu, setSelectedMenu] = useState<string>("buttons");
  const [selectedArchetype, setSelectedArchetype] = useState<PlayerArchetype>(
    PlayerArchetype.MUSA
  );
  const [health, setHealth] = useState(75);
  const [ki, setKi] = useState(60);
  const [stamina, setStamina] = useState(85);

  const menuItems: MenuItem[] = [
    { id: "buttons", korean: "버튼", english: "Buttons" },
    { id: "panels", korean: "패널", english: "Panels" },
    { id: "text", korean: "텍스트", english: "Text" },
    { id: "progress", korean: "진행바", english: "Progress Bars" },
    { id: "archetypes", korean: "원형", english: "Archetypes" },
  ];

  const handleMenuSelect = useCallback((id: string) => {
    console.log("Menu selected:", id);
    setSelectedMenu(id);
  }, []);

  const handleArchetypeSelect = useCallback((archetype: PlayerArchetype) => {
    console.log("Archetype selected:", archetype);
    setSelectedArchetype(archetype);
  }, []);

  const handleHealthChange = useCallback(() => {
    setHealth((prev) => Math.max(0, prev - 10));
  }, []);

  const handleRestore = useCallback(() => {
    setHealth(100);
    setKi(100);
    setStamina(100);
  }, []);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: "#1a1a1a",
      }}
      data-testid="korean-ui-demo"
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ width: "100%", height: "100%" }}
        onCreated={({ gl }) => {
          gl.setClearColor(KOREAN_COLORS.UI_BACKGROUND_DARK, 1);
        }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Title */}
        <KoreanText
          korean="흑괘 UI 라이브러리"
          english="Black Trigram UI Library"
          position={[0, 3.5, 0]}
          size="xlarge"
          color={KOREAN_COLORS.ACCENT_GOLD}
          weight="bold"
          testId="demo-title"
        />

        {/* Left Column - Menu Navigation */}
        <MenuList
          items={menuItems}
          onSelect={handleMenuSelect}
          selectedId={selectedMenu}
          position={[-4, 0, 0]}
          width={250}
          testId="demo-menu"
        />

        {/* Right Column - Component Showcase */}
        {selectedMenu === "buttons" && (
          <>
            <KoreanPanel
              position={[2, 1.5, 0]}
              width={500}
              padding={24}
              variant="bordered"
              testId="buttons-panel"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h3 style={{ color: "#ffd700", marginBottom: "8px" }}>
                  버튼 예제 | Button Examples
                </h3>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                    style={{
                      background: "rgba(0, 255, 255, 0.1)",
                      border: "2px solid #00ffff",
                      color: "#ffd700",
                      padding: "12px 24px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <div>공격 | Attack</div>
                  </button>
                  <button
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      border: "2px solid #ffd700",
                      color: "#fff",
                      padding: "12px 24px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <div>방어 | Defend</div>
                  </button>
                  <button
                    style={{
                      background: "rgba(255, 51, 51, 0.1)",
                      border: "2px solid #ff3333",
                      color: "#ff3333",
                      padding: "12px 24px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <div>위험 | Danger</div>
                  </button>
                </div>
              </div>
            </KoreanPanel>
          </>
        )}

        {selectedMenu === "panels" && (
          <>
            <KoreanPanel
              position={[2, 2, 0]}
              width={400}
              padding={20}
              variant="default"
              testId="demo-panel-default"
            >
              <div style={{ color: "#fff" }}>
                <h4 style={{ color: "#00ffff", marginBottom: "8px" }}>
                  기본 패널 | Default Panel
                </h4>
                <p>기본 스타일의 패널입니다.</p>
              </div>
            </KoreanPanel>

            <KoreanPanel
              position={[2, 0.5, 0]}
              width={400}
              padding={20}
              variant="bordered"
              testId="demo-panel-bordered"
            >
              <div style={{ color: "#fff" }}>
                <h4 style={{ color: "#00ffff", marginBottom: "8px" }}>
                  테두리 패널 | Bordered Panel
                </h4>
                <p>빛나는 테두리가 있는 패널입니다.</p>
              </div>
            </KoreanPanel>

            <KoreanPanel
              position={[2, -1, 0]}
              width={400}
              padding={20}
              variant="elevated"
              testId="demo-panel-elevated"
            >
              <div style={{ color: "#fff" }}>
                <h4 style={{ color: "#ffd700", marginBottom: "8px" }}>
                  입체 패널 | Elevated Panel
                </h4>
                <p>그림자 효과가 있는 입체 패널입니다.</p>
              </div>
            </KoreanPanel>
          </>
        )}

        {selectedMenu === "text" && (
          <>
            <KoreanPanel
              position={[2, 1, 0]}
              width={450}
              padding={24}
              variant="bordered"
              testId="text-panel"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <h4 style={{ color: "#00ffff", marginBottom: "12px" }}>
                    텍스트 크기 | Text Sizes
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ color: "#fff", fontSize: "14px" }}>작게 | Small</div>
                    <div style={{ color: "#fff", fontSize: "18px" }}>보통 | Medium</div>
                    <div style={{ color: "#fff", fontSize: "24px" }}>크게 | Large</div>
                    <div style={{ color: "#fff", fontSize: "32px" }}>매우 크게 | XLarge</div>
                  </div>
                </div>
                <div>
                  <h4 style={{ color: "#00ffff", marginBottom: "12px" }}>
                    레이아웃 | Layouts
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ color: "#fff" }}>수직 레이아웃 | Vertical Layout</div>
                    <div style={{ color: "#fff" }}>수평 | Horizontal</div>
                  </div>
                </div>
              </div>
            </KoreanPanel>
          </>
        )}

        {selectedMenu === "progress" && (
          <>
            <KoreanPanel
              position={[2, 1.5, 0]}
              width={450}
              padding={24}
              variant="bordered"
              testId="progress-panel"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3 style={{ color: "#ffd700", marginBottom: "8px" }}>
                  진행 바 예제 | Progress Bar Examples
                </h3>
                
                <div style={{ color: "#fff" }}>
                  <div style={{ marginBottom: "8px" }}>체력 | Health: {health}%</div>
                  <div
                    style={{
                      width: "100%",
                      height: "24px",
                      background: "rgba(26, 26, 46, 0.8)",
                      border: "2px solid rgba(74, 85, 104, 0.6)",
                      borderRadius: "4px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: `${health}%`,
                        height: "100%",
                        background: "linear-gradient(to right, #00ff00, #ffff00)",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>

                <div style={{ color: "#fff" }}>
                  <div style={{ marginBottom: "8px" }}>기력 | Ki: {ki}%</div>
                  <div
                    style={{
                      width: "100%",
                      height: "24px",
                      background: "rgba(26, 26, 46, 0.8)",
                      border: "2px solid rgba(74, 85, 104, 0.6)",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${ki}%`,
                        height: "100%",
                        background: "linear-gradient(to right, #00ffff, #0099cc)",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>

                <div style={{ color: "#fff" }}>
                  <div style={{ marginBottom: "8px" }}>체력 | Stamina: {stamina}%</div>
                  <div
                    style={{
                      width: "100%",
                      height: "24px",
                      background: "rgba(26, 26, 46, 0.8)",
                      border: "2px solid rgba(74, 85, 104, 0.6)",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${stamina}%`,
                        height: "100%",
                        background: "linear-gradient(to right, #ffff00, #ffcc00)",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button
                    onClick={handleHealthChange}
                    style={{
                      background: "rgba(255, 51, 51, 0.1)",
                      border: "2px solid #ff3333",
                      color: "#ff3333",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    피해 입기 | Take Damage
                  </button>
                  <button
                    onClick={handleRestore}
                    style={{
                      background: "rgba(0, 255, 51, 0.1)",
                      border: "2px solid #00ff33",
                      color: "#00ff33",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    회복 | Restore
                  </button>
                </div>
              </div>
            </KoreanPanel>
          </>
        )}

        {selectedMenu === "archetypes" && (
          <>
            <ArchetypeCard
              archetype={selectedArchetype}
              onSelect={handleArchetypeSelect}
              isSelected={true}
              position={[2, 1.5, 0]}
              width={400}
              showStats={true}
              testId="demo-archetype-card"
            />

            <KoreanPanel
              position={[2, -1.5, 0]}
              width={400}
              padding={16}
              variant="default"
              testId="archetype-selector"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ color: "#00ffff", marginBottom: "8px" }}>
                  원형 선택 | Select Archetype
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {[
                    PlayerArchetype.MUSA,
                    PlayerArchetype.AMSALJA,
                    PlayerArchetype.HACKER,
                    PlayerArchetype.JEONGBO_YOWON,
                    PlayerArchetype.JOJIK_POKRYEOKBAE,
                  ].map((archetype) => (
                    <button
                      key={archetype}
                      onClick={() => handleArchetypeSelect(archetype)}
                      style={{
                        background:
                          selectedArchetype === archetype
                            ? "rgba(0, 255, 255, 0.2)"
                            : "rgba(255, 215, 0, 0.1)",
                        border: `2px solid ${
                          selectedArchetype === archetype ? "#00ffff" : "#ffd700"
                        }`,
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      {archetype}
                    </button>
                  ))}
                </div>
              </div>
            </KoreanPanel>
          </>
        )}

        {/* Footer Controls */}
        <KoreanButton
          korean="데모 재설정"
          english="Reset Demo"
          onClick={handleRestore}
          variant="secondary"
          size="sm"
          position={[0, -3, 0]}
          testId="reset-button"
        />
      </Canvas>
    </div>
  );
};

KoreanUIDemo.displayName = "KoreanUIDemo";
