import React from "react";
import { KOREAN_COLORS } from "../../../types/constants";

export interface PhilosophySectionProps {
  readonly onBack: () => void;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
}

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  onBack,
  x = 0,
  y = 0,
  width = 800,
  height = 600,
}) => {
  const philosophyText = `
흑괘 (Black Trigram) - 한국 무술의 철학

팔괘는 고대 중국의 역경(I Ching)에서 유래한 
여덟 가지 기본 기호로, 우주의 모든 현상을 
나타냅니다. 한국 무술에서는 이를 전투 자세와 
연결하여 몸과 마음의 조화를 추구합니다.

• 건 (☰) - 하늘: 직접적인 힘
• 태 (☱) - 호수: 유연한 적응
• 리 (☲) - 불: 정밀한 공격
• 진 (☳) - 천둥: 폭발적인 힘
• 손 (☴) - 바람: 지속적인 압박
• 감 (☵) - 물: 흐름과 반격
• 간 (☶) - 산: 견고한 방어
• 곤 (☷) - 땅: 포용과 제압

무술은 단순한 격투가 아닌, 자신을 수양하고
상대를 존중하는 도(道)입니다.
  `;

  return (
    <pixiContainer
      x={x}
      y={y}
      layout={{
        width,
        height,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 32,
        gap: 24,
      }}
      data-testid="philosophy-section"
    >
      {/* Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.95 });
          g.roundRect(0, 0, width, height, 10);
          g.fill();

          g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.6 });
          g.roundRect(0, 0, width, height, 10);
          g.stroke();
        }}
      />

      {/* Title */}
      <pixiText
        text="무술 철학 (Martial Philosophy)"
        style={{
          fontSize: 32,
          fill: KOREAN_COLORS.ACCENT_GOLD,
          fontFamily: "Arial, sans-serif",
          align: "center",
        }}
        x={width / 2}
        y={40}
        anchor={0.5}
      />

      {/* Philosophy Text */}
      <pixiText
        text={philosophyText}
        style={{
          fontSize: 16,
          fill: KOREAN_COLORS.TEXT_PRIMARY,
          fontFamily: "Arial, sans-serif",
          align: "left",
          wordWrap: true,
          wordWrapWidth: width - 80,
          lineHeight: 24,
        }}
        x={40}
        y={100}
      />

      {/* Back Button */}
      <pixiContainer
        x={width - 150}
        y={height - 80}
        layout={{
          alignSelf: "flex-end",
        }}
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.ACCENT_RED, alpha: 0.8 });
            g.roundRect(0, 0, 120, 40, 5);
            g.fill();
          }}
          interactive={true}
          onPointerDown={onBack}
        />
        <pixiText
          text="돌아가기"
          style={{
            fontSize: 16,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: "center",
          }}
          x={60}
          y={20}
          anchor={0.5}
        />
      </pixiContainer>
    </pixiContainer>
  );
};

export default PhilosophySection;
