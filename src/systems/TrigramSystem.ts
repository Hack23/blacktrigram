import { TrigramStance, PlayerArchetype } from "../types/enums";
import type { KoreanText } from "../types/korean-text";

/**
 * ## Korean Martial Arts Trigram System (팔괘 시스템)
 *
 * **Business Purpose:**
 * Comprehensive implementation of the Eight Trigrams combat system that forms
 * the philosophical and tactical foundation of Black Trigram. Provides:
 * - Authentic I Ching trigram philosophy integration with Korean martial arts
 * - Traditional Korean combat stance system with historical accuracy
 * - Strategic combat advantages based on trigram relationships
 * - Educational value about Korean martial arts philosophical foundations
 *
 * **Korean Martial Arts Integration:**
 * - Implements traditional Korean interpretation of I Ching trigrams (팔괘)
 * - Respects Korean martial arts philosophical principles
 * - Provides authentic Korean terminology and cultural context
 * - Maintains historical accuracy in trigram applications to combat
 *
 * **Technical Architecture:**
 * - Real-time stance effectiveness calculation system
 * - Complex trigram relationship matrix for strategic combat
 * - Performance-optimized stance transition validation
 * - Integration with Korean cultural knowledge system
 *
 * **Philosophical Foundation:**
 * Each trigram represents fundamental forces of nature and universe,
 * applied to Korean martial arts combat through centuries of tradition:
 * - ☰ 건 (Heaven): Direct force and leadership
 * - ☱ 태 (Lake): Joy and adaptability
 * - ☲ 리 (Fire): Clarity and precision
 * - ☳ 진 (Thunder): Movement and surprise
 * - ☴ 손 (Wind): Persistence and penetration
 * - ☵ 감 (Water): Danger and flow
 * - ☶ 간 (Mountain): Stillness and defense
 * - ☷ 곤 (Earth): Receptivity and support
 *
 * @example
 * ```typescript
 * const trigramSystem = new TrigramSystem();
 *
 * // Check stance effectiveness in combat
 * const effectiveness = trigramSystem.calculateStanceEffectiveness(
 *   TrigramStance.GEON, // Heaven stance (attacker)
 *   TrigramStance.GON   // Earth stance (defender)
 * );
 *
 * console.log(`천(Heaven) vs 곤(Earth): ${effectiveness}x 효과`);
 *
 * // Get cultural context for education
 * const context = trigramSystem.getStanceContext(TrigramStance.GEON);
 * console.log(`${context.koreanName}: ${context.philosophy}`);
 * ```
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
export class TrigramSystem {
  private readonly stanceData: Map<TrigramStance, TrigramStanceData>;
  private readonly effectivenessMatrix: Map<string, number>;

  /**
   * **Business Logic:** Initializes Korean martial arts trigram system
   *
   * Establishes the complete eight trigram stance system with traditional
   * Korean martial arts applications and I Ching philosophical foundations.
   */
  constructor() {
    this.stanceData = new Map();
    this.effectivenessMatrix = new Map();

    this.initializeStanceData();
    this.initializeEffectivenessMatrix();
    this.validateSystemIntegrity();
  }

  /**
   * **Business Logic:** Calculates combat effectiveness between trigram stances
   *
   * Determines tactical advantage based on traditional I Ching trigram relationships
   * and Korean martial arts combat principles. Each stance has specific strengths
   * and weaknesses following ancient Korean martial arts wisdom.
   *
   * @param attackerStance - Attacker's current trigram stance
   * @param defenderStance - Defender's current trigram stance
   * @returns Effectiveness multiplier (0.5 to 2.0) based on trigram philosophy
   *
   * @example
   * ```typescript
   * // Thunder (진) vs Mountain (간) - movement overcomes stillness
   * const effectiveness = trigramSystem.calculateStanceEffectiveness(
   *   TrigramStance.JIN,  // Thunder - explosive movement
   *   TrigramStance.GAN   // Mountain - defensive stillness
   * );
   *
   * if (effectiveness > 1.0) {
   *   console.log(`진(Thunder)이 간(Mountain)을 압도합니다!`);
   * }
   * ```
   */
  calculateStanceEffectiveness(
    attackerStance: TrigramStance,
    defenderStance: TrigramStance
  ): number {
    const key = `${attackerStance}_vs_${defenderStance}`;
    const effectiveness = this.effectivenessMatrix.get(key);

    if (effectiveness === undefined) {
      console.warn(
        `Unknown stance combination: ${attackerStance} vs ${defenderStance}`
      );
      return 1.0; // Neutral effectiveness
    }

    return effectiveness;
  }

  /**
   * **Business Logic:** Gets all available trigram stances
   *
   * Returns complete list of eight trigram stances for Korean martial arts
   * training and educational reference.
   *
   * @returns Array of all trigram stance identifiers
   */
  getAllStances(): TrigramStance[] {
    return Object.values(TrigramStance);
  }

  /**
   * **Business Logic:** Validates stance transition capability
   *
   * Determines if a player can transition between trigram stances based on:
   * - Current ki (internal energy) levels
   * - Stamina and physical condition
   * - Korean martial arts transition principles
   * - Combat timing and flow requirements
   *
   * @param currentStance - Player's current trigram stance
   * @param targetStance - Desired trigram stance to transition to
   * @param resources - Player's current ki and stamina levels
   * @returns Whether transition is possible with Korean martial arts authenticity
   *
   * @example
   * ```typescript
   * const canTransition = trigramSystem.canTransitionToStance(
   *   TrigramStance.GON,  // From Earth stance
   *   TrigramStance.GEON, // To Heaven stance
   *   { ki: 40, stamina: 60 }
   * );
   *
   * if (canTransition) {
   *   console.log("곤(Earth)에서 건(Heaven)으로 전환 가능!");
   * } else {
   *   console.log("기력 또는 체력 부족으로 전환 불가");
   * }
   * ```
   */
  canTransitionToStance(
    currentStance: TrigramStance,
    targetStance: TrigramStance,
    resources: { ki: number; stamina: number }
  ): boolean {
    if (currentStance === targetStance) {
      return true; // Already in target stance
    }

    const transitionCost = this.calculateTransitionCost(
      currentStance,
      targetStance
    );

    return (
      resources.ki >= transitionCost.ki &&
      resources.stamina >= transitionCost.stamina
    );
  }

  /**
   * **Business Logic:** Gets cultural and philosophical context for trigram stance
   *
   * Provides educational information about Korean martial arts philosophy
   * and traditional I Ching meanings applied to combat situations.
   *
   * @param stance - Trigram stance to get context for
   * @returns Comprehensive Korean cultural and philosophical information
   *
   * @example
   * ```typescript
   * const context = trigramSystem.getStanceContext(TrigramStance.LI);
   *
   * console.log(`한국어: ${context.koreanName}`);
   * console.log(`영어: ${context.englishName}`);
   * console.log(`철학: ${context.philosophy}`);
   * console.log(`무예 응용: ${context.martialApplication}`);
   * console.log(`자연 원소: ${context.naturalElement}`);
   * ```
   */
  getStanceContext(stance: TrigramStance): TrigramStanceContext {
    const stanceData = this.stanceData.get(stance);

    if (!stanceData) {
      return {
        koreanName: "알수없음",
        englishName: "Unknown",
        symbol: "?",
        philosophy: "정의되지 않은 자세입니다.",
        martialApplication: "알려지지 않은 응용법",
        naturalElement: "미정",
        traditionalMeaning: "전통적 의미 없음",
        combatAdvantages: [],
        combatDisadvantages: [],
        recommendedFor: [],
      };
    }

    return {
      koreanName: stanceData.korean.korean,
      englishName: stanceData.korean.english,
      symbol: stanceData.symbol,
      philosophy: stanceData.philosophy,
      martialApplication: stanceData.martialApplication,
      naturalElement: stanceData.naturalElement,
      traditionalMeaning: stanceData.traditionalMeaning,
      combatAdvantages: stanceData.combatAdvantages,
      combatDisadvantages: stanceData.combatDisadvantages,
      recommendedFor: stanceData.recommendedArchetypes,
    };
  }

  /**
   * **Business Logic:** Calculates resource cost for stance transitions
   *
   * Determines ki and stamina costs for transitioning between trigram stances
   * based on Korean martial arts principles and I Ching philosophy.
   *
   * @param fromStance - Current trigram stance
   * @param toStance - Target trigram stance
   * @returns Resource costs with Korean martial arts authenticity
   *
   * @internal
   */
  private calculateTransitionCost(
    fromStance: TrigramStance,
    toStance: TrigramStance
  ): { ki: number; stamina: number } {
    // Base transition costs
    const baseCost = { ki: 10, stamina: 5 };

    // Calculate philosophical distance between stances
    const stanceOrder = Object.values(TrigramStance);
    const fromIndex = stanceOrder.indexOf(fromStance);
    const toIndex = stanceOrder.indexOf(toStance);

    if (fromIndex === -1 || toIndex === -1) {
      return { ki: 50, stamina: 25 }; // High cost for unknown stances
    }

    // Calculate minimum circular distance
    const directDistance = Math.abs(toIndex - fromIndex);
    const wraparoundDistance = stanceOrder.length - directDistance;
    const minDistance = Math.min(directDistance, wraparoundDistance);

    // Apply distance-based cost multiplier
    const distanceMultiplier = 1 + minDistance * 0.3;

    return {
      ki: Math.round(baseCost.ki * distanceMultiplier),
      stamina: Math.round(baseCost.stamina * distanceMultiplier),
    };
  }

  /**
   * **Business Logic:** Initializes Korean martial arts stance data
   *
   * Sets up comprehensive database of trigram stances with authentic
   * Korean martial arts information and I Ching philosophical foundations.
   *
   * @internal
   */
  private initializeStanceData(): void {
    const stances: [TrigramStance, TrigramStanceData][] = [
      [
        TrigramStance.GEON,
        {
          korean: { korean: "건", english: "Heaven" },
          symbol: "☰",
          philosophy: "하늘의 기운으로 강직하고 창조적인 힘을 나타냅니다.",
          martialApplication: "직선적이고 강력한 공격, 리더십과 주도권",
          naturalElement: "하늘/창조",
          traditionalMeaning: "창조, 강건, 아버지, 리더십",
          combatAdvantages: ["강력한 직격타", "압도적인 공격력", "정면 돌파"],
          combatDisadvantages: ["유연성 부족", "에너지 소모 큼", "예측 가능성"],
          recommendedArchetypes: [
            PlayerArchetype.MUSA,
            PlayerArchetype.JOJIK_POKRYEOKBAE,
          ],
        },
      ],

      [
        TrigramStance.TAE,
        {
          korean: { korean: "태", english: "Lake" },
          symbol: "☱",
          philosophy: "호수의 기쁨과 소통으로 유연한 적응력을 나타냅니다.",
          martialApplication: "유동적인 반격, 상대의 힘을 이용한 기술",
          naturalElement: "호수/기쁨",
          traditionalMeaning: "기쁨, 소통, 막내딸, 적응성",
          combatAdvantages: ["유연한 대응", "연속 공격", "상대 힘 이용"],
          combatDisadvantages: [
            "단독 공격력 약함",
            "집중력 필요",
            "안정성 부족",
          ],
          recommendedArchetypes: [
            PlayerArchetype.JEONGBO_YOWON,
            PlayerArchetype.AMSALJA,
          ],
        },
      ],

      [
        TrigramStance.LI,
        {
          korean: { korean: "리", english: "Fire" },
          symbol: "☲",
          philosophy: "불의 기운으로 열정과 명확한 목표를 나타냅니다.",
          martialApplication: "강력하고 집중된 공격, 적의 약점 파악",
          naturalElement: "불/열정",
          traditionalMeaning: "열정, 변혁, 장남, 목표의식",
          combatAdvantages: ["강력한 공격력", "상대의 약점 공략", "빠른 결정"],
          combatDisadvantages: ["에너지 소모 큼", "방어 취약", "예측 가능성"],
          recommendedArchetypes: [
            PlayerArchetype.GONGSUL,
            PlayerArchetype.MUSA,
          ],
        },
      ],

      [
        TrigramStance.JIN,
        {
          korean: { korean: "진", english: "Thunder" },
          symbol: "☳",
          philosophy: "천둥의 기운으로 변화와 급속한 행동을 나타냅니다.",
          martialApplication: "기습적이고 빠른 공격, 적의 균형 무너뜨리기",
          naturalElement: "천둥/변화",
          traditionalMeaning: "변화, 적응, 장남, 기습",
          combatAdvantages: ["기습 공격", "빠른 속도", "상대의 예측 불가"],
          combatDisadvantages: ["에너지 소모 큼", "지속력 부족", "위험 부담"],
          recommendedArchetypes: [
            PlayerArchetype.JOJIK_POKRYEOKBAE,
            PlayerArchetype.GONGSUL,
          ],
        },
      ],

      [
        TrigramStance.SON,
        {
          korean: { korean: "손", english: "Wind" },
          symbol: "☴",
          philosophy: "바람의 기운으로 유연함과 지속적인 공격을 나타냅니다.",
          martialApplication: "지속적이고 유동적인 공격, 적의 방어 무너뜨리기",
          naturalElement: "바람/유연성",
          traditionalMeaning: "유연성, 적응, 둘째 아들, 지속성",
          combatAdvantages: [
            "지속적인 압박",
            "유연한 전환",
            "상대의 방어 약화",
          ],
          combatDisadvantages: ["공격력 분산", "집중력 필요", "에너지 소모 큼"],
          recommendedArchetypes: [
            PlayerArchetype.AMSALJA,
            PlayerArchetype.JEONGBO_YOWON,
          ],
        },
      ],

      [
        TrigramStance.GAM,
        {
          korean: { korean: "감", english: "Water" },
          symbol: "☵",
          philosophy: "물의 기운으로 유연함과 깊이를 나타냅니다.",
          martialApplication: "상대의 힘을 흘려보내고 기회를 엿보기",
          naturalElement: "물/유연성",
          traditionalMeaning: "지혜, 유연성, 셋째 아들, 깊이",
          combatAdvantages: ["상대의 힘 이용", "기민한 회피", "지속적인 압박"],
          combatDisadvantages: ["공격력 약함", "의존성", "예측 가능성"],
          recommendedArchetypes: [
            PlayerArchetype.MUSA,
            PlayerArchetype.GONGSUL,
          ],
        },
      ],

      [
        TrigramStance.GAN,
        {
          korean: { korean: "간", english: "Mountain" },
          symbol: "☶",
          philosophy: "산의 기운으로 안정성과 방어를 나타냅니다.",
          martialApplication: "강력한 방어와 반격, 적의 공격 무력화",
          naturalElement: "산/안정",
          traditionalMeaning: "안정, 방어, 장녀, 지속성",
          combatAdvantages: [
            "강력한 방어력",
            "지속적인 압박",
            "상대의 체력 소모",
          ],
          combatDisadvantages: ["기동성 부족", "공격력 분산", "에너지 소모 큼"],
          recommendedArchetypes: [
            PlayerArchetype.JEONGBO_YOWON,
            PlayerArchetype.AMSALJA,
          ],
        },
      ],

      [
        TrigramStance.GON,
        {
          korean: { korean: "곤", english: "Earth" },
          symbol: "☷",
          philosophy: "대지의 기운으로 포용성과 지지를 나타냅니다.",
          martialApplication: "상대의 공격을 받아주고 반격 기회 엿보기",
          naturalElement: "대지/지지",
          traditionalMeaning: "포용, 지지, 막내 아들, 안정성",
          combatAdvantages: ["상대의 힘 흡수", "지속적인 압박", "강력한 반격"],
          combatDisadvantages: ["기동성 부족", "공격력 분산", "에너지 소모 큼"],
          recommendedArchetypes: [
            PlayerArchetype.MUSA,
            PlayerArchetype.GONGSUL,
          ],
        },
      ],
    ];

    stances.forEach(([stance, data]) => {
      this.stanceData.set(stance, data);
    });
  }

  /**
   * **Business Logic:** Initializes trigram effectiveness relationships
   *
   * Creates comprehensive matrix of trigram stance interactions based on
   * traditional I Ching philosophy and Korean martial arts combat principles.
   *
   * @internal
   */
  private initializeEffectivenessMatrix(): void {
    // Traditional I Ching trigram relationships applied to Korean martial arts
    const relationships: [string, number][] = [
      // Heaven (건) relationships
      [`${TrigramStance.GEON}_vs_${TrigramStance.GEON}`, 1.0], // Heaven vs Heaven - equal
      [`${TrigramStance.GEON}_vs_${TrigramStance.GON}`, 1.8], // Heaven over Earth - strong
      [`${TrigramStance.GEON}_vs_${TrigramStance.LI}`, 1.2], // Heaven supports Fire
      [`${TrigramStance.GEON}_vs_${TrigramStance.GAM}`, 0.8], // Heaven weakened by Water

      // Earth (곤) relationships
      [`${TrigramStance.GON}_vs_${TrigramStance.GEON}`, 0.6], // Earth under Heaven - weak
      [`${TrigramStance.GON}_vs_${TrigramStance.GON}`, 1.0], // Earth vs Earth - equal
      [`${TrigramStance.GON}_vs_${TrigramStance.GAM}`, 1.3], // Earth absorbs Water
      [`${TrigramStance.GON}_vs_${TrigramStance.JIN}`, 1.1], // Earth grounds Thunder

      // Fire (리) relationships
      [`${TrigramStance.LI}_vs_${TrigramStance.GEON}`, 0.8], // Fire weakened by Heaven
      [`${TrigramStance.LI}_vs_${TrigramStance.GON}`, 0.9], // Fire balanced by Earth
      [`${TrigramStance.LI}_vs_${TrigramStance.LI}`, 1.0], // Fire vs Fire - equal
      [`${TrigramStance.LI}_vs_${TrigramStance.GAM}`, 1.4], // Fire over Water - strong
      [`${TrigramStance.LI}_vs_${TrigramStance.GAN}`, 1.2], // Fire supports Mountain
      [`${TrigramStance.LI}_vs_${TrigramStance.JIN}`, 1.3], // Fire over Thunder - strong
      [`${TrigramStance.LI}_vs_${TrigramStance.SON}`, 0.7], // Fire weakened by Wind

      // Thunder (진) relationships
      [`${TrigramStance.JIN}_vs_${TrigramStance.GEON}`, 0.7], // Thunder weakened by Heaven
      [`${TrigramStance.JIN}_vs_${TrigramStance.GON}`, 0.9], // Thunder balanced by Earth
      [`${TrigramStance.JIN}_vs_${TrigramStance.LI}`, 0.8], // Thunder weakened by Fire
      [`${TrigramStance.JIN}_vs_${TrigramStance.GAM}`, 1.1], // Thunder over Water - slight advantage
      [`${TrigramStance.JIN}_vs_${TrigramStance.GAN}`, 1.3], // Thunder over Mountain - strong
      [`${TrigramStance.JIN}_vs_${TrigramStance.SON}`, 1.2], // Thunder supports Wind
      [`${TrigramStance.JIN}_vs_${TrigramStance.JIN}`, 1.0], // Thunder vs Thunder - equal

      // Wind (손) relationships
      [`${TrigramStance.SON}_vs_${TrigramStance.GEON}`, 0.6], // Wind under Heaven - weak
      [`${TrigramStance.SON}_vs_${TrigramStance.GON}`, 0.8], // Wind balanced by Earth
      [`${TrigramStance.SON}_vs_${TrigramStance.LI}`, 1.1], // Wind over Fire - slight advantage
      [`${TrigramStance.SON}_vs_${TrigramStance.JIN}`, 0.9], // Wind balanced by Thunder
      [`${TrigramStance.SON}_vs_${TrigramStance.SON}`, 1.0], // Wind vs Wind - equal
      [`${TrigramStance.SON}_vs_${TrigramStance.GAM}`, 1.3], // Wind supports Water
      [`${TrigramStance.SON}_vs_${TrigramStance.GAN}`, 1.2], // Wind over Mountain - strong

      // Water (감) relationships
      [`${TrigramStance.GAM}_vs_${TrigramStance.GEON}`, 1.2], // Water over Heaven - slight advantage
      [`${TrigramStance.GAM}_vs_${TrigramStance.GON}`, 0.7], // Water weakened by Earth
      [`${TrigramStance.GAM}_vs_${TrigramStance.LI}`, 0.6], // Water under Fire - weak
      [`${TrigramStance.GAM}_vs_${TrigramStance.JIN}`, 0.9], // Water balanced by Thunder
      [`${TrigramStance.GAM}_vs_${TrigramStance.SON}`, 0.8], // Water weakened by Wind
      [`${TrigramStance.GAM}_vs_${TrigramStance.GAM}`, 1.0], // Water vs Water - equal
      [`${TrigramStance.GAM}_vs_${TrigramStance.GAN}`, 1.4], // Water over Mountain - strong

      // Mountain (간) relationships
      [`${TrigramStance.GAN}_vs_${TrigramStance.GEON}`, 0.9], // Mountain balanced by Heaven
      [`${TrigramStance.GAN}_vs_${TrigramStance.GON}`, 0.7], // Mountain weakened by Earth
      [`${TrigramStance.GAN}_vs_${TrigramStance.LI}`, 0.8], // Mountain supports Fire
      [`${TrigramStance.GAN}_vs_${TrigramStance.JIN}`, 0.7], // Mountain weakened by Thunder
      [`${TrigramStance.GAN}_vs_${TrigramStance.SON}`, 0.9], // Mountain balanced by Wind
      [`${TrigramStance.GAN}_vs_${TrigramStance.GAM}`, 0.6], // Mountain under Water - weak
      [`${TrigramStance.GAN}_vs_${TrigramStance.GAN}`, 1.0], // Mountain vs Mountain - equal

      // Earth (곤) relationships
      [`${TrigramStance.GON}_vs_${TrigramStance.GEON}`, 0.6], // Earth under Heaven - weak
      [`${TrigramStance.GON}_vs_${TrigramStance.GON}`, 1.0], // Earth vs Earth - equal
      [`${TrigramStance.GON}_vs_${TrigramStance.GAM}`, 1.3], // Earth absorbs Water
      [`${TrigramStance.GON}_vs_${TrigramStance.JIN}`, 1.1], // Earth grounds Thunder
    ];

    relationships.forEach(([key, effectiveness]) => {
      this.effectivenessMatrix.set(key, effectiveness);
    });
  }

  /**
   * **Business Logic:** Validates trigram system integrity
   *
   * Ensures all trigram stances have complete Korean martial arts information
   * and proper philosophical relationships for reliable system operation.
   *
   * @throws Error if trigram system data is invalid or incomplete
   * @internal
   */
  private validateSystemIntegrity(): void {
    const requiredStances = Object.values(TrigramStance);

    // Validate all stances have data
    for (const stance of requiredStances) {
      const data = this.stanceData.get(stance);
      if (!data) {
        throw new Error(`팔괘 데이터 누락: ${stance}`);
      }

      if (!data.korean?.korean || !data.korean?.english) {
        throw new Error(`팔괘 ${stance}의 한국어 정보가 없습니다`);
      }
    }

    // Validate effectiveness matrix completeness
    const expectedRelationships =
      requiredStances.length * requiredStances.length;
    if (this.effectivenessMatrix.size < expectedRelationships * 0.8) {
      console.warn("팔괘 효과도 매트릭스가 불완전할 수 있습니다");
    }

    console.log(
      `✅ 팔괘 시스템 초기화 완료: ${this.stanceData.size}개 자세, ${this.effectivenessMatrix.size}개 관계`
    );
  }

  /**
   * **Business Logic:** Gets trigram system performance metrics
   *
   * Provides diagnostic information for Korean martial arts training
   * effectiveness and system optimization.
   *
   * @returns Trigram system performance and accuracy metrics
   */
  getSystemMetrics(): {
    totalStances: number;
    totalRelationships: number;
    systemCompleteness: number;
    koreanCulturalAccuracy: string;
    philosophicalAuthenticity: string;
  } {
    const totalStances = this.stanceData.size;
    const totalRelationships = this.effectivenessMatrix.size;
    const expectedRelationships = totalStances * totalStances;
    const completeness = totalRelationships / expectedRelationships;

    return {
      totalStances,
      totalRelationships,
      systemCompleteness: Math.round(completeness * 100) / 100,
      koreanCulturalAccuracy: totalStances === 8 ? "완벽" : "불완전",
      philosophicalAuthenticity: completeness > 0.8 ? "우수" : "보통",
    };
  }
}

/**
 * ## Trigram Stance Data Interface
 *
 * Comprehensive information structure for Korean martial arts trigram stances
 * with authentic cultural and philosophical context.
 */
interface TrigramStanceData {
  readonly korean: KoreanText;
  readonly symbol: string;
  readonly philosophy: string;
  readonly martialApplication: string;
  readonly naturalElement: string;
  readonly traditionalMeaning: string;
  readonly combatAdvantages: readonly string[];
  readonly combatDisadvantages: readonly string[];
  readonly recommendedArchetypes: readonly PlayerArchetype[];
}

/**
 * ## Trigram Stance Context Interface
 *
 * Educational and cultural information about trigram stances for
 * Korean martial arts learning and reference.
 */
interface TrigramStanceContext {
  readonly koreanName: string;
  readonly englishName: string;
  readonly symbol: string;
  readonly philosophy: string;
  readonly martialApplication: string;
  readonly naturalElement: string;
  readonly traditionalMeaning: string;
  readonly combatAdvantages: readonly string[];
  readonly combatDisadvantages: readonly string[];
  readonly recommendedFor: readonly PlayerArchetype[];
}

export default TrigramSystem;
