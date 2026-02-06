---
name: audio-game-integration
description: |
  Enforces audio best practices for Black Trigram including Howler.js patterns,
  spatial 3D audio with PositionalAudio, performance optimization, combat audio
  feedback, Korean-themed soundscapes, and proper audio resource management.
license: MIT
---

# Audio Game Integration Skill

## Purpose

Ensures all audio in Black Trigram uses Howler.js effectively, implements spatial 3D audio for immersion, optimizes performance, provides clear combat feedback, creates authentic Korean-themed soundscapes, and manages audio resources properly.

## When to Apply

**Automatically trigger when:**
- Adding audio effects or music
- Implementing spatial 3D audio
- Creating combat sound feedback
- Managing audio resources
- Optimizing audio performance
- Adding Korean-themed audio
- Implementing audio settings (volume, mute)
- Debugging audio issues

## Core Principles

### 1. Howler.js Global Audio Management

✅ **Proper Audio Manager Pattern**
```typescript
import { Howl, Howler } from 'howler';

export class AudioManager {
  private sounds = new Map<string, Howl>();
  private music: Howl | null = null;
  
  load(id: string, src: string, options?: HowlOptions): void {
    const sound = new Howl({
      src: [src],
      volume: options?.volume ?? 0.7,
      loop: options?.loop ?? false,
      preload: true,
      ...options,
    });
    this.sounds.set(id, sound);
  }
  
  playSFX(id: string): void {
    this.sounds.get(id)?.play();
  }
  
  playMusic(id: string, fadeIn = 1000): void {
    if (this.music) this.stopMusic();
    const sound = this.sounds.get(id);
    if (!sound) return;
    
    this.music = sound;
    this.music.volume(0);
    this.music.play();
    this.music.fade(0, 0.5, fadeIn);
  }
  
  setSFXVolume(volume: number): void {
    this.sounds.forEach(sound => {
      if (sound !== this.music) {
        sound.volume(volume);
      }
    });
  }
}
```

### 2. Spatial 3D Audio with PositionalAudio

✅ **3D Spatial Audio Pattern**
```typescript
import { PositionalAudio } from '@react-three/drei';

export const Combat3DAudio: React.FC<{ position: Vector3 }> = ({ position }) => {
  return (
    <group position={position}>
      <PositionalAudio
        url="/audio/combat-ambient.mp3"
        distance={10}
        loop
        autoplay
      />
    </group>
  );
};
```

### 3. Combat Audio Feedback

✅ **Combat Sound System**
```typescript
export const useCombatAudio = () => {
  const audio = useAudio();
  
  const playStrikeSound = useCallback((
    strikeType: StrikeType,
    hit: boolean,
    critical: boolean
  ) => {
    if (!hit) {
      audio.playSFX('strike_miss');
      return;
    }
    
    if (critical) {
      audio.playSFX('strike_critical');
    } else {
      audio.playSFX(`strike_${strikeType}`);
    }
  }, [audio]);
  
  return { playStrikeSound };
};
```

### 4. Korean-Themed Soundscape

✅ **Cultural Audio Integration**
```typescript
export const KOREAN_AUDIO_THEMES = {
  MENU: {
    music: '/audio/korean-traditional-menu.mp3',
    ambient: '/audio/dojang-atmosphere.mp3',
  },
  COMBAT: {
    music: '/audio/korean-percussion-combat.mp3',
    strikes: {
      GEON: '/audio/thunder-strike.mp3',  // Heaven
      GAM: '/audio/water-flow.mp3',       // Water
      LI: '/audio/fire-strike.mp3',       // Fire
    },
  },
} as const;
```

## Enforcement Rules

### Rule 1: Howler.js for Global Audio
```
IF (using Web Audio API directly OR HTML5 audio)
THEN (use Howler.js AudioManager for consistency)
ELSE (verify preloading and resource management)
```

### Rule 2: Spatial Audio for 3D Scenes
```
IF (3D combat scene WITHOUT positional audio)
THEN (add PositionalAudio for attacks, impacts, movement)
ELSE (verify audio distance falloff is realistic)
```

### Rule 3: Combat Feedback Clarity
```
IF (strike sound without hit/miss/critical distinction)
THEN (implement distinct audio for each outcome)
ELSE (verify audio timing matches visual feedback)
```

## Anti-Patterns to REJECT

❌ **Synchronous Loading** - Always preload audio
❌ **No Volume Controls** - Must support mute and volume adjustment
❌ **Memory Leaks** - Clean up audio on unmount
❌ **No Spatial Audio** - 3D games need positional audio

## Compliance Framework

- **ISO 27001 A.8.1**: Audio asset management
- **NIST CSF ID.AM**: Audio resource inventory
- **CIS Control 2**: Audio asset tracking

## Remember

**소리의 예술 (Art of Sound)**

Audio enhances immersion and provides critical combat feedback. Proper spatial audio and Korean-themed soundscapes bring Black Trigram to life.

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
