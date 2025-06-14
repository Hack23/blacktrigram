import React, { useState, useCallback, useMemo, useEffect } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text, Sprite } from "pixi.js";
import * as PIXI from "pixi.js";
import { KOREAN_COLORS } from "../../../types/constants";
import {
  ResponsivePixiContainer,
  ResponsivePixiPanel,
  ResponsivePixiButton,
} from "../../ui/base/ResponsivePixiComponents";
import { PlayerArchetype, TrigramStance } from "../../../types/enums";
import type { KoreanText } from "../../../types/korean-text";
import { useAudio } from "../../../audio/AudioProvider";

extend({ Container, Graphics, Text, Sprite });

/**
 * ## Training Art Display Component - Enhanced Korean Martial Arts Education
 *
 * **Business Purpose:**
 * Provides immersive visual education for authentic Korean martial arts techniques,
 * philosophy, and cultural context within the Black Trigram training system.
 *
 * **Korean Martial Arts Integration:**
 * - Displays traditional Korean martial arts forms and techniques
 * - Shows authentic trigram philosophy applications in combat
 * - Provides bilingual Korean-English educational content
 * - Maintains cultural accuracy and respect for Korean traditions
 *
 * **Educational Value:**
 * - Interactive technique demonstrations with step-by-step guidance
 * - Historical context of Korean martial arts development
 * - Proper Korean terminology with pronunciation guides
 * - Progressive learning from basic to advanced techniques
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */

export interface TrainingArtDisplayProps {
  readonly archetype: PlayerArchetype;
  readonly selectedStance: TrigramStance;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly screenWidth: number;
  readonly screenHeight: number;
  readonly onTechniqueSelect?: (technique: KoreanMartialTechnique) => void;
  readonly showAdvanced?: boolean;
}

interface KoreanMartialTechnique {
  readonly id: string;
  readonly name: KoreanText;
  readonly stance: TrigramStance;
  readonly archetype: PlayerArchetype;
  readonly level: "beginner" | "intermediate" | "advanced" | "master";
  readonly description: KoreanText;
  readonly steps: KoreanText[];
  readonly culturalContext: KoreanText;
  readonly philosophy: KoreanText;
  readonly videoUrl?: string;
  readonly imageUrl?: string;
  readonly difficulty: number; // 1-10
  readonly requiredExperience: number;
}

interface ArtCategory {
  readonly id: string;
  readonly name: KoreanText;
  readonly description: KoreanText;
  readonly techniques: KoreanMartialTechnique[];
  readonly icon: string;
  readonly color: number;
}

/**
 * ## Korean Martial Arts Technique Database
 *
 * **Business Logic:** Comprehensive database of authentic Korean martial arts
 * techniques organized by archetype, stance, and difficulty level.
 *
 * **Cultural Accuracy:** All techniques use proper Korean terminology with
 * accurate English translations and cultural context.
 */
