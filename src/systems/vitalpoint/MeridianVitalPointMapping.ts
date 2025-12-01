/**
 * Meridian-Vital Point Mapping System (경락-급소 매핑)
 * 
 * Maps all vital points to their corresponding primary meridians based on
 * Traditional Korean Medicine (TKM) and Traditional Chinese Medicine (TCM) theory.
 * 
 * **Korean**: 경락-급소 연결 시스템
 * 
 * Each vital point can be associated with 1-2 primary meridians based on:
 * - Anatomical location along meridian pathways
 * - Traditional acupuncture point (혈자리) theory
 * - Korean martial arts vital point (급소) knowledge
 * 
 * @module systems/vitalpoint/MeridianVitalPointMapping
 * @category Meridian System
 * @korean 경락급소매핑
 */

/**
 * Mapping of vital point IDs to their primary meridian IDs
 * 
 * **Korean**: 급소별 주요 경락 매핑
 * 
 * Format: { vitalPointId: [primaryMeridian, secondaryMeridian?] }
 * 
 * Meridian IDs:
 * - lung (수태음폐경)
 * - large_intestine (수양명대장경)
 * - stomach (족양명위경)
 * - spleen (족태음비경)
 * - heart (수소음심경)
 * - small_intestine (수태양소장경)
 * - bladder (족태양방광경)
 * - kidney (족소음신경)
 * - pericardium (수궐음심포경)
 * - triple_burner (수소양삼초경)
 * - gallbladder (족소양담경)
 * - liver (족궐음간경)
 */
