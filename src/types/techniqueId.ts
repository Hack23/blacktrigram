/**
 * Technique ID enum for type-safe technique references
 *
 * **Korean**: 기술 ID 열거형
 *
 * Provides compile-time safety for all technique references across the codebase.
 * Every technique in the game has a unique ID defined here.
 *
 * @module types/techniqueId
 * @category Combat System
 * @korean 기술ID
 */

/**
 * All technique IDs in the game system
 *
 * Each archetype has 4 unique techniques:
 * - 무사 (Musa): musa_thunder_strike, musa_iron_defense, musa_dragon_fist, musa_mountain_breaker
 * - 암살자 (Amsalja): amsalja_shadow_strike, amsalja_nerve_strike, amsalja_deadly_precision, amsalja_silent_death
 * - 해커 (Hacker): hacker_electric_shock, hacker_data_strike, hacker_cyber_overdrive, hacker_system_crash
 * - 정보요원 (Jeongbo): jeongbo_tactical_strike, jeongbo_counter_intelligence, jeongbo_psychological_warfare, jeongbo_precision_takedown
 * - 조직폭력배 (Jojik): jojik_street_brawl, jojik_improvised_weapon, jojik_ruthless_assault, jojik_brutal_takedown
 *
 * @public
 * @category Combat System
 * @korean 기술ID열거형
 */
export enum TechniqueId {
  // 무사 (Musa) - Traditional Warrior
  MUSA_THUNDER_STRIKE = "musa_thunder_strike",
  MUSA_IRON_DEFENSE = "musa_iron_defense",
  MUSA_DRAGON_FIST = "musa_dragon_fist",
  MUSA_MOUNTAIN_BREAKER = "musa_mountain_breaker",

  // 암살자 (Amsalja) - Shadow Assassin
  AMSALJA_SHADOW_STRIKE = "amsalja_shadow_strike",
  AMSALJA_NERVE_STRIKE = "amsalja_nerve_strike",
  AMSALJA_DEADLY_PRECISION = "amsalja_deadly_precision",
  AMSALJA_SILENT_DEATH = "amsalja_silent_death",

  // 해커 (Hacker) - Cyber Warrior
  HACKER_ELECTRIC_SHOCK = "hacker_electric_shock",
  HACKER_DATA_STRIKE = "hacker_data_strike",
  HACKER_CYBER_OVERDRIVE = "hacker_cyber_overdrive",
  HACKER_SYSTEM_CRASH = "hacker_system_crash",

  // 정보요원 (Jeongbo Yowon) - Intelligence Operative
  JEONGBO_TACTICAL_STRIKE = "jeongbo_tactical_strike",
  JEONGBO_COUNTER_INTELLIGENCE = "jeongbo_counter_intelligence",
  JEONGBO_PSYCHOLOGICAL_WARFARE = "jeongbo_psychological_warfare",
  JEONGBO_PRECISION_TAKEDOWN = "jeongbo_precision_takedown",
  JEONGBO_INTELLIGENCE_STRIKE = "jeongbo_intelligence_strike",

  // 조직폭력배 (Jojik Pokryeokbae) - Organized Crime
  JOJIK_STREET_BRAWL = "jojik_street_brawl",
  JOJIK_IMPROVISED_WEAPON = "jojik_improvised_weapon",
  JOJIK_RUTHLESS_ASSAULT = "jojik_ruthless_assault",
  JOJIK_BRUTAL_TAKEDOWN = "jojik_brutal_takedown",
}

export default TechniqueId;
