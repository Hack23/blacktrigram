#!/usr/bin/env bash
# Batch update unique animation types

# Gan techniques - line 72
sed -i '72s/AnimationType\.BLOCK/AnimationType.GAN_ROCK_DEFENSE_BLOCK/' src/systems/trigram/techniques/GanTechniques.ts

# Gan techniques - line 112  
sed -i '112s/AnimationType\.BLOCK/AnimationType.GAN_IMMOVABLE_STANCE/' src/systems/trigram/techniques/GanTechniques.ts

# Gan techniques - line 190
sed -i '190s/AnimationType\.COUNTER_STRIKE/AnimationType.GAN_COUNTER_STRIKE/' src/systems/trigram/techniques/GanTechniques.ts

# Gan techniques - line 228
sed -i '228s/AnimationType\.COUNTER_STRIKE/AnimationType.GAN_REVERSAL_TECHNIQUE/' src/systems/trigram/techniques/GanTechniques.ts

# Gan techniques - line 268
sed -i '268s/AnimationType\.GRAPPLE/AnimationType.GAN_MOUNTAIN_STANCE_LOCK/' src/systems/trigram/techniques/GanTechniques.ts

# Gon techniques - line 72
sed -i '72s/AnimationType\.GRAPPLE/AnimationType.GON_EARTH_EMBRACE/' src/systems/trigram/techniques/GonTechniques.ts

# Gon techniques - line 112
sed -i '112s/AnimationType\.LOW_KICK/AnimationType.GON_LEG_SWEEP/' src/systems/trigram/techniques/GonTechniques.ts

# Gon techniques - line 150
sed -i '150s/AnimationType\.THROW/AnimationType.GON_SSIREUM_THROW/' src/systems/trigram/techniques/GonTechniques.ts

# Gon techniques - line 266
sed -i '266s/AnimationType\.GRAPPLE/AnimationType.GON_ANKLE_PICK/' src/systems/trigram/techniques/GonTechniques.ts

# Gon techniques - line 304
sed -i '304s/AnimationType\.THROW/AnimationType.GON_SACRIFICE_THROW/' src/systems/trigram/techniques/GonTechniques.ts

# Note: Line 190 (THROW) should be GON_SSIREUM_THROW - already updated above
# Note: Line 228 (SLAM) should be GON_BODY_LOCK_TAKEDOWN
sed -i '228s/AnimationType\.SLAM/AnimationType.GON_BODY_LOCK_TAKEDOWN/' src/systems/trigram/techniques/GonTechniques.ts

echo "Batch update complete!"