const KOREAN_MARTIAL_ARTS_DATABASE: Record<PlayerArchetype, ArtCategory[]> = {
  [PlayerArchetype.MUSA]: [
    {
      id: "basic_forms",
      name: { korean: "기본 품세", english: "Basic Forms" },
      description: {
        korean: "전통 무사의 기본 자세와 동작",
        english: "Traditional warrior basic stances and movements",
      },
      icon: "☰",
      color: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
      techniques: [
        {
          id: "geon_stance_basic",
          name: { korean: "건괘 기본자세", english: "Heaven Stance Basics" },
          stance: TrigramStance.GEON,
          archetype: PlayerArchetype.MUSA,
          level: "beginner",
          description: {
            korean: "천괘의 강직한 힘을 표현하는 기본 자세",
            english: "Basic stance expressing the strong force of Heaven",
          },
          steps: [
            {
              korean: "1. 발을 어깨너비로 벌리고 서기",
              english: "1. Stand with feet shoulder-width apart",
            },
            {
              korean: "2. 무게중심을 낮추고 균형 잡기",
              english: "2. Lower center of gravity and balance",
            },
            {
              korean: "3. 양손을 가슴 앞에서 모으기",
              english: "3. Bring both hands together in front of chest",
            },
            {
              korean: "4. 정신을 집중하고 호흡 조절",
              english: "4. Focus mind and control breathing",
            },
          ],
          culturalContext: {
            korean:
              "건괘는 역경에서 하늘을 의미하며, 창조와 강건함의 상징입니다",
            english:
              "Geon represents Heaven in I Ching, symbolizing creation and strength",
          },
          philosophy: {
            korean: "하늘의 기운을 받아 올바른 정신으로 무예를 행하라",
            english:
              "Receive Heaven's energy and practice martial arts with righteous spirit",
          },
          difficulty: 2,
          requiredExperience: 0,
        },
        {
          id: "thunder_strike",
          name: { korean: "천둥벽력", english: "Thunder Strike" },
          stance: TrigramStance.JIN,
          archetype: PlayerArchetype.MUSA,
          level: "intermediate",
          description: {
            korean: "진괘의 순간적인 폭발력을 이용한 타격기",
            english:
              "Strike technique using Thunder's instantaneous explosive power",
          },
          steps: [
            {
              korean: "1. 진괘 자세에서 시작",
              english: "1. Begin in Thunder stance",
            },
            {
              korean: "2. 전신의 힘을 한 점으로 모으기",
              english: "2. Gather full body power to one point",
            },
            {
              korean: "3. 순간적으로 폭발적인 힘 방출",
              english: "3. Release explosive power instantaneously",
            },
            {
              korean: "4. 타격 후 즉시 방어 자세로 복귀",
              english: "4. Return to defensive stance immediately after strike",
            },
          ],
          culturalContext: {
            korean: "천둥은 순간의 강력한 에너지를 상징합니다",
            english: "Thunder symbolizes powerful energy in an instant",
          },
          philosophy: {
            korean: "진정한 힘은 절제된 순간에 나타난다",
            english: "True power manifests in moments of restraint",
          },
          difficulty: 6,
          requiredExperience: 150,
        },
      ],
    },
    {
      id: "defensive_techniques",
      name: { korean: "방어 기법", english: "Defensive Techniques" },
      description: {
        korean: "간괘의 산처럼 견고한 방어술",
        english: "Solid defensive arts like Mountain's firmness",
      },
      icon: "☶",
      color: KOREAN_COLORS.TRIGRAM_GAN_PRIMARY,
      techniques: [
        {
          id: "mountain_guard",
          name: { korean: "산악 방어", english: "Mountain Guard" },
          stance: TrigramStance.GAN,
          archetype: PlayerArchetype.MUSA,
          level: "beginner",
          description: {
            korean: "산처럼 흔들리지 않는 방어 자세",
            english: "Unshakeable defensive stance like a mountain",
          },
          steps: [
            {
              korean: "1. 간괘 자세로 중심 낮추기",
              english: "1. Lower center in Mountain stance",
            },
            {
              korean: "2. 양팔로 견고한 방어벽 형성",
              english: "2. Form solid defensive wall with both arms",
            },
            {
              korean: "3. 상대 공격을 흘려보내기",
              english: "3. Deflect opponent's attacks",
            },
            {
              korean: "4. 기회를 포착하여 반격 준비",
              english: "4. Prepare counterattack when opportunity arises",
            },
          ],
          culturalContext: {
            korean: "간괘는 산의 정지와 침착함을 의미합니다",
            english: "Gan represents the stillness and composure of mountains",
          },
          philosophy: {
            korean: "진정한 강함은 흔들리지 않는 마음에서 나온다",
            english: "True strength comes from an unshakeable mind",
          },
          difficulty: 3,
          requiredExperience: 50,
        },
      ],
    },
  ],

  [PlayerArchetype.AMSALJA]: [
    {
      id: "stealth_techniques",
      name: { korean: "은신술", english: "Stealth Techniques" },
      description: {
        korean: "손괘의 바람처럼 부드럽고 보이지 않는 기술",
        english: "Soft and invisible techniques like Wind's flow",
      },
      icon: "☴",
      color: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
      techniques: [
        {
          id: "wind_step",
          name: { korean: "풍보법", english: "Wind Step" },
          stance: TrigramStance.SON,
          archetype: PlayerArchetype.AMSALJA,
          level: "intermediate",
          description: {
            korean: "바람처럼 소리 없이 이동하는 보법",
            english: "Silent movement technique like wind",
          },
          steps: [
            {
              korean: "1. 손괘 자세에서 몸의 균형 조절",
              english: "1. Balance body in Wind stance",
            },
            {
              korean: "2. 발끝으로 조용히 착지",
              english: "2. Land quietly on toes",
            },
            {
              korean: "3. 호흡을 최소화하며 이동",
              english: "3. Move while minimizing breathing",
            },
            {
              korean: "4. 그림자를 이용한 은밀한 접근",
              english: "4. Stealthy approach using shadows",
            },
          ],
          culturalContext: {
            korean: "손괘는 바람의 부드러움과 침투력을 상징합니다",
            english: "Son represents wind's gentleness and penetrating power",
          },
          philosophy: {
            korean: "보이지 않는 것이 가장 강력한 무기다",
            english: "The unseen is the most powerful weapon",
          },
          difficulty: 7,
          requiredExperience: 200,
        },
      ],
    },
  ],

  [PlayerArchetype.HACKER]: [
    {
      id: "precision_techniques",
      name: { korean: "정밀 기법", english: "Precision Techniques" },
      description: {
        korean: "리괘의 불처럼 정확하고 날카로운 기술",
        english: "Accurate and sharp techniques like Fire's precision",
      },
      icon: "☲",
      color: KOREAN_COLORS.TRIGRAM_LI_PRIMARY,
      techniques: [
        {
          id: "fire_point_strike",
          name: { korean: "화염 지점타", english: "Fire Point Strike" },
          stance: TrigramStance.LI,
          archetype: PlayerArchetype.HACKER,
          level: "advanced",
          description: {
            korean: "급소를 정확히 노리는 정밀 타격",
            english: "Precise strike targeting vital points",
          },
          steps: [
            {
              korean: "1. 리괘 자세에서 집중력 극대화",
              english: "1. Maximize concentration in Fire stance",
            },
            {
              korean: "2. 상대의 급소 위치 파악",
              english: "2. Identify opponent's vital points",
            },
            {
              korean: "3. 최소한의 움직임으로 정확한 타격",
              english: "3. Precise strike with minimal movement",
            },
            {
              korean: "4. 타격 후 즉시 다음 공격 준비",
              english: "4. Prepare next attack immediately after strike",
            },
          ],
          culturalContext: {
            korean: "리괘는 불의 밝음과 명확함을 나타냅니다",
            english: "Li represents fire's brightness and clarity",
          },
          philosophy: {
            korean: "정확함은 힘보다 강하다",
            english: "Precision is stronger than power",
          },
          difficulty: 8,
          requiredExperience: 300,
        },
      ],
    },
  ],

  [PlayerArchetype.JEONGBO_YOWON]: [
    {
      id: "adaptive_techniques",
      name: { korean: "적응 기법", english: "Adaptive Techniques" },
      description: {
        korean: "감괘의 물처럼 유연하고 적응력 있는 기술",
        english: "Flexible and adaptive techniques like Water's flow",
      },
      icon: "☵",
      color: KOREAN_COLORS.TRIGRAM_GAM_PRIMARY,
      techniques: [
        {
          id: "water_flow_redirect",
          name: { korean: "수류 전환", english: "Water Flow Redirect" },
          stance: TrigramStance.GAM,
          archetype: PlayerArchetype.JEONGBO_YOWON,
          level: "intermediate",
          description: {
            korean: "물의 흐름처럼 상대 공격을 전환시키는 기법",
            english: "Technique to redirect opponent's attack like water flow",
          },
          steps: [
            {
              korean: "1. 감괘 자세에서 유연성 유지",
              english: "1. Maintain flexibility in Water stance",
            },
            {
              korean: "2. 상대 공격의 방향과 힘 파악",
              english: "2. Assess opponent's attack direction and force",
            },
            {
              korean: "3. 최소한의 힘으로 공격 방향 변경",
              english: "3. Change attack direction with minimal force",
            },
            {
              korean: "4. 상대의 균형을 깨뜨려 반격 기회 창조",
              english:
                "4. Break opponent's balance to create counterattack opportunity",
            },
          ],
          culturalContext: {
            korean: "감괘는 물의 유연함과 지혜를 상징합니다",
            english: "Gam symbolizes water's flexibility and wisdom",
          },
          philosophy: {
            korean: "부드러움이 강함을 이긴다",
            english: "Softness overcomes hardness",
          },
          difficulty: 6,
          requiredExperience: 180,
        },
      ],
    },
  ],

  [PlayerArchetype.JOJIK_POKRYEOKBAE]: [
    {
      id: "power_techniques",
      name: { korean: "파워 기법", english: "Power Techniques" },
      description: {
        korean: "곤괘의 대지처럼 강력하고 압도적인 기술",
        english: "Powerful and overwhelming techniques like Earth's strength",
      },
      icon: "☷",
      color: KOREAN_COLORS.TRIGRAM_GON_PRIMARY,
      techniques: [
        {
          id: "earth_crushing_blow",
          name: { korean: "대지 분쇄타", english: "Earth Crushing Blow" },
          stance: TrigramStance.GON,
          archetype: PlayerArchetype.JOJIK_POKRYEOKBAE,
          level: "advanced",
          description: {
            korean: "대지의 힘을 모아 강력한 일격을 가하는 기법",
            english:
              "Technique that gathers earth's power for devastating strike",
          },
          steps: [
            {
              korean: "1. 곤괘 자세에서 대지와 연결",
              english: "1. Connect with earth in Earth stance",
            },
            {
              korean: "2. 전신의 힘을 발에서부터 모으기",
              english: "2. Gather full body power from feet upward",
            },
            {
              korean: "3. 모든 힘을 한 점으로 집중",
              english: "3. Focus all power into one point",
            },
            {
              korean: "4. 압도적인 힘으로 결정타 가하기",
              english: "4. Deliver decisive blow with overwhelming force",
            },
          ],
          culturalContext: {
            korean: "곤괘는 대지의 포용력과 견고함을 나타냅니다",
            english: "Gon represents earth's nurturing power and solidity",
          },
          philosophy: {
            korean: "진정한 힘은 인내에서 나온다",
            english: "True power comes from endurance",
          },
          difficulty: 9,
          requiredExperience: 400,
        },
      ],
    },
  ],
};

