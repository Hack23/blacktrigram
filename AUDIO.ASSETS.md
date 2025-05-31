# Audio Assets Specification (Focused on AudioManager Usage)

Below is the **finalized list of audio assets** required by the current `AudioManager` implementation. Only assets that are actually referenced (directly or indirectly) by the AudioManager’s methods (`playMusic`, `playAttackSound`, `playHitSound`, `playComboSound`, `playStanceChangeSound`, `playSFX`) are included. Each asset entry specifies:

1. **Name** (filename without extension)
2. **Category** (Music or SFX)
3. **Folder Location** (relative to `public/assets/audio/`)
4. **Format** (`.webm`)
5. **Channels / Style** (Mono or Stereo, Loopable or One‐Shot)
6. **Description / Usage Notes**

---

## Directory Structure

```
public/assets/audio/
├── sfx/
│   ├── menu/
│   │   ├── menu_click.webm
│   │   ├── menu_navigate.webm
│   │   ├── menu_select.webm
│   │   ├── menu_hover.webm
│   │   └── menu_back.webm
│   ├── combat/
│   │   ├── attack_punch_light.webm
│   │   ├── attack_punch_medium.webm
│   │   ├── attack_kick_heavy.webm
│   │   ├── attack_light.webm
│   │   ├── attack_medium.webm
│   │   ├── attack_critical.webm
│   │   ├── attack_special_geon.webm
│   │   ├── dodge.webm
│   │   ├── block_success.webm
│   │   ├── block_break.webm
│   │   └── perfect_strike.webm
│   ├── hits/
│   │   ├── hit_light.webm
│   │   ├── hit_medium.webm
│   │   ├── hit_heavy.webm
│   │   ├── hit_critical.webm
│   │   ├── hit_flesh.webm
│   │   └── hit_block.webm
│   ├── combo/
│   │   ├── combo_buildup.webm
│   │   ├── combo_finish.webm
│   │   └── energy_pulse.webm
│   ├── match/
│   │   ├── match_start.webm
│   │   ├── countdown.webm
│   │   ├── match_end.webm
│   │   ├── victory.webm
│   │   └── defeat.webm
│   ├── movement/
│   │   ├── footstep.webm
│   │   └── stance_change.webm
│   ├── ki/
│   │   ├── ki_charge.webm
│   │   └── ki_release.webm
│   ├── stamina/
│   │   └── stamina_depleted.webm
│   ├── health/
│   │   └── health_low.webm
│   ├── ambient/
│   │   ├── dojang_ambience.webm
│   │   ├── wind_effect.webm
│   │   └── dojo_crowd.webm
│   └── ui/
│       ├── menu_select.webm       ← redundant with sfx/menu (only keep in one)
│       └── menu_back.webm         ← redundant with sfx/menu (only keep in one)
└── music/
    ├── intro_theme.webm
    ├── combat_theme.webm
    ├── combat_theme_geon.webm
    ├── training_theme.webm
    ├── meditation_theme.webm
    ├── victory_theme.webm
    ├── underground_rave_theme.webm
    └── ambient_loop.webm
```

* **Note**: For clarity, `sfx/ui/` contains two files (`menu_select.webm` and `menu_back.webm`) that are already listed under `sfx/menu/`. In practice, keep only one copy in `sfx/menu/` and remove duplicates. The directory tree above is illustrative; the table below references each asset’s **canonical** location.

---

## Audio Assets Table