export const VITAL_POINT_MERIDIAN_MAP: Record<string, readonly string[]> = {
  // ============= HEAD REGION (12+ points) =============
  // Temple area - Gallbladder and Triple Burner meridians
  head_temple: ["gallbladder", "triple_burner"], // GB-8 area
  head_jaw: ["stomach", "large_intestine"], // ST-6, LI-18 area
  head_nose: ["large_intestine", "stomach"], // LI-20 area
  head_eye: ["bladder", "gallbladder"], // BL-1, GB-1 area
  head_ear: ["triple_burner", "gallbladder"], // TB-17, GB-2 area
  head_back_skull: ["bladder"], // BL-10 area
  head_crown: ["governing_vessel"], // GV-20 (Baihui - 백회)
  head_side_neck: ["gallbladder", "triple_burner"], // GB-20 (Fengchi - 풍지)
  head_throat_front: ["conception_vessel", "stomach"], // CV-23, ST-9 area
  head_chin: ["conception_vessel", "stomach"], // CV-24 area
  head_forehead: ["gallbladder", "bladder"], // GB-14, BL-2 area
  head_mastoid: ["triple_burner", "gallbladder"], // TB-17 area

  // ============= NECK REGION =============
  neck_front: ["stomach", "conception_vessel"], // ST-9 area (Carotid)
  neck_side: ["gallbladder", "triple_burner"], // GB-20 area
  neck_back: ["bladder", "governing_vessel"], // BL-10, GV-14 area
  throat: ["conception_vessel", "stomach"], // CV-22 area
  neck_carotid_left: ["stomach"], // ST-9 (Renying - 인영)
  neck_carotid_right: ["stomach"], // ST-9 (Renying - 인영)

  // ============= TORSO REGION (24+ points) =============
  // Upper Chest
  chest_center: ["conception_vessel", "pericardium"], // CV-17 (Danzhong - 단중)
  chest_upper_left: ["lung", "heart"], // LU-1 area
  chest_upper_right: ["lung"], // LU-1 area
  clavicle_left: ["lung", "stomach"], // LU-1, ST-12 area
  clavicle_right: ["lung", "stomach"], // LU-1, ST-12 area
  
  // Solar Plexus and Abdomen
  solar_plexus: ["conception_vessel", "stomach"], // CV-12, CV-14 area
  upper_abdomen_center: ["conception_vessel", "stomach"], // CV-12 (Zhongwan - 중완)
  upper_abdomen_left: ["stomach", "spleen"], // ST-19 area
  upper_abdomen_right: ["stomach", "liver"], // ST-19, LV-13 area
  lower_abdomen_center: ["conception_vessel", "stomach"], // CV-6, CV-4 area
  lower_abdomen_left: ["spleen", "kidney"], // SP-15 area
  lower_abdomen_right: ["stomach", "kidney"], // ST-25 area

  // Ribs and Sides
  ribs_floating_left: ["liver", "gallbladder"], // LV-13, GB-24 area
  ribs_floating_right: ["liver", "gallbladder"], // LV-13, GB-24 area
  ribs_lower: ["liver", "spleen"], // LV-13, SP-16 area
  ribs_side_left: ["gallbladder", "liver"], // GB-24 area
  ribs_side_right: ["gallbladder", "liver"], // GB-24 area

  // Internal Organs (theoretical vital points)
  heart: ["heart", "pericardium"], // Direct organ
  lungs: ["lung"], // Direct organ
  liver: ["liver", "gallbladder"], // Direct organ
  spleen: ["spleen"], // Direct organ
  kidneys: ["kidney", "bladder"], // Direct organ
  stomach: ["stomach", "spleen"], // Direct organ

  // Back and Spine
  spine_upper: ["bladder", "governing_vessel"], // BL-12, GV-12 area
  spine_middle: ["bladder", "governing_vessel"], // BL-18, GV-6 area
  spine_lower: ["bladder", "governing_vessel"], // BL-23, GV-4 area (Mingmen - 명문)
  lower_back: ["kidney", "bladder"], // KI-27, BL-23 area
  shoulder_blade_left: ["small_intestine", "triple_burner"], // SI-11 area
  shoulder_blade_right: ["small_intestine", "triple_burner"], // SI-11 area

  // ============= UPPER LIMBS (17+ points per side) =============
  // Shoulder
  shoulder_top_left: ["large_intestine", "gallbladder"], // LI-15, GB-21 area
  shoulder_top_right: ["large_intestine", "gallbladder"], // LI-15, GB-21 area
  shoulder_front_left: ["large_intestine", "lung"], // LI-15, LU-2 area
  shoulder_front_right: ["large_intestine", "lung"], // LI-15, LU-2 area
  shoulder_back_left: ["small_intestine", "triple_burner"], // SI-9, TB-14 area
  shoulder_back_right: ["small_intestine", "triple_burner"], // SI-9, TB-14 area

  // Arm
  upper_arm_outer_left: ["large_intestine", "triple_burner"], // LI-14, TB-13 area
  upper_arm_outer_right: ["large_intestine", "triple_burner"], // LI-14, TB-13 area
  upper_arm_inner_left: ["lung", "pericardium"], // LU-3, PC-3 area
  upper_arm_inner_right: ["lung", "pericardium"], // LU-3, PC-3 area

  // Elbow
  elbow_outer_left: ["large_intestine", "triple_burner"], // LI-11, TB-10 area
  elbow_outer_right: ["large_intestine", "triple_burner"], // LI-11, TB-10 area
  elbow_inner_left: ["heart", "pericardium"], // HE-3, PC-3 area
  elbow_inner_right: ["heart", "pericardium"], // HE-3, PC-3 area

  // Forearm
  forearm_outer_left: ["large_intestine", "triple_burner"], // LI-10, TB-6 area
  forearm_outer_right: ["large_intestine", "triple_burner"], // LI-10, TB-6 area
  forearm_inner_left: ["lung", "pericardium"], // LU-8, PC-6 area
  forearm_inner_right: ["lung", "pericardium"], // LU-8, PC-6 area

  // Wrist
  wrist_outer_left: ["large_intestine", "triple_burner"], // LI-5, TB-4 area
  wrist_outer_right: ["large_intestine", "triple_burner"], // LI-5, TB-4 area
  wrist_inner_left: ["lung", "pericardium"], // LU-9, PC-7 area
  wrist_inner_right: ["lung", "pericardium"], // LU-9, PC-7 area

  // Hand
  hand_back_left: ["large_intestine", "triple_burner"], // LI-4 (Hegu - 합곡)
  hand_back_right: ["large_intestine", "triple_burner"], // LI-4 (Hegu - 합곡)
  hand_palm_left: ["pericardium", "heart"], // PC-8, HE-8 area
  hand_palm_right: ["pericardium", "heart"], // PC-8, HE-8 area
  
  // ============= LOWER LIMBS (17+ points per side) =============
  // Hip and Groin
  hip_outer_left: ["gallbladder"], // GB-29, GB-30 area
  hip_outer_right: ["gallbladder"], // GB-29, GB-30 area
  hip_inner_left: ["liver", "spleen"], // LV-12, SP-12 area
  hip_inner_right: ["liver", "spleen"], // LV-12, SP-12 area
  groin_left: ["liver", "spleen"], // LV-11, SP-12 area
  groin_right: ["liver", "spleen"], // LV-11, SP-12 area

  // Thigh
  thigh_front_left: ["stomach"], // ST-32, ST-34 area
  thigh_front_right: ["stomach"], // ST-32, ST-34 area
  thigh_inner_left: ["liver", "spleen"], // LV-10, SP-10 area
  thigh_inner_right: ["liver", "spleen"], // LV-10, SP-10 area
  thigh_outer_left: ["gallbladder"], // GB-31, GB-33 area
  thigh_outer_right: ["gallbladder"], // GB-31, GB-33 area
  thigh_back_left: ["bladder"], // BL-36, BL-37 area
  thigh_back_right: ["bladder"], // BL-36, BL-37 area

  // Knee
  knee_front_left: ["stomach"], // ST-35 area (Dubi - 독비)
  knee_front_right: ["stomach"], // ST-35 area (Dubi - 독비)
  knee_inner_left: ["spleen", "liver"], // SP-9, LV-8 area
  knee_inner_right: ["spleen", "liver"], // SP-9, LV-8 area
  knee_outer_left: ["gallbladder"], // GB-34 (Yanglingquan - 양릉천)
  knee_outer_right: ["gallbladder"], // GB-34 (Yanglingquan - 양릉천)
  knee_back_left: ["bladder"], // BL-40 (Weizhong - 위중)
  knee_back_right: ["bladder"], // BL-40 (Weizhong - 위중)

  // Lower Leg
  shin_front_left: ["stomach"], // ST-36 (Zusanli - 족삼리), ST-37 area
  shin_front_right: ["stomach"], // ST-36 (Zusanli - 족삼리), ST-37 area
  shin_inner_left: ["spleen", "liver"], // SP-6 (Sanyinjiao - 삼음교)
  shin_inner_right: ["spleen", "liver"], // SP-6 (Sanyinjiao - 삼음교)
  calf_outer_left: ["gallbladder"], // GB-37, GB-39 area
  calf_outer_right: ["gallbladder"], // GB-37, GB-39 area
  calf_back_left: ["bladder"], // BL-57, BL-60 area
  calf_back_right: ["bladder"], // BL-57, BL-60 area

  // Ankle
  ankle_outer_left: ["gallbladder", "bladder"], // GB-40, BL-60 area
  ankle_outer_right: ["gallbladder", "bladder"], // GB-40, BL-60 area
  ankle_inner_left: ["spleen", "kidney"], // SP-5, KI-3 area
  ankle_inner_right: ["spleen", "kidney"], // SP-5, KI-3 area

  // Foot
  foot_top_left: ["stomach", "liver"], // ST-41, LV-3 area
  foot_top_right: ["stomach", "liver"], // ST-41, LV-3 area
  foot_sole_left: ["kidney"], // KI-1 (Yongquan - 용천)
  foot_sole_right: ["kidney"], // KI-1 (Yongquan - 용천)
  foot_heel_left: ["kidney", "bladder"], // KI-3 area
  foot_heel_right: ["kidney", "bladder"], // KI-3 area
};

