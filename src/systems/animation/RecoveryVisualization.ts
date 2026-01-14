/**
 * Recovery Phase Visualization Utilities
 * 
 * Provides helper functions to visualize and debug recovery phases during development.
 * Useful for tuning recovery timing and muscle tension curves.
 * 
 * @module systems/animation/RecoveryVisualization
 * @category Animation System
 * @korean 복귀시각화
 */

import type { SkeletalAnimation } from "../../types/skeletal";
import {
  calculateMuscleTension,
  validateRecoveryPhase,
  type RecoveryPhaseConfig,
} from "./RecoveryPhaseEnhancer";

/**
 * Chart symbols for ASCII visualization
 */
const CHART_SYMBOLS = {
  RECOVERY: '●',
  EXECUTION: '○',
} as const;

/**
 * Recovery phase timeline point for visualization
 * 
 * **Korean**: 복귀 타임라인 포인트
 * 
 * @korean 복귀타임라인포인트
 */
export interface RecoveryTimelinePoint {
  /** Time in animation (seconds) */
  readonly time: number;
  /** Muscle tension at this time (0-1) */
  readonly tension: number;
  /** Phase name for labeling */
  readonly phase: string;
  /** Phase name in Korean */
  readonly phaseKorean: string;
}

/**
 * Recovery phase visualization data
 * 
 * **Korean**: 복귀 시각화 데이터
 * 
 * @korean 복귀시각화데이터
 */
export interface RecoveryVisualization {
  /** Animation name */
  readonly name: string;
  /** Korean name */
  readonly koreanName: string;
  /** Timeline points for plotting */
  readonly timeline: RecoveryTimelinePoint[];
  /** Validation result */
  readonly validation: ReturnType<typeof validateRecoveryPhase>;
  /** Recovery start time */
  readonly recoveryStartTime: number;
  /** Recovery end time */
  readonly recoveryEndTime: number;
}

/**
 * Generate visualization data for recovery phase
 * 
 * **Korean**: 복귀 단계 시각화 데이터 생성
 * 
 * Creates timeline data suitable for plotting muscle tension curves.
 * Samples tension at regular intervals for smooth visualization.
 * 
 * @param animation - Animation with recovery phase
 * @param config - Recovery configuration used
 * @param sampleRate - Samples per second (default: 60 for 60fps)
 * @returns Visualization data
 * 
 * @example
 * ```typescript
 * import { generateRecoveryVisualization } from './RecoveryVisualization';
 * 
 * const viz = generateRecoveryVisualization(JAB_ANIMATION_ENHANCED);
 * console.log('Recovery phase analysis:');
 * viz.timeline.forEach(point => {
 *   console.log(`${point.time.toFixed(3)}s: ${point.phase} - Tension: ${point.tension.toFixed(2)}`);
 * });
 * ```
 * 
 * @korean 복귀시각화생성
 */
export function generateRecoveryVisualization(
  animation: SkeletalAnimation,
  config: RecoveryPhaseConfig = {},
  sampleRate: number = 60
): RecoveryVisualization {
  const validation = validateRecoveryPhase(animation);
  
  // Determine recovery phase boundaries
  const recoveryEndTime = animation.keyframes[animation.keyframes.length - 1].time;
  const recoveryStartTime = animation.keyframes.length >= 3
    ? animation.keyframes[animation.keyframes.length - 3].time
    : animation.keyframes[animation.keyframes.length - 2].time;

  // Sample tension at regular intervals
  const timeline: RecoveryTimelinePoint[] = [];
  const sampleInterval = 1 / sampleRate;
  
  for (let t = 0; t <= animation.duration; t += sampleInterval) {
    const tension = calculateMuscleTension(animation, t, config);
    
    // Determine phase
    let phase: string;
    let phaseKorean: string;
    
    if (t < recoveryStartTime) {
      phase = "Technique Execution";
      phaseKorean = "기술 실행";
    } else if (t < recoveryStartTime + (recoveryEndTime - recoveryStartTime) * 0.6) {
      phase = "Intermediate Recovery";
      phaseKorean = "중간 복귀";
    } else if (t < recoveryEndTime) {
      phase = "Final Recovery";
      phaseKorean = "최종 복귀";
    } else {
      phase = "Complete";
      phaseKorean = "완료";
    }
    
    timeline.push({
      time: t,
      tension,
      phase,
      phaseKorean,
    });
  }

  return {
    name: animation.name,
    koreanName: animation.koreanName,
    timeline,
    validation,
    recoveryStartTime,
    recoveryEndTime,
  };
}

