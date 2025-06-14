import { TrigramStance } from "../../types/enums";

/**
 * ## Trigram Calculator System
 *
 * **Business Purpose:**
 * Provides mathematical foundation for Black Trigram's Korean martial arts
 * trigram system based on I Ching principles. Handles:
 * - Traditional trigram mathematical relationships and calculations
 * - Stance effectiveness calculations based on I Ching philosophy
 * - Energy flow calculations between different trigram stances
 * - Combat balance mathematics ensuring competitive gameplay
 *
 * **Korean Martial Arts Integration:**
 * - Implements authentic I Ching trigram mathematical principles
 * - Respects traditional Korean martial arts stance relationships
 * - Maintains cultural accuracy in trigram transformation calculations
 * - Provides realistic Korean martial arts combat mathematics
 *
 * **Technical Architecture:**
 * - Pure mathematical functions for trigram calculations
 * - Optimized algorithms for real-time combat calculations
 * - Cached results for frequently used trigram relationships
 * - Extensible design supporting additional trigram mechanics
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
export class TrigramCalculator {
  private static readonly TRIGRAM_OPPOSITES = new Map([
    [TrigramStance.GEON, TrigramStance.GON], // Heaven ↔ Earth
    [TrigramStance.TAE, TrigramStance.SON],  // Lake ↔ Wind  
    [TrigramStance.LI, TrigramStance.GAM],   // Fire ↔ Water
    [TrigramStance.JIN, TrigramStance.GAN],  // Thunder ↔ Mountain
    [TrigramStance.SON, TrigramStance.TAE],  // Wind ↔ Lake
    [TrigramStance.GAM, TrigramStance.LI],   // Water ↔ Fire
    [TrigramStance.GAN, TrigramStance.JIN],  // Mountain ↔ Thunder
    [TrigramStance.GON, TrigramStance.GEON], // Earth ↔ Heaven
  ]);

  private static readonly TRIGRAM_ADJACENCIES = new Map([
    [TrigramStance.GEON, [TrigramStance.TAE, TrigramStance.SON]],
    [TrigramStance.TAE, [TrigramStance.GEON, TrigramStance.LI]],
    [TrigramStance.LI, [TrigramStance.TAE, TrigramStance.JIN]],
    [TrigramStance.JIN, [TrigramStance.LI, TrigramStance.SON]],
    [TrigramStance.SON, [TrigramStance.JIN, TrigramStance.GAM]],
    [TrigramStance.GAM, [TrigramStance.SON, TrigramStance.GAN]],
    [TrigramStance.GAN, [TrigramStance.GAM, TrigramStance.GON]],
    [TrigramStance.GON, [TrigramStance.GAN, TrigramStance.GEON]],
  ]);

  /**
   * **Business Logic:** Gets the opposite trigram stance following I Ching principles
   * 
   * @param stance - Current trigram stance
   * @returns Opposite trigram stance
   */
  getOpposite(stance: TrigramStance): TrigramStance {
    return TrigramCalculator.TRIGRAM_OPPOSITES.get(stance) || stance;
  }

  /**
   * **Business Logic:** Gets adjacent trigram stances in the traditional sequence
   * 
   * @param stance - Current trigram stance
   * @returns Array of adjacent trigram stances
   */
  getAdjacentStances(stance: TrigramStance): TrigramStance[] {
    return TrigramCalculator.TRIGRAM_ADJACENCIES.get(stance) || [];
  }

  /**
   * **Business Logic:** Calculates transition difficulty between two stances
   * 
   * @param from - Starting trigram stance
   * @param to - Target trigram stance
   * @returns Difficulty value (0.0 = easy, 1.0 = hardest)
   */
  getTransitionDifficulty(from: TrigramStance, to: TrigramStance): number {
    if (from === to) return 0;
    
    const adjacent = this.getAdjacentStances(from);
    if (adjacent.includes(to)) return 0.3;
    
    const opposite = this.getOpposite(from);
    if (opposite === to) return 1.0;
    
    return 0.6; // Diagonal transitions
  }

  /**
   * **Business Logic:** Calculates combat effectiveness between stances
   * 
   * @param attacker - Attacking stance
   * @param defender - Defending stance
   * @returns Effectiveness multiplier (>1.0 = advantage, <1.0 = disadvantage)
   */
  calculateStanceEffectiveness(attacker: TrigramStance, defender: TrigramStance): number {
    // Opposites have strong effectiveness
    if (this.getOpposite(attacker) === defender) {
      return 1.4;
    }
    
    // Adjacent stances have moderate effectiveness
    if (this.getAdjacentStances(attacker).includes(defender)) {
      return 1.1;
    }
    
    // Same stance is neutral
    if (attacker === defender) {
      return 1.0;
    }
    
    return 0.9; // Default slight disadvantage
  }

  /**
   * **Business Logic:** Calculates energy flow between stances (-1 to 1)
   * 
   * @param from - Source stance
   * @param to - Target stance
   * @returns Energy flow (-1 = opposing, 0 = neutral, 1 = harmonious)
   */
  calculateEnergyFlow(from: TrigramStance, to: TrigramStance): number {
    if (from === to) return 1.0;
    
    if (this.getOpposite(from) === to) return -1.0;
    
    if (this.getAdjacentStances(from).includes(to)) return 0.5;
    
    return 0.0;
  }

  /**
   * **Business Logic:** Gets the balance value for a stance
   * 
   * @param stance - Trigram stance
   * @returns Balance value for mathematical calculations
   */
  getStanceBalance(stance: TrigramStance): number {
    const balanceMap = {
      [TrigramStance.GEON]: 0.8,   // Strong yang
      [TrigramStance.TAE]: 0.4,    // Weak yang
      [TrigramStance.LI]: 0.6,     // Medium yang
      [TrigramStance.JIN]: 0.2,    // Weak yang
      [TrigramStance.SON]: -0.2,   // Weak yin
      [TrigramStance.GAM]: -0.6,   // Medium yin
      [TrigramStance.GAN]: -0.4,   // Weak yin
      [TrigramStance.GON]: -0.8,   // Strong yin
    };
    
    return balanceMap[stance] || 0;
  }
}

export default TrigramCalculator;
      Math.abs(toIndex - fromIndex),
      stanceOrder.length - Math.abs(toIndex - fromIndex)
    );

    // Normalize distance to 0-1 range and add base difficulty
    const normalizedDistance = distance / (stanceOrder.length / 2);
    return baseDifficulty + normalizedDistance * 0.5;
  }
} // end of class

export { STANCE_EFFECTIVENESS_MATRIX };
