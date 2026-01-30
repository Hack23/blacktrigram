/**
 * Tests for Combo Animations Module
 *
 * Validates multi-hit combination attacks and chain sequences:
 * - Boxing combos (권투 콤보)
 * - Kickboxing combos (킥복싱 콤보)
 * - Knee/Elbow combos (무릎팔꿈치 콤보)
 * - Traditional martial arts combos (전통무술 콤보)
 *
 * @module systems/animation/__tests__/ComboAnimations
 * @korean 콤보애니메이션테스트
 */

import { describe, expect, it } from "vitest";
import {
  COMBO_ANIMATIONS,
  COMBO_BODY_HEAD_ANIMATION,
  COMBO_CLINCH_GEUPSO_ANIMATION,
  COMBO_CLINCH_KNEE_ELBOW_ANIMATION,
  COMBO_DOUBLE_JAB_CROSS_ANIMATION,
  COMBO_DOUBLE_KNEE_ANIMATION,
  COMBO_ELBOW_CHAIN_ANIMATION,
  COMBO_GUNGDO_GEUPSO_ANIMATION,
  COMBO_HAPKIDO_FLOW_ANIMATION,
  COMBO_HOOK_UPPERCUT_ANIMATION,
  COMBO_HWARANG_BICHEON_ANIMATION,
  COMBO_JAB_LOW_KICK_ANIMATION,
  COMBO_KICK_PUNCH_KICK_ANIMATION,
  COMBO_KNEE_ELBOW_KNEE_ANIMATION,
  COMBO_KNOCKOUT_ANIMATION,
  COMBO_KUKSOOL_CRANE_ANIMATION,
  COMBO_KUKSOOL_DRAGON_ANIMATION,
  COMBO_KUKSOOL_HOSHIN_ANIMATION,
  COMBO_KUKSOOL_JOKSUL_ANIMATION,
  COMBO_KUKSOOL_KWANJYEL_ANIMATION,
  COMBO_KUKSOOL_NAKBUP_ANIMATION,
  COMBO_KUKSOOL_SNAKE_ANIMATION,
  COMBO_KUKSOOL_SUKI_ANIMATION,
  COMBO_KUKSOOL_TIGER_ANIMATION,
  COMBO_KUKSOOL_TOOKI_ANIMATION,
  COMBO_LOW_HIGH_KICK_ANIMATION,
  COMBO_ONE_TWO_ANIMATION,
  COMBO_ONE_TWO_HOOK_ANIMATION,
  COMBO_ONE_TWO_KICK_ANIMATION,
  COMBO_QUESTION_MARK_FINISH_ANIMATION,
  COMBO_SPINNING_DESTRUCTION_ANIMATION,
  COMBO_SSIREUM_MECHI_ANIMATION,
  COMBO_SUBAK_CHAIN_ANIMATION,
  COMBO_SWITCH_KICK_ANIMATION,
  COMBO_TAEKKYEON_HWALGAE_ANIMATION,
  COMBO_TAEKKYEON_POOM_ANIMATION,
  COMBO_TAEKWONDO_TRIPLE_ANIMATION,
  COMBO_TEUKGONG_COUNTER_ANIMATION,
  COMBO_YUDO_COUNTER_ANIMATION,
} from "./ComboAnimations";

