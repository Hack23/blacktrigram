import React, { useCallback, useEffect, useState, useMemo } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { usePixiExtensions } from "../../../utils/pixiExtensions";
import { KOREAN_COLORS } from "../../../types/constants";
import type { TrigramStance } from "../../../types/enums";
import type { TrainingStatistics } from "./types/training";
import type { AudioManager } from "../../../audio/AudioManager";

extend({ Container, Graphics, Text });

export interface TrainingAudioManagerProps {
  readonly audio: AudioManager;
  readonly isTraining: boolean;
  readonly currentCombo: number;
  readonly selectedStance: TrigramStance;
  readonly stats: TrainingStatistics;
  readonly accuracy: number;
  readonly onAudioEvent?: (event: string, data?: any) => void;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export const TrainingAudioManager: React.FC<TrainingAudioManagerProps> = ({
  audio,
  isTraining,
  currentCombo,
  selectedStance,
  stats,
  accuracy,
  onAudioEvent,
  x,
  y,
  width,
  height,
}) => {
  usePixiExtensions();

  const [previousCombo, setPreviousCombo] = useState(0);
  const [previousAccuracy, setPreviousAccuracy] = useState(0);
  const [audioVisualization, setAudioVisualization] = useState<number[]>([]);

  // Generate audio visualization bars
  const generateVisualization = useCallback(() => {
    const bars = Array.from({ length: 8 }, () => Math.random() * 0.8 + 0.2);
    setAudioVisualization(bars);
  }, []);

  // Handle combo changes
  useEffect(() => {
    if (currentCombo > previousCombo && currentCombo > 1) {
      // Combo increased
      onAudioEvent?.("combo_achieved", { combo: currentCombo });

      // Special milestone sounds
      if (currentCombo === 5) {
        onAudioEvent?.("combo_milestone", { milestone: 5 });
      } else if (currentCombo === 10) {
        onAudioEvent?.("combo_milestone", { milestone: 10 });
      } else if (currentCombo >= 20) {
        onAudioEvent?.("combo_legendary", { combo: currentCombo });
      }
    }
    setPreviousCombo(currentCombo);
  }, [currentCombo, previousCombo, onAudioEvent]);

  // Handle accuracy changes
  useEffect(() => {
    if (stats.attempts > 5) {
      // Only trigger after some attempts
      const accuracyDiff = stats.accuracy - previousAccuracy;

      if (accuracyDiff > 15) {
        onAudioEvent?.("accuracy_improving", { accuracy: stats.accuracy });
      } else if (accuracyDiff < -15) {
        onAudioEvent?.("accuracy_declining", { accuracy: stats.accuracy });
      }
    }
    setPreviousAccuracy(stats.accuracy);
  }, [stats.accuracy, stats.attempts, previousAccuracy, onAudioEvent]);

  // Stance-specific ambient sounds during training
  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      const ambientSound = getStanceAmbientSound(selectedStance);
      onAudioEvent?.("stance_ambient", {
        stance: selectedStance,
        sound: ambientSound,
      });
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [isTraining, selectedStance, onAudioEvent]);

