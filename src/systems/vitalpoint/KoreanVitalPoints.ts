/**
 * @fileoverview Korean Vital Points System (급소 체계)
 * @description Authentic Korean martial arts vital point targeting system
 */

import type {
  VitalPoint,
  VitalPointCategory,
  VitalPointSeverity,
} from "../../types/anatomy";
import type { KoreanText } from "../../types/korean-text";

/**
 * Complete Korean vital points database with authentic terminology
 */
export class KoreanVitalPoints {
  private readonly vitalPoints: Map<string, VitalPoint>;

  constructor() {
    this.vitalPoints = new Map();
    this.initializeVitalPoints();
  }

  private initializeVitalPoints(): void {
    // Head vital points (머리 급소)
    this.addVitalPoint({
      id: "baihui",
      name: {
        korean: "백회혈",
        english: "Crown Point",
        romanized: "baek-hoe-hyeol",
      },
      category: VitalPointCategory.HEAD,
      severity: VitalPointSeverity.CRITICAL,
      location: { x: 0.5, y: 0.05, z: 0.9 },
      effects: {
        damage: 95,
        stunning: 90,
        consciousness: 85,
        balance: 70,
      },
      description: {
        korean: "정수리 중앙의 치명적인 급소",
        english: "Critical point at the crown of the head",
      },
      medicalWarning:
        "뇌진탕 및 의식 상실 위험 - Risk of concussion and unconsciousness",
    });

    this.addVitalPoint({
      id: "yintang",
      name: {
        korean: "인당혈",
        english: "Third Eye",
        romanized: "in-dang-hyeol",
      },
      category: VitalPointCategory.HEAD,
      severity: VitalPointSeverity.HIGH,
      location: { x: 0.5, y: 0.15, z: 0.85 },
      effects: {
        damage: 75,
        stunning: 80,
        consciousness: 70,
        balance: 60,
      },
      description: {
        korean: "미간 중앙의 신경 급소",
        english: "Nerve point between the eyebrows",
      },
      medicalWarning: "시각 장애 및 뇌진탕 위험",
    });

    // Neck vital points (목 급소)
    this.addVitalPoint({
      id: "fengchi",
      name: {
        korean: "풍지혈",
        english: "Wind Pool",
        romanized: "pung-ji-hyeol",
      },
      category: VitalPointCategory.NECK,
      severity: VitalPointSeverity.CRITICAL,
      location: { x: 0.4, y: 0.25, z: 0.8 },
      effects: {
        damage: 90,
        stunning: 85,
        consciousness: 90,
        balance: 80,
      },
      description: {
        korean: "목 뒤쪽의 치명적인 압박점",
        english: "Critical pressure point at the back of the neck",
      },
      medicalWarning:
        "목뼈 손상 및 마비 위험 - Risk of spinal injury and paralysis",
    });

    // Torso vital points (몸통 급소)
    this.addVitalPoint({
      id: "tanzhong",
      name: {
        korean: "단중혈",
        english: "Chest Center",
        romanized: "dan-jung-hyeol",
      },
      category: VitalPointCategory.TORSO,
      severity: VitalPointSeverity.HIGH,
      location: { x: 0.5, y: 0.45, z: 0.9 },
      effects: {
        damage: 70,
        stunning: 60,
        consciousness: 50,
        balance: 40,
      },
      description: {
        korean: "가슴 중앙의 호흡 급소",
        english: "Breathing point at the center of the chest",
      },
      medicalWarning: "호흡 곤란 위험",
    });

    this.addVitalPoint({
      id: "qihai",
      name: {
        korean: "기해혈",
        english: "Sea of Ki",
        romanized: "gi-hae-hyeol",
      },
      category: VitalPointCategory.TORSO,
      severity: VitalPointSeverity.MEDIUM,
      location: { x: 0.5, y: 0.65, z: 0.85 },
      effects: {
        damage: 50,
        stunning: 40,
        consciousness: 30,
        balance: 60,
      },
      description: {
        korean: "하단전의 기력 급소",
        english: "Lower dantian Ki point",
      },
      medicalWarning: "내장 손상 위험",
    });

    // Add more vital points for arms, legs, etc.
    this.initializeArmVitalPoints();
    this.initializeLegVitalPoints();
  }

  private addVitalPoint(vitalPoint: VitalPoint): void {
    this.vitalPoints.set(vitalPoint.id, vitalPoint);
  }

