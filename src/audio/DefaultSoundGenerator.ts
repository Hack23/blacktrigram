/**
 * DefaultSoundGenerator - Fallback sound generation for Korean martial arts game
 * Creates procedural audio when real sound assets are unavailable
 */

export class DefaultSoundGenerator {
  private static audioContext: AudioContext | null = null;

  private static getAudioContext(): AudioContext {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();

        // Resume context if suspended (browser autoplay policy)
        if (this.audioContext.state === "suspended") {
          this.audioContext.resume().catch(console.warn);
        }
      } catch (error) {
        console.warn("Failed to create AudioContext:", error);
        throw new Error("Web Audio API not supported");
      }
    }
    return this.audioContext;
  }

  private static async generateTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volume: number = 0.3,
    envelope?: {
      attack: number;
      decay: number;
      sustain: number;
      release: number;
    }
  ): Promise<void> {
    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      oscillator.type = type;

      // Apply ADSR envelope if provided
      if (envelope) {
        const { attack, decay, sustain, release } = envelope;
        const sustainLevel = volume * sustain;

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);
        gainNode.gain.linearRampToValueAtTime(
          sustainLevel,
          ctx.currentTime + attack + decay
        );
        gainNode.gain.linearRampToValueAtTime(
          sustainLevel,
          ctx.currentTime + duration - release
        );
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
      } else {
        // Simple envelope
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + duration
        );
      }

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);

      return new Promise<void>((resolve) => {
        oscillator.onended = () => resolve();
      });
    } catch (error) {
      console.warn("Failed to generate tone:", error);
    }
  }

  public static async playMenuSound(): Promise<void> {
    await this.generateTone(800, 0.1, "sine", 0.2);
  }

  public static async playMatchStartSound(): Promise<void> {
    // Temple bell simulation - fundamental + harmonics
    await Promise.all([
      this.generateTone(200, 1.0, "sine", 0.4),
      this.generateTone(400, 0.8, "sine", 0.2),
      this.generateTone(800, 0.6, "sine", 0.1),
    ]);
  }

  public static async playVictorySound(): Promise<void> {
    // Ascending chord progression with proper type checking
    const notes = [262, 330, 392, 523];

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      if (note !== undefined) {
        setTimeout(async () => {
          await this.generateTone(note, 0.3, "triangle", 0.3);
        }, i * 150);
      }
    }
  }

  public static async playStanceChangeSound(): Promise<void> {
    // Zen-like sound transition
    await this.generateTone(600, 0.2, "sine", 0.25, {
      attack: 0.05,
      decay: 0.1,
      sustain: 0.7,
      release: 0.05,
    });

    setTimeout(async () => {
      await this.generateTone(400, 0.1, "triangle", 0.15);
    }, 100);
  }

  public static async playAttackSound(damage: number): Promise<void> {
    const baseFreq = 200 + damage * 8;
    const duration = 0.08 + damage * 0.003;
    const volume = Math.min(0.6, 0.2 + damage * 0.01);

    await this.generateTone(baseFreq, duration, "sawtooth", volume, {
      attack: 0.01,
      decay: 0.02,
      sustain: 0.8,
      release: 0.05,
    });
  }

  public static async playHitSound(
    damage: number,
    isVitalPoint: boolean = false
  ): Promise<void> {
    const freq = isVitalPoint ? 300 + damage * 15 : 150 + damage * 5;
    const duration = isVitalPoint ? 0.2 : 0.12;
    const volume = Math.min(0.5, 0.2 + damage * 0.008);

    if (isVitalPoint) {
      // Sharp, piercing sound for vital point hits
      await this.generateTone(freq, duration, "square", volume, {
        attack: 0.005,
        decay: 0.05,
        sustain: 0.6,
        release: 0.135,
      });
    } else {
      await this.generateTone(freq, duration, "sawtooth", volume);
    }
  }

  public static async playComboSound(comboCount: number): Promise<void> {
    // Rising pitch sequence for combo hits
    for (let i = 0; i < Math.min(comboCount, 5); i++) {
      setTimeout(async () => {
        const freq = 400 + i * 100;
        const volume = Math.min(0.4, 0.1 + i * 0.05);
        await this.generateTone(freq, 0.08, "triangle", volume);
      }, i * 80);
    }
  }
}

// Export singleton instance
export const defaultSoundGenerator = DefaultSoundGenerator;
