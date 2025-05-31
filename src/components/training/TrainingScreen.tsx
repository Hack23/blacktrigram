import React, { useState, useCallback } from "react";
import { KoreanHeader } from "../ui/KoreanHeader";
import { TrigramWheel } from "../ui/TrigramWheel";
import { ProgressTracker } from "../ui/ProgressTracker";
import { KoreanText } from "../ui/base/KoreanText";
import { BaseButton } from "../ui/base/BaseButton";
import { BackgroundGrid } from "../ui/base/BackgroundGrid";
import {
  KOREAN_COLORS,
  KOREAN_FONT_FAMILY,
  TRIGRAM_DATA,
  TRIGRAM_STANCES_ORDER,
  type TrainingScreenProps,
  type TrigramStance,
  type TrainingProgress,
} from "../../types";

export function TrainingScreen({
  onGamePhaseChange,
  onStanceChange,
  selectedStance = "geon",
  playerProgress,
}: TrainingScreenProps): React.ReactElement {
  const [currentStance, setCurrentStance] =
    useState<TrigramStance>(selectedStance);
  const [progress, setProgress] = useState<
    Record<TrigramStance, TrainingProgress>
  >(() => {
    const initialProgress: Record<TrigramStance, TrainingProgress> = {
      geon: { practiceCount: 0, mastery: 0 },
      tae: { practiceCount: 0, mastery: 0 },
      li: { practiceCount: 0, mastery: 0 },
      jin: { practiceCount: 0, mastery: 0 },
      son: { practiceCount: 0, mastery: 0 },
      gam: { practiceCount: 0, mastery: 0 },
      gan: { practiceCount: 0, mastery: 0 },
      gon: { practiceCount: 0, mastery: 0 },
    };

    // Merge with player progress if provided
    if (playerProgress) {
      TRIGRAM_STANCES_ORDER.forEach((stance) => {
        if (playerProgress[stance]) {
          initialProgress[stance] = playerProgress[stance];
        }
      });
    }

    return initialProgress;
  });

  const handleStanceChange = useCallback(
    (stance: TrigramStance) => {
      setCurrentStance(stance);
      onStanceChange(stance);
    },
    [onStanceChange]
  );

  const handlePractice = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      [currentStance]: {
        practiceCount: prev[currentStance].practiceCount + 1,
        mastery: Math.min(100, prev[currentStance].mastery + 2),
      },
    }));
  }, [currentStance]);

  const currentTrigramData = TRIGRAM_DATA[currentStance];

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: `linear-gradient(135deg, #${KOREAN_COLORS.DARK_BLUE.toString(
          16
        ).padStart(6, "0")}, #${KOREAN_COLORS.BLACK.toString(16).padStart(
          6,
          "0"
        )})`,
        fontFamily: KOREAN_FONT_FAMILY,
        color: `#${KOREAN_COLORS.WHITE.toString(16).padStart(6, "0")}`,
        display: "flex",
        flexDirection: "column",
        padding: "2rem",
      }}
    >
      {/* Header */}
      <KoreanHeader
        title="수련장"
        subtitle="Training Ground"
        onBack={() => onGamePhaseChange("intro")}
        currentPhase="training"
        onPhaseChange={onGamePhaseChange}
      />

      <div style={{ display: "flex", flex: 1, gap: "2rem", marginTop: "2rem" }}>
        {/* Left Panel - Stance Selection */}
        <div style={{ flex: "0 0 400px" }}>
          <KoreanText
            text="팔괘 선택 (Select Trigram)"
            size="large"
            color={`#${KOREAN_COLORS.GOLD.toString(16).padStart(6, "0")}`}
            style={{ marginBottom: "1rem" }}
          />

          <TrigramWheel
            selectedStance={currentStance}
            onStanceChange={handleStanceChange}
            playerKi={100}
            playerMaxKi={100}
            radius={120}
          />

          {/* Progress Trackers */}
          <div style={{ marginTop: "2rem" }}>
            <ProgressTracker
              label="연습 횟수 (Practice Count)"
              current={progress[currentStance].practiceCount}
              maximum={50}
            />
            <ProgressTracker
              label="숙련도 (Mastery)"
              current={progress[currentStance].mastery}
              maximum={100}
              currentStance={currentStance}
            />
          </div>
        </div>

        {/* Center Panel - Technique Display */}
        <div style={{ flex: 1, textAlign: "center" }}>
          {/* Trigram Symbol Display */}
          <div
            style={{
              fontSize: "4rem",
              color: `#${currentTrigramData.color
                .toString(16)
                .padStart(6, "0")}`,
              marginBottom: "1rem",
            }}
          >
            {currentTrigramData.symbol}
          </div>

          <div style={{ marginTop: "2rem" }}>
            <KoreanText
              text={currentTrigramData.korean}
              englishText={currentTrigramData.english}
              size="xlarge"
              showBoth={true}
              color={`#${currentTrigramData.color
                .toString(16)
                .padStart(6, "0")}`}
              style={{ marginBottom: "1rem" }}
            />

            <KoreanText
              text={currentTrigramData.technique.koreanName}
              englishText={currentTrigramData.technique.englishName}
              size="large"
              showBoth={true}
              style={{ marginBottom: "2rem" }}
            />

            <div style={{ maxWidth: "500px", margin: "0 auto" }}>
              <KoreanText
                text={currentTrigramData.technique.description.korean}
                size="medium"
                style={{ marginBottom: "1rem", lineHeight: "1.6" }}
              />
              <KoreanText
                text={currentTrigramData.technique.description.english}
                size="medium"
                style={{ fontStyle: "italic", opacity: 0.8, lineHeight: "1.6" }}
              />
            </div>
          </div>

          {/* Practice Button */}
          <div style={{ marginTop: "3rem" }}>
            <BaseButton
              onClick={handlePractice}
              variant="primary"
              size="large"
              style={{ padding: "1rem 2rem", fontSize: "1.2rem" }}
            >
              <KoreanText
                text="연습하기"
                englishText="Practice"
                showBoth={true}
              />
            </BaseButton>
          </div>
        </div>

        {/* Right Panel - All Stances Overview */}
        <div style={{ flex: "0 0 300px" }}>
          <KoreanText
            text="전체 진도 (Overall Progress)"
            size="large"
            color={`#${KOREAN_COLORS.GOLD.toString(16).padStart(6, "0")}`}
            style={{ marginBottom: "1rem" }}
          />

          <div style={{ maxHeight: "600px", overflowY: "auto" }}>
            {TRIGRAM_STANCES_ORDER.map((stance) => {
              const data = TRIGRAM_DATA[stance];
              const stanceProgress = progress[stance];
              const isSelected = stance === currentStance;

              return (
                <div
                  key={stance}
                  onClick={() => handleStanceChange(stance)}
                  style={{
                    padding: "1rem",
                    marginBottom: "0.5rem",
                    background: isSelected
                      ? `#${data.color.toString(16).padStart(6, "0")}33`
                      : "rgba(255,255,255,0.05)",
                    border: isSelected
                      ? `2px solid #${data.color.toString(16).padStart(6, "0")}`
                      : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>
                      {data.symbol}
                    </span>
                    <KoreanText
                      text={data.korean}
                      size="medium"
                      color={`#${data.color.toString(16).padStart(6, "0")}`}
                    />
                  </div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                    연습: {stanceProgress.practiceCount}/50 | 숙련도:{" "}
                    {stanceProgress.mastery}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Background Grid */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      >
        <BackgroundGrid
          width={window.innerWidth}
          height={window.innerHeight}
          gridSize={60}
          color={KOREAN_COLORS.ACCENT_BLUE}
          alpha={0.1}
          animated={true}
        />
      </div>
    </div>
  );
}
