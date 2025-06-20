import type { PlayerState } from "../../types/player";
import type { KoreanTechnique, TrainingCombatResult } from "../../types/combat";
import { CombatSystem } from "../CombatSystem";
import { TrigramStance, PlayerArchetype } from "../../types/enums";

/**
 * Training-specific combat system for Korean martial arts practice
 * Focuses on technique accuracy, form analysis, and educational feedback
 */
export class TrainingCombatSystem extends CombatSystem {
  private trainingDummy: PlayerState;
  private accuracyHistory: number[] = [];
  private techniqueAttempts: number = 0;
  private successfulTechniques: number = 0;

  constructor() {
    super();
    this.trainingDummy = this.createTrainingDummy();
  }

  /**
   * Create a training dummy with infinite health for practice
   */
  private createTrainingDummy(): PlayerState {
    return {
      id: "training_dummy",
      name: { korean: "훈련 더미", english: "Training Dummy" },
      archetype: PlayerArchetype.MUSA,
      health: 1000,
      maxHealth: 1000,
      ki: 1000,
      maxKi: 1000,
      stamina: 1000,
      maxStamina: 1000,
      energy: 1000,
      maxEnergy: 1000,
      attackPower: 50,
      defense: 100,
      speed: 30,
      technique: 50,
      pain: 0,
      consciousness: 100,
      balance: 100,
      momentum: 0,
      currentStance: TrigramStance.GAN, // Mountain stance - defensive
      combatState: "idle" as any,
      position: { x: 600, y: 400 },
      isBlocking: false,
      isStunned: false,
      isCountering: false,
      lastActionTime: 0,
      recoveryTime: 0,
      lastStanceChangeTime: 0,
      statusEffects: [],
      activeEffects: [],
      vitalPoints: [],
      totalDamageReceived: 0,
      totalDamageDealt: 0,
      hitsTaken: 0,
      hitsLanded: 0,
      perfectStrikes: 0,
      vitalPointHits: 0,
    };
  }

  /**
   * Execute a training technique with detailed analysis
   */
  executeTrainingTechnique(
    player: PlayerState,
    technique: KoreanTechnique,
    targetedVitalPointId?: string
  ): TrainingCombatResult {
    this.techniqueAttempts++;

    // Base combat resolution
    const baseResult = this.resolveAttack(
      player,
      this.trainingDummy,
      technique,
      targetedVitalPointId
    );

    // Calculate training-specific scores
    const accuracyScore = this.calculateAccuracyScore(player, technique);
    const techniqueScore = this.calculateTechniqueScore(player, technique);
    const formScore = this.calculateFormScore(player, technique);

    this.accuracyHistory.push(accuracyScore);
    if (this.accuracyHistory.length > 10) {
      this.accuracyHistory.shift(); // Keep last 10 attempts
    }

    if (baseResult.hit) {
      this.successfulTechniques++;
    }

    // Generate improvement feedback
    const improvementAreas = this.generateImprovementAreas(
      accuracyScore,
      techniqueScore,
      formScore
    );

    const nextTrainingGoals = this.generateTrainingGoals(
      player,
      technique,
      accuracyScore
    );

    return {
      ...baseResult,
      accuracyScore,
      techniqueScore,
      formScore,
      improvementAreas,
      nextTrainingGoals,
    };
  }

  /**
   * Calculate accuracy score based on stance, timing, and targeting
   */
  private calculateAccuracyScore(
    player: PlayerState,
    _technique: KoreanTechnique
  ): number {
    let score = 0.5; // Base score

    // Player technique skill
    score += (player.technique / 100) * 0.2;

    return Math.min(1.0, Math.max(0.0, score));
  }

  /**
   * Calculate technique execution score
   */
  private calculateTechniqueScore(
    player: PlayerState,
    _technique: KoreanTechnique
  ): number {
    let score = 0.6; // Base execution

    // Ki and stamina availability
    const kiRatio = player.ki / player.maxKi;
    const staminaRatio = player.stamina / player.maxStamina;

    score += kiRatio * 0.2;
    score += staminaRatio * 0.2;

    return Math.min(1.0, Math.max(0.0, score));
  }

  /**
   * Calculate form score based on balance and positioning
   */
  private calculateFormScore(
    _player: PlayerState,
    _technique: KoreanTechnique
  ): number {
    let score = 0.5; // Base form

    // For now, return base form score
    return Math.min(1.0, Math.max(0.0, score));
  }

  /**
   * Generate areas for improvement based on scores
   */
  private generateImprovementAreas(
    accuracy: number,
    technique: number,
    form: number
  ): string[] {
    const areas: string[] = [];

    if (accuracy < 0.7) {
      areas.push("targeting_precision");
    }
    if (technique < 0.7) {
      areas.push("technique_execution");
    }
    if (form < 0.7) {
      areas.push("stance_stability");
    }

    // Korean translations
    const koreanAreas = areas.map((area) => {
      switch (area) {
        case "targeting_precision":
          return "타겟팅 정확도 - Targeting Precision";
        case "technique_execution":
          return "기법 실행 - Technique Execution";
        case "stance_stability":
          return "자세 안정성 - Stance Stability";
        default:
          return area;
      }
    });

    return koreanAreas.length > 0
      ? koreanAreas
      : ["전반적 향상 - Overall Improvement"];
  }