| #  | Name                         | Category | Folder Location | Format | Channels / Style                | Description / Usage                                                                                                                       |
| -- | ---------------------------- | -------- | --------------- | ------ | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1  | **menu\_click**              | SFX      | `sfx/menu/`     | .webm  | Mono, One‐Shot                  | Button click sound (small “pop”) used when a menu item is selected—e.g., settings, loadout, etc.                                          |
| 2  | **menu\_navigate**           | SFX      | `sfx/menu/`     | .webm  | Mono, One‐Shot                  | Soft “slide” or “beep” used when navigating between menu items.                                                                           |
| 3  | **menu\_select**             | SFX      | `sfx/menu/`     | .webm  | Mono, One‐Shot                  | Confirmation sound for clicking “Enter” on a menu option; a short metallic “click.”                                                       |
| 4  | **menu\_hover**              | SFX      | `sfx/menu/`     | .webm  | Mono, One‐Shot                  | Hover‐over sound for UI buttons (subtle chime).                                                                                           |
| 5  | **menu\_back**               | SFX      | `sfx/menu/`     | .webm  | Mono, One‐Shot                  | Cancel/back action in menus (low whoosh).                                                                                                 |
| 6  | **attack\_punch\_light**     | SFX      | `sfx/combat/`   | .webm  | Mono, One‐Shot                  | Light punch impact (e.g., jab). Dry “thwack” with minimal low‐end; played by `playAttackSound(damage)` when damage is small.              |
| 7  | **attack\_punch\_medium**    | SFX      | `sfx/combat/`   | .webm  | Mono, One‐Shot                  | Medium‐strength punch; fuller mid‐range “smack.” Used when `playAttackSound(damage)` with medium damage.                                  |
| 8  | **attack\_kick\_heavy**      | SFX      | `sfx/combat/`   | .webm  | Stereo, One‐Shot                | Heavy kick with sub “boom.” Used for larger‐damage attacks in `playAttackSound(damage)`.                                                  |
| 9  | **attack\_light**            | SFX      | `sfx/combat/`   | .webm  | Mono, One‐Shot                  | Generic light‐damage attack (used internally by combo chains).                                                                            |
| 10 | **attack\_medium**           | SFX      | `sfx/combat/`   | .webm  | Mono, One‐Shot                  | Generic medium‐damage attack.                                                                                                             |
| 11 | **attack\_critical**         | SFX      | `sfx/combat/`   | .webm  | Stereo, One‐Shot                | Critical (high‐damage) attack: layered sub boom + high snap + reverberation. Used by `playAttackSound(damage)` when `damage` is critical. |
| 12 | **attack\_special\_geon**    | SFX      | `sfx/combat/`   | .webm  | Stereo, One‐Shot                | “Geon” special move execution: electronic surge + distorted Korean drum (buk).                                                            |
| 13 | **dodge**                    | SFX      | `sfx/combat/`   | .webm  | Mono, One‐Shot                  | Dodge maneuver sound: quick “woosh.” Called by `playAttackSound` or by specific dodge logic.                                              |
| 14 | **block\_success**           | SFX      | `sfx/combat/`   | .webm  | Mono, One‐Shot                  | Successful block: dry metal‐on‐metal “clank.” Invoked by `playHitSound` when impact is blocked.                                           |
| 15 | **block\_break**             | SFX      | `sfx/combat/`   | .webm  | Stereo, One‐Shot                | Block break (armor shatter): crunchy metallic break + debris.                                                                             |
| 16 | **perfect\_strike**          | SFX      | `sfx/combat/`   | .webm  | Stereo, One‐Shot                | Ultra‐precision strike: high‐pitched “snap” + short pitch‐bend. Used by `playAttackSound` when a perfect/vital strike lands.              |
| 17 | **hit\_light**               | SFX      | `sfx/hits/`     | .webm  | Mono, One‐Shot                  | Light hit feedback (character takes minor damage). Called by `playHitSound(damage, isVitalPoint)`.                                        |
| 18 | **hit\_medium**              | SFX      | `sfx/hits/`     | .webm  | Mono, One‐Shot                  | Medium hit feedback (moderate damage).                                                                                                    |
| 19 | **hit\_heavy**               | SFX      | `sfx/hits/`     | .webm  | Stereo, One‐Shot                | Heavy hit feedback (strong impact).                                                                                                       |
| 20 | **hit\_critical**            | SFX      | `sfx/hits/`     | .webm  | Stereo, One‐Shot                | Critical hit (fatal or near‐fatal). Plays a deep sub boom + echo.                                                                         |
| 21 | **hit\_flesh**               | SFX      | `sfx/hits/`     | .webm  | Mono, One‐Shot                  | Flesh‐on‐flesh impact (unarmored hit).                                                                                                    |
| 22 | **hit\_block**               | SFX      | `sfx/hits/`     | .webm  | Mono, One‐Shot                  | Generic hit on a blocked surface.                                                                                                         |
| 23 | **combo\_buildup**           | SFX      | `sfx/combo/`    | .webm  | Stereo, One‐Shot                | Combo chain buildup: rising “whoosh” + drum roll. Called by `playComboSound(comboCount)` when `comboCount` increments.                    |
| 24 | **combo\_finish**            | SFX      | `sfx/combo/`    | .webm  | Stereo, One‐Shot                | Combo completion flourish: synth burst + impact echo. Called by `playComboSound(comboCount)` at final combo.                              |
| 25 | **energy\_pulse**            | SFX      | `sfx/combo/`    | .webm  | Stereo, Loopable (1 bar)        | Subtle electro‐pulse you can loop under combos. Used as backing layer when combos engage.                                                 |
| 26 | **match\_start**             | SFX      | `sfx/match/`    | .webm  | Stereo, One‐Shot                | Match start cue: drum fill + bell chime. Possibly triggered by `playSFX("match_start")` before combat begins.                             |
| 27 | **countdown**                | SFX      | `sfx/match/`    | .webm  | Stereo, One‐Shot                | “3…2…1…Fight!” voice/note countdown. Called by `playSFX("countdown")` at match intro.                                                     |
| 28 | **match\_end**               | SFX      | `sfx/match/`    | .webm  | Stereo, One‐Shot                | End‐of‐match “gong.”                                                                                                                      |
| 29 | **victory**                  | SFX      | `sfx/match/`    | .webm  | Stereo, One‐Shot                | Player victory fanfare (short triumphant chord).                                                                                          |
| 30 | **defeat**                   | SFX      | `sfx/match/`    | .webm  | Stereo, One‐Shot                | Defeat sound: low minor chord.                                                                                                            |
| 31 | **footstep**                 | SFX      | `sfx/movement/` | .webm  | Mono, One‐Shot                  | Single dojo floor footstep.                                                                                                               |
| 32 | **stance\_change**           | SFX      | `sfx/movement/` | .webm  | Mono, One‐Shot                  | Stance switch (cloth rustle + muffled “shhh”). Called by `playStanceChangeSound()`.                                                       |
| 33 | **ki\_charge**               | SFX      | `sfx/ki/`       | .webm  | Stereo, One‐Shot                | Ki energy buildup (rising synth hum). Played by `playSFX("ki_charge")` when player charges Ki.                                            |
| 34 | **ki\_release**              | SFX      | `sfx/ki/`       | .webm  | Stereo, One‐Shot                | Ki release explosion (zing + sub thump). Played by `playSFX("ki_release")`.                                                               |
| 35 | **stamina\_depleted**        | SFX      | `sfx/stamina/`  | .webm  | Mono, One‐Shot                  | Warning beep when stamina is low. Called by `playSFX("stamina_depleted")`.                                                                |
| 36 | **health\_low**              | SFX      | `sfx/health/`   | .webm  | Mono, One‐Shot                  | Low‐health heartbeat & beep. Called by `playSFX("health_low")`.                                                                           |
| 37 | **dojang\_ambience**         | SFX      | `sfx/ambient/`  | .webm  | Stereo, Loopable (60s)          | Dojo ambient loop: distant chatter, shuffling, soft wind. Played by `playSFX("dojang_ambience")` on practice/training screens.            |
| 38 | **wind\_effect**             | SFX      | `sfx/ambient/`  | .webm  | Stereo, Loopable (30s)          | Outdoor wind gust. Possibly used by `playSFX("wind_effect")` in open‐field scenes.                                                        |
| 39 | **dojo\_crowd**              | SFX      | `sfx/ambient/`  | .webm  | Stereo, Loopable (60s)          | Crowd murmur in dojo stands. Used on fight screens for background ambience.                                                               |
| 40 | **intro\_theme**             | Music    | `music/`        | .webm  | Stereo, Non‐Looped (4:00)       | Main menu / title screen music. Played by `playMusic("intro_theme")`.                                                                     |
| 41 | **combat\_theme**            | Music    | `music/`        | .webm  | Stereo, Non‐Looped (3:30)       | Default combat music. Played by `playMusic("combat_theme")` during fights.                                                                |
| 42 | **combat\_theme\_geon**      | Music    | `music/`        | .webm  | Stereo, Non‐Looped (3:30)       | Alternative “Geon” combat theme. Played by `playMusic("combat_theme_geon")` for special matches.                                          |
| 43 | **training\_theme**          | Music    | `music/`        | .webm  | Stereo, Non‐Looped (3:00, Loop) | Dojo training music. Played by `playMusic("training_theme")` on practice screens.                                                         |
| 44 | **meditation\_theme**        | Music    | `music/`        | .webm  | Stereo, Non‐Looped (2:30)       | Meditation/relaxation music. Played by `playMusic("meditation_theme")` on rest screens.                                                   |
| 45 | **victory\_theme**           | Music    | `music/`        | .webm  | Stereo, Non‐Looped (1:30)       | Victory fanfare music. Played by `playMusic("victory_theme")` on win.                                                                     |
| 46 | **underground\_rave\_theme** | Music    | `music/`        | .webm  | Stereo, Non‐Looped (4:00)       | Dark EBM/techno “Black Trigram Underground Rave.” Played by `playMusic("underground_rave_theme")` in special fight or underground menus.  |
| 47 | **ambient\_loop**            | Music    | `music/`        | .webm  | Stereo, Loopable (120s)         | General “city underground” ambience. Played by `playMusic("ambient_loop")` on loading or transitional screens.                            |

