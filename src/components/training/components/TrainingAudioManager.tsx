import React, { useCallback, useState, useMemo, useEffect } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { KOREAN_COLORS } from "../../../types/constants";
import {
  ResponsivePixiContainer,
  ResponsivePixiPanel,
  ResponsivePixiButton,
} from "../../ui/base/ResponsivePixiComponents";
import type { AudioManagerInterface } from "../../../types/audio";
import { TrigramStance, PlayerArchetype } from "../../../types/enums";
import type { KoreanText } from "../../../types/korean-text";
import { useAudio } from "../../../audio/AudioProvider";

extend({ Container, Graphics, Text });

/**
 * ## Training Audio Manager Component - Enhanced Korean Martial Arts Audio System
 *
 * **Business Purpose:**
 * Provides comprehensive audio management specifically designed for Korean martial arts training,
 * including authentic Korean voice commands, technique feedback, and immersive dojang atmosphere.
 *
 * **Korean Martial Arts Integration:**
 * - Authentic Korean pronunciation guides for technique names
 * - Traditional dojang atmosphere sounds (wooden floors, equipment)
 * - Respectful Korean instructional voice commands
 * - Cultural accuracy in audio terminology and pronunciation
 *
 * **Educational Value:**
 * - Helps students learn proper Korean martial arts terminology pronunciation
 * - Provides immediate audio feedback for technique execution
 * - Creates immersive training environment matching traditional Korean dojangs
 * - Supports different learning styles through audio-visual integration
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */

export interface TrainingAudioManagerProps {
  readonly audio: AudioManagerInterface | null;
  readonly selectedStance: TrigramStance;
  readonly currentCombo: number;
  readonly playerArchetype: PlayerArchetype;
  readonly trainingMode: string;
  readonly isTraining: boolean;
  readonly accuracy: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly screenWidth: number;
  readonly screenHeight: number;
  readonly onVoiceCommandExecute?: (command: string, korean: string) => void;
  readonly showAdvancedControls?: boolean;
}

interface KoreanVoiceCommand {
  readonly id: string;
  readonly korean: string;
  readonly english: string;
  readonly romanized: string;
  readonly category:
    | "encouragement"
    | "correction"
    | "instruction"
    | "technique";
  readonly context: "general" | "stance" | "combo" | "accuracy";
  readonly archetype?: PlayerArchetype;
  readonly audioFile?: string;
}

interface AudioSettings {
  readonly masterVolume: number;
  readonly musicVolume: number;
  readonly sfxVolume: number;
  readonly voiceVolume: number;
  readonly ambientVolume: number;
  readonly koreanVoiceEnabled: boolean;
  readonly englishVoiceEnabled: boolean;
  readonly pronunciationGuideEnabled: boolean;
  readonly dojangAmbienceEnabled: boolean;
}

/**
 * ## Korean Martial Arts Voice Commands Database
 *
 * **Business Logic:** Comprehensive collection of authentic Korean martial arts
 * voice commands organized by context and training situation.
 *
 * **Cultural Accuracy:** All commands use proper Korean honorifics and martial arts terminology
 * with accurate romanization for pronunciation learning.
 */