  /**
   * Generate next training goals
   */
  private generateTrainingGoals(
    // Fix: Remove unused player parameter
    _player: PlayerState,
    technique: KoreanTechnique,
    accuracy: number
  ): string[] {
    const goals: string[] = [];

    if (accuracy > 0.8) {
      goals.push("고급 기법 연습 - Practice Advanced Techniques");
    } else if (accuracy > 0.6) {
      goals.push("연속 기법 연습 - Practice Combo Techniques");
    } else {
      goals.push("기본 자세 연습 - Practice Basic Stances");
    }

    // Add stance-specific goals
    const stanceGoals = this.getStanceSpecificGoals(technique.stance);
    goals.push(...stanceGoals);

    return goals.slice(0, 3); // Limit to 3 goals
  }

  /**
   * Get stance-specific training goals
   */
  private getStanceSpecificGoals(stance: TrigramStance): string[] {
    const stanceGoals: Record<TrigramStance, string[]> = {
      [TrigramStance.GEON]: [
        "천괘 직선 공격 마스터 - Master Heaven's Direct Attacks",
      ],
      [TrigramStance.TAE]: ["태괘 유동성 향상 - Improve Lake's Fluidity"],
      [TrigramStance.LI]: ["리괘 정확성 훈련 - Train Fire's Precision"],
      [TrigramStance.JIN]: ["진괘 폭발력 개발 - Develop Thunder's Power"],
      [TrigramStance.SON]: ["손괘 연속성 연습 - Practice Wind's Continuity"],
      [TrigramStance.GAM]: ["감괘 적응력 향상 - Improve Water's Adaptability"],
      [TrigramStance.GAN]: ["간괘 방어력 강화 - Strengthen Mountain's Defense"],
      [TrigramStance.GON]: ["곤괘 제압력 훈련 - Train Earth's Control"],
    };

    return stanceGoals[stance] || ["기본 자세 완성 - Perfect Basic Stance"];
  }

  /**
   * Get training statistics
   */
  getTrainingStats() {
    const overallAccuracy =
      this.accuracyHistory.length > 0
        ? this.accuracyHistory.reduce((a, b) => a + b, 0) /
          this.accuracyHistory.length
        : 0;

    const successRate =
      this.techniqueAttempts > 0
        ? this.successfulTechniques / this.techniqueAttempts
        : 0;

    return {
      totalAttempts: this.techniqueAttempts,
      successfulTechniques: this.successfulTechniques,
      successRate,
      overallAccuracy,
      recentAccuracy: this.accuracyHistory.slice(-5),
      improvementTrend: this.calculateImprovementTrend(),
    };
  }

  /**
   * Calculate improvement trend from recent accuracy scores
   */
  private calculateImprovementTrend(): "improving" | "stable" | "declining" {
    if (this.accuracyHistory.length < 5) return "stable";

    const recent = this.accuracyHistory.slice(-3);
    const earlier = this.accuracyHistory.slice(-6, -3);

    if (earlier.length === 0) return "stable";

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;

    const diff = recentAvg - earlierAvg;

    if (diff > 0.1) return "improving";
    if (diff < -0.1) return "declining";
    return "stable";
  }

  /**
   * Reset training session
   */
  resetTrainingSession() {
    this.accuracyHistory = [];
    this.techniqueAttempts = 0;
    this.successfulTechniques = 0;
    this.trainingDummy = this.createTrainingDummy();
  }

  /**
   * Fix: Add the missing resetTrainingDummy method that tests expect
   */
  resetTrainingDummy() {
    this.trainingDummy = this.createTrainingDummy();
  }

  /**
   * Get training dummy for display
   */
  getTrainingDummy(): PlayerState {
    return this.trainingDummy;
  }

  /**
   * Update training dummy health (for visual feedback)
   */
  updateTrainingDummy(updates: Partial<PlayerState>) {
    this.trainingDummy = {
      ...this.trainingDummy,
      ...updates,
      // Always keep high health for training
      health: Math.max(this.trainingDummy.health, 900),
    };
  }

  createTrainingPlayer(archetype: PlayerArchetype): PlayerState {
    const basePlayer = createPlayer("training_player", archetype);
    
    return {
      ...basePlayer,
      // Fix: Use combatStats instead of combatState
      combatStats: {
        ...basePlayer.combatStats,
        // Add any training-specific stats
      },
      // Add training-specific properties
      training: {
        sessions: 0,
        totalTime: 0,
        skillPoints: 0,
      },
    };
  }
}

export default TrainingCombatSystem;
