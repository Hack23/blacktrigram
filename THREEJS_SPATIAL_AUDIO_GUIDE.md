# Three.js Spatial Audio Integration Guide

## Overview

Black Trigram uses HTML Audio API through AudioManager for global audio (music and UI SFX), with support for 3D spatial audio through @react-three/drei's `PositionalAudio` component for future enhancements.

## Current Audio Architecture

### AudioProvider + Three.js Integration

The `AudioProvider` wraps the entire application and provides audio context to all components, including those inside Three.js `Canvas`:

```tsx
// App.tsx
import { AudioProvider } from "./audio/AudioProvider";
import { IntroScreenThreeJS } from "./components/intro/IntroScreenThreeJS";

function App() {
  return (
    <AudioProvider>
      {/* All Three.js screens have access to audio */}
      <IntroScreenThreeJS />
    </AudioProvider>
  );
}
```

### Audio in Three.js Components

Components inside `Canvas` can use the `useAudio` hook through `Html` overlays:

```tsx
import { Html } from "@react-three/drei";
import { useAudio } from "../../audio/AudioProvider";

export const CombatHUD: React.FC = () => {
  const audio = useAudio();

  return (
    <Html fullscreen>
      <button onClick={() => audio.playSFX("menu_select")}>
        Attack
      </button>
    </Html>
  );
};
```

## Spatial Audio Support (Future Enhancement)

### Using PositionalAudio for 3D Sound

For combat sounds that should emanate from specific 3D positions, use `PositionalAudio` from @react-three/drei:

```tsx
import { PositionalAudio } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

interface SpatialAudioProps {
  readonly url: string;
  readonly position: [number, number, number];
  readonly volume?: number;
  readonly refDistance?: number;
  readonly rolloffFactor?: number;
  readonly loop?: boolean;
  readonly autoplay?: boolean;
}

export const SpatialAudio3D: React.FC<SpatialAudioProps> = ({
  url,
  position,
  volume = 1,
  refDistance = 5,
  rolloffFactor = 1,
  loop = false,
  autoplay = false,
}) => {
  const audioRef = useRef<THREE.PositionalAudio>(null);

  // Update audio parameters when they change
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    
    audio.setRefDistance(refDistance);
    audio.setRolloffFactor(rolloffFactor);
    audio.setVolume(volume);
    audio.setLoop(loop);
    
    if (autoplay && !audio.isPlaying) {
      audio.play();
    }
  }, [refDistance, rolloffFactor, volume, loop, autoplay]);

  // Only stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.stop();
      }
    };
  }, []);

  return (
    <group position={position}>
      <PositionalAudio ref={audioRef} url={url} />
    </group>
  );
};
```

### AudioListener Management

**Important**: The `PositionalAudio` component from @react-three/drei **automatically creates and manages the AudioListener** internally. You do **not** need to manually add an AudioListener to the camera - this is handled for you.

The component automatically:
- Creates an AudioListener instance
- Attaches it to the camera on mount
- Removes it from the camera on unmount
- Manages all cleanup

Here's a simple example showing spatial audio usage:

```tsx
import { PositionalAudio } from "@react-three/drei";
import { PerspectiveCamera } from "@react-three/drei";

export const CombatScene: React.FC = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} />
      
      {/* Combat character with spatial hit sound - AudioListener handled automatically */}
      <group position={[-3, 0, 0]}>
        <Player3DModel />
        <SpatialAudio3D
          url="/assets/audio/sfx/hit_medium.webm"
          position={[0, 1, 0]}
          refDistance={3}
          rolloffFactor={2}
        />
      </group>
    </>
  );
};
```

**Note**: If you need manual control over the AudioListener (advanced use case), you can create your own implementation, but for most cases, using @react-three/drei's `PositionalAudio` is recommended as it handles all the complexity for you.

### Example: Combat with Spatial Audio

```tsx
import { useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useAudio } from "../../audio/AudioProvider";
import { SpatialAudio3D } from "./SpatialAudio3D";

export const CombatScreen3D: React.FC = () => {
  const audio = useAudio();
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0, 0]);

  // Play global background music
  useEffect(() => {
    audio.fadeIn("combat_theme", 2000);
    
    return () => {
      audio.fadeOut(2000);
    };
  }, [audio]);

  // Update player position on attack
  const handleAttack = () => {
    // Player moves forward during attack
    setPlayerPosition([0, 0, -1]);
    setTimeout(() => setPlayerPosition([0, 0, 0]), 500);
  };

  return (
    <Canvas>
      {/* Camera setup */}
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} />
      
      {/* 3D Scene */}
      <CombatArena />
      
      {/* Player 1 with spatial attack sounds - AudioListener managed automatically by PositionalAudio */}
      <group position={playerPosition}>
        <Player3DModel />
        <SpatialAudio3D
          url="/assets/audio/sfx/attack_punch_light.webm"
          position={[0, 1.5, 0]}
          refDistance={5}
          rolloffFactor={1.5}
        />
      </group>
      
      {/* UI Overlay with global audio */}
      <Html fullscreen>
        <button onClick={handleAttack}>
          Attack
        </button>
        <button onClick={() => audio.playSFX("menu_select")}>
          Return to Menu
        </button>
      </Html>
    </Canvas>
  );
};
```

## Audio System Components

### 1. Global Audio (Current Implementation)

- **AudioProvider**: React context providing audio to all components
- **AudioManager**: HTML Audio API for music and SFX
- **useAudio hook**: Access audio from any component