describe("ComboAnimations", () => {
  describe("Boxing Combos (권투 콤보)", () => {
    describe("COMBO_ONE_TWO_ANIMATION (원투콤보)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_ONE_TWO_ANIMATION).toBeDefined();
        expect(COMBO_ONE_TWO_ANIMATION.name).toBe("combo_one_two");
        expect(COMBO_ONE_TWO_ANIMATION.koreanName).toBe("원투콤보");
      });

      it("should have valid duration", () => {
        expect(COMBO_ONE_TWO_ANIMATION.duration).toBe(0.4);
        expect(typeof COMBO_ONE_TWO_ANIMATION.duration).toBe("number");
      });

      it("should not be looping", () => {
        expect(COMBO_ONE_TWO_ANIMATION.loop).toBe(false);
      });

      it("should have at least 4 keyframes for jab-cross combo", () => {
        expect(COMBO_ONE_TWO_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(
          4,
        );
      });
    });

    describe("COMBO_ONE_TWO_HOOK_ANIMATION (원투훅)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_ONE_TWO_HOOK_ANIMATION).toBeDefined();
        expect(COMBO_ONE_TWO_HOOK_ANIMATION.koreanName).toBe("원투훅");
      });

      it("should have longer duration than one-two", () => {
        expect(COMBO_ONE_TWO_HOOK_ANIMATION.duration).toBeGreaterThan(
          COMBO_ONE_TWO_ANIMATION.duration,
        );
      });

      it("should have at least 5 keyframes for three-punch combo", () => {
        expect(
          COMBO_ONE_TWO_HOOK_ANIMATION.keyframes.length,
        ).toBeGreaterThanOrEqual(5);
      });
    });

    describe("COMBO_DOUBLE_JAB_CROSS_ANIMATION (더블잽크로스)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_DOUBLE_JAB_CROSS_ANIMATION).toBeDefined();
        expect(COMBO_DOUBLE_JAB_CROSS_ANIMATION.koreanName).toBe(
          "더블잽크로스",
        );
      });

      it("should have valid duration", () => {
        expect(COMBO_DOUBLE_JAB_CROSS_ANIMATION.duration).toBe(0.5);
      });
    });

    describe("COMBO_BODY_HEAD_ANIMATION (바디헤드콤보)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_BODY_HEAD_ANIMATION).toBeDefined();
        expect(COMBO_BODY_HEAD_ANIMATION.koreanName).toBe("바디헤드콤보");
      });
    });

    describe("COMBO_HOOK_UPPERCUT_ANIMATION (훅어퍼컷)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_HOOK_UPPERCUT_ANIMATION).toBeDefined();
        expect(COMBO_HOOK_UPPERCUT_ANIMATION.koreanName).toBe("훅어퍼컷");
      });

      it("should have valid duration", () => {
        expect(COMBO_HOOK_UPPERCUT_ANIMATION.duration).toBe(0.45);
      });
    });
  });

  describe("Kickboxing Combos (킥복싱 콤보)", () => {
    describe("COMBO_ONE_TWO_KICK_ANIMATION (원투킥)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_ONE_TWO_KICK_ANIMATION).toBeDefined();
        expect(COMBO_ONE_TWO_KICK_ANIMATION.koreanName).toBe("원투킥");
      });

      it("should have longer duration for kick combo", () => {
        expect(COMBO_ONE_TWO_KICK_ANIMATION.duration).toBe(0.6);
        expect(COMBO_ONE_TWO_KICK_ANIMATION.duration).toBeGreaterThan(
          COMBO_ONE_TWO_ANIMATION.duration,
        );
      });
    });

    describe("COMBO_KICK_PUNCH_KICK_ANIMATION (킥펀치킥)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_KICK_PUNCH_KICK_ANIMATION).toBeDefined();
        expect(COMBO_KICK_PUNCH_KICK_ANIMATION.koreanName).toBe("킥펀치킥");
      });

      it("should have valid duration", () => {
        expect(COMBO_KICK_PUNCH_KICK_ANIMATION.duration).toBe(0.7);
      });
    });

    describe("COMBO_LOW_HIGH_KICK_ANIMATION (로우하이킥)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_LOW_HIGH_KICK_ANIMATION).toBeDefined();
        expect(COMBO_LOW_HIGH_KICK_ANIMATION.koreanName).toBe("로우하이킥");
      });
    });

    describe("COMBO_SWITCH_KICK_ANIMATION (스위치킥콤보)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_SWITCH_KICK_ANIMATION).toBeDefined();
        expect(COMBO_SWITCH_KICK_ANIMATION.koreanName).toBe("스위치킥콤보");
      });
    });

    describe("COMBO_JAB_LOW_KICK_ANIMATION (잽로우킥)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_JAB_LOW_KICK_ANIMATION).toBeDefined();
        expect(COMBO_JAB_LOW_KICK_ANIMATION.koreanName).toBe("잽로우킥");
      });
    });
  });

  describe("Knee/Elbow Combos (무릎팔꿈치 콤보)", () => {
    describe("COMBO_CLINCH_KNEE_ELBOW_ANIMATION (클린치니엘보)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_CLINCH_KNEE_ELBOW_ANIMATION).toBeDefined();
        expect(COMBO_CLINCH_KNEE_ELBOW_ANIMATION.koreanName).toBe(
          "클린치니엘보",
        );
      });

      it("should have valid duration", () => {
        expect(COMBO_CLINCH_KNEE_ELBOW_ANIMATION.duration).toBe(0.6);
      });
    });

    describe("COMBO_DOUBLE_KNEE_ANIMATION (더블니스트라이크)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_DOUBLE_KNEE_ANIMATION).toBeDefined();
        expect(COMBO_DOUBLE_KNEE_ANIMATION.koreanName).toBe("더블니스트라이크");
      });
    });

    describe("COMBO_ELBOW_CHAIN_ANIMATION (엘보체인)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_ELBOW_CHAIN_ANIMATION).toBeDefined();
        expect(COMBO_ELBOW_CHAIN_ANIMATION.koreanName).toBe("엘보체인");
      });
    });

    describe("COMBO_KNEE_ELBOW_KNEE_ANIMATION (니엘보니)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_KNEE_ELBOW_KNEE_ANIMATION).toBeDefined();
        expect(COMBO_KNEE_ELBOW_KNEE_ANIMATION.koreanName).toBe("니엘보니");
      });
    });
  });

  describe("Traditional Martial Arts Combos (전통무술 콤보)", () => {
    describe("COMBO_TAEKWONDO_TRIPLE_ANIMATION (태권도삼중발차기)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_TAEKWONDO_TRIPLE_ANIMATION).toBeDefined();
        expect(COMBO_TAEKWONDO_TRIPLE_ANIMATION.koreanName).toBe(
          "태권도삼중발차기",
        );
      });

      it("should have valid duration for triple kick", () => {
        expect(COMBO_TAEKWONDO_TRIPLE_ANIMATION.duration).toBe(0.7);
      });
    });

    describe("COMBO_TAEKKYEON_POOM_ANIMATION (택견품밟기)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_TAEKKYEON_POOM_ANIMATION).toBeDefined();
        expect(COMBO_TAEKKYEON_POOM_ANIMATION.koreanName).toBe("택견품밟기");
      });
    });

    describe("COMBO_SUBAK_CHAIN_ANIMATION (수박연환)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_SUBAK_CHAIN_ANIMATION).toBeDefined();
        expect(COMBO_SUBAK_CHAIN_ANIMATION.koreanName).toBe("수박연환");
      });
    });

    describe("COMBO_HAPKIDO_FLOW_ANIMATION (합기도흐름)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_HAPKIDO_FLOW_ANIMATION).toBeDefined();
        expect(COMBO_HAPKIDO_FLOW_ANIMATION.koreanName).toBe("합기도흐름");
      });
    });

    describe("COMBO_YUDO_COUNTER_ANIMATION (유도반격)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_YUDO_COUNTER_ANIMATION).toBeDefined();
        expect(COMBO_YUDO_COUNTER_ANIMATION.koreanName).toBe("유도반격");
      });
    });
  });

  describe("Korean Grappling Combos (한국 유술 콤보)", () => {
    describe("COMBO_SSIREUM_MECHI_ANIMATION (씨름메치기)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_SSIREUM_MECHI_ANIMATION).toBeDefined();
        expect(COMBO_SSIREUM_MECHI_ANIMATION.koreanName).toBe("씨름메치기");
      });

      it("should have valid duration for throw sequence", () => {
        expect(COMBO_SSIREUM_MECHI_ANIMATION.duration).toBe(0.8);
      });
    });

    describe("COMBO_TEUKGONG_COUNTER_ANIMATION (특공반격)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_TEUKGONG_COUNTER_ANIMATION).toBeDefined();
        expect(COMBO_TEUKGONG_COUNTER_ANIMATION.koreanName).toBe("특공반격");
      });
    });

    describe("COMBO_CLINCH_GEUPSO_ANIMATION (궁도급소)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_CLINCH_GEUPSO_ANIMATION).toBeDefined();
        expect(COMBO_CLINCH_GEUPSO_ANIMATION.koreanName).toBe("궁도급소");
      });
    });

    describe("COMBO_HWARANG_BICHEON_ANIMATION (화랑비천)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_HWARANG_BICHEON_ANIMATION).toBeDefined();
        expect(COMBO_HWARANG_BICHEON_ANIMATION.koreanName).toBe("화랑비천");
      });
    });

    describe("COMBO_TAEKKYEON_HWALGAE_ANIMATION (택견활개)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_TAEKKYEON_HWALGAE_ANIMATION).toBeDefined();
        expect(COMBO_TAEKKYEON_HWALGAE_ANIMATION.koreanName).toBe("택견활개");
      });
    });
  });

  describe("Kuk Sool Won Combos (국술원 콤보)", () => {
    describe("COMBO_KUKSOOL_SUKI_ANIMATION (국술수기)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_KUKSOOL_SUKI_ANIMATION).toBeDefined();
        expect(COMBO_KUKSOOL_SUKI_ANIMATION.koreanName).toBe("국술수기");
      });
    });

    describe("COMBO_KUKSOOL_JOKSUL_ANIMATION (국술족술)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_KUKSOOL_JOKSUL_ANIMATION).toBeDefined();
        expect(COMBO_KUKSOOL_JOKSUL_ANIMATION.koreanName).toBe("국술족술");
      });
    });

    describe("COMBO_KUKSOOL_TOOKI_ANIMATION (국술투기)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_KUKSOOL_TOOKI_ANIMATION).toBeDefined();
        expect(COMBO_KUKSOOL_TOOKI_ANIMATION.koreanName).toBe("국술투기");
      });
    });

    describe("COMBO_KUKSOOL_KWANJYEL_ANIMATION (국술관절술)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_KUKSOOL_KWANJYEL_ANIMATION).toBeDefined();
        expect(COMBO_KUKSOOL_KWANJYEL_ANIMATION.koreanName).toBe("국술관절술");
      });
    });

    describe("COMBO_KUKSOOL_NAKBUP_ANIMATION (국술낙법)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_KUKSOOL_NAKBUP_ANIMATION).toBeDefined();
        expect(COMBO_KUKSOOL_NAKBUP_ANIMATION.koreanName).toBe("국술낙법");
      });
    });

    describe("COMBO_KUKSOOL_HOSHIN_ANIMATION (국술호신술)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_KUKSOOL_HOSHIN_ANIMATION).toBeDefined();
        expect(COMBO_KUKSOOL_HOSHIN_ANIMATION.koreanName).toBe("국술호신술");
      });
    });

    describe("COMBO_KUKSOOL_TIGER_ANIMATION (국술범형)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_KUKSOOL_TIGER_ANIMATION).toBeDefined();
        expect(COMBO_KUKSOOL_TIGER_ANIMATION.koreanName).toBe("국술범형");
      });
    });

    describe("COMBO_KUKSOOL_CRANE_ANIMATION (국술학형)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_KUKSOOL_CRANE_ANIMATION).toBeDefined();
        expect(COMBO_KUKSOOL_CRANE_ANIMATION.koreanName).toBe("국술학형");
      });
    });

    describe("COMBO_KUKSOOL_DRAGON_ANIMATION (국술용형)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_KUKSOOL_DRAGON_ANIMATION).toBeDefined();
        expect(COMBO_KUKSOOL_DRAGON_ANIMATION.koreanName).toBe("국술용형");
      });
    });

    describe("COMBO_KUKSOOL_SNAKE_ANIMATION (국술사형)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_KUKSOOL_SNAKE_ANIMATION).toBeDefined();
        expect(COMBO_KUKSOOL_SNAKE_ANIMATION.koreanName).toBe("국술사형");
      });
    });
  });

  describe("Finisher Combos (마무리 콤보)", () => {
    describe("COMBO_KNOCKOUT_ANIMATION (녹아웃콤보)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_KNOCKOUT_ANIMATION).toBeDefined();
        expect(COMBO_KNOCKOUT_ANIMATION.koreanName).toBe("녹아웃콤보");
      });
    });

    describe("COMBO_SPINNING_DESTRUCTION_ANIMATION (회전파괴)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_SPINNING_DESTRUCTION_ANIMATION).toBeDefined();
        expect(COMBO_SPINNING_DESTRUCTION_ANIMATION.koreanName).toBe(
          "회전파괴",
        );
      });
    });

    describe("COMBO_QUESTION_MARK_FINISH_ANIMATION (물음표마무리)", () => {
      it("should be defined with correct properties", () => {
        expect(COMBO_QUESTION_MARK_FINISH_ANIMATION).toBeDefined();
        expect(COMBO_QUESTION_MARK_FINISH_ANIMATION.koreanName).toBe(
          "물음표마무리",
        );
      });
    });
  });

  describe("COMBO_ANIMATIONS Map", () => {
    it("should be defined and be a Map", () => {
      expect(COMBO_ANIMATIONS).toBeDefined();
      expect(COMBO_ANIMATIONS).toBeInstanceOf(Map);
    });

    it("should contain all combo animations", () => {
      expect(COMBO_ANIMATIONS.size).toBeGreaterThanOrEqual(35);
    });

    it("should contain animations with Korean names", () => {
      const values = Array.from(COMBO_ANIMATIONS.values());
      values.forEach((animation) => {
        expect(animation.koreanName).toBeDefined();
        expect(typeof animation.koreanName).toBe("string");
        expect(animation.koreanName.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Animation Quality Standards", () => {
    const allCombos = [
      COMBO_ONE_TWO_ANIMATION,
      COMBO_ONE_TWO_HOOK_ANIMATION,
      COMBO_TAEKWONDO_TRIPLE_ANIMATION,
      COMBO_SSIREUM_MECHI_ANIMATION,
      COMBO_KUKSOOL_TIGER_ANIMATION,
    ];

    it("should have keyframes with valid time values", () => {
      allCombos.forEach((animation) => {
        animation.keyframes.forEach((kf) => {
          expect(kf.time).toBeGreaterThanOrEqual(0);
          expect(kf.time).toBeLessThanOrEqual(animation.duration);
        });
      });
    });

    it("should have first keyframe at time 0", () => {
      allCombos.forEach((animation) => {
        expect(animation.keyframes[0].time).toBe(0);
      });
    });

    it("should not be looping", () => {
      allCombos.forEach((animation) => {
        expect(animation.loop).toBe(false);
      });
    });

    it("should have minimum duration for visibility", () => {
      allCombos.forEach((animation) => {
        expect(animation.duration).toBeGreaterThanOrEqual(0.4);
      });
    });

    it("should have reasonable keyframe counts", () => {
      allCombos.forEach((animation) => {
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(3);
        expect(animation.keyframes.length).toBeLessThanOrEqual(30);
      });
    });
  });

  describe("Performance Requirements", () => {
    it("should have durations suitable for real-time gameplay", () => {
      const allCombos = Array.from(COMBO_ANIMATIONS.values());
      allCombos.forEach((animation) => {
        expect(animation.duration).toBeLessThanOrEqual(1.5);
      });
    });
  });
});