const KOREAN_VOICE_COMMANDS: KoreanVoiceCommand[] = [
  // Encouragement Commands
  {
    id: "excellent",
    korean: "훌륭합니다!",
    english: "Excellent!",
    romanized: "hul-lyung-ham-ni-da",
    category: "encouragement",
    context: "general",
    audioFile: "korean_excellent.mp3",
  },
  {
    id: "good",
    korean: "좋습니다!",
    english: "Good!",
    romanized: "jo-seum-ni-da",
    category: "encouragement",
    context: "general",
    audioFile: "korean_good.mp3",
  },
  {
    id: "perfect_technique",
    korean: "완벽한 기법입니다!",
    english: "Perfect technique!",
    romanized: "wan-byeok-han gi-beop-im-ni-da",
    category: "encouragement",
    context: "technique",
    audioFile: "korean_perfect_technique.mp3",
  },
  {
    id: "warrior_spirit",
    korean: "무사의 정신입니다!",
    english: "That's the warrior spirit!",
    romanized: "mu-sa-ui jeong-sin-im-ni-da",
    category: "encouragement",
    context: "general",
    archetype: PlayerArchetype.MUSA,
    audioFile: "korean_warrior_spirit.mp3",
  },

  // Correction Commands
  {
    id: "focus",
    korean: "집중하세요.",
    english: "Focus.",
    romanized: "jip-jung-ha-se-yo",
    category: "correction",
    context: "accuracy",
    audioFile: "korean_focus.mp3",
  },
  {
    id: "balance",
    korean: "균형을 잡으세요.",
    english: "Keep your balance.",
    romanized: "gyun-hyeong-eul jab-eu-se-yo",
    category: "correction",
    context: "stance",
    audioFile: "korean_balance.mp3",
  },
  {
    id: "slow_down",
    korean: "천천히 하세요.",
    english: "Slow down.",
    romanized: "cheon-cheon-hi ha-se-yo",
    category: "correction",
    context: "combo",
    audioFile: "korean_slow_down.mp3",
  },

  // Instruction Commands
  {
    id: "begin_stance",
    korean: "자세를 취하세요.",
    english: "Take your stance.",
    romanized: "ja-se-reul chwi-ha-se-yo",
    category: "instruction",
    context: "stance",
    audioFile: "korean_begin_stance.mp3",
  },
  {
    id: "continue",
    korean: "계속하세요.",
    english: "Continue.",
    romanized: "gye-sok-ha-se-yo",
    category: "instruction",
    context: "general",
    audioFile: "korean_continue.mp3",
  },
  {
    id: "ready_position",
    korean: "준비 자세!",
    english: "Ready position!",
    romanized: "jun-bi ja-se",
    category: "instruction",
    context: "stance",
    audioFile: "korean_ready_position.mp3",
  },

  // Technique-Specific Commands
  {
    id: "heaven_stance",
    korean: "건괘 자세!",
    english: "Heaven stance!",
    romanized: "geon-goe ja-se",
    category: "technique",
    context: "stance",
    audioFile: "korean_heaven_stance.mp3",
  },
  {
    id: "thunder_strike",
    korean: "천둥벽력!",
    english: "Thunder strike!",
    romanized: "cheon-dung-byeok-ryeok",
    category: "technique",
    context: "technique",
    audioFile: "korean_thunder_strike.mp3",
  },
];