/**
 * Get meridian IDs for a specific vital point
 * 
 * **Korean**: 급소의 경락 조회
 * 
 * @param vitalPointId - ID of the vital point
 * @returns Array of meridian IDs (empty if not found)
 * 
 * @example
 * ```typescript
 * const meridians = getMeridiansForVitalPoint("head_temple");
 * // Returns: ["gallbladder", "triple_burner"]
 * ```
 */
export function getMeridiansForVitalPoint(
  vitalPointId: string
): readonly string[] {
  return VITAL_POINT_MERIDIAN_MAP[vitalPointId] ?? [];
}

/**
 * Get all vital points associated with a specific meridian
 * 
 * **Korean**: 경락의 급소 목록 조회
 * 
 * @param meridianId - ID of the meridian
 * @returns Array of vital point IDs
 * 
 * @example
 * ```typescript
 * const vitalPoints = getVitalPointsForMeridian("gallbladder");
 * // Returns: ["head_temple", "head_ear", "head_side_neck", ...]
 * ```
 */
export function getVitalPointsForMeridian(
  meridianId: string
): readonly string[] {
  return Object.entries(VITAL_POINT_MERIDIAN_MAP)
    .filter(([_, meridians]) => meridians.includes(meridianId))
    .map(([vitalPointId, _]) => vitalPointId);
}

/**
 * Check if a vital point is connected to a specific meridian
 * 
 * **Korean**: 급소-경락 연결 확인
 * 
 * @param vitalPointId - ID of the vital point
 * @param meridianId - ID of the meridian
 * @returns True if the vital point is on the meridian
 */
export function isVitalPointOnMeridian(
  vitalPointId: string,
  meridianId: string
): boolean {
  const meridians = getMeridiansForVitalPoint(vitalPointId);
  return meridians.includes(meridianId);
}

/**
 * Get meridian statistics
 * 
 * **Korean**: 경락 통계
 * 
 * @returns Statistics about meridian-vital point mappings
 */
export function getMeridianMappingStatistics(): {
  readonly totalVitalPoints: number;
  readonly totalMappings: number;
  readonly meridianCounts: Record<string, number>;
} {
  const totalVitalPoints = Object.keys(VITAL_POINT_MERIDIAN_MAP).length;
  let totalMappings = 0;
  const meridianCounts: Record<string, number> = {};

  Object.values(VITAL_POINT_MERIDIAN_MAP).forEach((meridians) => {
    totalMappings += meridians.length;
    meridians.forEach((meridianId) => {
      meridianCounts[meridianId] = (meridianCounts[meridianId] ?? 0) + 1;
    });
  });

  return {
    totalVitalPoints,
    totalMappings,
    meridianCounts,
  };
}
