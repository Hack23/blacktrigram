#!/usr/bin/env bash
# Script to update remaining technique AnimationTypes to unique values

set -e

REPO_DIR="/home/runner/work/blacktrigram/blacktrigram"

echo "Updating Gam techniques..."
sed -i 's/animationType: AnimationType\.WRIST_LOCK,/animationType: AnimationType.GAM_WRIST_TWIST_COUNTER,/g' "$REPO_DIR/src/systems/trigram/techniques/GamTechniques.ts"

# Update throw variants
sed -i 's/id: "gam_redirect_throw",.*animationType: AnimationType\.THROW,/id: "gam_redirect_throw",\n    name: {\n      korean: "물흐르기던지기",\n      english: "Redirect Throw",\n      romanized: "mulheureugideonjigi",\n    },\n    koreanName: "물흐르기던지기",\n    englishName: "Redirect Throw",\n    romanized: "mulheureugideonjigi",\n    description: {\n      korean: "상대의 운동량을 이용한 물의 흐름 던지기",\n      english: "Throw using opponent'\''s momentum like water flow",\n    },\n    stance: TrigramStance.GAM,\n    type: CombatAttackType.THROW,\n    damageType: DamageType.BLUNT,\n    damage: 28,\n    kiCost: 20,\n    staminaCost: 25,\n    accuracy: 0.78,\n    reachConfig: {\n      bodyPart: "arm",\n      techniqueType: "throw",\n      baseExtension: 0.8,\n    },\n    executionTime: 900,\n    recoveryTime: 1400,\n    critChance: 0.14,\n    critMultiplier: 1.7,\n    effects: [],\n    animationType: AnimationType.GAM_REDIRECT_THROW,/g' "$REPO_DIR/src/systems/trigram/techniques/GamTechniques.ts"

echo "Done!"