/**
 * Format recovery visualization as console output
 * 
 * **Korean**: 복귀 시각화 콘솔 출력
 * 
 * Prints a formatted analysis of the recovery phase to console.
 * Useful for debugging and development.
 * 
 * @param viz - Visualization data
 * 
 * @example
 * ```typescript
 * const viz = generateRecoveryVisualization(JAB_ANIMATION_ENHANCED);
 * printRecoveryAnalysis(viz);
 * ```
 * 
 * @korean 복귀분석출력
 */
export function printRecoveryAnalysis(viz: RecoveryVisualization): void {
  console.log('\n' + '='.repeat(70));
  console.log(`Recovery Phase Analysis: ${viz.name} (${viz.koreanName})`);
  console.log('='.repeat(70));
  
  console.log('\n📊 Validation:');
  console.log(`  Valid: ${viz.validation.isValid ? '✅' : '❌'}`);
  console.log(`  Recovery Duration: ${viz.validation.recoveryDuration.toFixed(1)}ms`);
  console.log(`  Recovery Keyframes: ${viz.validation.recoveryKeyframes}`);
  
  if (viz.validation.issues.length > 0) {
    console.log('\n⚠️  Issues:');
    viz.validation.issues.forEach(issue => {
      console.log(`  - ${issue}`);
    });
  }
  
  console.log('\n📈 Recovery Timeline:');
  console.log(`  Recovery Start: ${viz.recoveryStartTime.toFixed(3)}s`);
  console.log(`  Recovery End: ${viz.recoveryEndTime.toFixed(3)}s`);
  console.log(`  Duration: ${((viz.recoveryEndTime - viz.recoveryStartTime) * 1000).toFixed(1)}ms`);
  
  console.log('\n🔍 Key Tension Points:');
  
  // Find peak tension
  const peakPoint = viz.timeline.reduce((max, point) => 
    point.tension > max.tension ? point : max
  );
  console.log(`  Peak: ${peakPoint.tension.toFixed(2)} at ${peakPoint.time.toFixed(3)}s`);
  
  // Find tension at recovery start
  const recoveryStartPoint = viz.timeline.find(p => 
    Math.abs(p.time - viz.recoveryStartTime) < 0.01
  );
  if (recoveryStartPoint) {
    console.log(`  Recovery Start: ${recoveryStartPoint.tension.toFixed(2)} at ${recoveryStartPoint.time.toFixed(3)}s`);
  }
  
  // Find tension at intermediate recovery
  const intermediateTime = viz.recoveryStartTime + (viz.recoveryEndTime - viz.recoveryStartTime) * 0.6;
  const intermediatePoint = viz.timeline.find(p => 
    Math.abs(p.time - intermediateTime) < 0.01
  );
  if (intermediatePoint) {
    console.log(`  Intermediate: ${intermediatePoint.tension.toFixed(2)} at ${intermediatePoint.time.toFixed(3)}s`);
  }
  
  // Find final tension
  const finalPoint = viz.timeline[viz.timeline.length - 1];
  console.log(`  Final: ${finalPoint.tension.toFixed(2)} at ${finalPoint.time.toFixed(3)}s`);
  
  console.log('\n' + '='.repeat(70) + '\n');
}

/**
 * Generate ASCII art visualization of tension curve
 * 
 * **Korean**: 근육 긴장도 곡선 ASCII 시각화
 * 
 * Creates a simple ASCII chart of muscle tension over time.
 * 
 * @param viz - Visualization data
 * @param width - Chart width in characters (default: 60)
 * @param height - Chart height in characters (default: 10)
 * 
 * @example
 * ```typescript
 * const viz = generateRecoveryVisualization(JAB_ANIMATION_ENHANCED);
 * const chart = generateTensionChart(viz);
 * console.log(chart);
 * ```
 * 
 * @korean 긴장도차트생성
 */