---

## Guidelines & Notes

1. **File Format & Optimization**

   * All files must be in **`.webm`**.
   * **Opus** codec for music (`-c:a libopus -b:a 128k` for most tracks, `-b:a 160k` for high‐energy tracks).
   * **Opus** or **Vorbis** for SFX (bitrates 64–96 kbps).
   * Aim for small file sizes while retaining perceptible quality (e.g., \~1 MB per 1 second of music).

2. **Channels / Stereo vs. Mono**

   * **Mono** (one‐shot) for short UI or combat SFX (menu clicks, hits, footsteps).
   * **Stereo** for spatially rich SFX (attack\_critical, block\_break) and all music tracks.
   * **Loopable** assets (ambient loops, energy pulses) must loop seamlessly.

3. **Volume & Loudness Standards**

   * **Music**: target **−12 LUFS** (integrated).
   * **SFX**: peaks around **−6 dB TP**. Normalize each one to its own peak before import.
   * Common mastering chain:

     1. **High‐pass filter** at 20 Hz.
     2. **Low‐pass filter** at 18 kHz (SFX).
     3. **Limiter** at **−0.3 dB** ceiling.
     4. **Normalize** SFX to peak.
     5. **Light bus compression** on music (2:1 ratio, threshold \~−14 dB) + **EQ** for clarity (boost 2 kHz +2 dB, cut muddy mids).

