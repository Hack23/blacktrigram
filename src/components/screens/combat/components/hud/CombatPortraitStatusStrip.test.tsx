import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createMockPlayerState } from "../../../../../test/test-utils";
import { CombatPortraitStatusStrip } from "./CombatPortraitStatusStrip";

describe("CombatPortraitStatusStrip", () => {
  it("renders both players' HP and stamina fills", () => {
    const p1 = createMockPlayerState({
      id: "p1",
      health: 75,
      maxHealth: 100,
      stamina: 60,
      maxStamina: 100,
    });
    const p2 = createMockPlayerState({
      id: "p2",
      health: 30,
      maxHealth: 100,
      stamina: 80,
      maxStamina: 100,
    });

    const { getByTestId } = render(
      <CombatPortraitStatusStrip
        width={375}
        height={812}
        player1={p1}
        player2={p2}
        positionScale={1}
        topOffset={60}
      />,
    );

    expect(getByTestId("combat-portrait-status-strip")).toBeInTheDocument();
    expect(getByTestId("combat-portrait-p1")).toBeInTheDocument();
    expect(getByTestId("combat-portrait-p2")).toBeInTheDocument();

    const p1Hp = getByTestId("combat-portrait-p1-hp-fill");
    const p2Hp = getByTestId("combat-portrait-p2-hp-fill");
    const p1Sp = getByTestId("combat-portrait-p1-sp-fill");
    const p2Sp = getByTestId("combat-portrait-p2-sp-fill");

    expect((p1Hp as HTMLElement).style.width).toBe("75%");
    expect((p2Hp as HTMLElement).style.width).toBe("30%");
    expect((p1Sp as HTMLElement).style.width).toBe("60%");
    expect((p2Sp as HTMLElement).style.width).toBe("80%");
  });

  it("clamps HP/stamina to 0-100% on invalid values", () => {
    const p1 = createMockPlayerState({
      id: "p1",
      health: -10, // lower bound
      maxHealth: 100,
      stamina: 200, // upper bound
      maxStamina: 100,
    });
    const p2 = createMockPlayerState({ id: "p2" });

    const { getByTestId } = render(
      <CombatPortraitStatusStrip
        width={320}
        height={568}
        player1={p1}
        player2={p2}
        positionScale={1}
        topOffset={50}
      />,
    );

    expect(
      (getByTestId("combat-portrait-p1-hp-fill") as HTMLElement).style.width,
    ).toBe("0%");
    expect(
      (getByTestId("combat-portrait-p1-sp-fill") as HTMLElement).style.width,
    ).toBe("100%");
  });

  it("positions itself at the provided top offset so it does not overlap the top HUD", () => {
    const p1 = createMockPlayerState({ id: "p1" });
    const p2 = createMockPlayerState({ id: "p2" });

    const { getByTestId } = render(
      <CombatPortraitStatusStrip
        width={375}
        height={812}
        player1={p1}
        player2={p2}
        positionScale={1}
        topOffset={72}
      />,
    );

    const strip = getByTestId(
      "combat-portrait-status-strip",
    ) as HTMLDivElement;
    expect(strip.style.top).toBe("72px");
    expect(strip.style.position).toBe("absolute");
    // pointer-events none so it cannot block touches on the arena below it
    expect(strip.style.pointerEvents).toBe("none");
  });
});
