import { TrigramStance, PlayerArchetype } from "../../types/enums";

/**
 * ## Korean Culture System
 *
 * **Business Purpose:**
 * Ensures authentic and respectful representation of Korean martial arts culture
 * throughout Black Trigram. Provides:
 * - Accurate Korean terminology and translations
 * - Cultural context for Korean martial arts practices
 * - Educational content about Korean martial arts history
 * - Validation of cultural appropriateness and sensitivity
 *
 * **Korean Martial Arts Integration:**
 * - Maintains authentic Korean martial arts terminology
 * - Provides cultural context for all Korean martial arts elements
 * - Ensures respectful representation of Korean traditions
 * - Offers educational value about Korean martial arts heritage
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */

export interface KoreanTerminology {
  readonly korean: string;
  readonly english: string;
  readonly description: string;
  readonly culturalContext?: string;
}

export interface ArchetypeInfo {
  readonly korean: string;
  readonly english: string;
  readonly description: string;
  readonly philosophy: string;
  readonly historicalContext: string;
}

export class KoreanCulture {
  private static readonly STANCE_NAMES = new Map<
    TrigramStance,
    KoreanTerminology
  >([
    [
      TrigramStance.GEON,
      {
        korean: "건",
        english: "Heaven",
        description: "하늘의 기운을 담은 강력한 공격 자세",
        culturalContext: "I Ching의 첫 번째 괘로, 창조와 강인함을 상징",
      },
    ],
    [
      TrigramStance.TAE,
      {
        korean: "태",
        english: "Lake",
        description: "호수처럼 유연하고 적응력 있는 방어 자세",
        culturalContext: "기쁨과 소통을 나타내며, 유연한 대응을 강조",
      },
    ],
    [
      TrigramStance.LI,
      {
        korean: "리",
        english: "Fire",
        description: "불꽃처럼 강렬하고 변별력 있는 공격 자세",
        culturalContext: "열정과 에너지를 상징하며, 두려움 없는 공격성을 강조",
      },
    ],
    [
      TrigramStance.JIN,
      {
        korean: "진",
        english: "Thunder",
        description: "천둥처럼 강력하고 즉각적인 반응 자세",
        culturalContext: "강한 의지와 결단력을 나타내며, 신속한 행동을 강조",
      },
    ],
    [
      TrigramStance.SON,
      {
        korean: "손",
        english: "Wind",
        description: "바람처럼 유연하고 지속적인 변화에 대응하는 자세",
        culturalContext: "변화와 적응을 상징하며, 부드러움 속의 강함을 강조",
      },
    ],
    [
      TrigramStance.GAM,
      {
        korean: "감",
        english: "Water",
        description: "물처럼 깊고 유연하며 지혜롭게 대응하는 자세",
        culturalContext:
          "지혜와 통찰력을 나타내며, 상황에 따른 유연한 대응을 강조",
      },
    ],
    [
      TrigramStance.GAN,
      {
        korean: "간",
        english: "Mountain",
        description: "산처럼 견고하고 변함없는 중심을 유지하는 자세",
        culturalContext: "안정성과 지속성을 상징하며, 흔들림 없는 의지를 강조",
      },
    ],
    [
      TrigramStance.GON,
      {
        korean: "곤",
        english: "Earth",
        description: "대지처럼 포용적이고 안정적인 기반을 제공하는 자세",
        culturalContext:
          "모든 생명의 근원을 나타내며, 포용과 안정의 중요성을 강조",
      },
    ],
  ]);

  /**
   * **Business Logic:** Gets Korean terminology for trigram stance
   */
  getStanceName(stance: TrigramStance): KoreanTerminology {
    return (
      KoreanCulture.STANCE_NAMES.get(stance) || {
        korean: "알수없음",
        english: "Unknown",
        description: "정의되지 않은 자세",
      }
    );
  }

  /**
   * **Business Logic:** Gets archetype information with cultural context
   */
  getArchetypeInfo(archetype: PlayerArchetype): ArchetypeInfo {
    const archetypeMap = {
      [PlayerArchetype.MUSA]: {
        korean: "무사",
        english: "Warrior",
        description: "전통적인 한국 무사의 길을 걷는 명예로운 전사",
        philosophy: "명예와 의리를 중시하며, 정정당당한 무력으로 정의를 구현",
        historicalContext:
          "조선시대 무관 계급에서 발전한 전통적인 무사 정신을 계승",
      },
      [PlayerArchetype.SAGE]: {
        korean: "선인",
        english: "Sage",
        description: "높은 지혜와 통찰력을 지닌 은둔자",
        philosophy: "자연과의 조화를 중시하며, 무위자연의 경지를 추구",
        historicalContext:
          "고대 한국의 도교 및 불교적 요소가 혼합된 은둔자 문화에서 유래",
      },
      [PlayerArchetype.SHINSEI]: {
        korean: "신성",
        english: "Divine",
        description: "신의 가호를 받는 성스러운 전사",
        philosophy:
          "신성한 의무와 희생정신을 중시하며, 인류의 평화를 위해 싸움",
        historicalContext: "한국 전통 신앙에서 유래한 신성한 전사 개념",
      },
      [PlayerArchetype.YEOBAE]: {
        korean: "여백",
        english: "Blank",
        description: "무한한 가능성을 지닌 공백 상태",
        philosophy: "형태에 얽매이지 않고, 자유로운 영혼의 상태를 중시",
        historicalContext:
          "한국의 공예 및 예술에서 영감을 받은 자유로운 표현의 상징",
      },
    };

    return (
      archetypeMap[archetype] || {
        korean: "알수없음",
        english: "Unknown",
        description: "정의되지 않은 유형",
        philosophy: "철학 없음",
        historicalContext: "역사적 맥락 없음",
      }
    );
  }

  /**
   * **Business Logic:** Validates Korean text for cultural appropriateness
   */
  validateCulturalAccuracy(content: {
    terminology: string;
    context: string;
    usage: string;
  }): { isAppropriate: boolean; accuracy: number; suggestions: string[] } {
    const warnings: string[] = [];
    let accuracy = 1.0;

    // Check for inappropriate stereotypes
    const problematicTerms = ["mystical", "ancient secret", "inscrutable"];
    if (
      problematicTerms.some((term) =>
        content.terminology.toLowerCase().includes(term)
      )
    ) {
      warnings.push("Consider using more respectful terminology");
      accuracy -= 0.2;
    }

    return {
      isAppropriate: warnings.length === 0,
      accuracy: Math.max(0, accuracy),
      suggestions: warnings,
    };
  }
}

export default KoreanCulture;
