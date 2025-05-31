import React from "react";
import { KoreanText } from "../../ui/base/KoreanText";
import { KOREAN_COLORS } from "../../../types";

export function ControlsSection(): React.ReactElement {
  const controls = [
    {
      key: "1-8",
      korean: "팔괘 변경",
      english: "Change Trigram Stance",
      description:
        "각 숫자 키로 팔괘 자세 변경 (1: 건, 2: 태, 3: 리, 4: 진, 5: 손, 6: 감, 7: 간, 8: 곤)",
    },
    {
      key: "WASD",
      korean: "이동",
      english: "Movement",
      description: "W(앞), A(왼쪽), S(뒤), D(오른쪽)으로 이동",
    },
    {
      key: "SPACE",
      korean: "공격",
      english: "Attack",
      description: "현재 팔괘 자세의 기술로 공격",
    },
    {
      key: "SHIFT",
      korean: "방어",
      english: "Block/Guard",
      description: "방어 자세로 전환하여 피해 감소",
    },
    {
      key: "ESC",
      korean: "메뉴",
      english: "Menu",
      description: "게임 메뉴로 돌아가기",
    },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <KoreanText
        text="조작법"
        englishText="Controls"
        size="xlarge"
        color={`#${KOREAN_COLORS.GOLD.toString(16).padStart(6, "0")}`}
        showBoth={true}
        style={{ marginBottom: "2rem" }}
      />

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {controls.map((control, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1.5rem",
              padding: "1rem",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              border: `1px solid #${KOREAN_COLORS.ACCENT_BLUE.toString(
                16
              ).padStart(6, "0")}`,
            }}
          >
            <div
              style={{
                minWidth: "80px",
                padding: "0.5rem",
                background: `#${KOREAN_COLORS.ACCENT_BLUE.toString(16).padStart(
                  6,
                  "0"
                )}`,
                color: `#${KOREAN_COLORS.WHITE.toString(16).padStart(6, "0")}`,
                borderRadius: "4px",
                fontWeight: "bold",
                textAlign: "center",
                marginRight: "1rem",
              }}
            >
              {control.key}
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <KoreanText
                text={control.korean}
                englishText={control.english}
                size="medium"
                showBoth={true}
                style={{ marginBottom: "0.5rem" }}
              />
              <div
                style={{
                  fontSize: "0.9rem",
                  color: `#${KOREAN_COLORS.GRAY_LIGHT.toString(16).padStart(
                    6,
                    "0"
                  )}`,
                  lineHeight: "1.4",
                }}
              >
                {control.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "rgba(255,215,0,0.1)",
          borderRadius: "8px",
          border: `1px solid #${KOREAN_COLORS.GOLD.toString(16).padStart(
            6,
            "0"
          )}`,
        }}
      >
        <KoreanText
          text="팁: 각 팔괘는 고유한 철학과 전투 스타일을 가지고 있습니다. 상황에 맞는 팔괘를 선택하여 최적의 전략을 구사하세요!"
          size="small"
          color={`#${KOREAN_COLORS.GOLD.toString(16).padStart(6, "0")}`}
          style={{ fontStyle: "italic" }}
        />
      </div>
    </div>
  );
}
