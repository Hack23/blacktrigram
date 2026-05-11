/**
 * CombatParticleEffects3D - Particle effects coordinator for combat
 * 전투 입자 효과 통합 관리
 *
 * Maps HitEffect events to advanced particle effects:
 * - BloodViscosity3D for blood physics on hits
 * - InternalDamage3D for organ damage visualization on vital point strikes
 * - ParticleAudio3D for synchronized combat audio
 *
 * @module components/effects
 * @category Combat Effects
 * @korean 전투입자효과
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { HitEffect } from "../../../../../systems";
import { HitEffectType } from "../../../../../systems/effects";
import {
  BloodViscosity3D,
  type BloodViscosityEffect,
  type ViscosityType,
} from "./BloodViscosity3D";
import {
  InternalDamage3D,
  type InternalDamageEffect,
  type OrganType,
  type PenetrationDepth,
} from "./InternalDamage3D";
import {
  ParticleAudio3D,
  type ParticleAudioTrigger,
  type ParticleEffectType,
} from "./ParticleAudio3D";

/**
 * Props for CombatParticleEffects3D
 */
export interface CombatParticleEffects3DProps {
  /** Active hit effects from the combat state */
  readonly hitEffects: readonly HitEffect[];
  /** Whether effects are enabled */
  readonly enabled?: boolean;
  /** Mobile optimization flag */
  readonly isMobile?: boolean;
}

/**
 * Map HitEffectType → blood viscosity type
 * 타격 유형 → 혈액 점도 매핑
 */
function getViscosityForHitType(type: HitEffectType): ViscosityType | null {
  switch (type) {
    case HitEffectType.HIT:
      return "thin";
    case HitEffectType.COUNTER:
      return "medium";
    case HitEffectType.CRITICAL_HIT:
      return "thick";
    case HitEffectType.VITAL_POINT_STRIKE:
      return "gout";
    default:
      return null;
  }
}

/**
 * Map HitEffectType → organ type based on strike position
 * 급소 유형 → 장기 매핑 (타격 위치 기반)
 */
function getOrganForPosition(
  position: { x: number; y: number } | undefined,
): OrganType {
  if (!position) return "stomach";
  const y = position.y;
  if (y > 1.4) return "heart"; // 심장 - upper chest
  if (y > 1.1) return "stomach"; // 명치 - solar plexus
  if (y > 0.8) return "liver"; // 간 - right side mid-torso
  if (y > 0.5) return "spleen"; // 비장 - left side mid-torso
  return "kidney"; // 신장 - lower back
}

/**
 * Map HitEffect intensity → penetration depth
 * 타격 강도 → 관통 깊이 매핑
 */
function getPenetrationDepth(intensity: number): PenetrationDepth {
  if (intensity >= 1.5) return "critical";
  if (intensity >= 1.0) return "deep";
  if (intensity >= 0.5) return "shallow";
  return "surface";
}

/**
 * Map HitEffectType → audio effect type
 * 타격 유형 → 오디오 효과 매핑
 */
function getAudioEffectType(type: HitEffectType): ParticleEffectType | null {
  switch (type) {
    case HitEffectType.HIT:
    case HitEffectType.COUNTER:
      return "viscosity";
    case HitEffectType.CRITICAL_HIT:
      return "bone";
    case HitEffectType.VITAL_POINT_STRIKE:
      return "organ";
    case HitEffectType.BLOCK:
    case HitEffectType.PARRY:
      return "bone";
    default:
      return null;
  }
}

/** Maximum concurrent effects to prevent performance issues */
const MAX_BLOOD_EFFECTS = 8;
const MAX_ORGAN_EFFECTS = 4;

/**
 * Simple deterministic hash from string → [0, 1)
 * Used for deterministic direction calculations inside useMemo
 */
function hashToFloat(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash % 10000) / 10000;
}

/**
 * CombatParticleEffects3D - Coordinates particle effects for combat
 *
 * Converts HitEffect events into:
 * - Blood viscosity particles (thin/medium/thick/gout based on strike type)
 * - Internal organ damage pulses (for vital point strikes)
 * - Synchronized audio triggers
 *
 * @korean 전투 입자 효과 통합 (타격→혈액물리+장기손상+오디오)
 */