export function generateTensionChart(
  viz: RecoveryVisualization,
  width: number = 60,
  height: number = 10
): string {
  const lines: string[] = [];
  
  // Header
  lines.push(`Muscle Tension: ${viz.name} (${viz.koreanName})`);
  lines.push('─'.repeat(width));
  
  // Sample points to fit width
  const step = Math.max(1, Math.floor(viz.timeline.length / width));
  const sampledPoints = viz.timeline.filter((_, i) => i % step === 0);
  
  // Create chart rows (top to bottom = high to low tension)
  for (let row = height; row >= 0; row--) {
    const threshold = row / height;
    let line = '';
    
    // Y-axis label
    if (row === height) line += '1.0│';
    else if (row === height / 2) line += '0.5│';
    else if (row === 0) line += '0.0│';
    else line += '   │';
    
    // Plot points
    for (const point of sampledPoints) {
      if (Math.abs(point.tension - threshold) < (1 / height)) {
        // Mark recovery phases
        if (point.time >= viz.recoveryStartTime && point.time < viz.recoveryEndTime) {
          line += CHART_SYMBOLS.RECOVERY; // Recovery phase
        } else {
          line += CHART_SYMBOLS.EXECUTION; // Execution phase
        }
      } else {
        line += ' ';
      }
    }
    
    lines.push(line);
  }
  
  // X-axis
  lines.push('   └' + '─'.repeat(width - 1));
  lines.push(`    0s${' '.repeat(width - 10)}${viz.timeline[viz.timeline.length - 1].time.toFixed(2)}s`);
  
  // Legend
  lines.push('');
  lines.push(`Legend: ${CHART_SYMBOLS.EXECUTION} Execution  ${CHART_SYMBOLS.RECOVERY} Recovery Phase`);
  
  return lines.join('\n');
}

/**
 * Compare multiple recovery phases side-by-side
 * 
 * **Korean**: 복귀 단계 비교
 * 
 * Generates a comparison table of multiple animations' recovery characteristics.
 * 
 * @param animations - Map of animation name to animation
 * @param config - Recovery configuration used
 * @returns Formatted comparison table
 * 
 * @example
 * ```typescript
 * const comparison = compareRecoveryPhases({
 *   'Jab': JAB_ANIMATION_ENHANCED,
 *   'Cross': CROSS_ANIMATION_ENHANCED,
 *   'Elbow': ELBOW_STRIKE_ANIMATION_ENHANCED,
 * });
 * console.log(comparison);
 * ```
 * 
 * @korean 복귀비교
 */
export function compareRecoveryPhases(
  animations: Record<string, SkeletalAnimation>,
  config: RecoveryPhaseConfig = {}
): string {
  const lines: string[] = [];
  
  lines.push('\n' + '='.repeat(80));
  lines.push('Recovery Phase Comparison (복귀 단계 비교)');
  lines.push('='.repeat(80));
  
  // Header
  lines.push('');
  lines.push('Animation         Korean Name       Duration  Recovery  Valid  Peak→Intermediate→Final');
  lines.push('─'.repeat(80));
  
  // Compare each animation
  for (const [name, animation] of Object.entries(animations)) {
    const viz = generateRecoveryVisualization(animation, config);
    
    const peakTension = Math.max(...viz.timeline.map(p => p.tension));
    const intermediateTension = viz.timeline.find(p => 
      Math.abs(p.time - (viz.recoveryStartTime + (viz.recoveryEndTime - viz.recoveryStartTime) * 0.6)) < 0.01
    )?.tension || 0;
    const finalTension = viz.timeline[viz.timeline.length - 1].tension;
    
    const line = [
      name.padEnd(17),
      animation.koreanName.padEnd(17),
      `${(animation.duration * 1000).toFixed(0)}ms`.padEnd(9),
      `${viz.validation.recoveryDuration.toFixed(0)}ms`.padEnd(9),
      viz.validation.isValid ? '✅' : '❌',
      `    ${peakTension.toFixed(2)} → ${intermediateTension.toFixed(2)} → ${finalTension.toFixed(2)}`,
    ].join(' ');
    
    lines.push(line);
  }
  
  lines.push('='.repeat(80) + '\n');
  
  return lines.join('\n');
}