export const TrainingArtDisplay: React.FC<TrainingArtDisplayProps> = ({
  archetype,
  selectedStance,
  x,
  y,
  width,
  height,
  screenWidth,
  screenHeight,
  onTechniqueSelect,
  showAdvanced = false,
}) => {
  const audio = useAudio();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentTechniqueIndex, setCurrentTechniqueIndex] = useState(0);
  const [selectedTechnique, setSelectedTechnique] =
    useState<KoreanMartialTechnique | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [autoPlayIndex, setAutoPlayIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;

  // Get current archetype's art categories
  const archetypeCategories = useMemo(() => {
    return KOREAN_MARTIAL_ARTS_DATABASE[archetype] || [];
  }, [archetype]);

  // Get current category and techniques
  const currentCategory = useMemo(() => {
    return archetypeCategories[currentCategoryIndex] || null;
  }, [archetypeCategories, currentCategoryIndex]);

  const availableTechniques = useMemo(() => {
    if (!currentCategory) return [];

    // Filter techniques by stance if specified, and by experience level
    let techniques = currentCategory.techniques;

    // Filter by stance if selectedStance is provided
    if (selectedStance) {
      techniques = techniques.filter((tech) => tech.stance === selectedStance);
    }

    // Filter by advanced setting
    if (!showAdvanced) {
      techniques = techniques.filter(
        (tech) => tech.level === "beginner" || tech.level === "intermediate"
      );
    }

    return techniques;
  }, [currentCategory, selectedStance, showAdvanced]);

  const currentTechnique = useMemo(() => {
    return availableTechniques[currentTechniqueIndex] || null;
  }, [availableTechniques, currentTechniqueIndex]);

  // Auto-play slideshow for technique steps
  useEffect(() => {
    if (!isAutoPlaying || !currentTechnique) return;

    const interval = setInterval(() => {
      setAutoPlayIndex((prev) => {
        const maxIndex = currentTechnique.steps.length - 1;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentTechnique]);

  // Navigation handlers
  const handlePreviousCategory = useCallback(() => {
    if (archetypeCategories.length === 0) return;
    setCurrentCategoryIndex((prev) =>
      prev === 0 ? archetypeCategories.length - 1 : prev - 1
    );
    setCurrentTechniqueIndex(0);
    audio.playSFX("menu_hover");
  }, [archetypeCategories.length, audio]);

  const handleNextCategory = useCallback(() => {
    if (archetypeCategories.length === 0) return;
    setCurrentCategoryIndex((prev) =>
      prev === archetypeCategories.length - 1 ? 0 : prev + 1
    );
    setCurrentTechniqueIndex(0);
    audio.playSFX("menu_hover");
  }, [archetypeCategories.length, audio]);

  const handlePreviousTechnique = useCallback(() => {
    if (availableTechniques.length === 0) return;
    setCurrentTechniqueIndex((prev) =>
      prev === 0 ? availableTechniques.length - 1 : prev - 1
    );
    audio.playSFX("menu_hover");
  }, [availableTechniques.length, audio]);

  const handleNextTechnique = useCallback(() => {
    if (availableTechniques.length === 0) return;
    setCurrentTechniqueIndex((prev) =>
      prev === availableTechniques.length - 1 ? 0 : prev + 1
    );
    audio.playSFX("menu_hover");
  }, [availableTechniques.length, audio]);

  const handleTechniqueSelect = useCallback(() => {
    if (!currentTechnique) return;

    setSelectedTechnique(currentTechnique);
    setShowSteps(true);
    audio.playSFX("menu_select");

    if (onTechniqueSelect) {
      onTechniqueSelect(currentTechnique);
    }
  }, [currentTechnique, onTechniqueSelect, audio]);

  const handleToggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => !prev);
    setAutoPlayIndex(0);
    audio.playSFX("menu_select");
  }, [audio]);

  // Render technique difficulty indicator
  const renderDifficultyIndicator = useCallback(
    (difficulty: number) => {
      return (
        <pixiContainer data-testid="difficulty-indicator">
          <pixiText
            text="난이도:"
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
            x={0}
            y={0}
          />
          {Array.from({ length: 10 }, (_, i) => (
            <pixiGraphics
              key={i}
              draw={(g) => {
                g.clear();
                g.fill({
                  color:
                    i < difficulty
                      ? KOREAN_COLORS.ACCENT_GOLD
                      : KOREAN_COLORS.UI_BACKGROUND_DARK,
                  alpha: 0.8,
                });
                g.circle(0, 0, isMobile ? 3 : 4);
                g.fill();
              }}
              x={35 + i * (isMobile ? 8 : 10)}
              y={6}
            />
          ))}
        </pixiContainer>
      );
    },
    [isMobile]
  );

  if (archetypeCategories.length === 0) {
    return (
      <ResponsivePixiContainer
        x={x}
        y={y}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        data-testid="training-art-display-empty"
      >
        <ResponsivePixiPanel
          title="무술 자료"
          x={0}
          y={0}
          width={width}
          height={height}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
        >
          <pixiText
            text="이 무사 유형에 대한 자료가 준비 중입니다"
            style={{
              fontSize: isMobile ? 12 : 16,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              align: "center",
            }}
            x={width / 2}
            y={height / 2}
            anchor={0.5}
          />
        </ResponsivePixiPanel>
      </ResponsivePixiContainer>
    );
  }

  return (
    <ResponsivePixiContainer
      x={x}
      y={y}
      screenWidth={screenWidth}
      screenHeight={screenHeight}
      data-testid="training-art-display"
    >
      <ResponsivePixiPanel
        title={`${currentCategory?.name.korean || "무술 자료"} - ${
          currentCategory?.name.english || "Martial Arts"
        }`}
        x={0}
        y={0}
        width={width}
        height={height}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
      >
        {/* Category Navigation */}
        <pixiContainer x={10} y={30} data-testid="category-navigation">
          <ResponsivePixiButton
            text="이전 카테고리"
            x={0}
            y={0}
            width={isMobile ? 80 : 100}
            height={isMobile ? 25 : 30}
            screenWidth={screenWidth}
            screenHeight={screenHeight}
            variant="secondary"
            onClick={handlePreviousCategory}
            disabled={archetypeCategories.length <= 1}
            data-testid="previous-category-button"
          />

          <pixiText
            text={`${currentCategoryIndex + 1} / ${archetypeCategories.length}`}
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              align: "center",
            }}
            x={isMobile ? 120 : 150}
            y={isMobile ? 12 : 15}
            anchor={0.5}
          />

          <ResponsivePixiButton
            text="다음 카테고리"
            x={isMobile ? 160 : 200}
            y={0}
            width={isMobile ? 80 : 100}
            height={isMobile ? 25 : 30}
            screenWidth={screenWidth}
            screenHeight={screenHeight}
            variant="secondary"
            onClick={handleNextCategory}
            disabled={archetypeCategories.length <= 1}
            data-testid="next-category-button"
          />
        </pixiContainer>

        {/* Category Description */}
        {currentCategory && (
          <pixiContainer x={10} y={70} data-testid="category-description">
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: currentCategory.color,
                  alpha: 0.2,
                });
                g.roundRect(0, 0, width - 20, 60, 6);
                g.fill();

                g.stroke({
                  width: 1,
                  color: currentCategory.color,
                  alpha: 0.6,
                });
                g.roundRect(0, 0, width - 20, 60, 6);
                g.stroke();
              }}
            />

            <pixiText
              text={currentCategory.icon}
              style={{
                fontSize: isMobile ? 20 : 24,
                fill: currentCategory.color,
                align: "center",
              }}
              x={15}
              y={20}
              anchor={0.5}
            />

            <pixiText
              text={currentCategory.description.korean}
              style={{
                fontSize: isMobile ? 11 : 13,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                wordWrap: true,
                wordWrapWidth: width - 60,
              }}
              x={35}
              y={10}
            />

            <pixiText
              text={currentCategory.description.english}
              style={{
                fontSize: isMobile ? 9 : 11,
                fill: KOREAN_COLORS.TEXT_SECONDARY,
                fontStyle: "italic",
                wordWrap: true,
                wordWrapWidth: width - 60,
              }}
              x={35}
              y={35}
            />
          </pixiContainer>
        )}

        {/* Technique Selection */}
        {availableTechniques.length > 0 ? (
          <pixiContainer x={10} y={140} data-testid="technique-selection">
            {/* Technique Navigation */}
            <pixiContainer y={0} data-testid="technique-navigation">
              <ResponsivePixiButton
                text="이전 기법"
                x={0}
                y={0}
                width={isMobile ? 70 : 90}
                height={isMobile ? 25 : 30}
                screenWidth={screenWidth}
                screenHeight={screenHeight}
                variant="secondary"
                onClick={handlePreviousTechnique}
                disabled={availableTechniques.length <= 1}
                data-testid="previous-technique-button"
              />

              <pixiText
                text={`${currentTechniqueIndex + 1} / ${
                  availableTechniques.length
                }`}
                style={{
                  fontSize: isMobile ? 10 : 12,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                  align: "center",
                }}
                x={isMobile ? 100 : 130}
                y={isMobile ? 12 : 15}
                anchor={0.5}
              />

              <ResponsivePixiButton
                text="다음 기법"
                x={isMobile ? 130 : 170}
                y={0}
                width={isMobile ? 70 : 90}
                height={isMobile ? 25 : 30}
                screenWidth={screenWidth}
                screenHeight={screenHeight}
                variant="secondary"
                onClick={handleNextTechnique}
                disabled={availableTechniques.length <= 1}
                data-testid="next-technique-button"
              />

              <ResponsivePixiButton
                text="자세히 보기"
                x={isMobile ? 210 : 280}
                y={0}
                width={isMobile ? 70 : 90}
                height={isMobile ? 25 : 30}
                screenWidth={screenWidth}
                screenHeight={screenHeight}
                variant="primary"
                onClick={handleTechniqueSelect}
                disabled={!currentTechnique}
                data-testid="view-technique-button"
              />
            </pixiContainer>

            {/* Current Technique Display */}
            {currentTechnique && (
              <pixiContainer y={40} data-testid="current-technique-display">
                <pixiGraphics
                  draw={(g) => {
                    g.clear();
                    g.fill({
                      color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                      alpha: 0.9,
                    });
                    g.roundRect(0, 0, width - 20, height - 200, 8);
                    g.fill();

                    g.stroke({
                      width: 2,
                      color: KOREAN_COLORS.ACCENT_GOLD,
                      alpha: 0.8,
                    });
                    g.roundRect(0, 0, width - 20, height - 200, 8);
                    g.stroke();
                  }}
                />

                {/* Technique Header */}
                <pixiContainer x={15} y={15} data-testid="technique-header">
                  <pixiText
                    text={currentTechnique.name.korean}
                    style={{
                      fontSize: isMobile ? 14 : 18,
                      fill: KOREAN_COLORS.ACCENT_GOLD,
                      fontWeight: "bold",
                    }}
                    x={0}
                    y={0}
                  />

                  <pixiText
                    text={currentTechnique.name.english}
                    style={{
                      fontSize: isMobile ? 11 : 14,
                      fill: KOREAN_COLORS.TEXT_SECONDARY,
                      fontStyle: "italic",
                    }}
                    x={0}
                    y={isMobile ? 20 : 25}
                  />

                  <pixiText
                    text={`${currentTechnique.stance} 자세 | ${currentTechnique.level} 수준`}
                    style={{
                      fontSize: isMobile ? 9 : 11,
                      fill: KOREAN_COLORS.PRIMARY_CYAN,
                    }}
                    x={0}
                    y={isMobile ? 40 : 50}
                  />
                </pixiContainer>

                {/* Difficulty Indicator */}
                <pixiContainer x={15} y={isMobile ? 80 : 90}>
                  {renderDifficultyIndicator(currentTechnique.difficulty)}
                </pixiContainer>

                {/* Technique Description */}
                <pixiContainer
                  x={15}
                  y={isMobile ? 110 : 130}
                  data-testid="technique-description"
                >
                  <pixiText
                    text={currentTechnique.description.korean}
                    style={{
                      fontSize: isMobile ? 11 : 13,
                      fill: KOREAN_COLORS.TEXT_PRIMARY,
                      wordWrap: true,
                      wordWrapWidth: width - 50,
                    }}
                    x={0}
                    y={0}
                  />

                  <pixiText
                    text={currentTechnique.description.english}
                    style={{
                      fontSize: isMobile ? 9 : 11,
                      fill: KOREAN_COLORS.TEXT_SECONDARY,
                      fontStyle: "italic",
                      wordWrap: true,
                      wordWrapWidth: width - 50,
                    }}
                    x={0}
                    y={isMobile ? 25 : 30}
                  />
                </pixiContainer>

                {/* Quick Steps Preview */}
                {!showSteps && (
                  <pixiContainer
                    x={15}
                    y={isMobile ? 170 : 200}
                    data-testid="quick-steps-preview"
                  >
                    <pixiText
                      text="주요 단계:"
                      style={{
                        fontSize: isMobile ? 10 : 12,
                        fill: KOREAN_COLORS.ACCENT_GOLD,
                        fontWeight: "bold",
                      }}
                      x={0}
                      y={0}
                    />

                    {currentTechnique.steps.slice(0, 2).map((step, index) => (
                      <pixiText
                        key={index}
                        text={`${step.korean}`}
                        style={{
                          fontSize: isMobile ? 9 : 10,
                          fill: KOREAN_COLORS.TEXT_SECONDARY,
                          wordWrap: true,
                          wordWrapWidth: width - 50,
                        }}
                        x={0}
                        y={20 + index * (isMobile ? 15 : 18)}
                      />
                    ))}

                    <pixiText
                      text="자세히 보기를 클릭하여 전체 단계를 확인하세요"
                      style={{
                        fontSize: isMobile ? 8 : 9,
                        fill: KOREAN_COLORS.TEXT_TERTIARY,
                        fontStyle: "italic",
                      }}
                      x={0}
                      y={isMobile ? 55 : 65}
                    />
                  </pixiContainer>
                )}

                {/* Detailed Steps Display */}
                {showSteps && (
                  <pixiContainer
                    x={15}
                    y={isMobile ? 170 : 200}
                    data-testid="detailed-steps"
                  >
                    <pixiContainer y={0} data-testid="steps-header">
                      <pixiText
                        text="상세 단계:"
                        style={{
                          fontSize: isMobile ? 11 : 13,
                          fill: KOREAN_COLORS.ACCENT_GOLD,
                          fontWeight: "bold",
                        }}
                        x={0}
                        y={0}
                      />

                      <ResponsivePixiButton
                        text={isAutoPlaying ? "자동재생 중지" : "자동재생"}
                        x={width - 150}
                        y={-5}
                        width={isMobile ? 80 : 100}
                        height={isMobile ? 20 : 25}
                        screenWidth={screenWidth}
                        screenHeight={screenHeight}
                        variant="ghost"
                        onClick={handleToggleAutoPlay}
                        data-testid="auto-play-toggle"
                      />

                      <ResponsivePixiButton
                        text="닫기"
                        x={width - 60}
                        y={-5}
                        width={isMobile ? 40 : 50}
                        height={isMobile ? 20 : 25}
                        screenWidth={screenWidth}
                        screenHeight={screenHeight}
                        variant="secondary"
                        onClick={() => setShowSteps(false)}
                        data-testid="close-steps-button"
                      />
                    </pixiContainer>

                    {currentTechnique.steps.map((step, index) => (
                      <pixiContainer
                        key={index}
                        y={30 + index * (isMobile ? 25 : 30)}
                      >
                        <pixiGraphics
                          draw={(g) => {
                            g.clear();
                            const isCurrentStep =
                              isAutoPlaying && autoPlayIndex === index;
                            g.fill({
                              color: isCurrentStep
                                ? KOREAN_COLORS.ACCENT_GOLD
                                : KOREAN_COLORS.UI_BACKGROUND_LIGHT,
                              alpha: isCurrentStep ? 0.3 : 0.1,
                            });
                            g.roundRect(
                              0,
                              0,
                              width - 50,
                              isMobile ? 20 : 25,
                              4
                            );
                            g.fill();
                          }}
                        />

                        <pixiText
                          text={step.korean}
                          style={{
                            fontSize: isMobile ? 9 : 10,
                            fill: KOREAN_COLORS.TEXT_PRIMARY,
                            wordWrap: true,
                            wordWrapWidth: width - 70,
                          }}
                          x={5}
                          y={3}
                        />

                        <pixiText
                          text={step.english}
                          style={{
                            fontSize: isMobile ? 8 : 9,
                            fill: KOREAN_COLORS.TEXT_SECONDARY,
                            fontStyle: "italic",
                            wordWrap: true,
                            wordWrapWidth: width - 70,
                          }}
                          x={5}
                          y={isMobile ? 12 : 15}
                        />
                      </pixiContainer>
                    ))}

                    {/* Cultural Context */}
                    <pixiContainer
                      y={
                        30 +
                        currentTechnique.steps.length * (isMobile ? 25 : 30) +
                        20
                      }
                    >
                      <pixiText
                        text="문화적 맥락:"
                        style={{
                          fontSize: isMobile ? 10 : 12,
                          fill: KOREAN_COLORS.ACCENT_CYAN,
                          fontWeight: "bold",
                        }}
                        x={0}
                        y={0}
                      />

                      <pixiText
                        text={currentTechnique.culturalContext.korean}
                        style={{
                          fontSize: isMobile ? 9 : 10,
                          fill: KOREAN_COLORS.TEXT_PRIMARY,
                          wordWrap: true,
                          wordWrapWidth: width - 50,
                        }}
                        x={0}
                        y={20}
                      />

                      <pixiText
                        text={currentTechnique.culturalContext.english}
                        style={{
                          fontSize: isMobile ? 8 : 9,
                          fill: KOREAN_COLORS.TEXT_SECONDARY,
                          fontStyle: "italic",
                          wordWrap: true,
                          wordWrapWidth: width - 50,
                        }}
                        x={0}
                        y={isMobile ? 35 : 40}
                      />
                    </pixiContainer>

                    {/* Philosophy */}
                    <pixiContainer
                      y={
                        30 +
                        currentTechnique.steps.length * (isMobile ? 25 : 30) +
                        80
                      }
                    >
                      <pixiText
                        text="무예 철학:"
                        style={{
                          fontSize: isMobile ? 10 : 12,
                          fill: KOREAN_COLORS.SECONDARY_MAGENTA,
                          fontWeight: "bold",
                        }}
                        x={0}
                        y={0}
                      />

                      <pixiText
                        text={currentTechnique.philosophy.korean}
                        style={{
                          fontSize: isMobile ? 9 : 10,
                          fill: KOREAN_COLORS.TEXT_PRIMARY,
                          wordWrap: true,
                          wordWrapWidth: width - 50,
                          fontStyle: "italic",
                        }}
                        x={0}
                        y={20}
                      />

                      <pixiText
                        text={currentTechnique.philosophy.english}
                        style={{
                          fontSize: isMobile ? 8 : 9,
                          fill: KOREAN_COLORS.TEXT_SECONDARY,
                          fontStyle: "italic",
                          wordWrap: true,
                          wordWrapWidth: width - 50,
                        }}
                        x={0}
                        y={isMobile ? 35 : 40}
                      />
                    </pixiContainer>
                  </pixiContainer>
                )}
              </pixiContainer>
            )}
          </pixiContainer>
        ) : (
          <pixiContainer x={10} y={140} data-testid="no-techniques">
            <pixiText
              text="선택한 조건에 맞는 기법이 없습니다"
              style={{
                fontSize: isMobile ? 12 : 14,
                fill: KOREAN_COLORS.TEXT_SECONDARY,
                align: "center",
              }}
              x={width / 2 - 10}
              y={50}
              anchor={0.5}
            />

            <pixiText
              text="다른 자세를 선택하거나 고급 기법을 활성화해보세요"
              style={{
                fontSize: isMobile ? 10 : 12,
                fill: KOREAN_COLORS.TEXT_TERTIARY,
                align: "center",
                fontStyle: "italic",
              }}
              x={width / 2 - 10}
              y={75}
              anchor={0.5}
            />
          </pixiContainer>
        )}
      </ResponsivePixiPanel>
    </ResponsivePixiContainer>
  );
};

export default TrainingArtDisplay;