**Use for:**
- Background music
- Menu sounds (hover, click, select)
- UI feedback
- Global announcements

### 2. Spatial Audio (Future Enhancement)

- **PositionalAudio**: Three.js 3D positioned audio
- **AudioListener**: Attached to camera for spatial audio perception

**Use for:**
- Combat hit sounds at character positions
- Environmental sounds (wind, water, dojang ambience)
- Footstep sounds
- Special technique effects

## Best Practices

### When to Use Global Audio

✅ **Use AudioProvider + useAudio for:**
- Background music that plays throughout a scene
- UI interactions (button clicks, menu navigation)
- Announcements ("Round Start!", "K.O.!")
- Sound effects that shouldn't be spatially positioned

```tsx
const audio = useAudio();

// Play global SFX
audio.playSFX("menu_select");

// Play background music
audio.playMusic("combat_theme");

// Fade transitions
await audio.fadeIn("intro_theme", 2000);
await audio.fadeOut(1000);
```

### When to Use Spatial Audio

✅ **Use PositionalAudio for:**
- Combat sounds that emanate from character positions
- Environmental effects tied to 3D objects
- Projectile sounds
- Technique execution sounds from specific positions

**Using drei's PositionalAudio directly:**

```tsx
import { PositionalAudio } from "@react-three/drei";

<PositionalAudio
  url="/assets/audio/sfx/hit_medium.webm"
  distance={5}  // drei component uses 'distance' prop
  loop={true}
/>
```

**Using the custom SpatialAudio3D wrapper:**

```tsx
<SpatialAudio3D
  url="/assets/audio/sfx/hit_medium.webm"
  position={[0, 1.5, 0]}
  refDistance={5}  // wrapper component uses 'refDistance' for consistency with THREE.js API
  rolloffFactor={2}
/>
```

**Note**: The drei `PositionalAudio` component uses `distance` as its prop name, while the THREE.js API uses `setRefDistance()`. The custom `SpatialAudio3D` wrapper uses `refDistance` to match the THREE.js naming convention.

## Performance Considerations

1. **Limit simultaneous spatial audio sources**: Max 10-15 active spatial sounds
2. **Use audio pooling**: Reuse PositionalAudio instances for frequently played sounds
3. **Prefer global audio for UI**: Spatial audio has overhead
4. **Preload audio assets**: Use AudioProvider's preloading for critical sounds

## Testing Audio Integration

### Unit Tests

```tsx
import { render, screen } from "@testing-library/react";
import { AudioProvider, useAudio } from "../audio/AudioProvider";

it("should provide audio context to Three.js components", async () => {
  const TestComponent = () => {
    const audio = useAudio();
    return <div>{audio.isInitialized ? "ready" : "loading"}</div>;
  };

  render(
    <AudioProvider>
      <TestComponent />
    </AudioProvider>
  );

  await waitFor(() => {
    expect(screen.getByText("ready")).toBeInTheDocument();
  });
});
```

### Integration Tests

See `src/test/three-audio-integration.test.tsx` for comprehensive examples.

## Browser Autoplay Policy

Modern browsers block autoplay until user interaction:

```tsx
useEffect(() => {
  const startMusic = () => {
    if (audio.isInitialized && !musicStarted.current) {
      musicStarted.current = true;
      audio.playMusic("intro_theme");
    }
  };

  // Wait for first user interaction
  window.addEventListener("click", startMusic, { once: true });
  window.addEventListener("keydown", startMusic, { once: true });
  
  return () => {
    audio.stopMusic();
  };
}, [audio]);
```

## Future Enhancements

1. **Spatial audio for combat**: Attach PositionalAudio to player models
2. **Dynamic audio**: Adjust volume based on distance and obstacles
3. **Audio occlusion**: Muffle sounds behind walls
4. **Doppler effect**: For fast-moving projectiles
5. **Reverb zones**: Different reverb for indoor/outdoor areas

## Audio Asset Requirements

### Global Audio
- Format: WebM (primary), MP3 (fallback)
- Sample rate: 44.1kHz or 48kHz
- Bitrate: 128kbps for SFX, 192kbps for music
- Channels: Stereo for music, mono for SFX

### Spatial Audio
- Format: WebM or MP3
- Sample rate: 44.1kHz
- Bitrate: 96kbps (spatial positioning matters more than quality)
- Channels: **Mono only** (required for 3D positioning)

## Troubleshooting

### Audio doesn't play
1. Check browser autoplay policy - requires user interaction
2. Verify AudioProvider wraps your component
3. Check audio asset paths and formats
4. Verify audio is initialized: `audio.isInitialized`

### Spatial audio not working
1. Ensure AudioListener is attached to camera
2. Verify audio files are mono (not stereo)
3. Check refDistance and rolloffFactor values
4. Confirm PositionalAudio is child of a group with correct position

### Performance issues
1. Limit simultaneous PositionalAudio instances
2. Use object pooling for frequently played sounds
3. Reduce audio quality/bitrate for spatial sounds
4. Use global audio for UI feedback

## References

- [Three.js Audio Documentation](https://threejs.org/docs/#api/en/audio/Audio)
- [@react-three/drei Audio Components](https://github.com/pmndrs/drei#audio)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Browser Autoplay Policies](https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide)

---

**흑괘의 소리를 들어라** - *Hear the Sound of the Black Trigram*