  // Audio visualization update
  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(generateVisualization, 200);
    return () => clearInterval(interval);
  }, [isTraining, generateVisualization]);

  // Get stance-specific ambient sound
  const getStanceAmbientSound = useCallback((stance: TrigramStance): string => {
    const stanceSounds = {
      [TrigramStance.GEON]: "ambient_heaven",
      [TrigramStance.TAE]: "ambient_lake",
      [TrigramStance.LI]: "ambient_fire",
      [TrigramStance.JIN]: "ambient_thunder",
      [TrigramStance.SON]: "ambient_wind",
      [TrigramStance.GAM]: "ambient_water",
      [TrigramStance.GAN]: "ambient_mountain",
      [TrigramStance.GON]: "ambient_earth",
    };
    return stanceSounds[stance] || "ambient_heaven";
  }, []);

  // Calculate stance energy level for visualization
  const stanceEnergy = useMemo(() => {
    const baseEnergy = 0.3;
    const comboBonus = Math.min(currentCombo * 0.1, 0.5);
    const accuracyBonus = (stats.accuracy / 100) * 0.2;
    return Math.min(baseEnergy + comboBonus + accuracyBonus, 1.0);
  }, [currentCombo, stats.accuracy]);

  // Draw audio visualization
  const drawAudioVisualization = useCallback(
    (g: any) => {
      g.clear();

      if (!isTraining) {
        // Static visualization when not training
        g.fill({ color: KOREAN_COLORS.UI_DISABLED_BG, alpha: 0.5 });
        g.roundRect(0, 0, width - 20, height - 60, 4);
        g.fill();
        return;
      }

      // Dynamic audio bars
      const barWidth = (width - 40) / audioVisualization.length;
      const maxBarHeight = height - 80;

      audioVisualization.forEach((intensity, index) => {
        const barHeight = maxBarHeight * intensity * stanceEnergy;
        const barX = 10 + index * barWidth;
        const barY = height - 20 - barHeight;

        // Bar color based on stance and intensity
        const barColor =
          intensity > 0.7
            ? KOREAN_COLORS.ACCENT_GOLD
            : intensity > 0.4
            ? KOREAN_COLORS.PRIMARY_CYAN
            : KOREAN_COLORS.SECONDARY_BLUE;

        g.fill({ color: barColor, alpha: 0.8 });
        g.roundRect(barX + 2, barY, barWidth - 4, barHeight, 2);
        g.fill();

        // Glow effect for high intensity
        if (intensity > 0.8) {
          g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.6 });
          g.roundRect(barX + 1, barY - 1, barWidth - 2, barHeight + 2, 3);
          g.stroke();
        }
      });

      // Stance energy indicator
      g.fill({ color: KOREAN_COLORS.ACCENT_GREEN, alpha: stanceEnergy });
      g.circle(width - 15, 15, 8);
      g.fill();
    },
    [isTraining, audioVisualization, stanceEnergy, width, height]
  );

  // Handle Korean command button
  const handleKoreanCommand = useCallback(
    (command: string, korean: string) => {
      onAudioEvent?.("korean_command", { command, korean });
    },
    [onAudioEvent]
  );

  // Handle training session events
  const handleTrainingEvent = useCallback(
    (event: string) => {
      switch (event) {
        case "training_started":
          onAudioEvent?.("training_started");
          break;
        case "training_completed":
          const grade =
            stats.accuracy >= 90
              ? "master"
              : stats.accuracy >= 80
              ? "excellent"
              : stats.accuracy >= 70
              ? "good"
              : "basic";
          onAudioEvent?.("training_completed", {
            accuracy: stats.accuracy,
            grade,
          });
          break;
      }
    },
    [onAudioEvent, stats.accuracy]
  );

  // Play training ambient music when training starts
  useEffect(() => {
    if (isTraining) {
      audio.playMusic("training_theme");
    } else {
      audio.stopMusic();
    }
  }, [isTraining, audio]);

  // Play stance change sounds
  useEffect(() => {
    if (isTraining) {
      audio.playSFX("stance_change");
    }
  }, [selectedStance, isTraining, audio]);

  // Play combo sounds
  useEffect(() => {
    if (currentCombo > 1) {
      audio.playSFX("combo_hit");
    }
  }, [currentCombo, audio]);

  // Play accuracy feedback
  useEffect(() => {
    if (accuracy >= 90) {
      audio.playSFX("perfect_accuracy");
    } else if (accuracy >= 70) {
      audio.playSFX("good_accuracy");
    }
  }, [accuracy, audio]);

  const playTrainingSound = useCallback((soundId: string) => {
    audio.playSFX(soundId);
  }, [audio]);

  // This component doesn't render anything visible
  return null;
};

export default TrainingAudioManager;
              color: KOREAN_COLORS.PRIMARY_CYAN,
              alpha: 0.6,
            });
            g.roundRect(0, 0, 50, 25, 4);
            g.stroke();
          }}
          interactive={true}
          onPointerDown={() => handleKoreanCommand("good", "좋다")}
          data-testid="audio-praise-button"
        />

        <pixiText
          text="좋다"
          style={{
            fontSize: 14,
            fill: KOREAN_COLORS.BLACK_SOLID,
            fontWeight: "bold",
            align: "center",
          }}
          x={25}
          y={12}
          anchor={0.5}
          data-testid="audio-praise-text"
        />
      </pixiContainer>

      {/* Current Status */}
      <pixiText
        text={`자세: ${selectedStance} | 연속: ${currentCombo}회`}
        style={{
          fontSize: 10,
          fill: KOREAN_COLORS.TEXT_SECONDARY,
        }}
        x={width - 150}
        y={height - 15}
        data-testid="audio-status-text"
      />

      {/* Stance Energy Display */}
      <pixiContainer x={width - 30} y={30} data-testid="stance-energy-display">
        <pixiText
          text="기"
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
            align: "center",
          }}
          anchor={0.5}
          y={-5}
        />

        <pixiGraphics
          draw={(g) => {
            g.clear();

            // Energy circle background
            g.stroke({ width: 2, color: KOREAN_COLORS.UI_BORDER, alpha: 0.5 });
            g.circle(0, 10, 12);
            g.stroke();

            // Energy fill
            const energyAngle = stanceEnergy * Math.PI * 2;
            g.fill({ color: KOREAN_COLORS.ACCENT_GREEN, alpha: 0.8 });
            g.moveTo(0, 10);
            g.arc(0, 10, 10, -Math.PI / 2, -Math.PI / 2 + energyAngle);
            g.lineTo(0, 10);
            g.fill();
          }}
        />
      </pixiContainer>
    </pixiContainer>
  );
};

export default TrainingAudioManager;