4. **Naming Conventions**

   * **SFX**: `category_name.webm` (e.g., `attack_punch_light.webm`).
   * **Music**: descriptive (e.g., `intro_theme.webm`, `underground_rave_theme.webm`).

5. **Integration with AudioManager**

   * **`playMusic(trackName)`** expects `trackName` to match exactly one of the **Music** assets (`intro_theme`, `combat_theme`, `combat_theme_geon`, `training_theme`, `meditation_theme`, `victory_theme`, `underground_rave_theme`, `ambient_loop`).
   * **`playAttackSound(damage)`** should map `damage` ranges to one of the attack SFX (`attack_punch_light`, `attack_punch_medium`, `attack_kick_heavy`, `attack_light`, `attack_medium`, `attack_critical`, `attack_special_geon`, `dodge`, `perfect_strike`).
   * **`playHitSound(damage, isVitalPoint)`** should choose among `hit_light`, `hit_medium`, `hit_heavy`, `hit_critical`, `hit_flesh`, `hit_block` (and optionally add a distinct layer if `isVitalPoint === true`).
   * **`playComboSound(comboCount)`** uses `combo_buildup` (when comboCount increments) and `combo_finish` (when comboCount resets), plus optionally `energy_pulse` as looping backing when combo ≥ 2.
   * **`playStanceChangeSound()`** calls `stance_change.webm`.
   * **`playSFX(soundId)`** must be able to reference any SFX by its filename (without extension), e.g., `playSFX("menu_click")`, `playSFX("match_start")`, `playSFX("defeat")`, `playSFX("footstep")`, `playSFX("ki_charge")`, `playSFX("health_low")`, `playSFX("dojang_ambience")`, etc.

6. **Missing Assets / 404 Prevention**

   * Ensure all asset names in the table above exactly match their filenames (including underscores).
   * Verify that **no 404** occurs when playing an asset by calling `audioManager.playSFX("asset_name")` or `audioManager.playMusic("trackName")` in a debug console—you should see a console log with the correct `trackName` or `soundId`.
   * Remove any references to assets not listed here; if code calls `playSFX("some_old_asset")` that asset must be added above or the call must be updated to an existing asset.

---

### Example Usage in `AudioManager` Context

```ts
// In some React component or game logic:

import { useAudio } from "./AudioManager";

// Play background music when entering main menu:
const audio = useAudio();
audio.playMusic("intro_theme");

// Play a light punch sound when damage is low:
audio.playAttackSound(5); // mapping logic in code should choose "attack_punch_light"

// Play a critical hit sound when vital point is hit:
audio.playHitSound(50, true); // maps to "hit_critical" + possibly extra FX

// Play combo buildup at comboCount = 2 and combo finish at combo end:
audio.playComboSound(2);  // plays "combo_buildup"
audio.playComboSound(0);  // plays "combo_finish"

// Play stance change when user toggles guard stance:
audio.playStanceChangeSound(); // plays "stance_change"

// Play a generic UI click:
audio.playSFX("menu_click");   // plays `public/assets/audio/sfx/menu/menu_click.webm`
```

By adhering strictly to the **above directory structure**, **asset names**, and **volume/format guidelines**, the AudioManager will load and play every required sound or music track without generating any missing‐resource errors.