export const CombatParticleEffects3D: React.FC<
  CombatParticleEffects3DProps
> = ({ hitEffects, enabled = true, isMobile = false }) => {
  const processedIds = useRef<Set<string>>(new Set());

  const [bloodEffects, setBloodEffects] = useState<BloodViscosityEffect[]>([]);
  const [organEffects, setOrganEffects] = useState<InternalDamageEffect[]>([]);
  const [audioTriggers, setAudioTriggers] = useState<ParticleAudioTrigger[]>(
    [],
  );

  useEffect(() => {
    const newBlood: BloodViscosityEffect[] = [];
    const newOrgan: InternalDamageEffect[] = [];
    const newAudio: ParticleAudioTrigger[] = [];

    for (const hit of hitEffects) {
      if (processedIds.current.has(hit.id)) continue;
      processedIds.current.add(hit.id);

      const pos: [number, number, number] = [
        hit.position?.x ?? 0,
        hit.position?.y ?? 1.0,
        0,
      ];

      const viscosity = getViscosityForHitType(hit.type);
      if (viscosity) {
        const angle = hashToFloat(hit.id) * Math.PI * 2;
        const ySpread = 0.3 + hashToFloat(hit.id + "_y") * 0.4;
        const dir: [number, number, number] = [
          Math.cos(angle) * 0.5,
          ySpread,
          Math.sin(angle) * 0.5,
        ];

        newBlood.push({
          id: `blood_${hit.id}`,
          position: pos,
          direction: dir,
          viscosityType: viscosity,
          intensity: Math.min(1, hit.intensity),
          startTime: hit.startTime,
        });
      }

      if (hit.type === HitEffectType.VITAL_POINT_STRIKE) {
        newOrgan.push({
          id: `organ_${hit.id}`,
          position: pos,
          organType: getOrganForPosition(hit.position),
          penetrationDepth: getPenetrationDepth(hit.intensity),
          startTime: hit.startTime,
        });
      }

      const audioType = getAudioEffectType(hit.type);
      if (audioType) {
        newAudio.push({
          effectType: audioType,
          intensity: Math.min(1, hit.intensity),
          timestamp: hit.timestamp,
        });
      }
    }

    if (newBlood.length > 0) {
      setBloodEffects((prev) =>
        [...prev, ...newBlood].slice(-MAX_BLOOD_EFFECTS),
      );
    }
    if (newOrgan.length > 0) {
      setOrganEffects((prev) =>
        [...prev, ...newOrgan].slice(-MAX_ORGAN_EFFECTS),
      );
    }
    if (newAudio.length > 0) {
      setAudioTriggers((prev) => [...prev, ...newAudio]);
    }

    if (processedIds.current.size > 500) {
      const arr = Array.from(processedIds.current);
      processedIds.current = new Set(arr.slice(-250));
    }
  }, [hitEffects]);

  const handleBloodComplete = useCallback((id: string) => {
    setBloodEffects((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleOrganComplete = useCallback((id: string) => {
    setOrganEffects((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleAudioProcessed = useCallback((timestamp: number) => {
    setAudioTriggers((prev) => prev.filter((t) => t.timestamp !== timestamp));
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Blood Viscosity Particles - 혈액 점도 입자 */}
      <BloodViscosity3D
        effects={bloodEffects}
        enabled={enabled}
        isMobile={isMobile}
        onEffectComplete={handleBloodComplete}
      />

      {/* Internal Organ Damage Pulses - 장기 손상 시각화 */}
      <InternalDamage3D
        effects={organEffects}
        enabled={enabled}
        isMobile={isMobile}
        onEffectComplete={handleOrganComplete}
      />

      {/* Audio Coordination - 입자 효과 오디오 동기화 */}
      <ParticleAudio3D
        triggers={audioTriggers}
        enabled={enabled}
        onTriggerProcessed={handleAudioProcessed}
      />
    </>
  );
};