  private initializeArmVitalPoints(): void {
    // Arm vital points (팔 급소)
    this.addVitalPoint({
      id: "quchi",
      name: {
        korean: "곡지혈",
        english: "Crooked Pond",
        romanized: "gok-ji-hyeol",
      },
      category: VitalPointCategory.ARMS,
      severity: VitalPointSeverity.MEDIUM,
      location: { x: 0.2, y: 0.4, z: 0.7 },
      effects: {
        damage: 40,
        stunning: 30,
        consciousness: 20,
        balance: 25,
      },
      description: {
        korean: "팔꿈치 바깥쪽 신경점",
        english: "Nerve point on the outer elbow",
      },
      medicalWarning: "팔 마비 위험",
    });
  }

  private initializeLegVitalPoints(): void {
    // Leg vital points (다리 급소)
    this.addVitalPoint({
      id: "zusanli",
      name: {
        korean: "족삼리혈",
        english: "Leg Three Miles",
        romanized: "jok-sam-ri-hyeol",
      },
      category: VitalPointCategory.LEGS,
      severity: VitalPointSeverity.MEDIUM,
      location: { x: 0.15, y: 0.8, z: 0.6 },
      effects: {
        damage: 35,
        stunning: 25,
        consciousness: 15,
        balance: 70,
      },
      description: {
        korean: "무릎 아래 정강이 급소",
        english: "Shin point below the knee",
      },
      medicalWarning: "다리 마비 위험",
    });
  }

  /**
   * Get vital point by ID
   */
  public getVitalPoint(id: string): VitalPoint | undefined {
    return this.vitalPoints.get(id);
  }

  /**
   * Get all vital points by category
   */
  public getVitalPointsByCategory(category: VitalPointCategory): VitalPoint[] {
    return Array.from(this.vitalPoints.values()).filter(
      (point) => point.category === category
    );
  }

  /**
   * Get vital points by severity level
   */
  public getVitalPointsBySeverity(severity: VitalPointSeverity): VitalPoint[] {
    return Array.from(this.vitalPoints.values()).filter(
      (point) => point.severity === severity
    );
  }

  /**
   * Find nearest vital point to target coordinates
   */
  public findNearestVitalPoint(
    targetX: number,
    targetY: number,
    targetZ: number = 0.5,
    maxDistance: number = 0.1
  ): VitalPoint | null {
    let nearest: VitalPoint | null = null;
    let minDistance = maxDistance;

    for (const vitalPoint of this.vitalPoints.values()) {
      const distance = Math.sqrt(
        Math.pow(vitalPoint.location.x - targetX, 2) +
          Math.pow(vitalPoint.location.y - targetY, 2) +
          Math.pow(vitalPoint.location.z - targetZ, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearest = vitalPoint;
      }
    }

    return nearest;
  }

  /**
   * Calculate damage based on vital point hit
   */
  public calculateVitalPointDamage(
    vitalPoint: VitalPoint,
    baseDamage: number,
    accuracy: number
  ): {
    totalDamage: number;
    stunChance: number;
    consciousnessLoss: number;
    balanceLoss: number;
    isCritical: boolean;
  } {
    const accuracyMultiplier = accuracy;
    const severityMultiplier = {
      [VitalPointSeverity.LOW]: 1.1,
      [VitalPointSeverity.MEDIUM]: 1.3,
      [VitalPointSeverity.HIGH]: 1.6,
      [VitalPointSeverity.CRITICAL]: 2.0,
    }[vitalPoint.severity];

    const effectiveMultiplier = accuracyMultiplier * severityMultiplier;
    const totalDamage = Math.round(baseDamage * effectiveMultiplier);
    const isCritical =
      vitalPoint.severity === VitalPointSeverity.CRITICAL && accuracy > 0.8;

    return {
      totalDamage,
      stunChance: (vitalPoint.effects.stunning * accuracyMultiplier) / 100,
      consciousnessLoss:
        (vitalPoint.effects.consciousness * accuracyMultiplier) / 100,
      balanceLoss: (vitalPoint.effects.balance * accuracyMultiplier) / 100,
      isCritical,
    };
  }

  /**
   * Get all vital points (for display/reference)
   */
  public getAllVitalPoints(): VitalPoint[] {
    return Array.from(this.vitalPoints.values());
  }

  /**
   * Get vital point count by category
   */
  public getVitalPointCount(): Record<VitalPointCategory, number> {
    const counts = {
      [VitalPointCategory.HEAD]: 0,
      [VitalPointCategory.NECK]: 0,
      [VitalPointCategory.TORSO]: 0,
      [VitalPointCategory.ARMS]: 0,
      [VitalPointCategory.LEGS]: 0,
    };

    for (const vitalPoint of this.vitalPoints.values()) {
      counts[vitalPoint.category]++;
    }

    return counts;
  }
}

export default KoreanVitalPoints;