export const TrainingAudioManager: React.FC<TrainingAudioManagerProps> = ({
  audio,
  selectedStance,
  currentCombo,
  playerArchetype,
  trainingMode,
  isTraining,
  accuracy,
  x,
  y,
  width,
  height,
  screenWidth,
  screenHeight,
  onVoiceCommandExecute,
  showAdvancedControls = false,
}) => {
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    masterVolume: 0.8,
    musicVolume: 0.6,
    sfxVolume: 0.8,
    voiceVolume: 0.9,
    ambientVolume: 0.4,
    koreanVoiceEnabled: true,
    englishVoiceEnabled: true,
    pronunciationGuideEnabled: true,
    dojangAmbienceEnabled: true,
  });

  const [currentVoiceCommand, setCurrentVoiceCommand] =
    useState<KoreanVoiceCommand | null>(null);
  const [showPronunciationGuide, setShowPronunciationGuide] = useState(false);
  const [audioVisualizerData, setAudioVisualizerData] = useState<number[]>([]);
  const [lastFeedbackTime, setLastFeedbackTime] = useState(0);

  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;

  // Filter commands based on current context
  const contextualCommands = useMemo(() => {
    return KOREAN_VOICE_COMMANDS.filter((command) => {
      // Filter by archetype if specified
      if (command.archetype && command.archetype !== playerArchetype) {
        return false;
      }

      // Filter by current context
      if (accuracy < 0.5 && command.context === "accuracy") return true;
      if (currentCombo > 1 && command.context === "combo") return true;
      if (command.context === "general") return true;
      if (command.context === "stance") return true;

      return false;
    });
  }, [playerArchetype, accuracy, currentCombo]);

  // Auto-feedback system based on training performance
  useEffect(() => {
    if (!isTraining || !audio || Date.now() - lastFeedbackTime < 3000) return;

    const shouldProvideFeedback = Math.random() < 0.3; // 30% chance every 3 seconds
    if (!shouldProvideFeedback) return;

    let feedbackCommand: KoreanVoiceCommand | null = null;

    if (accuracy >= 0.9) {
      feedbackCommand =
        KOREAN_VOICE_COMMANDS.find((cmd) => cmd.id === "excellent") || null;
    } else if (accuracy >= 0.7) {
      feedbackCommand =
        KOREAN_VOICE_COMMANDS.find((cmd) => cmd.id === "good") || null;
    } else if (accuracy < 0.5) {
      feedbackCommand =
        KOREAN_VOICE_COMMANDS.find((cmd) => cmd.id === "focus") || null;
    }

    if (feedbackCommand && audioSettings.koreanVoiceEnabled) {
      executeVoiceCommand(feedbackCommand);
      setLastFeedbackTime(Date.now());
    }
  }, [
    accuracy,
    isTraining,
    audio,
    audioSettings.koreanVoiceEnabled,
    lastFeedbackTime,
  ]);

  // Audio visualizer simulation
  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      const newData = Array.from(
        { length: 16 },
        () => Math.random() * 0.8 + 0.2
      );
      setAudioVisualizerData(newData);
    }, 100);

    return () => clearInterval(interval);
  }, [isTraining]);

  const executeVoiceCommand = useCallback(
    (command: KoreanVoiceCommand) => {
      if (!audio) return;

      setCurrentVoiceCommand(command);

      // Play Korean voice if enabled
      if (audioSettings.koreanVoiceEnabled && command.audioFile) {
        audio.playSFX(command.audioFile);
      }

      // Show pronunciation guide
      if (audioSettings.pronunciationGuideEnabled) {
        setShowPronunciationGuide(true);
        setTimeout(() => setShowPronunciationGuide(false), 3000);
      }

      // Callback for external handling
      if (onVoiceCommandExecute) {
        onVoiceCommandExecute(command.english, command.korean);
      }

      // Clear command after display time
      setTimeout(() => setCurrentVoiceCommand(null), 4000);
    },
    [audio, audioSettings, onVoiceCommandExecute]
  );

  const handleVolumeChange = useCallback(
    (type: keyof AudioSettings, value: number) => {
      setAudioSettings((prev) => ({ ...prev, [type]: value }));

      if (audio) {
        switch (type) {
          case "masterVolume":
            audio.setMasterVolume(value);
            break;
          case "musicVolume":
            audio.setMusicVolume(value);
            break;
          case "sfxVolume":
            audio.setSFXVolume(value);
            break;
        }
      }
    },
    [audio]
  );

  const handleToggleSetting = useCallback((setting: keyof AudioSettings) => {
    setAudioSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof AudioSettings],
    }));
  }, []);

  const handleKoreanCommand = useCallback(
    (commandId: string) => {
      const command = KOREAN_VOICE_COMMANDS.find((cmd) => cmd.id === commandId);
      if (command) {
        executeVoiceCommand(command);
      }
    },
    [executeVoiceCommand]
  );

  const statusText = useMemo(() => {
    const stanceKorean = {
      [TrigramStance.GEON]: "건",
      [TrigramStance.TAE]: "태",
      [TrigramStance.LI]: "리",
      [TrigramStance.JIN]: "진",
      [TrigramStance.SON]: "손",
      [TrigramStance.GAM]: "감",
      [TrigramStance.GAN]: "간",
      [TrigramStance.GON]: "곤",
    }[selectedStance];

    return `자세: ${stanceKorean} | 연속: ${currentCombo}회 | 정확도: ${Math.round(
      accuracy * 100
    )}%`;
  }, [selectedStance, currentCombo, accuracy]);

  return (
    <ResponsivePixiContainer
      x={x}
      y={y}
      screenWidth={screenWidth}
      screenHeight={screenHeight}
      data-testid="training-audio-manager"
    >
      {/* Enhanced Audio Control Panel */}
      <ResponsivePixiPanel
        title="훈련 음향 관리 - Training Audio"
        x={0}
        y={0}
        width={width}
        height={height}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
      >
        {/* Master Volume Control */}
        <pixiContainer x={10} y={30} data-testid="master-volume-control">
          <pixiText
            text="주 음량 - Master Volume"
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
            }}
            x={0}
            y={0}
            data-testid="master-volume-label"
          />

          <pixiGraphics
            draw={(g) => {
              g.clear();
              const barWidth = isMobile ? 120 : 150;
              const barHeight = 12;

              // Background
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
              g.roundRect(0, 0, barWidth, barHeight, 4);
              g.fill();

              // Volume fill
              g.fill({ color: KOREAN_COLORS.ACCENT_CYAN, alpha: 0.9 });
              g.roundRect(
                0,
                0,
                barWidth * audioSettings.masterVolume,
                barHeight,
                4
              );
              g.fill();

              // Border
              g.stroke({
                width: 1,
                color: KOREAN_COLORS.UI_BORDER,
                alpha: 0.6,
              });
              g.roundRect(0, 0, barWidth, barHeight, 4);
              g.stroke();
            }}
            x={0}
            y={15}
            interactive={true}
            onPointerDown={(event) => {
              const rect = event.currentTarget.getBounds();
              const localX = event.global.x - rect.x;
              const newVolume = Math.max(
                0,
                Math.min(1, localX / (isMobile ? 120 : 150))
              );
              handleVolumeChange("masterVolume", newVolume);
            }}
            data-testid="master-volume-bar"
          />

          <pixiText
            text={`${Math.round(audioSettings.masterVolume * 100)}%`}
            style={{
              fontSize: isMobile ? 9 : 10,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
            x={isMobile ? 130 : 160}
            y={20}
            data-testid="master-volume-percentage"
          />
        </pixiContainer>

        {/* Audio Category Controls */}
        <pixiContainer x={10} y={70} data-testid="audio-categories">
          {[
            {
              key: "musicVolume" as const,
              label: "음악 - Music",
              value: audioSettings.musicVolume,
            },
            {
              key: "sfxVolume" as const,
              label: "효과음 - SFX",
              value: audioSettings.sfxVolume,
            },
            {
              key: "voiceVolume" as const,
              label: "음성 - Voice",
              value: audioSettings.voiceVolume,
            },
          ].map((category, index) => (
            <pixiContainer
              key={category.key}
              y={index * 25}
              data-testid={`${category.key}-control`}
            >
              <pixiText
                text={category.label}
                style={{
                  fontSize: isMobile ? 9 : 10,
                  fill: KOREAN_COLORS.TEXT_PRIMARY,
                }}
                x={0}
                y={0}
              />

              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  const barWidth = isMobile ? 80 : 100;
                  const barHeight = 8;

                  // Background
                  g.fill({
                    color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                    alpha: 0.6,
                  });
                  g.roundRect(0, 0, barWidth, barHeight, 3);
                  g.fill();

                  // Value fill
                  g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
                  g.roundRect(0, 0, barWidth * category.value, barHeight, 3);
                  g.fill();
                }}
                x={isMobile ? 90 : 120}
                y={2}
                interactive={true}
                onPointerDown={(event) => {
                  const rect = event.currentTarget.getBounds();
                  const localX = event.global.x - rect.x;
                  const newVolume = Math.max(
                    0,
                    Math.min(1, localX / (isMobile ? 80 : 100))
                  );
                  handleVolumeChange(category.key, newVolume);
                }}
                data-testid={`${category.key}-bar`}
              />
            </pixiContainer>
          ))}
        </pixiContainer>

        {/* Korean Voice Commands */}
        <pixiContainer
          x={10}
          y={isMobile ? 150 : 170}
          data-testid="korean-voice-commands"
        >
          <pixiText
            text="한국어 음성 명령 - Korean Voice Commands"
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
            }}
            x={0}
            y={0}
            data-testid="voice-commands-title"
          />

          <pixiContainer y={20} data-testid="voice-command-buttons">
            {contextualCommands
              .slice(0, isMobile ? 3 : 4)
              .map((command, index) => (
                <pixiContainer
                  key={command.id}
                  x={index * (isMobile ? 60 : 80)}
                  data-testid={`voice-command-${command.id}`}
                >
                  <pixiGraphics
                    draw={(g) => {
                      g.clear();
                      g.fill({
                        color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                        alpha: 0.8,
                      });
                      g.roundRect(
                        0,
                        0,
                        isMobile ? 55 : 75,
                        isMobile ? 30 : 35,
                        4
                      );
                      g.fill();

                      g.stroke({
                        width: 1,
                        color: KOREAN_COLORS.ACCENT_CYAN,
                        alpha: 0.6,
                      });
                      g.roundRect(
                        0,
                        0,
                        isMobile ? 55 : 75,
                        isMobile ? 30 : 35,
                        4
                      );
                      g.stroke();
                    }}
                    interactive={true}
                    onPointerDown={() => handleKoreanCommand(command.id)}
                    data-testid={`voice-command-button-${command.id}`}
                  />
                  <pixiText
                    text={command.korean}
                    style={{
                      fontSize: isMobile ? 8 : 9,
                      fill: KOREAN_COLORS.TEXT_PRIMARY,
                      align: "center",
                      wordWrap: true,
                      wordWrapWidth: isMobile ? 50 : 70,
                    }}
                    x={(isMobile ? 55 : 75) / 2}
                    y={(isMobile ? 30 : 35) / 2}
                    anchor={0.5}
                    data-testid={`voice-command-text-${command.id}`}
                  />
                </pixiContainer>
              ))}
          </pixiContainer>
        </pixiContainer>

        {/* Current Voice Command Display */}
        {currentVoiceCommand && (
          <pixiContainer
            x={10}
            y={height - 120}
            data-testid="current-voice-command"
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.9 });
                g.roundRect(0, 0, width - 20, 60, 8);
                g.fill();

                g.stroke({
                  width: 2,
                  color: KOREAN_COLORS.PRIMARY_CYAN,
                  alpha: 0.8,
                });
                g.roundRect(0, 0, width - 20, 60, 8);
                g.stroke();
              }}
              data-testid="voice-command-display-background"
            />

            <pixiText
              text={currentVoiceCommand.korean}
              style={{
                fontSize: isMobile ? 14 : 18,
                fill: KOREAN_COLORS.BLACK_SOLID,
                fontWeight: "bold",
                align: "center",
              }}
              x={(width - 20) / 2}
              y={15}
              anchor={0.5}
              data-testid="current-voice-command-korean"
            />

            <pixiText
              text={currentVoiceCommand.english}
              style={{
                fontSize: isMobile ? 10 : 12,
                fill: KOREAN_COLORS.BLACK_SOLID,
                align: "center",
              }}
              x={(width - 20) / 2}
              y={35}
              anchor={0.5}
              data-testid="current-voice-command-english"
            />

            {showPronunciationGuide && (
              <pixiText
                text={currentVoiceCommand.romanized}
                style={{
                  fontSize: isMobile ? 9 : 10,
                  fill: KOREAN_COLORS.BLACK_SOLID,
                  align: "center",
                  fontStyle: "italic",
                }}
                x={(width - 20) / 2}
                y={50}
                anchor={0.5}
                data-testid="pronunciation-guide"
              />
            )}
          </pixiContainer>
        )}

        {/* Audio Settings Toggles */}
        {showAdvancedControls && (
          <pixiContainer
            x={width - 150}
            y={30}
            data-testid="audio-settings-toggles"
          >
            {[
              { key: "koreanVoiceEnabled" as const, label: "한국어" },
              { key: "englishVoiceEnabled" as const, label: "English" },
              { key: "pronunciationGuideEnabled" as const, label: "발음" },
              { key: "dojangAmbienceEnabled" as const, label: "도장" },
            ].map((setting, index) => (
              <pixiContainer
                key={setting.key}
                y={index * 25}
                data-testid={`toggle-${setting.key}`}
              >
                <pixiGraphics
                  draw={(g) => {
                    g.clear();
                    const isEnabled = audioSettings[setting.key] as boolean;
                    g.fill({
                      color: isEnabled
                        ? KOREAN_COLORS.ACCENT_GREEN
                        : KOREAN_COLORS.UI_DISABLED_BG,
                      alpha: 0.8,
                    });
                    g.roundRect(0, 0, 15, 15, 3);
                    g.fill();

                    if (isEnabled) {
                      g.stroke({ width: 2, color: KOREAN_COLORS.WHITE_SOLID });
                      g.moveTo(3, 7);
                      g.lineTo(6, 10);
                      g.lineTo(12, 4);
                      g.stroke();
                    }
                  }}
                  interactive={true}
                  onPointerDown={() => handleToggleSetting(setting.key)}
                  data-testid={`toggle-${setting.key}-checkbox`}
                />
                <pixiText
                  text={setting.label}
                  style={{
                    fontSize: isMobile ? 8 : 9,
                    fill: KOREAN_COLORS.TEXT_PRIMARY,
                  }}
                  x={20}
                  y={7}
                  anchor={{ x: 0, y: 0.5 }}
                  data-testid={`toggle-${setting.key}-label`}
                />
              </pixiContainer>
            ))}
          </pixiContainer>
        )}

        {/* Audio Visualizer */}
        {isTraining && (
          <pixiContainer
            x={width - 100}
            y={height - 80}
            data-testid="audio-visualizer"
          >
            <pixiText
              text="오디오"
              style={{
                fontSize: isMobile ? 8 : 9,
                fill: KOREAN_COLORS.TEXT_SECONDARY,
                align: "center",
              }}
              x={50}
              y={0}
              anchor={0.5}
              data-testid="visualizer-label"
            />

            {audioVisualizerData.map((value, index) => (
              <pixiGraphics
                key={index}
                draw={(g) => {
                  g.clear();
                  const barHeight = value * 40;
                  g.fill({ color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.8 });
                  g.rect(index * 6, 50 - barHeight, 4, barHeight);
                  g.fill();
                }}
                data-testid={`visualizer-bar-${index}`}
              />
            ))}
          </pixiContainer>
        )}

        {/* Training Status Display */}
        <pixiText
          text={statusText}
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            align: "center",
          }}
          x={width / 2}
          y={height - 15}
          anchor={0.5}
          data-testid="audio-training-status"
        />
      </ResponsivePixiPanel>
    </ResponsivePixiContainer>
  );
};

export default TrainingAudioManager;
